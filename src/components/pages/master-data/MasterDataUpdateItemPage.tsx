import { useState } from 'react';
import { Search, Filter, Download, Upload, ArrowUpDown, Send, Eye, Clock, CheckCircle2, XCircle, Globe, List, Lock, Check, Edit2, Copy, AlertTriangle, X, RotateCcw, RefreshCw, Trash2, GitBranch, GitCompare } from 'lucide-react';

type ApprovalStatus = 'unreviewed' | 'reviewing' | 'pending' | 'approved' | 'rejected';
type DataStatus = 'new' | 'updated';
type PublicStatus = 'published' | 'unpublished';
// 'civil-registry-birth' tách riêng cho "Đăng ký khai sinh" — minh họa trường hợp cực đoan
// 25 trường (23 trường mô tả + khóa ghép 2 trường) đúng theo Phụ lục II, không dùng chung
// schema rút gọn với 8 loại hộ tịch còn lại trong nhóm 'civil-registry'.
type DataCategory = 'enforcement' | 'civil-registry' | 'civil-registry-birth' | 'nationality' | 'individual' | 'organization' | 'legal-aid-object' | 'asset';

interface ColDef { key: string; label: string; isId?: boolean }

interface ItemConfig {
  category: DataCategory;
  unit: string;
  system: string;
  idLabel: string;
}

// ─── Config per master data ID ────────────────────────────────────────────────

const ITEM_CONFIGS: Record<string, ItemConfig> = {
  'md-001': { category: 'enforcement',       unit: 'Cục Quản lý thi hành án dân sự',                     system: 'Nền tảng số THADS',                           idLabel: 'Số quyết định' },
  'md-002': { category: 'civil-registry-birth', unit: 'Cục Hành chính tư pháp',                          system: 'CSDL hộ tịch điện tử',                        idLabel: 'Số đăng ký khai sinh, Quyển số' },
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

// ─── Column definitions per category — trường có isId hợp thành "Mã quản lý đối tượng"
//     (civil-registry minh họa khóa ghép: Số đăng ký + Quyển số) ─────────────────

const COLUMNS: Record<DataCategory, ColDef[]> = {
  'enforcement': [
    { key: 'ma',          label: 'Số quyết định', isId: true },
    { key: 'ngayBanHanh', label: 'Ngày ban hành' },
    { key: 'hoTen',       label: 'Họ tên đương sự' },
    { key: 'cccd',        label: 'CCCD/Hộ chiếu' },
    { key: 'nghiaVu',     label: 'Nghĩa vụ THA' },
    { key: 'coQuan',      label: 'Cơ quan ra QĐ' },
  ],
  'civil-registry': [
    { key: 'ma',          label: 'Số đăng ký', isId: true },
    { key: 'quyenSo',     label: 'Quyển số', isId: true },
    { key: 'ngayDangKy',  label: 'Ngày đăng ký' },
    { key: 'noiDangKy',   label: 'Nơi đăng ký' },
    { key: 'hoTen',       label: 'Họ tên' },
    { key: 'ngaySinh',    label: 'Ngày sinh' },
    { key: 'quocTich',    label: 'Quốc tịch' },
  ],
  // "Đăng ký khai sinh" (md-002) — schema đầy đủ 25 trường (23 mô tả + khóa ghép 2 trường)
  // đúng theo Phụ lục II, minh họa trường hợp cực đoan nhiều trường nhất trong Danh mục dữ liệu chủ.
  'civil-registry-birth': [
    { key: 'soDangKy',        label: 'Số đăng ký', isId: true },
    { key: 'quyenSo',         label: 'Quyển số', isId: true },
    { key: 'ngayDangKy',      label: 'Ngày đăng ký' },
    { key: 'noiDangKy',       label: 'Nơi đăng ký' },
    { key: 'hoTen',           label: 'Họ tên' },
    { key: 'gioiTinh',        label: 'Giới tính' },
    { key: 'ngaySinh',        label: 'Ngày sinh' },
    { key: 'noiSinh',         label: 'Nơi sinh' },
    { key: 'queQuan',         label: 'Quê quán' },
    { key: 'danToc',          label: 'Dân tộc' },
    { key: 'quocTich',        label: 'Quốc tịch' },
    { key: 'soDinhDanh',      label: 'Số định danh cá nhân' },
    { key: 'hoTenCha',        label: 'Họ tên cha' },
    { key: 'namSinhCha',      label: 'Năm sinh cha' },
    { key: 'quocTichCha',     label: 'Quốc tịch cha' },
    { key: 'noiCuTruCha',     label: 'Nơi cư trú cha' },
    { key: 'soDinhDanhCha',   label: 'Số định danh cá nhân cha' },
    { key: 'hoTenMe',         label: 'Họ tên mẹ' },
    { key: 'namSinhMe',       label: 'Năm sinh mẹ' },
    { key: 'quocTichMe',      label: 'Quốc tịch mẹ' },
    { key: 'noiCuTruMe',      label: 'Nơi cư trú mẹ' },
    { key: 'soDinhDanhMe',    label: 'Số định danh cá nhân mẹ' },
    { key: 'hoTenNguoiYeuCau',label: 'Họ tên người yêu cầu' },
    { key: 'quanHe',          label: 'Quan hệ với trẻ' },
    { key: 'ghiChu',          label: 'Ghi chú' },
  ],
  'nationality': [
    { key: 'ma',           label: 'Số ký hiệu QĐ', isId: true },
    { key: 'hoTen',        label: 'Họ và tên' },
    { key: 'ngaySinh',     label: 'Ngày sinh' },
    { key: 'noiSinh',      label: 'Nơi sinh' },
    { key: 'gioiTinh',     label: 'Giới tính' },
    { key: 'ngayQuyetDinh',label: 'Ngày QĐ CTN' },
  ],
  'individual': [
    { key: 'ma',      label: 'Mã định danh', isId: true },
    { key: 'hoTen',   label: 'Họ và tên' },
    { key: 'ngaySinh',label: 'Ngày sinh' },
    { key: 'cccd',    label: 'CCCD' },
    { key: 'chucDanh',label: 'Chức danh' },
    { key: 'soCCHN',  label: 'Số CCHN/Thẻ' },
    { key: 'linhVuc', label: 'Lĩnh vực' },
  ],
  'organization': [
    { key: 'ma',           label: 'Mã tổ chức', isId: true },
    { key: 'tenTochuc',    label: 'Tên tổ chức' },
    { key: 'loaiHinh',     label: 'Loại hình' },
    { key: 'soDKHD',       label: 'Số đăng ký HĐ' },
    { key: 'diaChi',       label: 'Địa chỉ trụ sở' },
    { key: 'nguoiDaiDien', label: 'Người đại diện' },
  ],
  'legal-aid-object': [
    { key: 'ma',       label: 'Mã định danh', isId: true },
    { key: 'loai',     label: 'Loại đối tượng' },
    { key: 'cccd',     label: 'CCCD/Hộ chiếu' },
    { key: 'hoTen',    label: 'Họ và tên' },
    { key: 'dienTGPL', label: 'Diện TGPL' },
    { key: 'tinh',     label: 'Tỉnh/Thành phố' },
  ],
  'asset': [
    { key: 'ma',         label: 'Số định danh TS', isId: true },
    { key: 'maHopDong',  label: 'Mã hợp đồng' },
    { key: 'hieuluc',    label: 'Hiệu lực HĐ' },
    { key: 'soGCN',      label: 'Số GCN sở hữu' },
    { key: 'loaiTaiSan', label: 'Loại tài sản' },
    { key: 'benBaoDam',  label: 'Bên bảo đảm' },
  ],
};

// ─── Mock data per category ───────────────────────────────────────────────────

type Row = Record<string, string> & {
  id: string;
  dataStatus: DataStatus;
  approvalStatus: ApprovalStatus;
  publicStatus: PublicStatus;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  rejectReason?: string;
  publicActionInfo?: { user: string; date: string; reason?: string };
  previousValues?: Record<string, string>;
  sentBy?: string;
  sentAt?: string;
};

const MOCK_ENFORCEMENT: Row[] = [
  { id: '1', ma: 'QĐ-THADS-2026-00156', ngayBanHanh: '15/01/2026', hoTen: 'Nguyễn Văn Anh',   cccd: '001234567890', nghiaVu: 'Bồi thường 250.000.000đ',              coQuan: 'Cục THADS TP. Hà Nội',          dataStatus: 'updated', approvalStatus: 'approved',   publicStatus: 'published',
    previousValues: { cccd: '001234567899', nghiaVu: 'Bồi thường 230.000.000đ' } },
  { id: '2', ma: 'QĐ-THADS-2026-00287', ngayBanHanh: '22/02/2026', hoTen: 'Nguyễn Văn Anh',   cccd: '079199001234', nghiaVu: 'Phạt cải tạo không giam giữ 12 tháng',  coQuan: '',                              dataStatus: 'new',     approvalStatus: 'unreviewed', publicStatus: 'unpublished' },
  { id: '3', ma: 'QĐ-THADS-2025-08456', ngayBanHanh: '10/11/2025', hoTen: 'Lê Minh Cường',    cccd: '036087003456', nghiaVu: 'Trả nợ 180.000.000đ và lãi suất',       coQuan: 'Cục THADS TP. Đà Nẵng',         dataStatus: 'updated', approvalStatus: 'approved',   publicStatus: 'published',
    previousValues: { coQuan: 'Chi Cục THADS Q. Hải Châu, ĐN' } },
  { id: '4', ma: 'QĐ-THADS-2026-00401', ngayBanHanh: '05/03/2026', hoTen: 'Phạm Quốc Dũng',   cccd: '031075004567', nghiaVu: 'Giao nộp tài sản theo bản án số 12/2025', coQuan: 'Chi Cục THADS TP. Cần Thơ',     dataStatus: 'updated', approvalStatus: 'rejected',   publicStatus: 'unpublished' },
  { id: '5', ma: 'QĐ-THADS-2026-00512', ngayBanHanh: '15/04/2026', hoTen: 'Hoàng Thị Lan',    cccd: '038079005678', nghiaVu: 'Bồi thường thiệt hại 75.000.000đ',       coQuan: 'Chi Cục THADS Q. Hải An, HN',  dataStatus: 'new',     approvalStatus: 'pending',    publicStatus: 'unpublished',
    sentBy: 'Lê Thu Hà', sentAt: '08:12, 24/07/2026', previousValues: { nghiaVu: 'Bồi thường thiệt hại 60.000.000đ' } },
  { id: '6', ma: 'QĐ-THADS-2026-00623', ngayBanHanh: '28/05/2026', hoTen: 'Vũ Đức Thắng',     cccd: '026068006789', nghiaVu: 'Nộp tiền phạt 50.000.000đ',               coQuan: 'Chi Cục THADS Q. Sơn Trà, ĐN', dataStatus: 'updated', approvalStatus: 'approved',   publicStatus: 'published' },
  { id: '7', ma: 'QĐ-THADS-2026-00734', ngayBanHanh: '02/06/2026', hoTen: 'Đặng Thị Kim Oanh', cccd: '034082007890', nghiaVu: 'Bồi thường 45.000.000đ',                  coQuan: 'Chi Cục THADS Q. Cầu Giấy, HN', dataStatus: 'updated', approvalStatus: 'reviewing',  publicStatus: 'unpublished', isDeleted: true, deletedAt: '20/07/2026 14:02', deletedBy: 'Ngô Thị Lan' },
];

const MOCK_CIVIL_REGISTRY: Row[] = [
  { id: '1', ma: '01/2026/ĐKKS',   quyenSo: '01-2026', ngayDangKy: '02/01/2026', noiDangKy: 'UBND P. Hàng Bông, HN',       hoTen: 'Trần Minh Khoa',    ngaySinh: '01/01/2026', quocTich: 'Việt Nam', dataStatus: 'updated', approvalStatus: 'approved',   publicStatus: 'published' },
  { id: '2', ma: '124/2026/ĐKKS',  quyenSo: '01-2026', ngayDangKy: '15/02/2026', noiDangKy: '',                            hoTen: 'Trần Minh Khoa',    ngaySinh: '14/02/2026', quocTich: 'Việt Nam', dataStatus: 'new',     approvalStatus: 'unreviewed', publicStatus: 'unpublished' },
  { id: '3', ma: '2847/2025/ĐKKS', quyenSo: '04-2025', ngayDangKy: '10/12/2025', noiDangKy: 'UBND P. Hải Châu 1, ĐN',      hoTen: 'Lê Gia Bảo',        ngaySinh: '08/12/2025', quocTich: 'Việt Nam', dataStatus: 'updated', approvalStatus: 'pending',    publicStatus: 'unpublished',
    sentBy: 'Ngô Thị Lan', sentAt: '09:40, 23/07/2026', previousValues: { noiDangKy: 'UBND P. Hải Châu, ĐN' } },
  { id: '4', ma: '298/2026/ĐKKS',  quyenSo: '01-2026', ngayDangKy: '05/03/2026', noiDangKy: 'UBND P. Lê Chân, Hải Phòng',  hoTen: 'Phạm Nhật Minh',    ngaySinh: '03/03/2026', quocTich: 'Việt Nam', dataStatus: 'updated', approvalStatus: 'approved',   publicStatus: 'published' },
  { id: '5', ma: '401/2026/ĐKKS',  quyenSo: '01-2026', ngayDangKy: '20/04/2026', noiDangKy: 'UBND P. An Hòa, Cần Thơ',     hoTen: 'Đinh Thị Yến Nhi',  ngaySinh: '18/04/2026', quocTich: 'Việt Nam', dataStatus: 'new',     approvalStatus: 'pending',    publicStatus: 'unpublished' },
  { id: '6', ma: '512/2026/ĐKKS',  quyenSo: '02-2026', ngayDangKy: '10/05/2026', noiDangKy: 'UBND P. Vĩnh Phú, Bình Dương', hoTen: 'Trần Bình An',      ngaySinh: '08/05/2026', quocTich: 'Việt Nam', dataStatus: 'updated', approvalStatus: 'rejected',   publicStatus: 'unpublished' },
  { id: '7', ma: '099/2026/ĐKKS',  quyenSo: '01-2026', ngayDangKy: '12/05/2026', noiDangKy: 'UBND P. Cầu Giấy, HN',        hoTen: 'Bùi Văn Sơn',       ngaySinh: '01/01/2026', quocTich: 'Việt Nam', dataStatus: 'updated', approvalStatus: 'reviewing',  publicStatus: 'unpublished', isDeleted: true, deletedAt: '18/07/2026 09:30', deletedBy: 'Ngô Thị Lan' },
];

// "Đăng ký khai sinh" (md-002) — mock 25 trường thật theo Phụ lục II, minh họa trường hợp cực đoan
const MOCK_CIVIL_REGISTRY_BIRTH: Row[] = [
  { id: '1', soDangKy: '045/2026', quyenSo: '02-2026', ngayDangKy: '10/01/2026', noiDangKy: 'UBND phường Nghĩa Đô, Hà Nội',
    hoTen: 'Nguyễn Gia Bảo', gioiTinh: 'Nam', ngaySinh: '05/01/2026', noiSinh: 'Bệnh viện Phụ sản Hà Nội',
    queQuan: 'Nam Định', danToc: 'Kinh', quocTich: 'Việt Nam', soDinhDanh: '001126000123',
    hoTenCha: 'Nguyễn Văn Long', namSinhCha: '1990', quocTichCha: 'Việt Nam', noiCuTruCha: 'Cầu Giấy, Hà Nội', soDinhDanhCha: '001190011122',
    hoTenMe: 'Trần Thị Hằng', namSinhMe: '1992', quocTichMe: 'Việt Nam', noiCuTruMe: 'Cầu Giấy, Hà Nội', soDinhDanhMe: '001192022233',
    hoTenNguoiYeuCau: 'Nguyễn Văn Long', quanHe: 'Cha', ghiChu: '',
    dataStatus: 'updated', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '2', soDangKy: '046/2026', quyenSo: '02-2026', ngayDangKy: '12/01/2026', noiDangKy: 'UBND phường Láng Hạ, Hà Nội',
    hoTen: 'Trần Bảo Ngọc', gioiTinh: 'Nữ', ngaySinh: '02/01/2026', noiSinh: 'Bệnh viện Bạch Mai',
    queQuan: 'Thái Bình', danToc: 'Kinh', quocTich: 'Việt Nam', soDinhDanh: '',
    hoTenCha: 'Trần Văn Sơn', namSinhCha: '1988', quocTichCha: 'Việt Nam', noiCuTruCha: 'Đống Đa, Hà Nội', soDinhDanhCha: '001188004455',
    hoTenMe: 'Lê Thị Thu', namSinhMe: '1991', quocTichMe: 'Việt Nam', noiCuTruMe: 'Đống Đa, Hà Nội', soDinhDanhMe: '001191006677',
    hoTenNguoiYeuCau: 'Trần Văn Sơn', quanHe: 'Cha', ghiChu: '',
    dataStatus: 'new', approvalStatus: 'unreviewed', publicStatus: 'unpublished' },
  { id: '3', soDangKy: '047/2026', quyenSo: '02-2026', ngayDangKy: '15/01/2026', noiDangKy: 'UBND phường Ô Chợ Dừa, Hà Nội',
    hoTen: 'Phạm Minh Anh', gioiTinh: 'Nữ', ngaySinh: '08/01/2026', noiSinh: 'Bệnh viện Phụ sản Trung ương',
    queQuan: 'Hải Dương', danToc: 'Kinh', quocTich: 'Việt Nam', soDinhDanh: '001126003344',
    hoTenCha: 'Phạm Quốc Anh', namSinhCha: '1985', quocTichCha: 'Việt Nam', noiCuTruCha: 'Đống Đa, Hà Nội', soDinhDanhCha: '001185007788',
    hoTenMe: 'Vũ Thị Lan', namSinhMe: '1989', quocTichMe: 'Việt Nam', noiCuTruMe: 'Đống Đa, Hà Nội', soDinhDanhMe: '001189009900',
    hoTenNguoiYeuCau: 'Phạm Quốc Anh', quanHe: 'Cha', ghiChu: '',
    dataStatus: 'updated', approvalStatus: 'pending', publicStatus: 'unpublished',
    sentBy: 'Nguyễn Thị Mai', sentAt: '09:00, 20/07/2026', previousValues: { noiDangKy: 'UBND phường Đống Đa, Hà Nội' } },
  { id: '4', soDangKy: '048/2026', quyenSo: '02-2026', ngayDangKy: '18/01/2026', noiDangKy: 'UBND phường Thanh Xuân Bắc, Hà Nội',
    hoTen: 'Lê Hoàng Nam', gioiTinh: 'Nam', ngaySinh: '10/01/2026', noiSinh: 'Bệnh viện Thanh Nhàn',
    queQuan: 'Ninh Bình', danToc: 'Kinh', quocTich: 'Việt Nam', soDinhDanh: '001126004455',
    hoTenCha: 'Lê Văn Hùng', namSinhCha: '1987', quocTichCha: 'Việt Nam', noiCuTruCha: 'Thanh Xuân, Hà Nội', soDinhDanhCha: '001187002233',
    hoTenMe: 'Nguyễn Thị Hoa', namSinhMe: '1990', quocTichMe: 'Việt Nam', noiCuTruMe: 'Thanh Xuân, Hà Nội', soDinhDanhMe: '001190003344',
    hoTenNguoiYeuCau: 'Lê Văn Hùng', quanHe: 'Cha', ghiChu: '',
    dataStatus: 'updated', approvalStatus: 'approved', publicStatus: 'published' },
  { id: '5', soDangKy: '049/2026', quyenSo: '02-2026', ngayDangKy: '20/01/2026', noiDangKy: 'UBND phường Yên Hòa, Hà Nội',
    hoTen: 'Đỗ Thị Khánh Linh', gioiTinh: 'Nữ', ngaySinh: '12/01/2026', noiSinh: 'Bệnh viện E',
    queQuan: 'Vĩnh Phúc', danToc: 'Kinh', quocTich: 'Việt Nam', soDinhDanh: '001126005566',
    hoTenCha: 'Đỗ Văn Kiên', namSinhCha: '1986', quocTichCha: 'Việt Nam', noiCuTruCha: 'Cầu Giấy, Hà Nội', soDinhDanhCha: '001186001122',
    hoTenMe: 'Phạm Thị Nga', namSinhMe: '1988', quocTichMe: 'Việt Nam', noiCuTruMe: 'Cầu Giấy, Hà Nội', soDinhDanhMe: '001188002233',
    hoTenNguoiYeuCau: 'Đỗ Văn Kiên', quanHe: 'Cha', ghiChu: 'Hồ sơ chưa khớp với giấy chứng sinh',
    dataStatus: 'new', approvalStatus: 'rejected', publicStatus: 'unpublished', rejectReason: 'Hồ sơ chưa khớp với giấy chứng sinh' },
  { id: '6', soDangKy: '050/2026', quyenSo: '03-2026', ngayDangKy: '22/01/2026', noiDangKy: 'UBND phường Dịch Vọng, Hà Nội',
    hoTen: 'Vũ Đức Anh', gioiTinh: 'Nam', ngaySinh: '15/01/2026', noiSinh: 'Bệnh viện Phụ sản Hà Nội',
    queQuan: 'Bắc Ninh', danToc: 'Kinh', quocTich: 'Việt Nam', soDinhDanh: '001126006677',
    hoTenCha: 'Vũ Văn Đạt', namSinhCha: '1984', quocTichCha: 'Việt Nam', noiCuTruCha: 'Cầu Giấy, Hà Nội', soDinhDanhCha: '001184003344',
    hoTenMe: 'Ngô Thị Yến', namSinhMe: '1987', quocTichMe: 'Việt Nam', noiCuTruMe: 'Cầu Giấy, Hà Nội', soDinhDanhMe: '001187004455',
    hoTenNguoiYeuCau: 'Vũ Văn Đạt', quanHe: 'Cha', ghiChu: '',
    dataStatus: 'updated', approvalStatus: 'pending', publicStatus: 'unpublished' },
  { id: '7', soDangKy: '051/2026', quyenSo: '03-2026', ngayDangKy: '25/01/2026', noiDangKy: 'UBND phường Mai Dịch, Hà Nội',
    hoTen: 'Bùi Thị Thanh Tâm', gioiTinh: 'Nữ', ngaySinh: '18/01/2026', noiSinh: 'Bệnh viện Phụ sản Hà Nội',
    queQuan: 'Hưng Yên', danToc: 'Kinh', quocTich: 'Việt Nam', soDinhDanh: '001126007788',
    hoTenCha: 'Bùi Văn Tùng', namSinhCha: '1983', quocTichCha: 'Việt Nam', noiCuTruCha: 'Cầu Giấy, Hà Nội', soDinhDanhCha: '001183005566',
    hoTenMe: 'Đặng Thị Hương', namSinhMe: '1986', quocTichMe: 'Việt Nam', noiCuTruMe: 'Cầu Giấy, Hà Nội', soDinhDanhMe: '001186006677',
    hoTenNguoiYeuCau: 'Bùi Văn Tùng', quanHe: 'Cha', ghiChu: 'Nghi trùng với bản ghi khác',
    dataStatus: 'updated', approvalStatus: 'reviewing', publicStatus: 'unpublished',
    isDeleted: true, deletedAt: '21/07/2026 10:00', deletedBy: 'Ngô Thị Lan' },
];

const MOCK_NATIONALITY: Row[] = [
  { id: '1', ma: '385/QĐ-CTN-2025', hoTen: 'Nguyễn Thị Hương',    ngaySinh: '15/05/1985', noiSinh: 'Hà Nội',        gioiTinh: 'Nữ',  ngayQuyetDinh: '20/08/2025', dataStatus: 'updated', approvalStatus: 'approved',   publicStatus: 'published' },
  { id: '2', ma: '112/QĐ-CTN-2026', hoTen: 'Nguyễn Thị Hương',     ngaySinh: '10/03/1990', noiSinh: '',              gioiTinh: 'Nam', ngayQuyetDinh: '15/02/2026', dataStatus: 'new',     approvalStatus: 'unreviewed', publicStatus: 'unpublished' },
  { id: '3', ma: '047/QĐ-CTN-2026', hoTen: 'Trần Thị Mai Ly',      ngaySinh: '22/11/1978', noiSinh: 'Đà Nẵng',       gioiTinh: 'Nữ',  ngayQuyetDinh: '10/01/2026', dataStatus: 'updated', approvalStatus: 'pending',    publicStatus: 'unpublished',
    sentBy: 'Phạm Xuân Long', sentAt: '14:20, 22/07/2026', previousValues: { noiSinh: 'TP. Đà Nẵng' } },
  { id: '4', ma: '198/QĐ-CTN-2025', hoTen: 'Phạm Văn Tùng',        ngaySinh: '08/07/1965', noiSinh: 'Nghệ An',       gioiTinh: 'Nam', ngayQuyetDinh: '05/05/2025', dataStatus: 'updated', approvalStatus: 'approved',   publicStatus: 'published' },
  { id: '5', ma: '256/QĐ-CTN-2026', hoTen: 'Hoàng Thị Bích Ngọc',  ngaySinh: '30/01/1992', noiSinh: 'Hải Phòng',     gioiTinh: 'Nữ',  ngayQuyetDinh: '28/03/2026', dataStatus: 'new',     approvalStatus: 'rejected',   publicStatus: 'unpublished' },
  { id: '6', ma: '311/QĐ-CTN-2026', hoTen: 'Vũ Đình Khương',        ngaySinh: '14/09/1988', noiSinh: 'Bắc Ninh',      gioiTinh: 'Nam', ngayQuyetDinh: '15/04/2026', dataStatus: 'updated', approvalStatus: 'pending',    publicStatus: 'unpublished' },
  { id: '7', ma: '289/QĐ-CTN-2026', hoTen: 'Đỗ Thị Thanh Huyền',    ngaySinh: '02/02/1995', noiSinh: 'Thanh Hóa',     gioiTinh: 'Nữ',  ngayQuyetDinh: '10/06/2026', dataStatus: 'updated', approvalStatus: 'reviewing',  publicStatus: 'unpublished', isDeleted: true, deletedAt: '19/07/2026 11:15', deletedBy: 'Vũ Anh Tuấn' },
];

const MOCK_INDIVIDUAL: Row[] = [
  { id: '1', ma: 'HN-LS-2019-00145',  hoTen: 'Nguyễn Thanh Hải',   ngaySinh: '15/04/1978', cccd: '001078001234', chucDanh: 'Luật sư',         soCCHN: 'CCHN-LS-0012345', linhVuc: 'Dân sự, Hình sự',       dataStatus: 'updated', approvalStatus: 'approved',   publicStatus: 'published' },
  { id: '2', ma: 'HCM-LS-2020-00892', hoTen: 'Nguyễn Thanh Hải',    ngaySinh: '22/08/1982', cccd: '079082002345', chucDanh: 'Luật sư',         soCCHN: '',                linhVuc: 'Kinh doanh thương mại', dataStatus: 'new',     approvalStatus: 'unreviewed', publicStatus: 'unpublished' },
  { id: '3', ma: 'DN-CC-2021-00234',  hoTen: 'Lê Thị Thu Hà',       ngaySinh: '10/12/1985', cccd: '048085003456', chucDanh: 'Công chứng viên', soCCHN: 'CCHN-CC-0034567', linhVuc: 'Công chứng',            dataStatus: 'updated', approvalStatus: 'pending',    publicStatus: 'unpublished',
    sentBy: 'Lê Thị Thu Hà', sentAt: '10:05, 21/07/2026', previousValues: { linhVuc: 'Công chứng hợp đồng' } },
  { id: '4', ma: 'HN-DGV-2018-00067', hoTen: 'Phạm Xuân Long',      ngaySinh: '05/03/1975', cccd: '001075004567', chucDanh: 'Đấu giá viên',    soCCHN: 'CCHN-DG-0045678', linhVuc: 'Đấu giá tài sản',      dataStatus: 'updated', approvalStatus: 'approved',   publicStatus: 'published' },
  { id: '5', ma: 'HP-QTV-2022-00189', hoTen: 'Hoàng Văn Bình',      ngaySinh: '18/06/1980', cccd: '031080005678', chucDanh: 'Quản tài viên',   soCCHN: 'CCHN-QT-0056789', linhVuc: 'Quản lý, thanh lý TS',  dataStatus: 'new',     approvalStatus: 'rejected',   publicStatus: 'unpublished' },
  { id: '6', ma: 'CT-GDVTP-2020-0045',hoTen: 'Vũ Thị Ngọc Lan',     ngaySinh: '27/09/1988', cccd: '087088006789', chucDanh: 'Giám định viên',  soCCHN: 'CCHN-GD-0067890', linhVuc: 'Tài chính kế toán',     dataStatus: 'updated', approvalStatus: 'pending',    publicStatus: 'unpublished' },
  { id: '7', ma: 'HN-LS-2026-00312',  hoTen: 'Ngô Thanh Sơn',       ngaySinh: '30/01/1990', cccd: '001090008901', chucDanh: 'Luật sư',         soCCHN: 'CCHN-LS-0078901', linhVuc: 'Dân sự',                dataStatus: 'updated', approvalStatus: 'reviewing',  publicStatus: 'unpublished', isDeleted: true, deletedAt: '17/07/2026 08:45', deletedBy: 'Ngô Thị Lan' },
];

const MOCK_ORGANIZATION: Row[] = [
  { id: '1', ma: 'TC-LS-HN-0001',  tenTochuc: 'Công ty Luật TNHH Việt Phát',              loaiHinh: 'Công ty TNHH',     soDKHD: '01012345/TP/ĐKHĐ-LS', diaChi: '12 Lý Thường Kiệt, Q. Hoàn Kiếm, HN',  nguoiDaiDien: 'Nguyễn Văn Thành', dataStatus: 'updated', approvalStatus: 'approved',   publicStatus: 'published' },
  { id: '2', ma: 'TC-LS-HCM-0089', tenTochuc: 'Công ty Luật TNHH Việt Phát',               loaiHinh: 'Văn phòng LS',     soDKHD: '01098765/TP/ĐKHĐ-LS', diaChi: '',                                       nguoiDaiDien: 'Trần Công Minh',   dataStatus: 'new',     approvalStatus: 'unreviewed', publicStatus: 'unpublished' },
  { id: '3', ma: 'TC-CC-DN-0024',  tenTochuc: 'Văn phòng Công chứng Đà Nẵng',              loaiHinh: 'Văn phòng CC',     soDKHD: '02024680/TP/ĐKHĐ-CC', diaChi: '78 Trần Phú, Q. Hải Châu, ĐN',          nguoiDaiDien: 'Lê Thị Hồng',      dataStatus: 'updated', approvalStatus: 'pending',    publicStatus: 'unpublished',
    sentBy: 'Lê Thị Hồng', sentAt: '16:30, 20/07/2026', previousValues: { diaChi: '78 Trần Phú, ĐN' } },
  { id: '4', ma: 'TC-DG-HP-0015',  tenTochuc: 'Công ty Đấu giá Hợp danh Hải Phòng',        loaiHinh: 'Công ty HD',       soDKHD: '03012345/TP/ĐKHĐ-DG', diaChi: '45 Điện Biên Phủ, Q. Lê Chân, HP',      nguoiDaiDien: 'Phạm Đức Hùng',    dataStatus: 'updated', approvalStatus: 'approved',   publicStatus: 'published' },
  { id: '5', ma: 'TC-GD-HN-0008',  tenTochuc: 'Trung tâm Giám định Tư pháp Hà Nội',        loaiHinh: 'Trung tâm',        soDKHD: '04098765/TP/ĐKHĐ-GĐ', diaChi: '101 Trần Hưng Đạo, Q. Hoàn Kiếm, HN',  nguoiDaiDien: 'Hoàng Minh Tuấn',  dataStatus: 'new',     approvalStatus: 'rejected',   publicStatus: 'unpublished' },
  { id: '6', ma: 'TC-TT-HCM-0032', tenTochuc: 'Trung tâm Trọng tài Thương mại Phía Nam',   loaiHinh: 'Trung tâm',        soDKHD: '05024680/TP/ĐKHĐ-TT', diaChi: '200 Lê Lai, Q.1, TP.HCM',               nguoiDaiDien: 'Vũ Quang Huy',     dataStatus: 'updated', approvalStatus: 'pending',    publicStatus: 'unpublished' },
  { id: '7', ma: 'TC-DG-CT-0087',  tenTochuc: 'Công ty Đấu giá Hợp danh Cần Thơ',         loaiHinh: 'Công ty HD',       soDKHD: '01087654/TP/ĐKHĐ-DG', diaChi: '15 Trần Hưng Đạo, Q. Ninh Kiều, CT',    nguoiDaiDien: 'Lâm Văn Đạt',      dataStatus: 'updated', approvalStatus: 'reviewing',  publicStatus: 'unpublished', isDeleted: true, deletedAt: '16/07/2026 10:20', deletedBy: 'Vũ Anh Tuấn' },
];

const MOCK_LEGAL_AID_OBJECT: Row[] = [
  { id: '1', ma: 'TGPL-DN-2026-001234', loai: 'Người có công',      cccd: '001078001234', hoTen: 'Nguyễn Thị Bích',     dienTGPL: 'Thương binh hạng 2/4', tinh: 'Hà Nội',     dataStatus: 'updated', approvalStatus: 'approved',   publicStatus: 'published' },
  { id: '2', ma: 'TGPL-DN-2026-002345', loai: 'Hộ nghèo',           cccd: '079090002345', hoTen: 'Nguyễn Thị Bích',      dienTGPL: '',                     tinh: 'TP.HCM',     dataStatus: 'new',     approvalStatus: 'unreviewed', publicStatus: 'unpublished' },
  { id: '3', ma: 'TGPL-DN-2025-098765', loai: 'Người dân tộc thiểu số', cccd: '038059003456', hoTen: 'Lý Thị Mai',      dienTGPL: 'DTTS cư trú vùng KK',  tinh: 'Đà Nẵng',    dataStatus: 'updated', approvalStatus: 'pending',    publicStatus: 'unpublished',
    sentBy: 'Vũ Anh Tuấn', sentAt: '11:15, 19/07/2026', previousValues: { dienTGPL: 'DTTS cư trú vùng khó khăn' } },
  { id: '4', ma: 'TGPL-DN-2026-003456', loai: 'Người cao tuổi',     cccd: '031040004567', hoTen: 'Phạm Văn Cương',       dienTGPL: 'Trên 80 tuổi không lương', tinh: 'Hải Phòng', dataStatus: 'updated', approvalStatus: 'approved',   publicStatus: 'published' },
  { id: '5', ma: 'TGPL-DN-2026-004567', loai: 'Người khuyết tật',   cccd: '087072005678', hoTen: 'Hoàng Thị Linh',       dienTGPL: 'KT nặng theo hồ sơ',   tinh: 'Cần Thơ',    dataStatus: 'new',     approvalStatus: 'rejected',   publicStatus: 'unpublished' },
  { id: '6', ma: 'TGPL-DN-2026-005678', loai: 'Trẻ em',             cccd: '001018006789', hoTen: 'Vũ Minh Quân',          dienTGPL: 'Trẻ em (dưới 16 tuổi)', tinh: 'Bình Dương', dataStatus: 'updated', approvalStatus: 'pending',    publicStatus: 'unpublished' },
  { id: '7', ma: 'TGPL-DN-2026-006789', loai: 'Người khuyết tật',   cccd: '079091009012', hoTen: 'Bùi Thị Cẩm Tú',        dienTGPL: 'KT nhẹ theo hồ sơ',      tinh: 'Hà Nội',     dataStatus: 'updated', approvalStatus: 'reviewing',  publicStatus: 'unpublished', isDeleted: true, deletedAt: '15/07/2026 15:50', deletedBy: 'Ngô Thị Lan' },
];

const MOCK_ASSET: Row[] = [
  { id: '1', ma: 'TS-2026-000145', maHopDong: 'HĐ-TC-2026-001234', hieuluc: '01/01/2026 – 01/01/2031', soGCN: 'GCN-QSD-001234567', loaiTaiSan: 'Quyền sử dụng đất',    benBaoDam: 'Nguyễn Văn Hùng',    dataStatus: 'updated', approvalStatus: 'approved',   publicStatus: 'published' },
  { id: '2', ma: 'TS-2026-000287', maHopDong: 'HĐ-TC-2026-002345', hieuluc: '15/02/2026 – 15/02/2029', soGCN: '',                  loaiTaiSan: 'Phương tiện ô tô',     benBaoDam: 'Nguyễn Văn Hùng',    dataStatus: 'new',     approvalStatus: 'unreviewed', publicStatus: 'unpublished' },
  { id: '3', ma: 'TS-2025-008456', maHopDong: 'HĐ-TC-2025-003456', hieuluc: '20/11/2025 – 20/11/2028', soGCN: 'GCN-SHNO-003456789',loaiTaiSan: 'Nhà ở',                benBaoDam: 'Lê Minh Đức',         dataStatus: 'updated', approvalStatus: 'pending',    publicStatus: 'unpublished',
    sentBy: 'Hoàng Đức Lân', sentAt: '13:50, 18/07/2026', previousValues: { hieuluc: '20/11/2025 – 20/11/2027' } },
  { id: '4', ma: 'TS-2026-000401', maHopDong: 'HĐ-TC-2026-004567', hieuluc: '10/03/2026 – 10/03/2030', soGCN: 'GCN-MMTB-004567890',loaiTaiSan: 'Máy móc thiết bị',     benBaoDam: 'Phạm Quốc Khánh',    dataStatus: 'updated', approvalStatus: 'rejected',   publicStatus: 'unpublished' },
  { id: '5', ma: 'TS-2026-000512', maHopDong: 'HĐ-TC-2026-005678', hieuluc: '25/04/2026 – 25/04/2028', soGCN: 'GCN-HHDV-005678901',loaiTaiSan: 'Hàng hóa trong kho',   benBaoDam: 'Hoàng Đức Lân',      dataStatus: 'new',     approvalStatus: 'approved',   publicStatus: 'published' },
  { id: '6', ma: 'TS-2026-000623', maHopDong: 'HĐ-TC-2026-006789', hieuluc: '05/06/2026 – 05/06/2029', soGCN: 'GCN-QSD-006789012', loaiTaiSan: 'Tài sản hình thành trong tương lai', benBaoDam: 'Vũ Thị Hà',  dataStatus: 'updated', approvalStatus: 'pending',    publicStatus: 'unpublished' },
  { id: '7', ma: 'TS-2026-000734', maHopDong: 'HĐ-TC-2026-007890', hieuluc: '12/06/2026 – 12/06/2030', soGCN: 'GCN-QSD-007890123', loaiTaiSan: 'Quyền sử dụng đất',    benBaoDam: 'Đặng Văn Kiên',  dataStatus: 'updated', approvalStatus: 'reviewing',  publicStatus: 'unpublished', isDeleted: true, deletedAt: '14/07/2026 09:05', deletedBy: 'Vũ Anh Tuấn' },
];

const MOCK_BY_CATEGORY: Record<DataCategory, Row[]> = {
  'enforcement':          MOCK_ENFORCEMENT,
  'civil-registry':       MOCK_CIVIL_REGISTRY,
  'civil-registry-birth': MOCK_CIVIL_REGISTRY_BIRTH,
  'nationality':       MOCK_NATIONALITY,
  'individual':        MOCK_INDIVIDUAL,
  'organization':      MOCK_ORGANIZATION,
  'legal-aid-object':  MOCK_LEGAL_AID_OBJECT,
  'asset':             MOCK_ASSET,
};

// For civil registry items, prefix the maDangKy based on the specific type
// (md-002 "Đăng ký khai sinh" không dùng bảng này nữa — đã tách sang category 'civil-registry-birth' riêng)
const CIVIL_REGISTRY_PREFIXES: Record<string, string> = {
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

// ─── Lịch sử thay đổi & Phiên bản — mock theo id bản ghi (minh họa, không phụ thuộc category) ──

type HistoryKind = 'send' | 'edit' | 'approve' | 'reject' | 'create' | 'delete';
interface HistoryEntry { action: string; time: string; user: string; note: string; verChange?: string; kind: HistoryKind }

// Màu/nền icon theo loại thao tác — khớp bảng TL_ICON của mockup
const HISTORY_KIND_STYLE: Record<HistoryKind, { bg: string; dot: string }> = {
  send:    { bg: 'bg-purple-100', dot: 'bg-purple-500' },
  edit:    { bg: 'bg-blue-100',   dot: 'bg-blue-500' },
  approve: { bg: 'bg-green-100',  dot: 'bg-green-500' },
  reject:  { bg: 'bg-red-100',    dot: 'bg-red-500' },
  create:  { bg: 'bg-slate-100',  dot: 'bg-slate-400' },
  delete:  { bg: 'bg-red-100',    dot: 'bg-red-500' },
};

const HISTORY_BY_ROW_ID: Record<string, HistoryEntry[]> = {
  '1': [
    { action: 'Phê duyệt', time: '09:12, 02/07/2026', user: 'Nguyễn Thanh Hải', note: 'Phê duyệt cập nhật thông tin bản ghi.', verChange: 'v1.1 → v1.2', kind: 'approve' },
    { action: 'Chỉnh sửa', time: '16:40, 01/07/2026', user: 'Trần Minh Phúc', note: 'Bổ sung, chỉnh sửa một số trường dữ liệu.', kind: 'edit' },
    { action: 'Tạo mới', time: '08:00, 10/01/2026', user: 'Hệ thống', note: 'Khởi tạo bản ghi từ đồng bộ dữ liệu.', verChange: 'v1.0', kind: 'create' },
  ],
  '4': [
    { action: 'Từ chối', time: '10:08, 28/06/2026', user: 'Lê Thị Thu Hà', note: 'Số liệu chưa khớp với hồ sơ gốc, yêu cầu bổ sung.', kind: 'reject' },
    { action: 'Gửi phê duyệt', time: '14:23, 27/06/2026', user: 'Phạm Xuân Long', note: 'Gửi yêu cầu phê duyệt cập nhật.', kind: 'send' },
    { action: 'Tạo mới', time: '08:00, 20/02/2025', user: 'Hệ thống', note: 'Khởi tạo bản ghi từ đồng bộ dữ liệu.', verChange: 'v1.0', kind: 'create' },
  ],
  '7': [
    { action: 'Xóa bản ghi', time: '14:02, 20/07/2026', user: 'Ngô Thị Lan', note: 'Xóa mềm do nghi trùng lặp với bản ghi khác.', kind: 'delete' },
    { action: 'Tạo mới', time: '08:00, 12/05/2025', user: 'Hệ thống', note: 'Khởi tạo bản ghi từ đồng bộ dữ liệu.', verChange: 'v1.0', kind: 'create' },
  ],
};

interface VersionEntry { ver: string; date: string; by: string; change: string; status: 'current' | 'draft' | 'archived' }

const VERSIONS_BY_ROW_ID: Record<string, VersionEntry[]> = {
  '1': [
    { ver: 'v1.2', date: '02/07/2026', by: 'Nguyễn Thanh Hải', change: 'Cập nhật thông tin bản ghi', status: 'current' },
    { ver: 'v1.1', date: '15/03/2026', by: 'Nguyễn Quốc Bảo', change: 'Phê duyệt khởi tạo', status: 'archived' },
    { ver: 'v1.0', date: '10/01/2026', by: 'Hệ thống', change: 'Khởi tạo bản ghi', status: 'archived' },
  ],
  '3': [
    { ver: 'v2.0', date: '01/06/2026', by: 'Vũ Anh Tuấn', change: 'Cập nhật cơ quan ban hành', status: 'current' },
    { ver: 'v1.0', date: '20/02/2025', by: 'Hệ thống', change: 'Khởi tạo bản ghi', status: 'archived' },
  ],
};

// ─── Rà soát: gợi ý trùng lặp & cảnh báo thiếu dữ liệu ────────────────────────

// Trường dùng để so khớp trùng lặp theo từng loại dữ liệu
const DUPLICATE_KEY_FIELD: Record<DataCategory, string> = {
  'enforcement': 'hoTen',
  'civil-registry': 'hoTen',
  'civil-registry-birth': 'hoTen',
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

// Trả về TỪNG NHÓM bản ghi trùng lặp (hỗ trợ nhóm > 2 bản ghi), thay vì chỉ 1 Set id phẳng
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

// ─── Status badges ────────────────────────────────────────────────────────────

function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  if (status === 'approved')
    return <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-[12px] rounded-full whitespace-nowrap">Đã duyệt</span>;
  if (status === 'pending')
    return <span className="px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 text-[12px] rounded-full whitespace-nowrap">Chờ phê duyệt</span>;
  if (status === 'reviewing')
    return <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[12px] rounded-full whitespace-nowrap">Đang rà soát</span>;
  if (status === 'unreviewed')
    return <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 text-[12px] rounded-full whitespace-nowrap">Chưa phê duyệt</span>;
  return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-[12px] rounded-full whitespace-nowrap">Từ chối</span>;
}

function DataStatusBadge({ status }: { status: DataStatus }) {
  if (status === 'new')
    return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[12px] rounded-full whitespace-nowrap">Mới</span>;
  return <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[12px] rounded-full whitespace-nowrap">Cập nhật</span>;
}

function PublicBadge({ status }: { status: PublicStatus }) {
  if (status === 'published')
    return <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-[12px] rounded-full whitespace-nowrap">Đã công khai</span>;
  return <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 text-[12px] rounded-full whitespace-nowrap">Chưa công khai</span>;
}

function VersionStatusBadge({ status }: { status: VersionEntry['status'] }) {
  if (status === 'current')
    return <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 text-[11px] rounded-full whitespace-nowrap">Hiện tại</span>;
  if (status === 'draft')
    return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] rounded-full whitespace-nowrap">Nháp</span>;
  return <span className="px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 text-[11px] rounded-full whitespace-nowrap">Lưu trữ</span>;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  masterId: string;
  masterLabel: string;
}

export function MasterDataUpdateItemPage({ masterId, masterLabel }: Props) {
  const [activeTab, setActiveTab] = useState<'list' | 'approval' | 'version'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const config = ITEM_CONFIGS[masterId] || { category: 'individual' as DataCategory, unit: '—', system: '—', idLabel: 'Mã' };
  const cols = COLUMNS[config.category];
  const idCols = cols.filter(c => c.isId);
  const otherCols = cols.filter(c => !c.isId);
  const idLabel = idCols.map(c => c.label).join(' + ');
  // Ưu tiên trường định danh con người/tổ chức (đã dùng để so khớp trùng lặp) làm cột hiển thị chính
  const primaryCol = cols.find(c => c.key === DUPLICATE_KEY_FIELD[config.category]) || otherCols[0] || cols[0];

  // Dữ liệu bản ghi — lưu trong state để có thể phê duyệt/từ chối/công khai/xóa mềm trực tiếp
  const [recordsData, setRecordsData] = useState<Row[]>(() => getMockData(masterId, config.category));

  // Danh sách & rà soát — Đang hoạt động / Đã xóa (UC5 — xóa mềm & khôi phục)
  const [listViewMode, setListViewMode] = useState<'active' | 'trash'>('active');
  const activeData = recordsData.filter(r => !r.isDeleted);
  const trashData = recordsData.filter(r => r.isDeleted);

  // Phê duyệt (giống tab Phê duyệt tại Biên tập danh mục)
  const [approvalStatusFilter, setApprovalStatusFilter] = useState<'all' | ApprovalStatus>('all');
  const [selectedApprovalIds, setSelectedApprovalIds] = useState<string[]>([]);
  // UC492 — modal lý do từ chối & xem chi tiết bản ghi
  const [rejectModal, setRejectModal] = useState<{ open: boolean; ids: string[]; reason: string }>({ open: false, ids: [], reason: '' });
  const [detailRow, setDetailRow] = useState<Row | null>(null);
  // Xem chi tiết mở từ "Danh sách & rà soát" chỉ hiện thông tin phẳng + lịch sử (không so sánh trước/sau);
  // mở từ "Phê duyệt" mới hiện khối so sánh bản gốc — vì lúc đó mới thực sự cần đối chiếu để duyệt.
  const [detailRowContext, setDetailRowContext] = useState<'list' | 'approval'>('list');

  // Công khai / Hủy công khai — theo TỪNG BẢN GHI (UC497/498), không còn là toggle cấp trang
  const [publishModal, setPublishModal] = useState<{ id: string; mode: 'publish' | 'unpublish' } | null>(null);
  const [shareScope, setShareScope] = useState<'internal' | 'extended' | 'public'>('internal');
  const [unpublishReason, setUnpublishReason] = useState('');

  // Rà soát dữ liệu — gợi ý trùng lặp & cảnh báo thiếu dữ liệu (giao dịch 2), chỉnh sửa/đánh dấu đang rà soát (giao dịch 3)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, string>>({});

  // Đồng bộ dữ liệu (UC1 — nguồn phát sinh bản ghi Mới/Cập nhật, theo quy tắc ở Mô hình dữ liệu chủ)
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Trùng lặp — nhiều nhóm, mỗi nhóm có thể > 2 bản ghi
  const [showDupModal, setShowDupModal] = useState(false);
  const [selectedDupGroupIdx, setSelectedDupGroupIdx] = useState(0);

  // Phiên bản — danh sách bản ghi (tìm kiếm + icon xem) → chi tiết bảng phiên bản
  const [versionSearch, setVersionSearch] = useState('');
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  // Modal "So sánh phiên bản" — dùng chung cho tab Lịch sử thay đổi & tab Phiên bản
  const [compareModal, setCompareModal] = useState<{ rowId: string; fromIdx: number; toIdx: number } | null>(null);
  // Modal "Chi tiết phiên bản" — snapshot thông tin phát hành
  const [versionDetailModal, setVersionDetailModal] = useState<{ rowId: string; index: number } | null>(null);

  const openCompareModal = (rowId: string, toIdx = 0) => {
    const versions = VERSIONS_BY_ROW_ID[rowId] || [];
    const fromIdx = Math.min(toIdx + 1, Math.max(versions.length - 1, 0));
    setCompareModal({ rowId, fromIdx, toIdx });
  };

  const listSourceData = listViewMode === 'active' ? activeData : trashData;
  const listData = listSourceData.filter(r => {
    if (!searchQuery) return true;
    return Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const duplicateGroups = computeDuplicateGroups(activeData, config.category);
  const duplicateIds = new Set(duplicateGroups.flat().map(r => r.id));
  const incompleteIds = new Set(activeData.filter(r => isRowIncomplete(r, cols)).map(r => r.id));

  const stats = {
    approved: activeData.filter(r => r.approvalStatus === 'approved').length,
    pending:  activeData.filter(r => r.approvalStatus === 'pending').length,
    rejected: activeData.filter(r => r.approvalStatus === 'rejected').length,
  };

  const tabs = [
    { id: 'list' as const,     label: 'Danh sách & rà soát', icon: List },
    { id: 'approval' as const, label: 'Phê duyệt',           icon: CheckCircle2 },
    { id: 'version' as const,  label: 'Phiên bản',           icon: GitBranch },
  ];

  // ─── Phê duyệt handlers ───────────────────────────────────────────────────
  // Tab Phê duyệt chỉ xử lý bản ghi ĐÃ được gửi đi phê duyệt (UC2/UC3) — "Chưa phê duyệt"
  // và "Đang rà soát" thuộc phạm vi tab "Danh sách & rà soát", không hiển thị lại ở đây.
  const approvalScopedData = activeData.filter(r => r.approvalStatus === 'pending' || r.approvalStatus === 'approved' || r.approvalStatus === 'rejected');

  const approvalFilteredData = approvalScopedData.filter(r => {
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
    setRecordsData(prev => prev.map(r => ids.includes(r.id) ? { ...r, approvalStatus: 'rejected', rejectReason: reason } : r));
    setSelectedApprovalIds(prev => prev.filter(id => !ids.includes(id)));
    setRejectModal({ open: false, ids: [], reason: '' });
    alert('Đã từ chối phê duyệt kèm lý do. Trạng thái cập nhật và thông báo đã gửi tới cán bộ nghiệp vụ.');
  };

  // UC493 — Hủy phê duyệt: đưa bản ghi đã duyệt về "Chờ phê duyệt", ghi log & thông báo
  const handleUnapprove = (id: string) => {
    // Hủy phê duyệt đưa bản ghi về "Chưa phê duyệt" (khác với "Chờ phê duyệt") — cán bộ nghiệp vụ
    // phải rà soát và gửi lại từ đầu, không được tự động vào lại hàng chờ duyệt.
    setRecordsData(prev => prev.map(r => r.id === id ? { ...r, approvalStatus: 'unreviewed' } : r));
    alert('Đã hủy phê duyệt. Bản ghi chuyển về "Chưa phê duyệt" (khác với "Chờ phê duyệt", cần được cán bộ nghiệp vụ rà soát và gửi lại từ đầu), ghi nhận log thao tác và gửi thông báo tới cán bộ nghiệp vụ.');
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
    setRecordsData(prev => prev.map(r => {
      if (r.id !== editingRowId) return r;
      // Ghi lại giá trị TRƯỚC khi sửa cho các trường thực sự thay đổi — dùng để so sánh ở modal phê duyệt
      const changed: Record<string, string> = {};
      cols.forEach(col => { if ((editFormData[col.key] || '') !== (r[col.key] || '')) changed[col.key] = r[col.key] || ''; });
      return {
        ...r,
        ...editFormData,
        approvalStatus: 'reviewing',
        previousValues: Object.keys(changed).length > 0 ? changed : r.previousValues,
      };
    }));
    handleCloseEdit();
    alert('Đã lưu thay đổi tạm thời. Bản ghi được đánh dấu "Đang rà soát".');
  };

  const handleSendForApproval = (row: Row) => {
    if (isRowIncomplete(row, cols)) {
      alert('Bản ghi còn thiếu dữ liệu bắt buộc. Vui lòng bổ sung đầy đủ thông tin trước khi gửi phê duyệt.');
      return;
    }
    setRecordsData(prev => prev.map(r => r.id === row.id ? { ...r, approvalStatus: 'pending', sentBy: 'Nguyễn Văn A', sentAt: new Date().toLocaleString('vi-VN') } : r));
    alert('Đã gửi bản ghi đi phê duyệt. Trạng thái cập nhật thành "Chờ phê duyệt" và thông báo đã được gửi tới lãnh đạo nghiệp vụ.');
  };

  // UC5 — Xóa mềm & khôi phục bản ghi
  const handleSoftDelete = (row: Row) => {
    if (!window.confirm(`Xóa bản ghi "${row[primaryCol.key] || row.ma || row.id}"? Bản ghi sẽ được chuyển vào mục "Đã xóa" và có thể khôi phục lại bất cứ lúc nào.`)) return;
    setRecordsData(prev => prev.map(r => r.id === row.id ? { ...r, isDeleted: true, deletedAt: new Date().toLocaleString('vi-VN'), deletedBy: 'Nguyễn Văn A' } : r));
  };

  const handleRestore = (row: Row) => {
    setRecordsData(prev => prev.map(r => r.id === row.id ? { ...r, isDeleted: false, deletedAt: undefined, deletedBy: undefined } : r));
    alert('Đã khôi phục bản ghi về trạng thái Hoạt động.');
  };

  // ─── Đồng bộ dữ liệu (UC1) ────────────────────────────────────────────────

  const handleConfirmSync = () => {
    setShowSyncModal(false);
    const newCount = Math.max(1, Math.round(cols.length / 3));
    const updatedCount = Math.max(1, Math.round(cols.length / 4));
    alert(
      `Đang đồng bộ… hoàn tất: ${newCount} bản ghi Mới, ${updatedCount} bản ghi Cập nhật đã vào danh sách với trạng thái "Chưa phê duyệt" để rà soát.` +
      (duplicateGroups.length > 0 ? ` ${duplicateGroups.length} nhóm bản ghi nghi trùng lặp cần kiểm tra thủ công.` : '')
    );
  };

  // ─── Công khai / Hủy công khai handlers (UC497/498 — theo từng bản ghi) ──

  const openPublishModal = (row: Row) => { setShareScope('internal'); setPublishModal({ id: row.id, mode: 'publish' }); };
  const openUnpublishModal = (row: Row) => { setUnpublishReason(''); setPublishModal({ id: row.id, mode: 'unpublish' }); };
  const closePublishModal = () => setPublishModal(null);

  const handleConfirmPublish = () => {
    if (!publishModal) return;
    const id = publishModal.id;
    const date = new Date().toLocaleDateString('vi-VN');
    setRecordsData(prev => prev.map(r => r.id === id ? { ...r, publicStatus: 'published', publicActionInfo: { user: 'Nguyễn Văn A', date } } : r));
    setPublishModal(null);
    alert(`Công khai dữ liệu thành công với phạm vi: ${shareScope === 'internal' ? 'Nội bộ' : shareScope === 'extended' ? 'Mở rộng' : 'Toàn dân'}`);
  };

  const handleConfirmUnpublish = () => {
    if (!publishModal) return;
    if (!unpublishReason.trim()) {
      alert('Vui lòng nhập lý do hủy công khai!');
      return;
    }
    const id = publishModal.id;
    const date = new Date().toLocaleDateString('vi-VN');
    setRecordsData(prev => prev.map(r => r.id === id ? { ...r, publicStatus: 'unpublished', publicActionInfo: { user: 'Nguyễn Văn A', date, reason: unpublishReason.trim() } } : r));
    setPublishModal(null);
    setUnpublishReason('');
    alert('Đã hủy công khai dữ liệu thành công!');
  };

  const totalPages = Math.max(1, Math.ceil(listData.length / pageSize));
  const paginatedData = listData.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  // ─── Phiên bản — danh sách bản ghi để chọn ────────────

  const versionPickerRows = recordsData.filter(r => {
    if (!versionSearch) return true;
    return Object.values(r).some(v => String(v).toLowerCase().includes(versionSearch.toLowerCase()));
  });

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

      {/* ─── Tab: Danh sách & rà soát ─── */}
      {activeTab === 'list' && (
        <>
          {/* Gợi ý trùng lặp & cảnh báo thiếu dữ liệu — chỉ áp dụng cho bản ghi đang hoạt động */}
          {listViewMode === 'active' && (duplicateIds.size > 0 || incompleteIds.size > 0) && (
            <div className="flex flex-col sm:flex-row gap-3">
              {duplicateIds.size > 0 && (
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border bg-yellow-50 border-yellow-200 text-[13px]">
                  <Copy className="w-4 h-4 flex-shrink-0 text-yellow-600" />
                  <p className="text-yellow-800">
                    <b className="font-medium">Phát hiện {duplicateGroups.length} nhóm bản ghi có thể trùng lặp ({duplicateIds.size} bản ghi)</b> —{' '}
                    <button onClick={() => { setSelectedDupGroupIdx(0); setShowDupModal(true); }} className="underline font-medium cursor-pointer text-yellow-700">
                      Xem chi tiết đối chiếu
                    </button>
                  </p>
                </div>
              )}
              {incompleteIds.size > 0 && (
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border bg-red-50 border-red-200 text-[13px]">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600" />
                  <p className="text-red-800">
                    <b className="font-medium">Phát hiện {incompleteIds.size} bản ghi thiếu dữ liệu</b> — cần bổ sung trước khi gửi phê duyệt.
                  </p>
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
                placeholder="Tìm theo mã bản ghi, mã quản lý đối tượng..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPageNum(1); }}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-white hover:bg-slate-50/50 font-medium shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              {listViewMode === 'active' && (
                <>
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
                    <ArrowUpDown className="w-4 h-4" />
                    Sắp xếp
                  </button>
                  <div className="w-px self-stretch bg-slate-200" />
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium border border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    Nhập
                  </button>
                </>
              )}
              <button
                type="button"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[13px] font-medium transition-all cursor-pointer active:scale-95 shadow-sm whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Xuất
              </button>
              {listViewMode === 'active' && (
                <button
                  type="button"
                  onClick={() => setShowSyncModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-medium transition-all cursor-pointer active:scale-95 shadow-sm whitespace-nowrap"
                >
                  <RefreshCw className="w-4 h-4" />
                  Đồng bộ dữ liệu
                </button>
              )}
            </div>
          </div>

          {/* Segmented: Đang hoạt động / Đã xóa (UC5) */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit text-[13px] font-medium">
            <button
              onClick={() => { setListViewMode('active'); setCurrentPageNum(1); }}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${listViewMode === 'active' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Đang hoạt động <span className="text-slate-400">({activeData.length})</span>
            </button>
            <button
              onClick={() => { setListViewMode('trash'); setCurrentPageNum(1); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${listViewMode === 'trash' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Đã xóa <span className="text-slate-400">({trashData.length})</span>
            </button>
          </div>

          {listViewMode === 'active' && cols.length > idCols.length + 1 && (
            <p className="text-[12px] text-slate-400">
              Hiển thị {idCols.length + 1}/{cols.length} trường chính — nhấn biểu tượng mắt (Xem chi tiết) để xem đầy đủ.
            </p>
          )}

          {/* Grid Table + Pagination */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200">
                  {listViewMode === 'active' ? (
                    <tr>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap w-14 text-center">STT</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Mã quản lý đối tượng</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">{primaryCol.label}</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Trạng thái dữ liệu</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Trạng thái duyệt</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Công khai</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-44">Thao tác</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap w-14 text-center">STT</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Mã quản lý đối tượng</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">{primaryCol.label}</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ngày xóa</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Người xóa</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-24">Thao tác</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {listViewMode === 'active' && paginatedData.map((row, index) => {
                    const isDup = duplicateIds.has(row.id);
                    const isIncomplete = incompleteIds.has(row.id);
                    const dupField = DUPLICATE_KEY_FIELD[config.category];
                    const missingLabels = cols.filter(c => !row[c.key] || row[c.key].trim() === '').map(c => c.label);
                    const warningParts: string[] = [];
                    if (isDup) warningParts.push(`Có thể trùng lặp (trùng "${row[dupField]}" với bản ghi khác)`);
                    if (isIncomplete) warningParts.push(`Thiếu dữ liệu: ${missingLabels.join(', ')}`);
                    const warningTooltip = warningParts.join(' • ');
                    const canSend = row.approvalStatus === 'unreviewed' || row.approvalStatus === 'reviewing' || row.approvalStatus === 'rejected';
                    const idValue = idCols.map(c => row[c.key]).filter(Boolean).join(' / ');
                    return (
                    <tr key={row.id} className={`hover:bg-slate-50/50 transition-colors ${isIncomplete ? 'bg-red-50/40' : isDup ? 'bg-yellow-50/40' : ''}`}>
                      <td className="px-6 py-4 text-[13px] text-slate-500 text-center">{(currentPageNum - 1) * pageSize + index + 1}</td>
                      <td className="px-6 py-4 text-[13px] text-slate-700 font-mono whitespace-nowrap">
                        {idValue || <span className="text-red-500 italic font-sans">— chưa đủ khóa —</span>}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap max-w-[200px] truncate">
                        <span className="inline-flex items-center gap-1.5">
                          {row[primaryCol.key] || <span className="text-slate-400 italic">(trống)</span>}
                          {warningTooltip && (
                            <AlertTriangle className={`w-3.5 h-3.5 flex-shrink-0 cursor-help ${isIncomplete ? 'text-red-500' : 'text-yellow-500'}`} title={warningTooltip} />
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center"><DataStatusBadge status={row.dataStatus} /></td>
                      <td className="px-6 py-4 text-center"><ApprovalBadge status={row.approvalStatus} /></td>
                      <td className="px-6 py-4 text-center"><PublicBadge status={row.publicStatus} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => { setDetailRowContext('list'); setDetailRow(row); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Xem chi tiết">
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
                            disabled={!canSend}
                            onClick={canSend ? () => handleSendForApproval(row) : undefined}
                            className="p-1.5 rounded-lg transition-colors cursor-pointer text-indigo-600 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                            title={canSend ? 'Trình duyệt' : 'Chỉ có thể trình duyệt bản ghi chưa phê duyệt, đang rà soát hoặc bị từ chối'}
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          {row.publicStatus === 'published' ? (
                            <button
                              onClick={() => openUnpublishModal(row)}
                              className="p-1.5 rounded-lg transition-colors cursor-pointer text-red-500 hover:bg-red-50"
                              title="Hủy công khai"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              disabled={row.approvalStatus !== 'approved'}
                              onClick={row.approvalStatus === 'approved' ? () => openPublishModal(row) : undefined}
                              className="p-1.5 rounded-lg transition-colors cursor-pointer text-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                              title={row.approvalStatus === 'approved' ? 'Công khai' : 'Chỉ có thể công khai bản ghi đã phê duyệt'}
                            >
                              <Globe className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleSoftDelete(row)}
                            className="p-1.5 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Xóa bản ghi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                  {listViewMode === 'trash' && paginatedData.map((row, index) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-[13px] text-slate-500 text-center">{(currentPageNum - 1) * pageSize + index + 1}</td>
                      <td className="px-6 py-4 text-[13px] text-slate-700 font-mono whitespace-nowrap">{idCols.map(c => row[c.key]).filter(Boolean).join(' / ')}</td>
                      <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{row[primaryCol.key]}</td>
                      <td className="px-6 py-4 text-[13px] text-slate-500 whitespace-nowrap">{row.deletedAt || '—'}</td>
                      <td className="px-6 py-4 text-[13px] text-slate-500 whitespace-nowrap">{row.deletedBy || '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleRestore(row)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                            title="Khôi phục"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={listViewMode === 'active' ? 7 : 6} className="px-6 py-16 text-center text-[13px] text-slate-400">
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

          {/* Stat Cards — chỉ phạm vi đã gửi phê duyệt: Tổng, Chờ phê duyệt, Đã phê duyệt, Từ chối */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <List className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700">Tổng yêu cầu</p>
                  <p className="text-2xl text-blue-900">{approvalScopedData.length}</p>
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
                  { value: 'all' as const, label: 'Tất cả', activeClass: 'bg-slate-700 text-white border-slate-700' },
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

          {cols.length > idCols.length + 1 && (
            <p className="text-[12px] text-slate-400">
              Hiển thị {idCols.length + 1}/{cols.length} trường chính — nhấn biểu tượng mắt (Xem chi tiết) để xem đầy đủ.
            </p>
          )}

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
                    <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600 whitespace-nowrap">Mã quản lý đối tượng</th>
                    <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600 whitespace-nowrap">{primaryCol.label}</th>
                    <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600">Trạng thái duyệt</th>
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
                      <td className="px-6 py-3 text-[13px] text-slate-700 font-mono whitespace-nowrap">{idCols.map(c => row[c.key]).filter(Boolean).join(' / ')}</td>
                      <td className="px-6 py-3 text-[13px] text-slate-700 whitespace-nowrap max-w-[200px] truncate">{row[primaryCol.key]}</td>
                      <td className="px-6 py-3 whitespace-nowrap"><ApprovalBadge status={row.approvalStatus} /></td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setDetailRowContext('approval'); setDetailRow(row); }}
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
                              onClick={() => handleUnapprove(row.id)}
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
                      <td colSpan={6} className="px-6 py-16 text-center text-[13px] text-slate-400">
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

      {/* ─── Tab: Phiên bản — danh sách bản ghi (tìm kiếm + icon xem) → chi tiết bảng phiên bản ─── */}
      {activeTab === 'version' && (
        <div className="space-y-4">
          {!selectedVersionId ? (
              <>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo mã bản ghi, mã quản lý đối tượng..."
                    value={versionSearch}
                    onChange={e => setVersionSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                  />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 text-[13px] font-semibold w-14 text-center">STT</th>
                          <th className="px-6 py-4 text-[13px] font-semibold whitespace-nowrap">Mã quản lý đối tượng</th>
                          <th className="px-6 py-4 text-[13px] font-semibold whitespace-nowrap">{primaryCol.label}</th>
                          <th className="px-6 py-4 text-[13px] font-semibold text-center w-24">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {versionPickerRows.map((row, i) => (
                          <tr key={row.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 text-[13px] text-slate-500 text-center">{i + 1}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 font-mono whitespace-nowrap">{idCols.map(c => row[c.key]).filter(Boolean).join(' / ')}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{row[primaryCol.key]}</td>
                            <td className="px-6 py-4 text-center">
                              <button onClick={() => setSelectedVersionId(row.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors" title="Xem phiên bản">
                                <GitBranch className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {versionPickerRows.length === 0 && (
                          <tr><td colSpan={4} className="px-6 py-16 text-center text-[13px] text-slate-400">Không tìm thấy bản ghi phù hợp</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (() => {
              const row = recordsData.find(r => r.id === selectedVersionId);
              const versions = VERSIONS_BY_ROW_ID[selectedVersionId] || [];
              return (
                <div className="space-y-4">
                  <button onClick={() => setSelectedVersionId(null)} className="flex items-center gap-1.5 text-[13px] text-slate-600 hover:text-slate-900 cursor-pointer font-medium">
                    ← Quay lại
                  </button>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GitBranch className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-[13.5px] text-slate-800">{row ? row[primaryCol.key] : selectedVersionId}</div>
                      <div className="text-[12px] text-slate-500 font-mono">{row ? idCols.map(c => row[c.key]).filter(Boolean).join(' / ') : ''}</div>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-3 text-[13px] font-semibold w-14 text-center">STT</th>
                            <th className="px-6 py-3 text-[13px] font-semibold">Phiên bản</th>
                            <th className="px-6 py-3 text-[13px] font-semibold">Ngày tạo</th>
                            <th className="px-6 py-3 text-[13px] font-semibold">Người tạo</th>
                            <th className="px-6 py-3 text-[13px] font-semibold">Loại thay đổi</th>
                            <th className="px-6 py-3 text-[13px] font-semibold text-center">Trạng thái</th>
                            <th className="px-6 py-3 text-[13px] font-semibold text-center w-24">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {versions.map((v, i) => (
                            <tr key={i} className={v.status === 'current' ? 'bg-blue-50/40' : ''}>
                              <td className="px-6 py-3 text-[13px] text-slate-500 text-center">{i + 1}</td>
                              <td className="px-6 py-3 text-[13px]"><span className="px-2 py-0.5 bg-slate-100 rounded-full font-mono text-[12px] text-slate-700">{v.ver}</span></td>
                              <td className="px-6 py-3 text-[13px] text-slate-500">{v.date}</td>
                              <td className="px-6 py-3 text-[13px] text-slate-500">{v.by}</td>
                              <td className="px-6 py-3 text-[13px] text-slate-700">{v.change}</td>
                              <td className="px-6 py-3 text-center"><VersionStatusBadge status={v.status} /></td>
                              <td className="px-6 py-3">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => setVersionDetailModal({ rowId: selectedVersionId!, index: i })}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                                    title="Xem chi tiết phiên bản"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    disabled={i >= versions.length - 1}
                                    onClick={i < versions.length - 1 ? () => openCompareModal(selectedVersionId!, i) : undefined}
                                    className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                                    title={i < versions.length - 1 ? 'So sánh với phiên bản trước' : 'Không có phiên bản trước để so sánh'}
                                  >
                                    <GitCompare className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {versions.length === 0 && (
                            <tr><td colSpan={7} className="px-6 py-16 text-center text-[13px] text-slate-400">Chưa có phiên bản nào</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>
      )}

      {/* Modal Chi tiết phiên bản — snapshot thông tin phát hành */}
      {versionDetailModal && (() => {
        const { rowId, index } = versionDetailModal;
        const row = recordsData.find(r => r.id === rowId);
        const versions = VERSIONS_BY_ROW_ID[rowId] || [];
        const v = versions[index];
        if (!row || !v) return null;
        return (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-slate-500" />
                    Chi tiết phiên bản {v.ver}
                  </h3>
                  <p className="text-[12.5px] text-slate-500 mt-1">Dữ liệu snapshot tại thời điểm phát hành</p>
                </div>
                <button onClick={() => setVersionDetailModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex-shrink-0" title="Đóng">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-[13px] overflow-y-auto">
                <div>
                  <div className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Thông tin chung</div>
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                    {cols.map(col => (
                      <div key={col.key} className="flex px-3 py-2">
                        <span className="w-40 shrink-0 text-slate-500">{col.label}</span>
                        <span className="flex-1 text-slate-800 font-medium break-words">{row[col.key] || <span className="text-slate-400 italic">(trống)</span>}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Phát hành</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><div className="text-slate-500">Người tạo phiên bản</div><div className="font-medium text-slate-800">{v.by}</div></div>
                    <div><div className="text-slate-500">Ngày phát hành</div><div className="font-medium text-slate-800">{v.date}</div></div>
                  </div>
                </div>
                {index > 0 && (
                  <p className="text-[11.5px] text-slate-400 italic">Dữ liệu chi tiết theo từng phiên bản cũ chưa được lưu trữ riêng trong bản demo — trên đây là dữ liệu hiện tại của bản ghi để tham khảo.</p>
                )}
              </div>
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button onClick={() => setVersionDetailModal(null)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-[13px] transition-colors cursor-pointer active:scale-95">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal So sánh phiên bản */}
      {compareModal && (() => {
        const { rowId, fromIdx, toIdx } = compareModal;
        const row = recordsData.find(r => r.id === rowId);
        const versions = VERSIONS_BY_ROW_ID[rowId] || [];
        if (!row || versions.length === 0) return null;
        const vFrom = versions[fromIdx];
        const vTo = versions[toIdx];
        const canShowFieldDiff = toIdx === 0 && fromIdx === 1 && !!row.previousValues && Object.keys(row.previousValues).length > 0;
        const changedKeys = canShowFieldDiff ? Object.keys(row.previousValues!) : [];
        return (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <GitCompare className="w-5 h-5 text-blue-600" />
                    So sánh phiên bản
                  </h3>
                  <p className="text-[12.5px] text-slate-500 mt-1">{row[primaryCol.key]}</p>
                </div>
                <button onClick={() => setCompareModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex-shrink-0" title="Đóng">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-[13px] overflow-y-auto">
                <div className="flex items-center gap-3">
                  <select
                    title="Phiên bản trước"
                    value={fromIdx}
                    onChange={e => setCompareModal(m => m && { ...m, fromIdx: Number(e.target.value) })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-[13px] bg-white cursor-pointer"
                  >
                    {versions.map((v, i) => <option key={i} value={i}>{v.ver} — {v.date}</option>)}
                  </select>
                  <span className="text-slate-400">→</span>
                  <select
                    title="Phiên bản sau"
                    value={toIdx}
                    onChange={e => setCompareModal(m => m && { ...m, toIdx: Number(e.target.value) })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-[13px] bg-white cursor-pointer"
                  >
                    {versions.map((v, i) => <option key={i} value={i}>{v.ver} — {v.date}</option>)}
                  </select>
                </div>

                {canShowFieldDiff ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-50 px-3 py-2 font-semibold text-[12px] text-slate-600 border-b border-slate-200">{vFrom.ver}</div>
                      <div className="divide-y divide-slate-100">
                        {cols.map(col => (
                          <div key={col.key} className={`flex px-3 py-2 ${changedKeys.includes(col.key) ? 'bg-red-50' : ''}`}>
                            <span className="w-32 shrink-0 text-slate-500">{col.label}</span>
                            <span className={`flex-1 break-words ${changedKeys.includes(col.key) ? 'text-red-600 font-medium' : 'text-slate-800'}`}>
                              {(changedKeys.includes(col.key) ? row.previousValues![col.key] : row[col.key]) || <span className="text-slate-400 italic">(trống)</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-blue-50 px-3 py-2 font-semibold text-[12px] text-blue-700 border-b border-blue-200">{vTo.ver}</div>
                      <div className="divide-y divide-slate-100">
                        {cols.map(col => (
                          <div key={col.key} className={`flex px-3 py-2 ${changedKeys.includes(col.key) ? 'bg-green-50' : ''}`}>
                            <span className="w-32 shrink-0 text-slate-500">{col.label}</span>
                            <span className={`flex-1 break-words ${changedKeys.includes(col.key) ? 'text-green-700 font-medium' : 'text-slate-800'}`}>
                              {row[col.key] || <span className="text-slate-400 italic">(trống)</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {[vFrom, vTo].map((v, i) => (
                        <div key={i} className="border border-slate-200 rounded-lg p-3 space-y-1.5">
                          <div className="font-mono font-semibold text-slate-800">{v.ver}</div>
                          <div className="text-slate-500">Ngày: <span className="text-slate-800">{v.date}</span></div>
                          <div className="text-slate-500">Người tạo: <span className="text-slate-800">{v.by}</span></div>
                          <div className="text-slate-500">Thay đổi: <span className="text-slate-800">{v.change}</span></div>
                          <VersionStatusBadge status={v.status} />
                        </div>
                      ))}
                    </div>
                    <p className="text-[11.5px] text-slate-400 italic">Dữ liệu chi tiết từng trường cho cặp phiên bản này chưa được lưu trữ riêng trong bản demo — chỉ hiển thị thông tin phiên bản.</p>
                  </>
                )}
              </div>
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button onClick={() => setCompareModal(null)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-[13px] transition-colors cursor-pointer active:scale-95">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Đồng bộ dữ liệu (UC1) */}
      {showSyncModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                Đồng bộ dữ liệu chủ
              </h3>
              <button onClick={() => setShowSyncModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-[13px] overflow-y-auto">
              <p className="text-slate-500">
                <span className="font-medium text-slate-700">{masterLabel}</span> — áp dụng quy tắc đã thiết lập tại <b>Mô hình dữ liệu chủ</b>
              </p>
              <div>
                <div className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Nguồn dữ liệu</div>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr><th className="px-4 py-2 font-medium text-slate-600">Hệ thống nguồn</th><th className="px-4 py-2 font-medium text-slate-600">Đồng bộ gần nhất</th></tr>
                    </thead>
                    <tbody>
                      <tr><td className="px-4 py-2 font-medium text-slate-800">{config.system}</td><td className="px-4 py-2 text-slate-500">08:00, {new Date().toLocaleDateString('vi-VN')}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <div className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Quy tắc áp dụng (theo Mô hình dữ liệu chủ)</div>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between gap-4 border border-slate-200 rounded-lg px-3 py-2">
                    <span className="text-slate-500">Quy tắc định danh duy nhất{idCols.length > 1 ? ' (khóa ghép)' : ''}</span>
                    <span className="font-medium text-slate-800 text-right">{idLabel}</span>
                  </div>
                  <div className="flex justify-between gap-4 border border-slate-200 rounded-lg px-3 py-2">
                    <span className="text-slate-500">Quy tắc gộp bản ghi trùng</span>
                    <span className="font-medium text-slate-800 text-right">Ưu tiên giữ dữ liệu mới nhất theo thời gian đồng bộ</span>
                  </div>
                  <div className="flex justify-between gap-4 border border-slate-200 rounded-lg px-3 py-2">
                    <span className="text-slate-500">Ánh xạ thuộc tính</span>
                    <span className="font-medium text-slate-800 text-right">{cols.length}/{cols.length} trường đã ánh xạ đầy đủ</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Dự kiến sau khi đối chiếu {idCols.length > 1 ? 'khóa định danh ghép' : 'khóa định danh duy nhất'} <b>{idLabel}</b>: sẽ có bản ghi <b>Mới</b> và bản ghi <b>Cập nhật</b> vào danh sách với trạng thái duyệt "Chưa phê duyệt" để rà soát
                  {duplicateGroups.length > 0 ? <> ; <b>{duplicateGroups.length} nhóm bản ghi nghi trùng lặp</b> sẽ được đánh dấu cần kiểm tra thủ công.</> : '.'}
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

      {/* Modal Bản ghi trùng lặp nghi vấn — nhiều nhóm, mỗi nhóm có thể > 2 bản ghi */}
      {showDupModal && duplicateGroups.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Copy className="w-5 h-5 text-yellow-600" />
                Bản ghi trùng lặp nghi vấn
              </h3>
              <button onClick={() => setShowDupModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-1 min-h-0 overflow-hidden">
              <div className="w-60 border-r border-slate-200 overflow-y-auto p-2 space-y-1 flex-shrink-0">
                {duplicateGroups.map((group, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDupGroupIdx(idx)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] cursor-pointer transition-colors ${idx === selectedDupGroupIdx ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
                  >
                    <div className="truncate">{group[0][DUPLICATE_KEY_FIELD[config.category]] || group[0].id}</div>
                    <div className="text-[11px] text-slate-400">{group.length} bản ghi</div>
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-auto p-4">
                {(() => {
                  const group = duplicateGroups[selectedDupGroupIdx] || duplicateGroups[0];
                  return (
                    <table className="w-full text-left text-[13px] border-collapse">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-slate-400 font-medium w-40"></th>
                          {group.map(r => (
                            <th key={r.id} className="px-3 py-2 border-b border-slate-200 align-bottom">
                              <div className="font-mono text-[12px] text-slate-500 mb-1">{r.ma}</div>
                              <ApprovalBadge status={r.approvalStatus} />
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {cols.map(col => (
                          <tr key={col.key} className="border-b border-slate-100">
                            <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{col.label}</td>
                            {group.map((r, i) => {
                              const differs = i > 0 && r[col.key] !== group[0][col.key];
                              return (
                                <td key={r.id} className={`px-3 py-2 ${differs ? 'bg-amber-50 text-amber-800 font-medium rounded' : 'text-slate-700'}`}>
                                  {r[col.key] || <span className="text-slate-300 italic">(trống)</span>}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowDupModal(false)} className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95">
                Đóng
              </button>
            </div>
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
              {cols.map(col => {
                const isRequired = !!col.isId || col.key === primaryCol.key;
                const val = editFormData[col.key] || '';
                const missing = isRequired && !val.trim();
                return (
                  <div key={col.key}>
                    <label className="block text-slate-700 font-medium mb-1">
                      {col.label}{isRequired && <span className="text-red-500"> *</span>}
                    </label>
                    <input
                      type="text"
                      title={col.label}
                      value={val}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, [col.key]: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${missing ? 'border-red-300' : 'border-slate-300'}`}
                      placeholder={`Nhập ${col.label.toLowerCase()}...`}
                    />
                  </div>
                );
              })}
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

      {/* Modal Công khai dữ liệu — theo bản ghi cụ thể (UC497) */}
      {publishModal?.mode === 'publish' && (() => {
        const row = recordsData.find(r => r.id === publishModal.id);
        return (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Công khai dữ liệu
                </h3>
                <button
                  onClick={closePublishModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title="Đóng"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-[13px]">
                <p className="text-slate-600 font-medium leading-relaxed">
                  Vui lòng lựa chọn phạm vi chia sẻ (phân quyền công khai) cho bản ghi <strong>{row ? row[primaryCol.key] : ''}</strong>:
                </p>
                <div className="space-y-3">
                  {(['internal', 'extended', 'public'] as const).map(scope => (
                    <label key={scope} className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="shareScope"
                        checked={shareScope === scope}
                        onChange={() => setShareScope(scope)}
                        className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <div>
                        <strong className="block text-slate-800">{scope === 'internal' ? 'Nội bộ' : scope === 'extended' ? 'Mở rộng' : 'Toàn dân'}</strong>
                        <span className="text-slate-500 text-[12px] mt-0.5 block">
                          {scope === 'internal'
                            ? 'Dữ liệu chỉ được chia sẻ và sử dụng trong nội bộ đơn vị, cơ quan.'
                            : scope === 'extended'
                            ? 'Chia sẻ cho các đơn vị liên kết, cơ quan thuộc Bộ Tư pháp.'
                            : 'Dữ liệu mở, cho phép mọi người dân và doanh nghiệp khai thác tự do.'}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                <button
                  onClick={closePublishModal}
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
        );
      })()}

      {/* Modal Hủy công khai dữ liệu — theo bản ghi cụ thể (UC498) */}
      {publishModal?.mode === 'unpublish' && (() => {
        const row = recordsData.find(r => r.id === publishModal.id);
        return (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Hủy công khai dữ liệu
                </h3>
                <button
                  onClick={() => { setPublishModal(null); setUnpublishReason(''); }}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title="Đóng"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-[13px]">
                <p className="text-slate-600 font-medium leading-relaxed">
                  Bạn có chắc chắn muốn hủy công khai bản ghi <strong>{row ? row[primaryCol.key] : ''}</strong>? Vui lòng nhập lý do hủy công khai:
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
                  onClick={() => { setPublishModal(null); setUnpublishReason(''); }}
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
        );
      })()}

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

      {/* UC492 — Modal chi tiết & so sánh trước khi duyệt */}
      {detailRow && (() => {
        const row = detailRow;
        const changedKeys = (detailRowContext === 'approval' && row.previousValues) ? Object.keys(row.previousValues) : [];
        const hasCompare = changedKeys.length > 0;
        const history = HISTORY_BY_ROW_ID[row.id] || [];
        const idValue = idCols.map(c => row[c.key]).filter(Boolean).join(' / ') || row.id;
        return (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Chi tiết &amp; so sánh trước khi duyệt
                  </h3>
                  <p className="text-[12.5px] text-slate-500 mt-1">
                    {idValue} — {row[primaryCol.key]}
                    {row.sentAt && <> · gửi lúc {row.sentAt}</>}
                    {row.sentBy && <> bởi {row.sentBy}</>}
                  </p>
                </div>
                <button
                  onClick={() => setDetailRow(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex-shrink-0"
                  title="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-5 text-[13px] overflow-y-auto">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-500">Trạng thái dữ liệu:</span>
                  <DataStatusBadge status={row.dataStatus} />
                  <span className="text-slate-500 ml-2">Trạng thái duyệt:</span>
                  <ApprovalBadge status={row.approvalStatus} />
                </div>

                {hasCompare ? (
                  <div>
                    <div className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-400 mb-2">So sánh với bản gốc</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 px-3 py-2 font-semibold text-[12px] text-slate-600 border-b border-slate-200">Bản gốc (đang hiệu lực)</div>
                        <div className="divide-y divide-slate-100">
                          {cols.map(col => (
                            <div key={col.key} className={`flex px-3 py-2 ${changedKeys.includes(col.key) ? 'bg-red-50' : ''}`}>
                              <span className="w-32 shrink-0 text-slate-500">{col.label}</span>
                              <span className={`flex-1 break-words ${changedKeys.includes(col.key) ? 'text-red-600 font-medium' : 'text-slate-800'}`}>
                                {(changedKeys.includes(col.key) ? row.previousValues![col.key] : row[col.key]) || <span className="text-slate-400 italic">(trống)</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-blue-50 px-3 py-2 font-semibold text-[12px] text-blue-700 border-b border-blue-200">Đang chờ duyệt (nháp)</div>
                        <div className="divide-y divide-slate-100">
                          {cols.map(col => (
                            <div key={col.key} className={`flex px-3 py-2 ${changedKeys.includes(col.key) ? 'bg-green-50' : ''}`}>
                              <span className="w-32 shrink-0 text-slate-500">{col.label}</span>
                              <span className={`flex-1 break-words ${changedKeys.includes(col.key) ? 'text-green-700 font-medium' : 'text-slate-800'}`}>
                                {row[col.key] || <span className="text-slate-400 italic">(trống)</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                    {cols.map(col => (
                      <div key={col.key} className="flex px-3 py-2">
                        <span className="w-40 shrink-0 text-slate-500">{col.label}</span>
                        <span className="flex-1 text-slate-800 font-medium break-words">{row[col.key] || <span className="text-slate-400 italic">(trống)</span>}</span>
                      </div>
                    ))}
                  </div>
                )}

                {row.approvalStatus === 'rejected' && row.rejectReason && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
                    <span className="font-semibold">Lý do từ chối: </span>{row.rejectReason}
                  </div>
                )}

                <div>
                  <div className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Lịch sử chỉnh sửa bản ghi này</div>
                  {history.length === 0 ? (
                    <p className="text-slate-400 italic">Chưa có lịch sử chỉnh sửa.</p>
                  ) : (
                    <div className="space-y-3">
                      {history.map((h, i) => (
                        <div key={i} className="flex gap-3">
                          <div className={`w-5 h-5 mt-0.5 rounded-full flex items-center justify-center flex-shrink-0 ${HISTORY_KIND_STYLE[h.kind].bg}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${HISTORY_KIND_STYLE[h.kind].dot}`} />
                          </div>
                          <div className={`flex-1 ${i < history.length - 1 ? 'pb-3 border-b border-slate-100' : ''}`}>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-slate-800">{h.action}</span>
                              <span className="text-[12px] text-slate-400">{h.time}</span>
                              {h.verChange && <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[11px] rounded-full">{h.verChange}</span>}
                            </div>
                            <p className="text-slate-600 mt-0.5">{h.note}</p>
                            <p className="text-[12px] text-slate-400 mt-0.5">{h.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                <button
                  onClick={() => setDetailRow(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
                >
                  Đóng
                </button>
                {row.approvalStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => { setDetailRow(null); openRejectModal([row.id]); }}
                      className="px-4 py-2 border border-red-200 text-red-600 bg-white rounded-lg hover:bg-red-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
                    >
                      Từ chối
                    </button>
                    <button
                      onClick={() => { handleApproveOne(row.id); setDetailRow(null); }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
                    >
                      Phê duyệt bản ghi
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
