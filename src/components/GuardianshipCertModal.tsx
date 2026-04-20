import { X, Search, Filter, Download, XCircle, CheckCircle, AlertCircle, Eye, FileText } from 'lucide-react';
import { useState } from 'react';

export interface GuardianshipCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
}

export interface GuardianshipCertRecord {
  id: string;
  status: 'approved' | 'pending' | 'error';
  
  // List fields
  recordCode: string; // Mã hồ sơ
  wardName: string; // Họ và tên người được giám hộ
  guardianName: string; // Họ và tên người giám hộ
  guardianshipType: string; // Loại giám hộ
  registrationType: string; // Loại đăng ký
  guardianshipStatus: string; // Tình trạng giám hộ
  syncDate: string; // Ngày đồng bộ
  hasPdf: boolean; // Văn bản

  // Detail fields
  // Tab 1: Người được giám hộ
  wardGender?: string;
  wardBirthDate?: string;
  wardHometown?: string;
  wardBirthPlace?: string;
  wardEthnicity?: string;
  wardNationality?: string;
  wardIdIssueDate?: string;
  wardIdIssuePlace?: string;
  wardIdNumber?: string;
  wardResidence?: string;
  guardianshipReason?: string;

  // Tab 2: Người giám hộ
  guardianGender?: string;
  guardianBirthDate?: string;
  guardianEthnicity?: string;
  guardianNationality?: string;
  guardianIdIssueDate?: string;
  guardianIdIssuePlace?: string;
  guardianIdNumber?: string;
  guardianPersonalId?: string;
  guardianResidence?: string;

  // Tab 3: Thông tin khác
  foreignCertNumber?: string; // Số và giấy chứng nhận giám hộ do cơ quan nước ngoài cấp
  foreignCertDate?: string; // Ngày của giấy chứng nhận giám hộ do cơ quan nước ngoài cấp
  foreignCountry?: string; // Tên quốc gia đã cấp giấy chứng nhận giám hộ
  foreignAgency?: string; // Tên cơ quan nước ngoài đã cấp giấy chứng nhận giám hộ
  registrationPlace?: string; // Nơi đăng ký
  registrationDate?: string; // Ngày đăng ký
  signerName?: string; // Người ký
  signerPosition?: string; // Chức vụ
  requesterName?: string; // Họ, chữ đệm, tên (người yêu cầu)
  requesterRelationship?: string; // Quan hệ với người được giám hộ
  requesterIdIssueDate?: string; // Ngày cấp giấy tờ tùy thân
  requesterIdIssuePlace?: string; // Nơi cấp giấy tờ tùy thân
  requesterIdNumber?: string; // Số giấy tờ tùy thân
  requesterPersonalId?: string; // Số định danh cá nhân
  implementerName?: string; // Người thực hiện
  notes?: string; // Ghi chú
}

export function GuardianshipCertModal({ 
  isOpen, 
  onClose, 
  title, 
  totalRecords,
  newRecords,
  updatedRecords,
  errorRecords
}: GuardianshipCertModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<GuardianshipCertRecord | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [detailTab, setDetailTab] = useState('ward');
  
  if (!isOpen) return null;

  // Mock data
  const records: GuardianshipCertRecord[] = [
    {
      id: '1',
      status: 'approved',
      recordCode: 'GH-2024-001122',
      wardName: 'Nguyễn Văn Nam',
      guardianName: 'Nguyễn Văn Bắc',
      guardianshipType: 'Giám hộ đương nhiên',
      registrationType: 'Đăng ký mới',
      guardianshipStatus: 'Đang giám hộ',
      syncDate: '15/04/2024 10:15:20',
      hasPdf: true,
      
      wardGender: 'Nam',
      wardBirthDate: '10/05/2012',
      wardHometown: 'Thái Bình',
      wardBirthPlace: 'Bệnh viện Thái Bình',
      wardEthnicity: 'Kinh',
      wardNationality: 'Việt Nam',
      wardIdIssueDate: '',
      wardIdIssuePlace: '',
      wardIdNumber: '',
      wardResidence: 'TP Thái Bình, Tỉnh Thái Bình',
      guardianshipReason: 'Cha mẹ mất khả năng hành vi dân sự',

      guardianGender: 'Nam',
      guardianBirthDate: '15/08/1975',
      guardianEthnicity: 'Kinh',
      guardianNationality: 'Việt Nam',
      guardianIdIssueDate: '01/01/2015',
      guardianIdIssuePlace: 'Công an Thái Bình',
      guardianIdNumber: '001075001111',
      guardianPersonalId: '001075001111',
      guardianResidence: 'TP Thái Bình, Tỉnh Thái Bình',

      registrationPlace: 'UBND Phường Kỳ Bá, TP Thái Bình',
      registrationDate: '12/04/2024',
      signerName: 'Trần Ký',
      signerPosition: 'Chủ tịch UBND',
      requesterName: 'Nguyễn Văn Bắc',
      requesterRelationship: 'Bác ruột',
      requesterIdIssueDate: '01/01/2015',
      requesterIdIssuePlace: 'Công an Thái Bình',
      requesterIdNumber: '001075001111',
      requesterPersonalId: '001075001111',
      implementerName: 'Lê Tư Pháp',
      notes: ''
    },
    {
      id: '2',
      status: 'pending',
      recordCode: 'GH-2024-003344',
      wardName: 'Lê Thị Mai',
      guardianName: 'Lê Hữu Đạt',
      guardianshipType: 'Giám hộ cử',
      registrationType: 'Đăng ký muộn',
      guardianshipStatus: 'Chấm dứt giám hộ',
      syncDate: '16/04/2024 09:20:00',
      hasPdf: true,
      
      wardGender: 'Nữ',
      wardBirthDate: '20/10/2005',
      wardHometown: 'Hà Nội',
      wardBirthPlace: 'Hà Nội',
      wardEthnicity: 'Kinh',
      wardNationality: 'Việt Nam',
      wardIdIssueDate: '05/05/2020',
      wardIdIssuePlace: 'Công an Hà Nội',
      wardIdNumber: '001205001234',
      wardResidence: 'Quận Đống Đa, Hà Nội',
      guardianshipReason: 'Chưa đủ tuổi thành niên',

      guardianGender: 'Nam',
      guardianBirthDate: '12/12/1980',
      guardianEthnicity: 'Kinh',
      guardianNationality: 'Việt Nam',
      guardianIdIssueDate: '10/10/2018',
      guardianIdIssuePlace: 'Cục CS QLHC',
      guardianIdNumber: '001080005678',
      guardianPersonalId: '001080005678',
      guardianResidence: 'Quận Đống Đa, Hà Nội',

      registrationPlace: 'UBND Quận Đống Đa',
      registrationDate: '15/04/2024',
      signerName: 'Phạm Lãnh Đạo',
      signerPosition: 'Phó Chủ tịch UBND',
      requesterName: 'Lê Hữu Đạt',
      requesterRelationship: 'Anh ruột',
      requesterIdIssueDate: '10/10/2018',
      requesterIdIssuePlace: 'Cục CS QLHC',
      requesterIdNumber: '001080005678',
      requesterPersonalId: '001080005678',
      implementerName: 'Cán Bộ Phường',
      notes: 'Lý do chấm dứt: Người được giám hộ đã đủ 18 tuổi'
    }
  ];

  const handlePdfView = () => {
    alert('Chức năng xem file chi tiết sẽ được bổ sung sau.');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
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
                <div className="p-4 border-b border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo mã hồ sơ, tên người được giám hộ..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm"
                    >
                      <Filter className="w-4 h-4" />
                      Lọc nâng cao
                    </button>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Xuất Excel
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">STT</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Mã hồ sơ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Họ và tên người được giám hộ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Họ và tên người giám hộ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Loại giám hộ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Loại đăng ký</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Tình trạng giám hộ</th>
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
                          <td className="px-4 py-3 font-medium text-slate-900">{record.recordCode}</td>
                          <td className="px-4 py-3 font-medium text-blue-700">{record.wardName}</td>
                          <td className="px-4 py-3 text-slate-900">{record.guardianName}</td>
                          <td className="px-4 py-3 text-slate-600">{record.guardianshipType}</td>
                          <td className="px-4 py-3 text-slate-600">{record.registrationType}</td>
                          <td className="px-4 py-3 text-slate-900">
                             <span className={`px-2 py-1 rounded text-xs ${record.guardianshipStatus === 'Đang giám hộ' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                               {record.guardianshipStatus}
                             </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{record.syncDate || '-'}</td>
                          <td className="px-4 py-3">
                            {record.hasPdf ? (
                              <button
                                onClick={handlePdfView}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-xs"
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
                                <CheckCircle className="w-3 h-3" /> Đã duyệt
                              </span>
                            )}
                            {record.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs whitespace-nowrap">
                                <AlertCircle className="w-3 h-3" /> Chờ duyệt
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

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
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                <h3 className="text-lg font-semibold text-slate-900">
                  Chi tiết hồ sơ giám hộ <span className="text-blue-600">#{selectedRecord.recordCode}</span>
                </h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="px-6 pt-4 flex-shrink-0 border-b border-slate-200">
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    onClick={() => setDetailTab('ward')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      detailTab === 'ward' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    👶 Người được giám hộ
                  </button>
                  <button
                    onClick={() => setDetailTab('guardian')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      detailTab === 'guardian' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🛡️ Người giám hộ
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
                {/* Người được giám hộ */}
                {detailTab === 'ward' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-2 mb-3 border-l-4 border-orange-600">Thông tin người được giám hộ</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.wardName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Giới tính</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.wardGender}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.wardBirthDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Nơi sinh</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.wardBirthPlace}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Dân tộc</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.wardEthnicity}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Quốc tịch</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.wardNationality}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số GTTT</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.wardIdNumber}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi cư trú</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.wardResidence}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Lý do giám hộ</div>
                          <div className="text-sm text-slate-900 font-medium italic italic">{selectedRecord.guardianshipReason || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Người giám hộ */}
                {detailTab === 'guardian' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-2 mb-3 border-l-4 border-orange-600">Thông tin người giám hộ</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Giới tính</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianGender}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianBirthDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Dân tộc</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianEthnicity}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Quốc tịch</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianNationality}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số GTTT</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianIdNumber}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianPersonalId}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi cư trú</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianResidence}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Thông tin khác */}
                {detailTab === 'other' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-2 mb-3 border-l-4 border-orange-600">Thông tin đăng ký</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Loại giám hộ</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianshipType}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Loại đăng ký</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationType}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Tình trạng giám hộ</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianshipStatus}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày đăng ký</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi đăng ký</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationPlace}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Người ký</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.signerName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Chức vụ</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.signerPosition}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-2 mb-3 border-l-4 border-orange-600">Thông tin người yêu cầu</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.requesterName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Quan hệ với người được giám hộ</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.requesterRelationship}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số GTTT</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.requesterIdNumber}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Người thực hiện</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.implementerName}</div>
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
