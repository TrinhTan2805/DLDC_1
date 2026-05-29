import { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Filter,
  Table2,
  Eye,
  Image as ImageIcon,
  Calendar,
  TrendingUp,
  Database,
  Users,
  Activity,
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
  Legend,
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
}

const integrationData: IntegrationStats[] = [
  { name: 'Cơ sở dữ liệu Quốc gia', integrated: 9800000, processed: 0, shared: 0 },
  { name: 'Doanh nghiệp', integrated: 845000, processed: 842300, shared: 612400 },
  { name: 'Đất đai', integrated: 5300000, processed: 5200000, shared: 3100000 },
  { name: 'Bảo hiểm y tế', integrated: 8900000, processed: 8900000, shared: 7300000 },
  { name: 'Hộ tịch điện tử', integrated: 2100000, processed: 2100000, shared: 1400000 },
  { name: 'Giáo dục phổ thông', integrated: 3700000, processed: 3600000, shared: 2200000 },
  { name: 'Thuế cá nhân', integrated: 6400000, processed: 6000000, shared: 4100000 },
  { name: 'Khám chữa bệnh', integrated: 4500000, processed: 4500000, shared: 3000000 },
  { name: 'Đăng ký kinh doanh', integrated: 1200000, processed: 1200000, shared: 980000 },
  { name: 'Trường ĐH-CĐ', integrated: 980000, processed: 970000, shared: 540000 }
];

const formatNumber = (value: number) => {
  if (value === 0) return '0';
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace('.0', '')} Tr`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace('.0', '')} N`;
  }
  return value.toLocaleString();
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
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-12-31' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [minRecords, setMinRecords] = useState<number | ''>('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<StatisticsData | null>(null);

  // States for Transaction 3, 6, 8
  const [showDataLabels, setShowDataLabels] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAllDetailsModal, setShowAllDetailsModal] = useState(false);

  // States for integration statistics chart (matching the user's uploaded image)
  const [showIntegrated, setShowIntegrated] = useState(true);
  const [showProcessed, setShowProcessed] = useState(true);
  const [showShared, setShowShared] = useState(true);
  const [activeChartTab, setActiveChartTab] = useState<'chart' | 'structure' | 'table'>('chart');

  const units = [
    'Tất cả đơn vị',
    'Bộ Tư pháp',
    'Cục Công nghệ thông tin',
    'Cục Hộ tịch, quốc tịch, chứng thực',
    'Cục Trợ giúp pháp lý',
    'Cục Đăng ký quốc gia giao dịch bảo đảm'
  ];

  const handleExportReport = () => {
    alert('Đang xuất báo cáo thống kê...');
  };

  const handleDownloadChart = () => {
    alert('Đang tải biểu đồ về máy...');
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
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm shadow-sm"
              title="Tải biểu đồ"
            >
              <Download className="w-4 h-4" />
              Tải xuống
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Tổng bản ghi</div>
              <div className="text-2xl text-slate-900">{totalRecords.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Thành công</div>
              <div className="text-2xl text-green-600">{totalSuccess.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Thất bại</div>
              <div className="text-2xl text-red-600">{totalFailed.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Tỷ lệ thành công</div>
              <div className="text-2xl text-purple-600">{successRate}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <h3 className="text-slate-900">Bộ lọc thống kê</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Unit Filter */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">Lọc theo đơn vị</label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">Từ ngày kết nối</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">Đến ngày kết nối</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="success">Hoạt động ổn định</option>
              <option value="warning">Cảnh báo / Lỗi nhẹ</option>
              <option value="critical">Sự cố nghiêm trọng</option>
            </select>
          </div>

          {/* Minimum Records Filter */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">Số bản ghi tối thiểu</label>
            <input
              type="number"
              placeholder="Nhập số bản ghi..."
              value={minRecords}
              onChange={(e) => setMinRecords(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>


      {/* Chart View */}
      {viewMode === 'chart' && (
        <div className="space-y-6">
          {/* Main Chart */}
          {/* Main Chart Panel & Customization Side Panel */}
          <div className="flex flex-row w-full items-stretch" style={{ gap: '1.5rem' }}>
            {/* Left Chart/Table Panel */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm" style={{ flex: '7 1 0%', minWidth: 0 }}>
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-slate-900 font-bold text-lg m-0">
                      Biểu đồ thống kê theo tích hợp
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 font-normal">
                      So sánh số lượng dữ liệu tích hợp / xử lý / chia sẻ
                    </p>
                  </div>

                  {/* Inner Tab Controls */}
                  <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setActiveChartTab('chart')}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        activeChartTab === 'chart'
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      📈 Biểu đồ
                    </button>
                    <button
                      onClick={() => setActiveChartTab('structure')}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        activeChartTab === 'structure'
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      🍩 Cơ cấu
                    </button>
                    <button
                      onClick={() => setActiveChartTab('table')}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        activeChartTab === 'table'
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      📋 Dạng bảng
                    </button>
                  </div>
                </div>

                {/* Tab Content Container with Consistent Height */}
                <div className="mt-4 flex-1 flex flex-col justify-center min-h-[420px]">
                  {activeChartTab === 'chart' && (
                    <div className="w-full overflow-y-auto pr-2" style={{ maxHeight: '420px', minHeight: '400px' }}>
                      <div style={{ height: `${integrationData.length * 75 + 60}px` }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={integrationData}
                            layout="vertical"
                            margin={{ top: 10, right: 40, left: 130, bottom: 10 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                            <XAxis type="number" tickFormatter={formatNumber} stroke="#94a3b8" fontSize={11} />
                            <YAxis
                              type="category"
                              dataKey="name"
                              width={130}
                              stroke="#94a3b8"
                              fontSize={11}
                              tick={{ fill: '#334155' }}
                            />
                            <Tooltip
                              formatter={(value: number) => [formatNumber(value), '']}
                              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                            {showIntegrated && (
                              <Bar
                                dataKey="integrated"
                                fill="#ea580c"
                                name="Đã tích hợp"
                                barSize={14}
                                radius={[0, 4, 4, 0]}
                                label={
                                  showDataLabels
                                    ? {
                                        position: 'right',
                                        formatter: formatNumber,
                                        fill: '#475569',
                                        fontSize: 10,
                                        fontWeight: '600'
                                      }
                                    : false
                                }
                              />
                            )}
                            {showProcessed && (
                              <Bar
                                dataKey="processed"
                                fill="#0d9488"
                                name="Đã xử lý"
                                barSize={14}
                                radius={[0, 4, 4, 0]}
                                label={
                                  showDataLabels
                                    ? {
                                        position: 'right',
                                        formatter: formatNumber,
                                        fill: '#475569',
                                        fontSize: 10,
                                        fontWeight: '600'
                                      }
                                    : false
                                }
                              />
                            )}
                            {showShared && (
                              <Bar
                                dataKey="shared"
                                fill="#1e293b"
                                name="Chia sẻ đi"
                                barSize={14}
                                radius={[0, 4, 4, 0]}
                                label={
                                  showDataLabels
                                    ? {
                                        position: 'right',
                                        formatter: formatNumber,
                                        fill: '#475569',
                                        fontSize: 10,
                                        fontWeight: '600'
                                      }
                                    : false
                                }
                              />
                            )}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {activeChartTab === 'structure' && (
                    <div className="flex flex-col items-center justify-center py-4 w-full h-full min-h-[400px]">
                      <h4 className="text-slate-700 font-semibold mb-4 text-sm">Cơ cấu tổng lượng dữ liệu tích hợp toàn hệ thống</h4>
                      <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Đã tích hợp', value: integrationData.reduce((sum, item) => sum + item.integrated, 0), color: '#ea580c' },
                              { name: 'Đã xử lý', value: integrationData.reduce((sum, item) => sum + item.processed, 0), color: '#0d9488' },
                              { name: 'Chia sẻ đi', value: integrationData.reduce((sum, item) => sum + item.shared, 0), color: '#1e293b' }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={(entry) => `${entry.name}: ${formatNumber(entry.value)}`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#ea580c" />
                            <Cell fill="#0d9488" />
                            <Cell fill="#1e293b" />
                          </Pie>
                          <Tooltip formatter={(value: number) => [formatNumber(value), '']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
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
                          {integrationData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                              <td className="px-4 py-3 text-right text-orange-700 font-semibold">{formatNumber(row.integrated)}</td>
                              <td className="px-4 py-3 text-right text-teal-700 font-semibold">{formatNumber(row.processed)}</td>
                              <td className="px-4 py-3 text-right text-slate-800 font-semibold">{formatNumber(row.shared)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Display Customization Sidebar */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm" style={{ flex: '3 1 0%', minWidth: 0 }}>
              <div className="space-y-6">
                <div>
                  <h4 className="text-slate-900 font-bold text-base m-0">Tùy chỉnh hiển thị</h4>
                  <p className="text-xs text-slate-500 mt-1 font-normal">Ẩn/hiện chuỗi số liệu và nhãn</p>
                </div>

                {/* Series Switches */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Chuỗi dữ liệu</div>
                  
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-orange-600 block"></span>
                      <span className="text-sm font-semibold text-slate-700">Đã tích hợp</span>
                    </div>
                    <button
                      onClick={() => setShowIntegrated(!showIntegrated)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none ${
                        showIntegrated ? 'bg-orange-600' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${
                        showIntegrated ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-teal-600 block"></span>
                      <span className="text-sm font-semibold text-slate-700">Đã xử lý</span>
                    </div>
                    <button
                      onClick={() => setShowProcessed(!showProcessed)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none ${
                        showProcessed ? 'bg-teal-600' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${
                        showProcessed ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-slate-800 block"></span>
                      <span className="text-sm font-semibold text-slate-700">Chia sẻ đi</span>
                    </div>
                    <button
                      onClick={() => setShowShared(!showShared)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none ${
                        showShared ? 'bg-slate-800' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${
                        showShared ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100 my-4"></div>

                {/* Show Data Labels Switch */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Eye className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-semibold">Hiển thị số liệu trên biểu đồ</span>
                  </div>
                  <button
                    onClick={() => setShowDataLabels(!showDataLabels)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none ${
                      showDataLabels ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${
                      showDataLabels ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Bottom Tip Box */}
              <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2.5">
                <span className="text-blue-500 font-bold text-sm">ⓘ</span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium m-0">
                  Mẹo: bấm vào một dòng trong bảng để xem chi tiết chỉ tiêu của tích hợp đó.
                </p>
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