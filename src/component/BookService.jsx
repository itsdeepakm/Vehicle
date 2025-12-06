import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import "./BookService.css";
export default function BookService() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ vehicleId: "", serviceType: "", preferredDate: "", problemDescription: "" });
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ msg: "", type: "" });
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("http://localhost:4000/my-vehicles", { credentials: "include" });
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (!mounted) return;
        setVehicles(data);
        if (params.id) setForm(f => ({ ...f, vehicleId: params.id }));
        setLoading(false);
      } catch {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => mounted = false;
  }, [params.id]);

  function show(msg, type="error") {
    setPopup({ msg, type });
    setTimeout(() => setPopup({ msg: "", type: "" }), 3000);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const today = new Date();
    today.setHours(0,0,0,0);
    if (!form.vehicleId || !form.serviceType || !form.preferredDate) return show("Please fill required fields");
    const pref = new Date(form.preferredDate);
    if (pref < today) return show("Please choose a future date");
    if (form.problemDescription && form.problemDescription.length > 250) return show("Problem description max 250 chars");
    try {
      const res = await fetch("http://localhost:4000/book-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) return show(data.message || "Booking failed");
      show("Service booked", "success");
      navigate("/my-bookings");
    } catch {
      show("Server error");
    }
  }

  if (loading) return <div className="bs-loading">Loading...</div>;

  return (
    <>
    <Navbar />
    <div className="bs-page">
      <div className="bs-card">
        <h2>Book Service</h2>
        <form onSubmit={handleSubmit} className="bs-form">
          <label>Vehicle</label>
          <select name="vehicleId" value={form.vehicleId} onChange={handleChange} required>
            <option value="">Select vehicle</option>
            {vehicles.map(v => <option key={v._id} value={v._id}>{v.registrationNumber} — {v.brand} {v.model}</option>)}
          </select>

          <label>Service Type</label>
          <select name="serviceType" value={form.serviceType} onChange={handleChange} required>
            <option value="">Select service</option>
            <option value="Regular">Regular</option>
            <option value="Oil Change">Oil Change</option>
            <option value="Full Service">Full Service</option>
            <option value="Custom">Custom</option>
          </select>

          <label>Preferred Date</label>
          <input type="date" name="preferredDate" value={form.preferredDate} onChange={handleChange} required />

          <label>Problem Description</label>
          <textarea name="problemDescription" value={form.problemDescription} onChange={handleChange} maxLength={250} />

          <div className="bs-actions">
            <button type="submit" className="bs-submit">Book Service</button>
            <button type="button" className="bs-cancel" onClick={() => navigate("/my-bookings")}>Cancel</button>
          </div>
        </form>
      </div>

      {popup.msg && <div className={`bs-toast ${popup.type === "success" ? "success" : ""}`}>{popup.msg}</div>}
    </div>
 </> );
}
