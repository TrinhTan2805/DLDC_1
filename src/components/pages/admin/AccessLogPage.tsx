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
  AlertCircle,
  LogIn
} from 'lucide-react';
import { StatusTag } from '../../common/StatusTag';
import { toast } from 'sonner';

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

interface LoginLog {
  id: number;
  timestamp: string;
  username: string;
  fullName: string;
  ip: string;
  status: 'success' | 'failed';
  reason?: string;
  device: string;
  browser: string;
  location: string;
}

const accessLogs: AccessLog[] = [
  { 
    id: 1, 
    sessionId: 'sess_1234567890abc',
    timestamp: '09/12/2025 14:25:33', 
    user: 'Nguyễn Văn An', 
    userId: 'user_001',
    ip: '192.168.1.100', 
    action: 'Xem danh sách người dùng', 
    module: 'Quản trị hệ thống', 
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
    action: 'Cập nhật nguồn dữ liệu', 
    module: 'Thu thập dữ liệu', 
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
    action: 'Yêu cầu truy cập tài nguyên', 
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
    action: 'Xuất báo cáo thống kê', 
    module: 'Báo cáo', 
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
    action: 'Xóa danh mục dữ liệu', 
    module: 'Quản lý danh mục', 
    status: 'success', 
    duration: '5.2s', 
    userAgent: 'Safari/17.2',
    device: 'MacOS 14',
    browser: 'Safari 17.2',
    location: 'Đà Nẵng, Việt Nam'
  },
];

const loginLogs: LoginLog[] = [
  {
    id: 1,
    timestamp: '09/12/2025 14:25:33',
    username: 'an.nv',
    fullName: 'Nguyễn Văn An',
    ip: '192.168.1.100',
    status: 'success',
    device: 'Windows 11',
    browser: 'Chrome 120.0.0',
    location: 'Hà Nội, Việt Nam'
  },
  {
    id: 2,
    timestamp: '09/12/2025 14:24:12',
    username: 'binh.tt',
    fullName: 'Trần Thị Bình',
    ip: '192.168.1.101',
    status: 'success',
    device: 'Windows 10',
    browser: 'Firefox 121.0',
    location: 'Hà Nội, Việt Nam'
  },
  {
    id: 3,
    timestamp: '09/12/2025 14:22:45',
    username: 'cuong.lv',
    fullName: 'Lê Văn Cường',
    ip: '192.168.1.102',
    status: 'failed',
    reason: 'Sai mật khẩu',
    device: 'Windows 11',
    browser: 'Edge 120.0.0',
    location: 'Hà Nội, Việt Nam'
  },
  {
    id: 4,
    timestamp: '09/12/2025 14:20:18',
    username: 'dung.pt',
    fullName: 'Phạm Thị Dung',
    ip: '192.168.1.103',
    status: 'success',
    device: 'MacOS 14',
    browser: 'Chrome 120.0.0',
    location: 'Hồ Chí Minh, Việt Nam'
  },
  {
    id: 5,
    timestamp: '09/12/2025 14:18:55',
    username: 'em.hv',
    fullName: 'Hoàng Văn Em',
    ip: '192.168.1.104',
    status: 'success',
    device: 'MacOS 14',
    browser: 'Safari 17.2',
    location: 'Đà Nẵng, Việt Nam'
  },
  {
    id: 6,
    timestamp: '09/12/2025 11:15:22',
    username: 'an.nv',
    fullName: 'Nguyễn Văn An',
    ip: '192.168.1.100',
    status: 'failed',
    reason: 'Tài khoản bị khóa',
    device: 'Windows 11',
    browser: 'Chrome 120.0.0',
    location: 'Hà Nội, Việt Nam'
  },
  {
    id: 7,
    timestamp: '09/12/2025 10:05:40',
    username: 'giang.dh',
    fullName: 'Đỗ Hoàng Giang',
    ip: '172.16.0.45',
    status: 'success',
    device: 'Ubuntu Linux',
    browser: 'Chrome 119.0.0',
    location: 'Hà Nội, Việt Nam'
  },
  {
    id: 8,
    timestamp: '09/12/2025 09:30:15',
    username: 'hang.vt',
    fullName: 'Vũ Thị Hằng',
    ip: '192.168.2.50',
    status: 'success',
    device: 'Windows 11',
    browser: 'Edge 120.0.0',
    location: 'Hải Phòng, Việt Nam'
  },
  {
    id: 9,
    timestamp: '09/12/2025 08:45:10',
    username: 'binh.tt',
    fullName: 'Trần Thị Bình',
    ip: '192.168.1.101',
    status: 'failed',
    reason: 'Sai cấu hình OTP',
    device: 'Windows 10',
    browser: 'Firefox 121.0',
    location: 'Hà Nội, Việt Nam'
  }
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
  const [activeTab, setActiveTab] = useState<'access' | 'login'>('access');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Login Log Filter States
  const [loginSearchTerm, setLoginSearchTerm] = useState('');
  const [loginFilterStatus, setLoginFilterStatus] = useState('all');
  const [loginStartDate, setLoginStartDate] = useState('');
  const [loginEndDate, setLoginEndDate] = useState('');
  const [showLoginFilters, setShowLoginFilters] = useState(false);

  // Modals
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [loginCurrentPage, setLoginCurrentPage] = useState(1);
  const [loginItemsPerPage, setLoginItemsPerPage] = useState(10);

  // Filtering access logs
  const filteredLogs = accessLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesStartDate = !startDate || log.timestamp.split(' ')[0] >= startDate.split('-').reverse().join('/');
    const matchesEndDate = !endDate || log.timestamp.split(' ')[0] <= endDate.split('-').reverse().join('/');
    return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
  });

  // Filtering login logs
  const filteredLoginLogs = loginLogs.filter(log => {
    const matchesSearch = log.fullName.toLowerCase().includes(loginSearchTerm.toLowerCase()) ||
                         log.username.toLowerCase().includes(loginSearchTerm.toLowerCase()) ||
                         log.ip.includes(loginSearchTerm) ||
                         (log.reason && log.reason.toLowerCase().includes(loginSearchTerm.toLowerCase()));
    const matchesStatus = loginFilterStatus === 'all' || log.status === loginFilterStatus;
    const matchesStartDate = !loginStartDate || log.timestamp.split(' ')[0] >= loginStartDate.split('-').reverse().join('/');
    const matchesEndDate = !loginEndDate || log.timestamp.split(' ')[0] <= loginEndDate.split('-').reverse().join('/');
    return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
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

  const handleExportAccessLog = () => {
    toast.success('Xuất file excel nhật ký truy cập thành công!', {
      description: `Đã xuất ${filteredLogs.length} dòng dữ liệu ra file Excel.`,
      duration: 3000
    });
  };

  const handleExportLoginLog = () => {
    toast.success('Xuất file excel nhật ký đăng nhập thành công!', {
      description: `Đã xuất ${filteredLoginLogs.length} dòng dữ liệu ra file Excel.`,
      duration: 3000
    });
  };

  return (
    <div className="space-y-6 access-log-container">
      <style>{`
        .access-log-container,
        .access-log-container .text-sm,
        .access-log-container .text-xs:not(th),
        .access-log-container input,
        .access-log-container select,
        .access-log-container button,
        .access-log-container td,
        .access-log-container option,
        .access-log-container div.text-slate-600,
        .access-log-container div.text-slate-700,
        .access-log-container div.text-slate-500,
        .access-log-container div.text-slate-900:not(.text-2xl) {
          font-size: 13px !important;
        }
      `}</style>
      
      {/* Tabs Switcher */}
      <div className="bg-white border-b border-slate-200 px-6 -mx-6 -mt-6 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('access')}
            className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 ${
              activeTab === 'access'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ScrollText className="w-5 h-5" />
            Nhật ký truy cập
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 ${
              activeTab === 'login'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-5 h-5" />
            Nhật ký đăng nhập
          </button>
        </div>
      </div>

      {activeTab === 'access' ? (
        <>
          {/* Filters for Access Log */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm người dùng, hành động..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
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

                <button
                  onClick={handleExportAccessLog}
                  className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 text-[13px]"
                  title="Kết xuất Excel"
                >
                  <Download className="w-4 h-4" />
                  Kết xuất
                </button>
              </div>
            </div>

            {/* Collapsible Filters Row */}
            {showFilters && (
              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-3 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
                <div className="absolute -top-2 right-[200px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>

                <div className="space-y-1.5 relative z-10">
                  <label className="text-[13px] font-medium text-slate-700">Trạng thái</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="success">Thành công</option>
                    <option value="failed">Thất bại</option>
                  </select>
                </div>

                <div className="space-y-1.5 relative z-10">
                  <label className="text-[13px] font-medium text-slate-700">Thời gian từ</label>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-slate-700 p-0"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </div>

                <div className="space-y-1.5 relative z-10">
                  <label className="text-[13px] font-medium text-slate-700">Thời gian đến</label>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-slate-700 p-0"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Access Logs Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse collection-table text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
                  <tr>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-12 text-[13px]">STT</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Thời gian</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Người dùng</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">IP</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Hành động</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Thiết bị</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Trạng thái</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-24 text-[13px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((log, index) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                        <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-4 py-3 text-left text-slate-700 whitespace-nowrap text-[13px]">{log.timestamp}</td>
                        <td className="px-4 py-3 text-left text-[13px]">
                          <div className="font-medium text-slate-950 leading-snug">{log.user}</div>
                          <div className="text-slate-500 mt-0.5 font-mono text-[13px]">{log.userId}</div>
                        </td>
                        <td className="px-4 py-3 text-left text-slate-600 font-mono text-[13px]">{log.ip}</td>
                        <td className="px-4 py-3 text-left text-slate-700 text-[13px]">{log.action}</td>
                        <td className="px-4 py-3 text-left text-[13px]">
                          <div className="text-slate-900 font-medium">{log.device}</div>
                          <div className="text-slate-500 mt-0.5">{log.browser}</div>
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
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 collection-pagination text-[13px]">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Hiển thị</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
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
        </>
      ) : (
        <>
          {/* Filters for Login Log */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm tài khoản, họ tên, IP, lý do..."
                    value={loginSearchTerm}
                    onChange={(e) => setLoginSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  />
                </div>
                <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowLoginFilters(!showLoginFilters)}
                  className={`p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border ${showLoginFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}
                  title="Bộ lọc"
                >
                  {showLoginFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                </button>

                <button
                  onClick={handleExportLoginLog}
                  className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 text-[13px]"
                  title="Kết xuất Excel"
                >
                  <Download className="w-4 h-4" />
                  Kết xuất
                </button>
              </div>
            </div>

            {/* Collapsible Filters Row */}
            {showLoginFilters && (
              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-3 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
                <div className="absolute -top-2 right-[200px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>

                <div className="space-y-1.5 relative z-10">
                  <label className="text-[13px] font-medium text-slate-700">Trạng thái</label>
                  <select
                    value={loginFilterStatus}
                    onChange={(e) => setLoginFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="success">Thành công</option>
                    <option value="failed">Thất bại</option>
                  </select>
                </div>

                <div className="space-y-1.5 relative z-10">
                  <label className="text-[13px] font-medium text-slate-700">Thời gian từ</label>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <input
                      type="date"
                      value={loginStartDate}
                      onChange={(e) => setLoginStartDate(e.target.value)}
                      className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-slate-700 p-0"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </div>

                <div className="space-y-1.5 relative z-10">
                  <label className="text-[13px] font-medium text-slate-700">Thời gian đến</label>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <input
                      type="date"
                      value={loginEndDate}
                      onChange={(e) => setLoginEndDate(e.target.value)}
                      className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-slate-700 p-0"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Login Logs Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse collection-table text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
                  <tr>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-12 text-[13px]">STT</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Thời gian</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Tên đăng nhập</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Họ và tên</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">IP</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Trạng thái</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Chi tiết / Lý do</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Thiết bị</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Vị trí</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLoginLogs
                    .slice((loginCurrentPage - 1) * loginItemsPerPage, loginCurrentPage * loginItemsPerPage)
                    .map((log, index) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                        <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">{(loginCurrentPage - 1) * loginItemsPerPage + index + 1}</td>
                        <td className="px-4 py-3 text-left text-slate-700 whitespace-nowrap text-[13px]">{log.timestamp}</td>
                        <td className="px-4 py-3 text-left text-slate-900 font-mono font-medium text-[13px]">{log.username}</td>
                        <td className="px-4 py-3 text-left text-slate-700 text-[13px]">{log.fullName}</td>
                        <td className="px-4 py-3 text-left text-slate-600 font-mono text-[13px]">{log.ip}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusTag 
                            label={log.status === 'success' ? 'Thành công' : 'Thất bại'} 
                            variant={log.status === 'success' ? 'green' : 'red'} 
                          />
                        </td>
                        <td className="px-4 py-3 text-left text-slate-600 text-[13px]">
                          {log.status === 'success' ? (
                            <span className="text-green-600">Đăng nhập thành công</span>
                          ) : (
                            <span className="text-red-600 font-medium">{log.reason || 'Sai mật khẩu'}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-left text-[13px]">
                          <div className="text-slate-900 font-medium">{log.device}</div>
                          <div className="text-slate-500 mt-0.5">{log.browser}</div>
                        </td>
                        <td className="px-4 py-3 text-left text-slate-700 text-[13px]">{log.location}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 collection-pagination text-[13px]">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Hiển thị</span>
                <select
                  value={loginItemsPerPage}
                  onChange={(e) => {
                    setLoginItemsPerPage(Number(e.target.value));
                    setLoginCurrentPage(1);
                  }}
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
                  {filteredLoginLogs.length > 0 ? (loginCurrentPage - 1) * loginItemsPerPage + 1 : 0} - {Math.min(loginCurrentPage * loginItemsPerPage, filteredLoginLogs.length)} / {filteredLoginLogs.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLoginCurrentPage(loginCurrentPage > 1 ? loginCurrentPage - 1 : loginCurrentPage)}
                    disabled={loginCurrentPage === 1}
                    className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
                  >
                    Trước
                  </button>
                  
                  {Array.from({ length: Math.ceil(filteredLoginLogs.length / loginItemsPerPage) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setLoginCurrentPage(page)}
                      className={`px-3 py-1.5 border rounded-lg font-medium text-[13px] transition-colors ${
                        loginCurrentPage === page
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      const totalPages = Math.ceil(filteredLoginLogs.length / loginItemsPerPage);
                      if (loginCurrentPage < totalPages) {
                        setLoginCurrentPage(loginCurrentPage + 1);
                      }
                    }}
                    disabled={loginCurrentPage === Math.ceil(filteredLoginLogs.length / loginItemsPerPage) || filteredLoginLogs.length === 0}
                    className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Detail Modal for Access Log */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-semibold">Chi tiết phiên truy cập</h3>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Session ID: <span className="font-mono">{selectedLog.sessionId}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={closeDetailModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600" 
                title="Đóng" 
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Session Info */}
            <div className="p-6 border-b border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-medium">Người dùng</span>
                  </div>
                  <div className="text-sm text-slate-900 font-semibold">{selectedLog.user}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">{selectedLog.userId}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">Thời gian bắt đầu</span>
                  </div>
                  <div className="text-sm text-slate-900 font-semibold">{selectedLog.timestamp}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Monitor className="w-4 h-4" />
                    <span className="text-xs font-medium">Thiết bị</span>
                  </div>
                  <div className="text-sm text-slate-900 font-semibold">{selectedLog.device}</div>
                  <div className="text-xs text-slate-500 mt-1">{selectedLog.browser}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-medium">Vị trí & IP</span>
                  </div>
                  <div className="text-sm text-slate-900 font-semibold">{selectedLog.location}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">{selectedLog.ip}</div>
                </div>
              </div>
            </div>

            {/* Actions Timeline */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="text-slate-900 font-semibold">Lịch sử thao tác trong phiên</h4>
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
                      className="bg-slate-50 rounded-lg p-4 border border-slate-100 hover:bg-slate-100/50 transition-colors"
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
                                <span className="text-sm text-slate-900 font-semibold">{action.module}</span>
                                {action.status === 'success' ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                              <div className="text-sm text-slate-700">{action.description}</div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                              <Clock className="w-3.5 h-3.5" />
                              {action.time}
                            </div>
                          </div>

                          {/* Target */}
                          <div className="text-xs text-slate-600 mt-2">
                            <span className="text-slate-500 font-medium">Đối tượng tác động:</span>{' '}
                            <span className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">{action.target}</span>
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
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span>
                    Tổng thời gian hoạt động:{' '}
                    <strong className="text-slate-900">
                      {sessionActions.length > 0 ? '8 phút 42 giây' : '0 giây'}
                    </strong>
                  </span>
                </div>
                <button
                  onClick={closeDetailModal}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
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