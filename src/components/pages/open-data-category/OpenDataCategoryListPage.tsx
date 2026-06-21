import { useState } from 'react';
import { InnerSidebar } from '../collection/InnerSidebar';
import { OpenDataCategoryPage } from './OpenDataCategoryPage';

const CATEGORIES = [
  { id: 'open-data-category-a', label: 'Danh sách tổ chức thực hiện trợ giúp pháp lý' },
  { id: 'open-data-category-b', label: 'Danh sách người thực hiện trợ giúp pháp lý' },
  { id: 'open-data-category-c', label: 'Danh sách Luật sư Việt Nam' },
];

export function OpenDataCategoryListPage() {
  const [selectedId, setSelectedId] = useState(CATEGORIES[0].id);

  const selected = CATEGORIES.find(c => c.id === selectedId) || CATEGORIES[0];

  return (
    <div className="flex gap-6 h-full min-h-[calc(100vh-140px)]">
      <div className="flex-shrink-0 sticky top-0 h-fit self-start">
        <InnerSidebar
          title="Danh mục dữ liệu"
          items={CATEGORIES}
          onSelectItem={setSelectedId}
          activeId={selectedId}
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <OpenDataCategoryPage categoryName={selected.label} categoryId={selected.id} />
      </div>
    </div>
  );
}
