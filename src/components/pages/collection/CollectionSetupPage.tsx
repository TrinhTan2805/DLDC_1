import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Settings as SettingsIcon, Trash2, FileText, Activity, Settings, AlertCircle, X, Download, Send, ChevronLeft, ChevronRight, Calendar, Wrench } from 'lucide-react';
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
      
      return (statusFilter === 'all' || service.status === statusFilter) &&
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
            className={`pb-3 pt-4 text-sm transition-colors border-b-2 ${
              activeTab === 'service-setup'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Thiết lập dịch vụ
          </button>
          <button
            onClick={() => setActiveTab('version')}
            className={`pb-3 pt-4 text-sm transition-colors border-b-2 ${
              activeTab === 'version'
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
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="space-y-3">
                {/* Row 1: Search and Date Range */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên, mã dịch vụ, đơn vị..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-300">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">Thời gian:</span>
                    <input
                      type="date"
                      className="px-2 py-0.5 border-0 bg-transparent text-sm focus:outline-none focus:ring-0 text-slate-700"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="date"
                      className="px-2 py-0.5 border-0 bg-transparent text-sm focus:outline-none focus:ring-0 text-slate-700"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Row 2: Filter Dropdowns, Search and Reset Button */}
                <div className="flex items-center gap-3">
                  <select
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex-1"
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                  >
                    <option value="all">Tất cả nguồn dữ liệu</option>
                    <option value="Trong ngành">Trong ngành</option>
                    <option value="Ngoài ngành">Ngoài ngành</option>
                  </select>
                  <select
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex-1"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="all">Tất cả Cục/Vụ</option>
                    <option value="Bộ ngành ngoài">Bộ ngành ngoài</option>
                    <option value="Cục Hành chính tư pháp">Cục Hành chính tư pháp</option>
                    <option value="Cục Quản lý thi hành án dân sự">Cục Quản lý thi hành án dân sự</option>
                    <option value="Cục Đăng ký giao dịch bảo đảm">Cục Đăng ký giao dịch bảo đảm</option>
                    <option value="Cục Kiểm tra văn bản">Cục Kiểm tra văn bản</option>
                    <option value="Cục Bổ trợ tư pháp">Cục Bổ trợ tư pháp</option>
                    <option value="Vụ Hợp tác quốc tế">Vụ Hợp tác quốc tế</option>
                    <option value="Cục Kế hoạch - Tài chính">Cục Kế hoạch - Tài chính</option>
                  </select>
                  <select
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex-1"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="success">Thành công</option>
                    <option value="format_error">Lỗi định dạng</option>
                    <option value="structure_error">Lỗi cấu trúc</option>
                  </select>
                  <select
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex-1"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">Tất cả loại dịch vụ</option>
                    <option value="REST">REST</option>
                    <option value="SOAP">SOAP</option>
                  </select>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                  >
                    <Search className="w-4 h-4" />
                    Tìm kiếm
                  </button>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                    title="Bỏ lọc"
                  >
                    <X className="w-4 h-4" />
                    Bỏ lọc
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons Above Table */}
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowAddServiceModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Thêm dịch vụ mới
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                onClick={handleExportServiceList}
              >
                <Download className="w-4 h-4" />
                Kết xuất danh sách
              </button>
            </div>

            {/* Services Table */}
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">STT</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Mã dịch vụ</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Tên dịch vụ</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Loại</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Phiên bản</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Đơn vị quản lý</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Ngày tạo</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Ngày sửa</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Trạng thái kết nối</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Gửi thông báo</th>
                      <th className="px-4 py-3 text-center text-xs text-slate-600 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredServices
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((service, index) => (
                      <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                            {service.code}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm text-slate-900">{service.name}</div>
                            <div className="text-xs text-slate-500">{service.description}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 rounded text-xs ${service.typeColor}`}>
                            {service.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{service.version}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{service.managingUnit}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{service.createdAt}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{service.updatedAt}</td>
                        <td className="px-4 py-3">
                          {(service.status === 'format_error' || service.status === 'structure_error') ? (
                            <button
                              onClick={() => {
                                setSelectedService(service);
                                setShowErrorDetailModal(true);
                              }}
                              className={`inline-flex px-2 py-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${service.statusColor}`}
                              title="Click để xem chi tiết lỗi"
                            >
                              {service.statusText}
                            </button>
                          ) : (
                            <span className={`inline-flex px-2 py-1 rounded text-xs ${service.statusColor}`}>
                              {service.statusText}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {(service.status === 'err_conn' || service.status === 'err_data') ? (
                            service.notificationSentForError ? (
                              <span className="inline-flex px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                                Đã gửi
                              </span>
                            ) : (
                              <span className="inline-flex px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">
                                Chưa gửi
                              </span>
                            )
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Xem chi tiết"
                              onClick={() => {
                                setSelectedService(service);
                                setShowDetailModal(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                              title="Chỉnh sửa"
                              onClick={() => {
                                setSelectedService(service);
                                setShowEditServiceModal(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 text-slate-600 hover:bg-slate-50 rounded transition-colors"
                              title="Kiểm tra kết nối / Cài đặt"
                              onClick={() => {
                                setSelectedService(service);
                                setShowSettingsModal(true);
                              }}
                            >
                              <SettingsIcon className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                              title="Bảo trì"
                            >
                              <Wrench className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Xóa"
                              onClick={() => {
                                setSelectedService(service);
                                setShowDeleteModal(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
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