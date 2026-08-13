import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Search, Download, FileText, Printer, TrendingUp, AlertCircle, Calendar, Filter, X, ChevronDown, Check, BarChart2, Eye, Layers, ChevronLeft, ArrowRight, Edit } from 'lucide-react';
import {
  AreaChart, Area as AreaR, XAxis as XAxisR, YAxis as YAxisR,
  CartesianGrid, Tooltip as TooltipR, ResponsiveContainer
} from 'recharts';
import { ApprovalBadge, type ApprovalStatus } from './MasterDataUpdateItemPage';

const Area = AreaR as any;
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

interface LifecycleData {
  id: string;
  recordCode: string;
  fullName: string;
  dataType: string;
  createdDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'active' | 'warning' | 'expired';
}

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
];

// Dữ liệu biểu đồ: mỗi tháng có giá trị riêng cho từng loại dữ liệu chủ
const usageTrendData = [
  { name: 'Tháng 1', 'Công chứng': 980, 'Đăng ký kinh doanh': 1750, 'Trợ giúp pháp lý': 410, 'Hộ tịch': 620 },
  { name: 'Tháng 2', 'Công chứng': 1050, 'Đăng ký kinh doanh': 1900, 'Trợ giúp pháp lý': 380, 'Hộ tịch': 700 },
  { name: 'Tháng 3', 'Công chứng': 1120, 'Đăng ký kinh doanh': 2050, 'Trợ giúp pháp lý': 450, 'Hộ tịch': 760 },
  { name: 'Tháng 4', 'Công chứng': 1000, 'Đăng ký kinh doanh': 2200, 'Trợ giúp pháp lý': 500, 'Hộ tịch': 810 },
  { name: 'Tháng 5', 'Công chứng': 1180, 'Đăng ký kinh doanh': 2150, 'Trợ giúp pháp lý': 470, 'Hộ tịch': 850 },
  { name: 'Tháng 6', 'Công chứng': 1220, 'Đăng ký kinh doanh': 2280, 'Trợ giúp pháp lý': 540, 'Hộ tịch': 870 },
  { name: 'Tháng 7', 'Công chứng': 1250, 'Đăng ký kinh doanh': 2340, 'Trợ giúp pháp lý': 560, 'Hộ tịch': 890 },
];

const DATA_TYPE_COLORS: Record<string, string> = {
  'Công chứng': '#2563eb',
  'Đăng ký kinh doanh': '#10b981',
  'Trợ giúp pháp lý': '#f59e0b',
  'Hộ tịch': '#8b5cf6',
};

const DATA_TYPE_OPTIONS = mockUsageReports.map(u => ({ value: u.dataType, label: u.dataType }));

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const mockConnectedSystems = [
  { name: 'Cổng Dịch vụ công Quốc gia', hits: 145000, status: 'Ổn định', lastAccess: '25/12/2024 14:30' },
  { name: 'Hệ thống Hộ tịch điện tử', hits: 89000, status: 'Ổn định', lastAccess: '25/12/2024 14:25' },
  { name: 'Hệ thống Đăng ký doanh nghiệp', hits: 76000, status: 'Gián đoạn nhẹ', lastAccess: '25/12/2024 13:45' },
  { name: 'Cổng dữ liệu mở Hà Nội', hits: 34000, status: 'Ổn định', lastAccess: '25/12/2024 12:00' },
];

const mockLifecycleData: LifecycleData[] = [
  {
    id: '1',
    recordCode: 'DLDC-2024-101',
    fullName: 'Phạm Thị Dung',
    dataType: 'Công chứng',
    createdDate: '15/06/2024',
    expiryDate: '15/01/2025',
    daysRemaining: 21,
    status: 'warning',
  },
  {
    id: '2',
    recordCode: 'DLDC-2024-102',
    fullName: 'Hoàng Văn Em',
    dataType: 'Đăng ký kinh doanh',
    createdDate: '10/05/2024',
    expiryDate: '10/12/2024',
    daysRemaining: -15,
    status: 'expired',
  },
  {
    id: '3',
    recordCode: 'DLDC-2024-103',
    fullName: 'Võ Thị Phương',
    dataType: 'Hộ tịch',
    createdDate: '20/07/2024',
    expiryDate: '20/02/2025',
    daysRemaining: 57,
    status: 'active',
  },
  {
    id: '4',
    recordCode: 'DLDC-2024-104',
    fullName: 'Đỗ Văn Giang',
    dataType: 'Trợ giúp pháp lý',
    createdDate: '05/08/2024',
    expiryDate: '05/01/2025',
    daysRemaining: 11,
    status: 'warning',
  },
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
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  const [showDataTypeDropdown, setShowDataTypeDropdown] = useState(false);
  const [usageDateRange, setUsageDateRange] = useState('6months');
  const [showUsageExportMenu, setShowUsageExportMenu] = useState(false);
  const [hasSearchedUsage, setHasSearchedUsage] = useState(false);
  const [appliedUsageReports, setAppliedUsageReports] = useState(mockUsageReports);

  // ─── Báo cáo vòng đời dữ liệu chủ ───────────────────────────────────────
  const [lifecycleDataType, setLifecycleDataType] = useState('');
  const [lifecycleStatusFilter, setLifecycleStatusFilter] = useState('');
  const [showLifecycleExportMenu, setShowLifecycleExportMenu] = useState(false);
  const [hasSearchedLifecycle, setHasSearchedLifecycle] = useState(false);
  const [appliedLifecycleData, setAppliedLifecycleData] = useState<LifecycleData[]>([]);

  const dataTypeRef = useRef<HTMLDivElement | null>(null);
  const usageExportRef = useRef<HTMLDivElement | null>(null);
  const lifecycleExportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dataTypeRef.current && !dataTypeRef.current.contains(e.target as Node)) {
        setShowDataTypeDropdown(false);
      }
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
    let result = mockLifecycleData;
    if (lifecycleDataType) result = result.filter(d => d.dataType === lifecycleDataType);
    if (lifecycleStatusFilter) result = result.filter(d => d.status === lifecycleStatusFilter);
    setAppliedLifecycleData(result);
    setHasSearchedLifecycle(true);
  };

  const handleExportLifecycleFile = (format: string) => {
    setShowLifecycleExportMenu(false);
    alert(`Đang xuất dữ liệu sang định dạng ${format}...`);
  };

  const toggleDataType = (value: string) => {
    setSelectedDataTypes(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleAllDataTypes = () => {
    setSelectedDataTypes(prev =>
      prev.length === DATA_TYPE_OPTIONS.length ? [] : DATA_TYPE_OPTIONS.map(o => o.value)
    );
  };

  const handleSearchUsage = () => {
    const result = selectedDataTypes.length === 0
      ? mockUsageReports
      : mockUsageReports.filter(r => selectedDataTypes.includes(r.dataType));
    setAppliedUsageReports(result);
    setHasSearchedUsage(true);
  };

  const totalConnectedHits = mockConnectedSystems.reduce((acc, curr) => acc + curr.hits, 0);

  const dataTypeDisplayText = () => {
    if (selectedDataTypes.length === 0) return 'Tất cả loại dữ liệu';
    if (selectedDataTypes.length === 1) return selectedDataTypes[0];
    return `${selectedDataTypes.length} loại dữ liệu đã chọn`;
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
                {/* Backdrop khi dropdown mở */}
                {showDataTypeDropdown && (
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowDataTypeDropdown(false)}
                  />
                )}

                {/* Control Panel */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative z-30">
                  <div className="flex flex-wrap items-end gap-3">

                    {/* Multi-select Loại dữ liệu chủ */}
                    <div className="flex-1 min-w-[220px]">
                      <label className="block text-[12px] text-slate-500 mb-1 font-medium">Chọn thực thể dữ liệu chủ</label>
                      <div className="relative" ref={dataTypeRef}>
                        <button
                          type="button"
                          onClick={() => setShowDataTypeDropdown(prev => !prev)}
                          className={`w-full px-3 py-2 border rounded-lg text-[13px] bg-white text-left flex items-center justify-between gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            showDataTypeDropdown ? 'border-blue-400 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className={`truncate ${selectedDataTypes.length === 0 ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>
                            {dataTypeDisplayText()}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            {selectedDataTypes.length > 0 && (
                              <span
                                onClick={(e) => { e.stopPropagation(); setSelectedDataTypes([]); }}
                                className="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center cursor-pointer transition-colors"
                              >
                                <X className="w-2.5 h-2.5 text-slate-600" />
                              </span>
                            )}
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showDataTypeDropdown ? 'rotate-180' : ''}`} />
                          </div>
                        </button>

                        {showDataTypeDropdown && (
                          <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-2xl z-40 overflow-hidden">
                            <button
                              type="button"
                              onClick={toggleAllDataTypes}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-100 text-sm font-medium text-slate-700"
                            >
                              <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                selectedDataTypes.length === DATA_TYPE_OPTIONS.length
                                  ? 'bg-blue-600 border-blue-600'
                                  : selectedDataTypes.length > 0
                                  ? 'bg-blue-100 border-blue-400'
                                  : 'border-slate-300'
                              }`}>
                                {selectedDataTypes.length === DATA_TYPE_OPTIONS.length && <Check className="w-3 h-3 text-white" />}
                                {selectedDataTypes.length > 0 && selectedDataTypes.length < DATA_TYPE_OPTIONS.length && (
                                  <span className="w-2 h-0.5 bg-blue-600 rounded" />
                                )}
                              </span>
                              Tất cả loại dữ liệu
                            </button>

                            {DATA_TYPE_OPTIONS.map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => toggleDataType(opt.value)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-sm text-slate-700 text-left"
                              >
                                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                  selectedDataTypes.includes(opt.value)
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-slate-300'
                                }`}>
                                  {selectedDataTypes.includes(opt.value) && <Check className="w-3 h-3 text-white" />}
                                </span>
                                <span className="truncate">{opt.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Thời gian */}
                    <div className="min-w-[170px]">
                      <label className="block text-[12px] text-slate-500 mb-1 font-medium">Thời gian thống kê</label>
                      <select
                        title="Thời gian thống kê"
                        value={usageDateRange}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setUsageDateRange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="last_month">Tháng trước</option>
                        <option value="6months">6 tháng qua</option>
                        <option value="2024">Năm 2024</option>
                      </select>
                    </div>

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

                {/* Chart */}
                {hasSearchedUsage && (
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={usageTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#374151' }} />
                          <YAxis tick={{ fontSize: 12, fill: '#374151' }} />
                          <Tooltip />
                          {appliedUsageReports.map(rep => (
                            <Area
                              key={rep.dataType}
                              type="monotone"
                              dataKey={rep.dataType}
                              name={rep.dataType}
                              stroke={DATA_TYPE_COLORS[rep.dataType] ?? '#94a3b8'}
                              fill={DATA_TYPE_COLORS[rep.dataType] ?? '#94a3b8'}
                              fillOpacity={0.1}
                              strokeWidth={2}
                            />
                          ))}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Bảng mô tả hệ thống / cổng dịch vụ kết nối khai thác dữ liệu chủ */}
                {hasSearchedUsage && (
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse table-auto">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-slate-500 uppercase tracking-tight">
                            <th className="py-3 px-4 text-center w-12">STT</th>
                            <th className="py-3 px-4">Tên Hệ thống / Cổng dịch vụ kết nối</th>
                            <th className="py-3 px-4 text-right">Tổng lượt truy xuất</th>
                            <th className="py-3 px-4 text-center">Trạng thái kết nối</th>
                            <th className="py-3 px-4 text-center">Truy cập gần nhất</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                          {mockConnectedSystems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                              <td className="py-3 px-4 text-center text-slate-500">{idx + 1}</td>
                              <td className="py-3 px-4 font-medium text-slate-900">{item.name}</td>
                              <td className="py-3 px-4 text-right text-slate-700">{item.hits.toLocaleString()}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.status === 'Ổn định'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Ổn định' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center text-slate-500">{item.lastAccess}</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-50 font-semibold border-t border-slate-200">
                            <td colSpan={2} className="py-3 px-4 text-center text-slate-700 uppercase text-[13px]">Tổng lượt khai thác API</td>
                            <td className="py-3 px-4 text-right text-blue-600">{totalConnectedHits.toLocaleString()}</td>
                            <td className="py-3 px-4 text-center text-slate-400" colSpan={2}>—</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lifecycle Report Tab */}
            {activeTab === 'lifecycle' && (
              <div className="space-y-6">
                {/* Control Panel */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative z-30">
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="min-w-[200px]">
                      <label className="block text-[12px] text-slate-500 mb-1 font-medium">Danh mục dữ liệu</label>
                      <select
                        title="Danh mục dữ liệu"
                        value={lifecycleDataType}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setLifecycleDataType(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="">Tất cả</option>
                        <option value="Công chứng">Công chứng</option>
                        <option value="Đăng ký kinh doanh">Đăng ký kinh doanh</option>
                        <option value="Trợ giúp pháp lý">Trợ giúp pháp lý</option>
                        <option value="Hộ tịch">Hộ tịch</option>
                      </select>
                    </div>
                    <div className="min-w-[190px]">
                      <label className="block text-[12px] text-slate-500 mb-1 font-medium">Trạng thái vòng đời</label>
                      <select
                        title="Trạng thái vòng đời"
                        value={lifecycleStatusFilter}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setLifecycleStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Hoạt động bình thường</option>
                        <option value="warning">Sắp hết hiệu lực</option>
                        <option value="expired">Đã hết hiệu lực</option>
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
                    <p className="text-[13px] font-medium">Chọn danh mục dữ liệu, trạng thái vòng đời và bấm <span className="text-slate-600 font-semibold">Truy xuất báo cáo</span> để xem kết quả</p>
                  </div>
                )}

                {hasSearchedLifecycle && (() => {
                  const activeCount = appliedLifecycleData.filter(d => d.status === 'active').length;
                  const warningCount = appliedLifecycleData.filter(d => d.status === 'warning').length;
                  const expiredCount = appliedLifecycleData.filter(d => d.status === 'expired').length;
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
                            <div className="text-[13px] font-medium text-slate-700">Hoạt động bình thường</div>
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
                          <div className="text-[13px] text-slate-600">Còn dưới 30 ngày</div>
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

                      {/* Lifecycle Table */}
                      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200">
                          <h3 className="text-[13px] font-medium text-slate-700">Chi tiết vòng đời dữ liệu</h3>
                        </div>

                        <div>
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
                                    Ngày tạo
                                  </th>
                                  <th className="px-4 py-3 text-left text-[13px] text-slate-600">
                                    Ngày hết hạn
                                  </th>
                                  <th className="px-4 py-3 text-left text-[13px] text-slate-600">
                                    Số ngày còn lại
                                  </th>
                                  <th className="px-4 py-3 text-left text-[13px] text-slate-600">
                                    Trạng thái
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {appliedLifecycleData.length === 0 && (
                                  <tr>
                                    <td colSpan={8} className="px-4 py-6 text-center text-[13px] text-slate-400 italic">
                                      Không có bản ghi phù hợp với bộ lọc đã chọn
                                    </td>
                                  </tr>
                                )}
                                {appliedLifecycleData.map((data, index) => (
                                  <tr key={data.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-[13px] text-slate-900">{index + 1}</td>
                                    <td className="px-4 py-3 text-[13px] text-blue-600">
                                      {data.recordCode}
                                    </td>
                                    <td className="px-4 py-3 text-[13px] text-slate-900">
                                      {data.fullName}
                                    </td>
                                    <td className="px-4 py-3 text-[13px] text-slate-600">
                                      {data.dataType}
                                    </td>
                                    <td className="px-4 py-3 text-[13px] text-slate-600">
                                      {data.createdDate}
                                    </td>
                                    <td className="px-4 py-3 text-[13px] text-slate-600">
                                      {data.expiryDate}
                                    </td>
                                    <td className="px-4 py-3 text-[13px]">
                                      <span
                                        className={
                                          data.daysRemaining < 0
                                            ? 'text-red-700'
                                            : data.daysRemaining < 30
                                            ? 'text-orange-700'
                                            : 'text-green-700'
                                        }
                                      >
                                        {data.daysRemaining < 0
                                          ? `Quá hạn ${Math.abs(data.daysRemaining)} ngày`
                                          : `${data.daysRemaining} ngày`}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                                      <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[13px] ${
                                          data.status === 'active'
                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                            : data.status === 'warning'
                                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                            : 'bg-red-50 text-red-700 border border-red-200'
                                        }`}
                                      >
                                        {data.status === 'active'
                                          ? 'Hoạt động'
                                          : data.status === 'warning'
                                          ? 'Sắp hết hạn'
                                          : 'Đã hết hạn'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
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