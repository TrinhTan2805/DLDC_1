# Lịch sử phiên bản (Changelog)

## v2.4.7 (2026-06-16)
- **Phân hệ Cung cấp dữ liệu (Màn hình Quản lý API cung cấp & đối soát)**:
  - Thiết kế lại giao diện trang Quản lý API Cung cấp & Đối soát, chuyển Tab chính ra ngoài card, collapsible panel bộ lọc, đồng bộ bảng danh sách, và tích hợp thanh phân trang.
  - Thay đổi font hiển thị trạng thái badge thành chữ thường (font-normal).
  - Bổ sung thanh cuộn dọc (180px) và thanh tìm kiếm nhanh cho danh sách dịch vụ API; loại bỏ cột "Phạm vi quyền (Scopes)" và nút Cấp quyền trùng lặp.
  - Cập nhật modal Cấp quyền truy cập: màu xanh dương chủ đạo, nhãn dạng font-medium, và bỏ bắt buộc nhập trường "Hiệu lực đến ngày".
  - Trường Đơn vị thụ hưởng trong modal Cấp quyền đổi sang checkboxes dạng danh sách cuộn có tìm kiếm nhanh, nút chọn tất cả, và tự động khóa các đơn vị mặc định dịch vụ.
  - Thêm trường IP Whitelist hỗ trợ nhập nhiều IP phân tách bằng dấu phẩy.
- **Phân hệ Cung cấp dữ liệu (Màn hình Thiết lập dịch vụ cung cấp)**:
  - Redesign trang phẳng hiện đại, chuyển tab ra ngoài card, thiết kế lại stat cards và bộ lọc.
  - Bổ sung nút Xóa cho dịch vụ Bản nháp, Chờ phê duyệt, Từ chối kèm modal xác nhận.
  - Tinh chỉnh tab Công khai dịch vụ: Đổi tên trạng thái sang "Đang công khai", thay thế nút chi tiết bằng Eye icon, hiển thị luôn nút Công khai (Share2) và khóa khi đã công khai.
  - Nâng cấp modal cấu hình/phê duyệt dịch vụ: tăng z-index che phủ sidebar, font-size 13px, bỏ tab Lịch sử và chuyển nút Trình duyệt sang tab Phân quyền.
- **Tối ưu hóa mock dữ liệu và Hệ thống hộp thoại**:
  - Áp dụng `ReactDOM.createPortal` cho toàn bộ 27 modal lên body để giải quyết lỗi che phủ sidebar.
  - Mock dữ liệu API Hộ tịch có nhiều đơn vị nhận và hiển thị dạng danh sách badge xám chỉ đọc trong modal.

## v0.1.6 (2026-06-02)
- **Tính năng & Giao diện (UI/UX)**:
  - **Màn hình Cung cấp dữ liệu theo yêu cầu**: Chuẩn hóa hệ thống icon Thao tác theo quy định:
    - Bàn giao dữ liệu: Đổi sang icon `Send` (Indigo).
    - Tiếp nhận: Hiển thị icon `CheckCircle` (Amber) cho trạng thái "Chờ xử lý" đồng bộ trên cả tab Tiếp nhận và Tra cứu.
    - Thiết lập kết xuất: Cập nhật icon `Settings` tại tab "Tra cứu & Kết xuất" với tooltip "Thiết lập kết xuất".
    - Xem chi tiết: Cập nhật nút thao tác thành icon `Eye` dạng Ghost (không viền) tại tab "Tiếp nhận yêu cầu" với tooltip "Xem chi tiết".
  - **Modal Tạo yêu cầu kết xuất dữ liệu**:
    - Bổ sung trường chọn "Người chủ quản dữ liệu".
    - Bổ sung và căn chỉnh các tiêu đề (label) cho các trường nhập liệu, có đánh dấu bắt buộc (`*`).
    - Đổi tên nút xử lý thành "Tạo và gửi yêu cầu", đồng thời tích hợp logic tự động vô hiệu hóa (disable) khi chưa điền đủ các thông tin bắt buộc.

## v0.1.5 (2026-06-01)
- **Tính năng & Giao diện**:
  - Nâng cấp giao diện Modal Thiết lập dịch vụ cung cấp sang Dark Theme chuyên nghiệp.
  - Thêm cột "Ngày công khai" vào bảng danh sách dịch vụ tại màn hình thiết lập.
  - Cải tiến quy trình kết xuất dữ liệu: Thay thế tính năng tải xuống trực tiếp bằng Modal cấu hình kết xuất nhiều bước (`ProvisionRequestExportModal`).
  - Cập nhật chức năng Bàn giao dữ liệu tại tab "Bàn giao dữ liệu" trong trang Cung cấp dữ liệu theo yêu cầu (Hỗ trợ chọn đơn vị nhận và đính kèm file biên bản bàn giao).

## v0.1.4 (2024-05-29)
- Bỏ nút Kết xuất tại các màn xem dữ liệu thu thập; Bỏ 2 tab Thiết lập dịch vụ, Nhật ký đối soát, bỏ 2 button Xuất báo cáo và Đồng bộ thủ công tại mục Đối soát dữ liệu thu thập; Đồng bộ giao diện Đối soát dữ liệu thu thập; Sửa logic Quản lý người dùng theo yêu cầu đã trao đổi, đồng bộ và rà soát màn hình Cấu hình hệ thống, Quản lý nhật ký; Sửa lại màn Xem biểu đồ thống kê.

## v0.1.3 (2024-05-27)
- **Tính năng**: 
  - Gộp Bước 1 (Phân quyền chức năng/Menu) và Bước 2 (Phân quyền thao tác) thành một màn hình chung trong quá trình phân quyền nhóm người dùng.
- **Sửa lỗi & Cải thiện (Bug fixes & Improvements)**:
  - Khắc phục lỗi TypeScript khi duyệt mảng `members` trong `GroupManagementPage.tsx`.
  - Khắc phục các cảnh báo Accessibility (a11y) về việc thiếu `aria-label` và `title` trên các form input và button trong `GroupManagementPage.tsx`, `FunctionManagementPage.tsx`, `RoleManagementPage.tsx`.
  - Khôi phục giao diện theo yêu cầu thiết kế ban đầu sau khi review.
