import { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON } from '../../../collection/collectionUi';

interface ArchiveRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recordName: string;
}

export function ArchiveRecordModal({ isOpen, onClose, onConfirm, recordName }: ArchiveRecordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsLoading(true);
    setError(null);

    // Simulate constraint check (1.5s delay)
    setTimeout(() => {
      // Occasional mock error for demonstration purposes could be added here
      // but for smooth UC execution, we assume constraints pass.
      setIsLoading(false);
      onConfirm();
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4" 
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#DC2626]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-[16px] font-semibold text-[#020817]">Ngừng áp dụng</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            title="Đóng"
            aria-label="Đóng"
            className={`${BTN_GHOST_ICON} disabled:text-[#CBD5E1] disabled:cursor-not-allowed disabled:!text-[#CBD5E1] disabled:!bg-transparent `}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
          <p className="text-[13px] text-[#020817]">
            Bạn có chắc chắn muốn ngừng áp dụng bản ghi <span className="font-medium">{recordName}</span> không?
          </p>
          <div className="mt-3 p-3 bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg text-[13px] text-[#B91C1C]">
            Bản ghi ngừng áp dụng sẽ không được sử dụng ở các màn hình nhập liệu khác, nhưng vẫn giữ lại trong lịch sử dữ liệu.
          </div>

          {error && (
            <div className="mt-4 p-3 bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg text-[13px] text-[#B91C1C] flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#DC2626]" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            title="Hủy bỏ" className={BTN_OUTLINE}
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            title="Xác nhận" className={`${BTN_DESTRUCTIVE} min-w-[120px]`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang kiểm tra...
              </>
            ) : (
              'Xác nhận'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
