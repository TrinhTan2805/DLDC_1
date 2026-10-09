# Nhật ký cập nhật hệ thống (Changelog)

## Đồng bộ icon nút Chỉnh sửa: Edit2 (cây bút) → SquarePen (Ngày thực hiện: 08/10/2026) — 167

**Nội dung (PM yêu cầu, theo mục 3 `compomennt.md` — mục 166):** đổi 24 chỗ nút Chỉnh sửa/Sửa đang dùng `Edit2` sang `SquarePen`; chỉ đổi icon, không đổi màu, kích thước, chữ hay logic. Import `lucide-react` cập nhật tương ứng.
- Nút icon trong bảng/danh sách (20): `collection/APIMethodsList` (2), `collection/DataCollectionList`, `collection/ViewDataRecordsList`, `collection/ConnectionConfig`, `pages/category/CategoryMojUnitsPage`, `pages/category/CategorySetupPageNew` (2), `pages/CategoryManagementPage`, `masterdata/AttributeManagementModal`, `masterdata/MergeRuleModal`, `pages/MasterDataPage`, `pages/master-data-list/MasterDataPage`, `processing/DataViewer`, `processing/WarningDataList`, `pages/processing/ScheduleManagementModal`, `pages/reconciliation/ReconciliationServiceSetupTab`, `pages/OpenDataCategoryPage`, `pages/open-data/OpenDataPublishedListPage` (Sửa lịch), `user/ImportExcelModal`.
- Nút có chữ "Chỉnh sửa" (4): `collection/ViewDataCollectionDetail`, `pages/category/CategorySetupPageNew` (chân modal), `DataDetailModal` (Chỉnh sửa giá trị), `processing/DataClassificationModal`.
- **Không đổi:** icon minh họa (lịch sử thao tác "update" ở AccessLogPage, ActionHistoryModal; tiêu đề modal ở OpenDataPublishedListPage) và 3 file không được import.

**Mở khóa `stauts.md` (PM cho phép):** `[ ]` → `[x]`: CategoryMojUnitsPage, CategorySetupPageNew, ScheduleManagementModal; thêm mục "Đồng bộ icon Chỉnh sửa → SquarePen" cho 13 file chưa có trong danh sách.

**Kiểm tra:** tsc không có lỗi liên quan `SquarePen`/`Edit2` ở 21 file; `npm run build` thành công.

## compomennt.md — mục 3: sửa icon Chỉnh sửa, thay Xuất Excel/PDF bằng Kết xuất (Ngày thực hiện: 07/10/2026) — 166

**Nội dung (PM yêu cầu), đối chiếu mã nguồn:**
- **Chỉnh sửa:** `Edit2`/`Pencil` (cây bút, Indigo) → **`SquarePen`** (alias `Edit` trong lucide-react), màu Slate `#475569`. Mã nguồn: nút Sửa dùng `Edit` 32 chỗ + `SquarePen` 7 chỗ (cùng icon) so với `Edit2` 17 chỗ.
- **Bỏ** dòng "Xuất Excel" (`FileSpreadsheet`) và "Xuất PDF" (`FileText`); **thêm** dòng **"Kết xuất"** — `Download`, nút viền chữ `#334155` (26 chỗ dùng trong mã nguồn).
- Icon cục bộ: thêm `icons/square-pen-475569.svg`, `icons/download-334155.svg`; xóa 3 file icon không còn dùng.

**Lưu ý:** mã nguồn vẫn còn vài chỗ cũ ghi "Xuất Excel" và 17 nút Sửa dùng `Edit2` — chưa sửa code (chờ PM).

## compomennt.md — icon mục 3 dùng file cục bộ (Ngày thực hiện: 07/10/2026) — 165

**Lỗi (PM báo):** biểu tượng ở mục 3 "Hệ thống Icon Chung" không hiển thị khi xem file. Link gốc `api.iconify.design` vẫn trả SVG hợp lệ → nguyên nhân là trình xem markdown không tải ảnh từ máy chủ ngoài.
**Sửa:** tải 17 icon về `tailieu/docs/icons/<tên>-<màu>.svg` (giữ đúng màu, kích thước 24px) và đổi 17 link trong `compomennt.md` sang đường dẫn cục bộ. Không đổi nội dung bảng.

## Mô hình dữ liệu chủ — điều chỉnh bảng grid nguồn đăng ký (Ngày thực hiện: 07/10/2026) — 164

**Nội dung (PM yêu cầu, tiếp mục 163):**
- `master-data/MasterDataWizard.tsx` (Thêm mới): bỏ 2 nguồn mẫu mặc định (Hộ tịch, CCCD) — wizard bắt đầu chưa có nguồn; bảng grid **chỉ hiện khi đã có nguồn** (không hiện dòng/khung trống) và đặt **dưới form thêm nguồn**.
- `master-data/MasterDataScaleManagementPage.tsx` (Xem chi tiết — Bước 1): ngoài trường "Nguồn dữ liệu đăng ký", thêm khối **"Đăng ký nguồn dữ liệu"** dạng bảng grid chỉ xem (Tên nguồn, Bảng nguồn, Khóa làm mịn, Quy tắc gom) — không có nút Thêm nguồn, không có cột Thao tác; chỉ hiện khi thực thể có nguồn. `EntitySource` thêm `grainKey`, `groupRules` (nhận từ wizard khi lưu).

**Kiểm tra:** tsc không lỗi ở các file master-data đã sửa; `npm run build` thành công.

## Mô hình dữ liệu chủ — Đăng ký nguồn dữ liệu dạng bảng grid + trường "Nguồn dữ liệu đăng ký" (Ngày thực hiện: 07/10/2026) — 163

**Nội dung (PM yêu cầu, theo ảnh mẫu):**
- `master-data/MasterDataWizard.tsx` (Thêm mới / Chỉnh sửa — Bước 1):
  - Danh sách nguồn đã đăng ký đổi từ chip sang **bảng grid**: Tên nguồn | Bảng nguồn | Khóa làm mịn | Quy tắc gom (số quy tắc) | Thao tác (Sửa, Xóa đỏ). Trống: "Chưa đăng ký nguồn dữ liệu nào".
  - Form thêm nguồn: thêm ô bắt buộc **Bảng nguồn** (danh sách bảng DLDC của nguồn đã chọn); Khóa làm mịn và thuộc tính Quy tắc gom chỉ lấy trường của bảng đã chọn; đổi nguồn/bảng thì xóa khóa và quy tắc gom đã chọn.
  - Thêm chức năng **Sửa nguồn**: mở lại form với giá trị cũ, nút "Cập nhật", giữ nguyên id nguồn (không mất ánh xạ ở bước sau). Thêm/sửa thành công có toast.
  - `WizardSource` thêm trường `table`; 2 nguồn mặc định gán bảng `tbl_khaisinh`, `tbl_can_cuoc`.
- `master-data/MasterDataScaleManagementPage.tsx` (Xem chi tiết — Bước 1): bỏ chip, đổi thành trường **"Nguồn dữ liệu đăng ký"**, mỗi nguồn một dòng "Tên nguồn - Bảng nguồn"; `EntitySource` thêm `table`, dữ liệu mẫu gán bảng.

**Chưa làm (chờ PM):** Bước 2 wizard ("Chọn bảng nguồn dữ liệu") vẫn hiện nguồn dạng chip; Chỉnh sửa mở wizard không truyền dữ liệu thực thể đang sửa (logic cũ) nên danh sách nguồn là mặc định của wizard; form sửa cũ trong ScaleManagementPage (`showForm`) không có đường mở nên chưa sửa.

**Kiểm tra:** tsc không lỗi ở 2 file; `npm run build` thành công.

## Quản lý nhóm người dùng — bỏ thẻ "TB thành viên/nhóm" (Ngày thực hiện: 07/10/2026) — 162

**Nội dung (PM yêu cầu):** `admin/GroupManagementPage.tsx` — bỏ thẻ thống kê "TB thành viên/nhóm"; 3 thẻ còn lại (Tổng nhóm, Đang hoạt động, Tổng thành viên) chia đều `grid-cols-3`, thẳng mép trái/phải với thanh tìm kiếm.

**Kiểm tra:** tsc không lỗi ở file; `npm run build` thành công.

## Chi tiết cơ sở dữ liệu đích — khung viền cho từng bảng (Ngày thực hiện: 07/10/2026) — 161

**Nội dung (PM yêu cầu):** `processing/TargetDatabaseDetailPage.tsx` — mỗi mục trong danh sách bảng (cột trái) có viền 1px #E2E8F0 bo 8px, nền trắng, cách nhau 8px; hover nền #F8FAFC viền #CBD5E1; bảng đang chọn giữ nền xanh, viền xanh.

**Kiểm tra:** `npm run build` thành công; tsc không lỗi mới ở file (còn 1 lỗi cũ `FilterItem.value` có sẵn trong bản gốc).

## Xem biểu đồ thống kê — sửa 3 lỗi hiển thị (Ngày thực hiện: 07/10/2026) — 160

`admin/StatisticsPage.tsx` (PM báo):
1. Nút X bỏ lọc khoảng ngày bị xuống dòng → hàng ngày không còn `flex-wrap`, 2 ô ngày co giãn (`flex-1 min-w-0`), chữ "đến" và nút X không co.
2. Tên hạng mục dữ liệu dài tràn khỏi ô → chip `max-w-full`, tên cắt "…" trên 1 dòng + tooltip hiện đầy đủ (5.3.1).
3. Trang cuộn thừa khoảng trắng phía dưới → nguyên nhân: ô tích `sr-only` (position:absolute, đổi từ `hidden` ở mục 156) nằm trong khung cuộn không có `relative` nên định vị theo trang và kéo dài trang; thêm `relative` cho khung cuộn.

**Kiểm tra:** tsc không lỗi mới (14 lỗi cũ Recharts/useRef như mục 156); Vite trả 200.

## Quản lý nhật ký — bỏ badge ở các cột phân loại, hiển thị dạng chữ (Ngày thực hiện: 07/10/2026) — 159

**Nội dung (PM yêu cầu):** các cột sau hiển thị chữ thường 13px/400 đen (như ô bảng 5.3), không dùng badge/icon:
- `admin/LogRetentionConfigPage.tsx` — cột Loại nhật ký (bỏ `getLogTypeIcon`, `getLogTypeVariant`).
- `admin/ConfigChangeLogPage.tsx` — cột Loại cấu hình; dòng Loại cấu hình trong modal chi tiết cũng thành chữ (dùng chung hàm) (bỏ `CATEGORY_VARIANT`, `getConfigCategoryIcon`).
- `admin/AccountManagementLogPage.tsx` — cột Tác vụ (bỏ `getActionIcon`).
- `admin/ErrorLogPage.tsx` — cột Mức độ (bỏ `getSeverityIcon`, `getSeverityVariant`).
- Bỏ import icon không còn dùng. Các cột Trạng thái vẫn giữ badge.

**Kiểm tra:** tsc không lỗi ở 4 file; Vite trả 200.

## Quản lý thời gian lưu trữ nhật ký — bỏ thanh tab trùng + chuẩn hóa giao diện (Ngày thực hiện: 07/10/2026) — 158

**Lỗi (PM báo):** tab "Quản lý thời gian lưu trữ nhật ký" trong Nhật ký thay đổi cấu hình hiện 2 thanh tab — trang con `LogRetentionConfigPage` tự vẽ thêm thanh tab riêng.

- `admin/LogRetentionConfigPage.tsx`: thêm prop `embedded` — khi nhúng làm tab thì không vẽ thanh tab riêng; khi mở độc lập (route `admin-log-retention`) vẫn có thanh tab, nay dùng `tabClass` 5.9. Chuẩn hóa giao diện theo `compomennt.md`: thẻ thống kê nhỏ 5.6.1 (thay StatsCard); tìm kiếm 5.19 (nút Tìm kiếm xanh lá, chỉ tìm khi bấm/Enter, không phân biệt dấu); Thêm mới Primary, Kết xuất viền; bảng 5.3 (căn lề theo kiểu cột — Thời gian lưu trữ căn phải, Mô tả cắt chữ + tooltip, Loại/Trạng thái dạng Badge, Cập nhật lần cuối 2 dòng thời gian / người cập nhật, Thao tác ghim phải, nút Sửa/Xóa có tooltip, Xóa đỏ); phân trang chuẩn 5.14; modal Thêm mới / Sửa theo 5.4 (bo 16px, footer #F8FAFC, nhãn 13px/500, ô cao 40px); xóa dùng ConfirmModal; `alert()` → toast; thời gian bản ghi mới/sửa dạng dd/mm/yyyy HH:mm:ss (trước `toLocaleString`). Badge "Nhật ký hệ thống" cyan (ngoài bảng màu) → indigo. Placeholder "Tìm kiếm loại nhật ký..." → "Tìm kiếm theo loại nhật ký, mô tả".
- `admin/ConfigChangeLogPage.tsx`: gọi `<LogRetentionConfigPage embedded />`.

**Kiểm tra:** tsc không lỗi ở 2 file; Vite trả 200.

## Quản lý nhật ký — thống nhất định dạng cột Người dùng / Người thực hiện (Ngày thực hiện: 07/10/2026) — 157

**Nội dung (PM yêu cầu):** các cột Người dùng, Người thực hiện hiển thị cùng một định dạng 2 dòng: **Tên người dùng** (13px, đen) / **Tên tài khoản** (12px, #64748B); mỗi dòng cắt chữ + tooltip, vẫn trong hàng 48px.
- `admin/LoginLogPage.tsx` — cột Người dùng: thêm dòng 2 `userId` (trước chỉ có tên).
- `admin/AccessLogPage.tsx` — tab Nhật ký truy cập, cột Người dùng: tách "Tên (mã)" thành 2 dòng.
- `admin/AccountManagementLogPage.tsx` — cột Người thực hiện và cột Tài khoản (cùng bảng): bỏ tiền tố `@` và chữ mono ở dòng 2.
- `admin/ConfigChangeLogPage.tsx` — cột Người thực hiện: thêm dòng 2 `performedById`.

- `admin/ErrorLogPage.tsx` — cột Người dùng: thêm trường `userAccount` vào dữ liệu mẫu (an.nv, binh.tt, cuong.lv — trùng tên tài khoản của cùng người ở AccessLogPage); bản ghi do hệ thống (user `system` hoặc trống, trước hiện "system"/"System") hiển thị "Hệ thống" / "system". Modal chi tiết hiển thị thêm dòng tài khoản dưới tên.

**Lưu ý:** dữ liệu mẫu Nhật ký đăng nhập / truy cập chỉ có `userId` dạng `user_001` (không có tên đăng nhập riêng) nên dòng 2 hiển thị giá trị này. Tab "Nhật ký đăng nhập" trong AccessLogPage đang tách 2 cột Tên đăng nhập / Họ và tên — chưa gộp (chờ PM).

## Chuẩn hóa giao diện — Quản trị & vận hành › Quản lý nhật ký, Thống kê & báo cáo, Quản lý thông báo, Quản lý thông báo hệ thống, Hướng dẫn sử dụng (Ngày thực hiện: 07/10/2026) — 156

**Nội dung (PM yêu cầu):** sửa giao diện các màn còn lại của Quản trị & vận hành theo `compomennt.md`; giữ nội dung, dữ liệu, logic. PM cho phép mở khóa: đã thêm vào `stauts.md` mục "Thông báo & Hướng dẫn" (`NotificationPage`, `SystemNotificationManagementPage`, `UserGuidePage`) ở trạng thái `[x]`; các màn nhật ký và Thống kê vốn đã `[x]`. Không sửa file dùng chung (`collectionUi`, `common/*`, `ui/*`, `data/*`, `index.css`, layout).

**Chung cho mọi màn:** H1 20px/700 #2A0F0F (5 màn nhật ký thêm H1 = tên menu, trước không có tiêu đề); thẻ thống kê nhỏ 5.6.1 thay `StatsCard`; `Badge` thay `StatusTag`; thanh tìm kiếm + vùng bộ lọc 5.19 — **từ khóa/bộ lọc chỉ áp dụng khi bấm Tìm kiếm hoặc Enter**, so khớp không phân biệt hoa/thường và dấu; ô ngày dùng `DateInput` (dd/mm/yyyy); bảng 5.3 (tiêu đề #F1F5F9 chữ đen đậm, hàng 48px, căn lề theo kiểu cột, cắt chữ + tooltip, ngày/giờ 2 dòng, cột Thao tác ghim phải, nút icon 32×32 có tooltip); phân trang `Pagination` chuẩn; modal 5.4 (chi tiết cao cố định, thân cuộn, tiêu đề 16px/500, footer #F8FAFC); `alert()` → toast; bỏ chữ 10–11px, `uppercase`, `opacity-50`, khối `<style>` ép 13px.

**Quản lý nhật ký:**
- `admin/LoginLogPage.tsx`: như trên; Thiết bị gộp 1 dòng "thiết bị · trình duyệt"; modal chi tiết dạng nhãn–giá trị 5.17.
- `admin/AccessLogPage.tsx`: tab 5.9; 2 tab dùng chung thanh tìm kiếm; Người dùng 1 dòng "Tên (mã)"; lịch sử thao tác trong modal dùng Badge; số dòng/trang 5/10/20/50 → 10/20/50/100.
- `admin/ErrorLogPage.tsx`: Badge mức độ / đã xử lý; modal 4 khối (Thông tin chung, request, thông báo lỗi khung đỏ nhạt, Stack Trace khung sáng thay nền đen).
- `admin/AccountManagementLogPage.tsx`: cột người thực hiện/tài khoản 2 dòng có cắt chữ; giá trị cũ/mới khung đỏ nhạt/xanh lá nhạt; sửa lồng JSX vùng lọc.
- `admin/ConfigChangeLogPage.tsx`: tab 5.9; sửa vùng lọc nằm trong hàng tìm kiếm; Badge loại `pink` (ngoài bảng màu) → `indigo`; sửa chính tả "bảo trị" → "bảo trì" (dữ liệu mẫu, tùy chọn lọc).

**Thống kê & báo cáo** (`admin/StatisticsPage.tsx`): bỏ khung tiêu đề có icon; Lịch sử/In dạng viền, Tải xuống Primary; khung biểu đồ / Tùy chỉnh hiển thị `CARD_CLS`; trục 12px, màu chỉ tiêu theo bảng màu (#155DFC, #16A34A, #8200DB); Biểu đồ/Dạng bảng thành tab 5.9 (bỏ emoji); 3 modal theo 5.4; sửa icon nút đóng modal Chi tiết (trước là icon Download xoay).

**Quản lý thông báo** (`NotificationPage.tsx`): bỏ `PageHeader` (trả về null) → H1 "Quản lý thông báo" nay mới hiển thị; 5 thẻ thống kê; lọc Loại vào vùng bộ lọc; Tất cả/Chưa đọc/Đã đọc thành tab; dòng thông báo 13px, chấm xanh chưa đọc, Badge loại, nút icon có tooltip.

**Quản lý thông báo hệ thống** (`admin/SystemNotificationManagementPage.tsx`): thanh công cụ 5.19 (icon nút sắp xếp `Filter` → `ArrowUpDown`); bảng 5.3 (Nội dung cắt chữ + tooltip); modal Thêm/Sửa 5.4; xóa dùng ConfirmModal; ngày bản ghi mới tạo `dd/mm/yyyy HH:mm:ss` (trước `HH:mm:ss dd/mm/yyyy` khiến sắp xếp đọc sai).

**Hướng dẫn sử dụng** (`UserGuidePage.tsx`): bỏ màu tím → xanh chính; mục lục 13px, mục chọn nền #EAF3FF; tìm kiếm 5.19; Phần trước/tiếp theo dạng viền, vô hiệu chuẩn; thêm dòng trống "Không tìm thấy nội dung phù hợp".

**Nút Xóa** trong bảng/danh sách (thông báo, thông báo hệ thống): icon đỏ #DC2626 (5.3.2 — thao tác nguy hiểm luôn đỏ).

**Chờ PM quyết định:** Xóa ở Quản lý thông báo chưa có hộp xác nhận (logic gốc xóa ngay); Quản lý thông báo chưa có phân trang; ConfigChangeLog có hàm kết xuất nhưng không có nút; ErrorLog nút "Đánh dấu đã xử lý"/"Copy Stack Trace" chưa có xử lý (gốc); nhãn tiếng Anh trong modal nhật ký (IP Address, Method, URL, Stack Trace…) chưa Việt hóa; lọc ngày ở AccessLog so sánh chuỗi dd/mm/yyyy (lỗi cũ, có thể lọc sai khi khác tháng/năm); Thống kê có chế độ bảng theo tháng/nguồn và modal "Số liệu chi tiết" không có nút mở; Hướng dẫn sử dụng có chữ nghi sai ("Đối tịch tư Bộ ngành ngoài", "Đối tịch tư hệ thống trong nội bộ", "Hệ thống quản lý Bộ Tư Pháp sự cố"), liên kết PDF/video trỏ `#`; modal AccessLog không đóng khi bấm nền còn LoginLog có.

**Kiểm tra:** Vite trả 200 cho cả 9 file; tsc không có lỗi mới ở 9 file — riêng `StatisticsPage.tsx` còn lỗi cũ (kiểu Recharts, `useRef(null)`, `entry` any) trùng y dòng mã bản gốc và cùng loại lỗi với `open-data/OpenDataStatisticsPage.tsx` không sửa. Chưa kiểm tra bằng mắt trên trình duyệt.

## Chuẩn hóa giao diện — Quản trị & vận hành › Cấu hình hệ thống (Ngày thực hiện: 07/10/2026) — 155

**Nội dung (PM yêu cầu):** sửa giao diện mục Cấu hình hệ thống theo `compomennt.md`; giữ nội dung, dữ liệu, logic. Menu gồm 2 màn: "Thiết lập cấu hình hệ thống" (render `SecurityConfigPage`) và "Sao lưu dự phòng" (`BackupPage`) — cả hai đang `[x]` trong `stauts.md`. `SystemConfigPage.tsx` (`[ ]`) không được menu này dùng nên không sửa.

**Thiết lập cấu hình hệ thống** (`admin/SecurityConfigPage.tsx`): H1 20px/700 #2A0F0F (bỏ khung header có icon); nút Đặt lại mặc định dạng viền, Lưu cấu hình Primary với trạng thái vô hiệu chuẩn (#F1F5F9/#94A3B8); 7 khối cấu hình dạng thẻ bo 16px, tiêu đề H2 14px/500 có vạch xanh (bỏ ô icon màu); nhãn 13px/500, mô tả 12px #64748B; ô số/ô chọn/ô giờ/ô văn bản cao 40px (INPUT_CLS); công tắc chuẩn `role="switch"` (bật #155DFC, tắt #CBD5E1); nút tần suất sao lưu: đang chọn nền #EAF3FF chữ xanh, thường dạng viền (`role="radio"`); nhãn Active/Inactive dùng Badge 5.8; thông báo "chưa lưu" chuyển lên đầu trang, nút "Lưu ngay" dạng viền (mỗi màn một nút Primary); `confirm()` → ConfirmModal, `alert()` → toast. Sửa chính tả tiêu đề "bảo trị" → "bảo trì".

**Sao lưu dự phòng** (`admin/BackupPage.tsx`): H1 chuẩn + mô tả 13px; thẻ thống kê nhỏ 5.6.1 (thay StatsCard); bảng 5.3 (tiêu đề nền #F1F5F9 chữ đen đậm, hàng 48px kẻ #E0E0E0, căn lề theo kiểu cột 5.3.3, Tên file cắt chữ + tooltip, Ngày giờ dd/mm/yyyy + giờ dòng 2, Dung lượng căn phải, Loại/Trạng thái dạng Badge, Thao tác ghim phải); nút thao tác 32×32 có tooltip — bản sao lưu thất bại giữ nguyên vị trí nút Tải xuống/Khôi phục ở trạng thái vô hiệu kèm lý do (trước là ô trống), nút Xóa màu đỏ; phân trang chuẩn 5.14; modal xóa dùng ConfirmModal (sửa chữ "Hủy bộ" → "Hủy"); `alert()` → toast; dòng trống có icon.

**Chữ mới:** tiêu đề "Xác nhận đặt lại cấu hình"; lý do vô hiệu "Bản sao lưu không thành công"; tooltip/aria-label các nút.

**Kiểm tra:** tsc không có lỗi ở 2 file đã sửa; Vite biên dịch 2 file thành công (HMR, port 3000).

## Chuẩn hóa giao diện — Quản trị & vận hành › Quản trị người dùng (Ngày thực hiện: 07/10/2026) — 154

**Nội dung (PM yêu cầu):** sửa giao diện mục Quản trị người dùng theo `compomennt.md`; giữ nội dung, dữ liệu, logic.

**Quản lý người dùng** (`admin/UserManagementPage.tsx`): thẻ thống kê nhỏ 5.6.1 (thay StatsCard); tìm kiếm + bộ lọc (trạng thái, đơn vị, nhóm) áp dụng khi bấm Tìm kiếm/Enter (trước nút tìm kiếm không hoạt động); bảng 5.3 (cắt chữ + tooltip, vai trò/trạng thái dạng Badge, Đăng nhập gần nhất 2 dòng dd/mm/yyyy, Thao tác ghim phải); phân trang chuẩn; modal 5.4 (Chi tiết người dùng và Đồng bộ chiều cao cố định, thân cuộn); xác nhận xóa / khóa / mở khóa dùng ConfirmModal; `alert()` → toast; thêm dòng trống "Không tìm thấy người dùng nào.".

**Quản lý nhóm người dùng** (`admin/GroupManagementPage.tsx`): H1 chuẩn; thẻ thống kê nhỏ; panel đơn vị (mục chọn nền #EAF3FF); tìm kiếm + lọc trạng thái áp dụng khi bấm; thẻ nhóm bo 16px, Sửa/Xóa dạng nút icon; Badge thay StatusTag; modal 5.4 (Chi tiết/Phân quyền chiều cao cố định, bỏ thanh cuộn lồng); cây phân quyền checkbox xanh, cấp gốc 14px/500; bảng bảo mật trường theo 5.3; `alert()` → toast; ngày dd/mm/yyyy.

**Danh sách chức năng** (`admin/FunctionManagementPage.tsx`): bỏ khối style ép 13px; cây menu + form bo 16px; tìm menu áp dụng khi bấm; mục chọn nền #EAF3FF; form chuẩn 5.2, công tắc `role="switch"`; xóa dùng ConfirmModal; modal Thêm mới 5.4; **sửa lỗi cũ** gọi `React.createElement` khi chưa import React (chọn icon sẽ lỗi lúc chạy) — hết 16 lỗi tsc cũ.

**Quản lý vai trò** (`admin/RoleManagementPage.tsx`): thẻ thống kê nhỏ; tìm kiếm + bộ lọc áp dụng khi bấm; thẻ vai trò bo 16px, Sửa/Xóa nút icon, Badge; bỏ chữ 10px; 5 modal theo 5.4 (Gán người dùng/nhóm, Lịch sử phiên bản chiều cao cố định, tab chuẩn); `alert()` → toast; ngày dd/mm/yyyy.

**Chữ mới:** nhãn lọc "Trạng thái"; tiêu đề "Xác nhận xóa" (ConfirmModal); dòng trống bảng người dùng; tooltip/aria-label.

**Chờ PM quyết định:** danh sách nhóm và vai trò đang dạng thẻ — có chuyển sang bảng 5.3 + phân trang không; các modal Thêm/Sửa/Xóa người dùng, Đặt lại mật khẩu, Nhập Excel, Gán vai trò hiện không có nút mở — có bổ sung không; bộ lọc Đơn vị/Nhóm dùng ô chọn có tìm kiếm không; nút xác nhận khóa tài khoản màu đỏ hay xanh; xóa chức năng hiện chỉ ghi console (logic gốc).

**Kiểm tra:** tsc không phát sinh lỗi mới (còn 7 lỗi cũ `createdDate`, `fullName`, `ImportExcelModal`; giảm 18 lỗi cũ); `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Chi tiết CSDL đích theo thiết kế PM + quy định chiều cao cố định modal (Ngày thực hiện: 07/10/2026) — 153

**1. Màn Chi tiết cơ sở dữ liệu đích** (`processing/TargetDatabaseDetailPage.tsx`) — sửa trên bản cũ (mục 151) theo ảnh PM gửi; giữ logic, dữ liệu.
- Tiêu đề trang 20px/700 + nút quay lại tròn có viền; khung chính nền trắng, viền #E2E8F0, bóng mức vừa.
- Header CSDL: ô icon nền #EAF3FF (bỏ ô xanh đậm có bóng, bỏ nền chuyển màu), tên 16px/600, dòng "kiểu • host:port" 13px xám.
- Cột trái rộng 300px: "THÔNG TIN KẾT NỐI" gồm **Schema/Database** (icon khiên) và **Ngày tạo** (icon lịch) — **bỏ dòng Username và khung ghi chú** theo ảnh; "DANH SÁCH BẢNG (n)" + nút viền "Thêm bảng"; ô tìm kiếm 40px; mục bảng đang chọn nền xanh chữ trắng, dòng phụ **"n cột"** (trước là mô tả bảng).
- Cột phải: ô icon bảng xám, tiêu đề "Cấu trúc bảng: **tên bảng (xanh)**", dòng mô tả 12px; nút Chỉnh sửa cấu trúc / Đổi tên bảng dạng viền, Xóa bảng viền đỏ chữ đỏ.
- Thẻ Cấu trúc bảng / Dữ liệu bảng: gạch chân xanh, bỏ nền xám.
- Bảng cấu trúc: tiêu đề nền #F1F5F9 (theo mục 152), chữ đen đậm, **không viết hoa**; hàng 48px kẻ #E0E0E0; Type dạng nhãn xám chữ thường; Not null ô tích xanh; Key icon vàng.
- Phân trang dùng thành phần chuẩn (5.14).

**1b. Áp dụng chiều cao cố định cho màn Chi tiết CSDL đích** (PM yêu cầu làm trước ở màn này): khung trang cao bằng màn hình (`h-[calc(100vh-64px)]`), không kéo dài cả trang; cột trái cuộn riêng; cột phải giữ cố định tiêu đề bảng + nút + thẻ Cấu trúc/Dữ liệu, **bảng cấu trúc cuộn bên trong** (tiêu đề cột dính trên cùng), **phân trang luôn ở đáy**; chế độ Dữ liệu cuộn trong vùng nội dung.

**2. Quy định mới** — `tailieu/docs/compomennt.md` mục 5.4: modal Xem chi tiết và modal nhiều bước/nhiều tab có **chiều cao cố định** (`h-[90vh]`, tối đa 800px với modal ≤1024px), header/footer cố định, thân tự cuộn (`flex-1 min-h-0 overflow-y-auto custom-scrollbar`); modal nhỏ (xác nhận, nhập lý do) không áp dụng; tránh thanh cuộn lồng.

**Kiểm tra:** tsc không phát sinh lỗi mới (lỗi cũ `FilterItem.value`); `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Làm nổi bảng dữ liệu — thử ở Thiết lập thu thập (Ngày thực hiện: 07/10/2026) — 152

**Nội dung (PM yêu cầu):** tiêu đề bảng đang trùng màu nền trang (#F8FAFC) → quy định lại để bảng nổi bật hơn, kèm đổ bóng khung bảng. PM chọn **màu A + bóng mức vừa**, **làm thử ở màn Thiết lập thu thập** trước.

**Quy định thử:**
- Tiêu đề bảng: nền **#F1F5F9** (trước #F8FAFC) + kẻ dưới **#E2E8F0**; ô "Thao tác" ghim phải cùng nền.
- Khung bảng: nền trắng, viền #E2E8F0, bo 8px, **bóng mức vừa** `0 1px 3px rgba(16,24,40,0.10), 0 1px 2px rgba(16,24,40,0.06)`.
- Hàng dữ liệu giữ nguyên (nền trắng, kẻ #E0E0E0, di chuột #F8FAFC).

**File sửa:**
- `pages/collection/collectionUi.tsx` (dùng chung, chỉ thêm): `TABLE_HEAD_BG`, `TABLE_HEAD_ROW_CLS`, `TABLE_SHADOW`, `TABLE_WRAP_CLS`.
- `pages/collection/CollectionSetupPage.tsx` (bảng danh sách dịch vụ) và `pages/collection/LogManagement.tsx` (bảng tab Quản lý nhật ký) dùng các hằng trên.

**Chưa cập nhật `compomennt.md`** — chờ PM xem thử rồi chốt áp dụng toàn hệ thống.

**Kiểm tra:** tsc không có lỗi ở file sửa; `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Hoàn tác giao diện màn Chi tiết CSDL đích (Ngày thực hiện: 07/10/2026) — 151

**Nội dung (PM yêu cầu):** màn Chi tiết cơ sở dữ liệu đích giữ nguyên theo thiết kế cũ.

**File:** `processing/TargetDatabaseDetailPage.tsx` khôi phục về bản trước khi chuẩn hóa (commit `a9c1fb36`) — hoàn tác toàn bộ thay đổi của mục 150 trên màn này. Danh sách CSDL đích (`TargetDatabaseManagementPage.tsx`) và modal Thêm/Sửa (`TargetDatabaseModal.tsx`) vẫn giữ bản đã chuẩn hóa.

**Kiểm tra:** file trùng khớp bản `a9c1fb36`; tsc chỉ còn 1 lỗi cũ (`FilterItem.value`, có từ trước); `npm run build` thành công; đã xác nhận server port 3000 trả đúng bản cũ.

## Chuẩn hóa giao diện — Quản trị & vận hành › Danh mục đơn vị quản lý dữ liệu (Ngày thực hiện: 07/10/2026) — 150

**Nội dung (PM yêu cầu):** sửa giao diện mục Danh mục đơn vị quản lý dữ liệu theo `compomennt.md` (Quản lý kết nối + Quản lý CSDL đích); giữ nội dung, dữ liệu, logic.

**Quản lý kết nối** (`pages/collection/`): ConnectionManagementPage (3 tab chuẩn 5.9), UnitManagementPage, SourceSystemManagementPage, SourceSystemModal, SourceSystemDetailModal, SourceSystemDeleteConfirmModal, AgentManagementPage, AgentModal, AgentDetailModal, AgentDeleteConfirmModal.
- Tiêu đề trang H1 chuẩn + mô tả; tìm kiếm áp dụng khi bấm Tìm kiếm/Enter (không dấu); bảng 5.3 (cắt chữ + tooltip, cột Thao tác ghim phải, Badge cho loại/trạng thái, ngày giờ 2 dòng); phân trang chuẩn; công tắc trạng thái `role="switch"`.
- Modal 5.4 (tiêu đề 16px/500, nút X, footer #F8FAFC); xem chi tiết theo Nhãn – Giá trị 5.17, tiêu đề khối có vạch xanh; modal xóa theo kiểu ConfirmModal.
- Xóa đơn vị: `window.confirm` → ConfirmModal (thêm tiêu đề "Xác nhận xóa"); `alert()` → toast.
- Bộ lọc trạng thái Agent chuyển vào bảng lọc nâng cao, áp dụng khi bấm Tìm kiếm (thêm nhãn "Trạng thái").

**Quản lý CSDL đích** (`pages/processing/`): TargetDatabaseManagementPage, TargetDatabaseDetailPage, TargetDatabaseModal.
- Danh sách: H1 chuẩn, tìm kiếm + bộ lọc áp dụng khi bấm, bảng 5.3 (Badge Kiểu, cập nhật 2 dòng, công tắc chuẩn), 3 nút thao tác ghim phải, **phân trang thật** (thêm state trang; trước là khối phân trang giả).
- Chi tiết: bỏ gradient; Thông tin kết nối dạng Nhãn – Giá trị; danh sách bảng 13px, mục chọn nền #EAF3FF + vạch xanh, tìm bảng không dấu; Cấu trúc/Dữ liệu dùng tabClass; bảng cấu trúc & lưới dữ liệu 5.3 (số căn phải, ngày dd/mm/yyyy khi hiển thị, cắt chữ + tooltip); bộ lọc/sắp xếp theo ô 40px; "Ẩn/Hiện cột" chuyển thành popover; modal xóa bảng/xóa dữ liệu kiểu ConfirmModal; modal kết xuất header trắng, nút "Thực hiện" xanh chính (trước xanh lục); `alert()` → toast.
- Modal thêm/sửa CSDL đích: 5.4, ô 40px, footer chuẩn.

**Chờ PM quyết định:** xóa CSDL đích vẫn dùng `window.confirm` (chuyển sang ConfirmModal?); "Ẩn/Hiện cột" có dùng Tùy chọn cột đầy đủ (sắp xếp + lưu) không; nút "Áp dụng" của bộ lọc/sắp xếp dữ liệu chưa có xử lý (từ trước); tìm kiếm Agent theo IP như gợi ý trong ô; chú thích ghi chú trống "-" thay "Không có ghi chú nào."; tooltip "Xóa" cho nút ⊖ (chưa có xử lý) ở chi tiết Agent.

**Kiểm tra:** tsc không phát sinh lỗi mới (4 lỗi cũ ở TargetDatabaseDetailPage/TargetDatabaseModal có từ trước); `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Cung cấp dữ liệu theo yêu cầu — cột Thao tác đủ nút + mock đủ trạng thái (Ngày thực hiện: 07/10/2026) — 149

**Nội dung (PM yêu cầu):**
1. Tab **Tra cứu & kết xuất**: cột Thao tác luôn đủ 3 nút — Xem chi tiết, Tiếp nhận & phê duyệt (icon ✓), Thiết lập kết xuất. Đã bàn giao / Đã công khai / Hủy công khai / Từ chối: chỉ Xem chi tiết; Đã phê duyệt: Xem + Thiết lập kết xuất; Chờ xử lý: Xem + Phê duyệt.
2. Mock dữ liệu đầy đủ.
3. Tab **Bàn giao dữ liệu**: hiển thị đủ các nút Xem chi tiết, Hủy công khai, Công khai, Bàn giao dữ liệu trên cột thao tác.

**File sửa:** `provisioning/DataProvisionRequestPage.tsx`
- Tra cứu & kết xuất: luôn render 3 nút; nút không áp dụng **bị khóa** + tooltip lý do ("Chỉ phê duyệt yêu cầu ở trạng thái Chờ xử lý", "Chỉ thiết lập kết xuất khi yêu cầu đã được phê duyệt"). Trước đây tab này không có nút Xem chi tiết. Trạng thái **Đã kết xuất** (PM chưa nêu) giữ như trước: được Thiết lập kết xuất.
- Bàn giao dữ liệu: luôn hiện 4 nút theo thứ tự Xem chi tiết, Hủy công khai (đỏ khi bấm được), Công khai, Bàn giao dữ liệu — bỏ menu ⋯. Xem chi tiết mở chi tiết bàn giao (Đã bàn giao) / chi tiết công khai (Đã công khai, Đã hủy công khai) / chi tiết yêu cầu (còn lại). Hủy công khai chỉ bấm được khi Đã công khai; Công khai và Bàn giao chỉ bấm được khi Đã kết xuất (như trước).
- Mock: 3 → 9 yêu cầu, đủ 7 trạng thái (2 Chờ xử lý, 2 Đã phê duyệt, Đã kết xuất, Từ chối có lý do, Đã bàn giao có đơn vị/người nhận/ngày, Đã công khai có nền tảng/lý do/ngày, Đã hủy công khai có lý do + ngày hủy); mỗi yêu cầu có nội dung yêu cầu, khoảng thời gian dữ liệu, định dạng.

**Lưu ý quy chuẩn:** tab Bàn giao có 4 nút hiện trực tiếp theo yêu cầu PM (mục 5.3.2 quy định ≥4 thao tác dùng menu ⋯).

**Kiểm tra:** tsc không có lỗi ở file sửa; `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Quản lý API cung cấp & đối soát — tab Phân quyền truy cập bố cục dọc (Ngày thực hiện: 07/10/2026) — 148

**Nội dung (PM yêu cầu):** tab Phân quyền truy cập đổi từ 2 cột ngang (danh sách API bên trái 3/12, bảng quyền bên phải 9/12) sang bố cục dọc như ảnh PM gửi.

**File sửa:** `provisioning/DataProvisionApiManagementPage.tsx`
- Khối 1 **Danh sách dịch vụ API** rộng hết chiều ngang: tiêu đề, ô tìm kiếm có icon kính lúp, danh sách API (cuộn khi dài, cao tối đa 180px), mục đang chọn nền #EAF3FF + vạch xanh.
- Khối 2 nằm dưới: header nền #F8FAFC "API đang quản lý phân quyền" + tên API + nút **Cấp quyền mới**; bảng đơn vị được cấp quyền + phân trang nằm trong khối.
- Giữ nguyên nội dung: các cột bảng (Đơn vị được cấp quyền, Tài khoản, IP Whitelist, Thời hạn hiệu lực, Thu hồi), dữ liệu, tìm kiếm, hành vi.

**Khác ảnh (chờ PM quyết định):** ảnh có nhãn Công khai/Hạn chế cạnh tên API, bảng có cột STT, "Thời hạn hiệu lực từ"/"đến" tách 2 cột, Thao tác Sửa + Xóa — hiện chưa đổi vì là nội dung; tiêu đề "API ĐANG QUẢN LÝ PHÂN QUYỀN" viết hoa trong ảnh giữ chữ thường theo 5.17.

**Kiểm tra:** tsc không có lỗi ở file sửa; `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Thiết lập điều phối dữ liệu — nút Từ chối/Phê duyệt cho mọi trạng thái, đổi tên thẻ KPI (Ngày thực hiện: 07/10/2026) — 147

**Nội dung (PM yêu cầu):**
1. Tab Kiểm tra & Phê duyệt: thêm nút Từ chối / Phê duyệt cạnh nút Kiểm tra — PM chọn **hiện trên thẻ cho mọi trạng thái**.
2. Thẻ KPI đầu tab Thiết lập dịch vụ: nội dung và số thẻ theo ảnh PM.

**File sửa:** `provisioning/DataProvisionServiceSetupPage.tsx`
- Trước: nút Từ chối (Destructive) / Phê duyệt (Primary) chỉ hiện với dịch vụ **Chờ phê duyệt**. Sau: hiện với mọi dịch vụ; dịch vụ không ở trạng thái chờ → nút bị khóa (kiểu khóa chuẩn 5.1) + tooltip "Dịch vụ không ở trạng thái chờ phê duyệt". Bấm mở modal Từ chối / Phê duyệt dịch vụ cung cấp như hiện tại.
- Thẻ KPI: đủ 6 thẻ như ảnh (Tổng số API, Đang công khai, Chờ phê duyệt, Cần chỉnh sửa, Đã duyệt, Bản nháp); đổi tên thẻ "Đã từ chối" → **"Cần chỉnh sửa"** (vẫn đếm dịch vụ trạng thái từ chối). Số liệu lấy theo dữ liệu mẫu hiện có.

**Kiểm tra:** tsc không phát sinh lỗi mới (lỗi cũ `ProvisionServicePublishModal` props ở dòng ~779); `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Modal dịch vụ cung cấp — rộng hơn, tiêu đề theo tên bước, Trường gốc có tìm kiếm (Ngày thực hiện: 07/10/2026) — 146

**Nội dung (PM yêu cầu):**
1. Tăng chiều ngang modal cho vừa bảng "Chọn trường dữ liệu chia sẻ".
2. Bước Thiết kế cấu trúc gói tin thêm tiêu đề khối như các bước khác; tiêu đề khối mỗi bước **trùng tên bước**.
3. Cột "Nguồn dữ liệu" không cho chọn, chỉ hiển thị; cột "Trường gốc" cho tìm kiếm trong danh sách trường.
4. Thanh bước bên trái: giữ nguyên icon các bước đã qua (không đổi sang dấu ✓).
5. Bỏ khối **Giới hạn lưu lượng (Rate Limit)** ở bước Cấu hình API & Giao thức (bỏ phần hiển thị; biến trạng thái giữ lại, không ảnh hưởng chức năng khác).

**File sửa:**
- `provisioning/modals/ProvisionServiceModal.tsx`:
  - Modal `max-w-6xl` (1152px) → `max-w-[1440px]`.
  - Tiêu đề khối: "Thông tin định danh dịch vụ" → **Thông tin chung**; "Thiết lập kết nối & Bảo mật" → **Cấu hình API & Giao thức**; thêm **Thiết kế cấu trúc gói tin**; "Kiểm soát quyền hạn & Cấp phát Key" → **Phân quyền truy cập**.
  - Nguồn dữ liệu (Table): chữ chỉ đọc (tên bảng + dòng phụ Gốc/Liên kết/Mở), tự gán theo trường gốc đã chọn.
  - Trường gốc (Column): ô chọn có ô "Tìm trường dữ liệu..." (tìm không dấu); danh sách gồm cột của bảng gốc và bảng liên kết (ghi kèm tên bảng); chọn cột tự gán bảng nguồn + giữ cơ chế tự điền tên trường API/kiểu/mô tả.
  - Bỏ đổi icon sang ✓ ở bước đã qua.
- `collection/collectionUi.tsx` (dùng chung, chỉ thêm): `SearchableSelect` thêm tùy chọn `placeholder`, `disabled`, `contentClassName` (để danh sách nổi trên modal z-index cao). Nơi đang dùng (bộ lọc Hệ thống nguồn) không đổi.

**Kiểm tra:** tsc không có lỗi ở file sửa; `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Modal Thêm mới dịch vụ cung cấp — bố cục thanh bước dọc (Ngày thực hiện: 07/10/2026) — 145

**Nội dung (PM yêu cầu):** Cung cấp dữ liệu › Thiết lập điều phối dữ liệu — màn thêm mới dịch vụ cung cấp theo thiết kế PM gửi; giữ nguyên nội dung; theo component chung.

**File sửa:** `provisioning/modals/ProvisionServiceModal.tsx` (đã `[x]`).
- Bỏ header + thanh tab ngang → **thanh bước dọc bên trái** (rộng 256px, nền #F8FAFC, kẻ phải #E2E8F0): ô icon (nền #EAF3FF), tiêu đề "Dịch vụ Mới" / "Cấu hình Dịch vụ" / "Xem chi tiết Dịch vụ" 16px/500, dòng phụ "Điều phối dữ liệu"; 4 bước Thông tin chung → Cấu hình API & Giao thức → Thiết kế cấu trúc gói tin → Phân quyền truy cập; bước đang chọn nền #EAF3FF + vạch xanh bên trái, bước đã qua icon ✓ xanh; chỉ báo tiến độ "Step x of 4" chuyển xuống đáy thanh bên.
- Nút X đóng ở góc phải vùng nội dung; tiêu đề khối có vạch xanh bên trái.
- Footer toàn chiều rộng, nút căn phải: Lưu tạm, Hủy bỏ, (Quay lại), Tiếp tục / Trình duyệt — giữ nguyên hành vi; chế độ xem chỉ có Đóng.
- Thêm `role="dialog"`, `aria-modal`, `role="tablist"` dọc.
- Modal dùng chung ở Kiểm soát & giám sát cung cấp, Thiết lập dịch vụ (điều phối) → các nơi đó cũng đổi bố cục.

**Giữ nguyên nội dung:** dòng phụ "Điều phối dữ liệu" (ảnh mẫu ghi "API Provisioning Engine"), ô "Chia sẻ dữ liệu mở" giữ dạng hiện tại (ảnh mẫu là ô chọn "Loại dữ liệu chia sẻ").

**Kiểm tra:** tsc không có lỗi ở file sửa; `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Rà soát modal Xem chi tiết — Công bố dữ liệu mở (Ngày thực hiện: 07/10/2026) — 144

**Nội dung (PM yêu cầu):** kiểm tra các modal xem chi tiết của Dữ liệu mở › Công bố dữ liệu mở (`open-data/OpenDataPublishedListPage.tsx`) theo `compomennt.md`; chỉ sửa giao diện.

**Đã sửa:**
- **Chi tiết Yêu cầu công bố:** giá trị trống "N/A"/"—"/để trống → "-" (Từ khóa, Định dạng chia sẻ, Tần suất, Chủ đề, Mô tả, Ý kiến phê duyệt, Kho dữ liệu, Bảng chính, Người phê duyệt, Người tạo, Ngày tạo, Danh mục, Đơn vị chủ trì, Giấy phép); nhãn ô tích "Công bố dữ liệu ngay…" màu #020817; bảng trường dữ liệu: tiêu đề 42px, hàng 48px, chữ dài cắt "…" + tooltip, cột "Che dấu" (Badge) căn trái.
- **Phê duyệt yêu cầu công bố:** giá trị trống → "-" (tương tự, kể cả Định dạng chia sẻ trước không hiện gì); thẻ "Xem metadata" và "Xem trước dữ liệu dòng đầu": bảng 42px/48px, cắt chữ + tooltip, cột Badge căn trái; danh sách "Sau khi phê duyệt / từ chối" màu chữ #020817. Nút giữ nguyên (đã đúng: 1 nút chính).
- Ngày tạo bản ghi mới (2 chỗ) `7/10/2026` → `07/10/2026`.
- Modal Yêu cầu, Lịch, Gửi duyệt, Từ chối hàng loạt, Xóa lịch: không có chế độ xem → không sửa.

**Chờ PM quyết định:** chữ thay cho "-" ("Không có tên tệp", "Chưa cập nhật", "Không có mô tả"); modal Phê duyệt chưa có nút "Đóng" ở footer (chỉ đóng bằng X); Tần suất cập nhật trống mặc định hiện "Hàng tháng"; 2 modal khác tên cột ("Che dấu" Có/Không vs "Bảo mật (Mask)" Bảo mật/Không) và kiểu hiển thị Kiểu dữ liệu; Bảng liên kết (Join) dạng thẻ thay vì bảng; thẻ "Xem metadata" có thanh cuộn lồng trong modal.

**Kiểm tra:** tsc không có lỗi ở file sửa; `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Rà soát modal Xem chi tiết — Thiết lập danh mục dữ liệu mở (Ngày thực hiện: 07/10/2026) — 143

**Nội dung (PM yêu cầu):** kiểm tra các modal xem chi tiết của Dữ liệu mở › Thiết lập danh mục dữ liệu mở (`open-data/OpenDataSetupPage.tsx`) theo `compomennt.md`; chỉ sửa giao diện.

**Đã đúng chuẩn:** khung modal (z-[110], bo 16px, tiêu đề 16px/500, nút X, thân cuộn, footer #F8FAFC), 1 nút chính, Badge trạng thái, lưới Nhãn – Giá trị.

**Đã sửa:**
- **Chi tiết Metadata:** bỏ chữ nghiêng ở các dòng trống ("Không có mô tả", "Chưa chọn"…); nhãn phụ "CSDL đích"/"Bảng chính" dùng kiểu nhãn chuẩn; bảng JOIN hàng 48px, chữ dài cắt "…" + tooltip; "--" → "-".
- **Xem chi tiết giấy phép:** ô bị khóa theo 5.2 (chữ đen, nền #F0F0F0, viền rgba(0,0,0,0.26)) — chỉ ở chế độ xem; footer đổi thứ tự thành [Đóng] [Chỉnh sửa] (nút chính bên phải).
- **Chi tiết danh mục:** giá trị trống hiện "-" (trước để trống hoặc "--"); "Nội dung trình duyệt" hiển thị dạng giá trị thường (trước là khung xám giống ô nhập); Mô tả giữ xuống dòng; bỏ chữ nghiêng "Không có ghi chú".
- **Trình duyệt danh mục:** khối thông tin dùng kiểu Nhãn – Giá trị chuẩn, bỏ chữ đậm ở giá trị.
- Ngày tạo/cập nhật sinh khi thao tác (8 chỗ) `7/10/2026` → `07/10/2026` (`formatDateVN`).

**Chờ PM quyết định:** chữ thay cho "-" ("Không có mô tả", "Chưa chọn", "Chưa cấu hình", "Không có bảng JOIN", "Không có từ khóa", "Không có ghi chú"); ô Alias trống "—"; Ngày tạo giấy phép trống "--"; cùng trường `dataField` nhưng modal Từ chối ghi "Lĩnh vực" còn các modal khác ghi "Đơn vị chủ trì cung cấp"; nhãn "Ngừng hoạt động" vs chuẩn "Ngưng hoạt động"; modal Trình duyệt danh mục chưa có nút X.

**Kiểm tra:** tsc không có lỗi ở file sửa; `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Chuẩn hóa định dạng ngày dd/mm/yyyy — Thiết lập danh mục (Ngày thực hiện: 07/10/2026) — 142

**Nội dung (PM yêu cầu):** kiểm tra định dạng các trường ngày tháng trong Danh mục dùng chung › Thiết lập danh mục (chuẩn `compomennt.md`: dd/mm/yyyy, giờ HH:mm(:ss)).

**Đã đúng:** dữ liệu mẫu ngày gửi/ngày tạo (`dd/mm/yyyy HH:mm`), ngày cập nhật quan hệ, bảng tab Thiết lập và Phê duyệt.

**Đã sửa:**
- `CategorySetupPage.tsx`: 17 chỗ ghi ngày duyệt/từ chối/tạo/cập nhật dùng `toLocaleDateString('vi-VN')` → ra `7/10/2026` (thiếu số 0) → `07/10/2026` (`formatDateVN`); 2 chỗ ngày gửi yêu cầu hết hiệu lực / lịch sử dùng `toLocaleString('vi-VN')` (giờ đứng trước ngày) → `dd/mm/yyyy HH:mm`; mốc "hôm nay" để tự chuyển Hiệu lực dùng giờ địa phương (trước dùng UTC, lệch 1 ngày trước 7h sáng).
- `CategoryWizardModal.tsx`: ô **Ngày hiệu lực** trước là ô chữ tự do (gợi ý "VD: 20/12/2024" nhưng dữ liệu lưu `yyyy-mm-dd`, nên hiện `2025-01-10`) → ô chọn ngày `DateInput` dd/mm/yyyy (chế độ xem hiện dd/mm/yyyy ở ô khóa); ngày hiệu lực phiên bản và thời điểm hết hiệu lực hiển thị dd/mm/yyyy (trước dùng `new Date(iso).toLocaleDateString`).
- `ExpireApproveModal.tsx`: Thời điểm hết hiệu lực hiển thị dd/mm/yyyy.
- `ApprovalRequestModal.tsx` (Gửi phê duyệt › Hiệu lực) và `ExpireRequestModal.tsx` (Thời điểm hết hiệu lực): ô `type="date"` của trình duyệt → `DateInput` dd/mm/yyyy (giá trị/kiểm tra dữ liệu không đổi). Tự mở khóa `[x]` 2 mục trong `stauts.md`.

**Ngoài phạm vi (chưa sửa):** `CreateVersionModal`, `PublishConfigModal` (dùng ở màn Biên tập/Công khai danh mục), tab Lịch sử phiên bản (đang ẩn) vẫn dùng ô ngày của trình duyệt.

**Kiểm tra:** tsc không phát sinh lỗi mới; `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Phê duyệt danh mục — Xem chi tiết dùng chung màn của Thiết lập danh mục (Ngày thực hiện: 07/10/2026) — 141

**Nội dung (PM yêu cầu):** tab Phê duyệt › Phê duyệt danh mục, bấm Xem chi tiết → hiển thị giống màn Xem chi tiết ở Thiết lập danh mục.

**File sửa:**
- `category/CategorySetupPage.tsx`: Xem chi tiết yêu cầu **danh mục** mở Wizard chế độ xem (`Chi tiết danh mục dùng chung`, 3 bước Thông tin chung / Cấu trúc / Quan hệ) thay cho `CategoryInfoViewModal`. Phê duyệt cấu trúc, phiên bản, hết hiệu lực giữ modal cũ. Xem chi tiết từ tab Thiết lập không đổi.
- `category/components/modals/CategoryWizardModal.tsx`: thêm prop tùy chọn `approvalActions` — khi mở từ yêu cầu **đang chờ** thì footer có thêm **Từ chối** (Destructive) và **Phê duyệt** (Primary); nút "Tiếp tục" chuyển sang Outline để chỉ còn 1 nút chính. Bấm Phê duyệt/Từ chối mở modal phê duyệt/từ chối hiện có (nhập ghi chú, thông báo chuyển sang phê duyệt cấu trúc vẫn hoạt động). Yêu cầu đã duyệt/từ chối: chỉ xem.

**Kiểm tra:** tsc không phát sinh lỗi mới; `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Thanh thẻ con trong tab Phê duyệt — Thiết lập danh mục (Ngày thực hiện: 07/10/2026) — 140

**Nội dung (PM yêu cầu):** thanh thẻ Phê duyệt danh mục / cấu trúc / phiên bản / hết hiệu lực đổi theo thiết kế PM gửi (ảnh 2).

**File sửa:** `category/components/tabs/ApprovalTab.tsx`
- Trước: thẻ gạch chân 48px 14px/600 (`tabClass`) + đường kẻ dưới cả thanh.
- Sau: thẻ dạng nút gọn, cao 32px, bo 6px, chữ 13px/500, khoảng cách 4px; **đang chọn** nền `#EAF3FF` chữ/icon `#155DFC`; **thường** chữ `#475569`, di chuột nền `#F1F5F9`; bỏ đường kẻ dưới. Thêm `role="tablist"/"tab"`, `aria-selected`.
- Icon 2 thẻ đầu đổi từ ô tích sang bút (`SquarePen`) theo ảnh; giữ nguyên chữ, thứ tự và hành vi (đổi thẻ vẫn reset bộ lọc trạng thái).

**Kiểm tra:** tsc không phát sinh lỗi mới; `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Rà soát modal Xem chi tiết — Thiết lập danh mục (Ngày thực hiện: 07/10/2026) — 139

**Nội dung (PM yêu cầu):** kiểm tra các modal xem chi tiết của Danh mục dùng chung › Thiết lập danh mục theo `compomennt.md`; chỉ sửa giao diện, giữ nội dung và dữ liệu.

**Đã đúng chuẩn (không sửa):** Xem chi tiết yêu cầu danh mục (`CategoryInfoViewModal`), Xem cấu trúc (`CategoryStructureViewModal`).

**Đã sửa:**
- `ReviewResultCard.tsx` (khung kết quả phê duyệt/từ chối trong modal xem): dạng banner nền nhạt cùng tông, tiêu đề FIELD_LABEL, nội dung FIELD_VALUE, bỏ chữ nghiêng/slate. *Dùng chung với `master-data/MasterDataScaleManagementPage.tsx` → màn đó cũng đổi giao diện khung này.*
- `CategoryVersionChangeModal.tsx`: khối phiên bản bo `rounded-2xl` (4.3); tiêu đề khối 14px/500 #020817 (GROUP_TITLE); giá trị trống "—" → "-" (5.17).
- `ExpireApproveModal.tsx`: giá trị trống "--" → "-".
- `ReviewApprovalModal.tsx`: mỗi thẻ yêu cầu trước có nút Phê duyệt (Primary) + Từ chối (Destructive) riêng → nhiều nút chính trong 1 modal (sai 5.1). Nút trong thẻ đổi sang Outline có icon xanh/đỏ; footer giữ duy nhất "Phê duyệt tất cả" (Primary) và "Từ chối tất cả" (Destructive). Tiêu đề yêu cầu GROUP_TITLE; giá trị trống "-"; Mô tả giữ xuống dòng.
- `CategoryWizardModal.tsx` (chế độ Xem chi tiết): ô bị khóa theo 5.2 (VIEW_FIELD_CLS — chữ đen, nền #F0F0F0, viền rgba(0,0,0,0.26)); ô "Nội dung trình duyệt" cùng kiểu; giá trị trống "-". **Bước 3 (Quan hệ) ở chế độ xem trước đây vẫn hiện nút "Thêm mới quan hệ" và Sửa/Xóa** → nay truyền `readOnlyRelations` để chỉ còn "Xem chi tiết quan hệ" (chế độ chỉnh sửa không đổi).
- `tabs/RelationshipsTab.tsx` (modal Chi tiết quan hệ danh mục): giá trị trống "--" → "-". Tự mở khóa `[x]` trong `stauts.md`.

**stauts.md:** tự mở khóa `[x]` CategoryWizardModal, ReviewApprovalModal, ExpireApproveModal, RelationshipsTab.

**Chờ PM quyết định:** chữ "Chưa cập nhật"/"Không có ghi chú" thay cho "-"; ô trống trong bảng ("--", "—"); dấu * ở nhãn bước 1 khi xem; ô chọn danh mục ở tab Quan hệ khi xem; chữ "N/A" và ngoặc kép ở "Ghi chú yêu cầu"; modal chi tiết trong tab Lịch sử phiên bản (tab đang ẩn, chưa chuẩn).

**Kiểm tra:** tsc không phát sinh lỗi mới (lỗi cũ `__activeModalsCount` ở Wizard, import `MouseEvent` ở RelationshipsTab); `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Chuyển nhanh giữa Phê duyệt danh mục ↔ Phê duyệt cấu trúc — Thiết lập danh mục (Ngày thực hiện: 07/10/2026) — 138

**Nội dung (PM duyệt phương án B):** sau khi phê duyệt danh mục, có nút chuyển sang phê duyệt cấu trúc của danh mục đó; nghiệp vụ không bắt buộc thứ tự nên làm cả chiều ngược lại (cấu trúc → danh mục).

**Hoạt động:**
- Phê duyệt danh mục / cấu trúc (duyệt từng dòng, modal xem chi tiết, Phê duyệt nhanh, Phê duyệt tất cả) → thông báo "Đã phê duyệt …".
- Nếu cùng danh mục còn yêu cầu loại kia **đang chờ**: thông báo ghi số yêu cầu đang chờ + nút **"Chuyển sang phê duyệt cấu trúc" / "Chuyển sang phê duyệt danh mục"** (giữ 8 giây). Bấm → chuyển thẻ tương ứng, lọc trạng thái "Chờ phê duyệt" và **lọc sẵn danh mục**; hiện chip "Đang lọc theo danh mục: DM-… ✕" để bỏ lọc. Tự đổi thẻ thủ công cũng bỏ lọc.
- Không còn yêu cầu chờ → chỉ thông báo đã phê duyệt.
- Modal phê duyệt đơn: tiêu đề "Phê duyệt danh mục dữ liệu mở" → **"Phê duyệt danh mục"**.

**Dữ liệu mẫu bổ sung (để thử):** mock cũ không có yêu cầu cấu trúc nào đang chờ (yêu cầu cấu trúc DM-GIOITINH #9 là *Từ chối*) nên thông báo không có nút chuyển. Thêm 3 yêu cầu cấu trúc **Chờ phê duyệt**: #20 DM-GIOITINH, #21 DM-HC (cùng có yêu cầu danh mục đang chờ → có nút chuyển), #22 DM-QUOCGIA (chỉ có cấu trúc chờ). DM-DANTOC chỉ có yêu cầu danh mục chờ.

**File sửa:** `category/CategorySetupPage.tsx`, `category/components/tabs/ApprovalTab.tsx`, `category/components/modals/SimpleApproveModal.tsx` (tự mở khóa `[x]` 3 mục trong `stauts.md`). Không đổi logic phê duyệt cũ.

**Kiểm tra:** tsc không phát sinh lỗi mới (lỗi cũ `setShowEditModal`, `defaultAttribute` ở CategorySetupPage có từ trước); `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Ô tìm kiếm trong bộ lọc Hệ thống nguồn — Thiết lập thu thập (Ngày thực hiện: 07/10/2026) — 137

**Nội dung (PM yêu cầu):** bộ lọc nâng cao màn danh sách Thiết lập thu thập — ô **Hệ thống nguồn** có ô tìm kiếm bên trong danh sách (theo ảnh PM).

**File sửa:**
- `src/components/pages/collection/collectionUi.tsx` (dùng chung, chỉ thêm): component `SearchableSelect` (Combobox mục 5.11) — nút chọn cùng kiểu ô nhập 40px; mở ra có ô "Tìm …" ở đầu danh sách; tìm không phân biệt dấu/hoa thường; mục đang chọn tô xanh + dấu ✓; ↑ ↓ / Enter / Esc; không có kết quả → "Không tìm thấy kết quả phù hợp".
- `src/components/pages/collection/CollectionSetupPage.tsx`: ô Hệ thống nguồn dùng `SearchableSelect` (placeholder "Tìm hệ thống nguồn..."), giữ nguyên 9 lựa chọn và logic lọc (áp dụng khi bấm Tìm kiếm).

**Kiểm tra:** tsc không phát sinh lỗi mới; `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Chuẩn hóa định dạng ngày dd/mm/yyyy — Quản lý thu thập (Ngày thực hiện: 07/10/2026) — 136

**Nội dung (PM yêu cầu):** rà toàn bộ trường ngày tháng và bộ lọc ngày của module Quản lý thu thập, chỗ nào chưa đúng thì đưa về một định dạng. PM chốt **dd/mm/yyyy** (đúng `compomennt.md` mục 5.3, 5.3.3, 5.10).

**Nguyên nhân chính:** các ô lọc ngày dùng `<input type="date">` của trình duyệt → hiển thị theo ngôn ngữ trình duyệt (trình duyệt tiếng Anh hiện mm/dd/yyyy).

**Thành phần dùng chung mới** (`pages/collection/collectionUi.tsx`, chỉ thêm, không đổi phần cũ):
- `DateInput`: ô ngày luôn hiển thị **dd/mm/yyyy** (gõ tay tự chèn "/", báo viền đỏ khi ngày không hợp lệ, icon lịch mở bộ chọn ngày). Giá trị vào/ra vẫn là ISO `yyyy-mm-dd` → không đổi logic lọc.
- `isoToDisplayDate`, `displayToIsoDate`, `formatDateVN`, `toLocalIsoDate` (ISO theo giờ địa phương).

**Đã sửa:**
- Ô lọc ngày → `DateInput`: Tổng quan thu thập (`collection/CollectionDashboard.tsx`, giữ giới hạn min/max 31 ngày), Thiết lập thu thập (`CollectionSetupPage.tsx`), Quản lý nhật ký (`LogManagement.tsx`), Đối soát — danh sách (`ReconciliationTemplate.tsx`) và Lịch sử đối soát (`ReconciliationHistoryTab.tsx`), modal Xem chi tiết Agent — tab Lịch sử (`AgentDetailModal.tsx`).
- Ngày hiển thị dạng `yyyy-mm-dd` → `dd/mm/yyyy` (giữ dữ liệu mock ISO để bộ lọc vẫn đúng): bảng Đối soát, Lịch sử đối soát, Nhật ký đối soát, Thiết lập dịch vụ đối soát, "Nguồn gọi" ở modal chi tiết đối soát.
- Lịch sử hoạt động (modal Xem chi tiết dịch vụ): `09-10-2025 15:06:34` → `09/10/2025 15:06:34` (7 dòng).
- Agent: `11/20/2025` (mm/dd) → `20/11/2025`; `17:44:54 20-11-2025` → `20/11/2025 17:44:54` (`mockAgents.ts`).
- Thông báo gửi hệ thống nguồn (Thiết lập thu thập): `toLocaleString('vi-VN')` (giờ trước ngày) → `dd/mm/yyyy HH:mm:ss`.
- Sửa lệch 1 ngày do `toISOString()` (UTC) ở ngày mặc định của Tổng quan thu thập, Thiết lập thu thập và ngày gọi cuối khi thêm cấu hình đối soát.

**Giữ nguyên (cấu hình / dữ liệu mẫu cố ý):** định dạng ngày gửi API `yyyy-MM-dd'T'HH:mm:ss` (Cấu hình kết nối), JSON mẫu API nhận, các ví dụ dữ liệu sai định dạng dùng để minh họa lỗi (`mockCollectionServices`, `ServiceDataDetailPage`), ô giờ `type="time"` ở Cấu hình thu thập. Màn Xem dữ liệu thu thập (các CSDL) đã đúng dd/mm/yyyy.

**stauts.md:** tự mở khóa `[x]` CollectionSetupPage, LogManagement, ViewServiceModal › Tab Lịch sử hoạt động, ReconciliationTemplate, Internal/ExternalCategories/ExternalCourtJudgment ReconciliationPage, ReconciliationServiceSetupTab/HistoryTab/LogTab, ReconciliationDetailModal.

**Kiểm tra:** tsc không phát sinh lỗi mới (còn lỗi cũ kiểu recharts ở CollectionDashboard); `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Tính năng mới — Lịch sử phiên bản bản ghi (Xem dữ liệu thu thập › Hộ tịch) (Ngày thực hiện: 07/10/2026) — 135

**Nội dung (PM yêu cầu):** cột Thao tác thêm nút **Lịch sử phiên bản**; bấm mở modal **Lịch sử phiên bản** (nội dung theo ảnh PM, giao diện theo `compomennt.md`).

**File sửa / thêm:**
- `src/components/civil-registry/CivilRegistryInfoTable.tsx`: nút icon `History` 32×32 (tooltip "Lịch sử phiên bản") cạnh nút Xem chi tiết; cột Thao tác rộng thêm cho 2 nút.
- `src/components/civil-registry/CivilRegistryInfoModal.tsx`: mở modal phiên bản cho bản ghi được chọn.
- **Mới** `src/components/civil-registry/CivilRegistryVersionHistoryModal.tsx`:
  - Tiêu đề "Lịch sử phiên bản" + chú giải: mỗi dòng là một lần thay đổi (mới nhất trên cùng); ô tô vàng = giá trị khác phiên bản gần nhất trước đó có cột này (di chuột xem giá trị cũ); viền đỏ = dòng đã bị xóa ở nguồn sau phiên bản này; "—" = cột không có trong cấu trúc ở phiên bản đó.
  - Bảng: **Phiên bản** (vN, badge "Mới nhất", "n trường thay đổi" / "Bản đầu tiên", badge "Đã xóa" + thời điểm, "Cấu trúc đổi: thêm …"), **Thời điểm lưu vào kho**, rồi các cột dữ liệu **theo Tùy chọn cột đang hiển thị**. 2 cột đầu cố định khi cuộn ngang; tiêu đề bảng cố định khi cuộn dọc.
  - Phân trang (5.14); footer nút **Đóng** (Outline).
  - Dữ liệu phiên bản là **mock** sinh từ bản ghi hiện tại (3–5 phiên bản, mỗi phiên bản đổi 1 trường, cột cuối được thêm ở v3, một số bản ghi có phiên bản "Đã xóa").

**Kiểm tra:** tsc không phát sinh lỗi mới ở file sửa (lỗi cũ ở `civil-registry-change/CivilRegistryChangeTable.tsx`); `npm run build` thành công; đã xác nhận server port 3000 trả đúng code mới.

## Xem chi tiết dịch vụ thu thập — bỏ khung trạng thái kết nối (Ngày thực hiện: 07/10/2026) — 134

**Nội dung (PM yêu cầu):** tab Cấu hình kết nối (modal Xem chi tiết) bỏ khung "Kết nối đang hoạt động tốt / Kiểm tra lần cuối" với các phương thức **API, API nhận (XML), API nhận (JSON), Tải file**.

**File sửa:** `src/components/pages/collection/ViewServiceModal.tsx` — khung trạng thái chỉ còn hiển thị với **Cơ sở dữ liệu** (giữ nguyên nội dung, gồm cả các trạng thái lỗi/tạm ngưng).

**Kiểm tra:** tsc không phát sinh lỗi mới; `npm run build` thành công.

## Gộp tiêu đề nhóm (H3) vào H2 (Ngày thực hiện: 07/10/2026) — 133

**Nội dung (PM chốt):** bỏ cấp Tiêu đề nhỏ (H3, 13px); tiêu đề nhóm dùng chung cỡ H2 **14px / 500 / #020817**.

**File sửa:**
- `tailieu/docs/compomennt.md` mục 1: bỏ dòng H3; H2 ghi rõ áp dụng cho cả tiêu đề khối và tiêu đề nhóm (tiêu đề khối có vạch xanh — `SECTION_TITLE`; tiêu đề nhóm không vạch — `GROUP_TITLE`).
- `src/components/pages/collection/collectionUi.tsx` (dùng chung): thêm hằng `GROUP_TITLE`, không đổi hằng cũ.
- `ConnectionConfigSection.tsx`: "Phân trang gửi nguồn", "Vị trí phân trang trong response", "Hiệu năng & điều tiết" 13px/600 → 14px/500.
- `ViewServiceModal.tsx`: "① API dữ liệu", "② API danh sách xóa" 13px/600 → 14px/500.

**Phạm vi:** các màn khác còn tiêu đề nhóm 13px viết rời sẽ sửa dần khi chuẩn hóa từng màn.

**Kiểm tra:** tsc không phát sinh lỗi mới; `npm run build` thành công.

## Xem chi tiết dịch vụ thu thập — tab Cấu hình kết nối theo từng phương thức (Ngày thực hiện: 07/10/2026) — 132

**Nội dung (PM yêu cầu):** modal Xem chi tiết › tab **Cấu hình kết nối** hiển thị nội dung tương ứng từng phương thức (theo ảnh PM gửi), giao diện theo `compomennt.md`; **Cơ sở dữ liệu giữ nguyên**.

**File sửa:**
- `src/components/pages/collection/ViewServiceModal.tsx` (tự mở khóa `[x]` "Tab Cấu hình kết nối" trong `stauts.md`). Giữ nguyên khung trạng thái kết nối phía trên.
  - Phương thức kết nối hiển thị bằng **Badge** (mục 5.8) cho mọi loại.
  - **API:** Loại thu thập, Method, URL, Máy chủ thực thi, Trạm kết nối; khối **① API dữ liệu** (thẻ Params / Authorization / Headers 3 / Body chỉ đọc; data path, định dạng ngày, totalPages, totalElements); khối **② API danh sách xóa** (URL, thẻ yêu cầu, deleted path).
  - **API nhận (JSON):** Tách bảng con từ mảng lồng; Dữ liệu JSON mẫu (khung code cuộn được + nút Sao chép); ghi chú nguồn PUSH.
  - **API nhận (XML):** Tách bảng con từ mảng lồng, Danh mục dùng chung; Dữ liệu XML mẫu (thẻ tệp `dauGiaVien.xml` + Tải xuống); ghi chú nguồn PUSH.
  - **Tải file:** Máy chủ thực thi, Trạm kết nối; Tệp đính kèm `nhan-vien.csv` (1 KB) + Tải xuống.
  - **Cơ sở dữ liệu:** giữ nguyên các trường.
  - Trường Bật/Tắt hiển thị dạng Nhãn – Giá trị (5.17) thay vì checkbox mờ; ghi chú PUSH chữ thường (5.17 không dùng in nghiêng); bảng Params/Headers dạng chữ (5.3) thay vì ô nhập bị khóa.
- **Sửa lỗi:** modal Xem chi tiết và Chỉnh sửa trước đây đọc `service.connectionType` (không có trong dữ liệu danh sách) nên mọi dịch vụ đều hiện là API. Thêm `resolveConnectionType` trong `collectionUi.tsx` để quy đổi từ `connectionMethod` (API / API nhận (JSON) / API nhận (XML) / Cơ Sở Dữ Liệu / File). File dùng chung `collectionUi.tsx` chỉ thêm hàm mới, không đổi hàm cũ.

**Dữ liệu mẫu (mock) mới:** JSON 5 bản ghi (HS001–HS005), nội dung tệp XML/CSV khi tải xuống, 3 Headers (Content-Type, Accept, x-client-id), Authorization "No Authen", Body "-".

**Kiểm tra:** tsc không phát sinh lỗi mới; `npm run build` thành công.

## Form API nhận (JSON/XML), Tải file + chiều cao cố định modal — Thiết lập thu thập (Ngày thực hiện: 07/10/2026) — 131

**Nội dung (PM yêu cầu):** tab Cấu hình kết nối — làm 3 form API nhận (JSON), API nhận (XML), Tải file theo mockup PM; 3 form này không có nút Kiểm tra kết nối; modal Thêm mới giữ chiều cao cố định, cuộn bên trong khi cần.

**File sửa:**
- `src/components/pages/collection/ConnectionConfigSection.tsx`
  - **API nhận (JSON):** "Dữ liệu JSON mẫu *" — radio *Tải lên file JSON* / *Nhập raw JSON*; ô chọn tệp "Click để chọn file JSON mẫu" + gợi ý "File phải chứa mảng data[] và object duLieuTiepNhan"; raw JSON có nút "Định dạng JSON" (báo lỗi khi sai); checkbox **Tách bảng con từ mảng lồng** (i).
  - **API nhận (XML):** tương tự với XML ("Click để chọn file XML mẫu"); checkbox **Tách bảng con từ mảng lồng** (i) và **Danh mục dùng chung**.
  - **Tải file:** chỉ còn "Tập tin tải lên *" — "Click để chọn file CSV, XLS, XLSX".
  - Chọn tệp xong hiển thị tên tệp + nút Xóa (mục 5.13).
  - Bỏ các trường cũ của 3 form: Tên api, URL, Headers1, Máy chủ thực thi, Trạm kết nối, Method, Authorization, Body, Thông tin mở rộng (API nhận); Tên File CSDL, Máy chủ thực thi, Trạm kết nối (Tải file).
- `src/components/pages/collection/ServiceModals.tsx` (tự mở khóa `[x]` AddServiceModal, EditServiceModal trong `stauts.md`)
  - Nút **Kiểm tra kết nối** chỉ hiện với API và Cơ sở dữ liệu (ẩn với API nhận JSON/XML và Tải file).
  - Modal Thêm mới và Chỉnh sửa: chiều cao cố định `90vh` (trước: co giãn theo nội dung, tối đa 95vh); thân modal cuộn bên trong (custom-scrollbar).
  - **Footer cố định** (Kiểm tra kết nối / Hủy / Tiếp tục): luôn nằm sát đáy modal, không trôi theo nội dung (`sticky bottom-0`; nội dung ngắn vẫn đẩy footer xuống đáy).

**Kiểm tra:** tsc không phát sinh lỗi mới (còn lỗi cũ `AdvancedDataMapping` ở ServiceModals.tsx, `ServiceModals_Old.tsx`); `npm run build` thành công.

## Thiết kế lại tab Cấu hình kết nối — Thiết lập thu thập (Ngày thực hiện: 07/10/2026) — 130

**Nội dung (PM yêu cầu):** modal Thêm mới / Chỉnh sửa dịch vụ thu thập › tab **Cấu hình kết nối**: mỗi phương thức kết nối một giao diện riêng; **API** làm theo mockup PM gửi; toàn tab chuẩn hóa theo `compomennt.md`.

**File sửa:** `src/components/pages/collection/ConnectionConfigSection.tsx` (tự mở khóa `[x]` trong `stauts.md` dòng 52). Dùng chung cho Thêm mới và Chỉnh sửa (`ServiceModals.tsx` không đổi).

**Phương thức API (mới, theo mockup):**
- **Loại thu thập *** (thẻ chọn): *Kéo 1 lần* — Gọi 1 lần, không phân trang / *Theo mẫu (đồng bộ)* — Full-load phân trang + delta.
- **Nhóm tham số** (select + nút 👁 xem, khóa khi chưa chọn) + gợi ý "+ tham số".
- *Theo mẫu*: **Cấu hình cho API nào?** — API dữ liệu / API danh sách xóa (mỗi API giữ cấu hình yêu cầu riêng).
- **Yêu cầu *** = Method + URL; thẻ phụ **Params / Authorization / Headers (số lượng) / Body**:
  - Params, Headers: bảng STT/Key/Value/Thao tác + Thêm mới (Headers mặc định `Content-Type: application/json`).
  - Authorization: No Authen / Basic Authen (Tài khoản, Mật khẩu) / Bearer Token (Nhập token) trong khung "Thông tin mở rộng" thu gọn được.
  - Body: raw (JSON) có nút "Định dạng JSON" (báo lỗi khi sai JSON) / form-data / x-www-form-urlencoded (bảng Key–Value).
- **Đường dẫn dữ liệu (data path)** (bắt buộc ở Theo mẫu), toggle **Tách bảng con từ mảng lồng**, *Kéo 1 lần* thêm toggle **Đồng bộ xóa theo khóa**.
- *Theo mẫu › API dữ liệu*: Định dạng ngày (mặc định `yyyy-MM-dd'T'HH:mm:ss`), Phân trang gửi nguồn (page khởi tạo 0, pageSize 1000), Vị trí phân trang trong response * (totalPages, totalElements), Hiệu năng & điều tiết (SEQUENTIAL/PARALLEL + số luồng, khóa khi SEQUENTIAL).
- *Theo mẫu › API danh sách xóa*: Yêu cầu (API danh sách xóa) + **Đường dẫn khóa bị xóa (deleted path) ***.
- Bỏ các trường cũ của API: Tên api, Máy chủ thực thi, Trạm kết nối, Body dạng ô 1 dòng, Loại token "Lấy token từ API".

**API nhận (JSON/XML), Cơ sở dữ liệu, Tải file:** giữ nguyên nội dung, chỉ chuẩn hóa giao diện (ô 40px, nhãn 13px/500 đen, * đỏ, bảng 5.3, nút Xóa dạng icon trong bảng, toggle 5.12, dropzone 5.13). PM cho biết API nhận XML/JSON sẽ có mẫu riêng — chờ PM gửi.

**Chuẩn component:** nút Thêm mới trong bảng dùng Outline (mỗi màn chỉ 1 Primary — "Tiếp tục"); nút Xóa trong bảng dùng icon 32×32 có tooltip; thẻ phụ cao 40px 13px/600 cùng màu Tabs 5.9.

**Nội dung mới chờ PM duyệt:** 2 lựa chọn mẫu của Nhóm tham số ("Nhóm tham số ngày đồng bộ", "Nhóm tham số xác thực"); tooltip "Đồng bộ xóa theo khóa": "Xóa bản ghi tại kho khi khóa không còn trong dữ liệu nguồn"; lựa chọn PARALLEL (mặc định 4 luồng).

**Kiểm tra:** tsc không phát sinh lỗi mới (còn lỗi cũ `AdvancedDataMapping` ở ServiceModals.tsx, `ServiceModals_Old.tsx`); `npm run build` thành công.

## Cập nhật menu — Đối soát dữ liệu (Ngày thực hiện: 07/10/2026) — 129

**Nội dung (PM yêu cầu):** Sidebar › Quản lý thu thập › Đối soát dữ liệu: đổi tên 2 nhóm cấp 2 và đưa CSDL Trong ngành lên trên cho đồng bộ với các mục khác.
- "Đối soát dữ liệu từ Bộ trong ngành" → **CSDL Trong ngành** (lên trên).
- "Đối soát dữ liệu từ Bộ ngoài ngành" → **CSDL Ngoài ngành** (xuống dưới).
- Giữ nguyên id route và các mục con.

**File sửa:** `src/components/layout/Sidebar.tsx` (thứ tự + nhãn), `src/components/layout/MainLayout.tsx` (breadcrumb 17 route đối soát).

**Chưa sửa:** `src/components/pages/admin/menuStructure.ts` (cây menu dùng cho Quản trị › phân quyền) vẫn để tên/thứ tự cũ — chờ PM xác nhận (module Quản trị đang tạm hoãn).

**Kiểm tra:** tsc không phát sinh lỗi mới ở file sửa; `npm run build` thành công.

## Tính năng mới — Điều hướng tới CSDL làm sạch từ Xử lý dữ liệu (Ngày thực hiện: 07/10/2026) — 128

**Nội dung (PM yêu cầu):** sau khi xử lý dữ liệu xong, cho phép điều hướng tới CSDL đích để xem dữ liệu sau xử lý. PM chốt: chỉ thêm 1 dòng **CSDL làm sạch** dưới dòng Nguồn dữ liệu / Dữ liệu, kèm nút xem dữ liệu; bấm thì chuyển sang màn Chi tiết CSDL đích, **không** hiển thị dải thông tin "đang xem dữ liệu sau xử lý" (nhiều bảng xử lý có thể đổ về 1 bảng đích).

**File sửa:** `src/components/pages/processing/GenericProcessingPage.tsx` (tự mở khóa `[x]` trong `stauts.md`).
- Dòng `CSDL làm sạch: <tên CSDL>` + nút chữ "Xem dữ liệu ↗" (icon mũi tên chéo ArrowUpRight đặt sau chữ, màu #155DFC — PM đổi từ icon mắt) → `navigateToPage('target-database-detail-{id}')`.
- Tên CSDL lấy từ CSDL đích chọn khi cấu hình ánh xạ; chưa cấu hình thì mặc định CSDL đích đầu tiên trong mock (`CSDL Kho DLDC`).

**Kiểm tra:** tsc không phát sinh lỗi mới ở file sửa; `npm run build` thành công.

## Tính năng mới — Sắp xếp thứ tự cột (Ngày thực hiện: 07/10/2026) — 127

**Nội dung (PM yêu cầu):** "Sắp xếp được thứ tự hiển thị các trường dữ liệu". Hiện tại khi xem dữ liệu thu thập, thứ tự cột không giống thứ tự lúc nạp cấu trúc (một vài trường hợp). PM duyệt **phương án A**: tích hợp sắp xếp vào nút Tùy chọn cột. Làm thử trên **Xem dữ liệu thu thập › CSDL Hộ tịch**.

**Thay đổi:**
- `pages/collection/collectionUi.tsx`:
  - `useVisibleColumns` lưu thêm **thứ tự** (`{ order, visible }`).
    - Có hàm `move(từ, đến)`; `visibleColumns` trả theo thứ tự đã sắp.
    - Cột mới chưa có trong dữ liệu đã lưu được nối cuối.
    - Đọc được dữ liệu lưu dạng cũ (mảng).
    - `isDefault` xét cả thứ tự. `reset` trả cả ẩn/hiện lẫn thứ tự.
  - `ColumnPicker` chuyển từ DropdownMenu sang **Popover**, vì khung cần nhiều nút tương tác trong cùng một dòng. Mỗi dòng gồm:
    - Tay cầm kéo `⋮⋮` (kéo-thả HTML5 có sẵn, **không thêm thư viện**); vạch xanh `#155DFC` báo vị trí thả, dòng đang kéo mờ 50%.
    - Ô tích ẩn/hiện.
    - Nút ↑ ↓ (hiện khi rê chuột/focus, khóa ở dòng đầu/cuối).
  - Tiêu đề khung đổi thành "Hiển thị & sắp xếp cột", kèm dòng hướng dẫn.
- `civil-registry/CivilRegistryInfoModal.tsx`: truyền thêm `order`, `onMove`. Thứ tự mặc định = thứ tự khai báo cột (coi như thứ tự nạp cấu trúc).
- `compomennt.md` mục 5.20: bổ sung quy chuẩn sắp xếp.

**Lưu ý:** PM chưa cung cấp thứ tự chuẩn của bộ Khai sinh theo cấu trúc. Thứ tự mặc định đang giữ như hiện tại; khi có thứ tự chuẩn chỉ cần đổi thứ tự khai báo cột.

**Kiểm tra (chạy app):**
0. Lựa chọn đã lưu theo định dạng cũ vẫn đọc đúng.
1. Mặc định 4 cột; khung "Hiển thị & sắp xếp cột", 15 dòng có tay cầm.
2. ↓ "Họ và tên": bảng đổi ngay thành Giới tính | Họ và tên…, khung vẫn mở.
3. ↑ "Họ và tên": trả lại như cũ.
4. Kéo "Mã hồ sơ" lên đầu: có vạch xanh khi kéo, danh sách đổi.
5. Bật "Mã hồ sơ": cột hiện ở vị trí đầu; nút có chấm xanh.
6. Tải lại trang: giữ cả thứ tự lẫn ẩn/hiện.
7. Khôi phục mặc định: về 4 cột thứ tự gốc; nút Khôi phục bị khóa.
- Không lỗi/cảnh báo console. `tsc` không lỗi. `vite build` thành công.

## Tính năng mới — Tùy chọn cột (Ngày thực hiện: 07/10/2026) — 126

**Nội dung (PM yêu cầu):** "Ẩn hiện danh sách khi xem dữ liệu thu thập — bổ sung chức năng cho phép chọn các trường muốn xem tại màn hình danh sách". PM duyệt **phương án A** (nút Tùy chọn cột) và yêu cầu làm thử trên màn **Xem dữ liệu thu thập › CSDL Hộ tịch**.

**Thay đổi:**
- `pages/collection/collectionUi.tsx` (dùng chung, chỉ thêm mới):
  - Kiểu `ColumnDef<T>` mô tả một cột.
  - Hook `useVisibleColumns(storageKey, columns)`: lưu/khôi phục lựa chọn trong `localStorage` theo từng bộ dữ liệu, luôn giữ cột khóa, giữ đúng thứ tự cột.
  - Component `ColumnPicker`: nút 40×40 + danh sách thả xuống (Radix DropdownMenu, hiện nổi không bị khung bảng cắt) gồm ô tích, Chọn tất cả, Khôi phục mặc định, bộ đếm cột; có chấm xanh khi khác mặc định.
- `civil-registry/CivilRegistryInfoTable.tsx`: bảng vẽ cột theo danh sách `columns` truyền vào thay vì 4 cột cố định. STT và Thao tác luôn hiện; cột Thao tác ghim phải khi cuộn ngang; cột văn bản dài cắt `…` kèm tooltip.
- `civil-registry/CivilRegistryInfoSearchFilter.tsx`: thêm chỗ đặt nút Tùy chọn cột (trước nút Bộ lọc).
- `civil-registry/CivilRegistryInfoModal.tsx`:
  - Khai báo cột cho từng bộ dữ liệu:
    - 4 cột mặc định như cũ: Họ và tên (khóa), Giới tính/Loại hình, Số đăng ký, Ngày đăng ký.
    - Thêm Địa chỉ/Nơi đăng ký, Trạng thái (Badge), Thời gian đồng bộ.
    - Toàn bộ trường chi tiết của bộ đó (VD Khai sinh: Mã hồ sơ, Số quyển, Trang số, Nơi sinh, Dân tộc, Quốc tịch, Họ tên Cha, Họ tên Mẹ; Kết hôn: Chồng, Vợ, Nơi đăng ký…).
  - Chuyển lệnh `return null` khi modal đóng xuống sau các hook (đúng quy tắc hook của React).
- `compomennt.md`: thêm **mục 5.20 Tùy chọn cột**.

**Mặc định được chọn (PM chưa chốt 2 điểm, áp dụng theo đề xuất):** danh sách gồm cả trường trong popup chi tiết; lưu lựa chọn theo trình duyệt.

**Kiểm tra (chạy app):**
1. Thanh công cụ: Tùy chọn cột → Bộ lọc nâng cao → Tải lại (đều 40×40). Mặc định 4 cột như cũ, danh sách báo "Hiển thị cột 4/15" với 15 trường.
2. Bật "Địa chỉ", tắt "Giới tính": bảng đổi ngay, danh sách vẫn mở. Bấm "Họ và tên" (khóa) không đổi. Nút có chấm xanh.
3. Tải lại trang: vẫn giữ lựa chọn.
4. Chuyển sang bộ Kết hôn: danh sách cột riêng (Họ tên Chồng & Vợ, Loại hình, Chồng, Vợ, Nơi đăng ký…) và lựa chọn riêng.
5. Chọn tất cả: 17 cột (gồm STT, Thao tác), bảng cuộn ngang, cột Thao tác `sticky`.
6. Khôi phục mặc định: về 4 cột.
- Đóng danh sách bằng Esc hoặc bấm ra ngoài: tooltip không còn treo (đã chặn mở tooltip khi focus quay lại nút).
- Không lỗi/cảnh báo console. `tsc` không lỗi. `vite build` thành công.

## Cập nhật giao diện & tài liệu (Ngày thực hiện: 07/10/2026) — 125

**Nội dung (PM kiểm tra lại mục 124, đối chiếu trang Bộ Tư pháp):** Ô bị khóa ở màn Xem chi tiết (module Cung cấp dữ liệu) còn lệch chuẩn:
- Viền `#E2E8F0`, cần `rgba(0,0,0,0.26)`.
- Chữ `#64748B` / `#020817`, cần `#000000`.
- Nền: BTP hiển thị `#F0F0F0`, localhost đang là `#F1F5F9`.

**Nguyên nhân còn sót sau mục 124:**
1. Màu chữ dùng `#020817` thay vì `#000000`; nền dùng `#F1F5F9` thay vì `#F0F0F0`.
2. Ô "Cơ quan/Đơn vị nhận" (Chi tiết API) là `div` tự dựng, viền `#E2E8F0`, chip chữ `#64748B`.
3. "Xem chi tiết Dịch vụ" (`ProvisionServiceModal`) không khóa ô, chỉ chặn click (`pointer-events-none`), nên ô vẫn nền trắng, viền `#E2E8F0`. Ô "API Context Path" dùng class riêng.
4. "Xem chi tiết cấu trúc trường dữ liệu chia sẻ" dùng ô `readOnly` (không `disabled`).

**Thay đổi:**
- `VIEW_FIELD_CLS` đổi thành `disabled:!text-[#000000] disabled:!bg-[#F0F0F0] disabled:!border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]`. Textarea cục bộ và ô giả lập "Tài liệu API chia sẻ" theo cùng màu.
- `ProvisionApiModal`: khung "Cơ quan/Đơn vị nhận" nền `#F0F0F0`, viền `rgba(0,0,0,0.26)`; chip chữ đen `#000000`, viền `rgba(0,0,0,0.26)`.
- `ProvisionServiceModal`:
  - Vùng form bọc `<fieldset disabled={isViewMode}>`, nên ở chế độ xem mọi ô tự nhận kiểu ô bị khóa; chế độ thêm/sửa không đổi.
  - Ô "API Context Path" ghép thêm `VIEW_FIELD_CLS`.
- `SharedFieldsConfigModal`: ô tên trường API thêm `disabled={readOnly}` ở chế độ xem.
- `compomennt.md` mục 5.2: cập nhật thông số (chữ `#000000`, nền `#F0F0F0`) và cách dùng `fieldset disabled`.

**Kiểm tra (chạy app, 4 modal xem chi tiết: API, Dịch vụ, Yêu cầu kết xuất, Cấu trúc trường chia sẻ):**
- Mọi ô/khung: chữ `rgb(0,0,0)`, nền `rgb(240,240,240)`, viền `rgba(0,0,0,0.26)`. Placeholder ô trống `rgb(148,163,184)`.
- Chế độ **Sửa** dịch vụ vẫn giữ kiểu ô bình thường: nền trắng, viền `#E2E8F0`, chữ `#020817`.
- Không lỗi console. `tsc` không lỗi mới. `vite build` thành công.

## Cập nhật giao diện & tài liệu (Ngày thực hiện: 07/10/2026) — 124

**Nội dung (PM yêu cầu, kèm thông số):** Ở các màn **Xem chi tiết** của module Cung cấp dữ liệu, ô bị khóa (disabled) đang có giá trị phải hiển thị **chữ đen**; ô trống hiển thị **placeholder xám**. Thông số do PM cung cấp:
- Placeholder `#94A3B8`, 13px / 400.
- Nền ô `#F1F5F9`.
- Viền `rgba(0,0,0,0.26)`.

**Phạm vi:** PM chốt chỉ áp dụng cho ô **disabled** ở màn xem chi tiết, không áp cho ô nhập bình thường.

**Nguyên nhân:** `INPUT_CLS` có `disabled:text-[#94A3B8]` nên ở chế độ xem, cả giá trị đã nhập cũng bị tô xám như placeholder.

**Thay đổi:**
- `collectionUi.tsx`: thêm hằng `VIEW_FIELD_CLS` = `disabled:!text-[#020817] disabled:!bg-[#F1F5F9] disabled:!border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8] disabled:placeholder:font-normal`. Chỉ thêm mới, **không đổi `INPUT_CLS`**, nên các module khác không bị ảnh hưởng.
- 19 file trong `provisioning/` dùng `INPUT_CLS` = `INPUT_CLS` gốc + `VIEW_FIELD_CLS`. Textarea cục bộ (`ProvisionServiceModal`, `ProvisionDataRequestModal`) dùng cùng quy tắc.
- `ProvisionApiModal`: ô giả lập "Tài liệu API chia sẻ" (dạng `div`) trước đây tô xám giá trị ở chế độ xem. Nay có giá trị thì chữ đen, trống thì chữ xám; ở chế độ xem dùng nền `#F1F5F9` và viền `rgba(0,0,0,0.26)`.
- `compomennt.md` mục 5.2: thêm quy định "Ô bị khóa ở màn Xem chi tiết".

**Kiểm tra (chạy app):**
- Modal "Chi tiết API cung cấp" và "Chi tiết yêu cầu":
  - Ô disabled có giá trị: chữ `rgb(2,8,23)`, nền `rgb(241,245,249)`, viền `rgba(0,0,0,0.26)`.
  - Ô disabled trống (dd/mm/yyyy, "Nhập nội dung yêu cầu..."): placeholder `rgb(148,163,184)`.
  - Ô "Tài liệu API chia sẻ" có giá trị hiện chữ đen.
- Ô nhập bình thường (ô tìm kiếm) giữ nguyên nền trắng, viền `#E2E8F0`.
- Không lỗi console. `tsc` không lỗi mới. `vite build` thành công.

## Cập nhật giao diện (Ngày thực hiện: 07/10/2026) — 123

**Nội dung (PM yêu cầu):** Chuẩn hóa giao diện mục **Cung cấp dữ liệu** theo `compomennt.md`, giữ nguyên nội dung, dữ liệu và logic. Mục Quản trị & vận hành làm sau.

**File đã sửa (27, trong `provisioning/`):**
- Trang: `DataProvisionMonitoringPage`, `DataProvisionServiceSetupPage`, `DataProvisionApiManagementPage`, `DataProvisionRequestPage`, `DataProvisionServicesPage` (dùng chung cho các mục CSDL Trong ngành / Ngoài ngành / Dữ liệu mở / Dữ liệu chủ), `DataReconciliationPage` (Quy trình đối soát).
- Tab: `tabs/AuditLogsTab`.
- Modal (20):
  - Dịch vụ: `ProvisionServiceModal`, `ProvisionServicePublishModal`, `ProvisionServiceUnpublishModal`, `ProvisionServiceApprovalModal`, `SubmitApprovalModal`, `ProvisionServicePublicDetailsModal`.
  - API: `ProvisionApiModal`, `ProvisionApiDetailModal`, `ProvisionReconciliationApiModal`, `ProvisionAccessControlModal`, `ProvisionVersionHistoryModal`, `ApiVersionCompareModal`, `ProvisionAccountModal`.
  - Yêu cầu dữ liệu: `ProvisionDataRequestModal`, `ProvisionRequestApprovalModal`, `ProvisionRequestExportModal`, `ProvisionRequestHandoverModal`, `ProvisionHandoverDetailModal`, `ProvisionPublishDetailModal`.
  - Khác: `ProvisionExportReportModal`, `SharedFieldsConfigModal`, `ProvisionReconciliationDetailsModal`, `ProvisionReconciliationHistoryModal`.

**Thay đổi chính:**
- **Bỏ ép cỡ chữ:** bỏ các khối `<style>` ép mọi chữ về 13px `!important` và style inline font. Cỡ chữ giờ theo class chuẩn của từng phần tử.
- **Tab và thẻ:** tab dùng `tabClass`. Thẻ thống kê nhỏ theo mục 5.6.1.
- **Tìm kiếm và lọc:**
  - Thanh tìm kiếm và vùng lọc theo mục 5.19. Tìm kiếm/lọc **chỉ chạy khi bấm Tìm kiếm/Enter**; ô lọc nhanh không có nút áp dụng vẫn lọc ngay.
  - Nút "Lọc nâng cao" ở Nhật ký khai thác trước đây không làm gì, nay mở vùng lọc trạng thái.
- **Bảng:**
  - Theo mục 5.3, bỏ `font-mono`/`uppercase`. Ngày giờ hiện 2 dòng. Số căn phải `tabular-nums`. Badge cho trạng thái/phương thức.
  - Cột Thao tác ghim phải. Phân trang dùng thanh chung.
- **Menu ⋯** (từ 4 thao tác trở lên):
  - Quản lý API: Lịch sử phiên bản, Tạm ngưng/Kích hoạt, Xóa API.
  - Tài khoản: Khóa/Mở khóa, Xóa tài khoản.
  - Yêu cầu dữ liệu (dòng Đã công khai): Công khai, Hủy công khai.
- **Modal:**
  - Khung chuẩn mục 5.4, giữ cơ chế portal, z-index và hành vi bấm nền cũ.
  - Modal dịch vụ: thanh tab dọc chuyển thành hàng tab ngang theo mẫu `ServiceModals`.
  - Nội dung code/JSON/SQL/token/endpoint: chữ thường 13px trong ô nền `#F8FAFC`, không dùng `font-mono`.
- **Biểu đồ giám sát:** nằm trong thẻ bo 16px, giữ màu series. Vùng gradient chuyển thành màu đặc độ mờ 0.12.
- `alert()` / toast tự dựng → `sonner`. `window.confirm` (thu hồi quyền, xóa tài khoản) → `ConfirmModal`.
- **Sửa 3 lỗi `tsc` có từ trước** ở `DataProvisionApiManagementPage` (kiểu tham số `unit`, phép so sánh tab).

**Kiểm tra (chạy app, 7 màn):**
- Kiểm soát & giám sát, Thiết lập điều phối, Quản lý API, Yêu cầu dữ liệu, CSDL Hộ tịch (Trong ngành), Dữ liệu mở, Đối soát `reconciliation-662`.
- Tiêu đề cột 13px/700 đen, cao 42px; hàng 48px; căn lề đúng (đã sửa tiêu đề "Thao tác" căn giữa ở Quản lý API). Ô nhập 40px. Không còn chữ < 12px hay `font-mono`.
- Modal Xem chi tiết (Dịch vụ, Yêu cầu kết xuất, Cấu trúc trường, Kết quả đối soát) có tiêu đề 16px/500.
- Không lỗi console. `vite build` thành công. `tsc` không lỗi mới.

**Lỗi có từ trước, chưa sửa:**
- `DataProvisionServiceSetupPage` truyền `service`/`onPublish` cho `ProvisionServicePublishModal`, nhưng modal chỉ nhận `requestData`/`onConfirmPublish` (đã có ở HEAD).
- Bảng Yêu cầu dữ liệu không lọc theo tab. Ngày yêu cầu mới lưu dạng dd/mm/yyyy nên lọc theo ngày không khớp.

**Chữ mới cần PM duyệt:**
- Lý do khóa: "Không thể xóa dịch vụ ở trạng thái này" (lấy lại từ chữ cũ), "Dịch vụ đã được công khai", "Yêu cầu đã phê duyệt hoặc đã kết xuất", "Chỉ áp dụng cho yêu cầu Đã kết xuất".
- Tiêu đề hộp xác nhận: "Thu hồi quyền truy cập", "Xóa tài khoản".
- Nhãn lọc "Trạng thái" (Nhật ký khai thác).

**Chuẩn bị cho Quản trị & vận hành:** đã mở khóa `[x]` 24 mục trong `stauts.md` (Hệ thống nguồn, Agent, CSDL đích, Người dùng/Nhóm/Vai trò/Chức năng, Cấu hình bảo mật, Lưu trữ nhật ký, Sao lưu, 5 trang nhật ký, Thống kê). Chưa sửa code.

## Cập nhật giao diện (Ngày thực hiện: 06/10/2026) — 122

**Nội dung (PM yêu cầu):** Chuẩn hóa giao diện **Cập nhật dữ liệu chủ** và **Báo cáo tìm kiếm dữ liệu chủ** theo `compomennt.md`, giữ nguyên nội dung, dữ liệu và logic.

**File đã sửa (3):** `master-data/MasterDataUpdatePage.tsx`, `MasterDataUpdateItemPage.tsx`, `MasterDataReportsPage.tsx`. Các export dùng chung giữa 2 màn (`ApprovalBadge`, `COLUMNS`, `MOCK_BY_CATEGORY`…) giữ nguyên tên và kiểu.

**Cập nhật dữ liệu chủ:**
- **Tab:** Dữ liệu / Phê duyệt dùng `tabClass`. Bộ đếm chờ duyệt 12px.
- **Thanh công cụ:**
  - Màn có ô tìm kiếm nên dùng thanh tìm kiếm chuẩn mục 5.19.
  - Đang hoạt động / Đã xóa là chip lọc nhanh. Gửi duyệt, Công khai, Hủy công khai là nút viền.
  - Lịch sử đồng bộ (viền) đứng trước Đồng bộ dữ liệu (Primary, ngoài cùng phải).
- **Tìm kiếm và lọc:** chỉ chạy khi bấm Tìm kiếm/Enter, không phân biệt dấu.
- **Bảng:**
  - Theo chuẩn mục 5.3. Badge cho trạng thái dữ liệu, phê duyệt, công khai. Ngày giờ hiện 2 dòng.
  - Cột Thao tác ghim phải. Hàng được chọn nền `#EAF3FF`. Phân trang luôn hiển thị.
- **Thao tác:**
  - Tab Dữ liệu: để ngoài Xem chi tiết, Rà soát; menu ⋯ gồm Phiên bản, Trình duyệt, Công khai/Hủy công khai, Xóa bản ghi (đỏ, cuối). Mục bị khóa có dòng lý do.
  - Tab Phê duyệt: để ngoài Xem chi tiết, Phê duyệt; menu ⋯ gồm Từ chối, Hủy phê duyệt.
- **Modal (12):**
  - Khung chuẩn, giữ cơ chế không đóng khi bấm nền và giữ z-index cũ cho modal chồng nhau.
  - Hủy phê duyệt chuyển sang nút Destructive.
- `alert()` → toast (14 chỗ).

**Báo cáo tìm kiếm dữ liệu chủ:**
- **Tra cứu:**
  - Thanh tìm kiếm và vùng lọc chuẩn. Trước đây nút Tìm kiếm chỉ ghi log, **nay lọc thật** theo từ khóa, loại dữ liệu, trạng thái và khoảng ngày khi bấm Tìm kiếm/Enter.
  - Bảng chuẩn, cột Thao tác ghim phải, phân trang chung.
- **Báo cáo sử dụng:**
  - Vùng lọc và nút "Truy xuất báo cáo" như các báo cáo Danh mục. Kết quả chỉ đổi khi bấm Truy xuất (trước đây đổi ngay khi chọn).
  - Biểu đồ nằm trong thẻ bo 16px, **giữ màu series cũ**. Bảng có cột số căn phải, tỷ lệ API ổn định dạng Badge.
- **Vòng đời:** banner cảnh báo chuẩn, 3 thẻ nhỏ, bảng chuẩn, cột Vòng đời dạng Badge.
- **Modal (2):** khung chuẩn `z-[110]`. Thanh bước màu `#155DFC`.

**Kiểm tra (chạy app):**
- Cập nhật: tiêu đề cột 13px/700 đen; hàng 48px; căn lề đúng. Menu ⋯ đúng thứ tự, có lý do khóa. Modal "Chi tiết bản ghi" 16px/500. Tab Phê duyệt đúng chuẩn.
- Báo cáo:
  - 3 tab đúng chuẩn. Tìm "zzz": gõ chưa lọc, nhấn Enter ra "không tìm thấy".
  - Loại "Thống kê": biểu đồ đường và 8 cột màu cũ hiển thị đủ. Loại "Truy cập" và "Tiêu thụ" hiện bảng.
- Không còn chữ < 12px hay `font-mono`. Không lỗi console. `tsc` không lỗi mới (còn 2 lỗi `many-to-one` có từ trước). `vite build` thành công.

**Chữ mới cần PM duyệt:**
- Lý do khóa: "Chỉ trình duyệt bản ghi Chưa phê duyệt, Rà soát hoặc Từ chối", "Chỉ công khai bản ghi đã phê duyệt".
- Dòng trống: "Không tìm thấy bản ghi phù hợp".

## Cập nhật giao diện (Ngày thực hiện: 06/10/2026) — 121

**Nội dung (PM yêu cầu):** Chuẩn hóa giao diện **Quản lý dữ liệu chủ › Mô hình dữ liệu chủ** theo `compomennt.md`, giữ nguyên nội dung, dữ liệu và logic. Màn tham chiếu: các màn tương ứng đã duyệt bên Danh mục dùng chung.

**File đã sửa (7):** trong `master-data/`:
- `MasterDataScaleManagementPage.tsx` (trang chính, tab Thiết lập thực thể)
- `MasterDataWizard.tsx` (Wizard 7 bước)
- `AttributesManagementTab.tsx` (Thiết lập thuộc tính)
- `MergeRulesManagementTab.tsx` (Thiết lập quy tắc hợp nhất)
- `EntityRelationshipsTab.tsx` (Thiết lập quan hệ thực thể)
- `UniqueIdentifierRulesTab.tsx` (Quy tắc định danh duy nhất)
- `ApprovalTab.tsx` (Phê duyệt)

**Thay đổi chính:**
- **Tab và thẻ:**
  - 6 tab dùng `tabClass` (14px/600, cao 48px).
  - Thẻ thống kê nhỏ theo mục 5.6.1 (5 thẻ ở Thiết lập thực thể, 4 thẻ ở Phê duyệt), bỏ gradient.
- **Tìm kiếm:**
  - Thanh tìm kiếm theo mục 5.19. Tìm kiếm chỉ chạy khi bấm Tìm kiếm/Enter (Thiết lập thực thể, Phê duyệt, tìm quan hệ trong Wizard).
  - Ô chọn thực thể vẫn lọc ngay vì là ô chọn, không phải ô tìm kiếm.
- **Bảng:**
  - Theo mục 5.3, bỏ chữ `font-mono`/`<code>`.
  - Tên và mã xếp 2 dòng. Ngưỡng/Trọng số (%) căn phải `tabular-nums`.
  - Badge cho trạng thái, loại quan hệ, kiểu so khớp, chiến lược, PK/FK/Bắt buộc.
  - Cột Thao tác ghim phải. Phân trang dùng thanh chung.
- **Thiết lập thực thể** có 4 thao tác: để ngoài Xem chi tiết, Chỉnh sửa; menu ⋯ gồm Gửi trình duyệt (khóa kèm lý do "Chỉ gửi được bản ghi đang soạn thảo"), Xóa (đỏ, cuối).
- **Wizard:**
  - Khung modal chuẩn, tiêu đề 16px/500.
  - Thanh 7 bước: bước hiện tại và đã xong dùng `#155DFC`, bước chưa tới `#E2E8F0`.
  - Ô nhập 40px. Chân modal nền `#F8FAFC`. Lưu nháp kiểu Outline, Tiếp theo/Gửi phê duyệt kiểu Primary.
- **Modal:** dùng `BaseModal` chuẩn, bỏ icon trang trí ở header. Modal tự dựng đưa về `z-[110]` + khung chuẩn. Thông tin chỉ đọc dạng nhãn – giá trị.
- **Mã định danh mẫu:** chữ thường 13px trong ô nền `#F8FAFC`, không dùng `font-mono`.
- `alert()` → toast. Xóa quy tắc định danh: hộp `confirm()` của trình duyệt được thay bằng modal xác nhận (nút này đang ẩn bằng cờ `SHOW_EDIT_DELETE_ACTIONS`).

**Kiểm tra (chạy app):**
- Danh sách: tiêu đề cột 13px/700 đen cao 42px; hàng 48px; căn lề đúng.
- Tìm "zzz": gõ chưa lọc, nhấn Enter còn 1 hàng ("không tìm thấy").
- Menu ⋯ đúng thứ tự và có lý do khóa.
- Modal "Xem chi tiết thực thể dữ liệu chủ" và Wizard "Tạo mới dữ liệu chủ" có tiêu đề 16px/500, ô nhập 40px.
- 5 tab còn lại hiển thị đúng chuẩn.
- Không còn chữ < 12px hay `font-mono`. Không lỗi console. `tsc` không lỗi. `vite build` thành công.

**Cần PM duyệt:**
- Chữ mới: lý do khóa trong menu ⋯; tiêu đề modal "Xóa quy tắc định danh"; một số tooltip "Xóa", "Bỏ trường".
- Thẻ kết quả kiểm thử (tab Quy tắc hợp nhất và Wizard) có thêm icon vì thẻ chuẩn mục 5.6.1 có ô icon.

## Cập nhật giao diện (Ngày thực hiện: 06/10/2026) — 120

**Nội dung (PM yêu cầu):** Chuẩn hóa giao diện mục **Dữ liệu mở** theo `compomennt.md`, giữ nguyên nội dung, dữ liệu và logic.

**File đã sửa (6):**
- `open-data/OpenDataDashboardPage.tsx` (Tổng quan dữ liệu mở)
- `open-data/OpenDataSetupPage.tsx` (Thiết lập danh mục dữ liệu mở)
- `open-data/OpenDataPublishedListPage.tsx` (Công bố dữ liệu mở)
- `open-data-category/OpenDataCategoryPage.tsx` + `components/tabs/FilesTab.tsx` (Danh sách danh mục dữ liệu mở)
- `open-data-report/OpenDataReportPage.tsx` (Thống kê dữ liệu mở)

**Thay đổi chính:**
- **Tổng quan:**
  - H1 20px/700 `#2A0F0F`.
  - Trang không có hàng thẻ KPI nên không áp dụng ngoại lệ thẻ header lớn. Khối 4 vòng tiến trình phê duyệt nằm trong thẻ chuẩn.
  - **Giữ màu** các series: vòng tròn `#3b82f6`/`#22c55e`/`#f59e0b`/`#a855f7`, thanh xếp hạng cyan, cột `#059669`.
  - Trục, chú giải, tooltip 12px `#64748B`. Bỏ chữ 11px.
- **Tab và thẻ:** tab theo `tabClass`. Thẻ thống kê nhỏ theo mục 5.6.1, bỏ nền gradient (tab Phê duyệt).
- **Tìm kiếm và lọc:** thanh tìm kiếm và vùng lọc theo mục 5.19. Tìm kiếm **chỉ chạy khi bấm Tìm kiếm/Enter** ở mọi tab có ô tìm kiếm; nút lọc nhanh theo trạng thái vẫn lọc ngay. Tab Phê duyệt được thêm nút Tìm kiếm.
- **Bảng:**
  - Theo mục 5.3; cột Thao tác ghim phải. Badge trạng thái căn trái. Ngày giờ hiện 2 dòng. Số căn phải `tabular-nums` (Thống kê).
  - Phân trang dùng thanh chung.
  - Thiết lập danh mục › Quản lý danh mục có 4 thao tác: để ngoài Xem chi tiết, Chỉnh sửa; menu ⋯ chứa Gửi duyệt, Xóa (đỏ, cuối).
- **Modal:** khoảng 35 modal nội tuyến đưa về khung chuẩn mục 5.4 (`z-[110]`, header 16px/500, nút X, chân nền `#F8FAFC`). Modal dùng portal giữ cơ chế cũ. Thông tin chỉ đọc dạng nhãn – giá trị. Nút Primary/Outline/Destructive.
- **Khác:**
  - `alert()` → toast (17 chỗ ở Công bố, 12 ở Danh sách danh mục, 4 ở Thống kê, 3 ở Thiết lập).
  - `FilesTab` tự dựng thanh công cụ, bảng và phân trang theo chuẩn. 4 component cũ `OpenDataCategoryFilters/Actions/Grid/Pagination` không còn được dùng (chưa xóa).

**Kiểm tra (chạy app, 5 màn):**
- Tiêu đề cột 13px/700 đen cao 42px, hàng 48px, căn lề đúng, ô nhập 40px. Không còn chữ < 12px hay `font-mono`.
- Modal Xem chi tiết (Thiết lập, Công bố, Danh sách danh mục) có tiêu đề 16px/500.
- Tổng quan: 4 vòng tiến trình, danh sách xếp hạng và 6 cột `#059669` hiển thị đủ.
- Không lỗi console. `tsc` không lỗi mới. `vite build` thành công.

**Chưa xử lý / cần PM duyệt:**
- Cổng thông tin dữ liệu mở công khai (`OpenDataPublicPortal.tsx`) đang khóa `[ ]`.
- Chữ mới do agent thêm:
  - Lý do khóa trong menu/tooltip: "Đã phê duyệt", "Đang chờ duyệt", "Đã bị từ chối", "Chỉ gửi duyệt yêu cầu ở trạng thái Bản nháp".
  - Chú giải "Lượt chia sẻ" ở Tổng quan.
  - Mô tả toast "Định dạng: …", "Nội dung: …", "Lý do: …".

## Cập nhật giao diện (Ngày thực hiện: 06/10/2026) — 119

**Nội dung (PM yêu cầu, kèm ảnh mẫu):** Tab **Dữ liệu** của Danh mục trong ngành / Danh mục ngoài ngành:
- Bỏ thanh tìm kiếm.
- Bảng luôn có thanh phân trang.
- Nút Lọc, Sắp xếp căn trái theo ảnh.
- Bổ sung nút **Cập nhật**.

**Thay đổi (`CategoryPage.tsx`, dùng chung cho cả 2 mục):**
- **Thanh công cụ trái:**
  - Cập nhật là nút icon 40×40 viền `#CBD5E1` (`RefreshCw`, tooltip "Cập nhật"). Khi bấm: về trang 1 và hiện toast "Đã cập nhật dữ liệu".
  - Lọc và Sắp xếp là nút viền có chữ + icon. Khi panel đang mở, nút chuyển sang tông xanh `#EAF3FF`. Có chấm xanh khi đang áp dụng điều kiện.
  - Thanh phải giữ nguyên: Gửi duyệt, Thêm bản ghi mới.
- **Bỏ ô tìm kiếm + nút Tìm kiếm.** Danh sách tab Dữ liệu không còn lọc theo từ khóa. Ô tìm kiếm ở các tab khác giữ nguyên.
- **Vùng Lọc:** thêm nút **"Áp dụng bộ lọc"** (Primary) vì không còn nút Tìm kiếm. Nhấn Enter ở ô giá trị cũng áp dụng. "Xóa bộ lọc" giữ nguyên.
- **Phân trang luôn hiển thị**, kể cả khi không có bản ghi ("Hiển thị 0-0/0").

**Kiểm tra (chạy app, cả 2 mục):**
- Không còn ô tìm kiếm. Hàng nút trái gồm Cập nhật 40×40 → Lọc 81×40 → Sắp xếp 108×40, thẳng mép trái với bảng.
- Bấm Cập nhật hiện toast.
- Lọc Mã = "KHONG_TON_TAI" → Áp dụng: bảng báo "Không tìm thấy dữ liệu", phân trang "Hiển thị 0-0/0". Xóa bộ lọc trả lại 7 hàng.
- Không lỗi console. `tsc` không lỗi mới. `vite build` thành công.

## Cập nhật giao diện & menu (Ngày thực hiện: 06/10/2026) — 118

**Nội dung (PM yêu cầu):**
1. Biểu đồ "Lượt truy cập API theo danh mục" (Tổng quan danh mục) **giữ màu cũ** cho các thanh.
2. Nhóm **Biên tập & Công khai**: tách mục "Biên tập danh mục" thành 2 mục cấp 2 là **Danh mục trong ngành** (đặt trên) và **Danh mục ngoài ngành**. Bên trong giữ thiết kế như màn Biên tập danh mục hiện tại.

**Thay đổi:**
- `CategoryDashboardPage.tsx`: thanh và chấm chú giải trả về màu cũ `#06B6D4` (= `rgb(6,182,212)`).
- `layout/Sidebar.tsx`: thứ tự nhóm Biên tập & Công khai là Danh mục trong ngành (id `category-list`) → Danh mục ngoài ngành (id mới `category-list-external`) → Đơn vị thuộc BTP.
- `layout/MainLayout.tsx`:
  - Thêm route `category-list-external`, dùng chung màn `CategoryAListPage`.
  - Thêm cấu hình tiêu đề trang cho route mới.
  - Breadcrumb: "Danh mục dùng chung / Biên tập & Công khai / Danh mục trong ngành | Danh mục ngoài ngành".
- Giữ id `category-list` cho Danh mục trong ngành để các liên kết sẵn có vẫn hoạt động (từ Khai thác báo cáo và Thiết lập danh mục: `/category-list?category=…`).

**Kiểm tra (chạy app):**
- Màu thanh `rgb(6,182,212)`.
- Mở menu: Danh mục trong ngành (y=390) → Danh mục ngoài ngành (y=422) → Đơn vị thuộc BTP (y=454). Bấm Danh mục ngoài ngành: URL `/category-list-external`, mục được tô xanh, breadcrumb đúng.
- Cả 2 màn hiện đủ 4 tab và 7 bản ghi. Không lỗi console. `tsc` không lỗi mới. `vite build` thành công.

**Lưu ý:** hai mục hiện dùng **cùng dữ liệu mock** (chưa tách danh mục trong ngành và ngoài ngành). Khung trái vẫn ghi tiêu đề "Biên tập danh mục". Sơ đồ màn hình `ScreenFlowDiagram.tsx` chưa cập nhật.

## Cập nhật giao diện & tài liệu (Ngày thực hiện: 06/10/2026) — 117

**Nội dung (PM yêu cầu):** Trả **thẻ header** ở Tổng quan danh mục về kích thước cũ. **Chốt quy định:** các màn **Tổng quan** giữ kích thước lớn của thẻ header để cân bằng với biểu đồ bên dưới.

**Thay đổi:**
- `CategoryDashboardPage.tsx`: 4 thẻ header trở lại bố cục cũ.
  - Padding 24px. Ô icon 48×48, icon 24px.
  - Số **30px/700**, nhãn 14px/500 nằm dưới số. "+12%" dạng viên ở góc phải.
  - Lưới `gap-6`.
  - Màu, viền, bo góc vẫn theo chuẩn: viền `#E2E8F0`, bo 16px, không bóng, chữ `#0F172A`/`#64748B`, xu hướng `#16A34A` trên `#F0FDF4`.
- `compomennt.md` mục 5.6.1: thêm **"Ngoại lệ – Thẻ header màn Tổng quan (Dashboard)"** gồm bảng thông số và code mẫu.

**Kiểm tra (chạy app):** 4 thẻ 308×175px; số 30px/700; nhãn 14px/500. Biểu đồ vẫn hiển thị đủ. Không lỗi console. `tsc` không lỗi. `vite build` thành công.

## Cập nhật giao diện (Ngày thực hiện: 06/10/2026) — 116

**Nội dung (PM yêu cầu):**
1. Chuẩn hóa khung modal dùng chung `common/BaseModal.tsx` theo **phương án A**. Ảnh hưởng 35 file / 52 chỗ gọi, gồm cả Master data và Xử lý dữ liệu; PM đồng ý.
2. Chuẩn hóa **Tổng quan danh mục** (`CategoryDashboardPage.tsx`), PM đã mở khóa.

**Thay đổi `BaseModal.tsx` (props giữ nguyên, không sửa file gọi):**
- Tiêu đề **16px/500 `#020817`** (trước: 18px/700 `slate-800`, style inline). Phụ đề 13px/400 `#64748B` (trước: 12px/500).
- Header viền dưới `#E2E8F0`, bỏ bóng.
- Nút X dùng `BTN_GHOST_ICON` (icon 20px, bo 8px, có `aria-label`), bỏ hiệu ứng xoay.
- Chân modal nền `#F8FAFC`, viền `#E2E8F0`.
- **Giữ:** padding thân `p-6`, z-index 9000+ tăng dần, bấm nền để đóng, prop `customHeaderIcon` và `headerActions` (các màn Master data / Xử lý dữ liệu vẫn truyền icon).

**Thay đổi `CategoryDashboardPage.tsx`:**
- Tiêu đề trang 20px/700 `#2A0F0F`.
- 4 thẻ thống kê theo mục 5.6.1. Xu hướng "+12%" 12px `#16A34A`.
- 3 biểu đồ/danh sách xếp hạng nằm trong thẻ bo 16px, tiêu đề 14px/500.
- Màu series theo bảng màu: `#155DFC`, `#10B981`, `#D97706`. Trục, chú giải, tooltip 12px `#64748B`. Bỏ chữ 11px.

**Kiểm tra:**
- `tsc`: `BaseModal` vẫn 6 lỗi có từ trước, không có lỗi mới. `CategoryDashboardPage` không lỗi.
- `vite build` thành công.
- **Kiểm tra trên trình duyệt (PM cho phép chạy):**
  - 3 modal dùng BaseModal ("Quản lý phiên bản danh mục", "Thông tin chung danh mục", "Từ chối phê duyệt danh mục"): tiêu đề 16px/500 `#020817`, viền header `#E2E8F0`, không bóng, nút X 32px đóng được, chân `#F8FAFC`.
  - Tổng quan danh mục: H1 20px/700 `#2A0F0F`, 7 thẻ bo 16px, không còn chữ < 12px. Biểu đồ tròn có 3 phần màu `#155DFC`/`#10B981`/`#D97706`, biểu đồ cột có 6 cột `#155DFC`.
  - Không lỗi console.

## Cập nhật giao diện (Ngày thực hiện: 06/10/2026) — 115

**Nội dung (PM yêu cầu):** Chuẩn hóa giao diện các mục còn lại của **Quản lý Danh mục dùng chung** và các modal chưa có trong `stauts.md`. PM chốt từ nay file chưa có trong `stauts.md` thì được sửa luôn. Giữ nguyên nội dung, dữ liệu và logic.

**File đã sửa (24):**
- Biên tập danh mục: `CategoryAListPage.tsx`, `CategoryPage.tsx`.
- Đơn vị thuộc BTP: `CategoryMojUnitsPage.tsx`, `MojUnitDeleteConfirmModal.tsx`.
- Khai thác báo cáo: `CategoryReportPage.tsx`.
- Báo cáo:
  - `reports/CategoryReportListPage.tsx`, `CategoryReportExploitationPage.tsx`, `CategoryReportStatusPage.tsx`, `CategoryReportVersionPage.tsx`.
  - Phần dùng chung: `CategoryTrendAndStatsSection.tsx`, `CategorySystemExploitationTable.tsx`.
- Modal:
  - `BulkApproveModal`, `BulkRejectModal`.
  - `CategoryInfoViewModal`, `CategoryStructureViewModal`, `CategoryVersionChangeModal`. Ba modal này dùng chung với Dữ liệu mở › Danh sách đã công bố.
  - `CreateVersionModal`, `ArchiveRecordModal`, `RecordFormModal`, `UpdateApprovalModal`.
  - `EntityVersionHistoryModal`, `EntityVersionDiffModal`.

**Thay đổi chính:**
- **Tiêu đề và tab:** H1 trang 20px/700 `#2A0F0F` (màn Đơn vị BTP). Tab và tab con dùng `tabClass`. Thẻ thống kê theo mục 5.6.1.
- **Tìm kiếm và lọc:**
  - Thanh tìm kiếm theo mục 5.19. Tìm kiếm và bộ lọc **chỉ chạy khi bấm Tìm kiếm/Enter** ở các màn: Biên tập danh mục, Đơn vị BTP, Khai thác báo cáo, Báo cáo phiên bản.
  - Các bộ lọc không có nút áp dụng vẫn lọc ngay.
  - Bộ lọc điều kiện AND/OR ở Biên tập danh mục giữ dạng hàng, đặt trong khung xám.
- **Bảng:**
  - Theo chuẩn mục 5.3, bỏ chữ `font-mono` và chữ < 12px.
  - Cột số căn phải `tabular-nums`. Badge cho trạng thái/loại. Ngày giờ hiện 2 dòng.
  - Cột Thao tác ghim phải khi cuộn ngang (Biên tập danh mục). Phân trang dùng thanh chung.
- **Biểu đồ (báo cáo):** mỗi biểu đồ nằm trong một thẻ bo 16px, tiêu đề 14px/500. Trục và chú giải 12px `#64748B`. Màu series theo bảng màu (bỏ gradient).
- **Nút:** Xuất file kiểu Outline. Phê duyệt kiểu Primary. Từ chối/Hủy công khai/Lưu trữ kiểu Destructive.
- **Modal:** khung chuẩn mục 5.4 (14 modal trong `CategoryPage` đưa về `z-[110]`). Ô nhập 40px. Thông tin chỉ đọc dạng nhãn – giá trị.
- **So sánh phiên bản:** phần bị xóa nền `#FEF2F2`/chữ `#B91C1C`, phần thêm nền `#F0FDF4`/chữ `#15803D`, phần sửa nền `#FFF7ED`.
- `alert()` → toast.

**Kiểm tra (chạy app, 7 màn):**
- Biên tập danh mục, Đơn vị BTP, Khai thác báo cáo và 4 báo cáo:
  - Tiêu đề cột 13px/700 đen, cao 42px; hàng 48px; căn lề đúng.
  - Ô nhập 40px; không còn chữ < 12px hay `font-mono`.
- Báo cáo danh sách/trạng thái/khai thác: bấm "Truy xuất dữ liệu" hiện đủ biểu đồ và bảng.
- Modal Chi tiết bản ghi có tiêu đề 16px/500.
- Không lỗi console. `tsc` không có lỗi mới. `vite build` thành công.

**Chưa xử lý:**
- Tổng quan danh mục (`CategoryDashboardPage.tsx`) đang khóa `[ ]`.
- Khung header các modal dùng `common/BaseModal.tsx` (vd "Quản lý phiên bản danh mục" 18px/700) chờ PM chọn phương án.
- Các chữ/nhãn do agent tự thêm chờ PM quyết định (xem mục 114).

## Cập nhật giao diện (Ngày thực hiện: 06/10/2026) — 114

**Nội dung (PM yêu cầu):** Chuẩn hóa giao diện **Danh mục dùng chung › Thiết lập danh mục** theo `compomennt.md`. Chỉ sửa các file PM đã mở khóa; giữ nguyên nội dung, dữ liệu và logic.

**File đã sửa (13):**
- `CategorySetupPage.tsx`
- Tab: `SetupTab.tsx`, `AttributesTab.tsx`, `RelationshipsTab.tsx`, `ApprovalTab.tsx`
- Modal: `CategoryWizardModal.tsx`, `AttributeFormModal.tsx`, `ApprovalRequestModal.tsx`, `ReviewApprovalModal.tsx`, `SimpleApproveModal.tsx`, `SimpleRejectModal.tsx`, `ExpireRequestModal.tsx`, `ExpireApproveModal.tsx`

**Thay đổi chính:**
- **Tab:**
  - 4 tab chính và 4 tab con của Phê duyệt dùng `tabClass` (14px/600, cao 48px).
  - Thẻ thống kê theo mục 5.6.1, bỏ nền gradient của tab Phê duyệt.
- **Tìm kiếm:** ô tìm kiếm 40px, nút Tìm kiếm xanh lá, nút Bộ lọc dạng viền. Tìm kiếm **chỉ chạy khi bấm Tìm kiếm hoặc nhấn Enter**, không phân biệt dấu. Các nút lọc nhanh của tab Phê duyệt vẫn lọc ngay khi bấm.
- **Bảng:**
  - Theo chuẩn mục 5.3 (tiêu đề 42px, hàng 48px).
  - Bỏ chữ `font-mono`; tên và mã xếp 2 dòng, chữ dài cắt kèm tooltip.
  - Ngày giờ hiện 2 dòng; trạng thái, PK/FK và loại quan hệ dạng Badge; cột số căn phải.
  - Phân trang dùng thanh chung.
- **Cột thao tác tab Thiết lập danh mục** (6 thao tác, mục 5.3.2):
  - Bên ngoài để Xem chi tiết và Sửa.
  - Menu ⋯ gồm Xem dữ liệu, Trình duyệt, Hết hiệu lực, Xóa (cuối, màu đỏ).
  - Mục bị khóa ghi lý do ngay trong menu.
- **Tab Phê duyệt:** cột Thao tác ghim bên phải khi bảng cuộn ngang.
- **Modal:**
  - Ô nhập 40px; thông tin chỉ đọc dạng nhãn – giá trị; banner thông tin/cảnh báo theo bảng màu.
  - Nút: Phê duyệt kiểu Primary, Từ chối kiểu Destructive, Hủy/Đóng kiểu Outline.
  - Wizard dùng header chuẩn, thanh bước màu `#155DFC`.
- `alert()` trong `CategorySetupPage` được đổi thành toast.

**Kiểm tra (chạy app):**
- Cả 4 tab: tab 14px/600 cao 48px; tiêu đề cột 13px/700 đen; hàng 48px; căn lề đúng.
- Tìm "dan toc": gõ chưa lọc, nhấn Enter ra 1 kết quả.
- Menu ⋯ đúng thứ tự và có lý do cho mục bị khóa.
- Wizard có tiêu đề 16px/500, ô nhập 40px.
- Đã mở các modal Trình duyệt, Chi tiết quan hệ, Phê duyệt, Từ chối, Phê duyệt hết hiệu lực.
- Không lỗi console. `tsc` không có lỗi mới (các lỗi còn lại có từ trước). `vite build` thành công.

**Chưa xử lý:**
- Khung (header 18px/700, nút X, chân) của các modal dùng `common/BaseModal.tsx` vẫn theo kiểu cũ. File này dùng chung cho 35 file / 52 chỗ gọi, chờ PM quyết định.
- 5 modal chưa có trong `stauts.md` không sửa: `BulkApproveModal`, `BulkRejectModal`, `CategoryInfoViewModal`, `CategoryStructureViewModal`, `CategoryVersionChangeModal`.
- Một số dòng lý do trong menu ⋯ và tooltip là chữ mới, cần PM duyệt:
  - "Đang chờ hết hiệu lực"
  - "Chỉ áp dụng cho danh mục đang hiệu lực"
  - "Trường đồng bộ từ Kho DLDC, không thể chỉnh sửa / không thể xóa"
- Một số modal thêm nhãn cho lưới nhãn – giá trị: "Tên danh mục", "Mã", "Mã yêu cầu", "Loại". Dòng "BẢNG LIÊN KẾT #n" đổi thành "Bảng liên kết #n" (bỏ viết hoa).

## Cập nhật giao diện (Ngày thực hiện: 06/10/2026) — 113

**Nội dung (PM yêu cầu, phương án A):** Chuẩn hóa hộp thoại xác nhận dùng chung `common/ConfirmModal.tsx` theo `compomennt.md`.

**Phạm vi:** 9 hộp thoại trong 5 file dùng component này, gồm Thiết lập thu thập (`CollectionSetupPage`, `ServiceModals`), Thiết lập danh mục (`CategorySetupPage`, `RelationshipsTab`) và `DataCollectionList`. Các file gọi không phải sửa vì props giữ nguyên.

**Thay đổi:**
- Tiêu đề **16px/500/`#020817`** (trước là 18px/700). Phụ đề 13px/400 `#64748B`.
- Thêm **nút X** đóng ở góc trên phải (mục 5.4). Thêm `role="alertdialog"`.
- Bố cục chuẩn: header, thân và chân nền `#F8FAFC`. Nút căn phải theo thứ tự Hủy → Xác nhận (trước là 2 nút chia đôi chiều ngang).
- Nút dùng bộ chuẩn: Hủy kiểu `BTN_OUTLINE`; xác nhận kiểu `BTN_DESTRUCTIVE` (`#DC2626`) cho delete/warning và `BTN_PRIMARY` (`#155DFC`) cho info/success. Nút cao 40px, có viền focus bàn phím, bỏ bóng.
- Hộp nội dung bo 8px (trước 12px), nền `#F8FAFC`, viền `#E2E8F0`, chữ `#020817`.
- Icon dùng màu trong bảng màu: delete `#DC2626`, warning `#D97706`, info `#155DFC`, success `#16A34A`.
- **Giữ:** z-index 9100+ tăng dần để modal chồng nhau không bị che (lệch so với mục 4.2 nhưng cố ý giữ); bấm ra ngoài thì đóng; bấm xác nhận gọi `onConfirm()` rồi đóng.
- `warning` vẫn dùng nút đỏ vì đang dùng cho cảnh báo xóa dữ liệu/xóa cấu trúc.

**Kiểm tra (chạy app, Thiết lập thu thập):**
- Cả 3 kiểu warning (Xóa dữ liệu thu thập, Xóa cấu trúc), info (Hoạt động) và delete (Xóa dịch vụ): tiêu đề 16px/500 `#020817`, khung bo 16px, nền mờ 50%. Nút Hủy/xác nhận cao 40px; nút đỏ `rgb(220,38,38)`, nút xanh `#155DFC`.
- Nút X đóng được. Không lỗi console. `tsc`: số lỗi có sẵn trong file giảm từ 6 xuống 5 (còn `__activeModalsCount` có từ trước). `vite build` thành công.

**Lưu ý nội dung (chưa sửa):** hộp "Kích hoạt lại dịch vụ" đang hiện phụ đề mặc định "Hành động này không thể hoàn tác". Chỗ gọi không truyền `subtitle` nên dùng mặc định.

## Cập nhật giao diện (Ngày thực hiện: 06/10/2026) — 112

**Nội dung (PM yêu cầu):** Màn Đối soát dữ liệu bỏ nút **Đồng bộ thủ công** và dòng **Tổng hợp** trong bảng.

**Thay đổi:** `ReconciliationTemplate.tsx`:
- Xóa nút "Đồng bộ thủ công" và phần mô phỏng đồng bộ chỉ nút này dùng (`syncStatuses`, `handleManualSync`).
- Prop `hideManualSync` vẫn giữ để không phải sửa các trang đang truyền prop này; prop không còn tác dụng.
- Xóa dòng "Tổng hợp (n bộ dữ liệu)" cuối bảng.
- Thẻ thống kê "Tỷ lệ khớp" vẫn giữ nguyên cách tính.

**Kiểm tra (chạy app):** kiểm tra 4 màn (Hộ tịch, Thi hành án, Danh mục ngoài ngành, Bản án). Không còn nút Đồng bộ thủ công và không còn dòng Tổng hợp. Bảng chỉ còn các dòng dữ liệu, các màn có nút "Xuất Excel" vẫn giữ nút này. Không lỗi console. `tsc` không lỗi mới. `vite build` thành công.

## Cập nhật giao diện (Ngày thực hiện: 06/10/2026) — 111

**Nội dung (PM yêu cầu):** Chuẩn hóa giao diện các màn **Đối soát dữ liệu** (Quản lý thu thập → Đối soát dữ liệu) theo `compomennt.md`, giữ nguyên nội dung và dữ liệu. PM đã mở khóa `[x]` các file trong `stauts.md` mục 4.

**Phạm vi:** 14 màn dùng chung `ReconciliationTemplate` (Danh mục Bộ ngoài ngành, Bản án/quyết định, các CSDL trong ngành).

**Thay đổi:**
- `ReconciliationTemplate.tsx`:
  - Tab chuẩn 48px 14px/600 (`tabClass`). Thẻ thống kê chuẩn 5.6.1 (bo 16px, nhãn và số 16px).
  - Thanh tìm kiếm 40px với nút Tìm kiếm xanh `#10B981`, nút Bộ lọc icon outline. Tìm kiếm và bộ lọc **chỉ áp dụng khi bấm Tìm kiếm/Enter**, không phân biệt dấu.
  - Vùng lọc khung xám, ô 40px, nhãn 13px/600.
  - Nút "Đồng bộ thủ công" kiểu Primary, "Xuất Excel" kiểu Outline.
  - Bảng chuẩn (tiêu đề 42px, hàng 48px). Cột số căn phải `tabular-nums`; trạng thái là Badge căn trái; ngày giờ hiện 2 dòng.
  - Cột Thu thập có tên và mã, cắt chữ kèm tooltip. 2 nút thao tác dạng icon có tooltip. Dòng Tổng hợp nền `#F8FAFC`.
  - Phân trang dùng component chung. Modal Lịch sử đối soát theo chuẩn mục 5.4.
- `ReconciliationDetailModal.tsx`: modal chuẩn. Phần thông tin hiển thị dạng nhãn – giá trị, thẻ số liệu bo 16px, trạng thái dạng Badge, nút Đóng kiểu Outline.
- `ReconciliationHistoryTab.tsx`: bảng, Badge, phân trang, tìm kiếm và bộ lọc theo chuẩn.
- Tab ẩn (`hideSetupTab`/`hideLogTab` = true ở cả 3 trang):
  - `ReconciliationServiceSetupTab.tsx` và `ReconciliationLogTab.tsx`: chuẩn hóa thẻ, tìm kiếm, bảng, Badge. Thêm phân trang chung (trước đây không có).
  - `AddServiceConfigModal.tsx` và `DeleteConfirmModal.tsx`: modal chuẩn, ô nhập 40px, nút Primary/Outline/Destructive.
- Không sửa `common/StatusTag.tsx` (dùng chung). Trong các file đối soát, StatusTag được thay bằng Badge.

**Kiểm tra (chạy app):**
- 3 trang đại diện: tiêu đề cột 13px/700 đen cao 42px, hàng 48px. Căn lề: STT giữa, số phải, badge và ngày trái, thao tác giữa.
- Modal Chi tiết và modal Lịch sử hiển thị đúng chuẩn.
- Tìm "thang 12": gõ xong chưa lọc, nhấn Enter ra 1 kết quả.
- 2 tab ẩn và 2 modal được kiểm tra trên server phụ bật tạm các tab này (không sửa code): ô nhập 40px, modal z 110, tiêu đề 16px/500.
- Không lỗi console. `tsc` không có lỗi mới. `vite build` thành công.

**Lưu ý:**
- Dữ liệu ngày giữ nguyên định dạng `yyyy-MM-dd`.
- Dữ liệu mock của `InternalReconciliationPage` dùng số ngẫu nhiên (có từ trước), nên số liệu đổi sau mỗi lần tải trang.
- Prop `title` của template chưa được hiển thị (giữ nguyên như cũ).

## Cập nhật giao diện (Ngày thực hiện: 06/10/2026) — 110

**Nội dung (PM yêu cầu):** Chuẩn hóa giao diện màn **CSDL Thông tin Bản án, quyết định từ TAND tối cao** (Xem dữ liệu thu thập) theo quy chuẩn chung, giữ nguyên dữ liệu mock.

**Cách làm:** Màn này trước đây dùng khung chung `pages/DatabaseTemplate.tsx` + `DataDetailModal.tsx` (dùng chung cho ~23 trang và các màn đang khóa: InternalDataPage, Master data, ServiceDataDetail…). Để không ảnh hưởng các màn khác, tách giao diện riêng cho Bản án; **không sửa** 2 file dùng chung.
- Mới: `src/components/court-judgment/courtJudgmentMock.ts` — sao chép nguyên trạng 7 bản ghi mock và kiểu `DetailRecord` từ `DataDetailModal.tsx`.
- Mới: `src/components/court-judgment/CourtJudgmentView.tsx` — giao diện chuẩn: H1 20px/700/`#2A0F0F`; Bộ lọc nâng cao + Tải lại 40×40 căn phải (bỏ ô tìm kiếm và nút Sắp xếp như các màn khác); bộ lọc khung xám, ô 40px, giữ nguyên danh sách trường/phép so sánh và điều kiện mặc định; bảng chuẩn 42/48px, căn trái (STT, Thao tác căn giữa), Phân loại dạng Badge, cột Thao tác cố định bên phải khi cuộn ngang (mục 5.3.2); phân trang chung (số liệu thật 1-7/7 thay cho dòng cố định "1-10 / 12"); bỏ nút "Đóng" ở chân bảng; popup chi tiết chuẩn nhãn–giá trị 2 cột, giữ nguyên 17 trường và phần "Chi tiết lỗi dữ liệu" (Mô tả lỗi, Trường phát hiện lỗi, Trạng thái xử lý, Ghi chú bổ sung) dạng Badge.
- Sửa: `src/components/pages/external/CourtJudgmentPage.tsx` — dùng `DatabasePageTemplate` (stretchHeight, thẻ trắng bo 16px) + `CourtJudgmentView`. Chế độ "xử lý" giữ nguyên.

**Kiểm tra (chạy app):** H1 20px/700/`rgb(42,15,15)`; th 13px/700 đen; hàng 48px; 7 bản ghi hiển thị đủ; bộ lọc mở/thêm điều kiện bình thường; popup chi tiết đủ 17 trường; bản ghi lỗi (hàng 3, 4, 7) hiển thị đúng phần lỗi; cột Thao tác cố định bên phải; không lỗi console; `tsc` không lỗi mới; `vite build` thành công.

**Lưu ý:** màn Cung cấp dữ liệu → Bản án (`provision-external-court-judgment`) dùng cùng trang nên cũng nhận giao diện mới.

## Cập nhật giao diện (Ngày thực hiện: 06/10/2026) — 109

**Nội dung (PM yêu cầu):** Bỏ tất cả nút **Kết xuất** ở các màn Xem dữ liệu thu thập.

**Thay đổi:** Xóa nút Kết xuất tại 8 màn: Báo cáo viên pháp luật (`FamilyBaseSearchFilter.tsx`), Đấu giá tài sản (`AuctionSearchFilter.tsx`), Điều ước quốc tế (`InternationalSearchFilter.tsx`), Nhóm danh mục (`CategoryGroupSearchFilter.tsx`), Nhóm bảo hiểm xã hội (`SocialSecuritySearchFilter.tsx`), Nhóm người có công (`MeritoriousSearchFilter.tsx`), Nhóm trẻ em (`ChildrenSearchFilter.tsx`), Phần mềm thống kê ngành tư pháp (`LegalCenterPage.tsx`). Các màn còn lại vốn không có nút này. Thanh thao tác còn: Bộ lọc nâng cao + Tải lại.

**Kiểm tra (chạy app, 15 màn):** không còn nút Kết xuất; thanh thao tác = Bộ lọc nâng cao + Tải lại; không lỗi console; `tsc` không lỗi mới; `vite build` thành công.

## Cập nhật giao diện (Ngày thực hiện: 06/10/2026) — 108

**Nội dung (PM yêu cầu):** Áp dụng quy chuẩn giao diện đã chốt trên màn CSDL Hộ tịch (thí điểm) cho **toàn bộ các màn còn lại trong "Xem dữ liệu thu thập"**. Giữ nguyên dữ liệu mock, chỉ sửa giao diện.

**Màn đã chuẩn hóa (14):** Quốc tịch, Thi hành án dân sự, Biện pháp bảo đảm, CSDL quốc gia về PL, TT Tư pháp dân sự, Trợ giúp pháp lý (civil-legal-info), Phần mềm thống kê ngành tư pháp (LegalCenterPage), Báo cáo viên/Hòa giải (family-base), Đấu giá tài sản, Điều ước quốc tế, Nhóm danh mục, Nhóm bảo hiểm xã hội, Nhóm người có công, Nhóm trẻ em.

**Thay đổi (giống màn Hộ tịch):**
- Tiêu đề H1 20px/700/`#2A0F0F`, cao dòng 32px; dòng phụ "Tích hợp / Thuộc đơn vị" giá trị in đậm (màn nào vốn có).
- Thanh thao tác căn phải: nút Bộ lọc 40×40 (`filterBtnClass`), Tải lại 40×40 icon outline, Kết xuất kiểu Outline (bỏ nền xanh lá). Không có ô tìm kiếm.
- Bộ lọc nâng cao: khung xám `#F8FAFC`, ô nhập 40px, nút xóa điều kiện có tooltip, "Áp dụng bộ lọc" Primary, "Thêm điều kiện"/"Xóa tất cả" Outline; bỏ mũi tên trang trí.
- Bảng: tiêu đề 42px 13px/700 đen nền `#F8FAFC`; hàng 48px kẻ `#E0E0E0`; STT và Thao tác căn giữa, còn lại căn trái; tên dài cắt + tooltip; nút Xem chi tiết dạng icon có tooltip; badge chuẩn (cột Phân loại); dòng rỗng "Không tìm thấy kết quả phù hợp".
- Phân trang dùng component chung `Pagination` (mục 5.14).
- Popup chi tiết: nền mờ 50%, bo 16px, tiêu đề 16px/500, nhãn–giá trị 13px (nhãn 500, giá trị 400, `#020817`), tiêu đề nhóm `SECTION_TITLE`, chân popup nút "Đóng" Outline; trạng thái dùng Badge.
- `alert()` → toast (sonner).
- Bố cục: 8 trang (Đấu giá, Báo cáo viên, Điều ước, Thống kê ngành, 4 trang Nhóm) bổ sung `stretchHeight` để nằm trong thẻ trắng bo 16px như các màn khác, bảng giãn hết chiều cao.

**Kiểm tra (chạy app, 15 màn):** H1 20px/700/`rgb(42,15,15)`; th 13px/700 đen cao 42; hàng 48px; td 13px/400 đen; căn lề đúng quy tắc; nút lọc 40×40; ô bộ lọc 40px; trang hiện tại 32×32 nền `#E6F4FF` chữ `#0091FF`; popup z 110, nền đen 50%, bo 16px, tiêu đề 16px/500, nhãn–giá trị đúng chuẩn, nút Đóng 40px; không lỗi console. `tsc` không phát sinh lỗi mới; `vite build` thành công.

**File bị ảnh hưởng:** `src/components/{nationality-acquisition (NationalityInfo*), civil-judgment, security-measures, legal-national, civil-legal-center, civil-legal-info, family-base, auction, international, category-group, social-security, meritorious, children}/*Modal|*SearchFilter|*Table.tsx`; `src/components/pages/internal/{LegalCenterPage, AuctionPage, FamilyBasePage, InternationalPage}.tsx`; `src/components/pages/external/{CategoryGroupPage, SocialSecurityGroupPage, MeritoriousGroupPage, ChildrenGroupPage}.tsx`.

**Chưa xử lý:** CSDL Bản án (`CourtJudgmentPage`) dùng khung chung `pages/DatabaseTemplate.tsx` — khung này dùng cho ~23 trang khác, chờ PM quyết định.

## Cập nhật tài liệu & giao diện (Ngày thực hiện: 06/10/2026) — 107

**Nội dung (PM yêu cầu):** Thay thanh phân trang theo mẫu PM cung cấp (MUI `Pagination` outlined / medium / rounded, số đo PM gửi) và **chốt thành quy định chung** (`compomennt.md` mục 5.14).

**Quy chuẩn:** khối bọc padding 13px, chữ 14px/400 `#555555`; ô chọn số dòng 70×36 nền `#F0F0F0`; "Hiển thị **1-10/1622**" (số in đậm); nút trang 32×32, padding 0 6px, margin 0 3px, bo 8px, chữ 13px/700; trang thường nền `#F0F0F0` chữ đen; trang hiện tại nền `#E6F4FF` chữ `#0091FF` viền 1px `rgba(37,99,235,0.5)`; mũi tên ‹ › trong suốt `#020817`, vô hiệu ở trang đầu/cuối; dấu "…" 32×19 bo 16px; rút gọn `1 2 3 4 5 … N` / `1 … c-1 c c+1 … N` / `1 … N-4 … N`.

**Thay đổi:**
- `collectionUi.tsx`: thêm component dùng chung `Pagination` + hàm `getPageItems`.
- Thay phân trang cũ tại: Danh sách dịch vụ (`CollectionSetupPage.tsx`), Quản lý nhật ký (`LogManagement.tsx`), CSDL Hộ tịch (`civil-registry/CivilRegistryInfoTable.tsx`), modal Xem chi tiết – tab Lịch sử (`ViewServiceModal.tsx`, 2 khối). Bỏ class `collection-pagination` (CSS cũ ép 13px).
- `compomennt.md`: viết lại mục 5.14 (bảng quy chuẩn + code + ví dụ); mục 2 thêm nhóm màu phân trang; mục 5.1 bỏ "Trước/Sau, số trang" khỏi kiểu Outline.

**Kiểm tra (chạy app):** khối pad 13px chữ 14px/400 `#555555`; trang hiện tại 32×32 13px/700 `#0091FF` nền `#E6F4FF` viền `rgba(37,99,235,0.5)` bo 8px; trang thường nền `#F0F0F0` chữ đen; ô chọn 70×36; Hộ tịch: `‹(vô hiệu) 1 2 3 4 5 … 125 ›` → bấm 5: `1 … 4 5 6 … 125` → bấm 125: `1 … 121–125`, › vô hiệu, "Hiển thị 1241-1250/1250"; Danh sách chọn 20 dòng → 20 hàng, 2 trang; Nhật ký 1 trang (‹ › vô hiệu); tab Lịch sử có phân trang mới; không lỗi console.

**File bị ảnh hưởng:** `src/components/pages/collection/collectionUi.tsx`, `CollectionSetupPage.tsx`, `LogManagement.tsx`, `ViewServiceModal.tsx`, `src/components/civil-registry/CivilRegistryInfoTable.tsx`, `tailieu/docs/compomennt.md`.

## Cập nhật tài liệu & giao diện (Ngày thực hiện: 06/10/2026) — 106

**Nội dung (PM yêu cầu):** Tiêu đề trang (H1) tăng độ đậm **500 → 700 (Bold)**.
- `civil-registry/CivilRegistryInfoModal.tsx`: H1 20px/700/`#2A0F0F`, cao dòng 32px.
- `compomennt.md` mục 1 và `GEMINI.md`: H1 Bold (700).

**Kiểm tra (chạy app):** "Hồ sơ đăng ký khai sinh" 20px/700/`#2A0F0F` cao 32px; không lỗi console.

**File bị ảnh hưởng:** `src/components/civil-registry/CivilRegistryInfoModal.tsx`, `tailieu/docs/compomennt.md`, `GEMINI.md`.

## Cập nhật tài liệu & giao diện (Ngày thực hiện: 06/10/2026) — 105

**Màn hình:** Xem dữ liệu thu thập → CSDL Hộ tịch điện tử (`civil-registry/CivilRegistryInfoModal.tsx`).

**Nội dung thay đổi (PM yêu cầu):**
- Tiêu đề trang (H1) theo thông số mẫu: **20px / 500 / `#2A0F0F`, cao dòng 32px**.
- Dòng phụ trả về giá trị mock cũ, giữ kiểu nhãn thường – giá trị đậm: "Tích hợp: **{tên tập dữ liệu}**" / "Thuộc đơn vị: **Cục Hành chính tư pháp**".
- Tiêu đề modal giữ 16px.
- `compomennt.md` mục 1: tách "Tiêu đề trang (H1)" 20px / cao dòng 32px / `#2A0F0F` và "Tiêu đề modal" 16px / 500 / `#020817`; mục 2 thêm màu `#2A0F0F`. `GEMINI.md`: cập nhật bảng tóm tắt.

**Kiểm tra (chạy app):** H1 20px/500/`#2A0F0F` cao 32px ở tập Khai sinh và Kết hôn; dòng phụ đổi theo tập dữ liệu; tiêu đề modal "Chi tiết bản ghi hộ tịch" 16px/500; không lỗi console.

**File bị ảnh hưởng:** `src/components/civil-registry/CivilRegistryInfoModal.tsx`, `tailieu/docs/compomennt.md`, `GEMINI.md`.

## Cập nhật tài liệu & giao diện (Ngày thực hiện: 06/10/2026) — 104

**Màn hình:** Xem dữ liệu thu thập → CSDL Hộ tịch điện tử (`civil-registry/CivilRegistryInfoModal.tsx`).

**Nội dung thay đổi (PM yêu cầu):**
- Bỏ ô tìm kiếm và nút Tìm kiếm (giữ nút Bộ lọc nâng cao và Tải lại, căn phải); bỏ logic lọc theo từ khóa đi kèm.
- Tiêu đề khối (tên tập dữ liệu) đổi thành **H1 20px / 500 / `#020817`**.
- Dòng phụ theo mẫu: "Tích hợp: **mysql0210**" / "Thuộc đơn vị: **Hộ tịch**" — nhãn 13px `#64748B`, giá trị 13px/600 `#020817` (trước: "Tích hợp: {tên tập dữ liệu}. / Thuộc đơn vị: Cục Hành chính tư pháp.").
- `compomennt.md` mục 1: **H1 16px → 20px**; `GEMINI.md` bảng tóm tắt: H1 20px.

**Kiểm tra (chạy app):** H1 "Hồ sơ đăng ký khai sinh" 20px/500/`#020817`; dòng phụ 13px, giá trị đậm 600; không còn ô/nút tìm kiếm, còn nút Bộ lọc nâng cao và Tải lại; bảng 5 bản ghi; không lỗi console.

**File bị ảnh hưởng:** `src/components/civil-registry/CivilRegistryInfoModal.tsx`, `tailieu/docs/compomennt.md`, `GEMINI.md`.

## Cập nhật giao diện — làm thử (Ngày thực hiện: 06/10/2026) — 103

**Màn hình:** Quản lý thu thập → Xem dữ liệu thu thập → **CSDL Hộ tịch điện tử** (phương án C — làm thử 1 màn trước khi nhân rộng). PM đã mở khóa `collection/DatabasePageTemplate.tsx`.

**Nội dung thay đổi:**
- `DatabasePageTemplate.tsx` (khung dùng chung 14 màn): thẻ nội dung bo 16px, viền `#E2E8F0`, bỏ shadow.
- `InnerSidebar.tsx` (sidebar phụ "Danh mục dữ liệu", dùng chung): ô tìm kiếm và ô chọn cao 40px, viền `#E2E8F0`, nền trắng.
- `civil-registry/CivilRegistryInfoModal.tsx`: tiêu đề khối 16px/500, mô tả 13px `#64748B`; **thêm thanh tìm kiếm** (logic tìm đã có nhưng thiếu ô nhập) — chỉ tìm khi bấm Tìm kiếm / Enter, không phân biệt dấu; modal "Chi tiết bản ghi hộ tịch": bo 16px, header/footer chuẩn, nhãn – giá trị theo mục 5.17 (bỏ uppercase, bỏ chữ đậm/mono/xanh ở giá trị), nút Đóng ở footer, bấm nền để đóng.
- `civil-registry/CivilRegistryInfoSearchFilter.tsx`: thanh tìm kiếm theo mục 5.19 (ô 40px đệm 16px, nút Tìm kiếm `#10B981`, nút Bộ lọc nền trắng, nút Tải lại icon 40×40, cách nhau 6px); vùng điều kiện lọc nâng cao khung xám, ô 40px, nút Thêm điều kiện / Xóa tất cả (Outline), Áp dụng bộ lọc (Primary), nút xóa điều kiện có tooltip.
- `civil-registry/CivilRegistryInfoTable.tsx`: bảng tiêu đề 42px 700 đen, hàng 48px kẻ `#E0E0E0`, căn lề theo 5.3.3 (STT, Thao tác giữa; còn lại trái), bỏ font mono, tên dài cắt `…` + tooltip; nút Xem chi tiết 32×32 có tooltip; phân trang theo 5.14; cỡ chữ 16px → 13px.

**Kiểm tra (chạy app):** bảng 42px/48px/`#E0E0E0`; tìm "nguyen": gõ chưa Enter vẫn 5 hàng → Enter còn 1 ("Nguyễn Văn An"); bộ lọc nâng cao 2 điều kiện: mọi ô 40px; modal chi tiết 12 cặp nhãn 13px/500 – giá trị 13px/400 `#020817`; ô tìm sidebar phụ 40px; màn Đấu giá (dùng chung khung) vẫn hiển thị bảng bình thường; không lỗi console.

**Chưa xử lý:** tổng số bản ghi ở phân trang là số mock cố định 1250 (hiển thị "1 - 10 / 1250" dù chỉ có vài bản ghi); nút "Áp dụng bộ lọc" chưa có chức năng (giữ nguyên như trước).

**File bị ảnh hưởng:** `src/components/pages/collection/DatabasePageTemplate.tsx`, `src/components/pages/collection/InnerSidebar.tsx`, `src/components/civil-registry/CivilRegistryInfoModal.tsx`, `CivilRegistryInfoSearchFilter.tsx`, `CivilRegistryInfoTable.tsx`.

## Cập nhật tài liệu & giao diện (Ngày thực hiện: 06/10/2026) — 102

**Màn hình:** Thiết lập thu thập — Danh sách dịch vụ và tab Quản lý nhật ký.

**Nội dung thay đổi (PM yêu cầu):**
- Nút **Bộ lọc** về **nền trắng** (viền `#CBD5E1`, icon `#475569`, hover `#F8FAFC`); đang mở: nền `#EAF3FF`, viền `#BFDBFE`, icon `#155DFC` + icon X. Bỏ kiểu nền xanh `#EFF6FF`/icon `#3B82F6` của BTP (`filterBtnClass(open)` trong `collectionUi.tsx`).
- Vùng bộ lọc nâng cao: lưới `auto-fill` → **`auto-fit`** — các ô lọc tự giãn đều lấp đủ chiều ngang khung (trước đó tab Nhật ký 4 ô vẫn chừa cột trống bên phải).
- `compomennt.md`: mục 2 bỏ màu `#3B82F6`; mục 5.1 gộp nút Bộ lọc vào kiểu Icon outline; mục 5.19 cập nhật màu nút Bộ lọc và quy tắc ô lọc tự giãn đều.

**Kiểm tra (chạy app):** nút Bộ lọc đóng nền trắng / mở nền `#EAF3FF` ở cả 2 tab; 1600px: Danh sách 6 ô × 205px, Nhật ký 4 ô × 311px, sát đều 2 bên (lệch 0px); 1280px: Nhật ký 4 ô đầy hàng, Danh sách xuống 2 hàng (4 + 2 ô cùng độ rộng cột); không lỗi console.

**File bị ảnh hưởng:** `src/components/pages/collection/collectionUi.tsx`, `CollectionSetupPage.tsx`, `LogManagement.tsx`, `tailieu/docs/compomennt.md`.

## Cập nhật giao diện (Ngày thực hiện: 05/10/2026) — 101

**Màn hình:** Thiết lập thu thập — Danh sách dịch vụ và tab Quản lý nhật ký.

**Nội dung thay đổi (PM yêu cầu):**
- Khôi phục **khung xám** bao vùng bộ lọc: nền `#F8FAFC`, viền 1px `#E2E8F0`, bo 8px, đệm 16px, cách thanh tìm kiếm 15px (`FILTER_GRID_CLS` trong `collectionUi.tsx`, dùng chung cho 2 tab).
- Thanh tìm kiếm không còn "dính lề": nguyên nhân là vùng cuộn `overflow-auto` không có lề ngang nên viền focus 2px của ô tìm kiếm (và nút sát mép phải) bị cắt. Vùng cuộn nới 2px mỗi bên (`-mx-0.5 px-0.5`) — viền focus hiển thị đủ, nội dung vẫn thẳng hàng với tab và thẻ thống kê (x=274).
- `compomennt.md` mục 5.19: vùng bộ lọc có khung xám; thêm quy tắc chừa chỗ cho viền focus.

**Kiểm tra (chạy app):** cả 2 tab — ô tìm x=274, vùng cuộn x=272 (chừa 2px), viền focus hiển thị đủ; khung lọc nền `#F8FAFC` viền `#E2E8F0` bo 8px đệm 16px cách thanh 15px; nhãn 13px/600/`#0E0D0D`; không lỗi console.

**File bị ảnh hưởng:** `src/components/pages/collection/collectionUi.tsx`, `CollectionSetupPage.tsx`, `tailieu/docs/compomennt.md`.

## Cập nhật tài liệu & giao diện (Ngày thực hiện: 05/10/2026) — 100

**Tài liệu (`compomennt.md`):** thêm mục **5.19 Tìm kiếm và Bộ lọc** theo số đo trang chuẩn BTP; PM chốt: mọi ô nhập cao **40px**, nhãn bộ lọc theo BTP (13px/600/`#0E0D0D`), nút Bộ lọc theo BTP (nền `#EFF6FF`, viền `#BFDBFE`, icon `#3B82F6`), không thêm nút X trong ô tìm kiếm; chỉ ra kết quả khi bấm Tìm kiếm / Enter.
- Mục 1: thêm dòng nhãn bộ lọc. Mục 2: thêm màu `#0E0D0D`, `#3B82F6` (+ hover `#DBEAFE`). Mục 5.1: tách dòng "Nút Bộ lọc". Mục 5.2: ô nhập 35px → 40px cho mọi ô. Mục 7.2: thêm mục kiểm tra.

**Màn hình:** Thiết lập thu thập — Danh sách dịch vụ (`CollectionSetupPage.tsx`), tab Quản lý nhật ký (`LogManagement.tsx`); kèm `ViewServiceModal.tsx`, `layout/Sidebar.tsx`, `collectionUi.tsx`:
- Tìm kiếm + bộ lọc chỉ áp dụng khi bấm nút Tìm kiếm hoặc Enter (tách giá trị đang nhập / đã áp dụng); so khớp không phân biệt hoa thường và dấu tiếng Việt; tìm xong về trang 1.
- Ô tìm kiếm cao 40px, đệm 16px; placeholder theo mẫu "Tìm kiếm theo …" (danh sách bổ sung "mã dịch vụ"; nhật ký "tên đăng nhập, họ và tên, hành động"); khoảng cách nút 6px.
- Nút Bộ lọc theo màu BTP. Vùng bộ lọc bỏ khung bao, lưới ô ~193px cách 8px, cách thanh tìm kiếm 15px; nhãn 13px/600/`#0E0D0D` cách ô 2px; ô lọc / ô ngày 40px.
- `INPUT_CLS` 40px (form Thêm mới/Chỉnh sửa tự áp dụng); ô tìm bảng/trường ở tab Cấu trúc và ô tìm menu sidebar 40px.

**Kiểm tra (chạy app, cửa sổ 1534px):** gõ "ho tich" chưa bấm vẫn 36 dịch vụ → bấm Tìm kiếm còn 3 → xóa + Enter về 36; nhật ký "dang nhap" 10 → 2; lọc Bản nháp chỉ áp dụng sau khi bấm (36 → 2); ô tìm 40px pad 16; khoảng cách 6px/6px; nút Bộ lọc đúng màu; nhãn bộ lọc 13px/600/`#0E0D0D` cao 20, thanh → nhãn 15px, nhãn → ô 2px, ô 199×40 cách 8px; mọi ô nhập (danh sách, sidebar, Thêm mới, chi tiết) cao 40px; không lỗi console.

**File bị ảnh hưởng:** `tailieu/docs/compomennt.md`, `src/components/pages/collection/collectionUi.tsx`, `CollectionSetupPage.tsx`, `LogManagement.tsx`, `ViewServiceModal.tsx`, `src/components/layout/Sidebar.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 05/10/2026) — 99

**Màn hình:** Thiết lập thu thập → tab **Quản lý nhật ký** (`LogManagement.tsx`) — áp dụng `compomennt.md`.

**Nội dung thay đổi:**
- Thanh công cụ: ô tìm kiếm cao 35px; nút Tìm kiếm nền `#10B981` 40×40; nút Bộ lọc viền `#CBD5E1`, đang mở nền `#EAF3FF` (đổi icon thành X).
- Bộ lọc nâng cao: khung bo 16px; nhãn theo kiểu nhãn trường chung (13px/500/`#020817`, bỏ `uppercase`); ô chọn / ô ngày cao 35px.
- Bảng: tiêu đề 42px 700 đen nền `#F8FAFC`; hàng 48px kẻ `#E0E0E0`; căn lề theo mục 5.3.3 (STT, Thao tác giữa; còn lại trái); Người dùng và Hành động 2 dòng (dòng phụ `#64748B`), mỗi dòng cắt `…` + tooltip; Thời gian `dd/MM/yyyy` + giờ xuống dòng; badge trạng thái chuẩn (thay `StatusTag`); nút Xem chi tiết 32×32 có tooltip (thay nút tròn `title`).
- Phân trang theo mục 5.14 (bỏ `opacity-50`); cỡ chữ vùng bảng 16px → 13px.
- Modal Chi tiết nhật ký: bo 16px, z-index 100, bấm nền để đóng; tiêu đề 16px/500; nhãn – giá trị theo mục 5.17 (lưới 2 cột, trống hiển thị `-`); footer `#F8FAFC` nút Đóng (Outline).
- `alert()` kết xuất → Toast.
- **Sửa lỗi bộ lọc ngày:** trước dùng phép "hoặc" nên chọn cả Từ ngày và Đến ngày vẫn ra bản ghi ngoài khoảng; nay lọc theo cả hai mốc (tính cả ngày cuối).

**Kiểm tra (chạy app):** bảng 42px/48px/`#E0E0E0`, không còn nút/badge lệch chuẩn; ô nhập/chọn 35px; lọc 19/12/2023–19/12/2023 → 8/10 bản ghi, chỉ còn ngày 19/12/2023; tooltip "Xem chi tiết"; modal chi tiết 8 cặp nhãn 13px/500 – giá trị 13px/400 `#020817`; không lỗi console.

**File bị ảnh hưởng:** `src/components/pages/collection/LogManagement.tsx`.

## Cập nhật tài liệu & giao diện (Ngày thực hiện: 05/10/2026) — 98

**Nội dung:** PM yêu cầu nhãn trường (form Thêm mới/Chỉnh sửa) và tên trường (Xem chi tiết) đổi sang **màu đen**, giữ độ đậm Medium (500).
- `collectionUi.tsx`: `FIELD_LABEL` `#64748B` → `#020817`.
- `compomennt.md` mục 1, 5.2, 5.17 (kèm code mẫu và ví dụ hiển thị): màu nhãn/tên trường `#020817`; ghi chú tên trường và giá trị cùng màu, phân biệt bằng độ đậm 500/400.

**Kiểm tra (chạy app):** nhãn Thêm mới (6), Chỉnh sửa (6), tên trường Xem chi tiết (15) đều 13px/500/`#020817`; giá trị 13px/400/`#020817` (email giữ màu liên kết); không lỗi console.

**File bị ảnh hưởng:** `src/components/pages/collection/collectionUi.tsx`, `tailieu/docs/compomennt.md`.

## Cập nhật tài liệu & giao diện (Ngày thực hiện: 05/10/2026) — 97

**Tài liệu (`compomennt.md`):** đồng bộ **một kiểu nhãn trường** cho form Thêm mới/Chỉnh sửa và tên trường ở Xem chi tiết: **13px / Medium (500) / `#64748B`**; giá trị / chữ nhập 13px/400 `#020817`.
- Mục 1 Typography: gộp dòng "Nhãn (Label) form" thành "Nhãn trường" dùng chung; "Ô nhập liệu / Giá trị trường".
- Mục 5.2: nhãn `#64748B`; ô nhập vô hiệu dùng nền `#F1F5F9` + chữ `#94A3B8` (bỏ `opacity-50`, thống nhất với nút mục 5.1); dấu `*`, viền lỗi, chữ lỗi dùng mã `#DC2626` (thay class `red-600`).
- Mục 5.17: tên trường cùng kiểu với nhãn form; giá trị `#020817`; ghi màu bằng mã hex thay tên Tailwind.

**Màn hình:** Thiết lập thu thập — `ServiceModals.tsx` (Thêm mới, Chỉnh sửa, Cài đặt nâng cao) và `ViewServiceModal.tsx` (Xem chi tiết, modal Ngừng hoạt động):
- Thêm hằng `FIELD_LABEL`, `LABEL_CLS`, `FIELD_VALUE`, `REQUIRED_MARK` trong `collectionUi.tsx`; `INPUT_CLS` vô hiệu theo quy tắc mới.
- 13 nhãn form + 47 tên trường + 41 giá trị chuyển sang hằng chung; 7 dấu `*` dùng `#DC2626`.

**Kiểm tra (chạy app):** nhãn Thêm mới (6), Chỉnh sửa (6) và tên trường Xem chi tiết (15/8/5 ở 3 tab) đều 13px/500/`#64748B`; giá trị 13px/400/`#020817` (email giữ màu primary vì là liên kết); dấu `*` `#DC2626`; không lỗi console.

**Chưa áp dụng:** nhãn trong tab Cấu hình kết nối / Cấu hình thu thập / Nạp cấu trúc của form (component `[ ]` đang khóa); nhãn panel Bộ lọc ở danh sách.

**File bị ảnh hưởng:** `tailieu/docs/compomennt.md`, `src/components/pages/collection/collectionUi.tsx`, `ServiceModals.tsx`, `ViewServiceModal.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 05/10/2026) — 96

**Màn hình:** Thiết lập thu thập → modal **Xem chi tiết dịch vụ** (`ViewServiceModal.tsx`).

**Nội dung thay đổi:**
- Thêm **footer cố định** ở đáy modal (`px-6 py-4`, nền `#F8FAFC`, viền trên `#E2E8F0`), không cuộn theo nội dung.
- Tab Thông tin chung / Cấu hình kết nối / Cấu hình thu thập: nút **Chỉnh sửa** chuyển từ cuối nội dung tab xuống footer (bên phải).
- Tab Cấu trúc: 3 nút chuyển từ đầu nội dung xuống footer — **Xóa cấu trúc** (Destructive, bên trái); **Nạp cấu trúc** (Outline), **Sửa cấu trúc** (Primary) bên phải.
- Tab Lịch sử hoạt động: không có thao tác → không hiển thị footer.

**Kiểm tra (chạy app):** modal 1024×800 ở cả 5 tab, footer sát đáy modal; không còn nút thao tác trong vùng nội dung; nút Chỉnh sửa giữ nguyên vị trí khi cuộn nội dung; bấm Chỉnh sửa → `/collection-setup/edit/1?tab=general`, Sửa cấu trúc → `?tab=mapping`; không lỗi console.

**File bị ảnh hưởng:** `src/components/pages/collection/ViewServiceModal.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 05/10/2026) — 95

**Màn hình:** Thiết lập thu thập → modal **Xem chi tiết dịch vụ** (`ViewServiceModal.tsx`).

**Nội dung thay đổi:**
- Cố định kích thước modal **1024 × 800px**, căn giữa màn hình; màn hình nhỏ hơn thì thu theo khung (`max-w-full`, `max-h-full`, lề 16px).
- Header (breadcrumb, tên dịch vụ, badge) và thanh tab đứng yên; **chỉ vùng nội dung tab cuộn bên trong modal** (`overflow-y-auto`, thanh cuộn `custom-scrollbar`). Lớp phủ nền không còn cuộn.
- Bỏ `min-h-[500px]` và `sticky` của thanh tab (không còn cần vì header không cuộn).

**Kiểm tra (chạy app):** khổ 1600×1000 — modal 1024×800 ở cả 5 tab; khổ 1280×720 — modal 1024×688 vừa khung; tab Thông tin chung / Cấu trúc (và Cấu hình kết nối, Lịch sử ở khổ nhỏ) có thanh cuộn bên trong; cuộn chuột: nội dung cuộn 506px, tiêu đề modal đứng yên; lớp phủ không cuộn; không lỗi console.

**File bị ảnh hưởng:** `src/components/pages/collection/ViewServiceModal.tsx`.

## Cập nhật giao diện toàn hệ thống (Ngày thực hiện: 05/10/2026) — 94

**Phạm vi:** Sidebar, Header, Breadcrumb dùng chung (`layout/Sidebar.tsx`, `layout/TopBar.tsx`) — PM chọn phương án 1: sửa theo `compomennt.md` mục 4.4, 5.15, 5.18; đổi tên logo; **giữ** vị trí "Xử lý dữ liệu" và cấu trúc breadcrumb 3 cấp.

**Nội dung thay đổi:**
- Sidebar: rộng 288px → **250px** (thu gọn giữ 80px), viền phải `#E2E8F0`; nút thu gọn chuyển thành nút tròn 24px đè mép phải.
- Logo: "Kho DLDC" 16px/700 → **"Kho Dữ liệu dùng chung"** 13px/600 `#020817`; dòng phụ "Hệ thống quản lý Bộ Tư Pháp" 10px/700 → **"Thuộc quản lý của Bộ Tư pháp"** 12px/400 `#64748B`; chữ cách mép trái 54px.
- Ô tìm menu: cao 35px, 13px/400, nền trắng, viền `#E2E8F0`.
- Menu cấp 1: cao 35px, bo 10px, cách mép 6px; hàng cha `#475569`, mục lá `#020817`, hover `#F1F5F9`. Menu cấp 2–4: cao 30px, bo 10px, chữ `#020817`.
- Mục đang chọn (mọi cấp): nền `#EAF3FF`, chữ `#155DFC`, đậm 500 (trước: `blue-50`/`blue-700`/400).
- Đổi tên menu: "Tổng quan thu thập" → **Dashboard**; "Dữ liệu chủ" (cấp 1) → **Quản lý dữ liệu chủ**.
- Số phiên bản cuối sidebar: v2.4.6 → **v2.6.24**.
- Header: viền dưới `#E2E8F0`; nút chuông 36×36 bo 8px → **40×40 tròn**, icon `#475569`.
- Breadcrumb: 14px, mục trước `slate-500`, mục cuối `slate-900`/500 → **12px/400 `#020817`** cho mọi mục và dấu `/` (giữ 3 cấp).
- `compomennt.md` 4.4 / 5.18: cập nhật ghi chú sidebar và tên menu.

**Kiểm tra (chạy app):** sidebar 250px, logo x=54 không bị cắt chữ, ô tìm 35px, cấp 1 cao 35px x=6 bo 10px, cấp 2 cao 30px x=22, mục "Thiết lập thu thập" đang chọn nền `#EAF3FF` chữ `#155DFC` 500; breadcrumb 12px/400 `#020817`; chuông 40×40 tròn; thu gọn 80px ↔ mở 250px; không lỗi console; build thành công.

**Chưa đổi:** nhãn breadcrumb/tiêu đề trang của các màn liên quan vẫn ghi "Tổng quan thu thập", "Dữ liệu chủ" (giữ nguyên breadcrumb theo yêu cầu). Lỗi TS có sẵn ở `TopBar.tsx` dòng 60–62 (`useRef` null) — không thuộc thay đổi này.

**File bị ảnh hưởng:** `src/components/layout/Sidebar.tsx`, `src/components/layout/TopBar.tsx`, `tailieu/docs/compomennt.md`.

## Cập nhật giao diện (Ngày thực hiện: 05/10/2026) — 93

**Màn hình:** Thiết lập thu thập → modal **Thêm mới**, **Chỉnh sửa** (`ServiceModals.tsx`) và **Xem chi tiết** (`ViewServiceModal.tsx`) — áp dụng `compomennt.md`.

**Nội dung thay đổi:**
- Tách bộ class/thành phần chuẩn dùng chung trong mục Thu thập ra file mới `collection/collectionUi.tsx` (nút Primary/Outline/Destructive/Page/Ghost icon, Badge, Tab, Input, tiêu đề khối, thẻ, tooltip, cắt chữ); `CollectionSetupPage.tsx` dùng lại từ file này. `Badge` nhận thêm `variant` để thay `StatusTag`.
- **Thêm mới / Chỉnh sửa:** khung modal bo 16px, z-index 100 (modal con 110), bỏ hiệu ứng blur; tiêu đề 16px/500 không uppercase; tab 48px 14px/600; ô nhập/chọn cao 35px; vùng đính kèm viền nét đứt theo mục 5.13; nút footer Hủy/Kiểm tra kết nối (Outline), Tiếp tục/Thêm/Cập nhật (Primary) cao 40px bo 8px; 3 modal kết quả kiểm tra kết nối và modal Cài đặt nâng cao chuẩn hóa tiêu đề, nút, header/footer; `alert()` → Toast.
- **Xem chi tiết:** header (breadcrumb 12px, H1 16px/500), badge trạng thái theo trạng thái đã chuẩn hóa (khớp danh sách); tab 48px 14px/600; thẻ khối bo 16px viền `#E2E8F0`, tiêu đề khối 14px/500; 13 `StatusTag` → `Badge` (viền 1px, 13px/400, cao 26px); nút Chỉnh sửa/Sửa cấu trúc (Primary), Nạp cấu trúc/Xuất CSV (Outline), Xóa cấu trúc (Destructive); phân trang theo mục 5.14; ô tìm/chọn 35px; bảng tiêu đề 42px 700, hàng 48px kẻ `#E0E0E0`; modal Ngừng hoạt động bên trong chuẩn hóa, `alert()` → Toast; bỏ toàn bộ `uppercase`, `opacity-50`, `rounded-md`.
- **Sửa lỗi:**
  - Mở Xem chi tiết / Chỉnh sửa từ URL dùng dữ liệu chưa chuẩn hóa → trạng thái khác danh sách (VD #5). Nay dùng `normalizeService`.
  - `AddServiceModal` / `EditServiceModal` gọi `return null` trước hook (vi phạm quy tắc hook, sinh cảnh báo React) → tách hàm bọc ngoài.

**Kiểm tra (chạy app, đo computed style):** Thêm mới, Chỉnh sửa, 5 tab Xem chi tiết — không còn nút/ô nhập/badge lệch chuẩn; bảng 42px/48px/`#E0E0E0`; header #5 hiển thị "Ngưng hoạt động" khớp danh sách; không lỗi console; danh sách vẫn đúng logic 10/10; build thành công.

**Chưa sửa (ngoài phạm vi/khóa):** nội dung tab Cấu hình kết nối / Cấu hình thu thập / Nạp cấu trúc trong form (component `[ ]`); `ConfirmModal`, `BaseModal` dùng chung.

**File bị ảnh hưởng:** `src/components/pages/collection/collectionUi.tsx` (mới), `ServiceModals.tsx`, `ViewServiceModal.tsx`, `CollectionSetupPage.tsx`.

## Gộp nhánh nhalt8/kdlbtp_v1.4 (Ngày thực hiện: 05/10/2026) — 92

**Nội dung:** Gộp `origin/main` (đã chứa PR #10 — `nhalt8/kdlbtp_v1.4`, commit `8c2fcd58`) vào `main` sau phiên bản v2.6.24. Sao lưu trước khi gộp: nhánh `backup/v2.6.24-truoc-merge`.

**Xử lý xung đột `CollectionSetupPage.tsx`** — giữ toàn bộ phần đã sửa (quy chuẩn giao diện, logic thao tác, badge, căn lề) và đưa tính năng v1.4 vào theo quy chuẩn mới:
- Gộp cột **Tên / Mã dịch vụ**: dòng 1 tên, dòng 2 mã (màu `#64748B`), mỗi dòng cắt `…` + tooltip (thay `ClampedText` 2 dòng của v1.4 để giữ hàng 48px).
- Cột **Người tạo / Ngày tạo**: dòng 1 người tạo (`getCreator`), dòng 2 ngày giờ.
- Thao tác **Xóa cấu trúc** trong nhóm Dữ liệu của menu `⋯` (màu đỏ, modal xác nhận); chưa có quy tắc riêng — chỉ khóa khi dữ liệu Đang xử lý.
- Vùng nội dung tab `p-6` → `py-6` (MainLayout đã có padding).

**Xung đột `log_update.md`:** giữ cả hai phần (các mục 72–76 của nhánh v1.4 trùng số với mục của main). Khối đánh dấu xung đột cũ (`<<<<<<< HEAD … d0d4b0c`) đã có sẵn trong file ở cả hai nhánh từ trước — giữ nguyên.

## Cập nhật tài liệu & giao diện (Ngày thực hiện: 05/10/2026) — 91

**PM chốt:** badge trong bảng **căn trái**.

**Nội dung thay đổi:**
- `CollectionSetupPage.tsx`: gỡ tham số xem trước `?badge=left`; 4 cột badge (Loại nguồn, Phương thức kết nối, Trạng thái dịch vụ, Trạng thái dữ liệu) cố định căn trái (tiêu đề + dữ liệu).
- `compomennt.md` mục 5.3.3: dòng Badge → **Trái**; code mẫu `badge: 'text-left'`.

**Kiểm tra (chạy app):** URL thường `/collection-setup` (không tham số) — STT, Thao tác căn giữa; 9 cột còn lại căn trái cả tiêu đề và ô; Ngày tạo 2 dòng; tsc không lỗi ở file; không lỗi console.

**File bị ảnh hưởng:** `src/components/pages/collection/CollectionSetupPage.tsx`, `tailieu/docs/compomennt.md`.

## Cập nhật tài liệu & giao diện (Ngày thực hiện: 05/10/2026) — 90

**Tài liệu (`tailieu/docs/compomennt.md`):** thêm mục **5.3.3 Căn lề cột** — căn theo kiểu dữ liệu, tiêu đề căn giống dữ liệu: STT giữa; văn bản trái; số phải + `tabular-nums`; ngày giờ trái (có cả ngày và giờ → giờ xuống dòng 2, chỉ có ngày → 1 dòng); phiên bản/mã trái; badge **chờ quyết định**; thao tác, checkbox giữa. Kèm quy tắc 1 dòng/ô (ngoại lệ ngày giờ), giá trị trống, độ rộng cột. Bảng mục 5.3 thêm dòng trỏ sang 5.3.3.

**Màn hình:** Thiết lập thu thập (`CollectionSetupPage.tsx`):
- Cột Phiên bản, Ngày tạo: căn giữa → căn trái (cả tiêu đề và dữ liệu).
- Xem trước căn lề badge: mặc định căn giữa; thêm `?badge=left` vào URL (VD `/collection-setup?badge=left`) để 4 cột badge (Loại nguồn, Phương thức kết nối, Trạng thái dịch vụ, Trạng thái dữ liệu) căn trái. **Mã tạm phục vụ PM xem trước — gỡ sau khi chốt.**

**Kiểm tra (chạy app):** đo `text-align` tiêu đề và ô cả 11 cột ở 2 chế độ — đúng bảng trên; Ngày tạo hiển thị 2 dòng (`19/12/2025` / `15:30:00`); tsc không lỗi ở file; không lỗi console.

**File bị ảnh hưởng:** `tailieu/docs/compomennt.md`, `src/components/pages/collection/CollectionSetupPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 05/10/2026) — 89

**Màn hình:** Thiết lập thu thập → danh sách dịch vụ (`CollectionSetupPage.tsx`).

**Nội dung thay đổi:** Đổi nhãn phương thức kết nối theo ảnh mẫu PM — badge trong bảng và lựa chọn trong bộ lọc "Loại kết nối":
- "Cơ sở dữ liệu" → **"Cơ Sở Dữ Liệu"**; "Tải file Excel" → **"File"**; "API nhận JSON" → **"API nhận (JSON)"**; "API nhận XML" → **"API nhận (XML)"**; "API" giữ nguyên.
- `compomennt.md` mục 5.8: cập nhật tên badge tương ứng.

**Kiểm tra (chạy app):** 10/10 hàng đúng logic thao tác (API nhận (JSON)/(XML) vẫn ẩn Tích hợp mới, Cập nhật dữ liệu); lọc từng loại đều ra đúng 1 dịch vụ (API → 31); màu badge giữ nguyên; tsc không lỗi ở file; không lỗi console.

**File bị ảnh hưởng:** `src/components/pages/collection/CollectionSetupPage.tsx`, `tailieu/docs/compomennt.md`.

## Cập nhật giao diện (Ngày thực hiện: 05/10/2026) — 88

**Màn hình:** Thiết lập thu thập → danh sách dịch vụ (`CollectionSetupPage.tsx`).

**Nội dung thay đổi:**
- Mock: dịch vụ #8 → phương thức **Tải file Excel** (trong `DEMO_STATES`) — 10 dịch vụ đầu có đủ API, API nhận JSON, API nhận XML, Tải file (Cơ sở dữ liệu nằm ở trang sau, dữ liệu gốc).
- Màu badge theo ảnh mẫu PM cung cấp (đo từ ảnh, quy về màu Tailwind gần nhất):
  - Loại nguồn: Trong ngành `#8200DB/#FAF5FF/#E7E1EC`; Ngoài ngành `#2563EB/#EFF6FF/#BFDBFE`.
  - Phương thức: Cơ sở dữ liệu `#4338CA/#EEF2FF/#E0E7FF`; Tải file `#475569/#F8FAFC/#E2E8F0`; API `#047857/#ECFDF5/#D1FAE5`; API nhận JSON/XML `#C2410C/#FFF7ED/#FED7AA`.
  - Trạng thái dịch vụ: Hoạt động `#15803D/#F0FDF4/#DCFCE7`; Bản nháp, Ngưng hoạt động `#64748B/#F8FAFC/#E2E8F0`.
  - Trạng thái dữ liệu: Rỗng `#64748B/#F8FAFC/#E2E8F0`; Lỗi cập nhật `#B91C1C/#FEF2F2/#FEE2E2`; Cập nhật thành công `#047857/#ECFDF5/#D1FAE5`; Đang xử lý `#D97706/#FFFFFF/#F6B657` (nền trắng, viền cam).
- `compomennt.md` mục 5.8: thay bảng màu badge (bỏ các dòng "chưa xác nhận"), ghi chú "Ngoài ngành" dùng `#2563EB` theo ảnh mẫu, "Đang xử lý" cần xác nhận lại bằng DevTools.

**Kiểm tra (chạy app):** đo computed style 14 badge — khớp bảng trên, cao 26px; hàng 8 hiển thị "Tải file Excel", menu đúng logic (Tích hợp mới ✓, Cập nhật dữ liệu ✗, Xóa dữ liệu ✓, Ngừng hoạt động ✗, Xóa dịch vụ ✗); lọc Tải file Excel → 1 hàng; tsc không lỗi ở file; không lỗi console.

**File bị ảnh hưởng:** `src/components/pages/collection/CollectionSetupPage.tsx`, `tailieu/docs/compomennt.md`.

## Cập nhật logic thao tác (Ngày thực hiện: 05/10/2026) — 87

**Màn hình:** Thiết lập thu thập → danh sách dịch vụ (`CollectionSetupPage.tsx`).

**Nội dung thay đổi:**
- Bổ sung 2 phương thức kết nối **API nhận JSON**, **API nhận XML** (giữ nhãn "API" cho API thường); badge màu tạm (chưa có màu chuẩn).
- Dịch vụ có phương thức API nhận JSON / API nhận XML: **ẩn hẳn** "Tích hợp mới" và "Cập nhật dữ liệu" khỏi menu `⋯` (các thao tác khác vẫn theo logic mục 86).
- Mock: dịch vụ #2 → API nhận JSON, #5 → API nhận XML (trong `DEMO_STATES`).
- Sửa lỗi bộ lọc "Loại kết nối": trước so `service.type` (REST/SOAP) với "API"/"Cơ sở dữ liệu" nên luôn rỗng → so theo phương thức kết nối; thêm 2 lựa chọn API nhận JSON / XML.
- `compomennt.md` mục 5.8: dòng badge Phương thức kết nối bổ sung 2 loại mới.

**Kiểm tra (chạy app):** đối chiếu tự động 10 hàng đầu — 10/10 đúng (hàng #2, #5 không có Tích hợp mới / Cập nhật dữ liệu); lọc API → 10 hàng/trang, API nhận JSON → 1, API nhận XML → 1, Cơ sở dữ liệu → 1; tsc không lỗi ở file; không lỗi console.

**File bị ảnh hưởng:** `src/components/pages/collection/CollectionSetupPage.tsx`, `tailieu/docs/compomennt.md`.

## Cập nhật logic thao tác (Ngày thực hiện: 05/10/2026) — 86

**Màn hình:** Thiết lập thu thập → danh sách dịch vụ (`CollectionSetupPage.tsx`).

**Logic thao tác theo trạng thái (PM cung cấp, đã xác nhận 2 điểm mâu thuẫn):**
| Thao tác | Được phép khi |
|---|---|
| Xem chi tiết | Luôn luôn |
| Mapping chi tiết | Dữ liệu = Cập nhật thành công |
| Tích hợp mới | Dữ liệu = Rỗng hoặc Lỗi cập nhật |
| Cập nhật dữ liệu | Dữ liệu = Cập nhật thành công |
| Xóa dữ liệu thu thập | Dữ liệu ≠ Rỗng và CSDL đích không còn dữ liệu (lỗi: "CSDL đích còn dữ liệu - xóa dữ liệu chuyển đổi trước") |
| Ngừng hoạt động | Dịch vụ = Hoạt động; dịch vụ Ngưng hoạt động → nút đổi thành **Hoạt động** (mở modal xác nhận kích hoạt); Bản nháp → khóa |
| Xóa dịch vụ | Dữ liệu = Rỗng |
| Dữ liệu Đang xử lý | Khóa tất cả trừ Xem chi tiết |

**Nội dung thay đổi:**
- Thêm `getActionRules()` trả về lý do khóa cho từng thao tác; nút Mapping bị khóa giữ vị trí, tooltip ghi lý do; mục menu `⋯` bị khóa hiển thị lý do 12px ngay trong mục (compomennt.md 5.3.2).
- Chuẩn hóa trạng thái: `serviceStatus` (Hoạt động / Ngưng hoạt động / Bản nháp), `dataStatus` (Rỗng / Lỗi cập nhật / Cập nhật thành công / Đang xử lý — đổi nhãn "Đang lấy dữ liệu" → "Đang xử lý"; "Lỗi cấu trúc" gộp vào "Lỗi cập nhật").
- Mock trạng thái demo cho 10 dịch vụ đầu (`DEMO_STATES` trong `CollectionSetupPage.tsx`) — đủ 3 trạng thái dịch vụ, 4 trạng thái dữ liệu, 1 dịch vụ (#7) CSDL đích còn dữ liệu. **Không sửa `mockCollectionServices.ts`** vì file này còn được Dashboard thu thập / Báo cáo KPI dùng.
- Sửa lỗi thẻ thống kê: Bản nháp/Ngưng hoạt động trước đếm `format_error`/`structure_error` (luôn 0) → đếm theo `serviceStatus`; bộ lọc Trạng thái lọc theo `serviceStatus`.
- Thêm modal xác nhận "Kích hoạt lại dịch vụ" cho nút Hoạt động.

**Kiểm tra (chạy app):** đối chiếu tự động 10 hàng đầu với ma trận trên — 10/10 đúng; tooltip lý do trên nút Mapping bị khóa hiển thị đúng; thẻ thống kê 36 / 31 / 2 / 3; lọc Bản nháp → 2, Ngưng hoạt động → 3, Hoạt động → 31; tsc không lỗi ở file; không lỗi console.

**File bị ảnh hưởng:** `src/components/pages/collection/CollectionSetupPage.tsx`.

## Cập nhật tài liệu & giao diện (Ngày thực hiện: 05/10/2026) — 85

**Tài liệu (`tailieu/docs/compomennt.md`):**
- Mục 5.1 Nút bấm: gộp bảng loại nút với trạng thái thành **một bảng** (Bình thường / Hover / Đang chọn-mở / Bị vô hiệu) cho 8 loại: Primary, Outline, Ghost, Destructive, Icon nhấn mạnh, Icon outline, Icon trong bảng, Chuông. Quy tắc: nền `#F1F5F9` + chữ `#94A3B8` chỉ dành cho nút vô hiệu, bỏ `opacity-50`; trạng thái đang chọn dùng tông xanh `#EAF3FF`/`#155DFC`; viền nút outline/icon outline `#CBD5E1` (trang chuẩn `#E2E8F0`).
- Mục 5.3.2: đồng bộ hover nút icon trong bảng `#F1F5F9`, thêm trạng thái menu mở / vô hiệu. Mục 5.14 Phân trang: nút dùng kiểu Outline, Trước/Sau ở đầu/cuối dùng trạng thái vô hiệu; cập nhật ví dụ.

**Màn hình:** Thiết lập thu thập (`CollectionSetupPage.tsx`) — áp dụng cho **mọi nút trên màn hình**:
- Thêm hằng `BTN_PRIMARY`, `BTN_OUTLINE`, `BTN_PAGE`, `BTN_GHOST_ICON`, `BTN_DISABLED`, `MENU_ITEM` dùng chung trong file.
- Thêm mới, Đóng/Đồng ý/Gửi thông báo trong modal → Primary; Kết xuất, Đóng, Hủy bỏ → Outline; Tìm kiếm hover `#059669`; Bộ lọc viền `#CBD5E1`, đang mở nền `#EAF3FF`; nút X đóng modal → ghost icon.
- Phân trang: Trước/Sau/số trang kiểu Outline, trang hiện tại nền `#155DFC`, vô hiệu nền xám chữ nhạt.
- Nút "Xác nhận ngừng" (modal Ngừng hoạt động): bỏ gradient cam + `opacity-50`, dùng Primary; khi chưa nhập lý do hiển thị trạng thái vô hiệu chuẩn.
- Nút icon trong bảng: hover `#F1F5F9`, menu `⋯` đang mở nền `#EAF3FF` icon `#155DFC`; mục menu hover `#F1F5F9`.
- Mọi nút bấm được có con trỏ `pointer`, focus bàn phím viền 2px `#155DFC`.
- Sửa lỗi tooltip "Thao tác khác" bị kẹt hiển thị đè lên modal sau khi chọn mục trong menu (tooltip nút `⋯` chỉ bật khi hover).

**Kiểm tra (chạy app, đo computed style):** Trước (vô hiệu) nền `#F1F5F9` chữ `#94A3B8` con trỏ not-allowed — Sau/số trang nền trắng viền `#CBD5E1` chữ `#334155` con trỏ pointer; Kết xuất hover nền `#F8FAFC` viền `#94A3B8`; Bộ lọc mở nền `#EAF3FF`; `⋯` mở nền `#EAF3FF`; "Xác nhận ngừng" vô hiệu khi chưa nhập lý do → xanh khi đã nhập; không còn tooltip kẹt; không lỗi console; tsc không lỗi ở file.

**File bị ảnh hưởng:** `tailieu/docs/compomennt.md`, `src/components/pages/collection/CollectionSetupPage.tsx`.

## Sửa lỗi (Ngày thực hiện: 05/10/2026) — 84

**Màn hình:** Thiết lập thu thập → tab Thiết lập dịch vụ (`CollectionSetupPage.tsx`) — thanh phân trang.

**Lỗi:** Chọn số bản ghi/trang (20, 50, 100) không có tác dụng — ô chọn chưa gắn với state `itemsPerPage`.

**Sửa:**
- Gắn ô chọn với `itemsPerPage` (`value` + `onChange`), khi đổi số bản ghi thì quay về trang 1.
- Khi danh sách rỗng hiển thị `0 - 0 / 0` thay vì `1 - 0 / 0`; nút "Sau" vô hiệu khi `currentPage >= tổng số trang` (tránh bấm được khi không có dữ liệu).

**Kiểm tra (chạy app):** 10 → 10 hàng, 4 trang; trang 2 hiển thị 11–20, STT bắt đầu 11; 20 → 20 hàng, 2 trang; 50/100 → 36 hàng, 1 trang, Trước/Sau đều vô hiệu; không lỗi console.

**File bị ảnh hưởng:** `src/components/pages/collection/CollectionSetupPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 05/10/2026) — 83

**Màn hình:** Quản lý thu thập → Thiết lập thu thập → tab Thiết lập dịch vụ (`CollectionSetupPage.tsx`) — áp dụng `tailieu/docs/compomennt.md` bản cập nhật 05/10/2026.

**Nội dung thay đổi:**
- Tab: cao 48px, padding 12×16, chữ 14px/600; đang chọn `#155DFC` (blue-600), thường `#64748B`.
- Thẻ thống kê: bo 16px (`rounded-2xl`), viền `#E2E8F0`, bỏ shadow; nhãn 16px/400 `#64748B`, số 16px/600 `#0F172A`.
- Thanh công cụ: ô tìm kiếm cao 35px, padding ngang 12px; nút icon 40×40 (Tìm kiếm nền `#10B981`, Bộ lọc nền trắng viền `#E2E8F0`); nút Thêm mới/Kết xuất cao 40px, Kết xuất dạng outline viền `#CBD5E1` chữ `#334155`; khoảng cách nút 8px. Ô lọc trong panel Bộ lọc cao 35px.
- Bảng: `th` cao 42px, padding 13×12, 13px/700 đen, nền `#F8FAFC`; `td` padding 4×12, chữ đen 400; hàng cao 48px, kẻ dưới `#E0E0E0`; bỏ font mono ở Mã/Phiên bản/Ngày tạo (dùng Inter).
- Chữ dài (Tên dịch vụ, Mã dịch vụ, Hệ thống nguồn): cắt 1 dòng `…`, hover hiện tooltip đầy đủ (chỉ khi bị cắt; Tên dịch vụ kèm mô tả trong tooltip thay vì dòng thứ 2 trong ô).
- Badge: thay `StatusTag` (dùng chung) bằng `Badge` cục bộ theo mục 5.8 — 13px/400, padding 2×8, viền 1px, bo 16px, cao 26px, bảng màu chuẩn; các badge chưa có màu chuẩn dùng màu tạm.
- Cột thao tác (mục 5.3.2): căn giữa, cố định bên phải khi cuộn ngang (có bóng phân tách); thứ tự Xem chi tiết → Mapping chi tiết → `⋯`; nút 32×32 icon `#475569`, tooltip chuẩn thay `title` (sửa nhãn "Quản lý" → "Xem chi tiết", "Maping" → "Mapping"); menu `⋯` nhãn nhóm 12px/500 không uppercase, mục 13px cao 32px, icon `#475569`, mục Xóa chữ + icon `#DC2626`.
- Sửa lỗi STT đánh lại từ 1 ở mỗi trang → đánh số liên tục theo trang.
- Phân trang: ô chọn số bản ghi viền `#E2E8F0`, bo 8px.

**CSS toàn cục (`src/index.css`):** `th` 600/`#64748b` → **700/`#000000`**; `td` và chữ slate/gray trong ô `#020817` → `#000000`; `table.collection-table th` 600/`#64748b` → 700/`#000000` — theo compomennt.md mục 5.3 (áp dụng toàn hệ thống).

**Kiểm tra:** tsc không lỗi ở file; build thành công; chạy app đo computed style: tab 48px 14/600, thẻ bo 16px, ô tìm 35px, nút 40px, `th` 42px 700 đen, mọi hàng 48px, kẻ `#E0E0E0`, badge 26px viền 1px, nút thao tác 32×32, tooltip 12px nền `#475569`/95 z-300, menu 7 mục đúng màu; font Inter toàn trang; không còn lỗi console; tab Quản lý nhật ký vẫn hiển thị bình thường.

**File bị ảnh hưởng:** `src/components/pages/collection/CollectionSetupPage.tsx`, `src/index.css`.

## Cập nhật tài liệu quy chuẩn giao diện (Ngày thực hiện: 05/10/2026) — 82

**Tài liệu:** `tailieu/docs/compomennt.md` mục 5.3.2 Cột thao tác — bổ sung theo tham chiếu UX (NN/g, IBM Carbon, GitHub Primer):
- Nút thao tác (kể cả `⋯`) luôn hiển thị, không ẩn chờ hover.
- Mục disabled trong menu `⋯` phải ghi lý do ngay trong mục (dòng phụ 12px `#64748B`), không dùng tooltip trong menu; kèm class mẫu.

## Cập nhật tài liệu quy chuẩn giao diện (Ngày thực hiện: 05/10/2026) — 81

**Tài liệu:** `tailieu/docs/compomennt.md` — thêm mục **5.3.2. Cột thao tác (Action Column)**. Chỉ sửa tài liệu, chưa sửa code.

**Nội dung:**
- 1–3 thao tác: hiện hết dạng nút icon; ≥ 4 thao tác: tối đa 2 nút icon + nút `⋯` (tổng ≤ 3 nút/hàng).
- Thứ tự nút ngoài: Xem chi tiết → thao tác dùng nhiều nhất; Xóa/không hoàn tác luôn nằm trong menu `⋯`.
- Nút icon 32×32, icon 16px `#475569`, hover `#155DFC`, tooltip bắt buộc.
- Menu `⋯`: rộng 224px, mục 13px cao 32px, chia nhóm theo đối tượng (nhãn 12px/500 `#64748B`, không uppercase), Xóa đặt cuối nhóm màu `#DC2626` + modal xác nhận.
- Thao tác không áp dụng theo trạng thái: nút ngoài giữ vị trí + mờ + tooltip lý do; mục menu hiển thị disabled.
- Bảng áp dụng cụ thể cho màn Thiết lập thu thập (6 thao tác).
- Dòng "Cột hành động" ở bảng mục 5.3 trỏ sang 5.3.2.

## Cập nhật tài liệu quy chuẩn giao diện (Ngày thực hiện: 05/10/2026) — 80

**Tài liệu:** `tailieu/docs/compomennt.md` — cập nhật theo "Bộ quy chuẩn giao diện KDLDC-BTP mới.docx" (lấy trang Thiết lập thu thập của hệ thống Bộ Tư pháp làm chuẩn). **Chỉ sửa tài liệu, chưa sửa code** — chờ PM kiểm tra.

**Quyết định PM:** một màu xanh chính duy nhất `#155DFC` (thay `#2563EB`, `#135DFF`); chữ dài trong bảng cắt `…` + tooltip khi hover.

**Nội dung thay đổi chính:**
- Typography (mục 1): bổ sung logo, menu (12px, đang chọn 500 `#155DFC`), breadcrumb 12px, tab 14/600, thẻ thống kê 16px, `th` 13/700 `#000`, `td` 13/400 `#000`, badge 13/400; quy tắc `font-family: inherit` cho button/input.
- Màu sắc (mục 2): bảng 14 màu theo vai trò; Primary đổi `#2563EB` → `#155DFC`.
- Thêm 4.3 Bo góc (nút/input 8px, menu 10px, thẻ/badge 16px) và 4.4 Khung trang (sidebar 250px, header 64px, thứ tự thanh công cụ).
- 5.1 Nút: bảng 7 loại nút, cao 40px. 5.2 Ô nhập: cao 35px, padding 8×12.
- 5.3 Bảng: `th` cao 42px, padding 13×12, **700 `#000`** (thay quy định 600 `#64748B` trước đó); `td` padding 4×12; hàng 48px, kẻ `#E0E0E0`. Thêm 5.3.1 Cắt chữ dài + Tooltip.
- 5.6/5.6.1 Thẻ thống kê: bo **16px** (thay 8px), số `#0F172A`, bỏ `shadow-sm`.
- 5.8 Badge: khung chung 13/400, padding 2×8, viền 1px, bo 16px, cao 26px + bảng màu từng badge.
- 5.9 Tab: trong nội dung, cao 48px, 14/600. 5.15 Breadcrumb: 12px `#020817`.
- Thêm 5.18 Sidebar/Menu/Header; mục 7 Token CSS, checklist nghiệm thu, danh sách mục chưa xác nhận.
- Thay toàn bộ mã `#2563eb` trong ví dụ bằng `#155dfc`; chuẩn hóa cỡ chữ ví dụ về 13px, bo góc ô nhập về 8px.

**File bị ảnh hưởng:** `tailieu/docs/compomennt.md`. Bản sao lưu trước khi sửa: scratchpad `compomennt.backup.md`.

**Chưa cập nhật:** bảng tóm tắt thiết kế trong `GEMINI.md` (còn ghi Card 8px, Table header 600, Primary `#2563eb`) — chờ PM duyệt compomennt.md.

## Sửa lỗi phát hiện khi chạy thử (Ngày thực hiện: 05/10/2026) — 79

**Phát hiện khi chạy thử màn Thiết lập dịch vụ thu thập (đo computed style trên trình duyệt):**
- Thẻ thống kê `rounded-lg` hiển thị **10px** thay vì 8px do biến `--radius: .625rem`.
- Header bảng hiển thị **700 / #0f172a** thay vì 600 / #64748b do rule riêng `table.collection-table th` (dùng chung cho nhiều bảng) ghi đè.

**Nội dung sửa (`src/index.css`):**
- `--radius: .625rem` → `.5rem` ⇒ `rounded-sm` 4px · `rounded-md` 6px · `rounded-lg` 8px · `rounded-xl` 12px, khớp `compomennt.md`. Áp dụng toàn hệ thống.
- `table.collection-table th`: `font-weight: bold` → `600`, `color: #0f172a` → `#64748b`, đồng bộ với quy định header bảng in đậm màu muted.

**Kết quả đo lại:** body 13px Inter `#020817`; `th` 13px/600/`#64748b`; `td` 13px/400/`#020817`; nhãn & số thẻ thống kê 16px (400/600); bo góc thẻ 8px; `.font-mono` dùng font monospace. Build `vite build` thành công.

## Cập nhật giao diện toàn hệ thống (Ngày thực hiện: 05/10/2026) — 78

**Phạm vi:** Toàn bộ hệ thống (file CSS dùng chung). PM xác nhận theo `compomennt.md`, thay thế yêu cầu cũ "10.5pt, chữ đen, không bôi đậm", và bổ sung quy định: **tất cả header bảng phải in đậm**.

**Nội dung thay đổi:**
- `body`: font-size 14px → 13px, màu `#000000` → `#020817` (foreground).
- `body *`: loại trừ `code`, `pre`, `kbd`, `samp`, `.font-mono` khỏi override font Inter để các chỗ hiển thị mã/URL dùng font monospace.
- Header bảng (`th`): font-weight normal → 600 (in đậm), 14px → 13px, màu `#000000` → `#64748b` (muted); giữ chữ thường.
- Ô bảng (`td`) và text slate/gray trong ô: 14px → 13px, màu `#000000` → `#020817`.
- `compomennt.md` mục 5.3: thêm quy định bắt buộc in đậm header bảng + class Tailwind chuẩn cho `th`/`td`.
- `GEMINI.md`: bảng tóm tắt Table header bỏ `uppercase tracking-tight`, ghi rõ bắt buộc in đậm.

**File bị ảnh hưởng:** `src/index.css`, `tailieu/docs/compomennt.md`, `GEMINI.md`.

## Cập nhật giao diện toàn hệ thống (Ngày thực hiện: 05/10/2026) — 77

**Phạm vi:** Toàn bộ hệ thống (file CSS dùng chung) — PM đã xác nhận thống nhất font chính là **Inter** theo `tailieu/docs/compomennt.md`.

**Nội dung thay đổi:**
- Override typography toàn cục: `body` và `body *` đổi `font-family: Arial, Helvetica, sans-serif !important` → `'Inter', system-ui, sans-serif !important`.
- Biến `--font-sans`: `'Inter', Arial, Helvetica, sans-serif` → `'Inter', system-ui, sans-serif`.
- Giữ nguyên các override cỡ chữ (`body` 14px, `table th/td` 14px) và màu chữ `#000000` — chưa có quyết định thay đổi.

**File bị ảnh hưởng:** `src/index.css`.

## Cập nhật tài liệu & giao diện (Ngày thực hiện: 05/10/2026) — 76

**Tài liệu:**
- `tailieu/docs/compomennt.md`: ví dụ mục 5.6 Card đổi nhãn 14px → 16px, con số 24px → 16px. Thêm mục **5.6.1. Thẻ thống kê (Stat Card)**: bo góc 8px, `shadow-sm`, `p-4`, cỡ chữ thống nhất 16px (nhãn Regular `text-slate-500`, con số Semibold `text-slate-900`), dòng xu hướng 12px, quy định ô icon và màu theo ý nghĩa.
- `GEMINI.md`: bảng tóm tắt Bo góc Card `rounded-xl` (12px) → `rounded-lg` (8px) cho khớp compomennt.md.

**Màn hình:** Quản lý thu thập
- Thiết lập dịch vụ thu thập (`CollectionSetupPage.tsx`): 4 thẻ thống kê đầu trang — nhãn 13px → 16px, thêm `shadow-sm`, màu số `slate-950` → `slate-900`; 3 ô Tổng quan trong modal kết quả kiểm tra — nhãn 13px → 16px, số `text-xl font-medium` → `text-[16px] font-semibold`.
- Xem dữ liệu đã thu thập (`ViewCollectedDataPage.tsx`): `StatsCard` — `rounded-xl p-5` → `rounded-lg p-4`, nhãn 13px medium → 16px regular, số `font-bold` → `font-semibold`, dòng xu hướng 13px → 12px.
- Chi tiết dữ liệu đã thu thập (`ServiceDataDetailPage.tsx`): 4 thẻ thống kê — nhãn `text-xs` → 16px `text-slate-500`, số `text-2xl` → 16px, thêm `shadow-sm`.
- Giữ nguyên màu số theo ý nghĩa (xanh/xanh lá/cam/đỏ) ở các thẻ Bản ghi mới/cập nhật/lỗi.

**File bị ảnh hưởng:** `tailieu/docs/compomennt.md`, `GEMINI.md`, `src/components/pages/collection/CollectionSetupPage.tsx`, `src/components/pages/collection/ViewCollectedDataPage.tsx`, `src/components/pages/collection/ServiceDataDetailPage.tsx`.

## Cập nhật tài liệu & giao diện (Ngày thực hiện: 02/10/2026) — 75

**Tài liệu:** `tailieu/docs/compomennt.md`
- Sửa mâu thuẫn: ví dụ HTML nhãn/ô nhập ở mục 5.2 và 5.16 dùng 14px → đổi về 13px; bo góc input ví dụ 6px → 8px (khớp quy định "Bo góc: 8px").
- Mục 5.2 bổ sung class Tailwind chuẩn cho Label / Input / Select / Textarea / thông báo lỗi.
- Thêm mục **5.17. Trường thông tin chỉ đọc (Label – Value)** cho màn hình Xem chi tiết.

**Màn hình (áp dụng thử):** Quản lý thu thập → Thiết lập dịch vụ thu thập
- Modal Thêm mới / Chỉnh sửa dịch vụ (tab Thông tin chung): nhãn `text-slate-600` → `font-medium text-slate-900`; dấu `*` `text-red-500` → `text-red-600`; input/select `px-3 py-2 border-slate-300` → `h-10 px-3 border-slate-200 bg-white` + `focus:ring-2 focus:ring-blue-500`; textarea giữ `py-2`.
- Modal Xem chi tiết dịch vụ (tab Thông tin chung, Cấu hình kết nối, Cấu hình thu thập): nhãn bỏ `font-semibold uppercase` → `font-medium text-slate-500`; giá trị bỏ `font-medium`/`italic` → `text-slate-900 break-words`; Mô tả/Ghi chú bỏ khung nền và in nghiêng, giá trị trống hiển thị `-`; email giữ màu primary, bỏ gạch chân; lưới `gap-x-12 gap-y-6/8` → `gap-x-6 gap-y-4`.

**File bị ảnh hưởng:** `tailieu/docs/compomennt.md`, `src/components/pages/collection/ServiceModals.tsx`, `src/components/pages/collection/ViewServiceModal.tsx`.

**Chưa áp dụng:** Tab Cấu hình kết nối / Cấu hình thu thập trong form Thêm mới/Chỉnh sửa (thuộc `ConnectionConfigSection.tsx`, `DataCollectionConfigSection.tsx` — đang khóa `[ ]`). Chưa có logic hiển thị lỗi validation trong form.

## Cập nhật giao diện (Ngày thực hiện: 02/10/2026) — 74

**Màn hình:** Quản lý thu thập — Thiết lập dịch vụ thu thập, Xem dữ liệu đã thu thập, Chi tiết dữ liệu đã thu thập, Quản lý nhật ký thu thập, Modals dịch vụ thu thập, Modal xem chi tiết dịch vụ, Sidebar phụ.

**Nội dung thay đổi:** Chuẩn hóa cỡ chữ theo `tailieu/docs/compomennt.md` (132 vị trí, chỉ đổi class cỡ chữ, không đổi layout/logic):
- `text-base` (16px), `text-sm` (14px), `text-[15px]`, `text-[16px]` ở nội dung/label/input/nút/ô bảng → `text-[13px]`.
- Tiêu đề trang / tiêu đề modal (H1) → `text-[16px]` (trước đó: `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-[18px]`).
- Tiêu đề khối/section (H2) → `text-[14px]`.
- Badge, nhãn nhóm menu, nhãn phụ `text-[10px]`/`text-[11px]` → `text-[12px]`.
- Chỉ số thống kê dạng `text-base` trên thẻ tổng quan → `text-[16px]`; giữ nguyên các chỉ số `text-xl`/`text-2xl` và dấu ✓ `text-[11px]` trong checkbox tự vẽ.

**File bị ảnh hưởng:** `src/components/pages/collection/CollectionSetupPage.tsx`, `src/components/pages/collection/ViewCollectedDataPage.tsx`, `src/components/pages/collection/ServiceDataDetailPage.tsx`, `src/components/pages/collection/LogManagement.tsx`, `src/components/pages/collection/ServiceModals.tsx`, `src/components/pages/collection/ViewServiceModal.tsx`, `src/components/pages/collection/InnerSidebar.tsx`.

**Lưu ý:** Override toàn cục trong `src/index.css` (`body` 14px, `table th/td` 14px `!important`) vẫn còn — cỡ chữ ô bảng hiển thị thực tế vẫn là 14px cho đến khi PM quyết định xử lý file này.

## Cập nhật giao diện (Ngày thực hiện: 24/09/2026) — 73

**Màn hình:** Danh mục dùng chung → Tổng quan danh mục dùng chung (`CategoryDashboardPage.tsx`) — file đang khóa `[ ]` trong stauts.md, PM đã xác nhận cho phép sửa riêng nội dung này.

**Nội dung thay đổi:**
- Đổi biểu đồ ranked-list "Số lượng đơn vị khai thác theo danh mục" thành **"Lượt truy cập API theo danh mục"** — legend đổi thành "Lượt truy cập" (chấm tròn xanh), đơn vị hiển thị đổi từ "đơn vị" sang "lượt", màu số liệu giữ xám (`text-slate-500`).
- Đổi tên biến cho khớp ngữ nghĩa mới: `categoryUnitsInUseCounts` → `categoryApiAccessCounts`, field `unitsInUse` → `accessCount`, `maxUnitsInUse` → `maxAccessCount`. Giữ nguyên toàn bộ dữ liệu mock (số liệu không đổi).

**File bị ảnh hưởng:** `src/components/pages/category/CategoryDashboardPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 24/09/2026) — 72

**Màn hình:** Dữ liệu chủ → Tổng quan dữ liệu chủ (`MasterDataDashboardPage.tsx`).

**Nội dung thay đổi:**
- Đổi biểu đồ ranked-list "Số lượng đơn vị khai thác theo mô hình dữ liệu chủ" thành **"Lượt truy cập API theo mô hình dữ liệu chủ"** theo mẫu yêu cầu — legend đổi thành "Lượt truy cập" (chấm tròn xanh), đơn vị hiển thị đổi từ "đơn vị" sang "lượt".
- Đổi tên biến cho khớp ngữ nghĩa mới: `masterDataUnitsInUseCounts` → `masterDataApiAccessCounts`, `masterDataUnitsRanked` → `masterDataApiAccessRanked`, field `unitsInUse` → `accessCount`. Giữ nguyên toàn bộ dữ liệu mock (số liệu không đổi).

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataDashboardPage.tsx`.


## Cập nhật giao diện (Ngày thực hiện: 05/10/2026) — 76

**Màn hình:** Cung cấp dữ liệu → Thiết lập điều phối dữ liệu → Thiết lập dịch vụ (`DataProvisionServiceSetupPage.tsx`).

**Nội dung thay đổi:**
- Header bảng danh sách API in đậm: gắn class `collection-table` để dùng quy tắc ghi đè có sẵn trong `index.css` (quy tắc chung `table th` đang ép `font-weight: normal !important`).

**File bị ảnh hưởng:** `src/components/pages/provisioning/DataProvisionServiceSetupPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 05/10/2026) — 75

**Màn hình:** Dữ liệu chủ → Mô hình dữ liệu chủ (`MasterDataScaleManagementPage.tsx`), tab "Thiết lập".

**Nội dung thay đổi:**
- Gộp cột "Mã dữ liệu chủ" và "Tên dữ liệu chủ" thành một cột **"Tên / Mã dữ liệu chủ"** (dòng trên: tên in đậm, dòng dưới: mã). Mỗi phần tối đa 2 dòng, vượt quá hiển thị "..." và rê chuột hiện tooltip (dùng `common/ClampedText`).
- Bổ sung cột **"Người tạo / Ngày tạo"** trước cột "Cập nhật lần cuối" (thứ tự: Người tạo / Ngày tạo → Cập nhật lần cuối → Trạng thái), lấy từ `entity.createdBy` và `entity.createdDate`.
- Tối ưu độ rộng cột: cột nhãn dùng `w-px`, cột "Tên / Mã dữ liệu chủ" tối thiểu 220px, "Loại dữ liệu" tối thiểu 120px (cho phép xuống dòng); padding ô `px-6` → `px-4`.
- Header bảng in đậm: gắn class `collection-table` để dùng quy tắc ghi đè có sẵn trong `index.css`.
- Tab "Thiết lập" bỏ padding ngang trùng lặp ở vùng nội dung (`p-6` → `py-6`, chỉ áp dụng cho tab này) vì `MainLayout` đã có sẵn `p-6`.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataScaleManagementPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 05/10/2026) — 74

**Màn hình:** Dữ liệu mở → Thiết lập danh mục dữ liệu mở (`OpenDataSetupPage.tsx`), tab "Quản lý danh mục".

**Nội dung thay đổi:**
- Bổ sung cột **"Người tạo / Ngày tạo"** trước cột "Trạng thái" (dòng trên: `createdBy`, dòng dưới: `createdDate`).
- Bỏ cột **"Phiên bản"** khỏi bảng danh sách danh mục.
- Tối ưu độ rộng cột: các cột nhãn dùng `w-px` để co sát nội dung, phần còn lại dồn cho cột "Tên danh mục" (tối thiểu 220px); padding ô header `px-6` → `px-4`.
- Header bảng in đậm: gắn class `collection-table` để dùng quy tắc ghi đè có sẵn trong `index.css` (áp dụng cho bảng chung của cả 4 tab).
- Bỏ padding ngang trùng lặp ở vùng nội dung tab (`p-6` → `py-6`) vì `MainLayout` đã có sẵn `p-6`.

**File bị ảnh hưởng:** `src/components/pages/open-data/OpenDataSetupPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 05/10/2026) — 73

**Màn hình:** Danh mục dùng chung → Thiết lập danh mục, tab "Thiết lập danh mục" (`SetupTab.tsx`, hiển thị trong `CategorySetupPage.tsx`).

**Nội dung thay đổi:**
- Gộp cột "Mã danh mục" và "Tên danh mục" thành một cột **"Tên / Mã danh mục"** (dòng trên: tên in đậm, dòng dưới: mã). Mỗi phần tối đa 2 dòng, vượt quá hiển thị "..." và rê chuột hiện tooltip nội dung đầy đủ.
- Bổ sung cột **"Người tạo / Ngày tạo"** trước cột "Trạng thái", lấy từ `entity.createdBy` và `entity.createdDate`.
- Tối ưu độ rộng cột tương tự màn Thiết lập dịch vụ: các cột nhãn dùng `w-px` để co sát nội dung, phần còn lại dồn cho cột "Tên / Mã danh mục" (tối thiểu 220px); padding ô `px-6` → `px-4`.
- Header bảng in đậm: gắn class `collection-table` cho bảng để dùng quy tắc ghi đè có sẵn trong `index.css` (quy tắc chung `table th` đang ép `font-weight: normal !important`).
- Tab "Thiết lập danh mục" bỏ padding ngang trùng lặp ở vùng nội dung (`p-6` → `py-6`, chỉ áp dụng cho tab này) vì `MainLayout` đã có sẵn `p-6`.
- Dữ liệu mẫu `defaultEntities` (`categoryConstants.ts`, chỉ dùng tại màn này): đổi `createdBy` từ "Hệ thống" sang tên người tạo cụ thể.
- Tách component `ClampedText` (văn bản tối đa 2 dòng + tooltip khi bị cắt) ra file dùng chung `src/components/common/ClampedText.tsx`; màn Thiết lập dịch vụ (`CollectionSetupPage.tsx`) chuyển sang dùng component này.

**File bị ảnh hưởng:** `src/components/pages/category/components/tabs/SetupTab.tsx`, `src/components/pages/category/CategorySetupPage.tsx`, `src/components/pages/category/categoryConstants.ts`, `src/components/common/ClampedText.tsx` (mới), `src/components/pages/collection/CollectionSetupPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 05/10/2026) — 72

**Màn hình:** Quản lý thu thập → Thiết lập thu thập → Thiết lập dịch vụ (`CollectionSetupPage.tsx`).

**Nội dung thay đổi:**
- Bảng danh sách dịch vụ: gộp thông tin người tạo và ngày tạo vào một cột **"Người tạo / Ngày tạo"** (dòng trên: tên người tạo, dòng dưới: ngày giờ tạo). Lấy từ `service.createdBy`, nếu dữ liệu mẫu chưa có thì dùng danh sách người tạo mặc định theo `id` dịch vụ.
- Cột "Thao tác" → menu "...", nhóm "Dữ liệu": bổ sung mục **"Xóa cấu trúc"** (ngay sau "Xóa dữ liệu thu thập"), bấm vào hiển thị modal xác nhận cảnh báo xóa cấu hình mapping của dịch vụ.
- Gộp cột "Tên dịch vụ" và "Mã dịch vụ" thành một cột **"Tên / Mã dịch vụ"** (dòng trên: tên dịch vụ in đậm, dòng dưới: mã dịch vụ). Tên và mã mỗi phần tối đa 2 dòng, vượt quá hiển thị "..." và rê chuột hiện tooltip nội dung đầy đủ (component `ClampedText` dùng `ui/tooltip`, chỉ mở tooltip khi văn bản thực sự bị cắt). Tên dùng màu `text-[#0f172a]` thay cho `text-slate-900` vì quy tắc chung trong `index.css` ép `font-weight: normal` cho `text-slate-*` trong ô bảng.
- Header bảng: cho phép xuống dòng (bỏ `whitespace-nowrap` ở các cột từ "Loại nguồn" đến "Trạng thái dữ liệu") để tối ưu không gian; các cột nhãn (STT, Loại nguồn, Phương thức kết nối, Phiên bản, Người tạo / Ngày tạo, Trạng thái dịch vụ, Trạng thái dữ liệu, Thao tác) dùng `w-px` để co sát nội dung, phần rộng còn lại dồn cho cột "Tên / Mã dịch vụ" (tối thiểu 190px); "Hệ thống nguồn" tối thiểu 100px; giảm padding ô bảng `px-4` → `px-3` (STT, Thao tác: `px-2`); tên người tạo không xuống dòng, ngày giờ tạo được xuống dòng khi hẹp. Bảng không tràn ngang từ khổ 1536px (sidebar mở rộng).
- Bỏ padding ngang trùng lặp ở vùng nội dung tab (`p-6` → `py-6`) vì `MainLayout` đã có sẵn `p-6`, giúp nội dung không bị thụt vào hai bên.

**File bị ảnh hưởng:** `src/components/pages/collection/CollectionSetupPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 25/08/2026) — 71

**Màn hình:** Danh mục dùng chung — Biên tập & Công khai (`CategoryPage.tsx`, `CategoryAListPage.tsx`), Thiết lập danh mục (`CategoryWizardModal.tsx`, `CategoryInfoViewModal.tsx`), Thống kê danh mục → Báo cáo thống kê danh sách danh mục (`CategoryReportListPage.tsx`), sidebar dùng chung (`InnerSidebar.tsx`).

**Nội dung thay đổi:**
- Modal "Công khai danh mục": đồng bộ cỡ chữ 3 dòng "Trạng thái phê duyệt/Phiên bản hiện hành/Quyền chia sẻ" về 13px.
- Tab "Công khai": bỏ 3 thẻ tóm tắt "Trạng thái phê duyệt/Phiên bản hiện hành/Quyền chia sẻ". Modal "Hủy công khai danh mục" bổ sung cảnh báo "Danh mục đang được khai thác bởi (n) API".
- Thiết lập danh mục dùng chung: bổ sung trường **"Loại danh mục"** (dropdown: Danh mục dùng chung từ TTDLQG / Danh mục nghiệp vụ / Danh mục tổng hợp theo quyết định) ở bước Thông tin chung, áp dụng cho cả tạo mới/chỉnh sửa/xem chi tiết. Thêm type `CategoryType` + `categoryTypeLabels` dùng chung.
- Báo cáo thống kê danh sách danh mục: bổ sung bộ lọc multi-select "Loại danh mục" cạnh bộ lọc "Đơn vị quản lý".
- Sidebar "Biên tập danh mục": đổi bộ lọc trạng thái công khai từ nút pill sang dropdown/select (nhãn "Trạng thái công khai"), nâng cấp trạng thái công khai từ boolean sang tri-state `CategoryPublishStatus` để hỗ trợ thêm lựa chọn "Ngừng công khai". Bỏ header nhóm "Dữ liệu nghiệp vụ (N)", chỉ hiển thị thẳng danh sách thẻ danh mục.

**File bị ảnh hưởng:** `src/components/pages/category/CategoryPage.tsx`, `src/components/pages/category/CategoryAListPage.tsx`, `src/components/pages/category/categoryTypes.ts`, `src/components/pages/category/categoryConstants.ts`, `src/components/pages/category/components/modals/CategoryWizardModal.tsx`, `src/components/pages/category/components/modals/CategoryInfoViewModal.tsx`, `src/components/pages/category/reports/CategoryReportListPage.tsx`, `src/components/pages/collection/InnerSidebar.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 20/08/2026) — 70

**Màn hình:** Dữ liệu chủ → Cập nhật dữ liệu chủ → Phê duyệt (Modal "Chi tiết bản ghi", tab "Thông tin liên quan", `MasterDataUpdateItemPage.tsx`).

**Nội dung thay đổi:**
- Bổ sung cấu hình quan hệ thực thể `CATEGORY_RELATIONSHIPS` (3 quan hệ liên kết chéo giữa Thông tin hộ tịch cá nhân, Quyết định thi hành án và Văn bản quy phạm pháp luật theo khóa định danh `soDinhDanh` CCCD và `maVanBanCanCu`).
- Bổ sung dữ liệu mock khóa ngoại (`soDinhDanh`, `maVanBanCanCu`) vào mảng `MOCK_CIVIL_STATUS` và `MOCK_ENFORCEMENT_DECISION` để tự động tạo liên kết chéo giữa các thực thể dữ liệu chủ.
- Cập nhật hàm `normalizeIdentifier` hỗ trợ chuẩn hóa cả mã văn bản alphanumeric (`VB-2026-...`), giúp hiển thị đầy đủ danh sách và chi tiết các bản ghi liên kết chéo tại tab "Thông tin liên quan" trong modal Chi tiết bản ghi.
- Đổi tên cột "Trạng thái" thành **"Trạng thái phê duyệt"** ở header các bảng liên kết chéo thực thể tại tab "Thông tin liên quan" và trong modal xem chi tiết bản ghi liên kết.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataUpdateItemPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 69

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`), tab "Báo cáo sử dụng dữ liệu chủ" → chế độ "Tiêu thụ".

**Nội dung thay đổi:**
- Bảng + biểu đồ "Tiêu thụ" đổi nguồn dữ liệu từ `appliedUsageReports` (4 loại dữ liệu cũ: Công chứng/Đăng ký kinh doanh/Trợ giúp pháp lý/Hộ tịch) sang đúng **3 thực thể dữ liệu chủ chính thức** đang có trong Cập nhật dữ liệu chủ (`CATEGORY_LABELS`/`DataCategory`) — cột "Loại dữ liệu chủ" đổi thành "Thực thể dữ liệu chủ".
- Mock mới `mockCategoryConsumption` (key theo `DataCategory`, gồm `totalUsage` + `growthRate`) thay cho `mockConsumptionGrowthRate` cũ (key theo dataType).
- Đổi layout từ `flex` tỷ lệ 2/5-3/5 sang **grid 2 cột đều nhau** (`grid grid-cols-1 lg:grid-cols-2 gap-4`) — bảng và biểu đồ tăng trưởng mỗi bên chiếm 1 cột, cùng hàng.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 68

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`), tab "Báo cáo sử dụng dữ liệu chủ" → chế độ "Tiêu thụ".

**Nội dung thay đổi:**
- Bỏ cột "Tổng lượt tiêu thụ" khỏi bảng Tiêu thụ (chỉ giữ STT, Loại dữ liệu chủ, Dung lượng tiêu thụ ước tính) — thu nhỏ bảng còn `w-2/5` (thay vì full width), đặt cùng 1 hàng (`flex flex-col lg:flex-row gap-4`) với biểu đồ mới.
- Thêm biểu đồ cột **"Tỷ lệ tăng trưởng tiêu thụ so với kỳ trước (%)"** cạnh bảng (chiếm phần còn lại `flex-1`) — dùng `BarChart`/`Bar`/`Cell` mới import từ `recharts`, tô màu xanh lá nếu tăng trưởng dương, đỏ nếu âm. Mock mới `mockConsumptionGrowthRate` (theo từng loại dữ liệu chủ).

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 67

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`), tab "Báo cáo sử dụng dữ liệu chủ".

**Nội dung thay đổi:**
- Bảng **"Tiêu thụ"**: bỏ 3 cột "Tổng lượt truy cập", "Tỷ lệ tiêu thụ/truy cập", "Thời gian phản hồi TB" — chỉ còn STT, Loại dữ liệu chủ, Tổng lượt tiêu thụ. Thêm cột mới **"Dung lượng tiêu thụ ước tính"** (MB), suy ra từ `totalUsage × AVG_RECORD_SIZE_KB (giả định 2KB/bản ghi) / 1024`, có dòng tổng cộng.
- Bảng **"Truy cập"**: thêm cột **"Truy cập gần nhất"**, lấy từ field `lastAccess` mới bổ sung vào `mockCategoryApiStats` (theo từng thực thể dữ liệu chủ chính thức).
- `colSpan` của các dòng rỗng/tổng cộng ở cả 2 bảng cập nhật lại cho khớp số cột mới.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 66

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`), tab "Báo cáo sử dụng dữ liệu chủ" → chế độ "Truy cập".

**Nội dung thay đổi:** Tách header "Báo cáo truy cập dữ liệu thực thể chủ" ra khỏi khung trắng của bảng — trước đó header nằm trong cùng component `bg-white border rounded-2xl` với bảng, giờ là 1 dòng `<p>` độc lập nằm ngoài, phía trên khung trắng chứa bảng.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 65

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`), tab "Báo cáo sử dụng dữ liệu chủ" → chế độ "Truy cập".

**Nội dung thay đổi:**
- Đổi thiết kế bảng "Truy cập" từ bảng "Hệ thống/Cổng dịch vụ kết nối" (Tên hệ thống/Tổng lượt truy xuất/Trạng thái kết nối/Truy cập gần nhất) sang đúng thiết kế bảng thống kê danh mục tại `CategoryTrendAndStatsSection.tsx` (Báo cáo khai thác danh mục): cột STT, [Danh mục], Số API đang chia sẻ, Lượt gọi API, Tỷ lệ API ổn định — dùng chung class `exploitation-report-table`, có dòng "Tổng cộng".
- Đổi tên cột "Danh mục" thành **"Thực thể dữ liệu chủ"** và đổi nguồn dữ liệu: thay vì lấy theo `appliedUsageReports` (4 loại dữ liệu cũ: Công chứng/Đăng ký kinh doanh/Trợ giúp pháp lý/Hộ tịch — không còn khớp hệ thống), giờ lấy đúng theo **3 danh mục dữ liệu chủ chính thức đang có trong Cập nhật dữ liệu chủ** (`CATEGORY_LABELS`/`DataCategory` export từ `MasterDataUpdateItemPage.tsx`). Mock `mockCategoryApiStats` đổi key từ string dataType sang `DataCategory`.
- Thêm header "**Báo cáo truy cập dữ liệu thực thể chủ**" (18px, bold — `text-[18px] font-bold text-slate-700`) phía trên bảng, dưới Control Panel.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 64

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`), tab "Báo cáo sử dụng dữ liệu chủ".

**Nội dung thay đổi:** Thêm dropdown **"Loại báo cáo"** (Truy cập / Tiêu thụ / Thống kê) vào Control Panel — theo đúng hướng triển khai đơn giản đã thống nhất: tái sử dụng dữ liệu/thành phần đã có, không tạo mock mới.
- State mới `usageReportType: 'access' | 'consumption' | 'stats'` (mặc định `'access'`).
- **Thống kê**: giữ nguyên `AreaChart` xu hướng hiện tại.
- **Truy cập**: giữ nguyên bảng "Hệ thống/Cổng dịch vụ kết nối" hiện tại (`mockConnectedSystems`).
- **Tiêu thụ**: bảng mới, tái sử dụng đúng field có sẵn nhưng chưa từng hiển thị trong `mockUsageReports` (`totalAccess`, `totalUsage`, `avgResponseTime`) — cột: Loại dữ liệu chủ, Tổng lượt truy cập, Tổng lượt tiêu thụ, Tỷ lệ tiêu thụ/truy cập (tính `totalUsage/totalAccess`), Thời gian phản hồi TB.
- Cả 3 khối đều gate theo `hasSearchedUsage && usageReportType === '...'`, chỉ 1 khối hiển thị tại 1 thời điểm.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 63

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`), tab "Báo cáo vòng đời dữ liệu".

**Nội dung thay đổi:** Đổi tên thẻ đếm đầu tiên từ "Hoạt động bình thường" thành **"Còn hiệu lực"** (khớp đúng với `LIFECYCLE_STAGE_LABEL.active`) — 3 thẻ đếm giờ đồng bộ tên gọi: Còn hiệu lực / Sắp hết hiệu lực / Đã hết hiệu lực.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 62

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`), tab "Báo cáo vòng đời dữ liệu".

**Nội dung thay đổi:**
- Bảng "Chi tiết vòng đời dữ liệu" giới hạn tối đa **7 trường** hiển thị: 4 trường định danh đầu tiên của thực thể (theo `COLUMNS[category]`, bỏ `hieuLuc` ra khỏi danh sách lấy 4 vì đã hiển thị riêng) + Hiệu lực + Số ngày còn lại + Vòng đời (`visibleCols = cols.filter(c => c.key !== 'hieuLuc').slice(0, 4)`).
- Bỏ cột "Trạng thái" (phê duyệt) khỏi bảng chính, chuyển vào modal chi tiết.
- Thêm cột **"Thao tác"** với nút Xem chi tiết (icon `Eye`) → mở modal `lifecycleDetailRow`, tham khảo đúng thiết kế modal "Chi tiết bản ghi" tại Cập nhật dữ liệu chủ (`MasterDataUpdateItemPage.tsx`): badge Trạng thái + Vòng đời ở đầu, danh sách toàn bộ trường (`COLUMNS[category]` đầy đủ) + Số ngày còn lại trong khung viền, nút Đóng ở footer.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 61

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`), tab "Báo cáo vòng đời dữ liệu".

**Nội dung thay đổi:**
- Bỏ cột "Ngày hết hạn" khỏi bảng "Chi tiết vòng đời dữ liệu" (giữ lại "Số ngày còn lại"); `colSpan` dòng "Không có bản ghi" giảm từ `cols.length + 5` xuống `cols.length + 4`.
- Đổi màu chữ cột "Số ngày còn lại" ở trạng thái "Sắp hết hiệu lực" từ cam sang **vàng** (`text-yellow-600`) trong `LIFECYCLE_STAGE_TEXT_COLOR`.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 60

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`), tab "Báo cáo vòng đời dữ liệu".

**Nội dung thay đổi:**
- Bỏ multi-select "Tất cả thực thể" — đổi thành `<select>` chỉ chọn **1** thực thể trong 3 loại chính thức (Thông tin hộ tịch của cá nhân / Quyết định thi hành án / Văn bản quy phạm pháp luật), lấy từ `CATEGORY_LABELS` export mới của `MasterDataUpdateItemPage.tsx`.
- Bảng grid dưới hiển thị đúng **bản ghi thật** của thực thể đã chọn, lấy từ `MOCK_BY_CATEGORY` (Cập nhật dữ liệu chủ) — không còn dùng mock riêng `mockLifecycleData`/`LifecycleData` (đã xóa, dữ liệu không khớp thực thể thật). Cột bảng render động theo `COLUMNS[category]` của từng thực thể (export mới), thay vì bộ cột cứng cũ (Mã dữ liệu/Tên dữ liệu chủ/Loại dữ liệu...).
- `MasterDataUpdateItemPage.tsx`: export thêm `DataCategory`, `ColDef`, `Row`, `COLUMNS`, `MOCK_BY_CATEGORY`, `CATEGORY_LABELS` để tái sử dụng ở trang báo cáo.
- Cập nhật logic ngưỡng: `getLifecycleStage` đổi từ `daysRemaining < 30` thành `daysRemaining <= 30` cho "Sắp hết hiệu lực" (đúng yêu cầu "số ngày còn lại =< 30 thì chuyển sang sắp hết hiệu lực").
- Quy định lại màu "Số ngày còn lại" dùng chung 1 nguồn với badge "Vòng đời" qua `LIFECYCLE_STAGE_TEXT_COLOR`/`LIFECYCLE_STAGE_BADGE_CLASS` (active: xanh lá, warning: cam, expired: đỏ) — tránh lệch ngưỡng giữa cột màu chữ và badge.
- Vì 3 loại thực thể chính thức không có sẵn trường "ngày hết hạn/số ngày còn lại" theo đúng bảng quy định, duy trì mapping riêng `LIFECYCLE_EXPIRY_BY_CATEGORY` (theo id bản ghi thật của từng thực thể, tính theo mốc 13/08/2026) chỉ phục vụ báo cáo vòng đời.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`, `src/components/pages/master-data/MasterDataUpdateItemPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 59

**Màn hình:** Dữ liệu chủ → Cập nhật dữ liệu chủ (`master-data/MasterDataUpdateItemPage.tsx`), tab "Dữ liệu".

**Nội dung thay đổi:** Bảng danh sách chính (tab "Dữ liệu") trước đó chỉ hiển thị 3 cột đầu (`cols.slice(0, 3)`) nên cột "Hiệu lực" mới thêm ở cuối `COLUMNS` (entry #58) chưa lên bảng. Bổ sung thêm 1 cột "Hiệu lực" riêng vào bảng danh sách (giữa 3 cột đầu và cột "Trạng thái dữ liệu"), cập nhật `colSpan` của dòng "Không tìm thấy dữ liệu phù hợp" từ 9 lên 10 cho khớp số cột mới.

Các chỗ còn lại đã tự động có "Hiệu lực" từ entry #58 do dùng chung `cols` đầy đủ, không cần sửa thêm:
- Modal "Chi tiết bản ghi" (mở từ tab Dữ liệu lẫn tab Phê duyệt — dùng chung 1 modal `detailRow`).
- Form "Rà soát bản ghi dữ liệu chủ" (chỉnh sửa).
- Modal chi tiết/so sánh phiên bản.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataUpdateItemPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 58

**Màn hình:** Dữ liệu chủ → Cập nhật dữ liệu chủ (`master-data/MasterDataUpdateItemPage.tsx`).

**Nội dung thay đổi:** Thêm trường mặc định **"Hiệu lực"** (định dạng ngày/tháng/năm) vào cả 3 loại thực thể dữ liệu chủ — Thông tin hộ tịch của cá nhân, Quyết định thi hành án, Văn bản quy phạm pháp luật. Thêm cột `hieuLuc` vào cuối `COLUMNS` của mỗi loại + mock data tương ứng cho toàn bộ bản ghi. Vì bảng dữ liệu/modal chi tiết/form chỉnh sửa đều render cột theo `cols` chung, trường mới tự động xuất hiện ở bảng danh sách, modal xem chi tiết, form chỉnh sửa mà không cần sửa thêm logic UI.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataUpdateItemPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 57

**Màn hình:** Dữ liệu chủ → Cập nhật dữ liệu chủ (inner menu danh mục dữ liệu, `master-data/MasterDataUpdatePage.tsx`).

**Nội dung thay đổi:** Bỏ phần phân nhóm "Dữ liệu nghiệp vụ" bọc ngoài danh sách 3 danh mục dữ liệu chủ (trước đó `InnerSidebar` mặc định gom mọi item không có `dataType` vào khối thu gọn/mở rộng "Dữ liệu nghiệp vụ (N)"), giờ hiển thị thẳng danh sách danh mục, luôn hiện mặc định, không cần bấm mở rộng:
- Thêm prop mới `flatList?: boolean` vào `InnerSidebar.tsx` (mặc định `false`, không ảnh hưởng các trang khác đang dùng chung component này) — khi bật, bỏ qua toàn bộ logic phân 2 nhóm "Dữ liệu nghiệp vụ"/"Dữ liệu danh mục", render thẳng danh sách item.
- `MasterDataUpdatePage.tsx` truyền `flatList` khi dùng `InnerSidebar`.

**File này (`InnerSidebar.tsx`) được PM mở khóa `[x]` trong `stauts.md` riêng cho yêu cầu này (file dùng chung nhiều trang, thay đổi chỉ thêm 1 prop tùy chọn, không sửa logic mặc định của các trang khác).**

**File bị ảnh hưởng:** `src/components/pages/collection/InnerSidebar.tsx`, `src/components/pages/master-data/MasterDataUpdatePage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 56

**Màn hình:** Dữ liệu chủ → Cập nhật dữ liệu chủ (`master-data/MasterDataUpdatePage.tsx`, `master-data/MasterDataUpdateItemPage.tsx`).

**Nội dung thay đổi:** Thay thế toàn bộ mock data theo đúng 3 loại thực thể dữ liệu chủ theo quy định của Bộ Tư pháp (theo bảng "Dữ liệu chủ" PM cung cấp), bỏ hệ thống 7 danh mục/38 mục cũ (THADS, hộ tịch, quốc tịch, cá nhân/tổ chức bổ trợ tư pháp, TGPL, tài sản bảo đảm):
- `MasterDataUpdatePage.tsx`: `MASTER_DATA_ITEMS` rút còn đúng 3 mục — "Thông tin hộ tịch của cá nhân" (Cục Hành chính tư pháp), "Quyết định thi hành án (chủ động, theo yêu cầu)" (Cục Quản lý thi hành án dân sự), "Văn bản quy phạm pháp luật" (Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính).
- `MasterDataUpdateItemPage.tsx`: đổi `DataCategory` từ 7 giá trị cũ thành 3 giá trị mới (`civil-status`, `enforcement-decision`, `legal-document`); viết lại `ITEM_CONFIGS`, `COLUMNS` (đúng các trường "Thông tin cơ bản mô tả đối tượng" + "Mã quản lý đối tượng" trong bảng quy định), `MOCK_BY_CATEGORY` (mock 7 bản ghi/loại, vẫn giữ nguyên field `approvalStatus`/`publicStatus` và mọi logic phê duyệt, công khai, đồng bộ, rà soát trùng lặp/thiếu dữ liệu, lịch sử phiên bản như thiết kế cũ).
- Bỏ `CIVIL_REGISTRY_PREFIXES` (không còn cần thiết do "hộ tịch" gộp thành 1 mục duy nhất thay vì 9 mục con); đơn giản hóa `getMockData`.
- `CATEGORY_RELATIONSHIPS` (liên kết chéo thực thể) để mảng rỗng — 3 loại thực thể mới theo đúng bảng quy định không có trường định danh dùng chung để khai báo quan hệ; cơ chế `categoryHasCrossEntityConfig`/tab "Thông tin liên quan" vẫn giữ nguyên trong code, chỉ đang không có quan hệ nào active.
- `DUPLICATE_KEY_FIELD` cập nhật theo field phù hợp từng loại mới (`hoTen` / `ma` / `tenVanBan`).

**File này (`MasterDataUpdateItemPage.tsx`) được PM mở khóa `[x]` trong `stauts.md` riêng cho yêu cầu này (trước đó chưa có dòng riêng, coi như đang khóa mặc định).**

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataUpdatePage.tsx`, `src/components/pages/master-data/MasterDataUpdateItemPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 55

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`), tab "Báo cáo vòng đời dữ liệu".

**Nội dung thay đổi:**
- Bỏ bộ lọc "Trạng thái vòng đời" — sau khi chọn thực thể dữ liệu chủ và bấm "Truy xuất báo cáo", hiển thị toàn bộ bản ghi của (các) thực thể đã chọn (không lọc theo trạng thái vòng đời nữa).
- Đổi field `LifecycleData.status` ('active'/'warning'/'expired') thành `approvalStatus: ApprovalStatus` (tham khảo đúng kiểu dữ liệu `ApprovalStatus`/`ApprovalBadge` đang dùng tại "Cập nhật dữ liệu chủ" — `MasterDataUpdateItemPage.tsx`) để cột "Trạng thái" hiển thị đúng ngữ nghĩa phê duyệt (Đã phê duyệt/Chờ phê duyệt/Rà soát/Từ chối/Đã xóa).
- Thêm cột mới **"Vòng đời"** vào bảng "Chi tiết vòng đời dữ liệu", tách biệt với cột "Trạng thái": suy ra từ `daysRemaining` qua hàm `getLifecycleStage` (>=30 ngày: "Còn hiệu lực"; 0-29 ngày: "Sắp hết hiệu lực"; <0: "Đã hết hiệu lực").
- 3 thẻ đếm + cảnh báo phía trên bảng cũng tính lại theo `getLifecycleStage(daysRemaining)` thay vì field `status` cũ.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 54

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`), tab "Báo cáo vòng đời dữ liệu".

**Nội dung thay đổi:**
- Đổi bộ lọc "Danh mục dữ liệu" (single-select) thành multi-select "Chọn thực thể dữ liệu chủ" — copy nguyên mẫu dropdown multi-select (kèm "Tất cả thực thể", checkbox từng mục, nút xóa nhanh) từ tab "Báo cáo sử dụng dữ liệu chủ". Thêm state `lifecycleDataTypes` (string[]), `showLifecycleDataTypeDropdown`, ref `lifecycleDataTypeRef`, hàm `toggleLifecycleDataType`/`toggleAllLifecycleDataTypes`/`lifecycleDataTypeDisplayText`, backdrop đóng dropdown khi click ra ngoài.
- `handleSearchLifecycle` đổi điều kiện lọc theo mảng `lifecycleDataTypes` (thay vì lọc theo 1 giá trị).
- Điều chỉnh layout Control Panel: 2 bộ lọc (multi-select thực thể + trạng thái vòng đời) dùng `flex-1` để giãn đều theo chiều ngang container, nút "Truy xuất báo cáo"/"Xuất File" giữ `shrink-0` — đồng bộ với thiết kế Control Panel ở tab Báo cáo sử dụng dữ liệu chủ.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 53

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`), tab "Báo cáo vòng đời dữ liệu".

**Nội dung thay đổi:** Đổi luồng thao tác theo đúng UC — bắt buộc chọn "Danh mục dữ liệu" + "Trạng thái vòng đời" và bấm "Truy xuất báo cáo" trước khi hiển thị thẻ đếm/cảnh báo/bảng grid, thiết kế đồng bộ với tab "Báo cáo sử dụng dữ liệu chủ":
- Bộ lọc chuyển sang dạng Control Panel giống tab Báo cáo sử dụng (label phía trên, select có `value`/`onChange` — trước đó 2 select không controlled, không lọc được).
- Thêm state `lifecycleDataType`, `lifecycleStatusFilter`, `hasSearchedLifecycle`, `appliedLifecycleData`, `showLifecycleExportMenu` + handler `handleSearchLifecycle` (lọc `mockLifecycleData` theo danh mục/trạng thái), `handleExportLifecycleFile`.
- Trước khi truy xuất: hiển thị empty state (icon `BarChart2` mờ + hướng dẫn), ẩn cảnh báo/thẻ đếm/bảng.
- Sau khi truy xuất: cảnh báo + 3 thẻ đếm (Hoạt động bình thường/Sắp hết hiệu lực/Đã hết hiệu lực) tính động theo `appliedLifecycleData` (trước đó là số cứng 1/2/1); bảng hiển thị `appliedLifecycleData`, có dòng "Không có bản ghi phù hợp" khi rỗng.
- Nút xuất file: gộp 2 nút "Xuất Excel"/"Xuất PDF" (đặt trong header bảng) thành 1 nút "Xuất File" dạng dropdown (Excel/PDF/CSV) đặt trong Control Panel, giống hệt tab Báo cáo sử dụng.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 52

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`), tab "Tra cứu dữ liệu chủ".

**Nội dung thay đổi:**
1. Thêm cột "Cơ quan quản lý" vào bảng "Kết quả tìm kiếm" (field `agency` bổ sung vào mock `mockSearchResults`).
2. Nút "Xem chi tiết bản ghi" (icon `Eye`) đổi sang mở modal "Xem chi tiết thực thể dữ liệu chủ" — copy nguyên mẫu thanh stepper 7 bước + layout form + footer (Chỉnh sửa/Quay lại/Đóng/Tiếp theo) từ modal cùng tên tại `MasterDataScaleManagementPage.tsx` (module Mô hình dữ liệu chủ). Bước 1 hiển thị dữ liệu từ bản ghi được chọn (Mã thực thể, Tên dữ liệu chủ, Loại thực thể, Phạm vi sử dụng, Đơn vị chủ quản, Mô tả đối tượng, Tên CSDL/Hệ thống, Trạng thái vòng đời); các bước 2-7 hiển thị placeholder do mock data hiện tại không có dữ liệu demo cho các bước này.
3. Thêm nút mới (icon `Layers`) "Xem dữ liệu tại Cập nhật dữ liệu chủ" — điều hướng sang trang `MasterDataUpdatePage.tsx` với danh mục dữ liệu tương ứng, dùng route mới `master-data-goto-<masterId>` (map từ `dataType` của bản ghi qua bảng `DATA_TYPE_TO_MASTER_ID`).
4. `MasterDataReportsPage` nhận thêm prop `onNavigate` để gọi điều hướng; `MasterDataUpdatePage` nhận thêm prop `initialMasterId` để chọn sẵn danh mục khi được điều hướng tới.
5. `MainLayout.tsx` thêm route `currentPage.startsWith('master-data-goto-')` → `<MasterDataUpdatePage initialMasterId={...} />`, và truyền `onNavigate={setCurrentPage}` cho `MasterDataReportsPage`.

**File này (`MasterDataUpdatePage.tsx`) được PM mở khóa `[x]` trong `stauts.md` riêng cho yêu cầu này.**

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`, `src/components/pages/master-data/MasterDataUpdatePage.tsx`, `src/components/layout/MainLayout.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 51

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`), tab "Tra cứu dữ liệu chủ".

**Nội dung thay đổi:** Thêm thanh phân trang cho bảng "Kết quả tìm kiếm", copy nguyên mẫu từ `CategoryReportPage.tsx` (select số bản ghi/trang, hiển thị "start-end/total", nút Trước/số trang/Sau). Thêm state `currentPage`/`pageSize`, biến tính `totalPages`/`safePage`/`paginatedResults`/`startItem`/`endItem`; bảng hiển thị `paginatedResults` thay vì toàn bộ `searchResults`.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 50

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`).

**Nội dung thay đổi:** Đổi thiết kế thanh tab (Tra cứu / Báo cáo sử dụng / Báo cáo vòng đời) theo đúng mẫu PM cung cấp (giống thanh tab ở "Mô hình dữ liệu chủ" — Thiết lập thực thể/thuộc tính/...):
- Container: `flex border-b border-slate-200 overflow-x-auto bg-white` (bỏ khung bo góc/viền/shadow đã làm ở bước trước).
- Từng tab: `flex items-center gap-2 px-6 py-4 text-[13px] font-medium border-b-2` — active: `border-blue-600 text-blue-600 bg-blue-50/50 font-bold` + icon màu `text-blue-600`; inactive: `border-transparent text-slate-600 hover:border-slate-300` + icon màu `text-slate-400`.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 49

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`).

**Nội dung thay đổi:** Bọc riêng biệt từng khối vào khung nền trắng (`bg-white border border-slate-200 rounded-lg shadow-sm`) theo PM khoanh đỏ:
1. Thanh tab (3 tab) — thêm khung trắng bao ngoài.
2. Bộ lọc tìm kiếm (tab Tra cứu) — đổi nền từ `bg-slate-50` sang `bg-white`.
3. Hàng chọn "Danh mục dữ liệu" (tab Vòng đời) — thêm khung trắng bao ngoài.
4. Khối "Chi tiết vòng đời dữ liệu" (tab Vòng đời) — gộp tiêu đề + nút Xuất Excel/PDF + bảng vào **chung 1 khung trắng** (trước đó tiêu đề/nút nằm ngoài, chỉ bảng có khung riêng).

Mỗi khối là 1 card riêng biệt, không lồng chung 1 wrapper lớn.

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 48

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`).

**Nội dung thay đổi:** Bỏ khung trắng (`bg-white rounded-lg shadow-sm border`) bọc ngoài cùng thanh tab + nội dung tab — giờ thanh tab nằm trực tiếp trên nền `bg-slate-50` của trang, khớp với cách bố trí của "Thống kê dữ liệu mở" (không lồng card trắng ngoài cùng, các khối bên trong mỗi tab vẫn tự có card trắng riêng).

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 47

**Màn hình:** Dữ liệu chủ → Báo cáo tìm kiếm dữ liệu chủ (`MasterDataReportsPage.tsx`).

**Nội dung thay đổi:** Áp dụng lại toàn bộ thiết kế UI theo đúng phong cách trang "Thống kê dữ liệu mở" (`open-data-report/OpenDataReportPage.tsx`), **chỉ đổi thiết kế — giữ nguyên cấu trúc component, state, logic và dữ liệu mock**:
1. **Thanh tab** (Tra cứu / Báo cáo sử dụng / Báo cáo vòng đời): đổi từ kiểu `pb-3 pt-4 px-2` sang `flex items-center gap-2 px-3 py-2 border-b-2 text-[13px]`, tab active có thêm nền `bg-blue-50`.
2. **Bộ lọc tìm kiếm** (tab Tra cứu): đổi khung từ `bg-blue-50 border-blue-200` (nổi bật xanh) sang `bg-slate-50 border-slate-200 shadow-sm` (trung tính) đúng phong cách Open Data; label/input/select đồng bộ `text-[13px]`, input thêm `shadow-sm`.
3. **Bảng grid** (cả 3 tab: Tra cứu, Báo cáo sử dụng, Báo cáo vòng đời): header đổi từ `text-xs uppercase` sang `text-[13px] text-slate-600`; toàn bộ cell đổi từ `text-sm`/`text-xs` sang `text-[13px]`; badge trạng thái vòng đời đổi từ hình chữ nhật bo nhẹ (`rounded`) sang dạng pill (`rounded-full`) với viền màu, khớp mẫu badge Open Data.
4. **Nút bấm**: đồng bộ cỡ chữ `text-[13px]` cho toàn bộ nút (Tìm kiếm, Xóa bộ lọc, In, Excel, PDF...). Riêng tab "Báo cáo sử dụng": đổi nút chính "Truy xuất báo cáo" từ `bg-slate-800` sang `bg-blue-600` (primary), nút "Xuất File" từ `bg-blue-600` sang `bg-green-600` (export) — đúng bảng màu primary/export của Open Data.
5. Đồng bộ cỡ chữ `text-[13px]` cho label/select/thẻ trạng thái/cảnh báo ở tab "Báo cáo vòng đời".

**File bị ảnh hưởng:** `src/components/pages/master-data/MasterDataReportsPage.tsx`.

**Lưu ý:** File này được PM mở khóa `[x]` trong `stauts.md` riêng cho yêu cầu này (phạm vi giới hạn ở trang này, chưa áp dụng cho các trang khác trong module Dữ liệu chủ).

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 46

**Màn hình:** Tổng quan → Xử lý dữ liệu (`DashboardReportPage.tsx`, tab KPI "Xử lý").

**Nội dung thay đổi:**
- Thêm text đơn vị **"bản ghi"** ngay sau số liệu ở thẻ "Số lượng xử lý tháng này" (ví dụ: `8.213.821 bản ghi`).

**File bị ảnh hưởng:** `src/components/dashboard/DashboardReportPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 45

**Màn hình:** Tổng quan → Xử lý dữ liệu (`DashboardReportPage.tsx`, tab KPI "Xử lý").

**Nội dung thay đổi:**
- Đổi thẻ **"Bản ghi còn lại sau xử lý"** thành **"So sánh xử lý theo tháng"**: hiển thị số lượng bản ghi đã xử lý tháng này, kèm % tăng/giảm so với tháng trước (icon TrendingUp/TrendingDown xanh/đỏ tương ứng) và số liệu tháng trước để đối chiếu.
- Bỏ import `TOTAL_COLLECTED_RECORDS` không còn dùng tới; thêm import icon `TrendingDown`.

**File bị ảnh hưởng:** `src/components/dashboard/DashboardReportPage.tsx`.

**Lưu ý:** Số liệu vẫn là mock minh hoạ (`currentMonthProcessedRecords`/`lastMonthProcessedRecords`), chưa nối dữ liệu thật theo tháng.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 44

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo phiên bản danh mục → Modal "So sánh phiên bản danh mục" (`EntityVersionHistoryModal.tsx`, dùng chung với `EntityVersionDiffModal.tsx`).

**Nội dung thay đổi:** Bổ sung mock data cho 2 tab trước đó đang rỗng (không có badge số lượng, hiển thị "Không có thay đổi..."):
1. **Tab "Thông tin chung"**: bổ sung `generalRows` cho bản ghi v3 (v2.0 → v3.0) — Mô tả, Phạm vi, Trạng thái hiệu lực.
2. **Tab "Quan hệ"**: bổ sung `relationshipRows` cho cả 3 bản ghi (v1, v2, v3) — quan hệ giữa "Danh mục giới tính" với "Danh mục dân tộc" (n-n) và "Danh mục mã số hộ tịch" (1-n, mới thêm ở v3).

**File bị ảnh hưởng:** `src/components/pages/category/components/modals/EntityVersionHistoryModal.tsx`.

**Lưu ý:** File `CategoryReportVersionPage.tsx` (trang chứa modal này) được PM mở khóa `[x]` trong `stauts.md` riêng cho yêu cầu này.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 43

**Màn hình:** Cả 3 trang trong Thống kê danh mục.

**Nội dung thay đổi:** Đồng bộ dạng **search combobox** cho bộ lọc chính của cả 3 trang (đã làm "Danh mục" ở trang khai thác trước đó; nay làm nốt 2 trang còn lại):
1. `CategoryReportListPage.tsx` (Báo cáo thống kê danh sách danh mục) — filter **"Đơn vị quản lý"**: thêm ô tìm kiếm, lọc trực tiếp trong 11 đơn vị, ẩn nút "Tất cả đơn vị" khi đang gõ tìm, có thông báo khi không có kết quả, chiều cao danh sách giảm còn `max-h-[180px]`, reset từ khóa khi đóng dropdown.
2. `CategoryReportStatusPage.tsx` (Báo cáo trạng thái danh mục) — filter **"Trạng thái danh mục"**: áp dụng y hệt pattern trên cho 6 trạng thái.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportListPage.tsx`, `src/components/pages/category/reports/CategoryReportStatusPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 42

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategoryReportExploitationPage.tsx`).

**Nội dung thay đổi:**
- Giảm chiều cao danh sách trong dropdown "Danh mục" (search combobox) từ `max-h-[280px]` xuống `max-h-[180px]` để dropdown không đè lên nội dung bảng bên dưới.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 41

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategoryReportExploitationPage.tsx`).

**Nội dung thay đổi:**
- Đổi filter "Danh mục" (multi-select, 29 danh mục) thành dạng **search combobox**: thêm ô tìm kiếm (icon kính lúp, autoFocus khi mở) ngay đầu dropdown, gõ để lọc trực tiếp danh sách hiển thị bên dưới (không phân biệt hoa/thường). Nút "Tất cả danh mục" chỉ hiện khi ô tìm kiếm đang trống (để tránh nhầm lẫn khi đang lọc). Có thông báo "Không tìm thấy danh mục phù hợp" khi không khớp kết quả nào. Từ khóa tìm kiếm tự reset khi đóng dropdown.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 40

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo trạng thái danh mục (`CategoryReportStatusPage.tsx`).

**Nội dung thay đổi:**
- Thêm tiêu đề **"Báo cáo trạng thái danh mục"**, `text-[18px] font-bold`, phía trên khối biểu đồ tròn + thẻ tổng hợp (trước đó khối này chưa có tiêu đề).

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportStatusPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 39

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo thống kê danh sách danh mục (`CategoryReportListPage.tsx`).

**Nội dung thay đổi:**
- Giới hạn chiều cao bảng grid (danh sách theo đơn vị quản lý): thêm `max-h-[420px] overflow-y-auto custom-scrollbar`, dòng tiêu đề `sticky top-0` — đồng bộ với các bảng khác trong dự án.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportListPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 38

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo thống kê danh sách danh mục (`CategoryReportListPage.tsx`).

**Nội dung thay đổi:**
- Thêm tiêu đề biểu đồ **"Báo cáo thống kê danh sách danh mục"**, `text-[18px] font-bold`, phía trên biểu đồ cột (trước đó biểu đồ chưa có tiêu đề).

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportListPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 37

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo trạng thái danh mục (`CategoryReportStatusPage.tsx`).

**Nội dung thay đổi:**
- Giới hạn chiều cao bảng "Chi tiết chuyển trạng thái danh mục": thêm `max-h-[420px] overflow-y-auto custom-scrollbar`, dòng tiêu đề `sticky top-0` — đồng nhất với các bảng khác đã làm trước đó trong dự án.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportStatusPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 36

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo trạng thái danh mục (`CategoryReportStatusPage.tsx`).

**Nội dung thay đổi:**
1. Đổi tên cột **"Trạng thái"** → **"Trạng thái mới nhất"** trong bảng "Chi tiết chuyển trạng thái danh mục".
2. Đồng bộ toàn bảng về `text-[13px]` (trước đó cột Mã danh mục, badge trạng thái, Thời gian chuyển TT đang là `text-xs` = 12px).
3. Thêm class `status-report-table` + rule CSS override `font-size: 13px !important` trong `src/index.css` (theo đúng pattern đã dùng ở các bảng khác) để đảm bảo thắng được rule toàn cục `table th/td { font-size: 14px !important }`.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportStatusPage.tsx`, `src/index.css` (chỉ thêm rule mới).

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 35

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo trạng thái danh mục (`CategoryReportStatusPage.tsx`).

**Nội dung thay đổi:**
- PM đổi ý: bỏ bộ lọc "Từ khóa" vừa thêm, khôi phục lại bộ lọc **"Trạng thái danh mục"** (multi-select) như trước — cùng logic lọc cả biểu đồ tròn/thẻ tổng hợp (`appliedSummary`) lẫn bảng chi tiết.
- Giữ nguyên bộ lọc **"Đơn vị chủ quản"** mới thêm.
- Bộ lọc cuối cùng của trang: **Trạng thái danh mục** (multi-select) + **Đơn vị chủ quản** (dropdown đơn).

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportStatusPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 13/08/2026) — 34

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo trạng thái danh mục (`CategoryReportStatusPage.tsx`).

**Nội dung thay đổi:**
1. Bỏ 2 bộ lọc cũ: "Trạng thái danh mục" (multi-select) và "Thời gian chuyển trạng thái" (select) — cùng toàn bộ state/logic liên quan (`selectedStatuses`, `showStatusDropdown`, `dateRange`, `toggleStatus`, `toggleAll`, `statusDisplayText`...).
2. Thêm 2 bộ lọc mới, đơn giản hơn cho dev: **"Từ khóa"** (input text, tìm theo mã/tên danh mục) và **"Đơn vị chủ quản"** (dropdown đơn, tái sử dụng đúng pattern/style từ `CategoryReportPage.tsx`).
3. Bổ sung field `agency` vào từng dòng `detailData` (mock) và hằng số `AGENCY_OPTIONS` (derive tự động từ `detailData`, không cần khai báo tay).
4. Biểu đồ tròn + thẻ tổng hợp (`summaryData`) không còn bị ảnh hưởng bởi filter (luôn hiển thị đầy đủ 6 trạng thái) vì bộ lọc trạng thái đã bị bỏ; chỉ bảng chi tiết bên dưới được lọc theo Từ khóa + Đơn vị chủ quản khi bấm "Truy xuất dữ liệu".

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportStatusPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 33

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo trạng thái danh mục (`CategoryReportStatusPage.tsx`).

**Nội dung thay đổi:**
- Đổi lưới thẻ tổng hợp trạng thái thành **luôn cố định `grid-cols-6`** (bỏ các mốc responsive `md:`/`xl:`) theo yêu cầu PM — đảm bảo 6 thẻ luôn nằm 1 hàng ngang ở mọi kích thước màn hình.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportStatusPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 32

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo trạng thái danh mục (`CategoryReportStatusPage.tsx`).

**Nội dung thay đổi:**
1. Đổi màu nút **"Truy xuất dữ liệu"** từ `bg-slate-800` sang `bg-[#10B981]` — khớp màu với nút "Truy xuất báo cáo"/"Truy xuất dữ liệu" ở trang "Báo cáo tình trạng khai thác danh mục". Nút "Xuất File" đã sẵn `bg-blue-600` khớp từ trước, không cần đổi.
2. Đổi danh sách trạng thái (`STATUS_OPTIONS`, filter, biểu đồ tròn, thẻ tổng hợp, badge bảng chi tiết) từ 4 trạng thái cũ (Đang hoạt động, Đang chờ duyệt, Hết hiệu lực, Tạm dừng) sang **6 trạng thái mới**: Đang soạn thảo, Chờ phê duyệt, Đã phê duyệt, Từ chối, Hiệu lực, Hết hiệu lực — mỗi trạng thái có màu riêng (xám/xanh dương/tím/đỏ/xanh lá/cam).
3. Cập nhật dữ liệu mock: `summaryData` (biểu đồ tròn) chia lại theo 6 trạng thái; `detailData` remap trạng thái các dòng có sẵn theo danh sách mới + thêm 2 dòng demo cho trạng thái "Đã phê duyệt" (DM-011, DM-012).
4. Đổi lưới thẻ tổng hợp từ `grid-cols-4` sang `grid-cols-3` để xếp gọn 6 thẻ (2 hàng x 3 cột) thay vì 4 thẻ.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportStatusPage.tsx`.

**Lưu ý:** File này được PM mở khóa `[x]` trong `stauts.md` riêng cho yêu cầu này.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 31

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategorySystemExploitationTable.tsx`).

**Nội dung thay đổi:**
- Đưa bộ lọc "Hệ thống khai thác" lên **cùng dòng** với tiêu đề bảng (dùng `flex justify-between`), thay vì nằm ở dòng riêng bên dưới.
- Tăng cỡ chữ tiêu đề "Danh mục theo hệ thống đang khai thác" từ `text-[13px] font-medium` lên `text-[18px] font-bold`.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategorySystemExploitationTable.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 30

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategorySystemExploitationTable.tsx`).

**Nội dung thay đổi:**
1. Đổi cột bảng: bỏ **"Lượt truy cập"** (trùng ý nghĩa "Lượt gọi API") và **"Tình trạng khai thác"** (1 badge/hệ thống không đại diện được nhiều API); thay bằng **"Số API đang sử dụng"** (đếm số API distinct hệ thống đó đang gọi) và **"Tỷ lệ API ổn định"** (text `x/y API ổn định`, không badge — cùng cách làm với bảng theo danh mục).
2. Bổ sung bộ lọc **"Hệ thống khai thác"** (multi-select, cho chọn nhiều) ngay trong component — lọc trực tiếp (live filter, không cần nút "Tìm kiếm" vì đây là bảng nhỏ độc lập), có xử lý trạng thái rỗng khi không hệ thống nào phù hợp.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategorySystemExploitationTable.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 29

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategoryTrendAndStatsSection.tsx`).

**Nội dung thay đổi:**
- Đổi tiêu đề biểu đồ từ "Xu hướng tổng lượt gọi API theo thời gian" thành **"Xu hướng tổng chia sẻ danh mục dùng chung theo thời gian"**.
- Tăng cỡ chữ tiêu đề từ `text-[13px] font-medium` lên `text-[18px] font-bold`.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryTrendAndStatsSection.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 28

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục.

**Nội dung thay đổi:**
- Tạo component mới **`CategoryTrendAndStatsSection.tsx`** gộp chung biểu đồ xu hướng lượt gọi API + bảng thống kê theo danh mục vào **1 khung trắng duy nhất** (`bg-white border rounded-2xl shadow-sm p-6`), tách biệt rõ với bảng "Danh mục theo hệ thống đang khai thác" (`CategorySystemExploitationTable.tsx`) đứng riêng bên dưới.
- `CategoryReportExploitationPage.tsx` chỉ còn truyền dữ liệu đã lọc (`appliedTrendData`, `appliedCategories`, `selectedCategories.length`) vào component mới qua props; bỏ phần tính tổng (`totalApiCount`/`totalStableApiCount`/`totalApiCalls`) trùng lặp — logic này chuyển vào trong component mới.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryTrendAndStatsSection.tsx` (mới), `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 27

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategoryReportExploitationPage.tsx` + `CategorySystemExploitationTable.tsx`).

**Nguyên nhân:** PM phản hồi 2 bảng grid (kể cả dòng tiêu đề) đang hiển thị 14px thay vì 13px. Điều tra ra nguyên nhân: `src/index.css` có rule toàn cục `table th, table thead th, table td, table tbody td { font-size: 14px !important; }` (dòng ~5497-5509) ghi đè lên class `text-[13px]` của Tailwind trên mọi bảng trong hệ thống. Dự án đã có sẵn cách xử lý chuẩn cho vấn đề này: gắn class riêng cho từng bảng (`table.collection-table`, `table.stats-table`, `table.version-modal-table`...) kèm rule `font-size: 13px !important` riêng.

**Nội dung thay đổi:**
- Thêm class `exploitation-report-table` vào cả 2 bảng (bảng thống kê danh mục và bảng theo hệ thống khai thác).
- Thêm rule CSS mới trong `src/index.css` (nối theo đúng pattern các rule tương tự đã có): `table.exploitation-report-table th/thead th/td/tbody td { font-size: 13px !important; }`.

**File bị ảnh hưởng:** `src/index.css` (file dùng chung — chỉ thêm rule mới, không sửa/xóa rule có sẵn, theo đúng pattern đã dùng nhiều lần trong dự án), `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`, `src/components/pages/category/reports/CategorySystemExploitationTable.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 26

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategoryReportExploitationPage.tsx` + `CategorySystemExploitationTable.tsx`).

**Nội dung thay đổi:**
- Đồng bộ cỡ chữ 13px cho cả 2 bảng grid: bảng "Bảng thống kê danh mục" đã sẵn 13px (không cần đổi); bảng "Danh mục theo hệ thống đang khai thác" — đổi badge trạng thái từ `text-xs` (12px) sang `text-[13px]`.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategorySystemExploitationTable.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 25

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategoryReportExploitationPage.tsx`).

**Nội dung thay đổi:**
- Giới hạn chiều cao dropdown filter "Danh mục" (đang có 29 danh mục): thêm `max-h-[280px] overflow-y-auto custom-scrollbar` cho phần danh sách từng danh mục, giữ nút "Tất cả danh mục" cố định phía trên (không cuộn theo).

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 24

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategoryReportExploitationPage.tsx`).

**Nội dung thay đổi:**
1. Mở rộng dữ liệu mock `categoryTrendData` từ 7 tháng lên **đủ 12 tháng** (thêm Tháng 8-12 cho 5 danh mục gốc; `GROWTH_RATIOS` cho 24 danh mục demo cũng đổi từ 7 sang 12 mốc) để hỗ trợ đủ các mốc lọc mới.
2. Đổi bộ lọc "Thời gian thống kê" từ (Toàn thời gian/Tháng gần nhất/6 tháng qua) sang **3 tháng / 6 tháng / 9 tháng / 12 tháng**, tính **từ đầu năm** (Tháng 1 → Tháng N) thay vì lùi từ tháng hiện tại — ví dụ "9 tháng" luôn là Tháng 1-9, không phải "9 tháng gần nhất". Mặc định đổi sang **12 tháng** (thay cho "Toàn thời gian" cũ).
3. Bảng thống kê theo danh mục: thêm `max-h-[420px] overflow-y-auto` (dùng `custom-scrollbar` có sẵn trong dự án) để giới hạn chiều cao và cuộn nội bộ khi danh sách dài (hiện có 29 danh mục); dòng tiêu đề `sticky top-0` để luôn hiển thị khi cuộn.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 23

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategoryReportExploitationPage.tsx`).

**Nội dung thay đổi:**
- Đổi biểu đồ từ Bar Chart theo danh mục (kèm Top N + "Khác") sang **Line Chart xu hướng theo thời gian** — chỉ 1 đường duy nhất "Tổng lượt gọi API", mỗi điểm trên trục thời gian (tháng) = **tổng lượt gọi API cộng dồn từ các danh mục đang được lọc** (hoặc toàn bộ 29 danh mục nếu không lọc gì).
- Nhờ chỉ còn 1 series duy nhất, bỏ hẳn cơ chế Top N + "Khác", `CATEGORY_COLORS`/`COLOR_PALETTE` (không còn cần tô màu riêng theo danh mục) — giải quyết triệt để vấn đề "quá nhiều danh mục làm biểu đồ khó đọc" mà không cần giới hạn hiển thị.
- Bảng thống kê theo danh mục phía dưới giữ nguyên (vẫn liệt kê chi tiết từng danh mục với Số API đang chia sẻ / Lượt gọi API / Tỷ lệ API ổn định).
- Thêm chú thích rõ dưới biểu đồ để người dùng biết đường đang thể hiện tổng của bao nhiêu danh mục.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 22

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategoryReportExploitationPage.tsx`).

**Nội dung thay đổi:**
- Bổ sung demo **24 danh mục thực tế** (hộ tịch, trợ giúp pháp lý, biện pháp bảo đảm, công chứng, thi hành án...) theo danh sách PM cung cấp, **giữ nguyên 5 danh mục gốc** (giới tính, dân tộc, quốc gia/quốc tịch, tôn giáo, cơ quan) — tổng cộng 29 danh mục để mô phỏng hệ thống có nhiều danh mục thật.
- Mỗi danh mục mới có `apiCount`/`stableApiCount` riêng và chuỗi lượt gọi API theo 7 tháng được sinh tự động từ `finalApiCalls` (giá trị tháng cuối) nhân với `GROWTH_RATIOS` — cùng cách làm với dữ liệu 5 danh mục gốc.
- Đổi `CATEGORY_COLORS` từ khai báo tay từng màu sang **bảng màu lặp vòng `COLOR_PALETTE`** (15 màu) áp theo thứ tự danh mục, để không phải khai báo tay khi số danh mục tăng lên.
- Với 29 danh mục, cơ chế Top N + "Khác" (đã làm trước đó) sẽ tự động phát huy: biểu đồ chỉ hiển thị riêng 5 danh mục có lượt gọi API cao nhất theo khoảng thời gian đang lọc, phần còn lại gộp vào cột "Khác".

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 21

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategoryReportExploitationPage.tsx`).

**Nội dung thay đổi:**
1. Đổi trục hoành biểu đồ từ **tên tháng** sang **tên danh mục** — mỗi cột = tổng lượt gọi API của 1 danh mục.
2. Bổ sung logic tính tổng lượt gọi API theo danh mục **trong đúng khoảng thời gian đang lọc** (`getMonthsForRange`/`getApiCallsInRange`, dựa trên dữ liệu tháng có sẵn `categoryTrendData`) — khi bấm "Truy xuất báo cáo", số liệu ở cả biểu đồ và bảng đều tính lại theo `dateRange` đang chọn.
3. Đổi bộ lọc "Thời gian thống kê": mặc định **"Toàn thời gian"** (`all`, tính tổng hết các tháng có dữ liệu), thêm 2 lựa chọn "Tháng gần nhất" và "6 tháng qua".
4. Top N + "Khác" trên biểu đồ nay xếp hạng theo lượt gọi API **đã tính theo khoảng thời gian đang lọc** (trước đó xếp theo tổng cố định toàn bộ dữ liệu, không phản ánh đúng bộ lọc thời gian).

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 20

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategoryReportExploitationPage.tsx`).

**Nội dung thay đổi:**
- Đổi biểu đồ từ Area Chart (nhiều đường chồng) sang **Bar Chart cột chồng (stacked)**, do hệ thống có thể khai báo rất nhiều danh mục khiến biểu đồ nhiều đường không còn đọc được.
- Bổ sung cơ chế **Top N + "Khác"**: chỉ vẽ riêng tối đa `TOP_N_CHART_SERIES = 5` danh mục có tổng lượt gọi API cao nhất (trong tập đang áp dụng filter), phần còn lại gộp thành 1 cột "Khác" (màu xám `#94a3b8`) — đảm bảo biểu đồ luôn đọc được bất kể hệ thống có bao nhiêu danh mục. Khi người dùng chủ động lọc chỉ còn ≤5 danh mục, biểu đồ hiển thị đúng các danh mục đó, không kích hoạt gộp "Khác".
- Có chú thích rõ khi đang gộp "Khác" để không gây hiểu nhầm, kèm hướng người dùng xem chi tiết ở bảng thống kê bên dưới.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 19

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategoryReportExploitationPage.tsx`).

**Nội dung thay đổi:**
- Bảng thống kê theo danh mục: bỏ 2 cột "Lượt truy cập" (trùng ý nghĩa với "Lượt gọi API") và "Tình trạng khai thác" (badge 1 giá trị, không đại diện được nhiều API cùng khai thác 1 danh mục).
- Thay bằng 2 chỉ tiêu: **"Số API đang chia sẻ"** (đếm số API distinct đang expose danh mục) và **"Tỷ lệ API ổn định"** — hiển thị dạng text thuần `x/y API ổn định` (không đặt trong badge), màu xanh nếu 100% ổn định, cam nếu có API gián đoạn.
- Dòng "Tổng cộng" tính tổng `apiCount` và tỷ lệ tổng `stableApiCount/apiCount` theo cùng quy tắc màu.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 18

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategoryReportExploitationPage.tsx` + component mới `CategorySystemExploitationTable.tsx`).

**Nội dung thay đổi (tách bảng theo hệ thống ra component riêng, theo yêu cầu PM):**
1. **`CategoryReportExploitationPage.tsx`** — thu hẹp lại chỉ còn: filter Danh mục (multi-select), filter Thời gian thống kê, biểu đồ xu hướng lượt gọi API theo tháng (tách theo từng danh mục — `categoryTrendData`), và bảng thống kê theo danh mục (`mockCategoryStats`: Lượt truy cập, Lượt gọi API, Tình trạng khai thác). Bỏ hoàn toàn filter/khái niệm "Hệ thống sử dụng" khỏi component này.
2. **`CategorySystemExploitationTable.tsx`** (component mới, hoàn toàn độc lập — không dùng chung state/dữ liệu với component trên): bảng nhỏ "Danh mục theo hệ thống đang khai thác" — liệt kê từng hệ thống đã định danh, số danh mục đang khai thác, lượt truy cập, lượt gọi API, tình trạng khai thác. Có ghi chú rõ: chỉ tính hệ thống có định danh khi gọi API; lượt gọi từ API công khai/không định danh được hệ thống gọi sẽ không xuất hiện ở bảng này (theo quyết định thiết kế đã thống nhất với PM).
3. Component mới được import và render ở cuối `CategoryReportExploitationPage.tsx` để vẫn hiển thị trên cùng màn hình, nhưng độc lập hoàn toàn về code/state.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`, `src/components/pages/category/reports/CategorySystemExploitationTable.tsx` (mới).

**Lưu ý:** Toàn bộ vẫn là prototype/mock theo UC, chưa nối dữ liệu thật.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 17

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategoryReportExploitationPage.tsx`).

**Nội dung thay đổi (thử nghiệm theo hướng UC "xem xu hướng"):**
1. Đổi grain dữ liệu mock từ 1 dòng/1 hệ thống sang **1 dòng/1 cặp (Danh mục, Hệ thống khai thác)** (`mockUsageRows`), phản ánh đúng quan hệ nhiều-nhiều thực tế (1 danh mục có thể chia sẻ qua nhiều API/hệ thống).
2. Bổ sung filter **"Danh mục"** (multi-select, giống cấu trúc filter "Hệ thống sử dụng" đã có), kết hợp lọc AND với filter hệ thống.
3. Bảng dữ liệu: thêm cột **"Danh mục"**, đổi "Tổng lượt truy xuất" → **"Lượt truy cập"**, bổ sung cột mới **"Lượt gọi API"**, đổi "Trạng thái kết nối" → **"Tình trạng khai thác"**. Dòng "Tổng cộng" tính tổng cả 2 cột số.
4. Biểu đồ giữ nguyên dạng Area Chart xu hướng theo tháng (đúng hướng "xem xu hướng" đã chọn), lọc theo hệ thống còn lại sau filter; có chú thích rõ biểu đồ đang tổng hợp theo hệ thống (chưa tách theo danh mục) để không gây hiểu nhầm.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`.

**Lưu ý:** Đây là bản dựng thử (prototype) theo UC, dữ liệu vẫn là mock. Nếu cần biểu đồ xu hướng tách riêng theo từng danh mục, cần bổ sung dữ liệu theo tháng ở grain (danh mục, hệ thống, tháng) — hiện tại `exploitationData` chỉ có grain (hệ thống, tháng).

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 16

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo tình trạng khai thác danh mục (`CategoryReportExploitationPage.tsx`).

**Nội dung thay đổi:**
- Đổi màu nút **"Truy xuất báo cáo"** từ `bg-slate-800` sang `bg-[#10B981]` (giống nút "Truy xuất dữ liệu" ở trang "Báo cáo thống kê danh sách danh mục").
- Nút "Xuất File" đã sẵn `bg-blue-600 hover:bg-blue-700` — khớp màu, không cần đổi.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`.

**Lưu ý:** File này được PM mở khóa `[x]` trong `stauts.md` riêng cho yêu cầu này.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 15

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo thống kê danh sách danh mục (`CategoryReportListPage.tsx`).

**Nội dung thay đổi:**
- Đổi giá trị mặc định của bộ lọc "Thời gian tạo (Năm)" từ `2024` sang **"Toàn thời gian"** (`all`).
- Đổi danh sách giá trị lọc: Toàn thời gian, **Năm 2026**, **Năm 2025** (bỏ 2024/2023 cũ, theo năm hiện tại/năm ngoái).

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportListPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 14

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo thống kê danh sách danh mục (`CategoryReportListPage.tsx`).

**Nội dung thay đổi:**
- Tăng chiều cao khung biểu đồ từ `h-64` (256px) lên `h-96` (384px), tăng `margin.bottom` (40 → 90) và `XAxis height` (60 → 110), góc xoay nhãn (-20° → -30°) để nhãn tên đơn vị dài không bị cắt mất chữ.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportListPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 13

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo thống kê danh sách danh mục (`CategoryReportListPage.tsx`).

**Nội dung thay đổi:**
- Bỏ chú thích (Legend) "■ Tổng số bộ danh mục" trong biểu đồ — không cần thiết vì chart chỉ có 1 series và đang đè lên nhãn trục hoành đã xoay nghiêng.
- Xóa import `Legend` không dùng tới.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportListPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 12

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo thống kê danh sách danh mục (`CategoryReportListPage.tsx`).

**Nội dung thay đổi:**
- Cấu trúc lại `mockDataList`: chuyển từ 5 dòng theo "chủ đề" sang **11 dòng, mỗi dòng tương ứng 1 đơn vị quản lý** (khớp `AGENCY_OPTIONS`). Nhờ đó khi chọn bộ lọc "Đơn vị quản lý", biểu đồ và bảng grid hiển thị đúng và đủ các đơn vị được chọn (tối đa 11 đơn vị, logic lọc `filter` theo `agency` đã có sẵn từ trước).
- Mở rộng bảng màu `COLORS` từ 5 lên 11 màu để mỗi đơn vị trong biểu đồ có màu riêng biệt.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportListPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 11

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo thống kê danh sách danh mục (`CategoryReportListPage.tsx`).

**Nội dung thay đổi:**
- Đổi trục hoành của biểu đồ từ `dataKey="category"` (tên chủ đề — đã bị bỏ khỏi bảng) sang `dataKey="agency"` (đơn vị quản lý/hệ thống), tương ứng với bảng dữ liệu bên dưới.
- Xoay nhãn trục hoành (-20°, `textAnchor="end"`) và tăng chiều cao vùng nhãn để hiển thị đủ tên đơn vị dài mà không bị chồng chữ.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportListPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 10

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo thống kê danh sách danh mục (`CategoryReportListPage.tsx`).

**Nội dung thay đổi:**
- Đổi text các mục trong dropdown "Đơn vị quản lý" (mục "Tất cả đơn vị" và từng đơn vị) từ `text-sm` sang `text-[13px]` để đồng bộ cỡ chữ.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportListPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 9

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Báo cáo thống kê danh sách danh mục (`CategoryReportListPage.tsx`).

**Nội dung thay đổi:**
1. Đổi màu nút **"Truy xuất dữ liệu"** từ `bg-slate-800` sang `bg-[#10B981]` theo mẫu PM cung cấp.
2. Bảng grid phía dưới:
   - Bỏ cột **"Tên chủ đề / Phân hệ"**.
   - Đổi danh sách "Đơn vị quản lý" (`AGENCY_OPTIONS`) thành 11 đơn vị PM cung cấp: Cục Hành chính tư pháp, Cục Quản lý thi hành án dân sự, Cục Đăng ký GD bảo đảm & Bồi thường nhà nước, Cục Kiểm tra văn bản & Quản lý xử lý VP hành chính, Cục Pháp luật quốc tế và Giải quyết tranh chấp đầu tư quốc tế, Cục Phổ biến, giáo dục pháp luật và Trợ giúp pháp lý, Cục Bổ trợ tư pháp, Vụ Hợp tác quốc tế, Cục Kế hoạch - Tài chính, Tòa án nhân dân tối cao, Trung tâm dữ liệu Quốc gia (TTDLQG).
   - Đổi tên cột "Số lượng DM Cập mới" → **"Số lượng danh mục tạo mới"**.
   - Bổ sung cột mới **"Số lượng danh mục cập nhật"** (field `updated`), có tính tổng ở dòng "Tổng cộng".
   - Đảm bảo toàn bộ text trong bảng (kể cả dòng tiêu đề) là `text-[13px]`.
   - Dữ liệu mock (`mockDataList`) được gán lại trường `agency` cho khớp danh sách 11 đơn vị mới.

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportListPage.tsx`.

**Lưu ý:** File này được PM mở khóa `[x]` trong `stauts.md` riêng cho yêu cầu này.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 8

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Khai thác báo cáo (`CategoryReportPage.tsx`).

**Nội dung thay đổi:**
- Đổi màu nút "Kết xuất" từ `bg-indigo-600` sang mã màu chính xác PM cung cấp: `bg-[#2F3CC1]` (hover: `brightness-110`).

**File bị ảnh hưởng:** `src/components/pages/category/CategoryReportPage.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 7

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Khai thác báo cáo (`CategoryReportPage.tsx`).

**Nội dung thay đổi:**
- Đổi độ đậm chữ header bảng (8 cột: STT, Mã danh mục, Tên danh mục, Đơn vị chủ quản, Phạm vi, Trường thuộc tính, Trạng thái, Thao tác) từ `font-semibold text-slate-700` sang `font-bold text-slate-900` theo mẫu PM gửi.

**File bị ảnh hưởng:** `src/components/pages/category/CategoryReportPage.tsx`.

**Lưu ý:** File này đang mở khóa `[x]` từ yêu cầu trước đó trong cùng phiên làm việc.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 6

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Khai thác báo cáo (`CategoryReportPage.tsx`).

**Nội dung thay đổi:**
1. Chuyển nút **"Xuất File"** (đổi tên thành **"Kết xuất"**) từ hàng riêng bên dưới lên cạnh nút "Tìm kiếm"/"Đặt lại" ở thanh bộ lọc phía trên.
2. Bỏ dòng text "Tìm thấy {n} kết quả".
3. Đổi màu nút "Kết xuất" từ `bg-blue-600` sang `bg-indigo-600 hover:bg-indigo-700` theo mẫu PM cung cấp.

**File bị ảnh hưởng:** `src/components/pages/category/CategoryReportPage.tsx`.

**Lưu ý:** File này đang mở khóa `[x]` từ yêu cầu trước đó trong cùng phiên làm việc.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 5

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → Khai thác báo cáo (`CategoryReportPage.tsx`).

**Nội dung thay đổi:**
- Đổi màu nút **"Tìm kiếm"** từ `bg-slate-800` (đen) sang `bg-blue-600 hover:bg-blue-700` — đúng màu Primary chuẩn theo design system chung (`compomennt.md`).

**File bị ảnh hưởng:** `src/components/pages/category/CategoryReportPage.tsx`.

**Lưu ý:** File này được PM mở khóa `[x]` trong `stauts.md` riêng cho yêu cầu này.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 4

**Màn hình:** Danh mục dùng chung → Modal "Thiết lập danh mục dùng chung" (`CategoryWizardModal.tsx`), Bước 1 - Thông tin chung.

**Nội dung thay đổi:**
- Đổi trường **"Cơ sở dữ liệu/Hệ thống"** từ ô nhập text tự do thành dropdown chọn trong danh sách hệ thống nguồn, tái sử dụng danh sách `SOURCE_TREND_LIST` đã có sẵn tại `dashboard/kpiReportData.ts` (TAND Tối cao, Bộ Nội vụ, Ủy ban Dân tộc, Bộ Ngoại giao, Bộ LĐTBXH, Bộ Y tế, Cục Hành chính tư pháp, Cục Quản lý thi hành án dân sự, Cục Đăng ký giao dịch bảo đảm và BTNN, Cục Kiểm tra văn bản và Quản lý xử lý VPHC, Cục Bổ trợ tư pháp, Vụ Hợp tác quốc tế, Cục Kế hoạch - Tài chính, TTDLQG, Tòa án).

**File bị ảnh hưởng:** `src/components/pages/category/components/modals/CategoryWizardModal.tsx`.

**Lưu ý:** File này được PM mở khóa `[x]` trong `stauts.md` riêng cho yêu cầu này.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 3

**Màn hình:** Toàn bộ các trang "Quản lý Quy tắc Xử lý" (`GenericProcessingPage.tsx`), truy cập qua các route `processing-data-info-*`, `processing-external-*` và `processing-collection-statistics`.

**Nội dung thay đổi:**
- Nới rộng chiều ngang khung nội dung từ `max-w-[1600px]` lên `max-w-[1900px]`, sau đó theo phản hồi PM nới tiếp lên `max-w-[2100px]` — **chỉ cho các route trên**. Các trang khác trong toàn hệ thống giữ nguyên `max-w-[1600px]`.

**File bị ảnh hưởng:** `src/components/layout/MainLayout.tsx` (file dùng chung — PM đã duyệt thay đổi có kiểm soát, chỉ áp dụng cho các route liệt kê ở trên).

**Lưu ý:** Nếu 2100px vẫn chưa đủ hoặc cần đổi khác, chỉ cần chỉnh giá trị `max-w-[2100px]` tại điều kiện tương ứng trong `MainLayout.tsx`.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026) — 2

**Màn hình:** Xử lý dữ liệu → CSDL Trong ngành → (bất kỳ CSDL nào) → Quản lý Quy tắc Xử lý (`GenericProcessingPage.tsx`).

**Nội dung thay đổi:**
1. Bỏ thẻ **"Danh sách lỗi"** khỏi khối tổng quan (5 thẻ → còn 4 thẻ).
2. Đổi `grid-cols-5` → `grid-cols-4` để 4 thẻ còn lại chia đều chiều rộng.
3. Đổi tên 4 thẻ còn lại:
   - "Số lượng Thu thập" → **"Số lượng bản ghi thu thập"**
   - "Đã Làm sạch" → **"Số lượng bản ghi còn lại sau làm sạch"**
   - "Đã Chuẩn hóa" → **"Số lượng bản ghi còn lại sau chuẩn hóa"**
   - "Đã Biến đổi" → **"Số lượng bản ghi còn lại sau biến đổi"**

**File bị ảnh hưởng:** `src/components/pages/processing/GenericProcessingPage.tsx`.

**Lưu ý:** File này được PM mở khóa `[x]` trong `stauts.md` riêng cho yêu cầu này.

## Cập nhật giao diện (Ngày thực hiện: 12/08/2026)

**Màn hình:** Xử lý dữ liệu → Tổng quan xử lý dữ liệu (`DashboardReportPage.tsx`, tab KPI "Xử lý").

**Nội dung thay đổi:**
1. Đổi thẻ **"Dữ liệu đã xử lý"** (hiển thị dung lượng, VD: `7.69 TB / 9.2 TB`) thành thẻ **"Bản ghi còn lại sau xử lý"**, hiển thị số bản ghi còn lại sau xử lý (đã loại trùng lặp/lỗi) trên tổng số bản ghi thu thập ban đầu (VD: `78.213.821 / 93.533.279`).
2. Thêm hằng số `TOTAL_COLLECTED_RECORDS` (`kpiReportData.ts`) — tổng số bản ghi thu thập, cộng dồn từ `SOURCE_FINAL_TOTALS`.
3. Thêm `retainedRecords` / `retainedRecordsPercent` (mock, tỷ lệ minh hoạ 83.6%) trong `DashboardReportPage.tsx` để tính số bản ghi còn lại sau xử lý. (Trước đó đặt tên `processedRecords`/`processedRecordsPercent` — đã đổi tên cho đúng ngữ nghĩa "còn lại sau xử lý" theo yêu cầu PM.)

**File bị ảnh hưởng:** `src/components/dashboard/DashboardReportPage.tsx`, `src/components/dashboard/kpiReportData.ts`.

**Lưu ý:** Số liệu bản ghi vẫn là dữ liệu mock minh hoạ, chưa nối API thật.

<<<<<<< HEAD
## Cập nhật giao diện (Ngày thực hiện: 22/07/2026)

**Màn hình:** Dữ liệu chủ → Wizard tạo Master Data (`MasterDataWizard.tsx`).

**Nội dung thay đổi — Cập nhật Wizard tạo Master Data (`MasterDataWizard.tsx`):**
1. **Thay thế khối "Cấu hình nguồn dữ liệu" ở Bước Tạo thuộc tính**:
   - Loại bỏ khối cấu hình cơ sở dữ liệu / bảng dữ liệu chính / liên kết bảng (Join) cũ.
   - Thay bằng danh sách các bảng nguồn dữ liệu đã được chọn/đăng ký ở Bước 1 (`wizardData.sources`), hiển thị dạng thẻ/nút bấm chọn (không chứa nút "Thêm nguồn").
2. **Đồng bộ bảng "Chọn trường dữ liệu chia sẻ"**:
   - Khi bấm chọn một bảng nguồn dữ liệu trong danh sách, bảng "Chọn trường dữ liệu chia sẻ" phía dưới hiển thị danh sách các trường tương ứng của bảng nguồn đang được chọn.
3. **Thiết kế khối "Ánh xạ cột nguồn → thuộc tính"**:
   - Chuẩn hóa giao diện giống hệt khối "Danh sách thuộc tính": gỡ bỏ viền/padding `p-4` lồng nhau, đưa thẻ `<table className="w-full text-left text-[13px]">` hiển thị dính liền trực tiếp ngay dưới thanh tiêu đề card header (`bg-slate-50 border-b border-slate-100`).
   - Badge đếm số nguồn đổi sang style đồng bộ: `px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium`.
4. **Điều chỉnh thứ tự các bước quy trình (Wizard Stepper)**:
   - Chuyển tab **Định danh duy nhất** xuống sau bước **Thiết lập quan hệ**.
   - Thứ tự 6 bước mới: 1. Khởi tạo dữ liệu chủ → 2. Tạo thuộc tính → 3. Quy tắc hợp nhất → 4. Thiết lập quan hệ → 5. Định danh duy nhất → 6. Phê duyệt.
5. **Loại bỏ khối "Cấu hình nguồn dữ liệu" ở Bước 1 (Khởi tạo dữ liệu chủ)**:
   - Loại bỏ khối dropdown chọn loại nguồn dữ liệu và thông báo hướng dẫn ở cuối Bước 1.
   - Vẫn giữ nút chuyển đổi "Cách định nghĩa thuộc tính" ("Chọn trường từ Kho DLDC" / "Tự thêm mới từng trường") ở Bước 2 (Tạo thuộc tính).
6. **Cập nhật nhãn trường Thuật toán (Fuzzy Algorithms)**:
   - Gỡ bỏ tên tiếng Anh trong các tùy chọn thuật toán so khớp, chỉ giữ tên tiếng Việt thuần túy:
     - `Jaro-Winkler (tương đồng chuỗi)` → **`Tương đồng chuỗi`**
     - `Levenshtein (khoảng cách chỉnh sửa)` → **`Khoảng cách chỉnh sửa`**
     - `Ngữ âm (phiên âm tên)` → **`Ngữ âm`**
7. **Cập nhật hiển thị trường đối chiếu (Trường so khớp / Hard-block)**:
   - Loại bỏ phần tên kỹ thuật trong ngoặc `(fieldName)`, chỉ hiển thị Tên hiển thị (`displayName`) của thuộc tính trong các ô chọn/dropdown chọn trường đối chiếu.
8. **Loại bỏ ràng buộc hard-block bắt buộc**:
   - Gỡ bỏ câu điều kiện kiểm tra bắt buộc phải có ít nhất 1 trường hard-block khi chuyển từ Bước Quy tắc hợp nhất sang bước tiếp theo.
9. **Thêm cảnh báo không khớp kiểu dữ liệu tại bảng Ánh xạ cột nguồn → thuộc tính**:
   - Tự động kiểm tra và so sánh kiểu dữ liệu của cột nguồn được chọn với kiểu dữ liệu của thuộc tính đích (`attr.dataType`).
   - Nếu phát hiện không cùng nhóm kiểu dữ liệu (ví dụ: đích là `date` nhưng nguồn chọn cột `string` / `integer`), ô chọn sẽ chuyển sang màu viền vàng nổi bật kèm thẻ cảnh báo: `<AlertTriangle> Kiểu nguồn (sourceType) ≠ Đích (targetType)`.
   - Nếu kiểu dữ liệu khớp, giao diện giữ nguyên bình thường không hiển thị thẻ thông báo.
   - Hiển thị thêm thanh cảnh báo tổng hợp ở đầu bảng khi có ít nhất 1 ô ánh xạ không tương thích.
   - Bổ sung bộ dữ liệu mẫu ban đầu (`wizardData.mapping`) gồm cả trường hợp khớp và lệch kiểu dữ liệu để thể hiện trực tiếp trên bản Demo prototype:
     - `ngay_sinh` (Đích `date`): Nguồn *CCCD* chọn `FullName` (`string`) ➔ Cảnh báo lệch kiểu!
     - `so_dinh_danh` (Đích `string`): Nguồn *CCCD* chọn `DOB` (`date`) ➔ Cảnh báo lệch kiểu!
10. **Loại bỏ Sơ đồ quan hệ tại Bước 4 (Thiết lập quan hệ)**:
   - Gỡ bỏ khối card "Sơ đồ quan hệ" (biểu đồ SVG minh họa liên kết giữa các thực thể) theo yêu cầu.
11. **Loại bỏ nút "+ Thêm trường" ở Bước 2 (Chọn trường dữ liệu chia sẻ)**:
   - Gỡ bỏ nút bấm "+ Thêm trường" trên tiêu đề bảng "Chọn trường dữ liệu chia sẻ" theo yêu cầu.
12. **Cập nhật dropdown chọn số lượng bản ghi kiểm thử (Tab Kiểm thử - Bước 3)**:
   - Đổi tên nhãn dropdown: **`Chọn số lượng bản ghi chạy kiểm thử`**.
   - Cập nhật các tùy chọn dữ liệu kiểm thử:
     - `100 bản ghi - kiểm tra logic cơ bản`
     - `500 bản ghi - kiểm tra tỷ lệ khớp`
     - `1000 - kiểm tra toàn diện`
13. **Nâng cấp bảng kết quả rà soát (Tab Kiểm thử - Bước 3)**:
   - Đổi tên bảng từ `Nghi ngờ cần xem lại` thành **`Các bản ghi chờ rà soát`**.
   - Bổ sung ô tích chọn Checkbox trước mỗi dòng (kèm ô chọn tất cả trên header).
   - Khi chọn ít nhất 1 dòng bản ghi, thanh header tự động hiển thị 3 nút bấm thao tác hàng loạt: **Hợp nhất** (`GitMerge`), **Tách biệt** (`Split`), **Gửi duyệt** (`Send`).
   - Thêm cột **Thao tác** ở cuối bảng với 3 icon button tương ứng cho từng bản ghi riêng lẻ.
   - Thêm thanh phân trang ở cuối bảng (`Hiển thị 1 - 5 trong số 37 bản ghi`, nút Trước/Sau).
14. **Bổ sung bảng Các bản ghi không khớp (Tab Kiểm thử - Bước 3)**:
   - Thêm bảng **`Các bản ghi không khớp`** nằm ngay phía dưới bảng Các bản ghi chờ rà soát.
   - Thêm cột **Phương án xử lý** cho phép người dùng chọn 1 trong 2 phương án: **Tạo bản ghi đơn nguồn** (vẫn tạo Golden Record từ bản ghi đó) hoặc **Loại bỏ** (không cần cột thao tác riêng lẻ).
   - Thêm ô tích chọn Checkbox trước mỗi dòng cùng các nút thao tác hàng loạt trên header khi chọn nhiều dòng: **Tạo bản ghi đơn nguồn** (`PlusCircle`) và **Loại bỏ** (`XCircle`).
   - Thêm thanh phân trang ở cuối bảng (`Hiển thị 1 - 5 trong số 183 bản ghi`, nút Trước/Sau).
15. **Disable dòng đã xử lý & Hiển thị thông báo Toast góc màn hình**:
   - Thêm tùy chọn mặc định **`-- Chọn phương án xử lý --`** vào đầu dropdown cột Phương án xử lý tại bảng Các bản ghi không khớp.
   - Khi người dùng thực hiện xử lý dòng bản ghi (chọn phương án từ dropdown hoặc thực hiện thao tác hàng loạt), dòng đã xử lý sẽ chuyển sang màu xám nhạt (`bg-slate-100/70 text-slate-400 opacity-60 grayscale`), vô hiệu hóa ô checkbox (`disabled`), đồng thời hiển thị badge nhãn **`Đã xử lý`** tại cột *Phương án xử lý* đồng bộ với bảng Các bản ghi chờ rà soát.
   - Kích hoạt thông báo Toast thành công ở góc trên bên phải màn hình:
     - Header: **`Gửi yêu cầu thành công`**
     - Nội dung: **`Đã lưu bản ghi mới thành công!`**
     - Tùy chọn đóng thủ công hoặc tự động ẩn sau 3.5 giây.
16. **Mã nguồn bị ảnh hưởng**:
   - `src/components/pages/master-data/MasterDataWizard.tsx`

---

=======
## Sửa cột danh sách + bộ lọc — Danh sách danh mục dữ liệu mở (Ngày thực hiện: 22/07/2026)

**Màn hình:** Dữ liệu mở → Biên tập danh mục → **Danh sách danh mục dữ liệu mở** (`open-data-category/components/tabs/OpenDataCategoryGrid.tsx`, `open-data-category/components/OpenDataCategoryFilters.tsx`).

1. **Bảng danh sách:** đổi cột "Người cập nhật" → **"Cơ quan công bố"** (hiển thị `item.publisher`, cùng field đã dùng ở form Thêm/Sửa) và đổi nhãn cột "Ngày gửi công bố" → **"Ngày tạo"** (giữ nguyên dữ liệu `item.createdDate` — nhãn cũ vốn đã sai vì cột này luôn hiển thị ngày tạo, không phải ngày gửi công bố).
2. **Bộ lọc nâng cao:** đổi nhãn "Ngày gửi công bố" → "Ngày tạo" cho đúng với field đang lọc thực tế (`createdDate`) — không đổi logic lọc vì logic vốn đã lọc theo ngày tạo.
3. **Cột "Trạng thái công bố" → "Trạng thái":** đổi từ badge nhị phân `publishStatus` (Đã công bố/Chưa công bố) sang lấy đúng theo `item.approvalStatus` (đã có sẵn trong dữ liệu) với cùng bộ nhãn/màu như màn **Công bố dữ liệu mở** (`OpenDataPublishedListPage.tsx`): Đã công bố (xanh lá), Chờ công bố (tím), Từ chối (đỏ), Bản nháp (xám).
4. Đã build (`npx vite build`) và kiểm chứng trên trình duyệt: bảng hiển thị đúng "Cơ quan công bố"/"Ngày tạo"/"Trạng thái" (4 trạng thái) với dữ liệu đúng theo từng dòng; bộ lọc nâng cao hiển thị đúng nhãn "Ngày tạo".

**File bị ảnh hưởng:** `src/components/pages/open-data-category/components/tabs/OpenDataCategoryGrid.tsx`, `src/components/pages/open-data-category/components/OpenDataCategoryFilters.tsx`.

---

## Thêm chức năng Quản lý thông báo hệ thống (Ngày thực hiện: 22/07/2026)

**Màn hình mới:** Quản trị & vận hành → **Quản lý thông báo hệ thống** (`admin/SystemNotificationManagementPage.tsx`, route `/admin-notifications`).

1. **Danh sách:** STT, Tiêu đề, Nội dung, Ngày cập nhật (sắp xếp được), Thao tác (Sửa/Xóa) — theo đúng mẫu, bỏ 2 cột "Kiểu thông báo" và "Hoạt động" theo yêu cầu. Có ô tìm kiếm theo tiêu đề/nội dung, nút làm mới, nút sắp xếp, nút "+ Thêm mới", phân trang.
2. **Modal "Thêm mới thông báo hệ thống":** chỉ còn Tiêu đề + Nội dung (bắt buộc) — đã bỏ toggle "Gửi email" + danh sách người nhận email, khu vực "Tải lên tập tin", và toggle "Hoạt động" theo đúng yêu cầu; nút "Lưu" đổi thành **"Gửi"**.
3. **Nhấn "Gửi" → phát thông báo tới tất cả người dùng trên hệ thống**, thuộc loại **"Thông báo"** (`type: 'info'`) trong hệ thống thông báo dùng chung (chuông ở TopBar + màn "Quản lý thông báo"):
   - Bổ sung `broadcastSystemNotification(title, message)` và cơ chế subscribe (`subscribeToNotifications`) trong `src/data/notificationCatalog.ts` — thêm bản ghi vào `notificationCatalog` dùng chung và báo ngay cho `TopBar.tsx` + `NotificationPage.tsx` (đang mở) cập nhật, không cần tải lại trang.
4. Đã đăng ký route/menu mới: thêm mục "Quản lý thông báo hệ thống" vào nhóm "Quản trị & vận hành" trong `Sidebar.tsx` (menu điều hướng thật) và `menuStructure.ts` (khai báo quyền chức năng), cùng import/route/breadcrumb trong `MainLayout.tsx`.
5. Đã build (`npx vite build`) và kiểm chứng trên trình duyệt: danh sách hiển thị đúng mẫu, modal Thêm mới đúng các trường còn lại, bấm Gửi thấy thông báo mới xuất hiện ngay trong dropdown chuông TopBar và trong màn "Quản lý thông báo" mà không cần tải lại trang.

**File bị ảnh hưởng:** `src/components/pages/admin/SystemNotificationManagementPage.tsx` (mới), `src/data/notificationCatalog.ts`, `src/components/layout/TopBar.tsx`, `src/components/pages/NotificationPage.tsx`, `src/components/layout/Sidebar.tsx`, `src/components/pages/admin/menuStructure.ts`, `src/components/layout/MainLayout.tsx`.

---

## Đồng bộ danh sách + xem dữ liệu chỉ đọc — Khai thác báo cáo (Ngày thực hiện: 22/07/2026)

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → **Khai thác báo cáo** (`CategoryReportPage.tsx`), và màn dữ liệu dùng lại từ Biên tập danh mục (`CategoryPage.tsx`, `CategoryAListPage.tsx`).

1. **Danh sách danh mục đổi theo đúng cột của "Thiết lập danh mục"** (`SetupTab.tsx`): STT, Mã danh mục, Tên danh mục, Đơn vị chủ quản, Phạm vi, **Trường thuộc tính** (cột mới, thêm trước Trạng thái), Trạng thái, Thao tác — bỏ các cột Nguồn dữ liệu/Cấu trúc/Quan hệ/Phiên bản/Trạng thái công bố/Trạng thái phê duyệt/Ngày công bố cũ, gộp về 1 trạng thái vòng đời (dùng lại `lifecycleLabels`, `scopeLabels` từ `categoryConstants.ts` để đồng bộ nhãn/màu với "Thiết lập danh mục"). Bộ lọc cũng đổi tương ứng: Từ khóa, Trạng thái, Phạm vi, Đơn vị chủ quản.
2. **Cột Thao tác chỉ còn icon** (bỏ chữ "Xem chi tiết", chỉ giữ icon con mắt).
3. **Nhấn icon Xem chi tiết → mở màn dữ liệu của danh mục đó ở chế độ chỉ đọc** (tương tự tab Dữ liệu của Biên tập danh mục nhưng chỉ cho xem + tìm kiếm/lọc/sắp xếp):
   - Thêm prop `readOnly?: boolean` cho `CategoryPage`; `CategoryAListPage` đọc query param `mode=readonly` trên URL (`/category-list?category=...&mode=readonly`) để bật chế độ này.
   - Khi `readOnly`: **bỏ sidebar danh sách 7 danh mục** (chỉ hiển thị đúng 1 danh mục vừa chọn, có tiêu đề + **nút X để đóng, quay lại `/category-report`**); ẩn thanh tab (Dữ liệu/Phê duyệt/Công khai/Phiên bản — chỉ còn hiện dữ liệu); **giữ lại nút Lọc và Sắp xếp**, chỉ ẩn Gửi duyệt/Thêm bản ghi mới và checkbox chọn dòng; cột Thao tác của bảng bản ghi chỉ còn nút "Xem chi tiết" (bỏ Chỉnh sửa, Ngừng áp dụng).
4. Đã build (`npx vite build`) và kiểm chứng trên trình duyệt: danh sách hiển thị đúng 7 danh mục theo mẫu cột mới; nhấn Xem chi tiết mở đúng màn dữ liệu chỉ đọc (không sidebar, không tab, có Lọc/Sắp xếp hoạt động, không control chỉnh sửa); nút X đóng đưa đúng về `/category-report`.

**File bị ảnh hưởng:** `src/components/pages/category/CategoryReportPage.tsx`, `src/components/pages/category/CategoryPage.tsx`, `src/components/pages/category/CategoryAListPage.tsx`.

---

## Đổi cột lịch sử thay đổi + bỏ "Thêm mới phiên bản" — Báo cáo phiên bản danh mục (Ngày thực hiện: 22/07/2026)

**Màn hình:** Danh mục dùng chung → Thống kê danh mục → **Báo cáo phiên bản danh mục** (`reports/CategoryReportVersionPage.tsx`, modal `components/modals/EntityVersionHistoryModal.tsx`).

1. **Danh sách báo cáo:** bỏ 4 cột `Người tạo / Ngày tạo / Người cập nhật / Ngày cập nhật`, thay bằng `Ngày thay đổi / Ngày hiệu lực / Người thay đổi / Nội dung thay đổi` — cùng khái niệm với bảng "Lịch sử phiên bản" ở tab **Phiên bản** của chức năng Biên tập danh mục (`CategoryPage.tsx`). Bổ sung field `updatedBy?`, `changeDescription?` vào `MasterDataEntity` (`categoryTypes.ts`) để phục vụ 2 cột mới.
2. **Modal "Xem chi tiết" (Quản lý phiên bản danh mục):**
   - Bỏ hẳn khối "Danh sách lịch trình nâng cấp..." + nút "Thêm mới phiên bản" (không còn tạo/sửa/gửi duyệt phiên bản từ màn báo cáo này).
   - Đổi cột bảng lịch sử phiên bản của danh mục đang xem sang **đúng bộ cột như danh sách ngoài**: STT, Phiên bản, Ngày thay đổi, Ngày hiệu lực, Người thay đổi, Nội dung thay đổi, Thao tác (bỏ cột Loại thay đổi/Trạng thái, bỏ các nút Tạo bản nháp/Chỉnh sửa/Gửi duyệt).
   - Cột **Thao tác** chỉ còn 1 nút duy nhất: so sánh phiên bản đó với phiên bản liền trước (mở modal `EntityVersionDiffModal` có sẵn, hiển thị diff Cấu trúc/Thông tin chung/Quan hệ).
   - Cột **Phiên bản** trong bảng lịch sử chỉ hiển thị 1 badge phiên bản (vd. `v3.0`) thay vì cặp "phiên bản cũ → phiên bản mới", cùng kiểu badge với danh sách ngoài.
3. Đã build (`npx vite build`) và kiểm chứng trên trình duyệt: danh sách + modal hiển thị đúng cột mới, nút so sánh mở đúng diff v2.0 → v3.0 cho "Dữ liệu Danh mục giới tính".

**File bị ảnh hưởng:** `src/components/pages/category/reports/CategoryReportVersionPage.tsx`, `src/components/pages/category/components/modals/EntityVersionHistoryModal.tsx`, `src/components/pages/category/categoryTypes.ts`.

---

## Đồng bộ UI khối tìm kiếm & kết xuất — Thống kê danh mục (Ngày thực hiện: 22/07/2026)

**Màn hình:** Danh mục dùng chung → Thống kê danh mục (5 trang: `CategoryReportPage.tsx`, `reports/CategoryReportListPage.tsx`, `reports/CategoryReportExploitationPage.tsx`, `reports/CategoryReportStatusPage.tsx`, `reports/CategoryReportVersionPage.tsx`).

1. **Đồng bộ khối tìm kiếm/lọc + kết xuất theo "form chung"** (mẫu tham chiếu: khối lọc màn "Kiểm soát & giám sát cung cấp"): gộp về 1 khối bo góc `border-slate-200 rounded-xl`, các trường lọc xếp `flex-wrap items-end gap-3` (nhãn xám nhỏ phía trên, ô nhập/select bo `rounded-lg` bên dưới), nút hành động (Tìm kiếm/Truy xuất, Xuất báo cáo) nằm cùng hàng.
   - `Khai thác báo cáo`: bỏ nút "Tìm kiếm nâng cao" dạng ẩn/hiện — 4 bộ lọc (Phạm vi, Nguồn dữ liệu, Trạng thái công bố, Trạng thái phê duyệt) hiện luôn cùng ô từ khóa trong 1 khối; nút "Đặt lại" chỉ hiện khi có lọc đang áp dụng.
   - `Báo cáo thống kê danh sách danh mục` / `Báo cáo tình trạng khai thác danh mục` / `Báo cáo trạng thái danh mục`: giữ nguyên logic multi-select và biểu đồ, chỉ đổi khối bao ngoài từ `bg-slate-50 rounded-2xl p-6` (2 hàng, cột lọc + cột xuất tách riêng) sang khối trắng 1 hàng theo mẫu chung.
   - `Báo cáo phiên bản danh mục`: đổi ô tìm kiếm sang khối bo góc có nhãn "Từ khóa", nút tìm kiếm hiện thêm nhãn chữ.
2. **Bỏ khối tiêu đề (header) riêng của "Báo cáo phiên bản danh mục"** — xoá box "Báo cáo phiên bản danh mục" + mô tả phía trên khối tìm kiếm (tiêu đề trang đã có sẵn ở breadcrumb).
3. Đã build (`npx vite build`) và kiểm chứng trên trình duyệt cho cả 5 trang: khối lọc hiển thị đúng bố cục mới, các nút Tìm kiếm/Truy xuất/Xuất File hoạt động bình thường, trang phiên bản danh mục không còn header.

**File bị ảnh hưởng:** `src/components/pages/category/CategoryReportPage.tsx`, `src/components/pages/category/reports/CategoryReportListPage.tsx`, `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`, `src/components/pages/category/reports/CategoryReportStatusPage.tsx`, `src/components/pages/category/reports/CategoryReportVersionPage.tsx`.

---

## Cập nhật danh sách + modal Chi tiết thay đổi tab Phê duyệt — Biên tập danh mục (Ngày thực hiện: 22/07/2026)

**Màn hình:** Danh mục dùng chung → Biên tập & Công khai → Biên tập danh mục → tab **Phê duyệt** (`category/CategoryPage.tsx`).

1. **Đồng bộ layout danh sách với tab Dữ liệu:** đổi cột `Ngày tạo | Người tạo | Người cập nhật | Ngày cập nhật | Trạng thái` thành `Trạng thái dữ liệu | Trạng thái` (dùng lại `getDataStatusBadge` đã có ở tab Dữ liệu) — ẩn 4 cột ngày/người khỏi danh sách, đúng theo mẫu tab Dữ liệu.
2. **Nút "Xem chi tiết" (Chi tiết thay đổi) hiện đúng các trường đã chỉnh sửa thay vì 1 field giả cố định:** thêm hàm `buildRecordChanges(category)` tính diff theo từng trường dựa trên field mới `Category.previousValues` (snapshot Mã/Tên/Mô tả được lưu tại thời điểm chỉnh sửa — cả inline edit và edit qua `RecordFormModal`):
   - Bản ghi **Chỉnh sửa** (`dataStatus='edited'`) → chỉ liệt kê đúng (các) trường thực sự đổi, kèm giá trị cũ/mới thật (vd. INTERSEX: "Tên giá trị" Lưỡng giới → Liên giới tính).
   - Bản ghi **Thêm mới** (`dataStatus='new'`) → liệt kê đủ Mã/Tên giá trị/Mô tả với giá trị cũ = "—".
   - Bản ghi **Ngừng hiệu lực** (`dataStatus='inactive'`) → hiện riêng "Trạng thái áp dụng": Đang áp dụng → Ngừng áp dụng.
3. Đã kiểm chứng trên trình duyệt cho cả 3 trường hợp trên (INTERSEX/MALE/AGENDER) — modal "Chi tiết thay đổi" hiện đúng số trường và giá trị cũ/mới tương ứng.

**File bị ảnh hưởng:** `src/components/pages/category/CategoryPage.tsx`.

---

## Tinh chỉnh modal Chi tiết bản ghi — Biên tập danh mục (Ngày thực hiện: 21/07/2026)

**Màn hình:** Danh mục dùng chung → Biên tập & Công khai → Biên tập danh mục → tab Dữ liệu → modal "Chi tiết bản ghi" (`category/CategoryPage.tsx`).

1. **Đổi layout modal sang lưới 2 cột** (nhãn xám nhỏ phía trên, giá trị đậm phía dưới, có đường kẻ phân nhóm giữa Thông tin cơ bản / Trạng thái / Ngày tạo-cập nhật), nút "Đóng" xanh dương — theo đúng mẫu modal "Chi tiết bản ghi" tham chiếu.
2. **Bổ sung nội dung phê duyệt/từ chối** ngay dưới cặp badge Trạng thái dữ liệu/Trạng thái duyệt:
   - Trạng thái duyệt = **Từ chối** → hiện khối đỏ "Nội dung từ chối" (field mới `Category.rejectReason`).
   - Trạng thái duyệt = **Đã duyệt** → hiện khối xanh lá "Nội dung phê duyệt" (field mới `Category.approvalNote`).
   - Chưa duyệt/Chờ duyệt → không hiện khối này.
   - Nội dung được lưu tự động từ `approvalComment` (Phê duyệt/Từ chối đơn/hàng loạt ở tab Phê duyệt) và `bulkApprovalForm.note`.
3. Đã kiểm chứng trên trình duyệt: bản ghi Từ chối hiện đúng lý do, bản ghi Đã duyệt hiện đúng nội dung phê duyệt.

**File bị ảnh hưởng:** `src/components/pages/category/CategoryPage.tsx`.

---

## Cập nhật danh sách bản ghi tab Dữ liệu — Biên tập danh mục (Ngày thực hiện: 21/07/2026)

**Màn hình:** Danh mục dùng chung → Biên tập & Công khai → Biên tập danh mục → tab **Dữ liệu** (`category/CategoryPage.tsx`).

1. **Tách cột Trạng thái thành 2 cột độc lập:**
   - **Trạng thái dữ liệu** (`Category.dataStatus`, field mới): Thêm mới / Chỉnh sửa / Ngừng hiệu lực — cập nhật tự động khi thêm mới, chỉnh sửa (inline hoặc qua modal), hoặc gửi yêu cầu ngừng áp dụng.
   - **Trạng thái duyệt** (dùng lại field `status` sẵn có, đổi nhãn hiển thị riêng cho tab này qua `getRecordApprovalBadge`, không đổi `getStatusBadge` gốc để không ảnh hưởng tab Công khai/Phê duyệt): Chưa duyệt / Chờ duyệt / Đã duyệt / Từ chối.
   - Mọi thao tác Thêm mới/Chỉnh sửa (kể cả qua `RecordFormModal`) đặt `status='draft'` (Chưa duyệt) + `dataStatus` tương ứng. Tick chọn + "Gửi duyệt" chuyển `status='pending'` (Chờ duyệt) — giữ nguyên luồng `UpdateApprovalModal` đã có.
   - Ô checkbox "chọn để gửi duyệt" đầu dòng: chỉ hiện khi Trạng thái duyệt = Chưa duyệt (`status==='draft'`), ẩn với các trạng thái khác — logic này vốn đã đúng, chỉ đổi nhãn.
2. **Ẩn 4 cột** Ngày tạo / Người tạo / Ngày cập nhật / Người cập nhật khỏi danh sách (dữ liệu vẫn giữ trong bản ghi).
3. **Thêm nút "Xem chi tiết" (icon con mắt)** vào cột Thao tác — mở modal "Chi tiết bản ghi" hiển thị đầy đủ Mã/Tên/Mô tả/2 trạng thái/Ngày tạo/Người tạo/Ngày cập nhật/Người cập nhật, theo đúng mẫu giao diện modal "Chi tiết bản ghi" của màn Xem dữ liệu thu thập (`DataDetailModal.tsx`).
4. Đã kiểm chứng trên trình duyệt: danh sách hiển thị đúng 2 cột trạng thái mới, checkbox chỉ xuất hiện ở dòng Chưa duyệt, modal chi tiết hiện đủ 4 trường ẩn; tab Công khai/Phê duyệt (dùng chung dữ liệu `status`) không bị ảnh hưởng.
5. **Tinh chỉnh layout modal "Chi tiết bản ghi" theo mẫu do PM cung cấp**: chuyển từ danh sách ô viền xếp chồng sang **lưới 2 cột** (nhãn xám nhỏ phía trên, giá trị đậm phía dưới): Mã/Tên giá trị (2 cột) → Mô tả (full-width) → đường kẻ phân nhóm → Trạng thái dữ liệu/Trạng thái duyệt → đường kẻ → Ngày tạo/Người tạo/Ngày cập nhật/Người cập nhật (2×2); nút "Đóng" đổi sang nền xanh dương thay vì viền trắng.

**File bị ảnh hưởng:** `src/components/pages/category/CategoryPage.tsx`.

---

## Cập nhật Lịch sử triển khai & Đồng bộ mã nguồn Git (Ngày cập nhật: 21/07/2026)

**Nội dung thay đổi:**
1. **Lịch sử triển khai (`VersionHistoryModal.tsx` & `log_update.md`):**
   - Thêm bản ghi phiên bản mới **v2.6.17** (đầu danh sách, đánh dấu "Hiện tại") tổng hợp toàn bộ các thay đổi mới kéo về từ Git và hoàn tất merge xung đột:
     - **Tích hợp Git & Xử lý xung đột:** Đồng bộ thành công nhánh `upstream/main` (bao gồm các cập nhật tính năng mới từ nhánh `nhalt8/kdlbtp_v1.3`), giải quyết xung đột ở các file `AttributesManagementTab.tsx`, `MasterDataScaleManagementPage.tsx`, `log_update.md`.
     - **Hệ thống Thông báo (Notification System):** Re-design theo spec `Noti.xlsx`, hỗ trợ 4 loại (Thành công, Cảnh báo, Lỗi, Thông báo), dùng `notificationCatalog.ts` thống nhất cho TopBar và trang Quản lý thông báo.
     - **Phân hệ Dữ liệu chủ (Master Data):** Chuẩn hóa quy trình tạo/sửa đi qua Wizard 6 bước, khóa chế độ view-only cho 4 tab cấu hình phụ, bổ sung kiểm tra trùng mã/tên thực thể, lý do từ chối bắt buộc và nút Hủy phê duyệt.
     - **Phân hệ Cung cấp dữ liệu & Đối soát:** Cập nhật nhãn và 4 thẻ tổng quan đối soát dữ liệu, redesign bảng Lịch sử đối soát với `StatusTag` và bổ sung thẻ thống kê động theo tab tại màn Cung cấp dữ liệu theo yêu cầu.

**Các file bị ảnh hưởng:**
- `src/components/modals/VersionHistoryModal.tsx`
- `src/components/pages/master-data/AttributesManagementTab.tsx`
- `src/components/pages/master-data/MasterDataScaleManagementPage.tsx`
- `tailieu/docs/log/log_update.md`

---

## Cập nhật hệ thống Thông báo theo Noti.xlsx (Ngày thực hiện: 21/07/2026)

Thiết kế lại theo yêu cầu PM: thông báo chỉ gồm tiêu đề + nội dung, 3 loại (Thành công/Lỗi/Thông báo), KHÔNG phân theo mức độ ưu tiên; nội dung lấy từ danh sách `Noti.xlsx` (26 mẫu thông báo phủ các phân hệ: Quản lý thu thập, Xử lý dữ liệu, Danh mục dùng chung, Dữ liệu mở, Dữ liệu chủ, Cung cấp dữ liệu).

- **Tạo `src/data/notificationCatalog.ts`**: danh mục dùng chung cho cả dropdown và màn quản lý — `NotificationType = 'success' | 'error' | 'info'`, `NotificationItem { id, type, source, title, message, time, isRead }`.
- **`TopBar.tsx`** (dropdown chuông): bỏ loại `warning`; lấy 5 thông báo gần nhất từ catalog; nút "Xem tất cả thông báo" điều hướng sang màn Quản lý thông báo (thêm prop `onNavigate`, `MainLayout.tsx` truyền `setCurrentPage`).
- **`NotificationPage.tsx`** (màn "Quản lý thông báo", xem được **tất cả** thông báo hệ thống): dùng toàn bộ 26 mục trong catalog; bỏ hẳn field/badge `priority` (không còn "Ưu tiên cao"); 4 thẻ thống kê Tổng/Chưa đọc/Thành công/Lỗi; thêm bộ lọc theo **Loại** (Tất cả loại/Thành công/Lỗi/Thông báo) bên cạnh lọc trạng thái đọc; modal chi tiết hiển thị "Loại thông báo" thay cho "Mức độ ưu tiên".
- Đã kiểm chứng trên trình duyệt: dropdown hiển thị đúng 5 mục 3 loại, điều hướng "Xem tất cả" hoạt động, màn quản lý hiển thị đủ 26/26, lọc theo Loại đúng, modal chi tiết không còn ưu tiên.

**Tinh chỉnh theo góp ý PM (cùng ngày):**
- Bỏ dòng **"Nguồn: ..."** dưới mỗi thông báo trong danh sách (màn Quản lý thông báo).
- Bỏ **badge loại** (Thành công/Lỗi) ở cột phải mỗi dòng trong danh sách — chỉ giữ icon loại bên trái; badge vẫn hiển thị đầy đủ trong modal xem chi tiết ("Loại thông báo").
- Đổi toàn bộ `time` trong `notificationCatalog.ts` từ dạng tương đối ("5 phút trước", "Hôm qua"...) sang timestamp tuyệt đối **`dd/MM/yyyy HH:mm:ss`**, áp dụng đồng nhất cho cả dropdown chuông và màn quản lý (dùng chung 1 nguồn dữ liệu).

**Tinh chỉnh đợt 2 (cùng ngày):**
- Bỏ nút "Xem chi tiết" + modal chi tiết ở màn Quản lý thông báo (nội dung ngắn, hiển thị hết trên danh sách); dọn code thừa.
- **Nâng lên 4 loại thông báo**: thêm **Cảnh báo (warning)** cho trường hợp *bị từ chối phê duyệt* (tách khỏi "Lỗi" — vốn chỉ dành cho sự cố hệ thống). Cập nhật `Noti.xlsx` (các dòng "Từ chối" → Cảnh báo) và đồng bộ code: `notificationCatalog.ts` (type `warning` + 3 mẫu bị từ chối), `TopBar.tsx` (icon/nền amber), `NotificationPage.tsx` (thẻ thống kê + nút lọc "Cảnh báo", icon vàng cam).

**File bị ảnh hưởng:** `notificationCatalog.ts`, `TopBar.tsx`, `NotificationPage.tsx`, `MainLayout.tsx`; spec `Noti.xlsx`.

---

## Cập nhật quy trình Thêm/Sửa & phân quyền view-only Mô hình dữ liệu chủ (Ngày thực hiện: 21/07/2026)

Theo yêu cầu PM: bỏ luồng "Thêm mới nhanh", chỉnh sửa thực thể phải đi qua Wizard từng bước (như tạo mới), và 4 tab cấu hình phụ chỉ được xem trong màn Mô hình dữ liệu chủ.

- **Bỏ "Thêm mới nhanh"** (`MasterDataScaleManagementPage.tsx`): gỡ nút và luồng form đơn giản; chỉ còn nút **"Tạo mới"** mở Wizard 6 bước.
- **Chỉnh sửa mở lại Wizard từng bước**:
  - `MasterDataWizard.tsx`: thêm prop `initialData` (export `WizardData`) — khi có giá trị, Wizard seed dữ liệu Bước 1 từ thực thể đang sửa, luôn mở lại từ bước 1 và cho đi tuần tự qua các bước để chỉnh sửa (dùng `useEffect` theo `isOpen`).
  - `handleEdit()` gọi `setEditingEntity(entity)` + `setShowWizard(true)` (không còn mở form riêng).
  - `onSubmit` của Wizard phân nhánh: **tạo mới** → thêm entity; **chỉnh sửa** → cập nhật đúng entity đang sửa (giữ nguyên mã, ngày tạo, người tạo).
- **4 tab chỉ xem (view-only)** trong khu vực Mô hình dữ liệu chủ: `AttributesManagementTab`, `MergeRulesManagementTab`, `EntityRelationshipsTab`, `UniqueIdentifierRulesTab` nhận prop `readOnly`; khi bật, ẩn nút "Thêm...", ẩn nút Sửa/Xóa (thay bằng "—"). `MasterDataScaleManagementPage` truyền `readOnly` cho cả 4 tab.
- Build production (`vite build`) qua, không lỗi.

**File bị ảnh hưởng:** `MasterDataWizard.tsx`, `MasterDataScaleManagementPage.tsx`, `AttributesManagementTab.tsx`, `MergeRulesManagementTab.tsx`, `EntityRelationshipsTab.tsx`, `UniqueIdentifierRulesTab.tsx`.

---

## Cập nhật Dữ liệu chủ theo UC (Ngày thực hiện: 17/07/2026)

Rà soát UI phân hệ Dữ liệu chủ theo `Usecae_DuLieuChu.xlsx` (UC485–498) và xử lý các gap ưu tiên:
- **UC488** (`master-data/EntityRelationshipsTab.tsx`): bỏ filter loại trừ `one-to-many` → tạo được quan hệ **1-n** ở form standalone (trước đó chỉ có 1-1 và n-n).
- **UC485** (`master-data/MasterDataScaleManagementPage.tsx`): form "Thêm nhanh" nay **kiểm tra trùng Mã và Tên thực thể** (bỏ qua chính bản ghi khi sửa), chặn lưu nếu trùng.
- **UC492** (`master-data/MasterDataUpdateItemPage.tsx`): **Từ chối phê duyệt bắt buộc nhập lý do** (modal, áp dụng cho từ chối đơn & hàng loạt; lưu `rejectReason`); nút **Xem chi tiết** (Eye) mở modal xem đầy đủ trường + trạng thái + lý do từ chối.
- **UC493** (cùng file): thêm thao tác **Hủy phê duyệt** cho bản ghi đã duyệt → chuyển về "Chờ phê duyệt", ghi log & thông báo.

**Còn lại (đề xuất làm tiếp):** UC487 (tab kiểm thử hợp nhất + trọng số/ưu tiên theo nguồn ở tab standalone), UC488 (sơ đồ ERD), UC490 (drill-down cấu trúc trong modal duyệt), UC494 (so sánh phiên bản + xuất báo cáo lịch sử), UC495 (xóa mềm/khôi phục), UC496 (quản lý phiên bản) — phần lớn nằm ở component "mồ côi" chưa được route.

**File bị ảnh hưởng:** `EntityRelationshipsTab.tsx`, `MasterDataScaleManagementPage.tsx`, `MasterDataUpdateItemPage.tsx`.

>>>>>>> d0d4b0c898b5cf43e3568a8815a60624cbbd3882
## Cập nhật giao diện (Ngày thực hiện: 15/07/2026)

**Màn hình:** Cung cấp dữ liệu → Quy trình đối soát dữ liệu → Chi tiết đối soát (`ProvisionReconciliationPage`, UC-664 và các tiến trình khác).

**Nội dung thay đổi — Điều chỉnh nhãn & cấu trúc theo yêu cầu PM:**
1. **4 thẻ tổng quan** (`DataReconciliationPage.tsx`): đổi tên và *điều chỉnh giá trị cho đúng ngữ nghĩa*:
   - "Tổng số lần chạy" → **"Tổng Dữ liệu đối soát"** (= số dòng trong danh sách lịch sử đối soát).
   - "Thành công" → **"Khớp dữ liệu"** (= **số dòng** trạng thái Khớp dữ liệu).
   - "Cảnh báo chênh lệch" → **"Không khớp"** (= **số dòng** trạng thái Không khớp).
   - "Lần chạy gần nhất" → **"Tỷ lệ khớp"** (= số dòng khớp / tổng số dòng).
   - Đổi icon tương ứng (Database, Percent) và thêm helper tổng hợp `totalSentAll/totalMatchedAll/totalDiscrepanciesAll/overallMatchRate`.
2. **Bảng "Lịch sử đối soát"**: "Tổng số gửi đi" → **"Số bản ghi cung cấp"**; "Khớp nối" → **"Số bản ghi nhận"**; giá trị cột **Trạng thái** đổi thành **"Chưa đối soát" / "Khớp dữ liệu" / "Không khớp"** (helper `getReconStatus`, cập nhật `getStatusIcon/getStatusClass`).
3. **Modal "Chi tiết kết quả đối soát"** (`ProvisionReconciliationDetailsModal.tsx`): "Số bản ghi đã gửi" → **"Số bản ghi cung cấp"**; "Số bản ghi khớp nối" → **"Số bản ghi nhận"**.
4. **Modal "Lịch sử đối soát dữ liệu cung cấp"** (`ProvisionReconciliationHistoryModal.tsx`): **bỏ** cột "Tiến trình đối soát", "Hành động", "Dung lượng đã gửi"; "Hệ thống đích" → **"Đơn vị khai thác"**; "Số bản ghi đã gửi" → **"Số bản ghi cung cấp"**; **bổ sung** cột "Số bản ghi nhận", "Chênh lệch"; cột "Trạng thái" dùng giá trị mới (Khớp dữ liệu/Không khớp/Chưa đối soát). Dọn helper `getDungLuong` và import không dùng.
5. **Bố cục trang theo form "Đối soát thu thập"** (`DataReconciliationPage.tsx`):
   - **Bỏ toàn bộ khối header** (badge UC, tag nhóm, tiêu đề tiến trình, dòng Hệ thống đích / Lịch trình).
   - **Thêm tab bar "Danh sách đối soát"** (icon List, gạch chân xanh) ở đầu trang; bỏ tiêu đề "Lịch sử đối soát".
   - **Tái cấu trúc bảng**: thêm cột **STT**; giữ 2 cột riêng **Tên tiến trình đối soát** + **Tên API**; **bỏ** cột "Loại chạy"; "Thời gian chạy gần nhất" → **"Ngày đối soát"** (tách ngày/giờ 2 dòng); "Chi tiết" → **"Thao tác"** (nút Xem chi tiết + Xem lịch sử).
   - Ô tìm kiếm: placeholder "Tìm theo lịch sử..." → **"Tìm theo tên tiến trình..."**.
   - **Bỏ nút "Thiết lập lại"** trong bảng lọc nâng cao (lưới còn 3 cột: Từ ngày / Đến ngày / Trạng thái); gỡ hàm `handleResetFilters` không còn dùng.
6. **Dữ liệu mẫu** (`provisionReconciliationData.ts`): mỗi tiến trình chưa có lịch sử riêng nay sinh **5 dòng** phủ đủ tình trạng: Khớp dữ liệu, Không khớp (cảnh báo/lỗi), Chưa đối soát.
7. **Đồng bộ giao diện trạng thái theo form "Đối soát thu thập"**:
   - **Cột Trạng thái** (bảng list, `DataReconciliationPage.tsx`) dùng `StatusTag`: **Khớp dữ liệu** (xanh lá) / **Không khớp** (đỏ) / **Chưa đối soát** (xanh dương) — dạng chữ màu, bỏ icon & viền; gỡ helper `getStatusIcon/getStatusClass`.
   - **Modal chi tiết** (`ProvisionReconciliationDetailsModal.tsx`): card "Chênh lệch" → **"Sai lệch"** (nhãn phụ Chênh lệch/Trùng khớp, màu đỏ/xanh theo lệch); thanh **Tỷ lệ khớp** + nút trạng thái 3 màu (xanh lá Khớp / đỏ Không khớp / xanh dương Chưa đối soát); "Thời gian chạy" → **"Ngày gọi"** (— khi chưa đối soát).
   - **Modal lịch sử** (`ProvisionReconciliationHistoryModal.tsx`): cột Trạng thái cũng dùng `StatusTag` đồng bộ với danh sách (Khớp dữ liệu xanh lá / Không khớp đỏ / Chưa đối soát xanh dương); gỡ helper `getStatusClass` thừa.

8. **Cung cấp dữ liệu theo yêu cầu** (`DataProvisionRequestPage.tsx`): thay khối mô tả tiêu đề ("Cung cấp dữ liệu theo yêu cầu / Tiếp nhận, tra cứu...") bằng **hàng 4 thẻ thống kê** đổi theo từng tab:
   - *Tiếp nhận yêu cầu*: Tổng yêu cầu / Chờ xử lý / Đã phê duyệt / Từ chối.
   - *Tra cứu & Kết xuất*: Chờ tiếp nhận / Đã phê duyệt / Đã kết xuất / Tổng trong luồng.
   - *Bàn giao dữ liệu*: Chờ bàn giao / Đã bàn giao / Đã công khai / Đã hủy công khai.
   - Số liệu đếm động theo trạng thái yêu cầu; số liệu render bằng `<h3>` để không bị CSS ép 13px.

9. **Xử lý dữ liệu → tab Chuẩn hóa → "Xử lý vi phạm về ràng buộc thuộc tính tham chiếu"** (`processing/GenericProcessingPage.tsx`):
   - Chuyển UI mỗi quy tắc từ 1 hàng flex sang **lưới 3 cột**; nút Sửa/Xóa đưa lên góc phải trên card.
   - **Thêm ô "Chọn CSDL tham chiếu"** (sau Trường áp dụng) — droplist CSDL; **Bảng tham chiếu load động theo CSDL** đã chọn (cascade), Trường tham chiếu khóa tới khi chọn Bảng. Đổi CSDL reset Bảng+Trường; đổi Bảng reset Trường.
   - **Thêm ô "Giá trị mặc định"**. State bổ sung `csdl`, `defaultValue`.

**Các file bị ảnh hưởng:**
- `src/components/pages/processing/GenericProcessingPage.tsx`
- `src/components/pages/provisioning/DataReconciliationPage.tsx`
- `src/components/pages/provisioning/modals/ProvisionReconciliationDetailsModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionReconciliationHistoryModal.tsx`
- `src/components/pages/provisioning/DataProvisionRequestPage.tsx`
- `src/data/provisionReconciliationData.ts`

**Kiểm thử:** Đăng nhập, mở UC-664, xác nhận trực quan 4 thẻ, bảng lịch sử, modal chi tiết và modal lịch sử đều hiển thị đúng nhãn/cột/giá trị mới. Dev server (`npm run dev`) biên dịch không lỗi.

---
## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Modal "Xem chi tiết thực thể": bỏ Nguồn dữ liệu/Bảng dữ liệu, thêm trình duyệt/phê duyệt

**Nội dung thay đổi — Trang "Thiết lập thực thể" (`master-data/MasterDataScaleManagementPage.tsx`)**:
- Modal "Xem chi tiết thực thể dữ liệu chủ": **bỏ** 2 trường "Nguồn dữ liệu" và "Bảng dữ liệu (DLDC)".
- Thêm 3 nội dung giống modal "Chi tiết danh mục dùng chung" (`CategoryInfoViewModal.tsx`): **"Nội dung trình duyệt"** (nội dung khi gửi trình duyệt), và khối kết quả phê duyệt hiển thị **"Ý kiến phê duyệt"** hoặc **"Lý do từ chối"** tùy trạng thái — tái dùng component `ReviewResultCard` (import từ `category/components/modals/ReviewResultCard`) để đồng bộ giao diện.
- Thêm field mới vào `MasterDataEntity`: `requestStatus?: 'pending'|'approved'|'rejected'`, `submissionContent?: string`, `reviewComment?: string`.
- `handleConfirmApprove` (nút "Gửi trình duyệt") nay lưu `submissionContent` (nội dung yêu cầu) và đánh dấu `requestStatus: 'approved'`.
- **Không** thêm nút/luồng "Từ chối" mới (theo yêu cầu) — dữ liệu "Lý do từ chối" chỉ hiển thị khi đã có sẵn trong dữ liệu (mock): thêm ví dụ minh họa 1 thực thể `requestStatus: 'approved'` (Công dân) và 1 thực thể `requestStatus: 'rejected'` (Cơ quan nhà nước).
- Gỡ hàm `getDataSourceLabel` không còn dùng.
- Đã build (`npm run build`) và type-check thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataScaleManagementPage.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Đồng bộ trường "Xem chi tiết" & "Thêm mới nhanh" theo Bước 1 Wizard

**Nội dung thay đổi — Trang "Thiết lập thực thể" (`master-data/MasterDataScaleManagementPage.tsx`)**:
- Thêm interface `EntitySource` (id/name/kind/grain) + hằng số `ENTITY_SOURCE_OPTIONS`/`SOURCE_KIND_LABELS`/`SOURCE_KIND_COLORS`/`SOURCE_GRAIN_COLORS`, thêm field `sources?: EntitySource[]` vào `MasterDataEntity` — tương ứng khối "Đăng ký nguồn dữ liệu" (chip nhiều nguồn + loại/độ mịn) ở Bước 1 Wizard.
- **Modal "Thêm mới nhanh" / "Chỉnh sửa thực thể"**: sắp xếp lại đúng thứ tự Bước 1 Wizard — Mã thực thể → Tên dữ liệu chủ → Đơn vị chủ quản → Tên cơ sở dữ liệu/Hệ thống → Loại thực thể + Phạm vi (cạnh nhau) → Mô tả đối tượng → Trạng thái vòng đời → **Đăng ký nguồn dữ liệu** (mới, dạng chip + form thêm nguồn inline) → Cấu hình nguồn dữ liệu (chỉ còn select Nguồn dữ liệu + banner thông báo, bỏ hẳn "Bảng dữ liệu"/"Cột dữ liệu" chọn tay và khối "Chiến lược cập nhật" — vì Bước 1 Wizard hiện tại không còn các phần này, đã chuyển sang Bước 2/3).
- **Modal "Xem chi tiết thực thể dữ liệu chủ"**: sắp xếp lại theo cùng thứ tự trên; thêm hiển thị danh sách "Đăng ký nguồn dữ liệu" dạng chip.
- Tiện sửa 2 lỗi dữ liệu có từ trước: `handleSubmit` (tạo mới qua form nhanh) trước đây **không lưu** `dataSource` đã chọn; `onSubmit` của Wizard 6 bước trước đây **không lưu** `systemName` — nay cả hai đã được lưu đầy đủ.
- Thêm dữ liệu mẫu `sources` cho thực thể "Bộ dữ liệu chủ Công dân" (Hộ tịch, CCCD) để minh họa hiển thị.
- Đã build (`npm run build`) và type-check thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataScaleManagementPage.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Đồng bộ combobox chọn thực thể ở Quy tắc hợp nhất & Định danh duy nhất

**Nội dung thay đổi — Trang "Thiết lập Master Data" (`master-data/MergeRulesManagementTab.tsx`, `master-data/UniqueIdentifierRulesTab.tsx`)**:
- Đồng bộ danh sách `mockEntities` (thực thể dữ liệu chủ) trong 2 tab này khớp với tab "Quản lý thuộc tính dữ liệu chủ" (`AttributesManagementTab.tsx`) — cả 3 tab nay cùng hiển thị đủ 5 thực thể: MD-CITIZEN-001, MD-ORG-001, MD-DOC-001, **MD-ADMIN-001** (Đơn vị hành chính), **MD-AGENCY-001** (Cơ quan nhà nước). Trước đó `MergeRulesManagementTab` chỉ có 3 thực thể, `UniqueIdentifierRulesTab` có 2 thực thể lệch tên/mã (MD-AUTH-001, MD-ADDR-001) so với tab thuộc tính.
- Đổi ô "Xem theo thực thể dữ liệu chủ" ở cả 2 tab từ `<select>` thường sang **combobox có ô tìm kiếm theo mã hoặc tên** (đóng khi click ra ngoài, dấu check thực thể đang chọn) — cùng UI/UX với tab "Quản lý thuộc tính dữ liệu chủ".
- Đã build (`npm run build`) thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MergeRulesManagementTab.tsx`
- `src/components/pages/master-data/UniqueIdentifierRulesTab.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Bước 4, đổi 2 khối chọn ở tab "Kiểm thử" sang dropdown

**Nội dung thay đổi — Wizard "Tạo mới dữ liệu chủ" (Bước 4 — tab Kiểm thử)** (`master-data/MasterDataWizard.tsx`):
- Đổi 2 khối thẻ chọn "Giới hạn số lượng bản ghi" và "Chiến lược lấy mẫu" (thêm ở mục ngay dưới) từ dạng thẻ (card) sang dạng **dropdown** (`<select>`), xếp cạnh nhau 2 cột.
- Mỗi dropdown hiển thị **ghi chú/mô tả ngay dưới giá trị đang chọn** (mô tả "dùng khi nào" cho mức số lượng; mô tả cách lấy mẫu cho chiến lược).
- Dropdown "Khoảng thời gian lấy mẫu" (chỉ hiện khi chọn chiến lược "Lấy theo khoảng thời gian") vẫn giữ nguyên, đặt trong khối "Chiến lược lấy mẫu".
- Đã build (`npm run build`) thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Bước 4, thiết kế lại luồng tab "Kiểm thử"

**Nội dung thay đổi — Wizard "Tạo mới dữ liệu chủ" (Bước 4 — tab Kiểm thử)** (`master-data/MasterDataWizard.tsx`):
- Bỏ dropdown "Chọn dữ liệu mẫu" cố định (`WIZARD_MOCK_SAMPLES`) — thay bằng luồng 2 bước trước khi chạy thử:
  1. **Giới hạn số lượng bản ghi** — 3 mức chọn dạng thẻ: Nhanh (100 — kiểm tra logic cơ bản), Tiêu chuẩn (500 — kiểm tra tỷ lệ khớp), Toàn diện (2.000 — kiểm tra trước khi lưu chính thức) (`TEST_SIZE_TIERS`, state `testSizeTier`).
  2. **Chiến lược lấy mẫu** — 3 lựa chọn dạng thẻ: Lấy ngẫu nhiên, Lấy có chủ đích (bản ghi khả năng trùng cao), Lấy theo khoảng thời gian (kèm dropdown chọn khoảng thời gian: 30/90/180 ngày gần nhất) (`SAMPLING_STRATEGIES`, `TEST_TIME_RANGE_OPTIONS`, state `samplingStrategy`/`testTimeRange`).
- Nút "Chạy mô phỏng" chỉ bật khi đã chọn **cả 2** mục trên (`canRunTest`); chọn lại bất kỳ mục nào sẽ reset kết quả kiểm thử cũ (`testRun` về `false`).
- Khối kết quả (4 thẻ số liệu + bảng "Nghi ngờ cần xem lại") giữ nguyên như trước — vẫn là số liệu mock tĩnh, minh họa giao diện.
- Đã build (`npm run build`) thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Bước 4, bỏ bắt buộc khai báo hard-block

**Nội dung thay đổi — Wizard "Tạo mới dữ liệu chủ" (Bước 4 — validate `handleNext`)** (`master-data/MasterDataWizard.tsx`):
- Bỏ check chặn "Tiếp theo" khi chưa khai báo trường hard-block (`mergeConfig.hardBlockFields.length < 1`) — người dùng có thể qua bước tiếp theo mà không cần khai báo hard-block.
- Đã build (`npm run build`) thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Bước 4, đổi tên tiêu đề cột tab "Hợp nhất giá trị"

**Nội dung thay đổi — Wizard "Tạo mới dữ liệu chủ" (Bước 4 — Quy tắc hợp nhất, tab Hợp nhất giá trị)** (`master-data/MasterDataWizard.tsx`):
- Đổi tiêu đề cột "Xử lý null" → **"Xử lý rỗng"** (bỏ từ tiếng Anh "null").
- Đổi tiêu đề cột "Khi hết vẫn trống" → **"Xử lý khi vẫn trống"**.
- Đã build (`npm run build`) thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Bước 4, bỏ icon tooltip cạnh dropdown "Thuật toán"

**Nội dung thay đổi — Wizard "Tạo mới dữ liệu chủ" (Bước 4 — Quy tắc hợp nhất, tab So khớp)** (`master-data/MasterDataWizard.tsx`):
- Theo yêu cầu, bỏ hẳn icon chấm than vòng tròn + tooltip cạnh dropdown "Thuật toán" (đã thêm ở mục ngay trên). Chỉ giữ lại nhãn tiếng Việt đã rút gọn (không tên tiếng Anh).
- Gỡ hằng số `FUZZY_ALGORITHM_DESCRIPTIONS` không còn dùng.
- Đã build (`npm run build`) thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Bước 4, cột "Thuật toán" trong Quy tắc so khớp

**Nội dung thay đổi — Wizard "Tạo mới dữ liệu chủ" (Bước 4 — Quy tắc hợp nhất, tab So khớp)** (`master-data/MasterDataWizard.tsx`):
- Nhãn các giá trị dropdown "Thuật toán" (`FUZZY_ALGORITHMS`) bỏ tên tiếng Anh: "Jaro-Winkler (tương đồng chuỗi)" → "Tương đồng chuỗi", "Levenshtein (khoảng cách chỉnh sửa)" → "Khoảng cách chỉnh sửa", "Ngữ âm (phiên âm tên)" → "Phiên âm tên".
- Thêm icon chấm than vòng tròn (`AlertCircle`) **cạnh dropdown "Thuật toán" ở từng dòng** (không phải ở tiêu đề cột) — hover vào hiện tooltip giải thích đúng theo **giá trị đang chọn** của dropdown đó (`FUZZY_ALGORITHM_DESCRIPTIONS[rule.algorithm]`).
- Đã build (`npm run build`) thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Bước 3, hoàn tác lọc kiểu dữ liệu ở "Cột mốc thời gian"

**Nội dung thay đổi — Wizard "Tạo mới dữ liệu chủ" (Bước 3 — khối "Gom nguồn 1:n")** (`master-data/MasterDataWizard.tsx`):
- Theo yêu cầu, hoàn tác thay đổi ở mục ngay trên (lọc theo kiểu date/datetime) — dropdown "Cột mốc thời gian" trở lại hiển thị **tất cả** trường đã chia sẻ của nguồn đó, không kiểm tra kiểu dữ liệu nữa.
- Gỡ biến `timeFieldsForSource` không còn dùng.
- Đã build (`npm run build`) thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Bước 3, "Cột mốc thời gian" chỉ cho chọn trường kiểu thời gian

**Nội dung thay đổi — Wizard "Tạo mới dữ liệu chủ" (Bước 3 — khối "Gom nguồn 1:n")** (`master-data/MasterDataWizard.tsx`):
- Dropdown "Cột mốc thời gian" trước đây cho chọn tất cả trường đã chia sẻ của nguồn (kể cả trường kiểu chuỗi như "Loại hình") — nay lọc lại chỉ hiển thị các trường có kiểu dữ liệu **Ngày (date)** hoặc **Ngày giờ (datetime)** (`timeFieldsForSource`).
- Đã build (`npm run build`) thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Bước 3, lưu "Chọn trường dữ liệu chia sẻ" riêng theo từng nguồn

**Nội dung thay đổi — Wizard "Tạo mới dữ liệu chủ" (Bước 3 — chế độ "Chọn trường từ Kho DLDC")** (`master-data/MasterDataWizard.tsx`):
- Trước đây `dldcFieldRows` là 1 state duy nhất — mỗi lần bấm chip chọn nguồn khác ở "Nguồn dữ liệu chính" sẽ **ghi đè mất** lựa chọn trường của nguồn đang xem trước đó. Nay đổi sang lưu theo `Record<sourceId, DldcFieldRow[]>` (`dldcFieldRowsBySource` + `activeSourceId`) — mỗi nguồn giữ riêng lựa chọn "Chia sẻ" của nó, chuyển qua lại giữa các nguồn không làm mất dữ liệu đã chọn.
- Bảng **"Ánh xạ cột nguồn → thuộc tính"** (qua `availableFields`/`sourceEntityFields`) nay gộp trường đã chọn ("Chia sẻ") từ **tất cả nguồn** đã cấu hình (không chỉ nguồn đang xem), khử trùng theo tên trường (`allSharedDldcFields`) — danh sách thuộc tính ổn định, không đổi khi chuyển qua xem nguồn khác.
- Bảng **"Gom nguồn 1:n"**: mỗi nguồn 1:n lấy trực tiếp trường đã chọn theo `dldcFieldRowsBySource[src.id]` — hiển thị đúng trường của bảng 1:n tương ứng theo từng nguồn.
- `handleRemoveSource` (Bước 1) dọn thêm dữ liệu `dldcFieldRowsBySource` của nguồn bị xóa; nếu nguồn đang xem bị xóa thì reset `activeSourceId`/`dldcDatabase`.
- Đã build (`npm run build`) thành công, không lỗi. (TS báo 1 lỗi type có từ trước ở dòng review Bước 6 so sánh `dataSource === 'api'`, không liên quan tới thay đổi lần này.)

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Bước 3, bỏ "Sử dụng liên kết bảng (Join)"

**Nội dung thay đổi — Wizard "Tạo mới dữ liệu chủ" (Bước 3 — chế độ "Chọn trường từ Kho DLDC")** (`master-data/MasterDataWizard.tsx`):
- Bỏ toggle **"Sử dụng liên kết bảng (Join)"** ở header khối "Cấu hình nguồn dữ liệu" và toàn bộ khối "Bảng liên kết bổ sung" (thêm/xóa bảng join, chọn kiểu JOIN, chọn điều kiện liên kết) — nguồn dữ liệu ở chế độ Kho DLDC nay chỉ còn 1 bảng chính duy nhất (theo nguồn đã chọn ở khối "Nguồn dữ liệu chính").
- Gỡ state `useJoin`, `dldcJoins` và các handler `handleDldcAddJoin`, `handleDldcJoinTableChange`, `handleDldcRemoveJoin`; gỡ interface `DldcJoin`; gỡ field `sourceJoinId` khỏi `DldcFieldRow` (không còn ý nghĩa khi không có join).
- `availableSources` (dùng cho Bước 4) bỏ nhánh gộp danh sách bảng join, chỉ còn bảng chính.
- Đã build (`npm run build`) thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Bước 3, ẩn "Gom nguồn 1:n" ở chế độ nhập thủ công

**Nội dung thay đổi — Wizard "Tạo mới dữ liệu chủ" (Bước 3)** (`master-data/MasterDataWizard.tsx`):
- Khối "Gom nguồn 1:n" trước đây hiển thị bất kể chế độ tạo thuộc tính, nay chỉ hiển thị khi đang ở chế độ **"Chọn trường từ Kho DLDC"** (`wizardData.dataSource === 'dldc'`) — ẩn hoàn toàn khi ở chế độ **"Tự thêm mới từng trường"** (manual), vì chế độ nhập tay không có khái niệm nhiều bản ghi nguồn cần gom.
- Đơn giản hóa `fieldsForSource` (bỏ nhánh fallback `availableFields` cho manual mode, nay không còn được gọi tới trong nhánh này).
- Đã build (`npm run build`) thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Bước 3, mục Gom nguồn 1:n

**Nội dung thay đổi — Wizard "Tạo mới dữ liệu chủ" (Bước 3 — khối "Gom nguồn 1:n")** (`master-data/MasterDataWizard.tsx`):
- Trước đây, với mỗi nguồn 1:n, bảng quy tắc gom hiển thị **toàn bộ** `availableFields` (tất cả trường đã chọn ở "Chọn trường dữ liệu chia sẻ", gồm cả trường của bảng khác/nguồn khác) — nay lọc lại chỉ hiển thị các trường thuộc **đúng bảng của nguồn 1:n đó** (ánh xạ qua `SOURCE_NAME_TO_DLDC_TABLE`, so khớp `tableId` trong `dldcFieldRows`).
- Cột "Cột mốc thời gian" cũng đổi theo: chỉ chọn trong các trường của chính bảng đó (thay vì danh sách mock `MOCK_SOURCE_COLUMNS` không liên quan).
- Nếu nguồn 1:n chưa có trường nào được chọn "Chia sẻ" ở bảng của nó → hiển thị thông báo hướng dẫn quay lại bảng "Chọn trường dữ liệu chia sẻ".
- Gỡ hằng số `MOCK_SOURCE_COLUMNS` (không còn nơi nào dùng).
- Đã build (`npm run build`) thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Bước 3, mục Ánh xạ cột nguồn → thuộc tính

**Nội dung thay đổi — Wizard "Tạo mới dữ liệu chủ" (Bước 3 — khối "Ánh xạ cột nguồn → thuộc tính")** (`master-data/MasterDataWizard.tsx`):
- Dropdown chọn cột nguồn cho từng ô ánh xạ (thuộc tính × nguồn) trước đây dùng danh sách mock cố định `MOCK_SOURCE_COLUMNS` (không liên quan dữ liệu thật) — nay đổi sang hiển thị đúng danh sách các trường đã chọn ("Chia sẻ") ở bảng "Chọn trường dữ liệu chia sẻ" (gồm cả bảng chính và các bảng liên kết/Join) thông qua `availableFields`.
- `MOCK_SOURCE_COLUMNS` sau đó bị gỡ bỏ hoàn toàn ở lần cập nhật kế tiếp (xem mục "Bước 3, mục Gom nguồn 1:n" bên trên).
- Đã build (`npm run build`) thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026) — Bước 3, mục Cấu hình nguồn dữ liệu

**Nội dung thay đổi — Wizard "Tạo mới dữ liệu chủ" (Bước 3 — Tạo thuộc tính, chế độ "Chọn trường từ Kho DLDC")** (`master-data/MasterDataWizard.tsx`):
- Bỏ 2 dropdown **"Cơ sở dữ liệu"** và **"Bảng dữ liệu chính"** (không cho người dùng chọn tự do CSDL/bảng ở bước này nữa).
- Thay bằng danh sách **"Nguồn dữ liệu chính"** dạng chip, liệt kê trực tiếp các nguồn đã đăng ký ở Bước 1 (mục "Đăng ký nguồn dữ liệu") — người dùng bấm chọn 1 nguồn để nạp bảng trường tương ứng.
- Thêm bảng ánh xạ `SOURCE_NAME_TO_DLDC_TABLE` (tên nguồn Bước 1 → CSDL + bảng chính tương ứng trong Kho DLDC) và handler `handleSelectRegisteredSource` để tự nạp `dldcDatabase`/`dldcTable`/danh sách trường khi chọn nguồn.
- Gỡ 2 handler cũ không còn dùng: `handleDldcDatabaseChange`, `handleDldcTableChange`.
- Giữ nguyên bảng "Chọn trường dữ liệu chia sẻ" và khối "Bảng liên kết bổ sung (Join)" — cả hai vẫn hoạt động dựa trên `dldcDatabase`/`dldcTable` được nạp tự động từ nguồn đã chọn.
- Nếu Bước 1 chưa đăng ký nguồn nào, hiển thị cảnh báo yêu cầu quay lại Bước 1.
- Đã build (`npm run build`) thành công, không lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Cập nhật giao diện (Ngày thực hiện: 09/07/2026)

**Nội dung thay đổi — Wizard "Tạo mới dữ liệu chủ" (Bước 1)** (`master-data/MasterDataWizard.tsx`):
- Sắp xếp lại thứ tự trường: **Đơn vị chủ quản** và **Tên cơ sở dữ liệu / Hệ thống** chuyển lên ngay dưới trường **Tên dữ liệu chủ** (trước đây nằm sau khối Loại thực thể/Phạm vi và Mô tả đối tượng).
- Thứ tự mới: Tên dữ liệu chủ → Đơn vị chủ quản → Tên cơ sở dữ liệu/Hệ thống → Loại thực thể + Phạm vi sử dụng → Mô tả đối tượng.
- Không thay đổi logic, chỉ đổi vị trí hiển thị (thuần JSX reorder).

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Cập nhật Git (Ngày thực hiện: 08/07/2026)

**Nội dung thực hiện:**
- Kéo mã nguồn mới từ nhánh `nhalt8/kdlbtp_v1.3` (`upstream/nhalt8/kdlbtp_v1.3`) và `nhalt8/kdlbtp_v1.2` (`upstream/nhalt8/kdlbtp_v1.2`) về máy thành công.
- Đã giải quyết xung đột (conflict) trong package.json và file nhật ký.
- Đã chạy `npm install` và `npm run build` kiểm tra đóng gói hệ thống thành công (không có lỗi TypeScript hay build).

---

## Phiên bản 2.6.15 (Ngày cập nhật: 06/07/2026)

**Nội dung thay đổi — Nâng cấp Wizard "Tạo mới dữ liệu chủ"** (`master-data/MasterDataWizard.tsx`) theo mockup đã duyệt, đáp ứng các transaction UC Dữ liệu chủ (485–490):
1. **Bước 1 (Khởi tạo)**: thêm **kiểm tra trùng Mã/Tên** thực thể ngay khi nhập (đỏ "Đã tồn tại" / xanh "Hợp lệ, chưa trùng"); chặn `handleNext` nếu trùng (UC 485.3).
2. **Bước 4 (Quy tắc hợp nhất)**: tách **3 sub-tab**:
   - *So khớp*: thêm cột **Trọng số (%)** (tổng phải =100%), cột **Thuật toán** khi fuzzy (Jaro-Winkler/Levenshtein/Ngữ âm), Việt hóa kiểu so khớp (Khớp tuyệt đối/gần đúng), **2 ngưỡng** (tự động gộp ≥ / rà soát ≥), khối **hard-block** dạng chip.
   - *Hợp nhất giá trị*: thêm cột **Xử lý null** (Nguồn kế/Bỏ qua) và **Khi hết vẫn trống** (Bắt buộc/Cảnh báo/Cho phép trống).
   - *Kiểm thử* (mới): chọn dữ liệu mẫu + "Chạy mô phỏng" + 4 thẻ số + bảng "Nghi ngờ cần xem lại" (UC 487 — vá gap kiểm thử).
   - Validation: ∑trọng số=100%, ngưỡng auto > rà soát, hard-block ≥ 1.
3. **Bước 5 (Quan hệ)**: **mở lại loại 1-n** (bỏ filter); thêm **sơ đồ quan hệ** (SVG) golden record → thực thể con (UC 488.2 + 488.3).
4. **Bước 1 (Khởi tạo)**: thêm khối **Đăng ký nguồn dữ liệu** dạng chip — mỗi nguồn có badge **loại** (Bảng/View/Truy vấn) + **độ mịn** (1:1/1:n) + nút xóa; nút "Thêm nguồn" (form inline). Xóa nguồn tự dọn ánh xạ/gom liên quan (UC 485.1 nền tảng cho hợp nhất đa nguồn).
5. **Bước 3 (Thuộc tính)**: thêm 2 khối:
   - **Ánh xạ cột nguồn → thuộc tính**: bảng thuộc tính × từng nguồn → chọn cột gốc.
   - **Gom nguồn 1:n**: chỉ hiện khi có nguồn 1:n; mỗi nguồn 1:n cấu hình Rule gom (mới nhất/nhiều nhất/max/min) + cột mốc thời gian.
6. **Ẩn/hiện động theo số nguồn**: ≤1 nguồn → ánh xạ ghi chú "ánh xạ trực tiếp", ẩn tab **Hợp nhất giá trị** ở Bước 4 (chỉ giữ So khớp + Kiểm thử); ≥2 nguồn → đủ 3 tab.
   - **Tinh chỉnh tab Hợp nhất giá trị**: Chiến lược rút còn **2 lựa chọn** — *Theo nguồn* (chọn đúng 1 nguồn dữ liệu) và *Độ ưu tiên* (xếp thứ tự nguồn bằng nút ↑/↓, thiếu ở nguồn đầu → lấy nguồn kế). **Bỏ cột "Nguồn thay thế"**; đổi "Nguồn ưu tiên" → **"Nguồn dữ liệu"** (thích ứng theo chiến lược). `ExtractionRule` bỏ `fallbackSource`, thêm `priorityOrder:string[]`; `ConflictStrategy` = `'source'|'priority'`.
   - **Bước 3 — công tắc chế độ thuộc tính**: thêm nút chuyển ngay tại Bước 3 giữa *Chọn trường từ Kho DLDC* và *Tự thêm mới từng trường* (không còn phụ thuộc lựa chọn nguồn ở Bước 1).
   - **Form "Tự thêm mới từng trường"**: bỏ checkbox *Duy nhất* và *Index*, thay bằng checkbox **Khóa (khóa chính)**; cột "Ràng buộc" trong bảng hiển thị badge **Khóa** (icon key) thay cho *Unique*. `AttributeForm` bỏ `unique/indexed`, thêm `isKey`.
7. **Interface mới**: `MatchingRule.weight/algorithm`, `ExtractionRule.nullHandling/onEmpty`, `MergeConfig.autoThreshold/reviewThreshold/hardBlockFields`, `WizardData.sources/mapping/groupRules` (+ type `WizardSource`, `GroupRule`).

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`
- `package.json`

---

## Phiên bản 2.6.14 (Ngày cập nhật: 07/07/2026)

**Nội dung thay đổi — Danh mục dùng chung → Thiết lập danh mục** (`category/CategorySetupPage.tsx` + các tab):
1. **Tab "Thiết lập cấu trúc"** (`AttributesTab.tsx`): chuyển sang **chỉ xem** trong trang Thiết lập danh mục — **bỏ nút "Thêm trường dữ liệu"** và **bỏ cột "Thao tác"** (sửa/xóa). Thêm prop `readOnlyStructure` (mặc định false, truyền `true` từ `CategorySetupPage`) để không ảnh hưởng các nơi dùng khác (wizard/view). Bảng vẫn hiển thị đủ dữ liệu.
2. **Tab "Thiết lập quan hệ"** (`RelationshipsTab.tsx`): **bỏ nút "Thêm mới quan hệ"**; cột "Thao tác" **bỏ sửa/xóa**, thay bằng **1 icon con mắt (Eye)** mở **modal chi tiết quan hệ ở chế độ chỉ đọc** (Danh mục Nguồn/Đích, Loại, Khóa Nguồn/Đích, Trường hiển thị / Bảng liên kết). Hành vi này gate bằng prop mới `readOnlyRelations` (trang Thiết lập truyền `true`).
3. **Wizard "Thiết lập danh mục dùng chung"** (`CategoryWizardModal.tsx` — dùng chung `AttributesTab`/`RelationshipsTab`):
   - **Bước 2 (Thiết lập cấu trúc)**: bảng chọn trường — đổi cột **"Chia sẻ" → "Chọn"**; **thêm cột "Tên cột"** (input sửa được, mặc định = trường gốc) ngay sau "Trường gốc (Column)", có **mũi tên** Trường gốc → Tên cột (field mới `DldcFieldRow.targetColumn`).
   - **Bước 3 (Thiết lập quan hệ)**: sửa lỗi **không khai báo được quan hệ** — wizard nối state thật `wizardRelationships` (trước đây truyền `[]` + `setRelationships` rỗng); `readOnlyRelations=false` nên hiện lại nút thêm. Khai báo 1 quan hệ **chỉ lưu vào danh sách** (không gửi duyệt); "Gửi trình duyệt" toàn danh mục giữ ở footer bước cuối.
4. **Modal "Xem chi tiết thay đổi" (Phê duyệt phiên bản)** (`CategoryVersionChangeModal.tsx`): đổi 3 tab (Thông tin chung/Cấu trúc/Quan hệ) từ bảng diff từng-trường (old|new, tô đỏ/xanh) sang **2 khối snapshot xếp dọc**: *Phiên bản mới (v2)* (nền xanh) ở trên, *Phiên bản cũ (v1)* (nền đỏ nhạt) ở dưới — mỗi khối liệt kê đầy đủ, không tô diff. **Bỏ thanh tóm tắt** "N thay đổi (thêm/sửa/xóa)". Đổi mô hình dữ liệu `VersionChanges` sang dạng snapshot `{ general/structure/relationship: {old,new} }`; cập nhật mock ở `CategorySetupPage.tsx`; có `emptySnapshot` fallback an toàn.
5. **Biên tập danh mục → tab Phiên bản** (`CategoryPage.tsx`):
   - Nút "Xem chi tiết" (Eye) nay mở **modal chi tiết danh mục** (dùng lại `CategoryInfoViewModal` với prop mới `viewOnly` — chỉ xem, ẩn phê duyệt/ý kiến, title "Chi tiết danh mục") thay vì modal so sánh phiên bản. Modal mở rộng **3 tab: Thông tin chung / Thuộc tính / Quan hệ** (thêm prop `attributes`, `relationships`); tab Thuộc tính hiển thị bảng Mã trường·Tên hiển thị·Kiểu·PK, tab Quan hệ hiển thị Nguồn → Đích + loại + FK.
   - Cột "Trạng thái": gộp còn **Hiệu lực** (phiên bản hiện hành) / **Lưu trữ** (mọi phiên bản còn lại).
6. **Quản trị người dùng → Quản lý người dùng — Đồng bộ có bước duyệt** (`admin/UserManagementPage.tsx`): nút "Đồng bộ" mở modal danh sách user kéo về từ nguồn (staging, theo shape API: `userName/fullName/email/cellphone/identityCard/deptName/posCode/status/update_date`). **Trạng thái đồng bộ tính bằng so sánh với danh sách user thật** (khớp `userName`): Thêm mới / Cập nhật / Không thay đổi / Lỗi (thiếu email). Chọn dòng → **Duyệt / Duyệt tất cả** — chỉ dòng "Thêm mới"/"Cập nhật" mới duyệt được; **duyệt xong mới áp vào danh sách user thật** (thêm mới hoặc cập nhật theo `username`). Có tìm kiếm, lọc theo trạng thái đồng bộ/duyệt, icon con mắt xem chi tiết field phụ. **Mỗi lần bấm Đồng bộ** = nạp lại danh sách mới (mô phỏng call API SSO) → toàn bộ trạng thái duyệt reset về **"Chờ duyệt"**.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategorySetupPage.tsx`
- `src/components/pages/category/components/tabs/AttributesTab.tsx`
- `src/components/pages/category/components/tabs/RelationshipsTab.tsx`

---

## Phiên bản 2.6.14 (Ngày cập nhật: 03/07/2026)

**Nội dung thay đổi:**
1. **Modal "Chi tiết đối soát thu thập"** (`ReconciliationDetailModal.tsx`): footer **chỉ giữ nút "Đóng"** — bỏ các nút "Xem lịch sử", "Đồng bộ lại", "Xuất báo cáo".
2. **View "Không khớp"** giữ giao diện giống "Khớp" (chỉ khác màu): bỏ 2 badge *"Có sai lệch dữ liệu"* và *"Đã gửi báo cáo về nguồn"*, thay bằng **1 badge "Không khớp"** (đỏ) tương tự badge "Khớp dữ liệu".

**Các file bị ảnh hưởng:**
- `src/components/pages/reconciliation/ReconciliationDetailModal.tsx`
- `package.json`

---

## Phiên bản 2.6.13 (Ngày cập nhật: 03/07/2026)

**Nội dung thay đổi:**
1. **Danh mục dùng chung → Thiết lập danh mục → Tab Phê duyệt** (`category/components/tabs/ApprovalTab.tsx`):
   - Chuyển danh sách yêu cầu phê duyệt từ dạng thẻ (card) sang bảng dữ liệu (table/grid), theo mẫu thiết kế bảng được cung cấp.
   - Cột bảng: STT, Mã bản ghi, Tên bản ghi, Đơn vị chủ quản, Nguồn dữ liệu, Ngày gửi, Người gửi (tab `category`/`version`/`expire`) hoặc Số trường dữ liệu/Số quan hệ (tab `structure`), Trạng thái, Thao tác — giữ nguyên toàn bộ dữ liệu đã hiển thị trên thẻ trước đó, không thêm trường mới.
   - Cột "Thao tác" chuyển từ nút chữ sang icon button (Xem chi tiết/Phê duyệt/Từ chối) theo quy ước icon-only trong bảng của design system.
   - Không thay đổi logic phê duyệt/từ chối, bộ lọc trạng thái, hay khu vực thẻ thống kê (Chờ phê duyệt/Đã phê duyệt/Từ chối) phía trên.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/components/tabs/ApprovalTab.tsx`

---

## Phiên bản 2.6.12 (Ngày cập nhật: 03/07/2026)

**Nội dung thay đổi:**
1. **Thiết lập danh mục dữ liệu mở** (`OpenDataSetupPage.tsx`):
   - Bỏ `italic` khỏi khối "Nội dung trình duyệt" trong modal "Chi tiết danh mục".
   - **Sửa lỗi kiểu dữ liệu (pre-existing, TS2322)**: state `formData` (dùng cho form Thêm/Sửa danh mục) trước đây được khai báo qua `useState({...})` không có type annotation, khiến TypeScript suy luận `updateFrequency` và `status` thành kiểu literal đơn (`'monthly'`, `'active'`) thay vì union đầy đủ. Điều này khiến `handleEdit` gán `category.updateFrequency` / `category.status` (kiểu union rộng hơn) vào bị báo lỗi. Đã thêm type annotation tường minh cho `useState<{...}>` với `updateFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'` và `status: 'active' | 'inactive'`, khớp với kiểu dữ liệu thực tế được gán vào.

**Các file bị ảnh hưởng:**
- `src/components/pages/open-data/OpenDataSetupPage.tsx`

---

## Phiên bản 2.6.11 (Ngày cập nhật: 03/07/2026)

**Nội dung thay đổi:**
1. **Lịch sử triển khai** (`src/components/modals/VersionHistoryModal.tsx`): Thêm bản ghi phiên bản mới **v2.6.06** (đầu danh sách, đánh dấu "Hiện tại") tổng hợp toàn bộ các thay đổi của phiên bản 2.6.07–2.6.10 trong `log_update.md` (tính năng "Nội dung trình duyệt" ở `OpenDataSetupPage.tsx` và `OpenDataPublishedListPage.tsx`).
   - Lưu ý: trường `time` ("17:30") là giá trị ước lượng do không có mốc giờ hệ thống chính xác tại thời điểm ghi.

**Các file bị ảnh hưởng:**
- `src/components/modals/VersionHistoryModal.tsx`

---

## Phiên bản 2.6.10 (Ngày cập nhật: 03/07/2026)

**Nội dung thay đổi:**
1. **Công bố dữ liệu mở → Yêu cầu công bố** (`OpenDataPublishedListPage.tsx`):
   - Bổ sung dữ liệu mẫu `submitNote` ("Nội dung trình duyệt") cho 2 bản ghi đang **"Chờ công bố"** trong `mockPublishedData` (id `3` – Danh sách Luật sư Việt Nam, id `4` – Danh sách tổ chức TGPL Tỉnh B) để minh họa hiển thị ở modal Phê duyệt.
   - Thêm cơ chế **version hóa `localStorage`** cho key `open_data_published` (`open_data_published_version`, giống pattern đã dùng cho `open_data_metadata`): khi phiên bản không khớp, tự xóa dữ liệu cũ lưu trong trình duyệt (gồm các bản ghi test rác kiểu "fdfgfd", "hgjhgj"... người dùng tự tạo khi thử nghiệm) và nạp lại bộ dữ liệu mẫu sạch.

**Các file bị ảnh hưởng:**
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.6.09 (Ngày cập nhật: 03/07/2026)

**Nội dung thay đổi:**
1. **Công bố dữ liệu mở → Phê duyệt dữ liệu mở** (`OpenDataPublishedListPage.tsx`), modal **"Phê duyệt yêu cầu công bố"**:
   - Thêm khối **"Nội dung trình duyệt"** (đọc từ `selectedApprovalItem.submitNote`) vào phần thông tin chi tiết của yêu cầu, ngay sau "Thông tin mô tả" và trước checkbox "Công bố dữ liệu ngay sau khi được phê duyệt". Chỉ hiển thị khi có nội dung.

**Các file bị ảnh hưởng:**
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.6.08 (Ngày cập nhật: 03/07/2026)

**Nội dung thay đổi:**
1. **Thiết lập danh mục dữ liệu mở** (`OpenDataSetupPage.tsx`) — hoàn thiện hiển thị "Nội dung trình duyệt":
   - Thêm khối **"Nội dung trình duyệt"** vào modal **"Chi tiết danh mục"** (đọc từ `selectedCategory.submitNote`), trước đó modal này chưa hiển thị nội dung này.
   - Bổ sung dữ liệu mẫu `submitNote` cho 3 bản ghi đang "Chờ duyệt" (ODC005, ODC006, ODC007) trong `mockApprovalList` để minh họa/kiểm thử hiển thị ở tab Phê duyệt danh mục.
2. **Công bố dữ liệu mở → Yêu cầu công bố** (`OpenDataPublishedListPage.tsx`):
   - Thêm trường `submitNote` vào `PublishedData`.
   - Nút **"Gửi yêu cầu"** trong modal "Gửi yêu cầu công bố dữ liệu" (tạo mới, không áp dụng cho "Cập nhật") **không lưu bản ghi và báo thành công ngay** như trước, mà **mở modal "Gửi duyệt yêu cầu công bố"** (chọn người phê duyệt + nhập nội dung trình duyệt — modal đang dùng chung với luồng gửi duyệt bản nháp).
   - `handleConfirmSendApproval`: xử lý cả 2 trường hợp — **thêm mới** bản ghi (khi gửi từ modal tạo yêu cầu, bản ghi chưa có trong `dataList`) và **cập nhật** bản ghi đã có (khi gửi duyệt từ bản nháp) — đều gắn `approver` + `submitNote`. Thông báo "Yêu cầu công bố đã được gửi đi phê duyệt thành công!" chỉ hiển thị sau khi xác nhận **"Gửi phê duyệt"** trong modal này.

**Các file bị ảnh hưởng:**
- `src/components/pages/open-data/OpenDataSetupPage.tsx`
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.6.07 (Ngày cập nhật: 03/07/2026)

**Nội dung thay đổi:**
1. **Thiết lập danh mục dữ liệu mở** (`OpenDataSetupPage.tsx`), tab **Quản lý danh mục** → **Phê duyệt danh mục**:
   - Thêm trường `submitNote` vào `OpenDataCategory` để lưu **"Nội dung trình duyệt"** nhập ở modal *Trình duyệt danh mục*.
   - `confirmApprovalAction`: khi trình duyệt (`approvalAction === 'pending'`), lưu nội dung trình duyệt vào bản ghi và **đồng bộ/thêm bản ghi sang danh sách Phê duyệt** (`approvalList`, khớp theo `code`) để người phê duyệt thấy đúng nội dung đã trình.
   - Modal **"Phê duyệt danh mục dữ liệu mở"** và **"Từ chối phê duyệt danh mục"**: hiển thị thêm khối **"Nội dung trình duyệt"** (đọc từ `selectedCategory.submitNote`) phía trên ô nhập ý kiến phê duyệt / lý do từ chối.
   - `handleSubmitForApproval`: nạp lại `submitNote` cũ (nếu có) vào ô nhập khi mở lại modal trình duyệt.

**Các file bị ảnh hưởng:**
- `src/components/pages/open-data/OpenDataSetupPage.tsx`

---

## Phiên bản 2.6.06 (Ngày cập nhật: 02/07/2026)

**Nội dung thay đổi:**
1. **Màn danh sách thực thể (tab "Thiết lập thực thể")** trong `MasterDataScaleManagementPage.tsx`:
   - **Bỏ 2 cột** khỏi bảng: *Phạm vi sử dụng* và *Nguồn dữ liệu*.
   - **Thay 2 bộ lọc**: đổi *Phạm vi sử dụng* → **Loại dữ liệu** (4 tùy chọn: Thực thể Cá nhân / Tổ chức / Văn bản pháp lý / Tài sản) và đổi *Nguồn dữ liệu* → **Cơ quan quản lý** (dropdown lấy từ `MANAGING_UNITS`).
   - Cập nhật state (`filterScope`/`filterDataSource` → `filterDataType`/`filterManagingAgency`) và logic lọc tương ứng.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataScaleManagementPage.tsx`

---

## Phiên bản 2.6.05 (Ngày cập nhật: 02/07/2026)

> Lưu ý: File thuộc Phân hệ 9 (Cung cấp dữ liệu) đang `[ ]` LOCKED. Thay đổi theo **chỉ đạo trực tiếp của PM**.

**Nội dung thay đổi:**
1. **Bỏ khối "Nhật ký kết nối gần đây" trong tab Sơ đồ** của màn "Kiểm soát & Giám sát cung cấp" (`DataProvisionMonitoringPage.tsx`) do **trùng với tab "Nhật ký khai thác (Audit Logs)"**. Đổi tên tab từ *"Sơ đồ giám sát & Logs kết nối"* → **"Sơ đồ giám sát"** cho khớp nội dung còn lại (chỉ còn sơ đồ luồng + danh sách hệ thống).
2. **Danh sách API đang giám sát**: bỏ badge trạng thái *"Kết nối ổn định / Có cảnh báo"*, thay bằng **2 nút "Xem chi tiết" + "Xem sơ đồ"**. "Xem chi tiết" **dùng lại popup "Xem chi tiết Dịch vụ"** (`ProvisionServiceModal`, chế độ `view`) của màn Thiết lập điều phối dữ liệu — truyền service rút gọn (tên, mã `SVC-*`, loại dữ liệu...).
3. **Đổi hành vi tab "Sơ đồ giám sát"**: nay **luôn hiển thị danh sách API** (kể cả khi lọc 1 API ở header — danh sách lọc theo API đó); bấm **"Xem sơ đồ"** mới hiện **sơ đồ luồng** của API đó, kèm **nút "Đóng"** để quay lại danh sách.
4. **Bỏ tiêu đề màn** ("Kiểm soát & Giám sát cung cấp" + phụ đề) và **dàn bộ lọc thành 1 hàng**: Cơ sở dữ liệu · API · Từ ngày · Đến ngày · nút Xuất báo cáo.
5. **Modal "Lịch sử đối soát thu thập"** (`ReconciliationHistoryTab` trong `ReconciliationTemplate.tsx`): **sinh danh sách lịch sử theo đúng bản ghi được chọn ở danh sách ngoài** thay vì dữ liệu cố định. Nút "Xem lịch sử" ở bảng ngoài lưu bản ghi được chọn (`setSelectedRecord`) và truyền vào modal.
   - **Đồng bộ cột với danh sách đối soát ngoài**: đổi cột modal thành **STT · Thu thập · Số bản ghi (Nguồn) · Số bản ghi (Kho) · Lệch · Trạng thái · Ngày đối soát** (bỏ Hệ thống đích / Hành động / Dung lượng đã nhận). Nguồn = số gửi, Kho = số nhận, Lệch = Kho − Nguồn (tô đỏ khi ≠ 0). Trạng thái lần chạy mới nhất bám theo trạng thái record (Khớp dữ liệu / Không khớp / Đang xử lý / Lỗi) với đúng màu.
   - **Chuẩn hóa cột "Thu thập"** ở cả bảng ngoài (`ReconciliationTemplate.tsx`) và modal lịch sử: chỉ còn **Tên thu thập** (dòng trên) + **Mã thu thập** (dòng dưới, font-mono, đã bỏ đuôi năm-tháng `-YYYY-MM`, vd `DM-GIOITINH`), bỏ nhãn "Lần chạy N".

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/provisioning/DataProvisionMonitoringPage.tsx`
- `src/components/pages/reconciliation/ReconciliationTemplate.tsx`
- `src/components/pages/reconciliation/ReconciliationHistoryTab.tsx`
- `src/components/pages/reconciliation/ExternalCourtJudgmentReconciliationPage.tsx`

---

## Phiên bản 2.6.04 (Ngày cập nhật: 02/07/2026)

**Nội dung thay đổi:**
1. **Thay đổi tên hiển thị Menu tại Sidebar**:
   - Đổi tên phân hệ **Quản lý dữ liệu chủ** thành **Dữ liệu chủ** (`menuStructure.ts`, `Sidebar.tsx`, `MainLayout.tsx`).
   - Đổi tên trang **Quản lý quy mô dữ liệu chủ** thành **Mô hình dữ liệu chủ** (`menuStructure.ts`, `Sidebar.tsx`, `MainLayout.tsx`).
2. **Đổi tên Tab trong trang Mô hình dữ liệu chủ**:
   - Đổi tên Tab **Thiết lập DL chủ** thành **Thiết lập thực thể** (`MasterDataScaleManagementPage.tsx`).
3. **Loại bỏ liên kết 1-n (Một - Nhiều)**:
   - Loại bỏ tùy chọn **1 - n (Một - Nhiều)** khỏi danh sách các loại liên kết có thể tạo mới tại tab Thiết lập quan hệ danh mục (`RelationshipsTab.tsx`) và Thiết lập quan hệ thực thể (`EntityRelationshipsTab.tsx`).
   - Cập nhật lại giá trị mặc định của form liên kết sang `n-1` và `many-to-many`.

## Phiên bản 2.6.03 (Ngày cập nhật: 01/07/2026)

**Nội dung thay đổi:**
1. **Ẩn nút "Thêm trường dữ liệu" khi nguồn là "Tự cập nhật trực tiếp"**: Tại tab *"Thiết lập cấu trúc"* (`AttributesTab.tsx`), khi `entityDataSource === 'manual'` (nguồn dữ liệu là "Tự cập nhật trực tiếp"), nút **Thêm trường dữ liệu** bị ẩn hoàn toàn ở chế độ xem chi tiết (non-wizard mode). Danh mục có nguồn này chỉ được xem danh sách các trường, không cho phép thêm mới.
2. **Ẩn form "Thêm trường dữ liệu mới" trong wizard Chi tiết danh mục**: Trong `CategoryWizardModal` (wizard chi tiết, `isViewOnly=true`), khi nguồn dữ liệu là `manual`, form inline thêm trường ở bước 2 được ẩn. Danh sách trường vẫn hiển thị bình thường.
3. **Tách modal Chỉnh sửa danh mục dùng chung** (`CategoryWizardModal.tsx`, `CategorySetupPage.tsx`):
   - Thêm prop `isEditMode` vào `CategoryWizardModal`: khi `isEditMode=true`, tiêu đề modal hiển thị **"Chỉnh sửa danh mục dùng chung"** (thay vì "Thiết lập danh mục dùng chung"). Các nút submit ở mọi bước đều hiện label **"Gửi trình duyệt"** thay vì "Gửi duyệt danh mục" / "Gửi duyệt cấu trúc".
   - Thêm state `isEditMode` và đặt `isEditMode=true` khi gọi `handleEdit`, `isEditMode=false` khi `handleAdd`/`handleView`.
   - Khi submit trong edit mode: type approval là `'version'` → `ApprovalRequestModal` wrapper tự dispatch sang **`VersionApprovalModal`** ("Trình duyệt phiên bản").
   - Mở rộng kiểu `approvalRequestData.type` để bao gồm `'version'`; cập nhật logic tạo `newRequest` và update entity status cho type `'version'`.
4. **Luồng phê duyệt danh mục – cập nhật trạng thái entity** (`CategorySetupPage.tsx`):
   - Khi **Gửi duyệt danh mục**: entity `lifecycleStatus` chuyển sang `'pending_approval'` ("Chờ phê duyệt") ngay sau khi submit.
   - Khi **Phê duyệt**: entity `lifecycleStatus` chuyển sang `'approved'` ("Đã phê duyệt") — đã hoạt động từ trước.
   - Khi **Từ chối**: entity `lifecycleStatus` chuyển sang `'rejected'` ("Từ chối") thay vì về `'draft'`.
   - Thêm `'rejected'` vào `LifecycleStatus` type (`categoryTypes.ts`) và bổ sung label/màu tương ứng vào `lifecycleLabels` (`categoryConstants.ts`): `{ label: 'Từ chối', color: 'bg-red-100 text-red-700' }`.
5. **Đồng bộ thiết kế Quản lý quy mô dữ liệu chủ** (`MasterDataScaleManagementPage.tsx`, `MasterDataWizard.tsx`):
   - Cập nhật lại toàn bộ thiết kế giao diện theo style của trang Thiết lập danh mục (`CategorySetupPage.tsx`).
   - Thêm các thẻ thống kê số liệu (Statistics Cards) cho Dữ liệu chủ ở đầu trang.
   - Làm lại thanh tab bar sang style tối giản, có icon và chỉ báo active đậm chất chuyên nghiệp.
   - Bổ sung bộ lọc nâng cao (Collapsible Filters Panel) lọc theo Trạng thái, Phạm vi, và Nguồn dữ liệu chủ.
   - Chuyển đổi bảng danh sách Grid và thanh phân trang (Pagination Block) sang giao diện HSL bo góc mềm mại, hiển thị số bản ghi linh hoạt.
   - Cải tiến lại Form Modal thêm mới/chỉnh sửa nhanh với z-index và backdrop-blur premium.
   - **Bọc các modal trong Portal**: Sử dụng component `<Portal>` bao quanh Form Modal và Wizard Modal nhằm chuyển vị trí render trực tiếp ra body. Điều này loại bỏ hoàn toàn viền trắng hay khung trắng bị thừa do thuộc tính overflow/border của thẻ cha bao quanh trang.

---

## Phiên bản 2.6.02 (Ngày cập nhật: 01/07/2026)

**Nội dung thay đổi:**
1. **Thêm cột Mã danh mục**: Thêm cột **Mã danh mục** (`entity.code`) vào vị trí thứ hai (sau cột STT) trong bảng danh sách danh mục dùng chung ở tab *"Thiết lập danh sách"* (`SetupTab.tsx`), đồng thời cập nhật thuộc tính `colSpan` của dòng không tìm thấy dữ liệu lên `9`.
2. **Tách biệt 2 modal Trình duyệt danh mục và Trình duyệt phiên bản**: 
   - Định nghĩa hai modal riêng biệt là **Trình duyệt danh mục** (`CategoryApprovalModal` - chỉ gồm Người phê duyệt, Nội dung trình duyệt) và **Trình duyệt phiên bản** (`VersionApprovalModal` - gồm Tên phiên bản, Hiệu lực, Người phê duyệt, Mô tả thay đổi).
   - Thiết lập **Trình duyệt danh mục** hiển thị khi:
     - Nhấp nút *"Gửi duyệt"* lúc thêm mới danh mục (Wizard bước 3/hoàn tất).
     - Nhấp nút *"Gửi duyệt"* (paper plane icon) tại bảng danh sách *"Thiết lập danh sách"* đối với các dòng có sẵn.
   - Thiết lập **Trình duyệt phiên bản** hiển thị khi:
     - Thực hiện chỉnh sửa/thêm mới thuộc tính tại tab *"Thiết lập cấu trúc"* (`AttributesTab` và `AttributeFormModal`).
     - Thực hiện chỉnh sửa/thêm mới liên kết tại tab *"Thiết lập quan hệ"* (`RelationshipsTab`).
     - Thực hiện chỉnh sửa/cập nhật thông tin danh mục có sẵn tại tab *"Thiết lập danh sách"* (Wizard chế độ chỉnh sửa).
     - Thực hiện thêm mới/chỉnh sửa bản ghi dữ liệu tại tab *"Danh sách danh mục"* (`RecordFormModal` và các tác vụ duyệt bản ghi bulk-actions).
3. **Chuẩn hóa z-index & Cỡ chữ Header cho modal Chỉnh sửa bản ghi**:
   - Refactor lại modal **Chỉnh sửa/Thêm mới bản ghi** (`RecordFormModal`) từ sử dụng markup tùy biến sang việc sử dụng trực tiếp `BaseModal`.
   - Giúp sửa lỗi chồng lớp z-index (modal trình duyệt phiên bản bị khuất phía sau modal chỉnh sửa bản ghi do z-index cũ bị hardcode cứng `99999`). Với `BaseModal`, z-index của cả hai modal sẽ tự động phân lớp tăng dần (modal sau chồng lên modal trước).
   - Đồng thời tự động kế thừa cỡ chữ tiêu đề (Header Title) là **18px** của `BaseModal` đúng yêu cầu.
   - Sửa thông tin hiển thị ở khung Banner trong modal Trình duyệt phiên bản khi thêm mới/chỉnh sửa bản ghi: Lấy đúng Tên danh mục (`entityName`) và Mã danh mục (`entityCode`) của danh mục đang chọn bên ngoài thay vì lấy theo tên/mã bản ghi vừa nhập.
   - Loại bỏ nút **Xuất File** (`Download` icon và dropdown menu Excel/PDF/CSV) khỏi tab *"Danh sách danh mục"* trong trang Biên tập danh mục.
   - Loại bỏ hoàn toàn tab phụ **Phê duyệt hủy công khai** (`unpublish`) trong tab *"Phê duyệt"* của trang Biên tập danh mục.
   - Thay đổi wording (nhãn chữ): Đổi toàn bộ nhãn **Phê duyệt thay đổi dữ liệu** thành **Phê duyệt danh mục cập nhật** tại các tiêu đề, mô tả và nút điều hướng tương ứng.
   - Thêm lại nút **Gửi duyệt danh mục** vào footer của Bước 1 (Thông tin chung) và nút **Gửi duyệt cấu trúc** vào footer của Bước 2 (Thiết lập cấu trúc) trong Wizard thiết lập danh mục (`CategoryWizardModal.tsx`), đồng thời cấu hình để khi nhấn các nút này luôn hiển thị modal **Trình duyệt danh mục** thay vì trình duyệt phiên bản.
   - Sửa logic lưu/chuyển bước trong Wizard (`CategorySetupPage.tsx`): Chỉ cho phép tăng số phiên bản (version) khi người dùng thực hiện gửi phê duyệt (`action === 'submit'`). Các thao tác lưu nháp (draft), chuyển tiếp (next), hay quay lại bước cũ sẽ không tăng phiên bản khi chưa gửi duyệt.
   - **Sửa luồng phê duyệt & Ràng buộc chuyển bước trong Wizard**:
    - Khi tạo mới thiết lập danh mục mà chưa được phê duyệt (status khác `'approved'` và `'active'`), hệ thống khóa và không kích hoạt Bước 2, Bước 3. Nếu người dùng cố gắng click "Tiếp tục" tại Bước 1, hệ thống hiển thị thông báo cảnh báo: *"Vui lòng phê duyệt thông tin chung của danh mục trước khi thiết lập cấu trúc và quan hệ của danh mục."*
    - Khi thông tin chung được duyệt, trạng thái danh mục chuyển sang **"Đã phê duyệt"** (`'approved'`).
    - Cho phép thực hiện Thiết lập cấu trúc (Bước 2) khi danh mục đang ở trạng thái **"Đã phê duyệt"**. Khi thiết lập cấu trúc xong và click *"Gửi duyệt cấu trúc"*, hệ thống mở modal **Trình duyệt phiên bản** (tự động tăng version +1).
    - Khi cấu trúc này được phê duyệt thành công, trạng thái danh mục chuyển sang **"Hiệu lực"** (`'active'`).
4. **Kiểm tra biên dịch & Đóng gói:** Chạy `npm run build` thành công hoàn hảo.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/components/tabs/SetupTab.tsx`
- `src/components/pages/category/components/tabs/RelationshipsTab.tsx`
- `src/components/pages/category/components/tabs/AttributesTab.tsx`
- `src/components/pages/category/components/modals/ApprovalRequestModal.tsx`
- `src/components/pages/category/components/modals/AttributeFormModal.tsx`
- `src/components/pages/category/components/modals/RecordFormModal.tsx`
- `src/components/pages/category/CategorySetupPage.tsx`
- `src/components/pages/category/CategoryPage.tsx`

## Phiên bản 2.6.01 (Ngày cập nhật: 30/06/2026)

**Nội dung thay đổi:**
1. **Chuẩn hóa luồng Trình duyệt phiên bản danh mục:**
   - **Đổi tên Modal**: Đổi tên modal từ *"Trình duyệt danh mục"* thành **"Trình duyệt phiên bản danh mục"** (`ApprovalRequestModal`).
   - **Bổ sung các trường mới**: Tích hợp các trường thông tin bắt buộc bao gồm **Tên phiên bản** (`versionName`), **Hiệu lực** (`effectiveDate`), và **Mô tả thay đổi** (`changeDescription`), đồng thời loại bỏ trường nhập liệu *"Nội dung trình duyệt"* (`note`).
   - **Thêm Banner lưu ý**: Thêm một khung thông tin lưu ý màu xanh dương nổi bật, hướng dẫn người dùng biết hệ thống sẽ tự động tạo một bản sao phiên bản mới cho danh mục với trạng thái **Chờ phê duyệt**.
   - **Cấu hình Validation**: Tích hợp xác thực dữ liệu (client-side validation) trực tiếp trong modal trước khi thực hiện hành động gửi trình duyệt.
   - **Căn chỉnh phong cách thiết kế**: Nâng cấp kích thước chiều rộng tối đa lên `max-w-2xl` và áp dụng bo góc `rounded-2xl` cùng font chữ `13px` cho các form nhãn, nút bấm, mang lại giao diện premium đồng bộ.
2. **Kiểm tra biên dịch & Đóng gói:** Chạy `npm run build` thành công hoàn hảo.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/components/modals/ApprovalRequestModal.tsx`

## Phiên bản 2.6.00 (Ngày cập nhật: 30/06/2026)

**Nội dung thay đổi:**
1. **Tinh chỉnh giao diện & Bổ sung tính năng phân hệ Dữ liệu mở (Open Data):**
   - **Quản lý danh mục**: Loại bỏ liên kết màu xanh gạch chân (`handleCategoryClick`) trên cột Tên danh mục trong tab *"Quản lý danh mục"*, hiển thị dưới dạng chữ thường màu đen tĩnh (`text-slate-950`) đồng bộ và sạch sẽ.
   - **Quản lý Giấy phép**: Thêm icon tác vụ *"Xóa"* (`Trash2`) vào cột Thao tác của bảng danh sách giấy phép. Bổ sung hộp thoại popup cảnh báo xác nhận xóa giấy phép (`showDeleteLicenseModal`) có z-index `999999` hiển thị đè trên sidebar và lớp phủ làm mờ nền chuẩn (`bg-black/50 backdrop-blur-sm`) khi giấy phép đang được liên kết sử dụng khai báo/thống kê tệp dữ liệu mở.
   - **Lịch sử đối soát**: Chuyển đổi Lịch sử đối soát từ Tab chính sang dạng Modal Popup (`historyModalOpen`) khi click vào icon đồng hồ xoay (`History`) ở dòng thu thập hoặc nút *"Xem lịch sử"* ở chân modal Chi tiết. Ẩn toàn bộ thanh tìm kiếm và bộ lọc nâng cao trong modal này (`hideSearchAndFilters`), đồng thời tự động sinh mock data lịch sử chạy khớp theo mã thu thập được click (`datasetCode` phân giải qua `getDatasetName`).
   - **Chi tiết đối soát**: Cập nhật lớp nền backdrop của modal Chi tiết đối soát thu thập thành `bg-black/50 backdrop-blur-sm z-[999999]` đồng bộ và chuẩn hóa.
2. **Đồng bộ hóa giao diện trang Đối soát cung cấp (Quy trình đối soát dữ liệu):**
   - **Layout & Bộ lọc**: Loại bỏ hộp bọc màu trắng (`bg-white rounded-xl border border-slate-200 p-4 shadow-sm`) bên ngoài để thanh tìm kiếm chính hiển thị trực tiếp trên nền xám của layout. Thiết kế thanh tìm kiếm kéo dài và tích hợp bộ lọc nâng cao sụp/mở tương tự Dịch vụ chia sẻ.
   - **Cột Tên tiến trình đối soát & Tên API & Thời gian chạy**: Bổ sung hai cột **"Tên tiến trình đối soát"** (ở vị trí đầu tiên) và **"Tên API"** (ở vị trí thứ hai). Cột *"Thời gian chạy"* được dịch chuyển sang vị trí thứ ba và đổi tên thành **"Thời gian chạy gần nhất"**.
   - **Bảng dữ liệu**: Ép kích thước font chữ bảng grid về `13px` cho các dòng giá trị/tiêu đề và `12px` cho các badge (Loại chạy, Trạng thái) kèm thuộc tính không ngắt dòng `whitespace-nowrap`. Loại bỏ cột *"Ghi chú"* khỏi cả header cột và nội dung dữ liệu.
   - **Tác vụ & Header**: Thay thế nút hành động xem chi tiết cũ bằng icon con mắt màu đen (`Eye`) không viền, không nền và bổ sung nút **Xem lịch sử** (`History`). Loại bỏ 2 nút tác vụ *"Cấu hình"* và *"Đối soát ngay"* ở phía trên góc phải của header chi tiết và tăng cỡ chữ tiêu đề *"Lịch sử đối soát"* lên `18px`.
   - **Liên kết phân trang**: Loại bỏ viền đệm (`border border-slate-100 rounded-lg`) của phân vùng cuộn bảng (`overflow-x-auto`) và đưa phần phân trang (`renderPagination`) vào chung khối hộp bảng grid để hiển thị liền mạch không khe hở.
   - **Modal chi tiết & Lịch sử**: Cấu hình lại độ mờ nền của modal chi tiết đối soát thành `bg-black/50 backdrop-blur-sm z-[999999]` (style inline zIndex `999999`), đồng bộ font chữ nội dung về `13px` và tiêu đề `18px`. Thêm mới modal **Lịch sử đối soát dữ liệu cung cấp** hiển thị danh sách tiến trình đối soát, số bản ghi đã gửi, dung lượng đã gửi, hệ thống đích, hành động và trạng thái theo đúng thiết kế tham chiếu. Cấu hình lại giao diện modal chi tiết kết quả đối soát (`ProvisionReconciliationDetailsModal`) khớp cấu trúc 2 cột thông tin tiến trình & API liên kết, lưới 3 cột kết quả (Số bản ghi đã gửi, Số bản ghi khớp nối, Chênh lệch) và thanh tỷ lệ phần trăm khớp kèm nút hành động Đồng bộ lại (loại bỏ nút Xuất báo cáo ở footer). Cập nhật kích thước modal cấu hình trường dữ liệu chia sẻ (`SharedFieldsConfigModal`) sang `max-w-4xl`, thiết lập bo góc `rounded-2xl` và đưa toàn bộ font chữ của các thẻ text thường, badge, preview JSON về `13px` đồng bộ. Bổ sung giới hạn chiều cao tối đa `max-h-[90vh]` (sử dụng cả class Tailwind và style inline `maxHeight: "90vh"`) kết hợp cuộn dọc `overflow-y-auto` ở phần thân modal để chống tràn và giữ hiển thị chân trang (Footer) ổn định trên các màn hình có độ phân giải thấp.
   - **API đối soát dữ liệu (Bảng danh sách)**: Loại bỏ cột *"Phiên bản"*, nút hành động *"Xem lịch sử"* (icon History), và biểu tượng chiếc đồng hồ (`Clock`) ở cột *"Tần suất đối soát"* khỏi bảng danh sách các tiến trình đối soát dữ liệu.
   - **Hộp thoại Cập nhật & Xác nhận**: Chỉnh sửa màu sắc của Hộp thoại Cập nhật API đối soát và Hộp thoại Xác nhận tạm ngưng/kích hoạt sang màu xanh chủ đạo (`bg-blue-600` / `bg-blue-50 text-blue-700`), đồng bộ font chữ nội dung về `13px` và font chữ tiêu đề (Header) về `18px`.
3. **Đồng bộ hóa giao diện trang Danh sách dịch vụ cung cấp (Cung cấp dữ liệu):**
   - **Layout & Header**: Di chuyển khối tiêu đề bộ dữ liệu (`h2` + subtitle) vào bên trong phân vùng cuộn trang chính để loại bỏ vùng hộp màu trắng ở đầu header chi tiết, giúp tiêu đề nằm trực tiếp trên nền xám của layout. Sửa đổi kích thước header tiêu đề xuống `18px` và menu nội bộ (Left Sidebar) xuống `13px`.
   - **Bộ lọc & Bảng grid**: Đồng bộ hóa thanh tìm kiếm, bộ lọc nâng cao, và bảng Grid hiển thị danh sách API (font chữ 13px, padding py-3, nhãn trạng thái 12px không ngắt dòng, icon cấu hình trường `Sliders` màu đen không viền) và tích hợp thanh phân trang.
4. **Sửa lỗi runtime & Bổ sung tính năng màn hình Danh sách danh mục:**
   - **Sửa lỗi `ReferenceError`**: Khai báo bổ sung 2 state còn thiếu `filterType` và `filterStatus` (`useState('all')`) trong `CategoryPage.tsx` — nguyên nhân gây lỗi *"filterType is not defined"* khi render màn hình Danh sách danh mục.
   - **Nút Xuất File**: Bổ sung nút **Xuất File** (icon `Download` + dropdown Excel/PDF/CSV) vào thanh công cụ của tab *"Danh sách danh mục"*, thiết kế đồng nhất với nút tải xuống tại mục Khai thác báo cáo (`bg-blue-600`, `rounded-xl`, shadow, dropdown `z-20`). Nút hiển thị cạnh nút *"Thêm bản ghi mới"*.
5. **Redesign màn hình Báo cáo thống kê danh sách danh mục (`CategoryReportListPage`):**
   - Loại bỏ hoàn toàn wrapper A4 paper (khung trắng, chữ mô tả định dạng in) — giữ lại biểu đồ và bảng grid thuần túy.
   - Chuyển dropdown *"Đơn vị quản lý"* từ `<select>` đơn lẻ thành **multi-select dropdown tuỳ chỉnh** với checkbox, hỗ trợ *"Chọn tất cả"* và nút xóa lựa chọn (`X`).
   - Thêm backdrop trong suốt (`fixed inset-0 z-20`) khi dropdown mở — đóng khi click ra ngoài, không làm mờ tối nền trang.
   - **Lazy rendering**: biểu đồ và bảng dữ liệu chỉ hiển thị sau khi nhấn *"Truy xuất dữ liệu"*; trước đó hiển thị empty state với icon `BarChart2`.
6. **Redesign màn hình Báo cáo tình trạng khai thác danh mục (`CategoryReportExploitationPage`):**
   - Áp dụng toàn bộ thay đổi tương tự `CategoryReportListPage` (xóa A4, multi-select, backdrop, lazy rendering).
   - Chuyển **biểu đồ đường (AreaChart)** sang mô hình đa đường động: số lượng đường theo đúng số hệ thống được chọn — mỗi hệ thống một `<Area>` riêng với màu cố định từ `SYSTEM_COLORS` map.
   - Cấu trúc dữ liệu biểu đồ mở rộng thành object đa trường (mỗi hệ thống một key riêng), render động từ `appliedSystems`.
   - Sửa lỗi TypeScript incompatibility của recharts (TS 5+): import alias rồi cast `as any` cho `Area`, `XAxis`, `YAxis`, `Tooltip`.
7. **Redesign màn hình Báo cáo trạng thái danh mục (`CategoryReportStatusPage`) theo UC:**
   - Loại bỏ toàn bộ wrapper A4 paper và cấu trúc cũ (single-select, bảng tóm tắt đơn giản).
   - Bộ lọc **multi-select trạng thái** (Đang hoạt động / Đang chờ duyệt / Hết hiệu lực / Tạm dừng) với backdrop + lazy rendering chuẩn.
   - Thêm bộ lọc **Thời gian chuyển trạng thái** (theo năm/quý).
   - Giữ nguyên **biểu đồ tròn PieChart** — hiển thị phân bổ theo trạng thái đã lọc, mỗi trạng thái một màu riêng; kèm 4 thẻ tóm tắt (count + tỷ trọng %).
   - Thêm **bảng chi tiết chuyển trạng thái** đáp ứng UC (UC1: truy vấn theo trạng thái, UC2: xem thời gian/người duyệt/lý do) với các cột: STT / Mã danh mục / Tên danh mục / Trạng thái (badge màu) / Thời gian chuyển TT / Người duyệt / Lý do.
   - Nút **Xuất File** (Excel/PDF/CSV) tích hợp vào control panel.
8. **Cập nhật màn hình Thiết lập cấu trúc (AttributesTab) đối với nguồn dữ liệu từ kho DLDC**:
   - **Vô hiệu hóa tác vụ**: Khi danh mục có nguồn dữ liệu là *"Đồng bộ Kho DLDC"*, các nút Sửa/Xóa trong cột Thao tác của bảng grid thuộc tính sẽ bị disable (`isLocked = true`) và đổi sang trạng thái cursor-not-allowed.
   - **Cấu hình thêm mới trường**: Khi click vào nút *"Thêm trường dữ liệu"*, thay vì mở form nhập liệu thủ công, hệ thống hiển thị Modal popup (`showDldcModal`). Tại modal này, **Cơ sở dữ liệu** và **Bảng dữ liệu chính** được thiết lập mặc định theo cấu hình của danh mục hiện tại và bị khóa không cho phép chỉnh sửa. Người dùng có thể tùy ý cấu hình **bảng liên kết bổ sung (Join)**, thêm/xóa trường và lựa chọn các trường chia sẻ (`modalDldcFieldRows`) để áp dụng cấu trúc tự động.
   - **Lược bỏ cột dữ liệu**: Tại bảng chọn trường dữ liệu chia sẻ (Field Selection) cả trong modal và trong wizard cấu hình DLDC, loại bỏ cột *"Che dấu"*; đồng thời thêm lại cột **"Tên hiển thị"** (fill sẵn giá trị bằng tên trường gốc nhưng cho phép người dùng tự do chỉnh sửa).
9. **Cập nhật trường đơn vị chủ quản**: Trong form thông tin chung danh mục (Bước 1), chuyển trường *"Đơn vị chủ quản"* từ dạng ô nhập text tự do sang hộp chọn dropdown cho phép chọn trực tiếp các đơn vị thuộc Bộ Tư pháp (BTP).
10. **Thay đổi dạng hiển thị Cấu hình khóa**: Tại giao diện thiết lập cấu trúc thuộc tính (cả form thêm mới inline và Modal popup thêm mới trường dữ liệu), chuyển đổi nút chọn "Cấu hình khóa" thành dạng **Radio button** cùng nằm trên một dòng ngang với nhãn tiêu đề, cho phép chọn giữa 2 tùy chọn chính: **Khóa chính (PK)** và **Khóa ngoại (FK)** (click lại vào radio đang chọn để bỏ chọn nếu muốn).
11. **Tinh giản Cấu hình ràng buộc**: Tại form thêm mới thuộc tính (inline & modal), loại bỏ hẳn phần nhãn và khung bọc "Cấu hình ràng buộc", chuyển thành một checkbox đơn giản ghi rõ: **"Là trường bắt buộc"** (tương ứng với cấu hình `required`).
12. **Lược bỏ các trường không cần thiết**: Loại bỏ 2 ô nhập liệu **"Quy tắc xác thực"** và **"Mô tả ngắn gọn"** khỏi giao diện thêm mới thuộc tính để tối giản form nhập liệu.
13. **Ẩn nút Gửi trình duyệt ở Bước 1 & Bước 2**: Cấu hình ẩn nút bấm *"Gửi trình duyệt"* ở phần chân trang (footer) của wizard thiết lập danh mục khi người dùng đang ở bước 1 (Thông tin chung) hoặc bước 2 (Thiết lập cấu trúc), chỉ hiển thị nút này khi đã tới bước 3 (Thiết lập quan hệ) hoặc khi hoàn tất.
14. **Gọi Modal trình duyệt danh mục tại Bước 3**: Khi nhấn nút *"Gửi trình duyệt"* ở Bước 3 của wizard thiết lập, hệ thống sẽ mở trực tiếp modal **Trình duyệt danh mục** (`ApprovalRequestModal`) để người dùng điền thông tin người duyệt và nội dung yêu cầu thay vì chỉ lưu nháp thông thường.
15. **Thay đổi nhãn Chọn thực thể**: Tại tab Thiết lập cấu trúc thuộc tính, đổi nhãn tiêu đề trường chọn thực thể dữ liệu chủ từ *"Chọn thực thể dữ liệu chủ"* thành *"Chọn danh mục dữ liệu dùng chung"*.
16. **Đồng bộ cột của bảng danh sách thuộc tính**: Cập nhật lại các cột hiển thị của bảng grid thuộc tính ở cả chế độ thông thường (Full Page Mode) và chế độ thu gọn (Compact Wizard Mode) để đồng bộ hoàn toàn với form thêm mới: loại bỏ cột *"Quy tắc xác thực"*, thay thế cột *"Ràng buộc"* (đang hiển thị REQ, UNI, IDX) bằng cột *"Bắt buộc"* đơn giản.
17. **Cấu trúc cột cho nguồn dữ liệu đồng bộ DLDC**: Nếu danh mục sử dụng nguồn dữ liệu là *"Đồng bộ Kho DLDC"*, bảng grid danh sách trường sẽ hiển thị cấu trúc cột đặc thù gồm: **Tên CSDL**, **Nguồn dữ liệu** (tên bảng), **Trường gốc** (tên cột), **Tên hiển thị**, **Kiểu dữ liệu**, và **PK** (Khóa chính).
18. **Loại bỏ thẻ thống kê trên cùng**: Loại bỏ hoàn toàn hàng thẻ thống kê số liệu trường ở trên cùng (bao gồm: Tổng trường dữ liệu, Trường dữ liệu bắt buộc, Trường dữ liệu duy nhất) theo yêu cầu giao diện tối giản.
19. **Tách riêng Trạng thái cấu trúc và bộ chọn danh mục**: Tách phần **Chọn danh mục dữ liệu dùng chung** và **Trạng thái cấu trúc** thành 2 thẻ (card) độc lập nằm song song cạnh nhau trên một dòng (grid-cols-2).
20. **Loại bỏ bộ lọc thuộc tính**: Gỡ bỏ hoàn toàn nút bấm bộ lọc nâng cao và khung bộ lọc collapsible (bao gồm các bộ lọc Ràng buộc, Cấu hình khóa, Kiểu dữ liệu) để tối giản hóa trải nghiệm người dùng.
21. **Kiểm tra biên dịch & Đóng gói:** `npm run build` thành công cho mọi thay đổi, hoạt động ổn định.

**Các file bị ảnh hưởng:**
- `src/components/pages/open-data/OpenDataSetupPage.tsx`
- `src/components/pages/reconciliation/ReconciliationDetailModal.tsx`
- `src/components/pages/reconciliation/ReconciliationHistoryTab.tsx`
- `src/components/pages/reconciliation/ReconciliationTemplate.tsx`
- `src/components/pages/provisioning/DataProvisionServicesPage.tsx`
- `src/components/pages/provisioning/DataReconciliationPage.tsx`
- `src/components/pages/provisioning/modals/ProvisionReconciliationDetailsModal.tsx`
- `src/components/pages/category/CategoryPage.tsx`
- `src/components/pages/category/reports/CategoryReportListPage.tsx`
- `src/components/pages/category/reports/CategoryReportExploitationPage.tsx`
- `src/components/pages/category/reports/CategoryReportStatusPage.tsx`
- `src/components/pages/category/CategorySetupPage.tsx`
- `src/components/pages/category/components/tabs/AttributesTab.tsx`
- `src/components/pages/category/components/modals/CategoryWizardModal.tsx`
- `src/components/pages/category/components/modals/AttributeFormModal.tsx`

---

## Phiên bản 2.5.73 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Loại bỏ phần So sánh phiên bản:**
   - Xóa bỏ hoàn toàn section **So sánh phiên bản** ở phía dưới bảng danh sách phiên bản tại [CategoryPage.tsx](file:///f:/BTP/DLDC_1/src/components/pages/category/CategoryPage.tsx) theo yêu cầu thiết kế giao diện tinh gọn hơn.
2. **Kiểm tra biên dịch & Đóng gói:** `npm run build` thành công, không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Phiên bản 2.5.72 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Loại bỏ nút Gửi duyệt và thay thế luồng Khôi phục bằng Đặt làm phiên bản chính:**
   - Xóa bỏ hoàn toàn nút Gửi duyệt (Send) ở dòng danh sách phiên bản của [CategoryPage.tsx](file:///f:/BTP/DLDC_1/src/components/pages/category/CategoryPage.tsx).
   - Thay thế nút hành động Khôi phục (Clock) thành nút **Đặt làm phiên bản chính** với tooltip/title tương ứng.
   - Cập nhật modal Xác nhận Đặt làm phiên bản chính: Khi người dùng chọn xác nhận, phiên bản được chọn sẽ chuyển đổi trạng thái sang **Chờ duyệt** (Chờ phê duyệt), trong khi phiên bản đang dùng hiện tại (Đang dùng / Hiệu lực) vẫn được giữ nguyên trạng thái hoạt động bình thường mà không bị ảnh hưởng.
2. **Kiểm tra biên dịch & Đóng gói:** `npm run build` thành công, không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Phiên bản 2.5.71 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Thiết lập hiển thị đầy đủ các icon hành động trong cột Thao tác:**
   - Cập nhật cột Thao tác của bảng danh sách phiên bản tại [CategoryPage.tsx](file:///f:/BTP/DLDC_1/src/components/pages/category/CategoryPage.tsx) để luôn hiển thị đầy đủ 5 icon hành động bao gồm: Xem chi tiết (Eye), Khôi phục (Clock), Khóa (Lock), Tải xuống (Download), Chỉnh sửa thông tin và cấu trúc (Edit2) một cách vô điều kiện.
   - Giữ lại nút Gửi duyệt (Send) chỉ hiển thị khi phiên bản ở trạng thái Bản nháp để người dùng có thể gửi trình duyệt bình thường.
2. **Kiểm tra biên dịch & Đóng gói:** `npm run build` thành công, không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Phiên bản 2.5.70 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Cập nhật modal xem chi tiết phiên bản:**
   - Điều chỉnh cấu trúc hiển thị trong modal xem chi tiết phiên bản (`showVersionDetailModal` tại [CategoryPage.tsx](file:///f:/BTP/DLDC_1/src/components/pages/category/CategoryPage.tsx)) tương ứng với các trường mới của danh sách phiên bản.
   - Hiển thị đầy đủ: Người thực hiện (user), Ngày thay đổi (date), Ngày hiệu lực (effectiveDate), Trạng thái (status: Đang dùng / Bản nháp / Chờ duyệt / Hết hiệu lực), và Nội dung thay đổi chi tiết (changes).
   - Loại bỏ trường Loại thay đổi cũ để đảm bảo tính đồng bộ dữ liệu.
2. **Kiểm tra biên dịch & Đóng gói:** `npm run build` thành công, không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Phiên bản 2.5.69 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Tinh chỉnh các cột trong bảng danh sách phiên bản:**
   - Loại bỏ hoàn toàn cột `Loại thay đổi` (changeType) trong bảng danh sách phiên bản của [CategoryPage.tsx](file:///f:/BTP/DLDC_1/src/components/pages/category/CategoryPage.tsx).
   - Thêm cột `Ngày hiệu lực` (effectiveDate) kế tiếp cột `Ngày thay đổi` để làm rõ thời điểm bắt đầu áp dụng phiên bản.
   - Cập nhật lại logic map dữ liệu và logic lưu thông tin của bản nháp mới tạo với `effectiveDate` tương ứng từ form.
2. **Kiểm tra biên dịch & Đóng gói:** `npm run build` thành công, không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Phiên bản 2.5.68 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Bổ sung tính năng Tạo phiên bản mới trong Danh sách danh mục (tab Quản lý phiên bản danh mục):**
   - Thêm nút **Tạo phiên bản mới** tại phần đầu trang tab Quản lý phiên bản danh mục của [CategoryPage.tsx](file:///f:/BTP/DLDC_1/src/components/pages/category/CategoryPage.tsx).
   - Khi click nút này, mở modal Tạo phiên bản mới, cho phép nhập: Tên phiên bản, Ngày hiệu lực, Mô tả thay đổi.
   - Quản lý danh sách phiên bản bằng local state `versionHistoryList`. Khi chọn tạo mới, thêm một phiên bản mới có trạng thái là **Bản nháp** (kế thừa thông tin chung, cấu trúc, quan hệ làm bản sao của phiên bản cũ).
   - Tối ưu hóa các thao tác cho Bản nháp: người dùng có thể nhấn icon **Chỉnh sửa** (Edit2) để sửa đổi thông tin/cấu trúc, và nhấn icon **Gửi duyệt** (Send) để gửi duyệt chuyển trạng thái sang **Chờ duyệt**.
2. **Kiểm tra biên dịch & Đóng gói:** `npm run build` thành công, không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Phiên bản 2.5.67 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Redesign modal Quản lý phiên bản danh mục:**
   - Đổi tên tiêu đề modal từ "Lịch sử phiên bản" thành "Quản lý phiên bản danh mục" tại [EntityVersionHistoryModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/category/components/modals/EntityVersionHistoryModal.tsx).
   - Tối ưu hóa cột thao tác: chuyển button "Xem chi tiết" dài thành icon Eye gọn gàng.
   - Thêm icon "Thêm mới phiên bản" (PlusCircle) ở từng dòng để người dùng có thể tạo một phiên bản kế tiếp sao chép trực tiếp từ phiên bản được chọn, đồng thời bố trí thêm button "+ Thêm mới phiên bản" chính ở đầu bảng của modal.
   - Tích hợp form nhập liệu cho phiên bản mới bao gồm các trường: Tên phiên bản, Ngày hiệu lực, Mô tả thay đổi.
   - Khi tạo mới, phiên bản đó được xếp vào trạng thái **Bản nháp** (Draft), kế thừa toàn bộ cấu trúc, thông tin chung và quan hệ của phiên bản được chọn làm gốc.
   - Cho phép người dùng chỉnh sửa thông tin bản nháp (icon Edit2) và gửi duyệt (icon Send) để chuyển đổi trạng thái sang **Chờ duyệt** (Chờ phê duyệt).
2. **Kiểm tra biên dịch & Đóng gói:** `npm run build` thành công, không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/components/modals/EntityVersionHistoryModal.tsx`

---

## Phiên bản 2.5.66 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Thiết lập lại màn hình Báo cáo phiên bản danh mục:**
   - Thay thế hoàn toàn giao diện xem trước biên bản (A4 paper style) cũ trong [CategoryReportVersionPage.tsx](file:///f:/BTP/DLDC_1/src/components/pages/category/reports/CategoryReportVersionPage.tsx) bằng bảng danh sách danh mục và phiên bản mới nhất có hiệu lực.
   - Đồng bộ hóa thiết kế (toolbar tìm kiếm, phân trang, bảng grid) theo chuẩn của mục "Thiết lập danh mục > Thiết lập danh sách".
   - Cấu trúc bảng grid hiển thị: STT, tên danh mục, Phiên bản, người tạo, ngày tạo, người cập nhật, ngày cập nhật.
   - Tích hợp nút thao tác "Xem chi tiết" (icon Eye) liên kết trực tiếp để mở modal Lịch sử phiên bản ([EntityVersionHistoryModal.tsx](file:///f:/BTP/DLDC_1/src/components/pages/category/components/modals/EntityVersionHistoryModal.tsx)) theo đúng luồng yêu cầu.
2. **Kiểm tra biên dịch & Đóng gói:** `npm run build` thành công, không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/reports/CategoryReportVersionPage.tsx`

---

## Phiên bản 2.5.65 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Cho phép thêm mới trường dữ liệu với nguồn dữ liệu Kho DLDC:**
   - Loại bỏ kiểm tra điều kiện nguồn dữ liệu là `dldc` khi click nút "+ Thêm trường dữ liệu" trên giao diện Thiết lập cấu trúc ([AttributesTab.tsx](file:///f:/BTP/DLDC_1/src/components/pages/category/components/tabs/AttributesTab.tsx)).
   - Cho phép mở form popup thêm mới trường dữ liệu thủ công bình thường đối với tất cả các nguồn dữ liệu bao gồm cả nguồn đồng bộ.
   - Loại bỏ banner thông báo cảnh báo màu vàng (*Lưu ý: Không thể thêm mới trường dữ liệu thủ công đối với danh mục có nguồn đồng bộ*) trên giao diện để tránh gây hiểu nhầm cho người sử dụng.
2. **Kiểm tra biên dịch & Đóng gói:** `npm run build` thành công, không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/components/tabs/AttributesTab.tsx`

---

## Phiên bản 2.5.64 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Loại bỏ nguồn dữ liệu "Kết nối API (NDXP/LGSP)":**
   - Loại bỏ hoàn toàn nguồn dữ liệu `Kết nối API (NDXP/LGSP)` (`lgsp`/`ndxp`) trong form tạo mới/chỉnh sửa danh mục (`CategoryWizardModal.tsx`), xem chi tiết danh mục (`CategoryInfoViewModal.tsx`), và tab quản lý chung (`SetupTab.tsx`).
   - Xóa bỏ giao diện cấu hình kết nối API ở Bước 2 (Thiết lập cấu trúc) của Wizard khi chọn nguồn dữ liệu.
   - Cập nhật các mock data và dropdown filter ở trang Danh mục (`categoryConstants.ts`) và Khai thác báo cáo (`CategoryReportPage.tsx`) để chuyển đổi nguồn dữ liệu cũ sang `Đồng bộ Kho DLDC` (`dldc`) hoặc loại bỏ option chọn API nhằm bảo đảm tính nhất quán của hệ thống.
2. **Kiểm tra biên dịch & Đóng gói:** `npm run build` thành công, không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/categoryTypes.ts`
- `src/components/pages/category/categoryConstants.ts`
- `src/components/pages/category/CategoryReportPage.tsx`
- `src/components/pages/category/components/modals/CategoryWizardModal.tsx`
- `src/components/pages/category/components/modals/CategoryInfoViewModal.tsx`
- `src/components/pages/category/components/tabs/SetupTab.tsx`
- `src/components/pages/category/components/tabs/AttributesTab.tsx`

---

## Phiên bản 2.5.63 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Thay thế logic lọc cũ bằng bộ lọc điều kiện động (giống màn hình CSDL đích):**
   - Loại bỏ hoàn toàn 2 dropdown cũ: Loại danh mục và Trạng thái (kèm state `filterType`, `filterStatus`).
   - Thay bằng mô hình lọc điều kiện động: mỗi điều kiện gồm **Trường** + **Toán tử** + **Giá trị** + logic **AND/OR** liên kết các điều kiện.
   - Các trường có thể lọc: Mã, Tên giá trị, Mô tả, Trạng thái, Ngày tạo, Người tạo, Ngày cập nhật, Người cập nhật.
   - Các toán tử: `Bằng (=)` / `Khác (!=)` / `Chứa` / `Lớn hơn (>)` / `Nhỏ hơn (<)`.
   - Hỗ trợ nhiều điều kiện đồng thời — áp dụng tuần tự theo AND/OR.
   - Nút **+ Thêm điều kiện** và **Xóa bộ lọc** để quản lý danh sách điều kiện.
   - Kết quả lọc cập nhật realtime theo từng ký tự nhập vào giá trị.
2. **Kiểm tra biên dịch & Đóng gói:** `npm run build` thành công, không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Phiên bản 2.5.62 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Thêm button Lọc và Sắp xếp vào màn hình Danh sách danh mục:**
   - Thay thế icon lọc nhỏ bằng 2 button có text: **Lọc** (icon Filter) và **Sắp xếp** (icon ArrowUpDown), đặt cạnh button **Thêm bản ghi mới** theo đúng thiết kế chuẩn.
   - Button **Lọc**: mở/đóng panel lọc theo Loại danh mục và Trạng thái (tái sử dụng logic lọc hiện có). Có chấm xanh nhỏ khi đang áp dụng bộ lọc.
   - Button **Sắp xếp**: mở/đóng **Sort Panel** mới tham khảo giao diện CSDL đích. Hỗ trợ:
     - Thêm nhiều điều kiện sắp xếp (có nút "+ Thêm điều kiện").
     - Mỗi điều kiện gồm: chọn trường (Tên giá trị / Mã / Ngày tạo / Ngày cập nhật) và thứ tự (Tăng dần / Giảm dần).
     - Xóa từng điều kiện hoặc xóa toàn bộ.
     - Hiển thị thứ tự ưu tiên "Theo ... rồi ..."
   - Logic sắp xếp: áp dụng `sortConditions` theo thứ tự ưu tiên; fallback về `sortBy` cũ khi không có điều kiện.
   - Hai panel **Lọc** và **Sắp xếp** chỉ hiện một lần tại một thời điểm (toggle lẫn nhau).
2. **Kiểm tra biên dịch & Đóng gói:** `npm run build` thành công, không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Phiên bản 2.5.61 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Thêm cột Thao tác (Xem chi tiết) vào màn hình Khai thác báo cáo:**
   - Bổ sung cột **Thao tác** với nút **Xem chi tiết** (icon Eye, màu `blue-50/blue-600`) vào cuối bảng danh sách báo cáo.
   - Khi click nút Xem chi tiết, hệ thống điều hướng sang màn hình **Danh sách danh mục** (`/category-list?category={id}`) và tự động chọn đúng danh mục tương ứng thông qua URL query parameter `category`.
2. **Cập nhật Mock data theo danh mục hiện có:**
   - Thay thế dữ liệu mock cũ (DS001–DS004) bằng 7 bản ghi tương ứng với các danh mục thực có trong hệ thống: `category-a-1` đến `category-a-7` (Danh mục giới tính, Dân tộc Việt Nam, Quốc gia/Quốc tịch, Tôn giáo, Cơ quan, Đơn vị hành chính, Quan hệ gia đình).
   - Mỗi bản ghi được gán đầy đủ thông tin: tên, đơn vị chủ quản, phạm vi, nguồn dữ liệu, số lượng trường/liên kết, phiên bản, ngày công bố, trạng thái phê duyệt và công bố.
3. **Cập nhật CategoryAListPage để hỗ trợ điều hướng có tham số:**
   - Đọc query parameter `?category=...` từ URL (`useSearchParams`).
   - Nếu `category` param hợp lệ, tự động kích hoạt và hiển thị danh mục tương ứng trong sidebar.
4. **Kiểm tra biên dịch & Đóng gói:**
   - Chạy lệnh đóng gói `npm run build` thành công, kiểm tra không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryReportPage.tsx`
- `src/components/pages/category/CategoryAListPage.tsx`

---

## Phiên bản 2.5.60 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Cập nhật trường thông tin trên màn hình Khai thác báo cáo:**
   - Bảng Grid: Thêm 3 cột: *Đơn vị chủ quản*, *Phạm vi*, *Nguồn dữ liệu* (được hiển thị dưới dạng Badge có border HSL bắt mắt); loại bỏ 4 cột không cần thiết: *Hiệu lực*, *Tình trạng khai thác*, *Lượt xem*, *Lượt tải*.
   - Bộ lọc nâng cao: Loại bỏ bộ lọc *Hiệu lực*, bổ sung 2 bộ lọc *Phạm vi* và *Nguồn dữ liệu*, đổi cấu trúc lưới bộ lọc nâng cao từ 3 cột sang 4 cột (`md:grid-cols-4`).
   - Cập nhật logic lọc theo Phạm vi (`scopeFilter`) và Nguồn dữ liệu (`dataSourceFilter`).
2. **Kiểm tra biên dịch & Đóng gói:**
   - Chạy lệnh đóng gói `npm run build` thành công, kiểm tra không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryReportPage.tsx`

---

## Phiên bản 2.5.59 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Bỏ tab "Dữ liệu cung cấp" khỏi trang Dịch vụ chia sẻ:**
   - Xóa nút tab "Dữ liệu cung cấp" (icon FileText) khỏi thanh tab trong header của `DataProvisionServicesPage`.
   - Xóa toàn bộ logic điều hướng tab: `getInitialTab`, `activeDetailTab` state, `handleTabChange`, `useEffect` đồng bộ URL param.
   - Xóa ternary render — nội dung tab "Quản lý API đang lấy dữ liệu" hiển thị trực tiếp mà không cần điều kiện.
   - Xóa các import không còn dùng: `useLocation`, `useNavigate` (react-router-dom), `FileText` (lucide), `ServiceDataTable`.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionServicesPage.tsx`

---

## Phiên bản 2.5.58 (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Redesign trang Khai thác báo cáo theo chuẩn thiết kế Thiết lập danh mục:**
   - Thanh tìm kiếm: áp dụng style `rounded-xl`, `focus:ring-blue-500/20`, `focus:border-blue-500` đồng nhất với SetupTab.
   - Nút "Tìm kiếm": đổi từ `emerald-600` sang `blue-600`.
   - Nút "Tìm kiếm nâng cao": giữ nguyên text, chuyển từ modal popup sang panel inline collapsible (có indicator `!` khi filter đang active), style đồng nhất với filter toggle của SetupTab.
   - Bộ lọc nâng cao: chuyển từ modal sang panel inline, 4 cột (Chủ đề, Hiệu lực, Trạng thái công bố, Trạng thái phê duyệt), có nút "Đặt lại" và "Áp dụng bộ lọc" màu xanh dương.
   - Bảng grid: container `rounded-2xl shadow-sm`, header `font-semibold text-[13px]`, row `hover:bg-slate-50/50 transition-all`, badge có `border` bao quanh, padding `px-6 py-4` đồng nhất với SetupTab.
   - Thêm thanh phân trang (pagination) ở cuối bảng: chọn số bản ghi/trang, thông tin vị trí, nút Trước/Sau và page numbers, active page màu `blue-600`.
   - Màu chủ đạo toàn trang đổi từ emerald sang blue.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryReportPage.tsx`

---

## Phiên bản 2.5.57 (Ngày cập nhật: 28/06/2026)

**Nội dung thay đổi:**
1. **Chuyển đổi sang chỉnh sửa trực tiếp trên dòng (Inline Editing):**
   - Khi nhấn nút "Chỉnh sửa" (SquarePen) trên một dòng bản ghi, các ô giá trị (Mã, Tên giá trị, Mô tả) chuyển sang chế độ nhập liệu trực tiếp trên bảng.
   - Thêm các nút "Lưu" (Check) và "Hủy" (X) trực tiếp tại cột Thao tác của dòng đó để lưu/hủy chỉnh sửa nhanh.
   - Loại bỏ hoàn toàn Modal Chỉnh sửa (`showEditModal`) và các logic liên quan.
2. **Chuyển đổi sang thêm bản ghi trực tiếp trên dòng (Inline Adding):**
   - Khi nhấn nút "Thêm bản ghi mới" ở thanh công cụ phía trên, một dòng trống mới sẽ được chèn trực tiếp vào vị trí cuối cùng của trang bảng hiện tại.
   - Người dùng tự nhập các trường giá trị (Mã, Tên giá trị, Mô tả) và thực hiện "Lưu" hoặc "Hủy" trực tiếp trên dòng này.
   - Loại bỏ hoàn toàn Modal Thêm mới (`showAddModal`) và các logic liên quan.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/category/CategoryPage.tsx`

---

## Phiên bản 2.5.56 (Ngày cập nhật: 28/06/2026)

**Nội dung thay đổi:**
1. **Loại bỏ tính năng Xem chi tiết bản ghi:**
   - Xóa nút "Xem chi tiết" (icon con mắt) khỏi cột Thao tác của từng dòng giá trị trong bảng dữ liệu tại màn hình Danh sách danh mục (`CategoryPage.tsx`).
   - Xóa bỏ hoàn toàn code giao diện Modal Xem chi tiết (`showDetailModal`) khỏi mã nguồn.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/category/CategoryPage.tsx`

---

## Phiên bản 2.5.55 (Ngày cập nhật: 28/06/2026)

**Nội dung thay đổi:**
1. **Đồng bộ hóa Modal chi tiết và chỉnh sửa:** Điều chỉnh các Modal:
   - **Modal xem chi tiết (`showDetailModal`):** Chỉ hiển thị các trường "Mã", "Tên giá trị", và "Mô tả" tương ứng với các cột hiển thị trong danh sách bảng. Loại bỏ các trường "Loại", "Trạng thái", và "Ngày tạo".
   - **Modal chỉnh sửa (`showEditModal`):** Chỉ cho phép chỉnh sửa các trường "Mã", "Tên giá trị", và "Mô tả". Loại bỏ các trường nhập liệu "Trạng thái" và "Người phê duyệt".
   - **Modal thêm mới (`showAddModal`):** Cập nhật nhãn và placeholder của các trường nhập liệu thành "Mã", "Tên giá trị", và "Mô tả" để đồng bộ giao diện.
2. **Căn chỉnh cấu trúc & thiết kế:** Áp dụng hệ thống thiết kế `rounded-2xl` cho bo góc các Modal và cỡ chữ tiêu chuẩn `13px` cho các form nhãn, nâng cao tính thẩm mỹ đồng bộ.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/category/CategoryPage.tsx`

---

## Phiên bản 2.5.54 (Ngày cập nhật: 28/06/2026)

**Nội dung thay đổi:**
1. **Loại bỏ cột hiển thị tại Danh sách danh mục:** Loại bỏ các cột "Phiên bản" (Version), "Ngày tạo" (Created Date), và "Trạng thái" (Status) khỏi bảng hiển thị giá trị các trường trong màn hình Danh sách danh mục (`CategoryPage.tsx`).
2. **Căn chỉnh cấu trúc bảng:** Thay đổi `colSpan` của dòng thông báo khi không tìm thấy dữ liệu từ 8 cột xuống 5 cột tương thích với cấu trúc cột mới.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/category/CategoryPage.tsx`

---

## Cập nhật bảng dữ liệu giá trị của các trường trong Danh sách danh mục (Ngày cập nhật: 27/06/2026)

**Nội dung thay đổi:**
1. **Chuyển đổi bảng hiển thị:** Sửa đổi bảng grid tại trang "Danh sách danh mục" (khi chọn từ menu Biên tập & Công khai) từ việc hiển thị danh sách các danh mục dùng chung (tỉnh/thành) thành hiển thị giá trị các bản ghi dữ liệu cụ thể tương ứng với danh mục được chọn ở thanh Sidebar bên trái (ví dụ: hiển thị Nam/Nữ/Khác khi chọn "Danh mục giới tính", danh sách dân tộc khi chọn "Danh mục dân tộc Việt Nam", v.v.).
2. **Cập nhật cột & thông tin bảng:**
   - Đổi cột "Mã danh mục" thành "Mã" (Mã giá trị bản ghi).
   - Đổi cột "Tên danh mục" thành "Tên giá trị".
   - Đổi cột "Loại" thành "Mô tả" (Mô tả chi tiết của giá trị bản ghi).
3. **Đồng bộ hóa dữ liệu mô phỏng:** Thiết lập bản đồ dữ liệu `MOCK_RECORDS_BY_CATEGORY` và sử dụng hook `useEffect` để tự động chuyển đổi danh sách bản ghi hiển thị khi người dùng click chọn danh mục tương ứng bên menu trái, đảm bảo các chức năng tìm kiếm, phân trang và thao tác vẫn hoạt động bình thường.
4. **Sửa lỗi hiển thị cột trạng thái:** Thêm class `whitespace-nowrap` cho cả phần tử `span` chứa nhãn và thẻ `td` bọc ngoài trong hàm `getStatusBadge` để ngăn nhãn trạng thái (ví dụ: "Công khai") bị ngắt dòng xuống thành 2 dòng.
5. **Cấu hình Modal Chỉnh Sửa:** Sửa đổi modal chỉnh sửa (khi click nút "Sửa" trên từng dòng bản ghi) để hỗ trợ chỉnh sửa các trường của giá trị bản ghi: Mã, Tên giá trị, Trạng thái (Trình duyệt, Đã phê duyệt, Công khai, Hủy công khai), Người phê duyệt, và Mô tả, thay vì chỉnh sửa cấu hình siêu dữ liệu (metadata) của danh mục.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Cập nhật cấu trúc menu Sidebar - Thêm module cha Biên tập & Công khai & Loại bỏ cụm từ "dùng chung" (Ngày cập nhật: 26/06/2026)

**Nội dung thay đổi:**
1. **Thêm module cha "Biên tập & Công khai":** Tạo module cha mới tên là "Biên tập & Công khai" (`category-edit-publish`) trong menu quản lý danh mục dùng chung.
2. **Cấu hình các module con đồng cấp:** Chuyển hai mục "Danh sách danh mục dùng chung" (`category-list`) và "Đơn vị thuộc BTP" (`category-moj-units`) thành hai module con đồng cấp trực thuộc module "Biên tập & Công khai".
3. **Cập nhật Breadcrumbs:** Cấu hình lại luồng điều hướng và breadcrumbs hiển thị tương ứng tại `MainLayout.tsx` để khớp với cấu trúc phân mục mới.
4. **Cập nhật menuStructure:** Đồng bộ cấu trúc logic menu mới trong file định nghĩa menu hệ thống `menuStructure.ts`.
5. **Loại bỏ cụm từ "dùng chung" tại các danh mục:** Thay đổi tên hiển thị của các module:
   - "Tổng quan danh mục dùng chung" thành **"Tổng quan danh mục"**
   - "Thiết lập danh mục dùng chung" thành **"Thiết lập danh mục"**
   - "Danh sách danh mục dùng chung" thành **"Danh sách danh mục"**
   - "Thống kê danh mục dùng chung" thành **"Thống kê danh mục"**
   Thực hiện đồng bộ tại Sidebar, Breadcrumbs, logical Menu Structure và tiêu đề trang trong các component.

**Các file bị ảnh hưởng:**
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MainLayout.tsx`
- `src/components/pages/admin/menuStructure.ts`
- `src/components/pages/category/CategoryDashboardPage.tsx`
- `src/components/pages/category/CategorySetupPageNew.tsx`

---

## Đồng bộ màu nền Backdrop và tính năng đóng click-outside cho các Modal Biên tập Danh mục (Ngày cập nhật: 26/06/2026)

**Nội dung thay đổi:**
Đồng bộ hóa cơ chế hiển thị nền mờ backdrop cho các modal thuộc mục **Biên tập danh mục dùng chung** (`CategoryPage.tsx` và các sub-modal liên quan) giống như phần **Thiết lập danh mục dùng chung** (`CategorySetupPage.tsx` / `BaseModal.tsx`):
1. **Màu nền Backdrop đồng nhất:** Cập nhật nền backdrop thành `bg-black/50` (hoặc `rgba(0,0,0,0.5)`) và loại bỏ hoàn toàn hiệu ứng làm mờ kính `backdrop-blur-sm` trên tất cả các modal.
2. **Đóng modal khi click ra ngoài (Click-outside):** Cấu hình sự kiện `onClick` ở thẻ bọc backdrop của các modal để đóng modal khi click ra ngoài.
3. **Ngăn chặn nổi bọt sự kiện (Propagation stopping):** Thêm sự kiện `onClick={(e) => e.stopPropagation()}` tại thẻ bọc nội dung (content container) của các modal để tránh đóng modal ngoài ý muốn khi tương tác bên trong.
4. **Tăng z-index lên mức cao nhất:** Cập nhật z-index của toàn bộ 13 inline modal trong `CategoryPage.tsx` lên `z-[99999]` và style inline `style={{ zIndex: 99999 }}` để bảo đảm hiển thị trên Sidebar của layout chính.

**Các file bị ảnh hưởng:**
- Inline modals trong `src/components/pages/category/CategoryPage.tsx`:
  - Approval Modal (`showApprovalModal`)
  - Reject Modal (`showRejectModal`)
  - Compare Modal (`showCompareModal`)
  - Version Detail Modal (`showVersionDetailModal`)
  - Restore Modal (`showRestoreModal`)
  - Create Version Modal (`showCreateVersionModal`)
  - Advanced Search Modal (`showAdvancedSearch`)
- Các component sub-modals độc lập:
  - `src/components/pages/category/components/modals/ArchiveRecordModal.tsx`
  - `src/components/pages/category/components/modals/CreateVersionModal.tsx`
  - `src/components/pages/category/components/modals/DeleteConfirmModal.tsx`
  - `src/components/pages/category/components/modals/PublishConfigModal.tsx`
  - `src/components/pages/category/components/modals/PublishModal.tsx`
  - `src/components/pages/category/components/modals/RecordFormModal.tsx`
  - `src/components/pages/category/components/modals/RestoreVersionModal.tsx`
  - `src/components/pages/category/components/modals/UnpublishModal.tsx`
  - `src/components/pages/category/components/modals/MojUnitDeleteConfirmModal.tsx`

---

## Xem chi tiết tại Phê duyệt danh mục chỉ hiển thị Thông tin chung (Ngày cập nhật: 26/06/2026)

**Yêu cầu:** Khi nhấn "Xem chi tiết" trong tab Phê duyệt danh mục, chỉ hiển thị **Thông tin chung** (các trường cấu hình tại bước 1 của wizard Thiết lập danh mục dùng chung) thay vì mở toàn bộ `ReviewApprovalModal` với giao diện phê duyệt/từ chối.

**Các trường hiển thị (đúng với bước 1 wizard):**
- Phiên bản danh mục (`version`)
- Tên danh sách danh mục (`name`)
- Cơ sở dữ liệu/Hệ thống (`databaseSystem`)
- Đơn vị chủ quản (`managingAgency`)
- Căn cứ (`canCu`)
- Phạm vi vĩ mô (`scope`)
- Nguồn dữ liệu (`dataSource`)

**Nội dung thay đổi:**
1. Tạo mới `CategoryInfoViewModal` — modal read-only dùng `BaseModal`, hiển thị 7 trường Thông tin chung dạng lưới 2 cột, footer chỉ có nút "Đóng".
2. Cập nhật `CategorySetupPage.tsx`:
   - Thêm import `CategoryInfoViewModal`
   - Thêm state `showInfoViewModal`, `infoViewEntity`
   - Cập nhật `onViewDetail` handler: nhánh `else` (non-expire) → tìm entity theo `req.entityId`, mở `CategoryInfoViewModal` thay vì `ReviewApprovalModal`
   - Thêm `showInfoViewModal` vào `isAnyModalOpen`
   - Render `<CategoryInfoViewModal>` trong modals container

**Các file bị ảnh hưởng:**
- `src/components/pages/category/components/modals/CategoryInfoViewModal.tsx` — **FILE MỚI**
- `src/components/pages/category/CategorySetupPage.tsx` — thêm state/import/render modal

---

## Tăng z-index modal Phê duyệt / Từ chối lên mức cao nhất (Ngày cập nhật: 26/06/2026)

**Vấn đề:** Modal phê duyệt và từ chối hiển thị sau sidebar do z-index chưa đủ cao.

**Nội dung thay đổi:**
1. Convert `SimpleApproveModal` và `SimpleRejectModal` sang `BaseModal` (đồng bộ với các modal tab Phê duyệt khác đã sửa trước).
2. Tăng base z-index trong `BaseModal`: `100 + modalIndex*10` → **`9000 + modalIndex*10`** (modal thứ nhất = 9010, thứ hai = 9020, ...).
3. Tăng base z-index trong `ConfirmModal`: `200 + modalIndex*10` → **`9100 + modalIndex*10`** — đảm bảo `ConfirmModal` luôn hiển thị trên `BaseModal` khi chúng xuất hiện đồng thời.

**Sidebar z-index (tham khảo):** `z-20` (20) cho body, `z-50` (50) cho nút toggle. Tất cả modal giờ đây ở mức 9000+ — hoàn toàn trên mọi thành phần layout.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/components/modals/SimpleApproveModal.tsx` — convert sang BaseModal, bỏ Portal thủ công + z-[100].
- `src/components/pages/category/components/modals/SimpleRejectModal.tsx` — convert sang BaseModal, bỏ Portal thủ công + z-[100].
- `src/components/common/BaseModal.tsx` ⚠️ **FILE DÙNG CHUNG** — chỉ thay đổi giá trị base z-index.
- `src/components/common/ConfirmModal.tsx` ⚠️ **FILE DÙNG CHUNG** — chỉ thay đổi giá trị base z-index.

---

## Áp dụng quy tắc hiển thị hộp thoại BaseModal cho các modal tab Phê duyệt (Ngày cập nhật: 26/06/2026)

**Nội dung thay đổi:**
Đồng bộ hóa cơ chế hiển thị modal của tab Phê duyệt theo đúng chuẩn của tab Thiết lập danh sách (dùng `BaseModal`).

Trước khi thay đổi, 4 modal của tab Phê duyệt có các vấn đề sau:
- `ExpireRequestModal`, `ExpireApproveModal`: không dùng `Portal`, hiện thị trực tiếp trong DOM — có thể bị cắt bởi `overflow: hidden` của container cha.
- Tất cả 4 modal: dùng z-index cứng (`z-[99999]`, `z-[100]`), không tham gia vào hệ thống quản lý z-index tự động (`window.__activeModalsCount`).
- Không nhất quán: backdrop click, animation, cấu trúc header/body/footer.

Sau khi thay đổi, 4 modal đều dùng `BaseModal` — đảm bảo:
1. **Portal** — render đúng vào `document.body`, tránh bị clip bởi overflow.
2. **Auto z-index** — dùng `window.__activeModalsCount`, tự động xếp chồng đúng khi có modal lồng nhau.
3. **Backdrop click đóng modal** — nhất quán với SetupTab modals.
4. **Animation chuẩn** — `animate-in fade-in duration-200` + `zoom-in-95 duration-300 ease-out`.
5. **Cấu trúc nhất quán** — sticky header (có nút X), scrollable body (`max-h-[95vh]`), sticky footer.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/components/modals/ApprovalRequestModal.tsx` — thay Portal thủ công bằng BaseModal; bỏ import Portal, X.
- `src/components/pages/category/components/modals/ReviewApprovalModal.tsx` — thay Portal + z-[100] bằng BaseModal; icon Send dùng `customHeaderIcon`.
- `src/components/pages/category/components/modals/ExpireRequestModal.tsx` — thêm Portal qua BaseModal; bỏ z-index inline; icon AlertTriangle dùng `customHeaderIcon`.
- `src/components/pages/category/components/modals/ExpireApproveModal.tsx` — thêm Portal qua BaseModal; bỏ z-index inline và import X không dùng; icon KeySquare dùng `customHeaderIcon`; footer dùng `justify-between` trong wrapper div.



## Cập nhật cấu hình khóa và bộ lọc tại Tab Thiết lập cấu trúc (Ngày cập nhật: 26/06/2026)

**Nội dung thay đổi:**
1. **Bổ sung cột "Cấu hình khóa" ngoài màn hình danh sách (Grid):**
   - Thêm cột "Cấu hình khóa" (`Cấu hình khóa`) vào trước cột "Ràng buộc" trong bảng danh sách trường dữ liệu ở cả chế độ Toàn trang (Full Page Mode) và danh sách rút gọn trong chế độ Wizard (Wizard Mode).
   - Tách hiển thị các Badge khóa `PK` (Khóa chính) và `FK` (Khóa ngoại) từ cột Ràng buộc sang cột Cấu hình khóa để giao diện rõ ràng, chuẩn hóa. Cột Ràng buộc chỉ hiển thị các ràng buộc phi khóa (`REQ`, `UNI`, `IDX`).
   - Cập nhật số lượng cột của bảng (`getColSpan()`) tăng lên 1 cột để căn chỉnh chính xác layout khi bảng trống dữ liệu.
   - Loại bỏ ô checkbox chọn ở đầu mỗi dòng dòng dữ liệu trường, thay bằng cột **STT** tự động tính theo trang: `(currentPageNum - 1) * pageSize + idx + 1`.
2. **Nâng cấp bộ lọc tại Tab Thiết lập cấu trúc:**
   - Thay đổi bộ lọc Trạng thái thành bộ lọc Ràng buộc dạng Dropdown cho phép lựa chọn nhiều giá trị cùng lúc (Multi-select) để đồng bộ trải nghiệm với các màn hình lọc khác.
   - Thêm bộ lọc "Cấu hình khóa" cho phép lọc nhanh các trường dữ liệu là Khóa chính (PK), Khóa ngoại (FK) hoặc Không thiết lập.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/components/tabs/AttributesTab.tsx`
- `tailieu/docs/log/log_update.md`

## Cập nhật cấu trúc bảng danh sách thiết lập danh mục (Ngày cập nhật: 26/06/2026)

**Nội dung thay đổi:**
1. **Thay đổi cấu trúc cột của bảng Grid trong Tab Thiết lập danh sách:**
   - Thay đổi các cột hiển thị trong bảng danh sách tại `SetupTab.tsx` thành: STT, Tên danh mục, Cơ sở dữ liệu/ Hệ thống, Đơn vị chủ quản, Phạm vi, Nguồn dữ liệu, Trạng thái, và Thao tác.
   - Thêm cột STT tự động tính theo trang hiện tại: `(currentPageNum - 1) * pageSize + index + 1`.
   - Hiển thị Tên danh mục (loại bỏ hoàn toàn mã danh mục `code` hiển thị bên dưới).
   - Hiển thị Cơ sở dữ liệu / Hệ thống (`databaseSystem`) và Đơn vị chủ quản (`managingAgency`).
   - Hiển thị Phạm vi (`scope`) theo nhãn tương ứng tiếng Việt lấy từ `scopeLabels`.
   - Hiển thị Nguồn dữ liệu (`dataSource`) dưới dạng text thông thường, không sử dụng Badge.
   - Giữ lại cột Thao tác ở cuối bảng để người dùng thực hiện các hành động: Xem chi tiết, Trình duyệt, Sửa, Xóa, Hết hiệu lực.
   - **Đồng bộ hóa kiểu chữ:** Ép cứng kích thước font chữ toàn bộ dữ liệu trong dòng bảng (gồm cả text thông thường, mã định danh, và text trong các badge Nguồn dữ liệu, Trạng thái) về kích thước `13px` (`text-[13px]`) và loại bỏ kiểu chữ đậm (chuyển `font-medium`, `font-semibold` thành `font-normal`).
   - **Căn giữa cột Trạng thái:** Thêm thẻ bọc flex container (`justify-center`) trong cột Trạng thái để đảm bảo các badge trạng thái luôn được hiển thị căn giữa chính xác.
   - **Căn giữa cột Thao tác:** Cập nhật tiêu đề cột Thao tác (`th`) thành căn giữa (`text-center`) và căn giữa các icon hành động trong các ô dữ liệu (`td`) bằng flex container (`justify-center`) để đảm bảo cột Thao tác được hiển thị cân đối, căn giữa chính xác.
   - **Nâng cấp bộ thẻ thống kê (Statistics Cards):** Thay đổi 3 thẻ thống kê cũ (Tổng Dataset, Cơ quan công bố, Chủ đề) thành 4 thẻ mới: **Tổng số danh mục** (tổng số lượng danh mục), **Chờ phê duyệt** (số lượng danh mục đang ở trạng thái `pending_approval`), **Đã phê duyệt** (số lượng danh mục ở trạng thái `active`), và **Từ chối** (số lượng danh mục ở trạng thái `inactive`) để người dùng dễ dàng theo dõi trực quan trạng thái kiểm soát danh mục.
   - **Đồng bộ màu sắc tiêu đề:** Cập nhật màu nền tiêu đề bảng (`thead`) thành màu xám nhạt (`bg-slate-50`) và đường viền dưới thành màu xám (`border-slate-200`) để đồng bộ giao diện thiết kế giống như màn hình Thiết lập quan hệ.
   - **Bổ sung bộ lọc nâng cao:** Tích hợp thêm 2 bộ lọc **Phạm vi** (Tất cả, Cấp quốc gia, Cấp bộ, Cấp tỉnh/thành, Sử dụng nội bộ) và **Nguồn dữ liệu** (Tất cả, Tự cập nhật trực tiếp, Đồng bộ Kho DLDC, Kết nối API NDXP/LGSP) vào bảng bộ lọc nâng cao Collapsible Filter Panel, hỗ trợ tìm kiếm và lọc dữ liệu chính xác.
   - **Đồng bộ hóa màu nền Backdrop của các Modal:** Cập nhật các modal hành động gồm Xóa (`ConfirmModal`), Hết hiệu lực (`ExpireRequestModal`, `ExpireApproveModal`), và Trình duyệt (`ApprovalRequestModal`) sử dụng màu nền mờ 50% (`bg-black/50` kèm hiệu ứng transition `animate-in fade-in duration-200`) và loại bỏ hiệu ứng làm mờ kính (`backdrop-blur-sm`) để thống nhất hoàn toàn với giao diện modal Thêm mới danh mục (`CategoryWizardModal`).
   - **Đồng bộ hóa kích thước font chữ trong các Modal:** Chuẩn hóa kích thước font chữ trong các modal hành động (Xóa, Hết hiệu lực, Trình duyệt) về chính xác `18px` (`text-[18px]`) cho tiêu đề chính (Header) và `13px` (`text-[13px]`) cho toàn bộ phần văn bản, nội dung chi tiết, các trường thông tin và nút bấm hành động (Button).
   - **Tăng z-index của modal Trình duyệt:** Thiết lập `z-index` của modal Trình duyệt danh mục (`ApprovalRequestModal`) lên `z-[99999]` tương đương với các modal hành động khác để hiển thị đè lên thanh Sidebar cố định phía bên trái.
    - **Tinh giản cấu hình Khóa ngoại (FK) khi thiết lập cấu trúc:** Loại bỏ các trường dropdown chọn Bảng tham chiếu và Trường tham chiếu khi người dùng cấu hình ràng buộc loại khóa là Khóa ngoại (FK) tại cả Form thêm nhanh thủ công (bước 2 của Wizard trong `AttributesTab.tsx`) và Modal chỉnh sửa/thêm mới trường dữ liệu (`AttributeFormModal.tsx`), chỉ lưu trữ giá trị loại khóa ngoại (`keyType: 'foreign'`).
     - **Khóa cứng bộ chọn danh mục khi thiết lập quan hệ trong Wizard:** Tại bước 3 (Thiết lập quan hệ) của Wizard thêm mới danh mục dùng chung, cấu hình khóa cứng dropdown chọn danh mục chủ (`SearchableSelect` đặt `disabled={true}`), mặc định hiển thị và cố định theo danh mục đang được tạo.
      - **Căn chỉnh thẳng hàng thanh công cụ Thiết lập quan hệ:** Tách nhãn (label) của bộ chọn danh mục lên hàng trên riêng biệt và đổi văn bản thành "Danh mục đang cấu hình:" khi hiển thị trong modal thiết lập. Phần hộp chọn (SearchableSelect) và nút Thêm mới quan hệ (hoặc nhóm tìm kiếm) được đưa vào một dòng flex-row với căn chỉnh items-center. Nhờ chiều cao đồng bộ h-10 (40px), hộp chọn và nút Thêm mới quan hệ luôn căn chỉnh ngang hàng hoàn hảo với nhau.`.
2. **Cập nhật dữ liệu mẫu (mock data) của các thực thể:**
   - Bổ sung trường `databaseSystem` và đảm bảo trường `dataSource` đầy đủ cho các danh mục mẫu trong `categoryConstants.ts` để hiển thị trực quan và đồng bộ dữ liệu hệ thống trên bảng lưới.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/components/tabs/SetupTab.tsx`
- `src/components/pages/category/components/tabs/RelationshipsTab.tsx`
- `src/components/pages/category/categoryConstants.ts`
- `src/components/common/ConfirmModal.tsx`
- `src/components/pages/category/components/modals/ExpireRequestModal.tsx`
- `src/components/pages/category/components/modals/ExpireApproveModal.tsx`
- `src/components/pages/category/components/modals/ApprovalRequestModal.tsx`
- `tailieu/docs/log/log_update.md`

---

## Thiết lập quan hệ danh mục (Ngày cập nhật: 25/06/2026)

**Nội dung thay đổi:**
1. **Tái cấu trúc Tab Thiết lập quan hệ:**
   - Di chuyển toàn bộ form cấu hình quan hệ trước đây vào modal "Thêm mới quan hệ danh mục" (sử dụng component chuẩn hóa `BaseModal`), đồng thời tối ưu khoảng cách (gap) giữa 2 ô Khóa nguồn và Khóa đích giúp giao diện thoáng đãng, dễ quan sát hơn.
   - Thiết kế giao diện Grid (bảng dữ liệu) trực quan hiển thị danh sách tất cả các quan hệ liên quan đến một danh mục dữ liệu dùng chung.
   - Thêm dropdown chọn danh mục dữ liệu dùng chung (`SearchableSelect` cao cấp) ở đầu tab để người dùng chủ động xem và quản lý quan hệ của từng danh mục.
   - Đồng bộ và chuẩn hóa kích thước font chữ (font size) toàn bộ tab **Thiết lập quan hệ** (các nhãn, mã code, gợi ý, ghi chú, trạng thái liên kết...) và ép cứng tiêu đề bảng (table headers) về kích thước `13px` sử dụng style inline và modifier `!text-[13px]` để đảm bảo hiển thị đồng nhất tuyệt đối.
   - Cung cấp đầy đủ các thao tác Thêm mới, Chỉnh sửa, và Xóa (sử dụng `ConfirmModal` xác nhận trước khi xóa) trực tiếp trên lưới dữ liệu.
   - Loại bỏ cột **Trạng thái** trong bảng danh sách quan hệ và trường chọn trạng thái trong modal Thêm mới/Chỉnh sửa để tinh giản giao diện.
   - Khởi tạo dữ liệu mẫu (mock relationships) ban đầu tại `CategorySetupPage.tsx` giúp giao diện trực quan và sẵn sàng vận hành.
2. **Hạn chế cấu trúc trường đối với Nguồn đồng bộ (Kho DLDC & API/LGSP) trong Tab Thiết lập cấu trúc:**
   - Cập nhật banner thông tin cấu hình (`AttributesTab.tsx`) để hiển thị dòng lưu ý chi tiết khi danh mục hiện tại là nguồn đồng bộ.
   - Khi người dùng nhấn nút **Thêm trường dữ liệu** đối với các danh mục đồng bộ ngoài (`dldc`, `lgsp`, `ndxp`), hệ thống sẽ chặn hành động và hiển thị modal cảnh báo giải thích rõ lý do không được tự ý sửa cấu trúc trường để tránh sai lệch dữ liệu gốc.
3. **Loại bỏ trạng thái "Duyệt một phần" trong Tab Phê duyệt:**
   - Ẩn/loại bỏ tùy chọn bộ lọc "Duyệt một phần" trên thanh trạng thái filter ở tab Phê duyệt.
   - Chuyển đổi logic cập nhật trạng thái khi lãnh đạo phê duyệt (kể cả khi từ chối một số trường dữ liệu con) thì trạng thái tổng thể của yêu cầu vẫn cập nhật thành "Đã phê duyệt" (`approved`).
   - Cập nhật hiển thị fallback cho các trạng thái cũ/thông tin liên quan từ "Duyệt một phần" thành "Đã phê duyệt" để bảo đảm sự đồng nhất trong hệ thống và giao diện người dùng.
4. **Bổ sung cấu hình Khóa chính (PK) và Khóa ngoại (FK) cho Trường dữ liệu:**
   - Thêm trường lựa chọn cấu hình loại khóa ("Không thiết lập", "Khóa chính (PK)", "Khóa ngoại (FK)") trong modal Thêm mới/Chỉnh sửa trường dữ liệu (`AttributeFormModal.tsx`).
   - Khi chọn "Khóa ngoại", hệ thống hiển thị động thêm 2 trường cấu hình: Bảng tham chiếu (dropdown danh sách Danh mục dùng chung) và Trường tham chiếu (dropdown danh sách các trường tương ứng của danh mục được chọn).
   - Khi chọn "Khóa chính", hệ thống tự động tích hợp các ràng buộc liên quan (Bắt buộc, Duy nhất) để tối ưu trải nghiệm người dùng.
   - Bổ sung hiển thị trực quan các tag PK (màu vàng) và FK (màu xanh lá kèm tooltip chi tiết bảng/trường tham chiếu) trong cột Ràng buộc của bảng danh sách cấu trúc trường dữ liệu (`AttributesTab.tsx`).
5. **Sửa lỗi nút "Tiếp tục" tại Bước 2 (Thiết lập cấu trúc) của Wizard:**
   - Khắc phục sự cố đóng modal khi nhấn "Tiếp tục" ở bước 2. Thêm action `'next3'` để lưu lại thay đổi cấu hình nguồn dữ liệu/trường dữ liệu và chuyển tiếp mượt mà sang bước 3 (Thiết lập quan hệ) mà không làm đóng Wizard.
6. **Bổ sung cấu hình Khóa (PK/FK) cho Form thêm nhanh thủ công (Inline Form):**
   - Tích hợp cụm tính năng cấu hình loại khóa (Không thiết lập, Khóa chính, Khóa ngoại) vào Form thêm nhanh trường dữ liệu thủ công (`AttributesTab.tsx` tại bước 2 Wizard khi nguồn dữ liệu là Tự cập nhật thủ công).
   - Tự động đồng bộ trường Bảng tham chiếu (dropdown danh mục dùng chung) và Trường tham chiếu khi chọn Khóa ngoại, đồng thời tự động tích hợp ràng buộc Bắt buộc & Duy nhất khi chọn Khóa chính.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/components/tabs/RelationshipsTab.tsx`
- `src/components/pages/category/components/tabs/AttributesTab.tsx`
- `src/components/pages/category/components/tabs/ApprovalTab.tsx`
- `src/components/pages/category/components/modals/ReviewApprovalModal.tsx`
- `src/components/pages/category/components/modals/AttributeFormModal.tsx`
- `src/components/pages/category/components/modals/CategoryWizardModal.tsx`
- `src/components/pages/category/CategorySetupPage.tsx`
- `src/components/pages/category/categoryTypes.ts`
- `tailieu/docs/log/log_update.md`

---

## Cập nhật chuẩn hóa Hộp thoại (Ngày cập nhật: 25/06/2026)

**Nội dung thay đổi:**
1. **Áp dụng Quy tắc 5.4 Hộp thoại (Dialog / Modal):**
   - Cấu hình z-index động (`100 + modalIndex * 10`) dựa trên số lượng modal đang mở (`window.__activeModalsCount`), đảm bảo thứ tự hiển thị chính xác của các modal chồng nhau (nested modals).
   - Thêm `e.stopPropagation()` vào sự kiện click của lớp Backdrop nhằm ngăn chặn việc lan truyền sự kiện click ra ngoài, triệt tiêu lỗi vô tình đóng Modal 1 khi click ra ngoài Modal 2.
   - Đồng bộ màu nền Backdrop thành mờ 50% (`bg-black/50` hoặc `rgba(0, 0, 0, 0.5)`) và loại bỏ hiệu ứng làm mờ kính (backdrop filter blur) tương tự như modal "Thêm mới giấy phép" bên phân hệ Dữ liệu mở, đảm bảo giao diện sạch sẽ, trực quan và nhất quán.
   - Áp dụng các cải tiến trên cho `BaseModal.tsx`, `ConfirmModal.tsx`, `CategoryWizardModal.tsx`, `EditCategoryModal.tsx`, và tái cấu trúc các modal nội tuyến trong `CategorySetupPageNew.tsx` sử dụng component helper `PortalModal`.

**Các file bị ảnh hưởng:**
- `src/components/common/BaseModal.tsx`
- `src/components/common/ConfirmModal.tsx`
- `src/components/pages/category/components/modals/CategoryWizardModal.tsx`
- `src/components/pages/category/components/modals/EditCategoryModal.tsx`
- `src/components/pages/category/CategorySetupPageNew.tsx`
- `tailieu/docs/log/log_update.md`

---

## Phiên bản 2.5.53 (Ngày cập nhật: 25/06/2026)

**Nội dung thay đổi:**
1. **Mở khóa chỉnh sửa thuộc tính trong cột Thao tác:**
   - Cập nhật logic `isLocked = false` trong grid `AttributesTab.tsx` để nút Sửa và Xóa trong cột Thao tác luôn ở trạng thái hoạt động (active), cho phép chỉnh sửa/xóa bất kỳ thuộc tính dữ liệu nào mà không bị khóa dựa trên trạng thái phê duyệt (approved/pending).

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.52 -> 2.5.53)
- `src/components/pages/category/components/tabs/AttributesTab.tsx`
- `tailieu/docs/log/log_update.md`

---

## Phiên bản 2.5.52 (Ngày cập nhật: 25/06/2026)

**Nội dung thay đổi:**
1. **Chuẩn hóa cấu trúc Grid thuộc tính danh mục dùng chung:**
   - Chuẩn hóa các trường hiển thị trong bảng lưới (Grid) của Tab "Thiết lập cấu trúc" thuộc tính danh mục dùng chung (`AttributesTab.tsx`) để đồng nhất hoàn toàn với các trường trong modal "Thêm mới trường dữ liệu" (`AttributeFormModal.tsx`): Tên trường, Tên hiển thị, Kiểu dữ liệu, Độ dài, Ràng buộc, Giá trị mặc định, Quy tắc xác thực.
   - Thêm logic hiển thị giá trị mặc định `--` đối với các nguồn dữ liệu bên ngoài (như Đồng bộ kho DLDC hoặc API/LGSP) khi không tồn tại giá trị tương ứng, đảm bảo tính nhất quán của giao diện.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.51 -> 2.5.52)
- `src/components/pages/category/components/tabs/AttributesTab.tsx`
- `tailieu/docs/log/log_update.md`

---

## Phiên bản 2.5.51 (Ngày cập nhật: 25/06/2026)

**Nội dung thay đổi:**
1. **Tự động điền thông tin khi chọn tệp dữ liệu mở:**
   - Tự động điền trường "Tên dịch vụ chia sẻ" theo tên tệp dữ liệu mở đã chọn (loại bỏ phần mở rộng tệp).
   - Tự động thiết lập "Phân loại dữ liệu" tương ứng theo danh mục của tệp dữ liệu mở đã chọn (đồng thời hiển thị động tùy chọn này trong thẻ `<select>`).
   - Tự động tạo "Mã định danh API" và "API Context Path" tương thích theo tên danh mục dữ liệu mở được chọn.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.50 -> 2.5.51)
- `src/components/pages/provisioning/modals/ProvisionServiceModal.tsx`
- `tailieu/docs/log/log_update.md`

---

## Phiên bản 2.5.50 (Ngày cập nhật: 25/06/2026)

**Nội dung thay đổi:**
1. **Di chuyển cấu hình gói tin chia sẻ dữ liệu mở:**
   - Chuyển phần cấu hình "Thiết lập gói tin chia sẻ dữ liệu mở" (checkbox và dropdown chọn tệp dữ liệu mở) từ tab "Thiết kế cấu trúc gói tin" (Tab 3) sang tab "Thông tin chung" (Tab 1) của Modal Dịch vụ cung cấp (thêm/sửa) (`ProvisionServiceModal.tsx`).
   - Đặt phần cấu hình này nằm ở phía trên trường "Tên dịch vụ chia sẻ" để tăng tính trực quan khi người dùng khởi tạo dịch vụ.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.49 -> 2.5.50)
- `src/components/pages/provisioning/modals/ProvisionServiceModal.tsx`
- `tailieu/docs/log/log_update.md`

---

## Phiên bản 2.5.49 (Ngày cập nhật: 25/06/2026)

**Nội dung thay đổi:**
1. **Thay đổi thứ tự hiển thị các mục trên Sidebar trong module Dữ liệu mở:**
   - Di chuyển mục "Công bố dữ liệu mở" lên phía trên mục "Danh sách danh mục dữ liệu mở" tại menu Dữ liệu mở.
   - Cập nhật cấu trúc menu tại `Sidebar.tsx`, `menuStructure.ts`, và `extracted_menu.json` để đồng bộ thứ tự hiển thị này.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.48 -> 2.5.49)
- `src/components/layout/Sidebar.tsx`
- `src/components/pages/admin/menuStructure.ts`
- `src/components/layout/extracted_menu.json`
- `tailieu/docs/log/log_update.md`

---

## Phiên bản 2.5.48 (Ngày cập nhật: 25/06/2026)

**Nội dung thay đổi:**
1. **Hiển thị checkbox chỉ đọc cho thuộc tính tự động công bố trong modal Chi tiết và Phê duyệt:**
   - Thay đổi hiển thị thuộc tính "Công bố dữ liệu ngay sau khi được phê duyệt" thành ô checkbox (disabled) trong modal Chi tiết yêu cầu công bố và tab Chi tiết phê duyệt (`OpenDataPublishedListPage.tsx`).
   - Cập nhật nhãn "Cơ quan công bố" thành "Đơn vị chủ trì cung cấp" tại tab Chi tiết phê duyệt để đồng bộ toàn diện.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.47 -> 2.5.48)
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.5.47 (Ngày cập nhật: 25/06/2026)

**Nội dung thay đổi:**
1. **Thêm hiển thị trạng thái Công bố ngay trong modal chi tiết:**
   - Hiển thị trường "Công bố dữ liệu ngay sau khi được phê duyệt" (Có/Không) trong modal xem chi tiết yêu cầu công bố và phần thông tin chi tiết phê duyệt trong `OpenDataPublishedListPage.tsx`.
   - Đồng bộ đổi nhãn "Cơ quan công bố" thành "Đơn vị chủ trì cung cấp" tại các modal xem chi tiết tương ứng.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.46 -> 2.5.47)
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.5.46 (Ngày cập nhật: 25/06/2026)

**Nội dung thay đổi:**
1. **Thêm checkbox Công bố dữ liệu ngay sau khi được phê duyệt:**
   - Thêm checkbox "Công bố dữ liệu ngay sau khi được phê duyệt" dưới trường "Thông tin mô tả" trong tab Thông tin chung của modal Gửi yêu cầu công bố dữ liệu.
   - Tích hợp lưu/chỉnh sửa trạng thái checkbox vào đối tượng yêu cầu công bố dữ liệu.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.45 -> 2.5.46)
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.5.45 (Ngày cập nhật: 25/06/2026)

**Nội dung thay đổi:**
1. **Đổi tên trường trong modal Gửi yêu cầu công bố dữ liệu:**
   - Thay đổi tên trường "Cơ quan công bố" thành "Đơn vị chủ trì cung cấp" trong modal Gửi yêu cầu công bố dữ liệu.
   - Cập nhật các thông báo lỗi (validation alerts, metadata format match errors) và phần xem trước metadata liên quan tương ứng.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.44 -> 2.5.45)
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.5.44 (Ngày cập nhật: 25/06/2026)

**Nội dung thay đổi:**
1. **Tinh gọn giao diện Thiết lập danh mục dữ liệu mở:**
   - Loại bỏ trường chọn "Danh mục cha" khỏi các modal Thêm mới, Xem chi tiết và Chỉnh sửa danh mục dữ liệu mở tại trang Thiết lập danh mục dữ liệu mở.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.43 -> 2.5.44)
- `src/components/pages/open-data/OpenDataSetupPage.tsx`

---

## Phiên bản 2.5.43 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Tinh gọn form Thiết lập danh mục dùng chung:**
   - Xóa bỏ trường "Mô tả mục đích & vai trò" ở Bước 1 (Thông tin chung) trong Modal thêm/sửa danh mục (`CategoryWizardModal.tsx`) để tối giản giao diện nhập liệu.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.42 -> 2.5.43)
- `src/components/pages/category/components/modals/CategoryWizardModal.tsx`

---

## Phiên bản 2.5.42 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Nâng cấp giao diện Modal Thiết lập danh mục:**
   - Chuyển đổi giao diện điều hướng từ dạng Tabs (Thẻ chuyển hướng) sang dạng Stepper (Tiến trình từng bước) giúp người dùng dễ dàng theo dõi trình tự các bước thực hiện.
   - Bổ sung hiệu ứng hình ảnh rõ ràng cho các bước Đã hoàn thành (icon Check), Đang thao tác và Chưa hoàn thành.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.41 -> 2.5.42)
- `src/components/pages/category/components/modals/CategoryWizardModal.tsx`

---

## Phiên bản 2.5.41 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Tinh gọn form Thêm trường dữ liệu:**
   - Xóa bỏ trường nhập liệu "Mô tả ngắn gọn" trong modal thêm/sửa trường dữ liệu (`AttributeFormModal.tsx`).

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.40 -> 2.5.41)
- `src/components/pages/category/components/modals/AttributeFormModal.tsx`

---

## Phiên bản 2.5.40 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Tinh gọn giao diện cấu trúc trường dữ liệu:**
   - Xóa bỏ cột "Trạng thái" và nút "Trình duyệt" trên từng bản ghi trường dữ liệu trong bảng của `AttributesTab.tsx`.
   - Cập nhật hàm tính toán cột `getColSpan()` tương ứng.
   - Xóa bỏ nút "Lưu và Trình duyệt" trong modal Thêm/sửa trường dữ liệu (`AttributeFormModal.tsx`), chỉ giữ lại nút "Lưu".

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.39 -> 2.5.40)
- `src/components/pages/category/components/tabs/AttributesTab.tsx`
- `src/components/pages/category/components/modals/AttributeFormModal.tsx`

---

## Phiên bản 2.5.39 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Thay đổi từ khóa "thuộc tính" sang "trường dữ liệu" (Wording update):**
   - Cập nhật các nhãn, tiêu đề, placeholder và nút bấm trong tab Thiết lập cấu trúc (`AttributesTab.tsx`), trang cấu hình chính (`CategorySetupPage.tsx`) và modal đi kèm (`AttributeFormModal.tsx`) chuyển toàn bộ từ khóa "thuộc tính" (attribute) sang "trường dữ liệu" (data field) để đồng bộ thuật ngữ nghiệp vụ thống nhất.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.38 -> 2.5.39)
- `src/components/pages/category/CategorySetupPage.tsx`
- `src/components/pages/category/components/tabs/AttributesTab.tsx`
- `src/components/pages/category/components/modals/AttributeFormModal.tsx`

---

## Phiên bản 2.5.38 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Thay đổi hiển thị thẻ Trạng thái cấu trúc từ đếm số lượng trường sang trạng thái duy nhất:**
   - Cập nhật `AttributesTab.tsx` và `CategorySetupPage.tsx` để truyền dữ liệu `requests` duyệt cấu trúc.
   - Thẻ "Trạng thái cấu trúc" ở header thay vì đếm số lượng trường theo các trạng thái thì nay hiển thị duy nhất một giá trị trạng thái tổng quát của cấu trúc danh mục (Đã duyệt, Chờ duyệt, Từ chối, hoặc Bản nháp) dựa trên yêu cầu duyệt cấu trúc tương ứng của danh mục đang chọn.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.37 -> 2.5.38)
- `src/components/pages/category/CategorySetupPage.tsx`
- `src/components/pages/category/components/tabs/AttributesTab.tsx`

---

## Phiên bản 2.5.37 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Bổ sung thẻ Trạng thái (Status card) ở phần header của tab Thiết lập cấu trúc (AttributesTab):**
   - Tính toán số lượng thuộc tính theo các trạng thái phê duyệt (Đã duyệt: `approved`, Chờ duyệt: `pending`, Từ chối: `rejected`).
   - Mở rộng lưới grid hiển thị từ 3 cột lên 4 cột và thêm thẻ thống kê "Trạng thái thuộc tính" hiển thị giá trị thống kê của 3 trạng thái trên dưới dạng nhãn màu trực quan (green, orange, red).

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.36 -> 2.5.37)
- `src/components/pages/category/components/tabs/AttributesTab.tsx`

---

## Phiên bản 2.5.36 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Loại bỏ nút "Lưu & trình duyệt" tại thanh công cụ của tab Thiết lập cấu trúc (AttributesTab):**
   - Chỉnh sửa `AttributesTab.tsx` để xóa bỏ hoàn toàn nút bấm **Lưu & trình duyệt** màu xanh lá (onClick={onSaveAndSubmit}) khỏi thanh công cụ theo yêu cầu giao diện mới, chỉ giữ lại nút bấm thêm thuộc tính.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.34 -> 2.5.36)
- `src/components/pages/category/components/tabs/AttributesTab.tsx`

---

## Phiên bản 2.5.35 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi (Đồng bộ code mới từ remote & Cập nhật Lịch sử triển khai):**
1. Thực hiện kéo mã nguồn mới nhất từ remote (`git pull origin main`).
2. Giải quyết xung đột (merge conflict) trong file `package.json` bằng cách giữ phiên bản hiện tại `2.5.34` (so với `2.5.30` từ nhánh remote).
3. Cập nhật phiên bản mới `v2.5.2` vào Lịch sử triển khai (`VersionHistoryModal.tsx`) tổng hợp các thay đổi mới kéo về từ Git và các thay đổi trong ngày.

**Các file bị ảnh hưởng:**
- [package.json](file:///f:/BTP/DLDC_1/package.json)
- [VersionHistoryModal.tsx](file:///f:/BTP/DLDC_1/src/components/modals/VersionHistoryModal.tsx)
- [log_update.md](file:///f:/BTP/DLDC_1/tailieu/docs/log/log_update.md)

---

## Phiên bản 2.5.30 (Ngày cập nhật: 24/06/2026)

> Lưu ý: File thuộc Phân hệ 4 (Đối soát dữ liệu) đang `[ ]` LOCKED. Thay đổi theo **chỉ đạo trực tiếp của PM**, đã duyệt mockup trước khi code. Áp dụng cho **cả 3 màn đối soát** (template dùng chung).

**Nội dung thay đổi (làm lại UI Đối soát theo mockup):**
1. **Bảng danh sách đối soát** (`ReconciliationTemplate.tsx`): đổi cột sang mô hình mới — cột "Thu thập" (mã + tên), **Số bản ghi (Nguồn)**, **Số bản ghi (Kho)**, **Lệch**, Trạng thái, **Ngày đối soát**, Thao tác. Bỏ các cột "Loại đối soát", "Số bản ghi đối soát", "Ngày nhận", "Báo cáo sai lệch", "Tiến trình đồng bộ".
2. **Dòng "Tổng hợp"** cuối bảng: cộng dồn Nguồn/Kho/Lệch của các bản ghi đang lọc.
3. **Thẻ thống kê**: thêm thẻ **"Tỷ lệ khớp"** (tổng hợp), chuyển lưới 3 → 4 cột.
4. **Mock nhất quán**: thêm hàm `deriveCounts` tính Nguồn/Kho/Lệch/Tỷ lệ từ cùng một nguồn (matched → lệch 0, mismatched/error → lệch = số lỗi) → hết mâu thuẫn "đã gửi 0 / sai lệch lớn / vẫn khớp". Mở rộng interface `ReconciliationRecord` thêm `sentCount?`, `receivedCount?`.
5. **Modal chi tiết** (`ReconciliationDetailModal.tsx`): thiết kế lại còn **2 card** (Hệ thống nguồn · Thông tin thu thập gồm tên + mã thu thập), khối **Kết quả đối soát** (Số bản ghi Nguồn/Kho + Sai lệch), tỷ lệ khớp + trạng thái nhất quán; thêm nút **"Đồng bộ lại"** khi lệch; bỏ mã `SYS_HOTICH` hardcode.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/reconciliation/ReconciliationTemplate.tsx`
- `src/components/pages/reconciliation/ReconciliationDetailModal.tsx`

---

## Phiên bản 2.5.29 (Ngày cập nhật: 24/06/2026)

> Lưu ý: File thuộc Phân hệ 4 (Đối soát dữ liệu) đang `[ ]` LOCKED. Thay đổi theo **chỉ đạo trực tiếp của PM**.

**Nội dung thay đổi:**
1. **Ẩn 2 tab "Thiết lập dịch vụ" và "Nhật ký đối soát" ở màn Đối soát Bộ trong ngành** (`InternalReconciliationPage.tsx`) để đồng bộ với các màn Đối soát Bộ ngoài ngành (vốn đã ẩn) — truyền `hideSetupTab={true}` và `hideLogTab={true}` vào `ReconciliationTemplate`. Màn chỉ còn 2 tab: Danh sách đối soát + Lịch sử đối soát.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/reconciliation/InternalReconciliationPage.tsx`

---

## Phiên bản 2.5.28 (Ngày cập nhật: 24/06/2026)

> Lưu ý: File `src/components/pages/provisioning/DataProvisionMonitoringPage.tsx` (màn Kiểm soát & Giám sát cung cấp) thuộc Phân hệ 9 (Cung cấp dữ liệu) đang `[ ]` LOCKED. Thay đổi thực hiện theo **chỉ đạo trực tiếp mở khóa của PM**, đã duyệt mockup trước khi code.

**Nội dung thay đổi (làm lại UI tab Báo cáo theo UC2):**
1. **UC2.1 — Chọn loại báo cáo**: thêm bộ chọn 4 loại ngay trên màn (chip): *Lưu lượng dữ liệu · Số lượt truy cập · Thời gian phản hồi · Lỗi kết nối* (bổ sung "Số lượt truy cập" vốn còn thiếu).
2. **UC2.2 — Biểu đồ trực quan đổi theo loại** (thay biểu đồ cột đơn điệu trước đó):
   - Lưu lượng → **biểu đồ vùng (Area)** gradient.
   - Số lượt truy cập → **biểu đồ đường (Line)**.
   - Thời gian phản hồi → **biểu đồ đường + đường ngưỡng (ReferenceLine)**; **ngưỡng cấu hình được** qua ô nhập inline (mặc định 250ms, state `responseThreshold`), các điểm vượt ngưỡng được tô **đỏ** nổi bật.
   - Lỗi kết nối → **biểu đồ cột (Bar)** màu đỏ.
   - Dữ liệu báo cáo theo **ngày trong tháng** (`reportData` 30 ngày, tổng hợp toàn hệ thống).
3. **Bảng chi tiết** bám theo loại báo cáo đang chọn (Ngày + giá trị, dòng tổng/trung bình), phân trang.
4. **Đồng bộ thuật ngữ**: đổi *"Độ trễ trung bình"* → **"Thời gian phản hồi TB"** ở thẻ chỉ số; đổi tên tab *"Báo cáo hiệu năng đồ thị"* → **"Báo cáo thống kê"**.
5. **Kỹ thuật**: import `AreaChart, Area, LineChart, Line, BarChart, Bar, ReferenceLine` từ `recharts` (thay `ComposedChart, Legend`).
6. Phần **cảnh báo chủ động (UC1.2) tạm gác** theo yêu cầu PM; sơ đồ luồng + nhật ký (UC1.1/1.2) giữ nguyên.
7. **Thêm lựa chọn "Tất cả API"** (đặt mặc định) ở bộ chọn API: thẻ chỉ số + nhật ký hiển thị **số liệu tổng hợp** toàn bộ API (tổng yêu cầu, tỷ lệ thành công bình quân theo lưu lượng, thời gian phản hồi TB, trạng thái gateway tổng); tab Sơ đồ luồng đổi thành **danh sách API kèm trạng thái kết nối** (bấm "Xem sơ đồ" để xem luồng chi tiết 1 API).

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/provisioning/DataProvisionMonitoringPage.tsx`

---

## Phiên bản 2.5.27 (Ngày cập nhật: 23/06/2026)

> Lưu ý: File `src/components/pages/provisioning/DataProvisionMonitoringPage.tsx` (màn Kiểm soát & Giám sát cung cấp) thuộc Phân hệ 9 (Cung cấp dữ liệu) đang `[ ]` LOCKED trong `stauts.md`. Thay đổi dưới đây thực hiện theo **chỉ đạo trực tiếp mở khóa của PM**.

**Nội dung thay đổi:**
1. **Bổ sung biểu đồ trực quan cho tab "Báo cáo hiệu năng đồ thị"** (đáp ứng UC2.2 — trước đó tab chỉ có bảng):
   - Thêm **biểu đồ kết hợp (ComposedChart)** phía trên bảng dữ liệu chi tiết: **cột** thể hiện *Luồng dữ liệu* (trục Y trái), **đường** thể hiện *Lỗi kết nối* (trục Y phải) — dùng 2 trục vì số lỗi nhỏ hơn lưu lượng nhiều lần.
   - Màu theo design system: cột `#2563eb`, đường lỗi `#dc2626`; có lưới, chú thích (Legend), tooltip.
   - Bổ sung import `ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer` từ `recharts`.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/provisioning/DataProvisionMonitoringPage.tsx`

---

## Phiên bản 2.5.26 (Ngày cập nhật: 23/06/2026)

> Lưu ý: File `src/components/collection/CollectionDashboard.tsx` thuộc Phân hệ 2 (Thu thập dữ liệu) đang ở trạng thái `[ ]` LOCKED trong `stauts.md`. Thay đổi dưới đây được thực hiện theo **chỉ đạo trực tiếp mở khóa của PM**.

**Nội dung thay đổi (Dashboard thu thập dữ liệu):**
1. **Biểu đồ "theo phương thức thu thập"** và **"theo kết quả thu thập"**: đổi từ biểu đồ cột sang **biểu đồ tròn dạng donut "Pie with padAngle"** (`innerRadius={55}`, `outerRadius={90}`, `paddingAngle={4}`, `cornerRadius={4}` — có khoảng hở và bo góc giữa các lát), kèm chú thích (Legend) và nhãn phần trăm; **hiển thị "Tổng số" ở chính giữa lỗ donut** (dùng `<Label>` của recharts) và ẩn "Tổng số" ở góc header đối với biểu đồ tròn.
2. **Biểu đồ "theo nguồn cung cấp dữ liệu"**: dùng **biểu đồ cột dọc**, nhãn trục X **xoay nghiêng -35°**, cắt bớt tên dài kèm dấu "…" và hiển thị đầy đủ khi rê chuột (`<title>`); hiện đủ mọi nhãn (`interval={0}`); cột dùng **một màu đồng nhất** (primary `#2563eb`), `maxBarSize={40}`. Biểu đồ này chiếm **2/3 chiều rộng** khối trên (rộng hơn) để đủ chỗ cho nhiều nguồn.
3. **Biểu đồ "theo thời gian"**: đổi từ biểu đồ cột sang **biểu đồ vùng/đường (Area)** với đường cong mượt (`type="natural"`), nét bo tròn (`strokeLinecap/strokeLinejoin="round"`) và **nền màu gradient xanh** phía dưới; trục ngang hiển thị theo từng ngày, **khoảng mặc định là các ngày trong tháng hiện tại, giới hạn tối đa ~1 tháng (31 ngày)**. **Bỏ "Tổng số" và đưa bộ lọc Từ ngày/Đến ngày lên góc phải header** (thêm prop `headerRight` cho `ChartCard`).
4. **Bố cục trang**: khối trên chia theo tỉ lệ 1/3 – 2/3 (`grid-cols-3`) — cột trái (1/3) xếp dọc 2 biểu đồ tròn (mỗi dòng 1 biểu đồ), cột phải (2/3) là biểu đồ nguồn cung cấp; biểu đồ theo thời gian nằm full-width bên dưới. Card biểu đồ nguồn cung cấp dùng `h-full flex flex-col` + vùng biểu đồ `flex-1` (ResponsiveContainer `height="100%"`) để **tự giãn cao bằng đúng cột 2 biểu đồ tròn**, không còn khoảng trắng dư. Donut tối ưu lại (`innerRadius={48}`, `outerRadius={78}`, thêm lề) để hết cắt nhãn % và giảm khoảng trắng.
5. **Kỹ thuật**: thêm prop `chartType` ('bar' | 'pie' | 'line') vào component dùng chung `ChartCard`; bổ sung import `PieChart, Pie, Cell, Legend` từ `recharts`; tách hằng `PIE_COLORS` và `TOOLTIP_STYLE`.
6. **Đồng bộ màu sắc theo design system**:
   - Đổi màu chủ đạo biểu đồ (cột/đường/vùng) từ `#3b82f6` sang primary `#2563eb`.
   - Pie "kết quả thu thập" dùng màu theo ngữ nghĩa trạng thái: Bản nháp (hổ phách `#f59e0b`), Hoạt động (xanh lá `#16a34a`), Ngưng hoạt động (đỏ `#dc2626`).
   - Pie "phương thức thu thập" dùng palette trung tính `#2563eb / #0891b2 / #7c3aed`; palette mặc định bỏ màu đỏ để tránh hiểu nhầm "lỗi".
   - Biểu đồ cột nguồn cung cấp: tô màu **đậm→nhạt theo giá trị** (sắc độ xanh dương) để dễ so sánh thứ hạng.
   - Thẻ Summary đổi sang bộ 3 màu hài hòa: xanh dương (primary) · xanh ngọc (cyan) · tím (violet).

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/collection/CollectionDashboard.tsx`

---

## Phiên bản 2.5.25 (Ngày cập nhật: 22/06/2026)

**Nội dung thay đổi:**
1. **Áp dụng quy tắc 5.4 Hộp thoại (Dialog/Modal) tại Thiết lập danh mục dùng chung > Thiết lập danh sách**:
   - Chuẩn hoá backdrop tất cả modal thành `bg-black/50` (50% opacity) đúng quy tắc 5.4.
   - Chuẩn hoá z-index theo bảng 4.2: standalone modal dùng `z-[100]`, nested modal (FieldFormModal mở từ bên trong AddModal) dùng `z-[200]` để tạo lớp backdrop riêng đè lên modal cha.
   - Chỉnh sửa `CategorySetupPageNew.tsx`: 4 modal (Add, Detail, AddField, FieldForm) — 3 standalone nâng lên `z-[100]`, FieldFormModal nested nâng lên `z-[200]`.
   - Chỉnh sửa `SimpleApproveModal.tsx`: `bg-slate-900/40 z-50` → `bg-black/50 z-[100]`.
   - Chỉnh sửa `SimpleRejectModal.tsx`: `bg-slate-900/40 z-50` → `bg-black/50 z-[100]`.
   - Chỉnh sửa `ApprovalRequestModal.tsx`: `bg-slate-900/40 z-50` → `bg-black/50 z-[100]`.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategorySetupPageNew.tsx`
- `src/components/pages/category/components/modals/SimpleApproveModal.tsx`
- `src/components/pages/category/components/modals/SimpleRejectModal.tsx`
- `src/components/pages/category/components/modals/ApprovalRequestModal.tsx`

---

## Phiên bản 2.5.24 (Ngày cập nhật: 22/06/2026)

**Nội dung thay đổi:**
1. **Thiết kế lại giao diện mục Thiết lập danh mục dùng chung**:
   - Chỉnh sửa tệp `src/components/pages/category/CategorySetupPage.tsx` để di chuyển thanh Tab Header ra bên ngoài card bọc chung, đưa tab content trực tiếp vào vùng đệm `p-6` và đồng bộ font chữ các nút Tab thành `text-[13px] font-medium`.
   - Chỉnh sửa tệp `src/components/pages/category/components/tabs/SetupTab.tsx` để tái cấu trúc giao diện tương tự màn thiết lập dữ liệu mở:
     - Thiết kế lại 3 statistics card ở đầu trang (Tổng Dataset, Cơ quan công bố, Chủ đề) theo dạng phẳng viền mảnh nền trắng (`bg-white border-slate-200 shadow-sm`) và hiển thị các icon tương ứng (`FileText`, `Building2`, `Tag`).
     - Tích hợp thanh tìm kiếm và nút toggle Filter thiết kế bo tròn `rounded-xl`, bổ sung bảng lọc nâng cao collapsible cho trạng thái danh mục.
     - Thiết lập lại Grid Table với khung `rounded-2xl`, tiêu đề cột `text-[13px] font-semibold text-slate-700` và các nút hành động icon inline hover đổi màu mượt mà.
     - Tích hợp thanh phân trang tùy chỉnh (Pagination) ở cuối bảng gồm chọn kích thước trang (`pageSize`), khoảng bản ghi hiện tại và các nút chuyển trang dạng `rounded-xl`.
2. **Thiết kế lại giao diện mục Thiết lập thuộc tính**:
   - Chỉnh sửa tệp `src/components/pages/category/components/tabs/AttributesTab.tsx` để đồng bộ hoàn toàn với thiết kế của tab Thiết lập danh sách:
     - Bổ sung 3 thẻ thống kê ở đầu trang (Tổng thuộc tính, Thuộc tính bắt buộc, Thuộc tính duy nhất) với kiểu dáng nền trắng viền slate mảnh, chữ số lớn nổi bật và icon trực quan.
     - Tái cấu trúc bộ chọn thực thể dữ liệu chủ thành dạng thanh trắng tối giản (`bg-white border-slate-200 shadow-sm`).
     - Đồng bộ thanh tìm kiếm và nút toggle Filter nâng cao, tích hợp panel collapsible cho bộ chọn Trạng thái và Kiểu dữ liệu.
     - Đồng bộ bảng Grid Table: Bo góc `rounded-2xl`, đổi font header sang `text-[13px] font-semibold text-slate-700`, và đổi các nút bấm cột hành động thành icon inline (`Send`, `Edit2`, `Trash2`).
     - Bổ sung thanh phân trang (Pagination) ở cuối bảng thuộc tính giúp chọn kích thước hiển thị và điều hướng trang mượt mà.
3. **Thiết kế lại modal Thiết lập danh mục mới (CategoryWizardModal)**:
   - Chỉnh sửa tệp `src/components/pages/category/components/modals/CategoryWizardModal.tsx` để đồng bộ hoàn toàn với thiết kế modal thêm mới giấy phép bên Dữ liệu mở:
     - Sử dụng nền mờ `bg-black/50` cho backdrop và bo góc modal `rounded-2xl`.
     - Chuyển nền header sang màu trắng trơn, đổi tiêu đề thành chữ thường dạng Title Case `text-[18px] font-semibold text-slate-900` và tinh giản nút đóng X.
     - Chuyển kích cỡ chữ các bước tab thành `text-[13px] font-medium`.
     - Loại bỏ card bọc lồng nhau (`bg-white p-8 rounded-2xl...`) trong thân modal để các trường dữ liệu nằm trực tiếp.
     - Sắp xếp các trường form theo lưới `grid-cols-2 gap-4`, đổi kiểu nhãn label thành `text-[13px] text-slate-700 mb-2 font-medium`.
     - Cập nhật style nền trắng cho các ô input, select (sử dụng custom chevron overlays) và textarea với bo góc `rounded-lg` (8px).
     - Đồng bộ hóa footer modal với màu nền `bg-slate-50`, viền trên và các nút điều hướng bo góc `rounded-lg` (8px) cùng kích cỡ chữ `text-[13px] font-medium`.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategorySetupPage.tsx`
- `src/components/pages/category/components/tabs/SetupTab.tsx`
- `src/components/pages/category/components/tabs/AttributesTab.tsx`
- `src/components/pages/category/components/modals/CategoryWizardModal.tsx`

---

## Phiên bản 2.5.23 (Ngày cập nhật: 22/06/2026)

**Nội dung thay đổi:**
1. **Loại bỏ văn bản mô tả trong thẻ header tại Thống kê dữ liệu mở**:
   - Chỉnh sửa file `src/components/pages/open-data-report/OpenDataReportPage.tsx` để loại bỏ các thẻ `div` mô tả dư thừa dưới các chỉ số KPI ở các tab: **Báo cáo thống kê**, **Báo cáo phân loại**, và **Thống kê lượt truy cập** thuộc phân hệ **Thống kê dữ liệu mở**.
2. **Loại bỏ thẻ Định dạng trong tab Báo cáo thống kê**:
   - Chỉnh sửa file `src/components/pages/open-data-report/OpenDataReportPage.tsx` để xóa thẻ KPI Định dạng (Format) ở header của tab **Báo cáo thống kê**, đồng thời chuyển layout grid từ 4 cột sang 3 cột (`grid-cols-3`) để 3 thẻ còn lại căn đều và tự động lấp đầy chiều rộng dòng.
3. **Khắc phục lỗi trống biểu đồ tại màn Tổng quan quản lý danh mục**:
   - Chỉnh sửa file `src/components/pages/category/CategoryDashboardPage.tsx` để sửa lỗi tương thích kiểu dữ liệu của Recharts trên React 18 bằng cách ép kiểu `any` cho các thành phần vẽ biểu đồ (bao gồm cả `CartesianGridAny`).
   - Khắc phục lỗi chiều cao collapsed của `ResponsiveContainer` bằng việc đổi thuộc tính `height="100%"` sang chiều cao cố định `height={300}` phù hợp với thẻ chứa, qua đó hiển thị chính xác hai biểu đồ *Cơ cấu loại danh mục* và *Tần suất cập nhật & Tạo mới*.
4. **Điều chỉnh thống nhất tên gọi danh mục dùng chung**:
   - Cập nhật cấu trúc menu, sidebar, tiêu đề trang và breadcrumb của các trang thuộc phân hệ quản lý danh mục để thống nhất hậu tố "dùng chung" theo yêu cầu:
     - "Quản lý danh mục" -> "Quản lý danh mục dùng chung"
     - "Tổng quan danh mục" / "Tổng quan Quản lý Danh mục" -> "Tổng quan danh mục dùng chung"
     - "Thiết lập danh mục" -> "Thiết lập danh mục dùng chung"
     - "Danh sách danh mục" / "Biên tập danh mục" -> "Danh sách danh mục dùng chung"
     - "Thống kê danh mục" -> "Thống kê danh mục dùng chung"

**Các file bị ảnh hưởng:**
- `src/components/pages/open-data-report/OpenDataReportPage.tsx`
- `src/components/pages/category/CategoryDashboardPage.tsx`
- `src/components/pages/category/CategoryPage.tsx`
- `src/components/pages/category/CategorySetupPageNew.tsx`
- `src/components/pages/category/CategoryStatisticsReportPage.tsx`
- `src/components/pages/admin/menuStructure.ts`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MainLayout.tsx`

---

## Phiên bản 2.5.22 (Ngày cập nhật: 20/06/2026)

**Nội dung thay đổi:**
1. **Đổi màu nút xem chi tiết trong cột thao tác màn Phê duyệt dữ liệu mở**:
   - Chỉnh sửa file `src/components/pages/open-data/OpenDataApprovalPage.tsx` và `src/components/pages/open-data/OpenDataPublishedListPage.tsx` để đổi màu nút bấm Xem chi tiết (icon mắt `Eye`) trong các bảng danh sách thuộc màn/phân hệ Phê duyệt dữ liệu mở từ màu xanh dương sang màu đen/slate (`text-slate-700 hover:text-black hover:bg-slate-100`).

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/open-data/OpenDataApprovalPage.tsx`
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.5.21 (Ngày cập nhật: 20/06/2026)

**Nội dung thay đổi:**
1. **Ẩn thông tin chung và thêm văn bản mô tả khi bấm từ chối phê duyệt yêu cầu công bố**:
   - Chỉnh sửa file `src/components/pages/open-data/OpenDataPublishedListPage.tsx` để ẩn đi khối thông tin chung của tệp đề xuất khi bấm nút **Từ chối duyệt** (`showRejectForm` bằng true).
   - Thêm hộp văn bản mô tả quy trình/quy định tương tự như bên phê duyệt, nằm ngay phía dưới ô nhập lý do từ chối.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.5.20 (Ngày cập nhật: 20/06/2026)

**Nội dung thay đổi:**
1. **Loại bỏ khối thông tin chung trong modal Phê duyệt yêu cầu công bố khi mở form phê duyệt**:
   - Chỉnh sửa file `src/components/pages/open-data/OpenDataPublishedListPage.tsx` để ẩn đi khối thông tin tệp đề xuất/thông tin chung khi người dùng bấm nút **Phê duyệt & Công bố** (`showApproveForm` bằng true). Việc này giúp tối ưu hóa không gian hiển thị, tránh việc phần nhập ý kiến bị đẩy xuống quá xa hoặc gây tràn màn hình.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.5.19 (Ngày cập nhật: 20/06/2026)

**Nội dung thay đổi:**
1. **Thiết kế lại tiêu đề (Header) của các modal trong tab Metadata**:
   - Tăng kích thước font chữ tiêu đề (Header Title) lên `18px` (`text-[18px]`) cho các modal tương tác trong tab Metadata: modal Chi tiết Metadata (`showViewMetadataModal`) và modal Thêm mới/Chỉnh sửa Metadata (`showMetadataModal`).
   - Loại bỏ các phần mô tả phụ không cần thiết nằm ngay dưới tiêu đề của các modal này.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/open-data/OpenDataSetupPage.tsx`

---

## Phiên bản 2.5.18 (Ngày cập nhật: 20/06/2026)

**Nội dung thay đổi:**
1. **Loại bỏ khối thông tin danh mục trùng lặp trong modal Phê duyệt danh mục**:
   - Chỉnh sửa file `src/components/pages/open-data/OpenDataSetupPage.tsx` để xóa bỏ khối thông tin chi tiết danh mục ở phía dưới ý kiến phê duyệt (bao gồm Tên danh mục, Mã danh mục, Đơn vị chủ trì, Định dạng dữ liệu) trong modal Phê duyệt danh mục (`showApprovalModal` với hành động `approved`) nhằm làm giao diện trực quan và tránh lặp lại thông tin đã hiển thị ở phần trên.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/open-data/OpenDataSetupPage.tsx`

---

## Phiên bản 2.5.17 (Ngày cập nhật: 20/06/2026)

**Nội dung thay đổi:**
1. **Thiết kế lại tiêu đề (Header) của các modal trong tab Quản lý danh mục**:
   - Tăng kích thước font chữ tiêu đề (Header Title) lên `18px` (`text-[18px]`) cho tất cả các modal tương tác trong tab Quản lý danh mục, bao gồm: modal Thêm danh mục mới (`showAddModal`), modal Chi tiết danh mục (`showViewModal`), modal Chỉnh sửa danh mục (`showEditModal`), modal Xác nhận xóa (`showDeleteModal`), và modal Trình duyệt danh mục (`showApprovalModal` với hành động `pending`).
   - Loại bỏ các phần mô tả phụ không cần thiết nằm ngay dưới tiêu đề của các modal này.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/open-data/OpenDataSetupPage.tsx`

---

## Phiên bản 2.5.16 (Ngày cập nhật: 20/06/2026)

**Nội dung thay đổi:**
1. **Đổi màu nút Lưu tại modal Thêm mới & Chỉnh sửa danh mục**:
   - Thay đổi màu nền và màu hover của nút **Lưu** từ màu xanh lá (`bg-emerald-600 hover:bg-emerald-700`) sang màu xanh dương của hệ thống (`bg-blue-600 hover:bg-blue-700`) trong cả hai modal Thêm mới danh mục (`showAddModal`) và Chỉnh sửa danh mục (`showEditModal`) tại màn hình Thiết lập danh mục dữ liệu mở.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/open-data/OpenDataSetupPage.tsx`

---

## Phiên bản 2.5.15 (Ngày cập nhật: 20/06/2026)

**Nội dung thay đổi:**
1. **Đổi màu dấu bắt buộc (*) trong modal thêm mới và sửa danh mục**:
   - Chỉnh sửa file `src/components/pages/open-data/OpenDataSetupPage.tsx` để đổi màu của các dấu hoa thị bắt buộc (`*`) trong form của modal thêm mới (`showAddModal`) và sửa danh mục (`showEditModal`) sang màu đỏ (`text-red-500`).

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/open-data/OpenDataSetupPage.tsx`

---

## Phiên bản 2.5.14 (Ngày cập nhật: 20/06/2026)

**Nội dung thay đổi:**
1. **Đổi màu chữ các bộ lọc nâng cao sang màu đen**:
   - Chỉnh sửa nhãn (label) của bộ lọc tại các tab **Giấy phép**, **Quản lý danh mục**, **Phê duyệt danh mục**, và **Metadata** để đổi màu chữ từ màu xám (`text-slate-500`) sang màu đen (`text-black`).

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/open-data/OpenDataSetupPage.tsx`

---

## Phiên bản 2.5.13 (Ngày cập nhật: 20/06/2026)

**Nội dung thay đổi:**
1. **Chỉnh sửa kích thước font và kiểu chữ trong các bộ lọc**:
   - Chỉnh sửa nhãn (label) của bộ lọc tại các tab **Giấy phép**, **Quản lý danh mục**, **Phê duyệt danh mục**, và **Metadata** về kích thước font `13px` (`text-[13px]`) và đổi kiểu chữ từ in đậm sang thường (`font-normal`) thay vì `text-xs font-semibold` cũ.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/open-data/OpenDataSetupPage.tsx`

---

## Phiên bản 2.5.12 (Ngày cập nhật: 20/06/2026)

**Nội dung thay đổi:**
1. **Thiết kế lại tiêu đề (Header) của modal Giấy phép**:
   - Tăng kích thước font chữ tiêu đề (Header Title) cho các modal Thêm mới, Chỉnh sửa, và Xem chi tiết giấy phép lên `18px` (`text-[18px]`).
   - Loại bỏ đoạn văn bản mô tả nằm phía dưới tiêu đề để giao diện gọn gàng hơn.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/open-data/OpenDataSetupPage.tsx`

---

## Phiên bản 2.5.11 (Ngày cập nhật: 20/06/2026)

**Nội dung thay đổi:**
1. **Đổi màu dấu bắt buộc (*) trong modal Giấy phép sang màu đỏ**:
   - Chỉnh sửa file `src/components/pages/open-data/OpenDataSetupPage.tsx` để đổi màu các dấu hoa thị bắt buộc (`*`) trong form của modal Giấy phép (Thêm mới, Xem chi tiết, Chỉnh sửa) sang màu đỏ (`text-red-500`) theo đúng chuẩn thiết kế hệ thống.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/open-data/OpenDataSetupPage.tsx`

---

## Phiên bản 2.5.10 (Ngày cập nhật: 20/06/2026)

**Nội dung thay đổi:**
1. **Sửa lỗi badge trạng thái bị xuống dòng ở tab Giấy phép**:
   - Thêm class `whitespace-nowrap` vào các badge hiển thị trạng thái "Còn hiệu lực" và "Hết hiệu lực" tại bảng danh sách Giấy phép thuộc màn hình **Thiết lập danh mục dữ liệu mở** (`OpenDataSetupPage.tsx`) để tránh tình trạng chữ bị xuống dòng khi co giãn màn hình.
   - Thêm class `whitespace-nowrap` vào badge trạng thái trong hàm `getStatusBadge` và `getApprovalStatusBadge` để thống nhất hành vi hiển thị không bị ngắt dòng cho tất cả các tab khác.

**Các file bị ảnh hưởng:**
- `package.json`
- `src/components/pages/open-data/OpenDataSetupPage.tsx`

---

## Phiên bản 2.5.9 (Ngày cập nhật: 19/06/2026)

**Nội dung thay đổi:**
1. **Thiết kế lại luồng Phê duyệt & Công bố trong trang Quản lý yêu cầu công bố**:
   - Thay đổi nút **"Phê duyệt & Công bố"** để mở form xác nhận phê duyệt dạng inline ngay bên dưới nội dung chi tiết của modal thay vì mở một popup modal đè lên (`showApproveConfirmModal`).
   - Hành vi toggle inline form này tương tự như luồng của nút **"Từ chối duyệt"**.
   - Khi chọn Phê duyệt & Công bố, hiển thị Textarea nhập ý kiến phê duyệt và danh sách "Sau khi phê duyệt" cùng với hai nút hành động: **"Quay lại"** (quay lại màn hình xem metadata ban đầu) và **"Xác nhận Phê duyệt"** (để tiến hành phê duyệt).
   - Tối ưu hóa giao diện và kích thước font chữ đồng bộ ở mức `13px` (`text-[13px]`) và không in đậm (`font-normal`) cho toàn bộ form và nút hành động.
2. **Khắc phục lỗi mất dữ liệu xem trước dòng đầu**:
   - Định nghĩa hàm helper `getPreviewFallback` để lấy tiêu đề cột và hàng dữ liệu mẫu tương ứng với từng danh mục dữ liệu mở khi tệp dữ liệu hoặc API không có sẵn thông tin xem trước.
   - Bổ sung thông tin tiêu đề và dữ liệu hàng cho bản ghi **API Danh sách Luật sư Việt Nam** (id: '6') trong mockPublishedData.
   - Cập nhật hàm `createNewRecord` để điền tự động dữ liệu xem trước khi người dùng đăng ký đề xuất công bố mới có định dạng chia sẻ là API.
   - Cập nhật logic render JSX của tab **Xem trước dữ liệu dòng đầu** trong modal phê duyệt yêu cầu để tự động sử dụng dữ liệu dự phòng từ `getPreviewFallback` khi dữ liệu xem trước của bản ghi bị trống, đồng thời đồng bộ giao diện header bảng sử dụng `font-semibold text-slate-500 bg-slate-50` theo chuẩn thiết kế.
3. **Đồng bộ nhãn thanh tab và cỡ chữ trong phân hệ Công bố dữ liệu mở**:
   - Đổi tên tab **"Phê duyệt"** thành **"Phê duyệt dữ liệu mở"** để mô tả chính xác và nhất quán với phân hệ.
   - Ép toàn bộ kích thước font chữ của thanh tab, thanh tìm kiếm, các nút bấm, bộ chọn lọc và các bảng grid về cỡ chữ `13px` (`text-[13px]`) theo đúng tiêu chuẩn hệ thống thiết kế.

**Các file bị ảnh hưởng:**
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.4.8 — Patch 4 (Ngày cập nhật: 19/06/2026)

**Nội dung thay đổi:**
1. **Thiết kế lại trường "Nguồn dữ liệu" trong modal Metadata thành "Cấu hình Nguồn dữ liệu"**:
   - Thay thế checkbox đơn giản ("Tải tệp", "API") bằng UI cấu hình database/table đầy đủ.
   - Thêm dropdown chọn **cơ sở dữ liệu đích** (CSDL Hộ tịch, Địa chính, Dân số, Tư pháp).
   - Sau khi chọn CSDL: hiển thị dropdown chọn **bảng dữ liệu chính** (Primary Table).
   - Toggle **"Sử dụng liên kết bảng (Join)"**: khi bật, hiện section bảng liên kết bổ sung.
   - Mỗi bảng join có: kiểu liên kết (LEFT/INNER/RIGHT JOIN), bảng bổ sung, điều kiện join (cột trái = cột phải), nút xóa, alias tự động.
   - Thêm nút **"+ Thêm bảng liên kết"** để thêm nhiều bảng join.
2. **Đổi options trường "Định dạng"**: CSV/JSON/XML/Excel/PDF → **File Excel** và **API** (giữ multi-select checkbox).

**Các file bị ảnh hưởng:**
- `src/components/pages/open-data/OpenDataSetupPage.tsx` (thêm types `JoinTable`, `DataSourceConfig`; thêm constants `MOCK_DATABASES`, `MOCK_TABLES`, `TABLE_COLUMNS`, `DEFAULT_DATA_SOURCE`; thêm state `dataSourceConfig`; thay thế UI Nguồn dữ liệu)

---

## Phiên bản 2.4.8 — Patch 3 (Ngày cập nhật: 19/06/2026)

**Nội dung thay đổi:**
1. **Xóa trường "Tên tệp dữ liệu" khỏi modal Thêm mới/Chỉnh sửa Metadata**:
   - Phân hệ: Dữ liệu mở > Thiết lập danh mục dữ liệu mở > tab Metadata
   - Xóa input field "Tên tệp dữ liệu" khỏi cả modal Thêm mới và Chỉnh sửa metadata (dùng chung form).
   - Cập nhật validation: bỏ điều kiện bắt buộc `!metadataFormData.fileName`, chỉ còn kiểm tra `categoryCodes`.

**Các file bị ảnh hưởng:**
- `src/components/pages/open-data/OpenDataSetupPage.tsx` (xóa form field, cập nhật validation)

---

## Phiên bản 2.4.8 — Patch 2 (Ngày cập nhật: 18/06/2026)

**Nội dung thay đổi:**
1. **Đổi tên mục menu trong phân hệ Dữ liệu mở**:
   - "Thiết lập danh mục" → **"Thiết lập danh mục dữ liệu mở"**
   - "Danh sách danh mục" → **"Danh sách danh mục dữ liệu mở"**
   - Các mục tương tự trong **Quản lý danh mục** (`category-setup`, `category-list`) giữ nguyên, không bị ảnh hưởng.

**Các file bị ảnh hưởng:**
- `src/components/layout/Sidebar.tsx` (nhãn menu hiển thị người dùng, `id: open-data-setup` và `id: open-data-category-list`)
- `src/components/pages/admin/menuStructure.ts` (cấu trúc phân quyền, `id: open-data-setup`, `open-data-setup-func`, `open-data-category-list`)


1. **Chuyển đổi tông màu Thống kê dữ liệu mở sang xanh dương chủ đạo**:
   - Thay đổi toàn bộ các tabs ("Tìm kiếm và lọc", "Báo cáo thống kê", "Báo cáo phân loại", "Thống kê lượt truy cập") từ thiết kế màu xanh lá/emerald (`emerald`) sang màu xanh dương (`blue`) đồng bộ với hệ thống.
   - Cập nhật các màu nền của tab active (`bg-blue-50`), màu text active (`text-blue-600` / `text-blue-700`), và đường viền active (`border-blue-600`).
   - Cập nhật các ô nhập liệu tìm kiếm, bộ lọc, input selection focus states (`focus:ring-blue-500` / `focus:border-blue-500`).
   - Thay đổi style các nút Tìm kiếm, Xử lý dữ liệu, Thiết lập báo cáo, v.v., sang màu xanh dương chủ đạo (`bg-blue-600 hover:bg-blue-700`).
   - Cập nhật màu sắc của biểu đồ (BarChart fill, Line stroke trong Recharts) từ màu xanh lá/emerald (`#10b981`, `#059669`) sang màu xanh dương (`#2563eb`, `#3b82f6`) và cập nhật mảng màu COLORS.
   - Thay đổi các badges, text trends, và các biểu tượng (Filter, TrendingUp, PieChart, BarChart3, Download, Building2) thành màu xanh dương.
2. **Đồng bộ thiết kế thanh tìm kiếm, bộ lọc và các nút hành động (Yêu cầu công bố)**:
   - Thiết kế lại hàng tìm kiếm của Tab **Yêu cầu công bố** (`OpenDataPublishedListPage.tsx`) đồng bộ theo phong cách của mục **Thiết lập danh mục > tab Giấy phép**:
     - Ô nhập tìm kiếm (Input) sử dụng bo góc `rounded-xl` (12px), padding `py-2.5`, text `text-[14px]`, không chứa icon Search bên trong, placeholder đổi thành "Tìm kiếm theo mã, tên tệp dữ liệu...".
     - Nút Tìm kiếm (`Search`) màu xanh dương, nút Bộ lọc nâng cao (`Filter`) màu trắng viền nhạt, đều có bo góc `rounded-xl` và hiệu ứng active scale-95.
     - Tích hợp thêm nút **Import** và **Export** dạng `rounded-xl` màu trắng viền nhạt và nút **Gửi yêu cầu công bố** dạng `rounded-xl` màu xanh dương đồng bộ hoàn toàn với thiết kế giao diện của hệ thống thiết lập danh mục dữ liệu mở.

**Các file bị ảnh hưởng:**
- `src/components/pages/open-data/OpenDataStatisticsPage.tsx`
- `src/components/pages/open-data-report/OpenDataReportPage.tsx`
- `src/components/pages/open-data/OpenDataReportPage.tsx`
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

## Phiên bản 2.4.8 — Patch 1 (Ngày cập nhật: 18/06/2026)

**Nội dung thay đổi:**
1. **Đồng bộ thiết kế Lịch công bố dữ liệu mở**:
   - Chỉnh sửa lại thiết kế màn hình **Lịch công bố** (Tab 4 của màn hình Công bố dữ liệu mở `open-data/OpenDataPublishedListPage.tsx`) đồng bộ với giao diện của Tab **Yêu cầu công bố**.
   - Thiết kế lại thanh tìm kiếm: Chuyển icon Search ra ngoài ô nhập liệu thành một nút Tìm kiếm riêng biệt màu xanh dương (`bg-blue-600`), loại bỏ icon bên trong input, tăng bo góc thành `rounded-2xl`, đổi placeholder thành "Tìm kiếm theo mã, tên tập dữ liệu...".
   - Chuyển bộ lọc nâng cao (Tần suất công bố, Trạng thái lịch) vào panel rút gọn dạng collapsible (`showFilters`), kích hoạt bằng nút Toggle Filter màu xanh dương/xám.
   - Loại bỏ lớp bọc ngoài (card wrapper `bg-white border rounded-xl p-4 shadow-sm`) tại thanh tìm kiếm, bộ lọc, và nút hành động của màn hình Lịch công bố (`OpenDataPublishedListPage.tsx`) để các thành phần này nằm trực tiếp trên nền xám nhạt.
   - Nút **Thêm lịch mới** được thiết kế lại với phong cách Button Primary bo góc tròn mềm mại (`rounded-xl px-5 py-2.5 text-[14px] font-medium transition-all active:scale-95`).
   - Cập nhật định dạng hàng của bảng dữ liệu lịch công bố: điều chỉnh padding và cỡ chữ của các ô (TD) sang `px-4 py-3 text-[13px]`, đồng bộ badge trạng thái hoạt động/tạm dừng (`font-medium`).

**Các file bị ảnh hưởng:**
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

## Phiên bản 2.4.8 (Ngày cập nhật: 17/06/2026)

**Nội dung thay đổi:**
1. **Đồng bộ thiết kế Danh sách danh mục dữ liệu mở**:
   - Đồng bộ thiết kế của màn hình **Danh sách tổ chức thực hiện trợ giúp pháp lý** (và các màn hình danh sách A-J khác) giống với màn hình **Thiết lập danh mục dữ liệu mở** (`open-data/OpenDataSetupPage.tsx`).
   - Cấu trúc lại `OpenDataCategoryPage.tsx`: Loại bỏ card wrapper bên ngoài và lớp nền xám nhạt ở tab content để đưa thanh tab (`OpenDataCategoryTabBar.tsx`) ra ngoài, kéo rộng toàn màn hình.
   - Thiết kế lại thanh tìm kiếm và bộ lọc: Loại bỏ icon Search bên trong ô nhập, bổ sung nút Search màu xanh dương và nút bộ lọc nâng cao toggle.
   - Nâng cấp bộ lọc nâng cao (`OpenDataCategoryFilterPanel`) hỗ trợ caret chỉ lên trỏ vào nút bộ lọc và đồng bộ shadow.
   - Gộp hàng tìm kiếm và bộ lọc nâng cao vào trong cùng một Card wrapper (`FilesTab.tsx`).
   - Đồng bộ hóa bảng dữ liệu (`OpenDataCategoryGrid.tsx` và `VersionHistoryTab.tsx`): Chuyển đổi khoảng cách padding và cỡ chữ các ô (TD) về `px-4 py-3 text-[13px]`, đồng bộ các nút Thao tác hành động sang `rounded-lg`.
   - Đồng bộ thanh phân trang (`OpenDataCategoryPagination.tsx`): Cấu hình bộ chọn số lượng dòng trên trang sang `10`, `20`, `50`, `100` và cập nhật style bo góc `rounded-lg` và ring focus.
   - Loại bỏ lớp bọc ngoài (card wrapper `bg-white border rounded-xl p-4 shadow-sm`) tại thanh tìm kiếm, bộ lọc, và nút hành động của màn hình Thiết lập danh mục dữ liệu mở (`OpenDataSetupPage.tsx`) cho tất cả các tab (Giấy phép, Quản lý danh mục, Phê duyệt, Metadata, Lịch sử thay đổi) để các thành phần này nằm trực tiếp trên nền xám nhạt, đồng bộ với thiết kế của màn hình Danh sách.
2. **Đồng bộ luồng và cấu hình dữ liệu**:
   - Lưu trữ và đồng bộ hóa danh sách dịch vụ (`provision_services`), phân quyền (`provision_permissions`), và tài khoản (`provision_accounts`) vào `localStorage`.
   - Cấu hình cho modal API cung cấp (`ProvisionApiModal.tsx`) tự động truy vấn đơn vị nhận mặc định từ các dịch vụ đã được thiết lập để hiển thị dưới dạng badge chỉ đọc (read-only) tương ứng khi chọn hoặc chỉnh sửa API.
   - Tự động điền dữ liệu `consumerUnit` (Đơn vị nhận mặc định) của dịch vụ khi khởi tạo, đồng thời đồng bộ hóa các đơn vị nhận mặc định sang tab Phân quyền truy cập và Danh sách tài khoản khi người dùng chọn API tương ứng.
   - Cập nhật modal tạo tài khoản mới (`ProvisionAccountModal.tsx`) để lấy danh sách đơn vị từ tài khoản hiện tại kết hợp danh sách đơn vị mặc định của hệ thống.
   - Bổ sung nút Chỉnh sửa tài khoản tại tab Danh sách tài khoản và nút Xem chi tiết (icon Eye) trước nút Sửa thông tin API.
   - Loại bỏ thanh tìm kiếm tại màn Phân quyền truy cập, loại bỏ cột "API được phép gọi" và API được phép truy cập trong danh sách/modal tài khoản.
   - Thay đổi phương thức khai báo Đơn vị được cấp quyền trong modal Tạo tài khoản thành nhập tay tự do (input text).
   - Nút làm mới App Key được cập nhật sang Custom Modal UI an toàn và hỗ trợ sao chép Key mới.
3. **Breadcrumb và định tuyến chi tiết (Routing)**:
   - Cập nhật breadcrumb phân cấp chi tiết cho Dashboard, Thiết lập điều phối, Quản lý API, Đối soát và các dịch vụ cung cấp danh mục.
   - Đồng bộ trạng thái Tab với URL Query Parameter `tab` trong `DataProvisionServiceSetupPage.tsx`, `DataProvisionApiManagementPage.tsx` và `DataProvisionServicesPage.tsx`.
3. **Thiết kế lại trang Yêu cầu sử dụng dữ liệu (`DataProvisionRequestPage.tsx`)**:
   - Di chuyển thanh Tab chính ra ngoài container và bổ sung biểu tượng và số lượng bản ghi cho các tab.
   - Thiết kế lại bộ lọc collapsible nâng cao và nút Tạo yêu cầu với màu xanh dương chủ đạo.
   - Đồng bộ hóa bảng dữ liệu (cỡ chữ 13px, header màu xám nhạt, hover styles) và bổ sung phân trang.
   - Áp dụng quy tắc 5.4 Hộp thoại (z-index 999999, backdrop `bg-black/50`) cho các modal bàn giao, công khai, phê duyệt...
4. **Đồng bộ thiết kế mục Kiểm soát & Giám sát cung cấp (`DataProvisionMonitoringPage.tsx` và `AuditLogsTab.tsx`)**:
   - Chuyển tông màu chủ đạo từ màu hổ phách/cam sang màu xanh dương cho nút xuất báo cáo, active tabs, bộ chọn select API, cổng API Gateway, đồ thị AreaChart và các icons.
   - Thêm bộ phân trang động ở cuối bảng dữ liệu chi tiết lưu lượng và bảng Audit logs.
   - Ép font chữ toàn trang và các components con về kích thước `13px` thông qua class root và style inline.
   - Áp dụng quy tắc Hộp thoại 5.4 cho modal chi tiết logs và modal xuất báo cáo.
5. **Dịch vụ chia sẻ & Sửa lỗi React Error #31**:
   - Sửa lỗi React Error #31 (Objects are not valid as a React child) tại modal Cấu hình trường bằng cách loại bỏ ký tự thừa `, document.body` ở phần `return` của modal `SharedFieldsConfigModal.tsx` khi chuyển đổi sang sử dụng component wrapper `<Portal>`.
   - Thiết kế lại giao diện của modal `SharedFieldsConfigModal.tsx` và trang `DataProvisionServicesPage.tsx` sang tông màu xanh dương chủ đạo của hệ thống (`bg-blue-600`, `text-blue-700`, v.v.) và cỡ chữ `13px` theo quy định.

**Các file bị ảnh hưởng:**
- `src/components/pages/open-data/OpenDataSetupPage.tsx`
- `src/components/pages/open-data-category/OpenDataCategoryPage.tsx`
- `src/components/pages/open-data-category/components/OpenDataCategoryTabBar.tsx`
- `src/components/pages/open-data-category/components/OpenDataCategoryFilters.tsx`
- `src/components/pages/open-data-category/components/OpenDataCategoryActions.tsx`
- `src/components/pages/open-data-category/components/tabs/FilesTab.tsx`
- `src/components/pages/open-data-category/components/tabs/OpenDataCategoryGrid.tsx`
- `src/components/pages/open-data-category/components/tabs/OpenDataCategoryPagination.tsx`
- `src/components/pages/open-data-category/components/tabs/VersionHistoryTab.tsx`
- `src/components/layout/MainLayout.tsx`
- `src/components/pages/provisioning/DataProvisionServiceSetupPage.tsx`
- `src/components/pages/provisioning/DataProvisionApiManagementPage.tsx`
- `src/components/pages/provisioning/DataProvisionServicesPage.tsx`
- `src/components/pages/provisioning/modals/ApiVersionCompareModal.tsx`
- `src/components/pages/provisioning/DataProvisionRequestPage.tsx`
- `src/components/pages/provisioning/modals/ProvisionDataRequestModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionRequestApprovalModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionRequestExportModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionHandoverDetailModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionPublishDetailModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionRequestHandoverModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionServicePublishModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionServiceUnpublishModal.tsx`
- `src/components/pages/provisioning/DataProvisionMonitoringPage.tsx`
- `src/components/pages/provisioning/tabs/AuditLogsTab.tsx`
- `src/components/pages/provisioning/modals/ProvisionExportReportModal.tsx`
- `src/components/pages/provisioning/modals/SharedFieldsConfigModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccessControlModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionAccountModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionServiceModal.tsx`
- `src/components/pages/provisioning/modals/ProvisionApiModal.tsx`
- `package.json`
- `CHANGELOG.md`
- `src/components/modals/VersionHistoryModal.tsx`

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

---

## Phiên bản 2.4.9 (Ngày cập nhật: 18/06/2026)

**Nội dung thay đổi:**
1. **Thiết kế đồng bộ tại tab Yêu cầu công bố và tab Phê duyệt (Công bố dữ liệu mở):**
   - Loại bỏ card bọc ngoài (card container) tại thanh công cụ tìm kiếm, bộ lọc và các nút chức năng.
   - Thiết kế lại ô nhập liệu tìm kiếm, nút kích hoạt tìm kiếm, và nút đóng/mở bộ lọc nâng cao sử dụng cấu trúc bo góc `rounded-xl` (12px), độ cao nhất quán, màu nền hover/focus và hiệu ứng chuyển đổi trạng thái nhẹ nhàng.
   - Di chuyển bảng bộ lọc nâng cao thành khối riêng độc lập bên dưới thanh tìm kiếm chính để giao diện trở nên thông thoáng và chuyên nghiệp.
   - Loại bỏ hoàn toàn hai nút Import/Export khỏi thanh công cụ của cả hai tab Yêu cầu công bố và Phê duyệt.
   - Định dạng lại nút hành động "Gửi yêu cầu công bố" sử dụng thiết kế góc bo tròn `rounded-xl` (12px) thống nhất với hệ thống.
2. **Thiết kế đồng bộ tại tab Lịch công bố:**
   - Loại bỏ khung bọc ngoài (card container) tại thanh công cụ tìm kiếm, bộ lọc và các nút chức năng.
   - Thiết kế lại ô nhập liệu tìm kiếm, nút kích hoạt tìm kiếm, và nút đóng/mở bộ lọc nâng cao sử dụng cấu trúc bo góc `rounded-xl` (12px), độ cao nhất quán, màu nền hover/focus và hiệu ứng chuyển đổi trạng thái nhẹ nhàng.
   - Chuyển bộ lọc tần suất công bố và trạng thái lịch vào bảng bộ lọc nâng cao hiển thị động bên dưới.
   - Định dạng lại nút hành động "Thêm lịch mới" sử dụng thiết kế góc bo tròn `rounded-xl` (12px) thống nhất với hệ thống.
3. **Cập nhật giao diện thanh chọn Tab (Tabs Header):**
   - Loại bỏ thuộc tính chữ đậm (`font-semibold`) khi một tab được kích hoạt/lựa chọn tại màn hình **Công bố dữ liệu mở**, chuyển về thuộc tính chữ thường vừa (`font-medium`) đồng nhất.
4. **Cải tiến quy trình Gửi yêu cầu công bố (Yêu cầu công bố):**
   - Chuyển đổi trường nhập tự do "Tên tập dữ liệu" thành danh sách lựa chọn (`select`) từ danh mục tệp dữ liệu đã được thiết lập/cấu hình metadata trước đó.
   - Hỗ trợ tự động điền (autofill) các thông tin metadata đi kèm bao gồm: Danh mục dữ liệu mở, Giấy phép, Từ khóa, Cơ quan công bố và Mô tả.
   - Cho phép người dùng chỉnh sửa các trường thông tin tự động điền này, đồng thời tích hợp cơ chế validate thời gian thực (real-time validation) để đảm bảo các dữ liệu sau khi sửa đổi vẫn nằm trong phạm vi cấu hình metadata cho phép (báo lỗi và chặn gửi yêu cầu / lưu nháp nếu vi phạm).

5. **Cải tiến Modal Chi tiết tệp dữ liệu mở (Thiết lập danh mục):**
   - Thiết kế lại Modal Xem chi tiết của tệp dữ liệu mở thuộc Danh mục dữ liệu mở có giao diện đồng bộ với Modal Gửi yêu cầu công bố mới.
   - Hiển thị đầy đủ thông tin: Tên tập dữ liệu, Danh mục dữ liệu mở, Giấy phép, Từ khóa, Cơ quan công bố, Thông tin mô tả.
   - Thêm phần trực quan hóa Dạng tải dữ liệu dưới dạng các Tabs lựa chọn tĩnh (Tải lên tệp / Lấy từ API) và phần biểu diễn file Excel trực quan.
   - Hiển thị cấu trúc Metadata yêu cầu (danh sách tiêu đề cột mong muốn) dưới dạng các nhãn tag màu xanh dương tinh tế tùy biến theo từng danh mục dữ liệu.
   - Đồng bộ hóa thiết kế chân trang (Modal Footer) và các nút hành động (Gửi phê duyệt, Phê duyệt, Từ chối, Công khai, Bỏ công khai) theo đúng chuẩn thiết kế hệ thống.
6. **Bổ sung Mock Data và hỗ trợ hiển thị dữ liệu API (Thiết lập danh mục):**
   - Thêm 2 bản ghi mock dữ liệu cho trường hợp Dạng tải dữ liệu là "Lấy từ API":
     * Bản ghi 1: API nội bộ Bộ Tư pháp (Internal API) - GET.
     * Bản ghi 2: API của cơ quan nhà nước từ Cổng DVC Quốc gia (External API) - POST.
   - Cập nhật cấu trúc hiển thị cột "Metadata" tại bảng danh sách tệp dữ liệu hiển thị nhãn "API - Nội bộ" hoặc "API - Cơ quan nhà nước".
   - Cập nhật Modal Chi tiết tự động chuyển đổi giao diện hiển thị thông tin chi tiết API (URL, Method, Params, Headers, Mô tả API) thay vì sơ đồ tệp Excel khi chọn xem các bản ghi dạng API.
7. **Loại bỏ nút Import/Export khỏi danh sách tệp dữ liệu (Thiết lập danh mục):**
   - Loại bỏ hoàn toàn nút Import và Export khỏi thanh công cụ trên tab danh sách tệp dữ liệu của màn hình Biên tập danh mục dữ liệu mở.
8. **Cải tiến Modal Chỉnh sửa tệp dữ liệu mở (Thiết lập danh mục):**
   - Thiết kế lại Modal Chỉnh sửa với giao diện đồng bộ hoàn toàn với Modal Xem chi tiết và Modal Gửi yêu cầu công bố mới.
   - Cho phép chỉnh sửa trực tiếp các trường thông tin: Tên tập dữ liệu, Giấy phép, Từ khóa, Cơ quan công bố, Thông tin mô tả.
   - Khóa (để ở dạng read-only) các phần liên quan đến phương thức phân phối dữ liệu gốc theo đúng yêu cầu:
     * Khóa nút chuyển đổi Dạng tải dữ liệu.
     * Khóa Tệp dữ liệu đã tải lên (nếu dạng tải là Tệp).
     * Khóa toàn bộ các cấu hình API chi tiết bao gồm URL, Method, Params, Headers (nếu dạng tải là API).
   - Tích hợp liên kết hai chiều (two-way binding) with state của component giúp các thay đổi được lưu và phản hồi ngay lập tức trên bảng danh sách khi bấm nút "Lưu thay đổi".
9. **Loại bỏ nút Thêm tệp dữ liệu (Thiết lập danh mục):**
   - Loại bỏ nút "+ Thêm tệp dữ liệu" tại thanh công cụ (Toolbar) trên tab danh sách của màn hình Thiết lập danh mục dữ liệu mở.
10. **Bổ sung bộ lọc nâng cao (Thiết lập danh mục):**
    - Bổ sung bộ lọc theo **Giấy phép** (License): Cho phép lọc danh sách theo giấy phép (Tất cả, Giấy phép dữ liệu mở công cộng, Giấy phép ODC-BY).
    - Bổ sung bộ lọc theo khoảng **Ngày gửi công bố** (thay cho Ngày tạo): Cung cấp 2 ô chọn ngày: "Từ ngày" (startDateFilter) và "Đến ngày" (endDateFilter) để lọc các bản ghi được gửi công bố trong khoảng thời gian mong muốn.
    - Cập nhật logic lọc (`filteredData`) thực hiện kiểm duyệt, so khớp chính xác chuỗi ngày tháng ở định dạng DD/MM/YYYY của dữ liệu bản ghi với khoảng ngày đã chọn.
11. **Đổi tên hiển thị từ "Ngày tạo" sang "Ngày gửi công bố":**
    - Đổi tên cột hiển thị trên bảng danh sách tệp dữ liệu từ "Ngày tạo" thành "Ngày gửi công bố".
    - Đổi tên nhãn tiêu đề của bộ lọc từ ngày/đến ngày từ "Ngày tạo" thành "Ngày gửi công bố".
12. **Cập nhật kiểu dáng nhãn bộ lọc nâng cao:**
    - Thay đổi kích thước chữ của các nhãn bộ lọc nâng cao (Trạng thái công khai, Giấy phép, Ngày gửi công bố) tăng lên 13px (`text-[13px]`).
    - Bỏ in đậm chữ (chuyển sang `font-normal`) và bỏ viết hoa chữ (`uppercase`) để có thiết kế thanh lịch, nhẹ nhàng theo yêu cầu.
13. **Thêm tính năng Lịch sử phiên bản tệp dữ liệu:**
    - Thêm nút "Lịch sử phiên bản" (Icon History) tại cột Thao tác trên bảng danh sách tệp dữ liệu.
    - Phát triển modal **Lịch sử phiên bản** hiển thị danh sách phiên bản của tệp dữ liệu: "Tên tệp dữ liệu", "Phiên bản", "Người cập nhật", "Ngày phát hành", "Ghi chú thay đổi", "Trạng thái".
    - Tích hợp modal con **So sánh cấu trúc phiên bản** (tự động phát hiện kiểu API / Tệp Excel để hiển thị bảng so sánh cấu trúc thuộc tính trước và sau cập nhật).
    - Cung cấp nút **Khôi phục phiên bản** và **Tải về** tệp dữ liệu/API tương ứng trực tiếp tại modal so sánh cấu trúc.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.4.8 -> 2.4.9)
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`
- `src/components/pages/open-data-category/OpenDataCategoryPage.tsx`
- `src/components/pages/open-data-category/components/tabs/OpenDataCategoryGrid.tsx`
- `src/components/pages/open-data-category/components/tabs/FilesTab.tsx`
- `src/components/pages/open-data-category/components/OpenDataCategoryFilters.tsx`

---

## Phiên bản 2.5.0 (Ngày cập nhật: 19/06/2026)

**Nội dung thay đổi:**
1. **Cập nhật nhãn và lựa chọn định dạng tại Form tạo mới/chỉnh sửa Metadata (Thiết lập danh mục):**
   - Thay đổi nhãn trường "Định dạng" thành "Định dạng chia sẻ" trên bảng danh sách, modal xem chi tiết và modal thêm mới/chỉnh sửa metadata.
   - Sửa đổi các hộp chọn (checkbox) lựa chọn định dạng từ "File Excel" thành "File excel" và "API" cho đồng bộ.
2. **Cập nhật nhãn và lựa chọn định dạng tại Form gửi yêu cầu công bố dữ liệu (Yêu cầu công bố & đề xuất):**
   - Thay đổi nhãn trường "Định dạng dữ liệu" thành "Định dạng chia sẻ" trong modal gửi yêu cầu công bố dữ liệu.
   - Chuyển đổi từ dạng chọn đơn (select dropdown) thành hộp kiểm (checkbox) cho phép chọn nhiều giá trị ("File excel" và "API") để đồng nhất với cấu trúc metadata.
   - Cập nhật các trường cấu hình metadata mẫu (`CONFIGURED_METADATA_FILES`) và dữ liệu mẫu (`mockPublishedData`) sử dụng định dạng "File excel" và "API" tương ứng để hiển thị và tự động điền (autofill) chính xác.
   - Cấu trúc lại hàm lưu bản ghi để phân tích chuỗi định dạng đã chọn thành danh sách mảng dữ liệu khi gửi yêu cầu.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.4.9 -> 2.5.0)
- `src/components/pages/open-data/OpenDataSetupPage.tsx`
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.5.1 (Ngày cập nhật: 19/06/2026)

**Nội dung thay đổi:**
1. **Cập nhật kiểu chữ nhãn trường (form labels) tại Form gửi yêu cầu công bố dữ liệu:**
   - Loại bỏ in đậm (`font-semibold`) chuyển về kiểu chữ thường (`font-normal`) cho toàn bộ các tiêu đề trường nhập liệu và chọn lựa trong modal Gửi yêu cầu công bố dữ liệu (Tên tệp dữ liệu, Chọn metadata đã cấu hình, Danh mục dữ liệu mở, Giấy phép, Từ khóa, Cơ quan công bố, Định dạng chia sẻ, Tần suất cập nhật, Thông tin mô tả, Cấu hình nguồn dữ liệu).

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.0 -> 2.5.1)
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.5.2 (Ngày cập nhật: 19/06/2026)

**Nội dung thay đổi:**
1. **Đồng bộ hóa các trường thông tin trong Modal Phê duyệt yêu cầu công bố:**
   - Cập nhật phần thông tin chung của modal Phê duyệt yêu cầu công bố để hiển thị đầy đủ các trường đồng bộ với form gửi yêu cầu công bố: Tên tệp đề xuất, Danh mục mở, Người đề xuất, Cơ quan công bố, Giấy phép, Từ khóa, Tần suất cập nhật, Định dạng chia sẻ, và Thông tin mô tả.
2. **Thêm tab xem thử Metadata và Dữ liệu dòng đầu:**
   - Phân chia khu vực xem thử thành 2 tab:
     * **Xem metadata:** Hiển thị chi tiết cấu hình cơ sở dữ liệu đích, bảng dữ liệu chính, bảng liên kết (Join) và danh sách chi tiết các trường dữ liệu được chọn khi gửi yêu cầu công bố (bao gồm tên cột, bảng nguồn, kiểu dữ liệu, API field và trạng thái bảo mật/mask).
     * **Xem trước dữ liệu dòng đầu:** Hiển thị bảng xem thử dữ liệu dòng đầu thực tế như trước.
   - Thêm cấu trúc lưu trữ và fallback thông tin metadata của bản ghi đề xuất.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.1 -> 2.5.2)
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.5.3 (Ngày cập nhật: 19/06/2026)

**Nội dung thay đổi:**
1. **Thay đổi màu chữ trong Modal Phê duyệt yêu cầu công bố sang toàn bộ màu đen:**
   - Thay đổi các class màu chữ từ màu xám nhạt/trung bình (`text-slate-900`, `text-slate-800`, `text-slate-700`, `text-slate-600`, `text-slate-500`, `text-blue-700`) sang toàn bộ màu đen (`text-black`) cho các nhãn trường, giá trị trường, các tab và toàn bộ thông tin hiển thị bên trong modal Phê duyệt yêu cầu công bố.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.2 -> 2.5.3)
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.5.4 (Ngày cập nhật: 19/06/2026)

**Nội dung thay đổi:**
1. **Định dạng kích thước chữ trong Modal Phê duyệt yêu cầu công bố:**
   - Điều chỉnh và cố định kích thước chữ (font-size) về mức `13px` (`text-[13px]`) cho toàn bộ nội dung, nhãn trường, giá trị, bảng dữ liệu, tab chọn và khu vực nhập lý do từ chối phê duyệt bên trong modal Phê duyệt yêu cầu công bố (chỉ trừ phần Header tiêu đề chính của modal).

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.3 -> 2.5.4)
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.5.5 (Ngày cập nhật: 19/06/2026)

**Nội dung thay đổi:**
1. **Định dạng kích thước chữ trong các bảng dữ liệu con (Approval Modal):**
   - Ép kích thước chữ (font-size) về mức `13px` (`text-[13px]`) cho tất cả các phần tiêu đề cột (`<th>`) và ô dữ liệu (`<td>`) của bảng Metadata (tab Xem metadata) và bảng dữ liệu xem trước (tab Xem trước dữ liệu dòng đầu) để đảm bảo toàn bộ thông tin hiển thị đạt kích thước thống nhất.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.4 -> 2.5.5)
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.5.6 (Ngày cập nhật: 19/06/2026)

**Nội dung thay đổi:**
1. **Định dạng kích thước chữ các nút bấm (Buttons) trong Modal Phê duyệt:**
   - Thay đổi kích thước chữ (font-size) của tất cả các nút hành động ở chân trang (Từ chối duyệt, Phê duyệt & Công bố, Quay lại, Xác nhận Từ chối) về mức `13px` (`text-[13px]`) để đồng bộ hoàn toàn với kích thước chung trong Modal.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.5 -> 2.5.6)
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.5.7 (Ngày cập nhật: 19/06/2026)

**Nội dung thay đổi:**
1. **Loại bỏ in đậm giá trị cấu hình nguồn dữ liệu đích (Approval Modal):**
   - Thay đổi kiểu chữ của giá trị hiển thị Cơ sở dữ liệu đích và Bảng chính (trong tab Xem metadata thuộc Modal Phê duyệt yêu cầu công bố) từ in đậm (`font-semibold`) sang kiểu chữ thường (`font-normal`).

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.6 -> 2.5.7)
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

---

## Phiên bản 2.5.8 (Ngày cập nhật: 19/06/2026)

**Nội dung thay đổi:**
1. **Loại bỏ in đậm và tăng khoảng cách nút bấm (Approval Modal):**
   - Loại bỏ in đậm (`font-semibold`) chuyển về kiểu chữ thường (`font-normal`) trên toàn bộ các nút hành động ở chân trang modal Phê duyệt.
   - Tăng khoảng cách (gap) giữa các nút bấm ở footer từ `gap-2.5` (10px) lên `gap-4` (16px) để tạo giao diện thoáng hơn.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.7 -> 2.5.8)
- `src/components/pages/open-data/OpenDataPublishedListPage.tsx`

## Phiên bản 2.5.27 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Thiết kế lại thông báo thực thể trong Tab Thiết lập cấu trúc (Danh mục dùng chung):**
   - Thay đổi ô hiển thị thông tin thực thể đang quản lý ("Đang quản lý thuộc tính của thực thể: ...") từ dạng hộp thông tin cơ bản sang dạng hộp Cảnh báo (Alert Box) với màu sắc chủ đạo màu vàng/amber (`bg-amber-50 border-amber-200 text-amber-800`).
   - Tích hợp biểu tượng cảnh báo `AlertCircle` từ thư viện `lucide-react` và cập nhật tiêu đề, mô tả thân thiện, rõ ràng nhằm giúp người dùng nhận thức chính xác danh mục đang được cấu hình cấu trúc.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.26 -> 2.5.27)
- `src/components/pages/category/components/tabs/AttributesTab.tsx`

---

## Phiên bản 2.5.28 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Tăng kích thước khung cảnh báo thực thể trong Tab Thiết lập cấu trúc (Danh mục dùng chung):**
   - Tăng khoảng đệm (padding) của khung cảnh báo thực thể đang cấu hình từ `p-3.5` lên `p-5` (20px) và khoảng cách `gap-4` để giao diện thông thoáng, rộng rãi và nổi bật hơn.
   - Nâng kích thước biểu tượng cảnh báo `AlertCircle` từ `w-5 h-5` lên `w-6 h-6`.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.27 -> 2.5.28)
- `src/components/pages/category/components/tabs/AttributesTab.tsx`

---

## Phiên bản 2.5.29 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Cập nhật nội dung cảnh báo thực thể hiển thị thông tin Nguồn dữ liệu (Danh mục dùng chung):**
   - Loại bỏ câu nhắc nhở "Hãy chắc chắn rằng..." trong cảnh báo cấu hình.
   - Bổ sung thông tin "Nguồn dữ liệu danh mục: ..." được lấy động từ cấu hình thực thể danh mục (tự động chuyển đổi các giá trị như `dldc`, `lgsp`, `ndxp`, `manual` sang nhãn hiển thị tương ứng bằng tiếng Việt như "Đồng bộ Kho dữ liệu (DLDC)", "Kết nối API (NGSP/LGSP)", v.v.).

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.28 -> 2.5.29)
- `src/components/pages/category/components/tabs/AttributesTab.tsx`

---

## Phiên bản 2.5.30 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Đồng bộ hóa tên nhãn hiển thị Nguồn dữ liệu danh mục:**
   - Thay đổi các giá trị trả về của Nguồn dữ liệu để khớp chính xác với 3 tùy chọn tại màn hình Thông tin chung:
     * `manual` ➔ **Tự cập nhật trực tiếp**
     * `dldc` ➔ **Đồng bộ Kho DLDC**
     * `lgsp` / `ndxp` ➔ **Kết nối API (NGSP/LGSP)**

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.29 -> 2.5.30)
- `src/components/pages/category/components/tabs/AttributesTab.tsx`

---

## Phiên bản 2.5.31 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Thay đổi hiển thị từ NGSP/LGSP thành NDXP/LGSP trong thiết lập danh mục dùng chung:**
   - Cập nhật nhãn hiển thị tại các màn hình và cấu phần của Thiết lập danh mục dùng chung từ `NGSP/LGSP` thành `NDXP/LGSP`.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.30 -> 2.5.31)
- `src/components/pages/category/components/tabs/AttributesTab.tsx`
- `src/components/pages/category/components/modals/CategoryWizardModal.tsx`

---

## Phiên bản 2.5.32 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Triển khai 3 cấu trúc bảng thuộc tính cố định dựa trên nguồn dữ liệu của danh mục:**
   - Thay đổi giao diện danh sách thuộc tính của danh mục thành 3 thiết kế riêng biệt, hiển thị đúng các cột dữ liệu liên quan:
     * **Tự cập nhật trực tiếp (manual):** Hiện các cột Tên trường, Tên hiển thị, Kiểu dữ liệu, Độ dài, Ràng buộc, Giá trị mặc định, Mô tả, Trạng thái, Thao tác.
     * **Đồng bộ Kho DLDC (dldc):** Hiện các cột Bảng nguồn, Cột nguồn, Tên trường ánh xạ, Kiểu dữ liệu, Khóa chính (PK), Bảo mật (Che giấu), Trạng thái, Thao tác.
     * **Kết nối API (ndxp/lgsp):** Hiện các cột JSON Path, Tên trường ánh xạ, Tên hiển thị, Kiểu dữ liệu, Giá trị mặc định, Bảo mật (Che giấu), Trạng thái, Thao tác.
   - Bổ sung các trường `jsonPath?: string` và `masked?: boolean` vào interface `MasterDataAttribute` để hỗ trợ hiển thị.
   - Tự động hóa tính toán `colSpan` của dòng hiển thị "Không tìm thấy dữ liệu" tương ứng theo số lượng cột của từng giao diện nguồn.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.31 -> 2.5.32)
- `src/components/pages/category/categoryTypes.ts`
- `src/components/pages/category/components/tabs/AttributesTab.tsx`

---

## Phiên bản 2.5.33 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Mock dữ liệu danh mục cho các nguồn Kho DLDC và API:**
   - Cấu hình nguồn dữ liệu `dataSource: 'dldc'` cho Danh mục giới tính (ID: 1) và `dataSource: 'lgsp'` (API) cho Danh mục Quốc gia, Quốc tịch (ID: 3).
   - Bổ sung thông tin CSDL nguồn (`sourceTable`, `sourceField`, `sourceKey`) và API (`jsonPath`, `masked`) vào danh sách thuộc tính mock của hệ thống nhằm kiểm duyệt giao diện hiển thị 3 dạng bảng cấu trúc động.

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.32 -> 2.5.33)
- `src/components/pages/category/categoryConstants.ts`
- `src/components/pages/category/CategorySetupPage.tsx`

---

## Phiên bản 2.5.34 (Ngày cập nhật: 24/06/2026)

**Nội dung thay đổi:**
1. **Tách biệt và tải dữ liệu mock tương ứng cho từng loại danh mục (DLDC & API):**
   - Định nghĩa `mockAttributesByEntity` trong `categoryConstants.ts` chứa các bộ thuộc tính mock riêng biệt cho:
     * **Danh mục giới tính (ID: 1 - dldc):** Ánh xạ sang các trường của bảng `tbl_gioi_tinh` (`ma_gt`, `ten_gt`, `mo_ta`).
     * **Danh mục dân tộc (ID: 2 - manual):** Chứa các trường dân tộc tự cập nhật (`ma_dan_toc`, `ten_dan_toc`, `ten_goi_khac`).
     * **Danh mục Quốc gia, Quốc tịch (ID: 3 - lgsp API):** Ánh xạ sang JSON Path (`data.countries[*].code`, `data.countries[*].name`, v.v.).
   - Cập nhật `CategorySetupPage.tsx` bổ sung hook `useEffect` để tự động tải/thay đổi danh sách thuộc tính tương ứng với danh mục được chọn (hỗ trợ chuyển đổi mượt mà giữa danh mục nguồn DLDC và danh mục nguồn API trên giao diện).

**Các file bị ảnh hưởng:**
- `package.json` (Nâng version từ 2.5.33 -> 2.5.34)
- `src/components/pages/category/categoryConstants.ts`
- `src/components/pages/category/CategorySetupPage.tsx`

---

## Thêm cột Trạng thái và cập nhật logic chờ phê duyệt tại màn Biên tập danh mục (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Bổ sung cột Trạng thái vào bảng bản ghi danh mục:**
   - Thêm tiêu đề cột "Trạng thái" vào bảng danh sách bản ghi tại tab "Danh sách" trong `CategoryPage.tsx`.
   - Hiển thị badge trạng thái của từng bản ghi bằng hàm `getStatusBadge`.
   - Cập nhật z-index/colSpan của dòng khi danh sách rỗng từ `5` lên `6`.
2. **Khởi tạo trạng thái mặc định:**
   - Cập nhật toàn bộ `status` của các bản ghi mẫu trong `MOCK_RECORDS_BY_CATEGORY` sang `'approved'`.
   - Tự động thiết lập trạng thái `'approved'` cho tất cả các bản ghi khởi tạo của state `categories` thông qua hàm map.
3. **Cập nhật hàm `getStatusBadge`:**
   - Ánh xạ `'pending'` thành "Chờ phê duyệt" với màu sắc cảnh báo (`bg-yellow-50 text-yellow-700 border border-yellow-200`).
   - Ánh xạ `'approved'`, `'published'`, và `'active'` thành "Đã phê duyệt" với màu sắc thành công (`bg-green-50 text-green-700 border border-green-200`).
4. **Cập nhật logic thêm mới và chỉnh sửa bản ghi:**
   - Trong `handleSaveInlineEdit`, thay đổi trạng thái của bản ghi sau khi sửa đổi thành `'pending'` (Chờ phê duyệt).
   - Trong `handleSaveInlineAdd`, thay đổi trạng thái khởi tạo của bản ghi được thêm mới từ `'published'` sang `'pending'` (Chờ phê duyệt).
   - Hiển thị nhãn "Chờ phê duyệt" trên dòng thêm mới inline (`addingRow`) để đồng bộ giao diện.
5. **Cập nhật bộ lọc trạng thái (Filter panel):**
   - Đổi nhãn lựa chọn bộ lọc từ "Chờ duyệt" thành "Chờ phê duyệt", và "Đã duyệt" thành "Đã phê duyệt" cho đồng bộ thuật ngữ.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Bổ sung các thông tin ngày tạo, người tạo, ngày cập nhật, người cập nhật tại màn Biên tập danh mục (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Mở rộng interface Category:**
   - Thêm các thuộc tính tùy chọn `createdBy`, `updatedDate`, `updatedBy` vào interface `Category`.
2. **Khởi tạo dữ liệu siêu dữ liệu (Metadata) mặc định:**
   - Trong `useEffect` khi load danh mục, tự động gán các giá trị mặc định cho dữ liệu mock: `createdBy` là `'Hệ thống'`, `updatedDate` là `'15/01/2026'`, và `updatedBy` là `'Nguyễn Văn A'`.
   - Trong state `categories` khởi tạo ban đầu, map các giá trị mặc định tương ứng.
3. **Cập nhật giao diện bảng (Grid Table UI):**
   - Thêm 4 cột: "Ngày tạo", "Người tạo", "Ngày cập nhật", "Người cập nhật" vào tiêu đề bảng (`thead`).
   - Hiển thị giá trị của 4 trường siêu dữ liệu này ở mỗi dòng dữ liệu bản ghi.
   - Thêm 4 ô hiển thị tương ứng vào hàng thêm mới inline (`addingRow`) với thông tin tự động để đồng bộ cột.
   - Thay đổi `colSpan` của dòng khi danh sách rỗng từ `6` lên `10` để tránh lệch cột.
4. **Cập nhật logic Lưu (Inline Edit & Add):**
   - Trong `handleSaveInlineEdit`, tự động gán `updatedDate` bằng ngày hiện tại (`toLocaleDateString`) và `updatedBy` bằng `'Nguyễn Văn A'`.
   - Trong `handleSaveInlineAdd`, tự động gán `createdDate`/`updatedDate` bằng ngày hiện tại và `createdBy`/`updatedBy` bằng `'Nguyễn Văn A'`.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Đồng bộ dữ liệu yêu cầu phê duyệt thay đổi theo danh sách danh mục (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Đồng bộ hóa danh sách yêu cầu phê duyệt:**
   - Thay thế mảng dữ liệu tĩnh `approvalRequests` bằng cách map động từ mảng dữ liệu `categories` của danh mục được chọn hiện tại.
   - Các yêu cầu được tạo ra với trạng thái tương ứng: bản ghi `status === 'pending'` ánh xạ thành yêu cầu có trạng thái `'pending'`, `status === 'approved'` thành `'approved'`, và `status === 'rejected'` thành `'rejected'`.
2. **Cập nhật logic phê duyệt và từ chối đồng bộ:**
   - Cập nhật `confirmApproval` để khi duyệt yêu cầu thành công, tìm các bản ghi tương ứng trong state `categories` và chuyển trạng thái của chúng sang `'approved'`, đồng thời cập nhật `updatedDate` và `updatedBy: 'Hoàng Văn E'`.
   - Cập nhật `confirmReject` để khi từ chối yêu cầu thành công, tìm các bản ghi tương ứng trong state `categories` và chuyển trạng thái của chúng sang `'rejected'`, đồng thời cập nhật `updatedDate` và `updatedBy: 'Nguyễn Văn A'`.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Khắc phục lỗi ReferenceError: Cannot access 'categories' before initialization (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Khắc phục lỗi Temporal Dead Zone (TDZ):**
   - Di chuyển việc khởi tạo state `categories` (useState) và hook đồng bộ `useEffect` lên đầu component `CategoryPage` (ngay sau tab state `activeTab`).
   - Việc di chuyển này đảm bảo `categories` đã được khởi tạo và sẵn sàng trước khi mảng `approvalRequests` thực hiện map dữ liệu từ `categories` trong quá trình render, loại bỏ hoàn toàn lỗi runtime `ReferenceError`.
2. **Sửa lỗi cú pháp do căn chỉnh code:**
   - Đảm bảo hàm `getRequestTypeBadge` kết thúc chính xác bằng `};`.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Khắc phục lỗi ReferenceError: getApprovalStatusBadge is not defined (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Phục hồi hàm getApprovalStatusBadge:**
   - Định nghĩa lại hàm `getApprovalStatusBadge` để bọc hiển thị badge trạng thái của các yêu cầu phê duyệt (Chờ duyệt, Đã duyệt, Từ chối). Hàm này đã bị xóa nhầm trong quá trình di chuyển code để fix lỗi khởi tạo trước đó.
2. **Kiểm tra đóng gói (Production Build Check):**
   - Chạy lệnh `npm run build` thành công, kiểm tra biên dịch TS và đóng gói dự án Vite không xảy ra bất kỳ lỗi runtime hay compile-time nào khác.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Đồng bộ tất cả các cột thông tin sang bảng Phê duyệt (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Đồng bộ hóa thuộc tính trong mảng approvalRequests:**
   - Cập nhật hàm map của `approvalRequests` từ `categories` để truyền đầy đủ các thuộc tính của danh mục: `description`, `createdBy`, `createdDate`, `changedBy` (map từ `updatedBy`), và `changedDate` (map từ `updatedDate`).
2. **Cập nhật Giao diện Bảng Phê duyệt:**
   - Thêm các cột tương ứng vào Table Header: "Mô tả", "Ngày tạo", "Người tạo", "Người cập nhật", "Ngày cập nhật".
   - Hiển thị giá trị của các trường này tương ứng trong Table Body cho từng dòng yêu cầu phê duyệt.
   - Điều chỉnh tên các cột metadata (đổi "Người thay đổi" thành "Người cập nhật" và "Thời gian thay đổi" thành "Ngày cập nhật") để đồng bộ thuật ngữ nhất quán giữa Tab Danh sách và Tab Phê duyệt.
3. **Đóng gói & Kiểm thử:**
   - Chạy `npm run build` thành công hoàn toàn không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Loại bỏ cột "Các trường thay đổi" ở bảng Phê duyệt (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Giao diện bảng Phê duyệt:**
   - Loại bỏ cột "Các trường thay đổi" (`changedFields`) khỏi Table Header và Table Body ở tab Phê duyệt để tối giản giao diện, giúp bảng hiển thị gọn gàng và đồng bộ hoàn toàn với cấu trúc hiển thị thông tin của tab Danh sách.
2. **Đóng gói & Kiểm thử:**
   - Chạy kiểm tra TypeScript (`tsc`) và đóng gói dự án (`npm run build`) thành công, không gặp lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Luôn hiển thị và tự động disable các nút Phê duyệt / Từ chối (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Thay đổi nút Thao tác ở bảng Phê duyệt:**
   - Cấu hình luôn hiển thị cả 3 nút thao tác: Xem chi tiết (Eye), Phê duyệt (CheckCircle2), và Từ chối (XCircle) trên mỗi bản ghi của bảng Phê duyệt.
   - Thêm điều kiện `disabled` và class CSS để biến các nút Phê duyệt, Từ chối thành màu xám nhạt (`text-slate-300`) kèm con trỏ cấm (`cursor-not-allowed`) khi bản ghi đã ở trạng thái đã phê duyệt (`approved`) hoặc từ chối (`rejected`), ngăn chặn chọn lại.
2. **Đóng gói & Kiểm thử:**
   - Chạy kiểm tra TypeScript (`tsc`) và đóng gói dự án (`npm run build`) thành công, không gặp lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Loại bỏ cột "Thời gian duyệt" và chống xuống dòng cột "Trạng thái" (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Giao diện bảng Phê duyệt:**
   - Loại bỏ hoàn toàn cột "Thời gian duyệt" (`approvedDate`) ở cả Table Header và Table Body.
   - Thêm class `whitespace-nowrap` vào ô `<td>` và nội dung Badge trạng thái (`getApprovalStatusBadge`) để đảm bảo các chuỗi trạng thái như "Chờ phê duyệt", "Đã phê duyệt" không bị xuống dòng nửa chừng trên giao diện.
2. **Đóng gói & Kiểm thử:**
   - Chạy lệnh `npm run build` thành công, kiểm tra biên dịch TS và đóng gói dự án Vite hoàn tất không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Bổ sung tab Công khai và quản lý trạng thái công khai danh mục (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Thêm tab "Công khai" mới:**
   - Đăng ký tab `publish` ("Công khai") vào thanh tab bar của component `CategoryPage`, xếp cạnh tab Phê duyệt.
   - Khi kích hoạt, hiển thị bảng danh sách các giá trị dữ liệu (STT, Mã, Tên, Mô tả, Trạng thái, Ngày tạo, Ngày cập nhật...) và loại bỏ cột Thao tác.
2. **Cấu hình Trạng thái Công khai & Nút hành động:**
   - Thiết kế Banner thể hiện trạng thái động: Đang công khai (Màu xanh lá, có thông tin phạm vi chia sẻ) / Chưa công khai (Màu xám, thông báo chưa công khai).
   - Tự động thay đổi nút hành động dựa trên trạng thái hiện tại: Chưa công khai hiển thị nút **Công khai**; Đã công khai hiển thị nút **Hủy công khai**.
3. **Các Modal Cấu hình mới:**
   - **Modal Công khai:** Hiển thị form cho chọn phạm vi chia sẻ (Nội bộ, Mở rộng, Toàn dân) bằng nút Radio. Click Xác nhận sẽ cập nhật trạng thái danh mục sang Đã công khai.
   - **Modal Hủy công khai:** Hiển thị trường nhập lý do hủy công khai. Click Xác nhận sẽ cập nhật trạng thái danh mục sang Chưa công khai.
4. **Kiểm tra biên dịch & Đóng gói:**
   - Thực hiện đóng gói dự án (`npm run build`) thành công, kiểm tra không phát sinh lỗi biên dịch hay runtime.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Cập nhật trạng thái "Ngừng công khai" cùng thông tin người thực hiện, ngày thực hiện (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Quản lý trạng thái Công khai:**
   - Thay đổi state `isCategoryPublished` (boolean) thành state `publishStatus` để hỗ trợ 3 trạng thái: `unpublished` (Chưa công khai), `published` (Đã công khai), và `stopped` (Ngừng công khai).
   - Khi chọn Hủy công khai từ modal, thay đổi trạng thái sang `stopped` (Ngừng công khai).
2. **Bổ sung thông tin Người thực hiện & Ngày thực hiện:**
   - Khi công khai hoặc ngừng công khai, hệ thống sẽ tự động ghi lại thông tin người thực hiện (`Nguyễn Văn A`) và ngày thực hiện (ngày hiện tại).
   - Khi trạng thái là "Ngừng công khai" (`stopped`), banner sẽ hiển thị chi tiết: Người thực hiện, Ngày thực hiện, và Lý do ngừng công khai (được nhập từ modal).
3. **Kiểm tra biên dịch & Đóng gói:**
   - Thực hiện đóng gói dự án (`npm run build`) thành công không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/CategoryPage.tsx`

---

## Bổ sung trường "Mã danh mục" khi thiết lập/chỉnh sửa danh mục dùng chung (Ngày cập nhật: 29/06/2026)

**Nội dung thay đổi:**
1. **Bổ sung trường nhập mã danh mục:**
   - Tại `CategoryWizardModal.tsx`, thêm trường nhập **Mã danh mục \*** vào Bước 1 (Thông tin chung) nằm song song (chia 2 cột) với trường **Tên danh sách danh mục \***.
   - Thêm điều kiện `disabled={isViewOnly || !!entityId}` giúp người dùng chỉ được điền mã danh mục khi thêm mới, và bị khóa (disable) khi sửa hoặc xem chi tiết.
2. **Cập nhật logic lưu trữ & xác thực:**
   - Tại `CategorySetupPage.tsx`, khởi tạo giá trị rỗng cho `code` khi click Thêm mới (`handleAdd`).
   - Cập nhật hàm `handleSaveStep1` để kiểm tra bắt buộc nhập Mã danh mục (`formData.code`).
   - Sử dụng mã danh mục do người dùng điền để lưu trực tiếp vào cơ sở dữ liệu thay vì sinh mã tự động theo mẫu mặc định.
3. **Kiểm tra biên dịch & Đóng gói:**
   - Thực hiện đóng gói dự án (`npm run build`) thành công, không phát sinh lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/category/components/modals/CategoryWizardModal.tsx`
- `src/components/pages/category/CategorySetupPage.tsx`

---

## Khắc phục lỗi khởi chạy npm run dev do thiếu dependencies (Ngày cập nhật: 06/07/2026)

**Nội dung thay đổi:**
1. **Cài đặt các gói phụ thuộc còn thiếu:**
   - Chạy lệnh `npm install` để cài đặt đầy đủ các thư viện trong `devDependencies` và `dependencies` (đặc biệt là thư viện tích hợp `@tailwindcss/vite` và `tailwindcss` phiên bản `4.3.2`).
2. **Kiểm tra biên dịch & Đóng gói:**
   - Thực hiện đóng gói dự án (`npm run build`) thành công, kiểm tra không phát sinh lỗi biên dịch liên quan đến cấu hình Vite hoặc Tailwind CSS.

**Các file bị ảnh hưởng:**
- `package-lock.json`
- Thư mục `node_modules/`

---

## Tự động chọn thực thể chủ đầu tiên trong cấu hình Quy tắc định danh và Quy tắc hợp nhất (Ngày cập nhật: 10/07/2026)

**Nội dung thay đổi:**
1. **Thiết lập mặc định cho Quy tắc định danh duy nhất:**
   - Cập nhật state `selectedEntityFilter` trong `UniqueIdentifierRulesTab.tsx` mặc định khởi tạo là `'1'` (mã thực thể chủ đầu tiên - Bộ dữ liệu chủ Công dân) thay vì chuỗi rỗng `''`.
   - Giúp hệ thống tự động tải và hiển thị quy tắc định danh của thực thể đầu tiên ngay khi tải trang, tương thích hoàn toàn với hành vi của tab Thiết lập thuộc tính.
2. **Thiết lập mặc định cho Quy tắc hợp nhất dữ liệu:**
   - Cập nhật state `selectedEntityFilter` trong `MergeRulesManagementTab.tsx` mặc định khởi tạo là `'1'` (mã thực thể chủ đầu tiên) thay vì chuỗi rỗng `''`.
   - Loại bỏ màn hình trống yêu cầu chọn thực thể chủ trước khi xem, tự động hiển thị cấu hình của thực thể đầu tiên ngay khi người dùng chuyển sang tab này.
3. **Kiểm tra biên dịch & Đóng gói:**
   - Thực hiện đóng gói dự án (`npm run build`) thành công hoàn toàn mà không phát sinh lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/UniqueIdentifierRulesTab.tsx`
- `src/components/pages/master-data/MergeRulesManagementTab.tsx`

---

## Bổ sung nút Xem chi tiết và Modal hiển thị cấu hình cho thuộc tính đồng bộ kho DLDC (Ngày cập nhật: 10/07/2026)

**Nội dung thay đổi:**
1. **Bổ sung nút Thao tác "Xem chi tiết":**
   - Tại bảng danh sách thuộc tính của tab *Thiết lập thuộc tính* (`AttributesManagementTab.tsx`), thêm icon **Xem chi tiết** (`Eye` từ `lucide-react`) vào trước các nút Sửa/Xóa đối với cả thực thể có nguồn dữ liệu đồng bộ kho DLDC (`dataSource === 'dldc'`) và thực thể có nguồn tự cập nhật thủ công (`dataSource === 'manual'`).
2. **Cập nhật Modal chi tiết:**
   - Lược bỏ phần **Cấu hình nguồn dữ liệu** (hộp màu xanh chứa thông tin CSDL và nguồn dữ liệu chính) ở đầu modal theo yêu cầu.
   - Điều chỉnh bảng **Các trường dữ liệu chia sẻ (Field Selection)**: loại bỏ cột check **Chia sẻ**, thay bằng cột **Bảng gốc** hiển thị tên tiếng Việt hiển thị (display name) của bảng dữ liệu được chọn (ví dụ: "Hồ sơ công dân", "Thông tin CCCD",...) thay cho tên mã bảng gốc. Đối với nguồn tự cập nhật, cột này hiển thị giá trị là "Nhập thủ công".
   - Bổ sung bảng **Ánh xạ cột nguồn → thuộc tính** dạng tĩnh hiển thị chi tiết quan hệ ánh xạ cột cho từng nguồn tương ứng (bao gồm cả nguồn nhập thủ công).
   - Bổ sung phần **Gom nguồn 1:n** hiển thị chi tiết các rule gom dữ liệu (ruleType) và cột mốc thời gian (timeColumn) đối với các nguồn có độ mịn 1:n.
   - Hỗ trợ đổi tiêu đề và mô tả của modal phù hợp động theo loại nguồn của thực thể (đồng bộ hoặc tự cập nhật).
3. **Kiểm tra biên dịch & Đóng gói:**
   - Chạy lệnh `npm run build` thành công hoàn tất không có lỗi.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/AttributesManagementTab.tsx`

---

## Cập nhật giao diện Modal Chi tiết dịch vụ — Tab Lịch sử hoạt động (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Loại bỏ cột `#Hành động`:**
   - Trong tab **Lịch sử hoạt động** (`TabActivityHistory`) thuộc Modal Chi tiết dịch vụ (`src/components/pages/collection/ViewServiceModal.tsx`), tiến hành xóa cột `#Hành động` (gồm các nút **Chi tiết** và **Xóa**) trong bảng danh sách theo yêu cầu.
   - Cập nhật `colSpan` cho trường hợp bảng rỗng từ 7 về 6.

**Các file bị ảnh hưởng:**
- `src/components/pages/collection/ViewServiceModal.tsx`

---

## Cập nhật thông tin tiêu đề Xem chi tiết dữ liệu thu thập — HTTT trợ giúp pháp lý (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Bổ sung thông tin "Tích hợp" và "Thuộc đơn vị":**
   - Tại giao diện xem chi tiết bộ dữ liệu thuộc **HTTT trợ giúp pháp lý** (`src/components/civil-legal-info/CivilLegalInfoModal.tsx`), bổ sung 2 dòng thông tin mô tả bên dưới tiêu đề:
     - `Tích hợp: [Tên loại dữ liệu].`
     - `Thuộc đơn vị: Cục Trợ giúp pháp lý.`

**Các file bị ảnh hưởng:**
- `src/components/civil-legal-info/CivilLegalInfoModal.tsx`

---

## Cập nhật bảng Danh sách thiết lập dịch vụ thu thập (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Tách và điều chỉnh cột trong bảng dịch vụ thu thập:**
   - Tách cột gộp "Mã / Tên dịch vụ" thành 2 cột riêng biệt: **Mã dịch vụ** (hiển thị font-mono, mã dịch vụ) và **Tên dịch vụ** (thu nhỏ độ rộng cột `max-w-[220px]`).
   - Tách trường loại nguồn ra khỏi cột "Hệ thống nguồn" thành 1 cột riêng **Loại nguồn** hiển thị badge trạng thái (**Trong ngành** / **Ngoài ngành**).

**Các file bị ảnh hưởng:**
- `src/components/pages/collection/CollectionSetupPage.tsx`

---

## Tinh chỉnh giao diện bảng Danh sách dịch vụ thu thập (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Sắp xếp lại thứ tự cột và xử lý ngắt dòng:**
   - Đổi thứ tự cột theo mockup thiết kế: `STT` → `Tên dịch vụ` → `Mã dịch vụ`.
   - Giới hạn giá trị hiển thị ở cột **Mã dịch vụ** tối đa 50 ký tự (`slice(0, 50)`), đặt độ rộng cột nhỏ gọn (`w-36 max-w-[150px]`) và cho phép tự động xuống dòng khi dài (`break-all`), không dùng dấu ba chấm `...`.
   - Bỏ `line-clamp` ở cột **Tên dịch vụ**, cho phép tên dịch vụ dài xuống dòng tự nhiên (`break-words`), không cắt bằng `...`.

**Các file bị ảnh hưởng:**
- `src/components/pages/collection/CollectionSetupPage.tsx`

---

## Cập nhật chữ đậm (bold) và thứ tự tiêu đề bảng Thu thập (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **In đậm tiêu đề bảng & căn chỉnh thứ tự:**
   - Cập nhật CSS dòng tiêu đề bảng `table.collection-table th` thành chữ in đậm đậm nét (`font-weight: bold !important; color: #0f172a !important;`).
   - Sắp xếp thứ tự các cột chính xác theo mockup ảnh: `STT` → `Tên dịch vụ` → `Mã dịch vụ` → `Loại nguồn` → `Phương thức kết nối` → `Phiên bản` → `Hệ thống nguồn` → `Ngày tạo` → `Trạng thái dịch vụ` → `Trạng thái dữ liệu` → `Thao tác`.

**Các file bị ảnh hưởng:**
- `src/index.css`
- `src/components/pages/collection/CollectionSetupPage.tsx`

---

## Bổ sung phương thức kết nối API nhận (JSON) và API nhận (XML) (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Thêm phương thức kết nối:**
   - Trong giao diện cấu hình kết nối ([ConnectionConfigSection.tsx](file:///F:/BTP/DLDC_1/src/components/pages/collection/ConnectionConfigSection.tsx)), bổ sung 2 tùy chọn phương thức kết nối trong danh sách chọn: **API nhận (JSON)** và **API nhận (XML)**.
   - Hiển thị khung thông báo cấu trúc file yêu cầu (`File phải chứa mảng data[] và object duLieuTiepNhan` cho JSON, hoặc `File XML phải chứa thẻ root và thẻ duLieuTiepNhan` cho XML).
   - Thêm lựa chọn checkbox **"Tách bảng con từ mảng lồng"** cùng biểu tượng trợ giúp tooltip.
   - Cập nhật hiển thị chi tiết tại [ViewServiceModal.tsx](file:///F:/BTP/DLDC_1/src/components/pages/collection/ViewServiceModal.tsx).

**Các file bị ảnh hưởng:**
- `src/components/pages/collection/ConnectionConfigSection.tsx`
- `src/components/pages/collection/ViewServiceModal.tsx`

---

## Bổ sung demo 18 CSDL cho biểu đồ tròn trong Giám sát cung cấp dữ liệu (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Demo hiển thị biểu đồ tròn với 18 Cơ sở dữ liệu:**
   - Tại trang [DataProvisionMonitoringPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/provisioning/DataProvisionMonitoringPage.tsx) (màn hình **Kiểm soát & giám sát cung cấp**), bổ sung bộ dữ liệu demo 18 CSDL (Hộ tịch, THADS, BPBD, ĐKKD, TGPL, LLTP, Quốc tịch, Nuôi con nuôi, Công chứng, Bán đấu giá, Trọng tài, Thừa phát lại...).
   - Mở rộng bảng màu `REQUEST_SHARE_COLORS` lên 18 tông màu khác nhau, đảm bảo phân biệt rõ ràng giữa các phần biểu đồ.
   - Thêm nút chuyển đổi linh hoạt `[3 CSDL]` / `[Demo 18 CSDL]` góc trên thẻ biểu đồ.
   - Tối ưu vùng legend bên dưới với dạng ô cuộn gọn gàng (`max-h-36 overflow-y-auto`), hiển thị thông tin phần trăm `(X%)` và giá trị khi di chuột.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionMonitoringPage.tsx`

---

## Thêm dạng hiển thị Danh sách cho tỷ lệ lưu lượng / truy cập CSDL (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Bổ sung chế độ xem dạng Danh sách (List View):**
   - Tại trang [DataProvisionMonitoringPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/provisioning/DataProvisionMonitoringPage.tsx) (màn hình **Kiểm soát & giám sát cung cấp**), bổ sung công tắc chuyển đổi giữa `[Danh sách]` và `[Biểu đồ tròn]`.
   - Chế độ **Danh sách** hiển thị xếp hạng các CSDL theo thứ tự lưu lượng / số lượt truy cập từ cao đến thấp kèm theo:
     - Huy hiệu thứ tự xếp hạng (#1, #2, #3...).
     - Tên CSDL và màu đại diện.
     - Số liệu cụ thể (lượt / MB) và phần trăm tỉ lệ (% badge).
     - Thanh tiến trình trực quan biểu diễn tỉ lệ chiếm dụng của từng CSDL.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionMonitoringPage.tsx`

---

## Chốt dạng hiển thị Danh sách cho 18 CSDL trong Giám sát cung cấp (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Chốt chính thức giao diện Danh sách 18 CSDL:**
   - Tại trang [DataProvisionMonitoringPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/provisioning/DataProvisionMonitoringPage.tsx) (màn hình **Kiểm soát & giám sát cung cấp**), chốt sử dụng giao diện **Danh sách xếp hạng 18 CSDL** làm giao diện chuẩn chính thức.
   - Loại bỏ các thẻ nút bấm công tắc demo (`3 CSDL / 18 CSDL`, `Biểu đồ tròn / Danh sách`) giúp giao diện tối giản, sạch sẽ, chuẩn hóa theo yêu cầu.
   - Danh sách hiển thị mượt mà 18 CSDL xếp hạng với thanh tiến trình trực quan, huy hiệu rank, số liệu cụ thể (lượt / MB) và tỉ lệ phần trăm.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionMonitoringPage.tsx`

---

## Đồng bộ Danh sách 18 CSDL theo bộ lọc Cơ sở dữ liệu, API & Khoảng ngày (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Đồng bộ danh sách xếp hạng theo bộ lọc đầu trang:**
   - Trong [DataProvisionMonitoringPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/provisioning/DataProvisionMonitoringPage.tsx), đồng bộ hoàn toàn danh sách xếp hạng 18 CSDL với bộ lọc **Cơ sở dữ liệu**, **API** và **Khoảng ngày** ở thanh tìm kiếm phía trên cùng.
   - Khi người dùng chọn một **CSDL** cụ thể trên bộ lọc, danh sách tự động lọc hiển thị các API trực thuộc CSDL đó kèm theo tỉ lệ lượt/dung lượng chi tiết.
   - Khi chọn một **API** cụ thể trên bộ lọc, danh sách chỉ hiển thị đúng API được chọn với tỉ lệ 100%.
   - Khi thay đổi **Từ ngày - Đến ngày**, dữ liệu lượt truy cập/lưu lượng tự động tính toán lại tỉ lệ scale theo khoảng thời gian tương ứng.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionMonitoringPage.tsx`

---

## Cân bằng chiều cao thẻ Danh sách 18 CSDL & Bảng dữ liệu theo ngày (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Khắc phục khoảng trắng thừa dưới phân trang bảng:**
   - Trong [DataProvisionMonitoringPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/provisioning/DataProvisionMonitoringPage.tsx), điều chỉnh chiều cao vùng cuộn của thẻ **Danh sách 18 CSDL** từ `max-h-[380px]` xuống `max-h-[275px]`.
   - Giúp tổng chiều cao thẻ bên phải trùng khớp tuyệt đối với chiều cao tự nhiên của thẻ **Bảng chi tiết theo ngày** (gồm 5 dòng dữ liệu + 1 dòng tổng + thanh phân trang) phía bên trái.
   - Loại bỏ hoàn toàn khoảng trắng thừa bên dưới thanh phân trang của bảng bên trái.

**Các file bị ảnh hưởng:**
- `src/components/pages/provisioning/DataProvisionMonitoringPage.tsx`

---

## Chuẩn hóa thiết kế Bảng CSDL Hộ tịch điện tử theo HTTT Trợ giúp pháp lý (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Thiết kế lại giao diện Bảng dữ liệu CSDL Hộ tịch điện tử:**
   - Tại trang [CivilRegistryDatabasePage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/external/CivilRegistryDatabasePage.tsx) (màn hình **Xem dữ liệu thu thập - CSDL Hộ tịch điện tử**), thiết kế lại toàn bộ giao diện bảng dữ liệu chuẩn hóa 100% theo giao diện của **HTTT trợ giúp pháp lý** ([CivilLegalInfoPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/internal/CivilLegalInfoPage.tsx)).
   - Bổ sung header thông tin nguồn: `Tích hợp: [Tên bộ dữ liệu]. / Thuộc đơn vị: Cục Hành chính tư pháp.`.
   - Căn chỉnh lại tiêu đề các cột (`Họ tên` căn trái, `STT` định dạng 2 chữ số `01`, `02`..., `Số đăng ký` và `Ngày đăng ký` định dạng `font-mono`, nút bấm `Xem chi tiết` dạng icon tròn `Eye`).
   - Giữ nguyên 100% dữ liệu mock của tất cả 12 bộ dữ liệu hộ tịch (Khai sinh, Kết hôn, Tình trạng hôn nhân, Khai tử, Cha mẹ con, Nuôi con nuôi, Giám hộ, v.v.).

**Các file bị ảnh hưởng:**
- `src/components/pages/external/CivilRegistryDatabasePage.tsx`
- `src/components/civil-registry/CivilRegistryInfoModal.tsx`
- `src/components/civil-registry/CivilRegistryInfoTable.tsx`

---

## Đồng bộ Bộ lọc & Thanh tìm kiếm CSDL Hộ tịch điện tử theo HTTT Trợ giúp pháp lý (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Đồng bộ hoàn toàn bộ lọc & thanh công cụ tìm kiếm:**
   - Trong [CivilRegistryInfoSearchFilter.tsx](file:///F:/BTP/DLDC_1/src/components/civil-registry/CivilRegistryInfoSearchFilter.tsx), đồng bộ thanh công cụ gồm nút **Lọc** (bật/tắt drawer lọc nâng cao với điều kiện logic AND/OR, chọn trường dữ liệu, toán tử Bằng/Chứa/Bắt đầu) và nút **Tải lại** chuẩn hóa 100% theo giao diện của **HTTT trợ giúp pháp lý** ([CivilLegalInfoSearchFilter.tsx](file:///F:/BTP/DLDC_1/src/components/civil-legal-info/CivilLegalInfoSearchFilter.tsx)).

**Các file bị ảnh hưởng:**
- `src/components/civil-registry/CivilRegistryInfoSearchFilter.tsx`
- `src/components/civil-registry/CivilRegistryInfoModal.tsx`

---

## Đồng bộ giao diện Bảng dữ liệu HT quản lý hồ sơ QT theo HTTT Trợ giúp pháp lý (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Chuẩn hóa giao diện Bảng dữ liệu HT quản lý hồ sơ QT:**
   - Trong [CaseManagementPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/internal/CaseManagementPage.tsx) (màn hình **Xem dữ liệu thu thập - HT quản lý hồ sơ QT (3)**), đồng bộ hoàn toàn giao diện Bảng dữ liệu, Thanh công cụ tìm kiếm & Bộ lọc nâng cao chuẩn 100% theo mẫu **HTTT Trợ giúp pháp lý** ([CivilLegalInfoPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/internal/CivilLegalInfoPage.tsx)).
   - Bổ sung các file component mới: [NationalityInfoModal.tsx](file:///F:/BTP/DLDC_1/src/components/nationality-acquisition/NationalityInfoModal.tsx), [NationalityInfoTable.tsx](file:///F:/BTP/DLDC_1/src/components/nationality-acquisition/NationalityInfoTable.tsx) và [NationalityInfoSearchFilter.tsx](file:///F:/BTP/DLDC_1/src/components/nationality-acquisition/NationalityInfoSearchFilter.tsx).
   - Thêm đầy đủ dữ liệu mock & giao diện hiển thị cho cả 3 bộ dữ liệu: `Dữ liệu Nhập Quốc tịch`, `Dữ liệu Thôi Quốc tịch`, `Dữ liệu Trở lại Quốc tịch`.

**Các file bị ảnh hưởng:**
- `src/components/pages/internal/CaseManagementPage.tsx`
- `src/components/nationality-acquisition/NationalityInfoModal.tsx`
- `src/components/nationality-acquisition/NationalityInfoTable.tsx`
- `src/components/nationality-acquisition/NationalityInfoSearchFilter.tsx`

---

## Bổ sung Import hooks React (useState, useMemo) bị thiếu tại CaseManagementPage (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Khắc phục lỗi ReferenceError useState is not defined:**
   - Trong [CaseManagementPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/internal/CaseManagementPage.tsx), bổ sung lại câu lệnh import các React Hooks (`useState`, `useMemo`), icon `UserCheck` và component `DatabasePageTemplate` bị thiếu ở đầu file, giúp trang chạy ổn định mượt mà không còn lỗi runtime.

**Các file bị ảnh hưởng:**
- `src/components/pages/internal/CaseManagementPage.tsx`

---

## Chuẩn hóa Tên 12 Bộ dữ liệu CSDL Hộ tịch điện tử (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Đối soát & Cập nhật tên 12 bộ dữ liệu hộ tịch:**
   - Trong [CivilRegistryDatabasePage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/external/CivilRegistryDatabasePage.tsx), đối soát danh sách 12 bộ dữ liệu hộ tịch với danh mục tiêu chuẩn và điều chỉnh các điểm viết tắt/rút gọn cũ (`DK` -> `đăng ký`, bổ sung cụm tên đầy đủ cho bộ dữ liệu số 9 và số 12, điều chỉnh thứ tự mục 10 & 11).
   - Danh sách 12 bộ dữ liệu sau khi chuẩn hóa 100% khớp với danh mục thu thập hệ thống.

**Các file bị ảnh hưởng:**
- `src/components/pages/external/CivilRegistryDatabasePage.tsx`

---

## Chuẩn hóa Giao diện & Đối soát 16 Bộ dữ liệu CSDL Thi hành án dân sự (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Đối soát danh mục 16 bộ dữ liệu thi hành án dân sự:**
   - Đã đối soát 16 tên bộ dữ liệu trong [CivilJudgmentPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/internal/CivilJudgmentPage.tsx) với danh sách thu thập hệ thống. Kết quả: **100% trùng khớp hoàn hảo**.
2. **Nâng cấp giao diện Bảng dữ liệu chuẩn HTTT Trợ giúp pháp lý:**
   - Nâng cấp [CivilJudgmentPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/internal/CivilJudgmentPage.tsx) sang giao diện `DatabasePageTemplate` có sidebar lựa chọn bộ dữ liệu, hỗ trợ hiển thị đầy đủ thông tin dữ liệu bảng, thanh công cụ tìm kiếm, bộ lọc nâng cao và chi tiết bản ghi.
   - Bổ sung các file component: [CivilJudgmentInfoModal.tsx](file:///F:/BTP/DLDC_1/src/components/civil-judgment/CivilJudgmentInfoModal.tsx), [CivilJudgmentInfoTable.tsx](file:///F:/BTP/DLDC_1/src/components/civil-judgment/CivilJudgmentInfoTable.tsx), [CivilJudgmentInfoSearchFilter.tsx](file:///F:/BTP/DLDC_1/src/components/civil-judgment/CivilJudgmentInfoSearchFilter.tsx).

**Các file bị ảnh hưởng:**
- `src/components/pages/internal/CivilJudgmentPage.tsx`
- `src/components/civil-judgment/CivilJudgmentInfoModal.tsx`
- `src/components/civil-judgment/CivilJudgmentInfoTable.tsx`
- `src/components/civil-judgment/CivilJudgmentInfoSearchFilter.tsx`

---

## Loại bỏ Tiền tố "Bộ dữ liệu " & "Dữ liệu " trong Danh sách Sidebar (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Rút gọn tên hiển thị tại danh sách Sidebar:**
   - Tại các trang CSDL Thi hành án dân sự ([CivilJudgmentPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/internal/CivilJudgmentPage.tsx)), CSDL Hộ tịch điện tử ([CivilRegistryDatabasePage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/external/CivilRegistryDatabasePage.tsx)) và HT Quản lý hồ sơ QT ([CaseManagementPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/internal/CaseManagementPage.tsx)), loại bỏ tiền tố `"Bộ dữ liệu "` và `"Dữ liệu "` trong danh sách sidebar bên trái.
   - Nhãn hiển thị trực tiếp tên chính của dữ liệu (Ví dụ: `Yêu cầu thi hành án của cá nhân, cơ quan, tổ chức`, `Quyết định thi hành án dân sự`, `Hồ sơ đăng ký khai sinh`, `Nhập Quốc tịch`, v.v.).

**Các file bị ảnh hưởng:**
- `src/components/pages/internal/CivilJudgmentPage.tsx`
- `src/components/pages/external/CivilRegistryDatabasePage.tsx`
- `src/components/pages/internal/CaseManagementPage.tsx`

---

## Chuẩn hóa Giao diện CSDL về Biện pháp Bảo đảm theo HTTT Trợ giúp pháp lý (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Nâng cấp giao diện Bảng dữ liệu CSDL về biện pháp bảo đảm:**
   - Trong [SecurityMeasuresPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/internal/SecurityMeasuresPage.tsx) (màn hình **Xem dữ liệu thu thập - CSDL về biện pháp BĐ (4)**), nâng cấp hoàn toàn sang mẫu giao diện Bảng dữ liệu chuẩn của **HTTT Trợ giúp pháp lý**.
   - Loại bỏ các tiền tố `"Bộ dữ liệu "` và `"Dữ liệu "` ở danh sách sidebar bên trái, hiển thị trực tiếp tên bộ dữ liệu (`Thông tin chung (Bao gồm người đăng ký và Hợp đồng bảo đảm)`, `Bên bảo đảm`, `Bên nhận bảo đảm`, `Tài sản bảo đảm`).
   - Bổ sung các component mới: [SecurityMeasuresInfoModal.tsx](file:///F:/BTP/DLDC_1/src/components/security-measures/SecurityMeasuresInfoModal.tsx), [SecurityMeasuresInfoTable.tsx](file:///F:/BTP/DLDC_1/src/components/security-measures/SecurityMeasuresInfoTable.tsx) và [SecurityMeasuresInfoSearchFilter.tsx](file:///F:/BTP/DLDC_1/src/components/security-measures/SecurityMeasuresInfoSearchFilter.tsx).

**Các file bị ảnh hưởng:**
- `src/components/pages/internal/SecurityMeasuresPage.tsx`
- `src/components/security-measures/SecurityMeasuresInfoModal.tsx`
- `src/components/security-measures/SecurityMeasuresInfoTable.tsx`
- `src/components/security-measures/SecurityMeasuresInfoSearchFilter.tsx`

---

## Chuẩn hóa Giao diện CSDL Quốc gia về Pháp luật theo HTTT Trợ giúp pháp lý (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Nâng cấp giao diện & Chuẩn hóa Sidebar CSDL Quốc gia về PL:**
   - Trong [LegalNationalPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/internal/LegalNationalPage.tsx) (màn hình **Xem dữ liệu thu thập - CSDL quốc gia về PL (5)**), loại bỏ tiền tố `"Dữ liệu "` trong tiêu đề & danh sách sidebar, hiển thị tên bộ dữ liệu chuẩn: `Văn bản quy phạm pháp luật`, `Nội dung của văn bản quy phạm pháp luật`, `Quan hệ giữa các điều khoản trong các văn bản quy phạm pháp luật`, `Văn bản hợp nhất`, `Hệ thống hóa văn bản quy phạm pháp luật`.
   - Cập nhật [LegalNationalModal.tsx](file:///F:/BTP/DLDC_1/src/components/legal-national/LegalNationalModal.tsx) bổ sung thông tin header mô tả đơn vị `Cục Kiểm tra văn bản quy phạm pháp luật`, đồng bộ giao diện Bảng dữ liệu và Bộ lọc nâng cao theo mẫu **HTTT Trợ giúp pháp lý**.

**Các file bị ảnh hưởng:**
- `src/components/pages/internal/LegalNationalPage.tsx`
- `src/components/legal-national/LegalNationalModal.tsx`

---

## Loại bỏ Nút Kết xuất tại CSDL Quốc gia về Pháp luật (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Bỏ nút Kết xuất (Export):**
   - Trong [LegalNationalSearchFilter.tsx](file:///F:/BTP/DLDC_1/src/components/legal-national/LegalNationalSearchFilter.tsx) của màn hình CSDL Quốc gia về Pháp luật, loại bỏ nút bấm **Kết xuất** màu xanh lá cây khỏi thanh công cụ phía trên bảng dữ liệu.

**Các file bị ảnh hưởng:**
- `src/components/legal-national/LegalNationalSearchFilter.tsx`

---

## Chuẩn hóa Giao diện CSDL TT Tư pháp Dân sự theo HTTT Trợ giúp Pháp lý (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Nâng cấp giao diện CSDL TT Tư pháp Dân sự & Giữ 2 cột Phân loại & Ngày đồng bộ:**
   - Trong [CivilLegalCenterPage.tsx](file:///F:/BTP/DLDC_1/src/components/pages/internal/CivilLegalCenterPage.tsx) (màn hình **Xem dữ liệu thu thập - CSDL TT Tư Pháp dân sự (2)**), chuyển đổi sang mẫu giao diện Bảng dữ liệu của **HTTT Trợ giúp pháp lý**.
   - Thiết kế lại các cột của Bảng dữ liệu bao gồm: `STT` (2 chữ số), `Tên hồ sơ / Quốc gia ủy thác`, `Phân loại` (Ủy thác đến / Ủy thác đi - theo yêu cầu người dùng), `Số công văn / Mã hồ sơ`, `Ngày đồng bộ` (theo yêu cầu người dùng) và `Thao tác`.
   - Loại bỏ các tiền tố `"Dữ liệu "` trong sidebar, hiển thị trực tiếp `Hồ sơ ủy thác tư pháp đến` và `Hồ sơ ủy thác tư pháp đi`.
   - Bổ sung các file component mới: [CivilLegalCenterInfoModal.tsx](file:///F:/BTP/DLDC_1/src/components/civil-legal-center/CivilLegalCenterInfoModal.tsx), [CivilLegalCenterInfoTable.tsx](file:///F:/BTP/DLDC_1/src/components/civil-legal-center/CivilLegalCenterInfoTable.tsx) và [CivilLegalCenterInfoSearchFilter.tsx](file:///F:/BTP/DLDC_1/src/components/civil-legal-center/CivilLegalCenterInfoSearchFilter.tsx).

**Các file bị ảnh hưởng:**
- `src/components/pages/internal/CivilLegalCenterPage.tsx`
- `src/components/civil-legal-center/CivilLegalCenterInfoModal.tsx`
- `src/components/civil-legal-center/CivilLegalCenterInfoTable.tsx`
- `src/components/civil-legal-center/CivilLegalCenterInfoSearchFilter.tsx`

---

## Cập nhật Giá trị Cột Phân loại (Thêm mới / Cập nhật) tại CSDL TT Tư pháp Dân sự (Ngày cập nhật: 10/08/2026)

**Nội dung thay đổi:**
1. **Cập nhật giá trị cột Phân loại:**
   - Cập nhật cột **Phân loại** hiển thị các trạng thái `Thêm mới` và `Cập nhật` thay vì `Ủy thác đến / đi`, chuẩn hóa với yêu cầu theo dõi cập nhật dữ liệu.

**Các file bị ảnh hưởng:**
- `src/components/civil-legal-center/CivilLegalCenterInfoTable.tsx`
- `src/components/civil-legal-center/CivilLegalCenterInfoModal.tsx`









---

## Màn Xem chi tiết danh mục dùng chung — ô disabled nền #F0F0F0 (Ngày cập nhật: 09/10/2026)

**Nội dung thay đổi:**
1. **Đồng bộ màu ô disabled ở chế độ Xem chi tiết (bước 3 — Quan hệ thực thể):**
   - Ô chọn danh mục (`SearchableSelect`) ở đầu bước Quan hệ trong `CategoryWizardModal` (chế độ xem) đổi từ nền `#F1F5F9` / chữ `#94A3B8` sang nền `#F0F0F0` / viền `rgba(0,0,0,0.26)` / chữ `#000000`, đồng bộ với `VIEW_FIELD_CLS` đã dùng ở bước Thông tin chung.
   - Thêm prop `viewOnly` cho `SearchableSelect`; chỉ áp dụng khi `isViewOnly = true`. Form Thêm mới/Chỉnh sửa giữ nguyên kiểu disabled cũ.
   - Không sửa bước 2 (`AttributesTab.tsx` — đang khóa 🔒).

**Các file bị ảnh hưởng:**
- `src/components/pages/category/components/tabs/RelationshipsTab.tsx`

---

## Đồng bộ nền ô bị khóa ở màn Xem chi tiết sang #F0F0F0 (Ngày cập nhật: 09/10/2026)

**Nội dung thay đổi:**
1. **Ô disabled ở chế độ xem dùng nền `#F0F0F0`** theo `compomennt.md` mục 5.2 ("Ô bị khóa ở màn Xem chi tiết"): nền `#F0F0F0`, chữ `#000000`, viền `rgba(0,0,0,0.26)`, placeholder `#94A3B8`. Thay cho nền `slate-50` (#F8FAFC) / chữ `slate-600` trước đây.
   - Modal Xem dịch vụ cung cấp (`mode = view/approve`): 17 ô.
   - Modal Xem kết nối API (phân hệ Xử lý — tab Kết nối API): 23 ô.
   - Modal kết nối API (`APIConnectionModal`): 8 ô.
   - Modal Chỉnh sửa/Xem danh mục (`EditCategoryModal`, chế độ `isViewOnly`): 6 ô; bỏ `opacity-80` (quy định không dùng opacity cho ô disabled).
2. Ô disabled trong form Thêm mới/Chỉnh sửa **không thay đổi** (vẫn theo quy định nền `#F1F5F9`).

**Các file bị ảnh hưởng:**
- `src/components/pages/orchestration/AddProvisionServiceModal.tsx`
- `src/components/common/APIConnectionFormModal.tsx`
- `src/components/common/APIConnectionModal.tsx`
- `src/components/pages/category/components/modals/EditCategoryModal.tsx`

---

## Chuẩn hóa ô disabled trong form Thêm mới/Chỉnh sửa theo #F1F5F9 (Ngày cập nhật: 09/10/2026)

**Nội dung thay đổi:**
1. Ô bị vô hiệu hóa trong form (không phải màn Xem chi tiết) dùng đúng quy định `compomennt.md` mục 5.2: nền `#F1F5F9`, viền `#E2E8F0`, chữ `#94A3B8`, `cursor-not-allowed`, không dùng `opacity`. Thay cho `bg-slate-100` / `bg-slate-50` / `opacity-70` trước đây.
   - Xử lý chung (template): 26 ô của quy tắc đã lưu (`rule.isSaved`) và ô "Cột căn cứ sắp xếp"; bổ sung viền 1px (trước đây ô đã lưu không có viền).
   - Modal Thêm dịch vụ cung cấp: 6 ô Alias/Điều kiện lọc của trường không chọn được, ô "Bảng gốc" (popup liên kết bảng).
   - Modal Hủy công bố: ô "Lý do" khi đang quét.
   - Modal Trường tính toán: ô "Kiểu dữ liệu đầu ra" ở tab Mẫu có sẵn (bỏ `opacity-70`).
2. Không sửa các file đang khóa 🔒 hoặc không có trong `stauts.md`.

**Các file bị ảnh hưởng:**
- `src/components/pages/processing/GenericProcessingPage.tsx`
- `src/components/pages/orchestration/AddProvisionServiceModal.tsx`
- `src/components/pages/category/components/modals/UnpublishModal.tsx`
- `src/components/pages/provisioning/modals/CalculatedFieldModal.tsx`

---

## Chốt dùng nền #F0F0F0 cho mọi ô disabled (Thêm mới / Chỉnh sửa / Xem chi tiết) (Ngày cập nhật: 09/10/2026)

**Nội dung thay đổi:**
1. **Quy định (`compomennt.md` mục 5.2):** ô disabled ở form Thêm mới/Chỉnh sửa đổi nền `#F1F5F9` → `#F0F0F0`, thống nhất với ô bị khóa ở màn Xem chi tiết. Cập nhật class Tailwind chuẩn (bổ sung `disabled:border-[#E2E8F0]`) và ví dụ hiển thị.
2. **Code (file đang mở, màu viết trực tiếp):** 35 ô đổi nền `#F1F5F9` → `#F0F0F0`.
   - Xử lý chung (template): 26 ô.
   - Modal Thêm dịch vụ cung cấp: 7 ô.
   - Modal Hủy công bố: 1 ô.
   - Modal Trường tính toán: 1 ô.
3. **Chưa đổi:** `INPUT_CLS` / `DateInput` trong `collectionUi.tsx` (dùng chung cho nhiều màn đang khóa) — chờ PM xác nhận.

**Các file bị ảnh hưởng:**
- `tailieu/docs/compomennt.md`
- `src/components/pages/processing/GenericProcessingPage.tsx`
- `src/components/pages/orchestration/AddProvisionServiceModal.tsx`
- `src/components/pages/category/components/modals/UnpublishModal.tsx`
- `src/components/pages/provisioning/modals/CalculatedFieldModal.tsx`

---

## Đổi nền ô disabled trong file dùng chung collectionUi.tsx sang #F0F0F0 (Ngày cập nhật: 09/10/2026)

**Nội dung thay đổi (PM xác nhận đổi file dùng chung, áp dụng cả màn đang khóa):**
1. `INPUT_CLS`: `disabled:bg-[#F1F5F9]` → `disabled:bg-[#F0F0F0]`. Áp dụng cho mọi ô nhập/select dùng `INPUT_CLS` (34 file, gồm các màn Quản trị, Master Data, Dữ liệu mở, Cấu hình kết nối, Cung cấp dữ liệu, Danh mục...).
2. `DateInput` (ô chọn ngày): khi disabled nền `!bg-[#F1F5F9]` → `!bg-[#F0F0F0]`.

**Còn tồn (file đang khóa, có class riêng đè lên INPUT_CLS — chưa sửa):**
- `open-data-category/OpenDataCategoryPage.tsx` (`READONLY_INPUT`, `READONLY_TEXTAREA`)
- `master-data/MasterDataWizard.tsx` (`TEXTAREA_CLS`)
- `open-data/OpenDataSetupPage.tsx` (`TEXTAREA_CLS`)

**Các file bị ảnh hưởng:**
- `src/components/pages/collection/collectionUi.tsx`

---

## Hoàn tất đồng bộ nền #F0F0F0 cho ô disabled/readOnly toàn hệ thống (Ngày cập nhật: 09/10/2026)

**PM mở khóa** (cập nhật `stauts.md`): `DataCollectionConfigSection`, `StructureLoadingConfig`, `ProcessingRuleSetupPage`, `ScheduleManagementModal`, `RelationshipsTab` (danh mục), `MasterDataWizard`, `OpenDataSetupPage`, `OpenDataCategoryPage`; thêm mục "Đồng bộ nền ô disabled #F0F0F0" cho các file chưa có trong danh sách.

**Nội dung thay đổi:** đổi nền ô bị khóa (`slate-50`, `slate-100`, `gray-50`, `white`, `#F1F5F9`, hoặc chưa đặt nền) sang `#F0F0F0`:
- Thu thập: `DataCollectionConfigSection` (3 ô), `StructureLoadingConfig` (3), `AddDataCollectionForm` (2), `SendDataForm` (1).
- Xử lý: `ScheduleManagementModal` (3), `ProcessingRuleSetupPage` (1), `DataViewer` (1).
- Danh mục: `SetupCategoryList` (1), `SetupCategoryStructure` (1), `CategoryManagementPage` (1 — ô Mã khi sửa), `RelationshipsTab` (ô chọn danh mục dạng `div`).
- Dữ liệu mở: `OpenDataCategoryPage` (`READONLY_INPUT`, `READONLY_TEXTAREA`), `OpenDataSetupPage` (`TEXTAREA_CLS`, `READONLY_BOX`).
- Master Data: `MasterDataWizard` (`TEXTAREA_CLS`).
- Khác: `APIConfigModal` (1), `ProcessRequestModal` (1), `ResetPasswordModal` (1).

**Cố ý không đổi:** ô tìm kiếm `CategoryManagementPage` (readOnly nhưng bấm để mở tìm kiếm nâng cao); nút bấm disabled (theo mục 5.1); dòng checkbox bị khóa trong `ProvisionAccessControlModal`; công tắc (toggle) trong `ProvisionServiceModal`.

**Các file bị ảnh hưởng:**
- `tailieu/docs/stauts.md`
- `src/components/category/SetupCategoryList.tsx`, `src/components/category/SetupCategoryStructure.tsx`
- `src/components/collection/AddDataCollectionForm.tsx`, `src/components/collection/SendDataForm.tsx`
- `src/components/modals/APIConfigModal.tsx`, `src/components/modals/ProcessRequestModal.tsx`
- `src/components/pages/CategoryManagementPage.tsx`
- `src/components/pages/collection/DataCollectionConfigSection.tsx`, `src/components/pages/collection/StructureLoadingConfig.tsx`
- `src/components/pages/processing/ScheduleManagementModal.tsx`, `src/components/pages/processing/ProcessingRuleSetupPage.tsx`
- `src/components/processing/DataViewer.tsx`, `src/components/user/ResetPasswordModal.tsx`
- `src/components/pages/open-data-category/OpenDataCategoryPage.tsx`, `src/components/pages/open-data/OpenDataSetupPage.tsx`
- `src/components/pages/master-data/MasterDataWizard.tsx`
- `src/components/pages/category/components/tabs/RelationshipsTab.tsx`

---

## Wizard Tạo mới dữ liệu chủ — khóa "Tên cơ sở dữ liệu / Hệ thống" cho tới khi chọn Đơn vị chủ quản (Ngày cập nhật: 09/10/2026)

**Nội dung thay đổi (Bước 1 — Khởi tạo dữ liệu chủ):**
1. Trường **Tên cơ sở dữ liệu / Hệ thống** bị vô hiệu hóa (nền `#F0F0F0`, theo `INPUT_CLS`) khi chưa chọn **Đơn vị chủ quản**; mở khi đã chọn. Lựa chọn rỗng hiển thị "-- Chọn Đơn vị chủ quản trước --" khi đang khóa.
2. Khi bỏ chọn Đơn vị chủ quản (về "-- Chọn đơn vị chủ quản --"), giá trị Tên CSDL/Hệ thống đã chọn được xóa.

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Wizard Tạo mới/Chỉnh sửa dữ liệu chủ — chuẩn hóa theo compomennt.md (Ngày cập nhật: 09/10/2026)

**Nội dung thay đổi:**
1. **Chiều cao modal cố định** (mục 5.4): `max-h-[90vh]` → `h-[90vh] max-h-[800px]`, thân modal thêm `min-h-0` để tự cuộn; header/stepper/footer không co giãn khi đổi bước.
2. **Báo lỗi trùng Mã thực thể / Tên dữ liệu chủ** (mục 5.2): chữ thông báo 13px → 12px; viền ô chuyển đỏ `#DC2626` khi trùng (thêm `aria-invalid`).
3. **Select ở Bước 1** (mục 5.7): Loại thực thể, Phạm vi sử dụng, Đơn vị chủ quản, Tên CSDL/Hệ thống dùng icon `ChevronDown` tự vẽ thay mũi tên mặc định trình duyệt (đồng bộ màn Thiết lập danh mục).
4. **Ngày hiệu lực**: thay `input type="date"` bằng component chung `DateInput` (luôn hiển thị dd/mm/yyyy, giá trị vẫn ISO yyyy-mm-dd; vẫn khóa khi chỉnh sửa thực thể đã có).
5. **Tiêu đề modal**: hiển thị "Chỉnh sửa dữ liệu chủ" khi đang chỉnh sửa (trước luôn là "Tạo mới dữ liệu chủ").

**Các file bị ảnh hưởng:**
- `src/components/pages/master-data/MasterDataWizard.tsx`

---

## Modal Thông tin cá nhân — chuẩn hóa theo component chung và trường dữ liệu người dùng (Ngày cập nhật: 09/10/2026)

**Nội dung thay đổi:**
1. **Dữ liệu:** tạo `CURRENT_USER` (`user/currentUser.ts`) cùng cấu trúc trường với `User` ở Quản lý người dùng (Họ và tên, Tên đăng nhập, Email, Số điện thoại, Đơn vị, Vai trò, Nhóm người dùng, Trạng thái, Ngày tạo, Đăng nhập gần nhất). Giá trị khớp TopBar (Nguyễn Văn A / Quản trị viên / admin@moj.gov.vn) — trước đây modal hiển thị email `nguyenvana@moj.gov.vn` khác TopBar.
2. **Bỏ trường không có trong dữ liệu người dùng:** Mã nhân viên, Phòng ban, Chức vụ, Ngày tham gia (giá trị gán cứng).
3. **Giao diện theo `compomennt.md`, đồng bộ "Chi tiết người dùng":**
   - Modal xem chi tiết chiều cao cố định `h-[90vh] max-h-[800px]`, thân tự cuộn, bo `rounded-2xl`, header/footer cố định, footer nền `#F8FAFC` (mục 5.4); render qua `Portal`, `z-[110]`, bấm nền để đóng.
   - Tiêu đề 16px / 500 `#020817`; nút X dùng `BTN_GHOST_ICON`; nút Đóng dùng `BTN_OUTLINE`.
   - Cặp Nhãn – Giá trị dùng `FIELD_LABEL` / `FIELD_VALUE` 13px (mục 5.17); khối "Thông tin cơ bản", "Nhóm người dùng" dùng `SECTION_TITLE` có vạch xanh.
   - Vai trò, Trạng thái, Nhóm người dùng hiển thị bằng `Badge` (mục 5.8).
   - Bỏ khối avatar chữ "NV" (không có trong mẫu Chi tiết người dùng).

**Các file bị ảnh hưởng:**
- `src/components/modals/UserProfileModal.tsx`
- `src/components/user/currentUser.ts` (mới)
- `tailieu/docs/stauts.md`

---

## Modal Thông tin cá nhân — bỏ khối Nhóm người dùng (Ngày cập nhật: 09/10/2026)

**Nội dung thay đổi:** bỏ khối "Nhóm người dùng" theo yêu cầu PM; modal chỉ còn khối "Thông tin cơ bản".

**Các file bị ảnh hưởng:**
- `src/components/modals/UserProfileModal.tsx`

---

## Modal Thông tin cá nhân — chiều cao theo nội dung (Ngày cập nhật: 09/10/2026)

**Nội dung thay đổi:** bỏ chiều cao cố định `h-[90vh] max-h-[800px]` → `max-h-[90vh]` (modal ít trường, áp dụng ngoại lệ "modal nhỏ chỉ có vài trường" mục 5.4) để bỏ khoảng trắng dưới khối Thông tin cơ bản; nội dung vượt 90vh thì thân modal tự cuộn.

**Các file bị ảnh hưởng:**
- `src/components/modals/UserProfileModal.tsx`