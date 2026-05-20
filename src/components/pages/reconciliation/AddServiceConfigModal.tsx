import { X, CheckCircle, Send, Calendar, HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface ReconciliationApiConfigFormData {
  systemName: string;
  systemCode: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  authType: string;
}

interface AddServiceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  initialData?: ReconciliationApiConfigFormData | null;
  onSave?: (data: ReconciliationApiConfigFormData) => void;
}

export function AddServiceConfigModal({ isOpen, onClose, isEdit, initialData, onSave }: AddServiceConfigModalProps) {
  const [formData, setFormData] = useState<ReconciliationApiConfigFormData>({
    systemName: '',
    systemCode: '',
    endpoint: '',
    method: 'POST',
    authType: 'API Key',
  });

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setFormData(initialData);
      return;
    }
    setFormData({
      systemName: '',
      systemCode: '',
      endpoint: '',
      method: 'POST',
      authType: 'API Key',
    });
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.systemName.trim() || !formData.systemCode.trim() || !formData.endpoint.trim()) {
      return;
    }
    onSave?.(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between">
          <div>
            <h2 className="text-lg text-slate-900">{isEdit ? 'Chỉnh sửa cấu hình đối soát' : 'Tạo gói tin đối soát qua LGSP'}</h2>
            <p className="text-sm text-slate-500 mt-1">Cấu hình gói tin gửi tin đối soát qua Cổng LGSP</p>
          </div>
          <button onClick={onClose} title="Đóng" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm text-slate-900">Thông tin chung</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-2">Hệ thống gửi (A)</label>
                <select
                  title="Hệ thống gửi"
                  value={formData.systemName}
                  onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Chọn hệ thống --</option>
                  <option value="Hệ thống Hộ tịch điện tử">Hệ thống Hộ tịch điện tử</option>
                  <option value="Hệ thống Đăng ký kinh doanh">Hệ thống Đăng ký kinh doanh</option>
                  <option value="Hệ thống Công chứng">Hệ thống Công chứng</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">Mã dịch vụ LGSP</label>
                <input
                  type="text"
                  value={formData.systemCode}
                  onChange={(e) => setFormData({ ...formData, systemCode: e.target.value })}
                  placeholder="VD: LGSP_RECONCILE_001"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm text-slate-900">Thông tin kỹ thuật LGSP</h3>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Endpoint LGSP</label>
              <input
                type="text"
                value={formData.endpoint}
                onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                placeholder="https://lgsp.gov.vn/api/reconciliation"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-2">Phương thức</label>
                <select
                  title="Phương thức"
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value as ReconciliationApiConfigFormData['method'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">Cơ chế xác thực</label>
                <select
                  title="Cơ chế xác thực"
                  value={formData.authType}
                  onChange={(e) => setFormData({ ...formData, authType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="API Key">API Key</option>
                  <option value="OAuth 2.0">OAuth 2.0</option>
                  <option value="JWT Token">JWT Token</option>
                  <option value="Chữ ký số">Chữ ký số</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4" />
              Kiểm tra kết nối
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm">
              <Send className="w-4 h-4" />
              Gửi thử
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              Xem lịch
            </button>
            <HelpCircle className="w-4 h-4 text-slate-300" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 text-sm">
              Hủy
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm">
              {isEdit ? 'Cập nhật cấu hình' : 'Lưu cấu hình'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
