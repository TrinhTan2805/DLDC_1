import { X, Search, Eye, Settings, Filter, Play, AlertCircle } from 'lucide-react';

interface ProcessingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataSource: string;
  config?: { dataSource: string };
}

interface HistoryRecord {
  id: string;
  timestamp: string;
  ruleName: string;
  stats: string;
  status: 'completed' | 'processing' | 'error';
  errorCount?: number;
}

export function ProcessingHistoryModal({ isOpen, onClose, dataSource, config }: ProcessingHistoryModalProps) {
  if (!isOpen) return null;

  const actualDataSource = config?.dataSource || dataSource;

  const historyData: HistoryRecord[] = [
    {
      id: '1',
      timestamp: '2024-01-15 14:30:25',
      ruleName: 'Chuẩn hóa dữ liệu địa chỉ',
      stats: 'Đã xử lý: 45,230/50,000 bản ghi',
      status: 'processing',
    },
    {
      id: '2',
      timestamp: '2024-01-15 10:15:42',
      ruleName: 'Làm sạch dữ liệu trùng lặp',
      stats: 'Đã xử lý: 50,000/50,000 bản ghi',
      status: 'completed',
    },
    {
      id: '3',
      timestamp: '2024-01-14 16:20:15',
      ruleName: 'Chuẩn hóa số điện thoại',
      stats: 'Đã xử lý: 48,500/50,000 bản ghi',
      status: 'error',
      errorCount: 125,
    },
    {
      id: '4',
      timestamp: '2024-01-14 09:45:30',
      ruleName: 'Làm sạch ký tự đặc biệt',
      stats: 'Đã xử lý: 50,000/50,000 bản ghi',
      status: 'completed',
    },
    {
      id: '5',
      timestamp: '2024-01-13 15:10:18',
      ruleName: 'Chuẩn hóa dữ liệu ngày tháng',
      stats: 'Đã xử lý: 50,000/50,000 bản ghi',
      status: 'completed',
    },
    {
      id: '6',
      timestamp: '2024-01-13 11:25:50',
      ruleName: 'Xóa bỏ khoảng trắng thừa',
      stats: 'Đã xử lý: 50,000/50,000 bản ghi',
      status: 'completed',
    },
    {
      id: '7',
      timestamp: '2024-01-12 14:40:22',
      ruleName: 'Chuẩn hóa dữ liệu email',
      stats: 'Đã xử lý: 49,800/50,000 bản ghi',
      status: 'error',
      errorCount: 45,
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Hoàn thành</span>,
      processing: <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Đang xử lý</span>,
      error: <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Có lỗi</span>,
    };
    return badges[status as keyof typeof badges];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-slate-900">Lịch sử xử lý dữ liệu</h2>
            <p className="text-sm text-slate-500 mt-1">Nguồn dữ liệu: {actualDataSource}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên quy tắc, thời gian..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <table className="w-full">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600 border-b border-slate-200">STT</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 border-b border-slate-200">Thời gian</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 border-b border-slate-200">Loại xử lý</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 border-b border-slate-200">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((record, index) => (
                <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{record.timestamp}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-900">{record.ruleName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{record.stats}</div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(record.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
          <div className="text-sm text-slate-600">
            Hiển thị {historyData.length} bản ghi
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}