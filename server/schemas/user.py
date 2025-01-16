# app/schemas/user.py
from pydantic import BaseModel

class UserSchema (BaseModel):
    username: str
    email: str
    password: str
    role: str = "user"  # Default to 'user' if not specified

class LoginRequest(BaseModel):
    username: str
    password: str

class DeleteUserRequest(BaseModel):
    user_id: int