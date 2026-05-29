import React, { useState, ChangeEvent } from 'react';
import { CheckCircle, XCircle, Send } from 'lucide-react';
import { ApprovalRequest, MasterDataAttribute } from '../../categoryTypes';
import { Portal } from '../../../../common/Portal';

interface ReviewApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: ApprovalRequest[];
  entities?: any[]; // MasterDataEntity[]
  attributes?: MasterDataAttribute[];
  onApprove: (ids: string[], note: string, partialStatuses?: Record<string, Record<string, 'approved' | 'rejected'>>) => void;
  onReject: (ids: string[], note: string) => void;
}

export function ReviewApprovalModal({ isOpen, onClose, requests, entities, attributes, onApprove, onReject }: ReviewApprovalModalProps) {
  const [note, setNote] = useState('');
  const [lineStatuses, setLineStatuses] = useState<Record<string, Record<string, 'approved' | 'rejected'>>>({});

  const handleLineAction = (reqId: string, attrId: string, status: 'approved' | 'rejected') => {
    setLineStatuses(prev => ({
      ...prev,
      [reqId]: {
        ...(prev[reqId] || {}),
        [attrId]: status
      }
    }));
  };

  if (!isOpen || !requests || requests.length === 0) return null;

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const hasPending = pendingRequests.length > 0;

  return (
    <Portal>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-slate-800">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
               <Send className="w-6 h-6"/>
            </div>
            <div>
              <h3 className="text-[20px] font-bold text-slate-800">Xử lý yêu cầu phê duyệt</h3>
              <p className="text-[14px] text-slate-500">Xem xét và phê duyệt nội dung thay đổi</p>
            </div>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 space-y-6">
          {requests.map(request => (
            <div key={request.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative group">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-2 flex-1">
                  <h4 className="text-[18px] font-bold text-blue-600 leading-tight">{request.entityName}</h4>
                  
                  <div className="text-[14px] text-slate-600">
                    <span className="inline-block w-32 font-normal">Người yêu cầu:</span>
                    <span className="text-slate-900">{request.requestedBy} ({request.requestedDate})</span>
                  </div>

                  {request.comments && (
                    <div className="text-[14px] text-slate-600 flex items-start">
                      <span className="inline-block w-32 shrink-0 font-normal">Ghi chú yêu cầu:</span>
                      <span className="italic text-slate-500">"{request.comments}"</span>
                    </div>
                  )}

                  <div className="text-[13px] text-slate-400 mt-2 flex items-center gap-2">
                    <span className="font-bold text-slate-500">Mã yêu cầu: REQ-{request.id.padStart(3, '0')}</span>
                    <span>•</span>
                    <span className="font-medium text-slate-500">
                      Loại: {request.type === 'category' ? 'Phê duyệt danh mục' : 
                             request.type === 'structure' ? 'Phê duyệt cấu trúc' : 
                             'Phê duyệt phiên bản'}
                    </span>
                  </div>
                </div>

                {request.status !== 'pending' ? (
                  <div className={`shrink-0 ml-4 px-4 py-2 rounded-xl text-[13px] font-bold uppercase ${
                    request.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-200' : 
                    request.status === 'partial' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    {request.status === 'approved' ? 'Đã phê duyệt' : 
                     request.status === 'partial' ? 'Duyệt một phần' : 'Đã từ chối'}
                  </div>
                ) : (
                  <div className="flex gap-2.5 shrink-0 ml-4">
                    <button 
 onClick={() => onReject([request.id], note)}
 className="px-5 py-2 bg-white border border-red-200 text-red-600 rounded-xl flex items-center justify-center gap-1.5 hover:bg-red-50 transition-all text-[14px]"
 >
 <XCircle className="w-5 h-5"/> Từ chối
 </button>
                    <button 
 onClick={() => onApprove([request.id], note, lineStatuses)}
 className="px-5 py-2 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-all text-[14px] shadow-lg shadow-blue-200"
 >
 <CheckCircle className="w-5 h-5"/> Phê duyệt
 </button>
                  </div>
                )}
              </div>

              {/* General Information Preview (Thông tin chung) */}
              {(() => {
                const entity = entities?.find(e => e.id === request.entityId);
                if (!entity) return null;
                return (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                     <p className="text-[14px] font-bold text-slate-800 mb-4">Thông tin chung:</p>
                     <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 grid grid-cols-2 gap-x-6 gap-y-4 text-[13px]">
                        <div>
                           <span className="text-slate-500 block mb-1">Phiên bản danh mục</span>
                           <span className="text-slate-800 font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded">v{entity.version || '1.0'}</span>
                        </div>
                        <div>
                           <span className="text-slate-500 block mb-1">Phạm vi vĩ mô</span>
                           <span className="text-slate-800 font-semibold">{entity.scope === 'national' ? 'Cấp quốc gia' : entity.scope === 'ministry' ? 'Cấp bộ' : entity.scope === 'provincial' ? 'Cấp tỉnh/thành' : 'Nội bộ'}</span>
                        </div>
                        <div>
                           <span className="text-slate-500 block mb-1">Loại dữ liệu</span>
                           <span className="text-slate-800 font-semibold">{entity.dataType === 'reference' ? 'Dữ liệu tham chiếu' : entity.dataType === 'standard' ? 'Dữ liệu chuẩn' : 'Dữ liệu giao dịch'}</span>
                        </div>
                        <div>
                           <span className="text-slate-500 block mb-1">Cơ quan quản lý</span>
                           <span className="text-slate-800 font-semibold">{entity.managingAgency}</span>
                        </div>
                        <div className="col-span-2">
                           <span className="text-slate-500 block mb-1">Mô tả mục đích & vai trò</span>
                           <span className="text-slate-800 font-medium">{entity.description}</span>
                        </div>
                     </div>
                  </div>
                );
              })()}

              {/* Data Structure Preview */}
              {(request.type === 'structure' || request.type === 'category') && attributes && attributes.length > 0 && (
                 <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-[14px] font-bold text-slate-800 mb-4">Cấu trúc dữ liệu định kèm ({attributes.length} trường):</p>
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                       <table className="w-full text-[14px] text-left">
                          <thead className="bg-[#f8fafc] text-slate-600 border-b border-slate-200">
                             <tr>
                                <th className="px-5 py-3.5 font-semibold">Trường dữ liệu</th>
                                <th className="px-5 py-3.5 font-semibold">Tên hiển thị</th>
                                <th className="px-5 py-3.5 font-semibold">Kiểu dữ liệu</th>
                                <th className="px-5 py-3.5 text-center font-semibold w-24">Bắt buộc</th>
                                <th className="px-5 py-3.5 text-center font-semibold w-32">Phê duyệt riêng</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                             {attributes.map(attr => {
                                const currentStatus = lineStatuses[request.id]?.[attr.id];
                                return (
                                <tr key={attr.id} className="hover:bg-slate-50/50 transition-colors">
                                   <td className="px-5 py-3.5 font-mono">{attr.fieldName}</td>
                                   <td className="px-5 py-3.5">{attr.displayName}</td>
                                   <td className="px-5 py-3.5 text-slate-600 font-normal">{attr.dataType}</td>
                                   <td className="px-5 py-3.5 text-center">
                                      {attr.required ? (
                                        <div className="flex justify-center">
                                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 fill-blue-600 text-white" />
                                          </div>
                                        </div>
                                      ) : <span className="text-slate-400 font-normal">—</span>}
                                   </td>
                                   <td className="px-5 py-3.5 text-center">
                                      {request.status === 'pending' ? (
                                        <div className="flex items-center justify-center gap-1.5">
                                          <button 
                                            onClick={() => handleLineAction(request.id, attr.id, 'approved')}
                                            className={`p-1.5 rounded disabled:opacity-50 transition-all ${currentStatus === 'approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-400' : 'text-slate-400 hover:bg-green-50 hover:text-green-600'}`}
                                            title="Đồng ý trường này"
                                          >
                                            <CheckCircle className="w-4 h-4" />
                                          </button>
                                          <button 
                                            onClick={() => handleLineAction(request.id, attr.id, 'rejected')}
                                            className={`p-1.5 rounded disabled:opacity-50 transition-all ${currentStatus === 'rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-400' : 'text-slate-400 hover:bg-red-50 hover:text-red-600'}`}
                                            title="Từ chối trường này"
                                          >
                                            <XCircle className="w-4 h-4" />
                                          </button>
                                        </div>
                                      ) : (
                                        <span className={`text-[12px] font-bold ${
                                          request.lineStatuses?.[attr.id] === 'rejected' ? 'text-red-500' : 'text-green-600'
                                        }`}>
                                          {request.lineStatuses?.[attr.id] === 'rejected' ? 'Bị từ chối' : 'Đã duyệt'}
                                        </span>
                                      )}
                                   </td>
                                </tr>
                                )
                             })}
                          </tbody>
                       </table>
                    </div>
                 </div>
              )}
              
              {/* Version Detail Preview */}
              {request.type === 'version' && (
                 <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-[14px] font-bold text-slate-800 mb-4">Thông tin thay đổi so với phiên bản trước:</p>
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                       <div className="text-[13px] text-orange-800 leading-relaxed">
                         <strong>Phiên bản hiện tại:</strong> v{request.changes?.prevVersion || 1} <br/>
                         <strong>Phiên bản đề xuất:</strong> v{request.changes?.currentVersion || 2} <br/>
                         - Thêm mới trường dữ liệu 'ngay_cap_cccd'.<br/>
                         - Đổi kiểu dữ liệu trường 'trang_thai' từ boolean sang string.
                       </div>
                    </div>
                    
                    <p className="text-[14px] font-bold text-slate-800 mb-4 mt-6">Đánh giá tác động đến các bảng tham chiếu:</p>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                       <div className="text-[13px] text-blue-800 leading-relaxed">
                         <strong>Xác định ảnh hưởng trong hệ thống:</strong> Tác động tới {request.changes?.impactCount || 3} bảng dữ liệu liên kết.<br/>
                         - Sẽ cần cập nhật đồng bộ các View và API tra cứu tương ứng.
                       </div>
                    </div>
                 </div>
              )}

              {/* Relationship Detail Preview */}
              {request.type === 'relationship' && (
                 <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-[14px] font-bold text-slate-800 mb-4">Chi tiết thiết lập mối quan hệ:</p>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                       <ul className="text-[13px] text-emerald-800 space-y-2">
                         <li><strong>Danh mục nguồn:</strong> {request.entityName}</li>
                         <li><strong>Danh mục đích:</strong> {request.changes?.targetEntity || 'N/A'}</li>
                         <li><strong>Loại quan hệ:</strong> {request.changes?.relationshipType || '1-n'}</li>
                         <li>
                           <strong>Cấu hình mapping:</strong> 
                           <span className="font-mono bg-emerald-100 px-1 py-0.5 rounded ml-1">{request.changes?.sourceKey || 'id'}</span> = 
                           <span className="font-mono bg-emerald-100 px-1 py-0.5 rounded ml-1">{request.changes?.targetKey || 'ref_id'}</span>
                         </li>
                       </ul>
                    </div>
                 </div>
              )}
            </div>
          ))}

          {hasPending && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-4">
              <label className="block text-[15px] font-bold text-slate-800 mb-2.5 tracking-tight">Nội dung phản hồi (Tùy chọn)</label>
              <textarea 
                rows={4}
                value={note}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
                placeholder="Nhập lý do cho tất cả các yêu cầu đang chờ..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>
          )}
        </div>
        
        {/* Footer Area */}
        <div className="px-8 py-5 bg-white border-t border-slate-100 flex gap-4 justify-end flex-shrink-0">
          <button 
 onClick={onClose} 
 className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all text-[15px]"
 >
            Đóng
          </button>
          
          {hasPending && (
            <>
              <button 
 onClick={() => onReject(pendingRequests.map(r => r.id), note)}
 className="px-8 py-3 bg-white border border-red-200 text-red-600 rounded-xl flex items-center justify-center gap-2.5 hover:bg-red-50 transition-all text-[15px]"
 >
 <XCircle className="w-5 h-5"/> Từ chối tất cả
 </button>
              <button 
 onClick={() => onApprove(pendingRequests.map(r => r.id), note, lineStatuses)}
 className="px-8 py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2.5 hover:bg-blue-700 transition-all text-[15px] shadow-xl shadow-blue-300"
 >
 <CheckCircle className="w-5 h-5"/> Phê duyệt tất cả
 </button>
             </>
          )}
        </div>
      </div>
      </div>
    </Portal>
  );
}
