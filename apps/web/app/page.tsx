"use client";

import Link from "next/link";
import { Show } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/30 via-zinc-950 to-fuchsia-950/20 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Noise texture overlay */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">RNDR</span>
        </div>
        
        <nav className="flex items-center gap-6">
          <Show when="signed-out">
            <Link 
              href="/sign-in" 
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link 
              href="/sign-up" 
              className="text-sm px-4 py-2 rounded-lg bg-white text-zinc-900 font-medium hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
          </Show>
          <Show when="signed-in">
            <Link 
              href="/studio" 
              className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Open Studio
            </Link>
          </Show>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Powered by fal.ai
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Generate stunning images with{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed">
            Transform your ideas into beautiful visuals. RNDR gives you access to state-of-the-art 
            image generation models in a clean, intuitive studio.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Show when="signed-out">
              <Link 
                href="/sign-up" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
              >
                Start Creating
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link 
                href="/studio" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
              >
                Open Studio
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </Show>
            <Link 
              href="#features" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800/50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Hero image placeholder */}
        <div className="absolute top-20 right-0 w-[500px] h-[400px] rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-800 backdrop-blur-sm hidden lg:flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5" />
          <div className="text-zinc-600 text-sm">Generated images appear here</div>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(to right, rgb(255 255 255) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <h2 className="text-3xl font-bold mb-16 text-center">
          Everything you need to create
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Multiple Models",
              description: "Access FLUX, Stable Diffusion, and more state-of-the-art models from a single interface.",
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              ),
            },
            {
              title: "Your Gallery",
              description: "All your generations are saved automatically. Browse, search, and download anytime.",
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
            },
            {
              title: "Fast Generation",
              description: "Powered by fal.ai's optimized infrastructure for lightning-fast image creation.",
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
            },
          ].map((feature) => (
            <div 
              key={feature.title}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <div className="rounded-3xl bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 border border-violet-500/20 p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to create?</h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Sign up for free and start generating beautiful images in seconds.
          </p>
          <Show when="signed-out">
            <Link 
              href="/sign-up" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-zinc-900 font-semibold hover:bg-zinc-200 transition-colors"
            >
              Get Started — It's Free
            </Link>
          </Show>
          <Show when="signed-in">
            <Link 
              href="/studio" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-zinc-900 font-semibold hover:bg-zinc-200 transition-colors"
            >
              Go to Studio
            </Link>
          </Show>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 py-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-zinc-500">
          <span>© 2026 RNDR. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="https://github.com" className="hover:text-zinc-300 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
