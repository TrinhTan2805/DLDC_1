import { ChangeEvent, useState, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { BaseModal } from '../../../../common/BaseModal';
import { BTN_PRIMARY, BTN_OUTLINE, INPUT_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, DateInput } from '../../../collection/collectionUi';

const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';
const ERROR_BORDER = '!border-[#DC2626]';
const ERROR_TEXT = 'mt-1 text-[12px] text-[#DC2626]';
const INFO_BANNER = 'bg-[#EAF3FF] border border-[#BFDBFE] rounded-lg p-3 flex gap-3';

interface ApprovalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  approvers: any[];
  form: any;
  setForm: (form: any) => void;
  onSubmit: () => void;
}

const CategoryInfoGrid = ({ data }: { data: any }) => (
  <div className="rounded-2xl border border-[#E2E8F0] p-4 grid grid-cols-2 gap-x-6 gap-y-4">
    <div>
      <div className={FIELD_LABEL}>Danh mục</div>
      <div className={`${FIELD_VALUE} mt-1`}>{data?.name || 'Danh mục dữ liệu B'}</div>
    </div>
    <div>
      <div className={FIELD_LABEL}>Mã</div>
      <div className={`${FIELD_VALUE} mt-1`}>{data?.code || 'ODC002'}</div>
    </div>
  </div>
);

export function CategoryApprovalModal({
  isOpen,
  onClose,
  data,
  approvers,
  form,
  setForm,
  onSubmit
}: ApprovalRequestModalProps) {
  const [errors, setErrors] = useState<{
    reviewer?: string;
    changeDescription?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleValidationAndSubmit = () => {
    const newErrors: typeof errors = {};
    if (!form.reviewer) newErrors.reviewer = 'Vui lòng chọn người phê duyệt';
    if (!form.changeDescription?.trim()) newErrors.changeDescription = 'Vui lòng nhập nội dung trình duyệt';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onSubmit();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Trình duyệt danh mục"
      maxWidth="max-w-2xl"
      footer={
        <>
          <button onClick={onClose} className={BTN_OUTLINE}>
            Hủy
          </button>
          <button onClick={handleValidationAndSubmit} className={BTN_PRIMARY}>
            <Send className="w-4 h-4" />
            Gửi trình duyệt
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Info */}
        <CategoryInfoGrid data={data} />

        {/* Advisory Banner */}
        <div className={INFO_BANNER}>
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#155DFC]" />
          <div className="text-[13px] leading-relaxed text-left text-[#020817]">
            <p className="font-medium">Lưu ý quan trọng:</p>
            <p className="mt-1">
              Hệ thống sẽ gửi yêu cầu phê duyệt danh mục với trạng thái <strong className="font-medium">Chờ phê duyệt</strong>.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Reviewer */}
          <div>
            <label className={LABEL_CLS}>
              Người phê duyệt <span className={REQUIRED_MARK}>*</span>
            </label>
            <select
              title="Người phê duyệt"
              value={form.reviewer || ''}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, reviewer: e.target.value })}
              className={`${INPUT_CLS} ${errors.reviewer ? ERROR_BORDER : ''}`}
            >
              <option value="" disabled hidden>-- Chọn người phê duyệt --</option>
              {approvers.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} - {a.position} {a.department ? `(${a.department})` : ''}
                </option>
              ))}
            </select>
            {errors.reviewer && <p className={ERROR_TEXT}>{errors.reviewer}</p>}
          </div>

          {/* Change Description */}
          <div>
            <label className={LABEL_CLS}>
              Nội dung trình duyệt <span className={REQUIRED_MARK}>*</span>
            </label>
            <textarea
              rows={4}
              value={form.changeDescription || ''}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, changeDescription: e.target.value })}
              placeholder="Nhập nội dung trình duyệt danh mục..."
              className={`${TEXTAREA_CLS} ${errors.changeDescription ? ERROR_BORDER : ''}`}
            />
            {errors.changeDescription && <p className={ERROR_TEXT}>{errors.changeDescription}</p>}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

export function VersionApprovalModal({
  isOpen,
  onClose,
  data,
  approvers,
  form,
  setForm,
  onSubmit
}: ApprovalRequestModalProps) {
  const [errors, setErrors] = useState<{
    reviewer?: string;
    effectiveDate?: string;
    changeDescription?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setForm({ ...form, versionName: `v${(data?.currentVersion || 1) + 1}.0` });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleValidationAndSubmit = () => {
    const newErrors: typeof errors = {};
    if (!form.reviewer) newErrors.reviewer = 'Vui lòng chọn người phê duyệt';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onSubmit();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Trình duyệt phiên bản"
      maxWidth="max-w-2xl"
      footer={
        <>
          <button onClick={onClose} className={BTN_OUTLINE}>
            Hủy
          </button>
          <button onClick={handleValidationAndSubmit} className={BTN_PRIMARY}>
            <Send className="w-4 h-4" />
            Gửi trình duyệt
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Info */}
        <CategoryInfoGrid data={data} />

        {/* Advisory Banner */}
        <div className={INFO_BANNER}>
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#155DFC]" />
          <div className="text-[13px] leading-relaxed text-left text-[#020817]">
            <p className="font-medium">Lưu ý quan trọng:</p>
            <p className="mt-1">
              Hệ thống sẽ tạo một bản sao phiên bản mới cho danh mục với trạng thái <strong className="font-medium">Chờ phê duyệt</strong>.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Version Name and Effective Date Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Version Name */}
            <div>
              <label className={LABEL_CLS}>Tên phiên bản</label>
              <div className="w-full h-10 px-3 flex items-center border border-[#E2E8F0] rounded-lg text-[13px] bg-[#F8FAFC] text-[#020817]">
                {form.versionName || `v${(data?.currentVersion || 1) + 1}.0`}
              </div>
            </div>

            {/* Effective Date */}
            <div>
              <label className={LABEL_CLS}>Hiệu lực</label>
              <DateInput
                ariaLabel="Hiệu lực"
                value={form.effectiveDate || ''}
                onChange={(v) => setForm({ ...form, effectiveDate: v })}
                className={errors.effectiveDate ? '!border-[#DC2626]' : ''}
              />
              {errors.effectiveDate && <p className={ERROR_TEXT}>{errors.effectiveDate}</p>}
            </div>
          </div>

          {/* Approver Select */}
          <div>
            <label className={LABEL_CLS}>
              Người phê duyệt <span className={REQUIRED_MARK}>*</span>
            </label>
            <select
              title="Người phê duyệt"
              value={form.reviewer || ''}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, reviewer: e.target.value })}
              className={`${INPUT_CLS} ${errors.reviewer ? ERROR_BORDER : ''}`}
            >
              <option value="" disabled hidden>-- Chọn người phê duyệt --</option>
              {approvers.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} - {a.position} {a.department ? `(${a.department})` : ''}
                </option>
              ))}
            </select>
            {errors.reviewer && <p className={ERROR_TEXT}>{errors.reviewer}</p>}
          </div>

          {/* Change Description */}
          <div>
            <label className={LABEL_CLS}>Mô tả thay đổi</label>
            <textarea
              rows={4}
              value={form.changeDescription || ''}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, changeDescription: e.target.value })}
              placeholder="Nhập lý do hoặc chi tiết các thay đổi cấu trúc/dữ liệu danh mục..."
              className={`${TEXTAREA_CLS} ${errors.changeDescription ? ERROR_BORDER : ''}`}
            />
            {errors.changeDescription && <p className={ERROR_TEXT}>{errors.changeDescription}</p>}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

// Wrapper for backward compatibility / auto-dispatching
export function ApprovalRequestModal(props: ApprovalRequestModalProps) {
  const { data, ...rest } = props;
  if (data?.type === 'category') {
    return <CategoryApprovalModal data={data} {...rest} />;
  }
  return <VersionApprovalModal data={data} {...rest} />;
}
