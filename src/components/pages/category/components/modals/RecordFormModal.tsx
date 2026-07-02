import { useState, useEffect, ChangeEvent } from 'react';
import { Save, Database } from 'lucide-react';
import { BaseModal } from '../../../../common/BaseModal';

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
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[13px] text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-[13px] rounded-xl hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Lưu lại
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {entityName && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-[13px]">
            <Database className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-slate-600">Danh mục:</span>
            <span className="font-semibold text-slate-800">{entityName}</span>
            {entityCode && <span className="text-slate-400 font-mono text-[12px]">({entityCode})</span>}
          </div>
        )}

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-slate-700">
              Mã bản ghi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="VD: MALE, FEMALE..."
              className={`w-full px-3 py-2.5 border rounded-xl text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white ${errorObj.code ? 'border-red-300' : 'border-slate-200'}`}
            />
            {errorObj.code && <p className="text-[12px] text-red-600">{errorObj.code}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-slate-700">
              Tên giá trị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Nam, Nữ, Khác..."
              className={`w-full px-3 py-2.5 border rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white ${errorObj.name ? 'border-red-300' : 'border-slate-200'}`}
            />
            {errorObj.name && <p className="text-[12px] text-red-600">{errorObj.name}</p>}
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="block text-[13px] font-semibold text-slate-700">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Mô tả chi tiết về giá trị bản ghi này..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white resize-none"
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
