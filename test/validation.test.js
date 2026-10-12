const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  parseId,
  parseListFilters,
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

describe("validateCreatePayload", () => {
  it("requires a title", () => {
    const result = validateCreatePayload({});
    assert.equal(result.error, "title is required");
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

  it("validates priority values", () => {
    const result = validateUpdatePayload({ priority: "urgent" });
    assert.match(result.error, /priority must be one of/);
  });
});

describe("parseListFilters", () => {
  it("parses supported query filters", () => {
    const result = parseListFilters({
      status: "todo",
      priority: "high",
      q: " docs ",
    });
    assert.deepEqual(result.value, {
      status: "todo",
      priority: "high",
      q: "docs",
    });
  });

  it("rejects unknown priority filters", () => {
    const result = parseListFilters({ priority: "critical" });
    assert.match(result.error, /priority filter must be one of/);
  });
});
