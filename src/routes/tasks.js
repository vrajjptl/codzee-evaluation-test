const express = require("express");
const taskService = require("../services/taskService");

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ data: taskService.listTasks() });
});

router.get("/:id", (req, res) => {
  const result = taskService.getTaskById(req.params.id);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  return res.status(result.status).json({ data: result.data });
});

router.post("/", (req, res) => {
  const result = taskService.createTask(req.body);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  return res.status(result.status).json({ data: result.data });
});

router.patch("/:id", (req, res) => {
  const result = taskService.updateTask(req.params.id, req.body);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  return res.status(result.status).json({ data: result.data });
});

router.delete("/:id", (req, res) => {
  const result = taskService.deleteTask(req.params.id);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  return res.status(result.status).send();
});

module.exports = router;
