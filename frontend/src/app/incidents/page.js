"use client";

import { useEffect, useState } from "react";
import { config } from "@/config";

async function fetchIncidents(includeArchived) {
  const qs = includeArchived ? "?includeArchived=true" : "";
  const res = await fetch(`${config.apiBaseUrl}/api/incidents${qs}`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function IncidentsDashboard() {
  const [includeArchived, setIncludeArchived] = useState(config.showArchivedByDefault);
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const data = await fetchIncidents(includeArchived);
      setIncidents(data);
    } catch (e) {
      setError(String(e.message || e));
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeArchived]);

  return (
    <main className="card">
      <h2>Dashboard</h2>

      <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
        <input
          type="checkbox"
          checked={includeArchived}
          onChange={(e) => setIncludeArchived(e.target.checked)}
          style={{ width: 18, height: 18 }}
        />
        Show archived incidents
      </label>

      {error && <p className="error">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Reported</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((i) => (
            <tr key={i.id}>
              <td><a href={`/incidents/${i.id}`}>{i.title}</a></td>
              <td>{i.category}</td>
              <td>{i.severity}</td>
              <td><span className="badge">{i.status}</span></td>
              <td className="small">{new Date(i.reportedAt).toLocaleString()}</td>
            </tr>
          ))}
          {incidents.length === 0 && (
            <tr>
              <td colSpan="5" className="small">No incidents found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
