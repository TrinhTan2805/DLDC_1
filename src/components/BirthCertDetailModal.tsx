import { X, Search, Filter, Download, FileDown, XCircle, CheckCircle, AlertCircle, Eye, RefreshCw, Calendar, ArrowUp, Plus, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

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
      <div className={isInline ? "w-full" : "fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"}>
        <div className={`bg-white ${isInline ? "border border-slate-200 rounded-xl overflow-hidden" : "rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] pointer-events-auto"} flex flex-col`}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-white sticky top-0 z-20">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            </div>
            {!isInline && (
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>



          {/* Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === 'list' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search & Actions */}
                <div className="px-6 py-4 border-b border-slate-200 flex-shrink-0 bg-white">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1"></div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsFilterOpen(!isFilterOpen)}
                          className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all shadow-sm border ${
                            isFilterOpen ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Filter className="w-4 h-4" />
                          Lọc
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all shadow-sm" title="Tải lại">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2 text-sm font-semibold shadow-sm">
                        <Download className="w-4 h-4" />
                        Kết xuất
                      </button>
                    </div>
                  </div>

                  {/* Filter Panel */}
                  {isFilterOpen && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4 shadow-sm animate-in slide-in-from-top-2 duration-200 relative">
                      <div className="absolute -top-2 left-64 w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Điều kiện lọc nâng cao</h4>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              const newId = Date.now().toString();
                              setFilterConditions([...filterConditions, { id: newId, logic: 'AND', field: '', operator: '=', type: 'Text', value: '' }]);
                            }}
                            className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg flex items-center gap-2 text-xs font-bold hover:bg-blue-50 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Thêm điều kiện
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 relative z-10">
                        {filterConditions.map((condition, index) => (
                          <div key={condition.id} className="flex items-center gap-3">
                            <div className="w-20 flex-shrink-0">
                              {index > 0 && (
                                <select aria-label="Select box"
                                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                  value={condition.logic}
                                  onChange={(e) => {
                                    const newConditions = [...filterConditions];
                                    newConditions[index].logic = e.target.value;
                                    setFilterConditions(newConditions);
                                  }}
                                >
                                  <option value="AND">AND</option>
                                  <option value="OR">OR</option>
                                </select>
                              )}
                            </div>
                            
                            <select aria-label="Select box"
                              className="flex-1 basis-0 w-full min-w-0 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                              value={condition.field}
                              onChange={(e) => {
                                const newConditions = [...filterConditions];
                                newConditions[index].field = e.target.value;
                                setFilterConditions(newConditions);
                              }}
                            >
                              <option value="">Chọn trường dữ liệu</option>
                              <option value="name">Họ tên</option>
                              <option value="birthDate">Ngày sinh</option>
                              <option value="personalId">Số định danh</option>
                              <option value="gender">Giới tính</option>
                            </select>

                            <select aria-label="Select box"
                              className="flex-1 basis-0 w-full min-w-0 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                              value={condition.operator}
                              onChange={(e) => {
                                const newConditions = [...filterConditions];
                                newConditions[index].operator = e.target.value;
                                setFilterConditions(newConditions);
                              }}
                            >
                              <option value="=">Bằng (=)</option>
                              <option value="contains">Chứa</option>
                              <option value="starts">Bắt đầu</option>
                            </select>

                            <div className="flex-1 basis-0 w-full min-w-0 flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white shadow-sm">
                              <input aria-label="Input field"
                                type="text"
                                className="flex-1 bg-transparent border-0 p-0 text-sm focus:outline-none"
                                placeholder="Nhập giá trị..."
                                value={condition.value}
                                onChange={(e) => {
                                  const newConditions = [...filterConditions];
                                  newConditions[index].value = e.target.value;
                                  setFilterConditions(newConditions);
                                }}
                              />
                            </div>

                            <button 
                              type="button"
                              onClick={() => setFilterConditions(filterConditions.filter(c => c.id !== condition.id))}
                              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3 relative z-10">
                        <button 
                          type="button"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center gap-2 shadow-md transition-all active:scale-95"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Áp dụng bộ lọc
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFilterConditions([])} 
                          className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all"
                        >
                          Xóa tất cả
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto bg-white">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">STT</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Họ tên</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Giới tính</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Ngày sinh</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Số đăng ký</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Ngày đăng ký</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Trạng thái</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {records.map((record, index) => (
                        <tr key={record.id} className="hover:bg-blue-50/30 transition-all group">
                          <td className="px-4 py-4 text-center text-sm text-slate-500 font-medium">{((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, '0')}</td>
                          <td className="px-4 py-4 text-center text-sm font-semibold text-slate-900">{record.name}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium">{record.gender}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium font-mono">{record.birthDate}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium font-mono">{record.registrationNumber || '-'}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium font-mono">{record.registrationDate}</td>
                          <td className="px-4 py-4 text-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100 shadow-sm whitespace-nowrap">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Đã phê duyệt
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination UI - According to rule 5.14 */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Hiển thị</span>
                    <div className="relative group">
                      <select aria-label="Records per page"
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm appearance-none pr-8 cursor-pointer font-medium text-slate-700"
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500 font-medium">bản ghi / trang</span>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-slate-500 font-medium">
                      {totalRecords > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalRecords)} / {totalRecords}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 text-slate-700"
                      >
                        Trước
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum = i + 1;
                          if (totalPages > 5 && currentPage > 3) {
                            pageNum = currentPage - 3 + i + 1;
                            if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-9 h-9 rounded-lg text-sm font-bold transition-all active:scale-90 ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-4 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 text-slate-700"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
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
