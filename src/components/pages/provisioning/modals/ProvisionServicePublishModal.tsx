import React from 'react';
import { createPortal } from 'react-dom';
import { X, Share2, Globe, Server, Check } from 'lucide-react';

interface ProvisionServicePublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData?: any;
  onConfirmPublish?: (id: string, platforms: string[], reason: string) => void;
}

export function ProvisionServicePublishModal({ isOpen, onClose, requestData, onConfirmPublish }: ProvisionServicePublishModalProps) {
  const [publishReason, setPublishReason] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      setPublishReason('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-800">Công khai dịch vụ dữ liệu</h2>
          <button aria-label="Đóng"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start">
            <Share2 className="w-6 h-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1 text-[13px]">Xác nhận công khai dịch vụ</h3>
              <p className="text-[13px] text-blue-700">
                Dịch vụ <strong>{requestData?.dataType || 'DV_Hộ tịch điện tử'}</strong> đã được phê duyệt hợp lệ. 
                Bạn chuẩn bị đồng bộ và công khai dịch vụ này lên các nền tảng chia sẻ dữ liệu.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[13px] font-medium text-slate-700">Chọn nền tảng công khai</label>
            
            <label className="flex items-start p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" className="mt-1 text-blue-600 focus:ring-blue-500 rounded text-[13px]" defaultChecked />
              <div className="ml-3">
                <span className="block text-[13px] font-medium text-slate-800 flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-slate-500" /> Cổng dữ liệu dùng chung Quốc gia
                </span>
                <span className="block text-[11px] text-slate-500 mt-1">Đồng bộ qua API Data.gov.vn</span>
              </div>
            </label>

            <label className="flex items-start p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" className="mt-1 text-blue-600 focus:ring-blue-500 rounded text-[13px]" defaultChecked />
              <div className="ml-3">
                <span className="block text-[13px] font-medium text-slate-800 flex items-center">
                  <Server className="w-4 h-4 mr-2 text-slate-500" /> Nền tảng chia sẻ dữ liệu nội bộ (LGSP)
                </span>
                <span className="block text-[11px] text-slate-500 mt-1">Cung cấp cho các cơ quan ban ngành trong tỉnh</span>
              </div>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-slate-700">Mô tả lý do công khai <span className="text-slate-400 font-normal text-[11px]">(Không bắt buộc)</span></label>
            <textarea
              className="w-full px-3 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-colors"
              rows={3}
              placeholder="Nhập mô tả lý do công khai dịch vụ dữ liệu..."
              value={publishReason}
              onChange={(e) => setPublishReason(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
          <button aria-label="Đóng"
            onClick={onClose}
            className="bg-white text-[#020817] border border-[#e2e8f0] hover:bg-slate-50 rounded-lg px-4 py-2 font-medium text-[13px] transition-colors shadow-sm"
          >
            Hủy bỏ
          </button>
          <button aria-label="Xác nhận Công khai"
            onClick={() => {
              if (onConfirmPublish && requestData) {
                // In a real app we'd read the checkboxes state, for now mock it
                onConfirmPublish(requestData.id, ['national', 'lgsp'], publishReason);
              }
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors font-medium text-[13px] shadow-sm"
          >
            <Check className="w-4 h-4 mr-1.5" />
            Xác nhận Công khai
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
