import { AlertTriangle, X } from 'lucide-react';

interface DeleteDataConfirmModalProps {
  data: any;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteDataConfirmModal({ data, onConfirm, onCancel }: DeleteDataConfirmModalProps) {
  const handleConfirm = () => {
    // Mockup: chỉ hiển thị thông báo
    alert('Mockup: Xóa dữ liệu thành công!\n(Chưa kết nối backend thực tế)');
    onConfirm();
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-slate-900">Xác nhận xóa</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-slate-100 rounded transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          <p className="text-slate-700">
            Bạn có chắc chắn muốn xóa dữ liệu sau khỏi danh sách thu thập?
          </p>

          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <div>
              <label className="block text-base text-slate-500 uppercase tracking-wider mb-1">Tên dữ liệu</label>
              <p className="text-slate-900">{data.dataName}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base text-slate-500 uppercase tracking-wider mb-1">Cơ quan</label>
                <p className="text-slate-900">{data.department}</p>
              </div>
              <div>
                <label className="block text-base text-slate-500 uppercase tracking-wider mb-1">Loại dữ liệu</label>
                <p className="text-slate-900">{data.dataType}</p>
              </div>
            </div>

            <div>
              <label className="block text-base text-slate-500 uppercase tracking-wider mb-1">Mã ID</label>
              <p className="text-slate-900">DC-{String(data.id).padStart(4, '0')}</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-base text-red-800">
                  <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác!
                </p>
                <p className="text-base text-red-700">
                  Tất cả thông tin liên quan đến dữ liệu này sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Xác nhận xóa
          </button>
        </div>

        {/* Mockup Note */}
        <div className="px-6 pb-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-base text-amber-800">
              <strong>Lưu ý:</strong> Đây là modal mockup. Chức năng xóa chưa kết nối với backend thực tế.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
