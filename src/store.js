/**
 * In-memory task store for the evaluation demo.
 * Not for production — intentionally simple so PRs can improve it.
 */

let nextId = 1;
const tasks = [];

function listTasks() {
  return [...tasks];
}

function getTask(id) {
  return tasks.find((task) => task.id === id) || null;
}

function createTask({ title, description = "", dueDate = null }) {
  const task = {
    id: nextId++,
    title,
    description,
    status: "todo",
    dueDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

function updateTask(id, updates) {
  const task = getTask(id);
  if (!task) return null;

  if (updates.title !== undefined) task.title = updates.title;
  if (updates.description !== undefined) task.description = updates.description;
  if (updates.status !== undefined) task.status = updates.status;
  if (updates.dueDate !== undefined) task.dueDate = updates.dueDate;
  task.updatedAt = new Date().toISOString();
  return task;
}

function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

function resetStore() {
  tasks.length = 0;
  nextId = 1;
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  resetStore,
};
