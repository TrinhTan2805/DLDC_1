import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
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

interface HeaderItem {
  id: string;
  key: string;
  value: string;
}

export function ConnectionConfigSection({ resetTestState, isEdit = false }: ConnectionConfigSectionProps) {
  const [connectionType, setConnectionType] = useState('API');
  const [authorization, setAuthorization] = useState('No Authen');
  const [isExpanded, setIsExpanded] = useState(false);
  const [tokenType, setTokenType] = useState('api');
  
  const [headers1, setHeaders1] = useState<HeaderItem[]>([
    { id: '1', key: '', value: '' },
    { id: '2', key: '', value: '' }
  ]);
  
  const [headers2, setHeaders2] = useState<HeaderItem[]>([
    { id: '1', key: '', value: '' }
  ]);

  const addHeader1 = () => {
    setHeaders1([...headers1, { id: Date.now().toString(), key: '', value: '' }]);
  };

  const removeHeader1 = (id: string) => {
    setHeaders1(headers1.filter(h => h.id !== id));
  };

  const addHeader2 = () => {
    setHeaders2([...headers2, { id: Date.now().toString(), key: '', value: '' }]);
  };

  const removeHeader2 = (id: string) => {
    setHeaders2(headers2.filter(h => h.id !== id));
  };

  return (
    <div className="space-y-5" onChange={resetTestState}>
      {/* Phương thức kết nối */}
      <div>
        <label htmlFor="conn-type" className="block text-sm text-slate-700 font-medium mb-2">
          Phương thức kết nối <span className="text-red-500">*</span>
        </label>
        <select aria-label="Select box"
          id="conn-type"
          title="Phương thức kết nối"
          className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEdit ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
          value={connectionType}
          onChange={(e) => setConnectionType(e.target.value)}
          disabled={isEdit}
        >
          <option value="API">API</option>
          <option value="DB">Cơ sở dữ liệu</option>
          <option value="FILE">Tải file</option>
        </select>
      </div>

      {connectionType === 'API' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Tên api<span className="text-red-500">*</span></label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tên api" />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Tên alias<span className="text-red-500">*</span></label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tên alias" />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">URL<span className="text-red-500">*</span></label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="URL" />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-2">Headers1</label>
            <div className="border border-slate-200 rounded-lg overflow-hidden mb-3">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-bold text-slate-800 w-16">STT</th>
                    <th className="px-4 py-3 font-bold text-slate-800 w-1/3">Key</th>
                    <th className="px-4 py-3 font-bold text-slate-800 w-1/3">Value</th>
                    <th className="px-4 py-3 font-bold text-slate-800">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {headers1.map((h, index) => (
                    <tr key={h.id} className="bg-white">
                      <td className="px-4 py-3 text-slate-700 font-medium">{index + 1}</td>
                      <td className="px-4 py-3"><input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="KeyHeader" /></td>
                      <td className="px-4 py-3"><input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="ValueHeader" /></td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => removeHeader1(h.id)} className="px-4 py-1.5 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition-colors">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={addHeader1} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">Thêm mới</button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Worker<span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Chọn Worker</option>
              <option value="worker1">Worker 1</option>
              <option value="worker2">Worker 2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Agent<span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Chọn Agent</option>
              <option value="agent1">Agent 1</option>
              <option value="agent2">Agent 2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Method<span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" defaultValue="POST">
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-slate-700 mb-1">Authorization</label>
            <select 
              value={authorization}
              onChange={(e) => {
                setAuthorization(e.target.value);
                if (e.target.value === 'Basic Authen' || e.target.value === 'Bearer Token') {
                  setIsExpanded(true);
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="No Authen">No Authen</option>
              <option value="Basic Authen">Basic Authen</option>
              <option value="Bearer Token">Bearer Token</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Body</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Body" />
          </div>

          <div className="pt-2">
            <button 
              type="button" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-base font-bold text-[#5c6e81] hover:text-slate-900 transition-colors"
            >
              Thông tin mở rộng {isExpanded ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
            
            {isExpanded && (
              <div className="mt-4 p-5 bg-white border border-slate-200 shadow-sm rounded-lg space-y-4 animate-in slide-in-from-top-2 duration-200">
                {authorization === 'Basic Authen' && (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Tài khoản</label>
                      <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tài khoản" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Mật khẩu</label>
                      <input type="password" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Mật khẩu" />
                    </div>
                  </div>
                )}
                
                {authorization === 'Bearer Token' && (
                  <>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Loại token</label>
                      <select 
                        value={tokenType}
                        onChange={(e) => setTokenType(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="api">Lấy token từ API</option>
                        <option value="static">Token cố định</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Nhập token</label>
                      <input 
                        type="text" 
                        disabled={tokenType !== 'static'} 
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${tokenType !== 'static' ? 'border-slate-200 bg-slate-100 text-slate-500' : 'border-slate-300 bg-white'}`} 
                        placeholder={tokenType === 'static' ? "Nhập token..." : ""} 
                      />
                    </div>
                    
                    {tokenType === 'api' && (
                      <div className="space-y-4 animate-in fade-in duration-200 mt-4">
                        <div>
                          <label className="block text-sm text-slate-700 mb-1">URL</label>
                          <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="" />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-700 mb-2">Headers2</label>
                          <div className="border border-slate-200 rounded-lg overflow-hidden mb-3 bg-white">
                            <table className="w-full text-left text-sm">
                              <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                  <th className="px-4 py-3 font-bold text-slate-800 w-16">STT</th>
                                  <th className="px-4 py-3 font-bold text-slate-800 w-1/3">Key</th>
                                  <th className="px-4 py-3 font-bold text-slate-800 w-1/3">Value</th>
                                  <th className="px-4 py-3 font-bold text-slate-800">Thao tác</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {headers2.map((h, index) => (
                                  <tr key={h.id} className="bg-white">
                                    <td className="px-4 py-3 text-slate-700 font-medium">{index + 1}</td>
                                    <td className="px-4 py-3"><input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="KeyToken" /></td>
                                    <td className="px-4 py-3"><input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="ValueToken" /></td>
                                    <td className="px-4 py-3">
                                      <button type="button" onClick={() => removeHeader2(h.id)} className="px-4 py-1.5 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition-colors">Xóa</button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="flex justify-end">
                            <button type="button" onClick={addHeader2} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">Thêm mới</button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-slate-700 mb-1">Phương thức</label>
                          <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" defaultValue="POST">
                            <option value="POST">POST</option>
                            <option value="GET">GET</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-slate-700 mb-1">Body</label>
                          <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="" />
                        </div>
                        <div className="pt-2">
                          <button type="button" className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">Lấy token</button>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {authorization === 'No Authen' && (
                  <div className="text-sm text-slate-500 italic">Không có cấu hình mở rộng cho loại xác thực hiện tại. Chọn Bearer Token hoặc Basic Authen để xem.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {connectionType === 'FILE' && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3 pb-2 border-b border-slate-200">Cấu hình File Upload</h3>
          <div>
            <label htmlFor="file-formats" className="block text-sm text-slate-600 mb-1">Định dạng hỗ trợ</label>
            <input aria-label="Input field" 
              id="file-formats" 
              type="text" 
              title="Định dạng hỗ trợ"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="VD: .csv, .xlsx, .json" 
            />
          </div>
          <div>
            <label htmlFor="file-max-size" className="block text-sm text-slate-600 mb-1">Dung lượng tối đa (MB)</label>
            <input aria-label="Input field" 
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
              <select aria-label="Select box" 
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
              <label className="block text-sm text-slate-600 mb-1 opacity-0">Hidden Label</label>
              <input aria-label="Input field" 
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
              <input aria-label="Input field" 
                id="db-port" 
                type="text" 
                title="Port"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="1521 / 5432" 
              />
            </div>
            <div>
              <input aria-label="Input field" 
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
              <input aria-label="Input field" 
                id="db-username" 
                type="text" 
                title="Username"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Nhập DB Username" 
                required 
              />
            </div>
            <div>
              <input aria-label="Input field" 
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
              <input aria-label="Input field" 
                id="db-schema" 
                type="text" 
                title="Schema"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="public / schema_name" 
              />
            </div>
            <div>
              <label htmlFor="db-query" className="block text-sm text-slate-600 mb-1">Query/Table</label>
              <input aria-label="Input field" 
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
              <input aria-label="Input field" 
                id="db-pool-size" 
                type="number" 
                title="Connection Pool Size"
                defaultValue="10" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label htmlFor="db-timeout" className="block text-sm text-slate-600 mb-1">Timeout (giây)</label>
              <input aria-label="Input field" 
                id="db-timeout" 
                type="number" 
                title="Timeout"
                defaultValue="30" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label htmlFor="db-batch-size" className="block text-sm text-slate-600 mb-1">Batch Size</label>
              <input aria-label="Input field" 
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
    </div>
  );
}
