import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./MyVehicle.css";

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({});
  const [popup, setPopup] = useState({ message: "", type: "" });
  const navigate = useNavigate();
  function showPopup(message, type = "error") {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: "" }), 2000);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadVehicles() {
      try {
        const res = await fetch("http://localhost:4000/my-vehicles", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (isMounted) {
          setVehicles(data);
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    }

    loadVehicles();

    return () => {
      isMounted = false;
    };
  }, []);

  async function deleteVehicle(id) {
  if (!window.confirm("Are you sure?")) return;

  const res = await fetch(`http://localhost:4000/delete-vehicle/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  const data = await res.json();

  if (!res.ok) {
    showPopup(data.message);
    return;
  }

  showPopup("Vehicle deleted successfully", "success");
  fetchUpdatedList();
}


  async function fetchUpdatedList() {
    const res = await fetch("http://localhost:4000/my-vehicles", {
      credentials: "include",
    });

    const data = await res.json();
    setVehicles(data);
  }

  function openEditPopup(v) {
    setEditData(v);
    setForm({
      brand: v.brand,
      model: v.model,
      registrationNumber: v.registrationNumber,
      year: v.year,
    });
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function saveChanges() {
    const res = await fetch(`http://localhost:4000/edit-vehicle/${editData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      showPopup(data.message);
      return;
    }

    showPopup("Vehicle updated successfully", "success");
    setEditData(null);
    fetchUpdatedList();
  }

  if (loading) return <h2 className="loading">Loading...</h2>;

  return (
    <>
      <Navbar />
      <div className="vehicle-page">
        <h2 className="title">My Vehicles</h2>

        {vehicles.length === 0 && <p className="no-data">No vehicles added yet.</p>}

        <div className="vehicle-list">
          {vehicles.map((v) => (
            <div className="vehicle-card" key={v._id}>
              <h3 className="vehicle-title">{v.brand} {v.model}</h3>

              <p><strong>Reg. Number:</strong> {v.registrationNumber}</p>
              <p><strong>Year:</strong> {v.year}</p>

              <div className="vehicle-actions">
                <button className="edit-btn" onClick={() => openEditPopup(v)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteVehicle(v._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editData && (
        <div className="edit-overlay">
          <div className="edit-modal">
            <h3>Edit Vehicle</h3>

            <input
              name="brand"
              type="text"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand"
            />

            <input
              name="model"
              type="text"
              value={form.model}
              onChange={handleChange}
              placeholder="Model"
            />

            <input
              name="registrationNumber"
              type="text"
              value={form.registrationNumber}
              onChange={handleChange}
              placeholder="Registration Number"
            />

            <input
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              placeholder="Year"
            />

            <div className="edit-actions">
              <button className="save-btn" onClick={saveChanges}>Save</button>
              <button className="cancel-btn" onClick={() => setEditData(null)}>Cancel</button>
            </div>
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
    </>
  );
}
