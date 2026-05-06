import { useState, useEffect } from 'react';
import { Filter, RefreshCw, Search, Plus, Eye, Edit, Settings as SettingsIcon, Trash2, FileText, Activity, Settings, AlertCircle, X, Download, Send, ChevronLeft, ChevronRight, Calendar, Wrench, Power } from 'lucide-react';
import { AddServiceModal, EditServiceModal, DeleteServiceModal, SettingsServiceModal } from './ServiceModals';
import { ViewServiceModal } from './ViewServiceModal';
import { LogManagement } from './LogManagement';
import { mockCollectionServices } from './mockCollectionServices';
import { ServiceDataDetailPage } from './ServiceDataDetailPage';

export function CollectionSetupPage({ onNavigate }: { onNavigate?: (pageId: string) => void }) {
  const [activeTab, setActiveTab] = useState<'service-setup' | 'version'>('service-setup');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showErrorDetailModal, setShowErrorDetailModal] = useState(false);
  const [showDataDetailPage, setShowDataDetailPage] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all'); // New: nguồn dữ liệu filter
  const [departmentFilter, setDepartmentFilter] = useState('all'); // New: cục/vụ filter
  const [navigateToPage, setNavigateToPage] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const handleNavLog = (e: any) => {
      setShowAddServiceModal(false);
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
  const [startDate, setStartDate] = useState(defaultRange.start);
  const [endDate, setEndDate] = useState(defaultRange.end);

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
    // Không reset date range vì chỉ là UI display
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
      // Removed date filtering logic - date picker is just for UI display

      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' ? (!service.status?.startsWith('draft') && !service.status?.startsWith('inactive')) : service.status === statusFilter);

      return matchesStatus &&
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
    <div className="h-full flex flex-col bg-slate-50">
      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('service-setup')}
            className={`pb-3 pt-4 text-sm transition-colors border-b-2 ${activeTab === 'service-setup'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            Thiết lập dịch vụ
          </button>
          <button
            onClick={() => setActiveTab('version')}
            className={`pb-3 pt-4 text-sm transition-colors border-b-2 ${activeTab === 'version'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
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
                    <div className="text-xs text-slate-500">Tổng số dữ liệu đã thiết lập</div>
                    <div className="text-2xl text-slate-900">{stats.total}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Đang hoạt động</div>
                    <div className="text-2xl text-slate-900">{stats.active}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Settings className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Đang bảo trì</div>
                    <div className="text-2xl text-slate-900">{stats.maintenance}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Ngưng hoạt động</div>
                    <div className="text-2xl text-slate-900">{stats.inactive}</div>
                  </div>
                </div>
              </div>
            </div>

                        {/* Filters and Actions */}
            <div className="mb-6">
              {/* Row 1: Search and Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-[300px]">
                    <input aria-label="Input field"
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                  <button className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </button>
                  <button onClick={resetFilters} className="p-2 bg-rose-100 text-rose-500 rounded-lg hover:bg-rose-200 transition-colors shadow-sm flex items-center justify-center" title="Làm mới">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowFilters(!showFilters)} 
                    className={`p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center ${showFilters ? 'bg-blue-50 border border-blue-200 text-blue-500' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                    title="Bộ lọc"
                  >
                    {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddServiceModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm mới
                  </button>
                </div>
              </div>

              {/* Row 2: Filters (Collapsible) */}
              {showFilters && (
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-5 gap-6 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
                  <div className="absolute -top-2 left-[330px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>
                  
                  <div className="space-y-1.5 relative z-10">
                    <label className="text-xs font-bold text-slate-700">Loại kết nối</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
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
                    <label className="text-xs font-bold text-slate-700">Nguồn dữ liệu</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                    >
                      <option value="all">Tất cả nguồn dữ liệu</option>
                      <option value="Trong ngành">Trong ngành</option>
                      <option value="Ngoài ngành">Ngoài ngành</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-xs font-bold text-slate-700">Hệ thống nguồn</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
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
                    <label className="text-xs font-bold text-slate-700">Trạng thái</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
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
                    <label className="text-xs font-bold text-slate-700">Thời gian</label>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                      <input aria-label="Input field"
                        type="date"
                        className="w-full border-0 bg-transparent text-sm focus:outline-none text-slate-700 p-0"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Services Table */}
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-center text-xs text-slate-600 uppercase">STT</th>
                      <th className="px-4 py-3 text-center text-xs text-slate-600 uppercase">Tên dịch vụ</th>
                      <th className="px-4 py-3 text-center text-xs text-slate-600 uppercase">Loại nguồn </th>
                      <th className="px-4 py-3 text-center text-xs text-slate-600 uppercase whitespace-nowrap">Phương thức kết nối</th>
                      <th className="px-4 py-3 text-center text-xs text-slate-600 uppercase">Phiên bản</th>
                      <th className="px-4 py-3 text-center text-xs text-slate-600 uppercase whitespace-nowrap">Hệ thống nguồn</th>
                      <th className="px-4 py-3 text-center text-xs text-slate-600 uppercase">Ngày sửa</th>
                      <th className="px-4 py-3 text-center text-xs text-slate-600 uppercase">Trạng thái dịch vụ</th>
                      <th className="px-4 py-3 text-center text-xs text-slate-600 uppercase">Trạng thái dữ liệu</th>
                      <th className="px-4 py-3 text-center text-xs text-slate-600 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredServices
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((service, index) => (
                        <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-slate-600 text-center">{index + 1}</td>
                          <td className="px-4 py-3 text-center">
                            <div>
                              <div className="text-sm text-slate-900">{service.name}</div>
                              <div className="text-xs text-slate-500">{service.description}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 text-center">
                            {service.source}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex px-2 py-1 rounded text-xs ${service.type === 'SOAP' ? 'bg-purple-100 text-purple-700' :
                                service.type === 'REST' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                              }`}>
                              {service.type === 'SOAP' ? 'Cơ sở dữ liệu' : service.type === 'REST' ? 'API' : 'Tải file Excel'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 text-center">{service.version}</td>
                          <td className="px-4 py-3 text-sm text-slate-600 text-center">{service.managingUnit}</td>
                          <td className="px-4 py-3 text-sm text-slate-600 text-center">{service.updatedAt}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${
                              service.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                              service.status === 'inactive' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {service.status === 'draft' ? 'Bản nháp' :
                               service.status === 'inactive' ? 'Ngưng hoạt động' :
                               'Hoạt động'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${(service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'EMPTY' ? 'bg-slate-100 text-slate-600' :
                                (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                                  (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'DATA_UPDATED' ? 'bg-green-100 text-green-700' :
                                    (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'DATA_INCOMPLETED' ? 'bg-orange-100 text-orange-700' :
                                      (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'DATA_UPDATE_FAILED' ? 'bg-red-100 text-red-700' :
                                        'bg-slate-100 text-slate-600'
                              }`}>
                              {(service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'EMPTY' ? 'Rỗng' :
                                (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'PROCESSING' ? 'Đang lấy dữ liệu' :
                                  (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'DATA_UPDATED' ? 'Cập nhật thành công' :
                                    (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'DATA_INCOMPLETED' ? 'Lỗi cấu trúc' :
                                      (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'DATA_UPDATE_FAILED' ? 'Lỗi cập nhật' :
                                        'Rỗng'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Quản lý"
                                onClick={() => {
                                  setSelectedService(service);
                                  setShowDetailModal(true);
                                }}
                              >
                                <SettingsIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => {
                      const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                    disabled={currentPage === Math.ceil(filteredServices.length / itemsPerPage)}
                    className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, filteredServices.length)}
                      </span>{' '}
                      trong{' '}
                      <span className="font-medium">
                        {filteredServices.length}
                      </span>{' '}
                      kết quả
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
                          if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1);
                          }
                        }}
                        disabled={currentPage === Math.ceil(filteredServices.length / itemsPerPage)}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
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
        onClose={() => setShowAddServiceModal(false)}
      />
      <EditServiceModal
        isOpen={showEditServiceModal}
        onClose={() => setShowEditServiceModal(false)}
        service={selectedService}
      />
      <ViewServiceModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        service={selectedService}
        onViewData={(pageId?: string) => {
          setShowDetailModal(false);
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

      {/* Service Data Detail Page */}
      <ServiceDataDetailPage
        isOpen={showDataDetailPage}
        onClose={() => setShowDataDetailPage(false)}
        service={selectedService}
      />


      {/* Error Detail Modal */}
      {showErrorDetailModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-base font-medium text-slate-900">
                  Chi tiết kiểm tra cấu trúc - {selectedService.statusText}
                </h3>
                <p className="text-sm mt-0.5 text-slate-600">
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
                  <h4 className="text-sm font-medium text-slate-900 mb-3">Tổng quan</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-600 mb-1">Tổng số bản ghi</div>
                      <div className="text-xl font-semibold text-slate-900">
                        {selectedService.validationDetails.totalRecords.toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-600 mb-1">Bản ghi hợp lệ</div>
                      <div className="text-xl font-semibold text-green-600">
                        {selectedService.validationDetails.validRecords.toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-600 mb-1">Bản ghi lỗi</div>
                      <div className="text-xl font-semibold text-red-600">
                        {selectedService.validationDetails.invalidRecords.toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Details */}
                {selectedService.validationDetails.errors && selectedService.validationDetails.errors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-3">Chi tiết lỗi</h4>
                    <div className="space-y-3">
                      {selectedService.validationDetails.errors.map((error: any, index: number) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="font-semibold text-slate-900 text-sm">{error.field}</h5>
                              <p className="text-sm text-slate-600 mt-0.5">{error.message}</p>
                            </div>
                            <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded text-sm font-medium whitespace-nowrap ml-3">
                              {error.count} lỗi
                            </span>
                          </div>
                          {error.examples && (
                            <div className="mb-3">
                              <div className="text-xs text-slate-500 mb-1.5">Ví dụ:</div>
                              <div className="flex flex-wrap gap-2">
                                {error.examples.map((example: string, idx: number) => (
                                  <code key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-mono">
                                    {example}
                                  </code>
                                ))}
                              </div>
                            </div>
                          )}
                          {error.expectedFormat && (
                            <div className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded">
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
                        <h5 className="font-semibold text-red-900 text-sm mb-1">
                          {selectedService.errorDetails.errorCode}: {selectedService.errorDetails.errorMessage}
                        </h5>
                        <p className="text-sm text-red-700 mb-2">
                          {selectedService.errorDetails.errorDescription}
                        </p>
                        <div className="text-xs text-red-600">
                          Số lần thử: {selectedService.errorDetails.attemptCount} | Lần thử cuối: {selectedService.errorDetails.lastAttempt}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50">
              <button
                onClick={() => setShowErrorDetailModal(false)}
                className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  sendNotificationToSource(selectedService);
                  setShowErrorDetailModal(false);
                }}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Gửi thông báo hệ thống nguồn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}