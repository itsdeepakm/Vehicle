import { useEffect, useRef, useState } from "react";
import "./Report.css";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import AdminSidebar from "./admin/AdminSideBar";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA500",
  "#9B59B6",
  "#2ECC71",
  "#E74C3C",
  "#3498DB"
];

function CustomTooltip({ active, payload }) {
  if (active && payload?.length) {
    const d = payload[0].payload;

    return (
      <div style={{
        background: "#fff",
        padding: "12px 16px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        boxShadow: "0px 3px 8px rgba(0,0,0,0.2)",
        maxWidth: "260px"
      }}>
        <p><strong>{d.name}</strong></p>
        <p>Count: {d.value}</p>
        <p>Share: {d.percent}%</p>

        <p style={{ marginTop: "6px", fontWeight: "bold" }}>Vehicles:</p>

        <ul style={{ maxHeight: "120px", overflowY: "auto", paddingLeft: "20px" }}>
          {d.vehicles.map((v, i) => (
            <li key={i} style={{ fontSize: "13px" }}>
              {v.brand} {v.model} ({v.reg})
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
}

function ServiceTypePie({ data }) {
  if (!data || data.length === 0) {
    return <p style={{ textAlign: "center", padding: "20px" }}>No service data</p>;
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);

  const formatted = data.map((item) => ({
    name: item.serviceType,
    value: item.count,
    percent: ((item.count / total) * 100).toFixed(1),
    vehicles: item.vehicles || []
  }));

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={formatted}
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
            dataKey="value"
          >
            {formatted.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}






export default function Reports() {
  const [overview, setOverview] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const idleLimit = 60;
  const countdownLimit = 120;

  const [showPopup, setShowPopup] = useState(false);
  const [count, setCount] = useState(countdownLimit);

  const idleTimer = useRef(null);
  const countdownTimer = useRef(null);

  function formatCurrency(n) {
    return `₹${Number(n || 0).toLocaleString()}`;
  }

  function startIdle() {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setShowPopup(true);
      setCount(countdownLimit);
    }, idleLimit * 1000);
  }

  function resetIdle() {
    clearTimeout(idleTimer.current);
    clearInterval(countdownTimer.current);
    setShowPopup(false);
    startIdle();
  }

  async function logoutNow() {
    clearTimeout(idleTimer.current);
    clearInterval(countdownTimer.current);
    await fetch("http://localhost:4000/logout", { method: "POST", credentials: "include" });
    alert("You were logged out due to inactivity.");
    window.location.href = "/login";
  }

  useEffect(() => {
    const handler = () => resetIdle();
    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach(e => window.addEventListener(e, handler));
    startIdle();
    return () => {
      events.forEach(e => window.removeEventListener(e, handler));
      clearTimeout(idleTimer.current);
      clearInterval(countdownTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!showPopup) return;
    clearInterval(countdownTimer.current);
    countdownTimer.current = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          clearInterval(countdownTimer.current);
          logoutNow();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }, [showPopup]);

  async function fetchReports() {
    const [ov, st, tc] = await Promise.all([
      fetch("http://localhost:4000/admin/reports/overview", { credentials: "include" }),
      fetch("http://localhost:4000/admin/reports/service-types", { credentials: "include" }),
      fetch("http://localhost:4000/admin/reports/top-customers", { credentials: "include" })
    ]);

    if (ov.status === 401 || st.status === 401 || tc.status === 401) {
      alert("Session expired");
      window.location.href = "/login";
      return;
    }
    if (ov.status === 403 || st.status === 403 || tc.status === 403) {
      alert("Unauthorized");
      window.location.href = "/login";
      return;
    }

    setOverview(await ov.json());
    setServiceTypes(await st.json());
    setTopCustomers(await tc.json());
    setLoading(false);
  }

  useEffect(() => {
    const fetchReport = async () => {
      try {
        await fetchReports();
      } catch (err) {
        alert("Error fetching reports: " + err.message);
      } 
    };
    fetchReport();
  }, []);

  function formatTime(t) {
    const m = String(Math.floor(t / 60)).padStart(2, "0");
    const s = String(t % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  if (loading || !overview) return <div className="reports-loading">Loading reports...</div>;

  return (<>
  <AdminSidebar />
    <div className="reports-root">
      <div className="reports-header">
        <h1>Admin Reports</h1>
      </div>

      <section className="metrics-row">
        <div className="metric-box">
          <div className="metric-title">Total Pending</div>
          <div className="metric-value">{overview.totalPending}</div>
        </div>

        <div className="metric-box">
          <div className="metric-title">Services Today</div>
          <div className="metric-value">{overview.servicesToday}</div>
        </div>

        <div className="metric-box">
          <div className="metric-title">Total Completed</div>
          <div className="metric-value">{overview.totalCompleted}</div>
        </div>

        <div className="metric-box">
          <div className="metric-title">Monthly Revenue</div>
          <div className="metric-value">{formatCurrency(overview.monthlyRevenue)}</div>
        </div>
      </section>

      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-title">Service Type Distribution</div>

          <div className="pie-chart-container">
            <ServiceTypePie data={serviceTypes} size={350} />
          </div>

         <div className="pie-legend">
            {serviceTypes.map((t, i) => (
              <div key={i} className="legend-row">
                <div className="legend-swatch" style={{ background: `${COLORS[i%COLORS.length]}` }}></div>
                <span>{t.serviceType}</span>
                <span>({t.count})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Top 5 Customers by Spending</div>

          <table className="tc-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Total Spent</th>
              </tr>
            </thead>

            <tbody>
              {topCustomers.map((t, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{t.name}</td>
                  <td>{formatCurrency(t.totalSpent || t.total || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPopup && (
        <div className="idle-overlay">
          <div className="idle-card">
            <h3>Session Timeout Warning</h3>
            <p>You have been inactive.</p>
            <p>You will be logged out in:</p>
            <div className="idle-timer">{formatTime(count)}</div>

            <div className="idle-actions">
              <button className="btn-continue" onClick={resetIdle}>Continue</button>
              <button className="btn-logout" onClick={logoutNow}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
 </> );
}
