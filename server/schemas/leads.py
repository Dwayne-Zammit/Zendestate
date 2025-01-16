from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LeadSchema(BaseModel):
    lead_status: str
    phone_number: str
    creator: Optional[str] = None  # Optional, as it will be set server-side
    assignee: Optional[str] = None  # Optional if you want to assign it later or default to None
    date_created: Optional[datetime] = None
    date_modified: Optional[datetime] = None

    class Config:
        from_attributes = True  # Use from_attributes for Pydantic v2
