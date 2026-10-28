import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MarkdownView from "../components/MarkdownView";
import { generateLearningPath, getCachedLearningPath } from "../api";

export default function LearningPathPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("cc_user_id");
  const [roadmap, setRoadmap] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (!userId) { navigate("/"); return; }
    // Try to load cached roadmap
    getCachedLearningPath(userId).then((data) => {
      if (data?.roadmap) {
        setRoadmap(data.roadmap);
        setMeta(data);
        setGenerated(true);
      }
    });
  }, []);

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const data = await generateLearningPath(userId);
      setRoadmap(data.roadmap);
      setMeta(data);
      setGenerated(true);
    } catch (ex) {
      setError(ex.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-hero">
        <div className="badge badge-purple" style={{ marginBottom: 14 }}>
          🗺️ Learning Path
        </div>
        <h1>Your Personalized Roadmap</h1>
        <p>
          Week-by-week curriculum tailored to your domain, level, and time — backed by live web search.
        </p>
      </div>

      <div className="container" style={{ paddingBottom: 60 }}>
        {!generated && !loading && (
          <div
            style={{
              maxWidth: 500,
              margin: "0 auto",
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(16, 185, 129, 0.05))",
                border: "1px solid var(--border-hover)",
                borderRadius: 24,
                padding: "40px 32px",
                boxShadow: "0 0 30px rgba(34, 197, 94, 0.1)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🗺️</div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 10, color: "#ffffff" }}>
                Ready to build your roadmap?
              </h3>
              <p style={{ color: "var(--text-muted)", marginBottom: 28, fontSize: "0.95rem" }}>
                Our AI will search the web for the latest resources and generate a custom
                learning path just for you.
              </p>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={generate}>
                ⚡ Generate My Learning Path
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="loader-wrap">
            <div className="spinner" />
            <div className="loader-text">🌐 Searching web for resources…</div>
            <div className="loader-text" style={{ animationDelay: "0.5s", fontSize: "0.85rem", color: "var(--accent-light)" }}>
              ⚡ Groq AI is building your roadmap…
            </div>
          </div>
        )}

        {error && <div className="error-box">❌ {error}</div>}

        {generated && roadmap && (
          <>
            {/* Meta chips */}
            {meta && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
                {meta.stream && <span className="badge badge-purple">📌 {meta.stream}</span>}
                {meta.level && <span className="badge badge-green">🎯 {meta.level}</span>}
                {meta.time_weeks && (
                  <span className="badge badge-yellow">⏱️ {meta.time_weeks} weeks</span>
                )}
              </div>
            )}

            {/* Roadmap */}
            <div className="card md-content">
              <MarkdownView content={roadmap} />
            </div>

            {/* Regenerate */}
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              <button className="btn btn-outline" onClick={generate} disabled={loading}>
                🔄 Regenerate
              </button>
              <button className="btn btn-primary" onClick={() => navigate("/interview")}>
                🎙️ Start Mock Interview →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
