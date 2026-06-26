import { useState } from 'react';
import { X, Save, Copy } from 'lucide-react';

interface CreateVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  currentVersion: string;
}

export function CreateVersionModal({ isOpen, onClose, onSave, currentVersion }: CreateVersionModalProps) {
  const [versionData, setVersionData] = useState({
    name: `${currentVersion} - Bản sao`,
    effectiveDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4" 
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Copy className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Tạo phiên bản mới</h3>
          </div>
          <button
            onClick={onClose}
            title="Đóng" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-sm text-blue-800">
              Hệ thống sẽ tạo một bản sao cấu trúc và nội dung hoàn chỉnh dựa trên phiên bản <span className="font-semibold">{currentVersion}</span> hiện tại. Bạn có thể thay đổi dữ liệu hoặc thay đổi cấu trúc bảng sau khi tạo bản sao độc lập.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mã/Tên Phiên Bản *</label>
              <input
                type="text"
                title="Tên phiên bản"
                value={versionData.name}
                onChange={(e) => setVersionData({ ...versionData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: V4.0 - Năm 2026"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ngày dự kiến hiệu lực *</label>
              <input
                type="date"
                title="Ngày hiệu lực"
                value={versionData.effectiveDate}
                onChange={(e) => setVersionData({ ...versionData, effectiveDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả lý do thay đổi</label>
              <textarea
                title="Mô tả"
                value={versionData.description}
                onChange={(e) => setVersionData({ ...versionData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Nhập lý do tạo phiên bản mới..."
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            title="Hủy" className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(versionData)}
            title="Lưu" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Tạo Bản Sao
          </button>
        </div>
      </div>
    </div>
  );
}
