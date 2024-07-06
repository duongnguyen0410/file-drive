import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";

export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be logged in to upload a file");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    const hasAccess =
      user.orgIds.includes(args.orgId) ||
      user.tokenIdentifier === identity.tokenIdentifier;
    if (!hasAccess) {
      throw new ConvexError("You do not have access to this org");
    }

    if (
      !user.orgIds.includes(args.orgId) &&
      user.tokenIdentifier !== identity.tokenIdentifier
    ) {
      throw new ConvexError("You do not have access to this org");
    }

    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    return ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});
