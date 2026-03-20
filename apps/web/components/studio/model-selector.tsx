"use client";

import type { ImageModel } from "@rndr/types";
import { cn } from "@/lib/utils";
import { ChevronDown, Cpu } from "lucide-react";

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
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Cpu className="w-4 h-4 text-accent" />
        <label className="label mb-0">Model</label>
      </div>
      
      <div className="relative">
        <select
          value={selectedId}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "input appearance-none cursor-pointer pr-10",
            "hover:border-text-muted"
          )}
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      </div>
      
      {selected && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-bg-surface border border-border">
          <div className="w-1 h-full bg-accent/50 rounded-full shrink-0 self-stretch" />
          <div>
            <p className="text-xs text-text-secondary leading-relaxed">{selected.description}</p>
            <p className="text-xs text-text-muted mt-1">via {selected.provider}</p>
          </div>
        </div>
      )}
    </div>
  );
}
