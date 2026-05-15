import { CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

const responses = [
  {
    transaction: 'TXN-2025120701234',
    source: 'Hộ tịch điện tử',
    notificationSent: '10:30:28 - 07/12/2025',
    responseReceived: '10:30:35 - 07/12/2025',
    responseTime: '7 giây',
    status: 'confirmed',
    responseData: {
      status: 'acknowledged',
      message: 'Đã nhận thông báo tiếp nhận thành công',
      action: 'Đã cập nhật trạng thái gửi dữ liệu trong hệ thống nguồn'
    }
  },
  {
    transaction: 'TXN-2025120701235',
    source: 'Thi hành án dân sự',
    notificationSent: '10:25:20 - 07/12/2025',
    responseReceived: '10:26:45 - 07/12/2025',
    responseTime: '1 phút 25 giây',
    status: 'confirmed',
    responseData: {
      status: 'acknowledged',
      message: 'Đã nhận thông báo lỗi, sẽ điều chỉnh và gửi lại',
      action: 'Đang xử lý điều chỉnh dữ liệu lỗi'
    }
  },
  {
    transaction: 'TXN-2025120701236',
    source: 'Hộ sơ quốc tịch',
    notificationSent: '10:20:15 - 07/12/2025',
    responseReceived: '10:20:18 - 07/12/2025',
    responseTime: '3 giây',
    status: 'confirmed',
    responseData: {
      status: 'acknowledged',
      message: 'Hoàn tất quy trình, đã ghi log thành công',
      action: 'Đã lưu log và đóng giao dịch'
    }
  },
  {
    transaction: 'TXN-2025120701237',
    source: 'Công chứng',
    notificationSent: '10:16:30 - 07/12/2025',
    responseReceived: null,
    responseTime: null,
    status: 'waiting',
    responseData: null
  },
  {
    transaction: 'TXN-2025120701238',
    source: 'Đăng ký kinh doanh',
    notificationSent: '10:10:45 - 07/12/2025',
    responseReceived: null,
    responseTime: null,
    status: 'timeout',
    responseData: null
  }
];

export function ResponseTracking() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Đã xác nhận</p>
          <p className="text-gray-900">41</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Đang chờ phản hồi</p>
          <p className="text-gray-900">3</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-red-50 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Timeout</p>
          <p className="text-gray-900">1</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-50 p-3 rounded-lg">
              <RefreshCw className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Thời gian phản hồi TB</p>
          <p className="text-gray-900">12 giây</p>
        </div>
      </div>

      {/* Response List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Theo dõi phản hồi từ hệ thống nguồn</h3>
          <p className="text-gray-500 text-base mt-1">Giám sát phản hồi xác nhận từ các hệ thống nguồn sau khi nhận thông báo</p>
        </div>
        <div className="p-6 space-y-6">
          {responses.map((response, index) => (
            <div key={index} className={`border-2 rounded-lg overflow-hidden ${
              response.status === 'confirmed' ? 'border-green-200' :
              response.status === 'waiting' ? 'border-blue-200' :
              'border-red-200'
            }`}>
              {/* Header */}
              <div className={`px-6 py-4 ${
                response.status === 'confirmed' ? 'bg-green-50' :
                response.status === 'waiting' ? 'bg-blue-50' :
                'bg-red-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {response.status === 'confirmed' && <CheckCircle className="w-6 h-6 text-green-600 mt-1" />}
                    {response.status === 'waiting' && <Clock className="w-6 h-6 text-blue-600 mt-1" />}
                    {response.status === 'timeout' && <XCircle className="w-6 h-6 text-red-600 mt-1" />}
                    <div>
                      <h4 className="text-gray-900 mb-1">{response.source}</h4>
                      <p className="text-gray-600 text-base">Mã giao dịch: {response.transaction}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-base ${
                    response.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    response.status === 'waiting' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {response.status === 'confirmed' ? 'Đã xác nhận' :
                     response.status === 'waiting' ? 'Chờ phản hồi' :
                     'Timeout'}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="px-6 py-4 bg-white">
                <div className="space-y-4">
                  {/* Notification Sent */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      {response.responseReceived && (
                        <div className="w-0.5 h-12 bg-green-300"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 mb-1">Đã gửi thông báo</p>
                      <p className="text-gray-500 text-base">{response.notificationSent}</p>
                    </div>
                  </div>

                  {/* Response Received or Waiting */}
                  {response.responseReceived ? (
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 mb-1">Nhận được phản hồi</p>
                        <p className="text-gray-500 text-base mb-1">{response.responseReceived}</p>
                        <p className="text-green-600 text-base">Thời gian phản hồi: {response.responseTime}</p>
                      </div>
                    </div>
                  ) : response.status === 'waiting' ? (
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 mb-1">Đang chờ phản hồi...</p>
                        <p className="text-blue-600 text-base">Hệ thống đang chờ xác nhận từ nguồn</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 mb-1">Không nhận được phản hồi</p>
                        <p className="text-red-600 text-base">Hết thời gian chờ (timeout 5 phút)</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Response Data */}
                {response.responseData && (
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="text-green-900 mb-3">Nội dung phản hồi:</h5>
                    <div className="space-y-2">
                      <div className="bg-white rounded p-3">
                        <p className="text-gray-500 text-base mb-1">Trạng thái</p>
                        <p className="text-gray-900">{response.responseData.status}</p>
                      </div>
                      <div className="bg-white rounded p-3">
                        <p className="text-gray-500 text-base mb-1">Thông báo</p>
                        <p className="text-gray-900">{response.responseData.message}</p>
                      </div>
                      <div className="bg-white rounded p-3">
                        <p className="text-gray-500 text-base mb-1">Hành động của hệ thống nguồn</p>
                        <p className="text-gray-900">{response.responseData.action}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex gap-3">
                  {response.status === 'timeout' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base">
                      Gửi lại thông báo
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white text-base">
                    Xem chi tiết
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white text-base">
                    Xem log đầy đủ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Cấu hình theo dõi phản hồi</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Thời gian chờ phản hồi (phút)</label>
              <input aria-label="Input field"
                type="number"
                defaultValue="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="text-gray-500 text-base mt-1">Sau thời gian này, hệ thống sẽ đánh dấu là timeout</p>
            </div>
            <div>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 text-red-600 rounded" defaultChecked />
                <span className="text-gray-700">Tự động gửi lại thông báo khi timeout</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 text-red-600 rounded" defaultChecked />
                <span className="text-gray-700">Gửi cảnh báo khi không nhận được phản hồi</span>
              </label>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Số lần thử lại tối đa</label>
              <input aria-label="Input field"
                type="number"
                defaultValue="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
