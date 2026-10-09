import React, { useState, useRef, useEffect, ReactNode, ChangeEvent, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { Network, ArrowRight, Key, Table, Search, AlertCircle, Info, ChevronDown, Plus, Trash2, SquarePen, CheckCircle2, Send, Eye } from 'lucide-react';
import { MasterDataEntity, EntityRelationship, RelationshipType, RelationshipStatus, FieldDataType } from '../../categoryTypes';
import { ConfirmModal } from '../../../../common/ConfirmModal';
import { BaseModal } from '../../../../common/BaseModal';
import { approvers } from '../../categoryConstants';
import { ApprovalRequestModal } from '../modals/ApprovalRequestModal';
import { Badge, TruncatedText, RowIconAction, BTN_PRIMARY, BTN_OUTLINE, INPUT_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, normalizeSearch } from '../../../collection/collectionUi';

interface RelationshipsTabProps {
  entities: MasterDataEntity[];
  relationships: EntityRelationship[];
  setRelationships: (relationships: EntityRelationship[]) => void;
  isViewOnly?: boolean;
  /** Chỉ xem quan hệ (trang Thiết lập danh mục): ẩn nút "Thêm mới quan hệ", thao tác chỉ có icon con mắt xem chi tiết */
  readOnlyRelations?: boolean;
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

// Màu badge theo loại quan hệ (variant của Badge chuẩn)
const relationTypeVariants: Record<RelationshipType, string> = {
  '1-n': 'blue',
  'n-1': 'indigo',
  'n-n': 'purple',
  '1-1': 'emerald',
};

// Tiêu đề nhóm trong form modal
const GROUP_TITLE = 'text-[14px] font-medium text-[#020817] border-b border-[#E2E8F0] pb-2';
const HELP_TEXT = 'text-[13px] text-[#64748B] mt-1';
// Bảng chuẩn (mục 5.3)
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';

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
  relationshipType: 'n-1',
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
  readOnlyRelations = false,
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
  // gridSearchInput: giá trị đang gõ; gridSearchTerm: giá trị đã áp dụng (khi bấm Tìm kiếm / Enter)
  const [gridSearchInput, setGridSearchInput] = useState('');
  const [gridSearchTerm, setGridSearchTerm] = useState('');
  const runGridSearch = () => setGridSearchTerm(gridSearchInput);
  const [showRelApproval, setShowRelApproval] = useState(false);
  const [relApprovalForm, setRelApprovalForm] = useState({ reviewer: '', note: '' });

  // Xem chi tiết quan hệ (chỉ đọc)
  const [viewingRelation, setViewingRelation] = useState<EntityRelationship | null>(null);

  const handleViewRelationship = (rel: EntityRelationship) => {
    setViewingRelation(rel);
  };

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
      relationshipType: 'n-1',
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

  const handleValidateAndOpenApproval = () => {
    setFormError('');
    if (!formData.sourceEntityId || !formData.targetEntityId) { setFormError('Vui lòng chọn đầy đủ thực thể nguồn và thực thể đích.'); return; }
    if (formData.sourceEntityId === formData.targetEntityId) { setFormError('Thực thể nguồn và thực thể đích phải khác nhau.'); return; }
    if (formData.relationshipType === 'n-n') {
      if (!formData.mappingTable || !formData.sourceKey || !formData.targetKey) { setFormError('Quan hệ n-n cần có đầy đủ: Bảng liên kết, Khóa ngoại nguồn, Khóa ngoại đích.'); return; }
    } else {
      if (!formData.sourceKey || !formData.targetKey) { setFormError('Cần khai báo đầy đủ Khóa nguồn và Khóa đích.'); return; }
    }
    const hasDuplicate = localRelationships.some(r => r.id !== (editingRelation?.id || '') && r.sourceEntityId === formData.sourceEntityId && r.targetEntityId === formData.targetEntityId && r.relationshipType === formData.relationshipType);
    if (hasDuplicate) { setFormError('Đã tồn tại quan hệ cùng loại giữa 2 danh mục này.'); return; }
    if (createsCycle(localRelationships.filter(r => r.id !== (editingRelation?.id || '')), formData.sourceEntityId!, formData.targetEntityId!, formData.relationshipType!)) { setFormError('Quan hệ này tạo ra vòng lặp (Circular Dependency). Vui lòng kiểm tra lại.'); return; }
    setShowRelApproval(true);
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
          <div className="text-[#64748B]">Xóa quan hệ giữa:</div>
          <div className="font-medium text-[#020817]">
            {rel.sourceEntityName} ↔ {rel.targetEntityName}
          </div>
          <div className="text-[#64748B] mt-1">Loại quan hệ: {relationTypeLabels[rel.relationshipType]}</div>
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

    const search = normalizeSearch(gridSearchTerm);
    if (search) {
      const sourceEntity = allEntities.find(e => e.id === rel.sourceEntityId);
      const targetEntity = allEntities.find(e => e.id === rel.targetEntityId);
      return [sourceEntity?.name, targetEntity?.name, rel.sourceKey, rel.targetKey, rel.mappingTable]
        .some(v => normalizeSearch(v || '').includes(search));
    }
    return true;
  });

  return (
    <>
    <div className="space-y-4">
      {/* Category selector & control block */}
      <div className="bg-white p-4 border border-[#E2E8F0] rounded-2xl">
        <label className={LABEL_CLS}>
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
                setGridSearchInput('');
                setGridSearchTerm('');
              }}
              placeholder="-- Chọn danh mục --"
              disabled={!!currentEntityId}
              viewOnly={isViewOnly}
            />
          </div>

          {(!currentEntityId || !readOnlyRelations) && (
            <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
              {!currentEntityId && (
                <div className="w-full md:w-80 flex items-center gap-1.5">
                  <input
                    type="text"
                    aria-label="Tìm kiếm quan hệ"
                    placeholder="Tìm kiếm quan hệ..."
                    value={gridSearchInput}
                    onChange={(e) => setGridSearchInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') runGridSearch(); }}
                    className={SEARCH_INPUT_CLS}
                  />
                  <button
                    type="button"
                    aria-label="Tìm kiếm"
                    title="Tìm kiếm"
                    onClick={runGridSearch}
                    className={SEARCH_BTN_CLS}
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              )}
              {!readOnlyRelations && (
                <button
                  type="button"
                  onClick={handleAddRelationship}
                  className={`${BTN_PRIMARY} whitespace-nowrap`}
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
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        {filteredRelations.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <Network className="w-12 h-12 text-[#CBD5E1] mb-3 stroke-[1.5]" />
            <p className="text-[13px] font-medium text-[#020817]">Chưa có quan hệ nào</p>
            <p className="text-[13px] text-[#64748B] mt-1 max-w-sm">Danh mục này hiện chưa được cấu hình liên kết với danh mục nào khác.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse collection-table text-[13px]">
              <thead className="bg-[#F8FAFC]">
                <tr className="h-[42px] border-b border-[#E0E0E0]">
                  <th className={`${TH} text-center w-14`}>STT</th>
                  <th className={`${TH} text-left`}>Danh mục Nguồn</th>
                  <th className={`${TH} text-left`}>Khóa Nguồn</th>
                  <th className={`${TH} text-left w-24`}>Loại</th>
                  <th className={`${TH} text-left`}>Danh mục Đích</th>
                  <th className={`${TH} text-left`}>Khóa Đích</th>
                  <th className={`${TH} text-left`}>Trường hiển thị</th>
                  <th className={`${TH} text-center w-[100px]`}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredRelations.map((rel, idx) => {
                  const sourceEntity = allEntities.find(e => e.id === rel.sourceEntityId);
                  const targetEntity = allEntities.find(e => e.id === rel.targetEntityId);
                  const isSourceSelected = rel.sourceEntityId === selectedEntityId;
                  const displayValue = rel.relationshipType === 'n-n' ? (rel.mappingTable || '') : (rel.targetDisplayField || '');

                  return (
                    <tr key={rel.id} className="h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                      <td className={`${TD} text-center`}>{idx + 1}</td>
                      <td className={`${TD} max-w-[260px]`}>
                        <TruncatedText
                          text={sourceEntity?.name || rel.sourceEntityId}
                          className={isSourceSelected ? 'text-blue-600' : 'text-black'}
                        />
                      </td>
                      <td className={`${TD} max-w-[200px]`}><TruncatedText text={rel.sourceKey || '--'} /></td>
                      <td className={TD}>
                        <Badge label={rel.relationshipType} variant={relationTypeVariants[rel.relationshipType]} />
                      </td>
                      <td className={`${TD} max-w-[260px]`}>
                        <TruncatedText
                          text={targetEntity?.name || rel.targetEntityId}
                          className={!isSourceSelected ? 'text-blue-600' : 'text-black'}
                        />
                      </td>
                      <td className={`${TD} max-w-[200px]`}><TruncatedText text={rel.targetKey || '--'} /></td>
                      <td className={`${TD} max-w-[220px]`}>
                        {displayValue
                          ? <TruncatedText text={displayValue} />
                          : <span className="text-[#64748B]">--</span>}
                      </td>

                      <td className={`${TD} text-center`}>
                        <div className="flex items-center justify-center gap-1">
                          {readOnlyRelations ? (
                            <RowIconAction label="Xem chi tiết quan hệ" onClick={() => handleViewRelationship(rel)}>
                              <Eye className="w-4 h-4" />
                            </RowIconAction>
                          ) : (
                            <>
                              <RowIconAction label="Chỉnh sửa quan hệ" onClick={() => handleEditRelationship(rel)}>
                                <SquarePen className="w-4 h-4" />
                              </RowIconAction>
                              <RowIconAction label="Xóa quan hệ" onClick={() => handleDeleteRelation(rel)}>
                                <Trash2 className="w-4 h-4" />
                              </RowIconAction>
                            </>
                          )}
                        </div>
                      </td>
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
              type="button"
              onClick={() => setIsModalOpen(false)}
              className={BTN_OUTLINE}
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={readOnlyRelations ? handleValidateAndOpenApproval : handleSaveRelation}
              className={BTN_PRIMARY}
            >
              {readOnlyRelations ? (
                <>
                  <Send className="w-4 h-4" />
                  Gửi duyệt cấu trúc
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Lưu quan hệ
                </>
              )}
            </button>
          </div>
        }
      >
        <div className="space-y-6 text-left">
          {/* 1. Chọn thực thể */}
          <div className="space-y-4">
            <h4 className={GROUP_TITLE}>1. Chọn thực thể liên kết</h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={LABEL_CLS}>
                  Thực thể nguồn <span className={REQUIRED_MARK}>*</span>
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
                <label className={LABEL_CLS}>
                  Thực thể đích <span className={REQUIRED_MARK}>*</span>
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
              <RelationDiagram
                sourceName={allEntities.find(e => e.id === formData.sourceEntityId)?.name || ''}
                targetName={allEntities.find(e => e.id === formData.targetEntityId)?.name || ''}
              />
            )}
          </div>

          {/* 2. Loại quan hệ */}
          <div className="space-y-3">
            <h4 className={GROUP_TITLE}>2. Loại quan hệ</h4>
            <div>
              <label className={LABEL_CLS}>Loại liên kết <span className={REQUIRED_MARK}>*</span></label>
              <select
                title="Chọn loại quan hệ"
                value={formData.relationshipType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, relationshipType: e.target.value as RelationshipType })}
                className={`${INPUT_CLS} cursor-pointer`}
              >
                {Object.entries(relationTypeLabels)
                  .filter(([value]) => value !== '1-n')
                  .map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* 3. Điều kiện liên kết */}
          <div className="space-y-3">
            <h4 className={`${GROUP_TITLE} flex items-center justify-between gap-3`}>
              <span>3. Điều kiện liên kết</span>
              {(!formData.sourceEntityId || !formData.targetEntityId) && (
                <span className="text-[13px] text-[#D97706] bg-[#FFF7ED] font-normal px-2 py-0.5 rounded-lg border border-[#FED7AA]">
                  Chọn xong thực thể để tải danh sách trường
                </span>
              )}
            </h4>

            {(formData.sourceEntityId && formData.targetEntityId) ? (
              formData.relationshipType === 'n-n' ? (
                <div className="rounded-2xl border border-[#E2E8F0] p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-blue-600" />
                    <span className="text-[14px] font-medium text-[#020817]">Bảng liên kết (Mapping Table)</span>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Tên bảng liên kết <span className={REQUIRED_MARK}>*</span></label>
                    <input
                      type="text"
                      value={formData.mappingTable || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, mappingTable: e.target.value })}
                      placeholder="VD: tbl_map_citizen_organization"
                      className={INPUT_CLS}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={LABEL_CLS}>Khoá ngoại Nguồn <span className={REQUIRED_MARK}>*</span></label>
                      <input type="text" value={formData.sourceKey || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, sourceKey: e.target.value })} placeholder="VD: citizen_id" className={INPUT_CLS} />
                      <p className={HELP_TEXT}>Trường FK của {allEntities.find(e => e.id === formData.sourceEntityId)?.name}</p>
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Khoá ngoại Đích <span className={REQUIRED_MARK}>*</span></label>
                      <input type="text" value={formData.targetKey || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, targetKey: e.target.value })} placeholder="VD: organization_id" className={INPUT_CLS} />
                      <p className={HELP_TEXT}>Trường FK của {allEntities.find(e => e.id === formData.targetEntityId)?.name}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#E2E8F0] p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-600" />
                    <span className="text-[14px] font-medium text-[#020817]">Khóa ngoại (Foreign Key)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={LABEL_CLS}>Khóa nguồn <span className={REQUIRED_MARK}>*</span></label>
                      <select title="Chọn trường nguồn" value={formData.sourceKey || ''} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, sourceKey: e.target.value })} className={`${INPUT_CLS} cursor-pointer`}>
                        <option value="" disabled hidden>-- Chọn trường nguồn --</option>
                        {sourceAttributes.map(attr => <option key={attr.id} value={attr.name}>{attr.name} ({attr.displayName})</option>)}
                      </select>
                      <p className={HELP_TEXT}>Trường trong danh mục Nguồn</p>
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Khóa đích <span className={REQUIRED_MARK}>*</span></label>
                      <select title="Chọn trường đích" value={formData.targetKey || ''} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, targetKey: e.target.value })} className={`${INPUT_CLS} cursor-pointer`}>
                        <option value="" disabled hidden>-- Chọn trường đích --</option>
                        {targetAttributes.map(attr => <option key={attr.id} value={attr.name}>{attr.name} ({attr.displayName})</option>)}
                      </select>
                      <p className={HELP_TEXT}>Trường dùng để join (thường là ID/Code)</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#E2E8F0]">
                    <label className={LABEL_CLS}>
                      Trường hiển thị (Lookup Display Field) <span className="text-[#64748B] font-normal">(Không bắt buộc)</span>
                    </label>
                    <div className="flex gap-4 items-start">
                      <select title="Chọn trường hiển thị" value={formData.targetDisplayField || ''} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, targetDisplayField: e.target.value })} className={`${INPUT_CLS} max-w-xs cursor-pointer`}>
                        <option value="">-- Không chọn --</option>
                        {targetAttributes.map(attr => <option key={attr.id} value={attr.name}>{attr.name} ({attr.displayName})</option>)}
                      </select>
                      <p className="text-[13px] text-[#64748B] flex-1 leading-relaxed">
                        <Info className="w-4 h-4 inline mr-1 text-[#155DFC] -mt-0.5 shrink-0" />
                        Trường hiển thị thay cho mã khóa ngoại (VD: <b className="font-medium text-[#020817]">Tên tổ chức</b> thay vì ID).
                      </p>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="bg-[#F8FAFC] border border-dashed border-[#E2E8F0] rounded-lg p-6 text-center text-[13px] text-[#64748B]">
                Hãy chọn thực thể nguồn và đích ở Bước 1 để cấu hình khóa liên kết
              </div>
            )}
          </div>



          {/* Validation error */}
          {formError && (
            <div className="flex items-start gap-2 p-3 bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg">
              <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#B91C1C]">{formError}</p>
            </div>
          )}
        </div>
      </BaseModal>

      {/* Xem chi tiết quan hệ (chỉ đọc) */}
      <BaseModal
        isOpen={!!viewingRelation}
        onClose={() => setViewingRelation(null)}
        title="Chi tiết quan hệ danh mục"
        subtitle="Chế độ chỉ xem"
        footer={
          <div className="flex justify-end w-full">
            <button
              type="button"
              onClick={() => setViewingRelation(null)}
              className={BTN_OUTLINE}
            >
              Đóng
            </button>
          </div>
        }
      >
        {viewingRelation && (() => {
          const srcEntity = allEntities.find(e => e.id === viewingRelation.sourceEntityId);
          const tgtEntity = allEntities.find(e => e.id === viewingRelation.targetEntityId);
          const isNn = viewingRelation.relationshipType === 'n-n';
          const srcName = srcEntity?.name || viewingRelation.sourceEntityName || viewingRelation.sourceEntityId;
          const tgtName = tgtEntity?.name || viewingRelation.targetEntityName || viewingRelation.targetEntityId;
          const fields: { label: string; value: string }[] = [
            { label: 'Danh mục Nguồn', value: srcName },
            { label: 'Danh mục Đích', value: tgtName },
            { label: 'Loại quan hệ', value: relationTypeLabels[viewingRelation.relationshipType] },
            { label: isNn ? 'Bảng liên kết' : 'Trường hiển thị', value: (isNn ? viewingRelation.mappingTable : viewingRelation.targetDisplayField) || '-' },
            { label: isNn ? 'Khóa ngoại Nguồn' : 'Khóa Nguồn', value: viewingRelation.sourceKey || '-' },
            { label: isNn ? 'Khóa ngoại Đích' : 'Khóa Đích', value: viewingRelation.targetKey || '-' },
          ];
          return (
            <div className="space-y-5 text-left">
              {/* Sơ đồ nguồn → đích */}
              <RelationDiagram sourceName={srcName} targetName={tgtName} />

              {/* Danh sách trường (chỉ đọc) */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {fields.map(f => (
                  <div key={f.label} className="space-y-1 min-w-0">
                    <div className={FIELD_LABEL}>{f.label}</div>
                    <div className={`${FIELD_VALUE} break-words`}>{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
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

    {createPortal(
      <ApprovalRequestModal
        isOpen={showRelApproval}
        onClose={() => setShowRelApproval(false)}
        data={{ id: '', code: currentEntityCode || '', name: currentEntityName || '', type: 'version' }}
        approvers={approvers}
        form={relApprovalForm}
        setForm={setRelApprovalForm}
        onSubmit={() => {
          handleSaveRelation();
          setShowRelApproval(false);
          setRelApprovalForm({ reviewer: '', note: '' });
        }}
      />,
      document.body
    )}
    </>
  );
}

// Sơ đồ nguồn (A) → đích (B) dùng trong modal thêm/sửa và xem chi tiết
function RelationDiagram({ sourceName, targetName }: { sourceName: string; targetName: string }) {
  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-medium text-[13px] shrink-0">A</div>
        <TruncatedText text={sourceName} className="text-[13px] font-medium text-[#020817] text-center w-full" />
      </div>
      <ArrowRight className="w-5 h-5 text-[#94A3B8] shrink-0" />
      <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
        <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-medium text-[13px] shrink-0">B</div>
        <TruncatedText text={targetName} className="text-[13px] font-medium text-[#020817] text-center w-full" />
      </div>
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
  // Chế độ Xem chi tiết: ô disabled dùng nền #F0F0F0, chữ đen (đồng bộ VIEW_FIELD_CLS)
  viewOnly?: boolean;
}

function SearchableSelect({ label, placeholder, options, value, onChange, disabled = false, viewOnly = false }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement | null>(null);

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
  const filteredOptions = options.filter(o => normalizeSearch(o.label).includes(normalizeSearch(searchTerm)));

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {label && (
        <label className={LABEL_CLS}>
          {label} <span className={REQUIRED_MARK}>*</span>
        </label>
      )}
      <div
        className={`w-full h-10 px-3 border rounded-lg flex items-center justify-between gap-2 text-[13px] transition-colors
          ${disabled
            ? (viewOnly ? 'cursor-not-allowed bg-[#F0F0F0] !border-[rgba(0,0,0,0.26)] text-[#000000]' : 'cursor-not-allowed bg-[#F0F0F0] border-[#E2E8F0] text-[#94A3B8]')
            : 'cursor-pointer bg-white hover:border-[#94A3B8]'}
          ${isOpen && !disabled ? 'border-[#E2E8F0] ring-2 ring-blue-600' : 'border-[#E2E8F0]'}`}
        onClick={() => { if (!disabled) { setIsOpen(!isOpen); setSearchTerm(''); } }}
      >
        <span className={`truncate ${selectedOption ? (disabled ? (viewOnly ? 'text-[#000000]' : 'text-[#94A3B8]') : 'text-[#020817]') : 'text-[#94A3B8]'}`}>
          {selectedOption ? selectedOption.label : (placeholder || '-- Chọn --')}
        </span>
        <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-xl z-[9999] overflow-hidden">
          <div className="p-2 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-2">
            <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <input
              type="text"
              aria-label="Tìm kiếm danh mục"
              className="w-full bg-transparent text-[13px] text-[#020817] focus:outline-none placeholder:text-[#94A3B8]"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              onClick={(e: MouseEvent<HTMLInputElement>) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="max-h-52 overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  className={`px-3 py-2 text-[13px] cursor-pointer transition-colors
                    ${option.value === value ? 'bg-[#EAF3FF] text-[#155DFC] font-medium' : 'text-[#020817] hover:bg-[#F1F5F9]'}`}
                  onClick={() => { onChange(option.value); setIsOpen(false); }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-[13px] text-[#64748B] text-center">Không tìm thấy kết quả</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
