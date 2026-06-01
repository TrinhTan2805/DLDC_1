import React, { useState, useRef, useEffect, ReactNode, ChangeEvent, MouseEvent } from 'react';
import { Plus, Edit, Trash2, X, Save, Network, ArrowRight, Key, Table, Search, AlertCircle, Info, ChevronDown, Send } from 'lucide-react';
import { MasterDataEntity, EntityRelationship, RelationshipType, RelationshipStatus } from '../../categoryTypes';
import { ConfirmModal } from '../../../../common/ConfirmModal';
import { ApprovalRequestModal } from '../modals/ApprovalRequestModal';
import { approvers } from '../../categoryConstants';

interface RelationshipsTabProps {
  entities: MasterDataEntity[];
  relationships: EntityRelationship[];
  setRelationships: (relationships: EntityRelationship[]) => void;
  isViewOnly?: boolean;
}

const relationTypeLabels: Record<RelationshipType, string> = {
  '1-n': '1 - n (Một - Nhiều)',
  'n-1': 'n - 1 (Nhiều - Một)',
  'n-n': 'n - n (Nhiều - Nhiều)',
  '1-1': '1 - 1 (Một - Một)'
};

const relationTypeIcons: Record<RelationshipType, string> = {
  '1-n': '1 → n',
  'n-1': 'n ← 1',
  'n-n': 'n ↔ n',
  '1-1': '1 ↔ 1'
};

// --- Mock Data & Helpers ---

// Mock base fields every entity has
const BASE_MOCK_FIELDS = [
  { id: 'f1', name: 'id', displayName: 'ID định danh', type: 'string' },
  { id: 'f2', name: 'code', displayName: 'Mã danh mục', type: 'string' },
  { id: 'f3', name: 'name', displayName: 'Tên/Tiêu đề', type: 'string' },
  { id: 'f4', name: 'status', displayName: 'Trạng thái', type: 'string' },
  { id: 'f5', name: 'created_date', displayName: 'Ngày tạo', type: 'date' },
];

export function RelationshipsTab({
  entities,
  relationships,
  setRelationships,
  isViewOnly = false
}: RelationshipsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<EntityRelationship | null>(null);

  // Modal logic cho Trình duyệt
  const [genericConfirm, setGenericConfirm] = useState<{
    isOpen: boolean;
    type: 'success' | 'info' | 'warning' | 'delete';
    title: string;
    subtitle: string;
    message: ReactNode;
    confirmText: string;
    onConfirm: () => void;
  } | null>(null);

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalRequestData, setApprovalRequestData] = useState<{ id: string; code: string; name: string; type: 'attribute' | 'category' } | null>(null);
  const [approvalRequestForm, setApprovalRequestForm] = useState({ reviewer: '', note: '' });

  const [formData, setFormData] = useState<Partial<EntityRelationship>>({
    sourceEntityId: '',
    targetEntityId: '',
    relationshipType: '1-n',
    sourceKey: '',
    targetKey: '',
    targetDisplayField: '',
    mappingTable: '',
    status: 'active'
  });

  // Derived state for dropdowns
  const getEntityAttributes = (entityId?: string) => {
    if (!entityId) return [];
    const entity = entities.find(e => e.id === entityId);
    let attrs = [...BASE_MOCK_FIELDS];
    if (entity) {
      if (entity.code.includes('CITIZEN')) {
        attrs.push({ id: 'c1', name: 'citizen_id', displayName: 'Số CCCD', type: 'string' });
        attrs.push({ id: 'c2', name: 'issue_authority_id', displayName: 'Mã cơ quan cấp', type: 'string' });
      } else if (entity.code.includes('ORG') || entity.code.includes('AUTHORITY')) {
        attrs.push({ id: 'o1', name: 'tax_code', displayName: 'Mã số thuế', type: 'string' });
        attrs.push({ id: 'o2', name: 'authority_id', displayName: 'Mã cơ quan', type: 'string' });
        attrs.push({ id: 'o3', name: 'authority_name', displayName: 'Tên cơ quan', type: 'string' });
      }
    }
    // Set field specific to relation
    attrs.push({ id: `fk_to_${entityId}`, name: `${entity?.code.toLowerCase()}_ref_id`, displayName: `Mã tham chiếu ${entity?.name}`, type: 'string' });
    return attrs;
  };

  const sourceAttributes = getEntityAttributes(formData.sourceEntityId);
  const targetAttributes = getEntityAttributes(formData.targetEntityId);

  // Helper: Detect Cycle
  const createsCycle = (newSourceId: string, newTargetId: string, ignoreRelId?: string) => {
    // We only care about 1-1, 1-n, n-1 direction. Treat n-n as undirected or bidirectional.
    // For simplicity, let's just make sure there's no directed path from target to source.
    const adj: Record<string, string[]> = {};
    relationships.forEach(rel => {
      if (rel.id === ignoreRelId) return; // Skip the one being edited
      
      const src = rel.sourceEntityId;
      const tgt = rel.targetEntityId;
      if (!adj[src]) adj[src] = [];
      adj[src].push(tgt);
      
      // If n-n or 1-1, it could imply bidirectional dependency
      if (rel.relationshipType === 'n-n' || rel.relationshipType === '1-1') {
        if (!adj[tgt]) adj[tgt] = [];
        adj[tgt].push(src);
      }
    });

    if (!adj[newSourceId]) adj[newSourceId] = [];
    adj[newSourceId].push(newTargetId);
    if (formData.relationshipType === 'n-n' || formData.relationshipType === '1-1') {
       if (!adj[newTargetId]) adj[newTargetId] = [];
       adj[newTargetId].push(newSourceId);
    }

    // DFS to find cycle
    const visited: Record<string, boolean> = {};
    const recStack: Record<string, boolean> = {};

    const dfs = (node: string) => {
      if (!visited[node]) {
        visited[node] = true;
        recStack[node] = true;
        const neighbors = adj[node] || [];
        for (let i = 0; i < neighbors.length; i++) {
          const nextNode = neighbors[i];
          if (!visited[nextNode] && dfs(nextNode)) return true;
          else if (recStack[nextNode]) return true;
        }
      }
      recStack[node] = false;
      return false;
    };

    for (const node in adj) {
      if (dfs(node)) return true;
    }
    return false;
  };

  const existingRelationsBetween = relationships.filter(r => 
    r.id !== editingRelationship?.id &&
    ((r.sourceEntityId === formData.sourceEntityId && r.targetEntityId === formData.targetEntityId) ||
     (r.sourceEntityId === formData.targetEntityId && r.targetEntityId === formData.sourceEntityId))
  );

  const handleSubmit = () => {
    if (!formData.sourceEntityId || !formData.targetEntityId) {
      alert('Vui lòng chọn đầy đủ thực thể nguồn và thực thể đích');
      return;
    }

    if (formData.sourceEntityId === formData.targetEntityId) {
      alert('Thực thể nguồn và thực thể đích phải khác nhau');
      return;
    }

    if (formData.relationshipType === 'n-n') {
      if (!formData.mappingTable || !formData.sourceKey || !formData.targetKey) {
        alert('Quan hệ n-n cần có đầy đủ: Bảng liên kết, Khóa nguồn, Khóa đích');
        return;
      }
    } else {
      if (!formData.sourceKey || !formData.targetKey) {
        alert('Cần khai báo đầy đủ: Khóa nguồn và Khóa đích');
        return;
      }
    }

    // Validation: Check duplicate relation types
    const hasDuplicateType = existingRelationsBetween.some(r => 
      r.sourceEntityId === formData.sourceEntityId && 
      r.targetEntityId === formData.targetEntityId &&
      r.relationshipType === formData.relationshipType
    );
    if (hasDuplicateType) {
      alert('Đã tồn tại cấu hình quan hệ với loại này giữa 2 danh mục!');
      return;
    }

    // Validation: Cycle Detection
    if (createsCycle(formData.sourceEntityId, formData.targetEntityId, editingRelationship?.id)) {
      alert('Không thể lưu! Thiết lập quan hệ này tạo ra vòng lặp (Circular Dependency) giữa các danh mục.');
      return;
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const sourceEntity = entities.find(e => e.id === formData.sourceEntityId);
    const targetEntity = entities.find(e => e.id === formData.targetEntityId);

    if (editingRelationship) {
      const updatedRelationships = relationships.map(rel =>
        rel.id === editingRelationship.id
          ? {
              ...rel,
              ...formData,
              sourceEntityName: sourceEntity?.name || '',
              targetEntityName: targetEntity?.name || '',
              updatedDate: dateStr,
              updatedBy: 'Admin (Bạn)'
            } as EntityRelationship
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
        relationshipType: formData.relationshipType!,
        sourceKey: formData.sourceKey,
        targetKey: formData.targetKey,
        targetDisplayField: formData.targetDisplayField,
        mappingTable: formData.mappingTable,
        status: formData.status as RelationshipStatus,
        createdDate: dateStr,
        createdBy: 'Admin (Bạn)'
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
      relationshipType: '1-n',
      sourceKey: '',
      targetKey: '',
      targetDisplayField: '',
      mappingTable: '',
      status: 'active'
    });
  };

  const getStatusBadge = (status: RelationshipStatus) => {
    return status === 'active'
      ? { label: 'Hoạt động', className: 'bg-green-100 text-green-700' }
      : { label: 'Không hoạt động', className: 'bg-slate-100 text-black' };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-black font-bold text-lg">Cấu hình quan hệ thực thể</h2>
          <p className="text-sm text-black mt-1">
            Định nghĩa liên kết (1-n, n-n) giữa các danh mục dữ liệu chủ
          </p>
        </div>
        {!isViewOnly && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Thêm quan hệ mới
          </button>
        )}
      </div>

      {/* Relationships Table */}
      <div className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8fafc] text-black border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-[14px] font-normal">Thực thể nguồn</th>
                <th className="text-center px-6 py-4 text-[14px] font-normal">Loại quan hệ</th>
                <th className="text-left px-6 py-4 text-[14px] font-normal">Thực thể đích</th>
                <th className="text-left px-6 py-4 text-[14px] font-normal">Điều kiện liên kết</th>
                <th className="text-left px-6 py-4 text-[14px] font-normal">Cập nhật lúc</th>
                {!isViewOnly && <th className="text-right px-6 py-4 text-[14px] font-normal">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {relationships.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Network className="w-12 h-12 text-blue-200 mx-auto mb-3" />
                    <p className="text-slate-500 italic">
                      Chưa có quan hệ nào được thiết lập. Vui lòng thêm mới để bắt đầu.
                    </p>
                  </td>
                </tr>
              ) : (
                relationships.map((relationship) => {
                  return (
                    <tr key={relationship.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-black">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          {relationship.sourceEntityName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-1">
                          <span className="inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded border border-indigo-100">
                            {relationTypeIcons[relationship.relationshipType]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-black">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          {relationship.targetEntityName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {relationship.relationshipType === 'n-n' ? (
                          <div className="text-xs">
                            <div className="flex items-center gap-1 text-purple-600 font-bold mb-1">
                              <Table className="w-3 h-3" />
                              <span>Bảng: <code className="bg-purple-100 px-1 py-0.5 rounded">{relationship.mappingTable}</code></span>
                            </div>
                            <div className="text-slate-500">
                              <span className="text-blue-600 font-medium">{relationship.sourceKey}</span> ↔ <span className="text-emerald-600 font-medium">{relationship.targetKey}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs">
                            <div className="flex items-center gap-1 text-blue-600 font-bold mb-1">
                              <Key className="w-3 h-3" />
                              <span>FK: <code className="bg-blue-100 px-1 py-0.5 rounded">{relationship.sourceKey}</code></span>
                            </div>
                            <div className="text-slate-500">
                              → Chiếu tới bảng <span className="font-medium text-emerald-600">{relationship.targetEntityName}</span> (khoá: {relationship.targetKey})
                            </div>
                            {relationship.targetDisplayField && (
                              <div className="text-teal-700 mt-1 font-medium bg-teal-50 inline-flex px-1.5 py-0.5 rounded border border-teal-100 items-center justify-center">
                                Cột hiển thị: {relationship.targetDisplayField}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs">
                         <div className="flex flex-col gap-0.5">
                            <span className="text-slate-700 font-medium">{relationship.updatedDate || relationship.createdDate}</span>
                            <span className="text-slate-500">{relationship.updatedBy || relationship.createdBy}</span>
                         </div>
                      </td>
                      {!isViewOnly && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                 setApprovalRequestData({
                                    id: relationship.id,
                                    code: relationship.relationshipType,
                                    name: `${relationship.sourceEntityName} - ${relationship.targetEntityName}`,
                                    type: 'attribute'
                                 });
                                 setApprovalRequestForm({ reviewer: '', note: '' });
                                 setShowApprovalModal(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Gửi phê duyệt"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(relationship)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(relationship.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white shadow-sm shrink-0">
              <h3 className="text-[18px] font-bold text-black flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-600" />
                {editingRelationship ? 'Chỉnh sửa quan hệ thực thể' : 'Thêm quan hệ thực thể mới'}
              </h3>
              <button title="Đóng" onClick={handleCloseForm} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
              {/* Entity Selection */}
              <div className="space-y-4 relative z-20">
                <h4 className="text-[15px] font-bold text-black border-b border-slate-100 pb-2">1. Chọn thực thể liên kết</h4>
                
                <div className="grid grid-cols-2 gap-6 relative">
                  <SearchableSelect 
                    label="Thực thể nguồn"
                    options={entities.map(e => ({ value: e.id, label: `${e.code} - ${e.name}` }))} 
                    value={formData.sourceEntityId || ''} 
                    onChange={v => setFormData({ ...formData, sourceEntityId: v, sourceKey: '' })}
                    placeholder="-- Tìm & chọn danh mục nguồn --" 
                  />
                  <SearchableSelect 
                    label="Thực thể đích"
                    options={entities.filter(e => e.id !== formData.sourceEntityId).map(e => ({ value: e.id, label: `${e.code} - ${e.name}` }))} 
                    value={formData.targetEntityId || ''} 
                    onChange={v => setFormData({ ...formData, targetEntityId: v, targetKey: '', targetDisplayField: '' })}
                    placeholder="-- Tìm & chọn danh mục đích --" 
                  />
                </div>

                {/* Existing relationships banner */}
                {formData.sourceEntityId && formData.targetEntityId && existingRelationsBetween.length > 0 && (
                   <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3 text-sm mt-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                         <p className="font-bold text-amber-900">Lưu ý: Giữa 2 danh mục này đã tồn tại {existingRelationsBetween.length} quan hệ:</p>
                         <ul className="list-disc pl-5 mt-1 text-amber-800">
                            {existingRelationsBetween.map(r => (
                               <li key={r.id}>
                                  Loại: <b>{relationTypeLabels[r.relationshipType]}</b> (Khoá nối: {r.sourceKey} ↔ {r.targetKey})
                               </li>
                            ))}
                         </ul>
                      </div>
                   </div>
                )}

                {/* Visual Representation */}
                {formData.sourceEntityId && formData.targetEntityId && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4 flex items-center justify-center gap-6 relative z-10">
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">A</div>
                      <span className="text-[14px] font-bold text-black text-center">
                        {entities.find(e => e.id === formData.sourceEntityId)?.name}
                      </span>
                    </div>
                    <ArrowRight className="w-6 h-6 text-slate-400 shrink-0" />
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">B</div>
                      <span className="text-[14px] font-bold text-black text-center">
                        {entities.find(e => e.id === formData.targetEntityId)?.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Relation Type */}
              <div className="space-y-4 pt-2 relative z-10">
                <h4 className="text-[15px] font-bold text-black border-b border-slate-100 pb-2">2. Loại quan hệ</h4>
                
                <div>
                  <label className="block text-[14px] font-semibold text-black mb-2">
                    Chọn loại quan hệ <span className="text-red-600">*</span>
                  </label>
                  <select
                    title="Chọn loại quan hệ"
                    value={formData.relationshipType}
                    onChange={(e: any) => setFormData({ ...formData, relationshipType: e.target.value as RelationshipType })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]"
                  >
                    {Object.entries(relationTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Link Conditions */}
              <div className="space-y-4 pt-2 relative z-0">
                <h4 className="text-[15px] font-bold text-black border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>3. Điều kiện liên kết</span>
                  {(!formData.sourceEntityId || !formData.targetEntityId) && (
                    <span className="text-xs text-orange-600 bg-orange-50 font-normal px-2 py-1 rounded-md border border-orange-100">
                      Vui lòng chọn xong thực thể để tải danh sách các trường (thuộc tính)
                    </span>
                  )}
                </h4>

                {(formData.sourceEntityId && formData.targetEntityId) ? (
                  formData.relationshipType === 'n-n' ? (
                    // Many-to-Many: Mapping Table
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <Table className="w-5 h-5 text-purple-600" />
                        <span className="text-[14px] font-bold text-purple-900">Bảng liên kết (Mapping Table)</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-black mb-1.5">
                            Tên bảng liên kết <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.mappingTable || ''}
                            onChange={(e: any) => setFormData({ ...formData, mappingTable: e.target.value })}
                            placeholder="VD: tbl_map_citizen_organization"
                            className="w-full px-4 py-2 border border-slate-300 bg-white rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[13px] font-semibold text-black mb-1.5">
                              Khoá ngoại đại diện Nguồn <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.sourceKey || ''}
                              onChange={(e: any) => setFormData({ ...formData, sourceKey: e.target.value })}
                              placeholder="VD: citizen_id"
                              className="w-full px-4 py-2 border border-slate-300 bg-white rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <p className="text-[11px] text-slate-500 mt-1">Trường khoá ngoại lưu trong bảng Map tương ứng của Danh mục {entities.find(e => e.id === formData.sourceEntityId)?.name}</p>
                          </div>

                          <div>
                            <label className="block text-[13px] font-semibold text-black mb-1.5">
                              Khoá ngoại đại diện Đích <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.targetKey || ''}
                              onChange={(e: any) => setFormData({ ...formData, targetKey: e.target.value })}
                              placeholder="VD: organization_id"
                              className="w-full px-4 py-2 border border-slate-300 bg-white rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <p className="text-[11px] text-slate-500 mt-1">Trường khoá ngoại lưu trong bảng Map tương ứng của Danh mục {entities.find(e => e.id === formData.targetEntityId)?.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // One-to-Many or One-to-One: Foreign Key
                    <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <Key className="w-5 h-5 text-blue-600" />
                        <span className="text-[14px] font-bold text-blue-900">Khóa ngoại (Foreign Key)</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[13px] font-semibold text-black mb-1.5">
                            Khóa nguồn (Source Field) <span className="text-red-600">*</span>
                          </label>
                          <select
                            title="Chọn trường nguồn"
                            value={formData.sourceKey || ''}
                            onChange={(e: any) => setFormData({ ...formData, sourceKey: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 bg-white rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-sm"
                          >
                            <option value="">-- Chọn trường thuộc tính Nguồn --</option>
                            {sourceAttributes.map(attr => (
                              <option key={attr.id} value={attr.name}>{attr.name} ({attr.displayName} - {attr.type})</option>
                            ))}
                          </select>
                          <p className="text-[11px] text-slate-500 mt-1">Trường nằm trong Danh mục Nguồn</p>
                        </div>

                        <div>
                          <label className="block text-[13px] font-semibold text-black mb-1.5">
                            Khóa đích để đối chiếu (Target Field) <span className="text-red-600">*</span>
                          </label>
                          <select
                            title="Chọn trường đích"
                            value={formData.targetKey || ''}
                            onChange={(e: any) => setFormData({ ...formData, targetKey: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 bg-white rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-sm"
                          >
                            <option value="">-- Chọn trường thuộc tính Đích --</option>
                            {targetAttributes.map(attr => (
                              <option key={attr.id} value={attr.name}>{attr.name} ({attr.displayName} - {attr.type})</option>
                            ))}
                          </select>
                          <p className="text-[11px] text-slate-500 mt-1">Sẽ dùng trường này để join (Thường là ID hoặc Code)</p>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-blue-100 mt-2">
                         <label className="block text-[13px] font-semibold text-emerald-700 mb-1.5">
                           Trường lấy ra để hiển thị (Lookup Display Field) <span className="text-slate-400 font-normal">(Không bắt buộc)</span>
                         </label>
                         <div className="flex gap-4 items-start">
                           <select
                             title="Chọn trường hiển thị"
                             value={formData.targetDisplayField || ''}
                             onChange={(e: any) => setFormData({ ...formData, targetDisplayField: e.target.value })}
                             className="w-full max-w-md px-4 py-2 border border-emerald-200 bg-white rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-sm"
                           >
                             <option value="">-- Không chọn --</option>
                             {targetAttributes.map(attr => (
                               <option key={attr.id} value={attr.name}>{attr.name} ({attr.displayName})</option>
                             ))}
                           </select>
                           <p className="text-[12px] text-slate-600 flex-1 leading-relaxed bg-white/50 p-2 rounded border border-slate-100">
                             <Info className="w-3 h-3 inline mr-1 text-slate-400"/>
                             Là trường (VD: <b>Tên tổ chức</b>) nằm tải từ Danh mục Đích về để hiển thị thay cho chuỗi mã khóa ngoại vô nghĩa trên giao diện người dùng.
                           </p>
                         </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-8 text-center text-slate-500">
                    <p>Hãy chọn thực thể nguồn và đích ở Bước 1 để cấu hình khóa</p>
                  </div>
                )}
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50 shrink-0">
              <button
 onClick={handleCloseForm}
 className="px-6 py-2.5 text-black bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors text-[14px]"
 >
                Hủy
              </button>
              <button
 onClick={() => {
 setApprovalRequestData({
 id: editingRelationship?.id || `rel-${Date.now()}`,
 code: formData.relationshipType || '',
 name: `Cấu hình quan hệ mới`,
 type: 'attribute'
 });
 setApprovalRequestForm({ reviewer: '', note: '' });
 setShowApprovalModal(true);
 }}
 className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 text-[14px]"
 >
 <Send className="w-4 h-4" />
 Lưu & trình duyệt
 </button>
              <button
 onClick={handleSubmit}
 className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 text-[14px]"
 >
                <Save className="w-4 h-4" />
                {editingRelationship ? 'Lưu cập nhật' : 'Thêm quan hệ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {genericConfirm && (
        <ConfirmModal
          isOpen={genericConfirm.isOpen}
          onClose={() => setGenericConfirm(null)}
          type={genericConfirm.type}
          title={genericConfirm.title}
          subtitle={genericConfirm.subtitle}
          message={genericConfirm.message}
          confirmText={genericConfirm.confirmText}
          onConfirm={genericConfirm.onConfirm}
        />
      )}

      <ApprovalRequestModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        data={approvalRequestData as any}
        approvers={approvers}
        form={approvalRequestForm}
        setForm={setApprovalRequestForm}
        onSubmit={() => {
          if (!approvalRequestForm.reviewer) {
            setGenericConfirm({
              isOpen: true, type: 'warning', title: 'Lỗi xác thực', subtitle: 'Thiếu thông tin',
              message: 'Vui lòng chọn Người phê duyệt!', confirmText: 'Đóng', onConfirm: () => setGenericConfirm(null)
            });
            return;
          }

          handleSubmit(); // Lưu form nếu có
          setShowApprovalModal(false);
          setTimeout(() => {
            setGenericConfirm({
              isOpen: true, type: 'success', title: 'Thành công', subtitle: '', message: 'Đã gửi yêu cầu trình duyệt thành công!', confirmText: 'Đóng', onConfirm: () => setGenericConfirm(null)
            });
          }, 300);
        }}
      />
    </div>
  );
}

// Custom Component: Searchable Select
interface SearchableSelectProps {

  label: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

function SearchableSelect({ label, placeholder, options, value, onChange }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);
  const filteredOptions = options.filter(o => o.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-[14px] font-semibold text-black mb-2">
        {label} <span className="text-red-600">*</span>
      </label>
      
      <div 
        className={`w-full px-4 py-2 border rounded-lg flex items-center justify-between cursor-pointer bg-white text-[14px] transition-colors
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-300 hover:border-slate-400'}`}
        onClick={() => { setIsOpen(!isOpen); setSearchTerm(''); }}
      >
        <span className={selectedOption ? 'text-black font-medium' : 'text-slate-400'}>
          {selectedOption ? selectedOption.label : (placeholder || '-- Chọn --')}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute top-[full] left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="text" 
              className="w-full bg-transparent text-sm focus:outline-none placeholder:text-slate-400"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
              onClick={(e: any) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div 
                  key={option.value}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors
                    ${option.value === value ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600' : 'text-slate-700 border-l-2 border-transparent'}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-slate-500 text-center italic">Không tìm thấy kết quả</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
