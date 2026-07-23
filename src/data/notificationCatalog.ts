// Danh mục thông báo hệ thống — nguồn: Noti.xlsx
// 4 loại thông báo:
//   success (Thành công) | error (Lỗi hệ thống) | warning (Cảnh báo - bị từ chối) | info (Thông báo)
// Hệ thống KHÔNG phân chia thông báo theo mức độ ưu tiên.

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  source: string;   // Phân hệ › Màn hình
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export const notificationCatalog: NotificationItem[] = [
  {
    id: 'N001',
    type: 'success',
    source: 'Quản lý thu thập › Thiết lập thu thập',
    title: 'Thu thập dữ liệu',
    message: 'Dữ liệu "CSDL Hộ tịch điện tử" thu thập thành công: 2.345 bản ghi mới đã được đồng bộ vào Kho DLDC.',
    time: '21/07/2026 15:42:00',
    isRead: false,
  },
  {
    id: 'N002',
    type: 'error',
    source: 'Quản lý thu thập › Thiết lập thu thập',
    title: 'Thu thập dữ liệu',
    message: 'Dữ liệu "CSDL Thi hành án dân sự" thu thập thất bại. Thông tin lỗi: Kết nối tới API nguồn bị timeout sau 30s.',
    time: '21/07/2026 15:35:00',
    isRead: false,
  },
  {
    id: 'N002b',
    type: 'warning',
    source: 'Danh mục dùng chung › Phê duyệt danh mục',
    title: 'Kết quả phê duyệt danh mục dùng chung',
    message: 'Danh mục dùng chung "Tôn giáo" bị từ chối. Lý do: Thiếu mã chuẩn theo quy định, đề nghị bổ sung.',
    time: '21/07/2026 15:28:00',
    isRead: false,
  },
  {
    id: 'N003',
    type: 'success',
    source: 'Quản lý thu thập › Thiết lập thu thập',
    title: 'Cập nhật dữ liệu thu thập',
    message: 'Dữ liệu "Danh mục Tỉnh/Thành" cập nhật thành công: 128 bản ghi đã được làm mới.',
    time: '21/07/2026 15:17:00',
    isRead: true,
  },
  {
    id: 'N004',
    type: 'error',
    source: 'Quản lý thu thập › Thiết lập thu thập',
    title: 'Cập nhật dữ liệu thu thập',
    message: 'Dữ liệu "CSDL Quốc tịch" cập nhật thất bại. Thông tin lỗi: Không thể ánh xạ 12 bản ghi do sai định dạng ngày tháng.',
    time: '21/07/2026 15:02:00',
    isRead: false,
  },
  {
    id: 'N005',
    type: 'success',
    source: 'Xử lý dữ liệu › Quản lý Quy tắc Xử lý',
    title: 'Xử lý dữ liệu',
    message: 'Dữ liệu bảng "ho_tich_khai_sinh" thuộc nguồn dữ liệu "CSDL Hộ tịch điện tử" xử lý thành công: 1.980 bản ghi đã được chuẩn hóa.',
    time: '21/07/2026 14:47:00',
    isRead: true,
  },
  {
    id: 'N006',
    type: 'error',
    source: 'Xử lý dữ liệu › Quản lý Quy tắc Xử lý',
    title: 'Xử lý dữ liệu',
    message: 'Dữ liệu bảng "thads_quyet_dinh" thuộc nguồn dữ liệu "Thi hành án dân sự" xử lý thất bại. Thông tin lỗi: Vi phạm ràng buộc khóa tham chiếu tại 34 bản ghi.',
    time: '21/07/2026 14:37:00',
    isRead: false,
  },
  {
    id: 'N007',
    type: 'info',
    source: 'Danh mục dùng chung › Thiết lập danh mục',
    title: 'Phê duyệt danh mục dùng chung',
    message: 'Danh mục dùng chung "Dân tộc" đã được gửi yêu cầu phê duyệt. Vui lòng xem xét và xử lý.',
    time: '21/07/2026 13:47:00',
    isRead: true,
  },
  {
    id: 'N008',
    type: 'info',
    source: 'Danh mục dùng chung › Thiết lập danh mục',
    title: 'Phê duyệt phiên bản danh mục dùng chung',
    message: 'Phiên bản mới của danh mục dùng chung "Đơn vị hành chính" đã được chỉnh sửa và gửi phê duyệt lại.',
    time: '21/07/2026 12:47:00',
    isRead: true,
  },
  {
    id: 'N009',
    type: 'info',
    source: 'Danh mục dùng chung › Thiết lập danh mục',
    title: 'Phê duyệt ngừng hiệu lực danh mục dùng chung',
    message: 'Yêu cầu ngừng hiệu lực danh mục dùng chung "Tôn giáo" đã được gửi, đang chờ phê duyệt.',
    time: '21/07/2026 11:47:00',
    isRead: true,
  },
  {
    id: 'N010',
    type: 'info',
    source: 'Danh mục dùng chung › Phê duyệt danh mục',
    title: 'Kết quả phê duyệt danh mục dữ liệu mở',
    message: 'Danh mục "Giới tính" đã được phê duyệt bởi Lãnh đạo đơn vị.',
    time: '21/07/2026 10:47:00',
    isRead: true,
  },
  {
    id: 'N011',
    type: 'info',
    source: 'Danh mục dùng chung › Phê duyệt cấu trúc',
    title: 'Kết quả phê duyệt cấu trúc dữ liệu mở',
    message: 'Cấu trúc dữ liệu mở "Danh sách hộ nghèo, hộ cận nghèo" đã được phê duyệt.',
    time: '21/07/2026 09:47:00',
    isRead: true,
  },
  {
    id: 'N012',
    type: 'info',
    source: 'Danh mục dùng chung › Phê duyệt phiên bản',
    title: 'Kết quả phê duyệt phiên bản dữ liệu mở',
    message: 'Phiên bản 2.1 của bộ dữ liệu mở "Danh sách người được trợ giúp pháp lý" đã được phê duyệt.',
    time: '21/07/2026 07:47:00',
    isRead: true,
  },
  {
    id: 'N013',
    type: 'info',
    source: 'Danh mục dùng chung › Phê duyệt hết hiệu lực',
    title: 'Kết quả phê duyệt hết hiệu lực dữ liệu mở',
    message: 'Yêu cầu hết hiệu lực bộ dữ liệu mở "Danh mục các dân tộc Việt Nam" đã được phê duyệt.',
    time: '21/07/2026 05:47:00',
    isRead: true,
  },
  {
    id: 'N014',
    type: 'info',
    source: 'Dữ liệu mở › Quản lý danh mục',
    title: 'Phê duyệt danh mục dữ liệu mở',
    message: 'Danh mục dữ liệu mở "Danh sách hộ nghèo, hộ cận nghèo theo chuẩn" đã được gửi yêu cầu phê duyệt.',
    time: '20/07/2026 08:15:00',
    isRead: true,
  },
  {
    id: 'N015',
    type: 'info',
    source: 'Dữ liệu mở › Phê duyệt danh mục',
    title: 'Kết quả phê duyệt danh mục dữ liệu mở',
    message: 'Danh mục dữ liệu mở "Thông tin người nhiễm HIV đang được quản lý" đã được phê duyệt.',
    time: '20/07/2026 09:40:00',
    isRead: true,
  },
  {
    id: 'N016',
    type: 'info',
    source: 'Dữ liệu mở › Yêu cầu công bố',
    title: 'Phê duyệt yêu cầu công bố dữ liệu mở',
    message: 'Yêu cầu công bố bộ dữ liệu mở "Thông tin Bản án, quyết định có hiệu lực pháp luật" đã được gửi phê duyệt.',
    time: '20/07/2026 14:20:00',
    isRead: true,
  },
  {
    id: 'N017',
    type: 'info',
    source: 'Dữ liệu mở › Phê duyệt yêu cầu công bố',
    title: 'Kết quả phê duyệt yêu cầu công bố dữ liệu mở',
    message: 'Yêu cầu công bố bộ dữ liệu mở "Danh mục Quốc gia và Quốc tịch trên thế giới" đã được phê duyệt.',
    time: '20/07/2026 16:05:00',
    isRead: true,
  },
  {
    id: 'N018',
    type: 'info',
    source: 'Dữ liệu chủ › Mô hình dữ liệu chủ - Thiết lập thực thể',
    title: 'Phê duyệt Dữ liệu chủ',
    message: 'Thực thể dữ liệu chủ "Cá nhân hành nghề bổ trợ tư pháp" đã được gửi yêu cầu phê duyệt.',
    time: '19/07/2026 10:00:00',
    isRead: true,
  },
  {
    id: 'N019',
    type: 'info',
    source: 'Dữ liệu chủ › Mô hình dữ liệu chủ - Phê duyệt',
    title: 'Kết quả phê duyệt dữ liệu chủ',
    message: 'Thực thể dữ liệu chủ "Tổ chức hành nghề công chứng" đã được phê duyệt.',
    time: '19/07/2026 11:30:00',
    isRead: true,
  },
  {
    id: 'N020',
    type: 'info',
    source: 'Dữ liệu chủ › Cập nhật dữ liệu chủ - Dữ liệu',
    title: 'Phê duyệt cập nhật dữ liệu chủ',
    message: '05 bản ghi cập nhật dữ liệu chủ "Quyết định thi hành án dân sự" đã được gửi yêu cầu phê duyệt.',
    time: '18/07/2026 09:15:00',
    isRead: true,
  },
  {
    id: 'N021',
    type: 'info',
    source: 'Dữ liệu chủ › Cập nhật dữ liệu chủ - Phê duyệt',
    title: 'Kết quả phê duyệt cập nhật dữ liệu chủ',
    message: 'Bản ghi cập nhật dữ liệu chủ "Đăng ký khai sinh" đã được phê duyệt.',
    time: '18/07/2026 14:50:00',
    isRead: true,
  },
  {
    id: 'N022',
    type: 'info',
    source: 'Cung cấp dữ liệu › Thiết lập điều phối dữ liệu - Thiết lập dịch vụ',
    title: 'Phê duyệt dịch vụ chia sẻ dữ liệu',
    message: 'Dịch vụ chia sẻ dữ liệu "API cung cấp dữ liệu Hộ tịch điện tử" đã được gửi yêu cầu phê duyệt.',
    time: '17/07/2026 10:20:00',
    isRead: true,
  },
  {
    id: 'N023',
    type: 'info',
    source: 'Cung cấp dữ liệu › Thiết lập điều phối dữ liệu - Kiểm tra và phê duyệt',
    title: 'Kết quả phê duyệt dịch vụ chia sẻ dữ liệu',
    message: 'Dịch vụ chia sẻ dữ liệu "API cung cấp dữ liệu hồ sơ quốc tịch" đã được phê duyệt và sẵn sàng công bố.',
    time: '17/07/2026 15:40:00',
    isRead: true,
  },
  {
    id: 'N024',
    type: 'info',
    source: 'Cung cấp dữ liệu › Cung cấp dữ liệu theo yêu cầu',
    title: 'Xử lý yêu cầu cung cấp dữ liệu',
    message: 'Yêu cầu cung cấp dữ liệu "YC-2026-0429" từ Sở Nội vụ Lạng Sơn đã được tạo và gửi xử lý.',
    time: '16/07/2026 08:30:00',
    isRead: true,
  },
  {
    id: 'N025',
    type: 'info',
    source: 'Cung cấp dữ liệu › Tra cứu và kết xuất',
    title: 'Kết quả phê duyệt xử lý yêu cầu cung cấp dữ liệu',
    message: 'Yêu cầu cung cấp dữ liệu "YC-2026-0315" đã được phê duyệt và chuyển sang bước kết xuất.',
    time: '16/07/2026 13:10:00',
    isRead: true,
  },
  {
    id: 'N026',
    type: 'info',
    source: 'Cung cấp dữ liệu › Bàn giao dữ liệu',
    title: 'Công khai/hủy công khai dịch vụ cung cấp dữ liệu theo yêu cầu',
    message: 'Yêu cầu cung cấp dữ liệu "YC-2026-0518" đã được công khai trên cổng dữ liệu mở.',
    time: '15/07/2026 09:00:00',
    isRead: true,
  },
  {
    id: 'N027',
    type: 'warning',
    source: 'Dữ liệu chủ › Mô hình dữ liệu chủ - Phê duyệt',
    title: 'Kết quả phê duyệt dữ liệu chủ',
    message: 'Thực thể dữ liệu chủ "Tổ chức hành nghề đấu giá" bị từ chối. Lý do: Trùng thực thể đã tồn tại, cần rà soát lại.',
    time: '19/07/2026 15:20:00',
    isRead: true,
  },
  {
    id: 'N028',
    type: 'warning',
    source: 'Cung cấp dữ liệu › Tra cứu và kết xuất',
    title: 'Kết quả phê duyệt yêu cầu cung cấp dữ liệu',
    message: 'Yêu cầu cung cấp dữ liệu "YC-2026-0611" bị từ chối. Lý do: Mục đích khai thác chưa đủ căn cứ pháp lý.',
    time: '16/07/2026 16:30:00',
    isRead: true,
  },
];

// ── Phát thông báo hệ thống tới tất cả người dùng ────────────────────────────
// Dùng bởi màn "Quản lý thông báo hệ thống" (Quản trị & vận hành). Vì ứng dụng
// chỉ mô phỏng phía client (không có backend đa người dùng), "gửi cho tất cả
// user" được mô phỏng bằng cách thêm bản ghi vào nguồn dùng chung này và báo
// cho các nơi đang hiển thị thông báo (TopBar, màn Quản lý thông báo) cập nhật lại.

type NotificationListener = (newItem: NotificationItem) => void;
const listeners: NotificationListener[] = [];

export function subscribeToNotifications(listener: NotificationListener): () => void {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export function broadcastSystemNotification(title: string, message: string): NotificationItem {
  const item: NotificationItem = {
    id: `SYS-${Date.now()}`,
    type: 'info',
    source: 'Quản trị & vận hành › Quản lý thông báo hệ thống',
    title,
    message,
    time: new Date().toLocaleString('vi-VN'),
    isRead: false,
  };
  notificationCatalog.unshift(item);
  listeners.forEach(fn => fn(item));
  return item;
}
