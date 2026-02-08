export const PATTERN_TYPES = {
  SHOPPING: {
    id: 'shopping',
    title: 'Shopping & Spending Triggers',
    description: 'Patterns related to online shopping, purchases, and spending behaviors',
  },
  EMOTIONAL: {
    id: 'emotional',
    title: 'Emotional Tone',
    description: 'Emotional language and sentiment patterns in your activity',
  },
  TIME_OF_DAY: {
    id: 'time-of-day',
    title: 'Time-of-Day Habits',
    description: 'Temporal patterns and time-based behavioral cues',
  },
  SCREEN_TIME: {
    id: 'screen-time',
    title: 'Screen-Time & Scrolling',
    description: 'Indicators of prolonged engagement and scrolling behaviors',
  },
  FEEDBACK_LOOP: {
    id: 'feedback-loop',
    title: 'Cue-Craving-Reward Loops',
    description: 'Addictive feedback patterns and habit loop language',
  },
} as const;

export type PatternType = keyof typeof PATTERN_TYPES;
