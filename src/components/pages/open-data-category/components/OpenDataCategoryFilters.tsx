import React from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

interface OpenDataCategoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export function OpenDataCategoryFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  showFilters,
  setShowFilters
}: OpenDataCategoryFiltersProps) {
  return (
    <div className="flex-1 flex items-center gap-2">
      {/* Search Input */}
      <div className="flex-1 relative group">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="Tìm kiếm theo mã, tên tệp dữ liệu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[14px] bg-slate-50/50 hover:bg-slate-50 transition-all font-medium"
        />
      </div>

      {/* Filter Toggle Button */}
      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
          showFilters
            ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 shadow-sm'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
        title={showFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
      >
        {showFilters ? <X className="w-4.5 h-4.5" /> : <Filter className="w-4 h-4" />}
      </button>
    </div>
  );
}

interface OpenDataCategoryFilterPanelProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export function OpenDataCategoryFilterPanel({
  statusFilter,
  setStatusFilter
}: OpenDataCategoryFilterPanelProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] mt-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Trạng thái công khai</label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[14px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã công khai</option>
              <option value="unpublished">Chưa công khai</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
