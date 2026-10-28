import os
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv

load_dotenv()

_llm = None


def get_llm() -> ChatGroq:
    global _llm
    if _llm is None:
        _llm = ChatGroq(
            model="openai/gpt-oss-120b",
            api_key=os.getenv("GROQ_API_KEY"),
            temperature=0.7,
            max_tokens=4096,
        )
    return _llm


def chat(system_prompt: str, user_prompt: str) -> str:
    llm = get_llm()
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt),
    ]
    response = llm.invoke(messages)
    return response.content


# ─────────────────────────────────────────────
# Prompt templates
# ─────────────────────────────────────────────

def generate_learning_path(stream: str, level: str, time_weeks: int,
                            year: str, department: str,
                            tavily_context: str) -> str:
    system = (
        "You are an expert career coach and curriculum designer. "
        "if user is employee then suggest in way that helps them to get promotion. for studet and for employee the results should be differnet, example for students how toget placement is focus for employee getting promotions. "
        "for students which projects to do in the requested domain,which skills match current trend, cs basics hwo to learn, how much like that for employees based on there project and domain of intrest and trend suggest."
        "Generate a detailed, structured, week-by-week learning roadmap. "
        "Use markdown formatting with clear headings, bullet points, and emojis. "
        "Be specific — include real resource names (courses, docs, GitHub repos, YouTube channels). "
        "Always end with 3 capstone project ideas."
    )
    user = f"""
Create a {time_weeks}-week learning roadmap for:
- Stream/Domain: {stream}
- Level: {level}
- College Year: {year}
- Department: {department}

Here is fresh online context to base recommendations on:
{tavily_context}

Structure the output as:
1. Overview & Goals
2. Week-by-week breakdown (each week: topics, resources, mini-task)
3. Core skills checklist
4. Capstone project ideas (3 ideas)
5. Pro tips for this domain
"""
    return chat(system, user)


def analyze_resume(resume_text: str, domain: dict | None) -> str:
    domain_context = ""
    if domain:
        domain_context = f"Target domain: {domain.get('stream')} at {domain.get('level')} level."

    system = (
        "You are a senior technical recruiter and career advisor with 15+ years of experience. "
        "Provide an honest, detailed, and constructive resume critique. "
        "Use markdown formatting with clear sections. "
        "Be specific — cite actual resume content in your feedback."
    )
    user = f"""
Analyze this resume thoroughly:

{resume_text}

{domain_context}

Provide feedback in these exact sections:
## ATS Score (out of 100)
Estimated score and why.

## Strengths
What's working well (be specific).

## Gaps & Weaknesses
Missing skills, thin descriptions, red flags.

## Project Feedback
For each project: depth assessment, impact clarity, phrasing improvements.

## Keyword Suggestions
Top 10 keywords to add for the target domain.

## Formatting & Structure Tips
Concrete formatting improvements.

## Action Plan
Top 5 immediate action items ranked by priority.
"""
    return chat(system, user)


def generate_interview_questions(resume_text: str | None, domain: dict | None,
                                  name: str, department: str) -> str:
    context_parts = []
    if resume_text:
        context_parts.append(f"Resume:\n{resume_text}")
    if domain:
        context_parts.append(f"Target domain: {domain.get('stream')} at {domain.get('level')} level.")

    context = "\n\n".join(context_parts) if context_parts else f"Student in {department}"

    system = (
        "You are an experienced technical interviewer. "
        "Generate a realistic, challenging, and diverse set of interview questions. "
        "Return ONLY a valid JSON array — no markdown, no explanation. "
        "Each object must have: 'question', 'category', 'difficulty'."
    )
    user = f"""
Generate exactly 10 interview questions for {name} ({department}).

Context:
{context}

Categories to include (2-3 questions each):
- project_based: Questions about specific projects on the resume
- technical: Core concept / coding questions
- what_if: Scenario-based questions
- behavioral: Why/how questions about decisions and approach
- skills: Questions probing listed skills

Return ONLY this JSON format:
[
  {{"question": "...", "category": "project_based", "difficulty": "medium"}},
  ...
]
"""
    return chat(system, user)


def evaluate_answer(question: str, answer: str, category: str,
                     domain_context: str) -> str:
    system = (
        "You are a technical interviewer evaluating a candidate's answer. "
        "Be fair but honest. Return ONLY valid JSON — no markdown."
    )
    user = f"""
Question: {question}
Category: {category}
Domain context: {domain_context}
Candidate's answer: {answer}

Evaluate and return ONLY this JSON:
{{
  "score": <integer 1-10>,
  "verdict": "<Excellent|Good|Average|Needs Improvement>",
  "feedback": "<2-3 sentence specific feedback>",
  "ideal_answer": "<what a great answer would include>"
}}
"""
    return chat(system, user)


def generate_interview_summary(name: str, qa_pairs: list) -> str:
    qa_text = "\n\n".join([
        f"Q: {pair['question']}\nA: {pair['answer']}\nScore: {pair.get('score', 'N/A')}/10\nFeedback: {pair.get('feedback', '')}"
        for pair in qa_pairs
    ])

    system = (
        "You are a senior interviewer writing a post-interview assessment report. "
        "Use markdown formatting with clear sections."
    )
    user = f"""
Write a comprehensive interview performance report for {name}.

Interview Q&A summary:
{qa_text}

Include these sections:
## 🏆 Overall Score & Verdict
## 💪 Top Strengths Demonstrated
## 📉 Areas to Improve
## 🎯 Recommended Next Steps
## 💡 Final Advice
"""
    return chat(system, user)
