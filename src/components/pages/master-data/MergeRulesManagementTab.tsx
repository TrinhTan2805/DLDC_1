import { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle, AlertTriangle, Save, GitMerge, ChevronDown, ChevronUp, X, Send, Check, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { BaseModal } from '../../common/BaseModal';
import {
  Badge, RowIconAction, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON, INPUT_CLS, LABEL_CLS,
  REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, SEARCH_INPUT_CLS,
} from '../collection/collectionUi';
import { defaultAttributes } from './AttributesManagementTab';

// Tạm ẩn nút Chỉnh sửa/Xóa theo yêu cầu — chỉ ẩn giao diện, không xóa code/luồng xử lý
const SHOW_EDIT_DELETE_ACTIONS = false;

type RuleStatus = 'active' | 'inactive' | 'testing';
type DataSourceType = 'dldc' | 'lgsp' | 'ndxp' | 'manual';
type MatchStrategy = 'exact' | 'fuzzy' | 'phonetic' | 'custom';
type MergeStrategy = 'priority' | 'weighted' | 'latest' | 'manual';
type MatchMethod = 'exact' | 'fuzzy';
type FuzzyAlgorithm = 'jaro_winkler' | 'levenshtein' | 'phonetic';
type ConditionOperator = 'AND' | 'OR';
type ConflictStrategy = 'source' | 'priority';
type NullHandling = 'next' | 'skip';
type OnEmpty = 'required' | 'warn' | 'allow';

// Lớp 1 — Quy tắc so khớp (giống Bước 3 "So khớp" của wizard Tạo mới dữ liệu chủ)
interface MatchingRuleDetail {
  id: string;
  fieldName: string;
  method: MatchMethod;
  algorithm: FuzzyAlgorithm;
  fuzzyThreshold: number;
  weight: number;
  normalize: boolean;
  operator?: ConditionOperator;
}

// Lớp 2 — Hợp nhất giá trị / Survivorship (giống Bước 3 "Hợp nhất giá trị" của wizard)
interface ExtractionRuleDetail {
  id: string;
  fieldName: string;
  conflictStrategy: ConflictStrategy;
  primarySource: string;
  priorityOrder: string[];
  nullHandling: NullHandling;
  onEmpty: OnEmpty;
}

export interface MergeRule {
  id: string;
  name: string;
  entityId: string;
  entityName: string;
  sources: SourceConfig[];
  matchRules: MatchRuleConfig[];
  extractRules: ExtractRuleConfig[];
  mergeStrategy: MergeStrategy;
  status: RuleStatus;
  createdDate: string;
  lastApplied?: string;
  // Quy tắc hợp nhất chi tiết (giống Bước 3 của wizard Tạo mới dữ liệu chủ)
  autoThreshold?: number;
  reviewThreshold?: number;
  hardBlockFields?: string[];
  matchingRulesDetail?: MatchingRuleDetail[];
  extractionRulesDetail?: ExtractionRuleDetail[];
}

interface SourceConfig {
  sourceType: DataSourceType;
  sourceName: string;
  priority: number;
  weight: number;
  isActive: boolean;
}

interface MatchRuleConfig {
  id: string;
  fieldName: string;
  strategy: MatchStrategy;
  threshold?: number;
  customLogic?: string;
}

interface ExtractRuleConfig {
  id: string;
  sourceField: string;
  targetField: string;
  transformation?: string;
}

export const mockMergeRules: MergeRule[] = [
  {
    id: 'rule-1',
    name: 'Hợp nhất dữ liệu công dân từ CCCD và Hộ tịch',
    entityId: '1',
    entityName: 'Bộ dữ liệu chủ Công dân',
    sources: [
      { sourceType: 'lgsp', sourceName: 'Hệ thống CCCD - Bộ Công an', priority: 1, weight: 60, isActive: true },
      { sourceType: 'lgsp', sourceName: 'Hệ thống Hộ tịch - Bộ Tư pháp', priority: 2, weight: 40, isActive: true }
    ],
    matchRules: [
      { id: 'm1', fieldName: 'citizen_id', strategy: 'exact' },
      { id: 'm2', fieldName: 'full_name', strategy: 'fuzzy', threshold: 85 }
    ],
    extractRules: [
      { id: 'e1', sourceField: 'cccd_number', targetField: 'citizen_id' },
      { id: 'e2', sourceField: 'ho_ten', targetField: 'full_name', transformation: 'UPPERCASE' }
    ],
    mergeStrategy: 'weighted',
    status: 'active',
    createdDate: '15/12/2024',
    lastApplied: '24/12/2024 08:30',
    autoThreshold: 80,
    reviewThreshold: 65,
    hardBlockFields: ['citizen_id'],
    matchingRulesDetail: [
      { id: 'md1', fieldName: 'citizen_id', method: 'exact', algorithm: 'jaro_winkler', fuzzyThreshold: 0, weight: 60, normalize: false, operator: 'OR' },
      { id: 'md2', fieldName: 'full_name', method: 'fuzzy', algorithm: 'jaro_winkler', fuzzyThreshold: 85, weight: 40, normalize: true }
    ],
    extractionRulesDetail: [
      { id: 'ed1', fieldName: 'citizen_id', conflictStrategy: 'source', primarySource: 'Hệ thống CCCD - Bộ Công an', priorityOrder: [], nullHandling: 'next', onEmpty: 'required' },
      { id: 'ed2', fieldName: 'full_name', conflictStrategy: 'priority', primarySource: '', priorityOrder: ['Hệ thống Hộ tịch - Bộ Tư pháp', 'Hệ thống CCCD - Bộ Công an'], nullHandling: 'next', onEmpty: 'warn' }
    ]
  },
  {
    id: 'rule-2',
    name: 'Hợp nhất thông tin doanh nghiệp từ ĐKKD và Thuế',
    entityId: '2',
    entityName: 'Bộ dữ liệu chủ Tổ chức',
    sources: [
      { sourceType: 'dldc', sourceName: 'CSDL Đăng ký kinh doanh', priority: 1, weight: 70, isActive: true },
      { sourceType: 'lgsp', sourceName: 'Hệ thống Thuế - Bộ Tài chính', priority: 2, weight: 30, isActive: true }
    ],
    matchRules: [
      { id: 'm3', fieldName: 'tax_code', strategy: 'exact' },
      { id: 'm4', fieldName: 'business_name', strategy: 'fuzzy', threshold: 80 }
    ],
    extractRules: [
      { id: 'e3', sourceField: 'ma_so_thue', targetField: 'tax_code' },
      { id: 'e4', sourceField: 'ten_doanh_nghiep', targetField: 'business_name' }
    ],
    mergeStrategy: 'priority',
    status: 'active',
    createdDate: '10/12/2024',
    lastApplied: '23/12/2024 15:20',
    autoThreshold: 75,
    reviewThreshold: 60,
    hardBlockFields: ['tax_code'],
    matchingRulesDetail: [
      { id: 'md3', fieldName: 'tax_code', method: 'exact', algorithm: 'jaro_winkler', fuzzyThreshold: 0, weight: 70, normalize: false, operator: 'AND' },
      { id: 'md4', fieldName: 'business_name', method: 'fuzzy', algorithm: 'jaro_winkler', fuzzyThreshold: 80, weight: 30, normalize: true }
    ],
    extractionRulesDetail: [
      { id: 'ed3', fieldName: 'tax_code', conflictStrategy: 'source', primarySource: 'CSDL Đăng ký kinh doanh', priorityOrder: [], nullHandling: 'next', onEmpty: 'required' },
      { id: 'ed4', fieldName: 'business_name', conflictStrategy: 'priority', primarySource: '', priorityOrder: ['CSDL Đăng ký kinh doanh', 'Hệ thống Thuế - Bộ Tài chính'], nullHandling: 'skip', onEmpty: 'allow' }
    ]
  }
];

const mockEntities = [
  { id: '1', code: 'MD-CITIZEN-001', name: 'Bộ dữ liệu chủ Công dân', version: 2 },
  { id: '2', code: 'MD-ORG-001', name: 'Bộ dữ liệu chủ Tổ chức', version: 2 },
  { id: '3', code: 'MD-DOC-001', name: 'Bộ dữ liệu chủ Văn bản pháp luật', version: 1 },
  { id: '4', code: 'MD-ADMIN-001', name: 'Bộ dữ liệu chủ Đơn vị hành chính', version: 1 },
  { id: '5', code: 'MD-AGENCY-001', name: 'Bộ dữ liệu chủ Cơ quan nhà nước', version: 1 }
];

const TEST_SAMPLE_OPTIONS = [
  { id: 'sample-100', label: '100 bản ghi - kiểm tra logic cơ bản' },
  { id: 'sample-500', label: '500 bản ghi - kiểm tra tỷ lệ khớp' },
  { id: 'sample-1000', label: '1000 - kiểm tra toàn diện' },
];

const MOCK_TEST_REVIEW_ITEMS = [
  { id: 'test-rev-1', pair: 'REC-0451 ↔ REC-1123', score: 82, reason: 'Trùng trường hard-block nhưng khác một số trường so khớp' },
  { id: 'test-rev-2', pair: 'REC-0777 ↔ REC-2098', score: 78, reason: 'Giá trị tương đồng chuỗi nhưng chưa đạt ngưỡng tự động gộp' },
  { id: 'test-rev-3', pair: 'REC-0912 ↔ REC-3011', score: 85, reason: 'Trùng phần lớn trường nhưng thiếu dữ liệu ở một trường đối chiếu' },
  { id: 'test-rev-4', pair: 'REC-1204 ↔ REC-4150', score: 76, reason: 'Khớp gần đúng ở mức thấp, cần xác minh thủ công' },
  { id: 'test-rev-5', pair: 'REC-1588 ↔ REC-5099', score: 80, reason: 'Trùng trường chính nhưng lệch nhẹ ở trường phụ' },
];

const MOCK_APPROVERS = [
  { id: 'a1', name: 'Nguyễn Văn An', position: 'Trưởng phòng', department: 'Phòng Quản lý dữ liệu' },
  { id: 'a2', name: 'Trần Thị Bình', position: 'Phó Cục trưởng', department: 'Cục Hành chính tư pháp' },
  { id: 'a3', name: 'Lê Minh Cường', position: 'Chuyên viên cao cấp', department: 'Vụ Kế hoạch - Tài chính' },
  { id: 'a4', name: 'Phạm Quốc Hùng', position: 'Cục trưởng', department: 'Cục Công nghệ thông tin' },
  { id: 'a5', name: 'Hoàng Thị Lan', position: 'Trưởng phòng', department: 'Phòng Nghiệp vụ pháp lý' }
];

export const dataSourceLabels: Record<DataSourceType, string> = {
  dldc: 'Kho DLDC',
  lgsp: 'API LGSP',
  ndxp: 'API NDXP',
  manual: 'Nhập thủ công'
};

const matchStrategyLabels: Record<MatchStrategy, string> = {
  exact: 'Khớp chính xác',
  fuzzy: 'Khớp mờ (Fuzzy)',
  phonetic: 'Khớp phiên âm',
  custom: 'Tùy chỉnh'
};

const mergeStrategyLabels: Record<MergeStrategy, string> = {
  priority: 'Ưu tiên theo nguồn',
  weighted: 'Trọng số',
  latest: 'Dữ liệu mới nhất',
  manual: 'Thủ công'
};

export const matchMethodLabels: Record<MatchMethod, string> = {
  exact: 'Khớp tuyệt đối',
  fuzzy: 'Khớp gần đúng'
};

export const fuzzyAlgorithmLabels: Record<FuzzyAlgorithm, string> = {
  jaro_winkler: 'Tương đồng chuỗi',
  levenshtein: 'Khoảng cách chỉnh sửa',
  phonetic: 'Ngữ âm'
};

export const conflictStrategyLabels: Record<ConflictStrategy, string> = {
  source: 'Theo nguồn',
  priority: 'Độ ưu tiên'
};

export const nullHandlingLabels: Record<NullHandling, string> = {
  next: 'Nguồn kế',
  skip: 'Bỏ qua'
};

export const onEmptyLabels: Record<OnEmpty, string> = {
  required: 'Bắt buộc',
  warn: 'Cảnh báo',
  allow: 'Cho phép trống'
};

// --- Quy chuẩn giao diện (compomennt.md 5.3 bảng, 5.6 thẻ nhóm, 5.8 badge) ---
const TABLE_WRAP = 'bg-white rounded-lg border border-[#E2E8F0] overflow-hidden';
const TABLE_CLS = 'w-full border-collapse collection-table text-[13px]';
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px] text-left';
const TH_RIGHT = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px] text-right';
const TH_CENTER = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px] text-center';
const TR = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const TD = 'px-3 py-1 text-[13px] text-black';
const TD_EMPTY = 'px-4 py-6 text-center text-[13px] text-[#64748B]';
const LAYER_CARD = 'rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden';
const LAYER_HEAD = 'px-4 py-3 flex items-center gap-3 border-b border-[#E2E8F0]';
const STEP_DOT = 'w-6 h-6 rounded-full bg-blue-600 text-white text-[13px] font-medium flex items-center justify-center flex-shrink-0';
const LAYER_TITLE = 'text-[14px] font-medium text-[#020817]';
const LAYER_SUB = 'text-[13px] text-[#64748B]';
const CHIP_BLUE = 'inline-flex items-center gap-1 h-[26px] px-2 rounded-2xl border text-[13px] text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]';
// Mã bản ghi: chữ thường 13px #020817 trên nền #F8FAFC (không font-mono)
const CODE_BOX = 'inline-flex items-center px-2 py-0.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] text-[#020817]';
const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';
const STAT_CARD = 'bg-white rounded-2xl border border-[#E2E8F0] p-4 flex items-center gap-3';
const DASH = <span className="text-[#94A3B8]">—</span>;

export function MergeRulesManagementTab({ readOnly = false }: { readOnly?: boolean } = {}) {
  const [rules, setRules] = useState<MergeRule[]>(mockMergeRules);

  // Chọn thực thể dữ liệu chủ để xem/cấu hình quy tắc hợp nhất
  const [selectedEntityFilter, setSelectedEntityFilter] = useState('1');
  const selectedFilterEntityData = mockEntities.find(e => e.id === selectedEntityFilter);
  const currentRule = selectedEntityFilter ? rules.find(rule => rule.entityId === selectedEntityFilter) : undefined;

  // Combobox chọn thực thể (giống tab Quản lý thuộc tính dữ liệu chủ)
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [comboboxSearch, setComboboxSearch] = useState('');
  const comboboxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setComboboxOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredEntities = mockEntities.filter(entity =>
    entity.name.toLowerCase().includes(comboboxSearch.toLowerCase()) ||
    entity.code.toLowerCase().includes(comboboxSearch.toLowerCase())
  );

  // Modal Thêm/Chỉnh sửa — giống Bước 3 "Quy tắc hợp nhất" trong wizard Tạo mới dữ liệu chủ
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<MergeRule | null>(null);
  const [ruleName, setRuleName] = useState('');
  const [autoThreshold, setAutoThreshold] = useState(80);
  const [reviewThreshold, setReviewThreshold] = useState(65);
  const [matchingRules, setMatchingRules] = useState<MatchingRuleDetail[]>([]);
  const [hardBlockFields, setHardBlockFields] = useState<string[]>([]);
  const [hardBlockInput, setHardBlockInput] = useState('');
  const [extractionRules, setExtractionRules] = useState<ExtractionRuleDetail[]>([]);
  const [testSample, setTestSample] = useState('');
  const [testRun, setTestRun] = useState(false);
  const formSources = editingRule?.sources ?? [];
  const formEntityId = editingRule?.entityId ?? selectedEntityFilter;
  const formFields = defaultAttributes[formEntityId] ?? [];
  const totalWeight = matchingRules.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);

  // Gửi trình duyệt modal (shown after add/edit)
  const [approvalRule, setApprovalRule] = useState<MergeRule | null>(null);
  const [selectedApprover, setSelectedApprover] = useState('');
  const [approvalNote, setApprovalNote] = useState('');

  const handleOpenAdd = () => {
    setEditingRule(null);
    setRuleName(`Hợp nhất dữ liệu ${selectedFilterEntityData?.name || ''}`);
    setAutoThreshold(80);
    setReviewThreshold(65);
    setMatchingRules([]);
    setHardBlockFields([]);
    setHardBlockInput('');
    setExtractionRules([]);
    setTestSample('');
    setTestRun(false);
    setShowForm(true);
  };

  const handleOpenEdit = (rule: MergeRule) => {
    setEditingRule(rule);
    setRuleName(rule.name);
    setAutoThreshold(rule.autoThreshold ?? 80);
    setReviewThreshold(rule.reviewThreshold ?? 65);
    setMatchingRules(rule.matchingRulesDetail ?? []);
    setHardBlockFields(rule.hardBlockFields ?? []);
    setHardBlockInput('');
    setExtractionRules(rule.extractionRulesDetail ?? []);
    setTestSample('');
    setTestRun(false);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRule(null);
  };

  const handleSubmit = () => {
    if (!ruleName.trim()) {
      toast.error('Vui lòng nhập tên quy tắc');
      return;
    }

    if (matchingRules.length === 0) {
      toast.error('Cần ít nhất 1 quy tắc so khớp');
      return;
    }

    if (totalWeight !== 100) {
      toast.error('Tổng trọng số các quy tắc so khớp phải bằng 100%');
      return;
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    let savedRule: MergeRule;

    if (editingRule) {
      savedRule = {
        ...editingRule,
        name: ruleName,
        autoThreshold,
        reviewThreshold,
        hardBlockFields,
        matchingRulesDetail: matchingRules,
        extractionRulesDetail: extractionRules
      };
      setRules(rules.map(rule => rule.id === editingRule.id ? savedRule : rule));
    } else {
      savedRule = {
        id: `rule-${Date.now()}`,
        name: ruleName,
        entityId: selectedEntityFilter,
        entityName: selectedFilterEntityData?.name || '',
        sources: [],
        matchRules: [],
        extractRules: [],
        mergeStrategy: 'weighted',
        status: 'active',
        createdDate: dateStr,
        autoThreshold,
        reviewThreshold,
        hardBlockFields,
        matchingRulesDetail: matchingRules,
        extractionRulesDetail: extractionRules
      };
      setRules([...rules, savedRule]);
    }

    handleCloseForm();

    // Gửi trình duyệt để áp dụng phiên bản mới của thực thể dữ liệu chủ
    setApprovalRule(savedRule);
    setSelectedApprover('');
    setApprovalNote('');
  };

  const handleCloseApprovalModal = () => {
    setApprovalRule(null);
    setSelectedApprover('');
    setApprovalNote('');
  };

  const handleConfirmApprove = () => {
    if (!approvalRule || !selectedApprover) return;
    toast.success('Đã gửi trình duyệt quy tắc hợp nhất thành công!');
    handleCloseApprovalModal();
  };

  const handleAddMatchingRule = () => {
    setMatchingRules(prev => {
      const next = [...prev, { id: `md-${Date.now()}`, fieldName: '', method: 'exact' as MatchMethod, algorithm: 'jaro_winkler' as FuzzyAlgorithm, fuzzyThreshold: 80, weight: 0, normalize: false, operator: 'AND' as ConditionOperator }];
      // Chia đều trọng số cho tất cả quy tắc
      const even = Math.floor(100 / next.length);
      const remainder = 100 - even * next.length;
      return next.map((r, i) => ({ ...r, weight: even + (i === 0 ? remainder : 0) }));
    });
  };

  const handleDeleteMatchingRule = (id: string) => {
    setMatchingRules(prev => prev.filter(rule => rule.id !== id));
  };

  const handleAddHardBlockField = (field: string) => {
    if (!field || hardBlockFields.includes(field)) return;
    setHardBlockFields(prev => [...prev, field]);
  };

  const handleRemoveHardBlockField = (field: string) => {
    setHardBlockFields(prev => prev.filter(f => f !== field));
  };

  const handleAddExtractionRule = () => {
    setExtractionRules(prev => [...prev, {
      id: `ed-${Date.now()}`, fieldName: '', conflictStrategy: 'source',
      primarySource: formSources[0]?.sourceName || '',
      priorityOrder: formSources.map(s => s.sourceName),
      nullHandling: 'next', onEmpty: 'required'
    }]);
  };

  const handleDeleteExtractionRule = (id: string) => {
    setExtractionRules(prev => prev.filter(rule => rule.id !== id));
  };

  const handleMoveExtractionPriority = (ruleId: string, index: number, direction: -1 | 1) => {
    setExtractionRules(prev => prev.map(rule => {
      if (rule.id !== ruleId) return rule;
      const arr = [...rule.priorityOrder];
      const target = index + direction;
      if (target < 0 || target >= arr.length) return rule;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return { ...rule, priorityOrder: arr };
    }));
  };

  // Cảnh báo trước khi sửa/xóa quy tắc hợp nhất — vì đã có bản ghi dữ liệu chủ hình thành từ quy tắc này
  const [pendingAction, setPendingAction] = useState<{ type: 'edit' | 'delete'; rule: MergeRule } | null>(null);

  const handleRequestEdit = (rule: MergeRule) => {
    setPendingAction({ type: 'edit', rule });
  };

  const handleRequestDelete = (rule: MergeRule) => {
    setPendingAction({ type: 'delete', rule });
  };

  const handleCancelPendingAction = () => {
    setPendingAction(null);
  };

  const handleConfirmPendingAction = () => {
    if (!pendingAction) return;
    const { type, rule } = pendingAction;
    setPendingAction(null);
    if (type === 'delete') {
      setRules(rules.filter(r => r.id !== rule.id));
    } else {
      handleOpenEdit(rule);
    }
  };

  const getStatusBadge = (status: RuleStatus) => {
    const badges = {
      active: { label: 'Hoạt động', variant: 'green' },
      inactive: { label: 'Không hoạt động', variant: 'slate' },
      testing: { label: 'Đang thử nghiệm', variant: 'amber' }
    };
    return badges[status];
  };

  // Badge cho kiểu so khớp / chiến lược / khi hết vẫn trống (giữ nhãn gốc)
  const matchMethodVariant: Record<MatchMethod, string> = { exact: 'blue', fuzzy: 'purple' };
  const conflictStrategyVariant: Record<ConflictStrategy, string> = { source: 'blue', priority: 'purple' };
  const onEmptyVariant: Record<OnEmpty, string> = { required: 'red', warn: 'amber', allow: 'slate' };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-[#020817] leading-6">Thiết lập quy tắc hợp nhất dữ liệu chủ</h2>
      </div>

      {/* Entity Filter */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4">
        <label className={LABEL_CLS}>
          Xem theo thực thể dữ liệu chủ
        </label>
        <div ref={comboboxRef} className="relative">
          <button
            type="button"
            className={`${INPUT_CLS} text-left flex items-center justify-between gap-2 cursor-pointer`}
            onClick={() => setComboboxOpen(!comboboxOpen)}
            aria-expanded={comboboxOpen}
          >
            <span className="truncate">
              {selectedFilterEntityData ? (
                <>
                  <span className="text-[#020817]">{selectedFilterEntityData.code}</span>
                  <span className="text-[#64748B]"> - {selectedFilterEntityData.name}</span>
                </>
              ) : (
                <span className="text-[#94A3B8]">Chọn thực thể dữ liệu chủ...</span>
              )}
            </span>
            <ChevronDown className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform ${comboboxOpen ? 'rotate-180' : ''}`} />
          </button>
          {comboboxOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-[#E2E8F0] rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
              <div className="p-2 border-b border-[#E2E8F0]">
                <input
                  type="text"
                  value={comboboxSearch}
                  onChange={(e) => setComboboxSearch(e.target.value)}
                  placeholder="Tìm kiếm theo mã hoặc tên..."
                  className={SEARCH_INPUT_CLS}
                  autoFocus
                />
              </div>
              <ul className="overflow-y-auto max-h-52 custom-scrollbar">
                {filteredEntities.length === 0 ? (
                  <li className="px-4 py-8 text-center text-[13px] text-[#64748B]">
                    Không tìm thấy thực thể phù hợp
                  </li>
                ) : (
                  filteredEntities.map(entity => (
                    <li key={entity.id}>
                      <button
                        type="button"
                        className={`w-full px-4 py-2.5 text-left text-[13px] hover:bg-[#F8FAFC] transition-colors cursor-pointer ${selectedEntityFilter === entity.id ? 'bg-[#EAF3FF]' : ''}`}
                        onClick={() => {
                          setSelectedEntityFilter(entity.id);
                          setComboboxOpen(false);
                          setComboboxSearch('');
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 truncate">
                            <span className="text-[#020817]">{entity.code}</span>
                            <span className="text-[#64748B]"> - {entity.name}</span>
                          </div>
                          {selectedEntityFilter === entity.id && (
                            <Check className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                        </div>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Nội dung theo thực thể đã chọn */}
      {!selectedEntityFilter ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl py-16 px-4 text-center">
          <GitMerge className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
          <p className="text-[13px] text-[#64748B]">
            Vui lòng chọn thực thể dữ liệu chủ để xem quy tắc hợp nhất
          </p>
        </div>
      ) : !currentRule ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl py-16 px-4 text-center">
          <GitMerge className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
          <p className="text-[13px] text-[#64748B] mb-4">
            Chưa cấu hình quy tắc hợp nhất dữ liệu nào
          </p>
          {!readOnly && (
            <button onClick={handleOpenAdd} className={BTN_PRIMARY}>
              <Plus className="w-4 h-4" />
              Thêm quy tắc hợp nhất
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Thanh tóm tắt quy tắc + thao tác */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[14px] font-medium text-[#020817]">{currentRule.name}</p>
                <Badge label={getStatusBadge(currentRule.status).label} variant={getStatusBadge(currentRule.status).variant} />
              </div>
              <p className="text-[13px] text-[#64748B] mt-1">
                Áp dụng cho thực thể <span className="text-[#020817]">{currentRule.entityName}</span>
                {currentRule.lastApplied && <> · Lần áp dụng cuối: {currentRule.lastApplied}</>}
              </p>
            </div>
            {!readOnly && SHOW_EDIT_DELETE_ACTIONS && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleRequestEdit(currentRule)} className={BTN_OUTLINE}>
                <Edit className="w-4 h-4" />
                Chỉnh sửa
              </button>
              <button onClick={() => handleRequestDelete(currentRule)} className={`${BTN_OUTLINE} !text-[#DC2626] !border-[#FEE2E2] hover:!bg-[#FEF2F2]`}>
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
            </div>
            )}
          </div>

          {/* Lớp 1: Matching Rules */}
          <div className={LAYER_CARD}>
            <div className={LAYER_HEAD}>
              <span className={STEP_DOT}>1</span>
              <div>
                <p className={LAYER_TITLE}>Lớp 1 — Quy tắc so khớp (Matching Rules)</p>
                <p className={LAYER_SUB}>Xác định khi nào hai bản ghi từ hai nguồn khác nhau được coi là cùng một thực thể</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-[13px] text-[#64748B]">
                Ngưỡng tự động gộp (≥):{' '}
                <span className="text-[#020817] tabular-nums">{currentRule.autoThreshold ?? '-'}%</span>
              </p>
              <div className={TABLE_WRAP}>
                <table className={TABLE_CLS}>
                  <thead className="bg-[#F8FAFC]">
                    <tr className="h-[42px]">
                      <th className={TH}>Trường đối chiếu</th>
                      <th className={TH}>Kiểu so khớp</th>
                      <th className={TH}>Thuật toán</th>
                      <th className={`${TH_RIGHT} w-28`}>Ngưỡng (%)</th>
                      <th className={`${TH_RIGHT} w-28`}>Trọng số (%)</th>
                      <th className={`${TH} w-28`}>Điều kiện</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!currentRule.matchingRulesDetail || currentRule.matchingRulesDetail.length === 0 ? (
                      <tr>
                        <td colSpan={6} className={TD_EMPTY}>
                          Chưa cấu hình quy tắc so khớp
                        </td>
                      </tr>
                    ) : (
                      currentRule.matchingRulesDetail.map(rule => (
                        <tr key={rule.id} className={TR}>
                          <td className={TD}>{(defaultAttributes[currentRule.entityId] ?? []).find(af => af.fieldName === rule.fieldName)?.displayName || rule.fieldName}</td>
                          <td className={TD}><Badge label={matchMethodLabels[rule.method]} variant={matchMethodVariant[rule.method]} /></td>
                          <td className={TD}>
                            {rule.method === 'fuzzy' ? fuzzyAlgorithmLabels[rule.algorithm] : DASH}
                          </td>
                          <td className={`${TD} text-right tabular-nums`}>
                            {rule.method === 'fuzzy' ? `${rule.fuzzyThreshold ?? '-'}%` : DASH}
                          </td>
                          <td className={`${TD} text-right tabular-nums`}>{rule.weight}</td>
                          <td className={TD}>
                            {rule.operator ? <Badge label={rule.operator} variant="indigo" /> : DASH}
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
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 space-y-3">
            <div>
              <p className={LAYER_TITLE}>Trường hard-block</p>
              <p className={LAYER_SUB}>Nếu các trường này khác nhau, hai bản ghi chắc chắn KHÔNG phải cùng thực thể (loại khỏi so khớp)</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {!currentRule.hardBlockFields || currentRule.hardBlockFields.length === 0 ? (
                <span className="text-[13px] text-[#64748B]">Chưa có trường hard-block nào</span>
              ) : (
                currentRule.hardBlockFields.map(f => (
                  <Badge key={f} variant="blue" label={(defaultAttributes[currentRule.entityId] ?? []).find(af => af.fieldName === f)?.displayName || f} />
                ))
              )}
            </div>
          </div>

          {/* Lớp 2: Hợp nhất giá trị (Survivorship) */}
          <div className={LAYER_CARD}>
            <div className={LAYER_HEAD}>
              <span className={STEP_DOT}>2</span>
              <div>
                <p className={LAYER_TITLE}>Lớp 2 — Hợp nhất giá trị (Survivorship)</p>
                <p className={LAYER_SUB}>Với mỗi trường, giá trị nào sẽ tồn tại trong bản ghi chủ cuối cùng</p>
              </div>
            </div>
            <div className="p-4">
              {!currentRule.extractionRulesDetail || currentRule.extractionRulesDetail.length === 0 ? (
                <p className="text-[13px] text-[#64748B] text-center py-6">Chưa cấu hình quy tắc hợp nhất giá trị</p>
              ) : (
                <div className={TABLE_WRAP}>
                  <table className={TABLE_CLS}>
                    <thead className="bg-[#F8FAFC]">
                      <tr className="h-[42px]">
                        <th className={TH}>Trường</th>
                        <th className={TH}>Chiến lược</th>
                        <th className={TH}>Nguồn dữ liệu</th>
                        <th className={TH}>Xử lý null</th>
                        <th className={TH}>Khi hết vẫn trống</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRule.extractionRulesDetail.map(rule => (
                        <tr key={rule.id} className={TR}>
                          <td className={TD}>{(defaultAttributes[currentRule.entityId] ?? []).find(af => af.fieldName === rule.fieldName)?.displayName || rule.fieldName}</td>
                          <td className={TD}><Badge label={conflictStrategyLabels[rule.conflictStrategy]} variant={conflictStrategyVariant[rule.conflictStrategy]} /></td>
                          <td className={TD}>
                            {rule.conflictStrategy === 'source' ? rule.primarySource : rule.priorityOrder.join(' → ')}
                          </td>
                          <td className={TD}>{nullHandlingLabels[rule.nullHandling]}</td>
                          <td className={TD}><Badge label={onEmptyLabels[rule.onEmpty]} variant={onEmptyVariant[rule.onEmpty]} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm/Chỉnh sửa quy tắc hợp nhất — giống Bước 4 của wizard Tạo mới dữ liệu chủ */}
      <BaseModal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingRule ? 'Chỉnh sửa quy tắc hợp nhất' : 'Thêm quy tắc hợp nhất mới'}
        subtitle={selectedFilterEntityData ? `Thực thể: ${selectedFilterEntityData.name}` : undefined}
        maxWidth="max-w-6xl"
        customHeaderIcon={<GitMerge className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />}
        footer={
          <>
            <button onClick={handleCloseForm} className={BTN_OUTLINE}>
              Hủy
            </button>
            <button onClick={handleSubmit} className={BTN_PRIMARY}>
              <Save className="w-4 h-4" />
              {editingRule ? 'Cập nhật' : 'Lưu quy tắc'}
            </button>
          </>
        }
      >
        <div className="space-y-4">

          {/* Lớp 1: Matching Rules */}
          <div className={LAYER_CARD}>
            <div className={LAYER_HEAD}>
              <span className={STEP_DOT}>1</span>
              <div>
                <p className={LAYER_TITLE}>Lớp 1 — Quy tắc so khớp (Matching Rules)</p>
                <p className={LAYER_SUB}>Xác định khi nào hai bản ghi từ hai nguồn khác nhau được coi là cùng một thực thể</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className={LABEL_CLS}>Ngưỡng tự động gộp (≥)</label>
                <div className="flex items-center gap-2">
                  <div className="w-24">
                    <input
                      type="number" min={0} max={100}
                      value={autoThreshold}
                      onChange={(e) => setAutoThreshold(Number(e.target.value))}
                      className={`${INPUT_CLS} text-right tabular-nums`}
                    />
                  </div>
                  <span className="text-[13px] text-[#64748B]">%</span>
                </div>
              </div>

              <div className={TABLE_WRAP}>
                <table className={TABLE_CLS}>
                  <thead className="bg-[#F8FAFC]">
                    <tr className="h-[42px]">
                      <th className={TH}>Trường đối chiếu</th>
                      <th className={TH}>Kiểu so khớp</th>
                      <th className={TH}>Thuật toán</th>
                      <th className={`${TH_RIGHT} w-28`}>Ngưỡng (%)</th>
                      <th className={`${TH_RIGHT} w-28`}>Trọng số (%)</th>
                      <th className={`${TH} w-28`}>Điều kiện</th>
                      <th className={`${TH_CENTER} w-14`}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchingRules.length === 0 ? (
                      <tr>
                        <td colSpan={7} className={TD_EMPTY}>
                          Chưa có quy tắc — nhấn "+ Thêm quy tắc so khớp" để bắt đầu
                        </td>
                      </tr>
                    ) : (
                      matchingRules.map((rule, idx) => (
                        <tr key={rule.id} className={TR}>
                          <td className={TD}>
                            <select
                              value={rule.fieldName}
                              onChange={(e) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, fieldName: e.target.value } : r))}
                              className={`${INPUT_CLS} cursor-pointer`}
                            >
                              <option value="">-- Chọn trường --</option>
                              {formFields.map(f => (
                                <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>
                              ))}
                            </select>
                          </td>
                          <td className={TD}>
                            <select
                              value={rule.method}
                              onChange={(e) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, method: e.target.value as MatchMethod } : r))}
                              className={`${INPUT_CLS} cursor-pointer`}
                            >
                              <option value="exact">{matchMethodLabels.exact}</option>
                              <option value="fuzzy">{matchMethodLabels.fuzzy}</option>
                            </select>
                          </td>
                          <td className={TD}>
                            {rule.method === 'fuzzy' ? (
                              <select
                                value={rule.algorithm}
                                onChange={(e) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, algorithm: e.target.value as FuzzyAlgorithm } : r))}
                                className={`${INPUT_CLS} cursor-pointer`}
                              >
                                {(Object.entries(fuzzyAlgorithmLabels) as [FuzzyAlgorithm, string][]).map(([val, label]) => (
                                  <option key={val} value={val}>{label}</option>
                                ))}
                              </select>
                            ) : (
                              DASH
                            )}
                          </td>
                          <td className={`${TD} text-right`}>
                            {rule.method === 'fuzzy' ? (
                              <input
                                type="number" min={0} max={100}
                                value={rule.fuzzyThreshold}
                                onChange={(e) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, fuzzyThreshold: Number(e.target.value) } : r))}
                                className={`${INPUT_CLS} text-right tabular-nums`}
                              />
                            ) : (
                              DASH
                            )}
                          </td>
                          <td className={`${TD} text-right`}>
                            <input
                              type="number" min={0} max={100}
                              value={rule.weight}
                              onChange={(e) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, weight: Number(e.target.value) } : r))}
                              className={`${INPUT_CLS} text-right tabular-nums`}
                            />
                          </td>
                          <td className={TD}>
                            {idx < matchingRules.length - 1 ? (
                              <select
                                value={rule.operator}
                                onChange={(e) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, operator: e.target.value as ConditionOperator } : r))}
                                className={`${INPUT_CLS} cursor-pointer`}
                              >
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                              </select>
                            ) : (
                              DASH
                            )}
                          </td>
                          <td className={`${TD} text-center`}>
                            <RowIconAction label="Xóa" onClick={() => handleDeleteMatchingRule(rule.id)}>
                              <Trash2 className="w-4 h-4" />
                            </RowIconAction>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {matchingRules.length > 0 && (
                    <tfoot className="bg-[#F8FAFC]">
                      <tr className="h-12">
                        <td colSpan={4} className="px-3 py-1 text-right text-[13px] font-medium text-[#020817]">Tổng trọng số:</td>
                        <td className="px-3 py-1 text-right">
                          <span className={`text-[13px] font-medium tabular-nums ${totalWeight === 100 ? 'text-[#15803D]' : 'text-[#DC2626]'}`}>{totalWeight}%</span>
                        </td>
                        <td colSpan={3} className="px-3 py-1 text-[13px] text-[#64748B]">
                          {totalWeight === 100 ? 'Hợp lệ' : 'Tổng trọng số phải bằng 100%'}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
              <button type="button" onClick={handleAddMatchingRule} className={BTN_OUTLINE}>
                <Plus className="w-4 h-4" />
                Thêm quy tắc so khớp
              </button>
            </div>
          </div>

          {/* Trường hard-block */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 space-y-3">
            <div>
              <p className={LAYER_TITLE}>Trường hard-block</p>
              <p className={LAYER_SUB}>Nếu các trường này khác nhau, hai bản ghi chắc chắn KHÔNG phải cùng thực thể (loại khỏi so khớp)</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {hardBlockFields.map(f => (
                <span key={f} className={CHIP_BLUE}>
                  {formFields.find(af => af.fieldName === f)?.displayName || f}
                  <button
                    type="button"
                    onClick={() => handleRemoveHardBlockField(f)}
                    aria-label="Bỏ trường"
                    title="Bỏ trường"
                    className="rounded text-[#2563EB] hover:text-[#DC2626] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {hardBlockFields.length === 0 && (
                <span className="text-[13px] text-[#64748B]">Chưa có trường hard-block nào</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 max-w-xs">
                <select
                  value={hardBlockInput}
                  onChange={(e) => setHardBlockInput(e.target.value)}
                  className={`${INPUT_CLS} cursor-pointer`}
                >
                  <option value="">-- Chọn trường để thêm --</option>
                  {formFields
                    .filter(f => !hardBlockFields.includes(f.fieldName))
                    .map(f => <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>)}
                </select>
              </div>
              <button
                type="button"
                onClick={() => { handleAddHardBlockField(hardBlockInput); setHardBlockInput(''); }}
                disabled={!hardBlockInput}
                className={BTN_OUTLINE}
              >
                <Plus className="w-4 h-4" /> Thêm
              </button>
            </div>
          </div>

          {/* Lớp 2: Hợp nhất giá trị (Survivorship) */}
          <div className={LAYER_CARD}>
            <div className={LAYER_HEAD}>
              <span className={STEP_DOT}>2</span>
              <div>
                <p className={LAYER_TITLE}>Lớp 2 — Hợp nhất giá trị (Survivorship)</p>
                <p className={LAYER_SUB}>Với mỗi trường, chọn giá trị nào sẽ tồn tại trong bản ghi chủ cuối cùng</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {formSources.length === 0 && (
                <div className="flex items-start gap-2 p-3 bg-[#FFF7ED] border border-[#FED7AA] rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                  <p className="text-[13px] text-[#020817]">
                    Thực thể này chưa có nguồn dữ liệu đã đăng ký — chỉ có thể khai báo tên trường, chưa chọn được nguồn ưu tiên.
                  </p>
                </div>
              )}
              <div className={TABLE_WRAP}>
                <table className={TABLE_CLS}>
                  <thead className="bg-[#F8FAFC]">
                    <tr className="h-[42px]">
                      <th className={TH}>Trường</th>
                      <th className={TH}>Chiến lược</th>
                      <th className={TH}>Nguồn dữ liệu</th>
                      <th className={TH}>Xử lý null</th>
                      <th className={TH}>Khi hết vẫn trống</th>
                      <th className={`${TH_CENTER} w-14`}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractionRules.length === 0 ? (
                      <tr>
                        <td colSpan={6} className={TD_EMPTY}>
                          Chưa có quy tắc — nhấn "+ Thêm quy tắc hợp nhất giá trị" để bắt đầu
                        </td>
                      </tr>
                    ) : (
                      extractionRules.map(rule => (
                        <tr key={rule.id} className={TR}>
                          <td className={`${TD} align-top`}>
                            <select
                              value={rule.fieldName}
                              onChange={(e) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, fieldName: e.target.value } : r))}
                              className={`${INPUT_CLS} cursor-pointer`}
                            >
                              <option value="">-- Chọn trường --</option>
                              {formFields.map(f => (
                                <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>
                              ))}
                            </select>
                          </td>
                          <td className={`${TD} align-top`}>
                            <select
                              value={rule.conflictStrategy}
                              onChange={(e) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, conflictStrategy: e.target.value as ConflictStrategy } : r))}
                              className={`${INPUT_CLS} cursor-pointer`}
                            >
                              <option value="source">{conflictStrategyLabels.source}</option>
                              <option value="priority">{conflictStrategyLabels.priority}</option>
                            </select>
                          </td>
                          <td className={`${TD} align-top`}>
                            {rule.conflictStrategy === 'source' ? (
                              <select
                                value={rule.primarySource}
                                onChange={(e) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, primarySource: e.target.value } : r))}
                                className={`${INPUT_CLS} cursor-pointer`}
                              >
                                <option value="">-- Chọn nguồn --</option>
                                {formSources.map(s => <option key={s.sourceName} value={s.sourceName}>{s.sourceName}</option>)}
                              </select>
                            ) : rule.priorityOrder.length === 0 ? (
                              <span className="inline-flex items-center h-10 text-[13px] text-[#64748B]">Chưa có nguồn</span>
                            ) : (
                              <div className="space-y-1 min-w-[190px]">
                                {rule.priorityOrder.map((sourceName, idx) => (
                                  <div key={sourceName} className="flex items-center gap-1.5 border border-[#E2E8F0] rounded-lg px-2 py-1 bg-[#F8FAFC]">
                                    <span className="w-4 text-[12px] text-[#64748B] tabular-nums">{idx + 1}</span>
                                    <span className="flex-1 text-[13px] text-[#020817] truncate">{sourceName}</span>
                                    <button type="button" disabled={idx === 0} onClick={() => handleMoveExtractionPriority(rule.id, idx, -1)} className="p-0.5 rounded text-[#475569] hover:text-blue-600 disabled:text-[#CBD5E1] disabled:cursor-not-allowed cursor-pointer" aria-label="Lên" title="Lên"><ChevronUp className="w-4 h-4" /></button>
                                    <button type="button" disabled={idx === rule.priorityOrder.length - 1} onClick={() => handleMoveExtractionPriority(rule.id, idx, 1)} className="p-0.5 rounded text-[#475569] hover:text-blue-600 disabled:text-[#CBD5E1] disabled:cursor-not-allowed cursor-pointer" aria-label="Xuống" title="Xuống"><ChevronDown className="w-4 h-4" /></button>
                                  </div>
                                ))}
                                <p className="text-[12px] text-[#64748B]">Thiếu ở nguồn đầu → lấy nguồn kế</p>
                              </div>
                            )}
                          </td>
                          <td className={`${TD} align-top`}>
                            <select
                              value={rule.nullHandling}
                              onChange={(e) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, nullHandling: e.target.value as NullHandling } : r))}
                              className={`${INPUT_CLS} cursor-pointer`}
                            >
                              <option value="next">{nullHandlingLabels.next}</option>
                              <option value="skip">{nullHandlingLabels.skip}</option>
                            </select>
                          </td>
                          <td className={`${TD} align-top`}>
                            <select
                              value={rule.onEmpty}
                              onChange={(e) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, onEmpty: e.target.value as OnEmpty } : r))}
                              className={`${INPUT_CLS} cursor-pointer`}
                            >
                              <option value="required">{onEmptyLabels.required}</option>
                              <option value="warn">{onEmptyLabels.warn}</option>
                              <option value="allow">{onEmptyLabels.allow}</option>
                            </select>
                          </td>
                          <td className={`${TD} text-center align-top`}>
                            <div className="h-10 flex items-center justify-center">
                              <RowIconAction label="Xóa" onClick={() => handleDeleteExtractionRule(rule.id)}>
                                <Trash2 className="w-4 h-4" />
                              </RowIconAction>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <button type="button" onClick={handleAddExtractionRule} className={BTN_OUTLINE}>
                <Plus className="w-4 h-4" />
                Thêm quy tắc hợp nhất giá trị
              </button>
            </div>
          </div>

          {/* Kiểm thử */}
          <div className={LAYER_CARD}>
            <div className={LAYER_HEAD}>
              <span className={STEP_DOT}>3</span>
              <div>
                <p className={LAYER_TITLE}>Kiểm thử</p>
                <p className={LAYER_SUB}>Chạy mô phỏng để xem trước kết quả áp dụng quy tắc so khớp và hợp nhất giá trị hiện tại</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 flex flex-wrap items-end gap-3">
                <div className="w-80">
                  <label className={LABEL_CLS}>Chọn số lượng bản ghi chạy kiểm thử</label>
                  <select
                    value={testSample}
                    onChange={(e) => { setTestSample(e.target.value); setTestRun(false); }}
                    className={`${INPUT_CLS} cursor-pointer`}
                  >
                    <option value="">-- Chọn số lượng bản ghi --</option>
                    {TEST_SAMPLE_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setTestRun(true)}
                  disabled={!testSample}
                  className={BTN_PRIMARY}
                >
                  Chạy mô phỏng
                </button>
              </div>

              {!testRun ? (
                <div className="border border-dashed border-[#E2E8F0] rounded-2xl bg-[#F8FAFC] p-8 text-center text-[13px] text-[#64748B]">
                  Chọn dữ liệu mẫu và nhấn "Chạy mô phỏng" để xem kết quả kiểm thử
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-4">
                    <div className={STAT_CARD}>
                      <div className="p-2 rounded-lg bg-green-50"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
                      <div>
                        <div className="text-[16px] text-[#64748B]">Golden hình thành</div>
                        <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">312</div>
                      </div>
                    </div>
                    <div className={STAT_CARD}>
                      <div className="p-2 rounded-lg bg-blue-50"><GitMerge className="w-5 h-5 text-blue-600" /></div>
                      <div>
                        <div className="text-[16px] text-[#64748B]">Auto-merge</div>
                        <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">268</div>
                      </div>
                    </div>
                    <div className={STAT_CARD}>
                      <div className="p-2 rounded-lg bg-amber-50"><Clock className="w-5 h-5 text-amber-600" /></div>
                      <div>
                        <div className="text-[16px] text-[#64748B]">Chờ rà soát</div>
                        <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">37</div>
                      </div>
                    </div>
                    <div className={STAT_CARD}>
                      <div className="p-2 rounded-lg bg-gray-50"><XCircle className="w-5 h-5 text-gray-600" /></div>
                      <div>
                        <div className="text-[16px] text-[#64748B]">Không khớp</div>
                        <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">183</div>
                      </div>
                    </div>
                  </div>

                  <div className={TABLE_WRAP}>
                    <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center gap-2">
                      <p className={LAYER_TITLE}>Các bản ghi chờ rà soát</p>
                      <Badge label={`${MOCK_TEST_REVIEW_ITEMS.length} bản ghi`} variant="amber" />
                    </div>
                    <div className="overflow-x-auto">
                      <table className={TABLE_CLS}>
                        <thead className="bg-[#F8FAFC]">
                          <tr className="h-[42px]">
                            <th className={TH}>Cặp bản ghi</th>
                            <th className={`${TH_RIGHT} w-28`}>Điểm khớp</th>
                            <th className={TH}>Lý do</th>
                          </tr>
                        </thead>
                        <tbody>
                          {MOCK_TEST_REVIEW_ITEMS.map(item => (
                            <tr key={item.id} className={TR}>
                              <td className={`${TD} whitespace-nowrap`}>
                                <span className={CODE_BOX}>{item.pair.split(' ↔ ')[0]}</span>
                                <span className="mx-1.5 text-[#64748B]">↔</span>
                                <span className={CODE_BOX}>{item.pair.split(' ↔ ')[1]}</span>
                              </td>
                              <td className={`${TD} text-right tabular-nums`}>{item.score}%</td>
                              <td className={TD}>{item.reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {editingRule ? (
            <div className="flex items-start gap-2 p-3 bg-[#FFF7ED] border border-[#FED7AA] rounded-lg">
              <AlertCircle className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
              <div className="text-[13px] text-[#020817]">
                <p className="mb-1">Khi chỉnh sửa quy tắc hợp nhất, phiên bản thực thể dữ liệu chủ sẽ tự động tăng từ <strong className="font-medium">v{selectedFilterEntityData?.version ?? 1}</strong> lên <strong className="font-medium">v{(selectedFilterEntityData?.version ?? 1) + 1}</strong>.</p>
                <p>Thay đổi này sẽ được ghi nhận trong lịch sử phiên bản.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-[#FFF7ED] border border-[#FED7AA] rounded-lg">
              <AlertCircle className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
              <div className="text-[13px] text-[#020817]">
                <p className="mb-1">Khi thêm mới quy tắc hợp nhất, phiên bản thực thể dữ liệu chủ sẽ tự động tăng từ <strong className="font-medium">v{selectedFilterEntityData?.version ?? 1}</strong> lên <strong className="font-medium">v{(selectedFilterEntityData?.version ?? 1) + 1}</strong>.</p>
                <p>Thay đổi này sẽ được ghi nhận trong lịch sử phiên bản.</p>
              </div>
            </div>
          )}
        </div>
      </BaseModal>

      {/* Gửi trình duyệt Modal — shown after add/edit quy tắc hợp nhất */}
      {approvalRule && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-[16px] font-semibold text-[#020817] leading-6">Gửi trình duyệt</h3>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  Quy tắc hợp nhất: <span className="text-[#020817]">{approvalRule.name}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseApprovalModal}
                className={BTN_GHOST_ICON}
                aria-label="Đóng"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4 overflow-y-auto custom-scrollbar">
              <div>
                <label className={LABEL_CLS}>
                  Chọn người duyệt <span className={REQUIRED_MARK}>*</span>
                </label>
                <select
                  value={selectedApprover}
                  onChange={e => setSelectedApprover(e.target.value)}
                  className={`${INPUT_CLS} cursor-pointer`}
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
                <label className={LABEL_CLS}>
                  Nội dung yêu cầu
                </label>
                <textarea
                  value={approvalNote}
                  onChange={e => setApprovalNote(e.target.value)}
                  rows={4}
                  placeholder="Nhập nội dung gửi kèm (nếu có)..."
                  className={TEXTAREA_CLS}
                />
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <h4 className={`${LAYER_TITLE} mb-3`}>Thông tin quy tắc hợp nhất</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <span className={`block ${FIELD_LABEL} mb-1`}>Thuộc thực thể:</span>
                    <span className={FIELD_VALUE}>{approvalRule.entityName}</span>
                  </div>
                  <div>
                    <span className={`block ${FIELD_LABEL} mb-1`}>Số quy tắc so khớp:</span>
                    <span className={`${FIELD_VALUE} tabular-nums`}>{approvalRule.matchingRulesDetail?.length ?? 0}</span>
                  </div>
                  <div>
                    <span className={`block ${FIELD_LABEL} mb-1`}>Số quy tắc trích rút:</span>
                    <span className={`${FIELD_VALUE} tabular-nums`}>{approvalRule.extractionRulesDetail?.length ?? 0}</span>
                  </div>
                  <div>
                    <span className={`block ${FIELD_LABEL} mb-1`}>Phiên bản thực thể mới:</span>
                    <span className={FIELD_VALUE}>v{((mockEntities.find(e => e.id === approvalRule.entityId)?.version) ?? 1) + 1}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
              <button onClick={handleCloseApprovalModal} className={BTN_OUTLINE}>
                Hủy
              </button>
              <button onClick={handleConfirmApprove} disabled={!selectedApprover} className={BTN_PRIMARY}>
                <Send className="w-4 h-4" />
                Gửi trình duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cảnh báo trước khi sửa/xóa quy tắc hợp nhất đã có bản ghi dữ liệu chủ hình thành */}
      <BaseModal
        isOpen={!!pendingAction}
        onClose={handleCancelPendingAction}
        title={pendingAction?.type === 'delete' ? 'Xóa quy tắc hợp nhất' : 'Chỉnh sửa quy tắc hợp nhất'}
        maxWidth="max-w-lg"
        customHeaderIcon={<AlertTriangle className="w-5 h-5 text-[#D97706] mr-3 flex-shrink-0" />}
        footer={
          <>
            <button onClick={handleCancelPendingAction} className={BTN_OUTLINE}>
              Hủy
            </button>
            <button
              onClick={handleConfirmPendingAction}
              className={pendingAction?.type === 'delete' ? BTN_DESTRUCTIVE : BTN_PRIMARY}
            >
              {pendingAction?.type === 'delete' ? 'Xác nhận xóa' : 'Tiếp tục chỉnh sửa'}
            </button>
          </>
        }
      >
        <div className="flex items-start gap-2 p-3 bg-[#FFF7ED] border border-[#FED7AA] rounded-lg">
          <AlertTriangle className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-[#020817]">
            Đã có bản ghi dữ liệu chủ hình thành từ quy tắc hợp nhất thiết lập, xóa quy tắc sẽ đồng thời xóa toàn bộ bản ghi dữ liệu chủ đã hình thành.
          </p>
        </div>
      </BaseModal>
    </div>
  );
}
