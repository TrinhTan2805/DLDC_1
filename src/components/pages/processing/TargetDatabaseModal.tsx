import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Database, Shield } from 'lucide-react';
import { TargetDatabase } from './mockTargetDatabases';

interface TargetDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<TargetDatabase, 'id'>) => void;
  editingData?: TargetDatabase | null;
}

export function TargetDatabaseModal({ isOpen, onClose, onSave, editingData }: TargetDatabaseModalProps) {
  const [formData, setFormData] = useState<Omit<TargetDatabase, 'id' | 'status'>>({
    name: '',
    type: '',
    host: '',
    port: '',
    username: '',
    schema: '',
    note: ''
  });
  
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (editingData) {
      setFormData({
        name: editingData.name,
        type: editingData.type,
        host: editingData.host,
        port: editingData.port,
        username: editingData.username,
        schema: editingData.schema,
        note: editingData.note
      });
      setPassword('********'); // Placeholder for password
    } else {
      setFormData({
        name: '',
        type: '',
        host: '',
        port: '',
        username: '',
        schema: '',
        note: ''
      });
      setPassword('');
    }
  }, [editingData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, status: editingData?.status || 'active' });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px', zIndex: 999999 }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {editingData ? 'Cập nhật kết nối CSDL' : 'Thêm kết nối CSDL mới'}
              </h2>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">Thông tin kết nối hệ thống</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="target-db-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              {/* Tên kết nối */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                  Tên kết nối <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                  placeholder="Ví dụ: CSDL Kho dữ liệu dùng chung"
                />
              </div>

              {/* Loại CSDL */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Loại CSDL <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 appearance-none"
                >
                  <option value="">-- Chọn loại CSDL --</option>
                  <option value="Oracle">Oracle Database</option>
                  <option value="PostgreSQL">PostgreSQL</option>
                  <option value="MySQL">MySQL</option>
                  <option value="SQL Server">Microsoft SQL Server</option>
                  <option value="MongoDB">MongoDB</option>
                </select>
              </div>

              {/* Tên Schema/Database */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Tên Schema/Database <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.schema}
                  onChange={(e) => setFormData({ ...formData, schema: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                  placeholder="Ví dụ: public, main_db"
                />
              </div>

              {/* Host/IP */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Host / IP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                  placeholder="10.15.20.XXX"
                />
              </div>

              {/* Port */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Port <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                  placeholder="Ví dụ: 5432, 1521"
                />
              </div>

              {/* Tên đăng nhập */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                    placeholder="Nhập username"
                  />
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                  placeholder="••••••••"
                />
              </div>

              {/* Ghi chú */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Ghi chú
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 resize-none"
                  placeholder="Nhập ghi chú thêm nếu có..."
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/30">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="target-db-form"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {editingData ? 'Cập nhật thay đổi' : 'Lưu kết nối'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
