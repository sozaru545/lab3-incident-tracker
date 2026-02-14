"use client";

import { useState } from "react";
import { config } from "@/config";

export default function BulkUploadPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function upload(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Please choose a CSV file.");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${config.apiBaseUrl}/api/incidents/bulk-upload`, {
      method: "POST",
      body: form
    });

    if (!res.ok) {
      setError(await res.text());
      return;
    }

    setResult(await res.json());
  }

  return (
    <main className="card">
      <h2>Bulk Upload (CSV)</h2>

      <p className="small">
        CSV headers must be: <b>title,description,category,severity</b>
      </p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={upload}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <div style={{ marginTop: 12 }}>
          <button className="primary" type="submit">Upload</button>
        </div>
      </form>

      {result && (
        <div className="card" style={{ background: "#fafafa" }}>
          <h3>Result</h3>
          <p><b>Total Rows:</b> {result.totalRows}</p>
          <p><b>Created:</b> {result.created}</p>
          <p><b>Skipped:</b> {result.skipped}</p>
        </div>
      )}
    </main>
  );
}
