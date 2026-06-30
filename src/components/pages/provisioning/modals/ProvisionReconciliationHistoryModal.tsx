import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, History, Calendar } from 'lucide-react';
import { ReconciliationProcess, ReconciliationHistoryEntry } from '../../../../data/provisionReconciliationData';

interface ProvisionReconciliationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: ReconciliationProcess;
  historyData: ReconciliationHistoryEntry[];
}

export function ProvisionReconciliationHistoryModal({ isOpen, onClose, process, historyData }: ProvisionReconciliationHistoryModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (!isOpen) return null;

  // Format received records capacity dynamically
  const getDungLuong = (totalSent: number) => {
    if (totalSent > 500000) return (totalSent * 0.0000025).toFixed(1) + ' GB';
    return (totalSent * 0.002).toFixed(1) + ' MB';
  };

  // Generate dynamic dataset code from process
  const getDatasetCode = (id: string, group: string) => {
    const cleanGroup = group
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .substring(0, 10);
    return `DM-${cleanGroup || 'DATA'}-${id}`;
  };

  // Pagination logic
  const totalItems = historyData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedData = historyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 provision-reconciliation-history-modal-root">
      <style dangerouslySetInnerHTML={{__html: `
        .provision-reconciliation-history-modal-root *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(svg):not(path):not(circle):not(rect):not(polyline):not(line) {
          font-size: 13px !important;
        }
      `}} />
      <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-5xl flex flex-col border border-slate-200 overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex flex-col">
            <h2 className="text-[18px] font-bold text-slate-800" style={{ fontSize: '18px' }}>
              Lịch sử đối soát dữ liệu cung cấp
            </h2>
            <p className="text-[13px] text-slate-500 font-medium mt-1">
              Bộ dữ liệu: <span className="text-slate-800 font-semibold">{getDatasetCode(process.id, process.group)}</span>
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-tight whitespace-nowrap">
                  <th className="py-3 px-4 font-semibold text-center w-16">STT</th>
                  <th className="py-3 px-4 font-semibold">Thời gian</th>
                  <th className="py-3 px-4 font-semibold">Tiến trình đối soát</th>
                  <th className="py-3 px-4 font-semibold">Hệ thống đích</th>
                  <th className="py-3 px-4 font-semibold">Hành động</th>
                  <th className="py-3 px-4 font-semibold text-right">Số bản ghi đã gửi</th>
                  <th className="py-3 px-4 font-semibold text-right">Dung lượng đã gửi</th>
                  <th className="py-3 px-4 font-semibold text-center w-32">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedData.length > 0 ? (
                  paginatedData.map((entry, index) => {
                    const stt = (currentPage - 1) * itemsPerPage + index + 1;
                    const runNumber = totalItems - stt + 1; // Display running numbers in reverse order or standard
                    const timeSplit = entry.runDate.split(' ');
                    const datePart = timeSplit[0];
                    const timePart = timeSplit[1] || '00:00:00';

                    return (
                      <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 text-center font-medium text-slate-500">{stt}</td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-700">{datePart}</span>
                            <span className="text-[12px] text-slate-400 mt-0.5">{timePart}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">
                              Tiến trình đối soát {process.group} - Lần chạy {runNumber}
                            </span>
                            <span className="text-[12px] text-slate-500 mt-0.5 font-mono">
                              PKG-RUN-{String(runNumber).padStart(3, '0')}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">{entry.targetSystem}</td>
                        <td className="py-3.5 px-4 text-slate-600">Hoàn tất đối soát</td>
                        <td className="py-3.5 px-4 text-right font-medium text-slate-800">
                          {entry.totalMatched.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-slate-800">
                          {getDungLuong(entry.totalSent)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium border whitespace-nowrap ${
                            entry.status === 'Thành công'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : entry.status === 'Cảnh báo'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      Không tìm thấy lịch sử đối soát phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination inside table block */}
            <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Hiển thị</span>
                <select 
                  aria-label="Select record count per page"
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[13px] cursor-pointer font-medium"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-slate-600">bản ghi/trang</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-slate-600">
                  {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                  >
                    Trước
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 border rounded-lg font-medium text-[13px] transition-colors cursor-pointer ${
                        currentPage === page
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                    disabled={currentPage === totalPages || totalItems === 0}
                    className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold transition-colors shadow-sm cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
    , document.body
  );
}
