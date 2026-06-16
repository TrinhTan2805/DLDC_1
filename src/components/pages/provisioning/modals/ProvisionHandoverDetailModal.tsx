import React from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, Download, CheckCircle, Clock, User, Building } from 'lucide-react';

interface ProvisionHandoverDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData?: any;
}

export function ProvisionHandoverDetailModal({ isOpen, onClose, requestData }: ProvisionHandoverDetailModalProps) {
  if (!isOpen || !requestData) return null;

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('vi-VN');
    } catch {
      return isoString;
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Chi tiết Bàn giao dữ liệu</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800">Mã YC: {requestData.id}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Đã bàn giao
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-1"><span className="font-semibold text-slate-700">Cơ quan yêu cầu:</span> {requestData.org}</p>
            <p className="text-sm text-slate-600 mb-1"><span className="font-semibold text-slate-700">Loại dữ liệu:</span> {requestData.dataType}</p>
            
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-sm font-semibold text-slate-700 mb-2">File dữ liệu kết xuất:</p>
              <div className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">data_export_{requestData.id?.toLowerCase()}.{requestData.format || 'csv'}</span>
                </div>
                <button type="button" className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded flex items-center font-medium transition-colors border border-emerald-200">
                  <Download className="w-3.5 h-3.5 mr-1" /> Tải về
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Thông tin biên bản bàn giao
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500">ĐƠN VỊ NHẬN BÀN GIAO</p>
                  <p className="text-sm font-medium text-slate-800">{requestData.handoverDetails?.receivingUnit || requestData.org}</p>
                </div>
              </div>

              {requestData.handoverDetails?.receiverName && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500">NGƯỜI NHẬN</p>
                    <p className="text-sm font-medium text-slate-800">{requestData.handoverDetails.receiverName}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500">THỜI GIAN BÀN GIAO</p>
                  <p className="text-sm font-medium text-slate-800">{formatDate(requestData.handoverDetails?.date) || formatDate(requestData.requestDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                <div className="w-full">
                  <p className="text-xs font-semibold text-slate-500 mb-1">BIÊN BẢN ĐÍNH KÈM</p>
                  <div className="flex items-center justify-between bg-indigo-50/50 border border-indigo-100 p-2.5 rounded-lg w-full">
                    <span className="text-sm font-medium text-indigo-700">
                      {requestData.handoverDetails?.file?.name || `BienBan_BanGiao_${requestData.id}.pdf`}
                    </span>
                    <button type="button" className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1.5 rounded flex items-center font-medium transition-colors">
                      <Download className="w-3.5 h-3.5 mr-1" /> Tải biên bản
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end bg-slate-50 rounded-b-xl">
          <button onClick={onClose} className="px-5 py-2 text-white bg-slate-700 rounded-lg hover:bg-slate-800 font-medium text-sm transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
