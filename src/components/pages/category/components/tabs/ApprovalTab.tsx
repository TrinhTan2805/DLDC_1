import { useState, useEffect, ChangeEvent } from 'react';
import { Clock, CheckSquare, XCircle, Eye, Ban, CheckCircle2, Search, Edit2 } from 'lucide-react';
import { ApprovalRequest, ApprovalType, ApprovalStatus, MasterDataEntity } from '../../categoryTypes';

interface ApprovalTabProps {
  entities: MasterDataEntity[];
  approvalTab: ApprovalType;
  setApprovalTab: (tab: ApprovalType) => void;
  requests: ApprovalRequest[];
  statusFilter: ApprovalStatus | 'all';
  setStatusFilter: (status: ApprovalStatus | 'all') => void;
  onViewDetail: (req: ApprovalRequest) => void;
  onApproveClick: (req: ApprovalRequest) => void;
  onRejectClick: (req: ApprovalRequest) => void;
  onApproveAll: (type: ApprovalType | 'all') => void;
  onQuickApprove: (ids: string[]) => void;
  onQuickReject: (ids: string[]) => void;
  approvalTypeLabels: Record<ApprovalType, string>;
  approvalStatusLabels: Record<ApprovalStatus, { label: string; color: string }>;
}

export function ApprovalTab({
  entities,
  approvalTab,
  setApprovalTab,
  requests,
  statusFilter,
  setStatusFilter,
  onViewDetail,
  onApproveClick,
  onRejectClick,
  onApproveAll,
  onQuickApprove,
  onQuickReject,
  approvalTypeLabels,
  approvalStatusLabels
}: ApprovalTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const typeFilteredRequests = requests.filter(r => r.type === approvalTab);

  const pendingCount = typeFilteredRequests.filter(r => r.status === 'pending').length;
  const approvedCount = typeFilteredRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = typeFilteredRequests.filter(r => r.status === 'rejected').length;
  const partialCount = typeFilteredRequests.filter(r => r.status === 'partial').length;
  const totalCount = typeFilteredRequests.length;

  const filteredRequests = typeFilteredRequests.filter(req => {
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q || req.entityCode.toLowerCase().includes(q) || req.entityName.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  useEffect(() => { setCurrentPage(1); setSelectedIds([]); }, [approvalTab, statusFilter, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pendingIds = filteredRequests.filter(r => r.status === 'pending').map(r => r.id);

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === pendingIds.length ? [] : pendingIds);
  };

  const approvalTabs = [
    { key: 'category' as ApprovalType, label: 'Phê duyệt danh mục', icon: CheckSquare },
    { key: 'structure' as ApprovalType, label: 'Phê duyệt cấu trúc', icon: CheckSquare },
    { key: 'version' as ApprovalType, label: 'Phê duyệt phiên bản', icon: Clock },
    { key: 'expire' as ApprovalType, label: 'Phê duyệt hết hiệu lực', icon: Ban }
  ];



  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h2 className="text-[18px] font-bold text-slate-800">{approvalTypeLabels[approvalTab] || 'Phê duyệt danh mục'}</h2>
        <p className="text-[13px] text-slate-500 mt-0.5">Lãnh đạo nghiệp vụ xem xét và phê duyệt các yêu cầu thay đổi dữ liệu chủ</p>
      </div>

      {/* Approval Types Sub-tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {approvalTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setApprovalTab(tab.key);
                  setStatusFilter('all');
                }}
                className={`px-4 py-2 rounded-lg text-[13px] transition-all flex items-center gap-2 ${approvalTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-slate-600">
              Đã chọn: <span className="font-semibold text-blue-600">{selectedIds.length}</span> yêu cầu
            </span>
            <button
              onClick={() => onQuickApprove(selectedIds)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-[13px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              Phê duyệt nhanh
            </button>
            <button
              onClick={() => onQuickReject(selectedIds)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-[13px]"
            >
              <XCircle className="w-4 h-4" />
              Từ chối nhanh
            </button>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-orange-700">Chờ phê duyệt</p>
              <p className="text-2xl text-orange-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-green-700">Đã phê duyệt</p>
              <p className="text-2xl text-green-900">{approvedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-red-700">Từ chối</p>
              <p className="text-2xl text-red-900">{rejectedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Edit2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-blue-700">Tổng yêu cầu</p>
              <p className="text-2xl text-blue-900">{totalCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              title="Tìm kiếm yêu cầu phê duyệt"
              placeholder="Tìm kiếm theo mã, tên danh mục..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: 'all' as const, label: 'Tất cả', activeClass: 'bg-slate-700 text-white border-slate-700' },
              { key: 'pending' as const, label: 'Chờ phê duyệt', activeClass: 'bg-orange-500 text-white border-orange-500' },
              { key: 'approved' as const, label: 'Đã phê duyệt', activeClass: 'bg-green-600 text-white border-green-600' },
              { key: 'rejected' as const, label: 'Từ chối', activeClass: 'bg-red-500 text-white border-red-500' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setStatusFilter(opt.key)}
                className={`px-3 py-2 text-[13px] rounded-lg border transition-all font-medium cursor-pointer ${statusFilter === opt.key
                    ? opt.activeClass
                    : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full approval-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    title="Chọn tất cả"
                    checked={pendingIds.length > 0 && selectedIds.length === pendingIds.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 uppercase tracking-tight">STT</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 uppercase tracking-tight">Mã danh mục</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 uppercase tracking-tight">Tên danh mục</th>
                {approvalTab !== 'structure' ? (
                  <>
                    <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 uppercase tracking-tight">Đơn vị chủ quản</th>
                    <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 uppercase tracking-tight">Nguồn dữ liệu</th>
                    <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 uppercase tracking-tight">Ngày gửi</th>
                    <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 uppercase tracking-tight">Người gửi</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 uppercase tracking-tight">Số trường dữ liệu</th>
                    <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 uppercase tracking-tight">Số quan hệ</th>
                  </>
                )}
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 uppercase tracking-tight">Trạng thái</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 uppercase tracking-tight">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={approvalTab !== 'structure' ? 10 : 8} className="p-12 text-center text-slate-500 italic text-[14px]">
                    Không có yêu cầu phê duyệt nào phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req, index) => {
                  const entity = entities.find((e: any) => e.id === req.entityId);
                  const dataSourceLabel: Record<string, string> = {
                    manual: 'Tự cập nhật trực tiếp',
                    dldc: 'Đồng bộ Kho DLDC',
                  };

                  return (
                    <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        {req.status === 'pending' && (
                          <input
                            type="checkbox"
                            title="Chọn bản ghi"
                            checked={selectedIds.includes(req.id)}
                            onChange={() => toggleSelectOne(req.id)}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-slate-600">{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-700">{req.entityCode}</td>
                      <td className="px-4 py-3 text-[13px] font-semibold text-slate-800">{req.entityName}</td>
                      {approvalTab !== 'structure' ? (
                        <>
                          <td className="px-4 py-3 text-[13px] text-slate-600">
                            {entity?.managingAgency || 'Cục Hộ tịch - Quốc tịch - Chứng thực'}
                          </td>
                          <td className="px-4 py-3 text-[13px] text-slate-600">
                            {entity?.dataSource ? dataSourceLabel[entity.dataSource] : 'Tự cập nhật trực tiếp'}
                          </td>
                          <td className="px-4 py-3 text-[13px] text-slate-600">{req.requestedDate}</td>
                          <td className="px-4 py-3 text-[13px] text-slate-600">{req.requestedBy}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-[13px] text-slate-600">3</td>
                          <td className="px-4 py-3 text-[13px] text-slate-600">2</td>
                        </>
                      )}
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[13px] border whitespace-nowrap ${req.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                          (req.status === 'approved' || req.status === 'partial') ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-red-50 text-red-600 border-red-200'
                          }`}>
                          {(req.status === 'approved' || req.status === 'partial') ? 'Đã phê duyệt' : approvalStatusLabels[req.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onViewDetail(req)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => req.status === 'pending' && onApproveClick(req)}
                            disabled={req.status !== 'pending'}
                            className={`p-1 rounded transition-colors ${req.status === 'pending' ? 'text-green-600 hover:bg-green-50 cursor-pointer' : 'text-slate-300 cursor-not-allowed'
                              }`}
                            title={req.status === 'pending' ? 'Phê duyệt' : 'Đã xử lý'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => req.status === 'pending' && onRejectClick(req)}
                            disabled={req.status !== 'pending'}
                            className={`p-1 rounded transition-colors ${req.status === 'pending' ? 'text-red-600 hover:bg-red-50 cursor-pointer' : 'text-slate-300 cursor-not-allowed'
                              }`}
                            title={req.status === 'pending' ? 'Từ chối' : 'Đã xử lý'}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredRequests.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-normal">Hiển thị</span>
              <select
                aria-label="Số bản ghi trên trang"
                value={pageSize}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
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
              <span className="text-slate-600 font-normal">
                {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredRequests.length)} / {filteredRequests.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${currentPage === page ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
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
