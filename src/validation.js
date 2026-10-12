const ALLOWED_STATUSES = ["todo", "in_progress", "done"];

function parseId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    return { error: "Task id must be a positive integer" };
  }
  return { id };
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

  return {
    value: {
      title,
      description: typeof body.description === "string" ? body.description : "",
      dueDate,
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
  parseId,
  validateCreatePayload,
  validateUpdatePayload,
};
