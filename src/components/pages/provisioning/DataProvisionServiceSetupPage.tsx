import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Settings, CheckCircle, XCircle, Share2, Search, Filter, Plus, FileText, Activity, Eye, Pencil, RefreshCw, ChevronDown, Ban } from 'lucide-react';
import { ProvisionServiceModal } from './modals/ProvisionServiceModal';
import { ProvisionServiceApprovalModal } from './modals/ProvisionServiceApprovalModal';
import { ProvisionServicePublishModal } from './modals/ProvisionServicePublishModal';
import { SubmitApprovalModal } from './modals/SubmitApprovalModal';
import { ProvisionServicePublicDetailsModal } from './modals/ProvisionServicePublicDetailsModal';

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
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSubmitApprovalModal, setShowSubmitApprovalModal] = useState(false);
  const [showPublicDetailsModal, setShowPublicDetailsModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [approvalModalMode, setApprovalModalMode] = useState<'approve' | 'reject'>('approve');

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

  // Dynamic services list (including standard fields from UI mockups)
  const [services, setServices] = useState([
    { id: '1', name: 'DV_Hộ tịch điện tử', code: 'DV_001', type: 'Dữ liệu Hộ tịch điện tử', freq: 'Thời gian thực', protocol: 'REST API', status: 'pending', date: '2026-05-11 08:00:00', publishDate: '' },
    { id: '2', name: 'DV_Thi hành án dân sự', code: 'DV_002', type: 'Dữ liệu Thi hành án dân sự', freq: 'Hàng ngày', protocol: 'SOAP', status: 'published', date: '2026-05-10 09:00:00', publishDate: '11/05/2026 08:00:00' }
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
    if (approvalFilter === 'all') return true;
    return item.status === approvalFilter;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/30 px-6 py-2 flex items-center justify-between">
          <nav className="flex space-x-12" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('setup')}
              className={`whitespace-nowrap py-4 px-2 border-b-2 font-bold text-xs uppercase tracking-[0.2em] flex items-center transition-all ${activeTab === 'setup'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
                }`}
            >
              <Settings className="w-4 h-4 mr-3" />
              Thiết lập dịch vụ
            </button>
            <button
              onClick={() => setActiveTab('approve')}
              className={`whitespace-nowrap py-4 px-2 border-b-2 font-bold text-xs uppercase tracking-[0.2em] flex items-center transition-all ${activeTab === 'approve'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
                }`}
            >
              <CheckCircle className="w-4 h-4 mr-3" />
              Kiểm tra & Phê duyệt
            </button>
            <button
              onClick={() => setActiveTab('publish')}
              className={`whitespace-nowrap py-4 px-2 border-b-2 font-bold text-xs uppercase tracking-[0.2em] flex items-center transition-all ${activeTab === 'publish'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
                }`}
            >
              <Share2 className="w-4 h-4 mr-3" />
              Công khai dịch vụ
            </button>
          </nav>

          <button
            onClick={() => { setSelectedService(null); setShowServiceModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center transition-all shadow-md shadow-blue-200 font-bold text-xs uppercase tracking-widest"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo API Cung cấp mới
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'approve' ? (
            <div className="space-y-6">
              {/* Approval Sub-tabs */}
              <div className="flex border-b border-slate-100 mb-6">
                <button
                  onClick={() => setApprovalFilter('all')}
                  className={`px-6 py-2 border-b-2 font-bold text-xs uppercase tracking-widest transition-colors ${approvalFilter === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  Tất cả ({services.filter(s => ['pending', 'approved', 'rejected'].includes(s.status)).length})
                </button>
                <button
                  onClick={() => setApprovalFilter('pending')}
                  className={`px-6 py-2 border-b-2 font-bold text-xs uppercase tracking-widest transition-colors ${approvalFilter === 'pending' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  Chờ phê duyệt ({services.filter(a => a.status === 'pending').length})
                </button>
                <button
                  onClick={() => setApprovalFilter('approved')}
                  className={`px-6 py-2 border-b-2 font-bold text-xs uppercase tracking-widest transition-colors ${approvalFilter === 'approved' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  Đã phê duyệt ({services.filter(a => a.status === 'approved').length})
                </button>
                <button
                  onClick={() => setApprovalFilter('rejected')}
                  className={`px-6 py-2 border-b-2 font-bold text-xs uppercase tracking-widest transition-colors ${approvalFilter === 'rejected' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  Từ chối ({services.filter(a => a.status === 'rejected').length})
                </button>
              </div>

              {/* Search Bar - Specific for Approval */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tra cứu dịch vụ phê duyệt..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Approval Cards List */}
              <div className="grid grid-cols-1 gap-4" key={approvalFilter}>
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
                          onClick={() => { setSelectedService(item); setShowServiceModal(true); }}
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
                              className="px-4 py-2 text-xs font-bold text-red-500 hover:text-white border border-red-300 rounded-lg hover:bg-red-500 transition-all uppercase tracking-widest flex items-center gap-2 cursor-pointer"
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
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm dịch vụ theo tên hoặc mã..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-2 border rounded-lg transition-all text-sm font-medium ${showFilters
                    ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Bộ lọc
                  {(filterDataType !== 'all' || filterFreq !== 'all' || filterProtocol !== 'all' || filterStatus !== 'all') && (
                    <span className="ml-1.5 w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </button>
              </div>

              {showFilters && (
                <div className="p-4 bg-slate-50/50 border border-slate-200/80 rounded-xl mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Phân loại dữ liệu</label>
                    <div className="relative">
                      <select
                        value={filterDataType}
                        onChange={(e) => setFilterDataType(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                      >
                        <option value="all">-- Chọn phân loại --</option>
                        <option value="Dữ liệu Hộ tịch điện tử">Dữ liệu Hộ tịch điện tử</option>
                        <option value="Dữ liệu Hồ sơ quốc tịch">Dữ liệu Hồ sơ quốc tịch</option>
                        <option value="Dữ liệu Thi hành án dân sự">Dữ liệu Thi hành án dân sự</option>
                        <option value="Dữ liệu Lý lịch tư pháp">Dữ liệu Lý lịch tư pháp</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tần suất</label>
                    <div className="relative">
                      <select
                        value={filterFreq}
                        onChange={(e) => setFilterFreq(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                      >
                        <option value="all">Tất cả tần suất</option>
                        <option value="Thời gian thực">Thời gian thực</option>
                        <option value="Hàng ngày">Hàng ngày</option>
                        <option value="Hàng tuần">Hàng tuần</option>
                        <option value="Hàng tháng">Hàng tháng</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Giao thức</label>
                    <div className="relative">
                      <select
                        value={filterProtocol}
                        onChange={(e) => setFilterProtocol(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                      >
                        <option value="all">Tất cả giao thức</option>
                        <option value="REST API">REST API</option>
                        <option value="SOAP">SOAP</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Trạng thái</label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                        >
                          <option value="all">Tất cả trạng thái</option>
                          <option value="draft">Bản nháp</option>
                          <option value="pending">Chờ phê duyệt</option>
                          <option value="published">Đã công khai</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>

                      <button
                        onClick={() => {
                          setFilterDataType('all');
                          setFilterFreq('all');
                          setFilterProtocol('all');
                          setFilterStatus('all');
                          setSearchTerm('');
                        }}
                        title="Xóa bộ lọc"
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-lg transition-colors border border-slate-200 flex items-center justify-center"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                      <th className="py-3 px-4 font-medium">Tên dịch vụ</th>
                      <th className="py-3 px-4 font-medium">Phân loại dữ liệu</th>
                      <th className="py-3 px-4 font-medium">Tần suất</th>
                      <th className="py-3 px-4 font-medium">Giao thức</th>
                      <th className="py-3 px-4 font-medium">Trạng thái</th>
                      <th className="py-3 px-4 font-medium">Ngày tạo</th>
                      {activeTab === 'publish' && (
                        <th className="py-3 px-4 font-medium">Ngày công khai</th>
                      )}
                      <th className="py-3 px-4 font-medium text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredServices.length === 0 ? (
                      <tr>
                        <td colSpan={activeTab === 'publish' ? 8 : 7} className="py-8 text-center text-slate-500 font-medium">
                          Không tìm thấy dịch vụ phù hợp với bộ lọc hiện tại.
                        </td>
                      </tr>
                    ) : (
                      filteredServices.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-medium text-slate-800">{item.name}</td>
                          <td className="py-3 px-4 text-slate-600">{item.type}</td>
                          <td className="py-3 px-4 text-slate-600">{item.freq}</td>
                          <td className="py-3 px-4 text-slate-600">{item.protocol}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'pending'
                                ? 'bg-blue-100 text-blue-800'
                                : item.status === 'draft'
                                  ? 'bg-slate-100 text-slate-600'
                                  : item.status === 'approved'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-red-100 text-red-800'
                              }`}>
                              {item.status === 'published' ? 'Đã công khai' : item.status === 'pending' ? 'Chờ phê duyệt' : item.status === 'approved' ? 'Đã duyệt' : item.status === 'draft' ? 'Bản nháp' : 'Từ chối'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 text-sm font-mono whitespace-nowrap">
                            {formatDateTime(item.date || new Date().toISOString())}
                          </td>
                          {activeTab === 'publish' && (
                            <td className="py-3 px-4 text-slate-600 text-sm font-mono whitespace-nowrap">
                              {item.publishDate ? item.publishDate : <span className="text-slate-300">—</span>}
                            </td>
                          )}
                          <td className="py-3 px-4 text-right">
                            {activeTab === 'publish' ? (
                              item.status === 'approved' ? (
                                <button
                                  onClick={() => {
                                    setSelectedService(item);
                                    setShowPublishModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-end gap-1 ml-auto group cursor-pointer"
                                  title="Công khai dịch vụ"
                                >
                                  <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                  <span>Công khai</span>
                                </button>
                              ) : (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedService(item);
                                      setShowPublicDetailsModal(true);
                                    }}
                                    className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"
                                    title="Chi tiết API"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Chi tiết API</span>
                                  </button>
                                </div>
                              )
                            ) : (
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedService(item);
                                    setShowServiceModal(true);
                                  }}
                                  className="text-slate-400 hover:text-blue-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all inline-flex items-center justify-center group"
                                  title="Xem chi tiết"
                                >
                                  <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedService(item);
                                    setShowServiceModal(true);
                                  }}
                                  className="text-slate-400 hover:text-indigo-600 p-1.5 hover:bg-indigo-50 rounded-lg transition-all inline-flex items-center justify-center group"
                                  title="Chỉnh sửa"
                                >
                                  <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
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
          setApprovalFilter('pending');
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
    </div>
  );
}
