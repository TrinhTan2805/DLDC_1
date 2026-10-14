import { Layers, Plus, Trash2 } from 'lucide-react';
import { INPUT_CLS } from '../pages/collection/collectionUi';

// "Gom Nhóm" trong Bộ lọc nâng cao (màn xem dữ liệu thu thập): một nhóm điều kiện nằm chung danh sách filterConditions,
// phân biệt bằng kind: 'group'. Nhóm nối với điều kiện trước bằng logic (AND/OR); điều kiện trong nhóm nối nhau bằng logic riêng.

export interface FilterGroupCondition { id: string; logic: 'AND' | 'OR'; field: string; operator: string; value: string }
export interface FilterGroupItem { id: string; kind: 'group'; logic: 'AND' | 'OR'; conditions: FilterGroupCondition[] }

export const isFilterGroup = (c: any): c is FilterGroupItem => c?.kind === 'group';

const newGroupCondition = (): FilterGroupCondition => ({ id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, logic: 'AND', field: '', operator: '=', value: '' });
export const newFilterGroup = (): FilterGroupItem => ({ id: Date.now().toString(), kind: 'group', logic: 'AND', conditions: [newGroupCondition()] });

// Kiểu ô: 'standard' = INPUT_CLS (cao 40px); 'compact' = kiểu ô 13px của các bộ lọc hộ tịch
const COMPACT_CLS = 'w-full px-3 py-1.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm';

export function AddGroupButton({ onClick, className }: { onClick: () => void; className: string }) {
  return (
    <button type="button" onClick={onClick} className={className}>
      <Layers className="w-4 h-4" />
      Gom Nhóm
    </button>
  );
}

export function FilterGroupRow({
  group, showLogic, fieldOptions, onChange, onRemove, variant = 'standard',
}: {
  group: FilterGroupItem;
  showLogic: boolean;
  fieldOptions: { value: string; label: string }[];
  onChange: (g: FilterGroupItem) => void;
  onRemove: () => void;
  variant?: 'standard' | 'compact';
}) {
  const cls = variant === 'compact' ? COMPACT_CLS : INPUT_CLS;
  const logicW = variant === 'compact' ? 'w-20' : 'w-24';
  const updateCond = (j: number, patch: Partial<FilterGroupCondition>) =>
    onChange({ ...group, conditions: group.conditions.map((c, k) => (k === j ? { ...c, ...patch } : c)) });
  const removeCond = (j: number) => {
    const conditions = group.conditions.filter((_, k) => k !== j);
    if (conditions.length === 0) onRemove(); else onChange({ ...group, conditions });
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`${logicW} flex-shrink-0`}>
        {showLogic && (
          <select aria-label="Toán tử logic của nhóm" className={cls} value={group.logic} onChange={(e) => onChange({ ...group, logic: e.target.value as 'AND' | 'OR' })}>
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        )}
      </div>

      <div className="flex-1 min-w-0 bg-white border border-[#E2E8F0] border-l-[3px] border-l-blue-600 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...group, conditions: [...group.conditions, newGroupCondition()] })}
            className="inline-flex items-center gap-1 h-6 px-2 rounded border border-blue-200 bg-white text-[12px] font-medium text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm điều kiện
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Xóa nhóm"
            title="Xóa nhóm"
            className="p-1 rounded text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {group.conditions.map((c, j) => (
          <div key={c.id} className="flex items-center gap-3">
            <div className={`${logicW} flex-shrink-0`}>
              {j > 0 && (
                <select aria-label="Toán tử logic" className={cls} value={c.logic} onChange={(e) => updateCond(j, { logic: e.target.value as 'AND' | 'OR' })}>
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              )}
            </div>
            <select aria-label="Trường dữ liệu" className={`${cls} !w-auto flex-1 min-w-0`} value={c.field} onChange={(e) => updateCond(j, { field: e.target.value })}>
              <option value="" disabled hidden>-- Chọn trường dữ liệu --</option>
              {fieldOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select aria-label="Phép so sánh" className={`${cls} !w-auto flex-1 min-w-0`} value={c.operator} onChange={(e) => updateCond(j, { operator: e.target.value })}>
              <option value="=">Bằng (=)</option>
              <option value="contains">Chứa</option>
              <option value="starts">Bắt đầu</option>
            </select>
            <input
              aria-label="Giá trị"
              type="text"
              className={`${cls} !w-auto flex-1 min-w-0`}
              placeholder="Nhập giá trị..."
              value={c.value}
              onChange={(e) => updateCond(j, { value: e.target.value })}
            />
            <button
              type="button"
              onClick={() => removeCond(j)}
              aria-label="Xóa điều kiện"
              title="Xóa điều kiện"
              className="p-2 rounded text-slate-400 hover:text-[#DC2626] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
