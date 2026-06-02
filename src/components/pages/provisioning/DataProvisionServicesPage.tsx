import React, { useState, useEffect } from 'react';
import { Search, Server, Clock, ShieldCheck, Activity, Code, Database } from 'lucide-react';
import { provisionServicesData, ProvisionService } from '../../../data/provisionServicesData';
import { ServiceDataTable } from './components/ServiceDataTable';

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

  // Mock list of APIs consuming this dataset
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

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
            <div className="p-6 border-b border-slate-200 bg-white shadow-sm z-10">
              <h2 className="text-xl font-bold text-slate-800 mb-2">{selectedService.name}</h2>
              <p className="text-sm text-slate-500">
                Nguồn dữ liệu: {selectedService.group || selectedService.category} | Dữ liệu {selectedService.category === 'internal' ? 'danh mục nội ngành' : 'dùng chung'}
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Dynamic Data Table for any service */}
                <ServiceDataTable service={selectedService} />
                
                {/* ALWAYS show API list below */}
                <>
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
    </div>
  );
}
