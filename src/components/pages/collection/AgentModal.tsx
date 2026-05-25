import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-lg">
            <h2 className="text-lg font-semibold text-slate-800">
              {editingData ? 'Sửa thông tin trạm kết nối' : 'Thêm mới trạm kết nối'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              {/* Tên agent */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Tên trạm kết nối <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Tên trạm kết nối"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[13px]"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Trạng thái agent */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Trạng thái trạm kết nối <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-[13px]"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Kích hoạt</option>
                  <option value="inactive">Không kích hoạt</option>
                </select>
              </div>

              {/* Chu kỳ gọi */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Chu kỳ gọi (giây) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Chu kỳ gọi"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[13px]"
                  value={formData.callCycle}
                  onChange={(e) => setFormData({ ...formData, callCycle: e.target.value })}
                />
              </div>

              {/* DIP - File Agent Section */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/30">
                <h3 className="text-[13px] font-semibold text-slate-800 mb-4 uppercase tracking-wider">DIP - File Trạm kết nối</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="w-12 text-[13px] font-medium text-slate-700">ID</label>
                    <input
                      type="text"
                      placeholder="Example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-[13px]"
                      value={formData.fileAgentId}
                      onChange={(e) => setFormData({ ...formData, fileAgentId: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-12 text-[13px] font-medium text-slate-700">URL</label>
                    <input
                      type="text"
                      placeholder="Example: http://127.0.0.1:1201"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-[13px]"
                      value={formData.fileAgentUrl}
                      onChange={(e) => setFormData({ ...formData, fileAgentUrl: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-[13px] font-medium hover:bg-slate-100 transition-colors shadow-sm bg-white"
                    >
                      Kiểm tra kết nối
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 bg-white font-medium text-[13px] shadow-sm transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-[13px] shadow-sm transition-colors"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
