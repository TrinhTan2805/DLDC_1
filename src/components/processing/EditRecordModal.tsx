import { X, AlertTriangle, Save, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface ErrorRecord {
  id: string;
  recordId: string;
  field: string;
  originalValue: string;
  errorType: string;
  errorLevel: 'critical' | 'warning' | 'validation';
  description: string;
  suggestion: string;
  status: 'pending' | 'fixed' | 'ignored';
}

interface EditRecordModalProps {
  record: ErrorRecord;
  onClose: () => void;
  onSave: (id: string, newValue: string) => void;
}

export function EditRecordModal({ record, onClose, onSave }: EditRecordModalProps) {
  const [editedValue, setEditedValue] = useState(record.originalValue);
  const [usesSuggestion, setUsesSuggestion] = useState(false);

  const handleApplySuggestion = () => {
    if (record.suggestion) {
      setEditedValue(record.suggestion);
      setUsesSuggestion(true);
    }
  };

  const handleReset = () => {
    setEditedValue(record.originalValue);
    setUsesSuggestion(false);
  };

  const handleSave = () => {
    onSave(record.id, editedValue);
    onClose();
  };

  const errorLevelConfig = {
    critical: { 
      label: 'Nghiêm trọng', 
      color: 'text-red-700', 
      bg: 'bg-red-50', 
      border: 'border-red-200',
      iconBg: 'bg-red-100'
    },
    warning: { 
      label: 'Cảnh báo', 
      color: 'text-orange-700', 
      bg: 'bg-orange-50', 
      border: 'border-orange-200',
      iconBg: 'bg-orange-100'
    },
    validation: { 
      label: 'Xác thực', 
      color: 'text-yellow-700', 
      bg: 'bg-yellow-50', 
      border: 'border-yellow-200',
      iconBg: 'bg-yellow-100'
    }
  };

  const config = errorLevelConfig[record.errorLevel];

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h3 className="text-slate-900">Sửa Lỗi Thủ Công</h3>
            <p className="text-sm text-slate-600 mt-1">Mã bản ghi: {record.recordId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Error Information */}
            <div className={`border ${config.border} rounded-lg p-4 ${config.bg}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 ${config.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <AlertTriangle className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm ${config.color}`}>{config.label}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${config.bg} ${config.color} border ${config.border}`}>
                      {record.errorType}
                    </span>
                  </div>
                  <p className={`text-sm ${config.color}`}>{record.description}</p>
                </div>
              </div>
            </div>

            {/* Field Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-700 mb-2">Trường dữ liệu</label>
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900">
                  {record.field}
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-700 mb-2">Loại lỗi</label>
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900">
                  {record.errorType}
                </div>
              </div>
            </div>

            {/* Original Value */}
            <div>
              <label className="block text-xs text-slate-700 mb-2">Giá trị gốc (có lỗi)</label>
              <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-sm text-red-600 line-through">{record.originalValue}</span>
              </div>
            </div>

            {/* Suggestion */}
            {record.suggestion && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs text-slate-700">Đề xuất sửa lỗi tự động</label>
                  <button
                    onClick={handleApplySuggestion}
                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Áp dụng đề xuất
                  </button>
                </div>
                <div className="px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                  {record.suggestion}
                </div>
              </div>
            )}

            {/* Edited Value */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs text-slate-700">
                  Giá trị mới <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-700 hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  Khôi phục gốc
                </button>
              </div>
              <input
                type="text"
                value={editedValue}
                onChange={(e) => {
                  setEditedValue(e.target.value);
                  setUsesSuggestion(false);
                }}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nhập giá trị mới..."
              />
              {usesSuggestion && (
                <p className="text-xs text-blue-600 mt-1">✓ Đang sử dụng giá trị đề xuất</p>
              )}
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs text-slate-700 mb-2">Ghi chú (tùy chọn)</label>
              <textarea
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Thêm ghi chú về việc sửa lỗi..."
              />
            </div>

            {/* Comparison */}
            {editedValue !== record.originalValue && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="text-xs text-slate-700 mb-3">So sánh thay đổi:</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-600 mb-1">Trước:</div>
                    <div className="px-2 py-1.5 bg-red-50 border border-red-200 rounded text-sm text-red-700 line-through">
                      {record.originalValue}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 mb-1">Sau:</div>
                    <div className="px-2 py-1.5 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                      {editedValue}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-600">
            {editedValue === record.originalValue ? (
              'Chưa có thay đổi'
            ) : (
              <span className="text-green-600">✓ Đã chỉnh sửa giá trị</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={editedValue === record.originalValue || !editedValue.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
