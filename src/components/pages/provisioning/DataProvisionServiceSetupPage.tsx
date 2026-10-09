import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Settings, CheckCircle, XCircle, Share2, Search, Filter, Plus, FileText, Activity, Eye, Ban, Database, Clock, X, Trash2, Edit } from 'lucide-react';
import { Badge, TruncatedText, RowIconAction, Pagination, tabClass, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, FIELD_LABEL, FIELD_VALUE, TOOLTIP_CLS, normalizeSearch } from '../collection/collectionUi';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;
import { ProvisionServiceModal } from './modals/ProvisionServiceModal';
import { ProvisionServiceApprovalModal } from './modals/ProvisionServiceApprovalModal';
import { ProvisionServicePublishModal } from './modals/ProvisionServicePublishModal';
import { SubmitApprovalModal } from './modals/SubmitApprovalModal';
import { ProvisionServicePublicDetailsModal } from './modals/ProvisionServicePublicDetailsModal';
import { ProvisionApiDetailModal } from './modals/ProvisionApiDetailModal';

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

export function DataProvisionServiceSetupPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'setup' || tab === 'approve' || tab === 'publish') {
      return tab as 'setup' | 'approve' | 'publish';
    }
    return 'setup';
  };

  const [activeTab, setActiveTab] = useState<'setup' | 'approve' | 'publish'>(getInitialTab);

  const handleTabChange = (tab: 'setup' | 'approve' | 'publish') => {
    setActiveTab(tab);
    setCurrentPage(1);
    const params = new URLSearchParams(location.search);
    params.set('tab', tab);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'setup' || tab === 'approve' || tab === 'publish') {
      if (tab !== activeTab) {
        setActiveTab(tab);
      }
    }
  }, [location.search, activeTab]);

  const [approvalSearchTerm, setApprovalSearchTerm] = useState('');
  const [showApprovalFilters, setShowApprovalFilters] = useState(false);
  const [approvalFilterDataType, setApprovalFilterDataType] = useState('all');
  const [approvalFilterFreq, setApprovalFilterFreq] = useState('all');
  const [approvalFilterProtocol, setApprovalFilterProtocol] = useState('all');
  const [approvalFilterStatus, setApprovalFilterStatus] = useState('all');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSubmitApprovalModal, setShowSubmitApprovalModal] = useState(false);
  const [showPublicDetailsModal, setShowPublicDetailsModal] = useState(false);
  const [showApiDetailModal, setShowApiDetailModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [approvalModalMode, setApprovalModalMode] = useState<'approve' | 'reject'>('approve');
  const [serviceModalMode, setServiceModalMode] = useState<'view' | 'edit'>('edit');

  useEffect(() => {
    if (location.search.includes('action=create')) {
      setSelectedService(null);
      setShowServiceModal(true);
      // Clean up the URL to prevent reopening on refresh
      const params = new URLSearchParams(location.search);
      params.delete('action');
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [location.search, navigate]);

  // States for filter criteria
  const [showFilters, setShowFilters] = useState(false);
  const [filterDataType, setFilterDataType] = useState('all');
  const [filterFreq, setFilterFreq] = useState('all');
  const [filterProtocol, setFilterProtocol] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // Thông báo dùng toast chung (sonner)
  const showToast = (msg: string) => {
    toast.success(msg);
  };

  // Điều kiện đã áp dụng: chỉ cập nhật khi bấm nút Tìm kiếm hoặc Enter (mục 5.19)
  const [applied, setApplied] = useState({ searchTerm: '', dataType: 'all', freq: 'all', protocol: 'all', status: 'all' });
  const [approvalApplied, setApprovalApplied] = useState({ searchTerm: '', dataType: 'all', freq: 'all', protocol: 'all', status: 'all' });

  const runSearch = () => {
    setApplied({ searchTerm, dataType: filterDataType, freq: filterFreq, protocol: filterProtocol, status: filterStatus });
    setCurrentPage(1);
  };

  const runApprovalSearch = () => {
    setApprovalApplied({ searchTerm: approvalSearchTerm, dataType: approvalFilterDataType, freq: approvalFilterFreq, protocol: approvalFilterProtocol, status: approvalFilterStatus });
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(s => s.id !== serviceId));
    setShowDeleteConfirmModal(false);
    showToast("Đã xóa dịch vụ thành công!");
  };

  // Dynamic services list (including standard fields from UI mockups)
  const [services, setServices] = useState<any[]>(() => {
    const saved = localStorage.getItem('provision_services');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: '1', name: 'API cung cấp dữ liệu Hộ tịch điện tử', code: 'SVC-HOTICH-001', type: 'Dữ liệu Hộ tịch', freq: 'Thời gian thực', protocol: 'REST API (JSON)', status: 'published', date: '2026-05-24 08:00:00', publishDate: '25/05/2026 09:00:00', creator: 'Hệ thống BTP', consumerUnit: 'Bộ Kế hoạch và Đầu tư, Sở Tài chính tỉnh Bắc Ninh' },
      { id: '2', name: 'API đối soát dữ liệu đăng ký kết hôn', code: 'SVC-KETHON-002', type: 'Dữ liệu kết hôn', freq: 'Hàng ngày', protocol: 'REST API (JSON)', status: 'pending', date: '2026-05-25 09:30:00', publishDate: '', creator: 'Nguyễn Văn A', consumerUnit: 'Sở Tài chính tỉnh Bắc Ninh' },
      { id: '3', name: 'API cung cấp thông tin khai sinh', code: 'SVC-KHAISINH-003', type: 'Dữ liệu khai sinh', freq: 'Thời gian thực', protocol: 'REST API (JSON)', status: 'draft', date: '2026-05-25 14:15:00', publishDate: '', creator: 'Trần Thị B', consumerUnit: 'Công an tỉnh Bắc Ninh' },
      { id: '4', name: 'API đối soát dữ liệu khai tử', code: 'SVC-KHAITU-004', type: 'Dữ liệu khai tử', freq: 'Hàng tuần', protocol: 'SOAP (XML)', status: 'rejected', date: '2026-05-23 16:45:00', publishDate: '', creator: 'Lê Văn C', consumerUnit: 'Sở Y tế tỉnh Bắc Ninh' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('provision_services', JSON.stringify(services));
  }, [services]);

  const filteredServices = services.filter(item => {
    // 1. Tab-specific base filter
    if (activeTab === 'publish' && item.status !== 'approved' && item.status !== 'published') return false;

    // 2. Search term (Search by name or code)
    const term = normalizeSearch(applied.searchTerm);
    if (term !== '') {
      const matchesName = normalizeSearch(item.name).includes(term);
      const matchesCode = normalizeSearch(item.code).includes(term);
      if (!matchesName && !matchesCode) return false;
    }
    // 2. Filter by Data Type
    if (applied.dataType !== 'all' && item.type !== applied.dataType) return false;
    // 3. Filter by Frequency
    if (applied.freq !== 'all' && item.freq !== applied.freq) return false;
    // 4. Filter by Protocol
    if (applied.protocol !== 'all' && item.protocol !== applied.protocol) return false;
    // 5. Filter by Status
    if (applied.status !== 'all' && item.status !== applied.status) return false;

    return true;
  });

  const filteredApprovals = services.filter(item => {
    if (item.status !== 'pending' && item.status !== 'approved' && item.status !== 'rejected') return false;
    const term = normalizeSearch(approvalApplied.searchTerm);
    if (term) {
      if (!normalizeSearch(item.name).includes(term) && !normalizeSearch(item.code).includes(term)) return false;
    }
    if (approvalApplied.status !== 'all' && item.status !== approvalApplied.status) return false;
    if (approvalApplied.dataType !== 'all' && item.type !== approvalApplied.dataType) return false;
    if (approvalApplied.freq !== 'all' && item.freq !== approvalApplied.freq) return false;
    if (approvalApplied.protocol !== 'all' && item.protocol !== approvalApplied.protocol) return false;
    return true;
  });

  // Nhãn + màu badge trạng thái (giữ ý nghĩa màu cũ)
  const STATUS_BADGE: Record<string, { label: string; variant: string }> = {
    published: { label: 'Đang công khai', variant: 'green' },
    pending: { label: 'Chờ phê duyệt', variant: 'blue' },
    approved: { label: 'Đã duyệt', variant: 'emerald' },
    draft: { label: 'Bản nháp', variant: 'slate' },
    rejected: { label: 'Từ chối', variant: 'red' },
  };

  const paginatedServices = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const statCards = [
    { label: 'Tổng số API', value: services.length, icon: <Database className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Đang công khai', value: services.filter(s => s.status === 'published').length, icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
    { label: 'Chờ phê duyệt', value: services.filter(s => s.status === 'pending').length, icon: <Clock className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50' },
    { label: 'Cần chỉnh sửa', value: services.filter(s => s.status === 'rejected').length, icon: <XCircle className="w-5 h-5 text-red-600" />, bg: 'bg-red-50' },
    { label: 'Đã duyệt', value: services.filter(s => s.status === 'approved').length, icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Bản nháp', value: services.filter(s => s.status === 'draft').length, icon: <FileText className="w-5 h-5 text-[#64748B]" />, bg: 'bg-[#F1F5F9]' },
  ];

  const TH_CLS = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';

  return (
    <div className="relative">
      <div className="h-full flex flex-col bg-[#F8FAFC] min-h-screen animate-in fade-in duration-300">
        {/* Tabs (mục 5.9) */}
        <div className="bg-white border-b border-[#E2E8F0] px-6">
          <div className="flex">
            <button onClick={() => handleTabChange('setup')} className={`${tabClass(activeTab === 'setup')} whitespace-nowrap`}>
              <Settings className="w-4 h-4" />
              Thiết lập dịch vụ
            </button>
            <button onClick={() => handleTabChange('approve')} className={`${tabClass(activeTab === 'approve')} whitespace-nowrap`}>
              <CheckCircle className="w-4 h-4" />
              Kiểm tra & Phê duyệt
            </button>
            <button onClick={() => handleTabChange('publish')} className={`${tabClass(activeTab === 'publish')} whitespace-nowrap`}>
              <Share2 className="w-4 h-4" />
              Công khai dịch vụ
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'approve' ? (
            <div className="space-y-4">
              {/* Search + Filter (mục 5.19) */}
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      aria-label="Tìm kiếm dịch vụ"
                      placeholder="Tìm kiếm theo tên, mã dịch vụ..."
                      value={approvalSearchTerm}
                      onChange={(e) => setApprovalSearchTerm(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') runApprovalSearch(); }}
                      className={SEARCH_INPUT_CLS}
                    />
                  </div>
                  <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runApprovalSearch} className={SEARCH_BTN_CLS}>
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Bộ lọc"
                    title="Bộ lọc"
                    aria-expanded={showApprovalFilters}
                    onClick={() => setShowApprovalFilters(!showApprovalFilters)}
                    className={filterBtnClass(showApprovalFilters)}
                  >
                    {showApprovalFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                  </button>
                </div>

                {showApprovalFilters && (
                  <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
                    <div>
                      <label className={FILTER_LABEL}>Phân loại dữ liệu</label>
                      <select aria-label="Phân loại dữ liệu" value={approvalFilterDataType} onChange={(e) => setApprovalFilterDataType(e.target.value)} className={INPUT_CLS}>
                        <option value="all">Tất cả phân loại</option>
                        {[...new Set(services.map(s => s.type))].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={FILTER_LABEL}>Tần suất</label>
                      <select aria-label="Tần suất" value={approvalFilterFreq} onChange={(e) => setApprovalFilterFreq(e.target.value)} className={INPUT_CLS}>
                        <option value="all">Tất cả tần suất</option>
                        {[...new Set(services.map(s => s.freq))].map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={FILTER_LABEL}>Giao thức</label>
                      <select aria-label="Giao thức" value={approvalFilterProtocol} onChange={(e) => setApprovalFilterProtocol(e.target.value)} className={INPUT_CLS}>
                        <option value="all">Tất cả giao thức</option>
                        {[...new Set(services.map(s => s.protocol))].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={FILTER_LABEL}>Trạng thái</label>
                      <select aria-label="Trạng thái" value={approvalFilterStatus} onChange={(e) => setApprovalFilterStatus(e.target.value)} className={INPUT_CLS}>
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chờ phê duyệt</option>
                        <option value="approved">Đã phê duyệt</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Approval Cards List */}
              <div className="grid grid-cols-1 gap-4" key={approvalApplied.status}>
                {filteredApprovals.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-[#E2E8F0] rounded-2xl">
                    <p className="text-[13px] text-[#64748B]">Không có dữ liệu phù hợp với bộ lọc hiện tại.</p>
                  </div>
                ) : (
                  filteredApprovals.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white border border-[#E2E8F0] rounded-2xl">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`p-2 rounded-lg shrink-0 ${item.status === 'pending' ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                            <Activity className={`w-5 h-5 ${item.status === 'pending' ? 'text-blue-600' : 'text-emerald-600'}`} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[14px] font-medium text-[#020817]">{item.name}</h3>
                            <div className="text-[13px] text-[#64748B]">Mã: {item.code}</div>
                          </div>
                        </div>
                        <Badge
                          label={item.status === 'pending' ? 'Chờ phê duyệt' : item.status === 'approved' ? 'Đã phê duyệt' : 'Từ chối'}
                          variant={item.status === 'pending' ? 'blue' : item.status === 'approved' ? 'emerald' : 'red'}
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 pt-4 border-t border-[#E2E8F0]">
                        <div>
                          <p className={`${FIELD_LABEL} mb-1`}>Phân loại dữ liệu</p>
                          <p className={FIELD_VALUE}>{item.type}</p>
                        </div>
                        <div>
                          <p className={`${FIELD_LABEL} mb-1`}>Tần suất</p>
                          <p className={FIELD_VALUE}>{item.freq}</p>
                        </div>
                        <div>
                          <p className={`${FIELD_LABEL} mb-1`}>Giao thức</p>
                          <p className={FIELD_VALUE}>{item.protocol}</p>
                        </div>
                        <div>
                          <p className={`${FIELD_LABEL} mb-1`}>Ngày tạo</p>
                          <p className={FIELD_VALUE}>{formatDateTime(item.date || new Date().toISOString())}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#E2E8F0]">
                        {/* Nút Kiểm tra */}
                        <button
                          type="button"
                          onClick={() => { setSelectedService(item); setServiceModalMode('view'); setShowServiceModal(true); }}
                          className={BTN_OUTLINE}
                          title="Kiểm tra"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Kiểm tra</span>
                        </button>

                        {/* Nút Từ chối / Phê duyệt: hiện cho mọi trạng thái; chỉ bấm được khi Chờ phê duyệt (PM 07/10/2026) */}
                        {(() => {
                          const canDecide = item.status === 'pending';
                          const reason = 'Dịch vụ không ở trạng thái chờ phê duyệt';
                          const wrap = (btn: React.ReactNode, key: string) => canDecide ? <span key={key} className="inline-flex">{btn}</span> : (
                            <Tooltip key={key}>
                              <TooltipTrigger asChild><span className="inline-flex" tabIndex={0}>{btn}</span></TooltipTrigger>
                              <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>{reason}</TooltipContent>
                            </Tooltip>
                          );
                          return (
                            <>
                              {wrap(
                                <button
                                  type="button"
                                  disabled={!canDecide}
                                  onClick={() => { setSelectedService(item); setApprovalModalMode('reject'); setShowApprovalModal(true); }}
                                  className={BTN_DESTRUCTIVE}
                                  title={canDecide ? 'Từ chối phê duyệt' : undefined}
                                >
                                  <Ban className="w-4 h-4" />
                                  <span>Từ chối</span>
                                </button>, 'reject')}
                              {wrap(
                                <button
                                  type="button"
                                  disabled={!canDecide}
                                  onClick={() => { setSelectedService(item); setApprovalModalMode('approve'); setShowApprovalModal(true); }}
                                  className={BTN_PRIMARY}
                                  title={canDecide ? 'Phê duyệt' : undefined}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Phê duyệt</span>
                                </button>, 'approve')}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Stat Cards (mục 5.6.1) */}
              {activeTab === 'setup' && (
                <div className="grid grid-cols-3 xl:grid-cols-6 gap-4">
                  {statCards.map(card => (
                    <div key={card.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 ${card.bg} rounded-lg shrink-0`}>{card.icon}</div>
                        <div className="min-w-0">
                          <div className="text-[16px] text-[#64748B] truncate">{card.label}</div>
                          <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{card.value}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Filters and Actions (mục 5.19) */}
              <div>
                {/* Row 1: Search and Buttons */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <input aria-label="Tìm kiếm dịch vụ"
                        type="text"
                        placeholder="Tìm kiếm dịch vụ theo tên hoặc mã..."
                        className={SEARCH_INPUT_CLS}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
                      />
                    </div>
                    <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
                      <Search className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Bộ lọc"
                      aria-expanded={showFilters}
                      onClick={() => setShowFilters(!showFilters)}
                      className={filterBtnClass(showFilters)}
                      title="Bộ lọc"
                    >
                      {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => { setSelectedService(null); setServiceModalMode('edit'); setShowServiceModal(true); }}
                      className={BTN_PRIMARY}
                    >
                      <Plus className="w-4 h-4" />
                      Tạo API Cung cấp mới
                    </button>
                  </div>
                </div>

                {/* Row 2: Filters Panel */}
                {showFilters && (
                  <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
                    <div>
                      <label className={FILTER_LABEL}>Phân loại dữ liệu</label>
                      <select aria-label="Phân loại dữ liệu" value={filterDataType} onChange={(e) => setFilterDataType(e.target.value)} className={INPUT_CLS}>
                        <option value="all">Tất cả phân loại</option>
                        <option value="Dữ liệu Hộ tịch">Dữ liệu Hộ tịch</option>
                        <option value="Dữ liệu khai sinh">Dữ liệu khai sinh</option>
                        <option value="Dữ liệu kết hôn">Dữ liệu kết hôn</option>
                        <option value="Dữ liệu khai tử">Dữ liệu khai tử</option>
                      </select>
                    </div>

                    <div>
                      <label className={FILTER_LABEL}>Tần suất</label>
                      <select aria-label="Tần suất" value={filterFreq} onChange={(e) => setFilterFreq(e.target.value)} className={INPUT_CLS}>
                        <option value="all">Tất cả tần suất</option>
                        <option value="Thời gian thực">Thời gian thực</option>
                        <option value="Hàng ngày">Hàng ngày</option>
                        <option value="Hàng tuần">Hàng tuần</option>
                      </select>
                    </div>

                    <div>
                      <label className={FILTER_LABEL}>Giao thức</label>
                      <select aria-label="Giao thức" value={filterProtocol} onChange={(e) => setFilterProtocol(e.target.value)} className={INPUT_CLS}>
                        <option value="all">Tất cả giao thức</option>
                        <option value="REST API (JSON)">REST API (JSON)</option>
                        <option value="SOAP (XML)">SOAP (XML)</option>
                      </select>
                    </div>

                    <div>
                      <label className={FILTER_LABEL}>Trạng thái</label>
                      <select aria-label="Trạng thái" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={INPUT_CLS}>
                        <option value="all">Tất cả trạng thái</option>
                        <option value="published">Đang công khai</option>
                        <option value="pending">Chờ phê duyệt</option>
                        <option value="draft">Bản nháp</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid Table Card (mục 5.3) */}
              <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse collection-table text-[13px]">
                    <thead className="bg-[#F8FAFC] sticky top-0 z-[1]">
                      <tr className="h-[42px]">
                        <th className={`${TH_CLS} text-left min-w-[220px]`}>Mã / Tên API</th>
                        <th className={`${TH_CLS} text-left`}>Loại dữ liệu chia sẻ</th>
                        <th className={`${TH_CLS} text-left`}>Tần suất đối soát</th>
                        <th className={`${TH_CLS} text-left`}>Giao thức / Định dạng</th>
                        <th className={`${TH_CLS} text-left`}>Trạng thái</th>
                        <th className={`${TH_CLS} text-left`}>Người tạo / Ngày tạo</th>
                        {activeTab === 'publish' && (
                          <th className={`${TH_CLS} text-left`}>Ngày công khai</th>
                        )}
                        <th className={`${TH_CLS} text-center sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedServices.length === 0 ? (
                        <tr>
                          <td colSpan={activeTab === 'publish' ? 8 : 7} className="py-16 text-center text-[13px] text-[#64748B]">
                            Không tìm thấy dịch vụ phù hợp với bộ lọc hiện tại.
                          </td>
                        </tr>
                      ) : (
                        paginatedServices.map((item) => {
                          const statusBadge = STATUS_BADGE[item.status] || STATUS_BADGE.rejected;
                          const isDeletable = ['draft', 'pending', 'rejected'].includes(item.status);
                          return (
                          <tr key={item.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-3 py-1 text-left text-black text-[13px] max-w-[360px] leading-[18px]">
                              <TruncatedText text={item.name} />
                              <TruncatedText text={item.code} className="text-[#64748B]" />
                            </td>
                            <td className="px-3 py-1 text-left text-black text-[13px] whitespace-nowrap">{item.type}</td>
                            <td className="px-3 py-1 text-left text-black text-[13px] whitespace-nowrap">{item.freq}</td>
                            <td className="px-3 py-1 text-left text-black text-[13px] whitespace-nowrap">{item.protocol}</td>
                            <td className="px-3 py-1 text-left">
                              <Badge label={statusBadge.label} variant={statusBadge.variant} />
                            </td>
                            <td className="px-3 py-1 text-left text-black text-[13px] whitespace-nowrap leading-[18px]">
                              <div>{item.creator || 'Hệ thống BTP'}</div>
                              <div className="text-[#64748B]">{formatDateTime(item.date || new Date().toISOString())}</div>
                            </td>
                            {activeTab === 'publish' && (
                              <td className="px-3 py-1 text-left text-black text-[13px] whitespace-nowrap">
                                {item.publishDate ? item.publishDate : <span className="text-[#94A3B8]">—</span>}
                              </td>
                            )}
                            <td className="px-3 py-1 text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]">
                              {activeTab === 'publish' ? (
                                <div className="inline-flex items-center justify-center gap-1">
                                  <RowIconAction
                                    label="Xem chi tiết API"
                                    onClick={() => {
                                      setSelectedService(item);
                                      setServiceModalMode('view');
                                      setShowServiceModal(true);
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </RowIconAction>
                                  <RowIconAction
                                    label="Công khai dịch vụ"
                                    disabledReason={item.status === 'published' ? 'Dịch vụ đã được công khai' : undefined}
                                    onClick={() => {
                                      if (item.status !== 'published') {
                                        setSelectedService(item);
                                        setShowPublishModal(true);
                                      }
                                    }}
                                  >
                                    <Share2 className="w-4 h-4" />
                                  </RowIconAction>
                                </div>
                              ) : (
                                <div className="inline-flex items-center justify-center gap-1">
                                  <RowIconAction
                                    label="Xem chi tiết"
                                    onClick={() => {
                                      setSelectedService(item);
                                      setServiceModalMode('view');
                                      setShowServiceModal(true);
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </RowIconAction>
                                  <RowIconAction
                                    label="Chỉnh sửa"
                                    onClick={() => {
                                      setSelectedService(item);
                                      setServiceModalMode('edit');
                                      setShowServiceModal(true);
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </RowIconAction>
                                  <RowIconAction
                                    label="Xóa dịch vụ"
                                    disabledReason={isDeletable ? undefined : 'Không thể xóa dịch vụ ở trạng thái này'}
                                    onClick={() => {
                                      if (isDeletable) {
                                        setSelectedService(item);
                                        setShowDeleteConfirmModal(true);
                                      }
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </RowIconAction>
                                </div>
                              )}
                            </td>
                          </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination (mục 5.14) */}
                <Pagination
                  className="border-t border-[#E2E8F0]"
                  currentPage={currentPage}
                  totalItems={filteredServices.length}
                  pageSize={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setItemsPerPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <ProvisionServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onSave={(data, isPublic) => {
          const now = new Date();
          const day = String(now.getDate()).padStart(2, '0');
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const year = now.getFullYear();
          const h = String(now.getHours()).padStart(2, '0');
          const m = String(now.getMinutes()).padStart(2, '0');
          const s = String(now.getSeconds()).padStart(2, '0');
          const dateStr = `${day}/${month}/${year} ${h}:${m}:${s}`;
          
          const newService = {
            ...data,
            id: selectedService ? selectedService.id : Date.now().toString(),
            status: isPublic ? 'published' : (selectedService?.status || 'draft'),
            creator: selectedService ? selectedService.creator : 'Hệ thống BTP',
            date: selectedService ? selectedService.date : dateStr,
            publishDate: isPublic ? dateStr : (selectedService?.publishDate || '')
          };

          if (selectedService) {
            setServices(services.map(s => s.id === selectedService.id ? newService : s));
          } else {
            setServices([...services, newService]);
          }
          if (isPublic) {
            setActiveTab('publish');
          }
          showToast(selectedService ? 'Cập nhật dịch vụ thành công!' : 'Khởi tạo dịch vụ cung cấp thành công!');
        }}
        onSaveDraft={(data) => {
          const now = new Date();
          const day = String(now.getDate()).padStart(2, '0');
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const year = now.getFullYear();
          const h = String(now.getHours()).padStart(2, '0');
          const m = String(now.getMinutes()).padStart(2, '0');
          const s = String(now.getSeconds()).padStart(2, '0');
          const dateStr = `${day}/${month}/${year} ${h}:${m}:${s}`;
          
          const newService = {
            ...data,
            id: selectedService ? selectedService.id : Date.now().toString(),
            status: 'draft',
            creator: selectedService ? selectedService.creator : 'Hệ thống BTP',
            date: selectedService ? selectedService.date : dateStr
          };

          if (selectedService) {
            setServices(services.map(s => s.id === selectedService.id ? newService : s));
          } else {
            setServices([...services, newService]);
          }
          setShowServiceModal(false);
          showToast("Đã lưu bản nháp dịch vụ!");
        }}
        onSubmitApproval={(data) => {
          setSelectedService(data);
          setShowServiceModal(false);
          setShowSubmitApprovalModal(true);
        }}
        service={selectedService}
        mode={serviceModalMode}
      />

      <SubmitApprovalModal
        isOpen={showSubmitApprovalModal}
        onClose={() => setShowSubmitApprovalModal(false)}
        onSubmit={(approverId, message) => {
          const newService = selectedService ? { ...selectedService, status: 'pending' } : {
            id: Date.now().toString(),
            name: 'Dịch vụ chờ duyệt',
            code: `DV_PENDING_${Math.floor(Math.random() * 1000)}`,
            type: 'Chưa xác định',
            freq: 'Chưa cấu hình',
            protocol: 'REST API',
            status: 'pending',
            date: formatDateTime(new Date().toISOString())
          };

          if (selectedService) {
            setServices(services.map(s => s.id === selectedService.id ? newService : s));
          } else {
            setServices([...services, newService]);
          }

          showToast("Đã gửi trình duyệt thành công!");
          setShowSubmitApprovalModal(false);
          setActiveTab('approve');
          setApprovalFilterStatus('pending');
          // Lọc chuyển trạng thái do hệ thống đặt → áp dụng ngay
          setApprovalApplied(prev => ({ ...prev, status: 'pending' }));
        }}
        service={selectedService}
      />

      <ProvisionServiceApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        service={selectedService}
        defaultStatus={approvalModalMode}
        hideDecision={true}
        onApprove={(serviceToApprove, reason) => {
          setServices(services.map(s => s.id === serviceToApprove.id ? { ...s, status: 'approved', approveReason: reason } : s));
          setShowApprovalModal(false);
          showToast(`Đã phê duyệt dịch vụ: ${serviceToApprove.name}${reason ? `. Lý do: ${reason}` : ''}`);
        }}
        onReject={(serviceToReject, reason) => {
          setServices(services.map(s => s.id === serviceToReject.id ? { ...s, status: 'rejected', rejectReason: reason } : s));
          setShowApprovalModal(false);
          showToast(`Đã từ chối dịch vụ: ${serviceToReject.name}. Lý do: ${reason}`);
        }}
      />

      <ProvisionServicePublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        service={selectedService}
        onPublish={(serviceToPublish, reason) => {
          const now = new Date();
          const day = String(now.getDate()).padStart(2, '0');
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const year = now.getFullYear();
          const h = String(now.getHours()).padStart(2, '0');
          const m = String(now.getMinutes()).padStart(2, '0');
          const s = String(now.getSeconds()).padStart(2, '0');
          const publishDate = `${day}/${month}/${year} ${h}:${m}:${s}`;
          setServices(services.map(sv => sv.id === serviceToPublish.id ? { ...sv, status: 'published', publishReason: reason, publishDate } : sv));
          setShowPublishModal(false);
          showToast(`Đã công khai dịch vụ: ${serviceToPublish.name} thành công!${reason ? ` Lý do: ${reason}` : ''}`);
        }}
      />

      <ProvisionServicePublicDetailsModal
        isOpen={showPublicDetailsModal}
        onClose={() => setShowPublicDetailsModal(false)}
        service={selectedService}
      />

      <ProvisionApiDetailModal
        isOpen={showApiDetailModal}
        onClose={() => setShowApiDetailModal(false)}
        service={selectedService}
        onApprove={(serviceToApprove) => {
          setServices(services.map(s => s.id === serviceToApprove.id ? { ...s, status: 'approved' } : s));
          showToast(`Đã phê duyệt dịch vụ: ${serviceToApprove.name}`);
        }}
        onReject={(serviceToReject) => {
          setServices(services.map(s => s.id === serviceToReject.id ? { ...s, status: 'rejected' } : s));
          showToast(`Đã từ chối dịch vụ: ${serviceToReject.name}`);
        }}
      />

      {showDeleteConfirmModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header (mục 5.4) */}
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
              <h3 className="text-[16px] font-semibold text-[#020817]">Xác nhận xóa dịch vụ</h3>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setShowDeleteConfirmModal(false)}
                className={BTN_GHOST_ICON}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Content */}
            <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
              <p className="text-[13px] text-[#020817] leading-relaxed">
                Bạn có chắc chắn muốn xóa dịch vụ <strong className="font-medium">{selectedService.name}</strong> ({selectedService.code}) không? Hành động này không thể hoàn tác.
              </p>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowDeleteConfirmModal(false)}
                className={BTN_OUTLINE}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => handleDeleteService(selectedService.id)}
                className={BTN_DESTRUCTIVE}
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
