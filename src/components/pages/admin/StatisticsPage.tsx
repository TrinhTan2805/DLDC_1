import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
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
  { key: 'integrated', label: 'Đã tích hợp', color: '#1d4ed8' },
  { key: 'processed', label: 'Đã xử lý', color: '#15803d' },
  { key: 'shared', label: 'Chia sẻ đi', color: '#6d28d9' },
];

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
    alert('Đang xuất báo cáo thống kê...');
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
      alert('Không thể tải biểu đồ, vui lòng thử lại.');
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
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-row items-center justify-between gap-4 flex-wrap md:flex-nowrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border border-slate-200 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm">
              <BarChart3 className="w-6 h-6 text-slate-700" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-slate-900 font-bold text-lg leading-tight">Thống kê CSDL tích hợp</h2>
              <p className="text-sm text-slate-500 font-normal mt-1 leading-relaxed">
                Tổng quan dữ liệu tích hợp, xử lý và chia sẻ giữa các hệ thống
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all font-medium text-sm shadow-sm"
              title="Xem lịch sử truy cập & thao tác"
            >
              <History className="w-4 h-4" />
              Lịch sử
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium text-sm shadow-sm"
              title="In báo cáo"
            >
              <Printer className="w-4 h-4" />
              In
            </button>
            <button
              onClick={handleDownloadChart}
              disabled={isDownloadingChart}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              title="Tải biểu đồ"
            >
              <Download className="w-4 h-4" />
              {isDownloadingChart ? 'Đang tải...' : 'Tải xuống'}
            </button>
          </div>
        </div>
      </div>

      {/* Chart View */}
      {viewMode === 'chart' && (
        <div className="space-y-6">
          {/* Main Chart */}
          {/* Main Chart Panel & Customization Side Panel */}
          <div className="flex flex-row w-full items-start" style={{ gap: '1.5rem' }}>
            {/* Left Chart/Table Panel */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm" style={{ flex: '7 1 0%', minWidth: 0 }}>
              <div>
                <div className="mb-6 border-b border-slate-100 pb-4">
                  <h3 className="text-slate-900 font-bold text-lg m-0">
                    Biểu đồ thống kê theo tích hợp
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 font-normal">
                    So sánh số lượng dữ liệu tích hợp / xử lý / chia sẻ theo dung lượng (GB)
                  </p>
                </div>

                {/* Tab Content Container with Consistent Height */}
                <div ref={chartContentRef} className="mt-4 flex-1 flex flex-col justify-center min-h-[420px] bg-white">
                  {filteredIntegrationData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 min-h-[400px]">
                      <Filter className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-sm font-medium">Không có dữ liệu phù hợp với bộ lọc đã chọn</p>
                      <p className="text-xs text-slate-400 mt-1">Vui lòng điều chỉnh lại tiêu chí lọc ở trên</p>
                    </div>
                  ) : (
                  <>
                  {activeChartTab === 'chart' && (
                    <div>
                      {chartDisplayData.length === 0 ? (
                        <div className="flex items-center justify-center h-[300px] text-slate-400 text-sm">
                          Chọn ít nhất một hạng mục dữ liệu để hiển thị
                        </div>
                      ) : (
                        <div className="w-full overflow-x-auto">
                          <div style={{ height: '500px', minWidth: `${chartDisplayData.length * 50 + 40}px` }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={chartDisplayData}
                                barCategoryGap="2%"
                                margin={{ top: 30, right: 20, left: 10, bottom: 100 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                  dataKey="name"
                                  stroke="#94a3b8"
                                  fontSize={11}
                                  tick={{ fill: '#334155' }}
                                  interval={0}
                                  angle={-35}
                                  textAnchor="end"
                                  height={100}
                                />
                                <YAxis type="number" tickFormatter={formatNumber} stroke="#94a3b8" fontSize={11} />
                                <Tooltip
                                  formatter={(value: number) => [formatNumber(value), activeMetricConfig.label]}
                                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1' }}
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
                                    fontSize: 10,
                                    fontWeight: '600'
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
                    <div className="overflow-x-auto rounded-lg border border-slate-200 w-full overflow-y-auto" style={{ maxHeight: '420px', minHeight: '400px' }}>
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-3 font-semibold text-slate-700">Hạng mục dữ liệu</th>
                            <th className="px-4 py-3 font-semibold text-slate-700 text-right">Đã tích hợp</th>
                            <th className="px-4 py-3 font-semibold text-slate-700 text-right">Đã xử lý</th>
                            <th className="px-4 py-3 font-semibold text-slate-700 text-right">Chia sẻ đi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredIntegrationData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                              <td className="px-4 py-3 text-right text-blue-500 font-semibold">{formatNumber(row.integrated)}</td>
                              <td className="px-4 py-3 text-right text-green-500 font-semibold">{formatNumber(row.processed)}</td>
                              <td className="px-4 py-3 text-right text-violet-500 font-semibold">{formatNumber(row.shared)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Display Customization Sidebar */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm" style={{ flex: '3 1 0%', minWidth: 0 }}>
              <div className="space-y-6">
                <div>
                  <h4 className="text-slate-900 font-bold text-base m-0">Tùy chỉnh hiển thị</h4>
                  <p className="text-xs text-slate-500 mt-1 font-normal">Chuyển chế độ xem và ẩn/hiện nhãn số liệu</p>
                </div>

                {/* Chế độ hiển thị */}
                <div>
                  <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Chế độ hiển thị</div>
                  <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setActiveChartTab('chart')}
                      className={`flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        activeChartTab === 'chart'
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      📈 Biểu đồ
                    </button>
                    <button
                      onClick={() => setActiveChartTab('table')}
                      className={`flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        activeChartTab === 'table'
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      📋 Dạng bảng
                    </button>
                  </div>
                </div>

                {/* Lọc theo khoảng ngày kết nối - áp dụng cho cả Biểu đồ và Dạng bảng */}
                <div>
                  <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Khoảng ngày kết nối</div>
                  <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1.5 flex-wrap">
                    <input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                      className="text-[12px] bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 flex-1 min-w-0"
                    />
                    <span className="text-slate-400 text-[12px]">đến</span>
                    <input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                      className="text-[12px] bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 flex-1 min-w-0"
                    />
                    {(dateRange.from || dateRange.to) && (
                      <button
                        onClick={() => setDateRange({ from: '', to: '' })}
                        className="text-[12px] text-slate-500 hover:text-slate-800 px-1"
                        title="Bỏ lọc thời gian"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {activeChartTab === 'chart' && (
                  <>
                    {/* Chọn chỉ tiêu hiển thị */}
                    <div>
                      <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Chỉ tiêu hiển thị</div>
                      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                        {INTEGRATION_METRIC_CONFIG.map(option => (
                          <button
                            key={option.key}
                            onClick={() => setChartMetric(option.key)}
                            className={`flex-1 px-2 py-1.5 text-[12px] rounded-md transition-colors ${
                              chartMetric === option.key
                                ? 'bg-white shadow-sm font-semibold'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                            style={chartMetric === option.key ? { color: option.color } : undefined}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chọn hạng mục dữ liệu tích hợp hiển thị */}
                    <div>
                      <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Hạng mục dữ liệu</div>
                      <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-1">
                        {integrationData.map((item, index) => {
                          const isChecked = selectedIntegrationItems.includes(item.name);
                          const color = INTEGRATION_ITEM_COLORS[index % INTEGRATION_ITEM_COLORS.length];
                          return (
                            <label
                              key={item.name}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[12px] cursor-pointer transition-colors ${
                                isChecked ? 'border-slate-300 bg-white' : 'border-slate-200 bg-slate-50 text-slate-400'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleIntegrationItem(item.name)}
                                className="hidden"
                              />
                              <span
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: isChecked ? color : '#cbd5e1' }}
                              />
                              <span className={isChecked ? 'text-slate-700' : 'text-slate-400'}>{item.name}</span>
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
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-slate-900">Dữ liệu thống kê theo tháng - Năm 2024</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                      Tháng
                    </th>
                    <th className="px-6 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">
                      Tổng số
                    </th>
                    <th className="px-6 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">
                      Thành công
                    </th>
                    <th className="px-6 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">
                      Thất bại
                    </th>
                    <th className="px-6 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">
                      Tỷ lệ
                    </th>
                    <th className="px-6 py-3 text-center text-xs text-slate-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {monthlyData.map((row, index) => {
                    const rate = ((row.success / row.total) * 100).toFixed(1);
                    return (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-slate-900">{row.name}</td>
                        <td className="px-6 py-4 text-sm text-right text-slate-900">
                          {row.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-green-600">
                          {row.success.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-red-600">
                          {row.failed.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                          <span className={`px-2.5 py-1 rounded-full text-xs ${
                            parseFloat(rate) >= 95
                              ? 'bg-green-100 text-green-700'
                              : parseFloat(rate) >= 90
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {rate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewDetail(row)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                  <tr>
                    <td className="px-6 py-4 text-sm text-slate-900">Tổng cộng</td>
                    <td className="px-6 py-4 text-sm text-right text-slate-900">
                      {totalRecords.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-green-600">
                      {totalSuccess.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-red-600">
                      {totalFailed.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        {successRate}%
                      </span>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Source Data Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-slate-900">Dữ liệu thống kê theo nguồn</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                      Nguồn dữ liệu
                    </th>
                    <th className="px-6 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">
                      Tổng số
                    </th>
                    <th className="px-6 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">
                      Thành công
                    </th>
                    <th className="px-6 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">
                      Thất bại
                    </th>
                    <th className="px-6 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">
                      Tỷ lệ
                    </th>
                    <th className="px-6 py-3 text-center text-xs text-slate-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sourceData.map((row, index) => {
                    const rate = ((row.success / row.total) * 100).toFixed(1);
                    return (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-slate-900">{row.name}</td>
                        <td className="px-6 py-4 text-sm text-right text-slate-900">
                          {row.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-green-600">
                          {row.success.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-red-600">
                          {row.failed.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                          <span className={`px-2.5 py-1 rounded-full text-xs ${
                            parseFloat(rate) >= 95
                              ? 'bg-green-100 text-green-700'
                              : parseFloat(rate) >= 90
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {rate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewDetail(row)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
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
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-slate-900">Chi tiết chỉ tiêu thống kê</h3>
                  <p className="text-sm text-slate-600 mt-0.5">{selectedDetail.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Download className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-xs text-slate-600 mb-1">Tổng số bản ghi</div>
                  <div className="text-2xl text-slate-900">{selectedDetail.total.toLocaleString()}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-xs text-green-600 mb-1">Thành công</div>
                  <div className="text-2xl text-green-600">{selectedDetail.success.toLocaleString()}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-xs text-red-600 mb-1">Thất bại</div>
                  <div className="text-2xl text-red-600">{selectedDetail.failed.toLocaleString()}</div>
                </div>
              </div>

              {/* Detailed Info */}
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Tỷ lệ thành công:</span>
                  <span className="text-sm text-green-600">
                    {((selectedDetail.success / selectedDetail.total) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Tỷ lệ thất bại:</span>
                  <span className="text-sm text-red-600">
                    {((selectedDetail.failed / selectedDetail.total) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Trạng thái:</span>
                  <span className={`text-sm px-2.5 py-1 rounded-full ${
                    (selectedDetail.success / selectedDetail.total) >= 0.95
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {(selectedDetail.success / selectedDetail.total) >= 0.95 ? 'Tốt' : 'Cần cải thiện'}
                  </span>
                </div>
              </div>

              {/* Chart in Modal */}
              <div>
                <h4 className="text-sm text-slate-900 mb-3">Biểu đồ phân bổ</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Thành công', value: selectedDetail.success, color: '#10b981' },
                        { name: 'Thất bại', value: selectedDetail.failed, color: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction 8: History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowHistoryModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-blue-600" />
                <h3 className="text-slate-900 font-semibold text-lg m-0">Lịch sử truy cập & thao tác biểu đồ</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Thời gian</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Tài khoản</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Họ và tên</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Thao tác thực hiện</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Địa chỉ IP</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockAccessLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{log.timestamp}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900">{log.username}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{log.fullName}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-block text-blue-700 bg-blue-50 px-2.5 py-1 rounded text-xs font-medium">{log.action}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500 font-mono">{log.ipAddress}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Thành công
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction 6: All Details Modal */}
      {showAllDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowAllDetailsModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-600" />
                <h3 className="text-slate-900 font-semibold text-lg m-0">Số liệu chi tiết các chỉ tiêu CSDL tích hợp</h3>
              </div>
              <button
                onClick={() => setShowAllDetailsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 shadow-sm flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <div>
                    <div className="text-xs text-emerald-700 font-medium">{"Chỉ tiêu Đạt chuẩn (>=95%)"}</div>
                    <div className="text-xl text-emerald-950 font-bold mt-0.5">6 / 9 chỉ tiêu</div>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 shadow-sm flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                  <div>
                    <div className="text-xs text-amber-700 font-medium">Chỉ tiêu Cảnh báo (90% - 95%)</div>
                    <div className="text-xl text-amber-950 font-bold mt-0.5">2 / 9 chỉ tiêu</div>
                  </div>
                </div>
                <div className="bg-rose-50 rounded-lg p-4 border border-rose-100 shadow-sm flex items-center gap-3">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <div>
                    <div className="text-xs text-rose-700 font-medium">{"Chỉ tiêu Nguy cơ (<90%)"}</div>
                    <div className="text-xl text-rose-950 font-bold mt-0.5">1 / 9 chỉ tiêu</div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase w-12 text-center">STT</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Nguồn dữ liệu</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Tên chỉ tiêu tích hợp</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase text-center w-24">Đơn vị</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase text-right w-36">Kế hoạch / Chỉ tiêu</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase text-right w-36">Thực tế đạt được</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase text-right w-36">Tỷ lệ</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase text-center w-28">Đánh giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockIndicatorDetails.map((ind, index) => (
                      <tr key={ind.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-slate-500 text-center">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800">{ind.source}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{ind.indicatorName}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 text-center">{ind.unit}</td>
                        <td className="px-4 py-3 text-sm text-slate-800 text-right font-mono">{ind.targetValue.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-800 text-right font-mono font-medium">{ind.actualValue.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-right font-mono font-semibold">
                          <span className={`${
                            ind.status === 'good' ? 'text-emerald-600' : ind.status === 'warning' ? 'text-amber-600' : 'text-rose-600'
                          }`}>
                            {ind.rate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            ind.status === 'good' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : ind.status === 'warning' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {ind.status === 'good' ? 'Đạt' : ind.status === 'warning' ? 'Theo dõi' : 'Chậm'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowAllDetailsModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}