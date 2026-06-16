import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface ProvisionRequestApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData?: any;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export function ProvisionRequestApprovalModal({ isOpen, onClose, requestData, onApprove, onReject }: ProvisionRequestApprovalModalProps) {
  const [status, setStatus] = useState<'approve' | 'reject'>('approve');
  const [rejectReason, setRejectReason] = useState('');

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Xử lý yêu cầu cung cấp dữ liệu</h2>
          <button aria-label="Đóng" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">Mã YC: {requestData?.id || 'YC-2026-0429'}</h3>
            <p className="text-sm text-slate-600 mb-1"><span className="font-semibold text-slate-700">Cơ quan yêu cầu:</span> {requestData?.org || 'Sở Nội vụ Lạng Sơn'}</p>
            <p className="text-sm text-slate-600 mb-1"><span className="font-semibold text-slate-700">Loại dữ liệu:</span> {requestData?.dataType || 'Thống kê hộ tịch'}</p>
            <p className="text-sm text-slate-600 mb-1"><span className="font-semibold text-slate-700">Mục đích:</span> {requestData?.purpose || 'Phục vụ báo cáo quý'}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Quyết định xử lý</label>
            <div className="flex space-x-4">
              <button onClick={() => setStatus('approve')} className={`flex-1 flex flex-col items-center p-4 border rounded-xl ${status === 'approve' ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                <CheckCircle className={`w-8 h-8 mb-2 ${status === 'approve' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="font-bold text-xs uppercase tracking-wider">Phê duyệt</span>
              </button>
              <button onClick={() => setStatus('reject')} className={`flex-1 flex flex-col items-center p-4 border rounded-xl ${status === 'reject' ? 'border-red-500 bg-red-50/50 text-red-800 ring-2 ring-red-500/20' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                <XCircle className={`w-8 h-8 mb-2 ${status === 'reject' ? 'text-red-600' : 'text-slate-400'}`} />
                <span className="font-bold text-xs uppercase tracking-wider">Từ chối</span>
              </button>
            </div>
          </div>

          {status === 'reject' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Lý do từ chối <span className="text-red-500">*</span></label>
              <textarea className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Nhập lý do từ chối yêu cầu..." />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
          <button aria-label="Hủy bỏ" onClick={onClose} className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-sm">Hủy bỏ</button>
          <button
            aria-label="Xác nhận"
            onClick={() => {
              if (status === 'approve') onApprove(requestData?.id || 'YC-2026-0429');
              else onReject(requestData?.id || 'YC-2026-0429', rejectReason);
              onClose();
            }}
            className={`px-4 py-2 text-white rounded-lg font-bold text-sm ${status === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {status === 'approve' ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối'}
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
