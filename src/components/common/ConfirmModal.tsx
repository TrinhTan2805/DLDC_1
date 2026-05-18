import * as React from 'react';
import { ReactNode } from 'react';
import { Trash2, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Portal } from './Portal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  subtitle?: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: 'delete' | 'warning' | 'info' | 'success';
}

const typeConfig = {
  delete: {
    icon: Trash2,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-50',
    confirmBg: 'bg-red-600 hover:bg-red-700'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    confirmBg: 'bg-red-600 hover:bg-red-700'
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    confirmBg: 'bg-blue-600 hover:bg-blue-700'
  },
  success: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    confirmBg: 'bg-blue-600 hover:bg-blue-700'
  }
};

/**
 * ConfirmModal chuẩn bộ thẻ giao diện mới theo hình ảnh yêu cầu.
 * Sử dụng 100% Core Tailwind Classes để tránh JIT compiler lỗi dãn màn hình.
 */
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  subtitle = 'Hành động này không thể hoàn tác',
  message,
  confirmText = 'Xác nhận xóa',
  cancelText = 'Hủy',
  type = 'delete'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const config = typeConfig[type] || typeConfig.delete;
  const Icon = config.icon;

  return (
    <Portal>
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
           // Fallback chắc chắn 100% không bị giãn
          onClick={(e: any) => e.stopPropagation()}
        >
          <div className="p-6">
            
            {/* Top Section: Icon & Headers */}
            <div className="flex items-start gap-4 mb-5">
              <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${config.iconBg} ${config.iconColor}`}>
                <Icon className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="pt-1">
                <h3 className="text-lg font-bold text-slate-800 leading-snug">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Middle Section: Grey Box Details */}
            {message && (
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed min-h-20 border border-slate-100">
                {message}
              </div>
            )}

            {/* Bottom Section: Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-white text-[#020817] rounded-[6px] hover:bg-slate-50 transition-colors text-base border border-[#e2e8f0] font-medium shadow-sm"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 py-2.5 ${config.confirmBg} text-white rounded-lg transition-colors text-base shadow-sm font-medium`}
              >
                {confirmText}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </Portal>
  );
}
