from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.services.ai_service import ai_service
from typing import Any

router = APIRouter()

@router.post("/train")
async def train_ai(db: Session = Depends(deps.get_db)) -> Any:
    """
    Trigger AI model training on historical logs.
    """
    success = await ai_service.train(db)
    if not success:
        raise HTTPException(status_code=400, detail="Not enough data to train model or training failed")
    
    return {
        "message": "AI model training completed successfully",
        "last_trained": ai_service.last_trained.isoformat() if ai_service.last_trained else None
    }

@router.get("/status")
async def get_ai_status() -> Any:
    """
    Get the current status of the AI model.
    """
    return {
        "is_trained": ai_service.is_trained,
        "last_trained": ai_service.last_trained.isoformat() if ai_service.last_trained else None,
        "model_type": "IsolationForest",
        "features": ai_service.feature_columns
    }
