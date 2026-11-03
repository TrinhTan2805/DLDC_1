import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Search, Filter, X, Plus, Eye, Play, RefreshCw, Eraser, Clock, MoreVertical, SquarePen, Trash2, Layers, Activity, FileText, AlertTriangle } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '../../../ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../../ui/tooltip';
import { ConfirmModal } from '../../../common/ConfirmModal';
import {
  Badge, TruncatedText, BTN_PRIMARY, ROW_ICON_BTN, MenuAction, RowIconAction, TOOLTIP_CLS, INPUT_CLS, SEARCH_INPUT_CLS, SEARCH_BTN_CLS,
  filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, TABLE_HEAD_BG, TABLE_HEAD_ROW_CLS, TABLE_WRAP_CLS, Pagination, normalizeSearch, formatDateVN,
} from '../../collection/collectionUi';
import { initialTargetDatabases } from '../mockTargetDatabases';
import {
  MergeConfig, MergeRunLog, initialMergeConfigs, mergeRunLogs, getSourceGroup, findDataset, combineFamily, hasMergeData as hasData, mergeActionReasons,
  MERGE_STATUS_LABEL, MERGE_STATUS_VARIANT, RUN_RESULT_LABEL, RUN_RESULT_VARIANT,
} from './mockDataMerge';
import { DataMergeWizard } from './DataMergeWizard';
import { DataMergeDetail } from './DataMergeDetail';
// Dùng lại popup lập lịch của màn Xử lý dữ liệu (không sửa file cũ)
import { ScheduleManagementModal } from '../ScheduleManagementModal';

const TH = 'px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-left text-black text-[13px]';
const STICKY_SHADOW = 'shadow-[-6px_0_6px_-6px_rgba(15,23,42,0.18)]';

const fmt = (n: number) => n.toLocaleString('vi-VN');

const StatCard = ({ icon, tone, label, value }: { icon: ReactNode; tone: string; label: string; value: number }) => (
  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${tone}`}>{icon}</div>
      <div>
        <div className="text-[16px] text-[#64748B]">{label}</div>
        <div className="text-[16px] font-semibold text-[#0F172A]">{value}</div>
      </div>
    </div>
  </div>
);

export function DataMergePage() {
  const [configs, setConfigs] = useState<MergeConfig[]>(initialMergeConfigs);
  const [runs, setRuns] = useState<MergeRunLog[]>(mergeRunLogs);
  const [viewingId, setViewingId] = useState<string | null>(null);

  // Tìm kiếm: chỉ áp dụng khi bấm Tìm kiếm / Enter (mục 5.19)
  const [keyword, setKeyword] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [draftFilters, setDraftFilters] = useState({ group: 'all', type: 'all', db: 'all', status: 'all' });
  const [applied, setApplied] = useState({ keyword: '', group: 'all', type: 'all', db: 'all', status: 'all' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Wizard & popup
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editing, setEditing] = useState<MergeConfig | null>(null);
  const [scheduling, setScheduling] = useState<MergeConfig | null>(null);
  const [confirm, setConfirm] = useState<{ kind: 'delete' | 'run' | 'clearData'; config: MergeConfig } | null>(null);

  const runSearch = () => { setApplied({ keyword, ...draftFilters }); setPage(1); };

  const filtered = configs.filter(c => {
    const q = normalizeSearch(applied.keyword);
    const db = initialTargetDatabases.find(d => d.id === c.targetDbId);
    return (!q || normalizeSearch(`${c.name} ${c.code} ${c.targetTable} ${db?.name || ''}`).includes(q))
      && (applied.group === 'all' || getSourceGroup(c.sources) === applied.group)
      && (applied.type === 'all' || combineFamily(c) === applied.type)
      && (applied.db === 'all' || c.targetDbId === applied.db)
      && (applied.status === 'all' || c.status === applied.status);
  });
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = {
    total: configs.length,
    active: configs.filter(c => c.status === 'active').length,
    draft: configs.filter(c => c.status === 'draft').length,
    needsConfig: configs.filter(c => c.status === 'needs_config').length,
  };

  const openCreate = () => { setEditing(null); setWizardOpen(true); };
  // Có dữ liệu vẫn mở wizard nhưng khóa các bước Chọn nguồn / Kết hợp / Bảng đích & ánh xạ (wizard tự khóa)
  const openEdit = (c: MergeConfig) => { setEditing(c); setWizardOpen(true); };

  const handleSave = (cfg: MergeConfig, activate: boolean) => {
    const status = activate ? 'active' : (cfg.id ? (cfg.status === 'active' ? 'active' : 'draft') : 'draft');
    if (cfg.id) {
      setConfigs(prev => prev.map(c => c.id === cfg.id ? { ...cfg, status } : c));
      toast.success(activate ? 'Cập nhật và kích hoạt cấu hình hợp nhất thành công' : 'Lưu cấu hình hợp nhất thành công');
    } else {
      const created: MergeConfig = { ...cfg, id: `mc-${Date.now()}`, status, createdAt: formatDateVN(new Date(), true) };
      setConfigs(prev => [created, ...prev]);
      toast.success(activate ? 'Thêm mới và kích hoạt cấu hình hợp nhất thành công' : 'Lưu nháp cấu hình hợp nhất thành công');
    }
    setWizardOpen(false);
  };

  const runNow = (c: MergeConfig) => {
    const now = formatDateVN(new Date(), true);
    const first = !hasData(c);
    // Chưa có dữ liệu → chạy toàn bộ; đã có → cập nhật tăng dần theo thay đổi của nguồn
    // Số dòng mẫu: Union thì cộng mọi nguồn, Join thì theo bảng chính
    const loaded = c.combineType === 'union'
      ? c.sources.reduce((t, s) => t + (findDataset(s.datasetId)?.records || 0), 0)
      : findDataset(c.baseTable || c.sources[0]?.datasetId || '')?.records || 0;
    const log: MergeRunLog = {
      id: Date.now().toString().slice(-4), configId: c.id, activity: first ? 'convert' : 'update', createdAt: now, startedAt: now, endedAt: now, duration: '—', result: 'success',
      perSource: c.sources.map(s => ({ datasetId: s.datasetId, inserted: first ? findDataset(s.datasetId)?.records || 0 : 0, updated: 0, deleted: 0 })), createdBy: 'Nguyễn Văn A',
    };
    setRuns(prev => [log, ...prev]);
    setConfigs(prev => prev.map(x => x.id === c.id ? { ...x, dataCount: first ? loaded : x.dataCount, lastRun: { at: now, result: 'success' } } : x));
    toast.success(first ? `Đã khởi tạo yêu cầu chuyển đổi dữ liệu: ${c.name}` : `Đã khởi tạo yêu cầu cập nhật dữ liệu: ${c.name}`);
  };

  const onConfirm = () => {
    if (!confirm) return;
    const { kind, config } = confirm;
    if (kind === 'delete') {
      setConfigs(prev => prev.filter(c => c.id !== config.id));
      if (viewingId === config.id) setViewingId(null);
      toast.success('Xóa cấu hình hợp nhất thành công');
    }
    if (kind === 'run') runNow(config);
    if (kind === 'clearData') {
      const now = formatDateVN(new Date(), true);
      setRuns(prev => [{
        id: Date.now().toString().slice(-4), configId: config.id, activity: 'clear', createdAt: now, startedAt: now, endedAt: now, duration: '—', result: 'success',
        perSource: [], clearedRecords: config.dataCount, createdBy: 'Nguyễn Văn A',
      }, ...prev]);
      setConfigs(prev => prev.map(c => c.id === config.id ? { ...c, dataCount: 0, } : c));
      toast.success(`Xóa dữ liệu bảng ${config.targetTable} của cấu hình ${config.code} thành công`);
    }
  };

  const confirmText = confirm && {
    delete: {
      type: 'delete' as const, title: 'Xác nhận xóa', subtitle: 'Hành động này không thể hoàn tác.', confirmText: 'Xóa',
      message: <>Bạn có chắc chắn muốn xóa cấu hình hợp nhất <b>"{confirm.config.name}"</b>?</>,
    },
    run: hasData(confirm.config) ? {
      type: 'info' as const, title: 'Xác nhận cập nhật dữ liệu', subtitle: 'Hệ thống chạy tăng dần theo thay đổi của các nguồn.', confirmText: 'Cập nhật',
      message: <>Cập nhật dữ liệu bảng <b>{confirm.config.targetTable}</b> theo cấu hình <b>"{confirm.config.name}"</b>?</>,
    } : {
      type: 'info' as const, title: 'Xác nhận chuyển đổi dữ liệu', subtitle: 'Lần chạy đầu: hợp nhất toàn bộ dữ liệu các nguồn.', confirmText: 'Chuyển đổi',
      message: <>Chạy hợp nhất <b>"{confirm.config.name}"</b> vào bảng <b>{confirm.config.targetTable}</b> ngay bây giờ?</>,
    },
    clearData: {
      type: 'delete' as const, title: 'Xác nhận xóa dữ liệu', subtitle: 'Hành động này không thể hoàn tác.', confirmText: 'Xóa dữ liệu',
      message: <>Bạn có chắc chắn muốn xóa <b>{fmt(confirm.config.dataCount)}</b> bản ghi mà cấu hình <b>"{confirm.config.name}"</b> đã ghi vào bảng <b>{confirm.config.targetTable}</b>? Xóa xong có thể Chuyển đổi dữ liệu lại hoặc chỉnh sửa toàn bộ cấu hình.</>,
    },
  }[confirm.kind];

  const viewing = configs.find(c => c.id === viewingId);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      {viewing ? (
        <DataMergeDetail
          config={viewing}
          runs={runs.filter(r => r.configId === viewing.id)}
          onBack={() => setViewingId(null)}
          onEdit={() => openEdit(viewing)}
          onRun={() => setConfirm({ kind: 'run', config: viewing })}
          onClearData={() => setConfirm({ kind: 'clearData', config: viewing })}
          onSchedule={() => setScheduling(viewing)}
        />
      ) : (
        <div className="space-y-4">
          {/* Thẻ thống kê (mục 5.6.1) */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={<Layers className="w-5 h-5 text-blue-600" />} tone="bg-blue-50" label="Tổng số cấu hình hợp nhất" value={stats.total} />
            <StatCard icon={<Activity className="w-5 h-5 text-green-600" />} tone="bg-green-50" label="Đang hoạt động" value={stats.active} />
            <StatCard icon={<FileText className="w-5 h-5 text-yellow-600" />} tone="bg-yellow-50" label="Bản nháp" value={stats.draft} />
            <StatCard icon={<AlertTriangle className="w-5 h-5 text-red-600" />} tone="bg-red-50" label="Cần cấu hình lại" value={stats.needsConfig} />
          </div>

          {/* Thanh tìm kiếm & bộ lọc (mục 5.19) */}
          <div className="-mx-0.5 px-0.5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-1.5">
                <input
                  aria-label="Tìm kiếm cấu hình hợp nhất"
                  type="text"
                  placeholder="Tìm kiếm theo tên cấu hình, mã cấu hình, bảng đích"
                  className={SEARCH_INPUT_CLS}
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') runSearch(); }}
                />
                <button type="button" aria-label="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
                  <Search className="w-5 h-5" />
                </button>
                <button type="button" aria-label="Bộ lọc" aria-expanded={showFilters} onClick={() => setShowFilters(!showFilters)} className={filterBtnClass(showFilters)}>
                  {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={openCreate} className={BTN_PRIMARY}>
                  <Plus className="w-4 h-4" />
                  Thêm mới
                </button>
              </div>
            </div>

            {showFilters && (
              <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
                <div>
                  <label className={FILTER_LABEL}>Loại nguồn</label>
                  <select aria-label="Loại nguồn" className={INPUT_CLS} value={draftFilters.group} onChange={e => setDraftFilters({ ...draftFilters, group: e.target.value })}>
                    <option value="all">Tất cả loại nguồn</option>
                    <option value="Trong ngành">Trong ngành</option>
                    <option value="Ngoài ngành">Ngoài ngành</option>
                    <option value="Kết hợp">Kết hợp</option>
                  </select>
                </div>
                <div>
                  <label className={FILTER_LABEL}>Kiểu hợp nhất</label>
                  <select aria-label="Kiểu hợp nhất" className={INPUT_CLS} value={draftFilters.type} onChange={e => setDraftFilters({ ...draftFilters, type: e.target.value })}>
                    <option value="all">Tất cả kiểu</option>
                    <option value="UNION">UNION – Nối hàng</option>
                    <option value="JOIN">JOIN – Ghép cột</option>
                  </select>
                </div>
                <div>
                  <label className={FILTER_LABEL}>CSDL đích</label>
                  <select aria-label="CSDL đích" className={INPUT_CLS} value={draftFilters.db} onChange={e => setDraftFilters({ ...draftFilters, db: e.target.value })}>
                    <option value="all">Tất cả CSDL đích</option>
                    {initialTargetDatabases.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={FILTER_LABEL}>Trạng thái</label>
                  <select aria-label="Trạng thái" className={INPUT_CLS} value={draftFilters.status} onChange={e => setDraftFilters({ ...draftFilters, status: e.target.value })}>
                    <option value="all">Tất cả trạng thái</option>
                    {Object.entries(MERGE_STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Bảng danh sách (mục 5.3) */}
          <div className={TABLE_WRAP_CLS}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse collection-table text-[13px]">
                <thead className={`${TABLE_HEAD_BG} sticky top-0 z-[1]`}>
                  <tr className={TABLE_HEAD_ROW_CLS}>
                    <th className={`${TH} !text-center w-12`}>STT</th>
                    <th className={`${TH} min-w-[200px]`}>Tên / Mã cấu hình</th>
                    <th className={TH}>Loại nguồn</th>
                    <th className={TH}>Kiểu</th>
                    <th className={TH}>CSDL / Bảng đích</th>
                    <th className={TH}>Người tạo / Ngày tạo</th>
                    <th className={TH}>Trạng thái</th>
                    <th className={TH}>Dữ liệu đích</th>
                    <th className={`${TH} !text-center sticky right-0 ${TABLE_HEAD_BG} ${STICKY_SHADOW}`}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-10 text-center">
                        <div className="flex flex-col items-center gap-2 text-[#64748B]">
                          <Layers className="w-8 h-8 text-[#94A3B8]" />
                          <span className="text-[13px]">Không có cấu hình hợp nhất phù hợp</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {pageItems.map((c, idx) => {
                    const db = initialTargetDatabases.find(d => d.id === c.targetDbId);
                    const reasons = mergeActionReasons(c);
                    return (
                      <tr key={c.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                        <td className={`${TD} text-center whitespace-nowrap`}>{(page - 1) * pageSize + idx + 1}</td>
                        <td className={`${TD} max-w-[320px] leading-[18px]`}>
                          <div className="w-[200px]">
                            <TruncatedText text={c.name} extra={c.description} />
                            <TruncatedText text={c.code} className="text-[#64748B]" />
                          </div>
                        </td>
                        <td className={TD}><Badge label={getSourceGroup(c.sources)} variant="slate" /></td>
                        <td className={TD}>
                          {combineFamily(c) ? <Badge label={combineFamily(c)} variant={c.combineType === 'join' ? 'indigo' : 'emerald'} /> : <span className="text-[#64748B]">-</span>}
                        </td>
                        <td className={`${TD} max-w-[240px] leading-[18px]`}>
                          <TruncatedText text={db?.name || '-'} />
                          <TruncatedText text={c.targetTable || '-'} className="text-[#64748B] font-mono" />
                        </td>
                        <td className={`${TD} whitespace-nowrap leading-[18px]`}>
                          <div>{c.createdBy}</div>
                          <div className="text-[#64748B]">{c.createdAt}</div>
                        </td>
                        <td className={`${TD} whitespace-nowrap`}><Badge label={MERGE_STATUS_LABEL[c.status]} variant={MERGE_STATUS_VARIANT[c.status]} /></td>
                        <td className={`${TD} whitespace-nowrap leading-[18px]`}>
                          <div className="tabular-nums">{hasData(c) ? `${fmt(c.dataCount)} bản ghi` : <span className="text-[#64748B]">Chưa có dữ liệu</span>}</div>
                          {c.lastRun ? (
                            <div title={`Lần chạy gần nhất: ${c.lastRun.at}`} className={c.lastRun.result === 'failed' ? 'text-[#DC2626]' : c.lastRun.result === 'partial' ? 'text-[#D97706]' : 'text-[#16A34A]'}>
                              {RUN_RESULT_LABEL[c.lastRun.result]}
                            </div>
                          ) : <div className="text-[#64748B]">Chưa chạy</div>}
                        </td>
                        <td className={`px-3 py-1 text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors ${STICKY_SHADOW}`}>
                          {/* 5 thao tác → 2 nút icon + menu ⋯ (mục 5.3.2) */}
                          <div className="inline-flex items-center justify-center gap-1">
                            <RowIconAction label="Xem chi tiết" onClick={() => setViewingId(c.id)}>
                              <Eye className="w-4 h-4" />
                            </RowIconAction>
                            <RowIconAction label={hasData(c) ? 'Cập nhật dữ liệu' : 'Chuyển đổi dữ liệu'} disabledReason={hasData(c) ? reasons.update : reasons.convert} onClick={() => setConfirm({ kind: 'run', config: c })}>
                              {hasData(c) ? <RefreshCw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </RowIconAction>
                            <DropdownMenu>
                              <Tooltip>
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
                                <MenuAction icon={<SquarePen className="w-4 h-4" />} label="Chỉnh sửa" onSelect={() => openEdit(c)} />
                                <MenuAction icon={<Clock className="w-4 h-4" />} label="Thêm lịch biểu" reason={reasons.schedule} onSelect={() => setScheduling(c)} />
                                <MenuAction icon={<Eraser className="w-4 h-4" />} label="Xóa dữ liệu" reason={reasons.clear} onSelect={() => setConfirm({ kind: 'clearData', config: c })} />
                                <MenuAction icon={<Trash2 className="w-4 h-4" />} label="Xóa cấu hình" danger reason={reasons.remove} onSelect={() => setConfirm({ kind: 'delete', config: c })} />
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              className="border-t border-[#E2E8F0]"
              currentPage={page}
              totalItems={filtered.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      )}

      <ScheduleManagementModal
        isOpen={!!scheduling}
        onClose={() => setScheduling(null)}
        systemName={`Hợp nhất dữ liệu · ${scheduling?.code || ''}`}
        datasetName={scheduling?.name || ''}
      />

      <DataMergeWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} initial={editing} onSave={handleSave} />

      {confirm && confirmText && (
        <ConfirmModal
          isOpen
          onClose={() => setConfirm(null)}
          onConfirm={onConfirm}
          type={confirmText.type}
          title={confirmText.title}
          subtitle={confirmText.subtitle}
          message={confirmText.message}
          confirmText={confirmText.confirmText}
        />
      )}
    </div>
  );
}

export default DataMergePage;
