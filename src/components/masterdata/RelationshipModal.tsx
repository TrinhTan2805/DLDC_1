import { useState } from 'react';
import { X, Plus, Link2, Save, Trash2 } from 'lucide-react';

interface Relationship {
  id: string;
  name: string;
  sourceEntity: string;
  targetEntity: string;
  relationType: '1-1' | '1-n' | 'n-n';
  foreignKey?: string;
  junctionTable?: string;
}

interface RelationshipModalProps {
  onClose: () => void;
}

export function RelationshipModal({ onClose }: RelationshipModalProps) {
  const [relationships, setRelationships] = useState<Relationship[]>([
    { 
      id: '1', 
      name: 'Người - Tổ chức', 
      sourceEntity: 'MD_PERSON', 
      targetEntity: 'MD_ORGANIZATION',
      relationType: 'n-n',
      junctionTable: 'person_organization'
    },
    { 
      id: '2', 
      name: 'Người - Địa điểm', 
      sourceEntity: 'MD_PERSON', 
      targetEntity: 'MD_LOCATION',
      relationType: '1-1',
      foreignKey: 'location_id'
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sourceEntity: '',
    targetEntity: '',
    relationType: '1-n' as const,
    foreignKey: '',
    junctionTable: '',
  });

  const entities = [
    { code: 'MD_PERSON', name: 'Công dân' },
    { code: 'MD_ORGANIZATION', name: 'Tổ chức' },
    { code: 'MD_LOCATION', name: 'Địa điểm' },
    { code: 'MD_ASSET', name: 'Tài sản' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRelationship: Relationship = {
      id: String(relationships.length + 1),
      name: formData.name,
      sourceEntity: formData.sourceEntity,
      targetEntity: formData.targetEntity,
      relationType: formData.relationType,
      foreignKey: formData.relationType === 'n-n' ? undefined : formData.foreignKey,
      junctionTable: formData.relationType === 'n-n' ? formData.junctionTable : undefined,
    };
    
    setRelationships([...relationships, newRelationship]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sourceEntity: '',
      targetEntity: '',
      relationType: '1-n',
      foreignKey: '',
      junctionTable: '',
    });
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa quan hệ này?')) {
      setRelationships(relationships.filter(rel => rel.id !== id));
    }
  };

  const relationTypeLabels = {
    '1-1': 'Một - Một (1:1)',
    '1-n': 'Một - Nhiều (1:n)',
    'n-n': 'Nhiều - Nhiều (n:n)',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Link2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Thiết lập quan hệ giữa thực thể</h2>
              <p className="text-sm text-slate-500">Định nghĩa mối quan hệ giữa các dữ liệu chủ</p>
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
          {/* Info */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="text-indigo-900 mb-2">Loại quan hệ</h3>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>• <strong>1:1:</strong> Mỗi bản ghi trong A liên kết với duy nhất 1 bản ghi trong B</li>
              <li>• <strong>1:n:</strong> Mỗi bản ghi trong A có thể liên kết với nhiều bản ghi trong B</li>
              <li>• <strong>n:n:</strong> Nhiều bản ghi trong A liên kết với nhiều bản ghi trong B (cần bảng trung gian)</li>
            </ul>
          </div>

          {/* Add Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Thêm quan hệ mới
            </button>
          )}

          {/* Add Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-4">
              <h3 className="text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Thêm quan hệ mới
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-slate-700 mb-2">
                    Tên quan hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="VD: Người - Tổ chức"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Thực thể nguồn <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.sourceEntity}
                    onChange={(e) => setFormData({ ...formData, sourceEntity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="" disabled hidden>-- Chọn thực thể --</option>
                    {entities.map(entity => (
                      <option key={entity.code} value={entity.code}>
                        {entity.name} ({entity.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Thực thể đích <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.targetEntity}
                    onChange={(e) => setFormData({ ...formData, targetEntity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="" disabled hidden>-- Chọn thực thể --</option>
                    {entities.map(entity => (
                      <option key={entity.code} value={entity.code}>
                        {entity.name} ({entity.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-slate-700 mb-2">
                    Loại quan hệ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.relationType}
                    onChange={(e) => setFormData({ ...formData, relationType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="1-1">Một - Một (1:1)</option>
                    <option value="1-n">Một - Nhiều (1:n)</option>
                    <option value="n-n">Nhiều - Nhiều (n:n)</option>
                  </select>
                </div>

                {formData.relationType !== 'n-n' && (
                  <div className="col-span-2">
                    <label className="block text-sm text-slate-700 mb-2">
                      Khóa ngoại (Foreign Key) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.foreignKey}
                      onChange={(e) => setFormData({ ...formData, foreignKey: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="VD: location_id, organization_id"
                      required
                    />
                  </div>
                )}

                {formData.relationType === 'n-n' && (
                  <div className="col-span-2">
                    <label className="block text-sm text-slate-700 mb-2">
                      Bảng liên kết (Junction Table) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.junctionTable}
                      onChange={(e) => setFormData({ ...formData, junctionTable: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="VD: person_organization"
                      required
                    />
                  </div>
                )}
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Thêm quan hệ
                </button>
              </div>
            </form>
          )}

          {/* Relationships Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">STT</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">TÊN QUAN HỆ</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">THỰC THỂ NGUỒN</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">THỰC THỂ ĐÍCH</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">LOẠI QUAN HỆ</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">CHI TIẾT</th>
                  <th className="px-4 py-3 text-right text-xs text-slate-600">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {relationships.map((rel, index) => (
                  <tr key={rel.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-slate-900 font-medium">{rel.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{rel.sourceEntity}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{rel.targetEntity}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                        {relationTypeLabels[rel.relationType]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 font-mono text-xs">
                      {rel.foreignKey || rel.junctionTable || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(rel.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {relationships.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      Chưa có quan hệ nào được thiết lập
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex justify-end bg-slate-50">
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
