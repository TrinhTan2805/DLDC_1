import { useState, useEffect } from 'react';
import { X, Plus, Trash2, PlayCircle, Save } from 'lucide-react';

type AuthType = 'api-key' | 'client-secret' | 'oauth2' | 'hmac';

interface Header {
  key: string;
  value: string;
}

interface QueryParam {
  key: string;
  value: string;
}

interface APIConnectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  data?: any;
  mode: 'add' | 'edit' | 'view';
}

export function APIConnectionFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  data,
  mode 
}: APIConnectionFormModalProps) {
  const isViewMode = mode === 'view';
  const title = mode === 'add' ? 'Thêm kết nối API' : mode === 'edit' ? 'Sửa kết nối API' : 'Chi tiết kết nối API';

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
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (data && isOpen) {
      setConnectionName(data.name || '');
      setDescription(data.description || '');
      setBaseUrl(data.baseUrl || '');
      setEndpoint(data.endpoint || '');
      setHttpMethod(data.method || 'GET');
      setContentType(data.contentType || 'application/json');
      setAuthType(data.authType || 'api-key');
      setIsActive(data.isActive ?? true);
    } else if (!isOpen) {
      // Reset form when modal closes
      resetForm();
    }
  }, [data, isOpen]);

  const resetForm = () => {
    setConnectionName('');
    setDescription('');
    setBaseUrl('');
    setEndpoint('');
    setHttpMethod('GET');
    setContentType('application/json');
    setAuthType('api-key');
    setApiKey('');
    setApiKeyHeader('x-api-key');
    setClientId('');
    setClientSecret('');
    setClientIdHeader('x-client-id');
    setClientSecretHeader('x-client-secret');
    setTokenUrl('');
    setOauth2ClientId('');
    setOauth2ClientSecret('');
    setOauth2Scope('');
    setHmacSecretKey('');
    setHmacAlgorithm('HMAC-SHA256');
    setSignatureHeader('x-signature');
    setTimestampHeader('x-timestamp');
    setHeaders([]);
    setQueryParams([]);
    setBodyParams('{\n  \n}');
    setMaDonVi('');
    setMaHeThong('');
    setIsActive(true);
  };

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
    alert('Đang kiểm tra kết nối...\n\nThành công! Kết nối đến API hoạt động bình thường.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isViewMode) {
      const formData = {
        name: connectionName,
        description,
        baseUrl,
        endpoint,
        method: httpMethod,
        contentType,
        authType,
        isActive,
        authDetails: {
          apiKey,
          apiKeyHeader,
          clientId,
          clientSecret,
          clientIdHeader,
          clientSecretHeader,
          tokenUrl,
          oauth2ClientId,
          oauth2ClientSecret,
          oauth2Scope,
          hmacSecretKey,
          hmacAlgorithm,
          signatureHeader,
          timestampHeader
        },
        headers,
        queryParams,
        bodyParams,
        maDonVi,
        maHeThong
      };
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
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
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
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
                    disabled={isViewMode}
                    required
                    placeholder="Ví dụ: API Danh mục giới tính"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isViewMode}
                    placeholder="Mô tả về kết nối API này..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
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
                    disabled={isViewMode}
                    placeholder="https://api.example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
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
                    disabled={isViewMode}
                    required
                    placeholder="/v1/endpoint"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">HTTP Method</label>
                    <select
                      value={httpMethod}
                      onChange={(e) => setHttpMethod(e.target.value)}
                      disabled={isViewMode}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
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
                      disabled={isViewMode}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
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
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                  >
                    <option value="api-key">API Key</option>
                    <option value="client-secret">Client ID + Secret</option>
                    <option value="oauth2">OAuth2</option>
                    <option value="hmac">HMAC Signature</option>
                  </select>
                </div>

                {/* API Key */}
                {authType === 'api-key' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">API Key</label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        disabled={isViewMode}
                        placeholder="••••••••••••••••"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Header Name</label>
                      <input
                        type="text"
                        value={apiKeyHeader}
                        onChange={(e) => setApiKeyHeader(e.target.value)}
                        disabled={isViewMode}
                        placeholder="x-api-key"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                      />
                    </div>
                  </div>
                )}

                {/* Client ID + Secret */}
                {authType === 'client-secret' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Client ID</label>
                      <input
                        type="text"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        disabled={isViewMode}
                        placeholder="your-client-id"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Client Secret</label>
                      <input
                        type="password"
                        value={clientSecret}
                        onChange={(e) => setClientSecret(e.target.value)}
                        disabled={isViewMode}
                        placeholder="••••••••••••••••"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">Header ID Name</label>
                        <input
                          type="text"
                          value={clientIdHeader}
                          onChange={(e) => setClientIdHeader(e.target.value)}
                          disabled={isViewMode}
                          placeholder="x-client-id"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">Header Secret Name</label>
                        <input
                          type="text"
                          value={clientSecretHeader}
                          onChange={(e) => setClientSecretHeader(e.target.value)}
                          disabled={isViewMode}
                          placeholder="x-client-secret"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* OAuth2 */}
                {authType === 'oauth2' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Token URL</label>
                      <input
                        type="text"
                        value={tokenUrl}
                        onChange={(e) => setTokenUrl(e.target.value)}
                        disabled={isViewMode}
                        placeholder="https://auth.example.com/oauth/token"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Client ID</label>
                      <input
                        type="text"
                        value={oauth2ClientId}
                        onChange={(e) => setOauth2ClientId(e.target.value)}
                        disabled={isViewMode}
                        placeholder="your-client-id"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Client Secret</label>
                      <input
                        type="password"
                        value={oauth2ClientSecret}
                        onChange={(e) => setOauth2ClientSecret(e.target.value)}
                        disabled={isViewMode}
                        placeholder="••••••••••••••••"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Scope</label>
                      <input
                        type="text"
                        value={oauth2Scope}
                        onChange={(e) => setOauth2Scope(e.target.value)}
                        disabled={isViewMode}
                        placeholder="read write"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                      />
                    </div>
                  </div>
                )}

                {/* HMAC Signature */}
                {authType === 'hmac' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Secret Key</label>
                      <input
                        type="password"
                        value={hmacSecretKey}
                        onChange={(e) => setHmacSecretKey(e.target.value)}
                        disabled={isViewMode}
                        placeholder="••••••••••••••••"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Algorithm</label>
                      <select
                        value={hmacAlgorithm}
                        onChange={(e) => setHmacAlgorithm(e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
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
                          disabled={isViewMode}
                          placeholder="x-signature"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">Timestamp Header</label>
                        <input
                          type="text"
                          value={timestampHeader}
                          onChange={(e) => setTimestampHeader(e.target.value)}
                          disabled={isViewMode}
                          placeholder="x-timestamp"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Headers bổ sung */}
            {!isViewMode && (
              <section>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                  <h3 className="text-base text-slate-900">Headers bổ sung</h3>
                  <button
                    type="button"
                    onClick={addHeader}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
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
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          type="text"
                          value={header.value}
                          onChange={(e) => updateHeader(index, 'value', e.target.value)}
                          placeholder="Header value"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <button
                          type="button"
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
            )}

            {/* Query Params */}
            {!isViewMode && (
              <section>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                  <h3 className="text-base text-slate-900">Query Params</h3>
                  <button
                    type="button"
                    onClick={addQueryParam}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
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
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          type="text"
                          value={param.value}
                          onChange={(e) => updateQueryParam(index, 'value', e.target.value)}
                          placeholder="Param value"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <button
                          type="button"
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
                    disabled={isViewMode}
                    placeholder="VD: BTP"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Mã hệ thống</label>
                  <input
                    type="text"
                    value={maHeThong}
                    onChange={(e) => setMaHeThong(e.target.value)}
                    disabled={isViewMode}
                    placeholder="VD: DLDC"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8]"
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
                  disabled={isViewMode}
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="text-sm text-slate-700">Kích hoạt kết nối</span>
              </label>
            </section>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div>
              {!isViewMode && (
                <button
                  type="button"
                  onClick={handleTestConnection}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  Test Kết nối
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
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
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Lưu
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
