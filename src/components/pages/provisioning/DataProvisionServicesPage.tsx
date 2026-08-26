import React, { useState, useEffect } from 'react';
import { Search, Eye, Check, X, Filter } from 'lucide-react';
import { provisionServicesData, ProvisionService } from '../../../data/provisionServicesData';
import { SharedFieldsConfigModal } from './modals/SharedFieldsConfigModal';
import { InnerSidebar } from '../collection/InnerSidebar';

const categoryLabels: Record<ProvisionService['category'], string> = {
  internal: 'CSDL Trong ngành',
  shared: 'Dữ liệu dùng chung',
  open: 'Dữ liệu mở',
  master: 'Dữ liệu chủ',
};

interface DataProvisionServicesPageProps {
  category: 'internal' | 'shared' | 'open' | 'master';
  group?: string;
  title: string;
  description: string;
}

export function DataProvisionServicesPage({ category, group, description }: DataProvisionServicesPageProps) {
  const [selectedService, setSelectedService] = useState<ProvisionService | null>(null);

  // Search and Filter State
  const [searchRightText, setSearchRightText] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fields Config Modal State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedApiForConfig, setSelectedApiForConfig] = useState<any>(null);

  // Success message toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check if we are on CSDL Hộ tịch điện tử screen
  // (Removed isHotichPage check - we now apply the advanced layout to ALL screens)

  // Lọc dữ liệu theo category và group
  const groupData = provisionServicesData.filter(item => {
    const matchesCategory = item.category === category;
    const matchesGroup = group ? item.group === group : true;
    return matchesCategory && matchesGroup;
  });

  useEffect(() => {
    setSelectedService(groupData.length > 0 ? groupData[0] : null);
  }, [group, category]);

  // Helper to get initial fields config for mock APIs
  const getInitialFields = (sharedCount: number) => [
    { id: '1', name: 'Mã định danh', apiKey: 'maDinhDanh', shared: sharedCount >= 1, masking: 'none' as const },
    { id: '2', name: 'Họ tên trẻ', apiKey: 'hoTenTre', shared: sharedCount >= 2, masking: 'none' as const },
    { id: '3', name: 'Ngày sinh', apiKey: 'ngaySinh', shared: sharedCount >= 3, masking: 'none' as const },
    { id: '4', name: 'Giới tính', apiKey: 'gioiTinh', shared: sharedCount >= 4, masking: 'none' as const },
    { id: '5', name: 'Họ tên mẹ', apiKey: 'hoTenMe', shared: sharedCount >= 5, masking: 'none' as const },
    { id: '6', name: 'Họ tên cha', apiKey: 'hoTenCha', shared: sharedCount >= 6, masking: 'none' as const },
    { id: '7', name: 'Trạng thái', apiKey: 'trangThai', shared: sharedCount >= 7, masking: 'none' as const }
  ];

  // Generic list of consumer APIs that updates based on selected service
  const [consumerApis, setConsumerApis] = useState<any[]>([]);

  // Update mock APIs when selected service changes
  useEffect(() => {
    if (selectedService) {
      setConsumerApis([
        {
          id: `api-1-${selectedService.id}`,
          code: `SVC-${selectedService.id}-001`,
          name: `API cung cấp dữ liệu ${selectedService.name}`,
          endpoint: `/api/v1/${selectedService.category}/search`,
          method: 'GET',
          unit: 'Bộ Kế hoạch và Đầu tư',
          receiver: 'Trần Văn Đạo - 0912345678',
          time: '05/06/2026 08:00:00',
          status: 'Hoạt động',
          sharedCount: 7,
          fields: getInitialFields(7)
        },
        {
          id: `api-2-${selectedService.id}`,
          code: `SVC-${selectedService.id}-002`,
          name: `API chia sẻ ${selectedService.name}`,
          endpoint: `/api/v1/${selectedService.category}/list`,
          method: 'GET',
          unit: 'UBND Tỉnh Bắc Ninh',
          receiver: 'Nguyễn Văn A - 0987654321',
          time: '05/06/2026 09:15:00',
          status: 'Hoạt động',
          sharedCount: 5,
          fields: getInitialFields(5)
        },
        {
          id: `api-3-${selectedService.id}`,
          code: `SVC-${selectedService.id}-003`,
          name: `API đồng bộ ${selectedService.name}`,
          endpoint: `/api/v1/${selectedService.category}/sync`,
          method: 'POST',
          unit: 'Sở Thông tin và Truyền thông',
          receiver: 'Lê Văn D - 0988888888',
          time: '03/06/2026 16:45:00',
          status: 'Tạm ngưng',
          sharedCount: 6,
          fields: getInitialFields(6)
        }
      ]);
    }
  }, [selectedService]);

  // Removed legacy mockConsumerApis as all screens now use the advanced table layout

  const handleOpenFieldsConfig = (api: any) => {
    setSelectedApiForConfig(api);
    setIsConfigModalOpen(true);
  };

  const handleSaveFieldsConfig = (updatedFields: any[]) => {
    if (selectedApiForConfig) {
      const activeCount = updatedFields.filter(f => f.shared).length;
      setConsumerApis(prev => prev.map(api => 
        api.id === selectedApiForConfig.id 
          ? { ...api, sharedCount: activeCount, fields: updatedFields } 
          : api
      ));
      
      // Update selectedApiForConfig immediately so that if re-opened it is in sync
      setSelectedApiForConfig(prev => prev ? { ...prev, sharedCount: activeCount, fields: updatedFields } : null);
      
      triggerToast(`Đã cập nhật cấu trúc gói tin. Số trường chia sẻ mới: ${activeCount}/7 trường.`);
    }
  };

  const filteredConsumerApis = consumerApis.filter(api => {
    const matchesSearch = 
      api.unit.toLowerCase().includes(searchRightText.toLowerCase()) ||
      api.code.toLowerCase().includes(searchRightText.toLowerCase()) ||
      api.receiver.toLowerCase().includes(searchRightText.toLowerCase()) ||
      api.name.toLowerCase().includes(searchRightText.toLowerCase());

    const matchesStatus = filterStatus === 'All' || api.status === filterStatus;

    let matchesDate = true;
    if (filterStartDate || filterEndDate) {
      const datePart = api.time.split(' ')[0];
      const dateParts = datePart.split('/');
      if (dateParts.length === 3) {
        const apiDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
        if (filterStartDate) {
          const startDate = new Date(filterStartDate);
          if (apiDate < startDate) matchesDate = false;
        }
        if (filterEndDate) {
          const endDate = new Date(filterEndDate);
          if (apiDate > endDate) matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const paginatedConsumerApis = filteredConsumerApis.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    return (
      <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 collection-pagination text-[13px]">
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Hiển thị</span>
          <select aria-label="Select record count" 
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[13px] cursor-pointer"
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
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Trước
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 border rounded-lg font-medium text-[13px] transition-colors cursor-pointer ${
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
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  const hasSidebar = groupData.length > 0;

  return (
    <div className={hasSidebar ? "flex gap-6 relative" : "space-y-4 relative"}>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[9999] bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 font-medium text-sm">
          <Check className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Left Sidebar - Danh mục dữ liệu */}
      {hasSidebar && (
        <div className="flex-shrink-0 sticky top-0 h-fit self-start">
          <InnerSidebar
            title="Danh mục dữ liệu"
            items={groupData.map(item => ({
              id: item.id,
              label: groupData.length === 1 ? (item.group || categoryLabels[item.category]) : item.name
            }))}
            onSelectItem={(id) => {
              const service = groupData.find(item => item.id === id);
              if (service) setSelectedService(service);
            }}
            activeId={selectedService?.id}
          />
        </div>
      )}

      {/* Content */}
      <div className={hasSidebar ? "flex-1 overflow-y-auto pr-2" : undefined}>
        {selectedService ? (
          <>
            <div className="space-y-4">
              <div className="space-y-4">
                
                {/* Header Title */}
                <div className="pb-2">
                  <h2 className="text-[18px] font-bold text-slate-800 mb-1" style={{ fontSize: '18px' }}>{selectedService.name}</h2>
                  <p className="text-xs text-slate-400">
                    Nguồn dữ liệu: <strong className="text-slate-600">{selectedService.group || categoryLabels[selectedService.category]}</strong>
                  </p>
                </div>
                
                {/* Tabbed Content */}
                    {/* General Search Toolbar directly below tabs container */}
                    {/* General Search Toolbar & Advanced Filters in a single white container */}
                    <div className="space-y-4 mb-4">
                      {/* Row 1: Search input + Blue Search Button + Filter Toggle Button */}
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Tìm theo mã YC, cơ quan, loại dữ liệu..."
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={searchRightText}
                            onChange={(e) => { setSearchRightText(e.target.value); setCurrentPage(1); }}
                          />
                        </div>
                        <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center cursor-pointer">
                          <Search className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                          className={`p-2 rounded-lg transition-colors flex items-center justify-center border cursor-pointer ${
                            showAdvancedFilter 
                              ? 'bg-blue-50 border-blue-200 text-blue-700' 
                              : 'bg-white border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                          }`}
                          title="Bộ lọc"
                        >
                          {showAdvancedFilter ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Row 2: Advanced Filter Panel */}
                      {showAdvancedFilter && (
                        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                          <div>
                            <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">Khoảng thời gian (Từ ngày)</label>
                            <input
                              type="date"
                              value={filterStartDate}
                              onChange={(e) => { setFilterStartDate(e.target.value); setCurrentPage(1); }}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">Khoảng thời gian (Đến ngày)</label>
                            <input
                              type="date"
                              value={filterEndDate}
                              onChange={(e) => { setFilterEndDate(e.target.value); setCurrentPage(1); }}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">Trạng thái xử lý / kết nối</label>
                            <select
                              value={filterStatus}
                              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                            >
                              <option value="All">-- Tất cả trạng thái --</option>
                              <option value="Hoạt động">Hoạt động</option>
                              <option value="Tạm ngưng">Tạm ngưng</option>
                            </select>
                          </div>
                          <div className="flex items-end">
                            <button
                              onClick={() => {
                                setFilterStartDate('');
                                setFilterEndDate('');
                                setFilterStatus('All');
                                setSearchRightText('');
                                setCurrentPage(1);
                              }}
                              className="w-full px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-[13px] font-medium transition-colors cursor-pointer shadow-sm text-center"
                            >
                              Thiết lập lại
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quản lý API đang lấy dữ liệu */}
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse table-auto" style={{ fontSize: '13px' }}>
                            <thead>
                              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-tight" style={{ fontSize: '13px' }}>
                                <th className="px-4 py-3 font-semibold text-slate-500 text-[13px]" style={{ fontSize: '13px' }}>Mã / Tên API</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 text-[13px]" style={{ fontSize: '13px' }}>Đơn vị sử dụng</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 text-[13px]" style={{ fontSize: '13px' }}>Đầu mối tiếp nhận</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 text-[13px]" style={{ fontSize: '13px' }}>Cổng Endpoint / Giao thức</th>

                                <th className="px-4 py-3 font-semibold text-slate-500 text-[13px]" style={{ fontSize: '13px' }}>Thời gian cập nhật</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 text-[13px]" style={{ fontSize: '13px' }}>Trạng thái</th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-500 text-[13px]" style={{ fontSize: '13px' }}>Thao tác</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700" style={{ fontSize: '13px' }}>
                              {paginatedConsumerApis.map(api => (
                                <tr key={api.id} className="hover:bg-slate-50/50 transition-colors" style={{ fontSize: '13px' }}>
                                  <td className="px-4 py-3 text-slate-900 text-[13px]" style={{ fontSize: '13px' }}>
                                    <div className="font-bold text-slate-800 text-[13px]" style={{ fontSize: '13px' }}>{api.name}</div>
                                    <div className="font-mono text-[10px] text-slate-400 mt-0.5">{api.code}</div>
                                  </td>
                                  <td className="px-4 py-3 font-semibold text-slate-800 text-[13px]" style={{ fontSize: '13px' }}>
                                    {api.unit}
                                  </td>
                                  <td className="px-4 py-3 text-slate-600 text-[13px]" style={{ fontSize: '13px' }}>
                                    {api.receiver}
                                  </td>
                                  <td className="px-4 py-3 text-[13px]" style={{ fontSize: '13px' }}>
                                    <div className="flex items-center gap-1.5 text-[13px]" style={{ fontSize: '13px' }}>
                                      <span className="font-mono text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-100">
                                        {api.method}
                                      </span>
                                      <span className="font-mono text-slate-500 text-[13px]" style={{ fontSize: '13px' }}>{api.endpoint}</span>
                                    </div>
                                  </td>

                                  <td className="px-4 py-3 text-slate-500 font-mono text-[13px]" style={{ fontSize: '13px' }}>
                                    {api.time}
                                  </td>
                                  <td className="px-4 py-3 text-[13px]" style={{ fontSize: '13px' }}>
                                    {api.status === 'Hoạt động' ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-normal bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap" style={{ fontSize: '12px' }}>
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                        Hoạt động
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-normal bg-amber-50 text-amber-700 border border-amber-100 whitespace-nowrap" style={{ fontSize: '12px' }}>
                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                        Tạm ngưng
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center text-[13px]" style={{ fontSize: '13px' }}>
                                    <button
                                      onClick={() => handleOpenFieldsConfig(api)}
                                      className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-[6px] transition-colors inline-flex items-center justify-center cursor-pointer"
                                      title="Xem chi tiết"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                  </td>

                                </tr>
                              ))}
                              {paginatedConsumerApis.length === 0 && (
                                <tr>
                                  <td colSpan={8} className="text-center py-8 text-slate-400">
                                    Không tìm thấy API nào phù hợp với từ khóa tìm kiếm
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        {renderPagination(filteredConsumerApis.length)}
                      </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Shared Fields Config Modal */}
      <SharedFieldsConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        apiName={selectedApiForConfig?.name || ''}
        apiCode={selectedApiForConfig?.code || ''}
        consumerUnit={selectedApiForConfig?.unit || ''}
        initialFields={selectedApiForConfig?.fields || []}
        onSave={handleSaveFieldsConfig}
        readOnly
      />

    </div>
  );
}
