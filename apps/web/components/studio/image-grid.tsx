"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import type { GeneratedImage } from "@rndr/types";
import { cn } from "@/lib/utils";

interface ImageGridProps {
  images: GeneratedImage[];
  isLoading: boolean;
}

export function ImageGrid({ images, isLoading }: ImageGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-zinc-500">
        <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
        <p className="text-sm">Generating your image…</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 text-zinc-600">
        <p className="text-sm">Your generated images will appear here.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        images.length === 1 ? "grid-cols-1 max-w-xl" : "grid-cols-2"
      )}
    >
      {images.map((img, i) => (
        <div
          key={i}
          className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 group"
          style={{ aspectRatio: `${img.width} / ${img.height}` }}
        >
          <Image
            src={img.url}
            alt={`Generated image ${i + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Download overlay */}
          <a
            href={img.url}
            download={`rndr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${i}.png`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "absolute inset-0 flex items-end justify-end p-3",
              "opacity-0 group-hover:opacity-100 transition-opacity"
            )}
          >
            <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-md">
              Download
            </span>
          </a>
        </div>
      ))}
    </div>
  );
}
