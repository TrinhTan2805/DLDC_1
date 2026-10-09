import { X, AlertTriangle } from 'lucide-react';
import { BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON } from './collectionUi';

interface SourceSystemDeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  systemName: string;
}

export function SourceSystemDeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  systemName
}: SourceSystemDeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
      <div role="alertdialog" aria-modal="true" aria-labelledby="delete-confirm-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-[#FEF2F2] text-[#DC2626]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 id="delete-confirm-title" className="flex-1 min-w-0 text-[16px] font-semibold text-[#020817]">Xác nhận xóa</h2>
          <button type="button" onClick={onClose} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0] space-y-1">
            <p className="text-[13px] text-[#020817] leading-5">
              Bạn có chắc chắn muốn xóa hệ thống nguồn{' '}
              <span className="font-medium">{systemName || 'này'}</span> không?
            </p>
            <p className="text-[12px] text-[#64748B]">
              Hành động này không thể hoàn tác và dữ liệu liên quan sẽ bị ảnh hưởng.
            </p>
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
