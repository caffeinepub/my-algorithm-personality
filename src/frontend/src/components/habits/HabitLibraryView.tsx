import { useEffect } from 'react';
import { useGetHabitLibrary, useSeedHabitLibrary } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Clock, TrendingUp, BookOpen } from 'lucide-react';
import { HABIT_LIBRARY } from '../../data/habitLibrary';

export default function HabitLibraryView() {
  const { data: library, isLoading } = useGetHabitLibrary();
  const seedLibrary = useSeedHabitLibrary();

  useEffect(() => {
    if (!isLoading && (!library || library.length === 0)) {
      seedLibrary.mutate(HABIT_LIBRARY);
    }
  }, [isLoading, library]);

  const habits = library && library.length > 0 ? library : HABIT_LIBRARY;

  const categories = Array.from(new Set(habits.map(h => h.category)));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Habit Library</h2>
        <p className="text-muted-foreground mt-2">
          Curated atomic habits to help you build presence and break negative loops
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {categories.map((category) => {
          const categoryHabits = habits.filter(h => h.category === category);
          return (
            <AccordionItem key={category} value={category} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <h3 className="font-semibold">{category}</h3>
                    <p className="text-sm text-muted-foreground">{categoryHabits.length} habits</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-4">
                  {categoryHabits.map((habit) => (
                    <Card key={habit.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <CardTitle className="text-base">{habit.action}</CardTitle>
                          <div className="flex gap-2 flex-shrink-0">
                            <Badge variant="outline" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {Number(habit.duration)}m
                            </Badge>
                            <Badge variant={Number(habit.difficulty) <= 2 ? 'secondary' : 'default'}>
                              {Number(habit.difficulty) === 1 ? 'Easy' : Number(habit.difficulty) === 2 ? 'Medium' : 'Hard'}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="text-xs">{habit.whenToCue}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{habit.rationale}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
