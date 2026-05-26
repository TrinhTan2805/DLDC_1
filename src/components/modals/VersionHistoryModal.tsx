import { X, History, Calendar, Clock, FileText } from 'lucide-react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockVersions = [
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
                    <p className="text-sm text-slate-700 leading-relaxed">{item.content}</p>
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
