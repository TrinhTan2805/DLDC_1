import { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

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
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Ngừng áp dụng</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            title="Đóng" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-600">
            Bạn có chắc chắn muốn ngừng áp dụng bản ghi <span className="font-semibold text-slate-900">{recordName}</span> không?
          </p>
          <p className="text-sm text-red-600 mt-3 p-3 bg-red-50 rounded-lg">
            Bản ghi ngừng áp dụng sẽ không được sử dụng ở các màn hình nhập liệu khác, nhưng vẫn giữ lại trong lịch sử dữ liệu.
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            title="Hủy bỏ" className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            title="Xác nhận" className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-70 min-w-[120px] justify-center"
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
