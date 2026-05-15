import React, { ReactNode, MouseEvent } from 'react';
import { X } from 'lucide-react';
import { Portal } from './Portal';

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
  headerActions
}: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        style={{ 
          zIndex: 999999999,
          backdropFilter: 'blur(4px)', 
          WebkitBackdropFilter: 'blur(4px)' 
        }}
        onClick={onClose}
      >
        <div 
          className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ease-out`}
          onClick={(e: MouseEvent) => e.stopPropagation()}
        >
          {/* Header Section */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm shadow-slate-900/5">
            <div className="flex items-center">
              {customHeaderIcon}
              <div>
                <h3 className="font-bold text-slate-800 leading-tight" style={{ fontSize: '20px' }}>{title}</h3>
                {subtitle && <p className="text-[12px] text-slate-500 mt-1 font-medium">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {headerActions}
              {showCloseButton && (
                <button 
                  type="button"
                  onClick={onClose}
                  className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all active:scale-95 group"
                  title="Đóng"
                >
                  <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
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
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 sticky bottom-0 z-10">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}
