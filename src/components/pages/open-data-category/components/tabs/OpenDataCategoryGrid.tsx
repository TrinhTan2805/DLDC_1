import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { CategoryItem } from '../../OpenDataCategoryPage';

interface OpenDataCategoryGridProps {
  paginatedData: CategoryItem[];
  currentPage: number;
  pageSize: number;
  onViewDetail: (item: CategoryItem) => void;
  onEdit: (item: CategoryItem) => void;
  onDelete: (item: CategoryItem) => void;
  activeTab: string;
}

export function OpenDataCategoryGrid({
  paginatedData,
  currentPage,
  pageSize,
  onViewDetail,
  onEdit,
  onDelete,
  activeTab
}: OpenDataCategoryGridProps) {
  return (
    <div className="overflow-x-auto font-medium">
      <table className="w-full text-left">
        <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-[14px] font-semibold text-left w-16">STT</th>
            <th className="px-6 py-4 text-[14px] font-semibold text-left">Tên tệp dữ liệu</th>
            <th className="px-6 py-4 text-[14px] font-semibold text-left">Metadata</th>
            <th className="px-6 py-4 text-[14px] font-semibold text-left">Giấy phép</th>
            <th className="px-6 py-4 text-[14px] font-semibold text-left">Công khai</th>
            <th className="px-6 py-4 text-[14px] font-semibold text-left">Ngày tạo</th>
            <th className="px-6 py-4 text-[14px] font-semibold text-left">Người cập nhật</th>
            <th className="px-6 py-4 text-[14px] font-semibold text-right w-40">Thao tác</th>
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
                <td className="px-4 py-3 text-left text-[13px]">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[11px] font-semibold">Excel</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[11px]">
                      {item.id === 1 ? '3 cột' : item.id === 2 ? '6 cột' : '9 cột'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-left text-[13px]">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[11px] font-medium">
                    {item.id === 2 ? 'Giấy phép ODC-BY' : 'Giấy phép dữ liệu mở công cộng'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {item.publishStatus === 'published' ? (
                    <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full font-medium">
                      Đã công khai
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full font-medium">
                      Chưa công khai
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-slate-600 font-medium text-[13px]">{item.createdDate}</td>
                <td className="px-4 py-3 text-left text-slate-600 font-medium text-[13px]">{item.updatedBy}</td>
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
                      <>
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-[13px] text-slate-500">
                Không tìm thấy dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
