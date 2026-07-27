import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

export interface InnerSidebarItem {
  id: string;
  label: string;
  group?: string;
}

interface InnerSidebarProps {
  title: string;
  items: InnerSidebarItem[];
  onSelectItem: (id: string) => void;
  activeId?: string;
  hideGroupHeaders?: boolean;
}

export function InnerSidebar({ title, items, onSelectItem, activeId, hideGroupHeaders = false }: InnerSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasGroups = !hideGroupHeaders && items.some(i => i.group);

  const renderItem = (item: InnerSidebarItem, index: number) => (
    <button
      key={item.id}
      onClick={() => onSelectItem(item.id)}
      className={`w-full text-left px-4 py-3 rounded-lg transition-all group flex items-start gap-3 ${
        activeId === item.id
          ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 shadow-sm'
          : 'hover:bg-slate-50 text-slate-700'
      }`}
    >
      <span className="text-blue-600 text-[13px] shrink-0 mt-0.5">{index}.</span>
      <span className={`text-[13px] font-medium transition-colors line-clamp-2 ${
        activeId === item.id ? 'text-blue-700' : 'group-hover:text-blue-700'
      }`}>
        {item.label}
      </span>
      <div className="ml-auto flex items-center gap-1 text-[13px] text-blue-600 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 whitespace-nowrap bg-blue-50 px-2 py-1 rounded-md shrink-0">
        Xem chi tiết
        <ChevronRight className="w-3 h-3" />
      </div>
    </button>
  );

  const renderContent = () => {
    if (!hasGroups || searchTerm) {
      return filteredItems.map((item, i) => renderItem(item, i + 1));
    }

    const rendered: React.ReactNode[] = [];
    let currentGroup = '';
    let globalIdx = 0;

    items.forEach(item => {
      if (item.group && item.group !== currentGroup) {
        currentGroup = item.group;
        rendered.push(
          <div key={`grp-${currentGroup}`} className="px-3 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest first:pt-0">
            {currentGroup}
          </div>
        );
      }
      globalIdx++;
      rendered.push(renderItem(item, globalIdx));
    });

    return rendered;
  };

  return (
    <div className="w-72 bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm overflow-hidden" style={{ maxHeight: 'calc(100vh - 160px)' }}>
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-3">{title}</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm dữ liệu..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        <div className="space-y-0.5">
          {renderContent()}
          {filteredItems.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-[13px] text-slate-400 italic">Không tìm thấy dữ liệu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
