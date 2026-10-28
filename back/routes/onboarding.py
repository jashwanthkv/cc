import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional

from services.storage_service import save_user
from services.resume_parser import parse_resume

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])


@router.post("/submit")
async def submit_onboarding(
    name: str = Form(...),
    year: str = Form(...),
    department: str = Form(...),
    stream: Optional[str] = Form(None),
    time_weeks: Optional[int] = Form(None),
    level: Optional[str] = Form(None),
    resume: Optional[UploadFile] = File(None),
):
    # Validation: at least one of domain OR resume must be provided
    has_domain = stream and time_weeks and level
    has_resume = resume is not None

    if not has_domain and not has_resume:
        raise HTTPException(
            status_code=400,
            detail="At least one of (domain info OR resume) must be provided."
        )

    resume_text = None
    resume_filename = None

    if resume:
        file_bytes = await resume.read()
        resume_filename = resume.filename
        try:
            resume_text = parse_resume(file_bytes, resume_filename)
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Failed to parse resume: {e}")

    user_id = str(uuid.uuid4())

    user_data = {
        "name": name,
        "year": year,
        "department": department,
        "domain": {
            "stream": stream,
            "time_weeks": time_weeks,
            "level": level,
        } if has_domain else None,
        "resume_text": resume_text,
        "resume_filename": resume_filename,
    }

    save_user(user_id, user_data)

    return {
        "user_id": user_id,
        "name": name,
        "has_domain": bool(has_domain),
        "has_resume": bool(has_resume),
        "message": "Onboarding complete!",
    }
