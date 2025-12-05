import "./Login.css";
import { useState } from "react";

export default function Login() {
  const [data, setData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);
  const [popup,setPopup]=useState({message:"",type:""});


  function showPopup(message,type="error"){
    setPopup({message,type});
    setTimeout(()=>setPopup({message:"",type:"",}),2000);
  }
  function validate(name, value) {
    let message = "";

    if (name === "identifier") {
      if (!value.trim()) message = "Email or phone is required";
      else if (!/^\d{10}$/.test(value) && !/^\S+@\S+\.\S+$/.test(value))
        message = "Enter valid email or 10-digit phone number";
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

    const invalid = Object.values(error).some((msg) => msg);
    if (invalid) return showPopup("fix errors before logging int")

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        showPopup(result.message|| "Invalid login");
        return;
      }

      localStorage.setItem("token", result.token);
      setSuccess(true);
     showPopup("Login Successful","success");
      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
    } catch (err) {
      showPopup("server error"+err.message);
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

      {success && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Login Successful</h3>
            <p>Redirecting...</p>
          </div>
        </div>
      )}
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
