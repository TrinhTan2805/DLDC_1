import { CheckCircle, XCircle, Send, Mail, Bell } from 'lucide-react';

const notifications = [
  {
    id: 1,
    transaction: 'TXN-2025120701234',
    source: 'Hộ tịch điện tử',
    type: 'success',
    subject: 'Tiếp nhận dữ liệu thành công',
    message: 'Hệ thống đã tiếp nhận thành công 2,345 bản ghi từ CSDL Hộ tịch điện tử. Mã giao dịch: TXN-2025120701234. Tất cả dữ liệu đã vượt qua kiểm tra và được lưu vào kho dữ liệu chung.',
    sentTime: '10:30:28 - 07/12/2025',
    status: 'sent',
    recipient: 'admin@hotich.moj.gov.vn'
  },
  {
    id: 2,
    transaction: 'TXN-2025120701235',
    source: 'Thi hành án dân sự',
    type: 'error',
    subject: 'Phát hiện lỗi trong dữ liệu',
    message: 'Hệ thống phát hiện 34 lỗi trong dữ liệu gửi lên:\n- 3 bản ghi thiếu trường bắt buộc "so_cccd"\n- 3 bản ghi có định dạng ngày tháng không hợp lệ\n- 28 bản ghi bị trùng lặp\n\nVui lòng kiểm tra và gửi lại dữ liệu đã được điều chỉnh.',
    sentTime: '10:25:20 - 07/12/2025',
    status: 'sent',
    recipient: 'admin@thads.moj.gov.vn',
    errorDetails: [
      { line: 15, field: 'so_cccd', error: 'Trường bắt buộc bị thiếu' },
      { line: 23, field: 'so_cccd', error: 'Trường bắt buộc bị thiếu' },
      { line: 45, field: 'so_cccd', error: 'Trường bắt buộc bị thiếu' },
    ]
  },
  {
    id: 3,
    transaction: 'TXN-2025120701236',
    source: 'Hộ sơ quốc tịch',
    type: 'success',
    subject: 'Hoàn tất quy trình thu thập',
    message: 'Quy trình thu thập dữ liệu đã hoàn tất thành công. 456 bản ghi đã được tiếp nhận, kiểm tra và lưu trữ. Hệ thống nguồn đã xác nhận nhận thông báo.',
    sentTime: '10:20:15 - 07/12/2025',
    status: 'sent',
    recipient: 'admin@quoctich.moj.gov.vn'
  }
];

export function NotificationManagement() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Đã gửi (Hôm nay)</p>
          <p className="text-gray-900">45</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Thông báo thành công</p>
          <p className="text-gray-900">41</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-red-50 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Thông báo lỗi</p>
          <p className="text-gray-900">4</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-50 p-3 rounded-lg">
              <Bell className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Chờ gửi</p>
          <p className="text-gray-900">2</p>
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Danh sách thông báo</h3>
          <p className="text-gray-500 text-base mt-1">Lịch sử gửi thông báo đến hệ thống nguồn</p>
        </div>
        <div className="p-6 space-y-6">
          {notifications.map((notification) => (
            <div key={notification.id} className={`border-2 rounded-lg overflow-hidden ${
              notification.type === 'error' ? 'border-red-200' : 'border-green-200'
            }`}>
              {/* Header */}
              <div className={`px-6 py-4 ${
                notification.type === 'error' ? 'bg-red-50' : 'bg-green-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {notification.type === 'error' ? (
                      <XCircle className="w-6 h-6 text-red-600 mt-1" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                    )}
                    <div>
                      <h4 className="text-gray-900 mb-1">{notification.subject}</h4>
                      <p className="text-gray-600 text-base">Gửi tới: {notification.source}</p>
                      <p className="text-gray-500 text-base">Email: {notification.recipient}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-2 rounded-full text-base ${
                      notification.status === 'sent' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {notification.status === 'sent' ? 'Đã gửi' : 'Chờ gửi'}
                    </span>
                    <p className="text-gray-500 text-base mt-2">{notification.sentTime}</p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="px-6 py-4 bg-white">
                <div className="mb-4">
                  <p className="text-gray-700 whitespace-pre-line">{notification.message}</p>
                </div>

                {/* Error Details if exists */}
                {notification.errorDetails && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h5 className="text-red-900 mb-3">Chi tiết lỗi:</h5>
                    <div className="space-y-2">
                      {notification.errorDetails.map((detail, idx) => (
                        <div key={idx} className="bg-white rounded p-3 text-base">
                          <p className="text-gray-900">
                            <span className="font-medium">Dòng {detail.line}:</span> Trường "{detail.field}"
                          </p>
                          <p className="text-red-600">{detail.error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transaction Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500 text-base">Mã giao dịch: {notification.transaction}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex gap-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white text-base">
                    Gửi lại
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white text-base">
                    Xem chi tiết
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white text-base">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Cấu hình thông báo</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 text-red-600 rounded" defaultChecked />
                <span className="text-gray-700">Tự động gửi thông báo khi tiếp nhận thành công</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 text-red-600 rounded" defaultChecked />
                <span className="text-gray-700">Tự động gửi thông báo khi phát hiện lỗi</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 text-red-600 rounded" />
                <span className="text-gray-700">CC email cho quản trị viên hệ thống</span>
              </label>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email template thông báo thành công</label>
              <textarea aria-label="Text input"
                rows={4}
                title="Email template thông báo thành công"
                placeholder="Nhập nội dung email mẫu..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                defaultValue="Kính gửi [TÊN_ĐƠN_VỊ],&#10;&#10;Hệ thống Kho Dữ liệu Dùng Chung đã tiếp nhận thành công [SỐ_BẢN_GHI] bản ghi từ hệ thống của quý đơn vị.&#10;Mã giao dịch: [MÃ_GIAO_DỊCH]"
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email template thông báo lỗi</label>
              <textarea aria-label="Text input"
                rows={4}
                title="Email template thông báo lỗi"
                placeholder="Nhập nội dung email mẫu..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                defaultValue="Kính gửi [TÊN_ĐƠN_VỊ],&#10;&#10;Hệ thống phát hiện [SỐ_LỖI] lỗi trong dữ liệu gửi lên. Vui lòng kiểm tra chi tiết lỗi và gửi lại dữ liệu đã được điều chỉnh.&#10;Mã giao dịch: [MÃ_GIAO_DỊCH]"
              ></textarea>
            </div>
            <div className="flex gap-3">
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