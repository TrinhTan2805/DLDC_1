import { useState } from 'react';
import { toast } from 'sonner';
import { Filter, RefreshCw, Plus, Trash2, CheckCircle, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockTableData } from './mockTargetDatabases';
import {
  Pagination, normalizeSearch, filterBtnClass, INPUT_CLS, BTN_PRIMARY, BTN_OUTLINE, ROW_ICON_BTN, TOOLTIP_CLS,
} from '../collection/collectionUi';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import { AddGroupButton, FilterGroupRow, isFilterGroup, newFilterGroup, type FilterGroupItem } from '../../common/AdvancedFilterGroup';

// Tab "Dữ liệu sau xử lý" (Xử lý dữ liệu) — bảng dữ liệu trong CSDL đích sau khi chạy xử lý (cùng nguồn mockTableData với
// màn Xem chi tiết CSDL đích). Thanh công cụ giống màn xem dữ liệu thu thập (PM 14/10/2026): nút [Tải lại] + [Bộ lọc];
// Bộ lọc nâng cao có Thêm điều kiện / Gom Nhóm; [Áp dụng bộ lọc] lọc thật trên dữ liệu mẫu.
const OUTPUT_TABLE = 'DIP_PERSON';

interface FilterCondition { id: string; logic: 'AND' | 'OR'; field: string; operator: string; value: string }
type FilterItem = FilterCondition | FilterGroupItem;

// Nút icon 40×40 nền trắng (mục 5.1 – Icon outline), giống bộ lọc màn xem dữ liệu thu thập
const ICON_OUTLINE_40 = 'w-10 h-10 shrink-0 rounded-lg border bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#020817] transition-colors flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600';

const matchCond = (row: Record<string, any>, c: { field: string; operator: string; value: string }) => {
  if (!c.field || !c.value.trim()) return true;
  const a = normalizeSearch(String(row[c.field] ?? '')), b = normalizeSearch(c.value);
  if (c.operator === 'contains') return a.includes(b);
  if (c.operator === 'starts') return a.startsWith(b);
  return a === b;
};

// Nối lần lượt theo AND / OR; trong nhóm các điều kiện cũng nối theo AND / OR của từng điều kiện
const combine = <T extends { logic: 'AND' | 'OR' }>(items: T[], test: (x: T) => boolean) =>
  items.reduce<boolean | null>((acc, x, i) => {
    const ok = test(x);
    return i === 0 || acc === null ? ok : x.logic === 'OR' ? acc || ok : acc && ok;
  }, null) ?? true;

const applyFilters = (rows: Record<string, any>[], filters: FilterItem[]) =>
  rows.filter(row => combine(filters, f => (isFilterGroup(f) ? combine(f.conditions, c => matchCond(row, c)) : matchCond(row, f))));

// Cột "Danh sách trường" (Ẩn/Hiện cột): nút < thu gọn, nút > mở lại — dùng ở màn Xem chi tiết CSDL đích
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
  const rows = mockTableData[OUTPUT_TABLE] || [];
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  const fieldOptions = columns.map(c => ({ value: c, label: c }));

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<FilterItem[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const updateCondition = (index: number, patch: Partial<FilterCondition>) =>
    setFilterConditions(prev => prev.map((c, i) => (i === index ? { ...c, ...patch } as FilterItem : c)));

  const result = applyFilters(rows, appliedFilters);
  const paged = result.slice((page - 1) * pageSize, page * pageSize);

  const reload = () => { setFilterConditions([]); setAppliedFilters([]); setPage(1); toast.success('Cập nhật dữ liệu thành công'); };

  return (
    <div className="flex flex-col">
      {/* Thanh công cụ: [Tải lại] [Bộ lọc], căn phải */}
      <div className="flex items-center justify-end gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={reload} aria-label="Cập nhật dữ liệu" className={ICON_OUTLINE_40}>
              <RefreshCw className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Cập nhật dữ liệu</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-label="Bộ lọc nâng cao"
              aria-expanded={isFilterOpen}
              className={filterBtnClass(isFilterOpen)}
            >
              {isFilterOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Bộ lọc nâng cao</TooltipContent>
        </Tooltip>
      </div>

      {/* Vùng lọc nâng cao: khung xám, cách thanh công cụ 15px (mục 5.19) */}
      {isFilterOpen && (
        <div className="mt-[15px] p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[14px] font-medium text-[#020817]">Điều kiện lọc nâng cao</h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterConditions([...filterConditions, { id: Date.now().toString(), logic: 'AND', field: '', operator: '=', value: '' }])}
                className={BTN_OUTLINE}
              >
                <Plus className="w-4 h-4" />
                Thêm điều kiện
              </button>
              <AddGroupButton className={BTN_OUTLINE} onClick={() => setFilterConditions([...filterConditions, newFilterGroup()])} />
            </div>
          </div>

          {filterConditions.length === 0 && (
            <p className="text-[13px] text-[#64748B]">Chưa có điều kiện lọc. Bấm "Thêm điều kiện" hoặc "Gom Nhóm" để bắt đầu.</p>
          )}

          <div className="space-y-2">
            {filterConditions.map((condition, index) => isFilterGroup(condition) ? (
              <FilterGroupRow
                key={condition.id}
                group={condition}
                showLogic={index > 0}
                fieldOptions={fieldOptions}
                onChange={(g) => setFilterConditions(filterConditions.map(c => (c.id === g.id ? g : c)))}
                onRemove={() => setFilterConditions(filterConditions.filter(c => c.id !== condition.id))}
              />
            ) : (
              <div key={condition.id} className="flex items-center gap-2">
                <div className="w-24 flex-shrink-0">
                  {index > 0 && (
                    <select aria-label="Toán tử logic" className={INPUT_CLS} value={condition.logic} onChange={(e) => updateCondition(index, { logic: e.target.value as 'AND' | 'OR' })}>
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                  )}
                </div>
                <select aria-label="Trường dữ liệu" className={`${INPUT_CLS} !w-auto flex-1`} value={condition.field} onChange={(e) => updateCondition(index, { field: e.target.value })}>
                  <option value="" disabled hidden>-- Chọn trường dữ liệu --</option>
                  {fieldOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <select aria-label="Phép so sánh" className={`${INPUT_CLS} !w-auto flex-1`} value={condition.operator} onChange={(e) => updateCondition(index, { operator: e.target.value })}>
                  <option value="=">Bằng (=)</option>
                  <option value="contains">Chứa</option>
                  <option value="starts">Bắt đầu</option>
                </select>
                <input
                  aria-label="Giá trị"
                  type="text"
                  className={`${INPUT_CLS} !w-auto flex-1`}
                  placeholder="Nhập giá trị..."
                  value={condition.value}
                  onChange={(e) => updateCondition(index, { value: e.target.value })}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Xóa điều kiện"
                      onClick={() => setFilterConditions(filterConditions.filter(c => c.id !== condition.id))}
                      className={`${ROW_ICON_BTN} hover:!text-[#DC2626]`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Xóa điều kiện</TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>

          {filterConditions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex items-center gap-3">
              <button type="button" onClick={() => { setAppliedFilters(filterConditions); setPage(1); }} className={BTN_PRIMARY}>
                <CheckCircle className="w-4 h-4" />
                Áp dụng bộ lọc
              </button>
              <button type="button" onClick={() => { setFilterConditions([]); setAppliedFilters([]); setPage(1); }} className={BTN_OUTLINE}>
                Xóa tất cả
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bảng dữ liệu */}
      <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.length > 0
                ? columns.map(key => <th key={key} className="py-3 px-4 text-[13px] font-bold text-black whitespace-nowrap">{key}</th>)
                : <th className="py-3 px-4 text-[13px] font-bold text-black whitespace-nowrap text-center">Dữ liệu</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paged.length > 0 ? paged.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-slate-50/50 transition-colors">
                {columns.map(c => <td key={c} className="py-3 px-4 text-[13px] text-slate-800">{String(row[c] ?? '')}</td>)}
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
    </div>
  );
}
