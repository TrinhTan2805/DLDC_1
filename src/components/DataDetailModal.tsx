import { X, Search, ChevronLeft, ChevronRight, Upload, FileDown, RefreshCw, Filter, Eye, Calendar, CheckCircle, XCircle, FileText, Database, Info } from 'lucide-react';
import { useState } from 'react';

interface DataDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
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
  errorRecords
}: DataDetailModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<DetailRecord | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [detailTab, setDetailTab] = useState('person');
  const [searchText, setSearchText] = useState('');
  const [errorStatusFilter, setErrorStatusFilter] = useState('all');
  const [viewingPdfUrl, setViewingPdfUrl] = useState<string | null>(null);
  const [showSyncErrorModal, setShowSyncErrorModal] = useState(false);
  const [selectedSyncRecord, setSelectedSyncRecord] = useState<any>(null);
  
  if (!isOpen) return null;

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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-[90vw] max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Chi tiết dữ liệu đã thu thập</h2>
              <p className="text-sm text-slate-600 mt-1">
                {title}
              </p>
              <p className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Đồng bộ cuối cùng: 25/02/2026 14:30:00
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

          {/* Summary Cards */}
          <div className="px-6 py-4 flex-shrink-0 border-b border-slate-200">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Tổng bản ghi</div>
                <div className="text-2xl font-bold text-slate-900">{totalRecords.toLocaleString()}</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Bản ghi mới hôm nay</div>
                <div className="text-2xl font-bold text-blue-600">{newRecords.toLocaleString()}</div>
                <div className="text-xs text-slate-500 mt-1">Đồng bộ trong ngày</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Bản ghi cập nhật</div>
                <div className="text-2xl font-bold text-green-600">{updatedRecords.toLocaleString()}</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Bản ghi lỗi</div>
                <div className="text-2xl font-bold text-orange-600">{errorRecords}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-4 flex-shrink-0">
            <div className="flex items-center gap-1 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'list' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                📋 Danh sách đối tượng
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'history' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                🕐 Lịch sử đồng bộ
              </button>
            </div>
          </div>

          {/* Tab Content - LIST */}
          {activeTab === 'list' && (
            <>
              {/* Search and Filters */}
              <div className="px-6 py-4 flex-shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên, mã dịch vụ, đơn vị..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Tìm kiếm"
                      value={searchText}
                      onChange={(e: any) => setSearchText(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    className={`px-4 py-2 border border-slate-300 ${showAdvancedSearch ? 'bg-slate-100' : 'bg-white'} text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm whitespace-nowrap`}
                    title="Tìm kiếm nâng cao"
                  >
                    <Filter className="w-4 h-4" />
                    Tìm kiếm nâng cao
                  </button>
                  
                  <select
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[180px]"
                    title="Trạng thái xử lý lỗi"
                    value={errorStatusFilter}
                    onChange={(e: any) => setErrorStatusFilter(e.target.value)}
                  >
                    <option value="all">Tất cả xử lý lỗi</option>
                    <option value="sent">Đã gửi hệ thống nguồn</option>
                    <option value="updated">Đã cập nhật lại</option>
                    <option value="pending">Chờ xử lý</option>
                  </select>
                  
                  <button 
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm"
                    title="Nhập dữ liệu"
                  >
                    <Upload className="w-4 h-4" />
                    Nhập
                  </button>
                  <button 
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm"
                    title="Xuất dữ liệu"
                  >
                    <FileDown className="w-4 h-4" />
                    Xuất
                  </button>
                </div>

                {/* Advanced Search Panel */}
                {showAdvancedSearch && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      <select 
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        title="Nguồn dữ liệu"
                      >
                        <option>Tất cả nguồn dữ liệu</option>
                        <option>LGSP</option>
                        <option>NDXP</option>
                      </select>
                      <select 
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        title="Đơn vị Cục/Vụ"
                      >
                        <option>Tất cả Cục/Vụ</option>
                        <option>Cục CNTT</option>
                        <option>Vụ Pháp chế</option>
                      </select>
                      <select 
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        title="Trạng thái"
                      >
                        <option>Tất cả trạng thái</option>
                        <option>Hoạt động</option>
                        <option>Tạm dừng</option>
                      </select>
                      <select 
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        title="Loại dịch vụ"
                      >
                        <option>Tất cả loại dịch vụ</option>
                        <option>Dịch vụ công</option>
                        <option>Thu thập dữ liệu</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-600">Thời gian:</span>
                        <input type="date" defaultValue="2026-01-31" className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" title="Từ ngày" />
                        <span className="text-slate-400">—</span>
                        <input type="date" defaultValue="2026-02-27" className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" title="Đến ngày" />
                      </div>
                      <div className="ml-auto flex gap-2">
                        <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm">
                          <Search className="w-4 h-4" />
                          Tìm kiếm
                        </button>
                        <button 
                          onClick={() => setShowAdvancedSearch(false)}
                          className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-sm"
                        >
                          <X className="w-4 h-4" />
                          Bỏ lọc
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="flex-1 overflow-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">STT</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Tình trạng</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Họ tên</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Giới tính</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Ngày sinh</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Họ tên Cha</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Họ tên Mẹ</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Quốc tịch</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">SG giấy chứng nhận</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Ngày đăng ký</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Ngày đồng bộ</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Văn bản</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
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
                      <tr key={record.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-900">{index + 1}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            record.type === 'Mới' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {record.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.gender}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.birthDate}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.fatherName}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.motherName}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.nationality}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.certificateNo}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.registrationDate}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{record.syncDate}</td>
                        <td className="px-4 py-3 text-sm">
                          {record.pdfUrl ? (
                            <button
                              onClick={() => setViewingPdfUrl(record.pdfUrl!)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                              title="Xem văn bản đính kèm"
                            >
                              <FileText className="w-4 h-4" />
                              Xem
                            </button>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                            record.approvalStatus === 'Đã đồng bộ' 
                              ? 'bg-green-100 text-green-700' 
                              : record.approvalStatus === 'Đã gửi lại hệ thống nguồn'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              record.approvalStatus === 'Đã đồng bộ' 
                                ? 'bg-green-600' 
                                : record.approvalStatus === 'Đã gửi lại hệ thống nguồn'
                                ? 'bg-blue-600'
                                : 'bg-emerald-600'
                            }`}></span>
                            {record.approvalStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button 
                            onClick={() => setSelectedRecord(record)}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-blue-50 text-blue-600"
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
            </>
          )}



          {/* Tab Content - SYNC HISTORY */}
          {activeTab === 'history' && (
            <div className="flex-1 overflow-auto p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-1">Tổng số lần đồng bộ đợt 3 lần</h3>
                  <p className="text-xs text-slate-600">
                    <a href="#" className="text-blue-600 hover:underline">Làm mới</a>
                  </p>
                </div>
              </div>

              {/* Sync History Table */}
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">THỜI GIAN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">TRẠNG THÁI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">THÊM MỚI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">CẬP NHẬT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">LỖI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">TỔNG SỐ</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">THỜI LƯỢNG</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-600">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        09/12/2025 14:30:25
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Thành công
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-emerald-600 font-medium">↗ 150</td>
                    <td className="px-4 py-3 text-sm text-slate-900">45</td>
                    <td className="px-4 py-3 text-sm text-orange-600 font-medium">0</td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                        195
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">2.5s</td>
                    <td className="px-4 py-3 text-sm text-center"></td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        09/12/2025 10:15:10
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Thành công
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-emerald-600 font-medium">↗ 98</td>
                    <td className="px-4 py-3 text-sm text-slate-900">32</td>
                    <td className="px-4 py-3 text-sm text-orange-600 font-medium">0</td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                        130
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">1.8s</td>
                    <td className="px-4 py-3 text-sm text-center"></td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        08/12/2025 18:45:33
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                        <XCircle className="w-3 h-3" />
                        Mất phần
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-emerald-600 font-medium">↗ 120</td>
                    <td className="px-4 py-3 text-sm text-slate-900">28</td>
                    <td className="px-4 py-3 text-sm text-orange-600 font-medium">5</td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                        153
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">3.2s</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSyncRecord({
                              syncTime: '08/12/2025 18:45:33',
                              status: 'Mất phần',
                              errors: 5,
                              duration: '3.2s'
                            });
                            setShowSyncErrorModal(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Xem chi tiết lỗi"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        08/12/2025 14:20:15
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Thành công
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-emerald-600 font-medium">↗ 210</td>
                    <td className="px-4 py-3 text-sm text-slate-900">67</td>
                    <td className="px-4 py-3 text-sm text-orange-600 font-medium">0</td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                        277
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">4.1s</td>
                    <td className="px-4 py-3 text-sm text-center"></td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        08/12/2025 10:10:05
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Thành công
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-emerald-600 font-medium">↗ 88</td>
                    <td className="px-4 py-3 text-sm text-slate-900">19</td>
                    <td className="px-4 py-3 text-sm text-orange-600 font-medium">0</td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                        107
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">1.5s</td>
                    <td className="px-4 py-3 text-sm text-center"></td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                {/* Vertical Sidebar */}
                <div className="w-64 border-r border-slate-200 bg-slate-50 overflow-y-auto flex-shrink-0">
                  <div className="p-4 space-y-1">
                    <button
                      onClick={() => setDetailTab('person')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                        detailTab === 'person' ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                        👤
                      </span>
                      Thông tin bản ghi
                    </button>
                    <button
                      onClick={() => setDetailTab('father')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                        detailTab === 'father' ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                        👨
                      </span>
                      Thông tin Cha
                    </button>
                    <button
                      onClick={() => setDetailTab('mother')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                        detailTab === 'mother' ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0">
                        👩
                      </span>
                      Thông tin Mẹ
                    </button>
                    <button
                      onClick={() => setDetailTab('other_info')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                        detailTab === 'other_info' ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        📋
                      </span>
                      Thông tin khác
                    </button>
                    <button
                      onClick={() => setDetailTab('history')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                        detailTab === 'history' ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0">
                        🕐
                      </span>
                      Lịch sử đồng bộ
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-8">
                  {/* Tab: Thông tin về người được khai sinh */}
                  {detailTab === 'person' && (
                    <div className="max-w-3xl mx-auto space-y-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl">
                          👤
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-slate-900">Thông tin bản ghi</h4>
                          <p className="text-sm text-slate-500">Dữ liệu chi tiết về người được khai sinh</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Họ, chữ đệm, tên</label>
                          <div className="text-lg text-slate-900 font-semibold border-b border-slate-100 pb-2">{selectedRecord.name}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Giới tính</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.gender}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Ngày, tháng, năm sinh</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.birthDate}</div>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Ngày sinh bằng chữ</label>
                          <div className="text-base text-slate-900 font-medium italic border-b border-slate-100 pb-2">{selectedRecord.birthDateInWords}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Nơi sinh</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.birthPlace}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Quê quán</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.hometown}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Dân tộc</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.ethnicity}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Quốc tịch</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.nationality}</div>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Số định danh cá nhân</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.personalId}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab: Thông tin về người cha */}
                  {detailTab === 'father' && (
                    <div className="max-w-3xl mx-auto space-y-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">
                          👨
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-slate-900">Thông tin Cha</h4>
                          <p className="text-sm text-slate-500">Dữ liệu chi tiết về người cha</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Họ, chữ đệm, tên</label>
                          <div className="text-lg text-slate-900 font-semibold border-b border-slate-100 pb-2">{selectedRecord.fatherName || '-'}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Ngày, tháng, năm sinh</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.fatherBirthDate || '-'}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Dân tộc</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.fatherEthnicity || '-'}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Quốc tịch</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.fatherNationality || '-'}</div>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Nơi cư trú</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.fatherAddress || '-'}</div>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Số GTTT</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.fatherIdNumber || '-'}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab: Thông tin về người mẹ */}
                  {detailTab === 'mother' && (
                    <div className="max-w-3xl mx-auto space-y-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center text-3xl">
                          👩
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-slate-900">Thông tin Mẹ</h4>
                          <p className="text-sm text-slate-500">Dữ liệu chi tiết về người mẹ</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Họ, chữ đệm, tên</label>
                          <div className="text-lg text-slate-900 font-semibold border-b border-slate-100 pb-2">{selectedRecord.motherName || '-'}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Ngày, tháng, năm sinh</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.motherBirthDate || '-'}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Dân tộc</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.motherEthnicity || '-'}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Quốc tịch</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.motherNationality || '-'}</div>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Nơi cư trú</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.motherAddress || '-'}</div>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Số GTTT</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.motherIdNumber || '-'}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab: Thông tin khác */}
                  {detailTab === 'other_info' && (
                    <div className="max-w-3xl mx-auto space-y-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl">
                          📋
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-slate-900">Thông tin khác</h4>
                          <p className="text-sm text-slate-500">Thông tin người đi khai sinh và các thông tin bổ sung</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Họ, chữ đệm, tên người đi khai sinh</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.declarantName || '-'}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Quan hệ với người được khai sinh</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.declarantRelation || '-'}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Số GTTT người đi khai sinh</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.declarantIdNumber || '-'}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Ngày ký</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.signDate || '-'}</div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Người thực hiện</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.implementer || '-'}</div>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Ghi chú</label>
                          <div className="text-base text-slate-900 font-medium border-b border-slate-100 pb-2">{selectedRecord.notes || '-'}</div>
                        </div>
                      </div>

                      {selectedRecord.pdfUrl && (
                        <div className="mt-8 border border-orange-200 p-6 rounded-2xl bg-orange-50/30">
                          <div className="text-xs text-orange-600 font-bold uppercase tracking-widest mb-4">Văn bản đính kèm</div>
                          <button
                            onClick={() => setViewingPdfUrl(selectedRecord.pdfUrl!)}
                            className="flex items-center gap-4 text-slate-900 font-bold hover:text-orange-600 transition-all group"
                          >
                            <div className="bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-all">
                              <FileText className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm">Hồ sơ đính kèm chi tiết.pdf</span>
                              <span className="text-xs text-slate-500 font-medium mt-0.5">Nhấn để xem trực tiếp</span>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab: Lịch sử đồng bộ */}
                  {detailTab === 'history' && (
                    <div className="max-w-3xl mx-auto space-y-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl">
                          🕐
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-slate-900">Lịch sử đồng bộ</h4>
                          <p className="text-sm text-slate-500">Chi tiết quá trình thu thập và đồng bộ bản ghi</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-start gap-4 border-l-2 border-emerald-500 pl-6 pb-6">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full -ml-[31px] mt-1.5 border-2 border-white ring-2 ring-emerald-500/20"></div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">Đồng bộ thành công</div>
                            <div className="text-xs text-slate-500 mt-1">{selectedRecord.syncDate}</div>
                            <div className="text-sm text-slate-600 mt-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                              Bản ghi đã được thu thập từ hệ thống nguồn và đồng bộ vào kho dữ liệu tập trung thành công.
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 border-l-2 border-slate-200 pl-6 pb-6">
                          <div className="w-3 h-3 bg-slate-300 rounded-full -ml-[31px] mt-1.5 border-2 border-white"></div>
                          <div>
                            <div className="text-sm font-semibold text-slate-600">Tiếp nhận dữ liệu</div>
                            <div className="text-xs text-slate-500 mt-1">{selectedRecord.collectedAt}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
                            <div className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Mô tả lỗi</div>
                            <div className="text-sm font-medium text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
                               {selectedRecord.errorMessage || 'Lỗi không xác định'}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Trường dữ liệu phát hiện lỗi</div>
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
                            <div className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Trạng thái xử lý</div>
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
                            <div className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Ghi chú bổ sung</div>
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
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                  title="Xuất file"
                >
                  <FileDown className="w-4 h-4" />
                  Xuất file
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
