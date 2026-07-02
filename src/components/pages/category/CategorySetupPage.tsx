import React, { useState, useEffect, ChangeEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings, Sliders, Link2, CheckSquare
} from 'lucide-react';

// Types & Constants
import {
  MasterDataEntity, MasterDataAttribute, EntityRelationship, ApprovalRequest,
  TabType, LifecycleStatus, DataType, ScopeType, DataSourceType, FieldDataType, ApprovalType, ApprovalStatus
} from './categoryTypes';
import {
  defaultEntities, dataTypeLabels, lifecycleLabels, approvalTypeLabels, approvalStatusLabels, approvers,
  mockAttributesByEntity
} from './categoryConstants';

// Components - Tabs
import { SetupTab } from './components/tabs/SetupTab';
import { AttributesTab } from './components/tabs/AttributesTab';
import { RelationshipsTab } from './components/tabs/RelationshipsTab';
import { ApprovalTab } from './components/tabs/ApprovalTab';
import { VersionHistoryTab, VersionRecord } from './components/tabs/VersionHistoryTab';

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
import { CategoryInfoViewModal } from './components/modals/CategoryInfoViewModal';
import { CategoryStructureViewModal } from './components/modals/CategoryStructureViewModal';
import { CategoryVersionChangeModal } from './components/modals/CategoryVersionChangeModal';
import { Portal } from '../../common/Portal';

export const CategorySetupPage = ({ userRole = 'leader' }: { userRole?: string }) => {
  const navigate = useNavigate();

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('setup');

  // Entities & Attributes State
  const [entities, setEntities] = useState<MasterDataEntity[]>(defaultEntities);
  const [attributes, setAttributes] = useState<MasterDataAttribute[]>([
    { 
      id: 'a1', 
      fieldName: 'citizen_id', 
      displayName: 'Số CCCD', 
      dataType: 'string', 
      required: true, 
      unique: true, 
      indexed: true, 
      length: 12, 
      description: 'Số căn cước công dân 12 số', 
      defaultValue: '', 
      version: 1, 
      status: 'approved', 
      createdDate: '01/01/2024',
      sourceTable: 'tbl_can_cuoc',
      sourceField: 'so_cccd',
      sourceKey: 'PRI',
      jsonPath: 'data.citizenId',
      masked: true
    },
    { 
      id: 'a2', 
      fieldName: 'full_name', 
      displayName: 'Họ và tên', 
      dataType: 'string', 
      required: true, 
      unique: false, 
      indexed: true, 
      length: 100, 
      description: 'Họ và tên đầy đủ', 
      defaultValue: 'N/A', 
      version: 1, 
      status: 'approved', 
      createdDate: '01/01/2024',
      sourceTable: 'tbl_can_cuoc',
      sourceField: 'ho_ten',
      sourceKey: '',
      jsonPath: 'data.fullName',
      masked: false
    },
    { 
      id: 'a3', 
      fieldName: 'gender', 
      displayName: 'Giới tính', 
      dataType: 'string', 
      required: false, 
      unique: false, 
      indexed: false, 
      length: 10, 
      description: 'Giới tính của thực thể', 
      defaultValue: 'Nam', 
      version: 1, 
      status: 'pending', 
      createdDate: '01/01/2024',
      sourceTable: 'tbl_can_cuoc',
      sourceField: 'gioi_tinh',
      sourceKey: '',
      jsonPath: 'data.gender',
      masked: false
    }
  ]);
  const [relationships, setRelationships] = useState<EntityRelationship[]>([
    {
      id: 'rel-1',
      sourceEntityId: '7',
      sourceEntityName: 'Dữ liệu Danh mục và mã mối quan hệ trong gia đình',
      targetEntityId: '1',
      targetEntityName: 'Dữ liệu Danh mục giới tính',
      relationshipType: '1-1',
      sourceKey: 'gioitinh_id',
      targetKey: 'id',
      status: 'active',
      createdDate: '20/12/2024 14:30',
      createdBy: 'Hệ thống'
    },
    {
      id: 'rel-2',
      sourceEntityId: '8',
      sourceEntityName: 'Dữ liệu Danh mục mã giấy tờ tùy thân',
      targetEntityId: '1',
      targetEntityName: 'Dữ liệu Danh mục giới tính',
      relationshipType: 'n-1',
      sourceKey: 'gioitinh_id',
      targetKey: 'id',
      status: 'active',
      createdDate: '20/12/2024 15:00',
      createdBy: 'Hệ thống'
    },
    {
      id: 'rel-3',
      sourceEntityId: '5',
      sourceEntityName: 'Dữ liệu Danh mục cơ quan',
      targetEntityId: '6',
      targetEntityName: 'Dữ liệu Danh mục đơn vị hành chính',
      relationshipType: 'n-1',
      sourceKey: 'tinh_thanh_id',
      targetKey: 'id',
      status: 'active',
      createdDate: '21/12/2024 09:15',
      createdBy: 'Hệ thống'
    }
  ]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('1');

  // Form & Modal States
  const [showWizard, setShowWizard] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardEntityId, setWizardEntityId] = useState<string | null>(null);
  const [editingEntity, setEditingEntity] = useState<MasterDataEntity | null>(null);

  // Tự động chuyển trạng thái sang Hiệu lực khi đến ngày hiệu lực được chọn
  useEffect(() => {
    const checkEffectiveDates = () => {
      const today = new Date().toISOString().split('T')[0];
      setEntities(prev => {
        const hasAny = prev.some(e =>
          e.lifecycleStatus === 'approved' &&
          e.effectiveImmediate === false &&
          e.effectiveDate &&
          e.effectiveDate <= today
        );
        if (!hasAny) return prev;
        return prev.map(e =>
          e.lifecycleStatus === 'approved' && e.effectiveImmediate === false && e.effectiveDate && e.effectiveDate <= today
            ? { ...e, lifecycleStatus: 'active' as const }
            : e
        );
      });
    };
    checkEffectiveDates();
    const interval = setInterval(checkEffectiveDates, 60000);
    return () => clearInterval(interval);
  }, []);

  // Load mock attributes when selectedEntityId, wizardEntityId, or showWizard/editingEntity changes
  useEffect(() => {
    const activeId = showWizard ? wizardEntityId : selectedEntityId;
    if (activeId && mockAttributesByEntity[activeId]) {
      setAttributes(mockAttributesByEntity[activeId]);
    } else if (showWizard && !wizardEntityId) {
      setAttributes([]);
    }
  }, [selectedEntityId, wizardEntityId, showWizard]);
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
      changes: {
        prevVersion: 1,
        currentVersion: 2,
        generalChanges: [
          { field: 'managingAgency', label: 'Đơn vị chủ quản', oldValue: 'Bộ Nội vụ', newValue: 'Bộ Tư pháp' },
          { field: 'dataSource', label: 'Nguồn dữ liệu', oldValue: 'Tự cập nhật trực tiếp', newValue: 'Đồng bộ Kho DLDC' },
          { field: 'description', label: 'Mô tả', oldValue: 'Danh mục giới tính', newValue: 'Danh mục giới tính chuẩn quốc gia theo ISO 5218' },
        ],
        structureChanges: [
          {
            changeType: 'added',
            fieldName: 'phone_code',
            displayName: 'Mã điện thoại',
            dataType: 'Chuỗi (String)',
          },
          {
            changeType: 'modified',
            fieldName: 'gender_code',
            displayName: 'Mã giới tính',
            dataType: 'Chuỗi (String)',
            changedProps: [
              { label: 'Độ dài tối đa', oldValue: '2', newValue: '10' },
              { label: 'Bắt buộc', oldValue: 'Không', newValue: 'Có' },
            ],
          },
          {
            changeType: 'removed',
            fieldName: 'note',
            displayName: 'Ghi chú',
            dataType: 'Văn bản dài (Text)',
          },
        ],
        relationshipChanges: [
          {
            changeType: 'added',
            sourceEntityName: 'Dữ liệu Danh mục giới tính',
            targetEntityName: 'Dữ liệu Danh mục dân tộc',
            relationshipType: '1-n',
          },
          {
            changeType: 'modified',
            sourceEntityName: 'Dữ liệu Danh mục giới tính',
            targetEntityName: 'Dữ liệu Danh mục quốc gia',
            relationshipType: '1-1',
            changedProps: [
              { label: 'Khóa nguồn', oldValue: 'id', newValue: 'gender_code' },
              { label: 'Trường hiển thị', oldValue: '', newValue: 'country_name' },
            ],
          },
        ],
      }
    },
    {
      id: '12', type: 'relationship', entityId: '7', entityCode: 'DM-QUANHEGD',
      entityName: 'Dữ liệu Danh mục và mã mối quan hệ trong gia đình', requestedBy: 'Đỗ Văn P',
      requestedDate: '30/11/2024 09:12', status: 'pending',
      changes: { targetEntity: 'Dữ liệu Danh mục giới tính', relationshipType: '1-1', sourceKey: 'id', targetKey: 'gioitinh_id' }
    },
    {
      id: '13', type: 'expire', actionType: 'expire', entityId: '3', entityCode: 'DM-QUOCGIA',
      entityName: 'Dữ liệu Danh mục và mã Quốc gia, Quốc tịch', requestedBy: 'Trần Văn X',
      requestedDate: '25/12/2024 08:30', status: 'pending',
      changes: { expireDate: '2025-01-01', reason: 'Tích hợp vào danh mục khác', approver: 'Giám đốc Nguyễn A', note: 'Theo kế hoạch hợp nhất danh mục quý I/2025' },
      comments: 'Ngừng sử dụng từ 01/01/2025. Lý do: Tích hợp vào danh mục khác.'
    },
    {
      id: '14', type: 'expire', actionType: 'expire', entityId: '5', entityCode: 'DM-COQUAN',
      entityName: 'Dữ liệu Danh mục cơ quan', requestedBy: 'Lê Thị Y',
      requestedDate: '20/12/2024 14:00', status: 'approved',
      reviewedBy: 'Giám đốc Nguyễn Z', reviewedDate: '21/12/2024',
      changes: { expireDate: '2025-02-01', reason: 'Dữ liệu lỗi, cấu trúc cũ', approver: 'Giám đốc Nguyễn Z', note: '' },
      comments: 'Đồng ý ngừng sử dụng, đã kiểm tra không còn ràng buộc khóa ngoại.'
    },
    {
      id: '15', type: 'expire', actionType: 'expire', entityId: '4', entityCode: 'DM-TONGIAO',
      entityName: 'Dữ liệu Danh mục và mã các Tôn giáo', requestedBy: 'Phạm Minh T',
      requestedDate: '18/12/2024 10:15', status: 'rejected',
      reviewedBy: 'Phó Giám đốc Trần B', reviewedDate: '19/12/2024',
      changes: { expireDate: '2024-12-31', reason: 'Quy định pháp luật thay đổi', approver: 'Phó Giám đốc Trần B', note: 'Theo công văn số 123/BTP/2024' },
      comments: 'Từ chối do danh mục vẫn đang được sử dụng ở 2 hệ thống vệ tinh.'
    }
  ]);
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'all'>('all');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalRequestData, setApprovalRequestData] = useState<{ id: string; code: string; name: string; type: 'category' | 'structure' | 'version' | 'attribute' | 'relationship' | 'expire'; currentVersion?: number } | null>(null);
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

  // State cho Xem chi tiết thông tin chung
  const [showInfoViewModal, setShowInfoViewModal] = useState(false);
  const [infoViewEntity, setInfoViewEntity] = useState<MasterDataEntity | null>(null);
  const [infoViewRequestId, setInfoViewRequestId] = useState<string | null>(null);

  // State cho Xem chi tiết cấu trúc & quan hệ
  const [showStructureViewModal, setShowStructureViewModal] = useState(false);
  const [structureViewEntity, setStructureViewEntity] = useState<MasterDataEntity | null>(null);
  const [structureViewRequestId, setStructureViewRequestId] = useState<string | null>(null);


  // Lịch sử phiên bản danh mục
  const [versions, setVersions] = useState<VersionRecord[]>([]);

  // State cho Xem chi tiết thay đổi phiên bản
  const [showVersionChangeModal, setShowVersionChangeModal] = useState(false);
  const [versionChangeEntity, setVersionChangeEntity] = useState<MasterDataEntity | null>(null);
  const [versionChangeRequest, setVersionChangeRequest] = useState<ApprovalRequest | null>(null);

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
    setIsEditMode(false);
    setShowWizard(true);
  };

  // Hành động Sửa: Dùng chung Wizard với Thêm mới
  const handleEdit = (entity: MasterDataEntity) => {
    setEditingEntity(entity);
    setFormData(entity);
    setWizardEntityId(entity.id);
    setWizardStep(1);
    setIsViewMode(false);
    setIsEditMode(true);
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
    setFormData({ code: '', name: '', dataType: 'standard', managingAgency: '', scope: 'national', description: '', lifecycleStatus: 'draft' });
    setEditingEntity(null);
    setWizardEntityId(null);
    setWizardStep(1);
    setIsViewMode(false);
    setIsEditMode(false);
    setShowWizard(true);
  };

  const handleSaveStep1 = (action: 'draft' | 'submit' | 'next' | 'next3') => {
    if (!formData.code?.trim()) {
      alert('Vui lòng nhập mã danh mục!');
      return;
    }
    if (!formData.name?.trim()) {
      alert('Vui lòng nhập tên danh mục!');
      return;
    }

    let savedId = '';
    if (editingEntity) {
      const updated = entities.map(e => e.id === editingEntity.id ? { 
        ...e, 
        ...formData,
        version: action === 'submit' ? (e.version || 1) + 1 : (e.version || 1)
      } as MasterDataEntity : e);
      setEntities(updated);
      savedId = editingEntity.id;
    } else {
      const newId = (entities.length + 1).toString();
      const newEntity: MasterDataEntity = {
        ...(formData as MasterDataEntity),
        id: newId,
        code: formData.code.trim(),
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
      const entity = entities.find(e => e.id === savedId) || { id: savedId, code: formData.code || '', name: formData.name || '', lifecycleStatus: 'draft' };

      let submitType: 'category' | 'structure' | 'version' = 'category';
      if (isEditMode && editingEntity) {
        submitType = 'version';
      } else if (wizardStep === 2 && (entity.lifecycleStatus === 'approved' || entity.lifecycleStatus === 'active')) {
        submitType = 'structure';
      }

      const entityVersion = entities.find(e => e.id === entity.id)?.version || 1;
      setApprovalRequestData({ id: entity.id, code: entity.code, name: entity.name, type: submitType, currentVersion: entityVersion });
      setApprovalRequestForm({ reviewer: '', note: '' });
      setShowApprovalModal(true);
    } else if (action === 'next') {
      setWizardStep(2);
    } else if (action === 'next3') {
      setWizardStep(3);
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
      isOpen: true, type: 'success', title: 'Phê duyệt trường dữ liệu', subtitle: 'Hành động duyệt nhanh',
      message: <p>Duyệt trường dữ liệu <strong>{attr?.fieldName}</strong>?</p>,
      confirmText: 'Phê duyệt',
      onConfirm: () => {
        setAttributes(prev => prev.map(a => a.id === attrId ? { ...a, status: 'approved' } : a));
      }
    });
  };

  const confirmRejectAttribute = (attrId: string) => {
    const attr = attributes.find(a => a.id === attrId);
    setGenericConfirm({
      isOpen: true, type: 'warning', title: 'Từ chối trường dữ liệu', subtitle: 'Đẩy về bản nháp',
      message: <p>Từ chối trường dữ liệu <strong>{attr?.fieldName}</strong>?</p>,
      confirmText: 'Từ chối',
      onConfirm: () => {
        setAttributes(prev => prev.map(a => a.id === attrId ? { ...a, status: 'draft' } : a));
      }
    });
  };

  const handleAddAttributeInline = (data: Partial<MasterDataAttribute>) => {
    const newAttr: MasterDataAttribute = {
      id: `a-${Date.now()}`,
      fieldName: data.fieldName!,
      displayName: data.displayName!,
      dataType: data.dataType || 'string',
      length: data.length,
      required: data.required ?? false,
      unique: data.unique ?? false,
      indexed: data.indexed ?? false,
      defaultValue: data.defaultValue,
      validationRules: data.validationRules,
      description: data.description,
      createdDate: new Date().toLocaleDateString('vi-VN'),
      version: 1,
      status: 'draft',
      keyType: data.keyType || 'none',
      foreignTable: data.foreignTable,
      foreignField: data.foreignField,
    };
    setAttributes(prev => [...prev, newAttr]);
  };

  const handleSaveAttribute = () => {
    if (!attributeFormData.fieldName || !attributeFormData.displayName) {
      alert('Vui lòng nhập đầy đủ Tên trường và Tên hiển thị!');
      return;
    }

    if (editingAttribute) {
      // Edit Mode
      setAttributes(prev => prev.map(a => a.id === editingAttribute.id ? {
        ...a,
        ...attributeFormData
      } as MasterDataAttribute : a));
    } else {
      // Add Mode
      const newAttr: MasterDataAttribute = {
        id: `a-${Date.now()}`,
        fieldName: attributeFormData.fieldName!,
        displayName: attributeFormData.displayName!,
        dataType: attributeFormData.dataType || 'string',
        length: attributeFormData.length,
        required: attributeFormData.required ?? false,
        unique: attributeFormData.unique ?? false,
        indexed: attributeFormData.indexed ?? false,
        defaultValue: attributeFormData.defaultValue,
        validationRules: attributeFormData.validationRules,
        description: attributeFormData.description,
        createdDate: new Date().toLocaleDateString('vi-VN'),
        version: 1,
        status: 'draft',
        keyType: attributeFormData.keyType || 'none',
        foreignTable: attributeFormData.foreignTable,
        foreignField: attributeFormData.foreignField,
      };
      setAttributes(prev => [...prev, newAttr]);
    }
    setShowAttributeModal(false);
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
    showInfoViewModal ||
    showStructureViewModal ||
    showVersionChangeModal ||
    showApprovalModal
  );

  return (
    <div className="space-y-6">
      {/* Tabs Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex px-6 gap-2">
          {[
            { id: 'setup', label: 'Thiết lập danh mục', icon: Settings },
            { id: 'attributes', label: 'Thiết lập cấu trúc', icon: Sliders },
            { id: 'relationships', label: 'Thiết lập quan hệ', icon: Link2 },
            { id: 'approval', label: 'Phê duyệt', icon: CheckSquare }
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
              onViewData={(e) => {
                navigate(`/category-list?category=category-a-${e.id}`);
              }}
            />
          )}

          {activeTab === 'attributes' && (
            <AttributesTab
              entities={entities} attributes={attributes}
              requests={requests}
              selectedEntityId={selectedEntityId} setSelectedEntityId={setSelectedEntityId}
              selectedAttributes={selectedAttributes}
              onSelectAttribute={(id) => setSelectedAttributes(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id])}
              onSelectAll={(checked) => setSelectedAttributes(checked ? attributes.map(a => a.id) : [])}
              onAddAttribute={() => setShowAttributeModal(true)}
              onAddAttributeInline={handleAddAttributeInline}
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
              } else if (req.type === 'structure') {
                 const entity = entities.find(e => e.id === req.entityId) || null;
                 setStructureViewEntity(entity);
                 setStructureViewRequestId(req.id);
                 setShowStructureViewModal(true);
              } else if (req.type === 'version') {
                 const entity = entities.find(e => e.id === req.entityId) || null;
                 setVersionChangeEntity(entity);
                 setVersionChangeRequest(req);
                 setShowVersionChangeModal(true);
              } else {
                 const entity = entities.find(e => e.id === req.entityId) || null;
                 setInfoViewEntity(entity);
                 setInfoViewRequestId(req.id);
                 setShowInfoViewModal(true);
              }
            }}
            onApproveClick={(req) => { setPendingApprovalData(req); setShowSimpleApproveModal(true); }}
            onRejectClick={(req) => { setPendingApprovalData(req); setShowSimpleRejectModal(true); }}
            onApproveAll={() => { }}
            approvalTypeLabels={approvalTypeLabels}
            approvalStatusLabels={approvalStatusLabels}
          />}
          {activeTab === 'version-history' && <VersionHistoryTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} onViewDetail={() => { }} versions={versions} />}
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
          onDeleteAttribute={(id) => setAttributes(prev => prev.filter(a => a.id !== id))}
          onAddAttributeInline={handleAddAttributeInline}
          getDataTypeLabel={getDataTypeLabel}
          isViewOnly={isViewMode}
          isEditMode={isEditMode}
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
          title="Xác nhận xóa trường dữ liệu"
          message={
            <div className="space-y-1">
              <div className="text-slate-500">Tên trường dữ liệu hiển thị:</div>
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
        <AttributeFormModal isOpen={showAttributeModal} onClose={() => setShowAttributeModal(false)} editingAttribute={editingAttribute} formData={attributeFormData} setFormData={setAttributeFormData} onSave={handleSaveAttribute} onSaveAndSubmit={() => { }} entities={entities} entityName={entities.find(e => e.id === selectedEntityId)?.name || ''} entityCode={entities.find(e => e.id === selectedEntityId)?.code || ''} />

        <SimpleApproveModal
          isOpen={showSimpleApproveModal}
          onClose={() => setShowSimpleApproveModal(false)}
          entity={entities.find(e => e.id === pendingApprovalData?.entityId) || null}
          onConfirm={(note) => {
            setRequests(requests.map(r => r.id === pendingApprovalData?.id ? { ...r, status: 'approved', reviewedBy: 'Admin', reviewedDate: new Date().toLocaleDateString('vi-VN'), comments: note } : r));
            // Cập nhật lifecycle status của entity nếu approved
            if (pendingApprovalData?.type === 'category') {
              const ent = entities.find(e => e.id === pendingApprovalData.entityId);
              const goLive = ent?.effectiveImmediate !== false;
              setEntities(entities.map(e => e.id === pendingApprovalData.entityId
                ? { ...e, lifecycleStatus: goLive ? 'active' : 'approved' } as MasterDataEntity : e));
            } else if (pendingApprovalData?.type === 'expire') {
              setEntities(entities.map(e => e.id === pendingApprovalData.entityId ? { ...e, lifecycleStatus: 'inactive' } as MasterDataEntity : e));
            }
            // Cập nhật trạng thái phiên bản: phiên bản được duyệt → Hiệu lực, các phiên bản active cũ → Đã lưu trữ
            if (pendingApprovalData?.id) {
              setVersions(prev => prev.map(v => {
                if (v.entityId === pendingApprovalData.entityId) {
                  if (v.requestId === pendingApprovalData.id) return { ...v, status: 'active' as const };
                  if (v.status === 'active') return { ...v, status: 'archived' as const };
                }
                return v;
              }));
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
              setEntities(entities.map(e => e.id === pendingApprovalData.entityId ? { ...e, lifecycleStatus: 'rejected' } as MasterDataEntity : e));
            } else if (pendingApprovalData?.type === 'expire') {
              setEntities(entities.map(e => e.id === pendingApprovalData.entityId ? { ...e, lifecycleStatus: 'approved' } as MasterDataEntity : e));
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
            const approvedEntityIdsForCategory: string[] = [];
            setRequests(requests.map(r => {
              if (ids.includes(r.id)) {
                const currentLineStatuses = partialStatuses?.[r.id] || {};
                if (r.type === 'category') approvedEntityIdsForCategory.push(r.entityId);
                return { ...r, status: 'approved', reviewedBy: 'Admin', reviewedDate: new Date().toLocaleDateString('vi-VN'), comments: note, lineStatuses: currentLineStatuses };
              }
              return r;
            }));
            let updatedEntities = [...entities];
            if (approvedEntityIdsForCategory.length > 0) {
              updatedEntities = updatedEntities.map(e => {
                if (!approvedEntityIdsForCategory.includes(e.id)) return e;
                const goLive = e.effectiveImmediate !== false;
                return { ...e, lifecycleStatus: goLive ? 'active' : 'approved' } as MasterDataEntity;
              });
            }
            setEntities(updatedEntities);
            // Cập nhật trạng thái phiên bản cho batch approve
            setVersions(prev => prev.map(v => {
              if (ids.includes(v.requestId || '')) return { ...v, status: 'active' as const };
              if (v.status === 'active' && approvedEntityIdsForCategory.includes(v.entityId || '')) {
                return { ...v, status: 'archived' as const };
              }
              return v;
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
                 changes: { expireDate: data.expireDate, reason: data.reason, approver: data.approver, note: data.note },
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
           request={pendingApprovalData}
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


        <CategoryVersionChangeModal
          isOpen={showVersionChangeModal}
          onClose={() => setShowVersionChangeModal(false)}
          entity={versionChangeEntity}
          request={versionChangeRequest}
          onApprove={(note) => {
            setRequests(requests.map(r => r.id === versionChangeRequest?.id ? { ...r, status: 'approved', reviewedBy: 'Admin', reviewedDate: new Date().toLocaleDateString('vi-VN'), comments: note } : r));
            setShowVersionChangeModal(false);
          }}
          onReject={(note) => {
            setRequests(requests.map(r => r.id === versionChangeRequest?.id ? { ...r, status: 'rejected', reviewedBy: 'Admin', reviewedDate: new Date().toLocaleDateString('vi-VN'), comments: note } : r));
            setShowVersionChangeModal(false);
          }}
        />

        <CategoryStructureViewModal
          isOpen={showStructureViewModal}
          onClose={() => setShowStructureViewModal(false)}
          entity={structureViewEntity}
          attributes={attributes}
          relationships={relationships}
          requestStatus={requests.find(r => r.id === structureViewRequestId)?.status}
          onApprove={(note) => {
            setRequests(requests.map(r => r.id === structureViewRequestId ? { ...r, status: 'approved', reviewedBy: 'Admin', reviewedDate: new Date().toLocaleDateString('vi-VN'), comments: note } : r));
            if (structureViewEntity) {
              setEntities(entities.map(e => e.id === structureViewEntity.id ? { ...e, lifecycleStatus: 'active' } as MasterDataEntity : e));
            }
            setShowStructureViewModal(false);
          }}
          onReject={(note) => {
            setRequests(requests.map(r => r.id === structureViewRequestId ? { ...r, status: 'rejected', reviewedBy: 'Admin', reviewedDate: new Date().toLocaleDateString('vi-VN'), comments: note } : r));
            setShowStructureViewModal(false);
          }}
        />

        <CategoryInfoViewModal
          isOpen={showInfoViewModal}
          onClose={() => setShowInfoViewModal(false)}
          entity={infoViewEntity}
          requestStatus={requests.find(r => r.id === infoViewRequestId)?.status}
          onApprove={(note) => {
            setRequests(requests.map(r => r.id === infoViewRequestId ? { ...r, status: 'approved', reviewedBy: 'Admin', reviewedDate: new Date().toLocaleDateString('vi-VN'), comments: note } : r));
            if (infoViewEntity) {
              setEntities(entities.map(e => e.id === infoViewEntity.id ? { ...e, lifecycleStatus: 'approved' } as MasterDataEntity : e));
            }
            setShowInfoViewModal(false);
          }}
          onReject={(note) => {
            setRequests(requests.map(r => r.id === infoViewRequestId ? { ...r, status: 'rejected', reviewedBy: 'Admin', reviewedDate: new Date().toLocaleDateString('vi-VN'), comments: note } : r));
            if (infoViewEntity) {
              setEntities(entities.map(e => e.id === infoViewEntity.id ? { ...e, lifecycleStatus: 'draft' } as MasterDataEntity : e));
            }
            setShowInfoViewModal(false);
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
            if (approvalRequestData) {
              const newReqId = (requests.length + 1).toString();
              const reqType: ApprovalType =
                approvalRequestData.type === 'structure' ? 'structure'
                : approvalRequestData.type === 'version' ? 'version'
                : 'category';
              const newRequest: ApprovalRequest = {
                id: newReqId,
                type: reqType,
                entityId: approvalRequestData.id,
                entityCode: approvalRequestData.code,
                entityName: approvalRequestData.name,
                requestedBy: 'Nguyễn Văn A',
                requestedDate: new Date().toLocaleString('vi-VN'),
                status: 'pending'
              };
              setRequests([newRequest, ...requests]);

              // Cập nhật trạng thái entity
              if (approvalRequestData.type === 'category' || approvalRequestData.type === 'version') {
                setEntities(entities.map(e => e.id === approvalRequestData.id ? { ...e, lifecycleStatus: 'pending_approval' } as MasterDataEntity : e));
              }
              // If it is a structure approval submission, auto-increment version
              if (approvalRequestData.type === 'structure') {
                setEntities(entities.map(e => e.id === approvalRequestData.id ? { ...e, version: (e.version || 1) + 1 } as MasterDataEntity : e));
              }

              // Tạo phiên bản mới với trạng thái Chờ phê duyệt
              const entity = entities.find(e => e.id === approvalRequestData.id);
              const versionTypeMap: Record<string, VersionRecord['type']> = {
                category: 'Thông tin chung',
                version: 'Thông tin chung',
                structure: 'Cấu trúc',
                relationship: 'Quan hệ',
              };
              const newVersion: VersionRecord = {
                id: Date.now(),
                version: String(entity?.version || 1),
                author: 'Nguyễn Văn A',
                category: approvalRequestData.name,
                date: new Date().toLocaleString('vi-VN'),
                content: `Chỉnh sửa ${versionTypeMap[approvalRequestData.type] || 'thông tin'} danh mục`,
                type: versionTypeMap[approvalRequestData.type] || 'Thông tin chung',
                status: 'pending_approval',
                entityId: approvalRequestData.id,
                requestId: newReqId,
              };
              setVersions(prev => [newVersion, ...prev]);
            }

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