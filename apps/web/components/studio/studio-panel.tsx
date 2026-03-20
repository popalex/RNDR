"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@convex/_generated/api";
import type { GenerateApiRequest, GenerateApiResponse, GeneratedImage } from "@rndr/types";
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@/lib/models";
import { PromptForm } from "./prompt-form";
import { ModelSelector } from "./model-selector";
import { ImageGrid } from "./image-grid";

export function StudioPanel() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL.id);

  const createGeneration = useMutation(api.generations.create);
  const markCompleted = useMutation(api.generations.markCompleted);
  const markFailed = useMutation(api.generations.markFailed);

  const selectedModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) ?? DEFAULT_MODEL;

  async function handleGenerate(prompt: string, negativePrompt?: string) {
    setIsGenerating(true);
    setImages([]);

    // 1. Create a "pending" generation in Convex for real-time tracking
    // TODO: replace "anonymous" with the real authenticated user ID
    const generationId = await createGeneration({
      userId: "anonymous",
      prompt,
      negativePrompt,
      model: selectedModel.id,
      provider: selectedModel.provider,
      numImages: 1,
    });

    const request: GenerateApiRequest = {
      prompt,
      negativePrompt,
      model: selectedModel.id,
      provider: selectedModel.provider,
      numImages: 1,
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error ?? "Generation failed");
      }

      const data = (await res.json()) as GenerateApiResponse;

      // 2. Update Convex with the results
      await markCompleted({
        id: generationId,
        images: data.images,
        durationMs: data.durationMs,
      });

      setImages(data.images);
      toast.success(`Generated ${data.images.length} image(s) in ${(data.durationMs / 1000).toFixed(1)}s`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      await markFailed({ id: generationId, errorMessage: message });
      toast.error(message);
    } finally {
      setIsGenerating(false);
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
