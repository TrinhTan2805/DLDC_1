import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { MasterDataEntity } from '../../categoryTypes';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  entity,
  onConfirm
}: DeleteConfirmModalProps) {
  if (!isOpen || !entity) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4" 
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa</h3>
          <p className="text-slate-500 text-sm mb-6">
            Bạn có chắc chắn muốn xóa danh mục <span className="font-bold text-slate-800">"{entity.name}"</span>? 
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
 onClick={onConfirm}
 className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
 >
              Xác nhận xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
