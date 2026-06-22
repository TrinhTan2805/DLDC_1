import React from 'react';
import { FileText, History as HistoryIcon } from 'lucide-react';

interface OpenDataCategoryTabBarProps {
  activeTab: string;
  setActiveTab: (tab: 'category' | 'version') => void;
}

export function OpenDataCategoryTabBar({ activeTab, setActiveTab }: OpenDataCategoryTabBarProps) {
  return (
    <div className="px-6 pt-4">
      <div className="inline-flex items-center bg-slate-100 rounded-lg p-1 gap-1">
        <button
          onClick={() => setActiveTab('category')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[13px] font-medium transition-all cursor-pointer ${
            activeTab === 'category'
              ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className={`w-3.5 h-3.5 ${activeTab === 'category' ? 'text-blue-600' : 'text-slate-400'}`} />
          Tệp dữ liệu
        </button>
        <button
          onClick={() => setActiveTab('version')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[13px] font-medium transition-all cursor-pointer ${
            activeTab === 'version'
              ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <HistoryIcon className={`w-3.5 h-3.5 ${activeTab === 'version' ? 'text-blue-600' : 'text-slate-400'}`} />
          Lịch sử thay đổi
        </button>
      </div>
    </div>
  );
}
