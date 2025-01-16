# app/routers/auth_router.py
from fastapi import APIRouter, HTTPException, Response
from schemas.user import LoginRequest
from core.auth import verify_password, create_access_token  # Updated imports
from models.user import User  # Import the User model from models
from datetime import timedelta
from tortoise.exceptions import DoesNotExist

router = APIRouter()

@router.post("/login")
async def login_user(login_request: LoginRequest, response: Response):
    """
    Log a user in by verifying credentials and generating an access token.
    The token is set as an HttpOnly cookie.
    """
    # Find user by username
    try:
        user = await User.get(username=login_request.username)  # Use the User model here
    except DoesNotExist:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Verify password
    if not verify_password(login_request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Create JWT token
    token_data = {"sub": user.username, "role": user.role}
    jwt_token = create_access_token(data=token_data, expires_delta=timedelta(hours=1))
    
    # Debugging the token
    print(f"Generated Token: {jwt_token}")  # Add this line to inspect token value

    if not jwt_token:  # Additional check for undefined or empty token
        raise HTTPException(status_code=500, detail="Failed to generate JWT token")
    
    # Set JWT token as HttpOnly cookie
    response.set_cookie(
        key="access_token", 
        value=jwt_token, 
        httponly=True,  # Secure flag should be added in production environment
        secure=False,   # Set to True for production
        max_age=3600, 
        samesite="Strict"
    )

    return {"message": "Login successful"}



@router.post("/logout")
async def logout_user(response: Response):
    """
    Logout a user by clearing the access token cookie.
    """
    response.delete_cookie("access_token")
    return {"message": "Logout successful"}
