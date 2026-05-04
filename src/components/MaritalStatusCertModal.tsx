import { X, Search, Filter, Download, XCircle, CheckCircle, AlertCircle, Eye, RefreshCw, Calendar, ArrowUp } from 'lucide-react';
import { useState } from 'react';

export interface MaritalStatusCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
}

export interface MaritalStatusCertRecord {
  id: string;
  status: 'approved' | 'pending' | 'error';
  hasError?: boolean;
  errorMessage?: string;

  // Tab 1: Bộ dữ liệu hồ sơ cấp XNTTHN
  fileId?: string;
  recordCode?: string;
  registrationNumber?: string;
  bookNumber?: string;
  pageNumber?: string;

  // Tab 2: Thông tin về người được cấp XNTTHN
  grantedPersonName: string;
  grantedPersonGender: string;
  grantedPersonBirthDate: string;
  grantedPersonBirthPlace: string;
  grantedPersonEthnicity: string;
  grantedPersonNationality: string;
  grantedPersonIdIssueDate?: string;
  grantedPersonIdIssuePlace?: string;
  grantedPersonIdNumber?: string;
  grantedPersonPersonalId: string;
  residenceAddress?: string;
  residenceFromDate?: string;
  residenceToDate?: string;
  maritalStatus: string;
  purposeOfUse?: string;
  purposeDetail?: string;

  // Tab 3: Thông tin về người đề nghị cấp XNTTHN
  requesterName: string;
  requesterRelationship: string;
  requesterIdIssueDate?: string;
  requesterIdIssuePlace?: string;
  requesterIdNumber?: string;
  requesterPersonalId?: string;

  // Tab 4: Thông tin khác
  certIssueDate: string;
  certIssuePlace: string;
  signerName?: string;
  signerPosition?: string;
  implementer?: string;
  notes?: string;
}

export function MaritalStatusCertModal({ 
  isOpen, 
  onClose, 
  title, 
  totalRecords,
  newRecords,
  updatedRecords,
  errorRecords
}: MaritalStatusCertModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<MaritalStatusCertRecord | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  if (!isOpen) return null;

  // Mock data
  const records: MaritalStatusCertRecord[] = [
    {
      id: '1',
      status: 'approved',
      recordCode: 'XN-2023-001234',
      registrationNumber: '001234/2023',
      bookNumber: '1',
      pageNumber: '15',
      
      grantedPersonName: 'Nguyễn Văn Nam',
      grantedPersonGender: 'Nam',
      grantedPersonBirthDate: '15/03/1990',
      grantedPersonBirthPlace: 'Hà Nội',
      grantedPersonEthnicity: 'Kinh',
      grantedPersonNationality: 'Việt Nam',
      grantedPersonIdIssueDate: '01/01/2015',
      grantedPersonIdIssuePlace: 'Cục Cảnh sát QLHC về TTXH',
      grantedPersonIdNumber: '001090001234',
      grantedPersonPersonalId: '001090001234',
      residenceAddress: '123 Láng Hạ, Đống Đa, Hà Nội',
      residenceFromDate: '01/01/2000',
      residenceToDate: '10/10/2023',
      maritalStatus: 'Chưa đăng ký kết hôn',
      purposeOfUse: 'Đăng ký kết hôn',
      purposeDetail: 'Để làm thủ tục đăng ký kết hôn tại UBND phường',

      requesterName: 'Nguyễn Văn Nam',
      requesterRelationship: 'Bản thân',
      requesterIdIssueDate: '01/01/2015',
      requesterIdIssuePlace: 'Cục Cảnh sát QLHC về TTXH',
      requesterIdNumber: '001090001234',
      requesterPersonalId: '001090001234',

      certIssueDate: '10/10/2023',
      certIssuePlace: 'UBND Phường Láng Hạ, Quận Đống Đa, Hà Nội',
      signerName: 'Trần Văn A',
      signerPosition: 'Chủ tịch UBND Phường',
      implementer: 'Lê Thị B',
      notes: ''
    },
    {
      id: '2',
      status: 'pending',
      recordCode: 'XN-2023-005678',
      registrationNumber: '005678/2023',
      bookNumber: '2',
      pageNumber: '42',
      
      grantedPersonName: 'Trần Thị Lan',
      grantedPersonGender: 'Nữ',
      grantedPersonBirthDate: '20/05/1995',
      grantedPersonBirthPlace: 'Nam Định',
      grantedPersonEthnicity: 'Kinh',
      grantedPersonNationality: 'Việt Nam',
      grantedPersonIdIssueDate: '10/08/2016',
      grantedPersonIdIssuePlace: 'Cục Cảnh sát QLHC về TTXH',
      grantedPersonIdNumber: '036195005678',
      grantedPersonPersonalId: '036195005678',
      residenceAddress: '456 Hai Bà Trưng, Quận 3, TP.HCM',
      residenceFromDate: '15/09/2015',
      residenceToDate: '05/12/2023',
      maritalStatus: 'Đã ly hôn',
      purposeOfUse: 'Vay vốn ngân hàng',
      purposeDetail: 'Xác nhận để làm hồ sơ vay vốn ngân hàng mua nhà',

      requesterName: 'Trần Thị Lan',
      requesterRelationship: 'Bản thân',
      requesterIdIssueDate: '10/08/2016',
      requesterIdIssuePlace: 'Cục Cảnh sát QLHC về TTXH',
      requesterIdNumber: '036195005678',
      requesterPersonalId: '036195005678',

      certIssueDate: '05/12/2023',
      certIssuePlace: 'UBND Phường 8, Quận 3, TP.HCM',
      signerName: 'Nguyễn C',
      signerPosition: 'Phó Chủ tịch UBND',
      implementer: 'Phạm Thị D',
      notes: ''
    },
    {
      id: '3',
      status: 'error',
      hasError: true,
      errorMessage: 'Số định danh cá nhân không hợp lệ',
      recordCode: 'XN-2023-009999',
      registrationNumber: '009999/2023',
      bookNumber: '3',
      pageNumber: '10',
      
      grantedPersonName: 'Hoàng Minh Tuấn',
      grantedPersonGender: 'Nam',
      grantedPersonBirthDate: '12/11/1988',
      grantedPersonBirthPlace: 'Hải Phòng',
      grantedPersonEthnicity: 'Kinh',
      grantedPersonNationality: 'Việt Nam',
      grantedPersonIdIssueDate: '20/05/2014',
      grantedPersonIdIssuePlace: 'Cục Cảnh sát QLHC về TTXH',
      grantedPersonIdNumber: '031088',
      grantedPersonPersonalId: '031088', // Lỗi format
      residenceAddress: '789 Lê Lợi, Ngô Quyền, Hải Phòng',
      residenceFromDate: '01/01/2010',
      residenceToDate: '15/12/2023',
      maritalStatus: 'Vợ chết',
      purposeOfUse: 'Bán đất',
      purposeDetail: 'Làm thủ tục chuyển nhượng quyền sử dụng đất',

      requesterName: 'Hoàng Minh Tuấn',
      requesterRelationship: 'Bản thân',
      requesterIdIssueDate: '20/05/2014',
      requesterIdIssuePlace: 'Cục Cảnh sát QLHC về TTXH',
      requesterIdNumber: '031088',
      requesterPersonalId: '031088',

      certIssueDate: '15/12/2023',
      certIssuePlace: 'UBND Phường Máy Tơ, Quận Ngô Quyền, HP',
      signerName: 'Vũ Văn E',
      signerPosition: 'Chủ tịch UBND Phường',
      implementer: 'Đặng F',
      notes: ''
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-lg shadow-xl max-w-[95vw] w-full max-h-[90vh] flex flex-col pointer-events-auto">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Danh sách dữ liệu</h2>
              <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                <span>Tổng số: <span className="font-medium text-slate-900">{totalRecords.toLocaleString()}</span></span>
                <span className="text-slate-300">|</span>
                <span>Mới: <span className="font-medium text-green-600">{newRecords.toLocaleString()}</span></span>
                <span className="text-slate-300">|</span>
                <span>Cập nhật: <span className="font-medium text-blue-600">{updatedRecords.toLocaleString()}</span></span>
                <span className="text-slate-300">|</span>
                <span>Lỗi: <span className="font-medium text-red-600">{errorRecords.toLocaleString()}</span></span>
              </div>
            </div>
            <button
               onClick={onClose}
               className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"
               title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === 'list' && (
              <>
                {/* Search & Actions */}
                <div className="p-4 border-b border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo tên người được cấp, người đề nghị, số đăng ký..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        title="Tìm kiếm"
                      />
                    </div>
                    <button
                      onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm"
                      title="Lọc nâng cao"
                    >
                      <Filter className="w-4 h-4" />
                      Lọc nâng cao
                    </button>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                      title="Xuất Excel"
                    >
                      <Download className="w-4 h-4" />
                      Xuất Excel
                    </button>
                  </div>

                  {showAdvancedSearch && (
                    <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Họ tên người được cấp</label>
                        <input type="text" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" title="Họ tên" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Số định danh cá nhân</label>
                        <input type="text" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" title="Số định danh" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Từ ngày</label>
                        <input type="date" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" title="Từ ngày" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Đến ngày</label>
                        <input type="date" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" title="Đến ngày" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">STT</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Họ tên người được cấp XNTTHN</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Ngày, tháng, năm sinh</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Số định danh cá nhân</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Tình trạng hôn nhân</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Người đề nghị cấp giấy XNTTHN</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Quan hệ với người được cấp</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Ngày, tháng, năm cấp</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Nơi cấp giấy XNTTHN</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {records.map((record, index) => (
                        <tr key={record.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-900">{index + 1}</td>
                          <td className="px-4 py-3 text-slate-900">{record.grantedPersonName}</td>
                          <td className="px-4 py-3 text-slate-600">{record.grantedPersonBirthDate}</td>
                          <td className="px-4 py-3 text-slate-900">{record.grantedPersonPersonalId}</td>
                          <td className="px-4 py-3 text-slate-600">{record.maritalStatus}</td>
                          <td className="px-4 py-3 text-slate-900">{record.requesterName}</td>
                          <td className="px-4 py-3 text-slate-600">{record.requesterRelationship}</td>
                          <td className="px-4 py-3 text-slate-600">{record.certIssueDate}</td>
                          <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate" title={record.certIssuePlace}>{record.certIssuePlace}</td>
                          <td className="px-4 py-3">
                            {record.status === 'approved' && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs whitespace-nowrap">
                                <CheckCircle className="w-3 h-3" />
                                Đã phê duyệt
                              </span>
                            )}
                            {record.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs whitespace-nowrap">
                                <AlertCircle className="w-3 h-3" />
                                Chờ duyệt
                              </span>
                            )}
                            {record.status === 'error' && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs whitespace-nowrap">
                                <XCircle className="w-3 h-3" />
                                Lỗi
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Hiển thị <span className="font-medium text-slate-900">1-{records.length}</span> trong tổng số <span className="font-medium text-slate-900">{totalRecords}</span> bản ghi
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="px-3 py-1 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 text-sm"
                      title="Trang trước"
                    >
                      Trước
                    </button>
                    <button title="Hành động" aria-label="Hành động" className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                    <button title="Hành động" aria-label="Hành động" className="px-3 py-1 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 text-sm">2</button>
                    <button title="Hành động" aria-label="Hành động" className="px-3 py-1 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 text-sm">3</button>
                    <button 
                      className="px-3 py-1 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 text-sm"
                      title="Trang sau"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'sync' && (
              <div className="flex-1 overflow-auto p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-medium text-slate-900">Tổng số lần đồng bộ đợt 3 lần</h3>
                    <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Làm mới
                    </button>
                  </div>
                </div>

                {/* Sync History Table - keeping same as example */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Thời gian</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Thêm mới</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Cập nhật</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Lỗi</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Tổng số</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Thời lượng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Calendar className="w-3 h-3" />
                            <span>15/12/2025 14:30:25</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Thành công
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-blue-600">
                            <ArrowUp className="w-3 h-3" />
                            <span className="font-medium">10</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-900">2</td>
                        <td className="px-4 py-3 text-slate-900">0</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-slate-900">
                            <ArrowUp className="w-3 h-3" />
                            <span className="font-medium">12</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">1.2s</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setSelectedRecord(null)} />
          
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                <h3 className="text-lg font-semibold text-slate-900">Chi tiết bản ghi</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"
                  title="Đóng chi tiết"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 overflow-auto bg-white">
                {/* Tab: Hồ sơ XNTTHN */}
                <div className="mb-8">
                  <div className="space-y-6">
                    <div className="mb-6">
                      <div className="flex flex-col gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Tệp đính kèm</div>
                          <div className="text-sm text-blue-600 font-medium">{selectedRecord.fileId || 'Không có tệp tải lên'}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Mã hồ sơ</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.recordCode}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số đăng ký</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationNumber}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số quyển</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.bookNumber}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Trang số</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.pageNumber}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab: Người được cấp */}
                <div className="mb-8">
                  <div className="space-y-6">
                    <div className="mb-6">
                      <div className="flex flex-col gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.grantedPersonName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Giới tính</div>
                          <div className="text-sm text-slate-900">{selectedRecord.grantedPersonGender}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                          <div className="text-sm text-slate-900">{selectedRecord.grantedPersonBirthDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi sinh</div>
                          <div className="text-sm text-slate-900">{selectedRecord.grantedPersonBirthPlace}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Dân tộc</div>
                          <div className="text-sm text-slate-900">{selectedRecord.grantedPersonEthnicity}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Quốc tịch</div>
                          <div className="text-sm text-slate-900">{selectedRecord.grantedPersonNationality}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày cấp GTTT</div>
                          <div className="text-sm text-slate-900">{selectedRecord.grantedPersonIdIssueDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi cấp GTTT</div>
                          <div className="text-sm text-slate-900">{selectedRecord.grantedPersonIdIssuePlace}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số GTTT</div>
                          <div className="text-sm text-slate-900">{selectedRecord.grantedPersonIdNumber}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.grantedPersonPersonalId}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Trong thời gian cư trú tại</div>
                          <div className="text-sm text-slate-900">{selectedRecord.residenceAddress}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Từ ngày</div>
                          <div className="text-sm text-slate-900">{selectedRecord.residenceFromDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Đến ngày</div>
                          <div className="text-sm text-slate-900">{selectedRecord.residenceToDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Tình trạng hôn nhân</div>
                          <div className="text-sm text-slate-900 font-medium text-blue-700">{selectedRecord.maritalStatus}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Mục đích sử dụng</div>
                          <div className="text-sm text-slate-900">{selectedRecord.purposeOfUse}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab: Người đề nghị */}
                <div className="mb-8">
                  <div className="space-y-6">
                    <div className="mb-6">
                      <div className="flex flex-col gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên người đề nghị</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.requesterName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Quan hệ với người được cấp</div>
                          <div className="text-sm text-slate-900">{selectedRecord.requesterRelationship}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày cấp GTTT</div>
                          <div className="text-sm text-slate-900">{selectedRecord.requesterIdIssueDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi cấp GTTT</div>
                          <div className="text-sm text-slate-900">{selectedRecord.requesterIdIssuePlace}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số GTTT</div>
                          <div className="text-sm text-slate-900">{selectedRecord.requesterIdNumber}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân</div>
                          <div className="text-sm text-slate-900">{selectedRecord.requesterPersonalId}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab: Thông tin khác */}
                <div className="mb-8">
                  <div className="space-y-6">
                    <div className="mb-6">
                      <div className="flex flex-col gap-3">
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm cấp giấy</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.certIssueDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi cấp giấy XNTTHN</div>
                          <div className="text-sm text-slate-900">{selectedRecord.certIssuePlace}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Người ký</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.signerName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Chức vụ</div>
                          <div className="text-sm text-slate-900">{selectedRecord.signerPosition}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Người thực hiện</div>
                          <div className="text-sm text-slate-900">{selectedRecord.implementer}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Ghi chú</div>
                          <div className="text-sm text-slate-600 italic whitespace-pre-wrap">{selectedRecord.notes || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 flex-shrink-0 bg-white">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
