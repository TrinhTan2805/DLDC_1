import { X, Search, Filter, Download, FileDown, XCircle, CheckCircle, AlertCircle, Eye, RefreshCw, Calendar, ArrowUp, Plus, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { MarriageSearchFilter } from './marriage-cert/MarriageSearchFilter';
import { MarriageTable } from './marriage-cert/MarriageTable';

interface MarriageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
  isInline?: boolean;
}

interface MarriageRecord {
  id: string;
  husbandName: string;
  husbandBirthDate: string;
  wifeName: string;
  wifeBirthDate: string;
  marriageDate: string;
  status: 'approved' | 'pending' | 'error';
  hasError?: boolean;
  errorMessage?: string;
  
  // Thông tin hồ sơ
  fileId?: string;
  recordCode?: string;
  registrationNumber?: string;
  bookNumber?: string;
  pageNumber?: string;
  
  // Thông tin bên chồng
  husbandEthnicity?: string;
  husbandNationality?: string;
  husbandResidence?: string;
  husbandIdIssueDate?: string;
  husbandIdIssuePlace?: string;
  husbandIdNumber?: string;
  husbandPersonalId?: string;
  husbandMarriageCount?: number;
  
  // Thông tin bên vợ
  wifeEthnicity?: string;
  wifeNationality?: string;
  wifeResidence?: string;
  wifeIdIssueDate?: string;
  wifeIdIssuePlace?: string;
  wifeIdNumber?: string;
  wifePersonalId?: string;
  wifeMarriageCount?: number;
  
  // Thông tin khác
  registrationPlace?: string;
  registrationDate?: string;
  registrationType?: string;
  foreignCertificateNumber?: string;
  foreignCertificateDate?: string;
  foreignAgencyName?: string;
  foreignCountry?: string;
  marriageStatus?: string;
  signerName?: string;
  signerPosition?: string;
  implementer?: string;
  notes?: string;
}

export function MarriageDetailModal({ 
  isOpen, 
  onClose, 
  title, 
  totalRecords,
  newRecords,
  updatedRecords,
  errorRecords,
  isInline = false
}: MarriageDetailModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<MarriageRecord | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([
    { id: '1', logic: 'AND', field: 'husbandName', operator: '=', type: 'Text', value: '' }
  ]);
  
  const [valueModal, setValueModal] = useState({
    isOpen: false,
    conditionId: '',
    type: 'Text',
    value: ''
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const saveValue = () => {
    setFilterConditions(prev => prev.map(c => 
      c.id === valueModal.conditionId 
        ? { ...c, value: valueModal.value, type: valueModal.type } 
        : c
    ));
    setValueModal({ ...valueModal, isOpen: false });
  };
  
  if (!isOpen && !isInline) return null;

  // Mock data
  const records: MarriageRecord[] = [
    {
      id: '1',
      husbandName: 'Nguyễn Văn Anh',
      husbandBirthDate: '15/03/1990',
      wifeName: 'Trần Thị Bích',
      wifeBirthDate: '20/05/1992',
      marriageDate: '10/10/2020',
      status: 'approved',
      recordCode: 'KH-2020-001234',
      registrationNumber: '001234/2020',
      bookNumber: '12',
      pageNumber: '45',
      husbandEthnicity: 'Kinh',
      husbandNationality: 'Việt Nam',
      husbandResidence: '123 Láng Hạ, Đống Đa, Hà Nội',
      husbandIdIssueDate: '01/01/2015',
      husbandIdIssuePlace: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
      husbandIdNumber: '001090001234',
      husbandPersonalId: '001090001234',
      husbandMarriageCount: 1,
      wifeEthnicity: 'Kinh',
      wifeNationality: 'Việt Nam',
      wifeResidence: '456 Giải Phóng, Hai Bà Trưng, Hà Nội',
      wifeIdIssueDate: '15/02/2015',
      wifeIdIssuePlace: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
      wifeIdNumber: '001092005678',
      wifePersonalId: '001092005678',
      wifeMarriageCount: 1,
      registrationPlace: 'UBND Phường Láng Hạ, Quận Đống Đa, Hà Nội',
      registrationDate: '10/10/2020',
      registrationType: 'Đăng ký kết hôn lần đầu',
      marriageStatus: 'Đang hôn nhân',
      signerName: 'Nguyễn Văn A',
      signerPosition: 'Chủ tịch UBND Phường',
      implementer: 'Trần Thị B',
      notes: ''
    },
    {
      id: '2',
      husbandName: 'Lê Hoàng Nam',
      husbandBirthDate: '08/07/1988',
      wifeName: 'Phạm Thị Lan',
      wifeBirthDate: '12/11/1990',
      marriageDate: '20/12/2019',
      status: 'approved',
      recordCode: 'KH-2019-005678',
      registrationNumber: '005678/2019',
      bookNumber: '10',
      pageNumber: '89',
      husbandEthnicity: 'Kinh',
      husbandNationality: 'Việt Nam',
      husbandResidence: '789 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      husbandIdIssueDate: '20/05/2014',
      husbandIdIssuePlace: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
      husbandIdNumber: '001088009876',
      husbandPersonalId: '001088009876',
      husbandMarriageCount: 1,
      wifeEthnicity: 'Kinh',
      wifeNationality: 'Việt Nam',
      wifeResidence: '321 Khương Thượng, Đống Đa, Hà Nội',
      wifeIdIssueDate: '10/08/2014',
      wifeIdIssuePlace: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
      wifeIdNumber: '001090003456',
      wifePersonalId: '001090003456',
      wifeMarriageCount: 1,
      registrationPlace: 'UBND Phường Khương Thượng, Quận Đống Đa, Hà Nội',
      registrationDate: '20/12/2019',
      registrationType: 'Đăng ký kết hôn lần đầu',
      marriageStatus: 'Đang hôn nhân',
      signerName: 'Lê Văn C',
      signerPosition: 'Chủ tịch UBND Phường',
      implementer: 'Nguyễn Thị D',
      notes: ''
    }
  ];

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  return (
    <div className="marriage-detail-modal">
      {/* Value Entry Modal */}
      {valueModal.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden relative">
            {/* Header */}
            <div className="px-6 py-4 bg-[#007bff] text-white flex items-center justify-between">
              <h3 className="text-lg font-bold">Nhập giá trị lọc</h3>
              <button 
                onClick={() => setValueModal({ ...valueModal, isOpen: false })} 
                className="text-white hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kiểu dữ liệu</label>
                <select 
                  aria-label="Select type"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  value={valueModal.type}
                  onChange={(e) => setValueModal({ ...valueModal, type: e.target.value })}
                >
                  <option value="Text">Text</option>
                  <option value="Number">Number</option>
                  <option value="Date">Date</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Giá trị</label>
                <input aria-label="Value"
                  type={valueModal.type === 'Date' ? 'date' : valueModal.type === 'Number' ? 'number' : 'text'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  value={valueModal.value}
                  onChange={(e) => setValueModal({ ...valueModal, value: e.target.value })}
                  placeholder="Nhập giá trị..."
                  autoFocus
                />
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={saveValue}
                className="px-6 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 transition-colors"
              >
                Lưu
              </button>
              <button 
                onClick={() => setValueModal({ ...valueModal, isOpen: false })}
                className="px-6 py-2 bg-slate-500 text-white rounded font-medium text-sm hover:bg-slate-600 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop - Only if not inline */}
      {!isInline && <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>}
      
      {/* Container */}
      <div className={isInline ? "w-full flex flex-col" : "fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"}>
        {isInline && (
          <div className="flex flex-col mb-4">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500 mt-1">
              Tích hợp: Hồ sơ đăng ký kết hôn.
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
                  Tích hợp: Hồ sơ đăng ký kết hôn.
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
                <MarriageSearchFilter
                  isFilterOpen={isFilterOpen}
                  setIsFilterOpen={setIsFilterOpen}
                  filterConditions={filterConditions}
                  setFilterConditions={setFilterConditions}
                  onExport={() => alert('Đang kết xuất...')}
                  onRefresh={() => {}}
                  isInline={isInline}
                />

                <div className={isInline ? "bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                  <MarriageTable
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
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
                      <div className="space-y-1 col-span-full">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Tệp đính kèm</div>
                        <div className="text-sm text-blue-600 font-medium hover:underline cursor-pointer flex items-center gap-1.5">
                          <FileDown className="w-4 h-4" />
                          {selectedRecord.fileId || 'Không có tệp đính kèm'}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section: Thông tin bên chồng */}
                  <section>
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                      Thông tin bên chồng
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Họ, chữ đệm, tên chồng</div>
                        <div className="text-sm text-slate-900 font-bold">{selectedRecord.husbandName || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày, tháng, năm sinh</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.husbandBirthDate || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Số định danh cá nhân</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.husbandPersonalId || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Dân tộc</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.husbandEthnicity || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Quốc tịch</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.husbandNationality || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Số lần kết hôn</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.husbandMarriageCount || '0'}</div>
                      </div>
                      <div className="space-y-1 col-span-full">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Nơi cư trú</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.husbandResidence || '-'}</div>
                      </div>
                    </div>
                  </section>

                  {/* Section: Thông tin bên vợ */}
                  <section>
                    <h4 className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 bg-pink-600 rounded-full"></div>
                      Thông tin bên vợ
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Họ, chữ đệm, tên vợ</div>
                        <div className="text-sm text-slate-900 font-bold">{selectedRecord.wifeName || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày, tháng, năm sinh</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.wifeBirthDate || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Số định danh cá nhân</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.wifePersonalId || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Dân tộc</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.wifeEthnicity || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Quốc tịch</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.wifeNationality || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Số lần kết hôn</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.wifeMarriageCount || '0'}</div>
                      </div>
                      <div className="space-y-1 col-span-full">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Nơi cư trú</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.wifeResidence || '-'}</div>
                      </div>
                    </div>
                  </section>

                  {/* Section: Thông tin đăng ký */}
                  <section>
                    <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>
                      Thông tin đăng ký
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày đăng ký</div>
                        <div className="text-sm text-slate-900 font-bold font-mono">{selectedRecord.registrationDate || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày kết hôn</div>
                        <div className="text-sm text-slate-900 font-bold font-mono">{selectedRecord.marriageDate || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Loại đăng ký</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationType || '-'}</div>
                      </div>
                      <div className="space-y-1 col-span-full">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Nơi đăng ký</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.registrationPlace || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Người ký</div>
                        <div className="text-sm text-slate-900 font-bold">{selectedRecord.signerName || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Chức vụ</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.signerPosition || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Cán bộ thực hiện</div>
                        <div className="text-sm text-slate-900 font-medium">{selectedRecord.implementer || '-'}</div>
                      </div>
                    </div>
                  </section>
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
    </div>
  );
}
