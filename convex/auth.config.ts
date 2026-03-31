/**
 * Convex authentication configuration for Clerk.
 *
 * Steps to configure:
 * 1. In your Clerk dashboard, go to JWT Templates → create a "Convex" template.
 * 2. Copy the Issuer URL (e.g. https://<your-subdomain>.clerk.accounts.dev).
 * 3. In the Convex dashboard (or via `npx convex env set`), set:
 *      CLERK_JWT_ISSUER_DOMAIN=https://<your-subdomain>.clerk.accounts.dev
 *
 * Convex will verify every incoming JWT against this issuer's JWKS endpoint.
 *
 * Docs: https://docs.convex.dev/auth/clerk
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN as string,
      applicationID: "convex",
    },
  ],
};
