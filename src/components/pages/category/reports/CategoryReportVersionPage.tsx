import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { MasterDataEntity } from '../categoryTypes';
import { EntityVersionHistoryModal } from '../components/modals/EntityVersionHistoryModal';

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

export function CategoryReportVersionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedEntity, setSelectedEntity] = useState<MasterDataEntity | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const filteredEntities = reportEntities.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedEntities = filteredEntities.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const renderPagination = (totalItemsCount: number) => {
    if (totalItemsCount <= 0) return null;
    const totalPages = Math.ceil(totalItemsCount / pageSize);
    const startItem = (currentPageNum - 1) * pageSize + 1;
    const endItem = Math.min(currentPageNum * pageSize, totalItemsCount);

    return (
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-normal">Hiển thị</span>
          <select
            aria-label="Select record count"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPageNum(1);
            }}
            className="px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-[13px] cursor-pointer font-medium"
            title="Số bản ghi trên trang"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-slate-600 font-normal">bản ghi/trang</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-600 font-normal">
            {startItem} - {endItem} / {totalItemsCount}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
              disabled={currentPageNum === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPageNum(page)}
                className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${currentPageNum === page
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
              disabled={currentPageNum === totalPages}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Bar - form chung */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <label className="block text-[12px] text-slate-500 mb-1 font-medium">Từ khóa</label>
            <input
              type="text"
              placeholder="Tìm kiếm danh mục theo tên hoặc mã..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPageNum(1); }}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 transition-all"
            />
          </div>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-[13px] shadow-sm shrink-0 active:scale-95"
            title="Tìm kiếm"
          >
            <Search className="w-4 h-4" />
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Grid Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-16">STT</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên danh mục</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-28">Phiên bản</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ngày thay đổi</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ngày hiệu lực</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Người thay đổi</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700">Nội dung thay đổi</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedEntities.length > 0 ? (
                paginatedEntities.map((entity, index) => (
                  <tr key={entity.id} className="hover:bg-slate-50/50 transition-all group border-b border-slate-100">
                    <td className="px-6 py-4 text-slate-500 text-[13px] font-normal text-center">{(currentPageNum - 1) * pageSize + index + 1}</td>
                    <td className="px-6 py-4 text-slate-900 text-[13px] font-medium hover:text-blue-600 transition-colors">
                      {entity.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-[12px] font-semibold">
                        v{entity.version}.0
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 text-[13px] font-normal">{entity.updatedDate}</td>
                    <td className="px-6 py-4 text-slate-700 text-[13px] font-normal">{entity.effectiveDate || '--'}</td>
                    <td className="px-6 py-4 text-slate-700 text-[13px] font-normal">{entity.updatedBy || 'Nguyễn Văn A'}</td>
                    <td className="px-6 py-4 text-slate-700 text-[13px] font-normal">{entity.changeDescription || '--'}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedEntity(entity);
                          setShowHistoryModal(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-[13px] text-slate-500">
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {renderPagination(filteredEntities.length)}
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
