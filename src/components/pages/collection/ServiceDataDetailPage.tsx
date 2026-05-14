import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Filter, Search, Eye } from 'lucide-react';
import { DataDetailModal } from '../../DataDetailModal';
import { StatusTag } from '../../common/StatusTag';

interface ServiceDataDetailPageProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
}

// Mock data for collected records
const mockCollectedRecords = [
  {
    id: 1,
    recordId: 'REC-2025-001',
    fullName: 'Nguyễn Văn An',
    idNumber: '001234567890',
    birthDate: '15/05/1985',
    phoneNumber: '0912345678',
    address: 'Số 10, Phố Huế, Hai Bà Trưng, Hà Nội',
    status: 'valid',
    statusText: 'Hợp lệ',
    statusColor: 'bg-green-100 text-green-700',
    collectedAt: '19/12/2025 15:30:00',
    recordType: 'Mới'
  },
  {
    id: 2,
    recordId: 'REC-2025-002',
    fullName: 'Trần Thị Bình',
    idNumber: '001234567891',
    birthDate: '20/08/1990',
    phoneNumber: '0987654321',
    address: 'Số 25, Láng Hạ, Đống Đa, Hà Nội',
    status: 'valid',
    statusText: 'Hợp lệ',
    statusColor: 'bg-green-100 text-green-700',
    collectedAt: '19/12/2025 15:30:02',
    recordType: 'Mới'
  },
  {
    id: 3,
    recordId: 'REC-2025-003',
    fullName: 'Lê Văn Cường',
    idNumber: '001234567892',
    birthDate: '31/13/2023',
    phoneNumber: '0901234567',
    address: 'Số 15, Giảng Võ, Ba Đình, Hà Nội',
    statusColor: 'bg-orange-100 text-orange-700',
    collectedAt: '19/12/2025 15:30:05',
    recordType: 'Mới',
    errorField: 'birthDate',
    errorMessage: 'Sai định dạng ngày tháng',
    errorProcessStatus: 'sent',
    errorProcessText: 'Đã gửi hệ thống nguồn'
  },
  {
    id: 4,
    recordId: 'REC-2025-004',
    fullName: 'Phạm Thị Dung',
    idNumber: '001234567893',
    birthDate: '10/03/1988',
    phoneNumber: '123456',
    address: 'Số 30, Trần Phú, Cầu Giấy, Hà Nội',
    status: 'error',
    statusText: 'Lỗi định dạng',
    statusColor: 'bg-orange-100 text-orange-700',
    collectedAt: '19/12/2025 15:30:07',
    recordType: 'Mới',
    errorField: 'phoneNumber',
    errorMessage: 'Sai định dạng số điện thoại',
    errorProcessStatus: 'updated',
    errorProcessText: 'Đã cập nhật lại'
  },
  {
    id: 5,
    recordId: 'REC-2025-005',
    fullName: 'Hoàng Văn Em',
    idNumber: '001234567894',
    birthDate: '25/11/1992',
    phoneNumber: '0945678901',
    address: 'Số 5, Nguyễn Chí Thanh, Đống Đa, Hà Nội',
    status: 'valid',
    statusText: 'Hợp lệ',
    statusColor: 'bg-green-100 text-green-700',
    collectedAt: '19/12/2025 15:30:10',
    recordType: 'Cập nhật'
  },
  {
    id: 6,
    recordId: 'REC-2025-006',
    fullName: 'Vũ Thị Hoa',
    idNumber: '001234567895',
    birthDate: '18/07/1995',
    phoneNumber: '0934567890',
    address: 'Số 12, Xã Đàn, Đống Đa, Hà Nội',
    status: 'valid',
    statusText: 'Hợp lệ',
    statusColor: 'bg-green-100 text-green-700',
    collectedAt: '19/12/2025 15:30:12',
    recordType: 'Mới'
  },
  {
    id: 7,
    recordId: 'REC-2025-007',
    fullName: 'Đỗ Văn Kiên',
    idNumber: 'abc12345',
    birthDate: '05/02/1987',
    phoneNumber: '0923456789',
    address: 'Số 8, Tôn Đức Thắng, Đống Đa, Hà Nội',
    status: 'error',
    statusText: 'Lỗi định dạng',
    statusColor: 'bg-orange-100 text-orange-700',
    collectedAt: '19/12/2025 15:30:15',
    recordType: 'Mới',
    errorField: 'idNumber',
    errorMessage: 'Sai định dạng CMND/CCCD',
    errorProcessStatus: 'pending',
    errorProcessText: 'Chờ xử lý'
  },
  {
    id: 8,
    recordId: 'REC-2025-008',
    fullName: 'Ngô Thị Lan',
    idNumber: '001234567896',
    birthDate: '12/09/1993',
    phoneNumber: '0912345670',
    address: 'Số 20, Nguyễn Lương Bằng, Đống Đa, Hà Nội',
    status: 'valid',
    statusText: 'Hợp lệ',
    statusColor: 'bg-green-100 text-green-700',
    collectedAt: '19/12/2025 15:30:18',
    recordType: 'Cập nhật'
  },
  {
    id: 9,
    recordId: 'REC-2025-009',
    fullName: 'Bùi Văn Minh',
    idNumber: '001234567897',
    birthDate: '28/04/1991',
    phoneNumber: '0956789012',
    address: 'Số 18, Phạm Ngọc Thạch, Đống Đa, Hà Nội',
    status: 'valid',
    statusText: 'Hợp lệ',
    statusColor: 'bg-green-100 text-green-700',
    collectedAt: '19/12/2025 15:30:20',
    recordType: 'Mới'
  },
  {
    id: 10,
    recordId: 'REC-2025-010',
    fullName: 'Lý Thị Nhung',
    idNumber: '001234567898',
    birthDate: '2023-15-45',
    phoneNumber: '0967890123',
    address: 'Số 22, Tây Sơn, Đống Đa, Hà Nội',
    statusColor: 'bg-orange-100 text-orange-700',
    collectedAt: '19/12/2025 15:30:22',
    recordType: 'Mới',
    errorField: 'birthDate',
    errorMessage: 'Sai định dạng ngày tháng',
    errorProcessStatus: 'sent',
    errorProcessText: 'Đã gửi hệ thống nguồn'
  },
  {
    id: 11,
    recordId: 'REC-2025-011',
    fullName: 'Phan Văn Oanh',
    idNumber: '001234567899',
    birthDate: '14/06/1989',
    phoneNumber: '0978901234',
    address: 'Số 35, Khâm Thiên, Đống Đa, Hà Nội',
    status: 'valid',
    statusText: 'Hợp lệ',
    statusColor: 'bg-green-100 text-green-700',
    collectedAt: '19/12/2025 15:30:25',
    recordType: 'Mới'
  },
  {
    id: 12,
    recordId: 'REC-2025-012',
    fullName: 'Đinh Thị Phương',
    idNumber: '001234567900',
    birthDate: '07/12/1994',
    phoneNumber: '0989012345',
    address: 'Số 40, Thái Hà, Đống Đa, Hà Nội',
    status: 'valid',
    statusText: 'Hợp lệ',
    statusColor: 'bg-green-100 text-green-700',
    collectedAt: '19/12/2025 15:30:28',
    recordType: 'Cập nhật'
  }
];

export function ServiceDataDetailPage({ isOpen, onClose, service }: ServiceDataDetailPageProps) {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [recordTypeFilter, setRecordTypeFilter] = useState('all');
  const [errorProcessFilter, setErrorProcessFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedRecordCode, setSelectedRecordCode] = useState('');

  if (!isOpen || !service) return null;

  // Filter records
  const filteredRecords = mockCollectedRecords.filter(record => {
    const matchesSearch = searchText === '' || 
      record.recordId.toLowerCase().includes(searchText.toLowerCase()) ||
      record.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      record.idNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      record.phoneNumber.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesType = recordTypeFilter === 'all' || record.recordType === recordTypeFilter;
    const matchesErrorProcess = errorProcessFilter === 'all' || record.errorProcessStatus === errorProcessFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesErrorProcess;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  const handleExport = () => {
    alert('Đang kết xuất danh sách bản ghi...');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h2 className="text-lg text-slate-900 font-medium">Chi tiết dữ liệu đã thu thập</h2>
            <p className="text-sm text-slate-600 mt-1">
              Dịch vụ: <span className="font-medium text-slate-900">{service.name}</span> ({service.code})
            </p>
          </div>
          <button
            onClick={onClose}
            title="Đóng"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Tổng bản ghi</p>
              <p className="text-2xl text-slate-900 font-semibold">{service.recordsReceived?.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Bản ghi mới</p>
              <p className="text-2xl text-blue-600 font-semibold">{service.recordsNew?.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Bản ghi cập nhật</p>
              <p className="text-2xl text-green-600 font-semibold">{service.recordsUpdated?.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Bản ghi lỗi</p>
              <p className="text-2xl text-orange-600 font-semibold">
                {service.validationDetails?.invalidRecords?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-white border-b border-slate-200">
          <div className="space-y-3">
            {/* Search and Export */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input aria-label="Input field"
                  type="text"
                  placeholder="Tìm kiếm theo mã bản ghi, họ tên, CMND/CCCD, số điện thoại..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Tìm kiếm bản ghi"
                  value={searchText}
                  onChange={(e: any) => setSearchText(e.target.value)}
                />
              </div>
              <button
                onClick={handleExport}
                title="Kết xuất danh sách"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Kết xuất
              </button>
            </div>

            {/* Filter dropdowns */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">Lọc:</span>
              </div>
              <select aria-label="Select box"
                title="Lọc trạng thái dữ liệu"
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="valid">Hợp lệ</option>
                <option value="error">Lỗi định dạng</option>
              </select>
              <select aria-label="Select box"
                title="Lọc loại bản ghi"
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={recordTypeFilter}
                onChange={(e: any) => setRecordTypeFilter(e.target.value)}
              >
                <option value="all">Tất cả loại bản ghi</option>
                <option value="Mới">Bản ghi mới</option>
                <option value="Cập nhật">Bản ghi cập nhật</option>
              </select>
              <select aria-label="Select box"
                title="Lọc xử lý lỗi"
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={errorProcessFilter}
                onChange={(e: any) => setErrorProcessFilter(e.target.value)}
              >
                <option value="all">Tất cả xử lý lỗi</option>
                <option value="sent">Đã gửi hệ thống nguồn</option>
                <option value="updated">Đã cập nhật lại</option>
                <option value="pending">Chờ xử lý</option>
              </select>
              <div className="flex-1"></div>
              <span className="text-sm text-slate-600">
                Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} / {filteredRecords.length} bản ghi
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap w-12">STT</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">Mã bản ghi</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">Họ và tên</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">CMND/CCCD</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">Ngày sinh</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">Số điện thoại</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">Địa chỉ</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">Loại</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">Trạng thái</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">Thời gian thu thập</th>
                <th className="px-4 py-3 text-center text-base font-semibold text-slate-500 whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-sm text-slate-500">
                    Không tìm thấy bản ghi nào
                  </td>
                </tr>
              ) : (
                currentRecords.map((record, index) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                    <td className="px-4 py-3 text-base text-slate-600">{startIndex + index + 1}</td>
                    <td className="px-4 py-3 text-base text-slate-900 font-mono">{record.recordId}</td>
                    <td className="px-4 py-3 text-base text-slate-900">{record.fullName}</td>
                    <td className="px-4 py-3 text-base text-slate-900 font-mono">
                      {record.status === 'error' && record.errorField === 'idNumber' ? (
                        <span className="text-orange-600">{record.idNumber}</span>
                      ) : (
                        record.idNumber
                      )}
                    </td>
                    <td className="px-4 py-3 text-base text-slate-900">
                      {record.status === 'error' && record.errorField === 'birthDate' ? (
                        <span className="text-orange-600">{record.birthDate}</span>
                      ) : (
                        record.birthDate
                      )}
                    </td>
                    <td className="px-4 py-3 text-base text-slate-900 font-mono">
                      {record.status === 'error' && record.errorField === 'phoneNumber' ? (
                        <span className="text-orange-600">{record.phoneNumber}</span>
                      ) : (
                        record.phoneNumber
                      )}
                    </td>
                    <td className="px-4 py-3 text-base text-slate-600 max-w-xs truncate" title={record.address}>
                      {record.address}
                    </td>
                    <td className="px-4 py-3 text-base">
                      <StatusTag 
                        label={record.recordType} 
                        variant={record.recordType === 'Mới' ? 'blue' : 'green'} 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <StatusTag 
                          label={record.statusText} 
                          variant={record.status === 'valid' ? 'green' : 'orange'} 
                        />
                        {record.status === 'error' && record.errorMessage && (
                          <span className="text-xs text-orange-600 ml-1">{record.errorMessage}</span>
                        )}
                        {record.status === 'error' && record.errorProcessStatus && (
                          <div className="mt-1">
                            <StatusTag 
                              label={record.errorProcessText} 
                              variant={record.errorProcessStatus === 'sent' ? 'blue' : record.errorProcessStatus === 'updated' ? 'green' : 'slate'} 
                              className="scale-90 origin-left"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-base text-slate-600">{record.collectedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => {
                            setSelectedRecordCode(record.recordId);
                            setIsDocModalOpen(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Xem hồ sơ gốc (Phiếu ý kiến)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Hiển thị</span>
            <select aria-label="Select box"
              title="Số bản ghi trên trang"
              className="px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={itemsPerPage}
              onChange={(e: any) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-slate-600">bản ghi/trang</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              title="Trang trước"
              className="p-2 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <span className="text-sm text-slate-600">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              title="Trang sau"
              className="p-2 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
      
      {isDocModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <DataDetailModal
            isOpen={isDocModalOpen}
            onClose={() => setIsDocModalOpen(false)}
            title={`Hồ sơ gốc: ${selectedRecordCode}`}
            totalRecords={service.recordsReceived || 0}
            newRecords={service.recordsNew || 0}
            updatedRecords={service.recordsUpdated || 0}
            errorRecords={service.validationDetails?.invalidRecords || 0}
          />
        </div>
      )}
    </div>
  );
}
