import * as React from 'react';
import { useState } from 'react';
import { Search, Download, Filter, X } from 'lucide-react';
import {
  Badge, TruncatedText, Pagination, BTN_OUTLINE, INPUT_CLS,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, normalizeSearch, isoToDisplayDate
} from '../collection/collectionUi';

// Bảng theo compomennt.md 5.3; căn lề 5.3.3
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
// Màu badge trạng thái nhật ký (mục 5.8)
const LOG_STATUS_VARIANT: Record<string, string> = { success: 'green', warning: 'orange', error: 'red', info: 'blue' };

interface LogEntry {
  id: string;
  timestamp: string;
  packageName: string;
  packageCode: string;
  action: string;
  executor: string;
  ipAddress: string;
  details: string;
  status: 'success' | 'warning' | 'error' | 'info';
  statusText: string;
  statusColor: string;
}

export function ReconciliationLogTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'warning' | 'error'>('all');
  // Điều kiện đã áp dụng — chỉ cập nhật khi bấm Tìm kiếm / Enter (mục 5.19)
  const [applied, setApplied] = useState<{ searchTerm: string; filterStatus: 'all' | 'success' | 'warning' | 'error' }>({ searchTerm: '', filterStatus: 'all' });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const logs: LogEntry[] = [
    {
      id: 'LOG-001',
      timestamp: '2024-12-20 09:00:00',
      packageName: 'Gói tin đối soát CSDL Hộ tịch - Tháng 12/2024',
      packageCode: 'PKG003',
      action: 'Gọi gói tin',
      executor: 'admin@dldc.gov.vn',
      ipAddress: '10.0.0.50',
      details: 'Gửi gói tin thành công đến Hệ thống Hộ tịch điện tử - 850,000 bản ghi',
      status: 'success',
      statusText: 'Thành công',
      statusColor: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      id: 'LOG-002',
      timestamp: '2024-12-20 10:15:00',
      packageName: 'Gói tin đối soát CSDL Hộ tịch - Tháng 12/2024',
      packageCode: 'PKG003',
      action: 'Nhận phản hồi',
      executor: 'system@dldc.gov.vn',
      ipAddress: '203.162.10.25',
      details: 'Nhận phản hồi từ Hệ thống Hộ tịch điện tử - Xác nhận 850,000/850,000 bản ghi',
      status: 'success',
      statusText: 'Thành công',
      statusColor: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      id: 'LOG-003',
      timestamp: '2024-12-19 15:30:00',
      packageName: 'Gói tin đối soát CSDL Doanh nghiệp - Quý 4/2024',
      packageCode: 'PKG002',
      action: 'Gọi gói tin',
      executor: 'admin@dldc.gov.vn',
      ipAddress: '10.0.0.50',
      details: 'Gửi gói tin thành công đến Hệ thống Đăng ký kinh doanh - 125,000 bản ghi',
      status: 'success',
      statusText: 'Thành công',
      statusColor: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      id: 'LOG-004',
      timestamp: '2024-12-20 08:45:00',
      packageName: 'Gói tin đối soát CSDL Công chứng - Tháng 12/2024',
      packageCode: 'PKG004',
      action: 'Gọi gói tin',
      executor: 'system@dldc.gov.vn',
      ipAddress: '10.0.0.50',
      details: 'Timeout kết nối đến Hệ thống Công chứng sau 30 giây',
      status: 'error',
      statusText: 'Lỗi',
      statusColor: 'bg-red-100 text-red-700 border-red-200'
    },
    {
      id: 'LOG-005',
      timestamp: '2024-12-18 14:20:00',
      packageName: 'Gói tin đối soát CSDL Công chứng - Tháng 11/2024',
      packageCode: 'PKG001',
      action: 'Nhận phản hồi',
      executor: 'system@dldc.gov.vn',
      ipAddress: '203.162.10.30',
      details: 'Nhận phản hồi từ Hệ thống Công chứng - Xác nhận 44,910/45,000 bản ghi',
      status: 'warning',
      statusText: 'Cảnh báo',
      statusColor: 'bg-orange-100 text-orange-700 border-orange-200'
    }
  ];

  const runSearch = () => {
    setApplied({ searchTerm, filterStatus });
    setCurrentPage(1);
  };

  const filteredLogs = logs.filter(log => {
    const kw = normalizeSearch(applied.searchTerm);
    const matchesSearch = kw === '' ||
      [log.packageName, log.packageCode, log.action, log.executor, log.details].some(v => normalizeSearch(v).includes(kw));

    const matchesStatus = applied.filterStatus === 'all' || log.status === applied.filterStatus;

    return matchesSearch && matchesStatus;
  });
  const pagedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4 pt-2">
      {/* Thanh tìm kiếm & bộ lọc (mục 5.19) */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-1.5">
            <input
              aria-label="Tìm kiếm nhật ký"
              type="text"
              placeholder="Tìm kiếm log theo gói tin, hành động, người dùng..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
              className={SEARCH_INPUT_CLS}
              title="Tìm kiếm nhật ký"
            />
            <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Bộ lọc"
              aria-expanded={showFilters}
              className={filterBtnClass(showFilters)}
              title="Bộ lọc"
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>

          <button type="button" className={BTN_OUTLINE} title="Xuất nhật ký ra file">
            <Download className="w-4 h-4" />
            Xuất log
          </button>
        </div>

        {/* Vùng bộ lọc: khung xám, cách thanh tìm kiếm 15px */}
        {showFilters && (
          <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
            <div>
              <label className={FILTER_LABEL}>Trạng thái</label>
              <select
                value={filterStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as any)}
                className={INPUT_CLS}
                aria-label="Trạng thái"
                title="Lọc hồ sơ theo trạng thái"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="success">Thành công</option>
                <option value="error">Lỗi</option>
                <option value="warning">Cảnh báo</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bảng nhật ký (mục 5.3) */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC] sticky top-0 z-[1]">
              <tr className="h-[42px]">
                <th className={`${TH} text-left`}>Thời gian</th>
                <th className={`${TH} text-left`}>Gói tin</th>
                <th className={`${TH} text-left`}>Hành động</th>
                <th className={`${TH} text-left`}>Người thực hiện</th>
                <th className={`${TH} text-left`}>IP</th>
                <th className={`${TH} text-left`}>Chi tiết</th>
                <th className={`${TH} text-left`}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {pagedLogs.map((log) => {
                const [d, t] = log.timestamp.split(' ');
                return (
                <tr key={log.id} className="h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                  <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                    <div>{isoToDisplayDate(d) || d}</div>
                    {t && <div className="text-[#64748B]">{t}</div>}
                  </td>
                  <td className={`${TD} text-left max-w-[360px] leading-[18px]`}>
                    <TruncatedText text={log.packageName} />
                    <TruncatedText text={log.packageCode} className="text-[#64748B]" />
                  </td>
                  <td className={`${TD} text-left whitespace-nowrap`}>{log.action}</td>
                  <td className={`${TD} text-left whitespace-nowrap`}>{log.executor}</td>
                  <td className={`${TD} text-left whitespace-nowrap`}>{log.ipAddress}</td>
                  <td className={`${TD} text-left max-w-[360px]`}>
                    <TruncatedText text={log.details} />
                  </td>
                  <td className={`${TD} text-left whitespace-nowrap`}>
                    <Badge label={log.statusText} variant={LOG_STATUS_VARIANT[log.status] || 'slate'} />
                  </td>
                </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-16 text-center text-[13px] text-[#64748B]">
                    Không tìm thấy log nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang (mục 5.14) */}
        <Pagination
          className="border-t border-[#E2E8F0]"
          currentPage={currentPage}
          totalItems={filteredLogs.length}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </div>
    </div>
  );
}
