import { X, Search, Filter, Download, FileDown, XCircle, CheckCircle, AlertCircle, Eye, RefreshCw, Calendar, ArrowUp, Plus, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { BirthCertSearchFilter } from './birth-cert/BirthCertSearchFilter';
import { BirthCertTable } from './birth-cert/BirthCertTable';

interface BirthCertDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
  isInline?: boolean;
}

interface BirthRecord {
  id: string;
  code: string;
  name: string;
  gender: string;
  birthDate: string;
  birthDateInWords: string;
  birthPlace: string;
  hometown: string;
  ethnicity: string;
  nationality: string;
  personalId: string;
  certificateNo: string;
  registrationDate: string;
  syncDate: string;
  type: string;
  status: 'approved' | 'pending' | 'error';
  approvalStatus: string;
  collectedAt: string;
  hasError?: boolean;
  errorMessage?: string;
  
  // Thông tin hồ sơ
  recordCode?: string;
  registrationNumber?: string;
  bookNumber?: string;
  pageNumber?: string;
  fileId?: string;
  
  // Thông tin Cha
  fatherName?: string;
  fatherBirthDate?: string;
  fatherEthnicity?: string;
  fatherNationality?: string;
  fatherAddress?: string;
  fatherPersonalId?: string;
  
  // Thông tin Mẹ
  motherName?: string;
  motherBirthDate?: string;
  motherEthnicity?: string;
  motherNationality?: string;
  motherAddress?: string;
  motherPersonalId?: string;
  
  // Người đi khai sinh
  declarantName?: string;
  declarantRelation?: string;
}

export function BirthCertDetailModal({ 
  isOpen, 
  onClose, 
  title, 
  totalRecords,
  newRecords,
  updatedRecords,
  errorRecords,
  isInline = false
}: BirthCertDetailModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<BirthRecord | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (!isOpen && !isInline) return null;

  // Mock data
  const records: BirthRecord[] = [
    {
      id: '1',
      code: 'REC-2025-001',
      name: 'Nguyễn Văn An',
      gender: 'Nam',
      birthDate: '15/05/1985',
      birthDateInWords: 'Ngày 15 tháng 5 năm 1985',
      birthPlace: 'Hà Nội',
      hometown: 'Hà Nội',
      ethnicity: 'Kinh',
      nationality: 'Việt Nam',
      personalId: '001234567890',
      certificateNo: '001234567890',
      registrationDate: '15/05/1985',
      syncDate: '19/12/2025 15:30:00',
      type: 'Mới',
      status: 'approved',
      approvalStatus: 'Đã đồng bộ',
      collectedAt: '19/12/2025 15:30:00',
      recordCode: 'KS-2025-001234',
      registrationNumber: '001234/2025',
      bookNumber: '01',
      pageNumber: '15',
      fatherName: 'Nguyễn Văn Bình',
      fatherBirthDate: '01/01/1950',
      motherName: 'Trần Thị Cúc',
      motherBirthDate: '01/01/1950',
      declarantName: '-',
      declarantRelation: '-'
    },
    {
      id: '2',
      code: 'REC-2025-002',
      name: 'Trần Thị Bình',
      gender: 'Nữ',
      birthDate: '20/08/1990',
      birthDateInWords: 'Ngày 20 tháng 8 năm 1990',
      birthPlace: 'Hà Nội',
      hometown: 'Hà Nội',
      ethnicity: 'Kinh',
      nationality: 'Việt Nam',
      personalId: '001234567891',
      certificateNo: '001234567891',
      registrationDate: '20/08/1990',
      syncDate: '19/12/2025 15:30:02',
      type: 'Mới',
      status: 'approved',
      approvalStatus: 'Đã đồng bộ',
      collectedAt: '19/12/2025 15:30:02',
      recordCode: 'KS-2025-001235',
      registrationNumber: '001235/2025',
      bookNumber: '01',
      pageNumber: '16'
    }
  ];

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  return (
    <>
      {/* Backdrop - Only if not inline */}
      {!isInline && <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>}
      
      {/* Container */}
      <div className={isInline ? "w-full flex flex-col" : "fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"}>
        {isInline && (
          <div className="flex flex-col mb-4">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500 mt-1">
              Tích hợp: Hồ sơ khai sinh.
              <br />
              Thuộc đơn vị: Cục Hành chính tư pháp.
            </p>
          </div>
        )}
        
        <div className={isInline ? "flex flex-col flex-1" : "bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] pointer-events-auto flex flex-col"}>
          {/* Header */}
          {!isInline && (
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-white sticky top-0 z-20 rounded-t-lg">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Tích hợp: Hồ sơ khai sinh.
                  <br />
                  Thuộc đơn vị: Cục Hành chính tư pháp.
                </p>
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
                <BirthCertSearchFilter
                  isFilterOpen={isFilterOpen}
                  setIsFilterOpen={setIsFilterOpen}
                  filterConditions={filterConditions}
                  setFilterConditions={setFilterConditions}
                  onExport={() => alert('Đang kết xuất...')}
                  onRefresh={() => {}}
                  isInline={isInline}
                />

                <div className={isInline ? "bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                  <BirthCertTable
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
        <>
          <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" onClick={() => setSelectedRecord(null)}></div>
          
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Chi tiết bản ghi</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Đóng chi tiết"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-0 flex-1 overflow-auto bg-slate-50/30 text-slate-900">
                <div className="p-6 space-y-6">
                  {/* Section: Thông tin hồ sơ */}
                  <section>
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                      Thông tin hồ sơ
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Mã hồ sơ</div>
                        <div className="text-sm text-slate-900 font-semibold">{selectedRecord.recordCode || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Số đăng ký</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.registrationNumber || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Số quyển</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.bookNumber || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Trang số</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.pageNumber || '-'}</div>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Tệp đính kèm</div>
                        <div className="text-sm text-blue-600 font-medium hover:underline cursor-pointer flex items-center gap-1.5">
                          <FileDown className="w-4 h-4" />
                          {selectedRecord.fileId || 'Không có tệp đính kèm'}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section: Thông tin trẻ em */}
                  <section>
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                      Thông tin trẻ em
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Họ, chữ đệm, tên</div>
                        <div className="text-sm text-slate-900 font-bold">{selectedRecord.name || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Giới tính</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.gender || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày, tháng, năm sinh</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.birthDate || '-'}</div>
                      </div>
                      <div className="space-y-1 col-span-full">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày sinh bằng chữ</div>
                        <div className="text-sm text-slate-900 italic font-medium bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">{selectedRecord.birthDateInWords || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Nơi sinh</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.birthPlace || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Quê quán</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.hometown || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Dân tộc</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.ethnicity || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Quốc tịch</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.nationality || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Số định danh cá nhân</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.personalId || '-'}</div>
                      </div>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Section: Thông tin Cha */}
                    <section>
                      <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                        Thông tin Cha
                      </h4>
                      <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full">
                        <div className="space-y-1">
                          <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Họ tên Cha</div>
                          <div className="text-sm text-slate-900 font-bold">{selectedRecord.fatherName || '-'}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày sinh Cha</div>
                          <div className="text-sm text-slate-900 font-medium font-mono">{selectedRecord.fatherBirthDate || '-'}</div>
                        </div>
                      </div>
                    </section>

                    {/* Section: Thông tin Mẹ */}
                    <section>
                      <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                        Thông tin Mẹ
                      </h4>
                      <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full">
                        <div className="space-y-1">
                          <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Họ tên Mẹ</div>
                          <div className="text-sm text-slate-900 font-bold">{selectedRecord.motherName || '-'}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày sinh Mẹ</div>
                          <div className="text-sm text-slate-900 font-medium font-mono">{selectedRecord.motherBirthDate || '-'}</div>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Section: Người đi khai sinh */}
                    <section>
                      <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                        Người đi khai sinh
                      </h4>
                      <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full">
                        <div className="space-y-1">
                          <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Họ tên người khai sinh</div>
                          <div className="text-sm text-slate-900 font-bold">{selectedRecord.declarantName || '-'}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Quan hệ với người được khai sinh</div>
                          <div className="text-sm text-slate-900 font-medium">{selectedRecord.declarantRelation || '-'}</div>
                        </div>
                      </div>
                    </section>

                    {/* Section: Thông tin đăng ký */}
                    <section>
                      <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                        Thông tin đăng ký
                      </h4>
                      <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full">
                        <div className="space-y-1">
                          <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày đăng ký</div>
                          <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.registrationDate || '-'}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày đồng bộ</div>
                          <div className="text-sm text-slate-900 font-medium font-mono">{selectedRecord.syncDate || '-'}</div>
                        </div>
                      </div>
                    </section>
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
