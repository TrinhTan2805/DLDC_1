import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

export interface InnerSidebarItem {
  id: string;
  label: string;
  group?: string;
  dataType?: 'Dữ liệu nghiệp vụ' | 'Dữ liệu danh mục';
  /** Chấm màu trạng thái hiển thị trước tên mục (VD: trạng thái công khai) */
  statusDot?: 'green' | 'gray';
  statusLabel?: string;
}

export interface InnerSidebarFilter {
  value: string;
  label: string;
}

interface InnerSidebarProps {
  title: string;
  items: InnerSidebarItem[];
  onSelectItem: (id: string) => void;
  activeId?: string;
  hideGroupHeaders?: boolean;
  stretchHeight?: boolean;
  // Bỏ phân nhóm "Dữ liệu nghiệp vụ"/"Dữ liệu danh mục" — hiển thị thẳng toàn bộ items, không cần thu gọn/mở rộng
  flatList?: boolean;
  /** Tab lọc hiển thị ngay dưới ô tìm kiếm (VD: lọc theo trạng thái công khai) */
  filters?: InnerSidebarFilter[];
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
}

// Phân loại dữ liệu thu thập thành 2 nhóm cố định: Dữ liệu nghiệp vụ (luôn ở trên) và Dữ liệu danh mục (luôn ở dưới, mặc định đóng)
const DATA_TYPE_SECTIONS: { key: 'Dữ liệu nghiệp vụ' | 'Dữ liệu danh mục'; label: string }[] = [
  { key: 'Dữ liệu nghiệp vụ', label: 'Dữ liệu nghiệp vụ' },
  { key: 'Dữ liệu danh mục', label: 'Dữ liệu danh mục' },
];

export function InnerSidebar({ title, items, onSelectItem, activeId, hideGroupHeaders = false, stretchHeight = false, flatList = false, filters, activeFilter, onFilterChange }: InnerSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  // "Dữ liệu danh mục" luôn đóng mặc định; "Dữ liệu nghiệp vụ" luôn mở mặc định
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set(['Dữ liệu danh mục']));

  const toggleSection = (key: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

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
      <span className={`flex-1 text-[13px] font-medium transition-colors ${
        activeId === item.id ? 'text-blue-700' : 'group-hover:text-blue-700'
      }`}>
        {item.label}
      </span>
      {item.statusDot && (
        <span
          className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${item.statusDot === 'green' ? 'bg-emerald-500' : 'bg-slate-300'}`}
          title={item.statusLabel}
        />
      )}
    </button>
  );

  const renderItemsWithGroups = (list: InnerSidebarItem[], startIndex: number) => {
    if (!hasGroups) {
      return list.map((item, i) => renderItem(item, startIndex + i + 1));
    }
    const rendered: React.ReactNode[] = [];
    let currentGroup = '';
    let idx = startIndex;
    list.forEach(item => {
      if (item.group && item.group !== currentGroup) {
        currentGroup = item.group;
        rendered.push(
          <div key={`grp-${currentGroup}-${idx}`} className="px-3 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest first:pt-0">
            {currentGroup}
          </div>
        );
      }
      idx++;
      rendered.push(renderItem(item, idx));
    });
    return rendered;
  };

  const renderContent = () => {
    if (searchTerm) {
      return filteredItems.map((item, i) => renderItem(item, i + 1));
    }

    if (flatList) {
      return renderItemsWithGroups(filteredItems, 0);
    }

    let runningIndex = 0;
    const sections: React.ReactNode[] = [];

    DATA_TYPE_SECTIONS.forEach(section => {
      const sectionItems = filteredItems.filter(item =>
        section.key === 'Dữ liệu danh mục' ? item.dataType === 'Dữ liệu danh mục' : item.dataType !== 'Dữ liệu danh mục'
      );
      if (sectionItems.length === 0) return;

      const isCollapsed = collapsedSections.has(section.key);
      sections.push(
        <div key={section.key} className="mb-1">
          <button
            type="button"
            onClick={() => toggleSection(section.key)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span className="text-[13px] font-semibold text-slate-700">
              {section.label} ({sectionItems.length})
            </span>
            {isCollapsed ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
          {!isCollapsed && (
            <div className="space-y-0.5 mt-0.5">
              {renderItemsWithGroups(sectionItems, runningIndex)}
            </div>
          )}
        </div>
      );
      runningIndex += sectionItems.length;
    });

    return sections;
  };

  return (
    <div
      className="w-72 bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm overflow-hidden"
      style={stretchHeight ? { height: 'calc(100vh - 140px)' } : { maxHeight: 'calc(100vh - 160px)' }}
    >
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-[18px] font-bold text-slate-900 mb-3">{title}</h3>
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
        {filters && filters.length > 0 && (
          <div className="flex items-center gap-1 mt-3 bg-slate-50 border border-slate-200 rounded-lg p-1">
            {filters.map(f => (
              <button
                key={f.value}
                type="button"
                onClick={() => onFilterChange?.(f.value)}
                className={`flex-1 px-2 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer ${
                  activeFilter === f.value
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
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
