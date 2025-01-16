# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.user_router import user_router
from db.database import init_db
from routers.auth_router import auth_router
from routers.number_generator_router import number_generator
from routers.leads_router import leads_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, adjust for production!
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Initialize the database connection
init_db(app)

# Include routers
app.include_router(user_router.router, prefix="/users", tags=["users"])
app.include_router(auth_router.router, prefix="/auth", tags=["auth"])
app.include_router(number_generator.router, prefix="/assisted_dialer", tags=["assisted_dialer"])
app.include_router(leads_router.router, prefix="/leads", tags=["leads_router"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application!"}
