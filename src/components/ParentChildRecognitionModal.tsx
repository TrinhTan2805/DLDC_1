import { X, Search, Filter, Download, XCircle, CheckCircle, AlertCircle, Eye, RefreshCw, Calendar, ArrowUp, FileText, FileDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ParentChildSearchFilter } from './parent-child-recognition/ParentChildSearchFilter';
import { ParentChildTable } from './parent-child-recognition/ParentChildTable';

export interface ParentChildRecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
  isInline?: boolean;
}

export interface ParentChildRecognitionRecord {
  id: string;
  status: 'approved' | 'pending' | 'error';
  hasError?: boolean;
  errorMessage?: string;

  // List fields
  parentName: string;
  parentGender: string;
  parentBirthDate: string;
  childName: string;
  childGender: string;
  childBirthDate: string;
  syncDate?: string;
  pdfUrl?: string;

  // Tab 1: Hồ sơ đăng ký
  fileId?: string;
  recordCode?: string;
  confirmationType?: string;
  registrationType?: string;
  registrationNumber?: string;
  bookNumber?: string;
  pageNumber?: string;

  // Tab 2: Thông tin cha mẹ
  parentEthnicity: string;
  parentNationality: string;
  parentHometown: string;
  parentIdIssueDate?: string;
  parentIdIssuePlace?: string;
  parentIdNumber?: string;
  parentPersonalId?: string;
  parentResidence: string;

  // Tab 3: Thông tin con
  childEthnicity: string;
  childNationality: string;
  childHometown: string;
  childIdIssueDate?: string;
  childIdIssuePlace?: string;
  childIdNumber?: string;
  childPersonalId?: string;
  childResidence: string;

  // Tab 4: Thông tin người đăng ký & Khác
  declarerName?: string;
  declarerRelationship?: string;
  declarerIdIssueDate?: string;
  declarerIdIssuePlace?: string;
  declarerIdNumber?: string;
  declarerPersonalId?: string;

  registrationPlace?: string;
  registrationDate?: string;
  signerName?: string;
  signerPosition?: string;
  foreignExtractNumberAndName?: string;
  foreignExtractIssueDate?: string;
  foreignAgencyName?: string;
  foreignCountry?: string;
  implementer?: string;
  notes?: string;
}

export function ParentChildRecognitionModal({ 
  isOpen, 
  onClose, 
  title, 
  totalRecords,
  newRecords,
  updatedRecords,
  errorRecords,
  isInline = false
}: ParentChildRecognitionModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<ParentChildRecognitionRecord | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);
  const [viewingPdfUrl, setViewingPdfUrl] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (!isOpen && !isInline) return null;

  // Mock data
  const records: ParentChildRecognitionRecord[] = [
    {
      id: '1',
      status: 'approved',
      parentName: 'Võ Thành Nhớ',
      parentGender: 'Nam',
      parentBirthDate: '15/04/1985',
      childName: 'Võ Minh Quân',
      childGender: 'Nam',
      childBirthDate: '10/05/2015',
      syncDate: '16/04/2024 09:12:35',
      pdfUrl: '/mau-tk-dk-nhan-cha-me-con.pdf',
      
      fileId: 'ho_so_xac_nhan_01.pdf',
      recordCode: 'NCMC-2024-001234',
      confirmationType: 'Nhận cha con',
      registrationType: 'Đăng ký mới',
      registrationNumber: '1234/2024',
      bookNumber: '1',
      pageNumber: '45',

      parentEthnicity: 'Kinh',
      parentNationality: 'Việt Nam',
      parentHometown: 'Quy Nhơn, Bình Định',
      parentIdIssueDate: '01/01/2010',
      parentIdIssuePlace: 'Công an Bình Định',
      parentIdNumber: '001045001234',
      parentPersonalId: '001045001234',
      parentResidence: '123 Nguyễn Huệ, Quy Nhơn, Bình Định',

      childEthnicity: 'Kinh',
      childNationality: 'Việt Nam',
      childHometown: 'Quy Nhơn, Bình Định',
      childIdIssueDate: '',
      childIdIssuePlace: '',
      childIdNumber: '',
      childPersonalId: '052215000111',
      childResidence: '123 Nguyễn Huệ, Quy Nhơn, Bình Định',

      declarerName: 'Võ Thành Nhớ',
      declarerRelationship: 'Cha đẻ',
      declarerIdIssueDate: '01/01/2010',
      declarerIdIssuePlace: 'Công an Bình Định',
      declarerIdNumber: '001045001234',
      declarerPersonalId: '001045001234',

      registrationPlace: 'UBND Phường Lê Lợi, TP Quy Nhơn',
      registrationDate: '18/04/2024',
      signerName: 'Lê Văn C',
      signerPosition: 'Chủ tịch UBND Phường',
      implementer: 'Trần Thị D',
      notes: ''
    },
    {
      id: '2',
      status: 'pending',
      parentName: 'Nguyễn Thị Hương',
      parentGender: 'Nữ',
      parentBirthDate: '20/08/1990',
      childName: 'Nguyễn Bảo Linh',
      childGender: 'Nữ',
      childBirthDate: '05/01/2020',
      syncDate: '21/04/2024 14:05:00',
      pdfUrl: '/mau-tk-dk-nhan-cha-me-con.pdf',
      
      fileId: 'ho_so_xac_nhan_02.pdf',
      recordCode: 'NCMC-2024-005678',
      confirmationType: 'Nhận mẹ con',
      registrationType: 'Đăng ký quá hạn',
      registrationNumber: '5678/2024',
      bookNumber: '2',
      pageNumber: '12',

      parentEthnicity: 'Kinh',
      parentNationality: 'Việt Nam',
      parentHometown: 'Nam Định',
      parentIdIssueDate: '15/06/2015',
      parentIdIssuePlace: 'Công an TP Hà Nội',
      parentIdNumber: '020534567',
      parentPersonalId: '001190001234',
      parentResidence: '456 Cầu Giấy, Hà Nội',

      childEthnicity: 'Kinh',
      childNationality: 'Việt Nam',
      childHometown: 'Nam Định',
      childIdIssueDate: '',
      childIdIssuePlace: '',
      childIdNumber: '',
      childPersonalId: '001220002222',
      childResidence: '456 Cầu Giấy, Hà Nội',

      declarerName: 'Trần Mạnh Hùng',
      declarerRelationship: 'Người làm chứng',
      declarerIdIssueDate: '10/10/2018',
      declarerIdIssuePlace: 'Cục Cảnh sát QLHC',
      declarerIdNumber: '079085002468',
      declarerPersonalId: '079085002468',

      registrationPlace: 'UBND Phường Cầu Giấy, Hà Nội',
      registrationDate: '22/04/2024',
      signerName: 'Nguyễn Văn E',
      signerPosition: 'Phó Chủ tịch UBND',
      implementer: 'Lê Thị F',
      notes: 'Thủ tục nhận từ cơ sở bảo trợ'
    }
  ];

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

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
                <ParentChildSearchFilter
                  isFilterOpen={isFilterOpen}
                  setIsFilterOpen={setIsFilterOpen}
                  filterConditions={filterConditions}
                  setFilterConditions={setFilterConditions}
                  onExport={() => alert('Đang kết xuất...')}
                  onRefresh={() => {}}
                  isInline={isInline}
                />

                <div className={isInline ? "bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                  <ParentChildTable
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
                <h3 className="text-lg font-semibold text-slate-900">Chi tiết bản ghi đăng ký nhận cha, mẹ, con</h3>
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
                    <div className="text-xs text-slate-600 mb-1">Loại xác nhận</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.confirmationType || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Loại đăng ký</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationType || '-'}</div>
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
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên cha/mẹ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.parentName || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Giới tính cha/mẹ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.parentGender || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh cha/mẹ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.parentBirthDate || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Dân tộc cha/mẹ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.parentEthnicity || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Quốc tịch cha/mẹ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.parentNationality || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Quê quán cha/mẹ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.parentHometown || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số GTTT cha/mẹ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.parentIdNumber || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Nơi cư trú cha/mẹ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.parentResidence || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên con</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.childName || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Giới tính con</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.childGender || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh con</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.childBirthDate || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Dân tộc con</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.childEthnicity || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Quốc tịch con</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.childNationality || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Quê quán con</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.childHometown || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số GTTT con</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.childIdNumber || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Nơi cư trú con</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.childResidence || '-'}</div>
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
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên người đi khai</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.declarerName || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Quan hệ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.declarerRelationship || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số GTTT người đi khai</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.declarerIdNumber || '-'}</div>
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
        </>
      )}

      {/* Premium PDF Viewer Modal */}
      {viewingPdfUrl && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1100 }}>
          <div 
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-auto" 
            onClick={() => setViewingPdfUrl(null)} 
          />
          
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

          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 sm:p-14 pointer-events-none">
            <div className="w-full max-w-5xl h-full bg-white shadow-[0_0_80px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500 pointer-events-auto relative z-10 flex items-center justify-center bg-slate-200">
              <iframe 
                src={`${viewingPdfUrl}#toolbar=0&navpanes=0&scrollbar=1`} 
                className="w-full h-full border-none"
                title="Premium PDF Viewer"
              />
            </div>

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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
