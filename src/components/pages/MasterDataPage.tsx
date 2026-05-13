import { useState } from 'react';
import { 
  HardDrive,
  Plus,
  Search,
  Edit2,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  Eye,
  AlertCircle,
  Settings,
  Link2,
  Key,
  GitBranch,
  History as HistoryIcon,
  RefreshCw,
  Globe,
  GlobeLock,
  FileText,
  BarChart3,
  Database,
  Fingerprint,
  Shield,
  Archive,
  Copy,
  Lock,
  Unlock
} from 'lucide-react';
import { StatusTag } from '../common/StatusTag';
import { PageHeader } from '../common/PageHeader';
import { AttributeManagementModal } from '../masterdata/AttributeManagementModal';
import { MergeRuleModal } from '../masterdata/MergeRuleModal';
import { RelationshipModal } from '../masterdata/RelationshipModal';
import { IdentifierRuleModal } from '../masterdata/IdentifierRuleModal';
import { UpdateMasterDataModal } from '../masterdata/UpdateMasterDataModal';
import { PublishMasterDataModal } from '../masterdata/PublishMasterDataModal';

type MasterDataStatus = 'draft' | 'review' | 'approved' | 'published' | 'rejected' | 'archived';

interface MasterDataEntity {
  id: string;
  code: string;
  name: string;
  entityType: string;
  description: string;
  attributes: string[];
  status: MasterDataStatus;
  version: string;
  createdBy: string;
  createdDate: string;
  updatedBy?: string;
  updatedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  publishedBy?: string;
  publishedDate?: string;
  publishedDepartment?: string;
  apiEndpoint?: string;
  accessLevel?: 'public' | 'internal' | 'restricted';
  isPublished?: boolean;
  isLocked?: boolean;
  rejectionReason?: string;
  recordCount?: number;
  usageCount?: number;
}

interface MasterDataRecord {
  id: string;
  entityId: string;
  recordCode: string;
  data: Record<string, any>;
  status: MasterDataStatus;
  version: string;
  createdBy: string;
  createdDate: string;
  history?: HistoryEntry[];
}

interface HistoryEntry {
  id: string;
  action: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  changedBy: string;
  changedDate: string;
  note?: string;
}

const initialEntities: MasterDataEntity[] = [
  {
    id: '1',
    code: 'MD_PERSON',
    name: 'Dữ liệu chủ - Công dân',
    entityType: 'Người',
    description: 'Thông tin chủ về công dân (CCCD, Hộ chiếu)',
    attributes: ['CCCD', 'Họ tên', 'Ngày sinh', 'Giới tính', 'Quê quán', 'Nơi ĐKHK'],
    status: 'published',
    version: '2.1.0',
    createdBy: 'Nguyễn Văn A',
    createdDate: '2024-01-10',
    approvedBy: 'Trần Thị B',
    approvedDate: '2024-01-20',
    publishedBy: 'Phạm Văn Minh',
    publishedDate: '2024-01-25',
    publishedDepartment: 'Cục Công nghệ thông tin',
    apiEndpoint: '/api/v1/master-data/md_person',
    accessLevel: 'public',
    isPublished: true,
    isLocked: false,
    recordCount: 95420,
    usageCount: 1250
  },
  {
    id: '2',
    code: 'MD_ORGANIZATION',
    name: 'Dữ liệu chủ - Tổ chức',
    entityType: 'Tổ chức',
    description: 'Thông tin chủ về tổ chức, doanh nghiệp',
    attributes: ['Mã số thuế', 'Tên tổ chức', 'Địa chỉ', 'Người đại diện', 'Ngày thành lập'],
    status: 'published',
    version: '1.5.0',
    createdBy: 'Lê Văn C',
    createdDate: '2024-02-05',
    approvedBy: 'Trần Thị B',
    approvedDate: '2024-02-15',
    publishedBy: 'Nguyễn Thị Lan',
    publishedDate: '2024-02-20',
    publishedDepartment: 'Cục Đăng ký quốc gia giao dịch bảo đảm',
    apiEndpoint: '/api/v1/master-data/md_organization',
    accessLevel: 'internal',
    isPublished: true,
    isLocked: true,
    recordCount: 12340,
    usageCount: 876
  },
  {
    id: '3',
    code: 'MD_LOCATION',
    name: 'Dữ liệu chủ - Địa điểm',
    entityType: 'Địa điểm',
    description: 'Thông tin chủ về đơn vị hành chính',
    attributes: ['Mã ĐVHC', 'Tên', 'Cấp', 'Mã cha', 'Tọa độ'],
    status: 'approved',
    version: '1.2.0',
    createdBy: 'Phạm Thị D',
    createdDate: '2024-03-01',
    approvedBy: 'Trần Thị B',
    approvedDate: '2024-03-10',
    recordCount: 10965,
    usageCount: 542
  },
  {
    id: '4',
    code: 'MD_ASSET',
    name: 'Dữ liệu chủ - Tài sản',
    entityType: 'Tài sản',
    description: 'Thông tin chủ về tài sản (Nhà đất, xe cộ)',
    attributes: ['Mã tài sản', 'Loại', 'Địa chỉ', 'Chủ sở hữu', 'Giá trị'],
    status: 'review',
    version: '1.0.0',
    createdBy: 'Hoàng Văn E',
    createdDate: '2024-03-15',
    recordCount: 8542,
    usageCount: 0
  },
];

export function MasterDataPage() {
  const [currentTab, setCurrentTab] = useState<'setup' | 'manage' | 'approval' | 'publish' | 'history' | 'search' | 'report'>('manage');
  const [entities, setEntities] = useState<MasterDataEntity[]>(initialEntities);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [showMergeRuleModal, setShowMergeRuleModal] = useState(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [showIdentifierModal, setShowIdentifierModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState<MasterDataEntity | null>(null);
  const [viewingEntity, setViewingEntity] = useState<MasterDataEntity | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<MasterDataEntity | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    entityType: '',
    description: '',
    attributes: [] as string[],
  });

  const statusColors: Record<MasterDataStatus, string> = {
    draft: 'bg-slate-100 text-slate-700',
    review: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    published: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
    archived: 'bg-gray-100 text-gray-700',
  };

  const statusLabels: Record<MasterDataStatus, string> = {
    draft: 'Nháp',
    review: 'Chờ phê duyệt',
    approved: 'Đã phê duyệt',
    published: 'Đã công khai',
    rejected: 'Từ chối',
    archived: 'Đã lưu trữ',
  };

  const stats = {
    total: entities.length,
    draft: entities.filter(e => e.status === 'draft').length,
    review: entities.filter(e => e.status === 'review').length,
    approved: entities.filter(e => e.status === 'approved').length,
    published: entities.filter(e => e.status === 'published').length,
    rejected: entities.filter(e => e.status === 'rejected').length,
    totalRecords: entities.reduce((sum, e) => sum + (e.recordCount || 0), 0),
    totalUsage: entities.reduce((sum, e) => sum + (e.usageCount || 0), 0),
  };

  const filteredEntities = entities.filter(entity => {
    const matchSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       entity.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || entity.status === statusFilter;
    
    if (currentTab === 'approval') {
      return matchSearch && entity.status === 'review';
    }
    
    return matchSearch && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEntity) {
      setEntities(entities.map(ent => 
        ent.id === editingEntity.id 
          ? { ...ent, ...formData, updatedBy: 'Người dùng hiện tại', updatedDate: new Date().toISOString().split('T')[0] }
          : ent
      ));
    } else {
      const newEntity: MasterDataEntity = {
        id: String(entities.length + 1),
        ...formData,
        status: 'draft',
        version: '1.0.0',
        createdBy: 'Người dùng hiện tại',
        createdDate: new Date().toISOString().split('T')[0],
        recordCount: 0,
        usageCount: 0,
      };
      setEntities([...entities, newEntity]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ code: '', name: '', entityType: '', description: '', attributes: [] });
    setEditingEntity(null);
    setShowAddModal(false);
  };

  const handleEdit = (entity: MasterDataEntity) => {
    setEditingEntity(entity);
    setFormData({
      code: entity.code,
      name: entity.name,
      entityType: entity.entityType,
      description: entity.description,
      attributes: entity.attributes,
    });
    setShowAddModal(true);
  };

  const handleSendReview = (id: string) => {
    if (confirm('Gửi rà soát và phê duyệt dữ liệu chủ này?')) {
      setEntities(entities.map(ent => 
        ent.id === id ? { ...ent, status: 'review' } : ent
      ));
      alert('Đã gửi yêu cầu phê duyệt dữ liệu chủ');
    }
  };

  const handleApprove = (id: string) => {
    if (confirm('Phê duyệt dữ liệu chủ này?')) {
      setEntities(entities.map(ent => 
        ent.id === id 
          ? { 
              ...ent, 
              status: 'approved',
              approvedBy: 'Lãnh đạo hiện tại',
              approvedDate: new Date().toISOString().split('T')[0]
            } 
          : ent
      ));
      alert('Đã phê duyệt dữ liệu chủ');
    }
  };

  const handleReject = (id: string) => {
    const reason = prompt('Nhập lý do từ chối:');
    if (reason) {
      setEntities(entities.map(ent => 
        ent.id === id 
          ? { 
              ...ent, 
              status: 'rejected',
              rejectionReason: reason,
              approvedBy: 'Lãnh đạo hiện tại',
              approvedDate: new Date().toISOString().split('T')[0]
            } 
          : ent
      ));
      alert('Đã từ chối dữ liệu chủ');
    }
  };

  const handleRevokeApproval = (id: string) => {
    if (confirm('Hủy phê duyệt dữ liệu chủ này?')) {
      setEntities(entities.map(ent => 
        ent.id === id 
          ? { 
              ...ent, 
              status: 'draft',
              approvedBy: undefined,
              approvedDate: undefined
            } 
          : ent
      ));
      alert('Đã hủy phê duyệt dữ liệu chủ');
    }
  };

  const handlePublish = (id: string) => {
    const entity = entities.find(e => e.id === id);
    if (!entity) return;
    
    setSelectedEntity(entity);
    setShowPublishModal(true);
  };

  const handleConfirmPublish = (publishData: any) => {
    if (!selectedEntity) return;
    
    setEntities(entities.map(ent => 
      ent.id === selectedEntity.id 
        ? { 
            ...ent, 
            status: 'published',
            isPublished: true,
            publishedBy: publishData.approver,
            publishedDate: publishData.publishDate,
            publishedDepartment: publishData.department,
            apiEndpoint: publishData.apiEndpoint,
            accessLevel: publishData.accessLevel
          } 
        : ent
    ));
    alert('Đã công khai dữ liệu chủ thành công!');
  };

  const handleUnpublish = (id: string) => {
    if (confirm('Hủy công khai dữ liệu chủ này?')) {
      setEntities(entities.map(ent => 
        ent.id === id 
          ? { 
              ...ent, 
              status: 'approved',
              isPublished: false,
              publishedBy: undefined,
              publishedDate: undefined
            } 
          : ent
      ));
      alert('Đã hủy công khai dữ liệu chủ');
    }
  };

  const handleArchive = (id: string) => {
    if (confirm('Lưu trữ (xóa mềm) dữ liệu chủ này?')) {
      setEntities(entities.map(ent => 
        ent.id === id ? { ...ent, status: 'archived' } : ent
      ));
      alert('Đã lưu trữ dữ liệu chủ');
    }
  };

  const handleLock = (id: string) => {
    if (confirm('Khóa dữ liệu chủ này? Khi khóa, dữ liệu sẽ không thể chỉnh sửa.')) {
      setEntities(entities.map(ent => 
        ent.id === id ? { ...ent, isLocked: true } : ent
      ));
      alert('Đã khóa dữ liệu chủ');
    }
  };

  const handleUnlock = (id: string) => {
    if (confirm('Mở khóa dữ liệu chủ này?')) {
      setEntities(entities.map(ent => 
        ent.id === id ? { ...ent, isLocked: false } : ent
      ));
      alert('Đã mở khóa dữ liệu chủ');
    }
  };

  const handleDelete = (id: string) => {
    const entity = entities.find(e => e.id === id);
    if (!entity) return;

    if (entity.isLocked) {
      alert('Không thể xóa dữ liệu chủ đang bị khóa. Vui lòng mở khóa trước.');
      return;
    }

    if (entity.usageCount && entity.usageCount > 0) {
      if (!confirm(`Cảnh báo: Dữ liệu chủ này đang được sử dụng bởi ${entity.usageCount} hệ thống. Bạn có chắc chắn muốn xóa?`)) {
        return;
      }
    }

    const confirmation = prompt('Nhập lý do xóa dữ liệu chủ:');
    if (confirmation) {
      setEntities(entities.filter(ent => ent.id !== id));
      alert('Đã xóa dữ liệu chủ vĩnh viễn');
    }
  };

  const handleRestore = (id: string) => {
    if (confirm('Khôi phục dữ liệu chủ này?')) {
      setEntities(entities.map(ent => 
        ent.id === id ? { ...ent, status: 'draft' } : ent
      ));
      alert('Đã khôi phục dữ liệu chủ');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Dữ liệu chủ" icon={Database} />
      
      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg p-1 grid grid-cols-7 gap-1">
        <button
          onClick={() => setCurrentTab('setup')}
          className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
            currentTab === 'setup'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Thiết lập
        </button>
        <button
          onClick={() => setCurrentTab('manage')}
          className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
            currentTab === 'manage'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Quản lý dữ liệu
        </button>
        <button
          onClick={() => setCurrentTab('approval')}
          className={`px-3 py-2.5 rounded-lg text-sm transition-colors relative ${
            currentTab === 'approval'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Phê duyệt
          {stats.review > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {stats.review}
            </span>
          )}
        </button>
        <button
          onClick={() => setCurrentTab('publish')}
          className={`px-3 py-2.5 rounded-lg text-sm transition-colors relative ${
            currentTab === 'publish'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Công khai
          {stats.approved > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {stats.approved}
            </span>
          )}
        </button>
        <button
          onClick={() => setCurrentTab('history')}
          className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
            currentTab === 'history'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Lịch sử
        </button>
        <button
          onClick={() => setCurrentTab('search')}
          className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
            currentTab === 'search'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Tra cứu
        </button>
        <button
          onClick={() => setCurrentTab('report')}
          className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
            currentTab === 'report'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Báo cáo
        </button>
      </div>

      {/* Setup Tab */}
      {currentTab === 'setup' && (
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="grid grid-cols-5 gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Thiết lập dữ liệu chủ
            </button>
            <button
              onClick={() => setShowAttributeModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
              Quản lý thuộc tính
            </button>
            <button
              onClick={() => setShowMergeRuleModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <GitBranch className="w-5 h-5" />
              Quy tắc hợp nhất
            </button>
            <button
              onClick={() => setShowRelationshipModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Link2 className="w-5 h-5" />
              Quan hệ thực thể
            </button>
            <button
              onClick={() => setShowIdentifierModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Key className="w-5 h-5" />
              Định danh duy nhất
            </button>
          </div>

          {/* Search */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm dữ liệu chủ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="draft">Nháp</option>
              <option value="review">Chờ phê duyệt</option>
              <option value="approved">Đã phê duyệt</option>
              <option value="published">Đã công khai</option>
              <option value="archived">Đã lưu trữ</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">STT</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Mã dữ liệu chủ</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Tên dữ liệu ch���</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Loại thực thể</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Số thuộc tính</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Phiên bản</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Trạng thái</th>
                    <th className="px-4 py-3 text-right text-xs text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredEntities.map((entity, index) => (
                    <tr key={entity.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-slate-900 font-mono">{entity.code}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{entity.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{entity.entityType}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{entity.attributes.length}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{entity.version}</td>
                      <td className="px-4 py-3">
                        <StatusTag 
                          label={statusLabels[entity.status]} 
                          variant={entity.status === 'published' ? 'blue' : entity.status === 'approved' ? 'green' : entity.status === 'review' ? 'amber' : entity.status === 'rejected' ? 'red' : 'slate'} 
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewingEntity(entity)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {entity.status === 'draft' && (
                            <>
                              <button
                                onClick={() => handleEdit(entity)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Sửa"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setShowAttributeModal(true)}
                                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                title="Quản lý thuộc tính"
                              >
                                <Settings className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredEntities.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                        Không tìm thấy dữ liệu chủ nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Manage Tab */}
      {currentTab === 'manage' && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Tổng dữ liệu chủ</span>
                <Database className="w-5 h-5 text-teal-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.total}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Tổng bản ghi</span>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.totalRecords.toLocaleString()}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Đã công khai</span>
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.published}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Lượt sử dụng</span>
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.totalUsage.toLocaleString()}</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm dữ liệu chủ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Entity List */}
          <div className="space-y-3">
            {filteredEntities.map((entity) => (
              <div key={entity.id} className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-slate-900">{entity.name}</h3>
                      <StatusTag 
                        label={statusLabels[entity.status]} 
                        variant={entity.status === 'published' ? 'blue' : entity.status === 'approved' ? 'green' : entity.status === 'review' ? 'amber' : entity.status === 'rejected' ? 'red' : 'slate'} 
                      />
                      {entity.isPublished && (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Đã công khai
                        </span>
                      )}
                      {entity.isLocked && (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Đã khóa
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{entity.description}</p>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Mã:</span>
                        <span className="ml-2 text-slate-900 font-mono">{entity.code}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Phiên bản:</span>
                        <span className="ml-2 text-slate-900">{entity.version}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Số bản ghi:</span>
                        <span className="ml-2 text-slate-900">{entity.recordCount?.toLocaleString() || 0}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Lượt sử dụng:</span>
                        <span className="ml-2 text-slate-900">{entity.usageCount?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      if (entity.isLocked) {
                        alert('Dữ liệu chủ đang bị khóa. Vui lòng mở khóa trước khi cập nhật.');
                        return;
                      }
                      setSelectedEntity(entity);
                      setShowRecordModal(true);
                    }}
                    className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                      entity.isLocked 
                        ? 'border-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                    disabled={entity.isLocked}
                  >
                    Cập nhật bản ghi
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEntity(entity);
                      setShowVersionModal(true);
                    }}
                    className="px-3 py-2 text-sm border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Quản lý phiên bản
                  </button>
                  {entity.status === 'draft' && (
                    <button
                      onClick={() => handleSendReview(entity.id)}
                      className="px-3 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Gửi phê duyệt
                    </button>
                  )}
                  {entity.isLocked ? (
                    <button
                      onClick={() => handleUnlock(entity.id)}
                      className="px-3 py-2 text-sm border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-2"
                    >
                      <Unlock className="w-4 h-4" />
                      Mở khóa
                    </button>
                  ) : (
                    <button
                      onClick={() => handleLock(entity.id)}
                      className="px-3 py-2 text-sm border border-slate-400 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Khóa
                    </button>
                  )}
                  {entity.status === 'archived' ? (
                    <button
                      onClick={() => handleRestore(entity.id)}
                      className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Khôi phục
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleArchive(entity.id)}
                        className="px-3 py-2 text-sm border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
                      >
                        <Archive className="w-4 h-4" />
                        Lưu trữ
                      </button>
                      <button
                        onClick={() => handleDelete(entity.id)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                          entity.isLocked
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                        disabled={entity.isLocked}
                        title={entity.isLocked ? 'Cần mở khóa trước khi xóa' : 'Xóa dữ liệu chủ'}
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approval Tab */}
      {currentTab === 'approval' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm dữ liệu chủ chờ phê duyệt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-3">
            {filteredEntities.map((entity) => (
              <div key={entity.id} className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-slate-900">{entity.name}</h3>
                      <StatusTag 
                        label="Chờ phê duyệt" 
                        variant="amber" 
                      />
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{entity.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Mã:</span>
                        <span className="ml-2 text-slate-900 font-mono">{entity.code}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Người tạo:</span>
                        <span className="ml-2 text-slate-900">{entity.createdBy}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Ngày tạo:</span>
                        <span className="ml-2 text-slate-900">{entity.createdDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setViewingEntity(entity)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => handleReject(entity.id)}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Từ chối
                  </button>
                  <button
                    onClick={() => handleApprove(entity.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Phê duyệt
                  </button>
                </div>
              </div>
            ))}
            {filteredEntities.length === 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">Không có dữ liệu chủ nào cần phê duyệt</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Publish Tab */}
      {currentTab === 'publish' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Đã công khai</span>
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.published}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Đã phê duyệt</span>
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.approved}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Tổng lượt sử dụng</span>
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl text-slate-900">{stats.totalUsage.toLocaleString()}</div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm dữ liệu chủ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-3">
            {entities.filter(e => e.status === 'approved' || e.status === 'published').filter(entity => 
              entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              entity.code.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((entity) => (
              <div key={entity.id} className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-slate-900">{entity.name}</h3>
                      {entity.isPublished ? (
                        <StatusTag 
                          label="Đã công khai" 
                          variant="emerald" 
                          icon={<Globe className="w-3 h-3" />}
                        />
                      ) : (
                        <StatusTag 
                          label="Sẵn sàng công khai" 
                          variant="blue" 
                        />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{entity.description}</p>
                    <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-slate-500">Mã:</span>
                        <span className="ml-2 text-slate-900 font-mono">{entity.code}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Phiên bản:</span>
                        <span className="ml-2 text-slate-900">{entity.version}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Số bản ghi:</span>
                        <span className="ml-2 text-slate-900">{entity.recordCount?.toLocaleString() || 0}</span>
                      </div>
                      {entity.isPublished && (
                        <div>
                          <span className="text-slate-500">Lượt sử dụng:</span>
                          <span className="ml-2 text-slate-900">{entity.usageCount?.toLocaleString() || 0}</span>
                        </div>
                      )}
                    </div>
                    {entity.isPublished && entity.apiEndpoint && (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-slate-500">API Endpoint:</span>
                            <code className="ml-2 text-emerald-700 bg-white px-2 py-0.5 rounded text-xs">
                              {entity.apiEndpoint}
                            </code>
                          </div>
                          {entity.publishedDepartment && (
                            <div>
                              <span className="text-slate-500">Đơn vị duyệt:</span>
                              <span className="ml-2 text-slate-900">{entity.publishedDepartment}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  {entity.isPublished ? (
                    <button
                      onClick={() => handleUnpublish(entity.id)}
                      className="px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
                    >
                      <GlobeLock className="w-4 h-4" />
                      Hủy công khai
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePublish(entity.id)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      Công khai dữ liệu chủ
                    </button>
                  )}
                  {entity.status === 'approved' && (
                    <button
                      onClick={() => handleRevokeApproval(entity.id)}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Hủy phê duyệt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {currentTab === 'history' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm lịch sử thay đổi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-lg">
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-slate-900 flex items-center gap-2">
                <HistoryIcon className="w-5 h-5 text-teal-600" />
                Lịch sử thay đổi dữ liệu chủ
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Timeline items */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-0.5 h-full bg-slate-200"></div>
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm text-slate-900">Công khai dữ liệu chủ "Công dân"</p>
                        <p className="text-xs text-slate-500">bởi Lãnh đạo C • 25/01/2024 10:30</p>
                      </div>
                      <StatusTag label="Công khai" variant="green" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-0.5 h-full bg-slate-200"></div>
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm text-slate-900">Phê duyệt dữ liệu chủ "Công dân"</p>
                        <p className="text-xs text-slate-500">bởi Trần Thị B • 20/01/2024 14:20</p>
                      </div>
                      <StatusTag label="Phê duyệt" variant="blue" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div className="w-0.5 h-full bg-slate-200"></div>
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm text-slate-900">Cập nhật phiên bản 2.1.0</p>
                        <p className="text-xs text-slate-500">bởi Nguyễn Văn A • 15/01/2024 09:15</p>
                      </div>
                      <StatusTag label="Cập nhật" variant="purple" />
                    </div>
                    <div className="text-xs text-slate-600 mt-2">
                      <p>• Thêm thuộc tính "Nơi ĐKHK"</p>
                      <p>• Cập nhật quy tắc hợp nhất</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm text-slate-900">Tạo dữ liệu chủ "Công dân"</p>
                        <p className="text-xs text-slate-500">bởi Nguyễn Văn A • 10/01/2024 08:00</p>
                      </div>
                      <StatusTag label="Tạo mới" variant="slate" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Tab */}
      {currentTab === 'search' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-slate-900 mb-4">Tra cứu dữ liệu chủ</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mã dữ liệu chủ</label>
                <input
                  type="text"
                  placeholder="Nhập mã..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tên dữ liệu chủ</label>
                <input
                  type="text"
                  placeholder="Nhập tên..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Loại thực thể</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">Tất cả</option>
                  <option value="person">Người</option>
                  <option value="org">Tổ chức</option>
                  <option value="location">Địa điểm</option>
                  <option value="asset">Tài sản</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">Tất cả</option>
                  <option value="draft">Nháp</option>
                  <option value="approved">Đã phê duyệt</option>
                  <option value="published">Đã công khai</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                Đặt lại
              </button>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
                <Search className="w-4 h-4" />
                Tra cứu
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Mã</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Tên dữ liệu chủ</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Loại</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Phiên bản</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Số bản ghi</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Trạng thái</th>
                    <th className="px-4 py-3 text-right text-xs text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {entities.map((entity) => (
                    <tr key={entity.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-900 font-mono">{entity.code}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{entity.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{entity.entityType}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{entity.version}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{entity.recordCount?.toLocaleString() || 0}</td>
                      <td className="px-4 py-3">
                        <StatusTag 
                          label={statusLabels[entity.status]} 
                          variant={entity.status === 'published' ? 'blue' : entity.status === 'approved' ? 'green' : entity.status === 'review' ? 'amber' : entity.status === 'rejected' ? 'red' : 'slate'} 
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setViewingEntity(entity)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Report Tab */}
      {currentTab === 'report' && (
        <div className="space-y-4">
          {/* Report Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900">Báo cáo sử dụng dữ liệu chủ</h3>
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Thống kê chi tiết về việc sử dụng dữ liệu chủ trong hệ thống
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tổng lượt truy cập:</span>
                  <span className="text-slate-900 font-medium">{stats.totalUsage.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Trung bình/ngày:</span>
                  <span className="text-slate-900 font-medium">245</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900">Báo cáo vòng đời dữ liệu</h3>
                <HistoryIcon className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Phân tích chi tiết vòng đời của các dữ liệu chủ
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Trung bình (ngày):</span>
                  <span className="text-slate-900 font-medium">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Lâu nhất:</span>
                  <span className="text-slate-900 font-medium">120 ngày</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900">Báo cáo chất lượng</h3>
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Đánh giá chất lượng và tính toàn vẹn của dữ liệu chủ
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Độ chính xác:</span>
                  <span className="text-green-700 font-medium">98.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tính đầy đủ:</span>
                  <span className="text-green-700 font-medium">96.2%</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </button>
            </div>
          </div>

          {/* Charts */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-slate-900 mb-4">Biểu đồ sử dụng dữ liệu chủ theo thời gian</h3>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
              <p className="text-slate-500">Biểu đồ sẽ hiển thị ở đây</p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
              <h2 className="text-slate-900">
                {editingEntity ? 'Chỉnh sửa dữ liệu chủ' : 'Thiết lập dữ liệu chủ mới'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Mã dữ liệu chủ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="VD: MD_PERSON"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Loại thực thể <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.entityType}
                    onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">-- Chọn loại --</option>
                    <option value="Người">Người</option>
                    <option value="Tổ chức">Tổ chức</option>
                    <option value="Địa điểm">Địa điểm</option>
                    <option value="Tài sản">Tài sản</option>
                    <option value="Sự kiện">Sự kiện</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Tên dữ liệu chủ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="VD: Dữ liệu chủ - Công dân"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={3}
                  placeholder="Mô tả chi tiết về dữ liệu chủ..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  {editingEntity ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingEntity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
              <h2 className="text-slate-900">Chi tiết dữ liệu chủ</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Mã dữ liệu chủ</label>
                  <p className="text-slate-900 font-mono">{viewingEntity.code}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Trạng thái</label>
                  <StatusTag 
                    label={statusLabels[viewingEntity.status]} 
                    variant={viewingEntity.status === 'published' ? 'blue' : viewingEntity.status === 'approved' ? 'green' : viewingEntity.status === 'review' ? 'amber' : viewingEntity.status === 'rejected' ? 'red' : 'slate'} 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-500 mb-1">Tên dữ liệu chủ</label>
                  <p className="text-slate-900">{viewingEntity.name}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-500 mb-1">Mô tả</label>
                  <p className="text-slate-900">{viewingEntity.description}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Loại thực thể</label>
                  <p className="text-slate-900">{viewingEntity.entityType}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Phiên bản</label>
                  <p className="text-slate-900">{viewingEntity.version}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-500 mb-1">Thuộc tính</label>
                  <div className="flex flex-wrap gap-2">
                    {viewingEntity.attributes.map((attr, i) => (
                      <span key={i} className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Số bản ghi</label>
                  <p className="text-slate-900">{viewingEntity.recordCount?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Lượt sử dụng</label>
                  <p className="text-slate-900">{viewingEntity.usageCount?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Người tạo</label>
                  <p className="text-slate-900">{viewingEntity.createdBy}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Ngày tạo</label>
                  <p className="text-slate-900">{viewingEntity.createdDate}</p>
                </div>
                {viewingEntity.approvedBy && (
                  <>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Người phê duyệt</label>
                      <p className="text-slate-900">{viewingEntity.approvedBy}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Ngày phê duyệt</label>
                      <p className="text-slate-900">{viewingEntity.approvedDate}</p>
                    </div>
                  </>
                )}
                {viewingEntity.isPublished && (
                  <>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Người công khai</label>
                      <p className="text-slate-900">{viewingEntity.publishedBy}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Ngày công khai</label>
                      <p className="text-slate-900">{viewingEntity.publishedDate}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => setViewingEntity(null)}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAttributeModal && (
        <AttributeManagementModal 
          onClose={() => setShowAttributeModal(false)}
          entityName={selectedEntity?.name || 'Dữ liệu chủ'}
        />
      )}

      {showMergeRuleModal && (
        <MergeRuleModal 
          onClose={() => setShowMergeRuleModal(false)}
          entityName={selectedEntity?.name || 'Dữ liệu chủ'}
        />
      )}

      {showRelationshipModal && (
        <RelationshipModal 
          onClose={() => setShowRelationshipModal(false)}
        />
      )}

      {showIdentifierModal && (
        <IdentifierRuleModal 
          onClose={() => setShowIdentifierModal(false)}
          entityName={selectedEntity?.name || 'Dữ liệu chủ'}
        />
      )}

      {showRecordModal && selectedEntity && (
        <UpdateMasterDataModal 
          onClose={() => {
            setShowRecordModal(false);
            setSelectedEntity(null);
          }}
          entityName={selectedEntity.name}
          entityId={selectedEntity.id}
        />
      )}

      {showPublishModal && selectedEntity && (
        <PublishMasterDataModal 
          onClose={() => {
            setShowPublishModal(false);
            setSelectedEntity(null);
          }}
          onConfirm={handleConfirmPublish}
          entityName={selectedEntity.name}
          entityCode={selectedEntity.code}
        />
      )}
    </div>
  );
}
