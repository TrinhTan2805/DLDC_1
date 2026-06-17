import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Building2, 
  AlertCircle, 
  FolderTree,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { StatusTag } from '../../common/StatusTag';
import { MojUnitDeleteConfirmModal } from './components/modals/MojUnitDeleteConfirmModal';

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
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const slicedUnits = filteredUnits.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
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
      alert('Cập nhật đơn vị thành công!');
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
      alert('Thêm mới đơn vị thành công!');
    }

    setShowFormModal(false);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <div className="h-full flex flex-col bg-slate-50 p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-slate-800 uppercase tracking-tight" style={{ fontSize: '20px' }}>Danh mục đơn vị thuộc Bộ Tư Pháp</h1>
          <p className="text-[13px] text-slate-500 mt-1">Biên tập và quản lý danh mục mã các đơn vị trực thuộc Bộ Tư Pháp</p>
        </div>
      </div>

      {/* Toolbar - Separated from Table Card */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tên đơn vị..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-center text-[13px] font-semibold text-slate-500 whitespace-nowrap w-12">STT</th>
                <th className="py-3 px-4 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap w-40">Mã đơn vị</th>
                <th className="py-3 px-4 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Tên đơn vị</th>
                <th className="py-3 px-4 text-center text-[13px] font-semibold text-slate-500 whitespace-nowrap w-48">Ngày tạo</th>
                <th className="py-3 px-4 text-center text-[13px] font-semibold text-slate-500 whitespace-nowrap w-44">Trạng thái</th>
                <th className="py-3 px-4 text-center text-[13px] font-semibold text-slate-500 whitespace-nowrap w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {slicedUnits.length > 0 ? (
                slicedUnits.map((unit, index) => (
                  <tr key={unit.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                    <td className="py-4 px-4 text-[13px] text-slate-500 text-center font-medium">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md font-mono text-xs font-semibold">
                        {unit.code}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-[13px] font-semibold text-slate-900">{unit.name}</div>
                    </td>
                    <td className="py-4 px-4 text-center text-[13px] text-slate-500">{unit.createdDate}</td>
                    <td className="py-4 px-4 text-center">
                      <StatusTag 
                        label={unit.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'} 
                        variant={unit.status === 'active' ? 'green' : 'slate'} 
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(unit)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUnitClick(unit)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-4 bg-slate-50 rounded-full mb-4">
                        <Building2 className="w-10 h-10 opacity-20" />
                      </div>
                      <p className="text-[13px] font-medium text-slate-600">Không tìm thấy đơn vị nào.</p>
                      <p className="text-[13px] text-slate-400 mt-1">Vui lòng thử lại với từ khóa khác.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-600">Hiển thị</span>
            <select 
              className="px-2 py-1 border border-slate-300 rounded text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              title="Số bản ghi trên trang"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-[13px] text-slate-600">bản ghi/trang</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-slate-600">
              {filteredUnits.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredUnits.length)} / {filteredUnits.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors text-[13px] font-medium"
              >
                Trước
              </button>
              
              {Array.from({ length: Math.ceil(filteredUnits.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 border rounded-lg text-[13px] font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => {
                  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                disabled={currentPage === Math.ceil(filteredUnits.length / itemsPerPage) || filteredUnits.length === 0}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors text-[13px] font-medium"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <MojUnitDeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingUnit(null);
        }}
        onConfirm={handleConfirmDelete}
        unitName={deletingUnit?.name || ''}
      />

      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200" style={{ fontSize: '13px' }}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-[16px] font-bold text-slate-800">
                {editingUnit ? 'Chỉnh sửa thông tin đơn vị' : 'Thêm mới đơn vị trực thuộc'}
              </h3>
              <button 
                onClick={() => setShowFormModal(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mã đơn vị <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={!!editingUnit}
                  value={formState.code}
                  onChange={(e) => setFormState({ ...formState, code: e.target.value })}
                  placeholder="VD: CNTT"
                  className={`w-full px-3.5 py-2 border rounded-lg text-[13px] transition-all focus:outline-none ${
                    editingUnit 
                      ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' 
                      : formErrors.code
                        ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
                {formErrors.code && (
                  <p className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {formErrors.code}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tên đơn vị <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Nhập tên đầy đủ của đơn vị..."
                  className={`w-full px-3.5 py-2 border rounded-lg text-[13px] transition-all focus:outline-none ${
                    formErrors.name
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Trạng thái
                </label>
                <select
                  title="Chọn trạng thái"
                  value={formState.status}
                  onChange={(e) => setFormState({ ...formState, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-[13px] font-medium hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Lưu lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
