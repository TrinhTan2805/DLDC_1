import { useState } from 'react';
import { Search, Filter, Upload, Download, Send, Eye, Clock, CheckCircle2, XCircle, Globe, List, Lock, Check, Edit2, Copy, AlertTriangle, X } from 'lucide-react';

type ApprovalStatus = 'reviewing' | 'pending' | 'approved' | 'rejected';
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
  { id: '2', ma: 'QĐ-THADS-2026-00287', ngayBanHanh: '22/02/2026', hoTen: 'Nguyễn Văn Anh',   cccd: '079199001234', nghiaVu: 'Phạt cải tạo không giam giữ 12 tháng',  coQuan: '',                              approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '3', ma: 'QĐ-THADS-2025-08456', ngayBanHanh: '10/11/2025', hoTen: 'Lê Minh Cường',    cccd: '036087003456', nghiaVu: 'Trả nợ 180.000.000đ và lãi suất',       coQuan: 'Cục THADS TP. Đà Nẵng',         approvalStatus: 'approved', publicStatus: 'published' },
  { id: '4', ma: 'QĐ-THADS-2026-00401', ngayBanHanh: '05/03/2026', hoTen: 'Phạm Quốc Dũng',   cccd: '031075004567', nghiaVu: 'Giao nộp tài sản theo bản án số 12/2025', coQuan: 'Chi Cục THADS TP. Cần Thơ',     approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '5', ma: 'QĐ-THADS-2026-00512', ngayBanHanh: '15/04/2026', hoTen: 'Hoàng Thị Lan',    cccd: '038079005678', nghiaVu: 'Bồi thường thiệt hại 75.000.000đ',       coQuan: 'Chi Cục THADS Q. Hải An, HN',  approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '6', ma: 'QĐ-THADS-2026-00623', ngayBanHanh: '28/05/2026', hoTen: 'Vũ Đức Thắng',     cccd: '026068006789', nghiaVu: 'Nộp tiền phạt 50.000.000đ',               coQuan: 'Chi Cục THADS Q. Sơn Trà, ĐN', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '7', ma: 'QĐ-THADS-2026-00734', ngayBanHanh: '02/06/2026', hoTen: 'Đặng Thị Kim Oanh', cccd: '034082007890', nghiaVu: 'Bồi thường 45.000.000đ',                  coQuan: 'Chi Cục THADS Q. Cầu Giấy, HN', approvalStatus: 'reviewing', publicStatus: 'unpublished' },
];

const MOCK_CIVIL_REGISTRY: Row[] = [
  { id: '1', ma: '01/2026/ĐKKS',   ngayDangKy: '02/01/2026', noiDangKy: 'UBND P. Hàng Bông, HN',       hoTen: 'Trần Minh Khoa',    ngaySinh: '01/01/2026', quocTich: 'Việt Nam', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: '124/2026/ĐKKS',  ngayDangKy: '15/02/2026', noiDangKy: '',                            hoTen: 'Trần Minh Khoa',    ngaySinh: '14/02/2026', quocTich: 'Việt Nam', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: '2847/2025/ĐKKS', ngayDangKy: '10/12/2025', noiDangKy: 'UBND P. Hải Châu 1, ĐN',      hoTen: 'Lê Gia Bảo',        ngaySinh: '08/12/2025', quocTich: 'Việt Nam', approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: '298/2026/ĐKKS',  ngayDangKy: '05/03/2026', noiDangKy: 'UBND P. Lê Chân, Hải Phòng',  hoTen: 'Phạm Nhật Minh',    ngaySinh: '03/03/2026', quocTich: 'Việt Nam', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '5', ma: '401/2026/ĐKKS',  ngayDangKy: '20/04/2026', noiDangKy: 'UBND P. An Hòa, Cần Thơ',     hoTen: 'Đinh Thị Yến Nhi',  ngaySinh: '18/04/2026', quocTich: 'Việt Nam', approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '6', ma: '512/2026/ĐKKS',  ngayDangKy: '10/05/2026', noiDangKy: 'UBND P. Vĩnh Phú, Bình Dương', hoTen: 'Trần Bình An',      ngaySinh: '08/05/2026', quocTich: 'Việt Nam', approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '7', ma: '099/2026/ĐKKS',  ngayDangKy: '12/05/2026', noiDangKy: 'UBND P. Cầu Giấy, HN',        hoTen: 'Bùi Văn Sơn',       ngaySinh: '01/01/2026', quocTich: 'Việt Nam', approvalStatus: 'reviewing', publicStatus: 'unpublished' },
];

const MOCK_NATIONALITY: Row[] = [
  { id: '1', ma: '385/QĐ-CTN-2025', hoTen: 'Nguyễn Thị Hương',    ngaySinh: '15/05/1985', noiSinh: 'Hà Nội',        gioiTinh: 'Nữ',  ngayQuyetDinh: '20/08/2025', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: '112/QĐ-CTN-2026', hoTen: 'Nguyễn Thị Hương',     ngaySinh: '10/03/1990', noiSinh: '',              gioiTinh: 'Nam', ngayQuyetDinh: '15/02/2026', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: '047/QĐ-CTN-2026', hoTen: 'Trần Thị Mai Ly',      ngaySinh: '22/11/1978', noiSinh: 'Đà Nẵng',       gioiTinh: 'Nữ',  ngayQuyetDinh: '10/01/2026', approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: '198/QĐ-CTN-2025', hoTen: 'Phạm Văn Tùng',        ngaySinh: '08/07/1965', noiSinh: 'Nghệ An',       gioiTinh: 'Nam', ngayQuyetDinh: '05/05/2025', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '5', ma: '256/QĐ-CTN-2026', hoTen: 'Hoàng Thị Bích Ngọc',  ngaySinh: '30/01/1992', noiSinh: 'Hải Phòng',     gioiTinh: 'Nữ',  ngayQuyetDinh: '28/03/2026', approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '6', ma: '311/QĐ-CTN-2026', hoTen: 'Vũ Đình Khương',        ngaySinh: '14/09/1988', noiSinh: 'Bắc Ninh',      gioiTinh: 'Nam', ngayQuyetDinh: '15/04/2026', approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '7', ma: '289/QĐ-CTN-2026', hoTen: 'Đỗ Thị Thanh Huyền',    ngaySinh: '02/02/1995', noiSinh: 'Thanh Hóa',     gioiTinh: 'Nữ',  ngayQuyetDinh: '10/06/2026', approvalStatus: 'reviewing', publicStatus: 'unpublished' },
];

const MOCK_INDIVIDUAL: Row[] = [
  { id: '1', ma: 'HN-LS-2019-00145',  hoTen: 'Nguyễn Thanh Hải',   ngaySinh: '15/04/1978', cccd: '001078001234', chucDanh: 'Luật sư',         soCCHN: 'CCHN-LS-0012345', linhVuc: 'Dân sự, Hình sự',       approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: 'HCM-LS-2020-00892', hoTen: 'Nguyễn Thanh Hải',    ngaySinh: '22/08/1982', cccd: '079082002345', chucDanh: 'Luật sư',         soCCHN: '',                linhVuc: 'Kinh doanh thương mại', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: 'DN-CC-2021-00234',  hoTen: 'Lê Thị Thu Hà',       ngaySinh: '10/12/1985', cccd: '048085003456', chucDanh: 'Công chứng viên', soCCHN: 'CCHN-CC-0034567', linhVuc: 'Công chứng',            approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: 'HN-DGV-2018-00067', hoTen: 'Phạm Xuân Long',      ngaySinh: '05/03/1975', cccd: '001075004567', chucDanh: 'Đấu giá viên',    soCCHN: 'CCHN-DG-0045678', linhVuc: 'Đấu giá tài sản',      approvalStatus: 'approved', publicStatus: 'published' },
  { id: '5', ma: 'HP-QTV-2022-00189', hoTen: 'Hoàng Văn Bình',      ngaySinh: '18/06/1980', cccd: '031080005678', chucDanh: 'Quản tài viên',   soCCHN: 'CCHN-QT-0056789', linhVuc: 'Quản lý, thanh lý TS',  approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '6', ma: 'CT-GDVTP-2020-0045',hoTen: 'Vũ Thị Ngọc Lan',     ngaySinh: '27/09/1988', cccd: '087088006789', chucDanh: 'Giám định viên',  soCCHN: 'CCHN-GD-0067890', linhVuc: 'Tài chính kế toán',     approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '7', ma: 'HN-LS-2026-00312',  hoTen: 'Ngô Thanh Sơn',       ngaySinh: '30/01/1990', cccd: '001090008901', chucDanh: 'Luật sư',         soCCHN: 'CCHN-LS-0078901', linhVuc: 'Dân sự',                approvalStatus: 'reviewing', publicStatus: 'unpublished' },
];

const MOCK_ORGANIZATION: Row[] = [
  { id: '1', ma: 'TC-LS-HN-0001',  tenTochuc: 'Công ty Luật TNHH Việt Phát',              loaiHinh: 'Công ty TNHH',     soDKHD: '01012345/TP/ĐKHĐ-LS', diaChi: '12 Lý Thường Kiệt, Q. Hoàn Kiếm, HN',  nguoiDaiDien: 'Nguyễn Văn Thành', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: 'TC-LS-HCM-0089', tenTochuc: 'Công ty Luật TNHH Việt Phát',               loaiHinh: 'Văn phòng LS',     soDKHD: '01098765/TP/ĐKHĐ-LS', diaChi: '',                                       nguoiDaiDien: 'Trần Công Minh',   approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: 'TC-CC-DN-0024',  tenTochuc: 'Văn phòng Công chứng Đà Nẵng',              loaiHinh: 'Văn phòng CC',     soDKHD: '02024680/TP/ĐKHĐ-CC', diaChi: '78 Trần Phú, Q. Hải Châu, ĐN',          nguoiDaiDien: 'Lê Thị Hồng',      approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: 'TC-DG-HP-0015',  tenTochuc: 'Công ty Đấu giá Hợp danh Hải Phòng',        loaiHinh: 'Công ty HD',       soDKHD: '03012345/TP/ĐKHĐ-DG', diaChi: '45 Điện Biên Phủ, Q. Lê Chân, HP',      nguoiDaiDien: 'Phạm Đức Hùng',    approvalStatus: 'approved', publicStatus: 'published' },
  { id: '5', ma: 'TC-GD-HN-0008',  tenTochuc: 'Trung tâm Giám định Tư pháp Hà Nội',        loaiHinh: 'Trung tâm',        soDKHD: '04098765/TP/ĐKHĐ-GĐ', diaChi: '101 Trần Hưng Đạo, Q. Hoàn Kiếm, HN',  nguoiDaiDien: 'Hoàng Minh Tuấn',  approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '6', ma: 'TC-TT-HCM-0032', tenTochuc: 'Trung tâm Trọng tài Thương mại Phía Nam',   loaiHinh: 'Trung tâm',        soDKHD: '05024680/TP/ĐKHĐ-TT', diaChi: '200 Lê Lai, Q.1, TP.HCM',               nguoiDaiDien: 'Vũ Quang Huy',     approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '7', ma: 'TC-DG-CT-0087',  tenTochuc: 'Công ty Đấu giá Hợp danh Cần Thơ',         loaiHinh: 'Công ty HD',       soDKHD: '01087654/TP/ĐKHĐ-DG', diaChi: '15 Trần Hưng Đạo, Q. Ninh Kiều, CT',    nguoiDaiDien: 'Lâm Văn Đạt',      approvalStatus: 'reviewing', publicStatus: 'unpublished' },
];

const MOCK_LEGAL_AID_OBJECT: Row[] = [
  { id: '1', ma: 'TGPL-DN-2026-001234', loai: 'Người có công',      cccd: '001078001234', hoTen: 'Nguyễn Thị Bích',     dienTGPL: 'Thương binh hạng 2/4', tinh: 'Hà Nội',     approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: 'TGPL-DN-2026-002345', loai: 'Hộ nghèo',           cccd: '079090002345', hoTen: 'Nguyễn Thị Bích',      dienTGPL: '',                     tinh: 'TP.HCM',     approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: 'TGPL-DN-2025-098765', loai: 'Người dân tộc thiểu số', cccd: '038059003456', hoTen: 'Lý Thị Mai',      dienTGPL: 'DTTS cư trú vùng KK',  tinh: 'Đà Nẵng',    approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: 'TGPL-DN-2026-003456', loai: 'Người cao tuổi',     cccd: '031040004567', hoTen: 'Phạm Văn Cương',       dienTGPL: 'Trên 80 tuổi không lương', tinh: 'Hải Phòng', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '5', ma: 'TGPL-DN-2026-004567', loai: 'Người khuyết tật',   cccd: '087072005678', hoTen: 'Hoàng Thị Linh',       dienTGPL: 'KT nặng theo hồ sơ',   tinh: 'Cần Thơ',    approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '6', ma: 'TGPL-DN-2026-005678', loai: 'Trẻ em',             cccd: '001018006789', hoTen: 'Vũ Minh Quân',          dienTGPL: 'Trẻ em (dưới 16 tuổi)', tinh: 'Bình Dương', approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '7', ma: 'TGPL-DN-2026-006789', loai: 'Người khuyết tật',   cccd: '079091009012', hoTen: 'Bùi Thị Cẩm Tú',        dienTGPL: 'KT nhẹ theo hồ sơ',      tinh: 'Hà Nội',     approvalStatus: 'reviewing', publicStatus: 'unpublished' },
];

const MOCK_ASSET: Row[] = [
  { id: '1', ma: 'TS-2026-000145', maHopDong: 'HĐ-TC-2026-001234', hieuluc: '01/01/2026 – 01/01/2031', soGCN: 'GCN-QSD-001234567', loaiTaiSan: 'Quyền sử dụng đất',    benBaoDam: 'Nguyễn Văn Hùng',    approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: 'TS-2026-000287', maHopDong: 'HĐ-TC-2026-002345', hieuluc: '15/02/2026 – 15/02/2029', soGCN: '',                  loaiTaiSan: 'Phương tiện ô tô',     benBaoDam: 'Nguyễn Văn Hùng',    approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: 'TS-2025-008456', maHopDong: 'HĐ-TC-2025-003456', hieuluc: '20/11/2025 – 20/11/2028', soGCN: 'GCN-SHNO-003456789',loaiTaiSan: 'Nhà ở',                benBaoDam: 'Lê Minh Đức',         approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: 'TS-2026-000401', maHopDong: 'HĐ-TC-2026-004567', hieuluc: '10/03/2026 – 10/03/2030', soGCN: 'GCN-MMTB-004567890',loaiTaiSan: 'Máy móc thiết bị',     benBaoDam: 'Phạm Quốc Khánh',    approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '5', ma: 'TS-2026-000512', maHopDong: 'HĐ-TC-2026-005678', hieuluc: '25/04/2026 – 25/04/2028', soGCN: 'GCN-HHDV-005678901',loaiTaiSan: 'Hàng hóa trong kho',   benBaoDam: 'Hoàng Đức Lân',      approvalStatus: 'approved', publicStatus: 'published' },
  { id: '6', ma: 'TS-2026-000623', maHopDong: 'HĐ-TC-2026-006789', hieuluc: '05/06/2026 – 05/06/2029', soGCN: 'GCN-QSD-006789012', loaiTaiSan: 'Tài sản hình thành trong tương lai', benBaoDam: 'Vũ Thị Hà',  approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '7', ma: 'TS-2026-000734', maHopDong: 'HĐ-TC-2026-007890', hieuluc: '12/06/2026 – 12/06/2030', soGCN: 'GCN-QSD-007890123', loaiTaiSan: 'Quyền sử dụng đất',    benBaoDam: 'Đặng Văn Kiên',  approvalStatus: 'reviewing', publicStatus: 'unpublished' },
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

// ─── Rà soát: gợi ý trùng lặp & cảnh báo thiếu dữ liệu ────────────────────────

// Trường dùng để so khớp trùng lặp theo từng loại dữ liệu
const DUPLICATE_KEY_FIELD: Record<DataCategory, string> = {
  'enforcement': 'hoTen',
  'civil-registry': 'hoTen',
  'nationality': 'hoTen',
  'individual': 'hoTen',
  'organization': 'tenTochuc',
  'legal-aid-object': 'hoTen',
  'asset': 'benBaoDam',
};

function getDuplicateKeyValue(row: Row, category: DataCategory): string {
  const field = DUPLICATE_KEY_FIELD[category];
  return (row[field] || '').trim().toLowerCase();
}

function computeDuplicateIds(rows: Row[], category: DataCategory): Set<string> {
  const groups: Record<string, Row[]> = {};
  rows.forEach(r => {
    const key = getDuplicateKeyValue(r, category);
    if (!key) return;
    (groups[key] = groups[key] || []).push(r);
  });
  const dupIds = new Set<string>();
  Object.values(groups).forEach(group => {
    if (group.length > 1) group.forEach(r => dupIds.add(r.id));
  });
  return dupIds;
}

function isRowIncomplete(row: Row, cols: ColDef[]): boolean {
  return cols.some(col => !row[col.key] || row[col.key].trim() === '');
}

// ─── Status badges ────────────────────────────────────────────────────────────

function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  if (status === 'approved')
    return <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-[12px] rounded-full whitespace-nowrap">Đã phê duyệt</span>;
  if (status === 'pending')
    return <span className="px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 text-[12px] rounded-full whitespace-nowrap">Chờ phê duyệt</span>;
  if (status === 'reviewing')
    return <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[12px] rounded-full whitespace-nowrap">Đang rà soát</span>;
  return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-[12px] rounded-full whitespace-nowrap">Từ chối</span>;
}

function PublicBadge({ status }: { status: PublicStatus }) {
  if (status === 'published')
    return <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-[12px] rounded-full whitespace-nowrap">Đã công khai</span>;
  return <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 text-[12px] rounded-full whitespace-nowrap">Chưa công khai</span>;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  masterId: string;
  masterLabel: string;
}

export function MasterDataUpdateItemPage({ masterId, masterLabel }: Props) {
  const [activeTab, setActiveTab] = useState<'list' | 'approval' | 'publish' | 'history'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const config = ITEM_CONFIGS[masterId] || { category: 'individual' as DataCategory, unit: '—', system: '—', idLabel: 'Mã' };
  const cols = COLUMNS[config.category];

  // Dữ liệu bản ghi — lưu trong state để có thể phê duyệt/từ chối trực tiếp
  const [recordsData, setRecordsData] = useState<Row[]>(() => getMockData(masterId, config.category));
  const allData = recordsData;

  // Phê duyệt (giống tab Phê duyệt tại Biên tập danh mục)
  const [approvalStatusFilter, setApprovalStatusFilter] = useState<'all' | ApprovalStatus>('all');
  const [selectedApprovalIds, setSelectedApprovalIds] = useState<string[]>([]);

  // Công khai (giống tab Công khai tại Biên tập danh mục)
  const [publishStatus, setPublishStatus] = useState<'unpublished' | 'published' | 'stopped'>('unpublished');
  const [shareScope, setShareScope] = useState<'internal' | 'extended' | 'public'>('internal');
  const [unpublishReason, setUnpublishReason] = useState('');
  const [publishActionInfo, setPublishActionInfo] = useState<{ user: string; date: string; reason?: string }>({ user: '', date: '' });
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);

  // Rà soát dữ liệu — gợi ý trùng lặp & cảnh báo thiếu dữ liệu (giao dịch 2), chỉnh sửa/đánh dấu đang rà soát (giao dịch 3)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, string>>({});

  const listData = allData.filter(r => {
    if (!searchQuery) return true;
    return Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const duplicateIds = computeDuplicateIds(allData, config.category);
  const incompleteIds = new Set(allData.filter(r => isRowIncomplete(r, cols)).map(r => r.id));

  const stats = {
    total:     allData.length,
    approved:  allData.filter(r => r.approvalStatus === 'approved').length,
    pending:   allData.filter(r => r.approvalStatus === 'pending').length,
    reviewing: allData.filter(r => r.approvalStatus === 'reviewing').length,
    rejected:  allData.filter(r => r.approvalStatus === 'rejected').length,
  };

  const tabs = [
    { id: 'list' as const,     label: 'Dữ liệu',        icon: List },
    { id: 'approval' as const, label: 'Phê duyệt',      icon: CheckCircle2 },
    { id: 'publish' as const,  label: 'Công khai',      icon: Globe },
    { id: 'history' as const,  label: 'Lịch sử xử lý',  icon: Clock },
  ];

  // ─── Phê duyệt handlers ───────────────────────────────────────────────────

  const approvalFilteredData = allData.filter(r => {
    const matchesStatus = approvalStatusFilter === 'all' || r.approvalStatus === approvalStatusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || Object.values(r).some(v => String(v).toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const approvalPendingIds = approvalFilteredData.filter(r => r.approvalStatus === 'pending').map(r => r.id);

  const toggleSelectApproval = (id: string) => {
    setSelectedApprovalIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAllApprovals = () => {
    setSelectedApprovalIds(prev => prev.length === approvalPendingIds.length ? [] : approvalPendingIds);
  };

  const setApprovalStatusForIds = (ids: string[], status: ApprovalStatus) => {
    setRecordsData(prev => prev.map(r => ids.includes(r.id) ? { ...r, approvalStatus: status } : r));
    setSelectedApprovalIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const handleApproveOne = (id: string) => setApprovalStatusForIds([id], 'approved');
  const handleRejectOne = (id: string) => setApprovalStatusForIds([id], 'rejected');

  const handleBulkApprove = () => {
    if (selectedApprovalIds.length === 0) {
      alert('Vui lòng chọn ít nhất một bản ghi để phê duyệt');
      return;
    }
    setApprovalStatusForIds(selectedApprovalIds, 'approved');
  };

  const handleBulkReject = () => {
    if (selectedApprovalIds.length === 0) {
      alert('Vui lòng chọn ít nhất một bản ghi để từ chối');
      return;
    }
    setApprovalStatusForIds(selectedApprovalIds, 'rejected');
  };

  // ─── Rà soát dữ liệu handlers ─────────────────────────────────────────────

  const handleViewDuplicates = (row: Row) => {
    const dupField = DUPLICATE_KEY_FIELD[config.category];
    const others = allData.filter(r => r.id !== row.id && getDuplicateKeyValue(r, config.category) === getDuplicateKeyValue(row, config.category));
    alert(
      `Bản ghi "${row[dupField]}" (${row.ma}) có thể trùng lặp với:\n` +
      others.map(r => `- ${r.ma} (${r[dupField]})`).join('\n')
    );
  };

  const handleOpenEdit = (row: Row) => {
    setEditingRowId(row.id);
    const initial: Record<string, string> = {};
    cols.forEach(col => { initial[col.key] = row[col.key] || ''; });
    setEditFormData(initial);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingRowId(null);
    setEditFormData({});
  };

  const handleSaveEdit = () => {
    if (!editingRowId) return;
    setRecordsData(prev => prev.map(r => r.id === editingRowId ? { ...r, ...editFormData, approvalStatus: 'reviewing' } : r));
    handleCloseEdit();
    alert('Đã lưu thay đổi tạm thời. Bản ghi được đánh dấu "Đang rà soát".');
  };

  const handleSendForApproval = (row: Row) => {
    if (isRowIncomplete(row, cols)) {
      alert('Bản ghi còn thiếu dữ liệu bắt buộc. Vui lòng bổ sung đầy đủ thông tin trước khi gửi phê duyệt.');
      return;
    }
    setRecordsData(prev => prev.map(r => r.id === row.id ? { ...r, approvalStatus: 'pending' } : r));
    alert('Đã gửi bản ghi đi phê duyệt. Trạng thái cập nhật thành "Chờ phê duyệt" và thông báo đã được gửi tới lãnh đạo nghiệp vụ.');
  };

  // ─── Công khai handlers ───────────────────────────────────────────────────

  const handleConfirmPublish = () => {
    setPublishStatus('published');
    setPublishActionInfo({ user: 'Nguyễn Văn A', date: new Date().toLocaleDateString('vi-VN') });
    setShowPublishModal(false);
    alert(`Công khai dữ liệu thành công với phạm vi: ${shareScope === 'internal' ? 'Nội bộ' : shareScope === 'extended' ? 'Mở rộng' : 'Toàn dân'}`);
  };

  const handleConfirmUnpublish = () => {
    if (!unpublishReason.trim()) {
      alert('Vui lòng nhập lý do hủy công khai!');
      return;
    }
    setPublishStatus('stopped');
    setPublishActionInfo({ user: 'Nguyễn Văn A', date: new Date().toLocaleDateString('vi-VN'), reason: unpublishReason });
    setShowUnpublishModal(false);
    setUnpublishReason('');
    alert('Đã hủy công khai dữ liệu thành công!');
  };

  const totalPages = Math.max(1, Math.ceil(listData.length / pageSize));
  const paginatedData = listData.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  return (
    <div className="space-y-3">
      <p className="text-[13px] text-slate-500">
        <span className="font-medium text-slate-700">{masterLabel}</span> &bull; {config.unit} &bull; {config.system}
      </p>

      {/* Tab bar — matches CategorySetupPage/CategoryPage style */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex px-6 gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCurrentPageNum(1); }}
              className={`flex items-center gap-2 px-6 py-4 text-[13px] font-medium transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
              {tab.label}
              {tab.id === 'approval' && stats.pending > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-700 rounded-full">
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tab: Dữ liệu ─── */}
      {activeTab === 'list' && (
        <>
          {/* Gợi ý trùng lặp & cảnh báo thiếu dữ liệu */}
          {(duplicateIds.size > 0 || incompleteIds.size > 0) && (
            <div className="flex flex-col sm:flex-row gap-3">
              {duplicateIds.size > 0 && (
                <div className="flex-1 flex items-start gap-2 px-4 py-3 rounded-lg border bg-yellow-50 border-yellow-200 text-[13px]">
                  <Copy className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-600" />
                  <div className="text-yellow-800">
                    <p className="font-medium">Phát hiện {duplicateIds.size} bản ghi có thể trùng lặp</p>
                    <p className="text-yellow-600 mt-0.5">Hệ thống tự động so khớp theo họ tên/tên tổ chức. Vui lòng kiểm tra và xử lý trước khi gửi phê duyệt.</p>
                  </div>
                </div>
              )}
              {incompleteIds.size > 0 && (
                <div className="flex-1 flex items-start gap-2 px-4 py-3 rounded-lg border bg-red-50 border-red-200 text-[13px]">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600" />
                  <div className="text-red-800">
                    <p className="font-medium">Phát hiện {incompleteIds.size} bản ghi thiếu dữ liệu</p>
                    <p className="text-red-600 mt-0.5">Một số trường bắt buộc còn trống. Vui lòng bổ sung đầy đủ thông tin.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search & Action Bar */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPageNum(1); }}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-white hover:bg-slate-50/50 font-medium shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium border border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
              >
                <Filter className="w-4 h-4" />
                Lọc
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium border border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
              >
                <Upload className="w-4 h-4" />
                Nhập
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[13px] font-medium transition-all cursor-pointer active:scale-95 shadow-sm whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Xuất
              </button>
            </div>
          </div>

          {/* Grid Table + Pagination */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap w-14 text-center">STT</th>
                    {cols.map(col => (
                      <th key={col.key} className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Phê duyệt</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Công khai</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-40">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedData.map((row, index) => {
                    const isDup = duplicateIds.has(row.id);
                    const isIncomplete = incompleteIds.has(row.id);
                    const dupField = DUPLICATE_KEY_FIELD[config.category];
                    const missingLabels = cols.filter(c => !row[c.key] || row[c.key].trim() === '').map(c => c.label);
                    const warningParts: string[] = [];
                    if (isDup) warningParts.push(`Có thể trùng lặp (trùng "${row[dupField]}" với bản ghi khác)`);
                    if (isIncomplete) warningParts.push(`Thiếu dữ liệu: ${missingLabels.join(', ')}`);
                    const warningTooltip = warningParts.join(' • ');
                    return (
                    <tr key={row.id} className={`hover:bg-slate-50/50 transition-colors ${isIncomplete ? 'bg-red-50/40' : isDup ? 'bg-yellow-50/40' : ''}`}>
                      <td className="px-6 py-4 text-[13px] text-slate-500 text-center">{(currentPageNum - 1) * pageSize + index + 1}</td>
                      {cols.map(col => (
                        <td key={col.key} className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap max-w-[200px] truncate">
                          {row[col.key] || <span className="text-slate-400 italic">(trống)</span>}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-center"><ApprovalBadge status={row.approvalStatus} /></td>
                      <td className="px-6 py-4 text-center"><PublicBadge status={row.publicStatus} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          {(() => {
                            const hasWarning = isDup || isIncomplete;
                            const canClick = hasWarning && isDup;
                            return (
                              <button
                                disabled={!hasWarning}
                                onClick={canClick ? () => handleViewDuplicates(row) : undefined}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent ${
                                  isIncomplete ? 'text-red-500 hover:bg-red-50' : 'text-yellow-500 hover:bg-yellow-50'
                                }`}
                                title={hasWarning ? warningTooltip : 'Không có cảnh báo'}
                              >
                                <AlertTriangle className="w-4 h-4" />
                              </button>
                            );
                          })()}
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Xem chi tiết">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            disabled={row.approvalStatus === 'approved'}
                            onClick={row.approvalStatus !== 'approved' ? () => handleOpenEdit(row) : undefined}
                            className="p-1.5 rounded-lg transition-colors cursor-pointer text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                            title={row.approvalStatus !== 'approved' ? 'Chỉnh sửa / bổ sung' : 'Bản ghi đã phê duyệt — không thể chỉnh sửa'}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            disabled={row.approvalStatus !== 'reviewing' && row.approvalStatus !== 'rejected'}
                            onClick={(row.approvalStatus === 'reviewing' || row.approvalStatus === 'rejected') ? () => handleSendForApproval(row) : undefined}
                            className="p-1.5 rounded-lg transition-colors cursor-pointer text-indigo-600 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                            title={(row.approvalStatus === 'reviewing' || row.approvalStatus === 'rejected') ? 'Trình duyệt' : 'Chỉ có thể trình duyệt bản ghi đang rà soát hoặc bị từ chối'}
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            disabled={!(row.publicStatus !== 'published' && row.approvalStatus === 'approved')}
                            className="p-1.5 rounded-lg transition-colors cursor-pointer text-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                            title={(row.publicStatus !== 'published' && row.approvalStatus === 'approved') ? 'Công khai' : 'Chỉ có thể công khai bản ghi đã phê duyệt và chưa công khai'}
                          >
                            <Globe className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={cols.length + 4} className="px-6 py-16 text-center text-[13px] text-slate-400">
                        Không tìm thấy dữ liệu phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {listData.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-normal">Hiển thị</span>
                  <select
                    aria-label="Số bản ghi trên trang"
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPageNum(1); }}
                    className="px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-[13px] cursor-pointer font-medium"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-slate-600 font-normal">bản ghi/trang</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-600 font-normal">
                    {(currentPageNum - 1) * pageSize + 1} - {Math.min(currentPageNum * pageSize, listData.length)} / {listData.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
                      disabled={currentPageNum === 1}
                      className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                    >
                      Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPageNum(page)}
                        className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${currentPageNum === page ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
                      disabled={currentPageNum === totalPages}
                      className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ─── Tab: Phê duyệt — matches CategoryPage's "Phê duyệt" tab design ─── */}
      {activeTab === 'approval' && (
        <div className="space-y-6">
          {/* Header + bulk actions */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[18px] font-semibold text-slate-900">Phê duyệt dữ liệu cập nhật</h3>
              <p className="text-[13px] text-slate-500 mt-1">Quản lý các yêu cầu phê duyệt cập nhật của {masterLabel}</p>
            </div>
            {selectedApprovalIds.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-slate-600">
                  Đã chọn: <span className="font-medium text-blue-600">{selectedApprovalIds.length}</span> bản ghi
                </span>
                <button
                  onClick={handleBulkApprove}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-[13px]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Phê duyệt hàng loạt
                </button>
                <button
                  onClick={handleBulkReject}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-[13px]"
                >
                  <XCircle className="w-4 h-4" />
                  Từ chối hàng loạt
                </button>
              </div>
            )}
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-indigo-700">Đang rà soát</p>
                  <p className="text-2xl text-indigo-900">{stats.reviewing}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-orange-700">Chờ phê duyệt</p>
                  <p className="text-2xl text-orange-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700">Đã phê duyệt</p>
                  <p className="text-2xl text-green-900">{stats.approved}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-red-700">Đã từ chối</p>
                  <p className="text-2xl text-red-900">{stats.rejected}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <List className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700">Tổng yêu cầu</p>
                  <p className="text-2xl text-blue-900">{stats.total}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tìm kiếm + Bộ lọc trạng thái */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  title="Tìm kiếm bản ghi phê duyệt"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { value: 'all' as const, label: 'Tất cả', activeClass: 'bg-slate-700 text-white border-slate-700' },
                  { value: 'reviewing' as const, label: 'Đang rà soát', activeClass: 'bg-indigo-600 text-white border-indigo-600' },
                  { value: 'pending' as const, label: 'Chờ phê duyệt', activeClass: 'bg-orange-500 text-white border-orange-500' },
                  { value: 'approved' as const, label: 'Đã phê duyệt', activeClass: 'bg-green-600 text-white border-green-600' },
                  { value: 'rejected' as const, label: 'Đã từ chối', activeClass: 'bg-red-500 text-white border-red-500' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setApprovalStatusFilter(opt.value)}
                    className={`px-3 py-2 text-[13px] rounded-lg border transition-all font-medium cursor-pointer ${
                      approvalStatusFilter === opt.value
                        ? opt.activeClass
                        : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bảng grid */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        title="Chọn tất cả"
                        checked={approvalPendingIds.length > 0 && selectedApprovalIds.length === approvalPendingIds.length}
                        onChange={toggleSelectAllApprovals}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600">STT</th>
                    {cols.map(col => (
                      <th key={col.key} className="px-6 py-3 text-left text-[13px] font-medium text-slate-600 whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {approvalFilteredData.map((row, index) => (
                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-4">
                        {row.approvalStatus === 'pending' && (
                          <input
                            type="checkbox"
                            title="Chọn bản ghi"
                            checked={selectedApprovalIds.includes(row.id)}
                            onChange={() => toggleSelectApproval(row.id)}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </td>
                      <td className="px-6 py-3 text-[13px] text-slate-900">{index + 1}</td>
                      {cols.map(col => (
                        <td key={col.key} className="px-6 py-3 text-[13px] text-slate-700 whitespace-nowrap max-w-[200px] truncate">
                          {row[col.key]}
                        </td>
                      ))}
                      <td className="px-6 py-3 whitespace-nowrap"><ApprovalBadge status={row.approvalStatus} /></td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => row.approvalStatus === 'pending' && handleApproveOne(row.id)}
                            disabled={row.approvalStatus !== 'pending'}
                            className={`p-1 rounded transition-colors ${
                              row.approvalStatus === 'pending'
                                ? 'text-green-600 hover:bg-green-50 cursor-pointer'
                                : 'text-slate-300 cursor-not-allowed'
                            }`}
                            title={row.approvalStatus === 'pending' ? 'Phê duyệt' : 'Đã xử lý'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => row.approvalStatus === 'pending' && handleRejectOne(row.id)}
                            disabled={row.approvalStatus !== 'pending'}
                            className={`p-1 rounded transition-colors ${
                              row.approvalStatus === 'pending'
                                ? 'text-red-600 hover:bg-red-50 cursor-pointer'
                                : 'text-slate-300 cursor-not-allowed'
                            }`}
                            title={row.approvalStatus === 'pending' ? 'Từ chối' : 'Đã xử lý'}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {approvalFilteredData.length === 0 && (
                    <tr>
                      <td colSpan={cols.length + 4} className="px-6 py-16 text-center text-[13px] text-slate-400">
                        Không có bản ghi phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: Công khai ─── */}
      {activeTab === 'publish' && (
        <div className="space-y-6">
          {/* Banner trạng thái công khai */}
          <div className={`p-6 rounded-xl border flex items-center justify-between shadow-sm transition-all ${
            publishStatus === 'published'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : publishStatus === 'stopped'
              ? 'bg-red-50 border-red-200 text-red-950'
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                publishStatus === 'published' ? 'bg-emerald-500 text-white' : publishStatus === 'stopped' ? 'bg-red-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                {publishStatus === 'published' ? <Globe className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-[14px]">
                  Trạng thái: {publishStatus === 'published' ? 'ĐÃ CÔNG KHAI' : publishStatus === 'stopped' ? 'NGỪNG CÔNG KHAI' : 'CHƯA CÔNG KHAI'}
                </h4>
                <p className="text-[13px] text-slate-500 mt-1">
                  {publishStatus === 'published' && (
                    <>
                      Phạm vi chia sẻ: <strong>{shareScope === 'internal' ? 'Nội bộ' : shareScope === 'extended' ? 'Mở rộng' : 'Toàn dân'}</strong> | Người thực hiện: <strong>{publishActionInfo.user}</strong> | Ngày thực hiện: <strong>{publishActionInfo.date}</strong>
                    </>
                  )}
                  {publishStatus === 'stopped' && (
                    <>
                      Người thực hiện: <strong>{publishActionInfo.user}</strong> | Ngày thực hiện: <strong>{publishActionInfo.date}</strong> | Lý do: <span className="italic text-red-700 font-medium">"{publishActionInfo.reason || '—'}"</span>
                    </>
                  )}
                  {publishStatus === 'unpublished' && 'Dữ liệu này hiện chưa được công khai ra ngoài hệ thống.'}
                </p>
              </div>
            </div>
            <div>
              {publishStatus === 'published' ? (
                <button
                  onClick={() => setShowUnpublishModal(true)}
                  className="px-4 py-2 border border-red-200 bg-white text-red-600 rounded-lg hover:bg-red-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95 flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Hủy công khai
                </button>
              ) : (
                <button
                  onClick={() => setShowPublishModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-[13px] transition-colors cursor-pointer active:scale-95 flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Công khai
                </button>
              )}
            </div>
          </div>

          {/* Tiêu đề phần danh sách */}
          <div>
            <h3 className="text-[16px] text-slate-900 font-semibold">Các bản ghi dữ liệu</h3>
            <p className="text-[13px] text-slate-500 mt-1">Danh sách bản ghi hiện có của {masterLabel}</p>
          </div>

          {/* Table hiển thị dữ liệu không cần cột thao tác */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-slate-700 whitespace-nowrap">STT</th>
                    {cols.map(col => (
                      <th key={col.key} className="px-6 py-4 text-left text-[13px] font-semibold text-slate-700 whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-slate-700 whitespace-nowrap">Phê duyệt</th>
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-slate-700 whitespace-nowrap">Công khai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allData.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-[13px] text-slate-900">{idx + 1}</td>
                      {cols.map(col => (
                        <td key={col.key} className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap max-w-[200px] truncate">
                          {row[col.key]}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap"><ApprovalBadge status={row.approvalStatus} /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><PublicBadge status={row.publicStatus} /></td>
                    </tr>
                  ))}
                  {allData.length === 0 && (
                    <tr>
                      <td colSpan={cols.length + 3} className="px-6 py-8 text-center text-[13px] text-slate-400 italic">Không tìm thấy dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: Lịch sử xử lý ─── */}
      {activeTab === 'history' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-6">
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

      {/* Modal Chỉnh sửa / bổ sung thông tin — lưu tạm thời, đánh dấu "Đang rà soát" */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden transform scale-100 transition-all">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-600" />
                Chỉnh sửa / bổ sung thông tin
              </h3>
              <button
                onClick={handleCloseEdit}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-[13px] max-h-[60vh] overflow-y-auto">
              <div className="flex items-start gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-800">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>Sau khi lưu, bản ghi sẽ được đánh dấu <strong>"Đang rà soát"</strong> cho đến khi được gửi đi phê duyệt.</p>
              </div>
              {cols.map(col => (
                <div key={col.key}>
                  <label className="block text-slate-700 font-medium mb-1">{col.label}</label>
                  <input
                    type="text"
                    title={col.label}
                    value={editFormData[col.key] || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, [col.key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder={`Nhập ${col.label.toLowerCase()}...`}
                  />
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={handleCloseEdit}
                className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-[13px] transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Công khai dữ liệu */}
      {showPublishModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Công khai dữ liệu
              </h3>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Đóng"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-[13px]">
              <p className="text-slate-600 font-medium leading-relaxed">
                Vui lòng lựa chọn phạm vi chia sẻ (phân quyền công khai) cho dữ liệu <strong>{masterLabel}</strong>:
              </p>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="shareScope"
                    checked={shareScope === 'internal'}
                    onChange={() => setShareScope('internal')}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <div>
                    <strong className="block text-slate-800">Nội bộ</strong>
                    <span className="text-slate-500 text-[12px] mt-0.5 block">Dữ liệu chỉ được chia sẻ và sử dụng trong nội bộ đơn vị, cơ quan.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="shareScope"
                    checked={shareScope === 'extended'}
                    onChange={() => setShareScope('extended')}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <div>
                    <strong className="block text-slate-800">Mở rộng</strong>
                    <span className="text-slate-500 text-[12px] mt-0.5 block">Chia sẻ cho các đơn vị liên kết, cơ quan thuộc Bộ Tư pháp.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="shareScope"
                    checked={shareScope === 'public'}
                    onChange={() => setShareScope('public')}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <div>
                    <strong className="block text-slate-800">Toàn dân</strong>
                    <span className="text-slate-500 text-[12px] mt-0.5 block">Dữ liệu mở, cho phép mọi người dân và doanh nghiệp khai thác tự do.</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmPublish}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-[13px] transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hủy công khai dữ liệu */}
      {showUnpublishModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Hủy công khai dữ liệu
              </h3>
              <button
                onClick={() => { setShowUnpublishModal(false); setUnpublishReason(''); }}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Đóng"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-[13px]">
              <p className="text-slate-600 font-medium leading-relaxed">
                Bạn có chắc chắn muốn hủy công khai dữ liệu <strong>{masterLabel}</strong>? Vui lòng nhập lý do hủy công khai:
              </p>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Lý do hủy công khai <span className="text-red-500">*</span></label>
                <textarea
                  title="Lý do hủy công khai"
                  value={unpublishReason}
                  onChange={(e) => setUnpublishReason(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Nhập lý do chi tiết..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => { setShowUnpublishModal(false); setUnpublishReason(''); }}
                className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmUnpublish}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-[13px] transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
