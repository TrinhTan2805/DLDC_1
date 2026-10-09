import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { LegalNationalSearchFilter } from './LegalNationalSearchFilter';
import { LegalNationalTable } from './LegalNationalTable';
import { Badge, BTN_OUTLINE, BTN_GHOST_ICON, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../pages/collection/collectionUi';

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
          className="fixed inset-0 bg-black/50 z-[100]"
          onClick={onClose}
        />
      )}
      
      <div className={isInline ? "w-full flex-1 flex flex-col min-h-0" : "fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"}>
        {isInline && (
          <div className="flex flex-col mb-4">
            <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">{title}</h1>
            <p className="text-[13px] text-[#64748B] mt-1 leading-5">
              Tích hợp: <span className="font-semibold text-[#020817]">{title}</span>
              <br />
              Thuộc đơn vị: <span className="font-semibold text-[#020817]">Cục Kiểm tra văn bản quy phạm pháp luật</span>
            </p>
          </div>
        )}

        <div className={isInline ? "flex flex-col flex-1 min-h-0" : "bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] pointer-events-auto flex flex-col"}>
          {!isInline && (
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0 bg-white sticky top-0 z-20 rounded-t-2xl">
              <div>
                <h2 className="text-[16px] font-semibold text-[#020817]">{title}</h2>
                <p className="text-[13px] text-[#64748B] mt-1 leading-5">
                  Tích hợp: <span className="font-semibold text-[#020817]">{title}</span>
                  <br />
                  Thuộc đơn vị: <span className="font-semibold text-[#020817]">Cục Kiểm tra văn bản quy phạm pháp luật</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className={BTN_GHOST_ICON}
                aria-label="Đóng"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className={`flex-1 overflow-hidden flex flex-col ${isInline ? '' : 'bg-white rounded-b-2xl'}`}>
            <div className="flex-1 flex flex-col overflow-hidden">
              <LegalNationalSearchFilter
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterConditions={filterConditions}
                setFilterConditions={setFilterConditions}
                onExport={() => toast.info('Đang kết xuất...')}
                onRefresh={() => {}}
                isInline={isInline}
              />

              <div className={isInline ? "bg-white border border-[#E2E8F0] rounded-lg flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedRecord(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0 bg-white">
              <h3 className="text-[16px] font-semibold text-[#020817]">Chi tiết văn bản</h3>
              <button onClick={() => setSelectedRecord(null)} aria-label="Đóng chi tiết" title="Đóng chi tiết" className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-6">
              <div>
                <h4 className={SECTION_TITLE}>Thông tin văn bản</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Tên văn bản</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.title || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Số hiệu</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.number || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Loại văn bản</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.type || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Ngày ban hành</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.date || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Cơ quan ban hành</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.agency || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Trạng thái</div>
                    <div>{selectedRecord.status ? <Badge label={selectedRecord.status} variant="green" /> : '-'}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-4">
                <h4 className={SECTION_TITLE}>Thông tin đồng bộ</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Ngày đồng bộ</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.syncDate || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Hệ thống nguồn</div>
                    <div className={`${FIELD_VALUE} break-words`}>CSDL quốc gia về PL</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end flex-shrink-0">
              <button onClick={() => setSelectedRecord(null)} className={BTN_OUTLINE}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
