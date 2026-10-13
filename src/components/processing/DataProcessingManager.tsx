import { useState } from 'react';
import { Search, Download, RefreshCw, CheckCircle, Clock, AlertTriangle, Eye, GitCompare, Filter, ChevronDown, Settings, Plus, Trash2, XCircle, Database, Tag } from 'lucide-react';
import { ErrorRecordsList } from './ErrorRecordsList';
import { DataViewer } from './DataViewer';
import { DataClassificationModal } from './DataClassificationModal';

interface ProcessingDataItem {
  id: number;
  stt: number;
  department: string;
  dataName: string;
  dataType: string;
  description: string;
  frequency: string;
  format: string;
  startTime: string;
  processingStatus: 'processing' | 'completed' | 'error';
  priority: 'high' | 'medium' | 'low';
  responsible: string;
  recordCount: number;
  processedCount: number;
  appliedRulesCount: number;
  errorCount?: number;
  successRate?: number;
}

// Dữ liệu mẫu - dữ liệu đang xử lý hoặc đã xử lý
const processingDataList: ProcessingDataItem[] = [
  { 
    id: 1, stt: 1, 
    department: 'Cục Kiểm soát', 
    dataName: 'Văn bản quy phạm pháp luật', 
    dataType: 'Văn bản pháp luật', 
    description: 'Văn bản QPPL cấp Bộ', 
    frequency: 'Hằng tuần', 
    format: 'JSON', 
    startTime: '08/12/2024 10:15:00',
    processingStatus: 'processing',
    priority: 'high', 
    responsible: 'Hoàng Văn E',
    recordCount: 125000, 
    processedCount: 78500,
    appliedRulesCount: 22,
    errorCount: 0, 
    successRate: 0
  },
  { 
    id: 2, stt: 2, 
    department: 'Vụ Pháp luật, Thi hành', 
    dataName: 'Thông tư ngành Tư pháp', 
    dataType: 'Văn bản pháp luật', 
    description: 'Thông tư, quyết định ngành', 
    frequency: 'Hằng tuần', 
    format: 'JSON', 
    startTime: '08/12/2024 09:45:00',
    processingStatus: 'processing',
    priority: 'high', 
    responsible: 'Đỗ Thị F',
    recordCount: 53000, 
    processedCount: 21200,
    appliedRulesCount: 10,
    errorCount: 0, 
    successRate: 0
  },
  { 
    id: 3, stt: 3, 
    department: 'Cục Đăng ký quốc gia giao dịch bảo đảm', 
    dataName: 'Đăng ký kinh doanh', 
    dataType: 'Đăng ký KD', 
    description: 'Hồ sơ ĐKKD doanh nghiệp', 
    frequency: 'Hằng ngày', 
    format: 'JSON', 
    startTime: '08/12/2024 10:30:00',
    processingStatus: 'processing',
    priority: 'high', 
    responsible: 'Vũ Văn G',
    recordCount: 98000, 
    processedCount: 9800,
    appliedRulesCount: 14,
    errorCount: 0, 
    successRate: 0
  },
  { 
    id: 4, stt: 4, 
    department: 'Cục Hộ tịch, Quốc tịch, Chứng thực', 
    dataName: 'Dữ liệu đăng ký khai sinh', 
    dataType: 'Hộ tịch', 
    description: 'Thông tin đăng ký khai sinh trên toàn quốc', 
    frequency: 'Hằng ngày', 
    format: 'JSON', 
    startTime: '07/12/2024 14:20:00',
    processingStatus: 'completed',
    priority: 'high', 
    responsible: 'Nguyễn Văn A',
    recordCount: 15420, 
    processedCount: 15420,
    appliedRulesCount: 18,
    errorCount: 12, 
    successRate: 99.92
  },
  { 
    id: 5, stt: 5, 
    department: 'Cục Hộ tịch, Quốc tịch, Chứng thực', 
    dataName: 'Dữ liệu đăng ký tử vong', 
    dataType: 'Hộ tịch', 
    description: 'Thông tin đăng ký tử vong trên toàn quốc', 
    frequency: 'Hằng ngày', 
    format: 'JSON', 
    startTime: '07/12/2024 15:10:00',
    processingStatus: 'completed',
    priority: 'high', 
    responsible: 'Nguyễn Văn A',
    recordCount: 5680, 
    processedCount: 5680,
    appliedRulesCount: 15,
    errorCount: 8, 
    successRate: 99.86
  },
  { 
    id: 6, stt: 6, 
    department: 'Cục Hộ tịch, Quốc tịch, Chứng thực', 
    dataName: 'Dữ liệu chứng thực', 
    dataType: 'Chứng thực', 
    description: 'Thông tin chứng thực chữ ký, bản sao', 
    frequency: 'Hằng ngày', 
    format: 'JSON', 
    startTime: '06/12/2024 16:30:00',
    processingStatus: 'completed',
    priority: 'low', 
    responsible: 'Lê Văn C',
    recordCount: 12350, 
    processedCount: 12350,
    appliedRulesCount: 12,
    errorCount: 15, 
    successRate: 99.88
  },
  { 
    id: 7, stt: 7, 
    department: 'Cục Thi hành án dân sự', 
    dataName: 'Dữ liệu án dân sự', 
    dataType: 'THADS', 
    description: 'Thông tin về các vụ án dân sự đang thi hành', 
    frequency: 'Hằng ngày', 
    format: 'JSON', 
    startTime: '07/12/2024 13:45:00',
    processingStatus: 'error',
    priority: 'high', 
    responsible: 'Phạm Văn D',
    recordCount: 9840, 
    processedCount: 9715,
    appliedRulesCount: 16,
    errorCount: 125, 
    successRate: 98.73
  },
  { 
    id: 8, stt: 8, 
    department: 'Cục Thi hành án dân sự', 
    dataName: 'Dữ liệu người phải thi hành án', 
    dataType: 'THADS', 
    description: 'Danh sách người phải thi hành án trên toàn quốc', 
    frequency: 'Hằng ngày', 
    format: 'JSON', 
    startTime: '07/12/2024 11:20:00',
    processingStatus: 'completed',
    priority: 'high', 
    responsible: 'Phạm Văn D',
    recordCount: 18560, 
    processedCount: 18560,
    appliedRulesCount: 20,
    errorCount: 22, 
    successRate: 99.88
  },
  { 
    id: 9, stt: 9, 
    department: 'Vụ Bổ trợ Tư pháp', 
    dataName: 'Dữ liệu trợ giúp pháp lý', 
    dataType: 'Trợ giúp pháp lý', 
    description: 'Thông tin các vụ việc trợ giúp pháp lý', 
    frequency: 'Hằng tuần', 
    format: 'JSON', 
    startTime: '06/12/2024 09:15:00',
    processingStatus: 'error',
    priority: 'medium', 
    responsible: 'Trần Thị H',
    recordCount: 6840, 
    processedCount: 6754,
    appliedRulesCount: 11,
    errorCount: 86, 
    successRate: 98.74
  },
  { 
    id: 10, stt: 10, 
    department: 'Cục Công chứng', 
    dataName: 'Dữ liệu hợp đồng công chứng', 
    dataType: 'Công chứng', 
    description: 'Thông tin các hợp đồng được công chứng', 
    frequency: 'Hằng ngày', 
    format: 'JSON', 
    startTime: '06/12/2024 08:30:00',
    processingStatus: 'error',
    priority: 'high', 
    responsible: 'Đặng Văn F',
    recordCount: 7420, 
    processedCount: 7358,
    appliedRulesCount: 13,
    errorCount: 62, 
    successRate: 99.16
  },
];

// Danh sách quy tắc có sẵn
const availableRules = [
  { id: 'rule1', name: 'Chuẩn hóa ngày tháng', category: 'cleaning', type: 'internal' },
  { id: 'rule2', name: 'Kiểm tra trùng lặp', category: 'standardization', type: 'internal' },
  { id: 'rule3', name: 'Loại bỏ ký tự đặc biệt', category: 'cleaning', type: 'internal' },
  { id: 'rule4', name: 'Kiểm tra CCCD', category: 'standardization', type: 'internal' },
  { id: 'rule5', name: 'Chuẩn hóa địa chỉ', category: 'standardization', type: 'internal' },
  { id: 'rule6', name: 'Kiểm tra email', category: 'standardization', type: 'internal' },
  { id: 'rule7', name: 'Kiểm tra số điện thoại', category: 'standardization', type: 'internal' },
  { id: 'rule8', name: 'Loại bỏ khoảng trắng thừa', category: 'cleaning', type: 'internal' },
  { id: 'rule9', name: 'Chuyển đổi định dạng', category: 'transformation', type: 'internal' },
  { id: 'rule10', name: 'Gộp cột thông tin', category: 'transformation', type: 'internal' },
  { id: 'rule11', name: 'Kiểm tra MST', category: 'standardization', type: 'external' },
  { id: 'rule12', name: 'Kiểm tra mã địa giới hành chính', category: 'standardization', type: 'external' },
  { id: 'rule13', name: 'Đối chiếu dữ liệu BCA', category: 'standardization', type: 'external' },
];

export function DataProcessingManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showErrorRecordsModal, setShowErrorRecordsModal] = useState(false);
  const [showDataViewerModal, setShowDataViewerModal] = useState(false);
  const [showClassificationModal, setShowClassificationModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<ProcessingDataItem | null>(null);

  const filteredData = processingDataList.filter(item => {
    const matchSearch = searchTerm === '' || 
      item.dataName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dataType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === '' || item.processingStatus === filterStatus;

    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700"><Clock className="w-3 h-3" />Đang chạy</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" />Đã hoàn thành</span>;
      case 'error':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-red-100 text-red-700"><AlertTriangle className="w-3 h-3" />Lỗi</span>;
      default:
        return null;
    }
  };

  const stats = {
    completed: processingDataList.filter(d => d.processingStatus === 'completed').length,
    completedRecords: processingDataList.filter(d => d.processingStatus === 'completed').reduce((sum, d) => sum + d.processedCount, 0),
    processing: processingDataList.filter(d => d.processingStatus === 'processing').length,
    processingCurrent: processingDataList.filter(d => d.processingStatus === 'processing').reduce((sum, d) => sum + d.processedCount, 0),
    processingTotal: processingDataList.filter(d => d.processingStatus === 'processing').reduce((sum, d) => sum + d.recordCount, 0),
    error: processingDataList.filter(d => d.processingStatus === 'error').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Đã hoàn thành */}
        <button 
          onClick={() => setFilterStatus(filterStatus === 'completed' ? '' : 'completed')}
          className={`bg-white rounded-lg border p-5 text-left transition-all hover:shadow-md ${
            filterStatus === 'completed' ? 'border-2 border-green-400' : 'border-slate-200'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="bg-green-50 p-2.5 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-3xl text-green-600 mb-1">{stats.completed}</p>
              <p className="text-sm text-slate-500">Đã hoàn thành</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">{stats.completedRecords.toLocaleString()} bản ghi thành công</p>
        </button>

        {/* Đang chạy */}
        <button 
          onClick={() => setFilterStatus(filterStatus === 'processing' ? '' : 'processing')}
          className={`bg-white rounded-lg border p-5 text-left transition-all hover:shadow-md ${
            filterStatus === 'processing' ? 'border-2 border-blue-400' : 'border-2 border-blue-300'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="bg-blue-50 p-2.5 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-3xl text-blue-600 mb-1">{stats.processing}</p>
              <p className="text-sm text-slate-500">Đang chạy</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">{stats.processingCurrent.toLocaleString()} / {stats.processingTotal.toLocaleString()} bản ghi</p>
        </button>

        {/* Lỗi xử lý */}
        <button 
          onClick={() => setFilterStatus(filterStatus === 'error' ? '' : 'error')}
          className={`bg-white rounded-lg border p-5 text-left transition-all hover:shadow-md ${
            filterStatus === 'error' ? 'border-2 border-red-400' : 'border-slate-200'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="bg-red-50 p-2.5 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-right">
              <p className="text-3xl text-red-600 mb-1">{stats.error}</p>
              <p className="text-sm text-slate-500">Lỗi xử lý</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">Cần xem xét và xử lý</p>
        </button>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên nguồn, loại nguồn, người thực hiện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Lọc
          </button>
          {showFilterMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 p-3 z-10">
              <p className="text-xs text-slate-500 mb-2 uppercase">Trạng thái</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="radio" 
                    name="status" 
                    value=""
                    checked={filterStatus === ''}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  Tất cả
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="radio" 
                    name="status" 
                    value="processing"
                    checked={filterStatus === 'processing'}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  Đang chạy
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="radio" 
                    name="status" 
                    value="completed"
                    checked={filterStatus === 'completed'}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  Đã hoàn thành
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="radio" 
                    name="status" 
                    value="error"
                    checked={filterStatus === 'error'}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  Lỗi
                </label>
              </div>
            </div>
          )}
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" />
          Xuất báo cáo
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">NGUỒN DỮ LIỆU</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">THỜI GIAN</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">TIẾN ĐỘ</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">QUY TẮC</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">PHÂN LOẠI</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">NGƯỜI THỰC HIỆN</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">TRẠNG THÁI</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.map((item) => {
                const progress = Math.round((item.processedCount / item.recordCount) * 100);
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-slate-900">{item.dataName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.department}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-xs text-slate-500">Bắt đầu:</p>
                        <p className="text-sm text-slate-900">{item.startTime}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-2" style={{ minWidth: '180px' }}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-900">{item.processedCount.toLocaleString()} / {item.recordCount.toLocaleString()}</span>
                          <span className="text-sm text-blue-600">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              item.processingStatus === 'error' ? 'bg-red-500' :
                              item.processingStatus === 'completed' ? 'bg-green-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => {
                          setCurrentItem(item);
                          setShowRulesModal(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                      >
                        {item.appliedRulesCount} quy tắc
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => {
                          setCurrentItem(item);
                          setShowClassificationModal(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors"
                        title="Xem phân loại dữ liệu"
                      >
                        <Tag className="w-3 h-3" />
                        Phân loại
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{item.responsible}</td>
                    <td className="px-4 py-3">{getStatusBadge(item.processingStatus)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {(item.processingStatus === 'completed' || item.processingStatus === 'error') && (
                          <>
                            {item.errorCount && item.errorCount > 0 && (
                              <button 
                                onClick={() => {
                                  setCurrentItem(item);
                                  setShowErrorRecordsModal(true);
                                }}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Sửa lỗi bản ghi"
                              >
                                <AlertTriangle className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                setCurrentItem(item);
                                setShowResultModal(true);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Xem kết quả"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setCurrentItem(item);
                                setShowComparisonModal(true);
                              }}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Đối soát dữ liệu"
                            >
                              <GitCompare className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setCurrentItem(item);
                                setShowDataViewerModal(true);
                              }}
                              className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                              title="Xem dữ liệu"
                            >
                              <Database className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-slate-200 px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <button className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">
              Trước
            </button>
            <button title="Hành động" aria-label="Hành động" className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
              1
            </button>
            <button title="Hành động" aria-label="Hành động" className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">
              2
            </button>
            <button className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-slate-900 mb-3">💡 Về quy trình xử lý dữ liệu</h4>
        <div className="grid grid-cols-3 gap-6 text-sm text-slate-700">
          <div>
            <h5 className="text-blue-900 mb-2">1️⃣ Làm sạch</h5>
            <p>
              Xử lý các vấn đề về định dạng, giá trị thiếu, ngoại lệ. Đảm bảo dữ liệu hợp lệ và đầy đủ.
            </p>
          </div>
          <div>
            <h5 className="text-green-900 mb-2">2️⃣ Chuẩn hóa</h5>
            <p>
              Đảm bảo tính nhất quán, loại bỏ trùng lặp, kiểm tra ràng buộc. Dữ liệu đồng bộ và chính xác.
            </p>
          </div>
          <div>
            <h5 className="text-purple-900 mb-2">3️⃣ Biến đổi</h5>
            <p>
              Tối ưu hóa cấu trúc dữ liệu cho phân tích. Gộp/tách thông tin, phân loại và gán nhãn.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Management Modal */}
      {showRulesModal && currentItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-slate-900">Quản lý Quy tắc Xử lý</h3>
                <p className="text-sm text-slate-500 mt-1">{currentItem.dataName}</p>
              </div>
              <button 
                onClick={() => {
                  setShowRulesModal(false);
                  setCurrentItem(null);
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Available Rules - Internal */}
                <div>
                  <h4 className="text-sm text-slate-900 mb-3">Quy tắc trong ngành (10 quy tắc)</h4>
                  <div className="space-y-2">
                    {availableRules.filter(r => r.type === 'internal').map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg bg-white border-slate-200 hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            rule.category === 'cleaning' ? 'bg-blue-500' :
                            rule.category === 'standardization' ? 'bg-green-500' :
                            'bg-purple-500'
                          }`} />
                          <div>
                            <p className="text-sm text-slate-900">{rule.name}</p>
                            <p className="text-xs text-slate-500">
                              {rule.category === 'cleaning' ? 'Làm sạch' :
                               rule.category === 'standardization' ? 'Chuẩn hóa' :
                               'Biến đổi'}
                            </p>
                          </div>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                          <Plus className="w-3 h-3" />
                          Áp dụng
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Rules - External */}
                <div>
                  <h4 className="text-sm text-slate-900 mb-3">Quy tắc ngoài ngành (3 quy tắc)</h4>
                  <div className="space-y-2">
                    {availableRules.filter(r => r.type === 'external').map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg bg-white border-slate-200 hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                          <div>
                            <p className="text-sm text-slate-900">{rule.name}</p>
                            <p className="text-xs text-slate-500">Chuẩn hóa • Ngoài ngành</p>
                          </div>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                          <Plus className="w-3 h-3" />
                          Áp dụng
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowRulesModal(false);
                  setCurrentItem(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Records Modal */}
      {showErrorRecordsModal && currentItem && (
        <ErrorRecordsList 
          dataName={currentItem.dataName}
          onClose={() => {
            setShowErrorRecordsModal(false);
            setCurrentItem(null);
          }}
        />
      )}

      {/* Result Modal */}
      {showResultModal && currentItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-slate-900">Kết quả xử lý</h3>
                <p className="text-sm text-slate-500 mt-1">{currentItem.dataName}</p>
              </div>
              <button 
                onClick={() => {
                  setShowResultModal(false);
                  setCurrentItem(null);
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-700 mb-1">Tổng bản ghi</p>
                    <p className="text-2xl text-blue-900">{currentItem.recordCount.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-green-700 mb-1">Thành công</p>
                    <p className="text-2xl text-green-900">{(currentItem.processedCount - (currentItem.errorCount || 0)).toLocaleString()}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <p className="text-sm text-red-700 mb-1">Lỗi</p>
                    <p className="text-2xl text-red-900">{currentItem.errorCount || 0}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="text-sm text-slate-900 mb-3">Thông tin chi tiết</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Thời gian bắt đầu:</span>
                      <span className="text-slate-900">{currentItem.startTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Số quy tắc áp dụng:</span>
                      <span className="text-slate-900">{currentItem.appliedRulesCount} quy tắc</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tỷ lệ thành công:</span>
                      <span className="text-green-600">{currentItem.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Người thực hiện:</span>
                      <span className="text-slate-900">{currentItem.responsible}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparisonModal && currentItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-slate-900">Đối soát dữ liệu</h3>
                <p className="text-sm text-slate-500 mt-1">{currentItem.dataName}</p>
              </div>
              <button 
                onClick={() => {
                  setShowComparisonModal(false);
                  setCurrentItem(null);
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Before */}
                <div>
                  <h4 className="text-sm text-slate-900 mb-3">Dữ liệu gốc</h4>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-slate-600 mb-1">Họ và tên:</p>
                        <p className="text-slate-900 font-mono">NGUYEN VAN   A</p>
                      </div>
                      <div>
                        <p className="text-slate-600 mb-1">Ngày sinh:</p>
                        <p className="text-slate-900 font-mono">15/3/1985</p>
                      </div>
                      <div>
                        <p className="text-slate-600 mb-1">CCCD:</p>
                        <p className="text-slate-900 font-mono">001085012345</p>
                      </div>
                      <div>
                        <p className="text-slate-600 mb-1">Địa chỉ:</p>
                        <p className="text-slate-900 font-mono">so 10, ngo 5, pho ABC, phuong XYZ, quan 123, ha noi</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* After */}
                <div>
                  <h4 className="text-sm text-slate-900 mb-3">Dữ liệu sau xử lý</h4>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-slate-600 mb-1">Họ và tên:</p>
                        <p className="text-slate-900 font-mono">Nguyễn Văn A</p>
                      </div>
                      <div>
                        <p className="text-slate-600 mb-1">Ngày sinh:</p>
                        <p className="text-slate-900 font-mono">1985-03-15</p>
                      </div>
                      <div>
                        <p className="text-slate-600 mb-1">CCCD:</p>
                        <p className="text-slate-900 font-mono">001085012345</p>
                      </div>
                      <div>
                        <p className="text-slate-600 mb-1">Địa chỉ:</p>
                        <p className="text-slate-900 font-mono">Số 10, Ngõ 5, Phố ABC, Phường XYZ, Quận 123, Hà Nội</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Dữ liệu đã được chuẩn hóa theo các quy tắc: Chuẩn hóa tên người, Chuẩn hóa ngày tháng, Chuẩn hóa địa chỉ, Loại bỏ khoảng trắng thừa
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Viewer Modal */}
      {showDataViewerModal && currentItem && (
        <DataViewer 
          dataName={currentItem.dataName}
          onClose={() => {
            setShowDataViewerModal(false);
            setCurrentItem(null);
          }}
        />
      )}

      {/* Data Classification Modal */}
      {showClassificationModal && currentItem && (
        <DataClassificationModal 
          config={{ ...currentItem, dataSource: currentItem.dataName }}
          onClose={() => {
            setShowClassificationModal(false);
            setCurrentItem(null);
          }}
        />
      )}
    </div>
  );
}