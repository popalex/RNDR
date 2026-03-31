import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /**
   * Each row represents one image generation job submitted by a user.
   * The job may produce multiple output images (numImages > 1).
   */
  generations: defineTable({
    /** Clerk user ID (optional – supports anonymous usage) */
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
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    /** Array of generated image objects: { url, width, height, seed? } */
    images: v.array(
      v.object({
        url: v.string(),
        width: v.number(),
        height: v.number(),
        seed: v.optional(v.number()),
      })
    ),
    errorMessage: v.optional(v.string()),
    durationMs: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  /**
   * User profile / preferences stored in Convex.
   * The userId is the external auth provider ID (e.g. Clerk user ID).
   */
  users: defineTable({
    userId: v.string(),
    email: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    /** Default generation preferences */
    preferences: v.optional(
      v.object({
        defaultModel: v.optional(v.string()),
        defaultProvider: v.optional(v.string()),
        defaultNumImages: v.optional(v.number()),
      })
    ),
  }).index("by_user", ["userId"]),
});
