import { Eye, History } from 'lucide-react';
import { CategoryItem } from '../../OpenDataCategoryPage';

interface OpenDataCategoryGridProps {
  paginatedData: CategoryItem[];
  currentPage: number;
  pageSize: number;
  onViewDetail: (item: CategoryItem) => void;
  onViewVersion?: (item: CategoryItem) => void;
  activeTab: string;
}

// Cùng bộ nhãn/màu trạng thái với màn "Công bố dữ liệu mở" (OpenDataPublishedListPage)
const STATUS_STYLES: Record<string, string> = {
  approved: 'bg-green-50 text-green-600 border-green-200',
  pending: 'bg-purple-50 text-purple-600 border-purple-200',
  rejected: 'bg-red-50 text-red-600 border-red-200',
  draft: 'bg-slate-50 text-slate-600 border-slate-200',
};

const STATUS_LABELS: Record<string, string> = {
  approved: 'Đã công bố',
  pending: 'Chờ công bố',
  rejected: 'Từ chối',
  draft: 'Bản nháp',
};

export function OpenDataCategoryGrid({
  paginatedData,
  currentPage,
  pageSize,
  onViewDetail,
  onViewVersion,
  activeTab
}: OpenDataCategoryGridProps) {
  return (
    <div className="overflow-x-auto font-medium">
      <table className="w-full text-left">
        <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-[13px] font-semibold text-left w-16">STT</th>
            <th className="px-6 py-4 text-[13px] font-semibold text-left">Tên tệp dữ liệu</th>
            <th className="px-6 py-4 text-[13px] font-semibold text-left">Cơ quan công bố</th>
            <th className="px-6 py-4 text-[13px] font-semibold text-left">Ngày tạo</th>
            <th className="px-6 py-4 text-[13px] font-semibold text-left">Trạng thái</th>
            <th className="px-6 py-4 text-[13px] font-semibold text-center w-40">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="px-4 py-3 text-left text-[13px] font-semibold text-slate-900">
                  {item.fileName || `${item.name}.xlsx`}
                </td>
                <td className="px-4 py-3 text-left text-slate-600 font-medium text-[13px]">{item.publisher || '--'}</td>
                <td className="px-4 py-3 text-left text-slate-600 font-medium text-[13px]">{item.createdDate}</td>
                <td className="px-4 py-3 text-left">
                  <span className={`inline-block px-2.5 py-1 text-xs border rounded-full font-medium text-center leading-tight whitespace-nowrap ${STATUS_STYLES[item.approvalStatus] || STATUS_STYLES.pending}`}>
                    {STATUS_LABELS[item.approvalStatus] || 'Chờ công bố'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onViewDetail(item)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {activeTab === 'category' && (
                      <button
                        onClick={() => onViewVersion && onViewVersion(item)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Lịch sử phiên bản"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-slate-500">
                Không tìm thấy dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
