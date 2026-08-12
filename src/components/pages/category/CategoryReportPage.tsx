import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, ChevronDown, Eye } from 'lucide-react';
import { LifecycleStatus, ScopeType } from './categoryTypes';
import { lifecycleLabels, scopeLabels } from './categoryConstants';

const mockDatasets: {
  id: string; code: string; name: string; agency: string; scope: ScopeType;
  structureCount: number; status: LifecycleStatus;
}[] = [
  { id: 'category-a-1', code: 'DM-GIOITINH', name: 'Dữ liệu Danh mục giới tính', agency: 'Bộ Tư pháp', scope: 'national', structureCount: 4, status: 'active' },
  { id: 'category-a-2', code: 'DM-DANTOC', name: 'Dữ liệu Danh mục và mã các dân tộc Việt Nam', agency: 'Ủy ban Dân tộc', scope: 'national', structureCount: 54, status: 'active' },
  { id: 'category-a-3', code: 'DM-QUOCGIA', name: 'Dữ liệu Danh mục và mã Quốc gia, Quốc tịch', agency: 'Bộ Ngoại giao', scope: 'national', structureCount: 250, status: 'pending_approval' },
  { id: 'category-a-4', code: 'DM-TONGIAO', name: 'Dữ liệu Danh mục và mã các Tôn giáo', agency: 'Ban Tôn giáo Chính phủ', scope: 'national', structureCount: 16, status: 'pending_approval' },
  { id: 'category-a-5', code: 'DM-COQUAN', name: 'Dữ liệu Danh mục cơ quan', agency: 'Bộ Nội vụ', scope: 'national', structureCount: 45, status: 'pending_approval' },
  { id: 'category-a-6', code: 'DM-HC', name: 'Dữ liệu Danh mục đơn vị hành chính', agency: 'Bộ Nội vụ', scope: 'national', structureCount: 1200, status: 'draft' },
  { id: 'category-a-7', code: 'DM-QUANHEGD', name: 'Dữ liệu Danh mục và mã mối quan hệ trong gia đình', agency: 'Bộ Tư pháp', scope: 'national', structureCount: 12, status: 'draft' },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function CategoryReportPage() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [scopeFilter, setScopeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [agencyFilter, setAgencyFilter] = useState('all');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const agencyOptions = Array.from(new Set(mockDatasets.map(d => d.agency)));

  const hasActiveFilters =
    scopeFilter !== 'all' ||
    statusFilter !== 'all' ||
    agencyFilter !== 'all';

  const filteredDatasets = mockDatasets.filter(dataset => {
    if (searchKeyword && !dataset.name.toLowerCase().includes(searchKeyword.toLowerCase()) && !dataset.code.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    if (scopeFilter !== 'all' && dataset.scope !== scopeFilter) return false;
    if (statusFilter !== 'all' && dataset.status !== statusFilter) return false;
    if (agencyFilter !== 'all' && dataset.agency !== agencyFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredDatasets.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedDatasets = filteredDatasets.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startItem = filteredDatasets.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, filteredDatasets.length);

  const handleResetFilters = () => {
    setScopeFilter('all');
    setStatusFilter('all');
    setAgencyFilter('all');
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
      {/* Search & Filter Section - form chung */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <label className="block text-[12px] text-slate-500 mb-1 font-medium">Từ khóa</label>
            <input
              type="text"
              placeholder="Nhập mã danh mục, tên danh mục..."
              value={searchKeyword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 transition-all"
            />
          </div>

          <div className="min-w-[160px]">
            <label className="block text-[12px] text-slate-500 mb-1 font-medium">Trạng thái</label>
            <select
              title="Trạng thái"
              value={statusFilter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="all">Tất cả</option>
              <option value="active">Hiệu lực</option>
              <option value="pending_approval">Chờ phê duyệt</option>
              <option value="draft">Đang soạn thảo</option>
              <option value="inactive">Hết hiệu lực</option>
            </select>
          </div>

          <div className="min-w-[160px]">
            <label className="block text-[12px] text-slate-500 mb-1 font-medium">Phạm vi</label>
            <select
              title="Phạm vi"
              value={scopeFilter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setScopeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="all">Tất cả</option>
              <option value="national">Cấp quốc gia</option>
              <option value="ministry">Cấp bộ</option>
              <option value="provincial">Cấp tỉnh/thành</option>
              <option value="internal">Sử dụng nội bộ</option>
            </select>
          </div>

          <div className="min-w-[190px]">
            <label className="block text-[12px] text-slate-500 mb-1 font-medium">Đơn vị chủ quản</label>
            <select
              title="Đơn vị chủ quản"
              value={agencyFilter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setAgencyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="all">Tất cả</option>
              {agencyOptions.map(agency => (
                <option key={agency} value={agency}>{agency}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-[13px] shadow-sm shrink-0 cursor-pointer active:scale-95"
          >
            <Search className="w-4 h-4" />
            Tìm kiếm
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50 transition-colors font-medium shrink-0 cursor-pointer"
            >
              Đặt lại
            </button>
          )}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowExportMenu(prev => !prev)}
              className="px-4 py-2 bg-[#2F3CC1] hover:brightness-110 text-white rounded-lg flex items-center gap-2 text-[13px] font-medium transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Kết xuất
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
      </div>

      {/* Table + Pagination */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-900 whitespace-nowrap w-14 text-center">STT</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-900 whitespace-nowrap">Mã danh mục</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-900 whitespace-nowrap">Tên danh mục</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-900 whitespace-nowrap">Đơn vị chủ quản</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-900 whitespace-nowrap">Phạm vi</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-900 whitespace-nowrap text-center">Trường thuộc tính</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-900 whitespace-nowrap text-center">Trạng thái</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-900 whitespace-nowrap text-center w-20">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedDatasets.length > 0 ? (
                paginatedDatasets.map((dataset, index) => (
                  <tr key={dataset.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-6 py-4 text-slate-500 text-[13px] font-normal text-center">{(safePage - 1) * pageSize + index + 1}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-900 font-mono font-semibold whitespace-nowrap">{dataset.code}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-900">{dataset.name}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{dataset.agency}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{scopeLabels[dataset.scope] ?? dataset.scope}</td>
                    <td className="px-6 py-4 text-[13px] text-center whitespace-nowrap">{dataset.structureCount} trường</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-normal whitespace-nowrap ${lifecycleLabels[dataset.status].color}`}>
                        {lifecycleLabels[dataset.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => navigate(`/category-list?category=${dataset.id}&mode=readonly`)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[13px] text-slate-500">
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
