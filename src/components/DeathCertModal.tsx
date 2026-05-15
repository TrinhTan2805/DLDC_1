import { X, Search, Filter, Download, XCircle, CheckCircle, AlertCircle, Eye, RefreshCw, Calendar, ArrowUp, FileText, FileDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DeathCertSearchFilter } from './death-cert/DeathCertSearchFilter';
import { DeathCertTable } from './death-cert/DeathCertTable';

export interface DeathCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
  isInline?: boolean;
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
  errorRecords,
  isInline = false
}: DeathCertModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<DeathCertRecord | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);
  const [viewingPdfUrl, setViewingPdfUrl] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (!isOpen && !isInline) return null;

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
    }
  ];

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  return (
    <div className="death-cert-modal">
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
                <DeathCertSearchFilter
                  isFilterOpen={isFilterOpen}
                  setIsFilterOpen={setIsFilterOpen}
                  filterConditions={filterConditions}
                  setFilterConditions={setFilterConditions}
                  onExport={() => alert('Đang kết xuất...')}
                  onRefresh={() => {}}
                  isInline={isInline}
                />

                <div className={isInline ? "bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                  <DeathCertTable
                    records={records}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    totalRecords={totalRecords}
                    onViewRecord={(record) => setSelectedRecord(record)}
                    onViewPdf={(url) => setViewingPdfUrl(url)}
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
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên người chết</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedName || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Giới tính</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedGender || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedBirthDate || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Dân tộc</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedEthnicity || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Quốc tịch</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedNationality || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Nơi cư trú</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedResidence || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số GTTT</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedIdNumber || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.deceasedPersonalId || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Giờ, phút chết</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.deathHour}:{selectedRecord.deathMinute}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm chết</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.deathDate || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ngày tháng năm chết (bằng chữ)</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.deathDateWords || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Nơi chết</div>
                    <div className="text-sm text-slate-900 font-medium text-orange-700">{selectedRecord.deathPlace || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Nguyên nhân chết</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.deathCause || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số Giấy báo tử/Số giấy tờ thay thế Giấy báo tử</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.deathNoticeNumber || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên người đi khai tử</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.declarerName || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Quan hệ với người chết</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.declarerRelationship || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số GTTT người đi khai tử</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.declarerIdNumber || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân người đi khai tử</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.declarerPersonalId || '-'}</div>
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
                    <div className="text-xs text-slate-600 mb-1">Người thực hiện</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.implementer || '-'}</div>
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

      {/* PDF Viewer Modal */}
      {viewingPdfUrl && (
        <div className="pdf-viewer-modal-container">
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1100 }}>
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-auto" 
              onClick={() => setViewingPdfUrl(null)} 
            />
            
            {/* Top Controls */}
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

            {/* Document Area */}
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 sm:p-14 pointer-events-none">
              <div className="w-full max-w-5xl h-full bg-white shadow-[0_0_80px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500 pointer-events-auto relative z-10 flex items-center justify-center bg-slate-200">
                <iframe 
                  src={`${viewingPdfUrl}#toolbar=0&navpanes=0&scrollbar=1`} 
                  className="w-full h-full border-none"
                  title="PDF Viewer"
                />
              </div>

              {/* Bottom Toolbar */}
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
        </div>
      )}
    </div>
  );
}
