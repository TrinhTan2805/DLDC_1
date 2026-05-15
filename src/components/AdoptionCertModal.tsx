import { X, Search, Filter, Download, XCircle, CheckCircle, AlertCircle, Eye, FileText, ArrowLeft, RefreshCw, Calendar, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { AdoptionSearchFilter } from './adoption-cert/AdoptionSearchFilter';
import { AdoptionTable } from './adoption-cert/AdoptionTable';

export interface AdoptionCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
  isInline?: boolean;
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
  errorRecords,
  isInline = false
}: AdoptionCertModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<AdoptionCertRecord | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  if (!isOpen && !isInline) return null;

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
                <AdoptionSearchFilter
                  isFilterOpen={isFilterOpen}
                  setIsFilterOpen={setIsFilterOpen}
                  filterConditions={filterConditions}
                  setFilterConditions={setFilterConditions}
                  onExport={() => alert('Đang kết xuất...')}
                  onRefresh={() => {}}
                  isInline={isInline}
                />

                <div className={isInline ? "bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                  <AdoptionTable
                    records={records}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    totalRecords={totalRecords}
                    onViewRecord={(record) => setSelectedRecord(record)}
                    onViewPdf={handlePdfView}
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
                <h3 className="text-lg font-semibold text-slate-900">Chi tiết bản ghi đăng ký nuôi con nuôi</h3>
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
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.recordCode || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Tệp đính kèm</div>
                    <div className="text-sm text-blue-600 font-medium">{selectedRecord.fileId || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số đăng ký</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationNumber || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số quyển</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.bookNumber || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Trang số</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.pageNumber || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên người được nhận nuôi</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedName || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Giới tính</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedGender || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedBirthDate || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Nơi sinh</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedBirthPlace || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Dân tộc</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedEthnicity || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Quốc tịch</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedNationality || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Quê quán</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedHometown || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số GTTT</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedIdNumber || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedPersonalId || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Nơi cư trú</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.adoptedResidence || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên cha</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.fatherName || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh cha</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.fatherBirthDate || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên mẹ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.motherName || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh mẹ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.motherBirthDate || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên người giao con nuôi (người thứ 1)</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.handoverPerson1Name || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên người giao con nuôi (người thứ 2)</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.handoverPerson2Name || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
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
                    <div className="text-xs text-slate-600 mb-1">Chức vụ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.signerPosition || '-'}</div>
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
