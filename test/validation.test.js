const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  parseId,
  parseDueDate,
  validateCreatePayload,
  validateUpdatePayload,
} = require("../src/validation");

describe("parseId", () => {
  it("accepts positive integers", () => {
    assert.deepEqual(parseId("3"), { id: 3 });
  });

  it("rejects invalid ids", () => {
    assert.equal(parseId("abc").error !== undefined, true);
    assert.equal(parseId("0").error !== undefined, true);
  });
});

describe("parseDueDate", () => {
  it("accepts valid ISO dates", () => {
    const result = parseDueDate("2026-10-12T10:00:00.000Z");
    assert.equal(result.value, "2026-10-12T10:00:00.000Z");
  });

  it("rejects invalid dates", () => {
    const result = parseDueDate("not-a-date");
    assert.equal(result.error, "dueDate must be a valid date");
  });
});

describe("validateCreatePayload", () => {
  it("requires a title", () => {
    const result = validateCreatePayload({});
    assert.equal(result.error, "title is required");
  });

  it("rejects blank titles", () => {
    const result = validateCreatePayload({ title: "   " });
    assert.equal(result.error, "title cannot be empty");
  });

  it("trims titles before saving", () => {
    const result = validateCreatePayload({ title: "  Ship PR  " });
    assert.equal(result.value.title, "Ship PR");
  });

  it("accepts a basic payload", () => {
    const result = validateCreatePayload({ title: "Write tests" });
    assert.equal(result.error, undefined);
    assert.equal(result.value.title, "Write tests");
  });
});

describe("validateUpdatePayload", () => {
  it("rejects empty updates", () => {
    const result = validateUpdatePayload({});
    assert.equal(result.error, "Provide at least one field to update");
  });

  it("validates status values", () => {
    const result = validateUpdatePayload({ status: "archived" });
    assert.match(result.error, /status must be one of/);
  });

  it("rejects invalid due dates on update", () => {
    const result = validateUpdatePayload({ dueDate: "tomorrow-ish" });
    assert.equal(result.error, "dueDate must be a valid date");
  });
});
