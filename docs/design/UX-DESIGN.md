# UX Design Document
# Atomic Recovery — Complete User Experience

**Version:** 1.0.0  
**Designer:** Senior UX Session  
**Date:** 2026-08-16  
**Inspiration:** Arc Browser · Linear · Notion · Raycast  
**Platform:** Electron Desktop (Windows + macOS)

---

## Design Language

### Principles
1. **Calm Authority** — Không gamification ồn ào. Mọi thứ có chủ đích, có trọng lượng.
2. **Progressive Disclosure** — Thông tin cần thiết hiện ra đúng lúc, không dump tất cả một lúc.
3. **Friction Where It Matters** — Daily loop: frictionless. Emergency exit / relapse: có ý thức buộc phải chậm lại.
4. **Peripheral Awareness** — Dashboard nhìn thoáng là biết hôm nay đang ở đâu.
5. **Privacy by Aesthetics** — Không có notification bar, không badge đỏ nhảy. Calm, không phán xét.

### Color System
```
Background:     #0A0A0F  (deep space black)
Surface:        #111118  (sidebar, cards)
Surface-Raised: #1A1A24  (modals, dropdowns)
Border:         #222232  (subtle dividers)
Border-Strong:  #2E2E42  (active states)

Accent:         #6366F1  (indigo — identity, core)
Accent-Warm:    #8B5CF6  (violet — recovery streak)
Success:        #10B981  (emerald — completions)
Warning:        #F59E0B  (amber — at-risk)
Danger:         #EF4444  (red — only for true emergency)
Neutral:        #94A3B8  (slate — secondary text)

Text-Primary:   #F1F5F9  (near white)
Text-Secondary: #64748B  (muted)
Text-Tertiary:  #334155  (placeholder)
```

### Typography
```
Font:      Inter (primary), JetBrains Mono (numbers, counters)
Sizes:     10 / 12 / 13 / 14 / 16 / 20 / 24 / 32 / 48
Weights:   400 (body) / 500 (ui) / 600 (heading) / 700 (display)
```

### Spacing System (4px base)
```
xs: 4px   sm: 8px   md: 12px   base: 16px
lg: 24px  xl: 32px  2xl: 48px  3xl: 64px
```

---

## 1. Information Architecture

```
Atomic Recovery
│
├── Dashboard               ← Daily command center
│   ├── Sobriety Counter    ← Hero element
│   ├── Today's Habits      ← Quick check-in
│   ├── Life Score          ← Composite health
│   ├── Mood Quick-Log      ← 1-tap mood
│   └── Today's Intention   ← From journal
│
├── Recovery                ← Recovery-specific hub
│   ├── Sobriety Timeline
│   ├── Milestones
│   ├── Relapse History     ← Non-judgmental log
│   └── Trigger Analysis
│
├── Habits                  ← Habit management
│   ├── Habit List
│   ├── Habit Detail / Streak
│   ├── New Habit Wizard
│   └── Habit Stacks
│
├── Identity                ← Who you're becoming
│   ├── Future Self Profile
│   ├── Identity Statements
│   ├── Affirmations
│   └── Identity Votes (XP)
│
├── Journal                 ← Daily writing
│   ├── Today's Entry
│   ├── Morning Intention
│   ├── Evening Reflection
│   ├── Free Write
│   └── Past Entries
│
├── Analytics               ← Patterns & insights
│   ├── Life Score Trends
│   ├── Habit Heatmap
│   ├── Mood Correlation
│   ├── Sleep + Focus
│   └── Weekly Summary
│
├── Focus                   ← Deep work sessions
│   ├── Timer (Pomodoro)
│   └── Session History
│
└── Settings
    ├── Security & Privacy
    ├── Notifications
    ├── Appearance
    ├── Data & Backup
    └── About
```

---

## 2. Navigation Design

### Top-Level Nav: Persistent Sidebar (Arc-style)

```
┌──────────────────────────────────────────────────────────────┐
│  SIDEBAR (240px)              CONTENT AREA (flex)            │
│  ──────────────────────       ──────────────────────────     │
│  [Avatar] Tôi        •●●     [Page content renders here]     │
│  Lv.12 · 2,450 XP            ──────────────────────────     │
│  ────────────────────                                        │
│                                                              │
│  ◉ Dashboard          ◄─ Active (filled icon + accent bg)   │
│  ○ Recovery                                                  │
│  ○ Habits                                                    │
│  ○ Identity                                                  │
│  ○ Journal                                                   │
│  ○ Analytics                                                 │
│  ○ Focus                                                     │
│                                                              │
│  ────────────────────                                        │
│  ⚡ EMERGENCY           ◄─ Always visible, pulsing subtle   │
│  ────────────────────                                        │
│  ⚙  Settings                                                 │
└──────────────────────────────────────────────────────────────┘
```

### Sidebar Specs
- **Width:** 240px (collapsible to 56px icon-only mode, `Cmd/Ctrl + \`)
- **Nav items:** Icon (20px Lucide) + Label (13px/500) + optional badge
- **Active state:** `bg-accent/10` left border `3px accent`, text `accent`
- **Hover state:** `bg-surface-raised`, 150ms ease transition
- **Emergency button:** `bg-danger/10 border border-danger/30`, pulse animation 3s

### Keyboard Navigation (Raycast-inspired)
```
Cmd+1      → Dashboard
Cmd+2      → Recovery
Cmd+3      → Habits
Cmd+4      → Identity
Cmd+5      → Journal
Cmd+6      → Analytics
Cmd+7      → Focus
Cmd+,      → Settings
Cmd+E      → Emergency Mode
Cmd+\      → Toggle sidebar
Cmd+K      → Command palette (quick actions)
```

### Command Palette (Raycast-style)
```
┌──────────────────────────────────────────┐
│  🔍 Quick Actions...                     │
│  ──────────────────────────────────────  │
│  ▶ Check in: Morning Routine             │
│  ▶ Log Mood                              │
│  ▶ Start Focus Session                   │
│  ▶ Write Journal Entry                   │
│  ▶ View Streak Counter                   │
│  ──────────────────────────────────────  │
│  ⚡ Emergency Mode        (Cmd+E)         │
└──────────────────────────────────────────┘
```

---

## 3. Sidebar Design

### Collapsed State (56px) — Icon Only
```
┌──────┐
│  [A] │  ← Avatar (28px)
│ ──── │
│  ⊞  │  ← Dashboard
│  🛡  │  ← Recovery (streak badge overlay)
│  ✓  │  ← Habits
│  ✦  │  ← Identity
│  📖  │  ← Journal
│  📊  │  ← Analytics
│  ⏱  │  ← Focus
│ ──── │
│  ⚡  │  ← Emergency (red glow)
│ ──── │
│  ⚙  │  ← Settings
└──────┘
```

### Recovery Badge in Sidebar
```
○ Recovery     42d ◄── Streak counter inline, warm violet
```

### Section Dividers (Linear-style)
- Thin `1px` line, `border-color: #1E1E2E`
- No section labels — icon + label is self-explanatory

---

## 4. Dashboard Design

### Layout: F-pattern with Hero + Grid

```
┌─────────────────────────────────────────────────────────────────┐
│  Good morning, Tôi  ·  Thứ Bảy, 16 tháng 8                    │
│                                                                 │
│  ┌────────────────────────────────────┐  ┌───────────────────┐ │
│  │  SOBRIETY COUNTER (Hero)           │  │   LIFE SCORE      │ │
│  │                                    │  │                   │ │
│  │  🛡  42 days, 6 hours              │  │      78/100       │ │
│  │       Người Đàn Ông Kỷ Luật        │  │   ████████░░      │ │
│  │                                    │  │                   │ │
│  │  ████████████████████░░░░  (30d)   │  │  💪 Recovery  90  │ │
│  │  Next: 50 days  →  8 days away     │  │  ✓  Habits   85  │ │
│  │                                    │  │  😊 Mood     70  │ │
│  └────────────────────────────────────┘  │  🌙 Sleep    60  │ │
│                                          └───────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  TODAY'S HABITS                          3/5 completed   │  │
│  │  ──────────────────────────────────────────────────────  │  │
│  │  ✅ Morning Cold Shower          ☐ Evening Meditation     │  │
│  │  ✅ 10 min Journal               ☐ No Doom Scroll         │  │
│  │  ✅ Workout                                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────┐  ┌──────────────────────────────┐ │
│  │  MOOD                   │  │  TODAY'S INTENTION           │ │
│  │                         │  │                              │ │
│  │  😐 → ?                 │  │  "Hôm nay tôi sẽ đọc sách   │ │
│  │  Morning: Calm (3/5)    │  │   thay vì lướt điện thoại." │ │
│  │  [Log evening mood]     │  │                              │ │
│  └─────────────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Dashboard Card Specs

**Sobriety Counter Card (Hero)**
- Size: `flex-[2]`, min-height `180px`
- Background: subtle radial gradient `from-accent/5 to-transparent`
- Counter font: `JetBrains Mono`, `48px/700`, `text-accent-warm`
- Sub-label: `13px/500`, `text-secondary`
- Progress bar: `4px` height, `bg-accent/30` track, `bg-accent-warm` fill
- Milestone hint: small pill `"50 days → 8 ngày nữa"`

**Life Score Card**
- Size: `flex-[1]`
- Score display: `32px/700`, circular or linear
- Per-category rows: icon (16px) + label + mini bar `40px wide`

**Habits Card (Today)**
- Checklist style, 2-column on wide screens
- Check: animated circle → checkmark (Framer Motion, 200ms)
- Uncompleted: subtle opacity 60%

**Mood Card**
- Time-of-day aware: shows "Morning mood: X" + CTA "Log evening"
- Quick emoji picker inline if not logged

**Intention Card**
- Shows `morningIntention` from journal
- If empty: dim placeholder + "Add intention" CTA

---

## 5. Habit Tracker Design

### Habit List View

```
┌─────────────────────────────────────────────────────────────────┐
│  Habits                                    [+ New Habit]  [⊞☰]  │
│                                                                 │
│  📌 CORE HABITS — Recovery                                      │
│  ──────────────────────────────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🚿  Cold Shower          ████████████  42d  ✅ Today   │    │
│  │     Daily · Morning      ░░░░░░░░░░░░  Best: 42d       │    │
│  └────────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 💪  Workout              ████████░░░░  28d  ✅ Today   │    │
│  │     Daily · Any time     ░░░░░░░░░░░░  Best: 35d       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  📚 MIND                                                        │
│  ──────────────────────────────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 📖  Read 20 pages        ████░░░░░░░░  12d  ☐ Today   │    │
│  │     Daily · Evening      ░░░░░░░░░░░░  Best: 20d       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [+ Add to MIND]                                                │
└─────────────────────────────────────────────────────────────────┘
```

### Habit Card Specs (List Item)
- Height: `72px` default, `88px` expanded (hover shows streak bar)
- Left accent stripe: `3px` wide, `color` from habit color
- Icon: `20px`, colored by habit color
- Streak counter: `JetBrains Mono 13px`, `text-accent-warm`
- Checkbox: right side, `28px` touch target, animated on complete

### Habit Check-in Animation
```
State 1: ○ (empty circle, border-muted)
   ↓ click
State 2: ◌ (spinning 150ms)
   ↓
State 3: ✅ (filled, accent color, scale 1.2 → 1.0 bounce, 200ms)
   + Subtle particle burst (3-4 dots, Framer Motion)
   + "+1 vote for [identity]" toast appears 300ms later (2s duration)
```

### Habit Detail / Streak View

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back     Cold Shower                              [⋮ Menu]   │
│                                                                 │
│  🚿  Cold Shower                                               │
│  Core Recovery Habit · Daily · Morning                         │
│                                                                 │
│  ┌──────────────────┐  ┌────────────────┐  ┌───────────────┐  │
│  │  Current Streak  │  │  Best Streak   │  │  Total Done   │  │
│  │  42 days  🔥     │  │  42 days       │  │  56 times     │  │
│  └──────────────────┘  └────────────────┘  └───────────────┘  │
│                                                                 │
│  STREAK CALENDAR — August 2026                                  │
│  Mo Tu We Th Fr Sa Su                                          │
│  ■  ■  ■  ■  ■  ■  ■   ← filled = completed                   │
│  ■  ■  ■  ■  ■  ■  ■                                           │
│  ■  ■  ■  ■  ■  ■  ■                                           │
│  ■  ■  ■  ■  ■  ■  ░   ← ░ = today (pending)                  │
│                                                                 │
│  HABIT STACK                                                    │
│  After: Wake up  →  [This]  →  10min Journal                   │
│                                                                 │
│  CUE / ROUTINE / REWARD                                         │
│  Cue:     Alarm rings + lay phone down                         │
│  Routine: Straight to shower, cold from start                  │
│  Reward:  Espresso + 5 min sit in silence                      │
└─────────────────────────────────────────────────────────────────┘
```

### New Habit Wizard (3 steps)

```
Step 1: BASICS
┌──────────────────────────────────────┐
│  What habit do you want to build?    │
│                                      │
│  [Icon picker]  [Name input]          │
│  [Color]        [Category]           │
│  [Type: Binary / Count / Duration]   │
│  [Frequency: Daily / Custom]         │
│  [Time: Morning / Evening / Anytime] │
│                                      │
│                         [Next →]     │
└──────────────────────────────────────┘

Step 2: ATOMIC FOUNDATION
┌──────────────────────────────────────┐
│  Make it atomic. (optional)          │
│                                      │
│  Cue (when/where will you do it?)    │
│  "After I ___"  [input]              │
│                                      │
│  Reward (how will you celebrate?)    │
│  "Then I'll ___"  [input]            │
│                                      │
│  Stack after: [habit picker]         │
│                                      │
│         [← Back]      [Next →]       │
└──────────────────────────────────────┘

Step 3: IDENTITY LINK
┌──────────────────────────────────────┐
│  Who does this make you?             │
│                                      │
│  Every time you complete this,       │
│  you vote for becoming...            │
│                                      │
│  "Người đàn ông kỷ luật"  ✓ (linked)│
│                                      │
│  Is this a core recovery habit?      │
│  [Toggle] Core — cannot skip 2x      │
│                                      │
│       [← Back]    [Create Habit ✓]   │
└──────────────────────────────────────┘
```

---

## 6. Future Self Design

### Future Self Hub

```
┌─────────────────────────────────────────────────────────────────┐
│  Identity                                                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  FUTURE SELF                                            │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │                                                         │   │
│  │  [Photo/Avatar — 80px circle]                           │   │
│  │  Người Đàn Ông Kỷ Luật                                  │   │
│  │  "Tôi sống có kỷ luật, tôi kiểm soát cơ thể và tâm    │   │
│  │   trí của mình. Tôi không bị cuốn vào cám dỗ."         │   │
│  │                                                         │   │
│  │  Core Traits:  🎯 Kỷ luật  💪 Mạnh mẽ  🧠 Rõ ràng     │   │
│  │  Target: 90 ngày → 15 tháng 11, 2026                   │   │
│  │                                    [Edit Future Self]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  IDENTITY VOTES THIS WEEK                                       │
│  ─────────────────────────────────────────────────────────     │
│  21 votes  ████████████████████░░░░  (Target: 25/week)         │
│                                                                 │
│  IDENTITY STATEMENTS                                [+ Add]     │
│  ─────────────────────────────────────────────────────────     │
│  ✦  "Tôi là người không xem porn."                             │
│  ✦  "Tôi tập thể dục mỗi ngày."                               │
│  ✦  "Tôi đọc sách thay vì lướt mạng."                         │
│                                                                 │
│  DAILY AFFIRMATION                                              │
│  ─────────────────────────────────────────────────────────     │
│  💬 "Mỗi quyết định nhỏ hôm nay định nghĩa người tôi           │
│      trở thành ngày mai."                       [Next →]       │
└─────────────────────────────────────────────────────────────────┘
```

### Future Self Edit Modal

```
┌──────────────────────────────────────────┐
│  Future Self Profile              [✕]    │
│  ──────────────────────────────────────  │
│                                          │
│  [Upload Photo]  or  [Generate Avatar]   │
│                                          │
│  Identity Name                           │
│  "Người Đàn Ông Kỷ Luật"                │
│                                          │
│  Vision Statement (your words)           │
│  ┌────────────────────────────────────┐  │
│  │ Tôi sống có kỷ luật, kiểm soát... │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Core Traits (up to 5)                  │
│  [Kỷ luật ×] [Mạnh mẽ ×] [+ Add]        │
│                                          │
│  Target Date (optional)                  │
│  [Date picker]                           │
│                                          │
│  Letter to Future Self                   │
│  ┌────────────────────────────────────┐  │
│  │ Anh ơi, nếu anh đọc được điều     │  │
│  │ này, thì anh đã...                 │  │
│  └────────────────────────────────────┘  │
│                                          │
│  [Cancel]              [Save Profile]    │
└──────────────────────────────────────────┘
```

---

## 7. Journal Design

### Journal Page

```
┌─────────────────────────────────────────────────────────────────┐
│  Journal  ·  Thứ Bảy, 16 tháng 8                      [↗ Full] │
│                                                                 │
│  ┌── MORNING ──────────────────────────────────────────────┐   │
│  │  🌅 Intention — What will you focus on today?           │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  "Hôm nay tôi sẽ đọc 20 trang sách và không    │    │   │
│  │  │   mở YouTube trước 8pm."                        │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │  Gratitude (3 things)                                   │   │
│  │  1. [_____________________________]                     │   │
│  │  2. [_____________________________]                     │   │
│  │  3. [_____________________________]                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌── FREE WRITE ────────────────────────────────────────────┐  │
│  │  ┌─────────────────────────────────────────────────┐     │  │
│  │  │                                                  │     │  │
│  │  │  [Notion-style blank canvas]                     │     │  │
│  │  │  Type '/' for commands...                        │     │  │
│  │  │                                                  │     │  │
│  │  └─────────────────────────────────────────────────┘     │  │
│  └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌── EVENING ──────────────────────────────────────────────┐   │
│  │  🌙 Reflection — How did today go?                      │   │
│  │  [textarea]                                             │   │
│  │                                                         │   │
│  │  Wins today 🏆  [+ Add win]                             │   │
│  │  ✓ Completed workout                                    │   │
│  │  ✓ No phone first hour                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  ← Previous entries: Aug 15  Aug 14  Aug 13  …               │
└─────────────────────────────────────────────────────────────────┘
```

### Journal Entry States
- **Empty morning:** Warm prompt, not a blank form. "Buổi sáng tốt lành. Hôm nay bạn muốn là ai?"
- **Draft auto-save:** 30s auto-save, subtle "Saved" flash bottom-right
- **Full-screen mode:** Cmd+Enter → distraction-free writing (Linear-style, only text visible)

---

## 8. Mood Tracking Design

### Mood Log Panel (Inline in Dashboard + Standalone)

```
┌──────────────────────────────────────────┐
│  How are you right now?                  │
│  ──────────────────────────────────────  │
│                                          │
│  MOOD                                    │
│  😫   😕   😐   🙂   😄               │
│   1    2    3    4    5                  │
│           ↑ (selected, highlighted)      │
│                                          │
│  ENERGY            ANXIETY               │
│  ●●●○○  (3/5)     ●●○○○  (2/5)          │
│                                          │
│  FOCUS                                   │
│  ●●●●○  (4/5)                           │
│                                          │
│  Tags (optional)                         │
│  [Calm ×] [Productive ×] [+ Add]         │
│                                          │
│  Note (optional)                         │
│  [____________________________________]  │
│                                          │
│                    [Log Mood ✓]          │
└──────────────────────────────────────────┘
```

### Mood History Visualization

```
MOOD THIS WEEK
Mo  Tu  We  Th  Fr  Sa  Su
●   ●   ●   ●   ●   ●   ○
3   4   3   5   4   3   ?
    M E   M E   M E

Avg this week: 3.7 / 5
Trend vs last week: ↑ +0.4
```

**Mood + Recovery Correlation Panel:**
```
PATTERN DETECTED
On days you sleep 7+ hours → Mood avg 4.2
On days with urge events   → Mood avg 2.8

💡 Better sleep = better resistance
```

---

## 9. Settings Design (Linear-style)

```
┌─────────────────────────────────────────────────────────────────┐
│  Settings                                                       │
│                                                                 │
│  ┌── SIDEBAR ─────────────────┐  ┌── CONTENT ─────────────┐   │
│  │  > Security & Privacy      │  │  Security & Privacy     │   │
│  │    Notifications           │  │  ────────────────────   │   │
│  │    Appearance              │  │                         │   │
│  │    Data & Backup           │  │  App Lock               │   │
│  │    About                   │  │  PIN Protection         │   │
│  └────────────────────────────┘  │  [Toggle] ●────         │   │
│                                  │                         │   │
│                                  │  PIN Code               │   │
│                                  │  [Set PIN…]             │   │
│                                  │                         │   │
│                                  │  Biometric              │   │
│                                  │  Windows Hello          │   │
│                                  │  [Toggle] ○────         │   │
│                                  │                         │   │
│                                  │  Data Encryption        │   │
│                                  │  SQLite encryption      │   │
│                                  │  [Toggle] ○────         │   │
│                                  │                         │   │
│                                  │  ────────────────────   │   │
│                                  │  DANGER ZONE            │   │
│                                  │  [Delete all data…]     │   │
│                                  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Settings Sections Detail

**Security & Privacy**
- PIN enable/disable + change PIN
- Biometric (Windows Hello / Touch ID)
- SQLite encryption toggle
- Stealth mode (hide from Alt+Tab, taskbar)
- Delete all data (3-step confirmation)

**Notifications**
- Master on/off
- Morning reminder time
- Evening reminder time
- High-risk times alerts (custom schedule)
- Milestone celebrations

**Appearance**
- Theme: Dark / Light / System
- Accent color picker (8 presets + custom hex)
- Font size: Compact / Default / Large
- Sidebar: Full / Compact / Auto-hide

**Data & Backup**
- Backup location picker
- Manual backup button + auto-backup schedule
- Import backup
- Export (JSON, PDF)

---

## 10. Empty States

### Dashboard — First Day (Zero State)
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                  [Shield icon — 64px, accent/30]                │
│                                                                 │
│               Day 1 of a new chapter.                          │
│          Every great journey starts exactly here.              │
│                                                                 │
│             [Start Your Recovery Journey →]                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Habits — No Habits Yet
```
┌──────────────────────────────────────┐
│                                      │
│   ✦  No habits yet.                  │
│                                      │
│   Start small. One habit changes     │
│   everything.                        │
│                                      │
│   [+ Create your first habit]        │
│                                      │
│   Or start with a template:          │
│   [Recovery Starter Pack]            │
└──────────────────────────────────────┘
```

### Journal — No Entry Today
```
┌──────────────────────────────────────┐
│                                      │
│   📖  Your page is blank.            │
│       That's okay.                   │
│                                      │
│   Even one sentence is enough.       │
│   What's on your mind?               │
│                                      │
│   [Start writing…]                   │
│                                      │
└──────────────────────────────────────┘
```

### Analytics — Not Enough Data
```
┌──────────────────────────────────────┐
│                                      │
│  📊  Insights need more time.        │
│                                      │
│  Keep going for 7 days — your        │
│  patterns will start to emerge.      │
│                                      │
│  5 days to go.                       │
│  ██████████████░░░░░░  (2/7)         │
│                                      │
└──────────────────────────────────────┘
```

### Recovery — No Relapse History (Positive Empty)
```
┌──────────────────────────────────────┐
│                                      │
│  🛡  No relapse events logged.       │
│                                      │
│  That's exactly where you want       │
│  to be. Keep going.                  │
│                                      │
└──────────────────────────────────────┘
```

---

## 11. Error States

### Emergency Mode — Full Screen Overlay

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ████████████████████████████████████████████████████████████  │
│  ██                                                          ██ │
│  ██          ⚡ EMERGENCY MODE                               ██ │
│  ██                                                          ██ │
│  ██     Cơn thèm muốn này sẽ qua.                           ██ │
│  ██     Bạn đã từng vượt qua nó rồi.                        ██ │
│  ██                                                          ██ │
│  ██  ┌─────────────────────────────────────────────────┐    ██ │
│  ██  │                                                 │    ██ │
│  ██  │            15:00                                │    ██ │
│  ██  │         (Urge Timer)                            │    ██ │
│  ██  │    "Surf it. Don't fight it."                   │    ██ │
│  ██  │                                                 │    ██ │
│  ██  └─────────────────────────────────────────────────┘    ██ │
│  ██                                                          ██ │
│  ██  What would Future You do right now?                    ██ │
│  ██  "Người Đàn Ông Kỷ Luật would close this and read."    ██ │
│  ██                                                          ██ │
│  ██  Try one of these instead:                              ██ │
│  ██  [📖 Read]  [💧 Cold water]  [🚶 Walk]  [✍️ Write]     ██ │
│  ██                                                          ██ │
│  ██  ────────────────────────────────────────────────────   ██ │
│  ██                                                          ██ │
│  ██  [I made it through]      [Log what happened…]          ██ │
│  ██                                                          ██ │
│  ████████████████████████████████████████████████████████████  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Emergency Mode Specs:**
- Full-screen overlay, z-index top, no window chrome visible
- Background: `#080810` + subtle noise texture
- Timer: `JetBrains Mono 64px`, counts down (10/15/20 min options)
- Exit: "I made it through" → logs UrgeLog(outcome: RESISTED)
- "Log what happened" → RelapseModal (non-judgmental flow)
- Cannot accidentally dismiss with Escape — requires intentional click

### Relapse Modal — Non-Judgmental Flow

```
┌──────────────────────────────────────────┐
│  Let's talk about it.            [✕]     │
│  ──────────────────────────────────────  │
│                                          │
│  This doesn't erase your progress.      │
│  You're still on this journey.           │
│                                          │
│  What happened? (optional)               │
│  ┌────────────────────────────────────┐  │
│  │ What led up to this?               │  │
│  └────────────────────────────────────┘  │
│                                          │
│  What triggered it?                      │
│  [Boredom] [Stress] [Lonely] [Tired]    │
│  [Social]  [Fantasy] [Other]            │
│                                          │
│  Urge intensity before: [1──●──────10]  │
│                                          │
│  What can you do differently next time?  │
│  [____________________________________]  │
│                                          │
│  ──────────────────────────────────────  │
│  [Skip — just reset counter]             │
│  [Save & Reset]                          │
└──────────────────────────────────────────┘
```

**Copy principles:**
- Never: "You failed", "Streak broken", "Starting over"
- Always: "New chapter", "Still recovering", "Data to learn from"

### Network / Sync Error (N/A — local app, but for future)
```
⚠  Không thể lưu dữ liệu
   Đĩa cứng đầy hoặc không có quyền ghi.
   [Thử lại]  [Chọn vị trí khác]
```

### Corrupted Data Error
```
⚠  Không đọc được dữ liệu
   File database có thể bị hỏng.
   [Khôi phục từ backup]  [Liên hệ hỗ trợ]
```

---

## 12. User Flows

### Flow A: Daily Morning Loop (< 3 minutes)
```
Open App
  → Lock screen (PIN) [5s]
  → Dashboard auto-loads
  → See streak counter [instant]
  → Tap "Log morning mood" [20s]
  → See habits list
  → Check off completed habits [30s]
  → Write 1-line morning intention [30s]
  → Done ✓  [Total: ~85s]
```

### Flow B: Emergency Triggered
```
Feeling urge
  → Cmd+E or click Emergency button
  → Full-screen Emergency Mode [instant]
  → Choose timer duration (10/15/20)
  → Timer starts, distraction options shown
  → [Option A] Timer completes → "I made it" → UrgeLog(RESISTED) → back to dashboard
  → [Option B] Can't hold → "Log what happened" → RelapseModal → reset counter → "New chapter" message → dashboard
```

### Flow C: New Habit Creation
```
Habits page
  → [+ New Habit]
  → Step 1: Name, icon, category, type, frequency
  → Step 2: Cue, routine, reward (Atomic Habits)
  → Step 3: Identity link, core habit toggle
  → [Create] → animated card appears in list → first check-in prompt
```

### Flow D: Weekly Review
```
Sunday evening / Saturday auto-prompt
  → Notification: "Your weekly review is ready"
  → Analytics page loads with weekly summary
  → See: habits rate, mood avg, recovery streak, trigger patterns
  → Write week note (optional)
  → See next week intention prompt
  → Done
```

---

## 13. Component Hierarchy

```
<App>
  <LockScreen />                     ← Shown on launch if PIN enabled
  <AppShell>
    <TitleBar />                     ← Custom window chrome (frameless)
    <Sidebar>
      <UserProfile />                ← Avatar + name + XP
      <NavItem /> (×7)               ← Dashboard → Settings
      <EmergencyButton />            ← Always visible
      <NavItem icon="settings" />
    </Sidebar>
    <MainContent>

      <DashboardPage>
        <DashboardHeader />          ← Greeting + date
        <SobrietyCounter />          ← Hero card
        <LifeScoreCard />            ← Composite score
        <TodayHabitsList>
          <HabitCheckItem /> (×n)
        </TodayHabitsList>
        <MoodQuickLog />
        <IntentionCard />
      </DashboardPage>

      <RecoveryPage>
        <SobrietyTimeline />
        <MilestoneGrid />
        <RelapseHistoryList>
          <RelapseEventCard /> (×n)
        </RelapseHistoryList>
        <TriggerAnalyticsChart />
      </RecoveryPage>

      <HabitsPage>
        <HabitCategorySection /> (×n)
          <HabitCard /> (×n)
        <HabitDetailDrawer>
          <StreakCalendar />
          <HabitStackView />
          <CueRoutineReward />
        </HabitDetailDrawer>
      </HabitsPage>

      <IdentityPage>
        <FutureSelfCard />
        <IdentityVotesMeter />
        <IdentityStatementList>
          <StatementItem /> (×n)
        </IdentityStatementList>
        <DailyAffirmation />
      </IdentityPage>

      <JournalPage>
        <JournalDateNav />
        <MorningSection />
        <FreeWriteEditor />           ← Notion-style blocks
        <EveningSection />
        <WinsList />
      </JournalPage>

      <AnalyticsPage>
        <LifeScoreTrendChart />
        <HabitHeatmapGrid />
        <MoodCorrelationChart />
        <TriggerPatternView />
        <WeeklySummaryCard />
      </AnalyticsPage>

      <FocusPage>
        <PomodoroTimer />
        <FocusSessionList />
      </FocusPage>

      <SettingsPage>
        <SettingsSidebar />
        <SecuritySettings />
        <NotificationSettings />
        <AppearanceSettings />
        <DataBackupSettings />
      </SettingsPage>

    </MainContent>
  </AppShell>

  {/* Global Overlays */}
  <EmergencyMode />                  ← Full-screen, always on top
  <RelapseModal />                   ← Non-judgmental flow
  <MilestoneToast />                 ← Achievement celebrations
  <CommandPalette />                 ← Cmd+K global
  <ToastContainer />                 ← System notifications
```

---

## 14. Screen Specifications Summary

| Screen | Primary Action | Secondary Actions | Key Metric Shown |
|--------|---------------|-------------------|-----------------|
| Dashboard | Quick habit check-in | Log mood, Write intention | Sobriety days |
| Recovery | View timeline | Log trigger, See milestones | Current streak |
| Habits | Check off today | Add habit, View detail | Completion rate |
| Identity | Read affirmation | Edit Future Self, Add statement | Identity votes |
| Journal | Write entry | View history | Words today |
| Analytics | Read insights | Change time range | Life score trend |
| Focus | Start timer | Link to habit | Focus minutes today |
| Settings | Toggle setting | — | Last backup |
| Emergency | Start timer | Choose distraction | Timer countdown |

---

## 15. Animations & Micro-interactions

| Interaction | Animation | Duration | Easing |
|-------------|-----------|----------|--------|
| Habit check-in | Circle → checkmark + particle burst | 300ms | spring(1, 0.7) |
| Streak milestone | Card glow pulse + XP number fly-in | 600ms | ease-out |
| Emergency mode open | Fade in full-screen + blur bg | 200ms | ease-in |
| Relapse modal | Slide up from bottom | 250ms | spring |
| Page transition | Fade + 4px slide | 150ms | ease |
| Sidebar collapse | Width animate 240→56 | 200ms | ease-in-out |
| Mood emoji select | Scale 1→1.3→1 on selected | 200ms | spring |
| Achievement unlock | Full celebration modal + confetti | 1200ms | custom |
| Timer countdown | Number tick every second | 1000ms | linear |
| XP gain toast | Slide in from right, fade out | 2000ms | spring |
