import { X, Download, CheckCircle, Send, AlertTriangle, RefreshCw, History as HistoryIcon, Server, DownloadCloud } from 'lucide-react';

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

export function ReconciliationDetailModal({ isOpen, onClose, record, onViewHistory }: ReconciliationDetailModalProps) {
  if (!isOpen || !record) return null;

  const received = record.receivedCount ?? record.recordCount; // Kho đếm được
  const sent = record.sentCount ?? received;                   // Nguồn khai báo
  const diff = received - sent;
  const matchRate = record.matchRate !== undefined ? record.matchRate : 100;
  const isMatched = record.status === 'matched';

  return (
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Chi tiết đối soát thu thập</h2>
            <p className="text-[13px] text-slate-500 mt-0.5 font-mono">{record.datasetCode}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* 2 cards: Hệ thống nguồn + Thông tin thu thập */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500 mb-2">
                <Server className="w-4 h-4" /> Hệ thống nguồn
              </div>
              <div className="text-[14px] text-slate-900">{record.providerSystem}</div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500 mb-2">
                <DownloadCloud className="w-4 h-4" /> Thông tin thu thập
              </div>
              <div className="text-[14px] text-slate-900">{record.datasetName}</div>
              <div className="text-[12px] text-slate-500 mt-1 font-mono">{record.datasetCode}</div>
            </div>
          </div>

          {/* Kết quả đối soát */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-slate-900 uppercase tracking-tight">Kết quả đối soát</h3>
              {record.lastReconcileDate && (
                <span className="text-[12px] text-slate-500">Nguồn gọi: {record.lastReconcileDate}</span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="border border-slate-200 rounded-lg p-3 text-center">
                <p className="text-[12px] text-slate-500">Số bản ghi (Nguồn)</p>
                <p className="text-xl font-bold text-slate-900">{sent.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Nguồn khai báo</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 text-center">
                <p className="text-[12px] text-slate-500">Số bản ghi (Kho)</p>
                <p className="text-xl font-bold text-slate-900">{received.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Kho đếm được</p>
              </div>
              <div className={`rounded-lg p-3 text-center border ${diff !== 0 ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'}`}>
                <p className={`text-[12px] ${diff !== 0 ? 'text-rose-600' : 'text-emerald-600'}`}>Sai lệch</p>
                <p className={`text-xl font-bold ${diff !== 0 ? 'text-rose-700' : 'text-emerald-700'}`}>{Math.abs(diff).toLocaleString()}</p>
                <p className={`text-[11px] mt-0.5 ${diff !== 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {diff !== 0 ? 'Cần đồng bộ lại' : 'Trùng khớp'}
                </p>
              </div>
            </div>
          </div>

          {/* Tỷ lệ khớp + trạng thái */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="flex justify-between text-[13px] mb-1.5">
                <span className="text-slate-600">Tỷ lệ khớp dữ liệu</span>
                <span className={`font-semibold ${matchRate === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>{matchRate.toFixed(2)}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${matchRate === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${matchRate}%` }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {isMatched ? (
                <span className="px-4 py-2 text-[13px] font-semibold rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Khớp dữ liệu
                </span>
              ) : record.status === 'pending' ? (
                <span className="px-4 py-2 text-[13px] font-semibold rounded-lg border bg-amber-50 text-amber-700 border-amber-200 flex items-center justify-center gap-2">
                  Đang xử lý
                </span>
              ) : (
                <>
                  <span className="px-4 py-2 text-[13px] font-semibold rounded-lg border bg-rose-50 text-rose-700 border-rose-200 flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Có sai lệch dữ liệu
                  </span>
                  {record.isReportSent && (
                    <span className="px-4 py-1.5 text-[12px] font-medium rounded-lg border bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center justify-center gap-2">
                      <Send className="w-3.5 h-3.5" /> Đã gửi báo cáo về nguồn
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 flex-wrap">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Đóng
          </button>
          <button
            onClick={onViewHistory}
            title="Xem lịch sử đối soát của bộ dữ liệu này"
            className="px-4 py-2 text-[13px] border border-slate-200 text-slate-700 bg-white rounded-lg hover:bg-slate-50 flex items-center gap-2"
          >
            <HistoryIcon className="w-4 h-4" />
            Xem lịch sử
          </button>
          {!isMatched && (
            <button
              title="Đồng bộ lại thu thập này"
              className="px-4 py-2 text-[13px] border border-slate-200 text-slate-700 bg-white rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Đồng bộ lại
            </button>
          )}
          <button
            title="Tải báo cáo đối soát"
            className="px-4 py-2 text-[13px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}
