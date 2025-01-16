from tortoise import fields
from tortoise.models import Model

class Leads(Model):
    id = fields.IntField(pk=True)  # Primary key field for the lead
    creator = fields.CharField(max_length=50)  # Username of the creator
    assignee = fields.CharField(max_length=50, null=True)  # Username of the assignee
    lead_status = fields.CharField(max_length=50)  # The status of the lead (e.g., 'callback', 'interested', etc.)
    phone_number = fields.CharField(max_length=15)  # Phone number associated with the lead
    date_created = fields.DatetimeField(auto_now_add=True)  # Automatically set on creation
    date_modified = fields.DatetimeField(auto_now=True)     # Automatically updated on each modification

    def __str__(self):
        return f"Lead ID: {self.id}, Status: {self.lead_status}, Creator: {self.creator}"

