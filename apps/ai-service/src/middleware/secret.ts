import { MiddlewareHandler } from "hono";

const secret = process.env.AI_SERVICE_SECRET;

// Warn loudly at startup if the shared secret is not configured
if (!secret) {
  console.warn(
    "[ai-service] WARNING: AI_SERVICE_SECRET is not set. " +
      "All requests are accepted without authentication. " +
      "Set this variable in production."
  );
}

/**
 * Simple shared-secret middleware.
 * The web app sends `x-service-secret` with every request.
 * Set AI_SERVICE_SECRET to the same value in both apps.
 *
 * If the env var is empty/not set, auth is disabled (useful in local dev).
 */
export const secretMiddleware: MiddlewareHandler = async (c, next) => {
  if (secret) {
    const provided = c.req.header("x-service-secret");
    if (provided !== secret) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  }
  await next();
};
