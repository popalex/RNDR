import { GalleryGrid } from "@/components/gallery/gallery-grid";

export const metadata = { title: "Gallery – RNDR" };

export default function GalleryPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Gallery</h1>
      <GalleryGrid />
    </div>
  );
}
