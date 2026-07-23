import { useState } from 'react';
import { Settings, Sliders, GitCompare, Network, Key, Plus, Edit, Trash2, X, Search, Filter, Circle, CheckSquare, ChevronDown, Eye, FileText, Clock, XCircle, Send } from 'lucide-react';
import { AttributesManagementTab } from './AttributesManagementTab';
import { MasterDataWizard } from './MasterDataWizard';
import { MergeRulesManagementTab } from './MergeRulesManagementTab';
import { EntityRelationshipsTab } from './EntityRelationshipsTab';
import { UniqueIdentifierRulesTab } from './UniqueIdentifierRulesTab';
import { ApprovalTab } from './ApprovalTab';
import { ReviewResultCard } from '../category/components/modals/ReviewResultCard';
import { Portal } from '../../common/Portal';

type TabType = 'setup' | 'attributes' | 'merge-rules' | 'relationships' | 'identifier-rules' | 'approval';

type LifecycleStatus = 'active' | 'draft' | 'inactive' | 'archived';
type DataType = 'individual' | 'organization' | 'legal' | 'asset';
type ScopeType = 'national' | 'ministry' | 'provincial' | 'internal';
type DataSourceType = 'dldc' | 'manual';
type UpdateStrategyType = 'reference' | 'scheduled' | 'realtime';
type SyncFrequencyType = 'daily' | 'weekly' | 'monthly' | 'event';
type FieldDataType = 'string' | 'number' | 'date' | 'datetime' | 'boolean' | 'text' | 'email' | 'phone' | 'url';
type SourceKind = 'table' | 'view' | 'query';
type SourceGrain = '1:1' | '1:n';

interface EntitySource {
  id: string;
  name: string;
  kind: SourceKind;
  grain: SourceGrain;
}

interface MasterDataAttribute {
  id: string;
  fieldName: string;
  displayName: string;
  dataType: FieldDataType;
  length?: number;
  required: boolean;
  unique: boolean;
  indexed: boolean;
  defaultValue?: string;
  description?: string;
  validationRules?: string;
  createdDate: string;
  version: number;
}

interface MasterDataEntity {
  id: string;
  code: string;
  name: string;
  dataType: DataType;
  managingAgency: string;
  scope: ScopeType;
  description: string;
  lifecycleStatus: LifecycleStatus;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy?: string;
  systemName?: string;
  // Đăng ký nguồn dữ liệu (giống Bước 1 Wizard)
  sources?: EntitySource[];
  // Data source fields
  dataSource?: DataSourceType;
  dldcTable?: string;
  dldcColumns?: string[];
  apiSystem?: string;
  apiManagingUnit?: string;
  apiEndpoint?: string;
  apiMethod?: 'GET' | 'POST' | 'PUT';
  updateStrategy?: UpdateStrategyType;
  syncFrequency?: SyncFrequencyType;
  // Trình duyệt & phê duyệt
  requestStatus?: 'pending' | 'approved' | 'rejected';
  submissionContent?: string;
  reviewComment?: string;
}

const defaultEntities: MasterDataEntity[] = [
  {
    id: '1',
    code: 'MD-CITIZEN-001',
    name: 'Bộ dữ liệu chủ Công dân',
    dataType: 'individual',
    managingAgency: 'Cục Hành chính tư pháp',
    scope: 'national',
    description: 'Dữ liệu chuẩn về công dân Việt Nam bao gồm thông tin cá nhân như họ tên, ngày sinh, số CCCD, nơi cư trú theo quy định của Luật CCCD 2023',
    lifecycleStatus: 'active',
    createdDate: '01/01/2024',
    updatedDate: '10/12/2024',
    createdBy: 'Nguyễn Văn A',
    updatedBy: 'Trần Thị Bình',
    systemName: 'CSDL hộ tịch điện tử',
    sources: [
      { id: 'src-1-1', name: 'Hộ tịch', kind: 'table', grain: '1:1' },
      { id: 'src-1-2', name: 'CCCD', kind: 'table', grain: '1:1' },
    ],
    dataSource: 'dldc',
    dldcTable: 'tbl_citizen',
    requestStatus: 'approved',
    submissionContent: 'Gửi phê duyệt bộ dữ liệu chủ Công dân',
    reviewComment: 'Đã xem xét kỹ lưỡng. Cấu trúc dữ liệu hợp lý, quy tắc hợp nhất và định danh đầy đủ. Phê duyệt.'
  },
  {
    id: '2',
    code: 'MD-ORG-001',
    name: 'Bộ dữ liệu chủ Tổ chức',
    dataType: 'organization',
    managingAgency: 'Cục Đăng ký kinh doanh',
    scope: 'national',
    description: 'Thông tin doanh nghiệp, tổ chức, cơ quan nhà nước bao gồm tên, mã số thuế, địa chỉ, người đại diện',
    lifecycleStatus: 'active',
    createdDate: '15/01/2024',
    updatedDate: '20/11/2024',
    createdBy: 'Trần Thị B',
    updatedBy: 'Lê Minh Cường',
    systemName: 'Hệ thống đăng ký kinh doanh',
    dataSource: 'dldc',
    dldcTable: 'tbl_business_registry'
  },
  {
    id: '3',
    code: 'MD-DOC-001',
    name: 'Bộ dữ liệu chủ Văn bản pháp luật',
    dataType: 'legal',
    managingAgency: 'Bộ Tư pháp',
    scope: 'national',
    description: 'Danh mục văn bản pháp luật, nghị định, thông tư, quyết định',
    lifecycleStatus: 'active',
    createdDate: '10/02/2024',
    updatedDate: '05/12/2024',
    createdBy: 'Lê Văn C',
    updatedBy: 'Phạm Quốc Hùng',
    systemName: 'Cơ sở dữ liệu quốc gia về pháp luật',
    dataSource: 'dldc',
    dldcTable: 'tbl_legal_document'
  },
  {
    id: '4',
    code: 'MD-ADMIN-001',
    name: 'Bộ dữ liệu chủ Đơn vị hành chính',
    dataType: 'organization',
    managingAgency: 'Bộ Nội vụ',
    scope: 'national',
    description: 'Danh mục 63 tỉnh/thành phố, quận/huyện, phường/xã của Việt Nam',
    lifecycleStatus: 'active',
    createdDate: '20/01/2024',
    updatedDate: '15/10/2024',
    createdBy: 'Phạm Thị D',
    updatedBy: 'Phạm Thị D',
    systemName: 'Hệ thống quản lý đơn vị hành chính',
    dataSource: 'dldc',
    dldcTable: 'tbl_administrative_unit'
  },
  {
    id: '5',
    code: 'MD-AGENCY-001',
    name: 'Bộ dữ liệu chủ Cơ quan nhà nước',
    dataType: 'organization',
    managingAgency: 'Bộ Nội vụ',
    scope: 'national',
    description: 'Danh sách các cơ quan nhà nước, bộ, ngành, sở, ban',
    lifecycleStatus: 'draft',
    createdDate: '01/03/2024',
    updatedDate: '18/12/2024',
    createdBy: 'Hoàng Văn E',
    updatedBy: 'Hoàng Văn E',
    dataSource: 'manual',
    requestStatus: 'rejected',
    submissionContent: 'Gửi phê duyệt bộ dữ liệu chủ Cơ quan nhà nước',
    reviewComment: 'Thiếu quy tắc định danh duy nhất. Cần bổ sung quy tắc hợp nhất từ các nguồn khác nhau. Vui lòng hoàn thiện và gửi lại.'
  }
];

const dataTypeLabels: Record<DataType, string> = {
  individual:   'Thực thể Cá nhân',
  organization: 'Thực thể Tổ chức',
  legal:        'Thực thể Văn bản/Sự kiện pháp lý',
  asset:        'Thực thể Tài sản',
};

const scopeLabels: Record<ScopeType, string> = {
  national: 'Cấp quốc gia',
  ministry: 'Cấp bộ',
  provincial: 'Cấp tỉnh/thành',
  internal: 'Nội bộ'
};

const lifecycleLabels: Record<LifecycleStatus, { label: string; color: string }> = {
  active: { label: 'Đã hiệu lực', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Đang soạn thảo', color: 'bg-yellow-100 text-yellow-700' },
  inactive: { label: 'Ngừng sử dụng', color: 'bg-red-100 text-red-700' },
  archived: { label: 'Đã lưu trữ', color: 'bg-slate-100 text-slate-700' }
};

const MANAGING_UNITS = [
  'Cục Hành chính tư pháp',
  'Cục Bổ trợ tư pháp',
  'Cục Phổ biến, GDPL và Trợ giúp pháp lý',
  'Cục Đăng ký giao dịch bảo đảm và Bồi thường nhà nước',
  'Cục Quản lý thi hành án dân sự',
  'Cục Đăng ký kinh doanh',
  'Cục Công nghệ thông tin',
  'Vụ Pháp luật dân sự - Kinh tế',
  'Vụ Pháp luật hình sự - Hành chính',
  'Vụ Pháp luật quốc tế',
  'Vụ Các vấn đề chung về xây dựng pháp luật',
  'Vụ Kế hoạch - Tài chính',
  'Văn phòng Bộ',
  'Bộ Tư pháp',
  'Bộ Nội vụ',
  'Bộ Công an',
  'Bộ Kế hoạch và Đầu tư',
];

const ENTITY_SOURCE_OPTIONS = ['Hộ tịch', 'CCCD', 'ĐKKD', 'LLTP', 'Bổ trợ tư pháp'];

const SOURCE_KIND_LABELS: Record<SourceKind, string> = {
  table: 'Bảng',
  view: 'View',
  query: 'Truy vấn',
};

const SOURCE_KIND_COLORS: Record<SourceKind, string> = {
  table: 'bg-blue-50 text-blue-700 border-blue-200',
  view: 'bg-purple-50 text-purple-700 border-purple-200',
  query: 'bg-amber-50 text-amber-700 border-amber-200',
};

const SOURCE_GRAIN_COLORS: Record<SourceGrain, string> = {
  '1:1': 'bg-slate-50 text-slate-700 border-slate-200',
  '1:n': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const MOCK_APPROVERS = [
  { id: 'a1', name: 'Nguyễn Văn An',    position: 'Trưởng phòng',       department: 'Phòng Quản lý dữ liệu' },
  { id: 'a2', name: 'Trần Thị Bình',    position: 'Phó Cục trưởng',     department: 'Cục Hành chính tư pháp' },
  { id: 'a3', name: 'Lê Minh Cường',    position: 'Chuyên viên cao cấp', department: 'Vụ Kế hoạch - Tài chính' },
  { id: 'a4', name: 'Phạm Quốc Hùng',   position: 'Cục trưởng',         department: 'Cục Công nghệ thông tin' },
  { id: 'a5', name: 'Hoàng Thị Lan',    position: 'Trưởng phòng',       department: 'Phòng Nghiệp vụ pháp lý' },
];

export function MasterDataScaleManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('setup');
  const [entities, setEntities] = useState<MasterDataEntity[]>(defaultEntities);
  const [showForm, setShowForm] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [editingEntity, setEditingEntity] = useState<MasterDataEntity | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<LifecycleStatus | 'all'>('all');
  const [filterDataType, setFilterDataType] = useState<string>('all');
  const [filterManagingAgency, setFilterManagingAgency] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPageNum, setCurrentPageNum] = useState(1);

  const [formData, setFormData] = useState<Partial<MasterDataEntity>>({
    name: '',
    dataType: 'individual',
    managingAgency: '',
    scope: 'national',
    description: '',
    systemName: '',
    lifecycleStatus: 'draft',
    sources: []
  });

  // Đăng ký nguồn dữ liệu (chip + form thêm nguồn inline) — giống Bước 1 Wizard
  const [sourceFormOpen, setSourceFormOpen] = useState(false);
  const [sourceForm, setSourceForm] = useState<{ name: string; kind: SourceKind; grain: SourceGrain }>({
    name: ENTITY_SOURCE_OPTIONS[0], kind: 'table', grain: '1:1',
  });

  const handleAddSource = () => {
    if (!sourceForm.name) return;
    const newSource: EntitySource = { id: `src-${Date.now()}`, name: sourceForm.name, kind: sourceForm.kind, grain: sourceForm.grain };
    setFormData(prev => ({ ...prev, sources: [...(prev.sources || []), newSource] }));
    setSourceForm({ name: ENTITY_SOURCE_OPTIONS[0], kind: 'table', grain: '1:1' });
    setSourceFormOpen(false);
  };

  const handleRemoveSource = (sourceId: string) => {
    setFormData(prev => ({ ...prev, sources: (prev.sources || []).filter(s => s.id !== sourceId) }));
  };

  const generateCode = (type: string) => {
    const prefix = type === 'individual' ? 'MD-IND-' : type === 'organization' ? 'MD-ORG-' : type === 'legal' ? 'MD-LGL-' : 'MD-AST-';
    const maxNum = entities
      .filter(e => e.code.startsWith(prefix))
      .map(e => parseInt(e.code.split('-')[2]))
      .reduce((max, num) => Math.max(max, num), 0);
    return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.managingAgency || (!editingEntity && !formData.code?.trim())) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // UC485.3 — Kiểm tra trùng lặp Mã/Tên thực thể (bỏ qua chính bản ghi đang sửa)
    const nameNorm = (formData.name || '').trim().toLowerCase();
    const codeNorm = (formData.code || '').trim().toLowerCase();
    const dupName = entities.some(e => e.id !== editingEntity?.id && e.name.trim().toLowerCase() === nameNorm);
    if (dupName) {
      alert(`Tên thực thể "${formData.name}" đã tồn tại. Vui lòng nhập tên khác.`);
      return;
    }
    if (codeNorm) {
      const dupCode = entities.some(e => e.id !== editingEntity?.id && e.code.trim().toLowerCase() === codeNorm);
      if (dupCode) {
        alert(`Mã thực thể "${formData.code}" đã tồn tại. Vui lòng nhập mã khác.`);
        return;
      }
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    if (editingEntity) {
      // Update existing
      setEntities(entities.map(e =>
        e.id === editingEntity.id
          ? {
            ...e,
            ...formData as MasterDataEntity,
            updatedDate: dateStr
          }
          : e
      ));
    } else {
      // Create new
      const newEntity: MasterDataEntity = {
        id: String(entities.length + 1),
        code: formData.code?.trim() || generateCode(formData.dataType || 'individual'),
        name: formData.name!,
        dataType: formData.dataType!,
        managingAgency: formData.managingAgency!,
        scope: formData.scope!,
        description: formData.description || '',
        systemName: formData.systemName || '',
        lifecycleStatus: formData.lifecycleStatus!,
        sources: formData.sources || [],
        dataSource: formData.dataSource,
        createdDate: dateStr,
        updatedDate: dateStr,
        createdBy: 'Người dùng hiện tại'
      };
      setEntities([...entities, newEntity]);
    }

    handleCloseForm();
  };

  // Chỉnh sửa: mở lại Wizard (từng bước) với dữ liệu thực thể đang sửa
  const handleEdit = (entity: MasterDataEntity) => {
    setEditingEntity(entity);
    setShowWizard(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      setEntities(entities.filter(e => e.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const [viewingEntity, setViewingEntity] = useState<MasterDataEntity | null>(null);

  const [approvalEntity, setApprovalEntity] = useState<MasterDataEntity | null>(null);
  const [selectedApprover, setSelectedApprover] = useState('');
  const [approvalNote, setApprovalNote] = useState('');

  const handleApprove = (entity: MasterDataEntity) => {
    setApprovalEntity(entity);
    setSelectedApprover('');
    setApprovalNote('');
  };

  const handleCloseApprovalModal = () => {
    setApprovalEntity(null);
    setSelectedApprover('');
    setApprovalNote('');
  };

  const handleConfirmApprove = () => {
    if (approvalEntity && selectedApprover) {
      const now = new Date();
      const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      setEntities(entities.map(e =>
        e.id === approvalEntity.id
          ? {
            ...e,
            lifecycleStatus: 'active' as LifecycleStatus,
            updatedDate: dateStr,
            requestStatus: 'approved' as const,
            submissionContent: approvalNote || e.submissionContent
          }
          : e
      ));
      handleCloseApprovalModal();
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEntity(null);
    setSourceFormOpen(false);
    setFormData({
      name: '',
      dataType: 'individual',
      managingAgency: '',
      scope: 'national',
      description: '',
      systemName: '',
      lifecycleStatus: 'draft',
      sources: []
    });
  };

  const filteredEntities = entities.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || e.lifecycleStatus === filterStatus;
    const matchesDataType = filterDataType === 'all' || e.dataType === filterDataType;
    const matchesManagingAgency = filterManagingAgency === 'all' || e.managingAgency === filterManagingAgency;
    return matchesSearch && matchesStatus && matchesDataType && matchesManagingAgency;
  });

  const paginatedEntities = filteredEntities.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const renderPagination = (totalItemsCount: number) => {
    if (totalItemsCount <= 0) return null;
    const totalPages = Math.ceil(totalItemsCount / pageSize);
    const startItem = (currentPageNum - 1) * pageSize + 1;
    const endItem = Math.min(currentPageNum * pageSize, totalItemsCount);

    return (
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
        {/* Left Side: Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-normal">Hiển thị</span>
          <select
            aria-label="Select record count"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPageNum(1);
            }}
            className="px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-[13px] cursor-pointer font-medium"
            title="Số bản ghi trên trang"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-slate-600 font-normal">bản ghi/trang</span>
        </div>

        {/* Right Side: Page Range and Navigation */}
        <div className="flex items-center gap-4">
          <span className="text-slate-600 font-normal">
            {startItem} - {endItem} / {totalItemsCount}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
              disabled={currentPageNum === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPageNum(page)}
                className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${currentPageNum === page
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
              disabled={currentPageNum === totalPages}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-white">
          {[
            { id: 'setup', label: 'Thiết lập thực thể', icon: Settings },
            { id: 'attributes', label: 'Thiết lập thuộc tính', icon: Sliders },
            { id: 'merge-rules', label: 'Thiết lập quy tắc hợp nhất', icon: GitCompare },
            { id: 'relationships', label: 'Thiết lập quan hệ thực thể', icon: Network },
            { id: 'identifier-rules', label: 'Quy tắc định danh duy nhất', icon: Key },
            { id: 'approval', label: 'Phê duyệt', icon: CheckSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-6 py-4 text-[13px] font-medium transition-all border-b-2 cursor-pointer whitespace-nowrap ${activeTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'setup' && (
            <div className="space-y-4">
              {/* Statistics Cards */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] text-slate-500">Tổng số dữ liệu chủ</span>
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{entities.length}</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] text-slate-500">Đang soạn thảo</span>
                    <Clock className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{entities.filter(e => e.lifecycleStatus === 'draft').length}</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] text-slate-500">Đã hiệu lực</span>
                    <CheckSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{entities.filter(e => e.lifecycleStatus === 'active').length}</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] text-slate-500">Ngừng sử dụng</span>
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{entities.filter(e => e.lifecycleStatus === 'inactive').length}</div>
                </div>
              </div>

              {/* Search and Action Bar */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên hoặc mã dữ liệu chủ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-white hover:bg-slate-50/50 font-medium shadow-sm"
                    />
                  </div>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95 shadow-sm"
                    title="Tìm kiếm"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all border cursor-pointer active:scale-95 ${
                      showFilters
                        ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    title={showFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
                  >
                    {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                  </button>
                  <div className="h-6 w-px bg-slate-200 mx-1" />
                  <button
                    onClick={() => { setEditingEntity(null); setShowWizard(true); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-[13px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Tạo mới
                  </button>
                </div>

                {/* Collapsible Filters Panel */}
                {showFilters && (
                  <div className="relative p-4 bg-white border border-slate-200 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] before:content-[''] before:absolute before:-top-[7px] before:right-[208px] md:before:right-[auto] md:before:left-[calc(100%-100px)] lg:before:left-[calc(100%-242px)] before:w-3 before:h-3 before:bg-white before:rotate-45 before:border-l before:border-t before:border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[13px] font-normal text-black uppercase tracking-wider mb-2">Trạng thái vòng đời</label>
                        <div className="relative">
                          <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as LifecycleStatus | 'all')}
                            className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium font-sans"
                          >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đã hiệu lực</option>
                            <option value="draft">Đang soạn thảo</option>
                            <option value="inactive">Ngừng sử dụng</option>
                            <option value="archived">Đã lưu trữ</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[13px] font-normal text-black uppercase tracking-wider mb-2">Loại dữ liệu</label>
                        <div className="relative">
                          <select
                            value={filterDataType}
                            onChange={(e) => setFilterDataType(e.target.value)}
                            className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium font-sans"
                          >
                            <option value="all">Tất cả loại dữ liệu</option>
                            <option value="individual">Thực thể Cá nhân</option>
                            <option value="organization">Thực thể Tổ chức</option>
                            <option value="legal">Thực thể Văn bản/Sự kiện pháp lý</option>
                            <option value="asset">Thực thể Tài sản</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[13px] font-normal text-black uppercase tracking-wider mb-2">Cơ quan quản lý</label>
                        <div className="relative">
                          <select
                            value={filterManagingAgency}
                            onChange={(e) => setFilterManagingAgency(e.target.value)}
                            className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium font-sans"
                          >
                            <option value="all">Tất cả cơ quan</option>
                            {MANAGING_UNITS.map(unit => (
                              <option key={unit} value={unit}>{unit}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Entity List */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">STT</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Mã dữ liệu chủ</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên dữ liệu chủ</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Loại dữ liệu</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Cơ quan quản lý</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Cập nhật lần cuối</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-28">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {paginatedEntities.length > 0 ? (
                        paginatedEntities.map((entity, index) => (
                          <tr key={entity.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-slate-500 text-[13px]">{(currentPageNum - 1) * pageSize + index + 1}</td>
                            <td className="px-6 py-4">
                              <code className="text-[13px] bg-slate-100 px-2 py-1 rounded text-slate-800">{entity.code}</code>
                            </td>
                            <td className="px-6 py-4 text-slate-900 text-[13px]">{entity.name}</td>
                            <td className="px-6 py-4 text-slate-700 text-[13px] font-normal">{dataTypeLabels[entity.dataType]}</td>
                            <td className="px-6 py-4 text-slate-700 text-[13px] font-normal">{entity.managingAgency}</td>
                            <td className="px-6 py-4 text-center text-[13px] text-slate-700">{entity.updatedDate}</td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex justify-center">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[13px] font-normal border whitespace-nowrap ${
                                  entity.lifecycleStatus === 'active'
                                    ? 'bg-green-50 text-green-700 border-green-100'
                                    : entity.lifecycleStatus === 'draft'
                                      ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                      : entity.lifecycleStatus === 'inactive'
                                        ? 'bg-red-50 text-red-700 border-red-100'
                                        : 'bg-slate-50 text-slate-700 border-slate-200'
                                }`}>
                                  {lifecycleLabels[entity.lifecycleStatus]?.label || entity.lifecycleStatus}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setViewingEntity(entity)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
                                  title="Xem chi tiết"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => entity.lifecycleStatus === 'draft' && handleApprove(entity)}
                                  disabled={entity.lifecycleStatus !== 'draft'}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    entity.lifecycleStatus === 'draft'
                                      ? 'text-indigo-600 hover:bg-indigo-50 cursor-pointer'
                                      : 'text-slate-300 cursor-not-allowed'
                                  }`}
                                  title={entity.lifecycleStatus === 'draft' ? 'Gửi trình duyệt' : 'Chỉ gửi được bản ghi đang soạn thảo'}
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(entity)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer transition-colors"
                                  title="Chỉnh sửa"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(entity.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                                  title="Xóa"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={10} className="px-6 py-8 text-center text-[13px] text-slate-500">
                            Không tìm thấy dữ liệu
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {renderPagination(filteredEntities.length)}
              </div>

              {/* Form Modal */}
              {showForm && (
                <Portal>
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-all">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
                      <h3 className="text-[16px] font-bold text-slate-900">
                        {editingEntity ? 'Chỉnh sửa thực thể dữ liệu chủ' : 'Thêm mới thực thể dữ liệu chủ'}
                      </h3>
                      <button onClick={handleCloseForm} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 space-y-4 overflow-y-auto flex-1 text-[13px]">
                      {/* Mã thực thể */}
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                          Mã thực thể <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={editingEntity ? editingEntity.code : (formData.code || '')}
                          onChange={(e) => !editingEntity && setFormData({ ...formData, code: e.target.value })}
                          disabled={!!editingEntity}
                          placeholder="VD: MD-CITIZEN-001"
                          className={`w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none transition-all ${
                            editingEntity
                              ? 'bg-slate-50 text-slate-400'
                              : 'bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium text-slate-700'
                          }`}
                        />
                      </div>

                      {/* Tên dữ liệu chủ */}
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                          Tên dữ liệu chủ <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="VD: Bộ dữ liệu chủ Công dân"
                          className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700"
                        />
                      </div>

                      {/* Đơn vị chủ quản */}
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                          Đơn vị chủ quản <span className="text-red-600">*</span>
                        </label>
                        <select
                          value={formData.managingAgency}
                          onChange={(e) => setFormData({ ...formData, managingAgency: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 cursor-pointer"
                        >
                          <option value="">-- Chọn đơn vị chủ quản --</option>
                          {MANAGING_UNITS.map(u => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </div>

                      {/* Tên cơ sở dữ liệu / Hệ thống */}
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                          Tên cơ sở dữ liệu / Hệ thống
                        </label>
                        <input
                          type="text"
                          value={formData.systemName || ''}
                          onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                          placeholder="VD: CSDL hộ tịch điện tử, Hệ thống TGPL..."
                          className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700"
                        />
                      </div>

                      {/* Loại thực thể + Phạm vi */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                            Loại thực thể <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={formData.dataType}
                            onChange={(e) => setFormData({ ...formData, dataType: e.target.value as DataType })}
                            className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 cursor-pointer"
                          >
                            <option value="individual">Thực thể Cá nhân</option>
                            <option value="organization">Thực thể Tổ chức</option>
                            <option value="legal">Thực thể Văn bản/Sự kiện pháp lý</option>
                            <option value="asset">Thực thể Tài sản</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                            Phạm vi sử dụng <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={formData.scope}
                            onChange={(e) => setFormData({ ...formData, scope: e.target.value as ScopeType })}
                            className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 cursor-pointer"
                          >
                            <option value="national">Cấp quốc gia</option>
                            <option value="ministry">Cấp bộ</option>
                            <option value="provincial">Cấp tỉnh/thành</option>
                            <option value="internal">Nội bộ</option>
                          </select>
                        </div>
                      </div>

                      {/* Mô tả đối tượng */}
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Mô tả đối tượng</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Mô tả tóm tắt về đối tượng dữ liệu chủ này..."
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 resize-none"
                        />
                      </div>

                      {/* Trạng thái vòng đời */}
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                          Trạng thái vòng đời
                        </label>
                        <select
                          value={formData.lifecycleStatus}
                          onChange={(e) => setFormData({ ...formData, lifecycleStatus: e.target.value as LifecycleStatus })}
                          className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 cursor-pointer"
                        >
                          <option value="draft">Đang soạn thảo</option>
                          <option value="active">Đã hiệu lực</option>
                          <option value="inactive">Ngừng sử dụng</option>
                          <option value="archived">Đã lưu trữ</option>
                        </select>
                      </div>

                      {/* Đăng ký nguồn dữ liệu (chip + grain) */}
                      <div className="pt-4 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-[13px] font-bold text-slate-900">Đăng ký nguồn dữ liệu</h4>
                            <p className="text-[13px] text-slate-500 mt-0.5">Các nguồn đã đăng ký được dùng để ánh xạ khi cấu hình thuộc tính</p>
                          </div>
                          {!sourceFormOpen && (
                            <button
                              type="button"
                              onClick={() => setSourceFormOpen(true)}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 text-[13px] font-medium rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" /> Thêm nguồn
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {(formData.sources || []).length === 0 && (
                            <span className="text-[13px] text-slate-400">Chưa đăng ký nguồn dữ liệu nào</span>
                          )}
                          {(formData.sources || []).map(src => (
                            <span
                              key={src.id}
                              className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white border border-slate-200 rounded-full text-[13px]"
                            >
                              <span className="font-medium text-slate-700">{src.name}</span>
                              <span className={`px-1.5 py-0.5 rounded-full border text-[13px] font-medium ${SOURCE_KIND_COLORS[src.kind]}`}>
                                {SOURCE_KIND_LABELS[src.kind]}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded-full border text-[13px] font-medium ${SOURCE_GRAIN_COLORS[src.grain]}`}>
                                {src.grain}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSource(src.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                                title="Xóa nguồn"
                                aria-label="Xóa nguồn"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>

                        {sourceFormOpen && (
                          <div className="mt-3 border border-blue-200 rounded-xl bg-blue-50/30 p-4">
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Tên nguồn</label>
                                <select
                                  value={sourceForm.name}
                                  onChange={(e) => setSourceForm(prev => ({ ...prev, name: e.target.value }))}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                                >
                                  {ENTITY_SOURCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Loại nguồn</label>
                                <select
                                  value={sourceForm.kind}
                                  onChange={(e) => setSourceForm(prev => ({ ...prev, kind: e.target.value as SourceKind }))}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                                >
                                  <option value="table">Bảng</option>
                                  <option value="view">View</option>
                                  <option value="query">Truy vấn</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Độ mịn (Grain)</label>
                                <select
                                  value={sourceForm.grain}
                                  onChange={(e) => setSourceForm(prev => ({ ...prev, grain: e.target.value as SourceGrain }))}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                                >
                                  <option value="1:1">1:1 (Một - Một)</option>
                                  <option value="1:n">1:n (Một - Nhiều)</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-3">
                              <button
                                type="button"
                                onClick={() => { setSourceFormOpen(false); setSourceForm({ name: ENTITY_SOURCE_OPTIONS[0], kind: 'table', grain: '1:1' }); }}
                                className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-[13px] font-medium hover:bg-slate-50 transition-colors"
                              >
                                Hủy
                              </button>
                              <button
                                type="button"
                                onClick={handleAddSource}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" /> Thêm vào danh sách
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Cấu hình nguồn dữ liệu */}
                      <div className="pt-4 border-t border-slate-200">
                        <h4 className="text-[13px] font-bold text-slate-900 mb-3">Cấu hình nguồn dữ liệu</h4>

                        <div className="mb-4">
                          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                            Nguồn dữ liệu <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={formData.dataSource || 'dldc'}
                            onChange={(e) => setFormData({ ...formData, dataSource: e.target.value as DataSourceType })}
                            className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 cursor-pointer"
                          >
                            <option value="dldc">Từ Kho DLDC</option>
                            <option value="manual">Nhập thủ công</option>
                          </select>
                        </div>

                        {(formData.dataSource || 'dldc') === 'dldc' && (
                          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                            <p className="text-[13px] text-blue-700">
                              ℹ️ Cấu hình cơ sở dữ liệu, bảng chính và các trường dữ liệu chi tiết cần thực hiện qua <strong>Tạo mới (Wizard 6 bước)</strong>.
                            </p>
                          </div>
                        )}

                        {formData.dataSource === 'manual' && (
                          <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4">
                            <p className="text-[13px] text-amber-800">
                              ℹ️ Dữ liệu sẽ được nhập thủ công bởi người dùng có quyền. Không cần cấu hình nguồn tự động.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Metadata (if editing) */}
                      {editingEntity && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                          <div>
                            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                              Ngày tạo
                            </label>
                            <input
                              type="text"
                              value={editingEntity.createdDate}
                              disabled
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-400 outline-none text-[13px]"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                              Cập nhật lần cuối
                            </label>
                            <input
                              type="text"
                              value={editingEntity.updatedDate}
                              disabled
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-400 outline-none text-[13px]"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                              Người tạo
                            </label>
                            <input
                              type="text"
                              value={editingEntity.createdBy}
                              disabled
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-400 outline-none text-[13px]"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
                      <button
                        onClick={handleCloseForm}
                        className="bg-white text-[#020817] border border-[#e2e8f0] hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-[13px] transition-colors cursor-pointer active:scale-95 shadow-sm"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-[13px] transition-colors cursor-pointer active:scale-95 shadow-sm"
                      >
                        {editingEntity ? 'Cập nhật' : 'Tạo mới'}
                      </button>
                    </div>
                  </div>
                </div>
              </Portal>
            )}
            </div>
          )}

          {activeTab === 'attributes' && (
            <AttributesManagementTab />
          )}

          {activeTab === 'merge-rules' && (
            <MergeRulesManagementTab />
          )}

          {activeTab === 'relationships' && (
            <EntityRelationshipsTab />
          )}

          {activeTab === 'identifier-rules' && (
            <UniqueIdentifierRulesTab />
          )}

          {activeTab === 'approval' && (
            <ApprovalTab />
          )}
        </div>
      </div>

      {/* Xem chi tiết Modal */}
      {viewingEntity && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                <h3 className="text-[16px] font-bold text-slate-900">Xem chi tiết thực thể dữ liệu chủ</h3>
                <button
                  onClick={() => setViewingEntity(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4 text-[13px]">
                {/* Mã thực thể */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-500 mb-1">Mã thực thể</label>
                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-mono font-semibold text-slate-800">
                    {viewingEntity.code}
                  </div>
                </div>

                {/* Tên dữ liệu chủ */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-500 mb-1">Tên dữ liệu chủ</label>
                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800">
                    {viewingEntity.name}
                  </div>
                </div>

                {/* Đơn vị chủ quản */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-500 mb-1">Đơn vị chủ quản</label>
                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800">
                    {viewingEntity.managingAgency || <span className="text-slate-400 font-normal italic">Chưa cập nhật</span>}
                  </div>
                </div>

                {/* Tên cơ sở dữ liệu / Hệ thống */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-500 mb-1">Tên cơ sở dữ liệu / Hệ thống</label>
                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800">
                    {viewingEntity.systemName || <span className="text-slate-400 font-normal italic">Chưa cập nhật</span>}
                  </div>
                </div>

                {/* Loại thực thể + Phạm vi */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-500 mb-1">Loại thực thể</label>
                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800">
                      {dataTypeLabels[viewingEntity.dataType]}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-500 mb-1">Phạm vi sử dụng</label>
                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800">
                      {scopeLabels[viewingEntity.scope]}
                    </div>
                  </div>
                </div>

                {/* Mô tả đối tượng */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-500 mb-1">Mô tả đối tượng</label>
                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-800 min-h-[72px] whitespace-pre-wrap">
                    {viewingEntity.description || <span className="text-slate-400 italic">Chưa có mô tả</span>}
                  </div>
                </div>

                {/* Trạng thái vòng đời */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-500 mb-1">Trạng thái vòng đời</label>
                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800">
                    {lifecycleLabels[viewingEntity.lifecycleStatus]?.label}
                  </div>
                </div>

                {/* Đăng ký nguồn dữ liệu */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-500 mb-1">Đăng ký nguồn dữ liệu</label>
                  {(viewingEntity.sources || []).length === 0 ? (
                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-400 italic">
                      Chưa đăng ký nguồn dữ liệu nào
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                      {(viewingEntity.sources || []).map(src => (
                        <span
                          key={src.id}
                          className="inline-flex items-center gap-2 pl-3 pr-2.5 py-1 bg-white border border-slate-200 rounded-full text-[13px]"
                        >
                          <span className="font-medium text-slate-700">{src.name}</span>
                          <span className={`px-1.5 py-0.5 rounded-full border text-[13px] font-medium ${SOURCE_KIND_COLORS[src.kind]}`}>
                            {SOURCE_KIND_LABELS[src.kind]}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded-full border text-[13px] font-medium ${SOURCE_GRAIN_COLORS[src.grain]}`}>
                            {src.grain}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Nội dung trình duyệt */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-500 mb-1">Nội dung trình duyệt</label>
                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-800 whitespace-pre-wrap">
                    {viewingEntity.submissionContent || <span className="text-slate-400 italic">Chưa gửi trình duyệt</span>}
                  </div>
                </div>

                {/* Ý kiến phê duyệt / Lý do từ chối */}
                {(viewingEntity.requestStatus === 'approved' || viewingEntity.requestStatus === 'rejected') && (
                  <ReviewResultCard status={viewingEntity.requestStatus} comment={viewingEntity.reviewComment} />
                )}

                {/* Thông tin hệ thống */}
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-[13px] font-bold text-slate-700 mb-3">Thông tin hệ thống</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-slate-500 mb-1">Ngày tạo</label>
                      <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-800">
                        {viewingEntity.createdDate}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-slate-500 mb-1">Người tạo</label>
                      <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800">
                        {viewingEntity.createdBy}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-slate-500 mb-1">Ngày cập nhật gần nhất</label>
                      <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-800">
                        {viewingEntity.updatedDate}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-slate-500 mb-1">Người cập nhật</label>
                      <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800">
                        {viewingEntity.updatedBy || <span className="text-slate-400 font-normal italic">Chưa có</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end gap-3 shrink-0">
                <button
                  onClick={() => { setViewingEntity(null); handleEdit(viewingEntity); }}
                  className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-[13px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => setViewingEntity(null)}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-[13px] transition-colors cursor-pointer shadow-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-slate-900">Xác nhận xóa</h3>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-5">
                <p className="text-[13px] text-slate-600">
                  Bạn có chắc chắn muốn xóa thực thể này? Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="bg-white text-[#020817] border border-[#e2e8f0] hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-[13px] transition-colors cursor-pointer shadow-sm"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-medium text-[13px] transition-colors cursor-pointer shadow-sm"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Gửi trình duyệt Modal */}
      {approvalEntity && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900">Gửi trình duyệt</h3>
                  <p className="text-[12px] text-slate-500 mt-0.5">
                    Bản ghi: <span className="text-indigo-700 font-medium">{approvalEntity.name}</span>
                  </p>
                </div>
                <button
                  onClick={handleCloseApprovalModal}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Chọn người duyệt <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedApprover}
                    onChange={e => setSelectedApprover(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 focus:border-indigo-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                  >
                    <option value="">-- Chọn người duyệt --</option>
                    {MOCK_APPROVERS.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} - {u.position} ({u.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Nội dung yêu cầu
                  </label>
                  <textarea
                    value={approvalNote}
                    onChange={e => setApprovalNote(e.target.value)}
                    rows={4}
                    placeholder="Nhập nội dung gửi kèm (nếu có)..."
                    className="w-full px-3 py-2 border border-slate-200 focus:border-indigo-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="text-[13px] font-semibold text-slate-700 mb-3">Thông tin bản ghi</h4>
                  <div className="space-y-2 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mã dữ liệu chủ:</span>
                      <code className="px-2 py-0.5 bg-white border border-slate-200 text-indigo-700 rounded text-[12px]">
                        {approvalEntity.code}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Loại thực thể:</span>
                      <span className="text-slate-800 font-medium">
                        {dataTypeLabels[approvalEntity.dataType]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cơ quan quản lý:</span>
                      <span className="text-slate-800 font-medium">{approvalEntity.managingAgency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Người tạo:</span>
                      <span className="text-slate-800">{approvalEntity.createdBy}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
                <button
                  onClick={handleCloseApprovalModal}
                  className="bg-white text-[#020817] border border-[#e2e8f0] hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-[13px] transition-colors cursor-pointer shadow-sm"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmApprove}
                  disabled={!selectedApprover}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-[13px] transition-colors shadow-sm ${
                    selectedApprover
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Gửi trình duyệt
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Wizard Modal */}
      <MasterDataWizard
        isOpen={showWizard}
        onClose={() => { setShowWizard(false); setEditingEntity(null); }}
        onSubmit={(wizardData) => {
          const now = new Date();
          const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

          if (editingEntity) {
            // Chế độ sửa: cập nhật thực thể đang chỉnh (giữ nguyên mã, ngày tạo, người tạo)
            setEntities(entities.map(e => e.id === editingEntity.id ? {
              ...e,
              name: wizardData.name,
              dataType: wizardData.dataType,
              managingAgency: wizardData.managingAgency,
              scope: wizardData.scope,
              description: wizardData.description,
              systemName: wizardData.systemName,
              updatedDate: dateStr,
              dataSource: wizardData.dataSource,
              apiSystem: wizardData.apiSystem,
              apiManagingUnit: wizardData.apiManagingUnit,
              apiEndpoint: wizardData.apiEndpoint,
              apiMethod: wizardData.apiMethod,
              updateStrategy: wizardData.updateStrategy,
              syncFrequency: wizardData.syncFrequency,
            } : e));
            setShowWizard(false);
            setEditingEntity(null);
            alert(`✅ Đã cập nhật thực thể "${wizardData.name}".`);
            return;
          }

          const newEntity: MasterDataEntity = {
            id: String(entities.length + 1),
            code: generateCode(wizardData.dataType),
            name: wizardData.name,
            dataType: wizardData.dataType,
            managingAgency: wizardData.managingAgency,
            scope: wizardData.scope,
            description: wizardData.description,
            systemName: wizardData.systemName,
            sources: wizardData.sources,
            lifecycleStatus: 'draft', // Always draft when created via wizard
            createdDate: dateStr,
            updatedDate: dateStr,
            createdBy: 'Người dùng hiện tại',
            dataSource: wizardData.dataSource,
            apiSystem: wizardData.apiSystem,
            apiManagingUnit: wizardData.apiManagingUnit,
            apiEndpoint: wizardData.apiEndpoint,
            apiMethod: wizardData.apiMethod,
            updateStrategy: wizardData.updateStrategy,
            syncFrequency: wizardData.syncFrequency
          };

          setEntities([...entities, newEntity]);
          setShowWizard(false);
          alert(`✅ Tạo thành công "${wizardData.name}" với ${wizardData.attributes.length} thuộc tính!\n\nĐã gửi yêu cầu phê duyệt.`);
        }}
      />
    </div>
  );
}
