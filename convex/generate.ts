import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// ---------------------------------------------------------------------------
// Internal fal.ai REST client
// ---------------------------------------------------------------------------

interface FalImage {
  url: string;
  width?: number;
  height?: number;
  seed?: number;
  content_type?: string;
}

interface FalResponse {
  images: FalImage[];
  /** Some fal.ai models return a top-level seed used for all images */
  seed?: number;
}

/**
 * Call fal.ai's synchronous run endpoint.
 * FAL_KEY must be set as a Convex environment variable:
 *   pnpm dlx convex env set FAL_KEY <your-key>
 */
async function callFal(
  model: string,
  prompt: string,
  opts: {
    negativePrompt?: string;
    numImages?: number;
    seed?: number;
    providerOptions?: unknown;
  }
): Promise<Array<{ url: string; width: number; height: number; seed?: number }>> {
  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    throw new Error(
      "FAL_KEY is not configured. Run: pnpm dlx convex env set FAL_KEY <your-key>"
    );
  }

  const body: Record<string, unknown> = {
    prompt,
    num_images: opts.numImages ?? 1,
    ...(opts.negativePrompt ? { negative_prompt: opts.negativePrompt } : {}),
    ...(opts.seed !== undefined ? { seed: opts.seed } : {}),
    ...(opts.providerOptions != null &&
    typeof opts.providerOptions === "object"
      ? (opts.providerOptions as Record<string, unknown>)
      : {}),
  };

  const res = await fetch(`https://fal.run/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${falKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`fal.ai error ${res.status}: ${msg}`);
  }

  const data = (await res.json()) as FalResponse;
  return (data.images ?? []).map((img) => ({
    url: img.url,
    width: img.width ?? 1024,
    height: img.height ?? 1024,
    seed: img.seed ?? data.seed,
  }));
}

// ---------------------------------------------------------------------------
// Convex Action
// ---------------------------------------------------------------------------

/**
 * Generate images via fal.ai — the Convex-native alternative to the
 * standalone ai-service Docker container.
 *
 * ## Why use this instead of the ai-service?
 *
 * | | ai-service (Docker) | Convex Action (this) |
 * |---|---|---|
 * | Infrastructure | Must host & manage a container | Serverless, zero ops |
 * | API key security | FAL_KEY in Docker env | FAL_KEY in Convex env vars |
 * | Auth secret | Needs AI_SERVICE_SECRET | Not needed |
 * | Real-time DB update | Manual (client calls mutations) | Handled inside action |
 * | Adding providers | New file + registry entry | Same: extend this action |
 *
 * ## Setup
 *
 * Set your fal.ai key in the Convex environment (not in .env.local):
 * ```sh
 * pnpm dlx convex env set FAL_KEY your-fal-api-key
 * ```
 *
 * ## Usage (React component)
 * ```ts
 * const generate = useAction(api.generate.generateImages);
 * const { generationId, images, durationMs } = await generate({
 *   prompt: "a cat in space",
 *   model: "fal-ai/flux/schnell",
 *   provider: "fal",
 *   numImages: 1,
 * });
 * ```
 *
 * The action automatically creates, progresses, and completes (or fails) the
 * matching `generations` row in Convex — no manual mutation calls required.
 */
export const generateImages = action({
  args: {
    prompt: v.string(),
    negativePrompt: v.optional(v.string()),
    model: v.string(),
    provider: v.union(
      v.literal("fal"),
      v.literal("openai"),
      v.literal("stability")
    ),
    numImages: v.optional(v.number()),
    seed: v.optional(v.number()),
    /** Pass-through options forwarded verbatim to the provider */
    providerOptions: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    if (args.provider !== "fal") {
      throw new Error(
        `Provider "${args.provider}" is not yet supported by the Convex action. ` +
          "Use the ai-service Docker container for non-fal providers."
      );
    }

    const startMs = Date.now();

    // 1. Persist a "pending" generation row (userId comes from the verified JWT)
    const generationId = await ctx.runMutation(api.generations.create, {
      prompt: args.prompt,
      negativePrompt: args.negativePrompt,
      model: args.model,
      provider: args.provider,
      numImages: args.numImages ?? 1,
    });

    // 2. Flip to "processing" so the UI can show a spinner
    await ctx.runMutation(api.generations.markProcessing, { id: generationId });

    try {
      // 3. Call fal.ai
      const images = await callFal(args.model, args.prompt, {
        negativePrompt: args.negativePrompt,
        numImages: args.numImages,
        seed: args.seed,
        providerOptions: args.providerOptions,
      });
      const durationMs = Date.now() - startMs;

      // 4. Store results and flip to "completed"
      await ctx.runMutation(api.generations.markCompleted, {
        id: generationId,
        images,
        durationMs,
      });

      return { generationId, images, durationMs };
    } catch (err) {
      await ctx.runMutation(api.generations.markFailed, {
        id: generationId,
        errorMessage: err instanceof Error ? err.message : "Unknown error",
      });
      throw err;
    }
  },
});
