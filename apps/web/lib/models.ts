import type { ImageModel } from "@rndr/types";

/** All models exposed to the UI. Add new providers/models here. */
export const AVAILABLE_MODELS: ImageModel[] = [
  {
    id: "fal-ai/flux/schnell",
    name: "FLUX Schnell",
    provider: "fal",
    description: "Ultra-fast 4-step FLUX model. Best for quick iterations.",
    maxImages: 4,
    supportedSizes: ["1024x1024"],
    supportedAspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
  },
  {
    id: "fal-ai/flux/dev",
    name: "FLUX Dev",
    provider: "fal",
    description: "High-quality 12-step FLUX model. Best for final outputs.",
    maxImages: 4,
    supportedSizes: ["1024x1024"],
    supportedAspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
  },
  {
    id: "fal-ai/stable-diffusion-v3-medium",
    name: "Stable Diffusion 3 Medium",
    provider: "fal",
    description: "Stable Diffusion 3 Medium – great prompt adherence.",
    maxImages: 4,
    supportedSizes: ["1024x1024"],
    supportedAspectRatios: ["1:1", "16:9", "9:16"],
  },
  {
    id: "fal-ai/nano-banana-2",
    name: "Nano Banana 2",
    provider: "fal",
    description: "Second-gen Nano Banana – improved quality, still blazing fast.",
    maxImages: 4,
    supportedSizes: ["512x512", "1024x1024"],
    supportedAspectRatios: ["1:1", "16:9", "9:16"],
  },
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0];
