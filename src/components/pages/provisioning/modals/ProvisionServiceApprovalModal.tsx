import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Badge, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;

interface ProvisionServiceApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
  onApprove?: (service: any, reason?: string) => void;
  onReject?: (service: any, reason: string) => void;
  defaultStatus?: 'approve' | 'reject';
  hideDecision?: boolean;
}

const REJECT_TEMPLATES = [
  'Thiếu thông tin mô tả chi tiết',
  'Phạm vi truy cập không hợp lệ',
  'Sai giao thức kết nối yêu cầu',
  'Cần bổ sung chính sách chia sẻ',
];

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

  const decisionBtn = (active: boolean, tone: 'approve' | 'reject') =>
    `flex-1 h-10 inline-flex items-center justify-center gap-2 rounded-lg border text-[13px] font-medium transition-colors cursor-pointer ${
      active
        ? tone === 'approve'
          ? 'border-[#16A34A] bg-[#F0FDF4] text-[#15803D]'
          : 'border-[#DC2626] bg-[#FEF2F2] text-[#B91C1C]'
        : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
    }`;

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header (mục 5.4) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] shrink-0">
          <h2 className="text-[16px] font-semibold text-[#020817]">
            {isReadOnly ? 'Chi tiết thông tin kiểm tra' : 'Phê duyệt dịch vụ cung cấp'}
          </h2>
          <button type="button" aria-label="Đóng" onClick={onClose} className={BTN_GHOST_ICON}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Read Only Status Banner */}
          {isReadOnly && (
            <div className="px-4 py-3 rounded-lg flex items-center justify-between border border-[#E2E8F0] bg-[#F8FAFC]">
              <span className={FIELD_LABEL}>Trạng thái điều phối</span>
              <Badge
                label={service?.status === 'approved' ? 'Đã phê duyệt' : service?.status === 'published' ? 'Đã công khai' : 'Đã từ chối'}
                variant={service?.status === 'approved' ? 'green' : service?.status === 'published' ? 'blue' : 'red'}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <div className="mb-3 pb-3 border-b border-[#E2E8F0]">
                  <div className="text-[14px] font-medium text-[#020817]">{service?.name || 'DV_Hộ tịch điện tử'}</div>
                  <div className="text-[13px] text-[#64748B]">{service?.code || 'DV_001'}</div>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-2">
                  <span className={FIELD_LABEL}>Mã dịch vụ:</span>
                  <span className={FIELD_VALUE}>{service?.code || 'DV_001'}</span>
                  <span className={FIELD_LABEL}>Loại dữ liệu:</span>
                  <span className={FIELD_VALUE}>Dữ liệu Hộ tịch</span>
                  <span className={FIELD_LABEL}>Phạm vi truy cập:</span>
                  <span className={FIELD_VALUE}>Toàn bộ tổ chức, doanh nghiệp</span>
                  <span className={FIELD_LABEL}>Người tạo:</span>
                  <span className={FIELD_VALUE}>Nguyễn Văn A - Quản trị hệ thống</span>
                </div>
              </div>

              {/* Warning */}
              <div className="p-3 rounded-lg border border-[#FED7AA] bg-[#FFF7ED] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[13px] font-medium text-[#020817] mb-1">Cảnh báo vi phạm quy tắc</div>
                  <p className="text-[13px] text-[#020817] leading-relaxed">Dịch vụ đang cấu hình mở "Toàn bộ tổ chức, doanh nghiệp" cho Loại dữ liệu có thể chứa Thông tin cá nhân (Hộ tịch). Hãy chắc chắn rằng dữ liệu đã được ẩn danh hoặc áp dụng đúng chính sách hạn chế chia sẻ.</p>
                </div>
              </div>

              {/* Read Only Rejection Reason */}
              {service?.status === 'rejected' && (
                <div className="p-3 rounded-lg border border-[#FEE2E2] bg-[#FEF2F2]">
                  <div className="text-[13px] font-medium text-[#B91C1C] mb-1">Chi tiết lý do từ chối</div>
                  <p className="text-[13px] text-[#020817] leading-relaxed">
                    {service?.rejectReason || 'Thông tin cấu hình trường dữ liệu nhạy cảm chưa được che giấu (masking) đúng quy định an toàn thông tin.'}
                  </p>
                </div>
              )}

              {/* Read Only Approval Reason */}
              {(service?.status === 'approved' || service?.status === 'published') && service?.approveReason && (
                <div className="p-3 rounded-lg border border-[#DCFCE7] bg-[#F0FDF4]">
                  <div className="text-[13px] font-medium text-[#15803D] mb-1">Ý kiến phê duyệt</div>
                  <p className="text-[13px] text-[#020817] leading-relaxed">{service?.approveReason}</p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* History */}
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <h3 className={SECTION_TITLE}>Lịch sử chỉnh sửa</h3>
                <div className="text-[13px] space-y-3 border-l-2 border-[#E2E8F0] pl-3 ml-1">
                  <div>
                    <p className="font-medium text-[#020817]">29/04/2026 14:30 - Nguyễn Văn A</p>
                    <p className="text-[#64748B]">Cập nhật: Thay đổi giao thức kết nối từ SOAP sang REST API.</p>
                  </div>
                  <div>
                    <p className="font-medium text-[#020817]">28/04/2026 09:00 - Lãnh đạo</p>
                    <p className="text-[#DC2626]">Từ chối: Yêu cầu đổi sang giao thức REST để tối ưu hiệu năng.</p>
                  </div>
                </div>
              </div>

              {/* Approval Decision inputs (Visible only if NOT read-only) */}
              {!isReadOnly && (
                <div className="space-y-4">
                  {!hideDecision && (
                    <div>
                      <label className={LABEL_CLS}>Quyết định phê duyệt</label>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStatus('approve')} className={decisionBtn(status === 'approve', 'approve')}>
                          <CheckCircle className="w-4 h-4" />
                          <span>Đồng ý phê duyệt</span>
                        </button>
                        <button type="button" onClick={() => setStatus('reject')} className={decisionBtn(status === 'reject', 'reject')}>
                          <XCircle className="w-4 h-4" />
                          <span>Từ chối phê duyệt</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {status === 'reject' && (
                    <div className="space-y-3">
                      <div>
                        <label className={LABEL_CLS}>Lý do từ chối mẫu</label>
                        <div className="flex flex-wrap gap-1.5">
                          {REJECT_TEMPLATES.map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setRejectReason(t)}
                              className={`h-[26px] px-2 rounded-2xl border text-[13px] transition-colors cursor-pointer ${
                                rejectReason === t
                                  ? 'bg-[#EAF3FF] border-[#BFDBFE] text-[#155DFC]'
                                  : 'bg-white border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC]'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Chi tiết lý do <span className={REQUIRED_MARK}>*</span></label>
                        <textarea
                          className={`${INPUT_CLS} h-auto py-2`}
                          rows={2}
                          placeholder="Nhập lý do từ chối để phản hồi..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {status === 'approve' && (
                    <div>
                      <label className={LABEL_CLS}>Mô tả lý do phê duyệt <span className="text-[#64748B] font-normal">(Không bắt buộc)</span></label>
                      <textarea
                        className={`${INPUT_CLS} h-auto py-2`}
                        rows={3}
                        placeholder="Nhập mô tả lý do phê duyệt (nếu có)..."
                        value={approveReason}
                        onChange={(e) => setApproveReason(e.target.value)}
                      ></textarea>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 shrink-0">
          {isReadOnly ? (
            <button type="button" aria-label="Đóng" onClick={onClose} className={BTN_OUTLINE}>
              Đóng
            </button>
          ) : (
            <>
              <button type="button" aria-label="Đóng" onClick={onClose} className={BTN_OUTLINE}>
                Hủy bỏ
              </button>
              <button
                type="button"
                aria-label="Xác nhận"
                onClick={() => {
                  if (status === 'approve' && onApprove) {
                    onApprove(service, approveReason);
                  } else if (status === 'reject' && onReject) {
                    onReject(service, rejectReason);
                  }
                }}
                className={status === 'approve' ? BTN_PRIMARY : BTN_DESTRUCTIVE}
              >
                {status === 'approve' ? 'Xác nhận Phê duyệt' : 'Xác nhận Từ chối'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  , document.body);
}
