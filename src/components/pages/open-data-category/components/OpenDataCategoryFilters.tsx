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
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã, tên tệp dữ liệu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-white hover:bg-slate-50/50 font-medium shadow-sm"
        />
      </div>

      {/* Search Button */}
      <button
        type="button"
        className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95 shadow-sm"
        title="Tìm kiếm"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Filter Toggle Button */}
      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all border cursor-pointer active:scale-95 ${
          showFilters
            ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
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
  startDateFilter: string;
  setStartDateFilter: (date: string) => void;
  endDateFilter: string;
  setEndDateFilter: (date: string) => void;
}

export function OpenDataCategoryFilterPanel({
  statusFilter,
  setStatusFilter,
  startDateFilter,
  setStartDateFilter,
  endDateFilter,
  setEndDateFilter
}: OpenDataCategoryFilterPanelProps) {
  return (
    <div className="relative mt-3 p-4 bg-white border border-slate-200 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] before:content-[''] before:absolute before:-top-[7px] before:right-[208px] md:before:right-[auto] md:before:left-[calc(100%-100px)] lg:before:left-[calc(100%-242px)] before:w-3 before:h-3 before:bg-white before:rotate-45 before:border-l before:border-t before:border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trạng thái công khai */}
        <div>
          <label className="block text-[13px] text-slate-600 mb-2 font-normal">Trạng thái công khai</label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã công khai</option>
              <option value="unpublished">Chưa công khai</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Ngày gửi công bố */}
        <div>
          <label className="block text-[13px] text-slate-600 mb-2 font-normal">Ngày gửi công bố</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-750 font-medium"
              placeholder="Từ ngày"
            />
            <input
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-750 font-medium"
              placeholder="Đến ngày"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
