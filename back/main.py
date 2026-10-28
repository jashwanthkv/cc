import sys
import os

# Ensure back/ is on the path so imports work correctly
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routes.onboarding import router as onboarding_router
from routes.learning_path import router as learning_path_router
from routes.resume import router as resume_router
from routes.interview import router as interview_router

app = FastAPI(
    title="CareerCraft AI API",
    description="AI-powered career assistant: learning paths, resume analysis, mock interviews.",
    version="1.0.0",
)

# Allow all origins for local dev — tighten in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(onboarding_router)
app.include_router(learning_path_router)
app.include_router(resume_router)
app.include_router(interview_router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "CareerCraft AI backend is running.",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
