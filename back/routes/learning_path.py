from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from models.schemas import LearningPathRequest
from services.storage_service import get_user, update_user
from services.tavily_service import search_learning_resources
from services.groq_service import generate_learning_path

router = APIRouter(prefix="/learning-path", tags=["Learning Path"])


@router.post("/generate")
async def generate_path(req: LearningPathRequest):
    user = get_user(req.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    domain = user.get("domain")
    if not domain or not domain.get("stream"):
        raise HTTPException(
            status_code=400,
            detail="Domain info is required to generate a learning path. Please go back and add domain details."
        )

    stream = domain["stream"]
    level = domain["level"]
    time_weeks = domain["time_weeks"]
    year = user["year"]
    department = user["department"]

    # Fetch live resources from Tavily
    try:
        tavily_context = search_learning_resources(stream, level, year)
    except Exception as e:
        tavily_context = f"(Live search unavailable: {e})"

    # Generate roadmap via Groq
    roadmap = generate_learning_path(
        stream=stream,
        level=level,
        time_weeks=time_weeks,
        year=year,
        department=department,
        tavily_context=tavily_context,
    )

    # Cache the result
    update_user(req.user_id, {"learning_path": roadmap})

    return {
        "user_id": req.user_id,
        "stream": stream,
        "level": level,
        "time_weeks": time_weeks,
        "roadmap": roadmap,
    }


@router.get("/cached/{user_id}")
async def get_cached_path(user_id: str):
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    cached = user.get("learning_path")
    if not cached:
        raise HTTPException(status_code=404, detail="No cached learning path. Please generate one first.")
    return {"user_id": user_id, "roadmap": cached}
