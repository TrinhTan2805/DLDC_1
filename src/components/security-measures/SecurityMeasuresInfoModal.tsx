import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SecurityMeasuresInfoSearchFilter } from './SecurityMeasuresInfoSearchFilter';
import { SecurityMeasuresInfoTable, SecurityMeasuresRecord } from './SecurityMeasuresInfoTable';
import { BTN_OUTLINE, BTN_GHOST_ICON, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../pages/collection/collectionUi';

interface SecurityMeasuresInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  datasetId?: string;
  isInline?: boolean;
}

const mockDatasetsRecords: Record<string, SecurityMeasuresRecord[]> = {
  '1': [
    { id: '1', name: 'Nguyễn Văn An', gender: 'Nam', birthDate: '15/05/1985', regNo: '001234/2025', regDate: '15/05/2025', status: 'Đã phê duyệt', recordCode: 'BPBD-2025-001234', bookNumber: '01', pageNumber: '22', performer: 'Hoàng Quốc Việt', personalId: '001234567890', nationality: 'Việt Nam', agency: 'Cục Đăng ký quốc gia giao dịch bảo đảm' },
    { id: '2', name: 'Trần Thị Bình', gender: 'Nữ', birthDate: '20/08/1990', regNo: '001235/2025', regDate: '20/08/2025', status: 'Đã phê duyệt', recordCode: 'BPBD-2025-001235', bookNumber: '01', pageNumber: '23', performer: 'Hoàng Quốc Việt', personalId: '001234567891', nationality: 'Việt Nam', agency: 'Cục Đăng ký quốc gia giao dịch bảo đảm' },
    { id: '3', name: 'Lê Văn Cường', gender: 'Nam', birthDate: '10/12/1995', regNo: '001236/2025', regDate: '12/12/2025', status: 'Đã phê duyệt', recordCode: 'BPBD-2025-001236', bookNumber: '01', pageNumber: '24', performer: 'Phạm Thị Lan', personalId: '001234567892', nationality: 'Việt Nam', agency: 'Cục Đăng ký quốc gia giao dịch bảo đảm' },
  ],
  '2': [
    { id: '1', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)', gender: 'Tổ chức', birthDate: '-', regNo: 'BBB-2025-001', regDate: '10/01/2025', status: 'Đã phê duyệt', recordCode: 'BPBD-2025-002100', bookNumber: '02', pageNumber: '05', performer: 'Nguyễn Văn Tuấn', personalId: '0101234567', nationality: 'Việt Nam', agency: 'Chi nhánh đăng ký GDBĐ Hà Nội' },
    { id: '2', name: 'Ngân hàng TMCP Quân Đội (MBBank)', gender: 'Tổ chức', birthDate: '-', regNo: 'BBB-2025-002', regDate: '14/01/2025', status: 'Đã phê duyệt', recordCode: 'BPBD-2025-002101', bookNumber: '02', pageNumber: '06', performer: 'Nguyễn Văn Tuấn', personalId: '0101234568', nationality: 'Việt Nam', agency: 'Chi nhánh đăng ký GDBĐ TP.HCM' },
  ]
};

const defaultMockRecords: SecurityMeasuresRecord[] = [
  { id: '1', name: 'Nguyễn Văn An', gender: 'Nam', birthDate: '15/05/1985', regNo: '001234/2025', regDate: '15/05/2025', status: 'Đã phê duyệt', recordCode: 'BPBD-2025-001234', agency: 'Cục Đăng ký quốc gia giao dịch bảo đảm' },
  { id: '2', name: 'Trần Thị Bình', gender: 'Nữ', birthDate: '20/08/1990', regNo: '001235/2025', regDate: '20/08/2025', status: 'Đã phê duyệt', recordCode: 'BPBD-2025-001235', agency: 'Cục Đăng ký quốc gia giao dịch bảo đảm' },
];

export function SecurityMeasuresInfoModal({
  isOpen,
  onClose,
  title,
  datasetId = '1',
  isInline = false
}: SecurityMeasuresInfoModalProps) {
  const [selectedRecord, setSelectedRecord] = useState<SecurityMeasuresRecord | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');

  if (!isOpen && !isInline) return null;

  const records = mockDatasetsRecords[datasetId] || defaultMockRecords;
  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(searchText.toLowerCase()) ||
    r.regNo.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalRecords = 5224;

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
              Thuộc đơn vị: <span className="font-semibold text-[#020817]">Cục Đăng ký quốc gia giao dịch bảo đảm và BTNN</span>
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
                  Thuộc đơn vị: <span className="font-semibold text-[#020817]">Cục Đăng ký quốc gia giao dịch bảo đảm và BTNN</span>
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
              <SecurityMeasuresInfoSearchFilter
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterConditions={filterConditions}
                setFilterConditions={setFilterConditions}
                onRefresh={() => {}}
                isInline={isInline}
              />

              {/* Table Container */}
              <div className={isInline ? "bg-white border border-[#E2E8F0] rounded-lg flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                <SecurityMeasuresInfoTable
                  records={filteredRecords}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalRecords={totalRecords}
                  onViewRecord={(record) => setSelectedRecord(record)}
                  colNameLabel="Họ và tên / Bên bảo đảm"
                  colTypeLabel="Phân loại"
                  colNumberLabel="Số đăng ký"
                  colDateLabel="Ngày đăng ký"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Chi tiết bản ghi */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedRecord(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0 bg-white">
              <h3 className="text-[16px] font-semibold text-[#020817]">Chi tiết bản ghi Biện pháp bảo đảm</h3>
              <button onClick={() => setSelectedRecord(null)} aria-label="Đóng chi tiết" title="Đóng chi tiết" className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Họ và tên / Đơn vị</div>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.name || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Số đăng ký</div>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.regNo || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Ngày đăng ký</div>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.regDate || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Đơn vị chia sẻ</div>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.agency || 'Cục Đăng ký quốc gia giao dịch bảo đảm'}</div>
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-4">
                <h4 className={SECTION_TITLE}>Thông tin chi tiết hồ sơ GDBĐ</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Mã hồ sơ</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.recordCode || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Số quyển / Trang</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.bookNumber ? `${selectedRecord.bookNumber} / ${selectedRecord.pageNumber}` : '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Người thực hiện</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.performer || '-'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className={FIELD_LABEL}>Số định danh / Mã ĐK</div>
                    <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.personalId || '-'}</div>
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
