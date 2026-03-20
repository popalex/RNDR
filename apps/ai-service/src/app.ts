import { Hono } from "hono";
import { logger } from "hono/logger";
import { generateRoute } from "./routes/generate";
import { modelsRoute } from "./routes/models";
import { secretMiddleware } from "./middleware/secret";

export const app = new Hono();

// Structured request logging
app.use("*", logger());

// Shared secret auth (skip for health check)
app.use("/generate", secretMiddleware);
app.use("/models", secretMiddleware);

// Health check – used by Docker / load balancer
app.get("/health", (c) => c.json({ status: "ok", timestamp: Date.now() }));

// Routes
app.route("/generate", generateRoute);
app.route("/models", modelsRoute);

export default app;
