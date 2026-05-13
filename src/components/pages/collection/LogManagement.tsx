import { useState, useEffect } from 'react';
import { Search, Eye, Download, User, Activity, Monitor, Filter, X, Calendar } from 'lucide-react';
import { StatusTag } from '../../common/StatusTag';

interface LogEntry {
  id: number;
  user: string;
  userName: string;
  action: string;
  module: string;
  timestamp: string;
  ip: string;
  device: string;
  browser: string;
  status: string;
  statusColor: string;
  details: string;
}

export function LogManagement({ initialOpenLogId }: { initialOpenLogId?: number | null }) {
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [logSearchText, setLogSearchText] = useState('');
  const [logUserFilter, setLogUserFilter] = useState('all');
  const [logActionFilter, setLogActionFilter] = useState('all');
  const [logDateFrom, setLogDateFrom] = useState('');
  const [logDateTo, setLogDateTo] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [showLogDetailModal, setShowLogDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data cho lịch sử truy cập
  const accessLogs: LogEntry[] = [
    {
      id: 1,
      user: 'admin',
      userName: 'Nguyễn Văn A',
      action: 'Đăng nhập',
      module: 'Hệ thống',
      timestamp: '2023-12-19 08:30:15',
      ip: '192.168.1.100',
      device: 'Windows 10',
      browser: 'Chrome 120.0',
      status: 'Thành công',
      statusColor: 'bg-green-100 text-green-700',
      details: 'Đăng nhập thành công vào hệ thống'
    },
    {
      id: 2,
      user: 'user1',
      userName: 'Trần Thị B',
      action: 'Đăng nhập',
      module: 'Hệ thống',
      timestamp: '2023-12-19 09:15:42',
      ip: '192.168.1.101',
      device: 'MacOS 14',
      browser: 'Safari 17.0',
      status: 'Thất bại',
      statusColor: 'bg-red-100 text-red-700',
      details: 'Sai mật khẩu - Lần thử thứ 2'
    },
    {
      id: 3,
      user: 'user2',
      userName: 'Lê Văn C',
      action: 'Đăng xuất',
      module: 'Hệ thống',
      timestamp: '2023-12-19 10:20:33',
      ip: '192.168.1.102',
      device: 'Ubuntu 22.04',
      browser: 'Firefox 121.0',
      status: 'Thành công',
      statusColor: 'bg-green-100 text-green-700',
      details: 'Đăng xuất khỏi hệ thống'
    },
  ];

  // Mock data cho lịch sử hoạt động
  const activityLogs: LogEntry[] = [
    {
      id: 1,
      user: 'admin',
      userName: 'Nguyễn Văn A',
      action: 'Thêm dịch vụ mới',
      module: 'Thiết lập dịch vụ',
      timestamp: '2023-12-19 08:45:30',
      ip: '192.168.1.100',
      device: 'Windows 10',
      browser: 'Chrome 120.0',
      status: 'Thành công',
      statusColor: 'bg-green-100 text-green-700',
      details: 'Thêm dịch vụ CSDL A (Mã: SVC001)'
    },
    {
      id: 2,
      user: 'user1',
      userName: 'Trần Thị B',
      action: 'Cập nhật dịch vụ',
      module: 'Thiết lập dịch vụ',
      timestamp: '2023-12-19 09:30:15',
      ip: '192.168.1.101',
      device: 'MacOS 14',
      browser: 'Safari 17.0',
      status: 'Thành công',
      statusColor: 'bg-green-100 text-green-700',
      details: 'Cập nhật thông tin dịch vụ CSDL B (Mã: SVC002)'
    },
    {
      id: 3,
      user: 'user2',
      userName: 'Lê Văn C',
      action: 'Xóa dịch vụ',
      module: 'Thiết lập dịch vụ',
      timestamp: '2023-12-19 10:15:45',
      ip: '192.168.1.102',
      device: 'Ubuntu 22.04',
      browser: 'Firefox 121.0',
      status: 'Thất bại',
      statusColor: 'bg-red-100 text-red-700',
      details: 'Không có quyền xóa dịch vụ SVC003'
    },
    {
      id: 4,
      user: 'admin',
      userName: 'Nguyễn Văn A',
      action: 'Kết xuất báo cáo',
      module: 'Dashboard',
      timestamp: '2023-12-19 11:20:10',
      ip: '192.168.1.100',
      device: 'Windows 10',
      browser: 'Chrome 120.0',
      status: 'Thành công',
      statusColor: 'bg-green-100 text-green-700',
      details: 'Kết xuất biểu đồ "Phương thức thu thập"'
    },
    {
      id: 5,
      user: 'user1',
      userName: 'Trần Thị B',
      action: 'Cài đặt dịch vụ',
      module: 'Thiết lập dịch vụ',
      timestamp: '2023-12-19 14:30:25',
      ip: '192.168.1.101',
      device: 'MacOS 14',
      browser: 'Safari 17.0',
      status: 'Thành công',
      statusColor: 'bg-green-100 text-green-700',
      details: 'Cấu hình thời gian thu thập cho dịch vụ CSDL A'
    },
    {
      id: 6,
      user: 'admin',
      userName: 'Nguyễn Văn A',
      action: 'Kiểm tra kết nối dịch vụ',
      module: 'Thiết lập dịch vụ',
      timestamp: '2024-04-12 14:00:15',
      ip: '192.168.1.100',
      device: 'Windows 10',
      browser: 'Chrome 120.0',
      status: 'Thất bại',
      statusColor: 'bg-red-100 text-red-700',
      details: 'Lỗi kết nối dịch vụ - Quá thời gian quy định (Timeout) khi reach tới endpoint https://ndxp.gov.vn/api/v1/data (vượt 3000ms).'
    },
    {
      id: 7,
      user: 'admin',
      userName: 'Nguyễn Văn A',
      action: 'Kiểm tra kết nối dịch vụ',
      module: 'Thiết lập dịch vụ',
      timestamp: '2024-04-12 14:05:30',
      ip: '192.168.1.100',
      device: 'Windows 10',
      browser: 'Chrome 120.0',
      status: 'Thất bại',
      statusColor: 'bg-red-100 text-red-700',
      details: 'Lỗi dữ liệu/Cấu trúc gói tin - Phản hồi HTTP 200 nhưng payload rỗng hoặc sai cấu trúc cần thiết.'
    },
  ];

  const allLogs = [
    ...activityLogs,
    ...accessLogs.map(l => ({...l, id: l.id + 1000}))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  useEffect(() => {
    if (initialOpenLogId) {
      const logToOpen = allLogs.find(l => l.id === initialOpenLogId);
      if (logToOpen) {
        setSelectedLog(logToOpen);
        setShowLogDetailModal(true);
      }
    }
  }, [initialOpenLogId]);

  const filteredLogs = allLogs.filter(log => {
    const matchSearch = logSearchText === '' || 
      log.user.toLowerCase().includes(logSearchText.toLowerCase()) ||
      log.userName.toLowerCase().includes(logSearchText.toLowerCase()) ||
      log.action.toLowerCase().includes(logSearchText.toLowerCase());
    
    const matchUser = logUserFilter === 'all' || log.user === logUserFilter;
    const matchAction = logActionFilter === 'all' || log.action === logActionFilter;
    
    const matchDate = (!logDateFrom && !logDateTo) ||
      (logDateFrom && log.timestamp >= logDateFrom) ||
      (logDateTo && log.timestamp <= logDateTo);

    return matchSearch && matchUser && matchAction && matchDate;
  });

  const handleExportLogs = () => {
    alert(`Đang kết xuất nhật ký ra file Excel...`);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 space-y-4 bg-white">
          {/* Row 1: Search and Buttons */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-3">
              <div className="relative flex-1">
                <input aria-label="Input field"
                  type="text"
                  placeholder="Tìm kiếm người dùng, hành động..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  value={logSearchText}
                  onChange={(e) => setLogSearchText(e.target.value)}
                />
              </div>
              <button className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm flex items-center justify-center">
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                title="Bộ lọc"
              >
                {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm font-medium"
                onClick={handleExportLogs}
              >
                <Download className="w-4 h-4" />
                Kết xuất
              </button>
            </div>
          </div>

          {/* Row 2: Detailed Filters (Collapsible) */}
          {showFilters && (
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
              <div className="absolute -top-2 left-[480px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>

              <div className="space-y-1.5 relative z-10">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Người dùng</label>
                <select aria-label="Select box"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  value={logUserFilter}
                  onChange={(e) => setLogUserFilter(e.target.value)}
                >
                  <option value="all">Tất cả người dùng</option>
                  <option value="admin">admin</option>
                  <option value="user1">user1</option>
                  <option value="user2">user2</option>
                </select>
              </div>

              <div className="space-y-1.5 relative z-10">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Hành động</label>
                <select aria-label="Select box"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  value={logActionFilter}
                  onChange={(e) => setLogActionFilter(e.target.value)}
                >
                  <option value="all">Tất cả hành động</option>
                  <option value="Đăng nhập">Đăng nhập</option>
                  <option value="Đăng xuất">Đăng xuất</option>
                  <option value="Thêm dịch vụ mới">Thêm dịch vụ mới</option>
                  <option value="Cập nhật dịch vụ">Cập nhật dịch vụ</option>
                  <option value="Xóa dịch vụ">Xóa dịch vụ</option>
                  <option value="Kết xuất báo cáo">Kết xuất báo cáo</option>
                  <option value="Cài đặt dịch vụ">Cài đặt dịch vụ</option>
                  <option value="Kiểm tra kết nối dịch vụ">Kiểm tra kết nối dịch vụ</option>
                </select>
              </div>

              <div className="space-y-1.5 relative z-10">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Từ ngày</label>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                  <input aria-label="Input field"
                    type="date"
                    className="w-full border-0 bg-transparent text-sm focus:outline-none text-slate-700 p-0"
                    value={logDateFrom}
                    onChange={(e) => setLogDateFrom(e.target.value)}
                  />
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>

              <div className="space-y-1.5 relative z-10">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Đến ngày</label>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                  <input aria-label="Input field"
                    type="date"
                    className="w-full border-0 bg-transparent text-sm focus:outline-none text-slate-700 p-0"
                    value={logDateTo}
                    onChange={(e) => setLogDateTo(e.target.value)}
                  />
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="text-sm text-slate-500">
              Tổng số: <span className="font-semibold text-blue-600">{filteredLogs.length}</span> bản ghi
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-12">STT</th>
                  <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Người dùng</th>
                  <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Hành động</th>
                  <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-40">Thời gian</th>
                  <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-28">Trạng thái</th>
                  <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-20">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log, index) => (
                  <tr key={log.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-4 py-4 text-center text-sm text-slate-500 font-medium">{(index + 1).toString().padStart(2, '0')}</td>
                    <td className="px-4 py-4 text-center">
                      <div>
                        <div className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer transition-colors">{log.user}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{log.userName}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="text-sm font-semibold text-slate-900">{log.action}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{log.module}</div>
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-slate-500 font-medium font-mono whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-4 text-center">
                      <StatusTag 
                        label={log.status} 
                        variant={log.status === 'Thành công' || log.status === 'Active' ? 'green' : log.status === 'Thất bại' ? 'red' : 'slate'} 
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                        title="Xem chi tiết"
                        onClick={() => {
                          setSelectedLog(log);
                          setShowExtraInfo(false);
                          setShowLogDetailModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-300">
                        <Search className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm font-medium">Không tìm thấy kết quả phù hợp</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showLogDetailModal && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg text-slate-900">Chi tiết nhật ký</h2>
              <button
                onClick={() => {
                  setShowLogDetailModal(false);
                  setShowExtraInfo(false);
                }}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <span className="sr-only">Đóng</span>
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">ID nhật ký</label>
                  <p className="text-sm text-slate-900">#{selectedLog.id}</p>
                </div>
                <div>
                  <StatusTag 
                    label={selectedLog.status} 
                    variant={selectedLog.status === 'Thành công' || selectedLog.status === 'Active' ? 'green' : selectedLog.status === 'Thất bại' ? 'red' : 'slate'} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Tên đăng nhập</label>
                  <p className="text-sm text-slate-900">{selectedLog.user}</p>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Họ và tên</label>
                  <p className="text-sm text-slate-900">{selectedLog.userName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Hành động</label>
                  <p className="text-sm text-slate-900">{selectedLog.action}</p>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Module</label>
                  <p className="text-sm text-slate-900">{selectedLog.module}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Thời gian</label>
                <p className="text-sm text-slate-900">{selectedLog.timestamp}</p>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <label className="block text-xs text-slate-500 mb-1">Chi tiết</label>
                <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded">{selectedLog.details}</p>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <button
                  onClick={() => setShowExtraInfo(!showExtraInfo)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                >
                  <Monitor className="w-4 h-4" />
                  {showExtraInfo ? 'Ẩn thông tin khác' : 'Xem thông tin khác'}
                </button>
                
                {showExtraInfo && (
                  <div className="mt-4 bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-100 animate-in slide-in-from-top-2">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Địa chỉ IP</label>
                      <p className="text-sm text-slate-900 font-mono">{selectedLog.ip}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Thiết bị</label>
                      <p className="text-sm text-slate-900">{selectedLog.device}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Trình duyệt</label>
                      <p className="text-sm text-slate-900">{selectedLog.browser}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setShowLogDetailModal(false);
                  setShowExtraInfo(false);
                }}
                className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
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