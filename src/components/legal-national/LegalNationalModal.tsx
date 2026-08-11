import React, { useState } from 'react';
import { X, Search, Filter, Download, FileDown, XCircle, CheckCircle, AlertCircle, Eye, RefreshCw, Calendar, ArrowUp, Plus, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { LegalNationalSearchFilter } from './LegalNationalSearchFilter';
import { LegalNationalTable } from './LegalNationalTable';

interface LegalNationalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isInline?: boolean;
}

export function LegalNationalModal({ 
  isOpen, 
  onClose, 
  title,
  isInline = false
}: LegalNationalModalProps) {
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (!isOpen && !isInline) return null;

  // Mock data for Legal Documents
  const records = [
    { 
      id: '1', 
      title: 'Luật Đất đai (Sửa đổi)', 
      number: '31/2024/QH15', 
      type: 'Luật', 
      date: '18/01/2024', 
      agency: 'Quốc hội',
      status: 'Có hiệu lực',
      syncDate: '19/12/2025 15:30:00',
    },
    { 
      id: '2', 
      title: 'Luật Các tổ chức tín dụng (Sửa đổi)', 
      number: '32/2024/QH15', 
      type: 'Luật', 
      date: '18/01/2024', 
      agency: 'Quốc hội',
      status: 'Có hiệu lực',
      syncDate: '19/12/2025 15:30:02',
    },
    { 
      id: '3', 
      title: 'Nghị định quy định về cơ chế thử nghiệm có kiểm soát trong lĩnh vực ngân hàng', 
      number: '52/2024/NĐ-CP', 
      type: 'Nghị định', 
      date: '15/05/2024', 
      agency: 'Chính phủ',
      status: 'Có hiệu lực',
      syncDate: '19/12/2025 15:30:05',
    },
  ];

  const totalRecords = 3450;

  return (
    <>
      {!isInline && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      <div className={isInline ? "w-full flex-1 flex flex-col min-h-0" : "fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"}>
        {isInline && (
          <div className="flex flex-col mb-4">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500 mt-1">
              Tích hợp: {title}.
              <br />
              Thuộc đơn vị: Cục Kiểm tra văn bản quy phạm pháp luật.
            </p>
          </div>
        )}

        <div className={isInline ? "flex flex-col flex-1 min-h-0" : "bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] pointer-events-auto flex flex-col"}>
          {!isInline && (
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-white sticky top-0 z-20 rounded-t-lg">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Tích hợp: {title}.
                  <br />
                  Thuộc đơn vị: Cục Kiểm tra văn bản quy phạm pháp luật.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className={`flex-1 overflow-hidden flex flex-col ${isInline ? '' : 'bg-white rounded-b-lg'}`}>
            <div className="flex-1 flex flex-col overflow-hidden">
              <LegalNationalSearchFilter
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterConditions={filterConditions}
                setFilterConditions={setFilterConditions}
                onExport={() => alert('Đang kết xuất...')}
                onRefresh={() => {}}
                isInline={isInline}
              />

              <div className={isInline ? "bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                <LegalNationalTable
                  records={records}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalRecords={totalRecords}
                  onViewRecord={(record) => setSelectedRecord(record)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedRecord && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" onClick={() => setSelectedRecord(null)}></div>
          
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Chi tiết văn bản</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Đóng chi tiết"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-0 flex-1 overflow-auto bg-slate-50/30 text-slate-900">
                <div className="p-6 space-y-6">
                  <section>
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                      Thông tin văn bản
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="space-y-1 col-span-full">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Tên văn bản</div>
                        <div className="text-sm text-slate-900 font-bold">{selectedRecord.title}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Số hiệu</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.number}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Loại văn bản</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.type}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày ban hành</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.date}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Cơ quan ban hành</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.agency}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Trạng thái</div>
                        <div>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                            {selectedRecord.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                      Thông tin đồng bộ
                    </h4>
                    <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày đồng bộ</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.syncDate}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Hệ thống nguồn</div>
                        <div className="text-sm text-slate-900 font-medium">CSDL quốc gia về PL</div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 flex-shrink-0 bg-white">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
