import React, { ChangeEvent } from 'react';
import {
  History, Filter, X, ChevronDown, Eye, Download,
  Clock, CheckSquare, Archive, Layers
} from 'lucide-react';
import { BaseModal } from '../../../../common/BaseModal';

interface VersionRecord {
  id: number;
  version: string;
  author: string;
  category: string;
  date: string;
  content: string;
  type: 'Cấu trúc' | 'Dữ liệu' | 'Quan hệ' | 'Thông tin chung';
  status: 'active' | 'archived';
}

interface VersionHistoryTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onViewDetail?: (version: VersionRecord) => void;
}

const ALL_HISTORY: VersionRecord[] = [
  { id: 10, version: '4.3', author: 'Nguyễn Văn A', category: 'Dữ liệu Danh mục giới tính', date: '20/06/2026 08:15', content: 'Cập nhật quy tắc xác thực trường gender_code', type: 'Cấu trúc', status: 'active' },
  { id: 9,  version: '4.2', author: 'Trần Thị B',   category: 'Dữ liệu Danh mục dân tộc',   date: '12/06/2026 14:30', content: 'Thêm quan hệ với Dữ liệu Danh mục quốc gia',    type: 'Quan hệ',       status: 'archived' },
  { id: 8,  version: '4.1', author: 'Nguyễn Văn A', category: 'Dữ liệu Danh mục giới tính', date: '05/01/2026 09:30', content: 'Thêm trường "Giới tính khác"',                  type: 'Cấu trúc',      status: 'archived' },
  { id: 7,  version: '4.0', author: 'Trần Thị B',   category: 'Dữ liệu Danh mục dân tộc',   date: '28/12/2025 14:15', content: 'Cập nhật 5 dân tộc mới',                        type: 'Dữ liệu',       status: 'archived' },
  { id: 6,  version: '3.9', author: 'Lê Văn C',     category: 'Dữ liệu Danh mục giới tính', date: '15/12/2025 10:00', content: 'Khởi tạo cấu trúc ban đầu',                     type: 'Cấu trúc',      status: 'archived' },
  { id: 5,  version: '3.8', author: 'Phạm Thị D',   category: 'Dữ liệu Danh mục quốc tịch', date: '01/12/2025 11:45', content: 'Cập nhật đơn vị chủ quản sang Bộ Tư pháp',     type: 'Thông tin chung', status: 'archived' },
  { id: 4,  version: '3.7', author: 'Hoàng Văn E',  category: 'Dữ liệu Danh mục tôn giáo',  date: '18/11/2025 16:20', content: 'Đồng bộ dữ liệu từ Kho DLDC lần 3',             type: 'Dữ liệu',       status: 'archived' },
  { id: 3,  version: '3.6', author: 'Lê Văn C',     category: 'Dữ liệu Danh mục quốc gia',  date: '05/11/2025 09:00', content: 'Thêm trường phone_code vào cấu trúc',           type: 'Cấu trúc',      status: 'archived' },
  { id: 2,  version: '3.5', author: 'Nguyễn Văn A', category: 'Dữ liệu Danh mục dân tộc',   date: '22/10/2025 13:10', content: 'Xoá quan hệ n-n với Dữ liệu Danh mục vùng',    type: 'Quan hệ',       status: 'archived' },
  { id: 1,  version: '3.4', author: 'Trần Thị B',   category: 'Dữ liệu Danh mục giới tính', date: '10/10/2025 08:00', content: 'Khởi tạo phiên bản đầu tiên',                   type: 'Thông tin chung', status: 'archived' },
];

const typeColors: Record<VersionRecord['type'], string> = {
  'Cấu trúc':      'bg-purple-50 text-purple-700 border-purple-200',
  'Dữ liệu':       'bg-blue-50 text-blue-700 border-blue-200',
  'Quan hệ':       'bg-teal-50 text-teal-700 border-teal-200',
  'Thông tin chung': 'bg-slate-100 text-slate-600 border-slate-200',
};

export function VersionHistoryTab({ searchTerm, setSearchTerm }: VersionHistoryTabProps) {
  const [showFilters, setShowFilters] = React.useState(false);
  const [filterCategory, setFilterCategory]     = React.useState('all');
  const [filterType, setFilterType]             = React.useState('all');
  const [filterStatus, setFilterStatus]         = React.useState('all');
  const [filterFromDate, setFilterFromDate]     = React.useState('');
  const [filterToDate, setFilterToDate]         = React.useState('');
  const [currentPageNum, setCurrentPageNum]     = React.useState(1);
  const [pageSize, setPageSize]                 = React.useState(10);
  const [selectedVersion, setSelectedVersion]   = React.useState(null as VersionRecord | null);

  React.useEffect(() => { setCurrentPageNum(1); }, [searchTerm, filterCategory, filterType, filterStatus, filterFromDate, filterToDate]);

  const totalCount     = ALL_HISTORY.length;
  const structureCount = ALL_HISTORY.filter(v => v.type === 'Cấu trúc').length;
  const dataCount      = ALL_HISTORY.filter(v => v.type === 'Dữ liệu').length;
  const activeCount    = ALL_HISTORY.filter(v => v.status === 'active').length;

  const filtered = ALL_HISTORY.filter(v => {
    const q = searchTerm.toLowerCase();
    const matchSearch  = !q || v.category.toLowerCase().includes(q) || v.author.toLowerCase().includes(q) || v.content.toLowerCase().includes(q);
    const matchCat     = filterCategory === 'all' || v.category === filterCategory;
    const matchType    = filterType === 'all' || v.type === filterType;
    const matchStatus  = filterStatus === 'all' || v.status === filterStatus;
    return matchSearch && matchCat && matchType && matchStatus;
  });

  const paginated = filtered.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const renderPagination = (totalItemsCount: number) => {
    if (totalItemsCount <= 0) return null;
    const totalPages = Math.ceil(totalItemsCount / pageSize);
    const startItem  = (currentPageNum - 1) * pageSize + 1;
    const endItem    = Math.min(currentPageNum * pageSize, totalItemsCount);
    return (
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-normal">Hiển thị</span>
          <select
            aria-label="Số bản ghi trên trang"
            value={pageSize}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => { setPageSize(Number(e.target.value)); setCurrentPageNum(1); }}
            className="px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-[13px] cursor-pointer font-medium"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-slate-600 font-normal">bản ghi/trang</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-600 font-normal">{startItem} - {endItem} / {totalItemsCount}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
              disabled={currentPageNum === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPageNum(page)}
                className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${currentPageNum === page ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
              disabled={currentPageNum === totalPages}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  const uniqueCategories = Array.from(new Set(ALL_HISTORY.map(v => v.category)));

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h2 className="text-[18px] font-bold text-slate-800">Lịch sử phiên bản</h2>
        <p className="text-[13px] text-slate-500 mt-0.5">Xem lại các thay đổi cấu trúc và dữ liệu qua từng thời kỳ</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-slate-500">Tổng phiên bản</span>
            <History className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalCount}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-slate-500">Thay đổi cấu trúc</span>
            <Layers className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{structureCount}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-slate-500">Thay đổi dữ liệu</span>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{dataCount}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-slate-500">Đang dùng</span>
            <CheckSquare className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeCount}</div>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo danh mục, người thực hiện, nội dung..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-white hover:bg-slate-50/50 font-medium shadow-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all border cursor-pointer active:scale-95 ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              title={showFilters ? 'Đóng bộ lọc' : 'Bộ lọc nâng cao'}
            >
              {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              className="flex-1 md:flex-none px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap cursor-pointer border border-slate-200"
            >
              <Download className="w-4 h-4" />
              Xuất lịch sử
            </button>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className="relative p-4 bg-white border border-slate-200 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[13px] font-normal text-black uppercase tracking-wider mb-2">Danh mục</label>
                <div className="relative">
                  <select
                    value={filterCategory}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterCategory(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                  >
                    <option value="all">Tất cả danh mục</option>
                    {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-normal text-black uppercase tracking-wider mb-2">Loại thay đổi</label>
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                  >
                    <option value="all">Tất cả loại</option>
                    <option value="Cấu trúc">Cấu trúc</option>
                    <option value="Dữ liệu">Dữ liệu</option>
                    <option value="Quan hệ">Quan hệ</option>
                    <option value="Thông tin chung">Thông tin chung</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-normal text-black uppercase tracking-wider mb-2">Trạng thái</label>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đang dùng</option>
                    <option value="archived">Đã lưu trữ</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-normal text-black uppercase tracking-wider mb-2">Khoảng thời gian</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={filterFromDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterFromDate(e.target.value)}
                    title="Từ ngày"
                    className="flex-1 px-3 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
                  />
                  <span className="text-slate-400 text-[13px] shrink-0">–</span>
                  <input
                    type="date"
                    value={filterToDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterToDate(e.target.value)}
                    title="Đến ngày"
                    className="flex-1 px-3 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap w-14 text-center">STT</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Phiên bản</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Danh mục</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Người thực hiện</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Thời gian</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Loại thay đổi</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700">Nội dung thay đổi</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Trạng thái</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginated.length > 0 ? (
                paginated.map((v, index) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-all group border-b border-slate-100">
                    <td className="px-6 py-4 text-[13px] text-slate-500 text-center">{(currentPageNum - 1) * pageSize + index + 1}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg text-[13px] font-bold border border-blue-100">
                        v{v.version}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-700 font-normal max-w-[200px] truncate" title={v.category}>{v.category}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-800 font-normal whitespace-nowrap">{v.author}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-500 whitespace-nowrap">{v.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded border text-[13px] font-medium whitespace-nowrap ${typeColors[v.type]}`}>
                        {v.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-700 font-normal max-w-[240px]">{v.content}</td>
                    <td className="px-6 py-4 text-center">
                      {v.status === 'active' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[13px] font-normal border bg-green-50 text-green-700 border-green-100 whitespace-nowrap">
                          Đang dùng
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[13px] font-normal border bg-slate-50 text-slate-500 border-slate-200 whitespace-nowrap">
                          Đã lưu trữ
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => setSelectedVersion(v)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-[13px] text-slate-500">
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {renderPagination(filtered.length)}
      </div>

      {/* Version Detail Modal */}
      {selectedVersion && (
        <BaseModal
          isOpen={!!selectedVersion}
          onClose={() => setSelectedVersion(null)}
          title={`Chi tiết phiên bản v${selectedVersion.version}`}
          subtitle={selectedVersion.category}
          maxWidth="max-w-2xl"
          customHeaderIcon={
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mr-3 shrink-0">
              <Archive className="w-5 h-5 text-blue-600" />
            </div>
          }
          footer={
            <button
              onClick={() => setSelectedVersion(null)}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[13px]"
            >
              Đóng
            </button>
          }
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-[13px] text-slate-500 mb-1">Phiên bản</div>
                <div className="text-[13px] font-bold text-blue-700">v{selectedVersion.version}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-[13px] text-slate-500 mb-1">Loại thay đổi</div>
                <span className={`px-2 py-0.5 rounded border text-[13px] font-medium ${typeColors[selectedVersion.type]}`}>
                  {selectedVersion.type}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-[13px] text-slate-500 mb-1">Người thực hiện</div>
                <div className="text-[13px] font-semibold text-slate-800">{selectedVersion.author}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-[13px] text-slate-500 mb-1">Thời gian cập nhật</div>
                <div className="text-[13px] font-semibold text-slate-800">{selectedVersion.date}</div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="text-[13px] text-slate-500 mb-1">Danh mục</div>
              <div className="text-[13px] font-semibold text-slate-800">{selectedVersion.category}</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-[13px] font-semibold text-slate-700 mb-2 border-b border-slate-100 pb-2">Nội dung thay đổi</div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></div>
                <span className="text-[13px] text-slate-700">{selectedVersion.content}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-500">Trạng thái</span>
              {selectedVersion.status === 'active' ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[13px] font-normal border bg-green-50 text-green-700 border-green-100">
                  Đang dùng
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[13px] font-normal border bg-slate-50 text-slate-500 border-slate-200">
                  Đã lưu trữ
                </span>
              )}
            </div>
          </div>
        </BaseModal>
      )}
    </div>
  );
}
