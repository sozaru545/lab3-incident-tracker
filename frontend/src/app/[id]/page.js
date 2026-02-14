"use client";

import { useEffect, useState } from "react";
import { config } from "@/config";

const STATUS = ["OPEN", "INVESTIGATING", "RESOLVED", "ARCHIVED"];

function allowedOptions(current) {
  // UI mirrors backend rules (backend still enforces!)
  if (current === "OPEN") return ["INVESTIGATING", "ARCHIVED"];
  if (current === "INVESTIGATING") return ["RESOLVED"];
  if (current === "RESOLVED") return ["ARCHIVED"];
  if (current === "ARCHIVED") return ["OPEN"];
  return [];
}

export default function IncidentDetails({ params }) {
  const id = params.id;

  const [incident, setIncident] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    const res = await fetch(`${config.apiBaseUrl}/api/incidents/${id}`, { cache: "no-store" });
    if (!res.ok) {
      setError(await res.text());
      return;
    }
    setIncident(await res.json());
  }

  async function updateStatus(nextStatus) {
    setError("");
    const res = await fetch(`${config.apiBaseUrl}/api/incidents/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });

    if (!res.ok) {
      setError(await res.text());
      return;
    }
    setIncident(await res.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!incident) {
    return (
      <main className="card">
        <h2>Incident</h2>
        {error ? <p className="error">{error}</p> : <p>Loading...</p>}
      </main>
    );
  }

  const options = allowedOptions(incident.status);

  return (
    <main className="card">
      <h2>{incident.title}</h2>
      {error && <p className="error">{error}</p>}

      <p className="small"><b>ID:</b> {incident.id}</p>
      <p><b>Category:</b> {incident.category}</p>
      <p><b>Severity:</b> {incident.severity}</p>
      <p><b>Status:</b> <span className="badge">{incident.status}</span></p>
      <p className="small"><b>Reported:</b> {new Date(incident.reportedAt).toLocaleString()}</p>

      <div className="card" style={{ background: "#fafafa" }}>
        <h3>Description</h3>
        <p>{incident.description}</p>
      </div>

      <div className="card" style={{ background: "#fafafa" }}>
        <h3>Update Status</h3>
        {options.length === 0 ? (
          <p className="small">No valid transitions from current status.</p>
        ) : (
          <div className="row">
            {options.map((s) => (
              <button key={s} className={s === "ARCHIVED" ? "secondary" : "primary"} onClick={() => updateStatus(s)}>
                Set → {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
