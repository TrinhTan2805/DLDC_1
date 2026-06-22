# Lịch sử phiên bản (Changelog)

## v2.5.0 (2026-06-22)
- **Phân hệ Dữ liệu mở — Công bố & Thiết lập**:
  - Xây dựng hoàn thiện luồng thiết lập và công bố dữ liệu mở: thông tin mô tả, phê duyệt, quản lý trạng thái công bố.
  - Bổ sung trang Danh mục dữ liệu mở với inner menu phân cấp, đa tab (Thông tin, Tệp đính kèm, Lịch sử phiên bản), bảng grid danh sách và modal chi tiết.
  - Tích hợp trang danh sách Danh mục dữ liệu mở với tìm kiếm, lọc nâng cao và xem chi tiết.
- **Phân hệ Dữ liệu mở — Thống kê & Báo cáo (`OpenDataReportPage`)**:
  - Tab Tìm kiếm và lọc: Bổ sung sắp xếp cột (tăng/giảm) và phân trang cho bảng danh sách dataset.
  - Tab Báo cáo thống kê: Redesign bộ lọc thiết lập báo cáo — nhóm theo chủ đề/cơ quan/giấy phép/khoảng thời gian; MultiSelect đa lựa chọn; logic deferred render (chỉ hiển thị sau khi nhấn Tạo báo cáo); 4 thẻ KPI luôn hiển thị phía trên bộ lọc; ExportDropdown xuất Excel/PDF.
  - Tab Báo cáo phân loại: Redesign đồng bộ với Báo cáo thống kê; phân loại theo nguồn cung cấp (CSDL đích), chủ đề, định dạng chia sẻ (File Excel/API); biểu đồ tròn và biểu đồ cột song song.
  - Tab Thống kê lượt truy cập: Bộ lọc nhóm theo khoảng thời gian (từ tháng/năm — đến tháng/năm), loại người dùng (6 loại), nguồn truy cập (CSDL đích), loại dữ liệu chia sẻ; biểu đồ đồng bộ theo nhóm lọc (LineChart/BarChart); bảng Cảnh báo truy cập vượt ngưỡng với cấu hình ngưỡng động.
  - Áp dụng thống nhất pattern applied-states và ExportDropdown cho tất cả 4 tab.
- **Quản lý người dùng & Nhật ký hệ thống**:
  - Cập nhật giao diện Quản lý người dùng và Nhật ký hoạt động hệ thống.
  - Sửa lỗi biên dịch tại `ConfigChangeLogPage.tsx` và `AccountManagementLogPage.tsx`.

## v2.4.8 (2026-06-17)
- **Đồng bộ luồng và cấu hình dữ liệu**:
  - Lưu trữ và đồng bộ hóa danh sách dịch vụ, phân quyền và tài khoản vào `localStorage`.
  - Cấu hình cho modal API cung cấp (`ProvisionApiModal`) tự động truy vấn đơn vị nhận mặc định từ các dịch vụ đã thiết lập.
  - Thêm tính năng Xem chi tiết API cung cấp dữ liệu ở chế độ chỉ đọc và nút Chỉnh sửa tài khoản.
  - Tối ưu hóa UI/UX: Ẩn thanh lọc tại Phân quyền, thay thế dropdown đơn vị bằng input text tự do, và loại bỏ cột API được phép gọi.
  - Chuyển đổi các thông báo xác nhận App Key sang Custom Modal UI an toàn và hỗ trợ sao chép Key mới.
- **Breadcrumb & Điều hướng (Routing)**:
  - Bổ sung Breadcrumb phân cấp chi tiết cho toàn bộ các trang Cung cấp dữ liệu.
  - Đồng bộ hóa trạng thái Tab với URL Query Parameter `tab` trong trang Thiết lập dịch vụ, Quản lý API, và Dịch vụ chia sẻ.
- **Thiết kế lại trang Yêu cầu sử dụng dữ liệu (`DataProvisionRequestPage`)**:
  - Chuyển thanh Tab chính ra ngoài card, thêm icons và số lượng bản ghi.
  - Đồng bộ hóa bảng dữ liệu (cỡ chữ 13px, hover style) và tích hợp thanh phân trang.
  - Áp dụng quy tắc 5.4 Hộp thoại (z-index 999999, backdrop `bg-black/50`) cho tất cả các modal nghiệp vụ (bàn giao, công khai, phê duyệt).
- **Kiểm soát & Giám sát cung cấp (`DataProvisionMonitoringPage`)**:
  - Chuyển đổi màu sắc chủ đạo từ cam/hổ phách sang xanh dương thương hiệu (`#2563eb`).
  - Tích hợp thanh phân trang cho bảng chi tiết lưu lượng và bảng Audit logs.
  - Ép font chữ hiển thị về `13px` cho toàn trang và các modal liên quan.
  - Áp dụng quy tắc 5.4 Hộp thoại cho modal chi tiết logs và modal xuất báo cáo.
- **Dịch vụ chia sẻ & Sửa lỗi React Error #31**:
  - Khắc phục triệt để lỗi React crash Error #31 tại modal Cấu hình trường bằng cách gỡ bỏ toán tử dấu phẩy dư thừa `, document.body` ở câu lệnh `return` trong `SharedFieldsConfigModal.tsx`.
  - Thiết kế lại giao diện của modal Cấu hình trường và trang Dịch vụ chia sẻ sang tông màu xanh dương và cỡ chữ 13px đồng bộ.

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
