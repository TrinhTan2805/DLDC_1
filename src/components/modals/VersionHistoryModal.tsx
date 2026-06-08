import { X, History, Calendar, Clock, FileText } from 'lucide-react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockVersions = [
  {
    id: 14,
    version: 'v2.4.5',
    date: '08/06/2026',
    time: '14:20',
    content: `1. Phân hệ Cơ sở dữ liệu Hộ tịch (Xem dữ liệu thu thập):
- Màn hình chính (Xem dữ liệu thu thập): Cập nhật cấu trúc hiển thị mô tả động dưới tiêu đề danh sách, cho phép nhận diện và tự động xuống dòng khi gặp ký tự xuống dòng (\\n).
- Các hộp thoại chi tiết dữ liệu hộ tịch (Khai sinh, Kết hôn, Khai tử, Nuôi con nuôi, Thay đổi/cải chính hộ tịch, Đăng ký giám hộ, Đăng ký giám sát giám hộ, Chấm dứt giám hộ, Chấm dứt giám sát giám hộ, Nhận cha mẹ con, Xác nhận tình trạng hôn nhân): Điều chỉnh mô tả dưới header sang định dạng xuống dòng (Tích hợp: [Tên loại dữ liệu]. \\n Thuộc đơn vị: Cục Hành chính tư pháp.).

2. Phân hệ Cung cấp dữ liệu:
- Màn hình Dịch vụ chia sẻ & Cung cấp số liệu: Đồng bộ hóa toàn diện ngôn ngữ thiết kế giao diện theo quy chuẩn mới.
- Màn hình Danh sách API cung cấp: Gộp cột Mã & Tên API thành một cột hiển thị xếp tầng; thu gọn cột hiển thị tài liệu PDF thành biểu tượng đặc tả.
- Hộp thoại Tạo mới / Cập nhật API cung cấp: Tái cấu trúc giao diện thành màn hình cuộn đơn trang; bổ sung các trường thông tin liên hệ và tự động điền thông tin.

3. Quản lý nhóm người dùng > Phân quyền phạm vi dữ liệu:
- Màn hình Cấu hình bảo mật phạm vi dữ liệu: Thiết kế bảng cấu hình động dữ liệu bảo mật (STT, Trường dữ liệu, Cấu hình thuật toán, nút thêm/xóa dòng) ẩn/hiện linh hoạt dựa theo checkbox bảo mật dữ liệu.

4. Phân hệ Quản trị hệ thống & Danh mục:
- Thanh điều hướng Sidebar (Menu hệ thống): Chuyển trang quản lý Đơn vị thuộc BTP về Sidebar.
- Màn hình Quản lý vai trò: Tinh giản thẻ thống kê tổng quan; loại bỏ cột Đơn vị trong bảng danh sách vai trò.
- Màn hình Sao lưu dự phòng: Ẩn/gỡ bỏ nút thiết lập lịch sao lưu tự động.
- Hộp thoại xác nhận xóa (Đơn vị, Agent kết nối, Hệ thống nguồn): Áp dụng quy tắc modal 5.4 mới, bổ sung hiệu ứng làm mờ nền backdrop-blur-sm.

5. Giao diện chung toàn hệ thống:
- Tất cả các bảng lưới dữ liệu (Grid) và ô nhập liệu (Input): Chuẩn hóa kích thước font chữ hiển thị về cỡ 13px.`
  },
  {
    id: 13,
    version: 'v2.4.4',
    date: '08/06/2026',
    time: '13:30',
    content: 'Cấu hình lại giao diện Tạo mới/Cập nhật API cung cấp dưới dạng màn cuộn đơn trang; bổ sung các trường nhập liệu thông tin liên hệ và cơ chế autofill động. Đồng bộ bảng danh sách API cung cấp: Tách/gộp cột Mã & Tên API thành một cột xếp tầng, loại bỏ cột Đơn vị sử dụng, thu gọn cột đặc tả tài liệu PDF thành Icon đặc tả.'
  },
  {
    id: 12,
    version: 'v2.4.3',
    date: '05/06/2026',
    time: '18:14',
    content: 'Tái cấu trúc và nâng cấp thiết kế UI/UX module Dữ liệu mở (Công bố dữ liệu, Thiết lập danh mục); Đồng nhất thanh tìm kiếm và bộ lọc đa tab. Gỡ bỏ tab Phiên bản. Bổ sung mô tả và tối ưu hiển thị chi tiết các modal Hộ tịch; Cập nhật cấu trúc menu Sidebar và tài liệu dự án.'
  },
  {
    id: 11,
    version: 'v2.4.2',
    date: '03/06/2026',
    time: '08:57',
    content: 'Phân rã logic bàn giao (file) và công khai (API); Bổ sung tính năng hiển thị chi tiết ở tab Tiếp nhận và bàn giao; Thêm modal ProvisionHandoverDetailModal và ProvisionPublishDetailModal; Nâng cấp Modal Bàn giao hiển thị File kết xuất đính kèm để tải về.'
  },
  {
    id: 10,
    version: 'v2.4.1',
    date: '02/06/2026',
    time: '17:50',
    content: 'Cập nhật cây phân quyền chức năng: Loại bỏ mục con của Đối soát dữ liệu và Dịch vụ chia sẻ; thêm nút đóng/mở (dropdown) mặc định thu gọn; hỗ trợ chọn/bỏ chọn hàng loạt chức năng con. Thay thế trường Loại vai trò bằng dropdown Trạng thái (Hoạt động/Không hoạt động) và chuyển xuống dưới cây phân quyền.'
  },
  {
    id: 9,
    version: 'v2.4.0',
    date: '02/06/2026',
    time: '16:55',
    content: 'Nâng cấp giao diện Quản lý danh mục Dữ liệu mở: Tích hợp thiết kế bộ lọc nâng cao 3 trường (Trạng thái, Đơn vị, Tần suất) và nút chuyển đổi linh hoạt. Đồng bộ hóa quy trình 4 trạng thái (Bản nháp, Chờ duyệt, Đã phê duyệt, Từ chối). Cập nhật code mới từ Git: Cải tiến phân hệ Quản lý vai trò, Nhóm người dùng, bổ sung Category Dashboard mới và tối ưu hóa hệ thống Sidebar/MainLayout.'
  },
  {
    id: 8,
    version: 'v2.3.3',
    date: '29/05/2026',
    time: '17:30',
    content: 'Bỏ nút Kết xuất tại các màn xem dữ liệu thu thập; Bỏ 2 tab Thiết lập dịch vụ, Nhật ký đối soát, bỏ 2 button Xuất báo cáo và Đồng bộ thủ công tại mục Đối soát dữ liệu thu thập; Đồng bộ giao diện Đối soát dữ liệu thu thập; Sửa logic Quản lý người dùng theo yêu cầu đã trao đổi, đồng bộ và rà soát màn hình Cấu hình hệ thống, Quản lý nhật ký; Sửa lại màn Xem biểu đồ thống kê; Bổ sung logic gán vai trò và nhóm người dùng tại Quản lý người dùng'
  },
  {
    id: 7,
    version: 'v2.3.2',
    date: '26/05/2026',
    time: '11:40',
    content: 'Cập nhật giao diện trang Quản lý nhóm người dùng: Loại bỏ menu con thừa trên Sidebar, điều chỉnh khối Danh mục đơn vị hiển thị song song bên trái, và cố định hiển thị nút thao tác (Sửa/Xóa) của danh sách đơn vị để nâng cao trải nghiệm người dùng.'
  },
  {
    id: 6,
    version: 'v2.3.0',
    date: '26/05/2026',
    time: '09:00',
    content: 'Nâng cấp phân hệ Quản lý vai trò và Nhóm người dùng: Đồng bộ hóa luồng phân quyền và phân cấp dữ liệu, áp dụng 3 mẫu vai trò chuẩn (Quản trị hệ thống, Quản trị nghiệp vụ, Người dùng cơ bản), cải tiến phương thức gán người dùng qua danh sách ID, bổ sung bộ lọc người dùng chưa được gán vai trò và hỗ trợ gán/xóa trực tiếp người dùng và nhóm người dùng.'
  },
  {
    id: 5,
    version: 'v2.2.0',
    date: '12/04/2026',
    time: '23:15',
    content: 'Tái cấu trúc luồng Thiết lập Thu thập dữ liệu: Nâng cấp màn hình Chi tiết thành cấu trúc Đa Tab với KPI động, cải tiến Dashboard phân dải chính xác phương thức kết nối và nguồn cung cấp. Cải thiện UX và đồng bộ dự án lên Git.'
  },
  {
    id: 1,
    version: 'v2.1.0',
    date: '10/04/2026',
    time: '16:00',
    content: 'Cập nhật giao diện, sửa lỗi hiển thị nút, chuẩn hóa Accessibility và khắc phục màn hình trắng.'
  },
  {
    id: 2,
    version: 'v2.0.1',
    date: '08/04/2026',
    time: '14:30',
    content: 'Cập nhật module Phê duyệt danh mục, sửa lỗi giao diện tab Phân quyền.'
  },
  {
    id: 3,
    version: 'v2.0.0',
    date: '01/04/2026',
    time: '09:00',
    content: 'Bản phát hành lớn: Nâng cấp luồng Master Data, thêm tính năng Thu thập dữ liệu ngoài.'
  },
  {
    id: 4,
    version: 'v1.5.2',
    date: '15/03/2026',
    time: '10:15',
    content: 'Sửa lỗi điều phối dữ liệu nội bộ, tối ưu hóa tốc độ tải trang.'
  }
];

export function VersionHistoryModal({ isOpen, onClose }: VersionHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex origin-top items-start justify-center overflow-y-auto z-[999] p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full flex flex-col mb-auto mt-8 sm:mt-12 shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <History className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Lịch sử triển khai</h2>
              <p className="text-sm text-slate-500">Chi tiết các phiên bản hệ thống đã phát hành</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
            title="Đóng"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-4">
            {mockVersions.map((item, index) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border ${index === 0 ? 'border-teal-200 bg-teal-50/50' : 'border-slate-200 bg-white'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-md text-sm font-semibold ${index === 0 ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-700'}`}>
                      {item.version}
                    </span>
                    {index === 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">Hiện tại</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{item.content}</p>
                  </div>

                  <div className="flex items-center gap-6 mt-3 pt-3 border-t border-slate-100/50">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
