import React, { useState } from 'react';
import { Clock, Filter, Eye, XCircle } from 'lucide-react';
interface VersionHistoryTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onViewDetail: (version: any) => void;
}

export function VersionHistoryTab({
  searchTerm,
  setSearchTerm,
  onViewDetail
}: VersionHistoryTabProps) {
  const historyData = [
    { id: 3, version: '4.1', author: 'Nguyễn Văn A', category: 'Dữ liệu Danh mục giới tính', date: '05/01/2026 09:30', content: 'Thêm trường "Giới tính khác"', type: 'Cấu trúc', status: 'Success' },
    { id: 2, version: '4.0', author: 'Trần Thị B', category: 'Dữ liệu Danh mục và mã các dân tộc', date: '28/12/2025 14:15', content: 'Cập nhật 5 dân tộc mới', type: 'Dữ liệu', status: 'Success' },
    { id: 1, version: '3.9', author: 'Lê Văn C', category: 'Dữ liệu Danh mục giới tính', date: '15/12/2025 10:00', content: 'Khởi tạo cấu trúc ban đầu', type: 'Cấu trúc', status: 'Success' },
  ];

  const [showFilter, setShowFilter] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<any | null>(null);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
             <h3 className="text-lg font-bold text-slate-900">Lịch sử thay đổi phiên bản</h3>
             <p className="text-sm text-slate-500">Xem lại các thay đổi cấu trúc và dữ liệu qua từng thời kỳ.</p>
          </div>
          <button 
             onClick={() => setShowFilter(true)}
             className="flex items-center gap-2 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors"
          >
             <Filter className="w-4 h-4" />
             Lọc lịch sử
          </button>
       </div>
       
       <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
             <thead className="bg-[#f8fafc] text-slate-600 font-bold border-b border-slate-100">
                <tr>
                   <th className="px-6 py-4">Phiên bản</th>
                   <th className="px-6 py-4">Người thực hiện</th>
                   <th className="px-6 py-4">Danh mục</th>
                   <th className="px-6 py-4">Thời gian</th>
                   <th className="px-6 py-4">Nội dung thay đổi</th>
                   <th className="px-6 py-4">Trạng thái</th>
                   <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 font-medium">
                {historyData.map(v => (
                   <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold text-[12px] border border-blue-100">
                          v{v.version}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-900">{v.author}</td>
                      <td className="px-6 py-4 text-slate-600">{v.category}</td>
                      <td className="px-6 py-4 text-slate-500 text-[13px]">{v.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-800">{v.content}</span>
                          <span className={`text-[10px] font-bold uppercase ${v.type === 'Cấu trúc' ? 'text-purple-500' : 'text-blue-500'}`}>
                            Loại: {v.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[11px] font-bold border border-green-200">
                           {v.status === 'Success' ? 'Đang dùng' : 'Lưu trữ'}
                         </span>
                      </td>
                       <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => setSelectedVersion(v)}
                           className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                           title="Xem chi tiết"
                         >
                           <Eye className="w-4 h-4"/>
                         </button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       {/* Sub Modals */}
       {showFilter && (
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
               <h3 className="text-[17px] font-bold text-slate-800">Lọc lịch sử phiên bản</h3>
               <button onClick={() => setShowFilter(false)} className="text-slate-400 hover:text-slate-600" title="Đóng"><XCircle className="w-5 h-5"/></button>
             </div>
             <div className="p-6 space-y-4">
               <div>
                 <label htmlFor="filter-category" className="block text-[13px] font-bold text-slate-700 mb-1.5">Danh mục</label>
                 <select id="filter-category" title="Chọn danh mục" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[14px] text-slate-700 bg-slate-50">
                   <option>Tất cả danh mục</option>
                   <option>Dữ liệu Danh mục giới tính</option>
                   <option>Dữ liệu Danh mục và mã các dân tộc</option>
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label htmlFor="filter-from-date" className="block text-[13px] font-bold text-slate-700 mb-1.5">Từ ngày</label>
                   <input id="filter-from-date" title="Từ ngày" type="date" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[14px] text-slate-700 bg-slate-50"/>
                 </div>
                 <div>
                   <label htmlFor="filter-to-date" className="block text-[13px] font-bold text-slate-700 mb-1.5">Đến ngày</label>
                   <input id="filter-to-date" title="Đến ngày" type="date" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[14px] text-slate-700 bg-slate-50"/>
                 </div>
               </div>
               <div>
                 <label htmlFor="filter-status" className="block text-[13px] font-bold text-slate-700 mb-1.5">Trạng thái</label>
                 <select id="filter-status" title="Chọn trạng thái" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[14px] text-slate-700 bg-slate-50">
                   <option>Tất cả trạng thái</option>
                   <option>Đang dùng</option>
                   <option>Đã lưu trữ</option>
                 </select>
               </div>
             </div>
             <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl justify-end">
               <button onClick={() => setShowFilter(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-xl text-[14px] transition-colors">Hủy</button>
               <button onClick={() => setShowFilter(false)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[14px] shadow-sm hover:bg-blue-700 transition-colors">Áp dụng bộ lọc</button>
             </div>
           </div>
         </div>
       )}

       {selectedVersion && (
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
             <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
               <div>
                 <h3 className="text-[18px] font-bold text-slate-800">Chi tiết phiên bản v{selectedVersion.version}</h3>
                 <p className="text-[13px] text-slate-500 mt-0.5">{selectedVersion.category}</p>
               </div>
               <button onClick={() => setSelectedVersion(null)} className="text-slate-400 hover:text-slate-600 p-1" title="Đóng"><XCircle className="w-5 h-5"/></button>
             </div>
             <div className="p-6 overflow-y-auto bg-slate-50">
               <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   <span className="block text-[12px] text-slate-500 mb-1">Người thực hiện</span>
                   <span className="block text-[14px] font-bold text-slate-800">{selectedVersion.author}</span>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   <span className="block text-[12px] text-slate-500 mb-1">Thời gian cập nhật</span>
                   <span className="block text-[14px] font-bold text-slate-800">{selectedVersion.date}</span>
                 </div>
               </div>

               <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
                 <h4 className="text-[15px] font-bold text-slate-800 border-b border-slate-100 pb-2">Nội dung thay đổi</h4>
                 <div className="space-y-3">
                   <div className="flex items-start gap-3">
                     <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 shrink-0"></div>
                     <div>
                       <span className="text-[14px] text-slate-700"><strong>Thêm mới:</strong> {selectedVersion.content}</span>
                     </div>
                   </div>
                   {selectedVersion.type === 'Cấu trúc' ? (
                     <div className="flex items-start gap-3">
                       <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></div>
                       <div>
                         <span className="text-[14px] text-slate-700"><strong>Cập nhật:</strong> Thay đổi kiểu dữ liệu bảng [hoso_congdan] từ INT sang VARCHAR.</span>
                       </div>
                     </div>
                   ) : (
                     <div className="flex items-start gap-3">
                       <div className="w-2 h-2 mt-1.5 rounded-full bg-purple-500 shrink-0"></div>
                       <div>
                         <span className="text-[14px] text-slate-700"><strong>Đồng bộ dữ liệu:</strong> 120 records mới đẩy thành công vào Master Data Hub qua luồng phê duyệt định kỳ.</span>
                       </div>
                     </div>
                   )}
                 </div>
               </div>
             </div>
             <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-white rounded-b-2xl justify-end">
               <button onClick={() => setSelectedVersion(null)} className="px-6 py-2 bg-slate-100/80 hover:bg-slate-200 text-slate-700 rounded-xl text-[14px] transition-colors">Đóng</button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}
