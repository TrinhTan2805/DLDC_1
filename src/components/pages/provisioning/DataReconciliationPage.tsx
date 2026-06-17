import React, { useState } from 'react';
import { Settings, Search, Filter, Play, GitCompare, Calendar, History, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { reconciliationData, reconciliationHistoryData, ReconciliationHistoryEntry } from '../../../data/provisionReconciliationData';
import { ProvisionReconciliationDetailsModal } from './modals/ProvisionReconciliationDetailsModal';
export function ProvisionReconciliationPage({ processId }: { processId?: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<ReconciliationHistoryEntry | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Find the specific process
  const process = reconciliationData.find(p => p.id === processId);
  const history = processId && reconciliationHistoryData[processId] ? reconciliationHistoryData[processId] : [];
  const filteredHistory = history.filter((entry) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      entry.runDate.toLowerCase().includes(term) ||
      entry.runType.toLowerCase().includes(term) ||
      entry.targetSystem.toLowerCase().includes(term) ||
      entry.status.toLowerCase().includes(term) ||
      (entry.note || '').toLowerCase().includes(term)
    );
  });

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
      case 'Thành công': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Cảnh báo': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'Lỗi': return <XCircle className="w-4 h-4 text-rose-500" />;
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
          <h2 className="text-2xl font-bold text-slate-800 mt-2">{process.name}</h2>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            Hệ thống đích: <span className="font-medium text-slate-700">{process.targetSystem}</span>
            <span className="text-slate-300">•</span>
            Lịch trình: <span className="font-medium text-slate-700">{process.schedule}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="group flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all font-medium duration-200">
            <Settings className="w-4 h-4 mr-2 text-slate-500 group-hover:text-slate-700 group-hover:rotate-45 transition-all duration-300" />
            Cấu hình
          </button>
          <button className="group flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-sm hover:shadow-md hover:shadow-amber-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all font-medium duration-200">
            <Play className="w-4 h-4 mr-2 fill-current group-hover:scale-110 transition-transform duration-300" />
            Đối soát ngay
          </button>
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Lịch sử đối soát</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Bộ lọc
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="py-3 px-4 font-medium">Thời gian chạy</th>
                <th className="py-3 px-4 font-medium">Loại chạy</th>
                <th className="py-3 px-4 font-medium text-right">Tổng số gửi đi</th>
                <th className="py-3 px-4 font-medium text-right">Khớp nối</th>
                <th className="py-3 px-4 font-medium text-right">Chênh lệch</th>
                <th className="py-3 px-4 font-medium">Trạng thái</th>
                <th className="py-3 px-4 font-medium">Ghi chú</th>
                <th className="py-3 px-4 font-medium text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {filteredHistory.length > 0 ? filteredHistory.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-700">{entry.runDate}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200">
                      {entry.runType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium">{entry.totalSent.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-medium text-emerald-600">{entry.totalMatched.toLocaleString()}</td>
                  <td className={`py-3 px-4 text-right font-bold ${entry.discrepancies > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {entry.discrepancies.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusClass(entry.status)}`}>
                      {getStatusIcon(entry.status)}
                      {entry.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate" title={entry.note}>
                    {entry.note || '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => { setSelectedEntry(entry as ReconciliationHistoryEntry); setIsDetailsModalOpen(true); }}
                      className="group inline-flex items-center justify-center p-2 text-blue-600 bg-blue-50/50 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:shadow-sm" 
                      title="Xem chi tiết"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Không tìm thấy bản ghi lịch sử phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filteredHistory.length > 0 && (
          <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
            <div>Hiển thị {filteredHistory.length} bản ghi</div>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Trước</button>
              <button className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded font-medium">1</button>
              <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Sau</button>
            </div>
          </div>
        )}
      </div>
      
      <ProvisionReconciliationDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        entry={selectedEntry}
      />
    </div>
  );
}
