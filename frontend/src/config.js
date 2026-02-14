export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  showArchivedByDefault: process.env.NEXT_PUBLIC_SHOW_ARCHIVED_BY_DEFAULT === "true"
};
