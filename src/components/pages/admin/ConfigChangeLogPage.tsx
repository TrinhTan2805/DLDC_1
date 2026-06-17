import { useState } from 'react';
import { Settings, Search, Download, Calendar, Filter, Eye, X, Clock, User, CheckCircle2, XCircle, Shield, Database, Mail, Lock, Globe, Bell, Palette, HardDrive, FileText, ArrowRight, Plus, Edit, Trash2, Save, AlertTriangle } from "lucide-react";
import { StatsCard } from '../../common/StatsCard';
import { StatusTag } from '../../common/StatusTag';
import { LogRetentionConfigPage } from './LogRetentionConfigPage';

interface ConfigLog {
  id: number;
  timestamp: string;
  configCategory: 'upload_limit' | 'display' | 'maintenance' | 'login_limit' | 'session' | 'backup';
  configCategoryName: string;
  performedBy: string;
  performedById: string;
  ip: string;
  status: 'success' | 'failed';
  description: string;
  reason?: string;
}

const configLogs: ConfigLog[] = [
  {
    id: 1,
    timestamp: '22/12/2024 16:45:30',
    configCategory: 'session',
    configCategoryName: 'Cấu hình phiên làm việc',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    description: 'Tăng thời gian timeout phiên đăng nhập từ 30 phút lên 60 phút',
    reason: 'Theo yêu cầu của Phòng CNTT'
  },
  {
    id: 2,
    timestamp: '22/12/2024 16:30:15',
    configCategory: 'login_limit',
    configCategoryName: 'Cấu hình giới hạn đăng nhập sai',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'success',
    description: 'Điều chỉnh số lần đăng nhập sai tối đa từ 3 lần lên 5 lần',
    reason: 'Giảm số lượng tài khoản bị khóa do nhập sai'
  },
  {
    id: 3,
    timestamp: '22/12/2024 16:15:42',
    configCategory: 'maintenance',
    configCategoryName: 'Cấu hình chế độ bảo trị hệ thống',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    description: 'Kích hoạt chế độ bảo trì hệ thống để thực hiện bảo dưỡng CSDL định kỳ',
    reason: 'Bảo trì định kỳ hệ thống'
  },
  {
    id: 4,
    timestamp: '22/12/2024 16:00:28',
    configCategory: 'backup',
    configCategoryName: 'Cấu hình sao lưu dự phòng',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'success',
    description: 'Thay đổi lịch sao lưu tự động từ Hàng tuần sang Hàng ngày',
    reason: 'Đảm bảo an toàn dữ liệu quan trọng'
  },
  {
    id: 5,
    timestamp: '22/12/2024 15:45:55',
    configCategory: 'upload_limit',
    configCategoryName: 'Cấu hình giới hạn dung lượng tải lên',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    description: 'Tăng kích thước tệp upload tối đa từ 10 MB lên 50 MB',
    reason: 'Hỗ trợ upload tài liệu scan có dung lượng lớn'
  },
  {
    id: 6,
    timestamp: '22/12/2024 15:30:20',
    configCategory: 'display',
    configCategoryName: 'Cấu hình hiển thị danh sách',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'success',
    description: 'Điều chỉnh số lượng bản ghi hiển thị mặc định từ 10 lên 20 bản ghi/trang',
    reason: 'Cải thiện trải nghiệm của người dùng'
  },
  {
    id: 7,
    timestamp: '22/12/2024 15:15:45',
    configCategory: 'backup',
    configCategoryName: 'Cấu hình sao lưu dự phòng',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    description: 'Tăng thời gian giữ bản sao lưu hệ thống từ 30 ngày lên 90 ngày',
    reason: 'Phục vụ kiểm toán và tra cứu lịch sử'
  },
  {
    id: 8,
    timestamp: '22/12/2024 15:00:30',
    configCategory: 'display',
    configCategoryName: 'Cấu hình hiển thị danh sách',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'success',
    description: 'Thay đổi giao diện mặc định sang tự động theo hệ thống',
    reason: 'Cải thiện trải nghiệm người dùng'
  },
  {
    id: 9,
    timestamp: '22/12/2024 14:45:15',
    configCategory: 'session',
    configCategoryName: 'Cấu hình phiên làm việc',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    description: 'Giảm thời gian tự động khóa màn hình làm việc khi không hoạt động xuống 15 phút',
    reason: 'Đảm bảo an toàn thiết bị đầu cuối'
  },
  {
    id: 10,
    timestamp: '22/12/2024 14:30:42',
    configCategory: 'login_limit',
    configCategoryName: 'Cấu hình giới hạn đăng nhập sai',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'failed',
    description: 'Kích hoạt yêu cầu xác thực 2 lớp (2FA) thất bại do lỗi cấu hình SMTP',
    reason: 'Cần cấu hình SMTP trước khi bật 2FA'
  },
  {
    id: 11,
    timestamp: '22/12/2024 14:15:28',
    configCategory: 'display',
    configCategoryName: 'Cấu hình hiển thị danh sách',
    performedBy: 'Nguyễn Văn An',
    performedById: 'nguyenvanan',
    ip: '192.168.1.105',
    status: 'success',
    description: 'Thay đổi múi giờ hệ thống sang UTC+7 (Giờ Việt Nam)',
    reason: 'Hiển thị thời gian chính xác theo giờ địa phương'
  },
  {
    id: 12,
    timestamp: '22/12/2024 14:00:55',
    configCategory: 'upload_limit',
    configCategoryName: 'Cấu hình giới hạn dung lượng tải lên',
    performedBy: 'Admin Hệ thống',
    performedById: 'admin',
    ip: '192.168.1.100',
    status: 'success',
    description: 'Tăng giới hạn dung lượng file upload tài liệu đính kèm tối đa lên 100 MB',
    reason: 'Hỗ trợ các file hồ sơ quét độ phân giải cao'
  }
];

export function ConfigChangeLogPage() {
  const [activeTab, setActiveTab] = useState<'logs' | 'retention'>('logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ConfigLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  const filteredLogs = configLogs.filter(log => {
    const matchesSearch = log.configCategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.configCategory === filterType;
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
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
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
    alert('Đang kết xuất nhật ký thay đổi cấu hình ra file Excel...');
  };

  const getConfigCategoryIcon = (category: ConfigLog['configCategory']) => {
    switch (category) {
      case 'upload_limit':
        return <HardDrive className="w-4 h-4" />;
      case 'display':
        return <Palette className="w-4 h-4" />;
      case 'maintenance':
        return <Settings className="w-4 h-4" />;
      case 'login_limit':
        return <Shield className="w-4 h-4" />;
      case 'session':
        return <Clock className="w-4 h-4" />;
      case 'backup':
        return <Database className="w-4 h-4" />;
    }
  };

  const getConfigCategoryColor = (category: ConfigLog['configCategory']) => {
    switch (category) {
      case 'upload_limit':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'display':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'maintenance':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'login_limit':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'session':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'backup':
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getConfigCategoryLabel = (category: ConfigLog['configCategory']) => {
    switch (category) {
      case 'upload_limit':
        return 'Cấu hình giới hạn dung lượng tải lên';
      case 'display':
        return 'Cấu hình hiển thị danh sách';
      case 'maintenance':
        return 'Cấu hình chế độ bảo trị hệ thống';
      case 'login_limit':
        return 'Cấu hình giới hạn đăng nhập sai';
      case 'session':
        return 'Cấu hình phiên làm việc';
      case 'backup':
        return 'Cấu hình sao lưu dự phòng';
    }
  };

  return (
    <div className="space-y-6 config-log-container">
      <style>{`
        .config-log-container,
        .config-log-container .text-sm,
        .config-log-container .text-xs:not(th),
        .config-log-container input,
        .config-log-container select,
        .config-log-container button,
        .config-log-container td,
        .config-log-container option,
        .config-log-container div.text-slate-600,
        .config-log-container div.text-slate-700,
        .config-log-container div.text-slate-500,
        .config-log-container div.text-slate-900:not(.text-2xl) {
          font-size: 13px !important;
        }
      `}</style>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 -mx-6 -mt-6 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 ${
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-5 h-5" />
            Nhật ký thay đổi cấu hình
          </button>
          <button
            onClick={() => setActiveTab('retention')}
            className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 ${
              activeTab === 'retention'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-5 h-5" />
            Quản lý thời gian lưu trữ nhật ký
          </button>
        </div>
      </div>
      {activeTab === 'logs' ? (
        <>
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
              title="Cấu hình đăng nhập sai" 
              value={configLogs.filter(l => l.configCategory === 'login_limit').length.toString()} 
            />
            <StatsCard 
              icon={Database} 
              iconColor="green" 
              title="Cấu hình sao lưu" 
              value={configLogs.filter(l => l.configCategory === 'backup').length.toString()} 
            />
            <StatsCard 
              icon={XCircle} 
              iconColor="red" 
              title="Thay đổi thất bại" 
              value={configLogs.filter(l => l.status === 'failed').length.toString()} 
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1">
                  <input aria-label="Input field"
                    type="text"
                    placeholder="Tìm kiếm loại cấu hình, người thực hiện..."
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
            {showFilters && (
              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-4 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
                <div className="absolute -top-2 left-[50px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>

                <div className="space-y-1.5 relative z-10">
                  <label className="text-[13px] font-medium text-slate-700">Loại cấu hình</label>
                  <select aria-label="Select config type"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">Tất cả loại cấu hình</option>
                    <option value="upload_limit">Cấu hình giới hạn dung lượng tải lên</option>
                    <option value="display">Cấu hình hiển thị danh sách</option>
                    <option value="maintenance">Cấu hình chế độ bảo trị hệ thống</option>
                    <option value="login_limit">Cấu hình giới hạn đăng nhập sai</option>
                    <option value="session">Cấu hình phiên làm việc</option>
                    <option value="backup">Cấu hình sao lưu dự phòng</option>
                  </select>
                </div>

                <div className="space-y-1.5 relative z-10">
                  <label className="text-[13px] font-medium text-slate-700">Trạng thái</label>
                  <select aria-label="Select status"
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

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse collection-table text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
                  <tr>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-12 text-[13px]">STT</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Người thực hiện</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Thời gian</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Loại cấu hình</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Nội dung thay đổi</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">IP người thực hiện</th>
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
                        <td className="px-4 py-3 text-center text-[13px]">
                          <div className="font-medium text-slate-950 leading-snug text-[13px]">{log.performedBy}</div>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-700 text-[13px]">{log.timestamp}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center">
                            <StatusTag 
                              label={log.configCategoryName} 
                              variant={
                                log.configCategory === 'login_limit' ? 'red' :
                                log.configCategory === 'session' ? 'orange' :
                                log.configCategory === 'backup' ? 'green' :
                                log.configCategory === 'upload_limit' ? 'blue' :
                                log.configCategory === 'display' ? 'pink' : 'purple'
                              }
                              icon={getConfigCategoryIcon(log.configCategory)}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-[13px]">
                          <div className="font-medium text-slate-900 leading-snug text-[13px] max-w-sm mx-auto truncate" title={log.description}>{log.description}</div>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 font-mono text-[13px]">{log.ip}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center">
                            <StatusTag 
                              label={log.status === 'success' ? 'Thành công' : 'Thất bại'} 
                              variant={log.status === 'success' ? 'green' : 'red'} 
                              icon={log.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            />
                          </div>
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
            
            <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
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

          {showDetailModal && selectedLog && (
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={closeDetailModal}
            >
              <div 
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getConfigCategoryColor(selectedLog.configCategory)}`}>
                      {getConfigCategoryIcon(selectedLog.configCategory)}
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-bold text-[15px]">Chi tiết thay đổi cấu hình</h3>
                      <p className="text-[13px] text-slate-600 mt-0.5">{selectedLog.configCategoryName}</p>
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

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-[11px] font-medium uppercase tracking-wider">Thời gian thay đổi</span>
                      </div>
                      <div className="text-[13px] text-slate-900 font-medium">{selectedLog.timestamp}</div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[11px] font-medium uppercase tracking-wider">Trạng thái</span>
                      </div>
                      <div className="inline-block">
                        <StatusTag 
                          label={selectedLog.status === 'success' ? 'Thành công' : 'Thất bại'} 
                          variant={selectedLog.status === 'success' ? 'green' : 'red'} 
                          icon={selectedLog.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Settings className="w-4 h-4 text-blue-600" />
                      <h4 className="text-[13px] font-semibold text-slate-900">Thông tin cấu hình</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-[11px] text-slate-500 mb-1">Loại cấu hình</div>
                        <div className="inline-block">
                          <StatusTag 
                            label={selectedLog.configCategoryName} 
                            variant={
                              selectedLog.configCategory === 'login_limit' ? 'red' :
                              selectedLog.configCategory === 'session' ? 'orange' :
                              selectedLog.configCategory === 'backup' ? 'green' :
                              selectedLog.configCategory === 'upload_limit' ? 'blue' :
                              selectedLog.configCategory === 'display' ? 'pink' : 'purple'
                            }
                            icon={getConfigCategoryIcon(selectedLog.configCategory)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-green-600" />
                      <h4 className="text-[13px] font-semibold text-slate-900">Người thực hiện</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-[11px] text-slate-500 mb-1">Họ tên</div>
                        <div className="text-[13px] text-slate-900 font-medium">{selectedLog.performedBy}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500 mb-1">IP Address</div>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                          {selectedLog.ip}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-cyan-600" />
                      <h4 className="text-[13px] font-semibold text-slate-900">Nội dung thay đổi</h4>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                      <div className="text-[11px] text-blue-700 mb-1">Mô tả</div>
                      <p className="text-[13px] text-slate-900">{selectedLog.description}</p>
                    </div>
                    
                    {selectedLog.reason && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="text-[11px] text-amber-700 mb-1">Lý do thay đổi</div>
                        <p className="text-[13px] text-amber-900">{selectedLog.reason}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 border-t border-slate-200">
                  <div className="flex justify-end">
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
        </>
      ) : (
        <LogRetentionConfigPage />
      )}
    </div>
  );
}