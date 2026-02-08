import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';
import type { DailyProgramEntry, DailyCheckIn } from '../../backend';

interface ProgramDayDetailProps {
  day: number;
  dayEntry: DailyProgramEntry;
  checkIn: DailyCheckIn | null;
  onBack: () => void;
}

export default function ProgramDayDetail({ day, dayEntry, checkIn, onBack }: ProgramDayDetailProps) {
  const isCompleted = checkIn?.taskCompleted || false;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Program
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Day {day}</Badge>
                {isCompleted && (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{dayEntry.task.action}</CardTitle>
              <CardDescription className="mt-2">{dayEntry.task.category}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {Number(dayEntry.task.duration)} min
            </Badge>
            <Badge variant="outline">
              {Number(dayEntry.task.difficulty) === 1 ? 'Easy' : Number(dayEntry.task.difficulty) === 2 ? 'Medium' : 'Hard'}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold mb-2">When to do it</h3>
            <p className="text-sm text-muted-foreground">{dayEntry.task.whenToCue}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Why this matters</h3>
            <p className="text-sm text-muted-foreground">{dayEntry.task.rationale}</p>
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Why today?</p>
                <p className="text-muted-foreground">{dayEntry.explanation}</p>
              </div>
            </div>
          </div>

          {dayEntry.reflectionPrompt && (
            <div>
              <h3 className="font-semibold mb-2">Reflection Prompt</h3>
              <p className="text-sm text-muted-foreground italic">{dayEntry.reflectionPrompt}</p>
            </div>
          )}

          {checkIn && (
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-3">Your Check-in</h3>
              <div className="space-y-2 text-sm">
                {checkIn.moodRating && (
                  <p>
                    <span className="text-muted-foreground">Mood: </span>
                    <span className="font-medium">{Number(checkIn.moodRating)}/5</span>
                  </p>
                )}
                {checkIn.reducedBehavior && (
                  <p className="text-primary font-medium">✓ Reduced targeted behavior</p>
                )}
                {checkIn.notes && (
                  <div>
                    <p className="text-muted-foreground mb-1">Notes:</p>
                    <p className="text-foreground">{checkIn.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
