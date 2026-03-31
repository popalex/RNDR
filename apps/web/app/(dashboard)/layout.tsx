"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Sidebar } from "@/components/layout/sidebar";

/**
 * Shared shell for authenticated dashboard routes.
 * Syncs the Clerk user to the Convex `users` table on every mount.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const upsertUser = useMutation(api.users.upsertCurrent);

  useEffect(() => {
    if (!isLoaded || !user) return;
    upsertUser({
      email: user.primaryEmailAddress?.emailAddress,
      displayName: user.fullName ?? user.username ?? undefined,
      avatarUrl: user.imageUrl,
    }).catch(console.error);
  }, [isLoaded, user, upsertUser]);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-deep">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">{children}</main>
    </div>
  );
}
