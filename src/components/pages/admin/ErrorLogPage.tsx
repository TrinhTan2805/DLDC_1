import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertTriangle,
  Search,
  Download,
  Filter,
  Eye,
  X,
  AlertCircle,
  XCircle,
  AlertOctagon,
  Info
} from 'lucide-react';
import {
  Badge, TruncatedText, RowIconAction, Pagination, DateInput,
  BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS,
  FIELD_LABEL, FIELD_VALUE, SECTION_TITLE,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL,
  TABLE_WRAP_CLS, TABLE_HEAD_BG, TABLE_HEAD_ROW_CLS, normalizeSearch,
} from '../collection/collectionUi';

interface ErrorLog {
  id: number;
  timestamp: string;
  severity: 'critical' | 'error' | 'warning' | 'info';
  module: string;
  errorCode: string;
  errorMessage: string;
  errorType: string;
  user?: string;
  userAccount?: string;
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
    userAccount: 'an.nv',
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
    userAccount: 'binh.tt',
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
    userAccount: 'cuong.lv',
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

// Bảng dữ liệu (compomennt.md 5.3): tiêu đề 42px chữ 13px/700 đen, ô 13px/400 đen, hàng 48px kẻ #E0E0E0
const TH = 'h-[42px] px-3 py-[13px] text-[13px] font-bold text-black whitespace-nowrap';
const TD = 'px-3 py-1 text-[13px] text-black';
const MODAL_TITLE = 'text-[16px] font-medium text-[#020817]';
const MODAL_FOOTER = 'shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3';

// Thẻ thống kê nhỏ (mục 5.6.1)
const STAT_TONES = {
  red: 'bg-red-50 text-red-600',
  orange: 'bg-orange-50 text-orange-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  blue: 'bg-blue-50 text-blue-600',
} as const;

const StatCard = ({ icon: Icon, tone, title, value }: { icon: typeof AlertOctagon; tone: keyof typeof STAT_TONES; title: string; value: string }) => (
  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${STAT_TONES[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-[16px] text-[#64748B]">{title}</div>
        <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{value}</div>
      </div>
    </div>
  </div>
);

// 'dd/mm/yyyy HH:mm:ss' → ngày và giờ (giờ xuống dòng thứ 2 trong bảng — mục 5.3.3)
const splitTimestamp = (ts: string) => {
  const [date, time] = (ts || '').split(' ');
  return { date: date || '-', time: time || '' };
};

export function ErrorLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterModule, setFilterModule] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // Điều kiện đang áp dụng — chỉ cập nhật khi bấm Tìm kiếm / Enter (compomennt.md 5.19)
  const [applied, setApplied] = useState({ searchTerm: '', filterSeverity: 'all', filterModule: 'all', startDate: '', endDate: '' });
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

  const runSearch = () => {
    setApplied({ searchTerm, filterSeverity, filterModule, startDate, endDate });
    setCurrentPage(1);
  };

  const appliedTerm = normalizeSearch(applied.searchTerm);
  const filteredLogs = errorLogs.filter(log => {
    const matchesSearch = normalizeSearch(log.errorMessage).includes(appliedTerm) ||
                         normalizeSearch(log.errorCode).includes(appliedTerm) ||
                         normalizeSearch(log.module).includes(appliedTerm);
    const matchesSeverity = applied.filterSeverity === 'all' || log.severity === applied.filterSeverity;
    const matchesModule = applied.filterModule === 'all' || log.module === applied.filterModule;

    let matchesDate = true;
    if (applied.startDate || applied.endDate) {
      const logDate = parseDate(log.timestamp);
      if (logDate) {
        if (applied.startDate) {
          const start = new Date(applied.startDate);
          start.setHours(0, 0, 0, 0);
          if (logDate < start) matchesDate = false;
        }
        if (applied.endDate) {
          const end = new Date(applied.endDate);
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
    toast.info('Đang kết xuất nhật ký lỗi ra file Excel...');
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
  const pagedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Tiêu đề trang (H1 20px/700 #2A0F0F) */}
      <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Nhật ký các lỗi phát sinh</h1>

      {/* Thẻ thống kê nhỏ (compomennt.md 5.6.1) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={AlertOctagon} tone="red" title="Nghiêm trọng (24h)" value={errorLogs.filter(l => l.severity === 'critical').length.toString()} />
        <StatCard icon={XCircle} tone="orange" title="Lỗi (24h)" value={errorLogs.filter(l => l.severity === 'error').length.toString()} />
        <StatCard icon={AlertTriangle} tone="yellow" title="Cảnh báo (24h)" value={errorLogs.filter(l => l.severity === 'warning').length.toString()} />
        <StatCard icon={AlertCircle} tone="blue" title="Chưa xử lý" value={errorLogs.filter(l => !l.resolved).length.toString()} />
      </div>

      {/* Tìm kiếm & bộ lọc (5.19) — chỉ áp dụng khi bấm Tìm kiếm / Enter */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-1.5">
            <input
              type="text"
              aria-label="Tìm kiếm nhật ký lỗi"
              placeholder="Tìm kiếm theo mã lỗi, thông báo, module..."
              className={SEARCH_INPUT_CLS}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
            />
            <button type="button" title="Tìm kiếm" aria-label="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-label="Bộ lọc"
              title="Bộ lọc"
              className={filterBtnClass(showFilters)}
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button type="button" onClick={handleExportExcel} className={BTN_OUTLINE}>
              <Download className="w-4 h-4" />
              Kết xuất
            </button>
          </div>
        </div>

        {/* Vùng bộ lọc */}
        {showFilters && (
          <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
            <div>
              <label className={FILTER_LABEL}>Mức độ</label>
              <select
                aria-label="Lọc theo mức độ"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className={INPUT_CLS}
              >
                <option value="all">Tất cả mức độ</option>
                <option value="critical">Nghiêm trọng</option>
                <option value="error">Lỗi</option>
                <option value="warning">Cảnh báo</option>
                <option value="info">Thông tin</option>
              </select>
            </div>

            <div>
              <label className={FILTER_LABEL}>Phân hệ</label>
              <select
                aria-label="Lọc theo phân hệ"
                className={INPUT_CLS}
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
              >
                <option value="all">Tất cả module</option>
                {uniqueModules.map(module => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={FILTER_LABEL}>Thời gian từ</label>
              <DateInput value={startDate} onChange={setStartDate} ariaLabel="Thời gian từ" max={endDate || undefined} />
            </div>

            <div>
              <label className={FILTER_LABEL}>Thời gian đến</label>
              <DateInput value={endDate} onChange={setEndDate} ariaLabel="Thời gian đến" min={startDate || undefined} />
            </div>
          </div>
        )}
      </div>

      {/* Bảng nhật ký lỗi (5.3) */}
      <div className={TABLE_WRAP_CLS}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className={`${TABLE_HEAD_BG} sticky top-0 z-10`}>
              <tr className={TABLE_HEAD_ROW_CLS}>
                <th className={`${TH} text-center w-14`}>STT</th>
                <th className={`${TH} text-left`}>Thời gian</th>
                <th className={`${TH} text-left`}>Mức độ</th>
                <th className={`${TH} text-left`}>Module</th>
                <th className={`${TH} text-left`}>Mã lỗi</th>
                <th className={`${TH} text-left`}>Thông báo lỗi</th>
                <th className={`${TH} text-left`}>Người dùng</th>
                <th className={`${TH} text-left`}>Trạng thái</th>
                <th className={`${TH} text-center w-24 sticky right-0 ${TABLE_HEAD_BG} shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pagedLogs.map((log, index) => {
                const ts = splitTimestamp(log.timestamp);
                return (
                  <tr key={log.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                    <td className={`${TD} text-center tabular-nums whitespace-nowrap`}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className={`${TD} text-left whitespace-nowrap leading-[18px] tabular-nums`}>
                      <div>{ts.date}</div>
                      {ts.time && <div>{ts.time}</div>}
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap`}>
                      {getSeverityLabel(log.severity)}
                    </td>
                    <td className={`${TD} text-left max-w-[200px]`}>
                      <TruncatedText text={log.module} />
                    </td>
                    <td className={`${TD} text-left max-w-[240px]`}>
                      <TruncatedText text={log.errorCode} className="font-mono" />
                    </td>
                    <td className={`${TD} text-left max-w-[360px]`}>
                      <TruncatedText text={log.errorMessage} />
                    </td>
                    <td className={`${TD} text-left max-w-[240px] leading-[18px]`}>
                      {log.userAccount ? (
                        <>
                          <TruncatedText text={log.user || ''} />
                          <TruncatedText text={log.userAccount} className="text-[12px] text-[#64748B]" />
                        </>
                      ) : (
                        <>
                          <div>Hệ thống</div>
                          <div className="text-[12px] text-[#64748B]">system</div>
                        </>
                      )}
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap`}>
                      <Badge
                        label={log.resolved ? 'Đã xử lý' : 'Chưa xử lý'}
                        variant={log.resolved ? 'green' : 'red'}
                      />
                    </td>
                    <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]`}>
                      <div className="inline-flex items-center justify-center gap-1">
                        <RowIconAction label="Xem chi tiết" onClick={() => handleViewDetail(log)}>
                          <Eye className="w-4 h-4" />
                        </RowIconAction>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-[13px] text-[#64748B]">
                    Không tìm thấy bản ghi nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang (5.14) */}
        <Pagination
          className="border-t border-[#E2E8F0]"
          currentPage={currentPage}
          totalItems={filteredLogs.length}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </div>

      {/* Chi tiết lỗi — chiều cao cố định, thân tự cuộn (5.4) */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={closeDetailModal}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="error-detail-title"
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] max-h-[800px] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 id="error-detail-title" className={MODAL_TITLE}>Chi tiết lỗi</h3>
                <p className="text-[13px] text-[#64748B] mt-0.5 truncate">
                  Mã lỗi: <span className="font-mono text-[#020817]">{selectedLog.errorCode}</span>
                </p>
              </div>
              <button type="button" onClick={closeDetailModal} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
              {/* Thông tin chung */}
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <h4 className={SECTION_TITLE}>
                  <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                  Thông tin chung
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Thời gian</div>
                    <div className={`${FIELD_VALUE} tabular-nums`}>{selectedLog.timestamp}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Module</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedLog.module}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Loại lỗi</div>
                    <div className={`${FIELD_VALUE} font-mono break-all`}>{selectedLog.errorType}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Trạng thái</div>
                    <Badge
                      label={selectedLog.resolved ? 'Đã xử lý' : 'Chưa xử lý'}
                      variant={selectedLog.resolved ? 'green' : 'red'}
                    />
                  </div>
                </div>
              </div>

              {/* Request Info */}
              {(selectedLog.url || selectedLog.method || selectedLog.ip) && (
                <div className="rounded-2xl border border-[#E2E8F0] p-4">
                  <h4 className={SECTION_TITLE}>
                    <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                    Thông tin request
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                    {selectedLog.method && (
                      <div className="space-y-1">
                        <div className={FIELD_LABEL}>Method</div>
                        <div className={`${FIELD_VALUE} font-mono`}>{selectedLog.method}</div>
                      </div>
                    )}
                    {selectedLog.url && (
                      <div className="space-y-1 md:col-span-2">
                        <div className={FIELD_LABEL}>URL</div>
                        <div className={`${FIELD_VALUE} font-mono break-all`}>{selectedLog.url}</div>
                      </div>
                    )}
                    {selectedLog.ip && (
                      <div className="space-y-1">
                        <div className={FIELD_LABEL}>IP Address</div>
                        <div className={`${FIELD_VALUE} font-mono tabular-nums`}>{selectedLog.ip}</div>
                      </div>
                    )}
                    {selectedLog.user && (
                      <div className="space-y-1 md:col-span-2">
                        <div className={FIELD_LABEL}>Người dùng</div>
                        <div className={`${FIELD_VALUE} break-words`}>{selectedLog.userAccount ? selectedLog.user : 'Hệ thống'}</div>
                        <div className="text-[12px] text-[#64748B] break-words">{selectedLog.userAccount || 'system'}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Message */}
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <h4 className={SECTION_TITLE}>
                  <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                  Thông báo lỗi
                </h4>
                <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg px-4 py-3">
                  <p className="text-[13px] text-[#B91C1C] break-words">{selectedLog.errorMessage}</p>
                </div>
              </div>

              {/* Stack Trace */}
              {selectedLog.stackTrace && (
                <div className="rounded-2xl border border-[#E2E8F0] p-4">
                  <h4 className={SECTION_TITLE}>
                    <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                    Stack Trace
                  </h4>
                  <pre className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] text-[#020817] font-mono whitespace-pre-wrap break-words leading-relaxed">
                    {selectedLog.stackTrace}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={MODAL_FOOTER}>
              <div className="flex items-center gap-3">
                {!selectedLog.resolved && (
                  <button type="button" className={BTN_PRIMARY}>
                    Đánh dấu đã xử lý
                  </button>
                )}
                <button type="button" className={BTN_OUTLINE}>
                  Copy Stack Trace
                </button>
              </div>
              <button type="button" onClick={closeDetailModal} className={BTN_OUTLINE}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
