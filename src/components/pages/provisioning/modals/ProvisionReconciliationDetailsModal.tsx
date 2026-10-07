import React from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, Download, Server, DownloadCloud, AlertTriangle, RefreshCw, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { ReconciliationHistoryEntry, reconciliationData } from '../../../../data/provisionReconciliationData';
import { Badge, BTN_GHOST_ICON, BTN_OUTLINE, BTN_PRIMARY, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../../collection/collectionUi';

interface ProvisionReconciliationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: ReconciliationHistoryEntry | null;
}

export function ProvisionReconciliationDetailsModal({ isOpen, onClose, entry }: ProvisionReconciliationDetailsModalProps) {
  if (!isOpen || !entry) return null;

  const process = reconciliationData.find(p => p.id === entry.processId);
  const processName = process ? process.name : 'Đối soát dữ liệu cung cấp';

  let apiName = 'API Cung cấp dữ liệu liên kết';
  let apiEndpoint = '/api/v1/data/provision';

  if (entry.processId === '662') {
    apiName = 'Lấy danh mục dùng chung';
    apiEndpoint = '/api/v1/categories/list';
  } else if (entry.processId === '663') {
    apiName = 'Lấy danh sách Hộ tịch';
    apiEndpoint = '/api/v1/hotich/list';
  } else if (entry.processId === '664') {
    apiName = 'Lấy danh sách Hồ sơ quốc tịch';
    apiEndpoint = '/api/v1/quoctich/list';
  } else if (entry.processId === '665') {
    apiName = 'Đồng bộ dữ liệu THADS';
    apiEndpoint = '/api/v1/thads/sync';
  } else if (process) {
    apiName = `API Cung cấp ${process.group}`;
    apiEndpoint = `/api/v1/${process.group.toLowerCase().replace(/[^a-z0-9]/g, '')}/list`;
  }

  const matchRate = entry.totalSent > 0 ? (entry.totalMatched / entry.totalSent) * 100 : 100;
  const reconStatus = !entry.totalSent ? 'Chưa đối soát' : (entry.discrepancies === 0 ? 'Khớp dữ liệu' : 'Không khớp');
  const saiLech = entry.totalSent - entry.totalMatched;
  const hasDiff = saiLech !== 0;
  const barColor = reconStatus === 'Khớp dữ liệu' ? 'bg-[#10B981]' : reconStatus === 'Không khớp' ? 'bg-[#DC2626]' : 'bg-blue-600';
  const pctColor = reconStatus === 'Khớp dữ liệu' ? 'text-[#15803D]' : reconStatus === 'Không khớp' ? 'text-[#B91C1C]' : 'text-blue-600';

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#E2E8F0] flex-shrink-0">
          <div>
            <h2 className="text-[16px] font-medium text-[#020817]">Chi tiết kết quả đối soát</h2>
            <p className="text-[13px] text-[#64748B] mt-1 leading-5">Mã phiên: {entry.id.toUpperCase()}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={BTN_GHOST_ICON}
            aria-label="Đóng chi tiết kết quả đối soát"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6 overflow-y-auto custom-scrollbar">

          {/* 2 cards: Tên tiến trình đối soát + API liên kết đối soát */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#E2E8F0] p-4 space-y-1">
              <div className={`${FIELD_LABEL} flex items-center gap-2`}>
                <Server className="w-4 h-4 text-blue-600" /> Tên tiến trình đối soát
              </div>
              <div className={`${FIELD_VALUE} break-words`}>{processName}</div>
              <div className="text-[13px] text-[#64748B]">Mã quy trình: PROC-PRV-{entry.processId}</div>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] p-4 space-y-1">
              <div className={`${FIELD_LABEL} flex items-center gap-2`}>
                <DownloadCloud className="w-4 h-4 text-blue-600" /> API liên kết đối soát
              </div>
              <div className={`${FIELD_VALUE} break-words`}>{apiName}</div>
              <div className="text-[13px] text-[#020817] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2 py-1 break-all">{apiEndpoint}</div>
            </div>
          </div>

          {/* Kết quả đối soát */}
          <div className="border-t border-[#E2E8F0] pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${SECTION_TITLE} !mb-0`}>Kết quả đối soát</h3>
              <span className="text-[13px] text-[#64748B]">Ngày gọi: {entry.totalSent ? entry.runDate : '—'}</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <p className="text-[13px] text-[#64748B]">Số bản ghi cung cấp</p>
                <p className="text-[16px] font-semibold text-[#0F172A] tabular-nums mt-1">{entry.totalSent.toLocaleString()}</p>
                <p className="text-[12px] text-[#64748B] mt-0.5">Kho DLDC gửi đi</p>
              </div>
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <p className="text-[13px] text-[#64748B]">Số bản ghi nhận</p>
                <p className="text-[16px] font-semibold text-[#0F172A] tabular-nums mt-1">{entry.totalMatched.toLocaleString()}</p>
                <p className="text-[12px] text-[#64748B] mt-0.5">Đích nhận trùng khớp</p>
              </div>
              <div className={`rounded-2xl border p-4 ${hasDiff ? 'border-[#FEE2E2] bg-[#FEF2F2]' : 'border-[#DCFCE7] bg-[#F0FDF4]'}`}>
                <p className={`text-[13px] ${hasDiff ? 'text-[#B91C1C]' : 'text-[#15803D]'}`}>Sai lệch</p>
                <p className={`text-[16px] font-semibold tabular-nums mt-1 ${hasDiff ? 'text-[#B91C1C]' : 'text-[#15803D]'}`}>{saiLech.toLocaleString()}</p>
                <p className={`text-[12px] mt-0.5 ${hasDiff ? 'text-[#B91C1C]' : 'text-[#15803D]'}`}>
                  {hasDiff ? 'Chênh lệch' : 'Trùng khớp'}
                </p>
              </div>
            </div>
          </div>

          {/* Tỷ lệ khớp + trạng thái */}
          <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0] flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="flex justify-between text-[13px] mb-1.5">
                <span className="text-[#020817]">Tỷ lệ khớp dữ liệu</span>
                <span className={`font-semibold tabular-nums ${pctColor}`}>{matchRate.toFixed(2)}%</span>
              </div>
              <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${matchRate}%` }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {reconStatus === 'Khớp dữ liệu' ? (
                <Badge label="Khớp dữ liệu" variant="green" icon={<CheckCircle2 className="w-4 h-4" />} />
              ) : reconStatus === 'Không khớp' ? (
                <Badge label="Không khớp" variant="red" icon={<AlertTriangle className="w-4 h-4" />} />
              ) : (
                <Badge label="Chưa đối soát" variant="blue" icon={<Clock className="w-4 h-4" />} />
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end gap-3 flex-wrap flex-shrink-0">
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>
            Đóng
          </button>
          {reconStatus === 'Không khớp' && (
            <button
              type="button"
              onClick={() => toast.info('Đang thực hiện yêu cầu đồng bộ & đối soát lại dữ liệu cung cấp...')}
              className={BTN_PRIMARY}
            >
              <RefreshCw className="w-4 h-4" />
              Đồng bộ lại
            </button>
          )}
        </div>

      </div>
    </div>
    , document.body
  );
}
