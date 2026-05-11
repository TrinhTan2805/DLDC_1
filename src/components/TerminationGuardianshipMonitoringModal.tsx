import { X, Search, Filter, Download, XCircle, CheckCircle, AlertCircle, Eye, FileText, Building2, User } from 'lucide-react';
import { useState } from 'react';

export interface TerminationGuardianshipMonitoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
}

export interface TerminationGuardianshipMonitoringRecord {
  id: string;
  status: 'approved' | 'pending' | 'error';
  
  // List fields (as per Image 1)
  recordCode: string; // Mã hồ sơ
  monitorName: string; // Họ và tên người giám sát
  legalEntityMonitorName: string; // Tên pháp nhân giám sát
  guardianshipRegNumber: string; // Số đăng ký giám hộ
  registrantName: string; // Họ và tên người đăng ký chấm dứt giám sát
  syncDate: string; // Ngày đồng bộ
  hasPdf: boolean; // Văn bản

  // Tab 1: Hồ sơ & Người giám sát
  regNumber?: string; // Số đăng ký
  bookNumber?: string; // Số quyển
  pageNumber?: string; // Trang số
  
  // Individual monitor
  monitorBirthDate?: string;
  monitorGender?: string;
  monitorEthnicity?: string;
  monitorNationality?: string;
  monitorIdCard?: string;
  monitorResidence?: string;

  // Legal entity monitor
  legalEntityFoundingDate?: string;
  legalEntityLicense?: string;
  legalEntityAddress?: string;
  legalEntityRepName?: string;
  legalEntityRepPosition?: string;
  legalEntityRepIdCard?: string;

  // Monitored guardianship info
  monitoredExtractNumber?: string; // Trích lục đăng ký giám hộ số
  monitoredRegDate?: string; // Ngày, tháng, năm đăng ký việc giám hộ
  monitoredRegPlace?: string; // Đăng ký tại

  // Registrant info
  registrantIdCard?: string;

  // General info
  signerFullInfo?: string; // Họ, chữ đệm, tên, chức vụ của người ký Trích lục
  implementerName?: string;
  notes?: string;
  finalRegDate?: string;
  finalRegPlace?: string;
}

export function TerminationGuardianshipMonitoringModal({ 
  isOpen, 
  onClose, 
  title, 
  totalRecords,
  newRecords,
  updatedRecords,
  errorRecords
}: TerminationGuardianshipMonitoringModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<TerminationGuardianshipMonitoringRecord | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  if (!isOpen) return null;

  // Mock data
  const records: TerminationGuardianshipMonitoringRecord[] = [
    {
      id: '1',
      status: 'approved',
      recordCode: 'CDGSGH-2024-556677',
      monitorName: 'Ông Trần Văn D',
      legalEntityMonitorName: 'Hội Bảo trợ Trẻ em Việt Nam',
      guardianshipRegNumber: '88/2022/GH',
      registrantName: 'Nguyễn Thị E',
      syncDate: '20/04/2024 09:15:22',
      hasPdf: true,
      
      regNumber: '12/2024/CDGSGH',
      bookNumber: '01/2024',
      pageNumber: '08',
      
      monitorBirthDate: '12/05/1975',
      monitorGender: 'Nam',
      monitorEthnicity: 'Kinh',
      monitorNationality: 'Việt Nam',
      monitorIdCard: '001075005566',
      monitorResidence: '15 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',

      legalEntityFoundingDate: '10/01/1995',
      legalEntityLicense: 'GP-1995-08',
      legalEntityAddress: '30 Hai Bà Trưng, Hà Nội',
      legalEntityRepName: 'Phạm Hồng Thái',
      legalEntityRepPosition: 'Chủ tịch Hội',
      legalEntityRepIdCard: '001088009988',

      monitoredExtractNumber: '88/2022/GH',
      monitoredRegDate: '15/08/2022',
      monitoredRegPlace: 'UBND Phường Hàng Bài, Hoàn Kiếm',

      registrantIdCard: '001192004455',

      signerFullInfo: 'Nguyễn Tiến Dũng - Chủ tịch UBND',
      implementerName: 'Trần Tư Pháp',
      notes: 'Đã hoàn thành thời hạn giám sát theo quy định',
      finalRegDate: '20/04/2024',
      finalRegPlace: 'UBND Phường Hàng Bài'
    }
  ];

  const handlePdfView = () => {
    alert('Chức năng xem file văn bản sẽ được bổ sung sau.');
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
                <div className="p-4 border-b border-slate-200 flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo mã hồ sơ, tên người giám sát..."
                      className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <button
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm"
                  >
                    <Filter className="w-4 h-4" />
                    Lọc nâng cao
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm">
                    <Download className="w-4 h-4" />
                    Xuất Excel
                  </button>
                </div>

                <div className="flex-1 overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">STT</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">Mã hồ sơ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">Họ và tên người giám sát</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">Tên pháp nhân giám sát</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">Số đăng ký giám hộ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">Người đăng ký chấm dứt giám sát</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 text-center">Ngày đồng bộ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 text-center">Văn bản</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {records.map((record, index) => (
                        <tr key={record.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-900">{index + 1}</td>
                          <td className="px-4 py-3 font-medium text-slate-900">{record.recordCode}</td>
                          <td className="px-4 py-3 font-medium text-red-700">{record.monitorName}</td>
                          <td className="px-4 py-3 text-slate-600">{record.legalEntityMonitorName || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{record.guardianshipRegNumber}</td>
                          <td className="px-4 py-3 text-slate-600">{record.registrantName}</td>
                          <td className="px-4 py-3 text-slate-600 text-center whitespace-nowrap">{record.syncDate}</td>
                          <td className="px-4 py-3 text-center">
                            {record.hasPdf ? (
                              <button onClick={handlePdfView} className="text-blue-600 hover:underline">
                                <FileText className="w-4 h-4 inline" />
                              </button>
                            ) : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs inline-flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Đã duyệt
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/30">
                  <div className="text-sm text-slate-600">
                    Hiển thị <span className="font-medium text-slate-900">1-{records.length}</span> trong <span className="font-medium text-slate-900">{totalRecords}</span> bản ghi
                  </div>
                  <div className="flex gap-1">
                    <button className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-white transition-colors disabled:opacity-50">Trước</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium transition-colors">1</button>
                    <button className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-white transition-colors disabled:opacity-50">Sau</button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'sync' && (
              <div className="p-12 text-center text-slate-400">Chưa có dữ liệu lịch sử đồng bộ chi tiết.</div>
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
              <div className="p-6 flex-1 overflow-auto">
                {/* Tab: Thông tin hồ sơ */}
                <div className="mb-8">
                  <div className="space-y-6">
                    <div className="mb-6">
                      <div className="flex flex-col gap-3">
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Mã hồ sơ</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.recordCode}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số đăng ký</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.regNumber || '-'}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Số quyển</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.bookNumber || '-'}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Trang số</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.pageNumber || '-'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex flex-col gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrantName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Giấy tờ tùy thân</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrantIdCard || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab: Người giám sát */}
                <div className="mb-8">
                  <div className="space-y-6">
                    <div className="mb-6">
                      <div className="flex flex-col gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên</div>
                          <div className="text-sm text-slate-900 font-medium text-red-700">{selectedRecord.monitorName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                          <div className="text-sm text-slate-900">{selectedRecord.monitorBirthDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Giới tính</div>
                          <div className="text-sm text-slate-900">{selectedRecord.monitorGender}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Dân tộc</div>
                          <div className="text-sm text-slate-900">{selectedRecord.monitorEthnicity}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Quốc tịch</div>
                          <div className="text-sm text-slate-900">{selectedRecord.monitorNationality}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân/Giấy tờ tùy thân</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.monitorIdCard}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi cư trú</div>
                          <div className="text-sm text-slate-900">{selectedRecord.monitorResidence}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex flex-col gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Tên pháp nhân</div>
                          <div className="text-sm text-slate-900 font-medium text-red-700">{selectedRecord.legalEntityMonitorName || '-'}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày thành lập</div>
                          <div className="text-sm text-slate-900">{selectedRecord.legalEntityFoundingDate || '-'}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Giấy phép thành lập/Mã số kinh doanh</div>
                          <div className="text-sm text-slate-900">{selectedRecord.legalEntityLicense || '-'}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Trụ sở</div>
                          <div className="text-sm text-slate-900">{selectedRecord.legalEntityAddress || '-'}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên người đại diện</div>
                          <div className="text-sm text-slate-900">{selectedRecord.legalEntityRepName || '-'}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Chức vụ</div>
                          <div className="text-sm text-slate-900">{selectedRecord.legalEntityRepPosition || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab: Việc giám hộ */}
                <div className="mb-8">
                  <div className="mb-6">
                    <div className="flex flex-col gap-3">
                      <div className="border border-slate-200 p-2 rounded">
                        <div className="text-xs text-slate-600 mb-1">Trích lục đăng ký giám hộ số</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.monitoredExtractNumber}</div>
                      </div>
                      <div className="border border-slate-200 p-2 rounded">
                        <div className="text-xs text-slate-600 mb-1">Ngày đăng ký việc giám hộ</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.monitoredRegDate}</div>
                      </div>
                      <div className="border border-slate-200 p-2 rounded col-span-2">
                        <div className="text-xs text-slate-600 mb-1">Đăng ký tại</div>
                        <div className="text-sm text-slate-900">{selectedRecord.monitoredRegPlace}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab: Thông tin khác */}
                <div className="mb-8">
                  <div className="space-y-6">
                    <div className="mb-6">
                      <div className="flex flex-col gap-3">
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Người ký (Họ tên, chức vụ)</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.signerFullInfo}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Người thực hiện</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.implementerName}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded">
                          <div className="text-xs text-slate-600 mb-1">Ngày đăng ký</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.finalRegDate}</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded col-span-2">
                          <div className="text-xs text-slate-600 mb-1">Nơi đăng ký</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.finalRegPlace}</div>
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
