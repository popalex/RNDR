import type { ImageProvider, GenerationRequest, GeneratedImage } from "@rndr/types";

/**
 * Every AI provider must implement this interface.
 * Adding a new provider is as simple as implementing this interface
 * and registering it in `registry.ts`.
 */
export interface Provider {
  /** Unique identifier – must match the ImageProvider type */
  readonly id: ImageProvider;
  /** Human-readable name */
  readonly name: string;
  /**
   * Generate images for the given request.
   * Throws on failure.
   */
  generate(request: GenerationRequest): Promise<GeneratedImage[]>;
}
