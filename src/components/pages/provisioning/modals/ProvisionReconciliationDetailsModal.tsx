import React from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, Download, Server, DownloadCloud, AlertTriangle, RefreshCw, Clock } from 'lucide-react';
import { ReconciliationHistoryEntry, reconciliationData } from '../../../../data/provisionReconciliationData';

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
  const barColor = reconStatus === 'Khớp dữ liệu' ? 'bg-emerald-500' : reconStatus === 'Không khớp' ? 'bg-rose-500' : 'bg-blue-500';
  const pctColor = reconStatus === 'Khớp dữ liệu' ? 'text-emerald-600' : reconStatus === 'Không khớp' ? 'text-rose-600' : 'text-blue-600';

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ fontSize: '13px' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-[18px] font-bold text-slate-800" style={{ fontSize: '18px' }}>Chi tiết kết quả đối soát</h2>
            <p className="text-[13px] text-slate-500 mt-0.5 font-mono" style={{ fontSize: '13px' }}>Mã phiên: {entry.id.toUpperCase()}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* 2 cards: Tên tiến trình đối soát + API liên kết đối soát */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500 mb-2">
                <Server className="w-4 h-4 text-blue-600" /> Tên tiến trình đối soát
              </div>
              <div className="text-[14px] font-semibold text-slate-900">{processName}</div>
              <div className="text-[12px] text-slate-500 mt-1 font-mono">Mã quy trình: PROC-PRV-{entry.processId}</div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500 mb-2">
                <DownloadCloud className="w-4 h-4 text-blue-600" /> API liên kết đối soát
              </div>
              <div className="text-[14px] font-semibold text-slate-900">{apiName}</div>
              <div className="text-[12px] text-slate-500 mt-1 font-mono">{apiEndpoint}</div>
            </div>
          </div>

          {/* Kết quả đối soát */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-slate-900 uppercase tracking-tight">Kết quả đối soát</h3>
              <span className="text-[12px] text-slate-500">Ngày gọi: {entry.totalSent ? entry.runDate : '—'}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="border border-slate-200 rounded-lg p-3 text-center">
                <p className="text-[12px] text-slate-500">Số bản ghi cung cấp</p>
                <p className="text-xl font-bold text-slate-900">{entry.totalSent.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Kho DLDC gửi đi</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 text-center">
                <p className="text-[12px] text-slate-500">Số bản ghi nhận</p>
                <p className="text-xl font-bold text-slate-900">{entry.totalMatched.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Đích nhận trùng khớp</p>
              </div>
              <div className={`rounded-lg p-3 text-center border ${hasDiff ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'}`}>
                <p className={`text-[12px] ${hasDiff ? 'text-rose-600' : 'text-emerald-600'}`}>Sai lệch</p>
                <p className={`text-xl font-bold ${hasDiff ? 'text-rose-700' : 'text-emerald-700'}`}>{saiLech.toLocaleString()}</p>
                <p className={`text-[11px] mt-0.5 ${hasDiff ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {hasDiff ? 'Chênh lệch' : 'Trùng khớp'}
                </p>
              </div>
            </div>
          </div>

          {/* Tỷ lệ khớp + trạng thái */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="flex justify-between text-[13px] mb-1.5">
                <span className="text-slate-600">Tỷ lệ khớp dữ liệu</span>
                <span className={`font-semibold ${pctColor}`}>{matchRate.toFixed(2)}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${matchRate}%` }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {reconStatus === 'Khớp dữ liệu' ? (
                <span className="px-4 py-2 text-[13px] font-semibold rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Khớp dữ liệu
                </span>
              ) : reconStatus === 'Không khớp' ? (
                <span className="px-4 py-2 text-[13px] font-semibold rounded-lg border bg-rose-50 text-rose-700 border-rose-200 flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Không khớp
                </span>
              ) : (
                <span className="px-4 py-2 text-[13px] font-semibold rounded-lg border bg-blue-50 text-blue-700 border-blue-200 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" /> Chưa đối soát
                </span>
              )}
            </div>
          </div>
          
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 flex-wrap">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm cursor-pointer font-medium"
          >
            Đóng
          </button>
          {reconStatus === 'Không khớp' && (
            <button
              onClick={() => alert('Đang thực hiện yêu cầu đồng bộ & đối soát lại dữ liệu cung cấp...')}
              className="px-4 py-2 text-[13px] border border-slate-200 text-slate-700 bg-white rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer font-medium"
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
