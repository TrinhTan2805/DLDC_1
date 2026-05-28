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

export function LoginLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    const [datePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredLogs = accessLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ip.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    
    let matchesDate = true;
    if (startDate || endDate) {
      const logDate = parseDate(log.timestamp);
      if (logDate) {
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (logDate < start) matchesDate = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (logDate > end) matchesDate = false;
        }
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
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
    <div className="space-y-6" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard icon={ScrollText} iconColor="blue" title="Tổng truy cập (24h)" value="12,847" />
        <StatsCard icon={ScrollText} iconColor="green" title="Thành công" value="12,654" />
        <StatsCard icon={ScrollText} iconColor="red" title="Thất bại" value="193" />
        <StatsCard icon={ScrollText} iconColor="purple" title="Người dùng hoạt động" value="847" />
      </div>

      {/* Filters and Actions */}
      <div className="mb-6">
        {/* Row 1: Search and Buttons */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="relative flex-1">
              <input aria-label="Input field"
                type="text"
                placeholder="Tìm kiếm người dùng, hành động..."
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}
              title="Bộ lọc"
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Đang kết xuất nhật ký đăng nhập ra file Excel...')}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Kết xuất
            </button>
          </div>
        </div>

        {/* Row 2: Filters (Collapsible) */}
        {showFilters && (
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-3 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
            <div className="absolute -top-2 left-[50px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>

            <div className="space-y-1.5 relative z-10">
              <label className="text-[13px] font-medium text-slate-700">Trạng thái</label>
              <select aria-label="Select box"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="success">Thành công</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>

            <div className="space-y-1.5 relative z-10">
              <label className="text-[13px] font-medium text-slate-700">Thời gian từ</label>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                <input aria-label="Input field"
                  type="date"
                  className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-slate-700 p-0"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </div>

            <div className="space-y-1.5 relative z-10">
              <label className="text-[13px] font-medium text-slate-700">Thời gian đến</label>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                <input aria-label="Input field"
                  type="date"
                  className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-slate-700 p-0"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
              <tr>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-12 text-[13px]">STT</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Thời gian</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Người dùng</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">IP</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Hành động</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Thiết bị</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Trạng thái</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-24 text-[13px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((log, index) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                    <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-700 text-[13px]">{log.timestamp}</td>
                    <td className="px-4 py-3 text-center text-[13px]">
                      <div className="font-medium text-slate-950 leading-snug text-[13px]">{log.user}</div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 font-mono text-[13px]">{log.ip}</td>
                    <td className="px-4 py-3 text-center text-slate-700 text-[13px]">{log.action}</td>
                    <td className="px-4 py-3 text-center text-[13px]">
                      <div className="font-medium text-slate-900 leading-snug text-[13px]">{log.device}</div>
                      <div className="text-slate-500 mt-0.5 text-[11px]">{log.browser}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusTag 
                        label={log.status === 'success' ? 'Thành công' : 'Thất bại'} 
                        variant={log.status === 'success' ? 'green' : 'red'} 
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleViewDetail(log)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 text-[13px]">
                    Không tìm thấy bản ghi nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 collection-pagination text-[13px]">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Hiển thị</span>
            <select aria-label="Select record count" 
              className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[13px]"
              title="Số bản ghi trên trang"
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
            <span className="text-slate-600">bản ghi/trang</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              {filteredLogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredLogs.length)} / {filteredLogs.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
              >
                Trước
              </button>
              
              {Array.from({ length: Math.ceil(filteredLogs.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
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
                  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                disabled={currentPage === Math.ceil(filteredLogs.length / itemsPerPage) || filteredLogs.length === 0}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeDetailModal}
        >
          <div 
            className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-slate-900">Chi tiết phiên đăng nhập</h3>
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
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-[13px]"
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