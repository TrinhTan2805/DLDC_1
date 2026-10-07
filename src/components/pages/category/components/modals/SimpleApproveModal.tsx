import { ChangeEvent, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { MasterDataEntity } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { BTN_PRIMARY, BTN_OUTLINE, LABEL_CLS, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../../../collection/collectionUi';

const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';

interface SimpleApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
  submissionContent?: string;
  onConfirm: (note: string) => void;
}

export function SimpleApproveModal({
  isOpen,
  onClose,
  entity,
  submissionContent,
  onConfirm
}: SimpleApproveModalProps) {
  const [note, setNote] = useState('');

  if (!isOpen || !entity) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Phê duyệt danh mục"
      maxWidth="max-w-lg"
      footer={
        <>
          <button onClick={onClose} className={BTN_OUTLINE}>
            Hủy
          </button>
          <button onClick={() => onConfirm(note)} className={BTN_PRIMARY}>
            <CheckCircle2 className="w-4 h-4" />
            Phê duyệt
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
          <label className={LABEL_CLS}>Ý kiến phê duyệt</label>
          <textarea
            rows={4}
            value={note}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
            placeholder="Nhập ý kiến phê duyệt (nếu có)... Ví dụ: Đồng ý phê duyệt danh mục dữ liệu mở theo đề xuất của đơn vị."
            className={TEXTAREA_CLS}
          />
        </div>
      </div>
    </BaseModal>
  );
}
