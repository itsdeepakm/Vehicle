import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminSidebar from "../admin/AdminSideBar";

export default function AdminUserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:4000/admin/users/${id}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(d => {
        setUser(d.user);
        setServices(d.services);
      })
      .catch(() => setError("Failed to load user"));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="ad-layout">
      <AdminSidebar />

      <div className="ad-content">
        <h2>User Details</h2>

        <div className="detail-card">
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Phone:</b> {user.phone}</p>
          <p><b>Role:</b> {user.role}</p>
        </div>

        <h3 style={{ marginTop: "20px" }}>Service History</h3>

        <table className="ad-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s._id}>
                <td>{s.serviceType}</td>
                <td>{s.vehicleId?.registrationNumber}</td>
                <td className={"s-" + s.status}>{s.status}</td>
                <td>{new Date(s.preferredDate).toLocaleDateString()}</td>
                <td>{s.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
