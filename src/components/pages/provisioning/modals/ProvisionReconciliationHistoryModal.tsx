import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { ReconciliationProcess, ReconciliationHistoryEntry } from '../../../../data/provisionReconciliationData';
import { Badge, TruncatedText, Pagination, BTN_GHOST_ICON, BTN_OUTLINE } from '../../collection/collectionUi';

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

  // Derive reconciliation display status from an entry
  const getReconStatus = (entry: ReconciliationHistoryEntry) => {
    if (!entry.totalSent) return 'Chưa đối soát';
    return entry.discrepancies === 0 ? 'Khớp dữ liệu' : 'Không khớp';
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

  const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200 provision-reconciliation-history-modal-root">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#E2E8F0] flex-shrink-0">
          <div className="flex flex-col">
            <h2 className="text-[16px] font-semibold text-[#020817]">
              Lịch sử đối soát dữ liệu cung cấp
            </h2>
            <p className="text-[13px] text-[#64748B] mt-1 leading-5">
              Bộ dữ liệu: <span className="text-[#020817] font-medium">{getDatasetCode(process.id, process.group)}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={BTN_GHOST_ICON}
            aria-label="Đóng lịch sử đối soát"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
          <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse collection-table text-[13px]">
                <thead className="bg-[#F8FAFC]">
                  <tr className="h-[42px]">
                    <th className={`${TH} text-center w-16`}>STT</th>
                    <th className={`${TH} text-left`}>Thời gian</th>
                    <th className={`${TH} text-left`}>Đơn vị khai thác</th>
                    <th className={`${TH} text-right`}>Số bản ghi cung cấp</th>
                    <th className={`${TH} text-right`}>Số bản ghi nhận</th>
                    <th className={`${TH} text-right`}>Chênh lệch</th>
                    <th className={`${TH} text-left w-32`}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((entry, index) => {
                      const stt = (currentPage - 1) * itemsPerPage + index + 1;
                      const timeSplit = entry.runDate.split(' ');
                      const datePart = timeSplit[0];
                      const timePart = timeSplit[1] || '00:00:00';
                      const reconStatus = getReconStatus(entry);

                      return (
                        <tr key={entry.id} className="h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-3 py-1 text-[13px] text-black text-center">{stt}</td>
                          <td className="px-3 py-1 text-[13px] text-black whitespace-nowrap leading-[18px]">
                            <div>{datePart}</div>
                            <div className="text-[#64748B]">{timePart}</div>
                          </td>
                          <td className="px-3 py-1 text-[13px] text-black max-w-[360px]">
                            <TruncatedText text={entry.targetSystem} />
                          </td>
                          <td className="px-3 py-1 text-[13px] text-black text-right tabular-nums">
                            {entry.totalSent.toLocaleString()}
                          </td>
                          <td className="px-3 py-1 text-[13px] text-[#15803D] text-right tabular-nums">
                            {entry.totalMatched.toLocaleString()}
                          </td>
                          <td className={`px-3 py-1 text-[13px] text-right tabular-nums ${entry.discrepancies > 0 ? 'text-[#D97706]' : 'text-[#94A3B8]'}`}>
                            {entry.discrepancies.toLocaleString()}
                          </td>
                          <td className="px-3 py-1 text-[13px] text-black">
                            <Badge
                              label={reconStatus}
                              variant={reconStatus === 'Khớp dữ liệu' ? 'green' : reconStatus === 'Không khớp' ? 'red' : 'blue'}
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-[13px] text-[#64748B]">
                        Không tìm thấy lịch sử đối soát phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              className="border-t border-[#E2E8F0]"
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setItemsPerPage}
              pageSizeOptions={[10, 20, 50]}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>
            Đóng
          </button>
        </div>

      </div>
    </div>
    , document.body
  );
}
