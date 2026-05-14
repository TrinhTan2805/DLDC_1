import { Plus, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { useState } from 'react';

interface ConnectionConfigSectionProps {
  dataClassification?: string;
  resetTestState: () => void;
  isEdit?: boolean;
  testState?: 'idle' | 'testing_connection' | 'connection_error' | 'testing_data' | 'data_error' | 'success';
  handleTestConnection?: () => void;
  mockMode?: 'success' | 'err_conn' | 'err_data';
  setMockMode?: (mode: 'success' | 'err_conn' | 'err_data') => void;
  connectionType: string;
  setConnectionType: (type: string) => void;
}

interface HeaderItem {
  id: string;
  key: string;
  value: string;
}

export function ConnectionConfigSection({ resetTestState, isEdit = false, connectionType, setConnectionType }: ConnectionConfigSectionProps) {
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
        <label htmlFor="conn-type" className="block text-base text-slate-700 font-medium mb-2">
          Phương thức kết nối <span className="text-red-500">*</span>
        </label>
        <select aria-label="Select box"
          id="conn-type"
          title="Phương thức kết nối"
          className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEdit ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
          value={connectionType}
          onChange={(e) => setConnectionType(e.target.value)}
          disabled={isEdit}
        >
          <option value="API">API</option>
          <option value="DB">Cơ sở dữ liệu</option>
          <option value="FILE">Tải file Excel</option>
        </select>
      </div>

      {connectionType === 'API' && (
        <div className="space-y-4">
          <div>
            <label className="block text-base text-slate-700 mb-1">Tên api<span className="text-red-500">*</span></label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tên api" />
          </div>
          <div>
            <label className="block text-base text-slate-700 mb-1">URL<span className="text-red-500">*</span></label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="URL" />
          </div>

          <div>
            <label className="block text-base text-slate-700 mb-2">Headers1</label>
            <div className="border border-slate-200 rounded-lg overflow-hidden mb-3">
              <table className="w-full text-left text-base">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-base font-semibold text-slate-800">STT</th>
                    <th className="px-4 py-3 text-base font-semibold text-slate-800">Key</th>
                    <th className="px-4 py-3 text-base font-semibold text-slate-800">Value</th>
                    <th className="px-4 py-3 font-bold text-slate-800">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {headers1.map((h, index) => (
                    <tr key={h.id} className="bg-white">
                      <td className="px-4 py-3 text-slate-700 font-medium">{index + 1}</td>
                      <td className="px-4 py-3"><input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" placeholder="KeyHeader" /></td>
                      <td className="px-4 py-3"><input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" placeholder="ValueHeader" /></td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => removeHeader1(h.id)} className="px-4 py-1.5 bg-red-500 text-white text-base font-medium rounded-lg hover:bg-red-600 transition-colors shadow-sm">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={addHeader1} className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Thêm mới</button>
            </div>
          </div>

          <div>
            <label className="block text-base text-slate-700 mb-1">Máy chủ thực thi<span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Chọn Máy chủ thực thi</option>
              <option value="worker1">Máy chủ thực thi 1</option>
              <option value="worker2">Máy chủ thực thi 2</option>
            </select>
          </div>
          <div>
            <label className="block text-base text-slate-700 mb-1">Trạm kết nối<span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Chọn Trạm kết nối</option>
              <option value="agent1">Trạm kết nối 1</option>
              <option value="agent2">Trạm kết nối 2</option>
            </select>
          </div>
          <div>
            <label className="block text-base text-slate-700 mb-1">Method<span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" defaultValue="POST">
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div>
            <label className="block text-base text-slate-700 mb-1">Authorization</label>
            <select
              value={authorization}
              onChange={(e) => {
                setAuthorization(e.target.value);
                if (e.target.value === 'Basic Authen' || e.target.value === 'Bearer Token') {
                  setIsExpanded(true);
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="No Authen">No Authen</option>
              <option value="Basic Authen">Basic Authen</option>
              <option value="Bearer Token">Bearer Token</option>
            </select>
          </div>

          <div>
            <label className="block text-base text-slate-700 mb-1">Body</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Body" />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-base text-[#5c6e81] hover:text-slate-900 transition-colors"
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
        <div className="space-y-6">
          <div>
            <label className="block text-base text-slate-700 font-medium mb-1.5">Tên File CSDL <span className="text-red-500">*</span></label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tên File CSDL" />
          </div>

          <div>
            <label className="block text-base text-slate-700 font-medium mb-1.5">Máy chủ thực thi <span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Chọn Máy chủ thực thi</option>
              <option value="worker1">Máy chủ thực thi 1</option>
              <option value="worker2">Máy chủ thực thi 2</option>
            </select>
          </div>

          <div>
            <label className="block text-base text-slate-700 font-medium mb-1.5">Trạm kết nối <span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Chọn Trạm kết nối</option>
              <option value="agent1">Trạm kết nối 1</option>
              <option value="agent2">Trạm kết nối 2</option>
            </select>
          </div>

          <div>
            <label className="block text-base text-slate-700 font-medium mb-1.5">Tập tin tải lên <span className="text-red-500">*</span></label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 bg-slate-50/50 flex flex-col items-center justify-center gap-3 group hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer">
              <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
                <Upload className="w-10 h-10" />
              </div>
              <div className="text-center">
                <p className="text-base text-slate-600">Kéo và thả tập tin vào đây hoặc</p>
                <button type="button" className="mt-2 px-4 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-700 shadow-sm hover:bg-slate-50">Chọn tập tin</button>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Các định dạng cho phép: <span className="font-bold text-slate-700 italic">CSV, XLS, XLSX</span>
            </p>
          </div>
        </div>
      )}


      {connectionType === 'DB' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="block text-base text-slate-700 font-medium mb-1.5">Tên CSDL <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tên CSDL" />
            </div>
            <div>
              <label className="block text-base text-slate-700 font-medium mb-1.5">Tên CSDL gốc <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tên CSDL gốc" />
            </div>

            <div>
              <label className="block text-base text-slate-700 font-medium mb-1.5">Kiểu CSDL <span className="text-red-500">*</span></label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" defaultValue="DBT_ORACLE_10g">
                <option value="DBT_ORACLE_10g">DBT_ORACLE_10g</option>
                <option value="POSTGRESQL">PostgreSql</option>
                <option value="MYSQL">MySql</option>
                <option value="SQLSERVER">SQL Server</option>
              </select>
            </div>
            <div>
              <label className="block text-base text-slate-700 font-medium mb-1.5">Trạm kết nối <span className="text-red-500">*</span></label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Chọn Trạm kết nối</option>
                <option value="agent1">Trạm kết nối 1</option>
                <option value="agent2">Trạm kết nối 2</option>
              </select>
            </div>

            <div>
              <label className="block text-base text-slate-700 font-medium mb-1.5">Máy chủ thực thi <span className="text-red-500">*</span></label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Chọn Máy chủ thực thi</option>
                <option value="worker1">Máy chủ thực thi 1</option>
                <option value="worker2">Máy chủ thực thi 2</option>
              </select>
            </div>
            <div>
              <label className="block text-base text-slate-700 font-medium mb-1.5">Địa chỉ CSDL <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Địa chỉ CSDL" />
            </div>

            <div>
              <label className="block text-base text-slate-700 font-medium mb-1.5">Cổng kết nối <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Cổng kết nối" />
            </div>
            <div>
              <label className="block text-base text-slate-700 font-medium mb-1.5">Tài khoản <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tài khoản" />
            </div>

            <div>
              <label className="block text-base text-slate-700 font-medium mb-1.5">Mật khẩu <span className="text-red-500">*</span></label>
              <input type="password" size={1} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Mật khẩu" />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
