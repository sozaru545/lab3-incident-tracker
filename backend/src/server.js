import express from "express";
import cors from "cors";
import { config } from "./config.js";
import incidentsRouter from "./routes/incidents.js";

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/incidents", incidentsRouter);

app.listen(config.port, () => {
  console.log(`Backend running on http://localhost:${config.port}`);
});
