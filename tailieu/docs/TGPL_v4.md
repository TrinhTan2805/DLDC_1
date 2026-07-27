## 1. Luồng đồng bộ

| SHEET 1 – DANH SÁCH LUỒNG DỮ LIỆU CẦN ĐỒNG BỘ – HỆ THỐNG TGPL | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 | Unnamed: 14 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hệ thống nguồn: Hệ thống thông tin Trợ giúp pháp lý (TGPL) – Cục Phổ biến, giáo dục PL và TGPL, Bộ Tư pháp  │  Stack: Oracle Enterprise / ReactJS / NodeJS  │  Tích hợp: LGSP BTP, NDXP  │  Phương thức chung: CDC đọc transaction log (Oracle redo log)  │  Kho kéo về theo lịch định kỳ do quản trị Kho cấu hình  │  Tài liệu kiến trúc: BTP_TGPL_2025_PM_ARCH_GĐ1 V1.0 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| STT | Tên luồng | Loại dữ liệu<br>nghiệp vụ | Luồng | Hệ thống<br>nguồn | Cơ sở dữ liệu /<br>Schema nguồn | Bảng nguồn (Oracle)<br>(tên bảng thực tế trong DB) | Phương thức<br>đồng bộ | Tần suất lấy dữ liệu lần đầu | Tần suất lấy dữ liệu lần sau | Cơ chế phát hiện<br>thay đổi | Điều kiện lọc tại nguồn | Ưu tiên | Giai đoạn | Ghi chú |
| 1 | Tổ chức thực hiện TGPL | Trợ giúp pháp lý | 1 | TỔ CHỨC THỰC HIỆN TGPL | TGPL_DB / Oracle Enterprise | organization_units | Gọi API (Pull) - Đồng bộ dữ liệu | Gọi API lấy toàn bộ (Full Sync) | Đồng bộ tăng dần (Incremental Sync): Gọi API tham số type=update kèm fromDate/toDate | Sử dụng tham số type=update kèm fromDate/toDate | Truy vấn các bản ghi có thời gian -Tạo mới (CreatedAt) HOẶC Cập nhật (UpdatedAt) nằm trong khoảng: >= fromDate và <= toDate.<br>Trong đó, fromDate chính là thời điểm Last Sync Time (thời điểm đồng bộ thành công gần nhất), còn toDate là thời điểm gọi API hiện tại. | Cao | Giai đoạn 1 | Bao gồm Trung tâm TGPL nhà nước, Chi nhánh TGPL và<br>Tổ chức đăng ký tham gia;<br>Phân biệt qua cột type + organizationGroupId |
| 2 | Trung tâm TGPL nhà nước | Trợ giúp pháp lý | 2 | Trung tâm TGPL nhà nước | TGPL_DB / Oracle Enterprise | organization_units | Gọi API (Pull) - Đồng bộ dữ liệu | Gọi API lấy toàn bộ (Full Sync) |  |  |  | Cao | Giai đoạn 1 | Bao gồm Trung tâm TGPL nhà nước, Chi nhánh TGPL và<br>Tổ chức đăng ký tham gia;<br>Phân biệt qua cột type + organizationGroupId |
| 3 | Chi nhánh TGPL | Trợ giúp pháp lý | 3 | Chi nhánh TGPL  | TGPL_DB / Oracle Enterprise | organization_units | Gọi API (Pull) - Đồng bộ dữ liệu | Gọi API lấy toàn bộ (Full Sync) |  |  |  | Cao | Giai đoạn 1 | Bao gồm Trung tâm TGPL nhà nước, Chi nhánh TGPL và<br>Tổ chức đăng ký tham gia;<br>Phân biệt qua cột type + organizationGroupId |
| 4 | Tổ chức đăng ký tham gia trợ giúp pháp lý | Trợ giúp pháp lý | 4 | Tổ chức đăng ký tham gia trợ giúp pháp lý | TGPL_DB / Oracle Enterprise | organization_unit_documents | Gọi API (Pull) - Đồng bộ dữ liệu | Gọi API lấy toàn bộ (Full Sync) |  |  |  | Cao | Giai đoạn 1 | Bao gồm Trung tâm TGPL nhà nước, Chi nhánh TGPL và<br>Tổ chức đăng ký tham gia;<br>Phân biệt qua cột type + organizationGroupId |
| 5 | Người thực hiện TGPL | Trợ giúp pháp lý | 5 | Người thực hiện TGPL | TGPL_DB / Oracle Enterprise | staff | Gọi API (Pull) - Đồng bộ dữ liệu | Gọi API lấy toàn bộ (Full Sync) |  |  |  | Cao | Giai đoạn 1 | 5 loại nhân sự qua cột objectType:<br>TroGiupVienPL / CongTacVien /<br>LuatSuKyHD_TrungTam / LuatSuKyHD_ToChuc /<br>TuVanVienPL |
| 6 | Hồ sơ vụ việc TGPL | Trợ giúp pháp lý | 6 | Hồ sơ vụ việc TGPL | TGPL_DB / Oracle Enterprise | case_advanced | Gọi API (Pull) - Đồng bộ dữ liệu | Gọi API lấy toàn bộ (Full Sync) |  |  |  | Cao | Giai đoạn 1 | Lưu đầy đủ trạng thái để IOC tính tỷ lệ hoàn thành<br>và báo cáo TT17 đếm theo trạng thái |
| 7 | Người được TGPL | Trợ giúp pháp lý | 7 | Người được TGPL | TGPL_DB / Oracle Enterprise | case_advanced<br>(các cột rp*: rpName, rpSex,<br>rpCardNumber, objectLegalField, ...) | Gọi API (Pull) - Đồng bộ dữ liệu | Gọi API lấy toàn bộ (Full Sync) |  |  |  | Cao | Giai đoạn 1 | Thông tin người được TGPL nhúng trong case_advanced;<br>liên kết qua case.id |


## 2. Field & Rule

| SHEET 2 – CHI TIẾT TRƯỜNG DỮ LIỆU & QUY TẮC KIỂM TRA – HỆ THỐNG TGPL | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 | Unnamed: 14 | Unnamed: 15 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Mỗi dòng = 1 trường dữ liệu.  Ký hiệu hệ thống đích: TK = Báo cáo thống kê TT 17  │  IOC = Bộ chỉ số IOC Bộ Tư pháp  │  C12 = Trung tâm Dữ liệu Quốc gia (Bộ Công an)  │  MO = Dữ liệu mở QĐ 1058/QĐ-BTP |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Cơ sở dữ liệu nguồn: Oracle Enterprise – tên cột theo quy ước camelCase.  Các khóa ngoại (FK) cần join bảng categories để lấy tên/mã: provinceId, wardId, genderId, ethnicId, civilServantRankId, activityStatusId, positionId, professionalLevelId, ...  Trường kiểu JSON array lưu dạng CLOB (legalFieldIds, specializedFields, assignedPeople) – cần parse trước khi join. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| STT luồng<br>(xem Sheet 1<br>cột STT) | Tên luồng<br>(xem Sheet 1<br>cột Tên luồng) | Bảng nguồn<br>(Oracle) | Trường nguồn<br>(tên cột Oracle) | Kiểu dữ liệu<br>nguồn (Oracle) | Bảng đích<br>(xem Sheet 3<br>cột Tên bảng đích) | Luồng ánh xạ | Trường đích | Kiểu dữ liệu<br>đích | Bắt buộc | Cho phép<br>Null | Quy tắc kiểm tra | Quy tắc biến đổi / Ánh xạ | Xử lý khi null / lỗi | Ví dụ nguồn → đích | Ghi chú (TK / IOC / C12 / MO) |
| ── LUỒNG 1: TỔ CHỨC THỰC HIỆN TGPL  ◀  bảng nguồn: organization_units (Oracle) type=1 → Tổ chức thực hiện TGPL |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 1 | Tổ chức thực hiện TGPL | organization_units | id  (UUID PK) | VARCHAR2(36) | tgpl_to_chuc | org_units → tgpl_to_chuc  | src_id | VARCHAR(36) | Có | N | NOT NULL; UNIQUE | Lấy trực tiếp (UUID Oracle) | Bỏ qua bản ghi | — | Internal key; không dùng đối ngoại |
| 1 | Tổ chức thực hiện TGPL | organization_units | code | VARCHAR2 | tgpl_to_chuc | org_units → tgpl_to_chuc | ma_don_vi | VARCHAR(50) | Có | N | NOT NULL | Lấy trực tiếp | Bỏ qua bản ghi | TT-HN-001 | TK, C12, MO |
| 1 | Tổ chức thực hiện TGPL | organization_units | name | VARCHAR2 | tgpl_to_chuc | org_units → tgpl_to_chuc | ten_to_chuc | NVARCHAR(255) | Có | N | NOT NULL | Lấy trực tiếp | Bỏ qua bản ghi | Trung tâm TGPL tỉnh Hà Nội | TK, C12, MO |
| 1 | Tổ chức thực hiện TGPL | organization_units | fullName | VARCHAR2 | tgpl_to_chuc | org_units → tgpl_to_chuc | ten_hien_thi | NVARCHAR(255) | Không | Y |  | Lấy trực tiếp |  | — | C12 |
| 1 | Tổ chức thực hiện TGPL | organization_units | type + organizationGroupId | NUMBER / VARCHAR2(36) | tgpl_to_chuc | org_units → tgpl_to_chuc | nhom_to_chuc | VARCHAR(100) | Có | N | NOT NULL | Chuẩn hóa chuỗi | Bỏ qua bản ghi | type=1 → Trung tâm TGPL nhà nước | TK biểu 15c |
| 1 | Tổ chức thực hiện TGPL | organization_units | establishmentDate | VARCHAR2 | tgpl_to_chuc | org_units → tgpl_to_chuc | ngay_thanh_lap | DATE | Không | Y |  | Parse dd/mm/yyyy → DATE |  | 01/01/2010 → 2010-01-01 | C12 |
| 1 | Tổ chức thực hiện TGPL | organization_units | status | NUMBER | tgpl_to_chuc | org_units → tgpl_to_chuc | trang_thai_hoat_dong | VARCHAR(50) | Có | N | NOT NULL | Chuẩn hóa chuỗi | Bỏ qua bản ghi | 1 → Đang hoạt động | C12, MO |
| 1 | Tổ chức thực hiện TGPL | organization_units | provinceId → categories.code | VARCHAR2(36) | tgpl_to_chuc | org_units → tgpl_to_chuc | ma_tinh | VARCHAR(10) | Có | N | NOT NULL; FK CHECK: dm_tinh | Join categories bằng provinceId → mã tỉnh | Bỏ qua bản ghi | — | C12, TK |
| 1 | Tổ chức thực hiện TGPL | organization_units | provinceId → categories.name | VARCHAR2 | tgpl_to_chuc | org_units → tgpl_to_chuc | tinh_tp | NVARCHAR(100) | Có | N | NOT NULL | Lấy trực tiếp | Bỏ qua bản ghi | Hà Nội | C12, MO |
| 1 | Tổ chức thực hiện TGPL | organization_units | wardId → categories | VARCHAR2(36) | tgpl_to_chuc | org_units → tgpl_to_chuc | ma_xa / phuong_xa | VARCHAR(10) / NVARCHAR(100) | Không | Y | FK CHECK: dm_xa | Join categories |  | — | C12 |
| 1 | Tổ chức thực hiện TGPL | organization_units | address | VARCHAR2 | tgpl_to_chuc | org_units → tgpl_to_chuc | dia_chi_chi_tiet | NVARCHAR(500) | Không | Y |  | Lấy trực tiếp |  | — | C12, MO |
| 1 | Tổ chức thực hiện TGPL | organization_units | phone | VARCHAR2 | tgpl_to_chuc | org_units → tgpl_to_chuc | dien_thoai | VARCHAR(20) | Không | Y |  | Lấy trực tiếp |  | — | MO |
| 1 | Tổ chức thực hiện TGPL | organization_units | email | VARCHAR2 | tgpl_to_chuc | org_units → tgpl_to_chuc | email | VARCHAR(255) | Không | Y |  | Lấy trực tiếp |  | — | C12 |
| 1 | Tổ chức thực hiện TGPL | organization_units | website | VARCHAR2 | tgpl_to_chuc | org_units → tgpl_to_chuc | website | VARCHAR(255) | Không | Y |  | Lấy trực tiếp |  | — | C12 |
| 1 | Tổ chức thực hiện TGPL | organization_units | representative | VARCHAR2 | tgpl_to_chuc | org_units → tgpl_to_chuc | nguoi_dai_dien | NVARCHAR(255) | Không | Y |  | Chuẩn hóa chuỗi |  | NGUYỄN VĂN A | C12, MO |
| 1 | Tổ chức thực hiện TGPL | organization_units | taxCode | VARCHAR2 | tgpl_to_chuc | org_units → tgpl_to_chuc | ma_so_thue | VARCHAR(20) | Không | Y |  | Lấy trực tiếp |  | — | C12; không MO |
| 1 | Tổ chức thực hiện TGPL | organization_units | legalFormIds  (CLOB JSON) | CLOB | tgpl_to_chuc | org_units → tgpl_to_chuc | hinh_thuc_tgpl | NVARCHAR(500) | Không | Y | — | Chuẩn hóa chuỗi |  | [Tư vấn, Tham gia tố tụng] | TK, MO |
| 1 | Tổ chức thực hiện TGPL | organization_units | legalFieldIds  (CLOB JSON) | CLOB | tgpl_to_chuc | org_units → tgpl_to_chuc | linh_vuc_tgpl | NVARCHAR(500) | Không | Y | — | Lấy trực tiếp |  | — | TK, MO |
| 1 | Tổ chức thực hiện TGPL | organization_units | payrollNumber | NUMBER | tgpl_to_chuc | org_units → tgpl_to_chuc | so_bien_che | INT | Không | Y |  | Lấy trực tiếp |  | — | C12 (Trung tâm) |
| 1 | Tổ chức thực hiện TGPL | organization_units | staffCount | NUMBER | tgpl_to_chuc | org_units → tgpl_to_chuc | so_nhan_su_hien_co | INT | Không | Y |  | Lấy trực tiếp |  | — | C12 (Trung tâm) |
| 1 | Tổ chức thực hiện TGPL | organization_units | roomNumber | NUMBER | tgpl_to_chuc | org_units → tgpl_to_chuc | so_phong_ban | INT | Không | Y |  | Lấy trực tiếp |  | — | C12 (Trung tâm) |
| 1 | Tổ chức thực hiện TGPL | organization_units | unitCount | NUMBER | tgpl_to_chuc | org_units → tgpl_to_chuc | so_chi_nhanh | INT | Không | Y |  | Lấy trực tiếp |  | — | C12 (Trung tâm) |
| ── LUỒNG 2: Trung tâm TGPL nhà nước  ◀  bảng nguồn: organization_units (Oracle): type=1 → Trung tâm TGPL nhà nước |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 2 | Tổ chức thực hiện TGPL | organization_units | id  (UUID PK) | VARCHAR2(36) |  tgpl_trung_tam | org_units → tgpl_trung_tam | src_id | VARCHAR(36) | Có | N | NOT NULL; UNIQUE | Lấy trực tiếp (UUID Oracle) | Bỏ qua bản ghi | — | Internal key; không dùng đối ngoại |
| 2 | Tổ chức thực hiện TGPL | organization_units | code | VARCHAR2 |  tgpl_trung_tam | org_units → tgpl_trung_tam | ma_don_vi | VARCHAR(50) | Có | N | NOT NULL | Lấy trực tiếp | Bỏ qua bản ghi | TT-HN-001 | TK, C12, MO |
| 2 | Tổ chức thực hiện TGPL | organization_units | name | VARCHAR2 |  tgpl_trung_tam | org_units → tgpl_trung_tam | ten_to_chuc | NVARCHAR(255) | Có | N | NOT NULL | Lấy trực tiếp | Bỏ qua bản ghi | Trung tâm TGPL tỉnh Hà Nội | TK, C12, MO |
| 2 | Tổ chức thực hiện TGPL | organization_units | fullName | VARCHAR2 |  tgpl_trung_tam | org_units → tgpl_trung_tam | ten_hien_thi | NVARCHAR(255) | Không | Y |  | Lấy trực tiếp |  | — | C12 |
| 2 | Tổ chức thực hiện TGPL | organization_units | type + organizationGroupId | NUMBER / VARCHAR2(36) |  tgpl_trung_tam | org_units → tgpl_trung_tam | nhom_to_chuc | VARCHAR(100) | Có | N | NOT NULL | Chuẩn hóa chuỗi | Bỏ qua bản ghi | type=1 → Trung tâm TGPL nhà nước | TK biểu 15c |
| 2 | Tổ chức thực hiện TGPL | organization_units | establishmentDate | VARCHAR2 |  tgpl_trung_tam | org_units → tgpl_trung_tam | ngay_thanh_lap | DATE | Không | Y |  | Parse dd/mm/yyyy → DATE |  | 01/01/2010 → 2010-01-01 | C12 |
| 2 | Tổ chức thực hiện TGPL | organization_units | status | NUMBER |  tgpl_trung_tam | org_units → tgpl_trung_tam | trang_thai_hoat_dong | VARCHAR(50) | Có | N | NOT NULL | Chuẩn hóa chuỗi | Bỏ qua bản ghi | 1 → Đang hoạt động | C12, MO |
| 2 | Tổ chức thực hiện TGPL | organization_units | provinceId → categories.code | VARCHAR2(36) |  tgpl_trung_tam | org_units → tgpl_trung_tam | ma_tinh | VARCHAR(10) | Có | N | NOT NULL; FK CHECK: dm_tinh | Join categories bằng provinceId → mã tỉnh | Bỏ qua bản ghi | — | C12, TK |
| 2 | Tổ chức thực hiện TGPL | organization_units | provinceId → categories.name | VARCHAR2 |  tgpl_trung_tam | org_units → tgpl_trung_tam | tinh_tp | NVARCHAR(100) | Có | N | NOT NULL | Lấy trực tiếp | Bỏ qua bản ghi | Hà Nội | C12, MO |
| 2 | Tổ chức thực hiện TGPL | organization_units | wardId → categories | VARCHAR2(36) |  tgpl_trung_tam | org_units → tgpl_trung_tam | ma_xa / phuong_xa | VARCHAR(10) / NVARCHAR(100) | Không | Y | FK CHECK: dm_xa | Join categories |  | — | C12 |
| 2 | Tổ chức thực hiện TGPL | organization_units | address | VARCHAR2 |  tgpl_trung_tam | org_units → tgpl_trung_tam | dia_chi_chi_tiet | NVARCHAR(500) | Không | Y |  | Lấy trực tiếp |  | — | C12, MO |
| 2 | Tổ chức thực hiện TGPL | organization_units | phone | VARCHAR2 |  tgpl_trung_tam | org_units → tgpl_trung_tam | dien_thoai | VARCHAR(20) | Không | Y |  | Lấy trực tiếp |  | — | MO |
| 2 | Tổ chức thực hiện TGPL | organization_units | email | VARCHAR2 |  tgpl_trung_tam | org_units → tgpl_trung_tam | email | VARCHAR(255) | Không | Y |  | Lấy trực tiếp |  | — | C12 |
| 2 | Tổ chức thực hiện TGPL | organization_units | website | VARCHAR2 |  tgpl_trung_tam | org_units → tgpl_trung_tam | website | VARCHAR(255) | Không | Y |  | Lấy trực tiếp |  | — | C12 |
| 2 | Tổ chức thực hiện TGPL | organization_units | representative | VARCHAR2 |  tgpl_trung_tam | org_units → tgpl_trung_tam | nguoi_dai_dien | NVARCHAR(255) | Không | Y |  | Chuẩn hóa chuỗi |  | NGUYỄN VĂN A | C12, MO |
| 2 | Tổ chức thực hiện TGPL | organization_units | taxCode | VARCHAR2 |  tgpl_trung_tam | org_units → tgpl_trung_tam | ma_so_thue | VARCHAR(20) | Không | Y |  | Lấy trực tiếp |  | — | C12; không MO |
| 2 | Tổ chức thực hiện TGPL | organization_units | legalFormIds  (CLOB JSON) | CLOB |  tgpl_trung_tam | org_units → tgpl_trung_tam | hinh_thuc_tgpl | NVARCHAR(500) | Không | Y | — | Chuẩn hóa chuỗi |  | [Tư vấn, Tham gia tố tụng] | TK, MO |
| 2 | Tổ chức thực hiện TGPL | organization_units | legalFieldIds  (CLOB JSON) | CLOB |  tgpl_trung_tam | org_units → tgpl_trung_tam | linh_vuc_tgpl | NVARCHAR(500) | Không | Y | — | Lấy trực tiếp |  | — | TK, MO |
| 2 | Tổ chức thực hiện TGPL | organization_units | payrollNumber | NUMBER |  tgpl_trung_tam | org_units → tgpl_trung_tam | so_bien_che | INT | Không | Y |  | Lấy trực tiếp |  | — | C12 (Trung tâm) |
| 2 | Tổ chức thực hiện TGPL | organization_units | staffCount | NUMBER |  tgpl_trung_tam | org_units → tgpl_trung_tam | so_nhan_su_hien_co | INT | Không | Y |  | Lấy trực tiếp |  | — | C12 (Trung tâm) |
| 2 | Tổ chức thực hiện TGPL | organization_units | roomNumber | NUMBER |  tgpl_trung_tam | org_units → tgpl_trung_tam | so_phong_ban | INT | Không | Y |  | Lấy trực tiếp |  | — | C12 (Trung tâm) |
| 2 | Tổ chức thực hiện TGPL | organization_units | unitCount | NUMBER |  tgpl_trung_tam | org_units → tgpl_trung_tam | so_chi_nhanh | INT | Không | Y |  | Lấy trực tiếp |  | — | C12 (Trung tâm) |
| ── LUỒNG 3 Chi nhánh TGPL  ◀  bảng nguồn: organization_units (Oracle): type=1 → Chi nhánh TGPL |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 3 | Tổ chức thực hiện TGPL | organization_units | id  (UUID PK) | VARCHAR2(36) | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | src_id | VARCHAR(36) | Có | N | NOT NULL; UNIQUE | Lấy trực tiếp (UUID Oracle) | Bỏ qua bản ghi | — | Internal key; không dùng đối ngoại |
| 3 | Tổ chức thực hiện TGPL | organization_units | code | VARCHAR2 | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | ma_don_vi | VARCHAR(50) | Có | N | NOT NULL | Lấy trực tiếp | Bỏ qua bản ghi | TT-HN-001 | TK, C12, MO |
| 3 | Tổ chức thực hiện TGPL | organization_units | name | VARCHAR2 | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | ten_to_chuc | NVARCHAR(255) | Có | N | NOT NULL | Lấy trực tiếp | Bỏ qua bản ghi | Trung tâm TGPL tỉnh Hà Nội | TK, C12, MO |
| 3 | Tổ chức thực hiện TGPL | organization_units | fullName | VARCHAR2 | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | ten_hien_thi | NVARCHAR(255) | Không | Y |  | Lấy trực tiếp |  | — | C12 |
| 3 | Tổ chức thực hiện TGPL | organization_units | type + organizationGroupId | NUMBER / VARCHAR2(36) | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | nhom_to_chuc | VARCHAR(100) | Có | N | NOT NULL | Chuẩn hóa chuỗi | Bỏ qua bản ghi | type=1 → Trung tâm TGPL nhà nước | TK biểu 15c |
| 3 | Tổ chức thực hiện TGPL | organization_units | establishmentDate | VARCHAR2 | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | ngay_thanh_lap | DATE | Không | Y |  | Parse dd/mm/yyyy → DATE |  | 01/01/2010 → 2010-01-01 | C12 |
| 3 | Tổ chức thực hiện TGPL | organization_units | status | NUMBER | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | trang_thai_hoat_dong | VARCHAR(50) | Có | N | NOT NULL | Chuẩn hóa chuỗi | Bỏ qua bản ghi | 1 → Đang hoạt động | C12, MO |
| 3 | Tổ chức thực hiện TGPL | organization_units | provinceId → categories.code | VARCHAR2(36) | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | ma_tinh | VARCHAR(10) | Có | N | NOT NULL; FK CHECK: dm_tinh | Join categories bằng provinceId → mã tỉnh | Bỏ qua bản ghi | — | C12, TK |
| 3 | Tổ chức thực hiện TGPL | organization_units | provinceId → categories.name | VARCHAR2 | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | tinh_tp | NVARCHAR(100) | Có | N | NOT NULL | Lấy trực tiếp | Bỏ qua bản ghi | Hà Nội | C12, MO |
| 3 | Tổ chức thực hiện TGPL | organization_units | wardId → categories | VARCHAR2(36) | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | ma_xa / phuong_xa | VARCHAR(10) / NVARCHAR(100) | Không | Y | FK CHECK: dm_xa | Join categories |  | — | C12 |
| 3 | Tổ chức thực hiện TGPL | organization_units | address | VARCHAR2 | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | dia_chi_chi_tiet | NVARCHAR(500) | Không | Y |  | Lấy trực tiếp |  | — | C12, MO |
| 3 | Tổ chức thực hiện TGPL | organization_units | phone | VARCHAR2 | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | dien_thoai | VARCHAR(20) | Không | Y |  | Lấy trực tiếp |  | — | MO |
| 3 | Tổ chức thực hiện TGPL | organization_units | email | VARCHAR2 | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | email | VARCHAR(255) | Không | Y |  | Lấy trực tiếp |  | — | C12 |
| 3 | Tổ chức thực hiện TGPL | organization_units | website | VARCHAR2 | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | website | VARCHAR(255) | Không | Y |  | Lấy trực tiếp |  | — | C12 |
| 3 | Tổ chức thực hiện TGPL | organization_units | representative | VARCHAR2 | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | nguoi_dai_dien | NVARCHAR(255) | Không | Y |  | Chuẩn hóa chuỗi |  | NGUYỄN VĂN A | C12, MO |
| 3 | Tổ chức thực hiện TGPL | organization_units | taxCode | VARCHAR2 | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | ma_so_thue | VARCHAR(20) | Không | Y |  | Lấy trực tiếp |  | — | C12; không MO |
| 3 | Tổ chức thực hiện TGPL | organization_units | legalFormIds  (CLOB JSON) | CLOB | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | hinh_thuc_tgpl | NVARCHAR(500) | Không | Y | — | Chuẩn hóa chuỗi |  | [Tư vấn, Tham gia tố tụng] | TK, MO |
| 3 | Tổ chức thực hiện TGPL | organization_units | legalFieldIds  (CLOB JSON) | CLOB | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | linh_vuc_tgpl | NVARCHAR(500) | Không | Y | — | Lấy trực tiếp |  | — | TK, MO |
| 3 | Tổ chức thực hiện TGPL | organization_units | payrollNumber | NUMBER | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | so_bien_che | INT | Không | Y |  | Lấy trực tiếp |  | — | C12 (Trung tâm) |
| 3 | Tổ chức thực hiện TGPL | organization_units | staffCount | NUMBER | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | so_nhan_su_hien_co | INT | Không | Y |  | Lấy trực tiếp |  | — | C12 (Trung tâm) |
| 3 | Tổ chức thực hiện TGPL | organization_units | roomNumber | NUMBER | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | so_phong_ban | INT | Không | Y |  | Lấy trực tiếp |  | — | C12 (Trung tâm) |
| 3 | Tổ chức thực hiện TGPL | organization_units | unitCount | NUMBER | tgpl_chi_nhanh | org_units → tgpl_chi_nhanh | so_chi_nhanh | INT | Không | Y |  | Lấy trực tiếp |  | — | C12 (Trung tâm) |
| ── LUỒNG 4 Tổ chức đăng ký tham gia trợ giúp pháp lý  ◀  bảng nguồn: organization_unit_documents (Oracle) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | id | uuid (UUID PK) | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | id | uuid (UUID PK) | Có | N | NOT NULL | Lấy trực tiếp (UUID Oracle) | Bỏ qua bản ghi |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | organizationUnitId | uuid | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | ma_don_vi_to_chuc | uuid | Có | N | NOT NULL | Lấy trực tiếp | Bỏ qua bản ghi |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | type | varchar | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | loai | varchar | Có | N | NOT NULL | Lấy trực tiếp | Bỏ qua bản ghi |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | documentNumber | String | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | so_van_ban | String | Không | Y |  | Lấy trực tiếp |  |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | startDate | date | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | ngay_bat_dau | date | Không | Y |  | Lấy trực tiếp |  |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | endDate | date | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | ngay_ket_thuc | date | Không | Y |  | Lấy trực tiếp |  |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | attachments | json | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | tep_dinh_kem | json | Không | Y |  | Lấy trực tiếp |  |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | renewedMonths | number | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | so_thang_gia_han | number | Không | Y |  | Lấy trực tiếp |  |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | renewedEndDate | date | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | ngay_ket_thuc_gia_han | date | Không | Y |  | Lấy trực tiếp |  |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | terminationDate | date | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | ngay_cham_dut | date | Không | Y |  | Lấy trực tiếp |  |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | terminationReason | varchar | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | ly_do_cham_dut | varchar | Không | Y |  | Lấy trực tiếp |  |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | issuingAgency | varchar | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | co_quan_ban_hanh | varchar | Không | Y |  | Lấy trực tiếp |  |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | issueDate | date | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | ngay_ban_hanh | date | Không | Y |  | Lấy trực tiếp |  |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | withdrawalDate | date | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | ngay_thu_hoi | date | Không | Y |  | Lấy trực tiếp |  |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | issueReason | varchar | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | ly_do_ban_hanh | varchar | Không | Y |  | Lấy trực tiếp |  |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | withdrawalReason | varchar | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | ly_do_thu_hoi | varchar | Không | Y |  | Lấy trực tiếp |  |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | createdAt | timestamp | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | ngay_tao | timestamp | Có | N | NOT NULL | Lấy trực tiếp | Bỏ qua bản ghi |  |  |
| 4 |  Tổ chức đăng ký tham gia trợ giúp pháp lý | organization_unit_documents | updatedAt | timestamp | tgpl_don_vi_dang_ky | organization_unit_documents → tgpl_don_vi_dang_ky | ngay_cap_nhat | timestamp | Có | N | NOT NULL | Lấy trực tiếp | Bỏ qua bản ghi |  |  |
| ── LUỒNG 5 Người thực hiện TGPL  ◀  bảng nguồn: staff (Oracle) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 5 | Người thực hiện TGPL | staff | objectType | VARCHAR2 | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | loai_nhan_su | VARCHAR(50) | Có | N | NOT NULL | Map objectType nguồn → enum đích | Bỏ qua bản ghi | TroGiupVienPL | TK biểu 15c, MO |
| 5 | Người thực hiện TGPL | staff | fullName | VARCHAR2 | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | ho_va_ten | NVARCHAR(255) | Có | N | NOT NULL | Chuẩn hóa chuỗi | Bỏ qua bản ghi | NGUYỄN VĂN A | C12, MO |
| 5 | Người thực hiện TGPL | staff | dateOfBirth | TIMESTAMP | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | ngay_sinh | DATE | Không | Y |  | TIMESTAMP → DATE |  | — | C12; không MO |
| 5 | Người thực hiện TGPL | staff | genderId → categories | NUMBER | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | gioi_tinh | VARCHAR(10) | Không | Y |  | Chuẩn hóa chuỗi |  | 1 → Nam | C12; không MO |
| 5 | Người thực hiện TGPL | staff | ethnicId → categories | VARCHAR2(36) | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | dan_toc | NVARCHAR(50) | Không | Y | — | Lấy trực tiếp |  | — | C12; không MO |
| 5 | Người thực hiện TGPL | staff | cccd | VARCHAR2 | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | so_dinh_danh | VARCHAR(20) | Không | Y | REGEX: ^[0-9]{9,12}$ | Lấy trực tiếp |  | — | C12; không MO |
| 5 | Người thực hiện TGPL | staff | cccdIssuanceDate | TIMESTAMP | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | ngay_cap_gttt | DATE | Không | Y |  | TIMESTAMP → DATE |  | — | C12 |
| 5 | Người thực hiện TGPL | staff | cccdPlaceOfIssuance | VARCHAR2 | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | noi_cap | NVARCHAR(255) | Không | Y | — | Lấy trực tiếp |  | — | C12 |
| 5 | Người thực hiện TGPL | staff | phone | VARCHAR2 | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | so_dien_thoai | VARCHAR(20) | Không | Y |  | Lấy trực tiếp |  | — | C12; không MO |
| 5 | Người thực hiện TGPL | staff | positionId → categories | VARCHAR2(36) | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | chuc_danh | NVARCHAR(100) | Không | Y | — | Lấy trực tiếp |  | — | MO |
| 5 | Người thực hiện TGPL | staff | civilServantRankId → categories | VARCHAR2(36) | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | hang_vien_chuc | VARCHAR(20) | Không | Y |  | Chuẩn hóa chuỗi |  | Hạng II | TK biểu 15c, MO |
| 5 | Người thực hiện TGPL | staff | cardNumber | VARCHAR2 | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | so_the | VARCHAR(50) | Không | Y | — | Lấy trực tiếp |  | — | TK, MO |
| 5 | Người thực hiện TGPL | staff | cardIssuedDate | TIMESTAMP | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | ngay_cap_the | DATE | Không | Y |  | TIMESTAMP → DATE |  | — | MO |
| 5 | Người thực hiện TGPL | staff | organizationUnitId →<br>organization_units.name | VARCHAR2(36) | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | don_vi | NVARCHAR(255) | Không | Y | — | Lấy trực tiếp |  | — | MO |
| 5 | Người thực hiện TGPL | staff | professionalLevelId → categories | VARCHAR2(36) | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | trinh_do_nghiep_vu | NVARCHAR(100) | Không | Y | — | Lấy trực tiếp |  | — | C12 |
| 5 | Người thực hiện TGPL | staff | specializedFields  (CLOB JSON) | CLOB | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | linh_vuc_chuyen_sau | NVARCHAR(255) | Không | Y | — | Lấy trực tiếp |  | — | C12 |
| 5 | Người thực hiện TGPL | staff | activityStatusId / isActive | VARCHAR2(36) / NUMBER | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | trang_thai_hoat_dong | VARCHAR(50) | Có | N | NOT NULL | Chuẩn hóa chuỗi | Bỏ qua bản ghi | 1 → Đang hoạt động | C12 |
| 5 | Người thực hiện TGPL | staff | yearsOfExperience | NUMBER | tgpl_nguoi_thuc_hien | staff → tgpl_nguoi_thuc_hien | so_nam_hanh_nghe | INT | Không | Y |  | Lấy trực tiếp |  | — | MO |
| ── LUỒNG 6 Hồ sơ vụ việc TGPL  ◀  bảng nguồn: case_advanced (Oracle) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 6 | Hồ sơ vụ việc TGPL | case_advanced | code | VARCHAR2(200) | tgpl_ho_so_vu_viec | case_advanced → tgpl_ho_so_vu_viec | ma_ho_so | VARCHAR(50) | Có | N | NOT NULL; UNIQUE | Lấy trực tiếp | Bỏ qua bản ghi | VV-001-2025 | PK đích; TK |
| 6 | Hồ sơ vụ việc TGPL | case_advanced | entryDate | VARCHAR2(50) | tgpl_ho_so_vu_viec | case_advanced → tgpl_ho_so_vu_viec | ngay_tiep_nhan | DATE | Không | Y |  | Parse dd/mm/yyyy → DATE |  | — | — |
| 6 | Hồ sơ vụ việc TGPL | case_advanced | caseAcceptanceDate | VARCHAR2(50) | tgpl_ho_so_vu_viec | case_advanced → tgpl_ho_so_vu_viec | ngay_thu_ly | DATE | Không | Y |  | Parse dd/mm/yyyy → DATE |  | — | TK 15b, IOC |
| 6 | Hồ sơ vụ việc TGPL | case_advanced | formsOfAssistance | VARCHAR2(250) | tgpl_ho_so_vu_viec | case_advanced → tgpl_ho_so_vu_viec | hinh_thuc_tgpl | VARCHAR(100) | Không | Y |  | Chuẩn hóa chuỗi |  | Tư vấn, Tham gia tố tụng, Đại diện ngoài tố tụng | TK 15a, 15b |
| 6 | Hồ sơ vụ việc TGPL | case_advanced | legalField | VARCHAR2(200) | tgpl_ho_so_vu_viec | case_advanced → tgpl_ho_so_vu_viec | linh_vuc_tgpl | NVARCHAR(100) | Không | Y |  | Chuẩn hóa chuỗi |  | Hình sự, Dân sự-HN gia đình, Hành chính, Khác | TK 15a, 15b |
| 6 | Hồ sơ vụ việc TGPL | case_advanced | status | VARCHAR2 | tgpl_ho_so_vu_viec | case_advanced → tgpl_ho_so_vu_viec | trang_thai_vu_viec | VARCHAR(50) | Có | N | NOT NULL | Chuẩn hóa chuỗi | Bỏ qua bản ghi | COMPLETED → Đã hoàn thành | TK 15b; IOC tỷ lệ hoàn thành |
| 6 | Hồ sơ vụ việc TGPL | case_advanced | orgUnitId → org_units<br>→ provinceId → categories.code | VARCHAR2(36) | tgpl_ho_so_vu_viec | case_advanced → tgpl_ho_so_vu_viec | ma_don_vi_hc | VARCHAR(10) | Không | Y |  | Lấy trực tiếp |  | — | TK theo đơn vị HC |
| 6 | Hồ sơ vụ việc TGPL | case_advanced | assignedPeople  (CLOB JSON) | CLOB | tgpl_ho_so_vu_viec | case_advanced → tgpl_ho_so_vu_viec | loai_ns_thuc_hien | VARCHAR(50) | Không | Y |  | Lấy trực tiếp |  | — | TK 15b phân theo loại nhân sự |
| ── LUỒNG 7 Người được TGPL  ◀  bảng nguồn: case_advanced (Oracle) chỉ lấy trường thông tin phía dưới |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 7 | Người được TGPL | case_advanced | id / code  (FK) | VARCHAR2(36) / VARCHAR2(200) | tgpl_nguoi_duoc_tgpl | case_advanced → tgpl_nguoi_duoc_tro_giup | ma_ho_so (FK) | VARCHAR(50) | Có | N | NOT NULL; FK CHECK | Lấy trực tiếp | Bỏ qua bản ghi | — | FK liên kết hồ sơ |
| 7 | Người được TGPL | case_advanced | rpName | VARCHAR2(100) | tgpl_nguoi_duoc_tgpl | case_advanced → tgpl_nguoi_duoc_tro_giup | ho_va_ten | NVARCHAR(255) | Không | Y |  | Lấy trực tiếp |  | — | C12 |
| 7 | Người được TGPL | case_advanced | rpSex  (0=Nữ, 1=Nam) | NUMBER | tgpl_nguoi_duoc_tgpl | case_advanced → tgpl_nguoi_duoc_tro_giup | gioi_tinh | VARCHAR(10) | Không | Y |  | Chuẩn hóa chuỗi |  | 1 → Nam | TK 15a |
| 7 | Người được TGPL | case_advanced | rpCardNumber | VARCHAR2(20) | tgpl_nguoi_duoc_tgpl | case_advanced → tgpl_nguoi_duoc_tro_giup | so_dinh_danh | VARCHAR(20) | Không | Y | REGEX: ^[0-9]{9,12}$ | Lấy trực tiếp |  | — | C12; không MO |
| 7 | Người được TGPL | case_advanced | guardianPhone | VARCHAR2(13) | tgpl_nguoi_duoc_tgpl | case_advanced → tgpl_nguoi_duoc_tro_giup | so_dien_thoai | VARCHAR(20) | Không | Y |  | Lấy trực tiếp |  | — | C12; không MO |
| 7 | Người được TGPL | case_advanced | objectLegalField | VARCHAR2(2000) | tgpl_nguoi_duoc_tgpl | case_advanced → tgpl_nguoi_duoc_tro_giup | dien_nguoi_tgpl | NVARCHAR(255) | Không | Y |  | Lấy trực tiếp |  | Người có công với cách mạng | TK 15a phân theo đối tượng |


## 3. Target Schema

| SHEET 3A – DANH SÁCH BẢNG ĐÍCH – HỆ THỐNG TGPL | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dev đọc sheet này để hiểu schema đích trong Kho dữ liệu tập trung.  DB nguồn: Oracle Enterprise – camelCase column names.  Cần join bảng categories để resolve FK (provinceId, wardId, genderId, ...).  Kho chỉ lưu và cung cấp DANH SÁCH BẢN GHI THÔ – hệ thống nhận (TT17, IOC, C12, MO) tự tổng hợp theo nhu cầu. |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| STT | Tên bảng đích | Mô tả nghiệp vụ | Luồng nguồn<br>(xem Sheet 1 – cột STT) | Loại lưu trữ | Khóa phân vùng<br>(Partition key) | Khóa chính<br>(Primary key) | Khóa duy nhất<br>(Unique key) | Kiểu ghi | Thời gian lưu | Trạng thái | Ưu tiên | Ghi chú |  |
| 1 | tgpl_to_chuc | Tổ chức TGPL | 1 | Cơ sở dữ liệu quan hệ | ma_tinh | src_id (UUID Oracle) | ma_don_vi | Upsert – Ghi đè / thêm mới |  | Đang thực hiện | Cao |  |  |
|  | Trung tâm TGPL nhà nước | Trung tâm nhà nước | 2 | Cơ sở dữ liệu quan hệ | ma_tinh | src_id (UUID Oracle) | ma_don_vi | Upsert – Ghi đè / thêm mới |  | Đang thực hiện | Cao |  |  |
|  | Chi nhánh TGPL  | Chi nhánh, | 3 | Cơ sở dữ liệu quan hệ | ma_tinh | src_id (UUID Oracle) | ma_don_vi | Upsert – Ghi đè / thêm mới |  | Đang thực hiện | Cao |  |  |
|  | Tổ chức đăng ký tham gia trợ giúp pháp lý |  Tổ chức đăng ký | 4 | Cơ sở dữ liệu quan hệ | ma_tinh | src_id (UUID Oracle) | ma_don_vi | Upsert – Ghi đè / thêm mới |  | Đang thực hiện | Cao |  |  |
| 2 | tgpl_nguoi_thuc_hien | Người thực hiện TGPL – 5 loại nhân sự.<br>Nguồn: staff (Oracle) | 5 | Cơ sở dữ liệu quan hệ | loai_nhan_su | src_id (UUID Oracle) | so_dinh_danh | Upsert – Ghi đè / thêm mới |  | Đang thực hiện | Cao |  |  |
| 3 | tgpl_ho_so_vu_viec | Hồ sơ vụ việc TGPL.<br>Nguồn: case_advanced (Oracle) | 6 | Cơ sở dữ liệu quan hệ | ngay_thu_ly<br>(YYYY-MM) | ma_ho_so | ma_ho_so | Upsert – Ghi đè / thêm mới |  | Đang thực hiện | Cao |  |  |
| 4 | tgpl_nguoi_duoc_tgpl | Người được TGPL.<br>Nguồn: case_advanced – cột rp* | 7 | Cơ sở dữ liệu quan hệ | — | id_nguoi_duoc<br>(khóa tự sinh) | so_dinh_danh | Upsert – Ghi đè / thêm mới |  | Đang thực hiện | Cao |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 3B │ CHI TIẾT CỘT BẢNG ĐÍCH |  |  |  |  |  |  |  |  |  |  |  |  |  |
| STT bảng<br>(xem 3A) | Tên bảng đích<br>(xem 3A – cột<br>Tên bảng đích) | Tên cột | Kiểu dữ liệu | Độ dài /<br>Độ chính xác | Cho phép<br>Null | Giá trị<br>mặc định | Khóa / Chỉ mục<br>(PK/FK/IDX) | Luồng nguồn<br>(xem Sheet 1<br>cột STT) | Bảng nguồn Oracle<br>(xem Sheet 1<br>cột Bảng nguồn) | Trường nguồn<br>(tên cột Oracle) | Ghi chú kỹ thuật | Cột hệ thống<br>(xem 3C) | Trạng thái |
|   ▸ tgpl_to_chuc_thuc_hien_TGPL |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 1 | tgpl_to_chuc | src_id | VARCHAR | 36 | Không | — | Khóa chính | 1 | organization_units | id | UUID Oracle – Khóa chính nguồn | Không | Hoạt động |
| 1 | tgpl_to_chuc | ma_don_vi | VARCHAR | 50 | Không | — | Khóa duy nhất + Chỉ mục | 1 | organization_units | code | MaDDTC; dùng C12 | Không | Hoạt động |
| 1 | tgpl_to_chuc | ten_to_chuc | NVARCHAR | 255 | Không | — | Chỉ mục | 1 | organization_units | name |  | Không | Hoạt động |
| 1 | tgpl_to_chuc | ten_hien_thi | NVARCHAR | 255 | Có |  | — | 1 | organization_units | fullName |  | Không | Hoạt động |
| 1 | tgpl_to_chuc | nhom_to_chuc | VARCHAR | 100 | Không | — | Chỉ mục | 1 | organization_units | type + organizationGroupId | Ánh xạ enum + join categories | Không | Hoạt động |
| 1 | tgpl_to_chuc | ngay_thanh_lap | DATE | — | Có |  | — | 1 | organization_units | establishmentDate | Parse dd/mm/yyyy | Không | Hoạt động |
| 1 | tgpl_to_chuc | trang_thai_hoat_dong | VARCHAR | 50 | Không | — | Chỉ mục | 1 | organization_units | status (NUMBER) | 1=Đang hoạt động | Không | Hoạt động |
| 1 | tgpl_to_chuc | ma_tinh | VARCHAR | 10 | Không | — | Khóa ngoại + Chỉ mục | 1 | organization_units | provinceId → categories.code | Join categories | Không | Hoạt động |
| 1 | tgpl_to_chuc | tinh_tp | NVARCHAR | 100 | Không | — | — | 1 | organization_units | provinceId → categories.name | Join categories | Không | Hoạt động |
| 1 | tgpl_to_chuc | ma_xa | VARCHAR | 10 | Có |  | Khóa ngoại | 1 | organization_units | wardId → categories.code | Join categories | Không | Hoạt động |
| 1 | tgpl_to_chuc | phuong_xa | NVARCHAR | 100 | Có |  | — | 1 | organization_units | wardId → categories.name |  | Không | Hoạt động |
| 1 | tgpl_to_chuc | dia_chi_chi_tiet | NVARCHAR | 500 | Có |  | — | 1 | organization_units | address |  | Không | Hoạt động |
| 1 | tgpl_to_chuc | dien_thoai | VARCHAR | 20 | Có |  | — | 1 | organization_units | phone |  | Không | Hoạt động |
| 1 | tgpl_to_chuc | email | VARCHAR | 255 | Có |  | — | 1 | organization_units | email |  | Không | Hoạt động |
| 1 | tgpl_to_chuc | website | VARCHAR | 255 | Có |  | — | 1 | organization_units | website |  | Không | Hoạt động |
| 1 | tgpl_to_chuc | nguoi_dai_dien | NVARCHAR | 255 | Có |  | — | 1 | organization_units | representative |  | Không | Hoạt động |
| 1 | tgpl_to_chuc | hinh_thuc_tgpl | NVARCHAR | 500 | Có |  | — | 1 | organization_units | legalFormIds (CLOB JSON) | Parse JSON → join categories | Không | Hoạt động |
| 1 | tgpl_to_chuc | linh_vuc_tgpl | NVARCHAR | 500 | Có |  | — | 1 | organization_units | legalFieldIds (CLOB JSON) | Parse JSON → join categories | Không | Hoạt động |
| 1 | tgpl_to_chuc | so_bien_che | INT | — | Có |  | — | 1 | organization_units | payrollNumber | Chỉ Trung tâm | Không | Hoạt động |
| 1 | tgpl_to_chuc | so_nhan_su_hien_co | INT | — | Có |  | — | 1 | organization_units | staffCount | Chỉ Trung tâm | Không | Hoạt động |
|   ▸ tgpl_trung_tam_tgpl_nha_nuoc |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 2 | tgpl_to_chuc | src_id | VARCHAR | 36 | Không | — | Khóa chính | 1 | organization_units | id | UUID Oracle – Khóa chính nguồn | Không | Hoạt động |
| 2 | tgpl_to_chuc | ma_don_vi | VARCHAR | 50 | Không | — | Khóa duy nhất + Chỉ mục | 1 | organization_units | code | MaDDTC; dùng C12 | Không | Hoạt động |
| 2 | tgpl_to_chuc | ten_to_chuc | NVARCHAR | 255 | Không | — | Chỉ mục | 1 | organization_units | name |  | Không | Hoạt động |
| 2 | tgpl_to_chuc | ten_hien_thi | NVARCHAR | 255 | Có |  | — | 1 | organization_units | fullName |  | Không | Hoạt động |
| 2 | tgpl_to_chuc | nhom_to_chuc | VARCHAR | 100 | Không | — | Chỉ mục | 1 | organization_units | type + organizationGroupId | Ánh xạ enum + join categories | Không | Hoạt động |
| 2 | tgpl_to_chuc | ngay_thanh_lap | DATE | — | Có |  | — | 1 | organization_units | establishmentDate | Parse dd/mm/yyyy | Không | Hoạt động |
| 2 | tgpl_to_chuc | trang_thai_hoat_dong | VARCHAR | 50 | Không | — | Chỉ mục | 1 | organization_units | status (NUMBER) | 1=Đang hoạt động | Không | Hoạt động |
| 2 | tgpl_to_chuc | ma_tinh | VARCHAR | 10 | Không | — | Khóa ngoại + Chỉ mục | 1 | organization_units | provinceId → categories.code | Join categories | Không | Hoạt động |
| 2 | tgpl_to_chuc | tinh_tp | NVARCHAR | 100 | Không | — | — | 1 | organization_units | provinceId → categories.name | Join categories | Không | Hoạt động |
| 2 | tgpl_to_chuc | ma_xa | VARCHAR | 10 | Có |  | Khóa ngoại | 1 | organization_units | wardId → categories.code | Join categories | Không | Hoạt động |
| 2 | tgpl_to_chuc | phuong_xa | NVARCHAR | 100 | Có |  | — | 1 | organization_units | wardId → categories.name |  | Không | Hoạt động |
| 2 | tgpl_to_chuc | dia_chi_chi_tiet | NVARCHAR | 500 | Có |  | — | 1 | organization_units | address |  | Không | Hoạt động |
| 2 | tgpl_to_chuc | dien_thoai | VARCHAR | 20 | Có |  | — | 1 | organization_units | phone |  | Không | Hoạt động |
| 2 | tgpl_to_chuc | email | VARCHAR | 255 | Có |  | — | 1 | organization_units | email |  | Không | Hoạt động |
| 2 | tgpl_to_chuc | website | VARCHAR | 255 | Có |  | — | 1 | organization_units | website |  | Không | Hoạt động |
| 2 | tgpl_to_chuc | nguoi_dai_dien | NVARCHAR | 255 | Có |  | — | 1 | organization_units | representative |  | Không | Hoạt động |
| 2 | tgpl_to_chuc | hinh_thuc_tgpl | NVARCHAR | 500 | Có |  | — | 1 | organization_units | legalFormIds (CLOB JSON) | Parse JSON → join categories | Không | Hoạt động |
| 2 | tgpl_to_chuc | linh_vuc_tgpl | NVARCHAR | 500 | Có |  | — | 1 | organization_units | legalFieldIds (CLOB JSON) | Parse JSON → join categories | Không | Hoạt động |
| 2 | tgpl_to_chuc | so_bien_che | INT | — | Có |  | — | 1 | organization_units | payrollNumber | Chỉ Trung tâm | Không | Hoạt động |
| 2 | tgpl_to_chuc | so_nhan_su_hien_co | INT | — | Có |  | — | 1 | organization_units | staffCount | Chỉ Trung tâm | Không | Hoạt động |
|   ▸ tgpl_chi_nhanh_tgpl |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 3 | tgpl_to_chuc | src_id | VARCHAR | 36 | Không | — | Khóa chính | 1 | organization_units | id | UUID Oracle – Khóa chính nguồn | Không | Hoạt động |
| 3 | tgpl_to_chuc | ma_don_vi | VARCHAR | 50 | Không | — | Khóa duy nhất + Chỉ mục | 1 | organization_units | code | MaDDTC; dùng C12 | Không | Hoạt động |
| 3 | tgpl_to_chuc | ten_to_chuc | NVARCHAR | 255 | Không | — | Chỉ mục | 1 | organization_units | name |  | Không | Hoạt động |
| 3 | tgpl_to_chuc | ten_hien_thi | NVARCHAR | 255 | Có |  | — | 1 | organization_units | fullName |  | Không | Hoạt động |
| 3 | tgpl_to_chuc | nhom_to_chuc | VARCHAR | 100 | Không | — | Chỉ mục | 1 | organization_units | type + organizationGroupId | Ánh xạ enum + join categories | Không | Hoạt động |
| 3 | tgpl_to_chuc | ngay_thanh_lap | DATE | — | Có |  | — | 1 | organization_units | establishmentDate | Parse dd/mm/yyyy | Không | Hoạt động |
| 3 | tgpl_to_chuc | trang_thai_hoat_dong | VARCHAR | 50 | Không | — | Chỉ mục | 1 | organization_units | status (NUMBER) | 1=Đang hoạt động | Không | Hoạt động |
| 3 | tgpl_to_chuc | ma_tinh | VARCHAR | 10 | Không | — | Khóa ngoại + Chỉ mục | 1 | organization_units | provinceId → categories.code | Join categories | Không | Hoạt động |
| 3 | tgpl_to_chuc | tinh_tp | NVARCHAR | 100 | Không | — | — | 1 | organization_units | provinceId → categories.name | Join categories | Không | Hoạt động |
| 3 | tgpl_to_chuc | ma_xa | VARCHAR | 10 | Có |  | Khóa ngoại | 1 | organization_units | wardId → categories.code | Join categories | Không | Hoạt động |
| 3 | tgpl_to_chuc | phuong_xa | NVARCHAR | 100 | Có |  | — | 1 | organization_units | wardId → categories.name |  | Không | Hoạt động |
| 3 | tgpl_to_chuc | dia_chi_chi_tiet | NVARCHAR | 500 | Có |  | — | 1 | organization_units | address |  | Không | Hoạt động |
| 3 | tgpl_to_chuc | dien_thoai | VARCHAR | 20 | Có |  | — | 1 | organization_units | phone |  | Không | Hoạt động |
| 3 | tgpl_to_chuc | email | VARCHAR | 255 | Có |  | — | 1 | organization_units | email |  | Không | Hoạt động |
| 3 | tgpl_to_chuc | website | VARCHAR | 255 | Có |  | — | 1 | organization_units | website |  | Không | Hoạt động |
| 3 | tgpl_to_chuc | nguoi_dai_dien | NVARCHAR | 255 | Có |  | — | 1 | organization_units | representative |  | Không | Hoạt động |
| 3 | tgpl_to_chuc | hinh_thuc_tgpl | NVARCHAR | 500 | Có |  | — | 1 | organization_units | legalFormIds (CLOB JSON) | Parse JSON → join categories | Không | Hoạt động |
| 3 | tgpl_to_chuc | linh_vuc_tgpl | NVARCHAR | 500 | Có |  | — | 1 | organization_units | legalFieldIds (CLOB JSON) | Parse JSON → join categories | Không | Hoạt động |
| 3 | tgpl_to_chuc | so_bien_che | INT | — | Có |  | — | 1 | organization_units | payrollNumber | Chỉ Trung tâm | Không | Hoạt động |
| 3 | tgpl_to_chuc | so_nhan_su_hien_co | INT | — | Có |  | — | 1 | organization_units | staffCount | Chỉ Trung tâm | Không | Hoạt động |
|   ▸ tgpl_to_chuc_dang_ky_tham_gia_tgpl |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 4 | tgpl_to_chuc | src_id | VARCHAR | 36 | Không | — | Khóa chính | 1 | organization_units | id | UUID Oracle – Khóa chính nguồn | Không | Hoạt động |
| 4 | tgpl_to_chuc | ma_don_vi | VARCHAR | 50 | Không | — | Khóa duy nhất + Chỉ mục | 1 | organization_units | code | MaDDTC; dùng C12 | Không | Hoạt động |
| 4 | tgpl_to_chuc | ten_to_chuc | NVARCHAR | 255 | Không | — | Chỉ mục | 1 | organization_units | name |  | Không | Hoạt động |
| 4 | tgpl_to_chuc | ten_hien_thi | NVARCHAR | 255 | Có |  | — | 1 | organization_units | fullName |  | Không | Hoạt động |
| 4 | tgpl_to_chuc | nhom_to_chuc | VARCHAR | 100 | Không | — | Chỉ mục | 1 | organization_units | type + organizationGroupId | Ánh xạ enum + join categories | Không | Hoạt động |
| 4 | tgpl_to_chuc | ngay_thanh_lap | DATE | — | Có |  | — | 1 | organization_units | establishmentDate | Parse dd/mm/yyyy | Không | Hoạt động |
| 4 | tgpl_to_chuc | trang_thai_hoat_dong | VARCHAR | 50 | Không | — | Chỉ mục | 1 | organization_units | status (NUMBER) | 1=Đang hoạt động | Không | Hoạt động |
| 4 | tgpl_to_chuc | ma_tinh | VARCHAR | 10 | Không | — | Khóa ngoại + Chỉ mục | 1 | organization_units | provinceId → categories.code | Join categories | Không | Hoạt động |
| 4 | tgpl_to_chuc | tinh_tp | NVARCHAR | 100 | Không | — | — | 1 | organization_units | provinceId → categories.name | Join categories | Không | Hoạt động |
| 4 | tgpl_to_chuc | ma_xa | VARCHAR | 10 | Có |  | Khóa ngoại | 1 | organization_units | wardId → categories.code | Join categories | Không | Hoạt động |
| 4 | tgpl_to_chuc | phuong_xa | NVARCHAR | 100 | Có |  | — | 1 | organization_units | wardId → categories.name |  | Không | Hoạt động |
| 4 | tgpl_to_chuc | dia_chi_chi_tiet | NVARCHAR | 500 | Có |  | — | 1 | organization_units | address |  | Không | Hoạt động |
| 4 | tgpl_to_chuc | dien_thoai | VARCHAR | 20 | Có |  | — | 1 | organization_units | phone |  | Không | Hoạt động |
| 4 | tgpl_to_chuc | email | VARCHAR | 255 | Có |  | — | 1 | organization_units | email |  | Không | Hoạt động |
| 4 | tgpl_to_chuc | website | VARCHAR | 255 | Có |  | — | 1 | organization_units | website |  | Không | Hoạt động |
| 4 | tgpl_to_chuc | nguoi_dai_dien | NVARCHAR | 255 | Có |  | — | 1 | organization_units | representative |  | Không | Hoạt động |
| 4 | tgpl_to_chuc | hinh_thuc_tgpl | NVARCHAR | 500 | Có |  | — | 1 | organization_units | legalFormIds (CLOB JSON) | Parse JSON → join categories | Không | Hoạt động |
| 4 | tgpl_to_chuc | linh_vuc_tgpl | NVARCHAR | 500 | Có |  | — | 1 | organization_units | legalFieldIds (CLOB JSON) | Parse JSON → join categories | Không | Hoạt động |
| 4 | tgpl_to_chuc | so_bien_che | INT | — | Có |  | — | 1 | organization_units | payrollNumber | Chỉ Trung tâm | Không | Hoạt động |
| 4 | tgpl_to_chuc | so_nhan_su_hien_co | INT | — | Có |  | — | 1 | organization_units | staffCount | Chỉ Trung tâm | Không | Hoạt động |
|   ▸ tgpl_nguoi_thuc_hien |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 5 | tgpl_nguoi_thuc_hien | src_id | VARCHAR | 36 | Không | — | Khóa chính | 2 | staff | id | UUID Oracle – Khóa chính nguồn | Không | Hoạt động |
| 5 | tgpl_nguoi_thuc_hien | loai_nhan_su | VARCHAR | 50 | Không | — | Chỉ mục | 2 | staff | objectType | 5 loại nhân sự | Không | Hoạt động |
| 5 | tgpl_nguoi_thuc_hien | ho_va_ten | NVARCHAR | 255 | Không | — | Chỉ mục | 2 | staff | fullName |  | Không | Hoạt động |
| 5 | tgpl_nguoi_thuc_hien | ngay_sinh | DATE | — | Có |  | — | 2 | staff | dateOfBirth (TIMESTAMP) | TIMESTAMP → DATE | Không | Hoạt động |
| 5 | tgpl_nguoi_thuc_hien | gioi_tinh | VARCHAR | 10 | Có |  | — | 2 | staff | genderId → categories | Join categories | Không | Hoạt động |
| 5 | tgpl_nguoi_thuc_hien | dan_toc | NVARCHAR | 50 | Có |  | — | 2 | staff | ethnicId → categories | Join categories | Không | Hoạt động |
| 5 | tgpl_nguoi_thuc_hien | so_dinh_danh | VARCHAR | 20 | Có |  | Chỉ mục | 2 | staff | cccd | Không public MO | Không | Hoạt động |
| 5 | tgpl_nguoi_thuc_hien | hang_vien_chuc | VARCHAR | 20 | Có |  | Chỉ mục | 2 | staff | civilServantRankId → categories | Join categories | Không | Hoạt động |
| 5 | tgpl_nguoi_thuc_hien | so_the | VARCHAR | 50 | Có |  | Chỉ mục | 2 | staff | cardNumber |  | Không | Hoạt động |
| 5 | tgpl_nguoi_thuc_hien | ngay_cap_the | DATE | — | Có |  | — | 2 | staff | cardIssuedDate (TIMESTAMP) | TIMESTAMP → DATE | Không | Hoạt động |
| 5 | tgpl_nguoi_thuc_hien | don_vi | NVARCHAR | 255 | Có |  | Chỉ mục | 2 | staff | organizationUnitId → org_units.name | Join org_units | Không | Hoạt động |
| 5 | tgpl_nguoi_thuc_hien | linh_vuc_chuyen_sau | NVARCHAR | 255 | Có |  | — | 2 | staff | specializedFields (CLOB JSON) | Parse JSON → join categories | Không | Hoạt động |
| 5 | tgpl_nguoi_thuc_hien | trang_thai_hoat_dong | VARCHAR | 50 | Không | — | Chỉ mục | 2 | staff | activityStatusId / isActive | isActive=1 → Đang hoạt động | Không | Hoạt động |
|   ▸ tgpl_ho_so_vu_viec |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 6 | tgpl_ho_so_vu_viec | ma_ho_so | VARCHAR | 50 | Không | — | Khóa chính | 3 | case_advanced | code | Khóa chính đích | Không | Hoạt động |
| 6 | tgpl_ho_so_vu_viec | ngay_tiep_nhan | DATE | — | Có |  | — | 3 | case_advanced | entryDate (VARCHAR2(50)) | Parse dd/mm/yyyy | Không | Hoạt động |
| 6 | tgpl_ho_so_vu_viec | ngay_thu_ly | DATE | — | Có |  | Chỉ mục (Phân vùng) | 3 | case_advanced | caseAcceptanceDate (VARCHAR2(50)) | Parse; Khóa phân vùng | Không | Hoạt động |
| 6 | tgpl_ho_so_vu_viec | hinh_thuc_tgpl | VARCHAR | 100 | Có |  | Chỉ mục | 3 | case_advanced | formsOfAssistance |  | Không | Hoạt động |
| 6 | tgpl_ho_so_vu_viec | linh_vuc_tgpl | NVARCHAR | 100 | Có |  | Chỉ mục | 3 | case_advanced | legalField |  | Không | Hoạt động |
| 6 | tgpl_ho_so_vu_viec | trang_thai_vu_viec | VARCHAR | 50 | Không | — | Chỉ mục | 3 | case_advanced | status | Thu thập cả 2 trạng thái | Không | Hoạt động |
| 6 | tgpl_ho_so_vu_viec | ma_don_vi_hc | VARCHAR | 10 | Có |  | Chỉ mục | 3 | case_advanced | orgUnitId → org_units → categories.code | 2 lần join | Không | Hoạt động |
| 6 | tgpl_ho_so_vu_viec | loai_ns_thuc_hien | VARCHAR | 50 | Có |  | Chỉ mục | 3 | case_advanced | assignedPeople (CLOB JSON) → staff.objectType | Parse JSON → join staff | Không | Hoạt động |
|   ▸ tgpl_nguoi_duoc_tgpl |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 7 | tgpl_nguoi_duoc_tgpl | id_nguoi_duoc | BIGINT | — | Không | Tự sinh | Khóa chính | 4 | — | — | Khóa tự sinh | Không | Hoạt động |
| 7 | tgpl_nguoi_duoc_tgpl | ma_ho_so | VARCHAR | 50 | Không | — | Khóa ngoại + Chỉ mục | 4 | case_advanced | code | Khóa ngoại → tgpl_ho_so_vu_viec | Không | Hoạt động |
| 7 | tgpl_nguoi_duoc_tgpl | ho_va_ten | NVARCHAR | 255 | Có |  | — | 4 | case_advanced | rpName |  | Không | Hoạt động |
| 7 | tgpl_nguoi_duoc_tgpl | gioi_tinh | VARCHAR | 10 | Có |  | Chỉ mục | 4 | case_advanced | rpSex (0=Nữ, 1=Nam) | Ánh xạ số → enum | Không | Hoạt động |
| 7 | tgpl_nguoi_duoc_tgpl | so_dinh_danh | VARCHAR | 20 | Có |  | Chỉ mục | 4 | case_advanced | rpCardNumber | Không public MO | Không | Hoạt động |
| 7 | tgpl_nguoi_duoc_tgpl | so_dien_thoai | VARCHAR | 20 | Có |  | — | 4 | case_advanced | guardianPhone | Không public MO | Không | Hoạt động |
| 7 | tgpl_nguoi_duoc_tgpl | dien_nguoi_tgpl | NVARCHAR | 255 | Có |  | Chỉ mục | 4 | case_advanced | objectLegalField | Phân nhóm đối tượng TK 15a | Không | Hoạt động |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 3C │ CỘT HỆ THỐNG – thêm vào MỌI bảng đích |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Tên cột | Kiểu dữ liệu | Cho phép Null | Giá trị mặc định | Mô tả |  |  |  |  |  |  |  |  |  |
| DIP_RefId | varchar | Không | Tự sinh | Mã định danh duy nhất của bản ghi đồng bộ |  |  |  |  |  |  |  |  |  |


## Reference

| REFERENCE – Danh mục giá trị chuẩn – HỆ THỐNG TGPL | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |
| Bảng Oracle nguồn → Bảng đích |  |  |  |  |  |  |  |
| Bảng Oracle (nguồn) | Mô tả | Bảng đích |  |  |  |  |  |
| organization_units | Tổ chức thực hiện TGPL | tgpl_to_chuc  |  |  |  |  |  |
|  |  | tgpl_trung_tam |  |  |  |  |  |
|  |  | tgpl_chi_nhanh |  |  |  |  |  |
|  |  | tgpl_don_vi_dang_ky |  |  |  |  |  |
| staff | Tất cả loại nhân sự TGPL (5 loại) | tgpl_nguoi_thuc_hien |  |  |  |  |  |
| case_advanced | Hồ sơ vụ việc TGPL | tgpl_ho_so_vu_viec |  |  |  |  |  |
| case_advanced  (cột rp*) | Người được TGPL (nhúng trong case_advanced) | tgpl_nguoi_duoc_tgpl |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
| Enum / Danh mục giá trị |  |  |  |  |  |  |  |
| Nhóm tổ chức | Loại nhân sự (objectType) | Hình thức TGPL | Lĩnh vực TGPL | Trạng thái vụ việc |  |  |  |
| Trung tâm TGPL nhà nước | TroGiupVienPL | Tư vấn | Hình sự | Đang xử lý |  |  |  |
| Chi nhánh TGPL | CongTacVien | Tham gia tố tụng | Dân sự - Hôn nhân gia đình | Đã hoàn thành |  |  |  |
| Tổ chức ký hợp đồng TGPL | LuatSuKyHD_TrungTam | Đại diện ngoài tố tụng | Hành chính | Hủy |  |  |  |
| Tổ chức đăng ký tham gia TGPL | LuatSuKyHD_ToChuc |  | Các lĩnh vực khác |  |  |  |  |
|  | TuVanVienPL |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
| Phạm vi chia sẻ theo hệ thống đích |  |  |  |  |  |  |  |
| Nội dung | Cột TK (TT17) kéo về | Cột IOC kéo về | Cột C12 kéo về | Cột MO kéo về | Tần suất | Mô hình<br>(Kho trả danh sách thô;<br>hệ thống nhận tự tổng hợp) | Phân trang bắt buộc |
| Tổ chức TGPL | nhom_to_chuc, trang_thai_hoat_dong, ma_tinh, tinh_tp, hinh_thuc_tgpl, linh_vuc_tgpl | — | Đầy đủ | ten_to_chuc, dia_chi_chi_tiet, dien_thoai, nguoi_dai_dien, hinh_thuc_tgpl | Hàng ngày | Pull API – hệ thống nhận tự COUNT/GROUP BY | 500–1.000 bản ghi/page |
| Người thực hiện TGPL | loai_nhan_su, hang_vien_chuc, trang_thai_hoat_dong, don_vi, ma_tinh | — | Đầy đủ (trừ cccd, địa chỉ, điện thoại cá nhân) | ho_va_ten, loai_nhan_su, chuc_danh, don_vi, so_the | Hàng ngày | Pull API – hệ thống nhận tự COUNT/GROUP BY | 500–1.000 bản ghi/page |
| Hồ sơ vụ việc | linh_vuc_tgpl, hinh_thuc_tgpl, trang_thai_vu_viec, ma_don_vi_hc, ngay_thu_ly | trang_thai_vu_viec, ngay_thu_ly, ngay_ket_thuc | Theo thỏa thuận C12 | Không chia sẻ | Hàng ngày | Pull API – hệ thống nhận tự COUNT/GROUP BY | 500–1.000 bản ghi/page |
| Người được TGPL | gioi_tinh, dien_nguoi_tgpl, ma_ho_so | gioi_tinh, dien_nguoi_tgpl, ma_ho_so (đếm lượt) | ho_va_ten, so_dinh_danh, gioi_tinh | Không chia sẻ | Hàng ngày | Pull API – hệ thống nhận tự COUNT/GROUP BY | 500–1.000 bản ghi/page |
|  |  |  |  |  |  |  |  |
| Trường KHÔNG xuất Dữ liệu mở (phi định danh – QĐ 1058) |  |  |  |  |  |  |  |
| Trường (Oracle column) | Lý do loại bỏ |  |  |  |  |  |  |
| cccd / rpCardNumber | Định danh cá nhân |  |  |  |  |  |  |
| dateOfBirth / rpBirthDate | Định danh cá nhân |  |  |  |  |  |  |
| ethnicId / genderId (cá nhân) | Định danh cá nhân |  |  |  |  |  |  |
| permanentAddress, address (cá nhân) | Địa chỉ cư trú cá nhân |  |  |  |  |  |  |
| phone, email (staff) | Liên hệ cá nhân |  |  |  |  |  |  |
| staffCode, id nội bộ | Thông tin nội bộ |  |  |  |  |  |  |
| taxCode tổ chức | Thông tin nội bộ |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
| Tích hợp hệ thống ngoài BTP (từ BTP_TGPL_2025_PM_ARCH_GĐ1 V1.0) |  |  |  |  |  |  |  |
| Hệ thống | Loại kết nối | Mô tả |  |  |  |  |  |
| C12 – CSDL tổng hợp QG (BCA) | Chia sẻ – Pull API qua NDXP | Chia sẻ danh sách tổ chức + người thực hiện TGPL |  |  |  |  |  |
| LGSP BTP | Trục tích hợp | Kết nối nội bộ BTP: Cổng Pháp luật, Hệ thống TTHC, Kho dữ liệu dùng chung |  |  |  |  |  |
| NDXP / NDOP | Nền tảng tích hợp QG | Kết nối C12, CSDL an sinh xã hội |  |  |  |  |  |
| VNeID (BCA) | Xác thực SSO | Xác thực tài khoản người dùng đăng nhập hệ thống TGPL |  |  |  |  |  |

