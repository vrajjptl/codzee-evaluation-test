const store = require("../store");
const {
  parseId,
  validateCreatePayload,
  validateUpdatePayload,
} = require("../validation");

function listTasks() {
  return store.listTasks();
}

function getTaskById(rawId) {
  const parsed = parseId(rawId);
  if (parsed.error) {
    return { status: 400, error: parsed.error };
  }

  const task = store.getTask(parsed.id);
  if (!task) {
    return { status: 404, error: "Task not found" };
  }

  return { status: 200, data: task };
}

function createTask(body) {
  const result = validateCreatePayload(body);
  if (result.error) {
    return { status: 400, error: result.error };
  }

  const task = store.createTask(result.value);
  return { status: 201, data: task };
}

function updateTask(rawId, body) {
  const parsed = parseId(rawId);
  if (parsed.error) {
    return { status: 400, error: parsed.error };
  }

  const result = validateUpdatePayload(body);
  if (result.error) {
    return { status: 400, error: result.error };
  }

  const task = store.updateTask(parsed.id, result.value);
  if (!task) {
    return { status: 404, error: "Task not found" };
  }

  return { status: 200, data: task };
}

function deleteTask(rawId) {
  const parsed = parseId(rawId);
  if (parsed.error) {
    return { status: 400, error: parsed.error };
  }

  const deleted = store.deleteTask(parsed.id);
  if (!deleted) {
    return { status: 404, error: "Task not found" };
  }

  return { status: 204 };
}

module.exports = {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
