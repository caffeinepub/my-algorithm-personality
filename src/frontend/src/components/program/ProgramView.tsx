import { useEffect } from 'react';
import { useGetProgram, useCreateProgram, useGetPatterns, useGetHabitLibrary } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Sparkles, CheckCircle2, Circle } from 'lucide-react';
import { generateProgram } from '../../program/generateProgram';
import { toast } from 'sonner';
import ProgramDayDetail from './ProgramDayDetail';
import { useState } from 'react';

export default function ProgramView() {
  const { data: program, isLoading: programLoading } = useGetProgram();
  const { data: patterns } = useGetPatterns();
  const { data: library } = useGetHabitLibrary();
  const createProgram = useCreateProgram();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleGenerateProgram = async () => {
    if (!patterns || patterns.length === 0) {
      toast.error('Please add and analyze entries first to detect patterns.');
      return;
    }

    if (!library || library.length === 0) {
      toast.error('Habit library is not loaded yet. Please try again.');
      return;
    }

    try {
      const newProgram = generateProgram(patterns, library);
      await createProgram.mutateAsync(newProgram);
      toast.success('Your personalized 30-day program is ready!');
    } catch (error) {
      toast.error('Failed to generate program. Please try again.');
    }
  };

  if (selectedDay !== null && program) {
    const dayEntry = program.days.find(d => Number(d.day) === selectedDay);
    if (dayEntry) {
      return (
        <ProgramDayDetail
          day={selectedDay}
          dayEntry={dayEntry}
          checkIn={program.checkIns.find(c => Number(c.day) === selectedDay) || null}
          onBack={() => setSelectedDay(null)}
        />
      );
    }
  }

  if (programLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading program...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your 30-Day Program</h2>
          <p className="text-muted-foreground mt-2">
            Generate a personalized transformation journey based on your patterns
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No program yet</h3>
            <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
              Once you've added entries and detected patterns, generate your personalized 30-day program with daily atomic habits.
            </p>
            <Button onClick={handleGenerateProgram} disabled={createProgram.isPending}>
              {createProgram.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate My Program
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedDays = program.checkIns.filter(c => c.taskCompleted).length;
  const progressPercent = (completedDays / 30) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Your 30-Day Program</h2>
        <p className="text-muted-foreground mt-2">
          Daily atomic habits personalized to your patterns
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
          <CardDescription>
            {completedDays} of 30 days completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progressPercent} className="h-2" />
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Completion: </span>
              <span className="font-semibold">{Math.round(progressPercent)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Days left: </span>
              <span className="font-semibold">{30 - completedDays}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {program.days.map((day) => {
          const dayNum = Number(day.day);
          const checkIn = program.checkIns.find(c => Number(c.day) === dayNum);
          const isCompleted = checkIn?.taskCompleted || false;

          return (
            <Card
              key={dayNum}
              className="cursor-pointer transition-colors hover:bg-accent/50"
              onClick={() => setSelectedDay(dayNum)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base">Day {dayNum}</CardTitle>
                    <CardDescription className="text-xs line-clamp-1">
                      {day.task.action}
                    </CardDescription>
                  </div>
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-xs">
                  {day.task.category}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
