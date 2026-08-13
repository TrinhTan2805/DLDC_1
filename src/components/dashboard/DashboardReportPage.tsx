import { useState } from 'react';
import { ArrowRight, Database, Hash, CheckCircle2, AlertTriangle, XCircle, FileEdit, FileText, Calendar, ChevronLeft, ChevronRight, ArrowUpDown, ChevronUp, ChevronDown, Settings2, Wand2, Shuffle, Layers, TrendingUp, TrendingDown, Zap, Send, Clock, Eye } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, RadialBarChart, RadialBar, PolarAngleAxis, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  KPI_SLUG_TO_LABEL,
  detailedData,
  formatDataSize,
  SOURCE_TREND_LIST,
  SOURCE_TREND_MONTHS,
  sourceTrendSeries,
  SourceTrendMetric,
} from './kpiReportData';

const SOURCE_LINE_COLORS = [
  '#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899',
  '#84cc16', '#6366f1', '#14b8a6', '#f97316', '#a855f7', '#0ea5e9', '#eab308', '#64748b',
];

const formatRawMetricValue = (metric: SourceTrendMetric, raw: number) => {
  if (metric === 'dataSize') return formatDataSize(raw * 1024 * 1024);
  return raw.toLocaleString('vi-VN');
};

const METRIC_BAR_CONFIG: { key: SourceTrendMetric; label: string; color: string }[] = [
  { key: 'services', label: 'Dịch vụ', color: '#15803d' },
  { key: 'records', label: 'Bản ghi', color: '#1d4ed8' },
  { key: 'dataSize', label: 'Dung lượng', color: '#b45309' },
];

const DATA_STATUS_CONFIG: { key: 'success' | 'draft' | 'error' | 'warning'; label: string; color: string }[] = [
  { key: 'success', label: 'Cập nhật thành công', color: '#22c55e' },
  { key: 'draft', label: 'Rỗng', color: '#94a3b8' },
  { key: 'error', label: 'Lỗi cập nhật', color: '#ef4444' },
  { key: 'warning', label: 'Đang xử lý', color: '#3b82f6' },
];

// Mock: số quy tắc làm sạch/biến đổi/chuẩn hóa theo từng hệ thống nguồn (tổng khớp với 3 thẻ ở trên: 218/170/120)
const PROCESSING_RULES_BY_SOURCE: { [source: string]: { cleaning: number; transform: number; normalize: number } } = {
  'TAND Tối cao': { cleaning: 20, transform: 16, normalize: 11 },
  'Bộ Nội vụ': { cleaning: 14, transform: 11, normalize: 8 },
  'Ủy ban Dân tộc': { cleaning: 10, transform: 8, normalize: 6 },
  'Bộ Ngoại giao': { cleaning: 8, transform: 6, normalize: 4 },
  'Bộ LĐTBXH': { cleaning: 30, transform: 23, normalize: 16 },
  'Bộ Y tế': { cleaning: 16, transform: 12, normalize: 9 },
  'Cục Hành chính tư pháp': { cleaning: 24, transform: 19, normalize: 13 },
  'Cục Quản lý thi hành án dân sự': { cleaning: 18, transform: 14, normalize: 10 },
  'Cục Đăng ký giao dịch bảo đảm và BTNN': { cleaning: 13, transform: 10, normalize: 7 },
  'Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính': { cleaning: 22, transform: 17, normalize: 12 },
  'Cục Bổ trợ tư pháp': { cleaning: 19, transform: 15, normalize: 11 },
  'Vụ Hợp tác quốc tế': { cleaning: 9, transform: 7, normalize: 5 },
  'Cục Kế hoạch - Tài chính': { cleaning: 15, transform: 12, normalize: 8 },
  'TTDLQG': { cleaning: 7, transform: 5, normalize: 4 },
  'Tòa án': { cleaning: 9, transform: 7, normalize: 5 },
};

const PROCESSING_RULE_CONFIG = [
  { key: 'cleaning', label: 'Làm sạch', color: '#6366f1' },
  { key: 'transform', label: 'Biến đổi', color: '#a855f7' },
  { key: 'normalize', label: 'Chuẩn hóa', color: '#ec4899' },
] as const;

// Mock: số lượng bản ghi đã xử lý tháng này so với tháng trước, dùng cho thẻ "So sánh xử lý theo tháng"
const currentMonthProcessedRecords = 8213821;
const lastMonthProcessedRecords = 7180450;
const monthOverMonthChangePercent = Number((((currentMonthProcessedRecords - lastMonthProcessedRecords) / lastMonthProcessedRecords) * 100).toFixed(1));

// Mock: dung lượng đã xử lý (GB) theo từng hệ thống nguồn, tổng khớp với thẻ "Dữ liệu đã xử lý" (~7,871 GB)
const PROCESSED_VOLUME_BY_SOURCE: { [source: string]: number } = {
  'TAND Tối cao': 742,
  'Bộ Nội vụ': 494,
  'Ủy ban Dân tộc': 371,
  'Bộ Ngoại giao': 288,
  'Bộ LĐTBXH': 1071,
  'Bộ Y tế': 577,
  'Cục Hành chính tư pháp': 865,
  'Cục Quản lý thi hành án dân sự': 659,
  'Cục Đăng ký giao dịch bảo đảm và BTNN': 453,
  'Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính': 783,
  'Cục Bổ trợ tư pháp': 701,
  'Vụ Hợp tác quốc tế': 330,
  'Cục Kế hoạch - Tài chính': 536,
  'TTDLQG': 310,
  'Tòa án': 398,
};

const RANK_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#22c55e', '#3b82f6', '#06b6d4'];

// Phân loại hệ thống nguồn trong/ngoài ngành Tư pháp cho bộ lọc "Quy tắc xử lý theo từng hệ thống"
// Ngoài ngành: TTDLQG, Tòa án (2 hệ thống) - còn lại 13 hệ thống là Trong ngành
const PROCESSING_RULES_EXTERNAL_SOURCES = ['TTDLQG', 'Tòa án'];
const PROCESSING_RULES_INTERNAL_SOURCES = SOURCE_TREND_LIST.filter(
  source => !PROCESSING_RULES_EXTERNAL_SOURCES.includes(source)
);

// Khoảng thời gian mốc để tính tỷ lệ số quy tắc phát sinh trong khoảng ngày đã chọn (mock, đơn giản hoá)
const PROCESSING_RULES_BASELINE_START = new Date('2025-01-01').getTime();
const PROCESSING_RULES_BASELINE_END = new Date('2025-12-31').getTime();

const getProcessingRulesDateScale = (from: string, to: string) => {
  if (!from && !to) return 1;
  const start = from ? new Date(from).getTime() : PROCESSING_RULES_BASELINE_START;
  const end = to ? new Date(to).getTime() : PROCESSING_RULES_BASELINE_END;
  const totalDays = (PROCESSING_RULES_BASELINE_END - PROCESSING_RULES_BASELINE_START) / 86400000;
  const clampedStart = Math.max(start, PROCESSING_RULES_BASELINE_START);
  const clampedEnd = Math.min(end, PROCESSING_RULES_BASELINE_END);
  const selectedDays = Math.max(0, (clampedEnd - clampedStart) / 86400000);
  return totalDays > 0 ? Math.max(0.1, Math.min(1, selectedDays / totalDays)) : 1;
};

// Mock: xu hướng xử lý 6 tháng gần nhất, chốt tại tổng hiện tại (GB và số bản ghi)
// Dùng 2 chuỗi tỷ lệ khác nhau cho khối lượng (GB) và số bản ghi để 2 đường không trùng khít lên nhau
const PROCESSING_TREND_MONTHS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const PROCESSING_TREND_VOLUME_RATIOS = [0.5, 0.62, 0.7, 0.82, 0.91, 1];
const PROCESSING_TREND_RECORDS_RATIOS = [0.6, 0.68, 0.79, 0.85, 0.94, 1];

// Mock: 15 hệ thống CSDL quốc gia/bộ ngành đang kết nối chia sẻ dữ liệu
const SHARING_SYSTEMS_API_CONFIG = [
  { code: 'DANCU', apiCount: 42, volumeGB: 1270 },
  { code: 'THUE', apiCount: 37, volumeGB: 1550 },
  { code: 'YTE', apiCount: 31, volumeGB: 1090 },
  { code: 'DKKD', apiCount: 30, volumeGB: 730 },
  { code: 'BHXH', apiCount: 28, volumeGB: 950 },
  { code: 'DATDAI', apiCount: 23, volumeGB: 630 },
  { code: 'GDDT', apiCount: 21, volumeGB: 460 },
  { code: 'TTTT', apiCount: 19, volumeGB: 380 },
  { code: 'GTVT', apiCount: 18, volumeGB: 340 },
  { code: 'TUPHAP', apiCount: 16, volumeGB: 300 },
  { code: 'CONGTHUONG', apiCount: 15, volumeGB: 260 },
  { code: 'LDTBXH', apiCount: 14, volumeGB: 220 },
  { code: 'MOITRUONG', apiCount: 14, volumeGB: 410 },
  { code: 'XAYDUNG', apiCount: 12, volumeGB: 180 },
  { code: 'NNPTNT', apiCount: 10, volumeGB: 140 },
];

// Mock: Top 5 loại dữ liệu được chia sẻ nhiều nhất (số lượt chia sẻ)
const TOP_SHARED_DATA_TYPES = [
  { name: 'Lý lịch tư pháp', shares: 52400 },
  { name: 'Hộ tịch (khai sinh, kết hôn, khai tử)', shares: 45200 },
  { name: 'Công chứng, chứng thực', shares: 38100 },
  { name: 'Đăng ký giao dịch bảo đảm', shares: 27600 },
  { name: 'Thi hành án dân sự', shares: 19800 },
];

const TOP_DATA_TYPE_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#22c55e'];

type VolumeTrendGranularity = 'month30' | 'quarter' | 'halfYear' | 'year';

const VOLUME_TREND_GRANULARITY_OPTIONS: { key: VolumeTrendGranularity; label: string }[] = [
  { key: 'month30', label: 'Tháng (30 ngày)' },
  { key: 'quarter', label: 'Quý hiện tại' },
  { key: 'halfYear', label: '6 tháng (năm hiện tại)' },
  { key: 'year', label: 'Năm' },
];

// Mock: Top 5 API có lượt truy cập cao nhất - số liệu nền tính theo 30 ngày gần nhất
const TOP_API_CALLS = [
  { name: 'API DANCU - Tra cứu dân cư', calls: 42500 },
  { name: 'API THUE - Tra cứu mã số thuế', calls: 36800 },
  { name: 'API YTE - Tra cứu BHYT', calls: 28100 },
  { name: 'API DKKD - Tra cứu đăng ký kinh doanh', calls: 22300 },
  { name: 'API BHXH - Tra cứu bảo hiểm xã hội', calls: 18900 },
];

const TOP_API_CALL_COLORS = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

// Mock: 5 yêu cầu chia sẻ dữ liệu mới nhất đang chờ xử lý
const PENDING_SHARE_REQUESTS = [
  { id: 'YC-2607', requester: 'Bộ Công an', dataType: 'Lý lịch tư pháp', requestedAt: '28/07/2026 09:15' },
  { id: 'YC-2606', requester: 'UBND tỉnh Hà Nam', dataType: 'Hộ tịch', requestedAt: '27/07/2026 14:40' },
  { id: 'YC-2605', requester: 'Ngân hàng Nhà nước', dataType: 'Đăng ký giao dịch bảo đảm', requestedAt: '27/07/2026 11:05' },
  { id: 'YC-2604', requester: 'Bộ Y tế', dataType: 'Công chứng, chứng thực', requestedAt: '26/07/2026 16:20' },
  { id: 'YC-2603', requester: 'Sở Tư pháp TP.HCM', dataType: 'Thi hành án dân sự', requestedAt: '26/07/2026 08:50' },
];

// Mock: Top 5 API có thời gian phản hồi vượt ngưỡng cảnh báo (ngưỡng 350ms)
const RESPONSE_TIME_THRESHOLD_MS = 350;
const TOP_SLOW_APIS = [
  { name: 'API DATDAI - Tra cứu đất đai', responseTimeMs: 512 },
  { name: 'API GDDT - Tra cứu văn bằng', responseTimeMs: 478 },
  { name: 'API BHXH - Tra cứu bảo hiểm xã hội', responseTimeMs: 445 },
  { name: 'API YTE - Tra cứu BHYT', responseTimeMs: 410 },
  { name: 'API TUPHAP - Tra cứu lý lịch tư pháp', responseTimeMs: 387 },
];

// Mock: API có tỷ lệ lỗi cao nhất trong 7 ngày qua
const TOP_ERROR_RATE_APIS = [
  { endpoint: '/v1/xaydung/giay-phep/tra-cuu', system: 'XAYDUNG', calls: 48210, errors: 5120, commonError: '504 Timeout', avgTimeMs: 1820, errorRate: 10.6 },
  { endpoint: '/v1/datdai/thua-dat/chi-tiet', system: 'DATDAI', calls: 132400, errors: 11240, commonError: '500 Internal', avgTimeMs: 1465, errorRate: 8.5 },
  { endpoint: '/v1/moitruong/quan-trac/realtime', system: 'MOITRUONG', calls: 86300, errors: 6210, commonError: '429 Rate limit', avgTimeMs: 980, errorRate: 7.2 },
  { endpoint: '/v1/tuphap/ho-tich/khai-sinh', system: 'TUPHAP', calls: 57800, errors: 3410, commonError: '400 Bad request', avgTimeMs: 742, errorRate: 5.9 },
  { endpoint: '/v1/thue/hoa-don/dong-bo', system: 'THUE', calls: 421500, errors: 21900, commonError: '503 Unavailable', avgTimeMs: 1210, errorRate: 5.2 },
  { endpoint: '/v1/nnptnt/vung-trong/danh-sach', system: 'NNPTNT', calls: 22400, errors: 1050, commonError: '502 Bad gateway', avgTimeMs: 890, errorRate: 4.7 },
  { endpoint: '/v1/bhxh/qua-trinh-dong/tra-cuu', system: 'BHXH', calls: 268900, errors: 9860, commonError: '401 Unauthorized', avgTimeMs: 655, errorRate: 3.7 },
  { endpoint: '/v1/yte/ho-so-suc-khoe/lich-su', system: 'YTE', calls: 158700, errors: 4920, commonError: '504 Timeout', avgTimeMs: 1320, errorRate: 3.1 },
  { endpoint: '/v1/congthuong/giay-phep/tra-cuu', system: 'CONGTHUONG', calls: 34600, errors: 830, commonError: '400 Bad request', avgTimeMs: 610, errorRate: 2.4 },
  { endpoint: '/v1/gtvt/dang-kiem/tra-cuu', system: 'GTVT', calls: 76200, errors: 1370, commonError: '429 Rate limit', avgTimeMs: 540, errorRate: 1.8 },
];

interface DashboardReportPageProps {
  kpiSlug: string;
}

export function DashboardReportPage({ kpiSlug }: DashboardReportPageProps) {
  const selectedKPI = KPI_SLUG_TO_LABEL[kpiSlug] || 'Thu thập';
  const currentData = detailedData[selectedKPI] || [];
  const totalSynced = currentData.reduce((sum, record) => sum + record.syncedCount, 0);

  const [selectedSources, setSelectedSources] = useState<string[]>(SOURCE_TREND_LIST);
  const [barMetric, setBarMetric] = useState<SourceTrendMetric>('records');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [errorPage, setErrorPage] = useState(0);
  const [volumeTrendGranularity, setVolumeTrendGranularity] = useState<VolumeTrendGranularity>('month30');
  const [volumeTrendYear, setVolumeTrendYear] = useState(new Date().getFullYear());
  const [volumeRankPage, setVolumeRankPage] = useState(0);
  const [activeShareCard, setActiveShareCard] = useState<'apiConfig' | 'apiCalls' | 'volume' | 'requests' | 'responseTime' | 'errorRate'>('apiConfig');
  const [apiCallsGranularity, setApiCallsGranularity] = useState<VolumeTrendGranularity>('month30');
  const [apiCallsYear, setApiCallsYear] = useState(new Date().getFullYear());
  const [sortColumn, setSortColumn] = useState<'dataSize' | 'lastSync' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [processingRulesScope, setProcessingRulesScope] = useState<'Trong ngành' | 'Ngoài ngành'>('Trong ngành');
  const [processingRulesDateFrom, setProcessingRulesDateFrom] = useState('');
  const [processingRulesDateTo, setProcessingRulesDateTo] = useState('');

  const toggleSort = (column: 'dataSize' | 'lastSync') => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const renderSortIcon = (column: 'dataSize' | 'lastSync') => {
    if (sortColumn !== column) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />;
    return sortDirection === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-slate-700" />
      : <ChevronDown className="w-3.5 h-3.5 text-slate-700" />;
  };

  const parseVNDateTime = (str: string) => {
    const [datePart, timePart] = str.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hh, mm, ss] = (timePart || '0:0:0').split(':').map(Number);
    return new Date(year, (month || 1) - 1, day || 1, hh || 0, mm || 0, ss || 0).getTime();
  };

  const toggleSource = (source: string) => {
    setSelectedSources(prev =>
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  const visibleSources = SOURCE_TREND_LIST.filter(source => selectedSources.includes(source));

  const latestMonthIndex = SOURCE_TREND_MONTHS.length - 1;

  // Dữ liệu mẫu chỉ có mốc theo tháng, giả định các tháng Th1-Th12 thuộc năm 2025 (khớp với dữ liệu mockCollectionServices)
  const parseMonthIndex = (dateStr: string) => {
    if (!dateStr) return null;
    const parsed = new Date(dateStr);
    if (Number.isNaN(parsed.getTime())) return null;
    return Math.min(latestMonthIndex, Math.max(0, parsed.getMonth()));
  };

  const fromMonthIndex = parseMonthIndex(dateFrom);
  const toMonthIndex = parseMonthIndex(dateTo);
  const isDateRangeActive = fromMonthIndex !== null || toMonthIndex !== null;

  // Đếm số lượng phát sinh trong khoảng ngày đã chọn: hiệu số giữa mốc cuối kỳ và mốc trước kỳ bắt đầu
  // (vì chuỗi số nguồn là số luỹ kế theo tháng); nếu không chọn ngày thì lấy tổng hiện tại (mốc tháng cuối).
  const rawValueBySource = (metric: SourceTrendMetric, source: string) => {
    const series = sourceTrendSeries[metric][source];
    const endIdx = toMonthIndex ?? latestMonthIndex;
    const startIdx = fromMonthIndex ?? 0;
    if (endIdx < startIdx) return 0;
    const baseline = startIdx > 0 ? series[startIdx - 1] : 0;
    return Math.max(0, series[endIdx] - baseline);
  };

  // Biểu đồ thanh ngang gộp: 1 chỉ số tại một thời điểm (lọc bằng barMetric), mỗi hệ thống nguồn 1 thanh
  const metricBarData = visibleSources.map(source => ({
    name: source,
    services: rawValueBySource('services', source),
    records: rawValueBySource('records', source),
    dataSize: rawValueBySource('dataSize', source),
  }));

  const activeBarConfig = METRIC_BAR_CONFIG.find(m => m.key === barMetric)!;


  const sortedData = [...currentData].sort((a, b) => {
    if (!sortColumn) return 0;
    const diff =
      sortColumn === 'dataSize'
        ? a.syncedCount - b.syncedCount
        : parseVNDateTime(a.lastSync) - parseVNDateTime(b.lastSync);
    return sortDirection === 'asc' ? diff : -diff;
  });

  const processingRulesDateScale = getProcessingRulesDateScale(processingRulesDateFrom, processingRulesDateTo);
  const processingRulesChartData = SOURCE_TREND_LIST
    .filter(source => {
      const isInternal = PROCESSING_RULES_INTERNAL_SOURCES.includes(source);
      return processingRulesScope === 'Trong ngành' ? isInternal : !isInternal;
    })
    .map(source => {
      const rules = PROCESSING_RULES_BY_SOURCE[source];
      return {
        name: source,
        cleaning: Math.round(rules.cleaning * processingRulesDateScale),
        transform: Math.round(rules.transform * processingRulesDateScale),
        normalize: Math.round(rules.normalize * processingRulesDateScale),
      };
    });

  const rankedVolumeData = SOURCE_TREND_LIST
    .map(source => ({ source, volumeGB: PROCESSED_VOLUME_BY_SOURCE[source] }))
    .sort((a, b) => b.volumeGB - a.volumeGB);
  const maxVolumeGB = Math.max(...rankedVolumeData.map(r => r.volumeGB));
  const VOLUME_RANK_PAGE_SIZE = 5;
  const volumeRankTotalPages = Math.ceil(rankedVolumeData.length / VOLUME_RANK_PAGE_SIZE);
  const volumeRankPageItems = rankedVolumeData.slice(
    volumeRankPage * VOLUME_RANK_PAGE_SIZE,
    volumeRankPage * VOLUME_RANK_PAGE_SIZE + VOLUME_RANK_PAGE_SIZE
  );

  const processedRecordsFinalM = totalSynced > 0 ? totalSynced / 1_000_000 : 4.06;
  const processedVolumeFinalGB = rankedVolumeData.reduce((sum, r) => sum + r.volumeGB, 0);
  const processingTrendData = PROCESSING_TREND_MONTHS.map((month, i) => ({
    month,
    volumeGB: Math.round(processedVolumeFinalGB * PROCESSING_TREND_VOLUME_RATIOS[i]),
    recordsM: Number((processedRecordsFinalM * PROCESSING_TREND_RECORDS_RATIOS[i]).toFixed(2)),
  }));

  const apiConfigBySourceData = [...SHARING_SYSTEMS_API_CONFIG].sort((a, b) => b.apiCount - a.apiCount);

  // Xu hướng chia sẻ dữ liệu theo dung lượng (MB) - chốt tại tổng dung lượng chia sẻ hiện tại, tuỳ theo bộ lọc thời gian
  const shareVolumeFinalMB = (totalSynced * 1150) / (1024 * 1024);
  const volumeTrendData = (() => {
    const pad2 = (n: number) => String(n).padStart(2, '0');
    if (volumeTrendGranularity === 'month30') {
      return Array.from({ length: 30 }, (_, i) => {
        const ratio = 0.5 + 0.5 * (i / 29);
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return { label: `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`, volumeMB: Math.round(shareVolumeFinalMB * ratio * 100) / 100 };
      });
    }
    if (volumeTrendGranularity === 'quarter') {
      const now = new Date();
      const startMonth = Math.floor(now.getMonth() / 3) * 3;
      return [0, 1, 2].map(i => {
        const ratio = 0.6 + 0.4 * (i / 2);
        return { label: `Th${startMonth + i + 1}`, volumeMB: Math.round(shareVolumeFinalMB * ratio * 100) / 100 };
      });
    }
    if (volumeTrendGranularity === 'halfYear') {
      const currentMonth = new Date().getMonth();
      const startMonth = Math.max(0, currentMonth - 5);
      const months = Array.from({ length: currentMonth - startMonth + 1 }, (_, i) => startMonth + i);
      return months.map((m, i) => ({
        label: `Th${m + 1}`,
        volumeMB: Math.round(shareVolumeFinalMB * (0.5 + 0.5 * (i / Math.max(1, months.length - 1))) * 100) / 100,
      }));
    }
    // year
    return Array.from({ length: 12 }, (_, i) => ({
      label: `Th${i + 1}`,
      volumeMB: Math.round(shareVolumeFinalMB * (0.25 + 0.75 * (i / 11)) * 100) / 100,
    }));
  })();

  const availableTrendYears = Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - i);
  const maxTopDataTypeShares = Math.max(...TOP_SHARED_DATA_TYPES.map(t => t.shares));

  // Xu hướng truy cập API - chốt tại tổng lượt gọi API hiện tại (coi là mốc 30 ngày gần nhất),
  // nhân theo hệ số kỳ hạn cho Quý/6 tháng/Năm (~3x/~6x/~12x so với 30 ngày)
  const API_CALLS_PERIOD_MULTIPLIER: { [key in VolumeTrendGranularity]: number } = {
    month30: 1,
    quarter: 3,
    halfYear: 6,
    year: 12,
  };
  const apiCallsFinalTotal = totalSynced * API_CALLS_PERIOD_MULTIPLIER[apiCallsGranularity];
  // Hệ số dao động lên xuống quanh xu hướng chung, tạo bằng hàm sin/cos cố định (không đổi giữa các lần render)
  const wave = (i: number) => 0.7 + 0.22 * Math.sin(i * 1.1) + 0.08 * Math.cos(i * 2.3);
  const apiCallsTrendData = (() => {
    const pad2 = (n: number) => String(n).padStart(2, '0');
    if (apiCallsGranularity === 'month30') {
      return Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return { label: `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`, calls: Math.round((apiCallsFinalTotal * wave(i)) / 30) };
      });
    }
    if (apiCallsGranularity === 'quarter') {
      const now = new Date();
      const startMonth = Math.floor(now.getMonth() / 3) * 3;
      return [0, 1, 2].map(i => ({
        label: `Th${startMonth + i + 1}`,
        calls: Math.round((apiCallsFinalTotal * wave(i)) / 3),
      }));
    }
    if (apiCallsGranularity === 'halfYear') {
      const currentMonth = new Date().getMonth();
      const startMonth = Math.max(0, currentMonth - 5);
      const months = Array.from({ length: currentMonth - startMonth + 1 }, (_, i) => startMonth + i);
      return months.map((m, i) => ({
        label: `Th${m + 1}`,
        calls: Math.round((apiCallsFinalTotal * wave(i)) / months.length),
      }));
    }
    // year
    return Array.from({ length: 12 }, (_, i) => ({
      label: `Th${i + 1}`,
      calls: Math.round((apiCallsFinalTotal * wave(i)) / 12),
    }));
  })();

  const topApiCallsData = [...TOP_API_CALLS]
    .map(item => ({ ...item, calls: Math.round(item.calls * API_CALLS_PERIOD_MULTIPLIER[apiCallsGranularity]) }))
    .sort((a, b) => b.calls - a.calls);
  const maxTopApiCalls = Math.max(...topApiCallsData.map(t => t.calls));

  // Phễu xử lý yêu cầu chia sẻ - chốt từ tổng "Số lượng yêu cầu chia sẻ" hiện có (Math.round(totalSynced / 50))
  const requestsReceived = Math.round(totalSynced / 50);
  const requestsRejected = Math.round(requestsReceived * 0.07);
  const requestsApproved = requestsReceived - requestsRejected;
  const requestsHandedOver = Math.round(requestsApproved * 0.92);
  const requestsExported = Math.round(requestsHandedOver * 0.93);

  const REQUEST_FUNNEL_RINGS = [
    { label: 'Đã phê duyệt / Tổng tiếp nhận', value: requestsApproved, total: requestsReceived, color: '#3b82f6' },
    { label: 'Đã bàn giao / Tổng đã duyệt', value: requestsHandedOver, total: requestsApproved, color: '#22c55e' },
    { label: 'Đã kết xuất / Tổng bàn giao', value: requestsExported, total: requestsHandedOver, color: '#f59e0b' },
  ];

  // API công khai dữ liệu - tổng bằng tổng số API cấu hình theo hệ thống nguồn (khớp với biểu đồ API đã cấu hình)
  const publicApiTotal = apiConfigBySourceData.reduce((sum, item) => sum + item.apiCount, 0);
  const publicApiPortal = Math.round(publicApiTotal * 0.64);
  const publicApiInternal = publicApiTotal - publicApiPortal;

  // Thời gian phản hồi trung bình API trong 24h qua - dao động quanh mốc 299ms (khớp với thẻ đếm)
  const responseTimeBaselineMs = 299;
  const responseTimeTrendData = Array.from({ length: 24 }, (_, i) => ({
    label: `${String(i).padStart(2, '0')}:00`,
    responseTimeMs: Math.round(responseTimeBaselineMs * wave(i)),
  }));
  const maxSlowApiResponseTime = Math.max(...TOP_SLOW_APIS.map(a => a.responseTimeMs));

  const total = currentData.length;
  const successCount = currentData.filter(r => r.status === 'success').length;
  const warningCount = currentData.filter(r => r.status === 'warning').length;
  const errorCount = currentData.filter(r => r.status === 'error').length;
  const draftCount = currentData.filter(r => r.status === 'draft').length;
  const toPercent = (count: number) => (total > 0 ? ((count / total) * 100).toFixed(2) : '0.00');

  const errorServices = currentData.filter(r => r.status === 'error');
  const ERROR_PAGE_SIZE = 5;
  const errorTotalPages = Math.max(1, Math.ceil(errorServices.length / ERROR_PAGE_SIZE));
  const errorPageItems = errorServices.slice(errorPage * ERROR_PAGE_SIZE, errorPage * ERROR_PAGE_SIZE + ERROR_PAGE_SIZE);

  const dataStatusCounts = { success: successCount, draft: draftCount, error: errorCount, warning: warningCount };
  const dataStatusBreakdown = DATA_STATUS_CONFIG.map(config => ({
    ...config,
    count: dataStatusCounts[config.key],
  }));

  const getStatusBadge = (status: 'success' | 'warning' | 'error' | 'draft') => {
    const styles = {
      success: 'bg-green-100 text-green-700 border-green-200',
      warning: 'bg-amber-100 text-amber-700 border-amber-200',
      error: 'bg-red-100 text-red-700 border-red-200',
      draft: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    const labels = {
      success: 'Thành công',
      warning: 'Cảnh báo',
      error: 'Lỗi',
      draft: 'Nháp'
    };
    return (
      <span className={`px-2 py-1 text-[13px] border rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getDataStatusBadge = (status: 'success' | 'warning' | 'error' | 'draft') => {
    const isActive = status === 'success';
    return (
      <span
        className={`px-2 py-1 text-[13px] border rounded-full ${isActive
          ? 'bg-green-100 text-green-700 border-green-200'
          : 'bg-slate-200 text-slate-600 border-slate-300'
          }`}
      >
        {isActive ? 'Hoạt động' : 'Ngưng hoạt động'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-[18px] font-bold text-slate-900">
            {selectedKPI === 'Thu thập'
              ? 'Báo cáo thu thập dữ liệu'
              : selectedKPI === 'Xử lý'
                ? 'Tổng quan xử lý dữ liệu'
                : selectedKPI === 'Chia sẻ'
                  ? 'Báo cáo chia sẻ dữ liệu'
                  : `Chi tiết ${selectedKPI}`}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Danh sách dữ liệu đã thu thập và đồng bộ
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      {selectedKPI === 'Thu thập' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-slate-500" />
              <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                Tổng số dịch vụ
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{total}</div>
          </div>

          <div className="bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-green-500 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                Hoạt động
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {successCount}
              <span className="text-[13px] font-normal text-slate-500 ml-1">
                / {total} ({toPercent(successCount)}%)
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-red-500 p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                Ngừng hoạt động
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {warningCount + errorCount}
              <span className="text-[13px] font-normal text-slate-500 ml-1">
                / {total} ({toPercent(warningCount + errorCount)}%)
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-yellow-500 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileEdit className="w-4 h-4 text-yellow-600" />
              <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                Bản nháp
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {draftCount}
              <span className="text-[13px] font-normal text-slate-500 ml-1">
                / {total} ({toPercent(draftCount)}%)
              </span>
            </div>
          </div>
        </div>
      ) : selectedKPI === 'Xử lý' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-cyan-500 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="w-4 h-4 text-cyan-600" />
              <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                Hệ thống đã cấu hình
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">12/15</div>
            <div className="mt-2">
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '80%' }} />
              </div>
              <p className="text-[12px] text-slate-500 mt-1">80% hoàn tất</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-green-500 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wand2 className="w-4 h-4 text-green-600" />
              <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                Quy tắc làm sạch
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">218</div>
            <p className="text-[12px] text-slate-500 mt-1">Tổng toàn hệ thống</p>
          </div>

          <div className="bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-purple-500 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shuffle className="w-4 h-4 text-purple-600" />
              <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                Quy tắc biến đổi
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">170</div>
            <p className="text-[12px] text-slate-500 mt-1">Tổng toàn hệ thống</p>
          </div>

          <div className="bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-blue-500 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                Quy tắc chuẩn hóa
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">120</div>
            <p className="text-[12px] text-slate-500 mt-1">Tổng toàn hệ thống</p>
          </div>

          <div className="bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-slate-500" />
              <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                Số lượng xử lý tháng này
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {currentMonthProcessedRecords.toLocaleString('vi-VN')} <span className="text-lg font-medium text-slate-400">bản ghi</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              {monthOverMonthChangePercent >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
              )}
              <span className={`text-[13px] font-semibold ${monthOverMonthChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monthOverMonthChangePercent >= 0 ? '+' : ''}{monthOverMonthChangePercent}%
              </span>
              <span className="text-[12px] text-slate-500">so với tháng trước ({lastMonthProcessedRecords.toLocaleString('vi-VN')})</span>
            </div>
          </div>
        </div>
      ) : selectedKPI === 'Chia sẻ' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setActiveShareCard('apiConfig')}
                className={`w-full h-[94px] text-left bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-cyan-500 p-3 flex flex-col justify-between transition-shadow ${activeShareCard === 'apiConfig' ? 'ring-2 ring-cyan-400 shadow-md' : 'hover:shadow-md'
                  }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Settings2 className="w-4 h-4 text-cyan-600" />
                    <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                      API đã cấu hình
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{total}</div>
                </div>
                <div className="flex items-center justify-end gap-1 text-[11px] font-normal text-cyan-600">
                  Xem chi tiết
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              <button
                onClick={() => setActiveShareCard('apiCalls')}
                className={`w-full h-[94px] text-left bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-green-500 p-3 flex flex-col justify-between transition-shadow ${activeShareCard === 'apiCalls' ? 'ring-2 ring-green-400 shadow-md' : 'hover:shadow-md'
                  }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                      Lượt truy cập API
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{totalSynced.toLocaleString('vi-VN')}</div>
                </div>
                <div className="flex items-center justify-end gap-1 text-[11px] font-normal text-green-600">
                  Xem chi tiết
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              <button
                onClick={() => setActiveShareCard('volume')}
                className={`w-full h-[94px] text-left bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-purple-500 p-3 flex flex-col justify-between transition-shadow ${activeShareCard === 'volume' ? 'ring-2 ring-purple-400 shadow-md' : 'hover:shadow-md'
                  }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="w-4 h-4 text-purple-600" />
                    <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                      Dung lượng chia sẻ
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{formatDataSize(totalSynced * 1150)}</div>
                </div>
                <div className="flex items-center justify-end gap-1 text-[11px] font-normal text-purple-600">
                  Xem chi tiết
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              <button
                onClick={() => setActiveShareCard('requests')}
                className={`w-full h-[94px] text-left bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-blue-500 p-3 flex flex-col justify-between transition-shadow ${activeShareCard === 'requests' ? 'ring-2 ring-blue-400 shadow-md' : 'hover:shadow-md'
                  }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Send className="w-4 h-4 text-blue-600" />
                    <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                      Số lượng yêu cầu chia sẻ
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{requestsReceived.toLocaleString('vi-VN')}</div>
                </div>
                <div className="flex items-center justify-end gap-1 text-[11px] font-normal text-blue-600">
                  Xem chi tiết
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              <button
                onClick={() => setActiveShareCard('responseTime')}
                className={`w-full h-[94px] text-left bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-teal-500 p-3 flex flex-col justify-between transition-shadow ${activeShareCard === 'responseTime' ? 'ring-2 ring-teal-400 shadow-md' : 'hover:shadow-md'
                  }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                      Thời gian phản hồi TB
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">299 ms</div>
                </div>
                <div className="flex items-center justify-end gap-1 text-[11px] font-normal text-teal-600">
                  Xem chi tiết
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              <button
                onClick={() => setActiveShareCard('errorRate')}
                className={`w-full h-[94px] text-left bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-red-500 p-3 flex flex-col justify-between transition-shadow ${activeShareCard === 'errorRate' ? 'ring-2 ring-red-400 shadow-md' : 'hover:shadow-md'
                  }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                      API cần theo dõi
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">8</div>
                </div>
                <div className="flex items-center justify-end gap-1 text-[11px] font-normal text-red-600">
                  Xem chi tiết
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              {activeShareCard === 'errorRate' ? (
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-6 pb-0">
                    <h3 className="text-slate-900 font-semibold mb-1">Top 10 API có tỷ lệ lỗi cao nhất trong 7 ngày qua</h3>
                    <p className="text-sm text-slate-500 mb-4">Xếp hạng theo tỷ lệ lỗi trên tổng số lượt gọi</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-[13px]">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">ENDPOINT</th>
                          <th className="text-left py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">HỆ THỐNG</th>
                          <th className="text-right py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">LƯỢT GỌI</th>
                          <th className="text-right py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">SỐ LỖI</th>
                          <th className="text-left py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">MÃ LỖI PHỔ BIẾN</th>
                          <th className="text-right py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">THỜI GIAN TB</th>
                          <th className="text-left py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">TỶ LỆ LỖI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {TOP_ERROR_RATE_APIS.map(api => (
                          <tr key={api.endpoint} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 font-mono text-[13px] text-slate-700 whitespace-nowrap">{api.endpoint}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 rounded whitespace-nowrap">
                                {api.system}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right text-[13px] text-slate-900 whitespace-nowrap">{api.calls.toLocaleString('vi-VN')}</td>
                            <td className="py-3 px-4 text-right text-[13px] text-slate-900 whitespace-nowrap">{api.errors.toLocaleString('vi-VN')}</td>
                            <td className="py-3 px-4 text-[13px] text-slate-600 whitespace-nowrap">{api.commonError}</td>
                            <td className="py-3 px-4 text-right text-[13px] text-slate-900 whitespace-nowrap">{api.avgTimeMs.toLocaleString('vi-VN')} ms</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2 min-w-[140px]">
                                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                  <div className="h-full rounded-full bg-red-500" style={{ width: `${(api.errorRate / TOP_ERROR_RATE_APIS[0].errorRate) * 100}%` }} />
                                </div>
                                <span className="text-[13px] font-bold text-red-600 whitespace-nowrap">{api.errorRate}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : activeShareCard === 'responseTime' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-slate-900 font-semibold mb-1">Thời gian phản hồi trung bình API</h3>
                    <p className="text-sm text-slate-500 mb-4">Theo giờ trong 24h qua (ms)</p>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={responseTimeTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="label" stroke="#64748b" style={{ fontSize: '11px' }} interval={2} />
                        <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                          formatter={(value: number) => `${value.toLocaleString('vi-VN')} ms`}
                        />
                        <ReferenceLine
                          y={RESPONSE_TIME_THRESHOLD_MS}
                          stroke="#ef4444"
                          strokeDasharray="4 4"
                          label={{ value: `Ngưỡng cảnh báo ${RESPONSE_TIME_THRESHOLD_MS}ms`, position: 'insideTopRight', fill: '#ef4444', fontSize: 11 }}
                        />
                        <Line type="monotone" dataKey="responseTimeMs" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} name="Thời gian phản hồi (ms)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-slate-900 font-semibold mb-1">Top 5 API vượt ngưỡng cảnh báo</h3>
                    <p className="text-sm text-slate-500 mb-4">Ngưỡng cảnh báo: {RESPONSE_TIME_THRESHOLD_MS} ms</p>
                    <div className="space-y-4">
                      {TOP_SLOW_APIS.map((api, i) => {
                        const percent = (api.responseTimeMs / maxSlowApiResponseTime) * 100;
                        return (
                          <div key={api.name}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center bg-red-100 text-red-600 text-[12px] font-bold flex-shrink-0">
                                  {i + 1}
                                </span>
                                <span className="text-[13px] font-semibold text-slate-900">{api.name}</span>
                              </div>
                              <span className="text-[13px] font-bold text-red-600 whitespace-nowrap">{api.responseTimeMs} ms</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full rounded-full bg-red-500" style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : activeShareCard === 'requests' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-slate-900 font-semibold">Yêu cầu chia sẻ dữ liệu đang chờ xử lý</h3>
                      <button
                        onClick={() => {
                          if (typeof (window as any).navigateToPage === 'function') {
                            (window as any).navigateToPage('provisioning-data-request');
                          }
                        }}
                        className="flex-shrink-0 flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Xem chi tiết
                      </button>
                    </div>
                    <p className="text-[13px] text-slate-500 mb-3">5 yêu cầu mới nhất</p>
                    <div className="space-y-2.5">
                      {PENDING_SHARE_REQUESTS.map(req => (
                        <div key={req.id} className="border border-slate-100 rounded-lg p-3">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="text-[13px] font-semibold text-slate-900">{req.requester}</span>
                            <span className="flex-shrink-0 px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-700 rounded-full whitespace-nowrap">
                              Chờ xử lý
                            </span>
                          </div>
                          <p className="text-[12px] text-slate-500 mb-2">{req.dataType}</p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {req.requestedAt}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6 flex flex-col">
                    <h3 className="text-slate-900 font-semibold mb-1">Xử lý yêu cầu chia sẻ dữ liệu</h3>
                    <p className="text-sm text-slate-500 mb-4">Tỷ lệ xử lý qua từng bước, tính trên tổng {requestsReceived.toLocaleString('vi-VN')} yêu cầu tiếp nhận</p>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {REQUEST_FUNNEL_RINGS.map(ring => {
                        const percent = ring.total > 0 ? Math.round((ring.value / ring.total) * 100) : 0;
                        return (
                          <div key={ring.label} className="flex flex-col items-center justify-center border border-slate-100 rounded-lg p-3">
                            <div className="relative w-[130px] h-[130px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                  innerRadius="72%"
                                  outerRadius="100%"
                                  data={[{ value: percent }]}
                                  startAngle={90}
                                  endAngle={90 - (360 * percent) / 100}
                                >
                                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                                  <RadialBar dataKey="value" fill={ring.color} cornerRadius={8} background={{ fill: '#e2e8f0' }} />
                                </RadialBarChart>
                              </ResponsiveContainer>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold" style={{ color: ring.color }}>{ring.value.toLocaleString('vi-VN')}</span>
                                <span className="text-[11px] text-slate-400">/ {ring.total.toLocaleString('vi-VN')}</span>
                                <span className="text-[11px] text-slate-500 font-semibold mt-0.5">{percent}%</span>
                              </div>
                            </div>
                            <p className="text-[12px] text-slate-600 text-center mt-2 leading-snug">{ring.label}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-blue-500 p-4 flex flex-col justify-center">
                        <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                          Yêu cầu tiếp nhận
                        </span>
                        <div className="text-3xl font-bold text-slate-900 mt-1">{requestsReceived.toLocaleString('vi-VN')}</div>
                      </div>
                      <div className="bg-red-50 rounded-lg border border-red-100 p-4 flex flex-col justify-center">
                        <span className="text-[12px] font-semibold uppercase tracking-wide text-red-600">
                          Bị từ chối
                        </span>
                        <div className="text-3xl font-bold text-red-600 mt-1">{requestsRejected.toLocaleString('vi-VN')}</div>
                      </div>
                    </div>

                    <div className="border border-slate-100 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-slate-900 font-semibold text-[13px]">Số lượng API công khai dữ liệu</h3>
                        <span className="text-[13px] font-bold text-slate-900">{publicApiTotal.toLocaleString('vi-VN')}</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-semibold text-slate-700">Cổng dữ liệu Quốc gia</span>
                            <span className="text-[13px] font-bold text-indigo-600">
                              {((publicApiPortal / publicApiTotal) * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(publicApiPortal / publicApiTotal) * 100}%` }} />
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{publicApiPortal.toLocaleString('vi-VN')} API</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-semibold text-slate-700">Nền tảng chia sẻ dữ liệu nội bộ</span>
                            <span className="text-[13px] font-bold text-teal-600">
                              {((publicApiInternal / publicApiTotal) * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full bg-teal-500" style={{ width: `${(publicApiInternal / publicApiTotal) * 100}%` }} />
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{publicApiInternal.toLocaleString('vi-VN')} API</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeShareCard === 'volume' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
                      <div>
                        <h3 className="text-slate-900 font-semibold mb-1">Xu hướng Chia sẻ dữ liệu theo dung lượng</h3>
                        <p className="text-sm text-slate-500">Tổng dung lượng chia sẻ (MB) theo thời gian</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                          {VOLUME_TREND_GRANULARITY_OPTIONS.map(option => (
                            <button
                              key={option.key}
                              onClick={() => setVolumeTrendGranularity(option.key)}
                              className={`px-2.5 py-1.5 text-[12px] rounded-md transition-colors whitespace-nowrap ${volumeTrendGranularity === option.key
                                ? 'bg-white text-blue-600 shadow-sm font-semibold'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                        {volumeTrendGranularity === 'year' && (
                          <select
                            value={volumeTrendYear}
                            onChange={e => setVolumeTrendYear(Number(e.target.value))}
                            className="text-[12px] bg-white border border-slate-200 rounded-md px-2 py-1.5 text-slate-700"
                          >
                            {availableTrendYears.map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={370}>
                      <LineChart data={volumeTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="label" stroke="#64748b" style={{ fontSize: '11px' }} interval={volumeTrendGranularity === 'month30' ? 2 : 0} />
                        <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                          formatter={(value: number) => `${value.toLocaleString('vi-VN')} MB`}
                        />
                        <Line type="monotone" dataKey="volumeMB" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} name="Dung lượng (MB)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-slate-900 font-semibold mb-1">Top 5 loại dữ liệu được chia sẻ nhiều nhất</h3>
                    <p className="text-sm text-slate-500 mb-4">Xếp hạng theo tổng số lượt chia sẻ</p>
                    <div className="space-y-9">
                      {TOP_SHARED_DATA_TYPES.map((item, i) => {
                        const color = TOP_DATA_TYPE_COLORS[i % TOP_DATA_TYPE_COLORS.length];
                        const percent = (item.shares / maxTopDataTypeShares) * 100;
                        return (
                          <div key={item.name}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
                                  style={{ backgroundColor: color }}
                                >
                                  {i + 1}
                                </span>
                                <span className="text-[13px] font-semibold text-slate-900">{item.name}</span>
                              </div>
                              <span className="text-[13px] text-slate-500 whitespace-nowrap">{item.shares.toLocaleString('vi-VN')} lượt</span>
                            </div>
                            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : activeShareCard === 'apiCalls' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
                      <div>
                        <h3 className="text-slate-900 font-semibold mb-1">Xu hướng truy cập API</h3>
                        <p className="text-sm text-slate-500">Tổng lượt gọi API theo thời gian</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                          {VOLUME_TREND_GRANULARITY_OPTIONS.map(option => (
                            <button
                              key={option.key}
                              onClick={() => setApiCallsGranularity(option.key)}
                              className={`px-2.5 py-1.5 text-[12px] rounded-md transition-colors whitespace-nowrap ${apiCallsGranularity === option.key
                                ? 'bg-white text-blue-600 shadow-sm font-semibold'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                        {apiCallsGranularity === 'year' && (
                          <select
                            value={apiCallsYear}
                            onChange={e => setApiCallsYear(Number(e.target.value))}
                            className="text-[12px] bg-white border border-slate-200 rounded-md px-2 py-1.5 text-slate-700"
                          >
                            {availableTrendYears.map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={370}>
                      <LineChart data={apiCallsTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="label" stroke="#64748b" style={{ fontSize: '11px' }} interval={apiCallsGranularity === 'month30' ? 2 : 0} />
                        <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                          formatter={(value: number) => `${value.toLocaleString('vi-VN')} lượt`}
                        />
                        <Line type="monotone" dataKey="calls" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Lượt truy cập API" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-slate-900 font-semibold mb-1">Top 5 API có lượt truy cập cao nhất</h3>
                    <p className="text-sm text-slate-500 mb-4">Xếp hạng theo tổng lượt gọi trong kỳ đã chọn</p>
                    <div className="space-y-9">
                      {topApiCallsData.map((item, i) => {
                        const color = TOP_API_CALL_COLORS[i % TOP_API_CALL_COLORS.length];
                        const percent = (item.calls / maxTopApiCalls) * 100;
                        return (
                          <div key={item.name}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
                                  style={{ backgroundColor: color }}
                                >
                                  {i + 1}
                                </span>
                                <span className="text-[13px] font-semibold text-slate-900">{item.name}</span>
                              </div>
                              <span className="text-[13px] text-slate-500 whitespace-nowrap">{item.calls.toLocaleString('vi-VN')} lượt</span>
                            </div>
                            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h3 className="text-slate-900 font-semibold mb-1">API đã cấu hình chia sẻ theo loại API</h3>
                  <p className="text-sm text-slate-500 mb-4">{apiConfigBySourceData.length} hệ thống nguồn đang kết nối</p>
                  <ResponsiveContainer width="100%" height={470}>
                    <BarChart data={apiConfigBySourceData} layout="vertical" margin={{ left: 10, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} />
                      <YAxis type="category" dataKey="code" stroke="#64748b" style={{ fontSize: '11px' }} width={100} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="apiCount" fill="#0d9488" radius={[0, 4, 4, 0]} name="Số API" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="text-[16px] text-slate-600">Tổng nguồn</span>
            </div>
            <div className="text-[16px] text-slate-900">{total}</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-green-600" />
              <span className="text-[16px] text-slate-600">Tổng đồng bộ</span>
            </div>
            <div className="text-[16px] text-slate-900">{totalSynced.toLocaleString()}</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-[16px] text-slate-600">Thành công</span>
            </div>
            <div className="text-[16px] text-slate-900">{successCount}</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-[16px] text-slate-600">Cảnh báo/Lỗi</span>
            </div>
            <div className="text-[16px] text-slate-900">{warningCount + errorCount + draftCount}</div>
          </div>
        </div>
      )}

      {/* Charts */}
      {selectedKPI === 'Thu thập' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6 flex flex-col">
            <div className="mb-1">
              <h3 className="text-slate-900 font-semibold mb-1">Số lượng dịch vụ, bản ghi và dữ liệu theo Hệ thống nguồn</h3>
              <p className="text-sm text-slate-500">
                {isDateRangeActive
                  ? 'Số lượng phát sinh trong khoảng thời gian đã chọn, mỗi hệ thống nguồn 1 thanh'
                  : 'Biểu đồ thanh ngang, mỗi hệ thống nguồn 1 thanh'}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap mt-3">
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                {METRIC_BAR_CONFIG.map(option => (
                  <button
                    key={option.key}
                    onClick={() => setBarMetric(option.key)}
                    className={`px-3 py-1.5 text-[13px] rounded-md transition-colors ${barMetric === option.key
                      ? 'bg-white text-blue-600 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1.5">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="text-[12px] bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700"
                />
                <span className="text-slate-400 text-[12px]">đến</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="text-[12px] bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700"
                />
                {isDateRangeActive && (
                  <button
                    onClick={() => { setDateFrom(''); setDateTo(''); }}
                    className="text-[12px] text-slate-500 hover:text-slate-800 px-1.5"
                    title="Bỏ lọc thời gian"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 mt-3">
              {SOURCE_TREND_LIST.map((source, index) => {
                const isChecked = selectedSources.includes(source);
                const color = SOURCE_LINE_COLORS[index % SOURCE_LINE_COLORS.length];
                return (
                  <label
                    key={source}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[13px] cursor-pointer transition-colors ${isChecked ? 'border-slate-300 bg-white' : 'border-slate-200 bg-slate-50 text-slate-400'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSource(source)}
                      className="hidden"
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: isChecked ? color : '#cbd5e1' }}
                    />
                    <span className={isChecked ? 'text-slate-700' : 'text-slate-400'}>{source}</span>
                  </label>
                );
              })}
            </div>

            <div style={{ height: Math.max(300, visibleSources.length * 34) }}>
              {visibleSources.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metricBarData} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      stroke="#64748b"
                      style={{ fontSize: '12px' }}
                      allowDecimals={barMetric !== 'services'}
                      tickFormatter={(value: number) => formatRawMetricValue(barMetric, value)}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#64748b"
                      style={{ fontSize: '11px' }}
                      width={220}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => formatRawMetricValue(barMetric, value)}
                    />
                    <Bar dataKey={barMetric} fill={activeBarConfig.color} radius={[0, 4, 4, 0]} name={activeBarConfig.label} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  Chọn ít nhất một hệ thống nguồn để hiển thị
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900 font-semibold uppercase text-[13px] tracking-wide">Trạng thái dữ liệu</h3>
                <div className="border border-slate-200 rounded-md px-3 py-1 text-slate-900 font-bold">
                  {total}
                </div>
              </div>

              <div className="flex h-8 rounded-md overflow-hidden bg-slate-100 mb-4">
                {dataStatusBreakdown.filter(s => s.count > 0).map(s => {
                  const percent = toPercent(s.count);
                  return (
                    <div
                      key={s.key}
                      className="flex items-center justify-center overflow-hidden"
                      style={{ width: `${percent}%`, backgroundColor: s.color }}
                    >
                      <span className="text-[12px] font-bold text-white whitespace-nowrap px-1">
                        {percent}%
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2.5">
                {dataStatusBreakdown.map(s => (
                  <div key={s.key} className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-600">{s.label}:</span>
                    </div>
                    <span className="font-bold" style={{ color: s.color }}>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <h3 className="text-slate-900 font-semibold uppercase text-[13px] tracking-wide">
                    Dịch vụ lỗi cập nhật ({errorServices.length})
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setErrorPage(p => Math.max(0, p - 1))}
                    disabled={errorPage === 0}
                    className="p-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setErrorPage(p => Math.min(errorTotalPages - 1, p + 1))}
                    disabled={errorPage >= errorTotalPages - 1}
                    className="p-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {errorPageItems.length === 0 && (
                  <div className="text-center py-6 text-slate-400 text-[13px]">Không có dịch vụ lỗi cập nhật</div>
                )}
                {errorPageItems.map(service => (
                  <div key={service.id} className="border border-slate-200 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[13px] font-semibold text-slate-900 leading-snug">{service.name}</span>
                      <span className="flex-shrink-0 px-2 py-0.5 text-[11px] font-bold bg-red-100 text-red-700 rounded-full whitespace-nowrap">
                        LỖI CẬP NHẬT
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-slate-600 mb-1">
                      <Database className="w-3.5 h-3.5 text-slate-400" />
                      {service.source}
                    </div>
                    <div className="flex items-center justify-between text-[12px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {service.lastSync}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {service.dataSizeLabel || formatDataSize(service.syncedCount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedKPI === 'Xử lý' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
            <div>
              <h3 className="text-slate-900 font-semibold mb-1">Quy tắc xử lý theo từng hệ thống</h3>
              <p className="text-sm text-slate-500">Số lượng quy tắc làm sạch, biến đổi và chuẩn hóa đang áp dụng</p>
            </div>
            <div className="flex items-center gap-3">
              {PROCESSING_RULE_CONFIG.map(rule => (
                <div key={rule.key} className="flex items-center gap-1.5 text-[13px] text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: rule.color }} />
                  {rule.label}
                </div>
              ))}
            </div>
          </div>

          {/* Bộ lọc trong/ngoài ngành + khoảng thời gian */}
          <div className="flex items-center gap-2 flex-wrap mb-4 mt-3">
            <select
              aria-label="Chọn phạm vi hệ thống"
              className="px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Chọn phạm vi hệ thống"
              value={processingRulesScope}
              onChange={(e) => setProcessingRulesScope(e.target.value as 'Trong ngành' | 'Ngoài ngành')}
            >
              <option value="Trong ngành">Trong ngành</option>
              <option value="Ngoài ngành">Ngoài ngành</option>
            </select>
            <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1.5">
              <input
                type="date"
                value={processingRulesDateFrom}
                onChange={(e) => setProcessingRulesDateFrom(e.target.value)}
                className="text-[12px] bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700"
              />
              <span className="text-slate-400 text-[12px]">đến</span>
              <input
                type="date"
                value={processingRulesDateTo}
                onChange={(e) => setProcessingRulesDateTo(e.target.value)}
                className="text-[12px] bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700"
              />
              {(processingRulesDateFrom || processingRulesDateTo) && (
                <button
                  onClick={() => { setProcessingRulesDateFrom(''); setProcessingRulesDateTo(''); }}
                  className="text-[12px] text-slate-500 hover:text-slate-800 px-1.5"
                  title="Bỏ lọc thời gian"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={processingRulesChartData} margin={{ bottom: 70, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                style={{ fontSize: '11px' }}
                angle={-35}
                textAnchor="end"
                interval={0}
                height={80}
              />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              {PROCESSING_RULE_CONFIG.map(rule => (
                <Bar key={rule.key} dataKey={rule.key} stackId="rules" fill={rule.color} name={rule.label} barSize={48} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {selectedKPI === 'Xử lý' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-slate-900 font-semibold mb-1">Xu hướng xử lý dữ liệu 6 tháng gần nhất</h3>
            <p className="text-sm text-slate-500 mb-4">Tổng dung lượng (GB) và số bản ghi xử lý (triệu records)</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processingTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="volumeGB" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="Khối lượng (GB)" />
                <Line yAxisId="right" type="monotone" dataKey="recordsM" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="Bản ghi (triệu)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-slate-700" />
                <h3 className="text-slate-900 font-semibold">Xếp hạng hệ thống có dung lượng xử lý lớn nhất</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setVolumeRankPage(p => Math.max(0, p - 1))}
                  disabled={volumeRankPage === 0}
                  className="p-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setVolumeRankPage(p => Math.min(volumeRankTotalPages - 1, p + 1))}
                  disabled={volumeRankPage >= volumeRankTotalPages - 1}
                  className="p-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-4">Xếp hạng theo tổng GB đã xử lý</p>

            <div className="space-y-4">
              {volumeRankPageItems.map((item, i) => {
                const rank = volumeRankPage * VOLUME_RANK_PAGE_SIZE + i + 1;
                const color = RANK_COLORS[i % RANK_COLORS.length];
                const percent = (item.volumeGB / maxVolumeGB) * 100;
                return (
                  <div key={item.source}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
                          style={{ backgroundColor: color }}
                        >
                          {rank}
                        </span>
                        <span className="text-[13px] font-semibold text-slate-900">{item.source}</span>
                      </div>
                      <span className="text-[13px] text-slate-500 whitespace-nowrap">{item.volumeGB.toLocaleString('vi-VN')} GB</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      {selectedKPI !== 'Chia sẻ' && selectedKPI !== 'Xử lý' && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">STT</th>
                  <th className="text-left py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">
                    {selectedKPI === 'Thu thập' ? 'Tên dịch vụ' : 'Tên dữ liệu'}
                  </th>
                  <th className="text-left py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">
                    {selectedKPI === 'Thu thập' ? 'Hệ thống nguồn' : 'Nguồn'}
                  </th>
                  <th className="text-right py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">
                    <button onClick={() => toggleSort('dataSize')} className="flex items-center gap-1 ml-auto hover:text-slate-900">
                      {selectedKPI === 'Thu thập' ? 'Kích thước dữ liệu' : 'Số lượng đồng bộ'}
                      {renderSortIcon('dataSize')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">
                    <button onClick={() => toggleSort('lastSync')} className="flex items-center gap-1 hover:text-slate-900">
                      Lần đồng bộ cuối
                      {renderSortIcon('lastSync')}
                    </button>
                  </th>
                  <th className="text-center py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">Trạng thái</th>
                  {selectedKPI === 'Thu thập' && (
                    <th className="text-center py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">Trạng thái dữ liệu</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedData.map((record, index) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-[13px] text-slate-600">{index + 1}</td>
                    <td className="py-3 px-4">
                      <span className="text-[13px] text-slate-900">{record.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[13px] text-slate-600">{record.source}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[13px] text-slate-900">
                        {selectedKPI === 'Thu thập'
                          ? record.dataSizeLabel || formatDataSize(record.syncedCount)
                          : record.syncedCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[13px] text-slate-600">{record.lastSync}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(record.status)}
                    </td>
                    {selectedKPI === 'Thu thập' && (
                      <td className="py-3 px-4 text-center">
                        {getDataStatusBadge(record.status)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentData.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Không có dữ liệu chi tiết
            </div>
          )}
        </div>
      )}
    </div>
  );
}
