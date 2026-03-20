"use client";

import Link from "next/link";
import { Show } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden relative">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Ambient gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center transition-all duration-300 group-hover:bg-accent/20 group-hover:border-accent/40">
            <span className="text-accent font-display text-xl">R</span>
          </div>
          <span className="font-display text-2xl tracking-tight text-text-primary">RNDR</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Show when="signed-out">
            <Link 
              href="/sign-in" 
              className="btn btn-ghost"
            >
              Sign in
            </Link>
            <Link 
              href="/sign-up" 
              className="btn btn-primary"
            >
              Get Started
            </Link>
          </Show>
          <Show when="signed-in">
            <Link 
              href="/studio" 
              className="btn btn-primary"
            >
              Open Studio
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </Show>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-16 sm:pt-24 lg:pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="stagger-children">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-surface border border-border-strong mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              <span className="text-sm text-text-secondary">Powered by fal.ai</span>
            </div>
            
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-6 text-balance">
              Render your
              <br />
              <span className="gradient-text">imagination</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-text-secondary max-w-lg mb-10 leading-relaxed">
              Transform words into stunning visuals. Access state-of-the-art 
              AI models through a refined, intuitive studio.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Show when="signed-out">
                <Link href="/sign-up" className="btn btn-primary text-base px-8 py-3.5">
                  Start Creating
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </Show>
              <Show when="signed-in">
                <Link href="/studio" className="btn btn-primary text-base px-8 py-3.5">
                  Open Studio
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </Show>
              <Link href="#features" className="btn btn-secondary text-base px-8 py-3.5">
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] rounded-2xl bg-bg-elevated border border-border overflow-hidden">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }} />
              
              {/* Floating elements */}
              <div className="absolute inset-8 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-text-muted text-sm">Your creations will appear here</p>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-accent/30 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-accent/30 rounded-br-2xl" />
            </div>
            
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-accent/5 rounded-3xl blur-2xl -z-10" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl mb-4">
            Built for creators
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Everything you need to bring ideas to life, nothing you don&apos;t.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 stagger-children">
          {[
            {
              title: "Multiple Models",
              description: "FLUX, Stable Diffusion, and more. One interface, every possibility.",
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              ),
            },
            {
              title: "Personal Gallery",
              description: "Every generation saved automatically. Browse and download anytime.",
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
            },
            {
              title: "Lightning Fast",
              description: "Optimized infrastructure. Ideas to images in seconds, not minutes.",
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
            },
          ].map((feature, i) => (
            <div 
              key={feature.title} 
              className="card card-hover p-8 group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 text-accent transition-colors group-hover:bg-accent/20">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text-primary">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="relative rounded-3xl bg-bg-elevated border border-border overflow-hidden p-12 sm:p-16 text-center">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }} />
          
          <div className="relative">
            <h2 className="font-display text-4xl sm:text-5xl mb-4">
              Ready to create?
            </h2>
            <p className="text-text-secondary text-lg max-w-md mx-auto mb-10">
              Join creators who are already rendering their imagination.
            </p>
            <Show when="signed-out">
              <Link href="/sign-up" className="btn btn-primary text-base px-10 py-4">
                Start for Free
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/studio" className="btn btn-primary text-base px-10 py-4">
                Open Studio
              </Link>
            </Show>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <span className="font-display text-lg text-text-secondary">RNDR</span>
            <span>·</span>
            <span>Built with fal.ai</span>
          </div>
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
