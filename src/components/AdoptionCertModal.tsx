import { X, Search, Filter, Download, XCircle, CheckCircle, AlertCircle, Eye, FileText, ArrowLeft, RefreshCw, Calendar, ArrowUp } from 'lucide-react';
import { useState } from 'react';

export interface AdoptionCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
}

export interface AdoptionCertRecord {
  id: string;
  status: 'approved' | 'pending' | 'error';
  
  // List fields
  recordCode: string; // Mã hồ sơ
  adoptedName: string; // Họ và tên người được nhận nuôi
  fatherName: string; // Họ và tên cha
  motherName: string; // Họ và tên mẹ
  handoverPerson1Name: string; // Họ và tên người giao con nuôi thứ nhất
  handoverPerson2Name: string; // Họ và tên người giao con nuôi thứ hai
  syncDate: string; // Ngày đồng bộ
  hasPdf: boolean; // Văn bản

  // Tab 1: Hồ sơ đăng ký
  fileId?: string;
  registrationNumber?: string;
  bookNumber?: string;
  pageNumber?: string;

  // Tab 2: Người được nhận nuôi
  adoptedGender?: string;
  adoptedBirthDate?: string;
  adoptedBirthPlace?: string;
  adoptedEthnicity?: string;
  adoptedNationality?: string;
  adoptedHometown?: string;
  adoptedIdIssueDate?: string;
  adoptedIdIssuePlace?: string;
  adoptedIdNumber?: string;
  adoptedPersonalId?: string;
  adoptedResidence?: string;

  // Tab 3: Thông tin cha mẹ (Cha)
  fatherBirthDate?: string;
  fatherEthnicity?: string;
  fatherNationality?: string;
  fatherIdIssueDate?: string;
  fatherIdIssuePlace?: string;
  fatherIdNumber?: string;
  fatherPersonalId?: string;
  fatherResidenceType?: string;
  fatherResidence?: string;

  // Tab 3: Thông tin cha mẹ (Mẹ)
  motherBirthDate?: string;
  motherEthnicity?: string;
  motherNationality?: string;
  motherIdIssueDate?: string;
  motherIdIssuePlace?: string;
  motherIdNumber?: string;
  motherPersonalId?: string;
  motherResidenceType?: string;
  motherResidence?: string;

  // Tab 4: Người giao con nuôi (1)
  handover1BirthDate?: string;
  handover1Ethnicity?: string;
  handover1Nationality?: string;
  handover1IdIssueDate?: string;
  handover1IdIssuePlace?: string;
  handover1IdNumber?: string;
  handover1PersonalId?: string;
  handover1Residence?: string;

  // Tab 4: Người giao con nuôi (2)
  handover2BirthDate?: string;
  handover2Ethnicity?: string;
  handover2Nationality?: string;
  handover2IdIssueDate?: string;
  handover2IdIssuePlace?: string;
  handover2IdNumber?: string;
  handover2PersonalId?: string;
  handover2Residence?: string;

  // Tab 5: Thông tin khác
  registrationPlace?: string;
  registrationDate?: string;
  registrationType?: string;
  foreignCertNumber?: string;
  foreignCertDate?: string;
  foreignAgencyName?: string;
  foreignCountry?: string;
  careFacilityName?: string;
  facilityRepresentativeName?: string;
  decisionNumber?: string;
  decisionDate?: string;
  handoverReason?: string;
  signerName?: string;
  signerPosition?: string;
  implementerName?: string;
  notes?: string;
}

export function AdoptionCertModal({ 
  isOpen, 
  onClose, 
  title, 
  totalRecords,
  newRecords,
  updatedRecords,
  errorRecords
}: AdoptionCertModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<AdoptionCertRecord | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [detailTab, setDetailTab] = useState('record');
  
  if (!isOpen) return null;

  // Mock data
  const records: AdoptionCertRecord[] = [
    {
      id: '1',
      status: 'approved',
      recordCode: 'NCN-2024-001122',
      adoptedName: 'Nguyễn Văn Bé',
      fatherName: 'Nguyễn Hoàng Sơn',
      motherName: 'Trần Thị Mỹ',
      handoverPerson1Name: 'Giám đốc trại trẻ',
      handoverPerson2Name: '',
      syncDate: '15/04/2024 10:15:20',
      hasPdf: true,
      
      fileId: 'tai_lieu_dinh_kem_01.pdf',
      registrationNumber: '1122/2024',
      bookNumber: '2',
      pageNumber: '10',

      adoptedGender: 'Nam',
      adoptedBirthDate: '10/05/2021',
      adoptedBirthPlace: 'Hà Nội',
      adoptedEthnicity: 'Kinh',
      adoptedNationality: 'Việt Nam',
      adoptedHometown: 'Không rõ',
      adoptedIdIssueDate: '',
      adoptedIdIssuePlace: '',
      adoptedIdNumber: '',
      adoptedPersonalId: '001221000123',
      adoptedResidence: 'Trại trẻ mồ côi SOS Hà Nội',

      fatherBirthDate: '15/08/1985',
      fatherEthnicity: 'Kinh',
      fatherNationality: 'Việt Nam',
      fatherIdIssueDate: '01/01/2012',
      fatherIdIssuePlace: 'Công an Hà Nội',
      fatherIdNumber: '001085001111',
      fatherPersonalId: '001085001111',
      fatherResidenceType: 'Thường trú',
      fatherResidence: '123 Cầu Giấy, Hà Nội',

      motherBirthDate: '20/10/1988',
      motherEthnicity: 'Kinh',
      motherNationality: 'Việt Nam',
      motherIdIssueDate: '05/05/2015',
      motherIdIssuePlace: 'Công an Hà Nội',
      motherIdNumber: '001188002222',
      motherPersonalId: '001188002222',
      motherResidenceType: 'Thường trú',
      motherResidence: '123 Cầu Giấy, Hà Nội',

      handover1BirthDate: '01/01/1970',
      handover1Ethnicity: 'Kinh',
      handover1Nationality: 'Việt Nam',
      handover1IdIssueDate: '01/01/2020',
      handover1IdIssuePlace: 'Công an Hà Nội',
      handover1IdNumber: '001070003333',
      handover1PersonalId: '001070003333',
      handover1Residence: 'Mai Dịch, Cầu Giấy, Hà Nội',

      registrationPlace: 'UBND Quận Cầu Giấy',
      registrationDate: '12/04/2024',
      registrationType: 'Đăng ký mới',
      careFacilityName: 'Trại trẻ SOS',
      facilityRepresentativeName: 'Lê Văn Giám Đốc',
      decisionNumber: 'QĐ-1234',
      decisionDate: '10/04/2024',
      handoverReason: 'Nhận nuôi trẻ em mồ côi',
      signerName: 'Trần Văn Ký',
      signerPosition: 'Chủ tịch UBND',
      implementerName: 'Cán Bộ Tư Pháp',
      notes: ''
    },
    {
      id: '2',
      status: 'pending',
      recordCode: 'NCN-2024-002233',
      adoptedName: 'Lê Thị An',
      fatherName: 'Phạm Thế Anh',
      motherName: 'Lê Quỳnh',
      handoverPerson1Name: 'Lê Văn Sinh',
      handoverPerson2Name: 'Đỗ Hoa',
      syncDate: '18/04/2024 14:05:00',
      hasPdf: true,
      
      fileId: 'tai_lieu_dinh_kem_02.pdf',
      registrationNumber: '2233/2024',
      bookNumber: '1',
      pageNumber: '55',

      adoptedGender: 'Nữ',
      adoptedBirthDate: '15/09/2020',
      adoptedBirthPlace: 'Nam Định',
      adoptedEthnicity: 'Kinh',
      adoptedNationality: 'Việt Nam',
      adoptedHometown: 'Nam Định',
      adoptedPersonalId: '036320004567',
      adoptedResidence: 'Nghĩa Hưng, Nam Định',

      fatherBirthDate: '10/10/1980',
      fatherEthnicity: 'Kinh',
      fatherNationality: 'Việt Nam',
      fatherPersonalId: '001080005555',
      fatherResidenceType: 'Tạm trú',
      fatherResidence: 'Quận 1, TP.HCM',

      motherBirthDate: '15/11/1982',
      motherEthnicity: 'Kinh',
      motherNationality: 'Việt Nam',
      motherPersonalId: '001182006666',
      motherResidenceType: 'Tạm trú',
      motherResidence: 'Quận 1, TP.HCM',

      handover1BirthDate: '20/02/1990',
      handover1Ethnicity: 'Kinh',
      handover1Nationality: 'Việt Nam',
      handover1PersonalId: '036090007777',
      handover1Residence: 'Nghĩa Hưng, Nam Định',

      handover2BirthDate: '25/03/1992',
      handover2Ethnicity: 'Kinh',
      handover2Nationality: 'Việt Nam',
      handover2PersonalId: '036192008888',
      handover2Residence: 'Nghĩa Hưng, Nam Định',

      registrationPlace: 'UBND Phường Bến Nghé, Quận 1',
      registrationDate: '18/04/2024',
      registrationType: 'Đăng ký quá hạn',
      handoverReason: 'Cha mẹ đẻ không có khả năng nuôi dưỡng',
      signerName: 'Nguyễn Văn Phường',
      signerPosition: 'Phó Chủ tịch UBND',
      implementerName: 'Cán Bộ Tư Pháp 2',
      notes: ''
    }
  ];

  const handlePdfView = () => {
     // User explicitly asked to skip PDF viewer logic for now
     alert('Chức năng xem file chi tiết sẽ được bổ sung sau.');
  };

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
                        placeholder="Tìm kiếm theo mã hồ sơ, tên người nhận nuôi..."
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
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">STT</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Mã hồ sơ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Họ và tên người được nhận nuôi</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Họ và tên cha</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Họ và tên mẹ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Họ và tên người giao con nuôi thứ nhất</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Họ và tên người giao con nuôi thứ hai</th>
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
                          <td className="px-4 py-3 text-slate-900 font-medium">{record.recordCode}</td>
                          <td className="px-4 py-3 text-slate-900 text-blue-700">{record.adoptedName}</td>
                          <td className="px-4 py-3 text-slate-900">{record.fatherName}</td>
                          <td className="px-4 py-3 text-slate-900">{record.motherName}</td>
                          <td className="px-4 py-3 text-slate-900">{record.handoverPerson1Name}</td>
                          <td className="px-4 py-3 text-slate-900">{record.handoverPerson2Name}</td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{record.syncDate || '-'}</td>
                          <td className="px-4 py-3">
                            {record.hasPdf ? (
                              <button
                                onClick={handlePdfView}
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
                                Đã duyệt
                              </span>
                            )}
                            {record.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs whitespace-nowrap">
                                <AlertCircle className="w-3 h-3" />
                                Chờ duyệt
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
                    <button className="px-3 py-1 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 text-sm">Trước</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                    <button className="px-3 py-1 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 text-sm">Sau</button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'sync' && (
               <div className="flex-1 overflow-auto p-6 flex justify-center items-center">
                 <div className="text-slate-400">Chưa có lịch sử đồng bộ chi tiết.</div>
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
                <h3 className="text-lg font-semibold text-slate-900">Chi tiết bản ghi đăng ký nuôi con nuôi</h3>
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
                    📄 Hồ sơ đăng ký
                  </button>
                  <button
                    onClick={() => setDetailTab('adopted')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      detailTab === 'adopted' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    👶 Người được nhận nuôi
                  </button>
                  <button
                    onClick={() => setDetailTab('parents')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      detailTab === 'parents' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    👨‍👩‍👧 Thông tin cha, mẹ
                  </button>
                  <button
                    onClick={() => setDetailTab('handovers')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      detailTab === 'handovers' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🧑 Người giao con nuôi
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
              <div className="p-6 flex-1 overflow-auto bg-white text-slate-900">
                {/* Tab: Hồ sơ đăng ký */}
                {detailTab === 'record' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-2 mb-3 border-l-4 border-orange-600">Hồ sơ đăng ký</h4>
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

                {/* Tab: Người được nhận nuôi */}
                {detailTab === 'adopted' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-2 mb-3 border-l-4 border-orange-600">Thông tin người được nhận nuôi</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Giới tính</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedGender}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedBirthDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Nơi sinh</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedBirthPlace}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Dân tộc</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedEthnicity}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Quốc tịch</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedNationality}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Quê quán</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedHometown}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày cấp GTTT</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedIdIssueDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Nơi cấp GTTT</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedIdIssuePlace}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số GTTT</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedIdNumber}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedPersonalId}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi cư trú</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedResidence}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Thông tin cha mẹ */}
                {detailTab === 'parents' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-2 mb-3 border-l-4 border-orange-600">Thông tin cha</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.fatherName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.fatherBirthDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Dân tộc</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.fatherEthnicity}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Quốc tịch</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.fatherNationality}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số GTTT</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.fatherIdNumber}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.fatherPersonalId}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi cư trú</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.fatherResidence}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-2 mb-3 border-l-4 border-orange-600">Thông tin mẹ</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.motherName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.motherBirthDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Dân tộc</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.motherEthnicity}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Quốc tịch</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.motherNationality}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số GTTT</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.motherIdNumber}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.motherPersonalId}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi cư trú</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.motherResidence}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Người giao con nuôi */}
                {detailTab === 'handovers' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-2 mb-3 border-l-4 border-orange-600">Thông tin người giao con nuôi</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên (người thứ 1)</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.handoverPerson1Name}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.handover1BirthDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Dân tộc</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.handover1Ethnicity}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số GTTT</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.handover1IdNumber}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi cư trú</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.handover1Residence}</div>
                        </div>
                        
                        <div className="col-span-2 mt-4">
                          <div className="border border-slate-200 p-2 rounded col-span-2">
                            <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên (người thứ 2)</div>
                            <div className="text-sm text-slate-900 font-medium">{selectedRecord.handoverPerson2Name || '-'}</div>
                          </div>
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
    </>
  );
}
