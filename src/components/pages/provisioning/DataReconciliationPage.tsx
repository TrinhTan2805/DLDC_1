import React, { useState } from 'react';
import { Settings, Search, Filter, Play, GitCompare, Calendar, History, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Eye, X, Database, Percent, Clock, List } from 'lucide-react';
import { reconciliationData, reconciliationHistoryData, ReconciliationHistoryEntry } from '../../../data/provisionReconciliationData';
import { ProvisionReconciliationDetailsModal } from './modals/ProvisionReconciliationDetailsModal';
import { ProvisionReconciliationHistoryModal } from './modals/ProvisionReconciliationHistoryModal';
import { StatusTag } from '../../common/StatusTag';
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
  const filteredHistory = history.filter((entry) => {
    let matchesSearch = true;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      matchesSearch = (
        entry.runDate.toLowerCase().includes(term) ||
        entry.runType.toLowerCase().includes(term) ||
        entry.targetSystem.toLowerCase().includes(term) ||
        entry.status.toLowerCase().includes(term) ||
        (entry.note || '').toLowerCase().includes(term)
      );
    }

    let matchesStatus = true;
    if (filterStatus !== 'all') {
      matchesStatus = entry.status === filterStatus;
    }

    let matchesDate = true;
    if (filterStartDate || filterEndDate) {
      const datePart = entry.runDate.split(' ')[0];
      const entryDate = new Date(datePart);
      if (filterStartDate) {
        const startDate = new Date(filterStartDate);
        if (entryDate < startDate) matchesDate = false;
      }
      if (filterEndDate) {
        const endDate = new Date(filterEndDate);
        if (entryDate > endDate) matchesDate = false;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    return (
      <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 collection-pagination text-[13px]">
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Hiển thị</span>
          <select aria-label="Select record count" 
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[13px] cursor-pointer"
            title="Số bản ghi trên trang"
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
            {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Trước
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 border rounded-lg font-medium text-[13px] transition-colors cursor-pointer ${
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
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              disabled={currentPage === totalPages || totalItems === 0}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!process) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
        <GitCompare className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-medium text-slate-700">Không tìm thấy tiến trình đối soát</h2>
        <p className="mt-2">Vui lòng chọn một tiến trình từ menu bên trái.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab bar (theo form Đối soát thu thập) */}
      <div className="bg-white border-b border-slate-200 px-6 -mx-6 -mt-6">
        <div className="flex gap-6">
          <button className="flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 border-blue-600 text-blue-600">
            <List className="w-5 h-5" />
            Danh sách đối soát
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Tổng Dữ liệu đối soát</p>
            <p className="text-2xl font-bold text-slate-800">{history.length.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Khớp dữ liệu</p>
            <p className="text-2xl font-bold text-slate-800">
              {matchedRows.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Không khớp</p>
            <p className="text-2xl font-bold text-slate-800">
              {mismatchedRows.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Tỷ lệ khớp</p>
            <p className="text-2xl font-bold text-slate-800">
              {overallMatchRate.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="space-y-4">
        {/* General Search Toolbar & Advanced Filters directly on background */}
        <div className="space-y-4 mb-4">
          {/* Row 1: Search input + Blue Search Button + Filter Toggle Button */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm theo tên tiến trình..."
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center cursor-pointer">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors flex items-center justify-center border cursor-pointer ${
                showFilters 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-white border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
              }`}
              title="Bộ lọc"
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>

          {/* Row 2: Advanced Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-top-2 duration-200">
              <div>
                <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">Khoảng thời gian (Từ ngày)</label>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => { setFilterStartDate(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">Khoảng thời gian (Đến ngày)</label>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => { setFilterEndDate(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">Trạng thái xử lý / kết nối</label>
                <select
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
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

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto" style={{ fontSize: '13px' }}>
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-tight" style={{ fontSize: '13px' }}>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-center w-12 text-[13px]" style={{ fontSize: '13px' }}>STT</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-[13px]" style={{ fontSize: '13px' }}>Tên tiến trình đối soát</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-[13px]" style={{ fontSize: '13px' }}>Tên API</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-[13px] text-right" style={{ fontSize: '13px' }}>Số bản ghi cung cấp</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-[13px] text-right" style={{ fontSize: '13px' }}>Số bản ghi nhận</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-[13px] text-right" style={{ fontSize: '13px' }}>Chênh lệch</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-[13px] text-center" style={{ fontSize: '13px' }}>Trạng thái</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-[13px] text-center" style={{ fontSize: '13px' }}>Ngày đối soát</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-[13px] text-center w-24" style={{ fontSize: '13px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700" style={{ fontSize: '13px' }}>
              {paginatedHistory.length > 0 ? paginatedHistory.map((entry, index) => {
                const reconStatus = getReconStatus(entry);
                const stt = (currentPage - 1) * itemsPerPage + index + 1;
                const [datePart, timePart] = entry.runDate.split(' ');
                return (
                <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors" style={{ fontSize: '13px' }}>
                  <td className="py-3 px-4 text-center text-slate-500 font-medium text-[13px]" style={{ fontSize: '13px' }}>{stt}</td>
                  <td className="py-3 px-4 text-slate-600 text-[13px]" style={{ fontSize: '13px' }}>{process.name}</td>
                  <td className="py-3 px-4 text-slate-600 text-[13px]" style={{ fontSize: '13px' }}>{getApiName(process.id)}</td>
                  <td className="py-3 px-4 text-right font-medium text-[13px]" style={{ fontSize: '13px' }}>{entry.totalSent.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-medium text-emerald-600 text-[13px]" style={{ fontSize: '13px' }}>{entry.totalMatched.toLocaleString()}</td>
                  <td className={`py-3 px-4 text-right font-bold text-[13px] ${entry.discrepancies > 0 ? 'text-amber-600' : 'text-slate-400'}`} style={{ fontSize: '13px' }}>
                    {entry.discrepancies.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center text-[13px]" style={{ fontSize: '13px' }}>
                    <StatusTag
                      label={reconStatus}
                      variant={reconStatus === 'Khớp dữ liệu' ? 'green' : reconStatus === 'Không khớp' ? 'red' : 'blue'}
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-slate-500 font-medium whitespace-nowrap text-[13px]" style={{ fontSize: '13px' }}>
                    <div>{datePart}</div>
                    {timePart && <div className="text-[12px] text-slate-400" style={{ fontSize: '12px' }}>{timePart}</div>}
                  </td>
                  <td className="py-3 px-4 text-center text-[13px]" style={{ fontSize: '13px' }}>
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => { setSelectedEntry(entry as ReconciliationHistoryEntry); setIsDetailsModalOpen(true); }}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-[6px] transition-colors inline-flex items-center justify-center cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setIsHistoryModalOpen(true); }}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-[6px] transition-colors inline-flex items-center justify-center cursor-pointer"
                        title="Xem lịch sử"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              }) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    Không tìm thấy bản ghi lịch sử phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {renderPagination(filteredHistory.length)}
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
