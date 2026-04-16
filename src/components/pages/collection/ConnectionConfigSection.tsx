import { Search, Upload, Download, Loader2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface ConnectionConfigSectionProps {
  dataClassification?: string;
  resetTestState: () => void;
  isEdit?: boolean;
  testState?: 'idle' | 'testing_connection' | 'connection_error' | 'testing_data' | 'data_error' | 'success';
  handleTestConnection?: () => void;
  mockMode?: 'success' | 'err_conn' | 'err_data';
  setMockMode?: (mode: 'success' | 'err_conn' | 'err_data') => void;
}

export function ConnectionConfigSection({ dataClassification, resetTestState, isEdit = false, testState = 'idle', handleTestConnection, mockMode = 'success', setMockMode }: ConnectionConfigSectionProps) {
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
            <label htmlFor="soap-endpoint-url" className="block text-sm text-slate-600 mb-1">Endpoint URL <span className="text-red-500">*</span></label>
            <input 
              id="soap-endpoint-url" 
              type="url" 
              title="Endpoint URL"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="https://api.example.com/service?wsdl" 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="soap-timeout" className="block text-sm text-slate-600 mb-1">Timeout (ms)</label>
              <input 
                id="soap-timeout" 
                type="number" 
                title="Timeout"
                defaultValue="30000" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label htmlFor="soap-ssl" className="block text-sm text-slate-600 mb-1">SSL Required</label>
              <select 
                id="soap-ssl" 
                title="SSL Required"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Bật (true)</option>
                <option value="false">Tắt (false)</option>

              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="soap-retries" className="block text-sm text-slate-600 mb-1">Số lần thử</label>
              <input 
                id="soap-retries" 
                type="number" 
                title="Số lần thử"
                defaultValue="3" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label htmlFor="soap-interval" className="block text-sm text-slate-600 mb-1">Khoảng cách retry (ms)</label>
              <input 
                id="soap-interval" 
                type="number" 
                title="Khoảng cách retry"
                defaultValue="5000" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
          <div>
            <label htmlFor="soap-auth-type" className="block text-sm text-slate-600 mb-1">Loại Auth <span className="text-red-500">*</span></label>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="soap-username" className="block text-sm text-slate-600 mb-1">Username <span className="text-red-500">*</span></label>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ftp-path" className="block text-sm text-slate-600 mb-1">Đường dẫn thư mục (Tùy chọn)</label>
              <input 
                id="ftp-path" 
                type="text" 
                title="Đường dẫn thư mục"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="/data/uploads" 
              />
            </div>
            <div>
              <label htmlFor="ftp-timeout" className="block text-sm text-slate-600 mb-1">Timeout (giây)</label>
              <input 
                id="ftp-timeout" 
                type="number" 
                title="Timeout"
                defaultValue="30" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>

          </div>
        </div>
      )}

      {connectionType === 'FILE' && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3 pb-2 border-b border-slate-200">Cấu hình File Upload</h3>
          <div>
            <label htmlFor="file-formats" className="block text-sm text-slate-600 mb-1">Định dạng hỗ trợ</label>
            <input 
              id="file-formats" 
              type="text" 
              title="Định dạng hỗ trợ"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="VD: .csv, .xlsx, .json" 
            />
          </div>
          <div>
            <label htmlFor="file-max-size" className="block text-sm text-slate-600 mb-1">Dung lượng tối đa (MB)</label>
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
              <label htmlFor="db-type" className="block text-sm text-slate-600 mb-1">Loại Cơ sở dữ liệu <span className="text-red-500">*</span></label>
              <select 
                id="db-type" 
                title="Loại Cơ sở dữ liệu"
                disabled={isEdit} 
                className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEdit ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                defaultValue="oracle"
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="db-schema" className="block text-sm text-slate-600 mb-1">Schema (Optional)</label>
              <input 
                id="db-schema" 
                type="text" 
                title="Schema"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="public / schema_name" 
              />
            </div>
            <div>
              <label htmlFor="db-query" className="block text-sm text-slate-600 mb-1">Query/Table</label>
              <input 
                id="db-query" 
                type="text" 
                title="Query/Table"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="VD: SELECT * FROM..." 
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="db-pool-size" className="block text-sm text-slate-600 mb-1">Conn Pool Size</label>
              <input 
                id="db-pool-size" 
                type="number" 
                title="Connection Pool Size"
                defaultValue="10" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label htmlFor="db-timeout" className="block text-sm text-slate-600 mb-1">Timeout (giây)</label>
              <input 
                id="db-timeout" 
                type="number" 
                title="Timeout"
                defaultValue="30" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label htmlFor="db-batch-size" className="block text-sm text-slate-600 mb-1">Batch Size</label>
              <input 
                id="db-batch-size" 
                type="number" 
                title="Batch Size"
                defaultValue="1000" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>

          </div>
        </div>
      )}

      {/* KHỐI KIỂM TRA KẾT NỐI */}
      <div className="pt-6 mt-6 border-t border-slate-200">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testState === 'testing_connection' || testState === 'testing_data'}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-colors text-sm font-medium flex items-center gap-2"
          >
            {(testState === 'testing_connection' || testState === 'testing_data') && <Loader2 className="w-4 h-4 animate-spin" />}
            Kiểm tra kết nối
          </button>
          
          <div className="flex items-center gap-2 text-xs border border-orange-200 bg-orange-50 px-3 py-2 rounded-lg ml-auto">
            <span className="font-semibold text-orange-800">Chế độ Test (Mockup):</span>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" checked={mockMode==='success'} onChange={()=>setMockMode && setMockMode('success')} name="mMode" /> Thành công</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" checked={mockMode==='err_conn'} onChange={()=>setMockMode && setMockMode('err_conn')} name="mMode" /> Lỗi Kết nối</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" checked={mockMode==='err_data'} onChange={()=>setMockMode && setMockMode('err_data')} name="mMode" /> Lỗi Dữ liệu</label>
          </div>
        </div>

        {testState === 'testing_connection' && (
           <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2 animate-pulse border border-blue-200">
             <Loader2 className="w-4 h-4 animate-spin" /> Đang thực hiện kết nối tới hệ thống nguồn...
           </div>
        )}
        
        {testState === 'testing_data' && (
          <div className="mt-4 space-y-3">
             <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2 border border-green-200">
               <CheckCircle className="w-4 h-4" /> Kết nối thành công.
             </div>
             <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2 animate-pulse border border-blue-200">
               <Loader2 className="w-4 h-4 animate-spin" /> Đang tải mô hình dữ liệu mẫu (Data Schema/Payload)...
             </div>
          </div>
        )}
        
        {testState === 'success' && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2 border border-green-200 font-medium">
            <CheckCircle className="w-5 h-5" /> Kết nối thành công! Đã nhận được dữ liệu mẫu, Sẵn sàng ánh xạ.
          </div>
        )}
      </div>
    </div>
  );
}
