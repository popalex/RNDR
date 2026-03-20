import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Look up a user profile by their external auth ID. */
export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query("users")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Upsert user profile – call this on every sign-in. */
export const upsert = mutation({
  args: {
    userId: v.string(),
    email: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      const patch: Record<string, string | undefined> = {};
      if (args.email !== undefined) patch.email = args.email;
      if (args.displayName !== undefined) patch.displayName = args.displayName;
      if (args.avatarUrl !== undefined) patch.avatarUrl = args.avatarUrl;
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(existing._id, patch);
      }
      return existing._id;
    }

    return ctx.db.insert("users", args);
  },
});

/** Update a user's default generation preferences. */
export const updatePreferences = mutation({
  args: {
    userId: v.string(),
    preferences: v.object({
      defaultModel: v.optional(v.string()),
      defaultProvider: v.optional(v.string()),
      defaultNumImages: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { userId, preferences }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!user) throw new Error("User not found");
    await ctx.db.patch(user._id, { preferences });
  },
});
