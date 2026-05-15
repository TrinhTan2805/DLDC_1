import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface Rule {
  id: number;
  name: string;
  type: 'cleaning' | 'normalization' | 'transformation';
  typeLabel: string;
  category: 'internal' | 'external';
  isApplied: boolean;
}

interface AddConfigModalProps {
  onClose: () => void;
  onSave: (config: any) => void;
}

export function AddConfigModal({ onClose, onSave }: AddConfigModalProps) {
  const [rules, setRules] = useState<Rule[]>([
    // Quy tắc trong ngành (10 quy tắc)
    { id: 1, name: 'Chuẩn hóa ngày tháng', type: 'normalization', typeLabel: 'Làm sạch', category: 'internal', isApplied: false },
    { id: 2, name: 'Kiểm tra trùng lặp', type: 'cleaning', typeLabel: 'Chuẩn hóa', category: 'internal', isApplied: false },
    { id: 3, name: 'Loại bỏ ký tự đặc biệt', type: 'cleaning', typeLabel: 'Làm sạch', category: 'internal', isApplied: false },
    { id: 4, name: 'Kiểm tra CCCD', type: 'normalization', typeLabel: 'Chuẩn hóa', category: 'internal', isApplied: false },
    { id: 5, name: 'Chuẩn hóa địa chỉ', type: 'normalization', typeLabel: 'Chuẩn hóa', category: 'internal', isApplied: false },
    { id: 6, name: 'Kiểm tra email', type: 'normalization', typeLabel: 'Chuẩn hóa', category: 'internal', isApplied: false },
    { id: 7, name: 'Kiểm tra số điện thoại', type: 'normalization', typeLabel: 'Chuẩn hóa', category: 'internal', isApplied: false },
    { id: 8, name: 'Loại bỏ khoảng trắng thừa', type: 'cleaning', typeLabel: 'Làm sạch', category: 'internal', isApplied: false },
    { id: 9, name: 'Chuyển đổi định dạng', type: 'transformation', typeLabel: 'Biến đổi', category: 'internal', isApplied: false },
    { id: 10, name: 'Gộp cột thông tin', type: 'transformation', typeLabel: 'Biến đổi', category: 'internal', isApplied: false },

    // Quy tắc ngoài ngành (3 quy tắc)
    { id: 11, name: 'Kiểm tra MST', type: 'normalization', typeLabel: 'Chuẩn hóa / Ngoài ngành', category: 'external', isApplied: false },
    { id: 12, name: 'Kiểm tra mã số thuế doanh nghiệp', type: 'normalization', typeLabel: 'Chuẩn hóa / Ngoài ngành', category: 'external', isApplied: false },
    { id: 13, name: 'Đối chiếu số liệu BCA', type: 'transformation', typeLabel: 'Biến đổi / Ngoài ngành', category: 'external', isApplied: false },
  ]);

  const [selectedDataSource, setSelectedDataSource] = useState('Văn bản quy phạm pháp luật');

  const toggleRule = (ruleId: number) => {
    setRules(rules.map(rule =>
      rule.id === ruleId
        ? { ...rule, isApplied: !rule.isApplied }
        : rule
    ));
  };

  const internalRules = rules.filter(r => r.category === 'internal');
  const externalRules = rules.filter(r => r.category === 'external');
  const appliedCount = rules.filter(r => r.isApplied).length;

  const handleSave = () => {
    const newConfig = {
      dataSource: selectedDataSource,
      rules: rules.filter(r => r.isApplied)
    };
    onSave(newConfig);
    onClose();
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <h3 className="text-slate-500">Quản lý Quy tắc Xử lý</h3>
            <p className="text-xs text-slate-600 mt-1">Thông tư ngành Tư pháp</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-5">
            {/* Internal Rules Section */}
            <div>
              <div className="mb-3">
                <h4 className="text-sm text-slate-700">Quy tắc trong ngành ({internalRules.length} quy tắc HĐ)</h4>
              </div>

              <div className="space-y-2">
                {internalRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between py-3 px-4 bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm text-slate-900">{rule.name}</div>
                        <div className="text-xs text-blue-600 mt-0.5">{rule.typeLabel}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors flex-shrink-0 ${rule.isApplied
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      {rule.isApplied ? (
                        'Đang áp dụng'
                      ) : (
                        'Áp dụng'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* External Rules Section */}
            <div>
              <div className="mb-3">
                <h4 className="text-sm text-slate-700">Quy tắc ngoài ngành ({externalRules.length} quy tắc)</h4>
              </div>

              <div className="space-y-2">
                {externalRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between py-3 px-4 bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm text-slate-900">{rule.name}</div>
                        <div className="text-xs text-blue-600 mt-0.5">{rule.typeLabel}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors flex-shrink-0 ${rule.isApplied
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      {rule.isApplied ? (
                        'Đang áp dụng'
                      ) : (
                        'Áp dụng'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-200 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors text-sm"
          >
            Đóng
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

const typeColors = {
  cleaning: { dot: 'bg-blue-600' },
  normalization: { dot: 'bg-green-600' },
  transformation: { dot: 'bg-purple-600' }
};