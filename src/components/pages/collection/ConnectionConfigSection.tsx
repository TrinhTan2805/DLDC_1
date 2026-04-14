import { Search, Upload, Download } from 'lucide-react';
import { useState } from 'react';

interface ConnectionConfigSectionProps {
  dataClassification?: string;
  resetTestState: () => void;
  isEdit?: boolean;
}

export function ConnectionConfigSection({ dataClassification, resetTestState, isEdit = false }: ConnectionConfigSectionProps) {
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
          className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEdit ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
          value={connectionType}
          onChange={(e) => setConnectionType(e.target.value)}
          disabled={isEdit}
        >
          <option value="REST">API RESTful</option>
          <option value="SOAP">API SOAP</option>
          <option value="FTP">FTP/SFTP</option>
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
                  Header Name/ App code <span className="text-red-500">*</span>
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
            {apiType === 'OAuth 2.0' && (
              <div>
                <label htmlFor="conn-auth" className="block text-sm text-slate-600 mb-1">
                  Authentication <span className="text-red-500">*</span>
                </label>
                <input
                  id="conn-auth"
                  title="Authentication"
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bearer token"
                  required
                />
              </div>
            )}
            {apiType === 'Basic Auth' && (
              <>
                <div>
                  <label htmlFor="conn-username" className="block text-sm text-slate-600 mb-1">
                    User Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="conn-username"
                    title="User Name"
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter user name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="conn-auth-pwd" className="block text-sm text-slate-600 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="conn-auth-pwd"
                    title="Password"
                    type="password"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Tên service <span className="text-red-500">*</span></label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Chọn service</option>
                <option value="CitizenService">CitizenService</option>
                <option value="EnterpriseService">EnterpriseService</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Phương thức gọi <span className="text-red-500">*</span></label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Chọn phương thức</option>
                <option value="GetCitizenInfo">GetCitizenInfo</option>
                <option value="UpdateCitizenInfo">UpdateCitizenInfo</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Endpoint URL <span className="text-red-500">*</span></label>
            <input type="url" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://api.example.com/service?wsdl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Timeout (ms)</label>
              <input type="number" defaultValue="30000" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">SSL Required</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="true">Bật (true)</option>
                <option value="false">Tắt (false)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Số lần thử</label>
              <input type="number" defaultValue="3" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Khoảng cách retry (ms)</label>
              <input type="number" defaultValue="5000" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Loại Auth <span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="ws-security">WS-Security</option>
              <option value="basic">Basic Auth</option>
              <option value="bearer">Bearer Token</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Username <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập username" required />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Password <span className="text-red-500">*</span></label>
              <input type="password" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập password" required />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">XML Payload</label>
            <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} placeholder="<soapenv:Envelope>..." />
          </div>
        </div>
      )}

      {connectionType === 'FTP' && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3 pb-2 border-b border-slate-200">Cấu hình FTP/SFTP</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Host/IP <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="192.168.1.100" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Port <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="21 / 22" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Username <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập username" required />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Password <span className="text-red-500">*</span></label>
              <input type="password" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập password" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Đường dẫn thư mục (Tùy chọn)</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="/data/uploads" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Timeout (giây)</label>
              <input type="number" defaultValue="30" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      )}



      {connectionType === 'DB' && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3 pb-2 border-b border-slate-200">Cấu hình Database</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Loại Cơ sở dữ liệu <span className="text-red-500">*</span></label>
              <select disabled={isEdit} className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEdit ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}>
                <option value="oracle">Oracle</option>
                <option value="postgres">PostgreSql</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Host/IP <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="192.168.1.100" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Port <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="1521 / 5432" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Database Name / SID <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="ORCL / db_name" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Username <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập DB Username" required />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Password <span className="text-red-500">*</span></label>
              <input type="password" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập DB Password" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Schema (Optional)</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="public / schema_name" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Query/Table</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="VD: SELECT * FROM..." />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Conn Pool Size</label>
              <input type="number" defaultValue="10" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Timeout (giây)</label>
              <input type="number" defaultValue="30" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Batch Size</label>
              <input type="number" defaultValue="1000" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
