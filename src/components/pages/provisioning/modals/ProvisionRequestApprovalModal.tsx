import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON, BTN_FOCUS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE } from '../../collection/collectionUi';

interface ProvisionRequestApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData?: any;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export function ProvisionRequestApprovalModal({ isOpen, onClose, requestData, onApprove, onReject }: ProvisionRequestApprovalModalProps) {
  const [status, setStatus] = useState<'approve' | 'reject'>('approve');
  const [rejectReason, setRejectReason] = useState('');

  if (!isOpen) return null;

  const decisionCls = (active: boolean, tone: 'approve' | 'reject') =>
    `flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 bg-white transition-colors ${BTN_FOCUS} ${
      active
        ? tone === 'approve' ? 'border-[#16A34A] text-[#15803D]' : 'border-[#DC2626] text-[#B91C1C]'
        : 'border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
    }`;

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header (mục 5.4) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] flex-shrink-0">
          <h2 className="text-[16px] font-medium text-[#020817]">Xử lý yêu cầu cung cấp dữ liệu</h2>
          <button type="button" aria-label="Đóng" title="Đóng" onClick={onClose} className={BTN_GHOST_ICON}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Nhãn – giá trị (mục 5.17) */}
          <div className="rounded-2xl border border-[#E2E8F0] p-4 grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1">
              <div className={FIELD_LABEL}>Mã YC</div>
              <div className={FIELD_VALUE}>{requestData?.id || 'YC-2026-0429'}</div>
            </div>
            <div className="space-y-1">
              <div className={FIELD_LABEL}>Cơ quan yêu cầu</div>
              <div className={`${FIELD_VALUE} break-words`}>{requestData?.org || 'Sở Nội vụ Lạng Sơn'}</div>
            </div>
            <div className="space-y-1">
              <div className={FIELD_LABEL}>Loại dữ liệu</div>
              <div className={`${FIELD_VALUE} break-words`}>{requestData?.dataType || 'Thống kê hộ tịch'}</div>
            </div>
            <div className="space-y-1">
              <div className={FIELD_LABEL}>Mục đích</div>
              <div className={`${FIELD_VALUE} break-words`}>{requestData?.purpose || 'Phục vụ báo cáo quý'}</div>
            </div>
          </div>

          <div>
            <label className={`${LABEL_CLS} !mb-2`}>Quyết định xử lý</label>
            <div className="flex gap-4">
              <button type="button" onClick={() => setStatus('approve')} className={decisionCls(status === 'approve', 'approve')}>
                <CheckCircle className={`w-8 h-8 ${status === 'approve' ? 'text-[#16A34A]' : 'text-[#94A3B8]'}`} />
                <span className="text-[13px] font-medium">Phê duyệt</span>
              </button>
              <button type="button" onClick={() => setStatus('reject')} className={decisionCls(status === 'reject', 'reject')}>
                <XCircle className={`w-8 h-8 ${status === 'reject' ? 'text-[#DC2626]' : 'text-[#94A3B8]'}`} />
                <span className="text-[13px] font-medium">Từ chối</span>
              </button>
            </div>
          </div>

          {status === 'reject' && (
            <div>
              <label className={LABEL_CLS}>Lý do từ chối <span className={REQUIRED_MARK}>*</span></label>
              <textarea className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600" rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Nhập lý do từ chối yêu cầu..." />
            </div>
          )}
        </div>

        {/* Footer (mục 5.4) */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 flex-shrink-0">
          <button type="button" aria-label="Hủy bỏ" onClick={onClose} className={BTN_OUTLINE}>Hủy bỏ</button>
          <button
            type="button"
            aria-label="Xác nhận"
            onClick={() => {
              if (status === 'approve') onApprove(requestData?.id || 'YC-2026-0429');
              else onReject(requestData?.id || 'YC-2026-0429', rejectReason);
              onClose();
            }}
            className={status === 'approve' ? BTN_PRIMARY : BTN_DESTRUCTIVE}
          >
            {status === 'approve' ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối'}
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
