import { ChangeEvent, useState, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { BaseModal } from '../../../../common/BaseModal';

interface ApprovalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  approvers: any[];
  form: any;
  setForm: (form: any) => void;
  onSubmit: () => void;
}

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
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[13px] font-medium cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleValidationAndSubmit}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all text-[13px] font-medium shadow-lg shadow-blue-200 cursor-pointer"
          >
            <Send className="w-5 h-5 rotate-[-20deg]" />
            Gửi trình duyệt
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Info Banner */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-[13px] text-slate-500 font-semibold">Danh mục</span>
              <span className="text-[13px] font-bold text-slate-900 text-right">{data?.name || 'Danh mục dữ liệu B'}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-slate-500">Mã: {data?.code || 'ODC002'}</span>
            </div>
          </div>
        </div>

        {/* Advisory Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
          <div className="text-[13px] leading-relaxed text-left">
            <p className="font-semibold text-blue-800">Lưu ý quan trọng:</p>
            <p className="mt-1 text-blue-700/95 font-medium">
              Hệ thống sẽ gửi yêu cầu phê duyệt danh mục với trạng thái <strong className="text-blue-800 font-bold">Chờ phê duyệt</strong>.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Reviewer */}
          <div className="space-y-1.5 text-left">
            <label className="block text-[13px] font-semibold text-slate-700 text-left">
              Người phê duyệt <span className="text-red-500">*</span>
            </label>
            <select
              title="Người phê duyệt"
              value={form.reviewer || ''}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, reviewer: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-800 ${errors.reviewer ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'}`}
            >
              <option value="">-- Chọn người phê duyệt --</option>
              {approvers.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} - {a.position} {a.department ? `(${a.department})` : ''}
                </option>
              ))}
            </select>
            {errors.reviewer && <p className="text-red-500 text-[12px]">{errors.reviewer}</p>}
          </div>

          {/* Change Description */}
          <div className="space-y-1.5 text-left">
            <label className="block text-[13px] font-semibold text-slate-700 text-left">
              Nội dung trình duyệt <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={form.changeDescription || ''}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, changeDescription: e.target.value })}
              placeholder="Nhập nội dung trình duyệt danh mục..."
              className={`w-full px-4 py-3 border rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-800 resize-none ${errors.changeDescription ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'}`}
            />
            {errors.changeDescription && <p className="text-red-500 text-[12px]">{errors.changeDescription}</p>}
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
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[13px] font-medium cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleValidationAndSubmit}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all text-[13px] font-medium shadow-lg shadow-blue-200 cursor-pointer"
          >
            <Send className="w-5 h-5 rotate-[-20deg]" />
            Gửi trình duyệt
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Info Banner */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-[13px] text-slate-500 font-semibold">Danh mục</span>
              <span className="text-[13px] font-bold text-slate-900 text-right">{data?.name || 'Danh mục dữ liệu B'}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-slate-500">Mã: {data?.code || 'ODC002'}</span>
            </div>
          </div>
        </div>

        {/* Advisory Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
          <div className="text-[13px] leading-relaxed text-left">
            <p className="font-semibold text-blue-800">Lưu ý quan trọng:</p>
            <p className="mt-1 text-blue-700/95 font-medium">
              Hệ thống sẽ tạo một bản sao phiên bản mới cho danh mục với trạng thái <strong className="text-blue-800 font-bold">Chờ phê duyệt</strong>.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Version Name and Effective Date Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Version Name */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[13px] font-semibold text-slate-700 text-left">
                Tên phiên bản
              </label>
              <div className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-slate-50 text-slate-700 font-mono">
                {form.versionName || `v${(data?.currentVersion || 1) + 1}.0`}
              </div>
            </div>

            {/* Effective Date */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[13px] font-semibold text-slate-700 text-left">
                Hiệu lực
              </label>
              <input
                type="date"
                value={form.effectiveDate || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, effectiveDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg text-[13px] bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-800 ${errors.effectiveDate ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'}`}
              />
              {errors.effectiveDate && <p className="text-red-500 text-[12px]">{errors.effectiveDate}</p>}
            </div>
          </div>

          {/* Approver Select */}
          <div className="space-y-1.5 text-left">
            <label className="block text-[13px] font-semibold text-slate-700 text-left">
              Người phê duyệt <span className="text-red-500">*</span>
            </label>
            <select
              title="Người phê duyệt"
              value={form.reviewer || ''}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, reviewer: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-800 ${errors.reviewer ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'}`}
            >
              <option value="">-- Chọn người phê duyệt --</option>
              {approvers.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} - {a.position} {a.department ? `(${a.department})` : ''}
                </option>
              ))}
            </select>
            {errors.reviewer && <p className="text-red-500 text-[12px]">{errors.reviewer}</p>}
          </div>

          {/* Change Description */}
          <div className="space-y-1.5 text-left">
            <label className="block text-[13px] font-semibold text-slate-700 text-left">
              Mô tả thay đổi
            </label>
            <textarea
              rows={4}
              value={form.changeDescription || ''}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, changeDescription: e.target.value })}
              placeholder="Nhập lý do hoặc chi tiết các thay đổi cấu trúc/dữ liệu danh mục..."
              className={`w-full px-4 py-3 border rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-800 resize-none ${errors.changeDescription ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'}`}
            />
            {errors.changeDescription && <p className="text-red-500 text-[12px]">{errors.changeDescription}</p>}
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
