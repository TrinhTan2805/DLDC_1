import { useState } from 'react';
import { toast } from 'sonner';
import { Filter, ArrowUpDown, FileSpreadsheet, Columns, Trash2, RefreshCw, Plus, Layers, Check, X, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockTableData } from './mockTargetDatabases';
import { Pagination, normalizeSearch } from '../collection/collectionUi';
import { ConfirmModal } from '../../common/ConfirmModal';

// Tab "Dữ liệu sau xử lý" (Xử lý dữ liệu) — bảng dữ liệu trong CSDL đích sau khi chạy xử lý.
// Thanh công cụ + bộ lọc nâng cao + sắp xếp + ẩn/hiện cột giống tab "Dữ liệu bảng" ở màn Xem chi tiết CSDL đích
// (TargetDatabaseDetailPage); cùng nguồn dữ liệu mockTableData. Áp dụng lọc / sắp xếp có tác dụng trên dữ liệu mẫu.
const OUTPUT_TABLE = 'DIP_PERSON';

interface FilterCondition { id: string; type: 'condition'; field: string; operator: string; value: string; logic: 'AND' | 'OR' }
interface FilterGroup { id: string; type: 'group'; logic: 'AND' | 'OR'; conditions: Omit<FilterCondition, 'type' | 'logic'>[] }
type FilterItem = FilterCondition | FilterGroup;
interface SortCondition { id: string; field: string; order: 'ASC' | 'DESC' }

const SELECT_CLS = 'px-3 py-1.5 border border-slate-300 rounded text-[13px] focus:outline-none focus:border-blue-500 bg-white';
const TOOL_BTN = (on: boolean) => `flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border rounded transition-colors ${on ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`;
const OPERATORS = [
  { value: '=', label: 'Bằng (=)' }, { value: '!=', label: 'Khác (!=)' }, { value: 'LIKE', label: 'Chứa' },
  { value: '>', label: 'Lớn hơn (>)' }, { value: '<', label: 'Nhỏ hơn (<)' },
];

const matchCond = (row: Record<string, any>, c: { field: string; operator: string; value: string }) => {
  if (!c.value.trim()) return true;
  const raw = row[c.field];
  const a = normalizeSearch(String(raw ?? '')), b = normalizeSearch(c.value);
  const na = Number(raw), nb = Number(c.value);
  const numeric = !isNaN(na) && !isNaN(nb) && String(raw ?? '').trim() !== '';
  switch (c.operator) {
    case '=': return a === b;
    case '!=': return a !== b;
    case 'LIKE': return a.includes(b);
    case '>': return numeric ? na > nb : a > b;
    case '<': return numeric ? na < nb : a < b;
    default: return true;
  }
};

const applyFilters = (rows: Record<string, any>[], filters: FilterItem[]) =>
  rows.filter(row => filters.reduce<boolean | null>((acc, f, i) => {
    const ok = f.type === 'condition' ? matchCond(row, f) : f.conditions.every(c => matchCond(row, c));
    if (i === 0 || acc === null) return ok;
    return f.logic === 'OR' ? acc || ok : acc && ok;
  }, null) ?? true);

const applySorts = (rows: Record<string, any>[], sorts: SortCondition[]) =>
  [...rows].sort((x, y) => {
    for (const s of sorts) {
      if (!s.field) continue;
      const a = x[s.field], b = y[s.field];
      const cmp = typeof a === 'number' && typeof b === 'number' ? a - b : String(a ?? '').localeCompare(String(b ?? ''), 'vi');
      if (cmp !== 0) return s.order === 'ASC' ? cmp : -cmp;
    }
    return 0;
  });

// Cột "Danh sách trường" (Ẩn/Hiện cột): nút < thu gọn, nút > mở lại — dùng chung với màn Xem chi tiết CSDL đích
export const ColumnPanelHeader = ({ onCollapse }: { onCollapse: () => void }) => (
  <div className="flex items-center justify-between gap-2 px-2 pb-2 mb-1 border-b border-slate-200">
    <span className="text-[13px] font-semibold text-[#020817]">Danh sách trường</span>
    <button
      type="button"
      onClick={onCollapse}
      title="Thu gọn danh sách trường"
      aria-label="Thu gọn danh sách trường"
      className="w-7 h-7 flex items-center justify-center rounded-md text-[#475569] hover:bg-[#F1F5F9] hover:text-[#020817] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
  </div>
);

export const ColumnPanelExpandButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    title="Mở danh sách trường"
    aria-label="Mở danh sách trường"
    className="w-7 h-7 mr-3 shrink-0 flex items-center justify-center rounded-md border border-slate-200 bg-white text-[#475569] hover:bg-[#F1F5F9] hover:text-[#020817] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
  >
    <ChevronRight className="w-4 h-4" />
  </button>
);

export function ProcessedDataTab() {
  const [rows, setRows] = useState<Record<string, any>[]>(() => [...(mockTableData[OUTPUT_TABLE] || [])]);
  const columns = rows.length > 0 ? Object.keys(rows[0]) : Object.keys(mockTableData[OUTPUT_TABLE]?.[0] || {});
  const firstField = columns[0] || '';

  const newCondition = (): FilterCondition => ({ id: Date.now().toString(), type: 'condition', field: firstField, operator: '=', value: '', logic: 'AND' });
  const newSort = (): SortCondition => ({ id: Date.now().toString(), field: firstField, order: 'DESC' });

  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterItem[]>([newCondition()]);
  const [appliedFilters, setAppliedFilters] = useState<FilterItem[]>([]);
  const [showSort, setShowSort] = useState(false);
  const [sorts, setSorts] = useState<SortCondition[]>([newSort()]);
  const [appliedSorts, setAppliedSorts] = useState<SortCondition[]>([]);
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [hidden, setHidden] = useState<string[]>([]);
  const [columnPanelCollapsed, setColumnPanelCollapsed] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const updateFilter = (i: number, patch: Partial<FilterCondition> | Partial<FilterGroup>) =>
    setFilters(prev => prev.map((f, idx) => (idx === i ? { ...f, ...patch } as FilterItem : f)));
  const updateGroupCond = (i: number, j: number, patch: Partial<FilterCondition>) =>
    setFilters(prev => prev.map((f, idx) => (idx === i && f.type === 'group'
      ? { ...f, conditions: f.conditions.map((c, k) => (k === j ? { ...c, ...patch } : c)) } : f)));
  const removeFilter = (id: string) => setFilters(prev => { const n = prev.filter(f => f.id !== id); return n.length ? n : [newCondition()]; });

  const visibleCols = columns.filter(c => !hidden.includes(c));
  const result = applySorts(applyFilters(rows, appliedFilters), appliedSorts);
  const paged = result.slice((page - 1) * pageSize, page * pageSize);

  const fieldOptions = columns.length > 0
    ? columns.map(k => <option key={k} value={k}>{k}</option>)
    : <option value="" disabled hidden>-- Chọn trường --</option>;

  return (
    <div className="flex flex-col">
      {/* Thanh công cụ */}
      <div className="flex items-center justify-between bg-slate-50 p-2 border border-slate-200 rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { setShowFilter(!showFilter); setShowSort(false); }} className={TOOL_BTN(showFilter)}>
            <Filter className="w-3.5 h-3.5" /> Lọc
          </button>
          <button type="button" onClick={() => { setShowSort(!showSort); setShowFilter(false); }} className={TOOL_BTN(showSort)}>
            <ArrowUpDown className="w-3.5 h-3.5" /> Sắp xếp
          </button>
          <button type="button" onClick={() => toast.success(`Xuất excel ${result.length} bản ghi thành công`)} className={TOOL_BTN(false)}>
            <FileSpreadsheet className="w-3.5 h-3.5" /> Xuất excel
          </button>
          <button type="button" onClick={() => setShowColumnToggle(!showColumnToggle)} className={TOOL_BTN(showColumnToggle)}>
            <Columns className="w-3.5 h-3.5" /> Ẩn/Hiện cột
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            disabled={rows.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium bg-white text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:border-[#E2E8F0] disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" /> Xóa dữ liệu
          </button>
          <button
            type="button"
            onClick={() => { setRows([...(mockTableData[OUTPUT_TABLE] || [])]); setPage(1); }}
            className={TOOL_BTN(false)}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Tải lại
          </button>
        </div>
      </div>

      {/* Bộ lọc nâng cao */}
      {showFilter && (
        <div className="mb-4 border border-slate-200 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col gap-3">
            {filters.map((f, i) => f.type === 'condition' ? (
              <div key={f.id} className="flex items-center gap-3">
                {i > 0 && (
                  <select value={f.logic} onChange={(e) => updateFilter(i, { logic: e.target.value as 'AND' | 'OR' })} className={`${SELECT_CLS} w-24`}>
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                )}
                <select value={f.field} onChange={(e) => updateFilter(i, { field: e.target.value })} className={`${SELECT_CLS} ${i === 0 ? 'flex-1 max-w-xs' : 'flex-1 max-w-[216px]'}`}>
                  {fieldOptions}
                </select>
                <select value={f.operator} onChange={(e) => updateFilter(i, { operator: e.target.value })} className={`${SELECT_CLS} w-40`}>
                  {OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="flex-1 relative">
                  <input type="text" value={f.value} onChange={(e) => updateFilter(i, { value: e.target.value })} placeholder="<?>" className="w-full px-3 py-1.5 border border-slate-300 rounded text-[13px] focus:outline-none focus:border-blue-500" />
                </div>
                <button type="button" aria-label="Xóa điều kiện" onClick={() => removeFilter(f.id)} className="p-1.5 border border-red-200 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div key={f.id} className="border border-red-500/50 p-3 rounded bg-white relative flex flex-col gap-3">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500 rounded-l"></div>
                <div className="flex items-center justify-between ml-2">
                  <div className="flex items-center gap-2">
                    <select value={f.logic} onChange={(e) => updateFilter(i, { logic: e.target.value as 'AND' | 'OR' })} className={`${SELECT_CLS} w-24`}>
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => updateFilter(i, { conditions: [...f.conditions, { id: Date.now().toString(), field: firstField, operator: '=', value: '' }] })}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 rounded text-[13px] font-medium hover:bg-blue-50 bg-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm điều kiện
                    </button>
                  </div>
                  <button type="button" aria-label="Xóa nhóm" onClick={() => removeFilter(f.id)} className="p-1.5 border border-red-200 bg-white text-red-500 rounded hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-3 ml-2">
                  {f.conditions.map((c, j) => (
                    <div key={c.id} className="flex items-center gap-3">
                      <select value={c.field} onChange={(e) => updateGroupCond(i, j, { field: e.target.value })} className={`${SELECT_CLS} flex-1 max-w-[216px]`}>
                        {fieldOptions}
                      </select>
                      <select value={c.operator} onChange={(e) => updateGroupCond(i, j, { operator: e.target.value })} className={`${SELECT_CLS} w-40`}>
                        {OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      <div className="flex-1 relative">
                        <input type="text" value={c.value} onChange={(e) => updateGroupCond(i, j, { value: e.target.value })} placeholder="<?>" className="w-full px-3 py-1.5 border border-slate-300 rounded text-[13px] focus:outline-none focus:border-blue-500" />
                      </div>
                      <button
                        type="button"
                        aria-label="Xóa điều kiện"
                        onClick={() => updateFilter(i, { conditions: f.conditions.filter((_, k) => k !== j) })}
                        className="p-1.5 border border-red-200 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-2 mt-2">
              <button type="button" onClick={() => setFilters([...filters, newCondition()])} className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-[13px] font-medium hover:bg-blue-50 transition-colors">
                <Plus className="w-4 h-4" /> Điều kiện
              </button>
              <button
                type="button"
                onClick={() => setFilters([...filters, { id: Date.now().toString(), type: 'group', logic: 'AND', conditions: [{ id: Date.now().toString() + '_1', field: firstField, operator: '=', value: '' }] }])}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-[13px] font-medium hover:bg-blue-50 transition-colors"
              >
                <Layers className="w-4 h-4" /> Gom Nhóm
              </button>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
              <button type="button" onClick={() => { setAppliedFilters(filters); setPage(1); }} className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded text-[13px] font-medium hover:bg-blue-700 transition-colors">
                <Check className="w-4 h-4" /> Áp dụng
              </button>
              <button type="button" onClick={() => { setFilters([newCondition()]); setAppliedFilters([]); setPage(1); }} className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-slate-700 border border-slate-300 rounded text-[13px] font-medium hover:bg-slate-50 transition-colors">
                <X className="w-4 h-4" /> Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sắp xếp */}
      {showSort && (
        <div className="mb-4 border border-slate-200 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col gap-3">
            {sorts.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <select value={s.field} onChange={(e) => setSorts(sorts.map((x, k) => (k === i ? { ...x, field: e.target.value } : x)))} className={`${SELECT_CLS} flex-1`}>
                  {fieldOptions}
                </select>
                <button
                  type="button"
                  onClick={() => setSorts(sorts.map((x, k) => (k === i ? { ...x, order: x.order === 'ASC' ? 'DESC' : 'ASC' } : x)))}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 border border-slate-300 bg-slate-100 text-slate-700 rounded text-[13px] font-medium hover:bg-slate-200 transition-colors"
                >
                  {s.order === 'ASC' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {s.order}
                </button>
                <button
                  type="button"
                  aria-label="Xóa điều kiện sắp xếp"
                  onClick={() => { const n = sorts.filter(x => x.id !== s.id); setSorts(n.length ? n : [newSort()]); }}
                  className="p-1.5 border border-red-200 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex items-center mt-2">
              <button type="button" onClick={() => setSorts([...sorts, newSort()])} className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-[13px] font-medium hover:bg-blue-50 transition-colors">
                <Plus className="w-4 h-4" /> Điều kiện
              </button>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
              <button type="button" onClick={() => { setAppliedSorts(sorts); setPage(1); }} className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded text-[13px] font-medium hover:bg-blue-700 transition-colors">
                <Check className="w-4 h-4" /> Áp dụng
              </button>
              <button type="button" onClick={() => { setSorts([newSort()]); setAppliedSorts([]); }} className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-slate-700 border border-slate-300 rounded text-[13px] font-medium hover:bg-slate-50 transition-colors">
                <X className="w-4 h-4" /> Xóa sắp xếp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bảng dữ liệu (+ cột Ẩn/Hiện) */}
      <div className="flex items-start">
        {showColumnToggle && columnPanelCollapsed && (
          <ColumnPanelExpandButton onClick={() => setColumnPanelCollapsed(false)} />
        )}
        {showColumnToggle && !columnPanelCollapsed && (
          <div className="w-56 border-r border-slate-200 pr-4 mr-4 shrink-0 max-h-[600px] overflow-y-auto custom-scrollbar">
            <ColumnPanelHeader onCollapse={() => setColumnPanelCollapsed(true)} />
            {columns.map(col => (
              <label key={col} className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-slate-50 px-2 rounded">
                <input
                  type="checkbox"
                  checked={!hidden.includes(col)}
                  onChange={() => setHidden(h => (h.includes(col) ? h.filter(c => c !== col) : [...h, col]))}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-[13px] font-medium text-slate-700 truncate" title={col}>{col}</span>
              </label>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-slate-200 overflow-hidden overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {visibleCols.length > 0
                  ? visibleCols.map(key => <th key={key} className="py-3 px-4 text-[13px] font-bold text-black whitespace-nowrap">{key}</th>)
                  : <th className="py-3 px-4 text-[13px] font-bold text-black whitespace-nowrap text-center">Dữ liệu</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paged.length > 0 ? paged.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-50/50 transition-colors">
                  {visibleCols.map(c => <td key={c} className="py-3 px-4 text-[13px] text-slate-800">{String(row[c] ?? '')}</td>)}
                </tr>
              )) : (
                <tr>
                  <td colSpan={100} className="py-12 text-center text-slate-500 text-[13px]">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-slate-300 mb-2" />
                      <p>{rows.length === 0 ? 'Bảng chưa có dữ liệu' : 'Không tìm thấy dữ liệu phù hợp'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {result.length > 0 && (
        <Pagination
          className="mt-3 shrink-0 border border-[#E2E8F0] rounded-lg"
          currentPage={page}
          totalItems={result.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(n: number) => { setPageSize(n); setPage(1); }}
        />
      )}

      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => { setRows([]); setPage(1); toast.success('Xóa dữ liệu bảng thành công'); }}
        type="delete"
        title="Xác nhận xóa dữ liệu"
        subtitle="Hành động này không thể hoàn tác."
        message={<>Bạn có chắc chắn muốn xóa toàn bộ dữ liệu sau xử lý trong bảng <strong>{OUTPUT_TABLE}</strong>?</>}
        confirmText="Xóa"
      />
    </div>
  );
}
