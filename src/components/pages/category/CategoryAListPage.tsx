import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { InnerSidebar } from '../collection/InnerSidebar';
import { CategoryPage, CategoryPublishStatus } from './CategoryPage';

const CATEGORIES: { id: string; label: string; status: CategoryPublishStatus }[] = [
  { id: 'category-a-1', label: 'Dữ liệu Danh mục giới tính', status: 'published' },
  { id: 'category-a-2', label: 'Dữ liệu Danh mục và mã các dân tộc Việt Nam', status: 'published' },
  { id: 'category-a-3', label: 'Dữ liệu Danh mục và mã Quốc gia, Quốc tịch', status: 'stopped' },
  { id: 'category-a-4', label: 'Dữ liệu Danh mục và mã các Tôn giáo', status: 'unpublished' },
  { id: 'category-a-5', label: 'Dữ liệu Danh mục cơ quan', status: 'published' },
  { id: 'category-a-6', label: 'Dữ liệu Danh mục đơn vị hành chính', status: 'unpublished' },
  { id: 'category-a-7', label: 'Dữ liệu Danh mục và mã mối quan hệ trong gia đình', status: 'unpublished' },
];

type PublishFilter = 'all' | CategoryPublishStatus;

const STATUS_LABELS: Record<CategoryPublishStatus, string> = {
  published: 'Đang công khai',
  stopped: 'Ngừng công khai',
  unpublished: 'Chưa công khai',
};

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
  const [statusMap, setStatusMap] = useState<Record<string, CategoryPublishStatus>>(
    () => Object.fromEntries(CATEGORIES.map(c => [c.id, c.status]))
  );

  useEffect(() => {
    if (categoryParam && CATEGORIES.some(c => c.id === categoryParam)) {
      setSelectedId(categoryParam);
    }
  }, [categoryParam]);

  const selected = CATEGORIES.find(c => c.id === selectedId) || CATEGORIES[0];

  const visibleCategories = CATEGORIES.filter(c => {
    if (publishFilter === 'all') return true;
    return statusMap[c.id] === publishFilter;
  });

  useEffect(() => {
    if (visibleCategories.length > 0 && !visibleCategories.some(c => c.id === selectedId)) {
      setSelectedId(visibleCategories[0].id);
    }
  }, [publishFilter]);

  const DOT_BY_STATUS: Record<CategoryPublishStatus, 'green' | 'red' | 'gray'> = {
    published: 'green',
    stopped: 'red',
    unpublished: 'gray',
  };

  const sidebarItems = visibleCategories.map(c => ({
    id: c.id,
    label: c.label,
    statusDot: DOT_BY_STATUS[statusMap[c.id]],
    statusLabel: STATUS_LABELS[statusMap[c.id]],
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
    { value: 'published', label: STATUS_LABELS.published },
    { value: 'stopped', label: STATUS_LABELS.stopped },
    { value: 'unpublished', label: STATUS_LABELS.unpublished },
  ];

  return (
    <div className="flex gap-6 h-full min-h-[calc(100vh-140px)]">
      <div className="flex-shrink-0 sticky top-0 h-fit self-start">
        <InnerSidebar
          title="Biên tập danh mục"
          items={sidebarItems}
          onSelectItem={setSelectedId}
          activeId={selectedId}
          flatList
          filters={FILTERS}
          filterLabel="Trạng thái công khai"
          activeFilter={publishFilter}
          onFilterChange={(v) => setPublishFilter(v as PublishFilter)}
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <CategoryPage
          key={selected.id}
          categoryName={selected.label}
          categoryId={selected.id}
          initialPublishStatus={statusMap[selected.id]}
          onPublishStatusChange={(status) =>
            setStatusMap(prev => ({ ...prev, [selected.id]: status }))
          }
        />
      </div>
    </div>
  );
}
