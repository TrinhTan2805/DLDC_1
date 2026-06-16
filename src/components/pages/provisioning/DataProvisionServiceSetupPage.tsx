import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Settings, CheckCircle, XCircle, Share2, Search, Filter, Plus, FileText, Activity, Eye, Pencil, RefreshCw, ChevronDown, Ban, Database, Clock, X, Trash2, Edit } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'setup' | 'approve' | 'publish'>('setup');
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

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.search.includes('action=create')) {
      setSelectedService(null);
      setShowServiceModal(true);
      // Clean up the URL to prevent reopening on refresh
      navigate(location.pathname, { replace: true });
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

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(s => s.id !== serviceId));
    setShowDeleteConfirmModal(false);
    alert("Đã xóa dịch vụ thành công!");
  };

  // Dynamic services list (including standard fields from UI mockups)
  const [services, setServices] = useState([
    { id: '1', name: 'API cung cấp dữ liệu Hộ tịch điện tử', code: 'SVC-HOTICH-001', type: 'Dữ liệu Hộ tịch', freq: 'Thời gian thực', protocol: 'REST API (JSON)', status: 'published', date: '2026-05-24 08:00:00', publishDate: '25/05/2026 09:00:00', creator: 'Hệ thống BTP' },
    { id: '2', name: 'API đối soát dữ liệu đăng ký kết hôn', code: 'SVC-KETHON-002', type: 'Dữ liệu kết hôn', freq: 'Hàng ngày', protocol: 'REST API (JSON)', status: 'pending', date: '2026-05-25 09:30:00', publishDate: '', creator: 'Nguyễn Văn A' },
    { id: '3', name: 'API cung cấp thông tin khai sinh', code: 'SVC-KHAISINH-003', type: 'Dữ liệu khai sinh', freq: 'Thời gian thực', protocol: 'REST API (JSON)', status: 'draft', date: '2026-05-25 14:15:00', publishDate: '', creator: 'Trần Thị B' },
    { id: '4', name: 'API đối soát dữ liệu khai tử', code: 'SVC-KHAITU-004', type: 'Dữ liệu khai tử', freq: 'Hàng tuần', protocol: 'SOAP (XML)', status: 'rejected', date: '2026-05-23 16:45:00', publishDate: '', creator: 'Lê Văn C' }
  ]);

  const filteredServices = services.filter(item => {
    // 1. Tab-specific base filter
    if (activeTab === 'publish' && item.status !== 'approved' && item.status !== 'published') return false;

    // 2. Search term (Search by name or code)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchesName = item.name.toLowerCase().includes(term);
      const matchesCode = item.code.toLowerCase().includes(term);
      if (!matchesName && !matchesCode) return false;
    }
    // 2. Filter by Data Type
    if (filterDataType !== 'all' && item.type !== filterDataType) return false;
    // 3. Filter by Frequency
    if (filterFreq !== 'all' && item.freq !== filterFreq) return false;
    // 4. Filter by Protocol
    if (filterProtocol !== 'all' && item.protocol !== filterProtocol) return false;
    // 5. Filter by Status
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;

    return true;
  });

  const filteredApprovals = services.filter(item => {
    if (item.status !== 'pending' && item.status !== 'approved' && item.status !== 'rejected') return false;
    if (approvalSearchTerm.trim()) {
      const term = approvalSearchTerm.toLowerCase();
      if (!item.name.toLowerCase().includes(term) && !item.code.toLowerCase().includes(term)) return false;
    }
    if (approvalFilterStatus !== 'all' && item.status !== approvalFilterStatus) return false;
    if (approvalFilterDataType !== 'all' && item.type !== approvalFilterDataType) return false;
    if (approvalFilterFreq !== 'all' && item.freq !== approvalFilterFreq) return false;
    if (approvalFilterProtocol !== 'all' && item.protocol !== approvalFilterProtocol) return false;
    return true;
  });

  const paginatedServices = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <div className="h-full flex flex-col bg-slate-50 min-h-screen animate-in fade-in duration-300">
        {/* Tabs */}
        <div className="bg-white border-b border-slate-200 px-6">
          <div className="flex gap-6">
            <button
              onClick={() => { setActiveTab('setup'); setCurrentPage(1); }}
              className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'setup'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-5 h-5" />
              Thiết lập dịch vụ
            </button>
            <button
              onClick={() => { setActiveTab('approve'); setCurrentPage(1); }}
              className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'approve'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Kiểm tra & Phê duyệt
            </button>
            <button
              onClick={() => { setActiveTab('publish'); setCurrentPage(1); }}
              className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'publish'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-5 h-5" />
              Công khai dịch vụ
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'approve' ? (
            <div className="space-y-6">
              <style dangerouslySetInnerHTML={{__html: `
                .approve-tab-content-list *:not(h3):not(svg):not(path) {
                  font-size: 13px !important;
                }
              `}} />
              {/* Search + Filter */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên, mã dịch vụ..."
                      value={approvalSearchTerm}
                      onChange={(e) => setApprovalSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                    />
                  </div>
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowApprovalFilters(!showApprovalFilters)}
                    className={`p-2 rounded-lg border transition-colors ${showApprovalFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {showApprovalFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {showApprovalFilters && (
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200 shadow-sm">
                  <div>
                    <label className="block text-[13px] text-slate-600 mb-1.5">Phân loại dữ liệu</label>
                    <select
                      value={approvalFilterDataType}
                      onChange={(e) => setApprovalFilterDataType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                    >
                      <option value="all">Tất cả phân loại</option>
                      {[...new Set(services.map(s => s.type))].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] text-slate-600 mb-1.5">Tần suất</label>
                    <select
                      value={approvalFilterFreq}
                      onChange={(e) => setApprovalFilterFreq(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                    >
                      <option value="all">Tất cả tần suất</option>
                      {[...new Set(services.map(s => s.freq))].map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] text-slate-600 mb-1.5">Giao thức</label>
                    <select
                      value={approvalFilterProtocol}
                      onChange={(e) => setApprovalFilterProtocol(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                    >
                      <option value="all">Tất cả giao thức</option>
                      {[...new Set(services.map(s => s.protocol))].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] text-slate-600 mb-1.5">Trạng thái</label>
                    <select
                      value={approvalFilterStatus}
                      onChange={(e) => setApprovalFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="pending">Chờ phê duyệt</option>
                      <option value="approved">Đã phê duyệt</option>
                      <option value="rejected">Từ chối</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Approval Cards List */}
              <div className="grid grid-cols-1 gap-4 approve-tab-content-list" key={approvalFilterStatus}>
                {filteredApprovals.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 border border-slate-200 border-dashed rounded-xl animate-in fade-in">
                    <p className="text-slate-500 text-sm font-medium">Không có dữ liệu phù hợp với bộ lọc hiện tại.</p>
                  </div>
                ) : (
                  filteredApprovals.map((item, idx) => (
                    <div key={idx} className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all group relative animate-in fade-in slide-in-from-bottom-2" style={{ animationDuration: '300ms', animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${item.status === 'pending' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <Activity className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã:</span>
                              <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{item.code}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'pending' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            item.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              'bg-red-50 text-red-600 border border-red-100'
                            }`}>
                            {item.status === 'pending' ? 'Chờ phê duyệt' : item.status === 'approved' ? 'Đã phê duyệt' : 'Từ chối'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phân loại dữ liệu</p>
                          <p className="text-sm text-slate-700 font-medium">{item.type}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tần suất</p>
                          <p className="text-sm text-slate-700 font-medium">{item.freq}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Giao thức</p>
                          <p className="text-sm text-slate-700 font-medium font-mono">{item.protocol}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ngày tạo</p>
                          <p className="text-sm text-slate-700 font-medium">{formatDateTime(item.date || new Date().toISOString())}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-slate-100">
                        {/* Nút Kiểm tra */}
                        <button
                          onClick={() => { setSelectedService(item); setServiceModalMode('view'); setShowServiceModal(true); }}
                          className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                          title="Kiểm tra"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Kiểm tra</span>
                        </button>

                        {/* Divider dọc */}
                        {item.status === 'pending' && (
                          <span className="w-px h-6 bg-slate-200 rounded-full" />
                        )}

                        {/* Nút Từ chối / Phê duyệt */}
                        {item.status === 'pending' && (
                          <>
                            <button
                              onClick={() => { setSelectedService(item); setApprovalModalMode('reject'); setShowApprovalModal(true); }}
                              className="px-4 py-2 text-xs font-bold text-white bg-red-500 border border-red-500 rounded-lg hover:bg-red-600 hover:border-red-600 transition-all uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                              title="Từ chối phê duyệt"
                            >
                              <Ban className="w-4 h-4" />
                              <span>Từ chối</span>
                            </button>
                            <button
                              onClick={() => { setSelectedService(item); setApprovalModalMode('approve'); setShowApprovalModal(true); }}
                              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                              title="Phê duyệt"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Phê duyệt</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Stat Cards */}
              {activeTab === 'setup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
                  <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Database className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Tổng số API</div>
                        <div className="text-lg font-bold text-slate-950">{services.length}</div>
                        <div className="text-[11px] text-slate-400 font-medium">Đang cấu hình chia sẻ</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Đang công khai</div>
                        <div className="text-lg font-bold text-slate-950">{services.filter(s => s.status === 'published').length}</div>
                        <div className="text-[11px] text-slate-400 font-medium">Đã xuất bản & kết nối</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 rounded-lg">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Chờ phê duyệt</div>
                        <div className="text-lg font-bold text-slate-950">{services.filter(s => s.status === 'pending').length}</div>
                        <div className="text-[11px] text-slate-400 font-medium">Đang chờ hội đồng duyệt</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Đã từ chối</div>
                        <div className="text-lg font-bold text-slate-950">{services.filter(s => s.status === 'rejected').length}</div>
                        <div className="text-[11px] text-slate-400 font-medium">Cần cập nhật cấu hình</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Filters and Actions */}
              <div className="mb-6">
                {/* Row 1: Search and Buttons */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 flex items-center gap-3">
                    <div className="relative flex-1">
                      <input aria-label="Input field"
                        type="text"
                        placeholder="Tìm kiếm dịch vụ theo tên hoặc mã..."
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      />
                    </div>
                    <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center">
                      <Search className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}
                      title="Bộ lọc"
                    >
                      {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setSelectedService(null); setServiceModalMode('edit'); setShowServiceModal(true); }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Tạo API Cung cấp mới
                    </button>
                  </div>
                </div>

                {/* Row 2: Filters Panel */}
                {showFilters && (
                  <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-4 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
                    <div className="absolute -top-2 right-[200px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>

                    <div className="space-y-1.5 relative z-10">
                      <label className="text-[13px] font-medium text-slate-700">Phân loại dữ liệu</label>
                      <div className="relative">
                        <select
                          value={filterDataType}
                          onChange={(e) => { setFilterDataType(e.target.value); setCurrentPage(1); }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm appearance-none cursor-pointer"
                        >
                          <option value="all">Tất cả phân loại</option>
                          <option value="Dữ liệu Hộ tịch">Dữ liệu Hộ tịch</option>
                          <option value="Dữ liệu khai sinh">Dữ liệu khai sinh</option>
                          <option value="Dữ liệu kết hôn">Dữ liệu kết hôn</option>
                          <option value="Dữ liệu khai tử">Dữ liệu khai tử</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5 relative z-10">
                      <label className="text-[13px] font-medium text-slate-700">Tần suất</label>
                      <div className="relative">
                        <select
                          value={filterFreq}
                          onChange={(e) => { setFilterFreq(e.target.value); setCurrentPage(1); }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm appearance-none cursor-pointer"
                        >
                          <option value="all">Tất cả tần suất</option>
                          <option value="Thời gian thực">Thời gian thực</option>
                          <option value="Hàng ngày">Hàng ngày</option>
                          <option value="Hàng tuần">Hàng tuần</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5 relative z-10">
                      <label className="text-[13px] font-medium text-slate-700">Giao thức</label>
                      <div className="relative">
                        <select
                          value={filterProtocol}
                          onChange={(e) => { setFilterProtocol(e.target.value); setCurrentPage(1); }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm appearance-none cursor-pointer"
                        >
                          <option value="all">Tất cả giao thức</option>
                          <option value="REST API (JSON)">REST API (JSON)</option>
                          <option value="SOAP (XML)">SOAP (XML)</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5 relative z-10">
                      <label className="text-[13px] font-medium text-slate-700">Trạng thái</label>
                      <div className="relative">
                        <select
                          value={filterStatus}
                          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm appearance-none cursor-pointer"
                        >
                          <option value="all">Tất cả trạng thái</option>
                          <option value="published">Đang công khai</option>
                          <option value="pending">Chờ phê duyệt</option>
                          <option value="draft">Bản nháp</option>
                          <option value="approved">Đã duyệt</option>
                          <option value="rejected">Từ chối</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid Table Card */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
                      <tr className="text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4 font-semibold text-slate-500 text-[13px]">Mã / Tên API</th>
                        <th className="py-3 px-4 font-semibold text-slate-500 text-[13px]">Loại dữ liệu chia sẻ</th>
                        <th className="py-3 px-4 font-semibold text-slate-500 text-[13px]">Tần suất đối soát</th>
                        <th className="py-3 px-4 font-semibold text-slate-500 text-[13px]">Giao thức / Định dạng</th>
                        <th className="py-3 px-4 font-semibold text-slate-500 text-[13px]">Trạng thái</th>
                        <th className="py-3 px-4 font-semibold text-slate-500 text-[13px]">Người tạo / Ngày tạo</th>
                        {activeTab === 'publish' && (
                          <th className="py-3 px-4 font-semibold text-slate-500 text-[13px]">Ngày công khai</th>
                        )}
                        <th className="py-3 px-4 font-semibold text-slate-500 text-[13px] text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedServices.length === 0 ? (
                        <tr>
                          <td colSpan={activeTab === 'publish' ? 8 : 7} className="py-8 text-center text-slate-500 font-medium text-[13px]">
                            Không tìm thấy dịch vụ phù hợp với bộ lọc hiện tại.
                          </td>
                        </tr>
                      ) : (
                        paginatedServices.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-all group border-b border-slate-100">
                            <td className="py-3 px-4 text-left">
                              <div className="font-semibold text-slate-900 text-[13px] leading-snug">{item.name}</div>
                              <div className="text-xs font-mono text-slate-500 mt-1">{item.code}</div>
                            </td>
                            <td className="py-3 px-4 text-left text-slate-600 text-[13px]">{item.type}</td>
                            <td className="py-3 px-4 text-left text-slate-600 text-[13px]">{item.freq}</td>
                            <td className="py-3 px-4 text-left font-mono text-slate-600 text-xs">{item.protocol}</td>
                            <td className="py-3 px-4 text-left">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.status === 'published'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : item.status === 'pending'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : item.status === 'draft'
                                    ? 'bg-slate-50 text-slate-500 border border-slate-200'
                                    : item.status === 'approved'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                {item.status === 'published' ? 'Đang công khai' : item.status === 'pending' ? 'Chờ phê duyệt' : item.status === 'approved' ? 'Đã duyệt' : item.status === 'draft' ? 'Bản nháp' : 'Từ chối'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-left text-slate-600 text-xs font-medium whitespace-nowrap">
                              <div className="font-semibold text-slate-700 text-[13px]">{item.creator || 'Hệ thống BTP'}</div>
                              <div className="text-slate-400 font-mono mt-0.5">{formatDateTime(item.date || new Date().toISOString())}</div>
                            </td>
                            {activeTab === 'publish' && (
                              <td className="py-3 px-4 text-left text-slate-600 text-sm font-mono whitespace-nowrap font-semibold text-[13px]">
                                {item.publishDate ? item.publishDate : <span className="text-slate-300">—</span>}
                              </td>
                            )}
                            <td className="py-3 px-4 text-right">
                               {activeTab === 'publish' ? (
                                 <div className="flex items-center justify-end gap-1">
                                   <button
                                     onClick={() => {
                                       setSelectedService(item);
                                       setServiceModalMode('view');
                                       setShowServiceModal(true);
                                     }}
                                     className="p-1.5 text-slate-500 hover:text-[#2563eb] hover:bg-blue-50 rounded-[6px] transition-all inline-flex items-center justify-center group cursor-pointer"
                                     title="Xem chi tiết API"
                                   >
                                     <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                   </button>
                                   <button
                                     disabled={item.status === 'published'}
                                     onClick={() => {
                                       if (item.status !== 'published') {
                                         setSelectedService(item);
                                         setShowPublishModal(true);
                                       }
                                     }}
                                     className={`p-1.5 rounded-[6px] transition-all inline-flex items-center justify-center group ${
                                       item.status === 'published'
                                         ? 'text-slate-300 cursor-not-allowed opacity-50'
                                         : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer'
                                     }`}
                                     title={item.status === 'published' ? "Dịch vụ đã được công khai" : "Công khai dịch vụ"}
                                   >
                                     <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                   </button>
                                 </div>
                               ) : (
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => {
                                      setSelectedService(item);
                                      setServiceModalMode('view');
                                      setShowServiceModal(true);
                                    }}
                                    className="p-1.5 text-slate-500 hover:text-[#2563eb] hover:bg-blue-50 rounded-[6px] transition-all inline-flex items-center justify-center group"
                                    title="Xem chi tiết"
                                  >
                                    <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedService(item);
                                      setServiceModalMode('edit');
                                      setShowServiceModal(true);
                                    }}
                                    className="p-1.5 text-black hover:text-slate-700 hover:bg-slate-100 rounded-[6px] transition-all inline-flex items-center justify-center group"
                                    title="Chỉnh sửa"
                                  >
                                    <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                  </button>
                                  {(() => {
                                    const isDeletable = ['draft', 'pending', 'rejected'].includes(item.status);
                                    return (
                                      <button
                                        disabled={!isDeletable}
                                        onClick={() => {
                                          if (isDeletable) {
                                            setSelectedService(item);
                                            setShowDeleteConfirmModal(true);
                                          }
                                        }}
                                        className={`p-1.5 rounded-[6px] transition-all inline-flex items-center justify-center group ${
                                          isDeletable
                                            ? 'text-red-500 hover:bg-red-50 cursor-pointer'
                                            : 'text-slate-300 cursor-not-allowed opacity-50'
                                        }`}
                                        title={isDeletable ? "Xóa dịch vụ" : "Không thể xóa dịch vụ ở trạng thái này"}
                                      >
                                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                      </button>
                                    );
                                  })()}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
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
                      {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredServices.length)} / {filteredServices.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
                      >
                        Trước
                      </button>
                      
                      {Array.from({ length: Math.ceil(filteredServices.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
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
                          const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
                          if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1);
                          }
                        }}
                        disabled={currentPage === Math.ceil(filteredServices.length / itemsPerPage) || filteredServices.length === 0}
                        className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProvisionServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onSave={(isPublic) => {
          if (isPublic) setActiveTab('publish');
        }}
        onSaveDraft={() => {
          const newService = selectedService ? { ...selectedService, status: 'draft' } : {
            id: Date.now().toString(),
            name: 'Bản nháp dịch vụ mới',
            code: `DV_DRAFT_${Math.floor(Math.random() * 1000)}`,
            type: 'Chưa xác định',
            freq: 'Chưa cấu hình',
            protocol: 'REST API',
            status: 'draft'
          };

          if (selectedService) {
            setServices(services.map(s => s.id === selectedService.id ? newService : s));
          } else {
            setServices([...services, newService]);
          }
          setShowServiceModal(false);
          alert("Đã lưu bản nháp dịch vụ!");
        }}
        onSubmitApproval={() => {
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

          alert(`Đã gửi trình duyệt thành công!`);
          setShowSubmitApprovalModal(false);
          setActiveTab('approve');
          setApprovalFilterStatus('pending');
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
          alert(`Đã phê duyệt dịch vụ: ${serviceToApprove.name}${reason ? `. Lý do: ${reason}` : ''}`);
        }}
        onReject={(serviceToReject, reason) => {
          setServices(services.map(s => s.id === serviceToReject.id ? { ...s, status: 'rejected', rejectReason: reason } : s));
          setShowApprovalModal(false);
          alert(`Đã từ chối dịch vụ: ${serviceToReject.name}. Lý do: ${reason}`);
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
          alert(`Đã công khai dịch vụ: ${serviceToPublish.name} thành công!${reason ? ` Lý do: ${reason}` : ''}`);
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
          alert(`Đã phê duyệt dịch vụ: ${serviceToApprove.name}`);
        }}
        onReject={(serviceToReject) => {
          setServices(services.map(s => s.id === serviceToReject.id ? { ...s, status: 'rejected' } : s));
          alert(`Đã từ chối dịch vụ: ${serviceToReject.name}`);
        }}
      />

      {showDeleteConfirmModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Xác nhận xóa dịch vụ</h3>
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            {/* Content */}
            <div className="p-6">
              <p className="text-[13px] text-slate-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa dịch vụ <strong className="text-slate-900">{selectedService.name}</strong> ({selectedService.code}) không? Hành động này không thể hoàn tác.
              </p>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 bg-white text-[#020817] border border-[#e2e8f0] hover:bg-slate-50 rounded-lg font-medium text-[13px] transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleDeleteService(selectedService.id)}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium text-[13px] transition-colors"
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
