"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { toast } from "sonner";
import { api } from "@convex/_generated/api";
import type { GeneratedImage } from "@rndr/types";
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@/lib/models";
import { PromptForm } from "./prompt-form";
import { ModelSelector } from "./model-selector";
import { ImageGrid } from "./image-grid";

export function StudioPanel() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL.id);

  // Single Convex action handles DB lifecycle + fal.ai call in one round-trip.
  // FAL_KEY lives in the Convex environment — never exposed to the browser.
  const generateImages = useAction(api.generate.generateImages);

  const selectedModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) ?? DEFAULT_MODEL;

  async function handleGenerate(prompt: string, negativePrompt?: string) {
    setIsGenerating(true);
    setImages([]);

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
