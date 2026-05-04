import React, { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface ProvisionServiceApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
}

export function ProvisionServiceApprovalModal({ isOpen, onClose, service }: ProvisionServiceApprovalModalProps) {
  const [status, setStatus] = useState<'approve' | 'reject'>('approve');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Phê duyệt dịch vụ cung cấp</h2>
          <button aria-label="Đóng"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2">{service?.name || 'DV_Hộ tịch điện tử'}</h3>
            <p className="text-sm text-slate-600 mb-1"><span className="font-medium">Mã DV:</span> {service?.code || 'DV_001'}</p>
            <p className="text-sm text-slate-600 mb-1"><span className="font-medium">Loại dữ liệu:</span> Dữ liệu Hộ tịch</p>
            <p className="text-sm text-slate-600 mb-1"><span className="font-medium">Phạm vi truy cập:</span> Toàn bộ tổ chức, doanh nghiệp</p>
            <p className="text-sm text-slate-600"><span className="font-medium">Người tạo:</span> Nguyễn Văn A - Quản trị hệ thống</p>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-800 flex items-center mb-2">
              Cảnh báo vi phạm quy tắc
            </h3>
            <p className="text-xs text-amber-700">Dịch vụ đang cấu hình mở "Toàn bộ tổ chức, doanh nghiệp" cho Loại dữ liệu có thể chứa Thông tin cá nhân (Hộ tịch). Hãy chắc chắn rằng dữ liệu đã được ẩn danh hoặc áp dụng đúng chính sách hạn chế chia sẻ.</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Lịch sử chỉnh sửa</h3>
            <div className="text-xs text-slate-600 space-y-2 border-l-2 border-slate-200 pl-3 ml-2">
              <div>
                <p className="font-medium text-slate-800">29/04/2026 14:30 - Nguyễn Văn A</p>
                <p>Cập nhật: Thay đổi giao thức kết nối từ SOAP sang REST API.</p>
              </div>
              <div>
                <p className="font-medium text-slate-800">28/04/2026 09:00 - Lãnh đạo</p>
                <p className="text-red-600">Từ chối: Yêu cầu đổi sang giao thức REST để tối ưu hiệu năng.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Quyết định phê duyệt</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setStatus('approve')}
                className={`flex-1 flex flex-col items-center p-4 border rounded-lg transition-colors ${
                  status === 'approve'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                <CheckCircle className={`w-8 h-8 mb-2 ${status === 'approve' ? 'text-green-600' : 'text-slate-400'}`} />
                <span className="font-medium">Đồng ý phê duyệt</span>
              </button>
              <button
                onClick={() => setStatus('reject')}
                className={`flex-1 flex flex-col items-center p-4 border rounded-lg transition-colors ${
                  status === 'reject'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                <XCircle className={`w-8 h-8 mb-2 ${status === 'reject' ? 'text-red-600' : 'text-slate-400'}`} />
                <span className="font-medium">Từ chối phê duyệt</span>
              </button>
            </div>
          </div>

          {status === 'reject' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Lý do từ chối mẫu</label>
                <div className="flex flex-wrap gap-2">
                  <button className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200">Thiếu thông tin mô tả chi tiết</button>
                  <button className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200">Phạm vi truy cập không hợp lệ</button>
                  <button className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200">Sai giao thức kết nối yêu cầu</button>
                  <button className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200">Cần bổ sung chính sách chia sẻ</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chi tiết lý do <span className="text-red-500">*</span></label>
                <textarea
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  rows={3}
                  placeholder="Nhập lý do từ chối để phản hồi lại cho Quản trị hệ thống..."
                ></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
          <button aria-label="Đóng"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Hủy bỏ
          </button>
          <button aria-label="Đóng"
            onClick={onClose}
            className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${
              status === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {status === 'approve' ? 'Xác nhận Phê duyệt' : 'Xác nhận Từ chối'}
          </button>
        </div>
      </div>
    </div>
  );
}
