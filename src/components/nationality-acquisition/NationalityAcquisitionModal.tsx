import React, { useState } from 'react';
import { X, Search, Filter, Download, FileDown, XCircle, CheckCircle, AlertCircle, Eye, RefreshCw, Calendar, ArrowUp, Plus, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { NationalityAcquisitionSearchFilter } from './NationalityAcquisitionSearchFilter';
import { NationalityAcquisitionTable } from './NationalityAcquisitionTable';

interface NationalityAcquisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isInline?: boolean;
}

export function NationalityAcquisitionModal({ 
  isOpen, 
  onClose, 
  title,
  isInline = false
}: NationalityAcquisitionModalProps) {
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (!isOpen && !isInline) return null;

  // Mock data
  const records = [
    { 
      id: '1', 
      name: 'Nguyễn Văn An', 
      birthDate: '15/05/1985', 
      oldNationality: 'Mỹ', 
      decisionNo: 'QT-2023-00123', 
      registrationDate: '15/05/2023', 
      status: 'Hợp lệ',
      syncDate: '19/12/2025 15:30:00',
      birthPlace: 'Hà Nội',
      ethnicity: 'Kinh',
      personalId: '001234567890',
    },
    { 
      id: '2', 
      name: 'Trần Thị Bình', 
      birthDate: '20/08/1990', 
      oldNationality: 'Pháp', 
      decisionNo: 'QT-2023-00124', 
      registrationDate: '20/05/2023', 
      status: 'Hợp lệ',
      syncDate: '19/12/2025 15:30:02',
      birthPlace: 'TP. Hồ Chí Minh',
      ethnicity: 'Kinh',
      personalId: '001234567891',
    },
    { 
      id: '3', 
      name: 'Lê Văn Cường', 
      birthDate: '10/06/1987', 
      oldNationality: 'Hàn Quốc', 
      decisionNo: 'QT-2023-00125', 
      registrationDate: '10/06/2023', 
      status: 'Hợp lệ',
      syncDate: '19/12/2025 15:30:05',
      birthPlace: 'Đà Nẵng',
      ethnicity: 'Kinh',
      personalId: '001234567892',
    },
  ];

  const totalRecords = 125;

  return (
    <>
      {/* Backdrop */}
      {!isInline && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Container */}
      <div className={isInline ? "w-full flex flex-col" : "fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"}>
        {isInline && (
          <div className="flex items-center justify-between mb-0">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          </div>
        )}

        <div className={isInline ? "flex flex-col flex-1" : "bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] pointer-events-auto flex flex-col"}>
          {/* Header */}
          {!isInline && (
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-white sticky top-0 z-20 rounded-t-lg">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
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

          {/* Content Area */}
          <div className={`flex-1 overflow-hidden flex flex-col ${isInline ? '' : 'bg-white rounded-b-lg'}`}>
            <div className="flex-1 flex flex-col overflow-hidden">
              <NationalityAcquisitionSearchFilter
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterConditions={filterConditions}
                setFilterConditions={setFilterConditions}
                onExport={() => alert('Đang kết xuất...')}
                onRefresh={() => {}}
                isInline={isInline}
              />

              <div className={isInline ? "bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                <NationalityAcquisitionTable
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

      {/* Record Detail Modal */}
      {selectedRecord && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" onClick={() => setSelectedRecord(null)}></div>
          
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Chi tiết bản ghi</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Đóng chi tiết"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-0 flex-1 overflow-auto bg-slate-50/30 text-slate-900">
                <div className="p-6 space-y-6">
                  {/* Section: Thông tin hồ sơ */}
                  <section>
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                      Thông tin hồ sơ
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Số quyết định</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.decisionNo || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày cấp</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.registrationDate || '-'}</div>
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

                  {/* Section: Thông tin cá nhân */}
                  <section>
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                      Thông tin cá nhân
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Họ và tên</div>
                        <div className="text-sm text-slate-900 font-bold">{selectedRecord.name || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày sinh</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.birthDate || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Dân tộc</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.ethnicity || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Quốc tịch cũ</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.oldNationality || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Số định danh</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.personalId || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Nơi sinh</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.birthPlace || '-'}</div>
                      </div>
                    </div>
                  </section>

                  {/* Section: Thông tin đồng bộ */}
                  <section>
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                      Thông tin đồng bộ
                    </h4>
                    <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày đồng bộ</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.syncDate || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Hệ thống nguồn</div>
                        <div className="text-sm text-slate-900 font-medium">HT quản lý hồ sơ QT</div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Footer */}
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
