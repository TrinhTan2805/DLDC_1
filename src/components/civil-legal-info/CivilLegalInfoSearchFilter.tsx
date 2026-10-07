import React from 'react';
import { Filter, Plus, Trash2, CheckCircle, X, RefreshCw } from 'lucide-react';
import {
  filterBtnClass, INPUT_CLS, BTN_PRIMARY, BTN_OUTLINE, ROW_ICON_BTN, TOOLTIP_CLS,
} from '../pages/collection/collectionUi';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

interface CivilLegalInfoSearchFilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  filterConditions: any[];
  setFilterConditions: (conditions: any[]) => void;
  onExport: () => void;
  onRefresh?: () => void;
  isInline?: boolean;
}

// Nút icon 40×40 nền trắng có tooltip (mục 5.1 – Icon outline)
const ICON_OUTLINE_40 = 'w-10 h-10 shrink-0 rounded-lg border bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#020817] transition-colors flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600';

export function CivilLegalInfoSearchFilter({
  isFilterOpen,
  setIsFilterOpen,
  filterConditions,
  setFilterConditions,
  onExport,
  onRefresh,
  isInline = false
}: CivilLegalInfoSearchFilterProps) {
  const updateCondition = (index: number, key: string, value: string) => {
    const newConditions = [...filterConditions];
    newConditions[index] = { ...newConditions[index], [key]: value };
    setFilterConditions(newConditions);
  };

  return (
    <div className={`flex-shrink-0 ${isInline ? 'mb-4' : 'px-6 py-4 border-b border-[#E2E8F0] bg-white'}`}>
      <div className="flex items-center gap-1.5">
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-label="Bộ lọc nâng cao"
            aria-expanded={isFilterOpen}
            className={filterBtnClass(isFilterOpen)}
            title="Bộ lọc nâng cao"
          >
            {isFilterOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </button>

          {onRefresh && (
            <button type="button" onClick={onRefresh} aria-label="Tải lại" title="Tải lại" className={ICON_OUTLINE_40}>
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Vùng lọc nâng cao: khung xám, cách thanh công cụ 15px (mục 5.19) */}
      {isFilterOpen && (
        <div className="mt-[15px] p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[14px] font-medium text-[#020817]">Điều kiện lọc nâng cao</h4>
            <button
              type="button"
              onClick={() => {
                const newId = Date.now().toString();
                setFilterConditions([...filterConditions, { id: newId, logic: 'AND', field: '', operator: '=', type: 'Text', value: '' }]);
              }}
              className={BTN_OUTLINE}
            >
              <Plus className="w-4 h-4" />
              Thêm điều kiện
            </button>
          </div>

          <div className="space-y-2">
            {filterConditions.map((condition, index) => (
              <div key={condition.id} className="flex items-center gap-2">
                <div className="w-24 flex-shrink-0">
                  {index > 0 && (
                    <select aria-label="Toán tử logic" className={INPUT_CLS} value={condition.logic} onChange={(e) => updateCondition(index, 'logic', e.target.value)}>
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                  )}
                </div>

                <select aria-label="Trường dữ liệu" className={`${INPUT_CLS} !w-auto flex-1`} value={condition.field} onChange={(e) => updateCondition(index, 'field', e.target.value)}>
                  <option value="">Chọn trường dữ liệu</option>
                  <option value="name">Tên tổ chức/Cá nhân</option>
                  <option value="type">Loại hình</option>
                  <option value="address">Địa chỉ</option>
                  <option value="status">Trạng thái</option>
                </select>

                <select aria-label="Phép so sánh" className={`${INPUT_CLS} !w-auto flex-1`} value={condition.operator} onChange={(e) => updateCondition(index, 'operator', e.target.value)}>
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
                  onChange={(e) => updateCondition(index, 'value', e.target.value)}
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
              <button type="button" className={BTN_PRIMARY}>
                <CheckCircle className="w-4 h-4" />
                Áp dụng bộ lọc
              </button>
              <button type="button" onClick={() => setFilterConditions([])} className={BTN_OUTLINE}>
                Xóa tất cả
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
