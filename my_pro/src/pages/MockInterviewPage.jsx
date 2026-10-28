import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MarkdownView from "../components/MarkdownView";
import { startInterview, evaluateAnswer, getInterviewSummary } from "../api";

const CATEGORY_LABELS = {
  project_based: "📁 Project",
  technical: "💻 Technical",
  what_if: "🤔 What-If",
  behavioral: "🧠 Behavioral",
  skills: "🛠️ Skills",
  general: "💬 General",
};

const DIFFICULTY_BADGE = {
  easy: "badge-green",
  medium: "badge-yellow",
  hard: "badge-red",
};

const VERDICT_COLOR = {
  Excellent: "#22c55e",
  Good: "#4ade80",
  Average: "#facc15",
  "Needs Improvement": "#f87171",
};

export default function MockInterviewPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("cc_user_id");
  const name = localStorage.getItem("cc_user_name") || "Candidate";

  // States
  const [phase, setPhase] = useState("intro"); // intro | loading | interview | evaluating | summary
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [qaLog, setQaLog] = useState([]); // {question, answer, evaluation}
  const [evaluation, setEvaluation] = useState(null); // for current answer
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!userId) navigate("/");
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [qaLog, evaluation, phase]);

  async function handleStart() {
    setPhase("loading");
    setError("");
    try {
      const data = await startInterview(userId);
      setQuestions(data.questions);
      setCurrentIdx(0);
      setQaLog([]);
      setEvaluation(null);
      setPhase("interview");
    } catch (ex) {
      setError(ex.message);
      setPhase("intro");
    }
  }

  async function handleSubmitAnswer() {
    if (!answer.trim()) return;
    const q = questions[currentIdx];
    setPhase("evaluating");
    setError("");

    try {
      const result = await evaluateAnswer(userId, q.question, answer.trim(), currentIdx);
      const entry = {
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        answer: answer.trim(),
        score: result.score,
        verdict: result.verdict,
        feedback: result.feedback,
        ideal_answer: result.ideal_answer,
      };
      setEvaluation(entry);
      setQaLog((prev) => [...prev, entry]);
      setAnswer("");
      setPhase("interview");
    } catch (ex) {
      setError(ex.message);
      setPhase("interview");
    }
  }

  async function handleNext() {
    setEvaluation(null);
    const nextIdx = currentIdx + 1;
    if (nextIdx >= questions.length) {
      // All answered → get summary
      setPhase("loading");
      try {
        const data = await getInterviewSummary(userId, qaLog);
        setSummary(data.report);
        setPhase("summary");
      } catch (ex) {
        setError(ex.message);
        setPhase("interview");
      }
    } else {
      setCurrentIdx(nextIdx);
    }
  }

  function getScoreColor(score) {
    if (score >= 8) return "#22c55e";
    if (score >= 6) return "#4ade80";
    if (score >= 4) return "#facc15";
    return "#f87171";
  }

  const currentQ = questions[currentIdx];
  const progress = questions.length > 0 ? ((currentIdx) / questions.length) * 100 : 0;
  const avgScore = qaLog.length > 0 ? (qaLog.reduce((s, e) => s + e.score, 0) / qaLog.length).toFixed(1) : null;

  return (
    <div>
      <div className="page-hero">
        <div className="badge badge-purple" style={{ marginBottom: 14 }}>🎙️ Mock Interview</div>
        <h1>AI Mock Interview</h1>
        <p>10 tailored questions. Real-time scoring. Comprehensive feedback.</p>
      </div>

      <div className="container" style={{ paddingBottom: 80, maxWidth: 800 }}>

        {/* ─── INTRO ─── */}
        {phase === "intro" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div
              style={{
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(16, 185, 129, 0.05))",
                border: "1px solid var(--border-hover)",
                borderRadius: 24,
                padding: "48px 32px",
                maxWidth: 520,
                margin: "0 auto",
                boxShadow: "0 0 35px rgba(34, 197, 94, 0.12)",
              }}
            >
              <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>🎙️</div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 12, color: "#ffffff" }}>
                Ready, {name}?
              </h3>
              <p style={{ color: "var(--text-muted)", marginBottom: 12, fontSize: "0.95rem", lineHeight: 1.7 }}>
                You'll face <strong>10 interview questions</strong> based on your resume and domain.
                Answer each one, get scored 1–10, and receive detailed feedback.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
                {Object.values(CATEGORY_LABELS).map((l) => (
                  <span key={l} className="badge badge-purple" style={{ fontSize: "0.75rem" }}>{l}</span>
                ))}
              </div>
              {error && <div className="error-box">{error}</div>}
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "1rem", padding: "14px" }} onClick={handleStart}>
                ⚡ Start Interview
              </button>
            </div>
          </div>
        )}

        {/* ─── LOADING ─── */}
        {phase === "loading" && (
          <div className="loader-wrap">
            <div className="spinner" />
            <div className="loader-text">🤖 AI is preparing your questions…</div>
          </div>
        )}

        {/* ─── INTERVIEW ─── */}
        {(phase === "interview" || phase === "evaluating") && currentQ && (
          <>
            {/* Progress bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <span>Question {currentIdx + 1} of {questions.length}</span>
                {avgScore && <span>⭐ Avg Score: {avgScore}/10</span>}
              </div>
              <div style={{ height: 6, background: "var(--surface2)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, var(--primary), var(--accent-light))", transition: "width 0.4s", borderRadius: 99 }} />
              </div>
            </div>

            {/* Chat log */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 24 }}>
              {qaLog.map((entry, i) => (
                <div key={i}>
                  {/* Q bubble */}
                  <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--accent-light))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1rem", color: "#000" }}>🤖</div>
                    <div className="chat-bubble ai" style={{ maxWidth: "85%" }}>
                      <div style={{ fontSize: "0.8rem", color: "var(--accent-light)", fontWeight: 600, marginBottom: 6 }}>
                        {CATEGORY_LABELS[entry.category] || "❓"} · {entry.difficulty}
                      </div>
                      {entry.question}
                    </div>
                  </div>

                  {/* A bubble */}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginBottom: 10 }}>
                    <div className="chat-bubble user">
                      {entry.answer}
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface3)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1rem" }}>👤</div>
                  </div>

                  {/* Evaluation card */}
                  <div
                    className="card"
                    style={{ marginLeft: 48, borderLeft: `3px solid ${getScoreColor(entry.score)}`, transition: "none" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                      <div
                        className="score-ring"
                        style={{ background: `${getScoreColor(entry.score)}20`, color: getScoreColor(entry.score), border: `2px solid ${getScoreColor(entry.score)}` }}
                      >
                        {entry.score}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: VERDICT_COLOR[entry.verdict] || "#fff" }}>{entry.verdict}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Score: {entry.score}/10</div>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 10 }}>
                      💬 <strong style={{ color: "var(--text)" }}>Feedback:</strong> {entry.feedback}
                    </p>
                    <details style={{ cursor: "pointer" }}>
                      <summary style={{ fontSize: "0.85rem", color: "var(--accent-light)", fontWeight: 600 }}>
                        💡 See Ideal Answer
                      </summary>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: 8, lineHeight: 1.7 }}>
                        {entry.ideal_answer}
                      </p>
                    </details>
                  </div>
                </div>
              ))}

              {/* Current question */}
              {!evaluation && (
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--accent-light))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1rem", color: "#000" }}>🤖</div>
                  <div className="chat-bubble ai">
                    <div style={{ fontSize: "0.8rem", color: "var(--accent-light)", fontWeight: 600, marginBottom: 6 }}>
                      {CATEGORY_LABELS[currentQ.category] || "❓"} ·{" "}
                      <span className={`badge ${DIFFICULTY_BADGE[currentQ.difficulty] || "badge-purple"}`} style={{ fontSize: "0.7rem" }}>
                        {currentQ.difficulty}
                      </span>
                    </div>
                    {currentQ.question}
                  </div>
                </div>
              )}
            </div>

            {/* Answer evaluated → show Next */}
            {evaluation && (
              <div style={{ textAlign: "right" }}>
                <button className="btn btn-primary" onClick={handleNext}>
                  {currentIdx + 1 >= questions.length ? "📊 View Summary →" : "Next Question →"}
                </button>
              </div>
            )}

            {/* Answer input */}
            {!evaluation && (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here… Be thorough and specific."
                  rows={4}
                  style={{ flex: 1 }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmitAnswer();
                  }}
                />
                <button
                  className="btn btn-primary"
                  style={{ flexShrink: 0, alignSelf: "flex-end", padding: "12px 20px" }}
                  onClick={handleSubmitAnswer}
                  disabled={phase === "evaluating" || !answer.trim()}
                >
                  {phase === "evaluating" ? "⏳" : "Submit →"}
                </button>
              </div>
            )}

            {error && <div className="error-box">{error}</div>}

            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 8 }}>
              Tip: Press Ctrl+Enter to submit quickly.
            </div>
          </>
        )}

        {/* ─── SUMMARY ─── */}
        {phase === "summary" && summary && (
          <>
            {/* Score overview */}
            {avgScore && (
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  flexWrap: "wrap",
                  marginBottom: 28,
                  padding: "24px",
                  background: "linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(16, 185, 129, 0.05))",
                  border: "1px solid var(--border-hover)",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 0 25px rgba(34, 197, 94, 0.12)",
                }}
              >
                <div style={{ flex: 1, minWidth: 120, textAlign: "center" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 900, color: getScoreColor(parseFloat(avgScore)) }}>
                    {avgScore}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Avg Score / 10</div>
                </div>
                <div style={{ flex: 1, minWidth: 120, textAlign: "center" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--accent-light)" }}>
                    {questions.length}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Questions</div>
                </div>
                <div style={{ flex: 1, minWidth: 120, textAlign: "center" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#22c55e" }}>
                    {qaLog.filter((e) => e.score >= 7).length}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Strong Answers</div>
                </div>
              </div>
            )}

            {/* Q&A quick recap */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 14, color: "var(--accent-light)" }}>📋 Score Breakdown</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {qaLog.map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${getScoreColor(e.score)}20`, color: getScoreColor(e.score), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0, border: `1.5px solid ${getScoreColor(e.score)}` }}>
                      {e.score}
                    </div>
                    <div style={{ flex: 1, fontSize: "0.875rem", color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {e.question}
                    </div>
                    <span className={`badge ${DIFFICULTY_BADGE[e.difficulty] || "badge-purple"}`} style={{ flexShrink: 0, fontSize: "0.7rem" }}>
                      {e.verdict}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Full report */}
            <div className="card md-content">
              <h2 style={{ marginBottom: 16, color: "var(--accent-light)" }}>📊 Full Performance Report</h2>
              <MarkdownView content={summary} />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              <button className="btn btn-outline" onClick={() => { setPhase("intro"); setQaLog([]); setEvaluation(null); setSummary(null); }}>
                🔄 Retake Interview
              </button>
              <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
                ← Back to Dashboard
              </button>
            </div>
          </>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
