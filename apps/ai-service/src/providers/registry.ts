import type { ImageProvider } from "@rndr/types";
import type { Provider } from "./types";
import { FalProvider } from "./fal";
// import { OpenAIProvider } from "./openai"; // future
// import { StabilityProvider } from "./stability"; // future

/**
 * Central registry of all available providers.
 * To add a new provider:
 *   1. Create a new file in this directory implementing the Provider interface.
 *   2. Import it here and add an instance to the `providers` array.
 */
const providers: Provider[] = [new FalProvider()];

const registry = new Map<ImageProvider, Provider>(
  providers.map((p) => [p.id, p])
);

/** Look up a provider by its ID. Throws if not found. */
export function getProvider(id: ImageProvider): Provider {
  const provider = registry.get(id);
  if (!provider) {
    throw new Error(
      `Unknown provider "${id}". Available: ${[...registry.keys()].join(", ")}`
    );
  }
  return provider;
}

/** List all registered providers (used by /models route). */
export function listProviders(): Provider[] {
  return [...registry.values()];
}
