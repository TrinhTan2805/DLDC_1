import React, { useState } from 'react';
import { Clock, CheckSquare, XCircle, Eye, Ban, Check } from 'lucide-react';
import { ApprovalRequest, ApprovalType, ApprovalStatus, MasterDataEntity } from '../../categoryTypes';

interface ApprovalTabProps {
  entities: MasterDataEntity[];
  approvalTab: ApprovalType;
  setApprovalTab: (tab: ApprovalType) => void;
  requests: ApprovalRequest[];
  statusFilter: ApprovalStatus | 'all';
  setStatusFilter: (status: ApprovalStatus | 'all') => void;
  onViewDetail: (req: ApprovalRequest) => void;
  onApproveClick: (req: ApprovalRequest) => void;
  onRejectClick: (req: ApprovalRequest) => void;
  onApproveAll: (type: ApprovalType | 'all') => void;
  approvalTypeLabels: Record<ApprovalType, string>;
  approvalStatusLabels: Record<ApprovalStatus, { label: string; color: string }>;
}

export function ApprovalTab({
  entities,
  approvalTab,
  setApprovalTab,
  requests,
  statusFilter,
  setStatusFilter,
  onViewDetail,
  onApproveClick,
  onRejectClick,
  onApproveAll,
  approvalTypeLabels,
  approvalStatusLabels
}: ApprovalTabProps) {
  const [expandedHistory, setExpandedHistory] = useState<string[]>([]);

  const typeFilteredRequests = requests.filter(r => r.type === approvalTab);

  const pendingCount = typeFilteredRequests.filter(r => r.status === 'pending').length;
  const approvedCount = typeFilteredRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = typeFilteredRequests.filter(r => r.status === 'rejected').length;
  const partialCount = typeFilteredRequests.filter(r => r.status === 'partial').length;
  const totalCount = typeFilteredRequests.length;

  const filteredRequests = typeFilteredRequests.filter(req =>
    statusFilter === 'all' || req.status === statusFilter
  );

  const approvalTabs = [
    { key: 'category' as ApprovalType, label: 'Phê duyệt danh mục', icon: CheckSquare },
    { key: 'structure' as ApprovalType, label: 'Phê duyệt cấu trúc', icon: CheckSquare },
    { key: 'version' as ApprovalType, label: 'Phê duyệt phiên bản', icon: Clock },
    { key: 'expire' as ApprovalType, label: 'Phê duyệt hết hiệu lực', icon: Ban }
  ];

  const toggleHistory = (id: string) =>
    setExpandedHistory(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const tabList = [
    { key: 'all' as const, label: 'Tất cả', count: totalCount },
    { key: 'pending' as const, label: 'Chờ phê duyệt', count: pendingCount },
    { key: 'approved' as const, label: 'Đã phê duyệt', count: approvedCount },
    { key: 'partial' as const, label: 'Duyệt một phần', count: partialCount },
    { key: 'rejected' as const, label: 'Từ chối', count: rejectedCount },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h2 className="text-[17px] font-bold text-slate-800">{approvalTypeLabels[approvalTab] || 'Phê duyệt danh mục'}</h2>
        <p className="text-[13px] text-slate-500 mt-0.5">Lãnh đạo nghiệp vụ xem xét và phê duyệt các yêu cầu thay đổi dữ liệu chủ</p>
      </div>

      {/* Approval Types Sub-tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {approvalTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
 key={tab.key}
 onClick={() => {
 setApprovalTab(tab.key);
 setStatusFilter('all');
 }}
 className={`px-4 py-2 rounded-lg text-[13px] transition-all flex items-center gap-2 ${
 approvalTab === tab.key
 ? 'bg-white text-blue-600 shadow-sm'
 : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
 }`}
 >
 <Icon className="w-4 h-4" />
 {tab.label}
 </button>
          )
        })}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-[13px] text-orange-700 font-medium mb-0.5">Chờ phê duyệt</div>
            <div className="text-3xl font-black text-orange-600">{pendingCount}</div>
          </div>
          <Clock className="w-9 h-9 text-orange-400 stroke-2" />
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-[13px] text-green-700 font-medium mb-0.5">Đã phê duyệt</div>
            <div className="text-3xl font-black text-green-600">{approvedCount}</div>
          </div>
          <CheckSquare className="w-9 h-9 text-green-400 stroke-2" />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-[13px] text-red-700 font-medium mb-0.5">Từ chối</div>
            <div className="text-3xl font-black text-red-600">{rejectedCount}</div>
          </div>
          <XCircle className="w-9 h-9 text-red-400 stroke-2" />
        </div>
      </div>

      {/* Status Filter Tab Bar */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm flex-wrap">
        <span className="text-[13px] text-slate-600 font-semibold mr-1">Trang thái:</span>
        {tabList.map(tab => (
          <button
 key={tab.key}
 onClick={() => setStatusFilter(tab.key)}
 className={`px-3 py-1.5 rounded-lg text-[13px] transition-all ${statusFilter === tab.key
 ? 'bg-blue-600 text-white shadow-sm'
 : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
 }`}
 >
 {tab.label} ({tab.count})
 </button>
        ))}
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#f8fafc] border-b border-slate-200 p-4">
              <h3 className="font-bold text-slate-800 text-[14px]">Danh sách yêu cầu chờ duyệt</h3>
            </div>
            <div className="p-12 text-center text-slate-500 italic text-[14px]">
              Không có yêu cầu phê duyệt nào phù hợp.
            </div>
          </div>
        ) : (
          filteredRequests.map(req => {
            const entity = entities.find((e: any) => e.id === req.entityId);
            const isPending = req.status === 'pending';
            const historyOpen = expandedHistory.includes(req.id);

            return (
              <div key={req.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Card Body */}
                <div className="p-5 flex gap-5">
                  {/* Left Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title + Status Badge */}
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[15px] font-bold text-slate-800">{req.entityName}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${req.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                          req.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                          req.status === 'partial' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-red-50 text-red-600 border-red-200'
                        }`}>
                        {approvalStatusLabels[req.status].label}
                      </span>
                    </div>

                    {/* Code */}
                    <div className="text-[13px] font-bold text-amber-600 mb-3">
                      Mã: {req.entityCode}
                    </div>

                    {/* Info Grid 2 cols */}
                    <div className="grid grid-cols-2 gap-x-10 gap-y-1.5 mb-4 text-[13px]">
                      <div>
                        <span className="text-slate-500">Cơ quan quản lý: </span>
                        <span className="text-slate-800 font-semibold">
                          {entity?.managingAgency || 'Cục Hộ tịch - Quốc tịch - Chứng thực'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Loại dữ liệu: </span>
                        <span className="text-slate-800 font-semibold">Dữ liệu chuẩn</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Ngày gửi: </span>
                        <span className="text-slate-800 font-semibold">{req.requestedDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Người gửi: </span>
                        <span className="text-slate-800 font-semibold">{req.requestedBy}</span>
                      </div>
                    </div>

                    {/* Tags row */}
                    <div className="flex items-center gap-3 text-[12px] text-slate-600 flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block"></span>
                        15 thuộc tính
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block"></span>
                        3 quy tắc hợp nhất
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block"></span>
                        2 quan hệ
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <Check className="w-3 h-3" />
                        Có đính danh
                      </span>
                    </div>
                  </div>

                  {/* Right — vertical action buttons */}
                  <div className="flex flex-col gap-2 shrink-0 items-stretch min-w-[128px]">
                    <button
 onClick={() => onViewDetail(req)}
 className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 text-blue-600 rounded-lg text-[13px] hover:bg-blue-50 transition-colors"
 >
 <Eye className="w-3.5 h-3.5" />
 Xem chi tiết
 </button>
                    {req.status === 'pending' && (
                      <>
                        <button
 onClick={() => onApproveClick(req)}
 className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-[13px] hover:bg-green-700 transition-colors"
 >
 <Check className="w-3.5 h-3.5" />
 Phê duyệt
 </button>
                        <button
 onClick={() => onRejectClick(req)}
 className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg text-[13px] hover:bg-red-700 transition-colors"
 >
 <Ban className="w-3.5 h-3.5" />
 Từ chối
 </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Collapsible History */}
                <div className="border-t border-slate-100">
                  <button
                    onClick={() => toggleHistory(req.id)}
                    className="w-full flex items-center gap-2 px-5 py-2.5 text-[12px] text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Lịch sử cập nhật (1) {historyOpen ? '▲' : '▼'}
                  </button>
                  {historyOpen && (
                    <div className="px-5 pb-4 text-[13px] text-slate-600 bg-slate-50/50 border-t border-slate-100">
                      <div className="py-2 flex gap-3">
                        <span className="text-slate-400">{req.requestedDate}</span>
                        <span>—</span>
                        <span>{req.requestedBy} đã gửi yêu cầu phê duyệt</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
