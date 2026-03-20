"use client";

import type { ImageModel } from "@rndr/types";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  models: ImageModel[];
  selectedId: string;
  onChange: (id: string) => void;
}

export function ModelSelector({
  models,
  selectedId,
  onChange,
}: ModelSelectorProps) {
  const selected = models.find((m) => m.id === selectedId) ?? models[0];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-zinc-300">Model</label>
      <select
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white",
          "px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-600",
          "focus:border-transparent transition"
        )}
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} ({model.provider})
          </option>
        ))}
      </select>
      {selected && (
        <p className="text-xs text-zinc-500">{selected.description}</p>
      )}
    </div>
  );
}
