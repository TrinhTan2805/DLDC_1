import { ChangeEvent, useState } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { ApprovalRequest } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { BTN_PRIMARY, BTN_OUTLINE, LABEL_CLS } from '../../../collection/collectionUi';

const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';

interface BulkApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: ApprovalRequest[];
  onConfirm: (note: string) => void;
}

export function BulkApproveModal({
  isOpen,
  onClose,
  requests,
  onConfirm
}: BulkApproveModalProps) {
  const [note, setNote] = useState('');

  if (!isOpen || requests.length === 0) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Phê duyệt nhanh"
      maxWidth="max-w-lg"
      footer={
        <>
          <button onClick={onClose} className={BTN_OUTLINE}>
            Hủy
          </button>
          <button
            onClick={() => onConfirm(note)}
            className={BTN_PRIMARY}
          >
            <CheckCircle2 className="w-4 h-4" />
            Xác nhận phê duyệt ({requests.length})
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Info Banner */}
        <div className="bg-[#EAF3FF] border border-[#BFDBFE] rounded-lg p-3">
          <div className="flex items-start gap-3">
            <ChevronRight className="w-4 h-4 text-[#155DFC] mt-0.5 shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="text-[13px] text-[#020817] font-medium">
                Danh mục được chọn ({requests.length})
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {requests.map(r => (
                  <div key={r.id} className="text-[13px] text-[#020817]">
                    <span className="text-[#64748B] mr-1.5">{r.entityCode}</span>
                    {r.entityName}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Input field */}
        <div>
          <label className={LABEL_CLS}>
            Ý kiến phê duyệt <span className="text-[#64748B] font-normal">(Không bắt buộc)</span>
          </label>
          <textarea
            rows={4}
            value={note}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
            placeholder="Nhập ý kiến phê duyệt áp dụng cho tất cả các yêu cầu đã chọn (nếu có)..."
            className={TEXTAREA_CLS}
          />
        </div>
      </div>
    </BaseModal>
  );
}
