import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    fetchUpdatedList();
  }

  async function fetchUpdatedList() {
    const res = await fetch("http://localhost:4000/my-vehicles", {
      credentials: "include",
    });

    const data = await res.json();
    setVehicles(data);
  }

  const goEdit = (id) => navigate(`/edit-vehicle/${id}`);

  if (loading) return <h2 className="loading">Loading...</h2>;

  return (
    <>
    <Navbar/>
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
              <button className="edit-btn" onClick={() => goEdit(v._id)}>Edit</button>
              <button className="delete-btn" onClick={() => deleteVehicle(v._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
