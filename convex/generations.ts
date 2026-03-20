import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetch all generations for the calling user, newest first. */
export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query("generations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

/** Fetch a single generation by its Convex ID. */
export const getById = query({
  args: { id: v.id("generations") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

/** Fetch all generations that are still in-flight (pending / processing). */
export const listInProgress = query({
  args: {},
  handler: async (ctx) => {
    const pending = await ctx.db
      .query("generations")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    const processing = await ctx.db
      .query("generations")
      .withIndex("by_status", (q) => q.eq("status", "processing"))
      .collect();
    return [...pending, ...processing];
  },
});

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Create a new generation job (status starts as "pending"). */
export const create = mutation({
  args: {
    userId: v.optional(v.string()),
    prompt: v.string(),
    negativePrompt: v.optional(v.string()),
    model: v.string(),
    provider: v.union(
      v.literal("fal"),
      v.literal("openai"),
      v.literal("stability")
    ),
    numImages: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("generations", {
      ...args,
      status: "pending",
      images: [],
    });
    return id;
  },
});

/** Mark a job as "processing" (called when the AI service picks it up). */
export const markProcessing = mutation({
  args: { id: v.id("generations") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: "processing" });
  },
});

/** Mark a job as "completed" and store the resulting images. */
export const markCompleted = mutation({
  args: {
    id: v.id("generations"),
    images: v.array(
      v.object({
        url: v.string(),
        width: v.number(),
        height: v.number(),
        seed: v.optional(v.number()),
      })
    ),
    durationMs: v.number(),
  },
  handler: async (ctx, { id, images, durationMs }) => {
    await ctx.db.patch(id, { status: "completed", images, durationMs });
  },
});

/** Mark a job as "failed" and store the error message. */
export const markFailed = mutation({
  args: {
    id: v.id("generations"),
    errorMessage: v.string(),
  },
  handler: async (ctx, { id, errorMessage }) => {
    await ctx.db.patch(id, { status: "failed", errorMessage });
  },
});

/** Delete a generation document. */
export const remove = mutation({
  args: { id: v.id("generations") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
