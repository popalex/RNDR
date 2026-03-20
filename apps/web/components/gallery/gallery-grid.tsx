"use client";

import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Download, Calendar, Sparkles } from "lucide-react";
import { api } from "@convex/_generated/api";

/** Shows all completed generations for the currently signed-in user. */
export function GalleryGrid() {
  // listByUser reads the caller's identity server-side — no args needed.
  const generations = useQuery(api.generations.listByUser);

  if (generations === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
        <p className="text-text-muted text-sm">Loading your creations…</p>
      </div>
    );
  }

  const completed = generations.filter((g) => g.status === "completed");

  if (completed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-bg-surface border border-border flex items-center justify-center">
          <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-text-primary font-medium mb-2">Your gallery is empty</p>
          <p className="text-text-muted text-sm max-w-sm">
            Head to the{" "}
            <Link href="/studio" className="text-accent hover:underline">
              Studio
            </Link>{" "}
            to create your first masterpiece.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
      {completed.flatMap((gen) =>
        gen.images.map((img, i) => (
          <div
            key={`${gen._id}-${i}`}
            className="relative rounded-2xl overflow-hidden bg-bg-elevated border border-border break-inside-avoid group card-hover animate-fade-in"
          >
            <Image
              src={img.url}
              alt={gen.prompt}
              width={img.width}
              height={img.height}
              className="w-full h-auto"
              title={gen.prompt}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white/90 text-sm line-clamp-3 mb-3 leading-relaxed">{gen.prompt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white/60 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(gen._creationTime).toLocaleDateString()}
                  </div>
                  <a
                    href={img.url}
                    download={`rndr-gallery-${gen._id}-${i}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary py-1.5 px-3 text-xs"
                  >
                    <Download className="w-3 h-3" />
                    Save
                  </a>
                </div>
              </div>
            </div>
            
            {/* Corner badge */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
