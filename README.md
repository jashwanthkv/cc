# 🚀 CareerCraft AI

> **Your AI-Powered Career Copilot** — Personalized Learning Roadmap Generator, Deep Resume Critique, and Interactive AI Mock Interviewer.

CareerCraft AI bridges the gap between where you currently stand and where you want your career to go. Whether you're a college student preparing for placements or a working professional aiming for a promotion, CareerCraft AI tailors resources, identifies resume gaps, and conducts realistic mock technical interviews tailored specifically to your background and target domain.

---

## Key Features

### 1. Dynamic Onboarding
- **Role-Aware Pathways**: Supports both **Students** (year-based, placement-focused) and **Employees** (experience-based, promotion/level-up focused).
- **Flexible Profiles**: Submit either your **Domain of Interest** (stream, level, time commitment in weeks), your **Resume** (PDF or TXT), or both for the most customized experience.
- Automatic resume parsing using `pdfplumber` to extract skills, experience, and project details.

### 2. Live Learning Path Generator
- Integrates with the **Tavily Search API** to fetch real-time, trending developer resources, documentation, and tutorials.
- Powered by **Groq (`llama-3.3-70b-versatile`)** to synthesize web insights into a structured, week-by-week curriculum.
- Includes:
  - Weekly topics breakdown and mini-tasks.
  - Curated learning resources (docs, GitHub repos, courses).
  - Core skills checklist.
  - 3 concrete capstone project ideas with deliverables.

### 3. Deep Resume Analysis
- Acts as a **Senior Technical Recruiter and Career Advisor** with 15+ years of industry experience.
- Delivers an actionable, structured report:
  - **ATS Compatibility Score** (out of 100) with detailed explanation.
  - **Strengths**: Highlighting what works well.
  - **Gaps & Weaknesses**: Red flags, missing skills, or thin descriptions.
  - **Project Feedback**: Depth assessment and impact metrics phrasing.
  - **Keyword Suggestions**: Top 10 target keywords to pass ATS screeners.
  - **Formatting & Structure Tips**: Clean, standard layout recommendations.
  - **Ranked Action Plan**: Top 5 immediate priority improvements.

### 4. Interactive AI Mock Interview
- Generates **10 personalized interview questions** mapped directly to your resume projects, technical background, and domain.
- Covers 5 distinct categories:
  - **Project-Based**: Probing questions on resume projects.
  - **Technical**: Core concept and implementation questions.
  - **What-If**: Architectural and situational scenarios.
  - **Behavioral**: Decision-making and teamwork approaches.
  - **Skills**: Probing listed languages, frameworks, and tools.
- **Real-Time Evaluation**: Submit your answer to each question to receive:
  - A score from **1 to 10**.
  - A verdict: *Excellent*, *Good*, *Average*, or *Needs Improvement*.
  - Constructive qualitative feedback.
  - An expandable **Ideal Answer** reference.
- **Comprehensive Summary Report**: At the end of the session, receive an overall performance audit, score breakdown, top strengths, and targeted areas to improve.

---

## UI & Design System

The frontend features a **Black & Emerald Green** dark theme:
- **Background**: Deep Charcoal OLED Black (`#070908`)
- **Card Surfaces**: Translucent Glassmorphism cards (`#0e1310` & `#141c17`)
- **Accents**: Neon Emerald Green (`#10b981`, `#22c55e`, `#4ade80`)
- **Typography**: Inter (Google Fonts) with clean, high-contrast text and Markdown table formatting.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, React Markdown, Remark GFM, Lucide / CSS Icons |
| **Backend** | Python 3.10+, FastAPI, Uvicorn, Pydantic |
| **LLM Inference** | Groq API (`llama-3.3-70b-versatile`) via `langchain-groq` |
| **Web Search** | Tavily Search API (`tavily-python`) |
| **Document Parser** | `pdfplumber`, `python-multipart` |
| **Data Persistence** | Local JSON Key-Value Store (`back/data/users.json`) |

---

## Project Structure

```text
cc/
├── .env                      # API keys and environment variables
├── .gitignore                # Git ignore rules (node_modules, venv, .env, etc.)
├── PLAN.md                   # Initial system design and functional specification
├── README.md                 # Project documentation
├── requirements.txt          # Python dependencies
│
├── back/                     # FastAPI Backend
│   ├── main.py               # Application entry point, CORS, and route registration
│   ├── data/
│   │   └── users.json        # User profiles, cached roadmaps, analyses, and sessions
│   ├── models/
│   │   └── schemas.py        # Pydantic request/response schemas
│   ├── routes/
│   │   ├── onboarding.py     # User registration and resume upload
│   │   ├── learning_path.py  # Tavily + Groq roadmap generator
│   │   ├── resume.py         # Resume analysis and cached critique retrieval
│   │   └── interview.py      # Q&A generation, evaluation, and summary report
│   └── services/
│       ├── groq_service.py   # Prompts and LLM calls via LangChain & Groq
│       ├── tavily_service.py # Live web resource queries via Tavily
│       ├── resume_parser.py  # PDF text extraction via pdfplumber
│       └── storage_service.py# JSON file read/write helper
│
└── my_pro/                   # Vite + React Frontend
    ├── index.html            # Main HTML shell
    ├── package.json          # Node dependencies and scripts
    ├── vite.config.js        # Vite configuration
    └── src/
        ├── App.jsx           # Routes and PrivateRoute protection
        ├── index.css         # Complete Black & Emerald design system
        ├── api.js            # Axios/Fetch integration with FastAPI backend
        ├── components/
        │   ├── Navbar.jsx    # Sticky navigation bar with session status
        │   └── MarkdownView.jsx # Markdown renderer with table formatting & <br> handling
        └── pages/
            ├── LandingPage.jsx       # Hero landing page, feature highlights, and CTA
            ├── OnboardingPage.jsx    # 2-step onboarding (role, domain, resume upload)
            ├── DashboardPage.jsx     # Central hub with capability guards
            ├── LearningPathPage.jsx  # Generated / cached week-by-week roadmap
            ├── ResumeAnalysisPage.jsx# Senior recruiter resume critique
            └── MockInterviewPage.jsx # Real-time chat interview and score audit
```

---

## Prerequisites & Setup

### 1. Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: 18.0 or higher
- **API Keys**:
  - [Groq Console API Key](https://console.groq.com/) (Free fast inference)
  - [Tavily Search API Key](https://tavily.com/) (Live developer resource searches)

---

### 2. Configure Environment Variables
Create or verify the `.env` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

---

### 3. Backend Setup
Open a terminal in the root directory:

```bash
# 1. (Optional) Create and activate a Python virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 2. Install backend dependencies
pip install -r requirements.txt

# 3. Start the FastAPI server
cd back
uvicorn main:app --reload --port 8000
```

The backend API will be running at **`http://localhost:8000`**.  
Interactive Swagger API documentation is available at **`http://localhost:8000/docs`**.

---

### 4. Frontend Setup
Open a second terminal window:

```bash
# 1. Navigate to the frontend directory
cd my_pro

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

The frontend will launch at **`http://localhost:5173`** (or next available port like `http://localhost:5174`).

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status and root greeting |
| `GET` | `/health` | Health check endpoint |
| `POST` | `/onboarding/submit` | Multipart form submission for user profile and resume file |
| `POST` | `/learning-path/generate` | Generates a new live learning path roadmap |
| `GET` | `/learning-path/cached/{user_id}` | Retrieves previously generated learning path |
| `POST` | `/resume/analyze` | Generates a senior recruiter resume critique |
| `GET` | `/resume/cached/{user_id}` | Retrieves cached resume analysis |
| `POST` | `/interview/start` | Generates 10 customized interview questions |
| `POST` | `/interview/evaluate` | Evaluates a user answer and returns score + feedback |
| `POST` | `/interview/summary` | Produces an overall interview assessment report |
| `GET` | `/interview/session/{user_id}` | Retrieves current session questions and evaluations |

---

##  Security & Privacy

- All user data and cached sessions are kept strictly in your local `back/data/users.json` file.
- Sensitive environment files (`.env`) and generated node / python artifacts (`node_modules/`, `__pycache__/`) are excluded by `.gitignore`.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

