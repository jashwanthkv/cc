import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import LearningPathPage from "./pages/LearningPathPage";
import ResumeAnalysisPage from "./pages/ResumeAnalysisPage";
import MockInterviewPage from "./pages/MockInterviewPage";

function PrivateRoute({ children }) {
  return localStorage.getItem("cc_user_id") ? children : <Navigate to="/onboarding" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/learning-path" element={<PrivateRoute><LearningPathPage /></PrivateRoute>} />
          <Route path="/resume" element={<PrivateRoute><ResumeAnalysisPage /></PrivateRoute>} />
          <Route path="/interview" element={<PrivateRoute><MockInterviewPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
