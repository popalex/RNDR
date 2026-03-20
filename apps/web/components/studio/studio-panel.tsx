"use client";

import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@convex/_generated/api";
import type { GenerateApiRequest, GenerateApiResponse, GeneratedImage } from "@rndr/types";
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@/lib/models";
import { PromptForm } from "./prompt-form";
import { ModelSelector } from "./model-selector";
import { ImageGrid } from "./image-grid";

/**
 * Which generation backend to use.
 * Set NEXT_PUBLIC_GENERATION_BACKEND in .env.local:
 *   "convex"     → Convex Action (default, no Docker required)
 *   "ai-service" → Docker ai-service via /api/generate
 */
const BACKEND = process.env.NEXT_PUBLIC_GENERATION_BACKEND ?? "convex";

export function StudioPanel() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL.id);

  // Option A – Convex Action (hooks must always be called, even if unused)
  const generateImages = useAction(api.generate.generateImages);

  // Option B – Docker ai-service (manual DB lifecycle)
  const createGeneration = useMutation(api.generations.create);
  const markCompleted = useMutation(api.generations.markCompleted);
  const markFailed = useMutation(api.generations.markFailed);

  const selectedModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) ?? DEFAULT_MODEL;

  async function handleGenerate(prompt: string, negativePrompt?: string) {
    setIsGenerating(true);
    setImages([]);

    if (BACKEND === "ai-service") {
      // -----------------------------------------------------------------------
      // Option B: Docker ai-service
      // Requires AI_SERVICE_URL + AI_SERVICE_SECRET + the container running.
      // -----------------------------------------------------------------------
      const generationId = await createGeneration({
        prompt,
        negativePrompt,
        model: selectedModel.id,
        provider: selectedModel.provider,
        numImages: 1,
      });

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            negativePrompt,
            model: selectedModel.id,
            provider: selectedModel.provider,
            numImages: 1,
          } as GenerateApiRequest),
        });

        if (!res.ok) {
          const err = (await res.json().catch(() => ({ error: "Unknown error" }))) as {
            error: string;
          };
          throw new Error(err.error ?? "Generation failed");
        }

        const data = (await res.json()) as GenerateApiResponse;
        await markCompleted({
          id: generationId,
          images: data.images,
          durationMs: data.durationMs,
        });

        setImages(data.images);
        toast.success(
          `Generated ${data.images.length} image(s) in ${(data.durationMs / 1000).toFixed(1)}s`
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Generation failed";
        await markFailed({ id: generationId, errorMessage: message });
        toast.error(message);
      } finally {
        setIsGenerating(false);
      }
    } else {
      // -----------------------------------------------------------------------
      // Option A: Convex Action (default)
      // Requires FAL_KEY set in Convex env vars. No Docker needed.
      // -----------------------------------------------------------------------
      try {
        const result = await generateImages({
          prompt,
          negativePrompt,
          model: selectedModel.id,
          provider: selectedModel.provider,
          numImages: 1,
        });

        setImages(result.images);
        toast.success(
          `Generated ${result.images.length} image(s) in ${(result.durationMs / 1000).toFixed(1)}s`
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Generation failed";
        toast.error(message);
      } finally {
        setIsGenerating(false);
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-800">
        <h1 className="text-xl font-semibold">Studio</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel – controls */}
        <aside className="w-80 shrink-0 border-r border-zinc-800 flex flex-col gap-6 p-6 overflow-y-auto">
          <ModelSelector
            models={AVAILABLE_MODELS}
            selectedId={selectedModelId}
            onChange={setSelectedModelId}
          />
          <PromptForm
            onSubmit={handleGenerate}
            isLoading={isGenerating}
          />
        </aside>

        {/* Right panel – output */}
        <div className="flex-1 p-6 overflow-y-auto">
          <ImageGrid images={images} isLoading={isGenerating} />
        </div>
      </div>
    </div>
  );
}
