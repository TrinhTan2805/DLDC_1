import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CivilRegistryInfoSearchFilter } from './CivilRegistryInfoSearchFilter';
import { CivilRegistryInfoTable, CivilRegistryRecord } from './CivilRegistryInfoTable';

interface CivilRegistryInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  datasetId?: string;
  isInline?: boolean;
}

const mockDatasetsRecords: Record<string, CivilRegistryRecord[]> = {
  // 1: Khai sinh
  '1': [
    { id: '1', name: 'Nguyễn Văn An', gender: 'Nam', number: '123/2025', date: '15/05/2025', address: 'Số 12, Phố Huế, P. Hàng Bài, Q. Hoàn Kiếm, Hà Nội', status: 'Hợp lệ', syncDate: '19/12/2025 15:30:00', details: { 'Mã hồ sơ': 'REC-2025-001', 'Số quyển': '01/2025', 'Trang số': '15', 'Nơi sinh': 'Bệnh viện C Hà Nội', 'Dân tộc': 'Kinh', 'Quốc tịch': 'Việt Nam', 'Họ tên Cha': 'Nguyễn Văn Bình', 'Họ tên Mẹ': 'Trần Thị Cúc' } },
    { id: '2', name: 'Trần Thị Bình', gender: 'Nữ', number: '124/2025', date: '20/08/2025', address: 'Số 45, Đường Lê Lợi, Q. 1, TP. Hồ Chí Minh', status: 'Hợp lệ', syncDate: '19/12/2025 15:30:02', details: { 'Mã hồ sơ': 'REC-2025-002', 'Số quyển': '01/2025', 'Trang số': '16', 'Nơi sinh': 'Bệnh viện Từ Dũ', 'Dân tộc': 'Kinh', 'Quốc tịch': 'Việt Nam', 'Họ tên Cha': 'Trần Văn Dũng', 'Họ tên Mẹ': 'Lê Thị Em' } },
    { id: '3', name: 'Lê Văn Cường', gender: 'Nam', number: '125/2025', date: '10/03/2025', address: 'Số 8, Đường Nguyễn Huệ, TP. Đà Nẵng', status: 'Hợp lệ', syncDate: '19/12/2025 15:30:05', details: { 'Mã hồ sơ': 'REC-2025-003', 'Số quyển': '01/2025', 'Trang số': '17', 'Nơi sinh': 'Bệnh viện Phụ sản Đà Nẵng', 'Dân tộc': 'Kinh', 'Quốc tịch': 'Việt Nam', 'Họ tên Cha': 'Lê Văn Hùng', 'Họ tên Mẹ': 'Phạm Thị Lan' } },
    { id: '4', name: 'Phạm Thị Dung', gender: 'Nữ', number: '126/2025', date: '25/11/2025', address: 'Số 102, Đường Trần Phú, TP. Nha Trang', status: 'Hợp lệ', syncDate: '19/12/2025 15:30:07', details: { 'Mã hồ sơ': 'REC-2025-004', 'Số quyển': '01/2025', 'Trang số': '18', 'Nơi sinh': 'Bệnh viện Khánh Hòa', 'Dân tộc': 'Kinh', 'Quốc tịch': 'Việt Nam', 'Họ tên Cha': 'Phạm Văn Khoa', 'Họ tên Mẹ': 'Hoàng Thị Mai' } },
    { id: '5', name: 'Hoàng Văn Em', gender: 'Nam', number: '127/2025', date: '18/07/2025', address: 'Số 66, Đường Hùng Vương, TP. Cần Thơ', status: 'Hợp lệ', syncDate: '19/12/2025 15:30:10', details: { 'Mã hồ sơ': 'REC-2025-005', 'Số quyển': '01/2025', 'Trang số': '19', 'Nơi sinh': 'Bệnh viện Cần Thơ', 'Dân tộc': 'Kinh', 'Quốc tịch': 'Việt Nam', 'Họ tên Cha': 'Hoàng Văn Nam', 'Họ tên Mẹ': 'Vũ Thị Oanh' } },
  ],
  // 2: Kết hôn
  '2': [
    { id: '1', name: 'Nguyễn Văn Nam & Trần Thị Mai', type: 'Đăng ký mới', number: 'KH-456/2025', date: '20/06/2025', address: 'UBND Phường Bến Nghé, Quận 1, TP.HCM', status: 'Đã cấp', syncDate: '19/12/2025 15:35:00', details: { 'Mã hồ sơ': 'KH-2025-001', 'Số quyển': '02/2025', 'Trang số': '05', 'Chồng': 'Nguyễn Văn Nam (SN 1990)', 'Vợ': 'Trần Thị Mai (SN 1993)', 'Nơi đăng ký': 'UBND Phường Bến Nghé' } },
    { id: '2', name: 'Lê Văn Hoàng & Phạm Thị Thu', type: 'Đăng ký mới', number: 'KH-457/2025', date: '22/06/2025', address: 'UBND Phường Hàng Bạc, Q. Hoàn Kiếm, Hà Nội', status: 'Đã cấp', syncDate: '19/12/2025 15:35:05', details: { 'Mã hồ sơ': 'KH-2025-002', 'Số quyển': '02/2025', 'Trang số': '06', 'Chồng': 'Lê Văn Hoàng (SN 1988)', 'Vợ': 'Phạm Thị Thu (SN 1992)', 'Nơi đăng ký': 'UBND Phường Hàng Bạc' } },
    { id: '3', name: 'Hoàng Văn Long & Đỗ Thị Hạnh', type: 'Đăng ký mới', number: 'KH-458/2025', date: '25/06/2025', address: 'UBND Phường Thạch Thang, Q. Hải Châu, Đà Nẵng', status: 'Đã cấp', syncDate: '19/12/2025 15:35:10', details: { 'Mã hồ sơ': 'KH-2025-003', 'Số quyển': '02/2025', 'Trang số': '07', 'Chồng': 'Hoàng Văn Long (SN 1991)', 'Vợ': 'Đỗ Thị Hạnh (SN 1994)', 'Nơi đăng ký': 'UBND Phường Thạch Thang' } },
  ],
  // 3: Tình trạng hôn nhân
  '3': [
    { id: '1', name: 'Trịnh Văn Hùng', type: 'Cấp XN Độc thân', number: 'XN-789/2025', date: '10/07/2025', address: 'UBND Phường Dịch Vọng, Q. Cầu Giấy, Hà Nội', status: 'Đã cấp', syncDate: '19/12/2025 15:40:00', details: { 'Mã hồ sơ': 'XN-2025-001', 'Số CCCD': '001090123456', 'Tình trạng': 'Chưa kết hôn lần nào', 'Mục đích sử dụng': 'Làm thủ tục vay vốn ngân hàng' } },
    { id: '2', name: 'Vũ Thị Lan', type: 'Cấp XN Độc thân', number: 'XN-790/2025', date: '12/07/2025', address: 'UBND Phường Tân Định, Quận 1, TP.HCM', status: 'Đã cấp', syncDate: '19/12/2025 15:40:05', details: { 'Mã hồ sơ': 'XN-2025-002', 'Số CCCD': '079192654321', 'Tình trạng': 'Chưa kết hôn lần nào', 'Mục đích sử dụng': 'Mua bán nhà đất' } },
  ],
  // 4: Khai tử
  '4': [
    { id: '1', name: 'Nguyễn Văn Tuấn', gender: 'Nam', number: 'KT-012/2025', date: '05/04/2025', address: 'UBND Phường Kim Mã, Q. Ba Đình, Hà Nội', status: 'Đã cấp', syncDate: '19/12/2025 15:45:00', details: { 'Mã hồ sơ': 'KT-2025-001', 'Ngày mất': '03/04/2025', 'Nguyên nhân mất': 'Bệnh già', 'Nơi mất': 'Tại nhà riêng' } },
    { id: '2', name: 'Lê Thị Nga', gender: 'Nữ', number: 'KT-013/2025', date: '08/04/2025', address: 'UBND Phường Phước Long, TP. Nha Trang', status: 'Đã cấp', syncDate: '19/12/2025 15:45:05', details: { 'Mã hồ sơ': 'KT-2025-002', 'Ngày mất': '06/04/2025', 'Nguyên nhân mất': 'Bệnh tim', 'Nơi mất': 'Bệnh viện tỉnh' } },
  ]
};

const defaultMockRecords: CivilRegistryRecord[] = [
  { id: '1', name: 'Nguyễn Văn An', gender: 'Nam', number: '123/2025', date: '15/05/2025', address: 'Hà Nội', status: 'Hoạt động', syncDate: '19/12/2025 15:30:00', details: { 'Mã hồ sơ': 'REC-2025-001', 'Trạng thái': 'Đã đồng bộ thành công' } },
  { id: '2', name: 'Trần Thị Bình', gender: 'Nữ', number: '124/2025', date: '20/08/2025', address: 'TP. Hồ Chí Minh', status: 'Hoạt động', syncDate: '19/12/2025 15:30:02', details: { 'Mã hồ sơ': 'REC-2025-002', 'Trạng thái': 'Đã đồng bộ thành công' } },
  { id: '3', name: 'Lê Văn Cường', gender: 'Nam', number: '125/2025', date: '10/03/2025', address: 'Đà Nẵng', status: 'Hoạt động', syncDate: '19/12/2025 15:30:05', details: { 'Mã hồ sơ': 'REC-2025-003', 'Trạng thái': 'Đã đồng bộ thành công' } },
];

export function CivilRegistryInfoModal({
  isOpen,
  onClose,
  title,
  datasetId = '1',
  isInline = false
}: CivilRegistryInfoModalProps) {
  const [selectedRecord, setSelectedRecord] = useState<CivilRegistryRecord | null>(null);
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

  const totalRecords = 1250;

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
              <CivilRegistryInfoSearchFilter
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterConditions={filterConditions}
                setFilterConditions={setFilterConditions}
                onRefresh={() => {}}
                isInline={isInline}
              />

              {/* Table Container */}
              <div className={isInline ? "bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                <CivilRegistryInfoTable
                  records={filteredRecords}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalRecords={totalRecords}
                  onViewRecord={(record) => setSelectedRecord(record)}
                  colNameLabel={datasetId === '2' ? 'Họ tên Chồng & Vợ' : 'Họ và tên'}
                  colTypeLabel={datasetId === '2' ? 'Loại hình' : 'Giới tính'}
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
                <h3 className="text-lg font-bold text-slate-900">Chi tiết bản ghi hộ tịch</h3>
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
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Số đăng ký</span>
                    <span className="font-mono font-bold text-blue-600">{selectedRecord.number}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Ngày đăng ký</span>
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
