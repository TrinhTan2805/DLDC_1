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



  const tabList = [
    { key: 'all' as const, label: 'Tất cả', count: totalCount },
    { key: 'pending' as const, label: 'Chờ phê duyệt', count: pendingCount },
    { key: 'approved' as const, label: 'Đã phê duyệt', count: approvedCount },
    { key: 'rejected' as const, label: 'Từ chối', count: rejectedCount },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h2 className="text-[18px] font-bold text-slate-800">{approvalTypeLabels[approvalTab] || 'Phê duyệt danh mục'}</h2>
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
            <div className="text-[16px] text-orange-700 font-medium mb-0.5">Chờ phê duyệt</div>
            <div className="text-[16px] font-black text-orange-600">{pendingCount}</div>
          </div>
          <Clock className="w-9 h-9 text-orange-400 stroke-2" />
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-[16px] text-green-700 font-medium mb-0.5">Đã phê duyệt</div>
            <div className="text-[16px] font-black text-green-600">{approvedCount}</div>
          </div>
          <CheckSquare className="w-9 h-9 text-green-400 stroke-2" />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-[16px] text-red-700 font-medium mb-0.5">Từ chối</div>
            <div className="text-[16px] font-black text-red-600">{rejectedCount}</div>
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
            const dataSourceLabel: Record<string, string> = {
              manual: 'Tự cập nhật trực tiếp',
              dldc: 'Đồng bộ Kho DLDC',
              lgsp: 'Kết nối API (NDXP/LGSP)',
              ndxp: 'Kết nối API (NDXP/LGSP)',
            };

            return (
              <div key={req.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Card Body */}
                <div className="p-5 flex gap-5">
                  {/* Left Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title + Status Badge */}
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[15px] font-bold text-slate-800">{req.entityName}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[13px] border ${req.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                          (req.status === 'approved' || req.status === 'partial') ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-red-50 text-red-600 border-red-200'
                        }`}>
                        {(req.status === 'approved' || req.status === 'partial') ? 'Đã phê duyệt' : approvalStatusLabels[req.status].label}
                      </span>
                    </div>

                    {/* Info Grid 2 cols — chỉ hiện ở tab category */}
                    {approvalTab !== 'structure' && (
                      <div className="grid grid-cols-2 gap-x-10 gap-y-1.5 mb-4 text-[13px] mt-1">
                        <div>
                          <span className="text-slate-500">Đơn vị chủ quản: </span>
                          <span className="text-slate-800 font-semibold">
                            {entity?.managingAgency || 'Cục Hộ tịch - Quốc tịch - Chứng thực'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Nguồn dữ liệu: </span>
                          <span className="text-slate-800 font-semibold">
                            {entity?.dataSource ? dataSourceLabel[entity.dataSource] : 'Tự cập nhật trực tiếp'}
                          </span>
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
                    )}

                    {/* Tags row — chỉ hiện ở tab structure */}
                    {approvalTab === 'structure' && (
                      <div className="flex items-center gap-3 text-[13px] text-slate-600 flex-wrap mt-1">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block"></span>
                          3 trường dữ liệu
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block"></span>
                          2 quan hệ
                        </span>
                      </div>
                    )}
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

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
