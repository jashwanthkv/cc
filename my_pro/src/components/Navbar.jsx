import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("cc_user_id");

  const links = userId
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/learning-path", label: "Learning Path" },
        { to: "/resume", label: "Resume" },
        { to: "/interview", label: "Interview" },
      ]
    : [];

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <a
          className="navbar-brand"
          onClick={() => navigate(userId ? "/dashboard" : "/")}
          style={{ cursor: "pointer" }}
        >
          🚀 CareerCraft AI
        </a>
        <div className="navbar-nav">
          {links.map((l) => (
            <a
              key={l.to}
              className={`nav-link${location.pathname === l.to ? " active" : ""}`}
              onClick={() => navigate(l.to)}
              style={{ cursor: "pointer" }}
            >
              {l.label}
            </a>
          ))}
          {userId && (
            <button
              className="btn btn-outline"
              style={{ padding: "7px 14px", fontSize: "0.8rem" }}
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

