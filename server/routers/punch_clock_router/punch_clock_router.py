# app/routers/user_router.py
from fastapi import APIRouter, HTTPException
from fastapi.security import OAuth2PasswordBearer
from core.auth import verify_token
from models.punch_clock import PunchClock
from starlette.requests import Request
from datetime import datetime
import pytz

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.post("/start_shift")
async def start_shift(request: Request):
    # Extract token from cookies
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing or expired")

    # Verify and decode the token
    try:
        user_data = verify_token(token)  # Assuming you have a verify_token function to decode and verify JWT
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # Check if there's already an active shift (shift_end is NULL)
    existing_shift = await PunchClock.filter(username=user_data["sub"], shift_end__isnull=True).first()
    
    if existing_shift:
        # If an active shift exists, raise an error
        raise HTTPException(status_code=400, detail="You already have an active shift.")

    try:
        # If no active shift exists, create a new punch clock entry
        punch_clock = await PunchClock.create(
            username=user_data["sub"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error creating punch clock entry.")

    return punch_clock


@router.post("/end_shift")
async def end_shift(request: Request):
    # Extract token from cookies
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing or expired")

    # Verify and decode the token
    try:
        user_data = verify_token(token)  # Assuming you have a verify_token function to decode and verify JWT
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # Query the PunchClock table to find the entry with `shift_end` as NULL for the user
    punch_clock = await PunchClock.filter(username=user_data["sub"], shift_end__isnull=True).first()
    print(punch_clock)
    if not punch_clock:
        raise HTTPException(status_code=404, detail="No active shift found to end.")

    # Update the shift_end field to the current date and time
    punch_clock.shift_end = datetime.now()
    await punch_clock.save()

    return {"message": "Shift ended successfully", "shift_id": punch_clock.id, "shift_end": punch_clock.shift_end}


@router.post("/check_for_unterminated_shift")
async def check_for_unterminated_shift(request: Request):
    # Extract token from cookies
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing or expired")

    # Verify and decode the token
    try:
        user_data = verify_token(token)  # Assuming you have a verify_token function to decode and verify JWT
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # Check if there is an active shift (shift_end is NULL)
    existing_shift = await PunchClock.filter(username=user_data["sub"], shift_end__isnull=True).first()

    if not existing_shift:
        # No active shift found
        raise HTTPException(status_code=404, detail="No active shift found.")

    # Get shift start (timezone-aware datetime)
    shift_start = existing_shift.shift_start

    # Ensure current time is aware (using the same timezone as shift_start)
    current_time = datetime.now(pytz.UTC)  # Make current_time aware in UTC timezone

    # Calculate elapsed time
    elapsed_time = current_time - shift_start  # Time difference

    # Convert elapsed time to HH:MM format
    hours = elapsed_time.seconds // 3600  # Total hours
    minutes = (elapsed_time.seconds % 3600) // 60  # Remaining minutes
    seconds = elapsed_time.seconds % 60  # Remaining seconds

    # Format as HH:MM:SS
    formatted_time = f"{hours:02}:{minutes:02}:{seconds:02}"

    return {"message": "Active shift found", "elapsed_time": formatted_time}