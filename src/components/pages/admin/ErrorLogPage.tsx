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
import { StatsCard } from '../../common/StatsCard';
import { StatusTag } from '../../common/StatusTag';

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
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredLogs = errorLogs.filter(log => {
    const matchesSearch = log.errorMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.errorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    const matchesModule = filterModule === 'all' || log.module === filterModule;
    return matchesSearch && matchesSeverity && matchesModule;
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
    alert('Đang xuất file Excel...');
    // Logic export Excel
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
    <div className="space-y-6">
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

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm mã lỗi, thông báo, module..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="critical">Nghiêm trọng</option>
              <option value="error">Lỗi</option>
              <option value="warning">Cảnh báo</option>
              <option value="info">Thông tin</option>
            </select>
          </div>
          <div>
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả module</option>
              {uniqueModules.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
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

      {/* Error Logs Table */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-slate-900">Nhật ký lỗi ({filteredLogs.length} bản ghi)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mức độ</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Module</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã lỗi</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thông báo lỗi</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <StatusTag 
                      label={getSeverityLabel(log.severity)} 
                      variant={log.severity === 'critical' ? 'red' : log.severity === 'error' ? 'orange' : log.severity === 'warning' ? 'yellow' : 'blue'} 
                      icon={getSeverityIcon(log.severity)}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{log.module}</td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                      {log.errorCode}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 max-w-md truncate">
                    {log.errorMessage}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {log.user || <span className="text-slate-400 italic">System</span>}
                  </td>
                  <td className="px-6 py-4">
                    <StatusTag 
                      label={log.resolved ? 'Đã xử lý' : 'Chưa xử lý'} 
                      variant={log.resolved ? 'green' : 'red'} 
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
            Hiển thị 1-{filteredLogs.length} trong tổng số 1,247 bản ghi
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
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(selectedLog.severity)}`}>
                  {getSeverityIcon(selectedLog.severity)}
                </div>
                <div>
                  <h3 className="text-slate-900">Chi tiết lỗi</h3>
                  <p className="text-sm text-slate-600 mt-0.5">
                    <code className="font-mono">{selectedLog.errorCode}</code>
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

            {/* Error Info */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Thời gian</span>
                  </div>
                  <div className="text-sm text-slate-900">{selectedLog.timestamp}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <Layers className="w-4 h-4" />
                    <span className="text-xs">Module</span>
                  </div>
                  <div className="text-sm text-slate-900">{selectedLog.module}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <Code className="w-4 h-4" />
                    <span className="text-xs">Loại lỗi</span>
                  </div>
                  <div className="text-sm text-slate-900">{selectedLog.errorType}</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">Trạng thái</span>
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
                    <h4 className="text-sm text-slate-900">Thông tin request</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedLog.method && (
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Method</div>
                        <code className="text-xs bg-blue-50 px-2 py-1 rounded text-blue-700">
                          {selectedLog.method}
                        </code>
                      </div>
                    )}
                    {selectedLog.url && (
                      <div className="md:col-span-2">
                        <div className="text-xs text-slate-500 mb-1">URL</div>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 block truncate">
                          {selectedLog.url}
                        </code>
                      </div>
                    )}
                    {selectedLog.ip && (
                      <div>
                        <div className="text-xs text-slate-500 mb-1">IP Address</div>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
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
                  <h4 className="text-sm text-slate-900">Thông báo lỗi</h4>
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
                    <h4 className="text-sm text-slate-900">Stack Trace</h4>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
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
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Đánh dấu đã xử lý
                    </button>
                  )}
                  <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                    Copy Stack Trace
                  </button>
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
