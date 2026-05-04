from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Text
from sqlalchemy.sql import func
from app.models.database import Base
import enum
import uuid


class ThreatType(str, enum.Enum):
    SQL_INJECTION = "SQLi"
    XSS = "XSS"
    BRUTE_FORCE = "brute_force"
    DDOS = "ddos"
    MALWARE = "malware"
    PHISHING = "phishing"
    IMPOSSIBLE_TRAVEL = "impossible_travel"
    ANOMALOUS_LOGIN = "anomalous_login"
    DATA_EXFILTRATION = "data_exfiltration"
    PRIVILEGE_ESCALATION = "privilege_escalation"
    SUSPICIOUS_ACTIVITY = "suspicious_activity"


class Detection(Base):
    __tablename__ = "detections"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    log_id = Column(String(36), ForeignKey("logs.id"), nullable=False, index=True)
    rule_triggered = Column(String(255), nullable=False)
    threat_type = Column(String(50), nullable=False, index=True)
    risk_score = Column(Integer, nullable=False, index=True)  # 1-100
    description = Column(Text, nullable=True)
    source_ip = Column(String(45), nullable=True, index=True)
    target_ip = Column(String(45), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Detection(id={self.id}, threat_type={self.threat_type}, risk_score={self.risk_score})>"
