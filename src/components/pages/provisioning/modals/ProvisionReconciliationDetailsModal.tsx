import React from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, Download, FileText } from 'lucide-react';
import { ReconciliationHistoryEntry } from '../../../../../data/provisionReconciliationData';

interface ProvisionReconciliationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: ReconciliationHistoryEntry | null;
}

export function ProvisionReconciliationDetailsModal({ isOpen, onClose, entry }: ProvisionReconciliationDetailsModalProps) {
  if (!isOpen || !entry) return null;

  // Demo discrepancy data
  const discrepancyData = entry.discrepancies > 0 ? Array.from({ length: Math.min(entry.discrepancies, 5) }).map((_, i) => ({
    id: `ERR-${1000 + i}`,
    recordCode: `REC-${Math.floor(Math.random() * 1000000)}`,
    field: i % 2 === 0 ? 'Số CMND/CCCD' : 'Ngày sinh',
    sourceValue: i % 2 === 0 ? '001090123456' : '15/08/1990',
    targetValue: i % 2 === 0 ? '00109012345' : '15-08-1990',
    reason: i % 2 === 0 ? 'Thiếu ký tự' : 'Sai định dạng ngày',
  })) : [];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Chi tiết kết quả đối soát</h2>
              <p className="text-sm text-slate-500">Mã phiên: {entry.id.toUpperCase()} • Hệ thống: {entry.targetSystem}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Thời gian chạy</p>
              <p className="font-semibold text-slate-800">{entry.runDate}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Tổng số gửi đi</p>
              <p className="font-semibold text-slate-800">{entry.totalSent.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <p className="text-sm text-emerald-600 mb-1">Khớp nối thành công</p>
              <p className="font-semibold text-emerald-700">{entry.totalMatched.toLocaleString()}</p>
            </div>
            <div className={`p-4 rounded-xl border ${entry.discrepancies > 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
              <p className={`text-sm mb-1 ${entry.discrepancies > 0 ? 'text-amber-600' : 'text-slate-500'}`}>Chênh lệch</p>
              <p className={`font-semibold ${entry.discrepancies > 0 ? 'text-amber-700' : 'text-slate-800'}`}>
                {entry.discrepancies.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Details Table */}
          {entry.discrepancies > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Danh sách bản ghi chênh lệch</h3>
                  <p className="text-sm text-slate-500">Hiển thị mẫu {discrepancyData.length} bản ghi đầu tiên</p>
                </div>
                <button className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <Download className="w-4 h-4 mr-1.5" />
                  Xuất Excel
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-medium">Mã lỗi</th>
                      <th className="py-3 px-4 font-medium">Mã bản ghi (ID)</th>
                      <th className="py-3 px-4 font-medium">Trường dữ liệu</th>
                      <th className="py-3 px-4 font-medium">Giá trị nguồn</th>
                      <th className="py-3 px-4 font-medium">Giá trị đích</th>
                      <th className="py-3 px-4 font-medium">Lý do/Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {discrepancyData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-medium text-amber-600">{item.id}</td>
                        <td className="py-3 px-4 font-medium text-slate-700">{item.recordCode}</td>
                        <td className="py-3 px-4">{item.field}</td>
                        <td className="py-3 px-4 text-slate-500">{item.sourceValue}</td>
                        <td className="py-3 px-4 text-slate-500">{item.targetValue}</td>
                        <td className="py-3 px-4 text-slate-600">{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50 border border-slate-200 rounded-xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
              <h3 className="text-lg font-bold text-slate-800">Dữ liệu khớp nối 100%</h3>
              <p className="text-slate-500 mt-1">Không có bản ghi nào bị chênh lệch hay lỗi trong phiên đối soát này.</p>
            </div>
          )}
          
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  , document.body);
}
