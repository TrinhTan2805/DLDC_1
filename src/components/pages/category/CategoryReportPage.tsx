import { useState, ChangeEvent } from 'react';
import { Search, Filter, Download, FileText, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

// Mock data for demonstration
const mockDatasets = [
  {
    id: 'DS001',
    name: 'Danh sách văn bản quy phạm pháp luật 2024',
    category: 'Văn bản pháp luật',
    agency: 'Bộ Tư pháp',
    format: 'JSON',
    license: 'CC BY 4.0',
    approval: 'approved',
    publicStatus: 'published',
    validity: 'valid',
    exploitationStatus: 'active',
    currentVersion: 'v2.1',
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
    approval: 'pending',
    publicStatus: 'unpublished',
    validity: 'valid',
    exploitationStatus: 'paused',
    currentVersion: 'v1.5',
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
    approval: 'approved',
    publicStatus: 'published',
    validity: 'expired',
    exploitationStatus: 'stopped',
    currentVersion: 'v1.0',
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
    approval: 'pending',
    publicStatus: 'unpublished',
    validity: 'valid',
    exploitationStatus: 'active',
    currentVersion: 'v3.0',
    publishedDate: '2024-01-20',
    views: 550,
    downloads: 140,
  },
];

export function CategoryReportPage() {
  // Search & Filter States
  const [showAdvancedSearchModal, setShowAdvancedSearchModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [validityFilter, setValidityFilter] = useState('all');
  const [publicStatusFilter, setPublicStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');

  const filteredDatasets = mockDatasets.filter(dataset => {
    if (searchKeyword && !dataset.name.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    if (filterCategory !== 'all' && dataset.category !== filterCategory) return false;
    if (validityFilter !== 'all' && dataset.validity !== validityFilter) return false;
    if (publicStatusFilter !== 'all' && dataset.publicStatus !== publicStatusFilter) return false;
    if (approvalFilter !== 'all' && dataset.approval !== approvalFilter) return false;
    return true;
  });

  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportFile = (format: string) => {
    setShowExportMenu(false);
    alert(`Xuất dữ liệu ra ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-6">
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
                <button title="Đóng" aria-label="Đóng" className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium flex items-center gap-2 shadow-sm whitespace-nowrap">
                  <Search className="w-4 h-4" />
                  Tìm kiếm
                </button>
                <button 
 onClick={() => setShowAdvancedSearchModal(true)}
 className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium flex items-center gap-2 shadow-sm whitespace-nowrap relative"
 >
 <SlidersHorizontal className="w-5 h-5 text-slate-500" />
 Tìm kiếm nâng cao
 {(filterCategory !== 'all' || validityFilter !== 'all' || publicStatusFilter !== 'all' || approvalFilter !== 'all') && (
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
                          value={validityFilter}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setValidityFilter(e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="all">Tất cả</option>
                          <option value="valid">Hiệu lực</option>
                          <option value="expired">Hết hiệu lực</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái công bố</label>
                        <select
                          title="Trạng thái công bố"
                          value={publicStatusFilter}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setPublicStatusFilter(e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="all">Tất cả</option>
                          <option value="published">Đã công bố</option>
                          <option value="unpublished">Chưa công bố</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái phê duyệt</label>
                        <select
                          title="Trạng thái phê duyệt"
                          value={approvalFilter}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setApprovalFilter(e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="all">Tất cả</option>
                          <option value="approved">Đã phê duyệt</option>
                          <option value="pending">Đang chờ</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button 
                      onClick={() => {
                        setFilterCategory('all');
                        setValidityFilter('all');
                        setPublicStatusFilter('all');
                        setApprovalFilter('all');
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
                <div className="relative flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowExportMenu(prev => !prev)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Xuất File
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showExportMenu && (
                    <div className="absolute right-0 top-full mt-2 w-40 rounded-2xl border border-slate-200 bg-white shadow-xl z-20">
                      <button
                        type="button"
                        onClick={() => handleExportFile('Excel')}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-700"
                      >
                        Excel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExportFile('PDF')}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-700"
                      >
                        PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExportFile('CSV')}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-700"
                      >
                        CSV
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">Mã danh mục</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">Tên danh mục</th>
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
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                            {dataset.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-50 text-purple-700">
                            {dataset.currentVersion}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            dataset.validity === 'valid' 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {dataset.validity === 'valid' ? 'Hiệu lực' : 'Hết hiệu lực'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            dataset.exploitationStatus === 'active' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : dataset.exploitationStatus === 'paused'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {dataset.exploitationStatus === 'active' ? 'Đang khai thác' : 
                             dataset.exploitationStatus === 'paused' ? 'Tạm dừng' : 'Ngừng khai thác'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            dataset.publicStatus === 'published' 
                              ? 'bg-cyan-50 text-cyan-700' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {dataset.publicStatus === 'published' ? 'Đã công bố' : 'Chưa công bố'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            dataset.approval === 'approved' 
                              ? 'bg-indigo-50 text-indigo-700' 
                              : 'bg-orange-50 text-orange-700'
                          }`}>
                            {dataset.approval === 'approved' ? 'Đã phê duyệt' : 'Đang chờ'}
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
        </div>
      </div>
    </div>
  );
}