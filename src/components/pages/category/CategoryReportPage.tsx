import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, SlidersHorizontal, X, ChevronDown, Eye } from 'lucide-react';

const mockDatasets = [
  {
    id: 'category-a-1',
    name: 'Dữ liệu Danh mục giới tính',
    structureCount: 4,
    relationshipCount: 1,
    agency: 'Cục Hộ tịch, quốc tịch, chứng thực',
    format: 'JSON',
    license: 'CC BY 4.0',
    approval: 'approved',
    publicStatus: 'published',
    scope: 'national',
    dataSource: 'manual',
    currentVersion: 'v1.0',
    publishedDate: '2024-01-10',
  },
  {
    id: 'category-a-2',
    name: 'Dữ liệu Danh mục và mã các dân tộc Việt Nam',
    structureCount: 54,
    relationshipCount: 2,
    agency: 'Ủy ban Dân tộc',
    format: 'Excel',
    license: 'ODC-BY',
    approval: 'approved',
    publicStatus: 'published',
    scope: 'national',
    dataSource: 'dldc',
    currentVersion: 'v2.0',
    publishedDate: '2024-02-15',
  },
  {
    id: 'category-a-3',
    name: 'Dữ liệu Danh mục và mã Quốc gia, Quốc tịch',
    structureCount: 250,
    relationshipCount: 3,
    agency: 'Bộ Ngoại giao',
    format: 'CSV',
    license: 'CC BY 4.0',
    approval: 'approved',
    publicStatus: 'published',
    scope: 'national',
    dataSource: 'dldc',
    currentVersion: 'v1.2',
    publishedDate: '2024-03-01',
  },
  {
    id: 'category-a-4',
    name: 'Dữ liệu Danh mục và mã các Tôn giáo',
    structureCount: 16,
    relationshipCount: 0,
    agency: 'Ban Tôn giáo Chính phủ',
    format: 'JSON',
    license: 'ODbL',
    approval: 'pending',
    publicStatus: 'unpublished',
    scope: 'national',
    dataSource: 'manual',
    currentVersion: 'v1.0',
    publishedDate: '2024-03-20',
  },
  {
    id: 'category-a-5',
    name: 'Dữ liệu Danh mục cơ quan',
    structureCount: 45,
    relationshipCount: 4,
    agency: 'Bộ Tư pháp',
    format: 'JSON',
    license: 'CC BY 4.0',
    approval: 'approved',
    publicStatus: 'published',
    scope: 'ministry',
    dataSource: 'manual',
    currentVersion: 'v3.1',
    publishedDate: '2024-01-25',
  },
  {
    id: 'category-a-6',
    name: 'Dữ liệu Danh mục đơn vị hành chính',
    structureCount: 1200,
    relationshipCount: 5,
    agency: 'Bộ Nội vụ',
    format: 'Excel',
    license: 'ODC-BY',
    approval: 'approved',
    publicStatus: 'published',
    scope: 'national',
    dataSource: 'dldc',
    currentVersion: 'v4.0',
    publishedDate: '2024-04-10',
  },
  {
    id: 'category-a-7',
    name: 'Dữ liệu Danh mục và mã mối quan hệ trong gia đình',
    structureCount: 12,
    relationshipCount: 1,
    agency: 'Cục Hộ tịch, quốc tịch, chứng thực',
    format: 'JSON',
    license: 'ODbL',
    approval: 'pending',
    publicStatus: 'unpublished',
    scope: 'internal',
    dataSource: 'manual',
    currentVersion: 'v1.1',
    publishedDate: '2024-02-28',
  },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const SCOPE_LABELS: Record<string, string> = {
  national: 'Cấp quốc gia',
  ministry: 'Cấp bộ',
  provincial: 'Cấp tỉnh',
  internal: 'Sử dụng nội bộ',
};

const DATA_SOURCE_LABELS: Record<string, string> = {
  manual: 'Tự cập nhật',
  dldc: 'Đồng bộ Kho DLDC',
};

export function CategoryReportPage() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [scopeFilter, setScopeFilter] = useState('all');
  const [dataSourceFilter, setDataSourceFilter] = useState('all');
  const [publicStatusFilter, setPublicStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const hasActiveFilters =
    scopeFilter !== 'all' ||
    dataSourceFilter !== 'all' ||
    publicStatusFilter !== 'all' ||
    approvalFilter !== 'all';

  const filteredDatasets = mockDatasets.filter(dataset => {
    if (searchKeyword && !dataset.name.toLowerCase().includes(searchKeyword.toLowerCase()) && !dataset.id.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    if (scopeFilter !== 'all' && dataset.scope !== scopeFilter) return false;
    if (dataSourceFilter !== 'all' && dataset.dataSource !== dataSourceFilter) return false;
    if (publicStatusFilter !== 'all' && dataset.publicStatus !== publicStatusFilter) return false;
    if (approvalFilter !== 'all' && dataset.approval !== approvalFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredDatasets.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedDatasets = filteredDatasets.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startItem = filteredDatasets.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, filteredDatasets.length);

  const handleResetFilters = () => {
    setScopeFilter('all');
    setDataSourceFilter('all');
    setPublicStatusFilter('all');
    setApprovalFilter('all');
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleExportFile = (format: string) => {
    setShowExportMenu(false);
    alert(`Xuất dữ liệu ra ${format}`);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Section */}
      <div className="space-y-3">
        {/* Search Row */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Tìm kiếm toàn văn (Nhập từ khóa mã danh mục, tên danh mục...)"
              value={searchKeyword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-white hover:bg-slate-50/50 shadow-sm"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-medium flex items-center gap-2 transition-all active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
          >
            <Search className="w-4 h-4" />
            Tìm kiếm
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-5 py-2.5 rounded-xl text-[13px] font-medium flex items-center gap-2 transition-all border cursor-pointer active:scale-95 relative whitespace-nowrap ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
            Tìm kiếm nâng cao
            {hasActiveFilters && !showFilters && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-blue-600 text-white text-[10px] rounded-full border-2 border-white font-bold">
                !
              </span>
            )}
          </button>
        </div>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[13px] font-normal text-slate-800 uppercase tracking-wider mb-2">Phạm vi</label>
                <div className="relative">
                  <select
                    title="Phạm vi"
                    value={scopeFilter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setScopeFilter(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                  >
                    <option value="all">Tất cả</option>
                    <option value="national">Cấp quốc gia</option>
                    <option value="ministry">Cấp bộ</option>
                    <option value="provincial">Cấp tỉnh</option>
                    <option value="internal">Sử dụng nội bộ</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-normal text-slate-800 uppercase tracking-wider mb-2">Nguồn dữ liệu</label>
                <div className="relative">
                  <select
                    title="Nguồn dữ liệu"
                    value={dataSourceFilter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setDataSourceFilter(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                  >
                    <option value="all">Tất cả</option>
                    <option value="manual">Tự cập nhật trực tiếp</option>
                    <option value="dldc">Đồng bộ Kho DLDC</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-normal text-slate-800 uppercase tracking-wider mb-2">Trạng thái công bố</label>
                <div className="relative">
                  <select
                    title="Trạng thái công bố"
                    value={publicStatusFilter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setPublicStatusFilter(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                  >
                    <option value="all">Tất cả</option>
                    <option value="published">Đã công bố</option>
                    <option value="unpublished">Chưa công bố</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-normal text-slate-800 uppercase tracking-wider mb-2">Trạng thái phê duyệt</label>
                <div className="relative">
                  <select
                    title="Trạng thái phê duyệt"
                    value={approvalFilter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setApprovalFilter(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                  >
                    <option value="all">Tất cả</option>
                    <option value="approved">Đã phê duyệt</option>
                    <option value="pending">Đang chờ</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50 transition-colors font-medium cursor-pointer"
              >
                Đặt lại
              </button>
              <button
                type="button"
                onClick={() => { setShowFilters(false); setCurrentPage(1); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium transition-colors cursor-pointer active:scale-95"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary + Export */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-slate-600">
          Tìm thấy <span className="text-blue-600 font-semibold">{filteredDatasets.length}</span> kết quả
        </span>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowExportMenu(prev => !prev)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-[13px] font-medium transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Xuất File
            <ChevronDown className="w-4 h-4" />
          </button>
          {showExportMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl border border-slate-200 bg-white shadow-xl z-20 overflow-hidden">
              {['Excel', 'PDF', 'CSV'].map(fmt => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => handleExportFile(fmt)}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-[13px] text-slate-700 transition-colors"
                >
                  {fmt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table + Pagination */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Mã danh mục</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên danh mục</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Đơn vị chủ quản</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Phạm vi</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Nguồn dữ liệu</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Cấu trúc</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Quan hệ</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Phiên bản</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Trạng thái công bố</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Trạng thái phê duyệt</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ngày công bố</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedDatasets.length > 0 ? (
                paginatedDatasets.map((dataset) => (
                  <tr key={dataset.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-6 py-4 text-[13px] text-slate-700 font-medium whitespace-nowrap">{dataset.id}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-900">{dataset.name}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{dataset.agency}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{SCOPE_LABELS[dataset.scope] ?? dataset.scope}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{DATA_SOURCE_LABELS[dataset.dataSource] ?? dataset.dataSource}</td>
                    <td className="px-6 py-4 text-[13px] text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-normal bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
                        {dataset.structureCount} trường
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-normal bg-violet-50 text-violet-700 border border-violet-100 whitespace-nowrap">
                        {dataset.relationshipCount} liên kết
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px]">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-normal bg-purple-50 text-purple-700 border border-purple-100">
                        {dataset.currentVersion}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px]">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-normal border whitespace-nowrap bg-cyan-50 text-cyan-700 border-cyan-100">
                        {dataset.publicStatus === 'published' ? 'Đã công bố' : 'Chưa công bố'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px]">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-normal border whitespace-nowrap ${
                        dataset.approval === 'approved'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                          : 'bg-orange-50 text-orange-700 border-orange-100'
                      }`}>
                        {dataset.approval === 'approved' ? 'Đã phê duyệt' : 'Đang chờ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-600 whitespace-nowrap">{dataset.publishedDate}</td>
                    <td className="px-6 py-4 text-[13px] text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => navigate(`/category-list?category=${dataset.id}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[12px] font-medium transition-colors cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="px-6 py-12 text-center text-[13px] text-slate-500">
                    Không tìm thấy kết quả phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredDatasets.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-normal">Hiển thị</span>
              <select
                aria-label="Số bản ghi trên trang"
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-[13px] cursor-pointer font-medium"
                title="Số bản ghi trên trang"
              >
                {PAGE_SIZE_OPTIONS.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="text-slate-600 font-normal">bản ghi/trang</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-slate-600 font-normal">
                {startItem} - {endItem} / {filteredDatasets.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                  disabled={safePage === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${
                      safePage === page
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
                  disabled={safePage === totalPages}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
