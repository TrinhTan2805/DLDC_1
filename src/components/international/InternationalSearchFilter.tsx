import React from 'react';
import { Filter, Download, Plus, Trash2, CheckCircle, X, RefreshCw } from 'lucide-react';

interface InternationalSearchFilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  filterConditions: any[];
  setFilterConditions: (conditions: any[]) => void;
  onExport: () => void;
  onRefresh?: () => void;
  isInline?: boolean;
}

export function InternationalSearchFilter({
  isFilterOpen,
  setIsFilterOpen,
  filterConditions,
  setFilterConditions,
  onExport,
  onRefresh,
  isInline = false
}: InternationalSearchFilterProps) {
  return (
    <div className={`flex-shrink-0 ${isInline ? 'mb-4' : 'px-6 py-4 border-b border-slate-200 bg-white'}`}>
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border gap-2 text-base font-medium ${
            isFilterOpen ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-[#e2e8f0] text-slate-700 hover:bg-slate-50'
          }`}
          title="Bộ lọc"
        >
          {isFilterOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          Lọc
        </button>
        
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="p-2 border border-[#e2e8f0] bg-white rounded-lg text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center" 
            title="Tải lại"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        )}

        <button 
          onClick={onExport}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 text-base shadow-sm font-medium"
        >
          <Download className="w-5 h-5" />
          Kết xuất
        </button>
      </div>

      {isFilterOpen && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4 shadow-sm animate-in slide-in-from-top-2 duration-200 relative">
          <div className="absolute -top-2 left-[50%] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h4 className="text-sm font-semibold text-slate-700">Điều kiện lọc nâng cao</h4>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const newId = Date.now().toString();
                  setFilterConditions([...filterConditions, { id: newId, logic: 'AND', field: '', operator: '=', type: 'Text', value: '' }]);
                }}
                className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-blue-50 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Thêm điều kiện
              </button>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            {filterConditions.map((condition, index) => (
              <div key={condition.id} className="flex items-center gap-3">
                <div className="w-20 flex-shrink-0">
                  {index > 0 && (
                    <select
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={condition.logic}
                      onChange={(e) => {
                        const newConditions = [...filterConditions];
                        newConditions[index].logic = e.target.value;
                        setFilterConditions(newConditions);
                      }}
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                  )}
                </div>
                
                <select
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  value={condition.field}
                  onChange={(e) => {
                    const newConditions = [...filterConditions];
                    newConditions[index].field = e.target.value;
                    setFilterConditions(newConditions);
                  }}
                >
                  <option value="">Chọn trường dữ liệu</option>
                  <option value="name">Tên điều ước / Thỏa thuận</option>
                  <option value="partner">Đối tác / Quốc gia</option>
                  <option value="date">Ngày ký kết / Thực hiện</option>
                  <option value="status">Trạng thái</option>
                </select>

                <select
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  value={condition.operator}
                  onChange={(e) => {
                    const newConditions = [...filterConditions];
                    newConditions[index].operator = e.target.value;
                    setFilterConditions(newConditions);
                  }}
                >
                  <option value="=">Bằng (=)</option>
                  <option value="contains">Chứa</option>
                  <option value="starts">Bắt đầu</option>
                </select>

                <div className="flex-1 flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white shadow-sm">
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-0 p-0 text-sm focus:outline-none"
                    placeholder="Nhập giá trị..."
                    value={condition.value}
                    onChange={(e) => {
                      const newConditions = [...filterConditions];
                      newConditions[index].value = e.target.value;
                      setFilterConditions(newConditions);
                    }}
                  />
                </div>

                <button 
                  type="button"
                  onClick={() => setFilterConditions(filterConditions.filter(c => c.id !== condition.id))}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {filterConditions.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3 relative z-10">
              <button 
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                Áp dụng bộ lọc
              </button>
              <button 
                type="button"
                onClick={() => setFilterConditions([])} 
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-all shadow-sm"
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
