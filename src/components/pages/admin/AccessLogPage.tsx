import { useState } from 'react';
import {
  ScrollText,
  Search,
  Download,
  Filter,
  Eye,
  X,
  Clock,
  Activity,
  Edit2,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  LogIn,
  User,
  Monitor,
  MapPin,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Badge, TruncatedText, RowIconAction, Pagination, DateInput,
  BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL,
  tabClass, TABLE_WRAP_CLS, TABLE_HEAD_BG, TABLE_HEAD_ROW_CLS, normalizeSearch,
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

interface LoginLog {
  id: number;
  timestamp: string;
  username: string;
  fullName: string;
  ip: string;
  status: 'success' | 'failed';
  reason?: string;
  device: string;
  browser: string;
  location: string;
}

const accessLogs: AccessLog[] = [
  { 
    id: 1, 
    sessionId: 'sess_1234567890abc',
    timestamp: '09/12/2025 14:25:33', 
    user: 'Nguyễn Văn An', 
    userId: 'user_001',
    ip: '192.168.1.100', 
    action: 'Xem danh sách người dùng', 
    module: 'Quản trị hệ thống', 
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
    action: 'Cập nhật nguồn dữ liệu', 
    module: 'Thu thập dữ liệu', 
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
    action: 'Yêu cầu truy cập tài nguyên', 
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
    action: 'Xuất báo cáo thống kê', 
    module: 'Báo cáo', 
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
    action: 'Xóa danh mục dữ liệu', 
    module: 'Quản lý danh mục', 
    status: 'success', 
    duration: '5.2s', 
    userAgent: 'Safari/17.2',
    device: 'MacOS 14',
    browser: 'Safari 17.2',
    location: 'Đà Nẵng, Việt Nam'
  },
];

const loginLogs: LoginLog[] = [
  {
    id: 1,
    timestamp: '09/12/2025 14:25:33',
    username: 'an.nv',
    fullName: 'Nguyễn Văn An',
    ip: '192.168.1.100',
    status: 'success',
    device: 'Windows 11',
    browser: 'Chrome 120.0.0',
    location: 'Hà Nội, Việt Nam'
  },
  {
    id: 2,
    timestamp: '09/12/2025 14:24:12',
    username: 'binh.tt',
    fullName: 'Trần Thị Bình',
    ip: '192.168.1.101',
    status: 'success',
    device: 'Windows 10',
    browser: 'Firefox 121.0',
    location: 'Hà Nội, Việt Nam'
  },
  {
    id: 3,
    timestamp: '09/12/2025 14:22:45',
    username: 'cuong.lv',
    fullName: 'Lê Văn Cường',
    ip: '192.168.1.102',
    status: 'failed',
    reason: 'Sai mật khẩu',
    device: 'Windows 11',
    browser: 'Edge 120.0.0',
    location: 'Hà Nội, Việt Nam'
  },
  {
    id: 4,
    timestamp: '09/12/2025 14:20:18',
    username: 'dung.pt',
    fullName: 'Phạm Thị Dung',
    ip: '192.168.1.103',
    status: 'success',
    device: 'MacOS 14',
    browser: 'Chrome 120.0.0',
    location: 'Hồ Chí Minh, Việt Nam'
  },
  {
    id: 5,
    timestamp: '09/12/2025 14:18:55',
    username: 'em.hv',
    fullName: 'Hoàng Văn Em',
    ip: '192.168.1.104',
    status: 'success',
    device: 'MacOS 14',
    browser: 'Safari 17.2',
    location: 'Đà Nẵng, Việt Nam'
  },
  {
    id: 6,
    timestamp: '09/12/2025 11:15:22',
    username: 'an.nv',
    fullName: 'Nguyễn Văn An',
    ip: '192.168.1.100',
    status: 'failed',
    reason: 'Tài khoản bị khóa',
    device: 'Windows 11',
    browser: 'Chrome 120.0.0',
    location: 'Hà Nội, Việt Nam'
  },
  {
    id: 7,
    timestamp: '09/12/2025 10:05:40',
    username: 'giang.dh',
    fullName: 'Đỗ Hoàng Giang',
    ip: '172.16.0.45',
    status: 'success',
    device: 'Ubuntu Linux',
    browser: 'Chrome 119.0.0',
    location: 'Hà Nội, Việt Nam'
  },
  {
    id: 8,
    timestamp: '09/12/2025 09:30:15',
    username: 'hang.vt',
    fullName: 'Vũ Thị Hằng',
    ip: '192.168.2.50',
    status: 'success',
    device: 'Windows 11',
    browser: 'Edge 120.0.0',
    location: 'Hải Phòng, Việt Nam'
  },
  {
    id: 9,
    timestamp: '09/12/2025 08:45:10',
    username: 'binh.tt',
    fullName: 'Trần Thị Bình',
    ip: '192.168.1.101',
    status: 'failed',
    reason: 'Sai cấu hình OTP',
    device: 'Windows 10',
    browser: 'Firefox 121.0',
    location: 'Hà Nội, Việt Nam'
  }
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
const TR = 'group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const MODAL_TITLE = 'text-[16px] font-semibold text-[#020817]';
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

const TimestampCell = ({ value }: { value: string }) => {
  const ts = splitTimestamp(value);
  return (
    <td className={`${TD} text-left whitespace-nowrap leading-tight tabular-nums`}>
      <div>{ts.date}</div>
      {ts.time && <div>{ts.time}</div>}
    </td>
  );
};

const EmptyRow = ({ colSpan }: { colSpan: number }) => (
  <tr>
    <td colSpan={colSpan} className="px-3 py-10 text-center">
      <ScrollText className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
      <p className="text-[13px] font-medium text-[#64748B]">Không tìm thấy bản ghi nào phù hợp</p>
    </td>
  </tr>
);

// Loại thao tác → tông màu badge (mục 5.8)
const ACTION_VARIANT: Record<ActionDetail['type'], string> = {
  create: 'green',
  update: 'blue',
  delete: 'red',
  view: 'purple',
  export: 'orange',
};

export function AccessLogPage() {
  const [activeTab, setActiveTab] = useState<'access' | 'login'>('access');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  // Điều kiện đã áp dụng — chỉ cập nhật khi bấm Tìm kiếm / Enter (mục 5.19)
  const [applied, setApplied] = useState({ searchTerm: '', filterStatus: 'all', startDate: '', endDate: '' });

  // Login Log Filter States
  const [loginSearchTerm, setLoginSearchTerm] = useState('');
  const [loginFilterStatus, setLoginFilterStatus] = useState('all');
  const [loginStartDate, setLoginStartDate] = useState('');
  const [loginEndDate, setLoginEndDate] = useState('');
  const [showLoginFilters, setShowLoginFilters] = useState(false);
  const [loginApplied, setLoginApplied] = useState({ searchTerm: '', filterStatus: 'all', startDate: '', endDate: '' });

  // Modals
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null);
  // Lịch sử thao tác trong phiên: phân trang + xem chi tiết 1 thao tác
  const [actionPage, setActionPage] = useState(1);
  const [actionPageSize, setActionPageSize] = useState(10);
  const [selectedAction, setSelectedAction] = useState<ActionDetail | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [loginCurrentPage, setLoginCurrentPage] = useState(1);
  const [loginItemsPerPage, setLoginItemsPerPage] = useState(10);

  const runSearch = () => {
    setApplied({ searchTerm, filterStatus, startDate, endDate });
    setCurrentPage(1);
  };

  const runLoginSearch = () => {
    setLoginApplied({ searchTerm: loginSearchTerm, filterStatus: loginFilterStatus, startDate: loginStartDate, endDate: loginEndDate });
    setLoginCurrentPage(1);
  };

  // Filtering access logs
  const appliedTerm = normalizeSearch(applied.searchTerm);
  const filteredLogs = accessLogs.filter(log => {
    const matchesSearch = normalizeSearch(log.user).includes(appliedTerm) ||
                         normalizeSearch(log.action).includes(appliedTerm) ||
                         normalizeSearch(log.module).includes(appliedTerm) ||
                         normalizeSearch(log.userId).includes(appliedTerm);
    const matchesStatus = applied.filterStatus === 'all' || log.status === applied.filterStatus;
    const matchesStartDate = !applied.startDate || log.timestamp.split(' ')[0] >= applied.startDate.split('-').reverse().join('/');
    const matchesEndDate = !applied.endDate || log.timestamp.split(' ')[0] <= applied.endDate.split('-').reverse().join('/');
    return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
  });

  // Filtering login logs
  const loginTerm = normalizeSearch(loginApplied.searchTerm);
  const filteredLoginLogs = loginLogs.filter(log => {
    const matchesSearch = normalizeSearch(log.fullName).includes(loginTerm) ||
                         normalizeSearch(log.username).includes(loginTerm) ||
                         normalizeSearch(log.ip).includes(loginTerm) ||
                         (log.reason && normalizeSearch(log.reason).includes(loginTerm));
    const matchesStatus = loginApplied.filterStatus === 'all' || log.status === loginApplied.filterStatus;
    const matchesStartDate = !loginApplied.startDate || log.timestamp.split(' ')[0] >= loginApplied.startDate.split('-').reverse().join('/');
    const matchesEndDate = !loginApplied.endDate || log.timestamp.split(' ')[0] <= loginApplied.endDate.split('-').reverse().join('/');
    return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
  });

  const handleViewDetail = (log: AccessLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedLog(null);
    setSelectedAction(null);
    setActionPage(1);
  };

  const getActionIcon = (type: ActionDetail['type']) => {
    switch (type) {
      case 'create':
        return <Plus className="w-4 h-4" />;
      case 'update':
        return <Edit2 className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      case 'view':
        return <Eye className="w-4 h-4" />;
      case 'export':
        return <Download className="w-4 h-4" />;
    }
  };

  // Ô icon theo loại thao tác — dùng bộ màu badge mục 5.8
  const getActionColor = (type: ActionDetail['type']) => {
    switch (type) {
      case 'create':
        return 'text-[#15803D] bg-[#F0FDF4] border-[#DCFCE7]';
      case 'update':
        return 'text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]';
      case 'delete':
        return 'text-[#B91C1C] bg-[#FEF2F2] border-[#FEE2E2]';
      case 'view':
        return 'text-[#8200DB] bg-[#FAF5FF] border-[#E7E1EC]';
      case 'export':
        return 'text-[#C2410C] bg-[#FFF7ED] border-[#FED7AA]';
    }
  };

  const sessionActions = selectedLog ? getSessionActions(selectedLog.sessionId) : [];

  const handleExportAccessLog = () => {
    toast.success('Xuất file excel nhật ký truy cập thành công!', {
      description: `Đã xuất ${filteredLogs.length} dòng dữ liệu ra file Excel.`,
      duration: 3000
    });
  };

  const handleExportLoginLog = () => {
    toast.success('Xuất file excel nhật ký đăng nhập thành công!', {
      description: `Đã xuất ${filteredLoginLogs.length} dòng dữ liệu ra file Excel.`,
      duration: 3000
    });
  };

  // Thanh tìm kiếm + vùng bộ lọc dùng chung cho 2 tab (mục 5.19)
  const renderSearchBar = (opts: {
    ariaLabel: string;
    placeholder: string;
    term: string;
    setTerm: (v: string) => void;
    onSearch: () => void;
    open: boolean;
    setOpen: (v: boolean) => void;
    onExport: () => void;
    status: string;
    setStatus: (v: string) => void;
    from: string;
    setFrom: (v: string) => void;
    to: string;
    setTo: (v: string) => void;
  }) => (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-1.5">
          <input
            type="text"
            aria-label={opts.ariaLabel}
            placeholder={opts.placeholder}
            className={SEARCH_INPUT_CLS}
            value={opts.term}
            onChange={(e) => opts.setTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') opts.onSearch(); }}
          />
          <button type="button" title="Tìm kiếm" aria-label="Tìm kiếm" onClick={opts.onSearch} className={SEARCH_BTN_CLS}>
            <Search className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => opts.setOpen(!opts.open)}
            aria-expanded={opts.open}
            aria-label="Bộ lọc"
            title="Bộ lọc"
            className={filterBtnClass(opts.open)}
          >
            {opts.open ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button type="button" onClick={opts.onExport} className={BTN_OUTLINE} title="Kết xuất Excel">
            <Download className="w-4 h-4" />
            Kết xuất
          </button>
        </div>
      </div>

      {opts.open && (
        <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
          <div>
            <label className={FILTER_LABEL}>Trạng thái</label>
            <select
              aria-label="Lọc theo trạng thái"
              className={INPUT_CLS}
              value={opts.status}
              onChange={(e) => opts.setStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="success">Thành công</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>

          <div>
            <label className={FILTER_LABEL}>Thời gian từ</label>
            <DateInput value={opts.from} onChange={opts.setFrom} ariaLabel="Thời gian từ" max={opts.to || undefined} />
          </div>

          <div>
            <label className={FILTER_LABEL}>Thời gian đến</label>
            <DateInput value={opts.to} onChange={opts.setTo} ariaLabel="Thời gian đến" min={opts.from || undefined} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Tiêu đề trang (H1 20px/700 #2A0F0F) */}
      <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Nhật ký truy cập</h1>

      {/* Tab nội dung (mục 5.9) */}
      <div className="flex border-b border-[#E2E8F0]" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'access'}
          onClick={() => setActiveTab('access')}
          className={tabClass(activeTab === 'access')}
        >
          <ScrollText className="w-4 h-4" />
          Nhật ký truy cập
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'login'}
          onClick={() => setActiveTab('login')}
          className={tabClass(activeTab === 'login')}
        >
          <LogIn className="w-4 h-4" />
          Nhật ký đăng nhập
        </button>
      </div>

      {/* Thẻ thống kê nhỏ (mục 5.6.1) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={ScrollText} tone="blue" title="Tổng lượt truy cập (24h)" value="24,532" />
        <StatCard icon={CheckCircle2} tone="green" title="Tác vụ thành công" value="24,410" />
        <StatCard icon={AlertCircle} tone="red" title="Tác vụ thất bại" value="122" />
        <StatCard icon={Activity} tone="purple" title="Phân hệ đã truy cập" value="8" />
      </div>

      {activeTab === 'access' ? (
        <>
          {renderSearchBar({
            ariaLabel: 'Tìm kiếm nhật ký truy cập',
            placeholder: 'Tìm kiếm theo người dùng, mã người dùng, hành động, phân hệ',
            term: searchTerm,
            setTerm: setSearchTerm,
            onSearch: runSearch,
            open: showFilters,
            setOpen: setShowFilters,
            onExport: handleExportAccessLog,
            status: filterStatus,
            setStatus: setFilterStatus,
            from: startDate,
            setFrom: setStartDate,
            to: endDate,
            setTo: setEndDate,
          })}

          {/* Bảng nhật ký truy cập (mục 5.3) */}
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
                  {filteredLogs
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((log, index) => (
                      <tr key={log.id} className={TR}>
                        <td className={`${TD} text-center tabular-nums`}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <TimestampCell value={log.timestamp} />
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
                    ))}
                  {filteredLogs.length === 0 && <EmptyRow colSpan={8} />}
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
        </>
      ) : (
        <>
          {renderSearchBar({
            ariaLabel: 'Tìm kiếm nhật ký đăng nhập',
            placeholder: 'Tìm kiếm theo tài khoản, họ tên, IP, lý do',
            term: loginSearchTerm,
            setTerm: setLoginSearchTerm,
            onSearch: runLoginSearch,
            open: showLoginFilters,
            setOpen: setShowLoginFilters,
            onExport: handleExportLoginLog,
            status: loginFilterStatus,
            setStatus: setLoginFilterStatus,
            from: loginStartDate,
            setFrom: setLoginStartDate,
            to: loginEndDate,
            setTo: setLoginEndDate,
          })}

          {/* Bảng nhật ký đăng nhập (mục 5.3) */}
          <div className={TABLE_WRAP_CLS}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className={`${TABLE_HEAD_BG} sticky top-0 z-10`}>
                  <tr className={TABLE_HEAD_ROW_CLS}>
                    <th className={`${TH} text-center w-14`}>STT</th>
                    <th className={`${TH} text-left`}>Thời gian</th>
                    <th className={`${TH} text-left`}>Tên đăng nhập</th>
                    <th className={`${TH} text-left`}>Họ và tên</th>
                    <th className={`${TH} text-left`}>IP</th>
                    <th className={`${TH} text-left`}>Trạng thái</th>
                    <th className={`${TH} text-left`}>Chi tiết / Lý do</th>
                    <th className={`${TH} text-left`}>Thiết bị</th>
                    <th className={`${TH} text-left`}>Vị trí</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoginLogs
                    .slice((loginCurrentPage - 1) * loginItemsPerPage, loginCurrentPage * loginItemsPerPage)
                    .map((log, index) => (
                      <tr key={log.id} className={TR}>
                        <td className={`${TD} text-center tabular-nums`}>{(loginCurrentPage - 1) * loginItemsPerPage + index + 1}</td>
                        <TimestampCell value={log.timestamp} />
                        <td className={`${TD} text-left max-w-[200px]`}>
                          <TruncatedText text={log.username} />
                        </td>
                        <td className={`${TD} text-left max-w-[240px]`}>
                          <TruncatedText text={log.fullName} />
                        </td>
                        <td className={`${TD} text-left whitespace-nowrap tabular-nums`}>{log.ip}</td>
                        <td className={`${TD} text-left whitespace-nowrap`}>
                          <Badge
                            label={log.status === 'success' ? 'Thành công' : 'Thất bại'}
                            variant={log.status === 'success' ? 'green' : 'red'}
                          />
                        </td>
                        <td className={`${TD} text-left max-w-[240px]`}>
                          <TruncatedText text={log.status === 'success' ? 'Đăng nhập thành công' : (log.reason || 'Sai mật khẩu')} />
                        </td>
                        <td className={`${TD} text-left max-w-[240px]`}>
                          <TruncatedText text={`${log.device} · ${log.browser}`} />
                        </td>
                        <td className={`${TD} text-left max-w-[220px]`}>
                          <TruncatedText text={log.location} />
                        </td>
                      </tr>
                    ))}
                  {filteredLoginLogs.length === 0 && <EmptyRow colSpan={9} />}
                </tbody>
              </table>
            </div>

            {/* Phân trang (mục 5.14) */}
            <Pagination
              className="border-t border-[#E2E8F0]"
              currentPage={loginCurrentPage}
              totalItems={filteredLoginLogs.length}
              pageSize={loginItemsPerPage}
              onPageChange={setLoginCurrentPage}
              onPageSizeChange={setLoginItemsPerPage}
            />
          </div>
        </>
      )}

      {/* Modal Xem chi tiết phiên truy cập — thiết kế PM 09/10/2026: 5 thẻ thông tin + bảng lịch sử thao tác (chiều cao cố định, thân tự cuộn — mục 5.4) */}
      {showDetailModal && selectedLog && (() => {
        const sessionDate = (selectedLog.timestamp || '').split(' ')[0];
        const pagedActions = sessionActions.slice((actionPage - 1) * actionPageSize, actionPage * actionPageSize);
        const cards = [
          { icon: <User className="w-4 h-4" />, label: 'Người dùng', value: <span className="break-words">{selectedLog.user || '-'}</span>, sub: selectedLog.userId },
          { icon: <Clock className="w-4 h-4" />, label: 'Thời gian bắt đầu', value: <span className="tabular-nums">{selectedLog.timestamp || '-'}</span>, sub: '' },
          { icon: <Monitor className="w-4 h-4" />, label: 'Thiết bị', value: selectedLog.device || '-', sub: selectedLog.browser },
          { icon: <MapPin className="w-4 h-4" />, label: 'Vị trí & IP', value: selectedLog.location || '-', sub: selectedLog.ip },
          { icon: <ShieldCheck className="w-4 h-4" />, label: 'Trạng thái đăng nhập', value: <Badge label={selectedLog.status === 'success' ? 'Thành công' : 'Thất bại'} variant={selectedLog.status === 'success' ? 'green' : 'red'} />, sub: '' },
        ];
        return (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="access-session-title"
            className="bg-white rounded-2xl shadow-2xl w-[1024px] max-w-full h-[90vh] max-h-[800px] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-[#EAF3FF] text-blue-600 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 id="access-session-title" className={MODAL_TITLE}>Chi tiết phiên truy cập</h3>
                  <p className={`${SUB_TEXT} mt-0.5 truncate`}>
                    Session ID: <span className="tabular-nums">{selectedLog.sessionId}</span>
                  </p>
                </div>
              </div>
              <button type="button" onClick={closeDetailModal} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
              {/* 5 thẻ thông tin phiên */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {cards.map((card) => (
                  <div key={card.label} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 min-w-0">
                    <div className="flex items-start gap-1.5 text-[13px] text-[#64748B]">
                      <span className="shrink-0 mt-0.5">{card.icon}</span>
                      <span>{card.label}</span>
                    </div>
                    <div className="mt-2 text-[14px] font-semibold text-[#020817]">{card.value}</div>
                    {card.sub && <div className={`${SUB_TEXT} mt-0.5 break-words tabular-nums`}>{card.sub}</div>}
                  </div>
                ))}
              </div>

              {/* Lịch sử thao tác trong phiên */}
              <div>
                <h4 className="flex items-center gap-2 text-[14px] font-semibold text-[#020817] mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Lịch sử thao tác trong phiên
                  <Badge label={`${sessionActions.length} hành động`} variant="blue" />
                </h4>
                <div className={TABLE_WRAP_CLS}>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-[13px]">
                      <thead className={TABLE_HEAD_BG}>
                        <tr className={TABLE_HEAD_ROW_CLS}>
                          <th className="px-3 py-[13px] leading-4 font-bold text-black text-center w-14">STT</th>
                          <th className="px-3 py-[13px] leading-4 font-bold text-black text-left">Hành động</th>
                          <th className="px-3 py-[13px] leading-4 font-bold text-black text-left whitespace-nowrap">Thời gian</th>
                          <th className="px-3 py-[13px] leading-4 font-bold text-black text-left whitespace-nowrap">Trạng thái</th>
                          <th className="px-3 py-[13px] leading-4 font-bold text-black text-center w-20">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagedActions.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-3 py-8 text-center text-[13px] text-[#64748B]">Không có thao tác nào trong phiên này</td>
                          </tr>
                        ) : pagedActions.map((action, i) => (
                          <tr key={action.id} className="h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-3 py-1 text-center text-black">{(actionPage - 1) * actionPageSize + i + 1}</td>
                            <td className="px-3 py-1 text-black max-w-[420px]"><TruncatedText text={action.description} /></td>
                            <td className="px-3 py-1 text-black whitespace-nowrap tabular-nums">{sessionDate} {action.time}</td>
                            <td className="px-3 py-1 whitespace-nowrap">
                              <Badge label={action.status === 'success' ? 'Thành công' : 'Thất bại'} variant={action.status === 'success' ? 'green' : 'red'} />
                            </td>
                            <td className="px-3 py-1 text-center">
                              <RowIconAction label="Xem chi tiết" onClick={() => setSelectedAction(action)}>
                                <Eye className="w-4 h-4" />
                              </RowIconAction>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {sessionActions.length > 0 && (
                    <Pagination
                      className="border-t border-[#E2E8F0]"
                      currentPage={actionPage}
                      totalItems={sessionActions.length}
                      pageSize={actionPageSize}
                      onPageChange={setActionPage}
                      onPageSizeChange={(n: number) => { setActionPageSize(n); setActionPage(1); }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end">
              <button type="button" onClick={closeDetailModal} className={BTN_OUTLINE}>
                Đóng
              </button>
            </div>
          </div>

          {/* Chi tiết một thao tác (modal nhỏ, chồng trên modal phiên) */}
          {selectedAction && (
            <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedAction(null)}>
              <div role="dialog" aria-modal="true" aria-labelledby="access-action-title" className="bg-white rounded-2xl shadow-2xl w-[560px] max-w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
                  <h3 id="access-action-title" className={MODAL_TITLE}>Chi tiết thao tác</h3>
                  <button type="button" onClick={() => setSelectedAction(null)} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-1">
                      <div className={FIELD_LABEL}>Hành động</div>
                      <div><Badge label={selectedAction.action} variant={ACTION_VARIANT[selectedAction.type]} /></div>
                    </div>
                    <div className="space-y-1">
                      <div className={FIELD_LABEL}>Phân hệ</div>
                      <div className={FIELD_VALUE}>{selectedAction.module || '-'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className={FIELD_LABEL}>Thời gian</div>
                      <div className={`${FIELD_VALUE} tabular-nums`}>{sessionDate} {selectedAction.time}</div>
                    </div>
                    <div className="space-y-1">
                      <div className={FIELD_LABEL}>Trạng thái</div>
                      <div><Badge label={selectedAction.status === 'success' ? 'Thành công' : 'Thất bại'} variant={selectedAction.status === 'success' ? 'green' : 'red'} /></div>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <div className={FIELD_LABEL}>Mô tả</div>
                      <div className={`${FIELD_VALUE} break-words`}>{selectedAction.description || '-'}</div>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <div className={FIELD_LABEL}>Đối tượng tác động</div>
                      <div className={`${FIELD_VALUE} break-all`}>{selectedAction.target || '-'}</div>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 px-6 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end">
                  <button type="button" onClick={() => setSelectedAction(null)} className={BTN_OUTLINE}>Đóng</button>
                </div>
              </div>
            </div>
          )}
        </div>
        );
      })()}
    </div>
  );
}
