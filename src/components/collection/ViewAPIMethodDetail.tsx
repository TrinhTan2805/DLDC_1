import { X, Globe, Clock, Database, Key, Settings, CheckCircle, XCircle } from 'lucide-react';

interface ViewAPIMethodDetailProps {
  method: any;
  onClose: () => void;
  onEdit: () => void;
}

export function ViewAPIMethodDetail({ method, onClose, onEdit }: ViewAPIMethodDetailProps) {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-slate-900">Chi tiết phương thức thu thập</h3>
            <p className="text-base text-slate-500 mt-1">Xem thông tin chi tiết phương thức API</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-blue-600" />
              <h4 className="text-slate-900">Thông tin cơ bản</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-base text-slate-500 mb-1">Tên phương thức</p>
                <p className="text-base text-slate-900">{method.name}</p>
              </div>
              <div>
                <p className="text-base text-slate-500 mb-1">Phương thức HTTP</p>
                <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 rounded text-base">
                  {method.method}
                </span>
              </div>
              <div>
                <p className="text-base text-slate-500 mb-1">Bộ ban ngành</p>
                <p className="text-base text-slate-900">{method.ministry}</p>
              </div>
              <div>
                <p className="text-base text-slate-500 mb-1">Cơ sở dữ liệu</p>
                <p className="text-base text-slate-900">{method.database}</p>
              </div>
              <div>
                <p className="text-base text-slate-500 mb-1">Tần suất thu thập</p>
                <p className="text-base text-slate-900">{method.frequency}</p>
              </div>
              <div>
                <p className="text-base text-slate-500 mb-1">Trạng thái</p>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-base ${
                  method.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {method.status === 'active' ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {method.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-base text-slate-500 mb-1">Mô tả</p>
              <p className="text-base text-slate-700">
                Phương thức thu thập dữ liệu qua API từ {method.ministry}. 
                Dữ liệu được đồng bộ {method.frequency.toLowerCase()} để đảm bảo tính cập nhật.
              </p>
            </div>
          </div>

          {/* Thông tin API */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-600" />
              <h4 className="text-slate-900">Thông tin API</h4>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-base text-slate-500 mb-1">API Endpoint</p>
                <div className="bg-white border border-slate-200 rounded px-3 py-2">
                  <code className="text-base text-slate-900 font-mono">{method.endpoint}</code>
                </div>
              </div>
              <div>
                <p className="text-base text-slate-500 mb-2">Headers</p>
                <div className="bg-white border border-slate-200 rounded divide-y divide-slate-200">
                  <div className="px-3 py-2 grid grid-cols-2 gap-4">
                    <span className="text-base text-slate-900">Content-Type</span>
                    <span className="text-base text-slate-600">application/json</span>
                  </div>
                  <div className="px-3 py-2 grid grid-cols-2 gap-4">
                    <span className="text-base text-slate-900">Accept</span>
                    <span className="text-base text-slate-600">application/json</span>
                  </div>
                  <div className="px-3 py-2 grid grid-cols-2 gap-4">
                    <span className="text-base text-slate-900">Authorization</span>
                    <span className="text-base text-slate-600">Bearer ••••••••••••</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-base text-slate-500 mb-2">Parameters</p>
                <div className="bg-white border border-slate-200 rounded divide-y divide-slate-200">
                  <div className="px-3 py-2 grid grid-cols-2 gap-4">
                    <span className="text-base text-slate-900">page</span>
                    <span className="text-base text-slate-600">1</span>
                  </div>
                  <div className="px-3 py-2 grid grid-cols-2 gap-4">
                    <span className="text-base text-slate-900">limit</span>
                    <span className="text-base text-slate-600">100</span>
                  </div>
                  <div className="px-3 py-2 grid grid-cols-2 gap-4">
                    <span className="text-base text-slate-900">format</span>
                    <span className="text-base text-slate-600">json</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Xác thực */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-blue-600" />
              <h4 className="text-slate-900">Xác thực (Authentication)</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-base text-slate-500 mb-1">Phương thức xác thực</p>
                <p className="text-base text-slate-900">Bearer Token</p>
              </div>
              <div>
                <p className="text-base text-slate-500 mb-1">Loại kết nối</p>
                <p className="text-base text-slate-900">Kết nối trực tiếp</p>
              </div>
            </div>
          </div>

          {/* Cấu hình nâng cao */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-blue-600" />
              <h4 className="text-slate-900">Cấu hình nâng cao</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-base text-slate-500 mb-1">Timeout</p>
                <p className="text-base text-slate-900">30000 ms</p>
              </div>
              <div>
                <p className="text-base text-slate-500 mb-1">Số lần thử lại</p>
                <p className="text-base text-slate-900">3 lần</p>
              </div>
              <div>
                <p className="text-base text-slate-500 mb-1">Delay giữa các lần thử</p>
                <p className="text-base text-slate-900">5000 ms</p>
              </div>
            </div>
          </div>

          {/* Thống kê */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h4 className="text-slate-900">Thống kê hoạt động</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-slate-900 mb-1">2,847</p>
                <p className="text-base text-slate-500">Tổng lần gọi</p>
              </div>
              <div className="text-center">
                <p className="text-green-600 mb-1">2,790</p>
                <p className="text-base text-slate-500">Thành công</p>
              </div>
              <div className="text-center">
                <p className="text-red-600 mb-1">57</p>
                <p className="text-base text-slate-500">Thất bại</p>
              </div>
              <div className="text-center">
                <p className="text-slate-900 mb-1">98%</p>
                <p className="text-base text-slate-500">Tỷ lệ thành công</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-base text-slate-500 mb-1">Lần gọi cuối</p>
                  <p className="text-base text-slate-900">08/12/2025 14:35:22</p>
                </div>
                <div>
                  <p className="text-base text-slate-500 mb-1">Lần thành công cuối</p>
                  <p className="text-base text-slate-900">08/12/2025 14:35:22</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-slate-300 rounded-lg text-base hover:bg-slate-50 transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={onEdit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-base hover:bg-blue-700 transition-colors"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
