import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Unit } from './ConnectionManagementPage';
import { BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS, LABEL_CLS, REQUIRED_MARK } from './collectionUi';

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
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="source-system-modal-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
          <h2 id="source-system-modal-title" className="text-[16px] font-semibold text-[#020817]">
            {editingData ? 'Sửa thông tin hệ thống nguồn' : 'Thêm mới hệ thống nguồn'}
          </h2>
          <button type="button" onClick={onClose} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
          <form id="source-system-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="col-span-2 sm:col-span-1">
                <label className={LABEL_CLS}>
                  Tên hệ thống <span className={REQUIRED_MARK}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.systemName}
                  onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                  className={INPUT_CLS}
                  placeholder="Nhập tên hệ thống"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={LABEL_CLS}>
                  Tên đơn vị <span className={REQUIRED_MARK}>*</span>
                </label>
                <select
                  required
                  aria-label="Tên đơn vị"
                  value={formData.unitName}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  className={INPUT_CLS}
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
                <label className={LABEL_CLS}>
                  Loại nguồn <span className={REQUIRED_MARK}>*</span>
                </label>
                <select
                  required
                  aria-label="Loại nguồn"
                  value={formData.sourceType}
                  onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                  className={INPUT_CLS}
                >
                  <option value="">Chọn loại nguồn</option>
                  <option value="Trong ngành">Trong ngành</option>
                  <option value="Ngoài ngành">Ngoài ngành</option>
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={LABEL_CLS}>
                  Đầu mối liên hệ
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className={INPUT_CLS}
                  placeholder="Tên người đầu mối"
                />
              </div>

              <div className="col-span-2">
                <label className={LABEL_CLS}>
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={INPUT_CLS}
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={LABEL_CLS}>
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={INPUT_CLS}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={LABEL_CLS}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={INPUT_CLS}
                  placeholder="Nhập email"
                />
              </div>

              <div className="col-span-2">
                <label className={LABEL_CLS}>
                  Ghi chú
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows={3}
                  className={`${INPUT_CLS} h-auto py-2 resize-y`}
                  placeholder="Nhập ghi chú"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>
            Hủy
          </button>
          <button type="submit" form="source-system-form" className={BTN_PRIMARY}>
            <Save className="w-4 h-4" />
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
