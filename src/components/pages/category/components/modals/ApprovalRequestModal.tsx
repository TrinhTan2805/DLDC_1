import React, { ChangeEvent } from 'react';
import { Send, X } from 'lucide-react';
import { Portal } from '../../../../common/Portal';


interface ApprovalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: string;
    code: string;
    name: string;
    type: 'attribute' | 'category';
  } | null;
  approvers: { id: string; name: string; position: string; department: string }[];
  form: { reviewer: string; note: string };
  setForm: (form: { reviewer: string; note: string }) => void;
  onSubmit: () => void;
}

export function ApprovalRequestModal({
  isOpen,
  onClose,
  data,
  approvers,
  form,
  setForm,
  onSubmit
}: ApprovalRequestModalProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-slate-800">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
           <h3 className="text-[18px] font-bold text-slate-800">Trình duyệt danh mục</h3>
           <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors" title="Đóng">
              <X className="w-5 h-5"/>
           </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Info Banner */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
             <div className="space-y-3">
                <div className="flex justify-between items-start">
                   <span className="text-[14px] text-slate-500">Danh mục</span>
                   <span className="text-[15px] font-bold text-slate-900 text-right">{data?.name || 'Danh mục dữ liệu B'}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                   <span className="text-slate-500">Mã: {data?.code || 'ODC002'}</span>
                </div>
             </div>
          </div>

          <div className="space-y-4">
             {/* Approver Select */}
             <div className="space-y-1.5">
                <label className="block text-[14px] font-semibold text-slate-700">Người phê duyệt <span className="text-red-500">*</span></label>
                <select 
                  title="Người phê duyệt"
                  value={form.reviewer}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({...form, reviewer: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-[14px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                >
                   <option value="">-- Chọn người phê duyệt --</option>
                   {approvers.map(a => <option key={a.id} value={a.id}>{a.name} - {a.position}</option>)}
                </select>
             </div>

             {/* Content Textarea */}
             <div className="space-y-1.5">
                <label className="block text-[14px] font-semibold text-slate-700">Nội dung trình duyệt</label>
                <textarea 
                  rows={4}
                  value={form.note}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({...form, note: e.target.value})}
                  placeholder="Nhập nội dung trình duyệt... Ví dụ: Đề nghị Lãnh đạo xem xét phê duyệt danh mục dữ liệu mở theo Nghị định 47/2020/NĐ-CP"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[14px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-3 justify-end items-center">
           <button 
 onClick={onClose}
 className="px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[14px]"
 >
              Hủy
           </button>
           <button 
 onClick={onSubmit}
 className="px-6 py-2.5 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all text-[14px] shadow-lg shadow-blue-200"
 >
              <Send className="w-5 h-5 rotate-[-20deg]"/>
              Gửi trình duyệt
           </button>
        </div>
      </div>
      </div>
    </Portal>
  );
}

