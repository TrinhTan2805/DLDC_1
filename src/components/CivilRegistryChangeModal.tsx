import { X, Search, Filter, Download, XCircle, CheckCircle, AlertCircle, Eye, FileText } from 'lucide-react';
import { useState } from 'react';

export interface CivilRegistryChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
}

export interface CivilRegistryChangeRecord {
  id: string;
  status: 'approved' | 'pending' | 'error';
  
  // List fields (as per Image 1)
  recordCode: string; // Mã hồ sơ
  changedPersonName: string; // Họ và tên người được thay đổi
  personalId: string; // Số định danh cá nhân
  registrantName: string; // Họ và tên người đi đăng ký
  relationship: string; // Quan hệ
  civilDocNumber: string; // Số giấy tờ hộ tịch
  syncDate: string; // Ngày đồng bộ
  hasPdf: boolean; // Văn bản

  // Tab 1: Người được thay đổi TT hộ tịch (Image 2)
  targetGender?: string;
  targetBirthDate?: string;
  targetHometown?: string;
  targetBirthPlace?: string;
  targetEthnicity?: string;
  targetNationality?: string;
  targetIdIssueDate?: string;
  targetIdIssuePlace?: string;
  targetIdNumber?: string;
  targetResidence?: string;
  targetReason?: string; // Lý do đề nghị

  // Tab 2: Người đi đăng ký (Image 3)
  registrantIdIssueDate?: string;
  registrantIdIssuePlace?: string;
  registrantIdNumber?: string;
  registrantPersonalId?: string;

  // Tab 3: Thông tin đăng ký & nội dung thay đổi (Image 3 continued)
  registrationPlace?: string;
  registrationDate?: string;
  registrationType?: string;
  civilDocIssueDate?: string;
  civilDocIssuePlace?: string;
  signerName?: string;
  signerPosition?: string;
  implementerName?: string;
  proposedContent?: string; // Nội dung đề nghị thay đổi...
  proposedReason?: string; // Lý do đề nghị thay đổi...
  notes?: string; // Ghi chú
}

export function CivilRegistryChangeModal({ 
  isOpen, 
  onClose, 
  title, 
  totalRecords,
  newRecords,
  updatedRecords,
  errorRecords
}: CivilRegistryChangeModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<CivilRegistryChangeRecord | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  if (!isOpen) return null;

  // Mock data
  const records: CivilRegistryChangeRecord[] = [
    {
      id: '1',
      status: 'approved',
      recordCode: 'TĐHT-2024-009988',
      changedPersonName: 'Nguyễn Thị Thu Hà',
      personalId: '001195000123',
      registrantName: 'Nguyễn Văn Hùng',
      relationship: 'Cha đẻ',
      civilDocNumber: '35/2024/GCN-TĐHT',
      syncDate: '18/04/2024 08:30:15',
      hasPdf: true,
      
      targetGender: 'Nữ',
      targetBirthDate: '15/05/1995',
      targetHometown: 'Hà Nội',
      targetBirthPlace: 'Bệnh viện Phụ sản TW',
      targetEthnicity: 'Kinh',
      targetNationality: 'Việt Nam',
      targetIdIssueDate: '10/01/2021',
      targetIdIssuePlace: 'Cục CS QLHC',
      targetIdNumber: '001195000123',
      targetResidence: 'Số 12, ngõ 34, phố Lê Trọng Tấn, Hà Nội',

      registrantIdIssueDate: '20/02/2018',
      registrantIdIssuePlace: 'Công an Hà Nội',
      registrantIdNumber: '001070004567',
      registrantPersonalId: '001070004567',

      registrationPlace: 'UBND Phường Khương Mai, Quận Thanh Xuân',
      registrationDate: '15/04/2024',
      registrationType: 'Thay đổi thông tin hộ tịch',
      civilDocIssueDate: '15/04/2024',
      civilDocIssuePlace: 'UBND Phường Khương Mai',
      signerName: 'Lê Văn Chính',
      signerPosition: 'Chủ tịch UBND',
      implementerName: 'Nguyễn Tư Pháp',
      proposedContent: 'Thay đổi họ tên từ Nguyễn Thị Hà thành Nguyễn Thị Thu Hà',
      proposedReason: 'Do mong muốn cá nhân và đã được sự đồng ý của gia đình',
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
                        placeholder="Tìm kiếm theo mã hồ sơ, tên người được thay đổi..."
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Người được thay đổi</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">SĐD cá nhân</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Người đi đăng ký</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Quan hệ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Số GTT hộ tịch</th>
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
                          <td className="px-4 py-3 font-medium text-blue-700">{record.changedPersonName}</td>
                          <td className="px-4 py-3 text-slate-600">{record.personalId}</td>
                          <td className="px-4 py-3 text-slate-900">{record.registrantName}</td>
                          <td className="px-4 py-3 text-slate-600">{record.relationship}</td>
                          <td className="px-4 py-3 text-slate-600">{record.civilDocNumber}</td>
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
                <div className="mb-6">
                  <div className="flex flex-col gap-3">
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Mã hồ sơ</div>
                      <div className="text-sm text-slate-900 font-medium">{selectedRecord.recordCode || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Số giấy tờ hộ tịch</div>
                      <div className="text-sm text-slate-900 font-medium">{selectedRecord.civilDocNumber || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân</div>
                      <div className="text-sm text-slate-900 font-medium">{selectedRecord.personalId || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Ngày đồng bộ</div>
                      <div className="text-sm text-slate-900 font-medium">{selectedRecord.syncDate || '-'}</div>
                    </div>
                  </div>
                </div>
                </div>

                {/* Người được thay đổi */}
                <div className="mb-8">
                <div className="mb-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="border border-slate-200 p-2 rounded lg:col-span-2">
                      <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên</div>
                      <div className="text-sm text-slate-900 font-medium text-blue-700">{selectedRecord.changedPersonName || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                      <div className="text-sm text-slate-900">{selectedRecord.targetBirthDate || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Giới tính</div>
                      <div className="text-sm text-slate-900">{selectedRecord.targetGender || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Dân tộc</div>
                      <div className="text-sm text-slate-900">{selectedRecord.targetEthnicity || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Quốc tịch</div>
                      <div className="text-sm text-slate-900">{selectedRecord.targetNationality || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded lg:col-span-2">
                        <div className="text-xs text-slate-600 mb-1">Số giấy tờ tùy thân</div>
                        <div className="text-sm text-slate-900">{selectedRecord.targetIdNumber || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded col-span-2 lg:col-span-4">
                      <div className="text-xs text-slate-600 mb-1">Nơi cư trú</div>
                      <div className="text-sm text-slate-900 font-medium">{selectedRecord.targetResidence || '-'}</div>
                    </div>
                  </div>
                </div>
                </div>

                {/* Tab: Thông tin khác */}
                <div className="mb-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex flex-col gap-3">
                      <div className="border border-slate-200 p-2 rounded col-span-2">
                        <div className="text-xs text-slate-600 mb-1">Nơi đăng ký</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationPlace || '-'}</div>
                      </div>
                      <div className="border border-slate-200 p-2 rounded">
                        <div className="text-xs text-slate-600 mb-1">Ngày đăng ký</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationDate || '-'}</div>
                      </div>
                      <div className="border border-slate-200 p-2 rounded">
                        <div className="text-xs text-slate-600 mb-1">Loại đăng ký</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationType || '-'}</div>
                      </div>
                      <div className="border border-slate-200 p-2 rounded">
                        <div className="text-xs text-slate-600 mb-1">Người ký</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.signerName || '-'}</div>
                      </div>
                      <div className="border border-slate-200 p-2 rounded">
                        <div className="text-xs text-slate-600 mb-1">Chức vụ người ký</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.signerPosition || '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="space-y-3">
                      <div className="border border-slate-200 p-3 rounded">
                        <div className="text-xs text-slate-600 mb-1">Nội dung đề nghị thay đổi, cải chính, bổ sung thông tin hộ tịch, xác định lại dân tộc</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.proposedContent || '-'}</div>
                      </div>
                      <div className="border border-slate-200 p-3 rounded">
                        <div className="text-xs text-slate-600 mb-1">Lý do đề nghị thay đổi, cải chính, bổ sung thông tin hộ tịch, xác định lại dân tộc</div>
                        <div className="text-sm text-slate-900 font-medium italic">{selectedRecord.proposedReason || '-'}</div>
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
