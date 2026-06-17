import React from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Check } from 'lucide-react';

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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-800">Hủy công khai dịch vụ</h2>
          <button aria-label="Đóng"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1 text-[13px]">Xác nhận hủy công khai</h3>
              <p className="text-[13px] text-red-700">
                Dịch vụ <strong>{requestData?.dataType || 'DV_Hộ tịch điện tử'}</strong> sẽ bị ngừng đồng bộ trên các nền tảng chia sẻ dữ liệu. Bạn có chắc chắn muốn thực hiện?
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-slate-700">Lý do hủy công khai <span className="text-slate-400 font-normal text-[11px]">(Bắt buộc)</span></label>
            <textarea
              className="w-full px-3 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 hover:border-slate-300 transition-colors"
              rows={4}
              placeholder="Nhập lý do hủy công khai dịch vụ dữ liệu..."
              value={unpublishReason}
              onChange={(e) => setUnpublishReason(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
          <button aria-label="Đóng"
            onClick={onClose}
            className="bg-white text-[#020817] border border-[#e2e8f0] hover:bg-slate-50 rounded-lg px-4 py-2 font-medium text-[13px] transition-colors shadow-sm"
          >
            Trở lại
          </button>
          <button aria-label="Xác nhận Hủy Công khai"
            onClick={() => {
              if (onConfirmUnpublish && requestData) {
                onConfirmUnpublish(requestData.id, unpublishReason);
              }
              onClose();
            }}
            disabled={!unpublishReason.trim()}
            className="px-4 py-2 bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 text-white rounded-lg flex items-center transition-colors font-medium text-[13px] shadow-sm"
          >
            <Check className="w-4 h-4 mr-1.5" />
            Xác nhận Hủy
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
