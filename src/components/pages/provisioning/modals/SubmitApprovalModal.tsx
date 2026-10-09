import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, AlertCircle } from 'lucide-react';
import { BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, LABEL_CLS, REQUIRED_MARK } from '../../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;

interface SubmitApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (approverId: string, message: string) => void;
  service?: any;
}

export function SubmitApprovalModal({ isOpen, onClose, onSubmit, service }: SubmitApprovalModalProps) {
  const [approver, setApprover] = useState('manager_1');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(approver, message);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header (mục 5.4) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] shrink-0">
          <div>
            <h2 className="text-[16px] font-semibold text-[#020817]">Trình duyệt Dịch vụ</h2>
            <p className="text-[13px] text-[#64748B]">Gửi yêu cầu phê duyệt để công khai</p>
          </div>
          <button
            type="button"
            title="Đóng"
            aria-label="Đóng"
            onClick={onClose}
            className={BTN_GHOST_ICON}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-4">
            <div className="p-3 bg-[#EAF3FF] border border-[#BFDBFE] rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#155DFC] shrink-0 mt-0.5" />
              <div className="text-[13px] text-[#020817]">
                Bạn đang trình duyệt dịch vụ <span className="font-medium">{service?.name || 'Mới'}</span>. Dịch vụ này sẽ ở trạng thái <span className="font-medium">Chờ phê duyệt</span>.
              </div>
            </div>

            <div>
              <label className={LABEL_CLS}>Người nhận phê duyệt <span className={REQUIRED_MARK}>*</span></label>
              <select
                title="Người nhận phê duyệt"
                value={approver}
                onChange={(e) => setApprover(e.target.value)}
                className={INPUT_CLS}
              >
                <option value="manager_1">Đ/c Trần Văn Lãnh Đạo (Trưởng phòng Dữ liệu)</option>
                <option value="director_1">Đ/c Nguyễn Cục Trưởng (Cục trưởng)</option>
                <option value="expert_1">Đ/c Lê Chuyên Viên (Chuyên viên chính)</option>
              </select>
            </div>

            <div>
              <label className={LABEL_CLS}>Lời nhắn / Ghi chú</label>
              <textarea
                title="Lời nhắn"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập nội dung trình bày (không bắt buộc)..."
                rows={3}
                className={`${INPUT_CLS} h-auto py-2 resize-none`}
              ></textarea>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className={BTN_OUTLINE}>
              Hủy bỏ
            </button>
            <button type="submit" className={BTN_PRIMARY}>
              <Send className="w-4 h-4" />
              Gửi yêu cầu
            </button>
          </div>
        </form>
      </div>
    </div>
  , document.body);
}
