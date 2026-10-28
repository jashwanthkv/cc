# ?? CareerCraft AI � Project Plan

> AI-powered career assistant: Learning Path Generator + Resume Analyzer + Mock Interviewer

---

## ?? Overview

A full-stack web application where users input their **resume** and/or **domain of interest** to receive:
- A personalized **learning roadmap** (fetched live via Tavily)
- Deep **resume analysis** with actionable feedback
- A **mock interview** session powered by Groq LLM

At least one input (resume OR domain) is **mandatory**.

---

## ?? Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | vite react js     |
| Backend      | Python (FastAPI)                    |
| LLM          | Groq API via langchain-groq         |
| Web Search   | Tavily API (for live learning paths)|
| Storage      | Local JSON file (key-value by user ID) |
| Environment  | .env for API keys                   |

---

## ??? Project Structure

\\\
cc/
+-- .env
+-- PLAN.md
+-- backend/
�   +-- main.py
�   +-- routes/
�   �   +-- onboarding.py
�   �   +-- learning_path.py
�   �   +-- resume.py
�   �   +-- interview.py
�   +-- services/
�   �   +-- groq_service.py
�   �   +-- tavily_service.py
�   �   +-- resume_parser.py
�   �   +-- storage_service.py
�   +-- models/
�   �   +-- schemas.py
�   +-- data/
�       +-- users.json
+-- frontend/
�   +-- index.html
�   +-- onboarding.html
�   +-- dashboard.html
�   +-- learning-path.html
�   +-- resume-feedback.html
�   +-- mock-interview.html
�   +-- css/
�   �   +-- style.css
�   +-- js/
�       +-- api.js
�       +-- onboarding.js
�       +-- learning-path.js
�       +-- resume.js
�       +-- interview.js
+-- requirements.txt
\\\

---

## ?? UI Theme

- Background: #0a0a0f (near black)
- Surface: #12111a (dark card)
- Primary: #7c3aed (purple-600)
- Accent: #a855f7 (purple-400)
- Effects: Glassmorphism cards, purple glow on hover, smooth transitions
- Font: Inter (Google Fonts)
- Icons: Lucide Icons (CDN)

---

## ?? User Flow

Landing Page ? Onboarding Form ? Dashboard Hub
  +-- Learning Path   ? Tavily fetch ? Groq synthesize ? Roadmap UI
  +-- Resume Feedback ? Parse resume ? Groq analyze ? Report
  +-- Mock Interview  ? Groq Qs ? Chat UI ? Evaluation

---

## ?? Functional Modules

### 1. Onboarding
- Name, College Year (1st-4th), Department/Branch
- Domain: Stream, Time available (weeks), Level (Beginner/Intermediate/Advanced)
- Resume upload: PDF or plain text
- Validation: at least one of (domain OR resume) required
- Generate UUID ? store in users.json

### 2. Learning Path Generator
- Tavily searches: "best resources for {stream} {level} {year} student"
- Groq synthesizes into week-by-week roadmap with topics, resources, milestones

### 3. Resume Analysis
- Extract text via pdfplumber
- Groq outputs: Strengths, Gaps, Project feedback, ATS score, Keywords, Formatting tips

### 4. Mock Interview
- Groq generates: project-based, core skills, technical, what-if, behavioral questions
- Chat UI: one question at a time, user answers, Groq evaluates + scores
- Session ends with overall summary

---

## ?? Local Storage Schema (users.json)

{
  "uuid-1234": {
    "name": "Ravi",
    "year": "3rd Year",
    "department": "CSE",
    "domain": { "stream": "ML", "time_weeks": 8, "level": "Intermediate" },
    "resume_text": "..extracted text..",
    "resume_filename": "ravi_resume.pdf",
    "created_at": "2026-10-28T11:18:58"
  }
}

---

## ?? .env

GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here

---

## ?? requirements.txt

fastapi, uvicorn, python-dotenv, langchain, langchain-groq,
langchain-community, tavily-python, pdfplumber, python-multipart, pydantic

---

## ?? Build Phases

Phase 1 � Setup & Skeleton
  - .env template, FastAPI app, users.json storage, onboarding form + API

Phase 2 � Learning Path
  - Tavily integration, Groq roadmap prompt, timeline UI

Phase 3 � Resume Analysis
  - PDF parser, Groq analysis prompt, report UI

Phase 4 � Mock Interview
  - Question generation, chat UI, answer evaluation, session summary

Phase 5 � Polish
  - Streaming, loading animations, navigation, error handling

---

## ?? Groq Prompt Strategy

| Feature         | System Role        | Output                              |
|-----------------|--------------------|-------------------------------------|
| Learning Path   | Career Coach       | Week-by-week structured roadmap     |
| Resume Analysis | Senior Recruiter   | Full critique with ATS score        |
| Interview Qs    | Tech Interviewer   | 10 categorized questions            |
| Answer Eval     | Interviewer        | Score + feedback + ideal answer     |

---

> Next step: Say 'build it' and Phase 1 begins � project scaffold, .env, FastAPI backend, onboarding UI.
