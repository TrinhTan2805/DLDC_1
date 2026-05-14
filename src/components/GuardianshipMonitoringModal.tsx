import { X, Search, Filter, Download, XCircle, CheckCircle, AlertCircle, Eye, FileText, Building2, User, RefreshCw, Calendar, ArrowUp } from 'lucide-react';
import { useState } from 'react';

export interface GuardianshipMonitoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
  isInline?: boolean;
}

export interface GuardianshipMonitoringRecord {
  id: string;
  status: 'approved' | 'pending' | 'error';
  
  // List fields (as per Image 1)
  recordCode: string; // Mã hồ sơ
  monitorName: string; // Họ và tên người giám sát
  legalEntityMonitorName: string; // Tên pháp nhân giám sát
  guardianshipRegNumber: string; // Số đăng ký giám hộ
  registrantName: string; // Họ và tên người đăng ký giám sát
  syncDate: string; // Ngày đồng bộ
  hasPdf: boolean; // Văn bản

  // Tab 1: Hồ sơ & Người giám sát (Image 2)
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
export function GuardianshipMonitoringModal({ 
  isOpen, 
  onClose, 
  title, 
  totalRecords,
  newRecords,
  updatedRecords,
  errorRecords,
  isInline = false
}: GuardianshipMonitoringModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<GuardianshipMonitoringRecord | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  if (!isOpen && !isInline) return null;

  // Mock data
  const records: GuardianshipMonitoringRecord[] = [
    {
      id: '1',
      status: 'approved',
      recordCode: 'GSGH-2024-112233',
      monitorName: 'Ông Nguyễn Văn A',
      legalEntityMonitorName: 'Cơ sở bảo trợ xã hội Hy Vọng',
      guardianshipRegNumber: '123/2023/GH',
      registrantName: 'Bà Lê Thị B',
      syncDate: '19/04/2024 10:20:00',
      hasPdf: true,
      
      regNumber: '45/2024/GSGH',
      bookNumber: '02/2024',
      pageNumber: '15',
      
      monitorBirthDate: '10/10/1980',
      monitorGender: 'Nam',
      monitorEthnicity: 'Kinh',
      monitorNationality: 'Việt Nam',
      monitorIdCard: '001080001234',
      monitorResidence: 'Số 1 Phố Huế, Hoàn Kiếm, Hà Nội',

      legalEntityFoundingDate: '15/05/2010',
      legalEntityLicense: 'GP-2010-001',
      legalEntityAddress: 'Số 102 Đường Giải Phóng, Hà Nội',
      legalEntityRepName: 'Trần Văn Cường',
      legalEntityRepPosition: 'Giám đốc',
      legalEntityRepIdCard: '001085002233',

      monitoredExtractNumber: '123/2023/GH',
      monitoredRegDate: '01/06/2023',
      monitoredRegPlace: 'UBND Phường Hàng Bài, Hoàn Kiếm',

      registrantIdCard: '001190005566',

      signerFullInfo: 'Nguyễn Văn Chính - Phó Chủ tịch UBND',
      implementerName: 'Lê Tư Pháp',
      notes: 'Giám sát định kỳ hàng quý',
      finalRegDate: '19/04/2024',
      finalRegPlace: 'UBND Phường Hàng Bài'
    }
  ];

  const handlePdfView = () => {
    alert('Chức năng xem file văn bản sẽ được bổ sung sau.');
  };

  return (
    <>
      {/* Backdrop */}
      {!isInline && <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />}
      
      {/* Container */}
      <div className={isInline ? "w-full" : "fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"}>
        <div className={`bg-white ${isInline ? "border border-slate-200 rounded-xl overflow-hidden" : "rounded-lg shadow-xl max-w-[95vw] w-full max-h-[90vh] pointer-events-auto"} flex flex-col`}>
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

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === 'list' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search & Actions */}
                <div className="px-6 py-4 border-b border-slate-200 flex-shrink-0 bg-white">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 flex items-center gap-3">
                      <div className="relative flex-1">
                        <input aria-label="Input field"
                          type="text"
                          placeholder="Tìm kiếm theo họ tên người giám sát, mã hồ sơ..."
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 shadow-sm transition-all"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                          className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all shadow-sm border ${
                            showAdvancedSearch ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
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

                  {/* Advanced Search Panel */}
                  {showAdvancedSearch && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4 shadow-sm animate-in slide-in-from-top-2 duration-200 relative">
                      <div className="absolute -top-2 left-64 w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Điều kiện lọc nâng cao</h4>
                      </div>

                      <div className="grid grid-cols-4 gap-4 relative z-10">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Người giám sát</label>
                          <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" placeholder="Nhập họ tên..." />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Mã hồ sơ</label>
                          <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" placeholder="Mã hồ sơ..." />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Từ ngày</label>
                          <div className="relative">
                            <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm appearance-none" />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Đến ngày</label>
                          <div className="relative">
                            <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm appearance-none" />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3 relative z-10">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center gap-2 shadow-md transition-all active:scale-95">
                          <CheckCircle className="w-4 h-4" />
                          Áp dụng bộ lọc
                        </button>
                        <button onClick={() => setShowAdvancedSearch(false)} className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all">
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
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Mã hồ sơ</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Họ tên người giám sát</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Pháp nhân giám sát</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Số ĐK giám hộ</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Người đăng ký</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Trạng thái</th>
                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {records.map((record, index) => (
                        <tr key={record.id} className="hover:bg-blue-50/30 transition-all group">
                          <td className="px-4 py-4 text-center text-sm text-slate-500 font-medium">{(index + 1).toString().padStart(2, '0')}</td>
                          <td className="px-4 py-4 text-center text-sm font-semibold text-slate-900 font-mono">{record.recordCode}</td>
                          <td className="px-4 py-4 text-center text-sm font-semibold text-blue-700">{record.monitorName}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium">{record.legalEntityMonitorName || '-'}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium font-mono">{record.guardianshipRegNumber}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium">{record.registrantName}</td>
                          <td className="px-4 py-4 text-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100 shadow-sm whitespace-nowrap">
                              <CheckCircle className="w-3.5 h-3.5" /> Đã duyệt
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4.5 h-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <div className="text-sm text-slate-600 font-medium">
                    Hiển thị <span className="text-slate-900 font-bold">1-{records.length}</span> trong tổng số <span className="text-slate-900 font-bold">{totalRecords}</span> bản ghi
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white text-sm font-bold transition-colors">Trước</button>
                    <button className="w-9 h-9 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md">1</button>
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white text-sm font-bold transition-colors">Sau</button>
                  </div>
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
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên người đăng ký</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrantName || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Giấy tờ tùy thân người đăng ký</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrantIdCard || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên người giám sát</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.monitorName || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh người giám sát</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.monitorBirthDate || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Giới tính người giám sát</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.monitorGender || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Dân tộc người giám sát</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.monitorEthnicity || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Quốc tịch người giám sát</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.monitorNationality || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân/Giấy tờ tùy thân người giám sát</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.monitorIdCard || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Nơi cư trú người giám sát</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.monitorResidence || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Tên pháp nhân</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.legalEntityMonitorName || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ngày thành lập pháp nhân</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.legalEntityFoundingDate || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Giấy phép thành lập/Mã số thuế</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.legalEntityLicense || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Trụ sở pháp nhân</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.legalEntityAddress || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên người đại diện pháp nhân</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.legalEntityRepName || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Chức vụ người đại diện</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.legalEntityRepPosition || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Trích lục đăng ký giám hộ số</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.monitoredExtractNumber || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ngày đăng ký việc giám hộ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.monitoredRegDate || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Đăng ký tại</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.monitoredRegPlace || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Người ký (Họ tên, chức vụ)</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.signerFullInfo || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Người thực hiện</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.implementerName || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ngày đăng ký</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.finalRegDate || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Nơi đăng ký</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.finalRegPlace || '-'}</div>
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
