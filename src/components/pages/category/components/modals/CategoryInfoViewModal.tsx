import { useState, ChangeEvent } from 'react';
import { Info, CheckCircle2, XCircle } from 'lucide-react';
import { MasterDataEntity, ScopeType, DataSourceType } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';

interface CategoryInfoViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
  requestStatus?: string;
  onApprove: (note: string) => void;
  onReject: (note: string) => void;
}

const scopeLabels: Record<ScopeType, string> = {
  national: 'Cấp quốc gia',
  ministry: 'Cấp bộ',
  provincial: 'Cấp tỉnh',
  internal: 'Sử dụng nội bộ',
};

const dataSourceLabels: Record<DataSourceType, string> = {
  manual: 'Tự cập nhật trực tiếp',
  dldc: 'Đồng bộ Kho DLDC',
};

function Field({ label, value, colSpan = 1 }: { label: string; value?: string | number | null; colSpan?: number }) {
  return (
    <div className={colSpan === 2 ? 'col-span-2' : ''}>
      <div className="text-[13px] text-slate-500 font-medium mb-1">{label}</div>
      <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 font-medium min-h-[34px]">
        {value ?? <span className="text-slate-400 italic">Chưa cập nhật</span>}
      </div>
    </div>
  );
}

export function CategoryInfoViewModal({ isOpen, onClose, entity, requestStatus, onApprove, onReject }: CategoryInfoViewModalProps) {
  const [note, setNote] = useState('');

  if (!isOpen || !entity) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thông tin chung danh mục"
      subtitle="Thông tin được cấu hình tại bước 1 — Thiết lập danh mục dùng chung"
      maxWidth="max-w-2xl"
      customHeaderIcon={
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mr-3 shrink-0">
          <Info className="w-5 h-5 text-blue-600" />
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[13px]"
          >
            Đóng
          </button>
          {requestStatus === 'pending' || !requestStatus ? (
            <div className="flex gap-2">
              <button
                onClick={() => { onReject(note); }}
                className="px-5 py-2.5 bg-red-500 text-white rounded-xl flex items-center gap-2 hover:bg-red-600 transition-all text-[13px] shadow-sm shadow-red-100"
              >
                <XCircle className="w-4 h-4" />
                Từ chối
              </button>
              <button
                onClick={() => { onApprove(note); }}
                className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl flex items-center gap-2 hover:bg-emerald-600 transition-all text-[13px] shadow-sm shadow-emerald-100"
              >
                <CheckCircle2 className="w-4 h-4" />
                Phê duyệt
              </button>
            </div>
          ) : null}
        </div>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phiên bản danh mục" value={`v${entity.version ?? 1}.0`} colSpan={2} />
          <Field label="Tên danh sách danh mục" value={entity.name} colSpan={2} />
          <Field label="Cơ sở dữ liệu/Hệ thống" value={entity.databaseSystem} />
          <Field label="Đơn vị chủ quản" value={entity.managingAgency} />
          <Field label="Căn cứ" value={entity.canCu} colSpan={2} />
          <Field label="Phạm vi vĩ mô" value={entity.scope ? scopeLabels[entity.scope] : undefined} />
          <Field label="Nguồn dữ liệu" value={entity.dataSource ? dataSourceLabels[entity.dataSource] : undefined} />
        </div>

        <div className="space-y-2">
          <label className="block text-[13px] font-semibold text-slate-700">Ý kiến phê duyệt</label>
          <textarea
            rows={3}
            value={note}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
            placeholder="Nhập ý kiến phê duyệt hoặc lý do từ chối (nếu có)..."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
          />
        </div>
      </div>
    </BaseModal>
  );
}
