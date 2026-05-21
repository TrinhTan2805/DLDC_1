import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  method: any;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ method, onCancel, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-slate-900">Xác nhận xóa</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-slate-100 rounded transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <p className="text-base text-slate-700">
            Bạn có chắc chắn muốn xóa phương thức thu thập dữ liệu này không?
          </p>
          
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-base text-slate-500">Tên phương thức:</span>
              <span className="text-base text-slate-900">{method.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base text-slate-500">Bộ ban ngành:</span>
              <span className="text-base text-slate-900">{method.ministry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base text-slate-500">API Endpoint:</span>
              <span className="text-base text-slate-900 truncate max-w-[200px]">{method.endpoint}</span>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-base text-red-800">
              <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến phương thức này sẽ bị xóa vĩnh viễn.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-slate-300 rounded-lg text-base hover:bg-slate-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg text-base hover:bg-red-700 transition-colors"
          >
            Xóa phương thức
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
