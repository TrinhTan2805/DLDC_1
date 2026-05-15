import { useState } from 'react';
import { X, Plus, Trash2, Edit } from 'lucide-react';

interface Executor {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface ExecutorManagementModalProps {
  onClose: () => void;
}

export function ExecutorManagementModal({ onClose }: ExecutorManagementModalProps) {
  const [executors, setExecutors] = useState<Executor[]>([
    { id: 1, name: 'Hoàng Văn E', email: 'hoangvane@moj.gov.vn', role: 'Chuyên viên xử lý' },
    { id: 2, name: 'Nguyễn Thị D', email: 'nguyenthid@moj.gov.vn', role: 'Chuyên viên xử lý' },
    { id: 3, name: 'Trần Văn B', email: 'tranvanb@moj.gov.vn', role: 'Trưởng phòng' },
    { id: 4, name: 'Lê Thị C', email: 'lethic@moj.gov.vn', role: 'Chuyên viên xử lý' },
    { id: 5, name: 'Phạm Văn A', email: 'phamvana@moj.gov.vn', role: 'Phó phòng' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });

  const handleAdd = () => {
    if (formData.name && formData.email && formData.role) {
      const newExecutor = {
        id: Math.max(...executors.map(e => e.id)) + 1,
        ...formData
      };
      setExecutors([...executors, newExecutor]);
      setFormData({ name: '', email: '', role: '' });
      setIsAdding(false);
    }
  };

  const handleEdit = (executor: Executor) => {
    setEditingId(executor.id);
    setFormData({ name: executor.name, email: executor.email, role: executor.role });
  };

  const handleUpdate = () => {
    if (editingId && formData.name && formData.email && formData.role) {
      setExecutors(executors.map(e => 
        e.id === editingId 
          ? { ...e, name: formData.name, email: formData.email, role: formData.role }
          : e
      ));
      setEditingId(null);
      setFormData({ name: '', email: '', role: '' });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa người thực hiện này?')) {
      setExecutors(executors.filter(e => e.id !== id));
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', email: '', role: '' });
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h3 className="text-slate-900">Quản lý Người thực hiện</h3>
            <p className="text-sm text-slate-600 mt-1">Thêm, sửa, xóa người phụ trách xử lý dữ liệu</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Add Button */}
            {!isAdding && !editingId && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Thêm người thực hiện
              </button>
            )}

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <h4 className="text-sm text-slate-900 mb-3">
                  {isAdding ? 'Thêm người thực hiện mới' : 'Chỉnh sửa thông tin'}
                </h4>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Vai trò"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={isAdding ? handleAdd : handleUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    {isAdding ? 'Thêm' : 'Cập nhật'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Executors List */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase">Họ và tên</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase">Vai trò</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {executors.map((executor) => (
                    <tr key={executor.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-900">{executor.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{executor.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{executor.role}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(executor)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(executor.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đóng
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
