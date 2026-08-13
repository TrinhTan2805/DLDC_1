import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Search, Download, FileText, Printer, TrendingUp, AlertCircle, Calendar, Filter, X, ChevronDown, Check, BarChart2, Eye, Layers, ChevronLeft, ArrowRight, Edit } from 'lucide-react';
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
  active: 'text-green-700',
  warning: 'text-yellow-600',
  expired: 'text-red-700',
};

const LIFECYCLE_STAGE_BADGE_CLASS: Record<LifecycleStage, string> = {
  active: 'bg-green-50 text-green-700 border border-green-200',
  warning: 'bg-orange-50 text-orange-700 border border-orange-200',
  expired: 'bg-red-50 text-red-700 border border-red-200',
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
    alert(`Đang xuất dữ liệu sang định dạng ${format}...`);
  };

  const handleSearchUsage = () => {
    setAppliedUsageReports(mockUsageReports);
    setHasSearchedUsage(true);
  };

  const handleExportUsageFile = (format: string) => {
    setShowUsageExportMenu(false);
    alert(`Đang xuất dữ liệu sang định dạng ${format}...`);
  };

  const totalPages = Math.max(1, Math.ceil(searchResults.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedResults = searchResults.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startItem = searchResults.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, searchResults.length);

  const handleSearch = () => {
    // Mock search logic
    console.log('Searching with filters:', searchFilters);
    // In real app, call API with filters
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchFilters({
      keyword: '',
      dataType: '',
      approvalStatus: '',
      dateFrom: '',
      dateTo: '',
    });
    setCurrentPage(1);
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
    alert('Đang xuất file Excel...');
  };

  const handleExportPDF = () => {
    alert('Đang xuất file PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <div className="p-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-slate-200 overflow-x-auto bg-white">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-6 py-4 text-[13px] font-medium transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'search'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Search className={`w-4 h-4 ${activeTab === 'search' ? 'text-blue-600' : 'text-slate-400'}`} />
              Tra cứu dữ liệu chủ
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`flex items-center gap-2 px-6 py-4 text-[13px] font-medium transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'usage'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <TrendingUp className={`w-4 h-4 ${activeTab === 'usage' ? 'text-blue-600' : 'text-slate-400'}`} />
              Báo cáo sử dụng dữ liệu chủ
            </button>
            <button
              onClick={() => setActiveTab('lifecycle')}
              className={`flex items-center gap-2 px-6 py-4 text-[13px] font-medium transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'lifecycle'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Calendar className={`w-4 h-4 ${activeTab === 'lifecycle' ? 'text-blue-600' : 'text-slate-400'}`} />
              Báo cáo vòng đời dữ liệu
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-6">
            {/* Search Tab */}
            {activeTab === 'search' && (
              <div className="space-y-6">
                {/* Filter Section */}
                {showFilters && (
                  <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <h3 className="text-[13px] font-medium text-slate-700">Bộ lọc tìm kiếm</h3>
                      </div>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-medium text-slate-700">
                          Tìm kiếm theo mã, tên bản ghi dữ liệu chủ
                        </label>
                        <input
                          type="text"
                          value={searchFilters.keyword}
                          onChange={(e) =>
                            setSearchFilters({ ...searchFilters, keyword: e.target.value })
                          }
                          placeholder="Nhập mã hoặc tên bản ghi..."
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-medium text-slate-700">
                          Loại dữ liệu
                        </label>
                        <select
                          value={searchFilters.dataType}
                          onChange={(e) =>
                            setSearchFilters({ ...searchFilters, dataType: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                        >
                          <option value="">Tất cả</option>
                          <option value="congchung">Công chứng</option>
                          <option value="dangkykinhdoanh">Đăng ký kinh doanh</option>
                          <option value="tgpl">Trợ giúp pháp lý</option>
                          <option value="hotich">Hộ tịch</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-medium text-slate-700">
                          Trạng thái phê duyệt
                        </label>
                        <select
                          value={searchFilters.approvalStatus}
                          onChange={(e) =>
                            setSearchFilters({ ...searchFilters, approvalStatus: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
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
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-medium text-slate-700">
                          Từ ngày
                        </label>
                        <input
                          type="date"
                          value={searchFilters.dateFrom}
                          onChange={(e) =>
                            setSearchFilters({ ...searchFilters, dateFrom: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-medium text-slate-700">
                          Đến ngày
                        </label>
                        <input
                          type="date"
                          value={searchFilters.dateTo}
                          onChange={(e) =>
                            setSearchFilters({ ...searchFilters, dateTo: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-[13px] shadow-sm"
                      >
                        Xóa bộ lọc
                      </button>
                      <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-[13px] shadow-sm"
                      >
                        <Search className="w-4 h-4" />
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                )}

                {!showFilters && (
                  <button
                    onClick={() => setShowFilters(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-[13px] shadow-sm"
                  >
                    <Filter className="w-4 h-4" />
                    Hiển thị bộ lọc
                  </button>
                )}

                {/* Results Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <h3 className="text-[13px] font-medium text-slate-700">
                        Kết quả tìm kiếm ({searchResults.length} bản ghi)
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrint}
                        className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2 text-[13px]"
                      >
                        <Printer className="w-4 h-4" />
                        In
                      </button>
                      <button
                        onClick={handleExportExcel}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-[13px]"
                      >
                        <Download className="w-4 h-4" />
                        Excel
                      </button>
                      <button
                        onClick={handleExportPDF}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-[13px]"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-[13px] text-slate-600">
                              STT
                            </th>
                            <th className="px-4 py-3 text-left text-[13px] text-slate-600">
                              Mã dữ liệu
                            </th>
                            <th className="px-4 py-3 text-left text-[13px] text-slate-600">
                              Tên dữ liệu chủ
                            </th>
                            <th className="px-4 py-3 text-left text-[13px] text-slate-600">
                              Loại dữ liệu
                            </th>
                            <th className="px-4 py-3 text-left text-[13px] text-slate-600">
                              Cơ quan quản lý
                            </th>
                            <th className="px-4 py-3 text-left text-[13px] text-slate-600">
                              Ngày cập nhật
                            </th>
                            <th className="px-4 py-3 text-left text-[13px] text-slate-600">
                              Trạng thái phê duyệt
                            </th>
                            <th className="px-4 py-3 text-left text-[13px] text-slate-600">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {paginatedResults.map((record, index) => (
                            <tr key={record.id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-[13px] text-slate-900">{startItem + index}</td>
                              <td className="px-4 py-3 text-[13px] text-blue-600">
                                {record.recordCode}
                              </td>
                              <td className="px-4 py-3 text-[13px] text-slate-900">
                                {record.fullName}
                              </td>
                              <td className="px-4 py-3 text-[13px] text-slate-600">
                                {record.dataType}
                              </td>
                              <td className="px-4 py-3 text-[13px] text-slate-600">
                                {record.agency}
                              </td>
                              <td className="px-4 py-3 text-[13px] text-slate-600">
                                {record.updateDate}
                              </td>
                              <td className="px-4 py-3">
                                <ApprovalBadge status={record.approvalStatus} />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleViewDetail(record)}
                                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                    title="Xem chi tiết bản ghi"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleGoToUpdate(record)}
                                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                    title="Xem dữ liệu tại Cập nhật dữ liệu chủ"
                                  >
                                    <Layers className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {searchResults.length > 0 && (
                      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-600 font-normal">Hiển thị</span>
                          <select
                            aria-label="Số bản ghi trên trang"
                            value={pageSize}
                            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                            className="px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-[13px] cursor-pointer font-medium"
                            title="Số bản ghi trên trang"
                          >
                            {PAGE_SIZE_OPTIONS.map(n => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                          <span className="text-slate-600 font-normal">bản ghi/trang</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-slate-600 font-normal">
                            {startItem} - {endItem} / {searchResults.length}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                              disabled={safePage === 1}
                              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                            >
                              Trước
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${
                                  safePage === page
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                            <button
                              onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
                              disabled={safePage === totalPages}
                              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                            >
                              Sau
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Usage Report Tab */}
            {activeTab === 'usage' && (
              <div className="space-y-6">
                {/* Control Panel */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative z-30">
                  <div className="flex flex-wrap items-end gap-3">

                    {/* Loại báo cáo: Truy cập / Tiêu thụ / Thống kê */}
                    <div className="flex-1 min-w-[220px]">
                      <label className="block text-[12px] text-slate-500 mb-1 font-medium">Loại báo cáo</label>
                      <select
                        title="Loại báo cáo"
                        value={usageReportType}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setUsageReportType(e.target.value as typeof usageReportType)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="access">Truy cập</option>
                        <option value="consumption">Tiêu thụ</option>
                        <option value="stats">Thống kê</option>
                      </select>
                    </div>

                    {/* Thời gian */}
                    <div className="flex-1 min-w-[220px]">
                      <label className="block text-[12px] text-slate-500 mb-1 font-medium">Thời gian thống kê</label>
                      <select
                        title="Thời gian thống kê"
                        value={usageDateRange}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setUsageDateRange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="this_month">Trong tháng</option>
                        <option value="6months">6 tháng</option>
                        <option value="year">Trong năm</option>
                      </select>
                    </div>

                    {/* Chọn tháng — chỉ hiện khi Thời gian thống kê = Trong tháng */}
                    {usageDateRange === 'this_month' && (
                      <div className="min-w-[140px]">
                        <label className="block text-[12px] text-slate-500 mb-1 font-medium">Chọn tháng</label>
                        <select
                          title="Chọn tháng"
                          value={usageStatMonth}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setUsageStatMonth(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{`Tháng ${m}/${currentYear}`}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Chọn năm — chỉ hiện khi Thời gian thống kê = Trong năm */}
                    {usageDateRange === 'year' && (
                      <div className="min-w-[140px]">
                        <label className="block text-[12px] text-slate-500 mb-1 font-medium">Chọn năm</label>
                        <select
                          title="Chọn năm"
                          value={usageStatYear}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setUsageStatYear(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-[13px] shadow-sm shrink-0 active:scale-95"
                    >
                      <Search className="w-4 h-4" />
                      Truy xuất báo cáo
                    </button>

                    <div className="relative shrink-0" ref={usageExportRef}>
                      <button
                        type="button"
                        onClick={() => setShowUsageExportMenu(prev => !prev)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-[13px] shadow-sm"
                      >
                        <FileText className="w-4 h-4" />
                        Xuất File
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {showUsageExportMenu && (
                        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
                          {['Excel', 'PDF', 'CSV'].map(fmt => (
                            <button
                              key={fmt}
                              type="button"
                              onClick={() => handleExportUsageFile(fmt)}
                              className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm text-slate-700 transition-colors"
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
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
                    <BarChart2 className="w-12 h-12 opacity-30" />
                    <p className="text-[13px] font-medium">Chọn điều kiện lọc và bấm <span className="text-slate-600 font-semibold">Truy xuất báo cáo</span> để xem kết quả</p>
                  </div>
                )}

                {/* Thống kê — tổng lượt truy cập theo thời gian (gộp mọi thực thể, tránh rối khi số thực
                    thể dữ liệu chủ tăng lên) + tần suất khai thác chi tiết theo từng thực thể */}
                {hasSearchedUsage && usageReportType === 'stats' && (() => {
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

                  const isMonthView = usageDateRange === 'this_month';
                  const totalAccessTrendData = isMonthView ? dailyTrendData : monthlyTrendData;

                  return (
                    <div className="space-y-4">
                      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <p className="text-[18px] font-semibold text-slate-700 mb-3">
                          {isMonthView
                            ? `Tổng lượt truy cập dữ liệu chủ theo ngày trong Tháng ${usageStatMonth}/${currentYear} (lượt truy cập)`
                            : 'Tổng lượt truy cập dữ liệu chủ theo thời gian (lượt truy cập)'}
                        </p>
                        <div className={isMonthView ? 'h-72' : 'h-64'}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={totalAccessTrendData} margin={{ top: 10, right: 30, left: 0, bottom: isMonthView ? 20 : 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: '#374151' }}
                                interval={isMonthView ? 1 : 0}
                                height={isMonthView ? 50 : 30}
                                label={isMonthView ? { value: '(Ngày)', position: 'insideBottomLeft', offset: -18, fontSize: 12, fill: '#374151' } : undefined}
                              />
                              <YAxis tick={{ fontSize: 12, fill: '#374151' }} />
                              <Tooltip />
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

                      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <p className="text-[18px] font-semibold text-slate-700 mb-3">Tần suất khai thác dữ liệu chủ theo thực thể (tổng lượt truy cập trong kỳ)</p>
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={appliedUsageReports.map(rep => ({ name: rep.dataType, totalAccess: rep.totalAccess }))}
                              margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                              barCategoryGap="20%"
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis
                                dataKey="name"
                                interval={0}
                                angle={-30}
                                textAnchor="end"
                                height={60}
                                tick={{ fontSize: 11, fill: '#374151' }}
                              />
                              <YAxis tick={{ fontSize: 12, fill: '#374151' }} />
                              <Tooltip />
                              <Bar dataKey="totalAccess" name="Lượt truy cập" radius={[4, 4, 0, 0]} maxBarSize={24}>
                                {appliedUsageReports.map(rep => (
                                  <Cell key={rep.dataType} fill={DATA_TYPE_COLORS[rep.dataType] ?? '#94a3b8'} />
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
                {hasSearchedUsage && usageReportType === 'consumption' && (() => {
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
                      <div className="flex flex-col gap-3">
                        <p className="text-[18px] font-semibold text-slate-700">Báo cáo tiêu thụ dữ liệu theo thực thể</p>
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                          <div className="overflow-auto h-[320px]">
                            <table className="master-data-consumption-table w-full text-left border-collapse table-auto text-[13px]">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase tracking-tight">
                                  <th className="py-3 px-4 text-center w-12">STT</th>
                                  <th className="py-3 px-4">Thực thể dữ liệu chủ</th>
                                  <th className="py-3 px-4 text-right">Dung lượng tiêu thụ ước tính</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-700">
                                {consumptionRows.map((item, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                                    <td className="py-3 px-4 text-center text-slate-500">{idx + 1}</td>
                                    <td className="py-3 px-4 font-medium text-slate-900">{item.category}</td>
                                    <td className="py-3 px-4 text-right text-blue-600 font-medium">
                                      {item.usageMB.toFixed(1)} MB
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-slate-50 font-semibold border-t border-slate-200">
                                  <td colSpan={2} className="py-3 px-4 text-center text-slate-700 uppercase">Tổng tiêu thụ</td>
                                  <td className="py-3 px-4 text-right text-blue-600">
                                    {totalUsageMB.toFixed(1)} MB
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <p className="text-[18px] font-semibold text-slate-700">Báo cáo tiêu thụ dữ liệu chủ theo đơn vị được cấp quyền</p>
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                          <div className="overflow-auto h-[320px]">
                            <table className="master-data-consumption-table w-full text-left border-collapse table-auto text-[13px]">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase tracking-tight">
                                  <th className="py-3 px-4">Đơn vị</th>
                                  <th className="py-3 px-4 text-right">Dung lượng tiêu thụ (MB)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-700">
                                {mockUnitConsumption.map((item, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                                    <td className="py-3 px-4 font-medium text-slate-900">{item.unit}</td>
                                    <td className="py-3 px-4 text-right text-blue-600 font-medium">{item.usageMB.toFixed(1)} MB</td>
                                  </tr>
                                ))}
                                <tr className="bg-slate-50 font-semibold border-t border-slate-200">
                                  <td className="py-3 px-4 text-center text-slate-700 uppercase">Tổng tiêu thụ</td>
                                  <td className="py-3 px-4 text-right text-blue-600">{totalUnitUsageMB.toFixed(1)} MB</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Truy cập — bảng thống kê danh mục dữ liệu chủ đang chia sẻ qua API, giống thiết kế bảng
                    thống kê danh mục tại CategoryTrendAndStatsSection.tsx (Báo cáo khai thác danh mục) */}
                {hasSearchedUsage && usageReportType === 'access' && (() => {
                  const accessRows = (Object.keys(CATEGORY_LABELS) as DataCategory[]).map(cat => ({
                    category: CATEGORY_LABELS[cat],
                    ...mockCategoryApiStats[cat],
                  }));
                  const totalApiCount = accessRows.reduce((acc, curr) => acc + curr.apiCount, 0);
                  const totalStableApiCount = accessRows.reduce((acc, curr) => acc + curr.stableApiCount, 0);
                  const totalApiCalls = accessRows.reduce((acc, curr) => acc + curr.apiCalls, 0);
                  return (
                    <>
                      <p className="text-[18px] font-bold text-slate-700">Báo cáo truy cập dữ liệu thực thể chủ</p>
                      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="exploitation-report-table w-full text-left border-collapse table-auto">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-slate-500 uppercase tracking-tight">
                              <th className="py-3 px-4 text-center w-12">STT</th>
                              <th className="py-3 px-4">Thực thể dữ liệu chủ</th>
                              <th className="py-3 px-4 text-right">Số API đang chia sẻ</th>
                              <th className="py-3 px-4 text-right">Lượt gọi API</th>
                              <th className="py-3 px-4 text-center">Tỷ lệ API ổn định</th>
                              <th className="py-3 px-4 text-center">Truy cập gần nhất</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                            {accessRows.length === 0 && (
                              <tr>
                                <td colSpan={6} className="py-6 px-4 text-center text-slate-400 italic">Không có dữ liệu phù hợp</td>
                              </tr>
                            )}
                            {accessRows.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                                <td className="py-3 px-4 text-center text-slate-500">{idx + 1}</td>
                                <td className="py-3 px-4 font-medium text-slate-900">{item.category}</td>
                                <td className="py-3 px-4 text-right text-slate-700">{item.apiCount}</td>
                                <td className="py-3 px-4 text-right text-slate-700">{item.apiCalls.toLocaleString()}</td>
                                <td className={`py-3 px-4 text-center font-medium ${
                                  item.stableApiCount === item.apiCount ? 'text-green-600' : 'text-amber-600'
                                }`}>
                                  {item.stableApiCount}/{item.apiCount} API ổn định
                                </td>
                                <td className="py-3 px-4 text-center text-slate-500">{item.lastAccess}</td>
                              </tr>
                            ))}
                            {accessRows.length > 0 && (
                              <tr className="bg-slate-50 font-semibold border-t border-slate-200">
                                <td colSpan={2} className="py-3 px-4 text-center text-slate-700 uppercase text-[13px]">Tổng cộng</td>
                                <td className="py-3 px-4 text-right text-blue-600">{totalApiCount}</td>
                                <td className="py-3 px-4 text-right text-blue-600">{totalApiCalls.toLocaleString()}</td>
                                <td className={`py-3 px-4 text-center ${
                                  totalStableApiCount === totalApiCount ? 'text-green-600' : 'text-amber-600'
                                }`}>
                                  {totalStableApiCount}/{totalApiCount} API ổn định
                                </td>
                                <td className="py-3 px-4 text-center text-slate-400">—</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Lifecycle Report Tab */}
            {activeTab === 'lifecycle' && (
              <div className="space-y-6">
                {/* Control Panel */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative z-30">
                  <div className="flex flex-wrap items-end gap-3">

                    {/* Chọn 1 thực thể dữ liệu chủ (không còn "Tất cả thực thể") */}
                    <div className="flex-1 min-w-[260px]">
                      <label className="block text-[12px] text-slate-500 mb-1 font-medium">Chọn thực thể dữ liệu chủ</label>
                      <select
                        title="Chọn thực thể dữ liệu chủ"
                        value={lifecycleCategory}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setLifecycleCategory(e.target.value as DataCategory)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        {(Object.keys(CATEGORY_LABELS) as DataCategory[]).map(cat => (
                          <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleSearchLifecycle}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-[13px] shadow-sm shrink-0 active:scale-95"
                    >
                      <Search className="w-4 h-4" />
                      Truy xuất báo cáo
                    </button>

                    <div className="relative shrink-0" ref={lifecycleExportRef}>
                      <button
                        type="button"
                        onClick={() => setShowLifecycleExportMenu(prev => !prev)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-[13px] shadow-sm"
                      >
                        <FileText className="w-4 h-4" />
                        Xuất File
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {showLifecycleExportMenu && (
                        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
                          {['Excel', 'PDF', 'CSV'].map(fmt => (
                            <button
                              key={fmt}
                              type="button"
                              onClick={() => handleExportLifecycleFile(fmt)}
                              className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm text-slate-700 transition-colors"
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
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
                    <BarChart2 className="w-12 h-12 opacity-30" />
                    <p className="text-[13px] font-medium">Chọn thực thể dữ liệu chủ và bấm <span className="text-slate-600 font-semibold">Truy xuất báo cáo</span> để xem kết quả</p>
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
                  return (
                    <>
                      {/* Warning Alert */}
                      {(warningCount > 0 || expiredCount > 0) && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-[13px] font-medium text-orange-900 mb-1">
                                Cảnh báo dữ liệu sắp hết hiệu lực
                              </h4>
                              <p className="text-[13px] text-orange-700">
                                Có <strong>{warningCount} bản ghi</strong> sắp hết hiệu lực trong 30 ngày tới và{' '}
                                <strong>{expiredCount} bản ghi</strong> đã hết hiệu lực cần xử lý.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Lifecycle Status Cards */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-[13px] font-medium text-slate-700">Còn hiệu lực</div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="text-2xl text-slate-900 mb-1">{activeCount}</div>
                          <div className="text-[13px] text-slate-600">Còn hơn 30 ngày</div>
                        </div>
                        <div className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-[13px] font-medium text-slate-700">Sắp hết hiệu lực</div>
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          </div>
                          <div className="text-2xl text-slate-900 mb-1">{warningCount}</div>
                          <div className="text-[13px] text-slate-600">Còn từ 0-30 ngày</div>
                        </div>
                        <div className="bg-white border border-red-200 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-[13px] font-medium text-slate-700">Đã hết hiệu lực</div>
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          </div>
                          <div className="text-2xl text-slate-900 mb-1">{expiredCount}</div>
                          <div className="text-[13px] text-slate-600">Cần xử lý ngay</div>
                        </div>
                      </div>

                      {/* Lifecycle Table — giá trị các bản ghi thật của thực thể đã chọn (lấy từ Cập nhật dữ liệu chủ) */}
                      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200">
                          <h3 className="text-[13px] font-medium text-slate-700">
                            Chi tiết vòng đời dữ liệu — {CATEGORY_LABELS[appliedLifecycleCategory]}
                          </h3>
                        </div>

                        <div>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                  <th className="px-4 py-3 text-left text-[13px] text-slate-600 whitespace-nowrap">
                                    STT
                                  </th>
                                  {visibleCols.map(col => (
                                    <th key={col.key} className="px-4 py-3 text-left text-[13px] text-slate-600 whitespace-nowrap">
                                      {col.label}
                                    </th>
                                  ))}
                                  <th className="px-4 py-3 text-left text-[13px] text-slate-600 whitespace-nowrap">
                                    Hiệu lực
                                  </th>
                                  <th className="px-4 py-3 text-left text-[13px] text-slate-600 whitespace-nowrap">
                                    Số ngày còn lại
                                  </th>
                                  <th className="px-4 py-3 text-left text-[13px] text-slate-600 whitespace-nowrap">
                                    Vòng đời
                                  </th>
                                  <th className="px-4 py-3 text-center text-[13px] text-slate-600 whitespace-nowrap">
                                    Thao tác
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {appliedLifecycleData.length === 0 && (
                                  <tr>
                                    <td colSpan={visibleCols.length + 5} className="px-4 py-6 text-center text-[13px] text-slate-400 italic">
                                      Không có bản ghi phù hợp với thực thể đã chọn
                                    </td>
                                  </tr>
                                )}
                                {appliedLifecycleData.map((row, index) => {
                                  const info = expiryMap[row.id];
                                  const daysRemaining = info?.daysRemaining ?? 0;
                                  const stage = getLifecycleStage(daysRemaining);
                                  return (
                                    <tr key={row.id} className="hover:bg-slate-50">
                                      <td className="px-4 py-3 text-[13px] text-slate-900">{index + 1}</td>
                                      {visibleCols.map(col => (
                                        <td key={col.key} className="px-4 py-3 text-[13px] text-slate-700 whitespace-nowrap max-w-[220px] truncate">
                                          {row[col.key] || <span className="text-slate-400 italic">(trống)</span>}
                                        </td>
                                      ))}
                                      <td className="px-4 py-3 text-[13px] text-slate-600 whitespace-nowrap">
                                        {row.hieuLuc || <span className="text-slate-400 italic">(trống)</span>}
                                      </td>
                                      <td className="px-4 py-3 text-[13px] whitespace-nowrap">
                                        <span className={LIFECYCLE_STAGE_TEXT_COLOR[stage]}>
                                          {daysRemaining < 0
                                            ? `Quá hạn ${Math.abs(daysRemaining)} ngày`
                                            : `${daysRemaining} ngày`}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[13px] whitespace-nowrap ${LIFECYCLE_STAGE_BADGE_CLASS[stage]}`}>
                                          {LIFECYCLE_STAGE_LABEL[stage]}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <button
                                          onClick={() => setLifecycleDetailRow(row)}
                                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                          title="Xem chi tiết bản ghi"
                                        >
                                          <Eye className="w-4 h-4" />
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
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
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Chi tiết bản ghi vòng đời dữ liệu chủ
                </h3>
                <button
                  onClick={() => setLifecycleDetailRow(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3 text-[13px] overflow-y-auto">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Trạng thái:</span>
                    <ApprovalBadge status={lifecycleDetailRow.approvalStatus} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Vòng đời:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[13px] ${LIFECYCLE_STAGE_BADGE_CLASS[stage]}`}>
                      {LIFECYCLE_STAGE_LABEL[stage]}
                    </span>
                  </div>
                </div>
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                  {detailCols.map(col => (
                    <div key={col.key} className="flex px-3 py-2">
                      <span className="w-40 shrink-0 text-slate-500">{col.label}</span>
                      <span className="flex-1 text-slate-800 font-medium break-words">
                        {lifecycleDetailRow[col.key] || <span className="text-slate-400 italic">(trống)</span>}
                      </span>
                    </div>
                  ))}
                  <div className="flex px-3 py-2">
                    <span className="w-40 shrink-0 text-slate-500">Số ngày còn lại</span>
                    <span className={`flex-1 font-medium ${LIFECYCLE_STAGE_TEXT_COLOR[stage]}`}>
                      {daysRemaining < 0 ? `Quá hạn ${Math.abs(daysRemaining)} ngày` : `${daysRemaining} ngày`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
                <button
                  onClick={() => setLifecycleDetailRow(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
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
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="text-[15px] font-bold text-slate-800">Xem chi tiết thực thể dữ liệu chủ</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
              <div className="flex items-start justify-between">
                {VIEW_STEPS.map((step, index) => (
                  <div key={step.number} className="flex items-start flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <button
                        type="button"
                        onClick={() => setViewStep(step.number)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] transition-colors cursor-pointer flex-shrink-0 ${
                          viewStep === step.number
                            ? 'bg-blue-600 text-white'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                        title={step.title}
                      >
                        {viewStep === step.number ? step.number : <Check className="w-4 h-4" />}
                      </button>
                      <p className={`text-[12px] mt-1.5 text-center ${viewStep === step.number ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                        {step.title}
                      </p>
                    </div>
                    {index < VIEW_STEPS.length - 1 && (
                      <div className="flex-1 h-0.5 bg-slate-200 mx-1 mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-4 text-[13px] overflow-y-auto">
              {viewStep === 1 ? (
                <>
                  <div>
                    <label className="block text-slate-500 mb-1">Mã thực thể</label>
                    <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-800">
                      {selectedRecord.recordCode}
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Tên dữ liệu chủ</label>
                    <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800">
                      Bộ dữ liệu chủ {selectedRecord.dataType}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 mb-1">Loại thực thể</label>
                      <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800">
                        Thực thể Cá nhân
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Phạm vi sử dụng</label>
                      <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800">
                        Cấp quốc gia
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Đơn vị chủ quản</label>
                    <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800">
                      {selectedRecord.agency}
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Mô tả đối tượng</label>
                    <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 min-h-[64px]">
                      Dữ liệu chuẩn về {selectedRecord.dataType.toLowerCase()} bao gồm thông tin cá nhân như họ tên, ngày sinh, số CCCD, nơi sinh theo hồ sơ {selectedRecord.recordCode}.
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Tên cơ sở dữ liệu / Hệ thống</label>
                    <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800">
                      {DATA_TYPE_SYSTEM_NAME[selectedRecord.dataType] ?? 'CSDL hộ tịch điện tử'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Trạng thái vòng đời</label>
                    <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800">
                      {APPROVAL_TO_LIFECYCLE_LABEL[selectedRecord.approvalStatus as ApprovalStatus] ?? '—'}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 italic">
                  (Chưa có dữ liệu demo cho bước "{VIEW_STEPS.find(s => s.number === viewStep)?.title}")
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowDetailModal(false)}
                className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-[13px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Edit className="w-4 h-4" /> Chỉnh sửa
              </button>
              {viewStep > 1 && (
                <button
                  onClick={() => setViewStep(viewStep - 1)}
                  className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-[13px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" /> Quay lại
                </button>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className={`px-4 py-2 rounded-lg font-medium text-[13px] transition-colors cursor-pointer shadow-sm ${
                  viewStep < 7 ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Đóng
              </button>
              {viewStep < 7 && (
                <button
                  onClick={() => setViewStep(viewStep + 1)}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-[13px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
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