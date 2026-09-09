# Đặc Tả Yêu Cầu Sản Phẩm (Product Specification)
# Chức Năng Pomodoro Task & Mục Tiêu Dài Hạn (Long-term Goals)

- **Mã kế hoạch:** `task-pomodoro-and-goals_09-09-26`
- **Tài liệu:** `pomodoro-and-goals_SPEC_09-09-26.md`
- **Giai đoạn RIPER-5:** SPEC (Khóa phạm vi nghiệp vụ và yêu cầu người dùng)
- **Ngày lập:** 09-09-2026
- **Trạng thái:** Chờ người dùng xét duyệt (Pending User Review)

---

## Summary

Bản đặc tả này xác định phạm vi và yêu cầu người dùng cho 2 tính năng nâng cao năng suất và duy trì động lực trong ứng dụng Atomic Recovery:
1. **Bộ đếm Pomodoro gắn liền với Task**: Hỗ trợ người dùng tập trung làm từng công việc cụ thể theo chu kỳ làm việc/nghỉ ngơi với các chế độ có sẵn (Classic 25/5, Deep Focus 50/10, Sprint 15/3) hoặc thời gian tùy chỉnh. Khi kết thúc chu kỳ, hệ thống sẽ phát âm thanh chuông "Ting" to rõ ràng để nhắc nhở chuyển đổi trạng thái mà không cần người dùng phải liên tục nhìn đồng hồ.
2. **Quản lý Mục tiêu Dài hạn & Popup Nhắc nhở Đúng Hạn**: Cho phép người dùng thiết lập các mục tiêu lớn trong cuộc sống kèm ngày hoàn thành kỳ vọng (Target Date). Khi đến ngày hoàn thành mục tiêu, ứng dụng sẽ tự động hiển thị Popup nổi bật để chúc mừng hoặc nhắc nhở đánh giá kết quả, khép lại vòng lặp thói quen tích cực.

---

## User Stories / Jobs To Be Done

### Nhóm tính năng 1: Pomodoro Timer cho Task
- **US-1 (Tập trung theo chu kỳ):** Là một người dùng đang có danh sách công việc cần làm, tôi muốn chọn một task và kích hoạt bộ đếm Pomodoro cho task đó, để tôi có thể tập trung tối đa trong một khoảng thời gian xác định mà không bị phân tâm.
- **US-2 (Lựa chọn chế độ linh hoạt):** Là một người dùng, tôi muốn dễ dàng chọn các mốc thời gian phổ biến (25 phút làm / 5 phút nghỉ, 50 phút / 10 phút, 15 phút / 3 phút) hoặc tự nhập số phút theo nhu cầu cá nhân, để phù hợp với độ dài và tính chất của từng công việc.
- **US-3 (Chuông báo âm thanh to rõ):** Là một người dùng đang tập trung làm việc hoặc đang đứng dậy thư giãn, tôi muốn nghe tiếng chuông "Ting" to rõ ràng ngay khi hết giờ làm việc hoặc hết giờ nghỉ, để tôi nhận biết chuyển đổi trạng thái ngay lập tức mà không cần nhìn chằm chằm vào màn hình.
- **US-4 (Ghi nhận tiến độ task):** Là một người dùng, tôi muốn thấy số phiên Pomodoro đã hoàn thành được cộng dồn vào task đó (ví dụ: đã xong 3/4 phiên Pomodoro), để tôi cảm thấy có thành tựu và theo dõi được công sức đã bỏ ra.

### Nhóm tính năng 2: Mục Tiêu Dài Hạn & Nhắc Nhở Đến Hạn
- **US-5 (Thiết lập mục tiêu dài hạn):** Là một người đang trong hành trình tái tạo bản thân và phục hồi, tôi muốn tạo các mục tiêu dài hạn (ví dụ: "Chạy cự ly 21km", "Đạt 90 ngày phục hồi hoàn toàn", "Đọc xong 12 cuốn sách") kèm ngày hoàn thành cụ thể, để có kim chỉ nam định hướng hành động mỗi ngày.
- **US-6 (Popup cảnh báo & đánh giá khi đến hạn):** Là một người dùng, khi mở ứng dụng vào đúng ngày (hoặc quá ngày) đã cam kết hoàn thành mục tiêu, tôi muốn một Popup xuất hiện nổi bật trên màn hình để chúc mừng hoặc hỏi tôi đã đạt được mục tiêu chưa, giúp tôi nhìn lại tiến trình của mình và không bị lãng quên mục tiêu đã đặt ra.
- **US-7 (Xử lý kết quả mục tiêu):** Khi popup hiện lên hoặc khi xem danh sách, tôi muốn có lựa chọn đánh dấu "Đã hoàn thành" (kèm điểm thưởng danh tính) hoặc "Gia hạn thêm thời gian" (chọn ngày đích mới) nếu cần thêm thời gian phấn đấu.

---

## What The User Wants (Behavioral Outcomes)

### 1. Trải nghiệm Pomodoro gắn với Task
- Trên giao diện Kanban / Danh sách Task:
  - Mỗi thẻ task (hoặc cửa sổ chi tiết task) có nút biểu tượng "Bắt đầu Pomodoro".
  - Khi bấm, một thanh điều khiển Pomodoro (Pomodoro Widget / Bar) nổi bật xuất hiện: hiển thị tên task đang làm, đồng hồ đếm ngược phút:giây, nhãn trạng thái hiện tại (`LÀM VIỆC` hoặc `NGHỈ NGƠI`).
  - Có menu/nút chuyển nhanh các chế độ:
    - **Classic**: 25 phút làm — 5 phút nghỉ
    - **Deep Focus**: 50 phút làm — 10 phút nghỉ
    - **Sprint**: 15 phút làm — 3 phút nghỉ
    - **Tùy chỉnh (Custom)**: Nhập số phút làm việc và số phút nghỉ tùy ý (1 – 120 phút).
  - Điều khiển: Nút Bắt đầu / Tạm dừng (Play/Pause), Nút Đặt lại (Reset), Nút Bỏ qua phiên (Skip to Next).
  - Hành vi khi hết thời gian:
    - Khi đếm ngược về `00:00`: Phát chuông âm thanh **"Ting"** to, vang, trong trẻo.
    - Hiển thị thông báo nhỏ hoặc đổi màu thanh Pomodoro sang chế độ nghỉ (Break).
    - Bộ đếm Pomodoro tự động chuyển trạng thái hoặc cho phép bấm bắt đầu phiên nghỉ.
    - Tăng số đếm quả cà chua / phiên Pomodoro hoàn thành trên task tương ứng.

### 2. Trải nghiệm Quản lý Mục Tiêu Dài Hạn & Popup Đến Hạn
- Giao diện quản lý Mục Tiêu (Long-term Goals):
  - Người dùng có thể xem danh sách các mục tiêu: Tiêu đề mục tiêu, mô tả/lý do, danh mục (Sức khỏe, Phục hồi, Công việc, Phát triển bản thân), ngày mục tiêu (Target Date), số ngày còn lại (hoặc số ngày quá hạn), trạng thái (Đang thực hiện, Đã đạt, Đã gia hạn).
  - Nút thêm mục tiêu mới với form nhập liệu đơn giản, nhanh chóng.
- Hành vi Popup khi đến ngày hoàn thành:
  - Khi người dùng khởi động ứng dụng (hoặc ứng dụng đang mở đến ngày hoàn thành của mục tiêu):
  - Ứng dụng kiểm tra và tự động bật **Popup Toàn màn hình/Modal nổi bật**:
    - Tiêu đề chúc mừng / nhắc nhở mốc thời gian: *"Hôm nay là ngày bạn đặt mục tiêu hoàn thành: [Tên mục tiêu]"*.
    - Hiển thị ngày bắt đầu và hành trình đã đi qua.
    - 2 Hành động rõ ràng:
      1. **"Tôi đã hoàn thành mục tiêu này! 🎉"**: Đổi trạng thái mục tiêu sang `COMPLETED`, ghi nhận điểm bầu cử danh tính (Identity Vote), phát hiệu ứng ăn mừng nhỏ.
      2. **"Cần thêm thời gian (Gia hạn) ⏳"**: Cho phép chọn ngày đích mới (Target Date) và tiếp tục hành trình.
      3. Nút đóng/nhắc lại sau.
  - Mỗi mục tiêu chỉ hiện popup một lần vào ngày đến hạn (trừ khi người dùng chọn nhắc lại sau hoặc mở trang mục tiêu).

---

## Flow / State Diagram

### Luồng 1: Vòng Lặp Pomodoro Task

```
[Danh sách Task / Kanban] 
          │
          ▼
   (Bấm "Start Pomodoro" trên Task)
          │
          ▼
┌─────────────────────────────────────────┐
│     Pomodoro Widget / Controller        │
│ - Task: [Tiêu đề task]                  │
│ - Chọn Preset: 25/5 | 50/10 | 15/3 | Custom │
└─────────────────────────────────────────┘
          │
          ▼
   [Đang làm việc (Work Phase) - Đếm ngược] ──(Tạm dừng/Tiếp tục)
          │
          ▼ (Đếm về 00:00)
   🔊 PHÁT TIẾNG CHUÔNG "TING" TO + Thông báo hết giờ làm việc
   - Tăng số Pomodoro hoàn thành cho Task (+1)
          │
          ▼
   [Đang nghỉ ngơi (Break Phase) - Đếm ngược]
          │
          ▼ (Đếm về 00:00)
   🔊 PHÁT TIẾNG CHUÔNG "TING" TO + Thông báo hết giờ nghỉ
          │
          ▼
   (Sẵn sàng cho phiên làm việc tiếp theo)
```

### Luồng 2: Mục Tiêu Dài Hạn & Popup Nhắc Đến Hạn

```
[Người dùng] ──► Tạo mục tiêu dài hạn ──► Lưu (Tên, Target Date, Danh mục)
                                                   │
                                                   ▼
                                         [Lưu trữ cục bộ SQLite]
                                                   │
    Mỗi khi mở App / Đầu ngày mới                  │
          │                                        │
          ▼                                        │
   [Kiểm tra ngày hiện tại >= Target Date?] ◄──────┘
          │
     ┌────┴────────────────────────┐
     │ Có mục tiêu đến hạn         │ Không có
     ▼                             ▼
┌───────────────────────────┐   (Vào App bình thường)
│  POPUP NHẮC NHỞ ĐẾN HẠN   │
│ "Hôm nay là hạn chót của: │
│       [Tên mục tiêu]      │
│ Bạn đã đạt được chưa?"    │
└─────────────┬─────────────┘
              │
     ┌────────┴───────────────────────────┐
     ▼                                    ▼
[Tôi đã hoàn thành!]              [Cần thêm thời gian]
- Chuyển trạng thái COMPLETED     - Mở ô chọn ngày mới (Reschedule)
- Hiệu ứng chúc mừng              - Cập nhật Target Date
- Bỏ phiếu Identity Vote          - Đóng Popup
```

---

## Acceptance Criteria (Testable Outcomes)

### Nhóm AC-POMO: Bộ đếm Pomodoro cho Task
- **AC-POMO-1**: Người dùng có thể khởi động Pomodoro từ một task cụ thể; bộ đếm hiển thị chính xác tên task đang thực hiện.
  - `proven by:` Test kịch bản chọn task và bắt đầu đếm giờ Pomodoro trên giao diện Task.
  - `strategy:` Fully-Automated
- **AC-POMO-2**: Người dùng có thể chuyển đổi giữa các chế độ có sẵn (25/5, 50/10, 15/3) và cài đặt thời gian tùy chỉnh (custom work/break); đồng hồ cập nhật đúng số phút tương ứng.
  - `proven by:` Test chuyển đổi preset và nhập số phút custom (ví dụ 30m work / 7m break).
  - `strategy:` Fully-Automated
- **AC-POMO-3**: Khi bộ đếm về `00:00` ở phiên làm việc, ứng dụng phát âm thanh chuông "Ting" to rõ ràng (âm lượng đủ lớn, không phụ thuộc mạng internet), chuyển sang phiên nghỉ và tăng số đếm Pomodoro hoàn thành của task lên 1.
  - `proven by:` Test kích hoạt sự kiện kết thúc đếm ngược, kiểm tra bộ phát âm thanh Web Audio và cập nhật biến đếm số phiên.
  - `strategy:` Fully-Automated
- **AC-POMO-4**: Khi bộ đếm về `00:00` ở phiên nghỉ, ứng dụng phát âm thanh chuông "Ting" to rõ ràng và thông báo sẵn sàng cho phiên làm việc mới.
  - `proven by:` Test hoàn thành phiên nghỉ ngơi và xác nhận âm thanh chuông phát ra.
  - `strategy:` Fully-Automated
- **AC-POMO-5**: Người dùng có thể tạm dừng (pause), tiếp tục (resume), đặt lại (reset) và chuyển đổi trạng thái thủ công bất kỳ lúc nào.
  - `proven by:` Test các nút điều khiển Play/Pause/Reset.
  - `strategy:` Fully-Automated

### Nhóm AC-GOAL: Mục Tiêu Dài Hạn & Popup Đến Hạn
- **AC-GOAL-1**: Người dùng có thể tạo mục tiêu dài hạn mới với các trường: Tiêu đề, Mô tả/Động lực, Ngày mục tiêu hoàn thành (Target Date), Danh mục.
  - `proven by:` Test tạo mục tiêu dài hạn và kiểm tra dữ liệu lưu thành công.
  - `strategy:` Fully-Automated
- **AC-GOAL-2**: Danh sách mục tiêu hiển thị đầy đủ các mục tiêu đang theo đuổi, tính toán trực quan số ngày còn lại đến hạn (hoặc số ngày đã quá hạn).
  - `proven by:` Test tính toán khoảng cách ngày từ ngày hiện tại đến Target Date.
  - `strategy:` Fully-Automated
- **AC-GOAL-3**: Khi ngày hiện tại bằng hoặc sau ngày Target Date của mục tiêu đang kích hoạt (chưa hoàn thành), Popup thông báo đến hạn tự động hiển thị khi người dùng vào ứng dụng.
  - `proven by:` Test kiểm tra điều kiện kích hoạt Popup thông báo mục tiêu đến hạn với mock ngày tháng.
  - `strategy:` Fully-Automated
- **AC-GOAL-4**: Người dùng có thể bấm "Tôi đã hoàn thành" trên Popup; mục tiêu được chuyển thành `COMPLETED`, lưu thời điểm hoàn thành và không hiện popup nhắc lại nữa.
  - `proven by:` Test hành động xác nhận hoàn thành từ popup và xác minh trạng thái mục tiêu.
  - `strategy:` Fully-Automated
- **AC-GOAL-5**: Người dùng có thể bấm "Gia hạn thêm thời gian" trên Popup, chọn ngày đích mới; mục tiêu cập nhật lại ngày hoàn thành mới và ẩn popup.
  - `proven by:` Test hành động gia hạn và kiểm tra Target Date mới được cập nhật.
  - `strategy:` Fully-Automated

---

## Out Of Scope

Những nội dung sau **chưa/không** nằm trong phạm vi của 2 chức năng này:
1. **Đồng bộ hóa đám mây (Cloud Sync)**: Ứng dụng tiếp tục tuân thủ nghiêm ngặt mô hình Local-first, dữ liệu lưu hoàn toàn trên máy người dùng (SQLite).
2. **Khóa ứng dụng / chặn website bên ngoài trong giờ Pomodoro**: Không can thiệp vào tiến trình của hệ điều hành bên ngoài Electron app.
3. **Liên kết với Google Calendar / Outlook**: Không đồng bộ sự kiện lịch ra ứng dụng ngoài.
4. **Chia sẻ mục tiêu lên mạng xã hội**: Giữ kín 100% tính riêng tư cho người dùng.

---

## Constraints

1. **Local-First & Offline**: Toàn bộ dữ liệu mục tiêu và phiên Pomodoro phải hoạt động hoàn hảo khi không có internet.
2. **m thanh chuông độc lập**: m thanh chuông "Ting" không được tải từ link online; phải được tạo qua Web Audio API (AudioContext synthesizer) hoặc nhúng file âm thanh cục bộ trong project để luôn kêu to và không bao giờ bị lỗi do mất mạng.
3. **Hiệu năng Timer nền**: Timer Pomodoro phải chạy ổn định ngay cả khi người dùng chuyển sang tab khác trong ứng dụng.
4. **Tính tương thích giao diện**: Phù hợp với ngôn ngữ thiết kế tối (Dark Mode), bảng màu chủ đạo (Indigo/Brand) và các thư viện hiện có (`framer-motion`, `radix-ui`, `lucide-react`, `tailwindcss v4`).

---

## Open Questions

None (Tất cả các câu hỏi nghiệp vụ chính đã được định hình rõ ràng theo mô tả của người dùng; các lựa chọn kiến trúc kỹ thuật chi tiết sẽ được xử lý ở giai đoạn INNOVATE & PLAN tiếp theo).

---

## Background / Research Findings

- **Codebase hiện tại**:
  - Module Task đã có giao diện Kanban (`KanbanBoard`, `TaskCard`, `TaskModal`) và dịch vụ IPC hoàn chỉnh (`TaskService`, `window.api.task`). Thẻ `Task` trong Prisma đã có sẵn các trường `id, title, description, status, priority, order, completedAt`.
  - Trang `IdentityPage` hiện đã có khái niệm `FutureSelf` và `IdentityStatement`, rất thuận tiện để người dùng gắn kết Mục tiêu dài hạn với việc định hình nhân dạng (Identity Shift).
  - Web Audio API trong trình duyệt Electron có thể dễ dàng tạo âm thanh chuông "Ting" chuẩn xác (sine/bell wave decay với tần số ~800Hz - 1200Hz) với độ trễ 0ms và âm lượng tùy chỉnh.
