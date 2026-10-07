import { ChangeEvent, useState } from 'react';
import { XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { ApprovalRequest } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { BTN_OUTLINE, BTN_DESTRUCTIVE, LABEL_CLS, REQUIRED_MARK } from '../../../collection/collectionUi';

const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';

interface BulkRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: ApprovalRequest[];
  onConfirm: (reason: string) => void;
}

export function BulkRejectModal({
  isOpen,
  onClose,
  requests,
  onConfirm
}: BulkRejectModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen || requests.length === 0) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError(true);
      return;
    }
    onConfirm(reason);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Từ chối nhanh"
      maxWidth="max-w-lg"
      footer={
        <>
          <button onClick={onClose} className={BTN_OUTLINE}>
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className={BTN_DESTRUCTIVE}
          >
            <XCircle className="w-4 h-4" />
            Xác nhận từ chối ({requests.length})
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Info Banner - Red/Pink */}
        <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg p-3">
          <div className="flex items-start gap-3">
            <ChevronRight className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
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
            Lý do từ chối <span className={REQUIRED_MARK}>*</span>
          </label>
          <textarea
            rows={4}
            value={reason}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setReason(e.target.value);
              if (e.target.value.trim()) setError(false);
            }}
            placeholder="Nhập lý do từ chối áp dụng cho tất cả các yêu cầu đã chọn..."
            className={`${TEXTAREA_CLS} ${error ? '!border-[#DC2626] focus:!ring-[#DC2626]' : ''}`}
          />
          {error && (
            <div className="text-[13px] text-[#DC2626] flex items-center gap-1.5 mt-1 animate-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4" /> Vui lòng nhập lý do từ chối
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
