import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface ProvisionServiceApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
  onApprove?: (service: any, reason?: string) => void;
  onReject?: (service: any, reason: string) => void;
  defaultStatus?: 'approve' | 'reject';
  hideDecision?: boolean;
}

export function ProvisionServiceApprovalModal({ 
  isOpen, 
  onClose, 
  service, 
  onApprove, 
  onReject,
  defaultStatus = 'approve',
  hideDecision = false
}: ProvisionServiceApprovalModalProps) {
  const [status, setStatus] = useState<'approve' | 'reject'>(defaultStatus);
  const [rejectReason, setRejectReason] = useState('');
  const [approveReason, setApproveReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStatus(defaultStatus);
      setRejectReason('');
      setApproveReason('');
    }
  }, [isOpen, defaultStatus]);

  if (!isOpen) return null;

  const isReadOnly = service?.status === 'approved' || service?.status === 'rejected' || service?.status === 'published';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl flex flex-col overflow-visible animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800">
            {isReadOnly ? 'Chi tiết thông tin kiểm tra' : 'Phê duyệt dịch vụ cung cấp'}
          </h2>
          <button aria-label="Đóng"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-visible">
          {/* Read Only Status Banner */}
          {isReadOnly && (
            <div className={`p-4 rounded-lg flex items-center justify-between border ${
              service?.status === 'approved'
                ? 'bg-green-50 border-green-200 text-green-800'
                : service?.status === 'published'
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-red-50 border-red-200 text-red-800'
            } animate-in fade-in duration-200`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  service?.status === 'approved' ? 'bg-green-500' : service?.status === 'published' ? 'bg-blue-500' : 'bg-red-500'
                }`} />
                <span className="text-[10px] font-extrabold uppercase tracking-wider">Trạng thái điều phối</span>
              </div>
              <span className="text-xs font-black uppercase">
                {service?.status === 'approved' ? 'Đã phê duyệt' : service?.status === 'published' ? 'Đã công khai' : 'Đã từ chối'}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2.5 text-base border-b border-slate-200/60 pb-1.5 flex items-center justify-between">
                  <span>{service?.name || 'DV_Hộ tịch điện tử'}</span>
                  <span className="text-xs text-slate-400 font-normal">{service?.code || 'DV_001'}</span>
                </h3>
                <div className="space-y-1.5">
                  <p className="text-xs text-slate-600"><span className="font-medium text-slate-500">Mã dịch vụ:</span> {service?.code || 'DV_001'}</p>
                  <p className="text-xs text-slate-600"><span className="font-medium text-slate-500">Loại dữ liệu:</span> Dữ liệu Hộ tịch</p>
                  <p className="text-xs text-slate-600"><span className="font-medium text-slate-500">Phạm vi truy cập:</span> Toàn bộ tổ chức, doanh nghiệp</p>
                  <p className="text-xs text-slate-600"><span className="font-medium text-slate-500">Người tạo:</span> Nguyễn Văn A - Quản trị hệ thống</p>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-amber-50/70 p-4 rounded-lg border border-amber-200">
                <h3 className="text-xs font-bold text-amber-800 flex items-center mb-1.5 uppercase tracking-wider">
                  Cảnh báo vi phạm quy tắc
                </h3>
                <p className="text-xs text-amber-700 leading-relaxed">Dịch vụ đang cấu hình mở "Toàn bộ tổ chức, doanh nghiệp" cho Loại dữ liệu có thể chứa Thông tin cá nhân (Hộ tịch). Hãy chắc chắn rằng dữ liệu đã được ẩn danh hoặc áp dụng đúng chính sách hạn chế chia sẻ.</p>
              </div>

              {/* Read Only Rejection Reason */}
              {service?.status === 'rejected' && (
                <div className="bg-red-50/40 p-4 rounded-lg border border-red-100 space-y-1.5 animate-in fade-in duration-200">
                  <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                    Chi tiết lý do từ chối
                  </h4>
                  <p className="text-xs text-red-700 font-medium leading-relaxed">
                    {service?.rejectReason || 'Thông tin cấu hình trường dữ liệu nhạy cảm chưa được che giấu (masking) đúng quy định an toàn thông tin.'}
                  </p>
                </div>
              )}

              {/* Read Only Approval Reason */}
              {(service?.status === 'approved' || service?.status === 'published') && service?.approveReason && (
                <div className="bg-green-50/40 p-4 rounded-lg border border-green-100 space-y-1.5 animate-in fade-in duration-200">
                  <h4 className="text-xs font-bold text-green-800 uppercase tracking-wider flex items-center gap-1.5">
                    Ý kiến phê duyệt
                  </h4>
                  <p className="text-xs text-green-700 font-medium leading-relaxed">
                    {service?.approveReason}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* History */}
              <div className="bg-slate-50/40 p-4 rounded-lg border border-slate-100">
                <h3 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Lịch sử chỉnh sửa</h3>
                <div className="text-xs text-slate-600 space-y-3 border-l-2 border-slate-200 pl-3 ml-1">
                  <div>
                    <p className="font-medium text-slate-800">29/04/2026 14:30 - Nguyễn Văn A</p>
                    <p className="text-slate-500">Cập nhật: Thay đổi giao thức kết nối từ SOAP sang REST API.</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">28/04/2026 09:00 - Lãnh đạo</p>
                    <p className="text-red-600">Từ chối: Yêu cầu đổi sang giao thức REST để tối ưu hiệu năng.</p>
                  </div>
                </div>
              </div>

              {/* Approval Decision inputs (Visible only if NOT read-only) */}
              {!isReadOnly && (
                <div className="space-y-4">
                  {!hideDecision && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Quyết định phê duyệt</label>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setStatus('approve')}
                          className={`flex-1 flex flex-col items-center p-3 border rounded-lg transition-colors cursor-pointer ${status === 'approve'
                              ? 'border-green-500 bg-green-50/80 text-green-700'
                              : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                          <CheckCircle className={`w-6 h-6 mb-1.5 ${status === 'approve' ? 'text-green-600' : 'text-slate-400'}`} />
                          <span className="text-xs font-semibold">Đồng ý phê duyệt</span>
                        </button>
                        <button
                          onClick={() => setStatus('reject')}
                          className={`flex-1 flex flex-col items-center p-3 border rounded-lg transition-colors cursor-pointer ${status === 'reject'
                              ? 'border-red-500 bg-red-50/80 text-red-700'
                              : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                          <XCircle className={`w-6 h-6 mb-1.5 ${status === 'reject' ? 'text-red-600' : 'text-slate-400'}`} />
                          <span className="text-xs font-semibold">Từ chối phê duyệt</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {status === 'reject' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Lý do từ chối mẫu</label>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => setRejectReason('Thiếu thông tin mô tả chi tiết')}
                            className="text-[10px] px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200 transition-colors cursor-pointer animate-in fade-in duration-150"
                          >
                            Thiếu thông tin mô tả chi tiết
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectReason('Phạm vi truy cập không hợp lệ')}
                            className="text-[10px] px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200 transition-colors cursor-pointer animate-in fade-in duration-150"
                          >
                            Phạm vi truy cập không hợp lệ
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectReason('Sai giao thức kết nối yêu cầu')}
                            className="text-[10px] px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200 transition-colors cursor-pointer animate-in fade-in duration-150"
                          >
                            Sai giao thức kết nối yêu cầu
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectReason('Cần bổ sung chính sách chia sẻ')}
                            className="text-[10px] px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200 transition-colors cursor-pointer animate-in fade-in duration-150"
                          >
                            Cần bổ sung chính sách chia sẻ
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Chi tiết lý do <span className="text-red-500">*</span></label>
                        <textarea
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                          rows={2}
                          placeholder="Nhập lý do từ chối để phản hồi..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {status === 'approve' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Mô tả lý do phê duyệt <span className="text-slate-400 font-normal">(Không bắt buộc)</span></label>
                        <textarea
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                          rows={3}
                          placeholder="Nhập mô tả lý do phê duyệt (nếu có)..."
                          value={approveReason}
                          onChange={(e) => setApproveReason(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl flex-shrink-0">
          {isReadOnly ? (
            <button aria-label="Đóng"
              onClick={onClose}
              className="px-6 py-2 text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors font-bold text-xs uppercase tracking-widest cursor-pointer shadow-md"
            >
              Đóng
            </button>
          ) : (
            <>
              <button aria-label="Đóng"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button aria-label="Xác nhận"
                onClick={() => {
                  if (status === 'approve' && onApprove) {
                    onApprove(service, approveReason);
                  } else if (status === 'reject' && onReject) {
                    onReject(service, rejectReason);
                  }
                }}
                className={`px-4 py-2 text-white rounded-lg transition-colors font-medium text-sm cursor-pointer ${status === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
              >
                {status === 'approve' ? 'Xác nhận Phê duyệt' : 'Xác nhận Từ chối'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
