import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🗺️",
      title: "Learning Path Generator",
      desc: "Get a personalized, week-by-week roadmap powered by live web search + Groq AI tailored to your domain and level.",
    },
    {
      icon: "📄",
      title: "Resume Analyzer",
      desc: "Upload your resume and receive deep feedback: ATS score, strengths, gaps, keywords, and a priority action plan.",
    },
    {
      icon: "🎙️",
      title: "Mock Interview",
      desc: "Face AI-generated interview questions based on your resume and domain. Get scored and receive detailed feedback.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "60px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Emerald glow blob */}
        <div
          style={{
            position: "absolute",
            width: "550px",
            height: "550px",
            background: "radial-gradient(circle, rgba(34, 197, 94, 0.18) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="badge badge-purple"
          style={{ marginBottom: "24px", fontSize: "0.85rem" }}
        >
          ✨ AI-Powered Career Assistant
        </div>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: "24px",
            background: "linear-gradient(135deg, #ffffff 25%, #4ade80 70%, #10b981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            maxWidth: "800px",
          }}
        >
          Craft Your Career with AI Precision
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "1.15rem",
            maxWidth: "560px",
            marginBottom: "40px",
            lineHeight: 1.7,
          }}
        >
          Upload your resume or pick a domain. Get a personalized learning roadmap,
          deep resume critique, and an AI mock interview — all in one place.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            className="btn btn-primary"
            style={{ fontSize: "1rem", padding: "14px 32px" }}
            onClick={() => navigate("/onboarding")}
          >
            🚀 Get Started Free
          </button>
          <button
            className="btn btn-outline"
            style={{ fontSize: "1rem", padding: "14px 32px" }}
            onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}
          >
            See Features ↓
          </button>
        </div>

        <div
          style={{
            marginTop: "64px",
            display: "flex",
            gap: "40px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { label: "Learning Path", icon: "🗺️" },
            { label: "Resume Analysis", icon: "📄" },
            { label: "Mock Interview", icon: "🎙️" },
            { label: "Groq LLM", icon: "⚡" },
          ].map((t) => (
            <div key={t.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>{t.icon}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
                {t.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "80px 0" }}>
        <div className="container">
          <h2
            style={{
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: "48px",
              background: "linear-gradient(135deg, #ffffff 40%, #4ade80 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Everything You Need to Level Up
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                className="card"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/onboarding")}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "10px", color: "#ffffff" }}>
                  {f.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(16, 185, 129, 0.05))",
            border: "1px solid var(--border-hover)",
            borderRadius: "24px",
            padding: "48px 32px",
            boxShadow: "0 0 35px rgba(34, 197, 94, 0.15)",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "12px", color: "#ffffff" }}>
            Ready to accelerate your career?
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "28px" }}>
            Takes 2 minutes. No account required.
          </p>
          <button
            className="btn btn-primary"
            style={{ fontSize: "1rem", padding: "14px 36px" }}
            onClick={() => navigate("/onboarding")}
          >
            Start Now →
          </button>
        </div>
      </section>
    </div>
  );
}
