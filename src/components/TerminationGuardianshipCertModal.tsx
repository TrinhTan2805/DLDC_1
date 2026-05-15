import { X, Search, Filter, Download, XCircle, CheckCircle, AlertCircle, Eye, FileText, RefreshCw, Calendar, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { TerminationGuardianshipSearchFilter } from './termination-guardianship/TerminationGuardianshipSearchFilter';
import { TerminationGuardianshipTable } from './termination-guardianship/TerminationGuardianshipTable';

export interface TerminationGuardianshipCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
  isInline?: boolean;
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
  errorRecords,
  isInline = false
}: TerminationGuardianshipCertModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<TerminationGuardianshipCertRecord | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  if (!isOpen && !isInline) return null;

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
      {/* Backdrop */}
      {!isInline && <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />}
      
      {/* Container */}
      <div className={isInline ? "w-full flex flex-col" : "fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"}>
        {isInline && (
          <div className="flex items-center justify-between mb-0">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          </div>
        )}
        
        <div className={isInline ? "flex flex-col flex-1" : "bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] pointer-events-auto flex flex-col"}>
          {/* Header */}
          {!isInline && (
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-white sticky top-0 z-20 rounded-t-lg">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              </div>
              <button
                 onClick={onClose}
                 className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"
                 title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Content Area */}
          <div className={`flex-1 overflow-hidden flex flex-col ${isInline ? '' : 'bg-white rounded-b-lg'}`}>
            {activeTab === 'list' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <TerminationGuardianshipSearchFilter
                  isFilterOpen={isFilterOpen}
                  setIsFilterOpen={setIsFilterOpen}
                  filterConditions={filterConditions}
                  setFilterConditions={setFilterConditions}
                  onExport={() => alert('Đang kết xuất...')}
                  onRefresh={() => {}}
                  isInline={isInline}
                />

                <div className={isInline ? "bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                  <TerminationGuardianshipTable
                    records={records}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    totalRecords={totalRecords}
                    onViewRecord={(record) => setSelectedRecord(record)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="record-detail-modal-container">
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setSelectedRecord(null)}></div>
          
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50/50 sticky top-0 z-20">
                <h3 className="text-lg font-semibold text-slate-900">
                  Chi tiết hồ sơ chấm dứt giám hộ <span className="text-blue-600">#{selectedRecord.recordCode}</span>
                </h3>
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
                <div className="flex flex-col gap-3">
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Mã hồ sơ</div>
                    <div className="text-sm text-slate-900 font-medium">#{selectedRecord.recordCode}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên người được giám hộ</div>
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
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Nơi cư trú</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.wardResidence}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên người giám hộ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianName}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Giới tính người giám hộ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianGender}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh người giám hộ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianBirthDate}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Dân tộc người giám hộ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianEthnicity}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Quốc tịch người giám hộ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianNationality}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số GTTT người giám hộ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianIdNumber}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân người giám hộ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianPersonalId}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Nơi cư trú người giám hộ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.guardianResidence}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
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
                  <div className="border border-slate-200 p-2 rounded">
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
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Căn cứ chấm dứt</div>
                    <div className="text-sm text-slate-900 font-medium italic">{selectedRecord.terminationBasis || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Người ký</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.signerName}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Chức vụ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.signerPosition}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên người yêu cầu</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.requesterName}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Quan hệ với người được giám hộ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.requesterRelationship}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số GTTT người yêu cầu</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.requesterIdNumber}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Người thực hiện</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.implementerName}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ghi chú</div>
                    <div className="text-sm text-slate-600 italic whitespace-pre-wrap">{selectedRecord.notes || '-'}</div>
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
        </div>
      )}
    </>
  );
}
