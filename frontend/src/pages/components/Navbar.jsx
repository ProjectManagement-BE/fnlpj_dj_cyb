import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import ShieldIcon from "@mui/icons-material/Shield";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const items = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Threat Detection", path: "/detect" },
    { label: "Network Monitor", path: "/network" },
    { label: "Dark Web", path: "/darkweb" },
    { label: "Chatbot", path: "/chatbot" },
    { label: "IP Threat", path: "/ip-threat" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-left" onClick={() => navigate("/dashboard")}>
        <ShieldIcon className="brand-icon" />
        <span className="brand">Cyber Threat Detection</span>
      </div>
      <ul className="nav-links">
        {items.map((it) => (
          <li key={it.path}>
            <button
              className={`nav-link ${location.pathname === it.path ? "active" : ""}`}
              onClick={() => navigate(it.path)}
            >
              {it.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="nav-right">
        <button className="logout" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
