import { useState } from 'react';
import { Plus, Edit, Trash2, AlertCircle, Save, GitMerge, ChevronDown, X, Send } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal';

type RuleStatus = 'active' | 'inactive' | 'testing';
type DataSourceType = 'dldc' | 'lgsp' | 'ndxp' | 'manual';
type MatchStrategy = 'exact' | 'fuzzy' | 'phonetic' | 'custom';
type MergeStrategy = 'priority' | 'weighted' | 'latest' | 'manual';
type MatchMethod = 'exact' | 'fuzzy';
type ConditionOperator = 'AND' | 'OR';
type ConflictStrategy = 'priority' | 'most_recent' | 'most_complete' | 'flag';
type MergeTrigger = 'auto' | 'approval';

// Lớp 1 — Quy tắc so khớp (chi tiết, dùng cho modal Xem chi tiết)
interface MatchingRuleDetail {
  id: string;
  fieldName: string;
  method: MatchMethod;
  fuzzyThreshold?: number;
  normalize: boolean;
  operator?: ConditionOperator;
}

// Lớp 2 — Quy tắc trích rút (chi tiết, dùng cho modal Xem chi tiết)
interface ExtractionRuleDetail {
  id: string;
  fieldName: string;
  primarySource: string;
  fallbackSource?: string;
  conflictStrategy: ConflictStrategy;
}

// Lớp 3 — Quy tắc hợp nhất (chi tiết, dùng cho modal Xem chi tiết)
interface MergeConfigDetail {
  keepSourceRef: boolean;
  mergeTrigger: MergeTrigger;
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
  // 3 lớp quy tắc hợp nhất chi tiết (giống Bước 4 của wizard Tạo mới dữ liệu chủ)
  minMatchScore?: number;
  matchingRulesDetail?: MatchingRuleDetail[];
  extractionRulesDetail?: ExtractionRuleDetail[];
  mergeConfigDetail?: MergeConfigDetail;
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
    minMatchScore: 80,
    matchingRulesDetail: [
      { id: 'md1', fieldName: 'citizen_id', method: 'exact', normalize: false, operator: 'OR' },
      { id: 'md2', fieldName: 'full_name', method: 'fuzzy', fuzzyThreshold: 85, normalize: true }
    ],
    extractionRulesDetail: [
      { id: 'ed1', fieldName: 'citizen_id', primarySource: 'Hệ thống CCCD - Bộ Công an', conflictStrategy: 'priority' },
      { id: 'ed2', fieldName: 'full_name', primarySource: 'Hệ thống Hộ tịch - Bộ Tư pháp', fallbackSource: 'Hệ thống CCCD - Bộ Công an', conflictStrategy: 'most_recent' }
    ],
    mergeConfigDetail: { keepSourceRef: true, mergeTrigger: 'auto' }
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
    minMatchScore: 75,
    matchingRulesDetail: [
      { id: 'md3', fieldName: 'tax_code', method: 'exact', normalize: false, operator: 'AND' },
      { id: 'md4', fieldName: 'business_name', method: 'fuzzy', fuzzyThreshold: 80, normalize: true }
    ],
    extractionRulesDetail: [
      { id: 'ed3', fieldName: 'tax_code', primarySource: 'CSDL Đăng ký kinh doanh', conflictStrategy: 'priority' },
      { id: 'ed4', fieldName: 'business_name', primarySource: 'CSDL Đăng ký kinh doanh', fallbackSource: 'Hệ thống Thuế - Bộ Tài chính', conflictStrategy: 'most_complete' }
    ],
    mergeConfigDetail: { keepSourceRef: false, mergeTrigger: 'approval' }
  }
];

const mockEntities = [
  { id: '1', code: 'MD-CITIZEN-001', name: 'Bộ dữ liệu chủ Công dân', version: 2 },
  { id: '2', code: 'MD-ORG-001', name: 'Bộ dữ liệu chủ Tổ chức', version: 2 },
  { id: '3', code: 'MD-DOC-001', name: 'Bộ dữ liệu chủ Văn bản pháp luật', version: 1 }
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
  exact: 'Khớp chính xác (Exact)',
  fuzzy: 'Khớp gần đúng (Fuzzy)'
};

const conflictStrategyLabels: Record<ConflictStrategy, string> = {
  priority: 'Ưu tiên nguồn cao nhất',
  most_recent: 'Giá trị mới nhất',
  most_complete: 'Giá trị đầy đủ nhất',
  flag: 'Gắn cờ chờ người duyệt'
};

const mergeTriggerLabels: Record<MergeTrigger, string> = {
  auto: 'Tự động hợp nhất lại ngay',
  approval: 'Chờ phê duyệt trước khi hợp nhất'
};

export function MergeRulesManagementTab({ readOnly = false }: { readOnly?: boolean } = {}) {
  const [rules, setRules] = useState<MergeRule[]>(mockMergeRules);

  // Chọn thực thể dữ liệu chủ để xem/cấu hình quy tắc hợp nhất
  const [selectedEntityFilter, setSelectedEntityFilter] = useState('');
  const selectedFilterEntityData = mockEntities.find(e => e.id === selectedEntityFilter);
  const currentRule = selectedEntityFilter ? rules.find(rule => rule.entityId === selectedEntityFilter) : undefined;

  // Modal Thêm/Chỉnh sửa — giống Bước 4 "Quy tắc hợp nhất dữ liệu" trong wizard Tạo mới dữ liệu chủ
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<MergeRule | null>(null);
  const [ruleName, setRuleName] = useState('');
  const [minMatchScore, setMinMatchScore] = useState(80);
  const [matchingRules, setMatchingRules] = useState<MatchingRuleDetail[]>([]);
  const [extractionRules, setExtractionRules] = useState<ExtractionRuleDetail[]>([]);
  const [mergeConfig, setMergeConfig] = useState<MergeConfigDetail>({ keepSourceRef: true, mergeTrigger: 'auto' });

  // Gửi trình duyệt modal (shown after add/edit)
  const [approvalRule, setApprovalRule] = useState<MergeRule | null>(null);
  const [selectedApprover, setSelectedApprover] = useState('');
  const [approvalNote, setApprovalNote] = useState('');

  const handleOpenAdd = () => {
    setEditingRule(null);
    setRuleName(`Hợp nhất dữ liệu ${selectedFilterEntityData?.name || ''}`);
    setMinMatchScore(80);
    setMatchingRules([]);
    setExtractionRules([]);
    setMergeConfig({ keepSourceRef: true, mergeTrigger: 'auto' });
    setShowForm(true);
  };

  const handleOpenEdit = (rule: MergeRule) => {
    setEditingRule(rule);
    setRuleName(rule.name);
    setMinMatchScore(rule.minMatchScore ?? 80);
    setMatchingRules(rule.matchingRulesDetail ?? []);
    setExtractionRules(rule.extractionRulesDetail ?? []);
    setMergeConfig(rule.mergeConfigDetail ?? { keepSourceRef: true, mergeTrigger: 'auto' });
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
      alert('Cần ít nhất 1 quy tắc so khớp (Lớp 1)');
      return;
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    let savedRule: MergeRule;

    if (editingRule) {
      savedRule = {
        ...editingRule,
        name: ruleName,
        minMatchScore,
        matchingRulesDetail: matchingRules,
        extractionRulesDetail: extractionRules,
        mergeConfigDetail: mergeConfig
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
        minMatchScore,
        matchingRulesDetail: matchingRules,
        extractionRulesDetail: extractionRules,
        mergeConfigDetail: mergeConfig
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
    setMatchingRules(prev => [...prev, { id: `md-${Date.now()}`, fieldName: '', method: 'exact', fuzzyThreshold: 80, normalize: false, operator: 'AND' }]);
  };

  const handleDeleteMatchingRule = (id: string) => {
    setMatchingRules(prev => prev.filter(rule => rule.id !== id));
  };

  const handleAddExtractionRule = () => {
    setExtractionRules(prev => [...prev, { id: `ed-${Date.now()}`, fieldName: '', primarySource: '', fallbackSource: '', conflictStrategy: 'priority' }]);
  };

  const handleDeleteExtractionRule = (id: string) => {
    setExtractionRules(prev => prev.filter(rule => rule.id !== id));
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa quy tắc hợp nhất này?')) {
      setRules(rules.filter(rule => rule.id !== id));
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
        <div className="relative">
          <select
            value={selectedEntityFilter}
            onChange={(e) => setSelectedEntityFilter(e.target.value)}
            className="w-full pl-3 pr-8 py-2 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[13px] appearance-none cursor-pointer"
          >
            <option value="">-- Chọn thực thể dữ liệu chủ --</option>
            {mockEntities.map(entity => (
              <option key={entity.id} value={entity.id}>{entity.code} - {entity.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
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
            {!readOnly && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleOpenEdit(currentRule)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Chỉnh sửa"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(currentRule.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
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
              <p className="text-[13px] text-slate-600">
                Tỷ lệ khớp tối thiểu để hệ thống tự động gộp bản ghi:{' '}
                <span className="font-semibold text-slate-900">{currentRule.minMatchScore ?? '-'}%</span>
              </p>
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-[13px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Trường đối chiếu</th>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Phương pháp</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-36">Tỷ lệ khớp tối thiểu</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-24">Chuẩn hóa</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-28">Điều kiện kết hợp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {!currentRule.matchingRulesDetail || currentRule.matchingRulesDetail.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-[13px] text-slate-400">
                          Chưa cấu hình quy tắc so khớp
                        </td>
                      </tr>
                    ) : (
                      currentRule.matchingRulesDetail.map(rule => (
                        <tr key={rule.id}>
                          <td className="px-3 py-2 text-slate-700">{rule.fieldName}</td>
                          <td className="px-3 py-2 text-slate-700">{matchMethodLabels[rule.method]}</td>
                          <td className="px-3 py-2 text-center text-slate-700">
                            {rule.method === 'fuzzy' ? `${rule.fuzzyThreshold ?? '-'}%` : <span className="text-slate-400">—</span>}
                          </td>
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

          {/* Lớp 2: Extraction Rules */}
          <div className="border border-blue-200 rounded-xl overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 flex items-center gap-3 border-b border-blue-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <p className="text-[13px] font-semibold text-blue-800">Lớp 2 — Quy tắc trích rút (Extraction Rules)</p>
                <p className="text-[13px] text-blue-500">Sau khi xác định hai bản ghi là cùng thực thể, lấy giá trị từng trường từ nguồn nào</p>
              </div>
            </div>
            <div className="p-4 bg-white">
              {!currentRule.extractionRulesDetail || currentRule.extractionRulesDetail.length === 0 ? (
                <p className="text-[13px] text-slate-400 text-center py-6">Chưa cấu hình quy tắc trích rút</p>
              ) : (
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <table className="w-full text-[13px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Trường</th>
                        <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Nguồn ưu tiên</th>
                        <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Nguồn thay thế</th>
                        <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Xử lý xung đột dữ liệu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 bg-white">
                      {currentRule.extractionRulesDetail.map(rule => (
                        <tr key={rule.id}>
                          <td className="px-3 py-2 text-slate-700">{rule.fieldName}</td>
                          <td className="px-3 py-2 text-slate-700">{rule.primarySource}</td>
                          <td className="px-3 py-2 text-slate-700">{rule.fallbackSource || <span className="text-slate-400">—</span>}</td>
                          <td className="px-3 py-2 text-slate-700">{conflictStrategyLabels[rule.conflictStrategy]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Lớp 3: Merge Config */}
          <div className="border border-blue-200 rounded-xl overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 flex items-center gap-3 border-b border-blue-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <p className="text-[13px] font-semibold text-blue-800">Lớp 3 — Quy tắc hợp nhất (Merge Rules)</p>
                <p className="text-[13px] text-blue-500">Cách tạo ra bản ghi dữ liệu chủ cuối cùng từ kết quả trích rút</p>
              </div>
            </div>
            <div className="p-4 space-y-2 bg-white text-[13px]">
              <div className="flex gap-2">
                <span className="text-slate-500 w-52 flex-shrink-0">Giữ liên kết ngược về nguồn gốc:</span>
                <span className="text-slate-900">{currentRule.mergeConfigDetail?.keepSourceRef ? 'Có' : 'Không'}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-500 w-52 flex-shrink-0">Điều kiện kích hoạt hợp nhất lại:</span>
                <span className="text-slate-900">
                  {currentRule.mergeConfigDetail ? mergeTriggerLabels[currentRule.mergeConfigDetail.mergeTrigger] : '-'}
                </span>
              </div>
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
        maxWidth="max-w-4xl"
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
              <div className="flex items-center gap-3">
                <label className="text-[13px] font-medium text-slate-700 whitespace-nowrap">Tỷ lệ khớp tối thiểu để hệ thống tự động gộp bản ghi:</label>
                <input
                  type="number" min={0} max={100}
                  value={minMatchScore}
                  onChange={(e) => setMinMatchScore(Number(e.target.value))}
                  className="w-20 border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
                <span className="text-[13px] text-slate-500">%</span>
              </div>

              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-[13px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Trường đối chiếu</th>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Phương pháp</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-32">Tỷ lệ khớp tối thiểu (%)</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-24">Chuẩn hóa</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-32">Điều kiện kết hợp</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {matchingRules.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-[13px] text-slate-400">
                          Chưa có quy tắc — nhấn "+ Thêm quy tắc so khớp" để bắt đầu
                        </td>
                      </tr>
                    ) : (
                      matchingRules.map((rule, idx) => (
                        <tr key={rule.id}>
                          <td className="px-2 py-1.5">
                            <input
                              type="text"
                              value={rule.fieldName}
                              onChange={(e) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, fieldName: e.target.value } : r))}
                              placeholder="VD: citizen_id"
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <select
                              value={rule.method}
                              onChange={(e) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, method: e.target.value as MatchMethod } : r))}
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            >
                              <option value="exact">Khớp chính xác (Exact)</option>
                              <option value="fuzzy">Khớp gần đúng (Fuzzy)</option>
                            </select>
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            {rule.method === 'fuzzy' ? (
                              <input
                                type="number" min={0} max={100}
                                value={rule.fuzzyThreshold ?? 80}
                                onChange={(e) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, fuzzyThreshold: Number(e.target.value) } : r))}
                                className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              />
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
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

          {/* Lớp 2: Extraction Rules */}
          <div className="border border-blue-200 rounded-xl overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 flex items-center gap-3 border-b border-blue-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <p className="text-[13px] font-semibold text-blue-800">Lớp 2 — Quy tắc trích rút (Extraction Rules)</p>
                <p className="text-[13px] text-blue-500">Sau khi xác định hai bản ghi là cùng thực thể, lấy giá trị từng trường từ nguồn nào</p>
              </div>
            </div>
            <div className="p-4 space-y-3 bg-white">
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-[13px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Trường</th>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Nguồn ưu tiên</th>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Nguồn thay thế (nếu rỗng)</th>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Xử lý xung đột dữ liệu</th>
                      <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {extractionRules.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-[13px] text-slate-400">
                          Chưa có quy tắc — nhấn "+ Thêm quy tắc trích rút" để bắt đầu
                        </td>
                      </tr>
                    ) : (
                      extractionRules.map(rule => (
                        <tr key={rule.id}>
                          <td className="px-2 py-1.5">
                            <input
                              type="text"
                              value={rule.fieldName}
                              onChange={(e) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, fieldName: e.target.value } : r))}
                              placeholder="VD: citizen_id"
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <input
                              type="text"
                              value={rule.primarySource}
                              onChange={(e) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, primarySource: e.target.value } : r))}
                              placeholder="VD: Hệ thống CCCD - Bộ Công an"
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <input
                              type="text"
                              value={rule.fallbackSource || ''}
                              onChange={(e) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, fallbackSource: e.target.value } : r))}
                              placeholder="Không có"
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <select
                              value={rule.conflictStrategy}
                              onChange={(e) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, conflictStrategy: e.target.value as ConflictStrategy } : r))}
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            >
                              {Object.entries(conflictStrategyLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-2 py-1.5 text-center">
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
                Thêm quy tắc trích rút
              </button>
            </div>
          </div>

          {/* Lớp 3: Merge Config */}
          <div className="border border-blue-200 rounded-xl overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 flex items-center gap-3 border-b border-blue-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <p className="text-[13px] font-semibold text-blue-800">Lớp 3 — Quy tắc hợp nhất (Merge Rules)</p>
                <p className="text-[13px] text-blue-500">Cách tạo ra bản ghi dữ liệu chủ cuối cùng từ kết quả trích rút</p>
              </div>
            </div>
            <div className="p-4 space-y-4 bg-white">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={mergeConfig.keepSourceRef}
                  onChange={() => setMergeConfig(prev => ({ ...prev, keepSourceRef: !prev.keepSourceRef }))}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer w-4 h-4 flex-shrink-0"
                />
                <div>
                  <p className="text-[13px] font-medium text-slate-700">Giữ liên kết ngược về nguồn gốc (Source Reference)</p>
                  <p className="text-[13px] text-slate-500">Bản ghi chủ lưu thông tin nó được hợp nhất từ nguồn nào, ID bản ghi gốc nào</p>
                </div>
              </label>
              <div>
                <p className="text-[13px] font-medium text-slate-700 mb-2">Điều kiện kích hoạt hợp nhất lại khi nguồn cập nhật</p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio" name="mergeTrigger" value="auto"
                      checked={mergeConfig.mergeTrigger === 'auto'}
                      onChange={() => setMergeConfig(prev => ({ ...prev, mergeTrigger: 'auto' }))}
                      className="text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                    />
                    <span className="text-[13px] text-slate-700">Tự động hợp nhất lại ngay</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio" name="mergeTrigger" value="approval"
                      checked={mergeConfig.mergeTrigger === 'approval'}
                      onChange={() => setMergeConfig(prev => ({ ...prev, mergeTrigger: 'approval' }))}
                      className="text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                    />
                    <span className="text-[13px] text-slate-700">Chờ phê duyệt trước khi hợp nhất</span>
                  </label>
                </div>
              </div>
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
    </div>
  );
}