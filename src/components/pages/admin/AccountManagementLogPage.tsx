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
  XCircle,
  RefreshCw
} from 'lucide-react';
import { StatsCard } from '../../common/StatsCard';
import { StatusTag } from '../../common/StatusTag';

interface AccountLog {
  id: number;
  timestamp: string;
  action: 'sync' | 'deactivate';
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
    timestamp: '28/05/2026 15:30:25',
    action: 'sync',
    targetUser: 'Nguyễn Thị Mai',
    targetUserId: 'nguyenthimai',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Đồng bộ thông tin tài khoản từ hệ thống SSO dùng chung',
    newValue: 'Đồng bộ: Thành công, Trạng thái: Hoạt động'
  },
  {
    id: 2,
    timestamp: '28/05/2026 15:15:42',
    action: 'deactivate',
    targetUser: 'Trần Văn Hùng',
    targetUserId: 'tranvanhung',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'success',
    details: 'Ngừng hoạt động tài khoản do nhân sự chuyển công tác',
    reason: 'Có quyết định thuyên chuyển công tác sang đơn vị khác',
    oldValue: 'Status: Active',
    newValue: 'Status: Deactivated'
  },
  {
    id: 3,
    timestamp: '28/05/2026 15:00:18',
    action: 'sync',
    targetUser: 'Lê Thị Bình',
    targetUserId: 'lethibinh',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Đồng bộ danh sách quyền và vai trò từ cơ sở dữ liệu nhân sự',
    newValue: 'Quyền: Cập nhật vai trò Cán bộ xử lý'
  },
  {
    id: 4,
    timestamp: '28/05/2026 14:45:55',
    action: 'deactivate',
    targetUser: 'Phạm Văn Cường',
    targetUserId: 'phamvancuong',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'success',
    details: 'Tạm ngưng hoạt động tài khoản không hoạt động trên 90 ngày',
    reason: 'Không đăng nhập hệ thống quá 90 ngày',
    oldValue: 'Status: Active',
    newValue: 'Status: Deactivated'
  },
  {
    id: 5,
    timestamp: '28/05/2026 14:30:33',
    action: 'sync',
    targetUser: 'Hoàng Thị Lan',
    targetUserId: 'hoangthilan',
    performedBy: 'Hoàng Thị Lan',
    performedById: 'hoangthilan',
    ip: '192.168.1.120',
    status: 'success',
    details: 'Yêu cầu đồng bộ lại thông tin cá nhân và chữ ký số',
    oldValue: 'Signature: None',
    newValue: 'Signature: Verified'
  },
  {
    id: 6,
    timestamp: '28/05/2026 14:15:20',
    action: 'deactivate',
    targetUser: 'Đặng Văn Nam',
    targetUserId: 'dangvannam',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Ngừng hoạt động tài khoản theo văn bản yêu cầu của đơn vị quản lý',
    reason: 'Nhân viên nghỉ hưu theo chế độ',
    oldValue: 'Status: Active',
    newValue: 'Status: Deactivated'
  },
  {
    id: 7,
    timestamp: '28/05/2026 14:00:45',
    action: 'sync',
    targetUser: 'Vũ Thị Hoa',
    targetUserId: 'vuthihoa',
    performedBy: 'Vũ Thị Hoa',
    performedById: 'vuthihoa',
    ip: '192.168.1.115',
    status: 'success',
    details: 'Đồng bộ thông tin đăng ký định danh điện tử thành công',
    newValue: 'eID: Verified'
  },
  {
    id: 8,
    timestamp: '28/05/2026 13:45:12',
    action: 'deactivate',
    targetUser: 'Nguyễn Văn Tuấn',
    targetUserId: 'nguyenvantuan',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Ngừng hoạt động tài khoản do người dùng chấm dứt hợp đồng lao động',
    reason: 'Hết hạn hợp đồng lao động',
    oldValue: 'Status: Active',
    newValue: 'Status: Deactivated'
  },
  {
    id: 9,
    timestamp: '28/05/2026 13:30:28',
    action: 'sync',
    targetUser: 'Trần Thị Thu',
    targetUserId: 'tranthithu',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'failed',
    details: 'Đồng bộ thất bại: Không kết nối được tới phân hệ phân quyền tập trung',
    newValue: 'Error: Connection Timeout'
  },
  {
    id: 10,
    timestamp: '28/05/2026 13:15:55',
    action: 'deactivate',
    targetUser: 'Lê Văn Đức',
    targetUserId: 'levanduc',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Ngừng hoạt động tài khoản do vi phạm kỷ luật sử dụng hệ thống',
    reason: 'Truy cập tài nguyên trái phép nhiều lần',
    oldValue: 'Status: Active',
    newValue: 'Status: Deactivated'
  },
  {
    id: 11,
    timestamp: '28/05/2026 13:00:40',
    action: 'sync',
    targetUser: 'Phạm Thị Hương',
    targetUserId: 'phamthihuong',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Đồng bộ cập nhật thông tin phòng ban mới phân bổ',
    oldValue: 'Department: Phòng Kế hoạch',
    newValue: 'Department: Phòng CNTT'
  },
  {
    id: 12,
    timestamp: '28/05/2026 12:45:15',
    action: 'deactivate',
    targetUser: 'Nguyễn Văn Minh',
    targetUserId: 'nguyenvanminh',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'failed',
    details: 'Lỗi khi ngừng hoạt động tài khoản: Người dùng đang sở hữu các tiến trình điều phối dữ liệu chưa chuyển giao',
    newValue: 'Status: Active'
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

  const filteredLogs = accountLogs.filter(log => {
    const matchesSearch = log.targetUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.targetUserId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
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
    return matchesSearch && matchesAction && matchesStatus && matchesDate;
  });

  const handleViewDetail = (log: AccountLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedLog(null);
  };

  const handleExportExcel = () => {
    alert('Đang kết xuất nhật ký quản lý tài khoản ra file Excel...');
  };
  const getActionIcon = (action: AccountLog['action']) => {
    switch (action) {
      case 'sync':
        return <RefreshCw className="w-4 h-4" />;
      case 'deactivate':
        return <UserX className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: AccountLog['action']) => {
    switch (action) {
      case 'sync':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'deactivate':
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getActionLabel = (action: AccountLog['action']) => {
    switch (action) {
      case 'sync':
        return 'Đồng bộ';
      case 'deactivate':
        return 'Ngừng hoạt động tài khoản';
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
          icon={RefreshCw} 
          iconColor="blue" 
          title="Đồng bộ thành công" 
          value={accountLogs.filter(l => l.action === 'sync' && l.status === 'success').length.toString()} 
        />
        <StatsCard 
          icon={UserX} 
          iconColor="red" 
          title="Ngừng hoạt động" 
          value={accountLogs.filter(l => l.action === 'deactivate' && l.status === 'success').length.toString()} 
        />
        <StatsCard 
          icon={UserCog} 
          iconColor="green" 
          title="Tổng số thao tác" 
          value={accountLogs.length.toString()} 
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
              <input aria-label="Input field"
                type="text"
                placeholder="Tìm kiếm tài khoản, người thực hiện..."
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
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Kết xuất
            </button>
          </div>
        </div>

        {/* Collapsible Filters Row */}
        {showFilters && (
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-4 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
            <div className="absolute -top-2 right-[200px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>

            <div className="space-y-1.5 relative z-10">
              <label className="text-[13px] font-medium text-slate-700">Tác vụ</label>
              <select aria-label="Select box"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                value={filterAction}
                onChange={(e) => {
                  setFilterAction(e.target.value);
                  setCurrentPage(1);
                }}
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
                <option value="sync">Đồng bộ</option>
                <option value="deactivate">Ngừng hoạt động tài khoản</option>
              </select>
            </div>

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

      {/* Account Logs Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap w-12 text-[13px]">STT</th>
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
                        variant={log.action === 'sync' ? 'blue' : 'red'} 
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
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500 text-[13px]">
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
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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