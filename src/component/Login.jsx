import "./Login.css";
import { useState } from "react";

export default function Login() {
  const [data, setData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState({});
  const [popup, setPopup] = useState({ message: "", type: "" });

  function showPopup(message, type = "error") {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: "" }), 2000);
  }

  function validate(name, value) {
    let message = "";

    if (name === "identifier") {
      if (!value.trim()) message = "Email or phone is required";
      else if (!/^\d{10}$/.test(value) && !/^\S+@\S+\.\S+$/.test(value))
        message = "Enter valid email or phone";
    }

    if (name === "password") {
      if (!value.trim()) message = "Password is required";
    }

    setError((prev) => ({ ...prev, [name]: message }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  }

  async function handleSubmit(e) {
  e.preventDefault();

  if (!data.identifier.trim() || !data.password.trim()) {
    showPopup("All fields are required");
    return;
  }

  if (error.identifier) {
    showPopup("error in email or phone");
    return;
  }
  if(error.password){
    showPopup("error in password");
    return;
  }

  try {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include"
    });

    const result = await response.json();

    if (!response.ok) {
      showPopup(result.message || "Invalid login");
      return;
    }

    const me = await fetch("http://localhost:4000/me", {
      credentials: "include"
    });

    const meData = await me.json();

    if (!me.ok || !meData.user) {
      showPopup("Unable to fetch profile");
      return;
    }

    const role = meData.user.role;

    showPopup("Login Successful", "success");

    setTimeout(() => {
      if (role === "admin") window.location.href = "/admin/requests";
      else window.location.href = "/addvehicle";
    }, 1200);

  } catch (err) {
    showPopup("Server error");
    console.log(err);
  }
}


  return (
    <div className="login-container">
      <div className="bg-image"></div>

      <form className="login-card" onSubmit={handleSubmit}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
          className="login-avatar"
          alt=""
        />

        <h2>Welcome Back</h2>
        <p className="subtitle">Login to continue</p>

        <input
          type="text"
          name="identifier"
          placeholder="Email or Phone Number"
          className="input-field"
          onChange={handleChange}
        />
        {error.identifier && <p className="error">{error.identifier}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input-field"
          onChange={handleChange}
        />
        {error.password && <p className="error">{error.password}</p>}

        <button className="btn" type="submit">
          Login
        </button>

        <p className="register-link">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </form>

      {popup.message && (
        <div className="popup-overlay">
          <div className={`popup-card ${popup.type}`}>
            <h3>{popup.type === "error" ? "Error" : "Success"}</h3>
            <p>{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
