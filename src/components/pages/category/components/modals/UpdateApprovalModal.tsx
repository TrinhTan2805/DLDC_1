import { ChangeEvent, useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { BaseModal } from '../../../../common/BaseModal';

interface UpdateApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  approvers: { id: string; name: string; position: string; department?: string }[];
  onSubmit: (data: { reviewer: string; content: string }) => void;
}

export function UpdateApprovalModal({ isOpen, onClose, approvers, onSubmit }: UpdateApprovalModalProps) {
  const [reviewer, setReviewer] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ reviewer?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setReviewer('');
      setContent('');
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reviewer) { setErrors({ reviewer: 'Vui lòng chọn người phê duyệt' }); return; }
    setErrors({});
    onSubmit({ reviewer, content });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Trình duyệt cập nhật"
      maxWidth="max-w-lg"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[13px] cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all text-[13px] font-medium shadow-lg shadow-blue-200 cursor-pointer"
          >
            <Send className="w-4 h-4 rotate-[-20deg]" />
            Gửi trình duyệt
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[13px] text-slate-700">
            Người phê duyệt <span className="text-red-500">*</span>
          </label>
          <select
            title="Người phê duyệt"
            value={reviewer}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => { setReviewer(e.target.value); setErrors({}); }}
            className={`w-full px-4 py-2.5 border rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-800 ${errors.reviewer ? 'border-red-400' : 'border-slate-200'}`}
          >
            <option value="">-- Chọn người phê duyệt --</option>
            {approvers.map(a => (
              <option key={a.id} value={a.id}>
                {a.name} - {a.position}{a.department ? ` (${a.department})` : ''}
              </option>
            ))}
          </select>
          {errors.reviewer && <p className="text-[12px] text-red-500">{errors.reviewer}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] text-slate-700">Nội dung gửi duyệt</label>
          <textarea
            rows={4}
            value={content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            placeholder="Nhập nội dung hoặc lý do cập nhật..."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
          />
        </div>
      </div>
    </BaseModal>
  );
}
