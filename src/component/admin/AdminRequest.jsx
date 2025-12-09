import { useEffect, useState } from "react";
import AdminSidebar from "../admin/AdminSideBar";
import UpdateStatusModal from "../admin/UpdateModel";
import "./admin.css";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    from: "",
    to: ""
  });
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");

  function load() {
    const q = new URLSearchParams({
      search: filters.search,
      status: filters.status,
      dateFrom: filters.from,
      dateTo: filters.to
    }).toString();

    fetch("http://localhost:4000/admin/requests?" + q, {
      credentials: "include"
    })
      .then(async (r) => {
        const data = await r.json();

        if (!r.ok) {
          setError(data.message || "Failed to load requests");
          setRequests([]);
          return;
        }

        if (!Array.isArray(data)) {
          setError("Invalid response");
          setRequests([]);
          return;
        }

        setError("");
        setRequests(data);
      })
      .catch(() => {
        setError("Network error");
        setRequests([]);
      });
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ad-layout">
      <AdminSidebar />

      <div className="ad-content">
        <h2>Service Requests</h2>

        {error && <div className="ad-error">{error}</div>}

        <div className="ad-filters">
          <input
            placeholder="Search"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="">Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <input
            type="date"
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
          <input
            type="date"
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />

          <button onClick={load}>Apply</button>
        </div>

        <table className="ad-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Vehicle Reg No.</th>
              <th>Service Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Mechanic</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 && !error && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                  No records found
                </td>
              </tr>
            )}

            {requests.map((r,index) => (
              <tr key={r._id}>
                <td>#{index+1}</td>

                <td>{r.user?.name || "Unknown User"}</td>

                <td>{r.vehicle?.registrationNumber || "Unknown Vehicle"}</td>

                <td>{r.serviceType}</td>

                <td>{new Date(r.preferredDate).toLocaleDateString()}</td>

                <td className={"s-" + r.status}>{r.status}</td>

                <td>{r.mechanicName || "—"}</td>

                <td>
                  <button onClick={() => setModal(r)}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {modal && (
          <UpdateStatusModal
            data={modal}
            close={() => setModal(null)}
            onUpdate={load}
          />
        )}
      </div>
    </div>
  );
}
