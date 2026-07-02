import * as React from 'react';
import { useState } from 'react';
import { Search, Calendar, Filter, X } from 'lucide-react';
import { StatusTag } from '../../common/StatusTag';

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
    const matchesSearch = initialSearchTerm || searchTerm === '' ||
      history.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.packageCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || history.status === filterStatus;
    const matchesSystem = filterSystem === 'all' || history.systemName === filterSystem;

    let matchesDate = true;
    if (dateFrom || dateTo) {
      const historyDate = new Date(history.timestamp.split(' ')[0]);
      if (dateFrom && historyDate < new Date(dateFrom)) matchesDate = false;
      if (dateTo && historyDate > new Date(dateTo)) matchesDate = false;
    }

    return matchesSearch && matchesStatus && matchesSystem && matchesDate;
  });

  const uniqueSystems = Array.from(new Set(histories.map(h => h.systemName)));

  return (
    <div className="space-y-4 pt-4">
      {/* Filters and Actions */}
      {!hideSearchAndFilters && (
        <div className="mb-6">
        {/* Row 1: Search and Buttons */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="relative flex-1">
              <input aria-label="Input field"
                type="text"
                placeholder="Tìm kiếm lịch sử theo gói tin, hệ thống, hành động..."
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border ${
                showFilters 
                  ? 'bg-blue-50 border-blue-200 text-blue-600' 
                  : 'bg-white border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
              }`}
              title="Bộ lọc"
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Row 2: Filters (Collapsible) */}
        {showFilters && (
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-4 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
            <div className="absolute -top-2 right-[200px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>

            <div className="space-y-1.5 relative z-10">
              <label className="text-[13px] font-medium text-slate-700">Trạng thái</label>
              <select aria-label="Select box"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                value={filterStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setFilterStatus(e.target.value as any);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="success">Thành công</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>

            <div className="space-y-1.5 relative z-10">
              <label className="text-[13px] font-medium text-slate-700">Hệ thống</label>
              <select aria-label="Select box"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                value={filterSystem}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setFilterSystem(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Tất cả hệ thống</option>
                {uniqueSystems.map(system => (
                  <option key={system} value={system}>{system}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 relative z-10">
              <label className="text-[13px] font-medium text-slate-700">Từ ngày</label>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                <input aria-label="Input field"
                  type="date"
                  className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-slate-700 p-0"
                  value={dateFrom}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDateFrom(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </div>

            <div className="space-y-1.5 relative z-10">
              <label className="text-[13px] font-medium text-slate-700">Đến ngày</label>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                <input aria-label="Input field"
                  type="date"
                  className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-slate-700 p-0"
                  value={dateTo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDateTo(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
              <tr>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-12 text-[13px]">STT</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Thu thập</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Số bản ghi (Nguồn)</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Số bản ghi (Kho)</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Lệch</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Trạng thái</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Ngày đối soát</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistories
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((history, index) => (
                  <tr key={history.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                    <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 text-left text-[13px]">
                      <div className="font-medium text-slate-950 leading-snug text-[13px]">{history.datasetName ?? history.packageName}</div>
                      <div className="text-slate-500 mt-1 text-[12px] font-mono">{history.runLabel ?? history.packageCode}</div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-950 font-semibold font-mono text-[13px]">
                      {(history.sourceCount ?? history.recordsSent).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-950 font-semibold font-mono text-[13px]">
                      {(history.warehouseCount ?? history.recordsSent).toLocaleString()}
                    </td>
                    {(() => {
                      const diff = (history.warehouseCount ?? history.recordsSent) - (history.sourceCount ?? history.recordsSent);
                      return (
                        <td className={`px-4 py-3 text-center font-mono text-[13px] ${diff === 0 ? 'text-slate-500 font-medium' : 'text-rose-600 font-semibold'}`}>
                          {diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString()}
                        </td>
                      );
                    })()}
                    <td className="px-4 py-3 text-center">
                      <StatusTag
                        label={history.statusText}
                        variant={history.statusVariant ?? (history.status === 'success' ? 'green' : 'red')}
                      />
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500 font-medium font-mono whitespace-nowrap text-[13px]">
                      <div>{history.timestamp.split(' ')[0]}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{history.timestamp.split(' ')[1]}</div>
                    </td>
                  </tr>
                ))}
              {filteredHistories.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Không tìm thấy lịch sử đối soát
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 collection-pagination text-[13px]">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Hiển thị</span>
            <select aria-label="Select record count" 
              className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[13px]"
              title="Số bản ghi trên trang"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-slate-600">bản ghi/trang</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              {filteredHistories.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredHistories.length)} / {filteredHistories.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
              >
                Trước
              </button>
              
              {Array.from({ length: Math.ceil(filteredHistories.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 border rounded-lg font-medium text-[13px] transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => {
                  const totalPages = Math.ceil(filteredHistories.length / itemsPerPage);
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                disabled={currentPage === Math.ceil(filteredHistories.length / itemsPerPage) || Math.ceil(filteredHistories.length / itemsPerPage) === 0}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}