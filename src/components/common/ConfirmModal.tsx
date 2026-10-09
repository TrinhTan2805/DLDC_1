import * as React from 'react';
import { useState, useEffect, ReactNode } from 'react';
import { Trash2, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import { Portal } from './Portal';
import { BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON } from '../pages/collection/collectionUi';

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

// Màu theo bảng màu compomennt.md (mục 2). delete/warning là thao tác nguy hiểm → nút Destructive;
// info/success → nút Primary (mục 5.1).
const typeConfig = {
  delete: { icon: Trash2, iconTone: 'bg-[#FEF2F2] text-[#DC2626]', confirmCls: BTN_DESTRUCTIVE },
  warning: { icon: AlertTriangle, iconTone: 'bg-[#FFF7ED] text-[#D97706]', confirmCls: BTN_DESTRUCTIVE },
  info: { icon: Info, iconTone: 'bg-[#EAF3FF] text-[#155DFC]', confirmCls: BTN_PRIMARY },
  success: { icon: CheckCircle2, iconTone: 'bg-[#F0FDF4] text-[#16A34A]', confirmCls: BTN_PRIMARY },
};

/**
 * Hộp thoại xác nhận dùng chung — theo compomennt.md mục 5.4:
 * nền mờ 50%, khung bo 16px, header (tiêu đề 16px/500 + nút X), thân 13px, chân nền #F8FAFC nút căn phải.
 * Modal chồng nhau: mỗi modal mở sau có lớp nền riêng (z-index tăng dần theo thứ tự mở).
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
  const [modalIndex, setModalIndex] = useState(1);

  useEffect(() => {
    if (!isOpen) return;
    if (typeof window !== 'undefined') {
      window.__activeModalsCount = (window.__activeModalsCount || 0) + 1;
      setModalIndex(window.__activeModalsCount);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.__activeModalsCount = Math.max(0, (window.__activeModalsCount || 0) - 1);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const config = typeConfig[type] || typeConfig.delete;
  const Icon = config.icon;

  // Giữ thang z-index riêng để luôn nằm trên các modal khác đang mở (mục 5.4 – modal chồng nhau)
  const currentZIndex = 9100 + modalIndex * 10;

  return (
    <Portal>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        style={{ zIndex: currentZIndex }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header: icon + tiêu đề 16px/500 + phụ đề, nút X góc phải */}
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-start gap-3">
            <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${config.iconTone}`}>
              <Icon className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 id="confirm-modal-title" className="text-[16px] font-semibold text-[#020817] leading-6">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[13px] text-[#64748B] mt-0.5 leading-5">{subtitle}</p>
              )}
            </div>
            <button type="button" onClick={onClose} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Thân: nội dung 13px */}
          {message && (
            <div className="px-6 py-4">
              <div className="bg-[#F8FAFC] rounded-lg p-4 text-[13px] text-[#020817] leading-5 border border-[#E2E8F0]">
                {message}
              </div>
            </div>
          )}

          {/* Chân: nền #F8FAFC, nút căn phải (Hủy → Xác nhận) */}
          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
            <button type="button" onClick={onClose} className={BTN_OUTLINE}>
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={config.confirmCls}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
