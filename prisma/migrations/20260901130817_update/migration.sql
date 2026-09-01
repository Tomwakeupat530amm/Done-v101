/*
  Warnings:

  - You are about to drop the `focus_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `journal_entries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mood_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sleep_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `breakdown` on the `life_scores` table. All the data in the column will be lost.
  - You are about to drop the column `focusScore` on the `life_scores` table. All the data in the column will be lost.
  - You are about to drop the column `journalScore` on the `life_scores` table. All the data in the column will be lost.
  - You are about to drop the column `sleepScore` on the `life_scores` table. All the data in the column will be lost.
  - You are about to drop the column `lifeScoreWeights` on the `settings` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "focus_sessions_habitId_idx";

-- DropIndex
DROP INDEX "focus_sessions_completed_idx";

-- DropIndex
DROP INDEX "focus_sessions_startedAt_idx";

-- DropIndex
DROP INDEX "journal_entries_isDraft_idx";

-- DropIndex
DROP INDEX "journal_entries_date_idx";

-- DropIndex
DROP INDEX "journal_entries_date_key";

-- DropIndex
DROP INDEX "mood_logs_date_period_key";

-- DropIndex
DROP INDEX "mood_logs_mood_idx";

-- DropIndex
DROP INDEX "mood_logs_date_idx";

-- DropIndex
DROP INDEX "sleep_logs_quality_idx";

-- DropIndex
DROP INDEX "sleep_logs_date_idx";

-- DropIndex
DROP INDEX "sleep_logs_date_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "focus_sessions";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "journal_entries";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "mood_logs";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "sleep_logs";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "daily_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "mood" INTEGER,
    "energy" INTEGER,
    "emotionTags" TEXT NOT NULL DEFAULT '[]',
    "morningIntention" TEXT,
    "gratitude" TEXT NOT NULL DEFAULT '[]',
    "reflection" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "order" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completedAt" DATETIME
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_life_scores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "recoveryScore" REAL NOT NULL DEFAULT 0,
    "habitsScore" REAL NOT NULL DEFAULT 0,
    "moodScore" REAL NOT NULL DEFAULT 0,
    "overallScore" REAL NOT NULL DEFAULT 0,
    "calculatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_life_scores" ("calculatedAt", "date", "habitsScore", "id", "moodScore", "overallScore", "recoveryScore") SELECT "calculatedAt", "date", "habitsScore", "id", "moodScore", "overallScore", "recoveryScore" FROM "life_scores";
DROP TABLE "life_scores";
ALTER TABLE "new_life_scores" RENAME TO "life_scores";
CREATE UNIQUE INDEX "life_scores_date_key" ON "life_scores"("date");
CREATE INDEX "life_scores_date_idx" ON "life_scores"("date");
CREATE INDEX "life_scores_overallScore_idx" ON "life_scores"("overallScore");
CREATE TABLE "new_settings" (
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
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "onboardingStep" INTEGER NOT NULL DEFAULT 0,
    "appVersion" TEXT NOT NULL DEFAULT '0.1.0',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_settings" ("accentColor", "affirmationSchedule", "appVersion", "backupPath", "biometricEnabled", "compactMode", "distractionList", "emergencyButtonVisible", "encryptionEnabled", "eveningReminderAt", "highRiskTimes", "id", "language", "lastBackupAt", "morningReminderAt", "notificationsOn", "onboardingCompleted", "onboardingStep", "pinEnabled", "pinHash", "theme", "updatedAt") SELECT "accentColor", "affirmationSchedule", "appVersion", "backupPath", "biometricEnabled", "compactMode", "distractionList", "emergencyButtonVisible", "encryptionEnabled", "eveningReminderAt", "highRiskTimes", "id", "language", "lastBackupAt", "morningReminderAt", "notificationsOn", "onboardingCompleted", "onboardingStep", "pinEnabled", "pinHash", "theme", "updatedAt" FROM "settings";
DROP TABLE "settings";
ALTER TABLE "new_settings" RENAME TO "settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "daily_logs_date_key" ON "daily_logs"("date");

-- CreateIndex
CREATE INDEX "daily_logs_date_idx" ON "daily_logs"("date");

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "tasks"("status");

-- CreateIndex
CREATE INDEX "tasks_order_idx" ON "tasks"("order");
