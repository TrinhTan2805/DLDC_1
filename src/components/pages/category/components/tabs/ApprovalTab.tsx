import { useState, useEffect, ChangeEvent } from 'react';
import { Clock, CheckSquare, SquarePen, XCircle, Eye, Ban, CheckCircle2, Search, Edit2 } from 'lucide-react';
import { ApprovalRequest, ApprovalType, ApprovalStatus, MasterDataEntity } from '../../categoryTypes';
import { Badge, TruncatedText, RowIconAction, Pagination, tabClass, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, normalizeSearch } from '../../../collection/collectionUi';

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
  /** Lọc sẵn theo danh mục khi chuyển từ thông báo sau phê duyệt (danh mục ↔ cấu trúc) */
  entityFilter?: { ids: string[]; label: string } | null;
  onClearEntityFilter?: () => void;
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
  approvalStatusLabels,
  entityFilter,
  onClearEntityFilter
}: ApprovalTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // searchInput: giá trị đang gõ; searchTerm: giá trị đã áp dụng (chỉ cập nhật khi bấm Tìm kiếm / Enter)
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const runSearch = () => setSearchTerm(searchInput);

  const typeFilteredRequests = requests.filter(r => r.type === approvalTab);

  const pendingCount = typeFilteredRequests.filter(r => r.status === 'pending').length;
  const approvedCount = typeFilteredRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = typeFilteredRequests.filter(r => r.status === 'rejected').length;
  const partialCount = typeFilteredRequests.filter(r => r.status === 'partial').length;
  const totalCount = typeFilteredRequests.length;

  const filteredRequests = typeFilteredRequests.filter(req => {
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const q = normalizeSearch(searchTerm);
    const matchesSearch = !q || normalizeSearch(req.entityCode).includes(q) || normalizeSearch(req.entityName).includes(q);
    const matchesEntity = !entityFilter || entityFilter.ids.includes(req.entityId);
    return matchesStatus && matchesSearch && matchesEntity;
  });

  useEffect(() => { setCurrentPage(1); setSelectedIds([]); }, [approvalTab, statusFilter, searchTerm, entityFilter]);

  const paginatedRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pendingIds = filteredRequests.filter(r => r.status === 'pending').map(r => r.id);

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === pendingIds.length ? [] : pendingIds);
  };

  const approvalTabs = [
    { key: 'category' as ApprovalType, label: 'Phê duyệt danh mục', icon: SquarePen },
    { key: 'structure' as ApprovalType, label: 'Phê duyệt cấu trúc', icon: SquarePen },
    { key: 'version' as ApprovalType, label: 'Phê duyệt phiên bản', icon: Clock },
    { key: 'expire' as ApprovalType, label: 'Phê duyệt hết hiệu lực', icon: Ban }
  ];



  const statCards = [
    { label: 'Chờ phê duyệt', value: pendingCount, icon: Clock, bg: 'bg-orange-50', fg: 'text-orange-600' },
    { label: 'Đã phê duyệt', value: approvedCount, icon: CheckCircle2, bg: 'bg-green-50', fg: 'text-green-600' },
    { label: 'Từ chối', value: rejectedCount, icon: XCircle, bg: 'bg-red-50', fg: 'text-red-600' },
    { label: 'Tổng yêu cầu', value: totalCount, icon: Edit2, bg: 'bg-blue-50', fg: 'text-blue-600' },
  ];

  const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
  const TD = 'px-3 py-1 text-[13px] text-black';
  const CHECKBOX_CLS = 'w-4 h-4 accent-blue-600 rounded cursor-pointer align-middle';

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h2 className="text-[16px] font-semibold text-[#020817]">{approvalTypeLabels[approvalTab] || 'Phê duyệt danh mục'}</h2>
        <p className="text-[13px] text-[#64748B] mt-0.5">Lãnh đạo nghiệp vụ xem xét và phê duyệt các yêu cầu thay đổi dữ liệu chủ</p>
      </div>

      {/* Approval Types Sub-tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Thẻ con dạng nút (theo thiết kế PM 07/10/2026): đang chọn nền #EAF3FF chữ #155DFC, thường chữ #475569 */}
        <div role="tablist" aria-label="Loại phê duyệt" className="flex items-center gap-1">
          {approvalTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={approvalTab === tab.key}
                onClick={() => {
                  setApprovalTab(tab.key);
                  setStatusFilter('all');
                }}
                className={`h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${approvalTab === tab.key ? 'bg-[#EAF3FF] text-blue-600' : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#020817]'}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 pb-1">
            <span className="text-[13px] text-[#475569]">
              Đã chọn: <span className="font-medium text-blue-600">{selectedIds.length}</span> yêu cầu
            </span>
            <button
              type="button"
              onClick={() => onQuickApprove(selectedIds)}
              className={BTN_PRIMARY}
            >
              <CheckCircle2 className="w-4 h-4" />
              Phê duyệt nhanh
            </button>
            <button
              type="button"
              onClick={() => onQuickReject(selectedIds)}
              className={BTN_DESTRUCTIVE}
            >
              <XCircle className="w-4 h-4" />
              Từ chối nhanh
            </button>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.fg}`} />
                </div>
                <div>
                  <div className="text-[16px] text-[#64748B]">{card.label}</div>
                  <div className="text-[16px] font-semibold text-[#0F172A]">{card.value}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chip lọc theo danh mục (khi chuyển từ thông báo sau phê duyệt) */}
      {entityFilter && (
        <div className="flex items-center gap-2 text-[13px] text-[#475569]">
          <span>Đang lọc theo danh mục:</span>
          <span className="inline-flex items-center gap-1 h-[26px] pl-2 pr-1 rounded-2xl border border-[#BFDBFE] bg-[#EAF3FF] text-blue-600">
            {entityFilter.label}
            <button
              type="button"
              aria-label="Bỏ lọc theo danh mục"
              title="Bỏ lọc"
              onClick={onClearEntityFilter}
              className="w-5 h-5 inline-flex items-center justify-center rounded-full hover:bg-[#BFDBFE] outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          </span>
        </div>
      )}

      {/* Search & Status Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 flex items-center gap-1.5">
          <input
            type="text"
            aria-label="Tìm kiếm yêu cầu phê duyệt"
            title="Tìm kiếm yêu cầu phê duyệt"
            placeholder="Tìm kiếm theo mã, tên danh mục..."
            value={searchInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
            className={SEARCH_INPUT_CLS}
          />
          <button
            type="button"
            aria-label="Tìm kiếm"
            title="Tìm kiếm"
            onClick={runSearch}
            className={SEARCH_BTN_CLS}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { key: 'all' as const, label: 'Tất cả' },
            { key: 'pending' as const, label: 'Chờ phê duyệt' },
            { key: 'approved' as const, label: 'Đã phê duyệt' },
            { key: 'rejected' as const, label: 'Từ chối' },
          ].map(opt => (
            <button
              key={opt.key}
              type="button"
              aria-pressed={statusFilter === opt.key}
              onClick={() => setStatusFilter(opt.key)}
              className={statusFilter === opt.key
                ? `${BTN_OUTLINE} !bg-[#EAF3FF] !border-[#BFDBFE] !text-[#155DFC]`
                : BTN_OUTLINE}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px] border-b border-[#E0E0E0]">
                <th className={`${TH} text-center w-12`}>
                  <input
                    type="checkbox"
                    title="Chọn tất cả"
                    aria-label="Chọn tất cả"
                    checked={pendingIds.length > 0 && selectedIds.length === pendingIds.length}
                    onChange={toggleSelectAll}
                    className={CHECKBOX_CLS}
                  />
                </th>
                <th className={`${TH} text-center w-14`}>STT</th>
                <th className={`${TH} text-left`}>Mã danh mục</th>
                <th className={`${TH} text-left`}>Tên danh mục</th>
                {approvalTab !== 'structure' ? (
                  <>
                    <th className={`${TH} text-left`}>Đơn vị chủ quản</th>
                    <th className={`${TH} text-left`}>Nguồn dữ liệu</th>
                    <th className={`${TH} text-left`}>Ngày gửi</th>
                    <th className={`${TH} text-left`}>Người gửi</th>
                  </>
                ) : (
                  <>
                    <th className={`${TH} text-right`}>Số trường dữ liệu</th>
                    <th className={`${TH} text-right`}>Số quan hệ</th>
                  </>
                )}
                <th className={`${TH} text-left`}>Trạng thái</th>
                <th className={`${TH} text-center w-[120px] sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={approvalTab !== 'structure' ? 10 : 8} className="py-16 text-center text-[13px] text-[#64748B]">
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
                  const [reqDate, ...reqTimeParts] = (req.requestedDate || '').split(' ');
                  const reqTime = reqTimeParts.join(' ');
                  const isPending = req.status === 'pending';
                  const isApproved = req.status === 'approved' || req.status === 'partial';

                  return (
                    <tr key={req.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                      <td className={`${TD} text-center`}>
                        {isPending && (
                          <input
                            type="checkbox"
                            title="Chọn bản ghi"
                            aria-label="Chọn bản ghi"
                            checked={selectedIds.includes(req.id)}
                            onChange={() => toggleSelectOne(req.id)}
                            className={CHECKBOX_CLS}
                          />
                        )}
                      </td>
                      <td className={`${TD} text-center`}>{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className={`${TD} max-w-[200px]`}><TruncatedText text={req.entityCode} /></td>
                      <td className={`${TD} max-w-[360px]`}><TruncatedText text={req.entityName} /></td>
                      {approvalTab !== 'structure' ? (
                        <>
                          <td className={`${TD} max-w-[260px]`}>
                            <TruncatedText text={entity?.managingAgency || 'Cục Hộ tịch - Quốc tịch - Chứng thực'} />
                          </td>
                          <td className={`${TD} max-w-[200px]`}>
                            <TruncatedText text={entity?.dataSource ? dataSourceLabel[entity.dataSource] : 'Tự cập nhật trực tiếp'} />
                          </td>
                          <td className={`${TD} whitespace-nowrap leading-[18px]`}>
                            <div>{reqDate}</div>
                            {reqTime && <div className="text-[#64748B]">{reqTime}</div>}
                          </td>
                          <td className={`${TD} max-w-[200px]`}><TruncatedText text={req.requestedBy} /></td>
                        </>
                      ) : (
                        <>
                          <td className={`${TD} text-right tabular-nums`}>3</td>
                          <td className={`${TD} text-right tabular-nums`}>2</td>
                        </>
                      )}
                      <td className={TD}>
                        <Badge
                          label={isApproved ? 'Đã phê duyệt' : approvalStatusLabels[req.status].label}
                          variant={isPending ? 'orange' : isApproved ? 'green' : 'red'}
                        />
                      </td>
                      <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>
                        <div className="flex items-center justify-center gap-1">
                          <RowIconAction label="Xem chi tiết" onClick={() => onViewDetail(req)}>
                            <Eye className="w-4 h-4" />
                          </RowIconAction>
                          <RowIconAction
                            label="Phê duyệt"
                            onClick={() => { if (isPending) onApproveClick(req); }}
                            disabledReason={isPending ? undefined : 'Đã xử lý'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </RowIconAction>
                          <RowIconAction
                            label="Từ chối"
                            onClick={() => { if (isPending) onRejectClick(req); }}
                            disabledReason={isPending ? undefined : 'Đã xử lý'}
                          >
                            <XCircle className="w-4 h-4" />
                          </RowIconAction>
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
          <Pagination
            className="border-t border-[#E2E8F0]"
            currentPage={currentPage}
            totalItems={filteredRequests.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
          />
        )}
      </div>
    </div>
  );
}
