import { useState } from 'react';
import { toast } from 'sonner';
import { Settings, Search, Filter, Eye, X, Clock, CheckCircle2, XCircle, Shield, Database, FileText } from "lucide-react";
import { LogRetentionConfigPage } from './LogRetentionConfigPage';
import {
  Badge, TruncatedText, RowIconAction, Pagination, DateInput,
  BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS,
  FIELD_LABEL, FIELD_VALUE, SECTION_TITLE,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL,
  TABLE_WRAP_CLS, TABLE_HEAD_BG, TABLE_HEAD_ROW_CLS, tabClass, normalizeSearch,
} from '../collection/collectionUi';

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
    configCategoryName: 'Cấu hình chế độ bảo trì hệ thống',
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

// Bảng dữ liệu (compomennt.md 5.3): tiêu đề 42px chữ 13px/700 đen, ô 13px/400 đen, hàng 48px kẻ #E0E0E0
const TH = 'h-[42px] px-3 py-[13px] text-[13px] font-bold text-black whitespace-nowrap';
const TD = 'px-3 py-1 text-[13px] text-black';
const MODAL_TITLE = 'text-[16px] font-semibold text-[#020817]';
const MODAL_FOOTER = 'shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3';

// Thẻ thống kê nhỏ (mục 5.6.1)
const STAT_TONES = {
  blue: 'bg-blue-50 text-blue-600',
  red: 'bg-red-50 text-red-600',
  green: 'bg-green-50 text-green-600',
} as const;

const StatCard = ({ icon: Icon, tone, title, value }: { icon: typeof Settings; tone: keyof typeof STAT_TONES; title: string; value: string }) => (
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

export function ConfigChangeLogPage() {
  const [activeTab, setActiveTab] = useState<'logs' | 'retention'>('logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // Điều kiện đang áp dụng — chỉ cập nhật khi bấm Tìm kiếm / Enter (compomennt.md 5.19)
  const [applied, setApplied] = useState({ searchTerm: '', filterType: 'all', filterStatus: 'all', startDate: '', endDate: '' });
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

  const runSearch = () => {
    setApplied({ searchTerm, filterType, filterStatus, startDate, endDate });
    setCurrentPage(1);
  };

  const appliedTerm = normalizeSearch(applied.searchTerm);
  const filteredLogs = configLogs.filter(log => {
    const matchesSearch = normalizeSearch(log.configCategoryName).includes(appliedTerm) ||
                         normalizeSearch(log.performedBy).includes(appliedTerm) ||
                         normalizeSearch(log.description).includes(appliedTerm);
    const matchesType = applied.filterType === 'all' || log.configCategory === applied.filterType;
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

  // Chưa có nút Kết xuất trên màn hình này (giữ nguyên như bản cũ)
  const handleExportExcel = () => {
    toast.info('Đang kết xuất nhật ký thay đổi cấu hình ra file Excel...');
  };

  const statusBadge = (status: ConfigLog['status']) => (
    <Badge
      label={status === 'success' ? 'Thành công' : 'Thất bại'}
      variant={status === 'success' ? 'green' : 'red'}
      icon={status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
    />
  );

  // Loại cấu hình hiển thị dạng chữ thường (PM yêu cầu 07/10/2026 — không dùng badge)
  const categoryBadge = (log: ConfigLog) => log.configCategoryName;

  const pagedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Tiêu đề trang (H1 20px/700 #2A0F0F) */}
      <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Nhật ký thay đổi cấu hình</h1>

      {/* Tab nội dung (5.9) */}
      <div className="border-b border-[#E2E8F0] flex" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'logs'}
          onClick={() => setActiveTab('logs')}
          className={tabClass(activeTab === 'logs')}
        >
          <FileText className="w-4 h-4" />
          Nhật ký thay đổi cấu hình
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'retention'}
          onClick={() => setActiveTab('retention')}
          className={tabClass(activeTab === 'retention')}
        >
          <Clock className="w-4 h-4" />
          Quản lý thời gian lưu trữ nhật ký
        </button>
      </div>
      {activeTab === 'logs' ? (
        <>
          {/* Thẻ thống kê nhỏ (compomennt.md 5.6.1) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard icon={Settings} tone="blue" title="Tổng thay đổi (30 ngày)" value={configLogs.length.toString()} />
            <StatCard icon={Shield} tone="red" title="Cấu hình đăng nhập sai" value={configLogs.filter(l => l.configCategory === 'login_limit').length.toString()} />
            <StatCard icon={Database} tone="green" title="Cấu hình sao lưu" value={configLogs.filter(l => l.configCategory === 'backup').length.toString()} />
            <StatCard icon={XCircle} tone="red" title="Thay đổi thất bại" value={configLogs.filter(l => l.status === 'failed').length.toString()} />
          </div>

          {/* Tìm kiếm & bộ lọc (5.19) — chỉ áp dụng khi bấm Tìm kiếm / Enter */}
          <div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                aria-label="Tìm kiếm nhật ký thay đổi cấu hình"
                placeholder="Tìm kiếm theo loại cấu hình, người thực hiện..."
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

            {/* Vùng bộ lọc */}
            {showFilters && (
              <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
                <div>
                  <label className={FILTER_LABEL}>Loại cấu hình</label>
                  <select
                    aria-label="Lọc theo loại cấu hình"
                    className={INPUT_CLS}
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">Tất cả loại cấu hình</option>
                    <option value="upload_limit">Cấu hình giới hạn dung lượng tải lên</option>
                    <option value="display">Cấu hình hiển thị danh sách</option>
                    <option value="maintenance">Cấu hình chế độ bảo trì hệ thống</option>
                    <option value="login_limit">Cấu hình giới hạn đăng nhập sai</option>
                    <option value="session">Cấu hình phiên làm việc</option>
                    <option value="backup">Cấu hình sao lưu dự phòng</option>
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

          {/* Bảng nhật ký thay đổi cấu hình (5.3) */}
          <div className={TABLE_WRAP_CLS}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className={`${TABLE_HEAD_BG} sticky top-0 z-10`}>
                  <tr className={TABLE_HEAD_ROW_CLS}>
                    <th className={`${TH} text-center w-14`}>STT</th>
                    <th className={`${TH} text-left`}>Người thực hiện</th>
                    <th className={`${TH} text-left`}>Thời gian</th>
                    <th className={`${TH} text-left`}>Loại cấu hình</th>
                    <th className={`${TH} text-left`}>Nội dung thay đổi</th>
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
                        <td className={`${TD} text-center tabular-nums whitespace-nowrap`}>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className={`${TD} text-left max-w-[240px] leading-[18px]`}>
                          <TruncatedText text={log.performedBy} />
                          <TruncatedText text={log.performedById} className="text-[12px] text-[#64748B]" />
                        </td>
                        <td className={`${TD} text-left whitespace-nowrap leading-[18px] tabular-nums`}>
                          <div>{ts.date}</div>
                          {ts.time && <div>{ts.time}</div>}
                        </td>
                        <td className={`${TD} text-left whitespace-nowrap`}>
                          {categoryBadge(log)}
                        </td>
                        <td className={`${TD} text-left max-w-[360px]`}>
                          <TruncatedText text={log.description} />
                        </td>
                        <td className={`${TD} text-left whitespace-nowrap font-mono tabular-nums`}>{log.ip}</td>
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
                      <td colSpan={8} className="py-16 text-center text-[13px] text-[#64748B]">
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

          {/* Chi tiết thay đổi cấu hình — chiều cao cố định, thân tự cuộn (5.4) */}
          {showDetailModal && selectedLog && (
            <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={closeDetailModal}>
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="config-log-detail-title"
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] max-h-[800px] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 id="config-log-detail-title" className={MODAL_TITLE}>Chi tiết thay đổi cấu hình</h3>
                    <p className="text-[13px] text-[#64748B] mt-0.5 truncate">{selectedLog.configCategoryName}</p>
                  </div>
                  <button type="button" onClick={closeDetailModal} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
                  {/* Thông tin cấu hình */}
                  <div className="rounded-2xl border border-[#E2E8F0] p-4">
                    <h4 className={SECTION_TITLE}>
                      <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                      Thông tin cấu hình
                    </h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <div className="space-y-1">
                        <div className={FIELD_LABEL}>Thời gian thay đổi</div>
                        <div className={`${FIELD_VALUE} tabular-nums`}>{selectedLog.timestamp}</div>
                      </div>
                      <div className="space-y-1">
                        <div className={FIELD_LABEL}>Trạng thái</div>
                        {statusBadge(selectedLog.status)}
                      </div>
                      <div className="space-y-1 col-span-2">
                        <div className={FIELD_LABEL}>Loại cấu hình</div>
                        {categoryBadge(selectedLog)}
                      </div>
                    </div>
                  </div>

                  {/* Người thực hiện */}
                  <div className="rounded-2xl border border-[#E2E8F0] p-4">
                    <h4 className={SECTION_TITLE}>
                      <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                      Người thực hiện
                    </h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <div className="space-y-1">
                        <div className={FIELD_LABEL}>Họ tên</div>
                        <div className={`${FIELD_VALUE} break-words`}>{selectedLog.performedBy}</div>
                      </div>
                      <div className="space-y-1">
                        <div className={FIELD_LABEL}>IP Address</div>
                        <div className={`${FIELD_VALUE} font-mono tabular-nums`}>{selectedLog.ip}</div>
                      </div>
                    </div>
                  </div>

                  {/* Nội dung thay đổi */}
                  <div className="rounded-2xl border border-[#E2E8F0] p-4">
                    <h4 className={SECTION_TITLE}>
                      <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                      Nội dung thay đổi
                    </h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <div className="space-y-1 col-span-2">
                        <div className={FIELD_LABEL}>Mô tả</div>
                        <div className={`${FIELD_VALUE} whitespace-pre-line break-words`}>{selectedLog.description}</div>
                      </div>
                      {selectedLog.reason && (
                        <div className="space-y-1 col-span-2">
                          <div className={FIELD_LABEL}>Lý do thay đổi</div>
                          <div className={`${FIELD_VALUE} whitespace-pre-line break-words`}>{selectedLog.reason}</div>
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
        </>
      ) : (
        <LogRetentionConfigPage embedded />
      )}
    </div>
  );
}
