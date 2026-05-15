import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface ProcessingConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  data?: any;
  mode: 'add' | 'edit';
}

export function ProcessingConfigModal({ 
  isOpen, 
  onClose, 
  onSave, 
  data,
  mode 
}: ProcessingConfigModalProps) {
  const title = mode === 'add' ? 'Thêm cấu hình xử lý' : 'Sửa cấu hình xử lý';

  const [name, setName] = useState('');
  const [type, setType] = useState<'cleaning' | 'normalization' | 'transformation'>('cleaning');
  const [dataScope, setDataScope] = useState<'internal' | 'external'>('internal');
  const [priority, setPriority] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState<string[]>(['']);

  useEffect(() => {
    if (data && isOpen) {
      setName(data.name || '');
      setType(data.type || 'cleaning');
      setDataScope(data.dataScope || 'internal');
      setPriority(data.priority || 1);
      setIsActive(data.isActive ?? true);
      setDescription(data.description || '');
      setRules(data.rules || ['']);
    } else if (!isOpen) {
      resetForm();
    }
  }, [data, isOpen]);

  const resetForm = () => {
    setName('');
    setType('cleaning');
    setDataScope('internal');
    setPriority(1);
    setIsActive(true);
    setDescription('');
    setRules(['']);
  };

  const addRule = () => {
    setRules([...rules, '']);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, value: string) => {
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      name,
      type,
      dataScope,
      priority,
      isActive,
      description,
      rules: rules.filter(r => r.trim() !== '')
    };
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-4">
            {/* Tên cấu hình */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Tên cấu hình <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ví dụ: Kiểm tra tính hợp lệ của mã định danh"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết về cấu hình này..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Loại xử lý */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Loại xử lý <span className="text-red-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="cleaning">Làm sạch</option>
                  <option value="normalization">Chuẩn hóa</option>
                  <option value="transformation">Biến đổi</option>
                </select>
              </div>

              {/* Phạm vi dữ liệu */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Phạm vi dữ liệu <span className="text-red-500">*</span>
                </label>
                <select
                  value={dataScope}
                  onChange={(e) => setDataScope(e.target.value as any)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="internal">Trong ngành</option>
                  <option value="external">Ngoài ngành</option>
                </select>
              </div>
            </div>

            {/* Thứ tự ưu tiên */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Thứ tự ưu tiên <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value))}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">Số thứ tự càng nhỏ, độ ưu tiên càng cao</p>
            </div>

            {/* Quy tắc */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-slate-700">Quy tắc chi tiết</label>
                <button
                  type="button"
                  onClick={addRule}
                  className="text-xs text-purple-600 hover:text-purple-700"
                >
                  + Thêm quy tắc
                </button>
              </div>
              <div className="space-y-2">
                {rules.map((rule, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => updateRule(index, e.target.value)}
                      placeholder={`Quy tắc ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                    {rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRule(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Kích hoạt */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 text-purple-600 border-slate-300 rounded focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm text-slate-700">Kích hoạt cấu hình</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Lưu
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
