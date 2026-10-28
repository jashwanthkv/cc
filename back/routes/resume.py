from fastapi import APIRouter, HTTPException

from models.schemas import ResumeAnalysisRequest
from services.storage_service import get_user, update_user
from services.groq_service import analyze_resume

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/analyze")
async def analyze(req: ResumeAnalysisRequest):
    user = get_user(req.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    resume_text = user.get("resume_text")
    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="No resume found for this user. Please go back and upload your resume."
        )

    domain = user.get("domain")

    analysis = analyze_resume(resume_text=resume_text, domain=domain)

    # Cache the result
    update_user(req.user_id, {"resume_analysis": analysis})

    return {
        "user_id": req.user_id,
        "resume_filename": user.get("resume_filename"),
        "analysis": analysis,
    }


@router.get("/cached/{user_id}")
async def get_cached_analysis(user_id: str):
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    cached = user.get("resume_analysis")
    if not cached:
        raise HTTPException(status_code=404, detail="No cached analysis. Please analyze first.")
    return {
        "user_id": user_id,
        "resume_filename": user.get("resume_filename"),
        "analysis": cached,
    }
