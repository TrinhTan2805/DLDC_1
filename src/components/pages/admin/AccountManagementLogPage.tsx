import { useState } from 'react';
import { toast } from 'sonner';
import {
  UserCog,
  Search,
  Download,
  Filter,
  Eye,
  X,
  UserX,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';
import {
  Badge, TruncatedText, RowIconAction, Pagination, DateInput,
  BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS,
  FIELD_LABEL, FIELD_VALUE, SECTION_TITLE,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL,
  TABLE_WRAP_CLS, TABLE_HEAD_BG, TABLE_HEAD_ROW_CLS, normalizeSearch,
} from '../collection/collectionUi';

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

// Bảng dữ liệu (compomennt.md 5.3): tiêu đề 42px chữ 13px/700 đen, ô 13px/400 đen, hàng 48px kẻ #E0E0E0
const TH = 'h-[42px] px-3 py-[13px] text-[13px] font-bold text-black whitespace-nowrap';
const TD = 'px-3 py-1 text-[13px] text-black';
const MODAL_TITLE = 'text-[16px] font-medium text-[#020817]';
const MODAL_FOOTER = 'shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3';

// Thẻ thống kê nhỏ (mục 5.6.1)
const STAT_TONES = {
  blue: 'bg-blue-50 text-blue-600',
  red: 'bg-red-50 text-red-600',
  green: 'bg-green-50 text-green-600',
} as const;

const StatCard = ({ icon: Icon, tone, title, value }: { icon: typeof UserCog; tone: keyof typeof STAT_TONES; title: string; value: string }) => (
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

export function AccountManagementLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // Điều kiện đang áp dụng — chỉ cập nhật khi bấm Tìm kiếm / Enter (compomennt.md 5.19)
  const [applied, setApplied] = useState({ searchTerm: '', filterAction: 'all', filterStatus: 'all', startDate: '', endDate: '' });
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

  const runSearch = () => {
    setApplied({ searchTerm, filterAction, filterStatus, startDate, endDate });
    setCurrentPage(1);
  };

  const appliedTerm = normalizeSearch(applied.searchTerm);
  const filteredLogs = accountLogs.filter(log => {
    const matchesSearch = normalizeSearch(log.targetUser).includes(appliedTerm) ||
                         normalizeSearch(log.targetUserId).includes(appliedTerm) ||
                         normalizeSearch(log.performedBy).includes(appliedTerm) ||
                         normalizeSearch(log.details).includes(appliedTerm);
    const matchesAction = applied.filterAction === 'all' || log.action === applied.filterAction;
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
    toast.info('Đang kết xuất nhật ký quản lý tài khoản ra file Excel...');
  };
  const getActionLabel = (action: AccountLog['action']) => {
    switch (action) {
      case 'sync':
        return 'Đồng bộ';
      case 'deactivate':
        return 'Ngừng hoạt động tài khoản';
    }
  };

  const statusBadge = (status: AccountLog['status']) => (
    <Badge
      label={status === 'success' ? 'Thành công' : 'Thất bại'}
      variant={status === 'success' ? 'green' : 'red'}
      icon={status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
    />
  );

  const pagedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Tiêu đề trang (H1 20px/700 #2A0F0F) */}
      <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Nhật ký quản lý tài khoản</h1>

      {/* Thẻ thống kê nhỏ (compomennt.md 5.6.1) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={RefreshCw} tone="blue" title="Đồng bộ thành công" value={accountLogs.filter(l => l.action === 'sync' && l.status === 'success').length.toString()} />
        <StatCard icon={UserX} tone="red" title="Ngừng hoạt động" value={accountLogs.filter(l => l.action === 'deactivate' && l.status === 'success').length.toString()} />
        <StatCard icon={UserCog} tone="green" title="Tổng số thao tác" value={accountLogs.length.toString()} />
        <StatCard icon={XCircle} tone="red" title="Thao tác thất bại" value={accountLogs.filter(l => l.status === 'failed').length.toString()} />
      </div>

      {/* Tìm kiếm & bộ lọc (5.19) — chỉ áp dụng khi bấm Tìm kiếm / Enter */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-1.5">
            <input
              type="text"
              aria-label="Tìm kiếm nhật ký quản lý tài khoản"
              placeholder="Tìm kiếm theo tài khoản, người thực hiện..."
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
              <label className={FILTER_LABEL}>Tác vụ</label>
              <select
                aria-label="Lọc theo tác vụ"
                className={INPUT_CLS}
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
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

      {/* Bảng nhật ký quản lý tài khoản (5.3) */}
      <div className={TABLE_WRAP_CLS}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className={`${TABLE_HEAD_BG} sticky top-0 z-10`}>
              <tr className={TABLE_HEAD_ROW_CLS}>
                <th className={`${TH} text-center w-14`}>STT</th>
                <th className={`${TH} text-left`}>Người thực hiện</th>
                <th className={`${TH} text-left`}>Thời gian</th>
                <th className={`${TH} text-left`}>Tác vụ</th>
                <th className={`${TH} text-left`}>Tài khoản</th>
                <th className={`${TH} text-left`}>Chi tiết</th>
                <th className={`${TH} text-left`}>IP người thực hiện</th>
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
                    <td className={`${TD} text-left max-w-[240px] leading-[18px]`}>
                      <TruncatedText text={log.performedBy} />
                      <TruncatedText text={log.performedById} className="text-[12px] text-[#64748B]" />
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap leading-[18px] tabular-nums`}>
                      <div>{ts.date}</div>
                      {ts.time && <div>{ts.time}</div>}
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap`}>
                      {getActionLabel(log.action)}
                    </td>
                    <td className={`${TD} text-left max-w-[240px] leading-[18px]`}>
                      <TruncatedText text={log.targetUser} />
                      <TruncatedText text={log.targetUserId} className="text-[12px] text-[#64748B]" />
                    </td>
                    <td className={`${TD} text-left max-w-[360px]`}>
                      <TruncatedText text={log.details} />
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap font-mono tabular-nums`}>
                      {log.ip}
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap`}>
                      {statusBadge(log.status)}
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

      {/* Chi tiết nhật ký — chiều cao cố định, thân tự cuộn (5.4) */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={closeDetailModal}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-log-detail-title"
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] max-h-[800px] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 id="account-log-detail-title" className={MODAL_TITLE}>Chi tiết nhật ký quản lý tài khoản</h3>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  Tác vụ: <span className="text-[#020817]">{getActionLabel(selectedLog.action)}</span>
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
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Thời gian</div>
                    <div className={`${FIELD_VALUE} tabular-nums`}>{selectedLog.timestamp}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Trạng thái</div>
                    {statusBadge(selectedLog.status)}
                  </div>
                </div>
              </div>

              {/* Target User */}
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <h4 className={SECTION_TITLE}>
                  <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                  Tài khoản đích
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Họ tên</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedLog.targetUser}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Username</div>
                    <div className={`${FIELD_VALUE} font-mono break-all`}>{selectedLog.targetUserId}</div>
                  </div>
                </div>
              </div>

              {/* Performed By */}
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <h4 className={SECTION_TITLE}>
                  <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                  Người thực hiện
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Họ tên</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedLog.performedBy}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Username</div>
                    <div className={`${FIELD_VALUE} font-mono break-all`}>{selectedLog.performedById}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>IP Address</div>
                    <div className={`${FIELD_VALUE} font-mono tabular-nums`}>{selectedLog.ip}</div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <h4 className={SECTION_TITLE}>
                  <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                  Chi tiết thay đổi
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="md:col-span-2">
                    <div className={`${FIELD_VALUE} whitespace-pre-line break-words`}>{selectedLog.details}</div>
                  </div>

                  {selectedLog.reason && (
                    <div className="space-y-1 md:col-span-2">
                      <div className={FIELD_LABEL}>Lý do</div>
                      <div className={`${FIELD_VALUE} break-words`}>{selectedLog.reason}</div>
                    </div>
                  )}

                  {selectedLog.oldValue && (
                    <div className="space-y-1">
                      <div className={FIELD_LABEL}>Giá trị cũ</div>
                      <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg px-3 py-2 text-[13px] text-[#B91C1C] font-mono whitespace-pre-wrap break-all">
                        {selectedLog.oldValue}
                      </div>
                    </div>
                  )}
                  {selectedLog.newValue && (
                    <div className="space-y-1">
                      <div className={FIELD_LABEL}>Giá trị mới</div>
                      <div className="bg-[#ECFDF5] border border-[#D1FAE5] rounded-lg px-3 py-2 text-[13px] text-[#047857] font-mono whitespace-pre-wrap break-all">
                        {selectedLog.newValue}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={MODAL_FOOTER}>
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
