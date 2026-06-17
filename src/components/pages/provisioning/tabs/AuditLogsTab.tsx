import React, { useState } from 'react';
import { Search, Filter, Calendar, Download, Eye, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '';
  if (/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(dateStr)) return dateStr;
  const spaceSplit = dateStr.split(' ');
  if (spaceSplit.length === 2) {
    const [dStr, tStr] = spaceSplit;
    const dParts = dStr.split('-');
    if (dParts.length === 3) {
      return `${dParts[2]}/${dParts[1]}/${dParts[0]} ${tStr}`;
    }
  }
  const parts = dateStr.split('-');
  if (parts.length === 3 && !dateStr.includes('T') && !dateStr.includes(' ')) {
    return `${parts[2]}/${parts[1]}/${parts[0]} 08:00:00`;
  }
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      return `${day}/${month}/${year} ${h}:${m}:${s}`;
    }
  } catch (e) {}
  return dateStr;
};

const mockLogs = [
  { id: 'LOG-001', timestamp: '2026-05-25 14:23:45', ip: '192.168.12.100', status: 200, method: 'GET', endpoint: '/api/v1/hotich/list', latency: '124ms', client: 'Sở Y tế tỉnh Bắc Ninh' },
  { id: 'LOG-002', timestamp: '2026-05-25 14:21:10', ip: '10.20.30.45', status: 403, method: 'GET', endpoint: '/api/v1/hotich/list', latency: '45ms', client: 'Sở Thông tin và Truyền thông tỉnh Bắc Ninh' },
  { id: 'LOG-003', timestamp: '2026-05-25 13:15:22', ip: '172.16.8.99', status: 200, method: 'POST', endpoint: '/api/v1/thads/sync', latency: '310ms', client: 'Hệ thống THADS Quốc gia' },
  { id: 'LOG-004', timestamp: '2026-05-25 11:45:01', ip: '192.168.20.14', status: 500, method: 'GET', endpoint: '/api/v1/bpbd/get', latency: '5020ms', client: 'Cục Giao dịch bảo đảm' },
  { id: 'LOG-005', timestamp: '2026-05-24 09:30:15', ip: '192.168.12.100', status: 200, method: 'GET', endpoint: '/api/v1/hotich/list', latency: '110ms', client: 'Sở Y tế tỉnh Bắc Ninh' },
];

export function AuditLogsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.ip.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || 
                          (statusFilter === 'Success' && log.status === 200) ||
                          (statusFilter === 'Error' && log.status !== 200);
    return matchesSearch && matchesStatus;
  });

  const paginatedLogs = React.useMemo(() => {
    return filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const getStatusIcon = (status: number) => {
    if (status === 200) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (status === 403) return <AlertCircle className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-rose-500" />;
  };

  const getStatusColor = (status: number) => {
    if (status === 200) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 403) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 w-full md:w-auto relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo IP, Client hoặc Endpoint..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Success">Thành công (200 OK)</option>
            <option value="Error">Lỗi (4xx, 5xx)</option>
          </select>
          <button className="px-4 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg text-[13px] font-medium flex items-center transition-colors shadow-sm cursor-pointer">
            <Filter className="w-4 h-4 mr-2" />
            Lọc nâng cao
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-[13px] font-semibold text-slate-500 border-b border-slate-200 uppercase tracking-tight">
                <th className="px-6 py-3 font-semibold">Mã Log</th>
                <th className="px-6 py-3 font-semibold">Thời gian (Timestamp)</th>
                <th className="px-6 py-3 font-semibold">Client / Đơn vị gọi</th>
                <th className="px-6 py-3 font-semibold">IP Address</th>
                <th className="px-6 py-3 font-semibold">API Endpoint</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Độ trễ</th>
                <th className="px-6 py-3 font-semibold text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-500 text-xs">{log.id}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDateTime(log.timestamp)}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{log.client}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.ip}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.method === 'GET' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {log.method}
                      </span>
                      <span className="font-mono text-xs text-indigo-600">{log.endpoint}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(log.status)}`}>
                      {getStatusIcon(log.status)}
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-xs font-semibold text-slate-600">
                    {log.latency}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-[6px] transition-all inline-flex items-center justify-center cursor-pointer" title="Xem Payload">
                      <Eye className="w-4 h-4 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    Không tìm thấy nhật ký khai thác nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {(() => {
          const totalItems = filteredLogs.length;
          const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
          return (
            <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 text-[13px] collection-pagination">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Hiển thị</span>
                <select aria-label="Select record count" 
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[13px]"
                  title="Số bản ghi trên trang"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-slate-600">bản ghi/trang</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-slate-600">
                  {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
                  >
                    Trước
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 border rounded-lg font-medium text-[13px] transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                    disabled={currentPage === totalPages || totalItems === 0}
                    className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
