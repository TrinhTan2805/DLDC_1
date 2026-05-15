import { X, Search } from 'lucide-react';
import { useState } from 'react';

interface AdvancedSearchModalProps {
  onClose: () => void;
  onSearch: (filters: any) => void;
  currentFilters: any;
}

export function AdvancedSearchModal({ onClose, onSearch, currentFilters }: AdvancedSearchModalProps) {
  const [filters, setFilters] = useState(currentFilters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      department: '',
      dataType: '',
      frequency: '',
      format: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Tìm kiếm nâng cao</h2>
              <p className="text-base text-slate-500">Lọc dữ liệu theo nhiều tiêu chí</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Cơ quan */}
            <div>
              <label className="block text-base text-slate-700 mb-2">Cơ quan</label>
              <select aria-label="Select box"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="Tòa án nhân dân tối cao">Tòa án nhân dân tối cao</option>
                <option value="Cục Thống kê Trung ương">Cục Thống kê Trung ương</option>
                <option value="Ủy ban Dân tộc">Ủy ban Dân tộc</option>
                <option value="Bộ Ngoại giao">Bộ Ngoại giao</option>
                <option value="Ban Tôn giáo Chính phủ">Ban Tôn giáo Chính phủ</option>
                <option value="Văn phòng Chính phủ">Văn phòng Chính phủ</option>
                <option value="Bộ Nội vụ">Bộ Nội vụ</option>
                <option value="Bộ Công an">Bộ Công an</option>
                <option value="Bộ Lao động - Thương binh và Xã hội">Bộ Lao động - Thương binh và Xã hội</option>
                <option value="Bộ Y tế">Bộ Y tế</option>
                <option value="Cục Hành chính tư pháp">Cục Hành chính tư pháp</option>
                <option value="Cục Quản lý thi hành án dân sự">Cục Quản lý thi hành án dân sự</option>
                <option value="Cục Đăng ký giao dịch bảo đảm và tài sản">Cục Đăng ký giao dịch bảo đảm và tài sản</option>
                <option value="Cục Kiểm tra văn bản và Quản lý về văn bản QPPL">Cục Kiểm tra văn bản và Quản lý về văn bản QPPL</option>
                <option value="Cục Bổ trợ tư pháp">Cục Bổ trợ tư pháp</option>
                <option value="Vụ Hợp tác quốc tế">Vụ Hợp tác quốc tế</option>
                <option value="Cục Kế hoạch - Tài chính">Cục Kế hoạch - Tài chính</option>
                <option value="Phần mềm thống kê ngành Tư pháp">Phần mềm thống kê ngành Tư pháp</option>
              </select>
            </div>

            {/* Loại dữ liệu */}
            <div>
              <label className="block text-base text-slate-700 mb-2">Loại dữ liệu</label>
              <select aria-label="Select box"
                value={filters.dataType}
                onChange={(e) => setFilters({ ...filters, dataType: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="Tòa án">Tòa án</option>
                <option value="Danh mục">Danh mục</option>
                <option value="Bảo trợ XH">Bảo trợ XH</option>
                <option value="Người có công">Người có công</option>
                <option value="Trẻ em">Trẻ em</option>
                <option value="Hộ tịch">Hộ tịch</option>
                <option value="Quốc tịch">Quốc tịch</option>
                <option value="THADS">THADS</option>
                <option value="GDBĐ">GDBĐ</option>
                <option value="VBQPPL">VBQPPL</option>
                <option value="Tư pháp quốc tế">Tư pháp quốc tế</option>
                <option value="Trợ giúp pháp lý">Trợ giúp pháp lý</option>
                <option value="Giáo dục PL">Giáo dục PL</option>
                <option value="Giám định">Giám định</option>
                <option value="Hợp tác QT">Hợp tác QT</option>
                <option value="Thống kê">Thống kê</option>
              </select>
            </div>

            {/* Tần suất */}
            <div>
              <label className="block text-base text-slate-700 mb-2">Tần suất</label>
              <select aria-label="Select box"
                value={filters.frequency}
                onChange={(e) => setFilters({ ...filters, frequency: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="Hằng ngày">Hằng ngày</option>
                <option value="Hằng tuần">Hằng tuần</option>
                <option value="Hằng tháng">Hằng tháng</option>
                <option value="Hằng quý">Hằng quý</option>
                <option value="Hằng năm">Hằng năm</option>
              </select>
            </div>

            {/* Định dạng */}
            <div>
              <label className="block text-base text-slate-700 mb-2">Định dạng</label>
              <select aria-label="Select box"
                value={filters.format}
                onChange={(e) => setFilters({ ...filters, format: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="JSON">JSON</option>
                <option value="XML">XML</option>
                <option value="CSV">CSV</option>
                <option value="Excel">Excel</option>
              </select>
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-base text-slate-700 mb-2">Trạng thái</label>
              <select aria-label="Select box"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="collected">Đã thu thập</option>
                <option value="pending">Đang xử lý</option>
                <option value="not-started">Chưa bắt đầu</option>
              </select>
            </div>

            {/* Mức độ ưu tiên */}
            <div>
              <label className="block text-base text-slate-700 mb-2">Mức độ ưu tiên</label>
              <select aria-label="Select box"
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>
          </div>

          {/* Thời gian cập nhật */}
          <div>
            <label className="block text-base text-slate-700 mb-2">Thời gian cập nhật</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base text-slate-500 mb-1">Từ ngày</label>
                <input aria-label="Input field"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-base text-slate-500 mb-1">Đến ngày</label>
                <input aria-label="Input field"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Đặt lại
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
