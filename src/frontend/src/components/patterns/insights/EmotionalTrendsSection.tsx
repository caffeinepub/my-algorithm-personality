import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Frown, Minus } from 'lucide-react';
import type { EmotionalTrend } from '../../../analysis/dashboardInsights';

interface EmotionalTrendsSectionProps {
  trends: EmotionalTrend[];
}

export default function EmotionalTrendsSection({ trends }: EmotionalTrendsSectionProps) {
  if (trends.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Emotional Trends
          </CardTitle>
          <CardDescription>Track your emotional patterns over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            Not enough data yet. Add more entries to see emotional trends.
          </div>
        </CardContent>
      </Card>
    );
  }

  const totals = trends.reduce(
    (acc, t) => ({
      positive: acc.positive + t.positive,
      negative: acc.negative + t.negative,
      neutral: acc.neutral + t.neutral,
    }),
    { positive: 0, negative: 0, neutral: 0 }
  );

  const total = totals.positive + totals.negative + totals.neutral;
  const positivePercent = total > 0 ? Math.round((totals.positive / total) * 100) : 0;
  const negativePercent = total > 0 ? Math.round((totals.negative / total) * 100) : 0;
  const neutralPercent = total > 0 ? Math.round((totals.neutral / total) * 100) : 0;

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Emotional Trends
        </CardTitle>
        <CardDescription>Your emotional patterns across entries</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-3 text-center transition-transform hover:scale-105">
            <Heart className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{positivePercent}%</div>
            <div className="text-xs text-green-600 dark:text-green-400">Positive</div>
          </div>
          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-center transition-transform hover:scale-105">
            <Frown className="h-5 w-5 text-red-600 dark:text-red-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">{negativePercent}%</div>
            <div className="text-xs text-red-600 dark:text-red-400">Negative</div>
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-center transition-transform hover:scale-105">
            <Minus className="h-5 w-5 text-gray-600 dark:text-gray-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{neutralPercent}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Neutral</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Balance</span>
            <span className="font-semibold">
              {positivePercent > 50 ? '✨ Mostly Positive' : negativePercent > 50 ? '⚠️ Needs Attention' : '⚖️ Balanced'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
