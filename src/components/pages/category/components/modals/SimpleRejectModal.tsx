import { ChangeEvent, useState } from 'react';
import { XCircle, AlertCircle } from 'lucide-react';
import { MasterDataEntity } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { BTN_DESTRUCTIVE, BTN_OUTLINE, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../../../collection/collectionUi';

const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';

interface SimpleRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
  submissionContent?: string;
  onConfirm: (reason: string) => void;
}

export function SimpleRejectModal({
  isOpen,
  onClose,
  entity,
  submissionContent,
  onConfirm
}: SimpleRejectModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen || !entity) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError(true);
      return;
    }
    onConfirm(reason);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Từ chối phê duyệt danh mục"
      maxWidth="max-w-lg"
      footer={
        <>
          <button onClick={onClose} className={BTN_OUTLINE}>
            Hủy
          </button>
          <button onClick={handleConfirm} className={BTN_DESTRUCTIVE}>
            <XCircle className="w-4 h-4" />
            Từ chối
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Thông tin danh mục */}
        <div className="rounded-2xl border border-[#E2E8F0] p-4">
          <div className={SECTION_TITLE}>Thông tin danh mục</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <div className={FIELD_LABEL}>Tên danh mục</div>
              <div className={`${FIELD_VALUE} mt-1`}>{entity.name}</div>
            </div>
            <div>
              <div className={FIELD_LABEL}>Đơn vị chủ quản</div>
              <div className={`${FIELD_VALUE} mt-1`}>{entity.managingAgency}</div>
            </div>
          </div>
        </div>

        {/* Nội dung trình duyệt */}
        <div>
          <div className={LABEL_CLS}>Nội dung trình duyệt</div>
          <div className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] min-h-10 whitespace-pre-wrap">
            {submissionContent ?? <span className="text-[#94A3B8]">Chưa cập nhật</span>}
          </div>
        </div>

        {/* Input field */}
        <div>
          <label className={LABEL_CLS}>
            Lý do từ chối <span className={REQUIRED_MARK}>*</span>
          </label>
          <textarea
            rows={4}
            value={reason}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setReason(e.target.value);
              if (e.target.value.trim()) setError(false);
            }}
            placeholder="Nhập lý do từ chối phê duyệt... Ví dụ: Danh mục chưa đầy đủ thông tin về cấu trúc dữ liệu. Đề nghị bổ sung các trường dữ liệu bắt buộc theo quy định."
            className={`${TEXTAREA_CLS} ${error ? '!border-[#DC2626]' : ''}`}
          />
          {error && (
            <div className="mt-1 text-[12px] text-[#DC2626] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Vui lòng nhập lý do từ chối
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
