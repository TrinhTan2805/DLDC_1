import { useState } from 'react';
import { Search, Send, Eye, Clock, CheckCircle2, XCircle, Globe, List, Lock, Check, Edit2, Copy, AlertTriangle, X, RotateCcw, GitMerge, Split, HelpCircle, PlusCircle, SquarePen, Link2, Download, ArrowLeft, Trash2, RefreshCw, ChevronDown, GitCompare, MoreVertical, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../ui/dropdown-menu';

export type ApprovalStatus = 'draft' | 'reviewing' | 'pending' | 'approved' | 'rejected' | 'deleted';
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
  { id: '3', ma: 'QĐ-THADS-2025-08456', ngayBanHanh: '10/11/2025', hoTen: 'Lê Minh Cường',    cccd: '036087003456', nghiaVu: 'Trả nợ 180.000.000đ và lãi suất',       coQuan: 'Cục THADS TP. Đà Nẵng',         approvalStatus: 'draft',    publicStatus: 'unpublished' },
  { id: '4', ma: 'QĐ-THADS-2026-00401', ngayBanHanh: '05/03/2026', hoTen: 'Phạm Quốc Dũng',   cccd: '031075004567', nghiaVu: 'Giao nộp tài sản theo bản án số 12/2025', coQuan: 'Chi Cục THADS TP. Cần Thơ',     approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '5', ma: 'QĐ-THADS-2026-00512', ngayBanHanh: '15/04/2026', hoTen: 'Hoàng Thị Lan',    cccd: '038079005678', nghiaVu: 'Bồi thường thiệt hại 75.000.000đ',       coQuan: 'Chi Cục THADS Q. Hải An, HN',  approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '6', ma: 'QĐ-THADS-2026-00623', ngayBanHanh: '28/05/2026', hoTen: 'Vũ Đức Thắng',     cccd: '026068006789', nghiaVu: 'Nộp tiền phạt 50.000.000đ',               coQuan: 'Chi Cục THADS Q. Sơn Trà, ĐN', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '7', ma: 'QĐ-THADS-2026-00734', ngayBanHanh: '02/06/2026', hoTen: 'Đặng Thị Kim Oanh', cccd: '034082007890', nghiaVu: 'Bồi thường 45.000.000đ',                  coQuan: 'Chi Cục THADS Q. Cầu Giấy, HN', approvalStatus: 'reviewing', publicStatus: 'unpublished' },
  { id: '8', ma: 'QĐ-THADS-2026-00845', ngayBanHanh: '18/06/2026', hoTen: 'Bùi Văn Thành',     cccd: '045085008901', nghiaVu: 'Bồi thường 120.000.000đ',                 coQuan: 'Cục THADS TP. Hà Nội',          approvalStatus: 'approved', publicStatus: 'unpublished' },
  { id: '9', ma: 'QĐ-THADS-2026-00902', ngayBanHanh: '25/06/2026', hoTen: 'Trịnh Thị Hoa',     cccd: '052090009012', nghiaVu: 'Truy thu thuế 60.000.000đ',               coQuan: 'Chi Cục THADS TP. Vinh',        approvalStatus: 'approved', publicStatus: 'unpublished' },
  { id: '10', ma: 'QĐ-THADS-2026-00967', ngayBanHanh: '30/06/2026', hoTen: 'Vũ Đức Thắng',    cccd: '026068009999', nghiaVu: 'Nộp tiền phạt 15.000.000đ',              coQuan: 'Chi Cục THADS Q. Sơn Trà, ĐN',  approvalStatus: 'pending',  publicStatus: 'unpublished' },
];

const MOCK_CIVIL_REGISTRY: Row[] = [
  { id: '1', ma: '01/2026/ĐKKS',   ngayDangKy: '02/01/2026', noiDangKy: 'UBND P. Hàng Bông, HN',       hoTen: 'Trần Minh Khoa',    ngaySinh: '01/01/2026', quocTich: 'Việt Nam', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: '124/2026/ĐKKS',  ngayDangKy: '15/02/2026', noiDangKy: '',                            hoTen: 'Trần Minh Khoa',    ngaySinh: '14/02/2026', quocTich: 'Việt Nam', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: '2847/2025/ĐKKS', ngayDangKy: '10/12/2025', noiDangKy: 'UBND P. Hải Châu 1, ĐN',      hoTen: 'Lê Gia Bảo',        ngaySinh: '08/12/2025', quocTich: 'Việt Nam', approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: '298/2026/ĐKKS',  ngayDangKy: '05/03/2026', noiDangKy: 'UBND P. Lê Chân, Hải Phòng',  hoTen: 'Phạm Nhật Minh',    ngaySinh: '03/03/2026', quocTich: 'Việt Nam', approvalStatus: 'draft',    publicStatus: 'unpublished' },
  { id: '5', ma: '401/2026/ĐKKS',  ngayDangKy: '20/04/2026', noiDangKy: 'UBND P. An Hòa, Cần Thơ',     hoTen: 'Đinh Thị Yến Nhi',  ngaySinh: '18/04/2026', quocTich: 'Việt Nam', approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '6', ma: '512/2026/ĐKKS',  ngayDangKy: '10/05/2026', noiDangKy: 'UBND P. Vĩnh Phú, Bình Dương', hoTen: 'Trần Bình An',      ngaySinh: '08/05/2026', quocTich: 'Việt Nam', approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '7', ma: '099/2026/ĐKKS',  ngayDangKy: '12/05/2026', noiDangKy: 'UBND P. Cầu Giấy, HN',        hoTen: 'Bùi Văn Sơn',       ngaySinh: '01/01/2026', quocTich: 'Việt Nam', approvalStatus: 'reviewing', publicStatus: 'unpublished' },
];

const MOCK_NATIONALITY: Row[] = [
  { id: '1', ma: '385/QĐ-CTN-2025', hoTen: 'Nguyễn Thị Hương',    ngaySinh: '15/05/1985', noiSinh: 'Hà Nội',        gioiTinh: 'Nữ',  ngayQuyetDinh: '20/08/2025', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: '112/QĐ-CTN-2026', hoTen: 'Nguyễn Thị Hương',     ngaySinh: '10/03/1990', noiSinh: '',              gioiTinh: 'Nam', ngayQuyetDinh: '15/02/2026', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: '047/QĐ-CTN-2026', hoTen: 'Trần Thị Mai Ly',      ngaySinh: '22/11/1978', noiSinh: 'Đà Nẵng',       gioiTinh: 'Nữ',  ngayQuyetDinh: '10/01/2026', approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: '198/QĐ-CTN-2025', hoTen: 'Phạm Văn Tùng',        ngaySinh: '08/07/1965', noiSinh: 'Nghệ An',       gioiTinh: 'Nam', ngayQuyetDinh: '05/05/2025', approvalStatus: 'draft',    publicStatus: 'unpublished' },
  { id: '5', ma: '256/QĐ-CTN-2026', hoTen: 'Hoàng Thị Bích Ngọc',  ngaySinh: '30/01/1992', noiSinh: 'Hải Phòng',     gioiTinh: 'Nữ',  ngayQuyetDinh: '28/03/2026', approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '6', ma: '311/QĐ-CTN-2026', hoTen: 'Vũ Đình Khương',        ngaySinh: '14/09/1988', noiSinh: 'Bắc Ninh',      gioiTinh: 'Nam', ngayQuyetDinh: '15/04/2026', approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '7', ma: '289/QĐ-CTN-2026', hoTen: 'Đỗ Thị Thanh Huyền',    ngaySinh: '02/02/1995', noiSinh: 'Thanh Hóa',     gioiTinh: 'Nữ',  ngayQuyetDinh: '10/06/2026', approvalStatus: 'reviewing', publicStatus: 'unpublished' },
];

const MOCK_INDIVIDUAL: Row[] = [
  { id: '1', ma: 'HN-LS-2019-00145',  hoTen: 'Nguyễn Thanh Hải',   ngaySinh: '15/04/1978', cccd: '001078001234', chucDanh: 'Luật sư',         soCCHN: 'CCHN-LS-0012345', linhVuc: 'Dân sự, Hình sự',       approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: 'HCM-LS-2020-00892', hoTen: 'Nguyễn Văn Anh',    ngaySinh: '22/08/1982', cccd: '079199001234', chucDanh: 'Luật sư',         soCCHN: '',                linhVuc: 'Kinh doanh thương mại', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: 'DN-CC-2021-00234',  hoTen: 'Lê Thị Thu Hà',       ngaySinh: '10/12/1985', cccd: '048085003456', chucDanh: 'Công chứng viên', soCCHN: 'CCHN-CC-0034567', linhVuc: 'Công chứng',            approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: 'HN-DGV-2018-00067', hoTen: 'Phạm Xuân Long',      ngaySinh: '05/03/1975', cccd: '001075004567', chucDanh: 'Đấu giá viên',    soCCHN: 'CCHN-DG-0045678', linhVuc: 'Đấu giá tài sản',      approvalStatus: 'draft',    publicStatus: 'unpublished' },
  { id: '5', ma: 'HP-QTV-2022-00189', hoTen: 'Hoàng Văn Bình',      ngaySinh: '18/06/1980', cccd: '031080005678', chucDanh: 'Quản tài viên',   soCCHN: 'CCHN-QT-0056789', linhVuc: 'Quản lý, thanh lý TS',  approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '6', ma: 'CT-GDVTP-2020-0045',hoTen: 'Vũ Thị Ngọc Lan',     ngaySinh: '27/09/1988', cccd: '087088006789', chucDanh: 'Giám định viên',  soCCHN: 'CCHN-GD-0067890', linhVuc: 'Tài chính kế toán',     approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '7', ma: 'HN-LS-2026-00312',  hoTen: 'Ngô Thanh Sơn',       ngaySinh: '30/01/1990', cccd: '001090008901', chucDanh: 'Luật sư',         soCCHN: 'CCHN-LS-0078901', linhVuc: 'Dân sự',                approvalStatus: 'reviewing', publicStatus: 'unpublished' },
];

const MOCK_ORGANIZATION: Row[] = [
  { id: '1', ma: 'TC-LS-HN-0001',  tenTochuc: 'Công ty Luật TNHH Việt Phát',              loaiHinh: 'Công ty TNHH',     soDKHD: '01012345/TP/ĐKHĐ-LS', diaChi: '12 Lý Thường Kiệt, Q. Hoàn Kiếm, HN',  nguoiDaiDien: 'Nguyễn Văn Thành', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: 'TC-LS-HCM-0089', tenTochuc: 'Công ty Luật TNHH Việt Phát',               loaiHinh: 'Văn phòng LS',     soDKHD: '01098765/TP/ĐKHĐ-LS', diaChi: '',                                       nguoiDaiDien: 'Trần Công Minh',   approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: 'TC-CC-DN-0024',  tenTochuc: 'Văn phòng Công chứng Đà Nẵng',              loaiHinh: 'Văn phòng CC',     soDKHD: '02024680/TP/ĐKHĐ-CC', diaChi: '78 Trần Phú, Q. Hải Châu, ĐN',          nguoiDaiDien: 'Lê Thị Hồng',      approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: 'TC-DG-HP-0015',  tenTochuc: 'Công ty Đấu giá Hợp danh Hải Phòng',        loaiHinh: 'Công ty HD',       soDKHD: '03012345/TP/ĐKHĐ-DG', diaChi: '45 Điện Biên Phủ, Q. Lê Chân, HP',      nguoiDaiDien: 'Phạm Đức Hùng',    approvalStatus: 'draft',    publicStatus: 'unpublished' },
  { id: '5', ma: 'TC-GD-HN-0008',  tenTochuc: 'Trung tâm Giám định Tư pháp Hà Nội',        loaiHinh: 'Trung tâm',        soDKHD: '04098765/TP/ĐKHĐ-GĐ', diaChi: '101 Trần Hưng Đạo, Q. Hoàn Kiếm, HN',  nguoiDaiDien: 'Hoàng Minh Tuấn',  approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '6', ma: 'TC-TT-HCM-0032', tenTochuc: 'Trung tâm Trọng tài Thương mại Phía Nam',   loaiHinh: 'Trung tâm',        soDKHD: '05024680/TP/ĐKHĐ-TT', diaChi: '200 Lê Lai, Q.1, TP.HCM',               nguoiDaiDien: 'Vũ Quang Huy',     approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '7', ma: 'TC-DG-CT-0087',  tenTochuc: 'Công ty Đấu giá Hợp danh Cần Thơ',         loaiHinh: 'Công ty HD',       soDKHD: '01087654/TP/ĐKHĐ-DG', diaChi: '15 Trần Hưng Đạo, Q. Ninh Kiều, CT',    nguoiDaiDien: 'Lâm Văn Đạt',      approvalStatus: 'reviewing', publicStatus: 'unpublished' },
];

const MOCK_LEGAL_AID_OBJECT: Row[] = [
  { id: '1', ma: 'TGPL-DN-2026-001234', loai: 'Người có công',      cccd: '001078001234', hoTen: 'Nguyễn Thị Bích',     dienTGPL: 'Thương binh hạng 2/4', tinh: 'Hà Nội',     approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: 'TGPL-DN-2026-002345', loai: 'Hộ nghèo',           cccd: '079199001234', hoTen: 'Nguyễn Văn Anh',      dienTGPL: '',                     tinh: 'TP.HCM',     approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: 'TGPL-DN-2025-098765', loai: 'Người dân tộc thiểu số', cccd: '038059003456', hoTen: 'Lý Thị Mai',      dienTGPL: 'DTTS cư trú vùng KK',  tinh: 'Đà Nẵng',    approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: 'TGPL-DN-2026-003456', loai: 'Người cao tuổi',     cccd: '031040004567', hoTen: 'Phạm Văn Cương',       dienTGPL: 'Trên 80 tuổi không lương', tinh: 'Hải Phòng', approvalStatus: 'draft',    publicStatus: 'unpublished' },
  { id: '5', ma: 'TGPL-DN-2026-004567', loai: 'Người khuyết tật',   cccd: '087072005678', hoTen: 'Hoàng Thị Linh',       dienTGPL: 'KT nặng theo hồ sơ',   tinh: 'Cần Thơ',    approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '6', ma: 'TGPL-DN-2026-005678', loai: 'Trẻ em',             cccd: '001018006789', hoTen: 'Vũ Minh Quân',          dienTGPL: 'Trẻ em (dưới 16 tuổi)', tinh: 'Bình Dương', approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '7', ma: 'TGPL-DN-2026-006789', loai: 'Người khuyết tật',   cccd: '079091009012', hoTen: 'Bùi Thị Cẩm Tú',        dienTGPL: 'KT nhẹ theo hồ sơ',      tinh: 'Hà Nội',     approvalStatus: 'reviewing', publicStatus: 'unpublished' },
];

const MOCK_ASSET: Row[] = [
  { id: '1', ma: 'TS-2026-000145', maHopDong: 'HĐ-TC-2026-001234', hieuluc: '01/01/2026 – 01/01/2031', soGCN: 'GCN-QSD-001234567', loaiTaiSan: 'Quyền sử dụng đất',    benBaoDam: 'Nguyễn Văn Hùng',    approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', ma: 'TS-2026-000287', maHopDong: 'HĐ-TC-2026-002345', hieuluc: '15/02/2026 – 15/02/2029', soGCN: '',                  loaiTaiSan: 'Phương tiện ô tô',     benBaoDam: 'Nguyễn Văn Hùng',    approvalStatus: 'approved', publicStatus: 'published' },
  { id: '3', ma: 'TS-2025-008456', maHopDong: 'HĐ-TC-2025-003456', hieuluc: '20/11/2025 – 20/11/2028', soGCN: 'GCN-SHNO-003456789',loaiTaiSan: 'Nhà ở',                benBaoDam: 'Lê Minh Đức',         approvalStatus: 'pending',  publicStatus: 'unpublished' },
  { id: '4', ma: 'TS-2026-000401', maHopDong: 'HĐ-TC-2026-004567', hieuluc: '10/03/2026 – 10/03/2030', soGCN: 'GCN-MMTB-004567890',loaiTaiSan: 'Máy móc thiết bị',     benBaoDam: 'Phạm Quốc Khánh',    approvalStatus: 'rejected', publicStatus: 'unpublished' },
  { id: '5', ma: 'TS-2026-000512', maHopDong: 'HĐ-TC-2026-005678', hieuluc: '25/04/2026 – 25/04/2028', soGCN: 'GCN-HHDV-005678901',loaiTaiSan: 'Hàng hóa trong kho',   benBaoDam: 'Hoàng Đức Lân',      approvalStatus: 'draft',    publicStatus: 'unpublished' },
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

// ─── Liên kết chéo thực thể: cùng một chủ thể (CCCD) xuất hiện ở nhiều loại dữ liệu chủ khác nhau ──
const CATEGORY_LABELS: Record<DataCategory, string> = {
  'enforcement':      'Thi hành án dân sự',
  'civil-registry':   'Hộ tịch',
  'nationality':      'Quốc tịch',
  'individual':       'Cá nhân hành nghề bổ trợ tư pháp',
  'organization':     'Tổ chức hành nghề bổ trợ tư pháp',
  'legal-aid-object': 'Đối tượng trợ giúp pháp lý',
  'asset':            'Tài sản bảo đảm',
};

function normalizeIdentifier(value: string): string {
  return (value || '').replace(/\D/g, ''); // chỉ giữ chữ số, bỏ khoảng trắng/gạch nối
}

// Cấu hình quan hệ giữa các danh mục dữ liệu chủ — giống mục "Thiết lập quan hệ giữa thực thể"
// (chọn 2 thực thể, khai báo khóa liên kết). Liên kết chéo thực thể ở màn Chi tiết bản ghi
// được xác định dựa trên các quan hệ khai báo tại đây, không hard-code cố định 1 trường cho từng danh mục.
type CategoryRelationType = 'one-to-one' | 'one-to-many' | 'many-to-many';

interface CategoryRelationship {
  id: string;
  categoryA: DataCategory;
  fieldA: string; // Khóa liên kết phía categoryA
  categoryB: DataCategory;
  fieldB: string; // Khóa liên kết phía categoryB
  relationType: CategoryRelationType;
  description: string;
  status: 'active' | 'inactive';
}

const CATEGORY_RELATIONSHIPS: CategoryRelationship[] = [
  { id: 'rel-enf-ind',   categoryA: 'enforcement', fieldA: 'cccd', categoryB: 'individual',       fieldB: 'cccd', relationType: 'many-to-many', description: 'Đương sự trong quyết định THA có thể đồng thời là cá nhân hành nghề bổ trợ tư pháp', status: 'active' },
  { id: 'rel-enf-legal', categoryA: 'enforcement', fieldA: 'cccd', categoryB: 'legal-aid-object', fieldB: 'cccd', relationType: 'many-to-many', description: 'Đương sự trong quyết định THA có thể đồng thời là đối tượng trợ giúp pháp lý',        status: 'active' },
  { id: 'rel-ind-legal', categoryA: 'individual',  fieldA: 'cccd', categoryB: 'legal-aid-object', fieldB: 'cccd', relationType: 'many-to-many', description: 'Cá nhân hành nghề bổ trợ tư pháp có thể đồng thời là đối tượng trợ giúp pháp lý',       status: 'active' },
];

function categoryHasCrossEntityConfig(category: DataCategory): boolean {
  return CATEGORY_RELATIONSHIPS.some(rel => rel.status === 'active' && (rel.categoryA === category || rel.categoryB === category));
}

interface CrossEntityLink {
  category: DataCategory;
  categoryLabel: string;
  row: Row;
}

interface CategoryRelationshipIndexEntry {
  relationship: CategoryRelationship;
  mapA: Map<string, Row[]>;
  mapB: Map<string, Row[]>;
}

function buildCategoryRelationshipIndex(
  relationships: CategoryRelationship[],
  dataByCategory: Record<DataCategory, Row[]>
): CategoryRelationshipIndexEntry[] {
  const buildKeyMap = (category: DataCategory, field: string) => {
    const map = new Map<string, Row[]>();
    dataByCategory[category].forEach(row => {
      const key = normalizeIdentifier(row[field]);
      if (!key) return;
      map.set(key, [...(map.get(key) ?? []), row]);
    });
    return map;
  };
  return relationships
    .filter(rel => rel.status === 'active')
    .map(rel => ({
      relationship: rel,
      mapA: buildKeyMap(rel.categoryA, rel.fieldA),
      mapB: buildKeyMap(rel.categoryB, rel.fieldB),
    }));
}

// Xây 1 lần từ dữ liệu mock gốc — trong hệ thống thật nên build từ nguồn dữ liệu tổng hợp,
// không build lại mỗi lần mở modal.
const CATEGORY_RELATIONSHIP_INDEX = buildCategoryRelationshipIndex(CATEGORY_RELATIONSHIPS, MOCK_BY_CATEGORY);

function getCrossEntityLinks(row: Row, category: DataCategory): CrossEntityLink[] {
  const links: CrossEntityLink[] = [];
  CATEGORY_RELATIONSHIP_INDEX.forEach(({ relationship, mapA, mapB }) => {
    const isSideA = relationship.categoryA === category;
    const isSideB = relationship.categoryB === category;
    if (!isSideA && !isSideB) return;

    const ownField = isSideA ? relationship.fieldA : relationship.fieldB;
    const otherCategory = isSideA ? relationship.categoryB : relationship.categoryA;
    const otherMap = isSideA ? mapB : mapA;

    const key = normalizeIdentifier(row[ownField]);
    if (!key) return;

    (otherMap.get(key) ?? []).forEach(otherRow => {
      if (otherCategory === category && otherRow.id === row.id) return;
      links.push({ category: otherCategory, categoryLabel: CATEGORY_LABELS[otherCategory], row: otherRow });
    });
  });
  return links;
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

// Nhóm các bản ghi trùng lặp — mỗi nhóm có thể có nhiều hơn 2 bản ghi
function computeDuplicateGroups(rows: Row[], category: DataCategory): Row[][] {
  const groups: Record<string, Row[]> = {};
  rows.forEach(r => {
    const key = getDuplicateKeyValue(r, category);
    if (!key) return;
    (groups[key] = groups[key] || []).push(r);
  });
  return Object.values(groups).filter(group => group.length > 1);
}

function isRowIncomplete(row: Row, cols: ColDef[]): boolean {
  return cols.some(col => !row[col.key] || row[col.key].trim() === '');
}

// ─── Lịch sử phiên bản bản ghi (mô phỏng) ─────────────────────────────────────

interface RecordVersion {
  version: number;
  updatedAt: string;
  updatedBy: string;
  action: string;
  values: Record<string, string>;
}

function buildRecordVersionHistory(row: Row, cols: ColDef[]): RecordVersion[] {
  const currentValues: Record<string, string> = {};
  cols.forEach(col => { currentValues[col.key] = row[col.key] || ''; });

  const initialValues = { ...currentValues };
  const lastCol = cols[cols.length - 1];
  if (lastCol) initialValues[lastCol.key] = '';

  const reviewedValues = { ...currentValues };

  return [
    { version: 1, updatedAt: '26:11:2025 08:00', updatedBy: 'Hệ thống nguồn (đồng bộ tự động)', action: 'Khởi tạo bản ghi',              values: initialValues },
    { version: 2, updatedAt: '26:05:2026 14:30', updatedBy: 'Cán bộ nghiệp vụ',                  action: 'Bổ sung, chỉnh sửa dữ liệu',     values: reviewedValues },
    { version: 3, updatedAt: '23:07:2026 09:15', updatedBy: 'Cán bộ nghiệp vụ',                  action: 'Cập nhật gần nhất (hiện tại)',   values: currentValues },
  ];
}

// ─── Mock "Các bản ghi chờ rà soát" — giống mục Kiểm thử ở Bước 3 wizard Tạo mới dữ liệu chủ ──

const MOCK_REVIEW_ITEMS = [
  { id: 'rev-1', pair: 'HT-0451 ↔ CC-1123', score: 82, reason: 'Trùng họ tên và ngày sinh nhưng khác số định danh' },
  { id: 'rev-2', pair: 'HT-0777 ↔ CC-2098', score: 78, reason: 'Tên tương đồng chuỗi nhưng địa chỉ khác nhau' },
  { id: 'rev-3', pair: 'HT-0912 ↔ CC-3011', score: 85, reason: 'Trùng số CCCD nhưng họ tên thiếu tên đệm' },
  { id: 'rev-4', pair: 'HT-1204 ↔ CC-4150', score: 76, reason: 'Trùng họ tên, ngày sinh nhưng khác tỉnh thành thường trú' },
  { id: 'rev-5', pair: 'HT-1588 ↔ CC-5099', score: 80, reason: 'Số định danh gần đúng, khác ngày cấp CCCD' },
];

// ─── Mock "Các bản ghi không khớp" — giống mục Quy tắc hợp nhất ở Bước 3 wizard Tạo mới dữ liệu chủ ──

const MOCK_UNMATCHED_ITEMS = [
  { id: 'unmatch-1', record: 'HT-9901', sourceName: 'Hộ tịch', maxScore: 42, reason: 'Không tìm thấy bản ghi tương đồng vượt ngưỡng 75%', defaultAction: '' as const },
  { id: 'unmatch-2', record: 'CC-8820', sourceName: 'CCCD', maxScore: 35, reason: 'Số định danh và thông tin cá nhân khác biệt hoàn toàn', defaultAction: '' as const },
  { id: 'unmatch-3', record: 'HT-9945', sourceName: 'Hộ tịch', maxScore: 48, reason: 'Trùng ngày sinh nhưng thông tin tên không trùng khớp', defaultAction: '' as const },
  { id: 'unmatch-4', record: 'CC-9102', sourceName: 'CCCD', maxScore: 28, reason: 'Bản ghi thiếu thông tin định danh tối thiểu', defaultAction: '' as const },
  { id: 'unmatch-5', record: 'HT-9988', sourceName: 'Hộ tịch', maxScore: 50, reason: 'Điểm so khớp thấp hơn ngưỡng rà soát 75%', defaultAction: '' as const },
];

const MOCK_APPROVERS = [
  { id: 'a1', name: 'Nguyễn Văn An',  position: 'Trưởng phòng',        department: 'Phòng Quản lý dữ liệu' },
  { id: 'a2', name: 'Trần Thị Bình',  position: 'Phó Cục trưởng',      department: 'Cục Hành chính tư pháp' },
  { id: 'a3', name: 'Lê Minh Cường',  position: 'Chuyên viên cao cấp', department: 'Vụ Kế hoạch - Tài chính' },
  { id: 'a4', name: 'Phạm Quốc Hùng', position: 'Cục trưởng',          department: 'Cục Công nghệ thông tin' },
  { id: 'a5', name: 'Hoàng Thị Lan',  position: 'Trưởng phòng',        department: 'Phòng Nghiệp vụ pháp lý' },
];

// ─── Tab rà soát trùng lặp: tự động gộp / chờ rà soát / không khớp ──

type PairBucket = 'auto' | 'review' | 'mismatch';

// ─── Status badges ────────────────────────────────────────────────────────────

export function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  if (status === 'approved')
    return <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-[12px] rounded-full whitespace-nowrap">Đã phê duyệt</span>;
  if (status === 'pending')
    return <span className="px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 text-[12px] rounded-full whitespace-nowrap">Chờ phê duyệt</span>;
  if (status === 'reviewing')
    return <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[12px] rounded-full whitespace-nowrap">Rà soát</span>;
  if (status === 'rejected')
    return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-[12px] rounded-full whitespace-nowrap">Từ chối</span>;
  if (status === 'deleted')
    return <span className="px-3 py-1 bg-slate-200 text-slate-600 border border-slate-300 text-[12px] rounded-full whitespace-nowrap">Đã xóa</span>;
  return <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-[12px] rounded-full whitespace-nowrap">Chưa phê duyệt</span>;
}

function PublicBadge({ status }: { status: PublicStatus }) {
  if (status === 'published')
    return <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-[12px] rounded-full whitespace-nowrap">Đã công khai</span>;
  return <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 text-[12px] rounded-full whitespace-nowrap">Chưa công khai</span>;
}

function DataStatusBadge({ status }: { status: 'new' | 'updated' }) {
  if (status === 'new')
    return <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[12px] rounded-full whitespace-nowrap">Mới</span>;
  return <span className="px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 text-[12px] rounded-full whitespace-nowrap">Cập nhật</span>;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  masterId: string;
  masterLabel: string;
}

export function MasterDataUpdateItemPage({ masterId, masterLabel }: Props) {
  const [activeTab, setActiveTab] = useState<'list' | 'approval'>('list');
  // Lịch sử đồng bộ — modal mở từ nút cạnh "Đồng bộ dữ liệu" trong tab Dữ liệu
  const [showSyncHistoryModal, setShowSyncHistoryModal] = useState(false);
  // Chọn 1 lần đồng bộ để xem chi tiết bản ghi theo 3 nhóm kết quả
  const [syncHistorySelectedId, setSyncHistorySelectedId] = useState<string | null>(null);
  // Đóng/mở từng khối kết quả (thành công / trùng lặp / thiếu dữ liệu) khi xem chi tiết 1 lần đồng bộ
  const [syncDetailCollapsed, setSyncDetailCollapsed] = useState<{ success: boolean; duplicate: boolean; incomplete: boolean }>({ success: false, duplicate: false, incomplete: false });
  // Mở/đóng từng nhóm bản ghi trùng lặp (1 nhóm có thể có nhiều hơn 2 bản ghi)
  const [expandedDuplicateGroups, setExpandedDuplicateGroups] = useState<Set<number>>(new Set());
  const toggleDuplicateGroup = (idx: number) => {
    setExpandedDuplicateGroups(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };
  const [searchQuery, setSearchQuery] = useState('');
  // Đang hoạt động / Đã xóa — tách bản ghi đã xóa mềm (approvalStatus === 'deleted') khỏi danh sách chính
  const [listViewMode, setListViewMode] = useState<'active' | 'trash'>('active');
  // Bộ lọc nâng cao: trạng thái phê duyệt / trạng thái công khai / trạng thái dữ liệu
  const [showFilters, setShowFilters] = useState(false);
  const [approvalFilter, setApprovalFilter] = useState<'all' | Exclude<ApprovalStatus, 'deleted'>>('all');
  const [publicFilterState, setPublicFilterState] = useState<'all' | PublicStatus>('all');
  const [dataStatusFilter, setDataStatusFilter] = useState<'all' | 'new' | 'updated'>('all');
  // Đồng bộ dữ liệu (UC1 — nguồn phát sinh bản ghi Mới/Cập nhật, theo quy tắc ở Mô hình dữ liệu chủ)
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const config = ITEM_CONFIGS[masterId] || { category: 'individual' as DataCategory, unit: '—', system: '—', idLabel: 'Mã' };
  const cols = COLUMNS[config.category];
  const approvalListCols = cols.slice(0, 4);

  // Dữ liệu bản ghi — lưu trong state để có thể phê duyệt/từ chối trực tiếp
  const [recordsData, setRecordsData] = useState<Row[]>(() => getMockData(masterId, config.category));
  const allData = recordsData;

  // Phê duyệt (giống tab Phê duyệt tại Biên tập danh mục)
  const [approvalStatusFilter, setApprovalStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedApprovalIds, setSelectedApprovalIds] = useState<string[]>([]);
  // UC492 — modal lý do từ chối & xem chi tiết bản ghi
  const [rejectModal, setRejectModal] = useState<{ open: boolean; ids: string[]; reason: string }>({ open: false, ids: [], reason: '' });
  // UC493 — modal lý do hủy phê duyệt
  const [unapproveModal, setUnapproveModal] = useState<{ open: boolean; id: string; reason: string }>({ open: false, id: '', reason: '' });
  // Xóa / khôi phục bản ghi
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [detailRow, setDetailRow] = useState<Row | null>(null);
  const [detailTab, setDetailTab] = useState<'values' | 'history' | 'related' | 'warnings'>('values');
  const [compareVersionIdx, setCompareVersionIdx] = useState(0);
  const [historyView, setHistoryView] = useState<'list' | 'compare'>('list');
  const [showOriginalData, setShowOriginalData] = useState(false);
  // Mở từ tab "Dữ liệu" chỉ hiện Giá trị dữ liệu chủ; mở từ tab "Phê duyệt" vẫn giữ đủ các tab
  const [detailRowContext, setDetailRowContext] = useState<'list' | 'approval'>('list');
  // Xem toàn bộ trường dữ liệu của bản ghi liên kết chéo thực thể (mục "Thông tin liên quan")
  const [viewingLinkedRecord, setViewingLinkedRecord] = useState<CrossEntityLink | null>(null);

  const handleOpenDetail = (row: Row, context: 'list' | 'approval' = 'list') => {
    setDetailRow(row);
    setDetailTab('values');
    setCompareVersionIdx(0);
    setHistoryView('list');
    setDetailRowContext(context);
  };

  // Mở từ tab "Phiên bản" (báo cáo lịch sử thay đổi gộp mọi bản ghi) — modal riêng, chỉ có nội dung so sánh
  // Chỉ 1 modal phiên bản hiển thị tại 1 thời điểm: mở modal mới sẽ đóng modal trước đó,
  // và "returnToRowReport" ghi nhớ modal báo cáo riêng-1-bản-ghi để "Quay lại" mở lại đúng chỗ.
  const [versionCompareModal, setVersionCompareModal] = useState<{ row: Row; versionIdx: number; returnToRowReport: Row | null } | null>(null);
  const handleOpenVersionCompare = (row: Row, versionIdx: number, returnToRowReport: Row | null = null) => {
    setRowVersionReportRow(null);
    setVersionSnapshot(null);
    setVersionCompareModal({ row, versionIdx, returnToRowReport });
  };
  const closeVersionCompareModal = () => {
    const returnRow = versionCompareModal?.returnToRowReport ?? null;
    setVersionCompareModal(null);
    if (returnRow) setRowVersionReportRow(returnRow);
  };

  // Xem chi tiết dữ liệu của một phiên bản cụ thể (snapshot, không so sánh)
  const [versionSnapshot, setVersionSnapshot] = useState<{ row: Row; version: RecordVersion; returnToRowReport: Row | null } | null>(null);
  const openVersionSnapshot = (row: Row, version: RecordVersion, returnToRowReport: Row | null = null) => {
    setRowVersionReportRow(null);
    setVersionCompareModal(null);
    setVersionSnapshot({ row, version, returnToRowReport });
  };
  const closeVersionSnapshot = () => {
    const returnRow = versionSnapshot?.returnToRowReport ?? null;
    setVersionSnapshot(null);
    if (returnRow) setRowVersionReportRow(returnRow);
  };

  // Báo cáo lịch sử phiên bản của riêng 1 bản ghi — mở từ nút "Phiên bản" ở tab Dữ liệu
  const [rowVersionReportRow, setRowVersionReportRow] = useState<Row | null>(null);
  const openRowVersionReport = (row: Row) => {
    setVersionSnapshot(null);
    setVersionCompareModal(null);
    setRowVersionReportRow(row);
  };

  // Báo cáo lịch sử phiên bản của riêng 1 bản ghi
  const handleDownloadRowChangeReport = (row: Row) => {
    const lines: string[] = [];
    lines.push('Mã bản ghi;Phiên bản;Người cập nhật;Ngày phát hành;Trạng thái');
    const history = buildRecordVersionHistory(row, cols);
    const latest = history[history.length - 1];
    history.slice().reverse().forEach(v => {
      const status = v.version === latest.version ? 'Hiệu lực' : 'Lưu trữ';
      lines.push(`${row[cols[0].key]};v${v.version};${v.updatedBy};${v.updatedAt};${status}`);
    });
    const csv = '﻿' + lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bao-cao-lich-su-thay-doi-${row[cols[0].key]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Rà soát dữ liệu — gợi ý trùng lặp & cảnh báo thiếu dữ liệu (giao dịch 2), chỉnh sửa/đánh dấu đang rà soát (giao dịch 3)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, string>>({});

  // Gửi phê duyệt — chọn người duyệt + nội dung trình duyệt (áp dụng cho gửi từng dòng hoặc hàng loạt)
  const [showSendApprovalModal, setShowSendApprovalModal] = useState(false);
  const [sendApprovalIds, setSendApprovalIds] = useState<string[]>([]);
  const [sendApprovalApprover, setSendApprovalApprover] = useState('');
  const [sendApprovalNote, setSendApprovalNote] = useState('');

  // Thẻ đếm rà soát: tự động gộp / chờ rà soát / không khớp
  const [activeReviewCard, setActiveReviewCard] = useState<PairBucket>('auto');
  const [resolvedPairIds, setResolvedPairIds] = useState<string[]>([]);
  const [reviewSelectedPairIds, setReviewSelectedPairIds] = useState<string[]>([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [unmatchedSelectedIds, setUnmatchedSelectedIds] = useState<string[]>([]);
  const [unmatchedProcessedIds, setUnmatchedProcessedIds] = useState<string[]>([]);
  const [unmatchedActions, setUnmatchedActions] = useState<Record<string, 'single_source' | 'discard' | ''>>({});
  const [unmatchedPage, setUnmatchedPage] = useState(1);

  const duplicateIds = computeDuplicateIds(allData, config.category);
  const incompleteIds = new Set(allData.filter(r => isRowIncomplete(r, cols)).map(r => r.id));
  const duplicateGroups = computeDuplicateGroups(allData, config.category);
  const duplicateGroupIndexById = new Map<string, number>();
  duplicateGroups.forEach((group, idx) => group.forEach(r => duplicateGroupIndexById.set(r.id, idx + 1)));

  const reviewPairs = MOCK_REVIEW_ITEMS;

  // Lịch sử đồng bộ (UC1) — mỗi lần đồng bộ chia bản ghi thành 3 nhóm kết quả theo quy tắc đã cấu hình
  const syncSuccessIds = allData.filter(r => r.approvalStatus !== 'deleted' && !duplicateIds.has(r.id) && !incompleteIds.has(r.id)).map(r => r.id);
  const syncDuplicateIds = Array.from(duplicateIds);
  const syncIncompleteIds = Array.from(incompleteIds);

  const syncHistoryEntries: {
    id: string;
    syncedAt: string;
    performedBy: string;
    approvalStatus: 'pending' | 'approved' | 'archived';
    newCount: number;
    updatedCount: number;
    unchangedCount: number;
    duration: string;
    previousSyncedAt: string;
    successIds: string[];
    duplicateIds: string[];
    incompleteIds: string[];
  }[] = [
    {
      id: 'sync-1',
      syncedAt: '24/12/2024 08:30',
      performedBy: 'Hệ thống',
      approvalStatus: 'pending',
      newCount: 3,
      updatedCount: 4,
      unchangedCount: 3,
      duration: '1 phút 42 giây',
      previousSyncedAt: '15/12/2024 09:00',
      successIds: syncSuccessIds,
      duplicateIds: syncDuplicateIds,
      incompleteIds: syncIncompleteIds,
    },
    {
      id: 'sync-2',
      syncedAt: '15/12/2024 09:00',
      performedBy: 'Hệ thống',
      approvalStatus: 'approved',
      newCount: 5,
      updatedCount: 2,
      unchangedCount: 3,
      duration: '1 phút 18 giây',
      previousSyncedAt: '05/12/2024 08:00',
      successIds: syncSuccessIds,
      duplicateIds: syncDuplicateIds,
      incompleteIds: syncIncompleteIds,
    },
    {
      id: 'sync-3',
      syncedAt: '05/12/2024 08:00',
      performedBy: 'Hệ thống',
      approvalStatus: 'archived',
      newCount: 6,
      updatedCount: 1,
      unchangedCount: 3,
      duration: '58 giây',
      previousSyncedAt: '—',
      successIds: syncSuccessIds,
      duplicateIds: syncDuplicateIds,
      incompleteIds: syncIncompleteIds,
    },
  ];

  const syncHistorySelected = syncHistoryEntries.find(s => s.id === syncHistorySelectedId) || null;

  const activeData = allData.filter(r => r.approvalStatus !== 'deleted');
  const trashData = allData.filter(r => r.approvalStatus === 'deleted');
  // Giới hạn số bản ghi mock hiển thị ở báo cáo "Phiên bản" cho gọn

  const listData = (listViewMode === 'active' ? activeData : trashData).filter(r => {
    if (approvalFilter !== 'all' && r.approvalStatus !== approvalFilter) return false;
    if (publicFilterState !== 'all' && r.publicStatus !== publicFilterState) return false;
    if (dataStatusFilter !== 'all' && getDataStatus(r) !== dataStatusFilter) return false;
    if (!searchQuery) return true;
    return Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()));
  });

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
    setRecordsData(prev => prev.map(r => ids.includes(r.id) ? { ...r, approvalStatus: status, unapproveReason: '' } : r));
    setSelectedApprovalIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const handleApproveOne = (id: string) => setApprovalStatusForIds([id], 'approved');

  // UC492 — Từ chối phải kèm lý do (mở modal nhập lý do, áp dụng cho 1 hoặc nhiều bản ghi)
  const openRejectModal = (ids: string[]) => setRejectModal({ open: true, ids, reason: '' });
  const handleRejectOne = (id: string) => openRejectModal([id]);

  const handleConfirmReject = () => {
    if (!rejectModal.reason.trim()) {
      alert('Vui lòng nhập lý do từ chối!');
      return;
    }
    const ids = rejectModal.ids;
    const reason = rejectModal.reason.trim();
    setRecordsData(prev => prev.map(r => ids.includes(r.id) ? { ...r, approvalStatus: 'rejected', rejectReason: reason, unapproveReason: '' } : r));
    setSelectedApprovalIds(prev => prev.filter(id => !ids.includes(id)));
    setRejectModal({ open: false, ids: [], reason: '' });
    alert('Đã từ chối phê duyệt kèm lý do. Trạng thái cập nhật và thông báo đã gửi tới cán bộ nghiệp vụ.');
  };

  // UC493 — Hủy phê duyệt: mở modal nhập lý do, đưa bản ghi đã duyệt về "Chờ phê duyệt", ghi log & thông báo
  const openUnapproveModal = (id: string) => setUnapproveModal({ open: true, id, reason: '' });

  const handleConfirmUnapprove = () => {
    if (!unapproveModal.reason.trim()) {
      alert('Vui lòng nhập lý do hủy phê duyệt!');
      return;
    }
    const id = unapproveModal.id;
    const reason = unapproveModal.reason.trim();
    setRecordsData(prev => prev.map(r => r.id === id ? { ...r, approvalStatus: 'pending', unapproveReason: reason } : r));
    setUnapproveModal({ open: false, id: '', reason: '' });
    alert('Đã hủy phê duyệt kèm lý do. Bản ghi chuyển về "Chờ phê duyệt", ghi nhận log thao tác và gửi thông báo tới cán bộ nghiệp vụ.');
  };

  // Xóa bản ghi: cảnh báo trước khi xóa, chuyển trạng thái phê duyệt sang "Đã xóa"
  const openDeleteModal = (id: string) => setDeleteModal({ open: true, id });

  const handleConfirmDelete = () => {
    const id = deleteModal.id;
    setRecordsData(prev => prev.map(r => r.id === id ? { ...r, approvalStatus: 'deleted' } : r));
    setDeleteModal({ open: false, id: '' });
  };

  // Khôi phục bản ghi đã xóa: đưa trạng thái phê duyệt về "Rà soát"
  const handleRestoreDeleted = (id: string) => {
    setRecordsData(prev => prev.map(r => r.id === id ? { ...r, approvalStatus: 'reviewing' } : r));
  };

  // Đồng bộ dữ liệu (UC1 — nguồn phát sinh bản ghi Mới/Cập nhật, theo quy tắc ở Mô hình dữ liệu chủ)
  const handleConfirmSync = () => {
    setShowSyncModal(false);
    const newCount = Math.max(1, Math.round(cols.length / 3));
    const updatedCount = Math.max(1, Math.round(cols.length / 4));
    alert(
      `Đang đồng bộ… hoàn tất: ${newCount} bản ghi Mới, ${updatedCount} bản ghi Cập nhật đã vào danh sách với trạng thái "Chưa phê duyệt" để rà soát.` +
      (duplicateIds.size > 0 ? ` ${duplicateIds.size} bản ghi nghi trùng lặp cần kiểm tra thủ công.` : '')
    );
  };

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
    openRejectModal(selectedApprovalIds);
  };

  // ─── Rà soát dữ liệu handlers ─────────────────────────────────────────────

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
    setRecordsData(prev => prev.map(r => r.id === editingRowId ? { ...r, ...editFormData, approvalStatus: 'reviewing', publicStatus: 'unpublished' } : r));
    handleCloseEdit();
    alert('Đã lưu thay đổi tạm thời. Bản ghi được đánh dấu "Đang rà soát" và chuyển về "Chưa công khai".');
  };

  // Chỉ bản ghi Soạn thảo/Rà soát/Từ chối mới cần (và có thể) gửi duyệt lại
  const isSendableStatus = (status: ApprovalStatus) => status === 'draft' || status === 'reviewing' || status === 'rejected';

  // Trạng thái dữ liệu: Mới (chưa từng chỉnh sửa từ khi đồng bộ) / Cập nhật (đã có chỉnh sửa)
  const getDataStatus = (row: Row): 'new' | 'updated' => Number(row.id) % 3 === 0 ? 'new' : 'updated';

  // Mở modal "Gửi phê duyệt" — dùng chung cho gửi từng dòng và gửi hàng loạt
  const handleOpenSendApproval = (ids: string[]) => {
    const rows = recordsData.filter(r => ids.includes(r.id));
    if (rows.some(r => isRowIncomplete(r, cols))) {
      alert('Một số bản ghi còn thiếu dữ liệu bắt buộc. Vui lòng bổ sung đầy đủ thông tin trước khi gửi phê duyệt.');
      return;
    }
    setSendApprovalIds(ids);
    setSendApprovalApprover('');
    setSendApprovalNote('');
    setShowSendApprovalModal(true);
  };

  const handleCloseSendApproval = () => {
    setShowSendApprovalModal(false);
    setSendApprovalIds([]);
    setSendApprovalApprover('');
    setSendApprovalNote('');
  };

  const handleConfirmSendApproval = () => {
    if (!sendApprovalApprover) return;
    setRecordsData(prev => prev.map(r => sendApprovalIds.includes(r.id) ? { ...r, approvalStatus: 'pending', submissionContent: sendApprovalNote } : r));
    alert(`Đã gửi ${sendApprovalIds.length} bản ghi đi phê duyệt. Trạng thái cập nhật thành "Chờ phê duyệt" và thông báo đã được gửi tới người duyệt.`);
    handleCloseSendApproval();
    setSelectedRecordIds([]);
  };

  // ─── Công khai handlers ───────────────────────────────────────────────────
  // Công khai / Hủy công khai theo từng bản ghi tại lưới dữ liệu
  const handlePublishRecord = (id: string) => {
    setRecordsData(prev => prev.map(r => r.id === id ? { ...r, publicStatus: 'published' } : r));
    alert('Công khai dữ liệu chủ thành công.');
  };

  const handleUnpublishRecord = (id: string) => {
    setRecordsData(prev => prev.map(r => r.id === id ? { ...r, publicStatus: 'unpublished' } : r));
    alert('Hủy công khai dữ liệu thành công.');
  };

  // Công khai / Hủy công khai hàng loạt theo các bản ghi đang được chọn
  const handleBulkPublish = (ids: string[]) => {
    setRecordsData(prev => prev.map(r => ids.includes(r.id) && r.approvalStatus === 'approved' ? { ...r, publicStatus: 'published' } : r));
    alert('Công khai dữ liệu chủ thành công.');
    setSelectedRecordIds([]);
  };

  const handleBulkUnpublish = (ids: string[]) => {
    setRecordsData(prev => prev.map(r => ids.includes(r.id) ? { ...r, publicStatus: 'unpublished' } : r));
    alert('Hủy công khai dữ liệu thành công.');
    setSelectedRecordIds([]);
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
          {/* Segmented: Đang hoạt động / Đã xóa + Action Buttons cùng hàng */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit text-[13px] font-medium shrink-0">
              <button
                type="button"
                onClick={() => { setListViewMode('active'); setCurrentPageNum(1); }}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${listViewMode === 'active' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Đang hoạt động <span className="text-slate-400">({activeData.length})</span>
              </button>
              <button
                type="button"
                onClick={() => { setListViewMode('trash'); setCurrentPageNum(1); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${listViewMode === 'trash' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Đã xóa <span className="text-slate-400">({trashData.length})</span>
              </button>
            </div>
            {listViewMode === 'active' && (
            <div className="flex items-center gap-2 flex-nowrap justify-end overflow-x-auto">
              <button
                type="button"
                onClick={() => selectedRecordIds.length > 0 && handleOpenSendApproval(selectedRecordIds)}
                disabled={selectedRecordIds.length === 0}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-all active:scale-95 whitespace-nowrap ${
                  selectedRecordIds.length > 0
                    ? 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer'
                    : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                Gửi duyệt
              </button>
              <button
                type="button"
                onClick={() => selectedRecordIds.length > 0 && handleBulkPublish(selectedRecordIds)}
                disabled={selectedRecordIds.length === 0}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-all active:scale-95 whitespace-nowrap ${
                  selectedRecordIds.length > 0
                    ? 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer'
                    : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Globe className="w-4 h-4" />
                Công khai
              </button>
              <button
                type="button"
                onClick={() => selectedRecordIds.length > 0 && handleBulkUnpublish(selectedRecordIds)}
                disabled={selectedRecordIds.length === 0}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-all active:scale-95 whitespace-nowrap ${
                  selectedRecordIds.length > 0
                    ? 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer'
                    : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Lock className="w-4 h-4" />
                Hủy công khai
              </button>
            </div>
            )}
          </div>

          {/* Search & Action Bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setCurrentPageNum(1); }}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                />
              </div>
              <button
                type="button"
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}
                title="Bộ lọc"
              >
                {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
              </button>
            </div>
            {listViewMode === 'active' && (
            <div className="flex items-center gap-2 flex-nowrap justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowSyncModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium transition-all cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <RefreshCw className="w-4 h-4" />
                Đồng bộ dữ liệu
              </button>
              <button
                type="button"
                onClick={() => setShowSyncHistoryModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg text-[13px] font-medium transition-all cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <Clock className="w-4 h-4" />
                Lịch sử đồng bộ
              </button>
            </div>
            )}
          </div>

          {/* Bộ lọc nâng cao (Collapsible) */}
          {showFilters && (
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-700">Trạng thái phê duyệt</label>
                <select
                  value={approvalFilter}
                  onChange={e => { setApprovalFilter(e.target.value as typeof approvalFilter); setCurrentPageNum(1); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="draft">Chưa phê duyệt</option>
                  <option value="reviewing">Rà soát</option>
                  <option value="pending">Chờ phê duyệt</option>
                  <option value="approved">Đã phê duyệt</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-700">Trạng thái công khai</label>
                <select
                  value={publicFilterState}
                  onChange={e => { setPublicFilterState(e.target.value as typeof publicFilterState); setCurrentPageNum(1); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đã công khai</option>
                  <option value="unpublished">Chưa công khai</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-700">Trạng thái dữ liệu</label>
                <select
                  value={dataStatusFilter}
                  onChange={e => { setDataStatusFilter(e.target.value as typeof dataStatusFilter); setCurrentPageNum(1); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="new">Mới</option>
                  <option value="updated">Cập nhật</option>
                </select>
              </div>
            </div>
          )}

          {/* Grid Table + Pagination */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-4 w-10 text-center">
                      <input
                        type="checkbox"
                        title="Chọn tất cả bản ghi có thể gửi duyệt"
                        checked={
                          paginatedData.filter(r => isSendableStatus(r.approvalStatus)).length > 0 &&
                          paginatedData.filter(r => isSendableStatus(r.approvalStatus)).every(r => selectedRecordIds.includes(r.id))
                        }
                        onChange={(e) => {
                          const eligibleIds = paginatedData.filter(r => isSendableStatus(r.approvalStatus)).map(r => r.id);
                          if (e.target.checked) {
                            setSelectedRecordIds(prev => Array.from(new Set([...prev, ...eligibleIds])));
                          } else {
                            setSelectedRecordIds(prev => prev.filter(id => !eligibleIds.includes(id)));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap w-14 text-center">STT</th>
                    {cols.slice(0, 3).map(col => (
                      <th key={col.key} className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Trạng thái dữ liệu</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Phê duyệt</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Công khai</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-20">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedData.map((row, index) => {
                    const isDup = duplicateIds.has(row.id);
                    const isIncomplete = incompleteIds.has(row.id);
                    return (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 text-center">
                        {isSendableStatus(row.approvalStatus) ? (
                          <input
                            type="checkbox"
                            title="Chọn bản ghi"
                            checked={selectedRecordIds.includes(row.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedRecordIds(prev => [...prev, row.id]);
                              else setSelectedRecordIds(prev => prev.filter(id => id !== row.id));
                            }}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          />
                        ) : <span className="w-4 h-4 inline-block" />}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-slate-500 text-center">{(currentPageNum - 1) * pageSize + index + 1}</td>
                      {cols.slice(0, 3).map(col => (
                        <td key={col.key} className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap max-w-[200px] truncate">
                          {row[col.key] || <span className="text-slate-400 italic">(trống)</span>}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-center"><DataStatusBadge status={getDataStatus(row)} /></td>
                      <td className="px-6 py-4 text-center"><ApprovalBadge status={row.approvalStatus} /></td>
                      <td className="px-6 py-4 text-center"><PublicBadge status={row.publicStatus} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          {row.approvalStatus === 'deleted' ? (
                            <button
                              onClick={() => handleRestoreDeleted(row.id)}
                              className="p-1.5 rounded-lg transition-colors cursor-pointer text-slate-900 hover:bg-slate-100"
                              title="Khôi phục bản ghi"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleOpenDetail(row)}
                                className="p-1.5 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Xem chi tiết bản ghi"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    className="p-1.5 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer focus:outline-none"
                                    title="Thao tác khác"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 text-[13px] bg-white border border-slate-200 shadow-[0_10px_25px_rgba(15,23,42,0.15)]">
                                  <DropdownMenuItem className="text-[13px]" onClick={() => openRowVersionReport(row)}>
                                    <Clock className="w-4 h-4 text-slate-500" />
                                    Phiên bản
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-[13px]" onClick={() => handleOpenEdit(row)}>
                                    <SquarePen className="w-4 h-4 text-slate-500" />
                                    Rà soát bản ghi dữ liệu chủ
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-[13px]"
                                    disabled={row.approvalStatus !== 'draft' && row.approvalStatus !== 'reviewing' && row.approvalStatus !== 'rejected'}
                                    onClick={() => handleOpenSendApproval([row.id])}
                                  >
                                    <Send className="w-4 h-4 text-indigo-500" />
                                    Trình duyệt
                                  </DropdownMenuItem>
                                  {row.publicStatus === 'published' ? (
                                    <DropdownMenuItem className="text-[13px]" onClick={() => handleUnpublishRecord(row.id)}>
                                      <Lock className="w-4 h-4 text-slate-500" />
                                      Hủy công khai
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      className="text-[13px]"
                                      disabled={row.approvalStatus !== 'approved'}
                                      onClick={() => handlePublishRecord(row.id)}
                                    >
                                      <Globe className="w-4 h-4 text-emerald-500" />
                                      Công khai
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    className="text-[13px] text-red-600 focus:text-red-600"
                                    onClick={() => openDeleteModal(row.id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                    Xóa bản ghi
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-6 py-16 text-center text-[13px] text-slate-400">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  { value: 'all' as const, label: 'Tất cả', activeClass: 'bg-slate-800 text-white border-slate-800' },
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
                    {approvalListCols.map(col => (
                      <th key={col.key} className="px-6 py-3 text-left text-[13px] font-medium text-slate-600 whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600">Trạng thái phê duyệt</th>
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
                      {approvalListCols.map(col => (
                        <td key={col.key} className="px-6 py-3 text-[13px] text-slate-700 whitespace-nowrap max-w-[200px] truncate">
                          {row[col.key]}
                        </td>
                      ))}
                      <td className="px-6 py-3 whitespace-nowrap"><ApprovalBadge status={row.approvalStatus} /></td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenDetail(row, 'approval')}
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
                          {/* UC493 — Hủy phê duyệt (chỉ với bản ghi đã duyệt) */}
                          {row.approvalStatus === 'approved' && (
                            <button
                              onClick={() => openUnapproveModal(row.id)}
                              className="p-1 text-amber-600 hover:bg-amber-50 rounded cursor-pointer transition-colors"
                              title="Hủy phê duyệt"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {approvalFilteredData.length === 0 && (
                    <tr>
                      <td colSpan={approvalListCols.length + 4} className="px-6 py-16 text-center text-[13px] text-slate-400">
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

      {/* Modal Rà soát bản ghi dữ liệu chủ — lưu tạm thời, đánh dấu "Đang rà soát" */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden transform scale-100 transition-all">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-600" />
                Rà soát bản ghi dữ liệu chủ
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

      {/* Modal Gửi phê duyệt — chọn người duyệt + nội dung trình duyệt */}
      {showSendApprovalModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden transform scale-100 transition-all">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Send className="w-5 h-5 text-indigo-600" />
                  Gửi phê duyệt
                </h3>
                <p className="text-[12px] text-slate-500 mt-0.5 normal-case">{sendApprovalIds.length} bản ghi được chọn</p>
              </div>
              <button
                onClick={handleCloseSendApproval}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-[13px]">
              <div>
                <label className="block text-slate-700 font-medium mb-1.5">
                  Chọn người duyệt <span className="text-red-500">*</span>
                </label>
                <select
                  value={sendApprovalApprover}
                  onChange={(e) => setSendApprovalApprover(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                >
                  <option value="">-- Chọn người duyệt --</option>
                  {MOCK_APPROVERS.map(u => (
                    <option key={u.id} value={u.id}>{u.name} - {u.position} ({u.department})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1.5">Nội dung trình duyệt</label>
                <textarea
                  value={sendApprovalNote}
                  onChange={(e) => setSendApprovalNote(e.target.value)}
                  rows={4}
                  placeholder="Nhập nội dung gửi kèm (nếu có)..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={handleCloseSendApproval}
                className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmSendApproval}
                disabled={!sendApprovalApprover}
                className={`px-4 py-2 rounded-lg font-medium text-[13px] transition-colors flex items-center gap-1.5 active:scale-95 ${
                  sendApprovalApprover ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                Gửi duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UC492 — Modal lý do từ chối phê duyệt */}
      {rejectModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Từ chối phê duyệt
              </h3>
              <button
                onClick={() => setRejectModal({ open: false, ids: [], reason: '' })}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-[13px]">
              <p className="text-slate-600 font-medium leading-relaxed">
                Từ chối phê duyệt <strong>{rejectModal.ids.length}</strong> bản ghi. Vui lòng nhập lý do:
              </p>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Lý do từ chối <span className="text-red-500">*</span></label>
                <textarea
                  title="Lý do từ chối"
                  value={rejectModal.reason}
                  onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Nhập lý do chi tiết..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setRejectModal({ open: false, ids: [], reason: '' })}
                className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-[13px] transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {unapproveModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                Hủy phê duyệt
              </h3>
              <button
                onClick={() => setUnapproveModal({ open: false, id: '', reason: '' })}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-[13px]">
              <p className="text-slate-600 font-medium leading-relaxed">
                Bản ghi sẽ chuyển về trạng thái "Chờ phê duyệt". Vui lòng nhập lý do hủy phê duyệt:
              </p>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Lý do hủy phê duyệt <span className="text-red-500">*</span></label>
                <textarea
                  title="Lý do hủy phê duyệt"
                  value={unapproveModal.reason}
                  onChange={(e) => setUnapproveModal(prev => ({ ...prev, reason: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Nhập lý do chi tiết..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setUnapproveModal({ open: false, id: '', reason: '' })}
                className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmUnapprove}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium text-[13px] transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Xác nhận hủy phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lịch sử đồng bộ */}
      {showSyncHistoryModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-7xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Lịch sử đồng bộ
              </h3>
              <button
                onClick={() => { setShowSyncHistoryModal(false); setSyncHistorySelectedId(null); }}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-[13px] overflow-y-auto">
              {!syncHistorySelected ? (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap w-14 text-center">STT</th>
                          <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Thời gian đồng bộ</th>
                          <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Người thực hiện</th>
                          <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Số bản ghi đồng bộ</th>
                          <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Thêm mới</th>
                          <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Cập nhật</th>
                          <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Không đổi</th>
                          <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Thời gian thực hiện</th>
                          <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Thời gian đồng bộ lần cuối</th>
                          <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Trạng thái phê duyệt</th>
                          <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-24">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {syncHistoryEntries.map((entry, index) => (
                          <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-[13px] text-slate-500 text-center">{index + 1}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{entry.syncedAt}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{entry.performedBy}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 text-center">
                              {entry.successIds.length + entry.duplicateIds.length + entry.incompleteIds.length} bản ghi
                            </td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 text-center">{entry.newCount}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 text-center">{entry.updatedCount}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 text-center">{entry.unchangedCount}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 text-center whitespace-nowrap">{entry.duration}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{entry.previousSyncedAt}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap ${
                                entry.approvalStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                                entry.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {entry.approvalStatus === 'pending' ? 'Chờ phê duyệt' : entry.approvalStatus === 'approved' ? 'Đã phê duyệt' : 'Lưu trữ'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => setSyncHistorySelectedId(entry.id)}
                                className="p-1.5 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[13px] text-slate-500">
                    Đồng bộ lúc <span className="font-medium text-slate-700">{syncHistorySelected.syncedAt}</span> bởi <span className="font-medium text-slate-700">{syncHistorySelected.performedBy}</span>
                  </p>

                  {/* Section 1: Bản ghi hợp nhất/đồng bộ tự động thành công */}
                  <div className="border border-green-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setSyncDetailCollapsed(prev => ({ ...prev, success: !prev.success }))}
                      className="w-full bg-green-50 px-4 py-3 flex items-center gap-2 border-b border-green-200 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <p className="text-[13px] font-semibold text-green-800">Bản ghi hợp nhất/đồng bộ tự động thành công</p>
                      <span className="text-[12px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">{syncHistorySelected.successIds.length} bản ghi</span>
                      <ChevronDown className={`w-4 h-4 text-green-600 ml-auto transition-transform ${syncDetailCollapsed.success ? '-rotate-90' : ''}`} />
                    </button>
                    {!syncDetailCollapsed.success && (
                      <div className="overflow-x-auto max-h-64 overflow-y-auto">
                        <table className="w-full text-left text-[13px]">
                          <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                              <th className="px-4 py-2.5 text-[13px] text-center w-14">STT</th>
                              {approvalListCols.map(col => (
                                <th key={col.key} className="px-4 py-2.5 text-[13px] text-left whitespace-nowrap">{col.label}</th>
                              ))}
                              <th className="px-4 py-2.5 text-[13px] text-center">Trạng thái duyệt</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {syncHistorySelected.successIds.length === 0 ? (
                              <tr><td colSpan={approvalListCols.length + 2} className="px-4 py-6 text-[13px] text-center text-slate-400">Không có bản ghi</td></tr>
                            ) : (
                              syncHistorySelected.successIds.map((id, i) => {
                                const row = allData.find(r => r.id === id);
                                if (!row) return null;
                                return (
                                  <tr key={id}>
                                    <td className="px-4 py-2 text-[13px] text-center text-slate-500">{i + 1}</td>
                                    {approvalListCols.map(col => (
                                      <td key={col.key} className="px-4 py-2 text-[13px] text-slate-700 whitespace-nowrap">{row[col.key] || '—'}</td>
                                    ))}
                                    <td className="px-4 py-2 text-center"><ApprovalBadge status="pending" /></td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Section 2: Bản ghi trùng lặp */}
                  <div className="border border-yellow-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setSyncDetailCollapsed(prev => ({ ...prev, duplicate: !prev.duplicate }))}
                      className="w-full bg-yellow-50 px-4 py-3 flex items-center gap-2 border-b border-yellow-200 cursor-pointer"
                    >
                      <Copy className="w-4 h-4 text-yellow-600" />
                      <p className="text-[13px] font-semibold text-yellow-800">Bản ghi trùng lặp</p>
                      <span className="text-[12px] px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">{syncHistorySelected.duplicateIds.length} bản ghi</span>
                      <ChevronDown className={`w-4 h-4 text-yellow-600 ml-auto transition-transform ${syncDetailCollapsed.duplicate ? '-rotate-90' : ''}`} />
                    </button>
                    {!syncDetailCollapsed.duplicate && (
                      <div className="max-h-96 overflow-y-auto divide-y divide-yellow-100">
                        {duplicateGroups.length === 0 ? (
                          <p className="px-4 py-6 text-center text-[13px] text-slate-400">Không có bản ghi</p>
                        ) : (
                          duplicateGroups.map((group, groupIdx0) => {
                            const groupIdx = groupIdx0 + 1;
                            const isOpen = expandedDuplicateGroups.has(groupIdx);
                            return (
                              <div key={groupIdx}>
                                <button
                                  type="button"
                                  onClick={() => toggleDuplicateGroup(groupIdx)}
                                  className="w-full px-4 py-2.5 flex items-center gap-2 bg-white hover:bg-yellow-50/60 transition-colors cursor-pointer"
                                >
                                  <span className="text-[13px] font-bold text-slate-700">Nhóm {groupIdx}</span>
                                  <span className="text-[12px] px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full font-medium">{group.length} bản ghi</span>
                                  <ChevronDown className={`w-4 h-4 text-slate-400 ml-auto transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                                </button>
                                {isOpen && (
                                  <div className="overflow-x-auto bg-slate-50/50">
                                    <table className="w-full text-left text-[13px]">
                                      <thead className="bg-slate-50 border-y border-slate-100">
                                        <tr>
                                          <th className="px-4 py-2 text-[13px] text-center w-14">STT</th>
                                          {approvalListCols.map(col => (
                                            <th key={col.key} className="px-4 py-2 text-[13px] text-left whitespace-nowrap">{col.label}</th>
                                          ))}
                                          <th className="px-4 py-2 text-[13px] text-center">Trạng thái duyệt</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100 bg-white">
                                        {group.map((row, i) => (
                                          <tr key={row.id}>
                                            <td className="px-4 py-2 text-[13px] text-center text-slate-500">{i + 1}</td>
                                            {approvalListCols.map(col => (
                                              <td key={col.key} className="px-4 py-2 text-[13px] text-slate-700 whitespace-nowrap">{row[col.key] || '—'}</td>
                                            ))}
                                            <td className="px-4 py-2 text-center"><ApprovalBadge status="pending" /></td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>

                  {/* Section 3: Bản ghi bị thiếu dữ liệu */}
                  <div className="border border-red-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setSyncDetailCollapsed(prev => ({ ...prev, incomplete: !prev.incomplete }))}
                      className="w-full bg-red-50 px-4 py-3 flex items-center gap-2 border-b border-red-200 cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <p className="text-[13px] font-semibold text-red-800">Bản ghi bị thiếu dữ liệu</p>
                      <span className="text-[12px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">{syncHistorySelected.incompleteIds.length} bản ghi</span>
                      <ChevronDown className={`w-4 h-4 text-red-600 ml-auto transition-transform ${syncDetailCollapsed.incomplete ? '-rotate-90' : ''}`} />
                    </button>
                    {!syncDetailCollapsed.incomplete && (
                      <div className="overflow-x-auto max-h-64 overflow-y-auto">
                        <table className="w-full text-left text-[13px]">
                          <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                              <th className="px-4 py-2.5 text-[13px] text-center w-14">STT</th>
                              {approvalListCols.map(col => (
                                <th key={col.key} className="px-4 py-2.5 text-[13px] text-left whitespace-nowrap">{col.label}</th>
                              ))}
                              <th className="px-4 py-2.5 text-[13px] text-left">Trường còn thiếu</th>
                              <th className="px-4 py-2.5 text-[13px] text-center">Trạng thái duyệt</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {syncHistorySelected.incompleteIds.length === 0 ? (
                              <tr><td colSpan={approvalListCols.length + 3} className="px-4 py-6 text-[13px] text-center text-slate-400">Không có bản ghi</td></tr>
                            ) : (
                              syncHistorySelected.incompleteIds.map((id, i) => {
                                const row = allData.find(r => r.id === id);
                                if (!row) return null;
                                const missingLabels = cols.filter(c => !row[c.key] || row[c.key].trim() === '').map(c => c.label);
                                return (
                                  <tr key={id}>
                                    <td className="px-4 py-2 text-[13px] text-center text-slate-500">{i + 1}</td>
                                    {approvalListCols.map(col => (
                                      <td key={col.key} className="px-4 py-2 text-[13px] text-slate-700 whitespace-nowrap">{row[col.key] || '—'}</td>
                                    ))}
                                    <td className="px-4 py-2 text-[13px] text-red-600">{missingLabels.join(', ')}</td>
                                    <td className="px-4 py-2 text-center"><ApprovalBadge status="pending" /></td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              {syncHistorySelected ? (
                <button
                  onClick={() => setSyncHistorySelectedId(null)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
              ) : (
                <button
                  onClick={() => setShowSyncHistoryModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
                >
                  Đóng
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Đồng bộ dữ liệu (UC1) */}
      {showSyncModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                Đồng bộ dữ liệu chủ
              </h3>
              <button onClick={() => setShowSyncModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-[13px] overflow-y-auto">
              <p className="text-[13px] text-slate-500">
                <span className="font-medium text-slate-700">{masterLabel}</span> — áp dụng quy tắc đã thiết lập tại <b>Mô hình dữ liệu chủ</b>
              </p>
              <div>
                <div className="text-[13px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Nguồn dữ liệu</div>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-slate-50">
                      <tr><th className="px-4 py-2 text-[13px] font-medium text-slate-600">Hệ thống nguồn</th><th className="px-4 py-2 text-[13px] font-medium text-slate-600">Đồng bộ gần nhất</th></tr>
                    </thead>
                    <tbody>
                      <tr><td className="px-4 py-2 text-[13px] font-medium text-slate-800">{config.system}</td><td className="px-4 py-2 text-[13px] text-slate-500">08:00, {new Date().toLocaleDateString('vi-VN')}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <div className="text-[13px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Quy tắc áp dụng (theo Mô hình dữ liệu chủ)</div>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between gap-4 border border-slate-200 rounded-lg px-3 py-2">
                    <span className="text-[13px] text-slate-500">Ánh xạ thuộc tính</span>
                    <span className="text-[13px] font-medium text-slate-800 text-right">{cols.length}/{cols.length} trường đã ánh xạ đầy đủ</span>
                  </div>
                  <div className="flex justify-between gap-4 border border-slate-200 rounded-lg px-3 py-2">
                    <span className="text-[13px] text-slate-500">Quy tắc hợp nhất</span>
                    <span className="text-[13px] font-medium text-slate-800 text-right">Ưu tiên giữ dữ liệu mới nhất theo thời gian đồng bộ</span>
                  </div>
                  <div className="flex justify-between gap-4 border border-slate-200 rounded-lg px-3 py-2">
                    <span className="text-[13px] text-slate-500">Quy tắc so khớp</span>
                    <span className="text-[13px] font-medium text-slate-800 text-right">Khớp chính xác theo {cols[0].label}</span>
                  </div>
                  <div className="flex justify-between gap-4 border border-slate-200 rounded-lg px-3 py-2">
                    <span className="text-[13px] text-slate-500">Quy tắc định danh duy nhất</span>
                    <span className="text-[13px] font-medium text-slate-800 text-right">{cols[0].label}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-[13px]">
                  Dự kiến sau khi đối chiếu khóa định danh duy nhất <b>{cols[0].label}</b>: sẽ có bản ghi <b>Mới</b> và bản ghi <b>Cập nhật</b> vào danh sách với trạng thái duyệt "Chưa phê duyệt" để rà soát
                  {duplicateIds.size > 0 ? <> ; <b>{duplicateIds.size} bản ghi nghi trùng lặp</b> sẽ được đánh dấu cần kiểm tra thủ công.</> : '.'}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowSyncModal(false)} className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95">
                Hủy
              </button>
              <button onClick={handleConfirmSync} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-[13px] transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4" />
                Bắt đầu đồng bộ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết dữ liệu của một phiên bản cụ thể (snapshot) */}
      {versionSnapshot && (
        <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Chi tiết phiên bản v{versionSnapshot.version.version}
              </h3>
              <button onClick={() => setVersionSnapshot(null)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-[13px] overflow-y-auto">
              <div className="flex items-center gap-4 flex-wrap text-[13px]">
                <span className="text-slate-500">Mã bản ghi: <span className="font-semibold text-slate-800">{versionSnapshot.row[cols[0].key]}</span></span>
                <span className="text-slate-500">Người cập nhật: <span className="font-medium text-slate-800">{versionSnapshot.version.updatedBy}</span></span>
                <span className="text-slate-500">Ngày phát hành: <span className="font-medium text-slate-800">{versionSnapshot.version.updatedAt}</span></span>
              </div>
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                {cols.map(col => (
                  <div key={col.key} className="flex px-3 py-2 text-[13px]">
                    <span className="w-40 shrink-0 text-slate-500">{col.label}</span>
                    <span className="flex-1 text-slate-800 font-medium break-words">{versionSnapshot.version.values[col.key] || <span className="text-slate-400 italic">(trống)</span>}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button onClick={closeVersionSnapshot} className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95">
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Báo cáo lịch sử phiên bản thay đổi — của riêng 1 bản ghi, mở từ nút "Phiên bản" ở tab Dữ liệu */}
      {rowVersionReportRow && (() => {
        const row = rowVersionReportRow;
        const history = buildRecordVersionHistory(row, cols);
        const latest = history[history.length - 1];
        return (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-slate-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Báo cáo lịch sử phiên bản thay đổi
                </h3>
                <button onClick={() => setRowVersionReportRow(null)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" title="Đóng">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-3 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-slate-500">Bản ghi: <span className="font-semibold text-slate-800">{row[cols[0].key]}</span></p>
                  <button
                    onClick={() => handleDownloadRowChangeReport(row)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg text-[13px] font-medium transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    Kết xuất báo cáo thay đổi
                  </button>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 text-[13px] uppercase font-semibold tracking-wider">
                      <th className="px-4 py-3">Mã bản ghi</th>
                      <th className="px-4 py-3 text-center">Phiên bản</th>
                      <th className="px-4 py-3">Người cập nhật</th>
                      <th className="px-4 py-3">Ngày phát hành</th>
                      <th className="px-4 py-3 text-center">Trạng thái</th>
                      <th className="px-4 py-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.slice().reverse().map(v => {
                      const isEffective = v.version === latest.version;
                      return (
                        <tr key={v.version} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 text-[13px] text-slate-900 font-semibold">{row[cols[0].key]}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-[6px] text-[13px] font-semibold">v{v.version}</span>
                          </td>
                          <td className="px-4 py-3 text-[13px] text-slate-700">{v.updatedBy}</td>
                          <td className="px-4 py-3 text-[13px] text-slate-500">{v.updatedAt}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[13px] font-semibold whitespace-nowrap ${
                              isEffective
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {isEffective ? 'Hiệu lực' : 'Lưu trữ'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => openVersionSnapshot(row, v, row)}
                                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Xem chi tiết dữ liệu của phiên bản này"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenVersionCompare(row, history.indexOf(v), row)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="So sánh với bản ghi trước"
                              >
                                <GitCompare className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button onClick={() => setRowVersionReportRow(null)} className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal So sánh phiên bản dữ liệu chủ — chỉ nội dung so sánh, không có thanh tab */}
      {versionCompareModal && (() => {
        const history = buildRecordVersionHistory(versionCompareModal.row, cols);
        const latestVersion = history[history.length - 1];
        const selectedVersion = history[versionCompareModal.versionIdx];
        return (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-blue-600" />
                  So sánh phiên bản dữ liệu chủ
                </h3>
                <button onClick={() => setVersionCompareModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" title="Đóng">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-[13px] overflow-y-auto">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col items-center text-center gap-2">
                  <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Bản ghi được so sánh</div>
                  <div className="text-[13px] font-bold text-slate-900">{versionCompareModal.row[cols[0].key]}</div>
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm">
                    <div className="flex flex-col items-center">
                      <span className="text-[13px] text-slate-400 font-bold uppercase">Phiên bản cũ</span>
                      <span className="text-[13px] font-bold text-slate-600 mt-0.5">v{selectedVersion.version}</span>
                    </div>
                    <span className="text-slate-300">→</span>
                    <div className="flex flex-col items-center">
                      <span className="text-[13px] text-slate-400 font-bold uppercase">Phiên bản mới</span>
                      <span className="text-[13px] font-bold text-blue-600 mt-0.5">v{latestVersion.version}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                        <th colSpan={2} className="px-4 py-3 border-r border-slate-200">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">PHIÊN BẢN CŨ (v{selectedVersion.version})</span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[13px] font-bold">Trước cập nhật</span>
                          </div>
                        </th>
                        <th colSpan={2} className="px-4 py-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-blue-900">PHIÊN BẢN MỚI (v{latestVersion.version})</span>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[13px] font-bold">Sau cập nhật</span>
                          </div>
                        </th>
                      </tr>
                      <tr className="border-b border-slate-200 bg-slate-100/50 text-[13px] text-slate-500 font-bold uppercase">
                        <th className="px-4 py-2 border-r border-slate-200">Trường thuộc tính</th>
                        <th className="px-4 py-2 border-r border-slate-200">Giá trị</th>
                        <th className="px-4 py-2 border-r border-slate-200">Trường thuộc tính</th>
                        <th className="px-4 py-2">Giá trị</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {cols.map(col => {
                        const oldVal = selectedVersion.values[col.key] || '';
                        const newVal = latestVersion.values[col.key] || '';
                        const changed = oldVal !== newVal;
                        return (
                          <tr key={col.key} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2.5 border-r border-slate-200 text-[13px] text-slate-700">{col.label}</td>
                            <td className={`px-4 py-2.5 border-r border-slate-200 text-[13px] ${changed ? 'bg-amber-50/50 text-slate-600' : 'text-slate-600'}`}>
                              {oldVal || <span className="text-slate-400 italic">(trống)</span>}
                            </td>
                            <td className="px-4 py-2.5 border-r border-slate-200 text-[13px] text-slate-700">{col.label}</td>
                            <td className={`px-4 py-2.5 text-[13px] ${changed ? 'bg-blue-50/40 text-blue-700 font-semibold' : 'text-slate-600'}`}>
                              {newVal || <span className="text-slate-400 italic">(trống)</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button onClick={closeVersionCompareModal} className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95">
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {deleteModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Xóa bản ghi
              </h3>
              <button
                onClick={() => setDeleteModal({ open: false, id: '' })}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-[13px]">
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>Bạn có chắc chắn muốn xóa bản ghi này? Bản ghi sẽ chuyển sang trạng thái "Đã xóa" và có thể khôi phục lại sau.</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, id: '' })}
                className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-[13px] transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UC492 — Modal xem chi tiết bản ghi */}
      {detailRow && (() => {
        const versionHistory = buildRecordVersionHistory(detailRow, cols);
        const latestVersion = versionHistory[versionHistory.length - 1];
        const selectedVersion = versionHistory[compareVersionIdx];
        const detailDupKey = getDuplicateKeyValue(detailRow, config.category);
        const relatedRecords = detailDupKey
          ? allData.filter(r => r.id !== detailRow.id && getDuplicateKeyValue(r, config.category) === detailDupKey)
          : [];
        // Liên kết chéo thực thể: các bản ghi ở LOẠI DỮ LIỆU KHÁC cùng chủ thể (khớp CCCD)
        const crossEntityLinks = getCrossEntityLinks(detailRow, config.category);
        const crossEntityGroups = Object.values(
          crossEntityLinks.reduce((acc, link) => {
            if (!acc[link.category]) acc[link.category] = { categoryLabel: link.categoryLabel, links: [] as CrossEntityLink[] };
            acc[link.category].links.push(link);
            return acc;
          }, {} as Record<string, { categoryLabel: string; links: CrossEntityLink[] }>)
        );
        const missingCols = cols.filter(col => !detailRow[col.key] || detailRow[col.key].trim() === '');
        const isDetailDup = duplicateIds.has(detailRow.id);
        const hasUnapproveWarning = detailRow.approvalStatus === 'pending' && !!detailRow.unapproveReason;
        const hasWarnings = missingCols.length > 0 || isDetailDup || (detailRow.approvalStatus === 'rejected' && !!detailRow.rejectReason) || hasUnapproveWarning;

        const ALL_DETAIL_TABS = [
          { id: 'values' as const,   label: 'Giá trị dữ liệu chủ',  icon: List },
          { id: 'history' as const,  label: 'Lịch sử',              icon: Clock },
          { id: 'related' as const,  label: 'Thông tin liên quan',  icon: Link2 },
          { id: 'warnings' as const, label: 'Cảnh báo lỗi',         icon: AlertTriangle },
        ];
        // Mở từ tab "Dữ liệu" giữ tab Giá trị dữ liệu chủ và Lịch sử; mở từ tab "Phê duyệt" giữ đủ 4 tab
        const DETAIL_TABS = detailRowContext === 'approval' ? ALL_DETAIL_TABS : ALL_DETAIL_TABS.filter(tab => tab.id === 'values' || tab.id === 'history');

        return (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Chi tiết bản ghi
              </h3>
              <button
                onClick={() => setDetailRow(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pt-3 border-b border-slate-200 flex items-center gap-1 flex-wrap">
              {DETAIL_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium border-b-2 transition-colors cursor-pointer ${
                    detailTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'warnings' && hasWarnings && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-3 text-[13px] overflow-y-auto">
              {detailTab === 'values' && (
                <>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Trạng thái:</span>
                      <ApprovalBadge status={detailRow.approvalStatus} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Trạng thái dữ liệu:</span>
                      <DataStatusBadge status={getDataStatus(detailRow)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Trạng thái công khai:</span>
                      <PublicBadge status={detailRow.publicStatus} />
                    </div>
                  </div>
                  {detailRow.approvalStatus === 'rejected' && detailRow.rejectReason && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
                      <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <p>
                        <span className="font-semibold">Lý do từ chối: </span>{detailRow.rejectReason}
                      </p>
                    </div>
                  )}
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                    {cols.map(col => (
                      <div key={col.key} className="flex px-3 py-2">
                        <span className="w-40 shrink-0 text-slate-500">{col.label}</span>
                        <span className="flex-1 text-slate-800 font-medium break-words">{detailRow[col.key] || <span className="text-slate-400 italic">(trống)</span>}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {detailTab === 'history' && historyView === 'list' && (
                <div className="space-y-3">
                  <div className="border border-slate-200 rounded-xl p-5 bg-white">
                    <p className="text-[13px] font-bold text-slate-800 mb-4">Lịch sử chỉnh sửa bản ghi này</p>
                    <div className="space-y-4">
                      {[
                        { dotClass: 'bg-green-500', action: 'Phê duyệt', time: '09:12, 02/07/2026', version: 'v1.1 → v1.2', description: 'Phê duyệt cập nhật thông tin bản ghi.', actor: 'Nguyễn Thanh Hải' },
                        { dotClass: 'bg-blue-500',  action: 'Chỉnh sửa', time: '16:40, 01/07/2026', version: null,          description: 'Bổ sung, chỉnh sửa một số trường dữ liệu.', actor: 'Trần Minh Phúc' },
                        { dotClass: 'bg-slate-400', action: 'Tạo mới',   time: '08:00, 10/01/2026', version: 'v1.0',        description: 'Khởi tạo bản ghi từ đồng bộ dữ liệu.', actor: 'Hệ thống' },
                      ].map((item, i, arr) => (
                        <div key={i} className={i < arr.length - 1 ? 'pb-4 border-b border-slate-100' : ''}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dotClass}`} />
                            <span className="text-[13px] font-bold text-slate-800">{item.action}</span>
                            <span className="text-[13px] text-slate-400">{item.time}</span>
                            {item.version && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-[12px] font-medium">{item.version}</span>
                            )}
                          </div>
                          <p className="text-[13px] text-slate-600 mt-1 ml-4">{item.description}</p>
                          <p className="text-[13px] text-slate-400 mt-1 ml-4">{item.actor}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-5 bg-white">
                    <button
                      onClick={() => setShowOriginalData(v => !v)}
                      className="flex items-center gap-1.5 text-[13px] font-bold text-slate-800 cursor-pointer"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${showOriginalData ? 'rotate-180' : ''}`} />
                      Xem dữ liệu gốc
                    </button>
                    {showOriginalData && (() => {
                      const originalValues = versionHistory[0].values;
                      const hasChanges = cols.some(col => (originalValues[col.key] || '') !== (latestVersion.values[col.key] || ''));
                      if (!hasChanges) {
                        return (
                          <p className="text-[13px] text-slate-500 mt-3">Không có chỉnh sửa so với dữ liệu gốc</p>
                        );
                      }
                      return (
                        <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 mt-3">
                          {cols.map(col => (
                            <div key={col.key} className="flex px-3 py-2">
                              <span className="w-40 shrink-0 text-slate-500">{col.label}</span>
                              <span className="flex-1 text-slate-800 font-medium break-words">
                                {originalValues[col.key] || <span className="text-slate-400 italic">(trống)</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                </div>
              )}

              {detailTab === 'related' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                    <div className="flex px-3 py-2">
                      <span className="w-40 shrink-0 text-slate-500">Đơn vị quản lý</span>
                      <span className="flex-1 text-slate-800 font-medium">{config.unit}</span>
                    </div>
                    <div className="flex px-3 py-2">
                      <span className="w-40 shrink-0 text-slate-500">Hệ thống nguồn</span>
                      <span className="flex-1 text-slate-800 font-medium">{config.system}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-600 mb-2">
                      Liên kết chéo thực thể ({crossEntityLinks.length})
                    </p>
                    {!categoryHasCrossEntityConfig(config.category) ? (
                      <div className="border border-slate-200 rounded-lg p-4 text-center text-slate-400">
                        Thực thể dữ liệu chưa được thiết lập quan hệ với thực thể khác
                      </div>
                    ) : crossEntityGroups.length === 0 ? (
                      <div className="border border-slate-200 rounded-lg p-4 text-center text-slate-400">
                        Thực thể dữ liệu chưa được thiết lập quan hệ với thực thể khác
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {crossEntityGroups.map(group => (
                          <div key={group.categoryLabel} className="border border-slate-200 rounded-lg overflow-hidden">
                            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 text-[12px] font-semibold text-slate-700 flex items-center justify-between">
                              <span>{group.categoryLabel}</span>
                              <span className="text-slate-400 font-normal">{group.links.length} bản ghi</span>
                            </div>
                            <table className="w-full">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                  <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-600">{COLUMNS[group.links[0].category][0].label}</th>
                                  <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-600">Trạng thái</th>
                                  <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-600"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.links.map(link => (
                                  <tr key={`${link.category}-${link.row.id}`} className="border-b border-slate-100 last:border-0">
                                    <td className="px-3 py-2 text-[13px] text-slate-700">{link.row[COLUMNS[link.category][0].key]}</td>
                                    <td className="px-3 py-2"><ApprovalBadge status={link.row.approvalStatus} /></td>
                                    <td className="px-3 py-2 text-right">
                                      <button
                                        onClick={() => setViewingLinkedRecord(link)}
                                        className="text-blue-600 hover:underline cursor-pointer text-[13px]"
                                      >
                                        Xem chi tiết
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {detailTab === 'warnings' && (
                <div className="space-y-3">
                  {!hasWarnings && (
                    <div className="border border-slate-200 rounded-lg p-6 text-center text-slate-400">
                      Không có cảnh báo lỗi nào
                    </div>
                  )}
                  {missingCols.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
                      <p className="font-semibold mb-1">Thiếu dữ liệu bắt buộc</p>
                      <p>Các trường sau đang để trống: {missingCols.map(c => c.label).join(', ')}</p>
                    </div>
                  )}
                  {isDetailDup && (
                    <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-700">
                      <p className="font-semibold mb-1">Nghi ngờ trùng lặp</p>
                      <p>Bản ghi này trùng khóa định danh với {relatedRecords.length} bản ghi khác trong hệ thống.</p>
                    </div>
                  )}
                  {detailRow.approvalStatus === 'rejected' && detailRow.rejectReason && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
                      <span className="font-semibold">Lý do từ chối: </span>{detailRow.rejectReason}
                    </div>
                  )}
                  {hasUnapproveWarning && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                      <p>
                        <span className="font-semibold">Đã hủy phê duyệt với lý do: </span>{detailRow.unapproveReason}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setDetailRow(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* Modal xem toàn bộ trường dữ liệu của bản ghi liên kết chéo thực thể */}
      {viewingLinkedRecord && (() => {
        const link = viewingLinkedRecord;
        const linkedCols = COLUMNS[link.category];
        return (
          <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-blue-600" />
                  Chi tiết bản ghi — {link.categoryLabel}
                </h3>
                <button onClick={() => setViewingLinkedRecord(null)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" title="Đóng">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-3 text-[13px] overflow-y-auto">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Trạng thái:</span>
                  <ApprovalBadge status={link.row.approvalStatus} />
                </div>
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                  {linkedCols.map(col => (
                    <div key={col.key} className="flex px-3 py-2 text-[13px]">
                      <span className="w-40 shrink-0 text-slate-500">{col.label}</span>
                      <span className="flex-1 text-slate-800 font-medium break-words">
                        {link.row[col.key] || <span className="text-slate-400 italic">(trống)</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setViewingLinkedRecord(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
