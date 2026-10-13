import { Activity, AlertCircle, CheckCircle, XCircle, Clock, TrendingUp, Search, Download, Eye, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface APIError {
  id: string;
  apiName: string;
  endpoint: string;
  source: string;
  errorType: string;
  errorMessage: string;
  timestamp: string;
  retryCount: number;
  maxRetries: number;
  autoRetry: boolean;
  responseTime?: number;
  statusCode?: number;
}

const mockAPIErrors: APIError[] = [
  {
    id: 'API_ERR001',
    apiName: 'API Dữ liệu Hộ tịch',
    endpoint: 'https://api.ngoaingu.gov.vn/civil-registry/list',
    source: 'Bộ Ngoại giao',
    errorType: 'Timeout',
    errorMessage: 'Request timeout sau 30 giây',
    timestamp: '10/12/2024 10:45:20',
    retryCount: 3,
    maxRetries: 5,
    autoRetry: true,
    responseTime: 30000
  },
  {
    id: 'API_ERR002',
    apiName: 'API Đăng ký Kinh doanh',
    endpoint: 'https://api.khdt.gov.vn/business/registry',
    source: 'Bộ Kế hoạch & Đầu tư',
    errorType: '401 Unauthorized',
    errorMessage: 'Token xác thực đã hết hạn',
    timestamp: '10/12/2024 10:30:15',
    retryCount: 0,
    maxRetries: 3,
    autoRetry: false,
    statusCode: 401,
    responseTime: 1200
  },
  {
    id: 'API_ERR003',
    apiName: 'API Dữ liệu Dân tộc',
    endpoint: 'https://api.nlds.gov.vn/ethnic/list',
    source: 'Ủy ban Dân tộc',
    errorType: '500 Internal Server Error',
    errorMessage: 'Lỗi máy chủ nội bộ',
    timestamp: '10/12/2024 09:15:30',
    retryCount: 2,
    maxRetries: 5,
    autoRetry: true,
    statusCode: 500,
    responseTime: 5000
  },
  {
    id: 'API_ERR004',
    apiName: 'API Người nghèo',
    endpoint: 'https://api.molisa.gov.vn/poverty/info',
    source: 'Bộ Lao động - Thương binh & Xã hội',
    errorType: '404 Not Found',
    errorMessage: 'Endpoint không tồn tại',
    timestamp: '10/12/2024 08:50:45',
    retryCount: 1,
    maxRetries: 3,
    autoRetry: false,
    statusCode: 404,
    responseTime: 800
  },
  {
    id: 'API_ERR005',
    apiName: 'API Cơ quan Nhà nước',
    endpoint: 'https://api.noi.gov.vn/agency/list',
    source: 'Bộ Nội vụ',
    errorType: 'Connection Refused',
    errorMessage: 'Không thể kết nối đến máy chủ',
    timestamp: '10/12/2024 08:20:10',
    retryCount: 5,
    maxRetries: 5,
    autoRetry: true
  },
];

const apiSources = [
  { name: 'Bộ Ngoại giao', status: 'error', uptime: 85.5 },
  { name: 'Bộ Kế hoạch & Đầu tư', status: 'warning', uptime: 92.3 },
  { name: 'Ủy ban Dân tộc', status: 'success', uptime: 99.1 },
  { name: 'Bộ Lao động - Thương binh & Xã hội', status: 'error', uptime: 78.2 },
  { name: 'Bộ Nội vụ', status: 'success', uptime: 98.7 },
  { name: 'Bộ Y tế', status: 'success', uptime: 99.5 },
];

export function NotificationAPICollectError() {
  const [errors, setErrors] = useState(mockAPIErrors);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [selectedError, setSelectedError] = useState<APIError | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredErrors = errors.filter(err => {
    const matchSearch = err.apiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       err.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       err.errorType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSource = filterSource === 'all' || err.source === filterSource;
    return matchSearch && matchSource;
  });

  const stats = {
    total: errors.length,
    timeout: errors.filter(e => e.errorType.includes('Timeout')).length,
    auth: errors.filter(e => e.errorType.includes('401')).length,
    server: errors.filter(e => e.errorType.includes('500')).length,
  };

  const getErrorTypeBadge = (errorType: string) => {
    let className = 'bg-slate-100 text-slate-700';
    if (errorType.includes('Timeout')) className = 'bg-orange-100 text-orange-700';
    else if (errorType.includes('401')) className = 'bg-yellow-100 text-yellow-700';
    else if (errorType.includes('500')) className = 'bg-red-100 text-red-700';
    else if (errorType.includes('404')) className = 'bg-purple-100 text-purple-700';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${className}`}>
        {errorType}
      </span>
    );
  };

  const getStatusColor = (status: string) => {
    if (status === 'success') return 'text-green-600';
    if (status === 'warning') return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === 'warning') return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-slate-900">Thông báo lỗi API thu thập</h1>
        <p className="text-slate-600 mt-1">Giám sát lỗi khi thu thập dữ liệu từ các nguồn API</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-600 text-sm">Tổng số lỗi</div>
              <div className="text-slate-900 mt-1">{stats.total}</div>
            </div>
            <AlertCircle className="w-8 h-8 text-slate-600" />
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-600 text-sm">Timeout</div>
              <div className="text-slate-900 mt-1">{stats.timeout}</div>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-600 text-sm">Lỗi xác thực</div>
              <div className="text-slate-900 mt-1">{stats.auth}</div>
            </div>
            <XCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-600 text-sm">Lỗi máy chủ</div>
              <div className="text-slate-900 mt-1">{stats.server}</div>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* API Sources Map */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-slate-900 mb-4">Sơ đồ nguồn dữ liệu</h3>
        <div className="grid grid-cols-3 gap-4">
          {apiSources.map((source, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="text-slate-900 text-sm mb-1">{source.name}</div>
                  <div className="text-slate-600 text-xs">Uptime: {source.uptime}%</div>
                </div>
                {getStatusIcon(source.status)}
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    source.status === 'success' ? 'bg-green-600' :
                    source.status === 'warning' ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${source.uptime}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên API, endpoint, loại lỗi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả nguồn</option>
            {apiSources.map((source, index) => (
              <option key={index} value={source.name}>{source.name}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* API Errors Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-slate-700 text-sm">Tên API</th>
                <th className="px-4 py-3 text-left text-slate-700 text-sm">Nguồn dữ liệu</th>
                <th className="px-4 py-3 text-left text-slate-700 text-sm">Loại lỗi</th>
                <th className="px-4 py-3 text-left text-slate-700 text-sm">Thông điệp</th>
                <th className="px-4 py-3 text-left text-slate-700 text-sm">Thời gian</th>
                <th className="px-4 py-3 text-left text-slate-700 text-sm">Retry</th>
                <th className="px-4 py-3 text-left text-slate-700 text-sm">Response Time</th>
                <th className="px-4 py-3 text-left text-slate-700 text-sm">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredErrors.map((error) => (
                <tr key={error.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="text-slate-900 text-sm">{error.apiName}</div>
                    <div className="text-slate-500 text-xs mt-1">{error.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-700 text-sm">{error.source}</div>
                  </td>
                  <td className="px-4 py-3">
                    {getErrorTypeBadge(error.errorType)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-700 text-sm max-w-xs truncate">
                      {error.errorMessage}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-700 text-sm">{error.timestamp}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-900">{error.retryCount}/{error.maxRetries}</span>
                        {error.autoRetry && (
                          <span title="Auto retry enabled"><RefreshCw className="w-3 h-3 text-blue-600" /></span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        {error.autoRetry ? 'Auto' : 'Manual'}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-700 text-sm">
                      {error.responseTime ? `${error.responseTime}ms` : '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedError(error);
                          setShowDetailModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Retry ngay"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-slate-900">Chi tiết lỗi API #{selectedError.id}</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-600 text-sm mb-1">Tên API</div>
                  <div className="text-slate-900">{selectedError.apiName}</div>
                </div>
                <div>
                  <div className="text-slate-600 text-sm mb-1">Nguồn dữ liệu</div>
                  <div className="text-slate-900">{selectedError.source}</div>
                </div>
              </div>

              <div>
                <div className="text-slate-600 text-sm mb-1">Endpoint</div>
                <div className="p-3 bg-slate-50 rounded-lg text-slate-900 font-mono text-sm break-all">
                  {selectedError.endpoint}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-600 text-sm mb-1">Loại lỗi</div>
                  <div>{getErrorTypeBadge(selectedError.errorType)}</div>
                </div>
                <div>
                  <div className="text-slate-600 text-sm mb-1">Status Code</div>
                  <div className="text-slate-900">{selectedError.statusCode || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-slate-600 text-sm mb-1">Response Time</div>
                  <div className="text-slate-900">{selectedError.responseTime ? `${selectedError.responseTime}ms` : 'N/A'}</div>
                </div>
                <div>
                  <div className="text-slate-600 text-sm mb-1">Thời gian</div>
                  <div className="text-slate-900">{selectedError.timestamp}</div>
                </div>
              </div>

              <div>
                <div className="text-slate-600 text-sm mb-1">Thông điệp lỗi</div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-900">
                  {selectedError.errorMessage}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-600 text-sm mb-1">Số lần retry</div>
                  <div className="text-slate-900">{selectedError.retryCount} / {selectedError.maxRetries}</div>
                </div>
                <div>
                  <div className="text-slate-600 text-sm mb-1">Auto retry</div>
                  <div className="text-slate-900">{selectedError.autoRetry ? 'Bật' : 'Tắt'}</div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="text-slate-700 mb-3">Cấu hình cảnh báo</div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={selectedError.autoRetry} className="rounded text-blue-600" />
                    <span className="text-slate-700 text-sm">Tự động retry khi lỗi</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    <span className="text-slate-700 text-sm">Gửi email cảnh báo</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-slate-700 text-sm">Tạm dừng thu thập nếu lỗi quá 5 lần</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-white transition-colors"
              >
                Đóng
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Lưu cấu hình
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Retry ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
