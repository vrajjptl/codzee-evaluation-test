const ALLOWED_STATUSES = ["todo", "in_progress", "done"];

function parseId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    return { error: "Task id must be a positive integer" };
  }
  return { id };
}

function parseDueDate(raw) {
  if (raw === undefined || raw === null || raw === "") {
    return { value: null };
  }

  if (typeof raw !== "string" && typeof raw !== "number") {
    return { error: "dueDate must be an ISO date string or timestamp" };
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return { error: "dueDate must be a valid date" };
  }

  return { value: parsed.toISOString() };
}

function validateCreatePayload(body) {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be a JSON object" };
  }

  const title = body.title;
  if (title === undefined || title === null) {
    return { error: "title is required" };
  }

  if (typeof title !== "string") {
    return { error: "title must be a string" };
  }

  const trimmedTitle = title.trim();
  if (trimmedTitle.length === 0) {
    return { error: "title cannot be empty" };
  }

  if (trimmedTitle.length > 200) {
    return { error: "title must be 200 characters or fewer" };
  }

  const dueDateResult = parseDueDate(body.dueDate);
  if (dueDateResult.error) {
    return { error: dueDateResult.error };
  }

  const description =
    typeof body.description === "string" ? body.description.trim() : "";

  if (description.length > 2000) {
    return { error: "description must be 2000 characters or fewer" };
  }

  return {
    value: {
      title: trimmedTitle,
      description,
      dueDate: dueDateResult.value,
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

    const trimmedTitle = body.title.trim();
    if (trimmedTitle.length === 0) {
      return { error: "title cannot be empty" };
    }

    if (trimmedTitle.length > 200) {
      return { error: "title must be 200 characters or fewer" };
    }

    updates.title = trimmedTitle;
  }

  if (body.description !== undefined) {
    if (typeof body.description !== "string") {
      return { error: "description must be a string" };
    }

    const description = body.description.trim();
    if (description.length > 2000) {
      return { error: "description must be 2000 characters or fewer" };
    }

    updates.description = description;
  }

  if (body.status !== undefined) {
    if (!ALLOWED_STATUSES.includes(body.status)) {
      return { error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` };
    }
    updates.status = body.status;
  }

  if (body.dueDate !== undefined) {
    const dueDateResult = parseDueDate(body.dueDate);
    if (dueDateResult.error) {
      return { error: dueDateResult.error };
    }
    updates.dueDate = dueDateResult.value;
  }

  if (Object.keys(updates).length === 0) {
    return { error: "Provide at least one field to update" };
  }

  return { value: updates };
}

module.exports = {
  ALLOWED_STATUSES,
  parseId,
  parseDueDate,
  validateCreatePayload,
  validateUpdatePayload,
};
