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
        <h2 className="text-3xl font-bold tracking-tight mb-6">Today's Check-in</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No active program</h3>
            <p className="text-sm text-muted-foreground text-center">
              Generate your 30-day program to start your daily check-ins.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentDay > 30) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Program Complete! 🎉</h2>
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Congratulations!</h3>
            <p className="text-muted-foreground">
              You've completed your 30-day transformation journey.
            </p>
          </CardContent>
        </Card>
        <ProgressSummary program={program} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Today's Check-in</h2>
        <p className="text-muted-foreground mt-2">
          Day {currentDay} of 30
        </p>
      </div>

      <ProgressSummary program={program} />

      {todayEntry && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Day {currentDay}</Badge>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {Number(todayEntry.task.duration)} min
                  </Badge>
                </div>
                <CardTitle className="text-xl">{todayEntry.task.action}</CardTitle>
                <CardDescription className="mt-1">{todayEntry.task.whenToCue}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">{todayEntry.task.rationale}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 border-t border-border pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="completed" className="text-base">Task Completed</Label>
                  <p className="text-sm text-muted-foreground">Did you complete today's habit?</p>
                </div>
                <Switch
                  id="completed"
                  checked={taskCompleted}
                  onCheckedChange={setTaskCompleted}
                />
              </div>

              <div className="space-y-2">
                <Label>Mood Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      type="button"
                      variant={moodRating === rating ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMoodRating(rating)}
                      className="flex-1"
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">1 = Low, 5 = Great</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduced" className="text-base">Reduced Behavior</Label>
                  <p className="text-sm text-muted-foreground">Did you avoid the targeted habit today?</p>
                </div>
                <Switch
                  id="reduced"
                  checked={reducedBehavior}
                  onCheckedChange={setReducedBehavior}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did it go? Any insights or challenges?"
                  className="min-h-[100px]"
                />
              </div>

              <Button type="submit" className="w-full" disabled={addCheckIn.isPending}>
                {addCheckIn.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
