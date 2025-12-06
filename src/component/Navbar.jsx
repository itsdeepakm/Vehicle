import "./Navbar.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("http://localhost:4000/me", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();
        setUser(data.user);
      } catch {
        console.log("Failed to fetch user");
      }
    }
    loadUser();
  }, []);

  const logout = async () => {
    await fetch("http://localhost:4000/logout", {
      method: "POST",
      credentials: "include",
    });

    navigate("/login");
  };

  const go = (path) => navigate(path);

  if (!user) return null;

  if (user.role === "Admin") return null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2 className="nav-logo" onClick={() => go("/customer/dashboard")}>
          AutoCare Hub
        </h2>

        <ul className="nav-menu">
          <li onClick={() => go("/customer/dashboard")}>Dashboard</li>
          <li onClick={() => go("/myvehicles")}>My Vehicles</li>
          <li onClick={() => go("/add-vehicle")}>Add Vehicle</li>
          <li onClick={() => go("/my-bookings")}>Bookings</li>
        </ul>
      </div>

      <div className="nav-right">
        <span className="welcome">Hi, {user.name}</span>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
