import React, { useState, useRef, useEffect, ReactNode, ChangeEvent, MouseEvent } from 'react';
import { Network, ArrowRight, Key, Table, Search, AlertCircle, Info, ChevronDown, Plus, Trash2, SquarePen, CheckCircle2 } from 'lucide-react';
import { MasterDataEntity, EntityRelationship, RelationshipType, RelationshipStatus, FieldDataType } from '../../categoryTypes';
import { ConfirmModal } from '../../../../common/ConfirmModal';
import { BaseModal } from '../../../../common/BaseModal';

interface RelationshipsTabProps {
  entities: MasterDataEntity[];
  relationships: EntityRelationship[];
  setRelationships: (relationships: EntityRelationship[]) => void;
  isViewOnly?: boolean;
  currentEntityId?: string;
  currentEntityName?: string;
  currentEntityCode?: string;
}

const relationTypeLabels: Record<RelationshipType, string> = {
  '1-n': '1 - n (Một - Nhiều)',
  'n-1': 'n - 1 (Nhiều - Một)',
  'n-n': 'n - n (Nhiều - Nhiều)',
  '1-1': '1 - 1 (Một - Một)'
};

const relationTypeColors: Record<RelationshipType, string> = {
  '1-n': 'bg-blue-50 text-blue-700 border-blue-200',
  'n-1': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'n-n': 'bg-purple-50 text-purple-700 border-purple-200',
  '1-1': 'bg-teal-50 text-teal-700 border-teal-200',
};

const BASE_MOCK_FIELDS = [
  { id: 'f1', name: 'id', displayName: 'ID định danh', type: 'string' },
  { id: 'f2', name: 'code', displayName: 'Mã danh mục', type: 'string' },
  { id: 'f3', name: 'name', displayName: 'Tên/Tiêu đề', type: 'string' },
  { id: 'f4', name: 'status', displayName: 'Trạng thái', type: 'string' },
  { id: 'f5', name: 'created_date', displayName: 'Ngày tạo', type: 'date' },
];

const emptyForm: Partial<EntityRelationship> = {
  sourceEntityId: '',
  targetEntityId: '',
  relationshipType: '1-n',
  sourceKey: '',
  targetKey: '',
  targetDisplayField: '',
  mappingTable: '',
  status: 'active'
};

export function RelationshipsTab({
  entities,
  relationships,
  setRelationships,
  isViewOnly = false,
  currentEntityId,
  currentEntityName = '',
  currentEntityCode = '',
}: RelationshipsTabProps) {

  // Local state for relationships to ensure UX is smooth even with empty parent callbacks
  const [localRelationships, setLocalRelationships] = useState<EntityRelationship[]>(relationships);
  const [selectedEntityId, setSelectedEntityId] = useState<string>(
    currentEntityId || (entities.length > 0 ? entities[0].id : '')
  );
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRelation, setEditingRelation] = useState<EntityRelationship | null>(null);
  const [formData, setFormData] = useState<Partial<EntityRelationship>>(emptyForm);
  const [formError, setFormError] = useState('');
  const [gridSearchTerm, setGridSearchTerm] = useState('');

  const [genericConfirm, setGenericConfirm] = useState<{
    isOpen: boolean;
    type: 'success' | 'info' | 'warning' | 'delete';
    title: string;
    subtitle: string;
    message: ReactNode;
    confirmText: string;
    onConfirm: () => void;
  } | null>(null);

  // Sync prop relationships with local state
  useEffect(() => {
    if (relationships) {
      setLocalRelationships(relationships);
    }
  }, [relationships]);

  // Sync selectedEntityId when currentEntityId prop updates
  useEffect(() => {
    if (currentEntityId) {
      setSelectedEntityId(currentEntityId);
    }
  }, [currentEntityId]);

  // Combined entities list (includes current wizard entity if not already in entities)
  const allEntities: MasterDataEntity[] = (() => {
    if (!currentEntityId) return entities;
    const alreadyIn = entities.some(e => e.id === currentEntityId);
    if (alreadyIn) return entities;
    
    const virtual: MasterDataEntity = {
      id: currentEntityId,
      code: currentEntityCode,
      name: currentEntityName,
      dataType: 'standard',
      managingAgency: '',
      scope: 'ministry',
      description: '',
      lifecycleStatus: 'draft',
      createdDate: '',
      updatedDate: '',
      createdBy: '',
    };
    return [virtual, ...entities];
  })();

  const getEntityAttributes = (entityId?: string) => {
    if (!entityId) return [];
    const entity = allEntities.find(e => e.id === entityId);
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
      attrs.push({ id: `fk_to_${entityId}`, name: `${entity.code.toLowerCase()}_ref_id`, displayName: `Mã tham chiếu ${entity.name}`, type: 'string' });
    }
    return attrs;
  };

  const sourceAttributes = getEntityAttributes(formData.sourceEntityId);
  const targetAttributes = getEntityAttributes(formData.targetEntityId);

  // Cycle detection
  const createsCycle = (allRels: EntityRelationship[], newSourceId: string, newTargetId: string, newType: RelationshipType) => {
    const adj: Record<string, string[]> = {};
    allRels.forEach(rel => {
      if (!adj[rel.sourceEntityId]) adj[rel.sourceEntityId] = [];
      adj[rel.sourceEntityId].push(rel.targetEntityId);
      if (rel.relationshipType === 'n-n' || rel.relationshipType === '1-1') {
        if (!adj[rel.targetEntityId]) adj[rel.targetEntityId] = [];
        adj[rel.targetEntityId].push(rel.sourceEntityId);
      }
    });
    if (!adj[newSourceId]) adj[newSourceId] = [];
    adj[newSourceId].push(newTargetId);
    if (newType === 'n-n' || newType === '1-1') {
      if (!adj[newTargetId]) adj[newTargetId] = [];
      adj[newTargetId].push(newSourceId);
    }
    const visited: Record<string, boolean> = {};
    const recStack: Record<string, boolean> = {};
    const dfs = (node: string): boolean => {
      if (!visited[node]) {
        visited[node] = true;
        recStack[node] = true;
        for (const next of (adj[node] || [])) {
          if (!visited[next] && dfs(next)) return true;
          else if (recStack[next]) return true;
        }
      }
      recStack[node] = false;
      return false;
    };
    for (const node in adj) { if (dfs(node)) return true; }
    return false;
  };

  // Add new relation trigger
  const handleAddRelationship = () => {
    setEditingRelation(null);
    setFormError('');
    setFormData({
      sourceEntityId: selectedEntityId,
      targetEntityId: '',
      relationshipType: '1-n',
      sourceKey: '',
      targetKey: '',
      targetDisplayField: '',
      mappingTable: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  // Edit relationship trigger
  const handleEditRelationship = (rel: EntityRelationship) => {
    setEditingRelation(rel);
    setFormError('');
    setFormData({ ...rel });
    setIsModalOpen(true);
  };

  // Save relationship (add or update)
  const handleSaveRelation = () => {
    setFormError('');
    if (!formData.sourceEntityId || !formData.targetEntityId) {
      setFormError('Vui lòng chọn đầy đủ thực thể nguồn và thực thể đích.');
      return;
    }
    if (formData.sourceEntityId === formData.targetEntityId) {
      setFormError('Thực thể nguồn và thực thể đích phải khác nhau.');
      return;
    }
    if (formData.relationshipType === 'n-n') {
      if (!formData.mappingTable || !formData.sourceKey || !formData.targetKey) {
        setFormError('Quan hệ n-n cần có đầy đủ: Bảng liên kết, Khóa ngoại nguồn, Khóa ngoại đích.');
        return;
      }
    } else {
      if (!formData.sourceKey || !formData.targetKey) {
        setFormError('Cần khai báo đầy đủ Khóa nguồn và Khóa đích.');
        return;
      }
    }

    const hasDuplicate = localRelationships.some(r =>
      r.id !== (editingRelation?.id || '') &&
      r.sourceEntityId === formData.sourceEntityId &&
      r.targetEntityId === formData.targetEntityId &&
      r.relationshipType === formData.relationshipType
    );
    if (hasDuplicate) {
      setFormError('Đã tồn tại quan hệ cùng loại giữa 2 danh mục này.');
      return;
    }

    const otherRelations = localRelationships.filter(r => r.id !== (editingRelation?.id || ''));
    if (createsCycle(otherRelations, formData.sourceEntityId!, formData.targetEntityId!, formData.relationshipType!)) {
      setFormError('Quan hệ này tạo ra vòng lặp (Circular Dependency). Vui lòng kiểm tra lại.');
      return;
    }

    const sourceEntity = allEntities.find(e => e.id === formData.sourceEntityId);
    const targetEntity = allEntities.find(e => e.id === formData.targetEntityId);

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let updatedList: EntityRelationship[] = [];
    if (editingRelation) {
      // Edit
      updatedList = localRelationships.map(r => r.id === editingRelation.id ? {
        ...r,
        sourceEntityId: formData.sourceEntityId!,
        sourceEntityName: sourceEntity?.name || '',
        targetEntityId: formData.targetEntityId!,
        targetEntityName: targetEntity?.name || '',
        relationshipType: formData.relationshipType!,
        sourceKey: formData.sourceKey,
        targetKey: formData.targetKey,
        targetDisplayField: formData.targetDisplayField,
        mappingTable: formData.mappingTable,
        status: formData.status || 'active',
        updatedDate: dateStr,
        updatedBy: 'Admin (Bạn)'
      } as EntityRelationship : r);
    } else {
      // Add
      const newId = `rel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newItem: EntityRelationship = {
        id: newId,
        sourceEntityId: formData.sourceEntityId!,
        sourceEntityName: sourceEntity?.name || '',
        targetEntityId: formData.targetEntityId!,
        targetEntityName: targetEntity?.name || '',
        relationshipType: formData.relationshipType!,
        sourceKey: formData.sourceKey,
        targetKey: formData.targetKey,
        targetDisplayField: formData.targetDisplayField,
        mappingTable: formData.mappingTable,
        status: 'active',
        createdDate: dateStr,
        createdBy: 'Admin (Bạn)'
      };
      updatedList = [...localRelationships, newItem];
    }

    setLocalRelationships(updatedList);
    setRelationships(updatedList);
    setIsModalOpen(false);

    // Show success dialog
    setTimeout(() => {
      setGenericConfirm({
        isOpen: true,
        type: 'success',
        title: editingRelation ? 'Cập nhật thành công' : 'Thêm mới thành công',
        subtitle: '',
        message: editingRelation ? 'Cập nhật quan hệ danh mục thành công!' : 'Thêm mới quan hệ danh mục thành công!',
        confirmText: 'Đóng',
        onConfirm: () => setGenericConfirm(null)
      });
    }, 200);
  };

  // Delete relationship trigger
  const handleDeleteRelation = (rel: EntityRelationship) => {
    setGenericConfirm({
      isOpen: true,
      type: 'delete',
      title: 'Xác nhận xóa quan hệ',
      subtitle: 'Hành động này không thể hoàn tác',
      message: (
        <div className="space-y-1 text-[13px] text-left">
          <div className="text-slate-500">Xóa quan hệ giữa:</div>
          <div className="font-semibold text-slate-800">
            {rel.sourceEntityName} ↔ {rel.targetEntityName}
          </div>
          <div className="text-slate-500 mt-1">Loại quan hệ: {relationTypeLabels[rel.relationshipType]}</div>
        </div>
      ),
      confirmText: 'Xác nhận xóa',
      onConfirm: () => {
        const updated = localRelationships.filter(r => r.id !== rel.id);
        setLocalRelationships(updated);
        setRelationships(updated);
        setGenericConfirm(null);
      }
    });
  };

  // Filter relations for the selected category
  const filteredRelations = localRelationships.filter(rel => {
    const matchesCategory = rel.sourceEntityId === selectedEntityId || rel.targetEntityId === selectedEntityId;
    if (!matchesCategory) return false;

    if (gridSearchTerm) {
      const search = gridSearchTerm.toLowerCase();
      const sourceEntity = allEntities.find(e => e.id === rel.sourceEntityId);
      const targetEntity = allEntities.find(e => e.id === rel.targetEntityId);
      return (
        (sourceEntity?.name || '').toLowerCase().includes(search) ||
        (targetEntity?.name || '').toLowerCase().includes(search) ||
        (rel.sourceKey || '').toLowerCase().includes(search) ||
        (rel.targetKey || '').toLowerCase().includes(search) ||
        (rel.mappingTable || '').toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Category selector & control block */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-2">
        <label className="block text-[13px] font-semibold text-slate-700">
          {currentEntityId ? 'Danh mục đang cấu hình:' : 'Chọn danh mục dữ liệu dùng chung:'}
        </label>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md w-full">
            <SearchableSelect
              label=""
              options={allEntities.map(e => ({ value: e.id, label: `${e.code} - ${e.name}` }))}
              value={selectedEntityId}
              onChange={(val) => {
                setSelectedEntityId(val);
                setGridSearchTerm('');
              }}
              placeholder="-- Chọn danh mục --"
              disabled={!!currentEntityId}
            />
          </div>

          {currentEntityId ? (
            !isViewOnly && (
              <button
                onClick={handleAddRelationship}
                className="w-full md:w-auto h-10 flex items-center justify-center gap-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] font-medium active:scale-95 shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Thêm mới quan hệ
              </button>
            )
          ) : (
            <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
              <div className="w-full md:w-64 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm quan hệ..."
                  value={gridSearchTerm}
                  onChange={(e) => setGridSearchTerm(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 bg-white border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {!isViewOnly && (
                <button
                  onClick={handleAddRelationship}
                  className="w-full md:w-auto h-10 flex items-center justify-center gap-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] font-medium active:scale-95 shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Thêm mới quan hệ
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid of relationships */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
        {filteredRelations.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <Network className="w-12 h-12 text-slate-300 mb-3 stroke-[1.5]" />
            <p className="text-[13px] font-semibold text-slate-700">Chưa có quan hệ nào</p>
            <p className="text-[13px] text-slate-500 mt-1 max-w-sm">Danh mục này hiện chưa được cấu hình liên kết với danh mục nào khác.</p>
            {!isViewOnly && (
              <button
                onClick={handleAddRelationship}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] font-medium active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Thêm mới quan hệ
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 font-semibold text-slate-500 text-[13px] w-16 text-center">STT</th>
                  <th className="px-6 py-3 font-semibold text-slate-500 text-[13px]">Danh mục Nguồn</th>
                  <th className="px-6 py-3 font-semibold text-slate-500 text-[13px]">Khóa Nguồn</th>
                  <th className="px-6 py-3 font-semibold text-slate-500 text-[13px] text-center w-28">Loại</th>
                  <th className="px-6 py-3 font-semibold text-slate-500 text-[13px]">Danh mục Đích</th>
                  <th className="px-6 py-3 font-semibold text-slate-500 text-[13px]">Khóa Đích</th>
                  <th className="px-6 py-3 font-semibold text-slate-500 text-[13px]">Trường hiển thị</th>
                  {!isViewOnly && (
                    <th className="px-6 py-3 font-semibold text-slate-500 text-[13px] text-center w-24">Thao tác</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRelations.map((rel, idx) => {
                  const sourceEntity = allEntities.find(e => e.id === rel.sourceEntityId);
                  const targetEntity = allEntities.find(e => e.id === rel.targetEntityId);
                  const isSourceSelected = rel.sourceEntityId === selectedEntityId;
                  
                  return (
                    <tr key={rel.id} className="hover:bg-slate-50/50 transition-colors text-[13px]">
                      <td className="px-6 py-4 text-center text-slate-500 font-medium text-[13px]">{idx + 1}</td>
                      <td className="px-6 py-4 text-[13px]">
                        <div className={`${isSourceSelected ? 'text-blue-600' : 'text-slate-800'} text-[13px]`}>
                          {sourceEntity?.name || rel.sourceEntityId}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600 text-[13px]">{rel.sourceKey || '--'}</td>
                      <td className="px-6 py-4 text-center text-[13px]">
                        <span className={`px-2 py-0.5 rounded border text-[13px] font-semibold whitespace-nowrap ${relationTypeColors[rel.relationshipType]}`}>
                          {rel.relationshipType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px]">
                        <div className={`${!isSourceSelected ? 'text-blue-600' : 'text-slate-800'} text-[13px]`}>
                          {targetEntity?.name || rel.targetEntityId}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600 text-[13px]">{rel.targetKey || '--'}</td>
                      <td className="px-6 py-4 text-slate-600 text-[13px]">
                        {rel.relationshipType === 'n-n' ? (
                          <code className="text-purple-700 bg-purple-50 px-1 py-0.5 rounded font-mono text-[13px]">{rel.mappingTable || '--'}</code>
                        ) : (
                          rel.targetDisplayField
                            ? <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono text-[13px]">{rel.targetDisplayField}</code>
                            : <span className="text-slate-400 text-[13px]">--</span>
                        )}
                      </td>

                      {!isViewOnly && (
                        <td className="px-6 py-4 text-right text-[13px]">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditRelationship(rel)}
                              className="p-1.5 border border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300 rounded-lg transition-colors cursor-pointer"
                              title="Chỉnh sửa quan hệ"
                            >
                              <SquarePen className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRelation(rel)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa quan hệ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Relationship Modal */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRelation ? 'Chỉnh sửa quan hệ danh mục' : 'Thêm mới quan hệ danh mục'}
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-white text-[#020817] border border-[#e2e8f0] hover:bg-slate-50 rounded-lg text-[13px] font-medium transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSaveRelation}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-[13px] font-medium transition-colors cursor-pointer"
            >
              Lưu lại
            </button>
          </div>
        }
      >
        <div className="space-y-6 text-left">
          {/* 1. Chọn thực thể */}
          <div className="space-y-4">
            <h4 className="text-[13px] font-semibold text-slate-700 border-b border-slate-100 pb-2">1. Chọn thực thể liên kết</h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Thực thể nguồn <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  label=""
                  options={allEntities.map(e => ({ value: e.id, label: `${e.code} - ${e.name}` }))}
                  value={formData.sourceEntityId || ''}
                  onChange={v => { setFormError(''); setFormData({ ...formData, sourceEntityId: v, sourceKey: '' }); }}
                  placeholder="-- Tìm & chọn danh mục nguồn --"
                  disabled={!!currentEntityId}
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Thực thể đích <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  label=""
                  options={allEntities
                    .filter(e => e.id !== formData.sourceEntityId)
                    .map(e => ({ value: e.id, label: `${e.code} - ${e.name}` }))}
                  value={formData.targetEntityId || ''}
                  onChange={v => { setFormError(''); setFormData({ ...formData, targetEntityId: v, targetKey: '', targetDisplayField: '' }); }}
                  placeholder="-- Tìm & chọn danh mục đích --"
                />
              </div>
            </div>

            {formData.sourceEntityId && formData.targetEntityId && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0">A</div>
                  <span className="text-[13px] font-semibold text-slate-800 text-center truncate w-full">{allEntities.find(e => e.id === formData.sourceEntityId)?.name}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0">B</div>
                  <span className="text-[13px] font-semibold text-slate-800 text-center truncate w-full">{allEntities.find(e => e.id === formData.targetEntityId)?.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Loại quan hệ */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-semibold text-slate-700 border-b border-slate-100 pb-2">2. Loại quan hệ</h4>
            <div>
              <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Loại liên kết <span className="text-red-500">*</span></label>
              <select
                title="Chọn loại quan hệ"
                value={formData.relationshipType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, relationshipType: e.target.value as RelationshipType })}
                className="w-full px-3 py-2 border border-slate-250 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[13px] bg-white border-slate-300"
              >
                {Object.entries(relationTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Điều kiện liên kết */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-semibold text-slate-700 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>3. Điều kiện liên kết</span>
              {(!formData.sourceEntityId || !formData.targetEntityId) && (
                <span className="text-[13px] text-orange-600 bg-orange-50 font-normal px-2 py-0.5 rounded border border-orange-100">
                  Chọn xong thực thể để tải danh sách trường
                </span>
              )}
            </h4>

            {(formData.sourceEntityId && formData.targetEntityId) ? (
              formData.relationshipType === 'n-n' ? (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-purple-600" />
                    <span className="text-[13px] font-semibold text-purple-900">Bảng liên kết (Mapping Table)</span>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Tên bảng liên kết <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.mappingTable || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, mappingTable: e.target.value })}
                      placeholder="VD: tbl_map_citizen_organization"
                      className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Khoá ngoại Nguồn <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.sourceKey || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, sourceKey: e.target.value })} placeholder="VD: citizen_id" className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" />
                      <p className="text-[13px] text-slate-400 mt-1">Trường FK của {allEntities.find(e => e.id === formData.sourceEntityId)?.name}</p>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Khoá ngoại Đích <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.targetKey || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, targetKey: e.target.value })} placeholder="VD: organization_id" className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" />
                      <p className="text-[13px] text-slate-400 mt-1">Trường FK của {allEntities.find(e => e.id === formData.targetEntityId)?.name}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-600" />
                    <span className="text-[13px] font-semibold text-blue-900">Khóa ngoại (Foreign Key)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Khóa nguồn <span className="text-red-500">*</span></label>
                      <select title="Chọn trường nguồn" value={formData.sourceKey || ''} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, sourceKey: e.target.value })} className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono">
                        <option value="">-- Chọn trường Nguồn --</option>
                        {sourceAttributes.map(attr => <option key={attr.id} value={attr.name}>{attr.name} ({attr.displayName})</option>)}
                      </select>
                      <p className="text-[13px] text-slate-400 mt-1">Trường trong danh mục Nguồn</p>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Khóa đích <span className="text-red-500">*</span></label>
                      <select title="Chọn trường đích" value={formData.targetKey || ''} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, targetKey: e.target.value })} className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono">
                        <option value="">-- Chọn trường Đích --</option>
                        {targetAttributes.map(attr => <option key={attr.id} value={attr.name}>{attr.name} ({attr.displayName})</option>)}
                      </select>
                      <p className="text-[13px] text-slate-400 mt-1">Trường dùng để join (thường là ID/Code)</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-blue-100">
                    <label className="block text-[13px] font-medium text-emerald-700 mb-1.5">
                      Trường hiển thị (Lookup Display Field) <span className="text-slate-400 font-normal">(Không bắt buộc)</span>
                    </label>
                    <div className="flex gap-4 items-start">
                      <select title="Chọn trường hiển thị" value={formData.targetDisplayField || ''} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, targetDisplayField: e.target.value })} className="w-full max-w-xs px-3 py-2 border border-emerald-250 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono border-emerald-300">
                        <option value="">-- Không chọn --</option>
                        {targetAttributes.map(attr => <option key={attr.id} value={attr.name}>{attr.name} ({attr.displayName})</option>)}
                      </select>
                      <p className="text-[13px] text-slate-500 flex-1 leading-relaxed">
                        <Info className="w-3.5 h-3.5 inline mr-1 text-slate-450 mt-0.5 shrink-0" />
                        Trường hiển thị thay cho mã khóa ngoại (VD: <b>Tên tổ chức</b> thay vì ID).
                      </p>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-lg p-6 text-center text-[13px] text-slate-400">
                Hãy chọn thực thể nguồn và đích ở Bước 1 để cấu hình khóa liên kết
              </div>
            )}
          </div>



          {/* Validation error */}
          {formError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[13px] text-red-600">{formError}</p>
            </div>
          )}
        </div>
      </BaseModal>

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
  disabled?: boolean;
}

function SearchableSelect({ label, placeholder, options, value, onChange, disabled = false }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);
  const filteredOptions = options.filter(o => o.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {label && (
        <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
          {label} <span className="text-red-500">*</span>
        </label>
      )}
      <div
        className={`w-full h-10 px-3 py-2 border rounded-lg flex items-center justify-between bg-white text-[13px] transition-colors
          ${disabled ? 'cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400' : 'cursor-pointer hover:border-slate-400'}
          ${isOpen && !disabled ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-350'}`}
        onClick={() => { if (!disabled) { setIsOpen(!isOpen); setSearchTerm(''); } }}
      >
        <span className={selectedOption ? 'text-slate-800 font-normal' : 'text-slate-400'}>
          {selectedOption ? selectedOption.label : (placeholder || '-- Chọn --')}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-[9999] overflow-hidden">
          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              className="w-full bg-transparent text-[13px] focus:outline-none placeholder:text-slate-400"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              onClick={(e: MouseEvent<HTMLInputElement>) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  className={`px-3 py-2 text-[13px] cursor-pointer hover:bg-blue-50 transition-colors
                    ${option.value === value ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600' : 'text-slate-700 border-l-2 border-transparent'}`}
                  onClick={() => { onChange(option.value); setIsOpen(false); }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-[13px] text-slate-500 text-center italic">Không tìm thấy kết quả</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
