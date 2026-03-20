"use client";

import { useQuery } from "convex/react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { api } from "@convex/_generated/api";

/** Shows all completed generations for the currently signed-in user. */
export function GalleryGrid() {
  // listByUser reads the caller's identity server-side — no args needed.
  const generations = useQuery(api.generations.listByUser);

  if (generations === undefined) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  const completed = generations.filter((g) => g.status === "completed");

  if (completed.length === 0) {
    return (
      <p className="text-zinc-500 text-sm">
        No images yet. Head to the{" "}
        <a href="/studio" className="text-violet-400 hover:underline">
          Studio
        </a>{" "}
        to generate your first image.
      </p>
    );
  }

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {completed.flatMap((gen) =>
        gen.images.map((img, i) => (
          <div
            key={`${gen._id}-${i}`}
            className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 break-inside-avoid group"
          >
            <Image
              src={img.url}
              alt={gen.prompt}
              width={img.width}
              height={img.height}
              className="w-full h-auto"
              title={gen.prompt}
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs line-clamp-2">{gen.prompt}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
