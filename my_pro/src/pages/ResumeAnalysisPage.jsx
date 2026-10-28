import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MarkdownView from "../components/MarkdownView";
import { analyzeResume, getCachedResume } from "../api";

export default function ResumeAnalysisPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("cc_user_id");
  const [analysis, setAnalysis] = useState(null);
  const [filename, setFilename] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    if (!userId) { navigate("/"); return; }
    getCachedResume(userId).then((data) => {
      if (data?.analysis) {
        setAnalysis(data.analysis);
        setFilename(data.resume_filename);
        setAnalyzed(true);
      }
    });
  }, []);

  async function analyze() {
    setLoading(true);
    setError("");
    try {
      const data = await analyzeResume(userId);
      setAnalysis(data.analysis);
      setFilename(data.resume_filename);
      setAnalyzed(true);
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
          📄 Resume Analysis
        </div>
        <h1>AI Resume Critique</h1>
        <p>
          Get an honest, detailed analysis from a senior recruiter AI — ATS score, strengths, gaps, and more.
        </p>
      </div>

      <div className="container" style={{ paddingBottom: 60 }}>
        {!analyzed && !loading && (
          <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center", padding: "40px 0" }}>
            <div
              style={{
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(16, 185, 129, 0.05))",
                border: "1px solid var(--border-hover)",
                borderRadius: 24,
                padding: "40px 32px",
                boxShadow: "0 0 30px rgba(34, 197, 94, 0.1)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>📄</div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 10, color: "#ffffff" }}>
                Analyze Your Resume
              </h3>
              <p style={{ color: "var(--text-muted)", marginBottom: 28, fontSize: "0.95rem" }}>
                Our AI will act as a senior recruiter and provide a thorough, honest critique
                of your resume.
              </p>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={analyze}>
                ⚡ Analyze My Resume
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="loader-wrap">
            <div className="spinner" />
            <div className="loader-text">📄 Reading your resume…</div>
            <div className="loader-text" style={{ animationDelay: "0.4s", fontSize: "0.85rem", color: "var(--accent-light)" }}>
              🤖 AI recruiter is reviewing it…
            </div>
          </div>
        )}

        {error && <div className="error-box">❌ {error}</div>}

        {analyzed && analysis && (
          <>
            {filename && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24, alignItems: "center" }}>
                <span className="badge badge-green">📎 {filename}</span>
                <span className="badge badge-purple">✅ Analysis Complete</span>
              </div>
            )}

            <div className="card md-content">
              <MarkdownView content={analysis} />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              <button className="btn btn-outline" onClick={analyze} disabled={loading}>
                🔄 Re-analyze
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
