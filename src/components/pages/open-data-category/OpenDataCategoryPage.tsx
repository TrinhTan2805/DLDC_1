import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Download, Upload, Filter, FileText, Info, Edit, CheckCircle, XCircle, Eye, Clock, FileCheck, Shield, History as HistoryIcon, File, ExternalLink, CheckSquare, ChevronDown, RotateCcw, ArrowLeft, PlusCircle, PauseCircle, PlayCircle, X, Globe, FileSpreadsheet, Database } from 'lucide-react';

import { FilesTab } from './components/tabs/FilesTab';

interface OpenDataCategoryPageProps {
  categoryName: string;
  categoryId: string;
}

export interface CategoryItem {
  id: number;
  code: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  publishStatus: 'published' | 'unpublished';
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'draft';
  createdDate: string;
  updatedBy: string;
  keywords?: string;
  licenseId?: string;
  publisher?: string;
  fileName?: string;
  format?: string[];
  frequency?: string;
  uploadType?: string;
  apiType?: string;
  apiTitle?: string;
  apiUrl?: string;
  apiMethod?: string;
  apiDesc?: string;
  apiParams?: string;
  apiHeaders?: string;
}

export interface VersionHistoryItem {
  id: number;
  version: string;
  description: string;
  updatedBy: string;
  updatedDate: string;
  changes: string;
  status: string;
  fileUrl?: string;
}

interface ScheduleItem {
  id: number;
  datasetCode: string;
  datasetName: string;
  categoryName?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  startTime: string;
  startDate?: string;
  endDate?: string;
  publishFormat?: 'api' | 'file';
  targetAudience?: string;
  contactInfo?: string;
  dataSource: string;
  status: 'active' | 'inactive';
  lastRun?: string;
  nextRun: string;
  createdBy: string;
  createdDate: string;
}

interface CategoryOption {
  id: string;
  name: string;
  description: string;
}

interface MetadataItem {
  id: number;
  datasetCode: string;
  datasetName: string;
  fileName: string;
  description: string;
  keywords: string;
  licenseId: number;
  format: string;
  source: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  status: 'active' | 'inactive';
  approvalStatus: 'draft' | 'pending' | 'approved' | 'rejected';
  updatedBy?: string;
  updatedDate?: string;
}

interface LicenseItem {
  id: number;
  name: string;
  description: string;
  terms: string;
  referenceUrl: string;
  status: 'active' | 'inactive';
}

const sampleData: CategoryItem[] = [
  {
    id: 1,
    code: 'ODCAT001',
    name: 'Mục 1',
    description: 'Dữ liệu tổ chức thực hiện trợ giúp pháp lý bao gồm các trung tâm nhà nước và văn phòng hợp đồng.',
    status: 'active',
    publishStatus: 'published',
    approvalStatus: 'approved',
    createdDate: '15/12/2024',
    updatedBy: 'Nguyễn Văn A',
    fileName: 'danh_sach_to_chuc_tgpl.xlsx',
    keywords: 'luật, mở, thống kê',
    publisher: 'Bộ Tư pháp',
    licenseId: 'Giấy phép dữ liệu mở công cộng',
    format: ['excel'],
    frequency: 'monthly',
  },
  {
    id: 2,
    code: 'ODCAT002',
    name: 'Mục 2',
    description: 'Dữ liệu danh sách trợ giúp viên pháp luật và luật sư cộng tác viên.',
    status: 'active',
    publishStatus: 'published',
    approvalStatus: 'approved',
    createdDate: '14/12/2024',
    updatedBy: 'Trần Thị B',
    fileName: 'danh_sach_nguoi_tgpl.json',
    keywords: 'doanh nghiệp, đăng ký',
    publisher: 'Cục Bổ trợ tư pháp',
    licenseId: 'Giấy phép ODC-BY',
    format: ['api'],
    frequency: 'weekly',
  },
  {
    id: 3,
    code: 'ODCAT003',
    name: 'Mục 3',
    description: 'Yêu cầu công bố dữ liệu danh sách Luật sư Việt Nam cập nhật.',
    status: 'inactive',
    publishStatus: 'unpublished',
    approvalStatus: 'draft',
    createdDate: '13/12/2024',
    updatedBy: 'Lê Văn C',
    fileName: 'danh_sach_luat_su.xlsx',
    keywords: 'luật sư, bổ trợ tư pháp',
    publisher: 'Bộ Tư pháp',
    licenseId: 'Giấy phép dữ liệu mở công cộng',
    format: ['excel'],
    frequency: 'quarterly',
  },
  {
    id: 4,
    code: 'ODCAT004',
    name: 'Mục 4',
    fileName: 'API lấy dữ liệu tổ chức (Nội bộ)',
    description: 'API truy xuất thông tin danh sách tổ chức trợ giúp pháp lý từ hệ thống nội bộ của Bộ Tư pháp.',
    status: 'active',
    publishStatus: 'published',
    approvalStatus: 'approved',
    createdDate: '12/12/2024',
    updatedBy: 'Nguyễn Văn A',
    keywords: 'luật, mở, thống kê',
    publisher: 'Bộ Tư pháp',
    licenseId: 'Giấy phép dữ liệu mở công cộng',
    uploadType: 'api',
    apiType: 'internal',
    apiTitle: 'API Danh sách tổ chức TGPL',
    apiUrl: 'https://api.moj.gov.vn/open-data/v1/tgpl-orgs',
    apiMethod: 'GET',
    apiDesc: 'API lấy danh sách các tổ chức thực hiện trợ giúp pháp lý cập nhật thời gian thực.'
  },
  {
    id: 5,
    code: 'ODCAT005',
    name: 'Mục 5',
    fileName: 'API đồng bộ dữ liệu người TGPL (Cổng DVC)',
    description: 'API liên kết dữ liệu danh sách người thực hiện trợ giúp pháp lý trực tiếp từ Cổng Dịch vụ công Quốc gia.',
    status: 'active',
    publishStatus: 'published',
    approvalStatus: 'approved',
    createdDate: '10/12/2024',
    updatedBy: 'Trần Thị B',
    keywords: 'doanh nghiệp, đăng ký',
    publisher: 'Cục Bổ trợ tư pháp',
    licenseId: 'Giấy phép ODC-BY',
    uploadType: 'api',
    apiType: 'external',
    apiTitle: 'API Dịch vụ công Quốc gia',
    apiUrl: 'https://dichvucong.gov.vn/api/open/tgpl-list',
    apiMethod: 'POST',
    apiDesc: 'API liên kết dữ liệu trợ giúp pháp lý với cổng DVC Quốc gia.',
    apiParams: 'limit=100&type=org',
    apiHeaders: '{"Authorization": "Bearer token_abc123"}'
  }
];

const sampleVersionHistory: VersionHistoryItem[] = [
  {
    id: 1,
    version: 'v1.3',
    description: 'Cập nhật cấu trúc dữ liệu',
    updatedBy: 'Nguyễn Văn A',
    updatedDate: '15/12/2024',
    changes: 'Thêm trường địa chỉ chi tiết',
    status: 'Hiện tại'
  },

  {
    id: 3,
    version: 'v1.1',
    description: 'Sửa lỗi dữ liệu',
    updatedBy: 'Lê Văn C',
    updatedDate: '05/12/2024',
    changes: 'Điều chỉnh định dạng ngày tháng',
    status: 'Lịch sử'
  },
  {
    id: 4,
    version: 'v1.0',
    description: 'Phiên bản đầu tiên',
    updatedBy: 'Nguyễn Văn A',
    updatedDate: '01/12/2024',
    changes: 'Khởi tạo danh mục',
    status: 'Lịch sử'
  }
];

// Danh sách các bảng danh mục có sẵn
const availableCategories: CategoryOption[] = [
  { id: 'cat_a', name: 'Biên tập danh mục A', description: 'Văn bản pháp luật' },
  { id: 'cat_b', name: 'Danh mục B', description: 'Đăng ký kinh doanh' },
  { id: 'cat_c', name: 'Danh mục C', description: 'Công chứng' },
  { id: 'cat_d', name: 'Danh mục D', description: 'TGPL' },
  { id: 'cat_e', name: 'Danh mục E', description: 'Hộ tịch' },
];

const sampleLicenses: LicenseItem[] = [
  {
    id: 1,
    name: 'Giấy phép dữ liệu mở công cộng',
    description: 'Cho phép sử dụng và phân phối dữ liệu mở mà không cần xin phép.',
    terms: 'Sao chép, phân phối và sử dụng với ghi nguồn, không giới hạn mục đích.',
    referenceUrl: 'https://example.com/license/cc0',
    status: 'active'
  },
  {
    id: 2,
    name: 'Giấy phép ODC-BY',
    description: 'Yêu cầu ghi nhận nguồn dữ liệu khi sử dụng.',
    terms: 'Phải ghi rõ nguồn trong mọi trường hợp sử dụng.',
    referenceUrl: 'https://example.com/license/odc-by',
    status: 'active'
  },
];

const sampleMetadata: MetadataItem[] = [
  {
    id: 1,
    datasetCode: 'ODC001',
    datasetName: 'Danh mục dữ liệu A',
    fileName: 'danh_sach_to_chuc_tgpl.xlsx',
    description: 'Dữ liệu thống kê về lĩnh vực A',
    keywords: 'văn bản, pháp luật, mở',
    licenseId: 1,
    format: 'CSV',
    source: 'API nội bộ Bộ Tư pháp',
    frequency: 'monthly',
    status: 'active',
    approvalStatus: 'approved',
    updatedBy: 'Nguyễn Văn A',
    updatedDate: '15/12/2024'
  },
  {
    id: 2,
    datasetCode: 'ODC002',
    datasetName: 'Danh mục dữ liệu B',
    fileName: 'danh_sach_nguoi_tgpl.json',
    description: 'Dữ liệu thống kê về lĩnh vực B',
    keywords: 'đăng ký, doanh nghiệp',
    licenseId: 2,
    format: 'JSON',
    source: 'Dịch vụ công Quốc gia',
    frequency: 'quarterly',
    status: 'active',
    approvalStatus: 'pending',
    updatedBy: 'Trần Thị B',
    updatedDate: '10/12/2024'
  },
  {
    id: 3,
    datasetCode: 'ODC003',
    datasetName: 'Danh mục dữ liệu C',
    fileName: 'danh_sach_luat_su.xlsx',
    description: 'Dữ liệu thống kê về lĩnh vực C',
    keywords: 'đăng ký, doanh nghiệp',
    licenseId: 2,
    format: 'JSON',
    source: 'Dịch vụ công Quốc gia',
    frequency: 'daily',
    status: 'inactive',
    approvalStatus: 'rejected',
    updatedBy: 'Lê Văn C',
    updatedDate: '05/12/2024'
  }
];

export function OpenDataCategoryPage({ categoryName, categoryId }: OpenDataCategoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [licenseFilter, setLicenseFilter] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailModalTab, setDetailModalTab] = useState<'general' | 'data'>('general');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CategoryItem | null>(null);
  const [data, setData] = useState<CategoryItem[]>(sampleData);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [submitActiveTab, setSubmitActiveTab] = useState<'category' | 'metadata' | 'license'>('category');
  const [submitItems, setSubmitItems] = useState<CategoryItem[]>([]);
  const [showBulkPublishModal, setShowBulkPublishModal] = useState(false);
  const [showBulkUnpublishModal, setShowBulkUnpublishModal] = useState(false);
  const [showBulkApprovalModal, setShowBulkApprovalModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPublishFromModalModal, setShowPublishFromModalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [submitApprovalNote, setSubmitApprovalNote] = useState('');
  const [selectedApprover, setSelectedApprover] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    keywords: '',
    licenseId: '',
    publisher: '',
    fileName: ''
  });
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [selectedDatasetForVersion, setSelectedDatasetForVersion] = useState<CategoryItem | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedVersionToRestore, setSelectedVersionToRestore] = useState<VersionHistoryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tempRequiredFields, setTempRequiredFields] = useState<string[]>(['MaHS', 'HoTen', 'NgaySinh']);

  const [editForm, setEditForm] = useState({
    name: '',
    fileName: '',
    licenseId: '',
    keywords: '',
    publisher: '',
    description: ''
  });

  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false);
  const [showVersionComparisonModal, setShowVersionComparisonModal] = useState(false);
  const [selectedDatasetForVersionHistory, setSelectedDatasetForVersionHistory] = useState<CategoryItem | null>(null);
  const [selectedVersionToCompare, setSelectedVersionToCompare] = useState<any | null>(null);

  useEffect(() => {
    if (selectedItem) {
      setEditForm({
        name: selectedItem.name || '',
        fileName: selectedItem.fileName || '',
        licenseId: selectedItem.licenseId || 'Giấy phép dữ liệu mở công cộng',
        keywords: selectedItem.keywords || 'luật, mở, thống kê',
        publisher: selectedItem.publisher || 'Bộ Tư pháp',
        description: selectedItem.description || ''
      });
    }
  }, [selectedItem]);

  const handleSaveEdit = () => {
    if (selectedItem) {
      setData(data.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              name: editForm.name,
              fileName: editForm.fileName,
              licenseId: editForm.licenseId,
              keywords: editForm.keywords,
              publisher: editForm.publisher,
              description: editForm.description,
              approvalStatus: 'draft' as const
            }
          : item
      ));
      alert('Hệ thống đã lưu thành công nhánh phiên bản mới đang chỉnh sửa (v1.4). Các thay đổi này cần được phê duyệt trước khi công bố!');
      setShowEditModal(false);
      setSelectedItem(null);
    }
  };

  const getExpectedHeaders = () => {
    if (categoryName.toLowerCase().includes('tổ chức')) {
      return ['Tên tổ chức thực hiện trợ giúp pháp lý', 'Người đại diện', 'Địa chỉ liên hệ'];
    } else if (categoryName.toLowerCase().includes('người')) {
      return ['Họ tên', 'Số năm hành nghề', 'Vai trò', 'Tổ chức hành nghề', 'Địa chỉ tổ chức', 'Số điện thoại tổ chức'];
    } else {
      return ['Họ và tên', 'Ngày sinh', 'Giới tính', 'Quốc tịch', 'Số Chứng chỉ hành nghề luật sư', 'Số Thẻ luật sư', 'Nơi làm việc/nơi hành nghề', 'Thành viên Đoàn Luật sư', 'Tình trạng hành nghề'];
    }
  };

  // Danh sách người phê duyệt
  const approvers = [
    { id: '1', name: 'Nguyễn Văn An - Trưởng phòng' },
    { id: '2', name: 'Trần Thị Bình - Phó phòng' },
    { id: '3', name: 'Lê Văn Cường - Giám đốc' },
    { id: '4', name: 'Phạm Thị Dung - Phó giám đốc' },
  ];



  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.fileName && item.fileName.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = statusFilter === 'all' || item.publishStatus === statusFilter;

    const getLicenseText = (itm: CategoryItem) => {
      if (itm.licenseId) return itm.licenseId;
      return itm.id === 2 ? 'Giấy phép ODC-BY' : 'Giấy phép dữ liệu mở công cộng';
    };
    const matchesLicense = licenseFilter === 'all' || getLicenseText(item) === licenseFilter;

    let matchesDate = true;
    if (item.createdDate) {
      const parts = item.createdDate.split('/');
      if (parts.length === 3) {
        const itemDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        if (startDateFilter) {
          const start = new Date(startDateFilter);
          start.setHours(0, 0, 0, 0);
          if (itemDate < start) matchesDate = false;
        }
        if (endDateFilter) {
          const end = new Date(endDateFilter);
          end.setHours(23, 59, 59, 999);
          if (itemDate > end) matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesLicense && matchesDate;
  });

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Stats calculation
  const totalItems = data.length;
  const activeItems = data.filter(item => item.status === 'active').length;
  const inactiveItems = data.filter(item => item.status === 'inactive').length;

  const handleStatsClick = (filter: string) => {
    setStatusFilter(filter);
  };

  const renderPagination = (total: number) => {
    if (total <= 0) return null;
    const totalPages = Math.ceil(total / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, total);

    return (
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Hiển thị</span>
          <select
            aria-label="Select record count"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[13px] cursor-pointer"
            title="Số bản ghi trên trang"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-slate-600">bản ghi/trang</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-600">
            {startItem} - {endItem} / {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handlePublish = (item: CategoryItem) => {
    setSelectedItem(item);
    setShowPublishModal(true);
  };

  const handleUnpublish = (item: CategoryItem) => {
    setSelectedItem(item);
    setShowUnpublishModal(true);
  };

  const confirmPublish = () => {
    if (selectedItem) {
      setData(data.map(item =>
        item.id === selectedItem.id
          ? { ...item, publishStatus: 'published' as const }
          : item
      ));
      setShowPublishModal(false);
      setSelectedItem(null);
    }
  };

  const confirmUnpublish = () => {
    if (selectedItem) {
      setData(data.map(item =>
        item.id === selectedItem.id
          ? { ...item, publishStatus: 'unpublished' as const }
          : item
      ));
      setShowUnpublishModal(false);
      setSelectedItem(null);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(item => item.id)));
    }
  };

  const toggleSelectItem = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkPublish = () => {
    setData(data.map(item =>
      selectedIds.has(item.id)
        ? { ...item, publishStatus: 'published' as const }
        : item
    ));
    setShowBulkPublishModal(false);
    setSelectedIds(new Set());
  };

  const handleBulkUnpublish = () => {
    setData(data.map(item =>
      selectedIds.has(item.id)
        ? { ...item, publishStatus: 'unpublished' as const }
        : item
    ));
    setShowBulkUnpublishModal(false);
    setSelectedIds(new Set());
  };

  const handleBulkApproval = () => {
    setData(data.map(item =>
      selectedIds.has(item.id)
        ? { ...item, approvalStatus: 'approved' as const }
        : item
    ));
    setShowBulkApprovalModal(false);
    setSelectedIds(new Set());
  };

  const handleBulkSubmitApproval = () => {
    setData(data.map(item =>
      selectedIds.has(item.id)
        ? { ...item, approvalStatus: 'pending' as const }
        : item
    ));
    setShowBulkApprovalModal(false);
    setSelectedIds(new Set());
  };

  return (
    <>
    {(isSubmitting || isApproving) && (
      <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
        <div className="bg-slate-50 relative w-[95vw] max-w-6xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Headers */}
        <div className="bg-white border-b border-slate-200 pt-4 px-6">
          <div className="flex gap-8">
            <button onClick={() => setSubmitActiveTab('category')} className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${submitActiveTab === 'category' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
               <FileText className="w-4 h-4" />
               Thông tin danh mục
            </button>
            <button onClick={() => setSubmitActiveTab('metadata')} className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${submitActiveTab === 'metadata' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
               <File className="w-4 h-4" />
               Thông tin Metadata
            </button>
            <button onClick={() => setSubmitActiveTab('license')} className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${submitActiveTab === 'license' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
               <Shield className="w-4 h-4" />
               Thông tin giấy phép
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-slate-50">
          {submitActiveTab === 'category' && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm max-w-6xl mx-auto">
              <div className="p-4 border-b border-slate-200 border-l-4 border-l-blue-600">
                <h2 className="text-lg font-medium text-slate-800">{isApproving ? "Danh sách danh mục đang chờ phê duyệt" : "Danh sách danh mục cần phê duyệt"}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left"><input type="checkbox" aria-label="Chọn tất cả" title="Chọn tất cả" checked={true} readOnly className="w-4 h-4 text-blue-600 rounded" /></th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">STT</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Mã</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Tên</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Phê duyệt</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Công khai</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Ngày tạo</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Người cập nhật</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submitItems.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3"><input type="checkbox" aria-label={`Chọn mục ${item.name}`} title={`Chọn mục ${item.name}`} checked={true} readOnly className="w-4 h-4 text-blue-600 rounded" /></td>
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3"><code className="px-2 py-0.5 bg-slate-100 text-emerald-700 rounded text-xs">{item.code}</code></td>
                        <td className="px-4 py-3 text-sm text-slate-900">{item.name}</td>
                        <td className="px-4 py-3">
                          {item.status === 'active' ? (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 border border-green-200 rounded-full">Hoạt động</span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">Không hoạt động</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">Nháp</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full">Chưa công khai</span>
                        </td>
                        <td className="px-4 py-3 text-sm">{item.createdDate}</td>
                        <td className="px-4 py-3 text-sm">{item.updatedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-slate-200 bg-slate-50/50 rounded-b-lg">
                {isSubmitting ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Người nhận trình duyệt (Người phê duyệt) <span className="text-red-500">*</span></label>
                      <select 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:outline-none bg-white shadow-sm"
                        value={selectedApprover}
                        onChange={(e) => setSelectedApprover(e.target.value)}
                        aria-label="Chọn người phê duyệt"
                        title="Chọn người phê duyệt"
                      >
                        <option value="">-- Chọn người phê duyệt --</option>
                        <option value="1">Lãnh đạo Cục CNTT</option>
                        <option value="2">Trưởng phòng Dữ liệu</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Nội dung trình duyệt</label>
                      <textarea 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:outline-none bg-white shadow-sm"
                        rows={3}
                        placeholder="Nhập ghi chú hoặc nội dung cần trình bày..."
                        value={submitApprovalNote}
                        onChange={(e) => setSubmitApprovalNote(e.target.value)}
                        aria-label="Nội dung trình duyệt"
                        title="Nội dung trình duyệt"
                      ></textarea>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Nội dung trình duyệt từ Cán bộ</label>
                      <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 shadow-sm min-h-[5rem]">
                        Kính trình lãnh đạo xem xét cấp phép công bố bộ dữ liệu mới phục vụ hệ thống mở bộ tư pháp.
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Nội dung phê duyệt / Lý do từ chối</label>
                      <textarea 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:outline-none bg-white shadow-sm"
                        rows={3}
                        placeholder="Nhập ghi chú phê duyệt hoặc lý do từ chối nếu có..."
                        value={approvalNote}
                        onChange={(e) => setApprovalNote(e.target.value)}
                        aria-label="Nội dung phê duyệt hoặc lý do từ chối"
                        title="Nội dung phê duyệt hoặc lý do từ chối"
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {submitActiveTab === 'metadata' && (
            <div className="bg-white rounded-lg shadow-sm max-w-4xl border border-slate-200 mx-auto">
              <div className="p-4 border-b border-slate-200 md:flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-slate-900">Metadata</h2>
                  <p className="text-sm text-slate-500 mt-1">Quản lý thông tương metadata cho dữ liệu mở, bao gồm giấy phép, định dạng và nguồn dữ liệu.</p>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Danh mục *</label>
                  <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg max-h-48 overflow-y-auto space-y-3">
                    <div>
                      <div className="text-sm font-semibold mb-1 text-slate-800">Tư pháp</div>
                      <label className="flex items-center gap-2 text-sm text-slate-600 ml-2">
                        <input type="checkbox" aria-label="Danh mục tư pháp" title="Danh mục tư pháp" checked={true} readOnly className="rounded border-slate-300 w-4 h-4 text-blue-600 cursor-pointer" />
                        CAT001 - Văn bản pháp luật
                      </label>
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1 text-slate-800">Hộ tịch</div>
                      <label className="flex items-center gap-2 text-sm text-slate-600 ml-2">
                        <input type="checkbox" aria-label="Danh mục hộ tịch" title="Danh mục hộ tịch" readOnly className="rounded border-slate-300 w-4 h-4 text-blue-600 cursor-pointer" />
                        CAT002 - Hộ tịch
                      </label>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Chọn một hoặc nhiều danh mục cho Metadata này.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tên tệp dữ liệu *</label>
                  <input type="text" aria-label="Tên tệp dữ liệu" title="Tên tệp dữ liệu" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none shadow-sm bg-white" defaultValue={`${categoryName}.xlsx`} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả *</label>
                  <textarea rows={3} aria-label="Mô tả metadata" title="Mô tả metadata" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none shadow-sm" defaultValue={`Metadata cho dữ liệu mở ${categoryName}`}></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Từ khóa</label>
                  <input type="text" aria-label="Từ khóa metadata" title="Từ khóa metadata" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none shadow-sm" defaultValue="luật, mở, thống kê" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Giấy phép *</label>
                  <select aria-label="Giấy phép metadata" title="Giấy phép metadata" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none shadow-sm bg-white">
                    <option>Giấy phép dữ liệu mở công cộng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Định dạng</label>
                  <div className="flex flex-wrap gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    {['CSV', 'JSON', 'XML', 'Excel', 'PDF'].map((fmt) => (
                      <label key={fmt} className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={fmt === 'CSV'}
                          className="rounded border-slate-300 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:outline-none cursor-pointer"
                        />
                        {fmt}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nguồn dữ liệu</label>
                    <input type="text" aria-label="Nguồn dữ liệu" title="Nguồn dữ liệu" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none shadow-sm" defaultValue="API nội bộ" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tần suất cập nhật</label>
                    <select aria-label="Tần suất cập nhật" title="Tần suất cập nhật" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none bg-white shadow-sm">
                      <option>Hàng tháng</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Cấu hình trường bắt buộc trong file dữ liệu tải lên
                  </label>
                  <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="new-required-field-category-input"
                        placeholder="Nhập tên trường bắt buộc (ví dụ: MaHS, HoTen...)"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:outline-none bg-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.currentTarget;
                            const val = input.value.trim();
                            if (val) {
                              if (!tempRequiredFields.includes(val)) {
                                setTempRequiredFields([...tempRequiredFields, val]);
                              }
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('new-required-field-category-input') as HTMLInputElement;
                          const val = input?.value.trim();
                          if (val) {
                            if (!tempRequiredFields.includes(val)) {
                              setTempRequiredFields([...tempRequiredFields, val]);
                            }
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        Thêm
                      </button>
                    </div>

                    {/* List of current required fields */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {tempRequiredFields.length > 0 ? (
                        tempRequiredFields.map((field) => (
                          <span
                            key={field}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold border border-red-100"
                          >
                            {field}
                            <button
                              type="button"
                              onClick={() => {
                                setTempRequiredFields(tempRequiredFields.filter((f) => f !== field));
                              }}
                              className="p-0.5 hover:bg-red-100 rounded text-red-500 transition-colors"
                              title="Xóa trường"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">Chưa cấu hình trường bắt buộc nào</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {submitActiveTab === 'license' && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 max-w-4xl mx-auto">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-medium text-slate-900">Chỉnh sửa giấy phép</h2>
                <p className="text-sm text-slate-500 mt-1">Quản lý giấy phép chuẩn, điều kiện sử dụng và liên kết tham chiếu.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tên giấy phép *</label>
                  <input type="text" aria-label="Tên giấy phép" title="Tên giấy phép" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:outline-none shadow-sm" defaultValue="Giấy phép dữ liệu mở công cộng" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả *</label>
                  <textarea rows={3} aria-label="Mô tả giấy phép" title="Mô tả giấy phép" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:outline-none shadow-sm" defaultValue="Cho phép sử dụng và phân phối dữ liệu mở."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Điều kiện sử dụng *</label>
                  <textarea rows={3} aria-label="Điều kiện sử dụng" title="Điều kiện sử dụng" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:outline-none shadow-sm" defaultValue="Ghi nguồn là bắt buộc."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Liên kết tham chiếu *</label>
                  <input type="text" aria-label="Liên kết tham chiếu" title="Liên kết tham chiếu" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:outline-none shadow-sm" defaultValue="https://example.com/license/cc0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái</label>
                  <select aria-label="Trạng thái giấy phép" title="Trạng thái giấy phép" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:outline-none bg-white shadow-sm">
                    <option>Còn hiệu lực</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border-t px-6 py-4 flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] items-center z-20">
            <button 
              onClick={() => {
                setIsSubmitting(false);
                setIsApproving(false);
              }} 
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
            >
              Hủy
            </button>
            {isSubmitting ? (
              <button 
                onClick={() => {
                  if (submitItems.length > 0) {
                    const updatedIds = submitItems.map(i => i.id);
                    setData(data.map(item => updatedIds.includes(item.id) ? { ...item, approvalStatus: 'pending' as const } : item));
                    alert('Đã gửi yêu cầu trình duyệt thành công!');
                  }
                  setIsSubmitting(false);
                  setSelectedIds(new Set());
                }} 
                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 shadow-sm font-medium"
              >
                Gửi phê duyệt
              </button>
            ) : (
              <>
                <button 
                  onClick={() => {
                    if (submitItems.length > 0) {
                      const updatedIds = submitItems.map(i => i.id);
                      setData(data.map(item => updatedIds.includes(item.id) ? { ...item, approvalStatus: 'rejected' as const } : item));
                      alert('Đã từ chối danh mục!');
                    }
                    setIsApproving(false);
                    setSelectedIds(new Set());
                  }} 
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm font-medium"
                >
                  Từ chối
                </button>
                <button 
                  onClick={() => {
                    if (submitItems.length > 0) {
                      const updatedIds = submitItems.map(i => i.id);
                      setData(data.map(item => updatedIds.includes(item.id) ? { ...item, approvalStatus: 'approved' as const } : item));
                      alert('Đã phê duyệt thành công!');
                    }
                    setIsApproving(false);
                    setSelectedIds(new Set());
                  }} 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm font-medium"
                >
                  Phê duyệt
                </button>
              </>
            )}
        </div>
        </div>
      </div>
    )}
    <div className="space-y-6">
      {/* Main Tab Content */}
      <div className="p-6">
        <FilesTab
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          filteredData={filteredData}
          paginatedData={paginatedData}
          totalItems={totalItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          onViewDetail={(item) => {
            setSelectedItem(item);
            setDetailModalTab('general');
            setShowDetailModal(true);
          }}
          onViewVersion={(item) => {
            setSelectedDatasetForVersionHistory(item);
            setShowVersionHistoryModal(true);
          }}
          activeTab="category"
          startDateFilter={startDateFilter}
          setStartDateFilter={setStartDateFilter}
          endDateFilter={endDateFilter}
          setEndDateFilter={setEndDateFilter}
        />
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-slate-900 mb-4">Thêm mới {categoryName}</h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Mã <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nhập mã..."
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Tên <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nhập tên..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Cơ quan công bố</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nhập tên cơ quan..."
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Từ khóa</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Phân tách bằng dấu phẩy..."
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Giấy phép</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    value={formData.licenseId}
                    onChange={(e) => setFormData({ ...formData, licenseId: e.target.value })}
                  >
                    <option value="">-- Chọn giấy phép --</option>
                    {sampleLicenses.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Tệp dữ liệu <span className="text-slate-500 font-normal">(CSV, JSON, XML)</span></label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${uploadStatus === 'success' ? 'border-emerald-500 bg-emerald-50' : uploadStatus === 'error' ? 'border-red-500 bg-red-50' : 'border-slate-300 hover:border-emerald-500'}`}>
                  {uploadStatus === 'idle' && (
                    <div>
                      <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600 mb-2">Kéo thả tệp hoặc click để tải lên</p>
                      <input 
                        type="file" 
                        className="hidden" 
                        id="file-upload" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadStatus('checking');
                            setTimeout(() => {
                              if (file.name.endsWith('.csv') || file.name.endsWith('.json') || file.name.endsWith('.xml') || file.name.endsWith('.xlsx')) {
                                setUploadStatus('success');
                                setFormData({ ...formData, fileName: file.name });
                              } else {
                                setUploadStatus('error');
                                setFormData({ ...formData, fileName: '' });
                              }
                            }, 1500);
                          }
                        }} 
                      />
                      <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 inline-block text-sm transition-colors">
                        Chọn tệp
                      </label>
                    </div>
                  )}
                  {uploadStatus === 'checking' && (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-2"></div>
                      <p className="text-sm text-slate-600">Đang kiểm tra định dạng và đối chiếu metadata...</p>
                    </div>
                  )}
                  {uploadStatus === 'success' && (
                    <div>
                      <FileCheck className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                      <p className="text-sm text-emerald-700 font-medium mb-1">Đã kiểm tra định dạng và dữ liệu hợp lệ</p>
                      <p className="text-xs text-emerald-600 font-semibold bg-emerald-100 py-1 px-3 rounded-full inline-block">Tệp: {formData.fileName}</p>
                      <div className="mt-3">
                        <button 
                          onClick={() => { setUploadStatus('idle'); setFormData({...formData, fileName: ''}); }}
                          className="text-sm text-slate-500 hover:text-slate-700 underline"
                        >
                          Tải lên tệp khác
                        </button>
                      </div>
                    </div>
                  )}
                  {uploadStatus === 'error' && (
                    <div>
                      <XCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
                      <p className="text-sm text-red-700 font-medium mb-1">Định dạng không hợp lệ</p>
                      <p className="text-xs text-red-600">Vui lòng tải lên đúng định dạng (CSV, JSON, XML, XLSX)</p>
                      <div className="mt-3">
                        <button 
                          onClick={() => setUploadStatus('idle')}
                          className="text-sm text-slate-500 hover:text-slate-700 underline"
                        >
                          Thử lại
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Nhập mô tả chi tiết..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                <select
                  aria-label="Trạng thái"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (!formData.code || !formData.name) return;
                    const newItem: CategoryItem = {
                      id: data.length + 1,
                      code: formData.code,
                      name: formData.name,
                      description: formData.description,
                      status: formData.status,
                      publishStatus: 'unpublished',
                      approvalStatus: 'pending',
                      createdDate: new Date().toLocaleDateString('vi-VN'),
                      updatedBy: 'Người dùng hiện tại'
                    };
                    setData([...data, newItem]);
                    setSelectedItem(newItem);
                    setShowAddModal(false);
                    setShowApprovalModal(true);
                    setFormData({ code: '', name: '', description: '', status: 'active', keywords: '', licenseId: '', publisher: '', fileName: '' });
                    setUploadStatus('idle');
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${!formData.code || !formData.name
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  disabled={!formData.code || !formData.name}
                >
                  <FileCheck className="w-4 h-4" />
                  Trình duyệt
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ code: '', name: '', description: '', status: 'active', keywords: '', licenseId: '', publisher: '', fileName: '' });
                    setUploadStatus('idle');
                  }}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    if (!formData.code || !formData.name) return;
                    const newItem: CategoryItem = {
                      id: data.length + 1,
                      code: formData.code,
                      name: formData.name,
                      description: formData.description,
                      status: formData.status,
                      publishStatus: 'unpublished',
                      approvalStatus: 'draft',
                      createdDate: new Date().toLocaleDateString('vi-VN'),
                      updatedBy: 'Người dùng hiện tại'
                    };
                    setData([...data, newItem]);
                    setShowAddModal(false);
                    setFormData({ code: '', name: '', description: '', status: 'active', keywords: '', licenseId: '', publisher: '', fileName: '' });
                    setUploadStatus('idle');
                  }}
                  className={`px-4 py-2 rounded-lg ${!formData.code || !formData.name
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  disabled={!formData.code || !formData.name}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Publish Modal Placeholder */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-slate-900 mb-4">Xác nhận công bố</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mã</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nhập mã..."
                  value={selectedItem?.code}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tên</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nhập tên..."
                  value={selectedItem?.name}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Nhập mô tả..."
                  value={selectedItem?.description}
                  readOnly
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmPublish}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unpublish Modal Placeholder */}
      {showUnpublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-slate-900 mb-4">Xác nhận hủy công bố</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mã</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nhập mã..."
                  value={selectedItem?.code}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tên</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nhập tên..."
                  value={selectedItem?.name}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Nhập mô tả..."
                  value={selectedItem?.description}
                  readOnly
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUnpublishModal(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmUnpublish}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Chi tiết tệp dữ liệu mở</h3>
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedItem(null);
                }}
                className="text-slate-400 hover:text-slate-655 transition-colors p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Tab bar */}
            <div className="px-6 pt-4 pb-0 border-b border-slate-200">
              <div className="inline-flex items-center bg-slate-100 rounded-lg p-1 gap-1">
                <button
                  onClick={() => setDetailModalTab('general')}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[13px] font-medium transition-all cursor-pointer ${detailModalTab === 'general' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <FileText className={`w-3.5 h-3.5 ${detailModalTab === 'general' ? 'text-blue-600' : 'text-slate-400'}`} />
                  Thông tin chung
                </button>
                <button
                  onClick={() => setDetailModalTab('data')}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[13px] font-medium transition-all cursor-pointer ${detailModalTab === 'data' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Database className={`w-3.5 h-3.5 ${detailModalTab === 'data' ? 'text-blue-600' : 'text-slate-400'}`} />
                  Dữ liệu nguồn
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 flex-1 text-[13px]">
              {detailModalTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Tên tập dữ liệu</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedItem.fileName || selectedItem.name}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 outline-none text-slate-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Danh mục dữ liệu mở</label>
                  <input type="text" readOnly value={categoryName}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 outline-none text-slate-600 font-medium" />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giấy phép</label>
                  <input type="text" readOnly
                    value={selectedItem.licenseId?.toString().includes('ODC-BY') ? 'Giấy phép ODC-BY' : 'Giấy phép dữ liệu mở công cộng'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 outline-none text-slate-600 font-medium" />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Từ khóa</label>
                  <input type="text" readOnly value={selectedItem.keywords || '—'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 outline-none text-slate-600 font-medium" />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cơ quan công bố</label>
                  <input type="text" readOnly value={selectedItem.publisher || 'Bộ Tư pháp'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 outline-none text-slate-600 font-medium" />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Định dạng chia sẻ</label>
                  <div className="flex flex-wrap gap-2 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 min-h-[38px] items-center">
                    {(selectedItem.format && selectedItem.format.length > 0) ? selectedItem.format.map(f => (
                      <span key={f} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-medium">
                        {f === 'excel' ? 'Excel' : f === 'api' ? 'API' : f}
                      </span>
                    )) : <span className="text-slate-400 text-sm">—</span>}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tần suất cập nhật</label>
                  <input type="text" readOnly
                    value={selectedItem.frequency === 'daily' ? 'Hàng ngày' : selectedItem.frequency === 'weekly' ? 'Hàng tuần' : selectedItem.frequency === 'monthly' ? 'Hàng tháng' : selectedItem.frequency === 'quarterly' ? 'Hàng quý' : selectedItem.frequency === 'yearly' ? 'Hàng năm' : '—'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 outline-none text-slate-600 font-medium" />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Thông tin mô tả</label>
                  <textarea rows={2} readOnly value={selectedItem.description || '—'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 outline-none text-slate-600 font-medium" />
                </div>

              </div>
              )}

              {detailModalTab === 'data' && (() => {
                const catIdToCode: Record<string, string> = {
                  'open-data-category-a': 'ODC001',
                  'open-data-category-b': 'ODC002',
                  'open-data-category-c': 'ODC003',
                };
                const CATEGORY_DB_CONFIG: Record<string, { dbName: string; mainTable: string; joinTables: string[]; fields: string[] }> = {
                  ODC001: { dbName: 'CSDL Trợ giúp pháp lý', mainTable: 'to_chuc_tgpl', joinTables: ['vu_viec_tgpl'], fields: ['id', 'ten_to_chuc', 'loai_hinh', 'dia_chi', 'nguoi_dai_dien', 'so_dien_thoai', 'ngay_thanh_lap', 'trang_thai'] },
                  ODC002: { dbName: 'CSDL Trợ giúp pháp lý', mainTable: 'nguoi_tgpl', joinTables: ['chung_chi'], fields: ['id', 'ho_ten', 'so_nam_hanh_nghe', 'vai_tro', 'so_chung_chi', 'trang_thai'] },
                  ODC003: { dbName: 'CSDL Bổ trợ tư pháp', mainTable: 'luat_su', joinTables: ['doan_luat_su'], fields: ['id', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'quoc_tich', 'so_chung_chi_hn', 'so_the_luat_su', 'noi_lam_viec', 'doan_luat_su', 'tinh_trang_hn'] },
                };
                const SAMPLE_ROWS: Record<string, Record<string, string>[]> = {
                  ODC001: [
                    { id: '1', ten_to_chuc: 'Trung tâm TGPL TP. Hà Nội', loai_hinh: 'Nhà nước', dia_chi: '60 Trần Phú, Hà Nội', nguoi_dai_dien: 'Nguyễn Văn A', so_dien_thoai: '024.3845.xxxx', ngay_thanh_lap: '01/01/2015', trang_thai: 'Hoạt động' },
                    { id: '2', ten_to_chuc: 'VP Luật sư Thành Đô', loai_hinh: 'Hợp đồng', dia_chi: '12 Lý Thường Kiệt, HN', nguoi_dai_dien: 'Trần Thị B', so_dien_thoai: '024.3854.xxxx', ngay_thanh_lap: '05/03/2018', trang_thai: 'Hoạt động' },
                  ],
                  ODC002: [
                    { id: '1', ho_ten: 'Nguyễn Văn An', so_nam_hanh_nghe: '8', vai_tro: 'Trợ giúp viên', so_chung_chi: 'TGV-001/2016', trang_thai: 'Hoạt động' },
                    { id: '2', ho_ten: 'Lê Thị Bình', so_nam_hanh_nghe: '5', vai_tro: 'Luật sư cộng tác', so_chung_chi: 'LS-123/2019', trang_thai: 'Hoạt động' },
                  ],
                  ODC003: [
                    { id: '1', ho_ten: 'Lê Văn Long', ngay_sinh: '15/08/1985', gioi_tinh: 'Nam', quoc_tich: 'Việt Nam', so_chung_chi_hn: 'CC-9988-BTP', so_the_luat_su: 'THE-1234-LS', noi_lam_viec: 'VP Luật sư Long & Partners', doan_luat_su: 'TP. Hà Nội', tinh_trang_hn: 'Đang hoạt động' },
                    { id: '2', ho_ten: 'Phạm Thị Hoa', ngay_sinh: '22/04/1990', gioi_tinh: 'Nữ', quoc_tich: 'Việt Nam', so_chung_chi_hn: 'CC-5544-BTP', so_the_luat_su: 'THE-5678-LS', noi_lam_viec: 'Công ty Luật TNHH Sen Vàng', doan_luat_su: 'TP. HCM', tinh_trang_hn: 'Đang hoạt động' },
                  ],
                };
                const code = catIdToCode[categoryId] || '';
                const config = CATEGORY_DB_CONFIG[code];
                const rows = SAMPLE_ROWS[code] || [];
                if (!config) return (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                    <Database className="w-8 h-8" />
                    <p className="text-sm">Chưa có cấu hình nguồn dữ liệu</p>
                  </div>
                );
                return (
                  <div className="space-y-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[13px] space-y-1.5">
                      <div className="flex gap-2">
                        <span className="text-slate-500 w-28 shrink-0">Cơ sở dữ liệu:</span>
                        <span className="text-slate-800 font-medium">{config.dbName}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-slate-500 w-28 shrink-0">Bảng dữ liệu:</span>
                        <span className="text-slate-800">{[config.mainTable, ...config.joinTables].join(', ')}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-slate-500 w-28 shrink-0">Các trường:</span>
                        <span className="text-slate-800 break-all">{config.fields.join(', ')}</span>
                      </div>
                    </div>
                    {rows.length > 0 && (
                      <div className="overflow-x-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-[12px]">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              {config.fields.map(f => (
                                <th key={f} className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">{f}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {rows.map((row, i) => (
                              <tr key={i} className="hover:bg-slate-50">
                                {config.fields.map(f => (
                                  <td key={f} className="px-3 py-2 text-slate-700 whitespace-nowrap">{row[f] || '—'}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })()}

            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex gap-2">
                {/* Submit for approval - show when draft or rejected */}
                {(selectedItem.approvalStatus === 'draft' || selectedItem.approvalStatus === 'rejected') && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSubmitItems([selectedItem]);
                      setSubmitActiveTab('category');
                      setIsSubmitting(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5 text-sm font-semibold cursor-pointer transition-all active:scale-95 shadow-sm"
                  >
                    <FileCheck className="w-4 h-4" />
                    Gửi phê duyệt
                  </button>
                )}

                {/* Approve - show when pending (for leader) */}
                {selectedItem.approvalStatus === 'pending' && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSubmitItems([selectedItem!]);
                      setSubmitActiveTab('category');
                      setIsApproving(true);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1.5 text-sm font-semibold cursor-pointer transition-all active:scale-95 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Phê duyệt
                  </button>
                )}

                {/* Reject - show when pending (for leader) */}
                {selectedItem.approvalStatus === 'pending' && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowRejectModal(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1.5 text-sm font-semibold cursor-pointer transition-all active:scale-95 shadow-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    Từ chối
                  </button>
                )}

                {/* Publish - only when approved */}
                {selectedItem.approvalStatus === 'approved' && selectedItem.publishStatus === 'unpublished' && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowPublishFromModalModal(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1.5 text-sm font-semibold cursor-pointer transition-all active:scale-95 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Công khai
                  </button>
                )}

              </div>

              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Chỉnh sửa tệp dữ liệu mở</h3>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
                className="text-slate-400 hover:text-slate-655 transition-colors p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 flex-1 text-[13px]">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center gap-2 mb-4">
                <HistoryIcon className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs text-blue-800 font-medium">
                  Hệ thống đã tự động tạo nhánh phiên bản mới để bạn chỉnh sửa. Phiên bản gốc không bị ảnh hưởng cho đến khi phiên bản này được công bố.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Phiên bản hiện tại</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 font-semibold"
                    value="v1.3"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Phiên bản đang sửa</label>
                  <div className="flex w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-blue-700 gap-2 items-center h-[38px]">
                    <span className="font-semibold text-sm">v1.4</span>
                    <span className="px-2 py-0.5 text-[10px] bg-blue-100 border border-blue-200 rounded-full font-bold">Bản nháp mới</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Tên tập dữ liệu *</label>
                  <input
                    type="text"
                    value={editForm.fileName}
                    onChange={(e) => setEditForm({ ...editForm, fileName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 font-medium"
                    placeholder="Nhập tên tập dữ liệu..."
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Danh mục dữ liệu mở</label>
                  <input
                    type="text"
                    readOnly
                    value={categoryName}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giấy phép *</label>
                  <select
                    value={editForm.licenseId}
                    onChange={(e) => setEditForm({ ...editForm, licenseId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 font-medium"
                  >
                    <option value="Giấy phép dữ liệu mở công cộng">Giấy phép dữ liệu mở công cộng</option>
                    <option value="Giấy phép ODC-BY">Giấy phép ODC-BY</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Từ khóa</label>
                  <input
                    type="text"
                    value={editForm.keywords}
                    onChange={(e) => setEditForm({ ...editForm, keywords: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 font-medium"
                    placeholder="Ví dụ: luật, mở, trợ giúp..."
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cơ quan công bố</label>
                  <input
                    type="text"
                    value={editForm.publisher}
                    onChange={(e) => setEditForm({ ...editForm, publisher: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 font-medium"
                    placeholder="Ví dụ: Bộ Tư pháp..."
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Thông tin mô tả</label>
                  <textarea
                    rows={2}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 font-medium"
                    placeholder="Nhập thông tin mô tả chi tiết..."
                  />
                </div>

                {/* Upload Type Selector */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-2">Dạng tải dữ liệu</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold cursor-not-allowed ${
                        selectedItem.uploadType !== 'api'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      Tải lên tệp
                    </button>
                    <button
                      type="button"
                      disabled
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold cursor-not-allowed ${
                        selectedItem.uploadType === 'api'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      Lấy từ API
                    </button>
                  </div>
                </div>

                {selectedItem.uploadType === 'api' ? (
                  <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                        <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                          <Globe className="w-4.5 h-4.5 text-purple-600" />
                          <span>Chi tiết cấu hình API ({selectedItem.apiType === 'internal' ? 'Nội bộ' : 'Cơ quan nhà nước'}) <span className="text-[11px] font-normal text-slate-500 italic">(Không được phép sửa)</span></span>
                        </div>
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded text-xs font-semibold uppercase">{selectedItem.apiMethod || 'GET'}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                        <div className="col-span-1 md:col-span-2">
                          <label className="block font-semibold text-slate-500 mb-1">Tiêu đề API / Mã kết nối</label>
                          <input type="text" readOnly value={selectedItem.apiTitle || 'API Chia sẻ dữ liệu'} className="w-full px-3 py-2 border border-slate-350 rounded-lg text-sm bg-slate-100 outline-none text-slate-500 font-medium cursor-not-allowed" />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <label className="block font-semibold text-slate-500 mb-1">Đường dẫn dịch vụ chia sẻ (URL API)</label>
                          <input type="text" readOnly value={selectedItem.apiUrl || ''} className="w-full px-3 py-2 border border-slate-350 rounded-lg text-sm bg-slate-100 outline-none font-mono text-slate-500 cursor-not-allowed" />
                        </div>
                        {selectedItem.apiDesc && (
                          <div className="col-span-1 md:col-span-2">
                            <label className="block font-semibold text-slate-500 mb-1">Mô tả chi tiết API</label>
                            <textarea rows={2} readOnly value={selectedItem.apiDesc} className="w-full px-3 py-2 border border-slate-350 rounded-lg text-sm bg-slate-100 outline-none text-slate-500 font-medium cursor-not-allowed" />
                          </div>
                        )}
                        {selectedItem.apiType === 'external' && (
                          <>
                            <div>
                              <label className="block font-semibold text-slate-500 mb-1">Tham số (Query Params)</label>
                              <input type="text" readOnly value={selectedItem.apiParams || ''} className="w-full px-3 py-2 border border-slate-355 rounded-lg text-sm bg-slate-100 outline-none font-mono text-slate-500 cursor-not-allowed" />
                            </div>
                            <div>
                              <label className="block font-semibold text-slate-500 mb-1">Headers</label>
                              <input type="text" readOnly value={selectedItem.apiHeaders || ''} className="w-full px-3 py-2 border border-slate-355 rounded-lg text-sm bg-slate-100 outline-none font-mono text-slate-500 cursor-not-allowed" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* FILE DETAIL BOX */}
                    <div className="col-span-1 md:col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Cấu trúc Metadata yêu cầu</h4>
                          <p className="text-xs text-slate-600 mb-2">Tệp dữ liệu tải lên bắt buộc phải chứa các cột tiêu đề ở dòng đầu tiên:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {getExpectedHeaders().map((hdr, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-medium">{hdr}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FILE DISPLAY SECTION */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Tệp dữ liệu đã tải lên <span className="text-[11px] font-normal text-slate-500 italic">(Không được phép thay thế)</span></label>
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FileSpreadsheet className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 truncate max-w-md">{selectedItem.fileName || selectedItem.name}</div>
                            <div className="text-xs text-slate-500">154.0 KB</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex gap-2">
                {/* Submit for approval button */}
                <button
                  onClick={() => {
                    setData(data.map(item => 
                      item.id === selectedItem.id 
                        ? { 
                            ...item, 
                            name: editForm.name || item.name,
                            fileName: editForm.fileName,
                            licenseId: editForm.licenseId,
                            keywords: editForm.keywords,
                            publisher: editForm.publisher,
                            description: editForm.description,
                            approvalStatus: 'pending' as const
                          }
                        : item
                    ));
                    setShowEditModal(false);
                    alert('Đã gửi yêu cầu trình duyệt thành công!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-semibold transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  Trình duyệt
                </button>

                {/* Publish button - only enabled if approved */}
                <button
                  onClick={() => {
                    if (selectedItem.approvalStatus !== 'approved') {
                      alert('Chỉ dữ liệu đã phê duyệt mới được công khai!');
                      return;
                    }
                    setShowEditModal(false);
                    setShowPublishFromModalModal(true);
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all active:scale-95 shadow-sm ${selectedItem.approvalStatus === 'approved'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  disabled={selectedItem.approvalStatus !== 'approved'}
                  title={selectedItem.approvalStatus !== 'approved' ? 'Chỉ dữ liệu đã phê duyệt mới được công khai' : 'Công khai'}
                >
                  <CheckCircle className="w-4 h-4" />
                  Công khai
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-semibold transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bulk Publish Modal */}
      {showBulkPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-slate-900 mb-4">Xác nhận công bố hàng loạt</h2>
            <p className="text-slate-600 mb-6">
              Bạn có chắc chắn muốn công bố <strong>{selectedIds.size}</strong> mục đã chọn?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowBulkPublishModal(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleBulkPublish}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Xác nhận công bố
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Unpublish Modal */}
      {showBulkUnpublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-slate-900 mb-4">Xác nhận hủy công bố hàng loạt</h2>
            <p className="text-slate-600 mb-6">
              Bạn có chắc chắn muốn hủy công bố <strong>{selectedIds.size}</strong> mục đã chọn?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowBulkUnpublishModal(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleBulkUnpublish}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xác nhận hủy công bố
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Approval Modal */}
      {showBulkApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-slate-900 mb-4">Xác nhận phê duyệt hàng loạt</h2>
            <p className="text-slate-600 mb-6">
              Bạn có chắc chắn muốn phê duyệt <strong>{selectedIds.size}</strong> mục đã chọn?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowBulkApprovalModal(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleBulkApproval}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Xác nhận phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Publish from Modal Modal */}
      {showPublishFromModalModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-slate-900 mb-4">Xác nhận công khai</h2>
            <div className="space-y-3 mb-6">
              {selectedItem.approvalStatus !== 'approved' ? (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <p className="text-sm text-red-700">
                    ⚠️ Dữ liệu chưa được phê duyệt. Chỉ dữ liệu đã phê duyệt mới được công khai.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-slate-600">
                    Bạn có chắc chắn muốn công khai dữ liệu sau?
                  </p>
                  <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                    <div>
                      <span className="text-xs text-slate-600">Mã:</span>
                      <p className="text-sm text-slate-900">{selectedItem.code}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-600">Tên:</span>
                      <p className="text-sm text-slate-900">{selectedItem.name}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-600">Trạng thái phê duyệt:</span>
                      <p className="text-sm">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 border border-green-200 rounded-full">
                          Đã phê duyệt
                        </span>
                      </p>
                    </div>
                    {selectedItem.licenseId && (
                      <div>
                        <span className="text-xs text-slate-600">Giấy phép:</span>
                        <p className="text-sm text-slate-900">{sampleLicenses.find(l => l.id.toString() === selectedItem.licenseId)?.name || 'Đã thiết lập'}</p>
                      </div>
                    )}
                    {selectedItem.keywords && (
                      <div>
                        <span className="text-xs text-slate-600">Metadata (Từ khóa):</span>
                        <p className="text-sm text-slate-900">{selectedItem.keywords}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPublishFromModalModal(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                {selectedItem.approvalStatus !== 'approved' ? 'Đóng' : 'Hủy'}
              </button>
              {selectedItem.approvalStatus === 'approved' && (
                <button
                  onClick={() => {
                    if (selectedItem) {
                      setData(data.map(item =>
                        item.id === selectedItem.id
                          ? { ...item, publishStatus: 'published' as const }
                          : item
                      ));
                    }
                    setShowPublishFromModalModal(false);
                    setSelectedItem(null);
                    alert('Đã công khai dữ liệu thành công!');
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Xác nhận công khai
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-slate-900 mb-4">Phê duyệt</h2>
            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                <div>
                  <span className="text-xs text-slate-600">Mã:</span>
                  <p className="text-sm text-slate-900">{selectedItem.code}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-600">Tên:</span>
                  <p className="text-sm text-slate-900">{selectedItem.name}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-600">Trạng thái:</span>
                  <p className="text-sm">
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full">
                      Chờ phê duyệt
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-blue-200">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-900 text-sm">Thông tin thiết lập từ Danh mục gốc ({categoryName})</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Giấy phép áp dụng:</span>
                    <div className="bg-white px-3 py-2 border border-slate-200 rounded text-sm text-slate-700">
                      Giấy phép dữ liệu mở công cộng (Kế thừa)
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Metadata chuẩn:</span>
                    <div className="bg-white px-3 py-2 border border-slate-200 rounded text-sm text-slate-700">
                      dữ liệu, {categoryName.toLowerCase()}, bộ tư pháp
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Nội dung phê duyệt
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={4}
                  placeholder="Nhập nội dung phê duyệt (không bắt buộc)..."
                  value={approvalNote}
                  aria-label="Nội dung phê duyệt"
                  title="Nội dung phê duyệt"
                  onChange={(e) => setApprovalNote(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalNote('');
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (selectedItem) {
                    setData(data.map(item =>
                      item.id === selectedItem.id
                        ? { ...item, approvalStatus: 'approved' as const }
                        : item
                    ));
                    alert(`Đã phê duyệt thành công!${approvalNote ? '\nNội dung: ' + approvalNote : ''}`);
                  }
                  setShowApprovalModal(false);
                  setApprovalNote('');
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Xác nhận phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-slate-900 mb-4">Từ chối phê duyệt</h2>
            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                <div>
                  <span className="text-xs text-slate-600">Mã:</span>
                  <p className="text-sm text-slate-900">{selectedItem.code}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-600">Tên:</span>
                  <p className="text-sm text-slate-900">{selectedItem.name}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                  placeholder="Nhập lý do từ chối phê duyệt..."
                  value={rejectReason}
                  aria-label="Lý do từ chối"
                  title="Lý do từ chối"
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!rejectReason.trim()) {
                    alert('Vui lòng nhập lý do từ chối!');
                    return;
                  }
                  if (selectedItem) {
                    setData(data.map(item =>
                      item.id === selectedItem.id
                        ? { ...item, approvalStatus: 'rejected' as const }
                        : item
                    ));
                  }
                  setShowRejectModal(false);
                  setRejectReason('');
                  setSelectedItem(null);
                  alert(`Đã từ chối phê duyệt.\nLý do: ${rejectReason}`);
                }}
                className={`px-4 py-2 rounded-lg ${!rejectReason.trim()
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                disabled={!rejectReason.trim()}
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Custom Lịch sử phiên bản Modal (Ảnh 1) */}
      {showVersionHistoryModal && selectedDatasetForVersionHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <HistoryIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#020817]">Lịch sử phiên bản</h3>
                  <p className="text-[13px] text-slate-500 font-medium mt-0.5">
                    {selectedDatasetForVersionHistory.uploadType === 'api' ? 'API' : 'Tệp dữ liệu'}: <span className="text-slate-800 font-semibold">{selectedDatasetForVersionHistory.fileName || selectedDatasetForVersionHistory.name}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowVersionHistoryModal(false);
                  setSelectedDatasetForVersionHistory(null);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse text-[13px] version-modal-table">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 text-[13px] uppercase font-semibold tracking-wider">
                    <th className="px-6 py-3.5 font-semibold text-left">Tên tệp dữ liệu</th>
                    <th className="px-6 py-3.5 font-semibold text-center w-28">Phiên bản</th>
                    <th className="px-6 py-3.5 font-semibold text-left w-44">Người cập nhật</th>
                    <th className="px-6 py-3.5 font-semibold text-left w-52">Ngày phát hành</th>
                    <th className="px-6 py-3.5 font-semibold text-left">Ghi chú thay đổi</th>
                    <th className="px-6 py-3.5 font-semibold text-center w-36">Trạng thái</th>
                    <th className="px-6 py-3.5 font-semibold text-center w-48">So sánh phiên bản</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px]">
                  {[
                    {
                      version: 'v1.2',
                      updatedBy: selectedDatasetForVersionHistory.updatedBy || 'Admin Hệ thống',
                      updatedDate: '04/05/2026 08:00:00',
                      changes: selectedDatasetForVersionHistory.uploadType === 'api'
                        ? 'Cập nhật URL kết nối cổng thông tin và cấu hình thêm tham số header'
                        : 'Cập nhật định dạng ngày sinh ISO 8601 và sửa tiêu đề cột địa chỉ',
                      status: 'Kích hoạt'
                    },
                    {
                      version: 'v1.1',
                      updatedBy: 'Trần Thị Bình',
                      updatedDate: '10/03/2026 10:30:00',
                      changes: 'Tối ưu hóa các cột dữ liệu rỗng và chuẩn hóa dữ liệu cũ',
                      status: 'Lưu trữ'
                    },
                    {
                      version: 'v1.0',
                      updatedBy: 'Hệ thống tự động',
                      updatedDate: '15/01/2026 15:45:00',
                      changes: 'Khởi tạo cấu hình ban đầu từ danh mục BTP',
                      status: 'Lưu trữ'
                    }
                  ].map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-900 font-semibold">
                        {selectedDatasetForVersionHistory.fileName || selectedDatasetForVersionHistory.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-[6px] text-[13px] font-semibold">
                          {v.version}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{v.updatedBy}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{v.updatedDate}</td>
                      <td className="px-6 py-4 text-slate-600 leading-relaxed font-normal">{v.changes}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[13px] font-semibold ${
                          v.status === 'Kích hoạt'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedVersionToCompare(v);
                            setShowVersionHistoryModal(false);
                            setShowVersionComparisonModal(true);
                          }}
                          className="px-3 py-1.5 bg-white border border-[#e2e8f0] hover:bg-slate-50 text-[#020817] rounded-lg text-[13px] transition-all cursor-pointer active:scale-95 shadow-sm"
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => {
                  setShowVersionHistoryModal(false);
                  setSelectedDatasetForVersionHistory(null);
                }}
                className="px-4 py-2 bg-white border border-[#e2e8f0] text-[#020817] rounded-lg text-[13px] hover:bg-slate-50 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom So sánh cấu trúc phiên bản Modal (Ảnh 2) */}
      {showVersionComparisonModal && selectedDatasetForVersionHistory && selectedVersionToCompare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <HistoryIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#020817]">
                    {selectedDatasetForVersionHistory.uploadType === 'api' 
                      ? 'So sánh cấu trúc phiên bản API' 
                      : 'So sánh cấu trúc phiên bản tệp dữ liệu'}
                  </h3>
                  <p className="text-[13px] text-slate-500 font-medium mt-0.5">
                    {selectedDatasetForVersionHistory.uploadType === 'api' ? 'Dịch vụ' : 'Tệp dữ liệu'}: <span className="text-slate-800 font-semibold">{selectedDatasetForVersionHistory.fileName || selectedDatasetForVersionHistory.name}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowVersionComparisonModal(false);
                  setSelectedVersionToCompare(null);
                  setSelectedDatasetForVersionHistory(null);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-[13px]">
              {/* Compare Card Info */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-3">
                <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">
                  {selectedDatasetForVersionHistory.uploadType === 'api' ? 'API được so sánh' : 'Tệp dữ liệu được so sánh'}
                </div>
                <div className="text-[13px] font-bold text-slate-900">
                  {selectedDatasetForVersionHistory.fileName || selectedDatasetForVersionHistory.name}
                </div>
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm font-medium">
                  <div className="flex flex-col items-center">
                    <span className="text-[13px] text-slate-400 font-bold uppercase">Phiên bản cũ</span>
                    <span className="text-[13px] font-bold text-slate-600 mt-0.5">v1.1</span>
                  </div>
                  <span className="text-slate-300 font-light">→</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[13px] text-slate-400 font-bold uppercase">Phiên bản mới</span>
                    <span className="text-[13px] font-bold text-blue-600 mt-0.5">{selectedVersionToCompare.version}</span>
                  </div>
                </div>
              </div>

              {/* Struct Comparison Table */}
              <div className="border border-slate-250 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-[13px] version-modal-table">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[13px] font-semibold text-slate-700">
                      <th colSpan={2} className="px-4 py-3 border-r border-slate-200 w-1/2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">PHIÊN BẢN CŨ (v1.1)</span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[13px] font-bold">Trước cập nhật</span>
                        </div>
                      </th>
                      <th colSpan={2} className="px-4 py-3 w-1/2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-900">PHIÊN BẢN MỚI ({selectedVersionToCompare.version})</span>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[13px] font-bold">Sau cập nhật</span>
                        </div>
                      </th>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-100/50 text-[13px] text-slate-500 font-bold uppercase">
                      <th className="px-4 py-2 border-r border-slate-200">Trường thuộc tính</th>
                      <th className="px-4 py-2 border-r border-slate-250">Kiểu dữ liệu</th>
                      <th className="px-4 py-2 border-r border-slate-200">Trường thuộc tính</th>
                      <th className="px-4 py-2">Kiểu dữ liệu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 font-medium">
                    {selectedDatasetForVersionHistory.uploadType === 'api' ? (
                      <>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">ho_ten</td>
                          <td className="px-4 py-2.5 border-r border-slate-250 text-slate-600">string</td>
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">ho_ten</td>
                          <td className="px-4 py-2.5 text-slate-600">string</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 bg-amber-50/30">
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">ngay_thang_nam_sinh</td>
                          <td className="px-4 py-2.5 border-r border-slate-250 text-slate-600 bg-amber-50/50">string (DD/MM/YYYY)</td>
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">ngay_thang_nam_sinh</td>
                          <td className="px-4 py-2.5 text-blue-700 bg-blue-50/30 font-semibold">string (YYYY-MM-DD)</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">so_dinh_danh_can_nhan</td>
                          <td className="px-4 py-2.5 border-r border-slate-250 text-slate-600">string (12 số)</td>
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">so_dinh_danh_can_nhan</td>
                          <td className="px-4 py-2.5 text-slate-600">string (12 số)</td>
                        </tr>
                      </>
                    ) : selectedDatasetForVersionHistory.fileName?.includes('to_chuc') ? (
                      <>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">Ten_to_chuc</td>
                          <td className="px-4 py-2.5 border-r border-slate-250 text-slate-600">text</td>
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">Ten_to_chuc</td>
                          <td className="px-4 py-2.5 text-slate-600">text</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">Nguoi_dai_dien</td>
                          <td className="px-4 py-2.5 border-r border-slate-250 text-slate-600">text</td>
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">Nguoi_dai_dien</td>
                          <td className="px-4 py-2.5 text-slate-600">text</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 bg-amber-50/30">
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">Dia_chi</td>
                          <td className="px-4 py-2.5 border-r border-slate-250 text-slate-600 bg-amber-50/50">text</td>
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">Dia_chi_lien_he</td>
                          <td className="px-4 py-2.5 text-blue-700 bg-blue-50/30 font-semibold">text (Cập nhật tiêu đề trường)</td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">Ho_va_ten</td>
                          <td className="px-4 py-2.5 border-r border-slate-250 text-slate-600">text</td>
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">Ho_va_ten</td>
                          <td className="px-4 py-2.5 text-slate-600">text</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 bg-amber-50/30">
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">Ngay_sinh</td>
                          <td className="px-4 py-2.5 border-r border-slate-250 text-slate-600 bg-amber-50/50">date (DD/MM/YYYY)</td>
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">Ngay_sinh</td>
                          <td className="px-4 py-2.5 text-blue-700 bg-blue-50/30 font-semibold">date (YYYY-MM-DD)</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">Gioi_tinh</td>
                          <td className="px-4 py-2.5 border-r border-slate-250 text-slate-600">text</td>
                          <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-800 font-bold">Gioi_tinh</td>
                          <td className="px-4 py-2.5 text-slate-600">text</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Actions (Khôi phục, Tải về, Quay lại, Đóng) */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    alert(`Khôi phục dữ liệu về phiên bản ${selectedVersionToCompare.version} thành công!`);
                    setShowVersionComparisonModal(false);
                  }}
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[13px] transition-all active:scale-95 shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  Khôi phục phiên bản
                </button>
                <button
                  onClick={() => {
                    alert(`Đã tải xuống thành công tệp dữ liệu phiên bản ${selectedVersionToCompare.version}!`);
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] transition-all active:scale-95 shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Tải về
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowVersionComparisonModal(false);
                    setSelectedVersionToCompare(null);
                    setShowVersionHistoryModal(true);
                  }}
                  className="px-4 py-2.5 bg-white border border-[#e2e8f0] text-[#020817] hover:bg-slate-50 rounded-lg text-[13px] transition-all active:scale-95 shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
                <button
                  onClick={() => {
                    setShowVersionComparisonModal(false);
                    setSelectedVersionToCompare(null);
                    setSelectedDatasetForVersionHistory(null);
                  }}
                  className="px-4 py-2.5 bg-white border border-[#e2e8f0] text-[#020817] hover:bg-slate-50 rounded-lg text-[13px] transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}