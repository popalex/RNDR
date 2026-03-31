// ---------------------------------------------------------------------------
// Image Generation
// ---------------------------------------------------------------------------

/** The AI providers supported by the AI service */
export type ImageProvider = "fal" | "openai" | "stability";

/** Supported image aspect ratios */
export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

/** Supported image output sizes */
export type ImageSize =
  | "256x256"
  | "512x512"
  | "768x768"
  | "1024x1024"
  | "1280x720"
  | "720x1280";

/** A single model available from a provider */
export interface ImageModel {
  id: string;
  name: string;
  provider: ImageProvider;
  description: string;
  /** Maximum number of images that can be generated in one request */
  maxImages: number;
  supportedSizes: ImageSize[];
  supportedAspectRatios: AspectRatio[];
}

/** Parameters sent to the AI service to generate images */
export interface GenerationRequest {
  prompt: string;
  negativePrompt?: string;
  model: string;
  provider: ImageProvider;
  numImages?: number;
  size?: ImageSize;
  aspectRatio?: AspectRatio;
  seed?: number;
  /** Additional provider-specific options */
  providerOptions?: Record<string, unknown>;
}

/** A single generated image returned by the AI service */
export interface GeneratedImage {
  url: string;
  width: number;
  height: number;
  seed?: number;
}

/** Response from the AI service */
export interface GenerationResponse {
  images: GeneratedImage[];
  model: string;
  provider: ImageProvider;
  prompt: string;
  durationMs: number;
}

// ---------------------------------------------------------------------------
// Convex document types (mirrors the Convex schema)
// ---------------------------------------------------------------------------

/** Status of an image generation job stored in Convex */
export type GenerationStatus = "pending" | "processing" | "completed" | "failed";

/** A generation job stored in Convex */
export interface Generation {
  _id: string;
  userId?: string;
  prompt: string;
  negativePrompt?: string;
  model: string;
  provider: ImageProvider;
  numImages: number;
  status: GenerationStatus;
  images: GeneratedImage[];
  errorMessage?: string;
  durationMs?: number;
  createdAt: number;
  updatedAt: number;
}

// ---------------------------------------------------------------------------
// API contracts
// ---------------------------------------------------------------------------

/** Request body for POST /api/generate (web app → AI service) */
export type GenerateApiRequest = GenerationRequest;

/** Response body for POST /api/generate */
export type GenerateApiResponse = GenerationResponse;

/** Standard error response */
export interface ApiError {
  error: string;
  details?: string;
}
