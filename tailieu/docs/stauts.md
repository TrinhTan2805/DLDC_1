# BẢNG THEO DÕI TRẠNG THÁI MÃ NGUỒN (STATUS TRACKER)

**Hướng dẫn:** 
- Đánh dấu `[x]` vào chức năng nào bạn muốn **CHỌN SỬA HÔM NAY (WIP)**. 
- Những chức năng để trống `[ ]` sẽ tự động được coi là **ĐÃ CHỐT (LOCKED 🔒)**. Tôi (AI) sẽ tuyệt đối không chỉnh sửa code, layout hay logic của các chức năng bị khóa để đảm bảo an toàn cho phiên bản giao Dev.

---

## 1. PHÂN HỆ ĐĂNG NHẬP & CORE DATA
- `[ ]` Màn hình Đăng nhập & Quên mật khẩu (`login_screen.dart`)
- `[ ]` Cấu trúc Dữ liệu & State Management (`models.dart`, `app_provider.dart`)
- `[ ]` Dữ liệu giả lập - Mock Data (`mock_data.dart`)
- `[ ]` Khung Menu/Drawer chung & Chuyển đổi Lĩnh vực (`main.dart`, `globals.dart`)

## 2. PHÂN HỆ DASHBOARD TỔNG QUAN (ROLE-BASED)
- `[ ]` Dashboard dành cho Công ty / Tuần đường (`home_screen.dart`)
- `[ ]` Dashboard dành cho Ban Duy tu (`ban_dashboard_screen.dart`, `ban_dieu_hanh_screen.dart`)
- `[ ]` Dashboard dành cho Sở GTVT (`so_dashboard_screen.dart`)
- `[ ]` UI Component dùng chung (Header, Chart...) (`widgets/dashboard_header.dart`)

## 3. PHÂN HỆ TUẦN TRA (ĐA LĨNH VỰC)
- `[ ]` Giao diện Danh sách Lịch tuần & Tabs (`patrol_screen.dart`)
- `[ ]` Card Check-in động theo đối tượng (Hầm, Đèn, Cầu, Chòi gác...) (`patrol_modules.dart`)
- `[ ]` Bản đồ xem điểm Check-in thực địa (`patrol_modules.dart`)
- `[ ]` Nhật ký / Lịch sử Tuần tra của Nhân viên (`checkin_history_screen.dart`, `employee_history_screen.dart`)

## 4. PHÂN HỆ PHẢN ÁNH SỰ CỐ
- `[ ]` Danh sách Phản ánh & Bộ lọc tìm kiếm (`report_screen.dart`)
- `[ ]` Giao diện Chi tiết Phản ánh & Cập nhật trạng thái (`report_screen.dart`)
- `[ ]` Bản đồ Phản ánh sự cố (`report_screen.dart`)

## 5. PHÂN HỆ QUẢN LÝ BẢN ĐỒ KCHT (GIS)
- `[ ]` Bản đồ tổng hợp Tài sản (Đường bộ, Đường thủy, Đường sắt) (`map_screen.dart`)
- `[ ]` Thanh chọn & Lọc Tài sản (Filter / Search) (`map_screen.dart`)
- `[ ]` Card Thông tin Tài sản khi click vào Map (`map_screen.dart`)
- `[ ]` Chức năng Cập nhật tọa độ GPS từ thiết bị di động (`map_screen.dart`)
- `[ ]` Drawer cấu hình Lớp Bản đồ (`map_screen.dart`)

## 6. PHÂN HỆ DUY TU BẢO TRÌ
- `[x]` Danh sách Công việc & Menu Tabs (`maintenance_screen.dart`)
- `[ ]` Form Nhập liệu/Tạo mới yêu cầu Bảo trì (`maintenance_form_screen.dart`)
- `[ ]` Giao diện Chi tiết & Phê duyệt Công việc (`maintenance_detail_screen.dart`)

## 7. PHÂN HỆ QUẢN LÝ DỰ ÁN
- `[ ]` Dashboard Quản lý Dự án (`project_management_screen.dart`)

---
**Cam kết của AI:** Chỉ phân tích và thay đổi mã nguồn của những tệp liên quan trực tiếp đến các ô đã được bạn đánh dấu `[x]`. Mọi khu vực khác sẽ được đóng băng nguyên trạng!

---

## 8. QUY TẮC PHỐI HỢP DÀNH CHO TEAM (BAO GỒM DEV, PM VÀ AI)

Để đảm bảo source code không bị giẫm chân lên nhau khi có nhiều Dev và AI cùng tham gia, toàn bộ dự án thống nhất tuân thủ quy trình 4 bước sau:

**A. Đối với Project Manager (Người điều phối & Giao việc cho AI):**
1. **Chia để trị:** Mỗi tính năng giao cho Dev hoặc AI đều phải độc lập nhất có thể.
2. **Khóa File (Locking):** Khi Dev A đang làm tính năng X, PM không được phép đánh dấu `[x]` tính năng X trong file `stauts.md` để yêu cầu AI sửa. Tính năng nào giao cho con người thì AI phải tránh ra và ngược lại.
3. **Quản lý AI:** Chỉ mở `[x]` cho AI làm những task bạn trực tiếp giám sát. Sau khi AI làm xong và code chạy tốt, phải gỡ dấu `[x]` về `[ ]` để "khóa" chức năng đó lại, ngăn AI tự động sửa lây lan trong các phiên làm việc sau.

**B. Đối với Developer (Human Dev):**
1. **Branching (Chia nhánh Git):** Không bao giờ code trực tiếp trên nhánh `main`. Mỗi người nhận task phải tạo nhánh riêng (ví dụ: `feature/ten-chuc-nang`).
2. **Kế thừa AI:** Nếu Dev cần phát triển tiếp một tính năng do AI vừa làm, Dev phải tạo nhánh mới từ nhánh AI vừa commit.
3. **Pull Request (PR):** Mọi code đẩy lên (cả của Dev và code do AI sinh ra) đều phải tạo PR và có người review chéo trước khi merge vào bản chính.

**C. Đối với Trợ lý AI (Antigravity):**
1. **Tôn trọng `stauts.md` tuyệt đối:** Không bao giờ đọc, phân tích, hay sửa đổi bất kỳ tệp code nào không thuộc các tính năng đang có dấu `[x]`. 
2. **Hỏi trước khi vượt rào:** Nếu trong quá trình code tính năng `[x]` mà phát hiện cần phải chỉnh sửa một file chung (như `models.dart` hay `app_provider.dart` đang bị khóa `[ ]`), AI bắt buộc phải dừng lại và xin phép PM mở khóa.
3. **Báo cáo trung thực:** Mọi dòng code AI sinh ra hoặc sửa đổi đều phải được ghi chép vào `docs/log/log_update.md` để Human Dev có thể nắm được AI đã làm gì.

*(Chúng ta chốt nguyên tắc này nhé!)*
