import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Look up the current user's profile. Returns null if not signed in. */
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return ctx.db
      .query("users")
      .withIndex("by_user", (q) =>
        q.eq("userId", identity.tokenIdentifier)
      )
      .unique();
  },
});

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/**
 * Upsert user profile — call this on every sign-in.
 * The userId is read from the verified JWT; fields that are not provided are
 * left unchanged on existing profiles (no accidental data clearing).
 */
export const upsertCurrent = mutation({
  args: {
    email: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const userId = identity.tokenIdentifier;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      // Only patch fields that were explicitly provided
      const patch: Record<string, string | undefined> = {};
      if (args.email !== undefined) patch.email = args.email;
      if (args.displayName !== undefined) patch.displayName = args.displayName;
      if (args.avatarUrl !== undefined) patch.avatarUrl = args.avatarUrl;
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(existing._id, patch);
      }
      return existing._id;
    }

    return ctx.db.insert("users", { userId, ...args });
  },
});

/** Update the current user's default generation preferences. */
export const updatePreferences = mutation({
  args: {
    preferences: v.object({
      defaultModel: v.optional(v.string()),
      defaultProvider: v.optional(v.string()),
      defaultNumImages: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { preferences }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_user", (q) =>
        q.eq("userId", identity.tokenIdentifier)
      )
      .unique();

    if (!user) throw new Error("User not found");
    await ctx.db.patch(user._id, { preferences });
  },
});

