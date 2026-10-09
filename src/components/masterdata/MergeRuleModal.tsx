import { useState } from 'react';
import { X, Plus, GitBranch, Save, Trash2, SquarePen, Play } from 'lucide-react';

interface MergeRule {
  id: string;
  name: string;
  sourceField: string;
  strategy: 'latest' | 'priority' | 'longest' | 'manual';
  priority: number;
  weight?: number;
}

interface MergeRuleModalProps {
  onClose: () => void;
  entityName?: string;
}

export function MergeRuleModal({ onClose, entityName = 'Dữ liệu chủ' }: MergeRuleModalProps) {
  const [rules, setRules] = useState<MergeRule[]>([
    { id: '1', name: 'Hợp nhất CCCD', sourceField: 'CCCD', strategy: 'priority', priority: 1, weight: 100 },
    { id: '2', name: 'Hợp nhất Họ tên', sourceField: 'Họ tên', strategy: 'latest', priority: 2, weight: 80 },
    { id: '3', name: 'Hợp nhất Địa chỉ', sourceField: 'Địa chỉ', strategy: 'longest', priority: 3, weight: 60 },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sourceField: '',
    strategy: 'priority' as const,
    priority: '',
    weight: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRule: MergeRule = {
      id: String(rules.length + 1),
      ...formData,
      priority: parseInt(formData.priority),
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
    };
    
    setRules([...rules, newRule]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sourceField: '',
      strategy: 'priority',
      priority: '',
      weight: '',
    });
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa quy tắc này?')) {
      setRules(rules.filter(rule => rule.id !== id));
    }
  };

  const handleTest = () => {
    alert('Chức năng kiểm thử quy tắc hợp nhất đang được phát triển...');
  };

  const strategyLabels = {
    latest: 'Mới nhất (Latest)',
    priority: 'Độ ưu tiên (Priority)',
    longest: 'Dài nhất (Longest)',
    manual: 'Thủ công (Manual)',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Thiết lập quy tắc hợp nhất dữ liệu chủ</h2>
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
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-purple-900 mb-2">Về quy tắc hợp nhất</h3>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• <strong>Mới nhất:</strong> Sử dụng giá trị từ nguồn có timestamp mới nhất</li>
              <li>• <strong>Độ ưu tiên:</strong> Ưu tiên nguồn dữ liệu có độ tin cậy cao hơn</li>
              <li>• <strong>Dài nhất:</strong> Chọn giá trị có độ dài lớn nhất (áp dụng cho text)</li>
              <li>• <strong>Thủ công:</strong> Yêu cầu xác nhận từ người dùng</li>
            </ul>
          </div>

          {/* Add Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-purple-400 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Thêm quy tắc hợp nhất mới
            </button>
          )}

          {/* Add Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-4">
              <h3 className="text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                Thêm quy tắc mới
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Tên quy tắc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="VD: Hợp nhất CCCD"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Trường dữ liệu <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.sourceField}
                    onChange={(e) => setFormData({ ...formData, sourceField: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="" disabled hidden>-- Chọn trường --</option>
                    <option value="CCCD">CCCD</option>
                    <option value="Họ tên">Họ tên</option>
                    <option value="Ngày sinh">Ngày sinh</option>
                    <option value="Địa chỉ">Địa chỉ</option>
                    <option value="Email">Email</option>
                    <option value="Số điện thoại">Số điện thoại</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Chiến lược hợp nhất <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.strategy}
                    onChange={(e) => setFormData({ ...formData, strategy: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="latest">Mới nhất (Latest)</option>
                    <option value="priority">Độ ưu tiên (Priority)</option>
                    <option value="longest">Dài nhất (Longest)</option>
                    <option value="manual">Thủ công (Manual)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Độ ưu tiên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="1 = cao nhất"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Trọng số (%)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0-100"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Thêm quy tắc
                </button>
              </div>
            </form>
          )}

          {/* Rules Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">STT</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">TÊN QUY TẮC</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">TRƯỜNG DỮ LIỆU</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">CHIẾN LƯỢC</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">ĐỘ ƯU TIÊN</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600">TRỌNG SỐ</th>
                  <th className="px-4 py-3 text-right text-xs text-slate-600">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rules.map((rule, index) => (
                  <tr key={rule.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-slate-900 font-medium">{rule.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{rule.sourceField}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                        {strategyLabels[rule.strategy]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{rule.priority}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{rule.weight ? `${rule.weight}%` : '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Sửa"
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rule.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rules.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      Chưa có quy tắc hợp nhất nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex justify-between bg-slate-50">
          <button
            onClick={handleTest}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Kiểm thử quy tắc
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
