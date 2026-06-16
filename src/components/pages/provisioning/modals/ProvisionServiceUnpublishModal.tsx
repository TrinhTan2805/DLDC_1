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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Hủy công khai dịch vụ</h2>
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
              <h3 className="font-semibold text-red-800 mb-1">Xác nhận hủy công khai</h3>
              <p className="text-sm text-red-700">
                Dịch vụ <strong>{requestData?.dataType || 'DV_Hộ tịch điện tử'}</strong> sẽ bị ngừng đồng bộ trên các nền tảng chia sẻ dữ liệu. Bạn có chắc chắn muốn thực hiện?
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Lý do hủy công khai <span className="text-slate-400 font-normal text-xs">(Bắt buộc)</span></label>
            <textarea
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 hover:border-slate-300 transition-colors"
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
            className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
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
            className="px-4 py-2 bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 text-white rounded-lg flex items-center transition-colors font-medium"
          >
            <Check className="w-5 h-5 mr-2" />
            Xác nhận Hủy
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
