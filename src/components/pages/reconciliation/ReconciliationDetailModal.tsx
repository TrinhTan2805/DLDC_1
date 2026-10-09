import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge, BTN_OUTLINE, BTN_GHOST_ICON, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../collection/collectionUi';

interface ReconciliationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordCode: string;
  record: {
    datasetCode: string;
    datasetName: string;
    providerSystem: string;
    dataType: string;
    recordCount: number;
    receiveDate: string;
    status: string;
    statusText: string;
    matchRate?: number;
    lastReconcileDate?: string;
    fromDate?: string;
    toDate?: string;
    sentCount?: number;
    receivedCount?: number;
    isReportSent?: boolean;
  } | null;
  onViewHistory?: () => void;
}

export function ReconciliationDetailModal({ isOpen, onClose, record }: ReconciliationDetailModalProps) {
  if (!isOpen || !record) return null;

  const received = record.receivedCount ?? record.recordCount; // Kho đếm được
  const sent = record.sentCount ?? received;                   // Nguồn khai báo
  const diff = received - sent;
  const matchRate = record.matchRate !== undefined ? record.matchRate : 100;
  const isMatched = record.status === 'matched';

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header (mục 5.4) */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-[16px] font-semibold text-[#020817]">Chi tiết đối soát thu thập</h2>
            <p className="text-[13px] text-[#64748B] mt-1 leading-5">{record.datasetCode}</p>
          </div>
          <button type="button" onClick={onClose} className={BTN_GHOST_ICON} aria-label="Đóng chi tiết đối soát" title="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Nhãn – giá trị (mục 5.17) */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1">
              <div className={FIELD_LABEL}>Hệ thống nguồn</div>
              <div className={`${FIELD_VALUE} break-words`}>{record.providerSystem}</div>
            </div>
            <div className="space-y-1">
              <div className={FIELD_LABEL}>Thông tin thu thập</div>
              <div className={`${FIELD_VALUE} break-words`}>{record.datasetName}</div>
              <div className="text-[13px] text-[#64748B]">{record.datasetCode}</div>
            </div>
          </div>

          {/* Kết quả đối soát */}
          <div className="border-t border-[#E2E8F0] pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${SECTION_TITLE} !mb-0`}>Kết quả đối soát</h3>
              {record.lastReconcileDate && (
                <span className="text-[13px] text-[#64748B]">Nguồn gọi: {record.lastReconcileDate.replace(/^(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1')}</span>
              )}
            </div>

            {/* Thẻ số liệu (mục 5.6.1) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <p className="text-[13px] text-[#64748B]">Số bản ghi (Nguồn)</p>
                <p className="text-[16px] font-semibold text-[#0F172A] tabular-nums mt-1">{sent.toLocaleString()}</p>
                <p className="text-[12px] text-[#64748B] mt-0.5">Nguồn khai báo</p>
              </div>
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <p className="text-[13px] text-[#64748B]">Số bản ghi (Kho)</p>
                <p className="text-[16px] font-semibold text-[#0F172A] tabular-nums mt-1">{received.toLocaleString()}</p>
                <p className="text-[12px] text-[#64748B] mt-0.5">Kho đếm được</p>
              </div>
              <div className={`rounded-2xl border p-4 ${diff !== 0 ? 'border-[#FEE2E2] bg-[#FEF2F2]' : 'border-[#DCFCE7] bg-[#F0FDF4]'}`}>
                <p className={`text-[13px] ${diff !== 0 ? 'text-[#B91C1C]' : 'text-[#15803D]'}`}>Sai lệch</p>
                <p className={`text-[16px] font-semibold tabular-nums mt-1 ${diff !== 0 ? 'text-[#B91C1C]' : 'text-[#15803D]'}`}>{Math.abs(diff).toLocaleString()}</p>
                <p className={`text-[12px] mt-0.5 ${diff !== 0 ? 'text-[#B91C1C]' : 'text-[#15803D]'}`}>
                  {diff !== 0 ? 'Cần đồng bộ lại' : 'Trùng khớp'}
                </p>
              </div>
            </div>
          </div>

          {/* Tỷ lệ khớp + trạng thái */}
          <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0] flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="flex justify-between text-[13px] mb-1.5">
                <span className="text-[#020817]">Tỷ lệ khớp dữ liệu</span>
                <span className={`font-semibold tabular-nums ${matchRate === 100 ? 'text-[#15803D]' : 'text-[#D97706]'}`}>{matchRate.toFixed(2)}%</span>
              </div>
              <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${matchRate === 100 ? 'bg-[#10B981]' : 'bg-[#D97706]'}`}
                  style={{ width: `${matchRate}%` }}
                />
              </div>
            </div>
            <div>
              {isMatched ? (
                <Badge label="Khớp dữ liệu" variant="green" icon={<CheckCircle className="w-3.5 h-3.5" />} />
              ) : record.status === 'pending' ? (
                <Badge label="Đang xử lý" variant="amber" />
              ) : (
                <Badge label={record.statusText || 'Không khớp'} variant="red" icon={<AlertTriangle className="w-3.5 h-3.5" />} />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
