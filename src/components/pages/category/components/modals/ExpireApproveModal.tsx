import { useState, useEffect, ChangeEvent } from 'react';
import { CheckCircle2, XCircle, Loader2, Database, Check, FileText } from 'lucide-react';
import { MasterDataEntity } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, LABEL_CLS, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE, isoToDisplayDate } from '../../../collection/collectionUi';

const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';

const REASON_LABELS: Record<string, string> = {
  'Tích hợp vào danh mục khác': 'Tích hợp vào danh mục khác',
  'Quy định pháp luật thay đổi': 'Pháp luật, Quyết định bổ sung thay đổi',
  'Dữ liệu lỗi, cấu trúc cũ': 'Cấu trúc dữ liệu cũ, không còn phù hợp',
  'Khác': 'Lý do khác',
};

interface ExpireApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
  request?: any;
  onApprove: (reason: string) => void;
  onReject: (reason: string) => void;
}

export function ExpireApproveModal({
  isOpen,
  onClose,
  entity,
  request,
  onApprove,
  onReject
}: ExpireApproveModalProps) {
  const [checking, setChecking] = useState(true);
  const [checkResult, setCheckResult] = useState<'safe' | 'has_constraints' | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setChecking(true);
      setCheckResult(null);
      setNote('');
      const timer = setTimeout(() => {
        setChecking(false);
        setCheckResult(Math.random() > 0.2 ? 'safe' : 'has_constraints');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, entity]);

  if (!isOpen || !entity) return null;

  const changes = request?.changes;
  const expireDate = changes?.expireDate
    ? (isoToDisplayDate(changes.expireDate) || changes.expireDate)
    : '-';
  const reason = changes?.reason ? (REASON_LABELS[changes.reason] || changes.reason) : '-';
  const approver = changes?.approver || '-';
  const reqNote = changes?.note || '';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Phê duyệt hết hiệu lực"
      maxWidth="max-w-lg"
      footer={
        <>
          <button onClick={onClose} className={BTN_OUTLINE}>
            Đóng
          </button>
          <button
            disabled={checking}
            onClick={() => onReject(note)}
            className={BTN_DESTRUCTIVE}
          >
            <XCircle className="w-4 h-4" /> Từ chối
          </button>
          <button
            disabled={checking || checkResult === 'has_constraints'}
            onClick={() => onApprove(note)}
            className={BTN_PRIMARY}
            title={checkResult === 'has_constraints' ? 'Không thể phê duyệt do vướng ràng buộc khóa ngoại' : 'Phê duyệt hết hiệu lực'}
          >
            <Check className="w-4 h-4" /> Phê duyệt
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Request Info */}
        <div className="rounded-2xl border border-[#E2E8F0] p-4">
          <div className={SECTION_TITLE}>
            <FileText className="w-4 h-4 text-[#475569]" /> Thông tin yêu cầu
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="col-span-2">
              <div className={FIELD_LABEL}>Danh mục áp dụng</div>
              <div className={`${FIELD_VALUE} mt-1`}>{entity.name}</div>
            </div>
            <div>
              <div className={FIELD_LABEL}>Thời điểm hết hiệu lực</div>
              <div className={`${FIELD_VALUE} mt-1`}>{expireDate}</div>
            </div>
            <div>
              <div className={FIELD_LABEL}>Lãnh đạo phê duyệt</div>
              <div className={`${FIELD_VALUE} mt-1`}>{approver}</div>
            </div>
            <div className="col-span-2">
              <div className={FIELD_LABEL}>Lý do ngừng sử dụng</div>
              <div className={`${FIELD_VALUE} mt-1`}>{reason}</div>
            </div>
            {reqNote && (
              <div className="col-span-2">
                <div className={FIELD_LABEL}>Ghi chú</div>
                <div className={`${FIELD_VALUE} mt-1 whitespace-pre-wrap`}>{reqNote}</div>
              </div>
            )}
            {request?.requestedBy && (
              <div className="col-span-2">
                <div className={FIELD_LABEL}>Người gửi yêu cầu</div>
                <div className={`${FIELD_VALUE} mt-1`}>{request.requestedBy} — {request.requestedDate}</div>
              </div>
            )}
          </div>
        </div>

        {/* FK Check */}
        <div className="rounded-2xl border border-[#E2E8F0] p-4">
          <div className={SECTION_TITLE}>
            <Database className="w-4 h-4 text-[#475569]" /> Kiểm tra ràng buộc dữ liệu
          </div>
          <div className="flex flex-col items-center justify-center min-h-[100px] text-center">
            {checking ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-[#155DFC] animate-spin" />
                <div className="text-[13px] text-[#64748B] animate-pulse">
                  Đang truy vấn kiểm tra khóa ngoại (Foreign Key) trên các hệ thống tham chiếu...
                </div>
              </div>
            ) : checkResult === 'safe' ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
                </div>
                <p className="text-[13px] font-medium text-[#15803D]">Đủ điều kiện ngừng sử dụng</p>
                <p className="text-[13px] text-[#64748B]">Không phát hiện dữ liệu nào đang tham chiếu trực tiếp đến danh mục này.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-[#DC2626]" />
                </div>
                <p className="text-[13px] font-medium text-[#B91C1C]">Cảnh báo ràng buộc toàn vẹn</p>
                <p className="text-[13px] text-[#64748B]">Phát hiện 124 bản ghi từ hệ thống CSDL Cán bộ đang tham chiếu. Yêu cầu xem xét kỹ trước khi duyệt.</p>
              </div>
            )}
          </div>
        </div>

        {/* Review Note */}
        {!checking && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className={LABEL_CLS}>Ý kiến phản hồi / Lý do (nếu từ chối)</label>
            <textarea
              title="Ghi chú thêm"
              rows={3}
              value={note}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
              placeholder="Nhập ghi chú hoặc lý do thay đổi..."
              className={TEXTAREA_CLS}
            />
          </div>
        )}
      </div>
    </BaseModal>
  );
}
