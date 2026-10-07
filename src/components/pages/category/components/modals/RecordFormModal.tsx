import { useState, useEffect, ChangeEvent } from 'react';
import { Save, Database } from 'lucide-react';
import { BaseModal } from '../../../../common/BaseModal';
import { BTN_PRIMARY, BTN_OUTLINE, INPUT_CLS, LABEL_CLS, REQUIRED_MARK } from '../../../collection/collectionUi';

const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';

interface RecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  title: string;
  entityName?: string;
  entityCode?: string;
}

export function RecordFormModal({ isOpen, onClose, onSave, initialData, title, entityName = '', entityCode = '' }: RecordFormModalProps) {
  const [formData, setFormData] = useState({ code: '', name: '', description: '' });
  const [errorObj, setErrorObj] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        code: initialData?.code || '',
        name: initialData?.name || '',
        description: initialData?.description || '',
      });
      setErrorObj({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorObj[name]) setErrorObj(prev => ({ ...prev, [name]: '' }));
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.code.trim()) newErrors.code = 'Mã bản ghi không được để trống';
    if (!formData.name.trim()) newErrors.name = 'Tên bản ghi không được để trống';
    if (Object.keys(newErrors).length > 0) { setErrorObj(newErrors); return; }
    onSave({ ...formData, status: 'pending' });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-2xl"
      footer={
        <>
          <button onClick={onClose} className={BTN_OUTLINE}>
            Hủy
          </button>
          <button
            onClick={handleSave}
            className={BTN_PRIMARY}
          >
            <Save className="w-4 h-4" />
            Lưu lại
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {entityName && (
          <div className="flex items-center gap-2 p-3 bg-[#EAF3FF] border border-[#BFDBFE] rounded-lg text-[13px] text-[#020817]">
            <Database className="w-4 h-4 text-[#155DFC] shrink-0" />
            <span className="text-[#475569]">Danh mục:</span>
            <span className="font-medium">{entityName}</span>
            {entityCode && <span className="text-[#64748B]">({entityCode})</span>}
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <label className={LABEL_CLS}>
              Mã bản ghi <span className={REQUIRED_MARK}>*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="VD: MALE, FEMALE..."
              className={`${INPUT_CLS} ${errorObj.code ? '!border-[#DC2626]' : ''}`}
            />
            {errorObj.code && <p className="mt-1 text-[12px] text-[#DC2626]">{errorObj.code}</p>}
          </div>

          <div>
            <label className={LABEL_CLS}>
              Tên giá trị <span className={REQUIRED_MARK}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Nam, Nữ, Khác..."
              className={`${INPUT_CLS} ${errorObj.name ? '!border-[#DC2626]' : ''}`}
            />
            {errorObj.name && <p className="mt-1 text-[12px] text-[#DC2626]">{errorObj.name}</p>}
          </div>

          <div className="col-span-2">
            <label className={LABEL_CLS}>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Mô tả chi tiết về giá trị bản ghi này..."
              className={TEXTAREA_CLS}
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
