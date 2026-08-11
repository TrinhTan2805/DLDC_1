import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CivilLegalCenterInfoSearchFilter } from './CivilLegalCenterInfoSearchFilter';
import { CivilLegalCenterInfoTable, CivilLegalCenterRecord } from './CivilLegalCenterInfoTable';

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
  const [searchText, setSearchText] = useState('');

  if (!isOpen && !isInline) return null;

  const records = mockDatasetsRecords[datasetId] || defaultMockRecords;
  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(searchText.toLowerCase()) ||
    r.number.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalRecords = 850;

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
              Thuộc đơn vị: Vụ Hợp tác quốc tế.
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
                  Thuộc đơn vị: Vụ Hợp tác quốc tế.
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
              <CivilLegalCenterInfoSearchFilter
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterConditions={filterConditions}
                setFilterConditions={setFilterConditions}
                onRefresh={() => {}}
                isInline={isInline}
              />

              <div className={isInline ? "bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
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
        <>
          <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" onClick={() => setSelectedRecord(null)}></div>
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Chi tiết hồ sơ tương trợ tư pháp</h3>
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
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Tên hồ sơ / Vụ việc</span>
                    <span className="font-bold text-slate-900 text-base">{selectedRecord.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Phân loại</span>
                    <span className="font-semibold text-blue-600">{selectedRecord.type}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Số công văn / Mã hồ sơ</span>
                    <span className="font-mono font-bold text-slate-800">{selectedRecord.number}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Ngày đồng bộ</span>
                    <span className="font-mono text-slate-700">{selectedRecord.syncDate}</span>
                  </div>
                </div>

                {selectedRecord.details && (
                  <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                    <h4 className="font-bold text-slate-700 border-b border-slate-100 pb-2 text-xs uppercase tracking-wider">Thông tin chi tiết ủy thác tư pháp</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedRecord.details).map(([k, v]) => (
                        <div key={k} className="space-y-0.5">
                          <span className="text-xs text-slate-500 font-medium">{k}:</span>
                          <p className="font-semibold text-slate-800">{String(v)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
