import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ServiceDetail.css";
import AdminSidebar from "./admin/AdminSideBar";

export default function ServiceDetails() {
  const { type } = useParams();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch(`http://localhost:4000/admin/reports/service-details/${type}`, {
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setRecords(data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await load();
    }
    fetchData();
  }, [type]);

  if (loading) return <h2 className="sd-loading">Loading...</h2>;

  return (
    <>  
    <AdminSidebar />
    <div className="sd-page">
      <h2 className="sd-title">{type} Service Details</h2>

      {records.length === 0 && <p className="sd-empty">No records found</p>}

      <div className="sd-list">
        {records.map((r, i) => (
          <div className="sd-card" key={i}>
            <h3 className="sd-vehicle">{r.vehicle.brand} {r.vehicle.model}</h3>

            <p><strong>Registration:</strong> {r.vehicle.registrationNumber}</p>
            <p><strong>Customer:</strong> {r.user.name}</p>
            <p><strong>Date:</strong> {new Date(r.preferredDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {r.status}</p>
            <p><strong>Mechanic:</strong> {r.mechanicName || "—"}</p>
            <p><strong>Amount:</strong> ₹{r.amount || 0}</p>
          </div>
        ))}
      </div>
    </div>
 </> );
}
