import React from 'react';
import { FileText, History as HistoryIcon } from 'lucide-react';

interface OpenDataCategoryTabBarProps {
  activeTab: 'category' | 'version';
  setActiveTab: (tab: 'category' | 'version') => void;
}

export function OpenDataCategoryTabBar({ activeTab, setActiveTab }: OpenDataCategoryTabBarProps) {
  return (
    <div className="flex border-b border-slate-200 bg-white">
      <button
        onClick={() => setActiveTab('category')}
        className={`flex items-center gap-2 px-6 py-4 text-[14px] transition-all border-b-2 font-medium ${
          activeTab === 'category'
            ? 'bg-blue-50/50 text-blue-600 border-blue-600'
            : 'text-slate-500 border-transparent hover:bg-slate-50'
        }`}
      >
        <FileText className="w-4 h-4" />
        Tệp dữ liệu
      </button>
      <button
        onClick={() => setActiveTab('version')}
        className={`flex items-center gap-2 px-6 py-4 text-[14px] transition-all border-b-2 font-medium ${
          activeTab === 'version'
            ? 'bg-blue-50/50 text-blue-600 border-blue-600'
            : 'text-slate-500 border-transparent hover:bg-slate-50'
        }`}
      >
        <HistoryIcon className="w-4 h-4" />
        Lịch sử thay đổi
      </button>
    </div>
  );
}
