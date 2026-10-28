import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { onboardUser } from "../api";

const YEARS_STUDENT = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const YEARS_EMP = ["1-2 years", "2-5 years", "5-10 years", "10+ years"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = personal, 2 = domain+resume
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    user_type: "student",
    year: "",
    department: "",
    stream: "",
    time_weeks: "",
    level: "",
    resume: null,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const yearOptions = form.user_type === "student" ? YEARS_STUDENT : YEARS_EMP;

  function validateStep1() {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.year) return "Please select your year.";
    if (!form.department.trim()) return "Please enter your department.";
    return null;
  }

  function validateStep2() {
    const hasDomain = form.stream && form.time_weeks && form.level;
    const hasResume = !!form.resume;
    if (!hasDomain && !hasResume) return "Please fill in Domain Info or upload a Resume (or both).";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err2 = validateStep2();
    if (err2) { setError(err2); return; }

    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("year", form.year);
      fd.append("department", form.department.trim());
      if (form.stream) fd.append("stream", form.stream);
      if (form.time_weeks) fd.append("time_weeks", form.time_weeks);
      if (form.level) fd.append("level", form.level);
      if (form.resume) fd.append("resume", form.resume);

      const data = await onboardUser(fd);
      localStorage.setItem("cc_user_id", data.user_id);
      localStorage.setItem("cc_user_name", data.name);
      localStorage.setItem("cc_has_domain", data.has_domain);
      localStorage.setItem("cc_has_resume", data.has_resume);
      navigate("/dashboard");
    } catch (ex) {
      setError(ex.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 620, padding: "60px 24px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div className="badge badge-purple" style={{ marginBottom: "14px" }}>
          Step {step} of 2
        </div>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #ffffff 30%, #4ade80 75%, #10b981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {step === 1 ? "Tell us about yourself" : "Domain & Resume"}
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
          {step === 1
            ? "A quick intro so we can tailor everything for you."
            : "Add your domain of interest, upload your resume, or both."}
        </p>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 5,
          background: "var(--surface2)",
          borderRadius: 99,
          marginBottom: 36,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: step === 1 ? "50%" : "100%",
            background: "linear-gradient(90deg, var(--primary), var(--accent-light))",
            transition: "width 0.4s ease",
            borderRadius: 99,
          }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            {/* User type toggle */}
            <div className="form-group">
              <label>I am a</label>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { val: "student", label: "🎓 Student" },
                  { val: "employee", label: "💼 Employee" },
                ].map((t) => (
                  <button
                    key={t.val}
                    type="button"
                    className={`btn ${form.user_type === t.val ? "btn-primary" : "btn-outline"}`}
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={() => { set("user_type", t.val); set("year", ""); }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Ravi Kumar"
                required
              />
            </div>

            <div className="form-group">
              <label>{form.user_type === "student" ? "College Year *" : "Experience *"}</label>
              <select value={form.year} onChange={(e) => set("year", e.target.value)} required>
                <option value="">-- Select --</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{form.user_type === "student" ? "Department / Branch *" : "Current Role / Dept *"}</label>
              <input
                value={form.department}
                onChange={(e) => set("department", e.target.value)}
                placeholder={form.user_type === "student" ? "e.g. CSE, ECE, MBA" : "e.g. Software Engineer, Data Analyst"}
                required
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
              onClick={() => {
                const err = validateStep1();
                if (err) { setError(err); return; }
                setError("");
                setStep(2);
              }}
            >
              Continue →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {/* Domain Section */}
            <div
              className="card"
              style={{ marginBottom: 24, transition: "none" }}
            >
              <h3 style={{ marginBottom: 16, color: "var(--accent-light)", fontWeight: 700 }}>
                🎯 Domain of Interest <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "0.8rem" }}>(optional)</span>
              </h3>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Stream / Topic</label>
                <input
                  value={form.stream}
                  onChange={(e) => set("stream", e.target.value)}
                  placeholder="e.g. Machine Learning, Full Stack, DSA"
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Time Available (weeks)</label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={form.time_weeks}
                    onChange={(e) => set("time_weeks", e.target.value)}
                    placeholder="e.g. 8"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Your Level</label>
                  <select value={form.level} onChange={(e) => set("level", e.target.value)}>
                    <option value="">-- Select --</option>
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 16, color: "var(--accent-light)", fontWeight: 700 }}>
                📄 Resume Upload <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "0.8rem" }}>(optional)</span>
              </h3>
              <div
                style={{
                  border: "2px dashed var(--border-hover)",
                  borderRadius: "var(--radius-sm)",
                  padding: "28px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: form.resume ? "rgba(34,197,94,0.12)" : "var(--surface2)",
                }}
                onClick={() => document.getElementById("resumeInput").click()}
              >
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>
                  {form.resume ? "✅" : "📁"}
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  {form.resume
                    ? `Selected: ${form.resume.name}`
                    : "Click to upload PDF or TXT resume"}
                </p>
                <input
                  id="resumeInput"
                  type="file"
                  accept=".pdf,.txt"
                  style={{ display: "none" }}
                  onChange={(e) => set("resume", e.target.files[0] || null)}
                />
              </div>
            </div>

            <div className="notice-box">
              💡 At least one of <strong>Domain Info</strong> or <strong>Resume</strong> is required.
              Providing both gives the best results.
            </div>

            {error && <div className="error-box">❌ {error}</div>}

            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => { setError(""); setStep(1); }}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2, justifyContent: "center" }}
                disabled={loading}
              >
                {loading ? "Setting up your profile…" : "🚀 Launch My Dashboard"}
              </button>
            </div>
          </>
        )}

        {step === 1 && error && <div className="error-box" style={{ marginTop: 12 }}>❌ {error}</div>}
      </form>
    </div>
  );
}
