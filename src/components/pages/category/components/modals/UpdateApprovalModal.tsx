import { ChangeEvent, useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { BaseModal } from '../../../../common/BaseModal';
import { BTN_PRIMARY, BTN_OUTLINE, INPUT_CLS, LABEL_CLS, REQUIRED_MARK } from '../../../collection/collectionUi';

const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';

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
          <button onClick={onClose} className={BTN_OUTLINE}>
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className={BTN_PRIMARY}
          >
            <Send className="w-4 h-4 rotate-[-20deg]" />
            Gửi trình duyệt
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className={LABEL_CLS}>
            Người phê duyệt <span className={REQUIRED_MARK}>*</span>
          </label>
          <select
            title="Người phê duyệt"
            value={reviewer}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => { setReviewer(e.target.value); setErrors({}); }}
            className={`${INPUT_CLS} ${errors.reviewer ? '!border-[#DC2626]' : ''}`}
          >
            <option value="" disabled hidden>-- Chọn người phê duyệt --</option>
            {approvers.map(a => (
              <option key={a.id} value={a.id}>
                {a.name} - {a.position}{a.department ? ` (${a.department})` : ''}
              </option>
            ))}
          </select>
          {errors.reviewer && <p className="mt-1 text-[12px] text-[#DC2626]">{errors.reviewer}</p>}
        </div>

        <div>
          <label className={LABEL_CLS}>Nội dung gửi duyệt</label>
          <textarea
            rows={4}
            value={content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            placeholder="Nhập nội dung hoặc lý do cập nhật..."
            className={TEXTAREA_CLS}
          />
        </div>
      </div>
    </BaseModal>
  );
}
