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
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { StatsCard } from '../../common/StatsCard';
import { StatusTag } from '../../common/StatusTag';

interface AccessLogEntry {
  id: number;
  timestamp: string;
  user: string;
  userId: string;
  ip: string;
  action: string;
  module: string;
  targetObject: string;
  status: 'success' | 'failed';
  userAgent: string;
  device: string;
  browser: string;
  location: string;
  description: string;
}

const mockAccessLogs: AccessLogEntry[] = [
  {
    id: 1,
    timestamp: '28/05/2026 15:30:22',
    user: 'Nguyễn Văn An',
    userId: 'admin_an',
    ip: '192.168.1.15',
    module: 'Quản lý nhật ký',
    action: 'Xem danh sách nhật ký truy cập',
    targetObject: 'Nhật ký truy cập hệ thống',
    status: 'success',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    device: 'Windows 11',
    browser: 'Chrome 124.0.0',
    location: 'Hà Nội, Việt Nam',
    description: 'Cán bộ xem danh sách nhật ký truy cập hệ thống. Hệ thống hiển thị danh sách nhật ký truy cập Phần mềm.'
  },
  {
    id: 2,
    timestamp: '28/05/2026 15:28:45',
    user: 'Nguyễn Văn An',
    userId: 'admin_an',
    ip: '192.168.1.15',
    module: 'Quản lý nhật ký',
    action: 'Tìm kiếm nhật ký truy cập',
    targetObject: 'Nhật ký truy cập hệ thống',
    status: 'success',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    device: 'Windows 11',
    browser: 'Chrome 124.0.0',
    location: 'Hà Nội, Việt Nam',
    description: 'Cán bộ tìm kiếm nhật ký truy cập hệ thống. Hệ thống truy vấn dữ liệu và hiển thị kết quả lên màn hình.'
  },
  {
    id: 3,
    timestamp: '28/05/2026 15:26:10',
    user: 'Nguyễn Văn An',
    userId: 'admin_an',
    ip: '192.168.1.15',
    module: 'Quản lý nhật ký',
    action: 'Kết xuất nhật ký truy cập',
    targetObject: 'Nhật ký truy cập hệ thống',
    status: 'success',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    device: 'Windows 11',
    browser: 'Chrome 124.0.0',
    location: 'Hà Nội, Việt Nam',
    description: 'Cán bộ kết xuất nhật ký truy cập hệ thống. Hệ thống kết xuất về file máy tính cá nhân của cán bộ (AccessLogs_Export.xlsx).'
  },
  {
    id: 4,
    timestamp: '28/05/2026 15:15:33',
    user: 'Trần Thị Bình',
    userId: 'user_binh_02',
    ip: '192.168.2.110',
    module: 'Thu thập dữ liệu',
    action: 'Truy vấn dữ liệu ngoài ngành',
    targetObject: 'Danh mục Dữ liệu thuế vụ',
    status: 'success',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    device: 'MacOS 14',
    browser: 'Safari 17.4',
    location: 'Hồ Chí Minh, Việt Nam',
    description: 'Truy vấn danh sách dữ liệu thu thập ngoài ngành phục vụ đối soát định kỳ.'
  },
  {
    id: 5,
    timestamp: '28/05/2026 15:10:05',
    user: 'Lê Văn Cường',
    userId: 'user_cuong_99',
    ip: '10.0.4.82',
    module: 'Quản lý người dùng',
    action: 'Thêm mới người dùng',
    targetObject: 'Tài khoản: pham_thi_dung',
    status: 'success',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0)',
    device: 'Windows 10',
    browser: 'Firefox 125.0',
    location: 'Đà Nẵng, Việt Nam',
    description: 'Tạo mới tài khoản cán bộ xử lý dữ liệu và gán vào nhóm nghiệp vụ Thu thập.'
  },
  {
    id: 6,
    timestamp: '28/05/2026 14:55:12',
    user: 'Lê Văn Cường',
    userId: 'user_cuong_99',
    ip: '10.0.4.82',
    module: 'Quản lý người dùng',
    action: 'Cập nhật phân quyền nhóm',
    targetObject: 'Nhóm: Kiểm tra dữ liệu',
    status: 'failed',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0)',
    device: 'Windows 10',
    browser: 'Firefox 125.0',
    location: 'Đà Nẵng, Việt Nam',
    description: 'Lỗi phân quyền: Người dùng không có quyền quản trị vai trò tối cao để cập nhật nhóm này.'
  },
  {
    id: 7,
    timestamp: '28/05/2026 14:48:30',
    user: 'Phạm Thị Dung',
    userId: 'user_dung_04',
    ip: '192.168.1.55',
    module: 'Quản lý danh mục',
    action: 'Kết xuất danh mục Dân tộc',
    targetObject: 'Danh mục dân tộc',
    status: 'success',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    device: 'Windows 11',
    browser: 'Edge 124.0.0',
    location: 'Hà Nội, Việt Nam',
    description: 'Kết xuất danh mục dân tộc chuẩn hóa ra file Excel (DanhMucDanToc.xlsx).'
  },
  {
    id: 8,
    timestamp: '28/05/2026 14:32:18',
    user: 'Hoàng Văn Em',
    userId: 'user_em_guest',
    ip: '172.16.85.3',
    module: 'Dữ liệu mở',
    action: 'Tải tài liệu hướng dẫn',
    targetObject: 'File: HDSD_DataSharing.pdf',
    status: 'success',
    userAgent: 'Mozilla/5.0 (Linux; Android 10; K)',
    device: 'Android Mobile',
    browser: 'Chrome Mobile',
    location: 'Hải Phòng, Việt Nam',
    description: 'Tải tài liệu hướng dẫn khai thác và chia sẻ dữ liệu qua cổng API công cộng.'
  },
  {
    id: 9,
    timestamp: '28/05/2026 14:10:45',
    user: 'Nguyễn Văn An',
    userId: 'admin_an',
    ip: '192.168.1.15',
    module: 'Cấu hình hệ thống',
    action: 'Cập nhật tham số bảo mật',
    targetObject: 'Quy tắc đặt mật khẩu',
    status: 'success',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    device: 'Windows 11',
    browser: 'Chrome 124.0.0',
    location: 'Hà Nội, Việt Nam',
    description: 'Thay đổi độ dài mật khẩu tối thiểu từ 8 lên 10 ký tự và yêu cầu ký tự đặc biệt.'
  },
  {
    id: 10,
    timestamp: '28/05/2026 11:22:04',
    user: 'Trần Thị Bình',
    userId: 'user_binh_02',
    ip: '192.168.2.110',
    module: 'Đối soát dữ liệu',
    action: 'Khởi chạy tiến trình đối soát',
    targetObject: 'Phiên đối soát #842',
    status: 'success',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    device: 'MacOS 14',
    browser: 'Safari 17.4',
    location: 'Hồ Chí Minh, Việt Nam',
    description: 'Khởi chạy thủ công tiến trình đối soát dữ liệu hộ tịch quốc gia tháng 05/2026.'
  },
  {
    id: 11,
    timestamp: '28/05/2026 10:45:00',
    user: 'Phạm Thị Dung',
    userId: 'user_dung_04',
    ip: '192.168.1.55',
    module: 'Quản lý danh mục',
    action: 'Xem chi tiết danh mục Giới tính',
    targetObject: 'Danh mục giới tính',
    status: 'success',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    device: 'Windows 11',
    browser: 'Edge 124.0.0',
    location: 'Hà Nội, Việt Nam',
    description: 'Tra cứu mã chuẩn hóa và danh sách các giá trị thuộc danh mục giới tính.'
  },
  {
    id: 12,
    timestamp: '28/05/2026 09:15:30',
    user: 'Nguyễn Văn An',
    userId: 'admin_an',
    ip: '192.168.1.15',
    module: 'Cấu hình hệ thống',
    action: 'Sao lưu cơ sở dữ liệu',
    targetObject: 'CSDL lõi - Phân hệ danh mục',
    status: 'success',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    device: 'Windows 11',
    browser: 'Chrome 124.0.0',
    location: 'Hà Nội, Việt Nam',
    description: 'Tạo bản sao lưu nóng cho phân hệ danh mục dữ liệu dùng chung trước khi bảo trì.'
  }
];

export function AccessLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLog, setSelectedLog] = useState<AccessLogEntry | null>(null);
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

  const filteredLogs = mockAccessLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.targetObject.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesModule = filterModule === 'all' || log.module === filterModule;
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
    
    return matchesSearch && matchesModule && matchesStatus && matchesDate;
  });

  const handleViewDetail = (log: AccessLogEntry) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedLog(null);
  };

  // Get unique modules for filters
  const modules = Array.from(new Set(mockAccessLogs.map(log => log.module)));

  return (
    <div className="space-y-6" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard icon={ScrollText} iconColor="blue" title="Tổng lượt truy cập (24h)" value="24,532" />
        <StatsCard icon={CheckCircle2} iconColor="green" title="Tác vụ thành công" value="24,410" />
        <StatsCard icon={AlertCircle} iconColor="red" title="Tác vụ thất bại" value="122" />
        <StatsCard icon={Activity} iconColor="purple" title="Phân hệ đã truy cập" value="8" />
      </div>

      {/* Filters and Actions */}
      <div className="mb-6">
        {/* Row 1: Search and Buttons */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="relative flex-1">
              <input aria-label="Input field"
                type="text"
                placeholder="Tìm kiếm người dùng, hành động, phân hệ, đối tượng..."
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
              onClick={() => alert('Đang kết xuất nhật ký truy cập ra file Excel...')}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Kết xuất
            </button>
          </div>
        </div>

        {/* Row 2: Filters (Collapsible) */}
        {showFilters && (
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-4 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
            <div className="absolute -top-2 left-[50px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>

            <div className="space-y-1.5 relative z-10">
              <label className="text-[13px] font-medium text-slate-700">Phân hệ</label>
              <select aria-label="Select module"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                value={filterModule}
                onChange={(e) => {
                  setFilterModule(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Tất cả phân hệ</option>
                {modules.map(mod => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
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
                <input aria-label="Start date"
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
                <input aria-label="End date"
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
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Người thực hiện</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Phân hệ</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Hành động</th>
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
                    <td className="px-4 py-3 text-center text-[13px]">
                      <span className="px-2 py-1 bg-slate-100 rounded text-slate-700 font-medium text-[11px]">
                        {log.module}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-700 text-[13px]">{log.action}</td>
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
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-[13px]">
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
            <select aria-label="Select page size" 
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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-slate-900">Chi tiết truy cập hệ thống</h3>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Log Entry ID: <span className="font-mono">LOG_{selectedLog.id.toString().padStart(6, '0')}</span>
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

            {/* Info Cards */}
            <div className="p-6 border-b border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-xs">Người thực hiện</span>
                  </div>
                  <div className="text-sm text-slate-900 font-medium">{selectedLog.user}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">{selectedLog.userId}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Thời gian thực hiện</span>
                  </div>
                  <div className="text-sm text-slate-900 font-medium">{selectedLog.timestamp}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <Monitor className="w-4 h-4" />
                    <span className="text-xs">Thiết bị & Trình duyệt</span>
                  </div>
                  <div className="text-sm text-slate-900 font-medium">{selectedLog.device}</div>
                  <div className="text-xs text-slate-500 mt-1">{selectedLog.browser}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">Vị trí thực hiện</span>
                  </div>
                  <div className="text-sm text-slate-900 font-medium">{selectedLog.location}</div>
                </div>
              </div>
            </div>

            {/* Detailed Log Info */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phân hệ / Module</h4>
                  <p className="text-sm text-slate-900 font-medium">{selectedLog.module}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hành động tác vụ</h4>
                  <p className="text-sm text-slate-900 font-medium">{selectedLog.action}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Trạng thái tác vụ</h4>
                  <div className="mt-1">
                    <StatusTag 
                      label={selectedLog.status === 'success' ? 'Thành công' : 'Thất bại'} 
                      variant={selectedLog.status === 'success' ? 'green' : 'red'} 
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Mô tả chi tiết tác vụ</h4>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 font-mono text-[12px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedLog.description}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 flex justify-between items-center bg-slate-50 rounded-b-lg">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <span>UA: {selectedLog.userAgent}</span>
              </div>
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-[13px] shadow-sm"
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
