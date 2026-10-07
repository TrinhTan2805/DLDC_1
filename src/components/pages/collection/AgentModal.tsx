import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS, LABEL_CLS, REQUIRED_MARK, SECTION_TITLE } from './collectionUi';

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingData?: any;
}

export function AgentModal({ isOpen, onClose, onSave, editingData }: AgentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
    callCycle: '',
    fileAgentId: '',
    fileAgentUrl: ''
  });

  useEffect(() => {
    if (editingData) {
      setFormData({
        name: editingData.name || '',
        status: editingData.status || 'active',
        callCycle: editingData.callCycle?.toString() || '',
        fileAgentId: editingData.fileAgent?.id || '',
        fileAgentUrl: editingData.fileAgent?.url || ''
      });
    } else {
      setFormData({
        name: '',
        status: 'active',
        callCycle: '',
        fileAgentId: '',
        fileAgentUrl: ''
      });
    }
  }, [editingData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="agent-modal-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
          <h2 id="agent-modal-title" className="text-[16px] font-medium text-[#020817]">
            {editingData ? 'Cập nhật trạm kết nối' : 'Thêm trạm kết nối'}
          </h2>
          <button type="button" onClick={onClose} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
          <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-4">
            {/* Tên agent */}
            <div>
              <label className={LABEL_CLS}>
                Tên trạm kết nối <span className={REQUIRED_MARK}>*</span>
              </label>
              <input
                type="text"
                placeholder="Tên trạm kết nối"
                required
                className={INPUT_CLS}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Trạng thái agent */}
            <div>
              <label className={LABEL_CLS}>
                Trạng thái trạm kết nối <span className={REQUIRED_MARK}>*</span>
              </label>
              <select
                aria-label="Trạng thái trạm kết nối"
                className={INPUT_CLS}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Kích hoạt</option>
                <option value="inactive">Không kích hoạt</option>
              </select>
            </div>

            {/* Chu kỳ gọi */}
            <div>
              <label className={LABEL_CLS}>
                Chu kỳ gọi (giây) <span className={REQUIRED_MARK}>*</span>
              </label>
              <input
                type="number"
                placeholder="Chu kỳ gọi"
                required
                className={INPUT_CLS}
                value={formData.callCycle}
                onChange={(e) => setFormData({ ...formData, callCycle: e.target.value })}
              />
            </div>

            {/* DIP - File Agent Section */}
            <div className="rounded-2xl border border-[#E2E8F0] p-4">
              <h3 className={SECTION_TITLE}>
                <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                DIP - File Trạm kết nối
              </h3>

              <div className="space-y-4">
                <div>
                  <label className={LABEL_CLS}>ID</label>
                  <input
                    type="text"
                    placeholder="Example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className={INPUT_CLS}
                    value={formData.fileAgentId}
                    onChange={(e) => setFormData({ ...formData, fileAgentId: e.target.value })}
                  />
                </div>

                <div>
                  <label className={LABEL_CLS}>URL</label>
                  <input
                    type="text"
                    placeholder="Example: http://127.0.0.1:1201"
                    className={INPUT_CLS}
                    value={formData.fileAgentUrl}
                    onChange={(e) => setFormData({ ...formData, fileAgentUrl: e.target.value })}
                  />
                </div>

                <div className="flex justify-end">
                  <button type="button" className={BTN_OUTLINE}>
                    Kiểm tra kết nối
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
            <button type="button" onClick={onClose} className={BTN_OUTLINE}>
              Đóng
            </button>
            <button type="submit" className={BTN_PRIMARY}>
              {editingData ? 'Cập nhật' : 'Thêm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
