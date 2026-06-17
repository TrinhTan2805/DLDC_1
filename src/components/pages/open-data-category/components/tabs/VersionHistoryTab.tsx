import React from 'react';
import { History as HistoryIcon, ArrowLeft, PlusCircle, Download, RotateCcw } from 'lucide-react';
import { CategoryItem, VersionHistoryItem } from '../../OpenDataCategoryPage';

interface VersionHistoryTabProps {
  filteredData: CategoryItem[];
  selectedDatasetForVersion: CategoryItem | null;
  setSelectedDatasetForVersion: (item: CategoryItem | null) => void;
  sampleVersionHistory: VersionHistoryItem[];
  setSelectedVersionToRestore: (item: VersionHistoryItem | null) => void;
  setShowRestoreModal: (show: boolean) => void;
}

export function VersionHistoryTab({
  filteredData,
  selectedDatasetForVersion,
  setSelectedDatasetForVersion,
  sampleVersionHistory,
  setSelectedVersionToRestore,
  setShowRestoreModal
}: VersionHistoryTabProps) {
  return (
    <div className="space-y-6">
      {!selectedDatasetForVersion ? (
        // Master View
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Quản lý phiên bản dữ liệu mở</h2>
            <p className="text-sm text-slate-500">Theo dõi và quản lý lịch sử các phiên bản của tập dữ liệu.</p>
          </div>
          <div className="overflow-x-auto font-medium">
            <table className="w-full text-left">
               <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[14px] font-semibold">Mã</th>
                    <th className="px-6 py-4 text-[14px] font-semibold">Tên tập dữ liệu</th>
                    <th className="px-6 py-4 text-[14px] font-semibold">Phiên bản hiện tại</th>
                    <th className="px-6 py-4 text-[14px] font-semibold">Cập nhật gần nhất</th>
                    <th className="px-6 py-4 text-[14px] font-semibold">Người cập nhật</th>
                    <th className="px-6 py-4 text-[14px] font-semibold text-right">Thao tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 bg-white">
                 {filteredData.map(item => (
                   <tr key={item.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                     <td className="px-4 py-3 text-[13px] text-left"><code className="px-2 py-0.5 bg-slate-100 text-blue-700 rounded text-xs">{item.code}</code></td>
                     <td className="px-4 py-3 text-[13px] text-slate-900 font-semibold text-left">{item.name}</td>
                     <td className="px-4 py-3 text-[13px] text-slate-600 text-left">v1.3</td>
                     <td className="px-4 py-3 text-[13px] text-slate-600 text-left">{item.updatedDate}</td>
                     <td className="px-4 py-3 text-[13px] text-slate-600 text-left">{item.updatedBy || 'Nguyễn Văn A'}</td>
                     <td className="px-4 py-3 text-right">
                       <div className="flex items-center justify-end">
                         <button 
                           onClick={() => setSelectedDatasetForVersion(item)}
                           className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium text-xs cursor-pointer"
                         >
                           <HistoryIcon className="w-3.5 h-3.5" /> Chi tiết phiên bản
                          </button>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Detail View
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
               <button 
                 onClick={() => setSelectedDatasetForVersion(null)}
                 className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm cursor-pointer"
                 title="Quay lại danh sách"
               >
                 <ArrowLeft className="w-4 h-4" />
               </button>
               <div>
                 <h2 className="text-lg font-bold text-slate-900">{selectedDatasetForVersion.name}</h2>
                 <div className="text-[13px] text-slate-500 flex items-center gap-2 mt-1 font-medium">
                    <span>Mã: <code className="text-blue-600 font-semibold">{selectedDatasetForVersion.code}</code></span>
                    <span>•</span>
                    <span>Trạng thái: <span className="text-emerald-600 font-semibold">Hoạt động</span></span>
                 </div>
               </div>
            </div>
            <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-sm text-sm font-medium transition-all active:scale-95 cursor-pointer">
               <PlusCircle className="w-4 h-4" /> Tạo bản cập nhật
            </button>
          </div>

          <div className="overflow-x-auto font-medium">
            <table className="w-full text-left">
              <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[14px] font-semibold">Phiên bản</th>
                  <th className="px-6 py-4 text-[14px] font-semibold w-1/3">Mô tả thay đổi</th>
                  <th className="px-6 py-4 text-[14px] font-semibold">Người cập nhật</th>
                  <th className="px-6 py-4 text-[14px] font-semibold">Ngày cập nhật</th>
                  <th className="px-6 py-4 text-[14px] font-semibold">Trạng thái</th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {sampleVersionHistory.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-700 text-[13px] text-left">{item.version}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-600 leading-relaxed font-normal text-left">{item.changes}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-900 text-left">{item.updatedBy}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-900 text-left">{item.updatedDate}</td>
                    <td className="px-4 py-3 text-[13px] text-left">
                      {item.status === 'Hiện tại' ? (
                        <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full font-medium">Hiện tại</span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full font-medium">Lịch sử</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => alert(`Đang tải về bộ dữ liệu phiên bản ${item.version}...`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title={`Tải xuống bản ${item.version}`}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {item.status === 'Lịch sử' && (
                          <button
                            onClick={() => {
                               setSelectedVersionToRestore(item);
                               setShowRestoreModal(true);
                            }}
                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                            title={`Khôi phục về bản ${item.version}`}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
