# app/routers/user_router.py
from fastapi import APIRouter, HTTPException
from fastapi.security import OAuth2PasswordBearer
from core.auth import verify_token
from models.user import User as TortoiseUser
from starlette.requests import Request
from routers.number_generator_router.helpers.number_generator_helpers import generate_random_phone_number


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.post("/generatePhoneNumber")
async def read_current_user(request: Request):
    """
    Route to return the current authenticated user's details.
    Token is extracted from the access_token cookie.
    """
    # Extract token from cookies
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing or expired")

    # Verify and decode the token
    try:
        user_data = verify_token(token)  # Assuming you have a verify_token function to decode and verify JWT
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # Fetch user details from the database using username from the token
    try:
        user = await TortoiseUser.get(username=user_data['sub'])
    except TortoiseUser.DoesNotExist:
        raise HTTPException(status_code=404, detail="User not found")

    generated_number_body = await generate_random_phone_number()
    return generated_number_body