# Database Design Document
# Atomic Recovery — SQLite + Prisma

**Version:** 1.0.0  
**Architect:** Senior Database Architect Session  
**Date:** 2026-08-16  
**Engine:** SQLite (via Prisma ORM)

---

## 1. Entity Relationship Diagram

```mermaid
erDiagram
    %% ─── IDENTITY & FUTURE SELF ───────────────────────────────
    IDENTITY_PROFILE {
        string  id PK
        string  displayName
        string  identityStatement
        string  photoPath
        string  coreValues      "JSON array"
        int     xpPoints
        int     level
        datetime createdAt
        datetime updatedAt
    }

    FUTURE_SELF {
        string  id PK
        string  profileId FK
        string  visionText
        string  photoPath
        string  targetDate
        string  keyTraits       "JSON array"
        string  letterToSelf
        boolean isActive
        datetime createdAt
    }

    IDENTITY_STATEMENT {
        string  id PK
        string  profileId FK
        string  text
        string  category        "HABIT|RECOVERY|MINDSET|BODY|RELATION"
        boolean isActive
        int     displayOrder
        datetime createdAt
    }

    %% ─── RECOVERY ─────────────────────────────────────────────
    RECOVERY_SESSION {
        string   id PK
        datetime startedAt
        datetime endedAt
        boolean  isActive
        int      longestStreak
        int      totalDays
    }

    RELAPSE_EVENT {
        string   id PK
        string   sessionId FK
        datetime occurredAt
        string   triggerType    "ENUM"
        string   triggerNote
        int      urgeIntensity  "1-10"
        string   context        "TIME|PLACE|EMOTION|PERSON"
        string   recoveryNote
        boolean  wasEmergencyUsed
    }

    URGE_LOG {
        string   id PK
        datetime loggedAt
        int      intensity      "1-10"
        string   triggerType
        string   contextNote
        int      durationMinutes
        string   outcome        "RESISTED|RELAPSED|DISTRACTED"
        string   strategyUsed
        boolean  emergencyUsed
    }

    %% ─── HABITS ───────────────────────────────────────────────
    HABIT {
        string  id PK
        string  name
        string  description
        string  icon
        string  color
        string  type            "BINARY|COUNT|DURATION"
        string  frequency       "DAILY|WEEKDAYS|CUSTOM|WEEKLY"
        string  frequencyConfig "JSON"
        string  scheduledTime
        string  category
        string  cue             "Implementation intention cue"
        string  routine
        string  reward
        string  stackedAfterId FK
        boolean isCoreHabit     "Recovery-critical flag"
        boolean isArchived
        int     targetCount     "For COUNT type"
        int     targetMinutes   "For DURATION type"
        int     sortOrder
        datetime createdAt
        datetime updatedAt
    }

    HABIT_LOG {
        string   id PK
        string   habitId FK
        string   date           "YYYY-MM-DD"
        boolean  completed
        int      countValue     "For COUNT type"
        int      durationValue  "For DURATION type (minutes)"
        string   note
        datetime completedAt
        int      streakDay      "Streak day at time of completion"
    }

    HABIT_STREAK {
        string  id PK
        string  habitId FK
        int     currentStreak
        int     longestStreak
        string  lastCompletedDate "YYYY-MM-DD"
        int     totalCompletions
        datetime updatedAt
    }

    %% ─── JOURNAL ──────────────────────────────────────────────
    JOURNAL_ENTRY {
        string  id PK
        string  date            "YYYY-MM-DD" UNIQUE
        string  morningIntention
        string  eveningReflection
        string  freeWrite
        string  wins            "JSON array"
        string  gratitude       "JSON array"
        string  tomorrowFocus
        boolean isDraft
        datetime createdAt
        datetime updatedAt
    }

    %% ─── MOOD ─────────────────────────────────────────────────
    MOOD_LOG {
        string   id PK
        string   date           "YYYY-MM-DD"
        string   period         "MORNING|AFTERNOON|EVENING|NIGHT"
        int      mood           "1-5"
        int      energy         "1-5"
        int      anxiety        "1-5"
        int      focus          "1-5"
        string   emotionTags    "JSON array"
        string   note
        datetime loggedAt
    }

    %% ─── TRIGGER ANALYTICS ────────────────────────────────────
    TRIGGER_PATTERN {
        string  id PK
        string  triggerType     "BOREDOM|STRESS|LONELINESS|FATIGUE|SOCIAL|TIME"
        string  dayOfWeek       "0-6"
        string  timeOfDay       "MORNING|AFTERNOON|EVENING|NIGHT"
        int     occurrenceCount
        float   relapseRate     "0.0-1.0"
        float   resistRate
        string  topContexts     "JSON"
        datetime lastUpdated
    }

    TRIGGER_LOG {
        string   id PK
        string   triggerType
        int      intensity       "1-10"
        string   context
        string   location
        string   priorActivity
        string   emotionalState
        string   action          "What they did instead"
        string   outcome
        datetime loggedAt
    }

    %% ─── LIFE SCORE ───────────────────────────────────────────
    LIFE_SCORE {
        string  id PK
        string  date            "YYYY-MM-DD" UNIQUE
        float   recoveryScore   "0-100"
        float   habitsScore     "0-100"
        float   moodScore       "0-100"
        float   sleepScore      "0-100"
        float   focusScore      "0-100"
        float   journalScore    "0-100"
        float   overallScore    "Weighted average"
        string  breakdown       "JSON"
        datetime calculatedAt
    }

    %% ─── FOCUS SESSIONS ───────────────────────────────────────
    FOCUS_SESSION {
        string   id PK
        string   title
        string   type           "POMODORO|DEEP_WORK|FREE"
        int      plannedMinutes
        int      actualMinutes
        string   notes
        boolean  completed
        string   associatedHabitId FK
        datetime startedAt
        datetime endedAt
    }

    %% ─── SLEEP TRACKING ───────────────────────────────────────
    SLEEP_LOG {
        string   id PK
        string   date           "YYYY-MM-DD" UNIQUE
        datetime bedtime
        datetime wakeTime
        float    totalHours
        int      quality        "1-5"
        string   notes
        boolean  hadNightmares
        boolean  hadRelapseDream
        datetime loggedAt
    }

    %% ─── ACHIEVEMENTS ─────────────────────────────────────────
    ACHIEVEMENT {
        string  id PK
        string  key             "Unique achievement identifier" UNIQUE
        string  name
        string  description
        string  icon
        string  category        "RECOVERY|HABIT|JOURNAL|FOCUS|STREAK"
        string  tier            "BRONZE|SILVER|GOLD|PLATINUM"
        int     xpReward
        string  condition       "JSON — how to unlock"
        boolean isSecret
    }

    USER_ACHIEVEMENT {
        string   id PK
        string   achievementId FK
        boolean  unlocked
        int      progress       "Current progress toward unlock"
        int      target         "Target to unlock"
        datetime unlockedAt
        boolean  celebrated
    }

    MILESTONE {
        string   id PK
        int      days
        string   type           "RECOVERY|HABIT"
        string   habitId FK
        datetime achievedAt
        string   note
        boolean  celebrated
        int      xpAwarded
    }

    %% ─── SETTINGS ─────────────────────────────────────────────
    SETTINGS {
        string  id PK           "singleton"
        string  theme           "dark|light|system"
        string  accentColor
        string  language        "vi|en"
        string  pinHash
        boolean pinEnabled
        boolean biometricEnabled
        boolean notificationsOn
        string  morningReminderAt "HH:MM"
        string  eveningReminderAt "HH:MM"
        string  highRiskTimes   "JSON array of {day, startTime, endTime}"
        boolean encryptionEnabled
        string  backupPath
        string  lastBackupAt
        boolean compactMode
        boolean emergencyButtonAlwaysVisible
        string  distractionList "JSON array"
        string  affirmationSchedule "JSON"
        string  appVersion
        datetime updatedAt
    }

    %% ─── RELATIONSHIPS ────────────────────────────────────────
    IDENTITY_PROFILE ||--o{ FUTURE_SELF : "has"
    IDENTITY_PROFILE ||--o{ IDENTITY_STATEMENT : "has"
    RECOVERY_SESSION ||--o{ RELAPSE_EVENT : "contains"
    HABIT ||--o| HABIT : "stackedAfter (self-ref)"
    HABIT ||--|| HABIT_STREAK : "tracks"
    HABIT ||--o{ HABIT_LOG : "logged via"
    FOCUS_SESSION ||--o| HABIT : "linked to"
    ACHIEVEMENT ||--o{ USER_ACHIEVEMENT : "earned as"
    MILESTONE ||--o| HABIT : "optionally for"
```

---

## 2. Prisma Schema

```prisma
// prisma/schema.prisma
// Atomic Recovery — Complete Schema v1.0.0

generator client {
  provider      = "prisma-client-js"
  output        = "../electron/database/generated"
  binaryTargets = ["native", "windows", "darwin", "linux-musl"]
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
  // DATABASE_URL = "file:./data/atomic-recovery.db"
}

// ─────────────────────────────────────────────────────────────
// ENUMS (SQLite doesn't support native enums — use String + validation)
// ─────────────────────────────────────────────────────────────
// HabitType:        BINARY | COUNT | DURATION
// HabitFrequency:   DAILY | WEEKDAYS | WEEKEND | WEEKLY | CUSTOM
// HabitCategory:    RECOVERY | HEALTH | MIND | BODY | SOCIAL | WORK | CUSTOM
// TriggerType:      BOREDOM | STRESS | LONELINESS | FATIGUE | SOCIAL | FANTASY | ALCOHOL | CUSTOM
// UrgeOutcome:      RESISTED | RELAPSED | DISTRACTED | SURFED
// MoodPeriod:       MORNING | AFTERNOON | EVENING | NIGHT
// AchievementTier:  BRONZE | SILVER | GOLD | PLATINUM
// FocusType:        POMODORO | DEEP_WORK | FREE
// LifeScoreCategory: RECOVERY | HABIT | MOOD | SLEEP | FOCUS | JOURNAL
// StatementCategory: HABIT | RECOVERY | MINDSET | BODY | RELATION

// ─────────────────────────────────────────────────────────────
// IDENTITY & FUTURE SELF
// ─────────────────────────────────────────────────────────────

model IdentityProfile {
  id               String             @id @default(cuid())
  displayName      String             @default("Tôi")
  identityStatement String            @default("Tôi đang trở thành người kỷ luật.")
  photoPath        String?
  coreValues       String             @default("[]")         // JSON: string[]
  xpPoints         Int                @default(0)
  level            Int                @default(1)
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt

  futureSelf       FutureSelf[]
  statements       IdentityStatement[]

  @@map("identity_profiles")
}

model FutureSelf {
  id          String          @id @default(cuid())
  profileId   String
  profile     IdentityProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  visionText  String
  photoPath   String?
  targetDate  String?                                        // "YYYY-MM-DD"
  keyTraits   String          @default("[]")                // JSON: string[]
  letterToSelf String?
  isActive    Boolean         @default(true)
  createdAt   DateTime        @default(now())

  @@index([profileId, isActive])
  @@map("future_selves")
}

model IdentityStatement {
  id           String          @id @default(cuid())
  profileId    String
  profile      IdentityProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  text         String
  category     String          @default("RECOVERY")         // StatementCategory
  isActive     Boolean         @default(true)
  displayOrder Int             @default(0)
  createdAt    DateTime        @default(now())

  @@index([profileId, isActive])
  @@index([profileId, category])
  @@map("identity_statements")
}

// ─────────────────────────────────────────────────────────────
// RECOVERY
// ─────────────────────────────────────────────────────────────

model RecoverySession {
  id            String         @id @default(cuid())
  startedAt     DateTime       @default(now())
  endedAt       DateTime?
  isActive      Boolean        @default(true)
  longestStreak Int            @default(0)                  // cached for perf
  totalDays     Int            @default(0)                  // cached

  relapses      RelapseEvent[]

  @@index([isActive])
  @@map("recovery_sessions")
}

model RelapseEvent {
  id               String          @id @default(cuid())
  sessionId        String
  session          RecoverySession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  occurredAt       DateTime        @default(now())
  triggerType      String?                                  // TriggerType
  triggerNote      String?
  urgeIntensity    Int?                                     // 1-10
  context          String?                                  // TIME|PLACE|EMOTION|PERSON
  location         String?
  priorActivity    String?
  emotionalState   String?
  recoveryNote     String?
  wasEmergencyUsed Boolean        @default(false)

  @@index([sessionId])
  @@index([occurredAt])
  @@index([triggerType])
  @@map("relapse_events")
}

model UrgeLog {
  id              String   @id @default(cuid())
  loggedAt        DateTime @default(now())
  intensity       Int                                       // 1-10
  triggerType     String?                                   // TriggerType
  contextNote     String?
  location        String?
  priorActivity   String?
  durationMinutes Int?                                      // How long urge lasted
  outcome         String   @default("RESISTED")             // UrgeOutcome
  strategyUsed    String?                                   // TIMER|BREATHING|JOURNAL|DISTRACT|FUTURE_SELF
  emergencyUsed   Boolean  @default(false)
  timerMinutes    Int?                                      // If timer was used

  @@index([loggedAt])
  @@index([outcome])
  @@index([triggerType])
  @@map("urge_logs")
}

// ─────────────────────────────────────────────────────────────
// HABITS
// ─────────────────────────────────────────────────────────────

model Habit {
  id              String     @id @default(cuid())
  name            String
  description     String?
  icon            String?    @default("circle-check")       // Lucide icon name
  color           String?    @default("#6366f1")
  type            String     @default("BINARY")             // HabitType
  frequency       String     @default("DAILY")             // HabitFrequency
  frequencyConfig String     @default("{}")                 // JSON: {days?: number[], times?: number}
  scheduledTime   String?                                   // "HH:MM"
  category        String     @default("RECOVERY")          // HabitCategory
  cue             String?                                   // Implementation intention: when/where
  routine         String?                                   // The habit itself
  reward          String?                                   // What you get
  stackedAfterId  String?                                   // Self-reference for habit stacking
  stackedAfter    Habit?     @relation("HabitStack", fields: [stackedAfterId], references: [id])
  stackedHabits   Habit[]    @relation("HabitStack")
  isCoreHabit     Boolean    @default(false)               // Cannot be archived without warning
  isArchived      Boolean    @default(false)
  targetCount     Int?                                      // For COUNT type
  targetMinutes   Int?                                      // For DURATION type
  sortOrder       Int        @default(0)
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  logs            HabitLog[]
  streak          HabitStreak?
  focusSessions   FocusSession[]
  milestones      Milestone[]

  @@index([isArchived, frequency])
  @@index([category])
  @@index([isCoreHabit])
  @@map("habits")
}

model HabitLog {
  id            String   @id @default(cuid())
  habitId       String
  habit         Habit    @relation(fields: [habitId], references: [id], onDelete: Cascade)
  date          String                                      // "YYYY-MM-DD"
  completed     Boolean  @default(false)
  countValue    Int?                                        // For COUNT type
  durationValue Int?                                        // For DURATION type (minutes)
  note          String?
  completedAt   DateTime @default(now())
  streakDay     Int      @default(0)                       // Streak day snapshot

  @@unique([habitId, date])
  @@index([habitId, date])
  @@index([date])
  @@index([completed])
  @@map("habit_logs")
}

model HabitStreak {
  id                String   @id @default(cuid())
  habitId           String   @unique
  habit             Habit    @relation(fields: [habitId], references: [id], onDelete: Cascade)
  currentStreak     Int      @default(0)
  longestStreak     Int      @default(0)
  lastCompletedDate String?                                 // "YYYY-MM-DD"
  totalCompletions  Int      @default(0)
  updatedAt         DateTime @updatedAt

  @@map("habit_streaks")
}

// ─────────────────────────────────────────────────────────────
// JOURNAL
// ─────────────────────────────────────────────────────────────

model JournalEntry {
  id                 String   @id @default(cuid())
  date               String   @unique                      // "YYYY-MM-DD"
  morningIntention   String?
  eveningReflection  String?
  freeWrite          String?
  wins               String   @default("[]")               // JSON: string[]
  gratitude          String   @default("[]")               // JSON: string[]
  tomorrowFocus      String?
  isDraft            Boolean  @default(false)
  wordCount          Int      @default(0)                  // Cached word count
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@index([date])
  @@index([isDraft])
  @@map("journal_entries")
}

// ─────────────────────────────────────────────────────────────
// MOOD TRACKING
// ─────────────────────────────────────────────────────────────

model MoodLog {
  id           String   @id @default(cuid())
  date         String                                      // "YYYY-MM-DD"
  period       String                                      // MoodPeriod
  mood         Int                                         // 1-5: 1=Terrible 5=Excellent
  energy       Int                                         // 1-5
  anxiety      Int      @default(3)                        // 1-5 (1=calm, 5=high anxiety)
  focus        Int      @default(3)                        // 1-5
  emotionTags  String   @default("[]")                     // JSON: string[]
  note         String?
  loggedAt     DateTime @default(now())

  @@unique([date, period])
  @@index([date])
  @@index([mood])
  @@map("mood_logs")
}

// ─────────────────────────────────────────────────────────────
// TRIGGER ANALYTICS (Aggregated — updated by background job)
// ─────────────────────────────────────────────────────────────

model TriggerPattern {
  id              String   @id @default(cuid())
  triggerType     String                                   // TriggerType
  dayOfWeek       Int?                                     // 0-6 (0=Sun)
  timeOfDay       String?                                  // MoodPeriod
  occurrenceCount Int      @default(0)
  relapseCount    Int      @default(0)
  resistCount     Int      @default(0)
  relapseRate     Float    @default(0)                     // relapseCount / occurrenceCount
  resistRate      Float    @default(0)
  topContexts     String   @default("{}")                  // JSON: {context: count}
  lastUpdated     DateTime @default(now())

  @@unique([triggerType, dayOfWeek, timeOfDay])
  @@index([triggerType])
  @@index([relapseRate])
  @@map("trigger_patterns")
}

model TriggerLog {
  id             String   @id @default(cuid())
  triggerType    String                                    // TriggerType
  intensity      Int                                       // 1-10
  context        String?
  location       String?
  priorActivity  String?
  emotionalState String?
  action         String?                                   // What they did
  outcome        String?                                   // RESISTED|RELAPSED|DISTRACTED
  loggedAt       DateTime @default(now())

  @@index([loggedAt])
  @@index([triggerType, outcome])
  @@map("trigger_logs")
}

// ─────────────────────────────────────────────────────────────
// LIFE SCORE (Daily computed score)
// ─────────────────────────────────────────────────────────────

model LifeScore {
  id            String   @id @default(cuid())
  date          String   @unique                           // "YYYY-MM-DD"
  recoveryScore Float    @default(0)                       // 0-100
  habitsScore   Float    @default(0)
  moodScore     Float    @default(0)
  sleepScore    Float    @default(0)
  focusScore    Float    @default(0)
  journalScore  Float    @default(0)
  overallScore  Float    @default(0)                       // Weighted: recovery 40%, habits 25%, mood 15%, sleep 10%, focus 5%, journal 5%
  breakdown     String   @default("{}")                    // JSON: detailed calculation
  calculatedAt  DateTime @default(now())

  @@index([date])
  @@index([overallScore])
  @@map("life_scores")
}

// ─────────────────────────────────────────────────────────────
// FOCUS SESSIONS
// ─────────────────────────────────────────────────────────────

model FocusSession {
  id              String   @id @default(cuid())
  title           String?
  type            String   @default("POMODORO")            // FocusType
  plannedMinutes  Int      @default(25)
  actualMinutes   Int?
  breakMinutes    Int?
  pomodoroCount   Int      @default(0)
  notes           String?
  completed       Boolean  @default(false)
  habitId         String?
  habit           Habit?   @relation(fields: [habitId], references: [id])
  startedAt       DateTime @default(now())
  endedAt         DateTime?

  @@index([startedAt])
  @@index([completed])
  @@index([habitId])
  @@map("focus_sessions")
}

// ─────────────────────────────────────────────────────────────
// SLEEP TRACKING
// ─────────────────────────────────────────────────────────────

model SleepLog {
  id               String   @id @default(cuid())
  date             String   @unique                        // "YYYY-MM-DD" (date of sleep night)
  bedtime          DateTime
  wakeTime         DateTime
  totalHours       Float                                   // Calculated
  quality          Int                                     // 1-5
  notes            String?
  hadNightmares    Boolean  @default(false)
  hadRelapseDream  Boolean  @default(false)               // Track for pattern awareness
  screenTimeBeforeBed Int?                                 // minutes
  loggedAt         DateTime @default(now())

  @@index([date])
  @@index([quality])
  @@map("sleep_logs")
}

// ─────────────────────────────────────────────────────────────
// ACHIEVEMENTS
// ─────────────────────────────────────────────────────────────

model Achievement {
  id          String   @id @default(cuid())
  key         String   @unique                             // e.g. "recovery_7_days"
  name        String
  description String
  icon        String                                       // Lucide icon name
  category    String                                       // AchievementCategory
  tier        String   @default("BRONZE")                  // AchievementTier
  xpReward    Int      @default(50)
  condition   String   @default("{}")                      // JSON: {type, value, metric}
  isSecret    Boolean  @default(false)
  createdAt   DateTime @default(now())

  userAchievement UserAchievement?

  @@index([category])
  @@index([tier])
  @@map("achievements")
}

model UserAchievement {
  id            String      @id @default(cuid())
  achievementId String      @unique
  achievement   Achievement @relation(fields: [achievementId], references: [id])
  unlocked      Boolean     @default(false)
  progress      Int         @default(0)                   // Current progress
  target        Int         @default(1)                   // Target to unlock
  unlockedAt    DateTime?
  celebrated    Boolean     @default(false)               // Has unlock animation been shown?
  notified      Boolean     @default(false)

  @@index([unlocked])
  @@map("user_achievements")
}

model Milestone {
  id          String    @id @default(cuid())
  days        Int
  type        String    @default("RECOVERY")               // RECOVERY|HABIT
  habitId     String?
  habit       Habit?    @relation(fields: [habitId], references: [id])
  achievedAt  DateTime  @default(now())
  note        String?
  celebrated  Boolean   @default(false)
  xpAwarded   Int       @default(0)

  @@index([type, days])
  @@index([achievedAt])
  @@map("milestones")
}

// ─────────────────────────────────────────────────────────────
// SETTINGS (singleton row)
// ─────────────────────────────────────────────────────────────

model Settings {
  id                         String   @id @default("singleton")
  theme                      String   @default("dark")
  accentColor                String   @default("#6366f1")
  language                   String   @default("vi")
  pinHash                    String?                       // bcrypt hash
  pinEnabled                 Boolean  @default(false)
  biometricEnabled           Boolean  @default(false)
  notificationsOn            Boolean  @default(true)
  morningReminderAt          String?                       // "07:00"
  eveningReminderAt          String?                       // "21:00"
  highRiskTimes              String   @default("[]")       // JSON: [{day, startTime, endTime}]
  encryptionEnabled          Boolean  @default(false)
  backupPath                 String?
  lastBackupAt               String?
  compactMode                Boolean  @default(false)
  emergencyButtonVisible     Boolean  @default(true)
  distractionList            String   @default("[]")       // JSON: string[] (default distractions)
  affirmationSchedule        String   @default("{}")       // JSON: {times: string[]}
  lifeScoreWeights           String   @default("{}")       // JSON: weight overrides
  onboardingCompleted        Boolean  @default(false)
  onboardingStep             Int      @default(0)
  appVersion                 String   @default("0.1.0")
  updatedAt                  DateTime @updatedAt

  @@map("settings")
}
```

---

## 3. Index Strategy

```sql
-- ─── HIGH FREQUENCY READ INDEXES ──────────────────────────────

-- Daily dashboard: get today's habit logs
CREATE INDEX idx_habit_logs_date ON habit_logs(date);
CREATE INDEX idx_habit_logs_habit_date ON habit_logs(habit_id, date);

-- Streak calendar: last 365 days of completions
CREATE INDEX idx_habit_logs_completed ON habit_logs(completed, date);

-- Recovery: active session lookup
CREATE INDEX idx_recovery_sessions_active ON recovery_sessions(is_active);

-- Mood correlation with recovery
CREATE INDEX idx_mood_logs_date ON mood_logs(date);
CREATE INDEX idx_mood_logs_mood ON mood_logs(mood, date);

-- Analytics: trigger pattern queries
CREATE INDEX idx_trigger_logs_type_outcome ON trigger_logs(trigger_type, outcome, logged_at);
CREATE INDEX idx_urge_logs_outcome ON urge_logs(outcome, logged_at);

-- Life score time series
CREATE INDEX idx_life_scores_date ON life_scores(date);

-- Achievement progress scan
CREATE INDEX idx_user_achievements_unlocked ON user_achievements(unlocked);

-- Focus session date range
CREATE INDEX idx_focus_sessions_date ON focus_sessions(started_at);

-- Sleep quality analysis
CREATE INDEX idx_sleep_logs_date ON sleep_logs(date);

-- ─── COMPOUND INDEXES FOR ANALYTICS QUERIES ──────────────────

-- Relapse pattern: by trigger + time
CREATE INDEX idx_relapse_trigger_time ON relapse_events(trigger_type, occurred_at);

-- Habits: active non-archived by category
CREATE INDEX idx_habits_active ON habits(is_archived, category, sort_order);

-- Journal completeness
CREATE INDEX idx_journal_date ON journal_entries(date, is_draft);
```

---

## 4. Migration Plan

### Migration 0001 — Initial Schema (MVP)

**Creates:**
- `settings` (singleton)
- `identity_profiles`
- `recovery_sessions`
- `relapse_events`
- `habits`
- `habit_logs`
- `habit_streaks`
- `journal_entries`
- `mood_logs`
- `life_scores`
- `achievements` (seed data)
- `user_achievements`
- `milestones`

**Seed data included:**
```sql
-- Insert default settings singleton
INSERT INTO settings (id, "updatedAt") VALUES ('singleton', datetime('now'));

-- Insert default identity profile
INSERT INTO identity_profiles (id, "displayName", "identityStatement", "coreValues", "xpPoints", "level", "createdAt", "updatedAt")
VALUES (cuid(), 'Tôi', 'Tôi đang trở thành người kỷ luật.', '[]', 0, 1, datetime('now'), datetime('now'));

-- Seed achievements (30 achievements)
INSERT INTO achievements (id, key, name, description, icon, category, tier, "xpReward", condition) VALUES
  (cuid(), 'first_day',       'Ngày Đầu Tiên',     '1 ngày không relapse',       'sun',         'RECOVERY', 'BRONZE',   25,  '{"type":"recovery_streak","value":1}'),
  (cuid(), 'three_days',      'Ba Ngày Vàng',       '3 ngày liên tiếp',           'award',       'RECOVERY', 'BRONZE',   50,  '{"type":"recovery_streak","value":3}'),
  (cuid(), 'one_week',        'Một Tuần Bản Lĩnh',  '7 ngày liên tiếp',           'shield',      'RECOVERY', 'SILVER',   150, '{"type":"recovery_streak","value":7}'),
  (cuid(), 'two_weeks',       'Hai Tuần Kiên Định', '14 ngày liên tiếp',          'zap',         'RECOVERY', 'SILVER',   250, '{"type":"recovery_streak","value":14}'),
  (cuid(), 'one_month',       'Một Tháng Tự Do',    '30 ngày liên tiếp',          'trophy',      'RECOVERY', 'GOLD',     500, '{"type":"recovery_streak","value":30}'),
  (cuid(), 'ninety_days',     '90 Ngày Chiến Binh', '90 ngày liên tiếp',          'crown',       'RECOVERY', 'PLATINUM', 1000,'{"type":"recovery_streak","value":90}'),
  (cuid(), 'first_habit',     'Khởi Đầu Tốt',       'Tạo habit đầu tiên',         'plus-circle', 'HABIT',    'BRONZE',   25,  '{"type":"habit_count","value":1}'),
  (cuid(), 'habit_week',      'Tuần Hoàn Thành',    'Hoàn thành habit 7 ngày',    'check-circle','HABIT',    'SILVER',   100, '{"type":"habit_streak","value":7}'),
  (cuid(), 'urge_surfer',     'Surfer Cơn Thèm',    'Vượt qua urge 5 lần',        'waves',       'RECOVERY', 'SILVER',   200, '{"type":"urge_resisted","value":5}'),
  (cuid(), 'journal_start',   'Nhà Văn Nội Tâm',    'Viết journal lần đầu',       'book-open',   'JOURNAL',  'BRONZE',   25,  '{"type":"journal_count","value":1}'),
  (cuid(), 'focus_master',    'Tập Trung Tuyệt Đỉnh','Hoàn thành 10 focus session','target',     'FOCUS',    'SILVER',   150, '{"type":"focus_sessions","value":10}');
```

### Migration 0002 — V1 Features

**Adds:**
- `future_selves`
- `identity_statements`
- `trigger_patterns`
- `trigger_logs`
- `urge_logs`
- `focus_sessions`
- `sleep_logs`
- New columns on `habits`: `cue`, `routine`, `reward`, `stackedAfterId`
- New columns on `settings`: `highRiskTimes`, `distractionList`

### Migration 0003 — V2 Analytics

**Adds:**
- Computed columns on `life_scores`
- `lifeScoreWeights` in settings
- New achievement seeds
- `trigger_patterns` aggregation triggers (via application logic, not DB triggers)

---

## 5. Data Validation Rules

### Application-Layer Validation (in Service classes)

```typescript
// shared/validation/schemas.ts — using Zod

import { z } from 'zod'

// ─── HABIT ───────────────────────────────────────────────────
export const CreateHabitSchema = z.object({
  name:          z.string().min(1).max(100),
  description:   z.string().max(500).optional(),
  icon:          z.string().max(50).optional(),
  color:         z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  type:          z.enum(['BINARY', 'COUNT', 'DURATION']),
  frequency:     z.enum(['DAILY', 'WEEKDAYS', 'WEEKEND', 'WEEKLY', 'CUSTOM']),
  scheduledTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  category:      z.enum(['RECOVERY', 'HEALTH', 'MIND', 'BODY', 'SOCIAL', 'WORK', 'CUSTOM']),
  targetCount:   z.number().int().positive().max(1000).optional(),
  targetMinutes: z.number().int().positive().max(480).optional(),
  isCoreHabit:   z.boolean().default(false),
})

// ─── RELAPSE ─────────────────────────────────────────────────
export const LogRelapseSchema = z.object({
  triggerType:    z.enum(['BOREDOM', 'STRESS', 'LONELINESS', 'FATIGUE', 'SOCIAL', 'FANTASY', 'ALCOHOL', 'CUSTOM']).optional(),
  triggerNote:    z.string().max(1000).optional(),
  urgeIntensity:  z.number().int().min(1).max(10).optional(),
  context:        z.string().max(100).optional(),
  recoveryNote:   z.string().max(2000).optional(),
  wasEmergencyUsed: z.boolean().default(false),
})

// ─── MOOD ────────────────────────────────────────────────────
export const CreateMoodLogSchema = z.object({
  date:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  period:      z.enum(['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT']),
  mood:        z.number().int().min(1).max(5),
  energy:      z.number().int().min(1).max(5),
  anxiety:     z.number().int().min(1).max(5).default(3),
  focus:       z.number().int().min(1).max(5).default(3),
  emotionTags: z.array(z.string().max(30)).max(10).default([]),
  note:        z.string().max(500).optional(),
})

// ─── URGE LOG ────────────────────────────────────────────────
export const LogUrgeSchema = z.object({
  intensity:      z.number().int().min(1).max(10),
  triggerType:    z.enum(['BOREDOM', 'STRESS', 'LONELINESS', 'FATIGUE', 'SOCIAL', 'FANTASY', 'ALCOHOL', 'CUSTOM']).optional(),
  contextNote:    z.string().max(500).optional(),
  durationMinutes: z.number().int().positive().max(480).optional(),
  outcome:        z.enum(['RESISTED', 'RELAPSED', 'DISTRACTED', 'SURFED']),
  strategyUsed:   z.string().max(50).optional(),
  emergencyUsed:  z.boolean().default(false),
  timerMinutes:   z.number().int().positive().max(60).optional(),
})

// ─── JOURNAL ─────────────────────────────────────────────────
export const SaveJournalEntrySchema = z.object({
  date:              z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  morningIntention:  z.string().max(2000).optional(),
  eveningReflection: z.string().max(2000).optional(),
  freeWrite:         z.string().max(10000).optional(),
  wins:              z.array(z.string().max(200)).max(10).default([]),
  gratitude:         z.array(z.string().max(200)).max(10).default([]),
  tomorrowFocus:     z.string().max(500).optional(),
  isDraft:           z.boolean().default(false),
})

// ─── FOCUS SESSION ───────────────────────────────────────────
export const CreateFocusSessionSchema = z.object({
  title:          z.string().max(100).optional(),
  type:           z.enum(['POMODORO', 'DEEP_WORK', 'FREE']).default('POMODORO'),
  plannedMinutes: z.number().int().min(1).max(480).default(25),
  habitId:        z.string().optional(),
})

// ─── SLEEP ───────────────────────────────────────────────────
export const CreateSleepLogSchema = z.object({
  date:              z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  bedtime:           z.string().datetime(),
  wakeTime:          z.string().datetime(),
  quality:           z.number().int().min(1).max(5),
  notes:             z.string().max(500).optional(),
  hadNightmares:     z.boolean().default(false),
  hadRelapseDream:   z.boolean().default(false),
  screenTimeBeforeBed: z.number().int().min(0).max(480).optional(),
}).refine(
  data => new Date(data.wakeTime) > new Date(data.bedtime),
  { message: 'Wake time must be after bedtime', path: ['wakeTime'] }
)
```

---

## 6. Data Access Patterns

### Pattern 1: Daily Dashboard Load

```typescript
// Load everything needed for today's dashboard in one batch
async function getDashboardData(today: string) {
  const [
    recoverySession,
    todayHabitLogs,
    morningMood,
    journalEntry,
    activeHabits,
    recentMilestones,
  ] = await Promise.all([
    prisma.recoverySession.findFirst({
      where: { isActive: true },
      include: { relapses: { orderBy: { occurredAt: 'desc' }, take: 1 } }
    }),
    prisma.habitLog.findMany({
      where: { date: today },
      include: { habit: { select: { id: true, name: true, icon: true, color: true, type: true } } }
    }),
    prisma.moodLog.findFirst({
      where: { date: today, period: 'MORNING' }
    }),
    prisma.journalEntry.findFirst({
      where: { date: today },
      select: { id: true, morningIntention: true, isDraft: true }
    }),
    prisma.habit.findMany({
      where: { isArchived: false },
      include: { streak: true },
      orderBy: { sortOrder: 'asc' }
    }),
    prisma.milestone.findMany({
      where: { celebrated: false },
      orderBy: { achievedAt: 'desc' }
    }),
  ])

  return { recoverySession, todayHabitLogs, morningMood, journalEntry, activeHabits, recentMilestones }
}
```

### Pattern 2: Streak Calendar (Heatmap)

```typescript
// Get 365 days of habit completion data for heatmap
async function getHabitHeatmap(habitId: string, year: number) {
  const startDate = `${year}-01-01`
  const endDate   = `${year}-12-31`

  return prisma.habitLog.findMany({
    where: {
      habitId,
      date: { gte: startDate, lte: endDate },
    },
    select: { date: true, completed: true, countValue: true, durationValue: true },
    orderBy: { date: 'asc' },
  })
}

// Get recovery heatmap (sobriety calendar)
async function getRecoveryHeatmap(year: number) {
  const relapses = await prisma.relapseEvent.findMany({
    where: {
      occurredAt: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      }
    },
    select: { occurredAt: true },
  })
  // Return as set of relapse dates for O(1) lookup in renderer
  return new Set(relapses.map(r => r.occurredAt.toISOString().split('T')[0]))
}
```

### Pattern 3: Trigger Analytics Aggregation

```typescript
// Aggregate trigger patterns (run after each relapse or daily)
async function refreshTriggerPatterns() {
  const recentLogs = await prisma.triggerLog.findMany({
    where: { loggedAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } }
  })

  // Group by triggerType + outcome
  const grouped = recentLogs.reduce((acc, log) => {
    const key = `${log.triggerType}`
    if (!acc[key]) acc[key] = { total: 0, relapsed: 0, resisted: 0 }
    acc[key].total++
    if (log.outcome === 'RELAPSED') acc[key].relapsed++
    if (log.outcome === 'RESISTED') acc[key].resisted++
    return acc
  }, {} as Record<string, any>)

  // Upsert patterns
  for (const [triggerType, counts] of Object.entries(grouped)) {
    await prisma.triggerPattern.upsert({
      where: { triggerType_dayOfWeek_timeOfDay: { triggerType, dayOfWeek: null, timeOfDay: null } },
      create: { triggerType, occurrenceCount: counts.total, relapseCount: counts.relapsed, resistCount: counts.resisted, relapseRate: counts.relapsed / counts.total, resistRate: counts.resisted / counts.total },
      update: { occurrenceCount: counts.total, relapseCount: counts.relapsed, resistCount: counts.resisted, relapseRate: counts.relapsed / counts.total, resistRate: counts.resisted / counts.total, lastUpdated: new Date() },
    })
  }
}
```

### Pattern 4: Life Score Calculation

```typescript
// Calculate daily life score
async function calculateLifeScore(date: string): Promise<LifeScore> {
  const [habits, mood, sleep, journal, focus, recovery] = await Promise.all([
    getHabitCompletionRate(date),          // 0-100
    getMoodAverage(date),                  // 0-100
    getSleepScore(date),                   // 0-100
    getJournalCompletionScore(date),       // 0-100
    getFocusScore(date),                   // 0-100
    getRecoveryScore(date),                // 0-100 (clean day = 100, relapse = 0)
  ])

  // Weights: recovery dominates
  const overallScore =
    recovery * 0.40 +
    habits   * 0.25 +
    mood     * 0.15 +
    sleep    * 0.10 +
    focus    * 0.05 +
    journal  * 0.05

  return prisma.lifeScore.upsert({
    where: { date },
    create: { date, recoveryScore: recovery, habitsScore: habits, moodScore: mood, sleepScore: sleep, focusScore: focus, journalScore: journal, overallScore },
    update: { recoveryScore: recovery, habitsScore: habits, moodScore: mood, sleepScore: sleep, focusScore: focus, journalScore: journal, overallScore, calculatedAt: new Date() },
  })
}
```

### Pattern 5: Achievement Progress Check

```typescript
// Check and unlock achievements after any significant action
async function checkAchievements(context: {
  recoveryStreak?: number
  habitStreak?: { habitId: string, days: number }
  urgesResisted?: number
  journalCount?: number
  focusSessionsTotal?: number
}) {
  const locked = await prisma.userAchievement.findMany({
    where: { unlocked: false },
    include: { achievement: true }
  })

  const toUnlock: string[] = []

  for (const ua of locked) {
    const cond = JSON.parse(ua.achievement.condition)
    let progress = 0

    if (cond.type === 'recovery_streak' && context.recoveryStreak !== undefined) {
      progress = context.recoveryStreak
      if (progress >= cond.value) toUnlock.push(ua.id)
    }
    if (cond.type === 'urge_resisted' && context.urgesResisted !== undefined) {
      progress = context.urgesResisted
      if (progress >= cond.value) toUnlock.push(ua.id)
    }
    // ... other checks

    await prisma.userAchievement.update({
      where: { id: ua.id },
      data: { progress, target: cond.value }
    })
  }

  if (toUnlock.length > 0) {
    await prisma.userAchievement.updateMany({
      where: { id: { in: toUnlock } },
      data: { unlocked: true, unlockedAt: new Date() }
    })
  }

  return toUnlock // IDs to show celebration UI for
}
```

---

## 7. Database Sizing Estimate

| Table | Rows/day | 1 Year | Size Est. |
|-------|----------|--------|-----------|
| habit_logs | 5-10 | 1,825-3,650 | ~500KB |
| mood_logs | 2-4 | 730-1,460 | ~200KB |
| journal_entries | 1 | 365 | ~5MB (text) |
| urge_logs | 0-3 | 0-1,095 | ~200KB |
| trigger_logs | 0-3 | 0-1,095 | ~100KB |
| life_scores | 1 | 365 | ~100KB |
| focus_sessions | 0-5 | 0-1,825 | ~200KB |
| sleep_logs | 1 | 365 | ~100KB |
| **Total** | | | **~6-8MB/year** |

> SQLite handles this effortlessly. No pagination needed for most queries within 5-year lifespan (~30-40MB).
