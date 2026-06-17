import { useState } from 'react';
import { Plus, Edit, Trash2, X, Check, AlertCircle, Play, Save, GitMerge, Database, Target, Weight } from 'lucide-react';

type RuleStatus = 'active' | 'inactive' | 'testing';
type DataSourceType = 'dldc' | 'lgsp' | 'ndxp' | 'manual';
type MatchStrategy = 'exact' | 'fuzzy' | 'phonetic' | 'custom';
type MergeStrategy = 'priority' | 'weighted' | 'latest' | 'manual';

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
    lastApplied: '24/12/2024 08:30'
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
    lastApplied: '23/12/2024 15:20'
  }
];

const mockEntities = [
  { id: '1', code: 'MD-CITIZEN-001', name: 'Bộ dữ liệu chủ Công dân' },
  { id: '2', code: 'MD-ORG-001', name: 'Bộ dữ liệu chủ Tổ chức' },
  { id: '3', code: 'MD-DOC-001', name: 'Bộ dữ liệu chủ Văn bản pháp luật' }
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

export function MergeRulesManagementTab() {
  const [rules, setRules] = useState<MergeRule[]>(mockMergeRules);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<MergeRule | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testingRule, setTestingRule] = useState<MergeRule | null>(null);

  const [formData, setFormData] = useState<Partial<MergeRule>>({
    name: '',
    entityId: '',
    sources: [],
    matchRules: [],
    extractRules: [],
    mergeStrategy: 'weighted',
    status: 'inactive'
  });

  const [newSource, setNewSource] = useState<SourceConfig>({
    sourceType: 'dldc',
    sourceName: '',
    priority: 1,
    weight: 50,
    isActive: true
  });

  const [newMatchRule, setNewMatchRule] = useState<Partial<MatchRuleConfig>>({
    fieldName: '',
    strategy: 'exact',
    threshold: 90
  });

  const [newExtractRule, setNewExtractRule] = useState<Partial<ExtractRuleConfig>>({
    sourceField: '',
    targetField: '',
    transformation: ''
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.entityId) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!formData.sources || formData.sources.length < 2) {
      alert('Cần ít nhất 2 nguồn dữ liệu để hợp nhất');
      return;
    }

    if (!formData.matchRules || formData.matchRules.length === 0) {
      alert('Cần ít nhất 1 quy tắc so khớp');
      return;
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    const selectedEntity = mockEntities.find(e => e.id === formData.entityId);

    if (editingRule) {
      const updatedRules = rules.map(rule =>
        rule.id === editingRule.id
          ? { ...rule, ...formData, entityName: selectedEntity?.name || '' }
          : rule
      );
      setRules(updatedRules);
    } else {
      const newRule: MergeRule = {
        id: `rule-${Date.now()}`,
        name: formData.name!,
        entityId: formData.entityId!,
        entityName: selectedEntity?.name || '',
        sources: formData.sources!,
        matchRules: formData.matchRules!,
        extractRules: formData.extractRules!,
        mergeStrategy: formData.mergeStrategy!,
        status: formData.status!,
        createdDate: dateStr
      };
      setRules([...rules, newRule]);
    }

    handleCloseForm();
  };

  const handleEdit = (rule: MergeRule) => {
    setEditingRule(rule);
    setFormData(rule);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa quy tắc hợp nhất này?')) {
      setRules(rules.filter(rule => rule.id !== id));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRule(null);
    setFormData({
      name: '',
      entityId: '',
      sources: [],
      matchRules: [],
      extractRules: [],
      mergeStrategy: 'weighted',
      status: 'inactive'
    });
  };

  const handleAddSource = () => {
    if (!newSource.sourceName) {
      alert('Vui lòng nhập tên nguồn dữ liệu');
      return;
    }

    setFormData({
      ...formData,
      sources: [...(formData.sources || []), { ...newSource }]
    });

    setNewSource({
      sourceType: 'dldc',
      sourceName: '',
      priority: (formData.sources?.length || 0) + 2,
      weight: 50,
      isActive: true
    });
  };

  const handleDeleteSource = (index: number) => {
    setFormData({
      ...formData,
      sources: formData.sources?.filter((_, i) => i !== index)
    });
  };

  const handleAddMatchRule = () => {
    if (!newMatchRule.fieldName) {
      alert('Vui lòng nhập tên trường');
      return;
    }

    setFormData({
      ...formData,
      matchRules: [
        ...(formData.matchRules || []),
        { ...newMatchRule, id: `m-${Date.now()}` } as MatchRuleConfig
      ]
    });

    setNewMatchRule({
      fieldName: '',
      strategy: 'exact',
      threshold: 90
    });
  };

  const handleDeleteMatchRule = (id: string) => {
    setFormData({
      ...formData,
      matchRules: formData.matchRules?.filter(rule => rule.id !== id)
    });
  };

  const handleAddExtractRule = () => {
    if (!newExtractRule.sourceField || !newExtractRule.targetField) {
      alert('Vui lòng nhập đầy đủ trường nguồn và trường đích');
      return;
    }

    setFormData({
      ...formData,
      extractRules: [
        ...(formData.extractRules || []),
        { ...newExtractRule, id: `e-${Date.now()}` } as ExtractRuleConfig
      ]
    });

    setNewExtractRule({
      sourceField: '',
      targetField: '',
      transformation: ''
    });
  };

  const handleDeleteExtractRule = (id: string) => {
    setFormData({
      ...formData,
      extractRules: formData.extractRules?.filter(rule => rule.id !== id)
    });
  };

  const handleTestRule = (rule: MergeRule) => {
    setTestingRule(rule);
    setShowTestModal(true);
  };

  const handleToggleStatus = (id: string) => {
    setRules(rules.map(rule =>
      rule.id === id
        ? { ...rule, status: rule.status === 'active' ? 'inactive' : 'active' }
        : rule
    ));
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
        <h2 className="text-slate-900">Thiết lập quy tắc hợp nhất dữ liệu chủ</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm quy tắc mới
        </button>
      </div>

      {/* Rules Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm text-slate-700">Tên quy tắc</th>
                <th className="text-left px-4 py-3 text-sm text-slate-700">Thực thể dữ liệu chủ</th>
                <th className="text-left px-4 py-3 text-sm text-slate-700">Số nguồn</th>
                <th className="text-left px-4 py-3 text-sm text-slate-700">Chiến lược</th>
                <th className="text-left px-4 py-3 text-sm text-slate-700">Trạng thái</th>
                <th className="text-left px-4 py-3 text-sm text-slate-700">Lần áp dụng cuối</th>
                <th className="text-right px-4 py-3 text-sm text-slate-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <GitMerge className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">
                      Nội dung chức năng Thiết lập quy tắc hợp nhất dữ liệu chủ
                    </p>
                  </td>
                </tr>
              ) : (
                rules.map((rule) => {
                  const statusBadge = getStatusBadge(rule.status);
                  return (
                    <tr key={rule.id} className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-slate-900">{rule.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {rule.matchRules.length} quy tắc so khớp, {rule.extractRules.length} quy tắc trích rút
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900">{rule.entityName}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {rule.sources.slice(0, 2).map((source, idx) => (
                            <span key={idx} className="text-xs text-blue-600">
                              {source.sourceName}
                            </span>
                          ))}
                          {rule.sources.length > 2 && (
                            <span className="text-xs text-slate-500">+{rule.sources.length - 2} nguồn khác</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {mergeStrategyLabels[rule.mergeStrategy]}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {rule.lastApplied || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleTestRule(rule)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Kiểm thử"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(rule.id)}
                            className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                            title={rule.status === 'active' ? 'Tắt' : 'Bật'}
                          >
                            <Target className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(rule)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(rule.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg text-slate-900">
                {editingRule ? 'Chỉnh sửa quy tắc hợp nhất' : 'Thêm quy tắc hợp nhất mới'}
              </h3>
              <button onClick={handleCloseForm} className="p-1 hover:bg-slate-100 rounded" title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-sm text-slate-900">Thông tin cơ bản</h4>

                <div>
                  <label className="block text-sm text-slate-700 mb-1">
                    Tên quy tắc <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Hợp nhất dữ liệu công dân từ CCCD và Hộ tịch"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1">
                    Thực thể dữ liệu chủ <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.entityId}
                    onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn thực thể --</option>
                    {mockEntities.map(entity => (
                      <option key={entity.id} value={entity.id}>
                        {entity.code} - {entity.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1">
                    Chiến lược hợp nhất <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.mergeStrategy}
                    onChange={(e) => setFormData({ ...formData, mergeStrategy: e.target.value as MergeStrategy })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(mergeStrategyLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data Sources */}
              <div className="space-y-4 border-t border-slate-200 pt-6">
                <h4 className="text-sm text-slate-900">Cấu hình nguồn dữ liệu</h4>

                {/* Add Source Form */}
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <p className="text-sm text-slate-700">Thêm nguồn dữ liệu</p>
                  <div className="grid grid-cols-5 gap-3">
                    <div>
                      <label className="block text-xs text-slate-700 mb-1">Loại nguồn</label>
                      <select
                        value={newSource.sourceType}
                        onChange={(e) => setNewSource({ ...newSource, sourceType: e.target.value as DataSourceType })}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Object.entries(dataSourceLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-slate-700 mb-1">Tên nguồn</label>
                      <input
                        type="text"
                        value={newSource.sourceName}
                        onChange={(e) => setNewSource({ ...newSource, sourceName: e.target.value })}
                        placeholder="VD: Hệ thống CCCD - Bộ Công an"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-700 mb-1">Độ ưu tiên</label>
                      <input
                        type="number"
                        value={newSource.priority}
                        onChange={(e) => setNewSource({ ...newSource, priority: parseInt(e.target.value) })}
                        min="1"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-700 mb-1">Trọng số (%)</label>
                      <input
                        type="number"
                        value={newSource.weight}
                        onChange={(e) => setNewSource({ ...newSource, weight: parseInt(e.target.value) })}
                        min="0"
                        max="100"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddSource}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm nguồn
                  </button>
                </div>

                {/* Sources List */}
                {formData.sources && formData.sources.length > 0 && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-3 py-2 text-xs text-slate-700">Loại</th>
                          <th className="text-left px-3 py-2 text-xs text-slate-700">Tên nguồn</th>
                          <th className="text-left px-3 py-2 text-xs text-slate-700">Độ ưu tiên</th>
                          <th className="text-left px-3 py-2 text-xs text-slate-700">Trọng số</th>
                          <th className="text-right px-3 py-2 text-xs text-slate-700">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.sources.map((source, index) => (
                          <tr key={index} className="border-t border-slate-200">
                            <td className="px-3 py-2 text-xs">{dataSourceLabels[source.sourceType]}</td>
                            <td className="px-3 py-2 text-xs">{source.sourceName}</td>
                            <td className="px-3 py-2 text-xs">
                              <span className="inline-flex items-center gap-1">
                                <Target className="w-3 h-3 text-blue-600" />
                                {source.priority}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-xs">
                              <span className="inline-flex items-center gap-1">
                                <Weight className="w-3 h-3 text-purple-600" />
                                {source.weight}%
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                onClick={() => handleDeleteSource(index)}
                                className="text-red-600 hover:bg-red-50 p-1 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Match Rules */}
              <div className="space-y-4 border-t border-slate-200 pt-6">
                <h4 className="text-sm text-slate-900">Quy tắc so khớp</h4>

                {/* Add Match Rule Form */}
                <div className="bg-green-50 p-4 rounded-lg space-y-3">
                  <p className="text-sm text-slate-700">Thêm quy tắc so khớp</p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs text-slate-700 mb-1">Tên trường</label>
                      <input
                        type="text"
                        value={newMatchRule.fieldName}
                        onChange={(e) => setNewMatchRule({ ...newMatchRule, fieldName: e.target.value })}
                        placeholder="VD: citizen_id, full_name"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-700 mb-1">Chiến lược</label>
                      <select
                        value={newMatchRule.strategy}
                        onChange={(e) => setNewMatchRule({ ...newMatchRule, strategy: e.target.value as MatchStrategy })}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {Object.entries(matchStrategyLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-700 mb-1">Ngưỡng (%)</label>
                      <input
                        type="number"
                        value={newMatchRule.threshold || ''}
                        onChange={(e) => setNewMatchRule({ ...newMatchRule, threshold: parseInt(e.target.value) })}
                        placeholder="85"
                        min="0"
                        max="100"
                        disabled={newMatchRule.strategy === 'exact'}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddMatchRule}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm quy tắc so khớp
                  </button>
                </div>

                {/* Match Rules List */}
                {formData.matchRules && formData.matchRules.length > 0 && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-3 py-2 text-xs text-slate-700">Tên trường</th>
                          <th className="text-left px-3 py-2 text-xs text-slate-700">Chiến lược</th>
                          <th className="text-left px-3 py-2 text-xs text-slate-700">Ngưỡng</th>
                          <th className="text-right px-3 py-2 text-xs text-slate-700">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.matchRules.map((rule) => (
                          <tr key={rule.id} className="border-t border-slate-200">
                            <td className="px-3 py-2">
                              <code className="text-xs bg-slate-100 px-2 py-1 rounded">{rule.fieldName}</code>
                            </td>
                            <td className="px-3 py-2 text-xs">{matchStrategyLabels[rule.strategy]}</td>
                            <td className="px-3 py-2 text-xs">{rule.threshold ? `${rule.threshold}%` : '-'}</td>
                            <td className="px-3 py-2 text-right">
                              <button
                                onClick={() => handleDeleteMatchRule(rule.id)}
                                className="text-red-600 hover:bg-red-50 p-1 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Extract Rules */}
              <div className="space-y-4 border-t border-slate-200 pt-6">
                <h4 className="text-sm text-slate-900">Quy tắc trích rút và chuyển đổi</h4>

                {/* Add Extract Rule Form */}
                <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                  <p className="text-sm text-slate-700">Thêm quy tắc trích rút</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-700 mb-1">Trường nguồn</label>
                      <input
                        type="text"
                        value={newExtractRule.sourceField}
                        onChange={(e) => setNewExtractRule({ ...newExtractRule, sourceField: e.target.value })}
                        placeholder="VD: cccd_number"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-700 mb-1">Trường đích</label>
                      <input
                        type="text"
                        value={newExtractRule.targetField}
                        onChange={(e) => setNewExtractRule({ ...newExtractRule, targetField: e.target.value })}
                        placeholder="VD: citizen_id"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-700 mb-1">Chuyển đổi</label>
                      <input
                        type="text"
                        value={newExtractRule.transformation || ''}
                        onChange={(e) => setNewExtractRule({ ...newExtractRule, transformation: e.target.value })}
                        placeholder="VD: UPPERCASE, TRIM"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddExtractRule}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm quy tắc trích rút
                  </button>
                </div>

                {/* Extract Rules List */}
                {formData.extractRules && formData.extractRules.length > 0 && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-3 py-2 text-xs text-slate-700">Trường nguồn</th>
                          <th className="text-left px-3 py-2 text-xs text-slate-700">Trường đích</th>
                          <th className="text-left px-3 py-2 text-xs text-slate-700">Chuyển đổi</th>
                          <th className="text-right px-3 py-2 text-xs text-slate-700">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.extractRules.map((rule) => (
                          <tr key={rule.id} className="border-t border-slate-200">
                            <td className="px-3 py-2">
                              <code className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-700">{rule.sourceField}</code>
                            </td>
                            <td className="px-3 py-2">
                              <code className="text-xs bg-green-100 px-2 py-1 rounded text-green-700">{rule.targetField}</code>
                            </td>
                            <td className="px-3 py-2 text-xs">{rule.transformation || '-'}</td>
                            <td className="px-3 py-2 text-right">
                              <button
                                onClick={() => handleDeleteExtractRule(rule.id)}
                                className="text-red-600 hover:bg-red-50 p-1 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 sticky bottom-0">
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingRule ? 'Cập nhật' : 'Lưu quy tắc'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Modal */}
      {showTestModal && testingRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg text-slate-900">Kiểm thử quy tắc hợp nhất</h3>
              <button onClick={() => setShowTestModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-slate-900 mb-2">Quy tắc: {testingRule.name}</p>
                <p className="text-xs text-slate-600">
                  {testingRule.sources.length} nguồn dữ liệu • {testingRule.matchRules.length} quy tắc so khớp
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-6 text-center">
                <Play className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-sm text-slate-900 mb-2">Chạy kiểm thử hợp nhất</p>
                <p className="text-xs text-slate-600 mb-4">
                  Hệ thống sẽ lấy mẫu dữ liệu từ các nguồn và thử nghiệm quy tắc hợp nhất
                </p>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Bắt đầu kiểm thử
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="mb-1">Lưu ý khi kiểm thử:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Kiểm thử chỉ sử dụng dữ liệu mẫu, không ảnh hưởng đến dữ liệu thật</li>
                      <li>Kết quả kiểm thử sẽ hiển thị các bản ghi được khớp và hợp nhất</li>
                      <li>Bạn có thể xem chi tiết từng bước hợp nhất</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}