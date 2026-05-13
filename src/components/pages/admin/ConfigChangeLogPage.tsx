import { useState } from 'react';
import { 
  Settings, 
  Search, 
  Download, 
  Calendar, 
  Filter, 
  Eye, 
  X,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Shield,
  Database,
  Mail,
  Lock,
  Globe,
  Bell,
  Palette,
  HardDrive,
  FileText,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Save,
  AlertTriangle,
  UserCog
} from 'lucide-react';
import { StatsCard } from '../../common/StatsCard';
import { StatusTag } from '../../common/StatusTag';
import { LogRetentionConfigPage } from './LogRetentionConfigPage';

interface ConfigLog {
  id: number;
  timestamp: string;
  configType: 'security' | 'system' | 'email' | 'backup' | 'notification' | 'ui' | 'database' | 'api';
  configName: string;
  performedBy: string;
  performedById: string;
  ip: string;
  status: 'success' | 'failed';
  oldValue: string;
  newValue: string;
  description: string;
  reason?: string;
}

const configLogs: ConfigLog[] = [
  {
    id: 1,
    timestamp: '22/12/2024 16:45:30',
    configType: 'security',
    configName: 'Thời gian timeout phiên đăng nhập',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    oldValue: '30 phút',
    newValue: '60 phút',
    description: 'Tăng thời gian timeout để tránh gián đoạn làm việc',
    reason: 'Theo yêu cầu của Phòng CNTT'
  },
  {
    id: 2,
    timestamp: '22/12/2024 16:30:15',
    configType: 'security',
    configName: 'Số lần đăng nhập sai tối đa',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'success',
    oldValue: '3 lần',
    newValue: '5 lần',
    description: 'Điều chỉnh chính sách khóa tài khoản',
    reason: 'Giảm số lượng tài khoản bị khóa do nhập sai'
  },
  {
    id: 3,
    timestamp: '22/12/2024 16:15:42',
    configType: 'email',
    configName: 'SMTP Server',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    oldValue: 'smtp.old-server.gov.vn:587',
    newValue: 'smtp.moj.gov.vn:587',
    description: 'Chuyển đổi sang SMTP server mới',
    reason: 'Nâng cấp hạ tầng email'
  },
  {
    id: 4,
    timestamp: '22/12/2024 16:00:28',
    configType: 'backup',
    configName: 'Lịch sao lưu tự động',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'success',
    oldValue: 'Hàng tuần (Chủ nhật 02:00)',
    newValue: 'Hàng ngày (02:00)',
    description: 'Tăng tần suất sao lưu dữ liệu',
    reason: 'Đảm bảo an toàn dữ liệu quan trọng'
  },
  {
    id: 5,
    timestamp: '22/12/2024 15:45:55',
    configType: 'system',
    configName: 'Kích thước tệp upload tối đa',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    oldValue: '10 MB',
    newValue: '50 MB',
    description: 'Tăng giới hạn upload file',
    reason: 'Hỗ trợ upload tài liệu scan có dung lượng lớn'
  },
  {
    id: 6,
    timestamp: '22/12/2024 15:30:20',
    configType: 'notification',
    configName: 'Thông báo qua Email',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'success',
    oldValue: 'Tắt',
    newValue: 'Bật',
    description: 'Kích hoạt tính năng thông báo email',
    reason: 'Cải thiện thông tin đến người dùng'
  },
  {
    id: 7,
    timestamp: '22/12/2024 15:15:45',
    configType: 'database',
    configName: 'Thời gian giữ log hệ thống',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    oldValue: '90 ngày',
    newValue: '180 ngày',
    description: 'Tăng thời gian lưu trữ log',
    reason: 'Phục vụ kiểm toán và tra cứu lịch sử'
  },
  {
    id: 8,
    timestamp: '22/12/2024 15:00:30',
    configType: 'ui',
    configName: 'Giao diện mặc định',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'success',
    oldValue: 'Chế độ sáng',
    newValue: 'Tự động theo hệ thống',
    description: 'Cho phép giao diện tự động theo thiết lập máy tính',
    reason: 'Cải thiện trải nghiệm người dùng'
  },
  {
    id: 9,
    timestamp: '22/12/2024 14:45:15',
    configType: 'api',
    configName: 'API Rate Limit',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    oldValue: '100 requests/phút',
    newValue: '500 requests/phút',
    description: 'Tăng giới hạn API cho hệ thống tích hợp',
    reason: 'Hỗ trợ tích hợp với các hệ thống bên ngoài'
  },
  {
    id: 10,
    timestamp: '22/12/2024 14:30:42',
    configType: 'security',
    configName: 'Yêu cầu xác thực 2 lớp (2FA)',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'failed',
    oldValue: 'Tắt',
    newValue: 'Bật',
    description: 'Kích hoạt 2FA thất bại do lỗi cấu hình SMTP',
    reason: 'Cần cấu hình SMTP trước khi bật 2FA'
  },
  {
    id: 11,
    timestamp: '22/12/2024 14:15:28',
    configType: 'system',
    configName: 'Múi giờ hệ thống',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'success',
    oldValue: 'UTC+0',
    newValue: 'UTC+7 (Giờ Việt Nam)',
    description: 'Điều chỉnh múi giờ phù hợp với Việt Nam',
    reason: 'Hiển thị thời gian chính xác theo giờ địa phương'
  },
  {
    id: 12,
    timestamp: '22/12/2024 14:00:55',
    configType: 'database',
    configName: 'Kích thước pool kết nối CSDL',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    oldValue: '50 connections',
    newValue: '100 connections',
    description: 'Tăng số kết nối đồng thời đến CSDL',
    reason: 'Cải thiện hiệu suất khi có nhiều người dùng'
  }
];

export function ConfigChangeLogPage() {
  const [activeTab, setActiveTab] = useState<'logs' | 'retention'>('logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLog, setSelectedLog] = useState<ConfigLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredLogs = configLogs.filter(log => {
    const matchesSearch = log.configName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.configType === filterType;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewDetail = (log: ConfigLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedLog(null);
  };

  const handleExportExcel = () => {
    alert('Đang xuất file Excel...');
    // Logic export Excel
  };

  const getConfigTypeIcon = (type: ConfigLog['configType']) => {
    switch (type) {
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'backup':
        return <HardDrive className="w-4 h-4" />;
      case 'notification':
        return <Bell className="w-4 h-4" />;
      case 'ui':
        return <Palette className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'api':
        return <Globe className="w-4 h-4" />;
    }
  };

  const getConfigTypeColor = (type: ConfigLog['configType']) => {
    switch (type) {
      case 'security':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'system':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'email':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'backup':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'notification':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'ui':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'database':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'api':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
    }
  };

  const getConfigTypeLabel = (type: ConfigLog['configType']) => {
    switch (type) {
      case 'security':
        return 'Bảo mật';
      case 'system':
        return 'Hệ thống';
      case 'email':
        return 'Email';
      case 'backup':
        return 'Sao lưu';
      case 'notification':
        return 'Thông báo';
      case 'ui':
        return 'Giao diện';
      case 'database':
        return 'CSDL';
      case 'api':
        return 'API';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Nhật ký thay đổi cấu hình</span>
          </button>
          <button
            onClick={() => setActiveTab('retention')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'retention'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm">Quản lý thời gian lưu trữ nhật ký</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'logs' ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard 
              icon={Settings} 
              iconColor="blue" 
              title="Tổng thay đổi (30 ngày)" 
              value={configLogs.length.toString()} 
            />
            <StatsCard 
              icon={Shield} 
              iconColor="red" 
              title="Cấu hình bảo mật" 
              value={configLogs.filter(l => l.configType === 'security').length.toString()} 
            />
            <StatsCard 
              icon={Database} 
              iconColor="indigo" 
              title="Cấu hình CSDL" 
              value={configLogs.filter(l => l.configType === 'database').length.toString()} 
            />
            <StatsCard 
              icon={XCircle} 
              iconColor="red" 
              title="Thay đổi thất bại" 
              value={configLogs.filter(l => l.status === 'failed').length.toString()} 
            />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm tên cấu hình, người thực hiện..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả loại cấu hình</option>
                  <option value="security">Bảo mật</option>
                  <option value="system">Hệ thống</option>
                  <option value="email">Email</option>
                  <option value="backup">Sao lưu</option>
                  <option value="notification">Thông báo</option>
                  <option value="ui">Giao diện</option>
                  <option value="database">CSDL</option>
                  <option value="api">API</option>
                </select>
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
              <div className="md:col-span-2 lg:col-span-4">
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
            </div>
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Lọc
              </button>
              <button 
                onClick={handleExportExcel}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Xuất Excel
              </button>
            </div>
          </div>

          {/* Config Logs Table */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-slate-900">Nhật ký thay đổi cấu hình ({filteredLogs.length} bản ghi)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Người thực hiện</th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thời gian</th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Loại cấu hình</th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên cấu hình</th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Giá trị cũ</th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Giá trị mới</th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">IP người thực hiện</th>
                    <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{log.performedBy}</div>
                        <div className="text-xs text-slate-500">@{log.performedById}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">{log.timestamp}</td>
                      <td className="px-6 py-4">
                        <StatusTag 
                          label={getConfigTypeLabel(log.configType)} 
                          variant={log.configType === 'security' ? 'red' : log.configType === 'system' ? 'blue' : log.configType === 'email' ? 'purple' : log.configType === 'backup' ? 'green' : log.configType === 'notification' ? 'amber' : log.configType === 'ui' ? 'pink' : log.configType === 'database' ? 'indigo' : 'cyan'} 
                          icon={getConfigTypeIcon(log.configType)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 max-w-xs truncate">{log.configName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-red-700 bg-red-50 px-2 py-1 rounded border border-red-200 max-w-xs truncate">
                          {log.oldValue}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200 max-w-xs truncate">
                          {log.newValue}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                          {log.ip}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <StatusTag 
                          label={log.status === 'success' ? 'Thành công' : 'Thất bại'} 
                          variant={log.status === 'success' ? 'green' : 'red'} 
                          icon={log.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
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
                Hiển thị 1-{filteredLogs.length} trong tổng số 1,845 bản ghi
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
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getConfigTypeColor(selectedLog.configType)}`}>
                      {getConfigTypeIcon(selectedLog.configType)}
                    </div>
                    <div>
                      <h3 className="text-slate-900">Chi tiết thay đổi cấu hình</h3>
                      <p className="text-sm text-slate-600 mt-0.5">{getConfigTypeLabel(selectedLog.configType)}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeDetailModal}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Log Info */}
                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">Thời gian thay đổi</span>
                      </div>
                      <div className="text-sm text-slate-900">{selectedLog.timestamp}</div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs">Trạng thái</span>
                      </div>
                      <StatusTag 
                        label={selectedLog.status === 'success' ? 'Thành công' : 'Thất bại'} 
                        variant={selectedLog.status === 'success' ? 'green' : 'red'} 
                        icon={selectedLog.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      />
                    </div>
                  </div>

                  {/* Config Info */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Settings className="w-4 h-4 text-blue-600" />
                      <h4 className="text-sm text-slate-900">Thông tin cấu hình</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Loại cấu hình</div>
                        <StatusTag 
                          label={getConfigTypeLabel(selectedLog.configType)} 
                          variant={selectedLog.configType === 'security' ? 'red' : selectedLog.configType === 'system' ? 'blue' : selectedLog.configType === 'email' ? 'purple' : selectedLog.configType === 'backup' ? 'green' : selectedLog.configType === 'notification' ? 'amber' : selectedLog.configType === 'ui' ? 'pink' : selectedLog.configType === 'database' ? 'indigo' : 'cyan'} 
                          icon={getConfigTypeIcon(selectedLog.configType)}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Tên cấu hình</div>
                        <div className="text-sm text-slate-900">{selectedLog.configName}</div>
                      </div>
                    </div>
                  </div>

                  {/* Performed By */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-green-600" />
                      <h4 className="text-sm text-slate-900">Người thực hiện</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Họ tên</div>
                        <div className="text-sm text-slate-900">{selectedLog.performedBy}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Username</div>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                          {selectedLog.performedById}
                        </code>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">IP Address</div>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                          {selectedLog.ip}
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Value Change */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowRight className="w-4 h-4 text-purple-600" />
                      <h4 className="text-sm text-slate-900">Thay đổi giá trị</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-slate-500 mb-2">Giá trị cũ</div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <code className="text-sm text-red-800 whitespace-pre-wrap break-all">
                            {selectedLog.oldValue}
                          </code>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-2">Giá trị mới</div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <code className="text-sm text-green-800 whitespace-pre-wrap break-all">
                            {selectedLog.newValue}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description & Reason */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-cyan-600" />
                      <h4 className="text-sm text-slate-900">Mô tả chi tiết</h4>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                      <div className="text-xs text-blue-700 mb-1">Mô tả</div>
                      <p className="text-sm text-slate-900">{selectedLog.description}</p>
                    </div>
                    
                    {selectedLog.reason && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="text-xs text-amber-700 mb-1">Lý do thay đổi</div>
                        <p className="text-sm text-amber-900">{selectedLog.reason}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200">
                  <div className="flex justify-end">
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
        </>
      ) : (
        <LogRetentionConfigPage />
      )}
    </div>
  );
}