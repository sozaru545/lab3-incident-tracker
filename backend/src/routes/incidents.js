import express from "express";
import multer from "multer";
import crypto from "crypto";
import { parse } from "csv-parse";
import { readAllIncidents, writeAllIncidents } from "../services/incidentStore.js";
import { STATUS, canTransitionStatus } from "../services/incidentRules.js";
import { validateNewIncident, validateStatus, CATEGORY, SEVERITY } from "../services/validators.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// LIST (hide archived by default)
router.get("/", async (req, res) => {
  const includeArchived = req.query.includeArchived === "true";
  const incidents = await readAllIncidents();

  const visible = includeArchived
    ? incidents
    : incidents.filter((i) => i.status !== STATUS.ARCHIVED);

  res.json(visible);
});

// READ ONE
router.get("/:id", async (req, res) => {
  const incidents = await readAllIncidents();
  const incident = incidents.find((i) => i.id === req.params.id);

  if (!incident) return res.status(404).json({ error: "Incident not found" });
  res.json(incident);
});

// CREATE
router.post("/", async (req, res) => {
  const errors = validateNewIncident(req.body);
  if (errors.length) return res.status(400).json({ error: errors.join("; ") });

  const incidents = await readAllIncidents();
  const now = new Date().toISOString();

  const newIncident = {
    id: crypto.randomUUID(),
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    category: req.body.category,
    severity: req.body.severity,
    status: STATUS.OPEN,
    reportedAt: now
  };

  incidents.push(newIncident);
  await writeAllIncidents(incidents);

  res.status(201).json(newIncident);
});

// UPDATE STATUS (includes ARCHIVE + RESET rules)
router.patch("/:id/status", async (req, res) => {
  const nextStatus = req.body.status;
  const statusErr = validateStatus(nextStatus);
  if (statusErr) return res.status(400).json({ error: statusErr });

  const incidents = await readAllIncidents();
  const idx = incidents.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Incident not found" });

  const current = incidents[idx].status;

  if (!canTransitionStatus(current, nextStatus)) {
    return res
      .status(400)
      .json({ error: `Invalid status transition: ${current} -> ${nextStatus}` });
  }

  incidents[idx].status = nextStatus;
  await writeAllIncidents(incidents);

  res.json(incidents[idx]);
});

// BULK UPLOAD CSV
// CSV columns expected: title,description,category,severity
router.post("/bulk-upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "CSV file is required (field name: file)" });

  const incidents = await readAllIncidents();

  const totalRows = { count: 0 };
  let created = 0;
  let skipped = 0;

  const toCreate = [];

  const parser = parse(req.file.buffer.toString("utf-8"), {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  for await (const row of parser) {
    totalRows.count += 1;

    const candidate = {
      title: row.title,
      description: row.description,
      category: row.category,
      severity: row.severity
    };

    const errors = validateNewIncident(candidate);

    if (errors.length) {
      skipped += 1;
      continue;
    }

    toCreate.push({
      id: crypto.randomUUID(),
      title: candidate.title.trim(),
      description: candidate.description.trim(),
      category: candidate.category,
      severity: candidate.severity,
      status: STATUS.OPEN,
      reportedAt: new Date().toISOString()
    });
  }

  incidents.push(...toCreate);
  await writeAllIncidents(incidents);

  created = toCreate.length;

  res.json({
    totalRows: totalRows.count,
    created,
    skipped
  });
});

export default router;
