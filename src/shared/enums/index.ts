// src/shared/enums/index.ts
// Atomic Recovery — All Enum Definitions

export enum HabitType {
  BINARY = 'BINARY',
  COUNT = 'COUNT',
  DURATION = 'DURATION'
}

export enum HabitFrequency {
  DAILY = 'DAILY',
  WEEKDAYS = 'WEEKDAYS',
  WEEKENDS = 'WEEKENDS',
  CUSTOM = 'CUSTOM'
}

export enum HabitCategory {
  RECOVERY = 'RECOVERY',
  HEALTH = 'HEALTH',
  MINDSET = 'MINDSET',
  PRODUCTIVITY = 'PRODUCTIVITY',
  FITNESS = 'FITNESS',
  SOCIAL = 'SOCIAL',
  CUSTOM = 'CUSTOM'
}

export enum TriggerType {
  BOREDOM = 'BOREDOM',
  STRESS = 'STRESS',
  LONELINESS = 'LONELINESS',
  ANXIETY = 'ANXIETY',
  ANGER = 'ANGER',
  SADNESS = 'SADNESS',
  EXCITEMENT = 'EXCITEMENT',
  LATE_NIGHT = 'LATE_NIGHT',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  ALCOHOL = 'ALCOHOL',
  OTHER = 'OTHER'
}

export enum UrgeOutcome {
  RESISTED = 'RESISTED',
  RELAPSED = 'RELAPSED',
  REDIRECTED = 'REDIRECTED'
}

export enum MoodPeriod {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT'
}

export enum StatementCategory {
  RECOVERY = 'RECOVERY',
  GROWTH = 'GROWTH',
  STRENGTH = 'STRENGTH',
  PURPOSE = 'PURPOSE'
}

export enum MilestoneType {
  RECOVERY = 'RECOVERY',
  HABIT = 'HABIT'
}

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system'
}
