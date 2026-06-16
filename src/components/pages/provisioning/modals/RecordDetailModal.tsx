import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface RecordDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordData: any;
  columns?: any[];
}

export function RecordDetailModal({ isOpen, onClose, recordData, columns }: RecordDetailModalProps) {
  if (!isOpen || !recordData) return null;

  const excludeKeys = ['id'];
  const entries = Object.entries(recordData || {}).filter(([k]) => !excludeKeys.includes(k));
  
  const getLabel = (key: string) => {
    const col = columns?.find(c => c.key === key);
    if (col) return col.label;
    
    // Capitalize and add spaces for camelCase if no label found
    const result = key.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  // Chia đôi mảng dữ liệu để làm 2 cột
  const half = Math.ceil(entries.length / 2);
  const leftColumn = entries.slice(0, half);
  const rightColumn = entries.slice(half);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Chi tiết bản ghi</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            <div className="space-y-4">
              {leftColumn.map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm font-bold text-slate-700 mb-1">{getLabel(key)}</p>
                  <p className="text-sm text-slate-900 break-words">{String(value)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {rightColumn.map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm font-bold text-slate-700 mb-1">{getLabel(key)}</p>
                  <p className="text-sm text-slate-900 break-words">{String(value)}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 flex items-center gap-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <X className="w-4 h-4" /> Đóng
          </button>
        </div>

      </div>
    </div>
  , document.body);
}
