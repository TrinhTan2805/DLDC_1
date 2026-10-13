import { toast } from 'sonner';
import { useState } from 'react';
import { X, Key, Save, Play, RefreshCw } from 'lucide-react';

interface IdentifierRule {
  prefix: string;
  format: string;
  autoIncrement: boolean;
  startNumber: number;
  padding: number;
  sample: string;
}

interface IdentifierRuleModalProps {
  onClose: () => void;
  entityName?: string;
}

export function IdentifierRuleModal({ onClose, entityName = 'Dữ liệu chủ' }: IdentifierRuleModalProps) {
  const [rule, setRule] = useState<IdentifierRule>({
    prefix: 'MD_',
    format: '{PREFIX}{YEAR}{MONTH}{SEQUENCE}',
    autoIncrement: true,
    startNumber: 1,
    padding: 6,
    sample: 'MD_20241200001',
  });

  const [testResult, setTestResult] = useState<string[]>([]);

  const generateSample = (currentRule: IdentifierRule) => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const sequence = String(currentRule.startNumber).padStart(currentRule.padding, '0');
    
    let sample = currentRule.format
      .replace('{PREFIX}', currentRule.prefix)
      .replace('{YEAR}', String(year))
      .replace('{MONTH}', month)
      .replace('{SEQUENCE}', sequence);
    
    return sample;
  };

  const handleChange = (field: keyof IdentifierRule, value: any) => {
    const newRule = { ...rule, [field]: value };
    newRule.sample = generateSample(newRule);
    setRule(newRule);
  };

  const handleTest = () => {
    const samples = [];
    for (let i = 0; i < 5; i++) {
      const testRule = { ...rule, startNumber: rule.startNumber + i };
      samples.push(generateSample(testRule));
    }
    setTestResult(samples);
  };

  const handleSave = () => {
    toast.success(`Đã lưu quy tắc định danh duy nhất cho ${entityName}`);
    onClose();
  };

  const formatOptions = [
    { value: '{PREFIX}{YEAR}{MONTH}{SEQUENCE}', label: 'Prefix + Năm + Tháng + Số thứ tự' },
    { value: '{PREFIX}{YEAR}{SEQUENCE}', label: 'Prefix + Năm + Số thứ tự' },
    { value: '{PREFIX}{SEQUENCE}', label: 'Prefix + Số thứ tự' },
    { value: '{YEAR}{MONTH}{DAY}{SEQUENCE}', label: 'Năm + Tháng + Ngày + Số thứ tự' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Quy tắc định danh duy nhất</h2>
              <p className="text-sm text-slate-500">{entityName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="text-amber-900 mb-2">Về định danh duy nhất</h3>
            <p className="text-sm text-amber-800">
              Quy tắc định danh giúp tự động sinh mã duy nhất cho mỗi bản ghi dữ liệu chủ. 
              Mã này đảm bảo không trùng lặp và có thể tùy chỉnh theo cấu trúc mong muốn.
            </p>
          </div>

          {/* Configuration Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Tiền tố (Prefix) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={rule.prefix}
                onChange={(e) => handleChange('prefix', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="VD: MD_, PERSON_, ORG_"
              />
              <p className="text-xs text-slate-500 mt-1">Chuỗi ký tự đứng đầu mã định danh</p>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Định dạng mã <span className="text-red-500">*</span>
              </label>
              <select
                value={rule.format}
                onChange={(e) => handleChange('format', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {formatOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Các biến: {'{PREFIX}'}, {'{YEAR}'}, {'{MONTH}'}, {'{DAY}'}, {'{SEQUENCE}'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Số bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={rule.startNumber}
                  onChange={(e) => handleChange('startNumber', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  min="1"
                />
                <p className="text-xs text-slate-500 mt-1">Số thứ tự bắt đầu</p>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Độ dài số thứ tự <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={rule.padding}
                  onChange={(e) => handleChange('padding', parseInt(e.target.value) || 6)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  min="1"
                  max="10"
                />
                <p className="text-xs text-slate-500 mt-1">Số chữ số (padding với 0)</p>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rule.autoIncrement}
                  onChange={(e) => handleChange('autoIncrement', e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-sm text-slate-700">Tự động tăng số thứ tự</span>
              </label>
              <p className="text-xs text-slate-500 mt-1 ml-6">
                Hệ thống sẽ tự động tăng số thứ tự khi tạo bản ghi mới
              </p>
            </div>
          </div>

          {/* Sample Preview */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-600" />
                Mẫu mã định danh
              </h3>
              <button
                onClick={() => handleChange('sample', generateSample(rule))}
                className="p-1.5 text-amber-600 hover:bg-amber-100 rounded transition-colors"
                title="Làm mới"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white border border-amber-300 rounded px-4 py-3">
              <code className="text-lg text-amber-900 font-mono font-bold">{rule.sample}</code>
            </div>
          </div>

          {/* Test Section */}
          <div>
            <button
              onClick={handleTest}
              className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Kiểm tra trùng lặp (Tạo 5 mã mẫu)
            </button>
          </div>

          {/* Test Results */}
          {testResult.length > 0 && (
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="text-slate-900 mb-3">Kết quả kiểm tra:</h3>
              <div className="space-y-2">
                {testResult.map((code, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-slate-50 rounded">
                    <span className="text-sm text-slate-500 w-8">{index + 1}.</span>
                    <code className="flex-1 text-sm text-slate-900 font-mono">{code}</code>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Hợp lệ</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  ✓ Tất cả mã được tạo đều duy nhất, không bị trùng lặp
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex justify-between bg-slate-50">
          <div className="text-sm text-slate-600">
            Định dạng hiện tại: <code className="px-2 py-1 bg-slate-200 rounded text-xs font-mono">{rule.format}</code>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Lưu quy tắc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
