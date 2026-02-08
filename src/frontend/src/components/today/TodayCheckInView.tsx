import { useState, useEffect } from 'react';
import { useGetProgram, useAddCheckIn } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import ProgressSummary from './ProgressSummary';

export default function TodayCheckInView() {
  const { data: program, isLoading } = useGetProgram();
  const addCheckIn = useAddCheckIn();
  
  const [moodRating, setMoodRating] = useState<number>(3);
  const [notes, setNotes] = useState('');
  const [reducedBehavior, setReducedBehavior] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);

  // Calculate current day (1-30)
  const currentDay = program ? Math.min(program.checkIns.length + 1, 30) : 1;
  const todayEntry = program?.days.find(d => Number(d.day) === currentDay);
  const existingCheckIn = program?.checkIns.find(c => Number(c.day) === currentDay);

  // Load existing check-in if present
  useEffect(() => {
    if (existingCheckIn) {
      setTaskCompleted(existingCheckIn.taskCompleted);
      setMoodRating(existingCheckIn.moodRating ? Number(existingCheckIn.moodRating) : 3);
      setNotes(existingCheckIn.notes);
      setReducedBehavior(existingCheckIn.reducedBehavior);
    }
  }, [existingCheckIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!program) {
      toast.error('No active program found. Generate your program first.');
      return;
    }

    try {
      await addCheckIn.mutateAsync({
        day: BigInt(currentDay),
        taskCompleted,
        moodRating: BigInt(moodRating),
        notes: notes.trim(),
        reducedBehavior,
      });

      toast.success(existingCheckIn ? 'Check-in updated!' : 'Check-in saved!');
      
      // Reset form if it's a new check-in
      if (!existingCheckIn) {
        setMoodRating(3);
        setNotes('');
        setReducedBehavior(false);
        setTaskCompleted(false);
      }
    } catch (error) {
      toast.error('Failed to save check-in. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight mb-2">Today's Check-in</h2>
          <p className="text-lg text-muted-foreground">Start your transformation journey</p>
        </div>
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-6 mb-6">
              <Calendar className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">No active program</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Generate your 30-day program to start your daily check-ins and track your progress.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentDay > 30) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-4xl font-bold tracking-tight">Program Complete! 🎉</h2>
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="py-16 text-center">
            <CheckCircle2 className="h-20 w-20 text-primary mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-3">Congratulations!</h3>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              You've completed your 30-day transformation journey. Celebrate your progress!
            </p>
          </CardContent>
        </Card>
        <ProgressSummary program={program} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-4xl font-bold tracking-tight mb-2">Today's Check-in</h2>
        <p className="text-lg text-muted-foreground">
          Day {currentDay} of 30
        </p>
      </div>

      <ProgressSummary program={program} />

      {todayEntry && (
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="text-sm px-3 py-1">Day {currentDay}</Badge>
                  <Badge variant="outline" className="gap-1.5 text-sm px-3 py-1">
                    <Clock className="h-3.5 w-3.5" />
                    {Number(todayEntry.task.duration)} min
                  </Badge>
                </div>
                <CardTitle className="text-2xl mb-2">{todayEntry.task.action}</CardTitle>
                <CardDescription className="text-base">{todayEntry.task.whenToCue}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm leading-relaxed">{todayEntry.task.rationale}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 border-t border-border pt-8">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 transition-colors hover:bg-muted/50">
                <div className="space-y-1">
                  <Label htmlFor="completed" className="text-base font-semibold">Task Completed</Label>
                  <p className="text-sm text-muted-foreground">Did you complete today's habit?</p>
                </div>
                <Switch
                  id="completed"
                  checked={taskCompleted}
                  onCheckedChange={setTaskCompleted}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Mood Rating</Label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      type="button"
                      variant={moodRating === rating ? 'default' : 'outline'}
                      size="lg"
                      onClick={() => setMoodRating(rating)}
                      className="flex-1 text-lg font-semibold transition-all hover:scale-105"
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">1 = Low, 5 = Great</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 transition-colors hover:bg-muted/50">
                <div className="space-y-1">
                  <Label htmlFor="reduced" className="text-base font-semibold">Reduced Behavior</Label>
                  <p className="text-sm text-muted-foreground">Did you avoid the targeted habit today?</p>
                </div>
                <Switch
                  id="reduced"
                  checked={reducedBehavior}
                  onCheckedChange={setReducedBehavior}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes" className="text-base font-semibold">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did it go? Any insights or challenges?"
                  className="min-h-[120px] text-base"
                />
              </div>

              <Button type="submit" className="w-full text-base py-6" size="lg" disabled={addCheckIn.isPending}>
                {addCheckIn.isPending ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : existingCheckIn ? (
                  'Update Check-in'
                ) : (
                  'Save Check-in'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
