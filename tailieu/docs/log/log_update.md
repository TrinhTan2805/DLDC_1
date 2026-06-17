# Nhật ký cập nhật hệ thống (Changelog)
 
## Phiên bản 2.4.9 (Ngày cập nhật: 17/06/2026)

**Nội dung thay đổi:**
1. Thêm Breadcrumb và định tuyến chi tiết (Routing) cho toàn bộ phân hệ Cung cấp dữ liệu (Data Provision):
   - Cập nhật hàm trợ giúp `getBreadcrumbPath` trong `MainLayout.tsx` để nhận thêm tham số `search` (URL Query Params).
   - Thiết lập cấu trúc breadcrumb phân cấp chi tiết cho tất cả các trang cung cấp dữ liệu:
     - Dashboard cung cấp dữ liệu (`provision-dashboard`): `['Cung cấp dữ liệu', 'Tổng quan Cung cấp']`.
     - Thiết lập điều phối dữ liệu (`provisioning-service-setup`): Phân cấp cụ thể theo tab đang hoạt động (`tab=setup` -> Cấu hình/Thiết lập dịch vụ, `tab=approve` -> Kiểm tra & Phê duyệt, `tab=publish` -> Công khai dịch vụ).
     - Quản lý API cung cấp & đối soát (`provisioning-api-management`): Phân cấp cụ thể theo tab đang hoạt động (`tab=api_cung_cap` -> API Cung cấp dữ liệu, `tab=api_doi_soat` -> API Đối soát dữ liệu, `tab=phan_quyen` -> Phân quyền truy cập, `tab=danh_sach_tai_khoan` -> Danh sách tài khoản).
     - Đối soát cung cấp (`reconciliation-<id>`): `['Cung cấp dữ liệu', 'Đối soát cung cấp', 'Chi tiết đối soát #<id>']`.
     - Danh sách dịch vụ cung cấp theo danh mục/nhóm (`provisioning-catalog-*`, `provisioning-shared-*`, `provisioning-internal-*`): Phân cấp đến từng danh mục, nhóm dữ liệu và theo dõi tab chi tiết (`tab=du_lieu` -> Dữ liệu cung cấp, `tab=api` -> Quản lý API đang lấy dữ liệu).
   - Đồng bộ trạng thái Tab với URL Query Parameter `tab` trong `DataProvisionServiceSetupPage.tsx` và `DataProvisionApiManagementPage.tsx` bằng cách khởi tạo state từ URL và cập nhật URL bằng `useNavigate` khi chuyển đổi tab.
   - Đồng bộ trạng thái Tab chi tiết gói tin chia sẻ với URL Query Parameter `tab` trong `DataProvisionServicesPage.tsx`.
2. Thiết kế lại Modal So sánh/Xem chi tiết phiên bản API (`ApiVersionCompareModal.tsx`):
   - Thiết kế lại giao diện theo bố cục song song: Cấu trúc phiên bản cũ (`versionB`) bên trái, Cấu trúc phiên bản mới (`versionA`) bên phải.
   - Loại bỏ hoàn toàn dòng mô tả (description) dưới tên các trường thuộc tính và cột trạng thái (status column) để giao diện tối giản, rõ ràng theo yêu cầu.
   - Mỗi bên hiển thị 2 cột thông tin chính: Trường thuộc tính (Property Name) và Kiểu dữ liệu/Cấu trúc (Data Type) nằm ngang cạnh nhau (sử dụng layout Flexbox `w-1/2` thay vì CSS Grid bị rớt dòng chồng lên nhau).
   - Căn chỉnh thẳng hàng chính xác giữa các dòng thuộc tính đối chiếu bằng cấu trúc lưới grid đồng bộ, chèn các placeholder chỉ rõ trường được thêm mới ở phiên bản mới hoặc bị lược bỏ ở phiên bản cũ.
   - Thay đổi kiểu dáng nút "Đóng so sánh": Đổi từ màu đen sang màu xanh biển chủ đạo của hệ thống (`bg-blue-600` / `hover:bg-blue-700`) và chuyển định dạng chữ từ in đậm (`font-bold`) thành bình thường (`font-medium`).
   - Sửa lỗi truyền nhận tham số (`versionA` và `versionB`) từ modal lịch sử (`ProvisionVersionHistoryModal.tsx`) giúp hiển thị chính xác tên phiên bản được so sánh.
3. Cập nhật thiết kế modal So sánh phiên bản API (`ApiVersionCompareModal.tsx`):
   - Đổi màu nền và màu chữ của icon `GitCompare` ở tiêu đề từ màu cam (`bg-amber-50 text-amber-600 border-amber-100`) sang màu xanh dương (`bg-blue-50 text-blue-600 border-blue-100`).
   - Đổi toàn bộ các văn bản, nhãn thông tin và giá trị so sánh trong modal về màu đen (`text-black`).

**Các file bị ảnh hưởng:**
- `src/components/layout/MainLayout.tsx`
- `src/components/pages/provisioning/DataProvisionServiceSetupPage.tsx`
- `src/components/pages/provisioning/DataProvisionApiManagementPage.tsx`
- `src/components/pages/provisioning/DataProvisionServicesPage.tsx`
- `src/components/pages/provisioning/modals/ApiVersionCompareModal.tsx`

## Phiên bản 2.4.8 (Ngày cập nhật: 17/06/2026)

**Nội dung thay đổi:**
1. Đồng bộ luồng và cấu hình dữ liệu giữa "Thiết lập điều phối dữ liệu" (Service Setup) và "Quản lý API cung cấp & đối soát" (API Management):
   - Lưu trữ và đồng bộ hóa danh sách dịch vụ (`provision_services`), phân quyền (`provision_permissions`), và tài khoản (`provision_accounts`) vào `localStorage`.
   - Cấu trúc lại trường "Cơ quan/Đơn vị nhận" (Tab Phân quyền truy cập trong modal Thiết lập dịch vụ `ProvisionServiceModal.tsx`) để tải động danh sách đơn vị thụ hưởng từ danh sách "Đơn vị được cấp quyền" tại tab Danh sách tài khoản (`provision_accounts` trong localStorage).
   - Tự động điền dữ liệu `consumerUnit` (Đơn vị nhận mặc định) của dịch vụ khi khởi tạo, đồng thời đồng bộ hóa các đơn vị nhận mặc định sang tab Phân quyền truy cập và Danh sách tài khoản khi người dùng chọn API tương ứng.
   - Cập nhật modal tạo tài khoản mới (`ProvisionAccountModal.tsx`) để lấy danh sách đơn vị từ tài khoản hiện tại kết hợp danh sách đơn vị mặc định của hệ thống.
   - Cấu hình cho modal API cung cấp (`ProvisionApiModal.tsx`) tự động truy vấn đơn vị nhận mặc định từ các dịch vụ đã được thiết lập để hiển thị dưới dạng badge chỉ đọc (read-only) tương ứng khi chọn hoặc chỉnh sửa API.
2. Thêm tính năng Xem chi tiết API cung cấp dữ liệu:
   - Bổ sung nút Xem chi tiết (icon Eye) trước nút Sửa thông tin API trong bảng danh sách API cung cấp dữ liệu.
   - Thiết lập trạng thái `apiModalMode` ('view' / 'edit') để mở modal `ProvisionApiModal` ở chế độ chỉ đọc khi nhấn nút Xem chi tiết.
   - Vô hiệu hóa tất cả các trường dữ liệu và file đính kèm, thay thế nút Lưu cấu hình bằng nút Đóng trong footer modal khi ở chế độ xem chi tiết.
   - Sửa lỗi chính tả class `bg-slate-55` thành `bg-slate-50` cho phần select dịch vụ trong modal khi bị disabled.
3. Loại bỏ thanh tìm kiếm tại màn Phân quyền truy cập:
   - Ẩn toàn bộ phần thanh tìm kiếm & bộ lọc (`Filters and Actions` row) của màn hình Quản lý API khi chuyển sang tab "Phân quyền truy cập" (`activeTab === 'phan_quyen'`) để tối ưu hóa không gian hiển thị và tránh dư thừa giao diện.
4. Cập nhật trường Authorization trong modal Cấp quyền truy cập API (`ProvisionAccessControlModal.tsx`):
   - Đổi tên nhãn trường từ "Authorization Token (riêng cho từng đơn vị) *" thành "Tài khoản (Username)".
   - Khóa không cho phép người dùng nhập/chỉnh sửa, tự động tra cứu hiển thị tài khoản (username) tương ứng với từng đơn vị thụ hưởng được chọn từ Danh sách tài khoản (`provision_accounts` trong localStorage).
5. Loại bỏ cột trạng thái tại danh sách đơn vị được cấp quyền trong Phân quyền truy cập:
   - Xóa cột "Trạng thái" khỏi bảng danh sách đơn vị thụ hưởng đã được cấp quyền truy cập API và điều chỉnh `colSpan` của bảng từ 6 xuống 5 để căn chỉnh giao diện chuẩn xác.
6. Loại bỏ trường API được phép truy cập/gọi trong Danh sách tài khoản và modal Tạo tài khoản:
   - Xóa trường select "API được phép truy cập *" khỏi giao diện modal Tạo tài khoản mới (`ProvisionAccountModal.tsx`).
   - Xóa cột "API được phép gọi" khỏi bảng danh sách tài khoản tại tab "Danh sách tài khoản" (`activeTab === 'danh_sach_tai_khoan'`) và chuyển `colSpan` bảng từ 7 về 6 để giao diện hiển thị chính xác.
7. Thay đổi phương thức khai báo Đơn vị được cấp quyền trong modal Tạo tài khoản:
   - Đổi thẻ `<select>` chọn danh sách đơn vị thành thẻ `<input type="text">` nhập tay tự do trong modal `ProvisionAccountModal.tsx` để người dùng linh hoạt điền tên đơn vị.
8. Bỏ in đậm tiêu đề các trường tại modal Tạo tài khoản:
   - Thay đổi font chữ của các thẻ `<label>` từ in đậm (`font-semibold`) thành bình thường (`font-medium`) cho cả 3 trường thông tin trong modal `ProvisionAccountModal.tsx` để đồng bộ chuẩn thiết kế labels của hệ thống.
9. Bổ sung nút Chỉnh sửa tài khoản tại tab Danh sách tài khoản:
   - Thêm nút Chỉnh sửa tài khoản (icon Edit màu đen) vào cột Thao tác của bảng tài khoản.
   - Thêm trạng thái `selectedAccount` để lưu trữ dữ liệu tài khoản được chọn chỉnh sửa và truyền vào `ProvisionAccountModal`.
   - Cập nhật modal `ProvisionAccountModal` hỗ trợ nạp dữ liệu khi chỉnh sửa (đổi tiêu đề thành "Cập nhật tài khoản API" và nút thành "Lưu thay đổi") và xử lý callback `onSave` để cập nhật trực tiếp vào danh sách.
10. Sửa lỗi hiển thị che phủ của Modal Xác nhận làm mới App Key và Kết quả Key mới:
    - Chuyển đổi hai hộp thoại này sang sử dụng `createPortal` để render trực tiếp vào `document.body`.
    - Thiết lập thuộc tính `zIndex: 999999` và class `z-[999999]` tương ứng để che phủ hoàn toàn, đảm bảo hiển thị trên cùng và trên cả thanh menu sidebar bên trái.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionServiceSetupPage.tsx`
- `src/components/pages/provisioning/DataProvisionApiManagementPage.tsx`
- `src/components/pages/provisioning/modals/ProvisionServiceModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionApiModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccessControlModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccountModal.tsx`

## Phiên bản 2.4.5 — Patch 9 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
1. Ép kích thước font chữ về `13px` cho màn hình danh sách chính và tất cả các modal trong mục **Quản lý API cung cấp & Đối soát** > **API cung cấp dữ liệu** (ngoại trừ phần tiêu đề header và các hình vẽ/icons vector):
   - Thêm lớp CSS định danh `api-management-page-root` và thẻ `<style>` inline vào [DataProvisionApiManagementPage.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/DataProvisionApiManagementPage.tsx) để triệt tiêu kích thước font 14px kế thừa từ các lớp Tailwind (`text-sm`).
   - Thêm lớp CSS định danh tương ứng cho từng root portal div của các modal.
   - Thêm thẻ `<style>` inline áp dụng bộ lọc loại trừ các thẻ `h1` đến `h6` và các tag đồ họa vector (`svg`, `path`, `circle`, `rect`, `polyline`, `line`).
2. Áp dụng quy tắc hộp thoại 5.4 trong [compomennt.md](file:///f:/BTP/DLDC_1/tailieu/docs/compomennt.md) cho tất cả các modal trong màn hình này:
   - Cập nhật màu nền backdrop chuẩn `bg-black/50` (loại bỏ màu `bg-slate-900/50 backdrop-blur-sm` không đồng bộ).
   - Nâng giá trị `z-index` của các modal lên cao nhất bằng cách thiết lập cả lớp Tailwind `z-[999999]` và style inline `style={{ zIndex: 999999 }}` cho phần tử root của các modal nhằm triệt tiêu hoàn toàn lỗi hiển thị phía sau thanh menu sidebar bên trái.
   - Các modal được cập nhật bao gồm:
     - [ProvisionApiModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/modals/ProvisionApiModal.tsx)
     - [ProvisionReconciliationApiModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/modals/ProvisionReconciliationApiModal.tsx)
     - [ProvisionAccessControlModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/modals/ProvisionAccessControlModal.tsx)
     - [ProvisionVersionHistoryModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/modals/ProvisionVersionHistoryModal.tsx)
     - [ApiVersionCompareModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/modals/ApiVersionCompareModal.tsx)
     - [ProvisionAccountModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/modals/ProvisionAccountModal.tsx)
3. Tinh chỉnh thiết kế hàng thao tác (Action Columns) và các popup thông báo:
   - Thay thế nút hành động "Tạm ngưng" và "Kích hoạt" màu sắc cũ (cam/xanh lá) bằng thiết kế màu đen (`text-black hover:bg-slate-100`) đồng bộ.
   - Thay thế icon chỉnh sửa cũ `Edit3` bằng icon `Edit` chuẩn chung hệ thống.
   - Xây dựng Custom Modal Xác nhận trạng thái (`statusConfirmData`) sử dụng `createPortal` để thay thế cho hộp thoại `window.confirm` mặc định của trình duyệt khi người dùng thay đổi trạng thái hoạt động (Tạm ngưng / Kích hoạt) của API hoặc tiến trình đối soát.
4. Chuyển đổi trường "Cơ quan/Đơn vị nhận" trong modal thêm mới/sửa cấu hình API cung cấp ([ProvisionApiModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/modals/ProvisionApiModal.tsx)) thành trường Chỉ xem (Read-only / Disabled). Giá trị của trường này được tự động trích xuất từ cấu hình mặc định tương ứng của dịch vụ API được chọn, hiển thị dưới dạng danh sách các nhãn tag (Badge) màu xám nhạt (`bg-slate-200`) không thể chỉnh sửa hay gỡ bỏ để trình bày trực quan và rõ ràng nhất kể cả khi có nhiều đơn vị nhận.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionApiManagementPage.tsx`
- `src/components/pages/provisioning/modals/ProvisionApiModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionReconciliationApiModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccessControlModal.tsx`

## Phiên bản 2.4.6 — Patch 2 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
1. Hỗ trợ hiển thị và khóa các đơn vị thụ hưởng mặc định trong modal Cấp quyền truy cập API (`ProvisionAccessControlModal.tsx`): Nếu đơn vị đã được thiết lập/cấu hình từ trước khi thiết lập dịch vụ API (dưới trường `consumerUnit`), đơn vị đó sẽ luôn hiển thị ở trạng thái đã tích chọn và bị khóa (disabled / read-only), không cho phép người dùng chỉnh sửa hoặc bỏ chọn. Đồng thời, hiển thị thêm nhãn nhãn "Mặc định dịch vụ" bên cạnh các đơn vị này.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionApiManagementPage.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccessControlModal.tsx`

## Phiên bản 2.4.6 — Patch (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
1. Bổ sung trường cấu hình "Danh sách IP Whitelist" trong modal Cấp quyền truy cập API (`ProvisionAccessControlModal.tsx`), hỗ trợ nhập nhiều IP phân tách bằng dấu phẩy. Nếu để trống, hệ thống sẽ mặc định gán là "Tất cả IP" để tối ưu hóa khả năng kết nối linh hoạt.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/modals/ProvisionAccessControlModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionVersionHistoryModal.tsx`
- `src/components/pages/provisioning/modals/ApiVersionCompareModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccountModal.tsx`

## Phiên bản 2.4.5 — Patch 8 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
1. Redesign giao diện trang **Quản lý API Cung cấp & Đối soát** ([DataProvisionApiManagementPage.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/DataProvisionApiManagementPage.tsx)) đồng bộ theo chuẩn thiết kế của màn **Thiết lập điều phối dữ liệu**:
   - Chuyển thanh Tab chính (`api_cung_cap`, `api_doi_soat`, `phan_quyen`, `danh_sach_tai_khoan`) ra bên ngoài container chính với đường viền dưới mỏng (`border-b border-slate-200`) và indicator xanh dương (`border-b-2 border-blue-600 text-blue-600`).
   - Tái cấu trúc thanh tìm kiếm & bộ lọc (`Search` button, `Filter` button) và các nút hành động (Tạo API cung cấp mới, Tạo API đối soát mới, Cấp quyền mới, Tạo tài khoản mới).
   - Thiết kế lại panel bộ lọc collapsible cho tab API cung cấp và API đối soát.
   - Đồng bộ hóa các bảng dữ liệu: header màu xám nhạt (`bg-slate-50`), cỡ chữ `13px`, icons thao tác được hiển thị đầy đủ và sạch đẹp hơn.
2. Tích hợp tính năng phân trang (`renderPagination`) ở cuối mỗi bảng danh sách cho tất cả các tab phẳng.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionApiManagementPage.tsx`

## Phiên bản 2.4.5 — Patch 7 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
1. Tại tab **Công khai dịch vụ** của màn hình **Thiết lập điều phối dữ liệu** (`DataProvisionServiceSetupPage.tsx`), thay thế nút "Chi tiết API" dạng chữ bằng icon Xem chi tiết (`Eye` icon) đồng bộ.
2. Thiết lập hiển thị luôn luôn cho nút **Công khai** (`Share2` icon) tại danh sách dịch vụ của tab Công khai dịch vụ, đồng thời khóa (disabled) và làm mờ nút này khi dịch vụ đang ở trạng thái **Đang công khai** (`published`).
3. Đổi tên trạng thái dịch vụ từ **Đang hoạt động** thành **Đang công khai** ở phần thẻ thống kê (stat card), bộ lọc trạng thái và cột trạng thái trong bảng dịch vụ.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionServiceSetupPage.tsx`

## Phiên bản 2.4.5 — Patch 6 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
1. Tăng `z-index` của modal chỉnh sửa & xem chi tiết dịch vụ (`ProvisionServiceModal.tsx`) và modal phê duyệt dịch vụ (`ProvisionServiceApprovalModal.tsx`) lên `z-[999999]`, đồng thời bổ sung inline style `style={{ zIndex: 999999 }}` để đảm bảo cả hai modal hiển thị che phủ hoàn toàn lên trên thanh menu sidebar bên trái.
2. Ép kích thước font chữ về `13px` cho tất cả các chữ trong modal `ProvisionServiceModal.tsx` (trừ các tiêu đề header h1-h6 và icons) để đồng bộ hoàn toàn hệ thống thiết kế font chữ.
3. Loại bỏ thông báo cảnh báo màu vàng "Chế độ xem — Không thể chỉnh sửa" ở phần đầu nội dung khi mở modal ở chế độ xem chi tiết (`isViewMode`).
4. Thay thế phụ đề "API Provisioning Engine" thành "Điều phối dữ liệu", đồng thời tăng cỡ chữ của tiêu đề "Xem chi tiết Dịch vụ / Cấu hình Dịch vụ" lên `16px` và in đậm (bold).
5. Điều chỉnh các tab điều hướng dọc: Căn lề trái (`text-left`), bỏ định dạng chữ đậm (`font-normal` thay cho `font-bold`), và quy về cỡ chữ `13px`.
6. Cập nhật nhãn trường nhập (labels) không in đậm (`font-normal`/`font-medium`), bỏ chế độ tự động viết hoa (uppercase) để giữ kiểu nguyên bản (Sentence case).
7. Đồng bộ màu sắc đường viền input/select/textarea khi focus: Đổi sang màu xanh dương đậm (`#2563eb`) và thêm viền bóng mờ nhẹ, chuyển background sang màu trắng nổi bật.
8. Gỡ bỏ tab **Lịch sử** (History) ra khỏi danh sách tab và nội dung hiển thị trong modal.
9. Di chuyển nút **Trình duyệt** (Submit Approval) từ tab Lịch sử sang tab cuối cùng hiện tại là **Phân quyền truy cập** (Access Control), đồng thời cập nhật thanh tiến trình hiển thị chỉ còn 4 bước (Step 1-4 of 4).
10. Ép kích thước chữ xuống `13px` cho toàn bộ danh sách thẻ dịch vụ tại màn hình **Kiểm tra & Phê duyệt** (trừ tiêu đề `h3`), và áp dụng quy tắc tương tự (ép về `13px` ngoại trừ tiêu đề `h2` header) cho modal phê duyệt (`ProvisionServiceApprovalModal.tsx`).
11. Bổ sung cấu hình `setServiceModalMode('view')` khi người dùng nhấn button **Kiểm tra** để đảm bảo mở modal ở chế độ Xem chi tiết (read-only), không cho phép thao tác hay chỉnh sửa dữ liệu.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionServiceSetupPage.tsx`
- `src/components/pages/provisioning/modals/ProvisionServiceModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionServiceApprovalModal.tsx`

## Phiên bản 2.4.5 — Patch 5 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
Redesign UI màn hình **Cung cấp dữ liệu > Thiết lập điều phối dữ liệu** (`DataProvisionServiceSetupPage.tsx`) theo phong cách của mục **Thiết lập thu thập** (`CollectionSetupPage.tsx`):
1. **Thanh tab:** Di chuyển thanh tab phẳng ra ngoài card và thêm biểu tượng (lucide icons) cho 3 tab nghiệp vụ hiện tại.
2. **Thẻ thống kê:** Thiết kế lại 4 stat cards (Tổng số API, Đang hoạt động, Chờ phê duyệt, Đã từ chối) dạng phẳng, bo góc, có background và icon màu nhẹ đồng bộ.
3. **Thanh tìm kiếm & Hành động:** Xóa icon tìm kiếm trong ô nhập, thêm nút Search, nút Filter đồng bộ; di chuyển nút "+ Tạo API Cung cấp mới" xuống hàng tìm kiếm bên phải.
4. **Bảng Grid & Thao tác:** Đồng bộ CSS header, dòng, và trạng thái badge; sửa màu nút chỉnh sửa (Edit) thành màu đen và chuyển sang icon Edit chuẩn.
5. **Nút Xóa dịch vụ:** Bổ sung nút Xóa (Trash2 đỏ) cho các dịch vụ ở trạng thái Bản nháp, Chờ phê duyệt, Từ chối, mở modal xác nhận xóa dạng overlay chuẩn.
6. **Phân trang:** Thêm logic và UI điều khiển phân trang.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionServiceSetupPage.tsx`

## Phiên bản 2.4.5 — Patch 4 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
Sửa lỗi modal không che phủ sidebar khi mở từ màn hình Cung cấp dữ liệu:
1. Nguyên nhân: `position: fixed` bị giới hạn trong stacking context của `MainLayout` (do `overflow-hidden` trên flex container), khiến backdrop chỉ phủ vùng nội dung bên phải, không che sidebar.
2. Giải pháp: Áp dụng `ReactDOM.createPortal(JSX, document.body)` cho toàn bộ 27 modal trong thư mục `provisioning/modals/`. Portal render modal trực tiếp vào `<body>`, bỏ qua mọi stacking context cha, `fixed inset-0 z-[9999]` phủ đúng toàn viewport.
3. Mỗi file được bổ sung `import { createPortal } from 'react-dom';` và đổi `return (JSX)` → `return createPortal(JSX, document.body)`.

**Các file bị ảnh hưởng (27 modal):**
- `src/components/pages/provisioning/modals/AccessControlModal.tsx`
- `src/components/pages/provisioning/modals/ApiSelectionModal.tsx`
- `src/components/pages/provisioning/modals/ApiVersionCompareModal.tsx`
- `src/components/pages/provisioning/modals/CalculatedFieldModal.tsx`
- `src/components/pages/provisioning/modals/PacketDesignModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccessControlModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccountModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionApiDetailModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionApiModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionDataRequestModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionExportReportModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionHandoverDetailModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionPublishDetailModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionReconciliationApiModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionReconciliationDetailsModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionRequestApprovalModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionRequestExportModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionRequestHandoverModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionServiceApprovalModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionServiceModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionServicePublicDetailsModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionServicePublishModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionServiceUnpublishModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionVersionHistoryModal.tsx`
- `src/components/pages/provisioning/modals/RecordDetailModal.tsx`
- `src/components/pages/provisioning/modals/SharedFieldsConfigModal.tsx`
- `src/components/pages/provisioning/modals/SubmitApprovalModal.tsx`

---

## Phiên bản 2.4.5 — Patch 3 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
Áp dụng quy tắc **5.4 Hộp thoại** (`compomennt.md`) cho modal Phê duyệt / Từ chối tại tab **Kiểm tra & Phê duyệt**:
1. Backdrop đúng chuẩn: `bg-black/50` (thay `bg-slate-900/50 backdrop-blur-sm`).
2. Z-index đúng quy tắc 4.2: `z-[100]` (thay `z-50`).
3. Tiêu đề top-left và nút đóng X top-right đã đúng chuẩn, giữ nguyên.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/modals/ProvisionServiceApprovalModal.tsx`

---

## Phiên bản 2.4.5 — Patch 2 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
Redesign thanh tìm kiếm & bộ lọc tại tab **Kiểm tra & Phê duyệt** trong `ServiceSetupPageUpdated.tsx` theo chuẩn thiết kế tab Thiết lập dịch vụ:
1. Thay thế subtab buttons + search box cũ bằng layout `flex items-center justify-between` + collapsible filter panel.
2. Bổ sung 4 bộ lọc: **Trạng thái** (pending/approved/rejected), **Phân loại dữ liệu**, **Tần suất**, **Giao thức**.
3. Thêm fields `category`, `frequency`, `protocol` vào `ApprovalRequest` interface và mock data.
4. Cập nhật logic `filteredApprovals` để lọc theo tất cả 4 tiêu chí mới.
5. Xóa state `approvalSubTab` không còn dùng.

**Các file bị ảnh hưởng:**
- `src/components/pages/orchestration/ServiceSetupPageUpdated.tsx`

---

## Phiên bản 2.4.5 — Patch (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
Redesign UI màn hình **Cung cấp dữ liệu > Thiết lập điều phối dữ liệu** (`ServiceSetupPageUpdated.tsx`) theo chuẩn thiết kế của `CollectionSetupPage.tsx`:
1. **Thanh tab:** Cập nhật wrapper `bg-white border-b border-slate-200 px-6`, mỗi tab dùng `border-b-2` indicator với active state `border-blue-600 text-blue-600`.
2. **Thẻ header (stat cards):** Grid 4 cột với container `bg-white rounded-lg border border-slate-200 p-4`, icon `p-2 bg-blue-50 rounded-lg w-5 h-5`.
3. **Thanh tìm kiếm + Button:** Layout `flex items-center justify-between`, search input với icon, toggle bộ lọc, button "Thêm mới" (primary) và "Kết xuất" (secondary).
4. **Bộ lọc:** Collapsible panel `bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-6 gap-4 shadow-sm`, 3 select: Trạng thái / Loại dịch vụ / Phân loại.
5. **Bảng grid:** Container `shadow-sm`, thead `sticky top-0 z-[1]`, th `font-bold text-slate-500 whitespace-nowrap text-[13px]`, action buttons `rounded-lg`, map trên `paginatedServices`.
6. **Thanh phân trang:** Items-per-page select (10/20/50/100), hiển thị tổng bản ghi, navigation Trước/số trang/Sau.

**State mới thêm:** `showFilters`, `currentPage`, `itemsPerPage`.
**Computed mới:** `paginatedServices`.

**Các file bị ảnh hưởng:**
- `src/components/pages/orchestration/ServiceSetupPageUpdated.tsx`

---

## Phiên bản 2.4.5 (Ngày cập nhật: 15/06/2026)

**Nội dung thay đổi:**
1. **Tinh gọn giao diện Tab Danh sách tài khoản:** Gỡ bỏ layout 2 cột (Dual-pane) chứa danh sách đơn vị. Chuyển sang hiển thị dạng bảng phẳng (Flat Table) danh sách toàn bộ tài khoản. Bổ sung cột "Đơn vị được cấp quyền" vào bảng để dễ bề theo dõi.
2. **Cập nhật dữ liệu Mock theo cấu trúc chính quyền 2 cấp:** Loại bỏ hoàn toàn các dữ liệu mẫu liên quan đến cấp Quận/Huyện ("UBND Huyện Tiên Du") trên toàn bộ các tab và modal chức năng.
3. **Đồng bộ hiển thị 2 tab API Cung cấp và API Đối soát:** 
   - Tab "API Đối soát dữ liệu" được bổ sung cột "Tài liệu" và nút thao tác "Lịch sử phiên bản" để tương thích giao diện với tab Cung cấp.
   - Bổ sung thêm cột "Phiên bản" (version badge) cho bảng danh sách của cả 2 tab.
4. **Nâng cấp trải nghiệm (UX) tính năng Làm mới Token (Refresh App Key):**
   - Loại bỏ các hộp thoại xác nhận `window.confirm` và `alert` mặc định của hệ điều hành/trình duyệt.
   - Xây dựng hệ thống Custom Modal UI bao gồm: Modal xác nhận (cảnh báo nguy cơ hệ thống mất kết nối) và Modal cấp mã mới (hỗ trợ hiển thị key và nút sao chép nhanh vào clipboard).

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.4.4 -> 2.4.5)
- `src/components/pages/provisioning/DataProvisionApiManagementPage.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccessControlModal.tsx`

---

## Phiên bản 2.4.6 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
1. **Mock dữ liệu có nhiều đơn vị nhận:**
   - Cập nhật bản ghi API mặc định đầu tiên (`SVC-HOTICH-001` - API cung cấp dữ liệu Hộ tịch điện tử) có nhiều cơ quan nhận (`consumerUnit`: `"Bộ Kế hoạch và Đầu tư, Sở Tài chính tỉnh Bắc Ninh"`).
   - Thiết lập cơ chế tự động đồng bộ/cập nhật dữ liệu cũ trong `localStorage` để hiển thị ngay lập tức bản ghi mock mới mà không cần người dùng xóa bộ nhớ trình duyệt thủ công.
   - Thêm lớp CSS định danh tương ứng cho từng root portal div của các modal.
   - Thêm thẻ `<style>` inline áp dụng bộ lọc loại trừ các thẻ `h1` đến `h6` và các tag đồ họa vector (`svg`, `path`, `circle`, `rect`, `polyline`, `line`).
2. Áp dụng quy tắc hộp thoại 5.4 trong [compomennt.md](file:///f:/BTP/DLDC_1/tailieu/docs/compomennt.md) cho tất cả các modal trong màn hình này:
   - Cập nhật màu nền backdrop chuẩn `bg-black/50` (loại bỏ màu `bg-slate-900/50 backdrop-blur-sm` không đồng bộ).
   - Nâng giá trị `z-index` của các modal lên cao nhất bằng cách thiết lập cả lớp Tailwind `z-[999999]` và style inline `style={{ zIndex: 999999 }}` cho phần tử root của các modal nhằm triệt tiêu hoàn toàn lỗi hiển thị phía sau thanh menu sidebar bên trái.
   - Các modal được cập nhật bao gồm:
     - [ProvisionApiModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/modals/ProvisionApiModal.tsx)
     - [ProvisionReconciliationApiModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/modals/ProvisionReconciliationApiModal.tsx)
     - [ProvisionAccessControlModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/modals/ProvisionAccessControlModal.tsx)
     - [ProvisionVersionHistoryModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/modals/ProvisionVersionHistoryModal.tsx)
     - [ApiVersionCompareModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/modals/ApiVersionCompareModal.tsx)
     - [ProvisionAccountModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/modals/ProvisionAccountModal.tsx)
3. Tinh chỉnh thiết kế hàng thao tác (Action Columns) và các popup thông báo:
   - Thay thế nút hành động "Tạm ngưng" và "Kích hoạt" màu sắc cũ (cam/xanh lá) bằng thiết kế màu đen (`text-black hover:bg-slate-100`) đồng bộ.
   - Thay thế icon chỉnh sửa cũ `Edit3` bằng icon `Edit` chuẩn chung hệ thống.
   - Xây dựng Custom Modal Xác nhận trạng thái (`statusConfirmData`) sử dụng `createPortal` để thay thế cho hộp thoại `window.confirm` mặc định của trình duyệt khi người dùng thay đổi trạng thái hoạt động (Tạm ngưng / Kích hoạt) của API hoặc tiến trình đối soát.
4. Chuyển đổi trường "Cơ quan/Đơn vị nhận" trong modal thêm mới/sửa cấu hình API cung cấp ([ProvisionApiModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/modals/ProvisionApiModal.tsx)) thành trường Chỉ xem (Read-only / Disabled). Giá trị của trường này được tự động trích xuất từ cấu hình mặc định tương ứng của dịch vụ API được chọn, hiển thị dưới dạng danh sách các nhãn tag (Badge) màu xám nhạt (`bg-slate-200`) không thể chỉnh sửa hay gỡ bỏ để trình bày trực quan và rõ ràng nhất kể cả khi có nhiều đơn vị nhận.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionApiManagementPage.tsx`
- `src/components/pages/provisioning/modals/ProvisionApiModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionReconciliationApiModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccessControlModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionVersionHistoryModal.tsx`
- `src/components/pages/provisioning/modals/ApiVersionCompareModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccountModal.tsx`

## Phiên bản 2.4.5 — Patch 8 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
1. Redesign giao diện trang **Quản lý API Cung cấp & Đối soát** ([DataProvisionApiManagementPage.tsx](file:///f:/BTP/DLDC_1/src/components/pages/provisioning/DataProvisionApiManagementPage.tsx)) đồng bộ theo chuẩn thiết kế của màn **Thiết lập điều phối dữ liệu**:
   - Chuyển thanh Tab chính (`api_cung_cap`, `api_doi_soat`, `phan_quyen`, `danh_sach_tai_khoan`) ra bên ngoài container chính với đường viền dưới mỏng (`border-b border-slate-200`) và indicator xanh dương (`border-b-2 border-blue-600 text-blue-600`).
   - Tái cấu trúc thanh tìm kiếm & bộ lọc (`Search` button, `Filter` button) và các nút hành động (Tạo API cung cấp mới, Tạo API đối soát mới, Cấp quyền mới, Tạo tài khoản mới).
   - Thiết kế lại panel bộ lọc collapsible cho tab API cung cấp và API đối soát.
   - Đồng bộ hóa các bảng dữ liệu: header màu xám nhạt (`bg-slate-50`), cỡ chữ `13px`, icons thao tác được hiển thị đầy đủ và sạch đẹp hơn.
2. Tích hợp tính năng phân trang (`renderPagination`) ở cuối mỗi bảng danh sách cho tất cả các tab phẳng.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionApiManagementPage.tsx`

## Phiên bản 2.4.5 — Patch 7 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
1. Tại tab **Công khai dịch vụ** của màn hình **Thiết lập điều phối dữ liệu** (`DataProvisionServiceSetupPage.tsx`), thay thế nút "Chi tiết API" dạng chữ bằng icon Xem chi tiết (`Eye` icon) đồng bộ.
2. Thiết lập hiển thị luôn luôn cho nút **Công khai** (`Share2` icon) tại danh sách dịch vụ của tab Công khai dịch vụ, đồng thời khóa (disabled) và làm mờ nút này khi dịch vụ đang ở trạng thái **Đang công khai** (`published`).
3. Đổi tên trạng thái dịch vụ từ **Đang hoạt động** thành **Đang công khai** ở phần thẻ thống kê (stat card), bộ lọc trạng thái và cột trạng thái trong bảng dịch vụ.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionServiceSetupPage.tsx`

## Phiên bản 2.4.5 — Patch 6 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
1. Tăng `z-index` của modal chỉnh sửa & xem chi tiết dịch vụ (`ProvisionServiceModal.tsx`) và modal phê duyệt dịch vụ (`ProvisionServiceApprovalModal.tsx`) lên `z-[999999]`, đồng thời bổ sung inline style `style={{ zIndex: 999999 }}` để đảm bảo cả hai modal hiển thị che phủ hoàn toàn lên trên thanh menu sidebar bên trái.
2. Ép kích thước font chữ về `13px` cho tất cả các chữ trong modal `ProvisionServiceModal.tsx` (trừ các tiêu đề header h1-h6 và icons) để đồng bộ hoàn toàn hệ thống thiết kế font chữ.
3. Loại bỏ thông báo cảnh báo màu vàng "Chế độ xem — Không thể chỉnh sửa" ở phần đầu nội dung khi mở modal ở chế độ xem chi tiết (`isViewMode`).
4. Thay thế phụ đề "API Provisioning Engine" thành "Điều phối dữ liệu", đồng thời tăng cỡ chữ của tiêu đề "Xem chi tiết Dịch vụ / Cấu hình Dịch vụ" lên `16px` và in đậm (bold).
5. Điều chỉnh các tab điều hướng dọc: Căn lề trái (`text-left`), bỏ định dạng chữ đậm (`font-normal` thay cho `font-bold`), và quy về cỡ chữ `13px`.
6. Cập nhật nhãn trường nhập (labels) không in đậm (`font-normal`/`font-medium`), bỏ chế độ tự động viết hoa (uppercase) để giữ kiểu nguyên bản (Sentence case).
7. Đồng bộ màu sắc đường viền input/select/textarea khi focus: Đổi sang màu xanh dương đậm (`#2563eb`) và thêm viền bóng mờ nhẹ, chuyển background sang màu trắng nổi bật.
8. Gỡ bỏ tab **Lịch sử** (History) ra khỏi danh sách tab và nội dung hiển thị trong modal.
9. Di chuyển nút **Trình duyệt** (Submit Approval) từ tab Lịch sử sang tab cuối cùng hiện tại là **Phân quyền truy cập** (Access Control), đồng thời cập nhật thanh tiến trình hiển thị chỉ còn 4 bước (Step 1-4 of 4).
10. Ép kích thước chữ xuống `13px` cho toàn bộ danh sách thẻ dịch vụ tại màn hình **Kiểm tra & Phê duyệt** (trừ tiêu đề `h3`), và áp dụng quy tắc tương tự (ép về `13px` ngoại trừ tiêu đề `h2` header) cho modal phê duyệt (`ProvisionServiceApprovalModal.tsx`).
11. Bổ sung cấu hình `setServiceModalMode('view')` khi người dùng nhấn button **Kiểm tra** để đảm bảo mở modal ở chế độ Xem chi tiết (read-only), không cho phép thao tác hay chỉnh sửa dữ liệu.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionServiceSetupPage.tsx`
- `src/components/pages/provisioning/modals/ProvisionServiceModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionServiceApprovalModal.tsx`

## Phiên bản 2.4.5 — Patch 5 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
Redesign UI màn hình **Cung cấp dữ liệu > Thiết lập điều phối dữ liệu** (`DataProvisionServiceSetupPage.tsx`) theo phong cách của mục **Thiết lập thu thập** (`CollectionSetupPage.tsx`):
1. **Thanh tab:** Di chuyển thanh tab phẳng ra ngoài card và thêm biểu tượng (lucide icons) cho 3 tab nghiệp vụ hiện tại.
2. **Thẻ thống kê:** Thiết kế lại 4 stat cards (Tổng số API, Đang hoạt động, Chờ phê duyệt, Đã từ chối) dạng phẳng, bo góc, có background và icon màu nhẹ đồng bộ.
3. **Thanh tìm kiếm & Hành động:** Xóa icon tìm kiếm trong ô nhập, thêm nút Search, nút Filter đồng bộ; di chuyển nút "+ Tạo API Cung cấp mới" xuống hàng tìm kiếm bên phải.
4. **Bảng Grid & Thao tác:** Đồng bộ CSS header, dòng, và trạng thái badge; sửa màu nút chỉnh sửa (Edit) thành màu đen và chuyển sang icon Edit chuẩn.
5. **Nút Xóa dịch vụ:** Bổ sung nút Xóa (Trash2 đỏ) cho các dịch vụ ở trạng thái Bản nháp, Chờ phê duyệt, Từ chối, mở modal xác nhận xóa dạng overlay chuẩn.
6. **Phân trang:** Thêm logic và UI điều khiển phân trang.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionServiceSetupPage.tsx`

## Phiên bản 2.4.5 — Patch 4 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
Sửa lỗi modal không che phủ sidebar khi mở từ màn hình Cung cấp dữ liệu:
1. Nguyên nhân: `position: fixed` bị giới hạn trong stacking context của `MainLayout` (do `overflow-hidden` trên flex container), khiến backdrop chỉ phủ vùng nội dung bên phải, không che sidebar.
2. Giải pháp: Áp dụng `ReactDOM.createPortal(JSX, document.body)` cho toàn bộ 27 modal trong thư mục `provisioning/modals/`. Portal render modal trực tiếp vào `<body>`, bỏ qua mọi stacking context cha, `fixed inset-0 z-[9999]` phủ đúng toàn viewport.
3. Mỗi file được bổ sung `import { createPortal } from 'react-dom';` và đổi `return (JSX)` → `return createPortal(JSX, document.body)`.

**Các file bị ảnh hưởng (27 modal):**
- `src/components/pages/provisioning/modals/AccessControlModal.tsx`
- `src/components/pages/provisioning/modals/ApiSelectionModal.tsx`
- `src/components/pages/provisioning/modals/ApiVersionCompareModal.tsx`
- `src/components/pages/provisioning/modals/CalculatedFieldModal.tsx`
- `src/components/pages/provisioning/modals/PacketDesignModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccessControlModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccountModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionApiDetailModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionApiModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionDataRequestModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionExportReportModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionHandoverDetailModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionPublishDetailModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionReconciliationApiModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionReconciliationDetailsModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionRequestApprovalModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionRequestExportModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionRequestHandoverModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionServiceApprovalModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionServiceModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionServicePublicDetailsModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionServicePublishModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionServiceUnpublishModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionVersionHistoryModal.tsx`
- `src/components/pages/provisioning/modals/RecordDetailModal.tsx`
- `src/components/pages/provisioning/modals/SharedFieldsConfigModal.tsx`
- `src/components/pages/provisioning/modals/SubmitApprovalModal.tsx`

---

## Phiên bản 2.4.5 — Patch 3 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
Áp dụng quy tắc **5.4 Hộp thoại** (`compomennt.md`) cho modal Phê duyệt / Từ chối tại tab **Kiểm tra & Phê duyệt**:
1. Backdrop đúng chuẩn: `bg-black/50` (thay `bg-slate-900/50 backdrop-blur-sm`).
2. Z-index đúng quy tắc 4.2: `z-[100]` (thay `z-50`).
3. Tiêu đề top-left và nút đóng X top-right đã đúng chuẩn, giữ nguyên.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/modals/ProvisionServiceApprovalModal.tsx`

---

## Phiên bản 2.4.5 — Patch 2 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
Redesign thanh tìm kiếm & bộ lọc tại tab **Kiểm tra & Phê duyệt** trong `ServiceSetupPageUpdated.tsx` theo chuẩn thiết kế tab Thiết lập dịch vụ:
1. Thay thế subtab buttons + search box cũ bằng layout `flex items-center justify-between` + collapsible filter panel.
2. Bổ sung 4 bộ lọc: **Trạng thái** (pending/approved/rejected), **Phân loại dữ liệu**, **Tần suất**, **Giao thức**.
3. Thêm fields `category`, `frequency`, `protocol` vào `ApprovalRequest` interface và mock data.
4. Cập nhật logic `filteredApprovals` để lọc theo tất cả 4 tiêu chí mới.
5. Xóa state `approvalSubTab` không còn dùng.

**Các file bị ảnh hưởng:**
- `src/components/pages/orchestration/ServiceSetupPageUpdated.tsx`


**Các file bị ảnh hưởng:**
- `src/components/pages/orchestration/ServiceSetupPageUpdated.tsx`

---

## Phiên bản 2.4.5 (Ngày cập nhật: 15/06/2026)

**Nội dung thay đổi:**
1. **Tinh gọn giao diện Tab Danh sách tài khoản:** Gỡ bỏ layout 2 cột (Dual-pane) chứa danh sách đơn vị. Chuyển sang hiển thị dạng bảng phẳng (Flat Table) danh sách toàn bộ tài khoản. Bổ sung cột "Đơn vị được cấp quyền" vào bảng để dễ bề theo dõi.
2. **Cập nhật dữ liệu Mock theo cấu trúc chính quyền 2 cấp:** Loại bỏ hoàn toàn các dữ liệu mẫu liên quan đến cấp Quận/Huyện ("UBND Huyện Tiên Du") trên toàn bộ các tab và modal chức năng.
3. **Đồng bộ hiển thị 2 tab API Cung cấp và API Đối soát:** 
   - Tab "API Đối soát dữ liệu" được bổ sung cột "Tài liệu" và nút thao tác "Lịch sử phiên bản" để tương thích giao diện với tab Cung cấp.
   - Bổ sung thêm cột "Phiên bản" (version badge) cho bảng danh sách của cả 2 tab.
4. **Nâng cấp trải nghiệm (UX) tính năng Làm mới Token (Refresh App Key):**
   - Loại bỏ các hộp thoại xác nhận `window.confirm` và `alert` mặc định của hệ điều hành/trình duyệt.
   - Xây dựng hệ thống Custom Modal UI bao gồm: Modal xác nhận (cảnh báo nguy cơ hệ thống mất kết nối) và Modal cấp mã mới (hỗ trợ hiển thị key và nút sao chép nhanh vào clipboard).

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.4.4 -> 2.4.5)
- `src/components/pages/provisioning/DataProvisionApiManagementPage.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccessControlModal.tsx`

---

## Phiên bản 2.4.6 (Ngày cập nhật: 16/06/2026)

**Nội dung thay đổi:**
1. **Mock dữ liệu có nhiều đơn vị nhận:**
   - Cập nhật bản ghi API mặc định đầu tiên (`SVC-HOTICH-001` - API cung cấp dữ liệu Hộ tịch điện tử) có nhiều cơ quan nhận (`consumerUnit`: `"Bộ Kế hoạch và Đầu tư, Sở Tài chính tỉnh Bắc Ninh"`).
   - Thiết lập cơ chế tự động đồng bộ/cập nhật dữ liệu cũ trong `localStorage` để hiển thị ngay lập tức bản ghi mock mới mà không cần người dùng xóa bộ nhớ trình duyệt thủ công.
2. **Cập nhật Modal API cung cấp:**
   - Cập nhật danh sách giá trị mặc định (`serviceDefaults`) cho dịch vụ `SVC-HOTICH-001` để bao gồm nhiều đơn vị nhận phân tách bằng dấu phẩy.
   - Nâng cấp hàm `handleServiceChange` để phân tích (split) chuỗi đơn vị nhận theo dấu phẩy, đảm bảo render chính xác thành danh sách các badge màu xám, chỉ xem và không được chỉnh sửa.
   - Loại bỏ trường "Trạng thái" (Status) khỏi giao diện modal Tạo mới và chỉnh sửa API cung cấp.
   - Ngăn tự động điền (autofill) các trường "Hệ thống đích tích hợp API", "Thông tin đầu mối tiếp nhận", "URL Endpoint cung cấp dữ liệu" và "Tài liệu API chia sẻ" khi chọn Dịch vụ API được cấp trong modal.
   - Thiết lập trường "Ngày bắt đầu hiệu lực" (startDate) mặc định lấy theo ngày hiện tại (today) định dạng `dd/mm/yyyy` khi tạo mới, và ngăn việc tự động ghi đè giá trị này khi người dùng thay đổi dịch vụ được chọn.
3. **Cập nhật giao diện Trạng thái (Status Badge) & Phân quyền:**
   - Thay đổi kiểu chữ trong toàn bộ các badge hiển thị trạng thái từ chữ đậm (`font-semibold`) sang chữ thường (`font-normal`) trên cả 4 tab: API cung cấp dữ liệu, API đối soát dữ liệu, Phân quyền truy cập, và Danh sách tài khoản.
   - Thêm thanh cuộn dọc (vertical scrollbar) với giới hạn chiều cao tối đa `180px` và thuộc tính cuộn cưỡng bức bằng style inline (`style={{ maxHeight: '180px', overflowY: 'scroll' }}`) cho panel "Danh sách dịch vụ API" tại tab Phân quyền truy cập nhằm khắc phục lỗi cache của trình duyệt/CSS và đảm bảo thanh cuộn luôn hiển thị trực quan và dễ cuộn đối với danh sách dịch vụ hiện tại.
   - Thêm thanh tìm kiếm dịch vụ API (chỉ bao gồm ô nhập liệu, không chứa icon Search để tránh lỗi lệch giao diện) ngay phía dưới tiêu đề "Danh sách dịch vụ API" ở cột trái để lọc nhanh danh sách dịch vụ theo tên.
   - Loại bỏ nút "Cấp quyền truy cập API" dư thừa ở hàng công cụ tìm kiếm phía trên của tab Phân quyền truy cập, do đã có nút "+ Cấp quyền mới" chính ở bảng chi tiết phân quyền.
   - Thay đổi tông màu chủ đạo của modal Cấp quyền truy cập API (`ProvisionAccessControlModal.tsx`) từ màu hổ phách/vàng (`amber`) sang màu xanh dương (`blue`) để đồng bộ với màu sắc chung của hệ thống, đồng thời chuyển đổi kiểu chữ của nhãn tên các trường (labels) từ in đậm (`font-semibold`) sang kiểu thường (`font-medium`).
   - Loại bỏ ràng buộc bắt buộc (`required`) và dấu hoa thị đỏ (`*`) tại trường "Hiệu lực đến ngày" (`validTo`) trong modal Cấp quyền truy cập API để cho phép trường này không bắt buộc nhập.
   - Loại bỏ cột "Phạm vi quyền (Scopes)" khỏi bảng danh sách các đơn vị được cấp quyền tại tab Phân quyền truy cập bên ngoài màn hình chính.
   - Cấu trúc lại trường chọn Đơn vị thụ hưởng trong modal Cấp quyền truy cập API (`ProvisionAccessControlModal.tsx`) từ dạng dropdown đơn lẻ thành danh sách hộp chọn (multi-select checkboxes) có kèm thanh tìm kiếm nhanh, các nút tiện ích "Chọn tất cả" / "Bỏ chọn tất cả" và thanh cuộn dọc cưỡng bức. Danh sách được tải động từ trường "Đơn vị được cấp quyền" của tab Danh sách tài khoản.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.4.5 -> 2.4.6)
- `src/components/pages/provisioning/DataProvisionApiManagementPage.tsx`
- `src/components/pages/provisioning/modals/ProvisionApiModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccessControlModal.tsx`
