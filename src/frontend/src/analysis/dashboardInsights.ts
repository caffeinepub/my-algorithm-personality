import type { Pattern, OnlineActivityEntry } from '../backend';

export interface EmotionalTrend {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface SpendingTrigger {
  date: string;
  count: number;
}

export interface TimeDistribution {
  morning: number; // 6am-12pm
  afternoon: number; // 12pm-6pm
  evening: number; // 6pm-12am
  night: number; // 12am-6am
}

export interface InsightSignature {
  emotionalBalance: string;
  spendingFrequency: string;
  timePreference: string;
  patternCount: number;
  window: number;
}

// Emotional keywords for sentiment analysis
const POSITIVE_KEYWORDS = ['happy', 'excited', 'great', 'love', 'amazing', 'wonderful', 'joy', 'grateful', 'blessed', 'awesome'];
const NEGATIVE_KEYWORDS = ['sad', 'angry', 'frustrated', 'hate', 'terrible', 'awful', 'depressed', 'anxious', 'worried', 'stressed'];
const SPENDING_KEYWORDS = ['buy', 'purchase', 'shop', 'cart', 'checkout', 'order', 'sale', 'deal', 'discount', 'price'];

export function computeEmotionalTrends(
  patterns: Pattern[],
  entries: OnlineActivityEntry[],
  windowDays: number
): EmotionalTrend[] {
  const now = Date.now();
  const windowMs = windowDays * 24 * 60 * 60 * 1000;
  const startTime = now - windowMs;

  // Filter entries within window
  const recentEntries = entries.filter(e => Number(e.timestamp) >= startTime);

  // Group by day
  const dayMap = new Map<string, { positive: number; negative: number; neutral: number }>();

  for (const entry of recentEntries) {
    const date = new Date(Number(entry.timestamp));
    const dayKey = date.toISOString().split('T')[0];

    if (!dayMap.has(dayKey)) {
      dayMap.set(dayKey, { positive: 0, negative: 0, neutral: 0 });
    }

    const day = dayMap.get(dayKey)!;
    const text = `${entry.sourceLabel} ${entry.notes}`.toLowerCase();

    let hasPositive = false;
    let hasNegative = false;

    for (const keyword of POSITIVE_KEYWORDS) {
      if (text.includes(keyword)) {
        hasPositive = true;
        break;
      }
    }

    for (const keyword of NEGATIVE_KEYWORDS) {
      if (text.includes(keyword)) {
        hasNegative = true;
        break;
      }
    }

    if (hasPositive) day.positive++;
    else if (hasNegative) day.negative++;
    else day.neutral++;
  }

  // Convert to array and sort by date
  return Array.from(dayMap.entries())
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function computeSpendingTriggers(
  patterns: Pattern[],
  entries: OnlineActivityEntry[],
  windowDays: number
): SpendingTrigger[] {
  const now = Date.now();
  const windowMs = windowDays * 24 * 60 * 60 * 1000;
  const startTime = now - windowMs;

  const recentEntries = entries.filter(e => Number(e.timestamp) >= startTime);

  // Group by day
  const dayMap = new Map<string, number>();

  for (const entry of recentEntries) {
    const date = new Date(Number(entry.timestamp));
    const dayKey = date.toISOString().split('T')[0];

    const text = `${entry.sourceLabel} ${entry.notes}`.toLowerCase();
    let hasSpending = false;

    for (const keyword of SPENDING_KEYWORDS) {
      if (text.includes(keyword)) {
        hasSpending = true;
        break;
      }
    }

    if (hasSpending) {
      dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + 1);
    }
  }

  return Array.from(dayMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function computeTimeDistribution(
  patterns: Pattern[],
  entries: OnlineActivityEntry[],
  windowDays: number
): TimeDistribution {
  const now = Date.now();
  const windowMs = windowDays * 24 * 60 * 60 * 1000;
  const startTime = now - windowMs;

  const recentEntries = entries.filter(e => Number(e.timestamp) >= startTime);

  const distribution: TimeDistribution = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  };

  for (const entry of recentEntries) {
    const date = new Date(Number(entry.timestamp));
    const hour = date.getHours();

    if (hour >= 6 && hour < 12) distribution.morning++;
    else if (hour >= 12 && hour < 18) distribution.afternoon++;
    else if (hour >= 18 && hour < 24) distribution.evening++;
    else distribution.night++;
  }

  return distribution;
}

export function generateInsightSignature(
  patterns: Pattern[],
  entries: OnlineActivityEntry[],
  windowDays: number
): InsightSignature {
  const emotionalTrends = computeEmotionalTrends(patterns, entries, windowDays);
  const spendingTriggers = computeSpendingTriggers(patterns, entries, windowDays);
  const timeDistribution = computeTimeDistribution(patterns, entries, windowDays);

  // Calculate emotional balance
  const totalEmotional = emotionalTrends.reduce((sum, t) => sum + t.positive + t.negative + t.neutral, 0);
  const positiveRatio = totalEmotional > 0
    ? emotionalTrends.reduce((sum, t) => sum + t.positive, 0) / totalEmotional
    : 0;

  let emotionalBalance = 'neutral';
  if (positiveRatio > 0.4) emotionalBalance = 'positive';
  else if (positiveRatio < 0.2) emotionalBalance = 'negative';

  // Calculate spending frequency
  const totalSpending = spendingTriggers.reduce((sum, t) => sum + t.count, 0);
  const avgSpendingPerDay = totalSpending / windowDays;
  let spendingFrequency = 'low';
  if (avgSpendingPerDay > 2) spendingFrequency = 'high';
  else if (avgSpendingPerDay > 0.5) spendingFrequency = 'medium';

  // Calculate time preference
  const total = timeDistribution.morning + timeDistribution.afternoon + timeDistribution.evening + timeDistribution.night;
  const maxTime = Math.max(timeDistribution.morning, timeDistribution.afternoon, timeDistribution.evening, timeDistribution.night);
  let timePreference = 'balanced';
  if (total > 0) {
    if (timeDistribution.morning === maxTime) timePreference = 'morning';
    else if (timeDistribution.afternoon === maxTime) timePreference = 'afternoon';
    else if (timeDistribution.evening === maxTime) timePreference = 'evening';
    else if (timeDistribution.night === maxTime) timePreference = 'night';
  }

  return {
    emotionalBalance,
    spendingFrequency,
    timePreference,
    patternCount: patterns.length,
    window: windowDays,
  };
}

export function hasSignificantChange(oldSig: InsightSignature | null, newSig: InsightSignature): boolean {
  if (!oldSig) return false;

  // Check if any key metric has changed
  return (
    oldSig.emotionalBalance !== newSig.emotionalBalance ||
    oldSig.spendingFrequency !== newSig.spendingFrequency ||
    oldSig.timePreference !== newSig.timePreference ||
    Math.abs(oldSig.patternCount - newSig.patternCount) > 5
  );
}
