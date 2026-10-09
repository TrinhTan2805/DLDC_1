import { useState, type ReactNode } from 'react';
import { Search, Send, Eye, Clock, CheckCircle2, XCircle, Globe, List, Lock, Check, Copy, AlertTriangle, X, RotateCcw, SquarePen, Link2, Download, ArrowLeft, Trash2, RefreshCw, ChevronDown, GitCompare, MoreVertical, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import { toast } from 'sonner';
import {
  Badge, TruncatedText, RowIconAction, Pagination, tabClass,
  BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON, ROW_ICON_BTN, MENU_ITEM, TOOLTIP_CLS,
  INPUT_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, normalizeSearch,
} from '../collection/collectionUi';

// --- Lớp giao diện dùng chung trong file (compomennt.md 5.3, 5.4, 5.6.1) ---
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const TR = 'group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const TABLE_WRAP = 'bg-white rounded-lg border border-[#E2E8F0] overflow-hidden';
const TABLE_CLS = 'w-full border-collapse collection-table text-[13px]';
const THEAD_CLS = 'bg-[#F8FAFC]';
const STICKY_TH = 'sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]';
const CHECKBOX_CLS = 'w-4 h-4 accent-blue-600 rounded cursor-pointer align-middle';
const EMPTY_TD = 'py-16 text-center text-[13px] text-[#64748B]';
const EMPTY_VALUE = 'text-[#94A3B8] italic';
// Modal (mục 5.4) — giữ thang z-index cũ của file: 9999 (modal thường), 10000 (modal chồng lên modal chi tiết)
const MODAL_OVERLAY = 'fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200';
const MODAL_OVERLAY_TOP = 'fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200';
const MODAL_BOX = 'bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden';
const MODAL_HEADER = 'px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0';
const MODAL_TITLE = 'text-[16px] font-semibold text-[#020817]';
const MODAL_SUBTITLE = 'text-[13px] text-[#64748B] mt-0.5';
const MODAL_BODY = 'px-6 py-4 overflow-y-auto custom-scrollbar flex-1 text-[13px] text-[#020817]';
const MODAL_FOOTER = 'px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 shrink-0';
const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';
const BANNER_INFO = 'p-3 rounded-lg border bg-[#EAF3FF] border-[#BFDBFE] text-[13px] text-[#020817] flex items-start gap-2';
const BANNER_WARN = 'p-3 rounded-lg border bg-[#FFF7ED] border-[#FED7AA] text-[13px] text-[#020817] flex items-start gap-2';
const BANNER_DANGER = 'p-3 rounded-lg border bg-[#FEF2F2] border-[#FEE2E2] text-[13px] text-[#020817] flex items-start gap-2';
const CHIP_ACTIVE = `${BTN_OUTLINE} !bg-[#EAF3FF] !border-[#BFDBFE] !text-[#155DFC]`;
const STAT_CARD = 'bg-white rounded-2xl border border-[#E2E8F0] p-4';
// Danh sách nhãn – giá trị chỉ đọc (mục 5.17)
const KV_LIST = 'border border-[#E2E8F0] rounded-lg divide-y divide-[#E2E8F0]';
const KV_ROW = 'flex gap-4 px-3 py-2';
const KV_LABEL = `w-40 shrink-0 ${FIELD_LABEL}`;
const KV_VALUE = `flex-1 ${FIELD_VALUE} break-words`;

// Mục menu ⋯: bị khóa thì hiển thị lý do ngay trong mục (compomennt.md 5.3.2)
const MenuAction = ({ icon, label, reason, danger, onSelect }: { icon: ReactNode; label: string; reason: string | null; danger?: boolean; onSelect: () => void }) => (
  <DropdownMenuItem
    disabled={!!reason}
    onClick={reason ? undefined : onSelect}
    className={`${MENU_ITEM} items-start ${reason ? '' : danger ? 'text-[#DC2626] focus:text-[#DC2626]' : 'text-[#020817]'}`}
  >
    <span className={`mt-0.5 ${reason ? 'text-[#CBD5E1]' : danger ? 'text-[#DC2626]' : 'text-[#475569]'}`}>{icon}</span>
    <span className="flex flex-col">
      <span>{label}</span>
      {reason && <span className="text-[12px] text-[#64748B]">{reason}</span>}
    </span>
  </DropdownMenuItem>
);

// Nút ⋯ trong cột thao tác — tooltip "Thao tác khác" chỉ hiện khi hover
const RowMoreMenu = ({ children }: { children: ReactNode }) => (
  <DropdownMenu>
    <Tooltip>
      <TooltipTrigger asChild onFocus={(e: { preventDefault: () => void }) => e.preventDefault()}>
        <span className="inline-flex">
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label="Thao tác khác" className={ROW_ICON_BTN}>
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Thao tác khác</TooltipContent>
    </Tooltip>
    <DropdownMenuContent align="end" className="w-56 rounded-lg border border-[#E2E8F0] bg-white shadow-lg p-1">
      {children}
    </DropdownMenuContent>
  </DropdownMenu>
);

// Ngày + giờ hiển thị 2 dòng (mục 5.3.3), giờ màu #64748B
const DateTimeCell = ({ value }: { value: string }) => {
  const [date, ...rest] = (value || '').split(' ');
  const time = rest.join(' ');
  return (
    <div className="leading-[18px] whitespace-nowrap">
      <div>{date || '—'}</div>
      {time && <div className="text-[#64748B]">{time}</div>}
    </div>
  );
};

export type ApprovalStatus = 'draft' | 'reviewing' | 'pending' | 'approved' | 'rejected' | 'deleted';
type PublicStatus = 'published' | 'unpublished';
// 3 loại thực thể dữ liệu chủ theo quy định của Bộ Tư pháp (bảng "Dữ liệu chủ" chính thức)
export type DataCategory = 'civil-status' | 'enforcement-decision' | 'legal-document';

export interface ColDef { key: string; label: string }

interface ItemConfig {
  category: DataCategory;
  unit: string;
  system: string;
  idLabel: string;
}

// ─── Config per master data ID ────────────────────────────────────────────────

const ITEM_CONFIGS: Record<string, ItemConfig> = {
  'md-001': { category: 'civil-status',         unit: 'Cục Hành chính tư pháp',                                        system: 'CSDL hộ tịch điện tử',                idLabel: 'Mã số hộ tịch' },
  'md-002': { category: 'enforcement-decision', unit: 'Cục Quản lý thi hành án dân sự',                                system: 'Nền tảng số THADS',                    idLabel: 'Mã quyết định THA' },
  'md-003': { category: 'legal-document',       unit: 'Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính',       system: 'CSDL văn bản quy phạm pháp luật',      idLabel: 'Số định danh văn bản' },
};

// ─── Column definitions per category — đúng theo bảng "Dữ liệu chủ" quy định của Bộ Tư pháp ──────

export const COLUMNS: Record<DataCategory, ColDef[]> = {
  'civil-status': [
    { key: 'ma',                 label: 'Mã số hộ tịch' },
    { key: 'hoTen',               label: 'Họ và tên' },
    { key: 'ngaySinh',            label: 'Ngày sinh' },
    { key: 'gioiTinh',            label: 'Giới tính' },
    { key: 'noiSinh',             label: 'Nơi sinh' },
    { key: 'danToc',              label: 'Dân tộc' },
    { key: 'quocTich',            label: 'Quốc tịch' },
    { key: 'queQuan',             label: 'Quê quán' },
    { key: 'soDinhDanh',          label: 'Số định danh cá nhân' },
    { key: 'ngayXacLapHonNhan',   label: 'Ngày xác lập hôn nhân lần đầu' },
    { key: 'ngayMat',             label: 'Ngày mất' },
    { key: 'noiMat',              label: 'Nơi mất' },
    { key: 'hieuLuc',             label: 'Hiệu lực' },
  ],
  'enforcement-decision': [
    { key: 'ma',                  label: 'Mã quyết định THA' },
    { key: 'ngayQuyetDinh',       label: 'Ngày quyết định' },
    { key: 'coQuanThiHanhAn',     label: 'Cơ quan thi hành án' },
    { key: 'tinhTrangThiHanhAn',  label: 'Tình trạng thi hành án' },
    { key: 'hieuLuc',             label: 'Hiệu lực' },
  ],
  'legal-document': [
    { key: 'ma',                 label: 'Số định danh văn bản' },
    { key: 'tenVanBan',           label: 'Tên văn bản' },
    { key: 'soKyHieu',            label: 'Số ký hiệu' },
    { key: 'loaiVanBan',          label: 'Loại văn bản' },
    { key: 'coQuanBanHanh',       label: 'Cơ quan ban hành' },
    { key: 'ngayBanHanh',         label: 'Ngày ban hành' },
    { key: 'ngayHieuLuc',         label: 'Ngày hiệu lực' },
    { key: 'linhVuc',             label: 'Lĩnh vực' },
    { key: 'trangThaiHieuLuc',    label: 'Trạng thái hiệu lực' },
    { key: 'hieuLuc',             label: 'Hiệu lực' },
  ],
};

// ─── Mock data per category ───────────────────────────────────────────────────

export type Row = Record<string, string> & { id: string; approvalStatus: ApprovalStatus; publicStatus: PublicStatus };

const MOCK_CIVIL_STATUS: Row[] = [
  { id: '1', ma: 'HT-2026-000145', hoTen: 'Trần Minh Khoa',       ngaySinh: '01/01/2026', gioiTinh: 'Nam', noiSinh: 'Hà Nội',      danToc: 'Kinh', quocTich: 'Việt Nam', queQuan: 'Nam Định',    soDinhDanh: '001126000123', maVanBanCanCu: 'VB-2026-000145', ngayXacLapHonNhan: '',           ngayMat: '—',           noiMat: '—',          hieuLuc: '01/01/2026', approvalStatus: 'approved',  publicStatus: 'published' },
  { id: '2', ma: 'HT-2026-000287', hoTen: 'Trần Minh Khoa',       ngaySinh: '14/02/2026', gioiTinh: 'Nam', noiSinh: '',            danToc: 'Kinh', quocTich: 'Việt Nam', queQuan: 'Nam Định',    soDinhDanh: '001126000456', maVanBanCanCu: 'VB-2026-000287', ngayXacLapHonNhan: '',           ngayMat: '—',           noiMat: '—',          hieuLuc: '14/02/2026', approvalStatus: 'approved',  publicStatus: 'published' },
  { id: '3', ma: 'HT-2025-008456', hoTen: 'Lê Gia Bảo',           ngaySinh: '08/12/2025', gioiTinh: 'Nam', noiSinh: 'Đà Nẵng',     danToc: 'Kinh', quocTich: 'Việt Nam', queQuan: 'Đà Nẵng',     soDinhDanh: '048125007890', maVanBanCanCu: 'VB-2025-008456', ngayXacLapHonNhan: '',           ngayMat: '—',           noiMat: '—',          hieuLuc: '08/12/2025', approvalStatus: 'pending',   publicStatus: 'unpublished' },
  { id: '4', ma: 'HT-2026-000298', hoTen: 'Phạm Nhật Minh',       ngaySinh: '03/03/2026', gioiTinh: 'Nam', noiSinh: 'Hải Phòng',   danToc: 'Kinh', quocTich: 'Việt Nam', queQuan: 'Hải Phòng',   soDinhDanh: '031126001234', maVanBanCanCu: 'VB-2026-000401', ngayXacLapHonNhan: '',           ngayMat: '—',           noiMat: '—',          hieuLuc: '03/03/2026', approvalStatus: 'draft',     publicStatus: 'unpublished' },
  { id: '5', ma: 'HT-1995-002234', hoTen: 'Đinh Thị Yến Nhi',     ngaySinh: '12/05/1995', gioiTinh: 'Nữ',  noiSinh: 'Cần Thơ',     danToc: 'Kinh', quocTich: 'Việt Nam', queQuan: 'Cần Thơ',     soDinhDanh: '092195003456', maVanBanCanCu: 'VB-2026-000512', ngayXacLapHonNhan: '20/09/2020', ngayMat: '—',           noiMat: '—',          hieuLuc: '20/09/2020', approvalStatus: 'pending',   publicStatus: 'unpublished' },
  { id: '6', ma: 'HT-1950-000512', hoTen: 'Trần Bình An',         ngaySinh: '10/05/1950', gioiTinh: 'Nam', noiSinh: 'Bình Dương',  danToc: 'Kinh', quocTich: 'Việt Nam', queQuan: 'Bình Dương',  soDinhDanh: '079150005678', maVanBanCanCu: 'VB-2026-000623', ngayXacLapHonNhan: '15/03/1975', ngayMat: '12/01/2024',  noiMat: 'Bình Dương', hieuLuc: '12/01/2024', approvalStatus: 'rejected',  publicStatus: 'unpublished' },
  { id: '7', ma: 'HT-2026-000099', hoTen: 'Bùi Văn Sơn',          ngaySinh: '01/01/2026', gioiTinh: 'Nam', noiSinh: 'Hà Nội',      danToc: 'Kinh', quocTich: 'Việt Nam', queQuan: 'Hà Nội',      soDinhDanh: '001126009012', maVanBanCanCu: 'VB-2026-000734', ngayXacLapHonNhan: '',           ngayMat: '—',           noiMat: '—',          hieuLuc: '01/01/2026', approvalStatus: 'reviewing', publicStatus: 'unpublished' },
];

const MOCK_ENFORCEMENT_DECISION: Row[] = [
  { id: '1', ma: 'QĐ-THADS-2026-00156', ngayQuyetDinh: '15/01/2026', coQuanThiHanhAn: 'Cục THADS TP. Hà Nội',           tinhTrangThiHanhAn: 'Đang thi hành',       soDinhDanh: '001126000123', maVanBanCanCu: 'VB-2026-000145', hieuLuc: '15/01/2026', approvalStatus: 'approved',  publicStatus: 'published' },
  { id: '2', ma: 'QĐ-THADS-2026-00287', ngayQuyetDinh: '22/02/2026', coQuanThiHanhAn: 'Chi cục THADS Q. Cầu Giấy, HN',  tinhTrangThiHanhAn: 'Đã thi hành xong',    soDinhDanh: '001126000456', maVanBanCanCu: 'VB-2026-000287', hieuLuc: '22/02/2026', approvalStatus: 'pending',   publicStatus: 'unpublished' },
  { id: '3', ma: 'QĐ-THADS-2025-08456', ngayQuyetDinh: '10/11/2025', coQuanThiHanhAn: 'Cục THADS TP. Đà Nẵng',          tinhTrangThiHanhAn: '',                    soDinhDanh: '048125007890', maVanBanCanCu: 'VB-2025-008456', hieuLuc: '10/11/2025', approvalStatus: 'draft',     publicStatus: 'unpublished' },
  { id: '4', ma: 'QĐ-THADS-2026-00401', ngayQuyetDinh: '05/03/2026', coQuanThiHanhAn: 'Chi cục THADS TP. Cần Thơ',      tinhTrangThiHanhAn: 'Tạm đình chỉ',        soDinhDanh: '031126001234', maVanBanCanCu: 'VB-2026-000401', hieuLuc: '05/03/2026', approvalStatus: 'rejected',  publicStatus: 'unpublished' },
  { id: '5', ma: 'QĐ-THADS-2026-00512', ngayQuyetDinh: '15/04/2026', coQuanThiHanhAn: 'Chi cục THADS Q. Hải An, HN',    tinhTrangThiHanhAn: 'Đang thi hành',       soDinhDanh: '092195003456', maVanBanCanCu: 'VB-2026-000512', hieuLuc: '15/04/2026', approvalStatus: 'pending',   publicStatus: 'unpublished' },
  { id: '6', ma: 'QĐ-THADS-2026-00623', ngayQuyetDinh: '28/05/2026', coQuanThiHanhAn: 'Chi cục THADS Q. Sơn Trà, ĐN',   tinhTrangThiHanhAn: 'Đã thi hành xong',    soDinhDanh: '079150005678', maVanBanCanCu: 'VB-2026-000623', hieuLuc: '28/05/2026', approvalStatus: 'approved',  publicStatus: 'published' },
  { id: '7', ma: 'QĐ-THADS-2026-00734', ngayQuyetDinh: '02/06/2026', coQuanThiHanhAn: 'Chi cục THADS Q. Cầu Giấy, HN',  tinhTrangThiHanhAn: 'Đang thi hành',       soDinhDanh: '001126009012', maVanBanCanCu: 'VB-2026-000734', hieuLuc: '02/06/2026', approvalStatus: 'reviewing', publicStatus: 'unpublished' },
];

const MOCK_LEGAL_DOCUMENT: Row[] = [
  { id: '1', ma: 'VB-2026-000145', tenVanBan: 'Nghị định quy định chi tiết một số điều của Luật Hộ tịch',                           soKyHieu: '12/2026/NĐ-CP',            loaiVanBan: 'Nghị định',  coQuanBanHanh: 'Chính phủ',   ngayBanHanh: '15/01/2026', ngayHieuLuc: '01/03/2026', linhVuc: 'Hộ tịch',                       trangThaiHieuLuc: 'Còn hiệu lực',  hieuLuc: '01/03/2026', approvalStatus: 'approved',  publicStatus: 'published' },
  { id: '2', ma: 'VB-2026-000287', tenVanBan: 'Nghị định quy định chi tiết một số điều của Luật Hộ tịch',                           soKyHieu: '12/2026/NĐ-CP-sửa đổi',    loaiVanBan: 'Nghị định',  coQuanBanHanh: 'Chính phủ',   ngayBanHanh: '20/02/2026', ngayHieuLuc: '',           linhVuc: 'Hộ tịch',                       trangThaiHieuLuc: 'Chưa hiệu lực', hieuLuc: '',           approvalStatus: 'pending',   publicStatus: 'unpublished' },
  { id: '3', ma: 'VB-2025-008456', tenVanBan: 'Thông tư hướng dẫn thi hành án dân sự',                                              soKyHieu: '05/2025/TT-BTP',            loaiVanBan: 'Thông tư',   coQuanBanHanh: 'Bộ Tư pháp',  ngayBanHanh: '10/11/2025', ngayHieuLuc: '25/12/2025', linhVuc: 'Thi hành án dân sự',            trangThaiHieuLuc: 'Còn hiệu lực',  hieuLuc: '25/12/2025', approvalStatus: 'draft',     publicStatus: 'unpublished' },
  { id: '4', ma: 'VB-2026-000401', tenVanBan: 'Luật sửa đổi, bổ sung một số điều của Luật Xử lý vi phạm hành chính',                soKyHieu: '08/2026/QH15',              loaiVanBan: 'Luật',       coQuanBanHanh: 'Quốc hội',    ngayBanHanh: '05/03/2026', ngayHieuLuc: '01/07/2026', linhVuc: 'Xử lý vi phạm hành chính',      trangThaiHieuLuc: 'Chưa hiệu lực', hieuLuc: '01/07/2026', approvalStatus: 'rejected',  publicStatus: 'unpublished' },
  { id: '5', ma: 'VB-2026-000512', tenVanBan: 'Nghị định quy định về đăng ký giao dịch bảo đảm',                                    soKyHieu: '15/2026/NĐ-CP',             loaiVanBan: 'Nghị định',  coQuanBanHanh: 'Chính phủ',   ngayBanHanh: '15/04/2026', ngayHieuLuc: '01/06/2026', linhVuc: 'Giao dịch bảo đảm',             trangThaiHieuLuc: 'Còn hiệu lực',  hieuLuc: '01/06/2026', approvalStatus: 'pending',   publicStatus: 'unpublished' },
  { id: '6', ma: 'VB-2026-000623', tenVanBan: 'Thông tư quy định về công chứng, chứng thực',                                        soKyHieu: '09/2026/TT-BTP',            loaiVanBan: 'Thông tư',   coQuanBanHanh: 'Bộ Tư pháp',  ngayBanHanh: '28/05/2026', ngayHieuLuc: '15/07/2026', linhVuc: 'Công chứng, chứng thực',        trangThaiHieuLuc: 'Còn hiệu lực',  hieuLuc: '15/07/2026', approvalStatus: 'approved',  publicStatus: 'published' },
  { id: '7', ma: 'VB-2026-000734', tenVanBan: 'Quyết định công bố thủ tục hành chính lĩnh vực trợ giúp pháp lý',                     soKyHieu: '02/2026/QĐ-BTP',            loaiVanBan: 'Quyết định', coQuanBanHanh: 'Bộ Tư pháp',  ngayBanHanh: '02/06/2026', ngayHieuLuc: '02/06/2026', linhVuc: 'Trợ giúp pháp lý',              trangThaiHieuLuc: 'Còn hiệu lực',  hieuLuc: '02/06/2026', approvalStatus: 'reviewing', publicStatus: 'unpublished' },
];

export const MOCK_BY_CATEGORY: Record<DataCategory, Row[]> = {
  'civil-status':         MOCK_CIVIL_STATUS,
  'enforcement-decision': MOCK_ENFORCEMENT_DECISION,
  'legal-document':       MOCK_LEGAL_DOCUMENT,
};

function getMockData(_masterId: string, category: DataCategory): Row[] {
  return MOCK_BY_CATEGORY[category];
}

// ─── Liên kết chéo thực thể giữa các danh mục dữ liệu chủ ─────────────────────
export const CATEGORY_LABELS: Record<DataCategory, string> = {
  'civil-status':         'Thông tin hộ tịch của cá nhân',
  'enforcement-decision': 'Quyết định thi hành án',
  'legal-document':       'Văn bản quy phạm pháp luật',
};

function normalizeIdentifier(value: string): string {
  return (value || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
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
  {
    id: 'rel-1',
    categoryA: 'civil-status',
    fieldA: 'soDinhDanh',
    categoryB: 'enforcement-decision',
    fieldB: 'soDinhDanh',
    relationType: 'one-to-many',
    description: 'Quan hệ giữa Thông tin hộ tịch cá nhân và Quyết định thi hành án theo Số định danh cá nhân (CCCD)',
    status: 'active',
  },
  {
    id: 'rel-2',
    categoryA: 'civil-status',
    fieldA: 'maVanBanCanCu',
    categoryB: 'legal-document',
    fieldB: 'ma',
    relationType: 'many-to-one',
    description: 'Văn bản quy phạm pháp luật làm căn cứ điều chỉnh Thông tin hộ tịch',
    status: 'active',
  },
  {
    id: 'rel-3',
    categoryA: 'enforcement-decision',
    fieldA: 'maVanBanCanCu',
    categoryB: 'legal-document',
    fieldB: 'ma',
    relationType: 'many-to-one',
    description: 'Văn bản quy phạm pháp luật làm căn cứ ban hành Quyết định thi hành án',
    status: 'active',
  },
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
  'civil-status': 'hoTen',
  'enforcement-decision': 'ma',
  'legal-document': 'tenVanBan',
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

// Badge trạng thái (mục 5.8) — giữ nguyên props, hiển thị bằng <Badge> dùng chung
export function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  if (status === 'approved') return <Badge label="Đã phê duyệt" variant="green" />;
  if (status === 'pending') return <Badge label="Chờ phê duyệt" variant="orange" />;
  if (status === 'reviewing') return <Badge label="Rà soát" variant="indigo" />;
  if (status === 'rejected') return <Badge label="Từ chối" variant="red" />;
  if (status === 'deleted') return <Badge label="Đã xóa" variant="slate" />;
  return <Badge label="Chưa phê duyệt" variant="slate" />;
}

function PublicBadge({ status }: { status: PublicStatus }) {
  if (status === 'published') return <Badge label="Đã công khai" variant="blue" />;
  return <Badge label="Chưa công khai" variant="slate" />;
}

function DataStatusBadge({ status }: { status: 'new' | 'updated' }) {
  if (status === 'new') return <Badge label="Mới" variant="indigo" />;
  return <Badge label="Cập nhật" variant="emerald" />;
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
  // Tìm kiếm & bộ lọc (mục 5.19): nhập vào bản nháp, chỉ áp dụng khi bấm Tìm kiếm / Enter
  const [searchInput, setSearchInput] = useState('');
  const [approvalFilterDraft, setApprovalFilterDraft] = useState<typeof approvalFilter>('all');
  const [publicFilterDraft, setPublicFilterDraft] = useState<typeof publicFilterState>('all');
  const [dataStatusFilterDraft, setDataStatusFilterDraft] = useState<typeof dataStatusFilter>('all');
  const runSearch = () => {
    setSearchQuery(searchInput);
    setApprovalFilter(approvalFilterDraft);
    setPublicFilterState(publicFilterDraft);
    setDataStatusFilter(dataStatusFilterDraft);
    setCurrentPageNum(1);
  };
  // Đồng bộ dữ liệu (UC1 — nguồn phát sinh bản ghi Mới/Cập nhật, theo quy tắc ở Mô hình dữ liệu chủ)
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const config = ITEM_CONFIGS[masterId] || { category: 'civil-status' as DataCategory, unit: '—', system: '—', idLabel: 'Mã' };
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
    const q = normalizeSearch(searchQuery);
    if (!q) return true;
    return Object.values(r).some(v => normalizeSearch(String(v)).includes(q));
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
    const q = normalizeSearch(searchQuery);
    const matchesSearch = !q || Object.values(r).some(v => normalizeSearch(String(v)).includes(q));
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
      toast.error('Vui lòng nhập lý do từ chối!');
      return;
    }
    const ids = rejectModal.ids;
    const reason = rejectModal.reason.trim();
    setRecordsData(prev => prev.map(r => ids.includes(r.id) ? { ...r, approvalStatus: 'rejected', rejectReason: reason, unapproveReason: '' } : r));
    setSelectedApprovalIds(prev => prev.filter(id => !ids.includes(id)));
    setRejectModal({ open: false, ids: [], reason: '' });
    toast.success('Đã từ chối phê duyệt kèm lý do. Trạng thái cập nhật và thông báo đã gửi tới cán bộ nghiệp vụ.');
  };

  // UC493 — Hủy phê duyệt: mở modal nhập lý do, đưa bản ghi đã duyệt về "Chờ phê duyệt", ghi log & thông báo
  const openUnapproveModal = (id: string) => setUnapproveModal({ open: true, id, reason: '' });

  const handleConfirmUnapprove = () => {
    if (!unapproveModal.reason.trim()) {
      toast.error('Vui lòng nhập lý do hủy phê duyệt!');
      return;
    }
    const id = unapproveModal.id;
    const reason = unapproveModal.reason.trim();
    setRecordsData(prev => prev.map(r => r.id === id ? { ...r, approvalStatus: 'pending', unapproveReason: reason } : r));
    setUnapproveModal({ open: false, id: '', reason: '' });
    toast.success('Đã hủy phê duyệt kèm lý do. Bản ghi chuyển về "Chờ phê duyệt", ghi nhận log thao tác và gửi thông báo tới cán bộ nghiệp vụ.');
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
    toast.success(
      `Đang đồng bộ… hoàn tất: ${newCount} bản ghi Mới, ${updatedCount} bản ghi Cập nhật đã vào danh sách với trạng thái "Chưa phê duyệt" để rà soát.` +
      (duplicateIds.size > 0 ? ` ${duplicateIds.size} bản ghi nghi trùng lặp cần kiểm tra thủ công.` : '')
    );
  };

  const handleBulkApprove = () => {
    if (selectedApprovalIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một bản ghi để phê duyệt');
      return;
    }
    setApprovalStatusForIds(selectedApprovalIds, 'approved');
  };

  const handleBulkReject = () => {
    if (selectedApprovalIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một bản ghi để từ chối');
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
    toast.success('Đã lưu thay đổi tạm thời. Bản ghi được đánh dấu "Đang rà soát" và chuyển về "Chưa công khai".');
  };

  // Chỉ bản ghi Soạn thảo/Rà soát/Từ chối mới cần (và có thể) gửi duyệt lại
  const isSendableStatus = (status: ApprovalStatus) => status === 'draft' || status === 'reviewing' || status === 'rejected';

  // Trạng thái dữ liệu: Mới (chưa từng chỉnh sửa từ khi đồng bộ) / Cập nhật (đã có chỉnh sửa)
  const getDataStatus = (row: Row): 'new' | 'updated' => Number(row.id) % 3 === 0 ? 'new' : 'updated';

  // Mở modal "Gửi phê duyệt" — dùng chung cho gửi từng dòng và gửi hàng loạt
  const handleOpenSendApproval = (ids: string[]) => {
    const rows = recordsData.filter(r => ids.includes(r.id));
    if (rows.some(r => isRowIncomplete(r, cols))) {
      toast.error('Một số bản ghi còn thiếu dữ liệu bắt buộc. Vui lòng bổ sung đầy đủ thông tin trước khi gửi phê duyệt.');
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
    toast.success(`Đã gửi ${sendApprovalIds.length} bản ghi đi phê duyệt. Trạng thái cập nhật thành "Chờ phê duyệt" và thông báo đã được gửi tới người duyệt.`);
    handleCloseSendApproval();
    setSelectedRecordIds([]);
  };

  // ─── Công khai handlers ───────────────────────────────────────────────────
  // Công khai / Hủy công khai theo từng bản ghi tại lưới dữ liệu
  const handlePublishRecord = (id: string) => {
    setRecordsData(prev => prev.map(r => r.id === id ? { ...r, publicStatus: 'published' } : r));
    toast.success('Công khai dữ liệu chủ thành công.');
  };

  const handleUnpublishRecord = (id: string) => {
    setRecordsData(prev => prev.map(r => r.id === id ? { ...r, publicStatus: 'unpublished' } : r));
    toast.success('Hủy công khai dữ liệu thành công.');
  };

  // Công khai / Hủy công khai hàng loạt theo các bản ghi đang được chọn
  const handleBulkPublish = (ids: string[]) => {
    setRecordsData(prev => prev.map(r => ids.includes(r.id) && r.approvalStatus === 'approved' ? { ...r, publicStatus: 'published' } : r));
    toast.success('Công khai dữ liệu chủ thành công.');
    setSelectedRecordIds([]);
  };

  const handleBulkUnpublish = (ids: string[]) => {
    setRecordsData(prev => prev.map(r => ids.includes(r.id) ? { ...r, publicStatus: 'unpublished' } : r));
    toast.success('Hủy công khai dữ liệu thành công.');
    setSelectedRecordIds([]);
  };

  const paginatedData = listData.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  // Thẻ thống kê tab Phê duyệt (mục 5.6.1 — loại nhỏ)
  const approvalStatCards = [
    { label: 'Tổng yêu cầu',  value: stats.total,    icon: List,         bg: 'bg-blue-50',   fg: 'text-blue-600' },
    { label: 'Chờ phê duyệt', value: stats.pending,  icon: Clock,        bg: 'bg-orange-50', fg: 'text-orange-600' },
    { label: 'Đã phê duyệt',  value: stats.approved, icon: CheckCircle2, bg: 'bg-green-50',  fg: 'text-green-600' },
    { label: 'Đã từ chối',    value: stats.rejected, icon: XCircle,      bg: 'bg-red-50',    fg: 'text-red-600' },
  ];

  // Màu dòng: dòng đang chọn tô nền #EAF3FF, cột thao tác ghim phải đồng màu với dòng
  const rowCls = (selected: boolean) =>
    `group h-12 border-b border-[#E0E0E0] transition-colors ${selected ? 'bg-[#EAF3FF]' : 'bg-white hover:bg-[#F8FAFC]'}`;
  const stickyTdCls = (selected: boolean) =>
    `sticky right-0 shadow-[-1px_0_0_#E2E8F0] ${selected ? 'bg-[#EAF3FF]' : 'bg-white group-hover:bg-[#F8FAFC]'}`;

  // Lý do khóa thao tác trong menu ⋯ (mục 5.3.2) — điều kiện giữ nguyên logic cũ
  const sendApprovalReason = (row: Row) => isSendableStatus(row.approvalStatus) ? null : 'Chỉ trình duyệt bản ghi Chưa phê duyệt, Rà soát hoặc Từ chối';
  const publishReason = (row: Row) => row.approvalStatus === 'approved' ? null : 'Chỉ công khai bản ghi đã phê duyệt';

  // Khối kết quả đồng bộ thu gọn/mở rộng (Lịch sử đồng bộ → chi tiết)
  const syncSectionHeader = (opts: { icon: ReactNode; title: string; count: number; variant: string; collapsed: boolean; onToggle: () => void }) => (
    <button
      type="button"
      aria-expanded={!opts.collapsed}
      onClick={opts.onToggle}
      className="w-full px-4 py-3 flex items-center gap-2 bg-[#F8FAFC] border-b border-[#E2E8F0] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
    >
      {opts.icon}
      <span className="text-[14px] font-medium text-[#020817]">{opts.title}</span>
      <Badge label={`${opts.count} bản ghi`} variant={opts.variant} />
      <ChevronDown className={`w-4 h-4 text-[#64748B] ml-auto transition-transform ${opts.collapsed ? '-rotate-90' : ''}`} />
    </button>
  );

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-[#64748B]">
        <span className="font-medium text-[#334155]">{masterLabel}</span> &bull; {config.unit} &bull; {config.system}
      </p>

      {/* Tab bar (compomennt.md 5.9) */}
      <div className="flex items-center border-b border-[#E2E8F0]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { setActiveTab(tab.id); setCurrentPageNum(1); }}
            className={tabClass(activeTab === tab.id)}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.id === 'approval' && stats.pending > 0 && (
              <span className="min-w-5 h-5 px-1.5 inline-flex items-center justify-center rounded-full border border-[#FED7AA] bg-[#FFF7ED] text-[#C2410C] text-[12px] font-medium tabular-nums">
                {stats.pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── Tab: Dữ liệu ─── */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Lọc nhanh Đang hoạt động / Đã xóa + thao tác hàng loạt cùng hàng */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                aria-pressed={listViewMode === 'active'}
                onClick={() => { setListViewMode('active'); setCurrentPageNum(1); }}
                className={listViewMode === 'active' ? CHIP_ACTIVE : BTN_OUTLINE}
              >
                Đang hoạt động <span className="tabular-nums">({activeData.length})</span>
              </button>
              <button
                type="button"
                aria-pressed={listViewMode === 'trash'}
                onClick={() => { setListViewMode('trash'); setCurrentPageNum(1); }}
                className={listViewMode === 'trash' ? CHIP_ACTIVE : BTN_OUTLINE}
              >
                <Trash2 className="w-4 h-4" />
                Đã xóa <span className="tabular-nums">({trashData.length})</span>
              </button>
            </div>
            {listViewMode === 'active' && (
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                <button
                  type="button"
                  onClick={() => selectedRecordIds.length > 0 && handleOpenSendApproval(selectedRecordIds)}
                  disabled={selectedRecordIds.length === 0}
                  className={`${BTN_OUTLINE} whitespace-nowrap`}
                >
                  <Send className="w-4 h-4" />
                  Gửi duyệt
                </button>
                <button
                  type="button"
                  onClick={() => selectedRecordIds.length > 0 && handleBulkPublish(selectedRecordIds)}
                  disabled={selectedRecordIds.length === 0}
                  className={`${BTN_OUTLINE} whitespace-nowrap`}
                >
                  <Globe className="w-4 h-4" />
                  Công khai
                </button>
                <button
                  type="button"
                  onClick={() => selectedRecordIds.length > 0 && handleBulkUnpublish(selectedRecordIds)}
                  disabled={selectedRecordIds.length === 0}
                  className={`${BTN_OUTLINE} whitespace-nowrap`}
                >
                  <Lock className="w-4 h-4" />
                  Hủy công khai
                </button>
              </div>
            )}
          </div>

          {/* Tìm kiếm & bộ lọc (compomennt.md 5.19) — chỉ áp dụng khi bấm Tìm kiếm / Enter */}
          <div>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[280px] flex items-center gap-1.5">
                <input
                  type="text"
                  aria-label="Tìm kiếm"
                  placeholder="Tìm kiếm..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') runSearch(); }}
                  className={SEARCH_INPUT_CLS}
                />
                <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
                  <Search className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Bộ lọc"
                  title="Bộ lọc"
                  aria-expanded={showFilters}
                  onClick={() => setShowFilters(!showFilters)}
                  className={filterBtnClass(showFilters)}
                >
                  {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                </button>
              </div>
              {listViewMode === 'active' && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button type="button" onClick={() => setShowSyncHistoryModal(true)} className={`${BTN_OUTLINE} whitespace-nowrap`}>
                    <Clock className="w-4 h-4" />
                    Lịch sử đồng bộ
                  </button>
                  <button type="button" onClick={() => setShowSyncModal(true)} className={`${BTN_PRIMARY} whitespace-nowrap`}>
                    <RefreshCw className="w-4 h-4" />
                    Đồng bộ dữ liệu
                  </button>
                </div>
              )}
            </div>

            {/* Bộ lọc nâng cao (thu gọn được) */}
            {showFilters && (
              <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
                <div>
                  <label htmlFor="md-update-filter-approval" className={FILTER_LABEL}>Trạng thái phê duyệt</label>
                  <select
                    id="md-update-filter-approval"
                    value={approvalFilterDraft}
                    onChange={e => setApprovalFilterDraft(e.target.value as typeof approvalFilter)}
                    className={`${INPUT_CLS} cursor-pointer`}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="draft">Chưa phê duyệt</option>
                    <option value="reviewing">Rà soát</option>
                    <option value="pending">Chờ phê duyệt</option>
                    <option value="approved">Đã phê duyệt</option>
                    <option value="rejected">Từ chối</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="md-update-filter-public" className={FILTER_LABEL}>Trạng thái công khai</label>
                  <select
                    id="md-update-filter-public"
                    value={publicFilterDraft}
                    onChange={e => setPublicFilterDraft(e.target.value as typeof publicFilterState)}
                    className={`${INPUT_CLS} cursor-pointer`}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="published">Đã công khai</option>
                    <option value="unpublished">Chưa công khai</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="md-update-filter-data" className={FILTER_LABEL}>Trạng thái dữ liệu</label>
                  <select
                    id="md-update-filter-data"
                    value={dataStatusFilterDraft}
                    onChange={e => setDataStatusFilterDraft(e.target.value as typeof dataStatusFilter)}
                    className={`${INPUT_CLS} cursor-pointer`}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="new">Mới</option>
                    <option value="updated">Cập nhật</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Bảng dữ liệu + phân trang (mục 5.3, 5.14) */}
          <div className={TABLE_WRAP}>
            <div className="overflow-x-auto">
              <table className={TABLE_CLS}>
                <thead className={THEAD_CLS}>
                  <tr className="h-[42px]">
                    <th className={`${TH} text-center w-12`}>
                      <input
                        type="checkbox"
                        title="Chọn tất cả bản ghi có thể gửi duyệt"
                        aria-label="Chọn tất cả bản ghi có thể gửi duyệt"
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
                        className={CHECKBOX_CLS}
                      />
                    </th>
                    <th className={`${TH} text-center w-14`}>STT</th>
                    {cols.slice(0, 3).map(col => (
                      <th key={col.key} className={`${TH} text-left`}>{col.label}</th>
                    ))}
                    <th className={`${TH} text-left`}>Hiệu lực</th>
                    <th className={`${TH} text-left`}>Trạng thái dữ liệu</th>
                    <th className={`${TH} text-left`}>Phê duyệt</th>
                    <th className={`${TH} text-left`}>Công khai</th>
                    <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, index) => {
                    const isSelected = selectedRecordIds.includes(row.id);
                    return (
                      <tr key={row.id} className={rowCls(isSelected)}>
                        <td className={`${TD} text-center`}>
                          {isSendableStatus(row.approvalStatus) ? (
                            <input
                              type="checkbox"
                              title="Chọn bản ghi"
                              aria-label="Chọn bản ghi"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedRecordIds(prev => [...prev, row.id]);
                                else setSelectedRecordIds(prev => prev.filter(id => id !== row.id));
                              }}
                              className={CHECKBOX_CLS}
                            />
                          ) : <span className="w-4 h-4 inline-block" />}
                        </td>
                        <td className={`${TD} text-center`}>{(currentPageNum - 1) * pageSize + index + 1}</td>
                        {cols.slice(0, 3).map(col => (
                          <td key={col.key} className={`${TD} max-w-[240px]`}>
                            {row[col.key] ? <TruncatedText text={row[col.key]} /> : <span className={EMPTY_VALUE}>(trống)</span>}
                          </td>
                        ))}
                        <td className={`${TD} whitespace-nowrap`}>
                          {row.hieuLuc || <span className={EMPTY_VALUE}>(trống)</span>}
                        </td>
                        <td className={TD}><DataStatusBadge status={getDataStatus(row)} /></td>
                        <td className={TD}><ApprovalBadge status={row.approvalStatus} /></td>
                        <td className={TD}><PublicBadge status={row.publicStatus} /></td>
                        <td className={`${TD} text-center ${stickyTdCls(isSelected)}`}>
                          <div className="flex items-center justify-center gap-1">
                            {row.approvalStatus === 'deleted' ? (
                              <RowIconAction label="Khôi phục bản ghi" onClick={() => handleRestoreDeleted(row.id)}>
                                <RotateCcw className="w-4 h-4" />
                              </RowIconAction>
                            ) : (
                              <>
                                <RowIconAction label="Xem chi tiết bản ghi" onClick={() => handleOpenDetail(row)}>
                                  <Eye className="w-4 h-4" />
                                </RowIconAction>
                                <RowIconAction label="Rà soát bản ghi dữ liệu chủ" onClick={() => handleOpenEdit(row)}>
                                  <SquarePen className="w-4 h-4" />
                                </RowIconAction>
                                <RowMoreMenu>
                                  <MenuAction icon={<Clock className="w-4 h-4" />} label="Phiên bản" reason={null}
                                    onSelect={() => openRowVersionReport(row)} />
                                  <MenuAction icon={<Send className="w-4 h-4" />} label="Trình duyệt" reason={sendApprovalReason(row)}
                                    onSelect={() => handleOpenSendApproval([row.id])} />
                                  {row.publicStatus === 'published' ? (
                                    <MenuAction icon={<Lock className="w-4 h-4" />} label="Hủy công khai" reason={null}
                                      onSelect={() => handleUnpublishRecord(row.id)} />
                                  ) : (
                                    <MenuAction icon={<Globe className="w-4 h-4" />} label="Công khai" reason={publishReason(row)}
                                      onSelect={() => handlePublishRecord(row.id)} />
                                  )}
                                  <MenuAction icon={<Trash2 className="w-4 h-4" />} label="Xóa bản ghi" reason={null} danger
                                    onSelect={() => openDeleteModal(row.id)} />
                                </RowMoreMenu>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={10} className={EMPTY_TD}>Không tìm thấy dữ liệu phù hợp</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              className="border-t border-[#E2E8F0]"
              currentPage={currentPageNum}
              totalItems={listData.length}
              pageSize={pageSize}
              pageSizeOptions={[10, 20, 50]}
              onPageChange={setCurrentPageNum}
              onPageSizeChange={(size) => { setPageSize(size); setCurrentPageNum(1); }}
            />
          </div>
        </div>
      )}

      {/* ─── Tab: Phê duyệt ─── */}
      {activeTab === 'approval' && (
        <div className="space-y-4">
          {/* Tiêu đề + thao tác hàng loạt */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-[16px] font-semibold text-[#020817]">Phê duyệt dữ liệu cập nhật</h3>
              <p className="text-[13px] text-[#64748B] mt-0.5">Quản lý các yêu cầu phê duyệt cập nhật của {masterLabel}</p>
            </div>
            {selectedApprovalIds.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-[#475569]">
                  Đã chọn: <span className="font-medium text-blue-600">{selectedApprovalIds.length}</span> bản ghi
                </span>
                <button type="button" onClick={handleBulkApprove} className={BTN_PRIMARY}>
                  <CheckCircle2 className="w-4 h-4" />
                  Phê duyệt hàng loạt
                </button>
                <button type="button" onClick={handleBulkReject} className={BTN_DESTRUCTIVE}>
                  <XCircle className="w-4 h-4" />
                  Từ chối hàng loạt
                </button>
              </div>
            )}
          </div>

          {/* Thẻ thống kê (compomennt.md 5.6.1) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {approvalStatCards.map(card => (
              <div key={card.label} className={STAT_CARD}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${card.bg}`}>
                    <card.icon className={`w-5 h-5 ${card.fg}`} />
                  </div>
                  <div>
                    <div className="text-[16px] text-[#64748B]">{card.label}</div>
                    <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{card.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tìm kiếm (mục 5.19) + lọc nhanh trạng thái (lọc ngay) */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 flex items-center gap-1.5">
              <input
                type="text"
                title="Tìm kiếm bản ghi phê duyệt"
                aria-label="Tìm kiếm bản ghi phê duyệt"
                placeholder="Tìm kiếm..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') runSearch(); }}
                className={SEARCH_INPUT_CLS}
              />
              <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { value: 'all' as const, label: 'Tất cả' },
                { value: 'pending' as const, label: 'Chờ phê duyệt' },
                { value: 'approved' as const, label: 'Đã phê duyệt' },
                { value: 'rejected' as const, label: 'Đã từ chối' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={approvalStatusFilter === opt.value}
                  onClick={() => setApprovalStatusFilter(opt.value)}
                  className={approvalStatusFilter === opt.value ? CHIP_ACTIVE : BTN_OUTLINE}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bảng phê duyệt */}
          <div className={TABLE_WRAP}>
            <div className="overflow-x-auto">
              <table className={TABLE_CLS}>
                <thead className={THEAD_CLS}>
                  <tr className="h-[42px]">
                    <th className={`${TH} text-center w-12`}>
                      <input
                        type="checkbox"
                        title="Chọn tất cả"
                        aria-label="Chọn tất cả"
                        checked={approvalPendingIds.length > 0 && selectedApprovalIds.length === approvalPendingIds.length}
                        onChange={toggleSelectAllApprovals}
                        className={CHECKBOX_CLS}
                      />
                    </th>
                    <th className={`${TH} text-center w-14`}>STT</th>
                    {approvalListCols.map(col => (
                      <th key={col.key} className={`${TH} text-left`}>{col.label}</th>
                    ))}
                    <th className={`${TH} text-left`}>Trạng thái phê duyệt</th>
                    <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {approvalFilteredData.map((row, index) => {
                    const isPending = row.approvalStatus === 'pending';
                    const isSelected = selectedApprovalIds.includes(row.id);
                    return (
                      <tr key={row.id} className={rowCls(isSelected)}>
                        <td className={`${TD} text-center`}>
                          {isPending && (
                            <input
                              type="checkbox"
                              title="Chọn bản ghi"
                              aria-label="Chọn bản ghi"
                              checked={isSelected}
                              onChange={() => toggleSelectApproval(row.id)}
                              className={CHECKBOX_CLS}
                            />
                          )}
                        </td>
                        <td className={`${TD} text-center`}>{index + 1}</td>
                        {approvalListCols.map(col => (
                          <td key={col.key} className={`${TD} max-w-[240px]`}>
                            <TruncatedText text={row[col.key] || ''} />
                          </td>
                        ))}
                        <td className={TD}><ApprovalBadge status={row.approvalStatus} /></td>
                        <td className={`${TD} text-center ${stickyTdCls(isSelected)}`}>
                          <div className="flex items-center justify-center gap-1">
                            <RowIconAction label="Xem chi tiết" onClick={() => handleOpenDetail(row, 'approval')}>
                              <Eye className="w-4 h-4" />
                            </RowIconAction>
                            <RowIconAction
                              label="Phê duyệt"
                              disabledReason={isPending ? undefined : 'Đã xử lý'}
                              onClick={() => { if (isPending) handleApproveOne(row.id); }}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </RowIconAction>
                            <RowMoreMenu>
                              <MenuAction icon={<XCircle className="w-4 h-4" />} label="Từ chối" reason={isPending ? null : 'Đã xử lý'}
                                onSelect={() => handleRejectOne(row.id)} />
                              {/* UC493 — Hủy phê duyệt (chỉ với bản ghi đã duyệt) */}
                              {row.approvalStatus === 'approved' && (
                                <MenuAction icon={<RotateCcw className="w-4 h-4" />} label="Hủy phê duyệt" reason={null}
                                  onSelect={() => openUnapproveModal(row.id)} />
                              )}
                            </RowMoreMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {approvalFilteredData.length === 0 && (
                    <tr>
                      <td colSpan={approvalListCols.length + 4} className={EMPTY_TD}>Không có bản ghi phù hợp</td>
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
        <div className={MODAL_OVERLAY}>
          <div role="dialog" aria-modal="true" aria-labelledby="md-edit-title" className={`${MODAL_BOX} max-w-lg`}>
            <div className={MODAL_HEADER}>
              <h3 id="md-edit-title" className={MODAL_TITLE}>Rà soát bản ghi dữ liệu chủ</h3>
              <button type="button" onClick={handleCloseEdit} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <div className={BANNER_INFO}>
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[#155DFC]" />
                <p>Sau khi lưu, bản ghi sẽ được đánh dấu <strong className="font-medium">"Đang rà soát"</strong> cho đến khi được gửi đi phê duyệt.</p>
              </div>
              {cols.map(col => (
                <div key={col.key}>
                  <label htmlFor={`md-edit-${col.key}`} className={LABEL_CLS}>{col.label}</label>
                  <input
                    id={`md-edit-${col.key}`}
                    type="text"
                    title={col.label}
                    value={editFormData[col.key] || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, [col.key]: e.target.value }))}
                    className={INPUT_CLS}
                    placeholder={`Nhập ${col.label.toLowerCase()}...`}
                  />
                </div>
              ))}
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" onClick={handleCloseEdit} className={BTN_OUTLINE}>Hủy bỏ</button>
              <button type="button" onClick={handleSaveEdit} className={BTN_PRIMARY}>
                <Check className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gửi phê duyệt — chọn người duyệt + nội dung trình duyệt */}
      {showSendApprovalModal && (
        <div className={MODAL_OVERLAY}>
          <div role="dialog" aria-modal="true" aria-labelledby="md-send-title" className={`${MODAL_BOX} max-w-lg`}>
            <div className={MODAL_HEADER}>
              <div className="min-w-0">
                <h3 id="md-send-title" className={MODAL_TITLE}>Gửi phê duyệt</h3>
                <p className={MODAL_SUBTITLE}>{sendApprovalIds.length} bản ghi được chọn</p>
              </div>
              <button type="button" onClick={handleCloseSendApproval} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <div>
                <label htmlFor="md-send-approver" className={LABEL_CLS}>
                  Chọn người duyệt <span className={REQUIRED_MARK}>*</span>
                </label>
                <select
                  id="md-send-approver"
                  value={sendApprovalApprover}
                  onChange={(e) => setSendApprovalApprover(e.target.value)}
                  className={`${INPUT_CLS} cursor-pointer`}
                >
                  <option value="">-- Chọn người duyệt --</option>
                  {MOCK_APPROVERS.map(u => (
                    <option key={u.id} value={u.id}>{u.name} - {u.position} ({u.department})</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="md-send-note" className={LABEL_CLS}>Nội dung trình duyệt</label>
                <textarea
                  id="md-send-note"
                  value={sendApprovalNote}
                  onChange={(e) => setSendApprovalNote(e.target.value)}
                  rows={4}
                  placeholder="Nhập nội dung gửi kèm (nếu có)..."
                  className={TEXTAREA_CLS}
                />
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" onClick={handleCloseSendApproval} className={BTN_OUTLINE}>Hủy bỏ</button>
              <button type="button" onClick={handleConfirmSendApproval} disabled={!sendApprovalApprover} className={BTN_PRIMARY}>
                <Send className="w-4 h-4" />
                Gửi duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UC492 — Modal lý do từ chối phê duyệt */}
      {rejectModal.open && (
        <div className={MODAL_OVERLAY}>
          <div role="dialog" aria-modal="true" aria-labelledby="md-reject-title" className={`${MODAL_BOX} max-w-md`}>
            <div className={MODAL_HEADER}>
              <h3 id="md-reject-title" className={MODAL_TITLE}>Từ chối phê duyệt</h3>
              <button type="button" onClick={() => setRejectModal({ open: false, ids: [], reason: '' })} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <p className="text-[#334155]">
                Từ chối phê duyệt <strong className="font-medium text-[#020817]">{rejectModal.ids.length}</strong> bản ghi. Vui lòng nhập lý do:
              </p>
              <div>
                <label htmlFor="md-reject-reason" className={LABEL_CLS}>Lý do từ chối <span className={REQUIRED_MARK}>*</span></label>
                <textarea
                  id="md-reject-reason"
                  title="Lý do từ chối"
                  value={rejectModal.reason}
                  onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                  rows={4}
                  className={TEXTAREA_CLS}
                  placeholder="Nhập lý do chi tiết..."
                />
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" onClick={() => setRejectModal({ open: false, ids: [], reason: '' })} className={BTN_OUTLINE}>Hủy bỏ</button>
              <button type="button" onClick={handleConfirmReject} className={BTN_DESTRUCTIVE}>
                <XCircle className="w-4 h-4" />
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UC493 — Modal lý do hủy phê duyệt */}
      {unapproveModal.open && (
        <div className={MODAL_OVERLAY}>
          <div role="dialog" aria-modal="true" aria-labelledby="md-unapprove-title" className={`${MODAL_BOX} max-w-md`}>
            <div className={MODAL_HEADER}>
              <h3 id="md-unapprove-title" className={MODAL_TITLE}>Hủy phê duyệt</h3>
              <button type="button" onClick={() => setUnapproveModal({ open: false, id: '', reason: '' })} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <p className="text-[#334155]">
                Bản ghi sẽ chuyển về trạng thái "Chờ phê duyệt". Vui lòng nhập lý do hủy phê duyệt:
              </p>
              <div>
                <label htmlFor="md-unapprove-reason" className={LABEL_CLS}>Lý do hủy phê duyệt <span className={REQUIRED_MARK}>*</span></label>
                <textarea
                  id="md-unapprove-reason"
                  title="Lý do hủy phê duyệt"
                  value={unapproveModal.reason}
                  onChange={(e) => setUnapproveModal(prev => ({ ...prev, reason: e.target.value }))}
                  rows={4}
                  className={TEXTAREA_CLS}
                  placeholder="Nhập lý do chi tiết..."
                />
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" onClick={() => setUnapproveModal({ open: false, id: '', reason: '' })} className={BTN_OUTLINE}>Hủy bỏ</button>
              <button type="button" onClick={handleConfirmUnapprove} className={BTN_DESTRUCTIVE}>
                <RotateCcw className="w-4 h-4" />
                Xác nhận hủy phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lịch sử đồng bộ */}
      {showSyncHistoryModal && (
        <div className={MODAL_OVERLAY}>
          <div role="dialog" aria-modal="true" aria-labelledby="md-sync-history-title" className={`${MODAL_BOX} max-w-7xl`}>
            <div className={MODAL_HEADER}>
              <h3 id="md-sync-history-title" className={MODAL_TITLE}>Lịch sử đồng bộ</h3>
              <button
                type="button"
                onClick={() => { setShowSyncHistoryModal(false); setSyncHistorySelectedId(null); }}
                className={BTN_GHOST_ICON}
                aria-label="Đóng"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={MODAL_BODY}>
              {!syncHistorySelected ? (
                <div className={TABLE_WRAP}>
                  <div className="overflow-x-auto">
                    <table className={TABLE_CLS}>
                      <thead className={THEAD_CLS}>
                        <tr className="h-[42px]">
                          <th className={`${TH} text-center w-14`}>STT</th>
                          <th className={`${TH} text-left`}>Thời gian đồng bộ</th>
                          <th className={`${TH} text-left`}>Người thực hiện</th>
                          <th className={`${TH} text-right`}>Số bản ghi đồng bộ</th>
                          <th className={`${TH} text-right`}>Thêm mới</th>
                          <th className={`${TH} text-right`}>Cập nhật</th>
                          <th className={`${TH} text-right`}>Không đổi</th>
                          <th className={`${TH} text-left`}>Thời gian thực hiện</th>
                          <th className={`${TH} text-left`}>Thời gian đồng bộ lần cuối</th>
                          <th className={`${TH} text-left`}>Trạng thái phê duyệt</th>
                          <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {syncHistoryEntries.map((entry, index) => (
                          <tr key={entry.id} className={TR}>
                            <td className={`${TD} text-center`}>{index + 1}</td>
                            <td className={TD}><DateTimeCell value={entry.syncedAt} /></td>
                            <td className={`${TD} whitespace-nowrap`}>{entry.performedBy}</td>
                            <td className={`${TD} text-right tabular-nums whitespace-nowrap`}>
                              {entry.successIds.length + entry.duplicateIds.length + entry.incompleteIds.length} bản ghi
                            </td>
                            <td className={`${TD} text-right tabular-nums`}>{entry.newCount}</td>
                            <td className={`${TD} text-right tabular-nums`}>{entry.updatedCount}</td>
                            <td className={`${TD} text-right tabular-nums`}>{entry.unchangedCount}</td>
                            <td className={`${TD} whitespace-nowrap`}>{entry.duration}</td>
                            <td className={TD}><DateTimeCell value={entry.previousSyncedAt} /></td>
                            <td className={TD}>
                              {entry.approvalStatus === 'pending' ? <Badge label="Chờ phê duyệt" variant="orange" />
                                : entry.approvalStatus === 'approved' ? <Badge label="Đã phê duyệt" variant="green" />
                                : <Badge label="Lưu trữ" variant="slate" />}
                            </td>
                            <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>
                              <div className="flex items-center justify-center">
                                <RowIconAction label="Xem chi tiết" onClick={() => setSyncHistorySelectedId(entry.id)}>
                                  <Eye className="w-4 h-4" />
                                </RowIconAction>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[#64748B]">
                    Đồng bộ lúc <span className="font-medium text-[#020817]">{syncHistorySelected.syncedAt}</span> bởi <span className="font-medium text-[#020817]">{syncHistorySelected.performedBy}</span>
                  </p>

                  {/* Khối 1: Bản ghi hợp nhất/đồng bộ tự động thành công */}
                  <div className={TABLE_WRAP}>
                    {syncSectionHeader({
                      icon: <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />,
                      title: 'Bản ghi hợp nhất/đồng bộ tự động thành công',
                      count: syncHistorySelected.successIds.length,
                      variant: 'green',
                      collapsed: syncDetailCollapsed.success,
                      onToggle: () => setSyncDetailCollapsed(prev => ({ ...prev, success: !prev.success })),
                    })}
                    {!syncDetailCollapsed.success && (
                      <div className="overflow-x-auto max-h-64 overflow-y-auto custom-scrollbar">
                        <table className={TABLE_CLS}>
                          <thead className={THEAD_CLS}>
                            <tr className="h-[42px]">
                              <th className={`${TH} text-center w-14`}>STT</th>
                              {approvalListCols.map(col => (
                                <th key={col.key} className={`${TH} text-left`}>{col.label}</th>
                              ))}
                              <th className={`${TH} text-left`}>Trạng thái duyệt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {syncHistorySelected.successIds.length === 0 ? (
                              <tr><td colSpan={approvalListCols.length + 2} className="py-6 text-center text-[13px] text-[#64748B]">Không có bản ghi</td></tr>
                            ) : (
                              syncHistorySelected.successIds.map((id, i) => {
                                const row = allData.find(r => r.id === id);
                                if (!row) return null;
                                return (
                                  <tr key={id} className={TR}>
                                    <td className={`${TD} text-center`}>{i + 1}</td>
                                    {approvalListCols.map(col => (
                                      <td key={col.key} className={`${TD} max-w-[240px]`}><TruncatedText text={row[col.key] || '—'} /></td>
                                    ))}
                                    <td className={TD}><ApprovalBadge status="pending" /></td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Khối 2: Bản ghi trùng lặp */}
                  <div className={TABLE_WRAP}>
                    {syncSectionHeader({
                      icon: <Copy className="w-4 h-4 text-[#D97706]" />,
                      title: 'Bản ghi trùng lặp',
                      count: syncHistorySelected.duplicateIds.length,
                      variant: 'amber',
                      collapsed: syncDetailCollapsed.duplicate,
                      onToggle: () => setSyncDetailCollapsed(prev => ({ ...prev, duplicate: !prev.duplicate })),
                    })}
                    {!syncDetailCollapsed.duplicate && (
                      <div className="max-h-96 overflow-y-auto custom-scrollbar divide-y divide-[#E2E8F0]">
                        {duplicateGroups.length === 0 ? (
                          <p className="py-6 text-center text-[13px] text-[#64748B]">Không có bản ghi</p>
                        ) : (
                          duplicateGroups.map((group, groupIdx0) => {
                            const groupIdx = groupIdx0 + 1;
                            const isOpen = expandedDuplicateGroups.has(groupIdx);
                            return (
                              <div key={groupIdx}>
                                <button
                                  type="button"
                                  aria-expanded={isOpen}
                                  onClick={() => toggleDuplicateGroup(groupIdx)}
                                  className="w-full px-4 py-2.5 flex items-center gap-2 bg-white hover:bg-[#F8FAFC] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                >
                                  <span className="text-[13px] font-medium text-[#020817]">Nhóm {groupIdx}</span>
                                  <Badge label={`${group.length} bản ghi`} variant="amber" />
                                  <ChevronDown className={`w-4 h-4 text-[#64748B] ml-auto transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                                </button>
                                {isOpen && (
                                  <div className="overflow-x-auto border-t border-[#E2E8F0]">
                                    <table className={TABLE_CLS}>
                                      <thead className={THEAD_CLS}>
                                        <tr className="h-[42px]">
                                          <th className={`${TH} text-center w-14`}>STT</th>
                                          {approvalListCols.map(col => (
                                            <th key={col.key} className={`${TH} text-left`}>{col.label}</th>
                                          ))}
                                          <th className={`${TH} text-left`}>Trạng thái duyệt</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {group.map((row, i) => (
                                          <tr key={row.id} className={TR}>
                                            <td className={`${TD} text-center`}>{i + 1}</td>
                                            {approvalListCols.map(col => (
                                              <td key={col.key} className={`${TD} max-w-[240px]`}><TruncatedText text={row[col.key] || '—'} /></td>
                                            ))}
                                            <td className={TD}><ApprovalBadge status="pending" /></td>
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

                  {/* Khối 3: Bản ghi bị thiếu dữ liệu */}
                  <div className={TABLE_WRAP}>
                    {syncSectionHeader({
                      icon: <AlertTriangle className="w-4 h-4 text-[#DC2626]" />,
                      title: 'Bản ghi bị thiếu dữ liệu',
                      count: syncHistorySelected.incompleteIds.length,
                      variant: 'red',
                      collapsed: syncDetailCollapsed.incomplete,
                      onToggle: () => setSyncDetailCollapsed(prev => ({ ...prev, incomplete: !prev.incomplete })),
                    })}
                    {!syncDetailCollapsed.incomplete && (
                      <div className="overflow-x-auto max-h-64 overflow-y-auto custom-scrollbar">
                        <table className={TABLE_CLS}>
                          <thead className={THEAD_CLS}>
                            <tr className="h-[42px]">
                              <th className={`${TH} text-center w-14`}>STT</th>
                              {approvalListCols.map(col => (
                                <th key={col.key} className={`${TH} text-left`}>{col.label}</th>
                              ))}
                              <th className={`${TH} text-left`}>Trường còn thiếu</th>
                              <th className={`${TH} text-left`}>Trạng thái duyệt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {syncHistorySelected.incompleteIds.length === 0 ? (
                              <tr><td colSpan={approvalListCols.length + 3} className="py-6 text-center text-[13px] text-[#64748B]">Không có bản ghi</td></tr>
                            ) : (
                              syncHistorySelected.incompleteIds.map((id, i) => {
                                const row = allData.find(r => r.id === id);
                                if (!row) return null;
                                const missingLabels = cols.filter(c => !row[c.key] || row[c.key].trim() === '').map(c => c.label);
                                return (
                                  <tr key={id} className={TR}>
                                    <td className={`${TD} text-center`}>{i + 1}</td>
                                    {approvalListCols.map(col => (
                                      <td key={col.key} className={`${TD} max-w-[240px]`}><TruncatedText text={row[col.key] || '—'} /></td>
                                    ))}
                                    <td className={`${TD} max-w-[360px]`}><TruncatedText text={missingLabels.join(', ')} className="text-[#DC2626]" /></td>
                                    <td className={TD}><ApprovalBadge status="pending" /></td>
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
            <div className={MODAL_FOOTER}>
              {syncHistorySelected ? (
                <button type="button" onClick={() => setSyncHistorySelectedId(null)} className={BTN_OUTLINE}>
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
              ) : (
                <button type="button" onClick={() => setShowSyncHistoryModal(false)} className={BTN_OUTLINE}>
                  Đóng
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Đồng bộ dữ liệu (UC1) */}
      {showSyncModal && (
        <div className={MODAL_OVERLAY}>
          <div role="dialog" aria-modal="true" aria-labelledby="md-sync-title" className={`${MODAL_BOX} max-w-xl`}>
            <div className={MODAL_HEADER}>
              <h3 id="md-sync-title" className={MODAL_TITLE}>Đồng bộ dữ liệu chủ</h3>
              <button type="button" onClick={() => setShowSyncModal(false)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <p className="text-[#64748B]">
                <span className="font-medium text-[#020817]">{masterLabel}</span> — áp dụng quy tắc đã thiết lập tại <strong className="font-medium text-[#020817]">Mô hình dữ liệu chủ</strong>
              </p>
              <div>
                <div className="text-[14px] font-medium text-[#020817] mb-2">Nguồn dữ liệu</div>
                <div className={TABLE_WRAP}>
                  <table className={TABLE_CLS}>
                    <thead className={THEAD_CLS}>
                      <tr className="h-[42px]">
                        <th className={`${TH} text-left`}>Hệ thống nguồn</th>
                        <th className={`${TH} text-left`}>Đồng bộ gần nhất</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={TR}>
                        <td className={TD}>{config.system}</td>
                        <td className={`${TD} whitespace-nowrap`}>08:00, {new Date().toLocaleDateString('vi-VN')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <div className="text-[14px] font-medium text-[#020817] mb-2">Quy tắc áp dụng (theo Mô hình dữ liệu chủ)</div>
                <div className={KV_LIST}>
                  <div className={KV_ROW}>
                    <span className={`${KV_LABEL} !w-48`}>Ánh xạ thuộc tính</span>
                    <span className={KV_VALUE}>{cols.length}/{cols.length} trường đã ánh xạ đầy đủ</span>
                  </div>
                  <div className={KV_ROW}>
                    <span className={`${KV_LABEL} !w-48`}>Quy tắc hợp nhất</span>
                    <span className={KV_VALUE}>Ưu tiên giữ dữ liệu mới nhất theo thời gian đồng bộ</span>
                  </div>
                  <div className={KV_ROW}>
                    <span className={`${KV_LABEL} !w-48`}>Quy tắc so khớp</span>
                    <span className={KV_VALUE}>Khớp chính xác theo {cols[0].label}</span>
                  </div>
                  <div className={KV_ROW}>
                    <span className={`${KV_LABEL} !w-48`}>Quy tắc định danh duy nhất</span>
                    <span className={KV_VALUE}>{cols[0].label}</span>
                  </div>
                </div>
              </div>
              <div className={BANNER_WARN}>
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[#D97706]" />
                <p>
                  Dự kiến sau khi đối chiếu khóa định danh duy nhất <strong className="font-medium">{cols[0].label}</strong>: sẽ có bản ghi <strong className="font-medium">Mới</strong> và bản ghi <strong className="font-medium">Cập nhật</strong> vào danh sách với trạng thái duyệt "Chưa phê duyệt" để rà soát
                  {duplicateIds.size > 0 ? <> ; <strong className="font-medium">{duplicateIds.size} bản ghi nghi trùng lặp</strong> sẽ được đánh dấu cần kiểm tra thủ công.</> : '.'}
                </p>
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" onClick={() => setShowSyncModal(false)} className={BTN_OUTLINE}>Hủy</button>
              <button type="button" onClick={handleConfirmSync} className={BTN_PRIMARY}>
                <RefreshCw className="w-4 h-4" />
                Bắt đầu đồng bộ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết dữ liệu của một phiên bản cụ thể (snapshot) */}
      {versionSnapshot && (
        <div className={MODAL_OVERLAY_TOP}>
          <div role="dialog" aria-modal="true" aria-labelledby="md-snapshot-title" className={`${MODAL_BOX} max-w-lg`}>
            <div className={MODAL_HEADER}>
              <h3 id="md-snapshot-title" className={MODAL_TITLE}>Chi tiết phiên bản v{versionSnapshot.version.version}</h3>
              <button type="button" onClick={() => setVersionSnapshot(null)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <div className="flex items-center gap-x-4 gap-y-1 flex-wrap">
                <span className="text-[#64748B]">Mã bản ghi: <span className="font-medium text-[#020817]">{versionSnapshot.row[cols[0].key]}</span></span>
                <span className="text-[#64748B]">Người cập nhật: <span className="font-medium text-[#020817]">{versionSnapshot.version.updatedBy}</span></span>
                <span className="text-[#64748B]">Ngày phát hành: <span className="font-medium text-[#020817]">{versionSnapshot.version.updatedAt}</span></span>
              </div>
              <div className={KV_LIST}>
                {cols.map(col => (
                  <div key={col.key} className={KV_ROW}>
                    <span className={KV_LABEL}>{col.label}</span>
                    <span className={KV_VALUE}>{versionSnapshot.version.values[col.key] || <span className={EMPTY_VALUE}>(trống)</span>}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" onClick={closeVersionSnapshot} className={BTN_OUTLINE}>
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Báo cáo lịch sử phiên bản thay đổi — của riêng 1 bản ghi, mở từ thao tác "Phiên bản" ở tab Dữ liệu */}
      {rowVersionReportRow && (() => {
        const row = rowVersionReportRow;
        const history = buildRecordVersionHistory(row, cols);
        const latest = history[history.length - 1];
        return (
          <div className={MODAL_OVERLAY}>
            <div role="dialog" aria-modal="true" aria-labelledby="md-row-version-title" className={`${MODAL_BOX} max-w-4xl`}>
              <div className={MODAL_HEADER}>
                <h3 id="md-row-version-title" className={MODAL_TITLE}>Báo cáo lịch sử phiên bản thay đổi</h3>
                <button type="button" onClick={() => setRowVersionReportRow(null)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className={`${MODAL_BODY} space-y-3`}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-[#64748B]">Bản ghi: <span className="font-medium text-[#020817]">{row[cols[0].key]}</span></p>
                  <button type="button" onClick={() => handleDownloadRowChangeReport(row)} className={BTN_OUTLINE}>
                    <Download className="w-4 h-4" />
                    Kết xuất báo cáo thay đổi
                  </button>
                </div>
                <div className={TABLE_WRAP}>
                  <div className="overflow-x-auto">
                    <table className={TABLE_CLS}>
                      <thead className={THEAD_CLS}>
                        <tr className="h-[42px]">
                          <th className={`${TH} text-left`}>Mã bản ghi</th>
                          <th className={`${TH} text-left`}>Phiên bản</th>
                          <th className={`${TH} text-left`}>Người cập nhật</th>
                          <th className={`${TH} text-left`}>Ngày phát hành</th>
                          <th className={`${TH} text-left`}>Trạng thái</th>
                          <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.slice().reverse().map(v => {
                          const isEffective = v.version === latest.version;
                          return (
                            <tr key={v.version} className={TR}>
                              <td className={`${TD} max-w-[240px]`}><TruncatedText text={row[cols[0].key]} /></td>
                              <td className={TD}><Badge label={`v${v.version}`} variant="slate" /></td>
                              <td className={`${TD} max-w-[240px]`}><TruncatedText text={v.updatedBy} /></td>
                              <td className={TD}><DateTimeCell value={v.updatedAt} /></td>
                              <td className={TD}>
                                {isEffective ? <Badge label="Hiệu lực" variant="green" /> : <Badge label="Lưu trữ" variant="slate" />}
                              </td>
                              <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>
                                <div className="flex items-center justify-center gap-1">
                                  <RowIconAction label="Xem chi tiết dữ liệu của phiên bản này" onClick={() => openVersionSnapshot(row, v, row)}>
                                    <Eye className="w-4 h-4" />
                                  </RowIconAction>
                                  <RowIconAction label="So sánh với bản ghi trước" onClick={() => handleOpenVersionCompare(row, history.indexOf(v), row)}>
                                    <GitCompare className="w-4 h-4" />
                                  </RowIconAction>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className={MODAL_FOOTER}>
                <button type="button" onClick={() => setRowVersionReportRow(null)} className={BTN_OUTLINE}>Đóng</button>
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
          <div className={MODAL_OVERLAY}>
            <div role="dialog" aria-modal="true" aria-labelledby="md-compare-title" className={`${MODAL_BOX} max-w-4xl`}>
              <div className={MODAL_HEADER}>
                <h3 id="md-compare-title" className={MODAL_TITLE}>So sánh phiên bản dữ liệu chủ</h3>
                <button type="button" onClick={() => setVersionCompareModal(null)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className={`${MODAL_BODY} space-y-4`}>
                <div className="rounded-2xl border border-[#E2E8F0] p-4 bg-[#F8FAFC] flex flex-col items-center text-center gap-2">
                  <div className="text-[13px] text-[#64748B]">Bản ghi được so sánh</div>
                  <div className="text-[14px] font-medium text-[#020817]">{versionCompareModal.row[cols[0].key]}</div>
                  <div className="flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-lg px-4 py-2">
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] text-[#64748B]">Phiên bản cũ</span>
                      <span className="text-[13px] font-medium text-[#334155] mt-0.5">v{selectedVersion.version}</span>
                    </div>
                    <span className="text-[#94A3B8]">→</span>
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] text-[#64748B]">Phiên bản mới</span>
                      <span className="text-[13px] font-medium text-blue-600 mt-0.5">v{latestVersion.version}</span>
                    </div>
                  </div>
                </div>

                <div className={TABLE_WRAP}>
                  <div className="overflow-x-auto">
                    <table className={TABLE_CLS}>
                      <thead className={THEAD_CLS}>
                        <tr className="border-b border-[#E2E8F0]">
                          <th colSpan={2} className={`${TH} text-left border-r border-[#E2E8F0]`}>
                            <div className="flex items-center justify-between gap-2">
                              <span>PHIÊN BẢN CŨ (v{selectedVersion.version})</span>
                              <Badge label="Trước cập nhật" variant="slate" />
                            </div>
                          </th>
                          <th colSpan={2} className={`${TH} text-left`}>
                            <div className="flex items-center justify-between gap-2">
                              <span>PHIÊN BẢN MỚI (v{latestVersion.version})</span>
                              <Badge label="Sau cập nhật" variant="blue" />
                            </div>
                          </th>
                        </tr>
                        <tr className="h-[42px]">
                          <th className={`${TH} text-left border-r border-[#E2E8F0]`}>Trường thuộc tính</th>
                          <th className={`${TH} text-left border-r border-[#E2E8F0]`}>Giá trị</th>
                          <th className={`${TH} text-left border-r border-[#E2E8F0]`}>Trường thuộc tính</th>
                          <th className={`${TH} text-left`}>Giá trị</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cols.map(col => {
                          const oldVal = selectedVersion.values[col.key] || '';
                          const newVal = latestVersion.values[col.key] || '';
                          const changed = oldVal !== newVal;
                          return (
                            <tr key={col.key} className={TR}>
                              <td className={`${TD} border-r border-[#E2E8F0]`}>{col.label}</td>
                              <td className={`${TD} border-r border-[#E2E8F0] ${changed ? 'bg-[#FFF7ED]' : ''}`}>
                                {oldVal || <span className={EMPTY_VALUE}>(trống)</span>}
                              </td>
                              <td className={`${TD} border-r border-[#E2E8F0]`}>{col.label}</td>
                              <td className={`${TD} ${changed ? 'bg-[#EAF3FF] text-blue-600 font-medium' : ''}`}>
                                {newVal || <span className={EMPTY_VALUE}>(trống)</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className={MODAL_FOOTER}>
                <button type="button" onClick={closeVersionCompareModal} className={BTN_OUTLINE}>
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal xác nhận xóa bản ghi */}
      {deleteModal.open && (
        <div className={MODAL_OVERLAY}>
          <div role="alertdialog" aria-modal="true" aria-labelledby="md-delete-title" className={`${MODAL_BOX} max-w-md`}>
            <div className={MODAL_HEADER}>
              <h3 id="md-delete-title" className={MODAL_TITLE}>Xóa bản ghi</h3>
              <button type="button" onClick={() => setDeleteModal({ open: false, id: '' })} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={MODAL_BODY}>
              <div className={BANNER_DANGER}>
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[#DC2626]" />
                <p>Bạn có chắc chắn muốn xóa bản ghi này? Bản ghi sẽ chuyển sang trạng thái "Đã xóa" và có thể khôi phục lại sau.</p>
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" onClick={() => setDeleteModal({ open: false, id: '' })} className={BTN_OUTLINE}>Hủy bỏ</button>
              <button type="button" onClick={handleConfirmDelete} className={BTN_DESTRUCTIVE}>
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
        <div className={MODAL_OVERLAY}>
          <div role="dialog" aria-modal="true" aria-labelledby="md-detail-title" className={`${MODAL_BOX} max-w-4xl`}>
            <div className={MODAL_HEADER}>
              <h3 id="md-detail-title" className={MODAL_TITLE}>Chi tiết bản ghi</h3>
              <button type="button" onClick={() => setDetailRow(null)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab cấp 2 trong modal (mục 5.9) */}
            <div className="px-6 border-b border-[#E2E8F0] flex items-center flex-wrap shrink-0">
              {DETAIL_TABS.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDetailTab(tab.id)}
                  className={tabClass(detailTab === tab.id)}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'warnings' && hasWarnings && (
                    <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                  )}
                </button>
              ))}
            </div>

            <div className={`${MODAL_BODY} space-y-3`}>
              {detailTab === 'values' && (
                <>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[#64748B]">Trạng thái:</span>
                      <ApprovalBadge status={detailRow.approvalStatus} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#64748B]">Trạng thái dữ liệu:</span>
                      <DataStatusBadge status={getDataStatus(detailRow)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#64748B]">Trạng thái công khai:</span>
                      <PublicBadge status={detailRow.publicStatus} />
                    </div>
                  </div>
                  {detailRow.approvalStatus === 'rejected' && detailRow.rejectReason && (
                    <div className={BANNER_DANGER}>
                      <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#DC2626]" />
                      <p>
                        <span className="font-medium">Lý do từ chối: </span>{detailRow.rejectReason}
                      </p>
                    </div>
                  )}
                  <div className={KV_LIST}>
                    {cols.map(col => (
                      <div key={col.key} className={KV_ROW}>
                        <span className={KV_LABEL}>{col.label}</span>
                        <span className={KV_VALUE}>{detailRow[col.key] || <span className={EMPTY_VALUE}>(trống)</span>}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {detailTab === 'history' && historyView === 'list' && (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-[#E2E8F0] p-4 bg-white">
                    <p className={SECTION_TITLE}>Lịch sử chỉnh sửa bản ghi này</p>
                    <div className="space-y-4">
                      {[
                        { dotClass: 'bg-[#16A34A]', action: 'Phê duyệt', time: '09:12, 02/07/2026', version: 'v1.1 → v1.2', description: 'Phê duyệt cập nhật thông tin bản ghi.', actor: 'Nguyễn Thanh Hải' },
                        { dotClass: 'bg-[#155DFC]', action: 'Chỉnh sửa', time: '16:40, 01/07/2026', version: null,          description: 'Bổ sung, chỉnh sửa một số trường dữ liệu.', actor: 'Trần Minh Phúc' },
                        { dotClass: 'bg-[#94A3B8]', action: 'Tạo mới',   time: '08:00, 10/01/2026', version: 'v1.0',        description: 'Khởi tạo bản ghi từ đồng bộ dữ liệu.', actor: 'Hệ thống' },
                      ].map((item, i, arr) => (
                        <div key={i} className={i < arr.length - 1 ? 'pb-4 border-b border-[#E2E8F0]' : ''}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dotClass}`} />
                            <span className="text-[13px] font-medium text-[#020817]">{item.action}</span>
                            <span className="text-[13px] text-[#64748B]">{item.time}</span>
                            {item.version && <Badge label={item.version} variant="slate" />}
                          </div>
                          <p className="text-[13px] text-[#334155] mt-1 ml-4">{item.description}</p>
                          <p className="text-[13px] text-[#64748B] mt-1 ml-4">{item.actor}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#E2E8F0] p-4 bg-white">
                    <button
                      type="button"
                      aria-expanded={showOriginalData}
                      onClick={() => setShowOriginalData(v => !v)}
                      className="flex items-center gap-1.5 text-[14px] font-medium text-[#020817] cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform ${showOriginalData ? 'rotate-180' : ''}`} />
                      Xem dữ liệu gốc
                    </button>
                    {showOriginalData && (() => {
                      const originalValues = versionHistory[0].values;
                      const hasChanges = cols.some(col => (originalValues[col.key] || '') !== (latestVersion.values[col.key] || ''));
                      if (!hasChanges) {
                        return (
                          <p className="text-[13px] text-[#64748B] mt-3">Không có chỉnh sửa so với dữ liệu gốc</p>
                        );
                      }
                      return (
                        <div className={`${KV_LIST} mt-3`}>
                          {cols.map(col => (
                            <div key={col.key} className={KV_ROW}>
                              <span className={KV_LABEL}>{col.label}</span>
                              <span className={KV_VALUE}>
                                {originalValues[col.key] || <span className={EMPTY_VALUE}>(trống)</span>}
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
                  <div className={KV_LIST}>
                    <div className={KV_ROW}>
                      <span className={KV_LABEL}>Đơn vị quản lý</span>
                      <span className={KV_VALUE}>{config.unit}</span>
                    </div>
                    <div className={KV_ROW}>
                      <span className={KV_LABEL}>Hệ thống nguồn</span>
                      <span className={KV_VALUE}>{config.system}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[14px] font-medium text-[#020817] mb-2">
                      Liên kết chéo thực thể ({crossEntityLinks.length})
                    </p>
                    {!categoryHasCrossEntityConfig(config.category) ? (
                      <div className="border border-[#E2E8F0] rounded-lg p-4 text-center text-[#64748B]">
                        Thực thể dữ liệu chưa được thiết lập quan hệ với thực thể khác
                      </div>
                    ) : crossEntityGroups.length === 0 ? (
                      <div className="border border-[#E2E8F0] rounded-lg p-4 text-center text-[#64748B]">
                        Thực thể dữ liệu chưa được thiết lập quan hệ với thực thể khác
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {crossEntityGroups.map(group => (
                          <div key={group.categoryLabel} className={TABLE_WRAP}>
                            <div className="px-3 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[13px] font-medium text-[#020817] flex items-center justify-between gap-3">
                              <span>{group.categoryLabel}</span>
                              <span className="text-[#64748B] font-normal">{group.links.length} bản ghi</span>
                            </div>
                            <table className={TABLE_CLS}>
                              <thead className={THEAD_CLS}>
                                <tr className="h-[42px]">
                                  <th className={`${TH} text-left`}>{COLUMNS[group.links[0].category][0].label}</th>
                                  <th className={`${TH} text-left`}>Trạng thái phê duyệt</th>
                                  <th className={`${TH} text-right`}></th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.links.map(link => (
                                  <tr key={`${link.category}-${link.row.id}`} className={`${TR} last:border-0`}>
                                    <td className={TD}>{link.row[COLUMNS[link.category][0].key]}</td>
                                    <td className={TD}><ApprovalBadge status={link.row.approvalStatus} /></td>
                                    <td className={`${TD} text-right`}>
                                      <button
                                        type="button"
                                        onClick={() => setViewingLinkedRecord(link)}
                                        className="text-[13px] text-blue-600 hover:underline cursor-pointer rounded outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
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
                    <div className="border border-[#E2E8F0] rounded-lg p-6 text-center text-[#64748B]">
                      Không có cảnh báo lỗi nào
                    </div>
                  )}
                  {missingCols.length > 0 && (
                    <div className={BANNER_WARN}>
                      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[#D97706]" />
                      <div>
                        <p className="font-medium mb-1">Thiếu dữ liệu bắt buộc</p>
                        <p>Các trường sau đang để trống: {missingCols.map(c => c.label).join(', ')}</p>
                      </div>
                    </div>
                  )}
                  {isDetailDup && (
                    <div className={BANNER_WARN}>
                      <Copy className="w-4 h-4 mt-0.5 shrink-0 text-[#D97706]" />
                      <div>
                        <p className="font-medium mb-1">Nghi ngờ trùng lặp</p>
                        <p>Bản ghi này trùng khóa định danh với {relatedRecords.length} bản ghi khác trong hệ thống.</p>
                      </div>
                    </div>
                  )}
                  {detailRow.approvalStatus === 'rejected' && detailRow.rejectReason && (
                    <div className={BANNER_DANGER}>
                      <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#DC2626]" />
                      <p><span className="font-medium">Lý do từ chối: </span>{detailRow.rejectReason}</p>
                    </div>
                  )}
                  {hasUnapproveWarning && (
                    <div className={BANNER_DANGER}>
                      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[#DC2626]" />
                      <p>
                        <span className="font-medium">Đã hủy phê duyệt với lý do: </span>{detailRow.unapproveReason}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={MODAL_FOOTER}>
              <button type="button" onClick={() => setDetailRow(null)} className={BTN_OUTLINE}>Đóng</button>
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
          <div className={MODAL_OVERLAY_TOP}>
            <div role="dialog" aria-modal="true" aria-labelledby="md-linked-title" className={`${MODAL_BOX} max-w-lg`}>
              <div className={MODAL_HEADER}>
                <h3 id="md-linked-title" className={MODAL_TITLE}>Chi tiết bản ghi — {link.categoryLabel}</h3>
                <button type="button" onClick={() => setViewingLinkedRecord(null)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className={`${MODAL_BODY} space-y-3`}>
                <div className="flex items-center gap-2">
                  <span className="text-[#64748B]">Trạng thái phê duyệt:</span>
                  <ApprovalBadge status={link.row.approvalStatus} />
                </div>
                <div className={KV_LIST}>
                  {linkedCols.map(col => (
                    <div key={col.key} className={KV_ROW}>
                      <span className={KV_LABEL}>{col.label}</span>
                      <span className={KV_VALUE}>
                        {link.row[col.key] || <span className={EMPTY_VALUE}>(trống)</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={MODAL_FOOTER}>
                <button type="button" onClick={() => setViewingLinkedRecord(null)} className={BTN_OUTLINE}>Đóng</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
