from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chat_route import router as chat_router
from app.services.timetable_service import load_timetable_data
from app.services.subject_service import load_subject_data
from app.db import test_db_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("\n====================================")
    print(">>> Initializing CampusGPT FastAPI Backend...")
    test_db_connection()
    load_timetable_data()
    load_subject_data()
    print("[OK] Initialization Complete.")
    print("====================================\n")
    yield
    # Shutdown logic (if any)

app = FastAPI(
    title="CampusGPT (UniVerse) API",
    description="Python FastAPI backend for CampusGPT University Assistant",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(chat_router)

@app.get("/")
def root():
    return {"message": "CampusGPT Backend Running (FastAPI) 🚀"}
