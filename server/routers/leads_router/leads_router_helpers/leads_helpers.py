from models.call_history import CallHistory as TortoiseCallHistory
from models.leads import Leads as TortoiseLead
from datetime import datetime, timezone, timedelta
from schemas.call_history import CallHistorySchema
from schemas.leads import LeadSchema
from fastapi import HTTPException
from typing import List
from tortoise.expressions import Q

async def create_new_call_history(request_json, user_data):
    try:
        # Validate the request data using the Pydantic schema
        phone_history_data = CallHistorySchema(**request_json)  # Validate and parse the input data

        # Prepare data for the Lead model (Tortoise ORM model)
        new_call_history = await TortoiseCallHistory.create(
            call_history=phone_history_data.call_status,
            phone_number=phone_history_data.phone_number,
            creator=user_data["username"],  # Creator is the currently logged-in user
            assignee=phone_history_data.assignee or "",  # If assignee is not provided, set it to an empty string
            date_created=datetime.now(timezone.utc),  # Automatically set to current UTC time
            date_modified=datetime.now(timezone.utc),  # Automatically set to current UTC time
        )
        return {"message": "Lead created successfully", "lead_id": new_call_history.id}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating lead: {str(e)}")

async def create_new_lead(request_json, user_data):
    try:
        # Validate the request data using the Pydantic schema
        print(f"request json: {request_json}")
        lead_data = CallHistorySchema(**request_json)  # Validate and parse the input data

        # Prepare data for the Lead model (Tortoise ORM model)
        new_lead = await TortoiseLead.create(
            lead_status="New Lead",
            phone_number=lead_data.phone_number,
            creator=user_data["username"],  # Creator is the currently logged-in user
            assignee=lead_data.assignee or "",  # If assignee is not provided, set it to an empty string
            date_created=datetime.now(timezone.utc),  # Automatically set to current UTC time
            date_modified=datetime.now(timezone.utc),  # Automatically set to current UTC time
        )
        return {"message": "Lead created successfully", "lead_id": new_lead.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating lead: {str(e)}")

# Function to get lead history based on phone_number
async def leads_history(phone_number: str) -> List[dict]:
    try:
        # Query the database to get the leads associated with the phone number
        leads = await TortoiseLead.filter(phone_number=phone_number).all()

        # Convert the query results into a list of dictionaries
        lead_history = [{
            "id": lead.id,
            "lead_status": lead.lead_status,
            "phone_number": lead.phone_number,
            "creator": lead.creator,
            "assignee": lead.assignee,
            "date_created": lead.date_created,
            "date_modified": lead.date_modified
        } for lead in leads]

        return lead_history  # Return a list of dictionaries

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching lead history: {str(e)}")

# Function to get lead history based on phone_number
async def call_history(phone_number: str) -> List[dict]:
    try:
        # Query the database to get the leads associated with the phone number
        leads = await TortoiseCallHistory.filter(phone_number=phone_number).all()

        # Convert the query results into a list of dictionaries
        call_history = [{
            "id": lead.id,
            "call_history": lead.call_history,
            "phone_number": lead.phone_number,
            "creator": lead.creator,
            "assignee": lead.assignee,
            "date_created": lead.date_created,
            "date_modified": lead.date_modified
        } for lead in leads]

        return call_history  # Return a list of dictionaries

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching lead history: {str(e)}")    

# Utility function to apply filters
async def apply_filters(query, filters: dict):
    """
    Apply filters to the query.
    :param query: The initial query to apply filters to.
    :param filters: The dictionary of filters to apply.
    :return: The filtered query.
    """
    if filters:
        try:
            if filters.get("code") and filters["code"] != "Any":
                query = query.filter(id=filters["code"])  # Assuming "code" is the ID for the lead
            if filters.get("date and time") and filters["date and time"] != "Any":
                parsed_date = datetime.strptime(filters["date and time"], "%Y-%m-%dT%H:%M:%S.%fZ").date() + timedelta(days=1)
                query = query.filter(date_created__gte=parsed_date)  # Filter by date (start date as an example)
            if filters.get("startDate") and filters["startDate"] != "Any":
                start_date = datetime.strptime(filters["startDate"], "%Y-%m-%dT%H:%M:%S.%fZ")
                query = query.filter(date_created__gte=start_date)  # Filter by start date
            if filters.get("stage") and filters["stage"] != "Any":
                query = query.filter(lead_status=filters["stage"])  # Filter by lead status (or stage)
            if filters.get("contact") and filters["contact"] != "Any":
                query = query.filter(Q(phone_number__icontains=filters["contact"]))  # Filter by contact (phone number)
            if filters.get("creator") and filters["creator"] != "Any":
                query = query.filter(creator=filters["creator"])  # Filter by creator
            if filters.get("assignee") and filters["assignee"] != "Any":
                query = query.filter(assignee=filters["assignee"])  # Filter by assignee
        except Exception as error:
            raise HTTPException(status_code=400, detail=f"Error applying filters: {str(error)}")
    
    return query


async def workout_statistics(filters):
    # List of lead statuses to query
    lead_statuses = [
        "In Progress", "To Call Back", "Unreachable", "Future Callback", 
        "Not Interested - Call", "Meeting Set", "Meeting To Re-Set", 
        "2nd Meeting to Set", "2nd Meeting Set", "Closed", "Not Interested - Meeting",
        "New Lead"
    ]
    statistics = {}
    
    for lead_status in lead_statuses:
        # Start with a query filtered by the current lead status
        query = TortoiseLead.filter(lead_status=lead_status)
        
        # Apply filters dynamically
        query = await apply_filters(query, filters)
        
        # Count leads for the current status with filters applied
        lead_status_count = await query.count()
        statistics[lead_status] = lead_status_count
    
    print(f"Filtered statistics: {statistics}")
    return statistics

