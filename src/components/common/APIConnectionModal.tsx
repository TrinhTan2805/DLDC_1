import { X, Save } from 'lucide-react';
import { useState } from 'react';

interface APIConnection {
  id?: number;
  name: string;
  endpoint: string;
  method: string;
  authType: string;
  apiKey?: string;
  username?: string;
  password?: string;
  description?: string;
  isActive: boolean;
}

interface APIConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: APIConnection) => void;
  data?: APIConnection;
  mode: 'add' | 'edit' | 'view';
}

export function APIConnectionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  data,
  mode 
}: APIConnectionModalProps) {
  const [formData, setFormData] = useState<APIConnection>(data || {
    name: '',
    endpoint: '',
    method: 'GET',
    authType: 'API Key',
    apiKey: '',
    username: '',
    password: '',
    description: '',
    isActive: true
  });

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const title = mode === 'add' ? 'Thêm kết nối API' : mode === 'edit' ? 'Sửa kết nối API' : 'Chi tiết kết nối API';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isViewMode) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (field: keyof APIConnection, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Tên kết nối <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={isViewMode}
                required
                placeholder="Ví dụ: API Danh mục giới tính"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
              />
            </div>

            {/* Endpoint */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Endpoint URL <span className="text-red-600">*</span>
              </label>
              <input
                type="url"
                value={formData.endpoint}
                onChange={(e) => handleChange('endpoint', e.target.value)}
                disabled={isViewMode}
                required
                placeholder="https://api.example.com/v1/endpoint"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
              />
            </div>

            {/* Method & Auth Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  HTTP Method
                </label>
                <select
                  value={formData.method}
                  onChange={(e) => handleChange('method', e.target.value)}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Loại xác thực
                </label>
                <select
                  value={formData.authType}
                  onChange={(e) => handleChange('authType', e.target.value)}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                >
                  <option value="API Key">API Key</option>
                  <option value="Bearer Token">Bearer Token</option>
                  <option value="Basic Auth">Basic Auth</option>
                  <option value="OAuth 2.0">OAuth 2.0</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>

            {/* Auth Fields */}
            {formData.authType === 'API Key' && (
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => handleChange('apiKey', e.target.value)}
                  disabled={isViewMode}
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                />
              </div>
            )}

            {formData.authType === 'Basic Auth' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    disabled={isViewMode}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                disabled={isViewMode}
                rows={3}
                placeholder="Mô tả về kết nối API này..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                disabled={isViewMode}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <label htmlFor="isActive" className="text-sm text-slate-700">
                Kích hoạt kết nối
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {isViewMode ? 'Đóng' : 'Hủy'}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
