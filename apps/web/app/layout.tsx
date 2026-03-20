import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/layout/convex-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "RNDR – AI Image Studio",
  description:
    "Generate stunning images with state-of-the-art AI models. Powered by fal.ai and the Vercel AI SDK.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
