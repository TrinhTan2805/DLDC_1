import { useState } from 'react';
import { Search, Filter, Download, FileText, BarChart3, PieChart, TrendingUp, Calendar, Building2, Tag, FileType, Shield, Eye, MousePointer } from 'lucide-react';
import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OpenDataReportPageProps {
  onBack: () => void;
}

// Mock data for demonstration
const mockDatasets = [
  {
    id: 'DS001',
    name: 'Danh sách văn bản quy phạm pháp luật 2024',
    category: 'Văn bản pháp luật',
    agency: 'Bộ Tư pháp',
    format: 'JSON',
    license: 'CC BY 4.0',
    publishedDate: '2024-01-15',
    views: 1250,
    downloads: 340,
  },
  {
    id: 'DS002',
    name: 'Dữ liệu đăng ký kinh doanh Q1/2024',
    category: 'Đăng ký kinh doanh',
    agency: 'Cục Đăng ký kinh doanh',
    format: 'Excel',
    license: 'ODC-BY',
    publishedDate: '2024-02-10',
    views: 890,
    downloads: 220,
  },
  {
    id: 'DS003',
    name: 'Thống kê công chứng viên 2024',
    category: 'Công chứng',
    agency: 'Cục Công chứng',
    format: 'CSV',
    license: 'CC BY 4.0',
    publishedDate: '2024-03-05',
    views: 670,
    downloads: 180,
  },
  {
    id: 'DS004',
    name: 'Danh sách trung tâm TGPL',
    category: 'Trợ giúp pháp lý',
    agency: 'Cục TGPL',
    format: 'JSON',
    license: 'ODbL',
    publishedDate: '2024-01-20',
    views: 550,
    downloads: 140,
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

const accessTrends = [
  { month: 'T1', views: 4500, downloads: 1200 },
  { month: 'T2', views: 5200, downloads: 1450 },
  { month: 'T3', views: 6100, downloads: 1680 },
  { month: 'T4', views: 5800, downloads: 1520 },
  { month: 'T5', views: 6500, downloads: 1890 },
  { month: 'T6', views: 7200, downloads: 2100 },
];

const COLORS = ['#0ea5e9', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export function OpenDataReportPage({ onBack }: OpenDataReportPageProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'statistics' | 'classification' | 'access'>('search');
  
  // Search & Filter States
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAgency, setFilterAgency] = useState('all');
  const [filterFormat, setFilterFormat] = useState('all');
  const [filterLicense, setFilterLicense] = useState('all');
  
  // Statistics States
  const [statsGroupBy, setStatsGroupBy] = useState<'agency' | 'category' | 'license' | 'time'>('category');
  const [statsTimeRange, setStatsTimeRange] = useState('2024');
  
  // Classification States
  const [classifyBy, setClassifyBy] = useState<'source' | 'category' | 'format'>('category');
  
  // Access Stats States
  const [accessTimeRange, setAccessTimeRange] = useState('6months');
  const [accessMetric, setAccessMetric] = useState<'views' | 'downloads' | 'both'>('both');

  const filteredDatasets = mockDatasets.filter(dataset => {
    if (searchKeyword && !dataset.name.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    if (filterCategory !== 'all' && dataset.category !== filterCategory) return false;
    if (filterAgency !== 'all' && dataset.agency !== filterAgency) return false;
    if (filterFormat !== 'all' && dataset.format !== filterFormat) return false;
    if (filterLicense !== 'all' && dataset.license !== filterLicense) return false;
    return true;
  });

  const handleExportExcel = () => {
    alert('Xuất dữ liệu ra Excel');
  };

  const handleExportPDF = () => {
    alert('Xuất dữ liệu ra PDF');
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
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
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
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
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
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
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
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
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
        {/* Tab 1: Tìm kiếm và lọc */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Filter Panel */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Bộ lọc tìm kiếm
              </h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Từ khóa</label>
                  <input
                    type="text"
                    placeholder="Nhập từ khóa..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Chủ đề</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="Văn bản pháp luật">Văn bản pháp luật</option>
                    <option value="Đăng ký kinh doanh">Đăng ký kinh doanh</option>
                    <option value="Công chứng">Công chứng</option>
                    <option value="Trợ giúp pháp lý">Trợ giúp pháp lý</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Cơ quan công bố</label>
                  <select
                    value={filterAgency}
                    onChange={(e) => setFilterAgency(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="Bộ Tư pháp">Bộ Tư pháp</option>
                    <option value="Cục Đăng ký kinh doanh">Cục Đăng ký kinh doanh</option>
                    <option value="Cục Công chứng">Cục Công chứng</option>
                    <option value="Cục TGPL">Cục TGPL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Định dạng</label>
                  <select
                    value={filterFormat}
                    onChange={(e) => setFilterFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="JSON">JSON</option>
                    <option value="Excel">Excel</option>
                    <option value="CSV">CSV</option>
                    <option value="XML">XML</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Giấy phép</label>
                  <select
                    value={filterLicense}
                    onChange={(e) => setFilterLicense(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="CC BY 4.0">CC BY 4.0</option>
                    <option value="ODC-BY">ODC-BY</option>
                    <option value="ODbL">ODbL</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Search className="w-4 h-4" />
                    Tìm kiếm
                  </button>
                  <button 
                    onClick={() => {
                      setSearchKeyword('');
                      setFilterCategory('all');
                      setFilterAgency('all');
                      setFilterFormat('all');
                      setFilterLicense('all');
                    }}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                  >
                    Đặt lại
                  </button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Tìm thấy <span className="text-blue-600">{filteredDatasets.length}</span> kết quả
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleExportExcel}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Xuất Excel
                  </button>
                  <button 
                    onClick={handleExportPDF}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Xuất PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">Mã Dataset</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">Tên Dataset</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">Chủ đề</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">Cơ quan</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">Định dạng</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">Giấy phép</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">Ngày công bố</th>
                      <th className="px-4 py-3 text-right text-xs text-slate-600">Lượt xem</th>
                      <th className="px-4 py-3 text-right text-xs text-slate-600">Lượt tải</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredDatasets.map((dataset) => (
                      <tr key={dataset.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-900">{dataset.id}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{dataset.name}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                            {dataset.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{dataset.agency}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                            {dataset.format}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{dataset.license}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{dataset.publishedDate}</td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">{dataset.views.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">{dataset.downloads.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Báo cáo thống kê */}
        {activeTab === 'statistics' && (
          <div className="space-y-6">
            {/* Filter Panel */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Thiết lập báo cáo
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Nhóm theo</label>
                  <select
                    value={statsGroupBy}
                    onChange={(e) => setStatsGroupBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="category">Theo chủ đề</option>
                    <option value="agency">Theo cơ quan công bố</option>
                    <option value="license">Theo giấy phép</option>
                    <option value="time">Theo thời gian công bố</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Khoảng thời gian</label>
                  <select
                    value={statsTimeRange}
                    onChange={(e) => setStatsTimeRange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2024">Năm 2024</option>
                    <option value="2023">Năm 2023</option>
                    <option value="6months">6 tháng gần nhất</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Tạo báo cáo
                  </button>
                  <button title="Tải xuống" aria-label="Tải xuống" 
                    onClick={handleExportExcel}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Tổng Dataset</span>
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl text-slate-900">150</div>
                <div className="text-xs text-green-600 mt-1">+12% so với tháng trước</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Cơ quan công bố</span>
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl text-slate-900">25</div>
                <div className="text-xs text-green-600 mt-1">+3 cơ quan mới</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Chủ đề</span>
                  <Tag className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-2xl text-slate-900">18</div>
                <div className="text-xs text-slate-600 mt-1">Đa dạng lĩnh vực</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Định dạng</span>
                  <FileType className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl text-slate-900">8</div>
                <div className="text-xs text-slate-600 mt-1">JSON, Excel, CSV...</div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-slate-900 mb-4">
                Thống kê số lượng Dataset theo {
                  statsGroupBy === 'category' ? 'chủ đề' :
                  statsGroupBy === 'agency' ? 'cơ quan' :
                  statsGroupBy === 'license' ? 'giấy phép' :
                  'thời gian'
                }
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={statsGroupBy === 'category' ? statsByCategory : statsByAgency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={statsGroupBy === 'category' ? 'count' : 'datasets'} fill="#3b82f6" />
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
                      <th className="px-4 py-3 text-left text-xs text-slate-600">
                        {statsGroupBy === 'category' ? 'Chủ đề' : 'Cơ quan'}
                      </th>
                      <th className="px-4 py-3 text-right text-xs text-slate-600">Số lượng Dataset</th>
                      <th className="px-4 py-3 text-right text-xs text-slate-600">Tỷ lệ (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(statsGroupBy === 'category' ? statsByCategory : statsByAgency).map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-900">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">
                          {statsGroupBy === 'category' ? item.count : item.datasets}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">
                          {((statsGroupBy === 'category' ? item.count : item.datasets) / 150 * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Báo cáo phân loại */}
        {activeTab === 'classification' && (
          <div className="space-y-6">
            {/* Filter Panel */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-600" />
                Thiết lập phân loại
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Phân loại theo</label>
                  <select
                    value={classifyBy}
                    onChange={(e) => setClassifyBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="source">Theo nguồn cung cấp</option>
                    <option value="category">Theo chủ đề</option>
                    <option value="format">Theo định dạng dữ liệu</option>
                  </select>
                </div>

                <div className="flex items-end gap-2 col-span-2">
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                    <PieChart className="w-4 h-4" />
                    Tạo báo cáo phân loại
                  </button>
                  <button 
                    onClick={handleExportExcel}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Xuất Excel
                  </button>
                  <button 
                    onClick={handleExportPDF}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Xuất PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-slate-900 mb-4">
                  Biểu đồ phân bố theo {
                    classifyBy === 'source' ? 'nguồn cung cấp' :
                    classifyBy === 'category' ? 'chủ đề' :
                    'định dạng'
                  }
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={classifyBy === 'format' ? statsByFormat : statsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(classifyBy === 'format' ? statsByFormat : statsByCategory).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-slate-900 mb-4">Thống kê số lượng</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={classifyBy === 'format' ? statsByFormat : statsByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0ea5e9" />
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
                      <th className="px-4 py-3 text-left text-xs text-slate-600">
                        {classifyBy === 'source' ? 'Nguồn cung cấp' :
                         classifyBy === 'category' ? 'Chủ đề' :
                         'Định dạng'}
                      </th>
                      <th className="px-4 py-3 text-right text-xs text-slate-600">Số lượng</th>
                      <th className="px-4 py-3 text-right text-xs text-slate-600">Tỷ lệ (%)</th>
                      <th className="px-4 py-3 text-right text-xs text-slate-600">Lượt xem</th>
                      <th className="px-4 py-3 text-right text-xs text-slate-600">Lượt tải</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(classifyBy === 'format' ? statsByFormat : statsByCategory).map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-900">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">{item.value}</td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">
                          {(item.value / 150 * 100).toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">
                          {(Math.random() * 5000 + 1000).toFixed(0)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">
                          {(Math.random() * 1000 + 200).toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Thống kê lượt truy cập */}
        {activeTab === 'access' && (
          <div className="space-y-6">
            {/* Filter Panel */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Thiết lập báo cáo truy cập
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Khoảng thời gian</label>
                  <select
                    value={accessTimeRange}
                    onChange={(e) => setAccessTimeRange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7days">7 ngày gần nhất</option>
                    <option value="1month">1 tháng gần nhất</option>
                    <option value="3months">3 tháng gần nhất</option>
                    <option value="6months">6 tháng gần nhất</option>
                    <option value="1year">1 năm gần nhất</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Chỉ số</label>
                  <select
                    value={accessMetric}
                    onChange={(e) => setAccessMetric(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="both">Lượt xem và tải</option>
                    <option value="views">Chỉ lượt xem</option>
                    <option value="downloads">Chỉ lượt tải</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Tạo báo cáo
                  </button>
                  <button title="Hành động" aria-label="Hành động" 
                    onClick={handleExportPDF}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Tổng lượt xem</span>
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl text-slate-900">35,320</div>
                <div className="text-xs text-green-600 mt-1">+18% so với kỳ trước</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Tổng lượt tải</span>
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl text-slate-900">8,860</div>
                <div className="text-xs text-green-600 mt-1">+22% so với kỳ trước</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Người dùng hoạt động</span>
                  <MousePointer className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-2xl text-slate-900">2,450</div>
                <div className="text-xs text-green-600 mt-1">+15% so với kỳ trước</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Tỷ lệ chuyển đổi</span>
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl text-slate-900">25.1%</div>
                <div className="text-xs text-green-600 mt-1">+3.2% so với kỳ trước</div>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-slate-900 mb-4">Xu hướng truy cập theo thời gian</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={accessTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {(accessMetric === 'both' || accessMetric === 'views') && (
                    <Line type="monotone" dataKey="views" stroke="#0ea5e9" strokeWidth={2} name="Lượt xem" />
                  )}
                  {(accessMetric === 'both' || accessMetric === 'downloads') && (
                    <Line type="monotone" dataKey="downloads" stroke="#3b82f6" strokeWidth={2} name="Lượt tải" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Top Datasets */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-slate-900">Top Dataset được truy cập nhiều nhất</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">Thứ hạng</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">Tên Dataset</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">Chủ đề</th>
                      <th className="px-4 py-3 text-right text-xs text-slate-600">Lượt xem</th>
                      <th className="px-4 py-3 text-right text-xs text-slate-600">Lượt tải</th>
                      <th className="px-4 py-3 text-right text-xs text-slate-600">Tỷ lệ chuyển đổi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {mockDatasets.map((dataset, index) => (
                      <tr key={dataset.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-slate-100 text-slate-700' :
                            index === 2 ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-50 text-slate-600'
                          }`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900">{dataset.name}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                            {dataset.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">{dataset.views.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">{dataset.downloads.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">
                          {((dataset.downloads / dataset.views) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-slate-900">Nhật ký hoạt động gần đây</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">Xem tất cả</button>
              </div>
              <div className="divide-y divide-slate-200">
                {[
                  { action: 'Xem dataset', user: 'Người dùng #1234', dataset: 'Danh sách văn bản QPPL 2024', time: '5 phút trước' },
                  { action: 'Tải xuống', user: 'Người dùng #5678', dataset: 'Dữ liệu đăng ký kinh doanh Q1/2024', time: '12 phút trước' },
                  { action: 'Xem dataset', user: 'Người dùng #9012', dataset: 'Thống kê công chứng viên 2024', time: '23 phút trước' },
                  { action: 'Tải xuống', user: 'Người dùng #3456', dataset: 'Danh sách trung tâm TGPL', time: '35 phút trước' },
                ].map((log, index) => (
                  <div key={index} className="px-6 py-3 hover:bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          log.action === 'Tải xuống' ? 'bg-green-50' : 'bg-blue-50'
                        }`}>
                          {log.action === 'Tải xuống' ? (
                            <Download className="w-4 h-4 text-green-600" />
                          ) : (
                            <Eye className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm text-slate-900">
                            <span className="font-medium">{log.user}</span> đã {log.action.toLowerCase()}{' '}
                            <span className="font-medium">"{log.dataset}"</span>
                          </div>
                          <div className="text-xs text-slate-500">{log.time}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}