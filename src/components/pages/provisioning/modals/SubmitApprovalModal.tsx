import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, UserCheck, AlertCircle } from 'lucide-react';

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Trình duyệt Dịch vụ</h2>
              <p className="text-xs text-slate-500 font-medium">Gửi yêu cầu phê duyệt để công khai</p>
            </div>
          </div>
          <button 
            title="Đóng"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              Bạn đang trình duyệt dịch vụ <span className="font-bold">{service?.name || 'Mới'}</span>. Dịch vụ này sẽ ở trạng thái <span className="font-bold">Chờ phê duyệt</span>.
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Người nhận phê duyệt <span className="text-red-500">*</span></label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  title="Người nhận phê duyệt"
                  value={approver}
                  onChange={(e) => setApprover(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                >
                  <option value="manager_1">Đ/c Trần Văn Lãnh Đạo (Trưởng phòng Dữ liệu)</option>
                  <option value="director_1">Đ/c Nguyễn Cục Trưởng (Cục trưởng)</option>
                  <option value="expert_1">Đ/c Lê Chuyên Viên (Chuyên viên chính)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Lời nhắn / Ghi chú</label>
              <textarea 
                title="Lời nhắn"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập nội dung trình bày (không bắt buộc)..."
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-all shadow-md shadow-blue-200 font-bold text-xs uppercase tracking-widest"
            >
              <Send className="w-4 h-4 mr-2" />
              Gửi yêu cầu
            </button>
          </div>
        </form>
      </div>
    </div>
  , document.body);
}
