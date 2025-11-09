import { Link } from "wouter";
import { Sparkles, Zap, FileText, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover-elevate rounded-md px-3 py-2 -ml-3" data-testid="link-home">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">GenAIMagic.io</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">
              Terms
            </Link>
            <Link href="/disclaimer" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-disclaimer">
              Disclaimer
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="mx-auto max-w-5xl px-6 py-20 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border bg-card/80 backdrop-blur-sm text-sm font-medium shadow-lg">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span>100% Free AI Content Generator</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            Turn Product Ideas into
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              SEO-Ready Blog Posts
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed">
            Our GenAiMagic trained AI Agent transforms product details and research into polished, conversion-focused affiliate content—<span className="font-semibold text-foreground">completely free</span>.
          </p>

          <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            No signup. No credit card. Just enter your product info, add your sources, and get ready-to-publish blog posts in seconds.
          </p>

          <Link href="/app" data-testid="link-get-started">
            <Button 
              size="lg" 
              className="gap-2 text-lg shadow-2xl hover:shadow-primary/25 transition-shadow duration-300" 
              data-testid="button-get-started"
            >
              <Zap className="w-5 h-5" />
              Start Creating Free
            </Button>
          </Link>

          <div className="mt-24 grid gap-6 md:grid-cols-3">
            <Card 
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/10" 
              data-testid="feature-ai-powered"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 shadow-lg">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-3">GenAiMagic AI</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Powered by our trained AI agent to create engaging, high-quality content optimized for conversions.
              </p>
            </Card>

            <Card 
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/10" 
              data-testid="feature-multi-source"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 shadow-lg">
                <Globe className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Multi-Source Research</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Add URLs or paste text from reviews, specs, and product pages. The AI synthesizes everything.
              </p>
            </Card>

            <Card 
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/10" 
              data-testid="feature-instant-export"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 shadow-lg">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Instant Export</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get plain text and HTML versions ready for WordPress, Medium, or anywhere you publish.
              </p>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>
                &copy; {new Date().getFullYear()} GenAIMagic.io | Powered by{" "}
                <a 
                  href="https://dorlink.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors underline"
                  data-testid="link-dorlink"
                >
                  dorlink.me
                </a>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-footer-privacy">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="link-footer-terms">
                Terms of Use
              </Link>
              <Link href="/affiliate-disclaimer" className="hover:text-foreground transition-colors" data-testid="link-footer-affiliate">
                Affiliate Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
