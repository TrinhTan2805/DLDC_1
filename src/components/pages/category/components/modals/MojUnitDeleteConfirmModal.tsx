import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface MojUnitDeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  unitName: string;
}

export function MojUnitDeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  unitName
}: MojUnitDeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4 font-sans" 
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden border border-slate-200" 
        style={{ fontSize: '13px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-slate-900">Xác nhận xóa</h2>
          </div>
          <button
            onClick={onClose}
            title="Đóng"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 border border-red-100">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-[13px] text-slate-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa đơn vị{' '}
                <span className="font-semibold text-slate-900">{unitName || 'này'}</span> không?
              </p>
              <p className="text-[12px] text-slate-400">
                Hành động này không thể hoàn tác và dữ liệu liên quan sẽ bị ảnh hưởng.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/20">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-[13px] font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
}
