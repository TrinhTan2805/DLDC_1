import { useState, useRef, useEffect } from 'react';
import { Search, Filter, Download, FileText, BarChart3, PieChart, TrendingUp, Building2, Tag, FileType, Shield, Eye, ArrowUpDown, ChevronUp, ChevronDown, Bell, Settings, X, Layers } from 'lucide-react';
import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { initialTargetDatabases } from '../processing/mockTargetDatabases';
import { mockPublishedCategories } from '../open-data-category/OpenDataCategorySetupPage';
import { PUBLISH_STATUS_LABELS, type PublishStatus } from '../open-data/OpenDataPublishPage';
import {
  Badge, TruncatedText, Pagination, tabClass, BTN_PRIMARY, BTN_OUTLINE, INPUT_CLS, FILTER_LABEL, FILTER_GRID_CLS,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, normalizeSearch,
} from '../collection/collectionUi';

const XAxisAny = XAxis as any;
const YAxisAny = YAxis as any;
const TooltipAny = Tooltip as any;
const LegendAny = Legend as any;
const BarAny = Bar as any;
const PieAny = Pie as any;
const LineAny = Line as any;

// Bảng (compomennt.md 5.3)
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const TR = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const TABLE_CLS = 'w-full border-collapse collection-table text-[13px]';
// Khung bảng / thẻ biểu đồ / thẻ thống kê nhỏ (compomennt.md 5.3, 5.6.1)
const TABLE_WRAP = 'bg-white rounded-lg border border-[#E2E8F0] overflow-hidden';
const CHART_CARD = 'bg-white rounded-2xl border border-[#E2E8F0] p-4';
const CHART_TITLE = 'text-[14px] font-medium text-[#020817]';
const STAT_CARD = 'bg-white rounded-2xl border border-[#E2E8F0] p-4';
const STAT_LABEL = 'text-[16px] text-[#64748B]';
const STAT_VALUE = 'text-[16px] font-semibold text-[#0F172A] tabular-nums';
const FILTER_PANEL = 'bg-white p-4 rounded-2xl border border-[#E2E8F0]';
// Ô chọn trong thẻ biểu đồ (bộ lọc riêng từng biểu đồ)
const CHART_SELECT = 'h-9 px-3 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer';
// Trục / chú thích / tooltip biểu đồ: chữ 12px #64748B, lưới #E2E8F0
const AXIS_TICK = { fontSize: 12, fill: '#64748B' };
const CHART_TOOLTIP_STYLE = { borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: 'none', fontSize: 12, color: '#64748B' };
const LEGEND_PROPS = {
  wrapperStyle: { fontSize: 12 },
  iconType: 'circle',
  formatter: (value: string) => <span style={{ color: '#64748B' }}>{value}</span>,
};

// Trạng thái công bố → tông Badge (giữ ý nghĩa màu cũ: xanh lá / xám / vàng)
const PUBLISH_STATUS_VARIANT: Record<PublishStatus, string> = {
  published: 'green',
  draft: 'slate',
  updating: 'amber',
};

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

// 12 tháng gần nhất tính đến tháng hiện tại — dùng làm dữ liệu, mặc định khoảng lọc và trục ngang biểu đồ
const RECENT_MONTHS: { key: string; label: string }[] = (() => {
  const now = new Date();
  const arr: { key: string; label: string }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mm = d.getMonth() + 1;
    arr.push({ key: `${d.getFullYear()}-${String(mm).padStart(2, '0')}`, label: `T${mm}/${d.getFullYear()}` });
  }
  return arr;
})();

// apiCalls = lượt gọi API (hệ thống khai thác gọi), views = lượt truy cập (người dùng xem giao diện) — hai kênh khác nhau
const BASE_API_CALLS = [52000, 60000, 71000, 67000, 76000, 84000, 79000, 88000, 95000, 91000, 99000, 108000];
const BASE_VIEWS = [4500, 5200, 6100, 5800, 6500, 7200, 6800, 7500, 8100, 7800, 8500, 9200];
const BASE_DOWNLOADS = [1200, 1450, 1680, 1520, 1890, 2100, 1950, 2200, 2400, 2300, 2600, 2800];
const mockAccessByMonth = RECENT_MONTHS.map((m, i) => ({
  key: m.key, label: m.label, apiCalls: BASE_API_CALLS[i], views: BASE_VIEWS[i], downloads: BASE_DOWNLOADS[i],
}));
const mockAccessByUserType = [
  { name: 'Quản trị hệ thống', apiCalls: 8200, views: 3200, downloads: 950 },
  { name: 'Lãnh đạo quản trị', apiCalls: 6400, views: 4100, downloads: 1200 },
  { name: 'Chuyên viên quản trị', apiCalls: 14500, views: 5800, downloads: 1650 },
  { name: 'Quản trị đơn vị', apiCalls: 9100, views: 3900, downloads: 1100 },
  { name: 'Lãnh đạo nghiệp vụ', apiCalls: 11200, views: 6200, downloads: 1850 },
  { name: 'Chuyên viên', apiCalls: 28600, views: 12120, downloads: 3110 },
];
const mockAccessBySource = [
  { name: 'CSDL Kho DLDC', apiCalls: 38000, views: 14500, downloads: 4200 },
  { name: 'CSDL Phân tích số liệu', apiCalls: 31000, views: 12800, downloads: 3600 },
  { name: 'CSDL Lưu trữ lịch sử', apiCalls: 16500, views: 8020, downloads: 2060 },
];
const mockAccessByFormat = [
  { name: 'File Excel', apiCalls: 0, views: 22500, downloads: 7200 },
  { name: 'API', apiCalls: 34800, views: 12820, downloads: 2660 },
];

// Chi tiết truy cập theo tháng × nguồn (CSDL) × loại dữ liệu chia sẻ — cho phép lọc theo Nguồn truy cập / Loại dữ liệu chia sẻ, biểu đồ luôn vẽ theo trục thời gian.
// Lượt gọi API chỉ phát sinh ở định dạng chia sẻ API; File Excel không có lượt gọi API.
const ACCESS_SOURCE_WEIGHTS = [
  { name: 'CSDL Kho DLDC', weight: 0.45 },
  { name: 'CSDL Phân tích số liệu', weight: 0.35 },
  { name: 'CSDL Lưu trữ lịch sử', weight: 0.20 },
];
const accessSourceOptions = ACCESS_SOURCE_WEIGHTS.map(s => s.name);

// Bộ lọc riêng của biểu đồ Lượt tải dữ liệu — theo Đơn vị khai thác (co giãn giá trị theo tỷ trọng đơn vị)
const ACCESS_EXPLOIT_UNITS = [
  { value: 'all', label: 'Tất cả đơn vị', ratio: 1 },
  { value: 'stp-hcm', label: 'Sở Tư pháp TP. Hồ Chí Minh', ratio: 0.28 },
  { value: 'stp-hn', label: 'Sở Tư pháp TP. Hà Nội', ratio: 0.24 },
  { value: 'dvcqg', label: 'Cổng Dịch vụ công Quốc gia', ratio: 0.20 },
  { value: 'mcdt', label: 'Hệ thống một cửa điện tử cấp tỉnh', ratio: 0.16 },
  { value: 'cuc-cntt', label: 'Cục CNTT - Bộ Tư pháp', ratio: 0.12 },
];
// Bộ lọc riêng của biểu đồ Lượt truy cập — theo Loại người dùng (role)
const ACCESS_USER_TYPES = [
  { value: 'all', label: 'Tất cả người dùng', ratio: 1 },
  { value: 'qtht', label: 'Quản trị hệ thống', ratio: 0.10 },
  { value: 'ldqt', label: 'Lãnh đạo quản trị', ratio: 0.13 },
  { value: 'cvqt', label: 'Chuyên viên quản trị', ratio: 0.18 },
  { value: 'qtdv', label: 'Quản trị đơn vị', ratio: 0.12 },
  { value: 'ldnv', label: 'Lãnh đạo nghiệp vụ', ratio: 0.19 },
  { value: 'cv', label: 'Chuyên viên', ratio: 0.28 },
];

// Cộng/trừ tháng cho chuỗi 'YYYY-MM' (dùng giới hạn khoảng Từ/Đến tháng tối đa 1 năm)
const addMonths = (ym: string, delta: number) => {
  if (!ym) return '';
  const [y, m] = ym.split('-').map(Number);
  const total = y * 12 + (m - 1) + delta;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}`;
};
const mockAccessDetail: { key: string; label: string; source: string; format: string; apiCalls: number; views: number }[] = [];
mockAccessByMonth.forEach(m => {
  ACCESS_SOURCE_WEIGHTS.forEach(s => {
    mockAccessDetail.push({ key: m.key, label: m.label, source: s.name, format: 'API', apiCalls: Math.round(m.apiCalls * s.weight), views: Math.round(m.views * s.weight * 0.35) });
    mockAccessDetail.push({ key: m.key, label: m.label, source: s.name, format: 'File Excel', apiCalls: 0, views: Math.round(m.views * s.weight * 0.65) });
  });
});
// key = tháng phát sinh (khớp khoảng lọc Từ/Đến tháng), source = nguồn truy cập (CSDL), format = loại dữ liệu chia sẻ
// Log cảnh báo gắn vào 12 tháng gần nhất (mỗi dòng một tháng): day/clock cố định, tháng/năm lấy theo RECENT_MONTHS
const ALERT_LOG_BASE = [
  { file: 'Danh sách văn bản QPPL 2024', user: 'Nguyễn Văn An', day: '15', clock: '08:30:15', source: 'CSDL Kho DLDC', format: 'API', accessCount: 1250 },
  { file: 'Dữ liệu đăng ký kinh doanh Q1/2024', user: 'Trần Thị Bình', day: '20', clock: '09:12:44', source: 'CSDL Phân tích số liệu', format: 'File Excel', accessCount: 980 },
  { file: 'Thống kê công chứng viên 2024', user: 'Lê Văn Cường', day: '05', clock: '10:05:22', source: 'CSDL Kho DLDC', format: 'API', accessCount: 2100 },
  { file: 'Danh sách trung tâm TGPL', user: 'Phạm Thị Dung', day: '18', clock: '14:33:08', source: 'CSDL Lưu trữ lịch sử', format: 'File Excel', accessCount: 750 },
  { file: 'Báo cáo tư pháp Q2/2024', user: 'Hoàng Văn Em', day: '09', clock: '16:45:30', source: 'CSDL Phân tích số liệu', format: 'API', accessCount: 1800 },
  { file: 'Danh mục hộ tịch 2024', user: 'Vũ Thị Phương', day: '22', clock: '11:20:55', source: 'CSDL Kho DLDC', format: 'API', accessCount: 3200 },
  { file: 'Dữ liệu công chứng Q1/2024', user: 'Đặng Văn Giang', day: '12', clock: '13:15:40', source: 'CSDL Lưu trữ lịch sử', format: 'File Excel', accessCount: 620 },
  { file: 'Thống kê hộ tịch 2023', user: 'Bùi Thị Hương', day: '03', clock: '09:50:18', source: 'CSDL Phân tích số liệu', format: 'API', accessCount: 1450 },
  { file: 'Danh sách công chứng viên HN', user: 'Ngô Văn Khánh', day: '19', clock: '15:08:33', source: 'CSDL Kho DLDC', format: 'File Excel', accessCount: 540 },
  { file: 'Báo cáo kinh doanh 2024', user: 'Đinh Thị Lan', day: '08', clock: '10:22:47', source: 'CSDL Phân tích số liệu', format: 'API', accessCount: 2850 },
  { file: 'Dữ liệu hộ tịch Q1/2024', user: 'Lý Văn Minh', day: '14', clock: '14:40:12', source: 'CSDL Lưu trữ lịch sử', format: 'File Excel', accessCount: 710 },
  { file: 'Danh mục QPPL 2023', user: 'Tô Thị Nhung', day: '09', clock: '09:15:29', source: 'CSDL Kho DLDC', format: 'API', accessCount: 1680 },
];
const mockAlertLogs = ALERT_LOG_BASE.map((r, i) => {
  const m = RECENT_MONTHS[i];
  const [y, mm] = m.key.split('-');
  return { file: r.file, user: r.user, time: `${r.day}/${mm}/${y} ${r.clock}`, key: m.key, source: r.source, format: r.format, accessCount: r.accessCount };
});

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
      <label className={FILTER_LABEL}>{label}</label>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className={`w-full h-10 px-3 border rounded-lg text-[13px] text-left flex items-center justify-between gap-2 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer ${open ? 'border-[#155DFC]' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'}`}
      >
        <span className={`truncate ${selected.length === 0 ? 'text-[#64748B]' : 'text-[#020817]'}`}>
          {selected.length === 0 ? 'Tất cả' : `Đã chọn ${selected.length}`}
        </span>
        <ChevronDown className={`w-4 h-4 text-[#94A3B8] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-[#E2E8F0] rounded-lg shadow-lg max-h-52 overflow-y-auto custom-scrollbar">
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-3 px-3 py-2 hover:bg-[#F1F5F9] cursor-pointer text-[13px] text-[#020817] transition-colors">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
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
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className={`${BTN_OUTLINE} whitespace-nowrap`}
      >
        <Download className="w-4 h-4" />
        Xuất dữ liệu
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-[#E2E8F0] bg-white shadow-lg p-1 z-50">
          <button
            type="button"
            onClick={() => { onExportExcel(); setOpen(false); }}
            className="w-full flex items-center gap-2 min-h-8 px-3 py-1.5 rounded-md text-left text-[13px] text-[#020817] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#16A34A]" />
            Xuất Excel (.xlsx)
          </button>
          <button
            type="button"
            onClick={() => { onExportPDF(); setOpen(false); }}
            className="w-full flex items-center gap-2 min-h-8 px-3 py-1.5 rounded-md text-left text-[13px] text-[#020817] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#DC2626]" />
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
  // Điều kiện đã áp dụng: chỉ cập nhật khi bấm nút Tìm kiếm hoặc Enter (compomennt.md 5.19)
  const [appliedSearch, setAppliedSearch] = useState({ keyword: '', category: 'all', agency: 'all', format: 'all', license: 'all' });

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
  
  // Access Stats States — mặc định khoảng 12 tháng gần nhất (từ tháng đầu → tháng hiện tại), tự hiển thị báo cáo khi vào
  const defaultAccessFrom = RECENT_MONTHS[0].key;
  const defaultAccessTo = RECENT_MONTHS[RECENT_MONTHS.length - 1].key;
  const [accessFromMonth, setAccessFromMonth] = useState(defaultAccessFrom);
  const [accessToMonth, setAccessToMonth] = useState(defaultAccessTo);
  const [accessSources, setAccessSources] = useState<string[]>([]);
  const [accessFormats, setAccessFormats] = useState<string[]>([]);
  const [appliedAccessFromMonth, setAppliedAccessFromMonth] = useState(defaultAccessFrom);
  const [appliedAccessToMonth, setAppliedAccessToMonth] = useState(defaultAccessTo);
  const [appliedAccessSources, setAppliedAccessSources] = useState<string[]>([]);
  const [appliedAccessFormats, setAppliedAccessFormats] = useState<string[]>([]);
  const [accessReportReady, setAccessReportReady] = useState(true);
  // Bộ lọc riêng từng biểu đồ (co giãn giá trị trực tiếp, không cần bấm Tạo báo cáo)
  const [chartUnit, setChartUnit] = useState('all');
  const [chartUserType, setChartUserType] = useState('all');
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

  const runSearch = () => {
    setAppliedSearch({ keyword: searchKeyword, category: filterCategory, agency: filterAgency, format: filterFormat, license: filterLicense });
    setSearchPage(1);
  };

  const handleSort = (key: keyof (typeof mockDatasets)[0]) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ col }: { col: keyof (typeof mockDatasets)[0] }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-[#94A3B8] inline ml-1" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-blue-600 inline ml-1" />
      : <ChevronDown className="w-3 h-3 text-blue-600 inline ml-1" />;
  };

  const filteredDatasets = mockDatasets.filter(dataset => {
    if (appliedSearch.keyword && !normalizeSearch(dataset.name).includes(normalizeSearch(appliedSearch.keyword))) return false;
    if (appliedSearch.category !== 'all' && dataset.category !== appliedSearch.category) return false;
    if (appliedSearch.agency !== 'all' && dataset.agency !== appliedSearch.agency) return false;
    if (appliedSearch.format !== 'all' && dataset.format !== appliedSearch.format) return false;
    if (appliedSearch.license !== 'all' && dataset.license !== appliedSearch.license) return false;
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
    if (!accessReportReady) return [] as { key: string; name: string; apiCalls: number; views: number }[];
    let rows = mockAccessDetail;
    if (appliedAccessFromMonth) rows = rows.filter(r => r.key >= appliedAccessFromMonth);
    if (appliedAccessToMonth) rows = rows.filter(r => r.key <= appliedAccessToMonth);
    if (appliedAccessSources.length > 0) rows = rows.filter(r => appliedAccessSources.includes(r.source));
    if (appliedAccessFormats.length > 0) rows = rows.filter(r => appliedAccessFormats.includes(r.format));
    const byMonth = new Map<string, { key: string; name: string; apiCalls: number; views: number }>();
    rows.forEach(r => {
      const e = byMonth.get(r.key) ?? { key: r.key, name: r.label, apiCalls: 0, views: 0 };
      e.apiCalls += r.apiCalls;
      e.views += r.views;
      byMonth.set(r.key, e);
    });
    return [...byMonth.values()].sort((a, b) => (a.key < b.key ? -1 : 1));
  })();

  // Bảng cảnh báo lọc theo cùng điều kiện: thời gian (Từ/Đến tháng) + nguồn truy cập + loại dữ liệu chia sẻ
  const filteredAlertLogs = mockAlertLogs.filter(r => {
    if (appliedAccessFromMonth && r.key < appliedAccessFromMonth) return false;
    if (appliedAccessToMonth && r.key > appliedAccessToMonth) return false;
    if (appliedAccessSources.length > 0 && !appliedAccessSources.includes(r.source)) return false;
    if (appliedAccessFormats.length > 0 && !appliedAccessFormats.includes(r.format)) return false;
    return true;
  });

  // Co giãn giá trị theo bộ lọc riêng của từng biểu đồ
  const chartUnitRatio = ACCESS_EXPLOIT_UNITS.find(u => u.value === chartUnit)?.ratio ?? 1;
  const chartUserTypeRatio = ACCESS_USER_TYPES.find(u => u.value === chartUserType)?.ratio ?? 1;
  const apiChartData = computedAccessChartData.map(d => ({ ...d, apiCalls: Math.round(d.apiCalls * chartUnitRatio) }));
  const accessChartData = computedAccessChartData.map(d => ({ ...d, views: Math.round(d.views * chartUserTypeRatio) }));

  const handleExportExcel = () => {
    toast.info('Xuất dữ liệu ra Excel');
  };

  const handleExportPDF = () => {
    toast.info('Xuất dữ liệu ra PDF');
  };

  // Phân trang chuẩn (compomennt.md 5.14) — nối vào state trang/kích thước trang sẵn có
  const renderPagination = (total: number, currentPage: number, setCurrentPage: (p: number) => void) => {
    if (total <= 0) return null;
    return (
      <Pagination
        className="border-t border-[#E2E8F0]"
        currentPage={currentPage}
        totalItems={total}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
      />
    );
  };

  const renderEmptyReport = (Icon: typeof BarChart3) => (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl flex flex-col items-center justify-center text-center py-20 gap-4">
      <Icon className="w-12 h-12 text-[#CBD5E1]" />
      <p className="text-[13px] text-[#64748B]">Vui lòng thiết lập bộ lọc và nhấn <span className="text-[#334155] font-medium">Tạo báo cáo</span> để xem kết quả.</p>
    </div>
  );

  const renderStatCard = (label: string, value: string | number, Icon: typeof BarChart3, tone: string) => (
    <div className={STAT_CARD}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${tone}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className={STAT_LABEL}>{label}</div>
          <div className={STAT_VALUE}>{value}</div>
        </div>
      </div>
    </div>
  );

  const TABS = [
    { id: 'search' as const, label: 'Tìm kiếm và lọc', icon: Search },
    { id: 'statistics' as const, label: 'Báo cáo thống kê', icon: BarChart3 },
    { id: 'classification' as const, label: 'Báo cáo phân loại', icon: PieChart },
    { id: 'access' as const, label: 'Thống kê lượt truy cập', icon: TrendingUp },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Tabs (compomennt.md 5.9) */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="flex px-4">
          {TABS.map(tab => (
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
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Tab 1: Tìm kiếm và lọc (UC481) */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            {/* Toolbar: tìm kiếm + bật/tắt bộ lọc + xuất dữ liệu (compomennt.md 5.19) */}
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      aria-label="Tìm kiếm"
                      placeholder="Tìm theo từ khóa, tên dataset..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
                      className={SEARCH_INPUT_CLS}
                    />
                  </div>
                  <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Bộ lọc"
                    aria-expanded={showSearchFilters}
                    onClick={() => setShowSearchFilters(!showSearchFilters)}
                    className={filterBtnClass(showSearchFilters)}
                    title="Bộ lọc"
                  >
                    {showSearchFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <ExportDropdown onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} />
                </div>
              </div>

              {/* Bộ lọc (thu gọn/mở rộng) */}
              {showSearchFilters && (
                <div className={FILTER_GRID_CLS}>
                  <div>
                    <label className={FILTER_LABEL}>Chủ đề</label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className={INPUT_CLS}
                    >
                      <option value="all">Tất cả chủ đề</option>
                      <option value="Văn bản pháp luật">Văn bản pháp luật</option>
                      <option value="Đăng ký kinh doanh">Đăng ký kinh doanh</option>
                      <option value="Công chứng">Công chứng</option>
                      <option value="Trợ giúp pháp lý">Trợ giúp pháp lý</option>
                    </select>
                  </div>

                  <div>
                    <label className={FILTER_LABEL}>Cơ quan công bố</label>
                    <select
                      value={filterAgency}
                      onChange={(e) => setFilterAgency(e.target.value)}
                      className={INPUT_CLS}
                    >
                      <option value="all">Tất cả cơ quan</option>
                      <option value="Bộ Tư pháp">Bộ Tư pháp</option>
                      <option value="Cục Đăng ký kinh doanh">Cục Đăng ký kinh doanh</option>
                      <option value="Cục Công chứng">Cục Công chứng</option>
                      <option value="Cục TGPL">Cục TGPL</option>
                    </select>
                  </div>

                  <div>
                    <label className={FILTER_LABEL}>Định dạng</label>
                    <select
                      value={filterFormat}
                      onChange={(e) => setFilterFormat(e.target.value)}
                      className={INPUT_CLS}
                    >
                      <option value="all">Tất cả định dạng</option>
                      <option value="JSON">JSON</option>
                      <option value="Excel">Excel</option>
                      <option value="CSV">CSV</option>
                      <option value="XML">XML</option>
                    </select>
                  </div>

                  <div>
                    <label className={FILTER_LABEL}>Giấy phép</label>
                    <select
                      value={filterLicense}
                      onChange={(e) => setFilterLicense(e.target.value)}
                      className={INPUT_CLS}
                    >
                      <option value="all">Tất cả giấy phép</option>
                      <option value="CC BY 4.0">CC BY 4.0</option>
                      <option value="ODC-BY">ODC-BY</option>
                      <option value="ODbL">ODbL</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[13px] text-[#64748B]">
              Tìm thấy <span className="font-medium text-blue-600 tabular-nums">{filteredDatasets.length}</span> kết quả
            </p>

            {/* Results Table — chỉ hiển thị đúng các trường theo UC481 (tên, mô tả, chủ đề, định dạng, trạng thái công bố) */}
            <div className={TABLE_WRAP}>
              <div className="overflow-x-auto">
                <table className={TABLE_CLS}>
                  <thead className="bg-[#F8FAFC]">
                    <tr className="h-[42px]">
                      <th className={`${TH} text-left cursor-pointer select-none hover:bg-[#F1F5F9]`} onClick={() => handleSort('catalogCode')}>Mã danh mục<SortIcon col="catalogCode" /></th>
                      <th className={`${TH} text-left`}>Tên danh mục</th>
                      <th className={`${TH} text-left cursor-pointer select-none hover:bg-[#F1F5F9]`} onClick={() => handleSort('name')}>Tên &amp; mô tả<SortIcon col="name" /></th>
                      <th className={`${TH} text-left cursor-pointer select-none hover:bg-[#F1F5F9]`} onClick={() => handleSort('category')}>Chủ đề<SortIcon col="category" /></th>
                      <th className={`${TH} text-left cursor-pointer select-none hover:bg-[#F1F5F9]`} onClick={() => handleSort('format')}>Định dạng<SortIcon col="format" /></th>
                      <th className={`${TH} text-left cursor-pointer select-none hover:bg-[#F1F5F9]`} onClick={() => handleSort('status')}>Trạng thái công bố<SortIcon col="status" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDatasets.slice((searchPage - 1) * pageSize, searchPage * pageSize).map((dataset) => (
                      <tr key={dataset.id} className={TR}>
                        <td className={`${TD} text-left whitespace-nowrap`}>{dataset.catalogCode}</td>
                        <td className={`${TD} text-left max-w-[280px]`}><TruncatedText text={getCatalogName(dataset.catalogCode)} /></td>
                        <td className={`${TD} text-left max-w-[360px] leading-[18px]`}>
                          <TruncatedText text={dataset.name} />
                          <TruncatedText text={dataset.description} className="text-[#64748B]" />
                        </td>
                        <td className={`${TD} text-left`}>
                          <Badge label={dataset.category} variant="blue" />
                        </td>
                        <td className={`${TD} text-left`}>
                          <Badge label={dataset.format} variant="slate" />
                        </td>
                        <td className={`${TD} text-left`}>
                          <Badge label={PUBLISH_STATUS_LABELS[dataset.status]} variant={PUBLISH_STATUS_VARIANT[dataset.status]} />
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
            {/* Summary Cards (compomennt.md 5.6.1) */}
            <div className="grid grid-cols-4 gap-4">
              {renderStatCard('Tổng Dataset', mockDatasets.length, FileText, 'bg-blue-50 text-blue-600')}
              {renderStatCard('Cơ quan công bố', new Set(mockDatasets.map(d => d.agency)).size, Building2, 'bg-blue-50 text-blue-600')}
              {renderStatCard('Chủ đề', new Set(mockDatasets.map(d => d.category)).size, Tag, 'bg-amber-50 text-amber-600')}
              {renderStatCard('Giấy phép', new Set(mockDatasets.map(d => d.license)).size, Shield, 'bg-purple-50 text-purple-600')}
            </div>

            {/* Filter Panel */}
            <div className={FILTER_PANEL}>
              <div className={`grid gap-4 ${statsGroupBy === 'time' ? 'grid-cols-4' : 'grid-cols-3'}`}>
                <div>
                  <label className={FILTER_LABEL}>Nhóm theo</label>
                  <select
                    value={statsGroupBy}
                    onChange={(e) => { setStatsGroupBy(e.target.value as any); setStatsFromDate(''); setStatsToDate(''); setSelectedCategories([]); setSelectedAgencies([]); setSelectedLicenses([]); setStatsReportReady(false); }}
                    className={INPUT_CLS}
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
                      <label className={FILTER_LABEL}>Từ ngày</label>
                      <input
                        type="date"
                        value={statsFromDate}
                        onChange={(e) => setStatsFromDate(e.target.value)}
                        className={INPUT_CLS}
                      />
                    </div>
                    <div>
                      <label className={FILTER_LABEL}>Đến ngày</label>
                      <input
                        type="date"
                        value={statsToDate}
                        min={statsFromDate}
                        onChange={(e) => setStatsToDate(e.target.value)}
                        className={INPUT_CLS}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button type="button" onClick={() => { setAppliedGroupBy(statsGroupBy); setAppliedFromDate(statsFromDate); setAppliedToDate(statsToDate); setStatsReportReady(true); setStatsPage(1); }} className={`${BTN_PRIMARY} whitespace-nowrap`}>
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
                      <button type="button" onClick={() => { setAppliedGroupBy(statsGroupBy); setAppliedCategories(selectedCategories); setAppliedAgencies(selectedAgencies); setAppliedLicenses(selectedLicenses); setStatsReportReady(true); setStatsPage(1); }} className={`${BTN_PRIMARY} whitespace-nowrap`}>
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
                <div className={CHART_CARD}>
                  <h3 className={`${CHART_TITLE} mb-3`}>
                    Thống kê số lượng Dataset theo {
                      appliedGroupBy === 'category' ? 'chủ đề' :
                      appliedGroupBy === 'agency' ? 'cơ quan' :
                      appliedGroupBy === 'license' ? 'giấy phép' :
                      'thời gian'
                    }
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={computedStatsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxisAny dataKey="name" axisLine={false} tickLine={false} tick={AXIS_TICK} />
                      <YAxisAny allowDecimals={false} axisLine={false} tickLine={false} tick={AXIS_TICK} />
                      <TooltipAny cursor={{ fill: '#F8FAFC' }} contentStyle={CHART_TOOLTIP_STYLE} />
                      <LegendAny {...LEGEND_PROPS} />
                      <BarAny dataKey="count" name="Số lượng Dataset" fill="#3b82f6" maxBarSize={56} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Data Table */}
                <div className={TABLE_WRAP}>
                  <div className="px-4 py-3 border-b border-[#E2E8F0]">
                    <h3 className={CHART_TITLE}>Chi tiết thống kê</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className={TABLE_CLS}>
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px]">
                          <th className={`${TH} text-left`}>
                            {appliedGroupBy === 'category' ? 'Chủ đề' : appliedGroupBy === 'agency' ? 'Cơ quan' : appliedGroupBy === 'license' ? 'Giấy phép' : 'Tháng'}
                          </th>
                          <th className={`${TH} text-right`}>Số lượng Dataset</th>
                        </tr>
                      </thead>
                      <tbody>
                        {computedStatsData.slice((statsPage - 1) * pageSize, statsPage * pageSize).map((item, index) => (
                          <tr key={index} className={TR}>
                            <td className={`${TD} text-left`}>{item.name}</td>
                            <td className={`${TD} text-right tabular-nums`}>{item.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(computedStatsData.length, statsPage, setStatsPage)}
                </div>
              </>
            ) : renderEmptyReport(BarChart3)}
          </div>
        )}

        {/* Tab 3: Báo cáo phân loại */}
        {activeTab === 'classification' && (
          <div className="space-y-6">
            {/* Summary Cards (compomennt.md 5.6.1) */}
            <div className="grid grid-cols-4 gap-4">
              {renderStatCard('Tổng Dataset', mockDatasets.length, FileText, 'bg-blue-50 text-blue-600')}
              {renderStatCard('Nguồn cung cấp', new Set(mockDatasets.map(d => d.source)).size, FileType, 'bg-blue-50 text-blue-600')}
              {renderStatCard('Chủ đề', new Set(mockDatasets.map(d => d.category)).size, Tag, 'bg-amber-50 text-amber-600')}
              {renderStatCard('Định dạng', new Set(mockDatasets.map(d => d.format)).size, Layers, 'bg-emerald-50 text-emerald-600')}
            </div>

            {/* Filter Panel */}
            <div className={FILTER_PANEL}>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={FILTER_LABEL}>Phân loại theo</label>
                  <select
                    value={classifyBy}
                    onChange={(e) => { setClassifyBy(e.target.value as any); setSelectedClassFilters([]); setClassReportReady(false); }}
                    className={INPUT_CLS}
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
                    type="button"
                    onClick={() => { setAppliedClassifyBy(classifyBy); setAppliedClassFilters(selectedClassFilters); setClassReportReady(true); setClassPage(1); }}
                    className={`${BTN_PRIMARY} whitespace-nowrap`}
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
                <div className="grid grid-cols-5 gap-4">
                  <div className={`col-span-2 ${CHART_CARD}`}>
                    <h3 className={`${CHART_TITLE} mb-3`}>
                      Biểu đồ phân bố theo {appliedClassifyBy === 'source' ? 'nguồn cung cấp' : appliedClassifyBy === 'category' ? 'chủ đề' : 'định dạng chia sẻ'}
                    </h3>
                    <div className="text-[12px]">
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
                          <TooltipAny contentStyle={CHART_TOOLTIP_STYLE} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className={`col-span-3 ${CHART_CARD}`}>
                    <h3 className={`${CHART_TITLE} mb-3`}>Thống kê số lượng Dataset</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={computedClassPieData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxisAny dataKey="name" axisLine={false} tickLine={false} tick={AXIS_TICK} />
                        <YAxisAny allowDecimals={false} axisLine={false} tickLine={false} tick={AXIS_TICK} />
                        <TooltipAny cursor={{ fill: '#F8FAFC' }} contentStyle={CHART_TOOLTIP_STYLE} />
                        <BarAny dataKey="value" name="Số lượng" fill="#0ea5e9" maxBarSize={56} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detail Table */}
                <div className={TABLE_WRAP}>
                  <div className="px-4 py-3 border-b border-[#E2E8F0]">
                    <h3 className={CHART_TITLE}>Bảng phân tích chi tiết</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className={TABLE_CLS}>
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px]">
                          <th className={`${TH} text-left`}>
                            {appliedClassifyBy === 'source' ? 'Nguồn cung cấp' : appliedClassifyBy === 'category' ? 'Chủ đề' : 'Định dạng chia sẻ'}
                          </th>
                          <th className={`${TH} text-right`}>Số lượng</th>
                          <th className={`${TH} text-right`}>Tỷ lệ (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {computedClassData.slice((classPage - 1) * pageSize, classPage * pageSize).map((item, index) => (
                          <tr key={index} className={TR}>
                            <td className={`${TD} text-left`}>{item.name}</td>
                            <td className={`${TD} text-right tabular-nums`}>{item.count}</td>
                            <td className={`${TD} text-right tabular-nums`}>
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
            ) : renderEmptyReport(PieChart)}
          </div>
        )}

        {/* Tab 4: Thống kê lượt truy cập */}
        {activeTab === 'access' && (
          <div className="space-y-6">
            {/* Summary Cards (compomennt.md 5.6.1) */}
            <div className="grid grid-cols-4 gap-4">
              {renderStatCard('Tổng lượt xem', mockDatasets.reduce((s, d) => s + d.views, 0).toLocaleString(), Eye, 'bg-blue-50 text-blue-600')}
              {renderStatCard('Tổng lượt tải', mockDatasets.reduce((s, d) => s + d.downloads, 0).toLocaleString(), Download, 'bg-blue-50 text-blue-600')}
              {renderStatCard('Lượt tải theo File Excel', mockAccessByFormat.find(f => f.name === 'File Excel')?.downloads.toLocaleString() ?? 0, FileText, 'bg-emerald-50 text-emerald-600')}
              {renderStatCard('Lượt tải theo API', mockAccessByFormat.find(f => f.name === 'API')?.downloads.toLocaleString() ?? 0, TrendingUp, 'bg-purple-50 text-purple-600')}
            </div>

            {/* Filter Panel — lọc theo thời gian + nguồn truy cập (CSDL) + loại dữ liệu chia sẻ (API/Excel) */}
            <div className={FILTER_PANEL}>
              <div className="flex flex-wrap items-end gap-3">
                <div className="w-[150px]">
                  <label className={FILTER_LABEL}>Từ tháng</label>
                  <input
                    type="month"
                    value={accessFromMonth}
                    min={accessToMonth ? addMonths(accessToMonth, -11) : undefined}
                    max={accessToMonth || undefined}
                    onChange={(e) => { setAccessFromMonth(e.target.value); setAccessReportReady(false); }}
                    className={INPUT_CLS}
                  />
                </div>
                <div className="w-[150px]">
                  <label className={FILTER_LABEL}>Đến tháng</label>
                  <input
                    type="month"
                    value={accessToMonth}
                    min={accessFromMonth || undefined}
                    max={accessFromMonth ? addMonths(accessFromMonth, 11) : undefined}
                    onChange={(e) => { setAccessToMonth(e.target.value); setAccessReportReady(false); }}
                    className={INPUT_CLS}
                  />
                </div>
                <div className="w-[180px]">
                  <MultiSelect
                    label="Nguồn truy cập"
                    options={accessSourceOptions}
                    selected={accessSources}
                    onChange={(v) => { setAccessSources(v); setAccessReportReady(false); }}
                  />
                </div>
                <div className="w-[180px]">
                  <MultiSelect
                    label="Loại dữ liệu chia sẻ"
                    options={formatOptions}
                    selected={accessFormats}
                    onChange={(v) => { setAccessFormats(v); setAccessReportReady(false); }}
                  />
                </div>
                <div className="flex items-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (accessFromMonth && accessToMonth) {
                        if (accessToMonth < accessFromMonth) { toast.error('“Đến tháng” phải sau “Từ tháng”.'); return; }
                        if (accessToMonth > addMonths(accessFromMonth, 11)) { toast.error('Khoảng thời gian tối đa là 1 năm (12 tháng).'); return; }
                      }
                      setAppliedAccessFromMonth(accessFromMonth); setAppliedAccessToMonth(accessToMonth); setAppliedAccessSources(accessSources); setAppliedAccessFormats(accessFormats); setAccessReportReady(true); setAccessPage(1);
                    }}
                    className={`${BTN_PRIMARY} whitespace-nowrap`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Tạo báo cáo
                  </button>
                  <ExportDropdown onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} />
                </div>
              </div>
            </div>

            {accessReportReady ? (
              <>
                {/* Trend Charts — 2 kênh: lượt gọi API (hệ thống khai thác) và lượt truy cập (người dùng xem giao diện); trục ngang = tháng, giá trị theo điều kiện lọc */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Biểu đồ 1: Lượt tải dữ liệu — lọc theo Đơn vị khai thác */}
                  <div className={CHART_CARD}>
                    <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                      <h3 className={CHART_TITLE}>Lượt tải dữ liệu</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[13px] text-[#64748B] whitespace-nowrap">Đơn vị khai thác:</span>
                        <select
                          title="Đơn vị khai thác"
                          value={chartUnit}
                          onChange={(e) => setChartUnit(e.target.value)}
                          className={`${CHART_SELECT} max-w-[220px]`}
                        >
                          {ACCESS_EXPLOIT_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                        </select>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={360}>
                      <LineChart data={apiChartData} margin={{ top: 5, right: 20, left: 0, bottom: 28 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxisAny dataKey="name" interval={0} angle={-35} textAnchor="end" height={64} axisLine={false} tickLine={false} tick={AXIS_TICK} />
                        <YAxisAny axisLine={false} tickLine={false} tick={AXIS_TICK} />
                        <TooltipAny contentStyle={CHART_TOOLTIP_STYLE} />
                        <LegendAny {...LEGEND_PROPS} />
                        <LineAny type="monotone" dataKey="apiCalls" stroke="#2563eb" strokeWidth={2} name="Lượt tải dữ liệu" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Biểu đồ 2: Lượt truy cập — lọc theo Loại người dùng */}
                  <div className={CHART_CARD}>
                    <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                      <h3 className={CHART_TITLE}>Lượt truy cập</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[13px] text-[#64748B] whitespace-nowrap">Loại người dùng:</span>
                        <select
                          title="Loại người dùng"
                          value={chartUserType}
                          onChange={(e) => setChartUserType(e.target.value)}
                          className={`${CHART_SELECT} max-w-[200px]`}
                        >
                          {ACCESS_USER_TYPES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                        </select>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={360}>
                      <LineChart data={accessChartData} margin={{ top: 5, right: 20, left: 0, bottom: 28 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxisAny dataKey="name" interval={0} angle={-35} textAnchor="end" height={64} axisLine={false} tickLine={false} tick={AXIS_TICK} />
                        <YAxisAny axisLine={false} tickLine={false} tick={AXIS_TICK} />
                        <TooltipAny contentStyle={CHART_TOOLTIP_STYLE} />
                        <LegendAny {...LEGEND_PROPS} />
                        <LineAny type="monotone" dataKey="views" stroke="#10B981" strokeWidth={2} name="Lượt truy cập" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Alert Table */}
                <div className={TABLE_WRAP}>
                  <div className="px-4 py-3 border-b border-[#E2E8F0]">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <h3 className={`${CHART_TITLE} flex items-center gap-2`}>
                        <Bell className="w-4 h-4 text-[#D97706]" />
                        Cảnh báo truy cập vượt ngưỡng
                      </h3>
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-[#94A3B8]" />
                        <span className="text-[13px] text-[#64748B]">Ngưỡng cảnh báo:</span>
                        <input
                          type="number"
                          min={1}
                          aria-label="Ngưỡng cảnh báo"
                          value={alertThresholdInput}
                          onChange={(e) => setAlertThresholdInput(e.target.value)}
                          className="w-24 h-10 px-3 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] text-right tabular-nums bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <span className="text-[13px] text-[#64748B]">lượt</span>
                        <button
                          type="button"
                          onClick={() => { const v = parseInt(alertThresholdInput); if (!isNaN(v) && v > 0) setAlertThreshold(v); }}
                          className={BTN_PRIMARY}
                        >
                          Lưu cài đặt
                        </button>
                      </div>
                    </div>
                    <p className="text-[13px] text-[#64748B] mt-1">
                      Đang cảnh báo khi lượt truy cập chia sẻ vượt <span className="font-medium text-[#D97706] tabular-nums">{alertThreshold.toLocaleString()} lượt</span>
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className={TABLE_CLS}>
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px]">
                          <th className={`${TH} text-center w-12`}>STT</th>
                          <th className={`${TH} text-left`}>Tên tệp dữ liệu</th>
                          <th className={`${TH} text-left`}>Thời gian</th>
                          <th className={`${TH} text-left`}>Nguồn truy cập</th>
                          <th className={`${TH} text-left`}>Định dạng chia sẻ</th>
                          <th className={`${TH} text-right`}>Lượt truy cập chia sẻ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAlertLogs.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-3 py-16 text-center text-[13px] text-[#64748B]">
                              Không có dữ liệu cảnh báo phù hợp với điều kiện lọc
                            </td>
                          </tr>
                        ) : filteredAlertLogs.slice((accessPage - 1) * pageSize, accessPage * pageSize).map((row, index) => {
                          const exceeded = row.accessCount >= alertThreshold;
                          const [datePart, timePart] = row.time.split(' ');
                          return (
                            <tr key={index} className={exceeded ? 'h-12 bg-[#FFF7ED] border-b border-[#E0E0E0] transition-colors' : TR}>
                              <td className={`${TD} text-center tabular-nums`}>{(accessPage - 1) * pageSize + index + 1}</td>
                              <td className={`${TD} text-left max-w-[320px]`}><TruncatedText text={row.file} /></td>
                              <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                                <div>{datePart}</div>
                                {timePart && <div className="text-[#64748B]">{timePart}</div>}
                              </td>
                              <td className={`${TD} text-left whitespace-nowrap`}>{row.source}</td>
                              <td className={`${TD} text-left`}>
                                <Badge label={row.format} variant={row.format === 'API' ? 'emerald' : 'slate'} />
                              </td>
                              <td className={`${TD} text-right`}>
                                <div className="flex items-center justify-end gap-2">
                                  <span className={`tabular-nums ${exceeded ? 'text-[#C2410C]' : ''}`}>
                                    {row.accessCount.toLocaleString()}
                                  </span>
                                  {exceeded && (
                                    <Badge label="Vượt ngưỡng" variant="orange" icon={<Bell className="w-3 h-3" />} />
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(filteredAlertLogs.length, accessPage, setAccessPage)}
                </div>
              </>
            ) : renderEmptyReport(TrendingUp)}
          </div>
        )}
      </div>
    </div>
  );
}
