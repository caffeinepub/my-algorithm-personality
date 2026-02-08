import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Upload, TrendingUp, Target } from 'lucide-react';

interface OnboardingDialogProps {
  onDismiss: () => void;
}

export default function OnboardingDialog({ onDismiss }: OnboardingDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onDismiss}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Your Transformation Journey</DialogTitle>
          <DialogDescription className="text-base">
            My Algorithm helps you understand and reverse negative online habits by analyzing your digital patterns.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">1. Add Your Data</h3>
              <p className="text-sm text-muted-foreground">
                Paste text from social media, shopping sites, or messages. You can also attach screenshots for reference.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">2. Discover Patterns</h3>
              <p className="text-sm text-muted-foreground">
                Our analysis detects shopping triggers, emotional patterns, time-of-day habits, and feedback loops.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">3. Transform with Daily Tasks</h3>
              <p className="text-sm text-muted-foreground">
                Get a personalized 30-day program with atomic habits designed to break negative loops and build presence.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">What this MVP can do:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• Analyze text you paste (no external AI or social media APIs)</li>
                  <li>• Store screenshots as attachments (analysis focuses on text)</li>
                  <li>• Generate personalized programs from detected patterns</li>
                  <li>• Track your progress with daily check-ins</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onDismiss} className="w-full sm:w-auto">
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
