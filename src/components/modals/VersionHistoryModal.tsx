import { X, History, Calendar, Clock, FileText } from 'lucide-react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockVersions = [
  {
    id: 34,
    version: 'v2.6.23',
    date: '25/08/2026',
    time: '16:00',
    content: `1. Modal "Công khai danh mục" (CategoryPage.tsx):
- Đồng bộ cỡ chữ 3 dòng "Trạng thái phê duyệt/Phiên bản hiện hành/Quyền chia sẻ" về 13px, gắn trực tiếp lên từng thẻ \`<p>\`/\`<span>\` thay vì chỉ dựa vào kế thừa từ div cha.

2. Tab "Công khai" — trang Biên tập danh mục (CategoryPage.tsx):
- Bỏ 3 thẻ tóm tắt "Trạng thái phê duyệt/Phiên bản hiện hành/Quyền chia sẻ" khỏi tab Công khai.
- Modal "Hủy công khai danh mục": bổ sung cảnh báo "Danh mục đang được khai thác bởi (n) API" (mock \`exploitingApiCount\`).

3. Thiết lập danh mục dùng chung (CategoryWizardModal.tsx, CategoryInfoViewModal.tsx, categoryTypes.ts, categoryConstants.ts):
- Bổ sung trường "Loại danh mục" (dropdown: Danh mục dùng chung từ TTDLQG / Danh mục nghiệp vụ / Danh mục tổng hợp theo quyết định) vào bước Thông tin chung — áp dụng cho cả tạo mới/chỉnh sửa/xem chi tiết (CategoryWizardModal dùng chung 1 modal cho 3 chế độ) và modal xem chi tiết riêng (CategoryInfoViewModal).
- Thêm type \`CategoryType\` và \`categoryTypeLabels\` dùng chung trong \`categoryTypes.ts\`/\`categoryConstants.ts\`.

4. Thống kê danh mục → Báo cáo thống kê danh sách danh mục (CategoryReportListPage.tsx):
- Bổ sung bộ lọc multi-select "Loại danh mục" cạnh bộ lọc "Đơn vị quản lý", kết hợp lọc AND với dữ liệu mock \`categoryType\` gắn theo từng đơn vị quản lý.

5. Sidebar "Biên tập danh mục" (InnerSidebar.tsx, CategoryAListPage.tsx, CategoryPage.tsx):
- Đổi bộ lọc trạng thái công khai từ dạng nút pill sang dropdown/select, thêm nhãn "Trạng thái công khai" (prop \`filterLabel\` mới trên InnerSidebar).
- Nâng cấp trạng thái công khai từ boolean sang tri-state \`CategoryPublishStatus\` ('unpublished'|'published'|'stopped') để hỗ trợ thêm lựa chọn lọc "Ngừng công khai" — trước đây trạng thái này chỉ tồn tại nội bộ trong CategoryPage, không truyền ra ngoài sidebar được.
- Bỏ header nhóm "Dữ liệu nghiệp vụ (N)" khỏi sidebar Biên tập danh mục (dùng prop \`flatList\` có sẵn), chỉ hiển thị thẳng danh sách thẻ danh mục.

6. Mã nguồn bị ảnh hưởng:
- \`src/components/pages/category/CategoryPage.tsx\`
- \`src/components/pages/category/CategoryAListPage.tsx\`
- \`src/components/pages/category/categoryTypes.ts\`
- \`src/components/pages/category/categoryConstants.ts\`
- \`src/components/pages/category/components/modals/CategoryWizardModal.tsx\`
- \`src/components/pages/category/components/modals/CategoryInfoViewModal.tsx\`
- \`src/components/pages/category/reports/CategoryReportListPage.tsx\`
- \`src/components/pages/collection/InnerSidebar.tsx\``
  },
  {
    id: 33,
    version: 'v2.6.22',
    date: '25/08/2026',
    time: '15:20',
    content: `1. Phân hệ Cung cấp dữ liệu — Dịch vụ chia sẻ (DataProvisionServicesPage.tsx):
- Bổ sung inner menu "Danh mục dữ liệu" cho màn hình Dữ liệu mở, cho phép chuyển đổi qua lại giữa 32 danh mục dữ liệu mở ngay trong nội dung trang, đồng bộ cơ chế hiển thị với các menu CSDL Trong ngành/Ngoài ngành.
- Mở rộng cơ chế inner menu "Danh mục dữ liệu" áp dụng cho cả các mục chỉ có 1 bản ghi (Dữ liệu chủ, Trẻ em thuộc CSDL Ngoài ngành), hiển thị đúng số đếm "(1)" đồng bộ với các mục khác.
- Với các mục chỉ có 1 bản ghi, đổi tên hiển thị trong Danh mục dữ liệu thành tên loại cơ sở dữ liệu tương ứng (VD: "Trẻ em", "Dữ liệu chủ") thay vì tên đầy đủ của dịch vụ, đồng bộ với tiêu đề trang.

2. Mã nguồn bị ảnh hưởng:
- \`src/components/pages/provisioning/DataProvisionServicesPage.tsx\``
  },
  {
    id: 32,
    version: 'v2.6.21',
    date: '03/08/2026',
    time: '17:30',
    content: `1. Tổng quan thu thập (CollectionDashboard.tsx):
- Bổ sung bộ lọc chỉ tiêu (Dịch vụ/Bản ghi/Dung lượng) và khoảng ngày cho biểu đồ "Thu thập dữ liệu theo nguồn cung cấp dữ liệu"; sau đó bỏ bộ lọc theo từng nguồn (checkbox pill) theo phản hồi, chỉ giữ lại bộ lọc chỉ tiêu và khoảng ngày.

2. Thống kê CSDL tích hợp (StatisticsPage.tsx):
- Chuyển bộ lọc (chỉ tiêu, khoảng ngày, hạng mục dữ liệu) vào khối "Tùy chỉnh hiển thị"; bỏ giới hạn chiều cao/thanh cuộn biểu đồ; đổi đơn vị hiển thị từ số bản ghi sang dung lượng (GB).
- Thử nghiệm đổi biểu đồ thanh ngang sang bullet chart rồi quay lại biểu đồ cột dọc theo phản hồi; giảm khoảng cách giữa các cột; điều chỉnh chiều cao khối biểu đồ và nhãn trục X nghiêng để hiển thị đầy đủ tên hệ thống, sau đó tinh chỉnh lại cho vừa khít, tránh dư khoảng trắng.

3. Trang Tổng quan (DashboardHome.tsx):
- Đổi nút "Xem chi tiết" của 3 thẻ KPI Thu thập/Xử lý/Chia sẻ để điều hướng sang các trang tổng quan chuyên biệt tương ứng (Tổng quan thu thập/xử lý/cung cấp); bổ sung 3 thẻ KPI mới (Danh mục dùng chung, Dữ liệu mở, Dữ liệu chủ) điều hướng sang các trang tổng quan tương ứng; cho phép bấm vào bất kỳ vị trí nào trên thẻ KPI để điều hướng, không chỉ riêng nút.
- Bỏ biểu đồ "Danh mục dùng chung" và "Top tính năng được truy cập nhiều nhất" khỏi trang Tổng quan; đổi tên "Tỷ lệ đăng nhập thành công/thất bại" thành "Số lượt đăng nhập thành công/thất bại", sau đó bỏ hẳn 2 biểu đồ "Số lượt đăng nhập thành công/thất bại" và "Người dùng mới và không hoạt động (>30 ngày)"; bổ sung nút "Xem chi tiết" (in đậm) tại khối "Thống kê người dùng hệ thống" điều hướng sang "Quản lý người dùng".

4. Tổng quan danh mục (CategoryDashboardPage.tsx):
- Chỉnh cỡ chữ tiêu đề trang về 18px, tiêu đề các biểu đồ về 16px; đổi thẻ "Hệ thống đang khai thác" thành "Số API đang khai thác".
- Bổ sung biểu đồ tròn (donut) "Thị phần danh mục theo nguồn dữ liệu" (Đồng bộ từ TTDLQG/Kho DLDC/Tự cập nhật trực tiếp), tâm hiển thị tổng số danh mục, nhãn % màu khớp từng phần; sắp xếp lại bố cục 2 cột đều nhau, đưa biểu đồ "Tần suất cập nhật & Tạo mới" xuống dưới biểu đồ thị phần, cân chỉnh chiều cao 2 cột bằng nhau.

5. Tổng quan dữ liệu mở (OpenDataDashboardPage.tsx) & Tổng quan dữ liệu chủ (MasterDataDashboardPage.tsx):
- Chỉnh cỡ chữ tiêu đề trang (18px) và tiêu đề biểu đồ (16px); bổ sung biểu đồ "Tần suất cập nhật & Tạo mới (6 tháng)" vào Dữ liệu mở (đặt cạnh "Lượt chia sẻ theo API", tăng kích thước donut từng bước phê duyệt); bổ sung lại các thẻ số liệu tổng quan cho Dữ liệu chủ, đổi thẻ "Hệ thống đang khai thác" thành "Số API đang khai thác".

6. Tổng quan xử lý dữ liệu (DashboardReportPage.tsx, dùng chung cho route "Tổng quan xử lý dữ liệu"):
- Bỏ nút quay lại; đổi tiêu đề "Báo cáo xử lý dữ liệu" thành "Tổng quan xử lý dữ liệu".

7. Tổng quan cung cấp (DataProvisionDashboard.tsx):
- Chỉnh cỡ chữ tiêu đề trang (18px) và 3 tiêu đề biểu đồ (16px); bổ sung biểu đồ tròn (donut) "Biểu đồ cung cấp dữ liệu theo phương thức chia sẻ" (REST API/Excel/CSV/JSON).
- Bỏ khối "Thao tác nhanh", thay bằng biểu đồ donut nói trên; đổi "Top 10 API có tỷ lệ lỗi cao nhất" thành "Danh sách API đang bị lỗi", thêm phân trang (nút "<"/">") hiển thị 5 API/trang thay vì cuộn; đồng bộ cỡ chữ bảng về 13px; cân chỉnh chiều cao 2 khối bằng nhau, căn lề trên cho tiêu đề biểu đồ donut.

8. Mã nguồn bị ảnh hưởng:
- \`src/components/collection/CollectionDashboard.tsx\`
- \`src/components/pages/admin/StatisticsPage.tsx\`
- \`src/components/dashboard/DashboardHome.tsx\`
- \`src/components/dashboard/DashboardReportPage.tsx\`
- \`src/components/pages/category/CategoryDashboardPage.tsx\`
- \`src/components/pages/open-data/OpenDataDashboardPage.tsx\`
- \`src/components/pages/master-data/MasterDataDashboardPage.tsx\`
- \`src/components/pages/provisioning/DataProvisionDashboard.tsx\``
  },
  {
    id: 31,
    version: 'v2.6.20',
    date: '31/07/2026',
    time: '10:00',
    content: `1. Trang Tổng quan (DashboardHome.tsx) — 3 thẻ KPI (Thu thập/Xử lý/Chia sẻ):
- Bổ sung nút "Xem chi tiết →" điều hướng sang trang báo cáo tương ứng; thêm dung lượng ước tính cạnh số bản ghi (nhỏ hơn, không in đậm); bổ sung chú thích "So với tháng trước" dưới badge phần trăm tăng trưởng.

2. Trang Tổng quan — Thống kê dữ liệu chủ:
- Bỏ mục "Top 5 mô hình dữ liệu chủ có dung lượng lớn nhất"; tăng kích thước (chiều ngang, chiều cao) biểu đồ xu hướng.
- Đổi biểu đồ "Xu hướng hình thành mô hình dữ liệu chủ" thành "Xu hướng thay đổi dữ liệu chủ trong 6 tháng qua" (LineChart 3 đường: Tổng thay đổi, Thay đổi từ nguồn, Thay đổi thủ công).
- Cập nhật mock data "Mô hình dữ liệu chủ công khai trên Cổng dữ liệu mở" theo đúng 27 tập dữ liệu tại Phụ lục II — Quyết định 1634/QĐ-BTP ngày 30/6/2026.

3. Trang Tổng quan — Danh mục dùng chung:
- Thay biểu đồ "Số lượng theo loại" bằng bộ 24 danh mục dùng chung thực tế theo Phụ lục I, mục I.2 (Quyết định 1634/QĐ-BTP); gộp 2 biểu đồ "hình thành"/"chia sẻ" thành 1 danh sách xếp hạng (ranked list) với 2 thanh tiến trình màu pastel và đơn vị "bản ghi".

4. Trang Tổng quan — Dữ liệu mở:
- Thay biểu đồ cột "Đã công bố/Đang chờ" bằng: (a) các thẻ tỷ lệ xử lý theo từng bước phê duyệt/công bố dạng gauge tròn (donut nhỏ), (b) danh sách xếp hạng "Lượt chia sẻ theo API của danh mục đã công bố" (thử nghiệm Treemap trước khi đổi sang ranked list theo phản hồi).

5. Trang Tổng quan — Thống kê người dùng hệ thống (component mới):
- Bỏ 2 biểu đồ "Tài khoản người dùng" và "Tần suất tra cứu dịch vụ"; thay bằng: 8 thẻ số liệu (tổng tài khoản, phân bổ theo đơn vị, thời gian làm việc TB/phiên, chưa đăng nhập lần đầu, mới/cập nhật/ngưng hoạt động/đang hoạt động trong tháng — đều kèm tỷ lệ % hoặc so sánh với tháng trước).
- Bổ sung biểu đồ "Tỷ lệ đăng nhập thành công/thất bại" và "Người dùng mới và không hoạt động (>30 ngày)" dạng cột chồng số lượng, có bộ lọc Tuần/Quý/Năm (mặc định Tuần); bổ sung "Top tính năng được truy cập nhiều nhất" dạng ranked list.

6. Trang Báo cáo chia sẻ dữ liệu (DashboardReportPage.tsx):
- Bổ sung nút "Xem chi tiết →" (không in đậm) vào 6 thẻ thống kê đầu trang.
- Thẻ "Yêu cầu chia sẻ dữ liệu đang chờ xử lý": gộp nút "Xem chi tiết" của từng dòng thành 1 nút chung ở đầu thẻ, điều hướng sang "Cung cấp dữ liệu theo yêu cầu".
- Bổ sung 2 hệ thống nguồn TTDLQG và Tòa án vào biểu đồ/bộ lọc "theo Hệ thống nguồn"; đổi mặc định bộ lọc ngày: ô "đến ngày" nhận ngày hiện tại thay vì ô "từ ngày".

7. Mã nguồn bị ảnh hưởng:
- \`src/components/dashboard/DashboardHome.tsx\`
- \`src/components/dashboard/DashboardReportPage.tsx\`
- \`src/components/dashboard/kpiReportData.ts\``
  },
  {
    id: 30,
    version: 'v2.6.19',
    date: '27/07/2026',
    time: '16:30',
    content: `1. Phân hệ Dữ liệu chủ — Cập nhật dữ liệu chủ (modal Chi tiết bản ghi, mở từ tab Dữ liệu):
- Bổ sung tab "Lịch sử" (trước đây chỉ hiển thị khi mở từ tab Phê duyệt), giữ nguyên tab "Giá trị dữ liệu chủ".
- Tại tab "Giá trị dữ liệu chủ": bổ sung hiển thị "Trạng thái dữ liệu" (Mới/Cập nhật) và "Trạng thái công khai" cạnh "Trạng thái" (phê duyệt).
- Tại tab "Lịch sử": bổ sung mục "Xem dữ liệu gốc" (thu/mở) hiển thị dữ liệu gốc khi vừa đồng bộ; nếu bản ghi chưa từng chỉnh sửa so với dữ liệu gốc thì hiển thị thông báo "Không có chỉnh sửa so với dữ liệu gốc".

2. Phân hệ Dữ liệu chủ — Modal "So sánh phiên bản dữ liệu chủ" (tab Dữ liệu):
- Bỏ 2 nút "Khôi phục phiên bản" và "Tải về" khỏi khối so sánh phiên bản.

3. Phân hệ Dữ liệu chủ — Cơ chế "Liên kết chéo thực thể" (tab Thông tin liên quan trong modal Chi tiết bản ghi):
- Chuyển cơ chế xác định liên kết chéo từ hard-code 1 trường CCCD cố định theo từng danh mục sang cấu hình quan hệ giữa các danh mục (danh sách quan hệ khai báo danh mục nguồn/đích, trường khóa liên kết mỗi bên, loại quan hệ 1-1/1-n/n-n, trạng thái hoạt động) — cùng nguyên lý với mục "Thiết lập quan hệ giữa thực thể".
- Đổi nhãn hiển thị "Liên kết chéo thực thể — cùng chủ thể (CCCD) tại loại dữ liệu chủ khác (N)" thành "Liên kết chéo thực thể (N)"; đổi thông báo rỗng (chưa cấu hình quan hệ / không có bản ghi liên kết) thành "Thực thể dữ liệu chưa được thiết lập quan hệ với thực thể khác".
- Bổ sung dữ liệu mẫu minh họa: đồng bộ CCCD của bản ghi thi hành án "QĐ-THADS-2026-00287" với 1 bản ghi "Cá nhân hành nghề bổ trợ tư pháp" và 1 bản ghi "Đối tượng trợ giúp pháp lý" để thể hiện trực quan liên kết chéo hoạt động đúng.

4. Mã nguồn bị ảnh hưởng:
- \`src/components/pages/master-data/MasterDataUpdateItemPage.tsx\``
  },
  {
    id: 29,
    version: 'v2.6.18',
    date: '26/07/2026',
    time: '18:00',
    content: `1. Đồng bộ mã nguồn & môi trường phát triển:
- Đồng bộ mã nguồn mới nhất từ nhánh upstream/main, xử lý xung đột merge tại các màn hình Thuộc tính, Mô hình dữ liệu chủ và Quy tắc hợp nhất.

2. Phân hệ Dữ liệu chủ — Wizard "Tạo mới dữ liệu chủ" & Mô hình dữ liệu chủ:
- Bổ sung bước "Quy tắc đánh phiên bản" (điều kiện tạo phiên bản mới + định dạng số phiên bản) vào cả wizard 7 bước và modal xem chi tiết thực thể tại Mô hình dữ liệu chủ.
- Đồng bộ dữ liệu thực từ Quy tắc hợp nhất, Thiết lập quan hệ vào các bước xem chi tiết thay vì dữ liệu mẫu tĩnh; chuẩn hóa cỡ chữ 13px cho toàn bộ modal xem chi tiết.
- Sửa lỗi căn chỉnh hàng ngang của thanh bước (stepper) khi tiêu đề bước xuống nhiều dòng; tăng kích thước modal xem chi tiết; bổ sung nút "Tiếp theo" ở chân từng bước.

3. Phân hệ Dữ liệu chủ — Cập nhật dữ liệu chủ (tab Dữ liệu):
- Bỏ inner-tab Gộp tự động/Chờ rà soát/Không khớp; gộp "Lịch sử đồng bộ" thành nút mở modal thay vì tách tab riêng, bổ sung thêm các trường dữ liệu (số bản ghi mới/cập nhật/không đổi, thời lượng, lần đồng bộ trước) cho bảng lịch sử.
- Hiển thị các bản ghi nghi trùng lặp trong Lịch sử đồng bộ dạng bảng phẳng kèm nút đóng/mở theo từng nhóm bản ghi trùng.
- Bổ sung cột "Trạng thái dữ liệu" (Mới/Cập nhật), rút gọn còn 3 trường nghiệp vụ hiển thị ngoài danh sách; cột Thao tác chuyển sang icon Xem chi tiết + menu 3 chấm (Phiên bản, Rà soát, Trình duyệt, Công khai/Hủy công khai, Xóa).
- Bổ sung bộ lọc nâng cao (Trạng thái phê duyệt, Trạng thái công khai, Trạng thái dữ liệu) dạng panel ẩn/hiện qua icon phễu, dàn cùng 1 hàng với thanh tìm kiếm.
- Sắp xếp lại các nút thao tác hàng loạt: Đồng bộ dữ liệu/Lịch sử đồng bộ chuyển lên cùng hàng thanh tìm kiếm; Gửi duyệt/Công khai/Hủy công khai (mới bổ sung, áp dụng hàng loạt theo bản ghi được chọn) chuyển lên cùng hàng với tab Đang hoạt động/Đã xóa.
- Bỏ hẳn tab "Phiên bản" (báo cáo lịch sử thay đổi tổng hợp); giữ lại modal xem lịch sử phiên bản/so sánh phiên bản theo từng bản ghi với cơ chế đóng modal trước khi mở modal kế tiếp và nút Quay lại về modal trước đó.

4. Phân hệ Dữ liệu chủ — Cập nhật dữ liệu chủ (tab Phê duyệt):
- Bỏ thẻ thống kê "Đang rà soát", đưa thẻ "Tổng yêu cầu" lên vị trí đầu tiên.
- Bổ sung trạng thái lọc "Tất cả" hiển thị toàn bộ bản ghi không phân biệt trạng thái phê duyệt.
- Đổi nhãn trạng thái "Soạn thảo" thành "Chưa phê duyệt" trên toàn bộ badge và bộ lọc trạng thái phê duyệt, áp dụng đồng bộ cả tab Dữ liệu và Tra cứu dữ liệu chủ.
- Bổ sung cơ chế "Liên kết chéo thực thể" tại tab Thông tin liên quan trong modal Chi tiết bản ghi: xác định các bản ghi ở loại dữ liệu chủ khác cùng chủ thể (khớp CCCD), thay thế cách gợi ý trùng lặp theo tên trong cùng 1 loại dữ liệu trước đây.

5. Phân hệ Dữ liệu chủ — Báo cáo tìm kiếm dữ liệu chủ:
- Làm lại tab "Báo cáo sử dụng dữ liệu chủ" theo mẫu thiết kế "Báo cáo tình trạng khai thác danh mục": bộ lọc multi-select thực thể dữ liệu chủ + khoảng thời gian thống kê, nút Truy xuất báo cáo/Xuất File, trạng thái rỗng trước khi truy xuất, biểu đồ AreaChart theo thời gian và bảng hệ thống/cổng dịch vụ kết nối kèm trạng thái + lượt truy cập gần nhất.
- Tab "Tra cứu dữ liệu chủ": gộp 2 ô lọc Mã/Tên thành 1 ô tìm theo mã hoặc tên bản ghi; đổi bộ lọc Trạng thái thành Trạng thái phê duyệt (dùng chung dữ liệu với Cập nhật dữ liệu chủ); nút Xem chi tiết chuyển sang icon con mắt, mở modal chi tiết bản ghi đồng bộ giao diện với Cập nhật dữ liệu chủ.`
  },
  {
    id: 28,
    version: 'v2.6.17',
    date: '21/07/2026',
    time: '17:15',
    content: `1. Đồng bộ mã nguồn Git & Xử lý xung đột (upstream/main):
- Đồng bộ toàn bộ thay đổi mới từ nhánh main (bao gồm các gói cập nhật từ nhánh nhalt8/kdlbtp_v1.3), xử lý triệt để xung đột merge tại AttributesManagementTab, MasterDataScaleManagementPage và nhật ký hệ thống log_update.md.

2. Hệ thống Thông báo (Notification System):
- Re-design hệ thống thông báo theo spec Noti.xlsx với 4 loại: Thành công (success), Cảnh báo (warning), Lỗi (error), và Thông báo (info).
- Tích hợp danh mục notificationCatalog.ts dùng chung cho cả TopBar dropdown và trang Quản lý thông báo (NotificationPage).

3. Phân hệ Dữ liệu chủ (Master Data):
- Quy trình Thêm/Sửa thực thể: Loại bỏ luồng Thêm mới nhanh, yêu cầu toàn bộ thao tác thêm/sửa đi qua Wizard 6 bước với kiểm tra trùng mã/tên thực thể trực tiếp.
- Chế độ chỉ đọc (View-only): Khóa phân quyền chỉ đọc cho 4 tab phụ (Thuộc tính, Quan hệ, Quy tắc hợp nhất, Quy tắc định danh).
- Bổ sung trường Lý do từ chối bắt buộc khi Từ chối phê duyệt và thêm nút Hủy phê duyệt đối với bản ghi Đã phê duyệt.

4. Phân hệ Cung cấp dữ liệu & Đối soát:
- Chuẩn hóa nhãn & 4 thẻ tổng quan đối soát dữ liệu, redesign bảng Lịch sử đối soát với StatusTag và bổ sung thẻ thống kê động theo tab tại màn Cung cấp dữ liệu theo yêu cầu.`
  },
  {
    id: 27,
    version: 'v2.6.16',
    date: '15/07/2026',
    time: '11:15',
    content: `1. Phân hệ Cung cấp dữ liệu — Quy trình đối soát dữ liệu (DataReconciliationPage):
- Thay đổi nhãn & cấu trúc 4 thẻ tổng quan: "Tổng số lần chạy" → "Tổng Dữ liệu đối soát", "Thành công" → "Khớp dữ liệu", "Cảnh báo chênh lệch" → "Không khớp", "Lần chạy gần nhất" → "Tỷ lệ khớp".
- Redesign bảng Lịch sử đối soát: Bỏ toàn bộ khối header, thêm tab bar Danh sách đối soát, bổ sung cột STT, giữ cột Tên tiến trình & Tên API riêng, cập nhật cột Trạng thái sang dạng StatusTag (Chưa đối soát, Khớp dữ liệu, Không khớp).
- Cấu hình lại các modal: Modal Chi tiết đối soát và Modal Lịch sử đối soát (đồng bộ hóa nhãn các cột số bản ghi cung cấp/bản ghi nhận, sai lệch và StatusTag).

2. Cung cấp dữ liệu theo yêu cầu (DataProvisionRequestPage):
- Thay thế khối mô tả tiêu đề bằng hàng 4 thẻ thống kê hiển thị động theo trạng thái của từng tab (Tiếp nhận yêu cầu, Tra cứu & Kết xuất, Bàn giao dữ liệu).`
  },
  {
    id: 26,
    version: 'v2.6.15',
    date: '06/07/2026',
    time: '14:30',
    content: `1. Phân hệ Dữ liệu chủ (Master Data) — Nâng cấp Wizard "Tạo mới dữ liệu chủ" (MasterDataWizard.tsx):
- Bước 1 (Khởi tạo): Thêm kiểm tra trùng Mã/Tên thực thể trực tiếp; chặn chuyển bước nếu trùng. Tích hợp cấu hình Đăng ký nguồn dữ liệu dạng Chip (badge loại nguồn, độ mịn 1:1 hoặc 1:n, nút xóa).
- Bước 3 (Thuộc tính): Thêm bảng ánh xạ cột nguồn → thuộc tính và cấu hình gom nguồn 1:n (quy tắc gom: mới nhất, nhiều nhất, max, min). Hỗ trợ nút chuyển nhanh giữa chọn từ Kho DLDC và tự thêm mới trường. Đổi checkbox duy nhất/index thành Khóa chính (PK).
- Bước 4 (Quy tắc hợp nhất): Tách biệt thành 3 sub-tab:
  + So khớp: Trọng số (%), Thuật toán so khớp (Jaro-Winkler, Levenshtein, Ngữ âm), Kiểu so khớp (Khớp tuyệt đối/gần đúng), Ngưỡng gộp tự động, Ngưỡng rà soát, và khối hard-block dạng chip.
  + Hợp nhất giá trị: Cấu hình Null Handling và các chiến lược gộp (Theo nguồn / Độ ưu tiên).
  + Kiểm thử: Chạy mô phỏng kiểm thử với dữ liệu mẫu, hiển thị 4 thẻ thống kê và bảng nghi ngờ cần xem lại.
- Bước 5 (Quan hệ): Mở lại loại quan hệ 1-n và hiển thị sơ đồ quan hệ dạng SVG trực quan.
- Tối ưu hóa: Ẩn/hiện động các tab hợp nhất giá trị tùy thuộc vào số lượng nguồn dữ liệu (≤ 1 nguồn thì ẩn).`
  },
  {
    id: 25,
    version: 'v2.6.14',
    date: '07/07/2026',
    time: '10:00',
    content: `1. Phân hệ Danh mục dùng chung (Category Setup) — Thiết lập & Biên tập danh mục:
- Tab "Thiết lập cấu trúc" (AttributesTab.tsx): Chuyển sang chế độ chỉ đọc (read-only) trong trang Thiết lập danh mục (ẩn nút "Thêm trường dữ liệu" và cột "Thao tác" sửa/xóa).
- Tab "Thiết lập quan hệ" (RelationshipsTab.tsx): Chuyển sang chế độ chỉ đọc (ẩn nút "Thêm mới quan hệ", cột "Thao tác" thay bằng icon Eye xem chi tiết quan hệ).
- Wizard thiết lập danh mục (CategoryWizardModal.tsx):
  + Bước 2: Đổi cột "Chia sẻ" thành "Chọn"; thêm cột "Tên cột" (input cho phép sửa tên) kèm mũi tên chỉ định hướng ánh xạ ("Trường gốc → Tên cột").
  + Bước 3: Sửa lỗi không lưu được quan hệ, liên kết đúng state wizardRelationships và cho phép khai báo lưu vào danh sách tạm.
- Modal "Xem chi tiết thay đổi" (CategoryVersionChangeModal.tsx): Đổi giao diện so sánh diff từ bảng old|new sang 2 khối snapshot xếp dọc (Phiên bản mới nền xanh lá ở trên, Phiên bản cũ nền đỏ nhạt ở dưới), loại bỏ các chỉ số tóm tắt diff.
- Biên tập danh mục → tab Phiên bản (CategoryPage.tsx): Nút "Xem chi tiết" (Eye) nay mở modal chi tiết danh mục dạng 3 tab (Thông tin chung, Thuộc tính, Quan hệ) thay vì mở modal so sánh phiên bản cũ. Gộp trạng thái phiên bản thành: "Hiệu lực" (phiên bản hiện hành) và "Lưu trữ" (các phiên bản cũ).

2. Quản trị người dùng — Đồng bộ hóa & Phê duyệt tài khoản (UserManagementPage.tsx):
- Nút "Đồng bộ" mở modal danh sách người dùng staging (userName, fullName, email, cellphone, identityCard, deptName, posCode, status, update_date).
- Hệ thống tự động so khớp với danh sách người dùng thật để phân loại trạng thái đồng bộ: "Thêm mới", "Cập nhật", "Không thay đổi", "Lỗi (thiếu email)".
- Chỉ cho phép Duyệt / Duyệt tất cả đối với dòng "Thêm mới" hoặc "Cập nhật". Khi duyệt xong, dữ liệu mới chính thức được áp dụng vào danh sách người dùng thực tế.
- Trạng thái phê duyệt sẽ được reset về "Chờ duyệt" mỗi khi nhấn nút "Đồng bộ" mới.`
  },
  {
    id: 24,
    version: 'v2.6.06',
    date: '03/07/2026',
    time: '17:30',
    content: `1. Dữ liệu mở — Thiết lập danh mục dữ liệu mở (OpenDataSetupPage):
- Bổ sung trường submitNote để lưu lại "Nội dung trình duyệt" nhập tại modal Trình duyệt danh mục; khi trình duyệt sẽ tự đồng bộ bản ghi sang danh sách của tab Phê duyệt danh mục.
- Hiển thị khối "Nội dung trình duyệt" tại modal Phê duyệt danh mục dữ liệu mở, Từ chối phê duyệt danh mục và modal Chi tiết danh mục.
- Modal Trình duyệt danh mục nạp lại nội dung đã nhập trước đó khi mở lại (trường hợp trình duyệt lại).

2. Dữ liệu mở — Công bố dữ liệu mở (OpenDataPublishedListPage):
- Nút "Gửi yêu cầu" tại modal Gửi yêu cầu công bố dữ liệu không còn lưu và báo thành công ngay lập tức; thay vào đó mở modal "Gửi duyệt yêu cầu công bố" để chọn Người phê duyệt và nhập Nội dung trình duyệt trước khi hoàn tất gửi.
- Hiển thị khối "Nội dung trình duyệt" tại modal Phê duyệt yêu cầu công bố.
- Bổ sung dữ liệu mẫu minh họa và cơ chế version hóa dữ liệu lưu trong trình duyệt (localStorage) để tự động dọn các bản ghi thử nghiệm cũ khi tải lại trang.`
  },
  {
    id: 23,
    version: 'v2.6.05',
    date: '02/07/2026',
    time: '18:50',
    content: `1. Phân hệ Cung cấp dữ liệu (Kiểm soát & Giám sát):
- Bỏ khối "Nhật ký kết nối gần đây" trong tab Sơ đồ của màn "Kiểm soát & Giám sát cung cấp" (DataProvisionMonitoringPage.tsx) do trùng với tab Audit Logs. Đổi tên tab thành "Sơ đồ giám sát".
- Danh sách API đang giám sát: Bỏ badge trạng thái, thay bằng 2 nút "Xem chi tiết" (dùng lại popup ProvisionServiceModal) + "Xem sơ đồ" (hiển thị sơ đồ luồng của API).
- Bỏ tiêu đề màn hình và dàn bộ lọc thành 1 hàng ngang tối giản.

2. Phân hệ Đối soát dữ liệu (Reconciliation):
- Modal "Lịch sử đối soát thu thập" (ReconciliationHistoryTab): Sinh danh sách lịch sử theo đúng bản ghi được chọn ở danh sách ngoài thay vì dữ liệu mock cố định.
- Đồng bộ cột với danh sách đối soát ngoài: STT, Thu thập, Số bản ghi (Nguồn), Số bản ghi (Kho), Lệch, Trạng thái, Ngày đối soát.
- Chuẩn hóa cột "Thu thập" ở cả bảng ngoài và modal lịch sử: Hiển thị Tên thu thập xếp trên và Mã thu thập (font-mono, không chứa đuôi ngày tháng) xếp dưới.`
  },
  {
    id: 22,
    version: 'v2.6.1',
    date: '02/07/2026',
    time: '13:40',
    content: `1. Phân hệ Danh mục dùng chung (Category Setup):
- Tách biệt hai loại modal trình duyệt độc lập: Trình duyệt danh mục (dành cho Gửi duyệt khi thêm mới và gửi duyệt tại Thiết lập danh sách) và Trình duyệt phiên bản (dành cho chỉnh sửa/thêm mới tại Thiết lập quan hệ, Thiết lập cấu trúc, chỉnh sửa tại Thiết lập danh sách).
- Điều chỉnh logic trạng thái: Khi tạo mới thiết lập danh mục mà chưa được phê duyệt, hệ thống không cho phép thực hiện bước 2, 3 (Thiết lập cấu trúc và Thiết lập quan hệ), hiển thị thông báo yêu cầu phê duyệt thông tin chung trước. Trạng thái sau phê duyệt chuyển từ 'draft' sang 'approved'.
- Loại bỏ tùy chọn liên kết 1-n (Một - Nhiều) khỏi danh sách loại liên kết khi tạo quan hệ danh mục.

2. Phân hệ Dữ liệu chủ (Master Data):
- Thiết kế lại trang Mô hình dữ liệu chủ (đồng bộ hoàn toàn theo style Thiết lập danh mục dùng chung), tích hợp stats card, bộ lọc collapsible, bảng grid bo góc HSL, và phân trang.
- Bọc tất cả Form Modal (Thêm/Sửa nhanh thực thể) và Wizard Modal trong component Portal để loại bỏ hoàn toàn viền trắng hay khung trắng bị thừa do overflow/border thẻ cha.
- Đổi tên hiển thị menu phân hệ trên Sidebar từ "Quản lý dữ liệu chủ" thành "Dữ liệu chủ", và trang "Quản lý quy mô dữ liệu chủ" thành "Mô hình dữ liệu chủ".
- Đổi tên Tab "Thiết lập DL chủ" thành "Thiết lập thực thể" tại trang Mô hình dữ liệu chủ.
- Loại bỏ tùy chọn liên kết 1-n (Một - Nhiều) khỏi danh sách loại liên kết khi tạo quan hệ thực thể.`
  },
  {
    id: 21,
    version: 'v2.6.0',
    date: '30/06/2026',
    time: '09:00',
    content: `1. Phân hệ Dữ liệu mở (Open Data):
- Loại bỏ liên kết trên cột Tên danh mục tại tab Quản lý danh mục (hiển thị dạng text tĩnh).
- Thêm icon Xóa và hộp thoại xác nhận xóa giấy phép (showDeleteLicenseModal, z-index 999999).
- Chuyển Lịch sử đối soát sang dạng Modal Popup (historyModalOpen), ẩn bộ lọc/tìm kiếm bên trong, tự động sinh dữ liệu khớp với mã thu thập được click.
- Cập nhật backdrop modal Chi tiết đối soát: bg-black/50 backdrop-blur-sm z-[999999].

2. Đồng bộ hóa giao diện Đối soát cung cấp & Dịch vụ cung cấp:
- Đối soát cung cấp: Bỏ hộp trắng bọc ngoài, redesign bảng grid (13px, badge 12px, bỏ cột Ghi chú), thay icon Eye cho nút chi tiết, bỏ 2 nút Cấu hình/Đối soát ngay, chuẩn hóa modal chi tiết (font 13px, z-index 999999).
- Cung cấp dữ liệu: Di chuyển tiêu đề vào vùng cuộn, đồng bộ thanh tìm kiếm, bộ lọc nâng cao và bảng grid (13px, phân trang, icon Sliders).

3. Sửa lỗi & Bổ sung tính năng Danh sách danh mục:
- Sửa lỗi ReferenceError: Khai báo bổ sung state filterType và filterStatus bị thiếu trong CategoryPage.tsx.
- Thêm nút Xuất File (Download + dropdown Excel/PDF/CSV) vào thanh công cụ tab Danh sách danh mục.

4. Redesign 3 màn Báo cáo thống kê danh mục:
- Xóa toàn bộ wrapper A4 paper khỏi cả 3 màn báo cáo (Danh sách, Khai thác, Trạng thái).
- Áp dụng mô hình đồng nhất: multi-select dropdown có checkbox, backdrop trong suốt đóng khi click ngoài, lazy rendering (biểu đồ + bảng chỉ hiện sau khi nhấn Truy xuất dữ liệu), nút Xuất File.
- Báo cáo khai thác: Biểu đồ đường đa tuyến động — số đường tương ứng số hệ thống được chọn, mỗi hệ thống một màu riêng.
- Báo cáo trạng thái: Giữ PieChart + 4 thẻ tóm tắt; thêm bảng chi tiết chuyển trạng thái theo UC (Mã DM, Tên DM, Trạng thái, Thời gian chuyển TT, Người duyệt, Lý do).`
  },
  {
    id: 20,
    version: 'v2.5.2',
    date: '24/06/2026',
    time: '17:10',
    content: `1. Đồng bộ và Tích hợp thay đổi từ Git (Phân hệ Đối soát & Cung cấp dữ liệu):
- Tích hợp thay đổi giao diện Đối soát dữ liệu theo mockup: cập nhật bảng kết quả, cột Nguồn/Kho/Lệch, tính toán tổng hợp, và giao diện 2 card của Modal chi tiết đối soát.
- Ẩn các tab "Thiết lập dịch vụ" và "Nhật ký đối soát" tại trang Đối soát Bộ trong ngành.
- Tích hợp thay đổi giao diện Tab Báo cáo của màn hình Kiểm soát & Giám sát cung cấp: 4 loại báo cáo, biểu đồ Area/Line/Bar tương thích theo loại báo cáo, cấu hình ngưỡng phản hồi TB và số liệu tổng hợp cho "Tất cả API".

2. Phân hệ Thiết lập danh mục dùng chung (Các thay đổi hôm nay):
- Áp dụng cấu hình giao diện linh hoạt dựa trên nguồn dữ liệu của danh mục (Tự cập nhật trực tiếp, Đồng bộ Kho DLDC, Kết nối API).
- Tùy biến bảng thuộc tính động với các cột phù hợp cho từng nguồn dữ liệu (manual, dldc, ndxp/lgsp).
- Thiết kế lại hộp thông tin cảnh báo thực thể dạng Alert Box (màu vàng/amber), tăng khoảng đệm (padding) lên p-5, icon cảnh báo AlertCircle (w-6 h-6).
- Tải động dữ liệu thuộc tính mock (Giới tính - dldc, Dân tộc - manual, Quốc gia - API) tương ứng với từng danh mục được lựa chọn.`
  },
  {
    id: 19,
    version: 'v2.5.1',
    date: '23/06/2026',
    time: '10:00',
    content: `1. Phân hệ Thu thập dữ liệu — Dashboard (CollectionDashboard):
- Thiết kế lại toàn bộ giao diện tổng quan thu thập dữ liệu: bố cục 2 cột tỷ lệ 1/3–2/3.
- Bổ sung 2 biểu đồ tròn (Donut Chart) thống kê tỷ lệ nguồn dữ liệu và trạng thái đồng bộ.
- Bổ sung biểu đồ diện tích (Area Chart) theo dõi lượt đồng bộ theo thời gian.
- Đồng bộ màu sắc thống nhất giữa các biểu đồ và thẻ KPI.

2. Thiết lập danh mục dùng chung — Tab Thiết lập cấu trúc (AttributesTab):
- Thiết kế lại tab "Thiết lập cấu trúc" với 3 giao diện riêng biệt tùy theo trường Nguồn dữ liệu đã chọn ở bước Thông tin chung.
- Tự cập nhật trực tiếp: Giữ nguyên form khai báo trường dữ liệu nội tuyến như trước.
- Đồng bộ kho DLDC: Giao diện chọn cascading — chọn cơ sở dữ liệu → chọn bảng (dạng thẻ grid) → chọn trường (checkbox 2 cột, cuộn max-h-56); nút Chọn tất cả / Bỏ chọn; nút Nhập trường tự động tạo thuộc tính với sourceType: 'reference'.
- Kết nối API: Form cấu hình API gồm Hệ thống nguồn, Đơn vị quản lý, Endpoint, Phương thức (GET/POST/PUT), Xác thực (Không xác thực / Bearer Token / API Key); trường bổ sung hiển thị có điều kiện theo loại xác thực.
- Kết nối wizard: wizardConfig prop truyền từ CategorySetupPage → CategoryWizardModal → AttributesTab; callback onWizardConfigChange đồng bộ lựa chọn về formData cấp cha.

3. Dữ liệu mở — Gửi yêu cầu công bố (OpenDataPublishedListPage):
- Sửa lỗi căn chỉnh cột không đều trong bảng "Chọn trường dữ liệu chia sẻ".
- Chuyển từ class Tailwind table-fixed sang inline style={{ tableLayout: 'fixed' }} để tránh PurgeCSS loại bỏ lớp.
- Áp dụng <colgroup> với width inline style (%) cho từng cột; bổ sung min-w-0 trên select/input và overflow-hidden trên td để đảm bảo độ rộng cột cố định và đồng đều.`
  },
  {
    id: 18,
    version: 'v2.5.0',
    date: '22/06/2026',
    time: '17:00',
    content: `1. Phân hệ Dữ liệu mở — Công bố & Thiết lập:
- Xây dựng hoàn thiện luồng thiết lập và công bố dữ liệu mở: thông tin mô tả, phê duyệt, quản lý trạng thái công bố.
- Bổ sung trang Danh mục dữ liệu mở với inner menu phân cấp, đa tab (Thông tin, Tệp đính kèm, Lịch sử phiên bản), bảng grid danh sách và modal chi tiết.
- Tích hợp trang danh sách Danh mục dữ liệu mở với tìm kiếm, lọc nâng cao và xem chi tiết.

2. Phân hệ Dữ liệu mở — Thống kê & Báo cáo (OpenDataReportPage):
- Tab Tìm kiếm và lọc: Bổ sung sắp xếp cột (tăng/giảm) và phân trang cho bảng danh sách dataset.
- Tab Báo cáo thống kê: Redesign bộ lọc thiết lập báo cáo — nhóm theo chủ đề/cơ quan/giấy phép/khoảng thời gian; MultiSelect đa lựa chọn; logic deferred render (chỉ hiển thị dữ liệu sau khi nhấn Tạo báo cáo); thẻ tổng hợp (4 KPI) luôn hiển thị phía trên bộ lọc; tích hợp ExportDropdown xuất Excel/PDF.
- Tab Báo cáo phân loại: Redesign đồng bộ với Báo cáo thống kê; hỗ trợ phân loại theo nguồn cung cấp (tên CSDL đích), chủ đề, định dạng chia sẻ (File Excel/API); biểu đồ tròn và biểu đồ cột song song.
- Tab Thống kê lượt truy cập: Bộ lọc nhóm theo khoảng thời gian (từ tháng/năm — đến tháng/năm), loại người dùng (6 loại), nguồn truy cập (CSDL đích), loại dữ liệu chia sẻ; biểu đồ đồng bộ theo nhóm lọc (LineChart cho thời gian, BarChart cho các dimension khác); bảng Cảnh báo truy cập vượt ngưỡng với cấu hình ngưỡng động và highlight hàng vi phạm.
- Áp dụng thống nhất pattern apply-on-button-click (applied states) và ExportDropdown cho tất cả 4 tab.

3. Quản lý người dùng & Nhật ký hệ thống:
- Cập nhật giao diện Quản lý người dùng và Nhật ký hoạt động hệ thống.
- Sửa lỗi biên dịch tại ConfigChangeLogPage.tsx và AccountManagementLogPage.tsx.`
  },
  {
    id: 17,
    version: 'v2.4.8',
    date: '17/06/2026',
    time: '18:12',
    content: `1. Đồng bộ dữ liệu & chức năng Cung cấp:
- Đồng bộ hóa cấu hình và danh sách dữ liệu (dịch vụ, phân quyền, tài khoản) sang localStorage.
- Tự động điền đơn vị nhận mặc định cho các dịch vụ mới và liên kết động đến tab Phân quyền, Danh sách tài khoản.
- Bổ sung tính năng Xem chi tiết API ở chế độ chỉ đọc và nút Chỉnh sửa tài khoản.
- Tối ưu hóa UI/UX: Ẩn thanh lọc tại Phân quyền, thay thế dropdown đơn vị bằng input text tự do, và loại bỏ cột API được phép gọi.
- Chuyển đổi các thông báo xác nhận App Key sang Custom Modal UI an toàn và hỗ trợ sao chép Key mới.

2. Breadcrumb & Điều hướng (Routing):
- Bổ sung Breadcrumb phân cấp chi tiết cho toàn bộ các trang Cung cấp dữ liệu.
- Đồng bộ hóa trạng thái Tab với URL Query Parameter tab trong trang Thiết lập dịch vụ, Quản lý API, và Dịch vụ chia sẻ.

3. Thiết kế lại trang Yêu cầu sử dụng dữ liệu (DataProvisionRequestPage):
- Chuyển thanh Tab chính ra ngoài card, thêm icons và số lượng bản ghi.
- Đồng bộ hóa bảng dữ liệu (cỡ chữ 13px, hover style) và tích hợp thanh phân trang.
- Áp dụng quy tắc 5.4 Hộp thoại (z-index 999999, backdrop bg-black/50) cho tất cả các modal nghiệp vụ (bàn giao, công khai, phê duyệt).

4. Kiểm soát & Giám sát cung cấp (DataProvisionMonitoringPage):
- Chuyển đổi màu sắc chủ đạo từ cam/hổ phách sang xanh dương thương hiệu (#2563eb).
- Tích hợp thanh phân trang cho bảng chi tiết lưu lượng và bảng Audit logs.
- Ép font chữ hiển thị về 13px cho toàn trang và các modal liên quan.
- Áp dụng quy tắc 5.4 Hộp thoại cho modal chi tiết logs và modal xuất báo cáo.

5. Dịch vụ chia sẻ & Sửa lỗi React Error #31:
- Khắc phục triệt để lỗi React crash Error #31 tại modal Cấu hình trường bằng cách gỡ bỏ toán tử dấu phẩy dư thừa , document.body ở câu lệnh return trong SharedFieldsConfigModal.tsx.
- Thiết kế lại giao diện của modal Cấu hình trường và trang Dịch vụ chia sẻ sang tông màu xanh dương và cỡ chữ 13px đồng bộ.`
  },
  {
    id: 16,
    version: 'v2.4.7',
    date: '16/06/2026',
    time: '18:56',
    content: `1. Phân hệ Cung cấp dữ liệu (Màn hình Quản lý API cung cấp & đối soát):
- Màn hình chính: Thiết kế lại toàn diện giao diện trang Quản lý API Cung cấp & Đối soát, đưa thanh Tab chính ra ngoài card, tích hợp bộ lọc collapsible panel, đồng bộ hóa phong cách hiển thị bảng danh sách và tích hợp thanh phân trang cho tất cả các tab.
- Badge trạng thái: Thay đổi font chữ hiển thị trạng thái trên cả 4 tab từ in đậm (font-semibold) sang chữ thường (font-normal).
- Tab Phân quyền truy cập: Thêm thanh cuộn dọc cưỡng bức (max-height: 180px) và thanh tìm kiếm nhanh cho cột Danh sách dịch vụ API bên trái; loại bỏ nút "Cấp quyền truy cập API" trùng lặp trên thanh công cụ; đồng thời loại bỏ hoàn toàn cột "Phạm vi quyền (Scopes)" trong bảng danh sách đơn vị.
- Hộp thoại Cấp quyền truy cập API: Đồng bộ màu chủ đạo sang xanh dương hệ thống, chuyển chữ nhãn trường (labels) sang dạng thường (font-medium), và bỏ ràng buộc bắt buộc nhập (required/dấu hoa thị đỏ) đối với trường "Hiệu lực đến ngày".
- Cấu hình Đơn vị thụ hưởng trong modal Cấp quyền: Thiết kế lại trường chọn đơn vị thành danh sách hộp chọn (multi-select checkboxes) cuộn dọc cưỡng bức (160px) có ô tìm kiếm nhanh và nút Chọn tất cả / Bỏ chọn tất cả. Các đơn vị được thiết lập mặc định của dịch vụ API sẽ hiển thị ở trạng thái luôn tích chọn và bị khóa (disabled) kèm nhãn "Mặc định dịch vụ".
- IP Whitelist trong modal Cấp quyền: Bổ sung trường cấu hình IP Whitelist hỗ trợ nhập nhiều địa chỉ IP phân tách bởi dấu phẩy, tự động gán "Tất cả IP" nếu để trống.

2. Phân hệ Cung cấp dữ liệu (Màn hình Thiết lập dịch vụ cung cấp):
- Màn hình chính: Redesign giao diện theo chuẩn thiết kế phẳng hiện đại, chuyển thanh tab ra ngoài card, thiết kế lại 4 thẻ thống kê (Stat Cards) và panel bộ lọc collapsible.
- Danh sách dịch vụ: Bổ sung nút Xóa (Trash2 đỏ) cho các dịch vụ đang ở trạng thái Bản nháp, Chờ phê duyệt, Từ chối kèm modal xác nhận xóa dạng overlay.
- Tinh chỉnh Tab Công khai dịch vụ: Đổi tên trạng thái dịch vụ sang "Đang công khai", thay thế nút chi tiết dạng chữ bằng Eye icon, hiển thị luôn nút Công khai (Share2) và khóa nút khi trạng thái là Đang công khai.
- Hộp thoại cấu hình/phê duyệt dịch vụ: Tăng z-index và áp dụng style inline để modal che phủ hoàn toàn menu sidebar trái, áp dụng quy chuẩn font chữ 13px và màu sắc focus input mới, lược bỏ tab Lịch sử (History), và di chuyển nút Trình duyệt sang tab Phân quyền.

3. Tối ưu hóa mock dữ liệu và Hệ thống hộp thoại (Modal Portals):
- Đồng bộ Stacking Context: Áp dụng ReactDOM.createPortal cho toàn bộ 27 modal thuộc phân hệ cung cấp dữ liệu lên thẻ body để đảm bảo hiển thị che phủ hoàn toàn thanh menu sidebar bên trái.
- Mock dữ liệu nâng cao: Cập nhật bản ghi API Hộ tịch mặc định có nhiều đơn vị nhận, bổ sung logic tự động đồng bộ localStorage, và nâng cấp modal để hiển thị các đơn vị nhận dưới dạng danh sách badge xám chỉ đọc, không cho phép auto-fill đè dữ liệu cũ khi đổi dịch vụ.`
  },
  {
    id: 15,
    version: 'v2.4.6',
    date: '15/06/2026',
    time: '14:20',
    content: '1. Phân hệ Kiểm soát & giám sát cung cấp:\n- Màn hình Sơ đồ giám sát kết nối: Cấu trúc lại Sơ đồ giám sát (Topology Flowchart) rẽ nhánh hiển thị theo từng chặng độc lập. Hỗ trợ hiển thị trực quan trạng thái kết nối song song của nhiều Đơn vị khai thác API trên cùng một đường truyền Gateway (VD: Sở Y tế Bắc Ninh, Quảng Ninh).\n\n2. Phân hệ Dịch vụ chia sẻ:\n- Đồng bộ hóa toàn diện ngôn ngữ thiết kế giao diện: Áp dụng chuẩn thiết kế đa Tab (Dữ liệu cung cấp & Quản lý API đang lấy dữ liệu) cho tất cả các menu CSDL (Trong ngành, Ngoài ngành, Dữ liệu mở, Dữ liệu chủ).\n- Bổ sung Bộ lọc nâng cao: Cung cấp tính năng lọc dữ liệu theo khoảng thời gian và trạng thái xử lý.'
  },
  {
    id: 14,
    version: 'v2.4.5',
    date: '08/06/2026',
    time: '14:20',
    content: `1. Phân hệ Cơ sở dữ liệu Hộ tịch (Xem dữ liệu thu thập):
- Màn hình chính (Xem dữ liệu thu thập): Cập nhật cấu trúc hiển thị mô tả động dưới tiêu đề danh sách, cho phép nhận diện và tự động xuống dòng khi gặp ký tự xuống dòng (\\n).
- Các hộp thoại chi tiết dữ liệu hộ tịch (Khai sinh, Kết hôn, Khai tử, Nuôi con nuôi, Thay đổi/cải chính hộ tịch, Đăng ký giám hộ, Đăng ký giám sát giám hộ, Chấm dứt giám hộ, Chấm dứt giám sát giám hộ, Nhận cha mẹ con, Xác nhận tình trạng hôn nhân): Điều chỉnh mô tả dưới header sang định dạng xuống dòng (Tích hợp: [Tên loại dữ liệu]. \\n Thuộc đơn vị: Cục Hành chính tư pháp.).

2. Phân hệ Cung cấp dữ liệu:
- Màn hình Dịch vụ chia sẻ & Cung cấp số liệu: Đồng bộ hóa toàn diện ngôn ngữ thiết kế giao diện theo quy chuẩn mới.
- Màn hình Danh sách API cung cấp: Gộp cột Mã & Tên API thành một cột hiển thị xếp tầng; thu gọn cột hiển thị tài liệu PDF thành biểu tượng đặc tả.
- Hộp thoại Tạo mới / Cập nhật API cung cấp: Tái cấu trúc giao diện thành màn hình cuộn đơn trang; bổ sung các trường thông tin liên hệ và tự động điền thông tin.

3. Quản lý nhóm người dùng > Phân quyền phạm vi dữ liệu:
- Màn hình Cấu hình bảo mật phạm vi dữ liệu: Thiết kế bảng cấu hình động dữ liệu bảo mật (STT, Trường dữ liệu, Cấu hình thuật toán, nút thêm/xóa dòng) ẩn/hiện linh hoạt dựa theo checkbox bảo mật dữ liệu.

4. Phân hệ Quản trị hệ thống & Danh mục:
- Thanh điều hướng Sidebar (Menu hệ thống): Chuyển trang quản lý Đơn vị thuộc BTP về Sidebar.
- Màn hình Quản lý vai trò: Tinh giản thẻ thống kê tổng quan; loại bỏ cột Đơn vị trong bảng danh sách vai trò.
- Màn hình Sao lưu dự phòng: Ẩn/gỡ bỏ nút thiết lập lịch sao lưu tự động.
- Hộp thoại xác nhận xóa (Đơn vị, Agent kết nối, Hệ thống nguồn): Áp dụng quy tắc modal 5.4 mới, bổ sung hiệu ứng làm mờ nền backdrop-blur-sm.

5. Giao diện chung toàn hệ thống:
- Tất cả các bảng lưới dữ liệu (Grid) và ô nhập liệu (Input): Chuẩn hóa kích thước font chữ hiển thị về cỡ 13px.`
  },
  {
    id: 13,
    version: 'v2.4.4',
    date: '08/06/2026',
    time: '13:30',
    content: 'Cấu hình lại giao diện Tạo mới/Cập nhật API cung cấp dưới dạng màn cuộn đơn trang; bổ sung các trường nhập liệu thông tin liên hệ và cơ chế autofill động. Đồng bộ bảng danh sách API cung cấp: Tách/gộp cột Mã & Tên API thành một cột xếp tầng, loại bỏ cột Đơn vị sử dụng, thu gọn cột đặc tả tài liệu PDF thành Icon đặc tả.'
  },
  {
    id: 12,
    version: 'v2.4.3',
    date: '05/06/2026',
    time: '18:14',
    content: 'Tái cấu trúc và nâng cấp thiết kế UI/UX module Dữ liệu mở (Công bố dữ liệu, Thiết lập danh mục); Đồng nhất thanh tìm kiếm và bộ lọc đa tab. Gỡ bỏ tab Phiên bản. Bổ sung mô tả và tối ưu hiển thị chi tiết các modal Hộ tịch; Cập nhật cấu trúc menu Sidebar và tài liệu dự án.'
  },
  {
    id: 11,
    version: 'v2.4.2',
    date: '03/06/2026',
    time: '08:57',
    content: 'Phân rã logic bàn giao (file) và công khai (API); Bổ sung tính năng hiển thị chi tiết ở tab Tiếp nhận và bàn giao; Thêm modal ProvisionHandoverDetailModal và ProvisionPublishDetailModal; Nâng cấp Modal Bàn giao hiển thị File kết xuất đính kèm để tải về.'
  },
  {
    id: 10,
    version: 'v2.4.1',
    date: '02/06/2026',
    time: '17:50',
    content: 'Cập nhật cây phân quyền chức năng: Loại bỏ mục con của Đối soát dữ liệu và Dịch vụ chia sẻ; thêm nút đóng/mở (dropdown) mặc định thu gọn; hỗ trợ chọn/bỏ chọn hàng loạt chức năng con. Thay thế trường Loại vai trò bằng dropdown Trạng thái (Hoạt động/Không hoạt động) và chuyển xuống dưới cây phân quyền.'
  },
  {
    id: 9,
    version: 'v2.4.0',
    date: '02/06/2026',
    time: '16:55',
    content: 'Nâng cấp giao diện Quản lý danh mục Dữ liệu mở: Tích hợp thiết kế bộ lọc nâng cao 3 trường (Trạng thái, Đơn vị, Tần suất) và nút chuyển đổi linh hoạt. Đồng bộ hóa quy trình 4 trạng thái (Bản nháp, Chờ duyệt, Đã phê duyệt, Từ chối). Cập nhật code mới từ Git: Cải tiến phân hệ Quản lý vai trò, Nhóm người dùng, bổ sung Category Dashboard mới và tối ưu hóa hệ thống Sidebar/MainLayout.'
  },
  {
    id: 8,
    version: 'v2.3.3',
    date: '29/05/2026',
    time: '17:30',
    content: 'Bỏ nút Kết xuất tại các màn xem dữ liệu thu thập; Bỏ 2 tab Thiết lập dịch vụ, Nhật ký đối soát, bỏ 2 button Xuất báo cáo và Đồng bộ thủ công tại mục Đối soát dữ liệu thu thập; Đồng bộ giao diện Đối soát dữ liệu thu thập; Sửa logic Quản lý người dùng theo yêu cầu đã trao đổi, đồng bộ và rà soát màn hình Cấu hình hệ thống, Quản lý nhật ký; Sửa lại màn Xem biểu đồ thống kê; Bổ sung logic gán vai trò và nhóm người dùng tại Quản lý người dùng'
  },
  {
    id: 7,
    version: 'v2.3.2',
    date: '26/05/2026',
    time: '11:40',
    content: 'Cập nhật giao diện trang Quản lý nhóm người dùng: Loại bỏ menu con thừa trên Sidebar, điều chỉnh khối Danh mục đơn vị hiển thị song song bên trái, và cố định hiển thị nút thao tác (Sửa/Xóa) của danh sách đơn vị để nâng cao trải nghiệm người dùng.'
  },
  {
    id: 6,
    version: 'v2.3.0',
    date: '26/05/2026',
    time: '09:00',
    content: 'Nâng cấp phân hệ Quản lý vai trò và Nhóm người dùng: Đồng bộ hóa luồng phân quyền và phân cấp dữ liệu, áp dụng 3 mẫu vai trò chuẩn (Quản trị hệ thống, Quản trị nghiệp vụ, Người dùng cơ bản), cải tiến phương thức gán người dùng qua danh sách ID, bổ sung bộ lọc người dùng chưa được gán vai trò và hỗ trợ gán/xóa trực tiếp người dùng và nhóm người dùng.'
  },
  {
    id: 5,
    version: 'v2.2.0',
    date: '12/04/2026',
    time: '23:15',
    content: 'Tái cấu trúc luồng Thiết lập Thu thập dữ liệu: Nâng cấp màn hình Chi tiết thành cấu trúc Đa Tab với KPI động, cải tiến Dashboard phân dải chính xác phương thức kết nối và nguồn cung cấp. Cải thiện UX và đồng bộ dự án lên Git.'
  },
  {
    id: 1,
    version: 'v2.1.0',
    date: '10/04/2026',
    time: '16:00',
    content: 'Cập nhật giao diện, sửa lỗi hiển thị nút, chuẩn hóa Accessibility và khắc phục màn hình trắng.'
  },
  {
    id: 2,
    version: 'v2.0.1',
    date: '08/04/2026',
    time: '14:30',
    content: 'Cập nhật module Phê duyệt danh mục, sửa lỗi giao diện tab Phân quyền.'
  },
  {
    id: 3,
    version: 'v2.0.0',
    date: '01/04/2026',
    time: '09:00',
    content: 'Bản phát hành lớn: Nâng cấp luồng Master Data, thêm tính năng Thu thập dữ liệu ngoài.'
  },
  {
    id: 4,
    version: 'v1.5.2',
    date: '15/03/2026',
    time: '10:15',
    content: 'Sửa lỗi điều phối dữ liệu nội bộ, tối ưu hóa tốc độ tải trang.'
  }
];

export function VersionHistoryModal({ isOpen, onClose }: VersionHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex origin-top items-start justify-center overflow-y-auto z-[999] p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full flex flex-col mb-auto mt-8 sm:mt-12 shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <History className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Lịch sử triển khai</h2>
              <p className="text-sm text-slate-500">Chi tiết các phiên bản hệ thống đã phát hành</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
            title="Đóng"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-4">
            {mockVersions.map((item, index) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border ${index === 0 ? 'border-teal-200 bg-teal-50/50' : 'border-slate-200 bg-white'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-md text-sm font-semibold ${index === 0 ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-700'}`}>
                      {item.version}
                    </span>
                    {index === 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">Hiện tại</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{item.content}</div>
                  </div>

                  <div className="flex items-center gap-6 mt-3 pt-3 border-t border-slate-100/50">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
