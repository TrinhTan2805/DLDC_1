import { X, Search, AlertTriangle, SquarePen, Check, Download, RefreshCw, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { EditRecordModal } from './EditRecordModal';

interface ErrorRecord {
  id: string;
  recordId: string;
  field: string;
  originalValue: string;
  errorType: string;
  errorTypeColor: 'red' | 'orange' | 'pink';
  description: string;
  suggestion: string;
  status: 'pending' | 'fixed' | 'ignored';
  masterData?: string;
  masterDataChecked?: boolean;
  isMatchWithMaster?: boolean;
}

export function WarningDataList() {
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [errorTypeFilter, setErrorTypeFilter] = useState('all');
  const [showFixAllModal, setShowFixAllModal] = useState(false);
  const [masterDataStatus, setMasterDataStatus] = useState<Record<string, { loading: boolean; data?: string; isMatch?: boolean }>>({});

  const errorRecords: ErrorRecord[] = [
    {
      id: '1',
      recordId: 'HT-2025-001234',
      field: 'Ngày sinh',
      originalValue: '1/2/1990',
      errorType: 'Sai định dạng',
      errorTypeColor: 'red',
      description: 'Ngày tháng không đúng định dạng DD/MM/YYYY',
      suggestion: '01/02/1990',
      status: 'pending'
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
      status: 'pending'
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
      status: 'pending'
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
      status: 'pending'
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
      status: 'pending'
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
      status: 'pending'
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
      status: 'pending'
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
      status: 'pending'
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
      status: 'pending'
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
      status: 'fixed'
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
      status: 'fixed'
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
      status: 'ignored'
    }
  ];

  // Statistics
  const totalCount = errorRecords.length;
  const pendingCount = errorRecords.filter(r => r.status === 'pending').length;
  const fixedCount = errorRecords.filter(r => r.status === 'fixed').length;
  const ignoredCount = errorRecords.filter(r => r.status === 'ignored').length;

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

  const handleAutoFix = (id: string) => {
    const updatedRecords = errorRecords.map(record => 
      record.id === id ? { ...record, status: 'fixed' as const } : record
    );
    // Update the state with the new records
    // setErrorRecords(updatedRecords);
  };

  const handleIgnore = (id: string) => {
    const updatedRecords = errorRecords.map(record => 
      record.id === id ? { ...record, status: 'ignored' as const } : record
    );
    // Update the state with the new records
    // setErrorRecords(updatedRecords);
  };

  const handleManualSave = (id: string, newValue: string) => {
    const updatedRecords = errorRecords.map(record => 
      record.id === id ? { ...record, originalValue: newValue, status: 'fixed' as const } : record
    );
    // Update the state with the new records
    // setErrorRecords(updatedRecords);
  };

  const handleFixAll = () => {
    const pendingRecords = errorRecords.filter(r => r.status === 'pending');
    if (pendingRecords.length === 0) {
      alert('Không có bản ghi nào cần sửa!');
      return;
    }
    
    // Apply all suggestions
    const updatedRecords = errorRecords.map(record => 
      record.status === 'pending' ? { ...record, status: 'fixed' as const } : record
    );
    // Update the state with the new records
    // setErrorRecords(updatedRecords);
    
    setShowFixAllModal(false);
    alert(`Đã áp dụng đề xuất cho ${pendingRecords.length} bản ghi!`);
  };

  const handleCheckMasterData = async (recordId: string, field: string, originalValue: string) => {
    // Set loading state
    setMasterDataStatus(prev => ({
      ...prev,
      [recordId]: { loading: true }
    }));

    // Simulate API call (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock master data response based on field type
    const mockMasterData: Record<string, string> = {
      'Ngày sinh': '01/02/1990',
      'CCCD': '001234567890',
      'Họ tên': 'Nguyễn Văn A',
      'Email': 'test@example.com',
      'Số điện thoại': '0987654321',
      'Địa chỉ': 'Số 123, Đường ABC, Quận 1',
      'Ngày đăng ký': '08/12/2025',
      'Mã tỉnh/thành': '01',
      'Giới tính': 'Nam',
      'Quốc tịch': 'Việt Nam',
      'Dân tộc': 'Kinh',
      'Số hộ khẩu': 'HK123456'
    };

    const masterData = mockMasterData[field] || originalValue;
    const isMatch = originalValue.trim().toLowerCase() === masterData.trim().toLowerCase();

    // Update state with result
    setMasterDataStatus(prev => ({
      ...prev,
      [recordId]: {
        loading: false,
        data: masterData,
        isMatch: isMatch
      }
    }));
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
    <div className="space-y-4">
      {/* Header with Title */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div>
          <h3 className="text-slate-900">Danh sách Bản ghi Lỗi</h3>
          <p className="text-xs text-slate-500 mt-0.5">Dữ liệu đăng ký khai sinh</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="text-xs text-red-600 mb-1">Tổng lỗi</div>
          <div className="text-2xl text-red-700">{totalCount}</div>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
          <div className="text-xs text-orange-600 mb-1">Chờ xử lý</div>
          <div className="text-2xl text-orange-700">{pendingCount}</div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="text-xs text-green-600 mb-1">Đã sửa</div>
          <div className="text-2xl text-green-700">{fixedCount}</div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-600 mb-1">Bỏ qua</div>
          <div className="text-2xl text-slate-700">{ignoredCount}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
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
            <option value="pending">Chờ xử lý</option>
            <option value="fixed">Đã sửa</option>
            <option value="ignored">Bỏ qua</option>
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
          {pendingCount > 0 && (
            <button
              onClick={() => setShowFixAllModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
            >
              <Check className="w-4 h-4" />
              Sửa tất cả ({pendingCount})
            </button>
          )}
        </div>
        <div className="text-xs text-slate-500">
          Hiển thị {filteredRecords.length} / {totalCount} bản ghi
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 sticky top-0">
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã bản ghi</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trường dữ liệu</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Giá trị gốc</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Dữ liệu chủ</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Loại lỗi</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mô tả lỗi</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Đề xuất</th>
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
                    {masterDataStatus[record.recordId] ? (
                      masterDataStatus[record.recordId].loading ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                          <span className="text-sm text-blue-600">Đang kiểm tra...</span>
                        </div>
                      ) : (
                        <div className={`flex items-center gap-2 px-3 py-2 rounded ${
                          masterDataStatus[record.recordId].isMatch 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          {masterDataStatus[record.recordId].isMatch ? (
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-red-600 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${
                            masterDataStatus[record.recordId].isMatch 
                              ? 'text-green-700' 
                              : 'text-red-700'
                          }`}>
                            {masterDataStatus[record.recordId].data}
                          </span>
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => handleCheckMasterData(record.recordId, record.field, record.originalValue)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 border border-blue-200 rounded transition-colors"
                        title="Kiểm tra dữ liệu chủ"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Kiểm tra
                      </button>
                    )}
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
                    <span className="text-sm text-blue-600">{record.suggestion || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${
                      record.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      record.status === 'fixed' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {record.status === 'pending' ? 'Chờ xử lý' :
                       record.status === 'fixed' ? 'Đã sửa' : 'Bỏ qua'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Sửa thủ công"
                      >
                        <SquarePen className="w-4 h-4" />
                      </button>
                      {record.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAutoFix(record.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Áp dụng đề xuất"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleIgnore(record.id)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                            title="Bỏ qua"
                          >
                            <X className="w-4 h-4" />
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
      </div>

      {/* Footer */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            {pendingCount} bản ghi chờ xử lý • {fixedCount} đã sửa • {ignoredCount} bỏ qua
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Xuất danh sách lỗi
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lưu tất cả thay đổi
            </button>
          </div>
        </div>
      </div>

      {/* Edit Record Modal */}
      {selectedRecord && (
        <EditRecordModal
          record={{
            id: selectedRecord.id,
            recordId: selectedRecord.recordId,
            field: selectedRecord.field,
            originalValue: selectedRecord.originalValue,
            errorType: selectedRecord.errorType,
            errorLevel: 'critical' as any,
            description: selectedRecord.description,
            suggestion: selectedRecord.suggestion,
            status: selectedRecord.status
          }}
          onClose={() => setSelectedRecord(null)}
          onSave={handleManualSave}
        />
      )}

      {/* Fix All Confirmation Modal */}
      {showFixAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-slate-900">Xác nhận sửa tất cả</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 mb-2">
                    Áp dụng đề xuất cho {pendingCount} bản ghi?
                  </h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Hệ thống sẽ tự động áp dụng các giá trị đề xuất cho tất cả {pendingCount} bản ghi đang ở trạng thái "Chờ xử lý". 
                    Thao tác này có thể được hoàn tác sau khi lưu.
                  </p>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h5 className="text-sm text-purple-900 mb-3">Thống kê bản ghi sẽ được sửa:</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-700">Sai định dạng:</span>
                        <span className="text-slate-900">
                          {errorRecords.filter(r => r.status === 'pending' && r.errorType === 'Sai định dạng').length} bản ghi
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Thiếu dữ liệu:</span>
                        <span className="text-slate-900">
                          {errorRecords.filter(r => r.status === 'pending' && r.errorType === 'Thiếu dữ liệu').length} bản ghi
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Giá trị không hợp lệ:</span>
                        <span className="text-slate-900">
                          {errorRecords.filter(r => r.status === 'pending' && r.errorType === 'Giá trị không hợp lệ').length} bản ghi
                        </span>
                      </div>
                      <div className="pt-2 border-t border-purple-200 flex justify-between">
                        <span className="text-purple-900">Tổng cộng:</span>
                        <span className="text-purple-900">{pendingCount} bản ghi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowFixAllModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleFixAll}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Xác nhận sửa tất cả
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}