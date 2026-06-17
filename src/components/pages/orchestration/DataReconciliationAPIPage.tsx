import { Plus, Search, GitCompare, Eye, Edit, Trash2, CheckCircle, XCircle, Activity, X, Save, Server } from 'lucide-react';
import { StatusTag } from '../../common/StatusTag';

interface ReconciliationAPI {
  id: string;
  code: string;
  name: string;
  description?: string;
  sourceSystem: string;
  targetSystem: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'active' | 'inactive' | 'error';
  frequency: string;
  lastRun: string;
  matchRate: number;
  totalRecords: number;
  matchedRecords: number;
  unmatchedRecords: number;
  createdDate: string;
  lastModified: string;
}

const mockReconciliationAPIs: ReconciliationAPI[] = [
  {
    id: '1',
    code: 'RC-API001',
    name: 'API đối soát dữ liệu hộ tịch',
    description: 'API đối soát dữ liệu giữa CSDL hộ tịch trung ương và địa phương',
    sourceSystem: 'CSDL Hộ tịch TW',
    targetSystem: 'CSDL Hộ tịch ĐP',
    endpoint: '/api/v1/reconcile/civil-registry',
    method: 'POST',
    status: 'active',
    frequency: 'Hàng ngày lúc 02:00',
    lastRun: '10/12/2024 02:00',
    matchRate: 99.5,
    totalRecords: 15234,
    matchedRecords: 15158,
    unmatchedRecords: 76,
    createdDate: '01/01/2024',
    lastModified: '10/12/2024'
  },
  {
    id: '2',
    code: 'RC-API002',
    name: 'API đối soát đăng ký kinh doanh',
    description: 'API đối soát dữ liệu đăng ký kinh doanh với hệ thống quốc gia',
    sourceSystem: 'Hệ thống ĐKKD QG',
    targetSystem: 'CSDL ĐKKD BTP',
    endpoint: '/api/v1/reconcile/business-registration',
    method: 'POST',
    status: 'active',
    frequency: 'Mỗi 6 giờ',
    lastRun: '10/12/2024 12:00',
    matchRate: 98.2,
    totalRecords: 8456,
    matchedRecords: 8304,
    unmatchedRecords: 152,
    createdDate: '15/02/2024',
    lastModified: '10/12/2024'
  },
  {
    id: '3',
    code: 'RC-API003',
    name: 'API đối soát văn bản pháp luật',
    description: 'API đối soát dữ liệu văn bản pháp luật giữa các nguồn',
    sourceSystem: 'CSDL VBPL chính thức',
    targetSystem: 'Cổng TTĐT',
    endpoint: '/api/v1/reconcile/legal-documents',
    method: 'POST',
    status: 'error',
    frequency: 'Hàng tuần (Chủ nhật)',
    lastRun: '08/12/2024 03:00',
    matchRate: 85.7,
    totalRecords: 3421,
    matchedRecords: 2932,
    unmatchedRecords: 489,
    createdDate: '20/03/2024',
    lastModified: '08/12/2024'
  },
  {
    id: '4',
    code: 'RC-API004',
    name: 'API đối soát dữ liệu công chứng',
    description: 'API đối soát hồ sơ công chứng giữa các đơn vị',
    sourceSystem: 'Hệ thống công chứng',
    targetSystem: 'Kho DLDC',
    endpoint: '/api/v1/reconcile/notary',
    method: 'POST',
    status: 'inactive',
    frequency: 'Hàng ngày lúc 01:00',
    lastRun: '09/12/2024 01:00',
    matchRate: 92.3,
    totalRecords: 1234,
    matchedRecords: 1139,
    unmatchedRecords: 95,
    createdDate: '10/04/2024',
    lastModified: '09/12/2024'
  },
  {
    id: '5',
    code: 'RC-API005',
    name: 'API đối soát trợ giúp pháp lý',
    description: 'API đối soát dữ liệu yêu cầu và hồ sơ TGPL',
    sourceSystem: 'Hệ thống TGPL',
    targetSystem: 'CSDL TGPL tổng hợp',
    endpoint: '/api/v1/reconcile/legal-aid',
    method: 'POST',
    status: 'active',
    frequency: 'Hàng ngày lúc 23:00',
    lastRun: '09/12/2024 23:00',
    matchRate: 96.8,
    totalRecords: 567,
    matchedRecords: 549,
    unmatchedRecords: 18,
    createdDate: '05/05/2024',
    lastModified: '09/12/2024'
  }
];

export function DataReconciliationAPIPage() {
  const [apis, setApis] = useState<ReconciliationAPI[]>(mockReconciliationAPIs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState<ReconciliationAPI | null>(null);

  // Form state
  const [formData, setFormData] = useState<any>({
    code: '',
    name: '',
    description: '',
    sourceSystem: '',
    targetSystem: '',
    endpoint: '',
    method: 'POST',
    status: 'active',
    frequency: 'Hàng ngày'
  });

  // Filter APIs
  const filteredAPIs = apis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.sourceSystem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.targetSystem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || api.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const labels = {
      active: 'Hoạt động',
      inactive: 'Tạm dừng',
      error: 'Lỗi'
    };
    return (
      <StatusTag
        label={labels[status as keyof typeof labels]}
        variant={status === 'active' ? 'green' : status === 'inactive' ? 'slate' : 'red'}
      />
    );
  };

  const getMethodBadge = (method: string) => {
    return (
      <StatusTag
        label={method}
        variant={method === 'GET' ? 'green' : method === 'POST' ? 'blue' : method === 'PUT' ? 'orange' : 'red'}
      />
    );
  };

  const stats = {
    total: apis.length,
    active: apis.filter(a => a.status === 'active').length,
    inactive: apis.filter(a => a.status === 'inactive').length,
    error: apis.filter(a => a.status === 'error').length,
    avgMatchRate: (apis.reduce((sum, api) => sum + api.matchRate, 0) / apis.length).toFixed(1)
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      sourceSystem: '',
      targetSystem: '',
      endpoint: '',
      method: 'POST',
      status: 'active',
      frequency: 'Hàng ngày'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <GitCompare className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <div className="text-xs text-slate-600">Tổng số API</div>
                <div className="text-slate-900 mt-1">{stats.total}</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-slate-600">Đang hoạt động</div>
                <div className="text-slate-900 mt-1">{stats.active}</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <div className="text-xs text-slate-600">Tạm dừng</div>
                <div className="text-slate-900 mt-1">{stats.inactive}</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-xs text-slate-600">Lỗi</div>
                <div className="text-slate-900 mt-1">{stats.error}</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-slate-600">Tỷ lệ khớp TB</div>
                <div className="text-slate-900 mt-1">{stats.avgMatchRate}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã API, hệ thống..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Tạm dừng</option>
              <option value="error">Lỗi</option>
            </select>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Thêm API đối soát mới
            </button>
          </div>
        </div>

        {/* API List */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã API</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên API</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Hệ thống đích</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tần suất</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tỷ lệ khớp</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAPIs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-500 text-sm">
                      Không tìm thấy API đối soát phù hợp
                    </td>
                  </tr>
                ) : (
                  filteredAPIs.map((api, index) => (
                    <tr key={api.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">
                        <code className="px-2 py-0.5 bg-slate-100 text-pink-700 rounded text-xs">
                          {api.code}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-900">{api.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          <code>{api.endpoint}</code>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{api.targetSystem}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{api.frequency}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className={`${api.matchRate >= 95 ? 'text-green-700' :
                            api.matchRate >= 85 ? 'text-amber-700' :
                              'text-red-700'
                            }`}>
                            {api.matchRate}%
                          </span>
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${api.matchRate >= 95 ? 'bg-green-500' :
                                api.matchRate >= 85 ? 'bg-amber-500' :
                                  'bg-red-500'
                                }`}
                              style={{ width: `${api.matchRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(api.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Xem chi tiết"
                            onClick={() => {
                              setSelectedAPI(api);
                              setShowViewModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                            title="Chỉnh sửa"
                            onClick={() => {
                              setSelectedAPI(api);
                              setFormData(api);
                              setShowEditModal(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                            title="Chạy ngay"
                          >
                            <Activity className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Xóa"
                            onClick={() => {
                              setSelectedAPI(api);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add API Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-slate-900">Thêm API đối soát mới</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Mã API *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="RC-API001"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Phương thức</label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Tên API *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên API đối soát"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập mô tả chi tiết về API"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Hệ thống đích *</label>
                <input
                  type="text"
                  value={formData.targetSystem}
                  onChange={(e) => setFormData({ ...formData, targetSystem: e.target.value })}
                  placeholder="Tên hệ thống đích"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Endpoint *</label>
                <input
                  type="text"
                  value={formData.endpoint}
                  onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  placeholder="/api/v1/reconcile/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Tần suất thực hiện</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Hàng ngày">Hàng ngày</option>
                    <option value="Mỗi 6 giờ">Mỗi 6 giờ</option>
                    <option value="Mỗi 12 giờ">Mỗi 12 giờ</option>
                    <option value="Hàng tuần">Hàng tuần</option>
                    <option value="Hàng tháng">Hàng tháng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm dừng</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Handle save logic here
                  setShowAddModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit API Modal */}
      {showEditModal && selectedAPI && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-slate-900">Chỉnh sửa API đối soát</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Mã API *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Phương thức</label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Tên API *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Hệ thống đích *</label>
                <input
                  type="text"
                  value={formData.targetSystem}
                  onChange={(e) => setFormData({ ...formData, targetSystem: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Endpoint *</label>
                <input
                  type="text"
                  value={formData.endpoint}
                  onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Tần suất thực hiện</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Hàng ngày">Hàng ngày</option>
                    <option value="Mỗi 6 giờ">Mỗi 6 giờ</option>
                    <option value="Mỗi 12 giờ">Mỗi 12 giờ</option>
                    <option value="Hàng tuần">Hàng tuần</option>
                    <option value="Hàng tháng">Hàng tháng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm dừng</option>
                    <option value="error">Lỗi</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Handle update logic here
                  setShowEditModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View API Details Modal */}
      {showViewModal && selectedAPI && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-slate-900">Chi tiết API đối soát</h2>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Thông tin cơ bản */}
              <div className="space-y-4">
                <h3 className="text-sm text-slate-900">Thông tin cơ bản</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Mã API</label>
                    <div className="text-sm text-slate-900">{selectedAPI.code}</div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Phương thức</label>
                    <div>{getMethodBadge(selectedAPI.method)}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Tên API</label>
                  <div className="text-sm text-slate-900">{selectedAPI.name}</div>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Mô tả</label>
                  <div className="text-sm text-slate-900">{selectedAPI.description || 'N/A'}</div>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Endpoint</label>
                  <div className="text-sm text-slate-900 break-all">
                    <code className="px-2 py-1 bg-slate-100 rounded text-xs">{selectedAPI.endpoint}</code>
                  </div>
                </div>
              </div>

              {/* Cấu hình hệ thống */}
              <div className="space-y-4 border-t border-slate-200 pt-4">
                <h3 className="text-sm text-slate-900">Cấu hình hệ thống</h3>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Hệ thống đích</label>
                  <div className="text-sm text-slate-900">{selectedAPI.targetSystem}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Tần suất thực hiện</label>
                    <div className="text-sm text-slate-900">{selectedAPI.frequency}</div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Trạng thái</label>
                    <div>{getStatusBadge(selectedAPI.status)}</div>
                  </div>
                </div>
              </div>

              {/* Thống kê đối soát */}
              <div className="space-y-4 border-t border-slate-200 pt-4">
                <h3 className="text-sm text-slate-900">Thống kê đối soát</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-xs text-blue-600 mb-1">Tổng bản ghi</div>
                    <div className="text-blue-900">{selectedAPI.totalRecords.toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-xs text-green-600 mb-1">Bản ghi khớp</div>
                    <div className="text-green-900">{selectedAPI.matchedRecords.toLocaleString()}</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-xs text-red-600 mb-1">Bản ghi không khớp</div>
                    <div className="text-red-900">{selectedAPI.unmatchedRecords.toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Tỷ lệ khớp</label>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-900">{selectedAPI.matchRate}%</div>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${selectedAPI.matchRate >= 95 ? 'bg-green-500' :
                          selectedAPI.matchRate >= 85 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                        style={{ width: `${selectedAPI.matchRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Lần chạy cuối</label>
                  <div className="text-sm text-slate-900">{selectedAPI.lastRun}</div>
                </div>
              </div>

              {/* Thông tin hệ thống */}
              <div className="space-y-4 border-t border-slate-200 pt-4">
                <h3 className="text-sm text-slate-900">Thông tin hệ thống</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Ngày tạo</label>
                    <div className="text-sm text-slate-900">{selectedAPI.createdDate}</div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Cập nhật lần cuối</label>
                    <div className="text-sm text-slate-900">{selectedAPI.lastModified}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAPI && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-slate-900">Xác nhận xóa</h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-700">
                Bạn có chắc chắn muốn xóa API đối soát <strong>{selectedAPI.name}</strong> không? Hành động này không thể hoàn tác.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <div>
                  <span className="text-slate-600">Mã API:</span>
                  <span className="ml-2 text-slate-900">{selectedAPI.code}</span>
                </div>
                <div>
                  <span className="text-slate-600">Hệ thống:</span>
                  <span className="ml-2 text-slate-900">{selectedAPI.sourceSystem} → {selectedAPI.targetSystem}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Handle delete logic here
                  setApis(apis.filter(api => api.id !== selectedAPI.id));
                  setShowDeleteModal(false);
                  setSelectedAPI(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}