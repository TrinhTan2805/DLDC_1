import { useState, ChangeEvent } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { ApprovalRequest, MasterDataAttribute } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { Badge, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_FOCUS, LABEL_CLS, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE, GROUP_TITLE } from '../../../collection/collectionUi';

const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';
const TH_CLS = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD_CLS = 'px-3 py-1 text-[13px] text-black';
const LINE_BTN = `w-8 h-8 inline-flex items-center justify-center rounded-lg transition-colors ${BTN_FOCUS}`;

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
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Xử lý yêu cầu phê duyệt"
      subtitle="Xem xét và phê duyệt nội dung thay đổi"
      footer={
        <>
          <button onClick={onClose} className={BTN_OUTLINE}>
            Đóng
          </button>
          {hasPending && (
            <>
              <button
                onClick={() => onReject(pendingRequests.map(r => r.id), note)}
                className={BTN_DESTRUCTIVE}
              >
                <XCircle className="w-4 h-4" /> Từ chối tất cả
              </button>
              <button
                onClick={() => onApprove(pendingRequests.map(r => r.id), note, lineStatuses)}
                className={BTN_PRIMARY}
              >
                <CheckCircle className="w-4 h-4" /> Phê duyệt tất cả
              </button>
            </>
          )}
        </>
      }
    >
      <div className="space-y-4">
        {requests.map(request => (
          <div key={request.id} className="bg-white rounded-2xl p-4 border border-[#E2E8F0]">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h4 className={`${GROUP_TITLE} mb-4`}>{request.entityName}</h4>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <div className={FIELD_LABEL}>Người yêu cầu</div>
                    <div className={`${FIELD_VALUE} mt-1`}>{request.requestedBy} ({request.requestedDate})</div>
                  </div>
                  <div>
                    <div className={FIELD_LABEL}>Mã yêu cầu</div>
                    <div className={`${FIELD_VALUE} mt-1`}>REQ-{request.id.padStart(3, '0')}</div>
                  </div>
                  <div>
                    <div className={FIELD_LABEL}>Loại</div>
                    <div className={`${FIELD_VALUE} mt-1`}>
                      {request.type === 'category' ? 'Phê duyệt danh mục' :
                       request.type === 'structure' ? 'Phê duyệt cấu trúc' :
                       'Phê duyệt phiên bản'}
                    </div>
                  </div>
                  {request.comments && (
                    <div className="col-span-2">
                      <div className={FIELD_LABEL}>Ghi chú yêu cầu</div>
                      <div className={`${FIELD_VALUE} mt-1`}>"{request.comments}"</div>
                    </div>
                  )}
                </div>
              </div>

              {request.status !== 'pending' ? (
                <div className="shrink-0">
                  {(request.status === 'approved' || request.status === 'partial')
                    ? <Badge label="Đã phê duyệt" variant="green" />
                    : <Badge label="Đã từ chối" variant="red" />}
                </div>
              ) : (
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => onReject([request.id], note)} className={BTN_OUTLINE}>
                    <XCircle className="w-4 h-4 text-[#DC2626]" /> Từ chối
                  </button>
                  <button onClick={() => onApprove([request.id], note, lineStatuses)} className={BTN_OUTLINE}>
                    <CheckCircle className="w-4 h-4 text-[#16A34A]" /> Phê duyệt
                  </button>
                </div>
              )}
            </div>

            {/* General Information Preview */}
            {(() => {
              const entity = entities?.find(e => e.id === request.entityId);
              if (!entity) return null;
              return (
                <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                  <p className={SECTION_TITLE}>Thông tin chung:</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <div className={FIELD_LABEL}>Phiên bản danh mục</div>
                      <div className="mt-1"><Badge label={`v${entity.version || '1.0'}`} variant="slate" /></div>
                    </div>
                    <div>
                      <div className={FIELD_LABEL}>Phạm vi vĩ mô</div>
                      <div className={`${FIELD_VALUE} mt-1`}>{entity.scope === 'national' ? 'Cấp quốc gia' : entity.scope === 'ministry' ? 'Cấp bộ' : entity.scope === 'provincial' ? 'Cấp tỉnh/thành' : 'Nội bộ'}</div>
                    </div>
                    <div>
                      <div className={FIELD_LABEL}>Loại dữ liệu</div>
                      <div className={`${FIELD_VALUE} mt-1`}>{entity.dataType === 'reference' ? 'Dữ liệu tham chiếu' : entity.dataType === 'standard' ? 'Dữ liệu chuẩn' : 'Dữ liệu giao dịch'}</div>
                    </div>
                    <div>
                      <div className={FIELD_LABEL}>Cơ quan quản lý</div>
                      <div className={`${FIELD_VALUE} mt-1`}>{entity.managingAgency || '-'}</div>
                    </div>
                    <div className="col-span-2">
                      <div className={FIELD_LABEL}>Mô tả mục đích & vai trò</div>
                      <div className={`${FIELD_VALUE} mt-1 whitespace-pre-wrap`}>{entity.description || '-'}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Data Structure Preview */}
            {(request.type === 'structure' || request.type === 'category') && attributes && attributes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                <p className={SECTION_TITLE}>Cấu trúc dữ liệu định kèm ({attributes.length} trường):</p>
                <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                  <table className="w-full border-collapse collection-table text-[13px] text-left">
                    <thead className="bg-[#F8FAFC]">
                      <tr className="h-[42px]">
                        <th className={TH_CLS}>Trường dữ liệu</th>
                        <th className={TH_CLS}>Tên hiển thị</th>
                        <th className={TH_CLS}>Kiểu dữ liệu</th>
                        <th className={`${TH_CLS} text-center w-24`}>Bắt buộc</th>
                        <th className={`${TH_CLS} text-center w-32`}>Phê duyệt riêng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attributes.map(attr => {
                        const currentStatus = lineStatuses[request.id]?.[attr.id];
                        return (
                          <tr key={attr.id} className="h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                            <td className={TD_CLS}>{attr.fieldName}</td>
                            <td className={TD_CLS}>{attr.displayName}</td>
                            <td className={TD_CLS}>{attr.dataType}</td>
                            <td className={`${TD_CLS} text-center`}>
                              {attr.required ? (
                                <div className="flex justify-center">
                                  <CheckCircle className="w-4 h-4 text-[#155DFC]" />
                                </div>
                              ) : <span className="text-[#94A3B8]">—</span>}
                            </td>
                            <td className={`${TD_CLS} text-center`}>
                              {request.status === 'pending' ? (
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleLineAction(request.id, attr.id, 'approved')}
                                    className={`${LINE_BTN} ${currentStatus === 'approved' ? 'bg-[#F0FDF4] text-[#16A34A] ring-1 ring-[#16A34A]' : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#16A34A]'}`}
                                    title="Đồng ý trường này"
                                    aria-label="Đồng ý trường này"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleLineAction(request.id, attr.id, 'rejected')}
                                    className={`${LINE_BTN} ${currentStatus === 'rejected' ? 'bg-[#FEF2F2] text-[#DC2626] ring-1 ring-[#DC2626]' : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#DC2626]'}`}
                                    title="Từ chối trường này"
                                    aria-label="Từ chối trường này"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                request.lineStatuses?.[attr.id] === 'rejected'
                                  ? <Badge label="Bị từ chối" variant="red" />
                                  : <Badge label="Đã duyệt" variant="green" />
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
              <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                <p className={SECTION_TITLE}>Thông tin thay đổi so với phiên bản trước:</p>
                <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-lg p-3 mb-4">
                  <div className="text-[13px] text-[#020817] leading-relaxed">
                    <strong className="font-medium">Phiên bản hiện tại:</strong> v{request.changes?.prevVersion || 1} <br/>
                    <strong className="font-medium">Phiên bản đề xuất:</strong> v{request.changes?.currentVersion || 2} <br/>
                    - Thêm mới trường dữ liệu 'ngay_cap_cccd'.<br/>
                    - Đổi kiểu dữ liệu trường 'trang_thai' từ boolean sang string.
                  </div>
                </div>

                <p className={SECTION_TITLE}>Đánh giá tác động đến các bảng tham chiếu:</p>
                <div className="bg-[#EAF3FF] border border-[#BFDBFE] rounded-lg p-3">
                  <div className="text-[13px] text-[#020817] leading-relaxed">
                    <strong className="font-medium">Xác định ảnh hưởng trong hệ thống:</strong> Tác động tới {request.changes?.impactCount || 3} bảng dữ liệu liên kết.<br/>
                    - Sẽ cần cập nhật đồng bộ các View và API tra cứu tương ứng.
                  </div>
                </div>
              </div>
            )}

            {/* Relationship Detail Preview */}
            {request.type === 'relationship' && (
              <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                <p className={SECTION_TITLE}>Chi tiết thiết lập mối quan hệ:</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <div className={FIELD_LABEL}>Danh mục nguồn</div>
                    <div className={`${FIELD_VALUE} mt-1`}>{request.entityName}</div>
                  </div>
                  <div>
                    <div className={FIELD_LABEL}>Danh mục đích</div>
                    <div className={`${FIELD_VALUE} mt-1`}>{request.changes?.targetEntity || 'N/A'}</div>
                  </div>
                  <div>
                    <div className={FIELD_LABEL}>Loại quan hệ</div>
                    <div className={`${FIELD_VALUE} mt-1`}>{request.changes?.relationshipType || '1-n'}</div>
                  </div>
                  <div>
                    <div className={FIELD_LABEL}>Cấu hình mapping</div>
                    <div className={`${FIELD_VALUE} mt-1`}>
                      {request.changes?.sourceKey || 'id'} = {request.changes?.targetKey || 'ref_id'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {hasPending && (
          <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0]">
            <label className={LABEL_CLS}>Nội dung phản hồi (Tùy chọn)</label>
            <textarea
              rows={4}
              value={note}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
              placeholder="Nhập lý do cho tất cả các yêu cầu đang chờ..."
              className={TEXTAREA_CLS}
            />
          </div>
        )}
      </div>
    </BaseModal>
  );
}
