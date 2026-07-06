import { ChangeEvent, useState } from 'react';
import { XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { ApprovalRequest } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';

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
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[13px]"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-red-500 text-white rounded-xl flex items-center gap-2 hover:bg-red-600 transition-all text-[13px] shadow-lg shadow-red-100"
          >
            <XCircle className="w-5 h-5" />
            Xác nhận từ chối ({requests.length})
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Info Banner - Red/Pink */}
        <div className="bg-red-50/50 border border-red-100 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-lg border-2 border-red-600 flex items-center justify-center mt-0.5 shrink-0">
              <ChevronRight className="w-3 h-3 text-red-600 stroke-[3]" />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="text-[13px] text-red-700 font-medium uppercase tracking-tight">
                Danh mục được chọn ({requests.length})
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {requests.map(r => (
                  <div key={r.id} className="text-[13px] text-red-900">
                    <span className="font-mono text-red-600 mr-1.5">{r.entityCode}</span>
                    {r.entityName}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Input field */}
        <div className="space-y-2">
          <label className="block text-[13px] font-semibold text-slate-700">
            Lý do từ chối <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={reason}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setReason(e.target.value);
              if (e.target.value.trim()) setError(false);
            }}
            placeholder="Nhập lý do từ chối áp dụng cho tất cả các yêu cầu đã chọn..."
            className={`w-full px-4 py-3 border rounded-xl bg-white text-[13px] focus:ring-2 transition-all outline-none ${
              error ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
            }`}
          />
          {error && (
            <div className="text-[13px] text-red-500 flex items-center gap-1.5 mt-1 animate-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4" /> Vui lòng nhập lý do từ chối
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
