import path from "path";

export const config = {
  port: process.env.PORT || 3000,
  dataFilePath:
    process.env.DATA_FILE_PATH ||
    path.join(process.cwd(), "data", "incidents.json"),

  // Default list behavior: archived hidden unless includeArchived=true
  showArchivedByDefault: process.env.SHOW_ARCHIVED_BY_DEFAULT === "true",

  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3001"
};
