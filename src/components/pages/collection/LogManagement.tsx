import { useState, useEffect } from 'react';
import { Search, Eye, Download, User, Activity, Monitor } from 'lucide-react';

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
  const [activeLogTab, setActiveLogTab] = useState<'access' | 'activity' | 'other'>('access');
  const [logSearchText, setLogSearchText] = useState('');
  const [logUserFilter, setLogUserFilter] = useState('all');
  const [logActionFilter, setLogActionFilter] = useState('all');
  const [logDateFrom, setLogDateFrom] = useState('');
  const [logDateTo, setLogDateTo] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [showLogDetailModal, setShowLogDetailModal] = useState(false);

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

  /* 
   * Move useEffect after activityLogs declaration
   */
  useEffect(() => {
    if (initialOpenLogId) {
      setActiveLogTab('activity');
      const logToOpen = activityLogs.find(l => l.id === initialOpenLogId);
      if (logToOpen) {
        setSelectedLog(logToOpen);
        setShowLogDetailModal(true);
      }
    }
  }, [initialOpenLogId]);

  // Mock data cho thông tin khác
  const otherLogs: LogEntry[] = [
    {
      id: 1,
      user: 'admin',
      userName: 'Nguyễn Văn A',
      action: 'Thông tin thiết bị',
      module: 'Hệ thống',
      timestamp: '2023-12-19 08:30:15',
      ip: '192.168.1.100',
      device: 'Windows 10 Pro - Version 22H2',
      browser: 'Chrome 120.0.6099.129',
      status: 'Active',
      statusColor: 'bg-blue-100 text-blue-700',
      details: 'Độ phân giải: 1920x1080, Timezone: UTC+7'
    },
    {
      id: 2,
      user: 'user1',
      userName: 'Trần Thị B',
      action: 'Thông tin kết nối',
      module: 'Hệ thống',
      timestamp: '2023-12-19 09:15:42',
      ip: '192.168.1.101',
      device: 'MacOS Sonoma 14.2',
      browser: 'Safari 17.2 (WebKit)',
      status: 'Active',
      statusColor: 'bg-blue-100 text-blue-700',
      details: 'ISP: VNPT, Location: Hà Nội, VN'
    },
    {
      id: 3,
      user: 'user2',
      userName: 'Lê Văn C',
      action: 'Thông tin phiên làm việc',
      module: 'Hệ thống',
      timestamp: '2023-12-19 10:20:33',
      ip: '192.168.1.102',
      device: 'Ubuntu 22.04 LTS',
      browser: 'Firefox 121.0',
      status: 'Expired',
      statusColor: 'bg-slate-100 text-slate-700',
      details: 'Session timeout: 30 phút, Last activity: 12:20:33'
    },
  ];

  const getCurrentLogs = () => {
    switch (activeLogTab) {
      case 'access':
        return accessLogs;
      case 'activity':
        return activityLogs;
      case 'other':
        return otherLogs;
      default:
        return accessLogs;
    }
  };

  const filteredLogs = getCurrentLogs().filter(log => {
    const matchSearch = logSearchText === '' || 
      log.user.toLowerCase().includes(logSearchText.toLowerCase()) ||
      log.userName.toLowerCase().includes(logSearchText.toLowerCase()) ||
      log.action.toLowerCase().includes(logSearchText.toLowerCase()) ||
      log.ip.toLowerCase().includes(logSearchText.toLowerCase());
    
    const matchUser = logUserFilter === 'all' || log.user === logUserFilter;
    const matchAction = logActionFilter === 'all' || log.action === logActionFilter;
    
    const matchDate = (!logDateFrom && !logDateTo) ||
      (logDateFrom && log.timestamp >= logDateFrom) ||
      (logDateTo && log.timestamp <= logDateTo);

    return matchSearch && matchUser && matchAction && matchDate;
  });

  const handleExportLogs = () => {
    const tabNames = {
      access: 'Lịch sử truy cập',
      activity: 'Lịch sử hoạt động',
      other: 'Thông tin khác'
    };
    alert(`Đang kết xuất "${tabNames[activeLogTab]}" ra file Excel...`);
  };

  return (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveLogTab('access')}
              className={`pb-3 pt-4 text-sm transition-colors border-b-2 flex items-center gap-2 ${
                activeLogTab === 'access'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              Lịch sử truy cập
            </button>
            <button
              onClick={() => setActiveLogTab('activity')}
              className={`pb-3 pt-4 text-sm transition-colors border-b-2 flex items-center gap-2 ${
                activeLogTab === 'activity'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              Lịch sử hoạt động
            </button>
            <button
              onClick={() => setActiveLogTab('other')}
              className={`pb-3 pt-4 text-sm transition-colors border-b-2 flex items-center gap-2 ${
                activeLogTab === 'other'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Thông tin khác
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 space-y-3 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input aria-label="Input field"
                type="text"
                placeholder="Tìm kiếm người dùng, hành động, IP..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={logSearchText}
                onChange={(e) => setLogSearchText(e.target.value)}
              />
            </div>
            <select aria-label="Select box"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={logUserFilter}
              onChange={(e) => setLogUserFilter(e.target.value)}
            >
              <option value="all">Tất cả người dùng</option>
              <option value="admin">admin</option>
              <option value="user1">user1</option>
              <option value="user2">user2</option>
            </select>
            <select aria-label="Select box"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={logActionFilter}
              onChange={(e) => setLogActionFilter(e.target.value)}
            >
              <option value="all">Tất cả hành động</option>
              {activeLogTab === 'access' && (
                <>
                  <option value="Đăng nhập">Đăng nhập</option>
                  <option value="Đăng xuất">Đăng xuất</option>
                  <option value="Truy cập Dashboard">Truy cập Dashboard</option>
                </>
              )}
              {activeLogTab === 'activity' && (
                <>
                  <option value="Thêm dịch vụ mới">Thêm dịch vụ mới</option>
                  <option value="Cập nhật dịch vụ">Cập nhật dịch vụ</option>
                  <option value="Xóa dịch vụ">Xóa dịch vụ</option>
                  <option value="Kết xuất báo cáo">Kết xuất báo cáo</option>
                  <option value="Cài đặt dịch vụ">Cài đặt dịch vụ</option>
                  <option value="Kiểm tra kết nối dịch vụ">Kiểm tra kết nối dịch vụ</option>
                </>
              )}
              {activeLogTab === 'other' && (
                <>
                  <option value="Thông tin thiết bị">Thông tin thiết bị</option>
                  <option value="Thông tin kết nối">Thông tin kết nối</option>
                  <option value="Thông tin phiên làm việc">Thông tin phiên làm việc</option>
                </>
              )}
            </select>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
              onClick={handleExportLogs}
            >
              <Download className="w-4 h-4" />
              Kết xuất
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">Từ ngày</label>
              <input aria-label="Input field"
                type="datetime-local"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={logDateFrom}
                onChange={(e) => setLogDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Đến ngày</label>
              <input aria-label="Input field"
                type="datetime-local"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={logDateTo}
                onChange={(e) => setLogDateTo(e.target.value)}
              />
            </div>
            <div className="col-span-2 flex items-end">
              <div className="text-sm text-slate-600">
                Tổng số: <span className="font-medium text-blue-600">{filteredLogs.length}</span> bản ghi
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">STT</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Người dùng</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Hành động</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Thời gian</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">IP</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Trình duyệt</th>
                {activeLogTab === 'other' && (
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Thiết bị</th>
                )}
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-center text-xs text-slate-600 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log, index) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm text-blue-600">{log.user}</div>
                      <div className="text-xs text-slate-500">{log.userName}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">{log.action}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{log.timestamp}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 font-mono">{log.ip}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{log.browser}</td>
                  {activeLogTab === 'other' && (
                    <td className="px-4 py-3 text-sm text-slate-600">{log.device}</td>
                  )}
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded text-xs ${log.statusColor}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Xem chi tiết"
                        onClick={() => {
                          setSelectedLog(log);
                          setShowLogDetailModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={activeLogTab === 'other' ? 9 : 8} className="px-4 py-8 text-center text-sm text-slate-500">
                    Không tìm thấy kết quả phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                onClick={() => setShowLogDetailModal(false)}
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
                  <label className="block text-xs text-slate-500 mb-1">Trạng thái</label>
                  <span className={`inline-flex px-2 py-1 rounded text-xs ${selectedLog.statusColor}`}>
                    {selectedLog.status}
                  </span>
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
                <h3 className="text-sm text-slate-700 mb-3">Thông tin kết nối</h3>
                <div className="space-y-3">
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
              </div>

              <div className="border-t border-slate-200 pt-4">
                <label className="block text-xs text-slate-500 mb-1">Chi tiết</label>
                <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded">{selectedLog.details}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => setShowLogDetailModal(false)}
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