import { useState, useEffect } from 'react';
import { Plus, Upload, FileText, Info, CheckCircle, XCircle, Eye, FileCheck, Shield, History as HistoryIcon, File, RotateCcw, ArrowLeft, X, Globe, FileSpreadsheet, Database, Download, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { FilesTab } from './components/tabs/FilesTab';
import {
  Badge, TruncatedText, RowIconAction, Pagination, tabClass,
  BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON,
  INPUT_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE,
  normalizeSearch
} from '../collection/collectionUi';

// --- Lớp giao diện dùng chung trong file (compomennt.md 5.3, 5.4) ---
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const TR = 'group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const TABLE_WRAP = 'bg-white rounded-lg border border-[#E2E8F0] overflow-hidden';
const TABLE_CLS = 'w-full border-collapse collection-table text-[13px]';
const STICKY_TH = 'sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]';
const STICKY_TD = 'sticky right-0 bg-white group-hover:bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]';
const CHECKBOX_CLS = 'w-4 h-4 accent-blue-600 rounded cursor-pointer align-middle';
const MODAL_OVERLAY = 'fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200';
const MODAL_BOX = 'bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden';
const MODAL_HEADER = 'px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0';
const MODAL_TITLE = 'text-[16px] font-medium text-[#020817]';
const MODAL_SUBTITLE = 'text-[13px] text-[#64748B]';
const MODAL_BODY = 'px-6 py-4 overflow-y-auto custom-scrollbar flex-1';
const MODAL_FOOTER = 'px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 shrink-0';
const MODAL_FOOTER_SPLIT = 'px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3 shrink-0';
const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600';
const READONLY_INPUT = `${INPUT_CLS} !bg-[#F0F0F0] !text-[#64748B] cursor-not-allowed`;
const READONLY_TEXTAREA = `${TEXTAREA_CLS} !bg-[#F0F0F0] !text-[#64748B] cursor-not-allowed`;
const GROUP_CARD = 'rounded-2xl border border-[#E2E8F0] p-4';
const INFO_BANNER = 'bg-[#EAF3FF] border border-[#BFDBFE] rounded-lg p-3 flex items-start gap-2 text-[13px] text-[#020817]';
const ERROR_BANNER = 'bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg p-3 flex items-start gap-2 text-[13px] text-[#020817]';
const HELP_TEXT = 'text-[12px] text-[#64748B]';

// Bảng so sánh cấu trúc: vạch ngăn cột, ô cũ/mới có thay đổi
const CMP_SEP = 'border-r border-[#E2E8F0]';
const CMP_OLD = 'bg-[#FFF7ED]';
const CMP_NEW = 'bg-[#EAF3FF] text-[#155DFC]';

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
  const [sourceDataPage, setSourceDataPage] = useState(1);
  const sourceDataPageSize = 10;
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

  useEffect(() => {
    setSourceDataPage(1);
  }, [selectedItem, detailModalTab]);

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
      toast.success('Hệ thống đã lưu thành công nhánh phiên bản mới đang chỉnh sửa (v1.4). Các thay đổi này cần được phê duyệt trước khi công bố!');
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



  // searchTerm/statusFilter/ngày tạo là giá trị ĐÃ ÁP DỤNG (FilesTab chỉ đẩy lên khi bấm Tìm kiếm / Enter)
  const filteredData = data.filter(item => {
    const q = normalizeSearch(searchTerm);
    const matchesSearch =
      normalizeSearch(item.name).includes(q) ||
      normalizeSearch(item.code).includes(q) ||
      (!!item.fileName && normalizeSearch(item.fileName).includes(q));

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

  // Phân trang chuẩn (compomennt.md 5.14)
  const renderPagination = (total: number) => {
    if (total <= 0) return null;
    return (
      <Pagination
        className="border-t border-[#E2E8F0]"
        currentPage={currentPage}
        totalItems={total}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
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

  const closeIconBtn = (onClick: () => void, label = 'Đóng') => (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={BTN_GHOST_ICON}>
      <X className="w-5 h-5" />
    </button>
  );

  const resetAddForm = () => {
    setFormData({ code: '', name: '', description: '', status: 'active', keywords: '', licenseId: '', publisher: '', fileName: '' });
    setUploadStatus('idle');
  };

  const addRequiredField = (input: HTMLInputElement | null) => {
    const val = input?.value.trim();
    if (input && val) {
      if (!tempRequiredFields.includes(val)) {
        setTempRequiredFields([...tempRequiredFields, val]);
      }
      input.value = '';
    }
  };

  return (
    <>
    {(isSubmitting || isApproving) && (
      <div className={MODAL_OVERLAY}>
        <div className={`${MODAL_BOX} max-w-6xl h-[90vh]`}>
        {/* Tab (compomennt.md 5.9) */}
        <div className="px-6 border-b border-[#E2E8F0] flex items-center shrink-0">
          <button type="button" onClick={() => setSubmitActiveTab('category')} className={tabClass(submitActiveTab === 'category')}>
             <FileText className="w-4 h-4" />
             Thông tin danh mục
          </button>
          <button type="button" onClick={() => setSubmitActiveTab('metadata')} className={tabClass(submitActiveTab === 'metadata')}>
             <File className="w-4 h-4" />
             Thông tin Metadata
          </button>
          <button type="button" onClick={() => setSubmitActiveTab('license')} className={tabClass(submitActiveTab === 'license')}>
             <Shield className="w-4 h-4" />
             Thông tin giấy phép
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#F8FAFC]">
          {submitActiveTab === 'category' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] max-w-6xl mx-auto overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E2E8F0]">
                <h2 className={MODAL_TITLE}>{isApproving ? "Danh sách danh mục đang chờ phê duyệt" : "Danh sách danh mục cần phê duyệt"}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className={TABLE_CLS}>
                  <thead className="bg-[#F8FAFC]">
                    <tr className="h-[42px]">
                      <th className={`${TH} text-center w-12`}><input type="checkbox" aria-label="Chọn tất cả" title="Chọn tất cả" checked={true} readOnly className={CHECKBOX_CLS} /></th>
                      <th className={`${TH} text-center w-14`}>STT</th>
                      <th className={`${TH} text-left`}>Mã</th>
                      <th className={`${TH} text-left`}>Tên</th>
                      <th className={`${TH} text-left`}>Trạng thái</th>
                      <th className={`${TH} text-left`}>Phê duyệt</th>
                      <th className={`${TH} text-left`}>Công khai</th>
                      <th className={`${TH} text-left`}>Ngày tạo</th>
                      <th className={`${TH} text-left`}>Người cập nhật</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submitItems.map((item, index) => (
                      <tr key={item.id} className={TR}>
                        <td className={`${TD} text-center`}><input type="checkbox" aria-label={`Chọn mục ${item.name}`} title={`Chọn mục ${item.name}`} checked={true} readOnly className={CHECKBOX_CLS} /></td>
                        <td className={`${TD} text-center`}>{index + 1}</td>
                        <td className={`${TD} whitespace-nowrap`}>{item.code}</td>
                        <td className={`${TD} max-w-[360px]`}><TruncatedText text={item.name} /></td>
                        <td className={TD}>
                          {item.status === 'active' ? (
                            <Badge label="Hoạt động" variant="green" />
                          ) : (
                            <Badge label="Không hoạt động" variant="slate" />
                          )}
                        </td>
                        <td className={TD}>
                          <Badge label="Nháp" variant="slate" />
                        </td>
                        <td className={TD}>
                          <Badge label="Chưa công khai" variant="slate" />
                        </td>
                        <td className={`${TD} whitespace-nowrap`}>{item.createdDate}</td>
                        <td className={`${TD} max-w-[200px]`}><TruncatedText text={item.updatedBy} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-[#E2E8F0]">
                {isSubmitting ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={LABEL_CLS}>Người nhận trình duyệt (Người phê duyệt) <span className={REQUIRED_MARK}>*</span></label>
                      <select
                        className={INPUT_CLS}
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
                      <label className={LABEL_CLS}>Nội dung trình duyệt</label>
                      <textarea
                        className={TEXTAREA_CLS}
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
                      <label className={LABEL_CLS}>Nội dung trình duyệt từ Cán bộ</label>
                      <div className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-[#F1F5F9] text-[13px] text-[#475569] min-h-[5rem]">
                        Kính trình lãnh đạo xem xét cấp phép công bố bộ dữ liệu mới phục vụ hệ thống mở bộ tư pháp.
                      </div>
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Nội dung phê duyệt / Lý do từ chối</label>
                      <textarea
                        className={TEXTAREA_CLS}
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
            <div className="bg-white rounded-2xl max-w-4xl border border-[#E2E8F0] mx-auto">
              <div className="px-4 py-3 border-b border-[#E2E8F0]">
                <h2 className={MODAL_TITLE}>Metadata</h2>
                <p className={`${MODAL_SUBTITLE} mt-0.5`}>Quản lý thông tương metadata cho dữ liệu mở, bao gồm giấy phép, định dạng và nguồn dữ liệu.</p>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className={LABEL_CLS}>Danh mục <span className={REQUIRED_MARK}>*</span></label>
                  <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg max-h-48 overflow-y-auto custom-scrollbar space-y-3">
                    <div>
                      <div className="text-[13px] font-medium mb-1 text-[#020817]">Tư pháp</div>
                      <label className="flex items-center gap-2 text-[13px] text-[#334155] ml-2">
                        <input type="checkbox" aria-label="Danh mục tư pháp" title="Danh mục tư pháp" checked={true} readOnly className={CHECKBOX_CLS} />
                        CAT001 - Văn bản pháp luật
                      </label>
                    </div>
                    <div>
                      <div className="text-[13px] font-medium mb-1 text-[#020817]">Hộ tịch</div>
                      <label className="flex items-center gap-2 text-[13px] text-[#334155] ml-2">
                        <input type="checkbox" aria-label="Danh mục hộ tịch" title="Danh mục hộ tịch" readOnly className={CHECKBOX_CLS} />
                        CAT002 - Hộ tịch
                      </label>
                    </div>
                  </div>
                  <p className={`${HELP_TEXT} mt-1`}>Chọn một hoặc nhiều danh mục cho Metadata này.</p>
                </div>

                <div>
                  <label className={LABEL_CLS}>Tên tệp dữ liệu <span className={REQUIRED_MARK}>*</span></label>
                  <input type="text" aria-label="Tên tệp dữ liệu" title="Tên tệp dữ liệu" className={INPUT_CLS} defaultValue={`${categoryName}.xlsx`} />
                </div>

                <div>
                  <label className={LABEL_CLS}>Mô tả <span className={REQUIRED_MARK}>*</span></label>
                  <textarea rows={3} aria-label="Mô tả metadata" title="Mô tả metadata" className={TEXTAREA_CLS} defaultValue={`Metadata cho dữ liệu mở ${categoryName}`}></textarea>
                </div>

                <div>
                  <label className={LABEL_CLS}>Từ khóa</label>
                  <input type="text" aria-label="Từ khóa metadata" title="Từ khóa metadata" className={INPUT_CLS} defaultValue="luật, mở, thống kê" />
                </div>

                <div>
                  <label className={LABEL_CLS}>Giấy phép <span className={REQUIRED_MARK}>*</span></label>
                  <select aria-label="Giấy phép metadata" title="Giấy phép metadata" className={INPUT_CLS}>
                    <option>Giấy phép dữ liệu mở công cộng</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Định dạng</label>
                  <div className="flex flex-wrap gap-4 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                    {['CSV', 'JSON', 'XML', 'Excel', 'PDF'].map((fmt) => (
                      <label key={fmt} className="flex items-center gap-1.5 text-[13px] text-[#020817] cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={fmt === 'CSV'}
                          className={CHECKBOX_CLS}
                        />
                        {fmt}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_CLS}>Nguồn dữ liệu</label>
                    <input type="text" aria-label="Nguồn dữ liệu" title="Nguồn dữ liệu" className={INPUT_CLS} defaultValue="API nội bộ" />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Tần suất cập nhật</label>
                    <select aria-label="Tần suất cập nhật" title="Tần suất cập nhật" className={INPUT_CLS}>
                      <option>Hàng tháng</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={LABEL_CLS}>
                    Cấu hình trường bắt buộc trong file dữ liệu tải lên
                  </label>
                  <div className="space-y-3 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="new-required-field-category-input"
                        title="Tên trường bắt buộc"
                        placeholder="Nhập tên trường bắt buộc (ví dụ: MaHS, HoTen...)"
                        className={`${INPUT_CLS} flex-1`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addRequiredField(e.currentTarget);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addRequiredField(document.getElementById('new-required-field-category-input') as HTMLInputElement);
                        }}
                        className={BTN_PRIMARY}
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
                            className="inline-flex items-center gap-1 h-[26px] pl-2 pr-1 bg-[#FEF2F2] text-[#B91C1C] rounded-2xl text-[13px] border border-[#FEE2E2]"
                          >
                            {field}
                            <button
                              type="button"
                              onClick={() => {
                                setTempRequiredFields(tempRequiredFields.filter((f) => f !== field));
                              }}
                              className="p-0.5 hover:bg-[#FEE2E2] rounded-full text-[#DC2626] transition-colors cursor-pointer"
                              title="Xóa trường"
                              aria-label="Xóa trường"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-[13px] text-[#64748B]">Chưa cấu hình trường bắt buộc nào</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {submitActiveTab === 'license' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] max-w-4xl mx-auto">
              <div className="px-4 py-3 border-b border-[#E2E8F0]">
                <h2 className={MODAL_TITLE}>Chỉnh sửa giấy phép</h2>
                <p className={`${MODAL_SUBTITLE} mt-0.5`}>Quản lý giấy phép chuẩn, điều kiện sử dụng và liên kết tham chiếu.</p>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className={LABEL_CLS}>Tên giấy phép <span className={REQUIRED_MARK}>*</span></label>
                  <input type="text" aria-label="Tên giấy phép" title="Tên giấy phép" className={INPUT_CLS} defaultValue="Giấy phép dữ liệu mở công cộng" />
                </div>
                <div>
                  <label className={LABEL_CLS}>Mô tả <span className={REQUIRED_MARK}>*</span></label>
                  <textarea rows={3} aria-label="Mô tả giấy phép" title="Mô tả giấy phép" className={TEXTAREA_CLS} defaultValue="Cho phép sử dụng và phân phối dữ liệu mở."></textarea>
                </div>
                <div>
                  <label className={LABEL_CLS}>Điều kiện sử dụng <span className={REQUIRED_MARK}>*</span></label>
                  <textarea rows={3} aria-label="Điều kiện sử dụng" title="Điều kiện sử dụng" className={TEXTAREA_CLS} defaultValue="Ghi nguồn là bắt buộc."></textarea>
                </div>
                <div>
                  <label className={LABEL_CLS}>Liên kết tham chiếu <span className={REQUIRED_MARK}>*</span></label>
                  <input type="text" aria-label="Liên kết tham chiếu" title="Liên kết tham chiếu" className={INPUT_CLS} defaultValue="https://example.com/license/cc0" />
                </div>
                <div>
                  <label className={LABEL_CLS}>Trạng thái</label>
                  <select aria-label="Trạng thái giấy phép" title="Trạng thái giấy phép" className={INPUT_CLS}>
                    <option>Còn hiệu lực</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={MODAL_FOOTER}>
            <button
              type="button"
              onClick={() => {
                setIsSubmitting(false);
                setIsApproving(false);
              }}
              className={BTN_OUTLINE}
            >
              Hủy
            </button>
            {isSubmitting ? (
              <button
                type="button"
                onClick={() => {
                  if (submitItems.length > 0) {
                    const updatedIds = submitItems.map(i => i.id);
                    setData(data.map(item => updatedIds.includes(item.id) ? { ...item, approvalStatus: 'pending' as const } : item));
                    toast.success('Đã gửi yêu cầu trình duyệt thành công!');
                  }
                  setIsSubmitting(false);
                  setSelectedIds(new Set());
                }}
                className={BTN_PRIMARY}
              >
                Gửi phê duyệt
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (submitItems.length > 0) {
                      const updatedIds = submitItems.map(i => i.id);
                      setData(data.map(item => updatedIds.includes(item.id) ? { ...item, approvalStatus: 'rejected' as const } : item));
                      toast.success('Đã từ chối danh mục!');
                    }
                    setIsApproving(false);
                    setSelectedIds(new Set());
                  }}
                  className={BTN_DESTRUCTIVE}
                >
                  Từ chối
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (submitItems.length > 0) {
                      const updatedIds = submitItems.map(i => i.id);
                      setData(data.map(item => updatedIds.includes(item.id) ? { ...item, approvalStatus: 'approved' as const } : item));
                      toast.success('Đã phê duyệt thành công!');
                    }
                    setIsApproving(false);
                    setSelectedIds(new Set());
                  }}
                  className={BTN_PRIMARY}
                >
                  Phê duyệt
                </button>
              </>
            )}
        </div>
        </div>
      </div>
    )}
    <div className="space-y-4">
      {/* Main Tab Content */}
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

      {/* Add Modal */}
      {showAddModal && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-2xl`}>
            <div className={MODAL_HEADER}>
              <h2 className={MODAL_TITLE}>Thêm mới {categoryName}</h2>
              {closeIconBtn(() => { setShowAddModal(false); resetAddForm(); })}
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Mã <span className={REQUIRED_MARK}>*</span></label>
                  <input
                    type="text"
                    title="Mã"
                    className={INPUT_CLS}
                    placeholder="Nhập mã..."
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Tên <span className={REQUIRED_MARK}>*</span></label>
                  <input
                    type="text"
                    title="Tên"
                    className={INPUT_CLS}
                    placeholder="Nhập tên..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL_CLS}>Cơ quan công bố</label>
                <input
                  type="text"
                  title="Cơ quan công bố"
                  className={INPUT_CLS}
                  placeholder="Nhập tên cơ quan..."
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Từ khóa</label>
                  <input
                    type="text"
                    title="Từ khóa"
                    className={INPUT_CLS}
                    placeholder="Phân tách bằng dấu phẩy..."
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Giấy phép</label>
                  <select
                    title="Giấy phép"
                    className={INPUT_CLS}
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
                <label className={LABEL_CLS}>Tệp dữ liệu <span className="text-[#64748B] font-normal">(CSV, JSON, XML)</span></label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${uploadStatus === 'success' ? 'border-[#16A34A] bg-[#F0FDF4]' : uploadStatus === 'error' ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#CBD5E1] hover:border-blue-600'}`}>
                  {uploadStatus === 'idle' && (
                    <div>
                      <Upload className="w-8 h-8 mx-auto text-[#94A3B8] mb-2" />
                      <p className="text-[13px] text-[#475569] mb-3">Kéo thả tệp hoặc click để tải lên</p>
                      <input
                        type="file"
                        title="Chọn tệp"
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
                      <label htmlFor="file-upload" className={BTN_OUTLINE}>
                        Chọn tệp
                      </label>
                    </div>
                  )}
                  {uploadStatus === 'checking' && (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-2"></div>
                      <p className="text-[13px] text-[#475569]">Đang kiểm tra định dạng và đối chiếu metadata...</p>
                    </div>
                  )}
                  {uploadStatus === 'success' && (
                    <div>
                      <FileCheck className="w-8 h-8 mx-auto text-[#16A34A] mb-2" />
                      <p className="text-[13px] text-[#15803D] font-medium mb-2">Đã kiểm tra định dạng và dữ liệu hợp lệ</p>
                      <Badge label={`Tệp: ${formData.fileName}`} variant="green" />
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => { setUploadStatus('idle'); setFormData({...formData, fileName: ''}); }}
                          className="text-[13px] text-blue-600 hover:underline cursor-pointer"
                        >
                          Tải lên tệp khác
                        </button>
                      </div>
                    </div>
                  )}
                  {uploadStatus === 'error' && (
                    <div>
                      <XCircle className="w-8 h-8 mx-auto text-[#DC2626] mb-2" />
                      <p className="text-[13px] text-[#B91C1C] font-medium mb-1">Định dạng không hợp lệ</p>
                      <p className="text-[13px] text-[#B91C1C]">Vui lòng tải lên đúng định dạng (CSV, JSON, XML, XLSX)</p>
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => setUploadStatus('idle')}
                          className="text-[13px] text-blue-600 hover:underline cursor-pointer"
                        >
                          Thử lại
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={LABEL_CLS}>Mô tả</label>
                <textarea
                  title="Mô tả"
                  className={TEXTAREA_CLS}
                  rows={3}
                  placeholder="Nhập mô tả chi tiết..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Trạng thái</label>
                <select
                  aria-label="Trạng thái"
                  className={INPUT_CLS}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>
            <div className={MODAL_FOOTER_SPLIT}>
              <div className="flex gap-2">
                <button
                  type="button"
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
                    resetAddForm();
                  }}
                  className={BTN_OUTLINE}
                  disabled={!formData.code || !formData.name}
                >
                  <FileCheck className="w-4 h-4" />
                  Trình duyệt
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetAddForm();
                  }}
                  className={BTN_OUTLINE}
                >
                  Hủy
                </button>
                <button
                  type="button"
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
                    resetAddForm();
                  }}
                  className={BTN_PRIMARY}
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
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-2xl`}>
            <div className={MODAL_HEADER}>
              <h2 className={MODAL_TITLE}>Xác nhận công bố</h2>
              {closeIconBtn(() => setShowPublishModal(false))}
            </div>
            <div className={MODAL_BODY}>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <div className={FIELD_LABEL}>Mã</div>
                  <div className={`${FIELD_VALUE} mt-1`}>{selectedItem?.code}</div>
                </div>
                <div>
                  <div className={FIELD_LABEL}>Tên</div>
                  <div className={`${FIELD_VALUE} mt-1`}>{selectedItem?.name}</div>
                </div>
                <div className="col-span-2">
                  <div className={FIELD_LABEL}>Mô tả</div>
                  <div className={`${FIELD_VALUE} mt-1 whitespace-pre-wrap`}>{selectedItem?.description}</div>
                </div>
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmPublish}
                className={BTN_PRIMARY}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unpublish Modal Placeholder */}
      {showUnpublishModal && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-2xl`}>
            <div className={MODAL_HEADER}>
              <h2 className={MODAL_TITLE}>Xác nhận hủy công bố</h2>
              {closeIconBtn(() => setShowUnpublishModal(false))}
            </div>
            <div className={MODAL_BODY}>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <div className={FIELD_LABEL}>Mã</div>
                  <div className={`${FIELD_VALUE} mt-1`}>{selectedItem?.code}</div>
                </div>
                <div>
                  <div className={FIELD_LABEL}>Tên</div>
                  <div className={`${FIELD_VALUE} mt-1`}>{selectedItem?.name}</div>
                </div>
                <div className="col-span-2">
                  <div className={FIELD_LABEL}>Mô tả</div>
                  <div className={`${FIELD_VALUE} mt-1 whitespace-pre-wrap`}>{selectedItem?.description}</div>
                </div>
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowUnpublishModal(false)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmUnpublish}
                className={BTN_DESTRUCTIVE}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-6xl`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Chi tiết tệp dữ liệu mở</h3>
              {closeIconBtn(() => {
                setShowDetailModal(false);
                setSelectedItem(null);
              })}
            </div>

            {/* Tab bar (compomennt.md 5.9) */}
            <div className="px-6 border-b border-[#E2E8F0] flex items-center shrink-0">
              <button
                type="button"
                onClick={() => setDetailModalTab('general')}
                className={tabClass(detailModalTab === 'general')}
              >
                <FileText className="w-4 h-4" />
                Thông tin chung
              </button>
              <button
                type="button"
                onClick={() => setDetailModalTab('data')}
                className={tabClass(detailModalTab === 'data')}
              >
                <Database className="w-4 h-4" />
                Dữ liệu nguồn
              </button>
            </div>

            <div className={MODAL_BODY}>
              {detailModalTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div className="col-span-1 md:col-span-3">
                  <div className={FIELD_LABEL}>Tên tập dữ liệu</div>
                  <div className={`${FIELD_VALUE} mt-1`}>{selectedItem.fileName || selectedItem.name}</div>
                </div>

                <div>
                  <div className={FIELD_LABEL}>Danh mục dữ liệu mở</div>
                  <div className={`${FIELD_VALUE} mt-1`}>{categoryName}</div>
                </div>

                <div>
                  <div className={FIELD_LABEL}>Giấy phép</div>
                  <div className={`${FIELD_VALUE} mt-1`}>
                    {selectedItem.licenseId?.toString().includes('ODC-BY') ? 'Giấy phép ODC-BY' : 'Giấy phép dữ liệu mở công cộng'}
                  </div>
                </div>

                <div>
                  <div className={FIELD_LABEL}>Từ khóa</div>
                  <div className={`${FIELD_VALUE} mt-1`}>{selectedItem.keywords || '—'}</div>
                </div>

                <div>
                  <div className={FIELD_LABEL}>Cơ quan công bố</div>
                  <div className={`${FIELD_VALUE} mt-1`}>{selectedItem.publisher || 'Bộ Tư pháp'}</div>
                </div>

                <div>
                  <div className={FIELD_LABEL}>Định dạng chia sẻ</div>
                  <div className="flex flex-wrap gap-2 mt-1 items-center">
                    {(selectedItem.format && selectedItem.format.length > 0) ? selectedItem.format.map(f => (
                      <Badge key={f} label={f === 'excel' ? 'Excel' : f === 'api' ? 'API' : f} variant="blue" />
                    )) : <span className={FIELD_VALUE}>—</span>}
                  </div>
                </div>

                <div>
                  <div className={FIELD_LABEL}>Tần suất cập nhật</div>
                  <div className={`${FIELD_VALUE} mt-1`}>
                    {selectedItem.frequency === 'daily' ? 'Hàng ngày' : selectedItem.frequency === 'weekly' ? 'Hàng tuần' : selectedItem.frequency === 'monthly' ? 'Hàng tháng' : selectedItem.frequency === 'quarterly' ? 'Hàng quý' : selectedItem.frequency === 'yearly' ? 'Hàng năm' : '—'}
                  </div>
                </div>

                <div className="col-span-1 md:col-span-3">
                  <div className={FIELD_LABEL}>Thông tin mô tả</div>
                  <div className={`${FIELD_VALUE} mt-1 whitespace-pre-wrap`}>{selectedItem.description || '—'}</div>
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
                    { id: '3', ten_to_chuc: 'Trung tâm TGPL TP. Đà Nẵng', loai_hinh: 'Nhà nước', dia_chi: '15 Trần Phú, Đà Nẵng', nguoi_dai_dien: 'Lê Văn Cường', so_dien_thoai: '0236.3821.xxxx', ngay_thanh_lap: '10/06/2013', trang_thai: 'Hoạt động' },
                    { id: '4', ten_to_chuc: 'VP Luật sư Minh Khai', loai_hinh: 'Hợp đồng', dia_chi: '25 Bà Triệu, Hà Nội', nguoi_dai_dien: 'Phạm Thị Dung', so_dien_thoai: '024.3826.xxxx', ngay_thanh_lap: '18/09/2017', trang_thai: 'Hoạt động' },
                    { id: '5', ten_to_chuc: 'Trung tâm TGPL Tỉnh Nghệ An', loai_hinh: 'Nhà nước', dia_chi: '8 Nguyễn Sỹ Sách, Vinh', nguoi_dai_dien: 'Hoàng Văn Em', so_dien_thoai: '0238.3844.xxxx', ngay_thanh_lap: '22/02/2011', trang_thai: 'Hoạt động' },
                    { id: '6', ten_to_chuc: 'VP Luật sư Thăng Long', loai_hinh: 'Hợp đồng', dia_chi: '99 Giải Phóng, Hà Nội', nguoi_dai_dien: 'Ngô Thị Phượng', so_dien_thoai: '024.3868.xxxx', ngay_thanh_lap: '14/11/2019', trang_thai: 'Tạm ngừng' },
                    { id: '7', ten_to_chuc: 'Trung tâm TGPL Tỉnh Bình Dương', loai_hinh: 'Nhà nước', dia_chi: '5 Yersin, Thủ Dầu Một', nguoi_dai_dien: 'Vũ Thị Giang', so_dien_thoai: '0274.3822.xxxx', ngay_thanh_lap: '30/07/2014', trang_thai: 'Hoạt động' },
                    { id: '8', ten_to_chuc: 'VP Luật sư Đông Đô', loai_hinh: 'Hợp đồng', dia_chi: '40 Cầu Giấy, Hà Nội', nguoi_dai_dien: 'Đặng Văn Hải', so_dien_thoai: '024.3792.xxxx', ngay_thanh_lap: '02/04/2020', trang_thai: 'Hoạt động' },
                    { id: '9', ten_to_chuc: 'Trung tâm TGPL TP. Hải Phòng', loai_hinh: 'Nhà nước', dia_chi: '20 Điện Biên Phủ, Hải Phòng', nguoi_dai_dien: 'Bùi Thị Lan', so_dien_thoai: '0225.3823.xxxx', ngay_thanh_lap: '17/12/2012', trang_thai: 'Hoạt động' },
                    { id: '10', ten_to_chuc: 'VP Luật sư Hòa Bình', loai_hinh: 'Hợp đồng', dia_chi: '3 Trần Hưng Đạo, Hòa Bình', nguoi_dai_dien: 'Trịnh Văn Khoa', so_dien_thoai: '0218.3852.xxxx', ngay_thanh_lap: '09/05/2016', trang_thai: 'Tạm ngừng' },
                    { id: '11', ten_to_chuc: 'Trung tâm TGPL Tỉnh Cần Thơ', loai_hinh: 'Nhà nước', dia_chi: '12 Hòa Bình, Cần Thơ', nguoi_dai_dien: 'Lý Thị Mai', so_dien_thoai: '0292.3821.xxxx', ngay_thanh_lap: '25/01/2015', trang_thai: 'Hoạt động' },
                    { id: '12', ten_to_chuc: 'VP Luật sư Sài Gòn Xanh', loai_hinh: 'Hợp đồng', dia_chi: '88 Nguyễn Huệ, TP. HCM', nguoi_dai_dien: 'Đỗ Văn Nam', so_dien_thoai: '028.3822.xxxx', ngay_thanh_lap: '11/08/2018', trang_thai: 'Hoạt động' },
                  ],
                  ODC002: [
                    { id: '1', ho_ten: 'Nguyễn Văn An', so_nam_hanh_nghe: '8', vai_tro: 'Trợ giúp viên', so_chung_chi: 'TGV-001/2016', trang_thai: 'Hoạt động' },
                    { id: '2', ho_ten: 'Lê Thị Bình', so_nam_hanh_nghe: '5', vai_tro: 'Luật sư cộng tác', so_chung_chi: 'LS-123/2019', trang_thai: 'Hoạt động' },
                    { id: '3', ho_ten: 'Trần Văn Cường', so_nam_hanh_nghe: '12', vai_tro: 'Trợ giúp viên', so_chung_chi: 'TGV-014/2011', trang_thai: 'Hoạt động' },
                    { id: '4', ho_ten: 'Phạm Thị Dung', so_nam_hanh_nghe: '3', vai_tro: 'Cộng tác viên', so_chung_chi: 'CTV-045/2021', trang_thai: 'Hoạt động' },
                    { id: '5', ho_ten: 'Hoàng Văn Em', so_nam_hanh_nghe: '6', vai_tro: 'Luật sư cộng tác', so_chung_chi: 'LS-208/2017', trang_thai: 'Hoạt động' },
                    { id: '6', ho_ten: 'Ngô Thị Phượng', so_nam_hanh_nghe: '9', vai_tro: 'Trợ giúp viên', so_chung_chi: 'TGV-032/2014', trang_thai: 'Tạm ngừng' },
                    { id: '7', ho_ten: 'Vũ Văn Giang', so_nam_hanh_nghe: '4', vai_tro: 'Cộng tác viên', so_chung_chi: 'CTV-061/2020', trang_thai: 'Hoạt động' },
                    { id: '8', ho_ten: 'Đặng Thị Hải', so_nam_hanh_nghe: '15', vai_tro: 'Trợ giúp viên', so_chung_chi: 'TGV-005/2008', trang_thai: 'Hoạt động' },
                    { id: '9', ho_ten: 'Bùi Văn Kiên', so_nam_hanh_nghe: '7', vai_tro: 'Luật sư cộng tác', so_chung_chi: 'LS-176/2018', trang_thai: 'Hoạt động' },
                    { id: '10', ho_ten: 'Trịnh Thị Lan', so_nam_hanh_nghe: '2', vai_tro: 'Cộng tác viên', so_chung_chi: 'CTV-089/2022', trang_thai: 'Tạm ngừng' },
                    { id: '11', ho_ten: 'Lý Văn Minh', so_nam_hanh_nghe: '10', vai_tro: 'Trợ giúp viên', so_chung_chi: 'TGV-021/2013', trang_thai: 'Hoạt động' },
                  ],
                  ODC003: [
                    { id: '1', ho_ten: 'Lê Văn Long', ngay_sinh: '15/08/1985', gioi_tinh: 'Nam', quoc_tich: 'Việt Nam', so_chung_chi_hn: 'CC-9988-BTP', so_the_luat_su: 'THE-1234-LS', noi_lam_viec: 'VP Luật sư Long & Partners', doan_luat_su: 'TP. Hà Nội', tinh_trang_hn: 'Đang hoạt động' },
                    { id: '2', ho_ten: 'Phạm Thị Hoa', ngay_sinh: '22/04/1990', gioi_tinh: 'Nữ', quoc_tich: 'Việt Nam', so_chung_chi_hn: 'CC-5544-BTP', so_the_luat_su: 'THE-5678-LS', noi_lam_viec: 'Công ty Luật TNHH Sen Vàng', doan_luat_su: 'TP. HCM', tinh_trang_hn: 'Đang hoạt động' },
                    { id: '3', ho_ten: 'Nguyễn Văn Khánh', ngay_sinh: '03/11/1982', gioi_tinh: 'Nam', quoc_tich: 'Việt Nam', so_chung_chi_hn: 'CC-3321-BTP', so_the_luat_su: 'THE-2211-LS', noi_lam_viec: 'VP Luật sư Khánh An', doan_luat_su: 'TP. Đà Nẵng', tinh_trang_hn: 'Đang hoạt động' },
                    { id: '4', ho_ten: 'Trần Thị Mai', ngay_sinh: '19/07/1988', gioi_tinh: 'Nữ', quoc_tich: 'Việt Nam', so_chung_chi_hn: 'CC-7712-BTP', so_the_luat_su: 'THE-3345-LS', noi_lam_viec: 'Công ty Luật Mai & Cộng sự', doan_luat_su: 'TP. Hà Nội', tinh_trang_hn: 'Đang hoạt động' },
                    { id: '5', ho_ten: 'Hoàng Văn Nam', ngay_sinh: '27/02/1979', gioi_tinh: 'Nam', quoc_tich: 'Việt Nam', so_chung_chi_hn: 'CC-1198-BTP', so_the_luat_su: 'THE-4456-LS', noi_lam_viec: 'VP Luật sư Nam Phong', doan_luat_su: 'TP. Cần Thơ', tinh_trang_hn: 'Đang hoạt động' },
                    { id: '6', ho_ten: 'Ngô Thị Oanh', ngay_sinh: '05/09/1993', gioi_tinh: 'Nữ', quoc_tich: 'Việt Nam', so_chung_chi_hn: 'CC-8834-BTP', so_the_luat_su: 'THE-5567-LS', noi_lam_viec: 'Công ty Luật Oanh Vũ', doan_luat_su: 'TP. HCM', tinh_trang_hn: 'Tạm ngừng hành nghề' },
                    { id: '7', ho_ten: 'Vũ Văn Phúc', ngay_sinh: '12/01/1975', gioi_tinh: 'Nam', quoc_tich: 'Việt Nam', so_chung_chi_hn: 'CC-2256-BTP', so_the_luat_su: 'THE-6678-LS', noi_lam_viec: 'VP Luật sư Phúc Thịnh', doan_luat_su: 'Tỉnh Nghệ An', tinh_trang_hn: 'Đang hoạt động' },
                    { id: '8', ho_ten: 'Đặng Thị Quỳnh', ngay_sinh: '30/06/1991', gioi_tinh: 'Nữ', quoc_tich: 'Việt Nam', so_chung_chi_hn: 'CC-4467-BTP', so_the_luat_su: 'THE-7789-LS', noi_lam_viec: 'Công ty Luật Quỳnh Anh', doan_luat_su: 'TP. Hà Nội', tinh_trang_hn: 'Đang hoạt động' },
                    { id: '9', ho_ten: 'Bùi Văn Rạng', ngay_sinh: '08/12/1984', gioi_tinh: 'Nam', quoc_tich: 'Việt Nam', so_chung_chi_hn: 'CC-6690-BTP', so_the_luat_su: 'THE-8890-LS', noi_lam_viec: 'VP Luật sư Rạng Đông', doan_luat_su: 'Tỉnh Bình Dương', tinh_trang_hn: 'Đang hoạt động' },
                    { id: '10', ho_ten: 'Trịnh Thị Sương', ngay_sinh: '14/03/1987', gioi_tinh: 'Nữ', quoc_tich: 'Việt Nam', so_chung_chi_hn: 'CC-5523-BTP', so_the_luat_su: 'THE-9901-LS', noi_lam_viec: 'Công ty Luật Sương Mai', doan_luat_su: 'TP. Hải Phòng', tinh_trang_hn: 'Đang hoạt động' },
                    { id: '11', ho_ten: 'Lý Văn Tâm', ngay_sinh: '21/10/1980', gioi_tinh: 'Nam', quoc_tich: 'Việt Nam', so_chung_chi_hn: 'CC-9945-BTP', so_the_luat_su: 'THE-1023-LS', noi_lam_viec: 'VP Luật sư Tâm Đức', doan_luat_su: 'Tỉnh Hòa Bình', tinh_trang_hn: 'Đang hoạt động' },
                  ],
                };
                const code = catIdToCode[categoryId] || '';
                const config = CATEGORY_DB_CONFIG[code];
                const rows = SAMPLE_ROWS[code] || [];
                if (!config) return (
                  <div className="flex flex-col items-center justify-center py-12 text-[#94A3B8] gap-2">
                    <Database className="w-8 h-8" />
                    <p className="text-[13px] text-[#64748B]">Chưa có cấu hình nguồn dữ liệu</p>
                  </div>
                );
                const totalRows = rows.length;
                const pagedRows = rows.slice((sourceDataPage - 1) * sourceDataPageSize, sourceDataPage * sourceDataPageSize);
                return (
                  <div className="space-y-4">
                    <div className={`${GROUP_CARD} grid grid-cols-[112px_1fr] gap-x-4 gap-y-2`}>
                      <span className={FIELD_LABEL}>Cơ sở dữ liệu:</span>
                      <span className={FIELD_VALUE}>{config.dbName}</span>
                      <span className={FIELD_LABEL}>Bảng dữ liệu:</span>
                      <span className={FIELD_VALUE}>{[config.mainTable, ...config.joinTables].join(', ')}</span>
                      <span className={FIELD_LABEL}>Các trường:</span>
                      <span className={`${FIELD_VALUE} break-all`}>{config.fields.join(', ')}</span>
                    </div>
                    {rows.length > 0 && (
                      <div className={TABLE_WRAP}>
                        <div className="overflow-x-auto">
                          <table className={TABLE_CLS}>
                            <thead className="bg-[#F8FAFC]">
                              <tr className="h-[42px]">
                                {config.fields.map(f => (
                                  <th key={f} className={`${TH} text-left`}>{f}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {pagedRows.map((row, i) => (
                                <tr key={i} className={TR}>
                                  {config.fields.map(f => (
                                    <td key={f} className={`${TD} whitespace-nowrap`}>{row[f] || '—'}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Pagination
                          className="border-t border-[#E2E8F0]"
                          currentPage={sourceDataPage}
                          totalItems={totalRows}
                          pageSize={sourceDataPageSize}
                          onPageChange={setSourceDataPage}
                        />
                      </div>
                    )}
                  </div>
                );
              })()}

            </div>

            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedItem(null);
                }}
                className={BTN_OUTLINE}
              >
                Đóng
              </button>

              {/* Submit for approval - show when draft or rejected */}
              {(selectedItem.approvalStatus === 'draft' || selectedItem.approvalStatus === 'rejected') && (
                <button
                  type="button"
                  onClick={() => {
                    setShowDetailModal(false);
                    setSubmitItems([selectedItem]);
                    setSubmitActiveTab('category');
                    setIsSubmitting(true);
                  }}
                  className={BTN_PRIMARY}
                >
                  <FileCheck className="w-4 h-4" />
                  Gửi phê duyệt
                </button>
              )}

              {/* Reject - show when pending (for leader) */}
              {selectedItem.approvalStatus === 'pending' && (
                <button
                  type="button"
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowRejectModal(true);
                  }}
                  className={BTN_DESTRUCTIVE}
                >
                  <XCircle className="w-4 h-4" />
                  Từ chối
                </button>
              )}

              {/* Approve - show when pending (for leader) */}
              {selectedItem.approvalStatus === 'pending' && (
                <button
                  type="button"
                  onClick={() => {
                    setShowDetailModal(false);
                    setSubmitItems([selectedItem!]);
                    setSubmitActiveTab('category');
                    setIsApproving(true);
                  }}
                  className={BTN_PRIMARY}
                >
                  <CheckCircle className="w-4 h-4" />
                  Phê duyệt
                </button>
              )}

              {/* Publish - only when approved */}
              {selectedItem.approvalStatus === 'approved' && selectedItem.publishStatus === 'unpublished' && (
                <button
                  type="button"
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowPublishFromModalModal(true);
                  }}
                  className={BTN_PRIMARY}
                >
                  <CheckCircle className="w-4 h-4" />
                  Công khai
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-3xl`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Chỉnh sửa tệp dữ liệu mở</h3>
              {closeIconBtn(() => {
                setShowEditModal(false);
                setSelectedItem(null);
              })}
            </div>

            <div className={`${MODAL_BODY} space-y-4`}>
              <div className={INFO_BANNER}>
                <HistoryIcon className="w-4 h-4 text-[#155DFC] mt-0.5 shrink-0" />
                <span>
                  Hệ thống đã tự động tạo nhánh phiên bản mới để bạn chỉnh sửa. Phiên bản gốc không bị ảnh hưởng cho đến khi phiên bản này được công bố.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Phiên bản hiện tại</label>
                  <input
                    type="text"
                    title="Phiên bản hiện tại"
                    className={READONLY_INPUT}
                    value="v1.3"
                    readOnly
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Phiên bản đang sửa</label>
                  <div className="flex w-full h-10 px-3 border border-[#BFDBFE] rounded-lg bg-[#EAF3FF] text-[#155DFC] gap-2 items-center">
                    <span className="font-medium text-[13px]">v1.4</span>
                    <Badge label="Bản nháp mới" variant="blue" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className={LABEL_CLS}>Tên tập dữ liệu <span className={REQUIRED_MARK}>*</span></label>
                  <input
                    type="text"
                    title="Tên tập dữ liệu"
                    value={editForm.fileName}
                    onChange={(e) => setEditForm({ ...editForm, fileName: e.target.value })}
                    className={INPUT_CLS}
                    placeholder="Nhập tên tập dữ liệu..."
                  />
                </div>

                <div>
                  <label className={LABEL_CLS}>Danh mục dữ liệu mở</label>
                  <input
                    type="text"
                    title="Danh mục dữ liệu mở"
                    readOnly
                    value={categoryName}
                    className={READONLY_INPUT}
                  />
                </div>

                <div>
                  <label className={LABEL_CLS}>Giấy phép <span className={REQUIRED_MARK}>*</span></label>
                  <select
                    title="Giấy phép"
                    value={editForm.licenseId}
                    onChange={(e) => setEditForm({ ...editForm, licenseId: e.target.value })}
                    className={INPUT_CLS}
                  >
                    <option value="Giấy phép dữ liệu mở công cộng">Giấy phép dữ liệu mở công cộng</option>
                    <option value="Giấy phép ODC-BY">Giấy phép ODC-BY</option>
                  </select>
                </div>

                <div>
                  <label className={LABEL_CLS}>Từ khóa</label>
                  <input
                    type="text"
                    title="Từ khóa"
                    value={editForm.keywords}
                    onChange={(e) => setEditForm({ ...editForm, keywords: e.target.value })}
                    className={INPUT_CLS}
                    placeholder="Ví dụ: luật, mở, trợ giúp..."
                  />
                </div>

                <div>
                  <label className={LABEL_CLS}>Cơ quan công bố</label>
                  <input
                    type="text"
                    title="Cơ quan công bố"
                    value={editForm.publisher}
                    onChange={(e) => setEditForm({ ...editForm, publisher: e.target.value })}
                    className={INPUT_CLS}
                    placeholder="Ví dụ: Bộ Tư pháp..."
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className={LABEL_CLS}>Thông tin mô tả</label>
                  <textarea
                    title="Thông tin mô tả"
                    rows={2}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className={TEXTAREA_CLS}
                    placeholder="Nhập thông tin mô tả chi tiết..."
                  />
                </div>

                {/* Upload Type Selector */}
                <div className="col-span-1 md:col-span-2">
                  <label className={LABEL_CLS}>Dạng tải dữ liệu</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled
                      className={`flex-1 h-10 flex items-center justify-center gap-2 rounded-lg border text-[13px] font-medium cursor-not-allowed ${
                        selectedItem.uploadType !== 'api'
                          ? 'bg-[#EAF3FF] text-[#155DFC] border-[#BFDBFE]'
                          : 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0]'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      Tải lên tệp
                    </button>
                    <button
                      type="button"
                      disabled
                      className={`flex-1 h-10 flex items-center justify-center gap-2 rounded-lg border text-[13px] font-medium cursor-not-allowed ${
                        selectedItem.uploadType === 'api'
                          ? 'bg-[#EAF3FF] text-[#155DFC] border-[#BFDBFE]'
                          : 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0]'
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      Lấy từ API
                    </button>
                  </div>
                </div>

                {selectedItem.uploadType === 'api' ? (
                  <div className="col-span-1 md:col-span-2">
                    <div className={`${GROUP_CARD} space-y-4`}>
                      <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
                        <div className="text-[14px] font-medium text-[#020817] flex items-center gap-2">
                          <Globe className="w-4 h-4 text-purple-600" />
                          <span>Chi tiết cấu hình API ({selectedItem.apiType === 'internal' ? 'Nội bộ' : 'Cơ quan nhà nước'}) <span className="text-[12px] font-normal text-[#64748B]">(Không được phép sửa)</span></span>
                        </div>
                        <Badge label={selectedItem.apiMethod || 'GET'} variant="purple" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 md:col-span-2">
                          <label className={LABEL_CLS}>Tiêu đề API / Mã kết nối</label>
                          <input type="text" title="Tiêu đề API / Mã kết nối" readOnly value={selectedItem.apiTitle || 'API Chia sẻ dữ liệu'} className={READONLY_INPUT} />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <label className={LABEL_CLS}>Đường dẫn dịch vụ chia sẻ (URL API)</label>
                          <input type="text" title="Đường dẫn dịch vụ chia sẻ (URL API)" readOnly value={selectedItem.apiUrl || ''} className={READONLY_INPUT} />
                        </div>
                        {selectedItem.apiDesc && (
                          <div className="col-span-1 md:col-span-2">
                            <label className={LABEL_CLS}>Mô tả chi tiết API</label>
                            <textarea rows={2} title="Mô tả chi tiết API" readOnly value={selectedItem.apiDesc} className={READONLY_TEXTAREA} />
                          </div>
                        )}
                        {selectedItem.apiType === 'external' && (
                          <>
                            <div>
                              <label className={LABEL_CLS}>Tham số (Query Params)</label>
                              <input type="text" title="Tham số (Query Params)" readOnly value={selectedItem.apiParams || ''} className={READONLY_INPUT} />
                            </div>
                            <div>
                              <label className={LABEL_CLS}>Headers</label>
                              <input type="text" title="Headers" readOnly value={selectedItem.apiHeaders || ''} className={READONLY_INPUT} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* FILE DETAIL BOX */}
                    <div className={`col-span-1 md:col-span-2 ${INFO_BANNER}`}>
                      <Info className="w-4 h-4 text-[#155DFC] mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-[13px] font-medium text-[#020817] mb-1">Cấu trúc Metadata yêu cầu</h4>
                        <p className="text-[13px] text-[#475569] mb-2">Tệp dữ liệu tải lên bắt buộc phải chứa các cột tiêu đề ở dòng đầu tiên:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {getExpectedHeaders().map((hdr, idx) => (
                            <Badge key={idx} label={hdr} variant="blue" />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* FILE DISPLAY SECTION */}
                    <div className="col-span-1 md:col-span-2">
                      <label className={LABEL_CLS}>Tệp dữ liệu đã tải lên <span className="text-[12px] font-normal text-[#64748B]">(Không được phép thay thế)</span></label>
                      <div className="border border-[#E2E8F0] rounded-lg p-4 bg-[#F8FAFC] flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                          <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <TruncatedText text={selectedItem.fileName || selectedItem.name} className="text-[13px] font-medium text-[#020817] max-w-md" />
                          <div className="text-[12px] text-[#64748B]">154.0 KB</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={MODAL_FOOTER_SPLIT}>
              <div className="flex gap-2">
                {/* Submit for approval button */}
                <button
                  type="button"
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
                    toast.success('Đã gửi yêu cầu trình duyệt thành công!');
                  }}
                  className={BTN_OUTLINE}
                >
                  <FileCheck className="w-4 h-4" />
                  Trình duyệt
                </button>

                {/* Publish button - only enabled if approved */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedItem.approvalStatus !== 'approved') {
                      toast.error('Chỉ dữ liệu đã phê duyệt mới được công khai!');
                      return;
                    }
                    setShowEditModal(false);
                    setShowPublishFromModalModal(true);
                  }}
                  className={BTN_OUTLINE}
                  disabled={selectedItem.approvalStatus !== 'approved'}
                  title={selectedItem.approvalStatus !== 'approved' ? 'Chỉ dữ liệu đã phê duyệt mới được công khai' : 'Công khai'}
                >
                  <CheckCircle className="w-4 h-4" />
                  Công khai
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className={BTN_OUTLINE}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className={BTN_PRIMARY}
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
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-md`}>
            <div className={MODAL_HEADER}>
              <h2 className={MODAL_TITLE}>Xác nhận công bố hàng loạt</h2>
              {closeIconBtn(() => setShowBulkPublishModal(false))}
            </div>
            <div className={`${MODAL_BODY} text-[13px] text-[#020817]`}>
              Bạn có chắc chắn muốn công bố <strong className="font-medium">{selectedIds.size}</strong> mục đã chọn?
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowBulkPublishModal(false)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleBulkPublish}
                className={BTN_PRIMARY}
              >
                Xác nhận công bố
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Unpublish Modal */}
      {showBulkUnpublishModal && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-md`}>
            <div className={MODAL_HEADER}>
              <h2 className={MODAL_TITLE}>Xác nhận hủy công bố hàng loạt</h2>
              {closeIconBtn(() => setShowBulkUnpublishModal(false))}
            </div>
            <div className={`${MODAL_BODY} text-[13px] text-[#020817]`}>
              Bạn có chắc chắn muốn hủy công bố <strong className="font-medium">{selectedIds.size}</strong> mục đã chọn?
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowBulkUnpublishModal(false)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleBulkUnpublish}
                className={BTN_DESTRUCTIVE}
              >
                Xác nhận hủy công bố
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Approval Modal */}
      {showBulkApprovalModal && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-md`}>
            <div className={MODAL_HEADER}>
              <h2 className={MODAL_TITLE}>Xác nhận phê duyệt hàng loạt</h2>
              {closeIconBtn(() => setShowBulkApprovalModal(false))}
            </div>
            <div className={`${MODAL_BODY} text-[13px] text-[#020817]`}>
              Bạn có chắc chắn muốn phê duyệt <strong className="font-medium">{selectedIds.size}</strong> mục đã chọn?
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowBulkApprovalModal(false)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleBulkApproval}
                className={BTN_PRIMARY}
              >
                Xác nhận phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Publish from Modal Modal */}
      {showPublishFromModalModal && selectedItem && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-md`}>
            <div className={MODAL_HEADER}>
              <h2 className={MODAL_TITLE}>Xác nhận công khai</h2>
              {closeIconBtn(() => {
                setShowPublishFromModalModal(false);
                setSelectedItem(null);
              })}
            </div>
            <div className={`${MODAL_BODY} space-y-3`}>
              {selectedItem.approvalStatus !== 'approved' ? (
                <div className={ERROR_BANNER}>
                  <AlertTriangle className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
                  <p>
                    Dữ liệu chưa được phê duyệt. Chỉ dữ liệu đã phê duyệt mới được công khai.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[13px] text-[#020817]">
                    Bạn có chắc chắn muốn công khai dữ liệu sau?
                  </p>
                  <div className={`${GROUP_CARD} space-y-3`}>
                    <div>
                      <div className={FIELD_LABEL}>Mã:</div>
                      <div className={`${FIELD_VALUE} mt-1`}>{selectedItem.code}</div>
                    </div>
                    <div>
                      <div className={FIELD_LABEL}>Tên:</div>
                      <div className={`${FIELD_VALUE} mt-1`}>{selectedItem.name}</div>
                    </div>
                    <div>
                      <div className={FIELD_LABEL}>Trạng thái phê duyệt:</div>
                      <div className="mt-1">
                        <Badge label="Đã phê duyệt" variant="green" />
                      </div>
                    </div>
                    {selectedItem.licenseId && (
                      <div>
                        <div className={FIELD_LABEL}>Giấy phép:</div>
                        <div className={`${FIELD_VALUE} mt-1`}>{sampleLicenses.find(l => l.id.toString() === selectedItem.licenseId)?.name || 'Đã thiết lập'}</div>
                      </div>
                    )}
                    {selectedItem.keywords && (
                      <div>
                        <div className={FIELD_LABEL}>Metadata (Từ khóa):</div>
                        <div className={`${FIELD_VALUE} mt-1`}>{selectedItem.keywords}</div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => {
                  setShowPublishFromModalModal(false);
                  setSelectedItem(null);
                }}
                className={BTN_OUTLINE}
              >
                {selectedItem.approvalStatus !== 'approved' ? 'Đóng' : 'Hủy'}
              </button>
              {selectedItem.approvalStatus === 'approved' && (
                <button
                  type="button"
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
                    toast.success('Đã công khai dữ liệu thành công!');
                  }}
                  className={BTN_PRIMARY}
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
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-md`}>
            <div className={MODAL_HEADER}>
              <h2 className={MODAL_TITLE}>Phê duyệt</h2>
              {closeIconBtn(() => {
                setShowApprovalModal(false);
                setApprovalNote('');
                setSelectedItem(null);
              })}
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <div className={`${GROUP_CARD} space-y-3`}>
                <div>
                  <div className={FIELD_LABEL}>Mã:</div>
                  <div className={`${FIELD_VALUE} mt-1`}>{selectedItem.code}</div>
                </div>
                <div>
                  <div className={FIELD_LABEL}>Tên:</div>
                  <div className={`${FIELD_VALUE} mt-1`}>{selectedItem.name}</div>
                </div>
                <div>
                  <div className={FIELD_LABEL}>Trạng thái:</div>
                  <div className="mt-1">
                    <Badge label="Chờ phê duyệt" variant="amber" />
                  </div>
                </div>
              </div>

              <div className={GROUP_CARD}>
                <div className={SECTION_TITLE}>
                  <Shield className="w-4 h-4 text-[#155DFC]" />
                  <span>Thông tin thiết lập từ Danh mục gốc ({categoryName})</span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <div className={FIELD_LABEL}>Giấy phép áp dụng:</div>
                    <div className={`${FIELD_VALUE} mt-1`}>
                      Giấy phép dữ liệu mở công cộng (Kế thừa)
                    </div>
                  </div>
                  <div>
                    <div className={FIELD_LABEL}>Metadata chuẩn:</div>
                    <div className={`${FIELD_VALUE} mt-1`}>
                      dữ liệu, {categoryName.toLowerCase()}, bộ tư pháp
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className={LABEL_CLS}>
                  Nội dung phê duyệt
                </label>
                <textarea
                  className={TEXTAREA_CLS}
                  rows={4}
                  placeholder="Nhập nội dung phê duyệt (không bắt buộc)..."
                  value={approvalNote}
                  aria-label="Nội dung phê duyệt"
                  title="Nội dung phê duyệt"
                  onChange={(e) => setApprovalNote(e.target.value)}
                />
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalNote('');
                  setSelectedItem(null);
                }}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedItem) {
                    setData(data.map(item =>
                      item.id === selectedItem.id
                        ? { ...item, approvalStatus: 'approved' as const }
                        : item
                    ));
                    toast.success('Đã phê duyệt thành công!', approvalNote ? { description: 'Nội dung: ' + approvalNote } : undefined);
                  }
                  setShowApprovalModal(false);
                  setApprovalNote('');
                  setSelectedItem(null);
                }}
                className={BTN_PRIMARY}
              >
                Xác nhận phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedItem && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-md`}>
            <div className={MODAL_HEADER}>
              <h2 className={MODAL_TITLE}>Từ chối phê duyệt</h2>
              {closeIconBtn(() => {
                setShowRejectModal(false);
                setRejectReason('');
                setSelectedItem(null);
              })}
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <div className={`${GROUP_CARD} space-y-3`}>
                <div>
                  <div className={FIELD_LABEL}>Mã:</div>
                  <div className={`${FIELD_VALUE} mt-1`}>{selectedItem.code}</div>
                </div>
                <div>
                  <div className={FIELD_LABEL}>Tên:</div>
                  <div className={`${FIELD_VALUE} mt-1`}>{selectedItem.name}</div>
                </div>
              </div>
              <div>
                <label className={LABEL_CLS}>
                  Lý do từ chối <span className={REQUIRED_MARK}>*</span>
                </label>
                <textarea
                  className={TEXTAREA_CLS}
                  rows={4}
                  placeholder="Nhập lý do từ chối phê duyệt..."
                  value={rejectReason}
                  aria-label="Lý do từ chối"
                  title="Lý do từ chối"
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setSelectedItem(null);
                }}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!rejectReason.trim()) {
                    toast.error('Vui lòng nhập lý do từ chối!');
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
                  toast.success('Đã từ chối phê duyệt.', { description: `Lý do: ${rejectReason}` });
                }}
                className={BTN_DESTRUCTIVE}
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
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-6xl`}>
            {/* Modal Header */}
            <div className={MODAL_HEADER}>
              <div className="min-w-0">
                <h3 className={MODAL_TITLE}>Lịch sử phiên bản</h3>
                <p className={`${MODAL_SUBTITLE} mt-0.5`}>
                  {selectedDatasetForVersionHistory.uploadType === 'api' ? 'API' : 'Tệp dữ liệu'}: <span className="text-[#020817] font-medium">{selectedDatasetForVersionHistory.fileName || selectedDatasetForVersionHistory.name}</span>
                </p>
              </div>
              {closeIconBtn(() => {
                setShowVersionHistoryModal(false);
                setSelectedDatasetForVersionHistory(null);
              })}
            </div>

            {/* Modal Content */}
            <div className={MODAL_BODY}>
              <div className={TABLE_WRAP}>
                <div className="overflow-x-auto">
                  <table className={TABLE_CLS}>
                    <thead className="bg-[#F8FAFC]">
                      <tr className="h-[42px]">
                        <th className={`${TH} text-left`}>Tên tệp dữ liệu</th>
                        <th className={`${TH} text-left`}>Phiên bản</th>
                        <th className={`${TH} text-left`}>Người cập nhật</th>
                        <th className={`${TH} text-left`}>Ngày phát hành</th>
                        <th className={`${TH} text-left`}>Trạng thái</th>
                        <th className={`${TH} text-center w-px ${STICKY_TH}`}>So sánh phiên bản</th>
                      </tr>
                    </thead>
                    <tbody>
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
                      ].map((v, idx) => {
                        const [datePart, timePart] = v.updatedDate.split(' ');
                        return (
                          <tr key={idx} className={TR}>
                            <td className={`${TD} max-w-[360px]`}>
                              <TruncatedText text={selectedDatasetForVersionHistory.fileName || selectedDatasetForVersionHistory.name} />
                            </td>
                            <td className={`${TD} whitespace-nowrap`}>{v.version}</td>
                            <td className={`${TD} max-w-[200px]`}><TruncatedText text={v.updatedBy} /></td>
                            <td className={`${TD} whitespace-nowrap leading-[18px]`}>
                              <div>{datePart}</div>
                              <div className="text-[#64748B]">{timePart}</div>
                            </td>
                            <td className={TD}>
                              <Badge label={v.status} variant={v.status === 'Kích hoạt' ? 'green' : 'slate'} />
                            </td>
                            <td className={`${TD} text-center ${STICKY_TD}`}>
                              <div className="flex items-center justify-center gap-1">
                                <RowIconAction
                                  label="Xem chi tiết"
                                  onClick={() => {
                                    setSelectedVersionToCompare(v);
                                    setShowVersionHistoryModal(false);
                                    setShowVersionComparisonModal(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </RowIconAction>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => {
                  setShowVersionHistoryModal(false);
                  setSelectedDatasetForVersionHistory(null);
                }}
                className={BTN_OUTLINE}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom So sánh cấu trúc phiên bản Modal (Ảnh 2) */}
      {showVersionComparisonModal && selectedDatasetForVersionHistory && selectedVersionToCompare && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-4xl`}>
            {/* Header */}
            <div className={MODAL_HEADER}>
              <div className="min-w-0">
                <h3 className={MODAL_TITLE}>
                  {selectedDatasetForVersionHistory.uploadType === 'api'
                    ? 'So sánh cấu trúc phiên bản API'
                    : 'So sánh cấu trúc phiên bản tệp dữ liệu'}
                </h3>
                <p className={`${MODAL_SUBTITLE} mt-0.5`}>
                  {selectedDatasetForVersionHistory.uploadType === 'api' ? 'Dịch vụ' : 'Tệp dữ liệu'}: <span className="text-[#020817] font-medium">{selectedDatasetForVersionHistory.fileName || selectedDatasetForVersionHistory.name}</span>
                </p>
              </div>
              {closeIconBtn(() => {
                setShowVersionComparisonModal(false);
                setSelectedVersionToCompare(null);
                setSelectedDatasetForVersionHistory(null);
              })}
            </div>

            {/* Content */}
            <div className={`${MODAL_BODY} space-y-4`}>
              {/* Compare Card Info */}
              <div className={`${GROUP_CARD} bg-[#F8FAFC] flex flex-col items-center justify-center text-center gap-3`}>
                <div className="text-[13px] text-[#64748B]">
                  {selectedDatasetForVersionHistory.uploadType === 'api' ? 'API được so sánh' : 'Tệp dữ liệu được so sánh'}
                </div>
                <div className="text-[13px] font-medium text-[#020817]">
                  {selectedDatasetForVersionHistory.fileName || selectedDatasetForVersionHistory.name}
                </div>
                <div className="flex items-center gap-4 bg-white border border-[#E2E8F0] rounded-lg px-4 py-2">
                  <div className="flex flex-col items-center">
                    <span className="text-[12px] text-[#64748B]">Phiên bản cũ</span>
                    <span className="text-[13px] font-medium text-[#334155] mt-0.5">v1.1</span>
                  </div>
                  <span className="text-[#94A3B8]">→</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[12px] text-[#64748B]">Phiên bản mới</span>
                    <span className="text-[13px] font-medium text-[#155DFC] mt-0.5">{selectedVersionToCompare.version}</span>
                  </div>
                </div>
              </div>

              {/* Struct Comparison Table */}
              <div className={TABLE_WRAP}>
                <div className="overflow-x-auto">
                <table className={TABLE_CLS}>
                  <thead className="bg-[#F8FAFC]">
                    <tr className="h-[42px] border-b border-[#E2E8F0]">
                      <th colSpan={2} className={`${TH} text-left border-r border-[#E2E8F0] w-1/2`}>
                        <div className="flex items-center justify-between gap-2">
                          <span>PHIÊN BẢN CŨ (v1.1)</span>
                          <Badge label="Trước cập nhật" variant="slate" />
                        </div>
                      </th>
                      <th colSpan={2} className={`${TH} text-left w-1/2`}>
                        <div className="flex items-center justify-between gap-2">
                          <span>PHIÊN BẢN MỚI ({selectedVersionToCompare.version})</span>
                          <Badge label="Sau cập nhật" variant="blue" />
                        </div>
                      </th>
                    </tr>
                    <tr className="h-[42px]">
                      <th className={`${TH} text-left border-r border-[#E2E8F0]`}>Trường thuộc tính</th>
                      <th className={`${TH} text-left border-r border-[#E2E8F0]`}>Kiểu dữ liệu</th>
                      <th className={`${TH} text-left border-r border-[#E2E8F0]`}>Trường thuộc tính</th>
                      <th className={`${TH} text-left`}>Kiểu dữ liệu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDatasetForVersionHistory.uploadType === 'api' ? (
                      <>
                        <tr className={TR}>
                          <td className={`${TD} ${CMP_SEP}`}>ho_ten</td>
                          <td className={`${TD} ${CMP_SEP}`}>string</td>
                          <td className={`${TD} ${CMP_SEP}`}>ho_ten</td>
                          <td className={TD}>string</td>
                        </tr>
                        <tr className={TR}>
                          <td className={`${TD} ${CMP_SEP}`}>ngay_thang_nam_sinh</td>
                          <td className={`${TD} ${CMP_SEP} ${CMP_OLD}`}>string (DD/MM/YYYY)</td>
                          <td className={`${TD} ${CMP_SEP}`}>ngay_thang_nam_sinh</td>
                          <td className={`${TD} ${CMP_NEW}`}>string (YYYY-MM-DD)</td>
                        </tr>
                        <tr className={TR}>
                          <td className={`${TD} ${CMP_SEP}`}>so_dinh_danh_can_nhan</td>
                          <td className={`${TD} ${CMP_SEP}`}>string (12 số)</td>
                          <td className={`${TD} ${CMP_SEP}`}>so_dinh_danh_can_nhan</td>
                          <td className={TD}>string (12 số)</td>
                        </tr>
                      </>
                    ) : selectedDatasetForVersionHistory.fileName?.includes('to_chuc') ? (
                      <>
                        <tr className={TR}>
                          <td className={`${TD} ${CMP_SEP}`}>Ten_to_chuc</td>
                          <td className={`${TD} ${CMP_SEP}`}>text</td>
                          <td className={`${TD} ${CMP_SEP}`}>Ten_to_chuc</td>
                          <td className={TD}>text</td>
                        </tr>
                        <tr className={TR}>
                          <td className={`${TD} ${CMP_SEP}`}>Nguoi_dai_dien</td>
                          <td className={`${TD} ${CMP_SEP}`}>text</td>
                          <td className={`${TD} ${CMP_SEP}`}>Nguoi_dai_dien</td>
                          <td className={TD}>text</td>
                        </tr>
                        <tr className={TR}>
                          <td className={`${TD} ${CMP_SEP}`}>Dia_chi</td>
                          <td className={`${TD} ${CMP_SEP} ${CMP_OLD}`}>text</td>
                          <td className={`${TD} ${CMP_SEP}`}>Dia_chi_lien_he</td>
                          <td className={`${TD} ${CMP_NEW}`}>text (Cập nhật tiêu đề trường)</td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr className={TR}>
                          <td className={`${TD} ${CMP_SEP}`}>Ho_va_ten</td>
                          <td className={`${TD} ${CMP_SEP}`}>text</td>
                          <td className={`${TD} ${CMP_SEP}`}>Ho_va_ten</td>
                          <td className={TD}>text</td>
                        </tr>
                        <tr className={TR}>
                          <td className={`${TD} ${CMP_SEP}`}>Ngay_sinh</td>
                          <td className={`${TD} ${CMP_SEP} ${CMP_OLD}`}>date (DD/MM/YYYY)</td>
                          <td className={`${TD} ${CMP_SEP}`}>Ngay_sinh</td>
                          <td className={`${TD} ${CMP_NEW}`}>date (YYYY-MM-DD)</td>
                        </tr>
                        <tr className={TR}>
                          <td className={`${TD} ${CMP_SEP}`}>Gioi_tinh</td>
                          <td className={`${TD} ${CMP_SEP}`}>text</td>
                          <td className={`${TD} ${CMP_SEP}`}>Gioi_tinh</td>
                          <td className={TD}>text</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
                </div>
              </div>
            </div>

            {/* Footer Actions (Khôi phục, Tải về, Quay lại, Đóng) */}
            <div className={MODAL_FOOTER_SPLIT}>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toast.success(`Khôi phục dữ liệu về phiên bản ${selectedVersionToCompare.version} thành công!`);
                    setShowVersionComparisonModal(false);
                  }}
                  className={BTN_PRIMARY}
                >
                  <RotateCcw className="w-4 h-4" />
                  Khôi phục phiên bản
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success(`Đã tải xuống thành công tệp dữ liệu phiên bản ${selectedVersionToCompare.version}!`);
                  }}
                  className={BTN_OUTLINE}
                >
                  <Download className="w-4 h-4" />
                  Tải về
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowVersionComparisonModal(false);
                    setSelectedVersionToCompare(null);
                    setShowVersionHistoryModal(true);
                  }}
                  className={BTN_OUTLINE}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowVersionComparisonModal(false);
                    setSelectedVersionToCompare(null);
                    setSelectedDatasetForVersionHistory(null);
                  }}
                  className={BTN_OUTLINE}
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
