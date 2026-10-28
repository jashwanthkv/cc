from pydantic import BaseModel
from typing import Optional


class DomainInfo(BaseModel):
    stream: str
    time_weeks: int
    level: str  # Beginner | Intermediate | Advanced


class OnboardingRequest(BaseModel):
    name: str
    year: str           # e.g. "1st Year", "2nd Year" OR years_of_experience for employees
    department: str
    user_type: str = "job_seeker"   # job_seeker | employee
    domain: Optional[DomainInfo] = None
    resume_text: Optional[str] = None
    resume_filename: Optional[str] = None


class OnboardingResponse(BaseModel):
    user_id: str
    message: str


class LearningPathRequest(BaseModel):
    user_id: str


class ResumeAnalysisRequest(BaseModel):
    user_id: str


class InterviewStartRequest(BaseModel):
    user_id: str


class InterviewAnswerRequest(BaseModel):
    user_id: str
    question: str
    answer: str
    question_index: int


class InterviewSummaryRequest(BaseModel):
    user_id: str
    qa_pairs: list  # [{"question": ..., "answer": ..., "evaluation": ...}]
