const BASE = "http://localhost:8000";

export async function onboardUser(formData) {
  const res = await fetch(`${BASE}/onboarding/submit`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Onboarding failed");
  }
  return res.json();
}

export async function generateLearningPath(user_id) {
  const res = await fetch(`${BASE}/learning-path/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to generate learning path");
  }
  return res.json();
}

export async function getCachedLearningPath(user_id) {
  const res = await fetch(`${BASE}/learning-path/cached/${user_id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function analyzeResume(user_id) {
  const res = await fetch(`${BASE}/resume/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to analyze resume");
  }
  return res.json();
}

export async function getCachedResume(user_id) {
  const res = await fetch(`${BASE}/resume/cached/${user_id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function startInterview(user_id) {
  const res = await fetch(`${BASE}/interview/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to start interview");
  }
  return res.json();
}

export async function evaluateAnswer(user_id, question, answer, question_index) {
  const res = await fetch(`${BASE}/interview/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, question, answer, question_index }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to evaluate answer");
  }
  return res.json();
}

export async function getInterviewSummary(user_id, qa_pairs) {
  const res = await fetch(`${BASE}/interview/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, qa_pairs }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to generate summary");
  }
  return res.json();
}

