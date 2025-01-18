# models/user.py
from tortoise import fields
from tortoise.models import Model

class PunchClock(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=50)
    shift_start = fields.DatetimeField(auto_now_add=True) 
    shift_end = fields.DatetimeField(null=True)


    def __str__(self):
       return f"PunchClock(id={self.id}, username={self.username})"
