import React, { useState, useEffect } from 'react';
import { BaseModal } from '../common/BaseModal';
import { Save, X } from 'lucide-react';

interface EditDataCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: any;
}

export function EditDataCollectionModal({ isOpen, onClose, onSave, initialData }: EditDataCollectionModalProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData(initialData);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const footer = (
    <div className="flex items-center justify-end gap-3 w-full">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-base flex items-center gap-2"
      >
        <X className="w-4 h-4" />
        Hủy bỏ
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-base flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        Cập nhật
      </button>
    </div>
  );

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa Cấu hình Thu thập"
      subtitle={`Đang chỉnh sửa dữ liệu: ${initialData?.dataName || ''}`}
      maxWidth="max-w-4xl"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
          <div>
            <label className="block text-base font-medium text-slate-700 mb-2">
              Cơ quan nguồn / Cục Vụ <span className="text-red-500">*</span>
            </label>
            <input aria-label="Input field"
              type="text"
              required
              title="Cơ quan nguồn / Cục Vụ"
              placeholder="Cơ quan nguồn / Cục Vụ"
              value={formData?.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-700 mb-2">
              Tên Dữ liệu <span className="text-red-500">*</span>
            </label>
            <input aria-label="Input field"
              type="text"
              required
              title="Tên Dữ liệu"
              placeholder="Tên Dữ liệu"
              value={formData?.dataName || ''}
              onChange={(e) => setFormData({ ...formData, dataName: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100 mt-4">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">
                Tần suất thu thập <span className="text-red-500">*</span>
              </label>
              <select
                required
                title="Tần suất thu thập"
                aria-label="Tần suất thu thập"
                value={formData?.frequency || 'Hằng ngày'}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="Hằng ngày">Hằng ngày</option>
                <option value="Hằng tuần">Hằng tuần</option>
                <option value="Hằng tháng">Hằng tháng</option>
              </select>
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">
                Định dạng trả về <span className="text-red-500">*</span>
              </label>
              <select
                required
                title="Định dạng trả về"
                aria-label="Định dạng trả về"
                value={formData?.format || 'JSON'}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="JSON">JSON (API)</option>
                <option value="XML">XML (SOAP)</option>
                <option value="Excel">Tệp Excel/CSV</option>
              </select>
            </div>
        </div>
      </form>
    </BaseModal>
    </div>
  );
}
