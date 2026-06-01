import React, { ChangeEvent, useState } from 'react';
import { Send, X, AlertTriangle, Info, CalendarClock, UserCheck } from 'lucide-react';
import { approvers } from '../../categoryConstants';

interface ExpireRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: {
    id: string;
    code: string;
    name: string;
  } | null;
  onSubmit: (data: { expireDate: string; reason: string; note: string; approver: string }) => void;
}

export function ExpireRequestModal({
  isOpen,
  onClose,
  entity,
  onSubmit
}: ExpireRequestModalProps) {
  const [formData, setFormData] = useState({
    expireDate: '',
    reason: '',
    note: '',
    approver: ''
  });

  if (!isOpen || !entity) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 text-slate-800" style={{ zIndex: 99999 }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="text-[16px] font-bold text-orange-800">Gửi yêu cầu Khóa / Ngừng sử dụng danh mục</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-white hover:text-slate-600 rounded-lg transition-colors" title="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3 text-sm text-orange-800">
            <Info className="w-5 h-5 shrink-0" />
            <p>
              Danh mục bị ngừng sử dụng sẽ <strong>không được dùng</strong> trong các quan hệ và truy vấn dữ liệu tham chiếu mới, nhưng vẫn được lưu trữ cho mục đích thống kê, tra cứu.
            </p>
          </div>

          <div className="space-y-4">
             <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1">Danh mục áp dụng</label>
                <div className="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-xl text-[14px] font-medium text-slate-900 flex justify-between">
                   <span>{entity.name}</span>
                   <span className="text-slate-500 font-mono">{entity.code}</span>
                </div>
             </div>

             <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1">Thời điểm hết hiệu lực <span className="text-red-500">*</span></label>
                <div className="relative">
                   <CalendarClock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                   <input 
                     title="Thời điểm hết hiệu lực"
                     type="date"
                     value={formData.expireDate}
                     onChange={(e: any) => setFormData({...formData, expireDate: e.target.value})}
                     className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-white text-[14px] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                   />
                </div>
             </div>

             <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1">Lý do ngừng sử dụng <span className="text-red-500">*</span></label>
                <select 
                   title="Lý do ngừng sử dụng"
                   value={formData.reason}
                   onChange={(e: any) => setFormData({...formData, reason: e.target.value})}
                   className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white text-[14px] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                >
                   <option value="">-- Chọn lý do --</option>
                   <option value="Tích hợp vào danh mục khác">Tích hợp vào danh mục khác</option>
                   <option value="Quy định pháp luật thay đổi">Pháp luật, Quyết định bổ sung thay đổi</option>
                   <option value="Dữ liệu lỗi, cấu trúc cũ">Cấu trúc dữ liệu cũ, không còn phù hợp</option>
                   <option value="Khác">Lý do khác...</option>
                </select>
             </div>

             <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1">Lãnh đạo phê duyệt <span className="text-red-500">*</span></label>
                <div className="relative">
                   <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                   <select 
                      title="Lãnh đạo phê duyệt"
                      value={formData.approver}
                      onChange={(e: any) => setFormData({...formData, approver: e.target.value})}
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-white text-[14px] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                   >
                      <option value="">-- Chọn lãnh đạo trình duyệt --</option>
                      {approvers.map(a => (
                        <option key={a.id} value={a.id}>{a.name} - {a.position} ({a.department})</option>
                      ))}
                   </select>
                </div>
             </div>

             <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1">Ghi chú thêm</label>
                <textarea 
                  title="Ghi chú thêm"
                  rows={3}
                  value={formData.note}
                  onChange={(e: any) => setFormData({...formData, note: e.target.value})}
                  placeholder="Nhập ghi chú chi tiết trình lãnh đạo..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[14px] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none"
                />
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-3 justify-end items-center">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[14px]"
          >
            Hủy
          </button>
          <button 
            onClick={() => onSubmit(formData)}
            disabled={!formData.expireDate || !formData.reason || !formData.approver}
            className="px-6 py-2.5 bg-orange-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-orange-700 transition-all text-[14px] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
          >
            <Send className="w-4 h-4" />
            Trình duyệt hết hiệu lực
          </button>
        </div>
      </div>
    </div>
  );
}
