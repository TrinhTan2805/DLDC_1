import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CivilLegalCenterInfoSearchFilter } from './CivilLegalCenterInfoSearchFilter';
import { CivilLegalCenterInfoTable, CivilLegalCenterRecord } from './CivilLegalCenterInfoTable';
import { BTN_OUTLINE, BTN_GHOST_ICON, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../pages/collection/collectionUi';

interface CivilLegalCenterInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  datasetId?: string;
  isInline?: boolean;
}

const mockDatasetsRecords: Record<string, CivilLegalCenterRecord[]> = {
  // 1: Hồ sơ ủy thác tư pháp đến
  '1': [
    { id: '1', name: 'Ủy thác tống đạt giấy tờ từ Bộ Tư pháp CHLB Đức', type: 'Thêm mới', number: 'UTĐ-2025-001', date: '10/01/2025', syncDate: '19/12/2025 15:30:00', address: 'Vụ Hợp tác quốc tế - Bộ Tư pháp', status: 'Đang xử lý', details: { 'Số công văn đến': 'UTĐ-2025-001', 'Cơ quan yêu cầu nước ngoài': 'Bộ Tư pháp CHLB Đức', 'Ngày nhận': '10/01/2025', 'Tên vụ việc': 'Ủy thác tống đạt văn bản tố tụng dân sự' } },
    { id: '2', name: 'Ủy thác lấy lời khai nhân chứng từ Tòa án Seoul', type: 'Cập nhật', number: 'UTĐ-2025-002', date: '15/01/2025', syncDate: '19/12/2025 15:30:02', address: 'Vụ Hợp tác quốc tế - Bộ Tư pháp', status: 'Đã hoàn thành', details: { 'Số công văn đến': 'UTĐ-2025-002', 'Cơ quan yêu cầu nước ngoài': 'Tòa án gia đình Seoul (Hàn Quốc)', 'Ngày nhận': '15/01/2025', 'Tên vụ việc': 'Thu thập chứng cứ trong vụ án hôn nhân' } },
  ],
  // 2: Hồ sơ ủy thác tư pháp đi
  '2': [
    { id: '1', name: 'Ủy thác tống đạt quyết định của TAND TP.HCM sang Pháp', type: 'Thêm mới', number: 'UTĐI-2025-045', date: '12/01/2025', syncDate: '19/12/2025 15:35:00', address: 'Cơ quan có thẩm quyền Cộng hòa Pháp', status: 'Đã chuyển giao', details: { 'Số công văn đi': 'UTĐI-2025-045', 'Tòa án gửi yêu cầu': 'TAND TP. Hồ Chí Minh', 'Ngày chuyển': '12/01/2025', 'Quốc tịch liên quan': 'Pháp' } },
    { id: '2', name: 'Ủy thác xác minh tài sản của TAND Hà Nội sang Mỹ', type: 'Cập nhật', number: 'UTĐI-2025-046', date: '18/01/2025', syncDate: '19/12/2025 15:35:05', address: 'Bộ Tư pháp Hoa Kỳ', status: 'Đang giải quyết', details: { 'Số công văn đi': 'UTĐI-2025-046', 'Tòa án gửi yêu cầu': 'TAND TP. Hà Nội', 'Ngày chuyển': '18/01/2025', 'Quốc tịch liên quan': 'Mỹ' } },
  ]
};

const defaultMockRecords: CivilLegalCenterRecord[] = [
  { id: '1', name: 'Hồ sơ ủy thác tư pháp mẫu 01', type: 'Thêm mới', number: 'UT-2025-001', date: '10/01/2025', syncDate: '19/12/2025 15:30:00' },
  { id: '2', name: 'Hồ sơ ủy thác tư pháp mẫu 02', type: 'Cập nhật', number: 'UT-2025-002', date: '15/01/2025', syncDate: '19/12/2025 15:30:02' },
];

export function CivilLegalCenterInfoModal({
  isOpen,
  onClose,
  title,
  datasetId = '1',
  isInline = false
}: CivilLegalCenterInfoModalProps) {
  const [selectedRecord, setSelectedRecord] = useState<CivilLegalCenterRecord | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (!isOpen && !isInline) return null;

  const records = mockDatasetsRecords[datasetId] || defaultMockRecords;
  const filteredRecords = records;

  const totalRecords = 850;

  return (
    <>
      {!isInline && (
        <div className="fixed inset-0 bg-black/50 z-[100]" onClick={onClose} />
      )}

      <div className={isInline ? "w-full flex-1 flex flex-col min-h-0" : "fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"}>
        {isInline && (
          <div className="flex flex-col mb-4">
            <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">{title}</h1>
            <p className="text-[13px] text-[#64748B] mt-1 leading-5">
              Tích hợp: <span className="font-semibold text-[#020817]">{title}</span>
              <br />
              Thuộc đơn vị: <span className="font-semibold text-[#020817]">Vụ Hợp tác quốc tế</span>
            </p>
          </div>
        )}

        <div className={isInline ? "flex flex-col flex-1 min-h-0" : "bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] pointer-events-auto flex flex-col"}>
          {!isInline && (
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0 bg-white sticky top-0 z-20 rounded-t-2xl">
              <div>
                <h2 className="text-[16px] font-medium text-[#020817]">{title}</h2>
                <p className="text-[13px] text-[#64748B] mt-1 leading-5">
                  Tích hợp: <span className="font-semibold text-[#020817]">{title}</span>
                  <br />
                  Thuộc đơn vị: <span className="font-semibold text-[#020817]">Vụ Hợp tác quốc tế</span>
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
              <CivilLegalCenterInfoSearchFilter
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterConditions={filterConditions}
                setFilterConditions={setFilterConditions}
                onRefresh={() => {}}
                isInline={isInline}
              />

              <div className={isInline ? "bg-white border border-[#E2E8F0] rounded-lg flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                <CivilLegalCenterInfoTable
                  records={filteredRecords}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalRecords={totalRecords}
                  onViewRecord={(record) => setSelectedRecord(record)}
                  colNameLabel="Tên hồ sơ / Quốc gia ủy thác"
                  colTypeLabel="Phân loại"
                  colNumberLabel="Số công văn / Mã hồ sơ"
                  colSyncDateLabel="Ngày đồng bộ"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Record Detail Modal Popup */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedRecord(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0 bg-white">
              <h3 className="text-[16px] font-medium text-[#020817]">Chi tiết hồ sơ tương trợ tư pháp</h3>
              <button onClick={() => setSelectedRecord(null)} aria-label="Đóng chi tiết" title="Đóng chi tiết" className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Tên hồ sơ / Vụ việc</div>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.name || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Phân loại</div>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.type || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Số công văn / Mã hồ sơ</div>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.number || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Ngày đồng bộ</div>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.syncDate || '-'}</div>
                </div>
              </div>

              {selectedRecord.details && (
                <div className="border-t border-[#E2E8F0] pt-4">
                  <h4 className={SECTION_TITLE}>Thông tin chi tiết ủy thác tư pháp</h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {Object.entries(selectedRecord.details).map(([k, v]) => (
                      <div key={k} className="space-y-1">
                        <div className={FIELD_LABEL}>{k}</div>
                        <div className={`${FIELD_VALUE} break-words`}>{String(v ?? '') || '-'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
