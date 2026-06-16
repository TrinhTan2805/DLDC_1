# Nhật ký cập nhật hệ thống (Changelog)
 
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
