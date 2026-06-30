import React, { useState } from 'react';
import { Settings, Search, Filter, Play, GitCompare, Calendar, History, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Eye, X } from 'lucide-react';
import { reconciliationData, reconciliationHistoryData, ReconciliationHistoryEntry } from '../../../data/provisionReconciliationData';
import { ProvisionReconciliationDetailsModal } from './modals/ProvisionReconciliationDetailsModal';
export function ProvisionReconciliationPage({ processId }: { processId?: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<ReconciliationHistoryEntry | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const handleResetFilters = () => {
    setFilterStatus('all');
    setFilterStartDate('');
    setFilterEndDate('');
    setCurrentPage(1);
  };
  
  // Find the specific process
  const process = reconciliationData.find(p => p.id === processId);
  const history = processId && reconciliationHistoryData[processId] ? reconciliationHistoryData[processId] : [];
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Thành công': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Cảnh báo': return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
      case 'Lỗi': return <XCircle className="w-3.5 h-3.5 text-rose-500" />;
      default: return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Thành công': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cảnh báo': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Lỗi': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md border border-amber-200">
              UC-{process.id}
            </span>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md border border-blue-200">
              {process.group}
            </span>
          </div>
          <h2 className="text-[18px] font-bold text-slate-800 mt-2" style={{ fontSize: '18px' }}>{process.name}</h2>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            Hệ thống đích: <span className="font-medium text-slate-700">{process.targetSystem}</span>
            <span className="text-slate-300">•</span>
            Lịch trình: <span className="font-medium text-slate-700">{process.schedule}</span>
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <History className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Tổng số lần chạy</p>
            <p className="text-2xl font-bold text-slate-800">{history.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Thành công</p>
            <p className="text-2xl font-bold text-slate-800">
              {history.filter(h => h.status === 'Thành công').length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Cảnh báo chênh lệch</p>
            <p className="text-2xl font-bold text-slate-800">
              {history.filter(h => h.status === 'Cảnh báo').length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Lần chạy gần nhất</p>
            <p className="text-base font-bold text-slate-800 mt-1">
              {history.length > 0 ? history[0].runDate : 'Chưa có'}
            </p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="space-y-4">
        <div>
          <h3 className="text-[18px] font-bold text-slate-800" style={{ fontSize: '18px' }}>Lịch sử đối soát</h3>
        </div>

        {/* General Search Toolbar & Advanced Filters directly on background */}
        <div className="space-y-4 mb-4">
          {/* Row 1: Search input + Blue Search Button + Filter Toggle Button */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm theo lịch sử..."
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
            <div className="grid grid-cols-4 gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-top-2 duration-200">
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
              <div className="flex items-end">
                <button
                  onClick={handleResetFilters}
                  className="w-full px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-[13px] font-medium transition-colors cursor-pointer shadow-sm text-center"
                >
                  Thiết lập lại
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto" style={{ fontSize: '13px' }}>
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-tight" style={{ fontSize: '13px' }}>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-[13px]" style={{ fontSize: '13px' }}>Thời gian chạy</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-[13px]" style={{ fontSize: '13px' }}>Loại chạy</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-[13px] text-right" style={{ fontSize: '13px' }}>Tổng số gửi đi</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-[13px] text-right" style={{ fontSize: '13px' }}>Khớp nối</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-[13px] text-right" style={{ fontSize: '13px' }}>Chênh lệch</th>
                <th className="py-3 px-4 font-semibold text-slate-500 text-[13px]" style={{ fontSize: '13px' }}>Trạng thái</th>
                <th className="py-3 px-4 font-semibold text-slate-500 text-[13px] text-center" style={{ fontSize: '13px' }}>Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700" style={{ fontSize: '13px' }}>
              {paginatedHistory.length > 0 ? paginatedHistory.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors" style={{ fontSize: '13px' }}>
                  <td className="py-3 px-4 font-medium text-slate-700 text-[13px]" style={{ fontSize: '13px' }}>{entry.runDate}</td>
                  <td className="py-3 px-4 text-[13px]" style={{ fontSize: '13px' }}>
                    <span className="inline-flex px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[12px] font-normal border border-slate-200 whitespace-nowrap" style={{ fontSize: '12px' }}>
                      {entry.runType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-[13px]" style={{ fontSize: '13px' }}>{entry.totalSent.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-medium text-emerald-600 text-[13px]" style={{ fontSize: '13px' }}>{entry.totalMatched.toLocaleString()}</td>
                  <td className={`py-3 px-4 text-right font-bold text-[13px] ${entry.discrepancies > 0 ? 'text-amber-600' : 'text-slate-400'}`} style={{ fontSize: '13px' }}>
                    {entry.discrepancies.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-[13px]" style={{ fontSize: '13px' }}>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-normal border whitespace-nowrap ${getStatusClass(entry.status)}`} style={{ fontSize: '12px' }}>
                      {getStatusIcon(entry.status)}
                      {entry.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-[13px]" style={{ fontSize: '13px' }}>
                    <button 
                      onClick={() => { setSelectedEntry(entry as ReconciliationHistoryEntry); setIsDetailsModalOpen(true); }}
                      className="p-1.5 text-black hover:text-slate-700 hover:bg-slate-100 rounded-[6px] transition-colors inline-flex items-center justify-center cursor-pointer" 
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
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
    </div>
  );
}
