# Master Execution Plan
# Atomic Recovery — Solo Developer Edition

**Version:** 1.0.0  
**Role:** Staff Software Architect + Technical Lead + Senior Product Engineer  
**Date:** 2026-08-16  
**Audience:** Solo Developer  
**Goal:** Start coding immediately after reading this document.

> **RIPER-5 Status:** This document is an EXECUTE-phase contract. All decisions below are locked. Changes require a new PLAN phase with explicit approval.

---

# PHẦN 1 — REVIEW

## 1.1 Điểm Mạnh

| Điểm mạnh | Đánh giá |
|-----------|----------|
| **Core insight rõ ràng** | Identity > Outcome là differentiator thực sự. Không có app nào làm tốt điều này. |
| **Privacy-first architecture** | Local SQLite + no cloud là đúng cho sensitive data. Non-negotiable. |
| **Clean Architecture + Feature-Based** | Đúng cho Electron app dài hạn. Dễ scale, dễ test, dễ onboard. |
| **Emergency Mode được thiết kế tốt** | Full-screen overlay với timer + distraction toolkit — đây là killer feature. |
| **Non-judgmental UX copy** | Relapse ≠ failure messaging sẽ giữ người dùng lại sau thất bại. |
| **Database schema đủ sâu** | 13 models, indexes hợp lý, sizing estimate realistic. |
| **Tech stack nhất quán** | Electron-Vite + React + TypeScript + Prisma là proven combo. |

## 1.2 Điểm Yếu

| Điểm yếu | Mức độ | Giải pháp |
|----------|--------|-----------|
| **Quá nhiều features cho MVP** | 🔴 Cao | Cắt aggressive — xem Phần 2 |
| **Life Score quá phức tạp** | 🟡 Trung bình | Defer sang V2, MVP dùng simple score |
| **Trigger Analytics aggregation** | 🟡 Trung bình | Background job phức tạp — simplify MVP |
| **Repository pattern overkill cho solo dev** | 🟡 Trung bình | Simplify: service trực tiếp dùng Prisma, skip interface abstraction cho MVP |
| **Journal "Notion-style blocks"** | 🔴 Cao | Đây là feature 3-4 tuần riêng — thay bằng simple textarea cho MVP |
| **Achievement system đầy đủ** | 🟡 Trung bình | 30 achievements + progress tracking — defer V1 |
| **Future Self photo + avatar** | 🟢 Thấp | Bỏ photo upload MVP, chỉ text + emoji |
| **Command Palette (Cmd+K)** | 🟢 Thấp | Nice-to-have, V2 |

## 1.3 Rủi Ro Kỹ Thuật

| Rủi ro | Xác suất | Impact | Mitigation |
|--------|----------|--------|------------|
| **Prisma + Electron bundling** | 🔴 Cao | 🔴 Cao | Dùng `electron-rebuild` + binary targets config từ đầu. Test ngay sprint 1. |
| **SQLite path trong production** | 🟡 Trung bình | 🔴 Cao | Dùng `app.getPath('userData')` — test packaged build sớm |
| **IPC type safety drift** | 🟡 Trung bình | 🟡 Trung bình | Shared types package + zod validation ở IPC boundary |
| **Framer Motion performance** | 🟢 Thấp | 🟡 Trung bình | Lazy load animations, `AnimatePresence` chỉ cho key transitions |
| **TanStack Query + IPC** | 🟢 Thấp | 🟡 Trung bình | Pattern đã proven — nhưng cần custom `queryFn` wrapper |
| **Streak calculation accuracy** | 🟡 Trung bình | 🔴 Cao | Dùng `date-fns` — không dùng Date math thuần. Timezone edge cases. |
| **Scope creep giết solo project** | 🔴 Cao | 🔴 Cao | Feature flags + hard cutoff — xem Phần 9 |

## 1.4 Features Quá Phức Tạp → Hoãn

| Feature | Tại sao hoãn |
|---------|-------------|
| Notion-style journal blocks | ProseMirror/Tiptap setup = 1 sprint riêng |
| AI local prediction | Cần 3+ tháng data, ML model setup = overkill |
| Trigger pattern aggregation (background job) | Job scheduling trong Electron phức tạp |
| SQLite encryption (SQLCipher) | Cần rebuild native binaries, painful |
| Biometric lock | Platform-specific API, low ROI MVP |
| Letter to Future Self (send later) | Cron job + notification complexity |
| Character XP animation system | Framer Motion complexity + DB overhead |
| Export PDF | puppeteer/jspdf integration = full sprint |
| Command palette | Nice UX but not MVP-critical |
| Sleep tracking | Nice-to-have, separate data collection habit |

---

# PHẦN 2 — MVP DEFINITION

## Tiêu chí MVP
> MVP = Người dùng có thể: **track recovery streak** + **check in habits** + **sử dụng Emergency Mode** + **cảm thấy không bị phán xét khi relapse**. Không hơn.

## Must Have (MVP — Sprint 1-4)

| # | Feature | Lý do |
|---|---------|-------|
| M1 | **Sobriety counter** (days + hours) | #1 reason người dùng tải app |
| M2 | **Habit tracking** (binary, ≤ 10 habits) | Core daily loop |
| M3 | **Daily check-in** (morning mood + evening reflection) | Engagement + data |
| M4 | **Emergency Mode** (full-screen + urge timer) | Killer feature — saves users |
| M5 | **Relapse logging** (non-judgmental flow) | Breaks shame spiral |
| M6 | **Recovery milestones** (1/3/7/14/30 days) | Motivation |
| M7 | **Future Self** (name + statement, text only) | Identity anchor |
| M8 | **Streak calendar** (GitHub heatmap, 365 days) | Visual motivation |
| M9 | **App PIN lock** (bcrypt hash) | Privacy — non-negotiable |
| M10 | **Local SQLite storage** | Privacy — non-negotiable |
| M11 | **Dark theme** | Core aesthetic |
| M12 | **Sidebar navigation** | App shell |

## Should Have (V1 — Sprint 5-8)

| # | Feature | Lý do |
|---|---------|-------|
| S1 | Identity statements (text list) | Reinforcement |
| S2 | Trigger logging (manual) | Pattern awareness |
| S3 | Habit stacking (link habits) | Atomic Habits method |
| S4 | Week view analytics | Basic insights |
| S5 | Notification reminders | Engagement |
| S6 | Habit categories | Organization |
| S7 | Win journal (simple text) | Gratitude + positive reinforcement |
| S8 | Mood analytics (week trend) | Pattern recognition |
| S9 | Onboarding flow (first-run) | Retention |
| S10 | Settings panel | Customization |

## Nice To Have (V2)

| # | Feature |
|---|---------|
| N1 | Life Score (composite) |
| N2 | Focus sessions (Pomodoro) |
| N3 | Sleep tracking |
| N4 | Achievement badges |
| N5 | Trigger pattern analytics (aggregated) |
| N6 | Rich journal (markdown at minimum) |
| N7 | Weekly summary auto-generated |
| N8 | Habit count/duration types |
| N9 | Command palette |
| N10 | Backup/restore |

## Future (V3+)

| # | Feature |
|---|---------|
| F1 | Local AI insight |
| F2 | Letter to Future Self |
| F3 | PDF export |
| F4 | Biometric lock |
| F5 | SQLite encryption |
| F6 | System tray widget |

---

# PHẦN 3 — DEVELOPMENT ROADMAP

## Milestone Overview

```
M1: Foundation     (Week 1-2)   → Project runs, DB connects, IPC works
M2: Database       (Week 2)     → All MVP models migrated + seeded
M3: App Shell      (Week 3)     → Sidebar + routing + theme running
M4: Recovery Core  (Week 3-4)   → Sobriety counter + relapse + milestones
M5: Habits         (Week 4-5)   → Habit CRUD + check-in + streak
M6: Emergency      (Week 5)     → Emergency Mode + urge timer
M7: Journal+Mood   (Week 6)     → Daily check-in + mood log
M8: Identity       (Week 6-7)   → Future Self + statements
M9: Dashboard      (Week 7)     → Unified daily command center
M10: PIN Lock      (Week 7-8)   → Security layer
M11: Polish        (Week 8)     → Animations + empty states + error states
M12: Ship MVP      (Week 8)     → Package + test + release
```

---

### Milestone 1: Project Foundation
**Duration:** 3-4 days  
**Goal:** Electron-Vite app chạy được với IPC bridge hoạt động.

**Deliverables:**
- [ ] electron-vite project initialized
- [ ] TypeScript configured (main + renderer + shared)
- [ ] Tailwind CSS + ShadcnUI initialized
- [ ] Preload script + contextBridge working
- [ ] Basic IPC ping/pong test passing
- [ ] Hot reload working in dev
- [ ] Custom window (frameless) with drag region

**Dependencies:** None  
**Effort:** 3-4 days  
**Definition of Done:** `npm run dev` → app opens, custom window, IPC ping returns "pong"

---

### Milestone 2: Database Layer
**Duration:** 2-3 days  
**Goal:** Prisma + SQLite connected, all MVP models migrated.

**Deliverables:**
- [ ] Prisma client configured with correct SQLite path (`userData`)
- [ ] Migration 0001 applied (all MVP models)
- [ ] Seed script creates default Settings + IdentityProfile
- [ ] PrismaClient singleton in main process
- [ ] Database path resolves correctly in both dev and packaged build
- [ ] Basic CRUD test for Habit model

**Dependencies:** M1  
**Effort:** 2-3 days  
**Definition of Done:** `prisma migrate dev` runs clean, CRUD operations work, DB file appears in `userData`

---

### Milestone 3: App Shell
**Duration:** 3-4 days  
**Goal:** Full navigation shell running — sidebar, routing, theme.

**Deliverables:**
- [ ] React Router setup with all 7 routes
- [ ] Sidebar component (full + collapsed states)
- [ ] Custom TitleBar (frameless window controls)
- [ ] AppShell layout (sidebar + content)
- [ ] Dark theme design tokens applied
- [ ] Page stubs for all routes (placeholder content)
- [ ] Keyboard shortcuts: Cmd+1-7, Cmd+\
- [ ] Emergency button placeholder in sidebar

**Dependencies:** M1  
**Effort:** 3-4 days  
**Definition of Done:** Navigate all 7 pages via sidebar + keyboard, sidebar collapses, dark theme consistent

---

### Milestone 4: Recovery Core
**Duration:** 4-5 days  
**Goal:** Sobriety counter + relapse flow + milestones working end-to-end.

**Deliverables:**
- [ ] RecoveryService (getStreak, logRelapse, startSession)
- [ ] IPC: recovery:getActiveSession, recovery:getStreakDays, recovery:logRelapse
- [ ] SobrietyCounter component (days + hours, live updating)
- [ ] Milestone detection + display
- [ ] RelapseModal (non-judgmental, 3-step flow)
- [ ] Recovery page (timeline + milestones list)
- [ ] Relapse history list
- [ ] Streak updates correctly after relapse

**Dependencies:** M2, M3  
**Effort:** 4-5 days  
**Definition of Done:** Log relapse → counter resets → new session starts → can reach milestone → milestone shown

---

### Milestone 5: Habit Tracking
**Duration:** 5-6 days  
**Goal:** Full habit CRUD + daily check-in + streak tracking.

**Deliverables:**
- [ ] HabitService (create, update, delete, checkIn, getStreak)
- [ ] IPC: habit:getAll, habit:create, habit:checkIn, habit:delete, habit:getStreak
- [ ] Habit list page (grouped by category)
- [ ] HabitCard component (name + icon + streak + today status)
- [ ] Check-in animation (circle → checkmark)
- [ ] Habit create/edit modal (basic: name, icon, category, frequency)
- [ ] Streak calendar (heatmap, monthly view)
- [ ] HabitStreak table updated on each check-in
- [ ] Two-day rule visual warning

**Dependencies:** M2, M3  
**Effort:** 5-6 days  
**Definition of Done:** Create habit → check in → streak increments → streak calendar shows correct data → relapse doesn't affect habits

---

### Milestone 6: Emergency Mode
**Duration:** 2-3 days  
**Goal:** Emergency Mode fully functional — full-screen, timer, distraction toolkit.

**Deliverables:**
- [ ] EmergencyMode overlay (full-screen, z-top)
- [ ] Urge timer (10/15/20 min countdown)
- [ ] Distraction list (default 5 items, from Settings)
- [ ] Future Self prompt (shows identity statement)
- [ ] "I made it" → logs UrgeLog(RESISTED) → dismiss
- [ ] "Log what happened" → opens RelapseModal
- [ ] Cmd+E global keyboard trigger
- [ ] Emergency button in sidebar (always visible)
- [ ] Cannot dismiss with Escape (requires intentional action)

**Dependencies:** M3, M4  
**Effort:** 2-3 days  
**Definition of Done:** Cmd+E → overlay opens → timer runs → both exit paths work → UrgeLog created

---

### Milestone 7: Journal + Mood
**Duration:** 4-5 days  
**Goal:** Daily check-in (morning/evening) + simple mood log.

**Deliverables:**
- [ ] JournalService (save, getByDate)
- [ ] MoodService (log, getByDate)
- [ ] IPC: journal:save, journal:getByDate, mood:log, mood:getByDate
- [ ] Journal page (morning section + evening section + free write textarea)
- [ ] Mood picker (5 emoji states + energy slider)
- [ ] Auto-save (30s debounce)
- [ ] Date navigation (previous entries)
- [ ] Journal dashboard card (shows today's intention)
- [ ] Mood dashboard card (quick log + shows morning mood)

**Dependencies:** M2, M3  
**Effort:** 4-5 days  
**Definition of Done:** Write morning intention → shows on dashboard → log mood → see in dashboard card → navigate to yesterday

---

### Milestone 8: Identity (Future Self)
**Duration:** 3-4 days  
**Goal:** Future Self profile + identity statements.

**Deliverables:**
- [ ] IdentityService (getProfile, updateProfile, getStatements, addStatement)
- [ ] IPC: identity:getProfile, identity:update, identity:addStatement
- [ ] FutureSelf profile card (name + vision text + core traits)
- [ ] Edit Future Self modal
- [ ] Identity Statements list (add/remove/reorder)
- [ ] Daily Affirmation display (random rotation from statements)
- [ ] "Identity vote" toast on habit completion ("+1 vote for [identity]")
- [ ] Identity page layout

**Dependencies:** M2, M3, M5  
**Effort:** 3-4 days  
**Definition of Done:** Create Future Self → add statements → affirmation shows on Identity page → completing habit shows vote toast

---

### Milestone 9: Dashboard
**Duration:** 3-4 days  
**Goal:** Unified daily command center combining all features.

**Deliverables:**
- [ ] Dashboard page layout (hero + grid)
- [ ] SobrietyCounter hero card (with milestone hint)
- [ ] TodayHabits list card (quick check-in)
- [ ] MoodQuickLog card (inline mood log)
- [ ] IntentionCard (shows morning journal intention)
- [ ] Dashboard data loading (parallel queries for all cards)
- [ ] Greeting (time-aware: Good morning/afternoon/evening)
- [ ] Empty states for each card

**Dependencies:** M4, M5, M7, M8  
**Effort:** 3-4 days  
**Definition of Done:** Dashboard shows all data, quick habit check-in works from dashboard, mood log works inline

---

### Milestone 10: Security (PIN Lock)
**Duration:** 2 days  
**Goal:** PIN lock screen, secure hash storage.

**Deliverables:**
- [ ] LockScreen component (PIN input, 4-6 digits)
- [ ] PIN hash with bcrypt (electron main process)
- [ ] Auto-lock on app minimize/hide
- [ ] Unlock flow → navigate to last route
- [ ] Settings: enable/disable PIN, change PIN
- [ ] No PIN = direct app open (optional security)

**Dependencies:** M3, Settings  
**Effort:** 2 days  
**Definition of Done:** Set PIN → lock app → enter PIN → unlock → wrong PIN shows error

---

### Milestone 11: Polish
**Duration:** 3-4 days  
**Goal:** Animations, empty states, error states, UX refinements.

**Deliverables:**
- [ ] Habit check-in animation (Framer Motion)
- [ ] Milestone celebration overlay
- [ ] All empty states (dashboard, habits, journal, recovery)
- [ ] Error states (DB error, validation error)
- [ ] Toast notifications (habit complete, milestone, XP)
- [ ] Sidebar collapse animation
- [ ] Page transition (fade)
- [ ] Loading skeletons for data fetching
- [ ] Keyboard shortcut help modal

**Dependencies:** All previous  
**Effort:** 3-4 days  
**Definition of Done:** No blank screens, no jarring transitions, milestone triggers celebration

---

### Milestone 12: Ship MVP
**Duration:** 2 days  
**Goal:** Package, test, release.

**Deliverables:**
- [ ] electron-builder config (Windows + macOS)
- [ ] App icon (all sizes)
- [ ] Production build test (DB path, Prisma binary)
- [ ] README.md
- [ ] First release (local .exe / .dmg)

**Dependencies:** All  
**Effort:** 2 days  
**Definition of Done:** Packaged app installs and runs correctly on clean machine

---

# PHẦN 4 — FEATURE TASK BREAKDOWN

## Feature: Sobriety Counter

**Task 1.1 — RecoverySession model + migration**
- Description: Apply Prisma migration for RecoverySession + RelapseEvent models
- Input: Prisma schema
- Output: SQLite tables created, types generated
- Dependencies: Prisma setup
- AC: `prisma migrate dev` runs clean, `prisma.recoverySession.create()` works

**Task 1.2 — RecoveryService: core methods**
- Description: Implement `getActiveSession()`, `getStreakDays()`, `startNewSession()`
- Input: PrismaClient
- Output: Service class with 3 methods
- Dependencies: Task 1.1
- AC: getStreakDays returns correct days from startedAt to now, new session created on app first run

**Task 1.3 — IPC handler: recovery**
- Description: Register `recovery:getActiveSession`, `recovery:getStreakDays`
- Input: RecoveryService
- Output: IPC channels registered
- Dependencies: Task 1.2, IPC infrastructure
- AC: `window.api.recovery.getStreakDays()` returns number from renderer

**Task 1.4 — SobrietyCounter component**
- Description: Display days + hours counter, auto-refresh every minute
- Input: streakDays number from TanStack Query
- Output: Styled counter card
- Dependencies: Task 1.3
- AC: Shows "42 days, 6 hours", updates every 60s, milestone hint shows

**Task 1.5 — Milestone detection**
- Description: After each day tick or session start, check if milestone reached. Create Milestone record, show celebration.
- Input: streakDays, Milestone thresholds [1,3,7,14,30,60,90]
- Output: Milestone record + celebration toast
- Dependencies: Task 1.2
- AC: On day 7, milestone created, toast shows "7 Days — Một Tuần Bản Lĩnh"

**Task 1.6 — RelapseModal component**
- Description: 3-step non-judgmental modal: acknowledge → trigger select → recovery note
- Input: user submits relapse
- Output: RelapseEvent logged, session reset, new session started
- Dependencies: Task 1.2, Task 1.3
- AC: Submit relapse → counter resets to 0 → new session active → no "failure" language in UI

---

## Feature: Habit Tracking

**Task 2.1 — Habit + HabitLog + HabitStreak migrations**
- Description: Apply Prisma migration for 3 habit models
- Input: Schema
- Output: Tables created
- AC: All 3 tables exist, foreign keys correct

**Task 2.2 — HabitService: CRUD**
- Description: `createHabit()`, `updateHabit()`, `deleteHabit()`, `getAllHabits()`
- Input: CreateHabitDto (Zod-validated)
- Output: Habit objects
- AC: CRUD operations persist correctly, archived habits excluded from getAll

**Task 2.3 — HabitService: checkIn + streak logic**
- Description: `checkIn(habitId, date)` → creates HabitLog, updates HabitStreak
- Input: habitId, dateString "YYYY-MM-DD"
- Output: Updated HabitStreak
- Dependencies: Task 2.2
- AC: checkIn same date is idempotent, streak increments on consecutive days, resets on gap > 1 day

**Task 2.4 — IPC: habit channels**
- Description: Register habit:getAll, habit:create, habit:update, habit:delete, habit:checkIn
- Input: HabitService
- Output: 5 IPC channels
- AC: All 5 channels callable from renderer, Zod validation rejects bad input

**Task 2.5 — HabitCard component**
- Description: Card showing icon + name + streak counter + today checkbox
- Input: Habit + HabitLog for today
- Output: Interactive card component
- AC: Check-in animation plays, streak shows correctly, completed state persists on refresh

**Task 2.6 — HabitList page**
- Description: Group habits by category, show section headers
- Input: All habits from TanStack Query
- Output: Grouped list
- AC: Default categories show, empty category hidden, sort order respected

**Task 2.7 — HabitForm modal**
- Description: Create/edit habit (name, icon, color, category, frequency, time)
- Input: Form submission
- Output: New/updated Habit in DB
- AC: Required fields validated, icon picker shows 20 options, form resets on close

**Task 2.8 — Streak calendar component**
- Description: GitHub-style heatmap for a single habit, last 12 months
- Input: habitId, HabitLog array
- Output: Visual calendar grid
- AC: Completed days filled, empty days outlined, today highlighted, months labeled

---

## Feature: Emergency Mode

**Task 3.1 — EmergencyMode overlay component**
- Description: Full-screen dark overlay, z-top, blocks all app interaction
- Input: isEmergencyMode boolean from Zustand
- Output: Overlay component
- AC: Opens instantly (< 100ms), cannot be dismissed with Escape key alone

**Task 3.2 — Urge timer**
- Description: Countdown timer (10/15/20 min selector), visual countdown display
- Input: selected minutes
- Output: Timer state, countdown display
- AC: Counts down correctly, plays completion sound/visual at 0

**Task 3.3 — Distraction toolkit**
- Description: List of 5 default distraction actions (configurable in settings)
- Input: distractionList from Settings
- Output: Clickable action buttons
- AC: Default list shows, clicking action records in UrgeLog.strategyUsed

**Task 3.4 — Emergency exit flows**
- Description: "I made it" → UrgeLog(RESISTED) + dismiss. "What happened" → open RelapseModal
- Input: User action
- Output: UrgeLog created OR RelapseModal opened
- AC: Both paths create correct records, overlay closes correctly

**Task 3.5 — Emergency keyboard trigger**
- Description: Cmd+E / Ctrl+E global shortcut from anywhere in app
- Input: Keyboard event
- Output: Emergency mode activates
- AC: Works from any page, including locked state

---

## Feature: Journal + Mood

**Task 4.1 — JournalEntry model + migration**
- AC: Table created with unique date constraint

**Task 4.2 — JournalService: save + getByDate**
- Input: SaveJournalEntryDto (Zod)
- Output: JournalEntry
- AC: Upsert by date (update if exists, create if not), word count calculated

**Task 4.3 — Journal page layout**
- Description: Morning section + free write textarea + evening section
- AC: Each section auto-saves on blur, draft badge shows when unsaved

**Task 4.4 — MoodLog model + MoodService**
- AC: Log mood for date+period, upsert (can update same period)

**Task 4.5 — Mood picker component**
- Description: 5 emoji states + energy 1-5 slider
- Input: onClick
- Output: MoodLog created
- AC: One tap to log mood, selected state visually highlighted

---

## Feature: Future Self / Identity

**Task 5.1 — IdentityProfile + FutureSelf models + migration**
- AC: Tables created, default profile seeded

**Task 5.2 — IdentityService + IPC**
- Methods: getProfile, updateProfile, getStatements, addStatement, removeStatement
- AC: All methods work, default profile exists on first run

**Task 5.3 — FutureSelf profile card + edit modal**
- Input: IdentityProfile
- Output: Display card + edit form
- AC: Edit saves correctly, identity name shows in Emergency Mode

**Task 5.4 — Identity statements list**
- Description: CRUD list of affirmation statements
- AC: Add/remove/reorder, max 10 statements

**Task 5.5 — Daily affirmation display**
- Description: Random statement from list, rotate daily
- AC: Shows different statement each day, graceful if no statements

---

# PHẦN 5 — IMPLEMENTATION ORDER

```
LAYER 0: Tooling & Config
└── electron-vite + tsconfig + tailwind + shadcn
    WHY: Everything builds on this. Get it right once.

LAYER 1: IPC Infrastructure
└── preload.ts + contextBridge + shared types
    WHY: The most Electron-specific + risky layer. Validate early.

LAYER 2: Database
└── Prisma schema + migrations + PrismaClient singleton
    WHY: All services depend on this. Schema changes are painful later.

LAYER 3: App Shell
└── Router + Sidebar + TitleBar + theme
    WHY: Developer needs to SEE the app to stay motivated. Ship UI fast.

LAYER 4: Core Services (Main Process)
└── RecoveryService → HabitService → JournalService → IdentityService
    WHY: Services in dependency order. Recovery is the most critical.

LAYER 5: IPC Channels
└── Per-feature: register handlers after service is ready
    WHY: Wire one feature at a time, test as you go.

LAYER 6: TanStack Query + Zustand Setup
└── queryClient setup + store definitions
    WHY: Renderer state management foundation before building feature UIs.

LAYER 7: Feature UIs (bottom-up)
└── Recovery → Habits → Emergency → Journal/Mood → Identity → Dashboard
    WHY: Recovery first (it's the hero feature + simplest). Dashboard last (aggregates all).

LAYER 8: Security
└── PIN lock screen + bcrypt
    WHY: Feature-complete before security hardening.

LAYER 9: Polish
└── Animations + empty states + error handling
    WHY: Polish after functionality proven. Don't animate broken code.

LAYER 10: Packaging
└── electron-builder + icons + production test
    WHY: Last step. Production quirks (DB path, binary) revealed here.
```

---

# PHẦN 6 — FOLDER & MODULE PLAN

## Module: `electron/services/recovery`
**Responsibility:** Recovery session lifecycle, relapse tracking, milestone detection  
**Public API:**
```typescript
class RecoveryService {
  getActiveSession(): Promise<RecoverySession | null>
  getStreakDays(): Promise<number>
  logRelapse(dto: LogRelapseDto): Promise<void>
  checkMilestones(days: number): Promise<Milestone | null>
  getRelapseHistory(limit?: number): Promise<RelapseEvent[]>
  getUrgeStats(): Promise<UrgeStats>
}
```
**Internal:** Uses `prisma` directly (no repository abstraction for MVP)  
**Shared Deps:** `shared/types/recovery.types.ts`, `shared/dtos/recovery.dto.ts`

---

## Module: `electron/services/habit`
**Responsibility:** Habit CRUD, daily check-in, streak calculation  
**Public API:**
```typescript
class HabitService {
  getAllHabits(): Promise<HabitWithStreak[]>
  createHabit(dto: CreateHabitDto): Promise<Habit>
  updateHabit(id: string, dto: UpdateHabitDto): Promise<Habit>
  deleteHabit(id: string): Promise<void>
  checkIn(id: string, date: string): Promise<HabitStreak>
  getHabitLogs(id: string, year: number): Promise<HabitLog[]>
  getTodayStatus(): Promise<TodayHabitStatus[]>
}
```

---

## Module: `src/features/recovery`
**Responsibility:** Recovery UI — counter, milestones, relapse flow  
**Public API (exports):**
```typescript
export { SobrietyCounter }    // Hero counter component
export { MilestoneList }      // Milestone display
export { RelapseModal }       // Non-judgmental log
export { useRecovery }        // Main hook
export { recoveryStore }      // Zustand slice
```
**Internal:** RecoveryPage, RelapseHistoryList  
**Queries:** `recovery.queries.ts` (TanStack Query definitions)

---

## Module: `src/features/habits`
**Public API:**
```typescript
export { HabitCard }          // Single habit display
export { HabitList }          // Grouped list
export { HabitForm }          // Create/edit modal
export { StreakCalendar }     // Heatmap component
export { useHabits }          // Main hook
export { useCheckIn }         // Mutation hook
```

---

## Module: `src/features/emergency`
**Public API:**
```typescript
export { EmergencyMode }      // Full-screen overlay
export { EmergencyButton }    // Sidebar button (always visible)
export { useEmergency }       // Controls overlay state
```
**Note:** EmergencyMode is globally mounted in App.tsx, controlled via `emergencyStore`

---

## Module: `src/features/identity`
**Public API:**
```typescript
export { FutureSelfCard }
export { IdentityStatements }
export { DailyAffirmation }
export { useIdentity }
```

---

## Module: `src/features/journal`
**Public API:**
```typescript
export { JournalEntry }       // Full journal editor
export { MorningSection }     // Intention + gratitude
export { EveningSection }     // Reflection + wins
export { MoodPicker }         // 5-state mood log
export { useJournal }
export { useMood }
```

---

## Module: `shared/`
**Content:**
```
shared/
  types/
    recovery.types.ts    RecoverySession, RelapseEvent, Milestone, UrgeLog
    habit.types.ts       Habit, HabitLog, HabitStreak
    journal.types.ts     JournalEntry, MoodLog
    identity.types.ts    IdentityProfile, FutureSelf, IdentityStatement
    ipc.types.ts         Full IpcChannels interface
  dtos/
    recovery.dto.ts      LogRelapseDto, LogUrgeDto
    habit.dto.ts         CreateHabitDto, UpdateHabitDto
    journal.dto.ts       SaveJournalEntryDto, LogMoodDto
    identity.dto.ts      UpdateProfileDto, AddStatementDto
  enums/
    index.ts             HabitType, HabitFrequency, TriggerType, MoodPeriod
  errors/
    AppError.ts          Base error class
```

---

# PHẦN 7 — SPRINT PLANNING

## Sprint 1 (Week 1-2): Foundation + Database + Shell
**Duration:** 10 days  
**Goal:** App boots, DB works, navigation works

**Tasks:**
- [ ] electron-vite project init
- [ ] TypeScript paths configured (main/renderer/shared)
- [ ] Tailwind + ShadcnUI init
- [ ] Preload + contextBridge + ping test
- [ ] Custom frameless window + titlebar
- [ ] Prisma setup + MVP migration (all models)
- [ ] DB path fix for userData
- [ ] Seed: Settings + IdentityProfile
- [ ] React Router setup
- [ ] Sidebar component (full + collapsed)
- [ ] Dark theme tokens
- [ ] Page stubs × 7

**Deliverable:** `npm run dev` → navigable app, `npm run build` → packaged app, DB connected  
**Risks:** Prisma binary bundling (HIGH — test packaged build this sprint!)  
**Estimated:** 10 days

---

## Sprint 2 (Week 3-4): Recovery + Habits Core
**Duration:** 10 days  
**Goal:** Core loop working end-to-end

**Tasks:**
- [ ] RecoveryService + IPC channels
- [ ] SobrietyCounter component
- [ ] Milestone detection + toast
- [ ] RelapseModal (full flow)
- [ ] Recovery page layout
- [ ] HabitService + IPC channels
- [ ] HabitCard + check-in animation
- [ ] HabitList page (grouped)
- [ ] HabitForm modal (create/edit)
- [ ] Streak calendar (heatmap)
- [ ] HabitStreak update logic
- [ ] TanStack Query setup for habits + recovery

**Deliverable:** Full recovery counter + habit check-in + relapse logging working  
**Risks:** Streak calculation timezone bugs  
**Estimated:** 10 days

---

## Sprint 3 (Week 5-6): Emergency + Journal + Mood + Identity
**Duration:** 10 days  
**Goal:** All secondary features working

**Tasks:**
- [ ] EmergencyMode overlay
- [ ] Urge timer (3 durations)
- [ ] Distraction toolkit
- [ ] Emergency exit flows + UrgeLog
- [ ] Cmd+E global shortcut
- [ ] JournalService + IPC
- [ ] Journal page (morning + evening + free write)
- [ ] Auto-save + draft state
- [ ] MoodService + MoodPicker component
- [ ] IdentityService + IPC
- [ ] FutureSelf card + edit modal
- [ ] Identity statements CRUD
- [ ] Daily affirmation rotation

**Deliverable:** Emergency Mode works, journal saves, mood logs, identity profile set up  
**Risks:** Emergency Mode UX — test thoroughly  
**Estimated:** 10 days

---

## Sprint 4 (Week 7-8): Dashboard + Security + Polish + Ship
**Duration:** 10 days  
**Goal:** MVP shippable

**Tasks:**
- [ ] Dashboard page (all cards integrated)
- [ ] Dashboard parallel data loading
- [ ] Greeting + time-awareness
- [ ] PIN lock screen
- [ ] bcrypt PIN hash in main process
- [ ] Auto-lock on minimize
- [ ] Settings page (security + appearance + notifications)
- [ ] All empty states
- [ ] All error states
- [ ] Loading skeletons
- [ ] Milestone celebration overlay (Framer Motion)
- [ ] Identity vote toast
- [ ] electron-builder config
- [ ] App icons (all sizes)
- [ ] Production build test
- [ ] Final QA pass

**Deliverable:** Shippable MVP .exe/.dmg  
**Risks:** Production bundling issues, DB path in production  
**Estimated:** 10 days

---

# PHẦN 8 — CODE GENERATION PLAN

> **Sử dụng danh sách này theo thứ tự.** Mỗi prompt là một conversation riêng với AI. Copy context từ prompt trước khi cần.

---

### BLOCK 0: Setup

**Prompt #1 — electron-vite init**
```
Setup Electron-Vite project for Atomic Recovery desktop app.
Tech: Electron + Vite + React + TypeScript.
Requirements:
- Use electron-vite template with React + TypeScript
- Configure tsconfig for 3 environments: main, preload, renderer
- Add path aliases: @main, @renderer, @shared, @
- Add .env.development with DATABASE_URL
- Verify hot reload works
Output: Working project structure + package.json scripts
```

**Prompt #2 — Tailwind + ShadcnUI**
```
Configure Tailwind CSS and ShadcnUI for Atomic Recovery Electron-Vite app.
Requirements:
- Tailwind v4 + autoprefixer
- ShadcnUI init (New York style, no CSS variables conflict)
- Custom design tokens: colors (deep space palette), spacing, typography
- Dark mode as default (class strategy)
- Add Inter font from Google Fonts
- Verify: Button, Card, Dialog, Input, Badge components render
```

**Prompt #3 — Custom Window + TitleBar**
```
Create frameless Electron window with custom TitleBar for Atomic Recovery.
Requirements:
- BrowserWindow: frame: false, titleBarStyle: 'hidden'
- Custom TitleBar component: drag region + min/max/close buttons
- Window controls: Windows style (right side)
- Security: contextIsolation: true, nodeIntegration: false, sandbox: true
- Background color: #0A0A0F (matches dark theme)
```

**Prompt #4 — IPC Infrastructure**
```
Build type-safe IPC infrastructure for Atomic Recovery Electron app.
Requirements:
- preload.ts using contextBridge
- shared/types/ipc.types.ts defining full IpcChannels interface
- IPC channels for: habit, recovery, journal, identity, settings, urge
- Test channel: ping → pong
- Renderer: window.api typed via Window interface augmentation
- Validate: window.api.ping() returns 'pong' in renderer
```

---

### BLOCK 1: Database

**Prompt #5 — Prisma Setup**
```
Setup Prisma ORM with SQLite for Atomic Recovery Electron app.
Requirements:
- prisma/schema.prisma with SQLite datasource
- DATABASE_URL points to app.getPath('userData')/atomic-recovery.db in production
- DATABASE_URL = file:./dev.db in development
- Binary targets: native + windows + darwin
- PrismaClient singleton in electron/database/prisma.client.ts
- Handles both dev and production path correctly
```

**Prompt #6 — Database Migration 0001**
```
Create Prisma Migration 0001 for Atomic Recovery MVP models.
Models to create: Settings, IdentityProfile, RecoverySession, RelapseEvent, 
UrgeLog, Habit, HabitLog, HabitStreak, JournalEntry, MoodLog, Milestone
[Include full schema from DATABASE.md]
Requirements:
- All models with correct field types for SQLite
- Indexes on frequently queried fields
- Run: prisma migrate dev --name init
```

**Prompt #7 — Database Seed**
```
Create Prisma seed script for Atomic Recovery.
Seed data:
- Settings singleton row (id: 'singleton', defaults)
- IdentityProfile default row
- No habits or recovery sessions (user creates these)
File: prisma/seed.ts
Add seed script to package.json
Verify: npx prisma db seed runs without errors
```

---

### BLOCK 2: App Shell

**Prompt #8 — React Router Setup**
```
Setup React Router v6 for Atomic Recovery Electron app.
Routes:
  / → DashboardPage
  /recovery → RecoveryPage
  /habits → HabitsPage
  /identity → IdentityPage
  /journal → JournalPage
  /analytics → AnalyticsPage (stub)
  /settings → SettingsPage
Requirements:
- All pages as lazy imports
- 404 redirect to /
- HashRouter (works with Electron file:// protocol)
```

**Prompt #9 — Sidebar Component**
```
Build Sidebar navigation component for Atomic Recovery.
Design: Arc Browser + Linear style (see UX-DESIGN.md)
Requirements:
- 240px full width, 56px collapsed (icon only)
- 7 nav items with Lucide icons + labels
- Active state: accent bg + left border 3px
- Hover: surface-raised transition 150ms
- Emergency button: always visible, bottom section, subtle pulse
- Collapse: Cmd+\ toggle
- Keyboard: Cmd+1 through Cmd+7
- UserProfile section: avatar (initials) + name + level
Colors from design system: #0A0A0F bg, #6366F1 accent
```

**Prompt #10 — AppShell + Layout**
```
Build AppShell layout for Atomic Recovery.
Components: TitleBar + Sidebar + MainContent area
Requirements:
- Frameless window with custom TitleBar (drag region)
- Sidebar left (fixed width), MainContent flex-1
- AppShell wraps React Router Outlet
- Global providers: QueryClientProvider, Toaster
- EmergencyMode mounted globally (always present in DOM)
- Theme: dark class on html element
```

---

### BLOCK 3: Recovery Feature

**Prompt #11 — RecoveryService**
```
Implement RecoveryService for Atomic Recovery main process.
File: electron/services/recovery.service.ts
Methods:
- getActiveSession(): RecoverySession | null
- getStreakDays(): number (days + fractional for hours display)
- getStreakDisplay(): { days: number, hours: number }
- startNewSession(): RecoverySession
- logRelapse(dto: LogRelapseDto): void (closes session, creates event, starts new)
- checkMilestones(days: number): Milestone | null
- getRelapseHistory(limit: number): RelapseEvent[]
- logUrge(dto: LogUrgeDto): UrgeLog
Uses Prisma directly (no repository abstraction)
Use date-fns for all date calculations
```

**Prompt #12 — Recovery IPC Handlers**
```
Register IPC handlers for Recovery feature in Atomic Recovery.
File: electron/ipc/recovery.handler.ts
Channels:
- recovery:getStreakDisplay → { days, hours }
- recovery:getActiveSession → RecoverySession | null
- recovery:logRelapse → void (Zod validate LogRelapseDto)
- recovery:checkMilestones → Milestone | null
- recovery:getRelapseHistory → RelapseEvent[]
- recovery:logUrge → UrgeLog
Register in electron/ipc/index.ts
```

**Prompt #13 — SobrietyCounter Component**
```
Build SobrietyCounter hero card component for Atomic Recovery Dashboard.
Design from UX-DESIGN.md wireframe.
Requirements:
- Display: "42 days, 6 hours" in JetBrains Mono font
- Sub-label: identity name ("Người Đàn Ông Kỷ Luật")
- Progress bar toward next milestone (e.g. 42/50 days)
- Milestone hint: "50 days → 8 ngày nữa"
- Auto-refresh every 60 seconds (useInterval)
- Data via TanStack Query: window.api.recovery.getStreakDisplay()
- Violet accent color (#8B5CF6) for the counter
- Framer Motion: subtle number transition on refresh
```

**Prompt #14 — RelapseModal**
```
Build RelapseModal for Atomic Recovery.
UX principle: NON-JUDGMENTAL. No "failure" language.
Flow:
  Step 1: Acknowledge ("Tiếp tục hành trình" — 2 lines compassionate copy)
  Step 2: Optional trigger select (grid of TriggerType buttons)
  Step 3: Optional recovery note textarea + submit
Requirements:
- Modal dialog (ShadcnUI Dialog)
- "Skip — just reset" link (submits with no data)
- On submit: calls recovery:logRelapse IPC
- After submit: shows "New chapter begins" message 2s, then closes
- Invalidates recovery queries on close
```

**Prompt #15 — Milestone System**
```
Build milestone detection + celebration for Atomic Recovery.
Milestones: [1, 3, 7, 14, 30, 60, 90, 180, 365] days
Requirements:
- MilestoneService.checkMilestones(days) runs after each streak update
- Creates Milestone record if not already created for that day count
- MilestoneToast component: slides in from right, shows icon + name + XP
- MilestoneList component for Recovery page: shows all achieved milestones
- Uncelebrated milestones shown on Dashboard on first open
```

---

### BLOCK 4: Habits Feature

**Prompt #16 — HabitService**
```
Implement HabitService for Atomic Recovery.
Methods: getAllHabits, createHabit, updateHabit, deleteHabit (archive),
         checkIn(habitId, date), getHabitLogs(habitId, year), getTodayStatus()
Streak logic in checkIn:
- If last completed date = yesterday → currentStreak++
- If last completed date = today → no change (idempotent)
- Else → currentStreak = 1
- longestStreak = max(current, longest)
Use date-fns: isYesterday, isToday, parseISO, format
```

**Prompt #17 — Habit IPC Handlers**
```
Register IPC handlers for Habit feature.
Channels: habit:getAll, habit:create, habit:update, habit:delete,
          habit:checkIn, habit:getStreak, habit:getLogs, habit:getTodayStatus
Zod validation on create/update inputs.
```

**Prompt #18 — HabitCard Component**
```
Build HabitCard component for Atomic Recovery habit list.
Design from UX-DESIGN.md.
Props: habit (Habit + streak), todayLog (HabitLog | null), onCheckIn
Requirements:
- Left accent stripe 3px in habit.color
- Lucide icon (habit.icon) + name + category badge
- Streak counter: "42d 🔥" JetBrains Mono
- Checkbox right side: animated circle→checkmark (Framer Motion 300ms)
- Completed state: slight opacity on card, checkmark stays
- useMutation for checkIn, optimistic update
```

**Prompt #19 — HabitList Page**
```
Build HabitsPage for Atomic Recovery.
Layout from UX-DESIGN.md.
Requirements:
- Group habits by category (RECOVERY, MIND, BODY, etc.)
- Category section headers with count badge
- Empty category: hidden (don't show empty sections)
- Add Habit button: top right + per-category "+"
- HabitCard for each habit
- Click card → HabitDetailDrawer opens (slide from right)
- Sort by sortOrder within category
```

**Prompt #20 — HabitForm Modal**
```
Build HabitForm create/edit modal for Atomic Recovery.
Step 1: Name + Icon picker (20 Lucide icons) + Color picker (8 colors) + Category + Type + Frequency + Time
Requirements:
- ShadcnUI Dialog
- Zod + react-hook-form validation
- Icon picker: grid of 20 icons, click to select
- Frequency: Daily / Weekdays / Custom (days picker)
- On submit: calls habit:create or habit:update IPC
- Invalidate habit queries on success
```

**Prompt #21 — StreakCalendar Component**
```
Build GitHub-style streak heatmap calendar for Atomic Recovery.
Props: logs (HabitLog[]), year (number)
Requirements:
- 52 weeks × 7 days grid
- Filled square = completed, empty = not
- 4 shades based on completion (binary: filled/empty)
- Month labels at top
- Today highlighted with border
- Tooltip on hover: "Aug 16 — Completed"
- Last 365 days always visible, starting from today going back
- Responsive: scrollable horizontally on narrow windows
```

---

### BLOCK 5: Emergency Mode

**Prompt #22 — EmergencyMode Overlay**
```
Build EmergencyMode full-screen overlay for Atomic Recovery.
Design from UX-DESIGN.md wireframe.
Requirements:
- Full-screen fixed overlay, z-[9999], bg #080810 + noise texture
- Controlled by emergencyStore (Zustand)
- Cannot dismiss with Escape (requires intentional button)
- Header: "⚡ EMERGENCY MODE" + compassionate subtitle
- Future Self quote (from IdentityProfile.identityStatement)
- UrgeTimer section (see Prompt #23)
- Distraction buttons (see Prompt #24)
- Exit buttons: "I made it through" + "Log what happened"
- Framer Motion: fade in 200ms
```

**Prompt #23 — UrgeTimer Component**
```
Build UrgeTimer countdown for Emergency Mode.
Requirements:
- Duration selector: 10 / 15 / 20 minutes (pill buttons)
- Large countdown display: MM:SS in JetBrains Mono 64px
- "Surf it. Don't fight it." tagline below
- Circular progress ring around timer (optional: linear progress bar)
- Completion: visual pulse + "You made it past the urge" message
- State: timerActive, timeRemaining, selectedDuration
```

**Prompt #24 — Distraction Toolkit**
```
Build distraction action buttons for Emergency Mode.
Default actions: 📖 Read, 💧 Cold water, 🚶 Walk outside, ✍️ Write, 💪 Exercise
Requirements:
- Grid of action buttons (emoji + label)
- Clicking records action in UrgeLog.strategyUsed (but doesn't exit)
- User can add custom actions in Settings
- "What would Future You do?" prompt above buttons
```

**Prompt #25 — Emergency Global Trigger**
```
Wire Cmd+E global keyboard shortcut for Emergency Mode.
Requirements:
- Works from any page in the app
- Uses useEffect + keydown listener in App.tsx
- Calls emergencyStore.activate()
- EmergencyButton in Sidebar also calls emergencyStore.activate()
- Both exit flows (made it / relapsed) deactivate emergencyStore
```

---

### BLOCK 6: Journal + Mood + Identity

**Prompt #26 — JournalService + IPC**
```
Implement JournalService and IPC for Atomic Recovery.
Methods: saveEntry(dto), getByDate(date), getRecentDates(limit)
IPC: journal:save, journal:getByDate, journal:getRecentDates
Upsert by date (update existing or create new)
Calculate wordCount on save
```

**Prompt #27 — Journal Page**
```
Build JournalPage for Atomic Recovery.
Sections: Morning (intention + gratitude × 3) + Free Write (textarea) + Evening (reflection + wins)
Requirements:
- Auto-save on blur (debounced 1s)
- "Saved" flash indicator bottom-right
- Date navigation: ← Yesterday / Today / Tomorrow →
- Word count display
- Empty prompt text in textareas (not placeholder attr — use onClick focus)
- useMutation for save, useQuery for load by date
```

**Prompt #28 — MoodService + MoodPicker**
```
Implement MoodService + MoodPicker component.
Service: logMood(dto), getMoodByDate(date), getMoodHistory(days)
IPC: mood:log, mood:getByDate, mood:getHistory
MoodPicker component:
- 5 emoji faces (😫😕😐🙂😄) horizontal selector
- Energy: 5-dot selector
- Period auto-detected (morning/afternoon/evening/night) based on time
- Compact version for Dashboard card
- Full version for Journal page
```

**Prompt #29 — IdentityService + Future Self UI**
```
Implement IdentityService and Future Self UI components.
Service methods: getProfile, updateProfile, getStatements, addStatement, removeStatement, getRandomAffirmation
IPC: identity:getProfile, identity:updateProfile, identity:addStatement, identity:removeStatement, identity:getAffirmation

FutureSelfCard: shows photoPath (avatar initials fallback) + name + vision + traits
EditFutureSelfModal: form with name, vision text, traits input (tag input), target date
IdentityStatements: sortable list (drag or up/down arrows), add inline, delete with confirmation
DailyAffirmation: displays getRandomAffirmation(), Next → button
```

---

### BLOCK 7: Dashboard + Settings

**Prompt #30 — Dashboard Page**
```
Build DashboardPage for Atomic Recovery.
Layout from UX-DESIGN.md wireframe (hero + grid).
Components to compose:
- DashboardHeader: greeting (time-aware) + date
- SobrietyCounter (hero, flex-[2])
- LifeScoreCard STUB (show placeholder for MVP)
- TodayHabitsList: HabitCheckItem × n (from getTodayStatus)
- MoodQuickLog: compact MoodPicker
- IntentionCard: shows morningIntention from today's journal
All data loaded in parallel (Promise.all via TanStack Query)
Empty states for each section
```

**Prompt #31 — Settings Page**
```
Build SettingsPage for Atomic Recovery.
Layout: two-column (settings sidebar + content area) — Linear style
Sections:
  Security: PIN toggle, Set PIN button, Change PIN button
  Appearance: Theme (dark only MVP), Accent color (8 presets)
  Notifications: Master toggle, Morning time, Evening time
  Data: App version display, DB location display
Security section: renders first and is default selected
```

**Prompt #32 — PIN Lock Screen**
```
Build PIN lock system for Atomic Recovery.
Components: LockScreen (full-screen), PIN input (6 dots + number pad)
Flow:
  App starts → check Settings.pinEnabled → show LockScreen if true
  Enter PIN → bcrypt.compare in main process → unlock → navigate to /
  Wrong PIN → shake animation + error message
  3 wrong attempts → 30s lockout
IPC: security:verifyPin, security:setPin, security:changePin, security:disablePin
bcrypt operations ONLY in main process (never renderer)
```

---

### BLOCK 8: Polish + Ship

**Prompt #33 — Empty States**
```
Build empty state components for all Atomic Recovery screens.
Components:
- EmptyDashboard (first day zero state)
- EmptyHabits ("Start small. One habit changes everything.")
- EmptyJournal ("Your page is blank. That's okay.")
- EmptyRecoveryHistory (positive: "No relapse events. Keep going.")
- EmptyAnalytics ("Keep going for 7 days — insights emerge.")
Design: centered, muted icon, 2-line message, optional CTA button
Consistent with design system (no harsh colors for empty states)
```

**Prompt #34 — Loading Skeletons**
```
Build loading skeleton components for Atomic Recovery.
Use ShadcnUI Skeleton component.
Skeletons needed:
- HabitCardSkeleton (matches HabitCard dimensions)
- SobrietyCounterSkeleton (hero card)
- MoodCardSkeleton
- JournalEntrySkeletonl
- MilestoneListSkeleton
Show skeletons during TanStack Query isLoading state
```

**Prompt #35 — Toast + Milestone Celebration**
```
Build notification/toast system for Atomic Recovery.
Use ShadcnUI Sonner (toast).
Toast types:
- HabitComplete: "+1 vote for [identity name]" — green, 2s
- MilestoneCelebration: larger toast or modal — 1/3/7/14/30 day milestones
- RelapseAcknowledged: "New chapter begins" — calm, not alarming
- Error: red, dismissible

MilestoneCelebration: full overlay (Framer Motion) with:
- Large milestone icon + number
- Name + description
- XP awarded
- Confetti (tsparticles or simple CSS animation)
- Auto-dismiss 4s or click to dismiss
```

**Prompt #36 — Framer Motion Animations**
```
Add Framer Motion animations to Atomic Recovery.
Animations to implement:
1. HabitCheckIn: circle scale 1→1.2 + checkmark morph (300ms spring)
2. PageTransition: opacity 0→1 + y 4→0 (150ms ease)
3. SidebarCollapse: width 240→56 (200ms ease-in-out)
4. EmergencyModeOpen: opacity 0→1 (200ms ease-in)
5. MoodEmojiSelect: scale 1→1.3→1 (200ms spring)
6. StreakNumber: animate when increments
7. RelapseModal: slide up from bottom (250ms spring)
Use AnimatePresence for mount/unmount
Keep: reduced-motion media query respect
```

**Prompt #37 — electron-builder Config**
```
Configure electron-builder for Atomic Recovery production builds.
Requirements:
- Target: Windows (NSIS installer + portable), macOS (DMG)
- App ID: com.atomicrecovery.app
- Product name: Atomic Recovery
- Icon: resources/icon.png (1024×1024)
- Prisma: copy generated client to resources in afterPack hook
- SQLite binary: correct binary target for each platform
- Code signing: skip for initial release (self-signed)
- Output: dist/ folder
Verify: packaged app creates DB in correct userData path
```

**Prompt #38 — Production DB Path Fix**
```
Fix SQLite database path for Atomic Recovery production build.
Problem: DATABASE_URL in .env won't work in packaged Electron app.
Solution:
- In electron/main.ts: set DATABASE_URL env before PrismaClient instantiates
- Path: app.getPath('userData') + '/atomic-recovery.db'
- Dev: use ./dev.db (relative to project)
- Also fix Prisma migration path for packaged app
- Test: build → install → verify DB created in correct location → data persists
```

**Prompt #39 — Error Boundaries + Global Error Handling**
```
Add error handling to Atomic Recovery.
Requirements:
- React ErrorBoundary wrapping MainContent
- IPC error: catch in TanStack Query onError, show toast
- DB error: catch in service, return AppError, show toast
- Validation error: Zod parse → return to renderer as structured error
- Global uncaughtException handler in main process (log to file)
- ErrorBoundary fallback UI: "Something went wrong" + Reload button
```

**Prompt #40 — Final QA Checklist**
```
Final QA pass for Atomic Recovery MVP.
Test scenarios:
1. First run: no PIN → dashboard empty states → create Future Self
2. Create 3 habits → check in all → streak shows on each
3. Trigger Emergency Mode → run timer → "I made it" → UrgeLog created
4. Trigger Emergency Mode → "What happened" → RelapseModal → counter resets
5. Reach day 7 → milestone toast shows
6. Write morning journal → shows on Dashboard intention card
7. Log mood → shows on Dashboard mood card
8. Set PIN → close app → reopen → PIN screen → enter wrong → locked out
9. Package app → install → all above tests pass on packaged build
```

---

# PHẦN 9 — SOLO DEVELOPER OPTIMIZATION

## Làm ngay

| Hành động | Lý do |
|-----------|-------|
| **Ship MVP trong 8 tuần** | Sau 8 tuần không ship = motivation collapse |
| **Build Emergency Mode tuần 5** | Đây là reason #1 để dùng app — test early |
| **Fix Prisma packaged build ngay Sprint 1** | Đây là #1 technical risk — surface early |
| **Daily visible progress** | Show streak calendar, show sobriety counter ngay khi có |
| **Dùng ShadcnUI components** | Đừng build custom components từ đầu |
| **1 feature/sprint** | Focus beats multitasking |

## Bỏ hoàn toàn khỏi MVP

| Feature | Tại sao |
|---------|---------|
| Notion-style journal blocks | 3-4 tuần riêng, simple textarea đủ dùng |
| Life Score composite | Phức tạp, cần data từ nhiều sources |
| Achievement system đầy đủ | 30 achievements là quá nhiều — chỉ milestones là đủ |
| Trigger pattern aggregation job | Background job scheduling phức tạp |
| SQLite encryption | Painful build process, marginal security gain |
| Custom Command Palette | Nice-to-have, không critical |
| Export PDF | Full sprint riêng |
| Sleep tracking | User cần habit riêng để log sleep |

## Trì hoãn sang V1

| Feature | Khi nào làm |
|---------|------------|
| Analytics (full) | Sau khi có 30 ngày data |
| Onboarding flow | Sau khi MVP ổn định |
| Trigger pattern insights | V1 |
| Habit stacking | V1 |
| Notifications | V1 (Electron notifications không trivial) |
| Backup/restore | V1 |

## Nguy cơ giết dự án

| Nguy cơ | Triệu chứng | Phòng tránh |
|---------|-------------|-------------|
| **Perfectionismitis** | "Tôi sẽ làm tốt hơn trước khi ship" | Hard deadline: Week 8 = ship dù code không hoàn hảo |
| **Feature creep** | Thêm idea mỗi ngày | Tất cả idea → Backlog. Không thêm vào sprint đang chạy |
| **Tech debt spiral** | Refactor thay vì làm tính năng | MVP = working code, not perfect code |
| **Motivation collapse** | Không thấy progress | Commit code visible mỗi ngày, dogfood app hàng ngày |
| **Prisma/Electron setup** | Stuck ở setup 1 tuần | Test packaged build ngay ngày 3 |
| **Scope của Emergency Mode** | Over-engineer UX | Minimal viable: timer + 3 distractions + 2 exits |

## Golden Rules cho Solo Dev

1. **Working > Perfect** — Ship trước, polish sau
2. **Dogfood daily** — Dùng app của mình mỗi ngày từ tuần 3
3. **One task at a time** — Không mở nhiều feature branches
4. **Commit every session** — Dù chưa xong, commit WIP
5. **Test packaged early** — Đừng để production discovery đến cuối

---

# PHẦN 10 — FINAL EXECUTION PLAN

## Complete Roadmap

```
Week 1-2:  Sprint 1 — Foundation + Database + App Shell
Week 3-4:  Sprint 2 — Recovery + Habits
Week 5-6:  Sprint 3 — Emergency + Journal + Mood + Identity
Week 7-8:  Sprint 4 — Dashboard + Security + Polish + Ship MVP

Week 9-12: Sprint 5-6 — V1 (Identity enhancement, Analytics, Onboarding)
Week 13-16: Sprint 7-8 — V2 (Life Score, Focus, Sleep, Achievements)
```

## Master Task Checklist

### Sprint 1 Tasks
- [ ] Electron-Vite init (Prompt #1)
- [ ] Tailwind + ShadcnUI (Prompt #2)
- [ ] Custom window + TitleBar (Prompt #3)
- [ ] IPC infrastructure (Prompt #4)
- [ ] Prisma setup (Prompt #5)
- [ ] Migration 0001 (Prompt #6)
- [ ] Seed script (Prompt #7)
- [ ] React Router (Prompt #8)
- [ ] Sidebar (Prompt #9)
- [ ] AppShell (Prompt #10)

### Sprint 2 Tasks
- [ ] RecoveryService (Prompt #11)
- [ ] Recovery IPC (Prompt #12)
- [ ] SobrietyCounter (Prompt #13)
- [ ] RelapseModal (Prompt #14)
- [ ] Milestone system (Prompt #15)
- [ ] HabitService (Prompt #16)
- [ ] Habit IPC (Prompt #17)
- [ ] HabitCard (Prompt #18)
- [ ] HabitList page (Prompt #19)
- [ ] HabitForm modal (Prompt #20)
- [ ] StreakCalendar (Prompt #21)

### Sprint 3 Tasks
- [ ] EmergencyMode overlay (Prompt #22)
- [ ] UrgeTimer (Prompt #23)
- [ ] Distraction toolkit (Prompt #24)
- [ ] Emergency global trigger (Prompt #25)
- [ ] JournalService + IPC (Prompt #26)
- [ ] Journal page (Prompt #27)
- [ ] MoodService + MoodPicker (Prompt #28)
- [ ] IdentityService + Future Self UI (Prompt #29)

### Sprint 4 Tasks
- [ ] Dashboard page (Prompt #30)
- [ ] Settings page (Prompt #31)
- [ ] PIN lock screen (Prompt #32)
- [ ] Empty states (Prompt #33)
- [ ] Loading skeletons (Prompt #34)
- [ ] Toast + Milestone celebration (Prompt #35)
- [ ] Framer Motion animations (Prompt #36)
- [ ] electron-builder config (Prompt #37)
- [ ] Production DB path fix (Prompt #38)
- [ ] Error boundaries (Prompt #39)
- [ ] Final QA (Prompt #40)

---

## Start Coding Now

**Day 1, Hour 1:**
```bash
cd "C:\Users\minhn\Desktop\Atomic Recovery"
npx create-electron-vite@latest . --template react-ts
npm install
npm run dev
```

**Then:** Follow Prompt #1 → Prompt #2 → ... → Prompt #40 in order.

**Rule:** Complete each prompt fully before moving to the next.  
**Rule:** Test the packaged build after Sprint 1 (before writing any feature code).  
**Rule:** Dogfood the app starting Week 3.

---

> *"You do not rise to the level of your goals. You fall to the level of your systems."*  
> This document IS your system. Follow it.
