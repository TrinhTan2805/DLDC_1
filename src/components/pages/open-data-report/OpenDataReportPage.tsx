import { useState, useRef, useEffect } from 'react';
import { Search, Filter, Download, FileText, BarChart3, PieChart, TrendingUp, Calendar, Building2, Tag, FileType, Shield, Eye, MousePointer, ArrowUpDown, ChevronUp, ChevronDown, Bell, Settings, X, Layers } from 'lucide-react';
import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { initialTargetDatabases } from '../processing/mockTargetDatabases';
import { mockPublishedCategories } from '../open-data-category/OpenDataCategorySetupPage';
import { PUBLISH_STATUS_LABELS, PUBLISH_STATUS_STYLES, type PublishStatus } from '../open-data/OpenDataPublishPage';

const XAxisAny = XAxis as any;
const YAxisAny = YAxis as any;
const TooltipAny = Tooltip as any;
const LegendAny = Legend as any;
const BarAny = Bar as any;
const PieAny = Pie as any;
const LineAny = Line as any;


interface OpenDataReportPageProps {
  onBack: () => void;
}

// Mock data for demonstration
const mockDatasets = [
  {
    id: 'DS001',
    catalogCode: 'ODCAT001',
    name: 'Danh sách văn bản quy phạm pháp luật 2024',
    description: 'Tổng hợp văn bản quy phạm pháp luật do Bộ Tư pháp ban hành trong năm 2024.',
    category: 'Văn bản pháp luật',
    agency: 'Bộ Tư pháp',
    format: 'JSON',
    license: 'CC BY 4.0',
    publishedDate: '2024-01-15',
    status: 'published' as PublishStatus,
    views: 1250,
    downloads: 340,
    source: 'CSDL Kho DLDC',
    shareFormat: 'API',
  },
  {
    id: 'DS002',
    catalogCode: 'ODCAT002',
    name: 'Dữ liệu đăng ký kinh doanh Q1/2024',
    description: 'Danh sách doanh nghiệp đăng ký kinh doanh mới trong quý 1/2024.',
    category: 'Đăng ký kinh doanh',
    agency: 'Cục Đăng ký kinh doanh',
    format: 'Excel',
    license: 'ODC-BY',
    publishedDate: '2024-02-10',
    status: 'published' as PublishStatus,
    views: 890,
    downloads: 220,
    source: 'CSDL Phân tích số liệu',
    shareFormat: 'File Excel',
  },
  {
    id: 'DS003',
    catalogCode: 'ODCAT006',
    name: 'Thống kê công chứng viên 2024',
    description: 'Số liệu thống kê đội ngũ công chứng viên đang hành nghề trên toàn quốc.',
    category: 'Công chứng',
    agency: 'Cục Công chứng',
    format: 'CSV',
    license: 'CC BY 4.0',
    publishedDate: '2024-03-05',
    status: 'updating' as PublishStatus,
    views: 670,
    downloads: 180,
    source: 'CSDL Kho DLDC',
    shareFormat: 'File Excel',
  },
  {
    id: 'DS004',
    catalogCode: 'ODCAT001',
    name: 'Danh sách trung tâm TGPL',
    description: 'Danh mục các trung tâm trợ giúp pháp lý nhà nước theo địa phương.',
    category: 'Trợ giúp pháp lý',
    agency: 'Cục TGPL',
    format: 'JSON',
    license: 'ODbL',
    publishedDate: '2024-01-20',
    status: 'draft' as PublishStatus,
    views: 550,
    downloads: 140,
    source: 'CSDL Lưu trữ lịch sử',
    shareFormat: 'API',
  },
];

const statsByCategory = [
  { name: 'Văn bản pháp luật', value: 45, count: 45 },
  { name: 'Đăng ký kinh doanh', value: 32, count: 32 },
  { name: 'Công chứng', value: 28, count: 28 },
  { name: 'Trợ giúp pháp lý', value: 25, count: 25 },
  { name: 'Khác', value: 20, count: 20 },
];

const statsByAgency = [
  { name: 'Bộ Tư pháp', datasets: 35 },
  { name: 'Cục Đăng ký kinh doanh', datasets: 28 },
  { name: 'Cục Công chứng', datasets: 22 },
  { name: 'Cục TGPL', datasets: 18 },
  { name: 'Khác', datasets: 12 },
];

const statsByFormat = [
  { name: 'JSON', value: 40 },
  { name: 'Excel', value: 30 },
  { name: 'CSV', value: 20 },
  { name: 'XML', value: 10 },
];

const mockAccessByMonth = [
  { key: '2024-01', label: 'T1/2024', views: 4500, downloads: 1200 },
  { key: '2024-02', label: 'T2/2024', views: 5200, downloads: 1450 },
  { key: '2024-03', label: 'T3/2024', views: 6100, downloads: 1680 },
  { key: '2024-04', label: 'T4/2024', views: 5800, downloads: 1520 },
  { key: '2024-05', label: 'T5/2024', views: 6500, downloads: 1890 },
  { key: '2024-06', label: 'T6/2024', views: 7200, downloads: 2100 },
  { key: '2024-07', label: 'T7/2024', views: 6800, downloads: 1950 },
  { key: '2024-08', label: 'T8/2024', views: 7500, downloads: 2200 },
  { key: '2024-09', label: 'T9/2024', views: 8100, downloads: 2400 },
  { key: '2024-10', label: 'T10/2024', views: 7800, downloads: 2300 },
  { key: '2024-11', label: 'T11/2024', views: 8500, downloads: 2600 },
  { key: '2024-12', label: 'T12/2024', views: 9200, downloads: 2800 },
];
const mockAccessByUserType = [
  { name: 'Quản trị hệ thống', views: 3200, downloads: 950 },
  { name: 'Lãnh đạo quản trị', views: 4100, downloads: 1200 },
  { name: 'Chuyên viên quản trị', views: 5800, downloads: 1650 },
  { name: 'Quản trị đơn vị', views: 3900, downloads: 1100 },
  { name: 'Lãnh đạo nghiệp vụ', views: 6200, downloads: 1850 },
  { name: 'Chuyên viên', views: 12120, downloads: 3110 },
];
const mockAccessBySource = [
  { name: 'CSDL Kho DLDC', views: 14500, downloads: 4200 },
  { name: 'CSDL Phân tích số liệu', views: 12800, downloads: 3600 },
  { name: 'CSDL Lưu trữ lịch sử', views: 8020, downloads: 2060 },
];
const mockAccessByFormat = [
  { name: 'File Excel', views: 22500, downloads: 7200 },
  { name: 'API', views: 12820, downloads: 2660 },
];
const mockAlertLogs = [
  { file: 'Danh sách văn bản QPPL 2024', user: 'Nguyễn Văn An', time: '22/06/26 08:30:15', format: 'API', accessCount: 1250 },
  { file: 'Dữ liệu đăng ký kinh doanh Q1/2024', user: 'Trần Thị Bình', time: '22/06/26 09:12:44', format: 'File Excel', accessCount: 980 },
  { file: 'Thống kê công chứng viên 2024', user: 'Lê Văn Cường', time: '22/06/26 10:05:22', format: 'API', accessCount: 2100 },
  { file: 'Danh sách trung tâm TGPL', user: 'Phạm Thị Dung', time: '21/06/26 14:33:08', format: 'File Excel', accessCount: 750 },
  { file: 'Báo cáo tư pháp Q2/2024', user: 'Hoàng Văn Em', time: '21/06/26 16:45:30', format: 'API', accessCount: 1800 },
  { file: 'Danh mục hộ tịch 2024', user: 'Vũ Thị Phương', time: '20/06/26 11:20:55', format: 'API', accessCount: 3200 },
  { file: 'Dữ liệu công chứng Q1/2024', user: 'Đặng Văn Giang', time: '20/06/26 13:15:40', format: 'File Excel', accessCount: 620 },
  { file: 'Thống kê hộ tịch 2023', user: 'Bùi Thị Hương', time: '19/06/26 09:50:18', format: 'API', accessCount: 1450 },
  { file: 'Danh sách công chứng viên HN', user: 'Ngô Văn Khánh', time: '19/06/26 15:08:33', format: 'File Excel', accessCount: 540 },
  { file: 'Báo cáo kinh doanh 2024', user: 'Đinh Thị Lan', time: '18/06/26 10:22:47', format: 'API', accessCount: 2850 },
  { file: 'Dữ liệu hộ tịch Q1/2024', user: 'Lý Văn Minh', time: '18/06/26 14:40:12', format: 'File Excel', accessCount: 710 },
  { file: 'Danh mục QPPL 2023', user: 'Tô Thị Nhung', time: '17/06/26 09:15:29', format: 'API', accessCount: 1680 },
];

const COLORS = ['#0ea5e9', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

// Tên danh mục dữ liệu mở lấy từ màn "Thiết lập danh mục dữ liệu mở" (mockPublishedCategories) theo Mã danh mục
function getCatalogName(catalogCode: string): string {
  return mockPublishedCategories.find(c => c.code === catalogCode)?.name ?? '—';
}

const categoryOptions = statsByCategory.map(c => c.name);
const agencyOptions = statsByAgency.map(a => a.name);
const licenseOptions = ['CC BY 4.0', 'ODC-BY', 'ODbL', 'CC0', 'CC BY-SA 4.0'];
const formatOptions = ['File Excel', 'API'];
const sourceOptions = initialTargetDatabases.map(db => db.name);
const userTypeOptions = ['Quản trị hệ thống', 'Lãnh đạo quản trị', 'Chuyên viên quản trị', 'Quản trị đơn vị', 'Lãnh đạo nghiệp vụ', 'Chuyên viên'];

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}

function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);

  return (
    <div ref={ref} className="relative">
      <label className="block text-[13px] text-slate-700 mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] text-left flex items-center justify-between bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <span className={selected.length === 0 ? 'text-slate-400' : 'text-slate-900'}>
          {selected.length === 0 ? 'Tất cả' : `Đã chọn ${selected.length}`}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] text-slate-700">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                className="w-3.5 h-3.5 rounded accent-blue-600"
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function ExportDropdown({ onExportExcel, onExportPDF }: { onExportExcel: () => void; onExportPDF: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-[13px] cursor-pointer"
      >
        <Download className="w-4 h-4" />
        Xuất dữ liệu
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => { onExportExcel(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50 border-b border-slate-100"
          >
            <Download className="w-4 h-4 text-green-600" />
            Xuất Excel (.xlsx)
          </button>
          <button
            onClick={() => { onExportPDF(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50"
          >
            <FileText className="w-4 h-4 text-red-600" />
            Xuất PDF (.pdf)
          </button>
        </div>
      )}
    </div>
  );
}

export function OpenDataReportPage({ onBack }: OpenDataReportPageProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'statistics' | 'classification' | 'access'>('search');
  
  // Search & Filter States
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAgency, setFilterAgency] = useState('all');
  const [filterFormat, setFilterFormat] = useState('all');
  const [filterLicense, setFilterLicense] = useState('all');
  const [showSearchFilters, setShowSearchFilters] = useState(false);
  
  // Statistics States
  const [statsGroupBy, setStatsGroupBy] = useState<'agency' | 'category' | 'license' | 'time'>('category');
  const [statsTimeRange, setStatsTimeRange] = useState('2024');
  const [statsFromDate, setStatsFromDate] = useState('');
  const [statsToDate, setStatsToDate] = useState('');
  const [statsReportReady, setStatsReportReady] = useState(false);
  const [appliedGroupBy, setAppliedGroupBy] = useState<'agency' | 'category' | 'license' | 'time'>('category');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);
  const [appliedAgencies, setAppliedAgencies] = useState<string[]>([]);
  const [appliedLicenses, setAppliedLicenses] = useState<string[]>([]);
  const [appliedFromDate, setAppliedFromDate] = useState('');
  const [appliedToDate, setAppliedToDate] = useState('');
  
  // Classification States
  const [classifyBy, setClassifyBy] = useState<'source' | 'category' | 'format'>('category');
  const [classReportReady, setClassReportReady] = useState(false);
  const [appliedClassifyBy, setAppliedClassifyBy] = useState<'source' | 'category' | 'format'>('category');
  const [selectedClassFilters, setSelectedClassFilters] = useState<string[]>([]);
  const [appliedClassFilters, setAppliedClassFilters] = useState<string[]>([]);
  
  // Access Stats States
  const [accessGroupBy, setAccessGroupBy] = useState<'time' | 'userType' | 'source' | 'shareFormat'>('time');
  const [accessFromMonth, setAccessFromMonth] = useState('');
  const [accessToMonth, setAccessToMonth] = useState('');
  const [selectedAccessFilters, setSelectedAccessFilters] = useState<string[]>([]);
  const [appliedAccessGroupBy, setAppliedAccessGroupBy] = useState<'time' | 'userType' | 'source' | 'shareFormat'>('time');
  const [appliedAccessFromMonth, setAppliedAccessFromMonth] = useState('');
  const [appliedAccessToMonth, setAppliedAccessToMonth] = useState('');
  const [appliedAccessFilters, setAppliedAccessFilters] = useState<string[]>([]);
  const [accessReportReady, setAccessReportReady] = useState(false);
  const [alertThresholdInput, setAlertThresholdInput] = useState('500');
  const [alertThreshold, setAlertThreshold] = useState(500);

  // Pagination States
  const [pageSize, setPageSize] = useState(10);
  const [searchPage, setSearchPage] = useState(1);
  const [statsPage, setStatsPage] = useState(1);
  const [classPage, setClassPage] = useState(1);
  const [accessPage, setAccessPage] = useState(1);

  const [sortKey, setSortKey] = useState<keyof (typeof mockDatasets)[0] | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: keyof (typeof mockDatasets)[0]) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ col }: { col: keyof (typeof mockDatasets)[0] }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-slate-400 inline ml-1" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-blue-600 inline ml-1" />
      : <ChevronDown className="w-3 h-3 text-blue-600 inline ml-1" />;
  };

  const filteredDatasets = mockDatasets.filter(dataset => {
    if (searchKeyword && !dataset.name.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    if (filterCategory !== 'all' && dataset.category !== filterCategory) return false;
    if (filterAgency !== 'all' && dataset.agency !== filterAgency) return false;
    if (filterFormat !== 'all' && dataset.format !== filterFormat) return false;
    if (filterLicense !== 'all' && dataset.license !== filterLicense) return false;
    return true;
  });

  const sortedDatasets = sortKey
    ? [...filteredDatasets].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return sortDir === 'asc'
          ? String(aVal).localeCompare(String(bVal), 'vi')
          : String(bVal).localeCompare(String(aVal), 'vi');
      })
    : filteredDatasets;

  const computedFilteredDatasets = (() => {
    if (!statsReportReady) return [] as typeof mockDatasets;
    let base = [...mockDatasets];
    if (appliedGroupBy === 'category' && appliedCategories.length > 0)
      base = base.filter(d => appliedCategories.includes(d.category));
    else if (appliedGroupBy === 'agency' && appliedAgencies.length > 0)
      base = base.filter(d => appliedAgencies.includes(d.agency));
    else if (appliedGroupBy === 'license' && appliedLicenses.length > 0)
      base = base.filter(d => appliedLicenses.includes(d.license));
    else if (appliedGroupBy === 'time') {
      if (appliedFromDate) base = base.filter(d => d.publishedDate >= appliedFromDate);
      if (appliedToDate) base = base.filter(d => d.publishedDate <= appliedToDate);
    }
    return base;
  })();

  const computedStatsData = (() => {
    const groups: Record<string, number> = {};
    computedFilteredDatasets.forEach(d => {
      const key = appliedGroupBy === 'category' ? d.category
                : appliedGroupBy === 'agency' ? d.agency
                : appliedGroupBy === 'license' ? d.license
                : d.publishedDate.slice(0, 7);
      groups[key] = (groups[key] || 0) + 1;
    });
    const entries = Object.entries(groups);
    if (appliedGroupBy === 'time') entries.sort(([a], [b]) => a.localeCompare(b));
    return entries.map(([name, count]) => ({ name, count }));
  })();

  const computedClassData = (() => {
    if (!classReportReady) return [] as { name: string; count: number; views: number; downloads: number }[];
    const field = appliedClassifyBy === 'source' ? 'source' : appliedClassifyBy === 'category' ? 'category' : 'shareFormat';
    let base = [...mockDatasets];
    if (appliedClassFilters.length > 0)
      base = base.filter(d => appliedClassFilters.includes(d[field as keyof typeof d] as string));
    const groups: Record<string, { count: number; views: number; downloads: number }> = {};
    base.forEach(d => {
      const key = d[field as keyof typeof d] as string;
      if (!groups[key]) groups[key] = { count: 0, views: 0, downloads: 0 };
      groups[key].count++;
      groups[key].views += d.views;
      groups[key].downloads += d.downloads;
    });
    return Object.entries(groups).map(([name, data]) => ({ name, ...data }));
  })();

  const computedClassTotal = computedClassData.reduce((s, i) => s + i.count, 0);
  const computedClassPieData = computedClassData.map(d => ({ name: d.name, value: d.count }));

  const computedAccessChartData = (() => {
    if (!accessReportReady) return [] as { name: string; views: number; downloads: number }[];
    if (appliedAccessGroupBy === 'time') {
      let data = mockAccessByMonth;
      if (appliedAccessFromMonth) data = data.filter(d => d.key >= appliedAccessFromMonth);
      if (appliedAccessToMonth) data = data.filter(d => d.key <= appliedAccessToMonth);
      return data.map(d => ({ name: d.label, views: d.views, downloads: d.downloads }));
    }
    const base =
      appliedAccessGroupBy === 'userType' ? mockAccessByUserType :
      appliedAccessGroupBy === 'source' ? mockAccessBySource : mockAccessByFormat;
    const filtered = appliedAccessFilters.length > 0 ? base.filter(d => appliedAccessFilters.includes(d.name)) : base;
    return filtered;
  })();

  const handleExportExcel = () => {
    alert('Xuất dữ liệu ra Excel');
  };

  const handleExportPDF = () => {
    alert('Xuất dữ liệu ra PDF');
  };

  const renderPagination = (total: number, currentPage: number, setCurrentPage: (p: number) => void) => {
    if (total <= 0) return null;
    const totalPages = Math.ceil(total / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, total);
    return (
      <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white text-[13px] text-slate-600">
        <div className="flex items-center gap-2">
          <span>Hiển thị</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-[13px] cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>bản ghi/trang</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{startItem} - {endItem} / {total}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-[13px] transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mt-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all text-[13px] ${
              activeTab === 'search'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            Tìm kiếm và lọc
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all text-[13px] ${
              activeTab === 'statistics'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Báo cáo thống kê
          </button>
          <button
            onClick={() => setActiveTab('classification')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all text-[13px] ${
              activeTab === 'classification'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-4 h-4" />
            Báo cáo phân loại
          </button>
          <button
            onClick={() => setActiveTab('access')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all text-[13px] ${
              activeTab === 'access'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Thống kê lượt truy cập
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Tab 1: Tìm kiếm và lọc (UC481) */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            {/* Toolbar: tìm kiếm + bật/tắt bộ lọc + xuất dữ liệu — theo mẫu chuẩn của Thiết lập dịch vụ */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Tìm theo từ khóa, tên dataset..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  />
                </div>
                <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowSearchFilters(!showSearchFilters)}
                  className={`p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border ${showSearchFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  title="Bộ lọc"
                >
                  {showSearchFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <ExportDropdown onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} />
              </div>
            </div>

            {/* Bộ lọc (thu gọn/mở rộng) */}
            {showSearchFilters && (
              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-4 gap-4 shadow-sm">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-700">Chủ đề</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  >
                    <option value="all">Tất cả chủ đề</option>
                    <option value="Văn bản pháp luật">Văn bản pháp luật</option>
                    <option value="Đăng ký kinh doanh">Đăng ký kinh doanh</option>
                    <option value="Công chứng">Công chứng</option>
                    <option value="Trợ giúp pháp lý">Trợ giúp pháp lý</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-700">Cơ quan công bố</label>
                  <select
                    value={filterAgency}
                    onChange={(e) => setFilterAgency(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  >
                    <option value="all">Tất cả cơ quan</option>
                    <option value="Bộ Tư pháp">Bộ Tư pháp</option>
                    <option value="Cục Đăng ký kinh doanh">Cục Đăng ký kinh doanh</option>
                    <option value="Cục Công chứng">Cục Công chứng</option>
                    <option value="Cục TGPL">Cục TGPL</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-700">Định dạng</label>
                  <select
                    value={filterFormat}
                    onChange={(e) => setFilterFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  >
                    <option value="all">Tất cả định dạng</option>
                    <option value="JSON">JSON</option>
                    <option value="Excel">Excel</option>
                    <option value="CSV">CSV</option>
                    <option value="XML">XML</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-700">Giấy phép</label>
                  <select
                    value={filterLicense}
                    onChange={(e) => setFilterLicense(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  >
                    <option value="all">Tất cả giấy phép</option>
                    <option value="CC BY 4.0">CC BY 4.0</option>
                    <option value="ODC-BY">ODC-BY</option>
                    <option value="ODbL">ODbL</option>
                  </select>
                </div>
              </div>
            )}

            <p className="text-[13px] text-slate-500">
              Tìm thấy <span className="font-medium text-blue-600">{filteredDatasets.length}</span> kết quả
            </p>

            {/* Results Table — chỉ hiển thị đúng các trường theo UC481 (tên, mô tả, chủ đề, định dạng, trạng thái công bố) */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-[13px] text-slate-600 cursor-pointer select-none hover:bg-slate-100" onClick={() => handleSort('catalogCode')}>Mã danh mục<SortIcon col="catalogCode" /></th>
                      <th className="px-4 py-3 text-left text-[13px] text-slate-600">Tên danh mục</th>
                      <th className="px-4 py-3 text-left text-[13px] text-slate-600 cursor-pointer select-none hover:bg-slate-100" onClick={() => handleSort('name')}>Tên &amp; mô tả<SortIcon col="name" /></th>
                      <th className="px-4 py-3 text-left text-[13px] text-slate-600 cursor-pointer select-none hover:bg-slate-100" onClick={() => handleSort('category')}>Chủ đề<SortIcon col="category" /></th>
                      <th className="px-4 py-3 text-left text-[13px] text-slate-600 cursor-pointer select-none hover:bg-slate-100" onClick={() => handleSort('format')}>Định dạng<SortIcon col="format" /></th>
                      <th className="px-4 py-3 text-left text-[13px] text-slate-600 cursor-pointer select-none hover:bg-slate-100" onClick={() => handleSort('status')}>Trạng thái công bố<SortIcon col="status" /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {sortedDatasets.slice((searchPage - 1) * pageSize, searchPage * pageSize).map((dataset) => (
                      <tr key={dataset.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-[13px] text-slate-900 whitespace-nowrap">{dataset.catalogCode}</td>
                        <td className="px-4 py-3 text-[13px] text-slate-700 whitespace-nowrap">{getCatalogName(dataset.catalogCode)}</td>
                        <td className="px-4 py-3 text-[13px] max-w-[360px]">
                          <div className="text-slate-900">{dataset.name}</div>
                          <div className="text-slate-500 mt-0.5">{dataset.description}</div>
                        </td>
                        <td className="px-4 py-3 text-[13px]">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[13px] bg-blue-50 text-blue-700">
                            {dataset.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[13px]">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[13px] bg-slate-100 text-slate-700">
                            {dataset.format}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[13px]">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-[13px] border ${PUBLISH_STATUS_STYLES[dataset.status]}`}>
                            {PUBLISH_STATUS_LABELS[dataset.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination(sortedDatasets.length, searchPage, setSearchPage)}
            </div>
          </div>
        )}

        {/* Tab 2: Báo cáo thống kê */}
        {activeTab === 'statistics' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Tổng Dataset</span>
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl text-slate-900">{mockDatasets.length}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Cơ quan công bố</span>
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl text-slate-900">{new Set(mockDatasets.map(d => d.agency)).size}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Chủ đề</span>
                  <Tag className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-2xl text-slate-900">{new Set(mockDatasets.map(d => d.category)).size}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Giấy phép</span>
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl text-slate-900">{new Set(mockDatasets.map(d => d.license)).size}</div>
              </div>
            </div>

            {/* Filter Panel */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className={`grid gap-4 ${statsGroupBy === 'time' ? 'grid-cols-4' : 'grid-cols-3'}`}>
                <div>
                  <label className="block text-[13px] text-slate-700 mb-2">Nhóm theo</label>
                  <select
                    value={statsGroupBy}
                    onChange={(e) => { setStatsGroupBy(e.target.value as any); setStatsFromDate(''); setStatsToDate(''); setSelectedCategories([]); setSelectedAgencies([]); setSelectedLicenses([]); setStatsReportReady(false); }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="category">Theo chủ đề</option>
                    <option value="agency">Theo cơ quan công bố</option>
                    <option value="license">Theo giấy phép</option>
                    <option value="time">Theo thời gian công bố</option>
                  </select>
                </div>

                {statsGroupBy === 'time' ? (
                  <>
                    <div>
                      <label className="block text-[13px] text-slate-700 mb-2">Từ ngày</label>
                      <input
                        type="date"
                        value={statsFromDate}
                        onChange={(e) => setStatsFromDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] text-slate-700 mb-2">Đến ngày</label>
                      <input
                        type="date"
                        value={statsToDate}
                        min={statsFromDate}
                        onChange={(e) => setStatsToDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button onClick={() => { setAppliedGroupBy(statsGroupBy); setAppliedFromDate(statsFromDate); setAppliedToDate(statsToDate); setStatsReportReady(true); setStatsPage(1); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-[13px] whitespace-nowrap">
                        <BarChart3 className="w-4 h-4" />
                        Tạo báo cáo
                      </button>
                      <ExportDropdown onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} />
                    </div>
                  </>
                ) : (
                  <>
                    <MultiSelect
                      label={
                        statsGroupBy === 'category' ? 'Chủ đề' :
                        statsGroupBy === 'agency' ? 'Cơ quan công bố' : 'Giấy phép'
                      }
                      options={
                        statsGroupBy === 'category' ? categoryOptions :
                        statsGroupBy === 'agency' ? agencyOptions : licenseOptions
                      }
                      selected={
                        statsGroupBy === 'category' ? selectedCategories :
                        statsGroupBy === 'agency' ? selectedAgencies : selectedLicenses
                      }
                      onChange={(v) => {
                        if (statsGroupBy === 'category') setSelectedCategories(v);
                        else if (statsGroupBy === 'agency') setSelectedAgencies(v);
                        else setSelectedLicenses(v);
                        setStatsReportReady(false);
                      }}
                    />
                    <div className="flex items-end gap-2">
                      <button onClick={() => { setAppliedGroupBy(statsGroupBy); setAppliedCategories(selectedCategories); setAppliedAgencies(selectedAgencies); setAppliedLicenses(selectedLicenses); setStatsReportReady(true); setStatsPage(1); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-[13px] whitespace-nowrap">
                        <BarChart3 className="w-4 h-4" />
                        Tạo báo cáo
                      </button>
                      <ExportDropdown onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} />
                    </div>
                  </>
                )}
              </div>
            </div>

            {statsReportReady ? (
              <>
                {/* Chart */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-slate-900 mb-4">
                    Thống kê số lượng Dataset theo {
                      appliedGroupBy === 'category' ? 'chủ đề' :
                      appliedGroupBy === 'agency' ? 'cơ quan' :
                      appliedGroupBy === 'license' ? 'giấy phép' :
                      'thời gian'
                    }
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={computedStatsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxisAny dataKey="name" />
                      <YAxisAny allowDecimals={false} />
                      <TooltipAny />
                      <LegendAny />
                      <BarAny dataKey="count" name="Số lượng Dataset" fill="#3b82f6" maxBarSize={56} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Data Table */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="text-slate-900">Chi tiết thống kê</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-[13px] text-slate-600">
                            {appliedGroupBy === 'category' ? 'Chủ đề' : appliedGroupBy === 'agency' ? 'Cơ quan' : appliedGroupBy === 'license' ? 'Giấy phép' : 'Tháng'}
                          </th>
                          <th className="px-4 py-3 text-right text-[13px] text-slate-600">Số lượng Dataset</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {computedStatsData.slice((statsPage - 1) * pageSize, statsPage * pageSize).map((item, index) => (
                          <tr key={index} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-[13px] text-slate-900">{item.name}</td>
                            <td className="px-4 py-3 text-[13px] text-slate-900 text-right">{item.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(computedStatsData.length, statsPage, setStatsPage)}
                </div>
              </>
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg p-12 flex flex-col items-center justify-center text-center">
                <BarChart3 className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-[13px] text-slate-500">Vui lòng thiết lập bộ lọc và nhấn <span className="font-semibold text-blue-600">Tạo báo cáo</span> để xem kết quả.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Báo cáo phân loại */}
        {activeTab === 'classification' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Tổng Dataset</span>
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl text-slate-900">{mockDatasets.length}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Nguồn cung cấp</span>
                  <FileType className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl text-slate-900">{new Set(mockDatasets.map(d => d.source)).size}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Chủ đề</span>
                  <Tag className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-2xl text-slate-900">{new Set(mockDatasets.map(d => d.category)).size}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Định dạng</span>
                  <Layers className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl text-slate-900">{new Set(mockDatasets.map(d => d.format)).size}</div>
              </div>
            </div>

            {/* Filter Panel */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[13px] text-slate-700 mb-2">Phân loại theo</label>
                  <select
                    value={classifyBy}
                    onChange={(e) => { setClassifyBy(e.target.value as any); setSelectedClassFilters([]); setClassReportReady(false); }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="source">Theo nguồn cung cấp</option>
                    <option value="category">Theo chủ đề</option>
                    <option value="format">Theo định dạng chia sẻ dữ liệu</option>
                  </select>
                </div>

                <MultiSelect
                  label={classifyBy === 'source' ? 'Nguồn cung cấp' : classifyBy === 'category' ? 'Chủ đề' : 'Định dạng chia sẻ'}
                  options={classifyBy === 'source' ? sourceOptions : classifyBy === 'category' ? categoryOptions : formatOptions}
                  selected={selectedClassFilters}
                  onChange={(v) => { setSelectedClassFilters(v); setClassReportReady(false); }}
                />

                <div className="flex items-end gap-2">
                  <button
                    onClick={() => { setAppliedClassifyBy(classifyBy); setAppliedClassFilters(selectedClassFilters); setClassReportReady(true); setClassPage(1); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-[13px] whitespace-nowrap"
                  >
                    <PieChart className="w-4 h-4" />
                    Tạo báo cáo
                  </button>
                  <ExportDropdown onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} />
                </div>
              </div>
            </div>

            {classReportReady ? (
              <>
                {/* Charts Grid — biểu đồ tròn hẹp hơn biểu đồ cột */}
                <div className="grid grid-cols-5 gap-6">
                  <div className="col-span-2 bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="text-slate-900 mb-4">
                      Biểu đồ phân bố theo {appliedClassifyBy === 'source' ? 'nguồn cung cấp' : appliedClassifyBy === 'category' ? 'chủ đề' : 'định dạng chia sẻ'}
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <PieAny
                          data={computedClassPieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {computedClassPieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </PieAny>
                        <TooltipAny />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="col-span-3 bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="text-slate-900 mb-4">Thống kê số lượng Dataset</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={computedClassPieData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxisAny dataKey="name" />
                        <YAxisAny allowDecimals={false} />
                        <TooltipAny />
                        <BarAny dataKey="value" name="Số lượng" fill="#0ea5e9" maxBarSize={56} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detail Table */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="text-slate-900">Bảng phân tích chi tiết</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-[13px] text-slate-600">
                            {appliedClassifyBy === 'source' ? 'Nguồn cung cấp' : appliedClassifyBy === 'category' ? 'Chủ đề' : 'Định dạng chia sẻ'}
                          </th>
                          <th className="px-4 py-3 text-right text-[13px] text-slate-600">Số lượng</th>
                          <th className="px-4 py-3 text-right text-[13px] text-slate-600">Tỷ lệ (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {computedClassData.slice((classPage - 1) * pageSize, classPage * pageSize).map((item, index) => (
                          <tr key={index} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-[13px] text-slate-900">{item.name}</td>
                            <td className="px-4 py-3 text-[13px] text-slate-900 text-right">{item.count}</td>
                            <td className="px-4 py-3 text-[13px] text-slate-900 text-right">
                              {computedClassTotal > 0 ? (item.count / computedClassTotal * 100).toFixed(1) : '0.0'}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(computedClassData.length, classPage, setClassPage)}
                </div>
              </>
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg p-12 flex flex-col items-center justify-center text-center">
                <PieChart className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-[13px] text-slate-500">Vui lòng thiết lập bộ lọc và nhấn <span className="font-semibold text-blue-600">Tạo báo cáo</span> để xem kết quả.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Thống kê lượt truy cập */}
        {activeTab === 'access' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Tổng lượt xem</span>
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl text-slate-900">{mockDatasets.reduce((s, d) => s + d.views, 0).toLocaleString()}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Tổng lượt tải</span>
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl text-slate-900">{mockDatasets.reduce((s, d) => s + d.downloads, 0).toLocaleString()}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Lượt tải theo File Excel</span>
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl text-slate-900">{mockAccessByFormat.find(f => f.name === 'File Excel')?.downloads.toLocaleString() ?? 0}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Lượt tải theo API</span>
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl text-slate-900">{mockAccessByFormat.find(f => f.name === 'API')?.downloads.toLocaleString() ?? 0}</div>
              </div>
            </div>

            {/* Filter Panel */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className={`grid gap-4 ${accessGroupBy === 'time' ? 'grid-cols-4' : 'grid-cols-3'}`}>
                <div>
                  <label className="block text-[13px] text-slate-700 mb-2">Nhóm theo</label>
                  <select
                    value={accessGroupBy}
                    onChange={(e) => { setAccessGroupBy(e.target.value as any); setAccessFromMonth(''); setAccessToMonth(''); setSelectedAccessFilters([]); setAccessReportReady(false); }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="time">Theo khoảng thời gian</option>
                    <option value="userType">Theo loại người dùng</option>
                    <option value="source">Theo nguồn truy cập</option>
                    <option value="shareFormat">Theo loại dữ liệu chia sẻ</option>
                  </select>
                </div>

                {accessGroupBy === 'time' ? (
                  <>
                    <div>
                      <label className="block text-[13px] text-slate-700 mb-2">Từ tháng</label>
                      <input
                        type="month"
                        value={accessFromMonth}
                        onChange={(e) => setAccessFromMonth(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] text-slate-700 mb-2">Đến tháng</label>
                      <input
                        type="month"
                        value={accessToMonth}
                        min={accessFromMonth}
                        onChange={(e) => setAccessToMonth(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        onClick={() => { setAppliedAccessGroupBy(accessGroupBy); setAppliedAccessFromMonth(accessFromMonth); setAppliedAccessToMonth(accessToMonth); setAccessReportReady(true); setAccessPage(1); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-[13px] whitespace-nowrap"
                      >
                        <TrendingUp className="w-4 h-4" />
                        Tạo báo cáo
                      </button>
                      <ExportDropdown onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} />
                    </div>
                  </>
                ) : (
                  <>
                    <MultiSelect
                      label={
                        accessGroupBy === 'userType' ? 'Loại người dùng' :
                        accessGroupBy === 'source' ? 'Nguồn truy cập' : 'Loại dữ liệu chia sẻ'
                      }
                      options={
                        accessGroupBy === 'userType' ? userTypeOptions :
                        accessGroupBy === 'source' ? sourceOptions : formatOptions
                      }
                      selected={selectedAccessFilters}
                      onChange={(v) => { setSelectedAccessFilters(v); setAccessReportReady(false); }}
                    />
                    <div className="flex items-end gap-2">
                      <button
                        onClick={() => { setAppliedAccessGroupBy(accessGroupBy); setAppliedAccessFilters(selectedAccessFilters); setAccessReportReady(true); setAccessPage(1); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-[13px] whitespace-nowrap"
                      >
                        <TrendingUp className="w-4 h-4" />
                        Tạo báo cáo
                      </button>
                      <ExportDropdown onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} />
                    </div>
                  </>
                )}
              </div>
            </div>

            {accessReportReady ? (
              <>
                {/* Trend Chart */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-slate-900 mb-4">
                    Thống kê truy cập theo {
                      appliedAccessGroupBy === 'time' ? 'thời gian' :
                      appliedAccessGroupBy === 'userType' ? 'loại người dùng' :
                      appliedAccessGroupBy === 'source' ? 'nguồn truy cập' : 'loại dữ liệu chia sẻ'
                    }
                  </h3>
                  {appliedAccessGroupBy === 'time' ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={computedAccessChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxisAny dataKey="name" />
                        <YAxisAny />
                        <TooltipAny />
                        <LegendAny />
                        <LineAny type="monotone" dataKey="views" stroke="#0ea5e9" strokeWidth={2} name="Lượt xem" />
                        <LineAny type="monotone" dataKey="downloads" stroke="#3b82f6" strokeWidth={2} name="Lượt tải" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={computedAccessChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxisAny dataKey="name" />
                        <YAxisAny />
                        <TooltipAny />
                        <LegendAny />
                        <BarAny dataKey="views" name="Lượt xem" fill="#0ea5e9" maxBarSize={32} radius={[4, 4, 0, 0]} />
                        <BarAny dataKey="downloads" name="Lượt tải" fill="#3b82f6" maxBarSize={32} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Alert Table */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-slate-900 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-orange-500" />
                        Cảnh báo truy cập vượt ngưỡng
                      </h3>
                      <div className="flex items-center gap-3">
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span className="text-[13px] text-slate-600">Ngưỡng cảnh báo:</span>
                        <input
                          type="number"
                          min={1}
                          value={alertThresholdInput}
                          onChange={(e) => setAlertThresholdInput(e.target.value)}
                          className="w-24 px-2 py-1 border border-slate-300 rounded text-[13px] text-right focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <span className="text-[13px] text-slate-600">lượt</span>
                        <button
                          onClick={() => { const v = parseInt(alertThresholdInput); if (!isNaN(v) && v > 0) setAlertThreshold(v); }}
                          className="px-3 py-1 bg-orange-500 text-white text-[13px] rounded hover:bg-orange-600"
                        >
                          Lưu cài đặt
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Đang cảnh báo khi lượt truy cập chia sẻ vượt <span className="font-medium text-orange-600">{alertThreshold.toLocaleString()} lượt</span>
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-[13px] text-slate-600 w-10">STT</th>
                          <th className="px-4 py-3 text-left text-[13px] text-slate-600">Tên tệp dữ liệu</th>
                          <th className="px-4 py-3 text-left text-[13px] text-slate-600">Thời gian</th>
                          <th className="px-4 py-3 text-left text-[13px] text-slate-600">Định dạng chia sẻ</th>
                          <th className="px-4 py-3 text-right text-[13px] text-slate-600">Lượt truy cập chia sẻ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {mockAlertLogs.slice((accessPage - 1) * pageSize, accessPage * pageSize).map((row, index) => {
                          const exceeded = row.accessCount >= alertThreshold;
                          return (
                            <tr key={index} className={exceeded ? 'bg-orange-50 hover:bg-orange-100' : 'hover:bg-slate-50'}>
                              <td className="px-4 py-3 text-[13px] text-slate-500">{(accessPage - 1) * pageSize + index + 1}</td>
                              <td className="px-4 py-3 text-[13px] text-slate-900">{row.file}</td>
                              <td className="px-4 py-3 text-[13px] text-slate-600">{row.time}</td>
                              <td className="px-4 py-3 text-[13px]">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] ${
                                  row.format === 'API' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                                }`}>
                                  {row.format}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-[13px] text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className={exceeded ? 'font-semibold text-orange-600' : 'text-slate-900'}>
                                    {row.accessCount.toLocaleString()}
                                  </span>
                                  {exceeded && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-orange-100 text-orange-600">
                                      <Bell className="w-2.5 h-2.5" />
                                      Vượt ngưỡng
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(mockAlertLogs.length, accessPage, setAccessPage)}
                </div>
              </>
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg p-12 flex flex-col items-center justify-center text-center">
                <TrendingUp className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-[13px] text-slate-500">Vui lòng thiết lập bộ lọc và nhấn <span className="font-semibold text-blue-600">Tạo báo cáo</span> để xem kết quả.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}