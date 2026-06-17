import React, { useState } from 'react';
import { Search, Code, Lock, Server, ChevronDown, ChevronRight, FileJson } from 'lucide-react';

const mockApis = [
  {
    id: 'api-1',
    name: 'Lấy danh sách Hộ tịch',
    method: 'GET',
    endpoint: '/api/v1/hotich/list',
    desc: 'Lấy danh sách dữ liệu hộ tịch công dân theo các tiêu chí (tỉnh/thành, loại giấy tờ...).',
    parameters: [
      { name: 'provinceCode', type: 'string', in: 'query', required: false, desc: 'Mã tỉnh/thành phố' },
      { name: 'type', type: 'string', in: 'query', required: true, desc: 'Loại giấy tờ (KHAISINH, KETHON)' }
    ],
    responses: {
      '200': 'Trả về mảng JSON chứa thông tin hộ tịch.',
      '401': 'Lỗi xác thực Token.',
      '403': 'Không có quyền truy cập phạm vi này.'
    }
  },
  {
    id: 'api-2',
    name: 'Đồng bộ dữ liệu THADS',
    method: 'POST',
    endpoint: '/api/v1/thads/sync',
    desc: 'API cho phép đẩy dữ liệu Thi hành án dân sự mới nhất lên hệ thống.',
    parameters: [
      { name: 'data', type: 'object', in: 'body', required: true, desc: 'Payload chứa dữ liệu THADS' }
    ],
    responses: {
      '200': 'Đồng bộ thành công.',
      '400': 'Dữ liệu đầu vào không hợp lệ (Bad Request).'
    }
  }
];

export function ApiDocumentationTab() {
  const [expandedApi, setExpandedApi] = useState<string | null>('api-1');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApis = mockApis.filter(api => 
    api.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    api.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMethodColor = (method: string) => {
    switch(method) {
      case 'GET': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'POST': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PUT': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'DELETE': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar for APIs */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="bg-slate-800 text-white p-4 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-1 flex items-center">
              <FileJson className="w-5 h-5 mr-2" />
              API Catalog
            </h3>
            <p className="text-slate-400 text-xs">Swagger OpenAPI 3.0</p>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm API..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden divide-y divide-slate-100">
            {filteredApis.map(api => (
              <button 
                key={api.id}
                onClick={() => setExpandedApi(expandedApi === api.id ? null : api.id)}
                className={`w-full text-left p-3 flex items-start gap-3 transition-colors ${
                  expandedApi === api.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold border mt-0.5 shrink-0 ${getMethodColor(api.method)}`}>
                  {api.method}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm truncate">{api.name}</div>
                  <div className="text-xs text-slate-500 font-mono truncate">{api.endpoint}</div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expandedApi === api.id ? 'rotate-90' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Content details */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          {expandedApi ? (
            (() => {
              const api = mockApis.find(a => a.id === expandedApi)!;
              return (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Header */}
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-md text-sm font-bold border ${getMethodColor(api.method)}`}>
                        {api.method}
                      </span>
                      <h2 className="text-xl font-bold text-slate-800">{api.name}</h2>
                    </div>
                    <div className="flex items-center text-slate-600 bg-slate-50 p-2 rounded-lg font-mono text-sm border border-slate-200">
                      <Server className="w-4 h-4 mr-2 text-slate-400" />
                      https://gateway.dldc.gov.vn{api.endpoint}
                    </div>
                    <p className="mt-4 text-slate-600 text-sm">{api.desc}</p>
                  </div>

                  {/* Authentication */}
                  <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                      <Lock className="w-4 h-4 text-amber-500" />
                      Xác thực (Authentication)
                    </h3>
                    <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm border border-amber-100">
                      API yêu cầu gửi kèm <strong>Bearer Token</strong> trong header <code>Authorization</code>. Token được cấp tại mục Phân quyền.
                    </div>
                  </div>

                  {/* Parameters */}
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3">Tham số (Parameters)</h3>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-2 font-semibold text-slate-600">Tên tham số</th>
                            <th className="px-4 py-2 font-semibold text-slate-600">Vị trí</th>
                            <th className="px-4 py-2 font-semibold text-slate-600">Loại</th>
                            <th className="px-4 py-2 font-semibold text-slate-600">Mô tả</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {api.parameters.map((param, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-3 font-mono font-semibold text-slate-800">
                                {param.name}
                                {param.required && <span className="text-red-500 ml-1" title="Bắt buộc">*</span>}
                              </td>
                              <td className="px-4 py-3 text-slate-500">{param.in}</td>
                              <td className="px-4 py-3 text-indigo-600 font-mono text-xs">{param.type}</td>
                              <td className="px-4 py-3 text-slate-600">{param.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Responses */}
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3">Phản hồi (Responses)</h3>
                    <div className="space-y-3">
                      {Object.entries(api.responses).map(([code, desc]) => (
                        <div key={code} className="flex items-start gap-4 p-3 border border-slate-200 rounded-lg bg-slate-50">
                          <div className={`px-2 py-1 rounded text-xs font-bold ${
                            code.startsWith('2') ? 'bg-emerald-100 text-emerald-700' : 
                            code.startsWith('4') ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {code}
                          </div>
                          <div className="text-sm text-slate-600 mt-0.5">{desc as string}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })()
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
              <Code className="w-16 h-16 mb-4 text-slate-200" />
              <p>Chọn một API từ danh sách bên trái để xem tài liệu.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
