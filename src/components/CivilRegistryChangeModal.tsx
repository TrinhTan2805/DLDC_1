import { X, Search, Filter, Download, XCircle, CheckCircle, AlertCircle, Eye, FileText, RefreshCw, Calendar } from 'lucide-react';
import { useState } from 'react';
import { CivilRegistryChangeSearchFilter } from './civil-registry-change/CivilRegistryChangeSearchFilter';
import { CivilRegistryChangeTable } from './civil-registry-change/CivilRegistryChangeTable';

export interface CivilRegistryChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
  isInline?: boolean;
}

export interface CivilRegistryChangeRecord {
  id: string;
  status: 'approved' | 'pending' | 'error';
  
  // List fields (as per Image 1)
  recordCode: string; // Mã hồ sơ
  changedPersonName: string; // Họ và tên người được thay đổi
  personalId: string; // Số định danh cá nhân
  registrantName: string; // Họ và tên người đi đăng ký
  relationship: string; // Quan hệ
  civilDocNumber: string; // Số giấy tờ hộ tịch
  syncDate: string; // Ngày đồng bộ
  hasPdf: boolean; // Văn bản

  // Tab 1: Người được thay đổi TT hộ tịch (Image 2)
  targetGender?: string;
  targetBirthDate?: string;
  targetHometown?: string;
  targetBirthPlace?: string;
  targetEthnicity?: string;
  targetNationality?: string;
  targetIdIssueDate?: string;
  targetIdIssuePlace?: string;
  targetIdNumber?: string;
  targetResidence?: string;
  targetReason?: string; // Lý do đề nghị

  // Tab 2: Người đi đăng ký (Image 3)
  registrantIdIssueDate?: string;
  registrantIdIssuePlace?: string;
  registrantIdNumber?: string;
  registrantPersonalId?: string;

  // Tab 3: Thông tin đăng ký & nội dung thay đổi (Image 3 continued)
  registrationPlace?: string;
  registrationDate?: string;
  registrationType?: string;
  civilDocIssueDate?: string;
  civilDocIssuePlace?: string;
  signerName?: string;
  signerPosition?: string;
  implementerName?: string;
  proposedContent?: string; // Nội dung đề nghị thay đổi...
  proposedReason?: string; // Lý do đề nghị thay đổi...
  notes?: string; // Ghi chú
}

export function CivilRegistryChangeModal({ 
  isOpen, 
  onClose, 
  title, 
  totalRecords,
  newRecords,
  updatedRecords,
  errorRecords,
  isInline = false
}: CivilRegistryChangeModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<CivilRegistryChangeRecord | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  if (!isOpen && !isInline) return null;

  // Mock data
  const records: CivilRegistryChangeRecord[] = [
    {
      id: '1',
      status: 'approved',
      recordCode: 'HT-2024-001234',
      changedPersonName: 'Nguyễn Thị Thu Hà',
      personalId: '001195006789',
      registrantName: 'Nguyễn Văn Hùng',
      relationship: 'Bố đẻ',
      civilDocNumber: '123/2024/GKS',
      syncDate: '10/05/2024 09:30:15',
      hasPdf: true,
      
      targetGender: 'Nữ',
      targetBirthDate: '15/05/2010',
      targetHometown: 'Hà Nội',
      targetBirthPlace: 'Hà Nội',
      targetEthnicity: 'Kinh',
      targetNationality: 'Việt Nam',
      targetResidence: 'Số 12, Duy Tân, Cầu Giấy, Hà Nội',
      targetReason: 'Thay đổi họ tên đệm cho con',

      registrationPlace: 'UBND Phường Dịch Vọng Hậu',
      registrationDate: '10/05/2024',
      registrationType: 'Thay đổi hộ tịch',
      civilDocIssueDate: '15/05/2010',
      civilDocIssuePlace: 'UBND Phường Khương Mai',
      signerName: 'Lê Văn Chính',
      signerPosition: 'Chủ tịch UBND',
      implementerName: 'Nguyễn Tư Pháp',
      proposedContent: 'Thay đổi họ tên từ Nguyễn Thị Hà thành Nguyễn Thị Thu Hà',
      proposedReason: 'Do mong muốn cá nhân và đã được sự đồng ý của gia đình',
      notes: ''
    }
  ];

  const handlePdfView = () => {
    alert('Chức năng xem file chi tiết sẽ được bổ sung sau.');
  };

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

          {/* Content Area */}
          <div className={`flex-1 overflow-hidden flex flex-col ${isInline ? '' : 'bg-white rounded-b-lg'}`}>
            {activeTab === 'list' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <CivilRegistryChangeSearchFilter
                  isFilterOpen={isFilterOpen}
                  setIsFilterOpen={setIsFilterOpen}
                  filterConditions={filterConditions}
                  setFilterConditions={setFilterConditions}
                  onExport={() => alert('Đang kết xuất...')}
                  onRefresh={() => {}}
                  isInline={isInline}
                />

                <div className={isInline ? "bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
                  <CivilRegistryChangeTable
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
                <h3 className="text-lg font-semibold text-slate-900">
                  Chi tiết bản ghi
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
                    <div className="text-xs text-slate-600 mb-1">Số giấy tờ hộ tịch</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.civilDocNumber || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.personalId || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên người được thay đổi</div>
                    <div className="text-sm text-slate-900 font-medium text-blue-700">{selectedRecord.changedPersonName || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                    <div className="text-sm text-slate-900">{selectedRecord.targetBirthDate || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Giới tính</div>
                    <div className="text-sm text-slate-900">{selectedRecord.targetGender || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Dân tộc</div>
                    <div className="text-sm text-slate-900">{selectedRecord.targetEthnicity || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Quốc tịch</div>
                    <div className="text-sm text-slate-900">{selectedRecord.targetNationality || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Số giấy tờ tùy thân</div>
                    <div className="text-sm text-slate-900">{selectedRecord.targetIdNumber || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Nơi cư trú</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.targetResidence || '-'}</div>
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
                    <div className="text-xs text-slate-600 mb-1">Chức vụ người ký</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.signerPosition || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-3 rounded">
                    <div className="text-xs text-slate-600 mb-1">Nội dung đề nghị thay đổi, cải chính, bổ sung thông tin hộ tịch, xác định lại dân tộc</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.proposedContent || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-3 rounded">
                    <div className="text-xs text-slate-600 mb-1">Lý do đề nghị thay đổi, cải chính, bổ sung thông tin hộ tịch, xác định lại dân tộc</div>
                    <div className="text-sm text-slate-900 font-medium italic">{selectedRecord.proposedReason || '-'}</div>
                  </div>
                  <div className="border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-600 mb-1">Ngày đồng bộ</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedRecord.syncDate || '-'}</div>
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
