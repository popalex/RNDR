import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/layout/convex-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "RNDR – AI Image Studio",
  description:
    "Transform your imagination into stunning visuals. Access state-of-the-art AI models through a refined, intuitive studio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className="font-body">
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <Toaster 
            richColors 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
