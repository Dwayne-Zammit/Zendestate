# db/database.py
from tortoise.contrib.fastapi import register_tortoise
from fastapi import FastAPI

def init_db(app: FastAPI):
    register_tortoise(
        app,
        db_url="postgres://postgres:admin@localhost:5432/Zendestate",
        modules={"models": ["models.user", "models.leads", "models.call_history", "models.punch_clock"]},
        generate_schemas=True,  # Automatically generate schemas
        add_exception_handlers=True,  # Add error handling for database issues
    )
