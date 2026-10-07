import React from 'react';
import { Eye, History } from 'lucide-react';
import { TruncatedText, RowIconAction, Pagination, type ColumnDef } from '../pages/collection/collectionUi';

export interface CivilRegistryRecord {
  id: string;
  name: string;
  gender?: string;
  type?: string;
  number: string;
  date: string;
  address?: string;
  status?: string;
  syncDate?: string;
  details?: Record<string, any>;
}

interface CivilRegistryInfoTableProps {
  records: CivilRegistryRecord[];
  /** Các cột đang bật (theo Tùy chọn cột); STT và Thao tác luôn hiển thị */
  columns: ColumnDef<CivilRegistryRecord>[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  totalRecords: number;
  onViewRecord: (record: CivilRegistryRecord) => void;
  /** Mở modal Lịch sử phiên bản của bản ghi */
  onViewVersions?: (record: CivilRegistryRecord) => void;
}

// Bảng theo compomennt.md 5.3: tiêu đề 42px 700 đen nền #F8FAFC, hàng 48px kẻ #E0E0E0; căn lề 5.3.3
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
// Cột Thao tác cố định bên phải khi bảng cuộn ngang (mục 5.3.2)
const STICKY = 'sticky right-0 shadow-[-1px_0_0_#E2E8F0]';

export function CivilRegistryInfoTable({
  records,
  columns,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalRecords,
  onViewRecord,
  onViewVersions,
}: CivilRegistryInfoTableProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto bg-white custom-scrollbar">
        <table className="w-full border-collapse collection-table text-[13px]">
          <thead className="bg-[#F8FAFC] sticky top-0 z-10">
            <tr className="h-[42px]">
              <th className={`${TH} text-center w-12`}>STT</th>
              {columns.map((c) => (
                <th key={c.key} className={`${TH} text-left`}>{c.label}</th>
              ))}
              <th className={`${TH} text-center w-24 bg-[#F8FAFC] ${STICKY}`}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={record.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                <td className={`${TD} text-center whitespace-nowrap`}>
                  {((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, '0')}
                </td>
                {columns.map((c) => {
                  const v = c.render(record);
                  const text = v === undefined || v === null || v === '' ? '-' : v;
                  return c.wide ? (
                    <td key={c.key} className={`${TD} text-left max-w-[320px]`}>
                      <TruncatedText text={String(text)} />
                    </td>
                  ) : (
                    <td key={c.key} className={`${TD} text-left whitespace-nowrap`}>{text}</td>
                  );
                })}
                <td className={`${TD} text-center bg-white group-hover:bg-[#F8FAFC] ${STICKY}`}>
                  <div className="inline-flex items-center gap-1">
                    <RowIconAction label="Xem chi tiết" onClick={() => onViewRecord(record)}>
                      <Eye className="w-4 h-4" />
                    </RowIconAction>
                    {onViewVersions && (
                      <RowIconAction label="Lịch sử phiên bản" onClick={() => onViewVersions(record)}>
                        <History className="w-4 h-4" />
                      </RowIconAction>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-3 py-16 text-center text-[13px] text-[#64748B]">Không tìm thấy kết quả phù hợp</td>
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
