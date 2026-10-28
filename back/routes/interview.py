import json
from fastapi import APIRouter, HTTPException

from models.schemas import InterviewStartRequest, InterviewAnswerRequest, InterviewSummaryRequest
from services.storage_service import get_user, update_user
from services.groq_service import (
    generate_interview_questions,
    evaluate_answer,
    generate_interview_summary,
)

router = APIRouter(prefix="/interview", tags=["Mock Interview"])


@router.post("/start")
async def start_interview(req: InterviewStartRequest):
    """Generate and return 10 interview questions for the user."""
    user = get_user(req.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    resume_text = user.get("resume_text")
    domain = user.get("domain")

    if not resume_text and not domain:
        raise HTTPException(
            status_code=400,
            detail="At least a resume or domain info is needed to generate interview questions."
        )

    raw = generate_interview_questions(
        resume_text=resume_text,
        domain=domain,
        name=user["name"],
        department=user["department"],
    )

    # Parse JSON from Groq response
    try:
        # Strip markdown code fences if present
        clean = raw.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        questions = json.loads(clean.strip())
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse questions from LLM. Raw: {raw[:300]}"
        )

    # Cache questions
    update_user(req.user_id, {"interview_questions": questions, "interview_session": []})

    return {
        "user_id": req.user_id,
        "total_questions": len(questions),
        "questions": questions,
    }


@router.post("/evaluate")
async def evaluate(req: InterviewAnswerRequest):
    """Evaluate a single answer and return feedback."""
    user = get_user(req.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    domain = user.get("domain")
    domain_context = f"{domain['stream']} at {domain['level']} level" if domain else user["department"]

    # Find the category for this question
    questions = user.get("interview_questions", [])
    category = "general"
    if req.question_index < len(questions):
        category = questions[req.question_index].get("category", "general")

    raw_eval = evaluate_answer(
        question=req.question,
        answer=req.answer,
        category=category,
        domain_context=domain_context,
    )

    # Parse JSON evaluation
    try:
        clean = raw_eval.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        evaluation = json.loads(clean.strip())
    except json.JSONDecodeError:
        evaluation = {
            "score": 0,
            "verdict": "Parsing Error",
            "feedback": raw_eval[:300],
            "ideal_answer": "Could not parse ideal answer.",
        }

    # Append to session log
    session = user.get("interview_session", [])
    session.append({
        "question_index": req.question_index,
        "question": req.question,
        "answer": req.answer,
        "category": category,
        **evaluation,
    })
    update_user(req.user_id, {"interview_session": session})

    return {
        "user_id": req.user_id,
        "question_index": req.question_index,
        **evaluation,
    }


@router.post("/summary")
async def summary(req: InterviewSummaryRequest):
    """Generate an overall interview performance report."""
    user = get_user(req.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Use stored session if no qa_pairs passed
    qa_pairs = req.qa_pairs if req.qa_pairs else user.get("interview_session", [])

    if not qa_pairs:
        raise HTTPException(status_code=400, detail="No interview session data found.")

    report = generate_interview_summary(name=user["name"], qa_pairs=qa_pairs)

    update_user(req.user_id, {"interview_report": report})

    return {
        "user_id": req.user_id,
        "name": user["name"],
        "total_questions": len(qa_pairs),
        "report": report,
    }


@router.get("/session/{user_id}")
async def get_session(user_id: str):
    """Get the current interview session data."""
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return {
        "user_id": user_id,
        "questions": user.get("interview_questions", []),
        "session": user.get("interview_session", []),
        "report": user.get("interview_report"),
    }
