import { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Save } from 'lucide-react';
import { ConfirmModal } from '../../common/ConfirmModal';
import { Unit } from './ConnectionManagementPage';
import { Badge, TruncatedText, RowIconAction, Pagination, BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS, LABEL_CLS, REQUIRED_MARK, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, normalizeSearch } from './collectionUi';

interface UnitManagementPageProps {
  units: Unit[];
  onUnitsChange: (units: Unit[]) => void;
}

const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';

export function UnitManagementPage({ units, onUnitsChange }: UnitManagementPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  // Tìm kiếm chỉ áp dụng khi bấm Tìm kiếm / Enter (compomennt.md 5.19)
  const [appliedSearch, setAppliedSearch] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Unit | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Unit, 'id'>>({
    unitName: '',
    unitCode: '',
    unitType: 'Trong ngành'
  });

  // Filtered data based on search term
  const q = normalizeSearch(appliedSearch);
  const filteredData = units.filter(item =>
    normalizeSearch(item.unitName).includes(q) ||
    normalizeSearch(item.unitCode).includes(q) ||
    normalizeSearch(item.unitType).includes(q)
  );

  const runSearch = () => {
    setAppliedSearch(searchTerm);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      unitName: '',
      unitCode: '',
      unitType: 'Trong ngành'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Unit) => {
    setEditingItem(item);
    setFormData({
      unitName: item.unitName,
      unitCode: item.unitCode,
      unitType: item.unitType
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      // Edit mode
      onUnitsChange(units.map(item => item.id === editingItem.id ? { ...formData, id: editingItem.id } : item));
    } else {
      // Add mode
      const newItem = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9)
      };
      onUnitsChange([...units, newItem]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Quản lý đơn vị</h1>
        <p className="text-[13px] text-[#64748B]">Danh sách đơn vị, cơ quan, tổ chức trong hệ thống</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-1.5">
          <input
            type="text"
            aria-label="Tìm kiếm đơn vị"
            placeholder="Tìm kiếm theo tên đơn vị, mã đơn vị hoặc loại đơn vị..."
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
                <th className={`${TH} text-left`}>Tên đơn vị</th>
                <th className={`${TH} text-left w-48`}>Mã đơn vị</th>
                <th className={`${TH} text-left w-48`}>Loại đơn vị</th>
                <th className={`${TH} text-center w-28 sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
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
                        <TruncatedText text={item.unitName} />
                      </td>
                      <td className={`${TD} text-left max-w-[192px]`}>
                        <TruncatedText text={item.unitCode} />
                      </td>
                      <td className={`${TD} text-left`}>
                        <Badge label={item.unitType} variant={item.unitType === 'Trong ngành' ? 'purple' : 'blue'} />
                      </td>
                      <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]`}>
                        <div className="inline-flex items-center justify-center gap-1">
                          <RowIconAction label="Sửa" onClick={() => handleEdit(item)}>
                            <Edit className="w-4 h-4" />
                          </RowIconAction>
                          <RowIconAction label="Xóa" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </RowIconAction>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-[13px] text-[#64748B]">
                    <p>Không tìm thấy đơn vị nào.</p>
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="unit-modal-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <h2 id="unit-modal-title" className="text-[16px] font-medium text-[#020817]">
                {editingItem ? 'Sửa thông tin đơn vị' : 'Thêm mới đơn vị'}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
              <form id="unit-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className={LABEL_CLS}>
                    Tên đơn vị <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unitName}
                    onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
                    className={INPUT_CLS}
                    placeholder="Nhập tên đơn vị"
                  />
                </div>

                <div>
                  <label className={LABEL_CLS}>
                    Mã đơn vị <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unitCode}
                    onChange={(e) => setFormData({ ...formData, unitCode: e.target.value })}
                    className={INPUT_CLS}
                    placeholder="Nhập mã đơn vị"
                  />
                </div>

                <div>
                  <label className={LABEL_CLS}>
                    Loại đơn vị
                  </label>
                  <select
                    aria-label="Loại đơn vị"
                    value={formData.unitType}
                    onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
                    className={INPUT_CLS}
                  >
                    <option value="Trong ngành">Trong ngành</option>
                    <option value="Ngoài ngành">Ngoài ngành</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className={BTN_OUTLINE}>
                Hủy
              </button>
              <button type="submit" form="unit-form" className={BTN_PRIMARY}>
                <Save className="w-4 h-4" />
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Xác nhận xóa (thay window.confirm bằng hộp thoại chuẩn 5.4) */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId !== null) onUnitsChange(units.filter(item => item.id !== deletingId));
        }}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa đơn vị này?"
      />
    </div>
  );
}
