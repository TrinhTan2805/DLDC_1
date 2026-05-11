import { X, Search, Filter, Download, XCircle, CheckCircle, AlertCircle, Eye, FileText } from 'lucide-react';
import { useState } from 'react';

export interface TerminationGuardianshipCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
}

export interface TerminationGuardianshipCertRecord {
  id: string;
  status: 'approved' | 'pending' | 'error';
  
  // List fields
  recordCode: string; // Mã hồ sơ
  wardName: string; // Họ và tên người được giám hộ
  guardianName: string; // Họ và tên người giám hộ
  terminationReason: string; // Lý do chấm dứt
  registrationType: string; // Loại đăng ký
  terminationDate: string; // Ngày chấm dứt
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
  guardianshipCertNumber?: string; // Số giấy chứng nhận giám hộ đã cấp
  guardianshipCertDate?: string; // Ngày cấp giấy chứng nhận giám hộ
  terminationBasis?: string; // Căn cứ chấm dứt
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

export function TerminationGuardianshipCertModal({ 
  isOpen, 
  onClose, 
  title, 
  totalRecords,
  newRecords,
  updatedRecords,
  errorRecords
}: TerminationGuardianshipCertModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<TerminationGuardianshipCertRecord | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  if (!isOpen) return null;

  // Mock data
  const records: TerminationGuardianshipCertRecord[] = [
    {
      id: '1',
      status: 'approved',
      recordCode: 'CDGH-2024-005566',
      wardName: 'Trần Minh Quang',
      guardianName: 'Trần Văn Hùng',
      terminationReason: 'Người được giám hộ đã đủ 18 tuổi',
      registrationType: 'Đăng ký mới',
      terminationDate: '10/04/2024',
      syncDate: '15/04/2024 14:20:10',
      hasPdf: true,
      
      wardGender: 'Nam',
      wardBirthDate: '10/04/2006',
      wardHometown: 'Hải Phòng',
      wardBirthPlace: 'Hải Phòng',
      wardEthnicity: 'Kinh',
      wardNationality: 'Việt Nam',
      wardIdIssueDate: '10/04/2022',
      wardIdIssuePlace: 'Cục CS QLHC',
      wardIdNumber: '031006001234',
      wardResidence: 'Quận Ngô Quyền, Hải Phòng',

      guardianGender: 'Nam',
      guardianBirthDate: '20/05/1970',
      guardianEthnicity: 'Kinh',
      guardianNationality: 'Việt Nam',
      guardianIdIssueDate: '01/01/2016',
      guardianIdIssuePlace: 'Công an Hải Phòng',
      guardianIdNumber: '031070001111',
      guardianPersonalId: '031070001111',
      guardianResidence: 'Quận Ngô Quyền, Hải Phòng',

      registrationPlace: 'UBND Phường Lạch Tray, Quận Ngô Quyền',
      registrationDate: '12/04/2024',
      signerName: 'Nguyễn Văn A',
      signerPosition: 'Chủ tịch UBND',
      requesterName: 'Trần Văn Hùng',
      requesterRelationship: 'Chú ruột',
      requesterIdIssueDate: '01/01/2016',
      requesterIdIssuePlace: 'Công an Hải Phòng',
      requesterIdNumber: '031070001111',
      requesterPersonalId: '031070001111',
      implementerName: 'Cán bộ Tư pháp',
      notes: ''
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Người được giám hộ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Người giám hộ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Lý do chấm dứt</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Ngày chấm dứt</th>
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
                          <td className="px-4 py-3 text-slate-600">{record.terminationReason}</td>
                          <td className="px-4 py-3 text-slate-600">{record.terminationDate}</td>
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
                  Chi tiết hồ sơ chấm dứt giám hộ <span className="text-blue-600">#{selectedRecord.recordCode}</span>
                </h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 overflow-auto bg-white text-slate-900">
                {/* Người được giám hộ */}
                <div className="mb-8">
                  <div className="space-y-6">
                    <div className="mb-6">
                      <div className="flex flex-col gap-3">
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
                      </div>
                    </div>
                  </div>
                </div>

                {/* Người giám hộ */}
                <div className="mb-8">
                  <div className="space-y-6">
                    <div className="mb-6">
                      <div className="flex flex-col gap-3">
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
                </div>

                {/* Thông tin khác */}
                <div className="mb-8">
                  <div className="space-y-6">
                    <div className="mb-6">
                      <div className="flex flex-col gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Lý do chấm dứt</div>
                          <div className="text-sm text-slate-900 font-medium italic">{selectedRecord.terminationReason}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày chấm dứt</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.terminationDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày đăng ký</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi đăng ký chấm dứt</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationPlace}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số GCN giám hộ</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianshipCertNumber}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày cấp GCN giám hộ</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianshipCertDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Căn cứ chấm dứt</div>
                          <div className="text-sm text-slate-900 font-medium px-1 italic">{selectedRecord.terminationBasis || '-'}</div>
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
                      <div className="flex flex-col gap-3">
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
