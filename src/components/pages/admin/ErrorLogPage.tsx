import { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Download, 
  Calendar, 
  Filter, 
  Eye, 
  X,
  Clock,
  Code,
  AlertCircle,
  XCircle,
  AlertOctagon,
  Info,
  FileCode,
  Server,
  Database,
  Layers
} from 'lucide-react';
import { StatusTag } from '../../common/StatusTag';
import { StatsCard } from '../../common/StatsCard';

interface ErrorLog {
  id: number;
  timestamp: string;
  severity: 'critical' | 'error' | 'warning' | 'info';
  module: string;
  errorCode: string;
  errorMessage: string;
  errorType: string;
  user?: string;
  ip?: string;
  url?: string;
  method?: string;
  stackTrace?: string;
  resolved: boolean;
}

const errorLogs: ErrorLog[] = [
  {
    id: 1,
    timestamp: '22/12/2024 14:25:33',
    severity: 'critical',
    module: 'Database Connection',
    errorCode: 'DB_CONNECTION_TIMEOUT',
    errorMessage: 'Không thể kết nối đến cơ sở dữ liệu sau 30 giây',
    errorType: 'DatabaseException',
    user: 'system',
    ip: '192.168.1.100',
    url: '/api/data/sync',
    method: 'POST',
    stackTrace: `DatabaseException: Connection timeout after 30 seconds
    at DatabaseConnector.connect (db-connector.ts:145)
    at DataSyncService.syncData (data-sync.service.ts:78)
    at API.handleRequest (api.handler.ts:234)`,
    resolved: false
  },
  {
    id: 2,
    timestamp: '22/12/2024 14:20:15',
    severity: 'error',
    module: 'Data Processing',
    errorCode: 'DATA_VALIDATION_FAILED',
    errorMessage: 'Dữ liệu không hợp lệ: Thiếu trường bắt buộc "citizenId"',
    errorType: 'ValidationException',
    user: 'Nguyễn Văn An',
    ip: '192.168.1.105',
    url: '/api/data/process',
    method: 'POST',
    stackTrace: `ValidationException: Required field 'citizenId' is missing
    at DataValidator.validate (validator.ts:89)
    at DataProcessor.process (processor.ts:156)
    at ProcessingService.handleData (processing.service.ts:234)`,
    resolved: true
  },
  {
    id: 3,
    timestamp: '22/12/2024 14:15:42',
    severity: 'warning',
    module: 'API Gateway',
    errorCode: 'RATE_LIMIT_EXCEEDED',
    errorMessage: 'Vượt quá giới hạn 100 request/phút từ IP 192.168.1.120',
    errorType: 'RateLimitException',
    ip: '192.168.1.120',
    url: '/api/external/fetch',
    method: 'GET',
    stackTrace: `RateLimitException: Rate limit exceeded (100 requests/minute)
    at RateLimiter.checkLimit (rate-limiter.ts:45)
    at APIGateway.handleRequest (gateway.ts:123)`,
    resolved: false
  },
  {
    id: 4,
    timestamp: '22/12/2024 14:10:28',
    severity: 'error',
    module: 'File Storage',
    errorCode: 'FILE_UPLOAD_FAILED',
    errorMessage: 'Không thể tải lên file: Dung lượng vượt quá 50MB',
    errorType: 'FileUploadException',
    user: 'Trần Thị Bình',
    ip: '192.168.1.108',
    url: '/api/files/upload',
    method: 'POST',
    stackTrace: `FileUploadException: File size exceeds maximum allowed size (50MB)
    at FileValidator.checkSize (file-validator.ts:67)
    at FileUploadService.upload (upload.service.ts:145)
    at API.handleFileUpload (api.handler.ts:567)`,
    resolved: true
  },
  {
    id: 5,
    timestamp: '22/12/2024 14:05:55',
    severity: 'critical',
    module: 'Authentication',
    errorCode: 'AUTH_SERVICE_DOWN',
    errorMessage: 'Dịch vụ xác thực không phản hồi',
    errorType: 'ServiceUnavailableException',
    url: '/api/auth/verify',
    method: 'POST',
    stackTrace: `ServiceUnavailableException: Authentication service not responding
    at AuthClient.verifyToken (auth-client.ts:234)
    at AuthMiddleware.authenticate (auth.middleware.ts:89)
    at API.handleRequest (api.handler.ts:123)`,
    resolved: false
  },
  {
    id: 6,
    timestamp: '22/12/2024 14:00:12',
    severity: 'warning',
    module: 'Data Collection',
    errorCode: 'EXTERNAL_API_SLOW',
    errorMessage: 'API bên ngoài phản hồi chậm (>5s): Ministry of Justice API',
    errorType: 'PerformanceWarning',
    url: '/api/collection/external',
    method: 'GET',
    stackTrace: `PerformanceWarning: External API response time exceeded threshold (5000ms)
    at ExternalAPIClient.fetch (external-api.ts:178)
    at CollectionService.collectData (collection.service.ts:234)`,
    resolved: false
  },
  {
    id: 7,
    timestamp: '22/12/2024 13:55:40',
    severity: 'info',
    module: 'System Monitor',
    errorCode: 'HIGH_MEMORY_USAGE',
    errorMessage: 'Mức sử dụng bộ nhớ cao: 85%',
    errorType: 'SystemInfo',
    stackTrace: `SystemInfo: Memory usage is high (85%)
    at SystemMonitor.checkMemory (system-monitor.ts:456)
    at MonitorService.runChecks (monitor.service.ts:123)`,
    resolved: true
  },
  {
    id: 8,
    timestamp: '22/12/2024 13:50:18',
    severity: 'error',
    module: 'Data Export',
    errorCode: 'EXPORT_GENERATION_FAILED',
    errorMessage: 'Không thể tạo file Excel: Quá nhiều dòng dữ liệu (>1 triệu)',
    errorType: 'ExportException',
    user: 'Lê Văn Cường',
    ip: '192.168.1.115',
    url: '/api/export/excel',
    method: 'POST',
    stackTrace: `ExportException: Data set too large for Excel export (>1,000,000 rows)
    at ExcelGenerator.generate (excel-generator.ts:234)
    at ExportService.createExport (export.service.ts:456)
    at API.handleExport (api.handler.ts:789)`,
    resolved: false
  }
];

export function ErrorLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterModule, setFilterModule] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null);
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

  const filteredLogs = errorLogs.filter(log => {
    const matchesSearch = log.errorMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.errorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    const matchesModule = filterModule === 'all' || log.module === filterModule;

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
    return matchesSearch && matchesSeverity && matchesModule && matchesDate;
  });

  const handleViewDetail = (log: ErrorLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedLog(null);
  };

  const handleExportExcel = () => {
    alert('Đang kết xuất nhật ký lỗi ra file Excel...');
  };
  const getSeverityIcon = (severity: ErrorLog['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertOctagon className="w-4 h-4" />;
      case 'error':
        return <XCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: ErrorLog['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'error':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getSeverityLabel = (severity: ErrorLog['severity']) => {
    switch (severity) {
      case 'critical':
        return 'Nghiêm trọng';
      case 'error':
        return 'Lỗi';
      case 'warning':
        return 'Cảnh báo';
      case 'info':
        return 'Thông tin';
    }
  };

  const uniqueModules = Array.from(new Set(errorLogs.map(log => log.module)));

  return (
    <div className="space-y-6 error-log-container">
      <style>{`
        .error-log-container,
        .error-log-container .text-sm,
        .error-log-container .text-xs:not(th),
        .error-log-container input,
        .error-log-container select,
        .error-log-container button,
        .error-log-container td,
        .error-log-container option,
        .error-log-container div.text-slate-600,
        .error-log-container div.text-slate-700,
        .error-log-container div.text-slate-500,
        .error-log-container div.text-slate-900:not(.text-2xl) {
          font-size: 13px !important;
        }
      `}</style>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard 
          icon={AlertOctagon} 
          iconColor="red" 
          title="Nghiêm trọng (24h)" 
          value={errorLogs.filter(l => l.severity === 'critical').length.toString()} 
        />
        <StatsCard 
          icon={XCircle} 
          iconColor="orange" 
          title="Lỗi (24h)" 
          value={errorLogs.filter(l => l.severity === 'error').length.toString()} 
        />
        <StatsCard 
          icon={AlertTriangle} 
          iconColor="yellow" 
          title="Cảnh báo (24h)" 
          value={errorLogs.filter(l => l.severity === 'warning').length.toString()} 
        />
        <StatsCard 
          icon={AlertCircle} 
          iconColor="blue" 
          title="Chưa xử lý" 
          value={errorLogs.filter(l => !l.resolved).length.toString()} 
        />
      </div>

      {/* Filters & Search Row */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="relative flex-1">
              <input aria-label="Input field"
                type="text"
                placeholder="Tìm kiếm mã lỗi, thông báo, module..."
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
              <label className="text-[13px] font-medium text-slate-700">Mức độ</label>
              <select aria-label="Select box"
                value={filterSeverity}
                onChange={(e) => {
                  setFilterSeverity(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              >
                <option value="all">Tất cả mức độ</option>
                <option value="critical">Nghiêm trọng</option>
                <option value="error">Lỗi</option>
                <option value="warning">Cảnh báo</option>
                <option value="info">Thông tin</option>
              </select>
            </div>

            <div className="space-y-1.5 relative z-10">
              <label className="text-[13px] font-medium text-slate-700">Phân hệ</label>
              <select aria-label="Select box"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                value={filterModule}
                onChange={(e) => {
                  setFilterModule(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Tất cả module</option>
                {uniqueModules.map(module => (
                  <option key={module} value={module}>{module}</option>
                ))}
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

      {/* Error Logs Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
              <tr>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-12 text-[13px]">STT</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Thời gian</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Mức độ</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Module</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Mã lỗi</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Thông báo lỗi</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Người dùng</th>
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
                      <StatusTag 
                        label={getSeverityLabel(log.severity)} 
                        variant={log.severity === 'critical' ? 'red' : log.severity === 'error' ? 'orange' : log.severity === 'warning' ? 'yellow' : 'blue'} 
                        icon={getSeverityIcon(log.severity)}
                      />
                    </td>
                    <td className="px-4 py-3 text-left text-slate-700 text-[13px]">{log.module}</td>
                    <td className="px-4 py-3 text-left text-[13px]">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">
                        {log.errorCode}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-left text-slate-700 max-w-md truncate text-[13px]" title={log.errorMessage}>
                      {log.errorMessage}
                    </td>
                    <td className="px-4 py-3 text-left text-slate-600 text-[13px]">
                      {log.user || <span className="text-slate-400 italic">System</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusTag 
                        label={log.resolved ? 'Đã xử lý' : 'Chưa xử lý'} 
                        variant={log.resolved ? 'green' : 'red'} 
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
            className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(selectedLog.severity)}`}>
                  {getSeverityIcon(selectedLog.severity)}
                </div>
                <div>
                  <h3 className="text-slate-900 font-semibold">Chi tiết lỗi</h3>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Mã lỗi: <code className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{selectedLog.errorCode}</code>
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

            {/* Error Info */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">Thời gian</span>
                  </div>
                  <div className="text-sm text-slate-900 font-semibold">{selectedLog.timestamp}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Layers className="w-4 h-4" />
                    <span className="text-xs font-medium">Module</span>
                  </div>
                  <div className="text-sm text-slate-900 font-semibold">{selectedLog.module}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Code className="w-4 h-4" />
                    <span className="text-xs font-medium">Loại lỗi</span>
                  </div>
                  <div className="text-sm text-slate-900 font-semibold font-mono">{selectedLog.errorType}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Trạng thái</span>
                  </div>
                  <StatusTag 
                    label={selectedLog.resolved ? 'Đã xử lý' : 'Chưa xử lý'} 
                    variant={selectedLog.resolved ? 'green' : 'red'} 
                  />
                </div>
              </div>

              {/* Request Info */}
              {(selectedLog.url || selectedLog.method || selectedLog.ip) && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm text-slate-900 font-semibold">Thông tin request</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedLog.method && (
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Method</div>
                        <code className="text-xs bg-blue-50 px-2 py-1 rounded text-blue-700 font-mono">
                          {selectedLog.method}
                        </code>
                      </div>
                    )}
                    {selectedLog.url && (
                      <div className="md:col-span-2">
                        <div className="text-xs text-slate-500 mb-1">URL</div>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 block truncate font-mono">
                          {selectedLog.url}
                        </code>
                      </div>
                    )}
                    {selectedLog.ip && (
                      <div>
                        <div className="text-xs text-slate-500 mb-1">IP Address</div>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">
                          {selectedLog.ip}
                        </code>
                      </div>
                    )}
                    {selectedLog.user && (
                      <div className="md:col-span-2">
                        <div className="text-xs text-slate-500 mb-1">Người dùng</div>
                        <div className="text-sm text-slate-900">{selectedLog.user}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Message */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileCode className="w-4 h-4 text-orange-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">Thông báo lỗi</h4>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-900">{selectedLog.errorMessage}</p>
                </div>
              </div>

              {/* Stack Trace */}
              {selectedLog.stackTrace && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="w-4 h-4 text-purple-600" />
                    <h4 className="text-sm text-slate-900 font-semibold">Stack Trace</h4>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap leading-relaxed">
                      {selectedLog.stackTrace}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {!selectedLog.resolved && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                      Đánh dấu đã xử lý
                    </button>
                  )}
                  <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                    Copy Stack Trace
                  </button>
                </div>
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
