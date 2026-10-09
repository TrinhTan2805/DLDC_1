import { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Building2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Badge, TruncatedText, RowIconAction, Pagination, BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON,
  INPUT_CLS, LABEL_CLS, REQUIRED_MARK, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, normalizeSearch
} from '../collection/collectionUi';
import { MojUnitDeleteConfirmModal } from './components/modals/MojUnitDeleteConfirmModal';

const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';

interface UnitRecord {
  id: string;
  code: string;
  name: string;
  type: 'internal' | 'external';
  createdDate: string;
  status: 'active' | 'inactive';
}

const initialUnits: UnitRecord[] = [
  { id: '1', code: 'BTP', name: 'Bộ Tư pháp', type: 'internal', createdDate: '01/01/2024', status: 'active' },
  { id: '2', code: 'CNTT', name: 'Cục Công nghệ thông tin', type: 'internal', createdDate: '01/01/2024', status: 'active' },
  { id: '3', code: 'HCTP', name: 'Cục Hành chính tư pháp', type: 'internal', createdDate: '01/01/2024', status: 'active' },
  { id: '4', code: 'THADS', name: 'Cục Quản lý thi hành án dân sự', type: 'internal', createdDate: '02/01/2024', status: 'active' },
  { id: '5', code: 'GDPL', name: 'Cục Phổ biến, giáo dục pháp luật', type: 'internal', createdDate: '03/01/2024', status: 'active' },
  { id: '6', code: 'BTTP', name: 'Cục Bổ trợ tư pháp', type: 'internal', createdDate: '04/01/2024', status: 'active' },
];

export function CategoryMojUnitsPage() {
  const [units, setUnits] = useState<UnitRecord[]>(() => {
    const saved = localStorage.getItem('moj_units');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialUnits;
      }
    }
    return initialUnits;
  });

  const saveUnits = (updatedUnits: UnitRecord[]) => {
    setUnits(updatedUnits);
    localStorage.setItem('moj_units', JSON.stringify(updatedUnits));
  };

  const [searchTerm, setSearchTerm] = useState('');
  // Từ khóa đã áp dụng: chỉ cập nhật khi bấm Tìm kiếm hoặc Enter (mục 5.19)
  const [appliedSearch, setAppliedSearch] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitRecord | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUnit, setDeletingUnit] = useState<UnitRecord | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [formState, setFormState] = useState({
    code: '',
    name: '',
    type: 'internal' as 'internal' | 'external',
    status: 'active' as 'active' | 'inactive'
  });

  const [formErrors, setFormErrors] = useState<{ code?: string; name?: string }>({});

  const filteredUnits = units.filter(unit =>
    normalizeSearch(unit.name).includes(normalizeSearch(appliedSearch)) ||
    normalizeSearch(unit.code).includes(normalizeSearch(appliedSearch))
  );

  const slicedUnits = filteredUnits.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
  };

  const runSearch = () => {
    setAppliedSearch(searchTerm);
    setCurrentPage(1);
  };

  const handleOpenAddModal = () => {
    setEditingUnit(null);
    setFormState({
      code: '',
      name: '',
      type: 'internal',
      status: 'active'
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleOpenEditModal = (unit: UnitRecord) => {
    setEditingUnit(unit);
    setFormState({
      code: unit.code,
      name: unit.name,
      type: unit.type || 'internal',
      status: unit.status
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleDeleteUnitClick = (unit: UnitRecord) => {
    setDeletingUnit(unit);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deletingUnit) {
      const updated = units.filter(u => u.id !== deletingUnit.id);
      saveUnits(updated);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { code?: string; name?: string } = {};

    if (!formState.code.trim()) {
      errors.code = 'Mã đơn vị không được để trống';
    } else if (!editingUnit && units.some(u => u.code.toLowerCase() === formState.code.trim().toLowerCase())) {
      errors.code = 'Mã đơn vị đã tồn tại trong hệ thống';
    }

    if (!formState.name.trim()) {
      errors.name = 'Tên đơn vị không được để trống';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingUnit) {
      // Edit
      const updated = units.map(u => 
        u.id === editingUnit.id 
          ? { 
              ...u, 
              name: formState.name.trim(), 
              type: formState.type,
              status: formState.status 
            } 
          : u
      );
      saveUnits(updated);
      toast.success('Cập nhật đơn vị thành công!');
    } else {
      // Add
      const newUnit: UnitRecord = {
        id: Date.now().toString(),
        code: formState.code.trim().toUpperCase(),
        name: formState.name.trim(),
        type: formState.type,
        createdDate: new Date().toLocaleDateString('vi-VN'),
        status: formState.status
      };
      saveUnits([...units, newUnit]);
      toast.success('Thêm mới đơn vị thành công!');
    }

    setShowFormModal(false);
  };

  const inputCls = (hasError: boolean) =>
    hasError ? INPUT_CLS.replace('border-[#E2E8F0]', 'border-[#DC2626]') : INPUT_CLS;

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] p-6 space-y-6 min-h-screen text-[13px]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-50 shrink-0">
          <Building2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Danh mục đơn vị thuộc Bộ Tư Pháp</h1>
          <p className="text-[13px] text-[#64748B]">Biên tập và quản lý danh mục mã các đơn vị trực thuộc Bộ Tư Pháp</p>
        </div>
      </div>

      {/* Toolbar (mục 5.19) */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-1.5">
          <div className="relative flex-1">
            <input
              type="text"
              aria-label="Tìm kiếm đơn vị"
              placeholder="Tìm kiếm theo mã, tên đơn vị..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
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

        <div className="flex items-center gap-1.5">
          <button type="button" onClick={handleOpenAddModal} className={BTN_PRIMARY}>
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Table (mục 5.3) */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px]">
                <th className={`${TH} text-center w-12`}>STT</th>
                <th className={`${TH} text-left w-40`}>Mã đơn vị</th>
                <th className={`${TH} text-left`}>Tên đơn vị</th>
                <th className={`${TH} text-left w-px`}>Ngày tạo</th>
                <th className={`${TH} text-left w-px`}>Trạng thái</th>
                <th className={`${TH} text-center w-px`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {slicedUnits.length > 0 ? (
                slicedUnits.map((unit, index) => (
                  <tr key={unit.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                    <td className={`${TD} text-center whitespace-nowrap`}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className={`${TD} text-left max-w-[160px]`}>
                      <TruncatedText text={unit.code} />
                    </td>
                    <td className={`${TD} text-left max-w-[360px]`}>
                      <TruncatedText text={unit.name} />
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap`}>{unit.createdDate}</td>
                    <td className={`${TD} text-left`}>
                      <Badge
                        label={unit.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                        variant={unit.status === 'active' ? 'green' : 'slate'}
                      />
                    </td>
                    <td className={`${TD} text-center`}>
                      {/* Cột thao tác (mục 5.3.2): 2 thao tác => hiện hết */}
                      <div className="inline-flex items-center justify-center gap-1">
                        <RowIconAction label="Chỉnh sửa" onClick={() => handleOpenEditModal(unit)}>
                          <Edit2 className="w-4 h-4" />
                        </RowIconAction>
                        <RowIconAction label="Xóa" onClick={() => handleDeleteUnitClick(unit)}>
                          <Trash2 className="w-4 h-4" />
                        </RowIconAction>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[13px] text-[#64748B]">
                    <p>Không tìm thấy đơn vị nào.</p>
                    <p className="mt-1">Vui lòng thử lại với từ khóa khác.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (mục 5.14) */}
        <Pagination
          className="border-t border-[#E2E8F0]"
          currentPage={currentPage}
          totalItems={filteredUnits.length}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </div>

      {/* Delete Confirm Modal */}
      <MojUnitDeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingUnit(null);
        }}
        onConfirm={handleConfirmDelete}
        unitName={deletingUnit?.name || ''}
      />

      {/* Form Modal (mục 5.4) */}
      {showFormModal && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#020817]">
                {editingUnit ? 'Chỉnh sửa thông tin đơn vị' : 'Thêm mới đơn vị trực thuộc'}
              </h3>
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className={BTN_GHOST_ICON}
                title="Đóng"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col min-h-0">
              <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-4">
                <div>
                  <label className={LABEL_CLS}>
                    Mã đơn vị <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <input
                    type="text"
                    aria-label="Mã đơn vị"
                    disabled={!!editingUnit}
                    value={formState.code}
                    onChange={(e) => setFormState({ ...formState, code: e.target.value })}
                    placeholder="VD: CNTT"
                    className={inputCls(!editingUnit && !!formErrors.code)}
                  />
                  {formErrors.code && (
                    <p className="text-[#DC2626] text-[12px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.code}
                    </p>
                  )}
                </div>

                <div>
                  <label className={LABEL_CLS}>
                    Tên đơn vị <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <input
                    type="text"
                    aria-label="Tên đơn vị"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Nhập tên đầy đủ của đơn vị..."
                    className={inputCls(!!formErrors.name)}
                  />
                  {formErrors.name && (
                    <p className="text-[#DC2626] text-[12px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className={LABEL_CLS}>Trạng thái</label>
                  <select
                    title="Chọn trạng thái"
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as 'active' | 'inactive' })}
                    className={`${INPUT_CLS} cursor-pointer`}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
                <button type="button" onClick={() => setShowFormModal(false)} className={BTN_OUTLINE}>
                  Hủy
                </button>
                <button type="submit" className={BTN_PRIMARY}>
                  <Save className="w-4 h-4" />
                  Lưu lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
