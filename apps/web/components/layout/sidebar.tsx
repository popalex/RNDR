"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ImageIcon, GalleryHorizontalEnd, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/studio", label: "Studio", icon: Sparkles },
  { href: "/gallery", label: "Gallery", icon: GalleryHorizontalEnd },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 lg:w-64 flex flex-col bg-bg-base border-r border-border shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
          <span className="text-accent font-display text-xl">R</span>
        </div>
        <span className="hidden lg:block font-display text-xl tracking-tight text-text-primary">
          RNDR
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                active
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-text-secondary hover:bg-bg-surface hover:text-text-primary border border-transparent"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", active && "text-accent")} />
              <span className="hidden lg:block">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User account */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-bg-surface transition-colors">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 ring-2 ring-border ring-offset-2 ring-offset-bg-base",
              },
            }}
          />
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">Account</p>
            <p className="text-xs text-text-muted truncate">Manage profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
