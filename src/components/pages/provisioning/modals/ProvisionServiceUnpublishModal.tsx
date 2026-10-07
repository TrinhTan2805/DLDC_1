import React from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Check } from 'lucide-react';
import { BTN_GHOST_ICON, BTN_OUTLINE, BTN_DESTRUCTIVE, LABEL_CLS } from '../../collection/collectionUi';

interface ProvisionServiceUnpublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData?: any;
  onConfirmUnpublish?: (id: string, reason: string) => void;
}

export function ProvisionServiceUnpublishModal({ isOpen, onClose, requestData, onConfirmUnpublish }: ProvisionServiceUnpublishModalProps) {
  const [unpublishReason, setUnpublishReason] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      setUnpublishReason('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-[16px] font-medium text-[#020817]">Hủy công khai dịch vụ</h2>
          <button type="button" aria-label="Đóng" onClick={onClose} className={BTN_GHOST_ICON}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="bg-[#FEF2F2] p-4 rounded-lg border border-[#FEE2E2] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#DC2626] mt-0.5 shrink-0" />
            <div>
              <h3 className="font-medium text-[#020817] mb-1 text-[13px]">Xác nhận hủy công khai</h3>
              <p className="text-[13px] text-[#020817]">
                Dịch vụ <strong className="font-medium">{requestData?.dataType || 'DV_Hộ tịch điện tử'}</strong> sẽ bị ngừng đồng bộ trên các nền tảng chia sẻ dữ liệu. Bạn có chắc chắn muốn thực hiện?
              </p>
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Lý do hủy công khai <span className="text-[#64748B] font-normal text-[12px]">(Bắt buộc)</span></label>
            <textarea
              className="w-full px-3 py-2 text-[13px] text-[#020817] bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              rows={4}
              placeholder="Nhập lý do hủy công khai dịch vụ dữ liệu..."
              value={unpublishReason}
              onChange={(e) => setUnpublishReason(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
          <button type="button" aria-label="Đóng" onClick={onClose} className={BTN_OUTLINE}>
            Trở lại
          </button>
          <button type="button" aria-label="Xác nhận Hủy Công khai"
            onClick={() => {
              if (onConfirmUnpublish && requestData) {
                onConfirmUnpublish(requestData.id, unpublishReason);
              }
              onClose();
            }}
            disabled={!unpublishReason.trim()}
            className={BTN_DESTRUCTIVE}
          >
            <Check className="w-4 h-4" />
            Xác nhận Hủy
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
