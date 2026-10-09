import { X, ChevronRight } from 'lucide-react';
import { Badge, BTN_OUTLINE, BTN_GHOST_ICON, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from './collectionUi';

// Tiêu đề khối có vạch xanh (compomennt.md mục 1 – H2)
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className={SECTION_TITLE}>
    <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
    {children}
  </h3>
);

// Cặp Nhãn – Giá trị (mục 5.17)
const Field = ({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) => (
  <div className={`space-y-1 ${wide ? 'col-span-2' : ''}`}>
    <div className={FIELD_LABEL}>{label}</div>
    <div className={`${FIELD_VALUE} break-words`}>{children}</div>
  </div>
);

interface SourceSystem {
  id: string;
  systemName: string;
  unitName: string;
  sourceType: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  note: string;
}

interface SourceSystemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SourceSystem | null;
}

export function SourceSystemDetailModal({ isOpen, onClose, data }: SourceSystemDetailModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="source-system-detail-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="source-system-detail-title" className="text-[16px] font-semibold text-[#020817]">
              {data.systemName || 'Thông tin hệ thống'}
            </h2>
            <div className="flex items-center gap-1 text-[13px] text-[#64748B] mt-0.5">
              <span>Hệ thống nguồn</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Chi tiết</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-4">
          {/* THÔNG TIN CHUNG */}
          <div className="rounded-2xl border border-[#E2E8F0] p-4">
            <SectionTitle>Thông tin cơ bản</SectionTitle>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <Field label="Tên hệ thống">{data.systemName || '-'}</Field>
              <Field label="Loại nguồn">
                {data.sourceType ? (
                  <Badge label={data.sourceType} variant={data.sourceType === 'Trong ngành' ? 'purple' : 'blue'} />
                ) : '-'}
              </Field>
              <Field label="Tên đơn vị quản lý" wide>{data.unitName || '-'}</Field>
              <Field label="Địa chỉ" wide>{data.address || '-'}</Field>
            </div>
          </div>

          {/* THÔNG TIN LIÊN HỆ */}
          <div className="rounded-2xl border border-[#E2E8F0] p-4">
            <SectionTitle>Đầu mối liên hệ</SectionTitle>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <Field label="Người đại diện">{data.contactPerson || '-'}</Field>
              <Field label="Số điện thoại">{data.phone || '-'}</Field>
              <Field label="Email" wide>
                {data.email ? <span className="text-[#155DFC]">{data.email}</span> : '-'}
              </Field>
            </div>
          </div>

          {/* GHI CHÚ */}
          <div className="rounded-2xl border border-[#E2E8F0] p-4">
            <SectionTitle>Ghi chú</SectionTitle>
            <div className={`${FIELD_VALUE} whitespace-pre-line break-words`}>
              {data.note || '-'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
