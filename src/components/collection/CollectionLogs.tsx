import { useState } from 'react';
import { Search, Download, Filter, CheckCircle, XCircle, Clock, Info } from 'lucide-react';

const logs = [
  {
    id: 1,
    time: '07/12/2025 10:30:28',
    transaction: 'TXN-2025120701234',
    source: 'CSDL A',
    step: 'Bước 5: Gửi thông báo thành công',
    status: 'success',
    message: 'Thu thập thành công 1,234 bản ghi',
  },
  {
    id: 2,
    time: '07/12/2025 10:30:26',
    transaction: 'TXN-2025120701234',
    source: 'CSDL A',
    step: 'Bước 4: Lưu dữ liệu vào kho',
    status: 'success',
    message: 'Đã lưu 1,234 bản ghi vào CSDL',
  },
  {
    id: 3,
    time: '07/12/2025 10:30:25',
    transaction: 'TXN-2025120701234',
    source: 'CSDL A',
    step: 'Bước 3: Kiểm tra dữ liệu',
    status: 'success',
    message: 'Dữ liệu hợp lệ',
  },
  {
    id: 4,
    time: '07/12/2025 10:25:22',
    transaction: 'TXN-2025120701235',
    source: 'Hệ thống B',
    step: 'Bước 5: Gửi thông báo lỗi',
    status: 'error',
    message: 'Gửi email thất bại tới quản trị viên',
  },
  {
    id: 5,
    time: '07/12/2025 10:25:20',
    transaction: 'TXN-2025120701235',
    source: 'Hệ thống B',
    step: 'Bước 4: Gửi thông báo lỗi',
    status: 'error',
    message: 'Không thể lưu dữ liệu',
  },
  {
    id: 6,
    time: '07/12/2025 10:25:18',
    transaction: 'TXN-2025120701235',
    source: 'Hệ thống B',
    step: 'Bước 3: Kiểm tra dữ liệu',
    status: 'warning',
    message: 'Phát hiện 45 bản ghi không hợp lệ',
  },
  {
    id: 7,
    time: '07/12/2025 10:25:15',
    transaction: 'TXN-2025120701235',
    source: 'Hệ thống B',
    step: 'Bước 2: Tiếp nhận dữ liệu',
    status: 'success',
    message: 'Nhận được 567 bản ghi',
  },
  {
    id: 8,
    time: '07/12/2025 10:25:12',
    transaction: 'TXN-2025120701235',
    source: 'Hệ thống B',
    step: 'Bước 1: Kết nối nguồn',
    status: 'success',
    message: 'Kết nối thành công tới API',
  },
  {
    id: 9,
    time: '07/12/2025 10:20:10',
    transaction: 'TXN-2025120701236',
    source: 'CSDL C',
    step: 'Bước 3: Kiểm tra dữ liệu',
    status: 'warning',
    message: 'Dữ liệu chưa đầy đủ một số trường',
  },
  {
    id: 10,
    time: '07/12/2025 10:15:45',
    transaction: 'TXN-2025120701237',
    source: 'CSDL C',
    step: 'Bước 2: Tiếp nhận dữ liệu',
    status: 'info',
    message: 'Đang xử lý 890 bản ghi...',
  },
  {
    id: 11,
    time: '07/12/2025 10:10:12',
    transaction: 'TXN-2025120701238',
    source: 'Hệ thống D',
    step: 'Bước 1: Gửi dữ liệu',
    status: 'error',
    message: 'Kết nối timeout sau 30 giây',
  },
  {
    id: 12,
    time: '07/12/2025 10:05:30',
    transaction: 'TXN-2025120701239',
    source: 'Danh mục E',
    step: 'Bước 5: Gửi thông báo thành công',
    status: 'success',
    message: 'Thu thập thành công 2,456 bản ghi',
  },
];

export function CollectionLogs() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesSearch = log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      case 'warning':
        return 'bg-orange-100 text-orange-700';
      case 'info':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input aria-label="Input field"
                type="text"
                placeholder="Tìm kiếm theo nguồn, nội dung..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Trạng thái:</span>
            <select aria-label="Select box"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Tất cả</option>
              <option value="success">Thành công</option>
              <option value="error">Lỗi</option>
              <option value="warning">Cảnh báo</option>
              <option value="info">Thông tin</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5 text-gray-600" />
            Xuất log
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-gray-500 text-sm">Thành công</p>
              <p className="text-gray-900">
                {logs.filter(l => l.status === 'success').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-gray-500 text-sm">Lỗi</p>
              <p className="text-gray-900">
                {logs.filter(l => l.status === 'error').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-gray-500 text-sm">Cảnh báo</p>
              <p className="text-gray-900">
                {logs.filter(l => l.status === 'warning').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Info className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-gray-500 text-sm">Thông tin</p>
              <p className="text-gray-900">
                {logs.filter(l => l.status === 'info').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Nhật ký thu thập dữ liệu</h3>
          <p className="text-gray-500 text-sm mt-1">
            Hiển thị {filteredLogs.length} / {logs.length} bản ghi
          </p>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="mt-1">
                  {getStatusIcon(log.status)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-gray-900 mb-1">{log.source}</h4>
                      <p className="text-gray-500 text-sm">{log.step}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(log.status)}`}>
                      {log.status === 'success' ? 'Thành công' :
                       log.status === 'error' ? 'Lỗi' :
                       log.status === 'warning' ? 'Cảnh báo' : 'Thông tin'}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{log.message}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>Mã GD: {log.transaction}</span>
                    <span>•</span>
                    <span>{log.time}</span>
                    <span>•</span>
                    <span>{log.user}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              Hiển thị 1-{filteredLogs.length} của {logs.length} bản ghi
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Trước
              </button>
              <button title="Hành động" aria-label="Hành động" className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">
                1
              </button>
              <button title="Hành động" aria-label="Hành động" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                2
              </button>
              <button title="Hành động" aria-label="Hành động" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}