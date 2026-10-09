import { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Key,
  Link,
  Save,
  Send,
  ChevronRight,
  Database
} from 'lucide-react';

interface Field {
  id: string;
  name: string;
  dataType: string;
  length: string;
  defaultValue: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  foreignKeyRef?: string;
  nullable: boolean;
  description: string;
}

export function SetupCategoryStructure() {
  const [selectedCategory, setSelectedCategory] = useState('DM_DVHC');
  const [fields, setFields] = useState<Field[]>([
    {
      id: '1',
      name: 'ma_dvhc',
      dataType: 'VARCHAR',
      length: '20',
      defaultValue: '',
      isPrimaryKey: true,
      isForeignKey: false,
      nullable: false,
      description: 'Mã đơn vị hành chính'
    },
    {
      id: '2',
      name: 'ten_dvhc',
      dataType: 'NVARCHAR',
      length: '200',
      defaultValue: '',
      isPrimaryKey: false,
      isForeignKey: false,
      nullable: false,
      description: 'Tên đơn vị hành chính'
    },
  ]);

  const [showAddField, setShowAddField] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [structureStatus, setStructureStatus] = useState<'draft' | 'pending' | 'approved'>('draft');

  const [newField, setNewField] = useState<Field>({
    id: '',
    name: '',
    dataType: 'VARCHAR',
    length: '',
    defaultValue: '',
    isPrimaryKey: false,
    isForeignKey: false,
    nullable: true,
    description: ''
  });

  const categories = [
    { code: 'DM_DVHC', name: 'Danh mục đơn vị hành chính', status: 'approved' },
    { code: 'DM_LOAI_VB', name: 'Danh mục loại văn bản', status: 'approved' },
    { code: 'DM_LINH_VUC', name: 'Danh mục lĩnh vực', status: 'draft' },
  ];

  const dataTypes = [
    'VARCHAR', 'NVARCHAR', 'INT', 'BIGINT', 'DECIMAL',
    'DATE', 'DATETIME', 'BOOLEAN', 'TEXT', 'JSON'
  ];

  const handleAddField = () => {
    // Validate
    if (!newField.name || !newField.dataType) {
      alert('Vui lòng nhập tên trường và kiểu dữ liệu');
      return;
    }

    // Check duplicate name
    if (fields.some(f => f.name === newField.name)) {
      alert('Tên trường đã tồn tại');
      return;
    }

    // Check primary key constraint
    if (newField.isPrimaryKey && fields.some(f => f.isPrimaryKey)) {
      alert('Đã có khóa chính. Vui lòng bỏ khóa chính hiện tại trước khi thêm khóa mới');
      return;
    }

    const fieldToAdd = {
      ...newField,
      id: String(fields.length + 1),
    };

    setFields([...fields, fieldToAdd]);
    setNewField({
      id: '',
      name: '',
      dataType: 'VARCHAR',
      length: '',
      defaultValue: '',
      isPrimaryKey: false,
      isForeignKey: false,
      nullable: true,
      description: ''
    });
    setShowAddField(false);
  };

  const handleUpdateField = () => {
    if (!editingField) return;

    setFields(fields.map(f => f.id === editingField.id ? editingField : f));
    setEditingField(null);
  };

  const handleDeleteField = (id: string) => {
    const field = fields.find(f => f.id === id);
    if (field?.isPrimaryKey) {
      if (!confirm('Bạn đang xóa khóa chính. Bạn có chắc chắn?')) {
        return;
      }
    }
    setFields(fields.filter(f => f.id !== id));
  };

  const handleSaveDraft = () => {
    setStructureStatus('draft');
    alert('Đã lưu cấu trúc dạng nháp');
  };

  const handleSendApproval = () => {
    if (fields.length === 0) {
      alert('Vui lòng thêm ít nhất một trường dữ liệu');
      return;
    }

    if (!fields.some(f => f.isPrimaryKey)) {
      alert('Vui lòng xác định khóa chính cho danh mục');
      return;
    }

    setStructureStatus('pending');
    alert('Đã gửi yêu cầu phê duyệt cấu trúc danh mục');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-slate-900">Thiết lập cấu trúc danh mục</h2>
          <p className="text-sm text-slate-600 mt-1">
            Định nghĩa các trường dữ liệu, kiểu dữ liệu, khóa chính và khóa ngoại
          </p>
        </div>
        <div className="flex items-center gap-2">
          {structureStatus === 'draft' && (
            <>
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Save className="w-5 h-5" />
                Lưu
              </button>
              <button
                onClick={handleSendApproval}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-5 h-5" />
                Gửi phê duyệt
              </button>
            </>
          )}
          {structureStatus === 'pending' && (
            <span className="px-4 py-2.5 bg-yellow-100 text-yellow-700 rounded-lg">
              Đang chờ phê duyệt cấu trúc
            </span>
          )}
          {structureStatus === 'approved' && (
            <span className="px-4 py-2.5 bg-green-100 text-green-700 rounded-lg">
              Cấu trúc đã được phê duyệt
            </span>
          )}
        </div>
      </div>

      {/* Category Selection */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <label className="block text-sm text-slate-700 mb-2">
          Chọn danh mục cần thiết lập cấu trúc
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full max-w-md px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(cat => (
            <option key={cat.code} value={cat.code}>
              {cat.name} ({cat.code})
            </option>
          ))}
        </select>
      </div>

      {/* Fields List */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="text-slate-900">Danh sách trường dữ liệu</h3>
            <span className="text-sm text-slate-500">({fields.length} trường)</span>
          </div>
          <button
            onClick={() => setShowAddField(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:!bg-[#F1F5F9] disabled:!text-[#94A3B8] disabled:!border-[#E2E8F0] disabled:!shadow-none disabled:cursor-not-allowed"
            disabled={structureStatus !== 'draft'}
          >
            <Plus className="w-4 h-4" />
            Thêm trường
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Tên trường</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Kiểu dữ liệu</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Độ dài</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Giá trị mặc định</th>
                <th className="px-4 py-3 text-center text-xs text-slate-600">Khóa chính</th>
                <th className="px-4 py-3 text-center text-xs text-slate-600">Khóa ngoại</th>
                <th className="px-4 py-3 text-center text-xs text-slate-600">Nullable</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Mô tả</th>
                <th className="px-4 py-3 text-right text-xs text-slate-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {fields.map((field) => (
                <tr key={field.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-900 font-mono">{field.name}</span>
                      {field.isPrimaryKey && (
                        <Key className="w-4 h-4 text-amber-600" title="Khóa chính" />
                      )}
                      {field.isForeignKey && (
                        <Link className="w-4 h-4 text-blue-600" title="Khóa ngoại" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 font-mono">{field.dataType}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{field.length || '-'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{field.defaultValue || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    {field.isPrimaryKey && (
                      <span className="inline-block w-2 h-2 bg-amber-600 rounded-full"></span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {field.isForeignKey && (
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {field.nullable && (
                      <span className="inline-block w-2 h-2 bg-slate-400 rounded-full"></span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{field.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingField(field)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:!bg-[#F1F5F9] disabled:!text-[#94A3B8] disabled:!border-[#E2E8F0] disabled:!shadow-none disabled:cursor-not-allowed"
                        disabled={structureStatus !== 'draft'}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteField(field.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:!bg-[#F1F5F9] disabled:!text-[#94A3B8] disabled:!border-[#E2E8F0] disabled:!shadow-none disabled:cursor-not-allowed"
                        disabled={structureStatus !== 'draft'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {fields.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    Chưa có trường dữ liệu nào. Nhấn "Thêm trường" để bắt đầu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Field Modal */}
      {showAddField && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg text-slate-900">Thêm trường dữ liệu mới</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">
                    Tên trường <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newField.name}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="VD: ma_dvhc"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">
                    Kiểu dữ liệu <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newField.dataType}
                    onChange={(e) => setNewField({ ...newField, dataType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {dataTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">
                    Độ dài
                  </label>
                  <input
                    type="text"
                    value={newField.length}
                    onChange={(e) => setNewField({ ...newField, length: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 200"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">
                    Giá trị mặc định
                  </label>
                  <input
                    type="text"
                    value={newField.defaultValue}
                    onChange={(e) => setNewField({ ...newField, defaultValue: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Giá trị mặc định"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Mô tả
                </label>
                <input
                  type="text"
                  value={newField.description}
                  onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả ý nghĩa của trường"
                />
              </div>

              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newField.isPrimaryKey}
                    onChange={(e) => setNewField({ ...newField, isPrimaryKey: e.target.checked, nullable: !e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <Key className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-slate-700">Khóa chính</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newField.isForeignKey}
                    onChange={(e) => setNewField({ ...newField, isForeignKey: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <Link className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-slate-700">Khóa ngoại</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newField.nullable}
                    onChange={(e) => setNewField({ ...newField, nullable: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                    disabled={newField.isPrimaryKey}
                  />
                  <span className="text-sm text-slate-700">Cho phép NULL</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleAddField}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Thêm trường
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddField(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Field Modal */}
      {editingField && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg text-slate-900">Chỉnh sửa trường dữ liệu</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">
                    Tên trường
                  </label>
                  <input
                    type="text"
                    value={editingField.name}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-[#F0F0F0] font-mono"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">
                    Kiểu dữ liệu
                  </label>
                  <select
                    value={editingField.dataType}
                    onChange={(e) => setEditingField({ ...editingField, dataType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {dataTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">
                    Độ dài
                  </label>
                  <input
                    type="text"
                    value={editingField.length}
                    onChange={(e) => setEditingField({ ...editingField, length: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">
                    Giá trị mặc định
                  </label>
                  <input
                    type="text"
                    value={editingField.defaultValue}
                    onChange={(e) => setEditingField({ ...editingField, defaultValue: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Mô tả
                </label>
                <input
                  type="text"
                  value={editingField.description}
                  onChange={(e) => setEditingField({ ...editingField, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingField.isPrimaryKey}
                    onChange={(e) => setEditingField({ ...editingField, isPrimaryKey: e.target.checked, nullable: !e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <Key className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-slate-700">Khóa chính</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingField.isForeignKey}
                    onChange={(e) => setEditingField({ ...editingField, isForeignKey: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <Link className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-slate-700">Khóa ngoại</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingField.nullable}
                    onChange={(e) => setEditingField({ ...editingField, nullable: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                    disabled={editingField.isPrimaryKey}
                  />
                  <span className="text-sm text-slate-700">Cho phép NULL</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleUpdateField}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  onClick={() => setEditingField(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
