"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImageIcon, GalleryHorizontalEnd, Settings, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/studio", label: "Studio", icon: Zap },
  { href: "/gallery", label: "Gallery", icon: GalleryHorizontalEnd },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 md:w-56 flex flex-col bg-zinc-950 border-r border-zinc-800 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-zinc-800">
        <ImageIcon className="w-6 h-6 text-violet-500 shrink-0" />
        <span className="hidden md:block font-bold tracking-tight text-white text-lg">
          RNDR
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg mx-2 text-sm font-medium transition-colors",
                active
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="hidden md:block">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
