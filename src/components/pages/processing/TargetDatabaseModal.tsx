import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Shield } from 'lucide-react';
import { TargetDatabase } from './mockTargetDatabases';
import { BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS, LABEL_CLS, REQUIRED_MARK } from '../collection/collectionUi';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
      <div role="dialog" aria-modal="true" aria-labelledby="target-db-modal-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header (compomennt.md 5.4) */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-start justify-between gap-3 bg-white">
          <div className="min-w-0">
            <h2 id="target-db-modal-title" className="text-[16px] font-medium text-[#020817] leading-6">
              {editingData ? 'Cập nhật kết nối CSDL' : 'Thêm kết nối CSDL mới'}
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">Thông tin kết nối hệ thống</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            title="Đóng"
            className={BTN_GHOST_ICON}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
          <form id="target-db-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {/* Tên kết nối */}
              <div className="col-span-2">
                <label htmlFor="tdb-name" className={LABEL_CLS}>
                  Tên kết nối <span className={REQUIRED_MARK}>*</span>
                </label>
                <input
                  id="tdb-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={INPUT_CLS}
                  placeholder="Ví dụ: CSDL Kho dữ liệu dùng chung"
                />
              </div>

              {/* Loại CSDL */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="tdb-type" className={LABEL_CLS}>
                  Loại CSDL <span className={REQUIRED_MARK}>*</span>
                </label>
                <select
                  id="tdb-type"
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={INPUT_CLS}
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
                <label htmlFor="tdb-schema" className={LABEL_CLS}>
                  Tên Schema/Database <span className={REQUIRED_MARK}>*</span>
                </label>
                <input
                  id="tdb-schema"
                  type="text"
                  required
                  value={formData.schema}
                  onChange={(e) => setFormData({ ...formData, schema: e.target.value })}
                  className={INPUT_CLS}
                  placeholder="Ví dụ: public, main_db"
                />
              </div>

              {/* Host/IP */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="tdb-host" className={LABEL_CLS}>
                  Host / IP <span className={REQUIRED_MARK}>*</span>
                </label>
                <input
                  id="tdb-host"
                  type="text"
                  required
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  className={INPUT_CLS}
                  placeholder="10.15.20.XXX"
                />
              </div>

              {/* Port */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="tdb-port" className={LABEL_CLS}>
                  Port <span className={REQUIRED_MARK}>*</span>
                </label>
                <input
                  id="tdb-port"
                  type="text"
                  required
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  className={INPUT_CLS}
                  placeholder="Ví dụ: 5432, 1521"
                />
              </div>

              {/* Tên đăng nhập */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="tdb-username" className={LABEL_CLS}>
                  Tên đăng nhập <span className={REQUIRED_MARK}>*</span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                  <input
                    id="tdb-username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={`${INPUT_CLS} pl-9`}
                    placeholder="Nhập username"
                  />
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="tdb-password" className={LABEL_CLS}>
                  Mật khẩu <span className={REQUIRED_MARK}>*</span>
                </label>
                <input
                  id="tdb-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={INPUT_CLS}
                  placeholder="••••••••"
                />
              </div>

              {/* Ghi chú */}
              <div className="col-span-2">
                <label htmlFor="tdb-note" className={LABEL_CLS}>
                  Ghi chú
                </label>
                <textarea
                  id="tdb-note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows={3}
                  className={`${INPUT_CLS} h-auto py-2 resize-none`}
                  placeholder="Nhập ghi chú thêm nếu có..."
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className={BTN_OUTLINE}
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="target-db-form"
            className={BTN_PRIMARY}
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
