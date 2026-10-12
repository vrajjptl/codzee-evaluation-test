const ALLOWED_STATUSES = ["todo", "in_progress", "done"];
const ALLOWED_PRIORITIES = ["low", "medium", "high"];

function parseId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    return { error: "Task id must be a positive integer" };
  }
  return { id };
}

function parsePriority(raw, { required = false } = {}) {
  if (raw === undefined || raw === null || raw === "") {
    if (required) {
      return { error: "priority is required" };
    }
    return { value: "medium" };
  }

  if (!ALLOWED_PRIORITIES.includes(raw)) {
    return {
      error: `priority must be one of: ${ALLOWED_PRIORITIES.join(", ")}`,
    };
  }

  return { value: raw };
}

function parseListFilters(query = {}) {
  const filters = {};

  if (query.status !== undefined && query.status !== "") {
    if (!ALLOWED_STATUSES.includes(query.status)) {
      return {
        error: `status filter must be one of: ${ALLOWED_STATUSES.join(", ")}`,
      };
    }
    filters.status = query.status;
  }

  if (query.priority !== undefined && query.priority !== "") {
    if (!ALLOWED_PRIORITIES.includes(query.priority)) {
      return {
        error: `priority filter must be one of: ${ALLOWED_PRIORITIES.join(", ")}`,
      };
    }
    filters.priority = query.priority;
  }

  if (query.q !== undefined && query.q !== "") {
    if (typeof query.q !== "string") {
      return { error: "q must be a string" };
    }
    filters.q = query.q.trim();
  }

  return { value: filters };
}

/**
 * NOTE: intentionally lenient — PR #1 will tighten title/dueDate validation.
 */
function validateCreatePayload(body) {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be a JSON object" };
  }

  const title = body.title;
  if (title === undefined || title === null) {
    return { error: "title is required" };
  }

  // Bug: empty / whitespace-only titles are accepted
  if (typeof title !== "string") {
    return { error: "title must be a string" };
  }

  let dueDate = null;
  if (body.dueDate !== undefined && body.dueDate !== null && body.dueDate !== "") {
    // Bug: invalid dates like "not-a-date" become Invalid Date and are stored as "Invalid Date"
    dueDate = new Date(body.dueDate).toISOString();
  }

  const priorityResult = parsePriority(body.priority);
  if (priorityResult.error) {
    return { error: priorityResult.error };
  }

  return {
    value: {
      title,
      description: typeof body.description === "string" ? body.description : "",
      dueDate,
      priority: priorityResult.value,
    },
  };
}

function validateUpdatePayload(body) {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be a JSON object" };
  }

  const updates = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string") {
      return { error: "title must be a string" };
    }
    updates.title = body.title;
  }

  if (body.description !== undefined) {
    if (typeof body.description !== "string") {
      return { error: "description must be a string" };
    }
    updates.description = body.description;
  }

  if (body.status !== undefined) {
    if (!ALLOWED_STATUSES.includes(body.status)) {
      return { error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` };
    }
    updates.status = body.status;
  }

  if (body.priority !== undefined) {
    const priorityResult = parsePriority(body.priority, { required: true });
    if (priorityResult.error) {
      return { error: priorityResult.error };
    }
    updates.priority = priorityResult.value;
  }

  if (body.dueDate !== undefined) {
    if (body.dueDate === null || body.dueDate === "") {
      updates.dueDate = null;
    } else {
      updates.dueDate = new Date(body.dueDate).toISOString();
    }
  }

  if (Object.keys(updates).length === 0) {
    return { error: "Provide at least one field to update" };
  }

  return { value: updates };
}

module.exports = {
  ALLOWED_STATUSES,
  ALLOWED_PRIORITIES,
  parseId,
  parsePriority,
  parseListFilters,
  validateCreatePayload,
  validateUpdatePayload,
};
