import { useState, useEffect, ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, Database, Send } from 'lucide-react';
import { Portal } from '../../../../common/Portal';
import { ApprovalRequestModal } from './ApprovalRequestModal';

const APPROVERS = [
  { id: '1', name: 'Nguyễn Văn A', position: 'Trưởng phòng Quản lý dữ liệu', department: 'Cục CNTT' },
  { id: '2', name: 'Trần Thị B', position: 'Phó Cục trưởng', department: 'Cục CNTT' },
  { id: '3', name: 'Lê Thị E', position: 'Trưởng phòng Pháp chế', department: 'Vụ Pháp luật' },
  { id: '4', name: 'Phạm Văn F', position: 'Cục trưởng', department: 'Cục CNTT' },
];

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
  const [showApproval, setShowApproval] = useState(false);
  const [approvalForm, setApprovalForm] = useState({ reviewer: '', note: '' });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        code: initialData?.code || '',
        name: initialData?.name || '',
        description: initialData?.description || '',
      });
      setErrorObj({});
      setShowApproval(false);
      setApprovalForm({ reviewer: '', note: '' });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorObj[name]) setErrorObj(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmitClick = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.code.trim()) newErrors.code = 'Mã bản ghi không được để trống';
    if (!formData.name.trim()) newErrors.name = 'Tên bản ghi không được để trống';
    if (Object.keys(newErrors).length > 0) { setErrorObj(newErrors); return; }
    setShowApproval(true);
  };

  const handleApprovalSubmit = () => {
    onSave({ ...formData, status: 'pending' });
    setShowApproval(false);
    setApprovalForm({ reviewer: '', note: '' });
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4"
        style={{ zIndex: 99999 }}
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-[15px] font-bold text-slate-800">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-2 rounded-xl transition-colors" title="Đóng">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Entity context */}
            {entityName && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-[13px]">
                <Database className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-slate-600">Danh mục:</span>
                <span className="font-semibold text-slate-800">{entityName}</span>
                {entityCode && <span className="text-slate-400 font-mono text-[12px]">({entityCode})</span>}
              </div>
            )}

            <div className="grid grid-cols-2 gap-5">
              {/* Mã */}
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

              {/* Tên */}
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

              {/* Mô tả */}
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

            {/* Info note */}
            <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-[13px] text-amber-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Bản ghi sau khi gửi sẽ chuyển sang trạng thái <b>Chờ phê duyệt</b> và cần được xác nhận trước khi có hiệu lực.</span>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-[13px] text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmitClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-[13px] rounded-xl hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Gửi duyệt
            </button>
          </div>
        </div>
      </div>

      {createPortal(
        <ApprovalRequestModal
          isOpen={showApproval}
          onClose={() => setShowApproval(false)}
          data={{ id: '', code: formData.code, name: formData.name, type: 'category' }}
          approvers={APPROVERS}
          form={approvalForm}
          setForm={setApprovalForm}
          onSubmit={handleApprovalSubmit}
        />,
        document.body
      )}
    </Portal>
  );
}
