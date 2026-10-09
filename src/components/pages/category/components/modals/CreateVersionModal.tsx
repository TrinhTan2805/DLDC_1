import { useState } from 'react';
import { X, Save, Copy } from 'lucide-react';
import { BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS, LABEL_CLS, REQUIRED_MARK } from '../../../collection/collectionUi';

const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EAF3FF] flex items-center justify-center text-[#155DFC]">
              <Copy className="w-5 h-5" />
            </div>
            <h3 className="text-[16px] font-semibold text-[#020817]">Tạo phiên bản mới</h3>
          </div>
          <button
            onClick={onClose}
            title="Đóng"
            aria-label="Đóng"
            className={BTN_GHOST_ICON}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-4">
          <div className="p-3 bg-[#EAF3FF] border border-[#BFDBFE] rounded-lg">
            <p className="text-[13px] text-[#020817]">
              Hệ thống sẽ tạo một bản sao cấu trúc và nội dung hoàn chỉnh dựa trên phiên bản <span className="font-medium">{currentVersion}</span> hiện tại. Bạn có thể thay đổi dữ liệu hoặc thay đổi cấu trúc bảng sau khi tạo bản sao độc lập.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className={LABEL_CLS}>Mã/Tên Phiên Bản <span className={REQUIRED_MARK}>*</span></label>
              <input
                type="text"
                title="Tên phiên bản"
                value={versionData.name}
                onChange={(e) => setVersionData({ ...versionData, name: e.target.value })}
                className={INPUT_CLS}
                placeholder="Ví dụ: V4.0 - Năm 2026"
              />
            </div>
            
            <div>
              <label className={LABEL_CLS}>Ngày dự kiến hiệu lực <span className={REQUIRED_MARK}>*</span></label>
              <input
                type="date"
                title="Ngày hiệu lực"
                value={versionData.effectiveDate}
                onChange={(e) => setVersionData({ ...versionData, effectiveDate: e.target.value })}
                className={INPUT_CLS}
              />
            </div>

            <div>
              <label className={LABEL_CLS}>Mô tả lý do thay đổi</label>
              <textarea
                title="Mô tả"
                value={versionData.description}
                onChange={(e) => setVersionData({ ...versionData, description: e.target.value })}
                rows={3}
                className={TEXTAREA_CLS}
                placeholder="Nhập lý do tạo phiên bản mới..."
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            title="Hủy" className={BTN_OUTLINE}
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(versionData)}
            title="Lưu" className={BTN_PRIMARY}
          >
            <Save className="w-4 h-4" />
            Tạo Bản Sao
          </button>
        </div>
      </div>
    </div>
  );
}
