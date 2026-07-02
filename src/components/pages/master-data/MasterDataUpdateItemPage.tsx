import { useState } from 'react';
import { Search, Filter, Upload, Download, Send, Eye, Clock, CheckCircle2, XCircle, Globe } from 'lucide-react';

type ApprovalStatus = 'approved' | 'pending' | 'rejected';
type PublicStatus = 'published' | 'unpublished';
type DataCategory = 'enforcement' | 'civil-registry' | 'nationality' | 'individual' | 'organization' | 'legal-aid-object' | 'asset';

interface ColDef { key: string; label: string }

interface ItemConfig {
  category: DataCategory;
  unit: string;
  system: string;
  idLabel: string;
}

// ─── Config per master data ID ────────────────────────────────────────────────

const ITEM_CONFIGS: Record<string, ItemConfig> = {
  'md-001': { category: 'enforcement',       unit: 'Cục Quản lý thi hành án dân sự',                     system: 'Nền tảng số THADS',                           idLabel: 'Số quyết định' },
  'md-002': { category: 'civil-registry',    unit: 'Cục Hành chính tư pháp',                             system: 'CSDL hộ tịch điện tử',                        idLabel: 'Số đăng ký khai sinh' },
  'md-003': { category: 'civil-registry',    unit: 'Cục Hành chính tư pháp',                             system: 'CSDL hộ tịch điện tử',                        idLabel: 'Số đăng ký khai tử' },
  'md-004': { category: 'civil-registry',    unit: 'Cục Hành chính tư pháp',                             system: 'CSDL hộ tịch điện tử',                        idLabel: 'Số đăng ký kết hôn' },
  'md-005': { category: 'civil-registry',    unit: 'Cục Hành chính tư pháp',                             system: 'CSDL hộ tịch điện tử',                        idLabel: 'Số xác nhận' },
  'md-006': { category: 'civil-registry',    unit: 'Cục Hành chính tư pháp',                             system: 'CSDL hộ tịch điện tử',                        idLabel: 'Số đăng ký' },
  'md-007': { category: 'civil-registry',    unit: 'Cục Hành chính tư pháp',                             system: 'CSDL hộ tịch điện tử',                        idLabel: 'Số đăng ký CC' },
  'md-008': { category: 'civil-registry',    unit: 'Cục Hành chính tư pháp',                             system: 'CSDL hộ tịch điện tử',                        idLabel: 'Số đăng ký GH' },
  'md-009': { category: 'civil-registry',    unit: 'Cục Hành chính tư pháp',                             system: 'CSDL hộ tịch điện tử',                        idLabel: 'Số ghi chú LH' },
  'md-010': { category: 'civil-registry',    unit: 'Cục Hành chính tư pháp',                             system: 'CSDL hộ tịch điện tử',                        idLabel: 'Số đăng ký NCN' },
  'md-011': { category: 'nationality',       unit: 'Cục Hành chính tư pháp',                             system: 'CSDL quốc tịch',                              idLabel: 'Số ký hiệu QĐ nhập' },
  'md-012': { category: 'nationality',       unit: 'Cục Hành chính tư pháp',                             system: 'CSDL quốc tịch',                              idLabel: 'Số ký hiệu QĐ thôi' },
  'md-013': { category: 'nationality',       unit: 'Cục Hành chính tư pháp',                             system: 'CSDL quốc tịch',                              idLabel: 'Số ký hiệu QĐ trở lại' },
  'md-014': { category: 'nationality',       unit: 'Cục Hành chính tư pháp',                             system: 'CSDL quốc tịch',                              idLabel: 'Số ký hiệu QĐ tước' },
  'md-015': { category: 'individual',        unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã hành nghề' },
  'md-016': { category: 'individual',        unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã thẻ TVPPL' },
  'md-017': { category: 'individual',        unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã công chứng viên' },
  'md-018': { category: 'individual',        unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã quản tài viên' },
  'md-019': { category: 'individual',        unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã đấu giá viên' },
  'md-020': { category: 'individual',        unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã giám định viên' },
  'md-021': { category: 'individual',        unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã trọng tài viên' },
  'md-022': { category: 'individual',        unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã hòa giải viên' },
  'md-023': { category: 'organization',      unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã tổ chức' },
  'md-024': { category: 'organization',      unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã tổ chức NN' },
  'md-025': { category: 'organization',      unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã trung tâm' },
  'md-026': { category: 'organization',      unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã tổ chức CC' },
  'md-027': { category: 'organization',      unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã doanh nghiệp' },
  'md-028': { category: 'organization',      unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã tổ chức ĐG' },
  'md-029': { category: 'organization',      unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã tổ chức GĐ' },
  'md-030': { category: 'organization',      unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã trung tâm HG' },
  'md-031': { category: 'organization',      unit: 'Cục Bổ trợ tư pháp',                                 system: 'Phần mềm quản lý bổ trợ tư pháp',             idLabel: 'Mã trung tâm TT' },
  'md-032': { category: 'individual',        unit: 'Cục Phổ biến, GDPL và Trợ giúp pháp lý',             system: 'CSDL phổ biến, GDPL và hòa giải cơ sở',       idLabel: 'Số QĐ công nhận' },
  'md-033': { category: 'individual',        unit: 'Cục Phổ biến, GDPL và Trợ giúp pháp lý',             system: 'CSDL phổ biến, GDPL và hòa giải cơ sở',       idLabel: 'Số QĐ công nhận' },
  'md-034': { category: 'individual',        unit: 'Cục Phổ biến, GDPL và Trợ giúp pháp lý',             system: 'CSDL phổ biến, GDPL và hòa giải cơ sở',       idLabel: 'Số QĐ công nhận' },
  'md-035': { category: 'legal-aid-object',  unit: 'Cục Phổ biến, GDPL và Trợ giúp pháp lý',             system: 'Hệ thống thông tin trợ giúp pháp lý',          idLabel: 'Mã định danh' },
  'md-036': { category: 'organization',      unit: 'Cục Phổ biến, GDPL và Trợ giúp pháp lý',             system: 'Hệ thống thông tin trợ giúp pháp lý',          idLabel: 'Mã định danh tổ chức' },
  'md-037': { category: 'individual',        unit: 'Cục Phổ biến, GDPL và Trợ giúp pháp lý',             system: 'Hệ thống thông tin trợ giúp pháp lý',          idLabel: 'Số giấy phép/chứng chỉ' },
  'md-038': { category: 'asset',             unit: 'Cục Đăng ký giao dịch bảo đảm và Bồi thường nhà nước', system: 'Hệ thống thông tin giao dịch bảo đảm',       idLabel: 'Số định danh tài sản' },
};

// ─── Column definitions per category ─────────────────────────────────────────

const COLUMNS: Record<DataCategory, ColDef[]> = {
  'enforcement': [
    { key: 'ma',          label: 'Số quyết định' },
    { key: 'ngayBanHanh', label: 'Ngày ban hành' },
    { key: 'hoTen',       label: 'Họ tên đương sự' },
    { key: 'cccd',        label: 'CCCD/Hộ chiếu' },
    { key: 'nghiaVu',     label: 'Nghĩa vụ THA' },
    { key: 'coQuan',      label: 'Cơ quan ra QĐ' },
  ],
  'civil-registry': [
    { key: 'ma',          label: 'Số đăng ký' },
    { key: 'ngayDangKy',  label: 'Ngày đăng ký' },
    { key: 'noiDangKy',   label: 'Nơi đăng ký' },
    { key: 'hoTen',       label: 'Họ tên' },
    { key: 'ngaySinh',    label: 'Ngày sinh' },
    { key: 'quocTich',    label: 'Quốc tịch' },
  ],
  'nationality': [
    { key: 'ma',           label: 'Số ký hiệu QĐ' },
    { key: 'hoTen',        label: 'Họ và tên' },
    { key: 'ngaySinh',     label: 'Ngày sinh' },
    { key: 'noiSinh',      label: 'Nơi sinh' },
    { key: 'gioiTinh',     label: 'Giới tính' },
    { key: 'ngayQuyetDinh',label: 'Ngày QĐ CTN' },
  ],
  'individual': [
    { key: 'ma',      label: 'Mã định danh' },
    { key: 'hoTen',   label: 'Họ và tên' },
    { key: 'ngaySinh',label: 'Ngày sinh' },
    { key: 'cccd',    label: 'CCCD' },
    { key: 'chucDanh',label: 'Chức danh' },
    { key: 'soCCHN',  label: 'Số CCHN/Thẻ' },
    { key: 'linhVuc', label: 'Lĩnh vực' },
  ],
  'organization': [
    { key: 'ma',           label: 'Mã tổ chức' },
    { key: 'tenTochuc',    label: 'Tên tổ chức' },
    { key: 'loaiHinh',     label: 'Loại hình' },
    { key: 'soDKHD',       label: 'Số đăng ký HĐ' },
    { key: 'diaChi',       label: 'Địa chỉ trụ sở' },
    { key: 'nguoiDaiDien', label: 'Người đại diện' },
  ],
  'legal-aid-object': [
    { key: 'ma',       label: 'Mã định danh' },
    { key: 'loai',     label: 'Loại đối tượng' },
    { key: 'cccd',     label: 'CCCD/Hộ chiếu' },
    { key: 'hoTen',    label: 'Họ và tên' },
    { key: 'dienTGPL', label: 'Diện TGPL' },
    { key: 'tinh',     label: 'Tỉnh/Thành phố' },
  ],
  'asset': [
    { key: 'ma',         label: 'Số định danh TS' },
    { key: 'maHopDong',  label: 'Mã hợp đồng' },
    { key: 'hieuluc',    label: 'Hiệu lực HĐ' },
    { key: 'soGCN',      label: 'Số GCN sở hữu' },
    { key: 'loaiTaiSan', label: 'Loại tài sản' },
    { key: 'benBaoDam',  label: 'Bên bảo đảm' },
  ],
};

// ─── Mock data per category ───────────────────────────────────────────────────

type Row = Record<string, string> & { id: string; approvalStatus: ApprovalStatus; publicStatus: PublicStatus };

const MOCK_ENFORCEMENT: Row[] = [
  { id: '1', ma: 'QĐ-THADS-2026-00156', ngayBanHanh: '15/01/2026', hoTen: 'Nguyễn Văn Anh',   cccd: '001234567890', nghiaVu: 'Bồi thường 250.000.000đ',              coQuan: 'Cục THADS TP. Hà Nội',          approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: 'QĐ-THADS-2026-00287', ngayBanHanh: '22/02/2026', hoTen: 'Trần Thị Bình',    cccd: '079199001234', nghiaVu: 'Phạt cải tạo không giam giữ 12 tháng',  coQuan: 'Chi Cục THADS Q.1 TP.HCM',      approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '3', ma: 'QĐ-THADS-2025-08456', ngayBanHanh: '10/11/2025', hoTen: 'Lê Minh Cường',    cccd: '036087003456', nghiaVu: 'Trả nợ 180.000.000đ và lãi suất',       coQuan: 'Cục THADS TP. Đà Nẵng',         approvalStatus: 'approved', publicStatus: 'published' },
  { id: '4', ma: 'QĐ-THADS-2026-00401', ngayBanHanh: '05/03/2026', hoTen: 'Phạm Quốc Dũng',   cccd: '031075004567', nghiaVu: 'Giao nộp tài sản theo bản án số 12/2025', coQuan: 'Chi Cục THADS TP. Cần Thơ',     approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '5', ma: 'QĐ-THADS-2026-00512', ngayBanHanh: '15/04/2026', hoTen: 'Hoàng Thị Lan',    cccd: '038079005678', nghiaVu: 'Bồi thường thiệt hại 75.000.000đ',       coQuan: 'Chi Cục THADS Q. Hải An, HN',  approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '6', ma: 'QĐ-THADS-2026-00623', ngayBanHanh: '28/05/2026', hoTen: 'Vũ Đức Thắng',     cccd: '026068006789', nghiaVu: 'Nộp tiền phạt 50.000.000đ',               coQuan: 'Chi Cục THADS Q. Sơn Trà, ĐN', approvalStatus: 'approved', publicStatus: 'published' },
];

const MOCK_CIVIL_REGISTRY: Row[] = [
  { id: '1', ma: '01/2026/ĐKKS',   ngayDangKy: '02/01/2026', noiDangKy: 'UBND P. Hàng Bông, HN',       hoTen: 'Trần Minh Khoa',    ngaySinh: '01/01/2026', quocTich: 'Việt Nam', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: '124/2026/ĐKKS',  ngayDangKy: '15/02/2026', noiDangKy: 'UBND P. Tân Định, TP.HCM',    hoTen: 'Nguyễn Thị Thu',    ngaySinh: '14/02/2026', quocTich: 'Việt Nam', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: '2847/2025/ĐKKS', ngayDangKy: '10/12/2025', noiDangKy: 'UBND P. Hải Châu 1, ĐN',      hoTen: 'Lê Gia Bảo',        ngaySinh: '08/12/2025', quocTich: 'Việt Nam', approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: '298/2026/ĐKKS',  ngayDangKy: '05/03/2026', noiDangKy: 'UBND P. Lê Chân, Hải Phòng',  hoTen: 'Phạm Nhật Minh',    ngaySinh: '03/03/2026', quocTich: 'Việt Nam', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '5', ma: '401/2026/ĐKKS',  ngayDangKy: '20/04/2026', noiDangKy: 'UBND P. An Hòa, Cần Thơ',     hoTen: 'Đinh Thị Yến Nhi',  ngaySinh: '18/04/2026', quocTich: 'Việt Nam', approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '6', ma: '512/2026/ĐKKS',  ngayDangKy: '10/05/2026', noiDangKy: 'UBND P. Vĩnh Phú, Bình Dương', hoTen: 'Trần Bình An',      ngaySinh: '08/05/2026', quocTich: 'Việt Nam', approvalStatus: 'rejected', publicStatus: 'unpublished' },
];

const MOCK_NATIONALITY: Row[] = [
  { id: '1', ma: '385/QĐ-CTN-2025', hoTen: 'Nguyễn Thị Hương',    ngaySinh: '15/05/1985', noiSinh: 'Hà Nội',        gioiTinh: 'Nữ',  ngayQuyetDinh: '20/08/2025', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: '112/QĐ-CTN-2026', hoTen: 'Lê Quang Minh',        ngaySinh: '10/03/1990', noiSinh: 'TP.HCM',        gioiTinh: 'Nam', ngayQuyetDinh: '15/02/2026', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: '047/QĐ-CTN-2026', hoTen: 'Trần Thị Mai Ly',      ngaySinh: '22/11/1978', noiSinh: 'Đà Nẵng',       gioiTinh: 'Nữ',  ngayQuyetDinh: '10/01/2026', approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: '198/QĐ-CTN-2025', hoTen: 'Phạm Văn Tùng',        ngaySinh: '08/07/1965', noiSinh: 'Nghệ An',       gioiTinh: 'Nam', ngayQuyetDinh: '05/05/2025', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '5', ma: '256/QĐ-CTN-2026', hoTen: 'Hoàng Thị Bích Ngọc',  ngaySinh: '30/01/1992', noiSinh: 'Hải Phòng',     gioiTinh: 'Nữ',  ngayQuyetDinh: '28/03/2026', approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '6', ma: '311/QĐ-CTN-2026', hoTen: 'Vũ Đình Khương',        ngaySinh: '14/09/1988', noiSinh: 'Bắc Ninh',      gioiTinh: 'Nam', ngayQuyetDinh: '15/04/2026', approvalStatus: 'pending',  publicStatus: 'unpublished' },
];

const MOCK_INDIVIDUAL: Row[] = [
  { id: '1', ma: 'HN-LS-2019-00145',  hoTen: 'Nguyễn Thanh Hải',   ngaySinh: '15/04/1978', cccd: '001078001234', chucDanh: 'Luật sư',         soCCHN: 'CCHN-LS-0012345', linhVuc: 'Dân sự, Hình sự',       approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: 'HCM-LS-2020-00892', hoTen: 'Trần Minh Phúc',      ngaySinh: '22/08/1982', cccd: '079082002345', chucDanh: 'Luật sư',         soCCHN: 'CCHN-LS-0023456', linhVuc: 'Kinh doanh thương mại', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: 'DN-CC-2021-00234',  hoTen: 'Lê Thị Thu Hà',       ngaySinh: '10/12/1985', cccd: '048085003456', chucDanh: 'Công chứng viên', soCCHN: 'CCHN-CC-0034567', linhVuc: 'Công chứng',            approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: 'HN-DGV-2018-00067', hoTen: 'Phạm Xuân Long',      ngaySinh: '05/03/1975', cccd: '001075004567', chucDanh: 'Đấu giá viên',    soCCHN: 'CCHN-DG-0045678', linhVuc: 'Đấu giá tài sản',      approvalStatus: 'approved', publicStatus: 'published' },
  { id: '5', ma: 'HP-QTV-2022-00189', hoTen: 'Hoàng Văn Bình',      ngaySinh: '18/06/1980', cccd: '031080005678', chucDanh: 'Quản tài viên',   soCCHN: 'CCHN-QT-0056789', linhVuc: 'Quản lý, thanh lý TS',  approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '6', ma: 'CT-GDVTP-2020-0045',hoTen: 'Vũ Thị Ngọc Lan',     ngaySinh: '27/09/1988', cccd: '087088006789', chucDanh: 'Giám định viên',  soCCHN: 'CCHN-GD-0067890', linhVuc: 'Tài chính kế toán',     approvalStatus: 'pending',  publicStatus: 'unpublished' },
];

const MOCK_ORGANIZATION: Row[] = [
  { id: '1', ma: 'TC-LS-HN-0001',  tenTochuc: 'Công ty Luật TNHH Việt Phát',              loaiHinh: 'Công ty TNHH',     soDKHD: '01012345/TP/ĐKHĐ-LS', diaChi: '12 Lý Thường Kiệt, Q. Hoàn Kiếm, HN',  nguoiDaiDien: 'Nguyễn Văn Thành', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: 'TC-LS-HCM-0089', tenTochuc: 'Văn phòng Luật sư An Phước',                loaiHinh: 'Văn phòng LS',     soDKHD: '01098765/TP/ĐKHĐ-LS', diaChi: '25 Nguyễn Thị Minh Khai, Q.1, TP.HCM',  nguoiDaiDien: 'Trần Công Minh',   approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: 'TC-CC-DN-0024',  tenTochuc: 'Văn phòng Công chứng Đà Nẵng',              loaiHinh: 'Văn phòng CC',     soDKHD: '02024680/TP/ĐKHĐ-CC', diaChi: '78 Trần Phú, Q. Hải Châu, ĐN',          nguoiDaiDien: 'Lê Thị Hồng',      approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: 'TC-DG-HP-0015',  tenTochuc: 'Công ty Đấu giá Hợp danh Hải Phòng',        loaiHinh: 'Công ty HD',       soDKHD: '03012345/TP/ĐKHĐ-DG', diaChi: '45 Điện Biên Phủ, Q. Lê Chân, HP',      nguoiDaiDien: 'Phạm Đức Hùng',    approvalStatus: 'approved', publicStatus: 'published' },
  { id: '5', ma: 'TC-GD-HN-0008',  tenTochuc: 'Trung tâm Giám định Tư pháp Hà Nội',        loaiHinh: 'Trung tâm',        soDKHD: '04098765/TP/ĐKHĐ-GĐ', diaChi: '101 Trần Hưng Đạo, Q. Hoàn Kiếm, HN',  nguoiDaiDien: 'Hoàng Minh Tuấn',  approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '6', ma: 'TC-TT-HCM-0032', tenTochuc: 'Trung tâm Trọng tài Thương mại Phía Nam',   loaiHinh: 'Trung tâm',        soDKHD: '05024680/TP/ĐKHĐ-TT', diaChi: '200 Lê Lai, Q.1, TP.HCM',               nguoiDaiDien: 'Vũ Quang Huy',     approvalStatus: 'pending',  publicStatus: 'unpublished' },
];

const MOCK_LEGAL_AID_OBJECT: Row[] = [
  { id: '1', ma: 'TGPL-DN-2026-001234', loai: 'Người có công',      cccd: '001078001234', hoTen: 'Nguyễn Thị Bích',     dienTGPL: 'Thương binh hạng 2/4', tinh: 'Hà Nội',     approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: 'TGPL-DN-2026-002345', loai: 'Hộ nghèo',           cccd: '079090002345', hoTen: 'Trần Văn Đức',         dienTGPL: 'Hộ nghèo theo QĐ',     tinh: 'TP.HCM',     approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: 'TGPL-DN-2025-098765', loai: 'Người dân tộc thiểu số', cccd: '038059003456', hoTen: 'Lý Thị Mai',      dienTGPL: 'DTTS cư trú vùng KK',  tinh: 'Đà Nẵng',    approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: 'TGPL-DN-2026-003456', loai: 'Người cao tuổi',     cccd: '031040004567', hoTen: 'Phạm Văn Cương',       dienTGPL: 'Trên 80 tuổi không lương', tinh: 'Hải Phòng', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '5', ma: 'TGPL-DN-2026-004567', loai: 'Người khuyết tật',   cccd: '087072005678', hoTen: 'Hoàng Thị Linh',       dienTGPL: 'KT nặng theo hồ sơ',   tinh: 'Cần Thơ',    approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '6', ma: 'TGPL-DN-2026-005678', loai: 'Trẻ em',             cccd: '001018006789', hoTen: 'Vũ Minh Quân',          dienTGPL: 'Trẻ em (dưới 16 tuổi)', tinh: 'Bình Dương', approvalStatus: 'pending',  publicStatus: 'unpublished' },
];

const MOCK_ASSET: Row[] = [
  { id: '1', ma: 'TS-2026-000145', maHopDong: 'HĐ-TC-2026-001234', hieuluc: '01/01/2026 – 01/01/2031', soGCN: 'GCN-QSD-001234567', loaiTaiSan: 'Quyền sử dụng đất',    benBaoDam: 'Nguyễn Văn Hùng',    approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: 'TS-2026-000287', maHopDong: 'HĐ-TC-2026-002345', hieuluc: '15/02/2026 – 15/02/2029', soGCN: 'GCN-PT-002345678',  loaiTaiSan: 'Phương tiện ô tô',     benBaoDam: 'Trần Thị Phương',    approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: 'TS-2025-008456', maHopDong: 'HĐ-TC-2025-003456', hieuluc: '20/11/2025 – 20/11/2028', soGCN: 'GCN-SHNO-003456789',loaiTaiSan: 'Nhà ở',                benBaoDam: 'Lê Minh Đức',         approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: 'TS-2026-000401', maHopDong: 'HĐ-TC-2026-004567', hieuluc: '10/03/2026 – 10/03/2030', soGCN: 'GCN-MMTB-004567890',loaiTaiSan: 'Máy móc thiết bị',     benBaoDam: 'Phạm Quốc Khánh',    approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '5', ma: 'TS-2026-000512', maHopDong: 'HĐ-TC-2026-005678', hieuluc: '25/04/2026 – 25/04/2028', soGCN: 'GCN-HHDV-005678901',loaiTaiSan: 'Hàng hóa trong kho',   benBaoDam: 'Hoàng Đức Lân',      approvalStatus: 'approved', publicStatus: 'published' },
  { id: '6', ma: 'TS-2026-000623', maHopDong: 'HĐ-TC-2026-006789', hieuluc: '05/06/2026 – 05/06/2029', soGCN: 'GCN-QSD-006789012', loaiTaiSan: 'Tài sản hình thành trong tương lai', benBaoDam: 'Vũ Thị Hà',  approvalStatus: 'pending',  publicStatus: 'unpublished' },
];

const MOCK_BY_CATEGORY: Record<DataCategory, Row[]> = {
  'enforcement':       MOCK_ENFORCEMENT,
  'civil-registry':    MOCK_CIVIL_REGISTRY,
  'nationality':       MOCK_NATIONALITY,
  'individual':        MOCK_INDIVIDUAL,
  'organization':      MOCK_ORGANIZATION,
  'legal-aid-object':  MOCK_LEGAL_AID_OBJECT,
  'asset':             MOCK_ASSET,
};

// For civil registry items, prefix the maDangKy based on the specific type
const CIVIL_REGISTRY_PREFIXES: Record<string, string> = {
  'md-002': 'KS',   // khai sinh
  'md-003': 'KT',   // khai tử
  'md-004': 'KH',   // kết hôn
  'md-005': 'HN',   // hôn nhân
  'md-006': 'CMC',  // cha mẹ con
  'md-007': 'CC',   // cải chính
  'md-008': 'GH',   // giám hộ
  'md-009': 'LH',   // ly hôn
  'md-010': 'NCN',  // nuôi con nuôi
};

function getMockData(masterId: string, category: DataCategory): Row[] {
  const base = MOCK_BY_CATEGORY[category];
  if (category === 'civil-registry') {
    const prefix = CIVIL_REGISTRY_PREFIXES[masterId] || 'HT';
    return base.map(r => ({ ...r, ma: r.ma.replace(/ĐKKS|KS|KT|KH|HN|CMC|CC|GH|LH|NCN/, prefix) }));
  }
  return base;
}

// ─── Status badges ────────────────────────────────────────────────────────────

function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  if (status === 'approved')
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700">Đã phê duyệt</span>;
  if (status === 'pending')
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-yellow-100 text-yellow-700">Chờ phê duyệt</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-100 text-red-700">Từ chối</span>;
}

function PublicBadge({ status }: { status: PublicStatus }) {
  if (status === 'published')
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">Đã công khai</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">Chưa công khai</span>;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  masterId: string;
  masterLabel: string;
}

export function MasterDataUpdateItemPage({ masterId, masterLabel }: Props) {
  const [activeTab, setActiveTab] = useState<'list' | 'approval' | 'history'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const config = ITEM_CONFIGS[masterId] || { category: 'individual' as DataCategory, unit: '—', system: '—', idLabel: 'Mã' };
  const allData = getMockData(masterId, config.category);
  const cols = COLUMNS[config.category];

  const listData = allData.filter(r => {
    if (!searchQuery) return true;
    return Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const pendingData = allData.filter(r => r.approvalStatus === 'pending');

  const stats = {
    total:     allData.length,
    approved:  allData.filter(r => r.approvalStatus === 'approved').length,
    pending:   allData.filter(r => r.approvalStatus === 'pending').length,
    published: allData.filter(r => r.publicStatus === 'published').length,
  };

  const tabs = [
    { id: 'list',     label: 'Danh sách dữ liệu', icon: '≡' },
    { id: 'approval', label: 'Chờ phê duyệt',      icon: '⏳' },
    { id: 'history',  label: 'Lịch sử xử lý',      icon: '🕓' },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
        <h2 className="text-[16px] font-semibold text-slate-900">{masterLabel}</h2>
        <p className="text-[12px] text-slate-500 mt-0.5">{config.unit} &bull; {config.system}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">Tổng bản ghi</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
        </div>
        <div className="bg-white border border-green-200 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-green-600 font-medium uppercase tracking-wide">Đã phê duyệt</div>
          <div className="text-2xl font-bold text-green-700 mt-1">{stats.approved}</div>
        </div>
        <div className="bg-white border border-yellow-200 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-yellow-600 font-medium uppercase tracking-wide">Chờ phê duyệt</div>
          <div className="text-2xl font-bold text-yellow-700 mt-1">{stats.pending}</div>
        </div>
        <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-blue-600 font-medium uppercase tracking-wide">Đã công khai</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{stats.published}</div>
        </div>
      </div>

      {/* Tabs + Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Tab bar */}
        <div className="border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 pb-3 pt-4 px-3 border-b-2 text-[13px] transition-colors ${
                  activeTab === t.id
                    ? 'border-blue-600 text-blue-600 font-medium'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {t.label}
                {t.id === 'approval' && stats.pending > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-yellow-100 text-yellow-700 rounded-full">
                    {stats.pending}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === 'list' && (
            <div className="flex items-center gap-2 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-48 pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">
                <Filter className="w-3.5 h-3.5" />
                Lọc
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">
                <Upload className="w-3.5 h-3.5" />
                Nhập
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-[12px] hover:bg-green-700">
                <Download className="w-3.5 h-3.5" />
                Xuất
              </button>
            </div>
          )}
        </div>

        {/* Table - Danh sách */}
        {activeTab === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {cols.map(col => (
                    <th key={col.key} className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Phê duyệt</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Công khai</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listData.map(row => (
                  <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    {cols.map(col => (
                      <td key={col.key} className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap max-w-[200px] truncate">
                        {row[col.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4"><ApprovalBadge status={row.approvalStatus} /></td>
                    <td className="px-6 py-4"><PublicBadge status={row.publicStatus} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Xem chi tiết">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {row.approvalStatus !== 'approved' && (
                          <button className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Trình duyệt">
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {row.publicStatus !== 'published' && row.approvalStatus === 'approved' && (
                          <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Công khai">
                            <Globe className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {listData.length === 0 && (
                  <tr>
                    <td colSpan={cols.length + 3} className="px-6 py-16 text-center text-[13px] text-slate-400">
                      Không tìm thấy dữ liệu phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Table - Chờ phê duyệt */}
        {activeTab === 'approval' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {cols.map(col => (
                    <th key={col.key} className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pendingData.map(row => (
                  <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    {cols.map(col => (
                      <td key={col.key} className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap max-w-[200px] truncate">
                        {row[col.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-[12px] hover:bg-green-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Phê duyệt
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-[12px] hover:bg-red-700">
                          <XCircle className="w-3.5 h-3.5" />
                          Từ chối
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingData.length === 0 && (
                  <tr>
                    <td colSpan={cols.length + 1} className="px-6 py-16 text-center">
                      <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-[13px] text-slate-400">Không có bản ghi nào chờ phê duyệt</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* History tab */}
        {activeTab === 'history' && (
          <div className="p-6">
            <div className="space-y-3">
              {[
                { date: '02/07/2026 09:12', user: 'Nguyễn Thanh Hải', action: 'Phê duyệt',   count: 2, color: 'text-green-600 bg-green-50' },
                { date: '01/07/2026 16:45', user: 'Trần Minh Phúc',    action: 'Gửi duyệt',  count: 3, color: 'text-blue-600 bg-blue-50' },
                { date: '30/06/2026 14:23', user: 'Hệ thống',           action: 'Nhập dữ liệu', count: 6, color: 'text-slate-600 bg-slate-100' },
                { date: '28/06/2026 10:08', user: 'Lê Thị Thu Hà',     action: 'Từ chối',    count: 1, color: 'text-red-600 bg-red-50' },
                { date: '25/06/2026 08:30', user: 'Phạm Xuân Long',    action: 'Công khai',  count: 2, color: 'text-indigo-600 bg-indigo-50' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[12px] text-slate-400 whitespace-nowrap w-36">{item.date}</div>
                  <div className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${item.color}`}>
                    {item.action}
                  </div>
                  <div className="text-[13px] text-slate-700">
                    <span className="font-medium">{item.user}</span> — {item.action.toLowerCase()} {item.count} bản ghi
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {activeTab !== 'history' && (
          <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[12px] text-slate-500">
              Hiển thị {activeTab === 'list' ? listData.length : pendingData.length} bản ghi
            </span>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Trước</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[12px]">1</button>
              <button className="px-3 py-1 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Sau</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
