import { ChangeEvent, useState } from 'react';
import { Send, Info } from 'lucide-react';
import { approvers } from '../../categoryConstants';
import { BaseModal } from '../../../../common/BaseModal';
import { BTN_PRIMARY, BTN_OUTLINE, INPUT_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, DateInput } from '../../../collection/collectionUi';

const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';

interface ExpireRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: {
    id: string;
    code: string;
    name: string;
  } | null;
  onSubmit: (data: { expireDate: string; reason: string; note: string; approver: string }) => void;
}

export function ExpireRequestModal({
  isOpen,
  onClose,
  entity,
  onSubmit
}: ExpireRequestModalProps) {
  const [formData, setFormData] = useState({
    expireDate: '',
    reason: '',
    note: '',
    approver: ''
  });

  if (!isOpen || !entity) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Gửi yêu cầu hết hiệu lực danh mục"
      maxWidth="max-w-lg"
      footer={
        <>
          <button onClick={onClose} className={BTN_OUTLINE}>
            Hủy
          </button>
          <button
            onClick={() => onSubmit(formData)}
            disabled={!formData.expireDate || !formData.reason || !formData.approver}
            className={BTN_PRIMARY}
          >
            <Send className="w-4 h-4" />
            Trình duyệt hết hiệu lực
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-[#EAF3FF] border border-[#BFDBFE] rounded-lg p-3 flex gap-3 text-[13px] text-[#020817]">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#155DFC]" />
          <p>
            Danh mục bị ngừng sử dụng sẽ <strong className="font-medium">không được dùng</strong> trong các quan hệ và truy vấn dữ liệu tham chiếu mới, nhưng vẫn được lưu trữ cho mục đích thống kê, tra cứu.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E2E8F0] p-4 grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <div className={FIELD_LABEL}>Danh mục áp dụng</div>
              <div className={`${FIELD_VALUE} mt-1`}>{entity.name}</div>
            </div>
            <div>
              <div className={FIELD_LABEL}>Mã</div>
              <div className={`${FIELD_VALUE} mt-1`}>{entity.code}</div>
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>
              Thời điểm hết hiệu lực <span className={REQUIRED_MARK}>*</span>
            </label>
            <DateInput
              ariaLabel="Thời điểm hết hiệu lực"
              value={formData.expireDate}
              onChange={(v) => setFormData({ ...formData, expireDate: v })}
            />
          </div>

          <div>
            <label className={LABEL_CLS}>
              Lý do ngừng sử dụng <span className={REQUIRED_MARK}>*</span>
            </label>
            <select
              title="Lý do ngừng sử dụng"
              value={formData.reason}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, reason: e.target.value })}
              className={INPUT_CLS}
            >
              <option value="">-- Chọn lý do --</option>
              <option value="Tích hợp vào danh mục khác">Tích hợp vào danh mục khác</option>
              <option value="Quy định pháp luật thay đổi">Pháp luật, Quyết định bổ sung thay đổi</option>
              <option value="Dữ liệu lỗi, cấu trúc cũ">Cấu trúc dữ liệu cũ, không còn phù hợp</option>
              <option value="Khác">Lý do khác...</option>
            </select>
          </div>

          <div>
            <label className={LABEL_CLS}>
              Lãnh đạo phê duyệt <span className={REQUIRED_MARK}>*</span>
            </label>
            <select
              title="Lãnh đạo phê duyệt"
              value={formData.approver}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, approver: e.target.value })}
              className={INPUT_CLS}
            >
              <option value="">-- Chọn lãnh đạo trình duyệt --</option>
              {approvers.map(a => (
                <option key={a.id} value={a.id}>{a.name} - {a.position} ({a.department})</option>
              ))}
            </select>
          </div>

          <div>
            <label className={LABEL_CLS}>Ghi chú thêm</label>
            <textarea
              title="Ghi chú thêm"
              rows={3}
              value={formData.note}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Nhập ghi chú chi tiết trình lãnh đạo..."
              className={TEXTAREA_CLS}
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
