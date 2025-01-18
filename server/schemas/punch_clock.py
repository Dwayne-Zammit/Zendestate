# app/schemas/punch_clock.py
from pydantic import BaseModel
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class PunchClockSchema(BaseModel):
    id: Optional[int]  # ID is optional for creation but will be included for responses
    username: str = Field(..., max_length=50, min_length=3)  # Enforce constraints on username
    shift_start: datetime
    shift_end: Optional[datetime]  # Nullable for scenarios where it's not set yet

    class Config:
        orm_mode = True  # Enable ORM mode for compatibility with Tortoise models