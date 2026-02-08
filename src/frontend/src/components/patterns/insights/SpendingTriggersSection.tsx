import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';
import type { SpendingTrigger } from '../../../analysis/dashboardInsights';

interface SpendingTriggersSectionProps {
  triggers: SpendingTrigger[];
  windowDays: number;
}

export default function SpendingTriggersSection({ triggers, windowDays }: SpendingTriggersSectionProps) {
  if (triggers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Shopping & Spending Triggers
          </CardTitle>
          <CardDescription>Monitor spending-related content exposure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            No spending triggers detected in this period.
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalTriggers = triggers.reduce((sum, t) => sum + t.count, 0);
  const avgPerDay = (totalTriggers / windowDays).toFixed(1);
  const maxDay = triggers.reduce((max, t) => (t.count > max.count ? t : max), triggers[0]);

  // Calculate trend (compare first half vs second half)
  const midpoint = Math.floor(triggers.length / 2);
  const firstHalf = triggers.slice(0, midpoint).reduce((sum, t) => sum + t.count, 0);
  const secondHalf = triggers.slice(midpoint).reduce((sum, t) => sum + t.count, 0);
  const trend = secondHalf > firstHalf ? 'increasing' : secondHalf < firstHalf ? 'decreasing' : 'stable';

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Shopping & Spending Triggers
        </CardTitle>
        <CardDescription>Exposure to shopping-related content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-muted/30 p-4 transition-transform hover:scale-105">
            <div className="text-3xl font-bold text-foreground">{totalTriggers}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Triggers</div>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4 transition-transform hover:scale-105">
            <div className="text-3xl font-bold text-foreground">{avgPerDay}</div>
            <div className="text-sm text-muted-foreground mt-1">Per Day Avg</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Trend</span>
            <span className="flex items-center gap-1 font-semibold">
              {trend === 'increasing' ? (
                <>
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  Increasing
                </>
              ) : trend === 'decreasing' ? (
                <>
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  Decreasing
                </>
              ) : (
                'Stable'
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Peak Day</span>
            <span className="font-semibold">{new Date(maxDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {totalTriggers > windowDays * 2 && (
          <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 p-3">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              ⚠️ High exposure to shopping content. Consider limiting time on shopping platforms.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
