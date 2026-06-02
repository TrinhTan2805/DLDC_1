import { useState, useEffect } from 'react';
import { Plus, Search, Settings, Eye, Edit, Trash2, Save, X, CheckSquare, Share2, FileSearch, BarChart3, Filter, XCircle, Globe, Send, Check, Ban, Upload, Paperclip, RefreshCw, Clock, FileText, AlertCircle, Shield, ChevronDown, Download } from 'lucide-react';
import { units } from '../admin/GroupManagementPage';

interface DataField {
  id: string;
  name: string;
  dataType: string;
}

interface OpenDataCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  dataField: string;
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  dataFormat: string[];
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'draft';
  createdDate: string;
  updatedDate: string;
  approvalStatus?: 'draft' | 'pending' | 'approved' | 'rejected';
  customFields?: DataField[];
  version?: string;
}

const incrementVersion = (v?: string): string => {
  if (!v) return '1.0';
  const parts = v.split('.');
  if (parts.length !== 2) return '1.0';
  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);
  if (isNaN(major) || isNaN(minor)) return '1.0';
  const newMinor = minor + 1;
  if (newMinor >= 10) {
    return `${major + 1}.0`;
  }
  return `${major}.${newMinor}`;
};

const mockCategories: OpenDataCategory[] = [
  {
    id: '1',
    code: 'ODC001',
    name: 'Danh mục dữ liệu A',
    description: 'Dữ liệu thống kê về Bộ Tư Pháp',
    dataField: 'Bộ Tư Pháp',
    updateFrequency: 'monthly',
    dataFormat: ['JSON', 'CSV', 'XML'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2024',
    updatedDate: '10/12/2024',
    version: '1.0'
  },
  {
    id: '2',
    code: 'ODC002',
    name: 'Danh mục dữ liệu B',
    description: 'Dữ liệu thống kê về Cục Công nghệ thông tin',
    dataField: 'Cục Công nghệ thông tin',
    updateFrequency: 'quarterly',
    dataFormat: ['JSON', 'Excel'],
    status: 'pending',
    approvalStatus: 'pending',
    createdDate: '15/02/2024',
    updatedDate: '08/12/2024',
    version: '1.0'
  },
  {
    id: '3',
    code: 'ODC003',
    name: 'Danh mục dữ liệu C',
    description: 'Dữ liệu thống kê về Cục Hành chính tư pháp',
    dataField: 'Cục Hành chính tư pháp',
    updateFrequency: 'yearly',
    dataFormat: ['JSON', 'CSV'],
    status: 'rejected',
    approvalStatus: 'rejected',
    createdDate: '20/03/2024',
    updatedDate: '05/12/2024',
    version: '1.0'
  },
  {
    id: '4',
    code: 'ODC004',
    name: 'Danh mục dữ liệu D (Bản nháp)',
    description: 'Dữ liệu thống kê thử nghiệm chưa gửi duyệt',
    dataField: 'Bộ Tư Pháp',
    updateFrequency: 'monthly',
    dataFormat: ['JSON'],
    status: 'draft',
    approvalStatus: 'draft',
    createdDate: '02/06/2026',
    updatedDate: '02/06/2026',
    version: '1.0'
  },
];

// Mock data for Update Rules tab
const mockUpdateRules: OpenDataCategory[] = [
  {
    id: 'ur1',
    code: 'ODCM01',
    name: 'Quy tắc cập nhật danh mục A',
    description: 'Cập nhật tự động hàng tháng',
    dataField: 'Cục Công nghệ thông tin',
    updateFrequency: 'monthly',
    dataFormat: ['JSON'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2024',
    updatedDate: '25/12/2024'
  },
  {
    id: 'ur2',
    code: 'ODCM02',
    name: 'Quy tắc cập nhật danh mục B',
    description: 'Cập nhật tự động hàng quý',
    dataField: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'quarterly',
    dataFormat: ['JSON', 'CSV'],
    status: 'pending',
    approvalStatus: 'pending',
    createdDate: '15/01/2024',
    updatedDate: '24/12/2024'
  },
  {
    id: 'ur3',
    code: 'ODCM03',
    name: 'Quy tắc cập nhật danh mục C',
    description: 'Cập nhật tự động hàng năm',
    dataField: 'Cục Hành chính tư pháp',
    updateFrequency: 'yearly',
    dataFormat: ['JSON', 'XML'],
    status: 'rejected',
    approvalStatus: 'rejected',
    createdDate: '20/01/2024',
    updatedDate: '23/12/2024'
  },
  {
    id: 'ur4',
    code: 'ODCM04',
    name: 'Quy tắc cập nhật danh mục D',
    description: 'Cập nhật tự động hàng tháng',
    dataField: 'Cục Phổ biến, giáo dục pháp luật và Trợ giúp pháp lý',
    updateFrequency: 'monthly',
    dataFormat: ['JSON'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '05/02/2024',
    updatedDate: '22/12/2024'
  },
];

// Mock data for Approval tab
const mockApprovalList: OpenDataCategory[] = [
  {
    id: 'ap1',
    code: 'ODC005',
    name: 'Danh mục văn bản pháp luật',
    description: 'Chờ phê duyệt - Người trình: Nguyễn Văn A',
    dataField: 'Cục Kiểm tra văn bản & Quản lý xử lý VP hành chính',
    updateFrequency: 'monthly',
    dataFormat: ['JSON', 'XML'],
    status: 'pending',
    approvalStatus: 'pending',
    createdDate: '26/12/2024',
    updatedDate: '26/12/2024'
  },
  {
    id: 'ap2',
    code: 'ODC006',
    name: 'Danh mục đăng ký kinh doanh',
    description: 'Chờ phê duyệt - Người trình: Trần Thị B',
    dataField: 'Bộ Tư Pháp',
    updateFrequency: 'quarterly',
    dataFormat: ['JSON', 'CSV'],
    status: 'pending',
    approvalStatus: 'pending',
    createdDate: '25/12/2024',
    updatedDate: '25/12/2024'
  },
  {
    id: 'ap3',
    code: 'ODCM05',
    name: 'Quy tắc cập nhật công chứng',
    description: 'Chờ phê duyệt - Người trình: Lê Văn C',
    dataField: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'monthly',
    dataFormat: ['JSON'],
    status: 'pending',
    approvalStatus: 'pending',
    createdDate: '24/12/2024',
    updatedDate: '24/12/2024'
  },
  {
    id: 'ap4',
    code: 'ODC007',
    name: 'Danh mục hộ tịch',
    description: 'Đã phê duyệt - Người phê duyệt: Lê Văn C',
    dataField: 'Cục Hành chính tư pháp',
    updateFrequency: 'monthly',
    dataFormat: ['JSON', 'CSV'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '20/12/2024',
    updatedDate: '23/12/2024'
  },
  {
    id: 'ap5',
    code: 'ODC008',
    name: 'Danh mục trợ giúp pháp lý',
    description: 'Đã phê duyệt - Người phê duyệt: Trần Thị B',
    dataField: 'Cục Phổ biến, giáo dục pháp luật và Trợ giúp pháp lý',
    updateFrequency: 'quarterly',
    dataFormat: ['JSON'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '18/12/2024',
    updatedDate: '22/12/2024'
  },
  {
    id: 'ap6',
    code: 'ODC009',
    name: 'Danh mục luật sư',
    description: 'Từ chối - Lý do: Thiếu thông tin cấu trúc dữ liệu',
    dataField: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'yearly',
    dataFormat: ['JSON', 'XML'],
    status: 'rejected',
    approvalStatus: 'rejected',
    createdDate: '15/12/2024',
    updatedDate: '19/12/2024'
  },
];

// Mock data for History tab
interface HistoryRecord {
  id: string;
  version: string;
  code: string;
  name: string;
  changeType: 'create_category' | 'edit_category' | 'grant_permission' | 'add_metadata' | 'edit_metadata' | 'add_license';
  changeContent: string;
  user: string;
  timestamp: string;
  status: 'applied' | 'pending';
}

const mockHistory: HistoryRecord[] = [
  {
    id: 'h1',
    version: 'v1.5',
    code: 'ODC001',
    name: 'Danh mục văn bản pháp luật',
    changeType: 'edit_metadata',
    changeContent: 'Cập nhật tần suất từ "Hàng tháng" sang "Hàng ngày" cho metadata',
    user: 'Nguyễn Văn A',
    timestamp: '06/01/2025 14:30',
    status: 'applied'
  },
  {
    id: 'h2',
    version: 'v1.0',
    code: 'ODC002',
    name: 'Danh mục đăng ký kinh doanh',
    changeType: 'create_category',
    changeContent: 'Tạo mới danh mục "Danh mục đăng ký kinh doanh" trên hệ thống',
    user: 'Trần Thị B',
    timestamp: '06/01/2025 10:15',
    status: 'applied'
  },
  {
    id: 'h3',
    version: 'v1.3',
    code: 'ODC003',
    name: 'Danh mục công chứng',
    changeType: 'grant_permission',
    changeContent: 'Cấp quyền biên tập cho tài khoản tran_thi_c để quản lý metadata',
    user: 'Lê Văn C',
    timestamp: '05/01/2025 16:45',
    status: 'pending'
  },
  {
    id: 'h4',
    version: 'v1.8',
    code: 'ODC004',
    name: 'Danh mục TGPL',
    changeType: 'add_license',
    changeContent: 'Gán giấy phép ODC-BY cho tập dữ liệu',
    user: 'Phạm Thị D',
    timestamp: '05/01/2025 09:20',
    status: 'applied'
  },
  {
    id: 'h5',
    version: 'v2.0',
    code: 'ODC001',
    name: 'Danh mục văn bản pháp luật',
    changeType: 'edit_category',
    changeContent: 'Thay đổi lĩnh vực từ "Pháp luật chung" sang "Tư pháp"',
    user: 'Nguyễn Văn A',
    timestamp: '04/01/2025 11:00',
    status: 'applied'
  },
  {
    id: 'h6',
    version: 'v1.2',
    code: 'ODC005',
    name: 'Danh mục hộ tịch',
    changeType: 'add_metadata',
    changeContent: 'Thêm mới metadata cho danh mục với từ khóa "khai sinh, đăng ký kết hôn"',
    user: 'Trần Thị B',
    timestamp: '03/01/2025 15:30',
    status: 'applied'
  },
  {
    id: 'h7',
    version: 'v1.4',
    code: 'ODC006',
    name: 'Danh mục luật sư',
    changeType: 'edit_category',
    changeContent: 'Cập nhật lại mô tả chi tiết của danh mục',
    user: 'Lê Văn C',
    timestamp: '02/01/2025 08:45',
    status: 'pending'
  },
  {
    id: 'h8',
    version: 'v1.1',
    code: 'ODC007',
    name: 'Danh mục giám định tư pháp',
    changeType: 'grant_permission',
    changeContent: 'Thu hồi quyền biên tập danh mục của người dùng pham_thi_d',
    user: 'Phạm Thị D',
    timestamp: '01/01/2025 13:20',
    status: 'applied'
  },
  {
    id: 'h9',
    version: 'v1.6',
    code: 'ODC002',
    name: 'Danh mục đăng ký kinh doanh',
    changeType: 'edit_metadata',
    changeContent: 'Xóa các từ khóa không còn hợp lệ',
    user: 'Nguyễn Văn A',
    timestamp: '31/12/2024 10:00',
    status: 'applied'
  }
];

// Mock data for Category List tab
const mockCategoryList: OpenDataCategory[] = [
  {
    id: 'cat1',
    code: 'CAT001',
    name: 'Văn bản pháp luật',
    description: 'Danh mục văn bản quy phạm pháp luật',
    dataField: 'Tư pháp',
    updateFrequency: 'monthly',
    dataFormat: ['JSON', 'XML'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2024',
    updatedDate: '30/12/2024'
  },
  {
    id: 'cat2',
    code: 'CAT002',
    name: 'Hộ tịch',
    description: 'Danh mục dữ liệu hộ tịch',
    dataField: 'Hộ tịch',
    updateFrequency: 'monthly',
    dataFormat: ['JSON', 'CSV'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2024',
    updatedDate: '29/12/2024'
  },
  {
    id: 'cat3',
    code: 'CAT003',
    name: 'Công chứng',
    description: 'Danh mục dữ liệu công chứng',
    dataField: 'Công chứng',
    updateFrequency: 'quarterly',
    dataFormat: ['JSON'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2024',
    updatedDate: '28/12/2024'
  },
  {
    id: 'cat4',
    code: 'CAT004',
    name: 'Đăng ký kinh doanh',
    description: 'Danh mục dữ liệu đăng ký kinh doanh',
    dataField: 'Đăng ký kinh doanh',
    updateFrequency: 'monthly',
    dataFormat: ['JSON', 'CSV', 'XML'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2024',
    updatedDate: '27/12/2024'
  },
  {
    id: 'cat5',
    code: 'CAT005',
    name: 'Trợ giúp pháp lý',
    description: 'Danh mục dữ liệu TGPL',
    dataField: 'TGPL',
    updateFrequency: 'yearly',
    dataFormat: ['JSON'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2024',
    updatedDate: '26/12/2024'
  },
];

interface MetadataItem {
  id: string;
  categoryCodes: string[];
  description: string;
  keywords: string;
  licenseId: string;
  format: string;
  source: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  status: 'active' | 'inactive';
}

interface LicenseItem {
  id: string;
  name: string;
  shortName: string;
  description: string;
  terms: string;
  referenceUrl: string;
  status: 'active' | 'inactive';
}

const sampleMetadata: MetadataItem[] = [
  {
    id: 'm1',
    categoryCodes: ['ODC001'],
    description: 'Metadata cho dữ liệu mở A',
    keywords: 'luật, mở, thống kê',
    licenseId: 'l1',
    format: 'CSV',
    source: 'API nội bộ',
    frequency: 'monthly',
    status: 'active'
  },
  {
    id: 'm2',
    categoryCodes: ['ODC002'],
    description: 'Metadata cho dữ liệu mở B',
    keywords: 'doanh nghiệp, đăng ký',
    licenseId: 'l2',
    format: 'JSON',
    source: 'Cổng dịch vụ công',
    frequency: 'quarterly',
    status: 'active'
  }
];

const sampleLicenses: LicenseItem[] = [
  {
    id: 'l1',
    name: 'Giấy phép dữ liệu mở công cộng',
    shortName: 'GPDLMCC',
    description: 'Cho phép sử dụng và phân phối dữ liệu mở.',
    terms: 'Ghi nguồn là bắt buộc.',
    referenceUrl: 'https://example.com/license/cc0',
    status: 'active'
  },
  {
    id: 'l2',
    name: 'Giấy phép ODC-BY',
    shortName: 'ODC-BY',
    description: 'Yêu cầu ghi nhận nguồn khi sử dụng.',
    terms: 'Phải ghi rõ nguồn dữ liệu.',
    referenceUrl: 'https://example.com/license/odc-by',
    status: 'active'
  }
];

interface OpenDataSetupPageProps {
  onNavigate?: (page: string) => void;
}

export function OpenDataSetupPage({ onNavigate }: OpenDataSetupPageProps) {
  const [activeTab, setActiveTab] = useState<'management' | 'approval' | 'history' | 'metadata' | 'license'>('license');
  const [categories, setCategories] = useState<OpenDataCategory[]>(mockCategories);
  const [updateRules, setUpdateRules] = useState<OpenDataCategory[]>(mockUpdateRules);
  const [approvalList, setApprovalList] = useState<OpenDataCategory[]>(mockApprovalList);
  const [historyList, setHistoryList] = useState<HistoryRecord[]>(mockHistory);
  const [categoryList, setCategoryList] = useState<OpenDataCategory[]>(mockCategoryList);
  const [searchTerm, setSearchTerm] = useState('');
  const [approvalFilterTab, setApprovalFilterTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [metadataEntries, setMetadataEntries] = useState<MetadataItem[]>(sampleMetadata);
  const [licenseEntries, setLicenseEntries] = useState<LicenseItem[]>(sampleLicenses);
  const [selectedMetadata, setSelectedMetadata] = useState<MetadataItem | null>(null);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [metadataFormData, setMetadataFormData] = useState<MetadataItem>({
    id: '0',
    categoryCodes: [],
    description: '',
    keywords: '',
    licenseId: sampleLicenses[0]?.id || 'l1',
    format: 'CSV',
    source: '',
    frequency: 'monthly',
    status: 'active'
  });
  const [selectedLicense, setSelectedLicense] = useState<LicenseItem | null>(null);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [isLicenseViewOnly, setIsLicenseViewOnly] = useState(false);
  const [licenseFormData, setLicenseFormData] = useState<LicenseItem>({
    id: '0',
    name: '',
    shortName: '',
    description: '',
    terms: '',
    referenceUrl: '',
    status: 'active'
  });
  const [licenseError, setLicenseError] = useState('');
  const [searchMetadata, setSearchMetadata] = useState('');
  const [metadataFrequencyFilter, setMetadataFrequencyFilter] = useState('all');
  const [metadataFieldFilter, setMetadataFieldFilter] = useState('all');
  const [searchLicense, setSearchLicense] = useState('');
  const [licenseStatusFilter, setLicenseStatusFilter] = useState('all');
  
  const allFields = Array.from(new Set(mockCategories.map(c => c.dataField)));
  
  // History filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [changeTypeFilter, setChangeTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState('');
  const [formatFilter, setFormatFilter] = useState('');
  const [managementFromDate, setManagementFromDate] = useState('');
  const [managementToDate, setManagementToDate] = useState('');

  const getLicenseName = (licenseId: string) => {
    const license = licenseEntries.find(l => l.id === licenseId);
    return license ? license.name : 'Không xác định';
  };

  const openMetadataModal = (item?: MetadataItem) => {
    if (item) {
      setSelectedMetadata(item);
      setMetadataFormData(item);
    } else {
      setSelectedMetadata(null);
      setMetadataFormData({
        id: '0',
        categoryCodes: [],
        description: '',
        keywords: '',
        licenseId: sampleLicenses[0]?.id || 'l1',
        format: 'CSV',
        source: '',
        frequency: 'monthly',
        status: 'active'
      });
    }
    setShowMetadataModal(true);
  };

  const saveMetadata = () => {
    if (metadataFormData.categoryCodes.length === 0 || !metadataFormData.description || !metadataFormData.source) {
      return;
    }
    if (metadataFormData.id === '0') {
      setMetadataEntries([...metadataEntries, { ...metadataFormData, id: String(Date.now()) }]);
    } else {
      setMetadataEntries(metadataEntries.map(item => item.id === metadataFormData.id ? metadataFormData : item));
    }
    setShowMetadataModal(false);
  };

  const openLicenseModal = (item?: LicenseItem) => {
    setLicenseError('');
    setIsLicenseViewOnly(false);
    if (item) {
       setSelectedLicense(item);
       setLicenseFormData(item);
    } else {
       setSelectedLicense(null);
       setLicenseFormData({
         id: '0',
         name: '',
         shortName: '',
         description: '',
         terms: '',
         referenceUrl: '',
         status: 'active'
       });
    }
    setShowLicenseModal(true);
  };

  const viewLicenseModal = (item: LicenseItem) => {
    setSelectedLicense(item);
    setLicenseFormData(item);
    setIsLicenseViewOnly(true);
    setShowLicenseModal(true);
  };

  const saveLicense = () => {
    if (!licenseFormData.name || !licenseFormData.shortName || !licenseFormData.description || !licenseFormData.terms || !licenseFormData.referenceUrl) {
      return;
    }
    // Check duplicate shortName when adding a new license
    if (licenseFormData.id === '0') {
      const isDuplicate = licenseEntries.some(
        l => l.shortName.toLowerCase() === licenseFormData.shortName.toLowerCase()
      );
      if (isDuplicate) {
        setLicenseError('Giấy phép đã tồn tại');
        return;
      }
    }
    if (licenseFormData.id === '0') {
      setLicenseEntries([...licenseEntries, { ...licenseFormData, id: String(Date.now()) }]);
    } else {
      setLicenseEntries(licenseEntries.map(item => item.id === licenseFormData.id ? licenseFormData : item));
    }
    setShowLicenseModal(false);
  };
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<OpenDataCategory | null>(null);
  const [approvalAction, setApprovalAction] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rejectReason, setRejectReason] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [selectedApprover, setSelectedApprover] = useState('');

  // Mock list of approvers
  const approvers = [
    { id: '1', name: 'Nguyễn Văn A', position: 'Trưởng phòng Công nghệ thông tin' },
    { id: '2', name: 'Trần Thị B', position: 'Phó Giám đốc' },
    { id: '3', name: 'Lê Văn C', position: 'Giám đốc' },
    { id: '4', name: 'Phạm Thị D', position: 'Trưởng phòng Nghiệp vụ' }
  ];

  // Mock database tables and their fields
  const mockDatabaseTables = [
    { id: 'tb1', name: 'van_ban_phap_luat', displayName: 'Văn bản pháp luật' },
    { id: 'tb2', name: 'dang_ky_kinh_doanh', displayName: 'Đăng ký kinh doanh' },
    { id: 'tb3', name: 'cong_chung', displayName: 'Công chứng' },
    { id: 'tb4', name: 'tro_giup_phap_ly', displayName: 'Trợ giúp pháp lý' },
    { id: 'tb5', name: 'ho_tich', displayName: 'Hộ tịch' },
    { id: 'tb6', name: 'luat_su', displayName: 'Luật sư' },
    { id: 'tb7', name: 'giam_dinh_tu_phap', displayName: 'Giám định tư pháp' },
  ];

  const mockTableFields: { [key: string]: Array<{ id: string; name: string; type: string; description: string }> } = {
    'tb1': [
      { id: 'f1', name: 'ma_van_ban', type: 'VARCHAR(50)', description: 'Mã văn bản' },
      { id: 'f2', name: 'ten_van_ban', type: 'VARCHAR(500)', description: 'Tên văn bản' },
      { id: 'f3', name: 'loai_van_ban', type: 'VARCHAR(100)', description: 'Loại văn bản' },
      { id: 'f4', name: 'co_quan_ban_hanh', type: 'VARCHAR(255)', description: 'Cơ quan ban hành' },
      { id: 'f5', name: 'ngay_ban_hanh', type: 'DATE', description: 'Ngày ban hành' },
      { id: 'f6', name: 'ngay_hieu_luc', type: 'DATE', description: 'Ngày hiệu lực' },
      { id: 'f7', name: 'noi_dung', type: 'TEXT', description: 'Nội dung văn bản' },
      { id: 'f8', name: 'trang_thai', type: 'ENUM', description: 'Trạng thái' },
    ],
    'tb2': [
      { id: 'f1', name: 'ma_doanh_nghiep', type: 'VARCHAR(50)', description: 'Mã doanh nghiệp' },
      { id: 'f2', name: 'ten_doanh_nghiep', type: 'VARCHAR(255)', description: 'Tên doanh nghiệp' },
      { id: 'f3', name: 'dia_chi', type: 'VARCHAR(500)', description: 'Địa chỉ' },
      { id: 'f4', name: 'nguoi_dai_dien', type: 'VARCHAR(255)', description: 'Người đại diện' },
      { id: 'f5', name: 'ngay_dang_ky', type: 'DATE', description: 'Ngày đăng ký' },
      { id: 'f6', name: 'von_dieu_le', type: 'DECIMAL', description: 'Vốn điều lệ' },
      { id: 'f7', name: 'nganh_nghe', type: 'VARCHAR(255)', description: 'Ngành nghề kinh doanh' },
      { id: 'f8', name: 'trang_thai', type: 'ENUM', description: 'Trạng thái hoạt động' },
    ],
    'tb3': [
      { id: 'f1', name: 'ma_giao_dich', type: 'VARCHAR(50)', description: 'Mã giao dịch' },
      { id: 'f2', name: 'loai_hop_dong', type: 'VARCHAR(255)', description: 'Loại hợp đồng' },
      { id: 'f3', name: 'to_chuc_cong_chung', type: 'VARCHAR(255)', description: 'Tổ chức công chứng' },
      { id: 'f4', name: 'ngay_cong_chung', type: 'DATE', description: 'Ngày công chứng' },
      { id: 'f5', name: 'ben_a', type: 'VARCHAR(255)', description: 'Bên A' },
      { id: 'f6', name: 'ben_b', type: 'VARCHAR(255)', description: 'Bên B' },
      { id: 'f7', name: 'noi_dung', type: 'TEXT', description: 'Nội dung' },
    ],
    'tb4': [
      { id: 'f1', name: 'ma_ho_so', type: 'VARCHAR(50)', description: 'Mã hồ sơ' },
      { id: 'f2', name: 'ho_ten', type: 'VARCHAR(255)', description: 'Họ tên người được hỗ trợ' },
      { id: 'f3', name: 'cccd', type: 'VARCHAR(20)', description: 'Số CCCD' },
      { id: 'f4', name: 'loai_ho_tro', type: 'VARCHAR(255)', description: 'Loại hỗ trợ' },
      { id: 'f5', name: 'ngay_tiep_nhan', type: 'DATE', description: 'Ngày tiếp nhận' },
      { id: 'f6', name: 'trang_thai', type: 'ENUM', description: 'Trạng thái xử lý' },
    ],
    'tb5': [
      { id: 'f1', name: 'ma_khai_sinh', type: 'VARCHAR(50)', description: 'Mã khai sinh' },
      { id: 'f2', name: 'ho_ten', type: 'VARCHAR(255)', description: 'Họ tên' },
      { id: 'f3', name: 'ngay_sinh', type: 'DATE', description: 'Ngày sinh' },
      { id: 'f4', name: 'gioi_tinh', type: 'ENUM', description: 'Giới tính' },
      { id: 'f5', name: 'noi_sinh', type: 'VARCHAR(255)', description: 'Nơi sinh' },
      { id: 'f6', name: 'ho_ten_cha', type: 'VARCHAR(255)', description: 'Họ tên cha' },
      { id: 'f7', name: 'ho_ten_me', type: 'VARCHAR(255)', description: 'Họ tên mẹ' },
    ],
    'tb6': [
      { id: 'f1', name: 'ma_luat_su', type: 'VARCHAR(50)', description: 'Mã luật sư' },
      { id: 'f2', name: 'ho_ten', type: 'VARCHAR(255)', description: 'Họ tên luật sư' },
      { id: 'f3', name: 'so_the', type: 'VARCHAR(50)', description: 'Số thẻ luật sư' },
      { id: 'f4', name: 'van_phong', type: 'VARCHAR(255)', description: 'Văn phòng luật sư' },
      { id: 'f5', name: 'ngay_cap', type: 'DATE', description: 'Ngày cấp thẻ' },
      { id: 'f6', name: 'trang_thai', type: 'ENUM', description: 'Trạng thái hoạt động' },
    ],
    'tb7': [
      { id: 'f1', name: 'ma_giam_dinh', type: 'VARCHAR(50)', description: 'Mã giám định' },
      { id: 'f2', name: 'loai_giam_dinh', type: 'VARCHAR(255)', description: 'Loại giám định' },
      { id: 'f3', name: 'to_chuc_giam_dinh', type: 'VARCHAR(255)', description: 'Tổ chức giám định' },
      { id: 'f4', name: 'ngay_giam_dinh', type: 'DATE', description: 'Ngày giám định' },
      { id: 'f5', name: 'ket_qua', type: 'TEXT', description: 'Kết quả giám định' },
    ],
  };

  // Form state for add/edit
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    dataField: '',
    updateFrequency: 'monthly' as const,
    dataFormat: [] as string[],
    status: 'active' as const,
    selectedTable: '',
    selectedFields: [] as string[],
    version: '1.0'
  });

  // Custom fields state
  const [customFields, setCustomFields] = useState<DataField[]>([]);
  
  // Attached files state
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'management':
        return categories;
      case 'approval':
        return approvalList;
      default:
        return categories;
    }
  };

  const currentData = getCurrentData();
  
  const setCurrentData = (data: OpenDataCategory[]) => {
    switch (activeTab) {
      case 'management':
        setCategories(data);
        break;
      case 'approval':
        setApprovalList(data);
        break;
    }
  };

  // Filter logic
  const filteredMetadataEntries = metadataEntries.filter(m => {
    const matchSearch = m.description.toLowerCase().includes(searchMetadata.toLowerCase()) || m.keywords.toLowerCase().includes(searchMetadata.toLowerCase());
    const matchFreq = metadataFrequencyFilter === 'all' || m.frequency === metadataFrequencyFilter;
    
    let matchField = true;
    if (metadataFieldFilter !== 'all') {
      const linkedFields = m.categoryCodes.map(code => categories.find(c => c.code === code)?.dataField).filter(Boolean);
      matchField = linkedFields.includes(metadataFieldFilter);
    }
    return matchSearch && matchFreq && matchField;
  });

  const filteredLicenseEntries = licenseEntries.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(searchLicense.toLowerCase()) || l.description.toLowerCase().includes(searchLicense.toLowerCase());
    const matchStatus = licenseStatusFilter === 'all' || l.status === licenseStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredCategories = currentData.filter(cat => {
    const matchSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cat.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || cat.approvalStatus === statusFilter;
    const matchUnit = !unitFilter || cat.dataField === unitFilter;
    const matchFrequency = !frequencyFilter || cat.updateFrequency === frequencyFilter;
    return matchSearch && matchStatus && matchUnit && matchFrequency;
  });

  // Filter for approval tab with status filter
  const filteredApprovalList = approvalList.filter(cat => {
    const matchSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cat.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = approvalFilterTab === 'all' || cat.approvalStatus === approvalFilterTab;
    return matchSearch && matchStatus;
  });

  // Get approval stats
  const approvalStats = {
    pending: approvalList.filter(c => c.approvalStatus === 'pending').length,
    approved: approvalList.filter(c => c.approvalStatus === 'approved').length,
    rejected: approvalList.filter(c => c.approvalStatus === 'rejected').length
  };

  // Filter for history
  const filteredHistory = historyList.filter(record => {
    const matchSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       record.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       record.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchChangeType = !changeTypeFilter || record.changeType === changeTypeFilter;
    const matchStatus = !statusFilter || record.status === statusFilter;
    
    // Date filtering
    let matchDate = true;
    if (fromDate || toDate) {
      const recordDate = new Date(record.timestamp.split(' ')[0].split('/').reverse().join('-'));
      if (fromDate) {
        const from = new Date(fromDate);
        matchDate = matchDate && recordDate >= from;
      }
      if (toDate) {
        const to = new Date(toDate);
        matchDate = matchDate && recordDate <= to;
      }
    }
    
    return matchSearch && matchChangeType && matchStatus && matchDate;
  });

  // Pagination State
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPageNum(1);
  }, [activeTab]);

  const paginatedLicenses = filteredLicenseEntries.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);
  const paginatedCategories = filteredCategories.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);
  const paginatedMetadata = filteredMetadataEntries.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);
  const paginatedHistory = filteredHistory.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);
  const paginatedApproval = filteredApprovalList.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const [showFilters, setShowFilters] = useState(false);


  const renderFilterRow = () => {
    let placeholder = "Tìm kiếm...";
    let searchValue = "";
    let setSearchValue: (val: string) => void = () => {};
    let showAddButton = false;
    let addLabel = "Thêm mới";
    let onAddClick = () => {};

    switch (activeTab) {
      case 'license':
        placeholder = "Tìm kiếm theo tên giấy phép, tên viết tắt...";
        searchValue = searchLicense;
        setSearchValue = setSearchLicense;
        showAddButton = true;
        addLabel = "Thêm giấy phép";
        onAddClick = () => openLicenseModal();
        break;
      case 'management':
        placeholder = "Tìm kiếm theo mã, tên danh mục...";
        searchValue = searchTerm;
        setSearchValue = setSearchTerm;
        showAddButton = true;
        addLabel = "Thêm danh mục mới";
        onAddClick = handleAdd;
        break;
      case 'approval':
        placeholder = "Tìm kiếm theo tên, mã danh mục...";
        searchValue = searchTerm;
        setSearchValue = setSearchTerm;
        break;
      case 'metadata':
        placeholder = "Tìm kiếm metadata...";
        searchValue = searchMetadata;
        setSearchValue = setSearchMetadata;
        showAddButton = true;
        addLabel = "Thêm Metadata";
        onAddClick = () => openMetadataModal();
        break;
      case 'history':
        placeholder = "Tìm kiếm lịch sử thay đổi...";
        searchValue = searchTerm;
        setSearchValue = setSearchTerm;
        break;
    }

    return (
      <div className="space-y-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 w-full flex items-center gap-2">
              <input
                type="text"
                placeholder={placeholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center shrink-0 transition-colors shadow-sm"
                title="Tìm kiếm"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  showFilters
                    ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title={showFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
              >
                {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              {showAddButton && (
                <button
                  type="button"
                  onClick={onAddClick}
                  className="flex-1 md:flex-none px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  {addLabel}
                </button>
              )}

              {activeTab !== 'license' && activeTab !== 'history' && (
                <button
                  type="button"
                  onClick={() => alert('Xuất file báo cáo thành công!')}
                  className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  Kết xuất
                </button>
              )}
            </div>
          </div>

          {/* Advanced Collapsible Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              {activeTab === 'license' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Trạng thái giấy phép</label>
                    <div className="relative">
                      <select
                        value={licenseStatusFilter}
                        onChange={(e) => setLicenseStatusFilter(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Còn hiệu lực</option>
                        <option value="inactive">Hết hiệu lực</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'management' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Trạng thái danh mục</label>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer text-slate-700"
                      >
                        <option value="">Tất cả trạng thái</option>
                        <option value="draft">Bản nháp</option>
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã phê duyệt</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Đơn vị chủ trì</label>
                    <div className="relative">
                      <select
                        value={unitFilter}
                        onChange={(e) => setUnitFilter(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer text-slate-700"
                      >
                        <option value="">Tất cả đơn vị</option>
                        {units.map((unit) => (
                          <option key={unit.id} value={unit.name}>
                            {unit.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tần suất cập nhật</label>
                    <div className="relative">
                      <select
                        value={frequencyFilter}
                        onChange={(e) => setFrequencyFilter(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer text-slate-700"
                      >
                        <option value="">Tất cả tần suất</option>
                        <option value="monthly">Hàng tháng</option>
                        <option value="quarterly">Hàng quý</option>
                        <option value="yearly">Hàng năm</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'approval' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Trạng thái phê duyệt</label>
                  <div className="flex gap-2">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => {
                      const labels = { all: 'Tất cả', pending: 'Chờ phê duyệt', approved: 'Đã phê duyệt', rejected: 'Từ chối' };
                      const count = status === 'all' ? approvalList.length : approvalList.filter(item => item.approvalStatus === status).length;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setApprovalFilterTab(status)}
                          className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            approvalFilterTab === status
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {labels[status]} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'metadata' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tần suất</label>
                    <div className="relative">
                      <select
                        value={metadataFrequencyFilter}
                        onChange={(e) => setMetadataFrequencyFilter(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                      >
                        <option value="all">Tất cả tần suất</option>
                        <option value="daily">Hàng ngày</option>
                        <option value="weekly">Hàng tuần</option>
                        <option value="monthly">Hàng tháng</option>
                        <option value="quarterly">Hàng quý</option>
                        <option value="yearly">Hàng năm</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Lĩnh vực</label>
                    <div className="relative">
                      <select
                        value={metadataFieldFilter}
                        onChange={(e) => setMetadataFieldFilter(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                      >
                        <option value="all">Tất cả lĩnh vực</option>
                        {allFields.map((field, idx) => (
                          <option key={idx} value={field}>{field}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Từ ngày</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Đến ngày</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Loại thay đổi</label>
                    <div className="relative">
                      <select
                        value={changeTypeFilter}
                        onChange={(e) => setChangeTypeFilter(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Tất cả</option>
                        <option value="create_category">Tạo danh mục</option>
                        <option value="edit_category">Chỉnh sửa DM</option>
                        <option value="grant_permission">Cấp quyền</option>
                        <option value="add_metadata">Thêm metadata</option>
                        <option value="edit_metadata">Sửa metadata</option>
                        <option value="add_license">Thêm giấy phép</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Trạng thái</label>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Tất cả</option>
                        <option value="applied">Đã áp dụng</option>
                        <option value="pending">Chờ xử lý</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPagination = (totalItemsCount: number) => {
    if (totalItemsCount <= 0) return null;
    const totalPages = Math.ceil(totalItemsCount / pageSize);
    const startItem = (currentPageNum - 1) * pageSize + 1;
    const endItem = Math.min(currentPageNum * pageSize, totalItemsCount);

    return (
      <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 collection-pagination text-[13px]">
        {/* Left Side: Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Hiển thị</span>
          <select
            aria-label="Select record count"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPageNum(1);
            }}
            className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[13px] cursor-pointer"
            title="Số bản ghi trên trang"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-slate-600">bản ghi/trang</span>
        </div>

        {/* Right Side: Page Range and Navigation */}
        <div className="flex items-center gap-4">
          <span className="text-slate-600">
            {startItem} - {endItem} / {totalItemsCount}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
              disabled={currentPageNum === 1}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPageNum(page)}
                className={`px-3 py-1.5 border rounded-lg font-medium text-[13px] transition-colors ${
                  currentPageNum === page
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
              disabled={currentPageNum === totalPages}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Handlers
  const handleSync = (category: OpenDataCategory) => {
    alert(`Đồng bộ dữ liệu cho danh mục: ${category.name}`);
  };

  const handleComplete = (category: OpenDataCategory) => {
    setCurrentData(currentData.map(c =>
      c.id === category.id
        ? { ...c, status: 'approved', approvalStatus: 'approved' }
        : c
    ));
  };

  const handleDisable = (category: OpenDataCategory) => {
    setCurrentData(currentData.map(c =>
      c.id === category.id
        ? { ...c, status: 'rejected', approvalStatus: 'rejected' }
        : c
    ));
  };

  const handleAdd = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      dataField: '',
      updateFrequency: 'monthly',
      dataFormat: [],
      status: 'active',
      selectedTable: '',
      selectedFields: [],
      version: '1.0'
    });
    setCustomFields([]);
    setAttachedFiles([]);
    setShowAddModal(true);
  };

  const handleView = (category: OpenDataCategory) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleEdit = (category: OpenDataCategory) => {
    setSelectedCategory(category);
    setFormData({
      code: category.code,
      name: category.name,
      description: category.description,
      dataField: category.dataField,
      updateFrequency: category.updateFrequency,
      dataFormat: category.dataFormat,
      status: category.status as 'active' | 'inactive',
      selectedTable: '',
      selectedFields: [],
      version: category.version || '1.0'
    });
    setShowEditModal(true);
  };

  const handleDelete = (category: OpenDataCategory) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      setCurrentData(currentData.filter(c => c.id !== selectedCategory.id));
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  };

  const handleSaveAdd = () => {
    const newCategory: OpenDataCategory = {
      id: String(currentData.length + 1),
      ...formData,
      version: '1.0',
      status: 'draft',
      approvalStatus: 'draft',
      createdDate: new Date().toLocaleDateString('vi-VN'),
      updatedDate: new Date().toLocaleDateString('vi-VN')
    };
    setCurrentData([...currentData, newCategory]);
    setShowAddModal(false);
  };

  const handleSaveEdit = () => {
    if (selectedCategory) {
      setCurrentData(currentData.map(c =>
        c.id === selectedCategory.id
          ? { 
              ...c, 
              ...formData, 
              status: 'draft',
              approvalStatus: 'draft',
              version: incrementVersion(c.version), 
              updatedDate: new Date().toLocaleDateString('vi-VN') 
            }
          : c
      ));
      setShowEditModal(false);
      setSelectedCategory(null);
    }
  };

  const handleSendApproval = () => {
    if (showAddModal) {
      const newCategory: OpenDataCategory = {
        id: String(currentData.length + 1),
        ...formData,
        version: '1.0',
        status: 'pending',
        approvalStatus: 'pending',
        createdDate: new Date().toLocaleDateString('vi-VN'),
        updatedDate: new Date().toLocaleDateString('vi-VN')
      };
      setCurrentData([...currentData, newCategory]);
    } else if (showEditModal && selectedCategory) {
      setCurrentData(currentData.map(c =>
        c.id === selectedCategory.id
          ? { 
              ...c, 
              ...formData, 
              status: 'pending',
              approvalStatus: 'pending',
              version: incrementVersion(c.version), 
              updatedDate: new Date().toLocaleDateString('vi-VN') 
            }
          : c
      ));
      setSelectedCategory(null);
    } else if (showViewModal && selectedCategory) {
      setCurrentData(currentData.map(c =>
        c.id === selectedCategory.id
          ? { 
              ...c, 
              status: 'pending',
              approvalStatus: 'pending',
              updatedDate: new Date().toLocaleDateString('vi-VN') 
            }
          : c
      ));
      setSelectedCategory(null);
    }
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    alert('Đã gửi yêu cầu phê duyệt!');
  };

  const handleSubmitForApproval = (category: OpenDataCategory) => {
    setSelectedCategory(category);
    setApprovalAction('pending');
    setShowApprovalModal(true);
  };

  const handleApprove = (category: OpenDataCategory) => {
    setSelectedCategory(category);
    setApprovalAction('approved');
    setShowApprovalModal(true);
  };

  const handleReject = (category: OpenDataCategory) => {
    setSelectedCategory(category);
    setApprovalAction('rejected');
    setRejectReason('');
    setShowApprovalModal(true);
  };

  const handleCategoryClick = (category: OpenDataCategory) => {
    if (onNavigate) {
      // Map category id to route
      const routeMap: Record<string, string> = {
        '1': 'open-data-category-a',
        '2': 'open-data-category-b',
        '3': 'open-data-category-c',
      };
      const route = routeMap[category.id] || 'open-data-category-a';
      onNavigate(route);
    }
  };

  const confirmApprovalAction = () => {
    if (selectedCategory) {
      setCurrentData(currentData.map(c =>
        c.id === selectedCategory.id
          ? { ...c, status: approvalAction, approvalStatus: approvalAction }
          : c
      ));
      setShowApprovalModal(false);
      setSelectedCategory(null);
      setRejectReason('');
    }
  };

  // Custom field handlers
  const handleAddCustomField = () => {
    const newField: DataField = {
      id: String(Date.now()),
      name: '',
      dataType: 'text'
    };
    setCustomFields([...customFields, newField]);
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const handleUpdateCustomField = (id: string, field: Partial<DataField>) => {
    setCustomFields(customFields.map(f =>
      f.id === id ? { ...f, ...field } : f
    ));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      inactive: 'bg-slate-100 text-slate-600 border-slate-200',
      pending: 'bg-purple-100 text-purple-700 border-purple-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-orange-100 text-orange-700 border-orange-200',
      monthly: 'bg-purple-100 text-purple-700 border-purple-200',
      quarterly: 'bg-blue-100 text-blue-700 border-blue-200',
      yearly: 'bg-amber-100 text-amber-700 border-amber-200'
    };
    const labels = {
      active: 'Hoạt động',
      inactive: 'Ngừng hoạt động',
      pending: 'Hàng tháng',
      approved: 'Hoạt động',
      rejected: 'Ngừng hoạt động',
      monthly: 'Hàng tháng',
      quarterly: 'Hàng quý',
      yearly: 'Hàng năm'
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const getApprovalStatusBadge = (status?: string) => {
    if (!status) return null;
    const styles = {
      draft: 'bg-slate-100 text-slate-700 border-slate-200',
      pending: 'bg-purple-100 text-purple-700 border-purple-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    const labels = {
      draft: 'Bản nháp',
      pending: 'Chờ duyệt',
      approved: 'Đã phê duyệt',
      rejected: 'Từ chối'
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex px-6 gap-2">
          <button
            onClick={() => setActiveTab('license')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'license'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Shield className={`w-4 h-4 ${activeTab === 'license' ? 'text-blue-600' : 'text-slate-400'}`} />
            Giấy phép
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'management'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Settings className={`w-4 h-4 ${activeTab === 'management' ? 'text-blue-600' : 'text-slate-400'}`} />
            Quản lý danh mục
          </button>
          <button
            onClick={() => setActiveTab('approval')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'approval'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <CheckSquare className={`w-4 h-4 ${activeTab === 'approval' ? 'text-blue-600' : 'text-slate-400'}`} />
            Phê duyệt
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'metadata'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <FileText className={`w-4 h-4 ${activeTab === 'metadata' ? 'text-blue-600' : 'text-slate-400'}`} />
            Metadata
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Clock className={`w-4 h-4 ${activeTab === 'history' ? 'text-blue-600' : 'text-slate-400'}`} />
            Lịch sử thay đổi
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6">
        {renderFilterRow()}


        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse collection-table text-[13px]">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
                <tr>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-12 text-[13px]">STT</th>
                  {activeTab === 'history' ? (
                    <>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px] w-24">Phiên bản</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px] w-40">Ngày thay đổi</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Người thay đổi</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Danh mục</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Loại thay đổi</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Nội dung thay đổi</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Trạng thái</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px] w-28">Thao tác</th>
                    </>
                  ) : activeTab === 'metadata' ? (
                    <>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Tập dữ liệu</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Mô tả</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Giấy phép</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Định dạng</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Tần suất</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Trạng thái</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px] w-32">Thao tác</th>
                    </>
                  ) : activeTab === 'license' ? (
                    <>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Tên giấy phép</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Tên viết tắt</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Mô tả</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Điều kiện sử dụng</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Trạng thái</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px] w-32">Thao tác</th>
                    </>
                  ) : activeTab === 'approval' ? (
                    <>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Mã danh mục</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Tên danh mục</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Đơn vị chủ trì cung cấp</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Tần suất gửi</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Trạng thái phê duyệt</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px] w-32">Thao tác</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Mã danh mục</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Tên danh mục</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Đơn vị chủ trì cung cấp</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Tần suất cập nhật</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Trạng thái</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px] w-48">Thao tác</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {activeTab === 'history' ? (
                  paginatedHistory.length > 0 ? (
                    paginatedHistory.map((record, index) => (
                      <tr key={record.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                        <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">{(currentPageNum - 1) * pageSize + index + 1}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold border border-purple-100">
                            {record.version}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 text-[13px] font-mono">{record.timestamp}</td>
                        <td className="px-4 py-3 text-left text-slate-600 font-medium text-[13px]">{record.user}</td>
                        <td className="px-4 py-3 text-left text-[13px]">
                          <div>
                            <div className="font-semibold text-slate-900 leading-snug">{record.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{record.code}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {record.changeType === 'create_category' && (
                            <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-100">
                              Tạo danh mục
                            </span>
                          )}
                          {record.changeType === 'edit_category' && (
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                              Chỉnh sửa DM
                            </span>
                          )}
                          {record.changeType === 'grant_permission' && (
                            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold border border-purple-100">
                              Cấp quyền
                            </span>
                          )}
                          {record.changeType === 'add_metadata' && (
                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-100">
                              Thêm metadata
                            </span>
                          )}
                          {record.changeType === 'edit_metadata' && (
                            <span className="px-2.5 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-semibold border border-sky-100">
                              Sửa metadata
                            </span>
                          )}
                          {record.changeType === 'add_license' && (
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-100">
                              Thêm giấy phép
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-left text-slate-600 max-w-xs truncate text-[13px]" title={record.changeContent}>
                          {record.changeContent}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {record.status === 'applied' ? (
                            <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-100">
                              Đã áp dụng
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold border border-yellow-100">
                              Chờ xử lý
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => handleView(record as any)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => alert(`Tải xuống phiên bản ${record.version}`)} className="p-1.5 text-slate-500 hover:text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors" title="Tải xuống">
                              <FileText className="w-4 h-4" />
                            </button>
                            <button onClick={() => alert(`Khôi phục về phiên bản ${record.version}`)} className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Khôi phục">
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-500">Không tìm thấy dữ liệu</td></tr>
                  )
                ) : activeTab === 'metadata' ? (
                  paginatedMetadata.length > 0 ? (
                    paginatedMetadata.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                        <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">{(currentPageNum - 1) * pageSize + index + 1}</td>
                        <td className="px-4 py-3 text-left">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {item.categoryCodes.map(code => (
                              <code key={code} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs border border-slate-200">{code}</code>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-left text-[13px]">
                          <div className="font-semibold text-slate-900 leading-snug">{item.description}</div>
                          <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-1 font-normal">
                            Từ khóa: {item.keywords.split(',').map((k, i) => k.trim() && <span key={i} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px]">{k.trim()}</span>)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-left text-[13px]">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">{getLicenseName(item.licenseId)}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold border border-slate-200">{item.format}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 font-medium text-[13px]">
                          {item.frequency === 'daily' ? 'Hàng ngày' : item.frequency === 'weekly' ? 'Hàng tuần' : item.frequency === 'monthly' ? 'Hàng tháng' : 'Hàng quý'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${item.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                            {item.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => openMetadataModal(item)} className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Chỉnh sửa">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">Không tìm thấy dữ liệu</td></tr>
                  )
                ) : activeTab === 'license' ? (
                  paginatedLicenses.length > 0 ? (
                    paginatedLicenses.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                        <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">{(currentPageNum - 1) * pageSize + index + 1}</td>
                        <td className="px-4 py-3 text-left text-[13px]">
                          <div>
                            <span className="font-medium text-slate-950 leading-snug">{item.name}</span>
                            <a href={item.referenceUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1 font-normal w-max">
                              <Globe className="w-3 h-3" /> Nguồn tham chiếu
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-left text-[13px]">
                          {item.shortName && (
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold border border-slate-200">
                              {item.shortName}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-left text-slate-600 text-[13px]">{item.description}</td>
                        <td className="px-4 py-3 text-left text-slate-500 max-w-xs truncate text-[13px]" title={item.terms}>{item.terms}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${item.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                            {item.status === 'active' ? 'Còn hiệu lực' : 'Hết hiệu lực'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => viewLicenseModal(item)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openLicenseModal(item)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">Không tìm thấy dữ liệu</td></tr>
                  )
                ) : activeTab === 'approval' ? (
                  paginatedApproval.length > 0 ? (
                    paginatedApproval.map((category, index) => (
                      <tr key={category.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                        <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">{(currentPageNum - 1) * pageSize + index + 1}</td>
                        <td className="px-4 py-3 text-left">
                          <code className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs border border-slate-200">{category.code}</code>
                        </td>
                        <td className="px-4 py-3 text-left text-[13px] font-semibold text-slate-950">{category.name}</td>
                        <td className="px-4 py-3 text-left text-slate-600 font-medium text-[13px]">{category.dataField}</td>
                        <td className="px-4 py-3 text-center text-[13px]">{getStatusBadge(category.updateFrequency)}</td>
                        <td className="px-4 py-3 text-center">
                          {getApprovalStatusBadge(category.approvalStatus)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => handleView(category)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết">
                              <Eye className="w-4 h-4" />
                            </button>
                            {category.approvalStatus === 'pending' && (
                              <>
                                <button onClick={() => handleApprove(category)} className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Phê duyệt">
                                  <Check className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleReject(category)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Từ chối">
                                  <Ban className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">Không tìm thấy dữ liệu</td></tr>
                  )
                ) : (
                  paginatedCategories.length > 0 ? (
                    paginatedCategories.map((category, index) => (
                      <tr key={category.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                        <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">{(currentPageNum - 1) * pageSize + index + 1}</td>
                        <td className="px-4 py-3 text-left">
                          <code className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs border border-slate-200">{category.code}</code>
                        </td>
                        <td className="px-4 py-3 text-left text-[13px]">
                          {activeTab === 'management' ? (
                            <button onClick={() => handleCategoryClick(category)} className="text-left w-full hover:bg-transparent p-0">
                              <div className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">
                                {category.name}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5 leading-snug">{category.description}</div>
                            </button>
                          ) : (
                            <div>
                              <div className="font-semibold text-slate-950 leading-snug">{category.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5 leading-snug">{category.description}</div>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-left text-slate-600 font-medium text-[13px]">{category.dataField}</td>
                        <td className="px-4 py-3 text-center text-[13px]">{getStatusBadge(category.updateFrequency)}</td>
                        <td className="px-4 py-3 text-center text-[13px]">{getApprovalStatusBadge(category.approvalStatus)}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => handleView(category)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleEdit(category)} className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Chỉnh sửa">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(category)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {activeTab === 'management' && (
                              <button
                                onClick={() => handleSubmitForApproval(category)}
                                disabled={category.approvalStatus === 'approved' || category.approvalStatus === 'pending'}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  category.approvalStatus === 'approved' || category.approvalStatus === 'pending'
                                    ? 'text-slate-300 cursor-not-allowed bg-transparent'
                                    : 'text-slate-500 hover:text-purple-600 hover:bg-purple-50'
                                }`}
                                title="Gửi duyệt"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">Không tìm thấy dữ liệu</td></tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          {activeTab === 'license' && renderPagination(filteredLicenseEntries.length)}
          {activeTab === 'metadata' && renderPagination(filteredMetadataEntries.length)}
          {activeTab === 'management' && renderPagination(filteredCategories.length)}
          {activeTab === 'history' && renderPagination(filteredHistory.length)}
          {activeTab === 'approval' && renderPagination(filteredApprovalList.length)}
        </div>
      </div>

      {/* Metadata Modal */}
      {showMetadataModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedMetadata ? 'Chỉnh sửa Metadata' : 'Thêm mới Metadata'}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Quản lý thông tin metadata cho dữ liệu mở, bao gồm giấy phép, định dạng và nguồn dữ liệu.
                </p>
              </div>
              <button onClick={() => setShowMetadataModal(false)} className="text-slate-400 hover:text-slate-600" aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Danh mục *</label>
                <div className="border border-slate-300 rounded-lg p-4 bg-slate-50 max-h-72 overflow-y-auto">
                  {Object.entries(categoryList.reduce<Record<string, OpenDataCategory[]>>((groups, cat) => {
                    if (!groups[cat.dataField]) {
                      groups[cat.dataField] = [];
                    }
                    groups[cat.dataField].push(cat);
                    return groups;
                  }, {})).map(([system, items]) => (
                    <div key={system} className="mb-4">
                      <div className="text-sm font-semibold text-slate-900 mb-2">{system}</div>
                      <div className="space-y-2 pl-4">
                        {items.map((cat) => (
                          <label key={cat.id} className="flex items-center gap-2 text-sm text-slate-700">
                            <input
                              type="checkbox"
                              checked={metadataFormData.categoryCodes.includes(cat.code)}
                              onChange={(e) => {
                                const selectedCodes = metadataFormData.categoryCodes.includes(cat.code)
                                  ? metadataFormData.categoryCodes.filter(code => code !== cat.code)
                                  : [...metadataFormData.categoryCodes, cat.code];
                                setMetadataFormData({ ...metadataFormData, categoryCodes: selectedCodes });
                              }}
                              className="h-4 w-4 text-emerald-600 border-slate-300 rounded"
                            />
                            <span>{cat.code} - {cat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">Chọn một hoặc nhiều danh mục cho Metadata này.</p>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả *</label>
                <textarea
                  value={metadataFormData.description}
                  onChange={(e) => setMetadataFormData({ ...metadataFormData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="Mô tả metadata cho danh mục"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Từ khóa</label>
                <input
                  type="text"
                  value={metadataFormData.keywords}
                  onChange={(e) => setMetadataFormData({ ...metadataFormData, keywords: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ví dụ: luật, dữ liệu mở"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Giấy phép *</label>
                  <select
                    value={metadataFormData.licenseId}
                    onChange={(e) => setMetadataFormData({ ...metadataFormData, licenseId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                    aria-label="Chọn giấy phép"
                    title="Chọn giấy phép"
                  >
                    {licenseEntries.map((license) => (
                      <option key={license.id} value={license.id}>
                        {license.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Định dạng</label>
                  <select
                    value={metadataFormData.format}
                    onChange={(e) => setMetadataFormData({ ...metadataFormData, format: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                    aria-label="Chọn định dạng"
                    title="Chọn định dạng"
                  >
                    <option value="CSV">CSV</option>
                    <option value="JSON">JSON</option>
                    <option value="XML">XML</option>
                    <option value="Excel">Excel</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Nguồn dữ liệu *</label>
                <input
                  type="text"
                  value={metadataFormData.source}
                  onChange={(e) => setMetadataFormData({ ...metadataFormData, source: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nhập nguồn dữ liệu"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Tần suất cập nhật</label>
                  <select
                    value={metadataFormData.frequency}
                    onChange={(e) => setMetadataFormData({ ...metadataFormData, frequency: e.target.value as MetadataItem['frequency'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                    aria-label="Tần suất cập nhật"
                    title="Tần suất cập nhật"
                  >
                    <option value="daily">Hàng ngày</option>
                    <option value="weekly">Hàng tuần</option>
                    <option value="monthly">Hàng tháng</option>
                    <option value="quarterly">Hàng quý</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                  <select
                    value={metadataFormData.status}
                    onChange={(e) => setMetadataFormData({ ...metadataFormData, status: e.target.value as MetadataItem['status'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                    aria-label="Trạng thái"
                    title="Trạng thái"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowMetadataModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={saveMetadata}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Lưu Metadata
              </button>
            </div>
          </div>
        </div>
      )}

      {/* License Modal */}
      {showLicenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {isLicenseViewOnly ? 'Xem chi tiết giấy phép' : selectedLicense ? 'Chỉnh sửa giấy phép' : 'Thêm mới giấy phép'}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Quản lý giấy phép chuẩn, điều kiện sử dụng và liên kết tham chiếu.
                </p>
              </div>
              <button onClick={() => setShowLicenseModal(false)} className="text-slate-400 hover:text-slate-600" aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Tên giấy phép *</label>
                  <input
                    type="text"
                    value={licenseFormData.name}
                    onChange={(e) => setLicenseFormData({ ...licenseFormData, name: e.target.value })}
                    disabled={isLicenseViewOnly}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="Nhập tên giấy phép"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Tên viết tắt *</label>
                  <input
                    type="text"
                    value={licenseFormData.shortName}
                    onChange={(e) => {
                      setLicenseFormData({ ...licenseFormData, shortName: e.target.value });
                      if (licenseError) setLicenseError('');
                    }}
                    disabled={isLicenseViewOnly || licenseFormData.id !== '0'}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 ${
                      licenseError ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Nhập tên viết tắt"
                  />
                  {licenseError && (
                    <p className="text-red-500 text-xs mt-1">{licenseError}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả *</label>
                <textarea
                  value={licenseFormData.description}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, description: e.target.value })}
                  disabled={isLicenseViewOnly}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
                  placeholder="Mô tả ngắn về giấy phép"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Điều kiện sử dụng *</label>
                <textarea
                  value={licenseFormData.terms}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, terms: e.target.value })}
                  disabled={isLicenseViewOnly}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
                  placeholder="Mô tả điều kiện sử dụng"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Liên kết tham chiếu *</label>
                <input
                  type="text"
                  value={licenseFormData.referenceUrl}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, referenceUrl: e.target.value })}
                  disabled={isLicenseViewOnly}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
                  placeholder="https://example.com/license/cc0"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                <select
                  value={licenseFormData.status}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, status: e.target.value as LicenseItem['status'] })}
                  disabled={isLicenseViewOnly}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
                  aria-label="Trạng thái"
                  title="Trạng thái"
                >
                  <option value="active">Còn hiệu lực</option>
                  <option value="inactive">Hết hiệu lực</option>
                </select>
              </div>
            </div>
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              {isLicenseViewOnly ? (
                <>
                  <button
                    onClick={() => setIsLicenseViewOnly(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => setShowLicenseModal(false)}
                    className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Đóng
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLicenseModal(false)}
                    className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={saveLicense}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Lưu giấy phép
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg text-slate-900">
                {activeTab === 'management' ? 'Thêm danh mục mới' : 'Thêm quy tắc cập nhật mới'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600" aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* 
                DATABASE MAPPING - Bảng: open_data_catalog
                ================================================
                - id: UUID/INT (Primary Key)
                - code: VARCHAR(50) → Mã danh mục
                - name: VARCHAR(255) → Tên danh mục
                - description: TEXT → Mô tả
                - data_field: VARCHAR(100) → Lĩnh vực
                - update_frequency: ENUM(monthly/quarterly/yearly) → Tần suất cập nhật
                - source_table_id: INT → Chọn bảng dữ liệu nguồn (Foreign Key)
                - selected_fields: JSON → Các trường dữ liệu được chọn ['f1','f2','f3']
                - attached_files: JSON/TEXT → File đính kèm
                - status: ENUM(draft/pending/published/updated/deprecated) → Trạng thái
                - publisher: VARCHAR(255) → Đơn vị công bố (default: "Bộ Tư pháp")
                - publish_date: DATE → Ngày công bố (auto khi approved)
                - last_update: TIMESTAMP → Lần cập nhật cuối
                - download_count: INT → Số lượt tải xuống (default: 0)
                - formats: JSON → Định dạng hỗ trợ ['JSON','XML','CSV','Excel']
                - created_by: UUID/INT → User ID
                - created_at: TIMESTAMP → Auto timestamp
                - updated_by: UUID/INT → User ID
                - updated_at: TIMESTAMP → Auto timestamp
              */}
              
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mã danh mục *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder={activeTab === 'management' ? 'Nhập mã danh mục (vd: ODC001)' : 'Nhập mã quy tắc (vd: ODCM01)'}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tên danh mục *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nhập tên danh mục"
                />
              </div>
              {activeTab === 'management' && (
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Phiên bản</label>
                  <input
                    type="text"
                    value={formData.version}
                    readOnly
                    disabled
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg text-sm outline-none cursor-not-allowed"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Nhập mô tả"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Đơn vị chủ trì cung cấp *</label>
                <select
                  value={formData.dataField}
                  onChange={(e) => setFormData({ ...formData, dataField: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                  aria-label="Đơn vị chủ trì cung cấp"
                  title="Đơn vị chủ trì cung cấp"
                >
                  <option value="">-- Chọn đơn vị --</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tần suất cập nhật *</label>
                <select
                  value={formData.updateFrequency}
                  onChange={(e) => setFormData({ ...formData, updateFrequency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  aria-label="Tần suất cập nhật"
                  title="Tần suất cập nhật"
                >
                  <option value="monthly">Hàng tháng</option>
                  <option value="quarterly">Hàng quý</option>
                  <option value="yearly">Hàng năm</option>
                </select>
              </div>

            </div>
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveAdd}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Lưu
              </button>
              {activeTab === 'management' && (
                <button
                  onClick={handleSendApproval}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Gửi phê duyệt
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg text-slate-900">Chi tiết danh mục</h3>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600" aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Mã danh mục</label>
                  <div className="text-sm text-slate-900">{selectedCategory.code}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Tên danh mục</label>
                  <div className="text-sm text-slate-900">{selectedCategory.name}</div>
                </div>
                {activeTab === 'management' && (
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Phiên bản</label>
                    <div className="text-sm text-slate-900">{selectedCategory.version || '1.0'}</div>
                  </div>
                )}
                <div className="col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Mô tả</label>
                  <div className="text-sm text-slate-900">{selectedCategory.description}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Đơn vị chủ trì cung cấp</label>
                  <div className="text-sm text-slate-900">{selectedCategory.dataField}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Tần suất cập nhật</label>
                  <div>{getStatusBadge(selectedCategory.updateFrequency)}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Trạng thái phê duyệt</label>
                  <div>{getApprovalStatusBadge(selectedCategory.approvalStatus)}</div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Đóng
              </button>
              {activeTab === 'management' && (
                <button
                  onClick={handleSendApproval}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Gửi phê duyệt
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg text-slate-900">Chỉnh sửa danh mục</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600" aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mã danh mục *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  aria-label="Mã danh mục"
                  title="Mã danh mục"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tên danh mục *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  aria-label="Tên danh mục"
                  title="Tên danh mục"
                />
              </div>
              {activeTab === 'management' && (
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Phiên bản</label>
                  <input
                    type="text"
                    value={formData.version}
                    readOnly
                    disabled
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg text-sm outline-none cursor-not-allowed"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  aria-label="Mô tả"
                  title="Mô tả"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Đơn vị chủ trì cung cấp *</label>
                <select
                  value={formData.dataField}
                  onChange={(e) => setFormData({ ...formData, dataField: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                  aria-label="Đơn vị chủ trì cung cấp"
                  title="Đơn vị chủ trì cung cấp"
                >
                  <option value="">-- Chọn đơn vị --</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tần suất cập nhật *</label>
                <select
                  value={formData.updateFrequency}
                  onChange={(e) => setFormData({ ...formData, updateFrequency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  aria-label="Tần suất cập nhật"
                  title="Tần suất cập nhật"
                >
                  <option value="monthly">Hàng tháng</option>
                  <option value="quarterly">Hàng quý</option>
                  <option value="yearly">Hàng năm</option>
                </select>
              </div>
            </div>
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Lưu
              </button>
              {activeTab === 'management' && (
                <button
                  onClick={handleSendApproval}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Gửi phê duyệt
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md m-4 p-6">
            <h3 className="text-lg text-slate-900 mb-4">Xác nhận xóa</h3>
            <p className="text-sm text-slate-600 mb-6">
              Bạn có chắc chắn muốn xóa danh mục <strong>{selectedCategory.name}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedCategory && approvalAction === 'approved' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl m-4">
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg text-slate-900 font-medium">Phê duyệt danh mục dữ liệu mở</h3>
              <button 
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalNote('');
                }}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Đóng"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-blue-900 mb-1">Thông tin danh mục</div>
                    <div className="text-sm text-blue-800"><strong>{selectedCategory.name}</strong></div>
                    <div className="text-xs text-blue-700 mt-1">Mã: {selectedCategory.code}</div>
                    <div className="text-xs text-blue-700 mt-1">Đơn vị chủ trì cung cấp: {selectedCategory.dataField}</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ý kiến phê duyệt
                </label>
                <textarea
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={5}
                  placeholder="Nhập ý kiến phê duyệt (nếu có)...&#10;Ví dụ: Đồng ý phê duyệt danh mục dữ liệu mở theo đề xuất của đơn vị."
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="text-xs text-slate-600 mb-2">Sau khi phê duyệt:</div>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>• Danh mục sẽ được công bố trên Cổng dữ liệu mở quốc gia</li>
                  <li>• Dữ liệu sẽ được đồng bộ và cập nhật định kỳ theo tần suất đã thiết lập</li>
                  <li>• Các cơ quan, tổ chức và công dân có thể truy cập và tải xuống dữ liệu</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalNote('');
                }}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmApprovalAction}
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showApprovalModal && selectedCategory && approvalAction === 'rejected' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl m-4">
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg text-slate-900 font-medium">Từ chối phê duyệt danh mục</h3>
              <button 
                onClick={() => {
                  setShowApprovalModal(false);
                  setRejectReason('');
                }}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Đóng"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-red-900 mb-1">Thông tin danh mục</div>
                    <div className="text-sm text-red-800"><strong>{selectedCategory.name}</strong></div>
                    <div className="text-xs text-red-700 mt-1">Mã: {selectedCategory.code}</div>
                    <div className="text-xs text-red-700 mt-1">Lĩnh vực: {selectedCategory.dataField}</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={5}
                  placeholder="Nhập lý do từ chối phê duyệt...&#10;Ví dụ: Danh mục chưa đầy đủ thông tin về cấu trúc dữ liệu. Đề nghị bổ sung các trường dữ liệu bắt buộc theo quy định."
                />
                {rejectReason.trim() === '' && (
                  <p className="text-xs text-red-600 mt-1">Vui lòng nhập lý do từ chối</p>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div className="text-xs text-amber-800">
                    Sau khi từ chối, danh mục sẽ được trả lại cho đơn vị để chỉnh sửa và trình lại.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmApprovalAction}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Ban className="w-4 h-4" />
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit for Approval Modal (kept for management tab) */}
      {showApprovalModal && selectedCategory && approvalAction === 'pending' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg m-4">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg text-slate-900">Trình duyệt danh mục</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="text-sm text-slate-600">Danh mục</div>
                <div className="text-sm text-slate-900 mt-1"><strong>{selectedCategory.name}</strong></div>
                <div className="text-xs text-slate-500 mt-1">Mã: {selectedCategory.code}</div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Người phê duyệt <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedApprover}
                  onChange={(e) => setSelectedApprover(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  aria-label="Chọn người phê duyệt"
                  title="Chọn người phê duyệt"
                >
                  <option value="">-- Chọn người phê duyệt --</option>
                  {approvers.map(approver => (
                    <option key={approver.id} value={approver.id}>
                      {approver.name} - {approver.position}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Nội dung trình duyệt
                </label>
                <textarea
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  rows={4}
                  placeholder="Nhập nội dung trình duyệt...&#10;Ví dụ: Đề nghị Lãnh đạo xem xét phê duyệt danh mục dữ liệu mở theo Nghị định 47/2020/NĐ-CP"
                />
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedApprover('');
                  setApprovalNote('');
                }}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmApprovalAction}
                disabled={!selectedApprover}
                className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Gửi phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}