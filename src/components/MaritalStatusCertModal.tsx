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
  isInline?: boolean;
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
  errorRecords,
  isInline = false
}: MaritalStatusCertModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<MaritalStatusCertRecord | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  if (!isOpen && !isInline) return null;

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
      {!isInline && <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>}
      
      {/* Container */}
      <div className={isInline ? "w-full" : "fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"}>
        <div className={`bg-white ${isInline ? "border border-slate-200 rounded-xl overflow-hidden" : "rounded-lg shadow-xl max-w-[95vw] w-full max-h-[90vh] pointer-events-auto"} flex flex-col`}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            </div>
            {!isInline && (
              <button
                 onClick={onClose}
                 className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"
                 title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>



          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === 'list' && (
              <>
                {/* Search & Actions */}
                <div className="px-6 py-4 border-b border-slate-200 flex-shrink-0 bg-white">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 flex items-center gap-3">
                      <div className="relative flex-1">
                        <input aria-label="Input field"
                          type="text"
                          placeholder="Tìm kiếm theo họ tên, số định danh, số giấy chứng nhận..."
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 shadow-sm transition-all"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                          className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all shadow-sm border ${
                            showAdvancedSearch ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Filter className="w-4 h-4" />
                          Lọc
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all shadow-sm" title="Tải lại">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2 text-sm font-semibold shadow-sm">
                        <Download className="w-4 h-4" />
                        Kết xuất
                      </button>
                    </div>
                  </div>

                  {/* Advanced Search Panel */}
                  {showAdvancedSearch && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4 shadow-sm animate-in slide-in-from-top-2 duration-200 relative">
                      <div className="absolute -top-2 left-64 w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Điều kiện lọc nâng cao</h4>
                      </div>

                      <div className="grid grid-cols-4 gap-4 relative z-10">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Họ tên người được cấp</label>
                          <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" placeholder="Nhập họ tên..." />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Số định danh cá nhân</label>
                          <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" placeholder="Số định danh..." />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Từ ngày</label>
                          <div className="relative">
                            <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm appearance-none" />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Đến ngày</label>
                          <div className="relative">
                            <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm appearance-none" />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3 relative z-10">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center gap-2 shadow-md transition-all active:scale-95">
                          <CheckCircle className="w-4 h-4" />
                          Áp dụng bộ lọc
                        </button>
                        <button onClick={() => setShowAdvancedSearch(false)} className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all">
                          Xóa tất cả
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto bg-white">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">STT</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Người được cấp XNTTHN</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Ngày sinh</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Số định danh cá nhân</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Tình trạng hôn nhân</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Người đề nghị cấp</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Quan hệ</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Ngày cấp</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Trạng thái</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {records.map((record, index) => (
                        <tr key={record.id} className="hover:bg-blue-50/30 transition-all group">
                          <td className="px-4 py-4 text-center text-sm text-slate-500 font-medium">{(index + 1).toString().padStart(2, '0')}</td>
                          <td className="px-4 py-4 text-center text-sm font-semibold text-slate-900">{record.grantedPersonName}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium font-mono">{record.grantedPersonBirthDate}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-900 font-medium font-mono">{record.grantedPersonPersonalId}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium">{record.maritalStatus}</td>
                          <td className="px-4 py-4 text-center text-sm font-semibold text-slate-900">{record.requesterName}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium">{record.requesterRelationship}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium font-mono">{record.certIssueDate}</td>
                          <td className="px-4 py-4 text-center">
                            {record.status === 'approved' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100 shadow-sm whitespace-nowrap">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Đã phê duyệt
                              </span>
                            )}
                            {record.status === 'pending' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-100 shadow-sm whitespace-nowrap">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Chờ duyệt
                              </span>
                            )}
                            {record.status === 'error' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-red-100 shadow-sm whitespace-nowrap">
                                <XCircle className="w-3.5 h-3.5" />
                                Lỗi
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4.5 h-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <div className="text-sm text-slate-600 font-medium">
                    Hiển thị <span className="text-slate-900 font-bold">1-{records.length}</span> trong tổng số <span className="text-slate-900 font-bold">{totalRecords}</span> bản ghi
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white text-sm font-bold transition-colors">Trước</button>
                    <button className="w-9 h-9 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md">1</button>
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white text-sm font-bold transition-colors">Sau</button>
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
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setSelectedRecord(null)}></div>
          
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
              <div className="p-6 flex-1 overflow-auto bg-white text-slate-900">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {[
                    { label: 'Mã hồ sơ', value: selectedRecord.recordCode },
                    { label: 'Tệp đính kèm', value: selectedRecord.fileId, isBlue: true },
                    { label: 'Số đăng ký', value: selectedRecord.registrationNumber },
                    { label: 'Số quyển', value: selectedRecord.bookNumber },
                    { label: 'Trang số', value: selectedRecord.pageNumber },
                    
                    { label: 'Họ, chữ đệm, tên người được cấp', value: selectedRecord.grantedPersonName },
                    { label: 'Giới tính', value: selectedRecord.grantedPersonGender },
                    { label: 'Ngày, tháng, năm sinh', value: selectedRecord.grantedPersonBirthDate },
                    { label: 'Nơi sinh', value: selectedRecord.grantedPersonBirthPlace },
                    { label: 'Dân tộc', value: selectedRecord.grantedPersonEthnicity },
                    
                    { label: 'Quốc tịch', value: selectedRecord.grantedPersonNationality },
                    { label: 'Số GTTT', value: selectedRecord.grantedPersonIdNumber },
                    { label: 'Ngày cấp GTTT', value: selectedRecord.grantedPersonIdIssueDate },
                    { label: 'Nơi cấp GTTT', value: selectedRecord.grantedPersonIdIssuePlace },
                    { label: 'Số định danh cá nhân', value: selectedRecord.grantedPersonPersonalId },
                    
                    { label: 'Trong thời gian cư trú tại', value: selectedRecord.residenceAddress },
                    { label: 'Từ ngày', value: selectedRecord.residenceFromDate },
                    { label: 'Đến ngày', value: selectedRecord.residenceToDate },
                    { label: 'Tình trạng hôn nhân', value: selectedRecord.maritalStatus, isBlue: true },
                    { label: 'Mục đích sử dụng', value: selectedRecord.purposeOfUse },
                    
                    { label: 'Họ, chữ đệm, tên người đề nghị', value: selectedRecord.requesterName },
                    { label: 'Quan hệ với người được cấp', value: selectedRecord.requesterRelationship },
                    { label: 'Số GTTT người đề nghị', value: selectedRecord.requesterIdNumber },
                    { label: 'Ngày cấp GTTT người đề nghị', value: selectedRecord.requesterIdIssueDate },
                    { label: 'Nơi cấp GTTT người đề nghị', value: selectedRecord.requesterIdIssuePlace },
                    
                    { label: 'Số định danh cá nhân người đề nghị', value: selectedRecord.requesterPersonalId },
                    { label: 'Ngày, tháng, năm cấp giấy', value: selectedRecord.certIssueDate },
                    { label: 'Nơi cấp giấy XNTTHN', value: selectedRecord.certIssuePlace },
                    { label: 'Người ký', value: selectedRecord.signerName },
                    { label: 'Chức vụ', value: selectedRecord.signerPosition },
                    
                    { label: 'Người thực hiện', value: selectedRecord.implementer },
                    { label: 'Ghi chú', value: selectedRecord.notes, isItalic: true, colSpan2: true }
                  ].reduce<any[]>((acc, field, index, arr) => {
                    acc.push(
                      <div key={`field-${index}`} className={`space-y-1 ${field.colSpan2 ? 'col-span-2' : ''}`}>
                        <div className="text-[14px] text-slate-500">{field.label}</div>
                        <div className={`text-[12px] ${field.isBlue ? 'text-blue-600' : 'text-slate-900'} ${field.isItalic ? 'italic whitespace-pre-wrap text-slate-600' : ''}`}>
                          {field.value || '-'}
                        </div>
                      </div>
                    );
                    if ((index + 1) % 5 === 0 && index !== arr.length - 1) {
                      acc.push(
                        <div key={`sep-${index}`} className="col-span-2 border-b border-slate-200/60 my-1"></div>
                      );
                    }
                    return acc;
                  }, [])}
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
