import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Search, Download, FileText, Printer, TrendingUp, AlertCircle, Calendar, Filter, X, ChevronDown, Check, BarChart2, Eye, Layers, ChevronLeft, ArrowRight, Edit, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Badge, TruncatedText, RowIconAction, Pagination, tabClass, BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, BTN_FOCUS,
  INPUT_CLS, FIELD_LABEL, FIELD_VALUE, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL,
  normalizeSearch,
} from '../collection/collectionUi';
import {
  LineChart, Line as LineR, BarChart, Bar as BarR, XAxis as XAxisR, YAxis as YAxisR,
  CartesianGrid, Tooltip as TooltipR, ResponsiveContainer, Cell
} from 'recharts';
import {
  ApprovalBadge, type ApprovalStatus, type DataCategory, type Row as MasterDataRow,
  COLUMNS as MASTER_DATA_COLUMNS, MOCK_BY_CATEGORY, CATEGORY_LABELS,
} from './MasterDataUpdateItemPage';

const Line = LineR as any;
const Bar = BarR as any;
const XAxis = XAxisR as any;
const YAxis = YAxisR as any;
const Tooltip = TooltipR as any;

type TabType = 'search' | 'usage' | 'lifecycle';

interface SearchFilter {
  keyword: string;
  dataType: string;
  approvalStatus: string;
  dateFrom: string;
  dateTo: string;
}

interface UsageReport {
  id: string;
  dataType: string;
  totalAccess: number;
  totalUsage: number;
  avgResponseTime: number;
  lastAccess: string;
}

// Trạng thái vòng đời — suy ra từ số ngày còn lại tới hạn, hiển thị ở cột "Vòng đời" (tách biệt cột "Trạng thái" phê duyệt)
type LifecycleStage = 'active' | 'warning' | 'expired';

// Số ngày còn lại <= 30 (kể cả 0 và âm) thì chuyển sang "Sắp hết hiệu lực"/"Đã hết hiệu lực"
function getLifecycleStage(daysRemaining: number): LifecycleStage {
  if (daysRemaining < 0) return 'expired';
  if (daysRemaining <= 30) return 'warning';
  return 'active';
}

const LIFECYCLE_STAGE_LABEL: Record<LifecycleStage, string> = {
  active: 'Còn hiệu lực',
  warning: 'Sắp hết hiệu lực',
  expired: 'Đã hết hiệu lực',
};

// Màu quy định cho cột "Số ngày còn lại" và badge "Vòng đời" — dùng chung 1 nguồn để không lệch ngưỡng
const LIFECYCLE_STAGE_TEXT_COLOR: Record<LifecycleStage, string> = {
  active: 'text-[#15803D]',
  warning: 'text-[#D97706]',
  expired: 'text-[#B91C1C]',
};

// Tông Badge (compomennt.md 5.8) — giữ ý nghĩa màu cũ: xanh lá / cam / đỏ
const LIFECYCLE_STAGE_BADGE_VARIANT: Record<LifecycleStage, string> = {
  active: 'green',
  warning: 'orange',
  expired: 'red',
};

// Bảng (compomennt.md 5.3)
const TABLE_WRAP = 'bg-white rounded-lg border border-[#E2E8F0] overflow-hidden';
const TABLE_CLS = 'w-full border-collapse collection-table text-[13px]';
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const TR = 'group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const TOTAL_TR = 'h-12 bg-[#F8FAFC] font-semibold border-b border-[#E0E0E0]';
const EMPTY_TD = 'px-3 py-16 text-center text-[13px] text-[#64748B]';
// Cột Thao tác ghim phải khi bảng cuộn ngang (compomennt.md 5.3.2)
const STICKY_TH = 'sticky right-0 z-[1] bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]';
const STICKY_TD = 'sticky right-0 z-[1] bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]';
// Khung bảng có tiêu đề (giống CategoryTrendAndStatsSection)
const TABLE_HEADER = 'px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between gap-3';
const TABLE_TITLE = 'text-[14px] font-medium text-[#020817]';
// Thẻ biểu đồ
const CHART_CARD = 'bg-white rounded-2xl border border-[#E2E8F0] p-4';
const CHART_TICK = { fontSize: 12, fill: '#64748B' };
const CHART_TOOLTIP_PROPS = {
  contentStyle: { fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' },
  labelStyle: { color: '#64748B' },
};
// Khung điều kiện báo cáo + nút "Truy xuất" (giống CategoryReportStatusPage)
const CONTROL_PANEL = 'bg-white p-4 rounded-2xl border border-[#E2E8F0] relative z-30';
const RUN_BTN_CLS = `h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#10B981] text-white text-[13px] font-medium hover:bg-[#059669] transition-colors ${BTN_FOCUS}`;
const EXPORT_MENU = 'absolute right-0 top-full mt-1 w-44 rounded-lg border border-[#E2E8F0] bg-white shadow-lg p-1 z-50';
const EXPORT_MENU_ITEM = 'w-full text-left min-h-8 px-3 py-1.5 rounded-md hover:bg-[#F1F5F9] text-[13px] text-[#020817] transition-colors cursor-pointer';
// Modal (compomennt.md 5.4)
const MODAL_OVERLAY = 'fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4';
const MODAL_HEADER = 'px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-3 shrink-0';
const MODAL_TITLE = 'text-[16px] font-semibold text-[#020817]';
const MODAL_FOOTER = 'px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 shrink-0';

// Giá trị bộ lọc "Loại dữ liệu" → nhãn loại dữ liệu trong bản ghi (dùng khi lọc kết quả tra cứu)
const DATA_TYPE_FILTER_LABEL: Record<string, string> = {
  congchung: 'Công chứng',
  dangkykinhdoanh: 'Đăng ký kinh doanh',
  tgpl: 'Trợ giúp pháp lý',
  hotich: 'Hộ tịch',
};

// dd/mm/yyyy → yyyy-mm-dd để so sánh với ô chọn ngày
const toIsoDate = (d: string) => {
  const [dd, mm, yyyy] = d.split('/');
  return yyyy && mm && dd ? `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}` : '';
};

// Dữ liệu "Ngày hết hạn/Số ngày còn lại" cho báo cáo vòng đời — không có trong bảng quy định chính thức
// của Cập nhật dữ liệu chủ, nên duy trì riêng tại đây (khớp theo id bản ghi thật của từng thực thể),
// tính theo mốc ngày hiện tại 13/08/2026.
const LIFECYCLE_EXPIRY_BY_CATEGORY: Record<DataCategory, Record<string, { expiryDate: string; daysRemaining: number }>> = {
  'civil-status': {
    '1': { expiryDate: '20/08/2026', daysRemaining: 7 },
    '2': { expiryDate: '10/09/2026', daysRemaining: 28 },
    '3': { expiryDate: '25/08/2026', daysRemaining: 12 },
    '4': { expiryDate: '15/07/2026', daysRemaining: -29 },
    '5': { expiryDate: '01/12/2026', daysRemaining: 110 },
    '6': { expiryDate: '05/06/2026', daysRemaining: -69 },
    '7': { expiryDate: '30/08/2026', daysRemaining: 17 },
  },
  'enforcement-decision': {
    '1': { expiryDate: '01/09/2026', daysRemaining: 19 },
    '2': { expiryDate: '18/08/2026', daysRemaining: 5 },
    '3': { expiryDate: '01/07/2026', daysRemaining: -43 },
    '4': { expiryDate: '20/11/2026', daysRemaining: 99 },
    '5': { expiryDate: '10/09/2026', daysRemaining: 28 },
    '6': { expiryDate: '01/08/2026', daysRemaining: -12 },
    '7': { expiryDate: '01/10/2026', daysRemaining: 49 },
  },
  'legal-document': {
    '1': { expiryDate: '01/10/2026', daysRemaining: 49 },
    '2': { expiryDate: '05/09/2026', daysRemaining: 23 },
    '3': { expiryDate: '01/08/2026', daysRemaining: -12 },
    '4': { expiryDate: '01/12/2026', daysRemaining: 110 },
    '5': { expiryDate: '20/08/2026', daysRemaining: 7 },
    '6': { expiryDate: '01/06/2026', daysRemaining: -73 },
    '7': { expiryDate: '25/08/2026', daysRemaining: 12 },
  },
};

// Mock data
const mockSearchResults: {
  id: string;
  recordCode: string;
  fullName: string;
  dataType: string;
  agency: string;
  birthDate: string;
  cccdNumber: string;
  birthPlace: string;
  approvalStatus: ApprovalStatus;
  updateDate: string;
}[] = [
  {
    id: '1',
    recordCode: 'DLDC-2024-001',
    fullName: 'Nguyễn Văn An',
    dataType: 'Công chứng',
    agency: 'Cục Bổ trợ tư pháp',
    birthDate: '15/01/1990',
    cccdNumber: '001234567890',
    birthPlace: 'Hà Nội',
    approvalStatus: 'approved',
    updateDate: '20/12/2024',
  },
  {
    id: '2',
    recordCode: 'DLDC-2024-002',
    fullName: 'Trần Thị Bình',
    dataType: 'Đăng ký kinh doanh',
    agency: 'Bộ Kế hoạch và Đầu tư',
    birthDate: '22/05/1985',
    cccdNumber: '001234567891',
    birthPlace: 'TP.HCM',
    approvalStatus: 'approved',
    updateDate: '19/12/2024',
  },
  {
    id: '3',
    recordCode: 'DLDC-2024-003',
    fullName: 'Lê Văn Cường',
    dataType: 'Trợ giúp pháp lý',
    agency: 'Cục Trợ giúp pháp lý',
    birthDate: '10/08/1992',
    cccdNumber: '001234567892',
    birthPlace: 'Đà Nẵng',
    approvalStatus: 'pending',
    updateDate: '18/12/2024',
  },
];

// Bước xem chi tiết thực thể dữ liệu chủ — giống stepper ở "Mô hình dữ liệu chủ"
const VIEW_STEPS = [
  { number: 1, title: 'Khởi tạo dữ liệu chủ' },
  { number: 2, title: 'Tạo thuộc tính' },
  { number: 3, title: 'Quy tắc hợp nhất' },
  { number: 4, title: 'Thiết lập quan hệ' },
  { number: 5, title: 'Định danh duy nhất' },
  { number: 6, title: 'Quy tắc đánh phiên bản' },
  { number: 7, title: 'Phê duyệt' },
];

// Hệ thống nguồn tương ứng từng loại dữ liệu — dùng để hiển thị trong modal xem chi tiết
const DATA_TYPE_SYSTEM_NAME: Record<string, string> = {
  'Công chứng': 'CSDL Công chứng điện tử',
  'Đăng ký kinh doanh': 'CSDL Đăng ký doanh nghiệp quốc gia',
  'Trợ giúp pháp lý': 'CSDL Trợ giúp pháp lý',
  'Hộ tịch': 'CSDL Hộ tịch điện tử',
};

// Trạng thái vòng đời hiển thị trong modal, suy ra từ trạng thái phê duyệt của bản ghi
const APPROVAL_TO_LIFECYCLE_LABEL: Record<ApprovalStatus, string> = {
  draft: 'Đang soạn thảo',
  reviewing: 'Đang rà soát',
  pending: 'Đang chờ phê duyệt',
  approved: 'Hiệu lực',
  rejected: 'Từ chối',
  deleted: 'Đã xóa',
};

// Ánh xạ loại dữ liệu (tab Tra cứu) sang mã danh mục dữ liệu chủ (dùng cho nút "Xem dữ liệu" điều hướng tới Cập nhật dữ liệu chủ)
const DATA_TYPE_TO_MASTER_ID: Record<string, string> = {
  'Công chứng': 'md-017',
  'Đăng ký kinh doanh': 'md-001',
  'Trợ giúp pháp lý': 'md-035',
  'Hộ tịch': 'md-002',
};

const mockUsageReports: UsageReport[] = [
  {
    id: '1',
    dataType: 'Công chứng',
    totalAccess: 1250,
    totalUsage: 980,
    avgResponseTime: 1.2,
    lastAccess: '25/12/2024 14:30',
  },
  {
    id: '2',
    dataType: 'Đăng ký kinh doanh',
    totalAccess: 2340,
    totalUsage: 2100,
    avgResponseTime: 0.8,
    lastAccess: '25/12/2024 14:25',
  },
  {
    id: '3',
    dataType: 'Trợ giúp pháp lý',
    totalAccess: 560,
    totalUsage: 450,
    avgResponseTime: 1.5,
    lastAccess: '25/12/2024 13:45',
  },
  {
    id: '4',
    dataType: 'Hộ tịch',
    totalAccess: 890,
    totalUsage: 720,
    avgResponseTime: 1.1,
    lastAccess: '25/12/2024 12:00',
  },
  {
    id: '5',
    dataType: 'Thi hành án dân sự',
    totalAccess: 430,
    totalUsage: 350,
    avgResponseTime: 1.3,
    lastAccess: '25/12/2024 11:10',
  },
  {
    id: '6',
    dataType: 'Giám định tư pháp',
    totalAccess: 310,
    totalUsage: 260,
    avgResponseTime: 1.4,
    lastAccess: '25/12/2024 09:55',
  },
  {
    id: '7',
    dataType: 'Nuôi con nuôi',
    totalAccess: 210,
    totalUsage: 180,
    avgResponseTime: 1.6,
    lastAccess: '25/12/2024 10:40',
  },
  {
    id: '8',
    dataType: 'Trọng tài thương mại',
    totalAccess: 150,
    totalUsage: 120,
    avgResponseTime: 1.8,
    lastAccess: '25/12/2024 09:20',
  },
];

// Dữ liệu biểu đồ: mỗi tháng có giá trị riêng cho từng loại dữ liệu chủ, dùng để tính tổng lượt
// truy cập theo thời gian (biểu đồ đường) — số lượng thực thể có thể tiếp tục tăng lên
const usageTrendData: { name: string; [dataType: string]: number | string }[] = [
  { name: 'Tháng 1', 'Công chứng': 980, 'Đăng ký kinh doanh': 1750, 'Trợ giúp pháp lý': 410, 'Hộ tịch': 620, 'Thi hành án dân sự': 310, 'Giám định tư pháp': 230, 'Nuôi con nuôi': 150, 'Trọng tài thương mại': 100 },
  { name: 'Tháng 2', 'Công chứng': 1050, 'Đăng ký kinh doanh': 1900, 'Trợ giúp pháp lý': 380, 'Hộ tịch': 700, 'Thi hành án dân sự': 340, 'Giám định tư pháp': 250, 'Nuôi con nuôi': 165, 'Trọng tài thương mại': 110 },
  { name: 'Tháng 3', 'Công chứng': 1120, 'Đăng ký kinh doanh': 2050, 'Trợ giúp pháp lý': 450, 'Hộ tịch': 760, 'Thi hành án dân sự': 365, 'Giám định tư pháp': 265, 'Nuôi con nuôi': 175, 'Trọng tài thương mại': 120 },
  { name: 'Tháng 4', 'Công chứng': 1000, 'Đăng ký kinh doanh': 2200, 'Trợ giúp pháp lý': 500, 'Hộ tịch': 810, 'Thi hành án dân sự': 350, 'Giám định tư pháp': 255, 'Nuôi con nuôi': 185, 'Trọng tài thương mại': 125 },
  { name: 'Tháng 5', 'Công chứng': 1180, 'Đăng ký kinh doanh': 2150, 'Trợ giúp pháp lý': 470, 'Hộ tịch': 850, 'Thi hành án dân sự': 390, 'Giám định tư pháp': 280, 'Nuôi con nuôi': 195, 'Trọng tài thương mại': 135 },
  { name: 'Tháng 6', 'Công chứng': 1220, 'Đăng ký kinh doanh': 2280, 'Trợ giúp pháp lý': 540, 'Hộ tịch': 870, 'Thi hành án dân sự': 410, 'Giám định tư pháp': 295, 'Nuôi con nuôi': 200, 'Trọng tài thương mại': 142 },
  { name: 'Tháng 7', 'Công chứng': 1250, 'Đăng ký kinh doanh': 2340, 'Trợ giúp pháp lý': 560, 'Hộ tịch': 890, 'Thi hành án dân sự': 430, 'Giám định tư pháp': 310, 'Nuôi con nuôi': 210, 'Trọng tài thương mại': 150 },
];

const DATA_TYPE_COLORS: Record<string, string> = {
  'Công chứng': '#2563eb',
  'Đăng ký kinh doanh': '#10b981',
  'Trợ giúp pháp lý': '#f59e0b',
  'Hộ tịch': '#8b5cf6',
  'Thi hành án dân sự': '#ef4444',
  'Giám định tư pháp': '#06b6d4',
  'Nuôi con nuôi': '#ec4899',
  'Trọng tài thương mại': '#84cc16',
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Số API đang chia sẻ / lượt gọi API / tỷ lệ API ổn định của từng thực thể dữ liệu chủ (3 loại chính thức
// theo Cập nhật dữ liệu chủ) — dùng cho bảng "Truy cập" (giống thiết kế bảng thống kê danh mục tại
// CategoryTrendAndStatsSection.tsx)
const mockCategoryApiStats: Record<DataCategory, { apiCount: number; stableApiCount: number; apiCalls: number; lastAccess: string }> = {
  'civil-status': { apiCount: 6, stableApiCount: 6, apiCalls: 152640, lastAccess: '13/08/2026 09:15' },
  'enforcement-decision': { apiCount: 4, stableApiCount: 3, apiCalls: 98210, lastAccess: '12/08/2026 16:40' },
  'legal-document': { apiCount: 3, stableApiCount: 2, apiCalls: 35383, lastAccess: '13/08/2026 07:52' },
};

// Dung lượng ước tính trung bình mỗi bản ghi tiêu thụ (giả định, dùng để suy ra dung lượng tiêu thụ ước tính)
const AVG_RECORD_SIZE_KB = 2;

// Tổng lượt tiêu thụ (số bản ghi) theo đúng 3 thực thể dữ liệu chủ chính thức đang có trong
// Cập nhật dữ liệu chủ, dùng cho bảng Tiêu thụ theo thực thể
const mockCategoryConsumption: Record<DataCategory, { totalUsage: number }> = {
  'civil-status': { totalUsage: 42800 },
  'enforcement-decision': { totalUsage: 21500 },
  'legal-document': { totalUsage: 9600 },
};

// Dung lượng tiêu thụ (MB) của các thực thể dữ liệu chủ khác ngoài 3 thực thể chính thức, mock thêm
// nhiều dòng để kiểm chứng chiều cao bảng "Báo cáo tiêu thụ dữ liệu theo thực thể" luôn cố định
// (cuộn bên trong) dù số lượng dữ liệu tăng lên
const mockExtraEntityConsumption: { category: string; usageMB: number }[] = [
  { category: 'Thông tin hộ nghèo, cận nghèo', usageMB: 14.2 },
  { category: 'Danh mục dùng chung', usageMB: 6.8 },
  { category: 'Thông tin bảo trợ xã hội', usageMB: 9.4 },
  { category: 'Danh sách người có công', usageMB: 11.7 },
  { category: 'Thông tin lý lịch tư pháp', usageMB: 7.3 },
];

// Dung lượng tiêu thụ dữ liệu chủ (MB) theo từng đơn vị được cấp quyền khai thác, dùng cho bảng
// "Báo cáo tiêu thụ dữ liệu chủ theo đơn vị được cấp quyền" tại tab Tiêu thụ — mock nhiều dòng để
// kiểm chứng chiều cao bảng luôn cố định (cuộn bên trong) dù số lượng dữ liệu tăng lên
const mockUnitConsumption: { unit: string; usageMB: number }[] = [
  { unit: 'Sở Tư pháp Hà Nội', usageMB: 52.4 },
  { unit: 'Sở Tư pháp TP. Hồ Chí Minh', usageMB: 38.7 },
  { unit: 'Sở Tư pháp Đà Nẵng', usageMB: 24.1 },
  { unit: 'Bộ Lao động - Thương binh và Xã hội', usageMB: 18.5 },
  { unit: 'Sở Tư pháp Hải Phòng', usageMB: 10.6 },
  { unit: 'Sở Tư pháp Cần Thơ', usageMB: 9.2 },
  { unit: 'Sở Tư pháp Bình Dương', usageMB: 7.8 },
  { unit: 'Sở Tư pháp Nghệ An', usageMB: 6.1 },
];

interface MasterDataReportsPageProps {
  onNavigate?: (page: string) => void;
}

export default function MasterDataReportsPage({ onNavigate }: MasterDataReportsPageProps = {}) {
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [showFilters, setShowFilters] = useState(true);
  const [searchFilters, setSearchFilters] = useState<SearchFilter>({
    keyword: '',
    dataType: '',
    approvalStatus: '',
    dateFrom: '',
    dateTo: '',
  });
  const [searchResults, setSearchResults] = useState(mockSearchResults);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewStep, setViewStep] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ─── Báo cáo sử dụng dữ liệu chủ ────────────────────────────────────────
  // Loại báo cáo: Truy cập (hệ thống kết nối) / Tiêu thụ (khối lượng đã lấy) / Thống kê (xu hướng theo thời gian)
  const [usageReportType, setUsageReportType] = useState<'access' | 'consumption' | 'stats'>('access');
  const [usageDateRange, setUsageDateRange] = useState('6months');
  const currentYear = new Date().getFullYear();
  const [usageStatMonth, setUsageStatMonth] = useState(new Date().getMonth() + 1);
  const [usageStatYear, setUsageStatYear] = useState(currentYear);
  const [showUsageExportMenu, setShowUsageExportMenu] = useState(false);
  const [hasSearchedUsage, setHasSearchedUsage] = useState(false);
  const [appliedUsageReports, setAppliedUsageReports] = useState(mockUsageReports);
  // Điều kiện đã áp dụng — chỉ cập nhật khi bấm "Truy xuất báo cáo"
  const [appliedUsageReportType, setAppliedUsageReportType] = useState<'access' | 'consumption' | 'stats'>('access');
  const [appliedUsageDateRange, setAppliedUsageDateRange] = useState('6months');
  const [appliedUsageStatMonth, setAppliedUsageStatMonth] = useState(new Date().getMonth() + 1);

  // ─── Báo cáo vòng đời dữ liệu chủ ───────────────────────────────────────
  // Chỉ chọn 1 thực thể dữ liệu chủ (không còn "Tất cả thực thể"), bảng dưới lấy đúng bản ghi
  // của thực thể đó trong Cập nhật dữ liệu chủ (MOCK_BY_CATEGORY).
  const [lifecycleCategory, setLifecycleCategory] = useState<DataCategory>('civil-status');
  const [showLifecycleExportMenu, setShowLifecycleExportMenu] = useState(false);
  const [hasSearchedLifecycle, setHasSearchedLifecycle] = useState(false);
  const [appliedLifecycleCategory, setAppliedLifecycleCategory] = useState<DataCategory>('civil-status');
  const [appliedLifecycleData, setAppliedLifecycleData] = useState<MasterDataRow[]>([]);
  const [lifecycleDetailRow, setLifecycleDetailRow] = useState<MasterDataRow | null>(null);

  const usageExportRef = useRef<HTMLDivElement | null>(null);
  const lifecycleExportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (usageExportRef.current && !usageExportRef.current.contains(e.target as Node)) {
        setShowUsageExportMenu(false);
      }
      if (lifecycleExportRef.current && !lifecycleExportRef.current.contains(e.target as Node)) {
        setShowLifecycleExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearchLifecycle = () => {
    setAppliedLifecycleCategory(lifecycleCategory);
    setAppliedLifecycleData(MOCK_BY_CATEGORY[lifecycleCategory]);
    setHasSearchedLifecycle(true);
  };

  const handleExportLifecycleFile = (format: string) => {
    setShowLifecycleExportMenu(false);
    toast.info(`Đang xuất dữ liệu sang định dạng ${format}...`);
  };

  const handleSearchUsage = () => {
    setAppliedUsageReports(mockUsageReports);
    setAppliedUsageReportType(usageReportType);
    setAppliedUsageDateRange(usageDateRange);
    setAppliedUsageStatMonth(usageStatMonth);
    setHasSearchedUsage(true);
  };

  const handleExportUsageFile = (format: string) => {
    setShowUsageExportMenu(false);
    toast.info(`Đang xuất dữ liệu sang định dạng ${format}...`);
  };

  const totalPages = Math.max(1, Math.ceil(searchResults.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedResults = searchResults.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startItem = searchResults.length === 0 ? 0 : (safePage - 1) * pageSize + 1;

  // Tìm kiếm/bộ lọc chỉ áp dụng khi bấm Tìm kiếm hoặc Enter (compomennt.md 5.19)
  const applySearchFilters = (filters: SearchFilter) => {
    const kw = normalizeSearch(filters.keyword);
    const typeLabel = DATA_TYPE_FILTER_LABEL[filters.dataType];
    setSearchResults(mockSearchResults.filter(r => {
      if (kw && !normalizeSearch(r.recordCode).includes(kw) && !normalizeSearch(r.fullName).includes(kw)) return false;
      if (typeLabel && r.dataType !== typeLabel) return false;
      if (filters.approvalStatus && r.approvalStatus !== filters.approvalStatus) return false;
      const iso = toIsoDate(r.updateDate);
      if (filters.dateFrom && iso < filters.dateFrom) return false;
      if (filters.dateTo && iso > filters.dateTo) return false;
      return true;
    }));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    applySearchFilters(searchFilters);
  };

  const handleResetFilters = () => {
    const empty: SearchFilter = {
      keyword: '',
      dataType: '',
      approvalStatus: '',
      dateFrom: '',
      dateTo: '',
    };
    setSearchFilters(empty);
    applySearchFilters(empty);
  };

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setViewStep(1);
    setShowDetailModal(true);
  };

  const handleGoToUpdate = (record: any) => {
    const masterId = DATA_TYPE_TO_MASTER_ID[record.dataType] ?? 'md-001';
    onNavigate?.(`master-data-goto-${masterId}`);
  };

  const handleExportExcel = () => {
    toast.info('Đang xuất file Excel...');
  };

  const handleExportPDF = () => {
    toast.info('Đang xuất file PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-auto bg-[#F8FAFC]">
      <div className="p-6">
        {/* Tabs (compomennt.md 5.9) */}
        <div className="mb-6">
          <div className="flex border-b border-[#E2E8F0] overflow-x-auto bg-white">
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`${tabClass(activeTab === 'search')} whitespace-nowrap`}
            >
              <Search className="w-4 h-4" />
              Tra cứu dữ liệu chủ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('usage')}
              className={`${tabClass(activeTab === 'usage')} whitespace-nowrap`}
            >
              <TrendingUp className="w-4 h-4" />
              Báo cáo sử dụng dữ liệu chủ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lifecycle')}
              className={`${tabClass(activeTab === 'lifecycle')} whitespace-nowrap`}
            >
              <Calendar className="w-4 h-4" />
              Báo cáo vòng đời dữ liệu
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-6">
            {/* Search Tab */}
            {activeTab === 'search' && (
              <div className="space-y-4">
                {/* Thanh tìm kiếm + bộ lọc (compomennt.md 5.19) — chỉ áp dụng khi bấm Tìm kiếm hoặc Enter */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        aria-label="Tìm kiếm theo mã, tên bản ghi dữ liệu chủ"
                        title="Tìm kiếm theo mã, tên bản ghi dữ liệu chủ"
                        value={searchFilters.keyword}
                        onChange={(e) =>
                          setSearchFilters({ ...searchFilters, keyword: e.target.value })
                        }
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                        placeholder="Nhập mã hoặc tên bản ghi..."
                        className={SEARCH_INPUT_CLS}
                      />
                    </div>
                    <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={handleSearch} className={SEARCH_BTN_CLS}>
                      <Search className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Bộ lọc tìm kiếm"
                      title="Bộ lọc tìm kiếm"
                      aria-expanded={showFilters}
                      onClick={() => setShowFilters(prev => !prev)}
                      className={filterBtnClass(showFilters)}
                    >
                      {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                    </button>
                  </div>

                  {showFilters && (
                    <div className={FILTER_GRID_CLS}>
                      <div>
                        <label className={FILTER_LABEL}>Loại dữ liệu</label>
                        <select
                          title="Loại dữ liệu"
                          value={searchFilters.dataType}
                          onChange={(e) =>
                            setSearchFilters({ ...searchFilters, dataType: e.target.value })
                          }
                          className={INPUT_CLS}
                        >
                          <option value="">Tất cả</option>
                          <option value="congchung">Công chứng</option>
                          <option value="dangkykinhdoanh">Đăng ký kinh doanh</option>
                          <option value="tgpl">Trợ giúp pháp lý</option>
                          <option value="hotich">Hộ tịch</option>
                        </select>
                      </div>
                      <div>
                        <label className={FILTER_LABEL}>Trạng thái phê duyệt</label>
                        <select
                          title="Trạng thái phê duyệt"
                          value={searchFilters.approvalStatus}
                          onChange={(e) =>
                            setSearchFilters({ ...searchFilters, approvalStatus: e.target.value })
                          }
                          className={INPUT_CLS}
                        >
                          <option value="">Tất cả</option>
                          <option value="draft">Chưa phê duyệt</option>
                          <option value="reviewing">Rà soát</option>
                          <option value="pending">Chờ phê duyệt</option>
                          <option value="approved">Đã phê duyệt</option>
                          <option value="rejected">Từ chối</option>
                          <option value="deleted">Đã xóa</option>
                        </select>
                      </div>
                      <div>
                        <label className={FILTER_LABEL}>Từ ngày</label>
                        <input
                          type="date"
                          title="Từ ngày"
                          value={searchFilters.dateFrom}
                          onChange={(e) =>
                            setSearchFilters({ ...searchFilters, dateFrom: e.target.value })
                          }
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                          className={INPUT_CLS}
                        />
                      </div>
                      <div>
                        <label className={FILTER_LABEL}>Đến ngày</label>
                        <input
                          type="date"
                          title="Đến ngày"
                          value={searchFilters.dateTo}
                          onChange={(e) =>
                            setSearchFilters({ ...searchFilters, dateTo: e.target.value })
                          }
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                          className={INPUT_CLS}
                        />
                      </div>
                      <div className="flex items-end">
                        <button type="button" onClick={handleResetFilters} className={`${BTN_OUTLINE} w-full`}>
                          Xóa bộ lọc
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Results Section */}
                <div className={TABLE_WRAP}>
                  <div className={TABLE_HEADER}>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#64748B]" />
                      <h3 className={TABLE_TITLE}>
                        Kết quả tìm kiếm (<span className="tabular-nums">{searchResults.length}</span> bản ghi)
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={handlePrint} className={BTN_OUTLINE}>
                        <Printer className="w-4 h-4" />
                        In
                      </button>
                      <button type="button" onClick={handleExportExcel} className={BTN_OUTLINE}>
                        <Download className="w-4 h-4" />
                        Excel
                      </button>
                      <button type="button" onClick={handleExportPDF} className={BTN_OUTLINE}>
                        <Download className="w-4 h-4" />
                        PDF
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto custom-scrollbar">
                    <table className={TABLE_CLS}>
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px]">
                          <th className={`${TH} text-center w-14`}>STT</th>
                          <th className={`${TH} text-left`}>Mã dữ liệu</th>
                          <th className={`${TH} text-left`}>Tên dữ liệu chủ</th>
                          <th className={`${TH} text-left`}>Loại dữ liệu</th>
                          <th className={`${TH} text-left`}>Cơ quan quản lý</th>
                          <th className={`${TH} text-left`}>Ngày cập nhật</th>
                          <th className={`${TH} text-left`}>Trạng thái phê duyệt</th>
                          <th className={`${TH} text-center ${STICKY_TH}`}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedResults.length === 0 && (
                          <tr>
                            <td colSpan={8} className={EMPTY_TD}>Không tìm thấy bản ghi phù hợp</td>
                          </tr>
                        )}
                        {paginatedResults.map((record, index) => (
                          <tr key={record.id} className={TR}>
                            <td className={`${TD} text-center`}>{startItem + index}</td>
                            <td className={`${TD} text-left whitespace-nowrap text-blue-600`}>{record.recordCode}</td>
                            <td className={`${TD} text-left max-w-[360px]`}><TruncatedText text={record.fullName} /></td>
                            <td className={`${TD} text-left max-w-[240px]`}><TruncatedText text={record.dataType} /></td>
                            <td className={`${TD} text-left max-w-[280px]`}><TruncatedText text={record.agency} /></td>
                            <td className={`${TD} text-left whitespace-nowrap`}>{record.updateDate}</td>
                            <td className={`${TD} text-left`}>
                              <ApprovalBadge status={record.approvalStatus} />
                            </td>
                            <td className={`${TD} text-center ${STICKY_TD}`}>
                              <div className="flex items-center justify-center gap-1">
                                <RowIconAction label="Xem chi tiết bản ghi" onClick={() => handleViewDetail(record)}>
                                  <Eye className="w-4 h-4" />
                                </RowIconAction>
                                <RowIconAction label="Xem dữ liệu tại Cập nhật dữ liệu chủ" onClick={() => handleGoToUpdate(record)}>
                                  <Layers className="w-4 h-4" />
                                </RowIconAction>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination (compomennt.md 5.14) */}
                  {searchResults.length > 0 && (
                    <Pagination
                      className="border-t border-[#E2E8F0]"
                      currentPage={safePage}
                      totalItems={searchResults.length}
                      pageSize={pageSize}
                      pageSizeOptions={PAGE_SIZE_OPTIONS}
                      onPageChange={setCurrentPage}
                      onPageSizeChange={setPageSize}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Usage Report Tab */}
            {activeTab === 'usage' && (
              <div className="space-y-6">
                {/* Control Panel */}
                <div className={CONTROL_PANEL}>
                  <div className="flex flex-wrap items-end gap-3">

                    {/* Loại báo cáo: Truy cập / Tiêu thụ / Thống kê */}
                    <div className="flex-1 min-w-[220px]">
                      <label className={FILTER_LABEL}>Loại báo cáo</label>
                      <select
                        title="Loại báo cáo"
                        value={usageReportType}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setUsageReportType(e.target.value as typeof usageReportType)}
                        className={INPUT_CLS}
                      >
                        <option value="access">Truy cập</option>
                        <option value="consumption">Tiêu thụ</option>
                        <option value="stats">Thống kê</option>
                      </select>
                    </div>

                    {/* Thời gian */}
                    <div className="flex-1 min-w-[220px]">
                      <label className={FILTER_LABEL}>Thời gian thống kê</label>
                      <select
                        title="Thời gian thống kê"
                        value={usageDateRange}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setUsageDateRange(e.target.value)}
                        className={INPUT_CLS}
                      >
                        <option value="this_month">Trong tháng</option>
                        <option value="6months">6 tháng</option>
                        <option value="year">Trong năm</option>
                      </select>
                    </div>

                    {/* Chọn tháng — chỉ hiện khi Thời gian thống kê = Trong tháng */}
                    {usageDateRange === 'this_month' && (
                      <div className="min-w-[160px]">
                        <label className={FILTER_LABEL}>Chọn tháng</label>
                        <select
                          title="Chọn tháng"
                          value={usageStatMonth}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setUsageStatMonth(Number(e.target.value))}
                          className={INPUT_CLS}
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{`Tháng ${m}/${currentYear}`}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Chọn năm — chỉ hiện khi Thời gian thống kê = Trong năm */}
                    {usageDateRange === 'year' && (
                      <div className="min-w-[160px]">
                        <label className={FILTER_LABEL}>Chọn năm</label>
                        <select
                          title="Chọn năm"
                          value={usageStatYear}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setUsageStatYear(Number(e.target.value))}
                          className={INPUT_CLS}
                        >
                          {[currentYear, currentYear - 1, currentYear - 2].map(y => (
                            <option key={y} value={y}>{`Năm ${y}`}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSearchUsage}
                      className={`${RUN_BTN_CLS} shrink-0`}
                    >
                      <Search className="w-4 h-4" />
                      Truy xuất báo cáo
                    </button>

                    <div className="relative shrink-0" ref={usageExportRef}>
                      <button
                        type="button"
                        onClick={() => setShowUsageExportMenu(prev => !prev)}
                        className={BTN_OUTLINE}
                      >
                        <FileText className="w-4 h-4" />
                        Xuất File
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {showUsageExportMenu && (
                        <div className={EXPORT_MENU}>
                          {['Excel', 'PDF', 'CSV'].map(fmt => (
                            <button
                              key={fmt}
                              type="button"
                              onClick={() => handleExportUsageFile(fmt)}
                              className={EXPORT_MENU_ITEM}
                            >
                              {fmt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chưa truy xuất — empty state */}
                {!hasSearchedUsage && (
                  <div className="bg-white border border-[#E2E8F0] rounded-2xl flex flex-col items-center justify-center py-20 gap-4">
                    <BarChart2 className="w-12 h-12 text-[#CBD5E1]" />
                    <p className="text-[13px] text-[#64748B]">Chọn điều kiện lọc và bấm <span className="text-[#334155] font-medium">Truy xuất báo cáo</span> để xem kết quả</p>
                  </div>
                )}

                {/* Thống kê — tổng lượt truy cập theo thời gian (gộp mọi thực thể, tránh rối khi số thực
                    thể dữ liệu chủ tăng lên) + tần suất khai thác chi tiết theo từng thực thể */}
                {hasSearchedUsage && appliedUsageReportType === 'stats' && (() => {
                  const monthlyTrendData = usageTrendData.map(row => ({
                    name: row.name,
                    total: appliedUsageReports.reduce(
                      (sum, rep) => sum + (typeof row[rep.dataType] === 'number' ? (row[rep.dataType] as number) : 0),
                      0
                    ),
                  }));

                  // Trong tháng — quy đổi trục hoành thành 30 ngày, dựa trên tổng lượt truy cập
                  // trung bình mỗi ngày (tổng lượt truy cập trong kỳ / 30), có dao động nhẹ cho tự nhiên
                  const totalMonthlyAccess = appliedUsageReports.reduce((sum, rep) => sum + rep.totalAccess, 0);
                  const dailyBase = totalMonthlyAccess / 30;
                  const dailyTrendData = Array.from({ length: 30 }, (_, i) => {
                    const day = i + 1;
                    const variation = 1 + Math.sin(day / 4) * 0.15;
                    return { name: `${day}`, total: Math.round(dailyBase * variation) };
                  });

                  const isMonthView = appliedUsageDateRange === 'this_month';
                  const totalAccessTrendData = isMonthView ? dailyTrendData : monthlyTrendData;

                  return (
                    <div className="space-y-4">
                      <div className={CHART_CARD}>
                        <p className="text-[14px] font-medium text-[#020817] mb-3">
                          {isMonthView
                            ? `Tổng lượt truy cập dữ liệu chủ theo ngày trong Tháng ${appliedUsageStatMonth}/${currentYear} (lượt truy cập)`
                            : 'Tổng lượt truy cập dữ liệu chủ theo thời gian (lượt truy cập)'}
                        </p>
                        <div className={isMonthView ? 'h-72' : 'h-64'}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={totalAccessTrendData} margin={{ top: 10, right: 30, left: 0, bottom: isMonthView ? 20 : 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                              <XAxis
                                dataKey="name"
                                tick={CHART_TICK}
                                interval={isMonthView ? 1 : 0}
                                height={isMonthView ? 50 : 30}
                                label={isMonthView ? { value: '(Ngày)', position: 'insideBottomLeft', offset: -18, fontSize: 12, fill: '#64748B' } : undefined}
                              />
                              <YAxis tick={CHART_TICK} />
                              <Tooltip {...CHART_TOOLTIP_PROPS} />
                              <Line
                                type="monotone"
                                dataKey="total"
                                name="Tổng lượt truy cập"
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className={CHART_CARD}>
                        <p className="text-[14px] font-medium text-[#020817] mb-3">Tần suất khai thác dữ liệu chủ theo thực thể (tổng lượt truy cập trong kỳ)</p>
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={appliedUsageReports.map(rep => ({ name: rep.dataType, totalAccess: rep.totalAccess }))}
                              margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                              barCategoryGap="20%"
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                              <XAxis
                                dataKey="name"
                                interval={0}
                                angle={-30}
                                textAnchor="end"
                                height={60}
                                tick={CHART_TICK}
                              />
                              <YAxis tick={CHART_TICK} />
                              <Tooltip {...CHART_TOOLTIP_PROPS} />
                              <Bar dataKey="totalAccess" name="Lượt truy cập" radius={[4, 4, 0, 0]} maxBarSize={24}>
                                {appliedUsageReports.map(rep => (
                                  <Cell key={rep.dataType} fill={DATA_TYPE_COLORS[rep.dataType] ?? '#94A3B8'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Tiêu thụ — đúng 3 thực thể dữ liệu chủ chính thức đang có trong Cập nhật dữ liệu chủ,
                    bảng + biểu đồ tăng trưởng chia 2 cột cùng hàng */}
                {hasSearchedUsage && appliedUsageReportType === 'consumption' && (() => {
                  const consumptionRows = [
                    ...(Object.keys(CATEGORY_LABELS) as DataCategory[]).map(cat => ({
                      category: CATEGORY_LABELS[cat],
                      usageMB: (mockCategoryConsumption[cat].totalUsage * AVG_RECORD_SIZE_KB) / 1024,
                    })),
                    ...mockExtraEntityConsumption,
                  ];
                  const totalUsageMB = consumptionRows.reduce((acc, r) => acc + r.usageMB, 0);
                  const totalUnitUsageMB = mockUnitConsumption.reduce((acc, r) => acc + r.usageMB, 0);
                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                      <div className={`${TABLE_WRAP} flex flex-col`}>
                        <div className={TABLE_HEADER}>
                          <p className={TABLE_TITLE}>Báo cáo tiêu thụ dữ liệu theo thực thể</p>
                        </div>
                        <div className="overflow-auto h-[320px] custom-scrollbar">
                          <table className={`master-data-consumption-table ${TABLE_CLS}`}>
                            <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
                              <tr className="h-[42px]">
                                <th className={`${TH} text-center w-12`}>STT</th>
                                <th className={`${TH} text-left`}>Thực thể dữ liệu chủ</th>
                                <th className={`${TH} text-right`}>Dung lượng tiêu thụ ước tính</th>
                              </tr>
                            </thead>
                            <tbody>
                              {consumptionRows.map((item, idx) => (
                                <tr key={idx} className={TR}>
                                  <td className={`${TD} text-center`}>{idx + 1}</td>
                                  <td className={`${TD} text-left max-w-[360px]`}><TruncatedText text={item.category} /></td>
                                  <td className={`${TD} text-right tabular-nums whitespace-nowrap`}>
                                    {item.usageMB.toFixed(1)} MB
                                  </td>
                                </tr>
                              ))}
                              <tr className={TOTAL_TR}>
                                <td colSpan={2} className={`${TD} text-center`}>Tổng tiêu thụ</td>
                                <td className={`${TD} text-right tabular-nums whitespace-nowrap`}>
                                  {totalUsageMB.toFixed(1)} MB
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className={`${TABLE_WRAP} flex flex-col`}>
                        <div className={TABLE_HEADER}>
                          <p className={TABLE_TITLE}>Báo cáo tiêu thụ dữ liệu chủ theo đơn vị được cấp quyền</p>
                        </div>
                        <div className="overflow-auto h-[320px] custom-scrollbar">
                          <table className={`master-data-consumption-table ${TABLE_CLS}`}>
                            <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
                              <tr className="h-[42px]">
                                <th className={`${TH} text-left`}>Đơn vị</th>
                                <th className={`${TH} text-right`}>Dung lượng tiêu thụ (MB)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mockUnitConsumption.map((item, idx) => (
                                <tr key={idx} className={TR}>
                                  <td className={`${TD} text-left max-w-[360px]`}><TruncatedText text={item.unit} /></td>
                                  <td className={`${TD} text-right tabular-nums whitespace-nowrap`}>{item.usageMB.toFixed(1)} MB</td>
                                </tr>
                              ))}
                              <tr className={TOTAL_TR}>
                                <td className={`${TD} text-center`}>Tổng tiêu thụ</td>
                                <td className={`${TD} text-right tabular-nums whitespace-nowrap`}>{totalUnitUsageMB.toFixed(1)} MB</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Truy cập — bảng thống kê danh mục dữ liệu chủ đang chia sẻ qua API, giống thiết kế bảng
                    thống kê danh mục tại CategoryTrendAndStatsSection.tsx (Báo cáo khai thác danh mục) */}
                {hasSearchedUsage && appliedUsageReportType === 'access' && (() => {
                  const accessRows = (Object.keys(CATEGORY_LABELS) as DataCategory[]).map(cat => ({
                    category: CATEGORY_LABELS[cat],
                    ...mockCategoryApiStats[cat],
                  }));
                  const totalApiCount = accessRows.reduce((acc, curr) => acc + curr.apiCount, 0);
                  const totalStableApiCount = accessRows.reduce((acc, curr) => acc + curr.stableApiCount, 0);
                  const totalApiCalls = accessRows.reduce((acc, curr) => acc + curr.apiCalls, 0);
                  return (
                    <div className={TABLE_WRAP}>
                      <div className={TABLE_HEADER}>
                        <p className={TABLE_TITLE}>Báo cáo truy cập dữ liệu thực thể chủ</p>
                      </div>
                      <div className="overflow-x-auto custom-scrollbar">
                        <table className={`exploitation-report-table ${TABLE_CLS}`}>
                          <thead className="bg-[#F8FAFC]">
                            <tr className="h-[42px]">
                              <th className={`${TH} text-center w-12`}>STT</th>
                              <th className={`${TH} text-left`}>Thực thể dữ liệu chủ</th>
                              <th className={`${TH} text-right`}>Số API đang chia sẻ</th>
                              <th className={`${TH} text-right`}>Lượt gọi API</th>
                              <th className={`${TH} text-left`}>Tỷ lệ API ổn định</th>
                              <th className={`${TH} text-left`}>Truy cập gần nhất</th>
                            </tr>
                          </thead>
                          <tbody>
                            {accessRows.length === 0 && (
                              <tr>
                                <td colSpan={6} className={EMPTY_TD}>Không có dữ liệu phù hợp</td>
                              </tr>
                            )}
                            {accessRows.map((item, idx) => {
                              const [datePart, timePart] = item.lastAccess.split(' ');
                              return (
                                <tr key={idx} className={TR}>
                                  <td className={`${TD} text-center`}>{idx + 1}</td>
                                  <td className={`${TD} text-left max-w-[360px]`}><TruncatedText text={item.category} /></td>
                                  <td className={`${TD} text-right tabular-nums`}>{item.apiCount}</td>
                                  <td className={`${TD} text-right tabular-nums`}>{item.apiCalls.toLocaleString()}</td>
                                  <td className={`${TD} text-left`}>
                                    <Badge
                                      label={`${item.stableApiCount}/${item.apiCount} API ổn định`}
                                      variant={item.stableApiCount === item.apiCount ? 'green' : 'amber'}
                                    />
                                  </td>
                                  <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                                    <div>{datePart}</div>
                                    {timePart && <div className="text-[#64748B]">{timePart}</div>}
                                  </td>
                                </tr>
                              );
                            })}
                            {accessRows.length > 0 && (
                              <tr className={TOTAL_TR}>
                                <td colSpan={2} className={`${TD} text-center`}>Tổng cộng</td>
                                <td className={`${TD} text-right tabular-nums`}>{totalApiCount}</td>
                                <td className={`${TD} text-right tabular-nums`}>{totalApiCalls.toLocaleString()}</td>
                                <td className={`${TD} text-left`}>
                                  <Badge
                                    label={`${totalStableApiCount}/${totalApiCount} API ổn định`}
                                    variant={totalStableApiCount === totalApiCount ? 'green' : 'amber'}
                                  />
                                </td>
                                <td className={`${TD} text-left text-[#94A3B8]`}>—</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Lifecycle Report Tab */}
            {activeTab === 'lifecycle' && (
              <div className="space-y-6">
                {/* Control Panel */}
                <div className={CONTROL_PANEL}>
                  <div className="flex flex-wrap items-end gap-3">

                    {/* Chọn 1 thực thể dữ liệu chủ (không còn "Tất cả thực thể") */}
                    <div className="flex-1 min-w-[260px]">
                      <label className={FILTER_LABEL}>Chọn thực thể dữ liệu chủ</label>
                      <select
                        title="Chọn thực thể dữ liệu chủ"
                        value={lifecycleCategory}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setLifecycleCategory(e.target.value as DataCategory)}
                        className={INPUT_CLS}
                      >
                        {(Object.keys(CATEGORY_LABELS) as DataCategory[]).map(cat => (
                          <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleSearchLifecycle}
                      className={`${RUN_BTN_CLS} shrink-0`}
                    >
                      <Search className="w-4 h-4" />
                      Truy xuất báo cáo
                    </button>

                    <div className="relative shrink-0" ref={lifecycleExportRef}>
                      <button
                        type="button"
                        onClick={() => setShowLifecycleExportMenu(prev => !prev)}
                        className={BTN_OUTLINE}
                      >
                        <FileText className="w-4 h-4" />
                        Xuất File
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {showLifecycleExportMenu && (
                        <div className={EXPORT_MENU}>
                          {['Excel', 'PDF', 'CSV'].map(fmt => (
                            <button
                              key={fmt}
                              type="button"
                              onClick={() => handleExportLifecycleFile(fmt)}
                              className={EXPORT_MENU_ITEM}
                            >
                              {fmt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chưa truy xuất — empty state */}
                {!hasSearchedLifecycle && (
                  <div className="bg-white border border-[#E2E8F0] rounded-2xl flex flex-col items-center justify-center py-20 gap-4">
                    <BarChart2 className="w-12 h-12 text-[#CBD5E1]" />
                    <p className="text-[13px] text-[#64748B]">Chọn thực thể dữ liệu chủ và bấm <span className="text-[#334155] font-medium">Truy xuất báo cáo</span> để xem kết quả</p>
                  </div>
                )}

                {hasSearchedLifecycle && (() => {
                  const expiryMap = LIFECYCLE_EXPIRY_BY_CATEGORY[appliedLifecycleCategory];
                  const cols = MASTER_DATA_COLUMNS[appliedLifecycleCategory];
                  // Bảng chính chỉ hiển thị tối đa 7 trường: 4 trường định danh đầu tiên + Hiệu lực + Số ngày còn lại + Vòng đời.
                  // Các trường còn lại (kể cả Trạng thái phê duyệt) xem trong modal "Xem chi tiết".
                  const visibleCols = cols.filter(col => col.key !== 'hieuLuc').slice(0, 4);
                  const getDaysRemaining = (row: MasterDataRow) => expiryMap[row.id]?.daysRemaining ?? 0;
                  const activeCount = appliedLifecycleData.filter(d => getLifecycleStage(getDaysRemaining(d)) === 'active').length;
                  const warningCount = appliedLifecycleData.filter(d => getLifecycleStage(getDaysRemaining(d)) === 'warning').length;
                  const expiredCount = appliedLifecycleData.filter(d => getLifecycleStage(getDaysRemaining(d)) === 'expired').length;
                  const lifecycleCards = [
                    { label: 'Còn hiệu lực', value: activeCount, note: 'Còn hơn 30 ngày', icon: CheckCircle2, bg: 'bg-green-50', fg: 'text-green-600' },
                    { label: 'Sắp hết hiệu lực', value: warningCount, note: 'Còn từ 0-30 ngày', icon: Clock, bg: 'bg-orange-50', fg: 'text-orange-600' },
                    { label: 'Đã hết hiệu lực', value: expiredCount, note: 'Cần xử lý ngay', icon: XCircle, bg: 'bg-red-50', fg: 'text-red-600' },
                  ];
                  return (
                    <>
                      {/* Warning Alert */}
                      {(warningCount > 0 || expiredCount > 0) && (
                        <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-[#D97706] flex-shrink-0" />
                            <div>
                              <h4 className="text-[13px] font-medium text-[#020817] mb-1">
                                Cảnh báo dữ liệu sắp hết hiệu lực
                              </h4>
                              <p className="text-[13px] text-[#020817]">
                                Có <strong className="font-semibold">{warningCount} bản ghi</strong> sắp hết hiệu lực trong 30 ngày tới và{' '}
                                <strong className="font-semibold">{expiredCount} bản ghi</strong> đã hết hiệu lực cần xử lý.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Lifecycle Status Cards (compomennt.md 5.6.1) */}
                      <div className="grid grid-cols-3 gap-4">
                        {lifecycleCards.map(card => {
                          const Icon = card.icon;
                          return (
                            <div key={card.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${card.bg}`}>
                                  <Icon className={`w-5 h-5 ${card.fg}`} />
                                </div>
                                <div>
                                  <div className="text-[16px] text-[#64748B]">{card.label}</div>
                                  <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{card.value}</div>
                                  <div className="text-[12px] text-[#64748B]">{card.note}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Lifecycle Table — giá trị các bản ghi thật của thực thể đã chọn (lấy từ Cập nhật dữ liệu chủ) */}
                      <div className={TABLE_WRAP}>
                        <div className={TABLE_HEADER}>
                          <h3 className={TABLE_TITLE}>
                            Chi tiết vòng đời dữ liệu — {CATEGORY_LABELS[appliedLifecycleCategory]}
                          </h3>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar">
                          <table className={TABLE_CLS}>
                            <thead className="bg-[#F8FAFC]">
                              <tr className="h-[42px]">
                                <th className={`${TH} text-center w-14`}>STT</th>
                                {visibleCols.map(col => (
                                  <th key={col.key} className={`${TH} text-left`}>
                                    {col.label}
                                  </th>
                                ))}
                                <th className={`${TH} text-left`}>Hiệu lực</th>
                                <th className={`${TH} text-left`}>Số ngày còn lại</th>
                                <th className={`${TH} text-left`}>Vòng đời</th>
                                <th className={`${TH} text-center ${STICKY_TH}`}>Thao tác</th>
                              </tr>
                            </thead>
                            <tbody>
                              {appliedLifecycleData.length === 0 && (
                                <tr>
                                  <td colSpan={visibleCols.length + 5} className={EMPTY_TD}>
                                    Không có bản ghi phù hợp với thực thể đã chọn
                                  </td>
                                </tr>
                              )}
                              {appliedLifecycleData.map((row, index) => {
                                const info = expiryMap[row.id];
                                const daysRemaining = info?.daysRemaining ?? 0;
                                const stage = getLifecycleStage(daysRemaining);
                                return (
                                  <tr key={row.id} className={TR}>
                                    <td className={`${TD} text-center`}>{index + 1}</td>
                                    {visibleCols.map(col => (
                                      <td key={col.key} className={`${TD} text-left max-w-[220px]`}>
                                        {row[col.key]
                                          ? <TruncatedText text={row[col.key]} />
                                          : <span className="text-[#94A3B8]">(trống)</span>}
                                      </td>
                                    ))}
                                    <td className={`${TD} text-left whitespace-nowrap`}>
                                      {row.hieuLuc || <span className="text-[#94A3B8]">(trống)</span>}
                                    </td>
                                    <td className={`${TD} text-left whitespace-nowrap`}>
                                      <span className={LIFECYCLE_STAGE_TEXT_COLOR[stage]}>
                                        {daysRemaining < 0
                                          ? `Quá hạn ${Math.abs(daysRemaining)} ngày`
                                          : `${daysRemaining} ngày`}
                                      </span>
                                    </td>
                                    <td className={`${TD} text-left`}>
                                      <Badge label={LIFECYCLE_STAGE_LABEL[stage]} variant={LIFECYCLE_STAGE_BADGE_VARIANT[stage]} />
                                    </td>
                                    <td className={`${TD} text-center ${STICKY_TD}`}>
                                      <div className="flex items-center justify-center">
                                        <RowIconAction label="Xem chi tiết bản ghi" onClick={() => setLifecycleDetailRow(row)}>
                                          <Eye className="w-4 h-4" />
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
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lifecycle Detail Modal — tham khảo modal "Chi tiết bản ghi" tại Cập nhật dữ liệu chủ */}
      {lifecycleDetailRow && (() => {
        const detailCols = MASTER_DATA_COLUMNS[appliedLifecycleCategory];
        const info = LIFECYCLE_EXPIRY_BY_CATEGORY[appliedLifecycleCategory][lifecycleDetailRow.id];
        const daysRemaining = info?.daysRemaining ?? 0;
        const stage = getLifecycleStage(daysRemaining);
        return (
          <div className={MODAL_OVERLAY}>
            <div role="dialog" aria-modal="true" className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
              <div className={MODAL_HEADER}>
                <h3 className={MODAL_TITLE}>Chi tiết bản ghi vòng đời dữ liệu chủ</h3>
                <button
                  type="button"
                  onClick={() => setLifecycleDetailRow(null)}
                  className={BTN_GHOST_ICON}
                  aria-label="Đóng"
                  title="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className={FIELD_LABEL}>Trạng thái:</span>
                    <ApprovalBadge status={lifecycleDetailRow.approvalStatus} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={FIELD_LABEL}>Vòng đời:</span>
                    <Badge label={LIFECYCLE_STAGE_LABEL[stage]} variant={LIFECYCLE_STAGE_BADGE_VARIANT[stage]} />
                  </div>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] p-4 grid grid-cols-2 gap-x-6 gap-y-4">
                  {detailCols.map(col => (
                    <div key={col.key} className="min-w-0">
                      <div className={`${FIELD_LABEL} mb-1`}>{col.label}</div>
                      <div className={`${FIELD_VALUE} break-words`}>
                        {lifecycleDetailRow[col.key] || <span className="text-[#94A3B8]">(trống)</span>}
                      </div>
                    </div>
                  ))}
                  <div className="min-w-0">
                    <div className={`${FIELD_LABEL} mb-1`}>Số ngày còn lại</div>
                    <div className={`text-[13px] ${LIFECYCLE_STAGE_TEXT_COLOR[stage]}`}>
                      {daysRemaining < 0 ? `Quá hạn ${Math.abs(daysRemaining)} ngày` : `${daysRemaining} ngày`}
                    </div>
                  </div>
                </div>
              </div>

              <div className={MODAL_FOOTER}>
                <button
                  type="button"
                  onClick={() => setLifecycleDetailRow(null)}
                  className={BTN_OUTLINE}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Detail Modal — giống modal "Xem chi tiết thực thể dữ liệu chủ" tại Mô hình dữ liệu chủ */}
      {showDetailModal && selectedRecord && (
        <div className={MODAL_OVERLAY}>
          <div role="dialog" aria-modal="true" className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Xem chi tiết thực thể dữ liệu chủ</h3>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className={BTN_GHOST_ICON}
                aria-label="Đóng"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper — #155DFC (đang xem/đã qua), #E2E8F0 (chưa) */}
            <div className="px-6 py-4 border-b border-[#E2E8F0] shrink-0">
              <div className="flex items-start justify-between">
                {VIEW_STEPS.map((step, index) => {
                  const isActive = viewStep === step.number;
                  return (
                    <div key={step.number} className="flex items-start flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <button
                          type="button"
                          onClick={() => setViewStep(step.number)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-[13px] transition-colors flex-shrink-0 ${BTN_FOCUS} ${
                            isActive
                              ? 'border-[#155DFC] bg-[#155DFC] text-white'
                              : 'border-[#155DFC] bg-white text-[#155DFC] hover:bg-[#EAF3FF]'
                          }`}
                          title={step.title}
                          aria-label={step.title}
                          aria-current={isActive ? 'step' : undefined}
                        >
                          {isActive ? step.number : <Check className="w-4 h-4" />}
                        </button>
                        <p className={`text-[13px] mt-1.5 text-center ${isActive ? 'text-[#155DFC] font-medium' : 'text-[#64748B]'}`}>
                          {step.title}
                        </p>
                      </div>
                      {index < VIEW_STEPS.length - 1 && (
                        <div className="flex-1 h-0.5 bg-[#155DFC] mx-1 mt-4" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
              {viewStep === 1 ? (
                <div className="rounded-2xl border border-[#E2E8F0] p-4 grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Mã thực thể</div>
                    <div className={FIELD_VALUE}>{selectedRecord.recordCode}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Tên dữ liệu chủ</div>
                    <div className={FIELD_VALUE}>Bộ dữ liệu chủ {selectedRecord.dataType}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Loại thực thể</div>
                    <div className={FIELD_VALUE}>Thực thể Cá nhân</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Phạm vi sử dụng</div>
                    <div className={FIELD_VALUE}>Cấp quốc gia</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Đơn vị chủ quản</div>
                    <div className={FIELD_VALUE}>{selectedRecord.agency}</div>
                  </div>
                  <div className="col-span-2">
                    <div className={`${FIELD_LABEL} mb-1`}>Mô tả đối tượng</div>
                    <div className={FIELD_VALUE}>
                      Dữ liệu chuẩn về {selectedRecord.dataType.toLowerCase()} bao gồm thông tin cá nhân như họ tên, ngày sinh, số CCCD, nơi sinh theo hồ sơ {selectedRecord.recordCode}.
                    </div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Tên cơ sở dữ liệu / Hệ thống</div>
                    <div className={FIELD_VALUE}>{DATA_TYPE_SYSTEM_NAME[selectedRecord.dataType] ?? 'CSDL hộ tịch điện tử'}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Trạng thái vòng đời</div>
                    <div className={FIELD_VALUE}>{APPROVAL_TO_LIFECYCLE_LABEL[selectedRecord.approvalStatus as ApprovalStatus] ?? '—'}</div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-[13px] text-[#64748B]">
                  (Chưa có dữ liệu demo cho bước "{VIEW_STEPS.find(s => s.number === viewStep)?.title}")
                </div>
              )}
            </div>

            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className={BTN_OUTLINE}
              >
                <Edit className="w-4 h-4" /> Chỉnh sửa
              </button>
              {viewStep > 1 && (
                <button
                  type="button"
                  onClick={() => setViewStep(viewStep - 1)}
                  className={BTN_OUTLINE}
                >
                  <ChevronLeft className="w-4 h-4" /> Quay lại
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className={viewStep < 7 ? BTN_OUTLINE : BTN_PRIMARY}
              >
                Đóng
              </button>
              {viewStep < 7 && (
                <button
                  type="button"
                  onClick={() => setViewStep(viewStep + 1)}
                  className={BTN_PRIMARY}
                >
                  Tiếp theo <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
