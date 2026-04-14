import { Search } from 'lucide-react';
import { useState } from 'react';

interface ConnectionConfigSectionProps {
  dataClassification?: string;
  resetTestState: () => void;
}

export function ConnectionConfigSection({ dataClassification, resetTestState }: ConnectionConfigSectionProps) {
  const [connectionType, setConnectionType] = useState('REST');
  const [apiType, setApiType] = useState('API KEY');

  return (
    <div className="space-y-5" onChange={resetTestState}>
      {/* Phương thức kết nối */}
      <div>
        <label htmlFor="conn-type" className="block text-sm text-slate-700 font-medium mb-2">
          Phương thức kết nối <span className="text-red-500">*</span>
        </label>
        <select
          id="conn-type"
          title="Phương thức kết nối"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={connectionType}
          onChange={(e) => setConnectionType(e.target.value)}
        >
          <option value="REST">API RESTful</option>
          <option value="SOAP">API SOAP</option>
          <option value="FTP">FTP/SFTP</option>
          <option value="FILE">File Upload</option>
          <option value="DB">Database</option>
        </select>
      </div>

      {connectionType === 'REST' && (
        <div className="space-y-5">
          {/* Base URL */}
          <div>
            <label htmlFor="conn-base-url" className="block text-sm text-slate-600 mb-1">
              Base URL <span className="text-red-500">*</span>
            </label>
            <input
              id="conn-base-url"
              title="Base URL"
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://api.example.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="conn-content-type" className="block text-sm text-slate-600 mb-1">
                Content Type <span className="text-red-500">*</span>
              </label>
              <select 
                id="conn-content-type"
                title="Content Type"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="application/json"
              >
                <option value="application/json">application/json</option>
                <option value="application/xml">application/xml</option>
                <option value="text/plain">text/plain</option>
                <option value="multipart/form-data">multipart/form-data</option>
              </select>
            </div>
            <div>
              <label htmlFor="conn-method" className="block text-sm text-slate-600 mb-1">
                Method <span className="text-red-500">*</span>
              </label>
              <select 
                id="conn-method"
                title="Method"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="GET"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="conn-api-type" className="block text-sm text-slate-600 mb-1">
                Loại API <span className="text-red-500">*</span>
              </label>
              <select 
                id="conn-api-type"
                title="Loại API"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={apiType}
                onChange={(e) => setApiType(e.target.value)}
              >
                <option value="API KEY">API KEY</option>
                <option value="OAuth 2.0">OAuth 2.0</option>
                <option value="Basic Auth">Basic Auth</option>
              </select>
            </div>
            {apiType === 'API KEY' && (
              <div>
                <label htmlFor="conn-header-name" className="block text-sm text-slate-600 mb-1">
                  Header Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="conn-header-name"
                  title="Header Name"
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="X-API-Key"
                  required={apiType === 'API KEY'}
                />
              </div>
            )}
            {(apiType === 'OAuth 2.0' || apiType === 'Basic Auth') && (
              <div>
                <label htmlFor="conn-auth" className="block text-sm text-slate-600 mb-1">
                  Authentication <span className="text-red-500">*</span>
                </label>
                <input
                  id="conn-auth"
                  title="Authentication"
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bearer token / Basic auth credentials"
                  required={apiType === 'OAuth 2.0' || apiType === 'Basic Auth'}
                />
              </div>
            )}
          </div>

          {apiType === 'API KEY' && (
            <div>
              <label htmlFor="conn-api-key" className="block text-sm text-slate-600 mb-1">
                API KEY <span className="text-red-500">*</span>
              </label>
              <input
                id="conn-api-key"
                title="API KEY"
                type="password"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập API Key"
                required={apiType === 'API KEY'}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="conn-endpoint-path" className="block text-sm text-slate-600 mb-1">
                Endpoint Path
              </label>
              <input
                id="conn-endpoint-path"
                title="Endpoint Path"
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/api/v1/users"
              />
            </div>
            <div>
              <label htmlFor="conn-query-params" className="block text-sm text-slate-600 mb-1">
                Query Parameters
              </label>
              <input
                id="conn-query-params"
                title="Query Parameters"
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="param1=value1&param2=value2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="conn-timeout" className="block text-sm text-slate-600 mb-1">
                Timeout (ms)
              </label>
              <input
                id="conn-timeout"
                title="Timeout (ms)"
                type="number"
                min="100"
                max="300000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1000"
                defaultValue="1000"
              />
            </div>
            <div>
              <label htmlFor="conn-page-size" className="block text-sm text-slate-600 mb-1">
                Page Size
              </label>
              <select 
                id="conn-page-size"
                title="Page Size"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="500">500</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="conn-success-codes" className="block text-sm text-slate-600 mb-1">
                HTTP Success Codes
              </label>
              <input
                id="conn-success-codes"
                title="HTTP Success Codes"
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="200,201"
              />
            </div>
            <div>
              <label htmlFor="conn-error-codes" className="block text-sm text-slate-600 mb-1">
                HTTP Error Codes
              </label>
              <input
                id="conn-error-codes"
                title="HTTP Error Codes"
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="400,500"
              />
            </div>
            <div>
              <label htmlFor="conn-ssl-required" className="block text-sm text-slate-600 mb-1">
                SSL Required
              </label>
              <select 
                id="conn-ssl-required"
                title="SSL Required"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="true"
              >
                <option value="true">Bật (true)</option>
                <option value="false">Tắt (false) - Cảnh báo bảo mật</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="conn-retries" className="block text-sm text-slate-600 mb-1">
                Số lần thử
              </label>
              <input
                id="conn-retries"
                title="Số lần thử"
                type="number"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3"
                defaultValue="3"
              />
            </div>
            <div>
              <label htmlFor="conn-interval" className="block text-sm text-slate-600 mb-1">
                Khoảng cách (ms)
              </label>
              <input
                id="conn-interval"
                title="Khoảng cách"
                type="number"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5000"
                defaultValue="5000"
              />
            </div>
          </div>

          {/* Request/Response Sample */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="conn-request-sample" className="block text-sm text-slate-600 mb-1">
                Request Sample
              </label>
              <textarea
                id="conn-request-sample"
                title="Request Sample"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder='{"key": "value"}'
              />
            </div>
            <div>
              <label htmlFor="conn-response-sample" className="block text-sm text-slate-600 mb-1">
                Response Sample
              </label>
              <textarea
                id="conn-response-sample"
                title="Response Sample"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="{}"
              />
            </div>
          </div>
        </div>
      )}

      {connectionType === 'SOAP' && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3 pb-2 border-b border-slate-200">Cấu hình API SOAP</h3>
          <div>
            <input 
              id="soap-wsdl-url" 
              type="url" 
              title="WSDL URL"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="https://api.example.com/service?wsdl" 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input 
                id="soap-action" 
                type="text" 
                title="SOAP Action"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="http://tempuri.org/Action" 
              />
            </div>
            <div>
              <select 
                id="soap-auth-type" 
                title="Loại Auth"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ws-security">WS-Security</option>
                <option value="basic">Basic Auth</option>
                <option value="bearer">Bearer Token</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input 
                id="soap-username" 
                type="text" 
                title="Username"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Nhập username" 
                required 
              />
            </div>
            <div>
              <input 
                id="soap-password" 
                type="password" 
                title="Password"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Nhập password" 
                required 
              />
            </div>
          </div>
          <div>
            <textarea 
              id="soap-xml-payload" 
              title="XML Payload"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
              rows={4} 
              placeholder="<soapenv:Envelope>..." 
            />
          </div>
        </div>
      )}

      {connectionType === 'FTP' && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3 pb-2 border-b border-slate-200">Cấu hình FTP/SFTP</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input 
                id="ftp-host" 
                type="text" 
                title="Host/IP"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="192.168.1.100" 
              />
            </div>
            <div>
              <input 
                id="ftp-port" 
                type="text" 
                title="Port"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="21 / 22" 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input 
                id="ftp-username" 
                type="text" 
                title="Username"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Nhập username" 
                required 
              />
            </div>
            <div>
              <input 
                id="ftp-password" 
                type="password" 
                title="Password"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Nhập password" 
                required 
              />
            </div>
          </div>
          <div>
            <input 
              id="ftp-path" 
              type="text" 
              title="Đường dẫn thư mục"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="/data/uploads" 
            />
          </div>
        </div>
      )}

      {connectionType === 'FILE' && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3 pb-2 border-b border-slate-200">Cấu hình File Upload</h3>
          <div>
            <input 
              id="file-formats" 
              type="text" 
              title="Định dạng hỗ trợ"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="VD: .csv, .xlsx, .json" 
            />
          </div>
          <div>
            <input 
              id="file-max-size" 
              type="number" 
              title="Dung lượng tối đa (MB)"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="50" 
              defaultValue={50} 
            />
          </div>
        </div>
      )}

      {connectionType === 'DB' && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3 pb-2 border-b border-slate-200">Cấu hình Database</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <select 
                id="db-type" 
                title="Loại Cơ sở dữ liệu"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="oracle">Oracle</option>
                <option value="postgres">PostgreSql</option>
              </select>
            </div>
            <div>
              <input 
                id="db-host" 
                type="text" 
                title="Host/IP"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="192.168.1.100" 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input 
                id="db-port" 
                type="text" 
                title="Port"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="1521 / 5432" 
              />
            </div>
            <div>
              <input 
                id="db-name" 
                type="text" 
                title="Database Name / SID"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="ORCL / db_name" 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input 
                id="db-username" 
                type="text" 
                title="Username"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Nhập DB Username" 
                required 
              />
            </div>
            <div>
              <input 
                id="db-password" 
                type="password" 
                title="Password"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Nhập DB Password" 
                required 
              />
            </div>
          </div>
          <div>
            <input 
              id="db-schema" 
              type="text" 
              title="Schema"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="public / schema_name" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
