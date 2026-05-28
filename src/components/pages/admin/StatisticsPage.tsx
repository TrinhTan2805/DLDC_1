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
  X
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-12-31' });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<StatisticsData | null>(null);

  // States for Transaction 3, 6, 8
  const [showDataLabels, setShowDataLabels] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAllDetailsModal, setShowAllDetailsModal] = useState(false);

  const categories = [
    'Tất cả hạng mục',
    'Đăng ký kinh doanh',
    'Công chứng',
    'Trợ giúp pháp lý',
    'Văn bản pháp luật',
    'Hộ tịch'
  ];

  const handleExportReport = () => {
    alert('Đang xuất báo cáo thống kê...');
  };

  const handleDownloadChart = () => {
    alert('Đang tải biểu đồ về máy...');
  };

  const handleExportExcel = () => {
    alert('Đang xuất file Excel...');
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
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-slate-900 font-bold text-xl">Xem biểu đồ thống kê CSDL tích hợp</h2>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200"
              title="Xem lịch sử truy cập & thao tác"
            >
              <History className="w-4 h-4" />
              Lịch sử thao tác
            </button>
            <button
              onClick={() => setShowAllDetailsModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              title="Xem số liệu chi tiết các chỉ tiêu"
            >
              <Eye className="w-4 h-4" />
              Chi tiết chỉ tiêu
            </button>
            <button
              onClick={handleDownloadChart}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="Tải biểu đồ"
            >
              <ImageIcon className="w-4 h-4" />
              Tải biểu đồ
            </button>
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Xuất báo cáo"
            >
              <FileText className="w-4 h-4" />
              Xuất báo cáo
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">Lọc theo hạng mục</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">Từ ngày</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">Đến ngày</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Chart Type */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">Loại biểu đồ</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bar">Biểu đồ cột</option>
              <option value="line">Biểu đồ đường</option>
              <option value="pie">Biểu đồ tròn</option>
            </select>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('chart')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'chart'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Xem biểu đồ
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Table2 className="w-4 h-4" />
              Xem bảng dữ liệu
            </button>
          </div>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Chart View */}
      {viewMode === 'chart' && (
        <div className="space-y-6">
          {/* Main Chart */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-slate-900 font-semibold text-lg m-0">
                Thống kê dữ liệu thu thập theo tháng - Năm 2024
              </h3>
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={showDataLabels}
                  onChange={(e) => setShowDataLabels(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-700 select-none">Hiển thị số liệu trên biểu đồ</span>
              </label>
            </div>
            
            {chartType === 'bar' && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#3b82f6" name="Tổng số" label={showDataLabels ? { position: 'top', fill: '#475569', fontSize: 10 } : false} />
                  <Bar dataKey="success" fill="#10b981" name="Thành công" label={showDataLabels ? { position: 'top', fill: '#475569', fontSize: 10 } : false} />
                  <Bar dataKey="failed" fill="#ef4444" name="Thất bại" label={showDataLabels ? { position: 'top', fill: '#475569', fontSize: 10 } : false} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {chartType === 'line' && (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Tổng số" strokeWidth={2} label={showDataLabels ? { position: 'top', fill: '#475569', fontSize: 10 } : false} />
                  <Line type="monotone" dataKey="success" stroke="#10b981" name="Thành công" strokeWidth={2} label={showDataLabels ? { position: 'top', fill: '#475569', fontSize: 10 } : false} />
                  <Line type="monotone" dataKey="failed" stroke="#ef4444" name="Thất bại" strokeWidth={2} label={showDataLabels ? { position: 'top', fill: '#475569', fontSize: 10 } : false} />
                </LineChart>
              </ResponsiveContainer>
            )}

            {chartType === 'pie' && (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={moduleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={showDataLabels ? (entry) => `${entry.name}: ${entry.value}` : false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {moduleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Secondary Chart - By Source */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-slate-900 mb-6">
              Thống kê theo nguồn dữ liệu
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="success" fill="#10b981" name="Thành công" label={showDataLabels ? { position: 'top', fill: '#475569', fontSize: 10 } : false} />
                <Bar dataKey="failed" fill="#ef4444" name="Thất bại" label={showDataLabels ? { position: 'top', fill: '#475569', fontSize: 10 } : false} />
              </BarChart>
            </ResponsiveContainer>
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