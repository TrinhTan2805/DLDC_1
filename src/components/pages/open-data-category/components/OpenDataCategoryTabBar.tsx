import React from 'react';
import { FileText, History as HistoryIcon } from 'lucide-react';

interface OpenDataCategoryTabBarProps {
  activeTab: 'category' | 'version';
  setActiveTab: (tab: 'category' | 'version') => void;
}

export function OpenDataCategoryTabBar({ activeTab, setActiveTab }: OpenDataCategoryTabBarProps) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="flex px-6 gap-2">
        <button
          onClick={() => setActiveTab('category')}
          className={`flex items-center gap-2 px-6 py-4 text-[14px] font-medium transition-all border-b-2 cursor-pointer ${
            activeTab === 'category'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <FileText className={`w-4 h-4 ${activeTab === 'category' ? 'text-blue-600' : 'text-slate-400'}`} />
          Tệp dữ liệu
        </button>
        <button
          onClick={() => setActiveTab('version')}
          className={`flex items-center gap-2 px-6 py-4 text-[14px] font-medium transition-all border-b-2 cursor-pointer ${
            activeTab === 'version'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <HistoryIcon className={`w-4 h-4 ${activeTab === 'version' ? 'text-blue-600' : 'text-slate-400'}`} />
          Lịch sử thay đổi
        </button>
      </div>
    </div>
  );
}
