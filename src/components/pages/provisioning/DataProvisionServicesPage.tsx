import React, { useState, useEffect } from 'react';
import { Search, Database, Server, Code, Clock, ShieldCheck, Activity, Eye, Filter, RefreshCcw, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { RecordDetailModal } from './modals/RecordDetailModal';
import { provisionServicesData, ProvisionService } from '../../../data/provisionServicesData';

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

  // State for showing Record Detail modal
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // State for showing Table Filter
  const [showTableFilter, setShowTableFilter] = useState(false);

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

  const mockTableData = [
    {
      id: '1',
      maHoSo: 'XN-2023-001234',
      ngaySinh: '15/03/1990',
      soDinhDanh: '001090001234',
      tinhTrangHonNhan: 'Chưa đăng ký kết hôn',
      nguoiDeNghi: 'Nguyễn Văn Nam',
      quanHe: 'Bản thân',
      ngayCap: '10/10/2023',
      trangThai: 'Đã phê duyệt'
    },
    {
      id: '2',
      maHoSo: 'XN-2023-001235',
      ngaySinh: '20/05/1995',
      soDinhDanh: '036195005678',
      tinhTrangHonNhan: 'Đã ly hôn',
      nguoiDeNghi: 'Trần Thị Lan',
      quanHe: 'Bản thân',
      ngayCap: '05/12/2023',
      trangThai: 'Chờ duyệt'
    },
    {
      id: '3',
      maHoSo: 'XN-2023-001236',
      ngaySinh: '12/11/1988',
      soDinhDanh: '031088123456',
      tinhTrangHonNhan: 'Vợ chết',
      nguoiDeNghi: 'Hoàng Minh Tuấn',
      quanHe: 'Bản thân',
      ngayCap: '15/12/2023',
      trangThai: 'Lỗi'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã phê duyệt':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5" /> {status}</span>;
      case 'Chờ duyệt':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"><AlertCircle className="w-3.5 h-3.5" /> {status}</span>;
      case 'Lỗi':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200"><XCircle className="w-3.5 h-3.5" /> {status}</span>;
      default:
        return <span>{status}</span>;
    }
  };

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
                
                {/* Condition rendering: Show data table if service is 536 */}
                {selectedService.id === '536' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    
                    {/* Table Toolbar */}
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                      <h3 className="font-bold text-slate-800 text-lg">Hồ sơ cấp Giấy xác nhận tình trạng hôn nhân</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setShowTableFilter(!showTableFilter)}
                          className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors shadow-sm ${showTableFilter ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                        >
                          <Filter className="w-4 h-4" /> Lọc
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                          <RefreshCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Filter Panel */}
                    {showTableFilter && (
                      <div className="px-6 py-4 border-b border-slate-200 bg-white animate-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Mã THN / Số định danh</label>
                            <input type="text" placeholder="Nhập từ khóa..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Tình trạng hôn nhân</label>
                            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="">Tất cả</option>
                              <option value="Chưa đăng ký kết hôn">Chưa đăng ký kết hôn</option>
                              <option value="Đã ly hôn">Đã ly hôn</option>
                              <option value="Vợ chết">Vợ/Chồng chết</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái</label>
                            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="">Tất cả</option>
                              <option value="Đã phê duyệt">Đã phê duyệt</option>
                              <option value="Chờ duyệt">Chờ duyệt</option>
                              <option value="Lỗi">Lỗi</option>
                            </select>
                          </div>
                          <div className="flex items-end gap-2">
                            <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">Áp dụng</button>
                            <button 
                              onClick={() => setShowTableFilter(false)}
                              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                            >
                              Đóng
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-4 font-bold">Mã THN</th>
                            <th className="px-4 py-4 font-bold">Ngày sinh</th>
                            <th className="px-4 py-4 font-bold">Số định danh cá nhân</th>
                            <th className="px-4 py-4 font-bold text-center">Tình trạng hôn nhân</th>
                            <th className="px-4 py-4 font-bold">Người đề nghị cấp</th>
                            <th className="px-4 py-4 font-bold text-center">Quan hệ</th>
                            <th className="px-4 py-4 font-bold">Ngày cấp</th>
                            <th className="px-4 py-4 font-bold text-center">Trạng thái</th>
                            <th className="px-4 py-4 font-bold text-center">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {mockTableData.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-4 font-medium text-slate-800">{row.maHoSo}</td>
                              <td className="px-4 py-4 text-slate-600">{row.ngaySinh}</td>
                              <td className="px-4 py-4 text-slate-600 font-mono">{row.soDinhDanh}</td>
                              <td className="px-4 py-4 text-slate-800 text-center">{row.tinhTrangHonNhan}</td>
                              <td className="px-4 py-4 text-slate-800 font-medium">{row.nguoiDeNghi}</td>
                              <td className="px-4 py-4 text-slate-600 text-center">{row.quanHe}</td>
                              <td className="px-4 py-4 text-slate-600">{row.ngayCap}</td>
                              <td className="px-4 py-4 text-center">{getStatusBadge(row.trangThai)}</td>
                              <td className="px-4 py-4 text-center">
                                <button 
                                  onClick={() => {
                                    setSelectedRecord(row);
                                    setShowRecordModal(true);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Xem chi tiết"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
                      <div className="flex items-center text-sm text-slate-500">
                        <span>Hiển thị</span>
                        <select className="mx-2 border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:border-blue-500">
                          <option>10</option>
                          <option>20</option>
                          <option>50</option>
                        </select>
                        <span>bản ghi/trang</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-slate-500 mr-4">1 - 10 / 3424878</span>
                        <div className="flex bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden text-sm">
                          <button className="px-3 py-1.5 text-slate-400 hover:bg-slate-50 border-r border-slate-200" disabled>Trước</button>
                          <button className="px-3 py-1.5 bg-blue-600 text-white font-medium border-r border-slate-200">1</button>
                          <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 border-r border-slate-200">2</button>
                          <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 border-r border-slate-200">3</button>
                          <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 border-r border-slate-200">4</button>
                          <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 border-r border-slate-200">5</button>
                          <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-50">Sau</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
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

      <RecordDetailModal 
        isOpen={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        recordData={selectedRecord}
      />
    </div>
  );
}
