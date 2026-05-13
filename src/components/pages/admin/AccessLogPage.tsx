import { useState } from 'react';
import { 
  ScrollText, 
  Search, 
  Download, 
  Calendar, 
  Filter, 
  Eye, 
  X,
  Clock,
  User,
  Monitor,
  MapPin,
  Activity,
  FileText,
  Edit2,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { StatsCard } from '../../common/StatsCard';
import { StatusTag } from '../../common/StatusTag';

interface AccessLog {
  id: number;
  sessionId: string;
  timestamp: string;
  user: string;
  userId: string;
  ip: string;
  action: string;
  module: string;
  status: 'success' | 'failed';
  duration: string;
  userAgent: string;
  device: string;
  browser: string;
  location: string;
}

interface ActionDetail {
  id: string;
  time: string;
  action: string;
  module: string;
  target: string;
  status: 'success' | 'failed';
  type: 'create' | 'update' | 'delete' | 'view' | 'export';
  description: string;
}

const accessLogs: AccessLog[] = [
  { 
    id: 1, 
    sessionId: 'sess_1234567890abc',
    timestamp: '09/12/2025 14:25:33', 
    user: 'Nguyễn Văn An', 
    userId: 'user_001',
    ip: '192.168.1.100', 
    action: 'Đăng nhập hệ thống', 
    module: 'Authentication', 
    status: 'success', 
    duration: '0.5s', 
    userAgent: 'Chrome/120.0.0.0',
    device: 'Windows 11',
    browser: 'Chrome 120.0.0',
    location: 'Hà Nội, Việt Nam'
  },
  { 
    id: 2, 
    sessionId: 'sess_2345678901bcd',
    timestamp: '09/12/2025 14:24:12', 
    user: 'Trần Thị Bình', 
    userId: 'user_002',
    ip: '192.168.1.101', 
    action: 'Đăng nhập hệ thống', 
    module: 'Authentication', 
    status: 'success', 
    duration: '1.2s', 
    userAgent: 'Firefox/121.0',
    device: 'Windows 10',
    browser: 'Firefox 121.0',
    location: 'Hà Nội, Việt Nam'
  },
  { 
    id: 3, 
    sessionId: 'sess_3456789012cde',
    timestamp: '09/12/2025 14:22:45', 
    user: 'Lê Văn Cường', 
    userId: 'user_003',
    ip: '192.168.1.102', 
    action: 'Đăng nhập thất bại', 
    module: 'Authentication', 
    status: 'failed', 
    duration: '2.1s', 
    userAgent: 'Edge/120.0.0.0',
    device: 'Windows 11',
    browser: 'Edge 120.0.0',
    location: 'Hà Nội, Việt Nam'
  },
  { 
    id: 4, 
    sessionId: 'sess_4567890123def',
    timestamp: '09/12/2025 14:20:18', 
    user: 'Phạm Thị Dung', 
    userId: 'user_004',
    ip: '192.168.1.103', 
    action: 'Đăng nhập hệ thống', 
    module: 'Authentication', 
    status: 'success', 
    duration: '3.5s', 
    userAgent: 'Chrome/120.0.0.0',
    device: 'MacOS 14',
    browser: 'Chrome 120.0.0',
    location: 'Hồ Chí Minh, Việt Nam'
  },
  { 
    id: 5, 
    sessionId: 'sess_5678901234efg',
    timestamp: '09/12/2025 14:18:55', 
    user: 'Hoàng Văn Em', 
    userId: 'user_005',
    ip: '192.168.1.104', 
    action: 'Đăng nhập hệ thống', 
    module: 'Authentication', 
    status: 'success', 
    duration: '5.2s', 
    userAgent: 'Safari/17.2',
    device: 'MacOS 14',
    browser: 'Safari 17.2',
    location: 'Đà Nẵng, Việt Nam'
  },
];

// Mock action details for each session
const getSessionActions = (sessionId: string): ActionDetail[] => {
  const actionsBySession: Record<string, ActionDetail[]> = {
    'sess_1234567890abc': [
      {
        id: '1',
        time: '14:25:35',
        action: 'Xem',
        module: 'Dashboard',
        target: 'Trang tổng quan',
        status: 'success',
        type: 'view',
        description: 'Truy cập trang Dashboard tổng quan hệ thống'
      },
      {
        id: '2',
        time: '14:26:12',
        action: 'Xem',
        module: 'Quản lý người dùng',
        target: 'Danh sách người dùng',
        status: 'success',
        type: 'view',
        description: 'Xem danh sách người dùng trong hệ thống'
      },
      {
        id: '3',
        time: '14:27:45',
        action: 'Cập nhật',
        module: 'Quản lý người dùng',
        target: 'User #125',
        status: 'success',
        type: 'update',
        description: 'Cập nhật thông tin người dùng Trần Thị B'
      },
      {
        id: '4',
        time: '14:28:30',
        action: 'Tạo mới',
        module: 'Quản lý nhóm',
        target: 'Group #15',
        status: 'success',
        type: 'create',
        description: 'Tạo nhóm người dùng "Kiểm tra dữ liệu"'
      },
      {
        id: '5',
        time: '14:30:15',
        action: 'Xuất',
        module: 'Báo cáo',
        target: 'Report_Users.xlsx',
        status: 'success',
        type: 'export',
        description: 'Xuất báo cáo danh sách người dùng'
      }
    ],
    'sess_2345678901bcd': [
      {
        id: '1',
        time: '14:24:15',
        action: 'Xem',
        module: 'Dashboard',
        target: 'Trang tổng quan',
        status: 'success',
        type: 'view',
        description: 'Truy cập trang Dashboard'
      },
      {
        id: '2',
        time: '14:25:30',
        action: 'Xem',
        module: 'Thu thập dữ liệu',
        target: 'Danh sách nguồn',
        status: 'success',
        type: 'view',
        description: 'Xem danh sách nguồn dữ liệu'
      },
      {
        id: '3',
        time: '14:26:45',
        action: 'Cập nhật',
        module: 'Thu thập dữ liệu',
        target: 'Source #8',
        status: 'success',
        type: 'update',
        description: 'Cập nhật cấu hình nguồn dữ liệu đăng ký DN'
      },
      {
        id: '4',
        time: '14:28:20',
        action: 'Xem',
        module: 'Xử lý dữ liệu',
        target: 'Log xử lý',
        status: 'success',
        type: 'view',
        description: 'Kiểm tra log xử lý dữ liệu'
      }
    ],
    'sess_3456789012cde': [
      {
        id: '1',
        time: '14:22:45',
        action: 'Đăng nhập',
        module: 'Authentication',
        target: 'Login',
        status: 'failed',
        type: 'view',
        description: 'Đăng nhập thất bại - Sai mật khẩu'
      }
    ],
    'sess_4567890123def': [
      {
        id: '1',
        time: '14:20:20',
        action: 'Xem',
        module: 'Dashboard',
        target: 'Trang tổng quan',
        status: 'success',
        type: 'view',
        description: 'Truy cập Dashboard'
      },
      {
        id: '2',
        time: '14:21:35',
        action: 'Xem',
        module: 'Báo cáo',
        target: 'Thống kê tháng',
        status: 'success',
        type: 'view',
        description: 'Xem báo cáo thống kê tháng 11/2024'
      },
      {
        id: '3',
        time: '14:23:50',
        action: 'Xuất',
        module: 'Báo cáo',
        target: 'Statistics_Nov2024.xlsx',
        status: 'success',
        type: 'export',
        description: 'Xuất báo cáo thống kê dạng Excel'
      }
    ],
    'sess_5678901234efg': [
      {
        id: '1',
        time: '14:19:00',
        action: 'Xem',
        module: 'Dashboard',
        target: 'Trang tổng quan',
        status: 'success',
        type: 'view',
        description: 'Truy cập Dashboard'
      },
      {
        id: '2',
        time: '14:20:15',
        action: 'Xem',
        module: 'Quản lý danh mục',
        target: 'Danh sách danh mục',
        status: 'success',
        type: 'view',
        description: 'Xem danh sách danh mục dữ liệu'
      },
      {
        id: '3',
        time: '14:21:40',
        action: 'Xóa',
        module: 'Quản lý danh mục',
        target: 'Category #12',
        status: 'success',
        type: 'delete',
        description: 'Xóa danh mục không còn sử dụng'
      },
      {
        id: '4',
        time: '14:23:25',
        action: 'Xuất',
        module: 'Quản lý danh mục',
        target: 'Categories_Export.xlsx',
        status: 'success',
        type: 'export',
        description: 'Xuất danh sách danh mục'
      }
    ]
  };

  return actionsBySession[sessionId] || [];
};

export function AccessLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredLogs = accessLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetail = (log: AccessLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedLog(null);
  };

  const getActionIcon = (type: ActionDetail['type']) => {
    switch (type) {
      case 'create':
        return <Plus className="w-4 h-4" />;
      case 'update':
        return <Edit2 className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      case 'view':
        return <Eye className="w-4 h-4" />;
      case 'export':
        return <Download className="w-4 h-4" />;
    }
  };

  const getActionColor = (type: ActionDetail['type']) => {
    switch (type) {
      case 'create':
        return 'bg-green-100 text-green-700';
      case 'update':
        return 'bg-blue-100 text-blue-700';
      case 'delete':
        return 'bg-red-100 text-red-700';
      case 'view':
        return 'bg-purple-100 text-purple-700';
      case 'export':
        return 'bg-orange-100 text-orange-700';
    }
  };

  const sessionActions = selectedLog ? getSessionActions(selectedLog.sessionId) : [];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard icon={ScrollText} iconColor="blue" title="Tổng truy cập (24h)" value="12,847" />
        <StatsCard icon={ScrollText} iconColor="green" title="Thành công" value="12,654" />
        <StatsCard icon={ScrollText} iconColor="red" title="Thất bại" value="193" />
        <StatsCard icon={ScrollText} iconColor="purple" title="Người dùng hoạt động" value="847" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm người dùng, hành động..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2">
              <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 outline-none text-sm"
                placeholder="Từ ngày"
              />
              <span className="text-slate-400">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 outline-none text-sm"
                placeholder="Đến ngày"
              />
            </div>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="success">Thành công</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Lọc
          </button>
          <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-slate-900">Nhật ký truy cập ({filteredLogs.length} bản ghi)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">IP</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Hành động</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thiết bị</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-700">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{log.user}</div>
                    <div className="text-xs text-slate-500 font-mono">{log.userId}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{log.ip}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{log.action}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{log.device}</div>
                    <div className="text-xs text-slate-500">{log.browser}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusTag 
                      label={log.status === 'success' ? 'Thành công' : 'Thất bại'} 
                      variant={log.status === 'success' ? 'green' : 'red'} 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleViewDetail(log)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Hiển thị 1-{filteredLogs.length} trong tổng số 12,847 bản ghi
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50">Trước</button>
            <button title="Hành động" aria-label="Hành động" className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
            <button title="Hành động" aria-label="Hành động" className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50">2</button>
            <button title="Hành động" aria-label="Hành động" className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50">3</button>
            <button className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50">Sau</button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-slate-900">Chi tiết phiên truy cập</h3>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Session ID: <span className="font-mono">{selectedLog.sessionId}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={closeDetailModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Session Info */}
            <div className="p-6 border-b border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-xs">Người dùng</span>
                  </div>
                  <div className="text-sm text-slate-900">{selectedLog.user}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">{selectedLog.userId}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Thời gian đăng nhập</span>
                  </div>
                  <div className="text-sm text-slate-900">{selectedLog.timestamp}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <Monitor className="w-4 h-4" />
                    <span className="text-xs">Thiết bị</span>
                  </div>
                  <div className="text-sm text-slate-900">{selectedLog.device}</div>
                  <div className="text-xs text-slate-500 mt-1">{selectedLog.browser}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">Vị trí</span>
                  </div>
                  <div className="text-sm text-slate-900">{selectedLog.location}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">{selectedLog.ip}</div>
                </div>
              </div>
            </div>

            {/* Actions Timeline */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="text-slate-900">Lịch sử thao tác trong phiên</h4>
                <StatusTag label={`${sessionActions.length} hành động`} variant="blue" />
              </div>

              {sessionActions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  Không có thao tác nào trong phiên này
                </div>
              ) : (
                <div className="space-y-3">
                  {sessionActions.map((action) => (
                    <div
                      key={action.id}
                      className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActionColor(action.type)}`}>
                          {getActionIcon(action.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <StatusTag label={action.action} variant={action.type === 'create' ? 'green' : action.type === 'update' ? 'blue' : action.type === 'delete' ? 'red' : action.type === 'view' ? 'purple' : 'orange'} />
                                <span className="text-sm text-slate-900">{action.module}</span>
                                {action.status === 'success' ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                              <div className="text-sm text-slate-700">{action.description}</div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              {action.time}
                            </div>
                          </div>

                          {/* Target */}
                          <div className="text-xs text-slate-600 mt-2">
                            <span className="text-slate-500">Đối tượng:</span>{' '}
                            <span className="font-mono text-slate-900">{action.target}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Activity className="w-4 h-4" />
                  <span>
                    Tổng thời gian hoạt động:{' '}
                    <strong className="text-slate-900">
                      {sessionActions.length > 0 ? '8 phút 42 giây' : '0 giây'}
                    </strong>
                  </span>
                </div>
                <button
                  onClick={closeDetailModal}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}