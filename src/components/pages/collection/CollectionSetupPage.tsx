import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, RefreshCw, Search, Plus, Eye, Edit, Settings as SettingsIcon, Trash2, FileText, Activity, Settings, AlertCircle, AlertTriangle, X, Download, Send, ChevronLeft, ChevronRight, Calendar, Wrench, Power, Layers, Database, Eraser, CheckCircle, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '../../ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import { AddServiceModal, EditServiceModal, DeleteServiceModal, SettingsServiceModal } from './ServiceModals';
import { ViewServiceModal } from './ViewServiceModal';
import { LogManagement } from './LogManagement';
import { mockCollectionServices } from './mockCollectionServices';
import { ServiceDataDetailPage } from './ServiceDataDetailPage';
import { Portal } from '../../common/Portal';
import { StatusTag } from '../../common/StatusTag';
import { BaseModal } from '../../common/BaseModal';
import { ConfirmModal } from '../../common/ConfirmModal';

// Định dạng dung lượng dữ liệu suy ra từ số bản ghi (dùng khi dịch vụ chưa có sẵn dataSize)
const formatDataSize = (records: number) => {
  const bytes = (records || 0) * 1150; // ~1.15 KB/bản ghi
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(0)} KB`;
  return `${bytes} B`;
};

// --- Thành phần theo tailieu/docs/compomennt.md ---

// Tooltip chuẩn (mục 5.3.1): nền xám đậm, chữ trắng 12px/500, tối đa 480px
const TOOLTIP_CLS = 'z-[300] max-w-[480px] bg-[#475569]/95 text-white text-[12px] font-medium px-3 py-2 rounded-lg text-left [&_svg]:!fill-[#475569] [&_svg]:!bg-[#475569]';

// Badge (mục 5.8): 13px/400, padding 2×8, viền 1px, bo 16px, cao 26px
const BADGE_TONES: Record<string, string> = {
  // Loại nguồn
  'Trong ngành': 'text-[#8200DB] bg-[#FAF5FF] border-[#E7E1EC]',
  'Ngoài ngành': 'text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]',
  // Phương thức kết nối
  'Cơ Sở Dữ Liệu': 'text-[#4338CA] bg-[#EEF2FF] border-[#E0E7FF]',
  'File': 'text-[#475569] bg-[#F8FAFC] border-[#E2E8F0]',
  'API': 'text-[#047857] bg-[#ECFDF5] border-[#D1FAE5]',
  'API nhận (JSON)': 'text-[#C2410C] bg-[#FFF7ED] border-[#FED7AA]',
  'API nhận (XML)': 'text-[#C2410C] bg-[#FFF7ED] border-[#FED7AA]',
  // Trạng thái dịch vụ
  'Hoạt động': 'text-[#15803D] bg-[#F0FDF4] border-[#DCFCE7]',
  'Bản nháp': 'text-[#64748B] bg-[#F8FAFC] border-[#E2E8F0]',
  'Ngưng hoạt động': 'text-[#64748B] bg-[#F8FAFC] border-[#E2E8F0]',
  // Trạng thái dữ liệu
  'Rỗng': 'text-[#64748B] bg-[#F8FAFC] border-[#E2E8F0]',
  'Lỗi cập nhật': 'text-[#B91C1C] bg-[#FEF2F2] border-[#FEE2E2]',
  'Cập nhật thành công': 'text-[#047857] bg-[#ECFDF5] border-[#D1FAE5]',
  'Đang xử lý': 'text-[#D97706] bg-white border-[#F6B657]',
};

const Badge = ({ label }: { label: string }) => (
  <span className={`inline-flex items-center h-[26px] px-2 py-0.5 rounded-2xl border text-[13px] font-normal whitespace-nowrap ${BADGE_TONES[label] || BADGE_TONES['Rỗng']}`}>
    {label}
  </span>
);

// Chữ dài: cắt 1 dòng, hover hiện tooltip đầy đủ — chỉ hiện khi chữ thực sự bị cắt (mục 5.3.1)
const TruncatedText = ({ text, className = '', extra }: { text: string; className?: string; extra?: ReactNode }) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <Tooltip
      open={open}
      onOpenChange={(next: boolean) => {
        const el = ref.current;
        setOpen(next && !!el && (el.scrollWidth > el.clientWidth || !!extra));
      }}
    >
      <TooltipTrigger asChild>
        <span ref={ref} className={`block truncate ${className}`}>{text}</span>
      </TooltipTrigger>
      <TooltipContent side="top" align="start" sideOffset={4} className={TOOLTIP_CLS}>
        <div>{text}</div>
        {extra && <div className="mt-1 font-normal opacity-90">{extra}</div>}
      </TooltipContent>
    </Tooltip>
  );
};

// Trạng thái nút (mục 5.1): vô hiệu = nền #F1F5F9 + chữ #94A3B8, không dùng opacity
const BTN_FOCUS = 'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1';
const BTN_DISABLED = 'disabled:bg-[#F1F5F9] disabled:bg-none disabled:border-[#E2E8F0] disabled:text-[#94A3B8] disabled:shadow-none disabled:cursor-not-allowed';
const BTN_PRIMARY = `h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-[13px] font-medium hover:bg-blue-700 transition-colors ${BTN_FOCUS} ${BTN_DISABLED}`;
const BTN_OUTLINE = `h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[#CBD5E1] bg-white text-[#334155] text-[13px] font-medium hover:bg-[#F8FAFC] hover:border-[#94A3B8] hover:text-[#020817] transition-colors ${BTN_FOCUS} ${BTN_DISABLED}`;
const BTN_PAGE = `h-8 min-w-8 px-3 inline-flex items-center justify-center rounded-lg border text-[13px] font-medium transition-colors ${BTN_FOCUS} ${BTN_DISABLED}`;
const BTN_PAGE_IDLE = 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC] hover:border-[#94A3B8] hover:text-[#020817]';
const BTN_GHOST_ICON = `p-1.5 rounded-lg text-[#475569] hover:bg-[#F1F5F9] hover:text-[#020817] transition-colors ${BTN_FOCUS}`;

// Nút icon trong cột thao tác (mục 5.3.2): 32×32, icon 16px #475569, tooltip bắt buộc
const ROW_ICON_BTN = `w-8 h-8 inline-flex items-center justify-center rounded-lg text-[#475569] hover:bg-[#F1F5F9] hover:text-blue-600 data-[state=open]:bg-[#EAF3FF] data-[state=open]:text-blue-600 transition-colors ${BTN_FOCUS} disabled:text-[#CBD5E1] disabled:bg-transparent disabled:cursor-not-allowed`;
const MENU_ITEM = 'min-h-8 px-3 py-1.5 gap-2 text-[13px] cursor-pointer focus:bg-[#F1F5F9] data-[disabled]:opacity-100 data-[disabled]:text-[#94A3B8] data-[disabled]:cursor-not-allowed';

// Nút bị vô hiệu giữ nguyên vị trí, tooltip ghi lý do (bọc span vì nút disabled không nhận sự kiện hover)
const RowIconAction = ({ label, onClick, children, disabledReason }: { label: string; onClick: () => void; children: ReactNode; disabledReason?: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {disabledReason ? (
        <span tabIndex={0} className="inline-flex rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
          <button type="button" aria-label={label} className={`${ROW_ICON_BTN} pointer-events-none`} disabled>
            {children}
          </button>
        </span>
      ) : (
        <button type="button" aria-label={label} className={ROW_ICON_BTN} onClick={onClick}>
          {children}
        </button>
      )}
    </TooltipTrigger>
    <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>
      <div>{label}</div>
      {disabledReason && <div className="mt-0.5 font-normal opacity-90">{disabledReason}</div>}
    </TooltipContent>
  </Tooltip>
);

// --- Logic thao tác theo trạng thái dịch vụ / dữ liệu ---
type ServiceStatus = 'active' | 'inactive' | 'draft';
type DataStatus = 'EMPTY' | 'DATA_UPDATE_FAILED' | 'DATA_UPDATED' | 'PROCESSING';
type ConnectionMethod = 'API' | 'API nhận (JSON)' | 'API nhận (XML)' | 'Cơ Sở Dữ Liệu' | 'File';
// API nhận dữ liệu (hệ thống nguồn đẩy sang) không có thao tác Tích hợp mới / Cập nhật dữ liệu
const PUSH_API_METHODS: ConnectionMethod[] = ['API nhận (JSON)', 'API nhận (XML)'];

const SERVICE_STATUS_LABEL: Record<ServiceStatus, string> = { active: 'Hoạt động', inactive: 'Ngưng hoạt động', draft: 'Bản nháp' };
const DATA_STATUS_LABEL: Record<DataStatus, string> = { EMPTY: 'Rỗng', DATA_UPDATE_FAILED: 'Lỗi cập nhật', DATA_UPDATED: 'Cập nhật thành công', PROCESSING: 'Đang xử lý' };

// Trạng thái demo cho 10 dịch vụ đầu (đủ mọi trạng thái). Gán tại màn này, không sửa mock dùng chung
// vì mockCollectionServices còn được Dashboard thu thập / Báo cáo KPI sử dụng.
const DEMO_STATES: Record<number, { serviceStatus: ServiceStatus; dataStatus: DataStatus; targetDbHasData?: boolean; connectionMethod?: ConnectionMethod }> = {
  1: { serviceStatus: 'active', dataStatus: 'DATA_UPDATED' },
  2: { serviceStatus: 'active', dataStatus: 'DATA_UPDATE_FAILED', connectionMethod: 'API nhận (JSON)' },
  3: { serviceStatus: 'active', dataStatus: 'PROCESSING' },
  4: { serviceStatus: 'draft', dataStatus: 'EMPTY' },
  5: { serviceStatus: 'inactive', dataStatus: 'DATA_UPDATED', connectionMethod: 'API nhận (XML)' },
  6: { serviceStatus: 'inactive', dataStatus: 'EMPTY' },
  7: { serviceStatus: 'active', dataStatus: 'DATA_UPDATED', targetDbHasData: true },
  8: { serviceStatus: 'draft', dataStatus: 'DATA_UPDATE_FAILED', connectionMethod: 'File' },
  10: { serviceStatus: 'active', dataStatus: 'EMPTY' },
  11: { serviceStatus: 'inactive', dataStatus: 'DATA_UPDATE_FAILED' },
};

const normalizeService = (s: any) => {
  const serviceStatus: ServiceStatus = s.status === 'draft' ? 'draft' : s.status === 'inactive' ? 'inactive' : 'active';
  const raw = s.dataStatus || (s.status === 'success' ? 'DATA_UPDATED' : s.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY');
  const dataStatus: DataStatus = raw === 'DATA_UPDATED' || raw === 'PROCESSING' || raw === 'EMPTY' ? raw : 'DATA_UPDATE_FAILED';
  const demo = DEMO_STATES[s.id];
  const connectionMethod: ConnectionMethod = s.type === 'SOAP' ? 'Cơ Sở Dữ Liệu' : s.type === 'REST' ? 'API' : 'File';
  return { ...s, serviceStatus: demo?.serviceStatus ?? serviceStatus, dataStatus: demo?.dataStatus ?? dataStatus, targetDbHasData: demo?.targetDbHasData ?? false, connectionMethod: demo?.connectionMethod ?? connectionMethod };
};

// Trả về lý do bị khóa (string) hoặc null nếu được phép thao tác
const getActionRules = (s: { serviceStatus: ServiceStatus; dataStatus: DataStatus; targetDbHasData?: boolean; connectionMethod: ConnectionMethod }) => {
  const processing = s.dataStatus === 'PROCESSING' ? 'Dữ liệu đang xử lý' : null;
  return {
    hasDataSync: !PUSH_API_METHODS.includes(s.connectionMethod), // false => ẩn Tích hợp mới, Cập nhật dữ liệu
    mapping: processing || (s.dataStatus === 'DATA_UPDATED' ? null : 'Chỉ khả dụng khi dữ liệu Cập nhật thành công'),
    integrate: processing || (s.dataStatus === 'EMPTY' || s.dataStatus === 'DATA_UPDATE_FAILED' ? null : 'Chỉ khả dụng khi dữ liệu Rỗng hoặc Lỗi cập nhật'),
    update: processing || (s.dataStatus === 'DATA_UPDATED' ? null : 'Cần tích hợp mới thành công lần đầu'),
    deleteData: processing
      || (s.dataStatus === 'EMPTY' ? 'Chưa có dữ liệu thu thập' : null)
      || (s.targetDbHasData ? 'CSDL đích còn dữ liệu - xóa dữ liệu chuyển đổi trước' : null),
    toggle: processing || (s.serviceStatus === 'draft' ? 'Dịch vụ đang ở trạng thái Bản nháp' : null),
    deleteService: processing || (s.dataStatus === 'EMPTY' ? null : 'Chỉ xóa được khi dữ liệu Rỗng'),
  };
};

// Mục menu ⋯: bị khóa thì hiển thị lý do ngay trong mục (compomennt.md 5.3.2)
const MenuAction = ({ icon, label, reason, danger, onSelect }: { icon: ReactNode; label: string; reason: string | null; danger?: boolean; onSelect: () => void }) => (
  <DropdownMenuItem
    disabled={!!reason}
    onClick={reason ? undefined : onSelect}
    className={`${MENU_ITEM} items-start ${reason ? '' : danger ? 'text-[#DC2626] focus:text-[#DC2626]' : 'text-[#020817]'}`}
  >
    <span className={`mt-0.5 ${reason ? 'text-[#CBD5E1]' : danger ? 'text-[#DC2626]' : 'text-[#475569]'}`}>{icon}</span>
    <span className="flex flex-col">
      <span>{label}</span>
      {reason && <span className="text-[12px] text-[#64748B]">{reason}</span>}
    </span>
  </DropdownMenuItem>
);

interface CollectionSetupPageProps {
  onNavigate?: (pageId: string) => void;
  activeTab?: 'service-setup' | 'version';
  onTabChange?: (tab: 'service-setup' | 'version') => void;
}

export function CollectionSetupPage({ onNavigate, activeTab: propActiveTab, onTabChange }: CollectionSetupPageProps) {
  const [localActiveTab, setLocalActiveTab] = useState<'service-setup' | 'version'>('service-setup');
  const activeTab = propActiveTab || localActiveTab;
  const setActiveTab = onTabChange || setLocalActiveTab;
  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const action = pathParts[1];
  const urlId = pathParts[2];

  const showAddServiceModal = action === 'add';
  const showEditServiceModal = action === 'edit' && !!urlId;
  const showDetailModal = action === 'view' && !!urlId;
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'general';

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showErrorDetailModal, setShowErrorDetailModal] = useState(false);
  const [showDataDetailPage, setShowDataDetailPage] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showUpdateSuccessModal, setShowUpdateSuccessModal] = useState(false);
  const [showIntegrateWarningModal, setShowIntegrateWarningModal] = useState(false);
  const [showDeleteDataConfirmModal, setShowDeleteDataConfirmModal] = useState(false);
  const [inactiveReason, setInactiveReason] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    if (urlId) {
      const service = mockCollectionServices.find(s => s.id === Number(urlId));
      if (service) setSelectedService(service);
    }
  }, [urlId]);

  const closeModal = () => navigate('/collection-setup');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all'); // New: nguồn dữ liệu filter
  const [departmentFilter, setDepartmentFilter] = useState('all'); // New: cục/vụ filter
  const [navigateToPage, setNavigateToPage] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const handleNavLog = (e: any) => {
      navigate('/collection-setup');
      setActiveTab('version');
      if (e.detail?.logId) {
        setNavigateToPage(e.detail.logId.toString());
      }
    };
    window.addEventListener('NAVIGATE_TO_LOG', handleNavLog);
    return () => window.removeEventListener('NAVIGATE_TO_LOG', handleNavLog);
  }, []);

  // Get current month's first and last day
  const getCurrentMonthRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      start: firstDay.toISOString().split('T')[0],
      end: lastDay.toISOString().split('T')[0]
    };
  };

  const defaultRange = getCurrentMonthRange();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const mockServices = mockCollectionServices.map(normalizeService);

  // Helper function to reset all filters
  const resetFilters = () => {
    setSearchText('');
    setSourceFilter('all');
    setDepartmentFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Helper function to parse date string DD/MM/YYYY HH:mm:ss
  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    const [datePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Helper function to filter services (date range is just for display, not filtering)
  const filterServices = (services: any[]) => {
    return services.filter(service => {
      // Date filtering based on updatedAt
      let matchesDate = true;
      if (startDate || endDate) {
        const updateDate = parseDate(service.updatedAt);
        if (updateDate) {
          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (updateDate < start) matchesDate = false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (updateDate > end) matchesDate = false;
          }
        }
      }

      const matchesStatus = statusFilter === 'all' || service.serviceStatus === statusFilter;

      return matchesDate &&
        matchesStatus &&
        (typeFilter === 'all' || service.connectionMethod === typeFilter) &&
        (sourceFilter === 'all' || service.source === sourceFilter) &&
        (departmentFilter === 'all' || service.department === departmentFilter) &&
        (searchText === '' ||
          service.name.toLowerCase().includes(searchText.toLowerCase()) ||
          service.code.toLowerCase().includes(searchText.toLowerCase()) ||
          service.managingUnit.toLowerCase().includes(searchText.toLowerCase())
        );
    });
  };

  const filteredServices = filterServices(mockServices);

  const stats = {
    total: mockServices.length,
    active: mockServices.filter(s => s.serviceStatus === 'active').length,
    maintenance: mockServices.filter(s => s.serviceStatus === 'draft').length,
    inactive: mockServices.filter(s => s.serviceStatus === 'inactive').length
  };

  // Function to send notification to source system
  const sendNotificationToSource = (service: any) => {
    console.log(`Gửi thông báo cho hệ thống ${service.name}:`, {
      code: service.code,
      status: service.statusText,
      time: new Date().toLocaleString('vi-VN'),
      message: service.status === 'success'
        ? `Kiểm tra cấu trúc thành công. Đã nhận ${service.recordsReceived} bản ghi.`
        : `Kiểm tra cấu trúc thất bại: ${service.errorDetails?.errorMessage || 'Lỗi không xác định'}`
    });

    alert(`✅ Đã gửi thông báo tự động cho ${service.managingUnit}\n\nTrạng thái: ${service.statusText}\nThời gian: ${new Date().toLocaleString('vi-VN')}`);
  };

  // Export function for service list
  const handleExportServiceList = () => {
    alert('Đang kết xuất danh sách dịch vụ ra file Excel...');
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <div className="h-full flex flex-col bg-slate-50 min-h-screen">
      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('service-setup')}
            className={`h-12 flex items-center gap-2 px-4 py-3 cursor-pointer text-[14px] font-semibold transition-colors border-b-2 ${activeTab === 'service-setup'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-[#64748B] hover:text-[#020817]'
              }`}
          >
            <Settings className="w-5 h-5" />
            Thiết lập dịch vụ
          </button>
          <button
            onClick={() => setActiveTab('version')}
            className={`h-12 flex items-center gap-2 px-4 py-3 cursor-pointer text-[14px] font-semibold transition-colors border-b-2 ${activeTab === 'version'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-[#64748B] hover:text-[#020817]'
              }`}
          >
            <FileText className="w-5 h-5" />
            Quản lý nhật ký
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Tab: Thiết lập dịch vụ */}
        {activeTab === 'service-setup' && (
          <div className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-[16px] text-[#64748B]">Tổng số dịch vụ đã thiết lập</div>
                    <div className="text-[16px] font-semibold text-[#0F172A]">{stats.total}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-[16px] text-[#64748B]">Đang hoạt động</div>
                    <div className="text-[16px] font-semibold text-[#0F172A]">{stats.active}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Settings className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-[16px] text-[#64748B]">Bản nháp</div>
                    <div className="text-[16px] font-semibold text-[#0F172A]">{stats.maintenance}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-[16px] text-[#64748B]">Ngưng hoạt động</div>
                    <div className="text-[16px] font-semibold text-[#0F172A]">{stats.inactive}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Actions */}
            <div className="mb-6">
              {/* Row 1: Search and Buttons */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-2">
                  <div className="relative flex-1">
                    <input aria-label="Tìm kiếm dịch vụ"
                      type="text"
                      placeholder="Tìm kiếm theo tên dịch vụ, hệ thống nguồn"
                      className="w-full h-[35px] px-3 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    aria-label="Tìm kiếm"
                    title="Tìm kiếm"
                    className={`w-10 h-10 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center justify-center ${BTN_FOCUS} ${BTN_DISABLED}`}
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Bộ lọc"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center border ${BTN_FOCUS} ${BTN_DISABLED} ${showFilters ? 'bg-[#EAF3FF] border-[#BFDBFE] text-blue-600' : 'bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#020817]'}`}
                    title="Bộ lọc"
                  >
                    {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/collection-setup/add')}
                    className={BTN_PRIMARY}
                  >
                    <Plus className="w-4 h-4" />
                    Thêm mới
                  </button>
                  <button
                    onClick={handleExportServiceList}
                    className={BTN_OUTLINE}
                  >
                    <Download className="w-4 h-4" />
                    Kết xuất
                  </button>
                </div>
              </div>

              {/* Row 2: Filters (Collapsible) */}
              {showFilters && (
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-6 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
                  <div className="absolute -top-2 right-[200px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-[13px] font-medium text-[#020817]">Loại kết nối</label>
                    <select aria-label="Select box"
                      className="w-full h-[35px] px-3 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="all">Tất cả phương thức</option>
                      <option value="Cơ Sở Dữ Liệu">Cơ Sở Dữ Liệu</option>
                      <option value="API">API</option>
                      <option value="API nhận (JSON)">API nhận (JSON)</option>
                      <option value="API nhận (XML)">API nhận (XML)</option>
                      <option value="File">File</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-[13px] font-medium text-[#020817]">Nguồn dữ liệu</label>
                    <select aria-label="Select box"
                      className="w-full h-[35px] px-3 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                    >
                      <option value="all">Tất cả nguồn dữ liệu</option>
                      <option value="Trong ngành">Trong ngành</option>
                      <option value="Ngoài ngành">Ngoài ngành</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-[13px] font-medium text-[#020817]">Hệ thống nguồn</label>
                    <select aria-label="Select box"
                      className="w-full h-[35px] px-3 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                      <option value="all">Tất cả hệ thống nguồn</option>
                      <option value="Bộ ngành ngoài">Bộ ngành ngoài</option>
                      <option value="Cục Hành chính tư pháp">Cục Hành chính tư pháp</option>
                      <option value="Cục Quản lý thi hành án dân sự">Cục Quản lý thi hành án dân sự</option>
                      <option value="Cục Đăng ký giao dịch bảo đảm">Cục Đăng ký giao dịch bảo đảm</option>
                      <option value="Cục Kiểm tra văn bản">Cục Kiểm tra văn bản</option>
                      <option value="Cục Bổ trợ tư pháp">Cục Bổ trợ tư pháp</option>
                      <option value="Vụ Hợp tác quốc tế">Vụ Hợp tác quốc tế</option>
                      <option value="Cục Kế hoạch - Tài chính">Cục Kế hoạch - Tài chính</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-[13px] font-medium text-[#020817]">Trạng thái</label>
                    <select aria-label="Select box"
                      className="w-full h-[35px] px-3 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="draft">Bản nháp</option>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Ngưng hoạt động</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-[13px] font-medium text-[#020817]">Thời gian từ</label>
                    <div className="flex items-center gap-2 bg-white h-[35px] px-3 rounded-lg border border-[#E2E8F0] focus-within:ring-2 focus-within:ring-blue-600">
                      <input aria-label="Input field"
                        type="date"
                        className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-[#020817] p-0"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-[13px] font-medium text-[#020817]">Thời gian đến</label>
                    <div className="flex items-center gap-2 bg-white h-[35px] px-3 rounded-lg border border-[#E2E8F0] focus-within:ring-2 focus-within:ring-blue-600">
                      <input aria-label="Input field"
                        type="date"
                        className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-[#020817] p-0"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Services Table */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse collection-table text-[13px]">
                  <thead className="bg-[#F8FAFC] sticky top-0 z-[1]">
                    <tr className="h-[42px]">
                      <th className="px-3 py-[13px] leading-4 text-center font-bold text-black whitespace-nowrap w-12 text-[13px]">STT</th>
                      <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]">Tên dịch vụ</th>
                      <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]">Mã dịch vụ</th>
                      <th className={`px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]`}>Loại nguồn</th>
                      <th className={`px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]`}>Phương thức kết nối</th>
                      <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]">Phiên bản</th>
                      <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]">Hệ thống nguồn</th>
                      <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]">Ngày tạo</th>
                      <th className={`px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]`}>Trạng thái dịch vụ</th>
                      <th className={`px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]`}>Trạng thái dữ liệu</th>
                      <th className="px-3 py-[13px] leading-4 text-center font-bold text-black whitespace-nowrap text-[13px] sticky right-0 bg-[#F8FAFC] shadow-[-6px_0_6px_-6px_rgba(15,23,42,0.18)]">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((service, index) => {
                        const rules = getActionRules(service);
                        return (
                        <tr key={service.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-3 py-1 text-center text-black text-[13px] whitespace-nowrap">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td className="px-3 py-1 text-left text-black text-[13px] max-w-[360px]">
                            <TruncatedText text={service.name} extra={service.description} />
                          </td>
                          <td className="px-3 py-1 text-left text-black text-[13px] max-w-[200px]">
                            <TruncatedText text={service.code || '-'} />
                          </td>
                          <td className={`px-3 py-1 text-left`}>
                            <Badge label={service.source || 'Trong ngành'} />
                          </td>
                          <td className={`px-3 py-1 text-left`}>
                            <Badge label={service.connectionMethod} />
                          </td>
                          <td className="px-3 py-1 text-left text-black text-[13px] whitespace-nowrap">{service.version}</td>
                          <td className="px-3 py-1 text-left text-black text-[13px] max-w-[220px]">
                            <TruncatedText text={service.managingUnit || '-'} />
                          </td>
                          <td className="px-3 py-1 text-left text-black whitespace-nowrap text-[13px] leading-[18px]">
                            {service.updatedAt.split(' ').map((part: string, i: number) => (
                              <div key={i}>{part}</div>
                            ))}
                          </td>
                          <td className={`px-3 py-1 text-left`}>
                            <Badge label={SERVICE_STATUS_LABEL[service.serviceStatus as ServiceStatus]} />
                          </td>
                          <td className={`px-3 py-1 text-left`}>
                            <Badge label={DATA_STATUS_LABEL[service.dataStatus as DataStatus]} />
                          </td>
                          <td className="px-3 py-1 text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-6px_0_6px_-6px_rgba(15,23,42,0.18)]">
                            {/* Cột thao tác (compomennt.md 5.3.2): 6 thao tác => 2 nút icon + menu ⋯ */}
                            <div className="inline-flex items-center justify-center gap-1">
                              <RowIconAction
                                label="Xem chi tiết"
                                onClick={() => {
                                  setSelectedService(service);
                                  navigate(`/collection-setup/view/${service.id}`);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </RowIconAction>
                              <RowIconAction
                                label="Mapping chi tiết"
                                disabledReason={rules.mapping ?? undefined}
                                onClick={() => {
                                  if (onNavigate) {
                                    onNavigate('data-info-civil-registry');
                                  } else {
                                    setSelectedService(service);
                                    setShowDataDetailPage(true);
                                  }
                                }}
                              >
                                <Layers className="w-4 h-4" />
                              </RowIconAction>

                              {/* Menu ⋯ chia 2 nhóm theo đối tượng: Dữ liệu / Dịch vụ — Xóa đặt cuối mỗi nhóm */}
                              <DropdownMenu>
                                <Tooltip>
                                  {/* Chỉ hiện tooltip khi hover: khi menu đóng focus quay về nút, không để tooltip tự bật đè lên modal */}
                                  <TooltipTrigger asChild onFocus={(e: { preventDefault: () => void }) => e.preventDefault()}>
                                    <span className="inline-flex">
                                      <DropdownMenuTrigger asChild>
                                        <button type="button" aria-label="Thao tác khác" className={ROW_ICON_BTN}>
                                          <MoreVertical className="w-4 h-4" />
                                        </button>
                                      </DropdownMenuTrigger>
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Thao tác khác</TooltipContent>
                                </Tooltip>
                                <DropdownMenuContent align="end" className="w-56 rounded-lg border border-[#E2E8F0] bg-white shadow-lg p-1">
                                  <DropdownMenuLabel className="px-3 py-1 text-[12px] font-medium text-[#64748B]">Dữ liệu</DropdownMenuLabel>
                                  {rules.hasDataSync && (
                                    <>
                                      <MenuAction icon={<Plus className="w-4 h-4" />} label="Tích hợp mới" reason={rules.integrate}
                                        onSelect={() => { setSelectedService(service); setShowIntegrateWarningModal(true); }} />
                                      <MenuAction icon={<RefreshCw className="w-4 h-4" />} label="Cập nhật dữ liệu" reason={rules.update}
                                        onSelect={() => { setSelectedService(service); setShowUpdateSuccessModal(true); }} />
                                    </>
                                  )}
                                  <MenuAction icon={<Eraser className="w-4 h-4" />} label="Xóa dữ liệu thu thập" reason={rules.deleteData} danger
                                    onSelect={() => { setSelectedService(service); setShowDeleteDataConfirmModal(true); }} />
                                  <DropdownMenuSeparator className="bg-[#E2E8F0]" />
                                  <DropdownMenuLabel className="px-3 py-1 text-[12px] font-medium text-[#64748B]">Dịch vụ</DropdownMenuLabel>
                                  {service.serviceStatus === 'inactive' ? (
                                    <MenuAction icon={<Power className="w-4 h-4" />} label="Hoạt động" reason={rules.toggle}
                                      onSelect={() => { setSelectedService(service); setShowActivateModal(true); }} />
                                  ) : (
                                    <MenuAction icon={<Power className="w-4 h-4" />} label="Ngừng hoạt động" reason={rules.toggle}
                                      onSelect={() => { setSelectedService(service); setShowInactiveModal(true); }} />
                                  )}
                                  <MenuAction icon={<Trash2 className="w-4 h-4" />} label="Xóa dịch vụ" reason={rules.deleteService} danger
                                    onSelect={() => { setSelectedService(service); setShowDeleteModal(true); }} />
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 collection-pagination text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">Hiển thị</span>
                  <select aria-label="Số bản ghi trên trang"
                    className="h-8 px-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-[13px]"
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
                    {filteredServices.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredServices.length)} / {filteredServices.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                      disabled={currentPage === 1}
                      className={`${BTN_PAGE} ${BTN_PAGE_IDLE}`}
                    >
                      Trước
                    </button>
                    
                    {Array.from({ length: Math.ceil(filteredServices.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={`${BTN_PAGE} ${currentPage === page ? 'bg-blue-600 border-blue-600 text-white' : BTN_PAGE_IDLE}`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                        }
                      }}
                      disabled={currentPage >= Math.ceil(filteredServices.length / itemsPerPage)}
                      className={`${BTN_PAGE} ${BTN_PAGE_IDLE}`}
                    >
                      Sau
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Quản lý nhật ký */}
        {activeTab === 'version' && (
          <LogManagement initialOpenLogId={navigateToPage ? parseInt(navigateToPage) : null} />
        )}
      </div>

      {/* Modals */}
      <AddServiceModal
        isOpen={showAddServiceModal}
        onClose={closeModal}
      />
      <EditServiceModal
        isOpen={showEditServiceModal}
        onClose={closeModal}
        service={selectedService}
        initialTab={initialTab}
      />
      <ViewServiceModal
        isOpen={showDetailModal}
        onClose={closeModal}
        service={selectedService}
        initialTab={initialTab as any}
        onViewData={(pageId?: string) => {
          closeModal();
          if (pageId && onNavigate) {
            onNavigate(pageId);
          } else {
            setShowDataDetailPage(true);
          }
        }}
      />
      <ConfirmModal
        isOpen={showActivateModal}
        onClose={() => setShowActivateModal(false)}
        onConfirm={() => {
          alert(`Đã kích hoạt lại dịch vụ: ${selectedService?.name}`);
          setShowActivateModal(false);
        }}
        title="Kích hoạt lại dịch vụ"
        message={<>Bạn có chắc chắn muốn chuyển dịch vụ <strong>{selectedService?.name}</strong> sang trạng thái Hoạt động?</>}
        confirmText="Hoạt động"
        type="info"
      />
      <DeleteServiceModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        service={selectedService}
      />
      <SettingsServiceModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        service={selectedService}
      />
      <BaseModal
        isOpen={showUpdateSuccessModal}
        onClose={() => setShowUpdateSuccessModal(false)}
        title="Cập nhật dữ liệu"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col items-center py-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-5 ring-4 ring-emerald-100">
            <CheckCircle className="w-7 h-7 text-emerald-600" />
          </div>
          <p className="text-[13px] font-bold text-center leading-relaxed px-4 mb-6 text-slate-800">
            Khởi tạo yêu cầu Cập nhật dữ liệu thành công!
          </p>
          {selectedService && (
            <p className="text-[12px] text-slate-500 text-center mb-6 -mt-4 font-medium px-4">
              Hệ thống đang tiến hành đồng bộ dữ liệu cho: <span className="text-slate-900 font-semibold">{selectedService.name}</span>
            </p>
          )}
          <div className="flex justify-center w-full">
            <button 
              onClick={() => setShowUpdateSuccessModal(false)}
              className={BTN_PRIMARY}
            >
              Đóng
            </button>
          </div>
        </div>
      </BaseModal>
      <BaseModal
        isOpen={showIntegrateWarningModal}
        onClose={() => setShowIntegrateWarningModal(false)}
        title="Thông báo"
        maxWidth="max-w-lg"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button 
              onClick={() => setShowIntegrateWarningModal(false)} 
              className={BTN_PRIMARY}
            >
              Đồng ý
            </button>
          </div>
        }
      >
        <div className="pt-2 pb-4 space-y-5">
          {/* Warning Icon & Bold Message */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-slate-800 leading-snug">
                Không thể tích hợp dữ liệu
              </h4>
              <p className="text-[13px] text-slate-500 mt-1 font-medium">
                CSDL đang cấu hình: <span className="text-slate-900 font-semibold">{selectedService?.name}</span>
              </p>
            </div>
          </div>

          {/* Detailed Points Container */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5 text-rose-600">
                <span className="text-[11px] font-bold">✓</span>
              </div>
              <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
                Bạn phải thực hiện xóa dữ liệu trước khi thực hiện thao tác.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 text-amber-600">
                <span className="text-[11px] font-bold">✓</span>
              </div>
              <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
                Hành động này sẽ ảnh hưởng tới các CSDL trích xuất đang sử dụng dữ liệu từ CSDL tích hợp này, các CSDL trích xuất đó sẽ không thể cập nhật dữ liệu thay đổi được nữa.
              </p>
            </div>
          </div>
        </div>
      </BaseModal>
      <ConfirmModal
        isOpen={showDeleteDataConfirmModal}
        onClose={() => setShowDeleteDataConfirmModal(false)}
        onConfirm={() => {
          alert('Đã xóa dữ liệu thu thập thành công!');
        }}
        title="Thông báo"
        subtitle="Cảnh báo hành động xóa dữ liệu"
        message="Nếu bạn xóa dữ liệu sẽ không thể hoàn tác dữ liệu trong cơ sở dữ liệu. Bạn có chắc chắn muốn xóa dữ liệu không?"
        confirmText="Đồng ý"
        cancelText="Hủy bỏ"
        type="warning"
      />

      {/* Service Data Detail Page */}
      <ServiceDataDetailPage
        isOpen={showDataDetailPage}
        onClose={() => setShowDataDetailPage(false)}
        service={selectedService}
      />


      {/* Error Detail Modal */}
      {showErrorDetailModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-[16px] font-medium text-slate-950">
                  Chi tiết kiểm tra cấu trúc - {selectedService.statusText}
                </h3>
                <p className="text-[13px] mt-0.5 text-slate-600">
                  Dịch vụ: {selectedService.name} ({selectedService.code})
                </p>
              </div>
              <button
                onClick={() => setShowErrorDetailModal(false)}
                className={BTN_GHOST_ICON}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-5">
                {/* Summary */}
                <div>
                  <h4 className="text-[14px] font-medium text-slate-950 mb-3">Tổng quan</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-[16px] text-slate-500 mb-1">Tổng số bản ghi</div>
                      <div className="text-[16px] font-semibold text-slate-900">
                        {selectedService.validationDetails.totalRecords.toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-[16px] text-slate-500 mb-1">Bản ghi hợp lệ</div>
                      <div className="text-[16px] font-semibold text-green-600">
                        {selectedService.validationDetails.validRecords.toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-[16px] text-slate-500 mb-1">Bản ghi lỗi</div>
                      <div className="text-[16px] font-semibold text-red-600">
                        {selectedService.validationDetails.invalidRecords.toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Details */}
                {selectedService.validationDetails.errors && selectedService.validationDetails.errors.length > 0 && (
                  <div>
                    <h4 className="text-[14px] font-medium text-slate-950 mb-3">Chi tiết lỗi</h4>
                    <div className="space-y-3">
                      {selectedService.validationDetails.errors.map((error: any, index: number) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="font-medium text-slate-950 text-[13px]">{error.field}</h5>
                              <p className="text-[13px] text-slate-600 mt-0.5">{error.message}</p>
                            </div>
                            <StatusTag label={`${error.count} lỗi`} variant="red" />
                          </div>
                          {error.examples && (
                            <div className="mb-3">
                              <div className="text-[13px] text-slate-500 mb-1.5">Ví dụ:</div>
                              <div className="flex flex-wrap gap-2">
                                {error.examples.map((example: string, idx: number) => (
                                  <code key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[13px] font-mono">
                                    {example}
                                  </code>
                                ))}
                              </div>
                            </div>
                          )}
                          {error.expectedFormat && (
                            <div className="text-[13px] text-slate-600 bg-slate-50 px-3 py-2 rounded">
                              <span className="font-medium text-slate-700">Định dạng mong đợi:</span> {error.expectedFormat}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error Info */}
                {selectedService.errorDetails && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-red-100 rounded-lg flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-red-900 text-[13px] mb-1">
                          {selectedService.errorDetails.errorCode}: {selectedService.errorDetails.errorMessage}
                        </h5>
                        <p className="text-[13px] text-red-700 mb-2">
                          {selectedService.errorDetails.errorDescription}
                        </p>
                        <div className="text-[13px] text-red-600">
                          Số lần thử: {selectedService.errorDetails.attemptCount} | Lần thử cuối: {selectedService.errorDetails.lastAttempt}
                        </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50">
              <button
                onClick={() => setShowErrorDetailModal(false)}
                className={BTN_OUTLINE}
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  sendNotificationToSource(selectedService);
                  setShowErrorDetailModal(false);
                }}
                className={BTN_PRIMARY}
              >
                Gửi thông báo hệ thống nguồn
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Inactive Confirmation Modal */}
      {showInactiveModal && (
        <Portal>
          <div 
            className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200"
            style={{ zIndex: 100 }}
          >
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur-md">
                <h3 className="text-[16px] font-medium text-slate-950 flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Power className="w-5 h-5 text-amber-600" />
                  </div>
                  Ngừng hoạt động
                </h3>
                <button onClick={() => setShowInactiveModal(false)} className={BTN_GHOST_ICON}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="bg-red-50 border border-red-100 p-5 rounded-lg flex gap-4 shadow-inner">
                  <div className="p-2 bg-red-100 rounded-full h-fit">
                    <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                  </div>
                  <div>
                    <div className="text-md font-medium text-red-900 mb-1">Cảnh báo gián đoạn dữ liệu</div>
                    <p className="text-[13px] text-red-800/80 leading-relaxed font-medium">
                      Bạn có chắc muốn ngừng hoạt động của dịch vụ <span className="font-medium text-red-900">{selectedService?.name}</span>? Hành động này sẽ khiến luồng dữ liệu bị gián đoạn cho đến khi được kích hoạt lại thủ công.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[13px] font-medium text-slate-700 ml-1">
                    Lý do ngừng hoạt động <span className="text-red-500 font-black">*</span>
                  </label>
                  <textarea
                    className="w-full px-5 py-4 border border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 min-h-[140px] text-[13px] bg-slate-50/30 outline-none transition-all placeholder:text-slate-400 resize-none"
                    placeholder="Vui lòng nhập lý do cụ thể (ví dụ: Thay đổi cấu hình Máy chủ thực thi, bảo trì định kỳ hệ thống nguồn...)"
                    value={inactiveReason}
                    onChange={(e) => setInactiveReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
                <button
                  onClick={() => setShowInactiveModal(false)}
                  className={BTN_OUTLINE}
                >
                  Hủy bỏ
                </button>
                <button
                  disabled={!inactiveReason.trim()}
                  onClick={() => {
                    alert(`Đã yêu cầu ngừng hoạt động dịch vụ: ${selectedService?.name}.\nLý do: ${inactiveReason}`);
                    setShowInactiveModal(false);
                    setInactiveReason('');
                  }}
                  className={BTN_PRIMARY}
                >
                  Xác nhận ngừng
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
    </div>
  );
}