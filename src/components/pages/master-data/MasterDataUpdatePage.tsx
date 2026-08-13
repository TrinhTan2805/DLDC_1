import { useState } from 'react';
import { InnerSidebar } from '../collection/InnerSidebar';
import { MasterDataUpdateItemPage } from './MasterDataUpdateItemPage';

// 3 loại thực thể dữ liệu chủ theo quy định của Bộ Tư pháp (danh sách chính thức, không còn phân theo 7 nhóm/38 mục cũ)
const MASTER_DATA_ITEMS = [
  { id: 'md-001', label: 'Thông tin hộ tịch của cá nhân', group: 'Cục Hành chính tư pháp' },
  { id: 'md-002', label: 'Quyết định thi hành án (chủ động, theo yêu cầu)', group: 'Cục Quản lý thi hành án dân sự' },
  { id: 'md-003', label: 'Văn bản quy phạm pháp luật', group: 'Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính' },
];

interface MasterDataUpdatePageProps {
  initialMasterId?: string;
}

export function MasterDataUpdatePage({ initialMasterId }: MasterDataUpdatePageProps = {}) {
  const [selectedId, setSelectedId] = useState(
    (initialMasterId && MASTER_DATA_ITEMS.some(m => m.id === initialMasterId))
      ? initialMasterId
      : MASTER_DATA_ITEMS[0].id
  );
  const selected = MASTER_DATA_ITEMS.find(m => m.id === selectedId) || MASTER_DATA_ITEMS[0];

  return (
    <div className="flex gap-6 min-h-[calc(100vh-140px)]">
      <div className="flex-shrink-0 sticky top-0 self-start">
        <InnerSidebar
          title="Cập nhật dữ liệu chủ"
          items={MASTER_DATA_ITEMS}
          onSelectItem={setSelectedId}
          activeId={selectedId}
          hideGroupHeaders
          flatList
        />
      </div>
      <div className="flex-1 min-w-0">
        <MasterDataUpdateItemPage key={selectedId} masterId={selectedId} masterLabel={selected.label} />
      </div>
    </div>
  );
}
