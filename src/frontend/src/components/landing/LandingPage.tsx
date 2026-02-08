import { useState } from 'react';
import LoginButton from '../auth/LoginButton';
import { Sparkles, Shield, Brain, Heart, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLiveUrl, copyLiveUrlToClipboard } from '@/utils/liveUrl';
import { toast } from 'sonner';

export default function LandingPage() {
  const [copied, setCopied] = useState(false);
  const liveUrl = getLiveUrl();

  const handleCopyUrl = async () => {
    const success = await copyLiveUrlToClipboard();
    if (success) {
      setCopied(true);
      toast.success('Live URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy URL');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/generated/map-hero-bg.dim_1600x900.png"
            alt=""
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-border/40 bg-background/80 backdrop-blur-md">
          <div className="container mx-auto flex h-20 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <img
                src="/assets/generated/map-logo.dim_512x512.png"
                alt="My Algorithm"
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">My Algorithm</h1>
                <p className="text-xs text-muted-foreground">Transform your digital habits</p>
              </div>
            </div>
            <LoginButton />
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                Reclaim Your Mind.
                <br />
                Rebuild Your Patterns.
                <br />
                <span className="text-primary">Redesign Your Life.</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                In a digital world designed to capture your attention, your focus has become a valuable resource. But true change doesn't come from surveillance, manipulation, or invasive data collection. It comes from awareness — the kind you choose.
              </p>
            </div>

            <div className="pt-6 flex flex-col items-center gap-4">
              <LoginButton />
              
              {/* Live URL Display */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Live at:</span>
                <code className="px-2 py-1 bg-muted rounded text-xs font-mono">{liveUrl}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="h-7 w-7 p-0"
                  title="Copy URL"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophy Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
                Built on One Simple, Powerful Truth
              </h3>
              <p className="text-xl font-semibold text-primary">
                You can only improve what you consciously observe.
              </p>
            </div>

            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-muted-foreground leading-relaxed">
                We don't watch you online. We don't track you in the shadows. We don't pull hidden data from your browsing, your apps, or your behavior. Instead, we honor you — your privacy, your autonomy, your right to grow without being exploited.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Everything you learn here comes from what <strong>you</strong> choose to log: your moods, your impulses, your habits, your spending, your triggers, your late-night scrolling patterns, your wins, your setbacks. When you see your own patterns clearly, you finally gain the power to rewire them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
              Where Three Forces Converge
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4 text-center p-6 rounded-lg border border-border/40 bg-card/50 hover:bg-card transition-colors">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-bold">Motivational</h4>
                <p className="text-muted-foreground leading-relaxed">
                  This isn't just about breaking addiction. It's about rebuilding the version of you that's been buried under noise, distraction, and digital dependency.
                </p>
              </div>

              <div className="space-y-4 text-center p-6 rounded-lg border border-border/40 bg-card/50 hover:bg-card transition-colors">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-bold">Scientific</h4>
                <p className="text-muted-foreground leading-relaxed">
                  By tracking your behaviors with honesty and intention, you learn to reverse-engineer the addictive loops that the internet has trained into you.
                </p>
              </div>

              <div className="space-y-4 text-center p-6 rounded-lg border border-border/40 bg-card/50 hover:bg-card transition-colors">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-bold">Therapeutic</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Where therapy meets self-design. Where transformation becomes a daily practice instead of a distant hope.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section - Bruce Lipton */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl">
            <blockquote className="relative p-8 md:p-12 rounded-2xl border-2 border-primary/20 bg-background/80 backdrop-blur-sm shadow-soft-lg">
              <div className="absolute -top-6 left-8 bg-background px-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <p className="text-2xl md:text-3xl font-serif italic text-foreground leading-relaxed mb-6">
                "The moment you change your perception is the moment you rewrite the chemistry of your body."
              </p>
              <footer className="text-right">
                <cite className="text-lg font-semibold not-italic text-primary">— Bruce Lipton</cite>
                <p className="text-sm text-muted-foreground mt-1">Cell Biologist & Author</p>
              </footer>
            </blockquote>
            <p className="text-center text-lg text-muted-foreground mt-8">
              This app helps you do exactly that.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl space-y-8">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-center">
              Your Data. Your Insights. Your Power.
            </h3>
            
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-muted-foreground leading-relaxed">
                This app is built on explicit consent and data minimization. We only use what you voluntarily choose to provide:
              </p>
              
              <ul className="space-y-3 text-muted-foreground">
                <li><strong>Mood logs</strong> — Track your emotional patterns over time</li>
                <li><strong>Spending logs</strong> — Identify shopping triggers and impulses</li>
                <li><strong>Time-of-day habits</strong> — Discover when you're most vulnerable</li>
                <li><strong>Triggers and reflections</strong> — Understand what drives your behavior</li>
                <li><strong>Productivity ratings</strong> — Measure your progress authentically</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed">
                By tracking your behaviors with honesty and intention, you learn to reverse-engineer the addictive loops that the internet has trained into you — the reward cycles, the compulsive checking, the endless micro-dopamine hits that shape your mood and steal your time.
              </p>

              <p className="text-muted-foreground leading-relaxed font-semibold">
                And then? You dismantle them. Step by step. Day by day. Pattern by pattern.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section - Caffeine AI */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl">
            <blockquote className="relative p-8 md:p-12 rounded-2xl border-2 border-border/40 bg-background shadow-soft-lg">
              <div className="absolute -top-6 left-8 bg-background px-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-6">
                "We honor you — your privacy, your autonomy, your right to grow without being exploited. True change comes from awareness, the kind you choose."
              </p>
              <footer className="text-right">
                <cite className="text-lg font-semibold not-italic text-primary">— Caffeine AI</cite>
                <p className="text-sm text-muted-foreground mt-1">Built with respect for human agency</p>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                This is your blueprint.
                <br />
                Your clarity.
                <br />
                <span className="text-primary">Your comeback.</span>
              </h3>
              <p className="text-xl text-muted-foreground">
                Welcome to the place where you take your mind back.
              </p>
            </div>
            <div className="pt-4">
              <LoginButton />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2026. Built with ❤️ using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-4 hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
