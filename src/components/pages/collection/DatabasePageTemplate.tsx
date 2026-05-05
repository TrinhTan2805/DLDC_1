import React from 'react';
import { InnerSidebar } from './InnerSidebar';
import { ChevronLeft } from 'lucide-react';

interface DatabasePageTemplateProps {
  title: string;
  description: string;
  onBack?: () => void;
  innerSidebarItems: { id: string; label: string }[];
  onSelectDataType: (id: string) => void;
  children: React.ReactNode;
}

export function DatabasePageTemplate({
  title,
  description,
  onBack,
  innerSidebarItems,
  onSelectDataType,
  children
}: DatabasePageTemplateProps) {
  return (
    <div className="flex gap-6 h-full min-h-[calc(100vh-140px)]">
      {/* Left Sidebar */}
      <div className="flex-shrink-0 sticky top-0 h-fit self-start">
        <InnerSidebar 
          title="Danh mục dữ liệu" 
          items={innerSidebarItems} 
          onSelectItem={onSelectDataType} 
        />
      </div>

      {/* Right Content */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        {/* Header removed as requested */}

        {children}
      </div>
    </div>
  );
}
