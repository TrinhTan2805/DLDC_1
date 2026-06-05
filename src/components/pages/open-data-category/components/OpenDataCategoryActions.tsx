import React from 'react';
import { Upload, Download, Plus } from 'lucide-react';

interface OpenDataCategoryActionsProps {
  onAddClick?: () => void;
  onImportClick?: () => void;
  onExportClick?: () => void;
}

export function OpenDataCategoryActions({
  onAddClick,
  onImportClick,
  onExportClick
}: OpenDataCategoryActionsProps) {
  return (
    <div className="flex items-center gap-3">
      {onImportClick && (
        <button
          onClick={onImportClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all text-sm font-medium active:scale-95 whitespace-nowrap shadow-sm cursor-pointer"
        >
          <Upload className="w-4 h-4 text-slate-500" />
          Import
        </button>
      )}
      {onExportClick && (
        <button
          onClick={onExportClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all text-sm font-medium active:scale-95 whitespace-nowrap shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          Export
        </button>
      )}
      {onAddClick && (
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[14px] font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Thêm tệp dữ liệu
        </button>
      )}
    </div>
  );
}
