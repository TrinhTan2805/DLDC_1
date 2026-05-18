import { X, Search, Filter, Download, XCircle, CheckCircle, AlertCircle, Eye, FileText, RefreshCw, Calendar, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { GuardianshipSearchFilter } from './guardianship-cert/GuardianshipSearchFilter';
import { GuardianshipTable } from './guardianship-cert/GuardianshipTable';

export interface GuardianshipCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
  isInline?: boolean;
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
  errorRecords,
  isInline = false
}: GuardianshipCertModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<GuardianshipCertRecord | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  if (!isOpen && !isInline) return null;

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

          {/* Content */}
          <div className={`flex-1 overflow-hidden flex flex-col ${isInline ? '' : 'bg-white rounded-b-lg'}`}>
            {activeTab === 'list' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <GuardianshipSearchFilter
                  isFilterOpen={isFilterOpen}
                  setIsFilterOpen={setIsFilterOpen}
                  filterConditions={filterConditions}
                  setFilterConditions={setFilterConditions}
                  onExport={() => alert('Đang kết xuất...')}
                  onRefresh={() => {}}
                  isInline={isInline}
                />

                <div className={isInline ? "bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                  <GuardianshipTable
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
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setSelectedRecord(null)} />
          
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50/50 sticky top-0 z-20">
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
                    { label: 'Họ, chữ đệm, tên người được giám hộ', value: selectedRecord.wardName },
                    { label: 'Giới tính', value: selectedRecord.wardGender },
                    { label: 'Ngày, tháng, năm sinh', value: selectedRecord.wardBirthDate },
                    { label: 'Nơi sinh', value: selectedRecord.wardBirthPlace },
                    { label: 'Dân tộc', value: selectedRecord.wardEthnicity },

                    { label: 'Quốc tịch', value: selectedRecord.wardNationality },
                    { label: 'Số GTTT', value: selectedRecord.wardIdNumber },
                    { label: 'Nơi cư trú', value: selectedRecord.wardResidence },
                    { label: 'Lý do giám hộ', value: selectedRecord.guardianshipReason, isItalic: true },
                    { label: 'Họ, chữ đệm, tên người giám hộ', value: selectedRecord.guardianName },
                    { label: 'Giới tính người giám hộ', value: selectedRecord.guardianGender },

                    { label: 'Ngày, tháng, năm sinh người giám hộ', value: selectedRecord.guardianBirthDate },
                    { label: 'Dân tộc người giám hộ', value: selectedRecord.guardianEthnicity },
                    { label: 'Quốc tịch người giám hộ', value: selectedRecord.guardianNationality },
                    { label: 'Số GTTT người giám hộ', value: selectedRecord.guardianIdNumber },
                    { label: 'Số định danh cá nhân người giám hộ', value: selectedRecord.guardianPersonalId },
                    { label: 'Nơi cư trú người giám hộ', value: selectedRecord.guardianResidence },

                    { label: 'Loại giám hộ', value: selectedRecord.guardianshipType },
                    { label: 'Loại đăng ký', value: selectedRecord.registrationType },
                    { label: 'Tình trạng giám hộ', value: selectedRecord.guardianshipStatus },
                    { label: 'Ngày đăng ký', value: selectedRecord.registrationDate },
                    { label: 'Nơi đăng ký', value: selectedRecord.registrationPlace },
                    { label: 'Người ký', value: selectedRecord.signerName },

                    { label: 'Chức vụ', value: selectedRecord.signerPosition },
                    { label: 'Họ, chữ đệm, tên người yêu cầu', value: selectedRecord.requesterName },
                    { label: 'Quan hệ với người được giám hộ', value: selectedRecord.requesterRelationship },
                    { label: 'Số GTTT người yêu cầu', value: selectedRecord.requesterIdNumber },
                    { label: 'Người thực hiện', value: selectedRecord.implementerName },
                    { label: 'Ghi chú', value: selectedRecord.notes, isItalic: true, colSpan2: true }
                  ].reduce<any[]>((acc, field, index) => {
                    if (index > 0 && index % 6 === 0) {
                      acc.push(
                        <div key={`divider-${index}`} className="col-span-2 border-t border-slate-200 my-2 w-full"></div>
                      );
                    }
                    acc.push(
                      <div key={`field-${index}`} className={`space-y-1 ${field.colSpan2 ? 'col-span-2' : ''}`}>
                        <div className="text-[13px] font-semibold text-slate-700">{field.label}</div>
                        <div className={`text-[13px] ${field.isBlue ? 'text-blue-600' : 'text-slate-900'} ${field.isItalic ? 'italic whitespace-pre-wrap text-slate-600' : ''}`}>
                          {field.value || '-'}
                        </div>
                      </div>
                    );
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
        </div>
      )}
    </>
  );
}
