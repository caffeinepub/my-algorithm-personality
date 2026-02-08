import type { Pattern, Habit, Program, DailyProgramEntry } from '../backend';
import type { InsightSignature } from '../analysis/dashboardInsights';

const CATEGORY_MAPPING: Record<string, string[]> = {
  'Shopping & Spending Triggers': ['Spending Awareness', 'Mindful Pausing'],
  'Emotional Tone': ['Emotional Regulation', 'Mindful Pausing'],
  'Time-of-Day Habits': ['Sleep & Wind-down', 'Digital Balance'],
  'Screen-Time & Scrolling': ['Digital Balance', 'Focus & Deep Work'],
  'Cue-Craving-Reward Loops': ['Mindful Pausing', 'Emotional Regulation', 'Digital Balance'],
};

const REFLECTION_PROMPTS = [
  'What triggered the urge to engage in this behavior today?',
  'How did you feel before and after completing this task?',
  'What alternative action could you take next time you feel this urge?',
  'What patterns are you noticing in your behavior?',
  'How has this habit changed your awareness today?',
];

export function generateProgram(
  patterns: Pattern[],
  habitLibrary: Habit[],
  insightSignals?: InsightSignature
): Program {
  // Determine which categories to focus on based on patterns
  const categoryPriority = new Map<string, number>();
  
  for (const pattern of patterns) {
    const categories = CATEGORY_MAPPING[pattern.patternType] || [];
    for (const category of categories) {
      categoryPriority.set(category, (categoryPriority.get(category) || 0) + Number(pattern.confidenceScore));
    }
  }

  // Boost certain categories based on insight signals
  if (insightSignals) {
    if (insightSignals.spendingFrequency === 'high') {
      categoryPriority.set('Spending Awareness', (categoryPriority.get('Spending Awareness') || 0) + 50);
    }
    if (insightSignals.emotionalBalance === 'negative') {
      categoryPriority.set('Emotional Regulation', (categoryPriority.get('Emotional Regulation') || 0) + 50);
    }
    if (insightSignals.timePreference === 'night') {
      categoryPriority.set('Sleep & Wind-down', (categoryPriority.get('Sleep & Wind-down') || 0) + 50);
    }
  }

  // Sort categories by priority
  const sortedCategories = Array.from(categoryPriority.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);

  // If no patterns, use all categories
  const targetCategories = sortedCategories.length > 0 
    ? sortedCategories 
    : Array.from(new Set(habitLibrary.map(h => h.category)));

  // Generate 30 days
  const days: DailyProgramEntry[] = [];
  
  for (let day = 1; day <= 30; day++) {
    // Rotate through categories with some variety
    const categoryIndex = (day - 1) % targetCategories.length;
    const category = targetCategories[categoryIndex];
    
    // Get habits for this category
    const categoryHabits = habitLibrary.filter(h => h.category === category);
    
    if (categoryHabits.length === 0) continue;
    
    // Select habit (rotate through habits in category)
    const habitIndex = Math.floor((day - 1) / targetCategories.length) % categoryHabits.length;
    const habit = categoryHabits[habitIndex];
    
    // Generate explanation based on patterns and insights
    const relevantPatterns = patterns.filter(p => {
      const cats = CATEGORY_MAPPING[p.patternType] || [];
      return cats.includes(category);
    });
    
    let explanation = `This task addresses your ${category.toLowerCase()} patterns.`;
    if (relevantPatterns.length > 0) {
      const patternType = relevantPatterns[0].patternType;
      explanation = `Based on your detected ${patternType.toLowerCase()}, this habit helps break that loop and build healthier patterns.`;
    }

    // Add insight-driven context
    if (insightSignals) {
      if (category === 'Spending Awareness' && insightSignals.spendingFrequency === 'high') {
        explanation += ' Your recent activity shows high exposure to shopping triggers.';
      }
      if (category === 'Emotional Regulation' && insightSignals.emotionalBalance === 'negative') {
        explanation += ' This will help improve your emotional well-being.';
      }
      if (category === 'Sleep & Wind-down' && insightSignals.timePreference === 'night') {
        explanation += ' Your nighttime activity suggests this habit is especially important.';
      }
    }
    
    // Add reflection prompt every 3 days
    const reflectionPrompt = day % 3 === 0 
      ? REFLECTION_PROMPTS[(day / 3 - 1) % REFLECTION_PROMPTS.length]
      : undefined;
    
    days.push({
      day: BigInt(day),
      task: habit,
      explanation,
      reflectionPrompt,
    });
  }

  return {
    days,
    checkIns: [],
  };
}
