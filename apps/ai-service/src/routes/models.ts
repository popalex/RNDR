import { Hono } from "hono";
import { listProviders } from "../providers";

export const modelsRoute = new Hono();

/** GET /models – returns all registered providers (for discovery). */
modelsRoute.get("/", (c) => {
  const providers = listProviders().map((p) => ({
    id: p.id,
    name: p.name,
  }));
  return c.json({ providers });
});
