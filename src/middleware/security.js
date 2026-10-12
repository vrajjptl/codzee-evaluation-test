/**
 * Lightweight security middleware for the evaluation API.
 * Keeps dependencies minimal while demonstrating ownership of common risks.
 */

function securityHeaders(_req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-XSS-Protection", "0");
  next();
}

function createRateLimiter({ windowMs = 60_000, max = 100 } = {}) {
  const hits = new Map();

  return function rateLimiter(req, res, next) {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || now - entry.windowStart >= windowMs) {
      hits.set(key, { windowStart: now, count: 1 });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      res.setHeader("Retry-After", Math.ceil(windowMs / 1000));
      return res.status(429).json({ error: "Too many requests" });
    }

    return next();
  };
}

/**
 * Optional API key gate.
 * If API_KEY is unset, the API stays open for local demos.
 */
function requireApiKey(req, res, next) {
  const expected = process.env.API_KEY;
  if (!expected) {
    return next();
  }

  const provided = req.get("x-api-key");
  if (!provided || provided !== expected) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  return next();
}

module.exports = {
  securityHeaders,
  createRateLimiter,
  requireApiKey,
};
