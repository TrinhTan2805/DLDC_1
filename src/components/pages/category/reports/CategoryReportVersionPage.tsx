import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { MasterDataEntity } from '../categoryTypes';
import { EntityVersionHistoryModal } from '../components/modals/EntityVersionHistoryModal';
import { Badge, TruncatedText, RowIconAction, Pagination, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, normalizeSearch } from '../../collection/collectionUi';

const reportEntities: MasterDataEntity[] = [
  {
    id: '1',
    code: 'DM-GIOITINH',
    name: 'Dữ liệu Danh mục giới tính',
    dataType: 'reference',
    managingAgency: 'Bộ Tư pháp',
    scope: 'national',
    description: 'Danh mục giới tính chuẩn quốc gia',
    lifecycleStatus: 'active',
    createdDate: '20/12/2024',
    updatedDate: '20/06/2026',
    createdBy: 'admin_tudien',
    updatedBy: 'Nguyễn Văn A',
    version: 3,
    effectiveDate: '25/06/2026',
    changeDescription: 'Thêm trường phone_code, cập nhật độ dài gender_code, xóa trường note',
    dataSource: 'dldc',
    databaseSystem: 'Cơ sở dữ liệu Hộ tịch'
  },
  {
    id: '2',
    code: 'DM-DANTOC',
    name: 'Dữ liệu Danh mục và mã các dân tộc',
    dataType: 'reference',
    managingAgency: 'Ủy ban Dân tộc',
    scope: 'national',
    description: 'Danh mục các dân tộc tại Việt Nam',
    lifecycleStatus: 'active',
    createdDate: '20/12/2024',
    updatedDate: '12/03/2026',
    createdBy: 'system_auto',
    updatedBy: 'Trần Thị B',
    version: 2,
    effectiveDate: '15/03/2026',
    changeDescription: 'Cập nhật đơn vị chủ quản và nguồn dữ liệu',
    dataSource: 'manual',
    databaseSystem: 'Hệ thống Quản lý thông tin Dân tộc'
  },
  {
    id: '3',
    code: 'DM-QUOCGIA',
    name: 'Dữ liệu Danh mục và mã Quốc gia, Quốc tịch',
    dataType: 'reference',
    managingAgency: 'Bộ Ngoại giao',
    scope: 'national',
    description: 'Danh mục các quốc gia và vùng lãnh thổ',
    lifecycleStatus: 'active',
    createdDate: '10/01/2026',
    updatedDate: '20/06/2026',
    createdBy: 'Lê Văn C',
    updatedBy: 'Nguyễn Văn A',
    version: 3,
    effectiveDate: '25/06/2026',
    changeDescription: 'Thêm trường mã điện thoại quốc gia (phone_code)',
    dataSource: 'dldc',
    databaseSystem: 'Cơ sở dữ liệu Quốc tịch / Hộ tịch'
  },
  {
    id: '4',
    code: 'DM-TONGIAO',
    name: 'Dữ liệu Danh mục và mã các Tôn giáo',
    dataType: 'reference',
    managingAgency: 'Ban Tôn giáo Chính phủ',
    scope: 'national',
    description: 'Danh mục các tôn giáo được công nhận tại Việt Nam',
    lifecycleStatus: 'active',
    createdDate: '20/12/2024',
    updatedDate: '20/12/2024',
    createdBy: 'Hệ thống',
    updatedBy: 'Phạm Văn D',
    version: 1,
    effectiveDate: '20/12/2024',
    changeDescription: 'Khởi tạo cấu trúc ban đầu',
    dataSource: 'manual',
    databaseSystem: 'Hệ thống Quản lý Tôn giáo'
  },
  {
    id: '5',
    code: 'DM-COQUAN',
    name: 'Dữ liệu Danh mục cơ quan',
    dataType: 'reference',
    managingAgency: 'Bộ Nội vụ',
    scope: 'national',
    description: 'Danh sách các cơ quan nhà nước, bộ, ngành, sở, ban',
    lifecycleStatus: 'active',
    createdDate: '12/12/2024',
    updatedDate: '13/12/2024',
    createdBy: 'Ngô Thị E',
    updatedBy: 'Lãnh đạo bộ',
    version: 2,
    effectiveDate: '15/12/2024',
    changeDescription: 'Cập nhật danh sách cơ quan theo Nghị định mới',
    dataSource: 'manual',
    databaseSystem: 'Hệ thống Quản lý Cơ quan hành chính'
  },
  {
    id: '6',
    code: 'DM-HC',
    name: 'Dữ liệu Danh mục đơn vị hành chính',
    dataType: 'reference',
    managingAgency: 'Bộ Nội vụ',
    scope: 'national',
    description: 'Danh mục đơn vị hành chính',
    lifecycleStatus: 'active',
    createdDate: '20/12/2024',
    updatedDate: '20/12/2024',
    createdBy: 'Hệ thống',
    updatedBy: 'Nguyễn Văn A',
    version: 1,
    effectiveDate: '20/12/2024',
    changeDescription: 'Khởi tạo danh mục đơn vị hành chính',
    dataSource: 'manual',
    databaseSystem: 'Cơ sở dữ liệu Đơn vị hành chính'
  }
];

// Bảng (compomennt.md 5.3)
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';

export function CategoryReportVersionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  // Từ khóa chỉ áp dụng khi bấm Tìm kiếm hoặc Enter (compomennt.md 5.19)
  const [appliedSearch, setAppliedSearch] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedEntity, setSelectedEntity] = useState<MasterDataEntity | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const runSearch = () => {
    setAppliedSearch(searchTerm);
    setCurrentPageNum(1);
  };

  const keyword = normalizeSearch(appliedSearch);
  const filteredEntities = reportEntities.filter(e =>
    normalizeSearch(e.name).includes(keyword) ||
    normalizeSearch(e.code).includes(keyword)
  );

  const paginatedEntities = filteredEntities.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  return (
    <div className="space-y-4">
      {/* Search Bar (compomennt.md 5.19) */}
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <input
            type="text"
            aria-label="Tìm kiếm danh mục"
            placeholder="Tìm kiếm danh mục theo tên hoặc mã..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
            className={SEARCH_INPUT_CLS}
          />
        </div>
        <button
          type="button"
          aria-label="Tìm kiếm"
          title="Tìm kiếm"
          onClick={runSearch}
          className={SEARCH_BTN_CLS}
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Grid Table (compomennt.md 5.3) */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px]">
                <th className={`${TH} text-center w-12`}>STT</th>
                <th className={`${TH} text-left min-w-[220px]`}>Tên danh mục</th>
                <th className={`${TH} text-left w-px`}>Phiên bản</th>
                <th className={`${TH} text-left w-px`}>Ngày thay đổi</th>
                <th className={`${TH} text-left w-px`}>Ngày hiệu lực</th>
                <th className={`${TH} text-left w-px`}>Người thay đổi</th>
                <th className={`${TH} text-left`}>Nội dung thay đổi</th>
                <th className={`${TH} text-center w-px`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEntities.length > 0 ? (
                paginatedEntities.map((entity, index) => (
                  <tr key={entity.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                    <td className={`${TD} text-center whitespace-nowrap`}>{(currentPageNum - 1) * pageSize + index + 1}</td>
                    <td className={`${TD} text-left max-w-[360px]`}>
                      <TruncatedText text={entity.name} />
                    </td>
                    <td className={`${TD} text-left`}>
                      <Badge label={`v${entity.version}.0`} variant="green" />
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap`}>{entity.updatedDate}</td>
                    <td className={`${TD} text-left whitespace-nowrap`}>{entity.effectiveDate || '--'}</td>
                    <td className={`${TD} text-left whitespace-nowrap`}>{entity.updatedBy || 'Nguyễn Văn A'}</td>
                    <td className={`${TD} text-left max-w-[360px]`}>
                      <TruncatedText text={entity.changeDescription || '--'} />
                    </td>
                    <td className={`${TD} text-center`}>
                      <div className="flex items-center justify-center">
                        <RowIconAction
                          label="Xem chi tiết"
                          onClick={() => {
                            setSelectedEntity(entity);
                            setShowHistoryModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </RowIconAction>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-3 py-16 text-center text-[13px] text-[#64748B]">
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredEntities.length > 0 && (
          <Pagination
            className="border-t border-[#E2E8F0]"
            currentPage={currentPageNum}
            totalItems={filteredEntities.length}
            pageSize={pageSize}
            onPageChange={setCurrentPageNum}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 20, 50]}
          />
        )}
      </div>

      {/* Entity Version History Modal */}
      {selectedEntity && (
        <EntityVersionHistoryModal
          isOpen={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedEntity(null);
          }}
          entity={selectedEntity}
        />
      )}
    </div>
  );
}
