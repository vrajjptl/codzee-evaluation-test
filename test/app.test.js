const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { createApp } = require("../src/app");
const store = require("../src/store");

function request(app, { method, path, body, headers = {} }) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      const payload = body ? JSON.stringify(body) : null;
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port,
          path,
          method,
          headers: {
            ...(payload
              ? {
                  "Content-Type": "application/json",
                  "Content-Length": Buffer.byteLength(payload),
                }
              : {}),
            ...headers,
          },
        },
        (res) => {
          let raw = "";
          res.on("data", (chunk) => {
            raw += chunk;
          });
          res.on("end", () => {
            server.close();
            let json = null;
            if (raw) {
              try {
                json = JSON.parse(raw);
              } catch {
                json = raw;
              }
            }
            resolve({ status: res.statusCode, headers: res.headers, body: json });
          });
        }
      );

      req.on("error", (error) => {
        server.close();
        reject(error);
      });

      if (payload) {
        req.write(payload);
      }
      req.end();
    });
  });
}

describe("HTTP API security and CRUD", () => {
  beforeEach(() => {
    store.resetStore();
    delete process.env.API_KEY;
  });

  it("exposes security headers on health checks", async () => {
    const app = createApp();
    const res = await request(app, { method: "GET", path: "/health" });
    assert.equal(res.status, 200);
    assert.equal(res.headers["x-content-type-options"], "nosniff");
    assert.equal(res.headers["x-frame-options"], "DENY");
    assert.equal(res.headers["x-powered-by"], undefined);
  });

  it("creates and fetches a task", async () => {
    const app = createApp();
    const created = await request(app, {
      method: "POST",
      path: "/api/tasks",
      body: { title: "Secure the API" },
    });

    assert.equal(created.status, 201);
    assert.equal(created.body.data.title, "Secure the API");

    const fetched = await request(app, {
      method: "GET",
      path: `/api/tasks/${created.body.data.id}`,
    });
    assert.equal(fetched.status, 200);
    assert.equal(fetched.body.data.id, created.body.data.id);
  });

  it("rejects requests when API_KEY is configured and missing", async () => {
    process.env.API_KEY = "secret-eval-key";
    const app = createApp();
    const res = await request(app, {
      method: "GET",
      path: "/api/tasks",
    });
    assert.equal(res.status, 401);
    assert.equal(res.body.error, "Invalid or missing API key");
  });

  it("allows authenticated requests when API_KEY is configured", async () => {
    process.env.API_KEY = "secret-eval-key";
    const app = createApp();
    const res = await request(app, {
      method: "GET",
      path: "/api/tasks",
      headers: { "x-api-key": "secret-eval-key" },
    });
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.data, []);
  });
});
