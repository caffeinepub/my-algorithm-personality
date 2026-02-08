import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import type { TimeDistribution } from '../../../analysis/dashboardInsights';

interface MorningNightDistributionSectionProps {
  distribution: TimeDistribution;
}

export default function MorningNightDistributionSection({ distribution }: MorningNightDistributionSectionProps) {
  const total = distribution.morning + distribution.afternoon + distribution.evening + distribution.night;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Time-of-Day Distribution
          </CardTitle>
          <CardDescription>When you're most active online</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            Not enough data to show time distribution.
          </div>
        </CardContent>
      </Card>
    );
  }

  const morningPercent = Math.round((distribution.morning / total) * 100);
  const afternoonPercent = Math.round((distribution.afternoon / total) * 100);
  const eveningPercent = Math.round((distribution.evening / total) * 100);
  const nightPercent = Math.round((distribution.night / total) * 100);

  const periods = [
    { name: 'Morning', icon: Sunrise, percent: morningPercent, count: distribution.morning, color: 'bg-yellow-500' },
    { name: 'Afternoon', icon: Sun, percent: afternoonPercent, count: distribution.afternoon, color: 'bg-orange-500' },
    { name: 'Evening', icon: Sunset, percent: eveningPercent, count: distribution.evening, color: 'bg-purple-500' },
    { name: 'Night', icon: Moon, percent: nightPercent, count: distribution.night, color: 'bg-blue-500' },
  ];

  const maxPeriod = periods.reduce((max, p) => (p.count > max.count ? p : max), periods[0]);

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Time-of-Day Distribution
        </CardTitle>
        <CardDescription>Your activity patterns throughout the day</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {periods.map((period) => {
            const Icon = period.icon;
            return (
              <div key={period.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{period.name}</span>
                  </div>
                  <span className="text-muted-foreground">{period.percent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full ${period.color} transition-all duration-500 ease-out`}
                    style={{ width: `${period.percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Peak Activity:</span> {maxPeriod.name} ({maxPeriod.percent}% of entries)
          </p>
        </div>

        {nightPercent > 30 && (
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💤 High nighttime activity detected. Consider establishing an earlier wind-down routine.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
