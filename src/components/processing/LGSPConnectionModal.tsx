import { useState } from 'react';
import { X, PlayCircle } from 'lucide-react';

interface LGSPConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthType = 'api-key' | 'client-secret' | 'oauth2' | 'hmac';

export function LGSPConnectionModal({ isOpen, onClose }: LGSPConnectionModalProps) {
  const [connectionName, setConnectionName] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [httpMethod, setHttpMethod] = useState('GET');
  const [authType, setAuthType] = useState<AuthType>('api-key');
  
  // API Key fields
  const [apiKey, setApiKey] = useState('');
  
  // Client ID + Secret fields
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  
  // OAuth2 fields
  const [tokenUrl, setTokenUrl] = useState('');
  const [oauth2ClientId, setOauth2ClientId] = useState('');
  const [oauth2ClientSecret, setOauth2ClientSecret] = useState('');
  const [oauth2Scope, setOauth2Scope] = useState('');
  
  // HMAC fields
  const [hmacSecretKey, setHmacSecretKey] = useState('');
  const [hmacAlgorithm, setHmacAlgorithm] = useState('HMAC-SHA256');
  
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = () => {
    alert('Đang kiểm tra kết nối...\n\nThành công! Kết nối đến API hoạt động bình thường.');
  };

  const handleSave = () => {
    alert('Đã lưu cấu hình kết nối LGSP thành công!');
    onClose();
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg text-slate-900">Thêm kết nối API</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            {/* Tên kết nối */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Tên kết nối <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={connectionName}
                onChange={(e) => setConnectionName(e.target.value)}
                placeholder="Ví dụ: API Danh mục giới tính"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Endpoint URL */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Endpoint URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://api.example.com/v1/endpoint"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>

            {/* HTTP Method và Loại xác thực */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">HTTP Method</label>
                <select
                  value={httpMethod}
                  onChange={(e) => setHttpMethod(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Loại xác thực</label>
                <select
                  value={authType}
                  onChange={(e) => setAuthType(e.target.value as AuthType)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="api-key">API Key</option>
                  <option value="client-secret">Client ID + Secret</option>
                  <option value="oauth2">OAuth2</option>
                  <option value="hmac">HMAC Signature</option>
                </select>
              </div>
            </div>

            {/* API Key */}
            {authType === 'api-key' && (
              <div>
                <label className="block text-sm text-slate-700 mb-2">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
            )}

            {/* Client ID + Secret */}
            {authType === 'client-secret' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Client ID</label>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="your-client-id"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Client Secret</label>
                  <input
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            )}

            {/* OAuth2 */}
            {authType === 'oauth2' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Token URL</label>
                  <input
                    type="text"
                    value={tokenUrl}
                    onChange={(e) => setTokenUrl(e.target.value)}
                    placeholder="https://auth.example.com/oauth/token"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Client ID</label>
                  <input
                    type="text"
                    value={oauth2ClientId}
                    onChange={(e) => setOauth2ClientId(e.target.value)}
                    placeholder="your-client-id"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Client Secret</label>
                  <input
                    type="password"
                    value={oauth2ClientSecret}
                    onChange={(e) => setOauth2ClientSecret(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Scope</label>
                  <input
                    type="text"
                    value={oauth2Scope}
                    onChange={(e) => setOauth2Scope(e.target.value)}
                    placeholder="read write"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            )}

            {/* HMAC Signature */}
            {authType === 'hmac' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Secret Key</label>
                  <input
                    type="password"
                    value={hmacSecretKey}
                    onChange={(e) => setHmacSecretKey(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Algorithm</label>
                  <select
                    value={hmacAlgorithm}
                    onChange={(e) => setHmacAlgorithm(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white"
                  >
                    <option value="HMAC-SHA256">HMAC-SHA256</option>
                    <option value="HMAC-SHA512">HMAC-SHA512</option>
                    <option value="HMAC-SHA1">HMAC-SHA1</option>
                  </select>
                </div>
              </div>
            )}

            {/* Mô tả */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả về kết nối API này..."
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
              />
            </div>

            {/* Kích hoạt kết nối */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm text-slate-700">Kích hoạt kết nối</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleTestConnection}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            Test Kết nối
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Lưu cấu hình
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
