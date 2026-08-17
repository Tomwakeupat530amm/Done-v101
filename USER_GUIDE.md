# 📖 HƯỚNG DẪN SỬ DỤNG — ATOMIC RECOVERY

> **Atomic Recovery** là ứng dụng hỗ trợ phục hồi và xây dựng thói quen cá nhân dựa trên triết lý *Atomic Habits* (James Clear), hoạt động hoàn toàn **Offline (Local-first)** với độ bảo mật và quyền riêng tư 100%.

---

## 📑 MỤC LỤC
1. [Khởi Động & Tổng Quan Giao Diện](#1-khởi-động--tổng-quan-giao-diện)
2. [Phím Tắt Nhanh (Keyboard Shortcuts)](#2-phím-tắt-nhanh)
3. [Chi Tiết Các Tính Năng](#3-chi-tiết-các-tính-năng)
   - [3.1. Trang Chủ (Dashboard)](#31-trang-chủ-dashboard)
   - [3.2. Đếm Ngày Phục Hồi (Recovery & Sobriety)](#32-đếm-ngày-phục-hồi-recovery--sobriety)
   - [3.3. Quản Lý Thói Quen (Habits)](#33-quản-lý-thói-quen-habits)
   - [3.4. Nhật Ký & Cảm Xúc (Journal & Mood)](#34-nhật-ký--cảm-xúc-journal--mood)
   - [3.5. Định Hình Bản Thân (Identity Engine)](#35-định-hình-bản-thân-identity-engine)
   - [3.6. Thống Kê & Phân Tích (Analytics)](#36-thống-kê--phân-tích-analytics)
   - [3.7. Chế Độ Khẩn Cấp (Emergency Protocol - SOS)](#37-chế-độ-khẩn-cấp-emergency-protocol---sos)
   - [3.8. Cài Đặt & Bảo Mật (Settings & Security)](#38-cài-đặt--bảo-mật-settings--security)
4. [Mẹo & Thực Hành Tốt Nhất (Best Practices)](#4-mẹo--thực-hành-tốt-nhất)

---

## 1. KHỞI ĐỘNG & TỔNG QUAN GIAO DIỆN

### Khởi động ứng dụng
- **Môi trường phát triển:** Chạy lệnh `npm run dev` trong thư mục dự án.
- **Bản cài đặt:** Nhấp đúp vào biểu tượng ứng dụng **Atomic Recovery**.

### Cấu trúc giao diện
- **Thanh tiêu đề (TitleBar):** Tuỳ chỉnh gọn gàng, hỗ trợ kéo thả cửa sổ và các nút thu nhỏ / phóng to / đóng.
- **Thanh điều hướng (Sidebar):** Nằm ở cạnh trái giúp chuyển nhanh giữa các mô-đun chức năng.
- **Vùng làm việc chính (Main Content):** Hiển thị nội dung chi tiết theo từng trang.
- **Nút SOS Khẩn cấp:** Nút màu đỏ nổi bật ở góc hoặc thanh bên để mở ngay chế độ hỗ trợ khi gặp cơn thôi thúc (urge).

---

## 2. PHÍM TẮT NHANH (KEYBOARD SHORTCUTS)

| Phím tắt (Windows/Linux) | Phím tắt (macOS) | Hành động |
| :--- | :--- | :--- |
| `Ctrl + E` | `Cmd + E` | **Kích hoạt chế độ khẩn cấp (Emergency Mode)** |
| `Ctrl + 1` | `Cmd + 1` | Mở trang **Tổng quan (Dashboard)** |
| `Ctrl + 2` | `Cmd + 2` | Mở trang **Phục hồi (Recovery)** |
| `Ctrl + 3` | `Cmd + 3` | Mở trang **Thói quen (Habits)** |
| `Ctrl + 4` | `Cmd + 4` | Mở trang **Nhật ký & Cảm xúc (Journal)** |
| `Ctrl + 5` | `Cmd + 5` | Mở trang **Bản sắc cá nhân (Identity)** |
| `Ctrl + 6` | `Cmd + 6` | Mở trang **Thống kê (Analytics)** |
| `Ctrl + ,` | `Cmd + ,` | Mở trang **Cài đặt (Settings)** |

---

## 3. CHI TIẾT CÁC TÍNH NĂNG

### 3.1. Trang Chủ (Dashboard)
- **Đồng hồ đếm Sobriety:** Theo dõi số ngày, giờ, phút bạn đã kiên trì vượt qua cơn nghiện/thói quen xấu.
- **Nhiệm vụ hôm nay:** Danh sách nhanh các thói quen cần hoàn thành trong ngày.
- **Trạng thái cảm xúc:** Nhanh chóng ghi lại cảm xúc hiện tại chỉ bằng 1 cú nhấp.
- **Câu danh ngôn truyền cảm hứng:** Động lực mỗi ngày nhắc nhở bạn về mục tiêu hướng tới.

---

### 3.2. Đếm Ngày Phục Hồi (Recovery & Sobriety)
1. **Thiết lập ngày bắt đầu:** Bạn có thể thiết lập ngày giờ bắt đầu hành trình phục hồi.
2. **Cột mốc (Milestones):** Tự động mở khoá huy hiệu khi đạt 1 ngày, 3 ngày, 1 tuần, 1 tháng, 90 ngày, 1 năm,...
3. **Lướt qua cơn thèm (Urge Surfing):** Công cụ đếm ngược 15-20 phút kết hợp kỹ thuật thở chánh niệm để giúp não bộ vượt qua đỉnh điểm của cơn thôi thúc mà không cần thỏa hiệp.
4. **Nhật ký tái phát (Relapse Log):** Nếu lỡ vấp ngã:
   - Ghi lại nguyên nhân (Trigger), bối cảnh, cảm xúc lúc đó.
   - Ứng dụng xem đây là **dữ liệu bài học**, không phán xét, giúp bạn rút kinh nghiệm cho lần tiếp theo.

---

### 3.3. Quản Lý Thói Quen (Habits)
Dựa trên **4 Quy luật thay đổi hành vi** (Make it Obvious, Attractive, Easy, Satisfying):
1. **Thêm thói quen mới:**
   - Chọn loại: **Thói quen tốt** (Xây dựng) hoặc **Thói quen xấu** (Cần loại bỏ).
   - Thiết lập gợi ý (Cue), sự khao khát (Craving), phản ứng (Response), và phần thưởng (Reward).
   - Thiết lập quy tắc 2 phút (*Two-Minute Rule*) và chồng thói quen (*Habit Stacking*).
2. **Điểm danh hàng ngày:** Tích chọn hoàn thành để duy trì chuỗi (Streak).
3. **Lịch nhiệt (Streak Heatmap):** Quan sát trực quan tần suất thực hiện thói quen theo tuần/tháng.

---

### 3.4. Nhật Ký & Cảm Xúc (Journal & Mood)
1. **Theo dõi cảm xúc (Mood Tracker):**
   - Đánh giá từ 1 đến 5 sao / biểu tượng cảm xúc (Rất tệ ➔ Tuyệt vời).
   - Đánh giá mức năng lượng (Energy Level).
   - Gắn thẻ nguyên nhân (Công việc, Gia đình, Sức khoẻ, Mối quan hệ,...).
2. **Nhật ký buổi sáng (Morning Intention):** Đặt mục tiêu và định hướng tâm lý cho ngày mới.
3. **Nhật ký buổi tối (Evening Reflection):** Đánh giá những điều làm tốt, điều biết ơn và bài học rút ra.
4. **Tự động lưu (Auto-save):** Mọi văn bản nhập vào đều được tự động lưu cục bộ theo thời gian thực.

---

### 3.5. Định Hình Bản Thân (Identity Engine)
> *"Mỗi hành động bạn làm là một lá phiếu bầu cho con người bạn muốn trở thành."* — James Clear

1. **Khẳng định danh tính (Identity Statements):**
   - Đặt câu khẳng định: ví dụ *"Tôi là một người điềm tĩnh, tự chủ và biết chăm sóc sức khoẻ bản thân."*
2. **Bỏ phiếu hành động (Identity Votes):**
   - Mỗi lần hoàn thành một thói quen tích cực hoặc vượt qua một cơn thèm, bạn đã bỏ 1 lá phiếu củng cố danh tính mới.
   - Theo dõi tổng số phiếu bầu để thấy sự chuyển hóa của bản thân qua thời gian.

---

### 3.6. Thống Kê & Phân Tích (Analytics)
- **Tương quan Cảm xúc & Phục hồi:** Xem xu hướng tâm trạng của bạn có cải thiện tỉ lệ thuận với số ngày kiên trì không.
- **Biểu đồ thói quen:** Tỉ lệ hoàn thành thói quen theo tuần/tháng.
- **Phân tích yếu tố kích hoạt (Trigger Analysis):** Nhận diện các khung giờ, địa điểm hoặc cảm xúc dễ dẫn đến cám dỗ nhất để có phương án phòng tránh chủ động.

---

### 3.7. Chế Độ Khẩn Cấp (Emergency Protocol - SOS)
Khi gặp cơn thôi thúc dồn dập hoặc nguy cơ tái phát cao:
1. Nhấn **`Ctrl + E`** (hoặc nút SOS).
2. Màn hình can thiệp toàn diện sẽ xuất hiện:
   - **Bài tập thở 4-7-8:** Hít vào 4 giây ➔ Giữ 7 giây ➔ Thở ra 8 giây để giảm nhịp tim và làm dịu hệ thần kinh.
   - **Kỹ thuật tiếp đất 5-4-3-2-1:** Đưa tâm trí về thực tại.
   - **Thẻ lý do kiên trì:** Đọc lại các lý do lớn nhất tại sao bạn bắt đầu hành trình này.
   - **Liên hệ khẩn cấp:** Gọi nhanh người hỗ trợ (Sponsor/Người thân) hoặc đường dây nóng trợ giúp.

---

### 3.8. Cài Đặt & Bảo Mật (Settings & Security)
1. **Khoá mã PIN:**
   - Đặt mã PIN 4-6 số để khoá ứng dụng khi rời máy tính, bảo vệ sự riêng tư tuyệt đối cho nhật ký của bạn.
2. **Sao lưu & Khôi phục (Backup & Export):**
   - Xuất toàn bộ dữ liệu ra file `.json` để lưu trữ dự phòng.
   - Nhập lại dữ liệu khi đổi máy tính.
3. **Tuỳ biến giao diện:** Tuỳ chọn màu sắc điểm nhấn (Accent Color) yêu thích.

---

## 4. MẸO & THỰC HÀNH TỐT NHẤT (BEST PRACTICES)

1. **Bắt đầu thật nhỏ:** Đừng cố thay đổi tất cả cùng lúc. Hãy tạo 1-2 thói quen chỉ mất dưới 2 phút mỗi ngày.
2. **Không bỏ lỡ 2 lần liên tiếp:** Nếu lỡ quên hoặc trượt chân 1 ngày, hãy quay lại ngay vào ngày hôm sau.
3. **Dùng phím tắt `Ctrl + E` phản xạ:** Hãy tập mở chế độ khẩn cấp bất cứ khi nào thấy tâm trí bắt đầu dao động.
4. **Dữ liệu an toàn:** Vì ứng dụng lưu trữ hoàn toàn trên máy tính của bạn (`dev.db` hoặc thư mục `AppData`), định kỳ hãy vào Cài đặt và bấm **Xuất dữ liệu** để lưu trữ một bản sao nhé!
