import { useState } from 'react';
import { X, Plus, Trash2, Save, AlertCircle, CheckCircle2, Link2, Copy } from 'lucide-react';

interface ConfigureRuleModalProps {
  isOpen?: boolean;
  rule?: {
    id: string;
    name: string;
    type: 'clean' | 'standardize' | 'transform';
  };
  availableRuleTypes?: string[];
  sourceType?: 'internal' | 'external';
  sourceName?: string;
  onClose: () => void;
  onSave?: (config: any) => void;
}

type RuleType = 'format' | 'validation' | 'missing-value' | 'outlier' | 'key-matching' | 'duplicate' | 'reference-constraint' | 'transform-format' | 'merge-split-column' | 'classify-label';

interface RuleConfig {
  id: string;
  type: RuleType;
  field: string;
  condition: string;
  action: string;
  value?: string;
  enabled: boolean;
  targetField?: string;
  keyField?: string;
  referenceTable?: string;
}

const ruleTypeOptions = [
  // Nhóm 1: Làm sạch dữ liệu
  { value: 'format', label: 'Kiểm tra chuẩn định dạng', icon: '📋', description: 'Kiểm tra định dạng dữ liệu (email, số điện thoại, ngày tháng...)', group: 'clean' },
  { value: 'validation', label: 'Kiểm tra tính hợp lệ', icon: '✓', description: 'Kiểm tra tính hợp lệ của dữ liệu (khoảng giá trị, độ dài...)', group: 'clean' },
  { value: 'missing-value', label: 'Xử lý giá trị thiếu', icon: '⚠️', description: 'Xử lý dữ liệu null, empty hoặc thiếu', group: 'clean' },
  { value: 'outlier', label: 'Xử lý giá trị ngoại lệ', icon: '🔍', description: 'Loại bỏ hoặc thay thế giá trị bất thường', group: 'clean' },
  
  // Nhóm 2: Đối sánh và tham chiếu
  { value: 'key-matching', label: 'Kiểm tra đối sánh khóa', icon: '🔑', description: 'Kiểm tra đối sánh tồn tại dựa trên trường khóa', group: 'standardize' },
  { value: 'duplicate', label: 'Xử lý trùng lặp', icon: '🔄', description: 'Phát hiện và xử lý bản ghi trùng lặp', group: 'standardize' },
  { value: 'reference-constraint', label: 'Ràng buộc tham chiếu', icon: '🔗', description: 'Xử lý vi phạm ràng buộc thuộc tính tham chiếu', group: 'standardize' },
  
  // Nhóm 3: Biến đổi dữ liệu
  { value: 'transform-format', label: 'Biến đổi định dạng', icon: '🔀', description: 'Chuyển đổi định dạng dữ liệu (chữ hoa, chữ thường, chuẩn hóa...)', group: 'transform' },
  { value: 'merge-split-column', label: 'Gộp/Tách cột', icon: '⚡', description: 'Gộp nhiều cột hoặc tách một cột thành nhiều cột', group: 'transform' },
  { value: 'classify-label', label: 'Phân loại/Gán nhãn', icon: '🏷️', description: 'Tự động phân loại và gán nhãn dữ liệu', group: 'transform' },
];

const fieldOptions = [
  // Thông tin cá nhân
  'Họ và tên',
  'CMND/CCCD',
  'Ngày sinh',
  'Số điện thoại',
  'Email',
  'Địa chỉ',
  'Giới tính',
  'Quốc tịch',
  'Dân tộc',
  'Tôn giáo',
  'Nghề nghiệp',
  
  // Thông tin đấu giá viên
  'Mã đấu giá viên',
  'Số thẻ đấu giá viên',
  'Ngày cấp thẻ',
  'Ngày hết hạn',
  'Trạng thái hoạt động',
  'Đơn vị công tác',
  'Chứng chỉ hành nghề',
  'Số quyết định',
  
  // Khóa và tham chiếu
  'ID bản ghi',
  'Mã tham chiếu',
  'Mã tổ chức',
];

const formatConditions = {
  'CMND/CCCD': ['Đúng định dạng 9 số', 'Đúng định dạng 12 số', 'Không chứa ký tự đặc biệt'],
  'Ngày sinh': ['Đúng định dạng dd/mm/yyyy', 'Đúng định dạng yyyy-mm-dd', 'Là ngày hợp lệ'],
  'Ngày cấp thẻ': ['Đúng định dạng dd/mm/yyyy', 'Đúng định dạng yyyy-mm-dd', 'Là ngày hợp lệ'],
  'Ngày hết hạn': ['Đúng định dạng dd/mm/yyyy', 'Đúng định dạng yyyy-mm-dd', 'Là ngày hợp lệ'],
  'Số điện thoại': ['Đúng định dạng 10 số', 'Bắt đầu bằng 0', 'Không chứa ký tự đặc biệt'],
  'Email': ['Đúng định dạng email', 'Chứa ký tự @', 'Có tên miền hợp lệ'],
  'Mã đấu giá viên': ['Đúng định dạng mã', 'Độ dài từ 6-12 ký tự', 'Chỉ chứa chữ và số'],
  'Số thẻ đấu giá viên': ['Đúng định dạng số thẻ', 'Độ dài 10 ký tự', 'Không trùng lặp'],
  'default': ['Không chứa ký tự đặc biệt', 'Không chứa số', 'Chỉ chứa chữ cái']
};

const validationConditions = {
  'CMND/CCCD': ['Không trùng lặp', 'Độ dài từ 9-12 ký tự', 'Không để trống'],
  'Họ và tên': ['Độ dài từ 2-100 ký tự', 'Không chứa số', 'Không để trống'],
  'Ngày sinh': ['Tuổi từ 18-65', 'Không lớn hơn ngày hiện tại', 'Không để trống'],
  'Mã đấu giá viên': ['Không trùng lặp', 'Độ dài từ 6-12 ký tự', 'Không để trống'],
  'Số thẻ đấu giá viên': ['Không trùng lặp', 'Độ dài 10 ký tự', 'Không để trống'],
  'Ngày hết hạn': ['Phải lớn hơn ngày cấp', 'Không quá 5 năm', 'Không để trống'],
  'default': ['Không để trống', 'Không trùng lặp', 'Nằm trong danh sách cho phép']
};

const missingValueActions = [
  'Bỏ qua bản ghi',
  'Điền giá trị mặc định',
  'Điền giá trị trung bình',
  'Điền giá trị phổ biến nhất',
  'Điền giá trị theo quy tắc',
  'Đánh dấu cần kiểm tra',
  'Lấy từ bản ghi liên quan',
];

const outlierActions = [
  'Loại bỏ bản ghi',
  'Thay thế bằng giá trị trung bình',
  'Thay thế bằng giá trị giới hạn',
  'Thay thế bằng giá trị trung vị',
  'Đánh dấu cần kiểm tra thủ công',
  'Bỏ qua và ghi log',
];

const keyMatchingActions = [
  'Từ chối bản ghi không tồn tại',
  'Tạo bản ghi mới trong bảng tham chiếu',
  'Đánh dấu cần kiểm tra',
  'Ghi log và tiếp tục',
  'Dừng xử lý',
];

const duplicateActions = [
  'Giữ bản ghi đầu tiên',
  'Giữ bản ghi mới nhất',
  'Gộp thông tin từ các bản ghi',
  'Đánh dấu tất cả để kiểm tra',
  'Loại bỏ tất cả bản ghi trùng',
  'Ghi log và bỏ qua',
];

const referenceActions = [
  'Từ chối bản ghi vi phạm',
  'Tự động cập nhật tham chiếu',
  'Đánh dấu cần kiểm tra',
  'Tạo tham chiếu mới',
  'Ghi log cảnh báo',
];

const transformFormatActions = [
  'Chuyển chữ hoa',
  'Chuyển chữ thường',
  'Chữ hoa đầu câu',
  'Loại bỏ khoảng trắng thừa',
  'Chuẩn hóa dấu tiếng Việt',
  'Định dạng số điện thoại',
  'Định dạng ngày tháng',
  'Loại bỏ ký tự đặc biệt',
];

const mergeSplitActions = [
  'Gộp từ nhiều cột',
  'Tách thành nhiều cột',
  'Tách theo ký tự phân cách',
  'Gộp với định dạng',
];

const classifyActions = [
  'Phân loại theo giá trị',
  'Gán nhãn tự động',
  'Phân nhóm theo khoảng',
  'Áp dụng quy tắc phân loại',
];

const referenceTableOptions = [
  'Tổ chức hành nghề đấu giá',
  'Danh mục tỉnh/thành phố',
  'Danh mục quận/huyện',
  'Danh mục xã/phường',
  'Danh mục quốc tịch',
  'Danh mục dân tộc',
  'Loại chứng chỉ hành nghề',
];

export function ConfigureRuleModal({ rule, onClose, onSave }: ConfigureRuleModalProps) {
  const [selectedType, setSelectedType] = useState<RuleType>('format');
  const [configs, setConfigs] = useState<RuleConfig[]>([
    {
      id: '1',
      type: 'format',
      field: 'Mã đấu giá viên',
      condition: 'Đúng định dạng mã',
      action: 'Ghi log lỗi',
      enabled: true,
    }
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  const addConfig = () => {
    const newConfig: RuleConfig = {
      id: Date.now().toString(),
      type: selectedType,
      field: fieldOptions[0],
      condition: '',
      action: getDefaultAction(selectedType),
      enabled: true,
    };
    setConfigs([...configs, newConfig]);
  };

  const getDefaultAction = (type: RuleType): string => {
    switch (type) {
      case 'missing-value': return missingValueActions[0];
      case 'outlier': return outlierActions[0];
      case 'key-matching': return keyMatchingActions[0];
      case 'duplicate': return duplicateActions[0];
      case 'reference-constraint': return referenceActions[0];
      case 'transform-format': return transformFormatActions[0];
      case 'merge-split-column': return mergeSplitActions[0];
      case 'classify-label': return classifyActions[0];
      default: return 'Ghi log lỗi';
    }
  };

  const updateConfig = (id: string, updates: Partial<RuleConfig>) => {
    setConfigs(configs.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const removeConfig = (id: string) => {
    setConfigs(configs.filter(c => c.id !== id));
  };

  const handleSave = () => {
    onSave?.(configs);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  const getConditionsForField = (field: string, type: RuleType) => {
    if (type === 'format') {
      return formatConditions[field as keyof typeof formatConditions] || formatConditions.default;
    } else if (type === 'validation') {
      return validationConditions[field as keyof typeof validationConditions] || validationConditions.default;
    }
    return [];
  };

  const getActionOptions = (type: RuleType) => {
    switch (type) {
      case 'missing-value': return missingValueActions;
      case 'outlier': return outlierActions;
      case 'key-matching': return keyMatchingActions;
      case 'duplicate': return duplicateActions;
      case 'reference-constraint': return referenceActions;
      case 'transform-format': return transformFormatActions;
      case 'merge-split-column': return mergeSplitActions;
      case 'classify-label': return classifyActions;
      default: return ['Ghi log lỗi', 'Từ chối bản ghi', 'Đánh dấu cần xem xét', 'Cảnh báo'];
    }
  };

  const filteredConfigs = configs.filter(c => c.type === selectedType);

  const renderConditionField = (config: RuleConfig) => {
    if (selectedType === 'format' || selectedType === 'validation') {
      return (
        <select
          value={config.condition}
          onChange={(e) => updateConfig(config.id, { condition: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled hidden>-- Chọn điều kiện --</option>
          {getConditionsForField(config.field, selectedType).map(cond => (
            <option key={cond} value={cond}>{cond}</option>
          ))}
        </select>
      );
    } else if (selectedType === 'key-matching') {
      return (
        <input
          type="text"
          value={config.keyField || ''}
          onChange={(e) => updateConfig(config.id, { keyField: e.target.value })}
          placeholder="Trường khóa (ID, Mã...)"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      );
    } else if (selectedType === 'duplicate') {
      return (
        <input
          type="text"
          value={config.condition}
          onChange={(e) => updateConfig(config.id, { condition: e.target.value })}
          placeholder="Trường kiểm tra trùng (CMND, Email...)"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      );
    } else if (selectedType === 'merge-split-column') {
      return (
        <input
          type="text"
          value={config.condition}
          onChange={(e) => updateConfig(config.id, { condition: e.target.value })}
          placeholder={config.action?.includes('Gộp') ? 'Cột1, Cột2, Cột3' : 'Ký tự phân cách (,  - | ...)'}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      );
    } else if (selectedType === 'classify-label') {
      return (
        <input
          type="text"
          value={config.condition}
          onChange={(e) => updateConfig(config.id, { condition: e.target.value })}
          placeholder="Điều kiện phân loại (>100: Cao, 50-100: TB...)"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      );
    } else {
      return (
        <input
          type="text"
          value={config.condition}
          onChange={(e) => updateConfig(config.id, { condition: e.target.value })}
          placeholder={selectedType === 'missing-value' ? 'null, empty, N/A' : 'Giá trị > 1000 hoặc < 0'}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      );
    }
  };

  const renderExtraFields = (config: RuleConfig) => {
    // Reference table for key-matching and reference-constraint
    if ((selectedType === 'key-matching' || selectedType === 'reference-constraint') && 
        !config.action?.includes('Từ chối') && !config.action?.includes('Dừng')) {
      return (
        <div>
          <label className="block text-xs text-slate-600 mb-1">Bảng tham chiếu</label>
          <select
            value={config.referenceTable || ''}
            onChange={(e) => updateConfig(config.id, { referenceTable: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled hidden>-- Chọn bảng tham chiếu --</option>
            {referenceTableOptions.map(table => (
              <option key={table} value={table}>{table}</option>
            ))}
          </select>
        </div>
      );
    }

    // Target field for merge-split
    if (selectedType === 'merge-split-column') {
      return (
        <div>
          <label className="block text-xs text-slate-600 mb-1">
            {config.action?.includes('Gộp') ? 'Tên cột đích (sau gộp)' : 'Tên các cột mới'}
          </label>
          <input
            type="text"
            value={config.targetField || ''}
            onChange={(e) => updateConfig(config.id, { targetField: e.target.value })}
            placeholder={config.action?.includes('Gộp') ? 'Họ và tên đầy đủ' : 'Họ, Tên đệm, Tên'}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      );
    }

    // Default value for missing-value
    if (selectedType === 'missing-value' && 
        (config.action === 'Điền giá trị mặc định' || config.action === 'Điền giá trị theo quy tắc')) {
      return (
        <div>
          <label className="block text-xs text-slate-600 mb-1">Giá trị điền vào</label>
          <input
            type="text"
            value={config.value || ''}
            onChange={(e) => updateConfig(config.id, { value: e.target.value })}
            placeholder="Nhập giá trị mặc định"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h3 className="text-slate-900">Cấu hình quy tắc xử lý dữ liệu</h3>
            <p className="text-sm text-slate-600 mt-1">{rule?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-green-800">Đã lưu cấu hình quy tắc thành công!</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Rule Type Selection */}
            <div className="mb-6">
              <h4 className="text-slate-900 mb-3">Chọn loại quy tắc (10 loại)</h4>
              
              {/* Nhóm 1: Làm sạch */}
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Nhóm 1: Làm sạch dữ liệu</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ruleTypeOptions.filter(opt => opt.group === 'clean').map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedType(option.value as RuleType)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        selectedType === option.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{option.icon}</span>
                        <div className="flex-1">
                          <p className={`text-sm mb-0.5 ${
                            selectedType === option.value ? 'text-blue-900' : 'text-slate-900'
                          }`}>
                            {option.label}
                          </p>
                          <p className="text-xs text-slate-600">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nhóm 2: Đối sánh và tham chiếu */}
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Nhóm 2: Đối sánh và tham chiếu</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ruleTypeOptions.filter(opt => opt.group === 'standardize').map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedType(option.value as RuleType)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        selectedType === option.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{option.icon}</span>
                        <div className="flex-1">
                          <p className={`text-sm mb-0.5 ${
                            selectedType === option.value ? 'text-blue-900' : 'text-slate-900'
                          }`}>
                            {option.label}
                          </p>
                          <p className="text-xs text-slate-600">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nhóm 3: Biến đổi */}
              <div>
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Nhóm 3: Biến đổi dữ liệu</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ruleTypeOptions.filter(opt => opt.group === 'transform').map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedType(option.value as RuleType)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        selectedType === option.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{option.icon}</span>
                        <div className="flex-1">
                          <p className={`text-sm mb-0.5 ${
                            selectedType === option.value ? 'text-blue-900' : 'text-slate-900'
                          }`}>
                            {option.label}
                          </p>
                          <p className="text-xs text-slate-600">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Configuration List */}
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-slate-900">
                Danh sách cấu hình {ruleTypeOptions.find(r => r.value === selectedType)?.label} ({filteredConfigs.length})
              </h4>
              <button
                onClick={addConfig}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Thêm cấu hình
              </button>
            </div>

            {filteredConfigs.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-2">Chưa có cấu hình nào</p>
                <p className="text-sm text-slate-500">Nhấn &quot;Thêm cấu hình&quot; để tạo quy tắc mới</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredConfigs.map((config, index) => (
                  <div
                    key={config.id}
                    className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {/* Enable Toggle */}
                      <div className="flex items-center pt-2">
                        <input
                          type="checkbox"
                          checked={config.enabled}
                          onChange={(e) => updateConfig(config.id, { enabled: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                      </div>

                      {/* Config Fields */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Field */}
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">Trường dữ liệu</label>
                          <select
                            value={config.field}
                            onChange={(e) => updateConfig(config.id, { field: e.target.value, condition: '' })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {fieldOptions.map(field => (
                              <option key={field} value={field}>{field}</option>
                            ))}
                          </select>
                        </div>

                        {/* Condition */}
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">
                            {selectedType === 'format' && 'Điều kiện định dạng'}
                            {selectedType === 'validation' && 'Điều kiện hợp lệ'}
                            {selectedType === 'missing-value' && 'Kiểu giá trị thiếu'}
                            {selectedType === 'outlier' && 'Điều kiện ngoại lệ'}
                            {selectedType === 'key-matching' && 'Trường khóa'}
                            {selectedType === 'duplicate' && 'Trường kiểm tra trùng'}
                            {selectedType === 'reference-constraint' && 'Ràng buộc'}
                            {selectedType === 'transform-format' && 'Kiểu biến đổi'}
                            {selectedType === 'merge-split-column' && 'Danh sách cột/Phân cách'}
                            {selectedType === 'classify-label' && 'Điều kiện phân loại'}
                          </label>
                          {renderConditionField(config)}
                        </div>

                        {/* Action */}
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">Hành động</label>
                          <select
                            value={config.action}
                            onChange={(e) => updateConfig(config.id, { action: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {getActionOptions(selectedType).map(action => (
                              <option key={action} value={action}>{action}</option>
                            ))}
                          </select>
                        </div>

                        {/* Extra Fields */}
                        {renderExtraFields(config)}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => removeConfig(config.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Config Number */}
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-500">
                        Quy tắc #{index + 1} - {config.enabled ? '✓ Đang bật' : '○ Đã tắt'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            {filteredConfigs.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900 mb-2">
                      Tổng quan cấu hình - {ruleTypeOptions.find(r => r.value === selectedType)?.label}
                    </p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Tổng số quy tắc tất cả loại: {configs.length}</li>
                      <li>• Quy tắc đang bật: {configs.filter(c => c.enabled).length}</li>
                      <li>• Loại đang xem: {filteredConfigs.length} quy tắc</li>
                      <li>• Hệ thống ghi nhận quy tắc được thiết lập</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            ✅ Hệ thống ghi nhận quy tắc được thiết lập
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={configs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              Lưu cấu hình ({configs.length} quy tắc)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}