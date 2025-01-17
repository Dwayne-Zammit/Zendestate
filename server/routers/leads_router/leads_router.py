from fastapi import APIRouter, HTTPException, Body
from starlette.requests import Request
from routers.leads_router.leads_router_helpers.leads_helpers import create_new_lead, create_new_call_history, apply_filters, workout_statistics
from core.auth import ensure_user_is_authenticated
from models.leads import Leads as TortoiseLead
from models.call_history import CallHistory as TortoiseCallHistory

router = APIRouter()


@router.post("/new_call_history")
async def new_call_history(request: Request):
    token = request.cookies.get("access_token")
    user_data = await ensure_user_is_authenticated(token)
    
    # try:
    request_json = await request.json()  # Parse the request body to JSON
    print(f"Parsed JSON: {request_json}")  # Debug print to inspect the incoming data
    # Pass the parsed JSON to create_new_lead
    create_new_lead_result = await create_new_call_history(request_json, user_data)
    print(f"Request_json below: {request_json}")
    # if "interested" in str(request_json["call_status"]).lower():
    #     print("creating new lead")
    #     await create_new_lead(request_json, user_data)
    return create_new_lead_result  # Return the result of the lead creation

    # except Exception as e:
    #     raise HTTPException(status_code=400, detail=f"Error processing request: {str(e)}")


@router.post("/new_lead")
async def create_lead(request: Request):
    """
    Create a new lead.
    """
    # Extract token from cookies
    token = request.cookies.get("access_token")
    
    # Ensure user is authenticated
    user_data = await ensure_user_is_authenticated(token)
    # Read the request body and parse it as JSON
    # try:
    request_json = await request.json()  # Parse the request body to JSON
    print(f"Parsed JSON: {request_json}")  # Debug print to inspect the incoming data
    # Pass the parsed JSON to create_new_lead
    create_new_lead_result = await create_new_lead(request_json, user_data)
    
    return create_new_lead_result  # Return the result of the lead creation

    # except Exception as e:
    #     raise HTTPException(status_code=400, detail=f"Error processing request: {str(e)}")


@router.get("/lead_history")
async def get_lead_history(request: Request):
    """
    Get the lead history based on a phone number.
    """
    # Extract token from cookies
    token = request.cookies.get("access_token")
    
    # Ensure user is authenticated
    user_data = await ensure_user_is_authenticated(token)

    try:
        # Extract phone number from the request
        request_json = await request.json()
        phone_number = request_json.get("phone_number")

        if not phone_number:
            raise HTTPException(status_code=400, detail="Phone number is required.")

        # Query the database to find all leads with the given phone_number
        leads = await TortoiseLead.filter(phone_number=phone_number).all()

        if not leads:
            raise HTTPException(status_code=404, detail="No leads found for this phone number")

        # Prepare the result by converting the leads to a list of dictionaries
        lead_history = [
            {
                "id": lead.id,
                "lead_status": lead.lead_status,
                "phone_number": lead.phone_number,
                "creator": lead.creator,
                "assignee": lead.assignee,
                "date_created": lead.date_created,
                "date_modified": lead.date_modified,
            } for lead in leads
        ]

        return {"message": "Lead history retrieved successfully", "lead_history": lead_history}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching lead history: {str(e)}")


@router.post("/all_leads")
async def get_all_leads(
    request: Request,
    pagination: dict = Body(...),
):
    # Extract token from cookies
    token = request.cookies.get("access_token")
    
    # Ensure user is authenticated
    await ensure_user_is_authenticated(token)

    # Extract pagination and filter details
    number_of_rows = pagination.get("number_of_rows")
    page_number = pagination.get("page_number")
    filters = pagination.get("filters")

    # Validate `page_number`
    if not isinstance(page_number, int) or page_number <= 0:
        raise HTTPException(status_code=400, detail="Invalid or missing page_number")

    # Handle `number_of_rows` being "infinity"
    if number_of_rows == 0:
        number_of_rows = None  # Indicates no limit on the number of rows
    elif not isinstance(number_of_rows, int) or number_of_rows <= 0:
        raise HTTPException(status_code=400, detail="Invalid or missing number_of_rows")

    # Create a query set with an initial condition to get all leads
    query = TortoiseLead.all().order_by('-date_created')  # Sorting by date_created (descending order)
    statistics = await workout_statistics(filters)
    query = await apply_filters(query, filters)

    # Get the total leads after applying filters
    total_leads = await query.all()
    if not total_leads:
        return {
            "message": "No leads found",
            "total_leads_count": 0,
            "page_number": page_number,
            "number_of_rows": number_of_rows if number_of_rows else "infinity",
            "leads": [],
            "statistics": statistics
        }

    # Calculate pagination
    total_leads_count = len(total_leads)
    if number_of_rows:  # If a finite number of rows is specified
        start_index = (page_number - 1) * number_of_rows
        end_index = start_index + number_of_rows
        leads_for_page = total_leads[start_index:end_index]
    else:  # Handle "infinity" case by returning all leads
        leads_for_page = total_leads

    # Prepare the result
    paginated_leads = [
        {
            "id": lead.id,
            "lead_status": lead.lead_status,
            "phone_number": lead.phone_number,
            "creator": lead.creator,
            "contact_name": lead.contact_name,
            "assignee": lead.assignee,
            "date_created": lead.date_created,
            "date_modified": lead.date_modified,
        }
        for lead in leads_for_page
    ]
    return {
        "message": "Leads retrieved successfully",
        "total_leads_count": total_leads_count,
        "page_number": page_number,
        "number_of_rows": number_of_rows if number_of_rows else "infinity",
        "leads": paginated_leads,
        "statistics": statistics
    }


@router.post("/update_leads")
async def update_leads(request: Request):
    """
    Update the lead based on the provided lead_code, assignee, and lead_status.
    """
    # Extract token from cookies
    token = request.cookies.get("access_token")
    
    # Ensure user is authenticated
    user_data = await ensure_user_is_authenticated(token)
    request_json = await request.json()
    print(request_json)
    # try:
    # Extract data from the request
    request_json = await request.json()
    lead_code = request_json.get("code")
    assignee = request_json.get("assignee")
    lead_status = request_json.get("status")
    print("out")
    if not lead_code:
        raise HTTPException(status_code=400, detail="Lead code is required.")
    # if not assignee:
    #     raise HTTPException(status_code=400, detail="Assignee is required.")
    if not lead_status:
        raise HTTPException(status_code=400, detail="Lead status is required.")
    # Query the database to find the lead by lead_code
    lead = await TortoiseLead.get_or_none(id=lead_code)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found.")
    print(f"lead {lead}")
    # Update the lead's assignee and status
    lead.assignee = assignee
    lead.lead_status = lead_status
    # Save the changes
    await lead.save()
    return {"message": "Lead updated successfully", "lead": {
        "id": lead.id,
        "lead_status": lead.lead_status,
        "phone_number": lead.phone_number,
        "creator": lead.creator,
        "assignee": lead.assignee,
        "date_created": lead.date_created,
        "date_modified": lead.date_modified,
    }}

    # except Exception as e:
    #     raise HTTPException(status_code=400, detail=f"Error updating lead: {str(e)}")


@router.get("/lead_creators")
async def get_lead_creators(request: Request):
    token = request.cookies.get("access_token")
    await ensure_user_is_authenticated(token)
    try:
        creators = await TortoiseLead.all().distinct().values_list("creator", flat=True)
        if not creators:
            raise HTTPException(status_code=404, detail="No creators found")
        return {"creators": creators}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching creators: {str(e)}")


@router.get("/lead_assignees")
async def get_lead_creators(request: Request):
    token = request.cookies.get("access_token")
    await ensure_user_is_authenticated(token)
    try:
        assignees = await TortoiseLead.all().distinct().values_list("assignee", flat=True)
        if not assignees:
            raise HTTPException(status_code=404, detail="No assignees found")
        assignees = [assignee for assignee in assignees if len(assignee) > 0]
        return {"assignees": assignees}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching assignees: {str(e)}")



@router.post("/call_history_reports")
async def call_history_reports(
    request: Request,
    pagination: dict = Body(...),
):
    # Extract token from cookies
    token = request.cookies.get("access_token")
    
    # Ensure user is authenticated
    await ensure_user_is_authenticated(token)
    filters = pagination.get("pagination", {}).get("filters", {})
    print(filters)
    # Create a query set with an initial condition to get all leads
    query = TortoiseCallHistory.all().order_by('-date_created')  # Sorting by date_created (descending order)
    query = await apply_filters(query, filters)

    # Initialize calls_history as an empty list to ensure it is always defined
    calls_history = []
    
    try:
        # Get the total leads after applying filters
        calls_history = await query.all()
    except Exception as e:
        # Handle any potential query errors
        return {
            "message": f"Error retrieving calls: {str(e)}",
            "total_calls_count": 0,
            "calls": [],
            "calls_history": calls_history,
        }

    # Initialize total_calls_count with 0
    total_calls_count = len(calls_history)

    if not calls_history:
        return {
            "message": "No calls found",
            "total_calls_count": total_calls_count,
            "calls": [],
            "calls_history": calls_history
        }

    # Prepare the result
    paginated_calls = [
        {
            "id": call.id,
            "call_status": call.call_history,
            "phone_number": call.phone_number,
            "creator": call.creator,
            "assignee": call.assignee,
            "date_created": call.date_created,
            "date_modified": call.date_modified,
        }
        for call in calls_history
    ]

    return {
        "message": "Calls retrieved successfully",
        "total_calls_count": total_calls_count,
        "calls": paginated_calls,
    }
