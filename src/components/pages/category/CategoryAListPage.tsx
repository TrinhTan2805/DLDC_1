import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { InnerSidebar } from '../collection/InnerSidebar';
import { CategoryPage } from './CategoryPage';

const CATEGORIES = [
  { id: 'category-a-1', label: 'Dữ liệu Danh mục giới tính', published: true },
  { id: 'category-a-2', label: 'Dữ liệu Danh mục và mã các dân tộc Việt Nam', published: true },
  { id: 'category-a-3', label: 'Dữ liệu Danh mục và mã Quốc gia, Quốc tịch', published: false },
  { id: 'category-a-4', label: 'Dữ liệu Danh mục và mã các Tôn giáo', published: false },
  { id: 'category-a-5', label: 'Dữ liệu Danh mục cơ quan', published: true },
  { id: 'category-a-6', label: 'Dữ liệu Danh mục đơn vị hành chính', published: false },
  { id: 'category-a-7', label: 'Dữ liệu Danh mục và mã mối quan hệ trong gia đình', published: false },
];

type PublishFilter = 'all' | 'published' | 'unpublished';

export function CategoryAListPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get('category');
  const readOnly = searchParams.get('mode') === 'readonly';

  const getInitialId = () => {
    if (categoryParam && CATEGORIES.some(c => c.id === categoryParam)) {
      return categoryParam;
    }
    return CATEGORIES[0].id;
  };

  const [selectedId, setSelectedId] = useState(getInitialId());
  const [publishFilter, setPublishFilter] = useState<PublishFilter>('all');
  const [publishedMap, setPublishedMap] = useState<Record<string, boolean>>(
    () => Object.fromEntries(CATEGORIES.map(c => [c.id, c.published]))
  );

  useEffect(() => {
    if (categoryParam && CATEGORIES.some(c => c.id === categoryParam)) {
      setSelectedId(categoryParam);
    }
  }, [categoryParam]);

  const selected = CATEGORIES.find(c => c.id === selectedId) || CATEGORIES[0];

  const visibleCategories = CATEGORIES.filter(c => {
    if (publishFilter === 'published') return publishedMap[c.id];
    if (publishFilter === 'unpublished') return !publishedMap[c.id];
    return true;
  });

  useEffect(() => {
    if (visibleCategories.length > 0 && !visibleCategories.some(c => c.id === selectedId)) {
      setSelectedId(visibleCategories[0].id);
    }
  }, [publishFilter]);

  const sidebarItems = visibleCategories.map(c => ({
    id: c.id,
    label: c.label,
    statusDot: publishedMap[c.id] ? ('green' as const) : ('gray' as const),
    statusLabel: publishedMap[c.id] ? 'Đang công khai' : 'Chưa công khai',
  }));

  if (readOnly) {
    return (
      <div className="h-full min-h-[calc(100vh-140px)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold text-slate-800">{selected.label}</h2>
          <button
            type="button"
            onClick={() => navigate('/category-report')}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Đóng và quay lại Khai thác báo cáo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <CategoryPage categoryName={selected.label} categoryId={selected.id} readOnly />
      </div>
    );
  }

  const FILTERS: { value: PublishFilter; label: string }[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'published', label: 'Đang công khai' },
    { value: 'unpublished', label: 'Chưa công khai' },
  ];

  return (
    <div className="flex gap-6 h-full min-h-[calc(100vh-140px)]">
      <div className="flex-shrink-0 sticky top-0 h-fit self-start">
        <InnerSidebar
          title="Biên tập danh mục"
          items={sidebarItems}
          onSelectItem={setSelectedId}
          activeId={selectedId}
          filters={FILTERS}
          activeFilter={publishFilter}
          onFilterChange={(v) => setPublishFilter(v as PublishFilter)}
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <CategoryPage
          key={selected.id}
          categoryName={selected.label}
          categoryId={selected.id}
          initialPublished={publishedMap[selected.id]}
          onPublishStatusChange={(published) =>
            setPublishedMap(prev => ({ ...prev, [selected.id]: published }))
          }
        />
      </div>
    </div>
  );
}
