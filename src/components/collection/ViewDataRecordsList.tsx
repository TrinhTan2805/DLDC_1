import { ArrowLeft, Search, Filter, Download, Database, Calendar, FileText, Eye, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AdvancedSearchModal } from './AdvancedSearchModal';

interface ViewDataRecordsListProps {
  dataItem: any;
  onBack: () => void;
}

// Mock data records - sẽ được thay thế bằng dữ liệu thực từ API
const generateMockRecords = (dataName: string, count: number = 50) => {
  const records = [];
  for (let i = 1; i <= count; i++) {
    records.push({
      id: i,
      recordId: `REC${String(i).padStart(6, '0')}`,
      name: `${dataName} - Bản ghi ${i}`,
      source: i % 3 === 0 ? 'API' : i % 3 === 1 ? 'File Upload' : 'Manual Entry',
      size: `${(Math.random() * 500 + 100).toFixed(2)} KB`,
      recordDate: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}/11/2025`,
      status: i % 4 === 0 ? 'error' : i % 4 === 1 ? 'processing' : 'completed',
      createdAt: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}/11/2025 ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    });
  }
  return records;
};

export function ViewDataRecordsList({ dataItem, onBack }: ViewDataRecordsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    department: '',
    dataType: '',
    frequency: '',
    format: '',
    status: '',
    priority: '',
    dateFrom: '',
    dateTo: ''
  });

  const [records] = useState(() => generateMockRecords(dataItem.dataName, 150));

  // Apply filters
  const filteredRecords = records.filter(record => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.recordId.toLowerCase().includes(searchTerm.toLowerCase());

    // Advanced filters
    const matchesStatus = advancedFilters.status === '' || record.status === advancedFilters.status;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-3 py-1 rounded-full text-base bg-green-100 text-green-700">Hoàn thành</span>;
      case 'processing':
        return <span className="px-3 py-1 rounded-full text-base bg-blue-100 text-blue-700">Đang xử lý</span>;
      case 'error':
        return <span className="px-3 py-1 rounded-full text-base bg-red-100 text-red-700">Lỗi</span>;
      default:
        return null;
    }
  };

  const handleAdvancedSearch = (filters: any) => {
    setAdvancedFilters(filters);
  };

  // Statistics
  const stats = {
    total: records.length,
    completed: records.filter(r => r.status === 'completed').length,
    processing: records.filter(r => r.status === 'processing').length,
    error: records.filter(r => r.status === 'error').length,
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="space-y-6 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <button title="Hành động" aria-label="Hành động"
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Database className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-slate-900 mb-1">{dataItem.dataName}</h2>
            <p className="text-base text-slate-600 mb-3">{dataItem.description}</p>
            <div className="flex flex-wrap gap-4 text-base">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-slate-500">Cơ quan:</span>
                <span>{dataItem.department}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-slate-500">Loại:</span>
                <span>{dataItem.dataType}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-slate-500">Tần suất:</span>
                <span>{dataItem.frequency}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-slate-500">Định dạng:</span>
                <span>{dataItem.format}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base text-slate-600">Tổng bản ghi</span>
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl text-slate-900">{stats.total.toLocaleString()}</div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base text-slate-600">Hoàn thành</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-2xl text-slate-900">{stats.completed.toLocaleString()}</div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base text-slate-600">Đang xử lý</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <div className="text-2xl text-slate-900">{stats.processing.toLocaleString()}</div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base text-slate-600">Lỗi</span>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <div className="text-2xl text-slate-900">{stats.error.toLocaleString()}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input aria-label="Input field"
            type="text"
            placeholder="Tìm kiếm theo mã bản ghi, tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowAdvancedSearch(true)}
          className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Tìm kiếm nâng cao
        </button>
        <button className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Xuất Excel
        </button>
      </div>

      {/* Active Filters Display */}
      {(advancedFilters.status || advancedFilters.dateFrom || advancedFilters.dateTo) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base">
              <Filter className="w-4 h-4 text-blue-600" />
              <span className="text-blue-900">Bộ lọc đang áp dụng:</span>
              {advancedFilters.status && (
                <span className="px-2 py-1 bg-white rounded text-blue-700">
                  Trạng thái: {advancedFilters.status === 'completed' ? 'Hoàn thành' : advancedFilters.status === 'processing' ? 'Đang xử lý' : 'Lỗi'}
                </span>
              )}
              {advancedFilters.dateFrom && (
                <span className="px-2 py-1 bg-white rounded text-blue-700">
                  Từ: {advancedFilters.dateFrom}
                </span>
              )}
              {advancedFilters.dateTo && (
                <span className="px-2 py-1 bg-white rounded text-blue-700">
                  Đến: {advancedFilters.dateTo}
                </span>
              )}
            </div>
            <button
              onClick={() => setAdvancedFilters({
                department: '',
                dataType: '',
                frequency: '',
                format: '',
                status: '',
                priority: '',
                dateFrom: '',
                dateTo: ''
              })}
              className="text-base text-blue-600 hover:text-blue-700"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">STT</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">MÃ BẢN GHI</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">TÊN BẢN GHI</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">NGUỒN</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">KÍCH THƯỚC</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">NGÀY GHI NHẬN</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">TRẠNG THÁI</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">THỜI GIAN TẠO</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.map((record, index) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-base text-slate-900">{index + 1}</td>
                  <td className="px-4 py-3 text-base text-blue-600 font-mono">{record.recordId}</td>
                  <td className="px-4 py-3 text-base text-slate-900">{record.name}</td>
                  <td className="px-4 py-3 text-base text-slate-700">{record.source}</td>
                  <td className="px-4 py-3 text-base text-slate-700">{record.size}</td>
                  <td className="px-4 py-3 text-base text-slate-700">{record.recordDate}</td>
                  <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                  <td className="px-4 py-3 text-base text-slate-700">{record.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="text-base text-slate-600">
            Hiển thị <span className="text-slate-900">{filteredRecords.length}</span> / {stats.total.toLocaleString()} bản ghi
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 text-base">
              Trước
            </button>
            <button title="Hành động" aria-label="Hành động" className="px-3 py-1.5 bg-blue-600 text-white rounded text-base">1</button>
            <button title="Hành động" aria-label="Hành động" className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 text-base">2</button>
            <button title="Hành động" aria-label="Hành động" className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 text-base">3</button>
            <span className="px-2 text-slate-500">...</span>
            <button title="Hành động" aria-label="Hành động" className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 text-base">10</button>
            <button className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 text-base">
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <AdvancedSearchModal
          onClose={() => setShowAdvancedSearch(false)}
          onSearch={handleAdvancedSearch}
          currentFilters={advancedFilters}
        />
      )}
    </div>
    </div>
  );
}
