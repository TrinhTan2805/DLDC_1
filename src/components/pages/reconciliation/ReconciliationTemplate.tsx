import * as React from 'react';
import { useState } from 'react';
import { Database, CheckCircle, AlertCircle, Search, Filter, Download, Eye, Settings, History, FileText, List, Calendar, X } from 'lucide-react';
import { ReconciliationServiceSetupTab } from './ReconciliationServiceSetupTab';
import { ReconciliationLogTab } from './ReconciliationLogTab';
import { ReconciliationHistoryTab } from './ReconciliationHistoryTab';
import { ReconciliationDetailModal } from './ReconciliationDetailModal';
import {
  Badge, TruncatedText, RowIconAction, Pagination, tabClass, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, DATE_BOX_CLS, normalizeSearch, DateInput, isoToDisplayDate
} from '../collection/collectionUi';


interface ReconciliationRecord {
  id: string;
  datasetCode: string;
  datasetName: string;
  providerSystem: string;
  dataType: string;
  recordCount: number;
  receiveDate: string;
  status: 'matched' | 'mismatched' | 'pending' | 'error';
  statusText: string;
  statusColor: string;
  errorCount?: number;
  matchRate?: number;
  lastReconcileDate?: string;
  isReportSent?: boolean;
  sentCount?: number;
  receivedCount?: number;
}

type TabType = 'list' | 'setup' | 'log' | 'history';

interface ReconciliationTemplateProps {
  title: string;
  records: ReconciliationRecord[];
  hideSetupTab?: boolean;
  hideLogTab?: boolean;
  hideManualSync?: boolean; // Không còn dùng — nút Đồng bộ thủ công đã bỏ (PM yêu cầu)
  hideExportExcel?: boolean;
}

// Bảng theo compomennt.md 5.3; căn lề 5.3.3 (số căn phải, badge/ngày căn trái)
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const NUM = 'text-right tabular-nums whitespace-nowrap';
// Màu badge trạng thái đối soát (mục 5.8)
export const RECON_STATUS_VARIANT: Record<string, string> = { matched: 'green', mismatched: 'orange', pending: 'blue', error: 'red' };

const EMPTY_FILTERS = { searchTerm: '', filterSource: 'all', filterStatus: 'all', dateFrom: '', dateTo: '' };

export function ReconciliationTemplate({
  title,
  records,
  hideSetupTab = false,
  hideLogTab = false,
  hideExportExcel = false
}: ReconciliationTemplateProps) {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRecordCode, setSelectedRecordCode] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReconciliationRecord | null>(null);
  const [filterSource, setFilterSource] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  // Điều kiện đã áp dụng — chỉ cập nhật khi bấm Tìm kiếm / Enter (mục 5.19)
  const [applied, setApplied] = useState(EMPTY_FILTERS);

  // Pagination and collapsible filters states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const runSearch = () => {
    setApplied({ searchTerm, filterSource, filterStatus, dateFrom, dateTo });
    setCurrentPage(1);
  };

  const handleViewHistory = () => {
    if (selectedRecordCode) {
      setHistorySearchTerm(selectedRecordCode);
      setHistoryModalOpen(true);
      setDetailModalOpen(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesStatus = applied.filterStatus === 'all' || record.status === applied.filterStatus;
    const matchesSource = applied.filterSource === 'all' || record.providerSystem.toLowerCase().includes(applied.filterSource.toLowerCase());

    // date comparison logic
    let matchesDate = true;
    if (applied.dateFrom || applied.dateTo) {
      const receiveDate = new Date(record.receiveDate.split(' ')[0]);
      if (applied.dateFrom && receiveDate < new Date(applied.dateFrom)) matchesDate = false;
      if (applied.dateTo && receiveDate > new Date(applied.dateTo)) matchesDate = false;
    }

    const kw = normalizeSearch(applied.searchTerm);
    const matchesSearch = kw === '' ||
      [record.datasetCode, record.datasetName, record.providerSystem, record.dataType].some(v => normalizeSearch(v).includes(kw));

    return matchesStatus && matchesSource && matchesDate && matchesSearch;
  });


  const matchedCount = records.filter(r => r.status === 'matched').length;
  const mismatchedCount = records.filter(r => r.status === 'mismatched').length;

  // Tính số liệu Nguồn/Kho/Lệch/Tỷ lệ nhất quán từ 1 nguồn (mock nhất quán)
  const deriveCounts = (r: ReconciliationRecord) => {
    const received = r.receivedCount ?? r.recordCount; // Kho đếm được
    let sent: number; // Nguồn khai báo
    if (r.status === 'mismatched' || r.status === 'error') {
      sent = r.sentCount ?? (received + (r.errorCount ?? Math.max(1, Math.round(received * 0.001))));
    } else {
      sent = r.sentCount ?? received;
    }
    const diff = received - sent;
    const rate = sent > 0 ? (Math.min(received, sent) / sent) * 100 : 100;
    return { sent, received, diff, rate };
  };

  const totals = records.reduce((a, r) => { const c = deriveCounts(r); return { s: a.s + c.sent, k: a.k + c.received }; }, { s: 0, k: 0 });
  const overallRate = totals.s > 0 ? (Math.min(totals.k, totals.s) / totals.s) * 100 : 100;

  const tabs = [
    { id: 'list' as TabType, label: 'Danh sách đối soát' },
    ...(!hideSetupTab ? [{ id: 'setup' as TabType, label: 'Thiết lập dịch vụ' }] : []),
    ...(!hideLogTab ? [{ id: 'log' as TabType, label: 'Nhật ký đối soát' }] : []),
  ];

  // Thẻ thống kê (mục 5.6.1)
  const statCards = [
    { label: 'Tổng bộ dữ liệu', value: records.length, icon: Database, tone: 'bg-blue-50 text-blue-600' },
    { label: 'Khớp dữ liệu', value: matchedCount, icon: CheckCircle, tone: 'bg-green-50 text-green-600' },
    { label: 'Không khớp', value: mismatchedCount, icon: AlertCircle, tone: 'bg-orange-50 text-orange-600' },
    { label: 'Tỷ lệ khớp', value: `${overallRate.toFixed(2)}%`, icon: CheckCircle, tone: 'bg-blue-50 text-blue-600' },
  ];

  const openRecord = (record: ReconciliationRecord) => {
    const cc = deriveCounts(record);
    setSelectedRecordCode(record.datasetCode);
    setSelectedRecord({ ...record, sentCount: cc.sent, receivedCount: cc.received, matchRate: cc.rate });
  };

  const diffClass = (d: number) => (d !== 0 ? 'text-[#DC2626] font-semibold' : '');

  return (
    <div className="space-y-4">
      {/* Tabs (mục 5.9) */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 -mx-6 -mt-6">
        <div className="flex">
          {tabs.map((tab) => {
            let IconComponent = Database;
            if (tab.id === 'setup') IconComponent = Settings;
            else if (tab.id === 'history') IconComponent = History;
            else if (tab.id === 'log') IconComponent = FileText;
            else if (tab.id === 'list') IconComponent = List;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1); // Reset page on tab change
                }}
                className={tabClass(activeTab === tab.id)}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'list' && (
        <div className="space-y-4 pt-2">
          {/* Thẻ thống kê */}
          <div className="grid grid-cols-4 gap-4">
            {statCards.map(card => (
              <div key={card.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${card.tone}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[16px] text-[#64748B]">{card.label}</div>
                    <div className="text-[16px] font-semibold text-[#0F172A]">{card.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Thanh tìm kiếm & bộ lọc (mục 5.19) */}
          <div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-1.5">
                <input
                  aria-label="Tìm kiếm đối soát"
                  type="text"
                  placeholder="Tìm kiếm theo mã hồ sơ đối soát, hệ thống cung cấp, loại đối soát..."
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

              {!hideExportExcel && (
                <div className="flex items-center gap-1.5">
                  {!hideExportExcel && (
                    <button type="button" className={BTN_OUTLINE}>
                      <Download className="w-4 h-4" />
                      Xuất Excel
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Vùng bộ lọc: khung xám, cách thanh tìm kiếm 15px */}
            {showFilters && (
              <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
                <div>
                  <label className={FILTER_LABEL}>Hệ thống nguồn</label>
                  <select aria-label="Hệ thống nguồn" className={INPUT_CLS} value={filterSource} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterSource(e.target.value)}>
                    <option value="all">Tất cả hệ thống</option>
                    <option value="Trung tâm dữ liệu Quốc gia">Trung tâm dữ liệu Quốc gia</option>
                    <option value="Hệ thống Hộ tịch">Hệ thống Hộ tịch</option>
                    <option value="Hệ thống Dân cư">Hệ thống Dân cư</option>
                  </select>
                </div>

                <div>
                  <label className={FILTER_LABEL}>Trạng thái</label>
                  <select aria-label="Trạng thái" className={INPUT_CLS} value={filterStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}>
                    <option value="all">Tất cả trạng thái</option>
                    <option value="matched">Khớp dữ liệu</option>
                    <option value="mismatched">Không khớp</option>
                    <option value="pending">Đang xử lý</option>
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

          {/* Bảng đối soát (mục 5.3) */}
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
                    <th className={`${TH} text-center w-24`}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((record, index) => {
                      const c = deriveCounts(record);
                      const [d, t] = (record.lastReconcileDate || record.receiveDate).split(' ');
                      return (
                      <tr key={record.id} className="h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                        <td className={`${TD} text-center whitespace-nowrap`}>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className={`${TD} text-left max-w-[360px] leading-[18px]`}>
                          <TruncatedText text={record.datasetName} />
                          <TruncatedText text={record.datasetCode.replace(/-\d{4}(-\d{2})?$/, '')} className="text-[#64748B]" />
                        </td>
                        <td className={`${TD} ${NUM}`}>{c.sent.toLocaleString()}</td>
                        <td className={`${TD} ${NUM}`}>{c.received.toLocaleString()}</td>
                        <td className={`${TD} ${NUM} ${diffClass(c.diff)}`}>{c.diff === 0 ? '0' : c.diff.toLocaleString()}</td>
                        <td className={`${TD} text-left whitespace-nowrap`}>
                          <Badge label={record.statusText} variant={RECON_STATUS_VARIANT[record.status] || 'red'} />
                        </td>
                        <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                          <div>{isoToDisplayDate(d) || d}</div>
                          {t && <div className="text-[#64748B]">{t}</div>}
                        </td>
                        <td className={`${TD} text-center`}>
                          <div className="flex items-center justify-center gap-1">
                            <RowIconAction label="Xem chi tiết" onClick={() => { openRecord(record); setDetailModalOpen(true); }}>
                              <Eye className="w-4 h-4" />
                            </RowIconAction>
                            <RowIconAction label="Xem lịch sử đối soát" onClick={() => { openRecord(record); setHistorySearchTerm(record.datasetCode); setHistoryModalOpen(true); }}>
                              <History className="w-4 h-4" />
                            </RowIconAction>
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-3 py-16 text-center text-[13px] text-[#64748B]">
                        Không tìm thấy dữ liệu
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
              totalItems={filteredRecords.length}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setItemsPerPage}
            />
          </div>
        </div>
      )}

      {activeTab === 'setup' && <ReconciliationServiceSetupTab />}
      {activeTab === 'log' && <ReconciliationLogTab />}

      {/* Reconciliation Detail Modal */}
      <ReconciliationDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        recordCode={selectedRecordCode}
        record={selectedRecord}
        onViewHistory={handleViewHistory}
      />

      {/* Lịch sử đối soát (mục 5.4) */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={() => setHistoryModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-[16px] font-medium text-[#020817]">Lịch sử đối soát thu thập</h2>
                <p className="text-[13px] text-[#64748B] mt-1 leading-5">Bộ dữ liệu: <span className="font-semibold text-[#020817]">{historySearchTerm}</span></p>
              </div>
              <button type="button" onClick={() => setHistoryModalOpen(false)} className={BTN_GHOST_ICON} aria-label="Đóng lịch sử đối soát" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto custom-scrollbar flex-1 bg-white">
              <ReconciliationHistoryTab initialSearchTerm={historySearchTerm} record={selectedRecord ?? undefined} hideSearchAndFilters={true} />
            </div>

            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end flex-shrink-0">
              <button type="button" onClick={() => setHistoryModalOpen(false)} className={BTN_OUTLINE}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
