import logging
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.log import Log

logger = logging.getLogger(__name__)

class AIModelService:
    """Service for AI-based anomaly detection"""
    
    def __init__(self):
        self.model_path = "app/services/models/anomaly_detector.joblib"
        self.model = None
        self.is_trained = False
        self.last_trained = None
        self.feature_columns = ['status_code', 'method_code', 'payload_size', 'hour', 'day_of_week']
        
        # Ensure model directory exists
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        self.load_model()
    
    def load_model(self):
        """Load the trained model from disk"""
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                self.is_trained = True
                self.last_trained = datetime.fromtimestamp(os.path.getmtime(self.model_path))
                logger.info("AI model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load AI model: {e}")
        else:
            logger.info("No AI model found, training required")

    def _prepare_features(self, logs: List[Log]) -> pd.DataFrame:
        """Convert Log objects to a feature DataFrame"""
        data = []
        for log in logs:
            # Map HTTP methods to integers
            method_map = {'GET': 1, 'POST': 2, 'PUT': 3, 'DELETE': 4, 'PATCH': 5}
            method_code = method_map.get(log.method.upper(), 0)
            
            # Estimate payload size
            payload_size = len(str(log.payload)) if log.payload else 0
            
            # Time features
            dt = log.created_at
            
            data.append({
                'status_code': log.status_code,
                'method_code': method_code,
                'payload_size': payload_size,
                'hour': dt.hour,
                'day_of_week': dt.weekday()
            })
            
        return pd.DataFrame(data)

    async def train(self, db: Session):
        """Train the model on historical logs"""
        logger.info("Starting AI model training...")
        
        # Fetch last 10,000 logs for training
        logs = db.query(Log).order_by(Log.created_at.desc()).limit(10000).all()
        
        if len(logs) < 50:
            logger.warning("Not enough logs to train AI model (need at least 50)")
            return False
            
        df = self._prepare_features(logs)
        
        # Initialize and train Isolation Forest
        # contamination='auto' or a small float like 0.05
        self.model = IsolationForest(contamination=0.05, random_state=42)
        self.model.fit(df)
        
        # Save model
        joblib.dump(self.model, self.model_path)
        self.is_trained = True
        self.last_trained = datetime.utcnow()
        
        logger.info(f"AI model trained successfully on {len(logs)} logs")
        return True

    def predict(self, log_data: Dict[str, Any]) -> float:
        """
        Predict if a log is anomalous.
        Returns a score: 1 for normal, -1 for anomaly.
        """
        if not self.is_trained or self.model is None:
            return 1.0 # Default to normal if not trained
            
        # Map method
        method_map = {'GET': 1, 'POST': 2, 'PUT': 3, 'DELETE': 4, 'PATCH': 5}
        method_code = method_map.get(log_data.get('method', '').upper(), 0)
        
        # Payload size
        payload_size = len(str(log_data.get('payload'))) if log_data.get('payload') else 0
        
        # Time features
        dt = datetime.utcnow() # Real-time prediction uses current time
        
        features = pd.DataFrame([{
            'status_code': log_data.get('status_code', 200),
            'method_code': method_code,
            'payload_size': payload_size,
            'hour': dt.hour,
            'day_of_week': dt.weekday()
        }])
        
        # Isolation Forest returns 1 for inliers, -1 for outliers
        prediction = self.model.predict(features)[0]
        return float(prediction)

# Global AI service instance
ai_service = AIModelService()
