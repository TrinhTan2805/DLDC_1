import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { NationalityInfoSearchFilter } from './NationalityInfoSearchFilter';
import { NationalityInfoTable, NationalityRecord } from './NationalityInfoTable';

interface NationalityInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  datasetId?: string;
  isInline?: boolean;
}

const mockDatasetsRecords: Record<string, NationalityRecord[]> = {
  // 1: Nhập Quốc tịch
  '1': [
    { id: '1', name: 'Nguyễn Văn An', gender: 'Nam', oldNationality: 'Mỹ', decisionNo: 'QT-2023-00123', date: '15/05/2023', address: 'Số 12, Hàng Bài, Hoàn Kiếm, Hà Nội', status: 'Hợp lệ', syncDate: '19/12/2025 15:30:00', details: { 'Số quyết định': 'QT-2023-00123', 'Ngày sinh': '15/05/1985', 'Dân tộc': 'Kinh', 'Quốc tịch cũ': 'Mỹ', 'Số định danh': '001234567890', 'Nơi sinh': 'Hà Nội' } },
    { id: '2', name: 'Trần Thị Bình', gender: 'Nữ', oldNationality: 'Pháp', decisionNo: 'QT-2023-00124', date: '20/05/2023', address: 'Số 45, Lê Lợi, Q.1, TP.HCM', status: 'Hợp lệ', syncDate: '19/12/2025 15:30:02', details: { 'Số quyết định': 'QT-2023-00124', 'Ngày sinh': '20/08/1990', 'Dân tộc': 'Kinh', 'Quốc tịch cũ': 'Pháp', 'Số định danh': '001234567891', 'Nơi sinh': 'TP.HCM' } },
    { id: '3', name: 'Lê Văn Cường', gender: 'Nam', oldNationality: 'Hàn Quốc', decisionNo: 'QT-2023-00125', date: '10/06/2023', address: 'Số 8, Nguyễn Huệ, Đà Nẵng', status: 'Hợp lệ', syncDate: '19/12/2025 15:30:05', details: { 'Số quyết định': 'QT-2023-00125', 'Ngày sinh': '10/06/1987', 'Dân tộc': 'Kinh', 'Quốc tịch cũ': 'Hàn Quốc', 'Số định danh': '001234567892', 'Nơi sinh': 'Đà Nẵng' } },
  ],
  // 2: Thôi Quốc tịch
  '2': [
    { id: '1', name: 'Phạm Văn Dũng', gender: 'Nam', newNationality: 'Đức', decisionNo: 'TQT-2024-00456', date: '12/02/2024', address: 'Phường Bến Nghé, Quận 1, TP.HCM', status: 'Đã cấp', syncDate: '19/12/2025 15:35:00', details: { 'Số quyết định': 'TQT-2024-00456', 'Ngày sinh': '01/01/1980', 'Quốc tịch mới': 'Đức', 'Nơi cư trú trước đây': 'TP.HCM' } },
    { id: '2', name: 'Hoàng Thị Em', gender: 'Nữ', newNationality: 'Úc', decisionNo: 'TQT-2024-00457', date: '18/03/2024', address: 'Phường Hàng Bạc, Q. Hoàn Kiếm, Hà Nội', status: 'Đã cấp', syncDate: '19/12/2025 15:35:05', details: { 'Số quyết định': 'TQT-2024-00457', 'Ngày sinh': '15/10/1988', 'Quốc tịch mới': 'Úc', 'Nơi cư trú trước đây': 'Hà Nội' } },
  ],
  // 3: Trở lại Quốc tịch
  '3': [
    { id: '1', name: 'Trịnh Văn Giang', gender: 'Nam', oldNationality: 'Canada', decisionNo: 'TLQT-2025-00789', date: '05/01/2025', address: 'Phường Dịch Vọng, Q. Cầu Giấy, Hà Nội', status: 'Đã cấp', syncDate: '19/12/2025 15:40:00', details: { 'Số quyết định': 'TLQT-2025-00789', 'Ngày sinh': '05/05/1975', 'Quốc tịch trước khi trở lại': 'Canada', 'Nơi ĐKTH': 'Hà Nội' } },
    { id: '2', name: 'Vũ Thị Hương', gender: 'Nữ', oldNationality: 'Nhật Bản', decisionNo: 'TLQT-2025-00790', date: '15/01/2025', address: 'Phường Tân Định, Quận 1, TP.HCM', status: 'Đã cấp', syncDate: '19/12/2025 15:40:05', details: { 'Số quyết định': 'TLQT-2025-00790', 'Ngày sinh': '12/12/1982', 'Quốc tịch trước khi trở lại': 'Nhật Bản', 'Nơi ĐKTH': 'TP.HCM' } },
  ]
};

const defaultMockRecords: NationalityRecord[] = [
  { id: '1', name: 'Nguyễn Văn An', gender: 'Nam', decisionNo: 'QT-2023-00123', date: '15/05/2023', address: 'Hà Nội', status: 'Hoạt động', syncDate: '19/12/2025 15:30:00' },
  { id: '2', name: 'Trần Thị Bình', gender: 'Nữ', decisionNo: 'QT-2023-00124', date: '20/05/2023', address: 'TP.HCM', status: 'Hoạt động', syncDate: '19/12/2025 15:30:02' },
];

export function NationalityInfoModal({
  isOpen,
  onClose,
  title,
  datasetId = '1',
  isInline = false
}: NationalityInfoModalProps) {
  const [selectedRecord, setSelectedRecord] = useState<NationalityRecord | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');

  if (!isOpen && !isInline) return null;

  const records = mockDatasetsRecords[datasetId] || defaultMockRecords;
  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(searchText.toLowerCase()) ||
    r.decisionNo.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalRecords = 125;

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
              Thuộc đơn vị: Cục Hành chính tư pháp.
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
                  Thuộc đơn vị: Cục Hành chính tư pháp.
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
              <NationalityInfoSearchFilter
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterConditions={filterConditions}
                setFilterConditions={setFilterConditions}
                onRefresh={() => {}}
                isInline={isInline}
              />

              <div className={isInline ? "bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                <NationalityInfoTable
                  records={filteredRecords}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalRecords={totalRecords}
                  onViewRecord={(record) => setSelectedRecord(record)}
                  colNameLabel="Họ và tên"
                  colTypeLabel={datasetId === '1' ? 'Quốc tịch cũ' : datasetId === '2' ? 'Quốc tịch mới' : 'Quốc tịch trước đây'}
                  colNumberLabel="Số quyết định"
                  colDateLabel="Ngày cấp"
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
                <h3 className="text-lg font-bold text-slate-900">Chi tiết hồ sơ quốc tịch</h3>
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
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Họ và tên</span>
                    <span className="font-bold text-slate-900 text-base">{selectedRecord.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Số quyết định</span>
                    <span className="font-mono font-bold text-blue-600">{selectedRecord.decisionNo}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Ngày cấp</span>
                    <span className="font-mono text-slate-700">{selectedRecord.date}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Thời gian đồng bộ</span>
                    <span className="font-mono text-slate-700">{selectedRecord.syncDate || '19/12/2025 15:30:00'}</span>
                  </div>
                </div>

                {selectedRecord.details && (
                  <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                    <h4 className="font-bold text-slate-700 border-b border-slate-100 pb-2 text-xs uppercase tracking-wider">Thông tin chi tiết hồ sơ</h4>
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
