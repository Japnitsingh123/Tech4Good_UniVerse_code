from typing import List, Optional, Any, Dict
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: Optional[str] = ""

class DispensaryHour(BaseModel):
    days: str
    times: str

class DispensaryData(BaseModel):
    name: str
    location: str
    hours: List[DispensaryHour]
    phone: str

class CafeteriaData(BaseModel):
    name: str
    menuImageUrl: str
    scannerImageUrl: Optional[str] = None

class SubjectData(BaseModel):
    code: str
    subjectCode: str
    name: str
    credit: str
    isCore: str
    ltp: str
    description: str

class TimetableSlot(BaseModel):
    group: str
    rawGroup: str
    branch: str
    day: str
    time: str
    subject: str
    type: str
    room: str

class TimetableData(BaseModel):
    title: str
    schedule: List[Any]
