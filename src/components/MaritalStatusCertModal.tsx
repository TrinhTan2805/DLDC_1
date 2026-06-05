import { X, Search, Filter, Download, XCircle, CheckCircle, AlertCircle, Eye, RefreshCw, Calendar, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { MaritalStatusSearchFilter } from './marital-status-cert/MaritalStatusSearchFilter';
import { MaritalStatusTable } from './marital-status-cert/MaritalStatusTable';

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  return (
    <>
      {/* Backdrop */}
      {!isInline && <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>}
      
      {/* Container */}
      <div className={isInline ? "w-full flex flex-col" : "fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"}>
        {isInline && (
          <div className="flex flex-col mb-4">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500 mt-1">Tích hợp: {title}. Thuộc đơn vị: Cục Hành chính tư pháp.</p>
          </div>
        )}
        
        <div className={isInline ? "flex flex-col flex-1" : "bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] pointer-events-auto flex flex-col"}>
          {/* Header */}
          {!isInline && (
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-white sticky top-0 z-20 rounded-t-lg">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                <p className="text-sm text-slate-500 mt-1">Tích hợp: {title}. Thuộc đơn vị: Cục Hành chính tư pháp.</p>
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
                <MaritalStatusSearchFilter
                  isFilterOpen={isFilterOpen}
                  setIsFilterOpen={setIsFilterOpen}
                  filterConditions={filterConditions}
                  setFilterConditions={setFilterConditions}
                  onExport={() => alert('Đang kết xuất...')}
                  onRefresh={() => {}}
                  isInline={isInline}
                />

                <div className={isInline ? "bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                  <MaritalStatusTable
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
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-[13px]"
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
