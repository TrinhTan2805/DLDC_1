import React, { useState } from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';

interface ProvisionServiceUnpublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
  onUnpublish?: (code: string, reason: string) => void;
  showToast: (message: string) => void;
}

export function ProvisionServiceUnpublishModal({ isOpen, onClose, service, onUnpublish, showToast }: ProvisionServiceUnpublishModalProps) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Hủy công bố dịch vụ dữ liệu</h2>
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
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-1" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Cảnh báo hủy công bố</h3>
              <p className="text-sm text-red-700">
                Bạn đang thực hiện thao tác hủy công bố đối với dịch vụ <strong>{service?.name || 'DV_Hộ tịch điện tử'}</strong>. 
                Thao tác này sẽ ngắt kết nối đồng bộ lên Cổng dữ liệu dùng chung và Nền tảng LGSP.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Lý do hủy công bố <span className="text-red-500">*</span></label>
            <textarea
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do hủy công bố để thông báo đến các hệ thống và người dùng liên quan..."
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
          <button aria-label="Hủy bỏ"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
          >
            Hủy bỏ
          </button>
          <button aria-label="Xác nhận Hủy công bố"
            onClick={() => {
              if (!reason.trim()) {
                showToast('Vui lòng nhập lý do hủy công bố!');
                return;
              }
              if (onUnpublish && service) {
                onUnpublish(service.code, reason);
              }
              showToast(`Đã hủy công bố dịch vụ ${service?.name || 'DV_Hộ tịch điện tử'}. Hệ thống đang gửi thông báo cập nhật!`);
              onClose();
              setReason(''); // reset
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center transition-colors font-medium text-sm"
          >
            <Check className="w-4 h-4 mr-2" />
            Xác nhận Hủy công bố
          </button>
        </div>
      </div>
    </div>
  );
}
