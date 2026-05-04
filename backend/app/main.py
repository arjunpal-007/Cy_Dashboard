import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.websockets import WebSocket, WebSocketDisconnect
from sqlalchemy.exc import SQLAlchemyError
import json
import uuid

from app.core.config import settings
from app.models.database import Base, engine
from app.api import api_router
from app.services.redis_client import redis_client
from app.services.detection_engine import detection_engine
from app.services.soar_engine import soar_engine

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create database tables (SQLite will create them if they don't exist)
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting SentinelX backend...")
    
    try:
        # Initialize Redis connection (with fallback)
        try:
            await redis_client.connect()
            logger.info("Redis connection established")
        except Exception:
            logger.warning("Redis connection failed - falling back to in-memory mode")
        
        # Start detection engine
        if settings.DETECTION_ENGINE_ENABLED:
            await detection_engine.start()
            logger.info("Detection engine started")
        
        # Start SOAR engine
        if settings.SOAR_ENABLED:
            await soar_engine.start()
            logger.info("SOAR engine started")
        
        logger.info("SentinelX backend started successfully")
        
    except Exception as e:
        logger.error(f"Failed to start backend: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down SentinelX backend...")
    
    try:
        # Stop engines
        if settings.DETECTION_ENGINE_ENABLED:
            await detection_engine.stop()
        if settings.SOAR_ENABLED:
            await soar_engine.stop()
        
        # Close Redis
        try:
            await redis_client.disconnect()
        except:
            pass
            
        logger.info("SentinelX backend shutdown complete")
        
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    # Browsers send Origin without trailing slash; AnyHttpUrl stringifies with trailing "/".
    allow_origins=[
        str(origin).rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

# Add simple auth endpoints for development
@app.get("/api/v1/auth/test")
async def test_auth():
    """Test authentication endpoint"""
    return {"message": "Auth API is working", "status": "ok"}

@app.post("/api/v1/auth/login")
async def login(user_credentials: dict):
    """Simple login endpoint for development"""
    if user_credentials.get("email") == "admin@sentinelx.com" and user_credentials.get("password") == "admin123":
        return {
            "access_token": "dev_token_12345",
            "token_type": "bearer",
            "expires_in": 1800,
            "user": {
                "id": "12345",
                "email": "admin@sentinelx.com",
                "name": "System Administrator",
                "role": "admin",
                "is_active": True
            }
        }
    else:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                logger.error(f"Error sending WebSocket message: {e}")

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = None):
    """WebSocket endpoint for real-time updates"""
    
    # Validate token if provided
    if token:
        try:
            from app.services.auth_service import auth_service
            payload = await auth_service.verify_token(token)
            if not payload:
                await websocket.close(code=1008, reason="Invalid token")
                return
        except Exception as e:
            logger.error(f"WebSocket token validation error: {e}")
            await websocket.close(code=1008, reason="Invalid token")
            return
    
    await manager.connect(websocket)
    
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            
            # Handle client messages if needed
            try:
                message = json.loads(data)
                logger.debug(f"Received WebSocket message: {message}")
                
                # Broadcast real-time events
                if message.get("type") in ["alerts:update", "logs:update", "threats:update", "incidents:update"]:
                    await manager.broadcast(json.dumps(message))
                    
            except json.JSONDecodeError:
                logger.warning(f"Invalid JSON received: {data}")
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)

# Global exception handlers
@app.exception_handler(SQLAlchemyError)
async def database_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal database error"}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check Redis connection (disabled for development)
        # await redis_client.set("health_check", "ok", expire=10)
        redis_status = "disabled (development mode)"
    except Exception:
        redis_status = "unhealthy"
    
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "services": {
            "database": "healthy",
            "redis": redis_status,
            "detection_engine": "running" if settings.DETECTION_ENGINE_ENABLED else "disabled",
            "soar_engine": "running" if settings.SOAR_ENABLED else "disabled"
        }
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "SentinelX API",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health"
    }

# Middleware for request logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests"""
    start_time = asyncio.get_event_loop().time()
    
    response = await call_next(request)
    
    process_time = asyncio.get_event_loop().time() - start_time
    
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.4f}s"
    )
    
    return response

# Run background tasks for WebSocket broadcasting
async def broadcast_redis_messages():
    """Background task to broadcast Redis messages to WebSocket clients"""
    while True:
        try:
            # Subscribe to all Redis channels
            channels = ["logs_channel", "alerts_channel", "threats_channel", "incidents_channel"]
            
            for channel in channels:
                try:
                    pubsub = await redis_client.subscribe(channel)
                    
                    async for message in pubsub.listen():
                        if message["type"] == "message":
                            # Broadcast to all WebSocket clients
                            await manager.broadcast(message["data"])
                
                except Exception as e:
                    logger.error(f"Error in Redis subscription for {channel}: {e}")
                    await asyncio.sleep(5)  # Wait before retrying
        
        except Exception as e:
            logger.error(f"Error in Redis broadcasting: {e}")
            await asyncio.sleep(10)  # Wait before retrying

# Start background task
@app.on_event("startup")
async def startup_event():
    """Start background tasks"""
    asyncio.create_task(broadcast_redis_messages())

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level=settings.LOG_LEVEL.lower()
    )
