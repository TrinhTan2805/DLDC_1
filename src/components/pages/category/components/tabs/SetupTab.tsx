import React, { ChangeEvent, ReactNode } from 'react';
import {
  CheckSquare, XCircle, Search, Filter, Plus,
  X, Eye, SquarePen, Trash2, Send, PowerOff,
  FileText, Clock, Database, MoreVertical
} from 'lucide-react';
import { MasterDataEntity, LifecycleStatus } from '../../categoryTypes';
import { lifecycleLabels, scopeLabels } from '../../categoryConstants';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../../../ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../../../ui/tooltip';
import {
  Badge, TruncatedText, RowIconAction, Pagination, BTN_PRIMARY, ROW_ICON_BTN, MENU_ITEM, TOOLTIP_CLS,
  INPUT_CLS, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, normalizeSearch
} from '../../../collection/collectionUi';

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
  onViewData?: (entity: MasterDataEntity) => void;
}

// Màu badge trạng thái — giữ nguyên ý nghĩa màu cũ
const STATUS_VARIANT: Partial<Record<LifecycleStatus, string>> = {
  active: 'green',
  approved: 'blue',
  pending_approval: 'purple',
  rejected: 'red',
  draft: 'slate',
};

// Mục menu ⋯: bị khóa thì hiển thị lý do ngay trong mục (compomennt.md 5.3.2)
const MenuAction = ({ icon, label, reason, danger, onSelect }: { icon: ReactNode; label: string; reason: string | null; danger?: boolean; onSelect: () => void }) => (
  <DropdownMenuItem
    disabled={!!reason}
    onClick={reason ? undefined : onSelect}
    className={`${MENU_ITEM} items-start ${reason ? '' : danger ? 'text-[#DC2626] focus:text-[#DC2626]' : 'text-[#020817]'}`}
  >
    <span className={`mt-0.5 ${reason ? 'text-[#CBD5E1]' : danger ? 'text-[#DC2626]' : 'text-[#475569]'}`}>{icon}</span>
    <span className="flex flex-col">
      <span>{label}</span>
      {reason && <span className="text-[12px] text-[#64748B]">{reason}</span>}
    </span>
  </DropdownMenuItem>
);

// Điều kiện khả dụng của từng thao tác (giữ nguyên logic cũ) — trả về lý do khi bị khóa
const getActionRules = (entity: MasterDataEntity) => {
  const s = entity.lifecycleStatus;
  return {
    submit: s === 'active' ? 'Đã duyệt'
      : s === 'pending_approval' ? 'Đang chờ duyệt'
      : s === 'pending_expiration' ? 'Đang chờ hết hiệu lực'
      : null,
    edit: s === 'pending_approval' ? 'Đang chờ duyệt'
      : s === 'pending_expiration' ? 'Đang chờ hết hiệu lực'
      : null,
    remove: s === 'active' ? 'Danh mục đang hiệu lực'
      : s === 'pending_approval' ? 'Đang chờ duyệt'
      : s === 'pending_expiration' ? 'Đang chờ hết hiệu lực'
      : null,
    expire: s !== 'active' ? 'Chỉ áp dụng cho danh mục đang hiệu lực' : null,
  };
};

const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';

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
  onExpireClick,
  onViewData
}: SetupTabProps) {
  // Local UI States for Filters & Pagination
  const [showFilters, setShowFilters] = React.useState(false);
  const [currentPageNum, setCurrentPageNum] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [filterScope, setFilterScope] = React.useState<string>('all');
  const [filterManagingAgency, setFilterManagingAgency] = React.useState<string>('all');

  // Điều kiện đã áp dụng: chỉ cập nhật khi bấm nút Tìm kiếm hoặc Enter (mục 5.19)
  const [applied, setApplied] = React.useState({
    search: searchTerm,
    status: filterStatus,
    scope: 'all',
    agency: 'all',
  });

  const runSearch = () => {
    setApplied({ search: searchTerm, status: filterStatus, scope: filterScope, agency: filterManagingAgency });
    setCurrentPageNum(1);
  };

  const managingAgencyOptions = Array.from(new Set(entities.map(e => e.managingAgency).filter(Boolean))) as string[];

  const filteredEntities = entities.filter(e => {
    const q = normalizeSearch(applied.search);
    const matchesSearch = q === '' || normalizeSearch(e.name).includes(q) || normalizeSearch(e.code).includes(q);
    const matchesFilter = applied.status === 'all' || e.lifecycleStatus === applied.status;
    const matchesScope = applied.scope === 'all' || e.scope === applied.scope;
    const matchesManagingAgency = applied.agency === 'all' || e.managingAgency === applied.agency;
    return matchesSearch && matchesFilter && matchesScope && matchesManagingAgency;
  });

  const paginatedEntities = filteredEntities.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const totalCount = entities.length;
  const pendingCount = entities.filter(e => e.lifecycleStatus === 'pending_approval').length;
  const approvedCount = entities.filter(e => e.lifecycleStatus === 'active').length;
  const rejectedCount = entities.filter(e => e.lifecycleStatus === 'inactive').length;

  const stats = [
    { label: 'Tổng số danh mục', value: totalCount, icon: FileText, bg: 'bg-blue-50', fg: 'text-blue-600' },
    { label: 'Chờ phê duyệt', value: pendingCount, icon: Clock, bg: 'bg-orange-50', fg: 'text-orange-600' },
    { label: 'Đã phê duyệt', value: approvedCount, icon: CheckSquare, bg: 'bg-green-50', fg: 'text-green-600' },
    { label: 'Từ chối', value: rejectedCount, icon: XCircle, bg: 'bg-red-50', fg: 'text-red-600' },
  ];

  return (
    <div className="space-y-4">
      {/* Statistics Cards (compomennt.md 5.6.1) */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.fg}`} />
              </div>
              <div>
                <div className="text-[16px] text-[#64748B]">{card.label}</div>
                <div className="text-[16px] font-semibold text-[#0F172A]">{card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Action Bar (compomennt.md 5.19) */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                type="text"
                aria-label="Tìm kiếm danh mục"
                placeholder="Tìm kiếm danh mục theo tên hoặc mã..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
                className={SEARCH_INPUT_CLS}
              />
            </div>
            <button
              type="button"
              aria-label="Tìm kiếm"
              title="Tìm kiếm"
              onClick={runSearch}
              className={SEARCH_BTN_CLS}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Bộ lọc"
              aria-expanded={showFilters}
              onClick={() => setShowFilters(!showFilters)}
              className={filterBtnClass(showFilters)}
              title={showFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onAdd}
              className={BTN_PRIMARY}
              title="Thêm mới danh mục qua Wizard"
            >
              <Plus className="w-4 h-4" />
              Thêm mới
            </button>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
            <div>
              <label className={FILTER_LABEL}>Trạng thái danh mục</label>
              <select
                aria-label="Trạng thái danh mục"
                value={filterStatus}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as LifecycleStatus | 'all')}
                className={INPUT_CLS}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đã hiệu lực</option>
                <option value="draft">Đang soạn thảo</option>
                <option value="inactive">Hết hiệu lực</option>
                <option value="archived">Đã lưu trữ</option>
              </select>
            </div>

            <div>
              <label className={FILTER_LABEL}>Phạm vi</label>
              <select
                aria-label="Phạm vi"
                value={filterScope}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterScope(e.target.value)}
                className={INPUT_CLS}
              >
                <option value="all">Tất cả phạm vi</option>
                <option value="national">Cấp quốc gia</option>
                <option value="ministry">Cấp bộ</option>
                <option value="provincial">Cấp tỉnh/thành</option>
                <option value="internal">Sử dụng nội bộ</option>
              </select>
            </div>

            <div>
              <label className={FILTER_LABEL}>Đơn vị chủ quản</label>
              <select
                aria-label="Đơn vị chủ quản"
                value={filterManagingAgency}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterManagingAgency(e.target.value)}
                className={INPUT_CLS}
              >
                <option value="all">Tất cả đơn vị chủ quản</option>
                {managingAgencyOptions.map(agency => (
                  <option key={agency} value={agency}>{agency}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Entity Table (compomennt.md 5.3) */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px]">
                <th className={`${TH} text-center w-12`}>STT</th>
                <th className={`${TH} text-left min-w-[220px]`}>Tên / Mã danh mục</th>
                <th className={`${TH} text-left min-w-[140px]`}>Đơn vị chủ quản</th>
                <th className={`${TH} text-left w-px`}>Phạm vi</th>
                <th className={`${TH} text-left w-px`}>Người tạo / Ngày tạo</th>
                <th className={`${TH} text-left w-px`}>Trạng thái</th>
                <th className={`${TH} text-center w-px`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEntities.length > 0 ? (
                paginatedEntities.map((entity, index) => {
                  const rules = getActionRules(entity);
                  return (
                    <tr key={entity.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                      <td className={`${TD} text-center whitespace-nowrap`}>{(currentPageNum - 1) * pageSize + index + 1}</td>
                      <td className={`${TD} text-left max-w-[360px] leading-[18px]`}>
                        <TruncatedText text={entity.name} />
                        <TruncatedText text={entity.code} className="text-[#64748B]" />
                      </td>
                      <td className={`${TD} text-left max-w-[240px]`}>
                        <TruncatedText text={entity.managingAgency || '--'} />
                      </td>
                      <td className={`${TD} text-left whitespace-nowrap`}>{scopeLabels[entity.scope] || entity.scope || '--'}</td>
                      <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                        <div>{entity.createdBy || '--'}</div>
                        <div className="text-[#64748B]">{entity.createdDate || '--'}</div>
                      </td>
                      <td className={`${TD} text-left`}>
                        <Badge label={lifecycleLabels[entity.lifecycleStatus].label} variant={STATUS_VARIANT[entity.lifecycleStatus] || 'orange'} />
                      </td>
                      <td className={`${TD} text-center`}>
                        {/* Cột thao tác (compomennt.md 5.3.2): 6 thao tác => Xem chi tiết + Sửa + menu ⋯ */}
                        <div className="inline-flex items-center justify-center gap-1">
                          {onView && (
                            <RowIconAction label="Xem chi tiết" onClick={() => onView(entity)}>
                              <Eye className="w-4 h-4" />
                            </RowIconAction>
                          )}
                          <RowIconAction label="Sửa" disabledReason={rules.edit ?? undefined} onClick={() => onEdit(entity)}>
                            <SquarePen className="w-4 h-4" />
                          </RowIconAction>

                          <DropdownMenu>
                            <Tooltip>
                              {/* Chỉ hiện tooltip khi hover: khi menu đóng focus quay về nút, không để tooltip tự bật đè lên modal */}
                              <TooltipTrigger asChild onFocus={(e: { preventDefault: () => void }) => e.preventDefault()}>
                                <span className="inline-flex">
                                  <DropdownMenuTrigger asChild>
                                    <button type="button" aria-label="Thao tác khác" className={ROW_ICON_BTN}>
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                  </DropdownMenuTrigger>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Thao tác khác</TooltipContent>
                            </Tooltip>
                            <DropdownMenuContent align="end" className="w-56 rounded-lg border border-[#E2E8F0] bg-white shadow-lg p-1">
                              {onViewData && (
                                <MenuAction icon={<Database className="w-4 h-4" />} label="Xem dữ liệu" reason={null}
                                  onSelect={() => onViewData(entity)} />
                              )}
                              <MenuAction icon={<Send className="w-4 h-4" />} label="Trình duyệt" reason={rules.submit}
                                onSelect={() => onSubmitApproval(entity.id, 'category')} />
                              <MenuAction icon={<PowerOff className="w-4 h-4" />} label="Hết hiệu lực" reason={rules.expire}
                                onSelect={() => onExpireClick(entity)} />
                              <MenuAction icon={<Trash2 className="w-4 h-4" />} label="Xóa" reason={rules.remove} danger
                                onSelect={() => onDelete(entity.id)} />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-3 py-16 text-center text-[13px] text-[#64748B]">
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination (compomennt.md 5.14) */}
        {filteredEntities.length > 0 && (
          <Pagination
            className="border-t border-[#E2E8F0]"
            currentPage={currentPageNum}
            totalItems={filteredEntities.length}
            pageSize={pageSize}
            onPageChange={setCurrentPageNum}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>
    </div>
  );
}
