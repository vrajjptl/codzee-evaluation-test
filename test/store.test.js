const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const store = require("../src/store");

describe("listTasks filters", () => {
  beforeEach(() => {
    store.resetStore();
    store.createTask({ title: "Write docs", priority: "low" });
    store.createTask({ title: "Fix auth bug", priority: "high", description: "token expiry" });
    const urgent = store.createTask({ title: "Ship release", priority: "high" });
    store.updateTask(urgent.id, { status: "in_progress" });
  });

  it("filters by priority", () => {
    const high = store.listTasks({ priority: "high" });
    assert.equal(high.length, 2);
  });

  it("filters by status", () => {
    const active = store.listTasks({ status: "in_progress" });
    assert.equal(active.length, 1);
    assert.equal(active[0].title, "Ship release");
  });

  it("supports text search across title and description", () => {
    const matches = store.listTasks({ q: "token" });
    assert.equal(matches.length, 1);
    assert.equal(matches[0].title, "Fix auth bug");
  });
});
