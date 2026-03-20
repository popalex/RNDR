"use client";

import { useState } from "react";
import { Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptFormProps {
  onSubmit: (prompt: string, negativePrompt?: string) => void;
  isLoading: boolean;
}

export function PromptForm({ onSubmit, isLoading }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [showNegative, setShowNegative] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt.trim(), negativePrompt.trim() || undefined);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="label" htmlFor="prompt">
          Describe your vision
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A serene mountain landscape bathed in golden hour light, cinematic composition, volumetric fog…"
          rows={5}
          className="input resize-none"
        />
        <p className="text-xs text-text-muted">
          Be specific about style, lighting, and mood for better results.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowNegative((v) => !v)}
        className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors self-start"
      >
        {showNegative ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {showNegative ? "Hide" : "Show"} negative prompt
      </button>

      <div className={cn(
        "grid transition-all duration-300 ease-expo",
        showNegative ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2 pb-1">
            <label className="label" htmlFor="negative-prompt">
              Exclude from image
            </label>
            <textarea
              id="negative-prompt"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="blurry, low quality, watermark, text, distorted…"
              rows={2}
              className="input resize-none"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!prompt.trim() || isLoading}
        className={cn(
          "btn w-full py-3 text-base font-semibold",
          isLoading 
            ? "bg-bg-surface text-text-secondary cursor-wait" 
            : "btn-primary"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Rendering…
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate
          </>
        )}
      </button>
    </form>
  );
}
