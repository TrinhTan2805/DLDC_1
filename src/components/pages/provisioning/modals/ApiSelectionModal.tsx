import React, { useState } from 'react';
import { X, Search, Database, CheckCircle2, XCircle, Activity } from 'lucide-react';

interface ApiItem {
  id: string;
  name: string;
  database: string;
  status: 'active' | 'error';
  lastLatency: string;
}

const mockApiList: ApiItem[] = [
  { id: 'Lấy danh sách Hộ tịch', name: 'Lấy danh sách Hộ tịch', database: 'Dữ liệu Hộ tịch điện tử', status: 'active', lastLatency: '124 ms' },
  { id: 'Tra cứu thông tin cá nhân', name: 'Tra cứu thông tin cá nhân', database: 'Dữ liệu Hộ tịch điện tử', status: 'active', lastLatency: '85 ms' },
  { id: 'Đồng bộ dữ liệu THADS', name: 'Đồng bộ dữ liệu THADS', database: 'Cơ sở dữ liệu THADS', status: 'error', lastLatency: '850 ms' },
  { id: 'Đọc thông tin Biện pháp bảo đảm', name: 'Đọc thông tin Biện pháp bảo đảm', database: 'CSDL Biện pháp bảo đảm', status: 'active', lastLatency: '98 ms' },
  { id: 'Truy xuất hồ sơ doanh nghiệp', name: 'Truy xuất hồ sơ doanh nghiệp', database: 'CSDL Quốc gia về Doanh nghiệp', status: 'active', lastLatency: '210 ms' },
];

const databases = Array.from(new Set(mockApiList.map(api => api.database)));

interface ApiSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (apiId: string) => void;
  currentApiId: string;
}

export function ApiSelectionModal({ isOpen, onClose, onSelect, currentApiId }: ApiSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDb, setSelectedDb] = useState('');

  if (!isOpen) return null;

  const filteredApis = mockApiList.filter(api => {
    const matchSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDb = selectedDb ? api.database === selectedDb : true;
    return matchSearch && matchDb;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Activity className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Chọn API Giám sát</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Lựa chọn API từ các CSDL để xem thống kê hiệu năng chi tiết</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex gap-4 bg-white">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm tên API..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow"
            />
          </div>
          <div className="w-1/3">
            <select 
              value={selectedDb} 
              onChange={(e) => setSelectedDb(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">Tất cả Cơ sở dữ liệu</option>
              {databases.map(db => (
                <option key={db} value={db}>{db}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-semibold border-b border-slate-200 w-5/12">Tên API</th>
                  <th className="px-5 py-3 font-semibold border-b border-slate-200 w-3/12">Nguồn CSDL</th>
                  <th className="px-5 py-3 font-semibold border-b border-slate-200 w-2/12">Trạng thái</th>
                  <th className="px-5 py-3 font-semibold border-b border-slate-200 w-2/12 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApis.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-slate-500 font-medium">
                      Không tìm thấy API nào phù hợp với bộ lọc hiện tại.
                    </td>
                  </tr>
                ) : (
                  filteredApis.map((api) => (
                    <tr 
                      key={api.id} 
                      className={`transition-colors hover:bg-slate-50 ${currentApiId === api.id ? 'bg-amber-50/50' : ''}`}
                    >
                      <td className="px-5 py-3 font-bold text-slate-800">
                        {api.name}
                        {currentApiId === api.id && <span className="ml-2 inline-block px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded font-bold">Đang xem</span>}
                      </td>
                      <td className="px-5 py-3 text-slate-600 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-slate-400" />
                        {api.database}
                      </td>
                      <td className="px-5 py-3">
                        {api.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ổn định
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                            <XCircle className="w-3.5 h-3.5" /> Cảnh báo
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => {
                            onSelect(api.id);
                            onClose();
                          }}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm ${
                            currentApiId === api.id 
                              ? 'bg-slate-200 text-slate-600 cursor-not-allowed' 
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                          disabled={currentApiId === api.id}
                        >
                          {currentApiId === api.id ? 'Đang Chọn' : 'Chọn API'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
