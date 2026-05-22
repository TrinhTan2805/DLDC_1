import { useState } from 'react';
import { 
  UserCog, 
  Search, 
  Download, 
  Calendar, 
  Filter, 
  Eye, 
  X,
  Clock,
  User,
  UserPlus,
  UserX,
  UserCheck,
  Lock,
  Unlock,
  Key,
  Shield,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { StatsCard } from '../../common/StatsCard';
import { StatusTag } from '../../common/StatusTag';

interface AccountLog {
  id: number;
  timestamp: string;
  action: 'create' | 'update' | 'delete' | 'lock' | 'unlock' | 'password_change' | 'password_reset' | 'role_change';
  targetUser: string;
  targetUserId: string;
  performedBy: string;
  performedById: string;
  ip: string;
  status: 'success' | 'failed';
  details: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
}

const accountLogs: AccountLog[] = [
  {
    id: 1,
    timestamp: '22/12/2024 15:30:25',
    action: 'create',
    targetUser: 'Nguyễn Thị Mai',
    targetUserId: 'nguyenthimai',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Tạo tài khoản mới với vai trò "Cán bộ xử lý dữ liệu"',
    newValue: 'Role: Cán bộ xử lý dữ liệu, Email: ntmai@moj.gov.vn'
  },
  {
    id: 2,
    timestamp: '22/12/2024 15:15:42',
    action: 'lock',
    targetUser: 'Trần Văn Hùng',
    targetUserId: 'tranvanhung',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'success',
    details: 'Khóa tài khoản do vi phạm chính sách bảo mật',
    reason: 'Đăng nhập sai mật khẩu quá 5 lần liên tiếp',
    oldValue: 'Status: Active',
    newValue: 'Status: Locked'
  },
  {
    id: 3,
    timestamp: '22/12/2024 15:00:18',
    action: 'password_reset',
    targetUser: 'Lê Thị Bình',
    targetUserId: 'lethibinh',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Đặt lại mật khẩu theo yêu cầu của người dùng',
    reason: 'Người dùng quên mật khẩu'
  },
  {
    id: 4,
    timestamp: '22/12/2024 14:45:55',
    action: 'role_change',
    targetUser: 'Phạm Văn Cường',
    targetUserId: 'phamvancuong',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'success',
    details: 'Thay đổi vai trò từ "Cán bộ" sang "Quản trị viên"',
    oldValue: 'Role: Cán bộ',
    newValue: 'Role: Quản trị viên'
  },
  {
    id: 5,
    timestamp: '22/12/2024 14:30:33',
    action: 'update',
    targetUser: 'Hoàng Thị Lan',
    targetUserId: 'hoangthilan',
    performedBy: 'Hoàng Thị Lan',
    performedById: 'hoangthilan',
    ip: '192.168.1.120',
    status: 'success',
    details: 'Cập nhật thông tin cá nhân (email, số điện thoại)',
    oldValue: 'Email: htlan@old.gov.vn, Phone: 0123456789',
    newValue: 'Email: htlan@moj.gov.vn, Phone: 0987654321'
  },
  {
    id: 6,
    timestamp: '22/12/2024 14:15:20',
    action: 'unlock',
    targetUser: 'Đặng Văn Nam',
    targetUserId: 'dangvannam',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Mở khóa tài khoản sau khi xác minh danh tính',
    reason: 'Đã xác minh danh tính qua điện thoại',
    oldValue: 'Status: Locked',
    newValue: 'Status: Active'
  },
  {
    id: 7,
    timestamp: '22/12/2024 14:00:45',
    action: 'password_change',
    targetUser: 'Vũ Thị Hoa',
    targetUserId: 'vuthihoa',
    performedBy: 'Vũ Thị Hoa',
    performedById: 'vuthihoa',
    ip: '192.168.1.115',
    status: 'success',
    details: 'Người dùng đổi mật khẩu thành công',
    reason: 'Đổi mật khẩu định kỳ'
  },
  {
    id: 8,
    timestamp: '22/12/2024 13:45:12',
    action: 'delete',
    targetUser: 'Nguyễn Văn Tuấn',
    targetUserId: 'nguyenvantuan',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Xóa tài khoản người dùng đã nghỉ việc',
    reason: 'Nhân viên đã nghỉ việc từ ngày 01/12/2024',
    oldValue: 'User: nguyenvantuan, Role: Cán bộ'
  },
  {
    id: 9,
    timestamp: '22/12/2024 13:30:28',
    action: 'create',
    targetUser: 'Trần Thị Thu',
    targetUserId: 'tranthithu',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'failed',
    details: 'Tạo tài khoản thất bại: Username đã tồn tại',
    newValue: 'Username: tranthithu'
  },
  {
    id: 10,
    timestamp: '22/12/2024 13:15:55',
    action: 'role_change',
    targetUser: 'Lê Văn Đức',
    targetUserId: 'levanduc',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Phân quyền bổ sung chức năng "Quản lý danh mục"',
    oldValue: 'Permissions: [Xem dữ liệu, Xử lý dữ liệu]',
    newValue: 'Permissions: [Xem dữ liệu, Xử lý dữ liệu, Quản lý danh mục]'
  },
  {
    id: 11,
    timestamp: '22/12/2024 13:00:40',
    action: 'update',
    targetUser: 'Phạm Thị Hương',
    targetUserId: 'phamthihuong',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Cập nhật thông tin đơn vị công tác',
    oldValue: 'Department: Phòng Kế hoạch',
    newValue: 'Department: Phòng Công nghệ thông tin'
  },
  {
    id: 12,
    timestamp: '22/12/2024 12:45:15',
    action: 'lock',
    targetUser: 'Nguyễn Văn Minh',
    targetUserId: 'nguyenvanminh',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'failed',
    details: 'Khóa tài khoản thất bại: Không đủ quyền hạn',
    reason: 'Người thực hiện không có quyền khóa tài khoản quản trị viên'
  }
];

export function AccountManagementLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AccountLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredLogs = accountLogs.filter(log => {
    const matchesSearch = log.targetUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.targetUserId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesStartDate = !startDate || log.timestamp.split(' ')[0] >= startDate.split('-').reverse().join('/');
    const matchesEndDate = !endDate || log.timestamp.split(' ')[0] <= endDate.split('-').reverse().join('/');
    return matchesSearch && matchesAction && matchesStatus && matchesStartDate && matchesEndDate;
  });

  const handleViewDetail = (log: AccountLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedLog(null);
  };

  const getActionIcon = (action: AccountLog['action']) => {
    switch (action) {
      case 'create':
        return <UserPlus className="w-4 h-4" />;
      case 'update':
        return <Edit className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      case 'lock':
        return <Lock className="w-4 h-4" />;
      case 'unlock':
        return <Unlock className="w-4 h-4" />;
      case 'password_change':
        return <Key className="w-4 h-4" />;
      case 'password_reset':
        return <Key className="w-4 h-4" />;
      case 'role_change':
        return <Shield className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: AccountLog['action']) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'update':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delete':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'lock':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'unlock':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'password_change':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'password_reset':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'role_change':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
    }
  };

  const getActionLabel = (action: AccountLog['action']) => {
    switch (action) {
      case 'create':
        return 'Tạo tài khoản';
      case 'update':
        return 'Cập nhật';
      case 'delete':
        return 'Xóa tài khoản';
      case 'lock':
        return 'Khóa tài khoản';
      case 'unlock':
        return 'Mở khóa';
      case 'password_change':
        return 'Đổi mật khẩu';
      case 'password_reset':
        return 'Đặt lại mật khẩu';
      case 'role_change':
        return 'Thay đổi quyền';
    }
  };

  return (
    <div className="space-y-6 account-log-container">
      <style>{`
        .account-log-container,
        .account-log-container .text-sm,
        .account-log-container .text-xs:not(th),
        .account-log-container input,
        .account-log-container select,
        .account-log-container button,
        .account-log-container td,
        .account-log-container option,
        .account-log-container div.text-slate-600,
        .account-log-container div.text-slate-700,
        .account-log-container div.text-slate-500,
        .account-log-container div.text-slate-900:not(.text-2xl) {
          font-size: 13px !important;
        }
      `}</style>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard 
          icon={UserPlus} 
          iconColor="green" 
          title="Tài khoản mới (30 ngày)" 
          value={accountLogs.filter(l => l.action === 'create' && l.status === 'success').length.toString()} 
        />
        <StatsCard 
          icon={Lock} 
          iconColor="orange" 
          title="Tài khoản bị khóa" 
          value={accountLogs.filter(l => l.action === 'lock' && l.status === 'success').length.toString()} 
        />
        <StatsCard 
          icon={Shield} 
          iconColor="blue" 
          title="Thay đổi quyền" 
          value={accountLogs.filter(l => l.action === 'role_change').length.toString()} 
        />
        <StatsCard 
          icon={XCircle} 
          iconColor="red" 
          title="Thao tác thất bại" 
          value={accountLogs.filter(l => l.status === 'failed').length.toString()} 
        />
      </div>

      {/* Search and Filters Row */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm tài khoản, người thực hiện..."
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
          </div>
        </div>

        {/* Collapsible Filters Row */}
        {showFilters && (
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-4 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
            <div className="absolute -top-2 right-[200px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>

            <div className="space-y-1.5 relative z-10">
              <label className="text-[13px] font-medium text-slate-700">Thao tác</label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              >
                <option value="all">Tất cả thao tác</option>
                <option value="create">Tạo tài khoản</option>
                <option value="update">Cập nhật</option>
                <option value="delete">Xóa tài khoản</option>
                <option value="lock">Khóa tài khoản</option>
                <option value="unlock">Mở khóa</option>
                <option value="password_change">Đổi mật khẩu</option>
                <option value="password_reset">Đặt lại mật khẩu</option>
                <option value="role_change">Thay đổi quyền</option>
              </select>
            </div>

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

      {/* Account Logs Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
              <tr>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-12 text-[13px]">STT</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Người thực hiện</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Thời gian</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Tác vụ</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Tài khoản</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Chi tiết</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">IP người thực hiện</th>
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
                    <td className="px-4 py-3 text-left text-[13px]">
                      <div className="font-medium text-slate-950 leading-snug">{log.performedBy}</div>
                      <div className="text-slate-500 mt-0.5 font-mono text-[13px]">@{log.performedById}</div>
                    </td>
                    <td className="px-4 py-3 text-left text-slate-700 whitespace-nowrap text-[13px]">{log.timestamp}</td>
                    <td className="px-4 py-3 text-left text-[13px]">
                      <StatusTag 
                        label={getActionLabel(log.action)} 
                        variant={log.action === 'create' ? 'green' : log.action === 'update' ? 'blue' : log.action === 'delete' ? 'red' : log.action === 'lock' ? 'orange' : log.action === 'unlock' ? 'teal' : log.action === 'role_change' ? 'cyan' : 'purple'} 
                        icon={getActionIcon(log.action)}
                      />
                    </td>
                    <td className="px-4 py-3 text-left text-[13px]">
                      <div className="font-medium text-slate-900 leading-snug">{log.targetUser}</div>
                      <div className="text-slate-500 mt-0.5 font-mono text-[13px]">@{log.targetUserId}</div>
                    </td>
                    <td className="px-4 py-3 text-left text-slate-700 max-w-md truncate text-[13px]" title={log.details}>
                      {log.details}
                    </td>
                    <td className="px-4 py-3 text-left text-[13px]">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">
                        {log.ip}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusTag 
                        label={log.status === 'success' ? 'Thành công' : 'Thất bại'} 
                        variant={log.status === 'success' ? 'green' : 'red'} 
                        icon={log.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
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

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getActionColor(selectedLog.action)}`}>
                  {getActionIcon(selectedLog.action)}
                </div>
                <div>
                  <h3 className="text-slate-900 font-semibold">Chi tiết nhật ký quản lý tài khoản</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Tác vụ: <span className="font-medium text-slate-950">{getActionLabel(selectedLog.action)}</span></p>
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

            {/* Log Info */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">Thời gian</span>
                  </div>
                  <div className="text-sm text-slate-900 font-semibold">{selectedLog.timestamp}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Trạng thái</span>
                  </div>
                  <StatusTag 
                    label={selectedLog.status === 'success' ? 'Thành công' : 'Thất bại'} 
                    variant={selectedLog.status === 'success' ? 'green' : 'red'} 
                    icon={selectedLog.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  />
                </div>
              </div>

              {/* Target User */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">Tài khoản đích</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Họ tên</div>
                    <div className="text-sm text-slate-900 font-semibold">{selectedLog.targetUser}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Username</div>
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">
                      {selectedLog.targetUserId}
                    </code>
                  </div>
                </div>
              </div>

              {/* Performed By */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">Người thực hiện</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Họ tên</div>
                    <div className="text-sm text-slate-900 font-semibold">{selectedLog.performedBy}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Username</div>
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">
                      {selectedLog.performedById}
                    </code>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">IP Address</div>
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">
                      {selectedLog.ip}
                    </code>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <UserCog className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">Chi tiết thay đổi</h4>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                  <p className="text-sm text-slate-900">{selectedLog.details}</p>
                </div>
                
                {selectedLog.reason && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3">
                    <div className="text-xs text-amber-700 mb-1">Lý do</div>
                    <p className="text-sm text-amber-900 font-medium">{selectedLog.reason}</p>
                  </div>
                )}

                {(selectedLog.oldValue || selectedLog.newValue) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedLog.oldValue && (
                      <div>
                        <div className="text-xs text-slate-500 mb-2">Giá trị cũ</div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <code className="text-xs text-red-800 whitespace-pre-wrap break-all font-mono">
                            {selectedLog.oldValue}
                          </code>
                        </div>
                      </div>
                    )}
                    {selectedLog.newValue && (
                      <div>
                        <div className="text-xs text-slate-500 mb-2">Giá trị mới</div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <code className="text-xs text-green-800 whitespace-pre-wrap break-all font-mono">
                            {selectedLog.newValue}
                          </code>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200">
              <div className="flex justify-end">
                <button
                  onClick={closeDetailModal}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
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