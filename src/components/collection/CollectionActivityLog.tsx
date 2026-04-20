import { useState } from 'react';
import { Search, Filter, Download, Eye, Calendar } from 'lucide-react';

interface ActivityLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  method: string;
  ministry: string;
  status: 'success' | 'failed';
  details: string;
  ipAddress: string;
  browser: string;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-slate-900 mb-1">Quản lý nhật ký thu thập dữ liệu</h2>
        <p className="text-slate-500 text-sm">Theo dõi và quản lý các hoạt động liên quan đến thu thập dữ liệu</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input aria-label="Input field"
                type="text"
                placeholder="Tìm kiếm theo người dùng, hành động, phương thức..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filter Action */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select aria-label="Select box" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
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
            <select aria-label="Select box" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="flex items-center text-slate-400">-</span>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input aria-label="Input field"
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Filter Status */}
          <div>
            <select aria-label="Select box" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tất cả trạng thái</option>
              <option value="success">Thành công</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>

          {/* Export */}
          <div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" />
              Kết xuất
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Tìm thấy <span className="font-medium">{activityLogs.length}</span> nhật ký</p>
      </div>

      {/* Activity Log Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Hành động</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Phương thức</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Bộ ban ngành</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-900">{log.timestamp}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{log.user}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{log.method}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{log.ministry}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs ${
                      log.status === 'success' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {log.status === 'success' ? 'Thành công' : 'Thất bại'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
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
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-slate-900">Chi tiết nhật ký hoạt động</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <span className="text-slate-500">&times;</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Thời gian</p>
                  <p className="text-sm text-slate-900">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Người dùng</p>
                  <p className="text-sm text-slate-900">{selectedLog.user}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Hành động</p>
                  <p className="text-sm text-slate-900">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Trạng thái</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs ${
                    selectedLog.status === 'success' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedLog.status === 'success' ? 'Thành công' : 'Thất bại'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phương thức</p>
                  <p className="text-sm text-slate-900">{selectedLog.method}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Bộ ban ngành</p>
                  <p className="text-sm text-slate-900">{selectedLog.ministry}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Địa chỉ IP</p>
                  <p className="text-sm text-slate-900">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Trình duyệt</p>
                  <p className="text-sm text-slate-900">{selectedLog.browser}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Chi tiết</p>
                <p className="text-sm text-slate-900">{selectedLog.details}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
