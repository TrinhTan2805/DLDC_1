import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { MeritoriousSearchFilter } from './MeritoriousSearchFilter';
import { MeritoriousTable } from './MeritoriousTable';
import { Badge, BTN_OUTLINE, BTN_GHOST_ICON, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../pages/collection/collectionUi';

interface MeritoriousModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isInline?: boolean;
}

export function MeritoriousModal({
  isOpen,
  onClose,
  title,
  isInline = false
}: MeritoriousModalProps) {
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (!isOpen && !isInline) return null;

  // Mock data for Meritorious
  const records = [
    {
      id: '1',
      fullName: 'Trần Văn X',
      address: 'Phường A, Quận B, TP. C',
      idCard: '001203004567',
      date: '15/05/2023',
      status: 'Đã lưu',
      syncDate: '19/12/2025 15:30:00',
    },
    {
      id: '2',
      fullName: 'Nguyễn Thị Y',
      address: 'Xã D, Huyện E, Tỉnh F',
      idCard: '002203007890',
      date: '20/06/2023',
      status: 'Đã lưu',
      syncDate: '19/12/2025 15:30:02',
    },
    {
      id: '3',
      fullName: 'Phạm Văn Z',
      address: 'Phường G, Quận H, TP. I',
      idCard: '003203001234',
      date: '10/07/2023',
      status: 'Đã lưu',
      syncDate: '19/12/2025 15:30:05',
    },
  ];

  const totalRecords = 3480;

  return (
    <>
      {!isInline && (
        <div className="fixed inset-0 bg-black/50 z-[100]" onClick={onClose} />
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
                <h2 className="text-[16px] font-semibold text-[#020817]">{title}</h2>
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
              <MeritoriousSearchFilter
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterConditions={filterConditions}
                setFilterConditions={setFilterConditions}
                onExport={() => toast('Đang kết xuất...')}
                onRefresh={() => {}}
                isInline={isInline}
              />

              <div className={isInline ? "bg-white border border-[#E2E8F0] rounded-lg flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                <MeritoriousTable
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
              <h3 className="text-[16px] font-semibold text-[#020817]">Chi tiết thông tin hồ sơ</h3>
              <button onClick={() => setSelectedRecord(null)} aria-label="Đóng chi tiết" title="Đóng chi tiết" className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-6">
              <div>
                <h4 className={SECTION_TITLE}>Thông tin đối tượng</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Họ và tên</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.fullName || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Số định danh / CMND</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.idCard || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Ngày thực hiện</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.date || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Địa bàn</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.address || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Trạng thái</div>
                    <div>{selectedRecord.status ? <Badge label={selectedRecord.status} variant="green" /> : <span className={FIELD_VALUE}>-</span>}</div>
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
                    <div className={`${FIELD_VALUE} break-words`}>CSDL Người có công</div>
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
