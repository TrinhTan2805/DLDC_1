import React, { ReactNode, MouseEvent, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Portal } from './Portal';
import { BTN_GHOST_ICON } from '../pages/collection/collectionUi';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
  customHeaderIcon?: ReactNode;
  headerActions?: ReactNode;
  className?: string;
}

/**
 * Universal Base Modal component for the entire project.
 * Provides consistent Header, Footer, Scrolling, and Animations.
 * Designed with backdrop-blur-sm and zoom-in effects for a premium feel.
 */
export function BaseModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-2xl',
  showCloseButton = true,
  customHeaderIcon,
  headerActions,
  className = ''
}: BaseModalProps) {
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

  const currentZIndex = 9000 + modalIndex * 10;

  return (
    <Portal>
      <div 
        className="fixed inset-0 flex items-center justify-center p-4 animate-in fade-in duration-200"
        style={{ 
          zIndex: currentZIndex,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <div 
          className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ease-out ${className}`}
          onClick={(e: MouseEvent) => e.stopPropagation()}
        >
          {/* Header (compomennt.md 5.4): tiêu đề 16px/500 #020817, phụ đề 13px #64748B, viền dưới #E2E8F0, nút X kiểu ghost */}
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4 bg-white sticky top-0 z-10">
            <div className="flex items-center min-w-0">
              {customHeaderIcon}
              <div className="min-w-0">
                <h3 className="text-[16px] font-semibold text-[#020817] leading-6">{title}</h3>
                {subtitle && <p className="text-[13px] text-[#64748B] mt-0.5 leading-5">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {headerActions}
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className={BTN_GHOST_ICON}
                  aria-label="Đóng"
                  title="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
            {children}
          </div>

          {/* Modal Footer (Sticky) */}
          {footer && (
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 sticky bottom-0 z-10">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}
