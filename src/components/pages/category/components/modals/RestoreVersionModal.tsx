import React, { ChangeEvent } from 'react';
import { RefreshCw, X, Send } from 'lucide-react';

interface RestoreVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  version: any;
  approvers: { id: string; name: string; position: string; department: string }[];
  selectedApprover: string;
  setSelectedApprover: (id: string) => void;
  note: string;
  setNote: (note: string) => void;
  onConfirm: () => void;
}

export function RestoreVersionModal({
  isOpen,
  onClose,
  version,
  approvers,
  selectedApprover,
  setSelectedApprover,
  note,
  setNote,
  onConfirm
}: RestoreVersionModalProps) {
  if (!isOpen || !version) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4" 
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[540px] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-[18px] font-bold text-slate-800">Phục hồi phiên bản</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg" title="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
               <RefreshCw className="w-8 h-8" />
            </div>
            <p className="text-slate-500 text-[13px]">
              Bạn đang yêu cầu phục hồi dữ liệu về phiên bản <span className="font-bold text-blue-600">v{version.version}</span> của <span className="font-bold text-slate-800">{version.category}</span>.
            </p>
          </div>

          <div className="space-y-4">
             <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Người phê duyệt phục hồi <span className="text-red-500">*</span></label>
                <select 
                  title="Người phê duyệt"
                  value={selectedApprover}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedApprover(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-[13px] focus:ring-2 focus:ring-blue-500"
                >
                   <option value="">-- Chọn người phê duyệt --</option>
                   {approvers.map(a => <option key={a.id} value={a.id}>{a.name} - {a.position}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Lý do phục hồi</label>
                <textarea 
                  rows={3}
                  value={note}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
                  placeholder="Nhập ghi chú hoặc lý do phục hồi phiên bản này..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-[13px] focus:ring-2 focus:ring-blue-500"
                />
             </div>
          </div>

          <div className="mt-8 flex gap-3">
             <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors">Hủy</button>
             <button
 onClick={onConfirm}
 className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
 >
                <Send className="w-4 h-4"/>
                Gửi yêu cầu
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
