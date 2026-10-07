import React, { useState } from 'react';
import { Settings, Search, Filter, Play, GitCompare, Calendar, History, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Eye, X, Database, Percent, Clock, List } from 'lucide-react';
import { reconciliationData, reconciliationHistoryData, ReconciliationHistoryEntry } from '../../../data/provisionReconciliationData';
import { ProvisionReconciliationDetailsModal } from './modals/ProvisionReconciliationDetailsModal';
import { ProvisionReconciliationHistoryModal } from './modals/ProvisionReconciliationHistoryModal';
import { Badge, TruncatedText, RowIconAction, Pagination, tabClass, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, DATE_BOX_CLS, normalizeSearch } from '../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;
export function ProvisionReconciliationPage({ processId }: { processId?: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<ReconciliationHistoryEntry | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const getApiName = (id: string) => {
    switch (id) {
      case '662': return 'API cung cấp dữ liệu danh mục';
      case '663': return 'API cung cấp dữ liệu Hộ tịch điện tử';
      case '664': return 'API cung cấp dữ liệu hồ sơ quốc tịch';
      case '665': return 'API cung cấp dữ liệu thi hành án dân sự';
      case '666': return 'API cung cấp dữ liệu về biện pháp bảo đảm';
      case '667': return 'API cung cấp dữ liệu quốc gia về pháp luật';
      case '668': return 'API cung cấp dữ liệu tương trợ tư pháp về dân sự';
      case '669': return 'API cung cấp dữ liệu thông tin trợ giúp pháp lý';
      case '670': return 'API cung cấp dữ liệu phổ biến, giáo dục pháp luật';
      case '671': return 'API cung cấp dữ liệu quản lý đấu giá tài sản';
      case '672': return 'API cung cấp dữ liệu Hợp tác quốc tế';
      case '673': return 'API cung cấp dữ liệu mở';
      case '674': return 'API cung cấp dữ liệu chủ';
      default: return 'API cung cấp dữ liệu';
    }
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Find the specific process
  const process = reconciliationData.find(p => p.id === processId);
  const history = processId && reconciliationHistoryData[processId] ? reconciliationHistoryData[processId] : [];

  // Derive reconciliation display status from an entry
  const getReconStatus = (entry: ReconciliationHistoryEntry) => {
    if (!entry.totalSent) return 'Chưa đối soát';
    return entry.discrepancies === 0 ? 'Khớp dữ liệu' : 'Không khớp';
  };

  // Summary cards — đếm theo SỐ DÒNG trạng thái (không phải tổng bản ghi)
  const matchedRows = history.filter(h => getReconStatus(h) === 'Khớp dữ liệu').length;
  const mismatchedRows = history.filter(h => getReconStatus(h) === 'Không khớp').length;
  const overallMatchRate = history.length > 0 ? (matchedRows / history.length) * 100 : 0;
  // Điều kiện đã áp dụng: chỉ cập nhật khi bấm Tìm kiếm hoặc Enter (mục 5.19)
  const [applied, setApplied] = useState({ searchTerm: '', status: 'all', startDate: '', endDate: '' });
  const runSearch = () => {
    setApplied({ searchTerm, status: filterStatus, startDate: filterStartDate, endDate: filterEndDate });
    setCurrentPage(1);
  };

  const filteredHistory = history.filter((entry) => {
    let matchesSearch = true;
    const term = normalizeSearch(applied.searchTerm);
    if (term) {
      matchesSearch = [entry.runDate, entry.runType, entry.targetSystem, entry.status, entry.note || '']
        .some(v => normalizeSearch(v).includes(term));
    }

    let matchesStatus = true;
    if (applied.status !== 'all') {
      matchesStatus = entry.status === applied.status;
    }

    let matchesDate = true;
    if (applied.startDate || applied.endDate) {
      const datePart = entry.runDate.split(' ')[0];
      const entryDate = new Date(datePart);
      if (applied.startDate) {
        const startDate = new Date(applied.startDate);
        if (entryDate < startDate) matchesDate = false;
      }
      if (applied.endDate) {
        const endDate = new Date(applied.endDate);
        if (entryDate > endDate) matchesDate = false;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!process) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-[#64748B]">
        <GitCompare className="w-16 h-16 text-[#CBD5E1] mb-4" />
        <h2 className="text-[16px] font-medium text-[#020817]">Không tìm thấy tiến trình đối soát</h2>
        <p className="mt-2 text-[13px]">Vui lòng chọn một tiến trình từ menu bên trái.</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Tổng Dữ liệu đối soát', value: history.length.toLocaleString(), icon: Database, tone: 'bg-blue-50 text-blue-600' },
    { label: 'Khớp dữ liệu', value: matchedRows.toLocaleString(), icon: CheckCircle2, tone: 'bg-green-50 text-green-600' },
    { label: 'Không khớp', value: mismatchedRows.toLocaleString(), icon: AlertTriangle, tone: 'bg-amber-50 text-amber-600' },
    { label: 'Tỷ lệ khớp', value: `${overallMatchRate.toFixed(2)}%`, icon: Percent, tone: 'bg-purple-50 text-purple-600' },
  ];

  const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
  const TD = 'px-3 py-1 text-[13px] text-black';

  return (
    <div className="space-y-4">
      {/* Tab bar (mục 5.9) */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 -mx-6 -mt-6">
        <div className="flex">
          <button type="button" className={tabClass(true)}>
            <List className="w-4 h-4" />
            Danh sách đối soát
          </button>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {/* Thẻ thống kê (mục 5.6.1) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statCards.map(card => (
            <div key={card.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.tone}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[16px] text-[#64748B]">{card.label}</div>
                  <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{card.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tìm kiếm & bộ lọc (mục 5.19) — chỉ áp dụng khi bấm Tìm kiếm hoặc Enter */}
        <div>
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                type="text"
                aria-label="Tìm kiếm"
                placeholder="Tìm theo tên tiến trình..."
                className={SEARCH_INPUT_CLS}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
              />
            </div>
            <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Bộ lọc"
              aria-expanded={showFilters}
              onClick={() => setShowFilters(!showFilters)}
              className={filterBtnClass(showFilters)}
              title="Bộ lọc"
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>

          {showFilters && (
            <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
              <div>
                <label className={FILTER_LABEL}>Khoảng thời gian (Từ ngày)</label>
                <div className={DATE_BOX_CLS}>
                  <input
                    type="date"
                    aria-label="Khoảng thời gian (Từ ngày)"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-[#020817] p-0"
                  />
                  <Calendar className="w-4 h-4 text-[#475569] shrink-0" />
                </div>
              </div>
              <div>
                <label className={FILTER_LABEL}>Khoảng thời gian (Đến ngày)</label>
                <div className={DATE_BOX_CLS}>
                  <input
                    type="date"
                    aria-label="Khoảng thời gian (Đến ngày)"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-[#020817] p-0"
                  />
                  <Calendar className="w-4 h-4 text-[#475569] shrink-0" />
                </div>
              </div>
              <div>
                <label className={FILTER_LABEL}>Trạng thái xử lý / kết nối</label>
                <select
                  aria-label="Trạng thái xử lý / kết nối"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={INPUT_CLS}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Thành công">Thành công</option>
                  <option value="Cảnh báo">Cảnh báo</option>
                  <option value="Lỗi">Lỗi</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* History Table */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse collection-table text-[13px]">
              <thead className="bg-[#F8FAFC]">
                <tr className="h-[42px]">
                  <th className={`${TH} text-center w-12`}>STT</th>
                  <th className={`${TH} text-left min-w-[200px]`}>Tên tiến trình đối soát</th>
                  <th className={`${TH} text-left min-w-[200px]`}>Tên API</th>
                  <th className={`${TH} text-right`}>Số bản ghi cung cấp</th>
                  <th className={`${TH} text-right`}>Số bản ghi nhận</th>
                  <th className={`${TH} text-right`}>Chênh lệch</th>
                  <th className={`${TH} text-left`}>Trạng thái</th>
                  <th className={`${TH} text-left`}>Ngày đối soát</th>
                  <th className={`${TH} text-center w-24 sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.length > 0 ? paginatedHistory.map((entry, index) => {
                  const reconStatus = getReconStatus(entry);
                  const stt = (currentPage - 1) * itemsPerPage + index + 1;
                  const [datePart, timePart] = entry.runDate.split(' ');
                  return (
                    <tr key={entry.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                      <td className={`${TD} text-center`}>{stt}</td>
                      <td className={`${TD} max-w-[360px]`}><TruncatedText text={process.name} /></td>
                      <td className={`${TD} max-w-[360px]`}><TruncatedText text={getApiName(process.id)} /></td>
                      <td className="px-3 py-1 text-[13px] text-black text-right tabular-nums">{entry.totalSent.toLocaleString()}</td>
                      <td className="px-3 py-1 text-[13px] text-[#15803D] text-right tabular-nums">{entry.totalMatched.toLocaleString()}</td>
                      <td className={`px-3 py-1 text-[13px] text-right tabular-nums ${entry.discrepancies > 0 ? 'text-[#D97706]' : 'text-[#94A3B8]'}`}>
                        {entry.discrepancies.toLocaleString()}
                      </td>
                      <td className={TD}>
                        <Badge
                          label={reconStatus}
                          variant={reconStatus === 'Khớp dữ liệu' ? 'green' : reconStatus === 'Không khớp' ? 'red' : 'blue'}
                        />
                      </td>
                      <td className={`${TD} whitespace-nowrap leading-[18px]`}>
                        <div>{datePart}</div>
                        {timePart && <div className="text-[#64748B]">{timePart}</div>}
                      </td>
                      <td className="px-3 py-1 text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]">
                        <div className="flex items-center justify-center gap-1">
                          <RowIconAction label="Xem chi tiết" onClick={() => { setSelectedEntry(entry as ReconciliationHistoryEntry); setIsDetailsModalOpen(true); }}>
                            <Eye className="w-4 h-4" />
                          </RowIconAction>
                          <RowIconAction label="Xem lịch sử" onClick={() => { setIsHistoryModalOpen(true); }}>
                            <History className="w-4 h-4" />
                          </RowIconAction>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-[13px] text-[#64748B]">
                      Không tìm thấy bản ghi lịch sử phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            className="border-t border-[#E2E8F0]"
            currentPage={currentPage}
            totalItems={filteredHistory.length}
            pageSize={itemsPerPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={setItemsPerPage}
          />
        </div>
      </div>

      <ProvisionReconciliationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        entry={selectedEntry}
      />

      <ProvisionReconciliationHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        process={process}
        historyData={history}
      />
    </div>
  );
}
