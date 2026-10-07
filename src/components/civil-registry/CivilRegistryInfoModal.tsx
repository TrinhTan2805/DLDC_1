import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CivilRegistryInfoSearchFilter } from './CivilRegistryInfoSearchFilter';
import { CivilRegistryInfoTable, CivilRegistryRecord } from './CivilRegistryInfoTable';
import { CivilRegistryVersionHistoryModal } from './CivilRegistryVersionHistoryModal';
import {
  BTN_OUTLINE, BTN_GHOST_ICON, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE, Badge, ColumnPicker, useVisibleColumns, type ColumnDef,
} from '../pages/collection/collectionUi';

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
  const [versionRecord, setVersionRecord] = useState<CivilRegistryRecord | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const records = mockDatasetsRecords[datasetId] || defaultMockRecords;
  const filteredRecords = records;

  // Tùy chọn cột (ẩn/hiện + sắp xếp): khai báo theo thứ tự nạp cấu trúc = thứ tự mặc định;
  // 4 cột mặc định như trước + các trường khác của bản ghi (kể cả trường trong popup chi tiết)
  const detailKeys = Array.from(new Set(records.flatMap((r) => Object.keys(r.details || {}))));
  const columnDefs: ColumnDef<CivilRegistryRecord>[] = [
    { key: 'name', label: datasetId === '2' ? 'Họ tên Chồng & Vợ' : 'Họ và tên', render: (r) => r.name, locked: true, wide: true },
    { key: 'type', label: datasetId === '2' ? 'Loại hình' : 'Giới tính', render: (r) => r.gender || r.type, defaultVisible: true },
    { key: 'number', label: 'Số đăng ký', render: (r) => r.number, defaultVisible: true },
    { key: 'date', label: 'Ngày đăng ký', render: (r) => r.date, defaultVisible: true },
    { key: 'address', label: 'Địa chỉ / Nơi đăng ký', render: (r) => r.address, wide: true },
    { key: 'status', label: 'Trạng thái', render: (r) => (r.status ? <Badge label={r.status} variant="green" /> : undefined) },
    { key: 'syncDate', label: 'Thời gian đồng bộ', render: (r) => r.syncDate },
    ...detailKeys.map((k): ColumnDef<CivilRegistryRecord> => ({ key: `detail:${k}`, label: k, render: (r) => r.details?.[k], wide: true })),
  ];
  const cols = useVisibleColumns(`dldc.columns.civil-registry.${datasetId}`, columnDefs);

  // Đặt sau mọi hook (quy tắc hook của React)
  if (!isOpen && !isInline) return null;

  const totalRecords = 1250;

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
              Thuộc đơn vị: <span className="font-semibold text-[#020817]">Cục Hành chính tư pháp</span>
            </p>
          </div>
        )}

        <div className={isInline ? "flex flex-col flex-1 min-h-0" : "bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] pointer-events-auto flex flex-col"}>
          {!isInline && (
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0 bg-white sticky top-0 z-20 rounded-t-2xl">
              <div>
                <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">{title}</h1>
                <p className="text-[13px] text-[#64748B] mt-1 leading-5">
                  Tích hợp: <span className="font-semibold text-[#020817]">{title}</span>
                  <br />
                  Thuộc đơn vị: <span className="font-semibold text-[#020817]">Cục Hành chính tư pháp</span>
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
              <CivilRegistryInfoSearchFilter
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterConditions={filterConditions}
                setFilterConditions={setFilterConditions}
                onRefresh={() => {}}
                isInline={isInline}
                columnPicker={
                  <ColumnPicker
                    columns={columnDefs}
                    order={cols.order}
                    visible={cols.visible}
                    onToggle={cols.toggle}
                    onToggleAll={cols.setAll}
                    onMove={cols.move}
                    onReset={cols.reset}
                    isDefault={cols.isDefault}
                  />
                }
              />

              {/* Table Container */}
              <div className={isInline ? "bg-white border border-[#E2E8F0] rounded-lg flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                <CivilRegistryInfoTable
                  records={filteredRecords}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalRecords={totalRecords}
                  onViewRecord={(record) => setSelectedRecord(record)}
                  onViewVersions={(record) => setVersionRecord(record)}
                  columns={cols.visibleColumns}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Lịch sử phiên bản (cột theo Tùy chọn cột đang hiển thị) */}
      {versionRecord && (
        <CivilRegistryVersionHistoryModal record={versionRecord} columns={cols.visibleColumns} onClose={() => setVersionRecord(null)} />
      )}

      {/* Modal Chi tiết bản ghi (mục 5.4, 5.17) */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedRecord(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0 bg-white">
              <h3 className="text-[16px] font-medium text-[#020817]">Chi tiết bản ghi hộ tịch</h3>
              <button onClick={() => setSelectedRecord(null)} aria-label="Đóng chi tiết" title="Đóng chi tiết" className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>{datasetId === '2' ? 'Họ tên Chồng & Vợ' : 'Họ và tên'}</div>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.name || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Số đăng ký</div>
                  <div className={FIELD_VALUE}>{selectedRecord.number || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Ngày đăng ký</div>
                  <div className={FIELD_VALUE}>{selectedRecord.date || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Thời gian đồng bộ</div>
                  <div className={FIELD_VALUE}>{selectedRecord.syncDate || '-'}</div>
                </div>
              </div>

              {selectedRecord.details && (
                <div className="border-t border-[#E2E8F0] pt-4">
                  <h4 className={SECTION_TITLE}>Thông tin chi tiết hồ sơ</h4>
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
