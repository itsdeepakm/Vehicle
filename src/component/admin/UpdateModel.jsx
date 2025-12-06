import { useState } from "react";

export default function UpdateStatusModal({ data, close, onUpdate }) {
  const [status, setStatus] = useState("");
  const [mechanicName, setMechanicName] = useState("");
  const [amount, setAmount] = useState("");

  async function submit() {
    const body = { status };

    if (status === "approved") {
      if (!mechanicName.trim()) return alert("Mechanic required");
      body.mechanicName = mechanicName;
    }

    if (status === "completed") {
      if (!amount) return alert("Amount required");
      body.amount = Number(amount);
    }

    const res = await fetch(`http://localhost:4000/admin/update-status/${data._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body)
    });

    const result = await res.json();

    if (!res.ok) return alert(result.message);

    onUpdate();
    close();
  }

  return (
    <div className="ad-modal-overlay">
      <div className="ad-modal">
        <h3>Update Status</h3>

        <select value={status} onChange={e => setStatus(e.target.value)}>
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
          <input
            placeholder="Mechanic Name"
            value={mechanicName}
            onChange={e => setMechanicName(e.target.value)}
          />
        )}

        {status === "completed" && (
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
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
