import { useState } from 'react';
import { X, Plus, SquarePen, Trash2, Save, Settings } from 'lucide-react';

interface Attribute {
  id: string;
  name: string;
  dataType: string;
  maxLength?: number;
  required: boolean;
  unique: boolean;
  defaultValue?: string;
}

interface AttributeManagementModalProps {
  onClose: () => void;
  entityName?: string;
}

export function AttributeManagementModal({ onClose, entityName = 'Dữ liệu chủ' }: AttributeManagementModalProps) {
  const [attributes, setAttributes] = useState<Attribute[]>([
    { id: '1', name: 'CCCD', dataType: 'string', maxLength: 12, required: true, unique: true },
    { id: '2', name: 'Họ tên', dataType: 'string', maxLength: 255, required: true, unique: false },
    { id: '3', name: 'Ngày sinh', dataType: 'date', required: true, unique: false },
    { id: '4', name: 'Giới tính', dataType: 'string', maxLength: 10, required: true, unique: false },
    { id: '5', name: 'Quê quán', dataType: 'string', maxLength: 500, required: false, unique: false },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAttr, setEditingAttr] = useState<Attribute | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dataType: 'string',
    maxLength: '',
    required: false,
    unique: false,
    defaultValue: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAttr) {
      setAttributes(attributes.map(attr => 
        attr.id === editingAttr.id 
          ? { 
              ...attr, 
              ...formData, 
              maxLength: formData.maxLength ? parseInt(formData.maxLength) : undefined 
            }
          : attr
      ));
    } else {
      const newAttr: Attribute = {
        id: String(attributes.length + 1),
        ...formData,
        maxLength: formData.maxLength ? parseInt(formData.maxLength) : undefined,
      };
      setAttributes([...attributes, newAttr]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      dataType: 'string',
      maxLength: '',
      required: false,
      unique: false,
      defaultValue: '',
    });
    setEditingAttr(null);
    setShowAddForm(false);
  };

  const handleEdit = (attr: Attribute) => {
    setEditingAttr(attr);
    setFormData({
      name: attr.name,
      dataType: attr.dataType,
      maxLength: attr.maxLength?.toString() || '',
      required: attr.required,
      unique: attr.unique,
      defaultValue: attr.defaultValue || '',
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thuộc tính này?')) {
      setAttributes(attributes.filter(attr => attr.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Quản lý thuộc tính dữ liệu chủ</h2>
              <p className="text-sm text-slate-500">{entityName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Add Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Thêm thuộc tính mới
            </button>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
              <h3 className="text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                {editingAttr ? 'Chỉnh sửa thuộc tính' : 'Thêm thuộc tính mới'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Tên trường <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: CCCD, Họ tên..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Kiểu dữ liệu <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.dataType}
                    onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="string">Chuỗi (String)</option>
                    <option value="number">Số (Number)</option>
                    <option value="date">Ngày tháng (Date)</option>
                    <option value="boolean">Đúng/Sai (Boolean)</option>
                    <option value="email">Email</option>
                    <option value="phone">Số điện thoại</option>
                    <option value="url">URL</option>
                  </select>
                </div>

                {(formData.dataType === 'string' || formData.dataType === 'email' || formData.dataType === 'phone') && (
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Độ dài tối đa</label>
                    <input
                      type="number"
                      value={formData.maxLength}
                      onChange={(e) => setFormData({ ...formData, maxLength: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: 255"
                      min="1"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Giá trị mặc định</label>
                  <input
                    type="text"
                    value={formData.defaultValue}
                    onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tùy chọn"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.required}
                    onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Bắt buộc</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.unique}
                    onChange={(e) => setFormData({ ...formData, unique: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Duy nhất (Unique)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingAttr ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          )}

          {/* Attributes Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">STT</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">TÊN TRƯỜNG</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">KIỂU DỮ LIỆU</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">ĐỘ DÀI</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">RÀNG BUỘC</th>
                  <th className="px-4 py-3 text-right text-xs text-slate-600">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {attributes.map((attr, index) => (
                  <tr key={attr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-slate-900 font-medium">{attr.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{attr.dataType}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{attr.maxLength || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {attr.required && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">Bắt buộc</span>
                        )}
                        {attr.unique && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Duy nhất</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(attr)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Sửa"
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(attr.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {attributes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      Chưa có thuộc tính nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex justify-between bg-slate-50">
          <div className="text-sm text-slate-600">
            Tổng số thuộc tính: <span className="font-medium text-slate-900">{attributes.length}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
