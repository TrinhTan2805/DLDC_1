import { useState } from 'react';
import { InnerSidebar } from '../collection/InnerSidebar';
import { MasterDataUpdateItemPage } from './MasterDataUpdateItemPage';

const MASTER_DATA_ITEMS = [
  { id: 'md-001', label: 'Quyết định thi hành án', group: 'Cục Quản lý THADS' },
  { id: 'md-002', label: 'Đăng ký khai sinh', group: 'CSDL hộ tịch điện tử' },
  { id: 'md-003', label: 'Đăng ký khai tử', group: 'CSDL hộ tịch điện tử' },
  { id: 'md-004', label: 'Đăng ký kết hôn', group: 'CSDL hộ tịch điện tử' },
  { id: 'md-005', label: 'Xác nhận tình trạng hôn nhân', group: 'CSDL hộ tịch điện tử' },
  { id: 'md-006', label: 'Đăng ký nhận cha, mẹ, con', group: 'CSDL hộ tịch điện tử' },
  { id: 'md-007', label: 'Thay đổi, cải chính hộ tịch', group: 'CSDL hộ tịch điện tử' },
  { id: 'md-008', label: 'Giám hộ', group: 'CSDL hộ tịch điện tử' },
  { id: 'md-009', label: 'Ghi chú ly hôn', group: 'CSDL hộ tịch điện tử' },
  { id: 'md-010', label: 'Nuôi con nuôi', group: 'CSDL hộ tịch điện tử' },
  { id: 'md-011', label: 'Quyết định nhập quốc tịch', group: 'CSDL quốc tịch' },
  { id: 'md-012', label: 'Quyết định thôi quốc tịch', group: 'CSDL quốc tịch' },
  { id: 'md-013', label: 'Quyết định trở lại quốc tịch', group: 'CSDL quốc tịch' },
  { id: 'md-014', label: 'Tước quốc tịch Việt Nam', group: 'CSDL quốc tịch' },
  { id: 'md-015', label: 'Luật sư', group: 'Bổ trợ tư pháp — Cá nhân' },
  { id: 'md-016', label: 'Tư vấn viên pháp luật', group: 'Bổ trợ tư pháp — Cá nhân' },
  { id: 'md-017', label: 'Công chứng viên', group: 'Bổ trợ tư pháp — Cá nhân' },
  { id: 'md-018', label: 'Quản tài viên', group: 'Bổ trợ tư pháp — Cá nhân' },
  { id: 'md-019', label: 'Đấu giá viên', group: 'Bổ trợ tư pháp — Cá nhân' },
  { id: 'md-020', label: 'Giám định viên tư pháp', group: 'Bổ trợ tư pháp — Cá nhân' },
  { id: 'md-021', label: 'Trọng tài viên thương mại', group: 'Bổ trợ tư pháp — Cá nhân' },
  { id: 'md-022', label: 'Hòa giải viên thương mại', group: 'Bổ trợ tư pháp — Cá nhân' },
  { id: 'md-023', label: 'Tổ chức hành nghề Luật sư Việt Nam', group: 'Bổ trợ tư pháp — Tổ chức' },
  { id: 'md-024', label: 'Tổ chức hành nghề Luật sư nước ngoài', group: 'Bổ trợ tư pháp — Tổ chức' },
  { id: 'md-025', label: 'Trung tâm tư vấn pháp luật', group: 'Bổ trợ tư pháp — Tổ chức' },
  { id: 'md-026', label: 'Tổ chức hành nghề công chứng', group: 'Bổ trợ tư pháp — Tổ chức' },
  { id: 'md-027', label: 'Doanh nghiệp quản lý, thanh lý tài sản', group: 'Bổ trợ tư pháp — Tổ chức' },
  { id: 'md-028', label: 'Tổ chức hành nghề đấu giá tài sản', group: 'Bổ trợ tư pháp — Tổ chức' },
  { id: 'md-029', label: 'Tổ chức giám định tư pháp', group: 'Bổ trợ tư pháp — Tổ chức' },
  { id: 'md-030', label: 'Trung tâm hòa giải thương mại', group: 'Bổ trợ tư pháp — Tổ chức' },
  { id: 'md-031', label: 'Trung tâm trọng tài thương mại', group: 'Bổ trợ tư pháp — Tổ chức' },
  { id: 'md-032', label: 'Tuyên truyền viên pháp luật', group: 'Phổ biến, GDPL và TGPL' },
  { id: 'md-033', label: 'Hòa giải viên ở cơ sở', group: 'Phổ biến, GDPL và TGPL' },
  { id: 'md-034', label: 'Báo cáo viên pháp luật', group: 'Phổ biến, GDPL và TGPL' },
  { id: 'md-035', label: 'Đối tượng được trợ giúp pháp lý', group: 'Phổ biến, GDPL và TGPL' },
  { id: 'md-036', label: 'Tổ chức trợ giúp pháp lý', group: 'Phổ biến, GDPL và TGPL' },
  { id: 'md-037', label: 'Người thực hiện TGPL', group: 'Phổ biến, GDPL và TGPL' },
  { id: 'md-038', label: 'Tài sản bảo đảm', group: 'Đăng ký giao dịch bảo đảm' },
];

export function MasterDataUpdateListPage() {
  const [selectedId, setSelectedId] = useState(MASTER_DATA_ITEMS[0].id);
  const selected = MASTER_DATA_ITEMS.find(m => m.id === selectedId) || MASTER_DATA_ITEMS[0];

  return (
    <div className="flex gap-6 min-h-[calc(100vh-140px)]">
      <div className="flex-shrink-0 sticky top-0 self-start">
        <InnerSidebar
          title="Cập nhật dữ liệu chủ"
          items={MASTER_DATA_ITEMS}
          onSelectItem={setSelectedId}
          activeId={selectedId}
        />
      </div>
      <div className="flex-1 min-w-0">
        <MasterDataUpdateItemPage masterId={selectedId} masterLabel={selected.label} />
      </div>
    </div>
  );
}
