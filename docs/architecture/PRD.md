# Product Requirements Document
# Atomic Recovery — Desktop Habit & Recovery App

**Version:** 1.0.0 — Draft  
**Date:** 2026-08-16  
**Author:** PM/UX/Arch Analysis Session  
**Status:** Pre-Development

---

## 1. Executive Summary

**Atomic Recovery** là ứng dụng desktop được thiết kế để giúp người dùng xây dựng kỷ luật cá nhân thông qua phương pháp **Atomic Habits** của James Clear, với trọng tâm đặc biệt vào việc phá vỡ các hành vi nghiện mang tính compulsive (cụ thể: porn/thủ dâm) và thay thế bằng danh tính tích cực hướng đến **Future Self**.

Ứng dụng không phải là một tracker đơn thuần — nó là **hệ thống thay đổi danh tính**, lấy cảm hứng từ triết lý: *"Bạn không nâng cao tiêu chuẩn của mình — bạn rơi xuống mức của hệ thống của mình."*

---

## 2. Product Analysis

### 2.1 Problem Statement

Nghiện nội dung khiêu dâm và thủ dâm cưỡng bức (compulsive) là vấn đề phổ biến nhưng bị kỳ thị nặng nề, khiến người bị ảnh hưởng:

- Không dám tìm kiếm hỗ trợ công khai.
- Cảm thấy xấu hổ và cô lập.
- Thất bại lặp đi lặp lại và mất niềm tin vào bản thân.
- Thiếu công cụ riêng tư, không phán xét, có hệ thống.

Các ứng dụng hiện tại (Habitica, Streaks, Loop) tốt cho thói quen tổng quát nhưng **không được thiết kế cho recovery journey** — chúng thiếu ngữ cảnh cảm xúc, thiếu cơ chế phòng ngừa relapse, và không xây dựng danh tính.

### 2.2 Core Insight

> *"Mọi hành động bạn thực hiện đều là một phiếu bầu cho loại người bạn muốn trở thành."* — James Clear

Atomic Recovery không hỏi "Bạn có hoàn thành habit hôm nay không?" mà hỏi: **"Người bạn đang trở thành sẽ làm gì lúc này?"**

---

## 3. Target User Groups

### Primary: The Recovering Individual (18-35 tuổi)

| Attribute | Detail |
|-----------|--------|
| Giới tính | Chủ yếu nam, nhưng không loại trừ |
| Tuổi | 18–35 |
| Tình trạng | Nhận ra vấn đề, muốn thay đổi |
| Thái độ | Tự trị, không muốn trị liệu nhóm/công khai |
| Nỗi sợ | Bị phán xét, mất riêng tư, thất bại lần nữa |
| Động lực | Tự tôn, mối quan hệ, năng suất, sức khỏe |

### Secondary: The Disciplined Builder

Người muốn xây dựng kỷ luật toàn diện — không chỉ cho recovery mà cho toàn bộ hệ thống cuộc sống. Recovery là "entry point" nhưng họ cũng muốn theo dõi gym, đọc sách, học tập.

### Tertiary: The Relapse-Prone Veteran

Người đã thử nhiều phương pháp, hiểu lý thuyết nhưng vẫn thất bại. Họ cần **hệ thống phòng ngừa relapse chủ động**, không phải thêm lý thuyết.

---

## 4. Pain Points

### P1 — Shame Spiral (Nghiêm trọng nhất)
Sau mỗi lần relapse, cảm giác xấu hổ → bỏ cuộc → streak về 0 → cảm giác thất bại tổng thể. Không có cơ chế để "tiếp tục tiến lên" sau thất bại.

### P2 — Identity Disconnect
Người dùng biết mình muốn thay đổi nhưng không kết nối được với "người tương lai" đó. Thiếu công cụ hình thành và củng cố danh tính mới.

### P3 — Trigger Blindness
Không nhận ra các trigger dẫn đến relapse (cô đơn, buồn chán, stress, thời gian tối) cho đến khi đã hành động.

### P4 — No Emergency Protocol
Khi cơn thèm muốn ập đến, không có gì để làm ngoài ý chí. Không có "urge surfing toolkit" hay distraction protocol.

### P5 — Inconsistent Tracking
Các app thông thường đòi hỏi nhiều thao tác, dễ bỏ → dữ liệu không đủ để rút ra insight.

### P6 — Privacy Anxiety
Lo ngại dữ liệu nhạy cảm bị lưu trữ trên cloud, ai đó có thể truy cập.

---

## 5. User Journey

```
AWARENESS         COMMITMENT        SYSTEM SETUP      DAILY PRACTICE    CRISIS MOMENT     REFLECTION        IDENTITY SHIFT
───────────       ───────────       ──────────────    ──────────────    ─────────────     ──────────        ──────────────
"Tôi có vấn    → "Tôi muốn     → Tạo Future    → Check-in      → Urge         → Weekly       → "Tôi là
đề với         →  thay đổi"    → Self profile  → hàng ngày     → surfing mode  → review &     → người kỷ
habit này"                     → Thiết lập     → Log           → Emergency     → insights     → luật"
                                 → habit stack   → mood/energy   → toolkit
                                 → Cài đặt       → Mini habits   → Relapse log
                                 → trigger       → Emergency     → (nếu xảy ra)
                                 → alerts        → button
```

---

## 6. Core Value Proposition

> **Atomic Recovery biến quá trình phục hồi từ thất bại cá nhân thành hành trình xây dựng danh tính có hệ thống — riêng tư, không phán xét, và được thiết kế để bạn không bao giờ cảm thấy phải bắt đầu lại từ đầu.**

**3 pillars:**
1. **Identity Architecture** — Xây dựng và củng cố "người tôi đang trở thành"
2. **Crisis Intelligence** — Nhận diện và phản ứng với trigger + urge theo thời gian thực
3. **System Resilience** — Streak không bao giờ về 0; recovery được tính là tiến bộ

---

## 7. Complete Feature List

### 7A. Identity & Future Self
- [ ] Future Self Profile (ảnh, mô tả, tên danh tính)
- [ ] Identity Affirmations (câu khẳng định danh tính hàng ngày)
- [ ] Identity Voting System (mỗi habit hoàn thành = 1 phiếu bầu)
- [ ] Character Level / XP System (gamification nhẹ)
- [ ] "Letter to Future Self" (viết thư định kỳ)
- [ ] Values Clarification Exercise (onboarding + periodic)
- [ ] Identity Timeline (nhìn lại hành trình)

### 7B. Habit Tracking Core
- [ ] Habit creation với loại: binary, count, time-based
- [ ] Habit stacking (gắn habit mới vào habit cũ)
- [ ] Time-of-day scheduling
- [ ] Habit frequency: daily, weekdays, custom
- [ ] Streak tracking (current + longest + recovery streak)
- [ ] Two-day rule enforcement (không bỏ 2 ngày liên tiếp)
- [ ] Habit archiving
- [ ] Bulk check-in
- [ ] Habit categories và tags

### 7C. Recovery-Specific
- [ ] Sobriety counter (ngày, giờ, phút)
- [ ] Relapse logging (không phán xét, hỏi nguyên nhân)
- [ ] Relapse pattern analysis (thống kê trigger)
- [ ] "I slipped but I'm still recovering" messaging
- [ ] Recovery milestones (1 ngày, 1 tuần, 30 ngày, 90 ngày, 1 năm)
- [ ] Streak insurance (mất streak không xóa lịch sử)
- [ ] Recovery roadmap (giai đoạn phục hồi não bộ)

### 7D. Crisis & Urge Management
- [ ] Emergency Mode (big red button)
- [ ] Urge timer (lướt qua cơn thèm — 10-20 phút countdown)
- [ ] Trigger journal (log trigger khi nhận ra)
- [ ] Urge intensity tracker (1-10 scale)
- [ ] Distraction protocol (danh sách hành động thay thế có thể tùy chỉnh)
- [ ] Breathing/mindfulness exercises tích hợp
- [ ] "Call to Future Self" prompt
- [ ] Pre-emptive urge prediction (dựa trên pattern)

### 7E. Daily Check-in & Journaling
- [ ] Morning intention setting
- [ ] Evening reflection
- [ ] Mood tracker (5 trạng thái)
- [ ] Energy level tracker
- [ ] Gratitude log
- [ ] Win journal (ghi nhận chiến thắng nhỏ)
- [ ] Free-form journal entry
- [ ] Daily question prompts (AI-curated hoặc preset)

### 7F. Analytics & Insights
- [ ] Streak calendar (GitHub-style heatmap)
- [ ] Completion rate trends
- [ ] Mood vs habit correlation
- [ ] Best day/worst day patterns
- [ ] Time-of-day performance
- [ ] Relapse trigger frequency analysis
- [ ] Weekly summary report
- [ ] Monthly progress letter (auto-generated)
- [ ] Export to PDF

### 7G. Environment Design
- [ ] Trigger environment mapping (nơi nào, thời điểm nào dễ relapse)
- [ ] Implementation intentions (If-Then planning)
- [ ] Temptation bundling creator
- [ ] Reward system (tự thiết lập phần thưởng khi đạt milestone)
- [ ] Commitment device reminders

### 7H. Notification & Reminders
- [ ] Custom habit reminders (giờ cụ thể)
- [ ] Evening check-in reminder
- [ ] Milestone celebration notifications
- [ ] "High-risk time" alerts (dựa trên pattern)
- [ ] Do Not Disturb integration

### 7I. Privacy & Security
- [ ] Local-only storage (SQLite, không cloud)
- [ ] App password / PIN lock
- [ ] Biometric lock (Windows Hello / Touch ID)
- [ ] Data encryption at rest
- [ ] Stealth mode (ẩn app khỏi taskbar khi lock)
- [ ] Panic button (đóng app nhanh)
- [ ] Backup & restore (local/USB)

### 7J. Onboarding & Education
- [ ] Atomic Habits onboarding flow
- [ ] Why habits form / brain science explainer
- [ ] Recovery science (dopamine reset, NoFap timeline)
- [ ] First-week guided journey
- [ ] Habit templates (pre-built stacks cho recovery)

### 7K. Customization & UX
- [ ] Dark / Light / Custom themes
- [ ] Accent color picker
- [ ] Font size adjustment
- [ ] Compact vs detailed view
- [ ] Widget/mini window mode
- [ ] System tray app
- [ ] Keyboard shortcuts
- [ ] Offline-first (always)

---

## 8. Feature Prioritization (MoSCoW)

### ✅ Must Have (MVP)

| Feature | Lý do |
|---------|-------|
| Sobriety counter | Core identity — số đo thành công số 1 |
| Habit tracking (binary) | Core loop |
| Daily check-in (sáng/tối) | Daily engagement |
| Emergency Mode + Urge timer | Safety net — giữ người dùng trong app khi khủng hoảng |
| Relapse logging (không phán xét) | Phá vỡ shame spiral |
| Future Self Profile | Identity anchor |
| Local SQLite storage | Privacy — non-negotiable |
| Streak calendar | Motivation visual |
| Mood tracker (đơn giản) | Correlation data |
| App lock (PIN) | Privacy |
| Recovery milestones | Celebration |

### 🔵 Should Have (V1)

| Feature | Lý do |
|---------|-------|
| Identity Affirmations | Daily identity reinforcement |
| Trigger journal | Pattern recognition |
| Habit stacking | Atomic Habits core method |
| Weekly insights | Reflection loop |
| Distraction protocol tùy chỉnh | Crisis management |
| Mood/energy analytics | Personalization |
| Notification reminders | Engagement |
| Streak insurance | Resilience |
| Habit categories | Organization |
| Onboarding flow | Retention |

### 💡 Nice To Have (V2+)

| Feature | Lý do |
|---------|-------|
| Breathing/mindfulness | Useful nhưng có app khác làm tốt hơn |
| Character XP system | Gamification — không phải core |
| Temptation bundling creator | Advanced |
| Monthly progress letter | Delight feature |
| Pre-emptive urge prediction | Cần đủ data trước |
| Export PDF | Edge case |
| Implementation intentions | Power user feature |
| Letter to Future Self | Emotional depth |

---

## 9. Roadmap

### MVP (Tuần 1-6) — "Core Recovery Loop"

**Goal:** Người dùng có thể track recovery streak, log habit hàng ngày, và có nơi để đến khi khủng hoảng.

**Features:**
- Sobriety counter (+ milestones)
- 3-5 habit tracking (binary)
- Morning/evening check-in (đơn giản)
- Emergency Mode + Urge Timer (5-20 min)
- Relapse log (non-judgmental flow)
- Future Self Profile (ảnh + tên danh tính + 3 giá trị)
- Streak calendar heatmap
- Mood tracker (5 states)
- Local SQLite + PIN lock
- Dark mode UI

**Success metric:** User có thể hoàn thành full daily loop < 3 phút.

---

### V1 (Tháng 2-3) — "Identity Engine"

**Goal:** Xây dựng hệ thống danh tính và phân tích pattern cơ bản.

**New features:**
- Identity Affirmations (daily rotation)
- Trigger journal + frequency chart
- Habit stacking (if-then linking)
- Weekly summary + insights
- Relapse trigger analysis
- Distraction protocol (customizable list)
- Custom notifications
- Streak insurance
- Habit categories & tags
- Onboarding guided flow (7 ngày đầu)
- Two-day rule enforcement

**Success metric:** Retention 30 ngày > 40%, relapse frequency giảm so với baseline.

---

### V2 (Tháng 4-6) — "Deep Intelligence"

**Goal:** Biến dữ liệu thành insight hành động được.

**New features:**
- Mood/energy vs habit correlation analysis
- High-risk time prediction alerts
- Implementation intentions (If-Then templates)
- Win journal + gratitude log
- Character XP + milestones với animation
- Monthly progress auto-summary
- Breathing/mindfulness mini-tools
- Temptation bundling planner
- Recovery roadmap (brain recovery timeline)
- Data export (PDF/JSON)
- Biometric lock (Windows Hello)

**Success metric:** Streak length trung bình tăng 50% so với V1.

---

### V3 (Tháng 7-12) — "Future Self"

**Goal:** Tích hợp sâu vào cuộc sống hàng ngày.

**New features:**
- Letter to Future Self (viết + nhận lại sau X ngày)
- Identity timeline visualization
- Full habit stack templates library
- System tray widget
- Pre-emptive urge prediction (ML local)
- Values clarification periodic review
- Reward system tùy chỉnh
- Stealth mode (tray-only)
- Backup/restore (encrypted)
- Community templates sharing (optional, local import)

**Success metric:** 90-day streak completion rate > 15% of active users.

---

## 10. Risk Analysis

| Risk | Mức độ | Xác suất | Mitigation |
|------|--------|----------|------------|
| **Privacy breach / stigma** | Rất cao | Thấp | Local-only, encryption, no analytics SDK |
| **Shame spiral khi relapse** | Cao | Cao | Non-judgmental UX copy, relapse ≠ failure messaging |
| **User churn sau 7 ngày** | Cao | Trung bình | Onboarding flow, habit loop < 3 min |
| **App trở thành obsession** | Trung bình | Thấp | Limit tracking prompts, encourage analog |
| **Emergency mode không đủ mạnh** | Cao | Trung bình | Nhiều lớp: timer → distraction → Future Self prompt |
| **Data loss** | Cao | Thấp | Local backup, migration scripts |
| **Scope creep** | Trung bình | Cao | Strict MVP discipline, feature flags |
| **Performance (Electron)** | Trung bình | Trung bình | Lazy loading, virtual scroll, DB indexing |

---

## 11. KPIs by Phase

### MVP KPIs
| Metric | Target |
|--------|--------|
| Day-1 retention | > 70% |
| Day-7 retention | > 40% |
| Daily check-in completion | > 60% |
| Emergency mode usage → no relapse | > 50% |
| Time to complete daily loop | < 3 min |
| App crash rate | < 1% |

### V1 KPIs
| Metric | Target |
|--------|--------|
| Day-30 retention | > 30% |
| Avg streak length | > 7 ngày |
| Relapse frequency (week 4 vs week 1) | -30% |
| Weekly review completion | > 40% |
| Trigger journal entries/user | > 5 |

### V2 KPIs
| Metric | Target |
|--------|--------|
| Avg streak length | > 14 ngày |
| Users reaching 30-day milestone | > 20% |
| Mood data correlation usage | > 30% engaged |
| Habit stack adoption | > 50% users |

### V3 KPIs
| Metric | Target |
|--------|--------|
| Users reaching 90-day milestone | > 10% |
| "Identity shift" self-reported (survey) | > 60% |
| App uninstall rate (Month 6+) | < 10%/month |

---

## 12. Design Principles

1. **Privacy First** — Không một byte dữ liệu nào rời khỏi máy người dùng.
2. **Non-judgmental** — Không có gameover. Relapse là data, không phải thất bại.
3. **Friction-less daily** — Daily loop < 3 phút. Không bloat.
4. **High-friction exit** — Emergency mode khó thoát, dễ sử dụng.
5. **Identity > Outcome** — Luôn frame mọi thứ qua lăng kính "Tôi là ai", không phải "Tôi đã làm gì".
6. **Calm, not gamified** — Không confetti điên loạn. Ấm áp, nghiêm túc, đẹp.
