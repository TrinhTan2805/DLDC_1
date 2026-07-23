import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, RefreshCw, Search, Plus, Eye, Edit, Settings as SettingsIcon, Trash2, FileText, Activity, Settings, AlertCircle, AlertTriangle, X, Download, Send, ChevronLeft, ChevronRight, Calendar, Wrench, Power, Layers, Database, Eraser, CheckCircle, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '../../ui/dropdown-menu';
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

  const mockServices = mockCollectionServices;

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

      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' ? (!service.status?.startsWith('draft') && !service.status?.startsWith('inactive')) : service.status === statusFilter);

      return matchesDate &&
        matchesStatus &&
        (typeFilter === 'all' || service.type === typeFilter) &&
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
    active: mockServices.filter(s => s.status === 'success').length,
    maintenance: mockServices.filter(s => s.status === 'format_error').length,
    inactive: mockServices.filter(s => s.status === 'structure_error').length
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
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('service-setup')}
            className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 ${activeTab === 'service-setup'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            <Settings className="w-5 h-5" />
            Thiết lập dịch vụ
          </button>
          <button
            onClick={() => setActiveTab('version')}
            className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 ${activeTab === 'version'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
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
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-base text-slate-500">Tổng số dịch vụ đã thiết lập</div>
                    <div className="text-base font-semibold text-slate-950">{stats.total}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-base text-slate-500">Đang hoạt động</div>
                    <div className="text-base font-semibold text-slate-950">{stats.active}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Settings className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-base text-slate-500">Bản nháp</div>
                    <div className="text-base font-semibold text-slate-950">{stats.maintenance}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-base text-slate-500">Ngưng hoạt động</div>
                    <div className="text-base font-semibold text-slate-950">{stats.inactive}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Actions */}
            <div className="mb-6">
              {/* Row 1: Search and Buttons */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-3">
                  <div className="relative flex-1">
                    <input aria-label="Input field"
                      type="text"
                      placeholder="Tìm kiếm theo tên dịch vụ, hệ thống nguồn"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
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
                    onClick={() => navigate('/collection-setup/add')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm mới
                  </button>
                  <button
                    onClick={handleExportServiceList}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium"
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
                    <label className="text-[13px] font-medium text-slate-700">Loại kết nối</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="all">Tất cả phương thức</option>
                      <option value="Cơ sở dữ liệu">Cơ sở dữ liệu</option>
                      <option value="API">API</option>
                      <option value="Tải file Excel">Tải file Excel</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-[13px] font-medium text-slate-700">Nguồn dữ liệu</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                    >
                      <option value="all">Tất cả nguồn dữ liệu</option>
                      <option value="Trong ngành">Trong ngành</option>
                      <option value="Ngoài ngành">Ngoài ngành</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-[13px] font-medium text-slate-700">Hệ thống nguồn</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
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
                    <label className="text-[13px] font-medium text-slate-700">Trạng thái</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
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
                    <label className="text-[13px] font-medium text-slate-700">Thời gian từ</label>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                      <input aria-label="Input field"
                        type="date"
                        className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-slate-700 p-0"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-[13px] font-medium text-slate-700">Thời gian đến</label>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                      <input aria-label="Input field"
                        type="date"
                        className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-slate-700 p-0"
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
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse collection-table text-[13px]">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
                    <tr>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-12 text-[13px]">STT</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Mã / Tên dịch vụ</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Phương thức kết nối</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Hệ thống nguồn</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Kích thước dữ liệu</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-20 text-[13px]">Phiên bản</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Ngày tạo</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Trạng thái dịch vụ</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Trạng thái dữ liệu</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-32 text-[13px]">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredServices
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((service, index) => (
                        <tr key={service.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                          <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">{index + 1}</td>
                          <td className="px-4 py-3 text-left text-[13px] min-w-[300px]">
                            <div className="max-w-[440px]">
                              <div className="font-medium text-slate-800 leading-snug break-words line-clamp-2 text-[13px]" title={service.name}>{service.name}</div>
                              <div className="font-mono text-[13px] italic truncate leading-tight tracking-tight mt-1" style={{ color: '#94a3b8' }} title={service.code}>{service.code}</div>
                              {service.description && <div className="text-slate-500 mt-1 line-clamp-2 text-[12px]">{service.description}</div>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <StatusTag
                              label={service.type === 'SOAP' ? 'Cơ sở dữ liệu' : service.type === 'REST' ? 'API' : 'Tải file Excel'}
                              variant={service.type === 'SOAP' ? 'indigo' : service.type === 'REST' ? 'emerald' : 'amber'}
                            />
                          </td>
                          <td className="px-4 py-3 text-left">
                            <div className="max-w-[180px]">
                              <div className="leading-snug text-slate-900 font-medium text-[13px]">{service.managingUnit}</div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${service.source === 'Trong ngành' ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                                <span className="text-[12px] italic text-slate-400">{service.source}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap text-[13px]">
                            <div className="font-medium text-slate-800">{service.dataSize || formatDataSize(service.recordsReceived)}</div>
                            <div className="font-medium text-slate-500 mt-0.5">{(service.recordCount ?? service.recordsReceived ?? 0).toLocaleString('vi-VN')} bản ghi</div>
                          </td>
                          <td className="px-4 py-3 text-center text-slate-600 font-medium font-mono text-[13px]">{service.version}</td>
                          <td className="px-4 py-3 text-center text-slate-500 font-medium font-mono whitespace-nowrap text-[13px]">
                            {service.updatedAt.split(' ').map((part: string, i: number) => (
                              <div key={i}>{part}</div>
                            ))}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <StatusTag 
                              label={service.status === 'draft' ? 'Bản nháp' : service.status === 'inactive' ? 'Ngưng hoạt động' : 'Hoạt động'} 
                              variant={service.status === 'draft' ? 'slate' : service.status === 'inactive' ? 'gray' : 'green'} 
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            {(() => {
                              const dataStatus = service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY');
                              const label = dataStatus === 'EMPTY' ? 'Rỗng' :
                                dataStatus === 'PROCESSING' ? 'Đang lấy dữ liệu' :
                                dataStatus === 'DATA_UPDATED' ? 'Cập nhật thành công' :
                                dataStatus === 'DATA_INCOMPLETED' ? 'Lỗi cấu trúc' :
                                'Lỗi cập nhật';
                              const variant = dataStatus === 'EMPTY' ? 'slate' :
                                dataStatus === 'PROCESSING' ? 'blue' :
                                dataStatus === 'DATA_UPDATED' ? 'emerald' :
                                dataStatus === 'DATA_INCOMPLETED' ? 'orange' :
                                'red';
                              return <StatusTag label={label} variant={variant as any} />;
                            })()}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Nút ngoài: Maping chi tiết, Quản lý */}
                              <button
                                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                title="Maping chi tiết"
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
                              </button>
                              <button
                                className="p-1.5 text-slate-500 hover:text-[#2563eb] hover:bg-blue-50 rounded-[6px] transition-all"
                                title="Quản lý"
                                onClick={() => {
                                  setSelectedService(service);
                                  navigate(`/collection-setup/view/${service.id}`);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Menu "..." chia 2 mục: Dữ liệu / Dịch vụ */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-[6px] transition-all focus:outline-none"
                                    title="Thao tác khác"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 text-[13px] bg-white border border-slate-200 shadow-[0_10px_25px_rgba(15,23,42,0.15)]">
                                  <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 px-2 py-1">Dữ liệu</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedService(service);
                                      setShowIntegrateWarningModal(true);
                                    }}
                                  >
                                    <Plus className="w-4 h-4 text-indigo-500" />
                                    Tích hợp mới
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedService(service);
                                      setShowUpdateSuccessModal(true);
                                    }}
                                  >
                                    <RefreshCw className="w-4 h-4 text-emerald-500" />
                                    Cập nhật dữ liệu
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onClick={() => {
                                      setSelectedService(service);
                                      setShowDeleteDataConfirmModal(true);
                                    }}
                                  >
                                    <Eraser className="w-4 h-4 text-orange-500" />
                                    Xóa dữ liệu thu thập
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 px-2 py-1">Dịch vụ</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedService(service);
                                      setShowInactiveModal(true);
                                    }}
                                  >
                                    <Power className="w-4 h-4 text-amber-500" />
                                    Ngừng hoạt động
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onClick={() => {
                                      setSelectedService(service);
                                      setShowDeleteModal(true);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                    Xóa dịch vụ
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 collection-pagination text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">Hiển thị</span>
                  <select aria-label="Select record count" 
                    className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[13px]"
                    title="Số bản ghi trên trang"
                  >
                    <option>10</option>
                    <option>20</option>
                    <option>50</option>
                    <option>100</option>
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
                      disabled={currentPage === Math.ceil(filteredServices.length / itemsPerPage)}
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
        onViewData={(pageId?: string) => {
          closeModal();
          if (pageId && onNavigate) {
            onNavigate(pageId);
          } else {
            setShowDataDetailPage(true);
          }
        }}
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
              style={{ padding: '8px 24px', borderRadius: '6px', fontWeight: 500 }}
              className="bg-blue-600 text-white text-[13px] hover:bg-blue-700 transition-all shadow-sm active:scale-95"
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all font-medium shadow-sm text-[13px]"
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
              <h4 className="text-[15px] font-bold text-slate-800 leading-snug">
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
                <h3 className="text-base font-medium text-slate-950">
                  Chi tiết kiểm tra cấu trúc - {selectedService.statusText}
                </h3>
                <p className="text-base mt-0.5 text-slate-600">
                  Dịch vụ: {selectedService.name} ({selectedService.code})
                </p>
              </div>
              <button
                onClick={() => setShowErrorDetailModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-5">
                {/* Summary */}
                <div>
                  <h4 className="text-base font-medium text-slate-950 mb-3">Tổng quan</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-base text-slate-600 mb-1">Tổng số bản ghi</div>
                      <div className="text-xl font-medium text-slate-950">
                        {selectedService.validationDetails.totalRecords.toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-base text-slate-600 mb-1">Bản ghi hợp lệ</div>
                      <div className="text-xl font-medium text-green-600">
                        {selectedService.validationDetails.validRecords.toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-base text-slate-600 mb-1">Bản ghi lỗi</div>
                      <div className="text-xl font-medium text-red-600">
                        {selectedService.validationDetails.invalidRecords.toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Details */}
                {selectedService.validationDetails.errors && selectedService.validationDetails.errors.length > 0 && (
                  <div>
                    <h4 className="text-base font-medium text-slate-950 mb-3">Chi tiết lỗi</h4>
                    <div className="space-y-3">
                      {selectedService.validationDetails.errors.map((error: any, index: number) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="font-medium text-slate-950 text-base">{error.field}</h5>
                              <p className="text-base text-slate-600 mt-0.5">{error.message}</p>
                            </div>
                            <StatusTag label={`${error.count} lỗi`} variant="red" />
                          </div>
                          {error.examples && (
                            <div className="mb-3">
                              <div className="text-base text-slate-500 mb-1.5">Ví dụ:</div>
                              <div className="flex flex-wrap gap-2">
                                {error.examples.map((example: string, idx: number) => (
                                  <code key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-base font-mono">
                                    {example}
                                  </code>
                                ))}
                              </div>
                            </div>
                          )}
                          {error.expectedFormat && (
                            <div className="text-base text-slate-600 bg-slate-50 px-3 py-2 rounded">
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
                        <h5 className="font-medium text-red-900 text-base mb-1">
                          {selectedService.errorDetails.errorCode}: {selectedService.errorDetails.errorMessage}
                        </h5>
                        <p className="text-base text-red-700 mb-2">
                          {selectedService.errorDetails.errorDescription}
                        </p>
                        <div className="text-base text-red-600">
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
                className="px-4 py-2 text-base text-[#020817] bg-white border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors font-medium shadow-sm"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  sendNotificationToSource(selectedService);
                  setShowErrorDetailModal(false);
                }}
                className="px-4 py-2 text-base text-white bg-[#2563eb] rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
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
                <h3 className="text-xl font-medium text-slate-950 flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Power className="w-5 h-5 text-amber-600" />
                  </div>
                  Ngừng hoạt động
                </h3>
                <button onClick={() => setShowInactiveModal(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors">
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
                    <p className="text-base text-red-800/80 leading-relaxed font-medium">
                      Bạn có chắc muốn ngừng hoạt động của dịch vụ <span className="font-medium text-red-900">{selectedService?.name}</span>? Hành động này sẽ khiến luồng dữ liệu bị gián đoạn cho đến khi được kích hoạt lại thủ công.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-medium text-slate-700 ml-1">
                    Lý do ngừng hoạt động <span className="text-red-500 font-black">*</span>
                  </label>
                  <textarea
                    className="w-full px-5 py-4 border border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 min-h-[140px] text-base bg-slate-50/30 outline-none transition-all placeholder:text-slate-400 resize-none"
                    placeholder="Vui lòng nhập lý do cụ thể (ví dụ: Thay đổi cấu hình Máy chủ thực thi, bảo trì định kỳ hệ thống nguồn...)"
                    value={inactiveReason}
                    onChange={(e) => setInactiveReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
                <button
                  onClick={() => setShowInactiveModal(false)}
                  className="px-6 py-2.5 text-base text-slate-600 hover:text-slate-950 hover:bg-slate-200 rounded-lg transition-all"
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
                  className="px-8 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg text-base hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg shadow-amber-200 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transform active:scale-95"
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