import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBooking.css";
import Navbar from "./Navbar";
function Timeline({ timeline, current }) {
  const stages = ["pending","approved","in_progress","completed","rejected"];
  return (
    <div className="tb-timeline">
      {stages.slice(0,4).map((s,i) => {
        const reached = stages.indexOf(current) >= i;
        return (
          <div key={s} className={`tb-node ${reached ? "active" : ""}`}>
            <div className="tb-dot" />
            <div className="tb-label">{s.replace("_"," ").toUpperCase()}</div>
            {i < 3 && <div className="tb-line" />}
          </div>
        );
      })}
    </div>
  );
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("http://localhost:4000/my-bookings", { credentials: "include" });
        if (!res.ok) { setLoading(false); return; }
        const data = await res.json();
        if (mounted) { setBookings(data); setLoading(false); }
      } catch { if (mounted) setLoading(false); }
    }
    load();
    return () => mounted = false;
  }, []);

  async function cancelBooking(id) {
    if (!window.confirm("Cancel booking?")) return;
    const res = await fetch(`http://localhost:4000/cancel-booking/${id}`, { method: "DELETE", credentials: "include" });
    const data = await res.json();
    if (!res.ok) return alert(data.message);
    setBookings(prev => prev.filter(b => b._id !== id));
  }

  if (loading) return <div className="mb-loading">Loading...</div>;

  return (
    <><Navbar />
    <div className="mb-page">
      <div className="mb-header">
        <h2>My Bookings</h2>
      </div>

      {bookings.length === 0 && <div className="mb-empty">No bookings found.</div>}

      <div className="mb-list">
        {bookings.map(b => (
          <div className="mb-card" key={b._id}>
            <div className="mb-top">
              <div>
                <div className="mb-id">#{b._id.slice(-6)}</div>
                <div className="mb-vehicle">{b.vehicleId ? `${b.vehicleId.registrationNumber} — ${b.vehicleId.brand} ${b.vehicleId.model}` : "Vehicle removed"}</div>
              </div>
              <div className="mb-meta">
                <div className="mb-type">{b.serviceType}</div>
                <div className="mb-date">{new Date(b.preferredDate).toLocaleDateString()}</div>
                <div className={`mb-status s-${b.status}`}>{b.status.replace("_"," ")}</div>
              </div>
            </div>

            <div className="mb-body">
              <div className="mb-left">
                <div className="mb-desc"><strong>Problem:</strong> {b.problemDescription || "—"}</div>
                <div className="mb-extra"><strong>Mechanic:</strong> {b.mechanicName || "—"}</div>
                <div className="mb-extra"><strong>Amount:</strong> {b.status === "completed" ? (b.amount || 0) : "—"}</div>
              </div>

              <div className="mb-right">
                <Timeline timeline={b.timeline} current={b.status} />
              </div>
            </div>

            <div className="mb-actions">
              {b.status === "pending" && <button className="mb-cancel" onClick={() => cancelBooking(b._id)}>Cancel</button>}
              {b.status === "completed" && <button className="mb-invoice" onClick={() => alert('Download invoice not implemented')}>Download Invoice</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
 </> );
}
