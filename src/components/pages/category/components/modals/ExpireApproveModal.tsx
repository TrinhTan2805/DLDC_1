import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Database, KeySquare, Check, X } from 'lucide-react';
import { MasterDataEntity } from '../../categoryTypes';

interface ExpireApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
  onApprove: (reason: string) => void;
  onReject: (reason: string) => void;
}

export function ExpireApproveModal({
  isOpen,
  onClose,
  entity,
  onApprove,
  onReject
}: ExpireApproveModalProps) {
  const [checking, setChecking] = useState(true);
  const [checkResult, setCheckResult] = useState<'safe' | 'has_constraints' | null>(null);
  const [note, setNote] = useState('');

  // Mô phỏng tiến trình kiểm tra Foreign Key
  useEffect(() => {
    if (isOpen) {
      setChecking(true);
      setCheckResult(null);
      setNote('');
      const timer = setTimeout(() => {
        setChecking(false);
        // Random kết quả cho demo (80% an toàn)
        setCheckResult(Math.random() > 0.2 ? 'safe' : 'has_constraints');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, entity]);

  if (!isOpen || !entity) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 text-slate-800" style={{ zIndex: 99999 }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
           <h3 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
              <KeySquare className="w-5 h-5 text-purple-600" /> Phê duyệt hết hiệu lực
           </h3>
           <button title="Đóng" onClick={onClose} className="p-1.5 text-slate-400 hover:bg-white rounded-lg transition-colors">
              <X className="w-5 h-5" />
           </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
           <div className="text-center space-y-1">
              <h4 className="text-[18px] font-bold text-slate-900">{entity.name}</h4>
              <p className="text-slate-500 font-mono text-sm">{entity.code}</p>
           </div>

           {/* Check Container */}
           <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2 font-semibold text-slate-700 text-[14px]">
                 <Database className="w-4 h-4" /> Kiểm tra ràng buộc dữ liệu
              </div>
              <div className="p-5 flex flex-col items-center justify-center min-h-[120px] text-center">
                 {checking ? (
                    <div className="flex flex-col items-center gap-3">
                       <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                       <div className="text-sm font-medium text-slate-600 animate-pulse">
                         Đang truy vấn kiểm tra khóa ngoại (Foreign Key) trên các hệ thống tham chiếu...
                       </div>
                    </div>
                 ) : checkResult === 'safe' ? (
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-1">
                          <CheckCircle2 className="w-7 h-7 text-green-600" />
                       </div>
                       <h5 className="font-bold text-green-700 text-[15px]">Đủ điều kiện ngừng sử dụng</h5>
                       <p className="text-green-600/80 text-[13px]">Không phát hiện dữ liệu nào đang tham chiếu trực tiếp đến danh mục này.</p>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-1">
                          <XCircle className="w-7 h-7 text-red-600" />
                       </div>
                       <h5 className="font-bold text-red-700 text-[15px]">Cảnh báo ràng buộc toàn vẹn</h5>
                       <p className="text-red-600/80 text-[13px]">Phát hiện 124 bản ghi từ hệ thống CSDL Cán bộ đang tham chiếu. Yêu cầu xem xét kỹ năng trước khi duyệt.</p>
                    </div>
                 )}
              </div>
           </div>

           {/* Reason Input */}
           {!checking && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <label className="block text-[13px] font-semibold text-slate-700">Ý kiến phản hồi / Lý do (nếu từ chối)</label>
                 <textarea
                   title="Ghi chú thêm"
                   rows={3}
                   value={note}
                   onChange={(e: any) => setNote(e.target.value)}
                   placeholder="Nhập ghi chú hoặc lý do thay đổi..."
                   className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[14px] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none resize-none"
                 />
              </div>
           )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
           <button 
 onClick={onClose}
 className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[14px]"
 >
             Đóng
           </button>
           <div className="flex gap-2">
              <button 
 disabled={checking}
 onClick={() => onReject(note)}
 className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all text-[14px] disabled:opacity-50"
 >
 <XCircle className="w-4 h-4" /> Từ chối
 </button>
              <button 
 disabled={checking || checkResult === 'has_constraints'}
 onClick={() => onApprove(note)}
 className={`px-6 py-2.5 ${checkResult === 'has_constraints' ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200'} rounded-xl flex items-center justify-center gap-2 transition-all text-[14px]`}
 title={checkResult === 'has_constraints' ? 'Không thể phê duyệt do vướng ràng buộc khóa ngoại' : 'Phê duyệt hết hiệu lực'}
 >
 <Check className="w-4 h-4" /> Duyệt ngừng SD
 </button>
           </div>
        </div>
      </div>
    </div>
  );
}
