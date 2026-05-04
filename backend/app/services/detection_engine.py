import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models.log import Log
from app.models.detection import Detection, ThreatType
from app.models.alert import Alert, AlertSeverity, AlertStatus
from app.models.threat_intel import ThreatIntel
from app.services.redis_client import redis_client, REDIS_CHANNELS, CACHE_KEYS
from app.core.config import settings
import uuid
import json
import re

logger = logging.getLogger(__name__)

class DetectionRule:
    """Base class for detection rules"""
    
    def __init__(self, name: str, threat_type: ThreatType, risk_score: int):
        self.name = name
        self.threat_type = threat_type
        self.risk_score = risk_score
    
    def check(self, log: Log) -> Optional[Dict[str, Any]]:
        """Check if log matches detection rule"""
        raise NotImplementedError
    
    def create_detection(self, log: Log, details: Dict[str, Any]) -> Detection:
        """Create detection from log and rule details"""
        return Detection(
            log_id=log.id,
            rule_triggered=self.name,
            threat_type=self.threat_type,
            risk_score=self.risk_score,
            description=details.get("description"),
            source_ip=log.ip_address,
            created_at=datetime.utcnow()
        )


class SQLInjectionRule(DetectionRule):
    """SQL Injection detection rule"""
    
    def __init__(self):
        super().__init__(
            "SQL Injection Detection",
            ThreatType.SQL_INJECTION,
            80
        )
        
        # Common SQL injection patterns
        self.patterns = [
            r"(\%27)|(\')|(\-\-)|(\%23)|(#)",
            r"((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))",
            r"\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))",
            r"((\%27)|(\'))union",
            r"exec(\s|\+)+(s|x)p\w+",
            r"UNION.*SELECT",
            r"INSERT.*INTO",
            r"DELETE.*FROM",
            r"DROP.*TABLE"
        ]
    
    def check(self, log: Log) -> Optional[Dict[str, Any]]:
        if not log.payload:
            return None
        
        payload_str = json.dumps(log.payload).lower()
        
        for pattern in self.patterns:
            if re.search(pattern, payload_str, re.IGNORECASE):
                return {
                    "description": f"SQL injection pattern detected: {pattern}",
                    "matched_pattern": pattern,
                    "payload": payload_str
                }
        
        return None


class BruteForceRule(DetectionRule):
    """Brute force attack detection rule"""
    
    def __init__(self):
        super().__init__(
            "Brute Force Detection",
            ThreatType.BRUTE_FORCE,
            70
        )
        self.failed_login_threshold = 5
        self.time_window_minutes = 5
    
    async def check(self, log: Log) -> Optional[Dict[str, Any]]:
        # Check for failed login attempts
        if log.status_code == 401 and "/login" in log.endpoint:
            cache_key = f"brute_force_{log.ip_address}"
            
            # Get recent failed attempts from Redis
            recent_failures = await redis_client.get(cache_key) or 0
            
            # Increment counter
            recent_failures += 1
            await redis_client.set(
                cache_key, 
                recent_failures, 
                expire=self.time_window_minutes * 60
            )
            
            if recent_failures >= self.failed_login_threshold:
                return {
                    "description": f"Brute force attack detected: {recent_failures} failed attempts",
                    "failed_attempts": recent_failures,
                    "time_window": f"{self.time_window_minutes} minutes"
                }
        
        return None


class XSSRule(DetectionRule):
    """Cross-Site Scripting detection rule"""
    
    def __init__(self):
        super().__init__(
            "XSS Detection",
            ThreatType.XSS,
            75
        )
        
        self.patterns = [
            r"<script[^>]*>.*?</script>",
            r"javascript:",
            r"on\w+\s*=",
            r"<iframe[^>]*>",
            r"<object[^>]*>",
            r"<embed[^>]*>",
            r"vbscript:",
            r"onload\s*=",
            r"onerror\s*="
        ]
    
    def check(self, log: Log) -> Optional[Dict[str, Any]]:
        if not log.payload:
            return None
        
        payload_str = json.dumps(log.payload).lower()
        
        for pattern in self.patterns:
            if re.search(pattern, payload_str, re.IGNORECASE):
                return {
                    "description": f"XSS pattern detected: {pattern}",
                    "matched_pattern": pattern,
                    "payload": payload_str
                }
        
        return None


class AnomalyDetectionRule(DetectionRule):
    """AI-based anomaly detection rule"""
    
    def __init__(self):
        super().__init__(
            "AI Anomaly Detection",
            ThreatType.SUSPICIOUS_ACTIVITY,
            65
        )
    
    def check(self, log: Log) -> Optional[Dict[str, Any]]:
        # This rule is called synchronously by the process_log method
        # but we use the ai_service to predict
        from app.services.ai_service import ai_service
        
        log_data = {
            'status_code': log.status_code,
            'method': log.method,
            'payload': log.payload,
            'endpoint': log.endpoint
        }
        
        prediction = ai_service.predict(log_data)
        
        if prediction == -1.0: # Anomaly detected
            return {
                "description": "AI model flagged this log as a behavioral anomaly",
                "prediction_score": prediction,
                "engine": "IsolationForest"
            }
        
        return None


class ThreatIntelRule(DetectionRule):
    """Threat intelligence correlation rule"""
    
    def __init__(self):
        super().__init__(
            "Threat Intelligence Correlation",
            ThreatType.SUSPICIOUS_ACTIVITY,
            60
        )
    
    async def check(self, log: Log) -> Optional[Dict[str, Any]]:
        # Check if IP is in threat intelligence
        cache_key = f"{CACHE_KEYS['THREAT_INTEL']}{log.ip_address}"
        threat_data = await redis_client.get(cache_key)
        
        if threat_data:
            return {
                "description": f"IP {log.ip_address} found in threat intelligence",
                "threat_type": threat_data.get("threat_type"),
                "severity": threat_data.get("severity"),
                "source": threat_data.get("source")
            }
        
        return None


class DetectionEngine:
    """Main detection engine"""
    
    def __init__(self):
        self.rules: List[DetectionRule] = []
        self.is_running = False
        self.load_rules()
    
    def load_rules(self):
        """Load detection rules"""
        self.rules = [
            SQLInjectionRule(),
            BruteForceRule(),
            XSSRule(),
            ThreatIntelRule(),
            AnomalyDetectionRule()
        ]
        logger.info(f"Loaded {len(self.rules)} detection rules")
    
    async def process_log(self, db: Session, log: Log) -> List[Detection]:
        """Process a single log through all detection rules"""
        detections = []
        
        for rule in self.rules:
            try:
                # Check rule (some rules are async)
                if hasattr(rule.check, '__call__'):
                    if asyncio.iscoroutinefunction(rule.check):
                        result = await rule.check(log)
                    else:
                        result = rule.check(log)
                else:
                    continue
                
                if result:
                    detection = rule.create_detection(log, result)
                    detections.append(detection)
                    logger.info(f"Detection created: {detection.threat_type} for {log.ip_address}")
                    
            except Exception as e:
                logger.error(f"Error in detection rule {rule.name}: {e}")
        
        return detections
    
    async def process_logs_batch(self, db: Session, logs: List[Log]) -> List[Detection]:
        """Process multiple logs"""
        all_detections = []
        
        for log in logs:
            detections = await self.process_log(db, log)
            all_detections.extend(detections)
        
        return all_detections
    
    async def create_alerts(self, db: Session, detections: List[Detection]) -> List[Alert]:
        """Create alerts from detections"""
        alerts = []
        
        for detection in detections:
            # Determine alert severity based on risk score
            if detection.risk_score >= 90:
                severity = AlertSeverity.CRITICAL
            elif detection.risk_score >= 70:
                severity = AlertSeverity.HIGH
            elif detection.risk_score >= 50:
                severity = AlertSeverity.MEDIUM
            else:
                severity = AlertSeverity.LOW
            
            alert = Alert(
                detection_id=detection.id,
                severity=severity,
                status=AlertStatus.OPEN,
                title=f"{detection.threat_type} detected",
                description=detection.description,
                source_ip=detection.source_ip,
                created_at=datetime.utcnow()
            )
            
            alerts.append(alert)
        
        # Save alerts to database
        if alerts:
            db.add_all(alerts)
            db.commit()
            
            # Publish alerts to Redis
            for alert in alerts:
                alert_data = {
                    "id": str(alert.id),
                    "severity": alert.severity,
                    "title": alert.title,
                    "description": alert.description,
                    "source_ip": alert.source_ip,
                    "created_at": alert.created_at.isoformat()
                }
                await redis_client.publish(REDIS_CHANNELS["ALERTS"], alert_data)
            
            logger.info(f"Created {len(alerts)} alerts from detections")
        
        return alerts
    
    async def start(self):
        """Start the detection engine"""
        if self.is_running:
            logger.warning("Detection engine is already running")
            return
        
        self.is_running = True
        logger.info("Detection engine started")
        
        # Start background processing
        asyncio.create_task(self._process_logs_loop())
    
    async def stop(self):
        """Stop the detection engine"""
        self.is_running = False
        logger.info("Detection engine stopped")
    
    async def _process_logs_loop(self):
        """Background loop to process logs from Redis"""
        while self.is_running:
            try:
                # Subscribe to logs channel
                pubsub = await redis_client.subscribe(REDIS_CHANNELS["LOGS"])
                
                async for message in pubsub.listen():
                    if message["type"] == "message":
                        try:
                            log_data = json.loads(message["data"])
                            # Process log (this would need database session)
                            logger.info(f"Processing log: {log_data}")
                        except Exception as e:
                            logger.error(f"Error processing log message: {e}")
                
            except Exception as e:
                logger.error(f"Error in detection engine loop: {e}")
                await asyncio.sleep(5)  # Wait before retrying

# Global detection engine instance
detection_engine = DetectionEngine()
