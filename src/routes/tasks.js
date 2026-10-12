const express = require("express");
const store = require("../store");
const {
  parseId,
  parseListFilters,
  validateCreatePayload,
  validateUpdatePayload,
} = require("../validation");

const router = express.Router();

router.get("/", (req, res) => {
  const filters = parseListFilters(req.query);
  if (filters.error) {
    return res.status(400).json({ error: filters.error });
  }

  return res.json({ data: store.listTasks(filters.value) });
});

router.get("/:id", (req, res) => {
  const parsed = parseId(req.params.id);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  const task = store.getTask(parsed.id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  return res.json({ data: task });
});

router.post("/", (req, res) => {
  const result = validateCreatePayload(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  const task = store.createTask(result.value);
  return res.status(201).json({ data: task });
});

router.patch("/:id", (req, res) => {
  const parsed = parseId(req.params.id);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  const result = validateUpdatePayload(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  const task = store.updateTask(parsed.id, result.value);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  return res.json({ data: task });
});

router.delete("/:id", (req, res) => {
  const parsed = parseId(req.params.id);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  const deleted = store.deleteTask(parsed.id);
  if (!deleted) {
    return res.status(404).json({ error: "Task not found" });
  }

  return res.status(204).send();
});

module.exports = router;
