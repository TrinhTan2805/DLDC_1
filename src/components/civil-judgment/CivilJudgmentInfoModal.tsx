import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CivilJudgmentInfoSearchFilter } from './CivilJudgmentInfoSearchFilter';
import { CivilJudgmentInfoTable, CivilJudgmentRecord } from './CivilJudgmentInfoTable';
import { BTN_OUTLINE, BTN_GHOST_ICON, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../pages/collection/collectionUi';

interface CivilJudgmentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  datasetId?: string;
  isInline?: boolean;
}

const mockDatasetsRecords: Record<string, CivilJudgmentRecord[]> = {
  // 1: Yêu cầu thi hành án
  '1': [
    { id: '1', name: 'Nguyễn Văn Hùng', type: 'Cá nhân yêu cầu', number: 'YC-2025-001', date: '10/01/2025', address: 'Cục THADS Hà Nội', status: 'Đã tiếp nhận', syncDate: '19/12/2025 15:30:00', details: { 'Mã hồ sơ': 'YC-2025-001', 'Người yêu cầu': 'Nguyễn Văn Hùng', 'Cơ quan tiếp nhận': 'Cục THADS Hà Nội', 'Nội dung yêu cầu': 'Thi hành bản án dân sự số 12/2024/DS-ST' } },
    { id: '2', name: 'Trần Thị Thu', type: 'Cá nhân yêu cầu', number: 'YC-2025-002', date: '12/01/2025', address: 'Cục THADS TP.HCM', status: 'Đã tiếp nhận', syncDate: '19/12/2025 15:30:02', details: { 'Mã hồ sơ': 'YC-2025-002', 'Người yêu cầu': 'Trần Thị Thu', 'Cơ quan tiếp nhận': 'Cục THADS TP.HCM', 'Nội dung yêu cầu': 'Thi hành bản án hôn nhân gia đình' } },
  ],
  // 2: Quyết định thi hành án
  '2': [
    { id: '1', name: 'QĐ thi hành án theo yêu cầu số 45/QĐ-THADS', type: 'Theo yêu cầu', number: 'QĐ-2025-045', date: '15/01/2025', address: 'Cục THADS Hà Nội', status: 'Đang thi hành', syncDate: '19/12/2025 15:35:00', details: { 'Số quyết định': 'QĐ-2025-045', 'Chấp hành viên': 'Nguyễn Văn A', 'Cơ quan ban hành': 'Cục THADS Hà Nội' } },
    { id: '2', name: 'QĐ thi hành án chủ động số 46/QĐ-THADS', type: 'Chủ động', number: 'QĐ-2025-046', date: '18/01/2025', address: 'Cục THADS TP.HCM', status: 'Đang thi hành', syncDate: '19/12/2025 15:35:05', details: { 'Số quyết định': 'QĐ-2025-046', 'Chấp hành viên': 'Trần Thị B', 'Cơ quan ban hành': 'Cục THADS TP.HCM' } },
  ],
  // 3: Đối tượng THA
  '3': [
    { id: '1', name: 'Lê Văn Cường', type: 'Người phải THA', number: '001090123456', date: '20/01/2025', address: 'Quận Cầu Giấy, Hà Nội', status: 'Đang xác minh', syncDate: '19/12/2025 15:40:00', details: { 'Số CCCD': '001090123456', 'Vai trò': 'Người phải thi hành án', 'Nghĩa vụ': 'Phải trả số tiền 500.000.000 VNĐ' } },
    { id: '2', name: 'Hoàng Thị Duyên', type: 'Người được THA', number: '079192654321', date: '22/01/2025', address: 'Quận 1, TP.HCM', status: 'Đã nhận một phần', syncDate: '19/12/2025 15:40:05', details: { 'Số CCCD': '079192654321', 'Vai trò': 'Người được thi hành án', 'Quyền lợi': 'Được nhận số tiền 500.000.000 VNĐ' } },
  ]
};

const defaultMockRecords: CivilJudgmentRecord[] = [
  { id: '1', name: 'Hồ sơ YCTHA số 01', type: 'Yêu cầu THA', number: 'THADS-001', date: '15/01/2025', status: 'Hoạt động', syncDate: '19/12/2025 15:30:00' },
  { id: '2', name: 'Hồ sơ YCTHA số 02', type: 'Yêu cầu THA', number: 'THADS-002', date: '18/01/2025', status: 'Hoạt động', syncDate: '19/12/2025 15:30:02' },
];

export function CivilJudgmentInfoModal({
  isOpen,
  onClose,
  title,
  datasetId = '1',
  isInline = false
}: CivilJudgmentInfoModalProps) {
  const [selectedRecord, setSelectedRecord] = useState<CivilJudgmentRecord | null>(null);
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

  const totalRecords = 860;

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
              Thuộc đơn vị: <span className="font-semibold text-[#020817]">Cục Quản lý thi hành án dân sự</span>
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
                  Thuộc đơn vị: <span className="font-semibold text-[#020817]">Cục Quản lý thi hành án dân sự</span>
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
              <CivilJudgmentInfoSearchFilter
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterConditions={filterConditions}
                setFilterConditions={setFilterConditions}
                onRefresh={() => {}}
                isInline={isInline}
              />

              {/* Table Container */}
              <div className={isInline ? "bg-white border border-[#E2E8F0] rounded-lg flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                <CivilJudgmentInfoTable
                  records={filteredRecords}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalRecords={totalRecords}
                  onViewRecord={(record) => setSelectedRecord(record)}
                  colNameLabel="Tên hồ sơ / Đối tượng"
                  colTypeLabel="Phân loại / Trạng thái"
                  colNumberLabel="Số QĐ / Mã hồ sơ"
                  colDateLabel="Ngày cập nhật"
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
              <h3 className="text-[16px] font-medium text-[#020817]">Chi tiết bản ghi Thi hành án dân sự</h3>
              <button onClick={() => setSelectedRecord(null)} aria-label="Đóng chi tiết" title="Đóng chi tiết" className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Tên / Đối tượng</div>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.name || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Số QĐ / Mã hồ sơ</div>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.number || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Ngày cập nhật</div>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.date || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Thời gian đồng bộ</div>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.syncDate || '19/12/2025 15:30:00'}</div>
                </div>
              </div>

              {selectedRecord.details && (
                <div className="border-t border-[#E2E8F0] pt-4">
                  <h4 className={SECTION_TITLE}>Thông tin chi tiết hồ sơ THADS</h4>
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
