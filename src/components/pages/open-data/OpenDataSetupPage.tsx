import { useState } from 'react';
import { Plus, Search, Settings, Eye, Edit, Trash2, Save, X, CheckSquare, Share2, FileSearch, BarChart3, Filter, XCircle, Globe, Send, Check, Ban, Upload, Paperclip, RefreshCw, Clock, FileText, AlertCircle, Shield } from 'lucide-react';

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
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected';
  createdDate: string;
  updatedDate: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  customFields?: DataField[];
}

const mockCategories: OpenDataCategory[] = [
  {
    id: '1',
    code: 'ODC001',
    name: 'Danh mục dữ liệu A',
    description: 'Dữ liệu thống kê về lĩnh vực A',
    dataField: 'Lĩnh vực A',
    updateFrequency: 'monthly',
    dataFormat: ['JSON', 'CSV', 'XML'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2024',
    updatedDate: '10/12/2024'
  },
  {
    id: '2',
    code: 'ODC002',
    name: 'Danh mục dữ liệu B',
    description: 'Dữ liệu thống kê về lĩnh vực B',
    dataField: 'Lĩnh vực B',
    updateFrequency: 'quarterly',
    dataFormat: ['JSON', 'Excel'],
    status: 'pending',
    approvalStatus: 'pending',
    createdDate: '15/02/2024',
    updatedDate: '08/12/2024'
  },
  {
    id: '3',
    code: 'ODC003',
    name: 'Danh mục dữ liệu C',
    description: 'Dữ liệu thống kê về lĩnh vực C',
    dataField: 'Lĩnh vực C',
    updateFrequency: 'yearly',
    dataFormat: ['JSON', 'CSV'],
    status: 'rejected',
    approvalStatus: 'rejected',
    createdDate: '20/03/2024',
    updatedDate: '05/12/2024'
  },
];

// Mock data for Update Rules tab
const mockUpdateRules: OpenDataCategory[] = [
  {
    id: 'ur1',
    code: 'ODCM01',
    name: 'Quy tắc cập nhật danh mục A',
    description: 'Cập nhật tự động hàng tháng',
    dataField: 'Tư pháp',
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
    dataField: 'Công chứng',
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
    dataField: 'Hộ tịch',
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
    dataField: 'TGPL',
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
    dataField: 'Văn bản pháp luật',
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
    dataField: 'Đăng ký kinh doanh',
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
    dataField: 'Công chứng',
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
    dataField: 'Hộ tịch',
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
    dataField: 'TGPL',
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
    dataField: 'Luật sư',
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
    description: 'Cho phép sử dụng và phân phối dữ liệu mở.',
    terms: 'Ghi nguồn là bắt buộc.',
    referenceUrl: 'https://example.com/license/cc0',
    status: 'active'
  },
  {
    id: 'l2',
    name: 'Giấy phép ODC-BY',
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
  const [activeTab, setActiveTab] = useState<'management' | 'approval' | 'history' | 'metadata' | 'license'>('management');
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
  const [licenseFormData, setLicenseFormData] = useState<LicenseItem>({
    id: '0',
    name: '',
    description: '',
    terms: '',
    referenceUrl: '',
    status: 'active'
  });
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
    if (item) {
      setSelectedLicense(item);
      setLicenseFormData(item);
    } else {
      setSelectedLicense(null);
      setLicenseFormData({
        id: '0',
        name: '',
        description: '',
        terms: '',
        referenceUrl: '',
        status: 'active'
      });
    }
    setShowLicenseModal(true);
  };

  const saveLicense = () => {
    if (!licenseFormData.name || !licenseFormData.description || !licenseFormData.terms || !licenseFormData.referenceUrl) {
      return;
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
    selectedFields: [] as string[]
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
    return matchSearch;
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
      selectedFields: []
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
      selectedFields: []
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
      status: 'pending',
      approvalStatus: 'pending',
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
          ? { ...c, ...formData, updatedDate: new Date().toLocaleDateString('vi-VN') }
          : c
      ));
      setShowEditModal(false);
      setSelectedCategory(null);
    }
  };

  const handleSendApproval = () => {
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
      pending: 'bg-purple-100 text-purple-700 border-purple-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    const labels = {
      pending: 'Hàng tháng',
      approved: 'Hoạt động',
      rejected: 'Ngừng hoạt động'
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="border-b border-slate-200">
          <div className="flex px-6">
            <button
              onClick={() => setActiveTab('management')}
              className={`px-4 py-3 text-sm transition-all relative ${
                activeTab === 'management'
                  ? 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Quản lý danh mục
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                activeTab === 'management' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {categories.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('approval')}
              className={`px-4 py-3 text-sm transition-all relative ${
                activeTab === 'approval'
                  ? 'text-purple-700 border-b-2 border-purple-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Phê duyệt
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                activeTab === 'approval' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {approvalList.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('metadata')}
              className={`px-4 py-3 text-sm transition-all relative ${
                activeTab === 'metadata'
                  ? 'text-slate-700 border-b-2 border-slate-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Metadata
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                activeTab === 'metadata' ? 'bg-slate-100 text-slate-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {metadataEntries.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('license')}
              className={`px-4 py-3 text-sm transition-all relative ${
                activeTab === 'license'
                  ? 'text-slate-700 border-b-2 border-slate-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Giấy phép
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                activeTab === 'license' ? 'bg-slate-100 text-slate-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {licenseEntries.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-3 text-sm transition-all relative ${
                activeTab === 'history'
                  ? 'text-gray-700 border-b-2 border-gray-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lịch sử thay đổi
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                activeTab === 'history' ? 'bg-gray-100 text-gray-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {historyList.length}
              </span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'approval' ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-orange-700 mb-1">Chờ phê duyệt</div>
                      <div className="text-2xl font-semibold text-orange-600">{approvalStats.pending}</div>
                    </div>
                    <Clock className="w-10 h-10 text-orange-400" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-green-700 mb-1">Đã phê duyệt</div>
                      <div className="text-2xl font-semibold text-green-600">{approvalStats.approved}</div>
                    </div>
                    <CheckSquare className="w-10 h-10 text-green-400" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-red-700 mb-1">Từ chối</div>
                      <div className="text-2xl font-semibold text-red-600">{approvalStats.rejected}</div>
                    </div>
                    <XCircle className="w-10 h-10 text-red-400" />
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="bg-white border border-slate-200 rounded-lg mb-6">
                <div className="flex items-center gap-1 p-1">
                  <button
                    onClick={() => setApprovalFilterTab('all')}
                    className={`flex-1 px-4 py-2 text-sm rounded transition-all ${
                      approvalFilterTab === 'all'
                        ? 'bg-slate-100 text-slate-900 font-medium'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tất cả
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                      approvalFilterTab === 'all' ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {approvalList.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setApprovalFilterTab('pending')}
                    className={`flex-1 px-4 py-2 text-sm rounded transition-all ${
                      approvalFilterTab === 'pending'
                        ? 'bg-orange-50 text-orange-700 font-medium'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Chờ phê duyệt
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                      approvalFilterTab === 'pending' ? 'bg-orange-200 text-orange-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {approvalStats.pending}
                    </span>
                  </button>
                  <button
                    onClick={() => setApprovalFilterTab('approved')}
                    className={`flex-1 px-4 py-2 text-sm rounded transition-all ${
                      approvalFilterTab === 'approved'
                        ? 'bg-green-50 text-green-700 font-medium'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Đã phê duyệt
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                      approvalFilterTab === 'approved' ? 'bg-green-200 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {approvalStats.approved}
                    </span>
                  </button>
                  <button
                    onClick={() => setApprovalFilterTab('rejected')}
                    className={`flex-1 px-4 py-2 text-sm rounded transition-all ${
                      approvalFilterTab === 'rejected'
                        ? 'bg-red-50 text-red-700 font-medium'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Từ chối
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                      approvalFilterTab === 'rejected' ? 'bg-red-200 text-red-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {approvalStats.rejected}
                    </span>
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, mã danh mục..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Cards Layout */}
              <div className="grid grid-cols-1 gap-4">
                {filteredApprovalList.map((category) => (
                  <div key={category.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-base font-medium text-slate-900">{category.name}</h3>
                          {category.approvalStatus === 'pending' && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                              Chờ phê duyệt
                            </span>
                          )}
                          {category.approvalStatus === 'approved' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                              Đã phê duyệt
                            </span>
                          )}
                          {category.approvalStatus === 'rejected' && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                              Từ chối
                            </span>
                          )}
                        </div>
                        <code className="px-2 py-0.5 bg-slate-100 text-emerald-700 rounded text-xs">
                          {category.code}
                        </code>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-slate-600 text-xs mb-1">Cơ quan quản lý</div>
                        <div className="text-slate-900">Bộ Tư pháp</div>
                      </div>
                      <div>
                        <div className="text-slate-600 text-xs mb-1">Loại dữ liệu</div>
                        <div className="text-slate-900">{category.dataField}</div>
                      </div>
                      <div>
                        <div className="text-slate-600 text-xs mb-1">Người gửi</div>
                        <div className="text-slate-900">Nguyễn Văn A</div>
                      </div>
                      <div>
                        <div className="text-slate-600 text-xs mb-1">Ngày gửi</div>
                        <div className="text-slate-900">{category.createdDate}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">
                        12 thuộc tính
                      </span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs border border-purple-200">
                        3 quan hệ
                      </span>
                      <span className="px-2 py-1 bg-pink-50 text-pink-700 rounded text-xs border border-pink-200">
                        2 đính kèm
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                      <button 
                        onClick={() => handleView(category)}
                        className="px-3 py-1.5 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Xem chi tiết
                      </button>
                      {category.approvalStatus === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleReject(category)}
                            className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 flex items-center gap-1.5"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            Từ chối
                          </button>
                          <button 
                            onClick={() => handleApprove(category)}
                            className="px-3 py-1.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Phê duyệt
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Search & Filter with Add Button */}

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                {activeTab === 'history' ? (
                  <div className="grid grid-cols-5 gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        placeholder="Từ ngày"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        placeholder="Đến ngày"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <select
                        value={changeTypeFilter}
                        onChange={(e) => setChangeTypeFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Tất cả loại thay đổi</option>
                        <option value="create_category">Tạo danh mục</option>
                        <option value="edit_category">Chỉnh sửa DM</option>
                        <option value="grant_permission">Cấp quyền</option>
                        <option value="add_metadata">Thêm metadata</option>
                        <option value="edit_metadata">Sửa metadata</option>
                        <option value="add_license">Thêm giấy phép</option>
                      </select>
                    </div>
                    <div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Tất cả trạng thái</option>
                        <option value="applied">Đã áp dụng</option>
                        <option value="pending">Chờ xử lý</option>
                      </select>
                    </div>
                  </div>
                ) : activeTab === 'metadata' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm metadata..."
                        value={searchMetadata}
                        onChange={(e) => setSearchMetadata(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <select
                        value={metadataFrequencyFilter}
                        onChange={(e) => setMetadataFrequencyFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="all">Tất cả tần suất</option>
                        <option value="daily">Hàng ngày</option>
                        <option value="weekly">Hàng tuần</option>
                        <option value="monthly">Hàng tháng</option>
                        <option value="quarterly">Hàng quý</option>
                        <option value="yearly">Hàng năm</option>
                      </select>
                    </div>
                    <div>
                      <select
                        value={metadataFieldFilter}
                        onChange={(e) => setMetadataFieldFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="all">Tất cả lĩnh vực</option>
                        {allFields.map((field, idx) => (
                          <option key={idx} value={field}>{field}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="px-4 py-2 w-full lg:w-auto bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2"
                        onClick={() => openMetadataModal()}
                      >
                        <Plus className="w-4 h-4" />
                        Thêm mới
                      </button>
                    </div>
                  </div>
                ) : activeTab === 'license' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm giấy phép..."
                        value={searchLicense}
                        onChange={(e) => setSearchLicense(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <select
                        value={licenseStatusFilter}
                        onChange={(e) => setLicenseStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Còn hiệu lực</option>
                        <option value="inactive">Hết hiệu lực</option>
                      </select>
                    </div>
                    <div className="flex justify-end md:col-start-3">
                      <button
                        type="button"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                        onClick={() => openLicenseModal()}
                      >
                        <Plus className="w-4 h-4" />
                        Thêm mới
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, mã danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    {activeTab === 'management' && (
                      <div className="flex justify-end">
                        <button 
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                          onClick={handleAdd}
                        >
                          <Plus className="w-4 h-4" />
                          Thêm danh mục mới
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">STT</th>
                  {activeTab === 'history' ? (
                    <>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Phiên bản</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Ngày thay đổi</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Người thay đổi</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Danh mục</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Loại thay đổi</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Nội dung thay đổi</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Thao tác</th>
                    </>
                  ) : activeTab === 'metadata' ? (
                    <>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Tập dữ liệu</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Mô tả</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Giấy phép</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Định dạng</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Tần suất</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Thao tác</th>
                    </>
                  ) : activeTab === 'license' ? (
                    <>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Tên giấy phép</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Mô tả</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Điều kiện sử dụng</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Thao tác</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Mã danh mục</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Tên danh mục</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Lĩnh vực</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Tần suất cập nhật</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Thao tác</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeTab === 'history' ? (
                  filteredHistory.map((record, index) => (
                    <tr key={record.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3">
                        <code className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                          {record.version}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{record.timestamp}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{record.user}</td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm text-slate-900">{record.name}</div>
                          <code className="text-xs text-slate-500">{record.code}</code>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {record.changeType === 'create_category' && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            Tạo danh mục
                          </span>
                        )}
                        {record.changeType === 'edit_category' && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            Chỉnh sửa DM
                          </span>
                        )}
                        {record.changeType === 'grant_permission' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                            Cấp quyền
                          </span>
                        )}
                        {record.changeType === 'add_metadata' && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                            Thêm metadata
                          </span>
                        )}
                        {record.changeType === 'edit_metadata' && (
                          <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs font-medium">
                            Sửa metadata
                          </span>
                        )}
                        {record.changeType === 'add_license' && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                            Thêm giấy phép
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-700 max-w-md">{record.changeContent}</div>
                      </td>
                      <td className="px-4 py-3">
                        {record.status === 'applied' && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            Đã áp dụng
                          </span>
                        )}
                        {record.status === 'pending' && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                            Chờ xử lý
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleView(record as any)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" 
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => alert(`Tải xuống phiên bản ${record.version}`)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded" 
                            title="Tải xuống"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => alert(`Khôi phục về phiên bản ${record.version}`)}
                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded" 
                            title="Khôi phục"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'metadata' ? (
                  filteredMetadataEntries.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 mt-1 max-w-[200px]">
                          {item.categoryCodes.map(code => (
                            <code key={code} className="px-2 py-0.5 bg-slate-100 text-emerald-700 rounded text-xs">{code}</code>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-900">{item.description}</div>
                        <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-1">
                          Từ khóa: {item.keywords.split(',').map((k, i) => k.trim() && <span key={i} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px]">{k.trim()}</span>)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100">{getLicenseName(item.licenseId)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">{item.format}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {item.frequency === 'daily' ? 'Hàng ngày' : item.frequency === 'weekly' ? 'Hàng tuần' : item.frequency === 'monthly' ? 'Hàng tháng' : 'Hàng quý'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                          {item.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => openMetadataModal(item)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" 
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'license' ? (
                  filteredLicenseEntries.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-slate-900">{item.name}</div>
                        <a href={item.referenceUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 hover:underline flex items-center gap-1 mt-1 block w-max">
                          <Globe className="w-3 h-3" /> Nguồn tham chiếu
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-700">{item.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-600 max-w-[200px] truncate" title={item.terms}>{item.terms}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                          {item.status === 'active' ? 'Còn hiệu lực' : 'Hết hiệu lực'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => openLicenseModal(item)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" 
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredCategories.map((category, index) => (
                  <tr key={category.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3">
                      <code className="px-2 py-0.5 bg-slate-100 text-emerald-700 rounded text-xs">
                        {category.code}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      {activeTab === 'management' ? (
                        <button 
                          onClick={() => handleCategoryClick(category)}
                          className="text-left w-full hover:bg-transparent"
                        >
                          <div className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer">
                            {category.name}
                          </div>
                          <div className="text-xs text-slate-500">{category.description}</div>
                        </button>
                      ) : (
                        <div>
                          <div className="text-sm text-slate-900">{category.name}</div>
                          <div className="text-xs text-slate-500">{category.description}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">{category.dataField}</td>
                    <td className="px-4 py-3">{getStatusBadge(category.updateFrequency)}</td>
                    <td className="px-4 py-3">{getApprovalStatusBadge(category.approvalStatus)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleView(category)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" 
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(category)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" 
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded" 
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {activeTab === 'management' && category.approvalStatus === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleSubmitForApproval(category)}
                              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded" 
                              title="Trình duyệt"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleApprove(category)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded" 
                              title="Duyệt"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleReject(category)}
                              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded" 
                              title="Từ chối duyệt"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
            </>
          )}
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
              <button onClick={() => setShowMetadataModal(false)} className="text-slate-400 hover:text-slate-600">
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
                  {selectedLicense ? 'Chỉnh sửa giấy phép' : 'Thêm mới giấy phép'}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Quản lý giấy phép chuẩn, điều kiện sử dụng và liên kết tham chiếu.
                </p>
              </div>
              <button onClick={() => setShowLicenseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tên giấy phép *</label>
                <input
                  type="text"
                  value={licenseFormData.name}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nhập tên giấy phép"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả *</label>
                <textarea
                  value={licenseFormData.description}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="Mô tả ngắn về giấy phép"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Điều kiện sử dụng *</label>
                <textarea
                  value={licenseFormData.terms}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, terms: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="Mô tả điều kiện sử dụng"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Liên kết tham chiếu *</label>
                <input
                  type="text"
                  value={licenseFormData.referenceUrl}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, referenceUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://example.com/license/cc0"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                <select
                  value={licenseFormData.status}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, status: e.target.value as LicenseItem['status'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="active">Còn hiệu lực</option>
                  <option value="inactive">Hết hiệu lực</option>
                </select>
              </div>
            </div>
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowLicenseModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={saveLicense}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Lưu giấy phép
              </button>
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
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
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
                <label className="block text-sm text-slate-700 mb-2">Lĩnh vực *</label>
                <input
                  type="text"
                  value={formData.dataField}
                  onChange={(e) => setFormData({ ...formData, dataField: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nhập lĩnh vực"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tần suất cập nhật *</label>
                <select
                  value={formData.updateFrequency}
                  onChange={(e) => setFormData({ ...formData, updateFrequency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="monthly">Hàng tháng</option>
                  <option value="quarterly">Hàng quý</option>
                  <option value="yearly">Hàng năm</option>
                </select>
              </div>

              {/* Table Selection - Maps to: source_table_id (INT) */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">Chọn bảng dữ liệu nguồn *</label>
                <select
                  value={formData.selectedTable}
                  onChange={(e) => setFormData({ ...formData, selectedTable: e.target.value, selectedFields: [] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Chọn bảng dữ liệu --</option>
                  {mockDatabaseTables.map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.displayName} ({table.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Field Selection - Maps to: selected_fields (JSON) */}
              {formData.selectedTable && (
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Chọn các trường dữ liệu *
                    <span className="ml-2 text-xs text-slate-500">
                      ({formData.selectedFields.length} trường đã chọn)
                    </span>
                  </label>
                  <div className="border border-slate-300 rounded-lg p-3 max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {mockTableFields[formData.selectedTable]?.map((field) => (
                        <label
                          key={field.id}
                          className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.selectedFields.includes(field.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  selectedFields: [...formData.selectedFields, field.id]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  selectedFields: formData.selectedFields.filter(id => id !== field.id)
                                });
                              }
                            }}
                            className="mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-900">{field.name}</span>
                              <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {field.type}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 mt-0.5">{field.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    
                    {/* Select All / Deselect All */}
                    <div className="border-t border-slate-200 mt-3 pt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const allFieldIds = mockTableFields[formData.selectedTable]?.map(f => f.id) || [];
                          setFormData({ ...formData, selectedFields: allFieldIds });
                        }}
                        className="text-xs text-emerald-600 hover:text-emerald-700 px-2 py-1 hover:bg-emerald-50 rounded"
                      >
                        Chọn tất cả
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, selectedFields: [] })}
                        className="text-xs text-slate-600 hover:text-slate-700 px-2 py-1 hover:bg-slate-50 rounded"
                      >
                        Bỏ chọn tất cả
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* File Attachment Section - Maps to: attached_files (JSON/TEXT) */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">File đính kèm</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-emerald-500 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setAttachedFiles([...attachedFiles, ...Array.from(e.target.files)]);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-slate-400" />
                    <div className="text-sm text-slate-600">
                      <span className="text-emerald-600 hover:text-emerald-700">Nhấn để chọn file</span> hoặc kéo thả file vào đây
                    </div>
                    <div className="text-xs text-slate-500">Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX (Tối đa 10MB)</div>
                  </label>
                </div>

                {/* Attached Files List */}
                {attachedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {attachedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Paperclip className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-sm text-slate-700 truncate">{file.name}</span>
                          <span className="text-xs text-slate-500 flex-shrink-0">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== index))}
                          className="p-1 text-red-600 hover:bg-red-50 rounded flex-shrink-0"
                          title="Xóa file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600">
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
                <div className="col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Mô tả</label>
                  <div className="text-sm text-slate-900">{selectedCategory.description}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Lĩnh vực</label>
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
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
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
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tên danh mục *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Lĩnh vực *</label>
                <input
                  type="text"
                  value={formData.dataField}
                  onChange={(e) => setFormData({ ...formData, dataField: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tần suất cập nhật *</label>
                <select
                  value={formData.updateFrequency}
                  onChange={(e) => setFormData({ ...formData, updateFrequency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
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
                    <div className="text-xs text-blue-700 mt-1">Lĩnh vực: {selectedCategory.dataField}</div>
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