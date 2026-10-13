import { useState } from 'react';
import { Search, AlertTriangle, X, Clock, Eye, Download, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ErrorRecord {
  id: number;
  recordId: string;
  fieldName: string;
  originalValue: string | null;
  errorType: string;
  errorMessage: string;
  suggestedValue?: string;
  status: 'unprocessed' | 'processed' | 'pending';
}

interface ErrorRecordsListProps {
  dataName: string;
  onClose: () => void;
}

// Dữ liệu mẫu bản ghi lỗi
const errorRecords: ErrorRecord[] = [
  {
    id: 1,
    recordId: 'HT-2025-001234',
    fieldName: 'Ngày sinh',
    originalValue: '1/2/1990',
    errorType: 'Sai định dạng',
    errorMessage: 'Ngày tháng không đúng định dạng DD/MM/YYYY',
    suggestedValue: '01/02/1990',
    status: 'unprocessed'
  },
  {
    id: 2,
    recordId: 'HT-2025-001235',
    fieldName: 'CCCD',
    originalValue: '123456',
    errorType: 'Thiếu dữ liệu',
    errorMessage: 'CCCD phải có 12 chữ số',
    suggestedValue: '001234560000',
    status: 'unprocessed'
  },
  {
    id: 3,
    recordId: 'HT-2025-001236',
    fieldName: 'Họ tên',
    originalValue: 'NGUYEN VAN A',
    errorType: 'Sai định dạng',
    errorMessage: 'Tên phải viết hoa chữ cái đầu',
    suggestedValue: 'Nguyễn Văn A',
    status: 'unprocessed'
  },
  {
    id: 4,
    recordId: 'HT-2025-001237',
    fieldName: 'Email',
    originalValue: 'test@invalid',
    errorType: 'Sai định dạng',
    errorMessage: 'Email không hợp lệ',
    suggestedValue: 'test@example.com',
    status: 'unprocessed'
  },
  {
    id: 5,
    recordId: 'HT-2025-001238',
    fieldName: 'Số điện thoại',
    originalValue: '98765432',
    errorType: 'Thiếu dữ liệu',
    errorMessage: 'Số điện thoại phải có 10 chữ số',
    suggestedValue: '0987654321',
    status: 'unprocessed'
  },
  {
    id: 6,
    recordId: 'HT-2025-001239',
    fieldName: 'Địa chỉ',
    originalValue: '',
    errorType: 'Thiếu dữ liệu',
    errorMessage: 'Trường địa chỉ không được để trống',
    status: 'unprocessed'
  },
  {
    id: 7,
    recordId: 'HT-2025-001240',
    fieldName: 'Ngày đăng ký',
    originalValue: '32/13/2025',
    errorType: 'Giá trị không hợp lệ',
    errorMessage: 'Ngày tháng không tồn tại',
    suggestedValue: '08/12/2025',
    status: 'unprocessed'
  },
  {
    id: 8,
    recordId: 'HT-2025-001241',
    fieldName: 'Mã tỉnh/thành',
    originalValue: '99',
    errorType: 'Giá trị không hợp lệ',
    errorMessage: 'Mã tỉnh/thành không tồn tại trong danh mục',
    suggestedValue: '01',
    status: 'unprocessed'
  },
  {
    id: 9,
    recordId: 'HT-2025-001242',
    fieldName: 'Giới tính',
    originalValue: 'M',
    errorType: 'Sai định dạng',
    errorMessage: 'Giá trị phải là "Nam" hoặc "Nữ"',
    suggestedValue: 'Nam',
    status: 'processed'
  },
  {
    id: 10,
    recordId: 'HT-2025-001243',
    fieldName: 'Quốc tịch',
    originalValue: 'VN',
    errorType: 'Sai định dạng',
    errorMessage: 'Quốc tịch phải ghi đầy đủ',
    suggestedValue: 'Việt Nam',
    status: 'processed'
  },
  {
    id: 11,
    recordId: 'HT-2025-001244',
    fieldName: 'Nghề nghiệp',
    originalValue: null,
    errorType: 'Thiếu dữ liệu',
    errorMessage: 'Trường nghề nghiệp không được để trống',
    status: 'unprocessed'
  },
  {
    id: 12,
    recordId: 'HT-2025-001245',
    fieldName: 'Trình độ học vấn',
    originalValue: 'ĐH',
    errorType: 'Sai định dạng',
    errorMessage: 'Trình độ phải ghi đầy đủ',
    suggestedValue: 'Đại học',
    status: 'pending'
  },
];

export function ErrorRecordsList({ dataName, onClose }: ErrorRecordsListProps) {
  const [records, setRecords] = useState<ErrorRecord[]>(errorRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterErrorType, setFilterErrorType] = useState<string>('');
  const [showSendToSourceModal, setShowSendToSourceModal] = useState(false);
  const [showSendAllModal, setShowSendAllModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ErrorRecord | null>(null);

  const errorTypes = Array.from(new Set(records.map(r => r.errorType)));

  const filteredRecords = records.filter(record => {
    const matchSearch = searchTerm === '' || 
      record.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.errorMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === '' || record.status === filterStatus;
    const matchErrorType = filterErrorType === '' || record.errorType === filterErrorType;

    return matchSearch && matchStatus && matchErrorType;
  });

  const handleSendToSource = (record: ErrorRecord) => {
    setSelectedRecord(record);
    setShowSendToSourceModal(true);
  };

  const confirmSendToSource = () => {
    if (selectedRecord) {
      // Cập nhật trạng thái thành "processed"
      setRecords(records.map(r => 
        r.id === selectedRecord.id ? { ...r, status: 'processed' as const } : r
      ));
      
      // Hiển thị thông báo thành công
      toast.success('Đã gửi bản ghi lỗi về hệ thống nguồn', {
        description: `Mã bản ghi: ${selectedRecord.recordId} - Trường: ${selectedRecord.fieldName}`,
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
    setRecords(records.map(r => 
      unprocessedRecords.some(ur => ur.id === r.id) ? { ...r, status: 'processed' as const } : r
    ));
    
    // Hiển thị thông báo thành công
    toast.success('Đã gửi tất cả bản ghi lỗi về hệ thống nguồn', {
      description: `Đã gửi ${unprocessedRecords.length} bản ghi lỗi`,
    });
    
    setShowSendAllModal(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unprocessed':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700"><Clock className="w-3 h-3" />Chưa xử lý</span>;
      case 'processed':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><Eye className="w-3 h-3" />Đã xử lý</span>;
      default:
        return null;
    }
  };

  const stats = {
    total: records.length,
    unprocessed: records.filter(r => r.status === 'unprocessed').length,
    processed: records.filter(r => r.status === 'processed').length,
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-slate-900">Danh sách Bản ghi Lỗi</h3>
              <p className="text-sm text-slate-500 mt-1">{dataName}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-600 mb-1">Tổng lỗi</p>
              <p className="text-xl text-red-900">{stats.total}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-xs text-orange-600 mb-1">Chưa xử lý</p>
              <p className="text-xl text-orange-900">{stats.unprocessed}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-600 mb-1">Đã xử lý</p>
              <p className="text-xl text-green-900">{stats.processed}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-slate-200 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã bản ghi, trường dữ liệu, lỗi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-2 gap-3">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="unprocessed">Chưa xử lý</option>
              <option value="processed">Đã xử lý</option>
            </select>
            <select 
              value={filterErrorType}
              onChange={(e) => setFilterErrorType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả loại lỗi</option>
              {errorTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Count */}
          <p className="text-sm text-slate-600">
            Hiển thị {filteredRecords.length} / {records.length} bản ghi
          </p>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">MÃ BẢN GHI</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">TRƯỜNG DỮ LIỆU</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">GIÁ TRỊ GỐC</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">LOẠI LỖI</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">MÔ TẢ LỖI</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">TRẠNG THÁI</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-900">{record.recordId}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{record.fieldName}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-red-600 line-through">
                      {record.originalValue || <span className="text-slate-400 italic">{'<trống>'}</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                      {record.errorType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 max-w-xs">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{record.errorMessage}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {record.status === 'unprocessed' && (
                        <>
                          <button 
                            onClick={() => handleSendToSource(record)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Gửi hệ thống nguồn"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            <span className="text-orange-600">{stats.unprocessed}</span> bản ghi chưa xử lý • 
            <span className="text-green-600 ml-1">{stats.processed}</span> đã xử lý
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
            >
              Đóng
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              Xuất danh sách lỗi
            </button>
            {stats.unprocessed > 0 && (
              <button 
                onClick={handleSendAll}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Gửi tất cả về hệ thống nguồn
              </button>
            )}
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
              
              {/* Thông tin chi tiết */}
              <div className="space-y-4">
                {/* Thông tin bản ghi */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm text-slate-700 mb-3">Thông tin bản ghi</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Mã bản ghi:</span>
                      <span className="text-slate-900">{selectedRecord.recordId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Trường dữ liệu:</span>
                      <span className="text-slate-900">{selectedRecord.fieldName}</span>
                    </div>
                  </div>
                </div>

                {/* Thông tin lỗi */}
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
                        <span className="text-slate-700">{selectedRecord.errorMessage}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Giá trị dữ liệu */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm text-blue-700 mb-3">Giá trị dữ liệu</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-slate-600 block mb-1">Giá trị gốc (bị lỗi):</span>
                      <div className="bg-white border border-slate-200 rounded p-2">
                        <span className="text-sm text-red-600 line-through">
                          {selectedRecord.originalValue || <span className="text-slate-400 italic">{'<trống>'}</span>}
                        </span>
                      </div>
                    </div>
                    {selectedRecord.suggestedValue && (
                      <div>
                        <span className="text-xs text-slate-600 block mb-1">Giá trị đề xuất:</span>
                        <div className="bg-white border border-green-200 rounded p-2">
                          <span className="text-sm text-green-700">
                            {selectedRecord.suggestedValue}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ghi chú */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Lưu ý:</strong> Sau khi gửi, hệ thống nguồn sẽ nhận được thông báo và tiến hành xem xét, xử lý bản ghi lỗi này. Quá trình xử lý có thể mất một khoảng thời gian tùy thuộc vào độ phức tạp của lỗi.
                </p>
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

              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tổng số bản ghi lỗi:</span>
                    <span className="text-slate-900">{filteredRecords.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Số bản ghi sẽ gửi:</span>
                    <span className="text-blue-700 font-medium">{filteredRecords.filter(r => r.status === 'unprocessed').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Số bản ghi đã xử lý:</span>
                    <span className="text-green-700">{filteredRecords.filter(r => r.status === 'processed').length}</span>
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
