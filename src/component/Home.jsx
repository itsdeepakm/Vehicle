import React from "react";
import "./Home.css";

export default function Home() {
  const handleclick = () => {
    window.location.href = "/login";
  };

  return (
    <div className="home-container">
    
      <nav className="navbar">
        <div className="logo">AutoCare Hub</div>
        
        <ul className="nav-links">
          <li>Home</li>
          <li>Services</li>
          <li>About</li>
          <li>Contact</li>
        </ul>

        <button className="login-btn" onClick={handleclick}>Login</button>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Drive Smooth. Drive Safe.</h1>
          <p>Your trusted partner for vehicle care, maintenance and servicing.</p>
          <button className="explore-btn">Explore Services</button>
        </div>
      </section>

      <footer>
        <p>© 2025 AutoCare Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
