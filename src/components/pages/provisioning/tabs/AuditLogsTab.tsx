import React, { useState } from 'react';
import { Search, Filter, X, Eye, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Badge, RowIconAction, Pagination, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, normalizeSearch } from '../../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '';
  if (/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(dateStr)) return dateStr;
  const spaceSplit = dateStr.split(' ');
  if (spaceSplit.length === 2) {
    const [dStr, tStr] = spaceSplit;
    const dParts = dStr.split('-');
    if (dParts.length === 3) {
      return `${dParts[2]}/${dParts[1]}/${dParts[0]} ${tStr}`;
    }
  }
  const parts = dateStr.split('-');
  if (parts.length === 3 && !dateStr.includes('T') && !dateStr.includes(' ')) {
    return `${parts[2]}/${parts[1]}/${parts[0]} 08:00:00`;
  }
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      return `${day}/${month}/${year} ${h}:${m}:${s}`;
    }
  } catch (e) {}
  return dateStr;
};

const mockLogs = [
  { id: 'LOG-001', timestamp: '2026-05-25 14:23:45', ip: '192.168.12.100', status: 200, method: 'GET', endpoint: '/api/v1/hotich/list', latency: '124ms', client: 'Sở Y tế tỉnh Bắc Ninh' },
  { id: 'LOG-002', timestamp: '2026-05-25 14:21:10', ip: '10.20.30.45', status: 403, method: 'GET', endpoint: '/api/v1/hotich/list', latency: '45ms', client: 'Sở Thông tin và Truyền thông tỉnh Bắc Ninh' },
  { id: 'LOG-003', timestamp: '2026-05-25 13:15:22', ip: '172.16.8.99', status: 200, method: 'POST', endpoint: '/api/v1/thads/sync', latency: '310ms', client: 'Hệ thống THADS Quốc gia' },
  { id: 'LOG-004', timestamp: '2026-05-25 11:45:01', ip: '192.168.20.14', status: 500, method: 'GET', endpoint: '/api/v1/bpbd/get', latency: '5020ms', client: 'Cục Giao dịch bảo đảm' },
  { id: 'LOG-005', timestamp: '2026-05-24 09:30:15', ip: '192.168.12.100', status: 200, method: 'GET', endpoint: '/api/v1/hotich/list', latency: '110ms', client: 'Sở Y tế tỉnh Bắc Ninh' },
];

// Bảng (compomennt.md 5.3)
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black whitespace-nowrap';

export function AuditLogsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  // Bộ lọc ĐÃ ÁP DỤNG — chỉ đổi khi bấm "Tìm kiếm" hoặc Enter (compomennt.md 5.19)
  const [applied, setApplied] = useState({ searchTerm: '', statusFilter: 'All' });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const runSearch = () => {
    setApplied({ searchTerm, statusFilter });
    setCurrentPage(1);
  };

  const filteredLogs = mockLogs.filter(log => {
    const q = normalizeSearch(applied.searchTerm);
    const matchesSearch = normalizeSearch(log.client).includes(q) ||
                          normalizeSearch(log.endpoint).includes(q) ||
                          log.ip.includes(applied.searchTerm.trim());
    const matchesStatus = applied.statusFilter === 'All' ||
                          (applied.statusFilter === 'Success' && log.status === 200) ||
                          (applied.statusFilter === 'Error' && log.status !== 200);
    return matchesSearch && matchesStatus;
  });

  const paginatedLogs = React.useMemo(() => {
    return filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [applied]);

  const getStatusIcon = (status: number) => {
    if (status === 200) return <CheckCircle2 className="w-3.5 h-3.5" />;
    if (status === 403) return <AlertCircle className="w-3.5 h-3.5" />;
    return <XCircle className="w-3.5 h-3.5" />;
  };

  // Giữ ý nghĩa màu cũ: 200 xanh lá / 403 vàng / lỗi khác đỏ
  const getStatusVariant = (status: number) => {
    if (status === 200) return 'green';
    if (status === 403) return 'amber';
    return 'red';
  };

  return (
    <div className="space-y-4">
      {/* Tìm kiếm & bộ lọc (5.19) */}
      <div>
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <input
              type="text"
              aria-label="Tìm kiếm nhật ký khai thác"
              placeholder="Tìm kiếm theo IP, Client hoặc Endpoint..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
              className={SEARCH_INPUT_CLS}
            />
          </div>
          <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
            <Search className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Lọc nâng cao"
            title="Lọc nâng cao"
            aria-expanded={showFilters}
            onClick={() => setShowFilters(!showFilters)}
            className={filterBtnClass(showFilters)}
          >
            {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </button>
        </div>

        {showFilters && (
          <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
            <div>
              <label className={FILTER_LABEL}>Trạng thái</label>
              <select
                aria-label="Trạng thái"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`${INPUT_CLS} cursor-pointer`}
              >
                <option value="All">Tất cả trạng thái</option>
                <option value="Success">Thành công (200 OK)</option>
                <option value="Error">Lỗi (4xx, 5xx)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px] border-b border-[#E0E0E0]">
                <th className={`${TH} text-left`}>Mã Log</th>
                <th className={`${TH} text-left`}>Thời gian (Timestamp)</th>
                <th className={`${TH} text-left`}>Client / Đơn vị gọi</th>
                <th className={`${TH} text-left`}>IP Address</th>
                <th className={`${TH} text-left`}>API Endpoint</th>
                <th className={`${TH} text-left`}>Status</th>
                <th className={`${TH} text-right`}>Độ trễ</th>
                <th className={`${TH} text-center sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map(log => {
                const [datePart, timePart] = formatDateTime(log.timestamp).split(' ');
                return (
                  <tr key={log.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                    <td className={TD}>{log.id}</td>
                    <td className={`${TD} leading-[18px]`}>
                      <div>{datePart}</div>
                      {timePart && <div className="text-[#64748B]">{timePart}</div>}
                    </td>
                    <td className={TD}>{log.client}</td>
                    <td className={TD}>{log.ip}</td>
                    <td className={TD}>
                      <div className="flex items-center gap-2">
                        <Badge label={log.method} variant={log.method === 'GET' ? 'blue' : 'emerald'} />
                        <span>{log.endpoint}</span>
                      </div>
                    </td>
                    <td className={TD}>
                      <Badge label={String(log.status)} variant={getStatusVariant(log.status)} icon={getStatusIcon(log.status)} />
                    </td>
                    <td className={`${TD} text-right tabular-nums`}>{log.latency}</td>
                    <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]`}>
                      <div className="flex items-center justify-center">
                        <RowIconAction label="Xem Payload" onClick={() => {}}>
                          <Eye className="w-4 h-4" />
                        </RowIconAction>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-16 text-center text-[13px] text-[#64748B]">
                    Không tìm thấy nhật ký khai thác nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          className="border-t border-[#E2E8F0]"
          currentPage={currentPage}
          totalItems={filteredLogs.length}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>
    </div>
  );
}
