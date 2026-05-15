import { useState } from 'react';
import { Search, Filter, Download, Eye, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ActivityLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  method: string;
  status: 'success' | 'failed';
  details: string;
  ipAddress: string;
  browser: string;
  ministry: string;
}

const activityLogs: ActivityLog[] = [
  {
    id: 1,
    timestamp: '08/12/2025 14:35:22',
    user: 'Nguyễn Văn A',
    action: 'Thêm mới phương thức',
    method: 'API Thu thập dữ liệu dân số',
    ministry: 'Bộ Nội vụ',
    status: 'success',
    details: 'Thêm mới phương thức thu thập qua API REST',
    ipAddress: '192.168.1.100',
    browser: 'Chrome 120.0'
  },
  {
    id: 2,
    timestamp: '08/12/2025 13:20:15',
    user: 'Trần Thị B',
    action: 'Chỉnh sửa phương thức',
    method: 'API Thống kê giáo dục',
    ministry: 'Bộ Giáo dục và Đào tạo',
    status: 'success',
    details: 'Cập nhật API endpoint và headers',
    ipAddress: '192.168.1.101',
    browser: 'Firefox 121.0'
  },
  {
    id: 3,
    timestamp: '08/12/2025 12:45:30',
    user: 'Lê Văn C',
    action: 'Xóa phương thức',
    method: 'API Dữ liệu y tế',
    ministry: 'Bộ Y tế',
    status: 'failed',
    details: 'Không thể xóa do còn dữ liệu phụ thuộc',
    ipAddress: '192.168.1.102',
    browser: 'Edge 120.0'
  },
  {
    id: 4,
    timestamp: '08/12/2025 11:15:00',
    user: 'Phạm Thị D',
    action: 'Xem chi tiết',
    method: 'API Thu thập dữ liệu dân số',
    ministry: 'Bộ Nội vụ',
    status: 'success',
    details: 'Xem thông tin chi tiết phương thức',
    ipAddress: '192.168.1.103',
    browser: 'Chrome 120.0'
  },
  {
    id: 5,
    timestamp: '08/12/2025 10:30:45',
    user: 'Hoàng Văn E',
    action: 'Kết xuất dữ liệu',
    method: 'Tất cả phương thức',
    ministry: 'Tất cả',
    status: 'success',
    details: 'Xuất danh sách phương thức ra Excel',
    ipAddress: '192.168.1.104',
    browser: 'Safari 17.0'
  }
];

export function CollectionActivityLog() {
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(activityLogs.length / itemsPerPage);
  const currentLogs = activityLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-slate-900 mb-1 font-bold">Quản lý nhật ký thu thập dữ liệu</h2>
        <p className="text-slate-500 text-base">Theo dõi và quản lý các hoạt động liên quan đến thu thập dữ liệu</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input aria-label="Input field"
                type="text"
                placeholder="Tìm kiếm theo người dùng, hành động, phương thức..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Filter Action */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select aria-label="Select box" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                <option value="">Tất cả hành động</option>
                <option value="add">Thêm mới</option>
                <option value="edit">Chỉnh sửa</option>
                <option value="delete">Xóa</option>
                <option value="view">Xem chi tiết</option>
                <option value="export">Kết xuất</option>
              </select>
            </div>
          </div>

          {/* Filter Ministry */}
          <div>
            <select aria-label="Select box" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Tất cả bộ ban ngành</option>
              <option value="moha">Bộ Nội vụ</option>
              <option value="moet">Bộ Giáo dục và Đào tạo</option>
              <option value="moh">Bộ Y tế</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="lg:col-span-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input aria-label="Input field"
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="flex items-center text-slate-400">-</span>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input aria-label="Input field"
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Filter Status */}
          <div>
            <select aria-label="Select box" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Tất cả trạng thái</option>
              <option value="success">Thành công</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>

          {/* Export */}
          <div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-base font-medium hover:bg-slate-50 transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              Kết xuất
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-base text-slate-600">Tìm thấy <span className="font-bold text-blue-600">{activityLogs.length}</span> nhật ký</p>
      </div>

      {/* Activity Log Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-center text-base font-bold text-slate-500 uppercase tracking-wider w-12">STT</th>
                <th className="px-6 py-4 text-center text-base font-bold text-slate-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-4 text-center text-base font-bold text-slate-500 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-4 text-center text-base font-bold text-slate-500 uppercase tracking-wider">Hành động</th>
                <th className="px-6 py-4 text-center text-base font-bold text-slate-500 uppercase tracking-wider">Phương thức</th>
                <th className="px-6 py-4 text-center text-base font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-center text-base font-bold text-slate-500 uppercase tracking-wider w-20">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentLogs.map((log, index) => (
                <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 text-center text-base text-slate-500 font-medium">{((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, '0')}</td>
                  <td className="px-6 py-4 text-center text-base text-slate-900 font-mono">{log.timestamp}</td>
                  <td className="px-6 py-4 text-center text-base text-slate-900 font-semibold">{log.user}</td>
                  <td className="px-6 py-4 text-center text-base text-slate-700">{log.action}</td>
                  <td className="px-6 py-4 text-center text-base text-slate-700">{log.method}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-base font-semibold ${
                      log.status === 'success' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {log.status === 'success' ? 'Thành công' : 'Thất bại'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination UI - According to rule 5.14 */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base text-slate-500">Hiển thị</span>
            <div className="relative group">
              <select aria-label="Records per page"
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm appearance-none pr-8 cursor-pointer font-medium text-slate-700"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <span className="text-base text-slate-500 font-medium">bản ghi / trang</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-base text-slate-500 font-medium">
              {activityLogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, activityLogs.length)} / {activityLogs.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-1.5 border border-slate-200 rounded-lg text-base font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 text-slate-700"
              >
                Trước
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 3 + i + 1;
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-base font-bold transition-all active:scale-90 ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-1.5 border border-slate-200 rounded-lg text-base font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 text-slate-700"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-slate-900 font-bold">Chi tiết nhật ký hoạt động</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-base text-slate-500 mb-1 uppercase font-bold tracking-wider">Thời gian</p>
                  <p className="text-base text-slate-900 font-mono">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <p className="text-base text-slate-500 mb-1 uppercase font-bold tracking-wider">Người dùng</p>
                  <p className="text-base text-slate-900 font-bold">{selectedLog.user}</p>
                </div>
                <div>
                  <p className="text-base text-slate-500 mb-1 uppercase font-bold tracking-wider">Hành động</p>
                  <p className="text-base text-slate-900 font-medium">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-base text-slate-500 mb-1 uppercase font-bold tracking-wider">Trạng thái</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-base font-bold ${
                    selectedLog.status === 'success' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedLog.status === 'success' ? 'Thành công' : 'Thất bại'}
                  </span>
                </div>
                <div>
                  <p className="text-base text-slate-500 mb-1 uppercase font-bold tracking-wider">Phương thức</p>
                  <p className="text-base text-slate-900">{selectedLog.method}</p>
                </div>
                <div>
                  <p className="text-base text-slate-500 mb-1 uppercase font-bold tracking-wider">Bộ ban ngành</p>
                  <p className="text-base text-slate-900">{selectedLog.ministry}</p>
                </div>
                <div>
                  <p className="text-base text-slate-500 mb-1 uppercase font-bold tracking-wider">Địa chỉ IP</p>
                  <p className="text-base text-slate-900 font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <p className="text-base text-slate-500 mb-1 uppercase font-bold tracking-wider">Trình duyệt</p>
                  <p className="text-base text-slate-900">{selectedLog.browser}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-base text-slate-500 mb-2 uppercase font-bold tracking-wider">Chi tiết</p>
                <p className="text-base text-slate-900 leading-relaxed">{selectedLog.details}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end bg-slate-50/50">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
