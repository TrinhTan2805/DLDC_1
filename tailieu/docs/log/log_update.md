# Nhật ký cập nhật hệ thống (Changelog)

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
