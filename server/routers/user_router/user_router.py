# app/routers/user_router.py
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from schemas.user import UserSchema
from core.auth import verify_token, create_access_token, blacklist_token
from models.user import User as TortoiseUser
from starlette.requests import Request
from core.auth import hash_password
from schemas.user import DeleteUserRequest

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Dependency to get current user from token
def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_data = verify_token(token)
    return user_data

# Update your delete route to accept a JSON body
@router.delete("/delete")
async def delete_user(request: DeleteUserRequest, current_user: dict = Depends(get_current_user)):
    """
    Delete a user by their ID (from the request body) and invalidate their token.
    """
    user_id = request.user_id

    # Check if the user exists
    try:
        user_to_delete = await TortoiseUser.get(id=user_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent users from deleting themselves
    if current_user["sub"] == user_to_delete.username:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")

    # Invalidate the current user's token (implement blacklist_token if necessary)
    await blacklist_token(current_user["sub"])

    # Delete the user
    await user_to_delete.delete()

    return {"message": f"User {user_to_delete.username} deleted successfully."}


@router.get("/me")
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

    # Return user details (can be extended based on your User model)
    return {
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "id": user.id
    }
