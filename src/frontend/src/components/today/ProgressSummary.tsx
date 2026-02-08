import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Flame, Target } from 'lucide-react';
import type { Program } from '../../backend';

interface ProgressSummaryProps {
  program: Program;
}

export default function ProgressSummary({ program }: ProgressSummaryProps) {
  const completedDays = program.checkIns.filter(c => c.taskCompleted).length;
  const totalDays = 30;
  const completionRate = Math.round((completedDays / totalDays) * 100);

  // Calculate streak
  let currentStreak = 0;
  const sortedCheckIns = [...program.checkIns]
    .sort((a, b) => Number(b.day) - Number(a.day));
  
  for (const checkIn of sortedCheckIns) {
    if (checkIn.taskCompleted) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate average mood
  const moodRatings = program.checkIns
    .filter(c => c.moodRating !== undefined)
    .map(c => Number(c.moodRating));
  const avgMood = moodRatings.length > 0
    ? (moodRatings.reduce((a, b) => a + b, 0) / moodRatings.length).toFixed(1)
    : 'N/A';

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <CardDescription>Days Completed</CardDescription>
          </div>
          <CardTitle className="text-3xl">{completedDays}/{totalDays}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">{completionRate}% complete</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-muted-foreground" />
            <CardDescription>Current Streak</CardDescription>
          </div>
          <CardTitle className="text-3xl">{currentStreak}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {currentStreak > 0 ? 'Keep it going!' : 'Start your streak today'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <CardDescription>Average Mood</CardDescription>
          </div>
          <CardTitle className="text-3xl">{avgMood}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Out of 5</p>
        </CardContent>
      </Card>
    </div>
  );
}
