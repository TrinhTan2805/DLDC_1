import { useState, ChangeEvent } from 'react';
import { Search, Filter, Download, FileText, BarChart3, PieChart, TrendingUp, Calendar, Building2, Tag, FileType, Shield, Eye, MousePointer, RefreshCw, Database, SlidersHorizontal, X } from 'lucide-react';
import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for demonstration
const mockDatasets = [
  {
    id: 'DS001',
    name: 'Danh sách văn bản quy phạm pháp luật 2024',
    category: 'Văn bản pháp luật',
    version: 'v2.1',
    validity: 'Hiệu lực',
    exploitationStatus: 'Đang khai thác',
    publishStatus: 'Đã công bố',
    approvalStatus: 'Đã phê duyệt',
    publishedDate: '2024-01-15',
    views: 1250,
    downloads: 340,
  },
  {
    id: 'DS002',
    name: 'Dữ liệu đăng ký kinh doanh Q1/2024',
    category: 'Đăng ký kinh doanh',
    version: 'v1.5',
    validity: 'Hiệu lực',
    exploitationStatus: 'Tạm dừng',
    publishStatus: 'Chưa công bố',
    approvalStatus: 'Đang chờ',
    publishedDate: '2024-02-10',
    views: 890,
    downloads: 220,
  },
  {
    id: 'DS003',
    name: 'Thống kê công chứng viên 2024',
    category: 'Công chứng',
    version: 'v1.0',
    validity: 'Hết hiệu lực',
    exploitationStatus: 'Ngừng khai thác',
    publishStatus: 'Đã công bố',
    approvalStatus: 'Đã phê duyệt',
    publishedDate: '2024-03-05',
    views: 670,
    downloads: 180,
  },
  {
    id: 'DS004',
    name: 'Danh sách trung tâm TGPL',
    category: 'Trợ giúp pháp lý',
    version: 'v3.0',
    validity: 'Hiệu lực',
    exploitationStatus: 'Đang khai thác',
    publishStatus: 'Chưa công bố',
    approvalStatus: 'Đang chờ',
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

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function CategoryStatisticsReportPage() {
  const [activeTab, setActiveTab] = useState<'search' | 'statistics' | 'classification' | 'access'>('search');
  
  // Search & Filter States
  const [showAdvancedSearchModal, setShowAdvancedSearchModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterValidity, setFilterValidity] = useState('all');
  const [filterPublishStatus, setFilterPublishStatus] = useState('all');
  const [filterApprovalStatus, setFilterApprovalStatus] = useState('all');
  
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
    if (filterValidity !== 'all' && dataset.validity !== filterValidity) return false;
    if (filterPublishStatus !== 'all' && dataset.publishStatus !== filterPublishStatus) return false;
    if (filterApprovalStatus !== 'all' && dataset.approvalStatus !== filterApprovalStatus) return false;
    return true;
  });

  const handleExportExcel = () => {
    alert('Xuất dữ liệu ra Excel');
  };

  const handleExportPDF = () => {
    alert('Xuất dữ liệu ra PDF');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-slate-900">Báo cáo thống kê danh mục</h1>
          <p className="text-sm text-slate-500 mt-1">Tìm kiếm và xuất báo cáo thống kê danh mục</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-2 px-4 pt-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
              activeTab === 'search'
                ? 'border-emerald-600 text-emerald-600 bg-emerald-50'
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
                ? 'border-emerald-600 text-emerald-600 bg-emerald-50'
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
                ? 'border-emerald-600 text-emerald-600 bg-emerald-50'
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
                ? 'border-emerald-600 text-emerald-600 bg-emerald-50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Thống kê lượt truy cập
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Tab 1: Tìm kiếm và lọc */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              {/* Basic Search Panel */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      title="Từ khóa"
                      placeholder="Tìm kiếm toàn văn (Nhập từ khóa mã danh mục, tên danh mục...)"
                      value={searchKeyword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    />
                  </div>
                  <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium flex items-center gap-2 shadow-sm whitespace-nowrap">
                    <Search className="w-4 h-4" />
                    Tìm kiếm
                  </button>
                  <button 
 onClick={() => setShowAdvancedSearchModal(true)}
 className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium flex items-center gap-2 shadow-sm whitespace-nowrap relative"
 >
 <SlidersHorizontal className="w-5 h-5 text-slate-500" />
 Tìm kiếm nâng cao
 {(filterCategory !== 'all' || filterValidity !== 'all' || filterPublishStatus !== 'all' || filterApprovalStatus !== 'all') && (
 <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] rounded-full border-2 border-white">
 !
 </span>
 )}
 </button>
                </div>
              </div>

              {/* Advanced Search Modal */}
              {showAdvancedSearchModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <SlidersHorizontal className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Tìm kiếm nâng cao</h3>
                      </div>
                      <button
                        title="Đóng" aria-label="Đóng"
                        onClick={() => setShowAdvancedSearchModal(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Chủ đề</label>
                          <select
                            title="Chủ đề"
                            value={filterCategory}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterCategory(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="all">Tất cả</option>
                            <option value="Văn bản pháp luật">Văn bản pháp luật</option>
                            <option value="Đăng ký kinh doanh">Đăng ký kinh doanh</option>
                            <option value="Công chứng">Công chứng</option>
                            <option value="Trợ giúp pháp lý">Trợ giúp pháp lý</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Hiệu lực</label>
                          <select
                            title="Hiệu lực"
                            value={filterValidity}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterValidity(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="all">Tất cả</option>
                            <option value="Hiệu lực">Hiệu lực</option>
                            <option value="Hết hiệu lực">Hết hiệu lực</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái công bố</label>
                          <select
                            title="Trạng thái công bố"
                            value={filterPublishStatus}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterPublishStatus(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="all">Tất cả</option>
                            <option value="Đã công bố">Đã công bố</option>
                            <option value="Chưa công bố">Chưa công bố</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái phê duyệt</label>
                          <select
                            title="Trạng thái phê duyệt"
                            value={filterApprovalStatus}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterApprovalStatus(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="all">Tất cả</option>
                            <option value="Đã phê duyệt">Đã phê duyệt</option>
                            <option value="Đang chờ">Đang chờ</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                      <button 
                        onClick={() => {
                          setFilterCategory('all');
                          setFilterValidity('all');
                          setFilterPublishStatus('all');
                          setFilterApprovalStatus('all');
                        }}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                      >
                        Đặt lại
                      </button>
                      <button 
                        onClick={() => setShowAdvancedSearchModal(false)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                      >
                        <Filter className="w-5 h-5" />
                        Áp dụng bộ lọc
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Summary */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Tìm thấy <span className="text-emerald-600 font-semibold">{filteredDatasets.length}</span> kết quả
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
                        <th className="px-4 py-3 text-left text-xs text-slate-600">Phiên bản</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600">Hiệu lực</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600">Tình trạng khai thác</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600">Trạng thái công bố</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600">Trạng thái phê duyệt</th>
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
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {dataset.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-purple-600">{dataset.version}</td>
                          <td className="px-4 py-3 text-sm">
                             <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${dataset.validity === 'Hiệu lực' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {dataset.validity}
                             </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                             <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${dataset.exploitationStatus === 'Đang khai thác' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : dataset.exploitationStatus === 'Tạm dừng' ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20' : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'}`}>
                                {dataset.exploitationStatus}
                             </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                             <span className={`font-medium ${dataset.publishStatus === 'Đã công bố' ? 'text-blue-600' : 'text-slate-700'}`}>
                                {dataset.publishStatus}
                             </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                             <span className={`font-medium ${dataset.approvalStatus === 'Đã phê duyệt' ? 'text-purple-600' : 'text-orange-500'}`}>
                                {dataset.approvalStatus}
                             </span>
                          </td>
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
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  Thiết lập báo cáo
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Nhóm theo</label>
                    <select
                      title="Nhóm theo"
                      value={statsGroupBy}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatsGroupBy(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                      title="Khoảng thời gian"
                      value={statsTimeRange}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatsTimeRange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="2024">Năm 2024</option>
                      <option value="2023">Năm 2023</option>
                      <option value="6months">6 tháng gần nhất</option>
                      <option value="custom">Tùy chỉnh</option>
                    </select>
                  </div>

                  <div className="flex items-end gap-2">
                    <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Tạo báo cáo
                    </button>
                    <button 
                      onClick={handleExportExcel}
                      title="Xuất Excel"
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
                    <Building2 className="w-5 h-5 text-emerald-600" />
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
                    <Bar dataKey={statsGroupBy === 'category' ? 'count' : 'datasets'} fill="#10b981" />
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
                      {(statsGroupBy === 'category' ? statsByCategory : statsByAgency).map((item: any, index) => (
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
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-emerald-600" />
                  Thiết lập phân loại
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Phân loại theo</label>
                    <select
                      title="Phân loại theo"
                      value={classifyBy}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setClassifyBy(e.target.value as any)}
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
                        label={({ name, percent }: { name: string, percent: number }) => `${name} (${(percent * 100).toFixed(0)}%)`}
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
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Thiết lập báo cáo truy cập
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Khoảng thời gian</label>
                    <select
                      title="Khoảng thời gian"
                      value={accessTimeRange}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setAccessTimeRange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                      title="Chỉ số"
                      value={accessMetric}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setAccessMetric(e.target.value as any)}
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
                    <button 
                      onClick={handleExportPDF}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      title="Xuất PDF"
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
                    <Download className="w-5 h-5 text-emerald-600" />
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
                      <Line type="monotone" dataKey="downloads" stroke="#10b981" strokeWidth={2} name="Lượt tải" />
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
