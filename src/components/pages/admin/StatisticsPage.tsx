import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import {
  Badge, TruncatedText, RowIconAction, DateInput,
  BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, BTN_FOCUS, LABEL_CLS, FIELD_LABEL, FIELD_VALUE,
  SECTION_TITLE, GROUP_TITLE, tabClass, TABLE_WRAP_CLS, TABLE_HEAD_BG, TABLE_HEAD_ROW_CLS, CARD_CLS,
} from '../collection/collectionUi';
import {
  BarChart3,
  Download,
  FileText,
  Filter,
  Table2,
  Eye,
  Image as ImageIcon,
  History,
  X,
  Printer
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface StatisticsData {
  name: string;
  total: number;
  success: number;
  failed: number;
  pending?: number;
}

const monthlyData: StatisticsData[] = [
  { name: 'T1', total: 1200, success: 1150, failed: 50 },
  { name: 'T2', total: 1350, success: 1300, failed: 50 },
  { name: 'T3', total: 1500, success: 1420, failed: 80 },
  { name: 'T4', total: 1280, success: 1200, failed: 80 },
  { name: 'T5', total: 1600, success: 1540, failed: 60 },
  { name: 'T6', total: 1450, success: 1380, failed: 70 },
  { name: 'T7', total: 1700, success: 1630, failed: 70 },
  { name: 'T8', total: 1550, success: 1480, failed: 70 },
  { name: 'T9', total: 1800, success: 1720, failed: 80 },
  { name: 'T10', total: 1650, success: 1570, failed: 80 },
  { name: 'T11', total: 1900, success: 1820, failed: 80 },
  { name: 'T12', total: 2000, success: 1920, failed: 80 }
];

export interface IntegrationStats {
  name: string;
  integrated: number;
  processed: number;
  shared: number;
  unit: string;
  status: 'success' | 'warning' | 'critical';
  connectedDate: string;
}

// 15 hệ thống nguồn - đồng bộ tên với SOURCE_TREND_LIST (kpiReportData.ts) dùng ở trang Báo cáo thu thập
// integrated/processed/shared là dung lượng dữ liệu (GB); toàn bộ số liệu, unit, status, connectedDate là dữ liệu mock [Unverified]
const integrationData: IntegrationStats[] = [
  { name: 'TAND Tối cao', integrated: 24.7, processed: 24.3, shared: 17.8, unit: 'Bộ Tư pháp', status: 'success', connectedDate: '2024-01-10' },
  { name: 'Bộ Nội vụ', integrated: 5.7, processed: 5.6, shared: 4.0, unit: 'Bộ Tư pháp', status: 'success', connectedDate: '2024-01-18' },
  { name: 'Ủy ban Dân tộc', integrated: 1.3, processed: 1.3, shared: 0.8, unit: 'Bộ Tư pháp', status: 'success', connectedDate: '2024-02-05' },
  { name: 'Bộ Ngoại giao', integrated: 0.2, processed: 0, shared: 0, unit: 'Bộ Tư pháp', status: 'warning', connectedDate: '2024-02-12' },
  { name: 'Bộ LĐTBXH', integrated: 60.8, processed: 59.5, shared: 43.5, unit: 'Bộ Tư pháp', status: 'success', connectedDate: '2024-01-25' },
  { name: 'Bộ Y tế', integrated: 0.9, processed: 0.9, shared: 0.6, unit: 'Bộ Tư pháp', status: 'success', connectedDate: '2024-03-01' },
  { name: 'Cục Hành chính tư pháp', integrated: 112.3, processed: 111.3, shared: 84.4, unit: 'Cục Hộ tịch, quốc tịch, chứng thực', status: 'success', connectedDate: '2024-01-05' },
  { name: 'Cục Quản lý thi hành án dân sự', integrated: 14.9, processed: 14.6, shared: 10.3, unit: 'Bộ Tư pháp', status: 'success', connectedDate: '2024-02-20' },
  { name: 'Cục Đăng ký giao dịch bảo đảm và BTNN', integrated: 5.3, processed: 5.3, shared: 3.7, unit: 'Cục Đăng ký quốc gia giao dịch bảo đảm', status: 'success', connectedDate: '2024-02-10' },
  { name: 'Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính', integrated: 9.7, processed: 9.4, shared: 6.0, unit: 'Bộ Tư pháp', status: 'success', connectedDate: '2024-03-08' },
  { name: 'Cục Bổ trợ tư pháp', integrated: 7.4, processed: 7.4, shared: 5.0, unit: 'Bộ Tư pháp', status: 'success', connectedDate: '2024-03-15' },
  { name: 'Vụ Hợp tác quốc tế', integrated: 0.5, processed: 0.5, shared: 0.3, unit: 'Bộ Tư pháp', status: 'warning', connectedDate: '2024-04-02' },
  { name: 'Cục Kế hoạch - Tài chính', integrated: 2.7, processed: 2.7, shared: 1.7, unit: 'Bộ Tư pháp', status: 'success', connectedDate: '2024-01-30' },
  { name: 'TTDLQG', integrated: 9.3, processed: 8.9, shared: 6.3, unit: 'Cục Công nghệ thông tin', status: 'success', connectedDate: '2024-04-20' },
  { name: 'Tòa án', integrated: 11.8, processed: 11.4, shared: 7.6, unit: 'Bộ Tư pháp', status: 'critical', connectedDate: '2024-05-02' }
];

const INTEGRATION_METRIC_CONFIG: { key: 'integrated' | 'processed' | 'shared'; label: string; color: string }[] = [
  // Màu theo bảng màu compomennt.md mục 2 / 5.8: Primary #155DFC, Success #16A34A, tím badge #8200DB
  { key: 'integrated', label: 'Đã tích hợp', color: '#155DFC' },
  { key: 'processed', label: 'Đã xử lý', color: '#16A34A' },
  { key: 'shared', label: 'Chia sẻ đi', color: '#8200DB' },
];

// Bảng dữ liệu (mục 5.3): th 13px/700 đen, td 13px/400 đen
const TH = 'h-[42px] px-3 py-[13px] text-[13px] font-bold text-black whitespace-nowrap';
const TD = 'px-3 py-1 text-[13px] text-black';
const TR = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const MODAL_TITLE = 'text-[16px] font-medium text-[#020817]';
const MODAL_FOOTER = 'shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3';
// Trục / tooltip biểu đồ: chữ 12px, màu theo mục 2
const AXIS_TICK = { fill: '#475569', fontSize: 12 };
const CHART_TOOLTIP_STYLE = { backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px', color: '#020817' };
const SectionBar = () => <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />;

// Badge tỷ lệ: ≥95% xanh lá, ≥90% vàng, còn lại đỏ (giữ ngưỡng cũ)
const rateVariant = (rate: number) => (rate >= 95 ? 'green' : rate >= 90 ? 'amber' : 'red');

// '2026-05-22 17:15:32' → ngày dd/mm/yyyy, giờ xuống dòng (mục 5.3.3)
const splitTimestamp = (ts: string) => {
  const [date = '', time = ''] = ts.split(' ');
  const [y, m, d] = date.split('-');
  return { date: y && m && d ? `${d}/${m}/${y}` : date, time };
};

const INTEGRATION_ITEM_COLORS = [
  '#1d4ed8', '#15803d', '#6d28d9', '#b45309', '#0f766e',
  '#be185d', '#4338ca', '#0369a1', '#a16207', '#334155',
  '#c2410c', '#0891b2', '#7c3aed', '#ca8a04', '#475569',
];

const formatNumber = (value: number) => {
  if (value === 0) return '0 GB';
  return `${value.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} GB`;
};

const moduleData = [
  { name: 'Đăng ký kinh doanh', value: 3500, color: '#3b82f6' },
  { name: 'Công chứng', value: 2800, color: '#10b981' },
  { name: 'Trợ giúp pháp lý', value: 2200, color: '#f59e0b' },
  { name: 'Văn bản pháp luật', value: 1800, color: '#8b5cf6' },
  { name: 'Hộ tịch', value: 1500, color: '#ec4899' },
  { name: 'Khác', value: 1200, color: '#6b7280' }
];

const sourceData: StatisticsData[] = [
  { name: 'Đăng ký DN', total: 12500, success: 12000, failed: 500 },
  { name: 'Công chứng', total: 8900, success: 8700, failed: 200 },
  { name: 'Trợ giúp PL', total: 6800, success: 6500, failed: 300 },
  { name: 'Văn bản PL', total: 15200, success: 15000, failed: 200 },
  { name: 'Hộ tịch', total: 9500, success: 9300, failed: 200 }
];

interface AccessLog {
  id: number;
  timestamp: string;
  username: string;
  fullName: string;
  action: string;
  ipAddress: string;
  status: 'success' | 'failed';
}

const mockAccessLogs: AccessLog[] = [
  { id: 1, timestamp: '2026-05-22 17:15:32', username: 'admin_quanly', fullName: 'Nguyễn Văn An', action: 'Xem biểu đồ thống kê CSDL tích hợp', ipAddress: '192.168.1.15', status: 'success' },
  { id: 2, timestamp: '2026-05-22 16:40:12', username: 'cb_nghiepvu1', fullName: 'Trần Thị Bình', action: 'Tải biểu đồ thống kê CSDL tích hợp', ipAddress: '192.168.1.48', status: 'success' },
  { id: 3, timestamp: '2026-05-22 15:20:05', username: 'admin_quanly', fullName: 'Nguyễn Văn An', action: 'Lọc dữ liệu biểu đồ theo thời gian', ipAddress: '192.168.1.15', status: 'success' },
  { id: 4, timestamp: '2026-05-22 14:10:55', username: 'cb_nghiepvu2', fullName: 'Phạm Thị Dung', action: 'Xem số liệu chi tiết chỉ tiêu Hộ tịch', ipAddress: '10.0.2.112', status: 'success' },
  { id: 5, timestamp: '2026-05-22 11:30:24', username: 'lanhdao_bo', fullName: 'Hoàng Văn Em', action: 'Xuất file Excel báo cáo thống kê', ipAddress: '192.168.1.5', status: 'success' },
  { id: 6, timestamp: '2026-05-22 09:15:00', username: 'admin_quanly', fullName: 'Nguyễn Văn An', action: 'Xem biểu đồ thống kê CSDL tích hợp', ipAddress: '192.168.1.15', status: 'success' },
  { id: 7, timestamp: '2026-05-22 08:45:10', username: 'cb_nghiepvu1', fullName: 'Trần Thị Bình', action: 'Xem lịch sử truy cập & thao tác biểu đồ', ipAddress: '192.168.1.48', status: 'success' },
];

interface IndicatorDetail {
  id: number;
  source: string;
  indicatorName: string;
  unit: string;
  targetValue: number;
  actualValue: number;
  rate: number;
  status: 'good' | 'warning' | 'critical';
}

const mockIndicatorDetails: IndicatorDetail[] = [
  { id: 1, source: 'CSDL Hộ tịch điện tử', indicatorName: 'Đăng ký khai sinh tích hợp', unit: 'Bản ghi', targetValue: 5000, actualValue: 4950, rate: 99.0, status: 'good' },
  { id: 2, source: 'CSDL Hộ tịch điện tử', indicatorName: 'Đăng ký kết hôn tích hợp', unit: 'Bản ghi', targetValue: 3000, actualValue: 2970, rate: 99.0, status: 'good' },
  { id: 3, source: 'CSDL Hộ tịch điện tử', indicatorName: 'Đăng ký khai tử tích hợp', unit: 'Bản ghi', targetValue: 1500, actualValue: 1380, rate: 92.0, status: 'warning' },
  { id: 4, source: 'HT quản lý hồ sơ QT', indicatorName: 'Hồ sơ quốc tịch đã đồng bộ', unit: 'Bản ghi', targetValue: 4000, actualValue: 3920, rate: 98.0, status: 'good' },
  { id: 5, source: 'CSDL thi hành án dân sự', indicatorName: 'Thông tin thi hành án dân sự', unit: 'Bản ghi', targetValue: 8000, actualValue: 7440, rate: 93.0, status: 'warning' },
  { id: 6, source: 'CSDL về biện pháp BĐ', indicatorName: 'Biện pháp bảo đảm tích hợp', unit: 'Bản ghi', targetValue: 2000, actualValue: 1960, rate: 98.0, status: 'good' },
  { id: 7, source: 'CSDL quốc gia về PL', indicatorName: 'Văn bản quy phạm pháp luật', unit: 'Văn bản', targetValue: 15000, actualValue: 14850, rate: 99.0, status: 'good' },
  { id: 8, source: 'Công chứng', indicatorName: 'Hồ sơ công chứng tích hợp', unit: 'Bản ghi', targetValue: 9000, actualValue: 8730, rate: 97.0, status: 'good' },
  { id: 9, source: 'Trợ giúp pháp lý', indicatorName: 'Vụ việc trợ giúp pháp lý', unit: 'Bản ghi', targetValue: 6800, actualValue: 6120, rate: 90.0, status: 'critical' },
];

type ViewMode = 'chart' | 'table';
type ChartType = 'bar' | 'line' | 'pie';

export function StatisticsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-12-31' });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<StatisticsData | null>(null);

  // States for Transaction 6, 8
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAllDetailsModal, setShowAllDetailsModal] = useState(false);

  // States for integration statistics chart (thiết kế theo mẫu "Số lượng dịch vụ, bản ghi và dữ liệu theo Hệ thống nguồn")
  const [chartMetric, setChartMetric] = useState<'integrated' | 'processed' | 'shared'>('integrated');
  const [selectedIntegrationItems, setSelectedIntegrationItems] = useState<string[]>(integrationData.map(d => d.name));
  const toggleIntegrationItem = (name: string) => {
    setSelectedIntegrationItems(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };
  const [activeChartTab, setActiveChartTab] = useState<'chart' | 'table'>('chart');
  const [isDownloadingChart, setIsDownloadingChart] = useState(false);
  const chartContentRef = useRef<HTMLDivElement>(null);

  // Lọc biểu đồ thống kê CSDL tích hợp theo khoảng ngày kết nối
  const filteredIntegrationData = integrationData.filter(row => {
    if (dateRange.from && row.connectedDate < dateRange.from) return false;
    if (dateRange.to && row.connectedDate > dateRange.to) return false;
    return true;
  });

  // Biểu đồ cột: 1 chỉ tiêu tại một thời điểm (lọc bằng chartMetric), mỗi hạng mục tích hợp 1 thanh
  const chartDisplayData = filteredIntegrationData.filter(row => selectedIntegrationItems.includes(row.name));
  const activeMetricConfig = INTEGRATION_METRIC_CONFIG.find(m => m.key === chartMetric)!;

  const handleExportReport = () => {
    toast.info('Đang xuất báo cáo thống kê...');
  };

  // Transaction 7: Tải biểu đồ thống kê CSDL tích hợp về máy tính cá nhân (chụp đúng vùng biểu đồ/bảng đang hiển thị thành ảnh PNG)
  const handleDownloadChart = async () => {
    if (!chartContentRef.current || isDownloadingChart) return;
    setIsDownloadingChart(true);
    try {
      const canvas = await html2canvas(chartContentRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `bieu_do_thong_ke_CSDL_tich_hop_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Lỗi khi tải biểu đồ:', error);
      toast.error('Không thể tải biểu đồ, vui lòng thử lại.');
    } finally {
      setIsDownloadingChart(false);
    }
  };


  const handleViewDetail = (data: StatisticsData) => {
    setSelectedDetail(data);
    setShowDetailModal(true);
  };

  // Calculate totals
  const totalRecords = monthlyData.reduce((acc, item) => acc + item.total, 0);
  const totalSuccess = monthlyData.reduce((acc, item) => acc + item.success, 0);
  const totalFailed = monthlyData.reduce((acc, item) => acc + item.failed, 0);
  const successRate = ((totalSuccess / totalRecords) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang (H1 20px/700 #2A0F0F) + nhóm nút — mỗi màn một nút Primary (mục 5.1) */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Thống kê CSDL tích hợp</h1>
          <p className="text-[13px] text-[#64748B]">
            Tổng quan dữ liệu tích hợp, xử lý và chia sẻ giữa các hệ thống
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className={BTN_OUTLINE}
            title="Xem lịch sử truy cập & thao tác"
          >
            <History className="w-4 h-4" />
            Lịch sử
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className={BTN_OUTLINE}
            title="In báo cáo"
          >
            <Printer className="w-4 h-4" />
            In
          </button>
          <button
            type="button"
            onClick={handleDownloadChart}
            disabled={isDownloadingChart}
            className={BTN_PRIMARY}
            title="Tải biểu đồ"
          >
            <Download className="w-4 h-4" />
            {isDownloadingChart ? 'Đang tải...' : 'Tải xuống'}
          </button>
        </div>
      </div>

      {/* Chart View */}
      {viewMode === 'chart' && (
        <div className="space-y-6">
          {/* Main Chart Panel & Customization Side Panel */}
          <div className="flex flex-row w-full items-start gap-6">
            {/* Left Chart/Table Panel */}
            <div className={`${CARD_CLS} flex flex-col justify-between`} style={{ flex: '7 1 0%', minWidth: 0 }}>
              <div>
                <div className="mb-4 border-b border-[#E2E8F0] pb-4">
                  <h2 className={`${SECTION_TITLE} !mb-0`}>
                    <SectionBar />
                    Biểu đồ thống kê theo tích hợp
                  </h2>
                  <p className="text-[12px] text-[#64748B] mt-1">
                    So sánh số lượng dữ liệu tích hợp / xử lý / chia sẻ theo dung lượng (GB)
                  </p>
                </div>

                {/* Tab Content Container with Consistent Height */}
                <div ref={chartContentRef} className="flex-1 flex flex-col justify-center min-h-[420px] bg-white">
                  {filteredIntegrationData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center min-h-[400px]">
                      <Filter className="w-8 h-8 text-[#CBD5E1] mb-2" />
                      <p className="text-[13px] font-medium text-[#020817]">Không có dữ liệu phù hợp với bộ lọc đã chọn</p>
                      <p className="text-[12px] text-[#64748B] mt-1">Vui lòng điều chỉnh lại tiêu chí lọc ở trên</p>
                    </div>
                  ) : (
                  <>
                  {activeChartTab === 'chart' && (
                    <div>
                      {chartDisplayData.length === 0 ? (
                        <div className="flex items-center justify-center h-[300px] text-[13px] text-[#64748B]">
                          Chọn ít nhất một hạng mục dữ liệu để hiển thị
                        </div>
                      ) : (
                        <div className="w-full overflow-x-auto custom-scrollbar">
                          <div style={{ height: '500px', minWidth: `${chartDisplayData.length * 50 + 40}px` }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={chartDisplayData}
                                barCategoryGap="2%"
                                margin={{ top: 30, right: 20, left: 10, bottom: 100 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                  dataKey="name"
                                  stroke="#CBD5E1"
                                  tick={AXIS_TICK}
                                  interval={0}
                                  angle={-35}
                                  textAnchor="end"
                                  height={100}
                                />
                                <YAxis type="number" tickFormatter={formatNumber} stroke="#CBD5E1" tick={AXIS_TICK} />
                                <Tooltip
                                  formatter={(value: number) => [formatNumber(value), activeMetricConfig.label]}
                                  contentStyle={CHART_TOOLTIP_STYLE}
                                  labelStyle={{ color: '#020817', fontWeight: 500 }}
                                  cursor={{ fill: '#F8FAFC' }}
                                />
                                <Bar
                                  dataKey={chartMetric}
                                  fill={activeMetricConfig.color}
                                  name={activeMetricConfig.label}
                                  barSize={22}
                                  radius={[4, 4, 0, 0]}
                                  label={{
                                    position: 'top',
                                    formatter: formatNumber,
                                    fill: '#475569',
                                    fontSize: 12,
                                    fontWeight: '500'
                                  }}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeChartTab === 'table' && (
                    <div className={`${TABLE_WRAP_CLS} w-full`}>
                      <div className="overflow-auto custom-scrollbar" style={{ maxHeight: '420px', minHeight: '400px' }}>
                        <table className="w-full border-collapse">
                          <thead className={`${TABLE_HEAD_BG} sticky top-0 z-10`}>
                            <tr className={TABLE_HEAD_ROW_CLS}>
                              <th className={`${TH} text-left`}>Hạng mục dữ liệu</th>
                              <th className={`${TH} text-right`}>Đã tích hợp</th>
                              <th className={`${TH} text-right`}>Đã xử lý</th>
                              <th className={`${TH} text-right`}>Chia sẻ đi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredIntegrationData.map((row, idx) => (
                              <tr key={idx} className={TR}>
                                <td className={`${TD} text-left max-w-[320px]`}><TruncatedText text={row.name} /></td>
                                <td className={`${TD} text-right tabular-nums whitespace-nowrap`}>{formatNumber(row.integrated)}</td>
                                <td className={`${TD} text-right tabular-nums whitespace-nowrap`}>{formatNumber(row.processed)}</td>
                                <td className={`${TD} text-right tabular-nums whitespace-nowrap`}>{formatNumber(row.shared)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Display Customization Sidebar */}
            <div className={`${CARD_CLS} flex flex-col justify-between`} style={{ flex: '3 1 0%', minWidth: 0 }}>
              <div className="space-y-6">
                <div>
                  <h2 className={`${SECTION_TITLE} !mb-0`}>
                    <SectionBar />
                    Tùy chỉnh hiển thị
                  </h2>
                  <p className="text-[12px] text-[#64748B] mt-1">Chuyển chế độ xem và ẩn/hiện nhãn số liệu</p>
                </div>

                {/* Chế độ hiển thị — tab mục 5.9 */}
                <div>
                  <div className={LABEL_CLS}>Chế độ hiển thị</div>
                  <div role="tablist" aria-label="Chế độ hiển thị" className="flex border-b border-[#E2E8F0]">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeChartTab === 'chart'}
                      onClick={() => setActiveChartTab('chart')}
                      className={`${tabClass(activeChartTab === 'chart')} ${BTN_FOCUS} flex-1 justify-center`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      Biểu đồ
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeChartTab === 'table'}
                      onClick={() => setActiveChartTab('table')}
                      className={`${tabClass(activeChartTab === 'table')} ${BTN_FOCUS} flex-1 justify-center`}
                    >
                      <Table2 className="w-4 h-4" />
                      Dạng bảng
                    </button>
                  </div>
                </div>

                {/* Lọc theo khoảng ngày kết nối - áp dụng cho cả Biểu đồ và Dạng bảng */}
                <div>
                  <div className={LABEL_CLS}>Khoảng ngày kết nối</div>
                  {/* Một hàng: Từ — đến — Đến — nút X (không xuống dòng) */}
                  <div className="flex items-center gap-2">
                    <DateInput
                      value={dateRange.from}
                      onChange={(iso) => setDateRange(prev => ({ ...prev, from: iso }))}
                      ariaLabel="Từ ngày kết nối"
                      max={dateRange.to || undefined}
                      className="flex-1 min-w-0"
                    />
                    <span className="shrink-0 text-[13px] text-[#64748B]">đến</span>
                    <DateInput
                      value={dateRange.to}
                      onChange={(iso) => setDateRange(prev => ({ ...prev, to: iso }))}
                      ariaLabel="Đến ngày kết nối"
                      min={dateRange.from || undefined}
                      className="flex-1 min-w-0"
                    />
                    {(dateRange.from || dateRange.to) && (
                      <button
                        type="button"
                        onClick={() => setDateRange({ from: '', to: '' })}
                        className={`${BTN_GHOST_ICON} shrink-0`}
                        title="Bỏ lọc thời gian"
                        aria-label="Bỏ lọc thời gian"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {activeChartTab === 'chart' && (
                  <>
                    {/* Chọn chỉ tiêu hiển thị */}
                    <div>
                      <div className={LABEL_CLS}>Chỉ tiêu hiển thị</div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {INTEGRATION_METRIC_CONFIG.map(option => {
                          const isActive = chartMetric === option.key;
                          return (
                            <button
                              type="button"
                              key={option.key}
                              aria-pressed={isActive}
                              onClick={() => setChartMetric(option.key)}
                              className={`h-10 px-2 inline-flex items-center justify-center gap-1.5 rounded-lg border text-[13px] transition-colors ${BTN_FOCUS} ${
                                isActive
                                  ? 'bg-[#EAF3FF] border-[#BFDBFE] text-blue-600 font-medium'
                                  : 'bg-white border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] hover:text-[#020817]'
                              }`}
                            >
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: option.color }} />
                              <span className="truncate">{option.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chọn hạng mục dữ liệu tích hợp hiển thị */}
                    <div>
                      <div className={LABEL_CLS}>Hạng mục dữ liệu</div>
                      {/* relative: giữ ô tích sr-only (position:absolute) trong khung cuộn, tránh kéo dài trang */}
                      <div className="relative flex flex-wrap gap-2 max-h-[220px] overflow-y-auto custom-scrollbar p-0.5 pr-1">
                        {integrationData.map((item, index) => {
                          const isChecked = selectedIntegrationItems.includes(item.name);
                          const color = INTEGRATION_ITEM_COLORS[index % INTEGRATION_ITEM_COLORS.length];
                          return (
                            <label
                              key={item.name}
                              className={`inline-flex items-center gap-1.5 h-[26px] px-2 max-w-full min-w-0 rounded-2xl border text-[13px] cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-blue-600 ${
                                isChecked
                                  ? 'border-[#CBD5E1] bg-white text-[#020817] hover:bg-[#F8FAFC]'
                                  : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] hover:text-[#475569]'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleIntegrationItem(item.name)}
                                className="sr-only"
                              />
                              <span
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: isChecked ? color : '#CBD5E1' }}
                              />
                              {/* Tên dài: cắt "…" trên 1 dòng, hover hiện đầy đủ (mục 5.3.1) */}
                              <TruncatedText text={item.name} className="min-w-0" />
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="space-y-6">
          {/* Monthly Data Table */}
          <div className={TABLE_WRAP_CLS}>
            <div className="px-4 py-3 border-b border-[#E2E8F0]">
              <h2 className={`${SECTION_TITLE} !mb-0`}><SectionBar />Dữ liệu thống kê theo tháng - Năm 2024</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className={TABLE_HEAD_BG}>
                  <tr className={TABLE_HEAD_ROW_CLS}>
                    <th className={`${TH} text-left`}>Tháng</th>
                    <th className={`${TH} text-right`}>Tổng số</th>
                    <th className={`${TH} text-right`}>Thành công</th>
                    <th className={`${TH} text-right`}>Thất bại</th>
                    <th className={`${TH} text-right`}>Tỷ lệ</th>
                    <th className={`${TH} text-center`}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((row, index) => {
                    const rate = ((row.success / row.total) * 100).toFixed(1);
                    return (
                      <tr key={index} className={TR}>
                        <td className={`${TD} text-left`}>{row.name}</td>
                        <td className={`${TD} text-right tabular-nums`}>{row.total.toLocaleString()}</td>
                        <td className={`${TD} text-right tabular-nums`}>{row.success.toLocaleString()}</td>
                        <td className={`${TD} text-right tabular-nums`}>{row.failed.toLocaleString()}</td>
                        <td className={`${TD} text-right`}>
                          <Badge label={`${rate}%`} variant={rateVariant(parseFloat(rate))} />
                        </td>
                        <td className={`${TD} text-center`}>
                          <RowIconAction label="Xem chi tiết" onClick={() => handleViewDetail(row)}>
                            <Eye className="w-4 h-4" />
                          </RowIconAction>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-[#F8FAFC] border-t border-[#E2E8F0]">
                  <tr className="h-12">
                    <td className={`${TD} text-left font-medium`}>Tổng cộng</td>
                    <td className={`${TD} text-right tabular-nums font-medium`}>{totalRecords.toLocaleString()}</td>
                    <td className={`${TD} text-right tabular-nums font-medium`}>{totalSuccess.toLocaleString()}</td>
                    <td className={`${TD} text-right tabular-nums font-medium`}>{totalFailed.toLocaleString()}</td>
                    <td className={`${TD} text-right`}>
                      <Badge label={`${successRate}%`} variant="blue" />
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Source Data Table */}
          <div className={TABLE_WRAP_CLS}>
            <div className="px-4 py-3 border-b border-[#E2E8F0]">
              <h2 className={`${SECTION_TITLE} !mb-0`}><SectionBar />Dữ liệu thống kê theo nguồn</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className={TABLE_HEAD_BG}>
                  <tr className={TABLE_HEAD_ROW_CLS}>
                    <th className={`${TH} text-left`}>Nguồn dữ liệu</th>
                    <th className={`${TH} text-right`}>Tổng số</th>
                    <th className={`${TH} text-right`}>Thành công</th>
                    <th className={`${TH} text-right`}>Thất bại</th>
                    <th className={`${TH} text-right`}>Tỷ lệ</th>
                    <th className={`${TH} text-center`}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {sourceData.map((row, index) => {
                    const rate = ((row.success / row.total) * 100).toFixed(1);
                    return (
                      <tr key={index} className={TR}>
                        <td className={`${TD} text-left max-w-[320px]`}><TruncatedText text={row.name} /></td>
                        <td className={`${TD} text-right tabular-nums`}>{row.total.toLocaleString()}</td>
                        <td className={`${TD} text-right tabular-nums`}>{row.success.toLocaleString()}</td>
                        <td className={`${TD} text-right tabular-nums`}>{row.failed.toLocaleString()}</td>
                        <td className={`${TD} text-right`}>
                          <Badge label={`${rate}%`} variant={rateVariant(parseFloat(rate))} />
                        </td>
                        <td className={`${TD} text-center`}>
                          <RowIconAction label="Xem chi tiết" onClick={() => handleViewDetail(row)}>
                            <Eye className="w-4 h-4" />
                          </RowIconAction>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal — modal Xem chi tiết: chiều cao cố định, thân tự cuộn (mục 5.4) */}
      {showDetailModal && selectedDetail && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="stat-detail-title" className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full h-[90vh] max-h-[800px] flex flex-col overflow-hidden">
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-start justify-between gap-4">
              <div>
                <h3 id="stat-detail-title" className={MODAL_TITLE}>Chi tiết chỉ tiêu thống kê</h3>
                <p className="text-[13px] text-[#64748B] mt-0.5">{selectedDetail.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className={BTN_GHOST_ICON}
                title="Đóng"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
              {/* Summary Cards (mục 5.6.1) */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                  <div className="text-[16px] text-[#64748B]">Tổng số bản ghi</div>
                  <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{selectedDetail.total.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                  <div className="text-[16px] text-[#64748B]">Thành công</div>
                  <div className="text-[16px] font-semibold text-[#16A34A] tabular-nums">{selectedDetail.success.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                  <div className="text-[16px] text-[#64748B]">Thất bại</div>
                  <div className="text-[16px] font-semibold text-[#DC2626] tabular-nums">{selectedDetail.failed.toLocaleString()}</div>
                </div>
              </div>

              {/* Detailed Info */}
              <div>
                <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]">
                  <span className={FIELD_LABEL}>Tỷ lệ thành công:</span>
                  <span className={`${FIELD_VALUE} tabular-nums`}>
                    {((selectedDetail.success / selectedDetail.total) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]">
                  <span className={FIELD_LABEL}>Tỷ lệ thất bại:</span>
                  <span className={`${FIELD_VALUE} tabular-nums`}>
                    {((selectedDetail.failed / selectedDetail.total) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]">
                  <span className={FIELD_LABEL}>Trạng thái:</span>
                  {(selectedDetail.success / selectedDetail.total) >= 0.95
                    ? <Badge label="Tốt" variant="green" />
                    : <Badge label="Cần cải thiện" variant="amber" />}
                </div>
              </div>

              {/* Chart in Modal */}
              <div>
                <h4 className={`${GROUP_TITLE} mb-3`}>Biểu đồ phân bổ</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Thành công', value: selectedDetail.success, color: '#16A34A' },
                        { name: 'Thất bại', value: selectedDetail.failed, color: '#DC2626' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      dataKey="value"
                      style={{ fontSize: 12 }}
                    >
                      <Cell fill="#16A34A" />
                      <Cell fill="#DC2626" />
                    </Pie>
                    <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={MODAL_FOOTER}>
              <button type="button" onClick={() => setShowDetailModal(false)} className={BTN_OUTLINE}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction 8: History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowHistoryModal(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="stat-history-title" className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <h3 id="stat-history-title" className={MODAL_TITLE}>Lịch sử truy cập & thao tác biểu đồ</h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className={BTN_GHOST_ICON}
                title="Đóng"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4">
              <div className={TABLE_WRAP_CLS}>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className={TABLE_HEAD_BG}>
                      <tr className={TABLE_HEAD_ROW_CLS}>
                        <th className={`${TH} text-left`}>Thời gian</th>
                        <th className={`${TH} text-left`}>Tài khoản</th>
                        <th className={`${TH} text-left`}>Họ và tên</th>
                        <th className={`${TH} text-left`}>Thao tác thực hiện</th>
                        <th className={`${TH} text-left`}>Địa chỉ IP</th>
                        <th className={`${TH} text-left`}>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAccessLogs.map((log) => {
                        const ts = splitTimestamp(log.timestamp);
                        return (
                          <tr key={log.id} className={TR}>
                            <td className={`${TD} text-left whitespace-nowrap tabular-nums leading-4`}>
                              <div>{ts.date}</div>
                              <div>{ts.time}</div>
                            </td>
                            <td className={`${TD} text-left whitespace-nowrap`}>{log.username}</td>
                            <td className={`${TD} text-left max-w-[180px]`}><TruncatedText text={log.fullName} /></td>
                            <td className={`${TD} text-left max-w-[300px]`}><TruncatedText text={log.action} /></td>
                            <td className={`${TD} text-left whitespace-nowrap tabular-nums`}>{log.ipAddress}</td>
                            <td className={`${TD} text-left`}>
                              <Badge label="Thành công" variant="green" />
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
              <button type="button" onClick={() => setShowHistoryModal(false)} className={BTN_OUTLINE}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction 6: All Details Modal */}
      {showAllDetailsModal && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAllDetailsModal(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="stat-all-details-title" className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <h3 id="stat-all-details-title" className={MODAL_TITLE}>Số liệu chi tiết các chỉ tiêu CSDL tích hợp</h3>
              <button
                type="button"
                onClick={() => setShowAllDetailsModal(false)}
                className={BTN_GHOST_ICON}
                title="Đóng"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
              {/* Summary cards (mục 5.6.1) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex items-center gap-3">
                  <span className="w-3 h-3 bg-[#16A34A] rounded-full shrink-0" />
                  <div>
                    <div className="text-[13px] text-[#64748B]">{"Chỉ tiêu Đạt chuẩn (>=95%)"}</div>
                    <div className="text-[16px] font-semibold text-[#0F172A]">6 / 9 chỉ tiêu</div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex items-center gap-3">
                  <span className="w-3 h-3 bg-[#CA8A04] rounded-full shrink-0" />
                  <div>
                    <div className="text-[13px] text-[#64748B]">Chỉ tiêu Cảnh báo (90% - 95%)</div>
                    <div className="text-[16px] font-semibold text-[#0F172A]">2 / 9 chỉ tiêu</div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex items-center gap-3">
                  <span className="w-3 h-3 bg-[#DC2626] rounded-full shrink-0" />
                  <div>
                    <div className="text-[13px] text-[#64748B]">{"Chỉ tiêu Nguy cơ (<90%)"}</div>
                    <div className="text-[16px] font-semibold text-[#0F172A]">1 / 9 chỉ tiêu</div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className={TABLE_WRAP_CLS}>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className={TABLE_HEAD_BG}>
                      <tr className={TABLE_HEAD_ROW_CLS}>
                        <th className={`${TH} text-center w-14`}>STT</th>
                        <th className={`${TH} text-left`}>Nguồn dữ liệu</th>
                        <th className={`${TH} text-left`}>Tên chỉ tiêu tích hợp</th>
                        <th className={`${TH} text-left`}>Đơn vị</th>
                        <th className={`${TH} text-right`}>Kế hoạch / Chỉ tiêu</th>
                        <th className={`${TH} text-right`}>Thực tế đạt được</th>
                        <th className={`${TH} text-right`}>Tỷ lệ</th>
                        <th className={`${TH} text-left`}>Đánh giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockIndicatorDetails.map((ind, index) => (
                        <tr key={ind.id} className={TR}>
                          <td className={`${TD} text-center tabular-nums`}>{index + 1}</td>
                          <td className={`${TD} text-left max-w-[200px]`}><TruncatedText text={ind.source} /></td>
                          <td className={`${TD} text-left max-w-[240px]`}><TruncatedText text={ind.indicatorName} /></td>
                          <td className={`${TD} text-left whitespace-nowrap`}>{ind.unit}</td>
                          <td className={`${TD} text-right tabular-nums whitespace-nowrap`}>{ind.targetValue.toLocaleString()}</td>
                          <td className={`${TD} text-right tabular-nums whitespace-nowrap`}>{ind.actualValue.toLocaleString()}</td>
                          <td className={`${TD} text-right tabular-nums whitespace-nowrap`}>{ind.rate.toFixed(1)}%</td>
                          <td className={`${TD} text-left`}>
                            <Badge
                              label={ind.status === 'good' ? 'Đạt' : ind.status === 'warning' ? 'Theo dõi' : 'Chậm'}
                              variant={ind.status === 'good' ? 'green' : ind.status === 'warning' ? 'amber' : 'red'}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className={MODAL_FOOTER}>
              <button type="button" onClick={() => setShowAllDetailsModal(false)} className={BTN_OUTLINE}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
