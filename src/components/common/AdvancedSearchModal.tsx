import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { DateInput } from '../pages/collection/collectionUi';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: any) => void;
  fields: { label: string; name: string; type: 'text' | 'select' | 'date'; options?: string[] }[];
}

export function AdvancedSearchModal({ isOpen, onClose, onSearch, fields }: AdvancedSearchModalProps) {
  // Giá trị các ô ngày (ISO) theo name; xoá khi đóng modal giống form cũ bị huỷ khi ẩn
  const [dateValues, setDateValues] = useState<Record<string, string>>({});
  useEffect(() => { if (!isOpen) setDateValues({}); }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const filters: any = {};
    formData.forEach((value, key) => {
      if (value) filters[key] = value;
    });
    onSearch(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-slate-900">Tìm kiếm nâng cao</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm text-slate-700 mb-2">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'date' ? (
                  <>
                    <DateInput
                      ariaLabel={field.label}
                      value={dateValues[field.name] || ''}
                      onChange={(v) => setDateValues((prev) => ({ ...prev, [field.name]: v }))}
                    />
                    {/* Giữ giá trị ISO trong FormData theo name như ô ngày cũ */}
                    <input type="hidden" name={field.name} value={dateValues[field.name] || ''} />
                  </>
                ) : (
                  <input
                    type="text"
                    name={field.name}
                    placeholder={`Nhập ${field.label.toLowerCase()}`}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
