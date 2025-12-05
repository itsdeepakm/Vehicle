import { useState } from "react";
import "./AddVehicle.css";

export default function AddVehicle() {
  const [data, setData] = useState({
    brand: "",
    model: "",
    registrationNumber: "",
    year: ""
  });

  const [popup, setPopup] = useState({ message: "", type: "" });

  function showPopup(message, type = "error") {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: "" }), 2000);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: name === "registrationNumber" ? value.toUpperCase() : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const currentYear = new Date().getFullYear();

    if (!data.brand || !data.model || !data.registrationNumber || !data.year)
      return showPopup("All fields are required");

    if (!/^[A-Z0-9-]+$/.test(data.registrationNumber))
      return showPopup("Invalid registration number format.");

    if (data.year < 2005 || data.year > currentYear)
      return showPopup("Manufacturing year is invalid");

    try {
      const userId = localStorage.getItem("userId");

      const res = await fetch("http://localhost:4000/add-vehicle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId })
      });

      const result = await res.json();

      if (!res.ok) return showPopup(result.message);

      showPopup("Vehicle added successfully", "success");
      setData({ brand: "", model: "", registrationNumber: "", year: "" });
    } catch {
      showPopup("Server error");
    }
  }

  return (
    <div className="vehicle-container">
      <form className="vehicle-card" onSubmit={handleSubmit}>
        <h2>Add Vehicle</h2>

        <input
          type="text"
          name="brand"
          placeholder="Vehicle Brand"
          value={data.brand}
          onChange={handleChange}
        />

        <input
          type="text"
          name="model"
          placeholder="Vehicle Model"
          value={data.model}
          onChange={handleChange}
        />

        <input
          type="text"
          name="registrationNumber"
          placeholder="Registration Number"
          value={data.registrationNumber}
          onChange={handleChange}
        />

        <input
          type="number"
          name="year"
          placeholder="Manufacturing Year"
          value={data.year}
          onChange={handleChange}
        />

        <button type="submit">Add Vehicle</button>
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
