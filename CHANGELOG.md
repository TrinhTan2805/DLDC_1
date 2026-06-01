# Lịch sử phiên bản (Changelog)

## v0.1.4 (2024-05-29)
- Bỏ nút Kết xuất tại các màn xem dữ liệu thu thập; Bỏ 2 tab Thiết lập dịch vụ, Nhật ký đối soát, bỏ 2 button Xuất báo cáo và Đồng bộ thủ công tại mục Đối soát dữ liệu thu thập; Đồng bộ giao diện Đối soát dữ liệu thu thập; Sửa logic Quản lý người dùng theo yêu cầu đã trao đổi, đồng bộ và rà soát màn hình Cấu hình hệ thống, Quản lý nhật ký; Sửa lại màn Xem biểu đồ thống kê.

## v0.1.3 (2024-05-27)
- **Tính năng**: 
  - Gộp Bước 1 (Phân quyền chức năng/Menu) và Bước 2 (Phân quyền thao tác) thành một màn hình chung trong quá trình phân quyền nhóm người dùng.
- **Sửa lỗi & Cải thiện (Bug fixes & Improvements)**:
  - Khắc phục lỗi TypeScript khi duyệt mảng `members` trong `GroupManagementPage.tsx`.
  - Khắc phục các cảnh báo Accessibility (a11y) về việc thiếu `aria-label` và `title` trên các form input và button trong `GroupManagementPage.tsx`, `FunctionManagementPage.tsx`, `RoleManagementPage.tsx`.
  - Khôi phục giao diện theo yêu cầu thiết kế ban đầu sau khi review.
