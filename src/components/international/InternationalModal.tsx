import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { InternationalSearchFilter } from './InternationalSearchFilter';
import { InternationalTable } from './InternationalTable';
import { BTN_OUTLINE, BTN_GHOST_ICON, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE, Badge } from '../pages/collection/collectionUi';

interface InternationalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isInline?: boolean;
}

export function InternationalModal({ 
  isOpen, 
  onClose, 
  title,
  isInline = false
}: InternationalModalProps) {
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (!isOpen && !isInline) return null;

  // Mock data for International
  const records = [
    { 
      id: '1', 
      name: 'Điều ước quốc tế về tương trợ tư pháp giữa Việt Nam và Quốc gia A', 
      partner: 'Quốc gia A', 
      number: 'ĐUQT-123/2023', 
      date: '15/05/2023', 
      status: 'Hiệu lực',
      syncDate: '19/12/2025 15:30:00',
    },
    { 
      id: '2', 
      name: 'Dự án Hỗ trợ cải cách tư pháp - Giai đoạn 2', 
      partner: 'Ngân hàng Thế giới (WB)', 
      number: 'DA-456/2023', 
      date: '20/06/2023', 
      status: 'Đang thực hiện',
      syncDate: '19/12/2025 15:30:02',
    },
    { 
      id: '3', 
      name: 'Chuyên gia tư vấn pháp luật quốc tế Nguyễn Văn C', 
      partner: 'Việt Nam', 
      number: 'CG-789/2023', 
      date: '10/07/2023', 
      status: 'Đang công tác',
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
          </div>
        )}

        <div className={isInline ? "flex flex-col flex-1 min-h-0" : "bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] pointer-events-auto flex flex-col"}>
          {!isInline && (
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0 bg-white sticky top-0 z-20 rounded-t-2xl">
              <div>
                <h2 className="text-[16px] font-medium text-[#020817]">{title}</h2>
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
              <InternationalSearchFilter
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterConditions={filterConditions}
                setFilterConditions={setFilterConditions}
                onExport={() => toast.info('Đang kết xuất...')}
                onRefresh={() => {}}
                isInline={isInline}
              />

              <div className={isInline ? "bg-white border border-[#E2E8F0] rounded-lg flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                <InternationalTable
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

      {/* Modal Chi tiết bản ghi (mục 5.4, 5.17) */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedRecord(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0 bg-white">
              <h3 className="text-[16px] font-medium text-[#020817]">Chi tiết thông tin</h3>
              <button onClick={() => setSelectedRecord(null)} aria-label="Đóng chi tiết" title="Đóng chi tiết" className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-6">
              <div>
                <h4 className={SECTION_TITLE}>Thông tin hồ sơ</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1 col-span-2">
                    <div className={FIELD_LABEL}>Tên điều ước / Thỏa thuận / Dự án</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.name || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Đối tác / Quốc gia</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.partner || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Số hiệu / Mã số</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.number || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Ngày thực hiện</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.date || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Trạng thái</div>
                    <div className={FIELD_VALUE}>
                      {selectedRecord.status ? <Badge label={selectedRecord.status} variant="green" /> : '-'}
                    </div>
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
                    <div className={`${FIELD_VALUE} break-words`}>CSDL Hợp tác quốc tế</div>
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
