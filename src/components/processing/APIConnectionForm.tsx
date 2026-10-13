import { toast } from 'sonner';
import { useState } from 'react';
import { Plus, Trash2, PlayCircle, Save } from 'lucide-react';

type AuthType = 'api-key' | 'client-secret' | 'oauth2' | 'hmac';

interface Header {
  key: string;
  value: string;
}

interface QueryParam {
  key: string;
  value: string;
}

export function APIConnectionForm() {
  const [connectionName, setConnectionName] = useState('');
  const [description, setDescription] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [httpMethod, setHttpMethod] = useState('GET');
  const [contentType, setContentType] = useState('application/json');
  const [authType, setAuthType] = useState<AuthType>('api-key');
  
  // API Key fields
  const [apiKey, setApiKey] = useState('');
  const [apiKeyHeader, setApiKeyHeader] = useState('x-api-key');
  
  // Client ID + Secret fields
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [clientIdHeader, setClientIdHeader] = useState('x-client-id');
  const [clientSecretHeader, setClientSecretHeader] = useState('x-client-secret');
  
  // OAuth2 fields
  const [tokenUrl, setTokenUrl] = useState('');
  const [oauth2ClientId, setOauth2ClientId] = useState('');
  const [oauth2ClientSecret, setOauth2ClientSecret] = useState('');
  const [oauth2Scope, setOauth2Scope] = useState('');
  
  // HMAC fields
  const [hmacSecretKey, setHmacSecretKey] = useState('');
  const [hmacAlgorithm, setHmacAlgorithm] = useState('HMAC-SHA256');
  const [signatureHeader, setSignatureHeader] = useState('x-signature');
  const [timestampHeader, setTimestampHeader] = useState('x-timestamp');
  
  const [headers, setHeaders] = useState<Header[]>([]);
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);
  const [bodyParams, setBodyParams] = useState('{\n  \n}');
  
  const [maDonVi, setMaDonVi] = useState('');
  const [maHeThong, setMaHeThong] = useState('');
  const [isActive, setIsActive] = useState(false);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addQueryParam = () => {
    setQueryParams([...queryParams, { key: '', value: '' }]);
  };

  const removeQueryParam = (index: number) => {
    setQueryParams(queryParams.filter((_, i) => i !== index));
  };

  const updateQueryParam = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...queryParams];
    newParams[index][field] = value;
    setQueryParams(newParams);
  };

  const handleTestConnection = () => {
    toast.success('Đang kiểm tra kết nối...\n\nThành công! Kết nối đến API hoạt động bình thường.');
  };

  const handleSave = () => {
    toast.success('Đã lưu cấu hình kết nối thành công');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
      {/* Thông tin chung */}
      <section>
        <h3 className="text-base text-slate-900 mb-4 pb-2 border-b border-slate-200">Thông tin chung</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Tên kết nối <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={connectionName}
              onChange={(e) => setConnectionName(e.target.value)}
              placeholder="Ví dụ: API Danh mục giới tính"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả về kết nối API này..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Cấu hình Endpoint */}
      <section>
        <h3 className="text-base text-slate-900 mb-4 pb-2 border-b border-slate-200">Cấu hình Endpoint</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-2">Base URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Endpoint <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="/v1/endpoint"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">HTTP Method</label>
              <select
                value={httpMethod}
                onChange={(e) => setHttpMethod(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="application/json">JSON</option>
                <option value="application/xml">XML</option>
                <option value="application/x-www-form-urlencoded">Form-urlencoded</option>
                <option value="multipart/form-data">Multipart</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Xác thực */}
      <section>
        <h3 className="text-base text-slate-900 mb-4 pb-2 border-b border-slate-200">Xác thực</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-700 mb-2">Loại xác thực</label>
            <select
              value={authType}
              onChange={(e) => setAuthType(e.target.value as AuthType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="api-key">API Key</option>
              <option value="client-secret">Client ID + Secret</option>
              <option value="oauth2">OAuth2</option>
              <option value="hmac">HMAC Signature</option>
            </select>
          </div>

          {/* API Key */}
          {authType === 'api-key' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm text-slate-700 mb-2">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Header Name</label>
                <input
                  type="text"
                  value={apiKeyHeader}
                  onChange={(e) => setApiKeyHeader(e.target.value)}
                  placeholder="x-api-key"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* Client ID + Secret */}
          {authType === 'client-secret' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Client ID</label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="your-client-id"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Client Secret</label>
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Header ID Name</label>
                  <input
                    type="text"
                    value={clientIdHeader}
                    onChange={(e) => setClientIdHeader(e.target.value)}
                    placeholder="x-client-id"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Header Secret Name</label>
                  <input
                    type="text"
                    value={clientSecretHeader}
                    onChange={(e) => setClientSecretHeader(e.target.value)}
                    placeholder="x-client-secret"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* OAuth2 */}
          {authType === 'oauth2' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Token URL</label>
                <input
                  type="text"
                  value={tokenUrl}
                  onChange={(e) => setTokenUrl(e.target.value)}
                  placeholder="https://auth.example.com/oauth/token"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Client ID</label>
                <input
                  type="text"
                  value={oauth2ClientId}
                  onChange={(e) => setOauth2ClientId(e.target.value)}
                  placeholder="your-client-id"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Client Secret</label>
                <input
                  type="password"
                  value={oauth2ClientSecret}
                  onChange={(e) => setOauth2ClientSecret(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Scope</label>
                <input
                  type="text"
                  value={oauth2Scope}
                  onChange={(e) => setOauth2Scope(e.target.value)}
                  placeholder="read write"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* HMAC Signature */}
          {authType === 'hmac' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Secret Key</label>
                <input
                  type="password"
                  value={hmacSecretKey}
                  onChange={(e) => setHmacSecretKey(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Algorithm</label>
                <select
                  value={hmacAlgorithm}
                  onChange={(e) => setHmacAlgorithm(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="HMAC-SHA256">HMAC-SHA256</option>
                  <option value="HMAC-SHA512">HMAC-SHA512</option>
                  <option value="HMAC-SHA1">HMAC-SHA1</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Signature Header</label>
                  <input
                    type="text"
                    value={signatureHeader}
                    onChange={(e) => setSignatureHeader(e.target.value)}
                    placeholder="x-signature"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Timestamp Header</label>
                  <input
                    type="text"
                    value={timestampHeader}
                    onChange={(e) => setTimestampHeader(e.target.value)}
                    placeholder="x-timestamp"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Headers bổ sung */}
      <section>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
          <h3 className="text-base text-slate-900">Headers bổ sung</h3>
          <button
            onClick={addHeader}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Header
          </button>
        </div>
        {headers.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-slate-200">
            Chưa có header bổ sung nào
          </div>
        ) : (
          <div className="space-y-2">
            {headers.map((header, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => updateHeader(index, 'key', e.target.value)}
                  placeholder="Header key"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => updateHeader(index, 'value', e.target.value)}
                  placeholder="Header value"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <button
                  onClick={() => removeHeader(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Query Params */}
      <section>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
          <h3 className="text-base text-slate-900">Query Params</h3>
          <button
            onClick={addQueryParam}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Query Param
          </button>
        </div>
        {queryParams.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-slate-200">
            Chưa có query param nào
          </div>
        ) : (
          <div className="space-y-2">
            {queryParams.map((param, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={param.key}
                  onChange={(e) => updateQueryParam(index, 'key', e.target.value)}
                  placeholder="Param key"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <input
                  type="text"
                  value={param.value}
                  onChange={(e) => updateQueryParam(index, 'value', e.target.value)}
                  placeholder="Param value"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <button
                  onClick={() => removeQueryParam(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Body Params (JSON) */}
      {(httpMethod === 'POST' || httpMethod === 'PUT' || httpMethod === 'PATCH') && (
        <section>
          <h3 className="text-base text-slate-900 mb-4 pb-2 border-b border-slate-200">Body Params (JSON)</h3>
          <textarea
            value={bodyParams}
            onChange={(e) => setBodyParams(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono bg-slate-50"
          />
        </section>
      )}

      {/* Cấu hình đơn vị LGSP */}
      <section>
        <h3 className="text-base text-slate-900 mb-4 pb-2 border-b border-slate-200">Cấu hình đơn vị LGSP (nếu có)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-2">Mã đơn vị</label>
            <input
              type="text"
              value={maDonVi}
              onChange={(e) => setMaDonVi(e.target.value)}
              placeholder="VD: BTP"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-2">Mã hệ thống</label>
            <input
              type="text"
              value={maHeThong}
              onChange={(e) => setMaHeThong(e.target.value)}
              placeholder="VD: DLDC"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Kích hoạt kết nối */}
      <section>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5 text-purple-600 border-slate-300 rounded focus:ring-2 focus:ring-purple-500"
          />
          <span className="text-sm text-slate-700">Kích hoạt kết nối</span>
        </label>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={handleTestConnection}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlayCircle className="w-4 h-4" />
          Test Kết nối
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Lưu cấu hình
        </button>
      </div>
    </div>
  );
}
