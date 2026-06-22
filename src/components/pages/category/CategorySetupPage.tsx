import React, { useState, useEffect, ChangeEvent, ReactNode } from 'react';
import {
  Settings, Sliders, Link2, CheckSquare, Clock
} from 'lucide-react';

// Types & Constants
import {
  MasterDataEntity, MasterDataAttribute, EntityRelationship, ApprovalRequest,
  TabType, LifecycleStatus, DataType, ScopeType, DataSourceType, FieldDataType, ApprovalType, ApprovalStatus
} from './categoryTypes';
import {
  defaultEntities, dataTypeLabels, lifecycleLabels, approvalTypeLabels, approvalStatusLabels, approvers
} from './categoryConstants';

// Components - Tabs
import { SetupTab } from './components/tabs/SetupTab';
import { AttributesTab } from './components/tabs/AttributesTab';
import { RelationshipsTab } from './components/tabs/RelationshipsTab';
import { ApprovalTab } from './components/tabs/ApprovalTab';
import { VersionHistoryTab } from './components/tabs/VersionHistoryTab';

// Components - Modals
import { CategoryWizardModal } from './components/modals/CategoryWizardModal';
import { EditCategoryModal } from './components/modals/EditCategoryModal';
import { AttributeFormModal } from './components/modals/AttributeFormModal';
import { ApprovalRequestModal } from './components/modals/ApprovalRequestModal';
import { ConfirmModal } from '../../common/ConfirmModal';
import { PublishModal } from './components/modals/PublishModal';
import { UnpublishModal } from './components/modals/UnpublishModal';
import { RestoreVersionModal } from './components/modals/RestoreVersionModal';
import { ReviewApprovalModal } from './components/modals/ReviewApprovalModal';
import { SimpleApproveModal } from './components/modals/SimpleApproveModal';
import { SimpleRejectModal } from './components/modals/SimpleRejectModal';
import { ExpireRequestModal } from './components/modals/ExpireRequestModal';
import { ExpireApproveModal } from './components/modals/ExpireApproveModal';
import { Portal } from '../../common/Portal';

export const CategorySetupPage = ({ userRole = 'leader' }: { userRole?: string }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('setup');

  // Entities & Attributes State
  const [entities, setEntities] = useState<MasterDataEntity[]>(defaultEntities);
  const [attributes, setAttributes] = useState<MasterDataAttribute[]>([
    { id: 'a1', fieldName: 'citizen_id', displayName: 'Số CCCD', dataType: 'string', required: true, unique: true, indexed: true, length: 12, description: 'Số căn cước công dân 12 số', version: 1, status: 'approved', createdDate: '01/01/2024' },
    { id: 'a2', fieldName: 'full_name', displayName: 'Họ và tên', dataType: 'string', required: true, unique: false, indexed: true, length: 100, description: 'Họ và tên đầy đủ', version: 1, status: 'approved', createdDate: '01/01/2024' },
  ]);
  const [relationships, setRelationships] = useState<EntityRelationship[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('1');

  // Form & Modal States
  const [showWizard, setShowWizard] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardEntityId, setWizardEntityId] = useState<string | null>(null);
  const [editingEntity, setEditingEntity] = useState<MasterDataEntity | null>(null);
  const [formData, setFormData] = useState<Partial<MasterDataEntity>>({
    name: '',
    dataType: 'standard',
    managingAgency: '',
    scope: 'national',
    description: ''
  });

  // Other States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<LifecycleStatus | 'all'>('all');
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<MasterDataAttribute | null>(null);
  const [attributeFormData, setAttributeFormData] = useState<Partial<MasterDataAttribute>>({});
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [approvalTab, setApprovalTab] = useState<ApprovalType>('category');
  const [requests, setRequests] = useState<ApprovalRequest[]>([
    {
      id: '1', type: 'category', entityId: '1', entityCode: 'DM-GIOITINH',
      entityName: 'Dữ liệu Danh mục giới tính', requestedBy: 'Nguyễn Văn A',
      requestedDate: '20/12/2024 14:30', status: 'pending'
    },
    {
      id: '2', type: 'category', entityId: '2', entityCode: 'DM-DANTOC',
      entityName: 'Dữ liệu Danh mục và mã các dân tộc', requestedBy: 'Trần Thị B',
      requestedDate: '18/12/2024 10:15', status: 'pending'
    },
    {
      id: '3', type: 'structure', entityId: '3', entityCode: 'DM-QUOCGIA',
      entityName: 'Dữ liệu Danh mục và mã Quốc gia, Quốc tịch', requestedBy: 'Lê Minh C',
      requestedDate: '15/12/2024 09:00', status: 'approved',
      reviewedBy: 'Giám đốc Nguyễn X', reviewedDate: '16/12/2024'
    },
    {
      id: '4', type: 'category', entityId: '4', entityCode: 'DM-TONGIAO',
      entityName: 'Dữ liệu Danh mục và mã các Tôn giáo', requestedBy: 'Phạm Văn D',
      requestedDate: '14/12/2024 11:30', status: 'approved',
      reviewedBy: 'Trưởng phòng Trần Y', reviewedDate: '15/12/2024'
    },
    {
      id: '5', type: 'structure', entityId: '5', entityCode: 'DM-COQUAN',
      entityName: 'Dữ liệu Danh mục cơ quan', requestedBy: 'Ngô Thị E',
      requestedDate: '12/12/2024 16:45', status: 'rejected',
      reviewedBy: 'Giám đốc Lê Z', reviewedDate: '13/12/2024',
      comments: 'Thiếu trường mã số định danh bắt buộc'
    },
    {
      id: '6', type: 'category', entityId: '6', entityCode: 'DM-HC',
      entityName: 'Dữ liệu Danh mục đơn vị hành chính', requestedBy: 'Hoàng Văn F',
      requestedDate: '10/12/2024 08:30', status: 'pending'
    },
    {
      id: '7', type: 'structure', entityId: '7', entityCode: 'DM-QUANHEGD',
      entityName: 'Dữ liệu Danh mục và mã mối quan hệ trong gia đình', requestedBy: 'Vũ Thị G',
      requestedDate: '08/12/2024 13:00', status: 'approved',
      reviewedBy: 'Trưởng phòng Nguyễn A', reviewedDate: '09/12/2024'
    },
    {
      id: '8', type: 'category', entityId: '8', entityCode: 'DM-GTTT',
      entityName: 'Dữ liệu Danh mục mã giấy tờ tùy thân', requestedBy: 'Đặng Minh H',
      requestedDate: '06/12/2024 10:00', status: 'pending'
    },
    {
      id: '9', type: 'structure', entityId: '1', entityCode: 'DM-GIOITINH',
      entityName: 'Dữ liệu Danh mục giới tính', requestedBy: 'Bùi Thị I',
      requestedDate: '04/12/2024 15:20', status: 'rejected',
      reviewedBy: 'Giám đốc Trần B', reviewedDate: '05/12/2024',
      comments: 'Cấu trúc dữ liệu không phù hợp với tiêu chuẩn'
    },
    {
      id: '10', type: 'category', entityId: '2', entityCode: 'DM-DANTOC',
      entityName: 'Dữ liệu Danh mục và mã các dân tộc', requestedBy: 'Tô Văn J',
      requestedDate: '02/12/2024 09:45', status: 'pending'
    },
    {
      id: '11', type: 'version', entityId: '1', entityCode: 'DM-GIOITINH',
      entityName: 'Dữ liệu Danh mục giới tính', requestedBy: 'Lý Quốc K',
      requestedDate: '01/12/2024 10:10', status: 'pending',
      changes: { prevVersion: 1, currentVersion: 2, impactCount: 3 }
    },
    {
      id: '12', type: 'relationship', entityId: '7', entityCode: 'DM-QUANHEGD',
      entityName: 'Dữ liệu Danh mục và mã mối quan hệ trong gia đình', requestedBy: 'Đỗ Văn P',
      requestedDate: '30/11/2024 09:12', status: 'pending',
      changes: { targetEntity: 'Dữ liệu Danh mục giới tính', relationshipType: '1-1', sourceKey: 'id', targetKey: 'gioitinh_id' }
    },
    {
      id: '13', type: 'expire', entityId: '3', entityCode: 'DM-QUOCGIA',
      entityName: 'Dữ liệu Danh mục và mã Quốc gia, Quốc tịch', requestedBy: 'Trần Văn X',
      requestedDate: '25/12/2024 08:30', status: 'pending',
      comments: 'Ngừng sử dụng từ 01/01/2025. Lý do: Tích hợp vào danh mục khác.'
    },
    {
      id: '14', type: 'expire', entityId: '5', entityCode: 'DM-COQUAN',
      entityName: 'Dữ liệu Danh mục cơ quan', requestedBy: 'Lê Thị Y',
      requestedDate: '20/12/2024 14:00', status: 'approved',
      reviewedBy: 'Giám đốc Nguyễn Z', reviewedDate: '21/12/2024',
      comments: 'Đồng ý ngừng sử dụng, đã kiểm tra không còn ràng buộc khóa ngoại.'
    },
    {
      id: '15', type: 'expire', entityId: '4', entityCode: 'DM-TONGIAO',
      entityName: 'Dữ liệu Danh mục và mã các Tôn giáo', requestedBy: 'Phạm Minh T',
      requestedDate: '18/12/2024 10:15', status: 'rejected',
      reviewedBy: 'Phó Giám đốc Trần B', reviewedDate: '19/12/2024',
      comments: 'Từ chối do danh mục vẫn đang được sử dụng ở 2 hệ thống vệ tinh.'
    }
  ]);
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'all'>('all');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalRequestData, setApprovalRequestData] = useState<{ id: string; code: string; name: string; type: 'category' | 'structure' | 'attribute' | 'relationship' | 'expire' } | null>(null);
  const [pendingApprovalData, setPendingApprovalData] = useState<any>(null);
  const [approvalRequestForm, setApprovalRequestForm] = useState({ reviewer: '', note: '' });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState<ApprovalRequest[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<MasterDataEntity | null>(null);
  const [showDeleteAttributeModal, setShowDeleteAttributeModal] = useState(false);
  const [attributeToDeleteId, setAttributeToDeleteId] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [entityToPublish, setEntityToPublish] = useState<MasterDataEntity | null>(null);
  const [publishNote, setPublishNote] = useState('');
  const [publishedEntities, setPublishedEntities] = useState<string[]>(['1', '2']);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [unpublishNote, setUnpublishNote] = useState('');
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<any>(null);
  const [restoreNote, setRestoreNote] = useState('');
  const [restoreApprover, setRestoreApprover] = useState('');
  const [showSimpleApproveModal, setShowSimpleApproveModal] = useState(false);
  const [showSimpleRejectModal, setShowSimpleRejectModal] = useState(false);
  const [entityForAction, setEntityForAction] = useState<MasterDataEntity | null>(null);
  
  // States cho Hết hiệu lực
  const [showExpireRequestModal, setShowExpireRequestModal] = useState(false);
  const [expireEntity, setExpireEntity] = useState<MasterDataEntity | null>(null);
  const [showExpireApproveModal, setShowExpireApproveModal] = useState(false);

  // Generic Confirm Modal for Submits & Quick Actions
  const [genericConfirm, setGenericConfirm] = useState<{
    isOpen: boolean;
    type: 'success' | 'info' | 'warning' | 'delete';
    title: string;
    subtitle: string;
    message: ReactNode;
    confirmText: string;
    onConfirm: () => void;
  } | null>(null);

  // --------------------------------------------------------------------------------
  // Hành động - Sửa và Thêm mới (Đã tách biệt)
  // --------------------------------------------------------------------------------

  // Hành động Xem chi tiết
  const handleView = (entity: MasterDataEntity) => {
    setEditingEntity(entity);
    setFormData(entity);
    setWizardEntityId(entity.id);
    setWizardStep(1);
    setIsViewMode(true);
    setShowWizard(true);
  };

  // Hành động Sửa: Dùng chung Wizard với Thêm mới
  const handleEdit = (entity: MasterDataEntity) => {
    setEditingEntity(entity);
    setFormData(entity);
    setWizardEntityId(entity.id);
    setWizardStep(1);
    setIsViewMode(false);
    setShowWizard(true);
  };

  const confirmEdit = (updatedData: Partial<MasterDataEntity>) => {
    // Không dùng hàm này cho Save sửa nữa (do sửa qua Wizard) nhưng giữ lại dự phòng
    setEntities(entities.map(e => e.id === editingEntity?.id ? { ...e, ...updatedData } as MasterDataEntity : e));
    setShowEditModal(false);
    setIsViewMode(false);
    setEditingEntity(null);
  };

  // Hành động Xóa
  const handleDelete = (id: string) => {
    const entity = entities.find(e => e.id === id);
    if (entity) {
      setEntityToDelete(entity);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    setEntities(entities.filter(e => e.id !== entityToDelete?.id));
    setShowDeleteModal(false);
    setEntityToDelete(null);
  };

  // Hành động Thêm mới: Sử dụng Wizard
  const handleAdd = () => {
    setFormData({ name: '', dataType: 'standard', managingAgency: '', scope: 'national', description: '' });
    setEditingEntity(null);
    setWizardEntityId(null);
    setWizardStep(1);
    setIsViewMode(false);
    setShowWizard(true);
  };

  const handleSaveStep1 = (action: 'draft' | 'submit' | 'next') => {
    if (!formData.name) {
      alert('Vui lòng nhập tên danh mục!');
      return;
    }

    let savedId = '';
    if (editingEntity) {
      const updated = entities.map(e => e.id === editingEntity.id ? { 
        ...e, 
        ...formData,
        version: (e.version || 1) + 1 // Tự động tăng phiên bản
      } as MasterDataEntity : e);
      setEntities(updated);
      savedId = editingEntity.id;
    } else {
      const newId = (entities.length + 1).toString();
      const newEntity: MasterDataEntity = {
        ...(formData as MasterDataEntity),
        id: newId,
        code: `MD-NEW-${newId.padStart(3, '0')}`,
        createdDate: new Date().toLocaleDateString('vi-VN'),
        updatedDate: new Date().toLocaleDateString('vi-VN'),
        createdBy: 'Admin',
        lifecycleStatus: 'draft',
        version: 1 // Phiên bản đầu tiên
      };
      setEntities([...entities, newEntity]);
      setWizardEntityId(newId);
      savedId = newId;
    }

    if (action === 'submit') {
      setShowWizard(false);
      // Gửi phê duyệt
    } else if (action === 'next') {
      setWizardStep(2);
    } else {
      setShowWizard(false);
    }
  };

  // Các hàm tiện ích khác
  const getDataTypeLabel = (type: FieldDataType) => {
    const map: Record<string, string> = { string: 'Chuỗi', number: 'Số', date: 'Ngày', boolean: 'Logic' };
    return map[type] || type;
  };

  // --------------------------------------------------------------------------------
  // Hành động - Trình duyệt & Phê duyệt nhanh (Workflow integration)
  // --------------------------------------------------------------------------------
  const confirmSubmitApproval = (entityId: string, type: 'category' | 'structure') => {
    const entity = entities.find(e => e.id === entityId);
    if (!entity) return;
    setApprovalRequestData({ id: entity.id, code: entity.code, name: entity.name, type });
    setApprovalRequestForm({ reviewer: '', note: '' });
    setShowApprovalModal(true);
  };

  const handleShortcutApprove = (entity: MasterDataEntity) => {
    const req = requests.find(r => r.entityId === entity.id && r.status === 'pending');
    if (req) {
      setPendingApprovalData(req);
      setShowSimpleApproveModal(true);
    } else {
      setGenericConfirm({
         isOpen: true, type: 'warning', title: 'Không thể phê duyệt', subtitle: 'Thông báo lỗi',
         message: 'Danh mục này chưa được gửi phê duyệt (không có yêu cầu Pending)!', confirmText: 'Đóng', onConfirm: () => setGenericConfirm(null)
      });
    }
  };

  const handleShortcutReject = (entity: MasterDataEntity) => {
    const req = requests.find(r => r.entityId === entity.id && r.status === 'pending');
    if (req) {
      setPendingApprovalData(req);
      setShowSimpleRejectModal(true);
    } else {
      setGenericConfirm({
         isOpen: true, type: 'warning', title: 'Không thể từ chối', subtitle: 'Thông báo lỗi',
         message: 'Danh mục này chưa được gửi phê duyệt (không có yêu cầu Pending)!', confirmText: 'Đóng', onConfirm: () => setGenericConfirm(null)
      });
    }
  };

  const confirmSubmitAttribute = (attrId: string) => {
    const attr = attributes.find(a => a.id === attrId);
    setApprovalRequestData({ id: attrId, code: attr?.fieldName || '', name: attr?.displayName || '', type: 'attribute' });
    setApprovalRequestForm({ reviewer: '', note: '' });
    setShowApprovalModal(true);
  };

  const confirmApproveAttribute = (attrId: string) => {
    const attr = attributes.find(a => a.id === attrId);
    setGenericConfirm({
      isOpen: true, type: 'success', title: 'Phê duyệt thuộc tính', subtitle: 'Hành động duyệt nhanh',
      message: <p>Duyệt thuộc tính <strong>{attr?.fieldName}</strong>?</p>,
      confirmText: 'Phê duyệt',
      onConfirm: () => {
        setAttributes(prev => prev.map(a => a.id === attrId ? { ...a, status: 'approved' } : a));
      }
    });
  };

  const confirmRejectAttribute = (attrId: string) => {
    const attr = attributes.find(a => a.id === attrId);
    setGenericConfirm({
      isOpen: true, type: 'warning', title: 'Từ chối thuộc tính', subtitle: 'Đẩy về bản nháp',
      message: <p>Từ chối thuộc tính <strong>{attr?.fieldName}</strong>?</p>,
      confirmText: 'Từ chối',
      onConfirm: () => {
        setAttributes(prev => prev.map(a => a.id === attrId ? { ...a, status: 'draft' } : a));
      }
    });
  };

  const isAnyModalOpen = !!(
    showWizard ||
    genericConfirm?.isOpen ||
    showDeleteModal ||
    showDeleteAttributeModal ||
    showAttributeModal ||
    showSimpleApproveModal ||
    showSimpleRejectModal ||
    showReviewModal ||
    showExpireRequestModal ||
    showExpireApproveModal ||
    showApprovalModal
  );

  return (
    <div className="space-y-6">
      {/* Tabs Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex px-6 gap-2">
          {[
            { id: 'setup', label: 'Thiết lập danh sách', icon: Settings },
            { id: 'attributes', label: 'Thiết lập thuộc tính', icon: Sliders },
            { id: 'relationships', label: 'Thiết lập quan hệ', icon: Link2 },
            { id: 'approval', label: 'Phê duyệt', icon: CheckSquare },
            { id: 'version-history', label: 'Lịch sử phiên bản', icon: Clock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-6 py-4 text-[13px] font-medium transition-all border-b-2 cursor-pointer ${activeTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
          {activeTab === 'setup' && (
            <SetupTab
              entities={entities} searchTerm={searchTerm} setSearchTerm={setSearchTerm}
              filterStatus={filterStatus} setFilterStatus={setFilterStatus}
              userRole={userRole} publishedEntities={publishedEntities}
              onAdd={handleAdd}
              onEdit={handleEdit} onDelete={handleDelete}
              onView={handleView}
              onSubmitApproval={confirmSubmitApproval}
              onPublish={(e) => { setEntityToPublish(e); setShowPublishModal(true); }} 
              onUnpublish={(e) => { /* Mock unpublish */ }}
              onApproveClick={handleShortcutApprove}
              onRejectClick={handleShortcutReject}
              onExpireClick={(e) => {
                setExpireEntity(e);
                setShowExpireRequestModal(true);
              }}
            />
          )}

          {activeTab === 'attributes' && (
            <AttributesTab
              entities={entities} attributes={attributes}
              selectedEntityId={selectedEntityId} setSelectedEntityId={setSelectedEntityId}
              selectedAttributes={selectedAttributes}
              onSelectAttribute={(id) => setSelectedAttributes(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id])}
              onSelectAll={(checked) => setSelectedAttributes(checked ? attributes.map(a => a.id) : [])}
              onAddAttribute={() => setShowAttributeModal(true)}
              onEditAttribute={(attr) => { setEditingAttribute(attr); setAttributeFormData(attr); setShowAttributeModal(true); }}
              onDeleteAttribute={(id) => { setAttributeToDeleteId(id); setShowDeleteAttributeModal(true); }}
              getDataTypeLabel={getDataTypeLabel}
              onSave={() => {
                setGenericConfirm({
                   isOpen: true, type: 'success', title: 'Đã lưu', subtitle: '', message: 'Lưu cấu trúc nháp thành công!', confirmText: 'Đóng', onConfirm: () => setGenericConfirm(null)
                });
              }}
              onSaveAndSubmit={() => {
                if (selectedEntityId) confirmSubmitApproval(selectedEntityId, 'structure');
              }}
              onSubmitAttribute={confirmSubmitAttribute}
              onApproveAttribute={confirmApproveAttribute}
              onRejectAttribute={confirmRejectAttribute}
              onCancel={() => setActiveTab('setup')}
            />
          )}

          {/* Các tab khác render đơn giản để tránh lỗi */}
          {activeTab === 'relationships' && <RelationshipsTab entities={entities} relationships={relationships} setRelationships={setRelationships} />}
          {activeTab === 'approval' && <ApprovalTab
            entities={entities}
            approvalTab={approvalTab}
            setApprovalTab={setApprovalTab}
            requests={requests}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onViewDetail={(req) => {
              if (req.actionType === 'expire') {
                 setPendingApprovalData(req);
                 const entity = entities.find(e => e.id === req.entityId) || null;
                 setExpireEntity(entity);
                 setShowExpireApproveModal(true);
              } else {
                 setPendingApprovalData([req]); 
                 setShowReviewModal(true);
              }
            }}
            onApproveClick={(req) => { setPendingApprovalData(req); setShowSimpleApproveModal(true); }}
            onRejectClick={(req) => { setPendingApprovalData(req); setShowSimpleRejectModal(true); }}
            onApproveAll={() => { }}
            approvalTypeLabels={approvalTypeLabels}
            approvalStatusLabels={approvalStatusLabels}
          />}
          {activeTab === 'version-history' && <VersionHistoryTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} onViewDetail={() => { }} />}
      </div>

      {/* Modals Container */}
      {isAnyModalOpen && (
        <Portal>
        {/* Wizard chỉ dành cho Thêm mới */}
        <CategoryWizardModal
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          step={wizardStep}
          setStep={setWizardStep}
          entityId={wizardEntityId}
          formData={formData}
          setFormData={setFormData}
          onSaveStep1={handleSaveStep1}
          entities={entities}
          attributes={attributes}
          selectedAttributes={selectedAttributes}
          onSelectAttribute={(id) => setSelectedAttributes(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id])}
          onSelectAllAttributes={(checked) => setSelectedAttributes(checked ? attributes.map(a => a.id) : [])}
          onAddAttribute={() => { setAttributeFormData(defaultAttribute); setShowAttributeModal(true); }}
          onEditAttribute={(attr) => { setAttributeFormData(attr); setShowAttributeModal(true); }}
          onDeleteAttribute={() => { }}
          getDataTypeLabel={getDataTypeLabel}
          isViewOnly={isViewMode}
        />

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

        <ConfirmModal
          isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}
          title="Xác nhận xóa danh mục"
          message={
            <div className="space-y-1">
              <div className="text-slate-500">Tên danh mục:</div>
              <div className="font-medium text-slate-800">{entityToDelete?.name}</div>
            </div>
          }
          onConfirm={confirmDelete}
          type="delete"
        />

        <ConfirmModal
          isOpen={showDeleteAttributeModal} onClose={() => setShowDeleteAttributeModal(false)}
          title="Xác nhận xóa thuộc tính"
          message={
            <div className="space-y-1">
              <div className="text-slate-500">Tên thuộc tính hiển thị:</div>
              <div className="font-medium text-slate-800">{attributes.find(a => a.id === attributeToDeleteId)?.displayName}</div>
            </div>
          }
          onConfirm={() => {
            if (attributeToDeleteId) {
              setAttributes(attributes.filter(a => a.id !== attributeToDeleteId));
              setSelectedAttributes(selectedAttributes.filter(sid => sid !== attributeToDeleteId));
              setAttributeToDeleteId(null);
            }
            setShowDeleteAttributeModal(false);
          }}
          type="delete"
        />

        {/* Các modal khác giữ nguyên ẩn khi không dùng */}
        <AttributeFormModal isOpen={showAttributeModal} onClose={() => setShowAttributeModal(false)} editingAttribute={editingAttribute} formData={attributeFormData} setFormData={setAttributeFormData} onSave={() => setShowAttributeModal(false)} onSaveAndSubmit={() => { }} />

        <SimpleApproveModal
          isOpen={showSimpleApproveModal}
          onClose={() => setShowSimpleApproveModal(false)}
          entity={entities.find(e => e.id === pendingApprovalData?.entityId) || null}
          onConfirm={(note) => {
            setRequests(requests.map(r => r.id === pendingApprovalData?.id ? { ...r, status: 'approved', reviewedBy: 'Admin', reviewedDate: new Date().toLocaleDateString('vi-VN'), comments: note } : r));
            // Cập nhật lifecycle status của entity nếu approved
            if (pendingApprovalData?.type === 'category') {
              setEntities(entities.map(e => e.id === pendingApprovalData.entityId ? { ...e, lifecycleStatus: 'active' } as MasterDataEntity : e));
            } else if (pendingApprovalData?.type === 'expire') {
              setEntities(entities.map(e => e.id === pendingApprovalData.entityId ? { ...e, lifecycleStatus: 'inactive' } as MasterDataEntity : e));
            }
            setShowSimpleApproveModal(false);
          }}
        />

        <SimpleRejectModal
          isOpen={showSimpleRejectModal}
          onClose={() => setShowSimpleRejectModal(false)}
          entity={entities.find(e => e.id === pendingApprovalData?.entityId) || null}
          onConfirm={(note) => {
            setRequests(requests.map(r => r.id === pendingApprovalData?.id ? { ...r, status: 'rejected', reviewedBy: 'Admin', reviewedDate: new Date().toLocaleDateString('vi-VN'), comments: note } : r));
            // Cập nhật lifecycle status của entity nếu rejected
            if (pendingApprovalData?.type === 'category') {
              setEntities(entities.map(e => e.id === pendingApprovalData.entityId ? { ...e, lifecycleStatus: 'draft' } as MasterDataEntity : e));
            } else if (pendingApprovalData?.type === 'expire') {
              setEntities(entities.map(e => e.id === pendingApprovalData.entityId ? { ...e, lifecycleStatus: 'active' } as MasterDataEntity : e));
            }
            setShowSimpleRejectModal(false);
          }}
        />

        <ReviewApprovalModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          requests={Array.isArray(pendingApprovalData) ? pendingApprovalData : []}
          entities={entities}
          attributes={attributes}
          onApprove={(ids, note, partialStatuses) => {
            setRequests(requests.map(r => {
              if (ids.includes(r.id)) {
                const currentLineStatuses = partialStatuses?.[r.id] || {};
                const hasRejected = Object.values(currentLineStatuses).includes('rejected');
                const overallStatus = hasRejected ? 'partial' : 'approved';
                return { ...r, status: overallStatus, reviewedBy: 'Admin', reviewedDate: new Date().toLocaleDateString('vi-VN'), comments: note, lineStatuses: currentLineStatuses };
              }
              return r;
            }));
            setShowReviewModal(false);
          }}
          onReject={(ids, note) => {
            setRequests(requests.map(r => ids.includes(r.id) ? { ...r, status: 'rejected', reviewedBy: 'Admin', reviewedDate: new Date().toLocaleDateString('vi-VN'), comments: note } : r));
            setShowReviewModal(false);
          }}
        />

        <ExpireRequestModal
           isOpen={showExpireRequestModal}
           onClose={() => setShowExpireRequestModal(false)}
           entity={expireEntity}
           onSubmit={(data) => {
              if (!expireEntity) return;
              
              setRequests([{
                 id: `req-exp-${Date.now()}`,
                 type: 'expire',
                 actionType: 'expire',
                 entityId: expireEntity.id,
                 entityCode: expireEntity.code,
                 entityName: expireEntity.name,
                 requestedBy: 'Nguyễn Văn A',
                 requestedDate: new Date().toLocaleDateString('vi-VN'),
                 status: 'pending',
                 comments: `Ngừng sử dụng từ ${data.expireDate}. Lý do: ${data.reason}. Lãnh đạo trình duyệt: ${data.approver}. ${data.note}`
              }, ...requests]);
              
              setEntities(entities.map(e => e.id === expireEntity.id ? { ...e, lifecycleStatus: 'pending_expiration' } as MasterDataEntity : e));
              
              setShowExpireRequestModal(false);
              setGenericConfirm({
                 isOpen: true, type: 'success', title: 'Đã trình duyệt', subtitle: '', message: 'Yêu cầu ngừng hiệu lực danh mục đã được gửi để phê duyệt!', confirmText: 'Đóng', onConfirm: () => setGenericConfirm(null)
              });
           }}
        />

        <ExpireApproveModal
           isOpen={showExpireApproveModal}
           onClose={() => setShowExpireApproveModal(false)}
           entity={expireEntity}
           onApprove={(note) => {
              setRequests(requests.map(r => r.id === pendingApprovalData?.id ? { ...r, status: 'approved', reviewedBy: 'Admin', reviewedDate: new Date().toLocaleDateString('vi-VN'), comments: note } : r));
              if (expireEntity) {
                 setEntities(entities.map(e => e.id === expireEntity.id ? { ...e, lifecycleStatus: 'inactive' } as MasterDataEntity : e));
              }
              setShowExpireApproveModal(false);
           }}
           onReject={(note) => {
              setRequests(requests.map(r => r.id === pendingApprovalData?.id ? { ...r, status: 'rejected', reviewedBy: 'Admin', reviewedDate: new Date().toLocaleDateString('vi-VN'), comments: note } : r));
              if (expireEntity) {
                 setEntities(entities.map(e => e.id === expireEntity.id ? { ...e, lifecycleStatus: 'active' } as MasterDataEntity : e));
              }
              setShowExpireApproveModal(false);
           }}
        />

        <ApprovalRequestModal
          isOpen={showApprovalModal}
          onClose={() => setShowApprovalModal(false)}
          data={approvalRequestData as any}
          approvers={approvers}
          form={approvalRequestForm}
          setForm={setApprovalRequestForm}
          onSubmit={() => {
            setGenericConfirm({
               isOpen: true, type: 'success', title: 'Đã trình duyệt', subtitle: '', message: 'Gửi yêu cầu phê duyệt thành công!', confirmText: 'Đóng', onConfirm: () => setGenericConfirm(null)
            });
            setShowApprovalModal(false);
          }}
        />

        </Portal>
      )}
    </div>
  );
};

export default CategorySetupPage;