import { useState } from 'react';
import {
  ScrollText,
  Search,
  Download,
  Filter,
  Eye,
  X,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Badge, TruncatedText, RowIconAction, Pagination, DateInput,
  BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS, FIELD_LABEL, FIELD_VALUE,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL,
  TABLE_WRAP_CLS, TABLE_HEAD_BG, TABLE_HEAD_ROW_CLS, normalizeSearch,
} from '../collection/collectionUi';

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

const accessLogs: AccessLog[] = [
  { 
    id: 1, 
    sessionId: 'sess_1234567890abc',
    timestamp: '09/12/2025 14:25:33', 
    user: 'Nguyễn Văn An', 
    userId: 'user_001',
    ip: '192.168.1.100', 
    action: 'Đăng nhập hệ thống', 
    module: 'Authentication', 
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
    action: 'Đăng nhập hệ thống', 
    module: 'Authentication', 
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
    action: 'Đăng nhập thất bại', 
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
    action: 'Đăng nhập hệ thống', 
    module: 'Authentication', 
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
    action: 'Đăng nhập hệ thống', 
    module: 'Authentication', 
    status: 'success', 
    duration: '5.2s', 
    userAgent: 'Safari/17.2',
    device: 'MacOS 14',
    browser: 'Safari 17.2',
    location: 'Đà Nẵng, Việt Nam'
  },
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


// Bảng dữ liệu (compomennt.md 5.3): tiêu đề 42px chữ 13px/700 đen, ô 13px/400 đen, hàng 48px kẻ #E0E0E0
const TH = 'h-[42px] px-3 py-[13px] text-[13px] font-bold text-black whitespace-nowrap';
const TD = 'px-3 py-1 text-[13px] text-black';
const MODAL_TITLE = 'text-[16px] font-medium text-[#020817]';
const MODAL_FOOTER = 'shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-4';
const SUB_TEXT = 'text-[12px] text-[#64748B]';

// Thẻ thống kê nhỏ (mục 5.6.1)
const STAT_TONES = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
} as const;

const StatCard = ({ icon: Icon, tone, title, value }: { icon: typeof ScrollText; tone: keyof typeof STAT_TONES; title: string; value: string }) => (
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

// 'dd/mm/yyyy HH:mm:ss' → ngày và giờ để hiển thị 2 dòng trong bảng (mục 5.3.3)
const splitTimestamp = (value: string) => {
  const [date, time] = (value || '').split(' ');
  return { date: date || '-', time: time || '' };
};

export function LoginLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // Điều kiện đã áp dụng — chỉ cập nhật khi bấm Tìm kiếm / Enter (mục 5.19)
  const [applied, setApplied] = useState({ searchTerm: '', filterStatus: 'all', startDate: '', endDate: '' });
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null);
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

  const runSearch = () => {
    setApplied({ searchTerm, filterStatus, startDate, endDate });
    setCurrentPage(1);
  };

  const appliedTerm = normalizeSearch(applied.searchTerm);
  const filteredLogs = accessLogs.filter(log => {
    const matchesSearch = normalizeSearch(log.user).includes(appliedTerm) ||
                         normalizeSearch(log.action).includes(appliedTerm) ||
                         normalizeSearch(log.module).includes(appliedTerm) ||
                         normalizeSearch(log.ip).includes(appliedTerm);

    const matchesStatus = applied.filterStatus === 'all' || log.status === applied.filterStatus;

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

    return matchesSearch && matchesStatus && matchesDate;
  });

  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleViewDetail = (log: AccessLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedLog(null);
  };

  const handleExport = () => {
    toast.info('Đang kết xuất nhật ký đăng nhập ra file Excel...');
  };

  const sessionActions = selectedLog ? getSessionActions(selectedLog.sessionId) : [];

  return (
    <div className="space-y-4">
      {/* Tiêu đề trang (H1 20px/700 #2A0F0F) */}
      <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Nhật ký đăng nhập</h1>

      {/* Thẻ thống kê nhỏ (mục 5.6.1) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={ScrollText} tone="blue" title="Tổng truy cập (24h)" value="12,847" />
        <StatCard icon={ScrollText} tone="green" title="Thành công" value="12,654" />
        <StatCard icon={ScrollText} tone="red" title="Thất bại" value="193" />
        <StatCard icon={ScrollText} tone="purple" title="Người dùng hoạt động" value="847" />
      </div>

      {/* Tìm kiếm & bộ lọc (mục 5.19) — chỉ áp dụng khi bấm Tìm kiếm / Enter */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-1.5">
            <input
              type="text"
              aria-label="Tìm kiếm nhật ký đăng nhập"
              placeholder="Tìm kiếm theo người dùng, hành động, phân hệ, IP"
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
            <button type="button" onClick={handleExport} className={BTN_OUTLINE}>
              <Download className="w-4 h-4" />
              Kết xuất
            </button>
          </div>
        </div>

        {showFilters && (
          <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
            <div>
              <label className={FILTER_LABEL}>Trạng thái</label>
              <select
                aria-label="Lọc theo trạng thái"
                className={INPUT_CLS}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="success">Thành công</option>
                <option value="failed">Thất bại</option>
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

      {/* Bảng nhật ký (mục 5.3) */}
      <div className={TABLE_WRAP_CLS}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className={`${TABLE_HEAD_BG} sticky top-0 z-10`}>
              <tr className={TABLE_HEAD_ROW_CLS}>
                <th className={`${TH} text-center w-14`}>STT</th>
                <th className={`${TH} text-left`}>Thời gian</th>
                <th className={`${TH} text-left`}>Người dùng</th>
                <th className={`${TH} text-left`}>IP</th>
                <th className={`${TH} text-left`}>Hành động</th>
                <th className={`${TH} text-left`}>Thiết bị</th>
                <th className={`${TH} text-left`}>Trạng thái</th>
                <th className={`${TH} text-center w-20 sticky right-0 ${TABLE_HEAD_BG}`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log, index) => {
                const ts = splitTimestamp(log.timestamp);
                return (
                  <tr key={log.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                    <td className={`${TD} text-center tabular-nums`}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap leading-tight tabular-nums`}>
                      <div>{ts.date}</div>
                      {ts.time && <div>{ts.time}</div>}
                    </td>
                    <td className={`${TD} text-left max-w-[240px] leading-[18px]`}>
                      <TruncatedText text={log.user} />
                      <TruncatedText text={log.userId} className={SUB_TEXT} />
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap tabular-nums`}>{log.ip}</td>
                    <td className={`${TD} text-left max-w-[280px]`}>
                      <TruncatedText text={log.action} />
                    </td>
                    <td className={`${TD} text-left max-w-[240px]`}>
                      <TruncatedText text={`${log.device} · ${log.browser}`} />
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap`}>
                      <Badge
                        label={log.status === 'success' ? 'Thành công' : 'Thất bại'}
                        variant={log.status === 'success' ? 'green' : 'red'}
                      />
                    </td>
                    <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors`}>
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
                  <td colSpan={8} className="px-3 py-10 text-center">
                    <ScrollText className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                    <p className="text-[13px] font-medium text-[#64748B]">Không tìm thấy bản ghi nào phù hợp</p>
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

      {/* Modal Xem chi tiết — chiều cao cố định, thân tự cuộn (mục 5.4) */}
      {showDetailModal && selectedLog && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
          onClick={closeDetailModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-session-title"
            className="bg-white rounded-2xl shadow-2xl w-[1024px] max-w-full h-[90vh] max-h-[800px] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 id="login-session-title" className={MODAL_TITLE}>Chi tiết phiên đăng nhập</h3>
                <p className={`${SUB_TEXT} mt-0.5`}>
                  Session ID: <span className="tabular-nums">{selectedLog.sessionId}</span>
                </p>
              </div>
              <button type="button" onClick={closeDetailModal} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thông tin phiên (mục 5.17) */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4">
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Người dùng</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedLog.user || '-'}</div>
                    <div className={SUB_TEXT}>{selectedLog.userId}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Thời gian đăng nhập</div>
                    <div className={`${FIELD_VALUE} tabular-nums`}>{selectedLog.timestamp || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Thiết bị</div>
                    <div className={FIELD_VALUE}>{selectedLog.device || '-'}</div>
                    <div className={SUB_TEXT}>{selectedLog.browser}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Vị trí</div>
                    <div className={FIELD_VALUE}>{selectedLog.location || '-'}</div>
                    <div className={`${SUB_TEXT} tabular-nums`}>{selectedLog.ip}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={MODAL_FOOTER}>
              <div className="flex items-center gap-2 text-[13px] text-[#020817]">
                <Activity className="w-4 h-4 text-[#475569]" />
                <span>
                  Tổng thời gian hoạt động:{' '}
                  <span className="font-medium">
                    {sessionActions.length > 0 ? '8 phút 42 giây' : '0 giây'}
                  </span>
                </span>
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
