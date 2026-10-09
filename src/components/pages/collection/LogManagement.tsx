import { useState, useEffect } from 'react';
import { Search, Eye, Download, User, Activity, Monitor, Filter, X, Calendar, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Badge, TruncatedText, RowIconAction, BTN_FOCUS, BTN_OUTLINE, BTN_PAGE, BTN_PAGE_IDLE, BTN_GHOST_ICON, INPUT_CLS, FIELD_LABEL, FIELD_VALUE, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, DATE_BOX_CLS, normalizeSearch, Pagination, DateInput, TABLE_HEAD_BG, TABLE_HEAD_ROW_CLS, TABLE_WRAP_CLS } from './collectionUi';

// yyyy-MM-dd HH:mm:ss -> [dd/MM/yyyy, HH:mm:ss] (mục 5.3: ngày dd/MM/yyyy, giờ xuống dòng)
const formatDateTime = (ts: string): [string, string] => {
  const [date = '', time = ''] = (ts || '').split(' ');
  const [y, m, d] = date.split('-');
  return [y && m && d ? `${d}/${m}/${y}` : date, time];
};

const logStatusVariant = (status: string) =>
  status === 'Thành công' || status === 'Active' ? 'green' : status === 'Thất bại' ? 'red' : 'slate';

interface LogEntry {
  id: number;
  user: string;
  userName: string;
  action: string;
  module: string;
  timestamp: string;
  ip: string;
  device: string;
  browser: string;
  status: string;
  statusColor: string;
  details: string;
}

export function LogManagement({ initialOpenLogId }: { initialOpenLogId?: number | null }) {
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [logSearchText, setLogSearchText] = useState('');
  const [logUserFilter, setLogUserFilter] = useState('all');
  const [logActionFilter, setLogActionFilter] = useState('all');
  const [logDateFrom, setLogDateFrom] = useState('');
  const [logDateTo, setLogDateTo] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [showLogDetailModal, setShowLogDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  // Điều kiện đã áp dụng: chỉ cập nhật khi bấm nút Tìm kiếm hoặc Enter (mục 5.19)
  const [applied, setApplied] = useState({ text: '', user: 'all', action: 'all', from: '', to: '' });
  const runSearch = () => {
    setApplied({ text: logSearchText, user: logUserFilter, action: logActionFilter, from: logDateFrom, to: logDateTo });
    setCurrentPage(1);
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data cho lịch sử truy cập
  const accessLogs: LogEntry[] = [
    {
      id: 1,
      user: 'admin',
      userName: 'Nguyễn Văn A',
      action: 'Đăng nhập',
      module: 'Hệ thống',
      timestamp: '2023-12-19 08:30:15',
      ip: '192.168.1.100',
      device: 'Windows 10',
      browser: 'Chrome 120.0',
      status: 'Thành công',
      statusColor: 'bg-green-100 text-green-700',
      details: 'Đăng nhập thành công vào hệ thống'
    },
    {
      id: 2,
      user: 'user1',
      userName: 'Trần Thị B',
      action: 'Đăng nhập',
      module: 'Hệ thống',
      timestamp: '2023-12-19 09:15:42',
      ip: '192.168.1.101',
      device: 'MacOS 14',
      browser: 'Safari 17.0',
      status: 'Thất bại',
      statusColor: 'bg-red-100 text-red-700',
      details: 'Sai mật khẩu - Lần thử thứ 2'
    },
    {
      id: 3,
      user: 'user2',
      userName: 'Lê Văn C',
      action: 'Đăng xuất',
      module: 'Hệ thống',
      timestamp: '2023-12-19 10:20:33',
      ip: '192.168.1.102',
      device: 'Ubuntu 22.04',
      browser: 'Firefox 121.0',
      status: 'Thành công',
      statusColor: 'bg-green-100 text-green-700',
      details: 'Đăng xuất khỏi hệ thống'
    },
  ];

  // Mock data cho lịch sử hoạt động
  const activityLogs: LogEntry[] = [
    {
      id: 1,
      user: 'admin',
      userName: 'Nguyễn Văn A',
      action: 'Thêm dịch vụ mới',
      module: 'Thiết lập dịch vụ',
      timestamp: '2023-12-19 08:45:30',
      ip: '192.168.1.100',
      device: 'Windows 10',
      browser: 'Chrome 120.0',
      status: 'Thành công',
      statusColor: 'bg-green-100 text-green-700',
      details: 'Thêm dịch vụ CSDL A (Mã: SVC001)'
    },
    {
      id: 2,
      user: 'user1',
      userName: 'Trần Thị B',
      action: 'Cập nhật dịch vụ',
      module: 'Thiết lập dịch vụ',
      timestamp: '2023-12-19 09:30:15',
      ip: '192.168.1.101',
      device: 'MacOS 14',
      browser: 'Safari 17.0',
      status: 'Thành công',
      statusColor: 'bg-green-100 text-green-700',
      details: 'Cập nhật thông tin dịch vụ CSDL B (Mã: SVC002)'
    },
    {
      id: 3,
      user: 'user2',
      userName: 'Lê Văn C',
      action: 'Xóa dịch vụ',
      module: 'Thiết lập dịch vụ',
      timestamp: '2023-12-19 10:15:45',
      ip: '192.168.1.102',
      device: 'Ubuntu 22.04',
      browser: 'Firefox 121.0',
      status: 'Thất bại',
      statusColor: 'bg-red-100 text-red-700',
      details: 'Không có quyền xóa dịch vụ SVC003'
    },
    {
      id: 4,
      user: 'admin',
      userName: 'Nguyễn Văn A',
      action: 'Kết xuất báo cáo',
      module: 'Dashboard',
      timestamp: '2023-12-19 11:20:10',
      ip: '192.168.1.100',
      device: 'Windows 10',
      browser: 'Chrome 120.0',
      status: 'Thành công',
      statusColor: 'bg-green-100 text-green-700',
      details: 'Kết xuất biểu đồ "Phương thức thu thập"'
    },
    {
      id: 5,
      user: 'user1',
      userName: 'Trần Thị B',
      action: 'Cài đặt dịch vụ',
      module: 'Thiết lập dịch vụ',
      timestamp: '2023-12-19 14:30:25',
      ip: '192.168.1.101',
      device: 'MacOS 14',
      browser: 'Safari 17.0',
      status: 'Thành công',
      statusColor: 'bg-green-100 text-green-700',
      details: 'Cấu hình thời gian thu thập cho dịch vụ CSDL A'
    },
    {
      id: 6,
      user: 'admin',
      userName: 'Nguyễn Văn A',
      action: 'Kiểm tra kết nối dịch vụ',
      module: 'Thiết lập dịch vụ',
      timestamp: '2024-04-12 14:00:15',
      ip: '192.168.1.100',
      device: 'Windows 10',
      browser: 'Chrome 120.0',
      status: 'Thất bại',
      statusColor: 'bg-red-100 text-red-700',
      details: 'Lỗi kết nối dịch vụ - Quá thời gian quy định (Timeout) khi reach tới endpoint https://ndxp.gov.vn/api/v1/data (vượt 3000ms).'
    },
    {
      id: 7,
      user: 'admin',
      userName: 'Nguyễn Văn A',
      action: 'Kiểm tra kết nối dịch vụ',
      module: 'Thiết lập dịch vụ',
      timestamp: '2024-04-12 14:05:30',
      ip: '192.168.1.100',
      device: 'Windows 10',
      browser: 'Chrome 120.0',
      status: 'Thất bại',
      statusColor: 'bg-red-100 text-red-700',
      details: 'Lỗi dữ liệu/Cấu trúc gói tin - Phản hồi HTTP 200 nhưng payload rỗng hoặc sai cấu trúc cần thiết.'
    },
  ];

  const allLogs = [
    ...activityLogs,
    ...accessLogs.map(l => ({...l, id: l.id + 1000}))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  useEffect(() => {
    if (initialOpenLogId) {
      const logToOpen = allLogs.find(l => l.id === initialOpenLogId);
      if (logToOpen) {
        setSelectedLog(logToOpen);
        setShowLogDetailModal(true);
      }
    }
  }, [initialOpenLogId]);

  const filteredLogs = allLogs.filter(log => {
    const q = normalizeSearch(applied.text);
    const matchSearch = q === '' || [log.user, log.userName, log.action].some(v => normalizeSearch(v).includes(q));
    const matchUser = applied.user === 'all' || log.user === applied.user;
    const matchAction = applied.action === 'all' || log.action === applied.action;
    // Lọc theo khoảng ngày: thỏa cả Từ ngày và Đến ngày (Đến ngày tính hết ngày)
    const logDate = log.timestamp.slice(0, 10);
    const matchDate = (!applied.from || logDate >= applied.from) && (!applied.to || logDate <= applied.to);
    return matchSearch && matchUser && matchAction && matchDate;
  });

  const handleExportLogs = () => {
    toast.info('Đang kết xuất nhật ký ra file Excel...');
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const closeDetail = () => {
    setShowLogDetailModal(false);
    setShowExtraInfo(false);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <div className="space-y-4 animate-in fade-in duration-500">
      {/* Thanh công cụ: tìm kiếm + bộ lọc */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-1.5">
            <div className="relative flex-1">
              <input aria-label="Tìm kiếm nhật ký"
                type="text"
                placeholder="Tìm kiếm theo tên đăng nhập, họ và tên, hành động"
                className={SEARCH_INPUT_CLS}
                value={logSearchText}
                onChange={(e) => setLogSearchText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
              />
            </div>
            <button
              type="button"
              aria-label="Tìm kiếm"
              title="Tìm kiếm"
              onClick={runSearch}
              className={SEARCH_BTN_CLS}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Bộ lọc nâng cao"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              className={filterBtnClass(showFilters)}
              title="Bộ lọc nâng cao"
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Bộ lọc nâng cao */}
        {showFilters && (
          <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
            <div>
              <label className={FILTER_LABEL}>Người dùng</label>
              <select aria-label="Người dùng"
                className={INPUT_CLS}
                value={logUserFilter}
                onChange={(e) => setLogUserFilter(e.target.value)}
              >
                <option value="all">Tất cả người dùng</option>
                <option value="admin">admin</option>
                <option value="user1">user1</option>
                <option value="user2">user2</option>
              </select>
            </div>

            <div>
              <label className={FILTER_LABEL}>Hành động</label>
              <select aria-label="Hành động"
                className={INPUT_CLS}
                value={logActionFilter}
                onChange={(e) => setLogActionFilter(e.target.value)}
              >
                <option value="all">Tất cả hành động</option>
                <option value="Đăng nhập">Đăng nhập</option>
                <option value="Đăng xuất">Đăng xuất</option>
                <option value="Thêm dịch vụ mới">Thêm dịch vụ mới</option>
                <option value="Cập nhật dịch vụ">Cập nhật dịch vụ</option>
                <option value="Xóa dịch vụ">Xóa dịch vụ</option>
                <option value="Kết xuất báo cáo">Kết xuất báo cáo</option>
                <option value="Cài đặt dịch vụ">Cài đặt dịch vụ</option>
                <option value="Kiểm tra kết nối dịch vụ">Kiểm tra kết nối dịch vụ</option>
              </select>
            </div>

            <div>
              <label className={FILTER_LABEL}>Từ ngày</label>
              <DateInput ariaLabel="Từ ngày" value={logDateFrom} onChange={setLogDateFrom} />
            </div>

            <div>
              <label className={FILTER_LABEL}>Đến ngày</label>
              <DateInput ariaLabel="Đến ngày" value={logDateTo} onChange={setLogDateTo} />
            </div>
          </div>
        )}
      </div>

      {/* Bảng nhật ký */}
      <div className={TABLE_WRAP_CLS}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse collection-table text-[13px]">
              <thead className={`${TABLE_HEAD_BG} sticky top-0 z-10`}>
                <tr className={TABLE_HEAD_ROW_CLS}>
                  <th className="px-3 py-[13px] leading-4 text-center font-bold text-black whitespace-nowrap w-12">STT</th>
                  <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap">Người dùng</th>
                  <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap">Hành động</th>
                  <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap">Thời gian</th>
                  <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap">Trạng thái</th>
                  <th className="px-3 py-[13px] leading-4 text-center font-bold text-black whitespace-nowrap w-20">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log, index) => {
                  const [d, t] = formatDateTime(log.timestamp);
                  return (
                  <tr key={log.id} className="h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-3 py-1 text-center text-black whitespace-nowrap">{((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, '0')}</td>
                    <td className="px-3 py-1 text-left text-black max-w-[260px] leading-[18px]">
                      <TruncatedText text={log.user} />
                      <TruncatedText text={log.userName} className="text-[#64748B]" />
                    </td>
                    <td className="px-3 py-1 text-left text-black max-w-[360px] leading-[18px]">
                      <TruncatedText text={log.action} />
                      <TruncatedText text={log.module} className="text-[#64748B]" />
                    </td>
                    <td className="px-3 py-1 text-left text-black whitespace-nowrap leading-[18px]">
                      <div>{d}</div>
                      {t && <div>{t}</div>}
                    </td>
                    <td className="px-3 py-1 text-left">
                      <Badge label={log.status} variant={logStatusVariant(log.status)} />
                    </td>
                    <td className="px-3 py-1 text-center">
                      <RowIconAction
                        label="Xem chi tiết"
                        onClick={() => {
                          setSelectedLog(log);
                          setShowExtraInfo(false);
                          setShowLogDetailModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </RowIconAction>
                    </td>
                  </tr>
                  );
                })}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-[#94A3B8]">
                        <Search className="w-12 h-12 mb-3" />
                        <p className="text-[13px] font-medium text-[#64748B]">Không tìm thấy kết quả phù hợp</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang (mục 5.14) */}
          <Pagination
            className="border-t border-[#E2E8F0]"
            currentPage={currentPage}
            totalItems={filteredLogs.length}
            pageSize={itemsPerPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={setItemsPerPage}
          />
        </div>

        {/* Modal Chi tiết nhật ký */}
      {showLogDetailModal && selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={closeDetail}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-white shrink-0">
              <h2 className="text-[16px] font-semibold text-[#020817]">Chi tiết nhật ký</h2>
              <button onClick={closeDetail} aria-label="Đóng" title="Đóng" className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body: nhãn – giá trị (mục 5.17) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>ID nhật ký</div>
                  <div className={FIELD_VALUE}>#{selectedLog.id}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Trạng thái</div>
                  <div><Badge label={selectedLog.status} variant={logStatusVariant(selectedLog.status)} /></div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Tên đăng nhập</div>
                  <div className={FIELD_VALUE}>{selectedLog.user || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Họ và tên</div>
                  <div className={FIELD_VALUE}>{selectedLog.userName || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Hành động</div>
                  <div className={FIELD_VALUE}>{selectedLog.action || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Module</div>
                  <div className={FIELD_VALUE}>{selectedLog.module || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Thời gian</div>
                  <div className={FIELD_VALUE}>{formatDateTime(selectedLog.timestamp).filter(Boolean).join(' ')}</div>
                </div>
                <div className="space-y-1 col-span-2">
                  <div className={FIELD_LABEL}>Chi tiết</div>
                  <div className={`${FIELD_VALUE} whitespace-pre-line break-words`}>{selectedLog.details || '-'}</div>
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-4">
                <button
                  type="button"
                  onClick={() => setShowExtraInfo(!showExtraInfo)}
                  className={`text-[13px] font-medium text-blue-600 hover:underline inline-flex items-center gap-1.5 rounded ${BTN_FOCUS}`}
                >
                  <Monitor className="w-4 h-4" />
                  {showExtraInfo ? 'Ẩn thông tin khác' : 'Xem thông tin khác'}
                </button>

                {showExtraInfo && (
                  <div className="mt-4 grid grid-cols-3 gap-x-6 gap-y-4 animate-in slide-in-from-top-2">
                    <div className="space-y-1">
                      <div className={FIELD_LABEL}>Địa chỉ IP</div>
                      <div className={FIELD_VALUE}>{selectedLog.ip || '-'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className={FIELD_LABEL}>Thiết bị</div>
                      <div className={FIELD_VALUE}>{selectedLog.device || '-'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className={FIELD_LABEL}>Trình duyệt</div>
                      <div className={FIELD_VALUE}>{selectedLog.browser || '-'}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] shrink-0">
              <button onClick={closeDetail} className={BTN_OUTLINE}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}