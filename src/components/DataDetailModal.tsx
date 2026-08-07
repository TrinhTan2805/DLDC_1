import { X, Search, ChevronLeft, ChevronRight, Upload, FileDown, RefreshCw, Filter, Eye, Calendar, CheckCircle, XCircle, FileText, Database, Info, Plus, Trash2, Edit2, ListFilter, ArrowUpDown, ChevronDown, Group } from 'lucide-react';
import { useState } from 'react';

interface DataDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
  isInline?: boolean;
  description?: string;
  hideStatusColumn?: boolean;
}

interface DetailRecord {
  id: string;
  code: string;
  name: string;
  gender: string;
  idNumber: string;
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
  status: string;
  approvalStatus: string;
  collectedAt: string;
  hasError?: boolean;
  errorMessage?: string;
  phone?: string;
  address?: string;
  fatherName?: string;
  fatherBirthDate?: string;
  fatherEthnicity?: string;
  fatherNationality?: string;
  fatherAddress?: string;
  fatherIdIssueDate?: string;
  fatherIdIssuePlace?: string;
  fatherIdNumber?: string;
  fatherPersonalId?: string;
  motherName?: string;
  motherBirthDate?: string;
  motherEthnicity?: string;
  motherNationality?: string;
  motherAddress?: string;
  motherIdIssueDate?: string;
  motherIdIssuePlace?: string;
  motherIdNumber?: string;
  motherPersonalId?: string;
  registrationPlace?: string;
  registrationType?: string;
  foreignCertificateNo?: string;
  foreignCertificateDate?: string;
  foreignOrganization?: string;
  foreignCountry?: string;
  declarantName?: string;
  declarantRelation?: string;
  declarantIdIssuePlace?: string;
  declarantIdIssueDate?: string;
  declarantIdNumber?: string;
  declarantPersonalId?: string;
  signDate?: string;
  signerPosition?: string;
  implementer?: string;
  notes?: string;
  errorProcessStatus?: 'sent' | 'updated' | 'pending';
  errorProcessText?: string;
  pdfUrl?: string;
}

export function DataDetailModal({ 
  isOpen, 
  onClose, 
  title, 
  totalRecords,
  newRecords,
  updatedRecords,
  errorRecords,
  isInline = false,
  description,
  hideStatusColumn = false
}: DataDetailModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<DetailRecord | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Filter System States
  const [filterConditions, setFilterConditions] = useState<any[]>([
    { id: '1', logic: 'AND', field: 'age', operator: '=', type: 'Number', value: '19' }
  ]);
  
  const [valueModal, setValueModal] = useState({
    isOpen: false,
    conditionId: '',
    type: 'Text',
    value: ''
  });

  const openValueModal = (condition: any) => {
    setValueModal({
      isOpen: true,
      conditionId: condition.id,
      type: condition.type || 'Text',
      value: condition.value || ''
    });
  };

  const saveValue = () => {
    setFilterConditions(prev => prev.map(c => 
      c.id === valueModal.conditionId 
        ? { ...c, value: valueModal.value, type: valueModal.type } 
        : c
    ));
    setValueModal({ ...valueModal, isOpen: false });
  };
  const [searchText, setSearchText] = useState('');
  const [errorStatusFilter, setErrorStatusFilter] = useState('all');
  const [viewingPdfUrl, setViewingPdfUrl] = useState<string | null>(null);
  const [showSyncErrorModal, setShowSyncErrorModal] = useState(false);
  const [selectedSyncRecord, setSelectedSyncRecord] = useState<any>(null);
  
  if (!isOpen && !isInline) return null;

  // Mock data for the table
  const detailRecords: DetailRecord[] = [
    { 
      id: '1', 
      code: 'REC-2025-001', 
      name: 'Nguyễn Văn An', 
      gender: 'Nam',
      idNumber: '001234567890', 
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
      status: 'Hợp lệ',
      approvalStatus: 'Đã đồng bộ',
      collectedAt: '19/12/2025 15:30:00',
      pdfUrl: '/phieu_y_kien.pdf',
      fatherName: 'Nguyễn Văn Bình',
      fatherBirthDate: '01/01/1950',
      fatherEthnicity: 'Kinh',
      fatherNationality: 'Việt Nam',
      fatherAddress: 'Hà Nội',
      fatherIdIssueDate: '01/01/2000',
      fatherIdIssuePlace: 'Hà Nội',
      fatherIdNumber: '001234567890',
      fatherPersonalId: '001234567890',
      motherName: 'Trần Thị Cúc',
      motherBirthDate: '01/01/1950',
      motherEthnicity: 'Kinh',
      motherNationality: 'Việt Nam',
      motherAddress: 'Hà Nội',
      motherIdIssueDate: '01/01/2000',
      motherIdIssuePlace: 'Hà Nội',
      motherIdNumber: '001234567890',
      motherPersonalId: '001234567890'
    },
    { 
      id: '2', 
      code: 'REC-2025-002', 
      name: 'Trần Thị Bình', 
      gender: 'Nữ',
      idNumber: '001234567891', 
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
      status: 'Hợp lệ',
      approvalStatus: 'Đã đồng bộ',
      collectedAt: '19/12/2025 15:30:02',
      fatherName: 'Trần Văn Dũng',
      fatherBirthDate: '01/01/1950',
      fatherEthnicity: 'Kinh',
      fatherNationality: 'Việt Nam',
      fatherAddress: 'Hà Nội',
      fatherIdIssueDate: '01/01/2000',
      fatherIdIssuePlace: 'Hà Nội',
      fatherIdNumber: '001234567890',
      fatherPersonalId: '001234567890',
      motherName: 'Lê Thị Em',
      motherBirthDate: '01/01/1950',
      motherEthnicity: 'Kinh',
      motherNationality: 'Việt Nam',
      motherAddress: 'Hà Nội',
      motherIdIssueDate: '01/01/2000',
      motherIdIssuePlace: 'Hà Nội',
      motherIdNumber: '001234567890',
      motherPersonalId: '001234567890'
    },
    { 
      id: '3', 
      code: 'REC-2025-003', 
      name: 'Lê Văn Cường', 
      gender: 'Nam',
      idNumber: '001234567892', 
      birthDate: '31/13/2023', 
      birthDateInWords: 'Ngày 31 tháng 13 năm 2023',
      birthPlace: 'Hà Nội',
      hometown: 'Hà Nội',
      ethnicity: 'Kinh',
      nationality: 'Việt Nam',
      personalId: '001234567892',
      certificateNo: '001234567892',
      registrationDate: '31/13/2023',
      syncDate: '19/12/2025 15:30:05',
      type: 'Mới', 
      status: 'Lỗi định dạng',
      approvalStatus: 'Đã gửi lại hệ thống nguồn',
      collectedAt: '19/12/2025 15:30:05',
      hasError: true,
      errorMessage: 'Sai định dạng ngày tháng',
      pdfUrl: '/phieu_y_kien.pdf',
      fatherName: 'Lê Văn Hùng',
      fatherBirthDate: '01/01/1950',
      fatherEthnicity: 'Kinh',
      fatherNationality: 'Việt Nam',
      fatherAddress: 'Hà Nội',
      fatherIdIssueDate: '01/01/2000',
      fatherIdIssuePlace: 'Hà Nội',
      fatherIdNumber: '001234567890',
      fatherPersonalId: '001234567890',
      motherName: 'Phạm Thị Lan',
      motherBirthDate: '01/01/1950',
      motherEthnicity: 'Kinh',
      motherNationality: 'Việt Nam',
      motherAddress: 'Hà Nội',
      motherIdIssueDate: '01/01/2000',
      motherIdIssuePlace: 'Hà Nội',
      motherIdNumber: '001234567890',
      motherPersonalId: '001234567890',
      errorProcessStatus: 'sent',
      errorProcessText: 'Đã gửi hệ thống nguồn'
    },
    { 
      id: '4', 
      code: 'REC-2025-004', 
      name: 'Phạm Thị Dung', 
      gender: 'Nữ',
      idNumber: '001234567893', 
      birthDate: '10/03/1988', 
      birthDateInWords: 'Ngày 10 tháng 3 năm 1988',
      birthPlace: 'Hà Nội',
      hometown: 'Hà Nội',
      ethnicity: 'Kinh',
      nationality: 'Việt Nam',
      personalId: '001234567893',
      certificateNo: '001234567893',
      registrationDate: '10/03/1988',
      syncDate: '19/12/2025 15:30:07',
      type: 'Mới', 
      status: 'Lỗi định dạng',
      approvalStatus: 'Đã cập nhật lại',
      collectedAt: '19/12/2025 15:30:07',
      hasError: true,
      errorMessage: 'Sai định dạng điện thoại',
      fatherName: 'Phạm Văn Khoa',
      fatherBirthDate: '01/01/1950',
      fatherEthnicity: 'Kinh',
      fatherNationality: 'Việt Nam',
      fatherAddress: 'Hà Nội',
      fatherIdIssueDate: '01/01/2000',
      fatherIdIssuePlace: 'Hà Nội',
      fatherIdNumber: '001234567890',
      fatherPersonalId: '001234567890',
      motherName: 'Hoàng Thị Mai',
      motherBirthDate: '01/01/1950',
      motherEthnicity: 'Kinh',
      motherNationality: 'Việt Nam',
      motherAddress: 'Hà Nội',
      motherIdIssueDate: '01/01/2000',
      motherIdIssuePlace: 'Hà Nội',
      motherIdNumber: '001234567890',
      motherPersonalId: '001234567890',
      errorProcessStatus: 'updated',
      errorProcessText: 'Đã cập nhật lại'
    },
    { 
      id: '5', 
      code: 'REC-2025-005', 
      name: 'Hoàng Văn Em', 
      gender: 'Nam',
      idNumber: '001234567894', 
      birthDate: '25/11/1992', 
      birthDateInWords: 'Ngày 25 tháng 11 năm 1992',
      birthPlace: 'Hà Nội',
      hometown: 'Hà Nội',
      ethnicity: 'Kinh',
      nationality: 'Việt Nam',
      personalId: '001234567894',
      certificateNo: '001234567894',
      registrationDate: '25/11/1992',
      syncDate: '19/12/2025 15:30:10',
      type: 'Cập nhật', 
      status: 'Hợp lệ',
      approvalStatus: 'Đã đồng bộ',
      collectedAt: '19/12/2025 15:30:10',
      pdfUrl: '/phieu_y_kien.pdf',
      fatherName: 'Hoàng Văn Nam',
      fatherBirthDate: '01/01/1950',
      fatherEthnicity: 'Kinh',
      fatherNationality: 'Việt Nam',
      fatherAddress: 'Hà Nội',
      fatherIdIssueDate: '01/01/2000',
      fatherIdIssuePlace: 'Hà Nội',
      fatherIdNumber: '001234567890',
      fatherPersonalId: '001234567890',
      motherName: 'Vũ Thị Oanh',
      motherBirthDate: '01/01/1950',
      motherEthnicity: 'Kinh',
      motherNationality: 'Việt Nam',
      motherAddress: 'Hà Nội',
      motherIdIssueDate: '01/01/2000',
      motherIdIssuePlace: 'Hà Nội',
      motherIdNumber: '001234567890',
      motherPersonalId: '001234567890'
    },
    { 
      id: '6', 
      code: 'REC-2025-006', 
      name: 'Vũ Thị Hoa', 
      gender: 'Nữ',
      idNumber: '001234567895', 
      birthDate: '18/07/1995', 
      birthDateInWords: 'Ngày 18 tháng 7 năm 1995',
      birthPlace: 'Hà Nội',
      hometown: 'Hà Nội',
      ethnicity: 'Kinh',
      nationality: 'Việt Nam',
      personalId: '001234567895',
      certificateNo: '001234567895',
      registrationDate: '18/07/1995',
      syncDate: '19/12/2025 15:30:12',
      type: 'Mới', 
      status: 'Hợp lệ',
      approvalStatus: 'Đã đồng bộ',
      collectedAt: '19/12/2025 15:30:12',
      fatherName: 'Vũ Văn Phong',
      fatherBirthDate: '01/01/1950',
      fatherEthnicity: 'Kinh',
      fatherNationality: 'Việt Nam',
      fatherAddress: 'Hà Nội',
      fatherIdIssueDate: '01/01/2000',
      fatherIdIssuePlace: 'Hà Nội',
      fatherIdNumber: '001234567890',
      fatherPersonalId: '001234567890',
      motherName: 'Đỗ Thị Quỳnh',
      motherBirthDate: '01/01/1950',
      motherEthnicity: 'Kinh',
      motherNationality: 'Việt Nam',
      motherAddress: 'Hà Nội',
      motherIdIssueDate: '01/01/2000',
      motherIdIssuePlace: 'Hà Nội',
      motherIdNumber: '001234567890',
      motherPersonalId: '001234567890'
    },
    { 
      id: '7', 
      code: 'REC-2025-007', 
      name: 'Đỗ Văn Kiên', 
      gender: 'Nam',
      idNumber: 'abc12345', 
      birthDate: '05/02/1987', 
      birthDateInWords: 'Ngày 05 tháng 2 năm 1987',
      birthPlace: 'Hà Nội',
      hometown: 'Hà Nội',
      ethnicity: 'Kinh',
      nationality: 'Việt Nam',
      personalId: 'abc12345',
      certificateNo: 'abc12345',
      registrationDate: '05/02/1987',
      syncDate: '19/12/2025 15:30:15',
      type: 'Mới', 
      status: 'Lỗi định dạng',
      approvalStatus: 'Đã cập nhật lại',
      collectedAt: '19/12/2025 15:30:15',
      hasError: true,
      errorMessage: 'Sai định dạng',
      fatherName: 'Đỗ Văn Sơn',
      fatherBirthDate: '01/01/1950',
      fatherEthnicity: 'Kinh',
      fatherNationality: 'Việt Nam',
      fatherAddress: 'Hà Nội',
      fatherIdIssueDate: '01/01/2000',
      fatherIdIssuePlace: 'Hà Nội',
      fatherIdNumber: '001234567890',
      fatherPersonalId: '001234567890',
      motherName: 'Nguyễn Thị Tâm',
      motherBirthDate: '01/01/1950',
      motherEthnicity: 'Kinh',
      motherNationality: 'Việt Nam',
      motherAddress: 'Hà Nội',
      motherIdIssueDate: '01/01/2000',
      motherIdIssuePlace: 'Hà Nội',
      motherIdNumber: '001234567890',
      motherPersonalId: '001234567890',
      errorProcessStatus: 'updated',
      errorProcessText: 'Đã cập nhật lại'
    },
  ];

  return (
    <>
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
                <input 
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

      {/* Backdrop */}
      {!isInline && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Container */}
      <div className={isInline ? "w-full" : "fixed inset-4 z-50 flex items-center justify-center"}>
        <div className={`bg-white ${isInline ? "border border-slate-200 rounded-xl overflow-hidden" : "rounded-lg shadow-xl w-full max-w-[90vw] max-h-[90vh]"} flex flex-col`}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              {description && <p className="text-sm text-slate-500 mt-1 whitespace-pre-line">{description}</p>}
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



          {/* Tab Content - LIST */}
          {activeTab === 'list' && (
            <>
              {/* Search and Filters */}
              <div className="px-6 py-4 flex-shrink-0 bg-white border-b border-slate-100">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 flex items-center gap-3">
                    <div className="relative flex-1">
                      <input aria-label="Input field"
                        type="text"
                        placeholder="Tìm kiếm theo họ tên, số định danh, số giấy chứng nhận..."
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 shadow-sm transition-all"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    
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
                      <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all shadow-sm border ${
                          isSortOpen ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <ArrowUpDown className="w-4 h-4" />
                        Sắp xếp
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all shadow-sm" title="Tải lại">
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    {!isInline && (
                      <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2 text-sm font-semibold shadow-sm">
                        <FileDown className="w-4 h-4" />
                        Kết xuất
                      </button>
                    )}
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
                        <button onClick={() => setFilterConditions([])} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                      {filterConditions.map((condition, index) => (
                        <div key={condition.id} className="flex items-center gap-3">
                          <div className="w-20 flex-shrink-0">
                            {index > 0 && (
                              <select 
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
                          
                          <select 
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
                            <option value="age">Tuổi</option>
                            <option value="gender">Giới tính</option>
                            <option value="idNumber">Số định danh</option>
                          </select>

                          <select 
                            className="flex-1 basis-0 w-full min-w-0 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                            value={condition.operator}
                            onChange={(e) => {
                              const newConditions = [...filterConditions];
                              newConditions[index].operator = e.target.value;
                              setFilterConditions(newConditions);
                            }}
                          >
                            <option value="=">Bằng (=)</option>
                            <option value="&gt;">Lớn hơn (&gt;)</option>
                            <option value="&lt;">Nhỏ hơn (&lt;)</option>
                            <option value="&gt;=">Lớn hơn bằng (&gt;=)</option>
                            <option value="&lt;=">Nhỏ hơn bằng (&lt;=)</option>
                            <option value="!=">Khác (!=)</option>
                            <option value="contains">Chứa</option>
                            <option value="starts">Bắt đầu</option>
                            <option value="ends">Kết thúc</option>
                          </select>

                          <div className="flex-1 basis-0 w-full min-w-0 flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white shadow-sm group/value">
                            <div className="flex-1 text-sm text-slate-900 truncate">
                              {condition.value || <span className="text-slate-400 italic">Nhập giá trị...</span>}
                            </div>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openValueModal(condition);
                              }}
                              className="p-1 hover:bg-blue-50 rounded text-blue-600 transition-colors"
                              title="Chỉnh sửa giá trị"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button 
                            type="button"
                            onClick={() => setFilterConditions(filterConditions.filter(c => c.id !== condition.id))}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="Xóa điều kiện"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3 relative z-10">
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center gap-2 shadow-md transition-all active:scale-95">
                          <CheckCircle className="w-4 h-4" />
                          Áp dụng bộ lọc
                        </button>
                        <button onClick={() => setFilterConditions([])} className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all">
                          Xóa tất cả
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="flex-1 overflow-auto bg-white">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-50 sticky top-0 z-20">
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">STT</th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Phân loại</th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Họ tên</th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Giới tính</th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày sinh</th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Họ tên Cha</th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Họ tên Mẹ</th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Quốc tịch</th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Số định danh</th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày đăng ký</th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày đồng bộ</th>
                      {!hideStatusColumn && (
                        <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                      )}
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {detailRecords
                      .filter(record => {
                        const matchesSearch = searchText === '' || 
                          record.name.toLowerCase().includes(searchText.toLowerCase()) ||
                          record.code.toLowerCase().includes(searchText.toLowerCase()) ||
                          record.idNumber.toLowerCase().includes(searchText.toLowerCase());
                        
                        const matchesErrorProcess = errorStatusFilter === 'all' || record.errorProcessStatus === errorStatusFilter;
                        
                        return matchesSearch && matchesErrorProcess;
                      })
                      .map((record, index) => (
                      <tr key={record.id} className="hover:bg-blue-50/30 transition-all group">
                        <td className="px-4 py-4 text-center text-sm text-slate-500 font-medium">{index + 1}</td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            record.type === 'Mới' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-purple-50 text-purple-700 border border-purple-100'
                          }`}>
                            {record.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center text-sm font-semibold text-slate-900">{record.name}</td>
                        <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium">{record.gender}</td>
                        <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium font-mono">{record.birthDate}</td>
                        <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium">{record.fatherName}</td>
                        <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium">{record.motherName}</td>
                        <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium">{record.nationality}</td>
                        <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium font-mono">{record.idNumber}</td>
                        <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium font-mono">{record.registrationDate}</td>
                        <td className="px-4 py-4 text-center text-sm text-slate-500 font-medium font-mono whitespace-nowrap">{record.syncDate}</td>
                        {!hideStatusColumn && (
                          <td className="px-4 py-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm whitespace-nowrap ${
                              record.approvalStatus === 'Đã đồng bộ'
                                ? 'bg-green-50 text-green-700 border-green-100'
                                : record.approvalStatus === 'Đã gửi lại hệ thống nguồn'
                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                              {record.approvalStatus}
                            </span>
                          </td>
                        )}
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
            </>
          )}




          {/* Footer with Pagination */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Hiển thị</span>
              <select 
                className="px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Số bản ghi trên trang"
              >
                <option>10</option>
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span className="text-sm text-slate-600">bản ghi/trang</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">Hiển thị 1-10 / 12 bản ghi</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600"
                    title="Trang trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-slate-600">Trang 1 / 2</span>
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600"
                    title="Trang sau"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="ml-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-sm"
                  title="Đóng modal"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      


      {/* Record Detail Popup */}
      {selectedRecord && (
        <>
          {/* Backdrop for record detail */}
          <div 
            className="fixed inset-0 bg-black/50"
            style={{ zIndex: 1060 }}
            onClick={() => setSelectedRecord(null)}
          />
          
          {/* Record Detail Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none" style={{ zIndex: 1070 }}>
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col pointer-events-auto">
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

              {/* Content with Vertical Sidebar */}
              <div className="flex-1 flex overflow-hidden bg-white">
                {/* Content Area */}
                <div className="flex-1 overflow-auto p-8">
                  {/* Flattened Record Details */}
                  <div className="flex flex-col gap-3">
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Họ, chữ đệm, tên</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.name}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Giới tính</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.gender}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.birthDate}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Ngày sinh bằng chữ</div>
                      <div className="text-xs text-slate-900 italic">{selectedRecord.birthDateInWords}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Nơi sinh</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.birthPlace}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Quê quán</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.hometown}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Dân tộc</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.ethnicity}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Quốc tịch</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.nationality}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Số định danh cá nhân</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.personalId}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Họ tên Cha</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.fatherName || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Ngày sinh Cha</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.fatherBirthDate || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Họ tên Mẹ</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.motherName || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Ngày sinh Mẹ</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.motherBirthDate || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Họ tên người đi khai sinh</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.declarantName || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Quan hệ</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.declarantRelation || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Ngày đăng ký</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.registrationDate || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-sm text-slate-600 mb-1">Ngày đồng bộ</div>
                      <div className="text-xs text-slate-900 font-medium">{selectedRecord.syncDate || '-'}</div>
                    </div>
                  </div>

                {/* Trạng thái lỗi - hiển thị ở tất cả các tab */}
                {selectedRecord.hasError && (
                  <div className="mt-6 border border-red-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="bg-red-50/80 border-b border-red-100 px-5 py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-red-800">
                        <div className="p-1 bg-red-100 rounded-md">
                           <XCircle className="w-4 h-4 text-red-600" />
                        </div>
                        <h4 className="font-semibold text-sm">Chi tiết lỗi dữ liệu</h4>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                        selectedRecord.errorProcessStatus === 'updated' 
                           ? 'bg-green-100 text-green-700' 
                           : 'bg-red-100 text-red-700'
                      }`}>
                        {selectedRecord.errorProcessStatus === 'updated' ? 'Đã khắc phục' : 'Cần xử lý'}
                      </span>
                    </div>
                    
                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Cột 1: Thông tin lỗi */}
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Mô tả lỗi</div>
                            <div className="text-xs font-medium text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
                               {selectedRecord.errorMessage || 'Lỗi không xác định'}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Trường dữ liệu phát hiện lỗi</div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedRecord.errorMessage?.includes('điện thoại') ? (
                                <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs font-mono font-medium flex items-center gap-1.5">
                                   <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                   phone_number
                                </span>
                              ) : selectedRecord.errorMessage?.includes('ngày tháng') ? (
                                <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs font-mono font-medium flex items-center gap-1.5">
                                   <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                   birthDate
                                </span>
                              ) : (
                                <>
                                  <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs font-mono font-medium flex items-center gap-1.5">
                                     <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                     unknown_field
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Cột 2: Lịch sử xử lý */}
                        <div className="space-y-4 border-l border-slate-100 pl-6">
                          <div>
                            <div className="text-sm font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Trạng thái xử lý</div>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                                selectedRecord.errorProcessStatus === 'sent' 
                                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                  : selectedRecord.errorProcessStatus === 'updated'
                                  ? 'bg-green-50 text-green-700 border border-green-100'
                                  : 'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {selectedRecord.errorProcessStatus === 'sent' && <Upload className="w-4 h-4" />}
                                {selectedRecord.errorProcessStatus === 'updated' && <CheckCircle className="w-4 h-4" />}
                                {!selectedRecord.errorProcessStatus && <RefreshCw className="w-4 h-4" />}
                                
                                {selectedRecord.errorProcessStatus === 'sent' ? 'Đã gửi hệ thống nguồn' 
                                  : selectedRecord.errorProcessStatus === 'updated' ? 'Đã cập nhật lại'
                                  : 'Chờ xử lý'}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Ghi chú bổ sung</div>
                            <div className="text-sm text-slate-600 italic">
                               {selectedRecord.errorProcessText || 'Chưa có thông tin xử lý từ bên thứ 3.'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hành động */}
                      <div className="flex items-center justify-end gap-3 pt-4 mt-5 border-t border-slate-100">
                        <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2">
                           Bỏ qua lỗi
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm">
                           <RefreshCw className="w-4 h-4" />
                           Đồng bộ lại
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer của màn hình chi tiết */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 flex-shrink-0 bg-white">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm"
                  title="Đóng chi tiết"
                >
                  <XCircle className="w-4 h-4" />
                  Đóng
                </button>
                
              </div>
            </div>
          </div>
        </>
      )}

      {/* Premium PDF Document Viewer - Phong cách Google Drive cực đẹp */}
      {viewingPdfUrl && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1100 }}>
          {/* Nền tối sâu sang trọng */}
          <div 
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm animate-in fade-in duration-500" 
            onClick={() => setViewingPdfUrl(null)} 
          />
          
          {/* Nút thao tác ở góc trên (Floating Top Controls) */}
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

          {/* Vùng hiển thị tài liệu */}
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 sm:p-14">
            <div className="w-full max-w-5xl h-full bg-white shadow-[0_0_80px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
              <iframe 
                src={`${viewingPdfUrl}#toolbar=0&navpanes=0&scrollbar=1`} 
                className="w-full h-full border-none"
                title="Premium PDF Viewer"
              />
            </div>

            {/* Google Drive-style Floating BOTTOM Toolbar */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 px-8 py-3.5 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white animate-in slide-in-from-bottom-6 duration-700">
              <div className="flex items-center gap-4 pr-8 border-r border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Trang</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    defaultValue="1" 
                    className="w-9 h-9 bg-white/10 border border-white/20 rounded-lg text-center text-sm font-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    title="Trang hiện tại"
                  />
                  <span className="text-sm font-medium text-slate-400">/ 50</span>
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
      )}

      {/* Sync Error Modal */}
      {showSyncErrorModal && selectedSyncRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4" style={{ zIndex: 1080 }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg text-slate-900">Chi tiết lỗi đồng bộ</h2>
              <button
                onClick={() => setShowSyncErrorModal(false)}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
                title="Đóng modal"
              >
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Thời điểm chạy</label>
                  <p className="text-sm font-mono text-slate-900">{selectedSyncRecord.syncTime}</p>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Trạng thái</label>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded font-medium">
                    Mất phần
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Số lượng lỗi</label>
                  <p className="text-sm font-mono text-red-600 font-bold">{selectedSyncRecord.errors}</p>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Thời gian xử lý</label>
                  <p className="text-sm text-slate-900">{selectedSyncRecord.duration}</p>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Mã lỗi</label>
                  <p className="text-sm text-red-600 font-medium">D-PARTIAL</p>
                </div>
              </div>

              <div className="mt-6 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-amber-800">
                      <Info className="w-4 h-4" />
                      <h4 className="font-semibold text-sm">Chi tiết lỗi dữ liệu: Bản ghi thiếu trường bắt buộc</h4>
                   </div>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#f8f7f5] text-slate-700 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2 w-1/4">ID bản ghi</th>
                      <th className="px-4 py-2 w-1/2">Dữ liệu gốc (Raw JSON)</th>
                      <th className="px-4 py-2">Lỗi / Trường bị thiếu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">REC-001</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600 bg-slate-50 rounded border border-slate-100">{"{\"fullName\": \"Nguyễn Văn A\"}"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                           <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-mono font-medium">birthDate</span>
                           <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-mono font-medium">nationality</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">REC-045</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600 bg-slate-50 rounded border border-slate-100">{"{\"fullName\": \"Trần Thị B\", \"nationality\": \"VN\"}"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                           <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-mono font-medium">birthDate</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">REC-112</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600 bg-slate-50 rounded border border-slate-100">{"{\"fullName\": \"\"}"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                           <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-mono font-medium">fullName.EMPTY</span>
                           <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-mono font-medium">certNumber</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => setShowSyncErrorModal(false)}
                className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
