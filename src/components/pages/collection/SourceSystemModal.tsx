import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

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
}

export function SourceSystemModal({ isOpen, onClose, onSave, editingData }: SourceSystemModalProps) {
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

  const [mojUnits, setMojUnits] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('moj_units');
    if (saved) {
      try {
        setMojUnits(JSON.parse(saved));
      } catch (e) {
        // Fallback
      }
    } else {
      const initialUnits = [
        { id: '1', code: 'BTP', name: 'Bộ Tư pháp', type: 'internal' },
        { id: '2', code: 'CNTT', name: 'Cục Công nghệ thông tin', type: 'internal' },
        { id: '3', code: 'HCTP', name: 'Cục Hành chính tư pháp', type: 'internal' },
        { id: '4', code: 'THADS', name: 'Cục Quản lý thi hành án dân sự', type: 'internal' },
        { id: '5', code: 'GDPL', name: 'Cục Phổ biến, giáo dục pháp luật', type: 'internal' },
        { id: '6', code: 'BTTP', name: 'Cục Bổ trợ tư pháp', type: 'internal' },
      ];
      setMojUnits(initialUnits);
    }
  }, [isOpen]);

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

  const hasEditingUnit = editingData && mojUnits.some(u => u.name === editingData.unitName);
  const dropdownOptions = [...mojUnits];
  if (editingData && editingData.unitName && !hasEditingUnit) {
    dropdownOptions.push({
      id: 'editing-temp',
      code: 'TEMP',
      name: editingData.unitName,
      type: editingData.sourceType === 'Ngoài ngành' ? 'external' : 'internal'
    });
  }

  const handleUnitChange = (unitName: string) => {
    const selectedUnit = dropdownOptions.find(u => u.name === unitName);
    const sourceType = (selectedUnit?.type === 'external') ? 'Ngoài ngành' : 'Trong ngành';
    setFormData(prev => ({
      ...prev,
      unitName,
      sourceType
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-lg">
          <h2 className="text-xl font-semibold text-slate-800">
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
                <label className="block text-base font-medium text-slate-700 mb-1">
                  Tên hệ thống <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.systemName}
                  onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên hệ thống"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-base font-medium text-slate-700 mb-1">
                  Tên đơn vị <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.unitName}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-base"
                >
                  <option value="">Chọn đơn vị</option>
                  {dropdownOptions.map(unit => (
                    <option key={unit.id} value={unit.name}>
                      {unit.name} ({unit.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-base font-medium text-slate-700 mb-1">
                  Đầu mối liên hệ
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tên người đầu mối"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-base font-medium text-slate-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-base font-medium text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-base font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập email"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-base font-medium text-slate-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="px-4 py-2 text-base font-medium text-[#020817] bg-white border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="source-system-form"
            className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
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
