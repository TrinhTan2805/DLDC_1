import { X, Search, Filter, Download, XCircle, CheckCircle, AlertCircle, Eye, RefreshCw, Calendar, ArrowUp, FileText, FileDown } from 'lucide-react';
import { useState } from 'react';

export interface DeathCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
}

export interface DeathCertRecord {
  id: string;
  status: 'approved' | 'pending' | 'error';
  hasError?: boolean;
  errorMessage?: string;

  // List fields
  deathNoticeNumber: string;
  deceasedName: string;
  deceasedGender: string;
  deathHour: number;
  deathMinute: number;
  deathDate: string;
  syncDate?: string;
  pdfUrl?: string;

  // Tab 1: Hồ sơ cấp Giấy báo tử
  fileId?: string;
  recordCode?: string;
  registrationNumber?: string;
  bookNumber?: string;
  pageNumber?: string;

  // Tab 2: Người được khai tử
  deceasedBirthDate: string;
  deceasedEthnicity: string;
  deceasedNationality: string;
  deceasedResidence: string;
  deceasedIdIssueDate?: string;
  deceasedIdIssuePlace?: string;
  deceasedIdNumber?: string;
  deceasedPersonalId?: string;
  deathDateWords: string;
  deathPlace: string;
  deathCause: string;
  deathNoticeIssueDate?: string;
  deathNoticeIssuePlace?: string;

  // Tab 3: Người đi khai tử
  declarerName: string;
  declarerRelationship: string;
  declarerIdIssuePlace?: string;
  declarerIdIssueDate?: string;
  declarerIdNumber?: string;
  declarerPersonalId?: string;

  // Tab 4: Thông tin khác
  registrationPlace: string;
  registrationDate: string;
  registrationType?: string;
  foreignExtractNumberAndName?: string;
  foreignExtractIssueDate?: string;
  foreignAgencyName?: string;
  foreignCountry?: string;
  signerName?: string;
  signerPosition?: string;
  implementer?: string;
  notes?: string;
}

export function DeathCertModal({ 
  isOpen, 
  onClose, 
  title, 
  totalRecords,
  newRecords,
  updatedRecords,
  errorRecords
}: DeathCertModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<DeathCertRecord | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [detailTab, setDetailTab] = useState('record');
  const [viewingPdfUrl, setViewingPdfUrl] = useState<string | null>(null);
  
  if (!isOpen) return null;

  // Mock data
  const records: DeathCertRecord[] = [
    {
      id: '1',
      status: 'approved',
      deathNoticeNumber: 'GBT-2024-001',
      deceasedName: 'Nguyễn Văn Đạt',
      deceasedGender: 'Nam',
      deathHour: 14,
      deathMinute: 30,
      deathDate: '15/04/2024',
      syncDate: '16/04/2024 09:12:35',
      pdfUrl: '/mau-tk-dk-khai-tu.pdf',
      
      fileId: 'tai_lieu_dinh_kem_01.pdf',
      recordCode: 'KT-2024-001234',
      registrationNumber: '1234/2024',
      bookNumber: '1',
      pageNumber: '45',

      deceasedBirthDate: '10/05/1945',
      deceasedEthnicity: 'Kinh',
      deceasedNationality: 'Việt Nam',
      deceasedResidence: '123 Hàng Bạc, Hoàn Kiếm, Hà Nội',
      deceasedIdIssueDate: '01/01/2010',
      deceasedIdIssuePlace: 'Công an TP Hà Nội',
      deceasedIdNumber: '001045001234',
      deceasedPersonalId: '001045001234',
      deathDateWords: 'Mười lăm tháng tư năm hai nghìn không trăm hai mươi tư',
      deathPlace: 'Bệnh viện Hữu nghị Việt Đức, Hà Nội',
      deathCause: 'Bệnh hiểm nghèo',
      deathNoticeIssueDate: '16/04/2024',
      deathNoticeIssuePlace: 'Bệnh viện Hữu nghị Việt Đức',

      declarerName: 'Nguyễn Văn Nam',
      declarerRelationship: 'Con trai',
      declarerIdIssueDate: '01/01/2015',
      declarerIdIssuePlace: 'Cục Cảnh sát QLHC',
      declarerIdNumber: '001090001234',
      declarerPersonalId: '001090001234',

      registrationPlace: 'UBND Phường Hàng Bạc, Quận Hoàn Kiếm, Hà Nội',
      registrationDate: '18/04/2024',
      registrationType: 'Khai tử đúng hạn',
      signerName: 'Lê Văn C',
      signerPosition: 'Chủ tịch UBND Phường',
      implementer: 'Trần Thị D',
      notes: ''
    },
    {
      id: '2',
      status: 'pending',
      deathNoticeNumber: 'GBT-2024-002',
      deceasedName: 'Trần Thị Bích',
      deceasedGender: 'Nữ',
      deathHour: 6,
      deathMinute: 15,
      deathDate: '20/04/2024',
      syncDate: '21/04/2024 14:05:00',
      pdfUrl: '/mau-tk-dk-khai-tu.pdf',
      
      fileId: 'tai_lieu_dinh_kem_02.pdf',
      recordCode: 'KT-2024-005678',
      registrationNumber: '5678/2024',
      bookNumber: '2',
      pageNumber: '12',

      deceasedBirthDate: '20/08/1930',
      deceasedEthnicity: 'Kinh',
      deceasedNationality: 'Việt Nam',
      deceasedResidence: '456 Lê Lợi, Quận 1, TP.HCM',
      deceasedIdIssueDate: '15/06/2005',
      deceasedIdIssuePlace: 'Công an TP.HCM',
      deceasedIdNumber: '020534567',
      deceasedPersonalId: '020534567',
      deathDateWords: 'Hai mươi tháng tư năm hai nghìn không trăm hai mươi tư',
      deathPlace: 'Tại nhà riêng',
      deathCause: 'Già yếu, tự nhiên',
      deathNoticeIssueDate: '20/04/2024',
      deathNoticeIssuePlace: 'Trạm Y tế Phường Bến Nghé',

      declarerName: 'Phạm Văn Hùng',
      declarerRelationship: 'Cháu ngoại',
      declarerIdIssueDate: '10/10/2018',
      declarerIdIssuePlace: 'Cục Cảnh sát QLHC',
      declarerIdNumber: '079085002468',
      declarerPersonalId: '079085002468',

      registrationPlace: 'UBND Phường Bến Nghé, Quận 1, TP.HCM',
      registrationDate: '22/04/2024',
      registrationType: 'Khai tử đúng hạn',
      signerName: 'Nguyễn Văn E',
      signerPosition: 'Phó Chủ tịch UBND',
      implementer: 'Lê Thị F',
      notes: ''
    },
    {
      id: '3',
      status: 'error',
      hasError: true,
      errorMessage: 'Thiếu thông tin người đi khai tử',
      deathNoticeNumber: 'GBT-2024-003',
      deceasedName: 'Lê Minh',
      deceasedGender: 'Nam',
      deathHour: 22,
      deathMinute: 45,
      deathDate: '01/01/2024',
      syncDate: '02/01/2024 10:20:15',
      
      fileId: '',
      recordCode: 'KT-2024-009999',
      registrationNumber: '9999/2024',
      bookNumber: '5',
      pageNumber: '88',

      deceasedBirthDate: '05/12/1980',
      deceasedEthnicity: 'Kinh',
      deceasedNationality: 'Việt Nam',
      deceasedResidence: '789 Trần Phú, Hải Châu, Đà Nẵng',
      deceasedIdIssueDate: '12/12/2012',
      deceasedIdIssuePlace: 'Công an Đà Nẵng',
      deceasedIdNumber: '048080005555',
      deceasedPersonalId: '048080005555',
      deathDateWords: 'Mùng một tháng một năm hai nghìn không trăm hai mươi tư',
      deathPlace: 'Bệnh viện Đà Nẵng',
      deathCause: 'Tai nạn giao thông',
      deathNoticeIssueDate: '02/01/2024',
      deathNoticeIssuePlace: 'Bệnh viện Đà Nẵng',

      declarerName: '', // Missing
      declarerRelationship: '', // Missing
      declarerIdIssueDate: '',
      declarerIdIssuePlace: '',
      declarerIdNumber: '',
      declarerPersonalId: '',

      registrationPlace: 'UBND Phường Thạch Thang, Quận Hải Châu, Đà Nẵng',
      registrationDate: '05/01/2024',
      registrationType: 'Khai tử quá hạn',
      signerName: 'Trần Văn G',
      signerPosition: 'Chủ tịch UBND Phường',
      implementer: 'Nguyễn Thị H',
      notes: 'Bổ sung CMND của người khai'
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
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
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

          {/* Tabs */}
          <div className="px-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'list'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Danh sách ({totalRecords.toLocaleString()})
              </button>

              <button
                onClick={() => setActiveTab('sync')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'sync'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Lịch sử đồng bộ
              </button>
            </div>
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
                        placeholder="Tìm kiếm theo tên người khai tử, số giấy báo tử..."
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
                        <label className="block text-xs font-medium text-slate-700 mb-1">Họ tên người khai tử</label>
                        <input type="text" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" title="Họ tên" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Số giấy báo tử</label>
                        <input type="text" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" title="Số giấy báo tử" />
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Số giấy báo tử</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Họ và tên</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Giới tính</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Giờ chết</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Phút chết</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Ngày, tháng, năm chết</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Ngày đồng bộ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Văn bản</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {records.map((record, index) => (
                        <tr key={record.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-900">{index + 1}</td>
                          <td className="px-4 py-3 text-slate-900">{record.deathNoticeNumber}</td>
                          <td className="px-4 py-3 text-slate-900">{record.deceasedName}</td>
                          <td className="px-4 py-3 text-slate-600">{record.deceasedGender}</td>
                          <td className="px-4 py-3 text-slate-900">{record.deathHour}</td>
                          <td className="px-4 py-3 text-slate-900">{record.deathMinute}</td>
                          <td className="px-4 py-3 text-slate-900">{record.deathDate}</td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{record.syncDate || '-'}</td>
                          <td className="px-4 py-3">
                            {record.pdfUrl ? (
                              <button
                                onClick={() => setViewingPdfUrl(record.pdfUrl!)}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-xs"
                                title="Xem văn bản đính kèm"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                Xem
                              </button>
                            ) : (
                              <span className="text-slate-400 text-xs">—</span>
                            )}
                          </td>
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

              {/* Tabs */}
              <div className="px-6 pt-4 flex-shrink-0 border-b border-slate-200">
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    onClick={() => setDetailTab('record')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      detailTab === 'record' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📄 Giấy báo tử
                  </button>
                  <button
                    onClick={() => setDetailTab('deceased')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      detailTab === 'deceased' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    👤 Người được khai tử
                  </button>
                  <button
                    onClick={() => setDetailTab('declarer')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      detailTab === 'declarer' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🧑 Người đi khai tử
                  </button>
                  <button
                    onClick={() => setDetailTab('other')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      detailTab === 'other' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📋 Thông tin khác
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 overflow-auto bg-white">
                {/* Tab: Giấy báo tử */}
                {detailTab === 'record' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-2 mb-3 border-l-4 border-orange-600">Bộ dữ liệu hồ sơ cấp Giấy báo tử</h4>
                      <div className="grid grid-cols-2 gap-3">
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
                )}

                {/* Tab: Người được khai tử */}
                {detailTab === 'deceased' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-2 mb-3 border-l-4 border-orange-600">Thông tin người được khai tử</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Giới tính</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedGender}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedBirthDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Dân tộc</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedEthnicity}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Quốc tịch</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedNationality}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi cư trú</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedResidence}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số GTTT</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedIdNumber}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedPersonalId}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Giờ, phút chết</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.deathHour}:{selectedRecord.deathMinute}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm chết</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.deathDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Ngày tháng năm chết (bằng chữ)</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.deathDateWords}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi chết</div>
                          <div className="text-sm text-slate-900 font-medium text-orange-700">{selectedRecord.deathPlace}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nguyên nhân chết</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.deathCause}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Số Giấy báo tử/Số giấy tờ thay thế Giấy báo tử</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.deathNoticeNumber}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Người đi khai tử */}
                {detailTab === 'declarer' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-2 mb-3 border-l-4 border-orange-600">Thông tin người đi khai tử</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.declarerName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Quan hệ với người chết</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.declarerRelationship}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số GTTT</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.declarerIdNumber}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.declarerPersonalId}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Thông tin khác */}
                {detailTab === 'other' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-2 mb-3 border-l-4 border-orange-600">Thông tin khác</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi đăng ký</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationPlace}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày đăng ký</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Loại đăng ký</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationType}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Người ký</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.signerName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Chức vụ</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.signerPosition}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Người thực hiện</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.implementer}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Ghi chú</div>
                          <div className="text-sm text-slate-600 italic whitespace-pre-wrap">{selectedRecord.notes || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Xuất file
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* PDF Viewer Modal */}
      {viewingPdfUrl && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1100 }}>
          {/* Nền tối sâu sang trọng */}
          <div 
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-auto" 
            onClick={() => setViewingPdfUrl(null)} 
          />
          
          {/* Nút thao tác ở góc trên (Floating Top Controls) */}
          <div className="absolute top-6 right-6 flex items-center gap-4 pointer-events-auto" style={{ zIndex: 1105 }}>
            <a 
              href={viewingPdfUrl} 
              download
              title="Tải về bản gốc"
              className="w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all active:scale-90"
            >
              <FileDown className="w-5 h-5" />
            </a>
            <button 
              onClick={() => setViewingPdfUrl(null)}
              className="w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all active:scale-90"
              title="Đóng trình xem"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Vùng hiển thị tài liệu */}
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 sm:p-14 pointer-events-none">
            <div className="w-full max-w-5xl h-full bg-white shadow-[0_0_80px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500 pointer-events-auto relative z-10 flex items-center justify-center bg-slate-200">
               {/* Note: Iframe handles the PDF */}
              <iframe 
                src={`${viewingPdfUrl}#toolbar=0&navpanes=0&scrollbar=1`} 
                className="w-full h-full border-none"
                title="Premium PDF Viewer"
              />
            </div>

            {/* Google Drive-style Floating BOTTOM Toolbar */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 px-8 py-3.5 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white animate-in slide-in-from-bottom-6 duration-700 pointer-events-auto z-20">
              <div className="flex items-center gap-4 pr-8 border-r border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Trang</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    defaultValue="1" 
                    className="w-9 h-9 bg-white/10 border border-white/20 rounded-lg text-center text-sm font-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    title="Trang hiện tại"
                  />
                  <span className="text-sm font-medium text-slate-400">/ 1</span>
                </div>
              </div>
              
              <div className="flex items-center gap-5 px-2">
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-all active:scale-75" title="Thu nhỏ">
                  <span className="text-2xl font-light">−</span>
                </button>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-lg border border-white/5">
                  <Search className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-black tracking-tighter">100%</span>
                </div>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-all active:scale-75" title="Phóng to">
                  <span className="text-2xl font-light">+</span>
                </button>
              </div>

              <div className="flex items-center gap-3 pl-8 border-l border-white/10">
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">Verified Original</span>
                   <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">DLDC System</span>
                </div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
