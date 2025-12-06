import "./admin.css";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const nav = useNavigate();

  function logout() {
    fetch("http://localhost:4000/logout", { method: "POST", credentials: "include" })
      .then(() => nav("/login"));
  }

  return (
    <nav className="admin-navbar">
      <div className="admin-left">
        <h2 className="admin-logo">Admin Panel</h2>

        <ul className="admin-menu">
          <li onClick={() => nav("/admin/dashboard")}>Dashboard</li>
          <li onClick={() => nav("/admin/requests")}>Requests</li>
        </ul>
      </div>

      <div className="admin-right">
        <button className="admin-logout" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
