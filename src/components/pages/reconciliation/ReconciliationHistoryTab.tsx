import * as React from 'react';
import { useState } from 'react';
import { Search, Calendar, Filter, X } from 'lucide-react';
import {
  Badge, TruncatedText, Pagination, INPUT_CLS, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS,
  FILTER_LABEL, DATE_BOX_CLS, normalizeSearch, DateInput, isoToDisplayDate
} from '../collection/collectionUi';

// Bảng theo compomennt.md 5.3; căn lề 5.3.3 (số căn phải)
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const NUM = 'text-right tabular-nums whitespace-nowrap';

interface ReconciliationHistory {
  id: string;
  timestamp: string;
  packageName: string;
  packageCode: string;
  systemName: string;
  action: string;
  recordsSent: number;
  dataSizeSent: string;
  status: 'success' | 'failed';
  statusText: string;
  statusColor: string;
  statusVariant?: 'blue' | 'green' | 'orange' | 'red' | 'amber' | 'slate';
  details: string;
  // Các cột theo danh sách đối soát ngoài
  datasetName?: string;
  runLabel?: string;
  sourceCount?: number;
  warehouseCount?: number;
}

// Bản ghi đối soát ở danh sách ngoài — dùng để sinh lịch sử theo đúng bộ dữ liệu được chọn
interface HistorySourceRecord {
  datasetCode: string;
  datasetName: string;
  providerSystem: string;
  recordCount: number;
  receiveDate: string;
  lastReconcileDate?: string;
  status: 'matched' | 'mismatched' | 'pending' | 'error';
  statusText?: string;
  receivedCount?: number;
  sentCount?: number;
}

interface ReconciliationHistoryTabProps {
  initialSearchTerm?: string;
  hideSearchAndFilters?: boolean;
  record?: HistorySourceRecord;
}

// Ước lượng dung lượng gói tin theo số bản ghi (~2.7 KB/bản ghi) cho dữ liệu mô phỏng
const formatDataSize = (records: number) => {
  const bytes = records * 2700;
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${Math.round(bytes / 1e6)} MB`;
  return `${Math.max(1, Math.round(bytes / 1e3))} KB`;
};

// Sinh danh sách lịch sử đối soát từ bản ghi được chọn ở danh sách ngoài
const buildHistoriesFromRecord = (r: HistorySourceRecord): ReconciliationHistory[] => {
  const received = r.receivedCount ?? r.recordCount;
  const sent = r.sentCount ?? received;
  const diff = Math.abs(received - sent);
  const isError = r.status === 'error';
  const isMismatch = r.status === 'mismatched';
  const isPending = r.status === 'pending';
  const lastTs = r.lastReconcileDate || r.receiveDate;
  const cleanCode = r.datasetCode.replace(/-\d{4}(-\d{2})?$/, ''); // Mã thu thập, bỏ đuôi năm-tháng

  // Trạng thái + hành động của lần chạy đối soát mới nhất bám theo bản ghi ở danh sách ngoài
  const statusVariantMap: Record<string, 'green' | 'orange' | 'blue' | 'red'> = {
    matched: 'green',
    mismatched: 'orange',
    pending: 'blue',
    error: 'red',
  };
  const runStatus: 'success' | 'failed' = isError ? 'failed' : 'success';
  const runStatusText = r.statusText || (isError ? 'Thất bại' : 'Thành công');
  const runStatusVariant = statusVariantMap[r.status] || 'green';
  const runAction = isError ? 'Đối soát lỗi' : isPending ? 'Đang đối soát' : 'Hoàn tất đối soát';
  const runDetails = isError
    ? 'Đối soát lỗi - Hệ thống đích không phản hồi'
    : isPending
      ? 'Đang đối soát - Chờ hệ thống đích xác nhận'
      : isMismatch
        ? `Đối soát hoàn tất - Lệch ${diff.toLocaleString()} bản ghi so với nguồn`
        : `Đối soát hoàn tất - Đã nhận đủ ${received.toLocaleString()} bản ghi`;

  return [
    {
      id: `${r.datasetCode}-RUN-001`,
      timestamp: lastTs,
      packageName: `Gói tin đối soát ${r.datasetName} - Lần chạy 1`,
      packageCode: 'PKG-RUN-001',
      systemName: r.providerSystem,
      action: runAction,
      recordsSent: received,
      dataSizeSent: formatDataSize(received),
      status: runStatus,
      statusText: runStatusText,
      statusColor: '',
      statusVariant: runStatusVariant,
      details: runDetails,
      datasetName: r.datasetName,
      runLabel: cleanCode,
      sourceCount: sent,
      warehouseCount: received
    },
    {
      id: `${r.datasetCode}-RUN-002`,
      timestamp: r.receiveDate,
      packageName: `Gói tin đối soát ${r.datasetName} - Lần chạy 2`,
      packageCode: 'PKG-RUN-002',
      systemName: r.providerSystem,
      action: 'Gửi gói tin',
      recordsSent: sent,
      dataSizeSent: formatDataSize(sent),
      status: 'success',
      statusText: 'Khớp dữ liệu',
      statusColor: '',
      statusVariant: 'green',
      details: 'Gửi gói tin thành công - Đã nhận đủ bản ghi',
      datasetName: r.datasetName,
      runLabel: cleanCode,
      sourceCount: sent,
      warehouseCount: sent
    }
  ];
};

const getDatasetName = (code: string) => {
  const map: Record<string, string> = {
    'DM-GIOITINH-2024-12': 'Danh mục giới tính',
    'DM-DANTOC-2024-12': 'Danh mục dân tộc',
    'DM-QUOCGIA-2024-12': 'Danh mục quốc gia, quốc tịch',
    'DM-TONGIAO-2024-12': 'Danh mục tôn giáo',
    'DM-COQUAN-2024-12': 'Danh mục cơ quan',
    'DM-DVHC-2024-12': 'Danh mục đơn vị hành chính',
    'DM-MQHGD-2024-12': 'Danh mục mối quan hệ gia đình',
    'DM-GTTT-2024-12': 'Danh mục giấy tờ tùy thân',
  };
  return map[code] || code;
};

export function ReconciliationHistoryTab({ initialSearchTerm = '', hideSearchAndFilters = false, record }: ReconciliationHistoryTabProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed'>('all');
  const [filterSystem, setFilterSystem] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [applied, setApplied] = useState({ searchTerm: initialSearchTerm, filterStatus: 'all' as 'all' | 'success' | 'failed', filterSystem: 'all', dateFrom: '', dateTo: '' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  React.useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  const histories: ReconciliationHistory[] = record ? buildHistoriesFromRecord(record) : initialSearchTerm ? [
    {
      id: 'HIST-001',
      timestamp: '2024-12-20 10:15:00',
      packageName: `Gói tin đối soát ${getDatasetName(initialSearchTerm)} - Lần chạy 1`,
      packageCode: 'PKG-RUN-001',
      systemName: 'Trung tâm dữ liệu Quốc gia',
      action: 'Hoàn tất đối soát',
      recordsSent: 850000,
      dataSizeSent: '2.3 GB',
      status: 'success',
      statusText: 'Thành công',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      details: 'Đã nhận đủ bản ghi'
    },
    {
      id: 'HIST-002',
      timestamp: '2024-12-19 15:30:00',
      packageName: `Gói tin đối soát ${getDatasetName(initialSearchTerm)} - Lần chạy 2`,
      packageCode: 'PKG-RUN-002',
      systemName: 'Trung tâm dữ liệu Quốc gia',
      action: 'Hoàn tất đối soát',
      recordsSent: 125000,
      dataSizeSent: '1.8 GB',
      status: 'success',
      statusText: 'Thành công',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      details: 'Đã nhận đủ bản ghi'
    }
  ] : [
    {
      id: 'HIST-001',
      timestamp: '2024-12-20 10:15:00',
      packageName: 'Gói tin đối soát CSDL Hộ tịch - Tháng 12/2024',
      packageCode: 'PKG003',
      systemName: 'Hệ thống Hộ tịch điện tử',
      action: 'Hoàn tất đối soát',
      recordsSent: 850000,
      dataSizeSent: '2.3 GB',
      status: 'success',
      statusText: 'Thành công',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      details: 'Đối soát hoàn tất - Hệ thống đích xác nhận đã nhận đủ 850,000 bản ghi'
    },
    {
      id: 'HIST-002',
      timestamp: '2024-12-19 15:30:00',
      packageName: 'Gói tin đối soát CSDL Doanh nghiệp - Quý 4/2024',
      packageCode: 'PKG002',
      systemName: 'Hệ thống Đăng ký kinh doanh',
      action: 'Gửi gói tin',
      recordsSent: 125000,
      dataSizeSent: '1.8 GB',
      status: 'success',
      statusText: 'Thành công',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      details: 'Gửi gói tin thành công - Đang chờ phản hồi từ Hệ thống đích'
    },
    {
      id: 'HIST-003',
      timestamp: '2024-12-20 08:30:00',
      packageName: 'Gói tin đối soát CSDL Hộ tịch - Tháng 12/2024',
      packageCode: 'PKG003',
      systemName: 'Hệ thống Hộ tịch điện tử',
      action: 'Tạo gói tin',
      recordsSent: 850000,
      dataSizeSent: '2.3 GB',
      status: 'success',
      statusText: 'Thành công',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      details: 'Tạo gói tin đối soát thành công'
    },
    {
      id: 'HIST-004',
      timestamp: '2024-12-18 14:20:00',
      packageName: 'Gói tin đối soát CSDL Công chứng - Tháng 11/2024',
      packageCode: 'PKG001',
      systemName: 'Hệ thống Công chứng',
      action: 'Nhận phản hồi',
      recordsSent: 45000,
      dataSizeSent: '850 MB',
      status: 'success',
      statusText: 'Thành công',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      details: 'Nhận phản hồi từ hệ thống - Đối soát thành công với độ chính xác 99.8%'
    },
    {
      id: 'HIST-005',
      timestamp: '2024-12-17 09:45:00',
      packageName: 'Gói tin đối soát CSDL Hộ tịch - Tháng 11/2024',
      packageCode: 'PKG000',
      systemName: 'Hệ thống Hộ tịch điện tử',
      action: 'Hoàn tất đối soát',
      recordsSent: 820000,
      dataSizeSent: '2.1 GB',
      status: 'success',
      statusText: 'Thành công',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      details: 'Đối soát hoàn tất với 100% độ chính xác'
    }
  ];

  const filteredHistories = histories.filter(history => {
    // If search term is activeTab target, don't perform strict text matching inside packages
    const kw = normalizeSearch(applied.searchTerm);
    const matchesSearch = initialSearchTerm || kw === '' ||
      [history.packageName, history.packageCode, history.systemName, history.action].some(v => normalizeSearch(v).includes(kw));

    const matchesStatus = applied.filterStatus === 'all' || history.status === applied.filterStatus;
    const matchesSystem = applied.filterSystem === 'all' || history.systemName === applied.filterSystem;

    let matchesDate = true;
    if (applied.dateFrom || applied.dateTo) {
      const historyDate = new Date(history.timestamp.split(' ')[0]);
      if (applied.dateFrom && historyDate < new Date(applied.dateFrom)) matchesDate = false;
      if (applied.dateTo && historyDate > new Date(applied.dateTo)) matchesDate = false;
    }

    return matchesSearch && matchesStatus && matchesSystem && matchesDate;
  });

  const uniqueSystems = Array.from(new Set(histories.map(h => h.systemName)));

  const runSearch = () => {
    setApplied({ searchTerm, filterStatus, filterSystem, dateFrom, dateTo });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Thanh tìm kiếm & bộ lọc (mục 5.19) */}
      {!hideSearchAndFilters && (
        <div>
          <div className="flex items-center gap-1.5">
            <input
              aria-label="Tìm kiếm lịch sử đối soát"
              type="text"
              placeholder="Tìm kiếm lịch sử theo gói tin, hệ thống, hành động..."
              className={SEARCH_INPUT_CLS}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
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

          {showFilters && (
            <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
              <div>
                <label className={FILTER_LABEL}>Trạng thái</label>
                <select aria-label="Trạng thái" className={INPUT_CLS} value={filterStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as any)}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="success">Thành công</option>
                  <option value="failed">Thất bại</option>
                </select>
              </div>

              <div>
                <label className={FILTER_LABEL}>Hệ thống</label>
                <select aria-label="Hệ thống" className={INPUT_CLS} value={filterSystem} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterSystem(e.target.value)}>
                  <option value="all">Tất cả hệ thống</option>
                  {uniqueSystems.map(system => (
                    <option key={system} value={system}>{system}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={FILTER_LABEL}>Từ ngày</label>
                <DateInput ariaLabel="Từ ngày" value={dateFrom} onChange={setDateFrom} />
              </div>

              <div>
                <label className={FILTER_LABEL}>Đến ngày</label>
                <DateInput ariaLabel="Đến ngày" value={dateTo} onChange={setDateTo} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bảng lịch sử (mục 5.3) */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC] sticky top-0 z-[1]">
              <tr className="h-[42px]">
                <th className={`${TH} text-center w-12`}>STT</th>
                <th className={`${TH} text-left`}>Thu thập</th>
                <th className={`${TH} text-right`}>Số bản ghi (Nguồn)</th>
                <th className={`${TH} text-right`}>Số bản ghi (Kho)</th>
                <th className={`${TH} text-right`}>Lệch</th>
                <th className={`${TH} text-left`}>Trạng thái</th>
                <th className={`${TH} text-left`}>Ngày đối soát</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistories
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((history, index) => {
                  const diff = (history.warehouseCount ?? history.recordsSent) - (history.sourceCount ?? history.recordsSent);
                  const [d, t] = history.timestamp.split(' ');
                  return (
                  <tr key={history.id} className="h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                    <td className={`${TD} text-center whitespace-nowrap`}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className={`${TD} text-left max-w-[360px] leading-[18px]`}>
                      <TruncatedText text={history.datasetName ?? history.packageName} />
                      <TruncatedText text={history.runLabel ?? history.packageCode} className="text-[#64748B]" />
                    </td>
                    <td className={`${TD} ${NUM}`}>{(history.sourceCount ?? history.recordsSent).toLocaleString()}</td>
                    <td className={`${TD} ${NUM}`}>{(history.warehouseCount ?? history.recordsSent).toLocaleString()}</td>
                    <td className={`${TD} ${NUM} ${diff !== 0 ? 'text-[#DC2626] font-semibold' : ''}`}>
                      {diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString()}
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap`}>
                      <Badge label={history.statusText} variant={history.statusVariant ?? (history.status === 'success' ? 'green' : 'red')} />
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                      <div>{isoToDisplayDate(d) || d}</div>
                      {t && <div className="text-[#64748B]">{t}</div>}
                    </td>
                  </tr>
                  );
                })}
              {filteredHistories.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-16 text-center text-[13px] text-[#64748B]">
                    Không tìm thấy lịch sử đối soát
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
          totalItems={filteredHistories.length}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </div>
    </div>
  );
}
