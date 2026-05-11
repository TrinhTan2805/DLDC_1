import { History as HistoryIcon, CheckCircle, XCircle, AlertCircle, Calendar, Database, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { ErrorDetailModal } from './ErrorDetailModal';

interface ErrorRecord {
  id: number;
  recordId: string;
  fieldName: string;
  errorType: string;
  errorMessage: string;
  originalValue: string;
  expectedFormat?: string;
  timestamp: string;
}

interface SyncRecord {
  id: number;
  timestamp: string;
  status: 'success' | 'failed' | 'partial';
  recordsAdded: number;
  recordsUpdated: number;
  recordsFailed: number;
  totalRecords: number;
  duration: string;
  message?: string;
  errors?: ErrorRecord[];
}

interface SyncHistoryTableProps {
  records: SyncRecord[];
  isCollapsed?: boolean;
}

export function SyncHistoryTable({ records, isCollapsed = false }: SyncHistoryTableProps) {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedSyncRecord, setSelectedSyncRecord] = useState<SyncRecord | null>(null);

  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      label: 'Thành công'
    },
    failed: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      label: 'Thất bại'
    },
    partial: {
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      label: 'Một phần'
    }
  };

  const handleErrorClick = (record: SyncRecord) => {
    if (record.recordsFailed > 0 && record.errors) {
      setSelectedSyncRecord(record);
      setShowErrorModal(true);
    }
  };

  if (isCollapsed) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-slate-600" />
            <h3 className="text-slate-900">Lịch sử đồng bộ</h3>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">
              {records.length} lần
            </span>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700">
            Xem tất cả
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Tổng số lần đồng bộ:</span>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-sm">
            {records.length} lần
          </span>
        </div>
        <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          Làm mới
        </button>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                Thêm mới
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                Cập nhật
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                Lỗi
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tổng số
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                Thời lượng
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {records.map((record) => {
              const config = statusConfig[record.status];
              const StatusIcon = config.icon;
              
              return (
                <tr key={record.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      <span className="text-sm text-slate-700 font-medium">{record.timestamp}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.color} border border-current opacity-80 group-hover:opacity-100 transition-all shadow-sm`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {config.label}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-sm font-bold text-slate-900">{record.recordsAdded}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-slate-700">{record.recordsUpdated}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {record.recordsFailed > 0 ? (
                      <button
                        onClick={() => handleErrorClick(record)}
                        className="text-sm font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded transition-all active:scale-95 border border-red-100"
                      >
                        {record.recordsFailed}
                      </button>
                    ) : (
                      <span className="text-sm text-slate-300 font-medium">0</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-blue-400 opacity-50" />
                      <span className="text-sm font-bold text-slate-900">{record.totalRecords}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-slate-500 font-mono italic">{record.duration}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-600 mb-1">Tổng số lần đồng bộ</p>
            <p className="text-slate-900">{records.length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-1">Thành công</p>
            <p className="text-green-600">
              {records.filter(r => r.status === 'success').length}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-1">Một phần</p>
            <p className="text-amber-600">
              {records.filter(r => r.status === 'partial').length}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-1">Thất bại</p>
            <p className="text-red-600">
              {records.filter(r => r.status === 'failed').length}
            </p>
          </div>
        </div>
      </div>

      {/* Error Detail Modal */}
      {showErrorModal && selectedSyncRecord && (
        <ErrorDetailModal
          record={selectedSyncRecord}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
}