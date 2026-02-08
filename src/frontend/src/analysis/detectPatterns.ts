import { PATTERN_TYPES } from './patternTypes';

export interface DetectedPattern {
  type: string;
  confidence: number;
  snippet: string;
}

const SHOPPING_KEYWORDS = [
  'buy', 'purchase', 'cart', 'checkout', 'sale', 'discount', 'deal', 'price',
  'order', 'shipping', 'delivery', 'add to cart', 'wishlist', 'coupon', 'promo',
  'limited time', 'hurry', 'stock', 'available', '$', 'free shipping'
];

const EMOTIONAL_KEYWORDS = [
  'feel', 'feeling', 'felt', 'happy', 'sad', 'angry', 'frustrated', 'excited',
  'anxious', 'worried', 'stressed', 'depressed', 'lonely', 'afraid', 'scared',
  'love', 'hate', 'miss', 'wish', 'hope', 'regret', 'guilt', 'shame'
];

const TIME_KEYWORDS = [
  'morning', 'afternoon', 'evening', 'night', 'midnight', 'late', 'early',
  'always', 'usually', 'often', 'every day', 'daily', 'routine', 'habit',
  'before bed', 'wake up', 'lunch', 'dinner', 'weekend'
];

const SCROLLING_KEYWORDS = [
  'scroll', 'scrolling', 'feed', 'endless', 'hours', 'lost track', 'binge',
  'can\'t stop', 'addicted', 'refresh', 'check', 'notification', 'update',
  'swipe', 'browse', 'surfing', 'rabbit hole'
];

const FEEDBACK_LOOP_KEYWORDS = [
  'crave', 'craving', 'need', 'must', 'have to', 'can\'t resist', 'urge',
  'trigger', 'reward', 'dopamine', 'instant', 'gratification', 'compulsive',
  'automatic', 'mindless', 'habit', 'loop', 'cycle', 'pattern', 'again and again'
];

function countKeywords(text: string, keywords: string[]): number {
  const lowerText = text.toLowerCase();
  return keywords.filter(keyword => lowerText.includes(keyword.toLowerCase())).length;
}

function extractSnippet(text: string, keywords: string[]): string {
  const lowerText = text.toLowerCase();
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    for (const keyword of keywords) {
      if (lowerSentence.includes(keyword.toLowerCase())) {
        return sentence.trim().slice(0, 100) + (sentence.length > 100 ? '...' : '');
      }
    }
  }
  
  return text.slice(0, 100) + (text.length > 100 ? '...' : '');
}

export function detectPatterns(text: string): DetectedPattern[] {
  if (!text || text.trim().length < 20) {
    return [];
  }

  const patterns: DetectedPattern[] = [];
  const wordCount = text.split(/\s+/).length;

  // Shopping patterns
  const shoppingCount = countKeywords(text, SHOPPING_KEYWORDS);
  if (shoppingCount > 0) {
    const confidence = Math.min(95, 40 + (shoppingCount / wordCount) * 1000);
    patterns.push({
      type: PATTERN_TYPES.SHOPPING.title,
      confidence: Math.round(confidence),
      snippet: extractSnippet(text, SHOPPING_KEYWORDS),
    });
  }

  // Emotional patterns
  const emotionalCount = countKeywords(text, EMOTIONAL_KEYWORDS);
  if (emotionalCount > 0) {
    const confidence = Math.min(95, 35 + (emotionalCount / wordCount) * 1000);
    patterns.push({
      type: PATTERN_TYPES.EMOTIONAL.title,
      confidence: Math.round(confidence),
      snippet: extractSnippet(text, EMOTIONAL_KEYWORDS),
    });
  }

  // Time-of-day patterns
  const timeCount = countKeywords(text, TIME_KEYWORDS);
  if (timeCount > 0) {
    const confidence = Math.min(95, 30 + (timeCount / wordCount) * 1000);
    patterns.push({
      type: PATTERN_TYPES.TIME_OF_DAY.title,
      confidence: Math.round(confidence),
      snippet: extractSnippet(text, TIME_KEYWORDS),
    });
  }

  // Screen-time patterns
  const scrollingCount = countKeywords(text, SCROLLING_KEYWORDS);
  if (scrollingCount > 0) {
    const confidence = Math.min(95, 45 + (scrollingCount / wordCount) * 1000);
    patterns.push({
      type: PATTERN_TYPES.SCREEN_TIME.title,
      confidence: Math.round(confidence),
      snippet: extractSnippet(text, SCROLLING_KEYWORDS),
    });
  }

  // Feedback loop patterns
  const loopCount = countKeywords(text, FEEDBACK_LOOP_KEYWORDS);
  if (loopCount > 0) {
    const confidence = Math.min(95, 50 + (loopCount / wordCount) * 1000);
    patterns.push({
      type: PATTERN_TYPES.FEEDBACK_LOOP.title,
      confidence: Math.round(confidence),
      snippet: extractSnippet(text, FEEDBACK_LOOP_KEYWORDS),
    });
  }

  return patterns.sort((a, b) => b.confidence - a.confidence);
}
