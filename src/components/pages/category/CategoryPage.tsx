import * as React from 'react';
import { useState, ChangeEvent } from 'react';
import {
  Settings,
  CheckCircle2,
  Globe,
  FileText,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  SquarePen,
  Trash2,
  X,
  Save,
  Database,
  List,
  Tag,
  Columns,
  Clock,
  XCircle,
  Check,
  AlertCircle,
  Share2,
  Lock,
  Unlock,
  Download,
  FileDown,
  BarChart3,
  Activity,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Upload,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { PowerOff } from 'lucide-react';
import { CreateVersionModal } from './components/modals/CreateVersionModal';
import { ArchiveRecordModal } from './components/modals/ArchiveRecordModal';
import { RecordFormModal } from './components/modals/RecordFormModal';
import { ApprovalRequestModal } from './components/modals/ApprovalRequestModal';
import { UpdateApprovalModal } from './components/modals/UpdateApprovalModal';
import { CategoryInfoViewModal } from './components/modals/CategoryInfoViewModal';
import { MasterDataEntity } from './categoryTypes';
import { lifecycleLabels, scopeLabels } from './categoryConstants';
import { Portal } from '../../common/Portal';
import { toast } from 'sonner';
import {
  Badge, TruncatedText, RowIconAction, Pagination, tabClass,
  BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON, ROW_ICON_BTN,
  INPUT_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, normalizeSearch
} from '../collection/collectionUi';

// --- Lớp giao diện dùng chung trong file (compomennt.md 5.3, 5.4) ---
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const TR = 'group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const TABLE_WRAP = 'bg-white rounded-lg border border-[#E2E8F0] overflow-hidden';
const TABLE_CLS = 'w-full border-collapse collection-table text-[13px]';
const STICKY_TH = 'sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]';
const STICKY_TD = 'sticky right-0 bg-white group-hover:bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]';
const CHECKBOX_CLS = 'w-4 h-4 accent-blue-600 rounded cursor-pointer align-middle';
const EMPTY_TD = 'py-16 text-center text-[13px] text-[#64748B]';
const MODAL_OVERLAY = 'fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200';
const MODAL_BOX = 'bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden';
const MODAL_HEADER = 'px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0';
const MODAL_TITLE = 'text-[16px] font-medium text-[#020817]';
const MODAL_SUBTITLE = 'text-[13px] text-[#64748B]';
const MODAL_BODY = 'px-6 py-4 overflow-y-auto custom-scrollbar flex-1';
const MODAL_FOOTER = 'px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 shrink-0';
const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600';
const BANNER_INFO = 'p-3 rounded-lg border bg-[#EAF3FF] border-[#BFDBFE] text-[13px] text-[#020817] flex items-start gap-2';
const BANNER_WARN = 'p-3 rounded-lg border bg-[#FFF7ED] border-[#FED7AA] text-[13px] text-[#020817] flex items-start gap-2';
const BANNER_DANGER = 'p-3 rounded-lg border bg-[#FEF2F2] border-[#FEE2E2] text-[13px] text-[#020817] flex items-start gap-2';
const BANNER_SUCCESS = 'p-3 rounded-lg border bg-[#F0FDF4] border-[#DCFCE7] text-[13px] text-[#020817] flex items-start gap-2';
const CHIP_ACTIVE = `${BTN_OUTLINE} !bg-[#EAF3FF] !border-[#BFDBFE] !text-[#155DFC]`;
// Nút icon 40×40 nền trắng viền #CBD5E1 (mục 5.1 – Icon outline)
const ICON_OUTLINE_40 = 'w-10 h-10 shrink-0 rounded-lg border bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#020817] transition-colors flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600';
const STAT_CARD = 'bg-white rounded-2xl border border-[#E2E8F0] p-4';

export type CategoryPublishStatus = 'unpublished' | 'published' | 'stopped';

interface CategoryPageProps {
  categoryName: string;
  categoryId: string;
  readOnly?: boolean;
  /** Trạng thái công khai ban đầu, dùng để đồng bộ với danh sách danh mục bên ngoài */
  initialPublishStatus?: CategoryPublishStatus;
  /** Báo cho component cha biết trạng thái công khai vừa thay đổi */
  onPublishStatusChange?: (status: CategoryPublishStatus) => void;
}

interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'standard' | 'reference' | 'system';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'unpublished' | 'active' | 'inactive';
  /** Trạng thái dữ liệu — loại thay đổi gần nhất áp dụng cho bản ghi */
  dataStatus?: 'new' | 'edited' | 'inactive';
  /** Nội dung ghi chú khi phê duyệt (chỉ có khi status đã được duyệt) */
  approvalNote?: string;
  /** Lý do khi từ chối (chỉ có khi status = rejected) */
  rejectReason?: string;
  /** Snapshot giá trị cũ của các trường vừa chỉnh sửa — dùng để hiển thị diff ở modal "Chi tiết thay đổi" (tab Phê duyệt) */
  previousValues?: { code?: string; name?: string; description?: string };
  createdDate: string;
  createdBy?: string;
  updatedDate?: string;
  updatedBy?: string;
  version?: number;
  fields: CategoryField[];
}

interface CategoryField {
  id: string;
  name: string;
  dataType: string;
  required: boolean;
  defaultValue?: string;
  maxLength?: number;
  description?: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  referenceTable?: string;
  referenceField?: string;
}

const MOCK_RECORDS_BY_CATEGORY: Record<string, Category[]> = {
  'category-a-1': [
    { id: '1', code: 'MALE', name: 'Nam', description: 'Giới tính Nam', type: 'standard', status: 'approved', dataStatus: 'new', approvalNote: 'Đã kiểm tra, dữ liệu đúng chuẩn theo quy định phân loại giới tính hiện hành.', createdDate: '01/01/2024', createdBy: 'Hệ thống', updatedDate: '15/01/2026', updatedBy: 'Hoàng Văn E', version: 1, fields: [] },
    { id: '2', code: 'FEMALE', name: 'Nữ', description: 'Giới tính Nữ', type: 'standard', status: 'approved', dataStatus: 'new', createdDate: '01/01/2024', createdBy: 'Hệ thống', updatedDate: '15/01/2026', updatedBy: 'Nguyễn Văn A', version: 1, fields: [] },
    { id: '3', code: 'OTHER', name: 'Khác', description: 'Giới tính khác/chưa xác định', type: 'standard', status: 'approved', dataStatus: 'edited', previousValues: { description: 'Giới tính khác' }, createdDate: '01/01/2024', createdBy: 'Hệ thống', updatedDate: '15/01/2026', updatedBy: 'Nguyễn Văn A', version: 1, fields: [] },
    { id: '4', code: 'UNKNOWN', name: 'Không xác định', description: 'Giới tính không xác định', type: 'standard', status: 'pending', dataStatus: 'new', createdDate: '20/06/2026', createdBy: 'Nguyễn Văn A', updatedDate: '20/06/2026', updatedBy: 'Nguyễn Văn A', version: 1, fields: [] },
    { id: '5', code: 'INTERSEX', name: 'Liên giới tính', description: 'Sinh học không hoàn toàn nam hoặc nữ', type: 'standard', status: 'rejected', dataStatus: 'edited', previousValues: { name: 'Lưỡng giới' }, rejectReason: 'Tên gọi chưa phù hợp với quy định phân loại hiện hành, đề nghị điều chỉnh lại theo Thông tư hướng dẫn.', createdDate: '10/06/2026', createdBy: 'Trần Thị B', updatedDate: '15/06/2026', updatedBy: 'Trần Thị B', version: 1, fields: [] },
    { id: '6', code: 'NON_BINARY', name: 'Phi nhị giới', description: 'Không thuộc nhị giới tính truyền thống', type: 'standard', status: 'draft', dataStatus: 'edited', previousValues: { code: 'NONBINARY', description: 'Không xác định nhị giới' }, createdDate: '01/07/2026', createdBy: 'Lê Văn C', updatedDate: '01/07/2026', updatedBy: 'Lê Văn C', version: 1, fields: [] },
    { id: '7', code: 'AGENDER', name: 'Vô giới tính', description: 'Không nhận dạng với bất kỳ giới tính nào', type: 'standard', status: 'inactive', dataStatus: 'inactive', createdDate: '05/03/2025', createdBy: 'Phạm Thị D', updatedDate: '10/06/2026', updatedBy: 'Phạm Thị D', version: 1, fields: [] }
  ],
  'category-a-2': [
    { id: '1', code: 'KINH', name: 'Kinh', description: 'Dân tộc Kinh', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'TAY', name: 'Tày', description: 'Dân tộc Tày', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'THAI', name: 'Thái', description: 'Dân tộc Thái', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '4', code: 'MUONG', name: 'Mường', description: 'Dân tộc Mường', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '5', code: 'KHOME', name: 'Khơ Me', description: 'Dân tộc Khơ Me', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-3': [
    { id: '1', code: 'VN', name: 'Việt Nam', description: 'Cộng hòa Xã hội Chủ nghĩa Việt Nam', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'US', name: 'Mỹ', description: 'Hợp chủng quốc Hoa Kỳ', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'JP', name: 'Nhật Bản', description: 'Nhật Bản', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '4', code: 'KR', name: 'Hàn Quốc', description: 'Đại Hàn Dân Quốc', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-4': [
    { id: '1', code: 'PG', name: 'Phật giáo', description: 'Đạo Phật', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'CG', name: 'Công giáo', description: 'Đạo Thiên Chúa', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'TL', name: 'Tin lành', description: 'Đạo Tin lành', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '4', code: 'HH', name: 'Hòa Hảo', description: 'Phật giáo Hòa Hảo', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '5', code: 'K', name: 'Không', description: 'Không theo tôn giáo nào', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-5': [
    { id: '1', code: 'BTP', name: 'Bộ Tư Pháp', description: 'Cơ quan ngang bộ trực thuộc Chính phủ', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'CHT', name: 'Cục Hộ tịch, quốc tịch, chứng thực', description: 'Đơn vị trực thuộc Bộ Tư pháp', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'STP_HN', name: 'Sở Tư pháp Hà Nội', description: 'Cơ quan chuyên môn thuộc UBND TP Hà Nội', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-6': [
    { id: '1', code: 'HN', name: 'Thành phố Hà Nội', description: 'Đơn vị hành chính cấp tỉnh', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'HCM', name: 'Thành phố Hồ Chí Minh', description: 'Đơn vị hành chính cấp tỉnh', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'DN', name: 'Thành phố Đà Nẵng', description: 'Đơn vị hành chính cấp tỉnh', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-7': [
    { id: '1', code: 'CH', name: 'Chủ hộ', description: 'Chủ hộ gia đình', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'VC', name: 'Vợ/Chồng', description: 'Quan hệ vợ chồng với chủ hộ', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'CC', name: 'Con đẻ', description: 'Con ruột của chủ hộ', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '4', code: 'BC', name: 'Bố/Mẹ', description: 'Bố mẹ đẻ của chủ hộ', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] }
  ]
};

export function CategoryPage({ categoryName, categoryId, readOnly = false, initialPublishStatus = 'unpublished', onPublishStatusChange }: CategoryPageProps) {
  const [activeTab, setActiveTab] = useState<'setup' | 'approval' | 'publish' | 'stats' | 'version-history'>('setup');

  // Mock data - Danh sách tỉnh thành Việt Nam
  const [categories, setCategories] = useState<Category[]>(() => [
    { id: '1', code: 'VN01', name: 'Hà Nội', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'pending', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '2', code: 'VN02', name: 'Hồ Chí Minh', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'approved', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '3', code: 'VN03', name: 'Đà Nẵng', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'published', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '4', code: 'VN04', name: 'Hải Phòng', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'unpublished', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '5', code: 'VN05', name: 'Cần Thơ', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '6', code: 'VN06', name: 'An Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '7', code: 'VN07', name: 'Bà Rịa - Vũng Tàu', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '8', code: 'VN08', name: 'Bắc Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '9', code: 'VN09', name: 'Bắc Kạn', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '10', code: 'VN10', name: 'Bạc Liêu', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '11', code: 'VN11', name: 'Bắc Ninh', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '12', code: 'VN12', name: 'Bến Tre', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '13', code: 'VN13', name: 'Bình Định', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '14', code: 'VN14', name: 'Bình Dương', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '15', code: 'VN15', name: 'Bình Phước', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '16', code: 'VN16', name: 'Bình Thuận', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '17', code: 'VN17', name: 'Cà Mau', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '18', code: 'VN18', name: 'Cao Bằng', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '19', code: 'VN19', name: 'Đắk Lắk', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '20', code: 'VN20', name: 'Đắk Nông', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '21', code: 'VN21', name: 'Điện Biên', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '22', code: 'VN22', name: 'Đồng Nai', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '23', code: 'VN23', name: 'Đồng Tháp', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '24', code: 'VN24', name: 'Gia Lai', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '25', code: 'VN25', name: 'Hà Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '26', code: 'VN26', name: 'Hà Nam', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '27', code: 'VN27', name: 'Hà Tĩnh', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '28', code: 'VN28', name: 'Hải Dương', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '29', code: 'VN29', name: 'Hậu Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '30', code: 'VN30', name: 'Hòa Bình', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '31', code: 'VN31', name: 'Hưng Yên', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '32', code: 'VN32', name: 'Khánh Hòa', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '33', code: 'VN33', name: 'Kiên Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '34', code: 'VN34', name: 'Kon Tum', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '35', code: 'VN35', name: 'Lai Châu', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '36', code: 'VN36', name: 'Lâm Đồng', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '37', code: 'VN37', name: 'Lạng Sơn', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '38', code: 'VN38', name: 'Lào Cai', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '39', code: 'VN39', name: 'Long An', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '40', code: 'VN40', name: 'Nam Định', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '41', code: 'VN41', name: 'Nghệ An', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '42', code: 'VN42', name: 'Ninh Bình', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '43', code: 'VN43', name: 'Ninh Thuận', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '44', code: 'VN44', name: 'Phú Thọ', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '45', code: 'VN45', name: 'Phú Yên', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '46', code: 'VN46', name: 'Quảng Bình', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '47', code: 'VN47', name: 'Quảng Nam', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '48', code: 'VN48', name: 'Quảng Ngãi', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '49', code: 'VN49', name: 'Quảng Ninh', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '50', code: 'VN50', name: 'Quảng Trị', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '51', code: 'VN51', name: 'Sóc Trăng', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '52', code: 'VN52', name: 'Sơn La', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '53', code: 'VN53', name: 'Tây Ninh', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '54', code: 'VN54', name: 'Thái Bình', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '55', code: 'VN55', name: 'Thái Nguyên', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '56', code: 'VN56', name: 'Thanh Hóa', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '57', code: 'VN57', name: 'Thừa Thiên Huế', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '58', code: 'VN58', name: 'Tiền Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '59', code: 'VN59', name: 'Trà Vinh', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '60', code: 'VN60', name: 'Tuyên Quang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '61', code: 'VN61', name: 'Vĩnh Long', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '62', code: 'VN62', name: 'Vĩnh Phúc', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '63', code: 'VN63', name: 'Yên Bái', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] }
  ].map(c => ({
    ...c,
    status: 'approved',
    dataStatus: 'new' as const,
    createdBy: 'Hệ thống',
    updatedDate: '15/01/2026',
    updatedBy: 'Nguyễn Văn A'
  })));

  // Update categories when categoryId changes
  React.useEffect(() => {
    const mockRecords = MOCK_RECORDS_BY_CATEGORY[categoryId] || MOCK_RECORDS_BY_CATEGORY['category-a-1'] || [];
    setCategories(mockRecords.map(r => ({
      createdBy: 'Hệ thống',
      updatedDate: '15/01/2026',
      updatedBy: 'Nguyễn Văn A',
      dataStatus: 'new' as const,
      ...r,
    })));
  }, [categoryId]);
  // searchInput: giá trị đang gõ; searchTerm: giá trị đã áp dụng (chỉ cập nhật khi bấm Tìm kiếm / Enter — mục 5.19)
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportFile = (format: string) => {
    setShowExportMenu(false);
    toast.info(`Xuất dữ liệu ra ${format}`);
  };

  // Filter conditions (like TargetDatabaseDetailPage)
  interface FilterCondition { id: string; field: string; operator: string; value: string; logic: 'AND' | 'OR'; }
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
  // Điều kiện lọc đã áp dụng — chỉ cập nhật khi bấm Tìm kiếm / Enter
  const [appliedFilterConditions, setAppliedFilterConditions] = useState<FilterCondition[]>([]);

  // Sort panel state (like TargetDatabaseDetailPage)
  interface SortCondition { id: string; field: 'name' | 'code' | 'createdDate' | 'updatedDate'; order: 'ASC' | 'DESC'; }
  const [showSortPanel, setShowSortPanel] = useState(false);
  const [sortConditions, setSortConditions] = useState<SortCondition[]>([]);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const runSearch = () => {
    setSearchTerm(searchInput);
    setAppliedFilterConditions(filterConditions);
    setCurrentPageNum(1);
  };
  // Tab Dữ liệu (không có ô tìm kiếm): áp dụng điều kiện lọc khi bấm "Áp dụng bộ lọc" / Enter
  const applyDataFilters = () => {
    setAppliedFilterConditions(filterConditions);
    setCurrentPageNum(1);
  };
  // Nút Cập nhật: làm mới danh sách bản ghi, giữ nguyên điều kiện lọc/sắp xếp đang áp dụng
  const handleRefreshData = () => {
    setCurrentPageNum(1);
    toast.success('Đã cập nhật dữ liệu');
  };
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  // Xem chi tiết bản ghi (tab Dữ liệu) — hiển thị đầy đủ Ngày tạo/Người tạo/Ngày cập nhật/Người cập nhật
  const [showRecordDetailModal, setShowRecordDetailModal] = useState(false);
  const [viewingRecordDetail, setViewingRecordDetail] = useState<Category | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Category | null>(null);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showCreateVersionModal, setShowCreateVersionModal] = useState(false);
  const [showFieldFormModal, setShowFieldFormModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showApprovalDetailModal, setShowApprovalDetailModal] = useState(false);
  const [showApprovalRequestModal, setShowApprovalRequestModal] = useState(false);
  const [approvalForm, setApprovalForm] = useState({ reviewer: '', note: '' });
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [showBulkApproval, setShowBulkApproval] = useState(false);
  const [bulkApprovalForm, setBulkApprovalForm] = useState({ reviewer: '', note: '' });
  const [selectedApprovalRequest, setSelectedApprovalRequest] = useState<any>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreviewData, setImportPreviewData] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryFields, setNewCategoryFields] = useState<CategoryField[]>([]);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successNotificationMessage, setSuccessNotificationMessage] = useState('');

  const [newVersionName, setNewVersionName] = useState('v3.3');
  const [newEffectiveDate, setNewEffectiveDate] = useState('');
  const [newChangeDesc, setNewChangeDesc] = useState('');
  const [versionHistoryList, setVersionHistoryList] = useState([
    {
      version: 'v3.2',
      date: '05/01/2026',
      effectiveDate: '10/01/2026',
      user: 'Nguyễn Văn A',
      changes: 'Thêm trường "Số điện thoại liên hệ"',
      status: 'active'
    },
    {
      version: 'v3.1',
      date: '28/12/2025',
      effectiveDate: '01/01/2026',
      user: 'Trần Thị B',
      changes: 'Cập nhật 15 bản ghi tỉnh thành',
      status: 'archived'
    },
    {
      version: 'v3.0',
      date: '15/12/2025',
      effectiveDate: '20/12/2025',
      user: 'Lê Văn C',
      changes: 'Thay đổi kiểu dữ liệu trường "Mã tỉnh"',
      status: 'archived'
    },
    {
      version: 'v2.5',
      date: '01/12/2025',
      effectiveDate: '05/12/2025',
      user: 'Phạm Thị D',
      changes: 'Thêm ràng buộc unique cho mã tỉnh',
      status: 'archived'
    },
    {
      version: 'v2.0',
      date: '20/11/2025',
      effectiveDate: '25/11/2025',
      user: 'Hoàng Văn E',
      changes: 'Khởi tạo danh mục 63 tỉnh thành',
      status: 'archived'
    }
  ]);

  // Inline edit & add states
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [inlineEditData, setInlineEditData] = useState({ code: '', name: '', description: '' });
  const [addingRow, setAddingRow] = useState<boolean>(false);
  const [inlineAddData, setInlineAddData] = useState({ code: '', name: '', description: '' });

  // Publish states
  const [publishStatus, setPublishStatus] = useState<CategoryPublishStatus>(initialPublishStatus);
  const [shareScope, setShareScope] = useState<'internal' | 'extended' | 'public'>('internal');
  const [unpublishReason, setUnpublishReason] = useState<string>('');
  const [publishActionInfo, setPublishActionInfo] = useState<{ user: string; date: string; reason?: string }>({ user: '', date: '' });
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState<boolean>(false);

  const handleSaveInlineEdit = (id: string) => {
    if (!inlineEditData.code.trim() || !inlineEditData.name.trim()) {
      toast.error('Mã và Tên giá trị không được để trống');
      return;
    }
    const currentDate = new Date().toLocaleDateString('vi-VN');
    setCategories(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        // Ghi lại giá trị cũ của các trường thực sự thay đổi để hiển thị diff ở tab Phê duyệt
        const snapshot: Category['previousValues'] = {};
        if (c.code !== inlineEditData.code) snapshot.code = c.code;
        if (c.name !== inlineEditData.name) snapshot.name = c.name;
        if (c.description !== inlineEditData.description) snapshot.description = c.description;
        return {
          ...c,
          code: inlineEditData.code,
          name: inlineEditData.name,
          description: inlineEditData.description,
          status: 'draft' as const,
          dataStatus: 'edited' as const,
          previousValues: Object.keys(snapshot).length > 0 ? snapshot : c.previousValues,
          updatedDate: currentDate,
          updatedBy: 'Nguyễn Văn A'
        };
      })
    );
    setVersionHistoryList(prev => [{
      version: getNextVersionLabel(),
      date: currentDate,
      effectiveDate: '',
      user: 'Nguyễn Văn A',
      changes: `Chỉnh sửa bản ghi: ${inlineEditData.name} (${inlineEditData.code})`,
      status: 'pending'
    }, ...prev]);
    setEditingRowId(null);
    setSuccessNotificationMessage('Đã lưu thay đổi thành công!');
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const getNextVersionLabel = () => {
    if (versionHistoryList.length === 0) return 'v1.0';
    const latest = versionHistoryList[0].version;
    const match = latest.match(/v(\d+)\.(\d+)/);
    if (!match) return 'v1.0';
    return `v${match[1]}.${parseInt(match[2]) + 1}`;
  };

  const handleSaveInlineAdd = () => {
    if (!inlineAddData.code.trim() || !inlineAddData.name.trim()) {
      toast.error('Mã và Tên giá trị không được để trống');
      return;
    }
    const newId = (categories.length + 1).toString();
    const currentDate = new Date().toLocaleDateString('vi-VN');
    const newCat: Category = {
      id: newId,
      code: inlineAddData.code,
      name: inlineAddData.name,
      description: inlineAddData.description,
      type: 'standard',
      status: 'draft' as const,
      dataStatus: 'new' as const,
      createdDate: currentDate,
      createdBy: 'Nguyễn Văn A',
      updatedDate: currentDate,
      updatedBy: 'Nguyễn Văn A',
      version: 1,
      fields: []
    };
    setCategories(prev => [...prev, newCat]);
    setVersionHistoryList(prev => [{
      version: getNextVersionLabel(),
      date: currentDate,
      effectiveDate: '',
      user: 'Nguyễn Văn A',
      changes: `Thêm bản ghi: ${inlineAddData.name} (${inlineAddData.code})`,
      status: 'pending'
    }, ...prev]);
    setAddingRow(false);
    setSuccessNotificationMessage('Đã thêm bản ghi mới thành công!');
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };
  const [editedCategoryData, setEditedCategoryData] = useState({
    code: '',
    name: '',
    type: 'standard' as 'standard' | 'reference' | 'system',
    status: 'published' as 'pending' | 'approved' | 'published' | 'unpublished' | 'active' | 'inactive',
    description: '',
    approver: ''
  });
  const [archiveRequestData, setArchiveRequestData] = useState({ reason: '', approver: '' });
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [newFieldData, setNewFieldData] = useState({
    name: '',
    dataType: 'TEXT',
    required: false,
    defaultValue: '',
    maxLength: 255,
    description: '',
    isPrimaryKey: false,
    isForeignKey: false,
    referenceTable: '',
    referenceField: ''
  });

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Approval filters
  const [activeApprovalTab, setActiveApprovalTab] = useState<'data-change' | 'unpublish'>('data-change');
  const [approvalStatusFilter, setApprovalStatusFilter] = useState('all');
  const [approvalRequestFilter, setApprovalRequestFilter] = useState('all');

  // Bulk approval states
  const [selectedApprovalIds, setSelectedApprovalIds] = useState<number[]>([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [pendingApprovalIds, setPendingApprovalIds] = useState<number[]>([]);

  // Version Popups States
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showVersionDetailModal, setShowVersionDetailModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedVersionData, setSelectedVersionData] = useState<any>(null);
  // Category detail modal (view-only) for version-history tab
  const [showCategoryInfoModal, setShowCategoryInfoModal] = useState(false);
  // Entity dựng từ danh mục đang biên tập để truyền vào CategoryInfoViewModal (chế độ chỉ xem)
  const activeVersionNumber = (() => {
    const active = versionHistoryList.find(v => v.status === 'active');
    const label = active?.version ?? versionHistoryList[0]?.version;
    const m = label?.match(/v(\d+)/);
    return m ? parseInt(m[1]) : 1;
  })();
  const currentCategoryEntity: MasterDataEntity = {
    id: categoryId,
    code: categoryId,
    name: categoryName,
    dataType: 'standard',
    managingAgency: 'Bộ Tư pháp',
    scope: 'national',
    description: '',
    lifecycleStatus: 'active',
    createdDate: '',
    updatedDate: '',
    createdBy: '',
    databaseSystem: 'Hệ thống DLDC',
    canCu: '',
    dataSource: 'manual',
    version: activeVersionNumber,
  };
  // Mock: số API đang khai thác danh mục này, cảnh báo khi hủy công khai
  const exploitingApiCount = 5;
  // Mock thuộc tính + quan hệ để xem chi tiết danh mục (chế độ chỉ xem) tại tab Phiên bản
  const currentCategoryAttributes = [
    { fieldName: 'ma_gt', displayName: 'Mã giới tính', dataType: 'Chuỗi', isPK: true },
    { fieldName: 'ten_gt', displayName: 'Tên giới tính', dataType: 'Chuỗi' },
    { fieldName: 'mo_ta', displayName: 'Ghi chú', dataType: 'Chuỗi' },
  ];
  const currentCategoryRelationships = [
    { sourceEntityName: categoryName, targetEntityName: 'Danh mục mối quan hệ gia đình', relationshipType: '1-n', foreignKey: 'gioitinh_id' },
  ];

  // Mock approvers list
  const approvers = [
    { id: 'approver1', name: 'Hoàng Văn E', role: 'Trưởng phòng Công nghệ thông tin' },
    { id: 'approver2', name: 'Nguyễn Thị F', role: 'Phó phòng CNTT' },
    { id: 'approver3', name: 'Trần Văn G', role: 'Trưởng phòng Pháp chế' },
    { id: 'approver4', name: 'Lê Thị H', role: 'Giám đốc Sở Tư pháp' },
    { id: 'approver5', name: 'Phạm Văn I', role: 'Chuyên viên cao cấp' }
  ];

  // Nhãn hiển thị cho từng trường dữ liệu khi lên diff "Chi tiết thay đổi"
  const FIELD_LABELS: Record<'code' | 'name' | 'description', string> = {
    code: 'Mã',
    name: 'Tên giá trị',
    description: 'Mô tả',
  };

  // Dựng diff từng trường theo Trạng thái dữ liệu của bản ghi (Thêm mới/Chỉnh sửa/Ngừng hiệu lực)
  const buildRecordChanges = (c: Category): Record<string, { old: string; new: string }> => {
    const changes: Record<string, { old: string; new: string }> = {};

    if (c.dataStatus === 'inactive') {
      changes['Trạng thái áp dụng'] = { old: 'Đang áp dụng', new: 'Ngừng áp dụng' };
      return changes;
    }

    if (c.dataStatus === 'new') {
      changes[FIELD_LABELS.code] = { old: '—', new: c.code };
      changes[FIELD_LABELS.name] = { old: '—', new: c.name };
      changes[FIELD_LABELS.description] = { old: '—', new: c.description || '—' };
      return changes;
    }

    // dataStatus === 'edited' (hoặc mặc định) — chỉ liệt kê đúng các trường thực sự thay đổi
    const prev = c.previousValues || {};
    (Object.keys(FIELD_LABELS) as Array<keyof typeof FIELD_LABELS>).forEach((key) => {
      if (prev[key] !== undefined) {
        changes[FIELD_LABELS[key]] = { old: prev[key] || '—', new: c[key] || '—' };
      }
    });

    if (Object.keys(changes).length === 0) {
      // Không có snapshot giá trị cũ (bản ghi mock chưa qua chỉnh sửa) — hiển thị fallback
      changes['Thông tin chung'] = { old: '—', new: c.name };
    }

    return changes;
  };

  // Mock approval data - Value change requests
  const approvalRequests = categories.map(c => {
    let requestStatus = 'approved';
    if (c.status === 'pending') requestStatus = 'pending';
    else if (c.status === 'rejected') requestStatus = 'rejected';

    const changes = buildRecordChanges(c);
    const changedFields = Object.keys(changes);

    return {
      id: Number(c.id),
      recordCode: c.code,
      recordName: c.name,
      description: c.description,
      dataStatus: c.dataStatus,
      changedFields,
      changes,
      createdBy: c.createdBy || 'Hệ thống',
      createdDate: c.createdDate || '15/01/2026',
      changedBy: c.updatedBy || c.createdBy || 'Nguyễn Văn A',
      changedDate: c.updatedDate || c.createdDate || '15/01/2026',
      approvedDate: c.status === 'approved' ? (c.updatedDate || '15/01/2026') : null,
      approvedBy: c.status === 'approved' ? 'Hoàng Văn E' : null,
      status: requestStatus
    };
  });

  // Mock approval data - Unpublish requests
  const unpublishRequests = [
    {
      id: 1,
      categoryCode: 'VN01',
      categoryName: 'Hà Nội',
      reason: 'Danh mục đã hết hạn áp dụng theo TT mới',
      requestedBy: 'Nguyễn Văn A',
      requestedDate: '28/05/2026 14:30',
      approvedDate: null,
      approvedBy: null,
      status: 'pending'
    },
    {
      id: 2,
      categoryCode: 'VN02',
      categoryName: 'Hồ Chí Minh',
      reason: 'Cần cập nhật cấu trúc lớn',
      requestedBy: 'Trần Thị B',
      requestedDate: '25/05/2026 10:15',
      approvedDate: '26/05/2026 09:00',
      approvedBy: 'Lãnh đạo Quản trị',
      status: 'approved'
    }
  ];

  const currentRequests = activeApprovalTab === 'data-change' ? approvalRequests : unpublishRequests;

  const approvalStats = {
    pending: currentRequests.filter(r => r.status === 'pending').length,
    approved: currentRequests.filter(r => r.status === 'approved').length,
    rejected: currentRequests.filter(r => r.status === 'rejected').length,
    total: currentRequests.length
  };

  const filteredApprovalRequests = approvalRequests.filter(req => {
    const matchesStatus = approvalStatusFilter === 'all' || req.status === approvalStatusFilter;
    const q = normalizeSearch(searchTerm);
    const matchesSearch = q === '' ||
      normalizeSearch(req.recordCode).includes(q) ||
      normalizeSearch(req.recordName).includes(q);
    return matchesStatus && matchesSearch;
  });

  const filteredUnpublishRequests = unpublishRequests.filter(req => {
    const matchesStatus = approvalStatusFilter === 'all' || req.status === approvalStatusFilter;
    const q = normalizeSearch(searchTerm);
    const matchesSearch = q === '' ||
      normalizeSearch(req.categoryCode).includes(q) ||
      normalizeSearch(req.categoryName).includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleViewApprovalDetail = (request: any) => {
    setSelectedApprovalRequest(request);
    setShowApprovalDetailModal(true);
  };

  const handleApprove = (requestId: number) => {
    // Open approval modal for single request
    setPendingApprovalIds([requestId]);
    setApprovalComment('');
    setShowApprovalModal(true);
  };

  const handleReject = (requestId: number) => {
    // Open reject modal for single request
    setPendingApprovalIds([requestId]);
    setApprovalComment('');
    setShowRejectModal(true);
  };

  const handleBulkApprove = () => {
    if (selectedApprovalIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một yêu cầu để phê duyệt');
      return;
    }
    setPendingApprovalIds(selectedApprovalIds);
    setApprovalComment('');
    setShowApprovalModal(true);
  };

  const handleBulkReject = () => {
    if (selectedApprovalIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một yêu cầu để từ chối');
      return;
    }
    setPendingApprovalIds(selectedApprovalIds);
    setApprovalComment('');
    setShowRejectModal(true);
  };

  const confirmApproval = () => {
    // In production, this would call an API
    console.log('Phê duyệt:', pendingApprovalIds, 'Nội dung:', approvalComment);
    
    // Sync with categories status
    setCategories(prev =>
      prev.map(c =>
        pendingApprovalIds.includes(Number(c.id)) ? { ...c, status: 'approved', approvalNote: approvalComment.trim() || undefined, rejectReason: undefined, updatedDate: new Date().toLocaleDateString('vi-VN'), updatedBy: 'Hoàng Văn E' } : c
      )
    );

    setShowApprovalModal(false);
    setSelectedApprovalIds([]);
    setApprovalComment('');
    setPendingApprovalIds([]);
    setSuccessNotificationMessage(
      `Đã phê duyệt thành công ${pendingApprovalIds.length} yêu cầu`
    );
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const confirmReject = () => {
    if (!approvalComment.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    // In production, this would call an API
    console.log('Từ chối:', pendingApprovalIds, 'Lý do:', approvalComment);
    
    // Sync with categories status
    setCategories(prev =>
      prev.map(c =>
        pendingApprovalIds.includes(Number(c.id)) ? { ...c, status: 'rejected', rejectReason: approvalComment.trim(), approvalNote: undefined, updatedDate: new Date().toLocaleDateString('vi-VN'), updatedBy: 'Nguyễn Văn A' } : c
      )
    );

    setShowRejectModal(false);
    setSelectedApprovalIds([]);
    setApprovalComment('');
    setPendingApprovalIds([]);
    setSuccessNotificationMessage(
      `Đã từ chối ${pendingApprovalIds.length} yêu cầu`
    );
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const toggleSelectApproval = (id: number) => {
    setSelectedApprovalIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllApprovals = () => {
    const pendingRequests = filteredApprovalRequests.filter(r => r.status === 'pending');
    if (selectedApprovalIds.length === pendingRequests.length) {
      setSelectedApprovalIds([]);
    } else {
      setSelectedApprovalIds(pendingRequests.map(r => r.id));
    }
  };

  const getRequestTypeBadge = (type: string) => {
    switch (type) {
      case 'create':
        return <Badge label="Tạo mới" variant="blue" />;
      case 'edit-version':
        return <Badge label="Phê duyệt phiên bản" variant="purple" />;
      case 'edit-structure':
        return <Badge label="Phê duyệt cấu trúc" variant="purple" />;
      case 'edit-effective':
        return <Badge label="Phê duyệt hiệu hiệu lực" variant="orange" />;
      default:
        return null;
    }
  };

  const stats = {
    total: categories.length,
    published: categories.filter(c => c.status === 'active' || c.status === 'published').length,
    standard: categories.filter(c => c.type === 'standard').length,
    reference: categories.filter(c => c.type === 'reference').length
  };

  const filteredCategories = categories.filter(cat => {

    // Dynamic filter conditions (đã áp dụng)
    const filterConditions = appliedFilterConditions;
    if (filterConditions.length === 0) return true;

    const getFieldValue = (c: typeof cat, field: string): string => {
      switch (field) {
        case 'code': return c.code;
        case 'name': return c.name;
        case 'description': return c.description;
        case 'status': return c.status === 'active' ? 'published' : (c.status === 'inactive' ? 'unpublished' : c.status);
        case 'createdDate': return c.createdDate;
        case 'createdBy': return c.createdBy || '';
        case 'updatedDate': return c.updatedDate || '';
        case 'updatedBy': return c.updatedBy || '';
        default: return '';
      }
    };

    const evaluateCondition = (fc: FilterCondition): boolean => {
      const val = getFieldValue(cat, fc.field).toLowerCase();
      const fval = fc.value.toLowerCase();
      switch (fc.operator) {
        case '=':    return val === fval;
        case '!=':   return val !== fval;
        case 'LIKE': return val.includes(fval);
        case '>':    return val > fval;
        case '<':    return val < fval;
        default:     return true;
      }
    };

    // Evaluate all conditions with AND/OR logic
    let result = evaluateCondition(filterConditions[0]);
    for (let i = 1; i < filterConditions.length; i++) {
      const fc = filterConditions[i];
      if (fc.logic === 'AND') result = result && evaluateCondition(fc);
      else result = result || evaluateCondition(fc);
    }
    return result;
  }).sort((a, b) => {
    // If custom sortConditions are set, apply them in order
    if (sortConditions.length > 0) {
      for (const sc of sortConditions) {
        let cmp = 0;
        if (sc.field === 'name') cmp = a.name.localeCompare(b.name);
        else if (sc.field === 'code') cmp = a.code.localeCompare(b.code);
        else if (sc.field === 'createdDate') {
          const dA = new Date(a.createdDate.split('/').reverse().join('-')).getTime();
          const dB = new Date(b.createdDate.split('/').reverse().join('-')).getTime();
          cmp = dA - dB;
        } else if (sc.field === 'updatedDate') {
          const dA = new Date((a.updatedDate || a.createdDate).split('/').reverse().join('-')).getTime();
          const dB = new Date((b.updatedDate || b.createdDate).split('/').reverse().join('-')).getTime();
          cmp = dA - dB;
        }
        if (cmp !== 0) return sc.order === 'ASC' ? cmp : -cmp;
      }
      return 0;
    }
    // Fallback to old sortBy logic
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    const dateA = new Date(a.createdDate.split('/').reverse().join('-')).getTime();
    const dateB = new Date(b.createdDate.split('/').reverse().join('-')).getTime();
    if (sortBy === 'oldest') return dateA - dateB;
    return dateB - dateA;
  });

  const paginatedCategories = filteredCategories.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  // Phân trang chuẩn (compomennt.md 5.14) — nối vào state currentPageNum/pageSize sẵn có
  const renderPagination = (totalCount: number) => {
    return (
      <Pagination
        className="border-t border-[#E2E8F0]"
        currentPage={currentPageNum}
        totalItems={totalCount}
        pageSize={pageSize}
        pageSizeOptions={[10, 20, 50]}
        onPageChange={setCurrentPageNum}
        onPageSizeChange={(size) => { setPageSize(size); setCurrentPageNum(1); }}
      />
    );
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'standard':
        return <Badge label="Tiêu chuẩn" variant="blue" />;
      case 'reference':
        return <Badge label="Tham chiếu" variant="purple" />;
      case 'system':
        return <Badge label="Hệ thống" variant="orange" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge label="Bản nháp" variant="slate" />;
      case 'pending':
        return <Badge label="Chờ duyệt" variant="orange" />;
      case 'approved':
      case 'active':
      case 'published':
        return <Badge label="Đã phê duyệt" variant="green" />;
      case 'rejected':
        return <Badge label="Từ chối" variant="red" />;
      case 'inactive':
        return <Badge label="Ngừng áp dụng" variant="slate" />;
      case 'unpublished':
        return <Badge label="Hủy công khai" variant="slate" />;
      default:
        return null;
    }
  };

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge label="Chờ phê duyệt" variant="amber" />;
      case 'approved':
        return <Badge label="Đã phê duyệt" variant="green" />;
      case 'rejected':
        return <Badge label="Từ chối" variant="red" />;
      default:
        return null;
    }
  };

  // ─── Tab "Dữ liệu": 2 cột trạng thái riêng biệt ───────────────────────────
  // Trạng thái dữ liệu: loại thay đổi gần nhất áp dụng cho bản ghi
  const getDataStatusBadge = (dataStatus?: Category['dataStatus']) => {
    switch (dataStatus) {
      case 'edited':
        return <Badge label="Chỉnh sửa" variant="blue" />;
      case 'inactive':
        return <Badge label="Ngừng hiệu lực" variant="slate" />;
      default:
        return <Badge label="Thêm mới" variant="emerald" />;
    }
  };

  // Trạng thái duyệt: tiến trình phê duyệt của bản ghi (độc lập với trạng thái dữ liệu)
  const getRecordApprovalBadge = (status: Category['status']) => {
    switch (status) {
      case 'draft':
        return <Badge label="Chưa duyệt" variant="slate" />;
      case 'pending':
        return <Badge label="Chờ duyệt" variant="orange" />;
      case 'rejected':
        return <Badge label="Từ chối" variant="red" />;
      default:
        // approved/active/published/unpublished/inactive — coi như đã xử lý xong vòng duyệt gần nhất
        return <Badge label="Đã duyệt" variant="green" />;
    }
  };
  // Chỉ hiển thị ô check "gửi duyệt" khi bản ghi ở trạng thái Chưa duyệt (draft)
  const canSendForApproval = (status: Category['status']) => status === 'draft';

  // Handle Excel file import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setImportErrors([]);

    // Read and parse Excel file
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = event.target?.result;
        if (!data) return;

        // Simple CSV parsing (for demo - in production use a library like xlsx)
        const text = new TextDecoder().decode(data as ArrayBuffer);
        const rows = text.split('\n').map(row => row.split(','));

        // Skip header row and parse data
        const parsedData = rows.slice(1).filter(row => row.length >= 4).map((row, index) => ({
          id: `import-${index}`,
          code: row[0]?.trim() || '',
          name: row[1]?.trim() || '',
          description: row[2]?.trim() || '',
          type: (row[3]?.trim().toLowerCase() === 'tiêu chuẩn' ? 'standard' :
            row[3]?.trim().toLowerCase() === 'tham chiếu' ? 'reference' : 'system') as 'standard' | 'reference' | 'system',
          status: 'active' as 'active' | 'inactive',
          createdDate: new Date().toLocaleDateString('vi-VN'),
          fields: []
        }));

        // Validate data
        const errors: string[] = [];
        parsedData.forEach((item, index) => {
          if (!item.code) errors.push(`Dòng ${index + 2}: Thiếu mã danh mục`);
          if (!item.name) errors.push(`Dòng ${index + 2}: Thiếu tên danh mục`);
        });

        setImportErrors(errors);
        setImportPreviewData(parsedData);
      } catch (error) {
        setImportErrors(['Lỗi khi đọc file. Vui lòng kiểm tra định dạng file.']);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImportConfirm = () => {
    if (importErrors.length > 0) {
      toast.error('Vui lòng sửa các lỗi trước khi nhập dữ liệu');
      return;
    }

    // Add imported data to categories
    setCategories([...categories, ...importPreviewData]);

    // Reset and close modal
    setShowImportModal(false);
    setImportFile(null);
    setImportPreviewData([]);
    setImportErrors([]);

    // Show success notification
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const handleCancelImport = () => {
    setShowImportModal(false);
    setImportFile(null);
    setImportPreviewData([]);
    setImportErrors([]);
  };

  const isAnyModalOpen = !!(
    showArchiveModal || showAddModal || showEditModal || showDetailModal ||
    showAddFieldModal || showCreateVersionModal || showFieldFormModal ||
    showImportModal || showApprovalDetailModal || showApprovalRequestModal ||
    showApprovalModal || showRejectModal || showCompareModal ||
    showVersionDetailModal || showRestoreModal ||
    showPublishModal || showUnpublishModal
  );

  // Màu dòng: dòng đang chọn tô nền #EAF3FF, cột thao tác sticky đồng màu với dòng
  const rowCls = (selected: boolean) =>
    `group h-12 border-b border-[#E0E0E0] transition-colors ${selected ? 'bg-[#EAF3FF]' : 'bg-white hover:bg-[#F8FAFC]'}`;
  const stickyTdCls = (selected: boolean) =>
    `sticky right-0 shadow-[-1px_0_0_#E2E8F0] ${selected ? 'bg-[#EAF3FF]' : 'bg-white group-hover:bg-[#F8FAFC]'}`;
  const INLINE_INPUT = `${INPUT_CLS} !h-8`;

  const approvalStatCards = [
    { label: 'Chờ phê duyệt', value: approvalStats.pending, icon: Clock, bg: 'bg-orange-50', fg: 'text-orange-600' },
    { label: 'Đã phê duyệt', value: approvalStats.approved, icon: CheckCircle2, bg: 'bg-green-50', fg: 'text-green-600' },
    { label: 'Đã từ chối', value: approvalStats.rejected, icon: XCircle, bg: 'bg-red-50', fg: 'text-red-600' },
    { label: 'Tổng yêu cầu', value: approvalStats.total, icon: Edit2, bg: 'bg-blue-50', fg: 'text-blue-600' },
  ];

  const publishTone = publishStatus === 'published'
    ? { box: 'bg-[#F0FDF4] border-[#DCFCE7]', icon: 'text-[#16A34A]' }
    : publishStatus === 'stopped'
    ? { box: 'bg-[#FEF2F2] border-[#FEE2E2]', icon: 'text-[#DC2626]' }
    : { box: 'bg-[#F8FAFC] border-[#E2E8F0]', icon: 'text-[#64748B]' };

  const closeIconBtn = (onClick: () => void, label = 'Đóng') => (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={BTN_GHOST_ICON}>
      <X className="w-5 h-5" />
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Tab bar (compomennt.md 5.9) — ẩn khi xem chỉ đọc (chỉ hiện dữ liệu) */}
      {!readOnly && (
        <div className="flex items-center border-b border-[#E2E8F0]">
          {[
            { id: 'setup' as const,           label: 'Dữ liệu',   icon: List },
            { id: 'approval' as const,         label: 'Phê duyệt', icon: CheckCircle2 },
            { id: 'publish' as const,          label: 'Công khai',  icon: Globe },
            { id: 'version-history' as const,  label: 'Phiên bản',  icon: Clock },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={tabClass(activeTab === tab.id)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      <div>
          {activeTab === 'setup' && (
            <div className="space-y-4">

              {/* Search & Action Bar (compomennt.md 5.19) */}
              <div>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {/* Cập nhật (làm mới dữ liệu) */}
                    <button
                      type="button"
                      aria-label="Cập nhật"
                      title="Cập nhật"
                      onClick={handleRefreshData}
                      className={ICON_OUTLINE_40}
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    {/* Lọc */}
                    <button
                      type="button"
                      aria-expanded={showFilters}
                      onClick={() => { setShowFilters(!showFilters); setShowSortPanel(false); }}
                      className={`${showFilters ? CHIP_ACTIVE : BTN_OUTLINE} shrink-0`}
                    >
                      <Filter className="w-4 h-4" />
                      Lọc{appliedFilterConditions.length > 0 && !showFilters ? <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> : null}
                    </button>
                    {/* Sắp xếp */}
                    <button
                      type="button"
                      aria-pressed={showSortPanel}
                      onClick={() => { setShowSortPanel(!showSortPanel); setShowFilters(false); }}
                      className={`${showSortPanel ? CHIP_ACTIVE : BTN_OUTLINE} shrink-0`}
                    >
                      <ArrowUpDown className="w-4 h-4" />
                      Sắp xếp{sortConditions.length > 0 && !showSortPanel ? <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> : null}
                    </button>
                  </div>
                  {!readOnly && (
                    <div className="flex items-center gap-1.5">
                      {/* Gửi duyệt phiên bản */}
                      <button
                        type="button"
                        onClick={() => selectedRecordIds.length > 0 && setShowApprovalRequestModal(true)}
                        disabled={selectedRecordIds.length === 0}
                        className={`${BTN_OUTLINE} whitespace-nowrap`}
                      >
                        <Send className="w-4 h-4" />
                        Gửi duyệt
                      </button>
                      {/* Thêm bản ghi mới */}
                      <button
                        type="button"
                        onClick={() => { setEditingRecord(null); setShowAddModal(true); }}
                        className={`${BTN_PRIMARY} whitespace-nowrap`}
                      >
                        <Plus className="w-4 h-4" />
                        Thêm bản ghi mới
                      </button>
                    </div>
                  )}
                </div>

                {/* Collapsible Filter Panel — điều kiện chỉ áp dụng khi bấm Tìm kiếm / Enter */}
                {showFilters && (
                  <div className="mt-[15px] p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col gap-2">
                      {filterConditions.map((fc, i) => (
                        <div key={fc.id} className="flex items-center gap-2">
                          {i > 0 && (
                            <select
                              aria-label="Toán tử logic"
                              value={fc.logic}
                              onChange={e => {
                                const updated = [...filterConditions];
                                updated[i] = { ...updated[i], logic: e.target.value as 'AND' | 'OR' };
                                setFilterConditions(updated);
                              }}
                              className={`${INPUT_CLS} !w-24 shrink-0`}
                            >
                              <option value="AND">AND</option>
                              <option value="OR">OR</option>
                            </select>
                          )}
                          <select
                            aria-label="Trường lọc"
                            value={fc.field}
                            onChange={e => {
                              const updated = [...filterConditions];
                              updated[i] = { ...updated[i], field: e.target.value };
                              setFilterConditions(updated);
                            }}
                            className={`${INPUT_CLS} flex-1 ${i === 0 ? 'max-w-xs' : 'max-w-[210px]'}`}
                          >
                            <option value="code">Mã</option>
                            <option value="name">Tên giá trị</option>
                            <option value="description">Mô tả</option>
                            <option value="status">Trạng thái</option>
                            <option value="createdDate">Ngày tạo</option>
                            <option value="createdBy">Người tạo</option>
                            <option value="updatedDate">Ngày cập nhật</option>
                            <option value="updatedBy">Người cập nhật</option>
                          </select>
                          <select
                            aria-label="Phép so sánh"
                            value={fc.operator}
                            onChange={e => {
                              const updated = [...filterConditions];
                              updated[i] = { ...updated[i], operator: e.target.value };
                              setFilterConditions(updated);
                            }}
                            className={`${INPUT_CLS} !w-40 shrink-0`}
                          >
                            <option value="=">Bằng (=)</option>
                            <option value="!=">Khác (!=)</option>
                            <option value="LIKE">Chứa</option>
                            <option value=">">Lớn hơn (&gt;)</option>
                            <option value="<">Nhỏ hơn (&lt;)</option>
                          </select>
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              aria-label="Giá trị lọc"
                              value={fc.value}
                              onChange={e => {
                                const updated = [...filterConditions];
                                updated[i] = { ...updated[i], value: e.target.value };
                                setFilterConditions(updated);
                              }}
                              onKeyDown={(e) => { if (e.key === 'Enter') applyDataFilters(); }}
                              placeholder="&lt;?&gt;"
                              className={INPUT_CLS}
                            />
                          </div>
                          <button
                            type="button"
                            aria-label="Xóa điều kiện"
                            title="Xóa điều kiện"
                            onClick={() => {
                              const newF = filterConditions.filter(item => item.id !== fc.id);
                              setFilterConditions(newF);
                            }}
                            className={`${BTN_GHOST_ICON} !text-[#DC2626] hover:!bg-[#FEF2F2]`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setFilterConditions(prev => [...prev, { id: Date.now().toString(), field: 'code', operator: '=', value: '', logic: 'AND' }])}
                          className={BTN_OUTLINE}
                        >
                          <Plus className="w-4 h-4" /> Thêm điều kiện
                        </button>
                        <button
                          type="button"
                          onClick={() => { setFilterConditions([]); setAppliedFilterConditions([]); setCurrentPageNum(1); }}
                          className={BTN_OUTLINE}
                        >
                          <X className="w-4 h-4" /> Xóa bộ lọc
                        </button>
                        {filterConditions.length > 0 && (
                          <button type="button" onClick={applyDataFilters} className={BTN_PRIMARY}>
                            <CheckCircle className="w-4 h-4" /> Áp dụng bộ lọc
                          </button>
                        )}
                      </div>
                      {filterConditions.length === 0 && (
                        <p className="text-[13px] text-[#64748B]">Chưa có điều kiện lọc. Nhấn "Thêm điều kiện" để bắt đầu.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Sort Panel */}
                {showSortPanel && (
                  <div className="mt-[15px] p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col gap-2">
                      {sortConditions.map((sc, i) => (
                        <div key={sc.id} className="flex items-center gap-2">
                          {i > 0 && (
                            <span className="text-[13px] text-[#64748B] w-8 text-right shrink-0">rồi</span>
                          )}
                          {i === 0 && (
                            <span className="text-[13px] font-medium text-[#475569] w-8 text-right shrink-0">Theo</span>
                          )}
                          <select
                            aria-label="Trường sắp xếp"
                            value={sc.field}
                            onChange={e => {
                              const updated = [...sortConditions];
                              updated[i] = { ...updated[i], field: e.target.value as SortCondition['field'] };
                              setSortConditions(updated);
                            }}
                            className={`${INPUT_CLS} flex-1 max-w-xs`}
                          >
                            <option value="name">Tên giá trị</option>
                            <option value="code">Mã</option>
                            <option value="createdDate">Ngày tạo</option>
                            <option value="updatedDate">Ngày cập nhật</option>
                          </select>
                          <select
                            aria-label="Thứ tự sắp xếp"
                            value={sc.order}
                            onChange={e => {
                              const updated = [...sortConditions];
                              updated[i] = { ...updated[i], order: e.target.value as 'ASC' | 'DESC' };
                              setSortConditions(updated);
                            }}
                            className={`${INPUT_CLS} !w-44 shrink-0`}
                          >
                            <option value="ASC">Tăng dần (A → Z)</option>
                            <option value="DESC">Giảm dần (Z → A)</option>
                          </select>
                          <button
                            type="button"
                            aria-label="Xóa điều kiện"
                            title="Xóa điều kiện"
                            onClick={() => setSortConditions(prev => prev.filter(s => s.id !== sc.id))}
                            className={`${BTN_GHOST_ICON} !text-[#DC2626] hover:!bg-[#FEF2F2]`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setSortConditions(prev => [...prev, { id: Date.now().toString(), field: 'name', order: 'ASC' }])}
                          className={BTN_OUTLINE}
                        >
                          <Plus className="w-4 h-4" /> Thêm điều kiện
                        </button>
                        <button
                          type="button"
                          onClick={() => setSortConditions([])}
                          className={BTN_OUTLINE}
                        >
                          <X className="w-4 h-4" /> Xóa bộ lọc
                        </button>
                      </div>
                      {sortConditions.length === 0 && (
                        <p className="text-[13px] text-[#64748B]">Chưa có điều kiện sắp xếp. Nhấn "Thêm điều kiện" để bắt đầu.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Grid Table + Pagination (compomennt.md 5.3) */}
              <div className={TABLE_WRAP}>
                <div className="overflow-x-auto">
                  <table className={TABLE_CLS}>
                    <thead className="bg-[#F8FAFC]">
                      <tr className="h-[42px]">
                        <th className={`${TH} text-center w-12`}>
                          {!readOnly && (
                            <input
                              type="checkbox"
                              title="Chọn tất cả bản ghi bản nháp"
                              aria-label="Chọn tất cả bản ghi bản nháp"
                              checked={
                                paginatedCategories.filter(c => c.status === 'draft').length > 0 &&
                                paginatedCategories.filter(c => c.status === 'draft').every(c => selectedRecordIds.includes(c.id))
                              }
                              onChange={(e) => {
                                const draftIds = paginatedCategories.filter(c => c.status === 'draft').map(c => c.id);
                                if (e.target.checked) {
                                  setSelectedRecordIds(prev => [...new Set([...prev, ...draftIds])]);
                                } else {
                                  setSelectedRecordIds(prev => prev.filter(id => !draftIds.includes(id)));
                                }
                              }}
                              className={CHECKBOX_CLS}
                            />
                          )}
                        </th>
                        <th className={`${TH} text-center w-14`}>STT</th>
                        <th className={`${TH} text-left`}>Mã</th>
                        <th className={`${TH} text-left`}>Tên giá trị</th>
                        <th className={`${TH} text-left`}>Mô tả</th>
                        <th className={`${TH} text-left`}>Trạng thái dữ liệu</th>
                        <th className={`${TH} text-left`}>Trạng thái duyệt</th>
                        <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCategories.length > 0 || addingRow ? (
                        <>
                          {paginatedCategories.map((category, index) => {
                            const isEditing = editingRowId === category.id;
                            const isSelected = selectedRecordIds.includes(category.id);
                            return (
                              <tr key={category.id} className={rowCls(isSelected)}>
                                <td className={`${TD} text-center`}>
                                  {!readOnly && (category.status === 'draft' ? (
                                    <input
                                      type="checkbox"
                                      title="Chọn bản ghi"
                                      aria-label="Chọn bản ghi"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        if (e.target.checked) setSelectedRecordIds(prev => [...prev, category.id]);
                                        else setSelectedRecordIds(prev => prev.filter(id => id !== category.id));
                                      }}
                                      className={CHECKBOX_CLS}
                                    />
                                  ) : <span className="w-4 h-4 inline-block" />)}
                                </td>
                                <td className={`${TD} text-center`}>{(currentPageNum - 1) * pageSize + index + 1}</td>
                                <td className={`${TD} max-w-[200px]`}>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      title="Mã"
                                      value={inlineEditData.code}
                                      onChange={(e) => setInlineEditData({ ...inlineEditData, code: e.target.value })}
                                      className={INLINE_INPUT}
                                      placeholder="Nhập mã"
                                    />
                                  ) : (
                                    <TruncatedText text={category.code} />
                                  )}
                                </td>
                                <td className={`${TD} max-w-[360px]`}>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      title="Tên giá trị"
                                      value={inlineEditData.name}
                                      onChange={(e) => setInlineEditData({ ...inlineEditData, name: e.target.value })}
                                      className={INLINE_INPUT}
                                      placeholder="Nhập tên giá trị"
                                    />
                                  ) : (
                                    <TruncatedText text={category.name} />
                                  )}
                                </td>
                                <td className={`${TD} max-w-[360px]`}>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      title="Mô tả"
                                      value={inlineEditData.description}
                                      onChange={(e) => setInlineEditData({ ...inlineEditData, description: e.target.value })}
                                      className={INLINE_INPUT}
                                      placeholder="Nhập mô tả"
                                    />
                                  ) : (
                                    <TruncatedText text={category.description} />
                                  )}
                                </td>
                                <td className={TD}>{getDataStatusBadge(category.dataStatus)}</td>
                                <td className={TD}>{getRecordApprovalBadge(category.status)}</td>
                                <td className={`${TD} text-center ${stickyTdCls(isSelected)}`}>
                                  {isEditing ? (
                                    <div className="flex items-center justify-center gap-1">
                                      <RowIconAction label="Lưu" onClick={() => handleSaveInlineEdit(category.id)}>
                                        <Check className="w-4 h-4" />
                                      </RowIconAction>
                                      <RowIconAction label="Hủy" onClick={() => setEditingRowId(null)}>
                                        <X className="w-4 h-4" />
                                      </RowIconAction>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center gap-1">
                                      <RowIconAction label="Xem chi tiết" onClick={() => { setViewingRecordDetail(category); setShowRecordDetailModal(true); }}>
                                        <Eye className="w-4 h-4" />
                                      </RowIconAction>
                                      {!readOnly && (
                                        <>
                                          <RowIconAction label="Chỉnh sửa" onClick={() => { setEditingRecord(category); setShowEditModal(true); }}>
                                            <SquarePen className="w-4 h-4" />
                                          </RowIconAction>
                                          <RowIconAction
                                            label="Ngừng áp dụng bản ghi"
                                            disabledReason={category.status === 'approved' ? undefined : 'Chỉ có thể ngừng áp dụng bản ghi đã phê duyệt'}
                                            onClick={() => { setSelectedCategory(category); setShowArchiveModal(true); }}
                                          >
                                            <PowerOff className="w-4 h-4" />
                                          </RowIconAction>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          {addingRow && (
                            <tr className={rowCls(false)}>
                              <td className={TD} />
                              <td className={`${TD} text-center`}>{(currentPageNum - 1) * pageSize + paginatedCategories.length + 1}</td>
                              <td className={TD}>
                                <input
                                  type="text"
                                  title="Mã"
                                  value={inlineAddData.code}
                                  onChange={(e) => setInlineAddData({ ...inlineAddData, code: e.target.value })}
                                  className={INLINE_INPUT}
                                  placeholder="Mã *"
                                />
                              </td>
                              <td className={TD}>
                                <input
                                  type="text"
                                  title="Tên giá trị"
                                  value={inlineAddData.name}
                                  onChange={(e) => setInlineAddData({ ...inlineAddData, name: e.target.value })}
                                  className={INLINE_INPUT}
                                  placeholder="Tên giá trị *"
                                />
                              </td>
                              <td className={TD}>
                                <input
                                  type="text"
                                  title="Mô tả"
                                  value={inlineAddData.description}
                                  onChange={(e) => setInlineAddData({ ...inlineAddData, description: e.target.value })}
                                  className={INLINE_INPUT}
                                  placeholder="Mô tả"
                                />
                              </td>
                              <td className={TD}><Badge label="Thêm mới" variant="emerald" /></td>
                              <td className={TD}><Badge label="Chưa duyệt" variant="slate" /></td>
                              <td className={`${TD} text-center ${stickyTdCls(false)}`}>
                                <div className="flex items-center justify-center gap-1">
                                  <RowIconAction label="Lưu" onClick={handleSaveInlineAdd}>
                                    <Check className="w-4 h-4" />
                                  </RowIconAction>
                                  <RowIconAction label="Hủy" onClick={() => setAddingRow(false)}>
                                    <X className="w-4 h-4" />
                                  </RowIconAction>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={8} className={EMPTY_TD}>Không tìm thấy dữ liệu</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {renderPagination(filteredCategories.length)}
              </div>
            </div>
          )}

          {activeTab === 'approval' && (
            <div className="space-y-4">

              {activeApprovalTab === 'data-change' && (
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#020817]">Phê duyệt danh mục cập nhật</h3>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Quản lý các yêu cầu phê duyệt cập nhật danh mục</p>
                  </div>
                  {selectedApprovalIds.length > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-[#475569]">
                        Đã chọn: <span className="font-medium text-blue-600">{selectedApprovalIds.length}</span> yêu cầu
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
              )}

              {/* Stats Cards (compomennt.md 5.6.1) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {approvalStatCards.map(card => (
                  <div key={card.label} className={STAT_CARD}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${card.bg}`}>
                        <card.icon className={`w-5 h-5 ${card.fg}`} />
                      </div>
                      <div>
                        <div className="text-[16px] text-[#64748B]">{card.label}</div>
                        <div className="text-[16px] font-semibold text-[#0F172A]">{card.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {activeApprovalTab === 'data-change' && (
                <>
                  {/* Filters (compomennt.md 5.19) */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 flex items-center gap-1.5">
                      <input
                        type="text"
                        title="Tìm kiếm bản ghi phê duyệt"
                        aria-label="Tìm kiếm bản ghi phê duyệt"
                        placeholder="Tìm kiếm theo mã, tên bản ghi..."
                        value={searchInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
                        className={SEARCH_INPUT_CLS}
                      />
                      <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { value: 'all', label: 'Tất cả' },
                        { value: 'pending', label: 'Chờ phê duyệt' },
                        { value: 'approved', label: 'Đã phê duyệt' },
                        { value: 'rejected', label: 'Đã từ chối' },
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

                  {/* Table */}
                  <div className={TABLE_WRAP}>
                    <div className="overflow-x-auto">
                      <table className={TABLE_CLS}>
                        <thead className="bg-[#F8FAFC]">
                          <tr className="h-[42px]">
                            <th className={`${TH} text-center w-12`}>
                              <input
                                type="checkbox"
                                title="Chọn tất cả"
                                aria-label="Chọn tất cả"
                                checked={selectedApprovalIds.length === filteredApprovalRequests.filter(r => r.status === 'pending').length && filteredApprovalRequests.filter(r => r.status === 'pending').length > 0}
                                onChange={toggleSelectAllApprovals}
                                className={CHECKBOX_CLS}
                              />
                            </th>
                            <th className={`${TH} text-center w-14`}>STT</th>
                            <th className={`${TH} text-left`}>Mã bản ghi</th>
                            <th className={`${TH} text-left`}>Tên bản ghi</th>
                            <th className={`${TH} text-left`}>Mô tả</th>
                            <th className={`${TH} text-left`}>Trạng thái dữ liệu</th>
                            <th className={`${TH} text-left`}>Trạng thái</th>
                            <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredApprovalRequests.map((request, index) => {
                            const isPending = request.status === 'pending';
                            const isSelected = selectedApprovalIds.includes(request.id);
                            return (
                              <tr key={request.id} className={rowCls(isSelected)}>
                                <td className={`${TD} text-center`}>
                                  {isPending && (
                                    <input
                                      type="checkbox"
                                      title="Chọn bản ghi"
                                      aria-label="Chọn bản ghi"
                                      checked={isSelected}
                                      onChange={() => toggleSelectApproval(request.id)}
                                      className={CHECKBOX_CLS}
                                    />
                                  )}
                                </td>
                                <td className={`${TD} text-center`}>{index + 1}</td>
                                <td className={`${TD} max-w-[200px]`}><TruncatedText text={request.recordCode} /></td>
                                <td className={`${TD} max-w-[360px]`}><TruncatedText text={request.recordName} /></td>
                                <td className={`${TD} max-w-[360px]`}><TruncatedText text={request.description || '—'} /></td>
                                <td className={TD}>{getDataStatusBadge(request.dataStatus)}</td>
                                <td className={TD}>{getApprovalStatusBadge(request.status)}</td>
                                <td className={`${TD} text-center ${stickyTdCls(isSelected)}`}>
                                  <div className="flex items-center justify-center gap-1">
                                    <RowIconAction label="Xem chi tiết" onClick={() => handleViewApprovalDetail(request)}>
                                      <Eye className="w-4 h-4" />
                                    </RowIconAction>
                                    <RowIconAction
                                      label="Phê duyệt"
                                      disabledReason={isPending ? undefined : 'Đã xử lý'}
                                      onClick={() => { if (isPending) handleApprove(request.id); }}
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                    </RowIconAction>
                                    <RowIconAction
                                      label="Từ chối"
                                      disabledReason={isPending ? undefined : 'Đã xử lý'}
                                      onClick={() => { if (isPending) handleReject(request.id); }}
                                    >
                                      <XCircle className="w-4 h-4" />
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
                </>
              )}

              {activeApprovalTab === 'unpublish' && (
                <>
                  {/* Phê duyệt hủy công khai danh mục */}
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#020817]">Phê duyệt hủy công khai danh mục</h3>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Quản lý các yêu cầu ngừng áp dụng (hủy công khai) danh mục</p>
                  </div>

                  <div className={TABLE_WRAP}>
                    <div className="overflow-x-auto">
                      <table className={TABLE_CLS}>
                        <thead className="bg-[#F8FAFC]">
                          <tr className="h-[42px]">
                            <th className={`${TH} text-center w-12`}>STT</th>
                            <th className={`${TH} text-left`}>Mã danh mục</th>
                            <th className={`${TH} text-left`}>Tên danh mục</th>
                            <th className={`${TH} text-left`}>Lý do hủy</th>
                            <th className={`${TH} text-left`}>Người yêu cầu</th>
                            <th className={`${TH} text-left`}>Thời gian yêu cầu</th>
                            <th className={`${TH} text-left`}>Trạng thái</th>
                            <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUnpublishRequests.map((request, index) => {
                            const [reqDate, ...reqTimeParts] = (request.requestedDate || '').split(' ');
                            const reqTime = reqTimeParts.join(' ');
                            return (
                              <tr key={request.id} className={TR}>
                                <td className={`${TD} text-center`}>{index + 1}</td>
                                <td className={`${TD} max-w-[200px]`}><TruncatedText text={request.categoryCode} /></td>
                                <td className={`${TD} max-w-[360px]`}><TruncatedText text={request.categoryName} /></td>
                                <td className={`${TD} max-w-[360px]`}><TruncatedText text={request.reason} /></td>
                                <td className={`${TD} max-w-[200px]`}><TruncatedText text={request.requestedBy} /></td>
                                <td className={`${TD} whitespace-nowrap leading-[18px]`}>
                                  <div>{reqDate}</div>
                                  {reqTime && <div className="text-[#64748B]">{reqTime}</div>}
                                </td>
                                <td className={TD}>
                                  {request.status === 'pending' && <Badge label="Chờ duyệt" variant="amber" />}
                                  {request.status === 'approved' && <Badge label="Đã duyệt" variant="green" />}
                                  {request.status === 'rejected' && <Badge label="Từ chối" variant="red" />}
                                </td>
                                <td className={`${TD} text-center ${STICKY_TD}`}>
                                  <div className="flex items-center justify-center gap-1">
                                    {request.status === 'pending' && (
                                      <>
                                        <RowIconAction
                                          label="Phê duyệt"
                                          onClick={() => {
                                            setSuccessNotificationMessage('Đã duyệt yêu cầu hủy công khai thành công!');
                                            setShowSuccessNotification(true);
                                            setTimeout(() => setShowSuccessNotification(false), 3000);
                                          }}
                                        >
                                          <CheckCircle2 className="w-4 h-4" />
                                        </RowIconAction>
                                        <RowIconAction label="Từ chối" onClick={() => toast.success('Đã từ chối yêu cầu hủy công khai')}>
                                          <XCircle className="w-4 h-4" />
                                        </RowIconAction>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

      {activeTab === 'publish' && (
        <div className="space-y-4">
          {/* Banner trạng thái công khai */}
          <div className={`p-4 rounded-lg border flex items-center justify-between gap-4 flex-wrap ${publishTone.box}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white">
                {publishStatus === 'published'
                  ? <Globe className={`w-5 h-5 ${publishTone.icon}`} />
                  : <Lock className={`w-5 h-5 ${publishTone.icon}`} />}
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-[#020817]">
                  Trạng thái: {publishStatus === 'published' ? 'ĐÃ CÔNG KHAI' : publishStatus === 'stopped' ? 'NGỪNG CÔNG KHAI' : 'CHƯA CÔNG KHAI'}
                </h4>
                <p className="text-[13px] text-[#475569] mt-0.5">
                  {publishStatus === 'published' && (
                    <>
                      Phạm vi chia sẻ: <strong className="font-medium text-[#020817]">{shareScope === 'internal' ? 'Nội bộ' : shareScope === 'extended' ? 'Mở rộng' : 'Toàn dân'}</strong> | Người thực hiện: <strong className="font-medium text-[#020817]">{publishActionInfo.user}</strong> | Ngày thực hiện: <strong className="font-medium text-[#020817]">{publishActionInfo.date}</strong>
                    </>
                  )}
                  {publishStatus === 'stopped' && (
                    <>
                      Người thực hiện: <strong className="font-medium text-[#020817]">{publishActionInfo.user}</strong> | Ngày thực hiện: <strong className="font-medium text-[#020817]">{publishActionInfo.date}</strong> | Lý do: <span className="text-[#B91C1C]">"{publishActionInfo.reason || '—'}"</span>
                    </>
                  )}
                  {publishStatus === 'unpublished' && (
                    'Danh mục này hiện chưa được công khai ra ngoài hệ thống.'
                  )}
                </p>
              </div>
            </div>
            <div>
              {publishStatus === 'published' ? (
                <button
                  type="button"
                  onClick={() => setShowUnpublishModal(true)}
                  className={`${BTN_OUTLINE} !text-[#DC2626] hover:!bg-[#FEF2F2]`}
                >
                  <XCircle className="w-4 h-4" />
                  Hủy công khai
                </button>
              ) : (
                <button type="button" onClick={() => setShowPublishModal(true)} className={BTN_PRIMARY}>
                  <Globe className="w-4 h-4" />
                  Công khai
                </button>
              )}
            </div>
          </div>

          {/* Tiêu đề phần danh sách */}
          <div>
            <h3 className="text-[16px] font-semibold text-[#020817]">Các trường dữ liệu của danh mục</h3>
            <p className="text-[13px] text-[#64748B] mt-0.5">Danh sách giá trị dữ liệu hiện có trong danh mục hệ thống</p>
          </div>

          {/* Table hiển thị dữ liệu không cần cột thao tác */}
          <div className={TABLE_WRAP}>
            <div className="overflow-x-auto">
              <table className={TABLE_CLS}>
                <thead className="bg-[#F8FAFC]">
                  <tr className="h-[42px]">
                    <th className={`${TH} text-center w-14`}>STT</th>
                    <th className={`${TH} text-left`}>Mã</th>
                    <th className={`${TH} text-left`}>Tên giá trị</th>
                    <th className={`${TH} text-left`}>Mô tả</th>
                    <th className={`${TH} text-left`}>Trạng thái</th>
                    <th className={`${TH} text-left`}>Ngày tạo</th>
                    <th className={`${TH} text-left`}>Người tạo</th>
                    <th className={`${TH} text-left`}>Ngày cập nhật</th>
                    <th className={`${TH} text-left`}>Người cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, idx) => (
                    <tr key={cat.id} className={TR}>
                      <td className={`${TD} text-center`}>{idx + 1}</td>
                      <td className={`${TD} max-w-[200px]`}><TruncatedText text={cat.code} /></td>
                      <td className={`${TD} max-w-[360px]`}><TruncatedText text={cat.name} /></td>
                      <td className={`${TD} max-w-[360px]`}><TruncatedText text={cat.description || '—'} /></td>
                      <td className={TD}>{getStatusBadge(cat.status)}</td>
                      <td className={`${TD} whitespace-nowrap`}>{cat.createdDate}</td>
                      <td className={`${TD} max-w-[200px]`}><TruncatedText text={cat.createdBy || '—'} /></td>
                      <td className={`${TD} whitespace-nowrap`}>{cat.updatedDate || '—'}</td>
                      <td className={`${TD} max-w-[200px]`}><TruncatedText text={cat.updatedBy || '—'} /></td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={9} className={EMPTY_TD}>Không tìm thấy dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'version-history' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-[16px] font-semibold text-[#020817]">Danh sách phiên bản</h3>
            <p className="text-[13px] text-[#64748B] mt-0.5">Quản lý, tra cứu và đóng băng các phiên bản của danh mục hệ thống</p>
          </div>
          {/* Version History Table */}
          <div className={TABLE_WRAP}>
            <div className="overflow-x-auto">
              <table className={TABLE_CLS}>
                <thead className="bg-[#F8FAFC]">
                  <tr className="h-[42px]">
                    <th className={`${TH} text-left`}>Phiên bản</th>
                    <th className={`${TH} text-left`}>Ngày thay đổi</th>
                    <th className={`${TH} text-left`}>Ngày hiệu lực</th>
                    <th className={`${TH} text-left`}>Người thay đổi</th>
                    <th className={`${TH} text-left`}>Nội dung thay đổi</th>
                    <th className={`${TH} text-left`}>Trạng thái</th>
                    <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {versionHistoryList.map((history, index) => (
                    <tr key={index} className={TR}>
                      <td className={`${TD} whitespace-nowrap`}>{history.version}</td>
                      <td className={`${TD} whitespace-nowrap`}>{history.date}</td>
                      <td className={`${TD} whitespace-nowrap`}>{history.effectiveDate}</td>
                      <td className={`${TD} max-w-[200px]`}><TruncatedText text={history.user} /></td>
                      <td className={`${TD} max-w-[360px]`}><TruncatedText text={history.changes} /></td>
                      <td className={TD}>
                        {history.status === 'active'
                          ? <Badge label="Hiệu lực" variant="green" />
                          : <Badge label="Lưu trữ" variant="slate" />}
                      </td>
                      <td className={`${TD} text-center ${STICKY_TD}`}>
                        <div className="flex items-center justify-center gap-1">
                          {/* 1. Xem chi tiết */}
                          <RowIconAction label="Xem chi tiết" onClick={() => setShowCategoryInfoModal(true)}>
                            <Eye className="w-4 h-4" />
                          </RowIconAction>

                          {/* 2. Khóa / Mở khóa */}
                          {history.status === 'locked' ? (
                            <RowIconAction
                              label="Mở tham chiếu"
                              onClick={() => setVersionHistoryList(prev => prev.map((v, i) => i === index ? { ...v, status: 'archived' } : v))}
                            >
                              <Unlock className="w-4 h-4" />
                            </RowIconAction>
                          ) : (
                            <RowIconAction
                              label="Ngừng tham chiếu"
                              disabledReason={history.status === 'active' ? 'Không thể khóa phiên bản đang hiệu lực' : undefined}
                              onClick={() => setVersionHistoryList(prev => prev.map((v, i) => i === index ? { ...v, status: 'locked' } : v))}
                            >
                              <Lock className="w-4 h-4" />
                            </RowIconAction>
                          )}

                          {/* 3. Tải xuống */}
                          <RowIconAction
                            label="Tải xuống"
                            disabledReason={history.status === 'locked' ? 'Không thể tải xuống phiên bản đã ngừng tham chiếu' : undefined}
                            onClick={() => toast.info('Đang tải xuống dữ liệu phiên bản ' + history.version)}
                          >
                            <Download className="w-4 h-4" />
                          </RowIconAction>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

        </div>

      {/* Create Version Modal */}
      <CreateVersionModal
        isOpen={showCreateVersionModal}
        onClose={() => setShowCreateVersionModal(false)}
        currentVersion="v3.2"
        onSave={(data: any) => {
          setShowCreateVersionModal(false);
          setSuccessNotificationMessage('Đã tạo phiên bản mới ' + data.name + ' thành công!');
          setShowSuccessNotification(true);
          setTimeout(() => setShowSuccessNotification(false), 3000);
        }}
      />

      {showPublishModal && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-md`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Công khai danh mục</h3>
              {closeIconBtn(() => setShowPublishModal(false))}
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <p className="text-[13px] text-[#020817]">
                Vui lòng lựa chọn phạm vi chia sẻ (phân quyền công khai) cho danh mục <strong className="font-medium">{categoryName}</strong>:
              </p>

              {/* Thông tin nhanh của danh mục: Trạng thái phê duyệt / Phiên bản hiện hành / Quyền chia sẻ hiện tại */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Trạng thái phê duyệt</div>
                  <div className={FIELD_VALUE}>{lifecycleLabels[currentCategoryEntity.lifecycleStatus].label}</div>
                </div>
                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Phiên bản hiện hành</div>
                  <div className={FIELD_VALUE}>v{currentCategoryEntity.version ?? 1}</div>
                </div>
                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Quyền chia sẻ</div>
                  <div className={FIELD_VALUE}>{scopeLabels[currentCategoryEntity.scope]}</div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { value: 'internal' as const, title: 'Nội bộ', desc: 'Dữ liệu chỉ được chia sẻ và sử dụng trong nội bộ đơn vị, cơ quan.' },
                  { value: 'extended' as const, title: 'Mở rộng', desc: 'Chia sẻ cho các đơn vị liên kết, cơ quan thuộc Bộ Tư pháp.' },
                  { value: 'public' as const, title: 'Toàn dân', desc: 'Dữ liệu mở, cho phép mọi người dân và doanh nghiệp khai thác tự do.' },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3 border rounded-lg transition-colors cursor-pointer ${shareScope === opt.value ? 'border-[#BFDBFE] bg-[#EAF3FF]' : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'}`}
                  >
                    <input
                      type="radio"
                      name="shareScope"
                      checked={shareScope === opt.value}
                      onChange={() => setShareScope(opt.value)}
                      className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <div>
                      <span className="block text-[13px] font-medium text-[#020817]">{opt.title}</span>
                      <span className="block text-[13px] text-[#64748B] mt-0.5">{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" onClick={() => setShowPublishModal(false)} className={BTN_OUTLINE}>
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  setPublishStatus('published');
                  setPublishActionInfo({
                    user: 'Nguyễn Văn A',
                    date: new Date().toLocaleDateString('vi-VN')
                  });
                  onPublishStatusChange?.('published');
                  setShowPublishModal(false);
                  setSuccessNotificationMessage(`Công khai danh mục thành công với phạm vi: ${shareScope === 'internal' ? 'Nội bộ' : shareScope === 'extended' ? 'Mở rộng' : 'Toàn dân'}`);
                  setShowSuccessNotification(true);
                  setTimeout(() => setShowSuccessNotification(false), 3000);
                }}
                className={BTN_PRIMARY}
              >
                <Check className="w-4 h-4" />
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {showUnpublishModal && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-md`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Hủy công khai danh mục</h3>
              {closeIconBtn(() => { setShowUnpublishModal(false); setUnpublishReason(''); })}
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <p className="text-[13px] text-[#020817]">
                Bạn có chắc chắn muốn hủy công khai danh mục <strong className="font-medium">{categoryName}</strong>? Vui lòng nhập lý do hủy công khai:
              </p>
              {exploitingApiCount > 0 && (
                <div className={BANNER_WARN}>
                  <AlertCircle className="w-4 h-4 text-[#D97706] mt-0.5 shrink-0" />
                  <p>
                    Danh mục đang được khai thác bởi <strong className="font-medium">{exploitingApiCount}</strong> API.
                  </p>
                </div>
              )}
              <div>
                <label className={LABEL_CLS}>Lý do hủy công khai <span className={REQUIRED_MARK}>*</span></label>
                <textarea
                  title="Lý do hủy công khai"
                  value={unpublishReason}
                  onChange={(e) => setUnpublishReason(e.target.value)}
                  rows={4}
                  className={TEXTAREA_CLS}
                  placeholder="Nhập lý do chi tiết..."
                />
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => {
                  setShowUnpublishModal(false);
                  setUnpublishReason('');
                }}
                className={BTN_OUTLINE}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!unpublishReason.trim()) {
                    toast.error('Vui lòng nhập lý do hủy công khai!');
                    return;
                  }
                  setPublishStatus('stopped');
                  setPublishActionInfo({
                    user: 'Nguyễn Văn A',
                    date: new Date().toLocaleDateString('vi-VN'),
                    reason: unpublishReason
                  });
                  onPublishStatusChange?.('stopped');
                  setShowUnpublishModal(false);
                  setSuccessNotificationMessage(`Đã hủy công khai danh mục thành công!`);
                  setShowSuccessNotification(true);
                  setTimeout(() => setShowSuccessNotification(false), 3000);
                  setUnpublishReason('');
                }}
                className={BTN_DESTRUCTIVE}
              >
                <Check className="w-4 h-4" />
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {showArchiveModal && selectedCategory && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-lg`}>
            <div className={MODAL_HEADER}>
              <div>
                <h3 className={MODAL_TITLE}>Ngừng áp dụng bản ghi</h3>
                <p className={MODAL_SUBTITLE}>Yêu cầu ngừng áp dụng bản ghi {selectedCategory.name}</p>
              </div>
              {closeIconBtn(() => {
                setShowArchiveModal(false);
                setSelectedCategory(null);
                setArchiveRequestData({ reason: '', approver: '' });
              })}
            </div>

            <div className={`${MODAL_BODY} space-y-4`}>
              <div className={BANNER_DANGER}>
                <AlertCircle className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
                <div>
                  Bản ghi ngừng áp dụng sẽ không được sử dụng ở các màn hình nhập liệu khác, nhưng vẫn giữ lại trong lịch sử dữ liệu.
                </div>
              </div>

              <div>
                <label className={LABEL_CLS}>
                  Người phê duyệt <span className={REQUIRED_MARK}>*</span>
                </label>
                <select
                  title="Người phê duyệt"
                  value={archiveRequestData.approver}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setArchiveRequestData({ ...archiveRequestData, approver: e.target.value })}
                  className={INPUT_CLS}
                >
                  <option value="">Chọn người phê duyệt</option>
                  {approvers.map((approver) => (
                    <option key={approver.id} value={approver.id}>
                      {approver.name} - {approver.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={LABEL_CLS}>
                  Nội dung sao ngừng (Lý do) <span className={REQUIRED_MARK}>*</span>
                </label>
                <textarea
                  title="Lý do ngừng áp dụng"
                  value={archiveRequestData.reason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setArchiveRequestData({ ...archiveRequestData, reason: e.target.value })}
                  rows={3}
                  className={TEXTAREA_CLS}
                  placeholder="Nhập lý do ngừng áp dụng bản ghi..."
                />
              </div>
            </div>

            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => {
                  setShowArchiveModal(false);
                  setSelectedCategory(null);
                  setArchiveRequestData({ reason: '', approver: '' });
                }}
                className={BTN_OUTLINE}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!archiveRequestData.approver || !archiveRequestData.reason.trim()) {
                    toast.error('Vui lòng chọn người phê duyệt và nhập lý do ngừng áp dụng!');
                    return;
                  }

                  const selectedApprover = approvers.find(a => a.id === archiveRequestData.approver);
                  setCategories(prev => prev.map(c =>
                    c.id === selectedCategory.id ? { ...c, status: 'pending' as const, dataStatus: 'inactive' as const } : c
                  ));
                  setSuccessNotificationMessage(`Đã gửi yêu cầu ngừng áp dụng đến ${selectedApprover?.name} — bản ghi chuyển sang Chờ phê duyệt`);
                  setShowSuccessNotification(true);
                  setTimeout(() => setShowSuccessNotification(false), 3000);

                  setShowArchiveModal(false);
                  setSelectedCategory(null);
                  setArchiveRequestData({ reason: '', approver: '' });
                }}
                className={BTN_DESTRUCTIVE}
              >
                <Send className="w-4 h-4" />
                Gửi phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      <RecordFormModal
        isOpen={showAddModal && !editingRecord}
        onClose={() => setShowAddModal(false)}
        title="Thêm mới bản ghi"
        entityName={categoryName}
        entityCode={categoryId}
        onSave={(data) => {
          const currentDate = new Date().toLocaleDateString('vi-VN');
          const newCat: Category = {
            id: `cat-${Date.now()}`,
            code: data.code,
            name: data.name,
            description: data.description,
            type: 'standard',
            status: 'draft',
            dataStatus: 'new',
            createdDate: currentDate,
            createdBy: 'Nguyễn Văn A',
          };
          setCategories(prev => [...prev, newCat]);
          setVersionHistoryList(prev => [{
            version: getNextVersionLabel(),
            date: currentDate,
            effectiveDate: '',
            user: 'Nguyễn Văn A',
            changes: `Thêm bản ghi: ${data.name} (${data.code})`,
            status: 'pending'
          }, ...prev]);
          setShowAddModal(false);
          setSuccessNotificationMessage('Đã lưu bản ghi mới thành công!');
          setShowSuccessNotification(true);
          setTimeout(() => setShowSuccessNotification(false), 3000);
        }}
      />

      <RecordFormModal
        isOpen={showEditModal && !!editingRecord}
        onClose={() => { setShowEditModal(false); setEditingRecord(null); }}
        title="Chỉnh sửa bản ghi"
        initialData={editingRecord}
        entityName={categoryName}
        entityCode={categoryId}
        onSave={(data) => {
          const currentDate = new Date().toLocaleDateString('vi-VN');
          setCategories(prev => prev.map(c => {
            if (c.id !== editingRecord?.id) return c;
            const snapshot: Category['previousValues'] = {};
            if (c.code !== data.code) snapshot.code = c.code;
            if (c.name !== data.name) snapshot.name = c.name;
            if (c.description !== data.description) snapshot.description = c.description;
            return { ...c, code: data.code, name: data.name, description: data.description, status: 'draft' as const, dataStatus: 'edited' as const, previousValues: Object.keys(snapshot).length > 0 ? snapshot : c.previousValues, updatedDate: currentDate, updatedBy: 'Nguyễn Văn A' };
          }));
          setVersionHistoryList(prev => [{
            version: getNextVersionLabel(),
            date: currentDate,
            effectiveDate: '',
            user: 'Nguyễn Văn A',
            changes: `Chỉnh sửa bản ghi: ${data.name} (${data.code})`,
            status: 'pending'
          }, ...prev]);
          setShowEditModal(false);
          setEditingRecord(null);
          setSuccessNotificationMessage('Đã lưu chỉnh sửa bản ghi thành công!');
          setShowSuccessNotification(true);
          setTimeout(() => setShowSuccessNotification(false), 3000);
        }}
      />

      {/* Xem chi tiết bản ghi (tab Dữ liệu) — lưới 2 cột nhãn–giá trị (compomennt.md 5.17) */}
      {showRecordDetailModal && viewingRecordDetail && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-2xl`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Chi tiết bản ghi</h3>
              {closeIconBtn(() => { setShowRecordDetailModal(false); setViewingRecordDetail(null); }, 'Đóng chi tiết')}
            </div>
            <div className={MODAL_BODY}>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Mã</div>
                  <div className={FIELD_VALUE}>{viewingRecordDetail.code}</div>
                </div>
                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Tên giá trị</div>
                  <div className={FIELD_VALUE}>{viewingRecordDetail.name}</div>
                </div>
                <div className="col-span-2">
                  <div className={`${FIELD_LABEL} mb-1`}>Mô tả</div>
                  <div className={FIELD_VALUE}>{viewingRecordDetail.description || '—'}</div>
                </div>

                <div className="col-span-2 border-t border-[#E2E8F0] pt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Trạng thái dữ liệu</div>
                    <div>{getDataStatusBadge(viewingRecordDetail.dataStatus)}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Trạng thái duyệt</div>
                    <div>{getRecordApprovalBadge(viewingRecordDetail.status)}</div>
                  </div>
                  {viewingRecordDetail.status === 'rejected' && (
                    <div className="col-span-2">
                      <div className={`${FIELD_LABEL} mb-1`}>Nội dung từ chối</div>
                      <div className={BANNER_DANGER}>
                        {viewingRecordDetail.rejectReason || 'Không có nội dung từ chối được ghi nhận.'}
                      </div>
                    </div>
                  )}
                  {viewingRecordDetail.status !== 'rejected' && viewingRecordDetail.status !== 'draft' && viewingRecordDetail.status !== 'pending' && (
                    <div className="col-span-2">
                      <div className={`${FIELD_LABEL} mb-1`}>Nội dung phê duyệt</div>
                      <div className={BANNER_SUCCESS}>
                        {viewingRecordDetail.approvalNote || 'Không có ghi chú phê duyệt.'}
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-span-2 border-t border-[#E2E8F0] pt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Ngày tạo</div>
                    <div className={FIELD_VALUE}>{viewingRecordDetail.createdDate}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Người tạo</div>
                    <div className={FIELD_VALUE}>{viewingRecordDetail.createdBy || '—'}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Ngày cập nhật</div>
                    <div className={FIELD_VALUE}>{viewingRecordDetail.updatedDate || '—'}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Người cập nhật</div>
                    <div className={FIELD_VALUE}>{viewingRecordDetail.updatedBy || '—'}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => { setShowRecordDetailModal(false); setViewingRecordDetail(null); }}
                className={BTN_OUTLINE}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {showApprovalRequestModal && (
        <UpdateApprovalModal
          isOpen={showApprovalRequestModal}
          onClose={() => setShowApprovalRequestModal(false)}
          approvers={[
            { id: '1', name: 'Nguyễn Văn A', position: 'Trưởng phòng', department: 'Phòng Quản lý dữ liệu' },
            { id: '2', name: 'Trần Thị B', position: 'Phó Giám đốc', department: 'Trung tâm CNTT' }
          ]}
          onSubmit={(_data) => {
            const ids = selectedRecordIds;
            setCategories(prev => prev.map(c => ids.includes(c.id) && c.status === 'draft' ? { ...c, status: 'pending' as const } : c));
            setSelectedRecordIds([]);
            setShowApprovalRequestModal(false);
            setSuccessNotificationMessage(`Đã gửi ${ids.length} bản ghi chờ phê duyệt thành công!`);
            setShowSuccessNotification(true);
            setTimeout(() => setShowSuccessNotification(false), 3000);
          }}
        />
      )}

      <ApprovalRequestModal
        isOpen={showBulkApproval}
        onClose={() => setShowBulkApproval(false)}
        data={{ id: '', code: categoryId, name: `${selectedRecordIds.length} bản ghi đã chọn`, type: 'category' }}
        approvers={[
          { id: '1', name: 'Nguyễn Văn A', position: 'Trưởng phòng', department: 'Phòng Quản lý dữ liệu' },
          { id: '2', name: 'Trần Thị B', position: 'Phó Giám đốc', department: 'Trung tâm CNTT' },
          { id: '3', name: 'Lê Minh C', position: 'Trưởng phòng Pháp chế', department: 'Vụ Pháp luật' },
          { id: '4', name: 'Phạm Văn D', position: 'Cục trưởng', department: 'Cục CNTT' }
        ]}
        form={bulkApprovalForm}
        setForm={setBulkApprovalForm}
        onSubmit={() => {
          setCategories(prev => prev.map(c =>
            selectedRecordIds.includes(c.id) ? { ...c, status: 'approved' as const, approvalNote: bulkApprovalForm.note.trim() || undefined, rejectReason: undefined } : c
          ));
          setSuccessNotificationMessage(`Đã gửi ${selectedRecordIds.length} bản ghi đến người phê duyệt thành công!`);
          setShowSuccessNotification(true);
          setTimeout(() => setShowSuccessNotification(false), 3000);
          setShowBulkApproval(false);
          setSelectedRecordIds([]);
          setBulkApprovalForm({ reviewer: '', note: '' });
        }}
      />

      {/* Xem chi tiết danh mục (chỉ xem) — mở từ nút "Xem chi tiết" ở tab Phiên bản */}
      <CategoryInfoViewModal
        isOpen={showCategoryInfoModal}
        onClose={() => setShowCategoryInfoModal(false)}
        entity={currentCategoryEntity}
        viewOnly={true}
        attributes={currentCategoryAttributes}
        relationships={currentCategoryRelationships}
        onApprove={() => {}}
        onReject={() => {}}
      />

      {/* Add Field Modal */}
      {showAddFieldModal && (
        <div className={MODAL_OVERLAY} onClick={() => setShowAddFieldModal(false)}>
          <div className={`${MODAL_BOX} max-w-2xl`} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Thêm trường dữ liệu mới</h3>
              {closeIconBtn(() => setShowAddFieldModal(false))}
            </div>

            <div className={`${MODAL_BODY} space-y-4`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Tên trường <span className={REQUIRED_MARK}>*</span></label>
                  <input
                    type="text"
                    title="Tên trường"
                    value={newFieldData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFieldData({ ...newFieldData, name: e.target.value })}
                    className={INPUT_CLS}
                    placeholder="Nhập tên trường"
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Kiểu dữ liệu <span className={REQUIRED_MARK}>*</span></label>
                  <select
                    title="Kiểu dữ liệu"
                    value={newFieldData.dataType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewFieldData({ ...newFieldData, dataType: e.target.value })}
                    className={INPUT_CLS}
                  >
                    <option value="TEXT">Text</option>
                    <option value="NUMBER">Number</option>
                    <option value="DATE">Date</option>
                    <option value="BOOLEAN">Boolean</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Bắt buộc <span className={REQUIRED_MARK}>*</span></label>
                  <select
                    title="Trường bắt buộc"
                    value={newFieldData.required ? 'true' : 'false'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewFieldData({ ...newFieldData, required: e.target.value === 'true' })}
                    className={INPUT_CLS}
                  >
                    <option value="true">Có</option>
                    <option value="false">Không</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Giá trị mặc định</label>
                  <input
                    type="text"
                    title="Giá trị mặc định"
                    value={newFieldData.defaultValue || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFieldData({ ...newFieldData, defaultValue: e.target.value })}
                    className={INPUT_CLS}
                    placeholder="Nhập giá trị mặc định"
                  />
                </div>
              </div>
            </div>

            <div className={MODAL_FOOTER}>
              <button type="button" title="Đóng" aria-label="Đóng" onClick={() => setShowAddFieldModal(false)} className={BTN_OUTLINE}>
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  const currentDate = new Date().toLocaleDateString('vi-VN');
                  setNewCategoryFields([...newCategoryFields, { ...newFieldData, id: Date.now().toString() }]);
                  setVersionHistoryList(prev => [{
                    version: getNextVersionLabel(),
                    date: currentDate,
                    effectiveDate: '',
                    user: 'Nguyễn Văn A',
                    changes: `Thêm trường dữ liệu: ${newFieldData.name}`,
                    status: 'pending'
                  }, ...prev]);
                  setNewFieldData({ name: '', dataType: 'TEXT', required: false, defaultValue: '', maxLength: 255, description: '', isPrimaryKey: false, isForeignKey: false, referenceTable: '', referenceField: '' });
                }}
                className={BTN_PRIMARY}
              >
                <Plus className="w-4 h-4" />
                Thêm trường
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Field Form Modal */}
      {showFieldFormModal && (
        <div className={MODAL_OVERLAY} onClick={() => setShowFieldFormModal(false)}>
          <div className={`${MODAL_BOX} max-w-2xl`} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Thêm trường dữ liệu mới</h3>
              {closeIconBtn(() => setShowFieldFormModal(false))}
            </div>

            <div className={`${MODAL_BODY} space-y-4`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Tên trường <span className={REQUIRED_MARK}>*</span></label>
                  <input
                    type="text"
                    title="Tên trường"
                    value={newFieldData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setNewFieldData({ ...newFieldData, name: e.target.value });
                      if (fieldErrors.name) {
                        setFieldErrors({ ...fieldErrors, name: '' });
                      }
                    }}
                    className={`${INPUT_CLS} ${fieldErrors.name ? '!border-[#DC2626]' : ''}`}
                    placeholder="Nhập tên trường"
                  />
                  {fieldErrors.name && (
                    <p className="text-[12px] text-[#DC2626] mt-1">{fieldErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className={LABEL_CLS}>Kiểu dữ liệu <span className={REQUIRED_MARK}>*</span></label>
                  <select
                    title="Kiểu dữ liệu"
                    value={newFieldData.dataType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewFieldData({ ...newFieldData, dataType: e.target.value })}
                    className={INPUT_CLS}
                  >
                    <option value="TEXT">Text</option>
                    <option value="NUMBER">Number</option>
                    <option value="DATE">Date</option>
                    <option value="BOOLEAN">Boolean</option>
                    <option value="EMAIL">Email</option>
                    <option value="URL">URL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={LABEL_CLS}>Khóa chính</label>
                  <select
                    title="Khóa chính"
                    value={newFieldData.isPrimaryKey ? 'true' : 'false'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const isPrimary = e.target.value === 'true';
                      setNewFieldData({ ...newFieldData, isPrimaryKey: isPrimary });
                    }}
                    className={INPUT_CLS}
                  >
                    <option value="false">Không</option>
                    <option value="true">Có</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Bắt buộc <span className={REQUIRED_MARK}>*</span></label>
                  <select
                    title="Trường bắt buộc"
                    value={newFieldData.required ? 'true' : 'false'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewFieldData({ ...newFieldData, required: e.target.value === 'true' })}
                    className={INPUT_CLS}
                  >
                    <option value="true">Có</option>
                    <option value="false">Không</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Độ dài tối đa</label>
                  <input
                    type="number"
                    title="Độ dài tối đa"
                    value={newFieldData.maxLength || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFieldData({ ...newFieldData, maxLength: parseInt(e.target.value) })}
                    className={INPUT_CLS}
                    placeholder="Nhập độ dài tối đa"
                  />
                </div>
              </div>

              <div>
                <label className={LABEL_CLS}>Giá trị mặc định</label>
                <input
                  type="text"
                  title="Giá trị mặc định"
                  value={newFieldData.defaultValue || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFieldData({ ...newFieldData, defaultValue: e.target.value })}
                  className={INPUT_CLS}
                  placeholder="Nhập giá trị mặc định"
                />
              </div>

              {/* Foreign Key Section */}
              <div className="border-t border-[#E2E8F0] pt-4">
                <div className="mb-3">
                  <label className={LABEL_CLS}>Khóa ngoại</label>
                  <select
                    title="Khóa ngoại"
                    value={newFieldData.isForeignKey ? 'true' : 'false'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const isForeign = e.target.value === 'true';
                      setNewFieldData({ ...newFieldData, isForeignKey: isForeign });
                    }}
                    className={INPUT_CLS}
                  >
                    <option value="false">Không</option>
                    <option value="true">Có</option>
                  </select>
                </div>

                {newFieldData.isForeignKey && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL_CLS}>Bảng tham chiếu <span className={REQUIRED_MARK}>*</span></label>
                      <select
                        title="Bảng tham chiếu"
                        value={newFieldData.referenceTable || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                          setNewFieldData({ ...newFieldData, referenceTable: e.target.value });
                          if (fieldErrors.referenceTable) {
                            setFieldErrors({ ...fieldErrors, referenceTable: '' });
                          }
                        }}
                        className={`${INPUT_CLS} ${fieldErrors.referenceTable ? '!border-[#DC2626]' : ''}`}
                      >
                        <option value="">Chọn bảng</option>
                        <option value="danh_muc_a">Biên tập danh mục A</option>
                        <option value="danh_muc_b">Danh mục B</option>
                        <option value="danh_muc_c">Danh mục C</option>
                      </select>
                      {fieldErrors.referenceTable && (
                        <p className="text-[12px] text-[#DC2626] mt-1">{fieldErrors.referenceTable}</p>
                      )}
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Trường tham chiếu <span className={REQUIRED_MARK}>*</span></label>
                      <select
                        title="Trường tham chiếu"
                        value={newFieldData.referenceField || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                          setNewFieldData({ ...newFieldData, referenceField: e.target.value });
                          if (fieldErrors.referenceField) {
                            setFieldErrors({ ...fieldErrors, referenceField: '' });
                          }
                        }}
                        className={`${INPUT_CLS} ${fieldErrors.referenceField ? '!border-[#DC2626]' : ''}`}
                      >
                        <option value="">Chọn trường</option>
                        <option value="id">ID</option>
                        <option value="ma_code">Mã Code</option>
                        <option value="ten">Tên</option>
                      </select>
                      {fieldErrors.referenceField && (
                        <p className="text-[12px] text-[#DC2626] mt-1">{fieldErrors.referenceField}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className={LABEL_CLS}>Mô tả</label>
                <textarea
                  rows={3}
                  title="Mô tả"
                  value={newFieldData.description || ''}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewFieldData({ ...newFieldData, description: e.target.value })}
                  className={TEXTAREA_CLS}
                  placeholder="Nhập mô tả về trường..."
                />
              </div>
            </div>

            <div className={MODAL_FOOTER}>
              <button type="button" onClick={() => setShowFieldFormModal(false)} className={BTN_OUTLINE}>
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  // Validation
                  const errors: { [key: string]: string } = {};

                  // Kiểm tra tên trường bắt buộc
                  if (!newFieldData.name.trim()) {
                    errors.name = 'Tên trường không được để trống';
                  }

                  // Kiểm tra trùng tên trường (ngoại trừ trường đang sửa)
                  const isDuplicate = newCategoryFields.some((field, index) =>
                    field.name.toLowerCase() === newFieldData.name.toLowerCase() &&
                    index !== editingFieldIndex
                  );
                  if (isDuplicate) {
                    errors.name = 'Tên trường đã tồn tại';
                  }

                  // Kiểm tra khóa ngoại
                  if (newFieldData.isForeignKey) {
                    if (!newFieldData.referenceTable) {
                      errors.referenceTable = 'Vui lòng chọn bảng tham chiếu';
                    }
                    if (!newFieldData.referenceField) {
                      errors.referenceField = 'Vui lòng chọn trường tham chiếu';
                    }
                  }

                  if (Object.keys(errors).length > 0) {
                    setFieldErrors(errors);
                    return;
                  }

                  // Nếu đang đặt khóa chính, bỏ khóa chính của các trường khác
                  let fieldsToUpdate = [...newCategoryFields];
                  if (newFieldData.isPrimaryKey) {
                    fieldsToUpdate = fieldsToUpdate.map(f => ({ ...f, isPrimaryKey: false }));
                  }

                  const currentDate = new Date().toLocaleDateString('vi-VN');
                  const isEditing = editingFieldIndex !== null;
                  if (isEditing) {
                    fieldsToUpdate[editingFieldIndex] = { ...newFieldData, id: newCategoryFields[editingFieldIndex].id };
                    setNewCategoryFields(fieldsToUpdate);
                  } else {
                    setNewCategoryFields([...fieldsToUpdate, { ...newFieldData, id: Date.now().toString() }]);
                  }
                  setVersionHistoryList(prev => [{
                    version: getNextVersionLabel(),
                    date: currentDate,
                    effectiveDate: '',
                    user: 'Nguyễn Văn A',
                    changes: isEditing
                      ? `Chỉnh sửa trường dữ liệu: ${newFieldData.name}`
                      : `Thêm trường dữ liệu: ${newFieldData.name}`,
                    status: 'pending'
                  }, ...prev]);
                  setNewFieldData({ name: '', dataType: 'TEXT', required: false, defaultValue: '', maxLength: 255, description: '', isPrimaryKey: false, isForeignKey: false, referenceTable: '', referenceField: '' });
                  setEditingFieldIndex(null);
                  setFieldErrors({});
                  setShowFieldFormModal(false);
                }}
                className={BTN_PRIMARY}
              >
                <Plus className="w-4 h-4" />
                Thêm trường
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Excel Modal */}
      {showImportModal && (
        <div className={MODAL_OVERLAY} onClick={handleCancelImport}>
          <div className={`${MODAL_BOX} max-w-5xl`} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_HEADER}>
              <div>
                <h3 className={MODAL_TITLE}>Nhập dữ liệu từ Excel</h3>
                <p className={MODAL_SUBTITLE}>Tải lên file Excel để nhập hàng loạt danh mục</p>
              </div>
              {closeIconBtn(handleCancelImport)}
            </div>

            <div className={`${MODAL_BODY} space-y-4`}>
              {/* File Upload Section */}
              <div>
                <label className={LABEL_CLS}>
                  Chọn file Excel <span className={REQUIRED_MARK}>*</span>
                </label>
                <div className="border-2 border-dashed border-[#CBD5E1] rounded-lg p-6 text-center hover:bg-[#F8FAFC] transition-colors">
                  <input title="Trường dữ liệu"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label htmlFor="excel-upload" className="cursor-pointer block">
                    <div className="p-3 rounded-lg bg-green-50 inline-flex mb-3">
                      <Upload className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-[13px] text-[#020817] mb-1">
                      {importFile ? importFile.name : 'Nhấn để chọn file hoặc kéo thả file vào đây'}
                    </p>
                    <p className="text-[12px] text-[#64748B]">
                      Hỗ trợ: .xlsx, .xls, .csv (Tối đa 10MB)
                    </p>
                  </label>
                </div>

                {/* Template Download */}
                <div className="mt-3 flex items-center gap-2 text-[13px]">
                  <FileDown className="w-4 h-4 text-blue-600" />
                  <a href="#" className="text-blue-600 hover:underline">
                    Tải file mẫu Excel
                  </a>
                  <span className="text-[#64748B]">để xem cấu trúc dữ liệu yêu cầu</span>
                </div>
              </div>

              {/* Format Guide */}
              <div className={BANNER_INFO}>
                <AlertCircle className="w-4 h-4 text-[#155DFC] mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">Định dạng file Excel yêu cầu</h4>
                  <div className="space-y-1">
                    <p>• Cột 1: Mã danh mục (bắt buộc)</p>
                    <p>• Cột 2: Tên danh mục (bắt buộc)</p>
                    <p>• Cột 3: Mô tả</p>
                    <p>• Cột 4: Loại danh mục (Tiêu chuẩn / Tham chiếu / Hệ thống)</p>
                    <p>• Dòng đầu tiên là tiêu đề cột, dữ liệu bắt đầu từ dòng thứ 2</p>
                  </div>
                </div>
              </div>

              {/* Errors */}
              {importErrors.length > 0 && (
                <div className={BANNER_DANGER}>
                  <XCircle className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Phát hiện {importErrors.length} lỗi</h4>
                    <ul className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                      {importErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Preview Data */}
              {importPreviewData.length > 0 && (
                <div>
                  <h4 className={SECTION_TITLE}>
                    Xem trước dữ liệu ({importPreviewData.length} bản ghi)
                  </h4>
                  <div className={TABLE_WRAP}>
                    <div className="overflow-x-auto max-h-96 custom-scrollbar">
                      <table className={TABLE_CLS}>
                        <thead className="bg-[#F8FAFC] sticky top-0">
                          <tr className="h-[42px]">
                            <th className={`${TH} text-center w-14`}>STT</th>
                            <th className={`${TH} text-left`}>Mã danh mục</th>
                            <th className={`${TH} text-left`}>Tên danh mục</th>
                            <th className={`${TH} text-left`}>Mô tả</th>
                            <th className={`${TH} text-left`}>Loại</th>
                          </tr>
                        </thead>
                        <tbody>
                          {importPreviewData.map((item, index) => (
                            <tr key={index} className={TR}>
                              <td className={`${TD} text-center`}>{index + 1}</td>
                              <td className={`${TD} max-w-[200px]`}><TruncatedText text={item.code} /></td>
                              <td className={`${TD} max-w-[360px]`}><TruncatedText text={item.name} /></td>
                              <td className={`${TD} max-w-[360px]`}><TruncatedText text={item.description} /></td>
                              <td className={TD}>{getTypeBadge(item.type)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`${MODAL_FOOTER} !justify-between items-center`}>
              <div className="text-[13px] text-[#475569]">
                {importPreviewData.length > 0 && (
                  <span>Sẵn sàng nhập {importPreviewData.length} bản ghi</span>
                )}
              </div>
              <div className="flex gap-3">
                <button type="button" title="Đóng" aria-label="Đóng" onClick={handleCancelImport} className={BTN_OUTLINE}>
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleImportConfirm}
                  disabled={importPreviewData.length === 0 || importErrors.length > 0}
                  className={BTN_PRIMARY}
                >
                  <Check className="w-4 h-4" />
                  Xác nhận nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Detail Modal */}
      {showApprovalDetailModal && selectedApprovalRequest && (
        <div className={MODAL_OVERLAY} onClick={() => setShowApprovalDetailModal(false)}>
          <div className={`${MODAL_BOX} max-w-3xl`} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_HEADER}>
              <div>
                <h3 className={MODAL_TITLE}>Chi tiết thay đổi</h3>
                <p className={MODAL_SUBTITLE}>Xem các thay đổi của bản ghi</p>
              </div>
              {closeIconBtn(() => setShowApprovalDetailModal(false))}
            </div>

            <div className={`${MODAL_BODY} space-y-4`}>
              {/* Record Info */}
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Mã bản ghi</div>
                    <div className={FIELD_VALUE}>{selectedApprovalRequest.recordCode}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Tên bản ghi</div>
                    <div className={FIELD_VALUE}>{selectedApprovalRequest.recordName}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Người thay đổi</div>
                    <div className={FIELD_VALUE}>{selectedApprovalRequest.changedBy}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Thời gian thay đổi</div>
                    <div className={FIELD_VALUE}>{selectedApprovalRequest.changedDate}</div>
                  </div>
                  {selectedApprovalRequest.approvedDate && (
                    <>
                      <div>
                        <div className={`${FIELD_LABEL} mb-1`}>Người phê duyệt</div>
                        <div className={FIELD_VALUE}>{selectedApprovalRequest.approvedBy}</div>
                      </div>
                      <div>
                        <div className={`${FIELD_LABEL} mb-1`}>Thời gian phê duyệt</div>
                        <div className={FIELD_VALUE}>{selectedApprovalRequest.approvedDate}</div>
                      </div>
                    </>
                  )}
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Trạng thái</div>
                    {getApprovalStatusBadge(selectedApprovalRequest.status)}
                  </div>
                </div>
              </div>

              {/* Changes */}
              <div>
                <h4 className={SECTION_TITLE}>Các thay đổi ({selectedApprovalRequest.changedFields.length})</h4>
                <div className="space-y-3">
                  {Object.entries(selectedApprovalRequest.changes).map(([fieldName, values]: [string, any]) => (
                    <div key={fieldName} className="rounded-2xl border border-[#E2E8F0] p-4">
                      <div className="text-[13px] font-medium text-[#020817] mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#64748B]" />
                        {fieldName}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-[13px] text-[#64748B] mb-1">Giá trị cũ</div>
                          <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg px-3 py-2 text-[13px] text-[#B91C1C]">
                            {values.old}
                          </div>
                        </div>
                        <div>
                          <div className="text-[13px] text-[#64748B] mb-1">Giá trị mới</div>
                          <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg px-3 py-2 text-[13px] text-[#15803D]">
                            {values.new}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedApprovalRequest.status === 'rejected' && selectedApprovalRequest.rejectionReason && (
                <div className={BANNER_DANGER}>
                  <AlertCircle className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">Lý do từ chối</h4>
                    <p>{selectedApprovalRequest.rejectionReason}</p>
                  </div>
                </div>
              )}
            </div>

            <div className={`${MODAL_FOOTER} !justify-between items-center`}>
              <button type="button" onClick={() => setShowApprovalDetailModal(false)} className={BTN_OUTLINE}>
                Đóng
              </button>
              {selectedApprovalRequest.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleReject(selectedApprovalRequest.id);
                      setShowApprovalDetailModal(false);
                    }}
                    className={BTN_DESTRUCTIVE}
                  >
                    <XCircle className="w-4 h-4" />
                    Từ chối
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleApprove(selectedApprovalRequest.id);
                      setShowApprovalDetailModal(false);
                    }}
                    className={BTN_PRIMARY}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Phê duyệt
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div
          className={MODAL_OVERLAY}
          onClick={() => {
            setShowApprovalModal(false);
            setApprovalComment('');
            setPendingApprovalIds([]);
          }}
        >
          <div className={`${MODAL_BOX} max-w-lg`} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_HEADER}>
              <div>
                <h3 className={MODAL_TITLE}>Xác nhận phê duyệt</h3>
                <p className={MODAL_SUBTITLE}>Phê duyệt {pendingApprovalIds.length} yêu cầu thay đổi</p>
              </div>
              {closeIconBtn(() => {
                setShowApprovalModal(false);
                setApprovalComment('');
                setPendingApprovalIds([]);
              })}
            </div>

            <div className={`${MODAL_BODY} space-y-4`}>
              <div>
                <label className={LABEL_CLS}>
                  Nội dung phê duyệt <span className="font-normal text-[#94A3B8]">(Không bắt buộc)</span>
                </label>
                <textarea
                  title="Ghi chú phê duyệt"
                  value={approvalComment}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setApprovalComment(e.target.value)}
                  rows={4}
                  className={TEXTAREA_CLS}
                  placeholder="Nhập nội dung phê duyệt, ghi chú hoặc ý kiến (nếu có)..."
                />
              </div>

              <div className={BANNER_INFO}>
                <AlertCircle className="w-4 h-4 text-[#155DFC] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Lưu ý:</p>
                  <p className="mt-1">Sau khi phê duyệt, các thay đổi sẽ được áp dụng vào hệ thống và không thể hoàn tác.</p>
                </div>
              </div>
            </div>

            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalComment('');
                  setPendingApprovalIds([]);
                }}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button type="button" onClick={confirmApproval} className={BTN_PRIMARY}>
                <CheckCircle2 className="w-4 h-4" />
                Xác nhận phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div
          className={MODAL_OVERLAY}
          onClick={() => {
            setShowRejectModal(false);
            setApprovalComment('');
            setPendingApprovalIds([]);
          }}
        >
          <div className={`${MODAL_BOX} max-w-lg`} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_HEADER}>
              <div>
                <h3 className={MODAL_TITLE}>Xác nhận từ chối</h3>
                <p className={MODAL_SUBTITLE}>Từ chối {pendingApprovalIds.length} yêu cầu thay đổi</p>
              </div>
              {closeIconBtn(() => {
                setShowRejectModal(false);
                setApprovalComment('');
                setPendingApprovalIds([]);
              })}
            </div>

            <div className={`${MODAL_BODY} space-y-4`}>
              <div>
                <label className={LABEL_CLS}>
                  Lý do từ chối <span className={REQUIRED_MARK}>*</span>
                </label>
                <textarea
                  title="Lý do từ chối"
                  value={approvalComment}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setApprovalComment(e.target.value)}
                  rows={4}
                  className={TEXTAREA_CLS}
                  placeholder="Nhập lý do từ chối yêu cầu thay đổi..."
                />
              </div>

              <div className={BANNER_DANGER}>
                <AlertCircle className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Lưu ý:</p>
                  <p className="mt-1">Vui lòng nhập rõ lý do từ chối để người yêu cầu có thể hiểu và chỉnh sửa lại.</p>
                </div>
              </div>
            </div>

            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(false);
                  setApprovalComment('');
                  setPendingApprovalIds([]);
                }}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button type="button" onClick={confirmReject} className={BTN_DESTRUCTIVE}>
                <XCircle className="w-4 h-4" />
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <div className="bg-white border border-[#DCFCE7] rounded-lg p-4 shadow-lg flex items-start gap-3 min-w-[420px]">
            <div className="p-2 rounded-lg bg-green-50 shrink-0">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-[14px] font-medium text-[#020817]">Gửi yêu cầu thành công</h4>
              <p className="text-[13px] text-[#475569] mt-0.5">
                {successNotificationMessage || 'Yêu cầu chỉnh sửa danh mục đã được gửi đến bộ phận phê duyệt'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSuccessNotification(false)}
              title="Đóng thông báo"
              aria-label="Đóng thông báo"
              className={BTN_GHOST_ICON}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div className={MODAL_OVERLAY} onClick={() => setShowCompareModal(false)}>
          <div className={`${MODAL_BOX} max-w-4xl`} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>So sánh phiên bản dữ liệu</h3>
              {closeIconBtn(() => setShowCompareModal(false))}
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <div className={BANNER_INFO}>
                <BarChart3 className="w-4 h-4 text-[#155DFC] mt-0.5 shrink-0" />
                <div>
                  <p>Đang so sánh <strong className="font-medium">v2.0</strong> với <strong className="font-medium">v3.2 (Hiện tại)</strong></p>
                  <p className="text-[#475569] mt-1">Phát hiện <span className="font-medium text-[#DC2626]">3 thay đổi</span> về cấu trúc và <span className="font-medium text-[#D97706]">1 thay đổi</span> về quy tắc.</p>
                </div>
              </div>

              <div className={TABLE_WRAP}>
                <table className={TABLE_CLS}>
                  <thead className="bg-[#F8FAFC]">
                    <tr className="h-[42px]">
                      <th className={`${TH} text-left w-1/4`}>Tên trường / Thuộc tính</th>
                      <th className={`${TH} text-left w-[15%]`}>Hành động</th>
                      <th className={`${TH} text-left w-[30%]`}>Phiên bản cũ (v2.0)</th>
                      <th className={`${TH} text-left w-[30%]`}>Phiên bản mới (v3.2)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Added Field */}
                    <tr className={TR}>
                      <td className={TD}>Số điện thoại liên hệ</td>
                      <td className={TD}><Badge label="Thêm mới" variant="green" /></td>
                      <td className={`${TD} text-[#64748B]`}>Chưa có</td>
                      <td className={`${TD} py-2`}>
                        <div className="flex flex-col gap-1">
                          <span>Kiểu dữ liệu: <span className="text-blue-600">string</span></span>
                          <span>Chiều dài: 20</span>
                        </div>
                      </td>
                    </tr>
                    {/* Modified Field - DataType */}
                    <tr className={TR}>
                      <td className={TD}>Mã tỉnh</td>
                      <td className={TD}><Badge label="Sửa kiểu dữ liệu" variant="blue" /></td>
                      <td className={TD}>
                        Kiểu dữ liệu: <span className="text-[#DC2626]">number</span>
                      </td>
                      <td className={TD}>
                        Kiểu dữ liệu: <span className="text-[#15803D]">string</span>
                      </td>
                    </tr>
                    {/* Modified Field - Constraint */}
                    <tr className={TR}>
                      <td className={TD}>Mã tỉnh</td>
                      <td className={TD}><Badge label="Sửa ràng buộc" variant="purple" /></td>
                      <td className={TD}>
                        Unique Index: <span className="text-[#DC2626]">Không có</span>
                      </td>
                      <td className={TD}>
                        Unique Index: <span className="text-[#15803D]">Đã thiết lập</span>
                      </td>
                    </tr>
                    {/* Removed Field */}
                    <tr className={TR}>
                      <td className={TD}>Ghi chú phụ</td>
                      <td className={TD}><Badge label="Xóa bỏ" variant="red" /></td>
                      <td className={TD}>
                        Trường dữ liệu kiểu string
                      </td>
                      <td className={`${TD} text-[#64748B]`}>
                        Đã gỡ bỏ khỏi cấu trúc
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" title="Đóng" aria-label="Đóng" onClick={() => setShowCompareModal(false)} className={BTN_OUTLINE}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version Detail Modal */}
      {showVersionDetailModal && selectedVersionData && (
        <div className={MODAL_OVERLAY} onClick={() => setShowVersionDetailModal(false)}>
          <div className={`${MODAL_BOX} max-w-2xl`} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Chi tiết phiên bản {selectedVersionData.version}</h3>
              {closeIconBtn(() => setShowVersionDetailModal(false))}
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Người thực hiện</div>
                  <div className={FIELD_VALUE}>{selectedVersionData.user}</div>
                </div>
                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Ngày thay đổi</div>
                  <div className={FIELD_VALUE}>{selectedVersionData.date}</div>
                </div>
                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Ngày hiệu lực</div>
                  <div className={FIELD_VALUE}>{selectedVersionData.effectiveDate || '--'}</div>
                </div>
                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Trạng thái</div>
                  <Badge
                    label={
                      selectedVersionData.status === 'active' ? 'Hiệu lực' :
                      selectedVersionData.status === 'draft' ? 'Bản nháp' :
                      selectedVersionData.status === 'pending' ? 'Chờ duyệt' : 'Hết hiệu lực'
                    }
                    variant={
                      selectedVersionData.status === 'active' ? 'green' :
                      selectedVersionData.status === 'draft' ? 'amber' :
                      selectedVersionData.status === 'pending' ? 'orange' : 'slate'
                    }
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <h4 className="text-[13px] font-medium text-[#020817] mb-2">Nội dung thay đổi chi tiết</h4>
                <p className={FIELD_VALUE}>{selectedVersionData.changes}</p>
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" title="Đóng" aria-label="Đóng" onClick={() => setShowVersionDetailModal(false)} className={BTN_OUTLINE}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {showRestoreModal && selectedVersionData && (
        <div className={MODAL_OVERLAY} onClick={() => setShowRestoreModal(false)}>
          <div className={`${MODAL_BOX} max-w-md`} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_HEADER}>
              <div>
                <h3 className={MODAL_TITLE}>Đặt làm phiên bản chính</h3>
                <p className={MODAL_SUBTITLE}>Xác nhận đặt phiên bản <strong className="font-medium">{selectedVersionData.version}</strong> làm phiên bản chính?</p>
              </div>
              {closeIconBtn(() => setShowRestoreModal(false))}
            </div>
            <div className={`${MODAL_BODY} text-[13px] text-[#020817]`}>
              Hệ thống sẽ chuyển đổi trạng thái của phiên bản {selectedVersionData.version} sang "Chờ duyệt". Phiên bản hiện tại đang sử dụng vẫn giữ nguyên trạng thái "Hiệu lực".
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" onClick={() => setShowRestoreModal(false)} className={BTN_OUTLINE}>
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  setVersionHistoryList(versionHistoryList.map(v => v.version === selectedVersionData.version ? { ...v, status: 'pending' } : v));
                  setShowRestoreModal(false);
                  setSuccessNotificationMessage(`Yêu cầu đặt phiên bản ${selectedVersionData.version} làm phiên bản chính đã được gửi duyệt thành công!`);
                  setShowSuccessNotification(true);
                }}
                className={BTN_PRIMARY}
              >
                <Check className="w-4 h-4" /> Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Version Modal */}
      {showCreateVersionModal && (
        <div className={MODAL_OVERLAY} onClick={() => setShowCreateVersionModal(false)}>
          <div className={`${MODAL_BOX} max-w-lg`} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Tạo phiên bản mới</h3>
              {closeIconBtn(() => setShowCreateVersionModal(false))}
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <div className={BANNER_INFO}>
                <AlertCircle className="w-4 h-4 text-[#155DFC] mt-0.5 shrink-0" />
                <p>Hệ thống sẽ sao chép cấu trúc và nội dung từ bản ghi hiện tại để tạo thành nền tảng cho phiên bản nâng cấp tiếp theo.</p>
              </div>

              <div>
                <label className={LABEL_CLS}>Tên phiên bản <span className={REQUIRED_MARK}>*</span></label>
                <input title="Tên phiên bản" type="text" className={INPUT_CLS} value={newVersionName} onChange={(e) => setNewVersionName(e.target.value)} />
              </div>

              <div>
                <label className={LABEL_CLS}>Ngày hiệu lực <span className={REQUIRED_MARK}>*</span></label>
                <input title="Ngày hiệu lực" type="date" className={INPUT_CLS} value={newEffectiveDate} onChange={(e) => setNewEffectiveDate(e.target.value)} />
              </div>

              <div>
                <label className={LABEL_CLS}>Mô tả thay đổi</label>
                <textarea title="Mô tả thay đổi" rows={3} className={TEXTAREA_CLS} placeholder="Nhập lý do tạo mới hoặc các nội dung dự kiến thay đổi..." value={newChangeDesc} onChange={(e) => setNewChangeDesc(e.target.value)}></textarea>
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button type="button" onClick={() => setShowCreateVersionModal(false)} className={BTN_OUTLINE}>Hủy bỏ</button>
              <button
                type="button"
                onClick={() => {
                  const todayStr = new Date().toLocaleDateString('vi-VN');
                  const formattedDate = newEffectiveDate ? new Date(newEffectiveDate).toLocaleDateString('vi-VN') : todayStr;
                  const newItem = {
                    version: newVersionName || 'v3.3',
                    date: todayStr,
                    effectiveDate: formattedDate,
                    user: 'Nguyễn Văn A',
                    changes: newChangeDesc || 'Khởi tạo bản nháp phiên bản mới từ phiên bản hiện tại',
                    status: 'draft'
                  };
                  setVersionHistoryList([newItem, ...versionHistoryList]);
                  setShowCreateVersionModal(false);
                  setSuccessNotificationMessage(`Đã tạo thành công bản nháp phiên bản mới ${newItem.version} từ phiên bản trước.`);
                  setShowSuccessNotification(true);
                }}
                className={BTN_PRIMARY}
              >
                <Save className="w-4 h-4" /> Lưu phiên bản
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
