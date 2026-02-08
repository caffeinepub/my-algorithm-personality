import { useEffect, useState, useRef } from 'react';
import { useGetProgram, useUpdateFullProgram, useGetPatterns, useGetHabitLibrary, useGetActivityEntries, useCreateProgram } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Sparkles, CheckCircle2, Circle, RefreshCw } from 'lucide-react';
import { generateProgram } from '../../program/generateProgram';
import { generateInsightSignature, hasSignificantChange } from '../../analysis/dashboardInsights';
import { toast } from 'sonner';
import ProgramDayDetail from './ProgramDayDetail';

export default function ProgramView() {
  const { data: program, isLoading: programLoading } = useGetProgram();
  const { data: patterns } = useGetPatterns();
  const { data: library } = useGetHabitLibrary();
  const { data: entries } = useGetActivityEntries();
  const createProgram = useCreateProgram();
  const updateFullProgram = useUpdateFullProgram();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const lastSignatureRef = useRef<string | null>(null);

  // Automatic program update effect
  useEffect(() => {
    if (!program || !patterns || !library || !entries) return;

    const currentSignature = generateInsightSignature(patterns, entries, 30);
    const currentSigString = JSON.stringify(currentSignature);

    // Initialize signature on first load
    if (lastSignatureRef.current === null) {
      lastSignatureRef.current = currentSigString;
      return;
    }

    // Check for significant change
    const lastSignature = JSON.parse(lastSignatureRef.current);
    if (hasSignificantChange(lastSignature, currentSignature)) {
      // Regenerate program with new insights
      const newProgram = generateProgram(patterns, library, currentSignature);
      
      // Preserve existing check-ins
      const updatedProgram = {
        days: newProgram.days,
        checkIns: program.checkIns,
      };

      updateFullProgram.mutate(
        { days: updatedProgram.days, checkIns: updatedProgram.checkIns },
        {
          onSuccess: () => {
            toast.success('Program updated based on new insights!');
            lastSignatureRef.current = currentSigString;
          },
          onError: () => {
            toast.error('Failed to update program automatically.');
          },
        }
      );
    }
  }, [patterns, entries, program, library, updateFullProgram]);

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
      const insightSignature = entries ? generateInsightSignature(patterns, entries, 30) : undefined;
      const newProgram = generateProgram(patterns, library, insightSignature);
      await createProgram.mutateAsync(newProgram);
      
      // Store initial signature
      if (insightSignature) {
        lastSignatureRef.current = JSON.stringify(insightSignature);
      }
      
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Your 30-Day Program</h2>
          <p className="text-lg text-muted-foreground">
            Generate a personalized transformation journey based on your patterns
          </p>
        </div>

        <Card className="border-2 border-dashed transition-all duration-300 hover:border-primary/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-6 mb-6">
              <Calendar className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">No program yet</h3>
            <p className="text-muted-foreground text-center mb-8 max-w-md leading-relaxed">
              Once you've added entries and detected patterns, generate your personalized 30-day program with daily atomic habits tailored to your behavior.
            </p>
            <Button onClick={handleGenerateProgram} disabled={createProgram.isPending} size="lg" className="px-8">
              {createProgram.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
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
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-4xl font-bold tracking-tight mb-2">Your 30-Day Program</h2>
        <p className="text-lg text-muted-foreground">
          Daily atomic habits personalized to your patterns
        </p>
      </div>

      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Progress Overview</CardTitle>
              <CardDescription className="mt-1">
                {completedDays} of 30 days completed
              </CardDescription>
            </div>
            {updateFullProgram.isPending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Updating...
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progressPercent} className="h-3 transition-all duration-500" />
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Completion: </span>
              <span className="font-bold text-lg">{Math.round(progressPercent)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Days left: </span>
              <span className="font-bold text-lg">{30 - completedDays}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Current streak: </span>
              <span className="font-bold text-lg">{completedDays}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {program.days.map((day) => {
          const dayNum = Number(day.day);
          const checkIn = program.checkIns.find(c => Number(c.day) === dayNum);
          const isCompleted = checkIn?.taskCompleted || false;

          return (
            <Card
              key={dayNum}
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50"
              onClick={() => setSelectedDay(dayNum)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base font-bold">Day {dayNum}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2 mt-1">
                      {day.task.action}
                    </CardDescription>
                  </div>
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground flex-shrink-0" />
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
