import type { Pattern } from '../backend';

export interface PatternSummary {
  totalPatterns: number;
  uniqueTypes: number;
  avgConfidence: number;
  topTypes: Array<{
    type: string;
    count: number;
    summary: string;
  }>;
  commonSnippets: string[];
}

export function summarizePatterns(patterns: Pattern[], windowSize: number): PatternSummary {
  if (patterns.length === 0) {
    return {
      totalPatterns: 0,
      uniqueTypes: 0,
      avgConfidence: 0,
      topTypes: [],
      commonSnippets: [],
    };
  }

  // Take only the most recent patterns based on window
  const recentPatterns = patterns.slice(-windowSize);

  // Count by type
  const typeCounts = new Map<string, number>();
  const typeSnippets = new Map<string, string[]>();
  let totalConfidence = 0;

  for (const pattern of recentPatterns) {
    typeCounts.set(pattern.patternType, (typeCounts.get(pattern.patternType) || 0) + 1);
    
    if (!typeSnippets.has(pattern.patternType)) {
      typeSnippets.set(pattern.patternType, []);
    }
    typeSnippets.get(pattern.patternType)!.push(pattern.snippet);
    
    totalConfidence += Number(pattern.confidenceScore);
  }

  // Generate summaries
  const summaries: Record<string, string> = {
    'Shopping & Spending Triggers': 'You frequently encounter shopping-related content and purchase prompts.',
    'Emotional Tone': 'Your activity shows emotional language patterns and sentiment expressions.',
    'Time-of-Day Habits': 'Temporal patterns suggest specific times when you engage with content.',
    'Screen-Time & Scrolling': 'Indicators of extended browsing and scrolling behaviors detected.',
    'Cue-Craving-Reward Loops': 'Addictive feedback patterns and habit loop language identified.',
  };

  const topTypes = Array.from(typeCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({
      type,
      count,
      summary: summaries[type] || 'Behavioral pattern detected in your activity.',
    }));

  // Get common snippets
  const allSnippets = recentPatterns.map(p => p.snippet);
  const uniqueSnippets = Array.from(new Set(allSnippets));

  return {
    totalPatterns: recentPatterns.length,
    uniqueTypes: typeCounts.size,
    avgConfidence: Math.round(totalConfidence / recentPatterns.length),
    topTypes,
    commonSnippets: uniqueSnippets.slice(0, 10),
  };
}
