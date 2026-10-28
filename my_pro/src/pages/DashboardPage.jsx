import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const TOOLS = [
  {
    icon: "🗺️",
    title: "Learning Path",
    desc: "Get a personalized week-by-week roadmap for your chosen domain, powered by live web search + Groq AI.",
    to: "/learning-path",
    requiresDomain: true,
    color: "#10b981",
  },
  {
    icon: "📄",
    title: "Resume Analysis",
    desc: "Deep AI critique of your resume — ATS score, strengths, gaps, keywords, and a priority action plan.",
    to: "/resume",
    requiresResume: true,
    color: "#22c55e",
  },
  {
    icon: "🎙️",
    title: "Mock Interview",
    desc: "Face 10 AI-generated questions based on your profile. Get scored and receive detailed per-answer feedback.",
    to: "/interview",
    color: "#4ade80",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("cc_user_id");
  const name = localStorage.getItem("cc_user_name") || "there";
  const hasDomain = localStorage.getItem("cc_has_domain") === "true";
  const hasResume = localStorage.getItem("cc_has_resume") === "true";
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (!userId) { navigate("/"); return; }
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
  }, []);

  function isDisabled(tool) {
    if (tool.requiresDomain && !hasDomain) return true;
    if (tool.requiresResume && !hasResume) return true;
    return false;
  }

  function disabledReason(tool) {
    if (tool.requiresDomain && !hasDomain)
      return "Requires domain info — go back to onboarding and fill in Domain details.";
    if (tool.requiresResume && !hasResume)
      return "Requires a resume — go back to onboarding and upload your resume.";
    return null;
  }

  return (
    <div className="container" style={{ padding: "50px 24px" }}>
      {/* Greeting */}
      <div style={{ marginBottom: 48 }}>
        <div className="badge badge-purple" style={{ marginBottom: 14 }}>
          Your Dashboard
        </div>
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 800,
            background: "linear-gradient(135deg, #ffffff 30%, #4ade80 75%, #10b981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {greeting}, {name}! 👋
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: "1rem" }}>
          Pick a tool below and let AI do the heavy lifting.
        </p>
      </div>

      {/* User profile chips */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
        <span className={`badge ${hasDomain ? "badge-green" : "badge-red"}`}>
          {hasDomain ? "✅ Domain Set" : "❌ No Domain"}
        </span>
        <span className={`badge ${hasResume ? "badge-green" : "badge-red"}`}>
          {hasResume ? "✅ Resume Uploaded" : "❌ No Resume"}
        </span>
        <span className="badge badge-purple" style={{ fontFamily: "monospace" }}>
          ID: {userId?.slice(0, 8)}…
        </span>
      </div>

      {/* Tool cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {TOOLS.map((tool) => {
          const disabled = isDisabled(tool);
          const reason = disabledReason(tool);
          return (
            <div
              key={tool.title}
              className="card"
              style={{
                opacity: disabled ? 0.55 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={() => !disabled && navigate(tool.to)}
            >
              {/* Color accent bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${tool.color}, transparent)`,
                }}
              />

              <div style={{ fontSize: "2.8rem", marginBottom: 14, marginTop: 8 }}>{tool.icon}</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8, color: "#ffffff" }}>
                {tool.title}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 20 }}>
                {tool.desc}
              </p>

              {reason && (
                <div className="notice-box" style={{ fontSize: "0.8rem", padding: "10px 14px", margin: 0 }}>
                  ⚠️ {reason}
                </div>
              )}

              {!disabled && (
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginTop: 16 }}
                  onClick={(e) => { e.stopPropagation(); navigate(tool.to); }}
                >
                  Open →
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer tip */}
      <div className="notice-box" style={{ marginTop: 40, textAlign: "center" }}>
        💡 Tip: For the best experience, provide both a <strong>domain</strong> and a <strong>resume</strong> during onboarding.
        <button
          className="btn btn-outline"
          style={{ marginLeft: 12, padding: "6px 14px", fontSize: "0.8rem" }}
          onClick={() => {
            localStorage.clear();
            navigate("/onboarding");
          }}
        >
          Re-onboard
        </button>
      </div>
    </div>
  );
}
