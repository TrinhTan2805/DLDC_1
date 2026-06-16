import React from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, Download, Globe, Clock, CheckCircle, AlertTriangle, Database } from 'lucide-react';

interface ProvisionPublishDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData?: any;
}

export function ProvisionPublishDetailModal({ isOpen, onClose, requestData }: ProvisionPublishDetailModalProps) {
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

  const isUnpublished = requestData.status === 'HUY_CONG_KHAI';

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Chi tiết Công khai dịch vụ</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {isUnpublished && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-800 mb-1">Dịch vụ đã bị hủy công khai</h3>
                <p className="text-sm text-red-700">Dịch vụ này đã ngừng đồng bộ trên các nền tảng chia sẻ dữ liệu.</p>
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="text-xs font-semibold text-red-800 opacity-80 mb-1">LÝ DO HỦY</p>
                  <p className="text-sm font-medium text-red-900">{requestData.publishDetails?.unpublishReason || 'Không có lý do'}</p>
                  <p className="text-xs text-red-700 mt-2">Thời gian: {formatDate(requestData.publishDetails?.unpublishDate)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800">Mã YC: {requestData.id}</h3>
              {!isUnpublished && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Đã công khai
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mb-1"><span className="font-semibold text-slate-700">Cơ quan yêu cầu:</span> {requestData.org}</p>
            <p className="text-sm text-slate-600 mb-1"><span className="font-semibold text-slate-700">Loại dữ liệu:</span> {requestData.dataType}</p>
            
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-sm font-semibold text-slate-700 mb-2">File dữ liệu kết xuất:</p>
              <div className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">data_export_{requestData.id?.toLowerCase()}.{requestData.format || 'json'}</span>
                </div>
                <button type="button" className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded flex items-center font-medium transition-colors border border-emerald-200">
                  <Download className="w-3.5 h-3.5 mr-1" /> Tải về
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              Thông tin Công khai
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-slate-400 mt-0.5" />
                <div className="w-full">
                  <p className="text-xs font-semibold text-slate-500 mb-2">NỀN TẢNG CÔNG KHAI</p>
                  <div className="space-y-2">
                    {requestData.publishDetails?.platforms?.includes('national') && (
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm border border-blue-100">
                        <Globe className="w-4 h-4" /> Cổng dữ liệu dùng chung Quốc gia
                      </div>
                    )}
                    {requestData.publishDetails?.platforms?.includes('lgsp') && (
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm border border-blue-100">
                        <Database className="w-4 h-4" /> Nền tảng chia sẻ dữ liệu nội bộ (LGSP)
                      </div>
                    )}
                    {(!requestData.publishDetails?.platforms || requestData.publishDetails.platforms.length === 0) && (
                      <p className="text-sm text-slate-500 italic">Không có thông tin nền tảng.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500">MÔ TẢ LÝ DO CÔNG KHAI</p>
                  <p className="text-sm font-medium text-slate-800">{requestData.publishDetails?.reason || 'Không có mô tả'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500">THỜI GIAN CÔNG KHAI</p>
                  <p className="text-sm font-medium text-slate-800">{formatDate(requestData.publishDetails?.publishDate)}</p>
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
