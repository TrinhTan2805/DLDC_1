import React, { ChangeEvent, useState } from 'react';
import { CheckCircle2, ChevronRight, X } from 'lucide-react';
import { MasterDataEntity } from '../../categoryTypes';
import { Portal } from '../../../../common/Portal';

interface SimpleApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
  onConfirm: (note: string) => void;
}

export function SimpleApproveModal({
  isOpen,
  onClose,
  entity,
  onConfirm
}: SimpleApproveModalProps) {
  const [note, setNote] = useState('');

  if (!isOpen || !entity) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-slate-800">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-slate-800">Phê duyệt danh mục dữ liệu mở</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors" title="Đóng">
             <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
             <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-lg border-2 border-blue-600 flex items-center justify-center mt-0.5">
                   <ChevronRight className="w-3 h-3 text-blue-600 stroke-[3]"/>
                </div>
                <div className="space-y-1">
                   <div className="text-[13px] text-blue-700 font-medium uppercase tracking-tight">Thông tin danh mục</div>
                   <div className="text-[15px] font-bold text-blue-900">{entity.name}</div>
                   <div className="text-[13px] text-blue-600 font-mono">Mã: {entity.code}</div>
                   <div className="text-[13px] text-blue-600">Lĩnh vực: {entity.managingAgency}</div>
                </div>
             </div>
          </div>

          {/* Input field */}
          <div className="space-y-2">
             <label className="block text-[14px] font-semibold text-slate-700">Ý kiến phê duyệt</label>
             <textarea 
               rows={4}
               value={note}
               onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
               placeholder="Nhập ý kiến phê duyệt (nếu có)... Ví dụ: Đồng ý phê duyệt danh mục dữ liệu mở theo đề xuất của đơn vị."
               className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[14px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
             />
          </div>

          {/* Post-Approval Info */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 mt-2">
             <div className="text-[13px] text-slate-600 space-y-1.5">
                <div className="font-medium text-slate-700">Sau khi phê duyệt:</div>
                <div className="flex items-start gap-2">
                   <span className="text-slate-400">•</span>
                   <span>Danh mục sẽ được công bố trên Cổng dữ liệu mở quốc gia</span>
                </div>
                <div className="flex items-start gap-2">
                   <span className="text-slate-400">•</span>
                   <span>Dữ liệu sẽ được đồng bộ và cập nhật định kỳ theo tần suất đã thiết lập</span>
                </div>
                <div className="flex items-start gap-2">
                   <span className="text-slate-400">•</span>
                   <span>Các cơ quan, tổ chức và công dân có thể truy cập và tải xuống dữ liệu</span>
                </div>
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
 onClick={() => onConfirm(note)}
 className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl flex items-center gap-2 hover:bg-emerald-600 transition-all text-[14px] shadow-lg shadow-emerald-100"
 >
 <CheckCircle2 className="w-5 h-5"/>
 Phê duyệt
 </button>
        </div>
      </div>
      </div>
    </Portal>
  );
}
