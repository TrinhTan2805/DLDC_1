import React, { useState, useEffect } from 'react';
import { X, Wifi } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between text-white">
          <h2 className="text-xl font-bold">{editingData ? 'Cập nhật trạm kết nối' : 'Thêm trạm kết nối'}</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Tên agent */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Tên trạm kết nối<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Tên trạm kết nối"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Trạng thái agent */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Trạng thái trạm kết nối<span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Kích hoạt</option>
                <option value="inactive">Không kích hoạt</option>
              </select>
            </div>

            {/* Chu kỳ gọi */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Chu kỳ gọi (giây)<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Chu kỳ gọi"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={formData.callCycle}
                onChange={(e) => setFormData({ ...formData, callCycle: e.target.value })}
              />
            </div>

            {/* DIP - File Agent Section */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/30">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">DIP - File Trạm kết nối</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="w-12 text-sm font-bold text-slate-700">ID</label>
                  <input
                    type="text"
                    placeholder="Example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    value={formData.fileAgentId}
                    onChange={(e) => setFormData({ ...formData, fileAgentId: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-12 text-sm font-bold text-slate-700">URL</label>
                  <input
                    type="text"
                    placeholder="Example: http://127.0.0.1:1201"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    value={formData.fileAgentUrl}
                    onChange={(e) => setFormData({ ...formData, fileAgentUrl: e.target.value })}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 border border-slate-400 text-slate-600 rounded text-sm font-medium hover:bg-slate-100 transition-colors"
                  >
                    Check Connection
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              {editingData ? 'Cập nhật' : 'Thêm'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-600 text-white rounded font-bold hover:bg-slate-700 transition-colors shadow-sm"
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
