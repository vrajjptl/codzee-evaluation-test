const express = require("express");
const tasksRouter = require("./routes/tasks");
const {
  securityHeaders,
  createRateLimiter,
  requireApiKey,
} = require("./middleware/security");

function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(securityHeaders);
  app.use(createRateLimiter({ windowMs: 60_000, max: 120 }));
  app.use(express.json({ limit: "16kb" }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "task-tracker-api" });
  });

  app.use("/api/tasks", requireApiKey, tasksRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use((err, _req, res, _next) => {
    if (err && err.type === "entity.too.large") {
      return res.status(413).json({ error: "Request body too large" });
    }

    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  });

  return app;
}

module.exports = { createApp };
