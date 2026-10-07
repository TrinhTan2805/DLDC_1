import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON } from '../../../collection/collectionUi';

interface MojUnitDeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  unitName: string;
}

export function MojUnitDeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  unitName
}: MojUnitDeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="text-[16px] font-medium text-[#020817]">Xác nhận xóa</h2>
          <button
            type="button"
            onClick={onClose}
            title="Đóng"
            aria-label="Đóng"
            className={BTN_GHOST_ICON}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#FEF2F2] rounded-full flex items-center justify-center flex-shrink-0 border border-[#FEE2E2]">
              <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-[13px] text-[#020817] leading-5">
                Bạn có chắc chắn muốn xóa đơn vị{' '}
                <span className="font-medium">{unitName || 'này'}</span> không?
              </p>
              <p className="text-[13px] text-[#64748B]">
                Hành động này không thể hoàn tác và dữ liệu liên quan sẽ bị ảnh hưởng.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>
            Hủy
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={BTN_DESTRUCTIVE}
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
}
