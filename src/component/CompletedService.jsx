import { useEffect, useState } from "react";
import AdminSidebar from "./admin/AdminSideBar";
import "./CompletedService.css";
import { useNavigate } from "react-router-dom";
export default function CompletedServices() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/admin/reports/completed", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <AdminSidebar />
      <div className="report-detail">
        <h2>Completed Services</h2>

        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Service</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i}>
                <td>
                <span
    className="ad-link"
    onClick={() => navigate(`/admin/service/${r.user._id}`)}
  >
    {r.user.name}
  </span>
  </td>
                <td>{r.vehicle.registrationNumber}</td>
                <td>{r.serviceType}</td>
                <td>₹{r.amount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
