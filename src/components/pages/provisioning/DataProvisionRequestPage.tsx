import React, { useMemo, useState } from 'react';
import { FileText, Search, Share, Plus, Filter, Download, XCircle, UploadCloud, CheckCircle, Send, Settings, Eye, Edit, Globe, X, Clock } from 'lucide-react';
import { ProvisionDataRequestModal, CreateDataRequestPayload } from './modals/ProvisionDataRequestModal';
import { ProvisionRequestApprovalModal } from './modals/ProvisionRequestApprovalModal';
import { ProvisionRequestExportModal } from './modals/ProvisionRequestExportModal';
import { ProvisionRequestHandoverModal } from './modals/ProvisionRequestHandoverModal';
import { ProvisionServicePublishModal } from './modals/ProvisionServicePublishModal';
import { ProvisionServiceUnpublishModal } from './modals/ProvisionServiceUnpublishModal';
import { ProvisionHandoverDetailModal } from './modals/ProvisionHandoverDetailModal';
import { ProvisionPublishDetailModal } from './modals/ProvisionPublishDetailModal';

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

  const [requests, setRequests] = useState<DataRequest[]>([
    {
      id: 'YC-2026-0429',
      org: 'Sở Nội vụ Lạng Sơn',
      dataType: 'Dữ liệu Hộ tịch điện tử',
      purpose: 'Thống kê tình hình biến động hộ tịch',
      requestDate: '2026-04-29 08:00:00',
      format: 'excel',
      status: 'CHO_XU_LY',
    },
    {
      id: 'YC-2026-0315',
      org: 'Công an Lạng Sơn',
      dataType: 'Dữ liệu Thi hành án',
      purpose: 'Đồng bộ danh sách đối tượng theo dõi',
      requestDate: '2026-03-15 08:00:00',
      format: 'csv',
      status: 'DA_XUAT',
    },
    {
      id: 'YC-2026-0518',
      org: 'Sở Tư pháp Lạng Sơn',
      dataType: 'Dữ liệu Lý lịch tư pháp',
      purpose: 'Tra cứu thông tin án tích',
      requestDate: '2026-05-18 08:00:00',
      format: 'json',
      status: 'DA_PHE_DUYET',
    },
  ]);

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const q = query.trim().toLowerCase();
      const keywordOk =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.org.toLowerCase().includes(q) ||
        item.dataType.toLowerCase().includes(q);
      const statusOk = filterStatus === 'ALL' || item.status === filterStatus;
      const typeOk = filterType === 'ALL' || item.dataType === filterType;
      const fromOk = !filterFromDate || item.requestDate >= filterFromDate;
      const toOk = !filterToDate || item.requestDate <= filterToDate;
      return keywordOk && statusOk && typeOk && fromOk && toOk;
    });
  }, [requests, query, filterStatus, filterType, filterFromDate, filterToDate]);

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

  const statusBadgeStyle: Record<RequestStatus, string> = {
    CHO_XU_LY: 'bg-amber-50 text-amber-700 border border-amber-200',
    DA_PHE_DUYET: 'bg-blue-50 text-blue-700 border border-blue-200',
    TU_CHOI: 'bg-red-50 text-red-700 border border-red-200',
    DA_XUAT: 'bg-orange-50 text-orange-700 border border-orange-200',
    DA_BAN_GIAO: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    DA_CONG_KHAI: 'bg-green-50 text-green-700 border border-green-200',
    HUY_CONG_KHAI: 'bg-slate-50 text-slate-500 border border-slate-200',
  };

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    return (
      <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 collection-pagination text-[13px]">
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Hiển thị</span>
          <select aria-label="Select record count" 
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[13px]"
            title="Số bản ghi trên trang"
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
            {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
            >
              Trước
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              disabled={currentPage === totalPages || totalItems === 0}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Thẻ thống kê theo từng tab (thay cho phần mô tả tiêu đề)
  const cnt = (s: RequestStatus) => requests.filter((r) => r.status === s).length;
  const totalCard = { label: 'Tổng yêu cầu', value: requests.length, Icon: FileText, box: 'bg-blue-50 text-blue-600' };
  const statCards =
    activeTab === 'tra_cuu'
      ? [
          totalCard,
          { label: statusLabel.CHO_XU_LY, value: cnt('CHO_XU_LY'), Icon: Clock, box: 'bg-amber-50 text-amber-600' },
          { label: statusLabel.DA_PHE_DUYET, value: cnt('DA_PHE_DUYET'), Icon: CheckCircle, box: 'bg-blue-50 text-blue-600' },
          { label: statusLabel.DA_XUAT, value: cnt('DA_XUAT'), Icon: Download, box: 'bg-orange-50 text-orange-600' },
        ]
      : activeTab === 'ban_giao'
      ? [
          totalCard,
          { label: statusLabel.DA_XUAT, value: cnt('DA_XUAT'), Icon: Download, box: 'bg-orange-50 text-orange-600' },
          { label: statusLabel.DA_BAN_GIAO, value: cnt('DA_BAN_GIAO'), Icon: Send, box: 'bg-indigo-50 text-indigo-600' },
          { label: statusLabel.DA_CONG_KHAI, value: cnt('DA_CONG_KHAI'), Icon: Globe, box: 'bg-green-50 text-green-600' },
        ]
      : [
          totalCard,
          { label: statusLabel.CHO_XU_LY, value: cnt('CHO_XU_LY'), Icon: Clock, box: 'bg-amber-50 text-amber-600' },
          { label: statusLabel.DA_PHE_DUYET, value: cnt('DA_PHE_DUYET'), Icon: CheckCircle, box: 'bg-green-50 text-green-600' },
          { label: statusLabel.TU_CHOI, value: cnt('TU_CHOI'), Icon: XCircle, box: 'bg-red-50 text-red-600' },
        ];

  return (
    <div className="api-requests-page-root" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .api-requests-page-root *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(svg):not(path):not(circle):not(rect):not(polyline):not(line) {
          font-size: 13px !important;
        }
      `}} />
      <div className="h-full flex flex-col bg-slate-50 min-h-screen animate-in fade-in duration-300">
        
        {/* Navigation Tabs */}
        <div className="bg-white border-b border-slate-200 px-6">
          <div className="flex gap-6">
            <button
              onClick={() => { setActiveTab('tiep_nhan'); setCurrentPage(1); }}
              className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'tiep_nhan'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              Tiếp nhận yêu cầu ({requests.length})
            </button>
            <button
              onClick={() => { setActiveTab('tra_cuu'); setCurrentPage(1); }}
              className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'tra_cuu'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-5 h-5" />
              Tra cứu & Kết xuất ({requests.filter(r => r.status === 'CHO_XU_LY' || r.status === 'DA_PHE_DUYET' || r.status === 'DA_XUAT').length})
            </button>
            <button
              onClick={() => { setActiveTab('ban_giao'); setCurrentPage(1); }}
              className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'ban_giao'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Share className="w-5 h-5" />
              Bàn giao dữ liệu ({requests.filter(r => r.status === 'DA_XUAT' || r.status === 'DA_BAN_GIAO' || r.status === 'DA_CONG_KHAI' || r.status === 'HUY_CONG_KHAI').length})
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            
            {/* Statistic cards (thay cho phần mô tả tiêu đề, đổi theo từng tab) */}
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {statCards.map(({ label, value, Icon, box }, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${box}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">{label}</p>
                    <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters and Actions */}
            <div className="mb-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Tìm theo mã YC, cơ quan, loại dữ liệu..."
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={query}
                      onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
                    />
                  </div>
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                    className={`p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border ${showAdvancedFilter ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}
                    title="Bộ lọc"
                  >
                    {showAdvancedFilter ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium whitespace-nowrap"
                    title="Tạo yêu cầu"
                  >
                    <Plus className="w-4 h-4" />
                    Tạo yêu cầu
                  </button>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showAdvancedFilter && (
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-4 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative z-20">
                  <div className="absolute -top-2 right-[200px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>
                  <div>
                    <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">Trạng thái yêu cầu</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => { setFilterStatus(e.target.value as 'ALL' | RequestStatus); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm cursor-pointer"
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
                    <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">Loại dữ liệu</label>
                    <select
                      value={filterType}
                      onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm cursor-pointer"
                    >
                      {dataTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type === 'ALL' ? 'Tất cả loại dữ liệu' : type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">Từ ngày</label>
                    <input
                      type="date"
                      value={filterFromDate}
                      onChange={(e) => { setFilterFromDate(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">Đến ngày</label>
                    <input
                      type="date"
                      value={filterToDate}
                      onChange={(e) => { setFilterToDate(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Table / Grid list */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    <tr className="bg-slate-50 text-[13px] font-semibold text-slate-500 border-b border-slate-200 uppercase tracking-tight">
                      <th className="py-3 px-4 text-left font-semibold">Mã YC</th>
                      <th className="py-3 px-4 text-left font-semibold">Đơn vị đề nghị</th>
                      <th className="py-3 px-4 text-left font-semibold">Nguồn CSDL yêu cầu</th>
                      <th className="py-3 px-4 text-left font-semibold">Mục đích khai thác</th>
                      <th className="py-3 px-4 text-left font-semibold">Ngày gửi</th>
                      <th className="py-3 px-4 text-left font-semibold">Trạng thái</th>
                      <th className="py-3 px-4 text-center font-semibold">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-[13px]">
                    {paginatedRequests.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                          Không tìm thấy yêu cầu nào.
                        </td>
                      </tr>
                    ) : (
                      paginatedRequests.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-all border-b border-slate-100 group">
                          <td className="py-3 px-4 text-left font-semibold text-slate-900 leading-snug">
                            {item.id}
                          </td>
                          <td className="py-3 px-4 text-left text-slate-600">
                            {item.org}
                          </td>
                          <td className="py-3 px-4 text-left text-slate-600">
                            {item.dataType}
                          </td>
                          <td className="py-3 px-4 text-left text-slate-600">
                            {item.purpose}
                          </td>
                          <td className="py-3 px-4 text-left font-mono text-slate-400 text-xs">
                            {formatDateTime(item.requestDate)}
                          </td>
                          <td className="py-3 px-4 text-left">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-normal ${statusBadgeStyle[item.status]}`}>
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                item.status === 'CHO_XU_LY' ? 'bg-amber-500 animate-pulse' :
                                item.status === 'DA_PHE_DUYET' ? 'bg-blue-500' :
                                item.status === 'TU_CHOI' ? 'bg-red-500' :
                                item.status === 'DA_XUAT' ? 'bg-orange-500' :
                                item.status === 'DA_BAN_GIAO' ? 'bg-indigo-500' :
                                item.status === 'DA_CONG_KHAI' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'
                              }`}></span>
                              {statusLabel[item.status]}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5 flex-nowrap">
                              {/* TIEP_NHAN: Edit chỉ cho CHO_XU_LY, Eye cho tất cả trạng thái */}
                              {activeTab === 'tiep_nhan' && (
                                <>
                                  <button
                                    title="Chỉnh sửa"
                                    onClick={() => { if (item.status !== 'DA_XUAT' && item.status !== 'DA_PHE_DUYET') { setSelectedRequest(item); setShowRequestModal(true); } }}
                                    disabled={item.status === 'DA_XUAT' || item.status === 'DA_PHE_DUYET'}
                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-[6px] transition-all inline-flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-slate-500 disabled:hover:bg-transparent"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    title="Xem chi tiết"
                                    onClick={() => handleViewRequest(item)}
                                    className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-[6px] transition-all inline-flex items-center justify-center cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              {/* TRA_CUU tab */}
                              {activeTab === 'tra_cuu' && item.status === 'CHO_XU_LY' && (
                                <button
                                  title="Tiếp nhận"
                                  onClick={() => { setSelectedRequest(item); setShowApprovalModal(true); }}
                                  className="p-1.5 text-slate-700 hover:text-black hover:bg-slate-100 rounded-[6px] transition-all inline-flex items-center justify-center cursor-pointer"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              {activeTab === 'tra_cuu' && (item.status === 'DA_PHE_DUYET' || item.status === 'DA_XUAT') && (
                                <button
                                  title="Thiết lập kết xuất"
                                  onClick={() => handleExportClick(item)}
                                  className="p-1.5 text-slate-700 hover:text-black hover:bg-slate-100 rounded-[6px] transition-all inline-flex items-center justify-center cursor-pointer"
                                >
                                  <Settings className="w-4 h-4" />
                                </button>
                              )}
                              {/* BAN_GIAO tab */}
                              {activeTab === 'ban_giao' && (
                                <>
                                  <button
                                    title="Bàn giao"
                                    onClick={() => handleHandoverClick(item)}
                                    disabled={item.status !== 'DA_XUAT'}
                                    className="p-1.5 text-slate-700 hover:text-black hover:bg-slate-100 rounded-[6px] transition-all inline-flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-slate-700 disabled:hover:bg-transparent"
                                  >
                                    <Send className="w-4 h-4" />
                                  </button>
                                  <button
                                    title="Công khai"
                                    onClick={() => handlePublishClick(item)}
                                    disabled={item.status !== 'DA_XUAT'}
                                    className="p-1.5 text-slate-700 hover:text-black hover:bg-slate-100 rounded-[6px] transition-all inline-flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-slate-700 disabled:hover:bg-transparent"
                                  >
                                    <Globe className="w-4 h-4" />
                                  </button>
                                  {item.status === 'DA_BAN_GIAO' && (
                                    <button
                                      title="Xem chi tiết Bàn giao"
                                      onClick={() => handleViewHandoverDetail(item)}
                                      className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-[6px] transition-all inline-flex items-center justify-center cursor-pointer"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                  )}
                                  {(item.status === 'DA_CONG_KHAI' || item.status === 'HUY_CONG_KHAI') && (
                                    <button
                                      title="Xem chi tiết Công khai"
                                      onClick={() => handleViewPublishDetail(item)}
                                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-[6px] transition-all inline-flex items-center justify-center cursor-pointer"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                  )}
                                  {item.status === 'DA_CONG_KHAI' && (
                                    <button
                                      title="Hủy công khai"
                                      onClick={() => handleUnpublishClick(item)}
                                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 bg-red-50/50 rounded-[6px] transition-all inline-flex items-center justify-center cursor-pointer shadow-sm"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {renderPagination(filteredRequests.length)}
            </div>

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
