import React, { useMemo, useState, type ReactNode } from 'react';
import { FileText, Search, Share, Plus, Filter, Download, XCircle, UploadCloud, CheckCircle, Send, Settings, Eye, Edit, Globe, X, Clock, Calendar, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import { Badge, TruncatedText, RowIconAction, Pagination, tabClass, BTN_PRIMARY, ROW_ICON_BTN, MENU_ITEM, TOOLTIP_CLS, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, DATE_BOX_CLS, normalizeSearch } from '../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;
import { ProvisionDataRequestModal, CreateDataRequestPayload } from './modals/ProvisionDataRequestModal';
import { ProvisionRequestApprovalModal } from './modals/ProvisionRequestApprovalModal';
import { ProvisionRequestExportModal } from './modals/ProvisionRequestExportModal';
import { ProvisionRequestHandoverModal } from './modals/ProvisionRequestHandoverModal';
import { ProvisionServicePublishModal } from './modals/ProvisionServicePublishModal';
import { ProvisionServiceUnpublishModal } from './modals/ProvisionServiceUnpublishModal';
import { ProvisionHandoverDetailModal } from './modals/ProvisionHandoverDetailModal';
import { ProvisionPublishDetailModal } from './modals/ProvisionPublishDetailModal';

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

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '';
  if (/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(dateStr)) return dateStr;
  const spaceSplit = dateStr.split(' ');
  if (spaceSplit.length === 2) {
    const [dStr, tStr] = spaceSplit;
    const dParts = dStr.split('-');
    if (dParts.length === 3) {
      return `${dParts[2]}/${dParts[1]}/${dParts[0]} ${tStr}`;
    }
  }
  const parts = dateStr.split('-');
  if (parts.length === 3 && !dateStr.includes('T') && !dateStr.includes(' ')) {
    return `${parts[2]}/${parts[1]}/${parts[0]} 08:00:00`;
  }
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      return `${day}/${month}/${year} ${h}:${m}:${s}`;
    }
  } catch (e) {}
  return dateStr;
};

type ActiveTab = 'tiep_nhan' | 'tra_cuu' | 'tao_dich_vu' | 'ban_giao';
type RequestStatus = 'CHO_XU_LY' | 'DA_PHE_DUYET' | 'TU_CHOI' | 'DA_XUAT' | 'DA_BAN_GIAO' | 'DA_CONG_KHAI' | 'HUY_CONG_KHAI';

type DataRequest = {
  id: string;
  org: string;
  requestContent?: string;
  attachment?: File | null;
  dataType: string;
  purpose: string;
  requestDate: string;
  fromDate?: string;
  toDate?: string;
  format: 'excel' | 'csv' | 'json' | 'xml';
  status: RequestStatus;
  rejectReason?: string;
  handoverDetails?: any;
  publishDetails?: any;
};

const statusLabel: Record<RequestStatus, string> = {
  CHO_XU_LY: 'Chờ xử lý',
  DA_PHE_DUYET: 'Đã phê duyệt',
  TU_CHOI: 'Từ chối',
  DA_XUAT: 'Đã kết xuất',
  DA_BAN_GIAO: 'Đã bàn giao',
  DA_CONG_KHAI: 'Đã công khai',
  HUY_CONG_KHAI: 'Đã hủy công khai',
};

export function DataProvisionRequestPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tiep_nhan');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DataRequest | null>(null);

  const [query, setQuery] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | RequestStatus>('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock đủ mọi trạng thái để thử cột Thao tác (PM 07/10/2026): Chờ xử lý, Đã phê duyệt, Từ chối, Đã kết xuất,
  // Đã bàn giao, Đã công khai, Đã hủy công khai — mỗi bản ghi có đủ nội dung, khoảng thời gian, định dạng và chi tiết theo trạng thái
  const [requests, setRequests] = useState<DataRequest[]>([
    {
      id: 'YC-2026-0429',
      org: 'Sở Nội vụ Lạng Sơn',
      requestContent: 'Đề nghị cung cấp số liệu đăng ký khai sinh, khai tử, kết hôn năm 2025 theo từng huyện để phục vụ báo cáo biến động dân số.',
      dataType: 'Dữ liệu Hộ tịch điện tử',
      purpose: 'Thống kê tình hình biến động hộ tịch',
      requestDate: '2026-04-29 08:00:00',
      fromDate: '2025-01-01',
      toDate: '2025-12-31',
      format: 'excel',
      status: 'CHO_XU_LY',
    },
    {
      id: 'YC-2026-0602',
      org: 'Sở Y tế Bắc Ninh',
      requestContent: 'Cung cấp danh sách trẻ em được đăng ký khai sinh 6 tháng đầu năm 2026 để lập kế hoạch tiêm chủng mở rộng.',
      dataType: 'Dữ liệu Hộ tịch điện tử',
      purpose: 'Lập kế hoạch tiêm chủng mở rộng',
      requestDate: '2026-06-02 09:15:00',
      fromDate: '2026-01-01',
      toDate: '2026-06-30',
      format: 'csv',
      status: 'CHO_XU_LY',
    },
    {
      id: 'YC-2026-0518',
      org: 'Sở Tư pháp Lạng Sơn',
      requestContent: 'Đề nghị cung cấp thông tin án tích của các cá nhân trong danh sách đính kèm phục vụ cấp phiếu lý lịch tư pháp.',
      dataType: 'Dữ liệu Lý lịch tư pháp',
      purpose: 'Tra cứu thông tin án tích',
      requestDate: '2026-05-18 08:00:00',
      fromDate: '2020-01-01',
      toDate: '2026-05-01',
      format: 'json',
      status: 'DA_PHE_DUYET',
    },
    {
      id: 'YC-2026-0611',
      org: 'Cục Thống kê tỉnh Bắc Giang',
      requestContent: 'Cung cấp số liệu tổng hợp hồ sơ thi hành án dân sự đã giải quyết theo quý năm 2025.',
      dataType: 'Dữ liệu Thi hành án',
      purpose: 'Tổng hợp số liệu thống kê ngành',
      requestDate: '2026-06-11 14:30:00',
      fromDate: '2025-01-01',
      toDate: '2025-12-31',
      format: 'xml',
      status: 'DA_PHE_DUYET',
    },
    {
      id: 'YC-2026-0315',
      org: 'Công an Lạng Sơn',
      requestContent: 'Đồng bộ danh sách đối tượng phải thi hành án đang theo dõi trên địa bàn tỉnh.',
      dataType: 'Dữ liệu Thi hành án',
      purpose: 'Đồng bộ danh sách đối tượng theo dõi',
      requestDate: '2026-03-15 08:00:00',
      fromDate: '2025-07-01',
      toDate: '2026-03-01',
      format: 'csv',
      status: 'DA_XUAT',
    },
    {
      id: 'YC-2026-0407',
      org: 'Sở Lao động - Thương binh và Xã hội Hà Nam',
      requestContent: 'Cung cấp dữ liệu đăng ký kết hôn có yếu tố nước ngoài giai đoạn 2023 - 2025.',
      dataType: 'Dữ liệu Hộ tịch điện tử',
      purpose: 'Rà soát chính sách hỗ trợ phụ nữ kết hôn với người nước ngoài',
      requestDate: '2026-04-07 10:20:00',
      fromDate: '2023-01-01',
      toDate: '2025-12-31',
      format: 'excel',
      status: 'TU_CHOI',
      rejectReason: 'Phạm vi dữ liệu chứa thông tin cá nhân nhạy cảm, đề nghị bổ sung văn bản đồng ý của chủ thể dữ liệu.',
    },
    {
      id: 'YC-2026-0220',
      org: 'UBND huyện Văn Lãng',
      requestContent: 'Cung cấp danh sách tổ chức đấu giá tài sản đang hoạt động trên địa bàn tỉnh.',
      dataType: 'Dữ liệu Đấu giá tài sản',
      purpose: 'Lựa chọn tổ chức đấu giá quyền sử dụng đất',
      requestDate: '2026-02-20 15:45:00',
      fromDate: '2026-01-01',
      toDate: '2026-02-15',
      format: 'excel',
      status: 'DA_BAN_GIAO',
      handoverDetails: { receivingUnit: 'UBND huyện Văn Lãng', receiverName: 'Nguyễn Thị Hoa', file: null, date: '2026-02-27T09:30:00' },
    },
    {
      id: 'YC-2026-0112',
      org: 'Sở Kế hoạch và Đầu tư Lạng Sơn',
      requestContent: 'Công khai số liệu tổng hợp đăng ký khai sinh theo tháng năm 2025 trên cổng dữ liệu mở.',
      dataType: 'Dữ liệu Hộ tịch điện tử',
      purpose: 'Công khai dữ liệu mở phục vụ nghiên cứu',
      requestDate: '2026-01-12 08:30:00',
      fromDate: '2025-01-01',
      toDate: '2025-12-31',
      format: 'csv',
      status: 'DA_CONG_KHAI',
      publishDetails: { platforms: ['national', 'lgsp'], reason: 'Dữ liệu tổng hợp, không chứa thông tin cá nhân.', publishDate: '2026-01-20T10:00:00' },
    },
    {
      id: 'YC-2025-1203',
      org: 'Trường Đại học Luật Hà Nội',
      requestContent: 'Công khai bộ dữ liệu thống kê văn bản quy phạm pháp luật được ban hành năm 2024.',
      dataType: 'Dữ liệu Văn bản pháp luật',
      purpose: 'Phục vụ nghiên cứu khoa học',
      requestDate: '2025-12-03 13:00:00',
      fromDate: '2024-01-01',
      toDate: '2024-12-31',
      format: 'json',
      status: 'HUY_CONG_KHAI',
      publishDetails: {
        platforms: ['national'],
        reason: 'Dữ liệu thống kê phục vụ nghiên cứu.',
        publishDate: '2025-12-10T08:00:00',
        unpublishReason: 'Phát hiện sai lệch số liệu tháng 11, tạm hủy công khai để rà soát.',
        unpublishDate: '2026-01-05T16:20:00',
      },
    },
  ]);

  // Điều kiện đã áp dụng: chỉ cập nhật khi bấm nút Tìm kiếm hoặc Enter (mục 5.19)
  const [applied, setApplied] = useState({ query: '', filterStatus: 'ALL' as 'ALL' | RequestStatus, filterType: 'ALL', filterFromDate: '', filterToDate: '' });

  const runSearch = () => {
    setApplied({ query, filterStatus, filterType, filterFromDate, filterToDate });
    setCurrentPage(1);
  };

  const filteredRequests = useMemo(() => {
    const { query, filterStatus, filterType, filterFromDate, filterToDate } = applied;
    return requests.filter((item) => {
      const q = normalizeSearch(query);
      const keywordOk =
        !q ||
        normalizeSearch(item.id).includes(q) ||
        normalizeSearch(item.org).includes(q) ||
        normalizeSearch(item.dataType).includes(q);
      const statusOk = filterStatus === 'ALL' || item.status === filterStatus;
      const typeOk = filterType === 'ALL' || item.dataType === filterType;
      const fromOk = !filterFromDate || item.requestDate >= filterFromDate;
      const toOk = !filterToDate || item.requestDate <= filterToDate;
      return keywordOk && statusOk && typeOk && fromOk && toOk;
    });
  }, [requests, applied]);

  const paginatedRequests = useMemo(() => {
    return filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

  const dataTypeOptions = useMemo(() => ['ALL', ...Array.from(new Set(requests.map((item) => item.dataType)))], [requests]);

  const handleApprove = (id: string) => {
    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'DA_PHE_DUYET' } : item)));
  };

  const handleReject = (id: string, reason: string) => {
    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'TU_CHOI', rejectReason: reason } : item)));
  };

  const handleCreateRequest = (payload: CreateDataRequestPayload) => {
    if (selectedRequest) {
      setRequests((prev) => prev.map((item) => (item.id === selectedRequest.id ? { ...item, org: payload.org, requestContent: payload.requestContent, attachment: payload.attachment, dataType: payload.dataType, purpose: payload.purpose || 'Bổ sung theo yêu cầu', fromDate: payload.fromDate, toDate: payload.toDate, format: payload.format } : item)));
    } else {
      const newItem: DataRequest = {
        id: `YC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
        org: payload.org,
        requestContent: payload.requestContent,
        attachment: payload.attachment,
        dataType: payload.dataType,
        purpose: payload.purpose || 'Bổ sung theo yêu cầu',
        requestDate: formatDateTime(new Date().toISOString()),
        fromDate: payload.fromDate,
        toDate: payload.toDate,
        format: payload.format,
        status: 'CHO_XU_LY',
      };
      setRequests((prev) => [newItem, ...prev]);
    }
    setActiveTab('tiep_nhan');
    setSelectedRequest(null);
  };

  const handleExportClick = (item: DataRequest) => {
    setSelectedRequest(item);
    setShowExportModal(true);
  };

  const handleConfirmExport = (id: string) => {
    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'DA_XUAT' } : item)));
  };

  const [showViewRequestModal, setShowViewRequestModal] = useState(false);
  const [showHandoverDetailModal, setShowHandoverDetailModal] = useState(false);
  const [showPublishDetailModal, setShowPublishDetailModal] = useState(false);

  const handleHandoverClick = (item: DataRequest) => {
    setSelectedRequest(item);
    setShowHandoverModal(true);
  };

  const handleConfirmHandover = (id: string, receivingUnit: string, file: File | null) => {
    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'DA_BAN_GIAO', handoverDetails: { receivingUnit, file, date: new Date().toISOString() } } : item)));
  };

  const handlePublishClick = (item: DataRequest) => {
    setSelectedRequest(item);
    setShowPublishModal(true);
  };

  const handleConfirmPublish = (id: string, platforms: string[], reason: string) => {
    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'DA_CONG_KHAI', publishDetails: { platforms, reason, publishDate: new Date().toISOString() } } : item)));
  };

  const handleUnpublishClick = (item: DataRequest) => {
    setSelectedRequest(item);
    setShowUnpublishModal(true);
  };

  const handleConfirmUnpublish = (id: string, unpublishReason: string) => {
    setRequests((prev) => prev.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: 'HUY_CONG_KHAI',
          publishDetails: { ...item.publishDetails, unpublishReason, unpublishDate: new Date().toISOString() }
        };
      }
      return item;
    }));
  };

  const handleViewRequest = (item: DataRequest) => {
    setSelectedRequest(item);
    setShowViewRequestModal(true);
  };

  const handleViewHandoverDetail = (item: DataRequest) => {
    setSelectedRequest(item);
    setShowHandoverDetailModal(true);
  };

  const handleViewPublishDetail = (item: DataRequest) => {
    setSelectedRequest(item);
    setShowPublishDetailModal(true);
  };

  // Tông badge trạng thái (mục 5.8) — giữ ý nghĩa màu cũ
  const statusBadgeVariant: Record<RequestStatus, string> = {
    CHO_XU_LY: 'amber',
    DA_PHE_DUYET: 'blue',
    TU_CHOI: 'red',
    DA_XUAT: 'orange',
    DA_BAN_GIAO: 'indigo',
    DA_CONG_KHAI: 'green',
    HUY_CONG_KHAI: 'slate',
  };

  // Thẻ thống kê theo từng tab (thay cho phần mô tả tiêu đề) — mục 5.6.1
  const cnt = (s: RequestStatus) => requests.filter((r) => r.status === s).length;
  const totalCard = { label: 'Tổng yêu cầu', value: requests.length, Icon: FileText, box: 'bg-blue-50', icon: 'text-blue-600' };
  const statCards =
    activeTab === 'tra_cuu'
      ? [
          totalCard,
          { label: statusLabel.CHO_XU_LY, value: cnt('CHO_XU_LY'), Icon: Clock, box: 'bg-amber-50', icon: 'text-amber-600' },
          { label: statusLabel.DA_PHE_DUYET, value: cnt('DA_PHE_DUYET'), Icon: CheckCircle, box: 'bg-blue-50', icon: 'text-blue-600' },
          { label: statusLabel.DA_XUAT, value: cnt('DA_XUAT'), Icon: Download, box: 'bg-orange-50', icon: 'text-orange-600' },
        ]
      : activeTab === 'ban_giao'
      ? [
          totalCard,
          { label: statusLabel.DA_XUAT, value: cnt('DA_XUAT'), Icon: Download, box: 'bg-orange-50', icon: 'text-orange-600' },
          { label: statusLabel.DA_BAN_GIAO, value: cnt('DA_BAN_GIAO'), Icon: Send, box: 'bg-indigo-50', icon: 'text-indigo-600' },
          { label: statusLabel.DA_CONG_KHAI, value: cnt('DA_CONG_KHAI'), Icon: Globe, box: 'bg-green-50', icon: 'text-green-600' },
        ]
      : [
          totalCard,
          { label: statusLabel.CHO_XU_LY, value: cnt('CHO_XU_LY'), Icon: Clock, box: 'bg-amber-50', icon: 'text-amber-600' },
          { label: statusLabel.DA_PHE_DUYET, value: cnt('DA_PHE_DUYET'), Icon: CheckCircle, box: 'bg-green-50', icon: 'text-green-600' },
          { label: statusLabel.TU_CHOI, value: cnt('TU_CHOI'), Icon: XCircle, box: 'bg-red-50', icon: 'text-red-600' },
        ];

  const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
  const TD = 'px-3 py-1 text-[13px] text-black';

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] min-h-screen animate-in fade-in duration-300">

        {/* Navigation Tabs (mục 5.9) */}
        <div className="bg-white border-b border-[#E2E8F0] px-6">
          <div className="flex">
            <button type="button" onClick={() => { setActiveTab('tiep_nhan'); setCurrentPage(1); }} className={`${tabClass(activeTab === 'tiep_nhan')} whitespace-nowrap`}>
              <FileText className="w-4 h-4" />
              Tiếp nhận yêu cầu ({requests.length})
            </button>
            <button type="button" onClick={() => { setActiveTab('tra_cuu'); setCurrentPage(1); }} className={`${tabClass(activeTab === 'tra_cuu')} whitespace-nowrap`}>
              <Search className="w-4 h-4" />
              Tra cứu & Kết xuất ({requests.filter(r => r.status === 'CHO_XU_LY' || r.status === 'DA_PHE_DUYET' || r.status === 'DA_XUAT').length})
            </button>
            <button type="button" onClick={() => { setActiveTab('ban_giao'); setCurrentPage(1); }} className={`${tabClass(activeTab === 'ban_giao')} whitespace-nowrap`}>
              <Share className="w-4 h-4" />
              Bàn giao dữ liệu ({requests.filter(r => r.status === 'DA_XUAT' || r.status === 'DA_BAN_GIAO' || r.status === 'DA_CONG_KHAI' || r.status === 'HUY_CONG_KHAI').length})
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">

            {/* Statistic cards (mục 5.6.1, đổi theo từng tab) */}
            <div className="grid grid-cols-4 gap-4">
              {statCards.map(({ label, value, Icon, box, icon }, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${box}`}>
                      <Icon className={`w-5 h-5 ${icon}`} />
                    </div>
                    <div>
                      <div className="text-[16px] text-[#64748B]">{label}</div>
                      <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters and Actions (mục 5.19) */}
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      aria-label="Tìm kiếm yêu cầu"
                      placeholder="Tìm theo mã YC, cơ quan, loại dữ liệu..."
                      className={SEARCH_INPUT_CLS}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
                    />
                  </div>
                  <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Bộ lọc"
                    aria-expanded={showAdvancedFilter}
                    onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                    className={filterBtnClass(showAdvancedFilter)}
                    title="Bộ lọc"
                  >
                    {showAdvancedFilter ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => setShowRequestModal(true)} className={`${BTN_PRIMARY} whitespace-nowrap`} title="Tạo yêu cầu">
                    <Plus className="w-4 h-4" />
                    Tạo yêu cầu
                  </button>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showAdvancedFilter && (
                <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
                  <div>
                    <label className={FILTER_LABEL}>Trạng thái yêu cầu</label>
                    <select
                      aria-label="Trạng thái yêu cầu"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as 'ALL' | RequestStatus)}
                      className={`${INPUT_CLS} cursor-pointer`}
                    >
                      <option value="ALL">Tất cả trạng thái</option>
                      <option value="CHO_XU_LY">Chờ xử lý</option>
                      <option value="DA_PHE_DUYET">Đã phê duyệt</option>
                      <option value="TU_CHOI">Từ chối</option>
                      <option value="DA_XUAT">Đã kết xuất</option>
                      <option value="DA_BAN_GIAO">Đã bàn giao</option>
                      <option value="DA_CONG_KHAI">Đã công khai</option>
                      <option value="HUY_CONG_KHAI">Đã hủy công khai</option>
                    </select>
                  </div>
                  <div>
                    <label className={FILTER_LABEL}>Loại dữ liệu</label>
                    <select
                      aria-label="Loại dữ liệu"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className={`${INPUT_CLS} cursor-pointer`}
                    >
                      {dataTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type === 'ALL' ? 'Tất cả loại dữ liệu' : type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={FILTER_LABEL}>Từ ngày</label>
                    <div className={DATE_BOX_CLS}>
                      <input
                        type="date"
                        aria-label="Từ ngày"
                        value={filterFromDate}
                        onChange={(e) => setFilterFromDate(e.target.value)}
                        className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-[#020817] p-0 cursor-pointer"
                      />
                      <Calendar className="w-4 h-4 text-[#475569] shrink-0" />
                    </div>
                  </div>
                  <div>
                    <label className={FILTER_LABEL}>Đến ngày</label>
                    <div className={DATE_BOX_CLS}>
                      <input
                        type="date"
                        aria-label="Đến ngày"
                        value={filterToDate}
                        onChange={(e) => setFilterToDate(e.target.value)}
                        className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-[#020817] p-0 cursor-pointer"
                      />
                      <Calendar className="w-4 h-4 text-[#475569] shrink-0" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Table (mục 5.3) */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse collection-table text-[13px]">
                  <thead className="bg-[#F8FAFC]">
                    <tr className="h-[42px]">
                      <th className={`${TH} text-left`}>Mã YC</th>
                      <th className={`${TH} text-left`}>Đơn vị đề nghị</th>
                      <th className={`${TH} text-left`}>Nguồn CSDL yêu cầu</th>
                      <th className={`${TH} text-left`}>Mục đích khai thác</th>
                      <th className={`${TH} text-left`}>Ngày gửi</th>
                      <th className={`${TH} text-left`}>Trạng thái</th>
                      <th className={`${TH} text-center sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRequests.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-[13px] text-[#64748B]">
                          Không tìm thấy yêu cầu nào.
                        </td>
                      </tr>
                    ) : (
                      paginatedRequests.map((item) => {
                        const [sentDate, sentTime] = formatDateTime(item.requestDate).split(' ');
                        const editReason = item.status === 'DA_XUAT' || item.status === 'DA_PHE_DUYET' ? 'Yêu cầu đã phê duyệt hoặc đã kết xuất' : undefined;
                        const handoverReason = item.status !== 'DA_XUAT' ? 'Chỉ áp dụng cho yêu cầu Đã kết xuất' : undefined;
                        const hasPublishDetail = item.status === 'DA_CONG_KHAI' || item.status === 'HUY_CONG_KHAI';
                        return (
                        <tr key={item.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                          <td className={`${TD} text-left whitespace-nowrap`}>{item.id}</td>
                          <td className={`${TD} text-left max-w-[240px]`}>
                            <TruncatedText text={item.org} />
                          </td>
                          <td className={`${TD} text-left max-w-[240px]`}>
                            <TruncatedText text={item.dataType} />
                          </td>
                          <td className={`${TD} text-left max-w-[280px]`}>
                            <TruncatedText text={item.purpose} />
                          </td>
                          <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                            <div>{sentDate}</div>
                            {sentTime && <div className="text-[#64748B]">{sentTime}</div>}
                          </td>
                          <td className={`${TD} text-left`}>
                            <Badge label={statusLabel[item.status]} variant={statusBadgeVariant[item.status]} />
                          </td>
                          <td className="px-3 py-1 text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]">
                            {/* Cột thao tác (mục 5.3.2) */}
                            <div className="inline-flex items-center justify-center gap-1 flex-nowrap">
                              {/* TIEP_NHAN: Edit chỉ cho CHO_XU_LY, Eye cho tất cả trạng thái */}
                              {activeTab === 'tiep_nhan' && (
                                <>
                                  <RowIconAction label="Xem chi tiết" onClick={() => handleViewRequest(item)}>
                                    <Eye className="w-4 h-4" />
                                  </RowIconAction>
                                  <RowIconAction
                                    label="Chỉnh sửa"
                                    disabledReason={editReason}
                                    onClick={() => { setSelectedRequest(item); setShowRequestModal(true); }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </RowIconAction>
                                </>
                              )}
                              {/* TRA_CUU tab: luôn đủ 3 nút (PM 07/10/2026) — nút không áp dụng bị khóa kèm lý do (5.3.2)
                                  Chờ xử lý: Xem + Tiếp nhận & phê duyệt; Đã phê duyệt (và Đã xuất như trước): Xem + Thiết lập kết xuất;
                                  Đã bàn giao / Đã công khai / Hủy công khai / Từ chối: chỉ Xem */}
                              {activeTab === 'tra_cuu' && (
                                <>
                                  <RowIconAction label="Xem chi tiết" onClick={() => handleViewRequest(item)}>
                                    <Eye className="w-4 h-4" />
                                  </RowIconAction>
                                  <RowIconAction
                                    label="Tiếp nhận & phê duyệt"
                                    disabledReason={item.status === 'CHO_XU_LY' ? undefined : 'Chỉ phê duyệt yêu cầu ở trạng thái Chờ xử lý'}
                                    onClick={() => { setSelectedRequest(item); setShowApprovalModal(true); }}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </RowIconAction>
                                  <RowIconAction
                                    label="Thiết lập kết xuất"
                                    disabledReason={item.status === 'DA_PHE_DUYET' || item.status === 'DA_XUAT' ? undefined : 'Chỉ thiết lập kết xuất khi yêu cầu đã được phê duyệt'}
                                    onClick={() => handleExportClick(item)}
                                  >
                                    <Settings className="w-4 h-4" />
                                  </RowIconAction>
                                </>
                              )}
                              {/* BAN_GIAO tab: luôn hiện đủ 4 nút (PM 07/10/2026) — Xem chi tiết, Hủy công khai, Công khai, Bàn giao dữ liệu;
                                  nút không áp dụng bị khóa kèm lý do (5.3.2) */}
                              {activeTab === 'ban_giao' && (
                                <>
                                  <RowIconAction
                                    label="Xem chi tiết"
                                    onClick={() => {
                                      if (item.status === 'DA_BAN_GIAO') handleViewHandoverDetail(item);
                                      else if (hasPublishDetail) handleViewPublishDetail(item);
                                      else handleViewRequest(item);
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </RowIconAction>
                                  <RowIconAction
                                    label="Hủy công khai"
                                    disabledReason={item.status === 'DA_CONG_KHAI' ? undefined : 'Chỉ áp dụng cho yêu cầu Đã công khai'}
                                    onClick={() => handleUnpublishClick(item)}
                                  >
                                    <XCircle className={`w-4 h-4 ${item.status === 'DA_CONG_KHAI' ? 'text-[#DC2626]' : ''}`} />
                                  </RowIconAction>
                                  <RowIconAction label="Công khai" disabledReason={handoverReason} onClick={() => handlePublishClick(item)}>
                                    <Globe className="w-4 h-4" />
                                  </RowIconAction>
                                  <RowIconAction label="Bàn giao dữ liệu" disabledReason={handoverReason} onClick={() => handleHandoverClick(item)}>
                                    <Send className="w-4 h-4" />
                                  </RowIconAction>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination
                className="border-t border-[#E2E8F0]"
                currentPage={currentPage}
                totalItems={filteredRequests.length}
                pageSize={itemsPerPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={setItemsPerPage}
              />
            </div>

          </div>
        </div>

      <ProvisionDataRequestModal isOpen={showRequestModal} onClose={() => { setShowRequestModal(false); setSelectedRequest(null); }} onCreate={handleCreateRequest} requestData={selectedRequest} />
      <ProvisionDataRequestModal viewOnly isOpen={showViewRequestModal} onClose={() => { setShowViewRequestModal(false); setSelectedRequest(null); }} requestData={selectedRequest} />
      <ProvisionRequestApprovalModal isOpen={showApprovalModal} onClose={() => setShowApprovalModal(false)} requestData={selectedRequest} onApprove={handleApprove} onReject={handleReject} />
      <ProvisionRequestExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} requestData={selectedRequest} onConfirmExport={handleConfirmExport} />
      <ProvisionRequestHandoverModal isOpen={showHandoverModal} onClose={() => setShowHandoverModal(false)} requestData={selectedRequest} onConfirmHandover={handleConfirmHandover} />
      <ProvisionServicePublishModal isOpen={showPublishModal} onClose={() => setShowPublishModal(false)} requestData={selectedRequest} onConfirmPublish={handleConfirmPublish} />
      <ProvisionServiceUnpublishModal isOpen={showUnpublishModal} onClose={() => setShowUnpublishModal(false)} requestData={selectedRequest} onConfirmUnpublish={handleConfirmUnpublish} />
      <ProvisionHandoverDetailModal isOpen={showHandoverDetailModal} onClose={() => setShowHandoverDetailModal(false)} requestData={selectedRequest} />
      <ProvisionPublishDetailModal isOpen={showPublishDetailModal} onClose={() => setShowPublishDetailModal(false)} requestData={selectedRequest} />
    </div>
  );
}
