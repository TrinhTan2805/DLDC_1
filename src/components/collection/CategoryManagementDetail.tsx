import { useState } from 'react';
import { Database, Settings, History as HistoryIcon, Download, Upload, RefreshCw, Filter, Search, Calendar, CheckCircle, XCircle, Clock, Edit, Trash2, Eye, Plus, FileText, Info } from 'lucide-react';

interface CategoryManagementDetailProps {
  categoryName: string;
  categoryId: string;
}

export function CategoryManagementDetail({ categoryName, categoryId }: CategoryManagementDetailProps) {
  const [activeTab, setActiveTab] = useState<'metadata' | 'list' | 'config' | 'history'>('metadata');

  // Mock data for category data tab
  const mockCategoryData = [
    { id: 1, code: 'DM001', name: 'Danh mục giới tính', status: 'Hoạt động', createdDate: '2024-01-15', updatedBy: 'Nguyễn Văn A' },
    { id: 2, code: 'DM002', name: 'Danh mục dân tộc', status: 'Hoạt động', createdDate: '2024-01-14', updatedBy: 'Trần Thị B' },
    { id: 3, code: 'DM003', name: 'Danh mục quốc tịch', status: 'Không hoạt động', createdDate: '2024-01-13', updatedBy: 'Lê Văn C' },
  ];

  // Mock data for list tab
  const mockListData = [
    { 
      id: 1, 
      status: 'Mới', 
      fullName: 'Nguyễn Văn An', 
      birthDate: '15/03/1990', 
      nationality: 'Việt Nam', 
      certNumber: 'GCN-001-2024', 
      regDate: '10/01/2024', 
      state: 'Đã duyệt' 
    },
    { 
      id: 2, 
      status: 'Đã xử lý', 
      fullName: 'Trần Thị Bình', 
      birthDate: '22/07/1985', 
      nationality: 'Việt Nam', 
      certNumber: 'GCN-002-2024', 
      regDate: '11/01/2024', 
      state: 'Đã duyệt' 
    },
    { 
      id: 3, 
      status: 'Mới', 
      fullName: 'Lê Văn Cường', 
      birthDate: '08/12/1992', 
      nationality: 'Việt Nam', 
      certNumber: 'GCN-003-2024', 
      regDate: '12/01/2024', 
      state: 'Chờ duyệt' 
    },
  ];

  const mockSyncHistory = [
    { 
      id: 1, 
      syncTime: '15/01/2024 10:30:25', 
      source: 'LGSP - Bộ Tư pháp', 
      recordCount: 1250, 
      success: 1240, 
      failed: 10, 
      status: 'Hoàn thành', 
      user: 'Nguyễn Văn A' 
    },
    { 
      id: 2, 
      syncTime: '14/01/2024 14:20:15', 
      source: 'LGSP - Bộ Tư pháp', 
      recordCount: 890, 
      success: 890, 
      failed: 0, 
      status: 'Hoàn thành', 
      user: 'Trần Thị B' 
    },
  ];

  const activeCount = mockCategoryData.filter(item => item.status === 'Hoạt động').length;
  const inactiveCount = mockCategoryData.filter(item => item.status === 'Không hoạt động').length;

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header removed */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('metadata')}
            className={`pb-3 pt-4 text-base transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'metadata'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            Metadata
          </button>
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
        {/* Tab 1: Metadata */}
        {activeTab === 'metadata' && (
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-6">
              <h2 className="text-slate-900 mb-6">Thông tin Metadata</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-base text-slate-600 w-20">STT</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600">Thông tin metadata</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600">Mô tả</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-base text-slate-600">1</td>
                      <td className="px-4 py-3 text-base text-slate-900">Tên tập dữ liệu</td>
                      <td className="px-4 py-3 text-base text-slate-600">Tên chính thức của dữ liệu</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-base text-slate-600">2</td>
                      <td className="px-4 py-3 text-base text-slate-900">Mô tả dữ liệu</td>
                      <td className="px-4 py-3 text-base text-slate-600">Nội dung, phạm vi, mục đích sử dụng</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-base text-slate-600">3</td>
                      <td className="px-4 py-3 text-base text-slate-900">Lĩnh vực/Chủ đề</td>
                      <td className="px-4 py-3 text-base text-slate-600">Hộ tịch, Công chứng, THA, …</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-base text-slate-600">4</td>
                      <td className="px-4 py-3 text-base text-slate-900">Từ khóa</td>
                      <td className="px-4 py-3 text-base text-slate-600">Hỗ trợ tìm kiếm</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-base text-slate-600">5</td>
                      <td className="px-4 py-3 text-base text-slate-900">Ngôn ngữ</td>
                      <td className="px-4 py-3 text-base text-slate-600">vi, en</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-base text-slate-600">6</td>
                      <td className="px-4 py-3 text-base text-slate-900">Định dạng dữ liệu</td>
                      <td className="px-4 py-3 text-base text-slate-600">CSV, JSON, XML, API</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-base text-slate-600">7</td>
                      <td className="px-4 py-3 text-base text-slate-900">Phạm vi dữ liệu</td>
                      <td className="px-4 py-3 text-base text-slate-600">Toàn quốc / địa phương</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-base text-slate-600">8</td>
                      <td className="px-4 py-3 text-base text-slate-900">Thời gian dữ liệu</td>
                      <td className="px-4 py-3 text-base text-slate-600">Từ năm – đến năm</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Edit Button */}
              <div className="flex gap-3 pt-6 mt-6 border-t border-slate-200">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa Metadata
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Danh sách dữ liệu */}
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
                      title="Tìm kiếm"
                      placeholder="Tìm kiếm theo họ tên, số giấy chứng nhận..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
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
                  {mockListData.map((item, index) => (
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
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-600 hover:bg-slate-50 rounded transition-colors" title="Chỉnh sửa">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
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
            <div className="p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-base text-slate-600">
                Hiển thị <span className="text-slate-900">1-{mockListData.length}</span> trong tổng số <span className="text-slate-900">{mockListData.length}</span> bản ghi
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

        {/* Tab 3: Cấu hình kết nối nguồn */}
        {activeTab === 'config' && (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-slate-900 mb-6">Cấu hình kết nối nguồn dữ liệu LGSP</h2>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-base text-slate-700 mb-2">Tên kết nối <span className="text-red-500">*</span></label>
                  <input aria-label="Input field"
                    type="text"
                    title="Tên kết nối"
                    defaultValue={`Kết nối LGSP - ${categoryName}`}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-base text-slate-700 mb-2">Mã dịch vụ <span className="text-red-500">*</span></label>
                  <input aria-label="Input field"
                    type="text"
                    title="Mã dịch vụ"
                    defaultValue="LGSP_DV_001"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Connection Info */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-base text-slate-900 mb-4">Thông tin kết nối LGSP</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-base text-slate-700 mb-2">Endpoint URL <span className="text-red-500">*</span></label>
                    <input aria-label="Input field"
                      type="text"
                      title="Endpoint URL"
                      defaultValue="https://lgsp.gov.vn/api/v2/data-sync"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-base text-slate-700 mb-2">Phương thức <span className="text-red-500">*</span></label>
                    <select aria-label="Select box" title="Phương thức" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>POST</option>
                      <option>GET</option>
                      <option>PUT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-base text-slate-700 mb-2">Client ID <span className="text-red-500">*</span></label>
                    <input aria-label="Input field"
                      type="text"
                      title="Client ID"
                      defaultValue="MOJ_DLDC_CLIENT_2024"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-base text-slate-700 mb-2">Client Secret <span className="text-red-500">*</span></label>
                    <input aria-label="Input field"
                      type="password"
                      title="Client Secret"
                      defaultValue="••••••••••••••••"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Lưu cấu hình
                </button>
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Test kết nối
                </button>
                <button className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Lịch sử đồng bộ */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg border border-slate-200">
            {/* Filter Bar */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input aria-label="Input field"
                    type="date"
                    title="Từ ngày"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input aria-label="Input field"
                    type="date"
                    title="Đến ngày"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-base">
                  <Search className="w-4 h-4" />
                  Lọc
                </button>
              </div>
            </div>

            {/* History Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-base text-slate-600">STT</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600">Thời gian đồng bộ</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600">Nguồn dữ liệu</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600">Tổng số bản ghi</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600">Thành công</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600">Thất bại</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-base text-slate-600">Người thực hiện</th>
                    <th className="px-4 py-3 text-center text-base text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockSyncHistory.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-base text-slate-600">{index + 1}</td>
                      <td className="px-4 py-3 text-base text-slate-900">{item.syncTime}</td>
                      <td className="px-4 py-3 text-base text-slate-600">{item.source}</td>
                      <td className="px-4 py-3 text-base text-slate-900">{item.recordCount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-base text-green-600">{item.success.toLocaleString()}</td>
                      <td className="px-4 py-3 text-base text-red-600">{item.failed}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-base ${
                          item.status === 'Hoàn thành' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {item.status === 'Hoàn thành' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-base text-slate-600">{item.user}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
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
                Hiển thị <span className="text-slate-900">1-{mockSyncHistory.length}</span> trong tổng số <span className="text-slate-900">{mockSyncHistory.length}</span> bản ghi
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
      </div>
    </div>
    </div>
  );
}