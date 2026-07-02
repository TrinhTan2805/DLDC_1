import { useState } from 'react';
import { Plus, Edit, Trash2, X, Save, Network, ArrowRight, Key, Table, Link as LinkIcon } from 'lucide-react';

type RelationType = 'one-to-many' | 'many-to-many' | 'one-to-one';
type RelationStatus = 'active' | 'inactive';

interface EntityRelationship {
  id: string;
  sourceEntityId: string;
  sourceEntityName: string;
  targetEntityId: string;
  targetEntityName: string;
  relationType: RelationType;
  foreignKey?: string;
  referencedKey?: string;
  junctionTable?: string;
  junctionSourceKey?: string;
  junctionTargetKey?: string;
  description?: string;
  status: RelationStatus;
  createdDate: string;
}

const mockRelationships: EntityRelationship[] = [
  {
    id: 'rel-1',
    sourceEntityId: '1',
    sourceEntityName: 'Bộ dữ liệu chủ Công dân',
    targetEntityId: '2',
    targetEntityName: 'Bộ dữ liệu chủ Tổ chức',
    relationType: 'many-to-many',
    junctionTable: 'citizen_organization_mapping',
    junctionSourceKey: 'citizen_id',
    junctionTargetKey: 'organization_id',
    description: 'Quan hệ giữa công dân và tổ chức (chức vụ, công việc)',
    status: 'active',
    createdDate: '15/12/2024'
  },
  {
    id: 'rel-2',
    sourceEntityId: '3',
    sourceEntityName: 'Bộ dữ liệu chủ Văn bản pháp luật',
    targetEntityId: '4',
    targetEntityName: 'Bộ dữ liệu chủ Cơ quan ban hành',
    relationType: 'one-to-many',
    foreignKey: 'issuing_authority_id',
    referencedKey: 'authority_id',
    description: 'Một cơ quan có thể ban hành nhiều văn bản',
    status: 'active',
    createdDate: '18/12/2024'
  }
];

const mockEntities = [
  { id: '1', code: 'MD-CITIZEN-001', name: 'Bộ dữ liệu chủ Công dân' },
  { id: '2', code: 'MD-ORG-001', name: 'Bộ dữ liệu chủ Tổ chức' },
  { id: '3', code: 'MD-DOC-001', name: 'Bộ dữ liệu chủ Văn bản pháp luật' },
  { id: '4', code: 'MD-AUTH-001', name: 'Bộ dữ liệu chủ Cơ quan ban hành' },
  { id: '5', code: 'MD-ADDR-001', name: 'Bộ dữ liệu chủ Địa chỉ' }
];

const relationTypeLabels: Record<RelationType, string> = {
  'one-to-many': '1 - n (Một - Nhiều)',
  'many-to-many': 'n - n (Nhiều - Nhiều)',
  'one-to-one': '1 - 1 (Một - Một)'
};

const relationTypeIcons: Record<RelationType, string> = {
  'one-to-many': '1 → n',
  'many-to-many': 'n ↔ n',
  'one-to-one': '1 ↔ 1'
};

export function EntityRelationshipsTab() {
  const [relationships, setRelationships] = useState<EntityRelationship[]>(mockRelationships);
  const [showForm, setShowForm] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<EntityRelationship | null>(null);

  const [formData, setFormData] = useState<Partial<EntityRelationship>>({
    sourceEntityId: '',
    targetEntityId: '',
    relationType: 'many-to-many',
    foreignKey: '',
    referencedKey: '',
    junctionTable: '',
    junctionSourceKey: '',
    junctionTargetKey: '',
    description: '',
    status: 'active'
  });

  const handleSubmit = () => {
    if (!formData.sourceEntityId || !formData.targetEntityId) {
      alert('Vui lòng chọn đầy đủ thực thể nguồn và thực thể đích');
      return;
    }

    if (formData.sourceEntityId === formData.targetEntityId) {
      alert('Thực thể nguồn và thực thể đích phải khác nhau');
      return;
    }

    // Validate based on relation type
    if (formData.relationType === 'many-to-many') {
      if (!formData.junctionTable || !formData.junctionSourceKey || !formData.junctionTargetKey) {
        alert('Quan hệ n-n cần có đầy đủ: Bảng liên kết, Khóa nguồn, Khóa đích');
        return;
      }
    } else {
      if (!formData.foreignKey || !formData.referencedKey) {
        alert('Quan hệ 1-n hoặc 1-1 cần có đầy đủ: Khóa ngoại, Khóa tham chiếu');
        return;
      }
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    const sourceEntity = mockEntities.find(e => e.id === formData.sourceEntityId);
    const targetEntity = mockEntities.find(e => e.id === formData.targetEntityId);

    if (editingRelationship) {
      const updatedRelationships = relationships.map(rel =>
        rel.id === editingRelationship.id
          ? {
              ...rel,
              ...formData,
              sourceEntityName: sourceEntity?.name || '',
              targetEntityName: targetEntity?.name || ''
            }
          : rel
      );
      setRelationships(updatedRelationships);
    } else {
      const newRelationship: EntityRelationship = {
        id: `rel-${Date.now()}`,
        sourceEntityId: formData.sourceEntityId!,
        sourceEntityName: sourceEntity?.name || '',
        targetEntityId: formData.targetEntityId!,
        targetEntityName: targetEntity?.name || '',
        relationType: formData.relationType!,
        foreignKey: formData.foreignKey,
        referencedKey: formData.referencedKey,
        junctionTable: formData.junctionTable,
        junctionSourceKey: formData.junctionSourceKey,
        junctionTargetKey: formData.junctionTargetKey,
        description: formData.description,
        status: formData.status!,
        createdDate: dateStr
      };
      setRelationships([...relationships, newRelationship]);
    }

    handleCloseForm();
  };

  const handleEdit = (relationship: EntityRelationship) => {
    setEditingRelationship(relationship);
    setFormData(relationship);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa quan hệ này?')) {
      setRelationships(relationships.filter(rel => rel.id !== id));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRelationship(null);
    setFormData({
      sourceEntityId: '',
      targetEntityId: '',
      relationType: 'many-to-many',
      foreignKey: '',
      referencedKey: '',
      junctionTable: '',
      junctionSourceKey: '',
      junctionTargetKey: '',
      description: '',
      status: 'active'
    });
  };

  const getStatusBadge = (status: RelationStatus) => {
    return status === 'active'
      ? { label: 'Hoạt động', className: 'bg-green-100 text-green-700' }
      : { label: 'Không hoạt động', className: 'bg-slate-100 text-slate-700' };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Thiết lập quan hệ giữa thực thể</h2>
          <p className="text-sm text-slate-600 mt-1">
            Quản trị hệ thống chọn 2 thực thể và định nghĩa liên kết giữa chúng (1-n, n-n)
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm quan hệ mới
        </button>
      </div>

      {/* Relationships Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Thực thể nguồn</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Loại quan hệ</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Thực thể đích</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Điều kiện liên kết</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Trạng thái</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {relationships.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <Network className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">
                      Nội dung chức năng Thiết lập quan hệ giữa thực thể
                    </p>
                  </td>
                </tr>
              ) : (
                relationships.map((relationship) => {
                  const statusBadge = getStatusBadge(relationship.status);
                  return (
                    <tr key={relationship.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-[13px] text-slate-900">{relationship.sourceEntityName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-1">
                          <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                            {relationTypeIcons[relationship.relationType]}
                          </span>
                          <span className="text-xs text-slate-500">
                            {relationTypeLabels[relationship.relationType]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-[13px] text-slate-900">{relationship.targetEntityName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {relationship.relationType === 'many-to-many' ? (
                          <div className="text-xs">
                            <div className="flex items-center gap-1 text-purple-600">
                              <Table className="w-3 h-3" />
                              <span>Bảng: <code className="bg-purple-50 px-1 py-0.5 rounded">{relationship.junctionTable}</code></span>
                            </div>
                            <div className="text-slate-500 mt-1">
                              {relationship.junctionSourceKey} ↔ {relationship.junctionTargetKey}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs">
                            <div className="flex items-center gap-1 text-blue-600">
                              <Key className="w-3 h-3" />
                              <span>FK: <code className="bg-blue-50 px-1 py-0.5 rounded">{relationship.foreignKey}</code></span>
                            </div>
                            <div className="text-slate-500 mt-1">
                              → {relationship.referencedKey}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[12px] ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(relationship)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(relationship.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg text-slate-900">
                {editingRelationship ? 'Chỉnh sửa quan hệ thực thể' : 'Thêm quan hệ thực thể mới'}
              </h3>
              <button onClick={handleCloseForm} className="p-1 hover:bg-slate-100 rounded" title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Entity Selection */}
              <div className="space-y-4">
                <h4 className="text-sm text-slate-900">Chọn thực thể liên kết</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">
                      Thực thể nguồn <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.sourceEntityId}
                      onChange={(e) => setFormData({ ...formData, sourceEntityId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Chọn thực thể nguồn --</option>
                      {mockEntities.map(entity => (
                        <option key={entity.id} value={entity.id}>
                          {entity.code} - {entity.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-1">
                      Thực thể đích <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.targetEntityId}
                      onChange={(e) => setFormData({ ...formData, targetEntityId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Chọn thực thể đích --</option>
                      {mockEntities
                        .filter(entity => entity.id !== formData.sourceEntityId)
                        .map(entity => (
                          <option key={entity.id} value={entity.id}>
                            {entity.code} - {entity.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Visual Representation */}
                {formData.sourceEntityId && formData.targetEntityId && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-slate-900">
                          {mockEntities.find(e => e.id === formData.sourceEntityId)?.name}
                        </span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-slate-900">
                          {mockEntities.find(e => e.id === formData.targetEntityId)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Relation Type */}
              <div className="space-y-4 border-t border-slate-200 pt-6">
                <h4 className="text-sm text-slate-900">Loại quan hệ</h4>
                
                <div>
                  <label className="block text-sm text-slate-700 mb-1">
                    Chọn loại quan hệ <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.relationType}
                    onChange={(e) => setFormData({ ...formData, relationType: e.target.value as RelationType })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(relationTypeLabels)
                      .filter(([value]) => value !== 'one-to-many')
                      .map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    {formData.relationType === 'one-to-many' && (
                      <>
                        <strong>1 - n:</strong> Một bản ghi trong thực thể nguồn có thể liên kết với nhiều bản ghi trong thực thể đích.
                        <br />
                        <em>VD: Một cơ quan ban hành nhiều văn bản</em>
                      </>
                    )}
                    {formData.relationType === 'many-to-many' && (
                      <>
                        <strong>n - n:</strong> Nhiều bản ghi trong thực thể nguồn có thể liên kết với nhiều bản ghi trong thực thể đích.
                        <br />
                        <em>VD: Một công dân làm việc tại nhiều tổ chức, một tổ chức có nhiều công dân</em>
                      </>
                    )}
                    {formData.relationType === 'one-to-one' && (
                      <>
                        <strong>1 - 1:</strong> Một bản ghi trong thực thể nguồn chỉ liên kết với một bản ghi duy nhất trong thực thể đích.
                        <br />
                        <em>VD: Một công dân có một CCCD duy nhất</em>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Link Conditions */}
              <div className="space-y-4 border-t border-slate-200 pt-6">
                <h4 className="text-sm text-slate-900">Điều kiện liên kết</h4>

                {formData.relationType === 'many-to-many' ? (
                  // Many-to-Many: Junction Table
                  <div className="space-y-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Table className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-purple-900">Cấu hình bảng liên kết (Junction Table)</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-slate-700 mb-1">
                            Tên bảng liên kết <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.junctionTable}
                            onChange={(e) => setFormData({ ...formData, junctionTable: e.target.value })}
                            placeholder="VD: citizen_organization_mapping"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-slate-700 mb-1">
                              Khóa nguồn trong bảng liên kết <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.junctionSourceKey}
                              onChange={(e) => setFormData({ ...formData, junctionSourceKey: e.target.value })}
                              placeholder="VD: citizen_id"
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-700 mb-1">
                              Khóa đích trong bảng liên kết <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.junctionTargetKey}
                              onChange={(e) => setFormData({ ...formData, junctionTargetKey: e.target.value })}
                              placeholder="VD: organization_id"
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // One-to-Many or One-to-One: Foreign Key
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Key className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-900">Cấu hình khóa ngoại (Foreign Key)</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-700 mb-1">
                            Khóa ngoại (Foreign Key) <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={formData.foreignKey}
                            onChange={(e) => setFormData({ ...formData, foreignKey: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">-- Chọn trường --</option>
                            <option value="id">id</option>
                            <option value="citizen_id">citizen_id</option>
                            <option value="organization_id">organization_id</option>
                            <option value="document_id">document_id</option>
                            <option value="issuing_authority_id">issuing_authority_id</option>
                            <option value="parent_organization_id">parent_organization_id</option>
                            <option value="author_id">author_id</option>
                            <option value="created_by">created_by</option>
                            <option value="modified_by">modified_by</option>
                          </select>
                          <p className="text-xs text-slate-500 mt-1">Trường trong thực thể nguồn</p>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-700 mb-1">
                            Khóa tham chiếu (Referenced Key) <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={formData.referencedKey}
                            onChange={(e) => setFormData({ ...formData, referencedKey: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">-- Chọn trường --</option>
                            <option value="id">id</option>
                            <option value="citizen_id">citizen_id</option>
                            <option value="organization_id">organization_id</option>
                            <option value="authority_id">authority_id</option>
                            <option value="document_id">document_id</option>
                            <option value="unit_id">unit_id</option>
                            <option value="code">code</option>
                            <option value="primary_key">primary_key</option>
                          </select>
                          <p className="text-xs text-slate-500 mt-1">Trường trong thực thể đích</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-slate-700 mb-1">
                    Mô tả quan hệ
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="VD: Quan hệ giữa văn bản pháp luật và cơ quan ban hành"
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 sticky bottom-0">
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingRelationship ? 'Cập nhật' : 'Lưu quan hệ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}