import { X, AlertTriangle } from 'lucide-react';
import { BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON } from '../collection/collectionUi';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

// Hộp thoại xác nhận xóa (compomennt.md mục 5.4)
export function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-start justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FEF2F2] rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#020817]">Xác nhận xóa</h2>
              <p className="text-[13px] text-[#64748B] mt-1 leading-5">Xóa cấu hình API</p>
            </div>
          </div>
          <button type="button" onClick={onClose} title="Đóng" aria-label="Đóng" className={BTN_GHOST_ICON}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
          <p className="text-[13px] text-[#334155] leading-5">
            Bạn có chắc chắn muốn xóa cấu hình {itemName ? <span className="font-semibold text-[#020817]">{itemName}</span> : 'này'} không?
            Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 flex-shrink-0">
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
