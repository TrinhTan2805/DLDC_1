import { ChangeEvent, useState } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { MasterDataEntity } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';

interface SimpleApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
  onConfirm: (note: string) => void;
}

export function SimpleApproveModal({
  isOpen,
  onClose,
  entity,
  onConfirm
}: SimpleApproveModalProps) {
  const [note, setNote] = useState('');

  if (!isOpen || !entity) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Phê duyệt danh mục dữ liệu mở"
      maxWidth="max-w-lg"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[13px]"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm(note)}
            className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl flex items-center gap-2 hover:bg-emerald-600 transition-all text-[13px] shadow-lg shadow-emerald-100"
          >
            <CheckCircle2 className="w-5 h-5" />
            Phê duyệt
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-lg border-2 border-blue-600 flex items-center justify-center mt-0.5">
              <ChevronRight className="w-3 h-3 text-blue-600 stroke-[3]" />
            </div>
            <div className="space-y-1">
              <div className="text-[13px] text-blue-700 font-medium uppercase tracking-tight">Thông tin danh mục</div>
              <div className="text-[13px] font-bold text-blue-900">{entity.name}</div>
              <div className="text-[13px] text-blue-600">Đơn vị chủ quản: {entity.managingAgency}</div>
            </div>
          </div>
        </div>

        {/* Input field */}
        <div className="space-y-2">
          <label className="block text-[13px] font-semibold text-slate-700">Ý kiến phê duyệt</label>
          <textarea
            rows={4}
            value={note}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
            placeholder="Nhập ý kiến phê duyệt (nếu có)... Ví dụ: Đồng ý phê duyệt danh mục dữ liệu mở theo đề xuất của đơn vị."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
          />
        </div>

      </div>
    </BaseModal>
  );
}
