import { useState } from 'react';
import { Database, Settings, History as HistoryIcon, Download, Upload, RefreshCw, Filter, Search, Calendar, CheckCircle, XCircle, Clock, Edit, Trash2, Eye, Plus, FileText, Info } from 'lucide-react';

interface DataManagementDetailProps {
  dataName: string;
  dataId: string;
}

export function DataManagementDetail({ dataName, dataId }: DataManagementDetailProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'config' | 'history'>('list');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showAddApiModal, setShowAddApiModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showSyncErrorModal, setShowSyncErrorModal] = useState(false);
  const [selectedSyncRecord, setSelectedSyncRecord] = useState<any>(null);

  // Mock data for list tab
  const mockData = [
    { 
      id: 1, 
      status: 'Mới', 
      fullName: 'Nguyễn Văn An', 
      birthDate: '15/03/1990', 
      nationality: 'Việt Nam', 
      certNumber: 'GCN-001-2024', 
      regDate: '10/01/2024', 
      state: 'Đã duyệt',
      changes: {}
    },
    { 
      id: 2, 
      status: 'Cập nhật', 
      fullName: 'Trần Thị Bình', 
      birthDate: '22/07/1985', 
      nationality: 'Việt Nam', 
      certNumber: 'GCN-002-2024', 
      regDate: '11/01/2024', 
      state: 'Đã duyệt',
      changes: {
        birthDate: { old: '22/07/1980', new: '22/07/1985' },
        regDate: { old: '05/01/2024', new: '11/01/2024' }
      }
    },
    { 
      id: 3, 
      status: 'Mới', 
      fullName: 'Lê Văn Cường', 
      birthDate: '08/12/1992', 
      nationality: 'Việt Nam', 
      certNumber: 'GCN-003-2024', 
      regDate: '12/01/2024', 
      state: 'Chờ duyệt',
      changes: {}
    },
    { 
      id: 4, 
      status: 'Cập nhật', 
      fullName: 'Phạm Thị Dung', 
      birthDate: '30/05/1988', 
      nationality: 'Việt Nam', 
      certNumber: 'GCN-004-2024', 
      regDate: '13/01/2024', 
      state: 'Đã duyệt',
      changes: {
        nationality: { old: 'Lào', new: 'Việt Nam' },
        state: { old: 'Chờ duyệt', new: 'Đã duyệt' }
      }
    },
    { 
      id: 5, 
      status: 'Mới', 
      fullName: 'Hoàng Văn Em', 
      birthDate: '17/09/1995', 
      nationality: 'Việt Nam', 
      certNumber: 'GCN-005-2024', 
      regDate: '14/01/2024', 
      state: 'Chờ duyệt',
      changes: {}
    },
  ];

  const mockSyncHistory = [
    { 
      id: 1, 
      syncTime: '09/12/2025 14:30:25', 
      status: 'Thành công',
      added: 150,
      updated: 45,
      errors: 0,
      total: 195,
      duration: '2.5s'
    },
    { 
      id: 2, 
      syncTime: '09/12/2025 10:15:10', 
      status: 'Thành công',
      added: 98,
      updated: 32,
      errors: 0,
      total: 130,
      duration: '1.8s'
    },
    { 
      id: 3, 
      syncTime: '08/12/2025 18:45:33', 
      status: 'Mất phần',
      added: 120,
      updated: 28,
      errors: 5,
      total: 153,
      duration: '3.2s'
    },
    { 
      id: 4, 
      syncTime: '08/12/2025 14:20:15', 
      status: 'Thành công',
      added: 210,
      updated: 67,
      errors: 0,
      total: 277,
      duration: '4.1s'
    },
    { 
      id: 5, 
      syncTime: '08/12/2025 10:10:05', 
      status: 'Thành công',
      added: 88,
      updated: 19,
      errors: 0,
      total: 107,
      duration: '1.5s'
    },
  ];

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="h-full flex flex-col bg-slate-50 min-h-screen">
      {/* Header removed */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-3 pt-4 text-base transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'list'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            Danh sách dữ liệu
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-3 pt-4 text-base transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'config'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            Cấu hình kết nối nguồn
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 pt-4 text-base transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HistoryIcon className="w-4 h-4" />
            Lịch sử đồng bộ
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Tab 3: Danh sách dữ liệu */}
        {activeTab === 'list' && (
          <div className="bg-white rounded-lg border border-slate-200">
            {/* Action Bar */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input aria-label="Input field"
                      type="text"
                      placeholder="Tìm kiếm theo họ tên, số giấy chứng nhận..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button 
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-base whitespace-nowrap"
                  >
                    <Filter className="w-4 h-4" />
                    Tìm kiếm nâng cao
                  </button>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-base whitespace-nowrap">
                    <Upload className="w-4 h-4" />
                    Nhập
                  </button>
                  <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-base whitespace-nowrap">
                    <Download className="w-4 h-4" />
                    Xuất
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-base whitespace-nowrap">
                    <RefreshCw className="w-4 h-4" />
                    Đồng bộ
                  </button>
                </div>
              </div>

              {/* Advanced Search Panel */}
              {showAdvancedSearch && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-base text-slate-600 mb-1">Tình trạng</label>
                      <select aria-label="Select box" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Tất cả</option>
                        <option>Mới</option>
                        <option>Cập nhật</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base text-slate-600 mb-1">Trạng thái</label>
                      <select aria-label="Select box" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Tất cả</option>
                        <option>Đã duyệt</option>
                        <option>Chờ duyệt</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base text-slate-600 mb-1">Từ ngày - Đến ngày</label>
                      <div className="flex gap-2">
                        <input aria-label="Input field" type="date" className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input aria-label="Input field" type="date" className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base">
                      Tìm kiếm
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-base">
                      Đặt lại
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-base text-slate-600">STT</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600">Tình trạng</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600">Họ tên</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600">Ngày sinh</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600">Quốc tịch</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600">Số giấy chứng nhận</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600">Ngày đăng ký</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600">Trạng thái</th>
                    <th className="px-4 py-3 text-center text-base text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-base text-slate-600">{index + 1}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-base ${
                          item.status === 'Mới' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-base text-slate-900">{item.fullName}</td>
                      <td className="px-4 py-3 text-base text-slate-600">{item.birthDate}</td>
                      <td className="px-4 py-3 text-base text-slate-600">{item.nationality}</td>
                      <td className="px-4 py-3 text-base text-slate-900">{item.certNumber}</td>
                      <td className="px-4 py-3 text-base text-slate-600">{item.regDate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-base ${
                          item.state === 'Đã duyệt' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {item.state === 'Đã duyệt' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {item.state}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => {
                              setSelectedRecord(item);
                              setShowDetailModal(true);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-base text-slate-600">
                Hiển thị <span className="text-slate-900">1-5</span> trong tổng số <span className="text-slate-900">5</span> bản ghi
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-slate-300 rounded text-base text-slate-600 hover:bg-slate-50">
                  Trước
                </button>
                <button title="Hành động" aria-label="Hành động" className="px-3 py-1 bg-blue-600 text-white rounded text-base">
                  1
                </button>
                <button className="px-3 py-1 border border-slate-300 rounded text-base text-slate-600 hover:bg-slate-50">
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Cấu hình kết nối nguồn */}
        {activeTab === 'config' && (
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-slate-900">Danh sách kết nối API</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-base rounded">● 2 hoạt động</span>
                  <span className="text-base text-slate-500">Tổng: 3</span>
                </div>
                <button 
                  onClick={() => setShowAddApiModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-base"
                >
                  <Plus className="w-4 h-4" />
                  Thêm kết nối
                </button>
              </div>
            </div>

            {/* API Cards */}
            <div className="space-y-3">
              {/* API Card 1 */}
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-slate-900">API Danh mục giới tính</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-base rounded">● Đang kết nối</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-base rounded">API-KEY</span>
                    </div>
                    <p className="text-base text-slate-500">
                      Kết nối API danh sách giới tính cho hệ thống LGSP
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Đồng bộ">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-600 hover:bg-slate-50 rounded transition-colors" title="Chỉnh sửa">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Kiểm tra">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-base">
                  <div>
                    <div className="text-slate-500 text-base mb-1">🔗 Endpoint</div>
                    <div className="text-slate-900 truncate">/api/v1/categories/gender</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-base mb-1">🔄 Method</div>
                    <div className="text-slate-900">GET</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-base mb-1">⏱️ Response Time</div>
                    <div className="text-slate-900">120ms</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-base mb-1">✅ Đăng bộ cuối</div>
                    <div className="text-slate-900">09/12/2025 14:30:25</div>
                  </div>
                </div>
              </div>

              {/* API Card 2 */}
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-slate-900">API Danh mục quốc tịch</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-base rounded">● Đang kết nối</span>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-base rounded">CLIENT-SECRET</span>
                    </div>
                    <p className="text-base text-slate-500">
                      Kết nối API danh sách quốc tịch
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Đồng bộ">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-600 hover:bg-slate-50 rounded transition-colors" title="Chỉnh sửa">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Kiểm tra">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-base">
                  <div>
                    <div className="text-slate-500 text-base mb-1">🔗 Endpoint</div>
                    <div className="text-slate-900 truncate">/api/v1/categories/nationality</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-base mb-1">🔄 Method</div>
                    <div className="text-slate-900">GET</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-base mb-1">⏱️ Response Time</div>
                    <div className="text-slate-900">93ms</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-base mb-1">✅ Đăng bộ cuối</div>
                    <div className="text-slate-900">09/12/2025 14:45:10</div>
                  </div>
                </div>
              </div>

              {/* API Card 3 - Inactive */}
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-slate-900">API Backup (Dự phòng)</h4>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-base rounded">● Ngừng hoạt động</span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-base rounded">OAuth2</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-base rounded">Tạm dừng</span>
                    </div>
                    <p className="text-base text-slate-500">
                      Kết nối dự phòng khi hệ thống chính gặp sự cố
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Đồng bộ">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-600 hover:bg-slate-50 rounded transition-colors" title="Chỉnh sửa">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Kiểm tra">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-base">
                  <div>
                    <div className="text-slate-500 text-base mb-1">🔗 Endpoint</div>
                    <div className="text-slate-900 truncate">/api/v1/backup</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-base mb-1">🔄 Method</div>
                    <div className="text-slate-900">GET</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-base mb-1">⏱️ Response Time</div>
                    <div className="text-slate-900">-</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-base mb-1">✅ Đăng bộ cuối</div>
                    <div className="text-slate-900">-</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add/Edit API Modal */}
            {showAddApiModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg text-slate-900">Thêm kết nối API</h3>
                    <button 
                      onClick={() => setShowAddApiModal(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Thông tin chung */}
                    <div>
                      <h4 className="text-base text-slate-700 mb-3">Thông tin chung</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-base text-slate-600 mb-1">Tên service</label>
                          <input aria-label="Input field"
                            type="text"
                            placeholder="Ví dụ: API danh mục quốc tịch"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-base text-slate-600 mb-1">Mô tả</label>
                          <textarea aria-label="Text input"
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Cấu hình Endpoint */}
                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="text-base text-slate-700 mb-3">Cấu hình Endpoint</h4>
                      <div>
                        <label className="block text-base text-slate-600 mb-1">Base URL</label>
                        <input aria-label="Input field"
                          type="text"
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Thao tác Headers */}
                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="text-base text-slate-700 mb-3">Thao tác Headers</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-base text-slate-600 mb-1">Content-Type</label>
                          <select aria-label="Select box" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>application/json</option>
                            <option>application/xml</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-base text-slate-600 mb-1">Authorization</label>
                          <input aria-label="Input field"
                            type="text"
                            placeholder="Bearer token"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Method & API Key */}
                    <div className="border-t border-slate-200 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-base text-slate-600 mb-1">Method</label>
                          <select aria-label="Select box" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>GET</option>
                            <option>POST</option>
                            <option>PUT</option>
                            <option>DELETE</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-base text-slate-600 mb-1">Loại API</label>
                          <select aria-label="Select box" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>API-KEY</option>
                            <option>CLIENT-SECRET</option>
                            <option>OAuth2</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Retry & Timeout */}
                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="text-base text-slate-700 mb-3">Cấu hình Retry</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-base text-slate-600 mb-1">Số lần thử</label>
                          <select aria-label="Select box" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-base text-slate-600 mb-1">API Key</label>
                          <input aria-label="Input field"
                            type="text"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-base text-slate-600 mb-1">Khoảng cách</label>
                          <input aria-label="Input field"
                            type="text"
                            placeholder="1 phút"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Request/Response Sample */}
                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="text-base text-slate-700 mb-3">Request Sample</h4>
                      <textarea aria-label="Text input"
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        placeholder='{"key": "value"}'
                      />
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="text-base text-slate-700 mb-3">Response Sample</h4>
                      <textarea aria-label="Text input"
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        placeholder="Chưa có query param nào"
                      />
                    </div>

                    {/* Activation */}
                    <div className="border-t border-slate-200 pt-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-base text-slate-700">Kích hoạt kết nối</span>
                      </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base">
                        Lưu kết nối
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-base">
                        Kiểm tra kết nối
                      </button>
                      <button 
                        onClick={() => setShowAddApiModal(false)}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-base"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Lịch sử đồng bộ */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg border border-slate-200">
            {/* Summary Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="text-base text-slate-600">
                Tổng số lần đồng bộ: <span className="text-slate-900">{mockSyncHistory.length} lần</span>
              </div>
              <button className="text-base text-blue-600 hover:text-blue-700 transition-colors">
                Làm mới
              </button>
            </div>

            {/* History Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-base text-slate-600 uppercase">Thời gian</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600 uppercase">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600 uppercase">Thêm mới</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600 uppercase">Cập nhật</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600 uppercase">Lỗi</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600 uppercase">Tổng số</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600 uppercase">Thời lượng</th>
                    <th className="px-4 py-3 text-center text-base text-slate-600 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockSyncHistory.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-base text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {item.syncTime}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-base ${
                          item.status === 'Thành công' 
                            ? 'text-green-600' 
                            : 'text-orange-600'
                        }`}>
                          {item.status === 'Thành công' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-base text-green-600">
                          <span className="text-slate-400">↗</span>
                          {item.added}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-base text-slate-900">{item.updated}</td>
                      <td className="px-4 py-3 text-base text-red-600">{item.errors}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-base text-slate-900">
                          <Database className="w-4 h-4 text-slate-400" />
                          {item.total}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-base text-slate-600">{item.duration}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {item.status === 'Mất phần' && (
                            <button
                              onClick={() => {
                                setSelectedSyncRecord(item);
                                setShowSyncErrorModal(true);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Xem chi tiết lỗi"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg text-slate-900">Chi tiết bản ghi</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-base ${
                  selectedRecord.status === 'Mới' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  {selectedRecord.status}
                </span>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-1">
                {/* Họ tên */}
                <div className={`grid grid-cols-3 gap-4 p-3 rounded ${
                  selectedRecord.changes.fullName ? 'bg-blue-50' : ''
                }`}>
                  <div className="text-base text-slate-600">Họ tên</div>
                  {selectedRecord.changes.fullName ? (
                    <div className="col-span-2">
                      <div className="text-base text-slate-400 line-through mb-1">
                        {selectedRecord.changes.fullName.old}
                      </div>
                      <div className="text-base text-blue-700">
                        {selectedRecord.changes.fullName.new}
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-2 text-base text-slate-900">
                      {selectedRecord.fullName}
                    </div>
                  )}
                </div>

                {/* Ngày sinh */}
                <div className={`grid grid-cols-3 gap-4 p-3 rounded ${
                  selectedRecord.changes.birthDate ? 'bg-blue-50' : ''
                }`}>
                  <div className="text-base text-slate-600">Ngày sinh</div>
                  {selectedRecord.changes.birthDate ? (
                    <div className="col-span-2">
                      <div className="text-base text-slate-400 line-through mb-1">
                        {selectedRecord.changes.birthDate.old}
                      </div>
                      <div className="text-base text-blue-700">
                        {selectedRecord.changes.birthDate.new}
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-2 text-base text-slate-900">
                      {selectedRecord.birthDate}
                    </div>
                  )}
                </div>

                {/* Quốc tịch */}
                <div className={`grid grid-cols-3 gap-4 p-3 rounded ${
                  selectedRecord.changes.nationality ? 'bg-blue-50' : ''
                }`}>
                  <div className="text-base text-slate-600">Quốc tịch</div>
                  {selectedRecord.changes.nationality ? (
                    <div className="col-span-2">
                      <div className="text-base text-slate-400 line-through mb-1">
                        {selectedRecord.changes.nationality.old}
                      </div>
                      <div className="text-base text-blue-700">
                        {selectedRecord.changes.nationality.new}
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-2 text-base text-slate-900">
                      {selectedRecord.nationality}
                    </div>
                  )}
                </div>

                {/* Số giấy chứng nhận */}
                <div className={`grid grid-cols-3 gap-4 p-3 rounded ${
                  selectedRecord.changes.certNumber ? 'bg-blue-50' : ''
                }`}>
                  <div className="text-base text-slate-600">Số giấy chứng nhận</div>
                  {selectedRecord.changes.certNumber ? (
                    <div className="col-span-2">
                      <div className="text-base text-slate-400 line-through mb-1">
                        {selectedRecord.changes.certNumber.old}
                      </div>
                      <div className="text-base text-blue-700">
                        {selectedRecord.changes.certNumber.new}
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-2 text-base text-slate-900">
                      {selectedRecord.certNumber}
                    </div>
                  )}
                </div>

                {/* Ngày đăng ký */}
                <div className={`grid grid-cols-3 gap-4 p-3 rounded ${
                  selectedRecord.changes.regDate ? 'bg-blue-50' : ''
                }`}>
                  <div className="text-base text-slate-600">Ngày đăng ký</div>
                  {selectedRecord.changes.regDate ? (
                    <div className="col-span-2">
                      <div className="text-base text-slate-400 line-through mb-1">
                        {selectedRecord.changes.regDate.old}
                      </div>
                      <div className="text-base text-blue-700">
                        {selectedRecord.changes.regDate.new}
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-2 text-base text-slate-900">
                      {selectedRecord.regDate}
                    </div>
                  )}
                </div>

                {/* Trạng thái */}
                <div className={`grid grid-cols-3 gap-4 p-3 rounded ${
                  selectedRecord.changes.state ? 'bg-blue-50' : ''
                }`}>
                  <div className="text-base text-slate-600">Trạng thái</div>
                  {selectedRecord.changes.state ? (
                    <div className="col-span-2">
                      <div className="text-base text-slate-400 line-through mb-1">
                        {selectedRecord.changes.state.old}
                      </div>
                      <div className="text-base text-blue-700">
                        {selectedRecord.changes.state.new}
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-base ${
                        selectedRecord.state === 'Đã duyệt' 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {selectedRecord.state === 'Đã duyệt' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {selectedRecord.state}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Info */}
              {selectedRecord.status === 'Cập nhật' && Object.keys(selectedRecord.changes).length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-base text-blue-700">
                    <Info className="w-4 h-4" />
                    <span>Có {Object.keys(selectedRecord.changes).length} trường dữ liệu được cập nhật (được bôi xanh)</span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sync Error Modal */}
      {showSyncErrorModal && selectedSyncRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg text-slate-900">Chi tiết lỗi đồng bộ</h2>
              <button
                onClick={() => setShowSyncErrorModal(false)}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                <div>
                  <label className="block text-base text-slate-500 mb-1">Thời điểm chạy</label>
                  <p className="text-base font-mono text-slate-900">{selectedSyncRecord.syncTime}</p>
                </div>
                <div>
                  <label className="block text-base text-slate-500 mb-1">Trạng thái</label>
                  <span className="inline-flex items-center gap-1 text-base px-2 py-1 bg-amber-100 text-amber-700 rounded font-medium">
                    Mất phần
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <label className="block text-base text-slate-500 mb-1">Số lượng lỗi</label>
                  <p className="text-base font-mono text-red-600 font-bold">{selectedSyncRecord.errors}</p>
                </div>
                <div>
                  <label className="block text-base text-slate-500 mb-1">Thời gian xử lý</label>
                  <p className="text-base text-slate-900">{selectedSyncRecord.duration}</p>
                </div>
                <div>
                  <label className="block text-base text-slate-500 mb-1">Mã lỗi</label>
                  <p className="text-base text-red-600 font-medium">D-PARTIAL</p>
                </div>
              </div>

              <div className="mt-6 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-amber-800">
                      <Info className="w-4 h-4" />
                      <h4 className="font-semibold text-base">Chi tiết lỗi dữ liệu: Bản ghi thiếu trường bắt buộc</h4>
                   </div>
                </div>
                <table className="w-full text-left text-base">
                  <thead className="bg-[#f8f7f5] text-slate-700 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2 w-1/4">ID bản ghi</th>
                      <th className="px-4 py-2 w-1/2">Dữ liệu gốc (Raw JSON)</th>
                      <th className="px-4 py-2">Lỗi / Trường bị thiếu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-base text-slate-600">REC-001</td>
                      <td className="px-4 py-3 font-mono text-base text-slate-600 bg-slate-50 rounded border border-slate-100">{"{\"fullName\": \"Nguyễn Văn A\"}"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                           <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-base font-mono font-medium">birthDate</span>
                           <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-base font-mono font-medium">nationality</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-base text-slate-600">REC-045</td>
                      <td className="px-4 py-3 font-mono text-base text-slate-600 bg-slate-50 rounded border border-slate-100">{"{\"fullName\": \"Trần Thị B\", \"nationality\": \"VN\"}"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                           <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-base font-mono font-medium">birthDate</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-base text-slate-600">REC-112</td>
                      <td className="px-4 py-3 font-mono text-base text-slate-600 bg-slate-50 rounded border border-slate-100">{"{\"fullName\": \"\"}"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                           <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-base font-mono font-medium">fullName.EMPTY</span>
                           <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-base font-mono font-medium">certNumber</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => setShowSyncErrorModal(false)}
                className="px-4 py-2 text-base text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}