import { experimental_generateImage as generateImage } from "ai";
import { fal } from "@ai-sdk/fal";
import type { GenerationRequest, GeneratedImage } from "@rndr/types";
import type { Provider } from "./types";

/**
 * fal.ai provider implementation using the Vercel AI SDK.
 *
 * Docs: https://sdk.vercel.ai/providers/ai-sdk-providers/fal
 */
export class FalProvider implements Provider {
  readonly id = "fal" as const;
  readonly name = "fal.ai";

  async generate(request: GenerationRequest): Promise<GeneratedImage[]> {
    const {
      model,
      prompt,
      negativePrompt,
      numImages = 1,
      providerOptions,
    } = request;

    const result = await generateImage({
      model: fal.image(model),
      prompt,
      n: numImages,
      providerOptions: {
        fal: {
          ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
          ...providerOptions,
        },
      },
    });

    return result.images.map((img) => ({
      url: img.url,
      width: img.width ?? 1024,
      height: img.height ?? 1024,
    }));
  }
}
