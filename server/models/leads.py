from typing import Optional
from datetime import datetime
from tortoise import fields
from tortoise.models import Model

class Leads(Model):
    id = fields.IntField(pk=True)  # Primary key field for the lead
    creator = fields.CharField(max_length=50)  # Username of the creator
    assignee = fields.CharField(max_length=50, null=True)  # Username of the assignee (optional)
    lead_status = fields.CharField(max_length=50)  # The status of the lead (e.g., 'callback', 'interested', etc.)
    contact_name = fields.CharField(max_length=50)
    phone_number = fields.CharField(max_length=15)  # Phone number associated with the lead
    notes = fields.TextField()  # Notes associated with the lead
    age = fields.IntField()  # Age of the lead contact
    country = fields.CharField(max_length=100)  # Country of the lead
    locality_of_meeting = fields.CharField(max_length=255, null=True)  # Locality where the meeting happened (optional)
    email = fields.CharField(max_length=100, null=True)  # Email of the lead (optional)
    occupation = fields.CharField(max_length=100, null=True)  # Occupation of the lead (optional)
    has_partner = fields.BooleanField(default=False)  # Whether the lead has a partner (boolean field)
    interestedProducts = fields.TextField(null=True)  # Products the lead is interested in (optional)
    tracking_source = fields.CharField(max_length=255, null=True)  # Tracking source for the lead (optional)
    date_created = fields.DatetimeField(auto_now_add=True)  # Automatically set on creation
    date_modified = fields.DatetimeField(auto_now=True)  # Automatically updated on each modification

    def __str__(self):
        return f"Lead ID: {self.id}, Status: {self.lead_status}, Creator: {self.creator}, Country: {self.country}"

