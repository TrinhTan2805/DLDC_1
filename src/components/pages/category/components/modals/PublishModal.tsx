import React, { ChangeEvent } from 'react';
import { Share2, X } from 'lucide-react';
import { MasterDataEntity } from '../../categoryTypes';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
  note: string;
  setNote: (note: string) => void;
  onConfirm: () => void;
}

export function PublishModal({
  isOpen,
  onClose,
  entity,
  note,
  setNote,
  onConfirm
}: PublishModalProps) {
  if (!isOpen || !entity) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4" style={{ zIndex: 99999 }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-[18px] font-bold text-slate-800">Cấu hình công khai danh mục</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg" title="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-y-2 text-[13px]">
              <span className="text-slate-500">Danh mục:</span>
              <span className="font-bold text-slate-800 text-right">{entity.name}</span>
              <span className="text-slate-500">Mã thực thể:</span>
              <span className="font-mono text-blue-600 text-right">{entity.code}</span>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-slate-700 mb-2">Ghi chú công khai <span className="text-red-500">*</span></label>
            <textarea
              rows={3}
              value={note}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
              placeholder="Nhập ghi chú hoặc lý do công khai phiên bản này..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-[13px]"
            />
          </div>
          <button
 onClick={onConfirm}
 className="w-full py-3 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
 >
            <Share2 className="w-5 h-5" />
            Xác nhận công khai
          </button>
        </div>
      </div>
    </div>
  );
}
