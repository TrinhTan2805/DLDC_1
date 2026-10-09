import React from 'react';
import { createPortal } from 'react-dom';
import { X, Share2, Globe, Server, Check } from 'lucide-react';
import { BTN_GHOST_ICON, BTN_OUTLINE, BTN_PRIMARY, FIELD_LABEL, LABEL_CLS } from '../../collection/collectionUi';

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-[16px] font-semibold text-[#020817]">Công khai dịch vụ dữ liệu</h2>
          <button type="button" aria-label="Đóng" onClick={onClose} className={BTN_GHOST_ICON}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="bg-[#EAF3FF] p-4 rounded-lg border border-[#BFDBFE] flex items-start gap-3">
            <Share2 className="w-5 h-5 text-[#155DFC] mt-0.5 shrink-0" />
            <div>
              <h3 className="font-medium text-[#020817] mb-1 text-[13px]">Xác nhận công khai dịch vụ</h3>
              <p className="text-[13px] text-[#020817]">
                Dịch vụ <strong className="font-medium">{requestData?.dataType || 'DV_Hộ tịch điện tử'}</strong> đã được phê duyệt hợp lệ.
                Bạn chuẩn bị đồng bộ và công khai dịch vụ này lên các nền tảng chia sẻ dữ liệu.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className={`block ${FIELD_LABEL}`}>Chọn nền tảng công khai</label>

            <label className="flex items-start p-3 border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] cursor-pointer transition-colors">
              <input type="checkbox" className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer" defaultChecked />
              <div className="ml-3">
                <span className="text-[13px] font-medium text-[#020817] flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-[#64748B]" /> Cổng dữ liệu dùng chung Quốc gia
                </span>
                <span className="block text-[12px] text-[#64748B] mt-1">Đồng bộ qua API Data.gov.vn</span>
              </div>
            </label>

            <label className="flex items-start p-3 border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] cursor-pointer transition-colors">
              <input type="checkbox" className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer" defaultChecked />
              <div className="ml-3">
                <span className="text-[13px] font-medium text-[#020817] flex items-center">
                  <Server className="w-4 h-4 mr-2 text-[#64748B]" /> Nền tảng chia sẻ dữ liệu nội bộ (LGSP)
                </span>
                <span className="block text-[12px] text-[#64748B] mt-1">Cung cấp cho các cơ quan ban ngành trong tỉnh</span>
              </div>
            </label>
          </div>

          <div>
            <label className={LABEL_CLS}>Mô tả lý do công khai <span className="text-[#64748B] font-normal text-[12px]">(Không bắt buộc)</span></label>
            <textarea
              className="w-full px-3 py-2 text-[13px] text-[#020817] bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              rows={3}
              placeholder="Nhập mô tả lý do công khai dịch vụ dữ liệu..."
              value={publishReason}
              onChange={(e) => setPublishReason(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
          <button type="button" aria-label="Đóng" onClick={onClose} className={BTN_OUTLINE}>
            Hủy bỏ
          </button>
          <button type="button" aria-label="Xác nhận Công khai"
            onClick={() => {
              if (onConfirmPublish && requestData) {
                // In a real app we'd read the checkboxes state, for now mock it
                onConfirmPublish(requestData.id, ['national', 'lgsp'], publishReason);
              }
              onClose();
            }}
            className={BTN_PRIMARY}
          >
            <Check className="w-4 h-4" />
            Xác nhận Công khai
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
