import { useState, useEffect } from "react";

export default function UpdateStatusModal({ data, close, onUpdate }) {
  const [status, setStatus] = useState("");
  const [mechanicName, setMechanicName] = useState("");
  const [amount, setAmount] = useState("");
  const [mechanics, setMechanics] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/admin/mechanics", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(list => setMechanics(list || []));
  }, []);

  async function submit() {
    const body = { status };

    if (status === "approved") {
      if (!mechanicName.trim()) {
        alert("Select a mechanic");
        return;
      }
      body.mechanicName = mechanicName;
    }

    if (status === "completed") {
      if (!amount) {
        alert("Amount required");
        return;
      }
      body.amount = Number(amount);
    }

    const res = await fetch(`http://localhost:4000/admin/update-status/${data._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body)
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message);
      return;
    }

    onUpdate();
    close();
  }

  return (
    <div className="ad-modal-overlay">
      <div className="ad-modal">
        <h3>Update Status</h3>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select status</option>

          {data.status === "pending" && (
            <>
              <option value="approved">Approve</option>
              <option value="rejected">Reject</option>
            </>
          )}

          {data.status === "approved" && (
            <option value="in_progress">Mark In Progress</option>
          )}

          {data.status === "in_progress" && (
            <option value="completed">Mark Completed</option>
          )}
        </select>

        {status === "approved" && (
          <select
            value={mechanicName}
            onChange={(e) => setMechanicName(e.target.value)}
          >
            <option value="">Select Mechanic</option>
            {mechanics.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}

        {status === "completed" && (
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        )}

        <div className="ad-modal-actions">
          <button onClick={submit}>Update</button>
          <button className="cancel" onClick={close}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
