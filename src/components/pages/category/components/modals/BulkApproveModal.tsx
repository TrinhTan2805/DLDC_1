import { ChangeEvent, useState } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { ApprovalRequest } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';

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
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[13px]"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm(note)}
            className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl flex items-center gap-2 hover:bg-emerald-600 transition-all text-[13px] shadow-lg shadow-emerald-100"
          >
            <CheckCircle2 className="w-5 h-5" />
            Xác nhận phê duyệt ({requests.length})
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-lg border-2 border-blue-600 flex items-center justify-center mt-0.5 shrink-0">
              <ChevronRight className="w-3 h-3 text-blue-600 stroke-[3]" />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="text-[13px] text-blue-700 font-medium uppercase tracking-tight">
                Danh mục được chọn ({requests.length})
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {requests.map(r => (
                  <div key={r.id} className="text-[13px] text-blue-900">
                    <span className="font-mono text-blue-600 mr-1.5">{r.entityCode}</span>
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
            Ý kiến phê duyệt <span className="text-slate-400 font-normal">(Không bắt buộc)</span>
          </label>
          <textarea
            rows={4}
            value={note}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
            placeholder="Nhập ý kiến phê duyệt áp dụng cho tất cả các yêu cầu đã chọn (nếu có)..."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
          />
        </div>
      </div>
    </BaseModal>
  );
}
