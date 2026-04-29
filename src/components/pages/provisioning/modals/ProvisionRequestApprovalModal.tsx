import React, { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface ProvisionRequestApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData?: any;
}

export function ProvisionRequestApprovalModal({ isOpen, onClose, requestData }: ProvisionRequestApprovalModalProps) {
  const [status, setStatus] = useState<'approve' | 'reject'>('approve');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Xử lý yêu cầu cung cấp dữ liệu</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2">Mã YC: {requestData?.code || 'YC-2026-0429'}</h3>
            <p className="text-sm text-slate-600 mb-1"><span className="font-medium">Cơ quan yêu cầu:</span> Sở Nội vụ Lạng Sơn</p>
            <p className="text-sm text-slate-600 mb-1"><span className="font-medium">Loại dữ liệu:</span> Thống kê hộ tịch 2025</p>
            <p className="text-sm text-slate-600 mb-1"><span className="font-medium">Mục đích:</span> Phục vụ báo cáo quý I năm 2026</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Quyết định xử lý</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setStatus('approve')}
                className={`flex-1 flex flex-col items-center p-4 border rounded-lg transition-colors ${
                  status === 'approve'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                <CheckCircle className={`w-8 h-8 mb-2 ${status === 'approve' ? 'text-green-600' : 'text-slate-400'}`} />
                <span className="font-medium">Duyệt & Kết xuất</span>
              </button>
              <button
                onClick={() => setStatus('reject')}
                className={`flex-1 flex flex-col items-center p-4 border rounded-lg transition-colors ${
                  status === 'reject'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                <XCircle className={`w-8 h-8 mb-2 ${status === 'reject' ? 'text-red-600' : 'text-slate-400'}`} />
                <span className="font-medium">Từ chối yêu cầu</span>
              </button>
            </div>
          </div>

          {status === 'reject' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lý do từ chối <span className="text-red-500">*</span></label>
              <textarea
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                rows={3}
                placeholder="Nhập lý do từ chối yêu cầu..."
              ></textarea>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${
              status === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {status === 'approve' ? 'Xác nhận Duyệt' : 'Xác nhận Từ chối'}
          </button>
        </div>
      </div>
    </div>
  );
}
