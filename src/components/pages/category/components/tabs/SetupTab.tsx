import React, { ChangeEvent } from 'react';
import { 
  Settings, CheckSquare, XCircle, Search, Filter, Plus, Globe, 
  X, ChevronDown, Eye, Edit2, Trash2, Send, PowerOff,
  FileText, Building2, Tag
} from 'lucide-react';
import { MasterDataEntity, LifecycleStatus } from '../../categoryTypes';
import { dataTypeLabels, lifecycleLabels } from '../../categoryConstants';

interface SetupTabProps {
  entities: MasterDataEntity[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: LifecycleStatus | 'all';
  setFilterStatus: (status: LifecycleStatus | 'all') => void;
  userRole: string;
  publishedEntities: string[];
  onAdd: () => void;
  onEdit: (entity: MasterDataEntity) => void;
  onDelete: (id: string) => void;
  onView?: (entity: MasterDataEntity) => void;
  onSubmitApproval: (id: string, type: 'category' | 'structure') => void;
  onPublish: (entity: MasterDataEntity) => void;
  onUnpublish: (entity: MasterDataEntity) => void;
  onApproveClick: (entity: MasterDataEntity) => void;
  onRejectClick: (entity: MasterDataEntity) => void;
  onExpireClick: (entity: MasterDataEntity) => void;
}

export function SetupTab({
  entities,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  userRole,
  publishedEntities,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onSubmitApproval,
  onPublish,
  onUnpublish,
  onApproveClick,
  onRejectClick,
  onExpireClick
}: SetupTabProps) {
  // Local UI States for Filters & Pagination
  const [showFilters, setShowFilters] = React.useState(false);
  const [currentPageNum, setCurrentPageNum] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Reset pagination to page 1 on filter or search query change
  React.useEffect(() => {
    setCurrentPageNum(1);
  }, [searchTerm, filterStatus]);

  const filteredEntities = entities.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || e.lifecycleStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const paginatedEntities = filteredEntities.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const renderPagination = (totalItemsCount: number) => {
    if (totalItemsCount <= 0) return null;
    const totalPages = Math.ceil(totalItemsCount / pageSize);
    const startItem = (currentPageNum - 1) * pageSize + 1;
    const endItem = Math.min(currentPageNum * pageSize, totalItemsCount);

    return (
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
        {/* Left Side: Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-normal">Hiển thị</span>
          <select
            aria-label="Select record count"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPageNum(1);
            }}
            className="px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-[13px] cursor-pointer font-medium"
            title="Số bản ghi trên trang"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-slate-600 font-normal">bản ghi/trang</span>
        </div>

        {/* Right Side: Page Range and Navigation */}
        <div className="flex items-center gap-4">
          <span className="text-slate-600 font-normal">
            {startItem} - {endItem} / {totalItemsCount}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
              disabled={currentPageNum === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPageNum(page)}
                className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${currentPageNum === page
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
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

  const uniqueAgencies = new Set(entities.map(e => e.managingAgency).filter(Boolean)).size;
  const uniqueSubjects = new Set(entities.map(e => e.scope).filter(Boolean)).size;

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-slate-500">Tổng Dataset</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{entities.length}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-slate-500">Cơ quan công bố</span>
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{uniqueAgencies}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-slate-500">Chủ đề</span>
            <Tag className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{uniqueSubjects}</div>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm kiếm danh mục theo tên hoặc mã..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-white hover:bg-slate-50/50 font-medium shadow-sm"
              />
            </div>
            <button
              type="button"
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all border cursor-pointer active:scale-95 ${
                showFilters
                  ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title={showFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
            >
              {showFilters ? <X className="w-4.5 h-4.5" /> : <Filter className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={onAdd}
              className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
              title="Thêm mới danh mục qua Wizard"
            >
              <Plus className="w-4 h-4" />
              Thêm mới
            </button>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className="relative p-4 bg-white border border-slate-200 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] before:content-[''] before:absolute before:-top-[7px] before:right-[208px] md:before:right-[auto] md:before:left-[calc(100%-100px)] lg:before:left-[calc(100%-242px)] before:w-3 before:h-3 before:bg-white before:rotate-45 before:border-l before:border-t before:border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[13px] font-normal text-black uppercase tracking-wider mb-2">Trạng thái danh mục</label>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as LifecycleStatus | 'all')}
                    className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đã hiệu lực</option>
                    <option value="draft">Đang soạn thảo</option>
                    <option value="inactive">Ngừng sử dụng</option>
                    <option value="archived">Đã lưu trữ</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Entity Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Mã</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên dữ liệu chủ</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Loại</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Cơ quan quản lý</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Trạng thái</th>
                {userRole === 'leader' && (
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Công khai</th>
                )}
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-right w-48">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedEntities.length > 0 ? (
                paginatedEntities.map((entity) => {
                  const isPublished = publishedEntities.includes(entity.id);
                  return (
                    <tr key={entity.id} className="hover:bg-slate-50/50 transition-all group border-b border-slate-100">
                      <td className="px-6 py-4 font-mono text-blue-600 text-[13px]">{entity.code}</td>
                      <td className="px-6 py-4 text-slate-900 text-[13px] font-semibold">{entity.name}</td>
                      <td className="px-6 py-4 text-slate-700 text-[13px] font-medium">{dataTypeLabels[entity.dataType]}</td>
                      <td className="px-6 py-4 text-slate-700 text-[13px] font-medium">{entity.managingAgency}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${
                          entity.lifecycleStatus === 'active'
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : entity.lifecycleStatus === 'pending_approval'
                              ? 'bg-purple-50 text-purple-700 border-purple-100'
                              : entity.lifecycleStatus === 'draft'
                                ? 'bg-slate-50 text-slate-700 border-slate-200'
                                : 'bg-orange-50 text-orange-700 border-orange-100'
                        }`}>
                          {lifecycleLabels[entity.lifecycleStatus].label}
                        </span>
                      </td>
                      {userRole === 'leader' && (
                        <td className="px-6 py-4 text-center">
                          {entity.lifecycleStatus === 'active' ? (
                            isPublished ? (
                              <span className="inline-flex items-center px-2.5 py-1 text-xs bg-green-50 text-green-700 border border-green-100 rounded-full font-medium whitespace-nowrap">
                                <Globe className="w-3.5 h-3.5 mr-1" />
                                Đã công khai
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 text-xs bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-medium whitespace-nowrap">
                                Chưa công khai
                              </span>
                            )
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-all">
                          {onView && (
                            <button
                              onClick={() => onView(entity)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onSubmitApproval(entity.id, 'category')}
                            disabled={entity.lifecycleStatus === 'active' || entity.lifecycleStatus === 'pending_approval' || entity.lifecycleStatus === 'pending_expiration'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              entity.lifecycleStatus === 'active' || entity.lifecycleStatus === 'pending_approval' || entity.lifecycleStatus === 'pending_expiration'
                                ? 'text-slate-300 cursor-not-allowed bg-transparent'
                                : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer'
                            }`}
                            title={entity.lifecycleStatus === 'active' ? "Đã duyệt" : (entity.lifecycleStatus === 'pending_approval' ? "Đang chờ duyệt" : "Trình duyệt")}
                          >
                            <Send className="w-4 h-4" />
                          </button>

                          <div className="w-px h-4 bg-slate-200 mx-1"></div>

                          <button
                            onClick={() => onEdit(entity)}
                            disabled={entity.lifecycleStatus === 'active' || entity.lifecycleStatus === 'pending_approval' || entity.lifecycleStatus === 'pending_expiration'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              entity.lifecycleStatus === 'active' || entity.lifecycleStatus === 'pending_approval' || entity.lifecycleStatus === 'pending_expiration'
                                ? 'text-slate-300 cursor-not-allowed bg-transparent'
                                : 'text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer'
                            }`}
                            title="Sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(entity.id)}
                            disabled={entity.lifecycleStatus === 'active' || entity.lifecycleStatus === 'pending_approval' || entity.lifecycleStatus === 'pending_expiration'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              entity.lifecycleStatus === 'active' || entity.lifecycleStatus === 'pending_approval' || entity.lifecycleStatus === 'pending_expiration'
                                ? 'text-slate-300 cursor-not-allowed bg-transparent'
                                : 'text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer'
                            }`}
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="w-px h-4 bg-slate-200 mx-1"></div>

                          <button
                            onClick={() => onExpireClick(entity)}
                            disabled={entity.lifecycleStatus !== 'active'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              entity.lifecycleStatus !== 'active'
                                ? 'text-slate-300 cursor-not-allowed bg-transparent'
                                : 'text-slate-500 hover:text-orange-600 hover:bg-orange-50 cursor-pointer'
                            }`}
                            title="Hết hiệu lực"
                          >
                            <PowerOff className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={userRole === 'leader' ? 7 : 6} className="px-6 py-8 text-center text-[13px] text-slate-500">
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination block */}
        {renderPagination(filteredEntities.length)}
      </div>
    </div>
  );
}
