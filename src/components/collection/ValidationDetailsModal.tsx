import { useState } from 'react';
import { X, Download, Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface ValidationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'errors' | 'warnings' | 'notifications' | 'responses';
  source: string;
  transaction: string;
  data: any[];
}

export function ValidationDetailsModal({ 
  isOpen, 
  onClose, 
  type, 
  source, 
  transaction,
  data 
}: ValidationDetailsModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const itemsPerPage = 10;

  if (!isOpen) return null;

  const getTitle = () => {
    switch (type) {
      case 'errors': return 'Danh sách Lỗi';
      case 'warnings': return 'Danh sách Cảnh báo';
      case 'notifications': return 'Danh sách Thông báo';
      case 'responses': return 'Danh sách Phản hồi';
    }
  };

  const getColumns = () => {
    switch (type) {
      case 'errors':
        return ['STT', 'Mã bản ghi', 'Trường lỗi', 'Loại lỗi', 'Mô tả', 'Hành động'];
      case 'warnings':
        return ['STT', 'Mã bản ghi', 'Trường', 'Loại cảnh báo', 'Mô tả', 'Hành động'];
      case 'notifications':
        return ['STT', 'Ngày gửi', 'Người nhận', 'Tiêu đề', 'Trạng thái', 'Hành động'];
      case 'responses':
        return ['STT', 'Ngày nhận', 'Người gửi', 'Nội dung', 'Trạng thái', 'Hành động'];
    }
  };

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const renderCell = (item: any, column: string, index: number) => {
    if (column === 'STT') {
      return startIndex + index + 1;
    }
    if (column === 'Hành động') {
      return (
        <button
          onClick={() => setSelectedRow(item)}
          className="text-blue-600 hover:text-blue-700 text-sm underline"
        >
          Xem chi tiết
        </button>
      );
    }
    
    const key = column.toLowerCase().replace(/\s/g, '_');
    return item[key] || '-';
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h3 className="text-slate-900 mb-1">{getTitle()} - {source}</h3>
              <p className="text-sm text-slate-600">Mã giao dịch: {transaction} • Tổng: {data.length} mục</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" />
                Xuất Excel
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input aria-label="Input field"
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto p-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-300">
                  {getColumns().map((col) => (
                    <th
                      key={col}
                      className="text-left px-4 py-3 text-sm text-slate-700 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-200 hover:bg-blue-50 transition-colors"
                  >
                    {getColumns().map((col) => (
                      <td key={col} className="px-4 py-3 text-sm text-slate-900 whitespace-nowrap">
                        {renderCell(item, col, idx)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer with Pagination */}
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} trong tổng số <span className="text-slate-900">{filteredData.length}</span> mục
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  {currentPage} / {totalPages || 1}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-2 border border-slate-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Popup */}
      {selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  type === 'errors' ? 'bg-red-50' :
                  type === 'warnings' ? 'bg-orange-50' :
                  type === 'notifications' ? 'bg-blue-50' : 'bg-green-50'
                }`}>
                  <AlertCircle className={`w-6 h-6 ${
                    type === 'errors' ? 'text-red-600' :
                    type === 'warnings' ? 'text-orange-600' :
                    type === 'notifications' ? 'text-blue-600' : 'text-green-600'
                  }`} />
                </div>
                <h3 className="text-slate-900">Chi tiết {type === 'errors' ? 'lỗi' : type === 'warnings' ? 'cảnh báo' : type === 'notifications' ? 'thông báo' : 'phản hồi'}</h3>
              </div>
              <button
                onClick={() => setSelectedRow(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(selectedRow).map(([key, value]) => (
                <div key={key} className="border-b border-slate-200 pb-3 last:border-0">
                  <p className="text-sm text-slate-600 mb-1 capitalize">{key.replace(/_/g, ' ')}</p>
                  <p className="text-slate-900">{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
