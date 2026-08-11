import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SecurityMeasuresInfoSearchFilter } from './SecurityMeasuresInfoSearchFilter';
import { SecurityMeasuresInfoTable, SecurityMeasuresRecord } from './SecurityMeasuresInfoTable';

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
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      <div className={isInline ? "w-full flex-1 flex flex-col min-h-0" : "fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"}>
        {isInline && (
          <div className="flex flex-col mb-4">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500 mt-1">
              Tích hợp: {title}.
              <br />
              Thuộc đơn vị: Cục Đăng ký quốc gia giao dịch bảo đảm và BTNN.
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
                  Thuộc đơn vị: Cục Đăng ký quốc gia giao dịch bảo đảm và BTNN.
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
              <SecurityMeasuresInfoSearchFilter
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterConditions={filterConditions}
                setFilterConditions={setFilterConditions}
                onRefresh={() => {}}
                isInline={isInline}
              />

              <div className={isInline ? "bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
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

      {/* Record Detail Modal Popup */}
      {selectedRecord && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" onClick={() => setSelectedRecord(null)}></div>
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Chi tiết bản ghi Biện pháp bảo đảm</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Đóng chi tiết"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-800">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Họ và tên / Đơn vị</span>
                    <span className="font-bold text-slate-900 text-base">{selectedRecord.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Số đăng ký</span>
                    <span className="font-mono font-bold text-blue-600">{selectedRecord.regNo}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Ngày đăng ký</span>
                    <span className="font-mono text-slate-700">{selectedRecord.regDate}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Đơn vị chia sẻ</span>
                    <span className="font-medium text-slate-700">{selectedRecord.agency || 'Cục Đăng ký quốc gia giao dịch bảo đảm'}</span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                  <h4 className="font-bold text-slate-700 border-b border-slate-100 pb-2 text-xs uppercase tracking-wider">Thông tin chi tiết hồ sơ GDBĐ</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <span className="text-xs text-slate-500 font-medium">Mã hồ sơ:</span>
                      <p className="font-semibold text-slate-800 font-mono">{selectedRecord.recordCode || '-'}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs text-slate-500 font-medium">Số quyển / Trang:</span>
                      <p className="font-semibold text-slate-800 font-mono">{selectedRecord.bookNumber ? `${selectedRecord.bookNumber} / ${selectedRecord.pageNumber}` : '-'}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs text-slate-500 font-medium">Người thực hiện:</span>
                      <p className="font-semibold text-slate-800">{selectedRecord.performer || '-'}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs text-slate-500 font-medium">Số định danh / Mã ĐK:</span>
                      <p className="font-semibold text-slate-800 font-mono">{selectedRecord.personalId || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
