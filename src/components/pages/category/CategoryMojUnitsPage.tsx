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
  FileSpreadsheet
} from 'lucide-react';
import { StatusTag } from '../../common/StatusTag';

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

  const handleDeleteUnit = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa đơn vị "${name}" không?`)) {
      const updated = units.filter(u => u.id !== id);
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
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Danh mục đơn vị thuộc Bộ Tư Pháp</h2>
            <p className="text-sm text-slate-500 mt-0.5">Biên tập và quản lý danh mục mã các đơn vị trực thuộc Bộ Tư Pháp</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tên đơn vị..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <button 
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm đơn vị mới
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-16">STT</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-40">Mã đơn vị</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tên đơn vị</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-44">Loại đơn vị</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-48">Ngày tạo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-44">Trạng thái</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUnits.map((unit, index) => (
                <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{index + 1}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md font-mono text-xs font-semibold">
                      {unit.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-800 font-medium">{unit.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <StatusTag 
                      label={(!unit.type || unit.type === 'internal') ? 'Trong ngành' : 'Ngoài ngành'} 
                      variant={unit.type === 'external' ? 'orange' : 'blue'} 
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{unit.createdDate}</td>
                  <td className="px-6 py-4">
                    <StatusTag 
                      label={unit.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'} 
                      variant={unit.status === 'active' ? 'green' : 'slate'} 
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(unit)}
                        className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUnit(unit.id, unit.name)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUnits.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-300" />
                      <span className="text-sm font-medium">Không tìm thấy đơn vị nào</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-800">
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mã đơn vị <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={!!editingUnit}
                  value={formState.code}
                  onChange={(e) => setFormState({ ...formState, code: e.target.value })}
                  placeholder="VD: CNTT"
                  className={`w-full px-3.5 py-2 border rounded-lg text-sm transition-all focus:outline-none ${
                    editingUnit 
                      ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' 
                      : formErrors.code
                        ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
                {formErrors.code && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {formErrors.code}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tên đơn vị <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Nhập tên đầy đủ của đơn vị..."
                  className={`w-full px-3.5 py-2 border rounded-lg text-sm transition-all focus:outline-none ${
                    formErrors.name
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Loại đơn vị
                </label>
                <select
                  title="Chọn loại đơn vị"
                  value={formState.type}
                  onChange={(e) => setFormState({ ...formState, type: e.target.value as 'internal' | 'external' })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="internal">Trong ngành</option>
                  <option value="external">Ngoài ngành</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Trạng thái
                </label>
                <select
                  title="Chọn trạng thái"
                  value={formState.status}
                  onChange={(e) => setFormState({ ...formState, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-1.5"
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
  );
}
