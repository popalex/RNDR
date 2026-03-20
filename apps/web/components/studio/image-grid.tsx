"use client";

import Image from "next/image";
import { Loader2, Download, Sparkles } from "lucide-react";
import type { GeneratedImage } from "@rndr/types";
import { cn } from "@/lib/utils";

interface ImageGridProps {
  images: GeneratedImage[];
  isLoading: boolean;
}

export function ImageGrid({ images, isLoading }: ImageGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-10 h-10 text-accent animate-pulse" />
          </div>
        </div>
        <div>
          <p className="text-text-primary font-medium mb-1">Rendering your vision</p>
          <p className="text-sm text-text-muted">This usually takes 5-15 seconds</p>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className="w-2 h-2 rounded-full bg-accent"
              style={{ 
                animation: 'pulse 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-2xl bg-bg-surface border border-border flex items-center justify-center">
          <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-text-primary font-medium mb-1">Your canvas awaits</p>
          <p className="text-sm text-text-muted leading-relaxed">
            Describe what you want to create and watch it come to life.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6",
        images.length === 1 ? "grid-cols-1 max-w-2xl mx-auto" : "grid-cols-1 sm:grid-cols-2"
      )}
    >
      {images.map((img, i) => (
        <div
          key={i}
          className="relative rounded-2xl overflow-hidden bg-bg-elevated border border-border group card-hover animate-slide-up"
          style={{ 
            aspectRatio: `${img.width} / ${img.height}`,
            animationDelay: `${i * 0.1}s`
          }}
        >
          <Image
            src={img.url}
            alt={`Generated image ${i + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <p className="text-sm text-white/80">{img.width} × {img.height}</p>
            <a
              href={img.url}
              download={`rndr-${Date.now()}-${i}.png`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary py-2 px-4 text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </div>
          
          {/* Corner accent */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
