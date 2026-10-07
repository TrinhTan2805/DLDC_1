import { useState, type ReactNode } from 'react';
import { Settings, Sliders, GitCompare, Network, Key, Plus, Edit, Trash2, X, Search, Filter, CheckSquare, ChevronLeft, Eye, FileText, Clock, XCircle, Send, AlertCircle, Check, ArrowRight, SquarePen, Info, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { AttributesManagementTab, defaultAttributes, DLDC_ENTITY_DETAIL_CONFIGS } from './AttributesManagementTab';
import { MasterDataWizard } from './MasterDataWizard';
import { MergeRulesManagementTab, mockMergeRules, matchMethodLabels, fuzzyAlgorithmLabels, conflictStrategyLabels, onEmptyLabels } from './MergeRulesManagementTab';
import { EntityRelationshipsTab, mockRelationships, relationTypeLabels, getSourceKey, getTargetKey } from './EntityRelationshipsTab';
import { UniqueIdentifierRulesTab, mockIdentifierRules, buildCode } from './UniqueIdentifierRulesTab';
import { ApprovalTab } from './ApprovalTab';
import { ReviewResultCard } from '../category/components/modals/ReviewResultCard';
import { Portal } from '../../common/Portal';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import {
  Badge, TruncatedText, RowIconAction, Pagination, tabClass, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON,
  ROW_ICON_BTN, MENU_ITEM, TOOLTIP_CLS, INPUT_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, normalizeSearch
} from '../collection/collectionUi';

type TabType = 'setup' | 'attributes' | 'merge-rules' | 'relationships' | 'identifier-rules' | 'approval';

type LifecycleStatus = 'draft' | 'pending' | 'approved' | 'rejected';
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
  // Ngày hiệu lực mặc định gán cho các bản ghi của thực thể, có thể chỉnh sửa khi rà soát bản ghi
  effectiveDate?: string;
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
    lifecycleStatus: 'approved',
    createdDate: '01/01/2024',
    updatedDate: '10/12/2024',
    createdBy: 'Nguyễn Văn A',
    updatedBy: 'Trần Thị Bình',
    systemName: 'CSDL hộ tịch điện tử',
    effectiveDate: '2024-01-01',
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
    lifecycleStatus: 'pending',
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
    lifecycleStatus: 'draft',
    createdDate: '10/02/2024',
    updatedDate: '05/12/2024',
    createdBy: 'Lê Văn C',
    updatedBy: 'Phạm Quốc Hùng',
    systemName: 'Cơ sở dữ liệu quốc gia về pháp luật',
    dataSource: 'dldc',
    dldcTable: 'tbl_legal_document'
  },
  {
    id: '5',
    code: 'MD-AGENCY-001',
    name: 'Bộ dữ liệu chủ Cơ quan nhà nước',
    dataType: 'organization',
    managingAgency: 'Bộ Nội vụ',
    scope: 'national',
    description: 'Danh sách các cơ quan nhà nước, bộ, ngành, sở, ban',
    lifecycleStatus: 'rejected',
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
  draft: { label: 'Đang soạn thảo', color: 'bg-yellow-100 text-yellow-700' },
  pending: { label: 'Chờ phê duyệt', color: 'bg-blue-100 text-blue-700' },
  approved: { label: 'Đã phê duyệt', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-700' }
};

// Quy trình 6 bước — giống hệt các bước của wizard Tạo mới/Chỉnh sửa dữ liệu chủ
const VIEW_STEPS = [
  { number: 1, title: 'Khởi tạo dữ liệu chủ' },
  { number: 2, title: 'Tạo thuộc tính' },
  { number: 3, title: 'Quy tắc hợp nhất' },
  { number: 4, title: 'Thiết lập quan hệ' },
  { number: 5, title: 'Định danh duy nhất' },
  { number: 6, title: 'Quy tắc đánh phiên bản' },
  { number: 7, title: 'Phê duyệt' },
];

// Quy tắc đánh phiên bản (Bước 6) — điều kiện tạo version mới & định dạng số phiên bản
const mockVersioningRules: {
  entityId: string;
  disabledFields: string[];
  autoVersionOnSync: boolean;
  versionFormat: 'increment' | 'yearIncrement' | 'custom';
  customPrefix: string;
  startFrom: string;
}[] = [
  { entityId: '1', disabledFields: ['full_name', 'phone_number'], autoVersionOnSync: true, versionFormat: 'increment', customPrefix: '', startFrom: 'V1' },
  { entityId: '2', disabledFields: ['org_name'], autoVersionOnSync: false, versionFormat: 'yearIncrement', customPrefix: '', startFrom: '2025.1' },
];

const VERSION_FORMAT_LABELS: Record<string, { label: string; example: string }> = {
  increment: { label: 'Số tăng dần', example: 'V1 → V2 → V3' },
  yearIncrement: { label: 'Năm + số tăng dần', example: '2024.1 → 2024.2 → 2025.1' },
  custom: { label: 'Tùy chỉnh', example: '[Prefix] + [Số tự tăng]' },
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

// Màu badge loại nguồn / độ mịn (variant của Badge chuẩn — giữ ý nghĩa màu cũ)
const SOURCE_KIND_COLORS: Record<SourceKind, string> = {
  table: 'blue',
  view: 'purple',
  query: 'amber',
};

const SOURCE_GRAIN_COLORS: Record<SourceGrain, string> = {
  '1:1': 'slate',
  '1:n': 'emerald',
};

const MOCK_APPROVERS = [
  { id: 'a1', name: 'Nguyễn Văn An',    position: 'Trưởng phòng',       department: 'Phòng Quản lý dữ liệu' },
  { id: 'a2', name: 'Trần Thị Bình',    position: 'Phó Cục trưởng',     department: 'Cục Hành chính tư pháp' },
  { id: 'a3', name: 'Lê Minh Cường',    position: 'Chuyên viên cao cấp', department: 'Vụ Kế hoạch - Tài chính' },
  { id: 'a4', name: 'Phạm Quốc Hùng',   position: 'Cục trưởng',         department: 'Cục Công nghệ thông tin' },
  { id: 'a5', name: 'Hoàng Thị Lan',    position: 'Trưởng phòng',       department: 'Phòng Nghiệp vụ pháp lý' },
];

// Màu badge trạng thái vòng đời — giữ nguyên ý nghĩa màu cũ
const STATUS_VARIANT: Record<LifecycleStatus, string> = {
  draft: 'amber',
  pending: 'blue',
  approved: 'green',
  rejected: 'red',
};

// Màu badge loại quan hệ (đồng bộ màn Danh mục dùng chung)
const RELATION_TYPE_VARIANT: Record<string, string> = {
  'one-to-many': 'blue',
  'many-to-many': 'purple',
  'one-to-one': 'emerald',
};

// Bảng chuẩn (compomennt.md 5.3)
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const TR = 'h-12 bg-white border-b border-[#E0E0E0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors';
const TABLE_CLS = 'w-full border-collapse collection-table text-[13px]';
// Thẻ nhóm trong modal Xem chi tiết
const GROUP_CARD = 'rounded-2xl border border-[#E2E8F0] bg-white';
const GROUP_HEAD = 'px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-2';
const GROUP_TITLE = 'text-[14px] font-medium text-[#020817]';
const EMPTY_BOX = 'rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center';
const MUTED = 'text-[#94A3B8]';

// Mục menu ⋯: bị khóa thì hiển thị lý do ngay trong mục (compomennt.md 5.3.2)
const MenuAction = ({ icon, label, reason, danger, onSelect }: { icon: ReactNode; label: string; reason: string | null; danger?: boolean; onSelect: () => void }) => (
  <DropdownMenuItem
    disabled={!!reason}
    onClick={reason ? undefined : onSelect}
    className={`${MENU_ITEM} items-start ${reason ? '' : danger ? 'text-[#DC2626] focus:text-[#DC2626]' : 'text-[#020817]'}`}
  >
    <span className={`mt-0.5 ${reason ? 'text-[#CBD5E1]' : danger ? 'text-[#DC2626]' : 'text-[#475569]'}`}>{icon}</span>
    <span className="flex flex-col">
      <span>{label}</span>
      {reason && <span className="text-[12px] text-[#64748B]">{reason}</span>}
    </span>
  </DropdownMenuItem>
);

// Cặp nhãn – giá trị chỉ đọc (compomennt.md 5.17)
const ViewField = ({ label, children, full, extra }: { label: string; children: ReactNode; full?: boolean; extra?: ReactNode }) => (
  <div className={full ? 'col-span-2' : ''}>
    <div className={`${FIELD_LABEL} mb-1 flex items-center gap-1.5`}>{label}{extra}</div>
    <div className={`${FIELD_VALUE} break-words`}>{children}</div>
  </div>
);

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
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // UC485.3 — Kiểm tra trùng lặp Mã/Tên thực thể (bỏ qua chính bản ghi đang sửa)
    const nameNorm = (formData.name || '').trim().toLowerCase();
    const codeNorm = (formData.code || '').trim().toLowerCase();
    const dupName = entities.some(e => e.id !== editingEntity?.id && e.name.trim().toLowerCase() === nameNorm);
    if (dupName) {
      toast.error(`Tên thực thể "${formData.name}" đã tồn tại. Vui lòng nhập tên khác.`);
      return;
    }
    if (codeNorm) {
      const dupCode = entities.some(e => e.id !== editingEntity?.id && e.code.trim().toLowerCase() === codeNorm);
      if (dupCode) {
        toast.error(`Mã thực thể "${formData.code}" đã tồn tại. Vui lòng nhập mã khác.`);
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
  const [viewStep, setViewStep] = useState(1);

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
            lifecycleStatus: 'pending' as LifecycleStatus,
            updatedDate: dateStr,
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

  // Điều kiện đã áp dụng: chỉ cập nhật khi bấm Tìm kiếm hoặc Enter (compomennt.md 5.19)
  const [applied, setApplied] = useState<{ search: string; status: LifecycleStatus | 'all'; dataType: string; agency: string }>({
    search: '', status: 'all', dataType: 'all', agency: 'all',
  });

  const runSearch = () => {
    setApplied({ search: searchTerm, status: filterStatus, dataType: filterDataType, agency: filterManagingAgency });
    setCurrentPageNum(1);
  };

  const filteredEntities = entities.filter(e => {
    const q = normalizeSearch(applied.search);
    const matchesSearch = q === '' || normalizeSearch(e.name).includes(q) || normalizeSearch(e.code).includes(q);
    const matchesStatus = applied.status === 'all' || e.lifecycleStatus === applied.status;
    const matchesDataType = applied.dataType === 'all' || e.dataType === applied.dataType;
    const matchesManagingAgency = applied.agency === 'all' || e.managingAgency === applied.agency;
    return matchesSearch && matchesStatus && matchesDataType && matchesManagingAgency;
  });

  const paginatedEntities = filteredEntities.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const stats = [
    { label: 'Tổng số dữ liệu chủ', value: entities.length, icon: FileText, bg: 'bg-blue-50', fg: 'text-blue-600' },
    { label: 'Đang soạn thảo', value: entities.filter(e => e.lifecycleStatus === 'draft').length, icon: Clock, bg: 'bg-amber-50', fg: 'text-amber-600' },
    { label: 'Chờ phê duyệt', value: entities.filter(e => e.lifecycleStatus === 'pending').length, icon: Send, bg: 'bg-blue-50', fg: 'text-blue-600' },
    { label: 'Đã phê duyệt', value: entities.filter(e => e.lifecycleStatus === 'approved').length, icon: CheckSquare, bg: 'bg-green-50', fg: 'text-green-600' },
    { label: 'Từ chối', value: entities.filter(e => e.lifecycleStatus === 'rejected').length, icon: XCircle, bg: 'bg-red-50', fg: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden">
        {/* Tabs (compomennt.md 5.9) */}
        <div className="flex border-b border-[#E2E8F0] overflow-x-auto bg-white">
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
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`${tabClass(activeTab === tab.id)} whitespace-nowrap shrink-0`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content — tab Thiết lập bỏ padding ngang vì MainLayout đã có sẵn p-6 */}
        <div className={activeTab === 'setup' ? 'py-6' : 'p-6'}>
          {activeTab === 'setup' && (
            <div className="space-y-4">
              {/* Thẻ thống kê (compomennt.md 5.6.1) */}
              <div className="grid grid-cols-5 gap-4">
                {stats.map(card => (
                  <div key={card.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${card.bg}`}>
                        <card.icon className={`w-5 h-5 ${card.fg}`} />
                      </div>
                      <div>
                        <div className="text-[16px] text-[#64748B]">{card.label}</div>
                        <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{card.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tìm kiếm & bộ lọc (compomennt.md 5.19) */}
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        aria-label="Tìm kiếm dữ liệu chủ"
                        placeholder="Tìm kiếm theo tên hoặc mã dữ liệu chủ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
                        className={SEARCH_INPUT_CLS}
                      />
                    </div>
                    <button
                      type="button"
                      aria-label="Tìm kiếm"
                      title="Tìm kiếm"
                      onClick={runSearch}
                      className={SEARCH_BTN_CLS}
                    >
                      <Search className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Bộ lọc"
                      aria-expanded={showFilters}
                      onClick={() => setShowFilters(!showFilters)}
                      className={filterBtnClass(showFilters)}
                      title={showFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
                    >
                      {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setEditingEntity(null); setShowWizard(true); }}
                    className={BTN_PRIMARY}
                  >
                    <Plus className="w-4 h-4" />
                    Tạo mới
                  </button>
                </div>

                {/* Vùng bộ lọc — áp dụng khi bấm Tìm kiếm */}
                {showFilters && (
                  <div className={FILTER_GRID_CLS}>
                    <div>
                      <label className={FILTER_LABEL}>Trạng thái vòng đời</label>
                      <select
                        aria-label="Trạng thái vòng đời"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as LifecycleStatus | 'all')}
                        className={INPUT_CLS}
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="draft">Đang soạn thảo</option>
                        <option value="pending">Chờ phê duyệt</option>
                        <option value="approved">Đã phê duyệt</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                    </div>

                    <div>
                      <label className={FILTER_LABEL}>Loại dữ liệu</label>
                      <select
                        aria-label="Loại dữ liệu"
                        value={filterDataType}
                        onChange={(e) => setFilterDataType(e.target.value)}
                        className={INPUT_CLS}
                      >
                        <option value="all">Tất cả loại dữ liệu</option>
                        <option value="individual">Thực thể Cá nhân</option>
                        <option value="organization">Thực thể Tổ chức</option>
                        <option value="legal">Thực thể Văn bản/Sự kiện pháp lý</option>
                        <option value="asset">Thực thể Tài sản</option>
                      </select>
                    </div>

                    <div>
                      <label className={FILTER_LABEL}>Cơ quan quản lý</label>
                      <select
                        aria-label="Cơ quan quản lý"
                        value={filterManagingAgency}
                        onChange={(e) => setFilterManagingAgency(e.target.value)}
                        className={INPUT_CLS}
                      >
                        <option value="all">Tất cả cơ quan</option>
                        {MANAGING_UNITS.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Danh sách thực thể (compomennt.md 5.3) */}
              <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className={TABLE_CLS}>
                    <thead className="bg-[#F8FAFC]">
                      <tr className="h-[42px]">
                        <th className={`${TH} text-center w-12`}>STT</th>
                        <th className={`${TH} text-left min-w-[220px]`}>Tên / Mã dữ liệu chủ</th>
                        <th className={`${TH} text-left min-w-[120px]`}>Loại dữ liệu</th>
                        <th className={`${TH} text-left min-w-[140px]`}>Cơ quan quản lý</th>
                        <th className={`${TH} text-left w-px`}>Người tạo / Ngày tạo</th>
                        <th className={`${TH} text-left w-px`}>Cập nhật lần cuối</th>
                        <th className={`${TH} text-left w-px`}>Trạng thái</th>
                        <th className={`${TH} text-center w-px sticky right-0 z-[1] bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEntities.length > 0 ? (
                        paginatedEntities.map((entity, index) => {
                          const sendReason = entity.lifecycleStatus === 'draft' ? null : 'Chỉ gửi được bản ghi đang soạn thảo';
                          return (
                            <tr key={entity.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                              <td className={`${TD} text-center whitespace-nowrap`}>{(currentPageNum - 1) * pageSize + index + 1}</td>
                              <td className={`${TD} text-left max-w-[360px] leading-[18px]`}>
                                <TruncatedText text={entity.name} />
                                <TruncatedText text={entity.code} className="text-[#64748B]" />
                              </td>
                              <td className={`${TD} text-left max-w-[220px]`}>
                                <TruncatedText text={dataTypeLabels[entity.dataType]} />
                              </td>
                              <td className={`${TD} text-left max-w-[240px]`}>
                                <TruncatedText text={entity.managingAgency || '--'} />
                              </td>
                              <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                                <div>{entity.createdBy || '--'}</div>
                                <div className="text-[#64748B]">{entity.createdDate || '--'}</div>
                              </td>
                              <td className={`${TD} text-left whitespace-nowrap`}>{entity.updatedDate}</td>
                              <td className={`${TD} text-left`}>
                                <Badge label={lifecycleLabels[entity.lifecycleStatus]?.label || entity.lifecycleStatus} variant={STATUS_VARIANT[entity.lifecycleStatus]} />
                              </td>
                              <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]`}>
                                {/* Cột thao tác (compomennt.md 5.3.2): 4 thao tác => Xem chi tiết + Chỉnh sửa + menu ⋯ */}
                                <div className="inline-flex items-center justify-center gap-1">
                                  <RowIconAction label="Xem chi tiết" onClick={() => { setViewingEntity(entity); setViewStep(1); }}>
                                    <Eye className="w-4 h-4" />
                                  </RowIconAction>
                                  <RowIconAction label="Chỉnh sửa" onClick={() => handleEdit(entity)}>
                                    <SquarePen className="w-4 h-4" />
                                  </RowIconAction>

                                  <DropdownMenu>
                                    <Tooltip>
                                      {/* Chỉ hiện tooltip khi hover: khi menu đóng focus quay về nút, không để tooltip tự bật đè lên modal */}
                                      <TooltipTrigger asChild onFocus={(e: { preventDefault: () => void }) => e.preventDefault()}>
                                        <span className="inline-flex">
                                          <DropdownMenuTrigger asChild>
                                            <button type="button" aria-label="Thao tác khác" className={ROW_ICON_BTN}>
                                              <MoreVertical className="w-4 h-4" />
                                            </button>
                                          </DropdownMenuTrigger>
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Thao tác khác</TooltipContent>
                                    </Tooltip>
                                    <DropdownMenuContent align="end" className="w-56 rounded-lg border border-[#E2E8F0] bg-white shadow-lg p-1">
                                      <MenuAction icon={<Send className="w-4 h-4" />} label="Gửi trình duyệt" reason={sendReason}
                                        onSelect={() => handleApprove(entity)} />
                                      <MenuAction icon={<Trash2 className="w-4 h-4" />} label="Xóa" reason={null} danger
                                        onSelect={() => handleDelete(entity.id)} />
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-3 py-16 text-center text-[13px] text-[#64748B]">
                            Không tìm thấy dữ liệu
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Phân trang (compomennt.md 5.14) */}
                {filteredEntities.length > 0 && (
                  <Pagination
                    className="border-t border-[#E2E8F0]"
                    currentPage={currentPageNum}
                    totalItems={filteredEntities.length}
                    pageSize={pageSize}
                    onPageChange={setCurrentPageNum}
                    onPageSizeChange={setPageSize}
                  />
                )}
              </div>

              {/* Form Modal (compomennt.md 5.4) */}
              {showForm && (
                <Portal>
                  <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                      <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
                        <h3 className="text-[16px] font-medium text-[#020817]">
                          {editingEntity ? 'Chỉnh sửa thực thể dữ liệu chủ' : 'Thêm mới thực thể dữ liệu chủ'}
                        </h3>
                        <button type="button" aria-label="Đóng" onClick={handleCloseForm} className={BTN_GHOST_ICON}>
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="px-6 py-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                        {/* Mã thực thể */}
                        <div>
                          <label className={LABEL_CLS}>
                            Mã thực thể <span className={REQUIRED_MARK}>*</span>
                          </label>
                          <input
                            type="text"
                            value={editingEntity ? editingEntity.code : (formData.code || '')}
                            onChange={(e) => !editingEntity && setFormData({ ...formData, code: e.target.value })}
                            disabled={!!editingEntity}
                            placeholder="VD: MD-CITIZEN-001"
                            className={INPUT_CLS}
                          />
                        </div>

                        {/* Tên dữ liệu chủ */}
                        <div>
                          <label className={LABEL_CLS}>
                            Tên dữ liệu chủ <span className={REQUIRED_MARK}>*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="VD: Bộ dữ liệu chủ Công dân"
                            className={INPUT_CLS}
                          />
                        </div>

                        {/* Đơn vị chủ quản */}
                        <div>
                          <label className={LABEL_CLS}>
                            Đơn vị chủ quản <span className={REQUIRED_MARK}>*</span>
                          </label>
                          <select
                            aria-label="Đơn vị chủ quản"
                            value={formData.managingAgency}
                            onChange={(e) => setFormData({ ...formData, managingAgency: e.target.value })}
                            className={INPUT_CLS}
                          >
                            <option value="">-- Chọn đơn vị chủ quản --</option>
                            {MANAGING_UNITS.map(u => (
                              <option key={u} value={u}>{u}</option>
                            ))}
                          </select>
                        </div>

                        {/* Tên cơ sở dữ liệu / Hệ thống */}
                        <div>
                          <label className={LABEL_CLS}>Tên cơ sở dữ liệu / Hệ thống</label>
                          <input
                            type="text"
                            value={formData.systemName || ''}
                            onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                            placeholder="VD: CSDL hộ tịch điện tử, Hệ thống TGPL..."
                            className={INPUT_CLS}
                          />
                        </div>

                        {/* Loại thực thể + Phạm vi */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={LABEL_CLS}>
                              Loại thực thể <span className={REQUIRED_MARK}>*</span>
                            </label>
                            <select
                              aria-label="Loại thực thể"
                              value={formData.dataType}
                              onChange={(e) => setFormData({ ...formData, dataType: e.target.value as DataType })}
                              className={INPUT_CLS}
                            >
                              <option value="individual">Thực thể Cá nhân</option>
                              <option value="organization">Thực thể Tổ chức</option>
                              <option value="legal">Thực thể Văn bản/Sự kiện pháp lý</option>
                              <option value="asset">Thực thể Tài sản</option>
                            </select>
                          </div>
                          <div>
                            <label className={LABEL_CLS}>
                              Phạm vi sử dụng <span className={REQUIRED_MARK}>*</span>
                            </label>
                            <select
                              aria-label="Phạm vi sử dụng"
                              value={formData.scope}
                              onChange={(e) => setFormData({ ...formData, scope: e.target.value as ScopeType })}
                              className={INPUT_CLS}
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
                          <label className={LABEL_CLS}>Mô tả đối tượng</label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Mô tả tóm tắt về đối tượng dữ liệu chủ này..."
                            rows={3}
                            className={`${INPUT_CLS} h-auto py-2 resize-none`}
                          />
                        </div>

                        {/* Trạng thái vòng đời */}
                        <div>
                          <label className={LABEL_CLS}>Trạng thái vòng đời</label>
                          <select
                            aria-label="Trạng thái vòng đời"
                            value={formData.lifecycleStatus}
                            onChange={(e) => setFormData({ ...formData, lifecycleStatus: e.target.value as LifecycleStatus })}
                            className={INPUT_CLS}
                          >
                            <option value="draft">Đang soạn thảo</option>
                            <option value="pending">Chờ phê duyệt</option>
                            <option value="approved">Đã phê duyệt</option>
                            <option value="rejected">Từ chối</option>
                          </select>
                        </div>

                        {/* Đăng ký nguồn dữ liệu (chip + grain) */}
                        <div className="pt-4 border-t border-[#E2E8F0]">
                          <div className="flex items-center justify-between gap-4 mb-3">
                            <div>
                              <h4 className={GROUP_TITLE}>Đăng ký nguồn dữ liệu</h4>
                              <p className="text-[13px] text-[#64748B] mt-0.5">Các nguồn đã đăng ký được dùng để ánh xạ khi cấu hình thuộc tính</p>
                            </div>
                            {!sourceFormOpen && (
                              <button
                                type="button"
                                onClick={() => setSourceFormOpen(true)}
                                className={BTN_OUTLINE}
                              >
                                <Plus className="w-4 h-4" /> Thêm nguồn
                              </button>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {(formData.sources || []).length === 0 && (
                              <span className={`text-[13px] ${MUTED}`}>Chưa đăng ký nguồn dữ liệu nào</span>
                            )}
                            {(formData.sources || []).map(src => (
                              <span
                                key={src.id}
                                className="inline-flex items-center gap-2 pl-3 pr-2 py-1 bg-white border border-[#E2E8F0] rounded-2xl text-[13px]"
                              >
                                <span className="text-[#020817]">{src.name}</span>
                                <Badge label={SOURCE_KIND_LABELS[src.kind]} variant={SOURCE_KIND_COLORS[src.kind]} />
                                <Badge label={src.grain} variant={SOURCE_GRAIN_COLORS[src.grain]} />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSource(src.id)}
                                  className="p-0.5 rounded text-[#94A3B8] hover:text-[#DC2626] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                  title="Xóa nguồn"
                                  aria-label="Xóa nguồn"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </span>
                            ))}
                          </div>

                          {sourceFormOpen && (
                            <div className="mt-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                              <div className="grid grid-cols-3 gap-3">
                                <div>
                                  <label className={LABEL_CLS}>Tên nguồn</label>
                                  <select
                                    aria-label="Tên nguồn"
                                    value={sourceForm.name}
                                    onChange={(e) => setSourceForm(prev => ({ ...prev, name: e.target.value }))}
                                    className={INPUT_CLS}
                                  >
                                    {ENTITY_SOURCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label className={LABEL_CLS}>Loại nguồn</label>
                                  <select
                                    aria-label="Loại nguồn"
                                    value={sourceForm.kind}
                                    onChange={(e) => setSourceForm(prev => ({ ...prev, kind: e.target.value as SourceKind }))}
                                    className={INPUT_CLS}
                                  >
                                    <option value="table">Bảng</option>
                                    <option value="view">View</option>
                                    <option value="query">Truy vấn</option>
                                  </select>
                                </div>
                                <div>
                                  <label className={LABEL_CLS}>Độ mịn (Grain)</label>
                                  <select
                                    aria-label="Độ mịn (Grain)"
                                    value={sourceForm.grain}
                                    onChange={(e) => setSourceForm(prev => ({ ...prev, grain: e.target.value as SourceGrain }))}
                                    className={INPUT_CLS}
                                  >
                                    <option value="1:1">1:1 (Một - Một)</option>
                                    <option value="1:n">1:n (Một - Nhiều)</option>
                                  </select>
                                </div>
                              </div>
                              <div className="flex justify-end gap-3 mt-3">
                                <button
                                  type="button"
                                  onClick={() => { setSourceFormOpen(false); setSourceForm({ name: ENTITY_SOURCE_OPTIONS[0], kind: 'table', grain: '1:1' }); }}
                                  className={BTN_OUTLINE}
                                >
                                  Hủy
                                </button>
                                <button
                                  type="button"
                                  onClick={handleAddSource}
                                  className={BTN_PRIMARY}
                                >
                                  <Plus className="w-4 h-4" /> Thêm vào danh sách
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Cấu hình nguồn dữ liệu */}
                        <div className="pt-4 border-t border-[#E2E8F0]">
                          <h4 className={`${GROUP_TITLE} mb-3`}>Cấu hình nguồn dữ liệu</h4>

                          <div className="mb-4">
                            <label className={LABEL_CLS}>
                              Nguồn dữ liệu <span className={REQUIRED_MARK}>*</span>
                            </label>
                            <select
                              aria-label="Nguồn dữ liệu"
                              value={formData.dataSource || 'dldc'}
                              onChange={(e) => setFormData({ ...formData, dataSource: e.target.value as DataSourceType })}
                              className={INPUT_CLS}
                            >
                              <option value="dldc">Từ Kho DLDC</option>
                              <option value="manual">Nhập thủ công</option>
                            </select>
                          </div>

                          {(formData.dataSource || 'dldc') === 'dldc' && (
                            <div className="flex items-start gap-2 rounded-lg border border-[#BFDBFE] bg-[#EAF3FF] p-3">
                              <Info className="w-4 h-4 text-[#155DFC] shrink-0 mt-0.5" />
                              <p className="text-[13px] text-[#020817]">
                                Cấu hình cơ sở dữ liệu, bảng chính và các trường dữ liệu chi tiết cần thực hiện qua <strong className="font-medium">Tạo mới (Wizard 6 bước)</strong>.
                              </p>
                            </div>
                          )}

                          {formData.dataSource === 'manual' && (
                            <div className="flex items-start gap-2 rounded-lg border border-[#FED7AA] bg-[#FFF7ED] p-3">
                              <Info className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                              <p className="text-[13px] text-[#020817]">
                                Dữ liệu sẽ được nhập thủ công bởi người dùng có quyền. Không cần cấu hình nguồn tự động.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Metadata (if editing) */}
                        {editingEntity && (
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E2E8F0]">
                            <div>
                              <label className={LABEL_CLS}>Ngày tạo</label>
                              <input type="text" aria-label="Ngày tạo" value={editingEntity.createdDate} disabled className={INPUT_CLS} />
                            </div>
                            <div>
                              <label className={LABEL_CLS}>Cập nhật lần cuối</label>
                              <input type="text" aria-label="Cập nhật lần cuối" value={editingEntity.updatedDate} disabled className={INPUT_CLS} />
                            </div>
                            <div className="col-span-2">
                              <label className={LABEL_CLS}>Người tạo</label>
                              <input type="text" aria-label="Người tạo" value={editingEntity.createdBy} disabled className={INPUT_CLS} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 shrink-0">
                        <button type="button" onClick={handleCloseForm} className={BTN_OUTLINE}>
                          Hủy
                        </button>
                        <button type="button" onClick={handleSubmit} className={BTN_PRIMARY}>
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

      {/* Xem chi tiết Modal (compomennt.md 5.4) */}
      {viewingEntity && (
        <Portal>
          <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
                <h3 className="text-[16px] font-medium text-[#020817]">Xem chi tiết thực thể dữ liệu chủ</h3>
                <button type="button" aria-label="Đóng" onClick={() => setViewingEntity(null)} className={BTN_GHOST_ICON}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stepper — giống quy trình các bước của Tạo mới/Chỉnh sửa */}
              <div className="px-6 py-4 border-b border-[#E2E8F0] shrink-0">
                <div className="flex items-start justify-between">
                  {VIEW_STEPS.map((step, index) => {
                    const active = viewStep === step.number;
                    return (
                      <div key={step.number} className="flex items-start flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <button
                            type="button"
                            onClick={() => setViewStep(step.number)}
                            aria-label={step.title}
                            aria-current={active ? 'step' : undefined}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-medium transition-colors cursor-pointer shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${
                              active
                                ? 'bg-[#155DFC] text-white'
                                : 'bg-[#EAF3FF] text-[#155DFC] border border-[#BFDBFE] hover:border-[#155DFC]'
                            }`}
                            title={step.title}
                          >
                            {active ? step.number : <Check className="w-4 h-4" />}
                          </button>
                          <p className={`text-[13px] leading-4 mt-1.5 text-center ${active ? 'text-[#155DFC] font-medium' : 'text-[#64748B]'}`}>
                            {step.title}
                          </p>
                        </div>
                        {index < VIEW_STEPS.length - 1 && (
                          <div className="flex-1 h-0.5 bg-[#E2E8F0] mx-1 mt-4" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="px-6 py-4 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                {viewStep === 1 && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <ViewField label="Mã thực thể">{viewingEntity.code}</ViewField>
                    <ViewField label="Tên dữ liệu chủ">{viewingEntity.name}</ViewField>
                    <ViewField label="Loại thực thể">{dataTypeLabels[viewingEntity.dataType]}</ViewField>
                    <ViewField label="Phạm vi sử dụng">{scopeLabels[viewingEntity.scope]}</ViewField>
                    <ViewField label="Đơn vị chủ quản">
                      {viewingEntity.managingAgency || <span className={MUTED}>Chưa cập nhật</span>}
                    </ViewField>
                    <ViewField label="Tên cơ sở dữ liệu / Hệ thống">
                      {viewingEntity.systemName || <span className={MUTED}>Chưa cập nhật</span>}
                    </ViewField>
                    <ViewField label="Mô tả đối tượng" full>
                      <span className="whitespace-pre-wrap">
                        {viewingEntity.description || <span className={MUTED}>Chưa có mô tả</span>}
                      </span>
                    </ViewField>
                    <ViewField
                      label="Ngày hiệu lực"
                      extra={
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              tabIndex={0}
                              aria-label="Ghi chú Ngày hiệu lực"
                              className="inline-flex rounded text-[#94A3B8] hover:text-[#475569] cursor-help outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>
                            Thời gian hiệu lực sẽ được gán với từng bản ghi trong thực thể dữ liệu chủ, hiệu lực của bản ghi có thể chỉnh sửa khi thực hiện rà soát bản ghi.
                          </TooltipContent>
                        </Tooltip>
                      }
                    >
                      {viewingEntity.effectiveDate || <span className={MUTED}>Chưa cập nhật</span>}
                    </ViewField>
                    <ViewField label="Trạng thái vòng đời">
                      <Badge label={lifecycleLabels[viewingEntity.lifecycleStatus]?.label} variant={STATUS_VARIANT[viewingEntity.lifecycleStatus]} />
                    </ViewField>
                    <ViewField label="Đăng ký nguồn dữ liệu" full>
                      {(viewingEntity.sources || []).length === 0 ? (
                        <span className={MUTED}>Chưa đăng ký nguồn dữ liệu nào</span>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          {(viewingEntity.sources || []).map(src => (
                            <span
                              key={src.id}
                              className="inline-flex items-center gap-2 pl-3 pr-1 py-1 bg-white border border-[#E2E8F0] rounded-2xl text-[13px]"
                            >
                              <span className="text-[#020817]">{src.name}</span>
                              <Badge label={SOURCE_KIND_LABELS[src.kind]} variant={SOURCE_KIND_COLORS[src.kind]} />
                              <Badge label={src.grain} variant={SOURCE_GRAIN_COLORS[src.grain]} />
                            </span>
                          ))}
                        </div>
                      )}
                    </ViewField>
                  </div>
                )}

                {/* Bước 2: Tạo thuộc tính */}
                {viewStep === 2 && (() => {
                  const stepAttrs = defaultAttributes[viewingEntity.id] || [];
                  const stepConfig = DLDC_ENTITY_DETAIL_CONFIGS[viewingEntity.id];
                  const stepSources = stepConfig?.sources || [];
                  return (
                  <>
                  <div className={`${GROUP_CARD} overflow-hidden`}>
                    <div className={GROUP_HEAD}>
                      <FileText className="w-4 h-4 text-[#64748B]" />
                      <p className={GROUP_TITLE}>Danh sách thuộc tính</p>
                      <Badge label={`${stepAttrs.length} trường`} variant="blue" />
                    </div>
                    {stepAttrs.length === 0 ? (
                      <p className="text-[13px] text-[#64748B] text-center py-8">Chưa có thuộc tính nào được cấu hình cho thực thể này</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className={TABLE_CLS} style={{ tableLayout: 'fixed' }}>
                          <colgroup>
                            <col style={{ width: '6%' }} />
                            <col style={{ width: '6%' }} />
                            <col style={{ width: '16%' }} />
                            <col style={{ width: '16%' }} />
                            <col style={{ width: '16%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '20%' }} />
                          </colgroup>
                          <thead className="bg-[#F8FAFC]">
                            <tr className="h-[42px]">
                              <th className={`${TH} text-center`}>
                                <input type="checkbox" checked disabled aria-label="Chọn tất cả" className="w-4 h-4 accent-blue-600 cursor-not-allowed" />
                              </th>
                              <th className={`${TH} text-center`}>PK</th>
                              <th className={`${TH} text-left`}>Nguồn (Table)</th>
                              <th className={`${TH} text-left`}>Trường gốc (Column)</th>
                              <th className={`${TH} text-left`}>Tên cột</th>
                              <th className={`${TH} text-left`}>Tên hiển thị</th>
                              <th className={`${TH} text-left`}>Kiểu dữ liệu</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stepAttrs.map(attr => (
                              <tr key={attr.id} className={TR}>
                                <td className={`${TD} text-center`}>
                                  <input type="checkbox" checked disabled aria-label={attr.displayName} className="w-4 h-4 accent-blue-600 cursor-not-allowed" />
                                </td>
                                <td className={`${TD} text-center`}>
                                  <input type="checkbox" checked={attr.unique} disabled aria-label="PK"
                                    className="w-4 h-4 accent-[#D97706] cursor-not-allowed" />
                                </td>
                                <td className={`${TD} text-left`}><TruncatedText text={attr.tableName || '—'} /></td>
                                <td className={`${TD} text-left`}><TruncatedText text={attr.fieldName} /></td>
                                <td className={`${TD} text-left`}><TruncatedText text={attr.fieldName} /></td>
                                <td className={`${TD} text-left`}><TruncatedText text={attr.displayName} /></td>
                                <td className={`${TD} text-left`}><TruncatedText text={String(attr.dataType)} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Ánh xạ cột nguồn → thuộc tính — giống mục Tạo thuộc tính ở Tạo mới/Chỉnh sửa dữ liệu chủ */}
                  <div className={`${GROUP_CARD} overflow-hidden`}>
                    <div className={`${GROUP_HEAD} justify-between`}>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-[#64748B]" />
                        <p className={GROUP_TITLE}>Ánh xạ cột nguồn</p>
                      </div>
                      <span className="text-[13px] text-[#64748B]">{stepSources.length} nguồn</span>
                    </div>
                    {stepAttrs.length === 0 || stepSources.length === 0 ? (
                      <p className="text-[13px] text-[#64748B] text-center py-8">Chưa có ánh xạ nguồn dữ liệu nào được cấu hình cho thực thể này</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className={TABLE_CLS}>
                          <thead className="bg-[#F8FAFC]">
                            <tr className="h-[42px]">
                              <th className={`${TH} text-left`}>Thuộc tính</th>
                              {stepSources.map(src => (
                                <th key={src.id} className={`${TH} text-left`}>{src.name}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {stepAttrs.map(attr => (
                              <tr key={attr.id} className={TR}>
                                <td className={`${TD} text-left max-w-[280px] leading-[18px]`}>
                                  <TruncatedText text={attr.displayName} />
                                  <TruncatedText text={attr.fieldName} className="text-[#64748B]" />
                                </td>
                                {stepSources.map(src => {
                                  const mappedCol = stepConfig?.mapping[attr.fieldName]?.[src.id];
                                  return (
                                    <td key={src.id} className={`${TD} text-left whitespace-nowrap`}>
                                      {mappedCol ? mappedCol : <span className={MUTED}>—</span>}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  </>
                  );
                })()}

                {/* Bước 3: Quy tắc hợp nhất */}
                {viewStep === 3 && (() => {
                  const entityRule = mockMergeRules.find(r => r.entityId === viewingEntity.id);
                  const entityAttrs = defaultAttributes[viewingEntity.id] || [];
                  const fieldLabel = (fieldName: string) => entityAttrs.find(af => af.fieldName === fieldName)?.displayName || fieldName;

                  if (!entityRule) {
                    return (
                      <div className={EMPTY_BOX}>
                        <GitCompare className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
                        <p className="text-[13px] text-[#64748B]">Chưa cấu hình quy tắc hợp nhất cho thực thể này. Xem/thiết lập tại tab "Thiết lập quy tắc hợp nhất" trong Mô hình dữ liệu chủ.</p>
                      </div>
                    );
                  }

                  return (
                    <>
                    {/* Lớp 1: Matching Rules */}
                    <div className={`${GROUP_CARD} overflow-hidden`}>
                      <div className={`${GROUP_HEAD} gap-3`}>
                        <span className="w-6 h-6 rounded-full bg-[#155DFC] text-white text-[13px] font-medium flex items-center justify-center shrink-0">1</span>
                        <div>
                          <p className={GROUP_TITLE}>Lớp 1 — Quy tắc so khớp (Matching Rules)</p>
                          <p className="text-[13px] text-[#64748B]">Xác định khi nào hai bản ghi từ hai nguồn khác nhau được coi là cùng một thực thể</p>
                        </div>
                      </div>
                      <div className="p-4 space-y-3 bg-white">
                        <p className="text-[13px] text-[#475569]">
                          Ngưỡng tự động gộp (≥):{' '}
                          <span className="font-medium text-[#020817] tabular-nums">{entityRule.autoThreshold ?? '-'}%</span>
                        </p>
                        <div className="rounded-lg border border-[#E2E8F0] overflow-hidden">
                          <table className={TABLE_CLS}>
                            <thead className="bg-[#F8FAFC]">
                              <tr className="h-[42px]">
                                <th className={`${TH} text-left`}>Trường đối chiếu</th>
                                <th className={`${TH} text-left`}>Kiểu so khớp</th>
                                <th className={`${TH} text-left`}>Thuật toán</th>
                                <th className={`${TH} text-right w-28`}>Ngưỡng (%)</th>
                                <th className={`${TH} text-right w-28`}>Trọng số (%)</th>
                                <th className={`${TH} text-left w-28`}>Điều kiện</th>
                              </tr>
                            </thead>
                            <tbody>
                              {!entityRule.matchingRulesDetail || entityRule.matchingRulesDetail.length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="px-3 py-6 text-center text-[13px] text-[#64748B]">
                                    Chưa cấu hình quy tắc so khớp
                                  </td>
                                </tr>
                              ) : (
                                entityRule.matchingRulesDetail.map(rule => (
                                  <tr key={rule.id} className={TR}>
                                    <td className={`${TD} text-left`}>{fieldLabel(rule.fieldName)}</td>
                                    <td className={`${TD} text-left`}>{matchMethodLabels[rule.method]}</td>
                                    <td className={`${TD} text-left`}>
                                      {rule.method === 'fuzzy' ? fuzzyAlgorithmLabels[rule.algorithm] : <span className={MUTED}>—</span>}
                                    </td>
                                    <td className={`${TD} text-right tabular-nums`}>
                                      {rule.method === 'fuzzy' ? `${rule.fuzzyThreshold ?? '-'}%` : <span className={MUTED}>—</span>}
                                    </td>
                                    <td className={`${TD} text-right tabular-nums`}>{rule.weight}</td>
                                    <td className={`${TD} text-left`}>
                                      {rule.operator ?? <span className={MUTED}>—</span>}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Trường hard-block */}
                    <div className={`${GROUP_CARD} p-4 space-y-3`}>
                      <div>
                        <p className={GROUP_TITLE}>Trường hard-block</p>
                        <p className="text-[13px] text-[#64748B]">Nếu các trường này khác nhau, hai bản ghi chắc chắn KHÔNG phải cùng thực thể (loại khỏi so khớp)</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {!entityRule.hardBlockFields || entityRule.hardBlockFields.length === 0 ? (
                          <span className={`text-[13px] ${MUTED}`}>Chưa có trường hard-block nào</span>
                        ) : (
                          entityRule.hardBlockFields.map(f => (
                            <Badge key={f} label={fieldLabel(f)} variant="blue" />
                          ))
                        )}
                      </div>
                    </div>

                    {/* Lớp 2: Hợp nhất giá trị (Survivorship) */}
                    <div className={`${GROUP_CARD} overflow-hidden`}>
                      <div className={`${GROUP_HEAD} gap-3`}>
                        <span className="w-6 h-6 rounded-full bg-[#155DFC] text-white text-[13px] font-medium flex items-center justify-center shrink-0">2</span>
                        <div>
                          <p className={GROUP_TITLE}>Lớp 2 — Hợp nhất giá trị (Survivorship)</p>
                          <p className="text-[13px] text-[#64748B]">Với mỗi trường, giá trị nào sẽ tồn tại trong bản ghi chủ cuối cùng</p>
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        {!entityRule.extractionRulesDetail || entityRule.extractionRulesDetail.length === 0 ? (
                          <p className="text-[13px] text-[#64748B] text-center py-6">Chưa cấu hình quy tắc hợp nhất giá trị</p>
                        ) : (
                          <div className="rounded-lg border border-[#E2E8F0] overflow-hidden">
                            <table className={TABLE_CLS}>
                              <thead className="bg-[#F8FAFC]">
                                <tr className="h-[42px]">
                                  <th className={`${TH} text-left`}>Trường</th>
                                  <th className={`${TH} text-left`}>Chiến lược</th>
                                  <th className={`${TH} text-left`}>Nguồn dữ liệu</th>
                                  <th className={`${TH} text-left`}>Khi hết vẫn trống</th>
                                </tr>
                              </thead>
                              <tbody>
                                {entityRule.extractionRulesDetail.map(rule => (
                                  <tr key={rule.id} className={TR}>
                                    <td className={`${TD} text-left`}>{fieldLabel(rule.fieldName)}</td>
                                    <td className={`${TD} text-left`}>{conflictStrategyLabels[rule.conflictStrategy]}</td>
                                    <td className={`${TD} text-left`}>
                                      {rule.conflictStrategy === 'source' ? rule.primarySource : rule.priorityOrder.join(' → ')}
                                    </td>
                                    <td className={`${TD} text-left`}>{onEmptyLabels[rule.onEmpty]}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                    </>
                  );
                })()}

                {/* Bước 4: Thiết lập quan hệ */}
                {viewStep === 4 && (() => {
                  const entityRelationships = mockRelationships.filter(
                    r => r.sourceEntityId === viewingEntity.id || r.targetEntityId === viewingEntity.id
                  );

                  if (entityRelationships.length === 0) {
                    return (
                      <div className={EMPTY_BOX}>
                        <Network className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
                        <p className="text-[13px] text-[#64748B]">Chưa cấu hình quan hệ nào cho thực thể này. Xem/thiết lập tại tab "Thiết lập quan hệ thực thể" trong Mô hình dữ liệu chủ.</p>
                      </div>
                    );
                  }

                  return (
                    <div className={`${GROUP_CARD} overflow-hidden`}>
                      <div className={GROUP_HEAD}>
                        <Network className="w-4 h-4 text-[#64748B]" />
                        <p className={GROUP_TITLE}>Quan hệ thực thể</p>
                        <Badge label={`${entityRelationships.length} quan hệ`} variant="blue" />
                      </div>
                      <div className="overflow-x-auto">
                        <table className={TABLE_CLS}>
                          <thead className="bg-[#F8FAFC]">
                            <tr className="h-[42px]">
                              <th className={`${TH} text-left`}>Thực thể nguồn</th>
                              <th className={`${TH} text-left`}>Khóa nguồn</th>
                              <th className={`${TH} text-left`}>Loại quan hệ</th>
                              <th className={`${TH} text-left`}>Thực thể đích</th>
                              <th className={`${TH} text-left`}>Khóa đích</th>
                              <th className={`${TH} text-left`}>Bảng trung gian / Trường hiển thị</th>
                              <th className={`${TH} text-left`}>Mô tả</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entityRelationships.map(rel => (
                              <tr key={rel.id} className={TR}>
                                <td className={`${TD} text-left max-w-[200px]`}><TruncatedText text={rel.sourceEntityName} /></td>
                                <td className={`${TD} text-left max-w-[160px]`}><TruncatedText text={getSourceKey(rel) || '—'} /></td>
                                <td className={`${TD} text-left`}>
                                  <Badge label={relationTypeLabels[rel.relationType]} variant={RELATION_TYPE_VARIANT[rel.relationType] || 'blue'} />
                                </td>
                                <td className={`${TD} text-left max-w-[200px]`}><TruncatedText text={rel.targetEntityName} /></td>
                                <td className={`${TD} text-left max-w-[160px]`}><TruncatedText text={getTargetKey(rel) || '—'} /></td>
                                <td className={`${TD} text-left max-w-[200px]`}>
                                  <TruncatedText text={rel.relationType === 'many-to-many' ? (rel.junctionTable || '—') : (rel.displayField || '—')} />
                                </td>
                                <td className={`${TD} text-left max-w-[240px]`}><TruncatedText text={rel.description || '—'} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}

                {/* Bước 5: Định danh duy nhất */}
                {viewStep === 5 && (() => {
                  const entityRule = mockIdentifierRules.find(r => r.entityId === viewingEntity.id);

                  if (!entityRule) {
                    return (
                      <div className={EMPTY_BOX}>
                        <Key className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
                        <p className="text-[13px] text-[#64748B]">Chưa cấu hình quy tắc định danh cho thực thể này. Xem/thiết lập tại tab "Quy tắc định danh duy nhất" trong Mô hình dữ liệu chủ.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left */}
                      <div className="space-y-4">
                        <div className={`${GROUP_CARD} p-4 space-y-4`}>
                          <h4 className={GROUP_TITLE}>Cấu trúc mã định danh</h4>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <ViewField label="Tiền tố (Prefix)">{entityRule.prefix || '(không có)'}</ViewField>
                            <ViewField label="Hậu tố (Suffix)">{entityRule.suffix || '(không có)'}</ViewField>
                            <ViewField label="Ký tự phân cách">{entityRule.separator === 'none' ? 'Không dùng' : `"${entityRule.separator}"`}</ViewField>
                            <ViewField label="Độ dài số thứ tự">{entityRule.digits} chữ số</ViewField>
                          </div>
                        </div>

                        <div className={`${GROUP_CARD} p-4 space-y-4`}>
                          <h4 className={GROUP_TITLE}>Số tự tăng</h4>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <ViewField label="Bắt đầu từ">{entityRule.startFrom}</ViewField>
                            <ViewField label="Bước tăng">{entityRule.increment}</ViewField>
                          </div>
                        </div>

                        <div className={`${GROUP_CARD} p-4 flex items-start gap-3`}>
                          <div className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center ${entityRule.checkDuplicate ? 'bg-[#155DFC]' : 'bg-[#E2E8F0]'}`}>
                            {entityRule.checkDuplicate && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-[#020817]">Kiểm tra trùng lặp khi tạo mới</p>
                            <p className="text-[13px] text-[#64748B] mt-1">Hệ thống từ chối tạo bản ghi nếu mã định danh đã tồn tại</p>
                          </div>
                        </div>
                      </div>

                      {/* Right — preview */}
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-[#BFDBFE] bg-[#EAF3FF] p-4 space-y-4">
                          <h4 className={GROUP_TITLE}>Mẫu mã định danh</h4>
                          <div className="bg-white border border-[#BFDBFE] rounded-lg px-6 py-7 text-center">
                            <span className="text-[20px] font-semibold text-[#155DFC] tracking-widest break-all">
                              {buildCode(entityRule, entityRule.startFrom)}
                            </span>
                          </div>
                          <div className="text-[13px]">
                            <div className="flex justify-between items-center py-2 border-b border-[#BFDBFE]">
                              <span className="text-[#475569]">Mã thứ 1:</span>
                              <span className="font-medium text-[#020817]">{buildCode(entityRule, entityRule.startFrom)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[#BFDBFE]">
                              <span className="text-[#475569]">Mã thứ 2:</span>
                              <span className="font-medium text-[#020817]">{buildCode(entityRule, entityRule.startFrom + entityRule.increment)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-[#475569]">Mã thứ 3:</span>
                              <span className="font-medium text-[#020817]">{buildCode(entityRule, entityRule.startFrom + entityRule.increment * 2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Bước 6: Quy tắc đánh phiên bản */}
                {viewStep === 6 && (() => {
                  const entityRule = mockVersioningRules.find(r => r.entityId === viewingEntity.id);
                  const entityAttrs = defaultAttributes[viewingEntity.id] || [];

                  if (!entityRule) {
                    return (
                      <div className={EMPTY_BOX}>
                        <Clock className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
                        <p className="text-[13px] text-[#64748B]">Chưa cấu hình quy tắc đánh phiên bản cho thực thể này. Xem/thiết lập tại tab "Mô hình dữ liệu chủ".</p>
                      </div>
                    );
                  }

                  const formatInfo = VERSION_FORMAT_LABELS[entityRule.versionFormat];

                  return (
                    <div className="space-y-4">
                      {/* Phần 1 — Điều kiện tạo version mới */}
                      <div className={`${GROUP_CARD} overflow-hidden`}>
                        <div className={GROUP_HEAD}>
                          <h4 className={GROUP_TITLE}>Phần 1 — Điều kiện tạo version mới</h4>
                        </div>
                        <div className="divide-y divide-[#E2E8F0]">
                          {entityAttrs.length === 0 ? (
                            <p className="px-4 py-6 text-center text-[13px] text-[#64748B]">Chưa có thuộc tính nào được cấu hình cho thực thể này</p>
                          ) : (
                            entityAttrs.map(attr => {
                              const enabled = !entityRule.disabledFields.includes(attr.fieldName);
                              return (
                                <div key={attr.id} className="flex items-center justify-between gap-4 px-4 py-3">
                                  <span className="text-[13px] text-[#020817]">{attr.displayName}</span>
                                  <span className={`text-[13px] whitespace-nowrap ${enabled ? 'text-[#155DFC]' : MUTED}`}>
                                    {enabled ? 'Thay đổi giá trị → tạo version mới' : 'Không tạo version (chỉ ghi log)'}
                                  </span>
                                </div>
                              );
                            })
                          )}
                        </div>
                        <div className="px-4 py-3 border-t border-[#E2E8F0] bg-white flex items-start gap-3">
                          <div className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center ${entityRule.autoVersionOnSync ? 'bg-[#155DFC]' : 'bg-[#E2E8F0]'}`}>
                            {entityRule.autoVersionOnSync && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-[#020817]">Tự động tạo phiên bản khi đồng bộ từ hệ thống nguồn (re-merge)</p>
                            <p className="text-[13px] text-[#64748B] mt-1">Thay đổi thủ công của Cán bộ luôn cần qua phê duyệt trước khi tạo phiên bản mới.</p>
                          </div>
                        </div>
                      </div>

                      {/* Phần 2 — Định dạng số phiên bản */}
                      <div className={`${GROUP_CARD} p-4 space-y-4`}>
                        <h4 className={GROUP_TITLE}>Phần 2 — Định dạng số phiên bản</h4>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                          <ViewField label="Định dạng phiên bản">{formatInfo.label}</ViewField>
                          <ViewField label="Ví dụ">{formatInfo.example}</ViewField>
                          {entityRule.versionFormat === 'custom' && (
                            <ViewField label="Tiền tố (Prefix)">{entityRule.customPrefix || '(không có)'}</ViewField>
                          )}
                          <ViewField label="Bắt đầu từ">{entityRule.startFrom}</ViewField>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Bước 7: Phê duyệt */}
                {viewStep === 7 && (
                <>
                  <ViewField label="Nội dung trình duyệt" full>
                    <span className="whitespace-pre-wrap">
                      {viewingEntity.submissionContent || <span className={MUTED}>Chưa gửi trình duyệt</span>}
                    </span>
                  </ViewField>

                  {/* Ý kiến phê duyệt / Lý do từ chối */}
                  {(viewingEntity.requestStatus === 'approved' || viewingEntity.requestStatus === 'rejected') && (
                    <ReviewResultCard status={viewingEntity.requestStatus} comment={viewingEntity.reviewComment} />
                  )}

                  {/* Thông tin hệ thống */}
                  <div className="pt-4 border-t border-[#E2E8F0]">
                    <h4 className={SECTION_TITLE}>Thông tin hệ thống</h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <ViewField label="Ngày tạo">{viewingEntity.createdDate}</ViewField>
                      <ViewField label="Người tạo">{viewingEntity.createdBy}</ViewField>
                      <ViewField label="Ngày cập nhật gần nhất">{viewingEntity.updatedDate}</ViewField>
                      <ViewField label="Người cập nhật">
                        {viewingEntity.updatedBy || <span className={MUTED}>Chưa có</span>}
                      </ViewField>
                    </div>
                  </div>
                </>
                )}
              </div>

              <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => { setViewingEntity(null); handleEdit(viewingEntity); }}
                  className={BTN_OUTLINE}
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa
                </button>
                {viewStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setViewStep(viewStep - 1)}
                    className={BTN_OUTLINE}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Quay lại
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewingEntity(null)}
                  className={viewStep < 7 ? BTN_OUTLINE : BTN_PRIMARY}
                >
                  Đóng
                </button>
                {viewStep < 7 && (
                  <button
                    type="button"
                    onClick={() => setViewStep(viewStep + 1)}
                    className={BTN_PRIMARY}
                  >
                    Tiếp theo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Portal>
          <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
                <h3 className="text-[16px] font-medium text-[#020817]">Xác nhận xóa</h3>
                <button type="button" aria-label="Đóng" onClick={() => setDeleteConfirmId(null)} className={BTN_GHOST_ICON}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
                <p className="text-[13px] text-[#020817]">
                  Bạn có chắc chắn muốn xóa thực thể này? Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setDeleteConfirmId(null)} className={BTN_OUTLINE}>
                  Hủy
                </button>
                <button type="button" onClick={handleConfirmDelete} className={BTN_DESTRUCTIVE}>
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
          <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0">
                <div className="min-w-0">
                  <h3 className="text-[16px] font-medium text-[#020817]">Gửi trình duyệt</h3>
                  <p className="text-[13px] text-[#64748B] mt-0.5">
                    Bản ghi: <span className="text-[#020817] font-medium">{approvalEntity.name}</span>
                  </p>
                </div>
                <button type="button" aria-label="Đóng" onClick={handleCloseApprovalModal} className={BTN_GHOST_ICON}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-4 space-y-4 overflow-y-auto custom-scrollbar">
                {/* Thông tin phê duyệt */}
                <div className="rounded-2xl border border-[#E2E8F0] p-4 space-y-4">
                  <h4 className={GROUP_TITLE}>Thông tin phê duyệt</h4>
                  <div>
                    <label className={LABEL_CLS}>
                      Chọn người trình duyệt <span className={REQUIRED_MARK}>*</span>
                    </label>
                    <select
                      aria-label="Chọn người trình duyệt"
                      value={selectedApprover}
                      onChange={e => setSelectedApprover(e.target.value)}
                      className={INPUT_CLS}
                    >
                      <option value="">-- Chọn người trình duyệt --</option>
                      {MOCK_APPROVERS.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} - {u.position} ({u.department})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Ghi chú phê duyệt</label>
                    <textarea
                      value={approvalNote}
                      onChange={e => setApprovalNote(e.target.value)}
                      rows={3}
                      placeholder="Nhập lý do và ghi chú cho việc gửi trình duyệt này..."
                      className={`${INPUT_CLS} h-auto py-2 resize-none`}
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-start gap-2 rounded-lg border border-[#DCFCE7] bg-[#F0FDF4] p-3">
                  <AlertCircle className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <div className="text-[13px] text-[#020817]">
                    <p className="mb-1">Sau khi gửi, dữ liệu chủ sẽ ở trạng thái <strong className="font-medium">"Chờ phê duyệt"</strong>.</p>
                    <p>Người phê duyệt sẽ xem xét và quyết định phê duyệt hoặc từ chối.</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 shrink-0">
                <button type="button" onClick={handleCloseApprovalModal} className={BTN_OUTLINE}>
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApprove}
                  disabled={!selectedApprover}
                  className={BTN_PRIMARY}
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
        isEditMode={!!editingEntity}
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
              effectiveDate: wizardData.effectiveDate,
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
            toast.success(`Đã cập nhật thực thể "${wizardData.name}".`);
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
            effectiveDate: wizardData.effectiveDate,
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
          toast.success(`Tạo thành công "${wizardData.name}" với ${wizardData.attributes.length} thuộc tính!\n\nĐã gửi yêu cầu phê duyệt.`);
        }}
        onSaveDraft={(wizardData) => {
          const now = new Date();
          const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

          if (editingEntity) {
            setEntities(entities.map(e => e.id === editingEntity.id ? {
              ...e,
              name: wizardData.name,
              dataType: wizardData.dataType,
              managingAgency: wizardData.managingAgency,
              scope: wizardData.scope,
              description: wizardData.description,
              systemName: wizardData.systemName,
              effectiveDate: wizardData.effectiveDate,
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
            toast.success(`Đã lưu nháp thực thể "${wizardData.name}".`);
            return;
          }

          const draftEntity: MasterDataEntity = {
            id: String(entities.length + 1),
            code: wizardData.code || generateCode(wizardData.dataType),
            name: wizardData.name,
            dataType: wizardData.dataType,
            managingAgency: wizardData.managingAgency,
            scope: wizardData.scope,
            description: wizardData.description,
            systemName: wizardData.systemName,
            effectiveDate: wizardData.effectiveDate,
            sources: wizardData.sources,
            lifecycleStatus: 'draft',
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

          setEntities([...entities, draftEntity]);
          setShowWizard(false);
          toast.success(`Đã lưu nháp "${wizardData.name}". Bạn có thể tiếp tục chỉnh sửa sau.`);
        }}
      />
    </div>
  );
}
