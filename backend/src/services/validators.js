import { STATUS } from "./incidentRules.js";

export const SEVERITY = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
export const CATEGORY = ["NETWORK", "SOFTWARE", "HARDWARE", "SECURITY", "OTHER"];

export function validateNewIncident(body) {
  const errors = [];

  if (!body.title || typeof body.title !== "string") errors.push("title is required");
  if (!body.description || typeof body.description !== "string") errors.push("description is required");

  if (!body.category || !CATEGORY.includes(body.category)) {
    errors.push(`category must be one of: ${CATEGORY.join(", ")}`);
  }

  if (!body.severity || !SEVERITY.includes(body.severity)) {
    errors.push(`severity must be one of: ${SEVERITY.join(", ")}`);
  }

  return errors;
}

export function validateStatus(nextStatus) {
  if (!Object.values(STATUS).includes(nextStatus)) {
    return `status must be one of: ${Object.values(STATUS).join(", ")}`;
  }
  return null;
}
