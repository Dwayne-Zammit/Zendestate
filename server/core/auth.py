# auth/auth.py
from passlib.context import CryptContext
from fastapi import HTTPException
import jwt
import datetime
from typing import Union
from tortoise.exceptions import IntegrityError
from starlette.requests import Request
from models.user import User as TortoiseUser

# Secret key and algorithm for JWT
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Password hashing context
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Function to hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Function to verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Function to create JWT token
def create_access_token(data: dict, expires_delta: Union[datetime.timedelta, None] = None):
    expire = datetime.datetime.now(datetime.timezone.utc) + (expires_delta or datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Function to verify and decode token
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_data = verify_token(token)
    return user_data

from fastapi import HTTPException
from models.user import User as TortoiseUser  # Assuming User model is in models.user
from core.auth import verify_token  # Assuming verify_token is imported

async def ensure_user_is_authenticated(token: str):
    """
    Ensures that the user is authenticated by verifying the token.
    If valid, it fetches the user from the database.
    """
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing or expired")

    # Verify and decode the token
    try:
        user_data = verify_token(token)  # Assuming you have a verify_token function to decode and verify JWT
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # Fetch user details from the database using username from the token
    try:
        user = await TortoiseUser.get(username=user_data['sub'])  # Using await for async DB query
    except TortoiseUser.DoesNotExist:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return the username of the authenticated user
    return {"username": user.username}

    
# Function to blacklist token after user deletion (optional)
async def blacklist_token(token: str):
    try:
        # This is an example of adding token to a blacklist (use a real DB or cache in a production setup)
        # Implement database table for blacklisted tokens if needed
        # Example: await TokenBlacklist.create(token=token)
        pass
    except IntegrityError:
        pass  # Ignore if already exists in the blacklist
