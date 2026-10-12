const express = require("express");
const tasksRouter = require("./routes/tasks");

function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "task-tracker-api" });
  });

  app.use("/api/tasks", tasksRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}

module.exports = { createApp };
