import { useState } from 'react';
import { X, Database, Table, Columns, Search, ChevronRight, Info, Link2, ShieldCheck, Calendar } from 'lucide-react';
import { TargetDatabase, mockTables, mockColumns } from './mockTargetDatabases';

interface TargetDatabaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TargetDatabase | null;
}

export function TargetDatabaseDetailModal({ isOpen, onClose, data }: TargetDatabaseDetailModalProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen || !data) return null;

  const filteredTables = mockTables.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-[100] p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl flex flex-col h-[90vh] border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white to-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Database className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-2xl font-bold text-slate-800">{data.name}</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  data.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {data.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                <Link2 className="w-4 h-4" /> {data.type} • {data.host}:{data.port}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel: Basic Info & Tables */}
          <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/30">
            {/* Connection Info */}
            <div className="p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info className="w-3.5 h-3.5" /> Thông tin kết nối
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-[13px] text-slate-500">Schema/Database</span>
                  <span className="text-[13px] font-semibold text-slate-800">{data.schema}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-[13px] text-slate-500">Username</span>
                  <span className="text-[13px] font-semibold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> {data.username}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[13px] text-slate-500">Ngày tạo</span>
                  <span className="text-[13px] font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> 20/05/2026
                  </span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-700 italic">"{data.note || 'Không có ghi chú'}"</p>
              </div>
            </div>

            {/* Table List Header */}
            <div className="px-6 py-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Table className="w-3.5 h-3.5" /> Danh sách bảng ({filteredTables.length})
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bảng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Table List Items */}
            <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
              <div className="space-y-1">
                {filteredTables.map((table) => (
                  <button
                    key={table.name}
                    onClick={() => setSelectedTable(table.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                      selectedTable === table.name
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'text-slate-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Table className={`w-4 h-4 flex-shrink-0 ${selectedTable === table.name ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                      <div className="text-left overflow-hidden">
                        <p className={`text-[13px] font-bold truncate ${selectedTable === table.name ? 'text-white' : 'text-slate-800'}`}>
                          {table.name}
                        </p>
                        <p className={`text-[10px] truncate ${selectedTable === table.name ? 'text-blue-100' : 'text-slate-400'}`}>
                          {table.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${
                      selectedTable === table.name ? 'text-white translate-x-0.5' : 'text-slate-300'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Column List */}
          <div className="flex-1 flex flex-col bg-white">
            {selectedTable ? (
              <>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Columns className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Cấu trúc bảng: {selectedTable}</h3>
                      <p className="text-xs text-slate-500">Danh sách các trường thông tin trong bảng dữ liệu</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Tên trường</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Kiểu dữ liệu</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Độ dài</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Mô tả</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(mockColumns[selectedTable] || []).map((col) => (
                        <tr key={col.name} className="hover:bg-slate-50/30 transition-colors">
                          <td className="py-4 px-6 text-[13px] font-bold text-slate-800">{col.name}</td>
                          <td className="py-4 px-6">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase border border-slate-200">
                              {col.type}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-[13px] text-slate-500 text-center">{col.length}</td>
                          <td className="py-4 px-6 text-[13px] text-slate-600">{col.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 animate-pulse">
                  <Table className="w-10 h-10 text-slate-200" />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Chưa chọn bảng dữ liệu</h4>
                <p className="max-w-xs text-[13px] text-slate-500">
                  Vui lòng chọn một bảng từ danh sách bên trái để xem chi tiết cấu trúc các cột dữ liệu.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 flex justify-end bg-slate-50/30">
          <button
            onClick={onClose}
            className="px-8 py-2.5 text-[13px] font-bold text-white bg-slate-800 rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-slate-200"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}
