import React from 'react';
import { Eye } from 'lucide-react';
import { TruncatedText, RowIconAction, Pagination, Badge } from '../pages/collection/collectionUi';

export interface CivilLegalCenterRecord {
  id: string;
  name: string;
  type: string; // Phân loại
  number: string; // Số công văn / Mã hồ sơ
  date: string; // Ngày đăng ký / Ngày đến/đi
  syncDate: string; // Ngày đồng bộ
  address?: string;
  status?: string;
  details?: Record<string, any>;
}

interface CivilLegalCenterInfoTableProps {
  records: CivilLegalCenterRecord[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  totalRecords: number;
  onViewRecord: (record: CivilLegalCenterRecord) => void;
  colNameLabel?: string;
  colTypeLabel?: string;
  colNumberLabel?: string;
  colSyncDateLabel?: string;
}

// Bảng theo compomennt.md 5.3: tiêu đề 42px 700 đen nền #F8FAFC, hàng 48px kẻ #E0E0E0; căn lề 5.3.3
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';

export function CivilLegalCenterInfoTable({
  records,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalRecords,
  onViewRecord,
  colNameLabel = 'Tên hồ sơ / Quốc gia ủy thác',
  colTypeLabel = 'Phân loại',
  colNumberLabel = 'Số công văn / Mã hồ sơ',
  colSyncDateLabel = 'Ngày đồng bộ',
}: CivilLegalCenterInfoTableProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full border-collapse collection-table text-[13px]">
          <thead className="bg-[#F8FAFC] sticky top-0 z-10">
            <tr className="h-[42px]">
              <th className={`${TH} text-center w-12`}>STT</th>
              <th className={`${TH} text-left`}>{colNameLabel}</th>
              <th className={`${TH} text-left`}>{colTypeLabel}</th>
              <th className={`${TH} text-left`}>{colNumberLabel}</th>
              <th className={`${TH} text-left`}>{colSyncDateLabel}</th>
              <th className={`${TH} text-center w-20`}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={record.id} className="h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                <td className={`${TD} text-center whitespace-nowrap`}>
                  {((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, '0')}
                </td>
                <td className={`${TD} text-left max-w-[360px]`}>
                  <TruncatedText text={record.name} />
                </td>
                <td className={`${TD} text-left whitespace-nowrap`}>
                  <Badge
                    label={record.type}
                    variant={record.type.includes('Mới') || record.type.includes('mới') ? 'blue' : 'green'}
                  />
                </td>
                <td className={`${TD} text-left whitespace-nowrap`}>{record.number}</td>
                <td className={`${TD} text-left whitespace-nowrap`}>{record.syncDate}</td>
                <td className={`${TD} text-center`}>
                  <RowIconAction label="Xem chi tiết" onClick={() => onViewRecord(record)}>
                    <Eye className="w-4 h-4" />
                  </RowIconAction>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-16 text-center text-[13px] text-[#64748B]">Không tìm thấy kết quả phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang (mục 5.14) */}
      <Pagination
        className="border-t border-[#E2E8F0]"
        currentPage={currentPage}
        totalItems={totalRecords}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setItemsPerPage}
      />
    </div>
  );
}
