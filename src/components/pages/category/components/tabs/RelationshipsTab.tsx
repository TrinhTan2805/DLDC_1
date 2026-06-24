import React, { useState, useRef, useEffect, ReactNode, ChangeEvent, MouseEvent } from 'react';
import { Save, Network, ArrowRight, Key, Table, Search, AlertCircle, Info, ChevronDown, Send, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { MasterDataEntity, EntityRelationship, RelationshipType, RelationshipStatus } from '../../categoryTypes';
import { ConfirmModal } from '../../../../common/ConfirmModal';
import { ApprovalRequestModal } from '../modals/ApprovalRequestModal';
import { approvers } from '../../categoryConstants';

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

  // Nếu có currentEntityId (đã lưu draft), tự động điền thực thể nguồn
  const initialForm: Partial<EntityRelationship> = currentEntityId
    ? { ...emptyForm, sourceEntityId: currentEntityId }
    : emptyForm;

  const [formData, setFormData] = useState<Partial<EntityRelationship>>(initialForm);
  const [pendingList, setPendingList] = useState<EntityRelationship[]>([]);
  const [formError, setFormError] = useState('');

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

  // Danh sách entities kết hợp: entities có sẵn + entity đang cấu hình (nếu chưa có trong list)
  const allEntities: MasterDataEntity[] = (() => {
    if (!currentEntityId) return entities;
    const alreadyIn = entities.some(e => e.id === currentEntityId);
    if (alreadyIn) return entities;
    // Thêm entity hiện tại như một entry tạm
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

  // Kiểm tra trùng với cả relationships đã lưu lẫn pendingList
  const allExisting = [...relationships, ...pendingList];
  const existingRelationsBetween = allExisting.filter(r =>
    (r.sourceEntityId === formData.sourceEntityId && r.targetEntityId === formData.targetEntityId) ||
    (r.sourceEntityId === formData.targetEntityId && r.targetEntityId === formData.sourceEntityId)
  );

  // Cycle detection trên tập relationships + pendingList + 1 cặp mới
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

  const handleAddToPending = () => {
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
        setFormError('Quan hệ n-n cần có đầy đủ: Bảng liên kết, Khóa nguồn, Khóa đích.');
        return;
      }
    } else {
      if (!formData.sourceKey || !formData.targetKey) {
        setFormError('Cần khai báo đầy đủ Khóa nguồn và Khóa đích.');
        return;
      }
    }
    const hasDuplicate = allExisting.some(r =>
      r.sourceEntityId === formData.sourceEntityId &&
      r.targetEntityId === formData.targetEntityId &&
      r.relationshipType === formData.relationshipType
    );
    if (hasDuplicate) {
      setFormError('Đã tồn tại quan hệ cùng loại giữa 2 danh mục này (bao gồm danh sách đang cấu hình).');
      return;
    }
    if (createsCycle(allExisting, formData.sourceEntityId!, formData.targetEntityId!, formData.relationshipType!)) {
      setFormError('Quan hệ này tạo ra vòng lặp (Circular Dependency). Vui lòng kiểm tra lại.');
      return;
    }
    const sourceEntity = allEntities.find(e => e.id === formData.sourceEntityId);
    const targetEntity = allEntities.find(e => e.id === formData.targetEntityId);
    const newItem: EntityRelationship = {
      id: `pending-${Date.now()}`,
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
      createdDate: '',
      createdBy: 'Admin (Bạn)'
    };
    setPendingList(prev => [...prev, newItem]);
    setFormData(emptyForm);
  };

  const handleRemoveFromPending = (id: string) => {
    setPendingList(prev => prev.filter(r => r.id !== id));
  };

  const handleSaveAll = () => {
    if (pendingList.length === 0) return;
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const toSave = pendingList.map(r => ({ ...r, id: `rel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, createdDate: dateStr }));
    setRelationships([...relationships, ...toSave]);
    setPendingList([]);
  };

  return (
    <div className="space-y-5">
      {/* Form cấu hình 1 cặp quan hệ */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <Network className="w-4 h-4 text-blue-600" />
          <p className="text-[13px] font-semibold text-slate-700">Cấu hình quan hệ</p>
        </div>

        <div className="p-5 space-y-6">
          {/* 1. Chọn thực thể */}
          <div className="space-y-4 relative z-20">
            <h4 className="text-[13px] font-semibold text-slate-700 border-b border-slate-100 pb-2">1. Chọn thực thể liên kết</h4>
            <div className="grid grid-cols-2 gap-8 relative">
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Thực thể nguồn <span className="text-red-500">*</span>
                </label>
                {currentEntityId ? (
                  <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-[13px] text-slate-700 font-medium flex items-center justify-between">
                    <span>{currentEntityCode && `${currentEntityCode} - `}{currentEntityName || 'Danh mục hiện tại'}</span>
                    <span className="text-[12px] text-blue-500 font-normal ml-2 shrink-0">Danh mục hiện tại</span>
                  </div>
                ) : (
                  <SearchableSelect
                    label=""
                    options={allEntities.map(e => ({ value: e.id, label: `${e.code} - ${e.name}` }))}
                    value={formData.sourceEntityId || ''}
                    onChange={v => { setFormError(''); setFormData({ ...formData, sourceEntityId: v, sourceKey: '' }); }}
                    placeholder="-- Tìm & chọn danh mục nguồn --"
                  />
                )}
              </div>
              <SearchableSelect
                label="Thực thể đích"
                options={allEntities
                  .filter(e => e.id !== formData.sourceEntityId)
                  .map(e => ({ value: e.id, label: `${e.code} - ${e.name}` }))}
                value={formData.targetEntityId || ''}
                onChange={v => { setFormError(''); setFormData({ ...formData, targetEntityId: v, targetKey: '', targetDisplayField: '' }); }}
                placeholder="-- Tìm & chọn danh mục đích --"
              />
            </div>

            {formData.sourceEntityId && formData.targetEntityId && existingRelationsBetween.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3 text-[13px]">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900">Lưu ý: Giữa 2 danh mục này đã tồn tại {existingRelationsBetween.length} quan hệ:</p>
                  <ul className="list-disc pl-5 mt-1 text-amber-800">
                    {existingRelationsBetween.map(r => (
                      <li key={r.id}>Loại: <b>{relationTypeLabels[r.relationshipType]}</b> — {r.sourceKey} ↔ {r.targetKey}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {formData.sourceEntityId && formData.targetEntityId && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-[13px]">A</div>
                  <span className="text-[13px] font-semibold text-slate-800 text-center">{allEntities.find(e => e.id === formData.sourceEntityId)?.name}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-[13px]">B</div>
                  <span className="text-[13px] font-semibold text-slate-800 text-center">{allEntities.find(e => e.id === formData.targetEntityId)?.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Loại quan hệ */}
          <div className="space-y-3 relative z-10">
            <h4 className="text-[13px] font-semibold text-slate-700 border-b border-slate-100 pb-2">2. Loại quan hệ</h4>
            <select
              title="Chọn loại quan hệ"
              value={formData.relationshipType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, relationshipType: e.target.value as RelationshipType })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[13px] bg-white"
            >
              {Object.entries(relationTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* 3. Điều kiện liên kết */}
          <div className="space-y-3 relative z-0">
            <h4 className="text-[13px] font-semibold text-slate-700 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>3. Điều kiện liên kết</span>
              {(!formData.sourceEntityId || !formData.targetEntityId) && (
                <span className="text-[13px] text-orange-600 bg-orange-50 font-normal px-2 py-1 rounded border border-orange-100">
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
                  <div className="grid grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-2 gap-5">
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
                      <select title="Chọn trường hiển thị" value={formData.targetDisplayField || ''} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, targetDisplayField: e.target.value })} className="w-full max-w-xs px-3 py-2 border border-emerald-200 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono">
                        <option value="">-- Không chọn --</option>
                        {targetAttributes.map(attr => <option key={attr.id} value={attr.name}>{attr.name} ({attr.displayName})</option>)}
                      </select>
                      <p className="text-[13px] text-slate-500 flex-1 leading-relaxed">
                        <Info className="w-3 h-3 inline mr-1 text-slate-400" />
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

          {/* Lỗi validation */}
          {formError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[13px] text-red-600">{formError}</p>
            </div>
          )}
        </div>

        {/* Nút thêm vào danh sách */}
        {!isViewOnly && (
          <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              onClick={handleAddToPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] font-medium active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Thêm vào danh sách
            </button>
          </div>
        )}
      </div>

      {/* Danh sách quan hệ đang cấu hình (pending) */}
      {(pendingList.length > 0 || !isViewOnly) && (
        <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${pendingList.length > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
              <p className="text-[13px] font-semibold text-slate-700">
                Danh sách quan hệ đang cấu hình
              </p>
              {pendingList.length > 0 && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[13px] font-semibold rounded-full">{pendingList.length}</span>
              )}
            </div>
            {pendingList.length > 0 && !isViewOnly && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setApprovalRequestData({ id: `batch-${Date.now()}`, code: 'BATCH', name: `${pendingList.length} quan hệ mới`, type: 'attribute' });
                    setApprovalRequestForm({ reviewer: '', note: '' });
                    setShowApprovalModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-[13px] font-medium active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  Lưu tất cả & trình duyệt
                </button>
                <button
                  onClick={handleSaveAll}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] font-medium active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  Lưu tất cả ({pendingList.length})
                </button>
              </div>
            )}
          </div>

          {pendingList.length === 0 ? (
            <div className="px-5 py-8 text-center text-[13px] text-slate-400">
              Chưa có quan hệ nào trong danh sách. Cấu hình và nhấn <b>Thêm vào danh sách</b> để bắt đầu.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingList.map((rel, idx) => {
                const sourceEntity = allEntities.find(e => e.id === rel.sourceEntityId);
                const targetEntity = allEntities.find(e => e.id === rel.targetEntityId);
                return (
                  <div key={rel.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                    {/* Index */}
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[13px] font-bold flex items-center justify-center shrink-0">{idx + 1}</span>

                    {/* Entities */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-[13px] font-semibold text-slate-800 truncate">{sourceEntity?.name || rel.sourceEntityId}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-[13px] font-semibold text-slate-800 truncate">{targetEntity?.name || rel.targetEntityId}</span>
                    </div>

                    {/* Relation type badge */}
                    <span className={`px-2 py-0.5 rounded border text-[13px] font-semibold shrink-0 ${relationTypeColors[rel.relationshipType]}`}>
                      {rel.relationshipType}
                    </span>

                    {/* Key info */}
                    <span className="text-[13px] text-slate-500 font-mono shrink-0">
                      {rel.relationshipType === 'n-n'
                        ? rel.mappingTable
                        : `${rel.sourceKey} ↔ ${rel.targetKey}`
                      }
                    </span>

                    {/* Remove */}
                    {!isViewOnly && (
                      <button
                        onClick={() => handleRemoveFromPending(rel.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        title="Xóa khỏi danh sách"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
            setGenericConfirm({ isOpen: true, type: 'warning', title: 'Lỗi xác thực', subtitle: 'Thiếu thông tin', message: 'Vui lòng chọn Người phê duyệt!', confirmText: 'Đóng', onConfirm: () => setGenericConfirm(null) });
            return;
          }
          handleSaveAll();
          setShowApprovalModal(false);
          setTimeout(() => {
            setGenericConfirm({ isOpen: true, type: 'success', title: 'Thành công', subtitle: '', message: 'Đã gửi yêu cầu trình duyệt thành công!', confirmText: 'Đóng', onConfirm: () => setGenericConfirm(null) });
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);
  const filteredOptions = options.filter(o => o.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <div
        className={`w-full px-3 py-2 border rounded-lg flex items-center justify-between cursor-pointer bg-white text-[13px] transition-colors
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-300 hover:border-slate-400'}`}
        onClick={() => { setIsOpen(!isOpen); setSearchTerm(''); }}
      >
        <span className={selectedOption ? 'text-slate-800 font-medium' : 'text-slate-400'}>
          {selectedOption ? selectedOption.label : (placeholder || '-- Chọn --')}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
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
