import { X, Search, AlertTriangle, Download, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface ErrorRecord {
  id: string;
  recordId: string;
  field: string;
  originalValue: string;
  errorType: string;
  errorTypeColor: 'red' | 'orange' | 'pink';
  description: string;
  suggestion: string;
  status: 'unprocessed' | 'processed';
}

interface ErrorListModalProps {
  dataSource: string;
  onClose: () => void;
}

export function ErrorListModal({ dataSource, onClose }: ErrorListModalProps) {
  const [errorRecords, setErrorRecords] = useState<ErrorRecord[]>([
    {
      id: '1',
      recordId: 'HT-2025-001234',
      field: 'Ngày sinh',
      originalValue: '1/2/1990',
      errorType: 'Sai định dạng',
      errorTypeColor: 'red',
      description: 'Ngày tháng không đúng định dạng DD/MM/YYYY',
      suggestion: '01/02/1990',
      status: 'unprocessed'
    },
    {
      id: '2',
      recordId: 'HT-2025-001235',
      field: 'CCCD',
      originalValue: '123456',
      errorType: 'Thiếu dữ liệu',
      errorTypeColor: 'red',
      description: 'CCCD phải có 12 chữ số',
      suggestion: '001234560000',
      status: 'unprocessed'
    },
    {
      id: '3',
      recordId: 'HT-2025-001236',
      field: 'Họ tên',
      originalValue: 'NGUYEN VAN A',
      errorType: 'Sai định dạng',
      errorTypeColor: 'red',
      description: 'Tên phải viết hoa chữ cái đầu',
      suggestion: 'Nguyễn Văn A',
      status: 'unprocessed'
    },
    {
      id: '4',
      recordId: 'HT-2025-001237',
      field: 'Email',
      originalValue: 'test@invalid',
      errorType: 'Sai định dạng',
      errorTypeColor: 'red',
      description: 'Email không hợp lệ',
      suggestion: 'test@example.com',
      status: 'unprocessed'
    },
    {
      id: '5',
      recordId: 'HT-2025-001238',
      field: 'Số điện thoại',
      originalValue: '987654321',
      errorType: 'Thiếu dữ liệu',
      errorTypeColor: 'red',
      description: 'Số điện thoại phải có 10 chữ số',
      suggestion: '0987654321',
      status: 'unprocessed'
    },
    {
      id: '6',
      recordId: 'HT-2025-001239',
      field: 'Địa chỉ',
      originalValue: '<không>',
      errorType: 'Thiếu dữ liệu',
      errorTypeColor: 'red',
      description: 'Trường địa chỉ không được để trống',
      suggestion: 'Không có',
      status: 'unprocessed'
    },
    {
      id: '7',
      recordId: 'HT-2025-001240',
      field: 'Ngày đăng ký',
      originalValue: '32/13/2025',
      errorType: 'Giá trị không hợp lệ',
      errorTypeColor: 'orange',
      description: 'Ngày tháng không tồn tại',
      suggestion: '08/12/2025',
      status: 'unprocessed'
    },
    {
      id: '8',
      recordId: 'HT-2025-001241',
      field: 'Mã tỉnh/thành',
      originalValue: '99',
      errorType: 'Giá trị không hợp lệ',
      errorTypeColor: 'orange',
      description: 'Mã tỉnh/thành không tồn tại trong danh mục',
      suggestion: '01',
      status: 'unprocessed'
    },
    {
      id: '9',
      recordId: 'HT-2025-001242',
      field: 'Giới tính',
      originalValue: 'M',
      errorType: 'Sai định dạng',
      errorTypeColor: 'red',
      description: 'Giới tính phải là Nam hoặc Nữ',
      suggestion: 'Nam',
      status: 'unprocessed'
    },
    {
      id: '10',
      recordId: 'HT-2025-001243',
      field: 'Quốc tịch',
      originalValue: 'VN',
      errorType: 'Thiếu dữ liệu',
      errorTypeColor: 'red',
      description: 'Quốc tịch phải ghi đầy đủ',
      suggestion: 'Việt Nam',
      status: 'processed'
    },
    {
      id: '11',
      recordId: 'HT-2025-001244',
      field: 'Dân tộc',
      originalValue: 'Kinh',
      errorType: 'Sai định dạng',
      errorTypeColor: 'red',
      description: 'Dân tộc không khớp với danh mục',
      suggestion: 'Kinh',
      status: 'processed'
    },
    {
      id: '12',
      recordId: 'HT-2025-001245',
      field: 'Số hộ khẩu',
      originalValue: '---',
      errorType: 'Thiếu dữ liệu',
      errorTypeColor: 'red',
      description: 'Số hộ khẩu không hợp lệ',
      suggestion: 'Không có',
      status: 'unprocessed'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [errorTypeFilter, setErrorTypeFilter] = useState<string>('all');
  const [showSendToSourceModal, setShowSendToSourceModal] = useState(false);
  const [showSendAllModal, setShowSendAllModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ErrorRecord | null>(null);

  // Statistics
  const totalCount = errorRecords.length;
  const unprocessedCount = errorRecords.filter(r => r.status === 'unprocessed').length;
  const processedCount = errorRecords.filter(r => r.status === 'processed').length;

  // Filtered records
  const filteredRecords = errorRecords.filter(record => {
    const matchesSearch = 
      record.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesErrorType = errorTypeFilter === 'all' || record.errorType === errorTypeFilter;

    return matchesSearch && matchesStatus && matchesErrorType;
  });

  const handleSendToSource = (record: ErrorRecord) => {
    setSelectedRecord(record);
    setShowSendToSourceModal(true);
  };

  const confirmSendToSource = () => {
    if (selectedRecord) {
      // Cập nhật trạng thái thành "processed"
      setErrorRecords(prev => 
        prev.map(record => 
          record.id === selectedRecord.id ? { ...record, status: 'processed' as const } : record
        )
      );
      
      // Hiển thị thông báo thành công
      toast.success('Đã gửi bản ghi lỗi về hệ thống nguồn', {
        description: `Mã bản ghi: ${selectedRecord.recordId} - Trường: ${selectedRecord.field}`,
      });
      
      setShowSendToSourceModal(false);
      setSelectedRecord(null);
    }
  };

  const handleSendAll = () => {
    setShowSendAllModal(true);
  };

  const confirmSendAll = () => {
    // Lấy tất cả bản ghi chưa xử lý
    const unprocessedRecords = filteredRecords.filter(r => r.status === 'unprocessed');
    
    // Cập nhật trạng thái tất cả thành "processed"
    setErrorRecords(prev =>
      prev.map(record =>
        unprocessedRecords.some(ur => ur.id === record.id) ? { ...record, status: 'processed' as const } : record
      )
    );
    
    // Hiển thị thông báo thành công
    toast.success('Đã gửi tất cả bản ghi lỗi về hệ thống nguồn', {
      description: `Đã gửi ${unprocessedRecords.length} bản ghi lỗi`,
    });
    
    setShowSendAllModal(false);
  };

  const getErrorTypeBadge = (type: string, color: 'red' | 'orange' | 'pink') => {
    const colorClasses = {
      red: 'bg-red-50 text-red-700 border-red-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
      pink: 'bg-pink-50 text-pink-700 border-pink-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs border ${colorClasses[color]}`}>
        {type}
      </span>
    );
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-slate-900">Danh sách Bản ghi Lỗi</h3>
                <p className="text-xs text-slate-500 mt-0.5">Dữ liệu đăng ký khai sinh</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="px-6 pt-4 pb-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="text-xs text-red-600 mb-1">Tổng lỗi</div>
                <div className="text-2xl text-red-700">{totalCount}</div>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="text-xs text-orange-600 mb-1">Chưa xử lý</div>
                <div className="text-2xl text-orange-700">{unprocessedCount}</div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="text-xs text-green-600 mb-1">Đã xử lý</div>
                <div className="text-2xl text-green-700">{processedCount}</div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="px-6 pb-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã bản ghi, trường dữ liệu, lỗi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="unprocessed">Chưa xử lý</option>
                <option value="processed">Đã xử lý</option>
              </select>
              <select
                value={errorTypeFilter}
                onChange={(e) => setErrorTypeFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả loại lỗi</option>
                <option value="Sai định dạng">Sai định dạng</option>
                <option value="Thiếu dữ liệu">Thiếu dữ liệu</option>
                <option value="Giá trị không hợp lệ">Giá trị không hợp lệ</option>
              </select>
            </div>
            <div className="text-xs text-slate-500">
              Hiển thị {filteredRecords.length} / {totalCount} bản ghi
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto px-6">
            <table className="w-full">
              <thead className="bg-slate-50 sticky top-0">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã bản ghi</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trường dữ liệu</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Giá trị gốc</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Loại lỗi</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mô tả lỗi</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredRecords.map((record, index) => (
                  <tr 
                    key={record.id} 
                    className={`border-b border-slate-100 hover:bg-slate-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-slate-900">{record.recordId}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{record.field}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-red-600 line-through">{record.originalValue}</span>
                    </td>
                    <td className="px-4 py-3">
                      {getErrorTypeBadge(record.errorType, record.errorTypeColor)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{record.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${
                        record.status === 'unprocessed' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {record.status === 'unprocessed' ? 'Chưa xử lý' : 'Đã xử lý'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {record.status === 'unprocessed' && (
                          <button
                            onClick={() => handleSendToSource(record)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Gửi hệ thống nguồn"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="text-sm text-slate-600">
              {unprocessedCount} bản ghi chưa xử lý • {processedCount} đã xử lý
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors"
              >
                Đóng
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Xuất danh sách lỗi
              </button>
              {unprocessedCount > 0 && (
                <button
                  onClick={handleSendAll}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Gửi tất cả về hệ thống nguồn
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Gửi hệ thống nguồn */}
      {showSendToSourceModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-slate-900">Gửi bản ghi lỗi về hệ thống nguồn</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Yêu cầu hệ thống nguồn xem xét và xử lý</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-slate-700 mb-4">
                Bản ghi này sẽ được gửi về hệ thống nguồn để xem xét và xử lý. Vui lòng xác nhận thông tin trước khi gửi:
              </p>
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm text-slate-700 mb-3">Thông tin bản ghi</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Mã bản ghi:</span>
                      <span className="text-slate-900">{selectedRecord.recordId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Trường dữ liệu:</span>
                      <span className="text-slate-900">{selectedRecord.field}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-sm text-red-700 mb-3">Thông tin lỗi</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">Loại lỗi:</span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
                        {selectedRecord.errorType}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-red-600 block mb-1">Mô tả lỗi:</span>
                      <div className="flex items-start gap-2 bg-white border border-red-200 rounded p-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{selectedRecord.description}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowSendToSourceModal(false);
                  setSelectedRecord(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmSendToSource}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Xác nhận gửi về hệ thống nguồn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gửi tất cả */}
      {showSendAllModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-slate-900">Gửi tất cả bản ghi lỗi</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Gửi hàng loạt về hệ thống nguồn</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-slate-700 mb-4">
                Bạn có chắc chắn muốn gửi <strong className="text-blue-600">{filteredRecords.filter(r => r.status === 'unprocessed').length} bản ghi lỗi</strong> về hệ thống nguồn để xử lý?
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800 mb-2">
                      <strong>Lưu ý quan trọng:</strong>
                    </p>
                    <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Tất cả các bản ghi chưa xử lý sẽ được gửi về hệ thống nguồn</li>
                      <li>Hệ thống nguồn sẽ nhận thông báo và tiến hành xem xét</li>
                      <li>Quá trình xử lý có thể mất thời gian tùy theo số lượng bản ghi</li>
                      <li>Sau khi gửi, trạng thái các bản ghi sẽ được cập nhật thành "Đã xử lý"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowSendAllModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmSendAll}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Xác nhận gửi tất cả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}