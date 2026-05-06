import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

interface InnerSidebarProps {
  title: string;
  items: { id: string; label: string }[];
  onSelectItem: (id: string) => void;
}

export function InnerSidebar({ title, items, onSelectItem }: InnerSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 bg-white border border-slate-200 rounded-xl flex flex-col h-full shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">{title}</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm dữ liệu..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        <div className="space-y-1">
          {filteredItems.map((item, index) => (
            <button
 key={item.id}
 onClick={() => onSelectItem(item.id)}
 className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 transition-all group flex items-start gap-3"
 >
 <span className="text-blue-600 text-sm shrink-0 mt-0.5">{index + 1}.</span>
 <span className="text-sm font-medium group-hover:text-blue-700 transition-colors line-clamp-2">
 {item.label}
 </span>
 <div className="ml-auto flex items-center gap-1 text-[10px] text-blue-600 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 whitespace-nowrap bg-blue-50 px-2 py-1 rounded-md shrink-0">
 Xem chi tiết
 <ChevronRight className="w-3 h-3" />
 </div>
 </button>
          ))}
          {filteredItems.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-400 italic">Không tìm thấy dữ liệu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
