import { useState } from 'react';
import { InnerSidebar } from '../collection/InnerSidebar';
import { CategoryPage } from './CategoryPage';

const CATEGORIES = [
  { id: 'category-a-1', label: 'Dữ liệu Danh mục giới tính' },
  { id: 'category-a-2', label: 'Dữ liệu Danh mục và mã các dân tộc Việt Nam' },
  { id: 'category-a-3', label: 'Dữ liệu Danh mục và mã Quốc gia, Quốc tịch' },
  { id: 'category-a-4', label: 'Dữ liệu Danh mục và mã các Tôn giáo' },
  { id: 'category-a-5', label: 'Dữ liệu Danh mục cơ quan' },
  { id: 'category-a-6', label: 'Dữ liệu Danh mục đơn vị hành chính' },
  { id: 'category-a-7', label: 'Dữ liệu Danh mục và mã mối quan hệ trong gia đình' },
];

export function CategoryAListPage() {
  const [selectedId, setSelectedId] = useState(CATEGORIES[0].id);

  const selected = CATEGORIES.find(c => c.id === selectedId) || CATEGORIES[0];

  return (
    <div className="flex gap-6 h-full min-h-[calc(100vh-140px)]">
      <div className="flex-shrink-0 sticky top-0 h-fit self-start">
        <InnerSidebar
          title="Biên tập danh mục"
          items={CATEGORIES}
          onSelectItem={setSelectedId}
          activeId={selectedId}
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <CategoryPage categoryName={selected.label} categoryId={selected.id} />
      </div>
    </div>
  );
}
