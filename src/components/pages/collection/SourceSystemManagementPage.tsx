import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { SourceSystemModal } from './SourceSystemModal';
import { SourceSystemDetailModal } from './SourceSystemDetailModal';
import { SourceSystemDeleteConfirmModal } from './SourceSystemDeleteConfirmModal';
import { initialSourceSystems } from './mockSourceSystems';
import { Unit } from './ConnectionManagementPage';
import { TruncatedText, RowIconAction, Pagination, BTN_PRIMARY, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, normalizeSearch } from './collectionUi';

const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';

interface SourceSystemManagementPageProps {
  units: Unit[];
}

export function SourceSystemManagementPage({ units }: SourceSystemManagementPageProps) {
  const [data, setData] = useState(initialSourceSystems);
  const [searchTerm, setSearchTerm] = useState('');
  // Tìm kiếm chỉ áp dụng khi bấm Tìm kiếm / Enter (compomennt.md 5.19)
  const [appliedSearch, setAppliedSearch] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [viewingItem, setViewingItem] = useState<any | null>(null);
  const [deletingItem, setDeletingItem] = useState<any | null>(null);

  // Filtered data based on search term
  const q = normalizeSearch(appliedSearch);
  const filteredData = data.filter(item =>
    normalizeSearch(item.systemName).includes(q) ||
    normalizeSearch(item.unitName).includes(q)
  );

  const runSearch = () => {
    setAppliedSearch(searchTerm);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleView = (item: any) => {
    setViewingItem(item);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (item: any) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleSave = (savedData: any) => {
    if (editingItem) {
      // Edit mode
      setData(data.map(item => item.id === editingItem.id ? { ...savedData, id: editingItem.id } : item));
    } else {
      // Add mode
      const newItem = {
        ...savedData,
        id: Math.random().toString(36).substr(2, 9) // Generate a random ID
      };
      setData([...data, newItem]);
    }
  };

  const handleExport = () => {
    toast.info('Đang kết xuất danh sách hệ thống nguồn ra file Excel...');
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Quản lý hệ thống nguồn</h1>
        <p className="text-[13px] text-[#64748B]">Danh sách hệ thống nguồn cung cấp dữ liệu</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-1.5">
          <input
            type="text"
            aria-label="Tìm kiếm hệ thống nguồn"
            placeholder="Tìm kiếm theo tên hệ thống hoặc đơn vị..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
            className={SEARCH_INPUT_CLS}
          />
          <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={handleAdd} className={BTN_PRIMARY}>
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px]">
                <th className={`${TH} text-center w-12`}>STT</th>
                <th className={`${TH} text-left`}>Tên hệ thống</th>
                <th className={`${TH} text-left`}>Tên đơn vị</th>
                <th className={`${TH} text-left`}>Đầu mối liên hệ</th>
                <th className={`${TH} text-center w-32 sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((item, index) => (
                    <tr key={item.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                      <td className={`${TD} text-center whitespace-nowrap`}>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className={`${TD} text-left max-w-[360px]`}>
                        <TruncatedText text={item.systemName} />
                      </td>
                      <td className={`${TD} text-left max-w-[360px]`}>
                        <TruncatedText text={item.unitName} />
                      </td>
                      <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                        <div>{item.contactPerson || '-'}</div>
                        {item.phone && <div className="text-[#64748B]">{item.phone}</div>}
                      </td>
                      <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]`}>
                        <div className="inline-flex items-center justify-center gap-1">
                          <RowIconAction label="Xem chi tiết" onClick={() => handleView(item)}>
                            <Eye className="w-4 h-4" />
                          </RowIconAction>
                          <RowIconAction label="Sửa" onClick={() => handleEdit(item)}>
                            <Edit className="w-4 h-4" />
                          </RowIconAction>
                          <RowIconAction label="Xóa" onClick={() => handleDelete(item)}>
                            <Trash2 className="w-4 h-4" />
                          </RowIconAction>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-[13px] text-[#64748B]">
                    <p>Không tìm thấy hệ thống nguồn nào.</p>
                    <p className="mt-1">Vui lòng thử lại với từ khóa khác.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          className="border-t border-[#E2E8F0]"
          currentPage={currentPage}
          totalItems={filteredData.length}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </div>

      {/* Modals */}
      <SourceSystemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingData={editingItem}
        units={units}
      />

      <SourceSystemDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={viewingItem}
      />

      <SourceSystemDeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingItem(null);
        }}
        onConfirm={() => {
          if (deletingItem) {
            setData(data.filter(item => item.id !== deletingItem.id));
          }
        }}
        systemName={deletingItem?.systemName || ''}
      />
    </div>
  );
}
