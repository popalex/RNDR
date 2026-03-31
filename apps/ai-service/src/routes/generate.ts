import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { GenerationResponse } from "@rndr/types";
import { getProvider } from "../providers";

const generateSchema = z.object({
  prompt: z.string().min(1, "prompt is required"),
  negativePrompt: z.string().optional(),
  model: z.string().min(1, "model is required"),
  provider: z.enum(["fal", "openai", "stability"]),
  numImages: z.number().int().min(1).max(8).default(1),
  seed: z.number().optional(),
  providerOptions: z.record(z.unknown()).optional(),
});

export const generateRoute = new Hono();

generateRoute.post(
  "/",
  zValidator("json", generateSchema),
  async (c) => {
    const body = c.req.valid("json");
    const startMs = Date.now();

    const provider = getProvider(body.provider);
    const images = await provider.generate(body);
    const durationMs = Date.now() - startMs;

    const response: GenerationResponse = {
      images,
      model: body.model,
      provider: body.provider,
      prompt: body.prompt,
      durationMs,
    };

    return c.json(response);
  }
);
