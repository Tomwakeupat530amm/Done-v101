-- CreateTable
CREATE TABLE "identity_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL DEFAULT 'Tôi',
    "identityStatement" TEXT NOT NULL DEFAULT 'Tôi đang trở thành người kỷ luật.',
    "photoPath" TEXT,
    "coreValues" TEXT NOT NULL DEFAULT '[]',
    "xpPoints" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "future_selves" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "visionText" TEXT NOT NULL,
    "photoPath" TEXT,
    "targetDate" TEXT,
    "keyTraits" TEXT NOT NULL DEFAULT '[]',
    "letterToSelf" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "future_selves_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "identity_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "identity_statements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'RECOVERY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "identity_statements_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "identity_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "recovery_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "totalDays" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "relapse_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "occurredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "triggerType" TEXT,
    "triggerNote" TEXT,
    "urgeIntensity" INTEGER,
    "context" TEXT,
    "location" TEXT,
    "priorActivity" TEXT,
    "emotionalState" TEXT,
    "recoveryNote" TEXT,
    "wasEmergencyUsed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "relapse_events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "recovery_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "urge_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loggedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "intensity" INTEGER NOT NULL,
    "triggerType" TEXT,
    "contextNote" TEXT,
    "location" TEXT,
    "priorActivity" TEXT,
    "durationMinutes" INTEGER,
    "outcome" TEXT NOT NULL DEFAULT 'RESISTED',
    "strategyUsed" TEXT,
    "emergencyUsed" BOOLEAN NOT NULL DEFAULT false,
    "timerMinutes" INTEGER
);

-- CreateTable
CREATE TABLE "habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT DEFAULT 'circle-check',
    "color" TEXT DEFAULT '#6366f1',
    "type" TEXT NOT NULL DEFAULT 'BINARY',
    "frequency" TEXT NOT NULL DEFAULT 'DAILY',
    "frequencyConfig" TEXT NOT NULL DEFAULT '{}',
    "scheduledTime" TEXT,
    "category" TEXT NOT NULL DEFAULT 'RECOVERY',
    "cue" TEXT,
    "routine" TEXT,
    "reward" TEXT,
    "stackedAfterId" TEXT,
    "isCoreHabit" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "targetCount" INTEGER,
    "targetMinutes" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "habits_stackedAfterId_fkey" FOREIGN KEY ("stackedAfterId") REFERENCES "habits" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "habit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "habitId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "countValue" INTEGER,
    "durationValue" INTEGER,
    "note" TEXT,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "streakDay" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "habit_logs_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "habit_streaks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "habitId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastCompletedDate" TEXT,
    "totalCompletions" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "habit_streaks_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "morningIntention" TEXT,
    "eveningReflection" TEXT,
    "freeWrite" TEXT,
    "wins" TEXT NOT NULL DEFAULT '[]',
    "gratitude" TEXT NOT NULL DEFAULT '[]',
    "tomorrowFocus" TEXT,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "mood_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "mood" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,
    "anxiety" INTEGER NOT NULL DEFAULT 3,
    "focus" INTEGER NOT NULL DEFAULT 3,
    "emotionTags" TEXT NOT NULL DEFAULT '[]',
    "note" TEXT,
    "loggedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "trigger_patterns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "triggerType" TEXT NOT NULL,
    "dayOfWeek" INTEGER,
    "timeOfDay" TEXT,
    "occurrenceCount" INTEGER NOT NULL DEFAULT 0,
    "relapseCount" INTEGER NOT NULL DEFAULT 0,
    "resistCount" INTEGER NOT NULL DEFAULT 0,
    "relapseRate" REAL NOT NULL DEFAULT 0,
    "resistRate" REAL NOT NULL DEFAULT 0,
    "topContexts" TEXT NOT NULL DEFAULT '{}',
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "trigger_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "triggerType" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL,
    "context" TEXT,
    "location" TEXT,
    "priorActivity" TEXT,
    "emotionalState" TEXT,
    "action" TEXT,
    "outcome" TEXT,
    "loggedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "life_scores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "recoveryScore" REAL NOT NULL DEFAULT 0,
    "habitsScore" REAL NOT NULL DEFAULT 0,
    "moodScore" REAL NOT NULL DEFAULT 0,
    "sleepScore" REAL NOT NULL DEFAULT 0,
    "focusScore" REAL NOT NULL DEFAULT 0,
    "journalScore" REAL NOT NULL DEFAULT 0,
    "overallScore" REAL NOT NULL DEFAULT 0,
    "breakdown" TEXT NOT NULL DEFAULT '{}',
    "calculatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "focus_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "type" TEXT NOT NULL DEFAULT 'POMODORO',
    "plannedMinutes" INTEGER NOT NULL DEFAULT 25,
    "actualMinutes" INTEGER,
    "breakMinutes" INTEGER,
    "pomodoroCount" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "habitId" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    CONSTRAINT "focus_sessions_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sleep_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "bedtime" DATETIME NOT NULL,
    "wakeTime" DATETIME NOT NULL,
    "totalHours" REAL NOT NULL,
    "quality" INTEGER NOT NULL,
    "notes" TEXT,
    "hadNightmares" BOOLEAN NOT NULL DEFAULT false,
    "hadRelapseDream" BOOLEAN NOT NULL DEFAULT false,
    "screenTimeBeforeBed" INTEGER,
    "loggedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'BRONZE',
    "xpReward" INTEGER NOT NULL DEFAULT 50,
    "condition" TEXT NOT NULL DEFAULT '{}',
    "isSecret" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "achievementId" TEXT NOT NULL,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "target" INTEGER NOT NULL DEFAULT 1,
    "unlockedAt" DATETIME,
    "celebrated" BOOLEAN NOT NULL DEFAULT false,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "user_achievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievements" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "days" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'RECOVERY',
    "habitId" TEXT,
    "achievedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "celebrated" BOOLEAN NOT NULL DEFAULT false,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "milestones_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "accentColor" TEXT NOT NULL DEFAULT '#6366f1',
    "language" TEXT NOT NULL DEFAULT 'vi',
    "pinHash" TEXT,
    "pinEnabled" BOOLEAN NOT NULL DEFAULT false,
    "biometricEnabled" BOOLEAN NOT NULL DEFAULT false,
    "notificationsOn" BOOLEAN NOT NULL DEFAULT true,
    "morningReminderAt" TEXT,
    "eveningReminderAt" TEXT,
    "highRiskTimes" TEXT NOT NULL DEFAULT '[]',
    "encryptionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "backupPath" TEXT,
    "lastBackupAt" TEXT,
    "compactMode" BOOLEAN NOT NULL DEFAULT false,
    "emergencyButtonVisible" BOOLEAN NOT NULL DEFAULT true,
    "distractionList" TEXT NOT NULL DEFAULT '[]',
    "affirmationSchedule" TEXT NOT NULL DEFAULT '{}',
    "lifeScoreWeights" TEXT NOT NULL DEFAULT '{}',
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "onboardingStep" INTEGER NOT NULL DEFAULT 0,
    "appVersion" TEXT NOT NULL DEFAULT '0.1.0',
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "future_selves_profileId_isActive_idx" ON "future_selves"("profileId", "isActive");

-- CreateIndex
CREATE INDEX "identity_statements_profileId_isActive_idx" ON "identity_statements"("profileId", "isActive");

-- CreateIndex
CREATE INDEX "identity_statements_profileId_category_idx" ON "identity_statements"("profileId", "category");

-- CreateIndex
CREATE INDEX "recovery_sessions_isActive_idx" ON "recovery_sessions"("isActive");

-- CreateIndex
CREATE INDEX "relapse_events_sessionId_idx" ON "relapse_events"("sessionId");

-- CreateIndex
CREATE INDEX "relapse_events_occurredAt_idx" ON "relapse_events"("occurredAt");

-- CreateIndex
CREATE INDEX "relapse_events_triggerType_idx" ON "relapse_events"("triggerType");

-- CreateIndex
CREATE INDEX "urge_logs_loggedAt_idx" ON "urge_logs"("loggedAt");

-- CreateIndex
CREATE INDEX "urge_logs_outcome_idx" ON "urge_logs"("outcome");

-- CreateIndex
CREATE INDEX "urge_logs_triggerType_idx" ON "urge_logs"("triggerType");

-- CreateIndex
CREATE INDEX "habits_isArchived_frequency_idx" ON "habits"("isArchived", "frequency");

-- CreateIndex
CREATE INDEX "habits_category_idx" ON "habits"("category");

-- CreateIndex
CREATE INDEX "habits_isCoreHabit_idx" ON "habits"("isCoreHabit");

-- CreateIndex
CREATE INDEX "habit_logs_habitId_date_idx" ON "habit_logs"("habitId", "date");

-- CreateIndex
CREATE INDEX "habit_logs_date_idx" ON "habit_logs"("date");

-- CreateIndex
CREATE INDEX "habit_logs_completed_idx" ON "habit_logs"("completed");

-- CreateIndex
CREATE UNIQUE INDEX "habit_logs_habitId_date_key" ON "habit_logs"("habitId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "habit_streaks_habitId_key" ON "habit_streaks"("habitId");

-- CreateIndex
CREATE UNIQUE INDEX "journal_entries_date_key" ON "journal_entries"("date");

-- CreateIndex
CREATE INDEX "journal_entries_date_idx" ON "journal_entries"("date");

-- CreateIndex
CREATE INDEX "journal_entries_isDraft_idx" ON "journal_entries"("isDraft");

-- CreateIndex
CREATE INDEX "mood_logs_date_idx" ON "mood_logs"("date");

-- CreateIndex
CREATE INDEX "mood_logs_mood_idx" ON "mood_logs"("mood");

-- CreateIndex
CREATE UNIQUE INDEX "mood_logs_date_period_key" ON "mood_logs"("date", "period");

-- CreateIndex
CREATE INDEX "trigger_patterns_triggerType_idx" ON "trigger_patterns"("triggerType");

-- CreateIndex
CREATE INDEX "trigger_patterns_relapseRate_idx" ON "trigger_patterns"("relapseRate");

-- CreateIndex
CREATE UNIQUE INDEX "trigger_patterns_triggerType_dayOfWeek_timeOfDay_key" ON "trigger_patterns"("triggerType", "dayOfWeek", "timeOfDay");

-- CreateIndex
CREATE INDEX "trigger_logs_loggedAt_idx" ON "trigger_logs"("loggedAt");

-- CreateIndex
CREATE INDEX "trigger_logs_triggerType_outcome_idx" ON "trigger_logs"("triggerType", "outcome");

-- CreateIndex
CREATE UNIQUE INDEX "life_scores_date_key" ON "life_scores"("date");

-- CreateIndex
CREATE INDEX "life_scores_date_idx" ON "life_scores"("date");

-- CreateIndex
CREATE INDEX "life_scores_overallScore_idx" ON "life_scores"("overallScore");

-- CreateIndex
CREATE INDEX "focus_sessions_startedAt_idx" ON "focus_sessions"("startedAt");

-- CreateIndex
CREATE INDEX "focus_sessions_completed_idx" ON "focus_sessions"("completed");

-- CreateIndex
CREATE INDEX "focus_sessions_habitId_idx" ON "focus_sessions"("habitId");

-- CreateIndex
CREATE UNIQUE INDEX "sleep_logs_date_key" ON "sleep_logs"("date");

-- CreateIndex
CREATE INDEX "sleep_logs_date_idx" ON "sleep_logs"("date");

-- CreateIndex
CREATE INDEX "sleep_logs_quality_idx" ON "sleep_logs"("quality");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_key_key" ON "achievements"("key");

-- CreateIndex
CREATE INDEX "achievements_category_idx" ON "achievements"("category");

-- CreateIndex
CREATE INDEX "achievements_tier_idx" ON "achievements"("tier");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_achievementId_key" ON "user_achievements"("achievementId");

-- CreateIndex
CREATE INDEX "user_achievements_unlocked_idx" ON "user_achievements"("unlocked");

-- CreateIndex
CREATE INDEX "milestones_type_days_idx" ON "milestones"("type", "days");

-- CreateIndex
CREATE INDEX "milestones_achievedAt_idx" ON "milestones"("achievedAt");
