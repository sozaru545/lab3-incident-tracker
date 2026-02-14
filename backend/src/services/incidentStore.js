import fs from "fs/promises";
import path from "path";
import { config } from "../config.js";

async function ensureFileExists() {
  try {
    await fs.access(config.dataFilePath);
  } catch {
    const dir = path.dirname(config.dataFilePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(config.dataFilePath, JSON.stringify({ incidents: [] }, null, 2), "utf-8");
  }
}

export async function readAllIncidents() {
  await ensureFileExists();
  const raw = await fs.readFile(config.dataFilePath, "utf-8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.incidents) ? parsed.incidents : [];
}

export async function writeAllIncidents(incidents) {
  await ensureFileExists();
  await fs.writeFile(
    config.dataFilePath,
    JSON.stringify({ incidents }, null, 2),
    "utf-8"
  );
}
