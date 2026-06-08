import React, { useState, useEffect } from 'react';
import { Search, Server, Clock, ShieldCheck, Activity, Code, Database, FileText, Sliders, Play, Square, Check, X, Filter } from 'lucide-react';
import { provisionServicesData, ProvisionService } from '../../../data/provisionServicesData';
import { ServiceDataTable } from './components/ServiceDataTable';
import { SharedFieldsConfigModal } from './modals/SharedFieldsConfigModal';

interface DataProvisionServicesPageProps {
  category: 'internal' | 'shared' | 'open' | 'master';
  group?: string;
  title: string;
  description: string;
}

export function DataProvisionServicesPage({ category, group, title, description }: DataProvisionServicesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<ProvisionService | null>(null);
  
  // State for showing API details
  const [selectedApi, setSelectedApi] = useState<any>(null);

  // Tab State for Civil Registry
  const [activeDetailTab, setActiveDetailTab] = useState<'du_lieu' | 'api'>('du_lieu');

  // Search filter for right-content list
  const [searchRightText, setSearchRightText] = useState('');

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
  const isHotichPage = group === 'CSDL Hộ tịch điện tử';

  // Lọc dữ liệu theo category và group
  const groupData = provisionServicesData.filter(item => {
    const matchesCategory = item.category === category;
    const matchesGroup = group ? item.group === group : true;
    return matchesCategory && matchesGroup;
  });

  const filteredInnerList = groupData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (filteredInnerList.length > 0 && !selectedService) {
      setSelectedService(filteredInnerList[0]);
    }
  }, [group, category, filteredInnerList, selectedService]);

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

  // Mock list of consumer APIs for "CSDL Hộ tịch điện tử"
  const [consumerApis, setConsumerApis] = useState(() => [
    {
      id: 'api-ht-1',
      code: 'SVC-HOTICH-001',
      name: 'API cung cấp dữ liệu Hộ tịch điện tử',
      endpoint: '/api/v1/hotich/search',
      method: 'GET',
      unit: 'Bộ Kế hoạch và Đầu tư',
      receiver: 'Trần Văn Đạo - 0912345678',
      time: '05/06/2026 08:00:00',
      status: 'Hoạt động',
      sharedCount: 7,
      fields: getInitialFields(7)
    },
    {
      id: 'api-ht-2',
      code: 'SVC-HOTICH-001',
      name: 'API cung cấp dữ liệu Hộ tịch điện tử',
      endpoint: '/api/v1/hotich/search',
      method: 'GET',
      unit: 'UBND Tỉnh Bắc Ninh',
      receiver: 'Nguyễn Văn A - 0987654321',
      time: '05/06/2026 09:15:00',
      status: 'Hoạt động',
      sharedCount: 5,
      fields: getInitialFields(5)
    },
    {
      id: 'api-ht-3',
      code: 'SVC-HOTICH-001',
      name: 'API cung cấp dữ liệu Hộ tịch điện tử',
      endpoint: '/api/v1/hotich/search',
      method: 'GET',
      unit: 'Sở Tài chính tỉnh Bắc Ninh',
      receiver: 'Trần Thị B - 0912345678',
      time: '04/06/2026 14:30:00',
      status: 'Hoạt động',
      sharedCount: 4,
      fields: getInitialFields(4)
    },
    {
      id: 'api-ht-4',
      code: 'SVC-HOTICH-001',
      name: 'API cung cấp dữ liệu Hộ tịch điện tử',
      endpoint: '/api/v1/hotich/search',
      method: 'GET',
      unit: 'UBND Huyện Tiên Du',
      receiver: 'Lê Văn D - 0988888888',
      time: '03/06/2026 16:45:00',
      status: 'Tạm ngưng',
      sharedCount: 6,
      fields: getInitialFields(6)
    }
  ]);

  // Mock list of APIs consuming other datasets (original view fallback)
  const mockConsumerApis = [
    {
      id: 'api-1',
      name: 'Lấy danh sách Hộ tịch (Tỉnh Bắc Ninh)',
      endpoint: '/api/v1/hotich/bacninh',
      method: 'GET',
      requestCount: '1,240',
      fieldCount: 15,
      provisionTime: 'Real-time',
      unit: 'UBND Tỉnh Bắc Ninh',
      status: 'active',
      sampleJson: `{\n  "status": "success",\n  "data": {\n    "id": "USR-99812",\n    "ho_ten": "Nguyễn Văn A",\n    "ngay_sinh": "1995-10-15",\n    "so_dinh_danh": "001••••123"\n  }\n}`
    },
    {
      id: 'api-3',
      name: 'Lấy danh sách Hộ tịch (Tỉnh Quảng Ninh)',
      endpoint: '/api/v1/hotich/quangninh',
      method: 'GET',
      requestCount: '2,150',
      fieldCount: 15,
      provisionTime: 'Real-time',
      unit: 'UBND Tỉnh Quảng Ninh',
      status: 'active',
      sampleJson: `{\n  "status": "success",\n  "data": {\n    "id": "USR-99813",\n    "ho_ten": "Trần Văn B",\n    "ngay_sinh": "1990-05-20",\n    "so_dinh_danh": "001••••456"\n  }\n}`
    },
    {
      id: 'api-2',
      name: 'Tra cứu thông tin Đăng ký kết hôn (Bộ Công An)',
      endpoint: '/api/v2/kethon/bca',
      method: 'POST',
      requestCount: '8,500',
      fieldCount: 22,
      provisionTime: 'Daily Batch (00:00)',
      unit: 'Bộ Công An (C06)',
      status: 'active',
      sampleJson: `{\n  "status": "success",\n  "data": {\n    "id_ket_hon": "KH-2026-1122",\n    "ngay_dang_ky": "2026-01-15",\n    "vo_chong": [\n      {"ho_ten": "Nguyễn Văn A", "cccd": "001095000123"},\n      {"ho_ten": "Trần Thị B", "cccd": "001096000456"}\n    ]\n  }\n}`
    }
  ];

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

  const filteredConsumerApis = consumerApis.filter(api => 
    api.unit.toLowerCase().includes(searchRightText.toLowerCase()) ||
    api.code.toLowerCase().includes(searchRightText.toLowerCase()) ||
    api.receiver.toLowerCase().includes(searchRightText.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-[9999] bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 font-medium text-sm">
          <Check className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Left Sidebar */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50 flex-shrink-0">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h3 className="font-semibold text-slate-800 text-lg mb-4">{group || title}</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm dữ liệu..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredInnerList.map(item => (
            <button
              key={item.id}
              onClick={() => { setSelectedService(item); setSelectedApi(null); }}
              className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-colors ${
                selectedService?.id === item.id
                  ? 'bg-blue-50 border border-blue-200 text-blue-700 font-medium'
                  : 'hover:bg-slate-100 text-slate-600 border border-transparent'
              }`}
            >
              {item.name}
            </button>
          ))}
          {filteredInnerList.length === 0 && (
            <div className="p-4 text-center text-sm text-slate-500">
              Không tìm thấy dữ liệu phù hợp
            </div>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {selectedService ? (
          <>
            {/* Header / Tab navigation for Civil Registry page */}
            {isHotichPage ? (
              <div className="bg-white border-b border-slate-200 shadow-sm z-10 flex flex-col">
                <div className="px-6 pt-5 pb-3">
                  <h2 className="text-xl font-bold text-slate-800 mb-1">{selectedService.name}</h2>
                  <p className="text-xs text-slate-400">
                    Nguồn dữ liệu: <strong className="text-slate-600">{selectedService.group || selectedService.category}</strong> | Dữ liệu <strong className="text-slate-600">Dùng chung</strong>
                  </p>
                </div>
                
                {/* Tabs */}
                <div className="flex px-6 border-t border-slate-100 bg-slate-50/50">
                  <button
                    onClick={() => setActiveDetailTab('du_lieu')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                      activeDetailTab === 'du_lieu'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Dữ liệu cung cấp
                  </button>
                  <button
                    onClick={() => setActiveDetailTab('api')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                      activeDetailTab === 'api'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    Quản lý API đang lấy dữ liệu
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 border-b border-slate-200 bg-white shadow-sm z-10">
                <h2 className="text-xl font-bold text-slate-800 mb-2">{selectedService.name}</h2>
                <p className="text-sm text-slate-500">
                  Nguồn dữ liệu: {selectedService.group || selectedService.category} | Dữ liệu {selectedService.category === 'internal' ? 'danh mục nội ngành' : 'dùng chung'}
                </p>
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Civil Registry Tabbed Content */}
                {isHotichPage ? (
                  <>
                    {/* General Search Toolbar directly below tabs container */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                      <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Tìm theo mã YC, cơ quan, loại dữ liệu..."
                          className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                          value={searchRightText}
                          onChange={(e) => setSearchRightText(e.target.value)}
                        />
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
                        <Filter className="w-4 h-4 text-slate-500" />
                        Bộ lọc nâng cao
                      </button>
                    </div>

                    {activeDetailTab === 'du_lieu' ? (
                      /* Tab 1: Dữ liệu cung cấp */
                      <ServiceDataTable service={selectedService} />
                    ) : (
                      /* Tab 2: Quản lý API đang lấy dữ liệu */
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                          <h3 className="font-bold text-slate-800 text-base">Danh sách các API chia sẻ dữ liệu Hộ tịch</h3>
                          <span className="text-xs font-semibold text-slate-500">Tìm thấy {filteredConsumerApis.length} API đang kết nối</span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                              <tr>
                                <th className="px-4 py-3.5">Mã / Tên API</th>
                                <th className="px-4 py-3.5">Đơn vị sử dụng</th>
                                <th className="px-4 py-3.5">Đầu mối tiếp nhận</th>
                                <th className="px-4 py-3.5">Cổng Endpoint / Giao thức</th>
                                <th className="px-4 py-3.5 text-center">Số trường chia sẻ</th>
                                <th className="px-4 py-3.5">Thời gian cập nhật</th>
                                <th className="px-4 py-3.5">Trạng thái</th>
                                <th className="px-4 py-3.5 text-center">Thao tác</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              {filteredConsumerApis.map(api => (
                                <tr key={api.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-4 py-4">
                                    <div className="font-bold text-slate-800 text-sm">{api.name}</div>
                                    <div className="font-mono text-[10px] text-slate-400 mt-0.5">{api.code}</div>
                                  </td>
                                  <td className="px-4 py-4 font-semibold text-slate-800">
                                    {api.unit}
                                  </td>
                                  <td className="px-4 py-4 text-slate-600">
                                    {api.receiver}
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-mono text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-100">
                                        {api.method}
                                      </span>
                                      <span className="font-mono text-slate-500">{api.endpoint}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 text-center font-semibold text-slate-800">
                                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 font-mono text-[11px]">
                                      {api.sharedCount} / 7 trường
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 text-slate-500 font-mono">
                                    {api.time}
                                  </td>
                                  <td className="px-4 py-4">
                                    {api.status === 'Hoạt động' ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                        Hoạt động
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                        Tạm ngưng
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <button
                                      onClick={() => handleOpenFieldsConfig(api)}
                                      className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors shadow-sm inline-flex items-center gap-1 cursor-pointer font-semibold"
                                      title="Điều chỉnh các trường dữ liệu chia sẻ"
                                    >
                                      <Sliders className="w-3.5 h-3.5" />
                                      Cấu hình trường
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {filteredConsumerApis.length === 0 && (
                                <tr>
                                  <td colSpan={8} className="text-center py-8 text-slate-400">
                                    Không tìm thấy API nào phù hợp với từ khóa tìm kiếm
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Original View Fallback for other pages */
                  <>
                    <ServiceDataTable service={selectedService} />
                    
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                      Danh sách API đang lấy dữ liệu từ "{selectedService.name}"
                    </h3>

                    {mockConsumerApis.map(api => (
                      <div key={api.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-blue-300 transition-colors mb-6">
                        <div 
                          className="p-5 cursor-pointer flex items-center justify-between"
                          onClick={() => setSelectedApi(selectedApi?.id === api.id ? null : api)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                              <Server className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-base">{api.name}</h4>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold border border-slate-200">
                                  {api.method}
                                </span>
                                <span className="font-mono text-xs text-slate-500">{api.endpoint}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 inline-block mb-1">
                              Đang hoạt động
                            </div>
                            <div className="text-xs text-slate-400 font-medium">Click để xem chi tiết</div>
                          </div>
                        </div>

                        {selectedApi?.id === api.id && (
                          <div className="border-t border-slate-100 bg-slate-50/50 p-6 animate-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div className="space-y-4">
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Đơn vị sử dụng</div>
                                  <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                                    {api.unit}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Thời gian cung cấp</div>
                                  <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    {api.provisionTime}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Số lượng trường dữ liệu (Fields)</div>
                                  <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                                    <Database className="w-4 h-4 text-emerald-500" />
                                    {api.fieldCount} trường
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lưu lượng truy cập (Requests)</div>
                                  <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-purple-500" />
                                    {api.requestCount} / tháng
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950 shadow-inner">
                              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                                <Code className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-mono font-bold text-emerald-400">JSON Payload (Sample)</span>
                              </div>
                              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto">
                                <code>{api.sampleJson}</code>
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}

              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 bg-slate-50">
            <div className="text-center">
              <Database className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Vui lòng chọn một dữ liệu để xem chi tiết</p>
            </div>
          </div>
        )}
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
      />

    </div>
  );
}
