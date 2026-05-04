import json
from functools import lru_cache
from pathlib import Path
from typing import List, Optional, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings

# Always load backend/.env regardless of process cwd (uvicorn/npm may start from repo root).
_BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    # Project Configuration
    PROJECT_NAME: str = "SentinelX"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Enterprise Cybersecurity Platform"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    BCRYPT_ROUNDS: int = 12
    SESSION_EXPIRE_HOURS: int = 24
    
    # Database Configuration
    DATABASE_URL: Optional[str] = "sqlite:///./sentinelx.db"
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: int = 5432
    DATABASE_NAME: str = "sentinelx"
    DATABASE_USER: str = "postgres"
    DATABASE_PASSWORD: str = "password"
    
    @validator("DATABASE_URL", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: dict) -> str:
        if isinstance(v, str) and v != "":
            return v
        
        # If no DATABASE_URL is provided, use Postgres as fallback only if host is set
        if values.get('DATABASE_HOST') and values.get('DATABASE_USER'):
            return (
                f"postgresql://{values.get('DATABASE_USER')}:"
                f"{values.get('DATABASE_PASSWORD')}@"
                f"{values.get('DATABASE_HOST')}:"
                f"{values.get('DATABASE_PORT')}/"
                f"{values.get('DATABASE_NAME')}"
            )
        return "sqlite:///./sentinelx.db"
    
    # Redis Configuration
    REDIS_URL: Optional[str] = None
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    
    @validator("REDIS_URL", pre=True)
    def assemble_redis_connection(cls, v: Optional[str], values: dict) -> str:
        if isinstance(v, str):
            return v
        return (
            f"redis://{values.get('REDIS_HOST')}:"
            f"{values.get('REDIS_PORT')}/"
            f"{values.get('REDIS_DB')}"
        )
    
    # CORS Configuration (include 127.0.0.1 and LAN IP; browsers send exact Origin)
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://169.254.83.107:3000",
        "https://sentinelx.com",
    ]
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str):
            s = v.strip()
            if s.startswith("["):
                try:
                    return json.loads(s)
                except json.JSONDecodeError:
                    pass
            return [i.strip() for i in s.split(",") if i.strip()]
        return v
    
    # WebSocket Configuration
    WEBSOCKET_PATH: str = "/ws"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    # Detection Engine
    DETECTION_ENGINE_ENABLED: bool = True
    DETECTION_RULES_PATH: str = "./detection_rules/"
    THREAT_INTEL_UPDATE_INTERVAL: int = 3600
    
    # SOAR Configuration
    SOAR_ENABLED: bool = True
    SOAR_PLAYBOOKS_PATH: str = "./soar_playbooks/"
    SOAR_MAX_CONCURRENT_EXECUTIONS: int = 10
    
    # Monitoring
    METRICS_ENABLED: bool = True
    HEALTH_CHECK_INTERVAL: int = 30

    class Config:
        env_file = str(_BACKEND_ROOT / ".env")
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
