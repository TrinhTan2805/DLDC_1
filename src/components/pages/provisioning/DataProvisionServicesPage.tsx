import React, { useState, useEffect } from 'react';
import { Search, Eye, X, Filter, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { provisionServicesData, ProvisionService } from '../../../data/provisionServicesData';
import { SharedFieldsConfigModal } from './modals/SharedFieldsConfigModal';
import { InnerSidebar } from '../collection/InnerSidebar';
import { Badge, TruncatedText, RowIconAction, Pagination, BTN_OUTLINE, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, DATE_BOX_CLS, normalizeSearch } from '../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;

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

  // Thông báo thành công (sonner)
  const triggerToast = (msg: string) => {
    toast.success(msg);
  };

  // Điều kiện đã áp dụng: chỉ cập nhật khi bấm Tìm kiếm hoặc Enter (mục 5.19)
  const EMPTY_FILTERS = { searchText: '', startDate: '', endDate: '', status: 'All' };
  const [applied, setApplied] = useState(EMPTY_FILTERS);
  const runSearch = () => {
    setApplied({ searchText: searchRightText, startDate: filterStartDate, endDate: filterEndDate, status: filterStatus });
    setCurrentPage(1);
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
    const q = normalizeSearch(applied.searchText);
    const matchesSearch = q === '' ||
      [api.unit, api.code, api.receiver, api.name].some((v: string) => normalizeSearch(v).includes(q));

    const matchesStatus = applied.status === 'All' || api.status === applied.status;

    let matchesDate = true;
    if (applied.startDate || applied.endDate) {
      const datePart = api.time.split(' ')[0];
      const dateParts = datePart.split('/');
      if (dateParts.length === 3) {
        const apiDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
        if (applied.startDate) {
          const startDate = new Date(applied.startDate);
          if (apiDate < startDate) matchesDate = false;
        }
        if (applied.endDate) {
          const endDate = new Date(applied.endDate);
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

  const hasSidebar = groupData.length > 0;

  return (
    <div className={hasSidebar ? "flex gap-6 relative" : "space-y-4 relative"}>

      {/* Left Sidebar - Danh sách dữ liệu chia sẻ */}
      {hasSidebar && (
        <div className="flex-shrink-0 sticky top-0 h-fit self-start">
          <InnerSidebar
            title="Danh sách dữ liệu chia sẻ"
            items={groupData.map(item => ({
              id: item.id,
              label: groupData.length === 1 ? (item.group || categoryLabels[item.category]) : item.name
            }))}
            onSelectItem={(id) => {
              const service = groupData.find(item => item.id === id);
              if (service) setSelectedService(service);
            }}
            activeId={selectedService?.id}
            flatList
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
                <div>
                  <h2 className="text-[20px] font-bold text-[#2A0F0F] leading-8">{selectedService.name}</h2>
                  <p className="text-[13px] text-[#64748B]">
                    Nguồn dữ liệu: <span className="text-[#020817] font-medium">{selectedService.group || categoryLabels[selectedService.category]}</span>
                  </p>
                </div>

                {/* Tìm kiếm & bộ lọc (mục 5.19) — chỉ áp dụng khi bấm Tìm kiếm hoặc Enter */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        aria-label="Tìm kiếm"
                        placeholder="Tìm theo mã YC, cơ quan, loại dữ liệu..."
                        className={SEARCH_INPUT_CLS}
                        value={searchRightText}
                        onChange={(e) => setSearchRightText(e.target.value)}
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

                  {showAdvancedFilter && (
                    <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
                      <div>
                        <label className={FILTER_LABEL}>Khoảng thời gian (Từ ngày)</label>
                        <div className={DATE_BOX_CLS}>
                          <input
                            type="date"
                            aria-label="Khoảng thời gian (Từ ngày)"
                            value={filterStartDate}
                            onChange={(e) => setFilterStartDate(e.target.value)}
                            className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-[#020817] p-0"
                          />
                          <Calendar className="w-4 h-4 text-[#475569] shrink-0" />
                        </div>
                      </div>
                      <div>
                        <label className={FILTER_LABEL}>Khoảng thời gian (Đến ngày)</label>
                        <div className={DATE_BOX_CLS}>
                          <input
                            type="date"
                            aria-label="Khoảng thời gian (Đến ngày)"
                            value={filterEndDate}
                            onChange={(e) => setFilterEndDate(e.target.value)}
                            className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-[#020817] p-0"
                          />
                          <Calendar className="w-4 h-4 text-[#475569] shrink-0" />
                        </div>
                      </div>
                      <div>
                        <label className={FILTER_LABEL}>Trạng thái xử lý / kết nối</label>
                        <select
                          aria-label="Trạng thái xử lý / kết nối"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className={INPUT_CLS}
                        >
                          <option value="All">-- Tất cả trạng thái --</option>
                          <option value="Hoạt động">Hoạt động</option>
                          <option value="Tạm ngưng">Tạm ngưng</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => {
                            setFilterStartDate('');
                            setFilterEndDate('');
                            setFilterStatus('All');
                            setSearchRightText('');
                            setApplied(EMPTY_FILTERS);
                            setCurrentPage(1);
                          }}
                          className={`${BTN_OUTLINE} w-full`}
                        >
                          Thiết lập lại
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quản lý API đang lấy dữ liệu */}
                <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse collection-table text-[13px]">
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px]">
                          <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]">Mã API</th>
                          <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px] min-w-[200px]">Tên API</th>
                          <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]">Đơn vị sử dụng</th>
                          <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]">Đầu mối tiếp nhận</th>
                          <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]">Cổng Endpoint / Giao thức</th>
                          <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]">Thời gian cập nhật</th>
                          <th className="px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]">Trạng thái</th>
                          <th className="px-3 py-[13px] leading-4 text-center font-bold text-black whitespace-nowrap text-[13px] sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedConsumerApis.map(api => (
                          <tr key={api.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-3 py-1 text-[13px] text-black whitespace-nowrap">{api.code}</td>
                            <td className="px-3 py-1 text-[13px] text-black max-w-[360px]">
                              <TruncatedText text={api.name} />
                            </td>
                            <td className="px-3 py-1 text-[13px] text-black max-w-[240px]">
                              <TruncatedText text={api.unit} />
                            </td>
                            <td className="px-3 py-1 text-[13px] text-black max-w-[240px]">
                              <TruncatedText text={api.receiver} />
                            </td>
                            <td className="px-3 py-1 text-[13px] text-black">
                              <div className="flex items-center gap-1.5">
                                <Badge label={api.method} variant="blue" />
                                <span className="text-[13px] text-[#020817] whitespace-nowrap">{api.endpoint}</span>
                              </div>
                            </td>
                            <td className="px-3 py-1 text-[13px] text-black whitespace-nowrap leading-[18px]">
                              <div>{api.time.split(' ')[0]}</div>
                              <div className="text-[#64748B]">{api.time.split(' ')[1]}</div>
                            </td>
                            <td className="px-3 py-1 text-[13px] text-black">
                              {api.status === 'Hoạt động' ? (
                                <Badge label="Hoạt động" variant="green" />
                              ) : (
                                <Badge label="Tạm ngưng" variant="amber" />
                              )}
                            </td>
                            <td className="px-3 py-1 text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]">
                              <div className="flex items-center justify-center">
                                <RowIconAction label="Xem chi tiết" onClick={() => handleOpenFieldsConfig(api)}>
                                  <Eye className="w-4 h-4" />
                                </RowIconAction>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {paginatedConsumerApis.length === 0 && (
                          <tr>
                            <td colSpan={8} className="text-center py-16 text-[13px] text-[#64748B]">
                              Không tìm thấy API nào phù hợp với từ khóa tìm kiếm
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    className="border-t border-[#E2E8F0]"
                    currentPage={currentPage}
                    totalItems={filteredConsumerApis.length}
                    pageSize={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setItemsPerPage}
                  />
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
