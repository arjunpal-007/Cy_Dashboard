from fastapi import APIRouter
from app.api.v1 import dashboard, alerts, logs, auth, ai

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
api_router.include_router(logs.router, prefix="/logs", tags=["Logs"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])

__all__ = ["api_router"]
