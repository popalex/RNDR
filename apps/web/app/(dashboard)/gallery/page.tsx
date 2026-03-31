import { GalleryGrid } from "@/components/gallery/gallery-grid";

export const metadata = { title: "Gallery – RNDR" };

export default function GalleryPage() {
  return (
    <div className="p-6 lg:p-8 bg-bg-deep min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-text-primary mb-2">Gallery</h1>
          <p className="text-text-muted">All your creations, beautifully preserved.</p>
        </div>
        <GalleryGrid />
      </div>
    </div>
  );
}
