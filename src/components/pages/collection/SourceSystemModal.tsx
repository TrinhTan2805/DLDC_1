import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Unit } from './ConnectionManagementPage';

interface SourceSystem {
  id: string;
  systemName: string;
  unitName: string;
  sourceType: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  note: string;
}

interface SourceSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<SourceSystem, 'id'>) => void;
  editingData?: SourceSystem | null;
  units: Unit[];
}

export function SourceSystemModal({ isOpen, onClose, onSave, editingData, units }: SourceSystemModalProps) {
  const [formData, setFormData] = useState<Omit<SourceSystem, 'id'>>({
    systemName: '',
    unitName: '',
    sourceType: '',
    address: '',
    phone: '',
    email: '',
    contactPerson: '',
    note: ''
  });

  useEffect(() => {
    if (editingData) {
      setFormData(editingData);
    } else {
      setFormData({
        systemName: '',
        unitName: '',
        sourceType: '',
        address: '',
        phone: '',
        email: '',
        contactPerson: '',
        note: ''
      });
    }
  }, [editingData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-lg">
          <h2 className="text-lg font-semibold text-slate-800">
            {editingData ? 'Sửa thông tin hệ thống nguồn' : 'Thêm mới hệ thống nguồn'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto">
          <form id="source-system-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[13px] font-medium text-slate-700 mb-1">
                  Tên hệ thống <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.systemName}
                  onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên hệ thống"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[13px] font-medium text-slate-700 mb-1">
                  Tên đơn vị <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.unitName}
                  onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[13px]"
                >
                  <option value="">Chọn đơn vị</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.unitName}>
                      {unit.unitName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[13px] font-medium text-slate-700 mb-1">
                  Đầu mối liên hệ
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tên người đầu mối"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[13px] font-medium text-slate-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[13px] font-medium text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[13px] font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập email"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[13px] font-medium text-slate-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập ghi chú"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-[#020817] bg-white border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="source-system-form"
            className="px-4 py-2 text-[13px] font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            Lưu
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
