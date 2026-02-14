"use client";

import { useState } from "react";
import { config } from "@/config";

const CATEGORY = ["NETWORK", "SOFTWARE", "HARDWARE", "SECURITY", "OTHER"];
const SEVERITY = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function NewIncidentPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "OTHER",
    severity: "LOW"
  });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setOk("");

    const res = await fetch(`${config.apiBaseUrl}/api/incidents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      setError(await res.text());
      return;
    }

    const data = await res.json();
    setOk(`Created incident: ${data.id}`);
    window.location.href = `/incidents/${data.id}`;
  }

  return (
    <main className="card">
      <h2>Create Incident</h2>
      {error && <p className="error">{error}</p>}
      {ok && <p>{ok}</p>}

      <form onSubmit={submit} className="row">
        <div style={{ flex: "1 1 300px" }}>
          <label>Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        <div style={{ flex: "1 1 300px" }}>
          <label>Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORY.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ flex: "1 1 300px" }}>
          <label>Severity</label>
          <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
            {SEVERITY.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ flex: "1 1 100%" }}>
          <label>Description</label>
          <textarea rows="6" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div style={{ flex: "1 1 100%" }}>
          <button className="primary" type="submit">Create</button>
        </div>
      </form>
    </main>
  );
}
