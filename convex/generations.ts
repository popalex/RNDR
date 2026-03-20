import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Fetch all completed generations for the authenticated user, newest first.
 * Returns an empty array for unauthenticated callers.
 */
export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return ctx.db
      .query("generations")
      .withIndex("by_user", (q) =>
        q.eq("userId", identity.tokenIdentifier)
      )
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

/**
 * Create a new generation job (status starts as "pending").
 * The userId is read from the verified JWT — never trusted from the client.
 */
export const create = mutation({
  args: {
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
    const identity = await ctx.auth.getUserIdentity();
    const id = await ctx.db.insert("generations", {
      ...args,
      userId: identity?.tokenIdentifier,
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

/** Delete a generation document (only the owner may delete it). */
export const remove = mutation({
  args: { id: v.id("generations") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    const generation = await ctx.db.get(id);
    if (
      generation?.userId &&
      generation.userId !== identity?.tokenIdentifier
    ) {
      throw new Error("Unauthorized");
    }
    await ctx.db.delete(id);
  },
});

