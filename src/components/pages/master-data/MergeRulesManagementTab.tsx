import { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle, AlertTriangle, Save, GitMerge, ChevronDown, ChevronUp, X, Send, Search, Check } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal';
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

interface MergeRule {
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

const mockMergeRules: MergeRule[] = [
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

const dataSourceLabels: Record<DataSourceType, string> = {
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

const matchMethodLabels: Record<MatchMethod, string> = {
  exact: 'Khớp tuyệt đối',
  fuzzy: 'Khớp gần đúng'
};

const fuzzyAlgorithmLabels: Record<FuzzyAlgorithm, string> = {
  jaro_winkler: 'Tương đồng chuỗi',
  levenshtein: 'Khoảng cách chỉnh sửa',
  phonetic: 'Ngữ âm'
};

const conflictStrategyLabels: Record<ConflictStrategy, string> = {
  source: 'Theo nguồn',
  priority: 'Độ ưu tiên'
};

const nullHandlingLabels: Record<NullHandling, string> = {
  next: 'Nguồn kế',
  skip: 'Bỏ qua'
};

const onEmptyLabels: Record<OnEmpty, string> = {
  required: 'Bắt buộc',
  warn: 'Cảnh báo',
  allow: 'Cho phép trống'
};

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
      alert('Vui lòng nhập tên quy tắc');
      return;
    }

    if (matchingRules.length === 0) {
      alert('Cần ít nhất 1 quy tắc so khớp');
      return;
    }

    if (totalWeight !== 100) {
      alert('Tổng trọng số các quy tắc so khớp phải bằng 100%');
      return;
    }

    if (autoThreshold <= reviewThreshold) {
      alert('Ngưỡng tự động gộp phải lớn hơn ngưỡng cần rà soát.');
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
    alert('Đã gửi trình duyệt quy tắc hợp nhất thành công!');
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
      active: { label: 'Hoạt động', className: 'bg-green-100 text-green-700' },
      inactive: { label: 'Không hoạt động', className: 'bg-slate-100 text-slate-700' },
      testing: { label: 'Đang thử nghiệm', className: 'bg-amber-100 text-amber-700' }
    };
    return badges[status];
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-slate-900">Thiết lập quy tắc hợp nhất dữ liệu chủ</h2>
      </div>

      {/* Entity Filter */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="block text-[13px] text-slate-700 mb-2">
          Xem theo thực thể dữ liệu chủ
        </label>
        <div ref={comboboxRef} className="relative">
          <button
            type="button"
            className="w-full px-4 py-2 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-[13px]"
            onClick={() => setComboboxOpen(!comboboxOpen)}
          >
            <div className="flex items-center justify-between">
              <div>
                {selectedFilterEntityData ? (
                  <div>
                    <span className="text-[13px] text-slate-900">{selectedFilterEntityData.code}</span>
                    <span className="text-[13px] text-slate-600"> - {selectedFilterEntityData.name}</span>
                  </div>
                ) : (
                  <span className="text-[13px] text-slate-500">Chọn thực thể dữ liệu chủ...</span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${comboboxOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
          {comboboxOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
              <div className="p-2 border-b border-slate-200">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={comboboxSearch}
                    onChange={(e) => setComboboxSearch(e.target.value)}
                    placeholder="Tìm kiếm theo mã hoặc tên..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    autoFocus
                  />
                </div>
              </div>
              <ul className="overflow-y-auto max-h-52">
                {filteredEntities.length === 0 ? (
                  <li className="px-4 py-8 text-center text-[13px] text-slate-500">
                    Không tìm thấy thực thể phù hợp
                  </li>
                ) : (
                  filteredEntities.map(entity => (
                    <li key={entity.id}>
                      <button
                        type="button"
                        className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors ${selectedEntityFilter === entity.id ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          setSelectedEntityFilter(entity.id);
                          setComboboxOpen(false);
                          setComboboxSearch('');
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[13px] text-slate-900">{entity.code}</span>
                            <span className="text-[13px] text-slate-600"> - {entity.name}</span>
                          </div>
                          {selectedEntityFilter === entity.id && (
                            <Check className="w-4 h-4 text-blue-600" />
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
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <GitMerge className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-[13px] text-slate-500">
            Vui lòng chọn thực thể dữ liệu chủ để xem quy tắc hợp nhất
          </p>
        </div>
      ) : !currentRule ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <GitMerge className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-[13px] text-slate-500 mb-4">
            Chưa cấu hình quy tắc hợp nhất dữ liệu nào
          </p>
          {!readOnly && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] font-medium"
            >
              <Plus className="w-4 h-4" />
              Thêm quy tắc hợp nhất
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Thanh tóm tắt quy tắc + thao tác */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-semibold text-slate-900">{currentRule.name}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[12px] ${getStatusBadge(currentRule.status).className}`}>
                  {getStatusBadge(currentRule.status).label}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-1">
                Áp dụng cho thực thể <span className="font-medium text-slate-700">{currentRule.entityName}</span>
                {currentRule.lastApplied && <> · Lần áp dụng cuối: {currentRule.lastApplied}</>}
              </p>
            </div>
            {!readOnly && SHOW_EDIT_DELETE_ACTIONS && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleRequestEdit(currentRule)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg text-[13px] font-medium transition-colors"
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa
              </button>
              <button
                onClick={() => handleRequestDelete(currentRule)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg text-[13px] font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
            </div>
            )}
          </div>

          {/* Lớp 1: Matching Rules */}
          <div className="border border-blue-200 rounded-xl overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 flex items-center gap-3 border-b border-blue-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">1</span>
              <div>
                <p className="text-[13px] font-semibold text-blue-800">Lớp 1 — Quy tắc so khớp (Matching Rules)</p>
                <p className="text-[13px] text-blue-500">Xác định khi nào hai bản ghi từ hai nguồn khác nhau được coi là cùng một thực thể</p>
              </div>
            </div>
            <div className="p-4 space-y-3 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <p className="text-[13px] text-slate-600">
                  Ngưỡng tự động gộp (≥):{' '}
                  <span className="font-semibold text-slate-900">{currentRule.autoThreshold ?? '-'}%</span>
                </p>
                <p className="text-[13px] text-slate-600">
                  Ngưỡng cần rà soát (≥):{' '}
                  <span className="font-semibold text-slate-900">{currentRule.reviewThreshold ?? '-'}%</span>
                </p>
              </div>
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-[13px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Trường đối chiếu</th>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Kiểu so khớp</th>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Thuật toán</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-28">Ngưỡng (%)</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-28">Trọng số (%)</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-24">Chuẩn hóa</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-28">Điều kiện</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {!currentRule.matchingRulesDetail || currentRule.matchingRulesDetail.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-[13px] text-slate-400">
                          Chưa cấu hình quy tắc so khớp
                        </td>
                      </tr>
                    ) : (
                      currentRule.matchingRulesDetail.map(rule => (
                        <tr key={rule.id}>
                          <td className="px-3 py-2 text-slate-700">{(defaultAttributes[currentRule.entityId] ?? []).find(af => af.fieldName === rule.fieldName)?.displayName || rule.fieldName}</td>
                          <td className="px-3 py-2 text-slate-700">{matchMethodLabels[rule.method]}</td>
                          <td className="px-3 py-2 text-slate-700">
                            {rule.method === 'fuzzy' ? fuzzyAlgorithmLabels[rule.algorithm] : <span className="text-slate-400">—</span>}
                          </td>
                          <td className="px-3 py-2 text-center text-slate-700">
                            {rule.method === 'fuzzy' ? `${rule.fuzzyThreshold ?? '-'}%` : <span className="text-slate-400">—</span>}
                          </td>
                          <td className="px-3 py-2 text-center text-slate-700">{rule.weight}</td>
                          <td className="px-3 py-2 text-center text-slate-700">{rule.normalize ? 'Có' : 'Không'}</td>
                          <td className="px-3 py-2 text-center text-slate-700">
                            {rule.operator ?? <span className="text-slate-400">—</span>}
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
          <div className="border border-slate-200 rounded-xl bg-white p-4 space-y-3">
            <div>
              <p className="text-[13px] font-semibold text-slate-700">Trường hard-block</p>
              <p className="text-[13px] text-slate-500">Nếu các trường này khác nhau, hai bản ghi chắc chắn KHÔNG phải cùng thực thể (loại khỏi so khớp)</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {!currentRule.hardBlockFields || currentRule.hardBlockFields.length === 0 ? (
                <span className="text-[13px] text-slate-400">Chưa có trường hard-block nào</span>
              ) : (
                currentRule.hardBlockFields.map(f => (
                  <span key={f} className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[13px] font-medium">
                    {(defaultAttributes[currentRule.entityId] ?? []).find(af => af.fieldName === f)?.displayName || f}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Lớp 2: Hợp nhất giá trị (Survivorship) */}
          <div className="border border-blue-200 rounded-xl overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 flex items-center gap-3 border-b border-blue-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <p className="text-[13px] font-semibold text-blue-800">Lớp 2 — Hợp nhất giá trị (Survivorship)</p>
                <p className="text-[13px] text-blue-500">Với mỗi trường, giá trị nào sẽ tồn tại trong bản ghi chủ cuối cùng</p>
              </div>
            </div>
            <div className="p-4 bg-white">
              {!currentRule.extractionRulesDetail || currentRule.extractionRulesDetail.length === 0 ? (
                <p className="text-[13px] text-slate-400 text-center py-6">Chưa cấu hình quy tắc hợp nhất giá trị</p>
              ) : (
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <table className="w-full text-[13px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Trường</th>
                        <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Chiến lược</th>
                        <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Nguồn dữ liệu</th>
                        <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Xử lý null</th>
                        <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Khi hết vẫn trống</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 bg-white">
                      {currentRule.extractionRulesDetail.map(rule => (
                        <tr key={rule.id}>
                          <td className="px-3 py-2 text-slate-700">{(defaultAttributes[currentRule.entityId] ?? []).find(af => af.fieldName === rule.fieldName)?.displayName || rule.fieldName}</td>
                          <td className="px-3 py-2 text-slate-700">{conflictStrategyLabels[rule.conflictStrategy]}</td>
                          <td className="px-3 py-2 text-slate-700">
                            {rule.conflictStrategy === 'source' ? rule.primarySource : rule.priorityOrder.join(' → ')}
                          </td>
                          <td className="px-3 py-2 text-slate-700">{nullHandlingLabels[rule.nullHandling]}</td>
                          <td className="px-3 py-2 text-slate-700">{onEmptyLabels[rule.onEmpty]}</td>
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
            <button
              onClick={handleCloseForm}
              className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              {editingRule ? 'Cập nhật' : 'Lưu quy tắc'}
            </button>
          </>
        }
      >
        <div className="space-y-4">

          {/* Lớp 1: Matching Rules */}
          <div className="border border-blue-200 rounded-xl overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 flex items-center gap-3 border-b border-blue-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">1</span>
              <div>
                <p className="text-[13px] font-semibold text-blue-800">Lớp 1 — Quy tắc so khớp (Matching Rules)</p>
                <p className="text-[13px] text-blue-500">Xác định khi nào hai bản ghi từ hai nguồn khác nhau được coi là cùng một thực thể</p>
              </div>
            </div>
            <div className="p-4 space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Ngưỡng tự động gộp (≥)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min={0} max={100}
                      value={autoThreshold}
                      onChange={(e) => setAutoThreshold(Number(e.target.value))}
                      className="w-24 border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    />
                    <span className="text-[13px] text-slate-500">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Ngưỡng cần rà soát (≥)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min={0} max={100}
                      value={reviewThreshold}
                      onChange={(e) => setReviewThreshold(Number(e.target.value))}
                      className="w-24 border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    />
                    <span className="text-[13px] text-slate-500">%</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-[13px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Trường đối chiếu</th>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Kiểu so khớp</th>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Thuật toán</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-28">Ngưỡng (%)</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-28">Trọng số (%)</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-20">Chuẩn hóa</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-28">Điều kiện</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {matchingRules.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-6 text-center text-[13px] text-slate-400">
                          Chưa có quy tắc — nhấn "+ Thêm quy tắc so khớp" để bắt đầu
                        </td>
                      </tr>
                    ) : (
                      matchingRules.map((rule, idx) => (
                        <tr key={rule.id}>
                          <td className="px-2 py-1.5">
                            <select
                              value={rule.fieldName}
                              onChange={(e) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, fieldName: e.target.value } : r))}
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            >
                              <option value="">-- Chọn trường --</option>
                              {formFields.map(f => (
                                <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-2 py-1.5">
                            <select
                              value={rule.method}
                              onChange={(e) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, method: e.target.value as MatchMethod } : r))}
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            >
                              <option value="exact">{matchMethodLabels.exact}</option>
                              <option value="fuzzy">{matchMethodLabels.fuzzy}</option>
                            </select>
                          </td>
                          <td className="px-2 py-1.5">
                            {rule.method === 'fuzzy' ? (
                              <select
                                value={rule.algorithm}
                                onChange={(e) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, algorithm: e.target.value as FuzzyAlgorithm } : r))}
                                className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                              >
                                {(Object.entries(fuzzyAlgorithmLabels) as [FuzzyAlgorithm, string][]).map(([val, label]) => (
                                  <option key={val} value={val}>{label}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            {rule.method === 'fuzzy' ? (
                              <input
                                type="number" min={0} max={100}
                                value={rule.fuzzyThreshold}
                                onChange={(e) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, fuzzyThreshold: Number(e.target.value) } : r))}
                                className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              />
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            <input
                              type="number" min={0} max={100}
                              value={rule.weight}
                              onChange={(e) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, weight: Number(e.target.value) } : r))}
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            <input
                              type="checkbox"
                              checked={rule.normalize}
                              onChange={() => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, normalize: !r.normalize } : r))}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                            />
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            {idx < matchingRules.length - 1 ? (
                              <select
                                value={rule.operator}
                                onChange={(e) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, operator: e.target.value as ConditionOperator } : r))}
                                className="w-full border border-slate-200 rounded-lg px-1 py-1 text-[13px] font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              >
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                              </select>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            <button type="button" onClick={() => handleDeleteMatchingRule(rule.id)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {matchingRules.length > 0 && (
                    <tfoot className="border-t border-slate-200 bg-slate-50">
                      <tr>
                        <td colSpan={4} className="px-3 py-2 text-right text-[13px] font-medium text-slate-600">Tổng trọng số:</td>
                        <td className="px-2 py-2 text-center">
                          <span className={`text-[13px] font-bold ${totalWeight === 100 ? 'text-green-700' : 'text-red-600'}`}>{totalWeight}%</span>
                        </td>
                        <td colSpan={3} className="px-3 py-2 text-[13px] text-slate-400">
                          {totalWeight === 100 ? 'Hợp lệ' : 'Tổng trọng số phải bằng 100%'}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
              <button
                type="button"
                onClick={handleAddMatchingRule}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 text-[13px] font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm quy tắc so khớp
              </button>
            </div>
          </div>

          {/* Trường hard-block */}
          <div className="border border-slate-200 rounded-xl bg-white p-4 space-y-3">
            <div>
              <p className="text-[13px] font-semibold text-slate-700">Trường hard-block</p>
              <p className="text-[13px] text-slate-500">Nếu các trường này khác nhau, hai bản ghi chắc chắn KHÔNG phải cùng thực thể (loại khỏi so khớp)</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {hardBlockFields.map(f => (
                <span key={f} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[13px] font-medium">
                  {formFields.find(af => af.fieldName === f)?.displayName || f}
                  <button type="button" onClick={() => handleRemoveHardBlockField(f)} className="text-blue-400 hover:text-red-500 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {hardBlockFields.length === 0 && (
                <span className="text-[13px] text-slate-400">Chưa có trường hard-block nào</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={hardBlockInput}
                onChange={(e) => setHardBlockInput(e.target.value)}
                className="flex-1 max-w-xs border border-slate-200 rounded-lg px-2 py-1.5 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              >
                <option value="">-- Chọn trường để thêm --</option>
                {formFields
                  .filter(f => !hardBlockFields.includes(f.fieldName))
                  .map(f => <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>)}
              </select>
              <button
                type="button"
                onClick={() => { handleAddHardBlockField(hardBlockInput); setHardBlockInput(''); }}
                disabled={!hardBlockInput}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 text-[13px] font-medium rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm
              </button>
            </div>
          </div>

          {/* Lớp 2: Hợp nhất giá trị (Survivorship) */}
          <div className="border border-blue-200 rounded-xl overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 flex items-center gap-3 border-b border-blue-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <p className="text-[13px] font-semibold text-blue-800">Lớp 2 — Hợp nhất giá trị (Survivorship)</p>
                <p className="text-[13px] text-blue-500">Với mỗi trường, chọn giá trị nào sẽ tồn tại trong bản ghi chủ cuối cùng</p>
              </div>
            </div>
            <div className="p-4 space-y-3 bg-white">
              {formSources.length === 0 && (
                <p className="text-[13px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Thực thể này chưa có nguồn dữ liệu đã đăng ký — chỉ có thể khai báo tên trường, chưa chọn được nguồn ưu tiên.
                </p>
              )}
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-[13px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Trường</th>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Chiến lược</th>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Nguồn dữ liệu</th>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Xử lý null</th>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Khi hết vẫn trống</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {extractionRules.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-[13px] text-slate-400">
                          Chưa có quy tắc — nhấn "+ Thêm quy tắc hợp nhất giá trị" để bắt đầu
                        </td>
                      </tr>
                    ) : (
                      extractionRules.map(rule => (
                        <tr key={rule.id}>
                          <td className="px-2 py-1.5 align-top">
                            <select
                              value={rule.fieldName}
                              onChange={(e) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, fieldName: e.target.value } : r))}
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            >
                              <option value="">-- Chọn trường --</option>
                              {formFields.map(f => (
                                <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-2 py-1.5 align-top">
                            <select
                              value={rule.conflictStrategy}
                              onChange={(e) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, conflictStrategy: e.target.value as ConflictStrategy } : r))}
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            >
                              <option value="source">{conflictStrategyLabels.source}</option>
                              <option value="priority">{conflictStrategyLabels.priority}</option>
                            </select>
                          </td>
                          <td className="px-2 py-1.5 align-top">
                            {rule.conflictStrategy === 'source' ? (
                              <select
                                value={rule.primarySource}
                                onChange={(e) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, primarySource: e.target.value } : r))}
                                className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                              >
                                <option value="">-- Chọn nguồn --</option>
                                {formSources.map(s => <option key={s.sourceName} value={s.sourceName}>{s.sourceName}</option>)}
                              </select>
                            ) : rule.priorityOrder.length === 0 ? (
                              <span className="text-[13px] text-slate-400">Chưa có nguồn</span>
                            ) : (
                              <div className="space-y-1 min-w-[190px]">
                                {rule.priorityOrder.map((sourceName, idx) => (
                                  <div key={sourceName} className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50">
                                    <span className="w-4 text-[11px] font-semibold text-slate-400">{idx + 1}</span>
                                    <span className="flex-1 text-[13px] text-slate-700 truncate">{sourceName}</span>
                                    <button type="button" disabled={idx === 0} onClick={() => handleMoveExtractionPriority(rule.id, idx, -1)} className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Lên"><ChevronUp className="w-3.5 h-3.5" /></button>
                                    <button type="button" disabled={idx === rule.priorityOrder.length - 1} onClick={() => handleMoveExtractionPriority(rule.id, idx, 1)} className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Xuống"><ChevronDown className="w-3.5 h-3.5" /></button>
                                  </div>
                                ))}
                                <p className="text-[11px] text-slate-400">Thiếu ở nguồn đầu → lấy nguồn kế</p>
                              </div>
                            )}
                          </td>
                          <td className="px-2 py-1.5 align-top">
                            <select
                              value={rule.nullHandling}
                              onChange={(e) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, nullHandling: e.target.value as NullHandling } : r))}
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            >
                              <option value="next">{nullHandlingLabels.next}</option>
                              <option value="skip">{nullHandlingLabels.skip}</option>
                            </select>
                          </td>
                          <td className="px-2 py-1.5 align-top">
                            <select
                              value={rule.onEmpty}
                              onChange={(e) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, onEmpty: e.target.value as OnEmpty } : r))}
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            >
                              <option value="required">{onEmptyLabels.required}</option>
                              <option value="warn">{onEmptyLabels.warn}</option>
                              <option value="allow">{onEmptyLabels.allow}</option>
                            </select>
                          </td>
                          <td className="px-2 py-1.5 text-center align-top">
                            <button type="button" onClick={() => handleDeleteExtractionRule(rule.id)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={handleAddExtractionRule}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 text-[13px] font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm quy tắc hợp nhất giá trị
              </button>
            </div>
          </div>

          {/* Kiểm thử */}
          <div className="border border-blue-200 rounded-xl overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 flex items-center gap-3 border-b border-blue-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <p className="text-[13px] font-semibold text-blue-800">Kiểm thử</p>
                <p className="text-[13px] text-blue-500">Chạy mô phỏng để xem trước kết quả áp dụng quy tắc so khớp và hợp nhất giá trị hiện tại</p>
              </div>
            </div>
            <div className="p-4 space-y-4 bg-white">
              <div className="border border-slate-200 rounded-xl bg-white p-4 flex flex-wrap items-end gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Chọn số lượng bản ghi chạy kiểm thử</label>
                  <select
                    value={testSample}
                    onChange={(e) => { setTestSample(e.target.value); setTestRun(false); }}
                    className="w-80 border border-slate-200 rounded-lg px-2 py-1.5 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  >
                    <option value="">-- Chọn số lượng bản ghi --</option>
                    {TEST_SAMPLE_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setTestRun(true)}
                  disabled={!testSample}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Chạy mô phỏng
                </button>
              </div>

              {!testRun ? (
                <div className="border border-dashed border-slate-200 rounded-xl bg-slate-50 p-8 text-center text-[13px] text-slate-400">
                  Chọn dữ liệu mẫu và nhấn "Chạy mô phỏng" để xem kết quả kiểm thử
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <div className="text-[13px] text-emerald-700 mb-1">Golden hình thành</div>
                      <div className="text-2xl font-bold text-emerald-800">312</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-[13px] text-blue-700 mb-1">Auto-merge</div>
                      <div className="text-2xl font-bold text-blue-800">268</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="text-[13px] text-amber-700 mb-1">Chờ rà soát</div>
                      <div className="text-2xl font-bold text-amber-800">37</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <div className="text-[13px] text-slate-600 mb-1">Không khớp</div>
                      <div className="text-2xl font-bold text-slate-800">183</div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                      <p className="text-[13px] font-semibold text-slate-800">Các bản ghi chờ rà soát</p>
                      <span className="text-[12px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-medium">
                        {MOCK_TEST_REVIEW_ITEMS.length} bản ghi
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[13px]">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="px-3 py-2.5 text-left font-semibold text-slate-600">Cặp bản ghi</th>
                            <th className="px-3 py-2.5 text-center font-semibold text-slate-600 w-28">Điểm khớp</th>
                            <th className="px-3 py-2.5 text-left font-semibold text-slate-600">Lý do</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {MOCK_TEST_REVIEW_ITEMS.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-3 py-2.5 font-medium text-slate-700">
                                <code className="px-1.5 py-0.5 rounded font-mono bg-slate-100 text-slate-700">{item.pair.split(' ↔ ')[0]}</code>
                                <span className="mx-1.5 text-slate-400">↔</span>
                                <code className="px-1.5 py-0.5 rounded font-mono bg-slate-100 text-slate-700">{item.pair.split(' ↔ ')[1]}</code>
                              </td>
                              <td className="px-3 py-2.5 text-center">
                                <span className="px-2 py-0.5 rounded font-semibold text-[12px] bg-amber-100 text-amber-800">{item.score}%</span>
                              </td>
                              <td className="px-3 py-2.5 text-slate-600">{item.reason}</td>
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
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-[13px] text-amber-800">
                <p className="mb-1">Khi chỉnh sửa quy tắc hợp nhất, phiên bản thực thể dữ liệu chủ sẽ tự động tăng từ <strong>v{selectedFilterEntityData?.version ?? 1}</strong> lên <strong>v{(selectedFilterEntityData?.version ?? 1) + 1}</strong>.</p>
                <p>Thay đổi này sẽ được ghi nhận trong lịch sử phiên bản.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-[13px] text-amber-800">
                <p className="mb-1">Khi thêm mới quy tắc hợp nhất, phiên bản thực thể dữ liệu chủ sẽ tự động tăng từ <strong>v{selectedFilterEntityData?.version ?? 1}</strong> lên <strong>v{(selectedFilterEntityData?.version ?? 1) + 1}</strong>.</p>
                <p>Thay đổi này sẽ được ghi nhận trong lịch sử phiên bản.</p>
              </div>
            </div>
          )}
        </div>
      </BaseModal>

      {/* Gửi trình duyệt Modal — shown after add/edit quy tắc hợp nhất */}
      {approvalRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-slate-900">Gửi trình duyệt</h3>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Quy tắc hợp nhất: <span className="text-indigo-700 font-medium">{approvalRule.name}</span>
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
                <h4 className="text-[13px] font-semibold text-slate-700 mb-3">Thông tin quy tắc hợp nhất</h4>
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thuộc thực thể:</span>
                    <span className="text-slate-800 font-medium">{approvalRule.entityName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số quy tắc so khớp:</span>
                    <span className="text-slate-800 font-medium">{approvalRule.matchingRulesDetail?.length ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số quy tắc trích rút:</span>
                    <span className="text-slate-800 font-medium">{approvalRule.extractionRulesDetail?.length ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phiên bản thực thể mới:</span>
                    <span className="text-slate-800">v{((mockEntities.find(e => e.id === approvalRule.entityId)?.version) ?? 1) + 1}</span>
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-[13px] transition-colors shadow-sm ${selectedApprover
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
      )}

      {/* Cảnh báo trước khi sửa/xóa quy tắc hợp nhất đã có bản ghi dữ liệu chủ hình thành */}
      <BaseModal
        isOpen={!!pendingAction}
        onClose={handleCancelPendingAction}
        title={pendingAction?.type === 'delete' ? 'Xóa quy tắc hợp nhất' : 'Chỉnh sửa quy tắc hợp nhất'}
        maxWidth="max-w-lg"
        customHeaderIcon={<AlertTriangle className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" />}
        footer={
          <>
            <button
              onClick={handleCancelPendingAction}
              className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmPendingAction}
              className={`px-4 py-2 text-[13px] font-medium text-white rounded-lg transition-colors ${
                pendingAction?.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {pendingAction?.type === 'delete' ? 'Xác nhận xóa' : 'Tiếp tục chỉnh sửa'}
            </button>
          </>
        }
      >
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-amber-800">
            Đã có bản ghi dữ liệu chủ hình thành từ quy tắc hợp nhất thiết lập, xóa quy tắc sẽ đồng thời xóa toàn bộ bản ghi dữ liệu chủ đã hình thành.
          </p>
        </div>
      </BaseModal>
    </div>
  );
}
