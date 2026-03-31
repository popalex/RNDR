/**
 * Type declarations for Convex environment.
 * Convex provides process.env at runtime for accessing environment variables
 * set via `npx convex env set KEY value`.
 */

declare const process: {
  env: {
    CLERK_JWT_ISSUER_DOMAIN?: string;
    FAL_KEY?: string;
    [key: string]: string | undefined;
  };
};
