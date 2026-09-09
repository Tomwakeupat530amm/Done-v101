# Kế Hoạch Kỹ Thuật (Implementation Plan)
# Bộ Đếm Pomodoro Cho Task & Quản Lý Mục Tiêu Dài Hạn

- **Tài liệu:** `pomodoro-and-goals_PLAN_09-09-26.md`
- **Tài liệu SPEC liên kết:** [pomodoro-and-goals_SPEC_09-09-26.md](pomodoro-and-goals_SPEC_09-09-26.md)
- **Ngày lập:** 09-09-2026
- **Date**: 09-09-26
- **Status**: COMPLETED
- **Complexity**: COMPLEX
- **Dự án:** Atomic Recovery (`Habit-recovery`)
- **Giai đoạn RIPER-5:** COMPLETED (Đã kiểm thử và đóng gói Windows thành công)

---

## Overview

Kế hoạch này triển khai hai tính năng bổ sung thiết yếu cho Atomic Recovery:
1. **Pomodoro Timer gắn với Task**: Tích hợp thanh đếm ngược Pomodoro toàn cục (sử dụng Zustand store để không bị gián đoạn khi chuyển tab), hỗ trợ 3 chế độ cài sẵn (Classic 25/5, Deep Focus 50/10, Sprint 15/3) và thời gian tùy chỉnh (Custom). Tích hợp bộ phát chuông "Ting" to, trong trẻo bằng Web Audio API thuần (chạy 100% offline). Ghi nhận số phiên Pomodoro hoàn thành trên từng Task trong cơ sở dữ liệu SQLite.
2. **Quản lý Mục tiêu Dài hạn (Long-term Goals) & Popup Nhắc Đến Hạn**: Mở rộng schema Prisma với bảng `goals`, xây dựng dịch vụ backend IPC tương ứng, thiết kế giao diện danh sách mục tiêu chuyên biệt và cơ chế kiểm tra tự động kích hoạt **Popup Modal nổi bật** khi mục tiêu đến hạn hoàn thành, cho phép người dùng đánh dấu hoàn thành hoặc gia hạn thời gian.

Tham khảo kiến trúc hệ thống và quy chuẩn mã nguồn tại `process/context/all-context.md` và quy trình kiểm thử tại `process/context/tests/all-tests.md`.

---

## Phase Completion Rules

- **Giai đoạn 1 (Database & Shared Types)**: Hoàn thành khi Prisma schema được cập nhật, migration/push thành công và shared types được khai báo đầy đủ mà không có lỗi TypeScript.
- **Giai đoạn 2 (Backend Services & IPC)**: Hoàn thành khi các dịch vụ `TaskService` (bổ sung Pomodoro) và `GoalService` cùng các kênh IPC tương ứng hoạt động trơn tru qua `preload`.
- **Giai đoạn 3 (Pomodoro Store & Web Audio Chime)**: Hoàn thành khi audio chime phát ra tiếng "Ting" to rõ ràng và Zustand store duy trì thời gian đếm ngược chính xác qua các lần chuyển trang.
- **Giai đoạn 4 (Task Pomodoro UI)**: Hoàn thành khi nút bắt đầu Pomodoro trên TaskCard kích hoạt thanh Pomodoro bar và số phiên Pomodoro được lưu vào DB.
- **Giai đoạn 5 (Long-term Goals UI & Due Popup)**: Hoàn thành khi người dùng có thể tạo/sửa/xóa mục tiêu và popup xuất hiện khi có mục tiêu đến hạn.
- **Quy tắc nghiệm thu cuối cùng (Final Sign-off)**: Chỉ đánh dấu `VERIFIED` khi toàn bộ kiểm thử TypeScript và thao tác thủ công được người dùng xác nhận đạt yêu cầu.

---

## Acceptance Criteria

### Phân hệ Pomodoro Task (AC-POMO)
- **AC-POMO-1**: Người dùng có thể khởi động Pomodoro từ bất kỳ thẻ Task nào; thanh điều khiển hiển thị tiêu đề task và chạy đếm ngược chính xác.
  - `proven by:` Kiểm tra liên kết giữa TaskCard và PomodoroBar qua Zustand store.
  - `strategy:` Fully-Automated
- **AC-POMO-2**: Hỗ trợ chuyển đổi mượt mà giữa các chế độ Classic (25/5), Deep Focus (50/10), Sprint (15/3) và Custom (người dùng tự nhập phút làm và nghỉ).
  - `proven by:` Unit test logic chuyển đổi preset và custom timer trong Zustand store.
  - `strategy:` Fully-Automated
- **AC-POMO-3**: Khi đếm ngược về `00:00` ở phiên làm việc, ứng dụng phát âm thanh chuông "Ting" to rõ ràng (Web Audio API), tăng số phiên hoàn thành của task trong DB và chuyển sang phiên nghỉ.
  - `proven by:` Kích hoạt timer hoàn thành, xác minh gọi `playTingSound()` và gọi IPC cập nhật `pomodoroSessions`.
  - `strategy:` Fully-Automated
- **AC-POMO-4**: Khi đếm về `00:00` ở phiên nghỉ, phát chuông "Ting" báo hiệu và chuyển sang trạng thái sẵn sàng cho phiên làm việc tiếp theo.
  - `proven by:` Kiểm tra sự kiện kết thúc phiên nghỉ ngơi.
  - `strategy:` Fully-Automated

### Phân hệ Mục tiêu Dài hạn & Popup (AC-GOAL)
- **AC-GOAL-1**: Người dùng tạo, xem, chỉnh sửa và xóa các mục tiêu dài hạn với các trường: `title`, `description`, `targetDate`, `category`, `status`.
  - `proven by:` Kiểm thử CRUD dịch vụ `GoalService` và API IPC.
  - `strategy:` Fully-Automated
- **AC-GOAL-2**: Danh sách mục tiêu hiển thị số ngày còn lại (Days Left) hoặc số ngày quá hạn (Days Overdue) kèm thanh phân loại trạng thái trực quan.
  - `proven by:` Unit test hàm tính khoảng cách ngày bằng `date-fns`.
  - `strategy:` Fully-Automated
- **AC-GOAL-3**: Khi khởi động ứng dụng hoặc sang ngày mới, nếu có mục tiêu `IN_PROGRESS` có `targetDate <= Hôm nay` chưa được thông báo, Popup Modal cảnh báo sẽ tự động hiển thị.
  - `proven by:` Kiểm thử query `getDueGoals` và kích hoạt `DueGoalModal` tại `App.tsx`.
  - `strategy:` Fully-Automated
- **AC-GOAL-4**: Trên Popup Modal, người dùng bấm "Đã hoàn thành!": mục tiêu đổi thành `COMPLETED`, lưu `completedAt`, đóng popup và tăng điểm danh tính.
  - `proven by:` Kiểm thử hành động `markCompleted` từ modal.
  - `strategy:` Fully-Automated
- **AC-GOAL-5**: Trên Popup Modal, người dùng bấm "Gia hạn thêm": cho phép chọn ngày đích mới, cập nhật `targetDate`, đổi trạng thái và đóng popup.
  - `proven by:` Kiểm thử hành động `extendTargetDate`.
  - `strategy:` Fully-Automated

---

## Implementation Checklist

### Bước 1: Schema Prisma & Shared Types
- [x] 1.1 Cập nhật `prisma/schema.prisma`:
  - Thêm trường `pomodoroSessions Int @default(0)` vào `model Task`.
  - Tạo mới `model Goal` với các trường: `id`, `title`, `description`, `category`, `targetDate`, `status`, `completedAt`, `notifiedAt`, `createdAt`, `updatedAt`.
- [x] 1.2 Chạy `npx prisma db push` hoặc tạo migration cập nhật database SQLite cục bộ.
- [x] 1.3 Tạo `src/shared/types/goal.types.ts` định nghĩa `Goal`, `GoalStatus`, `GoalCategory`, `CreateGoalDto`, `UpdateGoalDto`.
- [x] 1.4 Cập nhật `src/shared/types/task.types.ts` để bổ sung trường `pomodoroSessions?: number`.
- [x] 1.5 Cập nhật `src/shared/types/ipc.types.ts` để định nghĩa interface `GoalApi` và mở rộng `TaskApi`.

### Bước 2: Backend Services & IPC Handlers
- [x] 2.1 Cập nhật `src/main/services/task.service.ts`:
  - Thêm phương thức `incrementPomodoro(id: string): Promise<Task>`.
- [x] 2.2 Tạo mới `src/main/services/goal.service.ts`:
  - Triển khai `getAll()`, `getDueGoals()`, `create(dto)`, `update(id, dto)`, `delete(id)`, `markCompleted(id)`, `extendTargetDate(id, newDate)`, `markNotified(id)`.
- [x] 2.3 Tạo mới `src/main/ipc/goal.ipc.ts`:
  - Đăng ký các handler IPC `goal:getAll`, `goal:getDueGoals`, `goal:create`, `goal:update`, `goal:delete`, `goal:markCompleted`, `goal:extendTargetDate`, `goal:markNotified`.
- [x] 2.4 Cập nhật `src/main/ipc/task.ipc.ts`:
  - Thêm kênh IPC `task:incrementPomodoro`.
- [x] 2.5 Đăng ký `goal.ipc` trong `src/main/ipc/index.ts` và khởi tạo `GoalService`.
- [x] 2.6 Cập nhật `src/preload/index.ts` để expose `window.api.goal` và `window.api.task.incrementPomodoro`.

### Bước 3: Pomodoro State Store & Web Audio Chime Sound
- [x] 3.1 Tạo `src/renderer/src/lib/sound.ts`:
  - Viết hàm `playTingSound()` sử dụng Web Audio API thuần (`AudioContext`, OscillatorNode với dạng sóng kết hợp, GainNode suy giảm hàm mũ để tạo tiếng chuông "Ting" to, trong trẻo, tự giải phóng tài nguyên sau khi phát).
- [x] 3.2 Tạo `src/renderer/src/stores/usePomodoroStore.ts` (Zustand):
  - State: `activeTask: { id: string, title: string } | null`, `mode: 'WORK' | 'BREAK'`, `preset: 'CLASSIC' | 'DEEP' | 'SPRINT' | 'CUSTOM'`, `timeLeft: number`, `isRunning: boolean`, `customWork: number`, `customBreak: number`, `sessionsCompleted: number`.
  - Actions: `startTaskPomodoro(task)`, `toggleTimer()`, `resetTimer()`, `skipPhase()`, `setPreset(preset)`, `setCustomTime(workMin, breakMin)`, `tick()`.

### Bước 4: Giao Diện Pomodoro Task
- [x] 4.1 Tạo component `src/renderer/src/features/tasks/PomodoroBar.tsx`:
  - Thanh hiển thị cố định ở đáy ứng dụng hoặc trên đầu TasksPage khi có phiên Pomodoro đang kích hoạt.
  - Hiển thị: Icon cà chua/timer, tên task, đồng hồ số to bản `MM:SS`, nút Play/Pause, nút Reset, nút Skip, nút đổi Preset (Modal/Dropdown chỉnh Custom minutes), nút Đóng (ẩn thanh nhưng timer vẫn chạy nền).
- [x] 4.2 Cập nhật `src/renderer/src/features/tasks/TaskCard.tsx`:
  - Thêm nút hành động nhanh: Nút "Bắt đầu Pomodoro" (biểu tượng Timer/Play).
  - Hiển thị số phiên đã xong: Badge `🍅 {task.pomodoroSessions}` nếu `pomodoroSessions > 0`.
- [x] 4.3 Cập nhật `src/renderer/src/features/tasks/TaskModal.tsx`:
  - Thêm hiển thị thông tin số phiên Pomodoro đã hoàn thành và nút "Bắt đầu phiên cho task này".
- [x] 4.4 Đặt `PomodoroBar` vào `App.tsx` hoặc `MainLayout` để đồng hồ luôn hiện diện xuyên suốt mọi trang khi người dùng đang chạy Pomodoro.

### Bước 5: Giao Diện Quản Lý Mục Tiêu Dài Hạn (Goals)
- [x] 5.1 Tạo các component trong `src/renderer/src/features/goals/`:
  - `GoalCard.tsx`: Hiển thị thẻ mục tiêu, thanh tiến độ thời gian (số ngày còn lại/quá hạn), category badge, nút Hoàn thành/Gia hạn/Xóa.
  - `GoalModal.tsx`: Modal tạo mới và chỉnh sửa mục tiêu (Tiêu đề, Mô tả, Ngày hoàn thành, Danh mục).
  - `DueGoalModal.tsx`: Modal chúc mừng/nhắc nhở bật lên khi có mục tiêu đến hạn, có hiệu ứng Framer Motion nổi bật và 2 nút hành động (Hoàn thành / Gia hạn).
- [x] 5.2 Tạo trang `src/renderer/src/pages/GoalsPage.tsx`:
  - Bộ lọc danh mục (Tất cả, Đang thực hiện, Đã hoàn thành).
  - Thống kê nhanh: Tổng mục tiêu, Mục tiêu sắp đến hạn (trong 7 ngày), Mục tiêu đã hoàn thành.
  - Lưới danh sách `GoalCard`.
- [x] 5.3 Cập nhật Thanh điều hướng (`Sidebar.tsx`):
  - Thêm mục "Mục tiêu" (Goals) với biểu tượng `Target` hoặc `Trophy` từ `lucide-react`.
  - Cập nhật định tuyến trong `App.tsx` cho trang `/goals`.
- [x] 5.4 Tích hợp kiểm tra mục tiêu đến hạn trong `App.tsx`:
  - Khi App mount: gọi `window.api.goal.getDueGoals()`.
  - Nếu có kết quả: tự động mở `DueGoalModal` cho mục tiêu đầu tiên đến hạn.

### Bước 6: Kiểm Thử Tích Hợp & Rà Soát
- [x] 6.1 Chạy typecheck toàn diện: `npm run typecheck` (0 errors).
- [x] 6.2 Kiểm thử chạy dev: `npm run dev`, xác nhận âm thanh kêu "Ting" to rõ ràng, đồng hồ Pomodoro không bị reset khi chuyển trang.
- [x] 6.3 Thử nghiệm tạo Goal với targetDate là hôm nay và xác nhận `DueGoalModal` xuất hiện đúng yêu cầu.
- [x] 6.4 Đóng gói bộ cài Windows: `npm run build:win` thành công tạo file `dist/Atomic Recovery-Setup-0.1.0.exe` (190MB).

---

## Touchpoints

- `prisma/schema.prisma` — Cập nhật `model Task` và thêm `model Goal`
- `src/shared/types/task.types.ts` — Bổ sung `pomodoroSessions`
- `src/shared/types/goal.types.ts` — [NEW] Định nghĩa kiểu dữ liệu Goal
- `src/shared/types/ipc.types.ts` — Định nghĩa interface IPC cho Goal và Task
- `src/main/services/task.service.ts` — Bổ sung hàm tăng phiên Pomodoro
- `src/main/services/goal.service.ts` — [NEW] Dịch vụ quản lý Goal và Due Goals
- `src/main/ipc/task.ipc.ts` — Đăng ký channel `task:incrementPomodoro`
- `src/main/ipc/goal.ipc.ts` — [NEW] Đăng ký các channel IPC của Goal
- `src/main/ipc/index.ts` — Đăng ký `goal.ipc`
- `src/preload/index.ts` — Expose `api.goal` và hàm mới của `api.task`
- `src/renderer/src/lib/sound.ts` — [NEW] Bộ phát âm thanh chuông "Ting" Web Audio API
- `src/renderer/src/stores/usePomodoroStore.ts` — [NEW] Zustand store quản lý timer Pomodoro toàn cục
- `src/renderer/src/features/tasks/PomodoroBar.tsx` — [NEW] Thanh điều khiển Pomodoro gắn liền với Task
- `src/renderer/src/features/tasks/TaskCard.tsx` — Nút kích hoạt Pomodoro và badge phiên
- `src/renderer/src/features/tasks/TaskModal.tsx` — Thông tin Pomodoro của Task
- `src/renderer/src/features/goals/` — [NEW] `GoalCard.tsx`, `GoalModal.tsx`, `DueGoalModal.tsx`
- `src/renderer/src/pages/GoalsPage.tsx` — [NEW] Trang quản lý Mục tiêu dài hạn
- `src/renderer/src/components/layout/Sidebar.tsx` — Thêm nút điều hướng trang Goals
- `src/renderer/src/App.tsx` — Khởi tạo route Goals, nhúng `PomodoroBar` và `DueGoalModal`

---

## Public Contracts

### Task IPC Contract
```typescript
interface TaskApi {
  // Existing methods: getAll, getDashboardTasks, create, update, delete, updateOrder...
  incrementPomodoro: (id: string) => Promise<Task>;
}
```

### Goal IPC Contract
```typescript
interface GoalApi {
  getAll: () => Promise<Goal[]>;
  getDueGoals: () => Promise<Goal[]>;
  create: (data: CreateGoalDto) => Promise<Goal>;
  update: (id: string, data: UpdateGoalDto) => Promise<Goal>;
  delete: (id: string) => Promise<void>;
  markCompleted: (id: string) => Promise<Goal>;
  extendTargetDate: (id: string, newTargetDate: string) => Promise<Goal>;
  markNotified: (id: string) => Promise<Goal>;
}
```

### Pomodoro Store Contract
```typescript
interface PomodoroStore {
  activeTaskId: string | null;
  activeTaskTitle: string | null;
  mode: 'WORK' | 'BREAK';
  preset: 'CLASSIC' | 'DEEP' | 'SPRINT' | 'CUSTOM';
  timeLeft: number; // in seconds
  isRunning: boolean;
  customWorkMinutes: number;
  customBreakMinutes: number;
  sessionsCompleted: number;

  startForTask: (taskId: string, taskTitle: string) => void;
  toggle: () => void;
  reset: () => void;
  skip: () => void;
  setPreset: (preset: 'CLASSIC' | 'DEEP' | 'SPRINT' | 'CUSTOM') => void;
  setCustomTime: (work: number, breakTime: number) => void;
  tick: () => void;
  stop: () => void;
}
```

---

## Blast Radius

- **Phạm vi tác động**: Trung bình (Medium Risk).
- **Database**: Thêm 1 cột trên `tasks` (`pomodoroSessions`) có default = 0 nên hoàn toàn an toàn và không gây mất dữ liệu hiện có; thêm 1 bảng mới `goals` độc lập.
- **Frontend**: Tạo mới các store và component chuyên biệt; tác động lên `TaskCard`, `Sidebar` và `App.tsx` chỉ bổ sung thêm nút hoặc thanh popup, không làm hỏng logic hiện tại của Kanban board hay các trang khác.
- **Khả năng Rollback**: Dễ dàng khôi phục bằng Git commit trước đó mà không ảnh hưởng cấu trúc dữ liệu cũ.

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
| :--- | :--- | :--- |
| `npm run typecheck` (Node + Web) | Fully-Automated | Đảm bảo 100% type safety cho Prisma, IPC, DTOs và React components |
| Khởi động Pomodoro trên TaskCard & đếm ngược | Fully-Automated | Chứng minh AC-POMO-1 và AC-POMO-5 |
| Thay đổi Preset & Custom time cập nhật `timeLeft` | Fully-Automated | Chứng minh AC-POMO-2 |
| Chạy hết giờ làm việc: Kêu "Ting" + tăng `pomodoroSessions` | Fully-Automated | Chứng minh AC-POMO-3 |
| Chạy hết giờ nghỉ: Kêu "Ting" + sang phiên làm việc | Fully-Automated | Chứng minh AC-POMO-4 |
| CRUD Goal qua IPC và hiển thị trên `GoalsPage` | Fully-Automated | Chứng minh AC-GOAL-1 và AC-GOAL-2 |
| Mock `targetDate` = hôm nay, mở app hiển thị `DueGoalModal` | Fully-Automated | Chứng minh AC-GOAL-3 |
| Bấm "Đã hoàn thành" hoặc "Gia hạn" trên modal | Fully-Automated | Chứng minh AC-GOAL-4 và AC-GOAL-5 |

---

## Test Infra Improvement Notes

(none identified yet — dự án đang sử dụng TypeScript typecheck kết hợp các lệnh build cục bộ của electron-vite)

---

## Resume and Execution Handoff

1. **Selected plan file path**: `process/general-plans/active/task-pomodoro-and-goals_09-09-26/pomodoro-and-goals_PLAN_09-09-26.md`
2. **Last completed phase**: PLAN (Kế hoạch kỹ thuật đã hoàn thành)
3. **Validate-contract status**: pending (sẽ được viết trong giai đoạn VALIDATE)
4. **Supporting context files loaded**:
   - `process/context/all-context.md`
   - `process/context/tests/all-tests.md`
   - `process/general-plans/active/task-pomodoro-and-goals_09-09-26/pomodoro-and-goals_SPEC_09-09-26.md`
5. **Next step for a fresh agent picking up mid-execution**:
   - Tiến hành giai đoạn `VALIDATE` qua lệnh `ENTER VALIDATE MODE` để thẩm định plan và lập validate-contract trước khi mở khóa `EXECUTE`.

---

## Validate Contract

(placeholder — vc-validate-agent writes this section before EXECUTE)

---

## Next Step

Sau khi xem xét kế hoạch trên, vui lòng phản hồi:
- Nhập **`ENTER VALIDATE MODE`** để thẩm định kế hoạch và lập checklist kiểm thử tự động.
- Hoặc yêu cầu bổ sung/chỉnh sửa các mục kỹ thuật trong kế hoạch này nếu cần.
