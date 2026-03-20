"use client";

import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300" htmlFor="prompt">
          Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A serene mountain landscape at golden hour, cinematic, 8k…"
          rows={4}
          className={cn(
            "w-full rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white",
            "placeholder:text-zinc-500 p-3 resize-none focus:outline-none",
            "focus:ring-2 focus:ring-violet-600 focus:border-transparent transition"
          )}
        />
      </div>

      <button
        type="button"
        onClick={() => setShowNegative((v) => !v)}
        className="text-xs text-zinc-500 hover:text-zinc-300 text-left transition"
      >
        {showNegative ? "− Hide" : "+ Add"} negative prompt
      </button>

      {showNegative && (
        <div className="flex flex-col gap-1.5">
          <label
            className="text-sm font-medium text-zinc-300"
            htmlFor="negative-prompt"
          >
            Negative Prompt
          </label>
          <textarea
            id="negative-prompt"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="blurry, low quality, watermark…"
            rows={2}
            className={cn(
              "w-full rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white",
              "placeholder:text-zinc-500 p-3 resize-none focus:outline-none",
              "focus:ring-2 focus:ring-violet-600 focus:border-transparent transition"
            )}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={!prompt.trim() || isLoading}
        className={cn(
          "flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-medium text-sm",
          "bg-violet-600 hover:bg-violet-500 text-white transition",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            Generate
          </>
        )}
      </button>
    </form>
  );
}
