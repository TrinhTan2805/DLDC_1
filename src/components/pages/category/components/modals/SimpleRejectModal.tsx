import React, { ChangeEvent, useState } from 'react';
import { XCircle, AlertCircle, Info, ChevronRight, X } from 'lucide-react';
import { MasterDataEntity } from '../../categoryTypes';
import { Portal } from '../../../../common/Portal';

interface SimpleRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
  onConfirm: (reason: string) => void;
}

export function SimpleRejectModal({
  isOpen,
  onClose,
  entity,
  onConfirm
}: SimpleRejectModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen || !entity) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError(true);
      return;
    }
    onConfirm(reason);
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-slate-800">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-slate-800">Từ chối phê duyệt danh mục</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors" title="Đóng">
             <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Info Banner - Red/Pink */}
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-4">
             <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-lg border-2 border-red-600 flex items-center justify-center mt-0.5">
                   <ChevronRight className="w-3 h-3 text-red-600 stroke-[3]"/>
                </div>
                <div className="space-y-1">
                   <div className="text-[13px] text-red-700 font-medium uppercase tracking-tight">Thông tin danh mục</div>
                   <div className="text-[15px] font-bold text-red-900">{entity.name}</div>
                   <div className="text-[13px] text-red-600 font-mono">Mã: {entity.code}</div>
                   <div className="text-[13px] text-red-600">Lĩnh vực: {entity.managingAgency}</div>
                </div>
             </div>
          </div>

          {/* Input field */}
          <div className="space-y-2">
             <label className="block text-[14px] font-semibold text-slate-700">Lý do từ chối <span className="text-red-500">*</span></label>
             <textarea 
               rows={4}
               value={reason}
               onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  setReason(e.target.value);
                  if(e.target.value.trim()) setError(false);
               }}
               placeholder="Nhập lý do từ chối phê duyệt... Ví dụ: Danh mục chưa đầy đủ thông tin về cấu trúc dữ liệu. Đề nghị bổ sung các trường dữ liệu bắt buộc theo quy định."
               className={`w-full px-4 py-3 border rounded-xl bg-white text-[14px] focus:ring-2 transition-all outline-none ${
                  error ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
               }`}
             />
             {error && (
                <div className="text-[12px] text-red-500 flex items-center gap-1.5 mt-1 animate-in slide-in-from-top-1">
                   <AlertCircle className="w-4 h-4"/> Vui lòng nhập lý do từ chối
                </div>
             )}
          </div>

          {/* Warning Alert - Yellow */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
             <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"/>
             <div className="text-[13px] text-amber-800 font-medium">
                Sau khi từ chối, danh mục sẽ được trả lại cho đơn vị để chỉnh sửa và trình lại.
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-3 justify-end">
           <button 
 onClick={onClose}
 className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[14px]"
 >
              Hủy
           </button>
           <button 
 onClick={handleConfirm}
 className="px-6 py-2.5 bg-red-500 text-white rounded-xl flex items-center gap-2 hover:bg-red-600 transition-all text-[14px] shadow-lg shadow-red-100"
 >
              <XCircle className="w-5 h-5"/>
              Từ chối
           </button>
        </div>
      </div>
      </div>
    </Portal>
  );
}
